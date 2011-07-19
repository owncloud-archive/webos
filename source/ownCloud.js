//
// This file is part of the ownCloud webOS app.
//
// @author Aaron Reichman
// @copyright 2011 Aaron Reichman areichman.kde@gmail.com
// 
// The ownCloud webOS app is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// The ownCloud webOS app is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with the ownCloud webOS app.  If not, see <http://www.gnu.org/licenses/>.
//

enyo.kind
(
	{
		name: "ownCloud",
		kind: enyo.VFlexBox,
		components:
		[
			{
				name: "mainPane",
				kind: "Pane",
				transitionKind: "enyo.transitions.LeftRightFlyin",
				onLogin: "logmein",
				flex: 1,
				components:
				[
					{
						kind: "LoginView",
						name: "loginView",
						onLogin: "logmein"
					},
					{
						kind: "FileView",
						name: "fileView"
					}
				],
			},
			{
				kind: "AppMenu",
				components:
				[
					{caption: "Login View", onclick: "gotologin"},
					{caption: "File View", onclick: "gotofile"}
				]
			}
		],
		gotologin: function(inSender, e)
		{
			this.$.mainPane.selectViewByName("loginView");
		},
		gotofile: function(inSender, e)
		{
			this.$.mainPane.selectViewByName("fileView");
		},
		openAppMenuHandler: function()
		{
			this.$.appMenu.open();
		},
		closeAppMenuHandler: function()
		{
			this.$.appMenu.close();
		},
		logmein: function(inSender)
		{
			
			this.$.mainPane.selectViewByName("fileView");
		}
	}
);
