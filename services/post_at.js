function PostAT() {
}

PostAT.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

PostAT.prototype.getVersion = function() {
	return "1.0";
}

PostAT.prototype.getColor = function() {
	return "#ede471";
}

PostAT.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

PostAT.prototype.getTrackingUrl = function() {
	return "http://mobil.post.at/sendungsverfolgung.php?pnum1=" + this.id;
}

PostAT.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

PostAT.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("erhalten").length > 1) {
		status = 1;
	}
	if(responseText.split("FEHLTNOCH").length > 1) {
		status = 2;
	}
	if(responseText.split("Verteilung").length > 1) {
		status = 3;
	}
	if(responseText.split("Zustellung").length > 1) {
		status = 4;
	}
	if(responseText.split("zugestellt").length > 1) {
		status = 5;
	}
	if(responseText.split("Daten gefunden werden").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var tmpResponseText = responseText.split("<ol class=\"tnt\">")[1];
		var details = [];
		var details2 = tmpResponseText.split("<li class=\"");
		for (var i=1; i<details2.length - 2; i++) {
			var tmpDate = details2[i].split("Datum/Uhrzeit: ")[1];
			tmpDate = tmpDate.split("<br />")[0];
			var tmpLoc = details2[i].split("lang=de\">")[1];
			tmpLoc = "PLZ: " + tmpLoc.split("</a>")[0];
			var tmpNotes = details2[i].split("<strong>")[1];
			tmpNotes = tmpNotes.split("</strong>")[0];

			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

PostAT.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Post.at", new PostAT());