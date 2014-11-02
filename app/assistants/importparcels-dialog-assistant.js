function ImportparcelsDialogAssistant(sceneAssistant, outputdiv, importscriptname, useclipboard) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.importscriptname = importscriptname;
	this.useclipboard = useclipboard;
	
	this.outputdiv = outputdiv;
}

ImportparcelsDialogAssistant.prototype.setup = function(widget) {
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	this.widget = widget;
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	
	this.controller.listen("save", Mojo.Event.tap, this.save);
	this.controller.listen("cancel", Mojo.Event.tap, this.cancel);
	
	if(this.useclipboard) {
		this.controller.get('label').style.display = "none";
		this.controller.get('name').style.height = "100px";
		
		var nameattr = {
			hintText: $L("Paste = Gesturearea + V"),
			textFieldName: 'name', 
			modelProperty: 'original', 
			multiline: true,
			focus: true, 
		};
		namemodel = {
			'original' : '',
			disabled: false
		};
		this.controller.setupWidget('name', nameattr, namemodel);
		
		toggle1Attr = {trueLabel: 'Ja', falseLabel: 'Nein'};
		toggle1Model = {value: false, disabled: false};
		this.controller.setupWidget('toggle1', toggle1Attr, toggle1Model);
		//this.controller.listen("toggle1", Mojo.Event.propertyChange, this.toggleChanged.bind(this));
	} else {
		var nameattr = {
			hintText: $L("Filename..."),
			textFieldName: 'name', 
			modelProperty: 'original', 
			multiline: false,
			focus: true, 
			maxLength: 50,
			textCase: Mojo.Widget.steModeLowerCase,
		};
		namemodel = {
			'original' : IMPORTFILENAME,
			disabled: false
		};
		this.controller.setupWidget('name', nameattr, namemodel);
		
		toggle1Attr = {trueLabel: 'Ja', falseLabel: 'Nein'};
		toggle1Model = {value: true, disabled: false};
		this.controller.setupWidget('toggle1', toggle1Attr, toggle1Model);
		//this.controller.listen("toggle1", Mojo.Event.propertyChange, this.toggleChanged.bind(this));
	}
	
	if(this.importscriptname != "") {
		Mojo.Log.info("Loading ImportScript: " + this.importscriptname);
		loadScript(this.importscriptname);
		
		this.controller.get('importscriptrow').show();
	}
}

ImportparcelsDialogAssistant.prototype.dbSuccess = function(event) {
}

ImportparcelsDialogAssistant.prototype.dbFailure = function(event) {
}

ImportparcelsDialogAssistant.prototype.save = function(event) {
	this.controller.get('helptext').style.display = "none";
	this.controller.get('startimport').style.display = "none";
	this.controller.get('startimportclipboard').style.display = "none";
	this.controller.get('importscripttoggle').style.display = "none";
	this.controller.get('importscriptnamerow').style.display = "none";

	this.cookieHasToBeSaved = false;
	if(this.importscriptname != IMPORTSCRIPTFILE) {
		IMPORTSCRIPTFILE = this.importscriptname;
		this.cookieHasToBeSaved = true;
	}
	if(namemodel['original'] != IMPORTFILENAME && !this.useclipboard) {
		IMPORTFILENAME = namemodel['original'];
		this.cookieHasToBeSaved = true;
	}
	if(this.cookieHasToBeSaved) {
		setPrefsCookie();
	}
	
	this.outputdiv.innerText = "";
	
	
	if(this.useclipboard) {
		this.parseImport(namemodel['original']);
	} else {
		var url = "";
		if(namemodel['original'].startsWith('http://') || namemodel['original'].startsWith('https://')) {
			url = namemodel['original'];
		} else {
			url = "/media/internal/" + namemodel['original'];
		}
		this.addLog($L("Log for file ") + url);
			
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJS: 'false',
			evalJSON: 'false',
			onSuccess: this.getRequestSuccess.bind(this),
			onFailure: this.getRequestFailure.bind(this)
		});
	}

	
	//this.widget.mojo.close();
}

