package com.android.lib.mcm.modules;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class SA_a extends SALocationEngine {
    private boolean d = false;
    private final LocationListener f = new LocationListener() { // from class: com.android.lib.mcm.modules.SA_a.1
        @Override // android.location.LocationListener
        public void onProviderEnabled(String str) {
        }

        @Override // android.location.LocationListener
        public void onStatusChanged(String str, int i, Bundle bundle) {
            MSLog.d("SALocationEngine", "onStatusChanged, provider=" + str + ", status=" + i);
        }

        @Override // android.location.LocationListener
        public void onProviderDisabled(String str) {
            MSLog.d("SALocationEngine", "onProviderDisabled, provider=" + str);
        }

        @Override // android.location.LocationListener
        public void onLocationChanged(Location location) {
            SA_a.this.a(location);
        }
    };
    private final LocationManager e = (LocationManager) MicroServer.getInstance().getContext().getSystemService("location");

    @Override // com.android.lib.mcm.modules.SALocationEngine
    synchronized void a() {
        if (!this.d) {
            this.d = true;
            Looper mainLooper = Looper.getMainLooper();
            for (String str : this.e.getProviders(true)) {
                this.e.requestLocationUpdates(str, b, 0.0f, this.f, mainLooper);
            }
        }
    }

    @Override // com.android.lib.mcm.modules.SALocationEngine
    synchronized void b() {
        this.e.removeUpdates(this.f);
        this.d = false;
    }
}
