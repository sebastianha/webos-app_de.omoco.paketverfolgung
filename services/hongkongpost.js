function HKPost() {
}

HKPost.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

HKPost.prototype.getVersion = function() {
	return "1.0";
}

HKPost.prototype.getColor = function() {
	return "#72c0bb";
}

HKPost.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

HKPost.prototype.getTrackingUrl = function() {
	return "http://app3.hongkongpost.com/CGI/mt/e_detail.jsp?mail_type=ems_out&tracknbr=" + this.id + "&localno=" + this.id;
}

HKPost.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'get',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

HKPost.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("Item posted").length > 1) {
		status = 1;
	}
	if(responseText.split("The item left").length > 1) {
		status = 2;
	}
	if(responseText.split("In transit").length > 1) {
		status = 3;
	}
	if(responseText.split("Arrived the delivery office").length > 1) {
		status = 4;
	}
	if(responseText.split("MUSS NOCH GEMACHT WERDEN").length > 1) {
		status = 5;
	}
	if(responseText.split("Please input the item").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("    <td>");
		for (var i=4; i<details2.length; i+=3) {
			var tmpDate = details2[i].split("</td>")[0];
			var tmpLocation = details2[i+1].split("</td>")[0];
			var tmpNotes = details2[i+2].split("</td>")[0];
			
			details.push({date: tmpDate, location: tmpLocation, notes: tmpNotes});
		}
		
		details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

HKPost.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Hongkong Post", new HKPost());