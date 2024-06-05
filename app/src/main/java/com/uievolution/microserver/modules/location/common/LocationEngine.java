package com.uievolution.microserver.modules.location.common;

import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import androidx.core.content.ContextCompat;
import com.google.android.gms.common.GoogleApiAvailability;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
import java.util.Iterator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.CopyOnWriteArrayList;

/* loaded from: classes.dex */
public abstract class LocationEngine {
    static int INACTIVITY_TIMER_MSEC = 180000;
    static int LOCATION_UPDATE_INTERVAL_MSEC = 5000;
    static final String LOGTAG = "LocationEngine";
    private static LocationEngine sInstance;
    private Timer mInactivityTimer;
    private Location mLastLocation;
    private final List<IObserver> mObservers = new CopyOnWriteArrayList();

    /* loaded from: classes.dex */
    public interface IObserver {
        void onConnectionFailed(String str);

        void onDisconnected();

        void onLocationChanged(Location location);

        void onPermissionError();
    }

    public static synchronized LocationEngine getInstance() {
        synchronized (LocationEngine.class) {
            if (sInstance == null) {
                Context context = MicroServer.getInstance().getContext();
                if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) == 0) {
                    MSLog.d(LOGTAG, "LocationEngine is GooglePlayLocationEngine");
                    GooglePlayLocationEngine googlePlayLocationEngine = new GooglePlayLocationEngine();
                    sInstance = googlePlayLocationEngine;
                    return googlePlayLocationEngine;
                }
                if (((LocationManager) context.getSystemService("location")).getProviders(true) != null) {
                    MSLog.d(LOGTAG, "LocationEngine is DefaultLocationEngine");
                    DefaultLocationEngine defaultLocationEngine = new DefaultLocationEngine();
                    sInstance = defaultLocationEngine;
                    return defaultLocationEngine;
                }
                MSLog.e(LOGTAG, "No location engine is available");
            }
            return sInstance;
        }
    }

    private void restartInactivityTimer() {
        stopInactivityTimer();
        Timer timer = new Timer();
        this.mInactivityTimer = timer;
        timer.schedule(new TimerTask() { // from class: com.uievolution.microserver.modules.location.common.LocationEngine.1
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                MSLog.d(LocationEngine.LOGTAG, "Disconnect LocationClient");
                LocationEngine.this.stop();
                LocationEngine.this.mLastLocation = null;
            }
        }, INACTIVITY_TIMER_MSEC);
    }

    private void stopInactivityTimer() {
        Timer timer = this.mInactivityTimer;
        if (timer != null) {
            timer.cancel();
            this.mInactivityTimer = null;
        }
    }

    public void addObserver(IObserver iObserver) {
        this.mObservers.add(iObserver);
        start();
        stopInactivityTimer();
    }

    public Location getLastLocation() {
        if (this.mObservers.isEmpty()) {
            restartInactivityTimer();
        }
        return this.mLastLocation;
    }

    public boolean hasObserver(IObserver iObserver) {
        return this.mObservers.contains(iObserver);
    }

    public boolean hasPermission() {
        return ContextCompat.checkSelfPermission(MicroServer.getInstance().getContext(), "android.permission.ACCESS_FINE_LOCATION") == 0;
    }

    void onConnectionFailed(String str) {
        MSLog.d(LOGTAG, "onConnectionFailed : " + str);
        Iterator<IObserver> it = this.mObservers.iterator();
        while (it.hasNext()) {
            it.next().onConnectionFailed(str);
        }
    }

    void onDisconnected() {
        MSLog.i(LOGTAG, "disconnected");
        Iterator<IObserver> it = this.mObservers.iterator();
        while (it.hasNext()) {
            it.next().onDisconnected();
        }
    }

    void onPermissionError() {
        MSLog.d(LOGTAG, "onPermissionError");
        Iterator<IObserver> it = this.mObservers.iterator();
        while (it.hasNext()) {
            it.next().onPermissionError();
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void onUpdateLastLocation(Location location) {
        if (location.equals(this.mLastLocation)) {
            return;
        }
        this.mLastLocation = location;
        Iterator<IObserver> it = this.mObservers.iterator();
        while (it.hasNext()) {
            it.next().onLocationChanged(location);
        }
    }

    public void removeObserver(IObserver iObserver) {
        this.mObservers.remove(iObserver);
        if (this.mObservers.isEmpty()) {
            restartInactivityTimer();
        }
    }

    public abstract void start();

    public abstract void stop();
}
