function DHLGM() {
}

DHLGM.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

DHLGM.prototype.getVersion = function() {
	return "1.0";
}

DHLGM.prototype.getColor = function() {
	return "#f1d871";
}

DHLGM.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

DHLGM.prototype.getTrackingUrl = function() {
	return "http://webtrack.dhlglobalmail.com/?trackingnumber=" + this.id;
}

DHLGM.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

DHLGM.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("pickedup.png").length > 1) {
		status = 1;
	}
	if(responseText.split("processed.png").length > 1) {
		status = 2;
	}
	if(responseText.split("in_transit.png").length > 1) {
		status = 3;
	}
	if(responseText.split("tendered.png").length > 1) {
		status = 4;
	}
	if(responseText.split("delivered.png").length > 1) {
		status = 5;
	}
	if(responseText.split("No results for your search.").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<tr class=");
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split("</td>")[0];
			tmpDate = tmpDate.split(">")[2];
			var tmpTime = details2[i].split("</td>")[1];
			tmpTime = tmpTime.split(">")[1];
			var tmpLoc = details2[i].split("</td>")[2];
			tmpLoc = tmpLoc.split(">")[1];
			var tmpNotes = details2[i].split("</td>")[3];
			tmpNotes = tmpNotes.split(">")[1];
			details.push({date: tmpDate + " " + tmpTime, location: tmpLoc, notes: tmpNotes});
		}
		
		//details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

DHLGM.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("DHL Global Mail", new DHLGM());