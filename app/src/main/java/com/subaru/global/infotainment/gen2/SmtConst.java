package com.subaru.global.infotainment.gen2;

import android.util.Log;

/* loaded from: classes.dex */
public class SmtConst {
    private static String appContentRootUrl = "https://www.smt-access.com/tif/h5ContentsDownload/";
    private static String consumerKey = "b6d47063196ee813c95675dd69675d5965723a956616a1daa5d6ff6d48669b10";
    private static String consumerSecret = "69d86c7bced5e7d69afad409d9570bfa14c8c59f821eab732aab5dffc1ebb6ff";
    private static String defaultHostsList = "{\"URL\":\"www.smt-access.com\"},{\"URL\":\"api.yelp.com\"}";
    private static String defaultLauncherUrl = "http://www.smt-access.com/tif/h5ContentsDownload/launcher_soa/3.2.3/headunit/index.html?ssl=true";
    private static String hostsListUrl = "https://www.smt-access.com/tif/h5ContentsDownload/common/tls/HostsList.json";
    private static SmtConst mInstance = null;
    private static String serverType = "Prod";
    private static String serverUrl = "https://www.smt-access.com/";
    public final String TAG = "SmtConst";
    public final String SERVER_INFO_PATH = "/assets/serverInfo.json";

    public SmtConst() {
        Log.d("SmtConst", "new SmtConst");
        Log.d("SmtConst", "appContentRootUrl=" + appContentRootUrl);
    }

    public static SmtConst getInstance() {
        if (mInstance == null) {
            mInstance = new SmtConst();
        }
        return mInstance;
    }

    public boolean isProdServer() {
        return serverType.equals("Prod");
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public String getDefaultLauncherUrl() {
        return defaultLauncherUrl;
    }

    public String getAppContentRootUrl() {
        return appContentRootUrl;
    }

    public String getConsumerKey() {
        return consumerKey;
    }

    public String getConsumerSecret() {
        return consumerSecret;
    }

    public String getHostsListUrl() {
        return hostsListUrl;
    }

    public String getDefaultHostsList() {
        return defaultHostsList;
    }
}
