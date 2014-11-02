function ManageservicesDialogAssistant(sceneAssistant, index) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.serviceIndex = index;
}

ManageservicesDialogAssistant.prototype.setup = function(widget) {
	var depotoptions = {
		name: "servicesdepot",
		version: 1,
		replace: false
	};
	this.servicesDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	if(this.serviceIndex == -1) {
		this.controller.get("dialogtitle").innerText = $L("New Service");
		this.serviceName = "";
		this.serviceSrc = "";
		this.serviceBeta = false;
	} else {
		this.serviceName = SERVICESSRC[this.serviceIndex].name;
		this.serviceSrc = SERVICESSRC[this.serviceIndex].src;
		this.serviceBeta = SERVICESSRC[this.serviceIndex].beta;
	}
	
	this.widget = widget;
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	
	this.controller.listen("save", Mojo.Event.tap, this.save);
	this.controller.listen("cancel", Mojo.Event.tap, this.cancel);
	
	var nameattr = {
		hintText: 'Name...',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: true, 
		maxLength: 50,
	};
	namemodel = {
		'original' : this.serviceName,
		disabled: false
	};
	this.controller.setupWidget('name', nameattr, namemodel);
	
	var srcattr = {
		hintText: '/media/internal/...',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 50,
		textCase: Mojo.Widget.steModeLowerCase,
	};
	srcmodel = {
		'original' : this.serviceSrc,
		disabled: false
	};
	this.controller.setupWidget('src', srcattr, srcmodel);
	
	toggleBetaAttr = {trueLabel: $L("Yes"), falseLabel: $L("No")};
	toggleBetaModel = {value: this.serviceBeta, disabled: false};
	this.controller.setupWidget('togglebeta', toggleBetaAttr, toggleBetaModel);
	//this.controller.listen('togglebeta',Mojo.Event.propertyChange,this.toggleBetaChanged.bind(this));
}

ManageservicesDialogAssistant.prototype.dbSuccess = function(event) {
}

ManageservicesDialogAssistant.prototype.dbFailure = function(event) {
}

ManageservicesDialogAssistant.prototype.save = function(event) {
	if(this.serviceIndex == -1) {
		for(var i=0; i<SERVICESSRC.length; i++) {
			if(SERVICESSRC[i].name == namemodel['original'] || SERVICESSRC[i].src == srcmodel['original']) {
				Mojo.Controller.getAppController().showBanner({messageText: $L("Service already exists!")}, "", "");
				return;
			}
		}
		
		var service = {
			name: namemodel['original'], 
			src: srcmodel['original'], 
			active: false,
			beta: toggleBetaModel.value
		};
	
		SERVICESSRC = servicesListModel.items;
		//SERVICESSRC.push(service);
		SERVICESSRC.unshift(service);
	} else {
		for(var i=0; i<SERVICESSRC.length; i++) {
			if(this.serviceName != namemodel['original'] && SERVICESSRC[i].name == namemodel['original'] || this.serviceSrc != srcmodel['original'] && SERVICESSRC[i].src == srcmodel['original']) {
				Mojo.Controller.getAppController().showBanner({messageText: $L("Service already exists!")}, "", "");
				return;
			}
		}
		
		SERVICESSRC[this.serviceIndex].name = namemodel['original'];
		SERVICESSRC[this.serviceIndex].src = srcmodel['original'];
		SERVICESSRC[this.serviceIndex].active = false;
		SERVICESSRC[this.serviceIndex].beta = toggleBetaModel.value;
	}

	this.servicesDepot.add("services", SERVICESSRC, this.dbSuccess, this.dbFailure);
	
	servicesListModel.items = SERVICESSRC;
	this.controller.modelChanged(servicesListModel);
	
	this.widget.mojo.close();
}

ManageservicesDialogAssistant.prototype.cancel = function(event) {
	this.widget.mojo.close();
}

ManageservicesDialogAssistant.prototype.activate = function(event) {
}

ManageservicesDialogAssistant.prototype.deactivate = function(event) {
}

ManageservicesDialogAssistant.prototype.cleanup = function(event) {
}