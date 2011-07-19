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
		name: "LoginView",
		kind: enyo.VFlexBox,
		events:
		{
			onLogin: ""
		},
		components:
		[
			{
				kind: "PageHeader",
				content: "ownCloud > Login"
			},
			{
				kind: "Image",
				className: "logo",
				src: "images/logo-owncloud.png"
			},
			{
				kind: "Input",
				name: "username",
				autocorrect: false,
				
				className: "centered",
				hint: "Username"
			},
			{
				kind: "PasswordInput",
				name: "password",
				className: "centered",
				hint: "Password"
			},
			{
				kind: "Menu",
				components:
				[
					{caption: "Session 1"},
					{caption: "Session 2"},
					{caption: "Session 3"}
				]
			},
			{
				kind: "LabeledContainer",
				flex: 1,
				className: "centered",
				label: "A personal cloud server that you control"
			},
			{
				kind: "Toolbar",
				components:
				[
					{kind: "Button", caption: "Login", onclick: "loginhandler"},
					{kind: "Button", caption: "Add new ownCloud instance", onclick: "newInstance"},
					{kind: "Button", caption: "Session", onclick: "showMenu"}
				]
			},
			{
				kind: "Dialog",
				name: "newinstance",
				components:
				[
					{
						kind: "LabeledContainer",
						label: "Add new ownCloud Instance",
						inputType: "url",
						className: "centered"
					},
					{
						layoutKind: "HFlexLayout",
						components:
						[
							{
								kind: "Input",
								hint: "Server Location",
								flex: 1
							},
							{
								kind: "Button",
								caption: "OK"
							},
							{
								kind: "Button",
								caption: "Cancel",
								onclick: "confirmClick"
							}
						]
					}
				]
			},
			{
				kind: "Dialog",
				name: "loginFailed",
				components:
				[
					{
						kind: "LabeledContainer",
						className: "centered",
						label: "Incorrect username/password for server. Please try again."
					}
				]
			},
		],
		loginhandler: function(inSender, e)
		{
			var loggedin=0;
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==207)
				{
// 					alert("Correct response codes");
					loggedin=1;
// 					alert("Correct response codes and\nloggedin="+loggedin);
				}
				else
				{
// 					alert("Ready state: " + xmlhttp.readyState + "\nStatus: " + xmlhttp.status);
				}
			}
			xmlhttp.open("PROPFIND","http://gleighton.nl/owncloud/files/webdav.php/",false, this.$.username.getValue(),this.$.password.getValue());
			xmlhttp.setRequestHeader("Content-type", "text/xml");
			xmlhttp.setRequestHeader("Depth", "infinity");
			xmlhttp.send();
			if(loggedin==1)
			{
// 				alert(this.$.username.getValue() + ";" + this.$.password.getValue());
				this.doLogin();
			}
			else
			{
				alert(this.$.username.getValue() + ";" + this.$.password.getValue());
				this.$.loginFailed.open();
			}
		},
		showMenu: function(inSender)
		{
			this.$.menu.openAtCenter();
		},
		newInstance: function(inSender)
		{
			this.$.newinstance.open();
		},
		confirmClick: function(inSender)
		{
			this.$.dialog.close();
		}
	}
)