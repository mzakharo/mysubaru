package com.uievolution.microserver.modules.location.common;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
import java.util.Iterator;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class DefaultLocationEngine extends LocationEngine {
    private boolean mStarted = false;
    private final LocationListener mLocationListener = new LocationListener() { // from class: com.uievolution.microserver.modules.location.common.DefaultLocationEngine.1
        @Override // android.location.LocationListener
        public void onLocationChanged(Location location) {
            DefaultLocationEngine.this.onUpdateLastLocation(location);
        }

        @Override // android.location.LocationListener
        public void onProviderDisabled(String str) {
            MSLog.d("LocationEngine", "onProviderDisabled, provider=" + str);
        }

        @Override // android.location.LocationListener
        public void onProviderEnabled(String str) {
        }

        @Override // android.location.LocationListener
        public void onStatusChanged(String str, int i, Bundle bundle) {
            MSLog.d("LocationEngine", "onStatusChanged, provider=" + str + ", status=" + i);
        }
    };
    private final LocationManager mLocationManager = (LocationManager) MicroServer.getInstance().getContext().getSystemService("location");

    @Override // com.uievolution.microserver.modules.location.common.LocationEngine
    public synchronized void start() {
        if (!this.mStarted) {
            this.mStarted = true;
            Looper mainLooper = Looper.getMainLooper();
            Iterator<String> it = this.mLocationManager.getProviders(true).iterator();
            while (it.hasNext()) {
                this.mLocationManager.requestLocationUpdates(it.next(), LocationEngine.LOCATION_UPDATE_INTERVAL_MSEC, 0.0f, this.mLocationListener, mainLooper);
            }
        }
    }

    @Override // com.uievolution.microserver.modules.location.common.LocationEngine
    public synchronized void stop() {
        this.mLocationManager.removeUpdates(this.mLocationListener);
        this.mStarted = false;
    }
}
