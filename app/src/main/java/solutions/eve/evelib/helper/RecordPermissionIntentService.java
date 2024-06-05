package solutions.eve.evelib.helper;

import android.app.IntentService;
import android.content.Intent;

/* loaded from: classes.dex */
public class RecordPermissionIntentService extends IntentService {
    private static final int REQUEST_AUDIO_PERMISSIONS_ID = 33;

    @Override // android.app.IntentService
    protected void onHandleIntent(Intent intent) {
    }

    public RecordPermissionIntentService() {
        super("RecordPermissionIntentService");
    }
}
