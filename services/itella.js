function Itella() {
}

Itella.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

Itella.prototype.getVersion = function() {
	return "1.0";
}

Itella.prototype.getColor = function() {
	return "#72a5ca";
}

Itella.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

Itella.prototype.getTrackingUrl = function() {
	return "http://www.itella.fi/itemtracking/itella/search_by_shipment_id";
}

Itella.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'post',
		parameters: 'lang=en&LOTUS_hae=Hae&LOTUS_side=1&ShipmentId=' + this.id,
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Itella.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;

	var status = 0;
	if(responseText.split("Item Data").length > 1) {
		status = 1;
	}
	if(responseText.split("FEHLT NOCH").length > 1) {
		status = 2;
	}
	if(responseText.split("Item in sorting").length > 1) {
		status = 3;
	}
	if(responseText.split("Item being delivered to the addressee.").length > 1) {
		status = 4;
	}
	if(responseText.split("Item delivered to the recipient.").length > 1) {
		status = 5;
	}
	if(responseText.split("No items were found with the item code you provided.").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<div id=\"shipment-event-table-cell\">");

		for (var i=1; i<details2.length; i++) {
			var tmpTime = details2[i].split("<span class=\"shipment-event-table-data\">")[1];
			tmpTime = tmpTime.split("</span>")[0];
			var tmpLoc = details2[i].split("<span class=\"shipment-event-table-data\">")[2];
			tmpLoc = tmpLoc.split("</span>")[0];
			var tmpNotes = details2[i].split("<div class=\"shipment-event-table-header\" colspan=\"2\">")[1];
			tmpNotes = tmpNotes.split("</div>")[0];
			details.push({date: tmpTime, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

Itella.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Itella", new Itella());