function PostCH() {
}

PostCH.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

PostCH.prototype.getVersion = function() {
	return "1.0";
}

PostCH.prototype.getColor = function() {
	return "#f1d871";
}

PostCH.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

PostCH.prototype.getTrackingUrl = function() {
	if(LANG == "de")
		return "https://www.post.ch/EasyTrack/submitParcelData.do?p_language=de&VTI-GROUP=1&directSearch=false&formattedParcelCodes=" + this.id;
	return "https://www.post.ch/EasyTrack/submitParcelData.do?p_language=en&VTI-GROUP=1&directSearch=false&formattedParcelCodes=" + this.id;
}

PostCH.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

PostCH.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("filled_yellow.gif").length > 0) {
		status = 1;
	}
	if(responseText.split("filled_yellow.gif").length > 2) {
		status = 2;
	}
	if(responseText.split("filled_yellow.gif").length > 4) {
		status = 3;
	}
	if(responseText.split("filled_yellow.gif").length > 6) {
		status = 4;
	}
	if(responseText.split("filled_yellow.gif").length > 8) {
		status = 5;
	}
	if(responseText.split("Es wurde keine Sendung mit dieser Sendungsnummer gefunden.").length > 1 || responseText.split("No consignment with this consignment number was found.").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<tr class=\"");
		for (var i=2; i<details2.length; i++) {
			var tmpDetails = details2[i].split(">");
			var tmpDate = tmpDetails[4].split("<")[0];
			var tmpTime = tmpDetails[6].split("<")[0];
			var tmpLoc = tmpDetails[12].split("<")[0];
			var tmpNotes = tmpDetails[10].split("<")[0];

			details.push({date: tmpDate + " " + tmpTime, location: tmpLoc, notes: tmpNotes});
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

PostCH.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Post.ch", new PostCH());