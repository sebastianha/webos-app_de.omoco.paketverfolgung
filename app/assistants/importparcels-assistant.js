function ImportparcelsAssistant() {
}

ImportparcelsAssistant.prototype.setup = function() {
	this.controller.setupWidget('startimport', 
    	this.atts = {
			type: Mojo.Widget.activityButton
		}, 
		this.model = {
			buttonLabel: $L("Choose File"),
			buttonClass: '',
			disabled: false
		}
	);
	
	this.controller.setupWidget('startimportclipboard', 
    	this.atts = {
			type: Mojo.Widget.activityButton
		}, 
		this.model = {
			buttonLabel: $L("From Clipboard"),
			buttonClass: '',
			disabled: false
		}
	);
	
	var importscriptnameattr = {
		hintText: $L("Filename..."),
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 100,
		textCase: Mojo.Widget.steModeLowerCase,
	};
	importscriptnamemodel = {
		'original' : IMPORTSCRIPTFILE,
		disabled: false
	};
	this.controller.setupWidget('importscriptname', importscriptnameattr, importscriptnamemodel);
	
	this.controller.listen('startimport',Mojo.Event.tap,this.startImport.bind(this));
	this.controller.listen('startimportclipboard',Mojo.Event.tap,this.startImportClipboard.bind(this));
	
	this.controller.listen('close',Mojo.Event.tap,this.close.bind(this));
	
	this.controller.listen('importscripttoggle',Mojo.Event.tap,this.toggleImportscript.bind(this));
};

ImportparcelsAssistant.prototype.toggleImportscript = function(event) {
	var togglediv = this.controller.get('importscripttoggle');
	var toggleButton = togglediv.down("div.arrow_button");
	if (toggleButton.hasClassName('palm-arrow-closed')) {
		toggleButton.addClassName('palm-arrow-expanded');
		toggleButton.removeClassName('palm-arrow-closed');
		this.controller.get('importscriptnamerow').style.display = "block";
		this.controller.getSceneScroller().mojo.revealBottom();
	} else {
		toggleButton.addClassName('palm-arrow-closed');
		toggleButton.removeClassName('palm-arrow-expanded');
		this.controller.get('importscriptnamerow').style.display = "none";
		this.controller.getSceneScroller().mojo.revealTop();
	}
		
};

ImportparcelsAssistant.prototype.startImport = function(event) {
	Mojo.Log.info(">>> startImport");
	
	this.controller.showDialog({
		template: 'importparcels/dialog-scene',
		assistant: new ImportparcelsDialogAssistant(this, this.controller.get('importoutput'), importscriptnamemodel['original'], false),
		preventCancel: false
	});
};

ImportparcelsAssistant.prototype.startImportClipboard = function(event) {
	Mojo.Log.info(">>> startImportClipboard");
	
	this.controller.showDialog({
		template: 'importparcels/dialog-scene',
		assistant: new ImportparcelsDialogAssistant(this, this.controller.get('importoutput'), importscriptnamemodel['original'], true),
		preventCancel: false
	});
};

ImportparcelsAssistant.prototype.close = function(event) {
	Mojo.Controller.getAppController().getStageController('main').popScenesTo("main");
};

ImportparcelsAssistant.prototype.activate = function(event) {
};

ImportparcelsAssistant.prototype.deactivate = function(event) {
};

ImportparcelsAssistant.prototype.cleanup = function(event) {
};

ImportparcelsAssistant.prototype.handleCommand = function(event) {
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
}