function getNDUID(callback) {
	getNDUIDServiceRequestHandlerCallback = callback;
	
	var deviceIdAttributes =
	{
		method: 'getSysProperty',
		parameters: {'key': 'com.palm.properties.nduid'},
		onSuccess: getNDUIDServiceRequestHandler
	}
	
	new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', deviceIdAttributes);
}

function getNDUIDServiceRequestHandler(resp) {
	var mynduid = resp['com.palm.properties.nduid'];
	Mojo.Log.info("NDUID:        " + mynduid);
	mynduid = hex_sha1("de.omoco.paketverfolgung:" + mynduid);
	Mojo.Log.info("NDUID HASHED: " + mynduid);
	
	getNDUIDServiceRequestHandlerCallback(mynduid);
}

function loadScript(src) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    head.appendChild(script);
}

function registerService(name, serviceObject) {
	Mojo.Log.info("NEW SERVICE REGISTERED: " + name);
	
	var serviceAlreadyPresent = false;
	for(var i = 0; i < SERVICES.length; i++) {
		if(name == SERVICES[i].name) {
			serviceAlreadyPresent = true;
		}
	}
	
	if(!serviceAlreadyPresent)
		SERVICES.push({name: name, serviceobject: Object.clone(serviceObject)});
	else
		Mojo.Log.warn("WARNING: SERVICE " + name + " ALREADY PRESENT!");
}

function setNextAlarm() {
	var hours = parseInt(AUTOREFRESHINTERVALL / 60 / 60);
	var minutes = parseInt((AUTOREFRESHINTERVALL - hours * 60 * 60) / 60);
	var seconds = AUTOREFRESHINTERVALL - hours * 60 * 60 - minutes * 60;
	if(hours.toString().length < 2)
		hours = "0" + hours;
	if(minutes.toString().length < 2)
		minutes = "0" + minutes;
	if(seconds.toString().length < 2)
		seconds = "0" + seconds;
	var alarmIn = hours + ":" + minutes + ":" + seconds;
	
	var currentHours = new Date().getHours();
	if(AUTOREFRESHDAYTIME && currentHours >= 20) {
		var hoursToSix = 24 - currentHours + 6;
		if(hoursToSix.toString().length < 2)
			hoursToSix = "0" + hoursToSix;
		alarmIn = hoursToSix + ":00:00";
	}
	
	Mojo.Log.info(alarmIn);
	
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "set",
		parameters: {			
			"key": "refreshparcels",
			"in": alarmIn,
			"wakeup": false,
			"uri": "palm://com.palm.applicationManager/open",
			"params": "{'id':'de.omoco.paketverfolgung','params':{'action': 'refresh'}}"
		}  
	});
}

function clearAlarm() {
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "clear",
		parameters: {"key" : "refreshparcels"}
	});
}

