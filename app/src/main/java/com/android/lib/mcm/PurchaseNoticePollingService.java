package com.android.lib.mcm;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Binder;
import android.os.IBinder;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
//import com.clarion.smartaccess.inappbilling.BillingObserverThread;
//import com.clarion.smartaccess.inappbilling.Const;
//import com.clarion.smartaccess.inappbilling.chef_station.ServerLogger;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;
/* loaded from: classes.dex */
public class PurchaseNoticePollingService extends Service {
    private static final int POLLING_INTERVAL = 60000;
    private TimerTask mDefaultTimerTask;
    private int mMwsPort;
    private TimerTask mTimerTask;
    static final String ACTION_PURCHASE_NOTICE_POLLING_START = PurchaseNoticePollingService.class.getName() + ".polling_start";
    static final String ACTION_PURCHASE_NOTICE_POLLING_STOP = PurchaseNoticePollingService.class.getName() + ".polling_stop";
    static final String ACTION_PURCHASE_NOTICE_REQUEST = PurchaseNoticePollingService.class.getName() + ".request";
    static final String ACTION_PURCHASE_NOTICE_FINISH = PurchaseNoticePollingService.class.getName() + ".finish";
    static final String KEY_MWS_PORT = PurchaseNoticePollingService.class.getName() + "key_mws_port";
    static final String KEY_OWNED_PRODUCT_ID = PurchaseNoticePollingService.class.getName() + "key_owned_product_id";
    private boolean mRequesting = false;
    private BroadcastReceiver mPollingActionReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            Log.d("billing_1507", "owned:PurchaseNoticePollingService:onReceive:" + action);
            if (TextUtils.equals(action, PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_POLLING_START)) {
                PurchaseNoticePollingService.this.purchaseNoticePollingStart();
            } else if (TextUtils.equals(action, PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_POLLING_STOP)) {
                PurchaseNoticePollingService.this.purchaseNoticePollingStop();
            } else if (TextUtils.equals(action, PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_REQUEST)) {
                PurchaseNoticePollingService.this.purchaseNoticeRequest();
            } else if (TextUtils.equals(action, PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_FINISH)) {
                PurchaseNoticePollingService.this.purchaseNoticePollingFinish();
            }
        }
    };
    private IBinder mBinder = new PurchaseNoticePollingServiceBinder();
    private Timer mTimer = null;

    public PurchaseNoticePollingService() {
        TimerTask timerTask = new TimerTask() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.2
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                Log.d("billing_1511", "no.2:PurchaseNoticePollingService:timer already stoped.");
            }
        };
        this.mDefaultTimerTask = timerTask;
        this.mTimerTask = timerTask;
        this.mMwsPort = 0;
    }

    /* loaded from: classes.dex */
    class PurchaseNoticePollingServiceBinder extends Binder {
        PurchaseNoticePollingServiceBinder() {
        }

        PurchaseNoticePollingService getService() {
            Log.d("billing_1507", "PurchaseNoticePollingService:getService");
            return PurchaseNoticePollingService.this;
        }
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        Log.d("billing_1507", "PurchaseNoticePollingService:onBind");
        this.mMwsPort = intent.getIntExtra(KEY_MWS_PORT, this.mMwsPort);
        return this.mBinder;
    }

    @Override // android.app.Service
    public void onCreate() {
        Log.d("billing_1507", "PurchaseNoticePollingService:onCreate");
        super.onCreate();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ACTION_PURCHASE_NOTICE_POLLING_START);
        intentFilter.addAction(ACTION_PURCHASE_NOTICE_POLLING_STOP);
        intentFilter.addAction(ACTION_PURCHASE_NOTICE_REQUEST);
        intentFilter.addAction(ACTION_PURCHASE_NOTICE_FINISH);
        getApplicationContext().registerReceiver(this.mPollingActionReceiver, intentFilter);
    }

    @Override // android.app.Service
    public void onDestroy() {
        Log.d("billing_1507", "PurchaseNoticePollingService:onDestroy");
        super.onDestroy();
        purchaseNoticePollingFinish();
        getApplicationContext().unregisterReceiver(this.mPollingActionReceiver);
        this.mPollingActionReceiver = null;
        this.mBinder = null;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void purchaseNoticePollingFinish() {
        Log.d("billing_1507", "PurchaseNoticePollingService:purchaseNoticeFinish");
        Timer timer = this.mTimer;
        if (timer != null) {
            timer.cancel();
            this.mTimer = null;
            this.mTimerTask = this.mDefaultTimerTask;
        }
        Context applicationContext = getApplicationContext();
        applicationContext.stopService(new Intent(applicationContext, PurchaseNoticePollingService.class));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void purchaseNoticePollingStart() {
        Log.d("billing_1507", "PurchaseNoticePollingService:purchaseNoticePollingStart");
        if (this.mTimer != null) {
            Log.d("billing_1507", "PurchaseNoticePollingService:aleady started.");
            return;
        }
        this.mTimer = new Timer();
        Log.d("billing_1507", "no.2:PurchaseNoticePollingService:start polling");
        this.mTimerTask = new TimerTask() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.3
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                PurchaseNoticePollingService.this.purchaseNoticeRequest();
            }
        };
        this.mTimer.schedule(new TimerTask() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.4
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                Log.d("billing_1507", "timer fire");
                PurchaseNoticePollingService.this.mTimerTask.run();
            }
        }, 60000, 60000);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void purchaseNoticePollingStop() {
        Log.d("billing_1507", "PurchaseNoticePollingService:purchaseNoticePollingStop");
        if (this.mTimer == null) {
            return;
        }
        Log.d("billing_1507", "no.2:PurchaseNoticePollingService:stop polling");
        this.mTimer.cancel();
        this.mTimer = null;
        this.mTimerTask = this.mDefaultTimerTask;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void purchaseNoticeRequest() {
        if (Looper.getMainLooper().equals(Looper.myLooper())) {
            //new BillingObserverThread() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.5
            //    @Override // java.lang.Thread, java.lang.Runnable
            //    public void run() {
            //        Log.d("billing_1507", "PurchaseNoticePollingService:BGスレッドへポスト");
           //        PurchaseNoticePollingService.this.purchaseNoticeRequest();
            //    }
            //}.start();
            return;
        }
        //ServerLogger.initLogger(getApplicationContext(), Const.SeqType.purchase_notice);
        if (this.mRequesting) {
            Log.d("billing_1507", "PurchaseNoticePollingService:requesting...");
            return;
        }
        this.mRequesting = true;
        Log.d("billing_1507", "PurchaseNoticePollingService:purchaseNoticeRequest");
        Log.d("billing_1507", "no.2:PurchaseNoticePollingService:exec purchaseNotice", new Throwable());
        AppInfoUtil.connectionMicroServerAsync("http://127.0.0.1:" + this.mMwsPort + "/purchase-notice", new HashMap(), true, null, new AppInfoUtil.ConnectionMicroServerListener() { // from class: com.android.lib.mcm.PurchaseNoticePollingService.6
          /* @Override // com.clarion.android.smartaccess4car.extend.util.AppInfoUtil.ConnectionMicroServerListener
            public void onFinish(String str) {
                Log.d("billing_1507", "no.2:result:" + str);
                PurchaseNoticePollingService.this.mRequesting = false;
            } */
        });
    }
}
