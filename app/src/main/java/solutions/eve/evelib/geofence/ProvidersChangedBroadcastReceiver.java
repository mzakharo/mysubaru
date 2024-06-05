package solutions.eve.evelib.geofence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
//import androidx.legacy.content.WakefulBroadcastReceiver;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class ProvidersChangedBroadcastReceiver extends BroadcastReceiver {
    @Override // android.content.BroadcastReceiver
    public void onReceive(Context context, Intent intent) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager.isProviderEnabled("gps") && locationManager.isProviderEnabled("network")) {
            Logger.i("NETWORK_PROVIDER, GPS_PROVIDER");
        }
    }
}
