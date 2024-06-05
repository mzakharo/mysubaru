package com.subaru.global.infotainment.gen2.harman;

import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.util.McmConst;
import com.android.lib.mcm.util.McmUtil;
import com.clarion.android.appmgr.stub.Stub;
import com.subaru.global.infotainment.gen2.StarLinkApplication;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import com.subaru.global.infotainment.gen2.harman.error.HarmanErrorManager;

/* loaded from: classes.dex */
public class HarmanOTAUtil {
    private static final String MOBILE_STATUS = "MOBILE";
    private static final String TAG = "TEST_AHA";
    private static final String WIFI_STATUS = "WIFI";

    public static HarmanEnum.NetworkConnectivityMode getNetworkStatus() {
        logDebug("start");
        String checkNetwork = McmUtil.checkNetwork(StarLinkApplication.getInstance());
        logDebug("NetworkState -> " + checkNetwork);
        if (TextUtils.equals(checkNetwork, WIFI_STATUS)) {
            return HarmanEnum.NetworkConnectivityMode.ReachableViaWiFi;
        }
        if (TextUtils.equals(checkNetwork, "MOBILE")) {
            return HarmanEnum.NetworkConnectivityMode.ReachableViaCellular;
        }
        return HarmanEnum.NetworkConnectivityMode.Undefined;
    }

    public static void checkIntent(Intent intent) {
        if (intent != null) {
            String stringExtra = intent.getStringExtra(HarmanOTAConst.INTENT_KEY);
            String stringExtra2 = intent.getStringExtra("errorCode");
            if (TextUtils.isEmpty(stringExtra2) || TextUtils.isEmpty(stringExtra)) {
                return;
            }
            HarmanErrorManager.getInstance().call(HarmanOriginalError.valueOf(stringExtra), HarmanAPI.valueOf(stringExtra2));
        }
    }

    public static void logDebug(String str) {
        Stub.AppMgrContextStub.getAppMgrVersionInfo(StarLinkApplication.getInstance());
    }

    public static boolean isDebug() {
        return Stub.AppMgrContextStub.getAppMgrVersionInfo(StarLinkApplication.getInstance()).contains(McmConst.DEBUG_KEYWORD);
    }

    public static void logError(String str) {
        Log.e(TAG, createMessage(str));
    }

    private static String createMessage(String str) {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        return stackTrace[4].getClassName() + " : " + stackTrace[4].getMethodName() + "[" + stackTrace[4].getLineNumber() + "] " + str;
    }
}
