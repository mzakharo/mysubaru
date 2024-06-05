package com.uievolution.microserver;

import java.nio.ByteBuffer;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class SSLEngineProxy {
    private OutBlockingQueue a;
    private InBlockingQueue b;
    private long c;

    static {
        System.loadLibrary("uie-sslengine");
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public SSLEngineProxy() {
        MicroServer.Logger.d("SSLEngineProxy", "SSLEngineProxy()");
        this.c = nativeNew();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static boolean a(byte[] bArr, String str, byte[] bArr2) {
        return nativeInit(bArr, str, bArr2);
    }

    static native boolean nativeInit(byte[] bArr, String str, byte[] bArr2);

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized int b(ByteBuffer byteBuffer) {
        if (this.c == 0) {
            MicroServer.Logger.w("SSLEngineProxy", "mSslEngineAddr is 0");
            return 0;
        }
        byte[] bArr = new byte[byteBuffer.remaining()];
        byteBuffer.get(bArr);
        return nativeWriteAppSend(this.c, bArr);
    }

    protected void finalize() throws Throwable {
        if (this.c != 0) {
            a();
        }
        super.finalize();
    }

    native int nativeDelete(long j);

    native long nativeNew();

    native int nativeReadNetRecv(long j, byte[] bArr);

    native int nativeWriteAppSend(long j, byte[] bArr);

    public boolean onReadAppRecv(byte[] bArr) {
        return this.b.e(ByteBuffer.wrap(bArr));
    }

    public boolean onWriteNetSend(byte[] bArr, boolean z) {
        if (z) {
            try {
                this.a.f(ByteBuffer.wrap(bArr));
                return true;
            } catch (InterruptedException unused) {
                return false;
            }
        }
        return this.a.e(ByteBuffer.wrap(bArr));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(InBlockingQueue inBlockingQueue, OutBlockingQueue outBlockingQueue) {
        this.b = inBlockingQueue;
        this.a = outBlockingQueue;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized int a(ByteBuffer byteBuffer) {
        if (this.c == 0) {
            MicroServer.Logger.w("SSLEngineProxy", "mSslEngineAddr is 0");
            return 0;
        }
        byte[] bArr = new byte[byteBuffer.remaining()];
        byteBuffer.get(bArr);
        return nativeReadNetRecv(this.c, bArr);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized boolean a() {
        long j = this.c;
        if (j == 0) {
            return false;
        }
        nativeDelete(j);
        this.c = 0L;
        return true;
    }
}
