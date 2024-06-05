package solutions.eve.evelib.geofence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class EVEBootUpReceiver extends BroadcastReceiver {
    @Override // android.content.BroadcastReceiver
    public void onReceive(Context context, Intent intent) {
        Logger.i("Device Rebooted.");
        LocalBroadcastManager.getInstance(context).sendBroadcast(new Intent(Constants.BROADCAST_ACTION_PROVIDER).putExtra(Constants.EXTENDED_DATA_PROVIDER_STATUS, true));
    }
}
