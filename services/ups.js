function UPS() {
}

UPS.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

UPS.prototype.getVersion = function() {
	return "1.0";
}

UPS.prototype.getColor = function() {
	return "#8b7271";
}

UPS.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

UPS.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "http://wwwapps.ups.com/WebTracking/track?HTMLVersion=5.0&loc=de_DE&trackNums=" + this.id + "&track.y=10&Requester=TRK_MOD&showMultipiece=N&detailNumber=undefined&WBPM_lid=homepage%2Fct1.html_pnl_trk";
	return "http://wwwapps.ups.com/WebTracking/track?HTMLVersion=5.0&loc=en_US&trackNums=" + this.id + "&track.y=10&Requester=TRK_MOD&showMultipiece=N&detailNumber=undefined&WBPM_lid=homepage%2Fct1.html_pnl_trk";
}

UPS.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

UPS.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("HERKUNFTSSCAN").length > 1 || responseText.split("Herkunfts Scan").length > 1 || responseText.split("Auftrag verarbeitet").length > 1 || responseText.split("Origin Scan").length > 1 || responseText.split("Order Processed").length > 1) {
		status = 1;
	}
	if(responseText.split("ABFAHRTSSCAN").length > 1 || responseText.split("Abfahrts Scan").length > 1 || responseText.split("Departure Scan").length > 1) {
		status = 2;
	}
	if(responseText.split("ANKUNFTSSCAN").length > 1 || responseText.split("Ankunfts Scan").length > 1  || responseText.split("Arrival Scan").length > 1) {
		status = 3;
	}
	if(responseText.split("WIRD ZUGESTELLT").length > 1 || responseText.split("Wird zugestellt").length > 1 || responseText.split("Out For Delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("UPS hat die Sendung zugestellt").length > 1 || responseText.split("UPS has delivered the shipment").length > 1) {
		status = 5;
	}
	if(responseText.split("1Z9999999999999999").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<td class=\"nowrap\">");
		for (var i=1; i<details2.length; i+=3) {
			var tmpLoc = details2[i].split("</td>")[0];
			var tmpDate1 = details2[i+1].split("</td>")[0];
			var tmpDate2 = details2[i+2].split("</td>")[0];
			var tmpDate = tmpDate1 + " " + tmpDate2;
			var tmpNotes = details2[i+2].split("<td>")[1];
			tmpNotes = tmpNotes.split("</td>")[0];
			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

UPS.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("UPS", new UPS());