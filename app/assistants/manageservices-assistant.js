function ManageservicesAssistant() {
}

ManageservicesAssistant.prototype.setup = function() {
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
				{
					label: $L("Download Example"),
					command: "downloadservice",
					shortcut: "",
					disabled: false
				},
				{
					label: $L("Add Service"),
					command: "addservice",
					shortcut: "",
					disabled: false
				},
				{
					label: $L("Reset to Default"),
					command: "resetservices",
					shortcut: "",
					disabled: false
				},
			]
		}
	);
	
	var depotoptions = {
		name: "servicesdepot",
		version: 1,
		replace: false
	};
	this.servicesDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	servicesListModel = {
		listTitle: $L("Services"),
		items : SERVICESSRC
	}
	
	this.controller.setupWidget("serviceslist",
		this.attributes = {
			itemTemplate:  'manageservices/listitem',
			listTemplate:  'manageservices/listcontainer',
			emptyTemplate: 'manageservices/emptylist',
			//addItemLabel:  $L("Add Service..."),
			swipeToDelete: true,
			reorderable: true,
			renderLimit: 25
		},
		this.model = servicesListModel
	);
	
	this.controller.listen("serviceslist", Mojo.Event.listDelete, this.itemDeleted.bindAsEventListener(this));
	this.controller.listen("serviceslist", Mojo.Event.listReorder, this.itemReordered.bindAsEventListener(this));
	this.controller.listen("serviceslist", Mojo.Event.listAdd, this.itemAdd.bindAsEventListener(this));
	this.controller.listen("serviceslist", Mojo.Event.listTap, this.itemTap.bindAsEventListener(this));
	
	this.servicesCheckboxAttribs = {
		modelProperty: 'active',
	}
	
	this.controller.setupWidget('serviceactivecheckbox', this.servicesCheckboxAttribs);
	
	this.controller.listen('resetservices',Mojo.Event.tap,this.resetServices.bind(this));
	
	this.helpVisible = false;
	this.controller.listen('togglehelp',Mojo.Event.tap,this.toggleHelp.bind(this));
};

ManageservicesAssistant.prototype.toggleHelp = function(event) {
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

ManageservicesAssistant.prototype.dbSuccess = function(event) {
}

ManageservicesAssistant.prototype.dbFailure = function(event) {
}

ManageservicesAssistant.prototype.itemDeleted = function(event) {
	//Mojo.Log.info("Unternehmen gelöscht");
	SERVICESSRC = servicesListModel.items;
	SERVICESSRC.splice(event.index, 1);

	this.servicesDepot.add("services", SERVICESSRC, this.dbSuccess, this.dbFailure);
	this.refreshServices();
}

ManageservicesAssistant.prototype.itemReordered = function(event) {
	//Mojo.Log.info("Unternehmen umsortiert");
	SERVICESSRC = servicesListModel.items;
	
	SERVICESSRC.splice(event.fromIndex, 1);
	SERVICESSRC.splice(event.toIndex, 0, event.item);
	
	this.servicesDepot.add("services", SERVICESSRC, this.dbSuccess, this.dbFailure);
	this.refreshServices();
}

ManageservicesAssistant.prototype.itemAdd = function(event) {
	//Mojo.Log.info("Unternehmen hinzufügen");
	this.controller.showDialog({
		template: 'manageservices/dialog-scene',
		assistant: new ManageservicesDialogAssistant(this, -1),
		preventCancel: false
	});
}

ManageservicesAssistant.prototype.itemTap = function(event) {
	//Mojo.Log.info("Unternehmen bearbeiten");
	this.controller.showDialog({
		template: 'manageservices/dialog-scene',
		assistant: new ManageservicesDialogAssistant(this, event.index),
		preventCancel: false
	});
}

ManageservicesAssistant.prototype.handleListWidgetChanges = function(event) {
    // Handle the property change of the checkbox
    // event.model is the item that the checkbox is using as its model
	
	//Mojo.Log.info(Object.toJSON(event.model));
	//Mojo.Log.info(Object.toJSON(SERVICESSRC));
	
	this.servicesDepot.add("services", SERVICESSRC, this.dbSuccess, this.dbFailure);
	this.refreshServices();
}

ManageservicesAssistant.prototype.resetServices = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.resetServicesConfirm(value)},
		title: $L("Reset to Default"),
		message: $L("Reset all services to default?"),
		choices:[
			{label:$L("Reset"), value:true, type:'negative'},
			{label:$L("Cancel"), value:false}    
		]
	});
}

ManageservicesAssistant.prototype.resetServicesConfirm = function(reallyDelete) {
	if(reallyDelete) {
		// HIER MUSS IRGENDWIE GEKLONT WERDEN!!!
		SERVICESSRC = DEFAULTSERVICESSRC;
		
		servicesListModel.items = SERVICESSRC;
		this.controller.modelChanged(servicesListModel);
		
		this.servicesDepot.add("services", SERVICESSRC, this.dbSuccess, this.dbFailure);
		this.refreshServices();
		
		//Mojo.Log.info(Object.toJSON(SERVICESSRC));
		//Mojo.Log.info(Object.toJSON(DEFAULTSERVICESSRC));
	}
}

ManageservicesAssistant.prototype.refreshServices = function() {
	SERVICES = [];
	for(var i=0; i < SERVICESSRC.length; i++) {
		if(SERVICESSRC[i].active)
			loadScript(SERVICESSRC[i].src);
	}
}

ManageservicesAssistant.prototype.downloadService = function() {
	this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
		method: 'download', 
		parameters: 
		{
			target: "http://pvs.omoco.de/paket/exampleservice.js",
			mime: "text/plain",
			targetDir: "/media/internal/",
			targetFilename: "exampleservice.js",
			subscribe: true
		},
		onSuccess : function (resp) {
			//Mojo.Log.error("Success: " + Object.toJSON(resp))
			if(resp.completed && resp.completionStatusCode == 200) {
				this.controller.showAlertDialog({
					onChoose: function(value){	},
					title: $L("Download Complete"),
					message: $L("The service example has been download to the media partition. Filename is \"exampleservice.js\"."),
					choices: [{
						label: $L("OK"),
						value: true
					}]
				});
			} else if(resp.completed) {
				this.controller.showAlertDialog({
					onChoose: function(value){	},
					title: $L("Error"),
					message: $L("Error while downloading."),
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
				title: $L("Fehler"),
				message: $L("Error while downloading."),
				choices: [{
					label: $L("OK"),
					value: true
				}]
			});
		}.bind(this)
	});
}

ManageservicesAssistant.prototype.activate = function() {
    this.handleListSubWidgetChanges = this.handleListWidgetChanges.bindAsEventListener(this);
 
    // In order to hear the checkbox event changes, this must be listened to
    this.controller.listen(this.controller.get("serviceslist"), Mojo.Event.listChange, this.handleListSubWidgetChanges);
    // This is the event that the checkbox sends when it changes state, but we listen on the list
    this.controller.listen(this.controller.get("serviceslist"), Mojo.Event.propertyChange, this.handleListSubWidgetChanges);
}

ManageservicesAssistant.prototype.deactivate = function(event) {
};

ManageservicesAssistant.prototype.cleanup = function(event) {
};

ManageservicesAssistant.prototype.handleCommand = function(event) {
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
			case 'addservice':
				this.itemAdd();
				break;
			case 'downloadservice':
				this.downloadService();
				break;
			case 'resetservices':
				this.resetServices();
				break;
		}
	}
}