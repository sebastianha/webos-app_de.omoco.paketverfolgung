function MainDialogAssistant(sceneAssistant, spinnerTopModel, autoSortParcelsFunction) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.autoSortParcelsFunction = autoSortParcelsFunction;
	
	this.spinnerTopModel = spinnerTopModel;
}

MainDialogAssistant.prototype.setup = function(widget) {
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	this.widget = widget;
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	this.pasteid = this.pasteid.bindAsEventListener(this);
	
	this.controller.listen("save", Mojo.Event.tap, this.save);
	this.controller.listen("cancel", Mojo.Event.tap, this.cancel);
	this.controller.listen("pasteid", Mojo.Event.tap, this.pasteid);
	
	var nameattr = {
		hintText: $L("Package Name..."),
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: true, 
		maxLength: 50,
	};
	namemodel = {
		'original' : "",
		disabled: false
	};
	this.controller.setupWidget('name', nameattr, namemodel);
	
	
	this.typechoices = [];
	selectorsModel = { type: SERVICES[0].name };
	this.controller.setupWidget('service', {label: $L("Package Service"), choices: this.typechoices, modelProperty:'type'}, selectorsModel);
	selectorsModel.choices = []
	for(var i = 0; i < SERVICES.length; i++) {
		selectorsModel.choices.push({label: SERVICES[i].name, value: SERVICES[i].name});
	}
	//this.controller.modelChanged(selectorsModel);
	
	
	var idattr = {
		hintText: $L("Tracking ID..."),
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 250,
		modifierState: Mojo.Widget.numLock,
	};
	idmodel = {
		'original' : "",
		disabled: false
	};
	this.controller.setupWidget('id', idattr, idmodel);
	
	if(PUSHSERVICE) {
		getNDUID(this.gotNDUID.bind(this));
	}
}

MainDialogAssistant.prototype.gotNDUID = function(mynduid) {
	var url = "http://pvs.omoco.de/paket/out.php?nduid=" + mynduid;
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getRequestSuccess.bind(this),
		onFailure: this.getRequestFailure.bind(this)
	});
}

MainDialogAssistant.prototype.getRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	Mojo.Log.info("RESPONSE: " + responseText);
	
	if(responseText != "") {
		var tmp = responseText.split(";");
		if(tmp.length > 1) {
			Mojo.Log.info(tmp[1]);
			selectorsModel.type = tmp[0];
			this.controller.modelChanged(selectorsModel);
			idmodel['original'] = tmp[1];
			this.controller.modelChanged(idmodel);
		}
		if(tmp.length > 2) {
			namemodel['original'] = tmp[2];
			this.controller.modelChanged(namemodel);
		}
	}
}

MainDialogAssistant.prototype.getRequestFailure = function(response) {
	Mojo.Log.error("Push Request FAILED");
}

MainDialogAssistant.prototype.dbSuccess = function(event) {
}

MainDialogAssistant.prototype.dbFailure = function(event) {
}

MainDialogAssistant.prototype.save = function(event) {
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == idmodel['original']) {
			Mojo.Controller.getAppController().showBanner({messageText: $L("Package already exists!")}, "", "");
			return;
		}
	}
	
	var dateNow = new Date();
	//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
	var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
	var dateNowTS = dateNow.getTime();
	
	var tmpServiceColor = "";
	for(var i = 0; i < SERVICES.length; i++) {
		if(selectorsModel.type == SERVICES[i].name) {
			tmpServiceColor = SERVICES[i].serviceobject.getColor();
		}
	}
	
	var sendung = {
		name: namemodel['original'], 
		status: "0", 
		parcelid: idmodel['original'], 
		lastmodified: dateNowTS,
		lastmodifiedstring: dateNowString,
		timecreated: dateNowTS,
		timecreatedstring: dateNowString,  
		servicename: selectorsModel.type,
		servicecolor: tmpServiceColor,
		bold_s: "",
		bold_e: "",
		refreshing: "",
		detailsstatus: 0,
		detailscached: ""
	};

	PARCELS = listModel.items;
	PARCELS.push(sendung);
	
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);

	if(REFRESHONADD) {
		this.spinnerTopModel.spinning = true;
		this.controller.modelChanged(this.spinnerTopModel);
		
		var tmpparcel = new Parcel(PARCELS.length-1, this.refreshCallback.bind(this));
		tmpparcel.refresh();	
	}

	listModel.items = PARCELS;
	this.controller.modelChanged(listModel);
	
	this.widget.mojo.close();
}

MainDialogAssistant.prototype.refreshCallback = function(event) {
	this.autoSortParcelsFunction();
	
	listModel.items = PARCELS;
	if(Mojo.Controller.getAppController().getStageController('main') != null) {
		this.controller.modelChanged(listModel);
		this.spinnerTopModel.spinning = false;
		this.controller.modelChanged(this.spinnerTopModel);
	}
};

MainDialogAssistant.prototype.cancel = function(event) {
	this.widget.mojo.close();
}

MainDialogAssistant.prototype.pasteid = function(event) {
	Mojo.Controller.getAppController().showBanner({messageText: $L("Pasted ID from clipboard...")}, "", "");
	if (PalmSystem && PalmSystem.paste) {
		idmodel['original'] = "";
		this.controller.modelChanged(idmodel);
		
		event.stopPropagation();
		this.controller.get("id").mojo.focus();
		PalmSystem.paste();
	}
}

MainDialogAssistant.prototype.activate = function(event) {
}

MainDialogAssistant.prototype.deactivate = function(event) {
}

MainDialogAssistant.prototype.cleanup = function(event) {
}