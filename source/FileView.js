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
		name: "FileView",
		kind: "enyo.VFlexBox",
		components:
		[
			{
				kind: "PageHeader",
				content: "ownCloud > Files"
			},
			{
				kind: "VirtualList",
				flex: 1,
				onSetupRow: "setupRow",
				components:
				[
					{
						kind: "Item",
						layoutKind: "HFlexLayout",
						components:
						[
							{
								name: "caption",
								flex: 1,
							},
							{
								kind: "Button",
								name: "View"
							},
							{
								kind: "Button",
								name: "Download",
								onclick: "buttonClick"
							}
						]
					}
				]
			}
		],
		create: function()
		{
			this.inherited(arguments);
			this.fileList = [];
		},
		getFileList: function(url)
	 	{

			var xmlhttp;
			var xmlobject;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==207)
				{
					list = xmlhttp.responseXML.documentElement.getElementsByTagName("response");
				}
				else if (xmlhttp.readyState==4 && xmlhttp.status!==207)
				{
					alert("Ready state: " + xmlhttp.readyState + "\nStatus: " + xmlhttp.status);
				}
			}

			if(url == "")
			{
				url = "http://192.168.0.8/owncloud/files/webdav.php/";
			}

			xmlhttp.open("PROPFIND",url ,false, "test", "test");
			xmlhttp.setRequestHeader("Content-type", "text/xml");
			xmlhttp.setRequestHeader("Depth", "infinity");
			xmlhttp.send();

			for(i=0; i<list.length; i++)
			{
				this.fileList[i] = list.item(i);
			}
			this.setupRow();
		},
		setupRow: function(inSender, inIndex)
		{
			if(this.fileList.length == 0){
				this.getFileList("");
			}

 			if( (inIndex >= 0) && (inIndex < this.fileList.length) )
			{
				var str=decodeURIComponent(this.fileList[inIndex].firstChild.firstChild.nodeValue);
				this.$.caption.setContent(str.substr(27));
				this.$.View.setCaption("View File");
				this.$.Download.setCaption("Download");
				return true;
			}
		}
	}
);
