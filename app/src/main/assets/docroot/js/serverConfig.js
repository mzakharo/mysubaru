//
var capp_version = null;

//
var svrInfo = {
	"type": "Prod",
	"server_url": "https://www.smt-access.com/",
	"launcher_url_vehicle": "http://www.smt-access.com/tif/h5ContentsDownload/launcher_soa/3.2.3/headunit/index.html?ssl=true",
	"inAppContents": {
		"version": "1.0.4",
		"root_url": "https://www.smt-access.com/tif/h5ContentsDownload/",
		"cKey": "b6d47063196ee813c95675dd69675d5965723a956616a1daa5d6ff6d48669b10",
		"cSec": "69d86c7bced5e7d69afad409d9570bfa14c8c59f821eab732aab5dffc1ebb6ff"
	},
	"mwsProxy": {
		"hosts_list_url": "https://www.smt-access.com/tif/h5ContentsDownload/common/tls/HostsList.json",
		"default_hosts": [
			{ "URL": "www.smt-access.com" },
			{ "URL": "api.yelp.com" }
		]
	}
};

var ckey = svrInfo.inAppContents.cKey;
var csec = svrInfo.inAppContents.cSec;
var appurl = svrInfo.inAppContents.root_url +"starlink/proxy/proxy.html";
var homeurl = svrInfo.inAppContents.root_url +"smartphone/starlink/" +svrInfo.inAppContents.version +"/home/index.html";
var otherurl = svrInfo.inAppContents.root_url +"smartphone/starlink/" +svrInfo.inAppContents.version +"/more/index.html";
var welcomeurl = svrInfo.inAppContents.root_url +"smartphone/starlink/" +svrInfo.inAppContents.version +"/extensions/welcome/index.html";
var termsurl = svrInfo.inAppContents.root_url +"smartphone/starlink/" +svrInfo.inAppContents.version +"/extensions/terms/index.html";