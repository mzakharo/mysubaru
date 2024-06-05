package com.android.lib.mcm;

import android.util.Log;
/* loaded from: classes.dex */
public class LogWrapper {
    private static boolean sEnabledDebugLog = true;

    public static void setEnabledDebug(boolean z) {
        sEnabledDebugLog = z;
    }

    public static void d(String str, String str2, Throwable th) {
        if (sEnabledDebugLog) {
            Log.d(str, str2, th);
        }
    }

    public static void d(String str, String str2) {
        if (sEnabledDebugLog) {
            Log.d(str, str2);
        }
    }

    public static void e(String str, String str2) {
        Log.e(str, "_error: " + str2);
    }

    public static void w(String str, String str2) {
        Log.w(str, "_warning: " + str2);
    }
}
