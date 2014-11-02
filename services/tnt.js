function TNT() {
}

TNT.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

TNT.prototype.getVersion = function() {
	return "1.0";
}

TNT.prototype.getColor = function() {
	return "#f1a571";
}

TNT.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

TNT.prototype.getTrackingUrl = function() {
	return "http://www.tnt.de/servlet/Tracking?respCountry=de&respLang=de&navigation=1&page=1&sourceID=1&sourceCountry=ww&plazaKey=&refs=&requesttype=GEN&genericSiteIdent=&searchType=CON&cons=" + this.id;
}

TNT.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

TNT.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText.split("href=\"#top\"")[1];
	
	var status = 0;
	if(responseText.split("Entgegengenommen").length > 1) {
		status = 1;
	}
	if(responseText.split("Sendung Wurde Weitergeleitet").length > 1) {
		status = 2;
	}
	if(responseText.split("Sendung In Der Zustellniederlassung Eingetroffen").length > 1) {
		status = 3;
	}
	if(responseText.split("Sendung Wird Zugestellt").length > 1) {
		status = 4;
	}
	if(responseText.split("Sendung Wurde Zugestellt").length > 1) {
		status = 5;
	}
	if(responseText.split("nicht gefunden").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var tmpResponseText = responseText.split("<table width=\"100%\" cellSpacing=\"0\" cellPadding=\"2\" border=\"0\" class=\"appTable\">")[2];
		var details = [];
		var details2 = tmpResponseText.split("<tr vAlign=\"top\">");
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split("<td noWrap=\"true\">")[1];
			tmpDate = tmpDate.split("</td>")[0];
			var tmpTime = details2[i].split("<td>")[1];
			tmpTime = tmpTime.split("</td>")[0]
			var tmpLoc = details2[i].split("<td>")[2];
			tmpLoc = tmpLoc.split("</td>")[0]
			var tmpNotes = details2[i].split("<td>")[3];
			tmpNotes = tmpNotes.split("</td>")[0]
			details.push({date: tmpDate + tmpTime, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

TNT.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("TNT", new TNT());