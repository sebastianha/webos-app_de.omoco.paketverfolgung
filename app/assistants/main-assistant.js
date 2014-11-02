function MainAssistant() {
	// saves if the next sort will be reverse
	this.sortReverse = [false, false, false, false, false, false];
}

MainAssistant.prototype.setup = function() {
	if(DARKTHEME)
		this.controller.document.body.className = "palm-dark";
	
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	var tmpMenuItems = [];
	
	if(AUTOSORT == 0)
		tmpMenuItems.push({
			label: $L("Sort List"),
			items: [
				{
					label: $L("Name"),
					command: "sortbyname",
					shortcut: "q",
					disabled: false
				},
				{
					label: $L("Status"),
					command: "sortbystatus",
					shortcut: "w",
					disabled: false
				},
				{
					label: $L("Updated"),
					command: "sortbychanged",
					shortcut: "e",
					disabled: false
				},
				{
					label: $L("Service"),
					command: "sortbyservice",
					shortcut: "r",
					disabled: false
				},
				{
					label: $L("Created"),
					command: "sortbytimecreated",
					shortcut: "t",
					disabled: false
				},
				{
					label: $L("Modified"),
					command: "sortbylastmodified",
					shortcut: "z",
					disabled: false
				}
			]
		});
	else
		tmpMenuItems.push({
			label: $L("Sort List"),
			command: "",
			disabled: true
		});
		
	tmpMenuItems.push({
			label: $L("Edit List"),
			items: [
				{
					label: $L("Refresh"),
					command: "refreshall",
					shortcut: "u",
					disabled: false
				},
				{
					label: $L("Mark all Read"),
					command: "markread",
					shortcut: "i",
					disabled: false
				},
				{
					label: $L("Delete all Packages"),
					command: "deleteall",
					shortcut: "o",
					disabled: false
				},
				{
					label: $L("Delete Delivered"),
					command: "deleteready",
					shortcut: "p",
					disabled: false
				},
				{
					label: $L("Import Packages"),
					command: "importparcels",
					shortcut: "m",
					disabled: false
				},
			]
		}
	);
	
	tmpMenuItems.push({
			label: $L("Add Package"),
			command: "newparcel",
			shortcut: "n",
			disabled: false
		});
	
	this.controller.setupWidget(Mojo.Menu.appMenu,
		this.attributes = {
			omitDefaultItems: false
		},
		this.model = {
			visible: true,
			items: tmpMenuItems
		}
	);
	
	this.commandMenuAttributes = {
		menuClass: 'no-fade'
	};
	this.commandMenuModel = {
		items: [
			{
				iconPath: 'images/newparcel.png',
				command: 'newparcel',
				disabled: false
			},
			{
				icon:'refresh',
				command: 'refreshall',
				disabled: false
			}
		]
	};
	this.controller.setupWidget(
		Mojo.Menu.commandMenu, 
		this.commandMenuAttributes,
		this.commandMenuModel
	);	
	
	this.spinnerTopLAttrs = {spinnerSize: 'small'};
	this.spinnerTopModel = {spinning: false};
	this.controller.setupWidget('waiting_spinner_top', this.spinnerTopLAttrs, this.spinnerTopModel);

	var tmpReorderable = true;
	if(AUTOSORT != 0)
		tmpReorderable = false;

	var tmpColorList = "";
	if(COLORLIST)
		tmpColorList = "c";

	var tmpListItemTemplate = "listitem" + tmpColorList;
	if(LISTDATE == 1)
		tmpListItemTemplate = "listitem1" + tmpColorList;

	var attributes =
	{
		itemTemplate:  'main/' + tmpListItemTemplate,
		listTemplate:  'main/listcontainer',
		emptyTemplate: 'main/emptylist',
		addItemLabel:  $L("Add Package..."),
		swipeToDelete: true,
		reorderable: tmpReorderable,
		renderLimit: (PARCELS.length + 25),
		filterFunction: this.filterFunction.bind(this),
		delay: 250
	};
	this.model = listModel;

	this.controller.setupWidget('parcelslist', attributes, this.model);

	this.controller.listen("parcelslist", Mojo.Event.listDelete, this.itemDeleted.bindAsEventListener(this));
	this.controller.listen("parcelslist", Mojo.Event.listReorder, this.itemReordered.bindAsEventListener(this));
	this.controller.listen("parcelslist", Mojo.Event.listAdd, this.itemAdd.bindAsEventListener(this));
	this.controller.listen("parcelslist", Mojo.Event.listTap, this.itemTap.bindAsEventListener(this));
	
	this.controller.listen("starthelp", Mojo.Event.tap, this.startHelp.bind(this));
	this.controller.listen("startfaqs", Mojo.Event.tap, this.startFaqs.bind(this));
	
	if(PARCELS.length == 0) {
		this.controller.get('tipsdiv').style.display = "block";
	}

	// -- LITE START --
	/*
	if(PARCELS.length > 1) {
		this.controller.get('litediv').style.display = "block";
	}
	*/
	// -- LITE STOPP --
	
	if(AUTOSORT != 0)
		this.autoSortParcels();
	
	if(REFRESHONSTART && PARCELS.length > 0)
		this.refreshAll();
	
	if(CHECKSERVER) {
		var url = "http://omoco.de/paket/info.txt";
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'false',
			onSuccess: this.requestSuccess.bind(this),
			onFailure: this.requestFailure.bind(this)
		});
	}
	
	// DEMOUNIT
	//getNDUID(this.demoUnitGotNDUID.bind(this));	
};

