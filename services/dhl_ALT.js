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
	if(LANG == "de")
		return "http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=de&idc=" + this.id;
	return "http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=en&idc=" + this.id;
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
	if(responseText.split("FilialeACTIVE").length > 1 || responseText.split("DatenErhaltenACTIVE").length > 1) {
		status = 1;
	}
	// Sonderfall, Paket wird in Packstation abgegeben
	if(responseText.split("PackstationACTIVE").length > 1 && responseText.split("TransportDEFAULT").length > 1) {
		status = 1;
	}
	if(responseText.split("TransportACTIVE").length > 1 || responseText.split("TransportExportACTIVE").length > 1) {
		status = 2;
	}
	if(responseText.split("PaketzentrumACTIVE").length > 1 || responseText.split("GrenzeACTIVE").length > 1 || responseText.split("ZollACTIVE").length > 1) {
		status = 3;
	}
	if(responseText.split("ZustellungACTIVE").length > 1) {
		status = 4;
	}
	// Sonderfall, Paket kommt in Packstation an
	if(responseText.split("PackstationACTIVE").length > 1 && responseText.split("PaketzentrumACTIVE").length > 1) {
		status = 4;
	}
	// Sonderfall, da wird doch glatt das Filialicon wiederverwendet.
	if(responseText.split("Die Sendung konnte nicht in die PACKSTATION eingestellt werden und wurde in eine Filiale weitergeleitet. Der Empfänger wurde benachrichtigt.").length > 1 || responseText.split("The shipment could not be delivered to the PACKSTATION and has been forwarded to a retail outlet. The recipient has been notified.").length > 1) {
		status = 4;
	}
	if(responseText.split("Die frühestmögliche Uhrzeit der Abholung kann der Benachrichtigungskarte entnommen werden.").length > 1) {
		status = 4;
	}
	if(responseText.split("ZugestelltACTIVE").length > 1 || responseText.split("RetoureACTIVE").length > 1 || responseText.split("UeberweisungACTIVE").length > 1) {
		status = 5;
	}
	if(responseText.split("Mit der DHL Sendungsverfolgung behalten Sie jederzeit den").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<td class=\"overflow\"");
		for (var i=1; i<details2.length; i++) {
			var tmp = details2[i].split("\n");
			var tmp2 = details2[i].split("<div class=\"overflow\">");
			var tmpLoc = tmp2[1].split("</div>")[0];
			var tmpNotes = tmp2[2].split("</div>")[0];
			details.push({date: tmp[3], location: tmpLoc, notes: tmpNotes});
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

DHL.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("DHL", new DHL());