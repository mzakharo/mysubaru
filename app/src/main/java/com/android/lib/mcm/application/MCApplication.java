package com.android.lib.mcm.application;

import android.app.Application;
import com.android.lib.mcm.kvswrapper.KvsWrapperService;
/* loaded from: classes.dex */
public class MCApplication extends Application {
    private static MCApplication sInstance;
    private KvsWrapperService.Helper mKvsHelper = null;
    private KvsWrapperService.Helper.Callbacks mKvsHelperCallbacks = null;

    @Override // android.app.Application
    public void onCreate() {
        super.onCreate();
        sInstance = this;
    }

    public static MCApplication getInstance() {
        return sInstance;
    }

    public KvsWrapperService.Helper getKvsHelper() {
        return this.mKvsHelper;
    }

    public void setupKvsHelper(KvsWrapperService.Helper.Callbacks callbacks) {
        if (this.mKvsHelper == null) {
            this.mKvsHelper = new KvsWrapperService.Helper();
        }
        this.mKvsHelperCallbacks = callbacks;
        this.mKvsHelper.connect(new KvsWrapperService.Helper.Callbacks() { // from class: com.android.lib.mcm.application.MCApplication.1
            @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
            public void onServiceConnected() {
                MCApplication.this.mKvsHelperCallbacks.onServiceConnected();
            }

            @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
            public void onServiceDisconnected() {
                MCApplication.this.mKvsHelperCallbacks.onServiceDisconnected();
                MCApplication.this.mKvsHelperCallbacks = null;
                MCApplication.this.mKvsHelper = null;
            }
        });
    }

    public void clearKvsHelper() {
        KvsWrapperService.Helper helper = this.mKvsHelper;
        if (helper == null) {
            return;
        }
        helper.disconnect();
        this.mKvsHelperCallbacks = null;
        this.mKvsHelper = null;
    }
}
