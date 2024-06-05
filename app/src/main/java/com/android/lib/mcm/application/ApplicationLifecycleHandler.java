package com.android.lib.mcm.application;

import static android.content.Context.RECEIVER_EXPORTED;

import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.RemoteException;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.Util;
import com.uievolution.microserver.IMSSConnectionObserver;
import com.uievolution.microserver.MSServiceHelper;
import com.uievolution.microserver.MicroServerException;
/* loaded from: classes.dex */
public class ApplicationLifecycleHandler implements Application.ActivityLifecycleCallbacks {
    public static final String APP_STATUS_CONNECTED_VEHICLE = "connected_vehicle";
    public static final String APP_STATUS_FOREGROUND = "foreground";
    public static final String APP_STATUS_LAUNCHED = "app_launched";
    public static final String APP_STATUS_SPLIT_CHAR = ",";
    private static final String TAG = "ApplicationLifecycleHandler";
    private static ApplicationLifecycleHandler instance;
    public static final String APP_NOTICE_FOREGROUND = ApplicationLifecycleHandler.class.getName() + ".foreground";
    public static final String APP_NOTICE_BACKGROUND = ApplicationLifecycleHandler.class.getName() + ".background";
    public static final String APP_NOTICE_CONNECTED_VEHICLE = ApplicationLifecycleHandler.class.getName() + ".connected_vehicle";
    public static final String APP_NOTICE_DISCONNECTED_VEHICLE = ApplicationLifecycleHandler.class.getName() + ".disconnected_vehicle";
    public static final String APP_NOTICE_LAUNCH = ApplicationLifecycleHandler.class.getName() + ".app_launch";
    public static final String APP_STATUS_NOTICE_REQUEST = ApplicationLifecycleHandler.class.getName() + ".notice_request";
    private int mStartedActivityCount = 0;
    private boolean mIsForeground = false;
    private boolean mIsConnectedVehicle = true;
    private boolean mIsConnectedVehicleNotify = false;
    private boolean mIsAppLaunch = true;
    private boolean mIsAppLaunchNotify = false;
    private Context mAppContext = null;
    private MSServiceHelper mMwsHelper = null;
    private IMSSConnectionObserver mConnectionObserver = new IMSSConnectionObserver.Stub() { // from class: com.android.lib.mcm.application.ApplicationLifecycleHandler.1
        @Override // com.uievolution.microserver.IMSSConnectionObserver
        public void onConnectionEvent(int i) throws RemoteException {
            if (i == 1) {
                LogWrapper.d(ApplicationLifecycleHandler.TAG, "mConnectionObserver:CONNECTED");
                ApplicationLifecycleHandler.this.mIsConnectedVehicle = true;
            } else if (i == 2) {
                LogWrapper.d(ApplicationLifecycleHandler.TAG, "mConnectionObserver:DISCONNECTED");
                ApplicationLifecycleHandler.this.mIsConnectedVehicle = false;
            }
            ApplicationLifecycleHandler.this.notificationStatus();
        }
    };
    private BroadcastReceiver mAppStatusNoticeRequestReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.application.ApplicationLifecycleHandler.2
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            LogWrapper.d(ApplicationLifecycleHandler.TAG, "mAppStatusNoticeRequestReceiver:onReceive:" + action);
            if (TextUtils.equals(action, Util.makeBroadcastFilter(ApplicationLifecycleHandler.this.mAppContext, ApplicationLifecycleHandler.APP_STATUS_NOTICE_REQUEST))) {
                ApplicationLifecycleHandler.this.notificationStatus(true);
            }
        }
    };

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityCreated(Activity activity, Bundle bundle) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityDestroyed(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityPaused(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityResumed(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
    }

    public static synchronized ApplicationLifecycleHandler initialize(Application application) {
        ApplicationLifecycleHandler applicationLifecycleHandler;
        synchronized (ApplicationLifecycleHandler.class) {
            if (instance == null) {
                LogWrapper.d(TAG, "initialize:create instance");
                ApplicationLifecycleHandler applicationLifecycleHandler2 = new ApplicationLifecycleHandler();
                instance = applicationLifecycleHandler2;
                applicationLifecycleHandler2.mAppContext = application.getApplicationContext();
                application.registerActivityLifecycleCallbacks(instance);
                instance.initialize();
            }
            applicationLifecycleHandler = instance;
        }
        return applicationLifecycleHandler;
    }

    public void setMwsHelper(MSServiceHelper mSServiceHelper) {
        MSServiceHelper mSServiceHelper2 = this.mMwsHelper;
        if (mSServiceHelper2 != null) {
            mSServiceHelper2.removeConnectionObserver(this.mConnectionObserver);
        }
        this.mMwsHelper = mSServiceHelper;
        mSServiceHelper.addConnectionObserver(this.mConnectionObserver);
    }

    public void onBindMws() {
        LogWrapper.d(TAG, "mMicroServerBindObserver:Bind");
        notificationMwsStatus(true);
    }

    public void onUnbindMws() {
        LogWrapper.d(TAG, "mMicroServerBindObserver:Unbind");
        notificationMwsStatus(true);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void notificationStatus() {
        notificationStatus(false);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void notificationStatus(boolean z) {
        notificationMwsStatus(z);
        int i = this.mStartedActivityCount;
        if (i > 0 && (!this.mIsForeground || z)) {
            this.mIsForeground = true;
            broadcastAppFg();
        } else if (i <= 0 && (this.mIsForeground || z)) {
            this.mIsForeground = false;
            broadcastAppBg();
        }
        if (z) {
            broadcastAppLaunch();
            return;
        }
        boolean z2 = this.mIsAppLaunch;
        if (z2 != this.mIsAppLaunchNotify) {
            this.mIsAppLaunchNotify = z2;
            broadcastAppLaunch();
        }
    }

    private void notificationMwsStatus(boolean z) {
        if (z) {
            try {
                MSServiceHelper mSServiceHelper = this.mMwsHelper;
                if (mSServiceHelper != null) {
                    this.mIsConnectedVehicle = mSServiceHelper.isSppConnected();
                }
            } catch (RemoteException e) {
                e.printStackTrace();
                this.mIsConnectedVehicle = false;
            } catch (MicroServerException e2) {
                this.mIsConnectedVehicle = false;
                e2.printStackTrace();
            }
            boolean z2 = this.mIsConnectedVehicle;
            this.mIsConnectedVehicleNotify = z2;
            if (z2) {
                broadcastConnectedVehicle();
                return;
            } else {
                broadcastDisConnectedVehicle();
                return;
            }
        }
        boolean z3 = this.mIsConnectedVehicle;
        if (z3 != this.mIsConnectedVehicleNotify) {
            this.mIsConnectedVehicleNotify = z3;
            if (z3) {
                broadcastConnectedVehicle();
            } else {
                broadcastDisConnectedVehicle();
            }
        }
    }

    private void broadcastAppFg() {
        this.mAppContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mAppContext, APP_NOTICE_FOREGROUND)));
        LogWrapper.d(TAG, "broadcastAppFg");
    }

    private void broadcastAppBg() {
        this.mAppContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mAppContext, APP_NOTICE_BACKGROUND)));
        LogWrapper.d(TAG, "broadcastAppBg");
    }

    private void broadcastConnectedVehicle() {
        this.mAppContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mAppContext, APP_NOTICE_CONNECTED_VEHICLE)));
        LogWrapper.d(TAG, "broadcastConnectedVehicle");
    }

    private void broadcastDisConnectedVehicle() {
        this.mAppContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mAppContext, APP_NOTICE_DISCONNECTED_VEHICLE)));
        LogWrapper.d(TAG, "broadcastDisConnectedVehicle");
    }

    private void broadcastAppLaunch() {
        this.mAppContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mAppContext, APP_NOTICE_LAUNCH)));
        LogWrapper.d(TAG, "broadcastAppLaunch");
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityStarted(Activity activity) {
        this.mStartedActivityCount++;
        notificationStatus();
        LogWrapper.d(TAG, "onActivityStarted:" + this.mStartedActivityCount);
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public void onActivityStopped(Activity activity) {
        this.mStartedActivityCount--;
        notificationStatus();
        LogWrapper.d(TAG, "onActivityStopped:" + this.mStartedActivityCount);
    }

    private void initialize() {
        LogWrapper.setEnabledDebug(true);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Util.makeBroadcastFilter(this.mAppContext, APP_STATUS_NOTICE_REQUEST));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            this.mAppContext.registerReceiver(this.mAppStatusNoticeRequestReceiver, intentFilter, RECEIVER_EXPORTED);
        } else {
            this.mAppContext.registerReceiver(this.mAppStatusNoticeRequestReceiver, intentFilter);
        }
    }

    public boolean isAppFg() {
        return this.mIsForeground;
    }
}
