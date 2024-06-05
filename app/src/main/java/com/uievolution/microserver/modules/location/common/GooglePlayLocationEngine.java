package com.uievolution.microserver.modules.location.common;

import android.location.Location;
import android.os.Looper;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class GooglePlayLocationEngine extends LocationEngine {
    private LocationRequest mLocationRequest;
    private final LocationCallback mLocationCallback = new LocationCallback() { // from class: com.uievolution.microserver.modules.location.common.GooglePlayLocationEngine.1
        @Override // com.google.android.gms.location.LocationCallback
        public void onLocationResult(LocationResult locationResult) {
            MSLog.d("LocationEngine", "location updated, " + locationResult.getLastLocation());
            super.onLocationResult(locationResult);
            GooglePlayLocationEngine.this.onUpdateLastLocation(locationResult.getLastLocation());
        }
    };
    private FusedLocationProviderClient mFusedLocationClient = LocationServices.getFusedLocationProviderClient(MicroServer.getInstance().getContext());

    /* JADX INFO: Access modifiers changed from: package-private */
    public GooglePlayLocationEngine() {
        createLocationRequest();
        checkLastLocation();
    }

    private void checkLastLocation() {
        try {
            this.mFusedLocationClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() { // from class: com.uievolution.microserver.modules.location.common.GooglePlayLocationEngine.2
                @Override // com.google.android.gms.tasks.OnCompleteListener
                public void onComplete(Task<Location> task) {
                    if (task.isSuccessful() && task.getResult() != null) {
                        GooglePlayLocationEngine.this.onUpdateLastLocation(task.getResult());
                    } else {
                        MSLog.w("LocationEngine", "Failed to get location.");
                    }
                }
            });
        } catch (SecurityException e) {
            MSLog.e("LocationEngine", "Lost location permission." + e);
        }
    }

    private void createLocationRequest() {
        LocationRequest create = LocationRequest.create();
        this.mLocationRequest = create;
        create.setInterval(LocationEngine.LOCATION_UPDATE_INTERVAL_MSEC);
        this.mLocationRequest.setPriority(100);
    }

    @Override // com.uievolution.microserver.modules.location.common.LocationEngine
    public synchronized void start() {
        MSLog.d("LocationEngine", "start");
        this.mFusedLocationClient.requestLocationUpdates(this.mLocationRequest, this.mLocationCallback, Looper.getMainLooper());
    }

    @Override // com.uievolution.microserver.modules.location.common.LocationEngine
    public synchronized void stop() {
        this.mFusedLocationClient.removeLocationUpdates(this.mLocationCallback);
    }
}
