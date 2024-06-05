package com.uievolution.microserver.logging;

import com.uievolution.microserver.MicroServer;

/* loaded from: classes.dex */
public class MSLog {
    public static void d(String str, String str2) {
        MicroServer.Logger.d(str, str2);
    }

    public static void e(String str, String str2) {
        MicroServer.Logger.e(str, str2, null);
    }

    public static void i(String str, String str2) {
        MicroServer.Logger.i(str, str2);
    }

    public static void v(String str, String str2) {
        MicroServer.Logger.v(str, str2);
    }

    public static void w(String str, String str2) {
        MicroServer.Logger.w(str, str2);
    }

    public static void d(String str, String str2, Throwable th) {
        MicroServer.Logger.d(str, str2, th);
    }

    public static void e(String str, String str2, Throwable th) {
        MicroServer.Logger.e(str, str2, th);
    }

    public static void i(String str, String str2, Throwable th) {
        MicroServer.Logger.i(str, str2, th);
    }

    public static void v(String str, String str2, Throwable th) {
        MicroServer.Logger.v(str, str2, th);
    }

    public static void w(String str, String str2, Throwable th) {
        MicroServer.Logger.w(str, str2, th);
    }

    public static void e(String str, Throwable th) {
        MicroServer.Logger.e(str, null, th);
    }

    public static void w(String str, Throwable th) {
        MicroServer.Logger.w(str, null, th);
    }
}
