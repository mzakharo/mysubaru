package com.uievolution.microserver.lwipdriver;

import com.uievolution.microserver.MicroServer;
import java.io.IOException;
import java.io.InputStream;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class i extends Thread {
    private InputStream a;
    private LWIPDriver b;
    private boolean c;

    /* JADX INFO: Access modifiers changed from: package-private */
    public i(InputStream inputStream, LWIPDriver lWIPDriver) throws IOException {
        super("LWIP:ReadThread");
        this.c = false;
        this.a = inputStream;
        this.b = lWIPDriver;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void a() {
        this.c = true;
        interrupt();
    }

    @Override // java.lang.Thread, java.lang.Runnable
    public void run() {
        MicroServer.Logger.d("LWIP:ReadThread", "SPP Read thread is running...");
        this.c = false;
        byte[] bArr = new byte[32768];
        while (!this.c) {
            try {
                int read = this.a.read(bArr);
                MicroServer.Logger.d("LWIP:ReadThread", "Read " + read + " bytes");
                if (read < 0) {
                    break;
                }
                if (!this.b.b()) {
                    int i = 0;
                    while (i < read) {
                        int tcpipSlipInput = LWIPDriver.getInstance().tcpipSlipInput(bArr, i, read - i);
                        if (tcpipSlipInput < 0) {
                            throw new IOException("Error tcpipSlipInput, err=" + tcpipSlipInput);
                        }
                        i += tcpipSlipInput;
                    }
                }
            } catch (IOException e) {
                this.b.a(-2, "failure to read from SPP.");
                MicroServer.Logger.d("LWIP:ReadThread", "SPP Read thread is stopped.", e);
            }
        }
        this.b.d();
    }
}
