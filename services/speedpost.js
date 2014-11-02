function Speedpost() {
}

Speedpost.prototype.getAuthor = function() {
	return "Sebastian Hammerl";
}

Speedpost.prototype.getVersion = function() {
	return "1.0";
}

Speedpost.prototype.getColor = function() {
	return "#84a2c0";
}

Speedpost.prototype.init = function(id, callbackStatus, callbackDetails, callbackError) {
	this.id = id;
	this.callbackStatus = callbackStatus;
	this.callbackDetails = callbackDetails;
	this.callbackError = callbackError;
};

Speedpost.prototype.getTrackingUrl = function() {
	return "http://www.speedpost.com.sg/speedpost_services_track_check.asp"; // + this.id;
}

Speedpost.prototype.getDetails = function() {
	var request = new Ajax.Request(this.getTrackingUrl(), {
		method: 'post',
		parameters: 'itemnos=' + this.id + '&txtEmail=&frmFlag=',
		evalJS: 'false',
		evalJSON: 'false',
		onSuccess: this.getDetailsRequestSuccess.bind(this),
		onFailure: this.getDetailsRequestFailure.bind(this)
	});
};

Speedpost.prototype.getDetailsRequestSuccess = function(response) {
	var responseText = response.responseText;
	
	var status = 0;
	if(responseText.split("MUSS NOCH GEMACHT WERDEN").length > 1) {
		status = 1;
	}
	if(responseText.split("Shipments in transit from Origin").length > 1) {
		status = 2;
	}
	if(responseText.split("Processing at Sorting Centre").length > 1) {
		status = 3;
	}
	if(responseText.split("Processing at Delivery Office").length > 1) {
		status = 4;
	}
	if(responseText.split("MUSS NOCH GEMACHT WERDEN").length > 1) {
		status = 5;
	}
	if(responseText.split("Not Found").length > 1) {
		status = -1;
	}

	this.callbackStatus(status);

	if(status > 0) {
		var details = [];
		var details2 = responseText.split("<td width=\"89\" valign=\"top\" bgcolor=\"#EEEEEE\" height=\"25\">");
		for (var i=1; i<details2.length; i++) {
			var tmpDate = details2[i].split("Helvetica, sans-serif\" >")[1];
			tmpDate = tmpDate.split("</font>")[0];
			var tmpNotes = details2[i].split("Helvetica, sans-serif\" >")[4];
			tmpNotes = tmpNotes.split("</font>")[0];
						
			details.push({date: tmpDate, location: "", notes: tmpNotes});
		}
		
		//details = details.reverse();
		
		this.callbackDetails(details.clone());	
	}
};

Speedpost.prototype.getDetailsRequestFailure = function(response) {
	this.callbackError("Konnte Seite nicht laden.");
};

registerService("Speedpost", new Speedpost());