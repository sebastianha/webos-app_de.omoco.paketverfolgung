function ResTopicsAssistant() {
}

ResTopicsAssistant.prototype.setup = function() {
	this.topicitems = [
		{
			header_en:   "1) Homescreen / Packages list",
			body_en:     "After starting the app the packages list is being shown. In this list are all saved packages. Start to type to filter the list.",
			header_de:   "1) Startbildschirm / Sendungsliste",
			body_de:     "Wenn man die App startet kommt man zuerst in die Sendungsliste. Hier sind alle gespeicherten Sendungen aufgeführt. Die Liste kann durch lostippen durchsucht werden.",
			image:       ""
		},
		{
			header_en:   "1.1) Add a package",
			body_en:     "Tap on \"Add Package...\" below the list or on the icon at the bottom left to add a new package. After entering the details hit save to complete the process. Ask your shipper for details about the package service and the tracking id.",
			header_de:   "1.1) Sendung hinzufügen",
			body_de:     "Ein Klick auf den Button \"Neue Sendung...\" unterhalb der Liste oder auf das Icon unten links erstellt eine Neue Sendung. Nachdem die Sendungsdetails eingegeben wurden, wird die Sendung zu der Liste hinzugefügt. Der Name kann Frei gewählt werden. Das Unternehmen und die Sendungsnummer erfährt man von dem Versender.",
			image:       "add"
		},
		{
			header_en:   "1.2) Delete a package",
			body_en:     "Swipe the package entry to the left or the right to delete it. Confirm the action by pressing delete. In detail view a package can be deleted by hitting the trash button on the bottom right.",
			header_de:   "1.2) Sendung löschen",
			body_de:     "Um eine Sendung zu löschen muss diese nach links oder rechts aus der Liste hinausgeschoben werden. Anschließend muss der Löschvorgang bestätigt werden. Alternativ kann dies in der Detailansicht mit dem Button unten rechts getan werden.",
			image:       "delete"
		},
		{
			header_en:   "1.3) Refresh packages list",
			body_en:     "Tap the refresh button on the bottom right to refresh all packages in the list. While refreshing a spinner pops up at the top right. Additionally each package will show a small icon which disappears when the package has been updated. If there are updates available the package name will be printed in bold letters. A notification will be shown if activated.",
			header_de:   "1.3) Liste aktualisieren",
			body_de:     "Der Button unten rechts aktualisiert alle Pakete die noch nicht angekommen sind. Solange aktualisiert wird, erscheint oben rechts in der Ecke ein Wartesymbol. Außerdem erscheint dieses auch hinter jedem Paket und verschwindet wenn dieses aktualisiert worden ist. Wenn eine neue Aktualisierung für eine Sendung vorliegt, wird dieses fett hervorgehoben. Je nach Einstellung wird eine Benachrichtigung angezeigt.",
			image:       "refresh"
		},
		{
			header_en:   "1.4) Sort the list",
			body_en:     "Use drag&drop to reorder the packages in the list. Just tap and hold a package and drop it at the new destination. Use the menu to sort the list by name, status or other criterias. Use a critera a second time to reverse the order.",
			header_de:   "1.4) Liste sortieren",
			body_de:     "Die Liste kann nach Belieben umsortiert werden, dazu eine Sendung antippen und halten. Anschließend dort loslassen wo sie einsortiert werden soll. Im Menü stehen verschiedene Sortiermechanismen bereit, die man auf die Liste anwenden kann. Wird eine Sortierung ein zweites Mal angewendet wird die Reihenfolge umgedreht.",
			image:       "sort"
		},
		{
			header_en:   "1.5) Status icons",
			body_en:     "On the way from the sender to you each package will pass 5 stages. It begins with receiving the shipment information (1). Then a package reaches the sort facility (2) and will be processed there (3). On the fourth stage it is on delivery (4) and finally will be delivered (5). If the status is unknown or there is an error with the tracking id a question mark will be displayed.",
			header_de:   "1.5) Statusicons",
			body_de:     "Eine Sendung durchläuft fünf verschiedene Phasen. Es fängt an mit der Einlieferung (1) des Paketes. Anschließend wird es zur Sortierstation transportiert (2) und dort verarbeitet (3). Der vierte Status bedeutet, dass es auf dem Weg zum Empfänger (4) ist und mit dem letzten Status ist der Vorgang abgeschlossen (5). Ein Fragezeichen wird angezeigt, wenn der Status unbekannt ist. Dies kann passieren, wenn die Informationen noch nicht vorliegen oder die Sendungsnummer falsch ist.",
			image:       "status"
		},
		{
			header_en:   "2) Detail view",
			body_en:     "Tap on a package in the list to open the detail view. Here is all important information about the package.",
			header_de:   "2) Detailansicht",
			body_de:     "Ein Klick auf eine Sendung in der Sendungsliste öffnet die Detailansicht. Hier stehen alle verfügbaren Informationen zu einer Sendung bereit.",
			image:       ""
		},
		{
			header_en:   "2.1) Package information",
			body_en:     "On the top there are again all information about the package. Additionally there is the creation date and the date of the last status update. Tap the icon on the right to open the tracking homepage in the browser. A long tap will copy the information to the clipboard.",
			header_de:   "2.1) Sendungsinformationen",
			body_de:     "Oben sind zunächst die Informationen noch einmal aufgelistet, zusätzlich noch das Eintragungsdatum und das Datum der letzten Statusänderung. Rechts daneben befindet sich ein Link zu der offiziellen Homepage des Versandunternehmens. Ein langer Klick auf das Feld kopiert die Informationen in die Zwischenablage.",
			image:       "info"
		},
		{
			header_en:   "2.2) History",
			body_en:     "The overview shows the status of the package. Passed stages are being highlighted. While updating the package there is a spinner displayed.",
			header_de:   "2.2) Verlauf",
			body_de:     "Hier wird noch einmal eine Statusübersicht angezeigt. Bereits abgeschlossene Vorgänge sind hervorgehoben. Während des Ladevorgangs ist hier ein Wartesymbol zu sehen.",
			image:       "history"
		},
		{
			header_en:   "2.3) Map",
			body_en:     "The map shows the last location of the package. Tap the map to zoom out and get a larger view. Tap again to zoom out even further. Tap any step at the details to view the corresponding location.",
			header_de:   "2.3) Karte",
			body_de:     "Auf der Karte wird der aktuelle Ort der Sendung angezeigt. Zum Herauszoomen auf die Karte klicken. Ein erneutes Klicken zoom noch weiter raus. Ein Klick auf einen der Zwischenschritte in den Details zeigt den entsprechenden Ort auf der Karte an.",
			image:       ""
		},
		{
			header_en:   "2.4) Details",
			body_en:     "When there is a detailed information available they are displayed here. Date, location and notes are chronologically ordered. A long tap will copy the information to the clipboard.",
			header_de:   "2.4) Details",
			body_de:     "Sofern das Versandunternehmen diese Informationen bereitstellt, steht hier der detaillierte Sendungsverlauf mit Datum und Ort. Ein langer Klick auf das Feld kopiert die Informationen in die Zwischenablage.",
			image:       "details"
		},
		{
			header_en:   "2.5) Edit package",
			body_en:     "The button at the bottom left will open the edit popup for the current package. The trash icon on the right will delete it.",
			header_de:   "2.5) Sendung bearbeiten",
			body_de:     "Mit dem Button unten links kann die aktuelle Sendung bearbeitet werden. Der Papierkorb rechts löscht die angezeigte Sendung.",
			image:       "edit"
		},
		{
			header_en:   "2.6) Reload package",
			body_en:     "Tap on the button between the two arrows at the bottom to reload the current package.",
			header_de:   "2.6) Sendung neu laden",
			body_de:     "Mit einem klick auf den Button zwischen des beiden Pfeilen kann die Sendung aktualisiert werden.",
			image:       "refresh2"
		},
		{
			header_en:   "3) Preferences",
			body_en:     "Select preferences from the menu to list a variety of preferences. There is a help text for each setting which can be displayed by tapping the question mark at the top right corner.",
			header_de:   "3) Einstellungen",
			body_de:     "Die Einstellungen der App können über das Menü verändert werden. Für die Einstellungen gibt es eine gesonderte Hilfe, die über den Button mit dem Fragezeichen oben rechts aktiviert werden kann.",
			image:       "help"
		},
		{
			header_en:   "4) Miscellaneous / Tips",
			body_en:     "Take a look at the preferences. By default not all features of the app are activated. When using the app there are always more than one way to complete a task so everyone can choose the one which fits best.",
			header_de:   "4) Sonstiges / Tipps",
			body_de:     "Es lohnt sich auf jeden Fall die Einstellungen durchzusehen. Standardmäßig sind nicht alle Features der App aktiviert. Für viele Vorgänge gibt es mehrere Wege, so dass für jeden Benutzer etwas dabei sein sollte.",
			image:       ""
		},
		{
			header_en:   "4.1) Menu Shortcuts",
			body_en:     "All menu entries have shortcuts. A shortcut can be used by holding one finger on the gesture areas and simultaneously hitting the corresponding key on the keyboard. The keys are displayed on the right of each entry.",
			header_de:   "4.1) Menü Shortcuts",
			body_de:     "Alle Menüeinträge sind mit Shortcuts versehen. Diese können ausgelöst werden indem man einen Finger auf dem Gestenbereich hat und gleichzeitig die zugehörige Taste auf der Tastatur drückt. Die zugeordneten Tasten stehen immer rechts neben dem Menüeintrag.",
			image:       "shortcuts"
		},
		{
			header_en:   "4.2) Refresh from dashboard",
			body_en:     "Tap the icon at the dashboard to refresh all packages in background. This is a clever way to check for new updated without opening the app.",
			header_de:   "4.2) Vom Dashboard aus aktual.",
			body_de:     "Wenn man im Dashboard auf das Icon klickt, wird die Aktualisierung im Hintergrund angeworfen. So kann man, ohne die App zu öffnen, manuell nach Neuerungen gucken.",
			image:       ""
		},
		{
			header_en:   "4.3) Import / Export",
			body_en:     "To save and restore the packages list it can be exported and imported. If you use a desktop program to manage your packages the import file can be preprocessed by a script. For more information please contact me.",
			header_de:   "4.3) Import / Export",
			body_de:     "Man kann die Sendungsliste sowohl exportieren als auch importieren. Für den Import gibt es die Möglichkeit die Daten vorher durch ein Script vorzubereiten. Für genauere Informationen dazu kann man mich per E-Mail kontaktieren.",
			image:       ""
		},
	];
	
	var attributes =
	{
		itemTemplate:   'res-topics/listitem',
		listTemplate:   'res-topics/listcontainer',
		emptyTemplate:  'res-topics/emptylist',
		addItemLabel:   $L("Ask the developer by email"),
		renderLimit:    this.topicitems.length,
		filterFunction: this.filterFunction.bind(this),
		delay:          250
	};
	this.model = [];

	this.controller.setupWidget('topicslist', attributes, this.model);
	
	this.controller.listen("topicslist", Mojo.Event.listAdd, this.itemAdd.bindAsEventListener(this));
};

ResTopicsAssistant.prototype.filterFunction = function(filterString, listWidget, offset, count) {
	var subset = [];
	var totalSubsetSize = 0;
		
	var i = 0;
	for( var i; i <  this.topicitems.length; i++) {
		if (this.topicitems[i].header_en.toLowerCase().include(filterString.toLowerCase()) || this.topicitems[i].header_de.toLowerCase().include(filterString.toLowerCase())) {
			if (subset.length < count && totalSubsetSize >= offset) {
				subset.push(this.topicitems[i]);
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

ResTopicsAssistant.prototype.itemAdd = function(event) {
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

ResTopicsAssistant.prototype.activate = function(event) {
};

ResTopicsAssistant.prototype.deactivate = function(event) {
};

ResTopicsAssistant.prototype.cleanup = function(event) {
};
