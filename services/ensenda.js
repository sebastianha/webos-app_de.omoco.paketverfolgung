function Ensenda() {
}

Ensenda.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

Ensenda.prototype.getVersion = function() {
	return "1.0";
}

Ensenda.prototype.getColor = function() {
	return "#edb380";
}

Ensenda.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

Ensenda.prototype.getTrackingUrl = function() {
	return "http://sdn.ensenda.com/ui/action/track?trackingNumber=" + this.id;
}

Ensenda.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Ensenda.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("Shipment Data Received").length > 1) {
		status = 1;
	}
	if(responseText.split("GIBTS NICHT?").length > 1) {
		status = 2;
	}
	if(responseText.split("Arrived at Local Dock").length > 1) {
		status = 3;
	}
	if(responseText.split("Out for Delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("Delivered").length > 1) {
		status = 5;
	}
	if(responseText.split("Sorry").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("Rows\">");
		var tmptmpDate = "";
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split("activityDate\">")[1];
			tmpDate = tmpDate.split("</td>")[0];
			if(tmpDate != "\n                            \n                        ")
				tmptmpDate = tmpDate;
			var tmpTime = details2[i].split("activityTime\">")[1];
			tmpTime = tmpTime.split("</td>")[0];
			tmpDate = tmptmpDate + " " + tmpTime;
			var tmpLoc = details2[i].split("activityLocation\">")[1];
			tmpLoc = tmpLoc.split("</td>")[0];
			var tmpNotes = details2[i].split("activityStatus\">")[1];
			tmpNotes = tmpNotes.split("</td>")[0];
			var tmpNotes2 = details2[i].split("activityNotes\">")[1];
			tmpNotes2 = tmpNotes2.split("</td>")[0];
			tmpNotes = tmpNotes + " " + tmpNotes2;
			details.push({date: tmpDate, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

Ensenda.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Ensenda", new Ensenda());