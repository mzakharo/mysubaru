package com.android.lib.mcm.modules;

import android.location.Location;
import android.location.LocationManager;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.CopyOnWriteArrayList;
/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public abstract class SALocationEngine {
    static final String a = "SALocationEngine";
    static int b = 5000;
    static int c = 180000;
    private static SALocationEngine g;
    private Location d;
    private Timer e;
    private final List<IObserver> f = new CopyOnWriteArrayList();

    /* loaded from: classes.dex */
    public interface IObserver {
        void onConnectionFailed(String str);

        void onDisconnected();

        void onLocationChanged(Location location);
    }

    abstract void a();

    abstract void b();

    public static synchronized SALocationEngine getInstance() {
        synchronized (SALocationEngine.class) {
            if (g == null) {
                if (((LocationManager) MicroServer.getInstance().getContext().getSystemService("location")).getProviders(true) != null) {
                    MSLog.d(a, "SALocationEngine is DefaultLocationEngine");
                    SA_a sA_a = new SA_a();
                    g = sA_a;
                    return sA_a;
                }
                MSLog.e(a, "No location engine is available");
            }
            return g;
        }
    }

    public void addObserver(IObserver iObserver) {
        this.f.add(iObserver);
        a();
        d();
    }

    public boolean hasObserver(IObserver iObserver) {
        return this.f.contains(iObserver);
    }

    public void removeObserver(IObserver iObserver) {
        this.f.remove(iObserver);
        if (this.f.isEmpty()) {
            e();
        }
    }

    public Location getLastLocation() {
        if (this.f.isEmpty()) {
            e();
        }
        return this.d;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(Location location) {
        if (location.equals(this.d)) {
            return;
        }
        this.d = location;
        for (IObserver iObserver : this.f) {
            iObserver.onLocationChanged(location);
        }
    }

    void c() {
        MSLog.i(a, "disconnected");
        for (IObserver iObserver : this.f) {
            iObserver.onDisconnected();
        }
    }

    void a(String str) {
        MSLog.d(a, "onConnectionFailed : " + str);
        for (IObserver iObserver : this.f) {
            iObserver.onConnectionFailed(str);
        }
    }

    private void d() {
        Timer timer = this.e;
        if (timer != null) {
            timer.cancel();
            this.e = null;
        }
    }

    private void e() {
        d();
        Timer timer = new Timer();
        this.e = timer;
        timer.schedule(new TimerTask() { // from class: com.android.lib.mcm.modules.SALocationEngine.1
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                MSLog.d(SALocationEngine.a, "Disconnect LocationClient");
                SALocationEngine.this.b();
                SALocationEngine.this.d = null;
            }
        }, c);
    }
}
