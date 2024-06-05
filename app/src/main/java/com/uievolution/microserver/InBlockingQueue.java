package com.uievolution.microserver;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.TimeUnit;

/* loaded from: classes.dex */
public class InBlockingQueue {
    private final BlockingDeque<ByteBuffer> a;
    private final SSLEngineProxy b;
    private QueueObserver c;
    private boolean d;

    /* JADX INFO: Access modifiers changed from: package-private */
    public InBlockingQueue(BlockingDeque<ByteBuffer> blockingDeque) {
        this.d = true;
        this.a = blockingDeque;
        this.b = null;
    }

    void a() {
        if (this.d != this.a.isEmpty()) {
            this.d = this.a.isEmpty();
            c();
        }
    }

    boolean b() {
        return this.b != null;
    }

    void c() {
        QueueObserver queueObserver = this.c;
        if (queueObserver != null) {
            queueObserver.update(this.d);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void d(ByteBuffer byteBuffer) {
        this.a.offerFirst(byteBuffer);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean e(ByteBuffer byteBuffer) {
        boolean a = a(byteBuffer);
        if (a) {
            a();
        }
        return a;
    }

    public boolean isEmpty() {
        return this.a.isEmpty();
    }

    public ByteBuffer peek() {
        return this.a.peek();
    }

    public ByteBuffer poll(long j, TimeUnit timeUnit) throws InterruptedException {
        ByteBuffer poll = this.a.poll(j, timeUnit);
        a();
        return poll;
    }

    public void setObserver(QueueObserver queueObserver) {
        this.c = queueObserver;
    }

    public ByteBuffer take() throws InterruptedException {
        ByteBuffer take = this.a.take();
        a();
        return take;
    }

    private boolean b(ByteBuffer byteBuffer) throws IOException {
        while (byteBuffer.hasRemaining()) {
            this.b.a(byteBuffer);
        }
        return true;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean c(ByteBuffer byteBuffer) {
        boolean z;
        if (b()) {
            try {
                z = b(byteBuffer);
            } catch (IOException e) {
                MicroServer.Logger.w("ms.InBlockingQueue", e);
                z = false;
            }
        } else {
            z = a(byteBuffer);
        }
        if (z) {
            a();
        }
        return z;
    }

    public ByteBuffer poll() {
        ByteBuffer poll = this.a.poll();
        a();
        return poll;
    }

    private boolean a(ByteBuffer byteBuffer) {
        return this.a.offer(byteBuffer);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public InBlockingQueue(BlockingDeque<ByteBuffer> blockingDeque, SSLEngineProxy sSLEngineProxy) {
        this.d = true;
        this.a = blockingDeque;
        this.b = sSLEngineProxy;
    }
}
