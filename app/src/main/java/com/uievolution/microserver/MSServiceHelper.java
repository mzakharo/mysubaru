package com.uievolution.microserver;

import android.app.Activity;
import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import com.uievolution.microserver.IMicroServerService;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/* loaded from: classes.dex */
public class MSServiceHelper {
    private final Context a;
    private final Application b;
    private Class c;
    private IMicroServerService d;
    private Application.ActivityLifecycleCallbacks e;
    private BindObserver h;
    private final List<IMSSConnectionObserver> f = new ArrayList();
    private final List<IMSSErrorObserver> g = new ArrayList();
    private boolean i = false;
    private int j = 0;
    private final ServiceConnection k = new a();

    /* loaded from: classes.dex */
    public interface BindObserver {
        void onBind();

        void onUnbind();
    }

    /* loaded from: classes.dex */
    class a implements ServiceConnection {

        /* renamed from: com.uievolution.microserver.MSServiceHelper$a$a, reason: collision with other inner class name */
        /* loaded from: classes.dex */
        class C0015a extends TimerTask {
            C0015a() {
            }

            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                MSServiceHelper.this.a();
            }
        }

        a() {
        }

        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            Log.i("MSServiceHelper", "onServiceConnected");
            MSServiceHelper.this.d = IMicroServerService.Stub.asInterface(iBinder);
            if (MSServiceHelper.this.h != null) {
                MSServiceHelper.this.h.onBind();
            }
            Iterator it = MSServiceHelper.this.f.iterator();
            while (it.hasNext()) {
                try {
                    MSServiceHelper.this.d.setObserver((IMSSConnectionObserver) it.next());
                } catch (RemoteException e) {
                    Log.w("MSServiceHelper", e);
                }
            }
            Iterator it2 = MSServiceHelper.this.g.iterator();
            while (it2.hasNext()) {
                try {
                    MSServiceHelper.this.d.setErrorObserver((IMSSErrorObserver) it2.next());
                } catch (RemoteException e2) {
                    Log.w("MSServiceHelper", e2);
                }
            }
        }

        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
            Log.i("MSServiceHelper", "onServiceDisconnected");
            MSServiceHelper.this.d = null;
            if (MSServiceHelper.this.h != null) {
                MSServiceHelper.this.h.onUnbind();
            }
            if (MSServiceHelper.this.i) {
                return;
            }
            MSServiceHelper.this.j = 0;
            new Timer().schedule(new C0015a(), 200L);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class b extends TimerTask {
        b() {
        }

        @Override // java.util.TimerTask, java.lang.Runnable
        public void run() {
            MSServiceHelper.this.a();
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class c implements Application.ActivityLifecycleCallbacks {
        c() {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityCreated(Activity activity, Bundle bundle) {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityDestroyed(Activity activity) {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityPaused(Activity activity) {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityResumed(Activity activity) {
            MSServiceHelper.this.a.sendBroadcast(new Intent(MicroServer.ACTION_USB_ACCESSORY_ATTACHED));
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityStarted(Activity activity) {
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityStopped(Activity activity) {
        }
    }

    public MSServiceHelper(Context context) {
        this.a = context;
        if (context instanceof Application) {
            this.b = (Application) context;
        } else {
            this.b = null;
        }
    }

    public void addConnectionObserver(IMSSConnectionObserver iMSSConnectionObserver) {
        synchronized (this.f) {
            this.f.add(iMSSConnectionObserver);
        }
    }

    public void addErrorObserver(IMSSErrorObserver iMSSErrorObserver) {
        synchronized (this.g) {
            this.g.add(iMSSErrorObserver);
        }
    }

    public void clearConnectionObserver() {
        synchronized (this.f) {
            this.f.clear();
        }
    }

    public void clearErrorObserver() {
        synchronized (this.g) {
            this.g.clear();
        }
    }

    public void disableTraffic() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            this.d.disableTraffic();
            return;
        }
        throw new MicroServerException("Service is not running");
    }

    public void enableTraffic() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            this.d.enableTraffic();
            return;
        }
        throw new MicroServerException("Service is not running");
    }

    public MSError getLastError() throws RemoteException, MicroServerException {
        if (isServiceRunning()) {
            return this.d.getLastError();
        }
        throw new MicroServerException("Service is not running");
    }

    public int getWiFiHttpPort() throws RemoteException, MicroServerException {
        if (isServiceRunning()) {
            return this.d.getWiFiHttpPort();
        }
        throw new MicroServerException("Service is not running");
    }

    public int getWiFiHttpsPort() throws RemoteException, MicroServerException {
        if (isServiceRunning()) {
            return this.d.getWiFiHttpsPort();
        }
        throw new MicroServerException("Service is not running");
    }

    @Deprecated
    public int getWiFiPort() throws RemoteException, MicroServerException {
        if (isServiceRunning()) {
            return this.d.getWiFiHttpPort();
        }
        throw new MicroServerException("Service is not running");
    }

    public boolean isConnected() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            return this.d.isConnected();
        }
        throw new MicroServerException("Service is not running");
    }

    public boolean isEnabledTraffic() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            return this.d.isEnabledTraffic();
        }
        throw new MicroServerException("Service is not running");
    }

    public boolean isServiceRunning() {
        return this.d != null;
    }

    @Deprecated
    public boolean isSppConnected() throws MicroServerException, RemoteException {
        return isConnected();
    }

    public void removeConnectionObserver(IMSSConnectionObserver iMSSConnectionObserver) {
        synchronized (this.f) {
            this.f.remove(iMSSConnectionObserver);
        }
    }

    public void removeErrorObserver(IMSSErrorObserver iMSSErrorObserver) {
        synchronized (this.g) {
            this.g.remove(iMSSErrorObserver);
        }
    }

    public void setBindObserver(BindObserver bindObserver) {
        this.h = bindObserver;
    }

    public synchronized void start(MSConfig mSConfig) {
        start(mSConfig, MicroServerService.class);
    }

    public void startForeground() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            this.d.startForeground();
            return;
        }
        throw new MicroServerException("Service is not running");
    }

    public synchronized boolean stop() {
        Log.d("MSServiceHelper", "stop");
        if (Build.VERSION.SDK_INT >= 14) {
            c();
        }
        if (isServiceRunning() && !this.i) {
            this.a.unbindService(this.k);
        }
        this.i = true;
        this.a.stopService(new Intent(this.a, (Class<?>) this.c));
        this.k.onServiceDisconnected(null);
        return true;
    }

    public void stopForeground() throws MicroServerException, RemoteException {
        if (isServiceRunning()) {
            this.d.stopForeground();
            return;
        }
        throw new MicroServerException("Service is not running");
    }

    private void b() {
        if (this.b != null && this.e == null) {
            c cVar = new c();
            this.e = cVar;
            this.b.registerActivityLifecycleCallbacks(cVar);
        }
    }

    private void c() {
        Application.ActivityLifecycleCallbacks activityLifecycleCallbacks = this.e;
        if (activityLifecycleCallbacks == null) {
            return;
        }
        this.b.unregisterActivityLifecycleCallbacks(activityLifecycleCallbacks);
        this.e = null;
    }

    public synchronized void start(MSConfig mSConfig, Class cls) {
        Log.d("MSServiceHelper", "start class:" + cls.getName());
        this.c = cls;
        if (MicroServerService.class.isAssignableFrom(cls)) {
            this.i = false;
            if (Build.VERSION.SDK_INT >= 14) {
                b();
            }
            if (mSConfig == null) {
                Log.w("MSServiceHelper", "config is null. Use default config.");
                mSConfig = new MSConfig();
            }
            Bundle bundle = new Bundle();
            bundle.putParcelable(MicroServerService.CONFIGURATION_NAME, mSConfig);
            Intent intent = new Intent(this.a, (Class<?>) this.c);
            intent.putExtra(MicroServerService.CONFIGURATION_NAME, bundle);
            if (Build.VERSION.SDK_INT <= 25) {
                this.a.startService(intent);
            } else {
                this.a.startForegroundService(intent);
            }
            this.a.bindService(intent, this.k, 0);
        } else {
            String str = cls.getName() + " is not sub-class of MicroServerService";
            Log.e("MSServiceHelper", str);
            throw new IllegalArgumentException(str);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void a() {
        if (this.i) {
            return;
        }
        boolean bindService = this.a.bindService(new Intent(this.a, (Class<?>) this.c), this.k, 0);
        Log.d("MSServiceHelper", "doBind ret=" + bindService);
        if (bindService || this.i) {
            return;
        }
        int i = this.j + 1;
        this.j = i;
        if (i < 5) {
            new Timer().schedule(new b(), 200L);
        }
    }

    public MSServiceHelper(Context context, Application application) {
        this.a = context;
        this.b = application;
    }
}
