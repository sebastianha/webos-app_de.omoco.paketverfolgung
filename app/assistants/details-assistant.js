function DetailsAssistant(parcelid) {
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == parcelid) {
			this.id = i;
			break;
		}
	}
	
	this.reloading = false;
}

DetailsAssistant.prototype.setup = function() {
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	this.controller.setupWidget(Mojo.Menu.appMenu,
		this.attributes = {
			omitDefaultItems: false
		},
		this.model = {
			visible: true,
			items: [
				{
					label: $L("Refresh"),
					command: "refresh",
					shortcut: "r",
					disabled: false
				},
				{
					label: $L("Edit Package"),
					command: "edit",
					shortcut: "e",
					disabled: false
				},
				{
					label: $L("Delete Package"),
					command: "delete",
					shortcut: "d",
					disabled: false
				},
			]
		}
	);
	
	this.commandMenuAttributes = {
		menuClass: 'no-fade'
	};
	this.commandMenuModel = {
		items: [
			{
				iconPath: 'images/editparcel.png',
				command: 'edit',
				disabled: false
			},
			{
				items: [
					{
						icon:'back',
						command: 'back',
						disabled: true
					}, {
						label:'0/0',
						command: 'refresh',
						disabled: false
					}, {
						icon:'forward',
						command: 'forward',
						disabled: true
					}
				]
			},
			{
				icon:'delete',
				command: 'delete',
				disabled: false
			}
		]
	};
	this.controller.setupWidget(
		Mojo.Menu.commandMenu, 
		this.commandMenuAttributes,
		this.commandMenuModel
	);	

	this.origSceneColor = this.controller.document.body.style.backgroundColor;

	this.spinnerTopLAttrs = {spinnerSize: 'small'};
	this.spinnerTopModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner_top', this.spinnerTopLAttrs, this.spinnerTopModel);
		
	this.spinnerLAttrs = {spinnerSize: 'small'};
	this.spinnerModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner', this.spinnerLAttrs, this.spinnerModel);
	
	detailsListModel = {
		listTitle: 'Details',
		items : []
	}
	
	var tmpColorDetails = "";
	if(COLORDETAILS)
		tmpColorDetails = "c";
	
	this.controller.setupWidget("detailslist",
		this.attributes = {
			itemTemplate:  'details/listitem' + tmpColorDetails,
			listTemplate:  'details/listcontainer',
			emptyTemplate: 'details/emptylist',
			swipeToDelete: false,
			reorderable: false,
			renderLimit: 25
		},
		this.model = detailsListModel
	);

	if(SHOWMAP)
		this.controller.get("mapcontainer").style.display = "block";

	this.controller.listen("trackingsite", Mojo.Event.tap, this.openTrackingSite.bindAsEventListener(this));
	this.controller.listen("info", Mojo.Event.hold, this.infoHold.bindAsEventListener(this));
	this.controller.listen("map", Mojo.Event.tap, this.mapTap.bindAsEventListener(this));
	this.controller.listen("detailslist", Mojo.Event.hold, this.detailslistHold.bindAsEventListener(this));
	this.controller.listen("detailslist", Mojo.Event.listTap, this.detailslistTap.bindAsEventListener(this));

	this.trackingUrl = "http://omoco.de";
	this.loadData();
};

DetailsAssistant.prototype.openTrackingSite = function() {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters:  {
			id: 'com.palm.app.browser',
			params: {
				target: this.trackingUrl
			}
		}
	});
}

