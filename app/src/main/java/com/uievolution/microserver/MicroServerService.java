package com.uievolution.microserver;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Process;
import android.os.RemoteCallbackList;
import android.os.RemoteException;
import androidx.core.app.NotificationCompat;
import com.uievolution.microserver.IMicroServerService;
import com.uievolution.microserver.lwipdriver.LWIPParam;
import com.uievolution.microserver.lwipdriver.Type;
import java.io.IOException;
import java.util.Calendar;

/* loaded from: classes.dex */
public class MicroServerService extends Service {
    public static final String ACTION_SHOW_CLOSE_DIALOG = "show_close_dialog";
    public static final String CONFIGURATION_NAME = "com.uievolution.microserver.MSConfigurationParcelable";
    private MicroServer c;
    private MSConfig d;
    private RemoteCallbackList<IMSSConnectionObserver> a = new RemoteCallbackList<>();
    private RemoteCallbackList<IMSSErrorObserver> b = new RemoteCallbackList<>();
    private boolean e = false;
    private Runnable f = new a();
    private final ErrorListener g = new b();
    private final MicroServerSPPConnectionListener h = new c();
    private final IMicroServerService.Stub i = new d();

    /* loaded from: classes.dex */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            MicroServer.Logger.i("MSService", "Notification removal timer is expired.");
            MicroServerService.this.c();
        }
    }

    /* loaded from: classes.dex */
    class b implements ErrorListener {
        b() {
        }

        @Override // com.uievolution.microserver.ErrorListener
        public int error(int i, String str) {
            MicroServer.Logger.e("MSService", "error:" + i + ", " + str);
            synchronized (MicroServerService.this.b) {
                int beginBroadcast = MicroServerService.this.b.beginBroadcast();
                for (int i2 = 0; i2 < beginBroadcast; i2++) {
                    try {
                        ((IMSSErrorObserver) MicroServerService.this.b.getBroadcastItem(i2)).error(i, str);
                    } catch (RemoteException e) {
                        MicroServer.Logger.w("MSService", e);
                    } catch (NullPointerException e2) {
                        MicroServer.Logger.w("MSService", e2);
                    }
                }
                MicroServerService.this.b.finishBroadcast();
            }
            if (i == -8) {
                MicroServerService.this.g();
            }
            return 0;
        }
    }

    /* loaded from: classes.dex */
    class c extends MicroServerSPPConnectionListener {
        c() {
        }

        @Override // com.uievolution.microserver.MicroServerSPPConnectionListener
        public void onConnectionEvent(int i) {
            MicroServerService.this.c(i == 1);
            synchronized (MicroServerService.this.a) {
                int beginBroadcast = MicroServerService.this.a.beginBroadcast();
                for (int i2 = 0; i2 < beginBroadcast; i2++) {
                    try {
                        ((IMSSConnectionObserver) MicroServerService.this.a.getBroadcastItem(i2)).onConnectionEvent(i);
                    } catch (RemoteException e) {
                        MicroServer.Logger.w("MSService", e);
                    } catch (NullPointerException e2) {
                        MicroServer.Logger.w("MSService", e2);
                    }
                }
                MicroServerService.this.a.finishBroadcast();
            }
            if (i == 2) {
                MicroServerService.this.g();
            }
        }
    }

    /* loaded from: classes.dex */
    class d extends IMicroServerService.Stub {
        d() {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void disableTraffic() throws RemoteException {
            MicroServerService.this.c.b();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void enableTraffic() throws RemoteException {
            try {
                MicroServerService.this.c.c();
            } catch (IOException e) {
                MicroServer.Logger.w("MSService", e);
            }
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public MSError getLastError() throws RemoteException {
            return MicroServerService.this.c.e();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public int getWiFiHttpPort() throws RemoteException {
            return MicroServerService.this.c.getWiFiHttpPort();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public int getWiFiHttpsPort() throws RemoteException {
            return MicroServerService.this.c.getWiFiHttpsPort();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        @Deprecated
        public int getWiFiListeningPort() throws RemoteException {
            return MicroServerService.this.c.getWiFiHttpPort();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isConnected() throws RemoteException {
            return MicroServerService.this.c.isConnected();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isEnabledTraffic() throws RemoteException {
            return MicroServerService.this.c.l();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isForeground() throws RemoteException {
            return MicroServerService.this.d();
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void removeErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
            MicroServerService.this.b.unregister(iMSSErrorObserver);
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void removeObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
            MicroServerService.this.a.unregister(iMSSConnectionObserver);
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void restartLWIP() throws RemoteException {
            try {
                MicroServerService.this.c.restartLWIPDriver();
            } catch (IOException e) {
                MicroServer.Logger.w("MSService", e);
            }
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void setErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
            MicroServerService.this.b.register(iMSSErrorObserver);
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void setObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
            MicroServerService.this.a.register(iMSSConnectionObserver);
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void startForeground() throws RemoteException {
            MicroServerService.this.a(false);
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void stopForeground() throws RemoteException {
            MicroServerService.this.c();
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class e implements Runnable {
        e() {
        }

        @Override // java.lang.Runnable
        public void run() {
            try {
                MicroServerService.this.c.stopLWIPDriver();
                MicroServerService.this.c.startLWIPDriver();
            } catch (IOException e) {
                MicroServer.Logger.w("MSService", e);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class f implements Runnable {
        f() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Intent intent = new Intent(MicroServerService.this.c.getContext(), (Class<?>) MicroServerService.class);
            Bundle bundle = new Bundle();
            bundle.putParcelable(MicroServerService.CONFIGURATION_NAME, MicroServerService.this.d);
            intent.putExtra(MicroServerService.CONFIGURATION_NAME, bundle);
            intent.putExtra("com.uievolution.microserver.SelfRestarting", true);
            PendingIntent service = PendingIntent.getService(MicroServerService.this.c.getContext(), 0, intent, 0);
            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(System.currentTimeMillis());
            calendar.add(14, 500);
            ((AlarmManager) MicroServerService.this.c.getContext().getSystemService(NotificationCompat.CATEGORY_ALARM)).set(0, calendar.getTimeInMillis(), service);
            Process.killProcess(Process.myPid());
        }
    }

    private void h() {
        MicroServer.Logger.d("MSService", "stopMicroServer");
        stopForeground(true);
        this.c.unregisterSPPConnectionNotify(this.h);
        this.c.removeErrorListener(this.g);
        this.c.stop();
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        MicroServer.Logger.i("MSService", "onBind");
        return this.i;
    }

    @Override // android.app.Service
    public void onCreate() {
        super.onCreate();
        MicroServer microServer = MicroServer.getInstance();
        this.c = microServer;
        microServer.init(getApplicationContext());
        MicroServer.Logger.i("MSService", "onCreate");
        this.c.addErrorListener(this.g);
        this.c.registerSPPConnectionNotify(this.h);
    }

    @Override // android.app.Service
    public void onDestroy() {
        MicroServer.Logger.i("MSService", "onDestroy");
        h();
        super.onDestroy();
        Process.killProcess(Process.myPid());
    }

    @Override // android.app.Service
    public void onRebind(Intent intent) {
        MicroServer.Logger.i("MSService", "onRebind");
        super.onRebind(intent);
    }

    @Override // android.app.Service
    public void onStart(Intent intent, int i) {
        super.onStart(intent, i);
    }

    @Override // android.app.Service
    public int onStartCommand(Intent intent, int i, int i2) {
        super.onStartCommand(intent, i, i2);
        MicroServer.Logger.i("MSService", "onStartCommand");
        boolean z = true;
        if (intent != null) {
            this.d = (MSConfig) intent.getBundleExtra(CONFIGURATION_NAME).getParcelable(CONFIGURATION_NAME);
            MicroServer.Logger.d("MSService", "update MSConfig");
            z = true ^ intent.getBooleanExtra("com.uievolution.microserver.SelfRestarting", false);
        }
        a(z);
        a(this.d);
        return 2;
    }

    @Override // android.app.Service
    public void onTaskRemoved(Intent intent) {
        MicroServer.Logger.i("MSService", "onTaskRemoved");
        h();
        stopSelf();
        if (Build.VERSION.SDK_INT >= 14) {
            super.onTaskRemoved(intent);
        }
    }

    @Override // android.app.Service
    public boolean onUnbind(Intent intent) {
        MicroServer.Logger.i("MSService", "onUnbind");
        return super.onUnbind(intent);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void c(boolean z) {
        if (z || d()) {
            a(false);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean d() {
        return this.e;
    }

    private boolean e() {
        String string = this.c.getProperties().getString(LWIPParam.PROP_LWIP_BT_RESTART_PROCESS_PER_CONNECTION, "optimal");
        if (string.equals("optimal")) {
            return com.uievolution.microserver.a.a();
        }
        return Boolean.parseBoolean(string);
    }

    private void f() {
        MicroServer.Logger.d("MSService", "restartService");
        h();
        this.c.getHandler().postDelayed(new f(), 500L);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void g() {
        MicroServer.Logger.d("MSService", "startRestartTimer");
        if (this.c.f() == Type.Bluetooth && e()) {
            f();
        } else {
            this.c.getHandler().postDelayed(new e(), 500L);
        }
    }

    private synchronized void a(MSConfig mSConfig) {
        MicroServer.Logger.i("MSService", "startMicroServer");
        if (this.c.isRunning()) {
            MicroServer.Logger.d("MSService", "already started");
        } else {
            this.c.setConfig(mSConfig);
            this.c.run();
        }
    }

    private void b(boolean z) {
        long stopForegroundTimerOnDisconnect;
        MicroServer.Logger.i("MSService", "startNotificationRemovalTimer, onInitialLaunch:" + z);
        a();
        if (z) {
            stopForegroundTimerOnDisconnect = this.d.getStopForegroundTimerOnStart();
        } else {
            stopForegroundTimerOnDisconnect = this.d.getStopForegroundTimerOnDisconnect();
        }
        if (stopForegroundTimerOnDisconnect <= 0) {
            MicroServer.Logger.d("MSService", "Don't activate the timer. timer value:" + stopForegroundTimerOnDisconnect);
            return;
        }
        MicroServer.Logger.d("MSService", "Start the timer. timer value:" + stopForegroundTimerOnDisconnect);
        this.c.getHandler().postDelayed(this.f, stopForegroundTimerOnDisconnect);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void c() {
        MicroServer.Logger.i("MSService", "exitForeground");
        stopForeground(true);
        this.e = false;
        a();
    }

    private void a() {
        this.c.getHandler().removeCallbacks(this.f);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void a(boolean z) {
        Notification notificationDefault;
        MicroServer.Logger.i("MSService", "enterForeground, onInitialLaunch:" + z);
        if (this.c.isConnected() && this.d.getNotificationConnected() != null) {
            notificationDefault = this.d.getNotificationConnected();
        } else {
            notificationDefault = this.d.getNotificationDefault();
        }
        if (notificationDefault == null) {
            notificationDefault = b();
        }
        startForeground(1, notificationDefault);
        this.e = true;
        a();
        if (this.c.isConnected()) {
            return;
        }
        b(z);
    }

    /* JADX WARN: Removed duplicated region for block: B:11:0x0053  */
    /* JADX WARN: Removed duplicated region for block: B:14:0x006a  */
    /* JADX WARN: Removed duplicated region for block: B:17:0x0078  */
    /* JADX WARN: Removed duplicated region for block: B:20:0x0091  */
    /* JADX WARN: Removed duplicated region for block: B:23:0x00a7  */
    /* JADX WARN: Removed duplicated region for block: B:26:0x00bf  */
    /* JADX WARN: Removed duplicated region for block: B:35:0x00fb  */
    /* JADX WARN: Removed duplicated region for block: B:44:0x00b6  */
    /* JADX WARN: Removed duplicated region for block: B:45:0x0087  */
    /* JADX WARN: Removed duplicated region for block: B:46:0x0058  */
    /* JADX WARN: Removed duplicated region for block: B:47:0x003b  */
    /* JADX WARN: Removed duplicated region for block: B:8:0x0031  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private android.app.Notification b() {
        /*
            Method dump skipped, instructions count: 305
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.uievolution.microserver.MicroServerService.b():android.app.Notification");
    }
}
