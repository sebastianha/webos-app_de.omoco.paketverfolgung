function DetailsDialogAssistant(sceneAssistant, spinnerTopModel, spinnerModel, id, callback) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	
	this.spinnerTopModel = spinnerTopModel;
	this.spinnerModel = spinnerModel;
	this.id = id;
	this.callback = callback;
}

DetailsDialogAssistant.prototype.setup = function(widget) {
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
		'original' : PARCELS[this.id].name,
		disabled: false
	};
	this.controller.setupWidget('name', nameattr, namemodel);
	
	
	this.typechoices = [];
	selectorsModel = { type: PARCELS[this.id].servicename };
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
		'original' : PARCELS[this.id].parcelid,
		disabled: false
	};
	this.controller.setupWidget('id', idattr, idmodel);
}

DetailsDialogAssistant.prototype.dbSuccess = function(event) {
}

DetailsDialogAssistant.prototype.dbFailure = function(event) {
}

DetailsDialogAssistant.prototype.save = function(event) {
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == idmodel['original'] && this.id != i) {
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
	
	PARCELS[this.id].name = namemodel['original']; 
	PARCELS[this.id].status = "0";
	PARCELS[this.id].parcelid = idmodel['original']; 
	PARCELS[this.id].lastmodified = dateNowTS;
	PARCELS[this.id].lastmodifiedstring = dateNowString;
	PARCELS[this.id].timecreated = dateNowTS;
	PARCELS[this.id].timecreatedstring = dateNowString; 
	PARCELS[this.id].servicename = selectorsModel.type;
	PARCELS[this.id].servicecolor = tmpServiceColor;
	PARCELS[this.id].bold_s = "";
	PARCELS[this.id].bold_e = "";
	PARCELS[this.id].refreshing = "";
	PARCELS[this.id].detailsstatus = 0;
	PARCELS[this.id].detailscached = "";

	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);

	listModel.items = PARCELS;
	this.controller.modelChanged(listModel);
	
	this.widget.mojo.close();
	
	this.callback();
}

DetailsDialogAssistant.prototype.cancel = function(event) {
	this.widget.mojo.close();
}

DetailsDialogAssistant.prototype.pasteid = function(event) {
	Mojo.Controller.getAppController().showBanner({messageText: $L("Pasted ID from clipboard...")}, "", "");
	if (PalmSystem && PalmSystem.paste) {
		idmodel['original'] = "";
		this.controller.modelChanged(idmodel);
		
		event.stopPropagation();
		this.controller.get("id").mojo.focus();
		PalmSystem.paste();
	}
}

DetailsDialogAssistant.prototype.activate = function(event) {
}

DetailsDialogAssistant.prototype.deactivate = function(event) {
}

DetailsDialogAssistant.prototype.cleanup = function(event) {
}