package com.harman.connectsdk.utils;

import android.content.Context;

/* loaded from: classes.dex */
public class ServiceGlobals {
    public static volatile ServiceGlobals Instance = new ServiceGlobals();
    private volatile boolean isAhaAppServiceRunning = false;
    Context mContext;

    public boolean isAhaAppServiceRunning() {
        return this.isAhaAppServiceRunning;
    }

    public void setAhaAppServiceRunning(boolean z) {
        this.isAhaAppServiceRunning = z;
    }

    public void initialize(Context context) {
        this.mContext = context;
    }
}