function getPrefsCookie() {
	var cookie = new Mojo.Model.Cookie("PTPrefs");
	var prefs = cookie.get();
	if (prefs != null) {
		REFRESHONSTART = prefs.refreshonstart || DEFAULTREFRESHONSTART;
		REFRESHONADD = prefs.refreshonadd || DEFAULTREFRESHONADD;
		AUTOREFRESH = prefs.autorefresh || DEFAULTAUTOREFRESH;
		AUTOREFRESHINTERVALL = prefs.autorefreshintervall || DEFAULTAUTOREFRESHINTERVALL;
		AUTOREFRESHDAYTIME = prefs.autorefreshdaytime || DEFAULTAUTOREFRESHDAYTIME;
		NOTIFYMESSAGE = prefs.notifymessage || DEFAULTNOTIFYMESSAGE;
		NOTIFYSMALLMESSAGE = prefs.notifysmallmessage || DEFAULTNOTIFYSMALLMESSAGE;
		NOTIFYVIBRATE = prefs.notifyvibrate || DEFAULTNOTIFYVIBRATE;
		NOTIFYSOUND = prefs.notifysound || DEFAULTNOTIFYSOUND;
		NOTIFYRINGTONE = prefs.notifyringtone || DEFAULTNOTIFYRINGTONE;
		NOTIFYRINGTONENAME = prefs.notifyringtonename || DEFAULTNOTIFYRINGTONENAME;
		NOTIFYRINGTONEFILE = prefs.notifyringtonefile || DEFAULTNOTIFYRINGTONEFILE;
		DASHBOARD = prefs.dashboard || DEFAULTDASHBOARD;
		PUSHSERVICE = prefs.pushservice || DEFAULTPUSHSERVICE;
		AUTOSORT = prefs.autosort || DEFAULTAUTOSORT;
		LISTDATE = prefs.listdate || DEFAULTLISTDATE;
		COLORLIST = prefs.colorlist || DEFAULTCOLORLIST;
		COLORDETAILS = prefs.colordetails || DEFAULTCOLORDETAILS;
		SHOWMAP = prefs.showmap || DEFAULTSHOWMAP;
		MAPZOOM = prefs.mapzoom || DEFAULTMAPZOOM;
		USECACHE = prefs.usecache || DEFAULTUSECACHE;
		DARKTHEME = prefs.darktheme || DEFAULTDARKTHEME;
		CHECKSERVER = prefs.checkserver || DEFAULTCHECKSERVER;
		CHECKSERVERLAST = prefs.checkserverlast || DEFAULTCHECKSERVERLAST;
		BETASERVICES = prefs.betaservices || DEFAULTBETASERVICES;
		IMPORTFILENAME = prefs.importfilename || DEFAULTIMPORTFILENAME;
		IMPORTSCRIPTFILE = prefs.importscriptfile || DEFAULTIMPORTSCRIPTFILE;
		
		Mojo.Log.info(">>> COOKIE geladen:");
		Mojo.Log.info(">>> " + REFRESHONSTART + ", " + REFRESHONADD + ", " + AUTOREFRESH + ", " + AUTOREFRESHINTERVALL + ", " + AUTOREFRESHDAYTIME);
		Mojo.Log.info(">>> " + NOTIFYMESSAGE + ", " + NOTIFYSMALLMESSAGE + ", " + NOTIFYVIBRATE + ", " + NOTIFYSOUND + ", " + NOTIFYRINGTONE + ", " + NOTIFYRINGTONENAME + " , " + NOTIFYRINGTONEFILE);
		Mojo.Log.info(">>> " + DASHBOARD + ", " + PUSHSERVICE + ", " + AUTOSORT + ", " + LISTDATE + ", " + COLORLIST + ", " + COLORDETAILS + ", " + SHOWMAP + ", " + MAPZOOM + ", " + USECACHE + ", " + DARKTHEME);
		Mojo.Log.info(">>> " + CHECKSERVER + ", " + CHECKSERVERLAST + ", " + BETASERVICES + ", " + IMPORTFILENAME + ", " + IMPORTSCRIPTFILE);
	}
}
function setPrefsCookie() {
	Mojo.Log.info(">>> COOKIE wird gespeichert:");
	Mojo.Log.info(">>> " + REFRESHONSTART + ", " + REFRESHONADD + ", " + AUTOREFRESH + ", " + AUTOREFRESHINTERVALL + ", " + AUTOREFRESHDAYTIME);
	Mojo.Log.info(">>> " + NOTIFYMESSAGE + ", " + NOTIFYSMALLMESSAGE + ", " + NOTIFYVIBRATE + ", " + NOTIFYSOUND + ", " + NOTIFYRINGTONE + ", " + NOTIFYRINGTONENAME + " , " + NOTIFYRINGTONEFILE);
	Mojo.Log.info(">>> " + DASHBOARD + ", " + PUSHSERVICE + ", " + AUTOSORT + ", " + LISTDATE + ", " + COLORLIST + ", " + COLORDETAILS + ", " + SHOWMAP + ", " + MAPZOOM + ", " + USECACHE + ", " + DARKTHEME);
	Mojo.Log.info(">>> " + CHECKSERVER + ", " + CHECKSERVERLAST + ", " + BETASERVICES + ", " + IMPORTFILENAME + ", " + IMPORTSCRIPTFILE);
	
	var cookie = new Mojo.Model.Cookie("PTPrefs");
	cookie.put({
		refreshonstart: REFRESHONSTART,
		refreshonadd: REFRESHONADD,
		autorefresh: AUTOREFRESH,
		autorefreshintervall: AUTOREFRESHINTERVALL,
		autorefreshdaytime: AUTOREFRESHDAYTIME,
		notifymessage: NOTIFYMESSAGE,
		notifysmallmessage: NOTIFYSMALLMESSAGE,
		notifyvibrate: NOTIFYVIBRATE,
		notifysound: NOTIFYSOUND,
		notifyringtone: NOTIFYRINGTONE,
		notifyringtonename: NOTIFYRINGTONENAME,
		notifyringtonefile: NOTIFYRINGTONEFILE,
		dashboard: DASHBOARD,
		pushservice: PUSHSERVICE,
		autosort: AUTOSORT,
		listdate: LISTDATE,
		colorlist: COLORLIST,
		colordetails: COLORDETAILS,
		showmap: SHOWMAP,
		mapzoom: MAPZOOM,
		usecache: USECACHE,
		darktheme: DARKTHEME,
		checkserver: CHECKSERVER,
		checkserverlast: CHECKSERVERLAST,
		betaservices: BETASERVICES,
		importfilename: IMPORTFILENAME,
		importscriptfile: IMPORTSCRIPTFILE
	});
}
