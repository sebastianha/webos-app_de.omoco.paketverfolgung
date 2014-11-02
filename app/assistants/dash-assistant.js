function DashAssistant() {
}

DashAssistant.prototype.setup = function() {
	this.controller.listen(this.controller.get('dashboard-list'),Mojo.Event.tap, this.handleDashboardListPressed.bind(this));
	this.controller.listen(this.controller.get('dashboard-item'),Mojo.Event.tap, this.handleDashboardItemPressed.bind(this));
}

DashAssistant.prototype.handleDashboardItemPressed = function(event) {
	this.controller.get('dashboard-title').innerText = $L("Package Tracker");
	this.controller.get('dashboard-subtitle').innerText = $L("Tap here to open the app");
	
	this.controller.get('dashboard-tasks').addClassName("single");
	this.controller.get('dashboard-count').innerText = "0";
	this.controller.get('dashboard-countbox').style.display = 'none';
	
	var pushMainScene = function(stageController){
		stageController.pushScene('main');
	};
	
	var stageArgs = {
		name: 'main',
		lightweight: true
	};
	
	if(Mojo.Controller.getAppController().getStageController('main') == null)
		Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
	else
		Mojo.Controller.getAppController().getStageController('main').activate();
}

DashAssistant.prototype.handleDashboardListPressed = function(event) {
	if (PARCELS.length > 0) {
		this.controller.get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon-refresh.png)";
		
		this.parcelscounter = PARCELS.length;
		
		for(var i=0; i<PARCELS.length; i++) {
			if(PARCELS[i].status < 5) {
				var tmpparcel = new Parcel(i, this.refreshCallback.bind(this));
				tmpparcel.refresh();
			} else {
				this.parcelscounter--;
				if(this.parcelscounter == 0) {
					this.controller.get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon.png)";
				}
			}
		}
	}
}

DashAssistant.prototype.refreshCallback = function(event) {
	listModel.items = PARCELS;
	if(Mojo.Controller.getAppController().getStageController('main') != null)
		Mojo.Controller.getAppController().getStageController('main').getScenes()[0].modelChanged(listModel);
	
	this.parcelscounter--;
	if(this.parcelscounter == 0) {
		this.controller.get('dashboard-icon').style.backgroundImage = "url(images/dashboard-icon.png)";
	}
};

DashAssistant.prototype.activate = function(event) {
}

DashAssistant.prototype.deactivate = function(event) {
}

DashAssistant.prototype.cleanup = function(event) {
}
