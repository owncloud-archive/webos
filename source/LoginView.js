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
				name: "sessions",
				lazy: true,
				components:
				[
					{caption: "Manage Sessions", name: "managesessionsbut", onclick: "instanceManage"}
				],
				setActiveSession: function(inSender)
				{
					this.owner.$.activesession.setCaption("Session: " + inSender.caption);
				}
			},
			{
				kind: "Menu",
				name: "managesessions",
				lazy: true,
				components:
				[
					{caption: "New Session", onclick: "newInstance"}
				],
				deleteInstance: function(inSender)
				{
					this.owner.deleteInstance(inSender);
				}
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
					{kind: "Button", name: "activesession", caption: "Session: None", onclick:"showMenu"}
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
								name: "serverlocation",
								hint: "Server Location",
								flex: 1
							},
							{
								kind: "Button",
								caption: "OK",
								onclick: "addInstance"
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
		ready: function(){
			// Open and create the HTML5 DB and initialize tables
			this.$.db = openDatabase("ownCloudDB", "1.0", "ownCloudDB", 5000);
			this.$.db.transaction(function(tx){
				tx.executeSql("CREATE TABLE IF NOT EXISTS sessions (id_unique, session_name)");
			});
			//Initialize session menus with stored sessions
			var hashRef = this.$;
			this.$.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM sessions', [], function (tx, results) {
					var len = results.rows.length;
						for (x = 0; x < len; x++){
							hashRef.sessions.createComponent(
								{name: results.rows.item(x).session_name, caption: results.rows.item(x).session_name, onclick: "setActiveSession"}
							);
							hashRef.managesessions.createComponent(
								{
									caption: results.rows.item(x).session_name,
									components:[{kind: "Button", name: results.rows.item(x).session_name, caption: "Delete", onclick:"deleteInstance"}]
								}
							);
						}
				});
			});
			this.$.sessions.validateComponents();
			this.$.managesessions.validateComponents();
		},
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
			//Call this.$.sessions.render to make sure that added components are in DOM
			this.$.sessions.render();
			this.$.sessions.openAtCenter();
		},
		newInstance: function(inSender)
		{
			this.$.newinstance.open();
		},
		confirmClick: function(inSender)
		{
			this.$.newinstance.close();
		},
		instanceManage: function(inSender)
		{
			this.$.sessions.close();
			this.$.managesessions.render();
			this.$.managesessions.openAtCenter();
		},
		deleteInstance: function(inSender)
		{
			var componentname = inSender.getName();
			this.$.db.transaction(function(tx){
				tx.executeSql("DELETE FROM sessions WHERE id_unique='"+componentname+"'");
			}); 
			var sessions = this.$.sessions.getComponents();
			var mansessions = this.$.managesessions.getComponents();
			for(var i=0;i<sessions.length;i++)
				if(sessions[i].name == componentname){
					sessions[i].destroy();
					mansessions[i].destroy();
				}
			if(("Session: " + componentname) == this.$.activesession.getCaption())
				this.$.activesession.setCaption('Session: None');

			this.$.sessions.validateComponents();
			this.$.managesessions.validateComponents();
			this.$.managesessions.render();
			this.$.sessions.render();
		},
		addInstance: function(inSender)
		{
			var servername = this.$.serverlocation.getValue();
			this.$.db.transaction(function(tx){
				tx.executeSql("INSERT INTO sessions VALUES ('"+servername+"','"+servername+"')");
			});
			this.$.sessions.createComponent(
				{name: servername, caption: servername, onclick: "setActiveSession"}
			);
			this.$.managesessions.createComponent(
				{caption: servername, components:[{kind: "Button", name: servername, caption: "Delete", onclick:"deleteInstance"}]}
			);
			this.$.newinstance.close();
			this.$.managesessions.validateComponents();
			this.$.sessions.validateComponents();
		}
	}
)
