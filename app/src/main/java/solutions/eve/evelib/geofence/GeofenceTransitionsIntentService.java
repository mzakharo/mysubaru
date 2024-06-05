package solutions.eve.evelib.geofence;

import android.app.AlarmManager;
import android.app.IntentService;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import com.google.android.gms.location.GeofencingEvent;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONObject;
import solutions.eve.evelib.EVE;
import solutions.eve.evelib.geofence.json.TriggerAutomation;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.helper.json.Token;
import solutions.eve.evelib.http.APIHttpClient;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class GeofenceTransitionsIntentService extends IntentService {
    private static final String TAG = "GeofenceTransitions";
    APIHttpClient httpClient;
    Context mContext;

    public GeofenceTransitionsIntentService() {
        super(TAG);
        this.httpClient = null;
        this.mContext = this;
    }

    @Override // android.app.IntentService
    protected void onHandleIntent(Intent intent) {
        if (EVE.mContext == null) {
            EVE.init(this.mContext);
        }
        if (this.httpClient == null) {
            this.httpClient = APIHttpClient.createClient(this);
        }
        GeofencingEvent fromIntent = GeofencingEvent.fromIntent(intent);
        if (fromIntent.hasError()) {
            Logger.e("Goefencing Error " + GeofenceErrorMessages.getErrorString(this, fromIntent.getErrorCode()));
            return;
        }
        int geofenceTransition = fromIntent.getGeofenceTransition();
        int size = fromIntent.getTriggeringGeofences().size();
        String[] strArr = new String[size];
        for (int i = 0; i < size; i++) {
            strArr[i] = fromIntent.getTriggeringGeofences().get(i).getRequestId();
        }
        if (size > 0) {
            String str = strArr[0];
            Logger.i("geofenceTransition = " + geofenceTransition + " Enter : 1Exit : 2");
            if (geofenceTransition == 1 || geofenceTransition == 4) {
                showNotification("Entered", str);
            } else if (geofenceTransition == 2) {
                Logger.i("Showing Notification...");
                showNotification("Exited", str);
            } else {
                showNotification("Error", "Error");
                Logger.e("Error ");
            }
        }
    }

    public void showNotification(String str, String str2) {
        Logger.e(str + "  :  " + str2);
        LocalBroadcastManager.getInstance(this).sendBroadcast(new Intent(Constants.BROADCAST_ACTION).putExtra(Constants.EXTENDED_DATA_STATUS, str + "  :  " + str2));
        try {
            String[] split = str2.split("__");
            if (split.length != 5) {
                Logger.e("Trouble to trigger automation");
                return;
            }
            Logger.i(split[0]);
            Logger.i(split[1]);
            Logger.i(split[2]);
            Logger.i(split[3]);
            Logger.i(split[4]);
            setTriggerAutomation(new TriggerAutomation(split[0], split[2], split[3], split[4]));
        } catch (Exception e) {
            Logger.e("fail", e);
        }
    }

    public static boolean isBluetoothHeadsetConnected() {
        BluetoothAdapter defaultAdapter = BluetoothAdapter.getDefaultAdapter();
        return defaultAdapter != null && defaultAdapter.isEnabled() && defaultAdapter.getProfileConnectionState(1) == 2;
    }

    public void setTriggerAutomation(TriggerAutomation triggerAutomation) {
        try {
            PreferenceManager.setup(this);
            boolean isBluetoothHeadsetConnected = isBluetoothHeadsetConnected();
            if (EVE.isAppRunningOnHMI) {
                Logger.e("HMI IN FOREGROUND -----> DON'T TRIGGER GEO FENCE ACTION");
                return;
            }
            if (!isBluetoothHeadsetConnected) {
                Logger.e("Headunit if OFF -----> Don't trigger geo fence action");
                return;
            }
            String string = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
            if (string != null) {
                Token token = (Token) new Gson().fromJson(string, Token.class);
                JSONObject jSONObject = new JSONObject(this.httpClient.triggerAutomation(triggerAutomation, token.getJwt()).execute().body().string());
                if (!jSONObject.getBoolean("unverifiablescenes")) {
                    JSONArray jSONArray = jSONObject.getJSONArray("devices");
                    Logger.i("sEveInfo1 - " + new Gson().toJson(jSONArray));
                    startValidation(true, triggerAutomation, jSONArray, token.getJwt());
                    return;
                }
                Logger.d("unverifiablescenes: true no need to verify");
                JSONArray jSONArray2 = jSONObject.getJSONArray("devices");
                Logger.i("sEveInfo1 - " + new Gson().toJson(jSONArray2));
                startValidation(true, triggerAutomation, jSONArray2, token.getJwt());
                return;
            }
            Logger.e("RefreshToken Empty -> TriggerAutomation fail");
        } catch (Exception e) {
            Logger.e("setTriggerAutomation", e);
        }
    }

    private void startValidation(boolean z, TriggerAutomation triggerAutomation, JSONArray jSONArray, String str) {
        try {
            Intent intent = new Intent(this, (Class<?>) ValidateAutomationIntentService.class);
            intent.setAction("testFoo1");
            intent.putExtra("AutomationData", jSONArray.toString());
            intent.putExtra("JWT", str);
            intent.putExtra("triggerAutomation", new Gson().toJson(triggerAutomation));
            PendingIntent service = PendingIntent.getService(this, 702, intent, 134217728);
            AlarmManager alarmManager = (AlarmManager) getSystemService(NotificationCompat.CATEGORY_ALARM);
            alarmManager.cancel(service);
            if (z) {
                alarmManager.set(0, SystemClock.elapsedRealtime() + Constants.ten_seconds, service);
            }
        } catch (Exception e) {
            Logger.e("******** startValidation ERROR *******", e);
        }
    }
}
