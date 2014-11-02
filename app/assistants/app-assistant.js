function AppAssistant() {
}

AppAssistant.prototype.setup = function() {
	Mojo.Log.info("AppAssistant.prototype.setup");
	
	LANG = Mojo.Locale.getCurrentLocale();
	if(LANG.split("_").length > 1)
		LANG = LANG.split("_")[0];
}

AppAssistant.prototype.handleLaunch = function(launchParams) {
	if(launchParams.action != null) {
		Mojo.Log.info("LaunchParams");
		if(Mojo.Controller.getAppController().getStageController('main') != null || Mojo.Controller.getAppController().getStageController('dash') != null) {
			if(AUTOREFRESH) {
				Mojo.Log.info("SET NEW ALARM AGAIN");
				setNextAlarm();
				
				if(DASHBOARD) {
					if(Mojo.Controller.getAppController().getStageController('dash') != null) {
						Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon-refresh.png)";
					}
				}
				
				this.parcelscounter = PARCELS.length;
				
				for(var i=0; i<PARCELS.length; i++) {
					if(PARCELS[i].status < 5) {
						var tmpparcel = new Parcel(i, this.refreshCallback.bind(this));
						tmpparcel.refresh();
					} else {
						this.parcelscounter--;
						if(this.parcelscounter == 0) {
							if(DASHBOARD) {
								if(Mojo.Controller.getAppController().getStageController('dash') != null) {
									Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon.png)";
								}
							}
						}
					}
				}
			}
		}
	} else if(Mojo.Controller.getAppController().getStageController('main') == null && Mojo.Controller.getAppController().getStageController('dash') == null) {
		getPrefsCookie();
	
		listModel = {
			listTitle: $L("Packages"),
			items : []
		}
		
		//MANAGE SERVICES
		// GET SERVICESSRC FROM DB
		this.getServicesDbSuccess(null);
		// GET SERVICESSRC FROM DB
		
		/*var depotoptions = {
			name: "servicesdepot",
			version: 1,
			replace: false
		};
		this.servicesDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
		
		this.servicesDepot.get("services", this.getServicesDbSuccess.bind(this), this.getServicesDbFailure);*/
		//MANAGE SERVICES END
		
	} else if(Mojo.Controller.getAppController().getStageController('main') == null) {
		if(DASHBOARD) {
			if(Mojo.Controller.getAppController().getStageController('dash') != null) {
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-title').innerText = "Paketverfolgung";
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-subtitle').innerText = "Hier tippen zum Öffnen";
			
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-tasks').addClassName("single");
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-count').innerText = "0";
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-countbox').style.display = 'none';
			}
		}
		
		var pushMainScene = function(stageController){
			stageController.pushScene('main');
		};
		
		var stageArgs = {
			name: 'main',
	        lightweight: true
	    };
		
	    Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
	} else {
		Mojo.Controller.getAppController().getStageController('main').activate();
	}
}

AppAssistant.prototype.dbSuccess = function(event){
}

AppAssistant.prototype.dbFailure = function(event){
}

AppAssistant.prototype.getServicesDbSuccess = function(event){
	//MANAGE SERVICES
	SERVICESSRC = DEFAULTSERVICESSRC;
	
	/*if (event != null && event != []) {
		Mojo.Log.info("Services DB found");
		SERVICESSRC = event;
	} else {
		Mojo.Log.info("Services DB NOT found");
		SERVICESSRC = DEFAULTSERVICESSRC;
	}*/
	//MANAGE SERVICES END
	
	for(var i=0; i < SERVICESSRC.length; i++) {
		if(BETASERVICES) {
			if(SERVICESSRC[i].active)
				loadScript(SERVICESSRC[i].src);			
		} else {
			if(SERVICESSRC[i].active && !SERVICESSRC[i].beta)
				loadScript(SERVICESSRC[i].src);
		}
	}
	
	var depotoptions = {
		name: "parcelsdepot",
		version: 1,
		replace: false
	};
	this.parcelsDepot = new Mojo.Depot(depotoptions, this.dbSuccess, this.dbFailure);
	
	this.parcelsDepot.get("parcels", this.getParcelsDbSuccess.bind(this), this.getParcelsDbFailure);
}

AppAssistant.prototype.getParcelsDbSuccess = function(event){
	if (event != null) {
		Mojo.Log.info("Parcels DB found");
		PARCELS = event;
		listModel.items = PARCELS;
	} else {
		Mojo.Log.info("Parcels DB NOT found");
		PARCELS = [];
		listModel.items = PARCELS;
	}

	var pushMainScene = function(stageController){
		stageController.pushScene('main');
	};
	
	var stageArgs = {
		name: 'main',
        lightweight: true
    };
	
    Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
	
	if(DASHBOARD) {
		var pushDashScene = function(stageController){
			stageController.pushScene('dash');
		};
		
		var stageArgs = {
			name: 'dash',
			lightweight: true
		};
		
		Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushDashScene.bind(this), 'dashboard');
	}

	if(AUTOREFRESH) {
		Mojo.Log.info("SET NEW ALARM");
		setNextAlarm();
	}
}

AppAssistant.prototype.refreshCallback = function(event) {
	listModel.items = PARCELS;
	if(Mojo.Controller.getAppController().getStageController('main') != null)
		Mojo.Controller.getAppController().getStageController('main').getScenes()[0].modelChanged(listModel);
	
	this.parcelscounter--;
	if(this.parcelscounter == 0) {
		if(DASHBOARD) {
			if(Mojo.Controller.getAppController().getStageController('dash') != null) {
				Mojo.Controller.getAppController().getStageController('dash').activeScene().get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon.png)";
			}
		}
	}
};

AppAssistant.prototype.getServicesDbFailure = function(event){
}

AppAssistant.prototype.getParcelsDbFailure = function(event){
}