package com.android.lib.mcm.logviewer.activity;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageButton;
import com.android.lib.mcm.logviewer.LogViewerConst;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.MicroServerSPPConnectionListener;
/* loaded from: classes.dex */
public class LogViewerService extends Service {
    private static final int INTENT_FAILURE = 99;
    private boolean showFlag = true;
    private final IBinder mBinder = new LogViewerServiceLocalBinder();
    private final BroadcastReceiver mbroadcastReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerService.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY)) {
                int intExtra = intent.getIntExtra(LogViewerConst.INTENT_KEY_TRANSITION_MODE, 99);
                if (intExtra == 1) {
                    LogViewerService.this.showFlag = true;
                } else if (intExtra == 2) {
                    LogViewerService.this.showFlag = false;
                }
            }
        }
    };

    @Override // android.app.Service
    public void onCreate() {
        super.onCreate();
        String name = getClass().getName();
        Log.d(name, getClass().getName() + " -> onCreate : start");
        try {
            createView();
        } catch (Exception e) {
            e.getStackTrace();
        }
        MicroServer.getInstance().registerSPPConnectionNotify(new MicroServerSPPConnectionListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerService.2
            @Override // com.uievolution.microserver.MicroServerSPPConnectionListener
            public void onConnectionEvent(int i) {
                LogViewerService.this.onDestroy();
            }
        });
        registerReceiver(this.mbroadcastReceiver, new IntentFilter(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY));
        String name2 = getClass().getName();
        Log.d(name2, getClass().getName() + " -> onCreate : end");
    }

    private void createView() {
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams(-2, -2, 2003, 1064, -3);
        layoutParams.gravity = 53;
        ImageButton imageButton = new ImageButton(this);
        imageButton.setImageResource(17301591);
        imageButton.setOnClickListener(new View.OnClickListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerService.3
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                if (!LogViewerService.this.showFlag) {
                    Intent intent = new Intent(LogViewerService.this, LogViewerActivity.class);
                    intent.addFlags(268435456);
                    intent.addFlags(1073741824);
                    LogViewerService.this.startActivity(intent);
                    return;
                }
                LogViewerService.this.sendBroadcast(new Intent(LogViewerConst.BROADCAST_RECEIVER_SERVICE_KEY));
            }
        });
        ((WindowManager) getSystemService("window")).addView(imageButton, layoutParams);
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return this.mBinder;
    }

    /* loaded from: classes.dex */
    public class LogViewerServiceLocalBinder extends Binder {
        public LogViewerServiceLocalBinder() {
        }

        public LogViewerService getService() {
            return LogViewerService.this;
        }
    }

    @Override // android.app.Service
    public void onTaskRemoved(Intent intent) {
        onDestroy();
    }
}