DetailsAssistant.prototype.loadData = function() {
	this.alreadynotified = false;
	
	this.controller.get('warning').hide();
	
	PARCELS[this.id].bold_s = "";
	PARCELS[this.id].bold_e = "";
	PARCELS[this.id].refreshing = "";
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
	
	this.controller.get('parcelname').innerText = $L("Tracking ID: ") + PARCELS[this.id].parcelid;
	
	this.controller.get('info').innerHTML = "<table border=0 cellpadding=0 cellspacing=0><tr><td width=75 valign=top><b>Name:</b></td><td>" + PARCELS[this.id].name + "</td></tr>" + 
		$L("<tr><td><b>Service:</b></td><td>") + PARCELS[this.id].servicename + "</td></tr>" +
		$L("<tr><td><b>Created:</b></td><td>") + PARCELS[this.id].timecreatedstring + "</td></tr>" +
		$L("<tr><td><b>Update:</b></td><td>") + PARCELS[this.id].lastmodifiedstring + "</td></tr></table>";
	
	this.lastMapLocation = "";
	this.lastMapLocations = [];
	this.controller.get('map').name = "zoom0";
	this.controller.get('map').style.height = "45px";
	this.controller.get('map').style.backgroundImage = "url(images/map_default_g.png)";
	//this.controller.get('map').style.backgroundImage = "url(http://maps.google.com/maps/api/staticmap?center=Hannover,Germany&zoom=5&size=301x110&maptype=roadmap&sensor=false)";
	//this.controller.get('map').style.backgroundImage = "url(http://maps.google.com/maps/api/staticmap?center=42,0&zoom=0&size=301x110&maptype=roadmap&sensor=false)";

	if(USECACHE && PARCELS[this.id].detailscached != null && PARCELS[this.id].detailscached != "")
		detailsListModel.items = PARCELS[this.id].detailscached.evalJSON();
	else
		detailsListModel.items = [];
	this.controller.modelChanged(detailsListModel);

	if(USECACHE && PARCELS[this.id].detailscached != null && PARCELS[this.id].detailscached != "" && PARCELS[this.id].status == 5 && this.reloading == false) {
		this.spinnerTopModel.spinning = false;
		this.controller.modelChanged(this.spinnerTopModel);
	
		this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		
		this.setArrows();
		
		var invertIcons = "";
		if(DARKTHEME) 
			invertIcons = "i";
		
		var history = "<center><table border=0 cellpadding=0 cellspacing=0><tr>";
		history = history + "<td align=center><img src='images/status_1_d" + invertIcons + ".png'></td>";
		history = history + "<td align=center><img src='images/status_2_d" + invertIcons + ".png'></td>";
		history = history + "<td align=center><img src='images/status_3_d" + invertIcons + ".png'></td>";
		history = history + "<td align=center><img src='images/status_4_d" + invertIcons + ".png'></td>";
		history = history + "<td align=center><img src='images/status_5_d" + invertIcons + ".png'></td>";
		history = history + "</tr></table></center>";
		
		this.controller.get('history').innerHTML = history;
		
		detailsListModel.items = PARCELS[this.id].detailscached.evalJSON();
		this.controller.modelChanged(detailsListModel);
		
		var service = new NullService();
		for(var i = 0; i < SERVICES.length; i++) {
			if(PARCELS[this.id].servicename == SERVICES[i].name) {
				service = Object.clone(SERVICES[i].serviceobject);
			}
		}
		
		service.init(PARCELS[this.id].parcelid, null, null, null);
		this.trackingUrl = service.getTrackingUrl();
		if(COLORDETAILS)
			this.controller.document.body.style.backgroundColor = service.getColor();
	} else {
		this.reloading = false;
		
		this.controller.get('history').innerHTML = "";
		
		this.commandMenuModel.items[1].items[1].label = (this.id+1) + "/" + PARCELS.length;
		this.commandMenuModel.items[1].items[0].disabled = true;
		this.commandMenuModel.items[1].items[1].disabled = true;
		this.commandMenuModel.items[1].items[2].disabled = true;
		this.controller.modelChanged(this.commandMenuModel);
		
		this.spinnerTopModel.spinning = true;
		this.controller.modelChanged(this.spinnerTopModel);
	
		this.spinnerModel.spinning = true;
		this.controller.modelChanged(this.spinnerModel);
		
		var service = new NullService();
		for(var i = 0; i < SERVICES.length; i++) {
			if(PARCELS[this.id].servicename == SERVICES[i].name) {
				service = Object.clone(SERVICES[i].serviceobject);
			}
		}
		
		service.init(PARCELS[this.id].parcelid, this.callbackStatus.bind(this), this.refreshDetails.bind(this), this.refreshError.bind(this));
		this.trackingUrl = service.getTrackingUrl();
		if(COLORDETAILS)
			this.controller.document.body.style.backgroundColor = service.getColor();
		service.getDetails();
	}
}

DetailsAssistant.prototype.infoHold = function() {
	Mojo.Controller.getAppController().showBanner({messageText: $L("Package information copied")}, "", "");
	var tmpContent = "Name: " + PARCELS[this.id].name + $L("\nID: ") + PARCELS[this.id].parcelid + $L("\nService: ") + PARCELS[this.id].servicename + $L("\nCreated: ") + PARCELS[this.id].timecreatedstring + $L(" \nLast Update: ") + PARCELS[this.id].lastmodifiedstring;
	this.controller.stageController.setClipboard(tmpContent, true);
}

