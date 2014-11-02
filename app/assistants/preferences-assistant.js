function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function() {
	this.controller.setupWidget(Mojo.Menu.appMenu,
		this.attributes = {
			omitDefaultItems: false
		},
		this.model = {
			visible: true,
			items: [
				{
					label: $L("Show Help"),
					command: "togglehelp",
					shortcut: "h",
					disabled: false
				},
			]
		}
	);
	
	toggle1Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle1Model = {value: REFRESHONSTART, disabled: false};
	this.controller.setupWidget('toggle1', toggle1Attr, toggle1Model);
	this.controller.listen('toggle1',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle2Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle2Model = {value: REFRESHONADD, disabled: false};
	this.controller.setupWidget('toggle2', toggle2Attr, toggle2Model);
	this.controller.listen('toggle2',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle3Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle3Model = {value: AUTOREFRESH, disabled: false};
	this.controller.setupWidget('toggle3', toggle3Attr, toggle3Model);
	this.controller.listen('toggle3',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	this.controller.listen('toggle3',Mojo.Event.propertyChange,this.toggleChanged2.bind(this));
	
	if(AUTOREFRESH) {
		this.controller.get('autorefresh1row').show();
		this.controller.get('autorefresh2row').show();
	}
	
	selector1Model = { choice: AUTOREFRESHINTERVALL };
	this.controller.listen('selector1', Mojo.Event.propertyChange, this.selector1Changed.bindAsEventListener(this));
	this.controller.setupWidget('selector1', {label: $L("Interval"), choices: [], modelProperty:'choice'}, selector1Model);
	selector1Model.choices = [
		{ label: $L("5 minutes"), value:"300" },
		{ label: $L("10 minutes"), value:"600" },
		{ label: $L("30 minutes"), value:"1800" },
		{ label: $L("1 hour"), value:"3600" },
		{ label: $L("2 hours"), value:"7200" },
		{ label: $L("6 hours"), value:"21600" },
	];
	this.controller.modelChanged(selector1Model);

	toggle4Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle4Model = {value: NOTIFYMESSAGE, disabled: false};
	this.controller.setupWidget('toggle4', toggle4Attr, toggle4Model);
	this.controller.listen('toggle4',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	if(NOTIFYMESSAGE) {
		this.controller.get('notify1row').show();
	}

	this.controller.get('currentringtone').update(NOTIFYRINGTONENAME);
	var tmpChoice = 3;
	if(NOTIFYVIBRATE)
		tmpChoice = 0;
	if(NOTIFYSOUND)
		tmpChoice = 1;
	if(NOTIFYRINGTONE) {
		if(NOTIFYMESSAGE)
			this.controller.get('currentringtonerow').show();
		tmpChoice = 2;
	}

	selector2Model = { choice: tmpChoice };
	this.controller.listen('selector2', Mojo.Event.propertyChange, this.selector2Changed.bindAsEventListener(this));
	this.controller.setupWidget('selector2', {label: $L("Notification"), choices: [], modelProperty:'choice'}, selector2Model);
	selector2Model.choices = [
		{ label: $L("Vibrate"), value:"0" },
		{ label: $L("System Sound"), value:"1" },
		{ label: $L("Ringtone"), value:"2" },
		{ label: $L("Mute"), value:"3" },
	];
	this.controller.modelChanged(selector2Model);
	
	selector3Model = { choice: AUTOSORT };
	this.controller.listen('selector3', Mojo.Event.propertyChange, this.selector3Changed.bindAsEventListener(this));
	this.controller.setupWidget('selector3', {label: $L("Sort"), choices: [], modelProperty:'choice'}, selector3Model);
	selector3Model.choices = [
		{ label: $L("Manual"), value:"0" },
		{ label: $L("Name"), value:"1" },
		{ label: $L("Status"), value:"3" },
		{ label: $L("Updated"), value:"5" },
		{ label: $L("Service"), value:"7" },
		{ label: $L("Created"), value:"9" },
		{ label: $L("Modified"), value:"11" },
	];
	this.controller.modelChanged(selector3Model);

	selector4Model = { choice: LISTDATE };
	this.controller.listen('selector4', Mojo.Event.propertyChange, this.selector4Changed.bindAsEventListener(this));
	this.controller.setupWidget('selector4', {label: $L("List Date"), choices: [], modelProperty:'choice'}, selector4Model);
	selector4Model.choices = [
		{ label: $L("Last Update"), value:"0" },
		{ label: $L("Creation Date"), value:"1" },
	];
	this.controller.modelChanged(selector4Model);
	
	if(SHOWMAP) {
		this.controller.get('map1row').show();
	}
	
	selector5Model = { choice: MAPZOOM };
	this.controller.listen('selector5', Mojo.Event.propertyChange, this.selector5Changed.bindAsEventListener(this));
	this.controller.setupWidget('selector5', {label: $L("Map Zoom"), choices: [], modelProperty:'choice'}, selector5Model);
	selector5Model.choices = [
		{ label: $L("Level 2"), value:"2" },
		{ label: $L("Level 3"), value:"3" },
		{ label: $L("Level 4"), value:"4" },
		{ label: $L("Level 5"), value:"5" },
		{ label: $L("Level 6"), value:"6" },
		{ label: $L("Level 7"), value:"7" },
		{ label: $L("Level 8"), value:"8" },
		{ label: $L("Level 9"), value:"9" },
		{ label: $L("Level 10"), value:"10" },
	];
	this.controller.modelChanged(selector5Model);

	toggle5Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle5Model = {value: DASHBOARD, disabled: false};
	this.controller.setupWidget('toggle5', toggle5Attr, toggle5Model);
	this.controller.listen('toggle5',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle6Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle6Model = {value: DARKTHEME, disabled: false};
	this.controller.setupWidget('toggle6', toggle6Attr, toggle6Model);
	this.controller.listen('toggle6',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	
	// -- LITE START --
	toggle7Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle7Model = {value: PUSHSERVICE, disabled: false};
	this.controller.setupWidget('toggle7', toggle7Attr, toggle7Model);
	this.controller.listen('toggle7',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	// -- LITE STOPP --

	toggle8Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle8Model = {value: AUTOREFRESHDAYTIME, disabled: false};
	this.controller.setupWidget('toggle8', toggle8Attr, toggle8Model);
	this.controller.listen('toggle8',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	
	toggle9Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle9Model = {value: CHECKSERVER, disabled: false};
	this.controller.setupWidget('toggle9', toggle9Attr, toggle9Model);
	this.controller.listen('toggle9',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle10Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle10Model = {value: USECACHE, disabled: false};
	this.controller.setupWidget('toggle10', toggle10Attr, toggle10Model);
	this.controller.listen('toggle10',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	
	toggle11Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle11Model = {value: NOTIFYSMALLMESSAGE, disabled: false};
	this.controller.setupWidget('toggle11', toggle11Attr, toggle11Model);
	this.controller.listen('toggle11',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle12Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle12Model = {value: COLORLIST, disabled: false};
	this.controller.setupWidget('toggle12', toggle12Attr, toggle12Model);
	this.controller.listen('toggle12',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	this.controller.listen('toggle12',Mojo.Event.propertyChange,this.toggleChanged3.bind(this));

	toggle13Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle13Model = {value: COLORDETAILS, disabled: false};
	this.controller.setupWidget('toggle13', toggle13Attr, toggle13Model);
	this.controller.listen('toggle13',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	toggle14Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle14Model = {value: BETASERVICES, disabled: false};
	this.controller.setupWidget('toggle14', toggle14Attr, toggle14Model);
	this.controller.listen('toggle14',Mojo.Event.propertyChange,this.toggleChanged.bind(this));
	this.controller.listen('toggle14',Mojo.Event.propertyChange,this.toggleChanged4.bind(this));
	
	toggle15Attr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggle15Model = {value: SHOWMAP, disabled: false};
	this.controller.setupWidget('toggle15', toggle15Attr, toggle15Model);
	this.controller.listen('toggle15',Mojo.Event.propertyChange,this.toggleChanged.bind(this));

	this.controller.listen('currentringtonerow',Mojo.Event.tap,this.chooseRingtone.bind(this));
	// -- LITE START --
	this.controller.listen('sendpushlink',Mojo.Event.tap,this.sendPushLink.bind(this));
	this.controller.listen('importparcels',Mojo.Event.tap,this.importParcels.bind(this));
	this.controller.listen('exportparcels',Mojo.Event.tap,this.exportParcels.bind(this));
	this.controller.listen('exportparcelsinternal',Mojo.Event.tap,this.exportParcelsInternal.bind(this));
	// -- LITE STOPP --
	
	//MANAGE SERVICES
	//this.controller.listen('manageservices',Mojo.Event.tap,this.manageServices.bind(this));
	
	this.controller.listen('resetall',Mojo.Event.tap,this.resetAll.bind(this));
	
	this.helpVisible = false;
	this.controller.listen('togglehelp',Mojo.Event.tap,this.toggleHelp.bind(this));
};

PreferencesAssistant.prototype.toggleHelp = function(event) {
	var tmpDivs = this.controller.document.getElementsByName("helptext");
	
	if(!this.helpVisible) {
		for(var i=0; i < tmpDivs.length; i++) {
			tmpDivs[i].style.display = "block";
		}
		
		this.controller.get('togglehelp').style.backgroundImage = "url(images/help_pressed.png)";
		
		this.helpVisible = true;
	} else {
		for(var i=0; i < tmpDivs.length; i++) {
			tmpDivs[i].style.display = "none";
		}
		
		this.controller.get('togglehelp').style.backgroundImage = "url(images/help.png)";
		
		this.helpVisible = false;
	}
}

PreferencesAssistant.prototype.toggleChanged = function(event) {
	var tmpDashboard = DASHBOARD;
	
	REFRESHONSTART = toggle1Model.value;
	REFRESHONADD = toggle2Model.value;
	AUTOREFRESH = toggle3Model.value;
	AUTOREFRESHDAYTIME = toggle8Model.value;
	NOTIFYMESSAGE = toggle4Model.value;
	NOTIFYSMALLMESSAGE = toggle11Model.value;
	DASHBOARD = toggle5Model.value;
	// -- LITE START --
	PUSHSERVICE = toggle7Model.value;
	// -- LITE STOPP --
	CHECKSERVER = toggle9Model.value;
	BETASERVICES = toggle14Model.value;
	COLORLIST = toggle12Model.value;
	COLORDETAILS = toggle13Model.value;
	SHOWMAP = toggle15Model.value;
	USECACHE = toggle10Model.value;
	DARKTHEME = toggle6Model.value;

	if(AUTOREFRESH) {
		this.controller.get('autorefresh1row').show();
		this.controller.get('autorefresh2row').show();
		Mojo.Log.info("SET NEW ALARM");
		setNextAlarm();
	} else {
		this.controller.get('autorefresh1row').hide();
		this.controller.get('autorefresh2row').hide();
		Mojo.Log.info("CLEAR ALARM");
		clearAlarm();
	}
	
	if(NOTIFYMESSAGE) {
		this.controller.get('notify1row').show();
		if(NOTIFYRINGTONE)
			this.controller.get('currentringtonerow').show();
	} else {
		this.controller.get('notify1row').hide();
		this.controller.get('currentringtonerow').hide();
	}

	if(SHOWMAP) {
		this.controller.get('map1row').show();
	} else {
		this.controller.get('map1row').hide();
	}

	if(DASHBOARD && !tmpDashboard) {
		var pushDashScene = function(stageController){
			stageController.pushScene('dash');
		};
		
		var stageArgs = {
			name: 'dash',
			lightweight: true
		};
		
		Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushDashScene.bind(this), 'dashboard');
	} else if (!DASHBOARD && tmpDashboard) {
		Mojo.Controller.getAppController().closeStage('dash');
	}
	
	if(DARKTHEME)
		this.controller.document.body.className = "palm-dark";
	else
		this.controller.document.body.className = "palm-default";
	
	setPrefsCookie();
};

PreferencesAssistant.prototype.toggleChanged2 = function(event) {
	if (AUTOREFRESH) {
		this.controller.showAlertDialog({
			onChoose: function(value){	},
			title: $L("Notice"),
			message: $L("To keep the app refreshing the packages in background the app itself and/or the dashboard has to be open. The dashboard can be activated below."),
			choices: [{
				label: $L("OK"),
				value: true
			}]
		});
	}
}

PreferencesAssistant.prototype.toggleChanged3 = function(event) {
	if (COLORLIST) {
		this.controller.showAlertDialog({
			onChoose: function(value){	},
			title: $L("Notice"),
			message: $L("To see the colored list the app has to be restarted."),
			choices: [{
				label: $L("OK"),
				value: true
			}]
		});
	}
}

PreferencesAssistant.prototype.toggleChanged4 = function(event) {
	if (BETASERVICES) {
		this.controller.showAlertDialog({
			onChoose: function(value){	},
			title: $L("Notice"),
			message: $L("To activate the beta service the app has to be restarted."),
			choices: [{
				label: $L("OK"),
				value: true
			}]
		});
	}
}

PreferencesAssistant.prototype.selector1Changed = function(event) {
	AUTOREFRESHINTERVALL = event.value;
	
	if(AUTOREFRESH) {
		Mojo.Log.info("SET NEW ALARM");
		setNextAlarm();
	} else {
		Mojo.Log.info("CLEAR ALARM");
		clearAlarm();
	}
	
	setPrefsCookie();
};

PreferencesAssistant.prototype.selector2Changed = function(event) {
	this.controller.get('currentringtonerow').hide();
	
	NOTIFYVIBRATE = false;
	NOTIFYSOUND = false;
	NOTIFYRINGTONE = false;
	
	if (event.value == 0) {
		NOTIFYVIBRATE = true;
	}
	else if (event.value == 1) {
		NOTIFYSOUND = true;
	}
	else if (event.value == 2) {
		NOTIFYRINGTONE = true;
		this.controller.get('currentringtonerow').show();
	}
	
	setPrefsCookie();
};

PreferencesAssistant.prototype.selector3Changed = function(event) {
	AUTOSORT = event.value;
	
	this.controller.showAlertDialog({
		onChoose: function(value){	},
		title: $L("Notice"),
		message: $L("In order to see the correct order the app has to be restarted."),
		choices: [{
			label: $L("OK"),
			value: true
		}]
	});
	
	setPrefsCookie();
};

PreferencesAssistant.prototype.selector4Changed = function(event) {
	LISTDATE = event.value;

	this.controller.showAlertDialog({
		onChoose: function(value){	},
		title: $L("Notice"),
		message: $L("To show the correct date the app has to be restarted."),
		choices: [{
			label: $L("OK"),
			value: true
		}]
	});

	setPrefsCookie();
};

PreferencesAssistant.prototype.selector5Changed = function(event) {
	MAPZOOM = event.value;

	setPrefsCookie();
};

PreferencesAssistant.prototype.chooseRingtone = function() {
	Mojo.Log.info("CHOOSE RINGTONE");
	
	var params = {                                                                                                                                                                                                                                                         
		actionType: "attach",                                                                                                                                                                                                                                  
		defaultKind: 'ringtone',                                                                                                                                                                                                                                           
		kinds: ["ringtone"],                                                                                                                                                                                                                                   
		filePath: null,                                                                                                                                                                                      
		actionName: $L("Done"),                                                                                                                                                                                                                                
		onSelect: this.chooseRingtoneDone.bind(this)                                                                                                                                                                                                                 
	};                                                                                                                                                                                                                                                                 
	Mojo.FilePicker.pickFile(params,this.controller.stageController);                                                                                                                                                                                                  
}

PreferencesAssistant.prototype.chooseRingtoneDone = function(file) {
	var params = {                                                                                                              
		ringtonePath: file.fullPath,                                                                                        
		ringtoneName: file.name                                                                                             
	};                                                                                                                          

	NOTIFYRINGTONENAME = file.name;
	NOTIFYRINGTONEFILE = file.fullPath;

	this.controller.get('currentringtone').update(NOTIFYRINGTONENAME);
	
	Mojo.Log.info(NOTIFYRINGTONENAME);
	Mojo.Log.info(NOTIFYRINGTONEFILE);
	
	setPrefsCookie();
}

// -- LITE START --
PreferencesAssistant.prototype.sendPushLink = function() {
	getNDUID(this.gotNDUID.bind(this));
}

PreferencesAssistant.prototype.gotNDUID = function(mynduid) {
	this.controller.serviceRequest(
	    "palm://com.palm.applicationManager", {
	        method: 'open',
	        parameters: {
	            id: "com.palm.app.email",
	            params: {
	                summary: $L("Package Tracker Bookmarklet Link"),
	                text: $L("To use the push service a bookmarklet has to be installed in the browser. Please send this mail to your self and open it on your computer. Then click on the following link: <br><br> ") +
					"<a href='http://pvs.omoco.de/paket/link.php?nduid=" + mynduid + "'>http://pvs.omoco.de/paket/link.php?nduid=" + mynduid + "</a>",
	                recipients: []
	            }
	        }
	    }
	);
}

PreferencesAssistant.prototype.importParcels = function() {
	Mojo.Controller.getAppController().getStageController('main').pushScene("importparcels");
}

PreferencesAssistant.prototype.exportParcels = function() {
	var exportList = "";
	
	for(var i = 0; i < PARCELS.length; i++) {
		exportList = exportList + PARCELS[i].name + ";" + PARCELS[i].servicename + ";" + PARCELS[i].parcelid + "<br>";
	}
	
	var dateNow = new Date();
	//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
	var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
	
	this.controller.serviceRequest(
	    "palm://com.palm.applicationManager", {
	        method: 'open',
	        parameters: {
	            id: "com.palm.app.email",
	            params: {
	                summary: $L("Package Tracker export - ") + dateNowString,
	                text: exportList,
	                recipients: []
	            }
	        }
	    }
	);
}

PreferencesAssistant.prototype.exportParcelsInternal = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.exportParcelsInternalConfirm(value)},
		title: $L("Export Packages"),
		message: $L("To export the packages list directly to the device they have to be sent via an external server. No data will be saved there. Do you really want to export?"),
		choices:[
			{label:$L("Export Packages"), value:true, type:'affirmative'},
			{label:$L("Cancel"), value:false}    
		]
	});
}

PreferencesAssistant.prototype.exportParcelsInternalConfirm = function(confirm) {
	if(confirm) {
		var exportList = "";
		
		for(var i = 0; i < PARCELS.length; i++) {
			exportList = exportList + PARCELS[i].name + ";" + PARCELS[i].servicename + ";" + PARCELS[i].parcelid + ":::";
		}
		
		this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
			method: 'download', 
			parameters: 
			{
				target: "http://pvs.omoco.de/paket/exportinternal.php?data=" + escape(exportList),
				mime: "text/plain",
				targetDir: "/media/internal/",
				targetFilename: "import.txt",
				subscribe: true
			},
			onSuccess : function (resp) {
				//Mojo.Log.error("Success: " + Object.toJSON(resp))
				if(resp.completed && resp.completionStatusCode == 200) {
					this.controller.showAlertDialog({
						onChoose: function(value){	},
						title: $L("Export finished"),
						message: $L("Export has been finished. There is now a file names import.txt on you media partition."),
						choices: [{
							label: $L("OK"),
							value: true
						}]
					});
				} else if(resp.completed) {
					this.controller.showAlertDialog({
						onChoose: function(value){	},
						title: $L("Error"),
						message: $L("Error while exporting."),
						choices: [{
							label: $L("OK"),
							value: true
						}]
					});
				}
			}.bind(this),
			onFailure : function (e) {
				//Mojo.Log.error("Failure: " + Object.toJSON(e))
				this.controller.showAlertDialog({
					onChoose: function(value){	},
					title: $L("Error"),
					message: $L("Error while exporting."),
					choices: [{
						label: $L("OK"),
						value: true
					}]
				});
			}.bind(this)
		});
	}

}
// -- LITE STOPP --

PreferencesAssistant.prototype.manageServices = function() {
	Mojo.Controller.getAppController().getStageController('main').pushScene("manageservices");
}

PreferencesAssistant.prototype.resetAll = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.resetAllConfirm(value)},
		title: $L("Restore defaults"),
		message: $L("Reset all settings to factory default?"),
		choices:[
			{label:$L('Reset'), value:true, type:'negative'},
			{label:$L("Cancel"), value:false}    
		]
	});
}

PreferencesAssistant.prototype.resetAllConfirm = function(reallyDelete) {
	if(reallyDelete) {
		Mojo.Log.info("CLEAR ALARM");
		clearAlarm();
		
		if (DASHBOARD)
			Mojo.Controller.getAppController().closeStage('dash');
		
		this.controller.document.body.className = "palm-default";
		
		REFRESHONSTART = DEFAULTREFRESHONSTART;
		REFRESHONADD = DEFAULTREFRESHONADD;
		AUTOREFRESH = DEFAULTAUTOREFRESH;
		AUTOREFRESHINTERVALL = DEFAULTAUTOREFRESHINTERVALL;
		AUTOREFRESHDAYTIME = DEFAULTAUTOREFRESHDAYTIME;
		
		NOTIFYMESSAGE = DEFAULTNOTIFYMESSAGE;
		NOTIFYSMALLMESSAGE = DEFAULTNOTIFYSMALLMESSAGE;
		NOTIFYVIBRATE = DEFAULTNOTIFYVIBRATE;
		NOTIFYSOUND = DEFAULTNOTIFYSOUND;
		NOTIFYRINGTONE = DEFAULTNOTIFYRINGTONE;
		NOTIFYRINGTONENAME = DEFAULTNOTIFYRINGTONENAME;
		NOTIFYRINGTONEFILE = DEFAULTNOTIFYRINGTONEFILE;
		
		DASHBOARD = DEFAULTDASHBOARD;
		PUSHSERVICE = DEFAULTPUSHSERVICE;
				
		AUTOSORT = DEFAULTAUTOSORT;
		LISTDATE = DEFAULTLISTDATE;
		COLORLIST = DEFAULTCOLORLIST;
		COLORDETAILS = DEFAULTCOLORDETAILS;
		SHOWMAP = DEFAULTSHOWMAP;
		MAPZOOM = DEFAULTMAPZOOM;
		USECACHE = DEFAULTUSECACHE;
		DARKTHEME = DEFAULTDARKTHEME;

		CHECKSERVER = DEFAULTCHECKSERVER;
		CHECKSERVERLAST = DEFAULTCHECKSERVERLAST;
		
		BETASERVICES = DEFAULTBETASERVICES;
		
		IMPORTFILENAME = DEFAULTIMPORTFILENAME;
		IMPORTSCRIPTFILE = DEFAULTIMPORTSCRIPTFILE;
		
		setPrefsCookie();
	
		Mojo.Controller.getAppController().showBanner({messageText: $L("All settings have been resetted!")}, "", "");
		Mojo.Controller.getAppController().getStageController('main').popScene();
	}
};

PreferencesAssistant.prototype.activate = function(event) {
};

PreferencesAssistant.prototype.deactivate = function(event) {
};

PreferencesAssistant.prototype.cleanup = function(event) {
};

PreferencesAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.commandEnable && (event.command == Mojo.Menu.helpCmd)) {
		event.stopPropagation();
	}

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.getAppController().getStageController('main').pushAppSupportInfoScene();
				break;
		}
	}
	
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'togglehelp':
				this.toggleHelp();
				break;
		}
	}
}