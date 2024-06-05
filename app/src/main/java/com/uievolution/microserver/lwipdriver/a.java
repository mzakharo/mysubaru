package com.uievolution.microserver.lwipdriver;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.utils.Utils;

/* loaded from: classes.dex */
class a extends Thread {
    private f a;
    private g b;
    private boolean c;

    /* JADX INFO: Access modifiers changed from: package-private */
    public a(g gVar, f fVar) {
        super("LWIP:AcceptThread");
        this.c = false;
        this.b = gVar;
        this.a = fVar;
    }

    public void b() {
        Utils.closeQuietly(this.b);
        interrupt();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void c() {
        this.c = true;
        b();
    }

    @Override // java.lang.Thread, java.lang.Runnable
    public void run() {
        MicroServer.Logger.d("LWIP:AcceptThread", "SPP Accept thread is running...");
        try {
            MicroServer.Logger.d("LWIP:AcceptThread", "HS is waiting to be connected...");
            h a = this.b.a();
            MicroServer.Logger.d("LWIP:AcceptThread", "HS is connected by HU.");
            a();
            this.a.onConnect(a);
        } catch (Exception e) {
            MicroServer.Logger.d("LWIP:AcceptThread", "SPP Accept thread is stopped. " + e.getMessage());
            if (!this.c) {
                MicroServer.Logger.w("LWIP:AcceptThread", e);
                this.a.onConnectError(-4, e.getMessage());
            }
        }
    }

    void a() {
        do {
        } while (LWIPDriver.getInstance().tcpipSlipOutput(new byte[8096], 100) > 0);
    }
}
