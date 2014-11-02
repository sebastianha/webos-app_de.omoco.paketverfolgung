function GLS() {
}

GLS.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

GLS.prototype.getVersion = function() {
	return "1.0";
}

GLS.prototype.getColor = function() {
	return "#7872a6";
}

GLS.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

GLS.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "http://www.gls-group.eu/276-I-PORTAL-WEB/content/GLS/DE03/DE/5004.htm?txtRefNo=" + this.id + "&txtAction=71000";
	return "http://www.gls-group.eu/276-I-PORTAL-WEB/content/GLS/DE03/EN/5004.htm?txtRefNo=" + this.id + "&txtAction=71000";
}

GLS.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

GLS.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("Daten an GLS-System übermittelt").length > 1 || responseText.split("Data transferred to GLS System").length > 1) {
		status = 1;
	}
	if(responseText.split("Abfahrt vom GLS Depot").length > 1 || responseText.split("HIER FEHLT NOCH WAS!!!").length > 1) {
		status = 2;
	}
	if(responseText.split("Ankunft im GLS Depot").length > 1 || responseText.split("Inbound to GLS location").length > 1) {
		status = 3;
	}
	if(responseText.split("In Zustellung auf GLS-Fahrzeug").length > 1 || responseText.split("Out for delivery on GLS vehicle").length > 1) {
		status = 4;
	}
	if(responseText.split("Zugestellt").length > 1 || responseText.split("Delivered").length > 1) {
		status = 5;
	}
	if(responseText.split("Keine Daten gefunden!").length > 1 || responseText.split("No data found!").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<tr class=\"details\">");
		for (var i=1; i<details2.length; i++) {
			var tmp = details2[i].split("\n");
			var tmpLoc = tmp[7];
			tmpLoc = tmpLoc.split(" ")[2];
			tmpLoc = tmpLoc.split(",")[0];
			details.push({date: tmp[3], location: tmpLoc, notes: tmp[13]});
		}
		
		this.callbackDetails(details.clone());	
	}
};

GLS.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("GLS", new GLS());