DetailsAssistant.prototype.detailslistHold = function() {
	Mojo.Controller.getAppController().showBanner({messageText: $L("Package details copied")}, "", "");
	var tmpContent = "Name: " + PARCELS[this.id].name + $L("\nID: ") + PARCELS[this.id].parcelid + $L("\nService: ") + PARCELS[this.id].servicename + $L("\nCreated: ") + PARCELS[this.id].timecreatedstring + $L(" \nLast Update: ") + PARCELS[this.id].lastmodifiedstring;
	tmpContent = tmpContent + "\n";
	
	for(var i = 0; i < detailsListModel.items.length; i++) {
		tmpContent = tmpContent + (i+1) + ") " + detailsListModel.items[i].date + " " + detailsListModel.items[i].location + ":\n" + detailsListModel.items[i].notes + "\n";
	}
	
	this.controller.stageController.setClipboard(tmpContent, true);
}

DetailsAssistant.prototype.mapRefresh = function(location, locations) {
	if (location) {
		this.lastMapLocation = location;
	}
	if(locations) {
		this.lastMapLocations = locations;
	}
	if(this.lastMapLocation != "") {
		var mapzoom = 10;
		var mapheight = 110;
		if (this.controller.get('map').name == "zoom1") {
			mapzoom = MAPZOOM;
			mapheight = 233;
		}
		if (this.controller.get('map').name == "zoom2") {
			mapzoom = parseInt(MAPZOOM/2);
			mapheight = 233;
		}
		var mapurl = "http://maps.google.com/maps/api/staticmap?center=" + escape(this.lastMapLocation.replace("&nbsp", " ").replace(/ +(?= )/g,'').replace(/[^a-zA-Z 0-9]+/g, '')) + "&zoom=" + mapzoom + "&size=301x" + mapheight + "&maptype=roadmap&sensor=false";
		
		if (this.controller.get('map').name == "zoom3") {
			mapurl = "http://maps.google.com/maps/api/staticmap?center=40,0&zoom=0&size=301x233&maptype=roadmap&sensor=false";
		}
		
		var maplocations = "";
		if(this.lastMapLocations != "" && this.controller.get('map').name != "zoom0") {
			for (var i = 0; i < this.lastMapLocations.length; i++) {
				var maplabel = "";
				if((this.lastMapLocations.length-i-1) < 26) {
					maplabel = String.fromCharCode(65+(this.lastMapLocations.length-i-1));
				}
				var islocation = "blue";
				if(this.lastMapLocations[i] == this.lastMapLocation)
					islocation = "green";
				maplocations += "&markers=color:" + islocation + "|label:" + maplabel + "|" + escape(this.lastMapLocations[i].replace("&nbsp", " ").replace(/ +(?= )/g,'').replace(/[^a-zA-Z 0-9]+/g, ''));
			}
		}
		
		mapurl = mapurl + maplocations;

		if(SHOWMAP)
			this.controller.get('map').style.backgroundImage = "url(" + mapurl + ")";
	}
}

DetailsAssistant.prototype.detailslistTap = function(event) {
	if(SHOWMAP){
		if(event.item.location && event.item.location != "") {
			// Damit die Karte auch Marker anzeigt, wenn die Details aus dem Cache kommen
			if(USECACHE && PARCELS[this.id].detailscached != null && PARCELS[this.id].detailscached != "" && this.lastMapLocation == "") {
				var tmpLocations = []
				var details = PARCELS[this.id].detailscached.evalJSON();
				for(var i=0; i<details.length; i++) {
					if(details[i] && details[i].location && details[i].location != "")
						tmpLocations.push(details[i].location);
					else
						tmpLocations.push("");
				}
				this.mapRefresh(event.item.location, tmpLocations);
			} else {
				this.mapRefresh(event.item.location);
			}
		}
	}
}

DetailsAssistant.prototype.mapTap = function(event) {
	if (this.lastMapLocation != "") {
		if (this.controller.get('map').name == "zoom0") {
			this.controller.get('map').name = "zoom1";
			this.controller.get('map').style.height = "200px";
		} else if (this.controller.get('map').name == "zoom1") {
			this.controller.get('map').name = "zoom2";
		} else if (this.controller.get('map').name == "zoom2") {
			this.controller.get('map').name = "zoom3";
		} else if (this.controller.get('map').name == "zoom3") {
			this.controller.get('map').name = "zoom1";
		}	
		/*} else {
			this.controller.get('map').name = "zoom0";
			this.controller.get('map').style.height = "45px";
		}*/
	}
	this.mapRefresh();
}

