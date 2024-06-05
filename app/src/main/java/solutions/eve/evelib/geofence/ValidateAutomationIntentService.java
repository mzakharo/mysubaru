package solutions.eve.evelib.geofence;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import com.google.gson.Gson;
import org.json.JSONArray;
import solutions.eve.evelib.EVE;
//import solutions.eve.evelib.R;
import com.example.mysubaru.R;
import solutions.eve.evelib.geofence.json.TriggerAutomation;
import solutions.eve.evelib.http.APIHttpClient;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class ValidateAutomationIntentService extends IntentService {
    private static final String TAG = "ValidateAutomationIntentService";
    public static boolean isCallInProgress;
    private static AudioManager mAudioManager;
    APIHttpClient httpClient;
    String jwt;
    Context mContext;
    Handler osHandler;
    private Runnable runnable;
    Thread tiggerthread;
    boolean verifcation_status;

    public ValidateAutomationIntentService() {
        super(TAG);
        this.osHandler = new Handler();
        this.verifcation_status = false;
        this.mContext = this;
    }

    private void startAudioListener() {
        new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.1
            @Override // java.lang.Runnable
            public void run() {
                AudioManager unused = ValidateAutomationIntentService.mAudioManager = (AudioManager) ValidateAutomationIntentService.this.mContext.getSystemService("audio");
            }
        });
    }

    @Override // android.app.IntentService
    protected void onHandleIntent(Intent intent) {
        if (EVE.mContext == null) {
            EVE.init(this.mContext);
        }
        if (this.httpClient == null) {
            this.httpClient = APIHttpClient.createClient(this);
        }
        Bundle extras = intent.getExtras();
        if (extras != null) {
            startAudioListener();
            String string = extras.getString("AutomationData");
            final TriggerAutomation triggerAutomation = (TriggerAutomation) new Gson().fromJson(extras.getString("triggerAutomation"), TriggerAutomation.class);
            this.jwt = extras.getString("JWT");
            Logger.e("devices: " + string);
            Logger.e("automation: " + new Gson().toJson(triggerAutomation));
            if (TextUtils.isEmpty(string) || TextUtils.isEmpty(new Gson().toJson(triggerAutomation))) {
                return;
            }
            try {
                final JSONArray jSONArray = new JSONArray(string);
                Logger.e(jSONArray.toString());
                Runnable runnable = new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.2
                    @Override // java.lang.Runnable
                    public void run() {
                        ValidateAutomationIntentService.this.triggerValidation(triggerAutomation, jSONArray.toString(), ValidateAutomationIntentService.this.jwt);
                        Logger.e("------ FIRING VERIFY AUTOMATION ----------");
                        ValidateAutomationIntentService.this.osHandler.postDelayed(this, 20000L);
                    }
                };
                this.runnable = runnable;
                this.osHandler.postDelayed(runnable, 5000L);
                this.osHandler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.3
                    @Override // java.lang.Runnable
                    public void run() {
                        ValidateAutomationIntentService.this.cancelRequest();
                    }
                }, 40000L);
                return;
            } catch (Exception e) {
                Logger.e("Fail", e);
                return;
            }
        }
        Logger.e("Bundle is null");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void cancelRequest() {
        Logger.e("Canceling req");
        this.osHandler.removeCallbacks(this.runnable);
        Thread thread = this.tiggerthread;
        if (thread != null) {
            thread.interrupt();
        }
        if (this.verifcation_status) {
            return;
        }
        playErrorMsg();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void playErrorMsg() {
        Logger.e("playErrorMsg");
        Logger.e("AUDIO MANAGER MODE: " + mAudioManager.getMode());
        if (mAudioManager.getMode() != 0) {
            Logger.e("User in call...don't play message");
            new Handler().postDelayed(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.4
                @Override // java.lang.Runnable
                public void run() {
                    ValidateAutomationIntentService.this.playErrorMsg();
                }
            }, 7000L);
            return;
        }
        Handler handler = new Handler(Looper.getMainLooper());
        if (EVE.mContext == null) {
            EVE.init(this.mContext);
        }
        final MediaPlayer create = MediaPlayer.create(this.mContext, R.raw.error_eveconenct_automation);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.5
            @Override // java.lang.Runnable
            public void run() {
                if (EVE.mContext == null) {
                    EVE.init(ValidateAutomationIntentService.this.mContext);
                }
                EVE.startHMIcall();
            }
        }, Constants.one_sec);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.6
            @Override // java.lang.Runnable
            public void run() {
                try {
                    create.start();
                } catch (Exception unused) {
                    Logger.e("Error playing geo fence audio file");
                }
            }
        }, 2500L);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.7
            @Override // java.lang.Runnable
            public void run() {
                if (EVE.mContext == null) {
                    EVE.init(ValidateAutomationIntentService.this.mContext);
                    Logger.e("Error creating instance to stop fake phone call");
                }
                EVE.stopHMIcall();
                create.release();
            }
        }, 11000L);
    }

    void triggerValidation(final TriggerAutomation triggerAutomation, final String str, final String str2) {
        Thread thread = new Thread() { // from class: solutions.eve.evelib.geofence.ValidateAutomationIntentService.8
            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                if (TextUtils.isEmpty(str2)) {
                    return;
                }
                try {
                    boolean verificationStatus = ValidateAutomationIntentService.this.verificationStatus(ValidateAutomationIntentService.this.httpClient.triggerValidation(triggerAutomation, str, str2).execute().body().string());
                    Logger.e("shouldContinue - " + verificationStatus);
                    if (verificationStatus) {
                        Logger.e("allDevicesVerified = TRUE...canceling request ");
                        ValidateAutomationIntentService.this.cancelRequest();
                    }
                } catch (Exception e) {
                    Logger.e(e.getMessage());
                    e.printStackTrace();
                }
            }
        };
        this.tiggerthread = thread;
        thread.start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean verificationStatus(String str) {
        if (TextUtils.isEmpty(str)) {
            return true;
        }
        try {
            JSONArray jSONArray = new JSONArray(str);
            Logger.e("Devices Array Count: " + jSONArray.length());
            for (int i = 0; i < jSONArray.length(); i++) {
                JSONArray jSONArray2 = jSONArray.getJSONArray(i);
                for (int i2 = 0; i2 < jSONArray2.length(); i2++) {
                    if (!jSONArray2.getJSONObject(i2).getBoolean("verifcation_status")) {
                        Logger.e("****** NOT ALL DEVICES VERIFIED *********");
                        this.verifcation_status = false;
                        return false;
                    }
                }
            }
            this.verifcation_status = true;
            Logger.e("******* LOOP COMPLETED - verifcation_status:" + this.verifcation_status);
            return this.verifcation_status;
        } catch (Exception unused) {
            Logger.e("CATCH ERROR FOR verificationStatus:" + this.verifcation_status);
            return true;
        }
    }
}
