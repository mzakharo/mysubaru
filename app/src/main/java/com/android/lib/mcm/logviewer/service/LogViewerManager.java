package com.android.lib.mcm.logviewer.service;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.Toast;
import com.android.lib.mcm.logviewer.LogViewerConst;
import com.android.lib.mcm.logviewer.activity.LogViewerActivity;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogViewerManager {
    private static final String TOAST_MESSAGE = "アプリを終了し、【他のアプリの上に重ねて表示】をONにして再起動して下さい。";
    private static Context sContext;
    private static LogViewerManager sLogViewerManager = new LogViewerManager();
    private static int sTimer;
    private boolean showFlag = true;
    private final BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.logviewer.service.LogViewerManager.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY)) {
                int unused = LogViewerManager.sTimer = intent.getIntExtra(LogViewerConst.INTENT_KEY_TIMER, 3);
            } else {
                action.equals(LogViewerConst.BROADCAST_RECEIVER_SERVICE_KEY);
            }
        }
    };

    private LogViewerManager() {
        sTimer = 3;
    }

    public static LogViewerManager getInstance(Context context) {
        sContext = context;
        return sLogViewerManager;
    }

    public int showLog(JSONObject jSONObject) {
        Log.d(getClass().getName(), "showLog -> start");
        if (this.showFlag) {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.android.lib.mcm.logviewer.service.LogViewerManager.2
                JSONObject tmpJsonObject;
                final /* synthetic */ JSONObject val$jsonObject;

                {
                    this.val$jsonObject = jSONObject;
                    this.tmpJsonObject = jSONObject;
                }

                @Override // java.lang.Runnable
                public void run() {
                    try {
                        WindowManager windowManager = (WindowManager) LogViewerManager.sContext.getSystemService(Context.WINDOW_SERVICE);
                        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams(-2, -2, 2003, 1064, -3);
                        ImageButton imageButton = new ImageButton(LogViewerManager.sContext);
                        //imageButton.setImageResource(17301591);
                        windowManager.addView(imageButton, layoutParams);
                        windowManager.removeView(imageButton);
                        Intent intent = new Intent(LogViewerManager.sContext, LogViewerActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                        intent.putExtra(LogViewerConst.INTENT_KEY_JSON, this.tmpJsonObject.toString());
                        LogViewerManager.sContext.startActivity(intent);
                        LogViewerManager.sContext.registerReceiver(LogViewerManager.this.mBroadcastReceiver, new IntentFilter(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY));
                        LogViewerManager.this.showFlag = false;
                    } catch (Exception unused) {
                        new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.android.lib.mcm.logviewer.service.LogViewerManager.2.1
                            @Override // java.lang.Runnable
                            public void run() {
                                Toast.makeText(LogViewerManager.sContext, LogViewerManager.TOAST_MESSAGE, Toast.LENGTH_LONG).show();
                            }
                        });
                    }
                }
            });
        } else {
            Intent intent = new Intent(LogViewerConst.BROADCAST_RECEIVER_MANAGER_KEY);
            intent.putExtra(LogViewerConst.INTENT_KEY_JSON, jSONObject.toString());
            sContext.sendBroadcast(intent);
        }
        Log.d(getClass().getName(), "showLog -> end");
        return sTimer * 1000;
    }
}
