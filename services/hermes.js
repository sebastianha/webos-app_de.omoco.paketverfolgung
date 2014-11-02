function Hermes() {
}

Hermes.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

Hermes.prototype.getVersion = function() {
	return "1.0";
}

Hermes.prototype.getColor = function() {
	return "#72bed9";
}

Hermes.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

Hermes.prototype.getTrackingUrl = function() {
	return "https://www.myhermes.de/wps/portal/paket/Home/privatkunden/sendungsverfolgung";
}

Hermes.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess2.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Hermes.prototype.getDetailsRequestSuccess2 = function(response){
	var url = response.responseText.split("<form id=\"shipmentTracingDTO\" action=\"");
	url = url[1].split("\" method=\"post\"");
	url = "https://www.myhermes.de" + url[0];

	var request = new Ajax.Request(url, {
		method: 'post',
		parameters: 'shipmentID=' + this.id,
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccessFinal.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Hermes.prototype.getDetailsRequestSuccessFinal = function(response) {
	var responseText = response.responseText;

	var status = 0;
	if(responseText.split("shipment_icon_past shipment_icon_handover").length > 1 ||responseText.split("shipment_icon_present shipment_icon_handover").length > 1) {
		status = 1;
	}
	if(responseText.split("shipment_icon_past shipment_icon_base").length > 1 || responseText.split("shipment_icon_present shipment_icon_base").length > 1) {
		status = 2;
	}
	if(responseText.split("shipment_icon_past shipment_icon_chain_store").length > 1 || responseText.split("shipment_icon_present shipment_icon_chain_store").length > 1) {
		status = 3;
	}
	if(responseText.split("shipment_icon_past shipment_icon_delivery").length > 1 || responseText.split("shipment_icon_present shipment_icon_delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("shipment_icon_past shipment_icon_delivered").length > 1 || responseText.split("shipment_icon_present shipment_icon_delivered").length > 1) {
		status = 5;
	}
	if(responseText.split("Zu Ihrer Eingabe konnten leider").length > 1 || responseText.split("Bitte geben Sie eine").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<table class=\"content_table table_shipmentDetails\">")[1];
		details2 = details2.split("<tbody>")[1];
		details2 = details2.split("</tbody>")[0];
		details2 = details2.split("<tr>");
		
		for (var i=1; i<details2.length; i++) {
			var tmp = details2[i].split("<td>");
			var tmpDate1 = tmp[1].split("</td>")[0];
			var tmpDate2 = tmp[2].split("</td>")[0];
			var tmpNotes = tmp[3].split("</td>")[0];
			details.push({date: tmpDate1 + " " + tmpDate2, location: "", notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

Hermes.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Hermes", new Hermes());