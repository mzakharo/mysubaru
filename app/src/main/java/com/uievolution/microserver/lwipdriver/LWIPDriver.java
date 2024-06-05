package com.uievolution.microserver.lwipdriver;

import android.content.Context;
import android.os.PowerManager;
import com.uievolution.microserver.ErrorListener;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.MicroServerSPPConnectionListener;
import com.uievolution.microserver.UAConnection;
import com.uievolution.microserver.utils.Utils;
import com.uievolution.systemlogger.CompoundLogger;
import com.uievolution.systemlogger.FileLogger;
import com.uievolution.systemlogger.Logger;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

/* loaded from: classes.dex */
public class LWIPDriver implements f {
    private Set<String> a;
    private int b;
    private static int c;
    private PowerManager.WakeLock d;
    private boolean e;
    private Set<MicroServerSPPConnectionListener> f;
    private int g;
    private ErrorListener h;
    private e i;
    private h j;
    private InputStream k;
    private OutputStream l;
    private n m;
    private i n;
    private boolean o;

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Iterator it = LWIPDriver.this.f.iterator();
            while (it.hasNext()) {
                ((MicroServerSPPConnectionListener) it.next()).onConnectionEvent(2);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Iterator it = LWIPDriver.this.f.iterator();
            while (it.hasNext()) {
                ((MicroServerSPPConnectionListener) it.next()).onConnectionEvent(1);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class cd {
        private static final LWIPDriver a = new LWIPDriver(null);
    }

    static {
        System.loadLibrary("jni_tcpip");
    }

    /* synthetic */ LWIPDriver(a aVar) {
        this();
    }

    public static LWIPDriver getInstance() {
        return cd.a;
    }

    public static UAConnection onAccept(long j, boolean z) {
        return UAConnection.onAccept(new LWIPUAConnection(j, z));
    }

    public void addConnectionListener(MicroServerSPPConnectionListener microServerSPPConnectionListener) {
        this.f.add(microServerSPPConnectionListener);
    }

    boolean b(LWIPParam lWIPParam) throws IOException {
        MicroServer.Logger.d("LWIPDriver", "startWithConnect");
        a(lWIPParam);
        if (this.i == null) {
            MicroServer.Logger.d("LWIPDriver", "Not start, due to disabled");
            return false;
        }
        a(lWIPParam.getAddr(), lWIPParam.getNetmask(), lWIPParam.getHttpPort(), lWIPParam.getHttpsPort(), lWIPParam.isEnablePcap());
        this.i.b(lWIPParam, this);
        return true;
    }

    synchronized void c() {
        if (this.g != 1) {
            this.g = 1;
            PowerManager.WakeLock wakeLock = this.d;
            if (wakeLock != null && !wakeLock.isHeld()) {
                this.d.acquire();
            }
            MicroServer.getInstance().getHandler().post(new b());
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void d() {
        if (this.g != 2) {
            this.g = 2;
            a();
            PowerManager.WakeLock wakeLock = this.d;
            if (wakeLock != null && wakeLock.isHeld()) {
                this.d.release();
            }
            MicroServer.getInstance().getHandler().post(new a());
        }
    }

    public void init() {
        this.e = false;
        this.f.clear();
        this.g = 2;
    }

    public boolean isConnected() {
        return this.g == 1;
    }

    public boolean isMyEndPoint(String str, int i) {
        if (this.a.contains(str)) {
            return i == this.b || i == this.c;
        }
        return false;
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public void onConnect(h hVar) {
        MicroServer.Logger.d("LWIPDriver", "onConnect");
        c();
        this.j = hVar;
        try {
            this.k = hVar.getInputStream();
            i iVar = new i(this.k, this);
            this.n = iVar;
            iVar.start();
            try {
                this.l = this.j.getOutputStream();
                n nVar = new n(this.l, this);
                this.m = nVar;
                nVar.start();
            } catch (IOException e) {
                d();
                a(-3, e.getMessage());
            }
        } catch (IOException e2) {
            d();
            a(-2, e2.getMessage());
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public void onConnectError(int i, String str) {
        MicroServer.Logger.d("LWIPDriver", "onConnectError. readon: " + i + "msg: " + str);
        d();
        a(i, str);
    }

    public synchronized void pause() {
        this.o = true;
    }

    public void removeConnectionListener(MicroServerSPPConnectionListener microServerSPPConnectionListener) {
        this.f.remove(microServerSPPConnectionListener);
    }

    public void removeErrorListener() {
        this.h = null;
    }

    public synchronized void resume() {
        this.o = false;
        n nVar = this.m;
        if (nVar != null) {
            nVar.b();
        }
    }

    public void setErrorListener(ErrorListener errorListener) {
        this.h = errorListener;
    }

    public synchronized boolean start(LWIPParam lWIPParam) throws IOException {
        this.o = false;
        if (this.n == null && this.m == null) {
            this.a.clear();
            this.a.add(lWIPParam.getAddr());
            String string = MicroServer.getInstance().getProperties().getString(MicroServer.PROP_FQDN);
            if (string != null) {
                this.a.add(string);
            }
            this.b = lWIPParam.getHttpPort();
            this.c = lWIPParam.getHttpsPort();
            if (lWIPParam.isServer()) {
                return c(lWIPParam);
            }
            return b(lWIPParam);
        }
        MicroServer.Logger.d("LWIPDriver", "Failed to start, due to already started");
        return false;
    }

    public synchronized void stop() {
        a();
        this.o = false;
    }

    public native int tcpipInit(String str, String str2, int i, int i2, String str3);

    public native int tcpipSlipInput(byte[] bArr, int i, int i2);

    public native int tcpipSlipOutput(byte[] bArr, int i);

    private LWIPDriver() {
        this.a = new HashSet();
        this.b = -1;
        this.c = -1;
        this.e = false;
        this.f = new CopyOnWriteArraySet();
        this.g = 0;
        this.o = false;
    }

    private e a(Type type) {
        MicroServer.Logger.d("LWIPDriver", "createBearer: " + type);
        if (type == Type.Bluetooth) {
            return new com.uievolution.microserver.lwipdriver.b();
        }
        if (type == Type.WiFi) {
            return new k();
        }
        if (type == Type.USB) {
            //return j.d();
            return null;
        }
        return null;
    }

    boolean c(LWIPParam lWIPParam) throws IOException {
        MicroServer.Logger.d("LWIPDriver", "startWithListen");
        a(lWIPParam);
        if (this.i == null) {
            MicroServer.Logger.d("LWIPDriver", "Failed to start, due to disabled");
            return false;
        }
        a(lWIPParam.getAddr(), lWIPParam.getNetmask(), lWIPParam.getHttpPort(), lWIPParam.getHttpsPort(), lWIPParam.isEnablePcap());
        this.i.a(lWIPParam, this);
        return true;
    }

    void a(LWIPParam lWIPParam) {
        MicroServer.Logger.d("LWIPDriver", "initializeBearer:" + lWIPParam.getType());
        e eVar = this.i;
        if (eVar == null || eVar.b() != lWIPParam.getType()) {
            this.i = a(lWIPParam.getType());
            if (lWIPParam.getType() == Type.Bluetooth) {
                this.d = ((PowerManager) MicroServer.getInstance().getContext().getSystemService(Context.POWER_SERVICE)).newWakeLock(1, "com.uievolution.microserver:MicroServer");
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean b() {
        return this.o;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void a(int i, String str) {
        ErrorListener errorListener = this.h;
        if (errorListener != null) {
            errorListener.error(i, str);
        }
    }

    private void a(String str, String str2, int i, int i2, boolean z) {
        if (this.e) {
            return;
        }
        String str3 = null;
        if (z) {
            Logger logger = MicroServer.Logger;
            if (logger instanceof FileLogger) {
                str3 = ((FileLogger) logger).getLogdir().getAbsolutePath();
            } else if (logger instanceof CompoundLogger) {
                Iterator<Logger> it = ((CompoundLogger) logger).getLoggers().iterator();
                while (true) {
                    if (!it.hasNext()) {
                        break;
                    }
                    Logger next = it.next();
                    if (next instanceof FileLogger) {
                        str3 = ((FileLogger) next).getLogdir().getAbsolutePath();
                        break;
                    }
                }
            }
        }
        tcpipInit(str, str2, i, i2, str3);
        this.e = true;
    }

    private synchronized void a() {
        Utils.closeQuietly(this.k);
        Utils.closeQuietly(this.l);
        Utils.closeQuietly(this.j);
        this.j = null;
        i iVar = this.n;
        if (iVar != null) {
            try {
                iVar.a();
                this.n.interrupt();
                this.n.join(200);
            } catch (InterruptedException unused) {
            }
            this.n = null;
        }
        n nVar = this.m;
        if (nVar != null) {
            try {
                nVar.a();
                this.m.interrupt();
                this.m.join(200);
            } catch (InterruptedException unused2) {
            }
            this.m = null;
        }
        this.i.a();
    }
}