// DEMOUNIT
/*MainAssistant.prototype.demoUnitGotNDUID = function(mynduid) {
	var url = "http://pvs.omoco.de/paket/demounit.php?nduid=" + mynduid + "&version=" + Mojo.appInfo.version;
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: function(value){},
		onFailure: function(value){}
	});
}*/

MainAssistant.prototype.startHelp = function(event) {
	Mojo.Controller.getAppController().getStageController('main').pushScene("res-topics");
}

MainAssistant.prototype.startFaqs = function(event) {
	Mojo.Controller.getAppController().getStageController('main').pushScene("res-faqs");
}

MainAssistant.prototype.requestSuccess = function(resp){
	if(resp.responseText != "") {
		var tmpResp = resp.responseText.split(";");
		if(tmpResp.length == 2) {
			if(tmpResp[0] != CHECKSERVERLAST) {
				CHECKSERVERLAST = tmpResp[0];
				setPrefsCookie();
				
				if(tmpResp[1] == "updateavailable") {
					this.controller.showAlertDialog({
						onChoose: function(value) {
							if(value) {
								this.controller.serviceRequest("palm://com.palm.applicationManager", {
									method: "open",
									parameters: {
										id: "com.palm.app.findapps",
										params: {
											target: "http://developer.palm.com/webChannel/index.php?packageid=de.omoco.paketverfolgung"
										}
									}
								});
							}
						},
						title: $L("Update available"),
						message: $L("There is a new version of this app available."),
						choices:[
							{label:$L("Open AppCatalog"), value:true},
							{label:$L("Cancel"), value:false}    
						]
					});
				} else {
					this.controller.showAlertDialog({
						onChoose: function(value) {},
						title: $L("Notice"),
						message: tmpResp[1],
						allowHTMLMessage: true,
						choices:[ {label:'OK', value:'OK', type:'color'} ]
					});
				}
			}
		}
	}
}

MainAssistant.prototype.requestFailure = function(resp){
}

