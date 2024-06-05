package com.clarion.android.appmgr.stub;

import android.content.Context;
import android.content.pm.PackageManager;
import android.util.Log;

/* loaded from: classes.dex */
public class Stub {

    /* loaded from: classes.dex */
    public interface IAppMgrContextDelegate {
        String getAppMgrVersionInfo(Context context);
    }

    /* loaded from: classes.dex */
    public interface IAppMgrLogDelegate {
        void d(String str, String str2);

        void e(String str, String str2);

        void e(String str, String str2, Throwable th);
    }

    /* loaded from: classes.dex */
    public interface ICheckSystemSettingsDelegate {
        boolean isEnabledLocationService(Context context);
    }

    /* loaded from: classes.dex */
    public interface IExceptionLoggerDelegate {
        void write(String str, boolean z);
    }

    /* loaded from: classes.dex */
    public static class AppMgrContextStub {
        public static IAppMgrContextDelegate sDelegate = new IAppMgrContextDelegate() { // from class: com.clarion.android.appmgr.stub.Stub.AppMgrContextStub.1
            @Override // com.clarion.android.appmgr.stub.Stub.IAppMgrContextDelegate
            public String getAppMgrVersionInfo(Context context) {
                Context applicationContext = context.getApplicationContext();
                try {
                    return applicationContext.getPackageManager().getPackageInfo(applicationContext.getPackageName(), 128).versionName;
                } catch (PackageManager.NameNotFoundException e) {
                    e.printStackTrace();
                    return null;
                }
            }
        };

        public static String getAppMgrVersionInfo(Context context) {
            return sDelegate.getAppMgrVersionInfo(context);
        }
    }

    /* loaded from: classes.dex */
    public static class AppMgrLogStub {
        public static IAppMgrLogDelegate sDelegate = new IAppMgrLogDelegate() { // from class: com.clarion.android.appmgr.stub.Stub.AppMgrLogStub.1
            @Override // com.clarion.android.appmgr.stub.Stub.IAppMgrLogDelegate
            public void e(String str, String str2, Throwable th) {
                Log.e(str, str2, th);
            }

            @Override // com.clarion.android.appmgr.stub.Stub.IAppMgrLogDelegate
            public void e(String str, String str2) {
                Log.e(str, str2);
            }

            @Override // com.clarion.android.appmgr.stub.Stub.IAppMgrLogDelegate
            public void d(String str, String str2) {
                Log.d(str, str2);
            }
        };

        public static void d(String str, String str2) {
            sDelegate.d(str, str2);
        }

        public static void e(String str, String str2) {
            sDelegate.e(str, str2);
        }

        public static void e(String str, String str2, Throwable th) {
            sDelegate.e(str, str2, th);
        }
    }

    /* loaded from: classes.dex */
    public static class ExceptionLoggerStub {
        public static IExceptionLoggerDelegate sDelegate = new IExceptionLoggerDelegate() { // from class: com.clarion.android.appmgr.stub.Stub.ExceptionLoggerStub.1
            @Override // com.clarion.android.appmgr.stub.Stub.IExceptionLoggerDelegate
            public void write(String str, boolean z) {
            }
        };
        private static ExceptionLoggerStub mInstance = null;

        public static ExceptionLoggerStub getInstance(Context context) {
            if (mInstance == null) {
                mInstance = new ExceptionLoggerStub();
            }
            return mInstance;
        }

        public void write(String str, boolean z) {
            sDelegate.write(str, z);
        }
    }
}
