package com.android.lib.mcm;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import com.android.lib.mcm.InitCustomModuleHelper;
import com.android.lib.mcm.application.MCApplication;
import com.android.lib.mcm.kvswrapper.KvsWrapperService;
//import com.clarion.smartaccess.inappbilling.activity.GooglePlayActivity;
import com.uievolution.microserver.MSServiceHelper;
import java.util.ArrayList;
import java.util.Iterator;
/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class InitCustomModuleHelper_v3 implements InitCustomModuleHelper.VersionDelegate {
    private static final String LOGTAG = "mcm";
    private final Context mAppContext;
    private final MSServiceHelper mServiceHelper;
    private InitCustomModuleHelper.State mState = InitCustomModuleHelper.State.init;
    private InitCustomMudoleTask mLoadModuleTask = null;
    private final ArrayList<MSServiceHelper.BindObserver> sBindObservers = new ArrayList<>();

    /* JADX INFO: Access modifiers changed from: package-private */
    public InitCustomModuleHelper_v3(Context context, InitCustomModuleHelper.IInitCustomModuleHelperDelegate iInitCustomModuleHelperDelegate, MSServiceHelper mSServiceHelper) throws MCException {
        Log.d(LOGTAG, "init module helper.");
        this.mAppContext = context.getApplicationContext();
        this.mServiceHelper = mSServiceHelper;
        initMsHelper();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.android.lib.mcm.InitCustomModuleHelper_v3$1  reason: invalid class name */
    /* loaded from: classes.dex */
    public class AnonymousClass1 implements MSServiceHelper.BindObserver {
        AnonymousClass1() {
        }

        @Override // com.uievolution.microserver.MSServiceHelper.BindObserver
        public void onUnbind() {
            Iterator it = InitCustomModuleHelper_v3.this.sBindObservers.iterator();
            while (it.hasNext()) {
                ((MSServiceHelper.BindObserver) it.next()).onUnbind();
            }
            InitCustomModuleHelper_v3.this.setState(InitCustomModuleHelper.State.init);
            PurchaseNoticePollingUtil.finish(InitCustomModuleHelper_v3.this.mAppContext);
           //Intent intent = new Intent(GooglePlayActivity.ACTION_FINISH_BILLING);
            //intent.putExtra(GooglePlayActivity.KEY_STOP_BILLING_FLAG, true);
            //InitCustomModuleHelper_v3.this.mAppContext.sendBroadcast(intent);
            MCApplication mCApplication = MCApplication.getInstance();
            if (mCApplication != null) {
                mCApplication.clearKvsHelper();
            }
        }

        @Override // com.uievolution.microserver.MSServiceHelper.BindObserver
        public void onBind() {
            InitCustomModuleHelper_v3 initCustomModuleHelper_v3 = InitCustomModuleHelper_v3.this;
            initCustomModuleHelper_v3.cancelLoadModule(initCustomModuleHelper_v3.mServiceHelper);
            InitCustomModuleHelper_v3 initCustomModuleHelper_v32 = InitCustomModuleHelper_v3.this;
            initCustomModuleHelper_v32.loadModule(initCustomModuleHelper_v32.mAppContext, InitCustomModuleHelper_v3.this.mServiceHelper, new InitCustomModuleHelper.LoadModuleListener() { // from class: com.android.lib.mcm.InitCustomModuleHelper_v3.1.1
                @Override // com.android.lib.mcm.InitCustomModuleHelper.LoadModuleListener
                public void onFinish(InitCustomModuleHelper.State state) {
                    Log.d("billing_1507", "MainActivity : finish loadmodule");
                    Log.d("billing_1507", "MainActivity : request purchase notice.");
                    PurchaseNoticePollingUtil.startPolling(InitCustomModuleHelper_v3.this.mAppContext);
                    MCApplication mCApplication = MCApplication.getInstance();
                    if (mCApplication == null) {
                        Log.w(InitCustomModuleHelper_v3.LOGTAG, "initMsHelper() MCApplication.getInstance() is null");
                    } else {
                        mCApplication.setupKvsHelper(new KvsWrapperService.Helper.Callbacks() { // from class: com.android.lib.mcm.InitCustomModuleHelper_v3.1.1.1
                            @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
                            public void onServiceDisconnected() {
                            }

                            @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
                            public void onServiceConnected() {
                                AnonymousClass1.this.postOnBind();
                            }
                        });
                    }
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void postOnBind() {
            Iterator it = InitCustomModuleHelper_v3.this.sBindObservers.iterator();
            while (it.hasNext()) {
                ((MSServiceHelper.BindObserver) it.next()).onBind();
            }
        }
    }

    void initMsHelper() {
        this.mServiceHelper.setBindObserver(new AnonymousClass1());
    }

    void cancelLoadModule(MSServiceHelper mSServiceHelper) {
        InitCustomMudoleTask initCustomMudoleTask = this.mLoadModuleTask;
        if (initCustomMudoleTask != null) {
            initCustomMudoleTask.cancelLoadModule();
            this.mLoadModuleTask = null;
        }
        this.mState = InitCustomModuleHelper.State.init;
    }

    void loadModule(Context context, MSServiceHelper mSServiceHelper, InitCustomModuleHelper.LoadModuleListener loadModuleListener) {
        if (this.mState == InitCustomModuleHelper.State.execute) {
            Log.d(LOGTAG, "InitCustomModuleHelper : already execute.");
            return;
        }
        this.mState = InitCustomModuleHelper.State.execute;
        if (loadModuleListener == null) {
            loadModuleListener = new InitCustomModuleHelper.LoadModuleListener() { // from class: com.android.lib.mcm.InitCustomModuleHelper_v3.2
                @Override // com.android.lib.mcm.InitCustomModuleHelper.LoadModuleListener
                public void onFinish(InitCustomModuleHelper.State state) {
                }
            };
        }
        InitCustomMudoleTask initCustomMudoleTask = new InitCustomMudoleTask(mSServiceHelper, loadModuleListener);
        this.mLoadModuleTask = initCustomMudoleTask;
        initCustomMudoleTask.execute(new Integer[0]);
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
    public InitCustomModuleHelper.State getState() {
        return this.mState;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
    public void setState(InitCustomModuleHelper.State state) {
        this.mState = state;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
    public void addBindObserver(MSServiceHelper.BindObserver bindObserver) {
        this.sBindObservers.add(bindObserver);
        if (this.mState == InitCustomModuleHelper.State.finish) {
            new AddBindHandler(Looper.getMainLooper()).postBindObserver(bindObserver);
        }
    }

    /* loaded from: classes.dex */
    private class AddBindHandler extends Handler {
        MSServiceHelper.BindObserver mSuspendObserver;

        AddBindHandler(Looper looper) {
            super(looper);
        }

        void postBindObserver(MSServiceHelper.BindObserver bindObserver) {
            this.mSuspendObserver = bindObserver;
            post(new Runnable() { // from class: com.android.lib.mcm.InitCustomModuleHelper_v3.AddBindHandler.1
                @Override // java.lang.Runnable
                public void run() {
                    AddBindHandler.this.mSuspendObserver.onBind();
                    AddBindHandler.this.mSuspendObserver = null;
                }
            });
        }
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
    public void removeBindObserver(MSServiceHelper.BindObserver bindObserver) {
        this.sBindObservers.remove(bindObserver);
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
    public void clearBindObserver() {
        this.sBindObservers.clear();
    }
}