MainAssistant.prototype.filterFunction = function(filterString, listWidget, offset, count) {
	//Mojo.Log.info(filterString + ";" + listWidget + ";" + offset + ";" + count);
	
	var subset = [];
	var totalSubsetSize = 0;
		
	var i = 0;
	for( var i; i <  PARCELS.length; i++) {
		if (PARCELS[i].name.toLowerCase().include(filterString.toLowerCase()) || PARCELS[i].servicename.toLowerCase().include(filterString.toLowerCase()) || PARCELS[i].parcelid.toLowerCase().include(filterString.toLowerCase())) {
			if (subset.length < count && totalSubsetSize >= offset) {
				subset.push(PARCELS[i]);
			}
			totalSubsetSize++;
		}
	}

	listWidget.mojo.noticeUpdatedItems(offset, subset);

	if (this.filter !== filterString) {
		listWidget.mojo.setLength(totalSubsetSize);
		listWidget.mojo.setCount(totalSubsetSize);
	}
	this.filter = filterString;
}

MainAssistant.prototype.dbSuccess = function(event) {
}

MainAssistant.prototype.dbFailure = function(event) {
}

MainAssistant.prototype.itemDeleted = function(event) {
	PARCELS = listModel.items;
	PARCELS.splice(event.index, 1);

	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
}

MainAssistant.prototype.itemReordered = function(event) {
	PARCELS = listModel.items;
	
	PARCELS.splice(event.fromIndex, 1);
	PARCELS.splice(event.toIndex, 0, event.item);
	
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
}

MainAssistant.prototype.itemAdd = function(event) {
	this.controller.showDialog({
		template: 'main/dialog-scene',
		assistant: new MainDialogAssistant(this, this.spinnerTopModel, this.autoSortParcels.bind(this)),
		preventCancel: false
	});
}

// -- LITE START --
/*
MainAssistant.prototype.itemAdd = function(event) {
	if(PARCELS.length < 2) {
		this.controller.showDialog({
			template: 'main/dialog-scene',
			assistant: new MainDialogAssistant(this, this.spinnerTopModel, this.autoSortParcels.bind(this)),
			preventCancel: false
		});
	} else {
		this.liteversion();
	}
}

MainAssistant.prototype.liteversion = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.liteversion2(value)},
		title: $L("Maximum No. of packages in list"),
		allowHTMLMessage: true,
		message: $L("The Lite version can only track a maximum of two packages.<br><br>To add another package please buy the full version of delete an existing package."),
		choices:[
			{label:$L("Open AppCatalog"), value:true, type:'affirmative'},
			{label:$L("Cancel"), value: false}
		]
	});
}

MainAssistant.prototype.liteversion2 = function(opencatalog) {
	if(opencatalog) {
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: "open",
			parameters: {
				id: "com.palm.app.findapps",
				params: {
					target: "http://developer.palm.com/webChannel/index.php?packageid=de.omoco.paketverfolgung"
				}
			}
		});
	}
}
*/
// --LITE STOPP --

MainAssistant.prototype.itemTap = function(event) {
	//Mojo.Controller.stageController.pushScene("details", event.index);
	Mojo.Controller.getAppController().getStageController('main').pushScene("details", event.item.parcelid);
}

MainAssistant.prototype.autoSortParcels = function(event){
	if (AUTOSORT == 1) {
		PARCELS.sort(this.sortListByName);
	} else if (AUTOSORT == 3) {
		PARCELS.sort(this.sortListByStatus);
	} else if (AUTOSORT == 5) {
		PARCELS.sort(this.sortListByChanged);
	} else if (AUTOSORT == 7) {
		PARCELS.sort(this.sortListByService);
	} else if (AUTOSORT == 9) {
		PARCELS.sort(this.sortListByTimecreated);
	} else if (AUTOSORT == 11) {
		PARCELS.sort(this.sortListByLastmodified);
	}
	
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
}

MainAssistant.prototype.activate = function(event) {
	listModel.items = PARCELS;	
	this.controller.modelChanged(listModel);
};

MainAssistant.prototype.deactivate = function(event) {
};

MainAssistant.prototype.cleanup = function(event) {
};

