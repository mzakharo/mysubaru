package com.harman.services;

import android.content.Context;
import com.harman.services.maps.MapUtils;
import de.mindpipe.android.logging.log4j.LogConfigurator;
import java.io.File;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/* loaded from: classes.dex */
public class Log {
    public static String SDK_VERSION = "_v13.3.9";
    private static boolean isDebugApp = false;
    static Logger logger;

    public static void i(String str, String str2) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.info(getThreadId() + " : " + str + "::" + str2);
                return;
            }
            android.util.Log.i(str, str2);
        }
    }

    public static void w(String str, String str2) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.warn(getThreadId() + " : " + str + "::" + str2);
                return;
            }
            android.util.Log.w(str, str2);
        }
    }

    public static void e(String str, String str2) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.error(getThreadId() + " : " + str + "::" + str2);
                return;
            }
            android.util.Log.e(str, str2);
        }
    }

    public static void d(String str, String str2) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.debug(getThreadId() + " : " + str + "::" + str2);
                return;
            }
            android.util.Log.d(str, str2);
        }
    }

    public static void v(String str, String str2) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.info(getThreadId() + " : " + str + "::" + str2);
                return;
            }
            android.util.Log.v(str, str2);
        }
    }

    public static void e(String str, String str2, Throwable th) {
        if (isDebugApp) {
            Logger logger2 = logger;
            if (logger2 != null) {
                logger2.error(getThreadId() + " : " + str + "::" + str2 + "::" + th);
                return;
            }
            android.util.Log.e(str, str2, th);
        }
    }

    public static long getThreadId() {
        return Thread.currentThread().getId();
    }

    public void intiLogger(String str, Context context) {
        isDebugApp = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(MapUtils.KEY_IS_DEBUG, false);
        LogConfigurator logConfigurator = new LogConfigurator();
        logConfigurator.setFileName(context.getExternalFilesDir(null).getAbsolutePath() + File.separator + "Logs" + File.separator + "logs.txt");
        logConfigurator.setRootLevel(Level.ALL);
        logConfigurator.setLevel("org.apache", Level.ALL);
        logConfigurator.setUseFileAppender(true);
        logConfigurator.setFilePattern("%d %-5p [%c{2}]-[%L] %m%n");
        logConfigurator.setMaxFileSize(8388608L);
        logConfigurator.setMaxBackupSize(5);
        logConfigurator.setImmediateFlush(true);
        logConfigurator.configure();
        logger = Logger.getLogger(str + SDK_VERSION);
    }
}
