package jp.chef_station.chef_station;

import android.util.Log;

/* loaded from: classes.dex */
public final class ChefStationConst {
    public static final int MARKET_PF_LOG_TIME_OUT = 10000;
    public static final String MARKET_PF_PROTOCOL = "https://";
    public static final int MARKET_PF_RETRY_COUNT = 2;
    public static final int MARKET_PF_RETRY_INTERVAL = 0;
    public static String MARKET_PF_SA_AUTH_CONSUMER_KEY = null;
    public static final String MARKET_PF_SA_AUTH_CONSUMER_KEY_F = "7bbe7b758484c89f5ac4046c6fcab5a2904a5007c990bb7baa91eba609117537";
    public static final String MARKET_PF_SA_AUTH_CONSUMER_KEY_T = "a0144f26fbcb68a17511a3b8d4bc8c15ae002cc3bec2e804fb425ea8afab9ce6";
    public static String MARKET_PF_SA_AUTH_SECRET_KEY = null;
    public static final String MARKET_PF_SA_AUTH_SECRET_KEY_F = "612e98e64a0270cb12cea1de56ceaf5ed8ff4487b3dd9694c5f0e053aae4c4d5";
    public static final String MARKET_PF_SA_AUTH_SECRET_KEY_T = "e3e3d0a4e11af2d646859e01f3f0e3e11fca5d398eb1755e671f902a23995f67";
    public static final int MARKET_PF_TIME_OUT = 30000;
    public static String MARKET_PF_URL_HOST = null;
    public static final String MARKET_PF_URL_HOST_F = "sacmp.smart-acs.com";
    public static final String MARKET_PF_URL_HOST_T = "sacmp.clarion.co.jp";
    public static final String MARKET_PF_URL_LICENSE_DETAIL = "/navi/license/detail";
    public static final String MARKET_PF_URL_MARKET_PURCHASE = "/navi/market/purchase";
    public static final String PACKAGE_NAME = "jp.chef_station.chef_station";
    public static final String XSA_AUTHENTICATION_HEADER = "x-sa-authentication";

    private ChefStationConst() {
    }

    public static void init(boolean z) {
        String str;
        String str2;
        String str3;
        Log.d("billing_1511", "ChefStationConst: call init method.");
        if (z) {
            str = MARKET_PF_URL_HOST_F;
            str2 = MARKET_PF_SA_AUTH_CONSUMER_KEY_F;
            str3 = MARKET_PF_SA_AUTH_SECRET_KEY_F;
        } else {
            str = MARKET_PF_URL_HOST_T;
            str2 = MARKET_PF_SA_AUTH_CONSUMER_KEY_T;
            str3 = MARKET_PF_SA_AUTH_SECRET_KEY_T;
        }
        MARKET_PF_URL_HOST = str;
        MARKET_PF_SA_AUTH_CONSUMER_KEY = str2;
        MARKET_PF_SA_AUTH_SECRET_KEY = str3;
        Log.d("billing_1511", "ChefStationConst: call static initializer.");
    }
}