DetailsAssistant.prototype.setArrows = function() {
	this.commandMenuModel.items[1].items[1].label = (this.id+1) + "/" + PARCELS.length;
	this.commandMenuModel.items[1].items[1].disabled = false;
	
	if(this.id > 0)
		this.commandMenuModel.items[1].items[0].disabled = false;
	else
		this.commandMenuModel.items[1].items[0].disabled = true;
	if(this.id < (PARCELS.length-1))
		this.commandMenuModel.items[1].items[2].disabled = false;
	else
		this.commandMenuModel.items[1].items[2].disabled = true;
		
	this.controller.modelChanged(this.commandMenuModel);
}

DetailsAssistant.prototype.dbSuccess = function(event) {
}

DetailsAssistant.prototype.dbFailure = function(event) {
}

DetailsAssistant.prototype.callbackStatus = function(status) {
	if(PARCELS[this.id].status < status) {
		PARCELS[this.id].status = status;

		this.notify();
	} else if(PARCELS[this.id].status > status) {
		this.controller.get('warning').show();
	}
	
	this.setArrows();
	
	this.spinnerModel.spinning = false;
	this.controller.modelChanged(this.spinnerModel);

	this.spinnerTopModel.spinning = false;
	this.controller.modelChanged(this.spinnerTopModel);

	var invertIcons = "";
	if(DARKTHEME)
		invertIcons = "i";

	var history = "<center><table border=0 cellpadding=0 cellspacing=0><tr>";	
	if(status >= 0) {
		if(status >= 1) {
			history = history + "<td align=center><img src='images/status_1_d" + invertIcons + ".png'></td>";
		} else {
			history = history + "<td align=center><img src='images/status_1_d2" + invertIcons + ".png'></td>";
		}
		if(status >= 2) {
			history = history + "<td align=center><img src='images/status_2_d" + invertIcons + ".png'></td>";
		} else {
			history = history + "<td align=center><img src='images/status_2_d2" + invertIcons + ".png'></td>";
		}
		if(status >= 3) {
			history = history + "<td align=center><img src='images/status_3_d" + invertIcons + ".png'></td>";
		} else {
			history = history + "<td align=center><img src='images/status_3_d2" + invertIcons + ".png'></td>";
		}
		if(status >= 4) {
			history = history + "<td align=center><img src='images/status_4_d" + invertIcons + ".png'></td>";
		} else {
			history = history + "<td align=center><img src='images/status_4_d2" + invertIcons + ".png'></td>";
		}
		if(status >= 5) {
			history = history + "<td align=center><img src='images/status_5_d" + invertIcons + ".png'></td>";
		} else {
			history = history + "<td align=center><img src='images/status_5_d2" + invertIcons + ".png'></td>";
		}
	} else {
		history = history + "<td align=center width=60><img src='images/status_-1_d" + invertIcons + ".png'></td><td align=center valign=top style=\"font-size:14px;color:red\">Abruf der Details fehlgeschlagen, bitte Sendungsnummer überprüfen!</td>";
	}
	history = history + "</tr></table></center>";

	
	this.controller.get('history').innerHTML = history;
};

DetailsAssistant.prototype.refreshDetails = function(details) {
	detailsListModel.items = details;
	this.controller.modelChanged(detailsListModel);
	
	if(NOTIFYSMALLMESSAGE) {
		if(details.length > PARCELS[this.id].detailsstatus) {
			this.notify();
		}
	}
	
	if(NOTIFYSMALLMESSAGE || USECACHE) {
		if(details.length > PARCELS[this.id].detailsstatus) {
			PARCELS[this.id].detailsstatus = details.length;
			PARCELS[this.id].detailscached = Object.toJSON(details);
			this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
		}
	}
	
	if(SHOWMAP) {
		if(details[0] && details[0].location && details[0].location != "") {
			var tmpLocations = []
			for(var i=0; i<details.length; i++) {
				if(details[i] && details[i].location && details[i].location != "")
					tmpLocations.push(details[i].location);
				else
					tmpLocations.push("");
			}
			this.mapRefresh(details[0].location, tmpLocations);
		}
	}
};

DetailsAssistant.prototype.refreshError = function(message) {
	Mojo.Log.error(message);
};

