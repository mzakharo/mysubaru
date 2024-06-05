package com.uievolution.microserver;

import com.uievolution.microserver.utils.Utils;
import com.uievolution.microserver.websocket.ConnectionImpl;
import java.nio.ByteBuffer;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class e extends AbstractWorker<byte[]> {
    private h e = (com.uievolution.microserver.h) new c(this);
    private UAConnection f;
    private MSModule g;
    private ConnectionImpl h;

    /* JADX INFO: Access modifiers changed from: package-private */
    public e(UAConnection uAConnection) {
        this.f = uAConnection;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(ByteBuffer byteBuffer) {
        this.f.a().d(byteBuffer);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractWorker
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public byte[] construct() throws Exception {
        while (true) {
            try {
                try {
                    if (Thread.currentThread().isInterrupted()) {
                        break;
                    }
                    MicroServer.Logger.d("ModuleWorker", "start loop worker, mState=" + this.e);
                    if (!this.e.a()) {
                        do {
                        } while (this.e.a(d()));
                    } else if (this.h != null) {
                        this.h.onRecv(d());
                    } else {
                        this.g.start();
                        a();
                    }
                } catch (InterruptedException unused) {
                } catch (Exception e) {
                    this.f.closeNow();
                    MicroServer.Logger.w("ModuleWorker", e);
                    throw e;
                }
            } finally {
                this.f = null;
            }
        }
        return null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean c() {
        return this.f.c();
    }

    @Override // com.uievolution.microserver.AbstractWorker, java.util.concurrent.Future
    public boolean cancel(boolean z) {
        MicroServer.Logger.d("ModuleWorker", "cancel");
        MSModule mSModule = this.g;
        if (mSModule != null) {
            mSModule.cancel();
        }
        ConnectionImpl connectionImpl = this.h;
        if (connectionImpl != null) {
            connectionImpl.onClose(1001, "aborted");
        }
        return super.cancel(z);
    }

    ByteBuffer d() throws InterruptedException {
        return this.f.a().take();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractWorker
    public void finished() {
        MSModule mSModule = this.g;
        if (mSModule != null) {
            mSModule.finished();
        }
        this.g = null;
        super.finished();
    }

    @Override // com.uievolution.microserver.AbstractWorker
    protected void invokeLater(Runnable runnable) {
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(h hVar) {
        this.e = hVar;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(MSModule mSModule, HttpRequestInfo httpRequestInfo) {
        if (mSModule == null) {
            return;
        }
        this.g = mSModule;
        InBlockingQueue a = this.f.a();
        OutBlockingQueue b = this.f.b();
        UAConnection uAConnection = this.f;
        mSModule.init(httpRequestInfo, a, b, uAConnection, uAConnection.getConnectionType());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(MSWebSocket mSWebSocket) {
        Utils._assertIsNull(this.g);
        ConnectionImpl connectionImpl = new ConnectionImpl(mSWebSocket, this.f.b(), this.f);
        this.h = connectionImpl;
        connectionImpl.onOpen();
    }

    void a() {
        this.g = null;
        this.e = (com.uievolution.microserver.h) new c(this);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(HttpHeaderWriter httpHeaderWriter) {
        MicroServer.Logger.d("ModuleWorker", "----- Microserver Start Response -----");
        MicroServer.Logger.d("ModuleWorker", httpHeaderWriter.toString());
        try {
            this.f.b().put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
        } catch (InterruptedException e) {
            MicroServer.Logger.w("ModuleWorker", e);
        }
    }
}
