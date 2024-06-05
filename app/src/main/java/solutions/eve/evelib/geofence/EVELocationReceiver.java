package solutions.eve.evelib.geofence;

import android.app.IntentService;
import android.content.Intent;

/* loaded from: classes.dex */
public class EVELocationReceiver extends IntentService {
    @Override // android.app.IntentService
    protected void onHandleIntent(Intent intent) {
    }

    public EVELocationReceiver() {
        super("EVELocationReceiverService");
    }
}
