package com.uievolution.microserver;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/* loaded from: classes.dex */
public class OutBlockingQueue {
    private final BlockingQueue<ByteBuffer> a;
    private final SSLEngineProxy b;
    private QueueObserver c;
    private boolean d;

    /* JADX INFO: Access modifiers changed from: package-private */
    public OutBlockingQueue(BlockingQueue<ByteBuffer> blockingQueue) {
        this.d = true;
        this.a = blockingQueue;
        this.b = null;
    }

    private boolean a(ByteBuffer byteBuffer) {
        return this.a.offer(byteBuffer);
    }

    private void c(ByteBuffer byteBuffer) throws InterruptedException {
        this.a.put(byteBuffer);
    }

    private void d(ByteBuffer byteBuffer) {
        this.b.b(byteBuffer);
    }

    boolean b() {
        return this.b != null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean e(ByteBuffer byteBuffer) {
        boolean a = a(byteBuffer);
        a();
        return a;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void f(ByteBuffer byteBuffer) throws InterruptedException {
        c(byteBuffer);
        a();
    }

    public boolean isEmpty() {
        return this.a.isEmpty();
    }

    public boolean offer(ByteBuffer byteBuffer) {
        boolean z;
        if (b()) {
            try {
                z = b(byteBuffer);
            } catch (IOException e) {
                MicroServer.Logger.w("ms.OutBlockingQueue", e);
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

    public void put(ByteBuffer byteBuffer) throws InterruptedException {
        if (b()) {
            d(byteBuffer);
        } else {
            c(byteBuffer);
        }
        a();
    }

    public void setObserver(QueueObserver queueObserver) {
        this.c = queueObserver;
    }

    private boolean b(ByteBuffer byteBuffer) throws IOException {
        this.b.b(byteBuffer);
        return true;
    }

    void a() {
        if (this.d != this.a.isEmpty()) {
            this.d = this.a.isEmpty();
            c();
        }
    }

    void c() {
        QueueObserver queueObserver = this.c;
        if (queueObserver != null) {
            queueObserver.update(this.d);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public ByteBuffer d() {
        return this.a.peek();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public ByteBuffer e() {
        ByteBuffer poll = this.a.poll();
        a();
        return poll;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public OutBlockingQueue(BlockingQueue<ByteBuffer> blockingQueue, SSLEngineProxy sSLEngineProxy) {
        this.d = true;
        this.a = blockingQueue;
        this.b = sSLEngineProxy;
    }

    public boolean offer(ByteBuffer byteBuffer, long j, TimeUnit timeUnit) throws InterruptedException {
        boolean offer = this.a.offer(byteBuffer, j, timeUnit);
        a();
        return offer;
    }
}
