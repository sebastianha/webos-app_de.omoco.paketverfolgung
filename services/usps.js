function USPS() {
}

USPS.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

USPS.prototype.getVersion = function() {
	return "1.0";
}

USPS.prototype.getColor = function() {
	return "#7298b2";
}

USPS.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

USPS.prototype.getTrackingUrl = function() {
	return "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=" + this.id + "&qtc_senddate1=&qtc_zipcode1=";
}

USPS.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

USPS.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var responseText2 = responseText.split("<div id=\"track-results\">")[1];
	responseText2 = responseText2.split("<div id=\"tc-another\">")[0];
	
	var status = 0;
	if(responseText2.split("Accept").length > 1 || responseText2.split("Info Received").length > 1 || responseText2.split("Picked Up").length > 1) {
		status = 1;
	}
	if(responseText2.split("GIBTS ES WOHL NICHT").length > 1 || responseText2.split("Arrived Shipping Partner Facility").length > 1) {
		status = 2;
	}
	if(responseText2.split("Process").length > 1 || responseText2.split("Depart").length > 1 || responseText2.split("Sorting").length > 1) {
		status = 3;
	}
	if(responseText2.split("Delivery").length > 1) {
		status = 4;
	}
	if(responseText2.split("Delivered").length > 1) {
		status = 5;
	}
	if(responseText2.split("Sorry, there's no information for that number.").length > 1 || responseText2.split("Delivery status information is not available").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		
		var tmpFirstDetails = responseText.split("<tr class=\"shaded\">")[1];
		var tmpFirstDate = tmpFirstDetails.split("<p class=\"date-time sortable\">")[1];
		tmpFirstDate = tmpFirstDate.split("\n")[1];
		var tmpFirstLoc = tmpFirstDetails.split("<p class=\"location sortable\">")[1];
		tmpFirstLoc = tmpFirstLoc.split("\n")[1];
		var tmpFirstNotes = tmpFirstDetails.split("<p>")[2];
		tmpFirstNotes = tmpFirstNotes.split("</p>")[0];
		details.push({date: tmpFirstDate, location: tmpFirstLoc, notes: tmpFirstNotes});
		
		var details2 = responseText.split("<tr class=\"details single-details\">");
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split("<p>")[2];
			tmpDate = tmpDate.split("\n")[1];
			var tmpLoc = details2[i].split("<p>")[3];
			tmpLoc = tmpLoc.split("\n")[1];
			var tmpNotes = details2[i].split("<p>")[1];
			tmpNotes = tmpNotes.split("</p>")[0];
			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

USPS.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("USPS", new USPS());