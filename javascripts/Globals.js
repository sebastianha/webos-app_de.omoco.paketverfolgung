LANG = "en";

DEFAULTSERVICESSRC = [
	{name: "DHL",               src: "services/dhl.js",             active: true,    beta: false},
	{name: "DHL Expr. Intl.",   src: "services/dhl_expr_intl.js",   active: true,    beta: false},
	{name: "DHL Global Mail",   src: "services/dhl_global_mail.js", active: true,    beta: true},
	{name: "DPD",               src: "services/dpd.js",             active: true,    beta: false},
	{name: "Ensenda",           src: "services/ensenda.js",         active: true,    beta: true},
	{name: "FedEx",             src: "services/fedex.js",           active: true,    beta: false},
	{name: "GLS",               src: "services/gls.js",             active: true,    beta: false},
	{name: "Hermes",            src: "services/hermes.js",          active: true,    beta: false},
	{name: "Hongkong Post",     src: "services/hongkongpost.js",    active: true,    beta: true},
	{name: "Itella",            src: "services/itella.js",          active: true,    beta: true},
	{name: "OnTrac",            src: "services/ontrac.js",          active: true,    beta: true},
	{name: "Post.at",           src: "services/post_at.js",         active: true,    beta: false},
	{name: "Post.ch",           src: "services/post_ch.js",         active: true,    beta: false},
	{name: "Posti.fi",          src: "services/posti_fi.js",        active: true,    beta: true},
	{name: "Speedpost",         src: "services/speedpost.js",       active: true,    beta: true},
	{name: "TNT",               src: "services/tnt.js",             active: true,    beta: false},
	{name: "UPS",               src: "services/ups.js",             active: true,    beta: false},
	{name: "USPS",              src: "services/usps.js",            active: true,    beta: false},
	{name: "Test",              src: "services/testservice.js",     active: false,   beta: false},
	{name: "Test2",             src: "services/test2service.js",    active: false,   beta: false},
];
SERVICESSRC = [];

SERVICES = [];
PARCELS = [];


DEFAULTREFRESHONSTART = true;
DEFAULTREFRESHONADD = true;
DEFAULTAUTOREFRESH = false;
DEFAULTAUTOREFRESHINTERVALL = 3600;
DEFAULTAUTOREFRESHDAYTIME = false;

DEFAULTNOTIFYMESSAGE = true;
DEFAULTNOTIFYSMALLMESSAGE = false;
DEFAULTNOTIFYVIBRATE = true;
DEFAULTNOTIFYSOUND = false;
DEFAULTNOTIFYRINGTONE = false;
DEFAULTNOTIFYRINGTONENAME = "Vibes (short)";
DEFAULTNOTIFYRINGTONEFILE = "/media/internal/ringtones/Vibes (short).mp3";

DEFAULTDASHBOARD = false;
DEFAULTPUSHSERVICE = false;

DEFAULTAUTOSORT = 0;
DEFAULTLISTDATE = 0;
DEFAULTCOLORLIST = false;
DEFAULTCOLORDETAILS = false;
DEFAULTSHOWMAP = false;
DEFAULTMAPZOOM = 6;
DEFAULTUSECACHE = false;
DEFAULTDARKTHEME = false;

DEFAULTCHECKSERVER = true;
DEFAULTCHECKSERVERLAST = "";

DEFAULTBETASERVICES = false;

DEFAULTIMPORTFILENAME = "import.txt";
DEFAULTIMPORTSCRIPTFILE = "";


REFRESHONSTART = DEFAULTREFRESHONSTART;
REFRESHONADD = DEFAULTREFRESHONADD;
AUTOREFRESH = DEFAULTAUTOREFRESH;
AUTOREFRESHINTERVALL = DEFAULTAUTOREFRESHINTERVALL;
AUTOREFRESHDAYTIME = DEFAULTAUTOREFRESHDAYTIME;

NOTIFYMESSAGE = DEFAULTNOTIFYMESSAGE;
NOTIFYSMALLMESSAGE = DEFAULTNOTIFYSMALLMESSAGE;
NOTIFYVIBRATE = DEFAULTNOTIFYVIBRATE;
NOTIFYSOUND = DEFAULTNOTIFYSOUND;
NOTIFYRINGTONE = DEFAULTNOTIFYRINGTONE;
NOTIFYRINGTONENAME = DEFAULTNOTIFYRINGTONENAME;
NOTIFYRINGTONEFILE = DEFAULTNOTIFYRINGTONEFILE;

DASHBOARD = DEFAULTDASHBOARD;
PUSHSERVICE = DEFAULTPUSHSERVICE;

AUTOSORT = DEFAULTAUTOSORT;
LISTDATE = DEFAULTLISTDATE;
COLORLIST = DEFAULTCOLORLIST;
COLORDETAILS = DEFAULTCOLORDETAILS;
SHOWMAP = DEFAULTSHOWMAP;
MAPZOOM = DEFAULTMAPZOOM;
USECACHE = DEFAULTUSECACHE;
DARKTHEME = DEFAULTDARKTHEME;

CHECKSERVER = DEFAULTCHECKSERVER;
CHECKSERVERLAST = DEFAULTCHECKSERVERLAST;

BETASERVICES = DEFAULTBETASERVICES;

IMPORTFILENAME = DEFAULTIMPORTFILENAME;
IMPORTSCRIPTFILE = DEFAULTIMPORTSCRIPTFILE;