function DHLEI() {
}

DHLEI.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

DHLEI.prototype.getVersion = function() {
	return "1.0";
}

DHLEI.prototype.getColor = function() {
	return "#f1d871";
}

DHLEI.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

DHLEI.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "http://www.dhl.de/globaltracking/at/content/at/de/express/sendungsverfolgung/_jcr_content/containerpar/shipmenttracking.html?_=&lang=de&searchType=tracking&trackingEngine=international&AWB=" + this.id;
	return "http://www.dhl.com/content/g0/en/express/tracking.shtml?brand=DHL&AWB=" + this.id + "%0D%0A";
}

DHLEI.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

DHLEI.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("Sendungsinformationen eingegangen").length > 1 || responseText.split("Shipment information received").length > 1) {
		status = 1;
	}
	if(responseText.split("Sendung sortiert").length > 1 || responseText.split("Processed at").length > 1) {
		status = 2;
	}
	if(responseText.split("Ankunft in der DHL-Niederlassung").length > 1 || responseText.split("Arrived at Sort Facility").length > 1) {
		status = 3;
	}
	if(responseText.split("Sendung in Zustellung").length > 1 || responseText.split("Forwarded for delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("Sendung zugestellt").length > 1 || responseText.split("Delivered").length > 1) {
		status = 5;
	}
	if(responseText.split("Kein Ergebnis gefunden").length > 1 || responseText.split("No result found").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<tbody>");
		var tmpDate = "";
		for (var i=1; i<details2.length; i++) {
			if (details2[i-1].split("<thead>").length > 1) {
				var tmpDate2 = details2[i-1].split("<thead>")[1];
				tmpDate2 = tmpDate2.split("text-align:left\">")[1];
				tmpDate2 = tmpDate2.split("</th>")[0];
				tmpDate = tmpDate2;
			}
			
			var tmp = details2[i].split("style=\"text-align:left\">");
			
			var tmpNotes = tmp[1].split("</td>")[0];
			var tmpLocation = tmp[2].split("</td>")[0];
			
			var tmpTime = details2[i].split("\">")[4];
			tmpTime = tmpTime.split("</td>")[0];
			
			details.push({date: tmpDate + " " + tmpTime, location: tmpLocation, notes: tmpNotes});
		}
		
		//details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

DHLEI.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("DHL Expr. Intl.", new DHLEI());