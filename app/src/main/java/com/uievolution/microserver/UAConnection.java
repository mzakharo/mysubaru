package com.uievolution.microserver;

import java.nio.ByteBuffer;
import java.util.concurrent.LinkedBlockingDeque;

/* loaded from: classes.dex */
public abstract class UAConnection implements UAConnectionCloser {
    public static final int COMMAND_CLOSE = -1;
    static final /* synthetic */ boolean g = true;
    private final InBlockingQueue a;
    private final OutBlockingQueue b;
    private final SSLEngineProxy c;
    private int d;
    private boolean e;
    private boolean f;

    /* loaded from: classes.dex */
    class a implements QueueObserver {
        a() {
        }

        @Override // com.uievolution.microserver.QueueObserver
        public void update(boolean z) {
            if (z) {
                return;
            }
            UAConnection.this.requestStartSending();
        }
    }

    protected UAConnection() {
        this(false);
    }

    public static UAConnection onAccept(UAConnection uAConnection) {
        MicroServer.getInstance().a(uAConnection);
        return uAConnection;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public InBlockingQueue a() {
        return this.a;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public OutBlockingQueue b() {
        return this.b;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean c() {
        return this.c != null;
    }

    @Override // com.uievolution.microserver.UAConnectionCloser
    public void closeNow() {
        MicroServer.Logger.v("ms.UAConnection", "closeNow, " + getObjectId());
        if (this.e) {
            return;
        }
        this.e = true;
        requestStartSending();
        onClosed(false);
    }

    @Override // com.uievolution.microserver.UAConnectionCloser
    public void closeOnEmpty() {
        MicroServer.Logger.v("ms.UAConnection", "closeOnEmpty, " + getObjectId());
        if (this.f || this.e) {
            return;
        }
        this.f = true;
        requestStartSending();
        onClosed(false);
    }

    protected int flush(byte[] bArr) {
        if (!g && bArr == null) {
            throw new AssertionError();
        }
        int i = 0;
        if (this.b.isEmpty()) {
            return 0;
        }
        while (i < bArr.length && !this.b.isEmpty()) {
            ByteBuffer d = this.b.d();
            int min = Math.min(d.remaining(), bArr.length - i);
            d.get(bArr, i, min);
            i += min;
            if (!d.hasRemaining()) {
                this.b.e();
            }
        }
        this.d += i;
        MicroServer.Logger.v("ms.UAConnection", "flushed, sent=" + i + ", unacked=" + this.d);
        return i;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public abstract String getConnectionType();

    public String getObjectId() {
        return Integer.toHexString(hashCode());
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onClosed(boolean z) {
        MicroServer.Logger.v("ms.UAConnection", "onClosed, " + getObjectId());
        MicroServer.getInstance().b(this);
        SSLEngineProxy sSLEngineProxy = this.c;
        if (sSLEngineProxy != null) {
            sSLEngineProxy.a();
        }
    }

    public int onErr(int i) {
        MicroServer.Logger.v("ms.UAConnection", "onErr, " + getObjectId() + ", errCode=" + i);
        onClosed(true);
        return 0;
    }

    public int onPoll(byte[] bArr) {
        MicroServer.Logger.v("ms.UAConnection", "onPoll, " + getObjectId());
        if (this.e) {
            MicroServer.Logger.d("ms.UAConnection", "close now");
            return -1;
        }
        if (this.f && this.d == 0 && this.b.isEmpty()) {
            MicroServer.Logger.d("ms.UAConnection", "close on empty");
            return -1;
        }
        if (bArr == null || bArr.length <= 0) {
            return 0;
        }
        return flush(bArr);
    }

    public int onRecv(byte[] bArr) {
        if (bArr == null) {
            return onRecv((ByteBuffer) null);
        }
        return onRecv(ByteBuffer.wrap(bArr));
    }

    public int onSent(int i, byte[] bArr) {
        int i2 = this.d - i;
        this.d = i2;
        if (!g && i2 < 0) {
            throw new AssertionError();
        }
        MicroServer.Logger.v("ms.UAConnection", "onSent, " + getObjectId() + ", sent=" + i + ", unacked=" + this.d);
        if (this.e) {
            MicroServer.Logger.d("ms.UAConnection", "close now");
            return -1;
        }
        if (this.f && this.d == 0 && this.b.isEmpty()) {
            MicroServer.Logger.d("ms.UAConnection", "close on empty");
            return -1;
        }
        if (bArr == null || bArr.length <= 0) {
            return 0;
        }
        return flush(bArr);
    }

    protected void requestStartSending() {
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public UAConnection(boolean z) {
        this.d = 0;
        this.e = false;
        this.f = false;
        MicroServer.Logger.v("ms.UAConnection", "constructor, " + getObjectId() + ", secure=" + z);
        if (z) {
            SSLEngineProxy sSLEngineProxy = new SSLEngineProxy();
            this.c = sSLEngineProxy;
            InBlockingQueue inBlockingQueue = new InBlockingQueue(new LinkedBlockingDeque(64), sSLEngineProxy);
            this.a = inBlockingQueue;
            OutBlockingQueue outBlockingQueue = new OutBlockingQueue(new LinkedBlockingDeque(64), sSLEngineProxy);
            this.b = outBlockingQueue;
            sSLEngineProxy.a(inBlockingQueue, outBlockingQueue);
        } else {
            this.a = new InBlockingQueue(new LinkedBlockingDeque());
            this.b = new OutBlockingQueue(new LinkedBlockingDeque(64));
            this.c = null;
        }
        this.b.setObserver(new a());
    }

    public int onRecv(ByteBuffer byteBuffer) {
        MicroServer.Logger.v("ms.UAConnection", "onRecv, " + getObjectId() + ", buffer=" + byteBuffer);
        if (byteBuffer == null) {
            onClosed(true);
            return 0;
        }
        if (this.e) {
            return -1;
        }
        if (this.f && this.d == 0) {
            return -1;
        }
        this.a.c(byteBuffer);
        return 0;
    }
}
