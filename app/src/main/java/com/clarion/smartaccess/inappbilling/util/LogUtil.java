package com.clarion.smartaccess.inappbilling.util;

import android.util.Log;

/* loaded from: classes.dex */
public class LogUtil {
    public static final String TAG = "LogUtil";
    private static boolean enabledDebugLog = true;

    public static void setEnableDebug(boolean z) {
        enabledDebugLog = z;
    }

    public static void logDebug(String str, String str2, Throwable th) {
        if (enabledDebugLog) {
            Log.d(str, str2, th);
        }
    }

    public static void logDebug(String str, String str2) {
        if (enabledDebugLog) {
            Log.d(str, str2);
        }
    }

    public static void logError(String str, String str2) {
        Log.e(str, "_error: " + str2);
    }

    public static void logWarn(String str, String str2) {
        Log.w(str, "_warning: " + str2);
    }
}
