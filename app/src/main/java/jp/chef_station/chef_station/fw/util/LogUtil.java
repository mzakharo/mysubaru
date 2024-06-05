package jp.chef_station.chef_station.fw.util;

import android.os.Environment;
import android.util.Log;
import java.io.File;
import java.io.IOException;

/* loaded from: classes.dex */
public class LogUtil {
    private static final LogLevel DEBUG;
    private static final LogLevel ERROR;
    private static final LogLevel INFO;
    private static final String LOGDIR;
    private static final String SDFILE;
    private static final LogLevel VERBOSE;
    private static final LogLevel WARN;
    private static LogUtil instance;
    private boolean enable;
    private File logDir;

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface LogLevel {
        void printLog(String str, String str2);
    }

    static {
        String str = Environment.getExternalStorageDirectory().getPath() + "/logs/";
        LOGDIR = str;
        SDFILE = str + "log.txt";
        instance = null;
        VERBOSE = new LogLevel() { // from class: jp.chef_station.chef_station.fw.util.LogUtil.1
            public String toString() {
                return "VERBOSE";
            }

            @Override // jp.chef_station.chef_station.fw.util.LogUtil.LogLevel
            public void printLog(String str2, String str3) {
                Log.v(str2, str3);
            }
        };
        DEBUG = new LogLevel() { // from class: jp.chef_station.chef_station.fw.util.LogUtil.2
            public String toString() {
                return "DEBUG";
            }

            @Override // jp.chef_station.chef_station.fw.util.LogUtil.LogLevel
            public void printLog(String str2, String str3) {
                Log.d(str2, str3);
            }
        };
        INFO = new LogLevel() { // from class: jp.chef_station.chef_station.fw.util.LogUtil.3
            public String toString() {
                return "INFO";
            }

            @Override // jp.chef_station.chef_station.fw.util.LogUtil.LogLevel
            public void printLog(String str2, String str3) {
                Log.i(str2, str3);
            }
        };
        WARN = new LogLevel() { // from class: jp.chef_station.chef_station.fw.util.LogUtil.4
            public String toString() {
                return "WARN";
            }

            @Override // jp.chef_station.chef_station.fw.util.LogUtil.LogLevel
            public void printLog(String str2, String str3) {
                Log.w(str2, str3);
            }
        };
        ERROR = new LogLevel() { // from class: jp.chef_station.chef_station.fw.util.LogUtil.5
            public String toString() {
                return "ERROR";
            }

            @Override // jp.chef_station.chef_station.fw.util.LogUtil.LogLevel
            public void printLog(String str2, String str3) {
                Log.e(str2, str3);
            }
        };
    }

    private LogUtil() {
        this.enable = false;
        this.logDir = null;
        this.enable = DeployUtil.isDebuggable() || DeployUtil.enableLog();
        this.logDir = new File(LOGDIR);
    }

    public static void init() {
        if (instance == null) {
            instance = new LogUtil();
        }
    }

    public static void v(String str, String str2) {
        LogUtil logUtil = instance;
        if (logUtil != null) {
            logUtil.putMessage(VERBOSE, str, str2);
        }
    }

    public static void d(String str, String str2) {
        LogUtil logUtil = instance;
        if (logUtil != null) {
            logUtil.putMessage(DEBUG, str, str2);
        }
    }

    public static void i(String str, String str2) {
        LogUtil logUtil = instance;
        if (logUtil != null) {
            logUtil.putMessage(INFO, str, str2);
        }
    }

    public static void w(String str, String str2) {
        LogUtil logUtil = instance;
        if (logUtil != null) {
            logUtil.putMessage(WARN, str, str2);
        }
    }

    public static void e(String str, String str2) {
        LogUtil logUtil = instance;
        if (logUtil != null) {
            logUtil.putMessage(ERROR, str, str2);
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:23:0x00de  */
    /* JADX WARN: Removed duplicated region for block: B:24:0x00f5 A[RETURN] */
    /* JADX WARN: Unsupported multi-entry loop pattern (BACK_EDGE: B:14:0x00de -> B:12:0x00dc). Please report as a decompilation issue!!! */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private void putMessage(jp.chef_station.chef_station.fw.util.LogUtil.LogLevel r10, java.lang.String r11, java.lang.String r12) {
        /*
            Method dump skipped, instructions count: 260
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: jp.chef_station.chef_station.fw.util.LogUtil.putMessage(jp.chef_station.chef_station.fw.util.LogUtil$LogLevel, java.lang.String, java.lang.String):void");
    }

    private static boolean mkdir(File file) throws IOException {
        if (!file.exists()) {
            if (file.mkdirs()) {
                return true;
            }
            throw new IOException("File.mkdirs() failed.");
        }
        if (file.isDirectory()) {
            return false;
        }
        throw new IOException("Cannot create path. " + file.toString() + " already exists and is not a directory.");
    }

    public static final void trace() {
        StringBuilder sb = new StringBuilder("Stack Trace");
        sb.append('\n');
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        for (int i = 3; i < stackTrace.length && i < 20; i++) {
            sb.append("| ");
            sb.append(stackTrace[i].getClassName());
            sb.append("#");
            sb.append(stackTrace[i].getMethodName());
            sb.append(" (");
            sb.append(stackTrace[i].getFileName());
            sb.append(": ");
            sb.append(stackTrace[i].getLineNumber());
            sb.append(")\n");
        }
        sb.append("+--------------");
        Log.v("_TODO", sb.toString());
    }
}
