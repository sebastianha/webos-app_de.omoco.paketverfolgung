function Parcel(id, callback) {
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	this.id = id;
	this.parcelid = PARCELS[this.id].parcelid;
	this.callback = callback;
	
	this.alreadynotified = false;
}

Parcel.prototype.refresh = function() {
	var nothingfound = true;
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == this.parcelid) {
			this.id = i;
			nothingfound = false;
			break;
		}
	}
	if(nothingfound) {
		Mojo.Log.warn("Package seems to be deleted during refresh.");
		return;
	}
	
	PARCELS[this.id].refreshing = "<img src=\"images/refreshing.png\">";
	
	var service = new NullService();
	for(var i = 0; i < SERVICES.length; i++) {
		if(PARCELS[this.id].servicename == SERVICES[i].name) {
			service = Object.clone(SERVICES[i].serviceobject);
		}
	}
	service.init(PARCELS[this.id].parcelid, this.callbackStatus.bind(this), this.refreshDetails.bind(this), this.refreshError.bind(this));
	service.getDetails();
};

Parcel.prototype.callbackStatus = function(status) {
	var nothingfound = true;
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == this.parcelid) {
			this.id = i;
			nothingfound = false;
			break;
		}
	}
	if(nothingfound) {
		Mojo.Log.warn("Package seems to be deleted during refresh.");
		return;
	}
	
	PARCELS[this.id].refreshing = "";
	
	if(PARCELS[this.id].status < status) {
		PARCELS[this.id].status = status;

		// notify does not check again the id!
		this.notify();
	}
	
	this.callback();
};

Parcel.prototype.refreshDetails = function(details) {
	var nothingfound = true;
	for(var i=0; i<PARCELS.length; i++) {
		if(PARCELS[i].parcelid == this.parcelid) {
			this.id = i;
			nothingfound = false;
			break;
		}
	}
	if(nothingfound) {
		Mojo.Log.warn("Package seems to be deleted during refresh.");
		return;
	}
		
	if(NOTIFYSMALLMESSAGE) {
		if(details.length > PARCELS[this.id].detailsstatus) {
			// notify does not check again the id!
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
};

Parcel.prototype.refreshError = function(message) {
	Mojo.Log.error(message);
};

Parcel.prototype.notify = function() {
	var dateNow = new Date();
	//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
	var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
	var dateNowTS = dateNow.getTime();
	PARCELS[this.id].lastmodified = dateNowTS;
	PARCELS[this.id].lastmodifiedstring = dateNowString;
	PARCELS[this.id].bold_s = "<b>";
	PARCELS[this.id].bold_e = "</b>";
	this.parcelsDepot.add("parcels", PARCELS, this.dbSuccess, this.dbFailure);
	
	// notify user only once per parcel!
	if(NOTIFYSMALLMESSAGE) {
		if(this.alreadynotified) {
			this.alreadynotified = false;
			return;
		} else {
			this.alreadynotified = true;
		}
	}

	if(DASHBOARD) {
		if(Mojo.Controller.getAppController().getStageController('dash') != null && (Mojo.Controller.getAppController().getStageController('main') == null || !Mojo.Controller.getAppController().getStageController('main').isActiveAndHasScenes())) {
			//Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-subtitle').innerText = "Es gibt neue Änderungen";
			Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-title').innerText = $L("Package ") + PARCELS[this.id].name + ":";
			var statusText = "";
			if(PARCELS[this.id].status == 0) {
				statusText = $L("Status unknown");
			} else if(PARCELS[this.id].status == 1) {
				statusText = $L("Shipment information received");
			} else if(PARCELS[this.id].status == 2) {
				statusText = $L("Transport to sort facility");
			} else if(PARCELS[this.id].status == 3) {
				statusText = $L("Arrived at sort facility");
			} else if(PARCELS[this.id].status == 4) {
				statusText = $L("Out for delivery");
			} else if(PARCELS[this.id].status == 5) {
				statusText = $L("Delivered");
			} else {
				statusText = $L("Status error");
			}
			Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-subtitle').innerText = statusText;
			
			Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-tasks').removeClassName("single");
			var tmpCount = parseInt(Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-count').innerText);
			tmpCount++;
			Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-count').innerText = tmpCount.toString();
			Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-countbox').style.display = null;
			
			Mojo.Controller.getAppController().getStageController('dash').indicateNewContent(true);
		}
	}
	
	if(NOTIFYMESSAGE) {
		new Mojo.Service.Request("palm://com.palm.power/com/palm/power", {
			method: "activityStart",
			parameters: {
				id: "foundchanges",
				duration_ms: '5000'
			}
		});
		
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

Parcel.prototype.dbSuccess = function(event) {
}

Parcel.prototype.dbFailure = function(event) {
}