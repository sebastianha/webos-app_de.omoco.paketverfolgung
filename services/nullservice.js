function NullService() {
}

NullService.prototype.getColor = function() {
	return "";
}

NullService.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

NullService.prototype.getTrackingUrl = function() {
	return "http://omoco.de";
}

NullService.prototype.getDetails = function() {
	this.callbackStatus(-1);
	var dateNow = new Date();
	//var dateNowString = dateNow.format("dd.mm.yy HH:MM");
	var dateNowString = Mojo.Format.formatDate(dateNow, {date: "short", time: "short"});
	this.callbackDetails([{date: dateNowString, location: "", notes: $L("This service is no longer active / present. Please reactivate in settings.")}]);
};

//registerService("null", new NullService());