MainAssistant.prototype.refreshAll = function() {
	if(PARCELS.length > 0) {
		this.parcelscounter = PARCELS.length;
		
		this.spinnerTopModel.spinning = true;
		this.controller.modelChanged(this.spinnerTopModel);
		
		for(var i=0; i<PARCELS.length; i++) {
			if(PARCELS[i].status < 5) {
				var tmpparcel = new Parcel(i, this.refreshAllCallback.bind(this));
				tmpparcel.refresh();
			} else {
				this.parcelscounter--;
				if(this.parcelscounter == 0) {
					this.autoSortParcels();
					listModel.items = PARCELS;	
					this.controller.modelChanged(listModel);
					
					this.spinnerTopModel.spinning = false;
					this.controller.modelChanged(this.spinnerTopModel);
				}
			}
		}
		
		listModel.items = PARCELS;
		this.controller.modelChanged(listModel);
	}
};

MainAssistant.prototype.refreshAllCallback = function(event) {
	listModel.items = PARCELS;	
	this.controller.modelChanged(listModel);
	
	this.parcelscounter--;
	if(this.parcelscounter == 0) {
		this.autoSortParcels();
		listModel.items = PARCELS;	
		this.controller.modelChanged(listModel);
		
		this.spinnerTopModel.spinning = false;
		this.controller.modelChanged(this.spinnerTopModel);
	}
};

MainAssistant.prototype.sortList = function(bywhat) {
	if(bywhat == "name") {
		PARCELS.sort(this.sortListByName);
		if(this.sortReverse[0]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[0] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[0] = true;
		}
	} else 	if(bywhat == "status") {
		PARCELS.sort(this.sortListByStatus);
		if(this.sortReverse[1]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[1] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[1] = true;
		}
	} else 	if(bywhat == "changed") {
		PARCELS.sort(this.sortListByChanged);
		if(this.sortReverse[2]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[2] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[2] = true;
		}
	} else 	if(bywhat == "service") {
		PARCELS.sort(this.sortListByService);
		if(this.sortReverse[3]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[3] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[3] = true;
		}
	} else 	if(bywhat == "timecreated") {
		PARCELS.sort(this.sortListByTimecreated);
		if(this.sortReverse[4]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[4] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[4] = true;
		}
	} else 	if(bywhat == "lastmodified") {
		PARCELS.sort(this.sortListByLastmodified);
		if(this.sortReverse[5]) {
			PARCELS.reverse();
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[5] = false;
		} else {
			this.sortReverse = [false, false, false, false, false, false];
			this.sortReverse[5] = true;
		}
	}
	
	listModel.items = PARCELS;	
	this.controller.modelChanged(listModel);
	
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
}

MainAssistant.prototype.sortListByName = function(a, b) {
	if (a.name > b.name) return 1;
	if (a.name < b.name) return -1;
	if (a.name == b.name) return 0;
}

MainAssistant.prototype.sortListByStatus = function(a, b) {
	var atimecreated = 9999999999999 - a.timecreated;
	var btimecreated = 9999999999999 - b.timecreated;
	
	if ((a.status+"_"+atimecreated) > (b.status+"_"+btimecreated)) return 1;
	if ((a.status+"_"+atimecreated) < (b.status+"_"+btimecreated)) return -1;
	if ((a.status+"_"+atimecreated) == (b.status+"_"+btimecreated)) return 0;
}

MainAssistant.prototype.sortListByChanged = function(a, b) {
	// reverse!
	if (a.bold_s > b.bold_s) return -1;
	if (a.bold_s < b.bold_s) return 1;
	if (a.bold_s == b.bold_s) return 0;
}

MainAssistant.prototype.sortListByService = function(a, b) {
	if ((a.servicename+"_"+a.name) > (b.servicename+"_"+b.name)) return 1;
	if ((a.servicename+"_"+a.name) < (b.servicename+"_"+b.name)) return -1;
	if ((a.servicename+"_"+a.name) == (b.servicename+"_"+b.name)) return 0;
}

MainAssistant.prototype.sortListByTimecreated = function(a, b) {
	if (a.timecreated > b.timecreated) return 1;
	if (a.timecreated < b.timecreated) return -1;
	if (a.timecreated == b.timecreated) return 0;
}

