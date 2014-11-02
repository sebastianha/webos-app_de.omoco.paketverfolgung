function ResFaqsAssistant() {
}

ResFaqsAssistant.prototype.setup = function() {
	this.faqitems = [
		{
			question_en: "How can I search through the FAQs?",
			answer_en:   "Just start to type in and the results will appear automatically.",
			question_de: "Wie kann ich in den FAQs suchen?",
			answer_de:   "Wenn man anfängt die Frage mit der Tastatur einzutippen wird danach gefiltert.",
			image:        ""
		},
		{
			question_en: "Is the tip on the first page always visible?",
			answer_en:   "No. Only when starting the app and there is no package in your list the tip will be visible.",
			question_de: "Wird der Tipp auf der Startseite immer angezeigt?",
			answer_de:   "Nein, nur wenn beim Start der App keine Sendung in der Liste ist wird der Tipp angezeigt.",
			image:       ""
		},
		{
			question_en: "How do I delete a package?",
			answer_en:   "Swipe the item to the right or the left to delete it. Alternatively you can use the trash icon in detail view.<br><br><br>",
			question_de: "Wie kann ich eine Sendung löschen?",
			answer_de:   "Einfach aus der Liste nach links oder recht hinausschieben oder in der Detailansicht auf den Papierkorb tippen.<br><br><br>",
			image:       "delete"
		},
		{
			question_en: "How can I reload a package in detail view?",
			answer_en:   "Tap on the numbers between the arrows at the bottom of the screen or select refresh from the menu.",
			question_de: "Kann man in der Detailansicht die Sendungsinformationen neu laden?",
			answer_de:   "Wenn man unten zwischen die beiden Pfeile tippt wird die Sendung neu geladen. Alternativ ist noch ein Eintrag im Menü vorhanden.",
			image:       "detailsreload"
		},
		{
			question_en: "Is it possible to paste a tracking id from the clipboard?",
			answer_en:   "If you try to use the menu entry to paste the tracking id the popup will disappear. But you can use a so called meta-tap. To do this tap and hold with on finger on the right side of the gesture area. Then hit the V button on the keyboard.",
			question_de: "Wie kann ich eine Sendungsnummer aus der Zwischenablage einfügen?",
			answer_de:   "Wenn man über das Menü geht verschwindet der Dialog wieder. Man kann aber auch über einen sogenannten Meta-Tap den Text einfügen. Dazu einen Finger auf den rechten Rand des Gesten-bereiches legen und dann gleichzeitig auf der Tastatur die Taste V drücken.",
			image:       ""
		},
		{
			question_en: "How do I activate beta services?",
			answer_en:   "Open the preferences via the menu (click on the app name at the top left) and scroll down to the bottom. There activate beta services and restart the app. They should be available now.",
			question_de: "Wie kann ich die Beta Unternehmen aktivieren?",
			answer_de:   "Die Beta Unternehmen können in den Einstellungen aktiviert werden. Dazu die Einstellungen im Menü öffnen (oben links auf den App-Namen klicken), dort ganz nach unten scrollen und die Beta Unternehmen aktivieren. Die App anschließend neu starten. Nun sollten die Beta Unternehmen verfügbar sein.",
			image:       ""
		},
		{
			question_en: "Could you add support for package service XY?",
			answer_en:   "Sure! Just email me a tracking number and the tracking site and I will take a look at it.",
			question_de: "Kann die App für Unternehmen XY erweitert werden?",
			answer_de:   "Generell Ja! Schickt mir bitte einfach eine E-Mail mit einer Trackingnummer und der Tracking-Webseite und ich werde mir das mal ansehen.",
			image:       ""
		},
	];
	
	var attributes =
	{
		itemTemplate:   'res-faqs/listitem',
		listTemplate:   'res-faqs/listcontainer',
		emptyTemplate:  'res-faqs/emptylist',
		addItemLabel:   $L("Ask the developer by email"),
		renderLimit:    this.faqitems.length,
		filterFunction: this.filterFunction.bind(this),
		delay:          250
	};
	this.model = [];

	this.controller.setupWidget('faqslist', attributes, this.model);
	
	this.controller.listen("faqslist", Mojo.Event.listAdd, this.itemAdd.bindAsEventListener(this));
};

ResFaqsAssistant.prototype.filterFunction = function(filterString, listWidget, offset, count) {
	var subset = [];
	var totalSubsetSize = 0;
		
	var i = 0;
	for( var i; i <  this.faqitems.length; i++) {
		if (this.faqitems[i].question_en.toLowerCase().include(filterString.toLowerCase()) || this.faqitems[i].question_de.toLowerCase().include(filterString.toLowerCase())) {
			if (subset.length < count && totalSubsetSize >= offset) {
				subset.push(this.faqitems[i]);
			}
			totalSubsetSize++;
		}
	}

	listWidget.mojo.noticeUpdatedItems(offset, subset);

	if (this.filter !== filterString) {
		listWidget.mojo.setLength(totalSubsetSize);
		listWidget.mojo.setCount(totalSubsetSize);
	}
	this.filter = filterString;
};

ResFaqsAssistant.prototype.itemAdd = function(event) {
	this.controller.serviceRequest(
	    "palm://com.palm.applicationManager", {
	        method: 'open',
	        parameters: {
	            id: "com.palm.app.email",
	            params: {
	                summary: $L("Package Tracker - Question about the app"),
	                text: $L("Hi, I have a question about your app Package Tracker:<br>"),
	                recipients: [
						{
		                    type: "email",
		                    role: 1,
		                    value: $L("packagetracker@omoco.de"),
		                    contactDisplay: $L("packagetracker@omoco.de")
                		}
					]
	            }
	        }
	    }
	);
};

ResFaqsAssistant.prototype.activate = function(event) {
};

ResFaqsAssistant.prototype.deactivate = function(event) {
};

ResFaqsAssistant.prototype.cleanup = function(event) {
};
