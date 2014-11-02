function FedEx() {
}

FedEx.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

FedEx.prototype.getVersion = function() {
	return "1.0";
}

FedEx.prototype.getColor = function() {
	return "#a472bd";
}

FedEx.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

FedEx.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "http://www.fedex.com/Tracking?action=track&language=german&cntry_code=de&mps=y&ascend_header=1&stop_mobi=yes&tracknumbers=" + this.id;
	return "http://www.fedex.com/Tracking?action=track&language=english&cntry_code=en&mps=y&ascend_header=1&stop_mobi=yes&tracknumbers=" + this.id;
}

FedEx.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

FedEx.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("progress_initiated_ltr.gif").length > 1) {
		status = 1;
	}
	if(responseText.split("progress_pickedup_ltr.gif").length > 1) {
		status = 2;
	}
	if(responseText.split("progress_onschedule_ltr.gif").length > 1) {
		status = 3;
	}
	if(responseText.split("progress_intransit_ltr.gif").length > 1 || responseText.split("progress_exception_ltr.gif").length > 1) {
		status = 4;
	}
	if(responseText.split("progress_delivered_ltr.gif").length > 1) {
		status = 5;
	}
	if(responseText.split("Ungültig").length > 1 || responseText.split("Nicht gefunden").length > 1 || responseText.split("Invalid").length > 1 || responseText.split("Not Found").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);


	var detailsVar = responseText.split("detailInfoObject")[1];
	detailsVar = detailsVar.split("\"scans\":")[1];
	detailsVar = detailsVar.split("],\"")[0];
	detailsVar =  detailsVar + "]";

	detailsVar = detailsVar.evalJSON();
	
	if(status > 0) {
		var details = [];
		for (var i=0; i<detailsVar.length; i++) {
			var tmpDate = detailsVar[i].scanDate + " " + detailsVar[i].scanTime;
			details.push({date: tmpDate, location: detailsVar[i].scanLocation, notes: detailsVar[i].scanStatus});
		}
		
		this.callbackDetails(details.clone());	
	}
};

FedEx.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("FedEx", new FedEx());