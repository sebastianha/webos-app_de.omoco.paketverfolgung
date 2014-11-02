function TestService() {
}

TestService.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

TestService.prototype.getVersion = function() {
	return "1.0";
}

TestService.prototype.getColor = function() {
	return "#f1f1f0";
}

TestService.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

TestService.prototype.getTrackingUrl = function() {
	return "http://omoco.de";
}

TestService.prototype.getDetails = function() {
	this.getDetailsRequestSuccess();
};

TestService.prototype.getDetailsRequestSuccess = function() {
	var status = 0;
	if(this.id >= -1 && this.id <= 5) {
		status = this.id;
	} else {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		for (var i=1; i<Math.round(Math.random()*10); i++) {
			details.push({date: "Datum", location: "Ort", notes: "Notes"});
		}
	
		this.callbackDetails(details.clone());	
	}
};

TestService.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Test", new TestService());