ImportparcelsDialogAssistant.prototype.getRequestSuccess = function(response) {
	//this.addLog("SUCCESS");
	var responseText = response.responseText;
	
	if(response.status == 200) {
		this.parseImport(responseText);
	} else {
		this.addLog($L("File not found!"));
		Mojo.Controller.getAppController().showBanner({messageText: $L("File not found!")}, "", "");
	}
}

ImportparcelsDialogAssistant.prototype.getRequestFailure = function(response) {
	this.addLog($L("Unknown Error"));
	this.controller.get('startimport').mojo.deactivate();
	this.controller.get('startimportclipboard').mojo.deactivate();
	this.widget.mojo.close();
}

ImportparcelsDialogAssistant.prototype.parseImport = function(importText) {
		if(toggle1Model.value && this.importscriptname != "") {
			Mojo.Log.info("Running ImportScript: " + this.importscriptname);
			importText = importscriptpreprocessing(importText);
		}
		
		var importCounter = 0;
		this.addLog($L("File found."));
		var lines = importText.split("\n");
		//this.addLog("Datei enthält " + lines.length + " Zeilen.");
		this.addLog($L("Starting import..."));
		this.addLog("");
		
		for(var i = 0; i < (lines.length); i++) {
			if(lines[i] != "") {
				this.addLog($L("Reading line ") + (i+1) + "...");
				
				var parcel = lines[i].split(";");
				if(parcel.length == 3) {
					var servicePresent = false;
					var tmpServiceColor = "";
					for(var ii = 0; ii < SERVICES.length; ii++) {
						if(SERVICES[ii].name == parcel[1]) {
							servicePresent = true;
							tmpServiceColor = SERVICES[ii].serviceobject.getColor();
						}
					}
					
					if(servicePresent) {
						var dateNow = new Date();
						//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
						var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
						var dateNowTS = dateNow.getTime();
						
						var sendung = {
							name: parcel[0], 
							status: "0", 
							parcelid: parcel[2], 
							lastmodified: dateNowTS,
							lastmodifiedstring: dateNowString,
							timecreated: dateNowTS,
							timecreatedstring: dateNowString,  
							servicename: parcel[1],
							servicecolor: tmpServiceColor,
							bold_s: "",
							bold_e: "",
							refreshing: "",
							detailsstatus: 0,
							detailscached: ""
						};
						
						var alreadyExists = false;
						for(var iii = 0; iii < PARCELS.length; iii++) {
							if(sendung.parcelid == PARCELS[iii].parcelid) {
								alreadyExists = true;
							}
						}
						
						if(!alreadyExists) {
							PARCELS.push(sendung);
							
							this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
							
							importCounter ++;
							this.addLog($L("Package \"") + parcel[0] + $L("\" added successfully."));
							this.addLog("");
						} else {
							this.addLog($L("Package \"") + parcel[0] + $L("\" already exists."));
							this.addLog("");
						}
					} else {
						this.addLog($L("Service of Package \"") + parcel[0] + $L("\" unknown."));
						this.addLog("");
					}
				} else {
					this.addLog($L("No packages detected, wrong file format?"));
					this.addLog("");
				}
			}
		}
		
		this.addLog($L("Import finished."));
		this.addLog($L("There is a total of ") + importCounter + $L(" new packages."));
		
		this.controller.get('close').style.display = "block";
		this.controller.get('startimport').mojo.deactivate();
		this.controller.get('startimportclipboard').mojo.deactivate();
		this.widget.mojo.close();
}

ImportparcelsDialogAssistant.prototype.cancel = function(event) {
	this.controller.get('startimport').mojo.deactivate();
	this.controller.get('startimportclipboard').mojo.deactivate();
	this.widget.mojo.close();
}

ImportparcelsDialogAssistant.prototype.addLog = function(text) {
	this.outputdiv.innerText = this.outputdiv.innerText + text + "\n";
}

ImportparcelsDialogAssistant.prototype.activate = function(event) {
}

ImportparcelsDialogAssistant.prototype.deactivate = function(event) {
}

ImportparcelsDialogAssistant.prototype.cleanup = function(event) {
}