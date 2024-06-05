package com.uievolution.microserver.lwipdriver;

import com.uievolution.microserver.MicroServer;
import java.io.IOException;
import java.io.OutputStream;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class n extends Thread {
    private int a;
    private LWIPDriver b;
    private OutputStream c;
    private boolean d;

    /* JADX INFO: Access modifiers changed from: package-private */
    public n(OutputStream outputStream, LWIPDriver lWIPDriver) throws IOException {
        super("LWIP:WriteThread");
        this.a = 65536;
        this.d = false;
        this.c = outputStream;
        this.b = lWIPDriver;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void a() {
        this.d = true;
        notifyAll();
        interrupt();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void b() {
        notifyAll();
    }

    @Override // java.lang.Thread, java.lang.Runnable
    public void run() {
        MicroServer.Logger.d("LWIP:WriteThread", "SPP Write thread is running...");
        this.d = false;
        byte[] bArr = new byte[this.a];
        while (true) {
            if (this.d) {
                break;
            }
            try {
                int tcpipSlipOutput = LWIPDriver.getInstance().tcpipSlipOutput(bArr, 1000);
                if (tcpipSlipOutput > 0) {
                    if (this.b.b()) {
                        synchronized (this) {
                            wait();
                        }
                    }
                    MicroServer.Logger.d("LWIP:WriteThread", "Write " + tcpipSlipOutput + " bytes");
                    this.c.write(bArr, 0, tcpipSlipOutput);
                } else if (tcpipSlipOutput != -11) {
                    MicroServer.Logger.d("LWIP:WriteThread", "outputBytes are less than zero, breaking! err=" + tcpipSlipOutput);
                    break;
                }
            } catch (IOException e) {
                this.b.a(-3, "failure to write to SPP.");
                MicroServer.Logger.w("LWIP:WriteThread", "SPP Write thread is stopped.", e);
            } catch (InterruptedException e2) {
                this.b.a(-3, "failure to write to SPP.");
                MicroServer.Logger.w("LWIP:WriteThread", "SPP Write thread is stopped.", e2);
            }
        }
        this.b.d();
    }
}
