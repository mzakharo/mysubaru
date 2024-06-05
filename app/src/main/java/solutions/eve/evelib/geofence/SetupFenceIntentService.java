package solutions.eve.evelib.geofence;

import android.app.IntentService;
import android.content.Intent;
import android.text.TextUtils;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class SetupFenceIntentService extends IntentService {
    public SetupFenceIntentService() {
        super("SetupFenceIntentService");
    }

    @Override // android.app.IntentService
    protected void onHandleIntent(Intent intent) {
        PreferenceManager.setup(this);
        if (!TextUtils.isEmpty(PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null))) {
            GeofenceHelper.getInstance(this);
            Logger.i("Setting up geo fence monitoring...Bluetooth connected: ");
        } else {
            Logger.i("eveconnect empty. Bluetooth connected: ");
        }
    }
}
