function DHL() {
}

DHL.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

DHL.prototype.getVersion = function() {
	return "1.0";
}

DHL.prototype.getColor = function() {
	return "#f1d871";
}

DHL.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

DHL.prototype.getTrackingUrl = function() {
	return "https://mobil.dhl.de/sendung?query=sv_paket&sv-method=query&packet_id=" + this.id;
}

DHL.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

DHL.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("progress progress-landscape-20").length > 1) {
		status = 1;
	}
	if(responseText.split("progress progress-landscape-40").length > 1) {
		status = 2;
	}
	if(responseText.split("progress progress-landscape-60").length > 1) {
		status = 3;
	}
	if(responseText.split("progress progress-landscape-80").length > 1) {
		status = 4;
	}
	if(responseText.split("progress progress-landscape-100").length > 1) {
		status = 5;
	}
	if(responseText.split("ungültig").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = 	responseText.split("<table class=\"sub-list-item\" cellpadding=\"0\" cellspacing=\"0\"><tr>")[1];
		details2 = details2.split("<div class=\"list-item\">");
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split(" Uhr<br>")[0];
			var tmpNotes = "";
			var tmpLoc = "";
			if(details2[i].split(")").length > 1) {
				tmpNotes = details2[i].split("<br>")[1];
				tmpNotes = tmpNotes.split("(")[0];
				tmpLoc = details2[i].split("(")[1];
				tmpLoc = tmpLoc.split(")")[0];
			} else {
				tmpNotes = details2[i].split("<br>")[1];
				tmpNotes = tmpNotes.split("<")[0];
			}

			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

DHL.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("DHL", new DHL());