MainAssistant.prototype.sortListByLastmodified = function(a, b) {
	// reverse!
	if (a.lastmodified > b.lastmodified) return -1;
	if (a.lastmodified < b.lastmodified) return 1;
	if (a.lastmodified == b.lastmodified) return 0;
}

MainAssistant.prototype.markreadAll = function() {
	for(var i=0; i < PARCELS.length; i++) {
		PARCELS[i].bold_s = "";
		PARCELS[i].bold_e = "";
		PARCELS[i].refreshing = "";
	}
	
	listModel.items = PARCELS;	
	this.controller.modelChanged(listModel);
	
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
}

MainAssistant.prototype.deleteAll = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.deleteAllConfirm(value)},
		title: $L("Delete Packages"),
		message: $L("Delete all packages?"),
		choices:[
			{label:$L("Delete all"), value:true, type:'negative'},
			{label:$L("Cancel"), value:false}    
		]
	});
}

MainAssistant.prototype.deleteAllConfirm = function(reallyDelete) {
	if(reallyDelete) {
		PARCELS = [];

		listModel.items = PARCELS;	
		this.controller.modelChanged(listModel);

		this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
		
		Mojo.Controller.getAppController().showBanner({messageText: $L("All packages deleted.")}, "", "");
	}
}

MainAssistant.prototype.deleteReady = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.deleteReadyConfirm(value)},
		title: $L("Delete Packages"),
		message: $L("Delete all delivered packages?"),
		choices:[
			{label:$L("Delete all delivered"), value:0, type:'negative'},
			{label:$L("All older than two weeks"), value:(1000*60*60*24*14), type:'negative'},
			{label:$L("All older than four weeks"), value:(1000*60*60*24*28), type:'negative'},
			{label:$L("Cancel"), value: -1}
		]
	});
}

MainAssistant.prototype.deleteReadyConfirm = function(reallyDelete) {
	var dateNow = new Date();
	var dateNowTS = dateNow.getTime();
	
	if(reallyDelete != -1) {
		var tmpLength = PARCELS.length;
		var tmpDeletedItems = 0;
		for(var i=0; i < tmpLength; i++) {
			if(PARCELS[(i-tmpDeletedItems)].status == 5 && PARCELS[(i-tmpDeletedItems)].lastmodified < (dateNowTS - reallyDelete)) {
				PARCELS = listModel.items;
				PARCELS.splice((i-tmpDeletedItems), 1);
				
				tmpDeletedItems++;
			}
		}

		listModel.items = PARCELS;	
		this.controller.modelChanged(listModel);

		this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
		
		Mojo.Controller.getAppController().showBanner({messageText: $L("All delivered packages deleted.")}, "", "");
	}
}

MainAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.commandEnable && (event.command == Mojo.Menu.helpCmd || event.command == Mojo.Menu.prefsCmd)) {
		event.stopPropagation();
	}

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Controller.getAppController().getStageController('main').pushAppSupportInfoScene();
				break;
			case Mojo.Menu.prefsCmd:
				Mojo.Controller.getAppController().getStageController('main').pushScene("preferences");
				break;
			case "sortbyname":
				this.sortList("name");
				break;
			case "sortbystatus":
				this.sortList("status");
				break;
			case "sortbychanged":
				this.sortList("changed");
				break;
			case "sortbyservice":
				this.sortList("service");
				break;
			case "sortbytimecreated":
				this.sortList("timecreated");
				break;
			case "sortbylastmodified":
				this.sortList("lastmodified");
				break;
			case "markread":
				this.markreadAll();
				break;
			case "deleteall":
				this.deleteAll();
				break;
			case "deleteready":
				this.deleteReady();
				break;
			// -- LITE START --
			case "importparcels":
				Mojo.Controller.getAppController().getStageController('main').pushScene("importparcels");
				break;
			// -- LITE STOPP --
		}
	}
		  
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'newparcel':
				this.itemAdd();
				break;
			case 'refreshall':
				this.refreshAll();
				break;
		}
	}
}
