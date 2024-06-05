package solutions.eve.evelib.utils;

import android.util.Log;

/* loaded from: classes.dex */
public class Logger {
    public static void e(String str) {
        if (Config.error) {
            Log.e(Constants.APP_NAME, str);
        }
    }

    public static void d(String str) {
        if (Config.debug) {
            Log.d(Constants.APP_NAME, str);
        }
    }

    public static void i(String str) {
        if (Config.info) {
            Log.i(Constants.APP_NAME, str);
        }
    }

    public static void v(String str) {
        if (Config.verbose) {
            Log.v(Constants.APP_NAME, str);
        }
    }

    public static void e(String str, Exception exc) {
        Log.e(Constants.APP_NAME, str, exc);
    }
}
