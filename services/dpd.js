function DPD() {
}

DPD.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

DPD.prototype.getVersion = function() {
	return "1.0";
}

DPD.prototype.getColor = function() {
	return "#e37286";
}

DPD.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

DPD.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "https://extranet.dpd.de/cgi-bin/delistrack?pknr=" + this.id + "&typ=1&lang=de";
	return "https://extranet.dpd.de/cgi-bin/delistrack?pknr=" + this.id + "&typ=1&lang=en";
}

DPD.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

DPD.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("<br>Einrollung").length > 1 || responseText.split("<br>Pick-up").length > 1) {
		status = 1;
	}
	if(responseText.split("<br>HUB-Durchlauf").length > 1 || responseText.split("<br>Hub scan").length > 1) {
		status = 2;
	}
	if(responseText.split("<br>Eingang").length > 1 || responseText.split("<br>Inbound").length > 1) {
		status = 3;
	}
	if(responseText.split("<br>Ausrollung").length > 1 || responseText.split("<br>Out for delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("<br>Zustellung").length > 1 || responseText.split("<br>Delivered").length > 1) {
		status = 5;
	}
	if(responseText.split("Ein Fehler ist aufgetreten").length > 1 || responseText.split("An error has occurred").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<tr class=\"\"");
		for (var i=1; i<details2.length; i++) {
			var tmp = details2[i].split("<td style=\"padding-left: 10px;\">");
	
			var tmpDate = tmp[1].split(" <br>")[0];
			var tmpTime = tmp[1].split(" <br>")[1];
			tmpTime = tmpTime.split(" </td>")[0];
			tmpDate = tmpDate + " " + tmpTime;
			var tmpLoc = tmp[2].split("</a><br>&nbsp;")[1];
			tmpLoc = tmpLoc.split("</td>")[0];
			var tmpNotes = tmp[3].split("<br>")[1];
			tmpNotes = tmpNotes.split(";")[0];
	
			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
			
			if(details2[i].split("Code-Beschreibung").length > 1)
				break;	
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

DPD.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("DPD", new DPD());