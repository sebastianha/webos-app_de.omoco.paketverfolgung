function OnTrac() {
}

OnTrac.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

OnTrac.prototype.getVersion = function() {
	return "1.0";
}

OnTrac.prototype.getColor = function() {
	return "#f1db73";
}

OnTrac.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

OnTrac.prototype.getTrackingUrl = function() {
	return "http://www.ontrac.com/trackingdetail.asp?tracking=" + this.id;
}

OnTrac.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

OnTrac.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("DATA ENTRY").length > 1) {
		status = 1;
	}
	if(responseText.split("FEHLTNOCH").length > 1) {
		status = 2;
	}
	if(responseText.split("PACKAGE RECEIVED AT FACILITY").length > 1) {
		status = 3;
	}
	if(responseText.split("OUT FOR DELIVERY").length > 1) {
		status = 4;
	}
	if(responseText.split("DELIVERED").length > 1) {
		status = 5;
	}
	if(responseText.split("FEHLTNOCH").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<td bgcolor=#ffffff nowrap><p>");
		for (var i=1; i<details2.length; i+=3) {
			var tmpDate = details2[i+1].split("<br />")[0];
			var tmpLoc = details2[i+2].split("<br />")[0];
			var tmpNotes = details2[i].split("<br />")[0];
			
			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

OnTrac.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("OnTrac", new OnTrac());