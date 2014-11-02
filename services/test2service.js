function Test2Service() {
}

Test2Service.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

Test2Service.prototype.getVersion = function() {
	return "1.0";
}

Test2Service.prototype.getColor = function() {
	return "#72f171";
}

Test2Service.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

Test2Service.prototype.getTrackingUrl = function() {
	return "http://pvs.omoco.de/paket/test2service.php?id=" + this.id;
}

Test2Service.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Test2Service.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = responseText;

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		for (var i=1; i<status; i++) {
			details.push({date: "Datum", location: "Ort", notes: "Notes"});
		}
	
		this.callbackDetails(details.clone());	
	}
};

Test2Service.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Test2", new Test2Service());