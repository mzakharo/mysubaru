package com.clarion.android.appmgr.auth;

import android.content.Context;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.appmgr.stub.Stub;
import com.clarion.android.appmgr.vespa.HttpDownloader;
import java.io.IOException;
import java.io.InputStream;
import jp.chef_station.chef_station.ChefStationConst;

/* loaded from: classes.dex */
public class WebAppAuth {
    private Context mContext;
    private final String URL_SERVER_NORMAL = "https://www.smt-access.com";
    private final String URL_SERVER_TEST = "https://tvespa.clarion.co.jp";
    private final String URL_DOCUMENT = "/tif/v1/?smt-service=spap-reg.getAppInfo";
    private final String CONSUMER_KEY_NORMAL = ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_F;
    private final String CONSUMER_SECRET_NORMAL = ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_F;
    private final String CONSUMER_KEY_TEST = ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_T;
    private final String CONSUMER_SECRET_TEST = ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_T;
    private final String PVR = "0";
    private final String AVR = "1";
    private String consumer_key = "";
    private String consumer_secret = "";
    private String url_log = "";
    private String pid_log = "";

    private String constructData() {
        return "oemId=1&type=3&sort=2";
    }

    public WebAppAuth(Context context) {
        this.mContext = context;
        setVariableValue(context);
    }

    private void setVariableValue(Context context) {
        String appMgrVersionInfo = Stub.AppMgrContextStub.getAppMgrVersionInfo(context);
        if (appMgrVersionInfo != null) {
            if (appMgrVersionInfo.indexOf(McmConst.DEBUG_KEYWORD) != -1) {
                this.consumer_key = ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_T;
                this.consumer_secret = ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_T;
                this.url_log = "https://tvespa.clarion.co.jp/tif/v1/?smt-service=spap-reg.getAppInfo";
                return;
            } else {
                this.consumer_key = ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_F;
                this.consumer_secret = ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_F;
                this.url_log = "https://www.smt-access.com/tif/v1/?smt-service=spap-reg.getAppInfo";
                return;
            }
        }
        this.consumer_key = ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_T;
        this.consumer_secret = ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_T;
        this.url_log = "https://tvespa.clarion.co.jp/tif/v1/?smt-service=spap-reg.getAppInfo";
    }

    public InputStream startDownloadWebAppList(String str) {
        this.pid_log = str;
        try {
            return new HttpDownloader().getInputStreamByPost(this.url_log, "PVR=0;AVR=1;CONSUMERKEY=" + this.consumer_key + ";CONSUMERSECRET=" + this.consumer_secret + ";PID=" + this.pid_log, constructData(), this.mContext);
        } catch (IOException unused) {
            return null;
        }
    }
}
