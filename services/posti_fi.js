function PostiFI() {
}

PostiFI.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

PostiFI.prototype.getVersion = function() {
	return "1.0";
}

PostiFI.prototype.getColor = function() {
	return "#f1b177";
}

PostiFI.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

PostiFI.prototype.getTrackingUrl = function() {
	return "http://www.verkkoposti.com/e3/TrackinternetServlet?lang=en&LOTUS_hae=Hae&LOTUS_side=1&LOTUS_hae=Go&LOTUS_trackId=" + this.id;
}

PostiFI.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

PostiFI.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;

	var status = 0;
	if(responseText.split("Item registrations").length > 1) {
		status = 1;
	}
	if(responseText.split("FEHLT NOCH").length > 1) {
		status = 2;
	}
	if(responseText.split("Item in sorting").length > 1) {
		status = 3;
	}
	if(responseText.split("Out for delivery").length > 1) {
		status = 4;
	}
	if(responseText.split("Item delivered to the recipient").length > 1) {
		status = 5;
	}
	if(responseText.split("Item data not found").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<td align=\"left\" valign=\"top\">");

		for (var i=1; i<details2.length; i++) {
			var tmpTime = details2[i].split("<p class=\"resulttext\">")[1];
			tmpTime = tmpTime.split("&nbsp;")[0];
			var tmpLoc = details2[i].split("</b>&nbsp;")[1];
			tmpLoc = tmpLoc.split("</p>")[0];
			var tmpNotes = details2[i].split("<b>")[1];
			tmpNotes = tmpNotes.split("</b>")[0];
			details.push({date: tmpTime, location: tmpLoc, notes: tmpNotes});
		}
		
		this.callbackDetails(details.clone());	
	}
};

PostiFI.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Posti.fi", new PostiFI());