DetailsAssistant.prototype.notify = function() {
	var dateNow = new Date();
	//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
	var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
	var dateNowTS = dateNow.getTime();
	PARCELS[this.id].lastmodified = dateNowTS;
	PARCELS[this.id].lastmodifiedstring = dateNowString;
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);

	this.controller.get('info').innerHTML = "<table border=0 cellpadding=0 cellspacing=0><tr><td width=75 valign=top><b>Name:</b></td><td>" + PARCELS[this.id].name + "</td></tr>" + 
		$L("<tr><td><b>Service:</b></td><td>") + PARCELS[this.id].servicename + "</td></tr>" +
		$L("<tr><td><b>Created:</b></td><td>") + PARCELS[this.id].timecreatedstring + "</td></tr>" +
		$L("<tr><td><b>Update:</b></td><td>") + PARCELS[this.id].lastmodifiedstring + "</td></tr></table>";
	
	// notify user only once per parcel!
	if(NOTIFYSMALLMESSAGE) {
		if(this.alreadynotified) {
			this.alreadynotified = false;
			return;
		} else {
			this.alreadynotified = true;
		}
	}
	
	if(NOTIFYMESSAGE) {
		/*new Mojo.Service.Request("palm://com.palm.power/com/palm/power", {
			method: "activityStart",
			parameters: {
				id: "foundchanges",
				duration_ms: '5000'
			}
		});*/
		
		var parcelName = {name: PARCELS[this.id].name};
		Mojo.Controller.getAppController().showBanner({messageText: $L("Status Update: #{name}").interpolate(parcelName)}, "", "");
		
		if(NOTIFYSOUND) {
			Mojo.Log.info("SYSTEMTONE SOUNDS");
			Mojo.Controller.getAppController().playSoundNotification("notifications", "", 1000);
		}
		else if(NOTIFYRINGTONE) {
			Mojo.Log.info("A REAL RINGTONE SOUNDS");
			if(NOTIFYRINGTONEFILE != "") {
				Mojo.Controller.getAppController().playSoundNotification("notifications", NOTIFYRINGTONEFILE, 1000);
			} else {
				Mojo.Log.info("RINGTONE NOT SET!!!");
				Mojo.Controller.getAppController().playSoundNotification("notifications", "", 1000);
			}
		}
		else if(NOTIFYVIBRATE) {
			Mojo.Controller.getAppController().playSoundNotification("vibrate", "", 1000);
		}
	}
	
	// WARNING - this point will only be reached once per parcel!
}

DetailsAssistant.prototype.itemDel = function() {
	this.controller.showAlertDialog({
		onChoose: function(value) {this.itemDelConfirm(value)},
		title: $L("Delete Package "),
		message: $L("Really delete package?"),
		choices:[
			{label:$L('Delete'), value:true, type:'negative'},  
			{label:$L("Cancel"), value:false}    
		]
	});
}

DetailsAssistant.prototype.itemDelConfirm = function(reallyDelete) {
	if(reallyDelete) {
		var tmpName = PARCELS[this.id].name;
		
		PARCELS = listModel.items;
		PARCELS.splice(this.id, 1);
	
		this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
		
		var parcelName = {name: tmpName};
		Mojo.Controller.getAppController().showBanner({messageText: $L("Deleted Package #{name}.").interpolate(parcelName)}, "", "");
		Mojo.Controller.getAppController().getStageController('main').popScene();
	}
}

DetailsAssistant.prototype.itemEdit = function() {
	this.controller.showDialog({
		template: 'details/dialog-scene',
		assistant: new DetailsDialogAssistant(this, this.spinnerTopModel, this.spinnerModel, this.id, this.loadData.bind(this)),
		preventCancel: false
	});
}

DetailsAssistant.prototype.activate = function(event) {
};

DetailsAssistant.prototype.deactivate = function(event) {
	if(COLORDETAILS)
		this.controller.document.body.style.backgroundColor = this.origSceneColor;
};

DetailsAssistant.prototype.cleanup = function(event) {
};

DetailsAssistant.prototype.handleCommand = function(event) {
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
		}
	}
		  
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'delete':
				this.itemDel();
				break;
			case 'edit':
				this.itemEdit();
				break;
			case 'back':
				this.id--;
				this.loadData();
				break;
			case 'refresh':
				this.reloading = true;
				this.loadData();
				break;
			case 'forward':
				this.id++;
				this.loadData();
				break;
		}
	}
}
