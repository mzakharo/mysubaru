package com.uievolution.microserver.websocket;

import com.uievolution.microserver.MSWebSocket;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.OutBlockingQueue;
import com.uievolution.microserver.UAConnectionCloser;
import com.uievolution.microserver.utils.Utils;
import java.nio.ByteBuffer;

/* loaded from: classes.dex */
public class ConnectionImpl implements MSWebSocket.Connection {
    private final MSWebSocket a;
    private OutBlockingQueue c;
    private UAConnectionCloser d;
    private static b b = ConnectionImpl.b.INIT;
    private final d e = new d();

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public static /* synthetic */ class a {
        static final /* synthetic */ int[] a;

        static {
            int[] iArr = new int[b.values().length];
            a = iArr;
            try {
                iArr[b.OPEN.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                a[b.RECV_CLOSE.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                a[b.SEND_CLOSE.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public enum b {
        INIT,
        OPEN,
        SEND_CLOSE,
        RECV_CLOSE,
        CLOSED
    }

    public ConnectionImpl(MSWebSocket mSWebSocket, OutBlockingQueue outBlockingQueue, UAConnectionCloser uAConnectionCloser) {
        this.a = mSWebSocket;
        this.c = outBlockingQueue;
        this.d = uAConnectionCloser;
    }

    private boolean a(int i, String str) {
        return false;
        /*
        ByteBuffer a2;
        int i2 = 0;//a.a[this.b.ordinal()];
        if (i2 == 1) {
            this.b = b.SEND_CLOSE;
        } else if (i2 == 2) {
            this.b = b.CLOSED;
        } else if (i2 == 3) {
            return false;
        }
        if (i < 0) {
            a2 = e.a();
        } else {
            a2 = e.a(i, str);
        }
        boolean offer = this.c.offer(a2);
        this.d.closeOnEmpty();
        return offer; */
    }

    @Override // com.uievolution.microserver.MSWebSocket.Connection
    public synchronized boolean close() {
        return a(-1, "");
    }

    @Override // com.uievolution.microserver.MSWebSocket.Connection
    public boolean isOpen() {
        return false;/*
        return this.b == b.OPEN; */
    }

    public void onClose(int i, String str) {
        /*
        Utils._assert(this.b != b.INIT);
        int i2 = a.a[this.b.ordinal()];
        if (i2 == 1) {
            this.b = b.RECV_CLOSE;
        } else if (i2 == 3) {
            this.b = b.CLOSED;
        }
        this.a.onClose(i, str); */
    }

    public void onMessage(String str) {
        this.a.onMessage(str);
    }

    public void onOpen() {
        /*
        Utils._assert(this.b == b.INIT);
        this.b = b.OPEN;
        this.a.onOpen(this); */
    }

    public void onRecv(ByteBuffer byteBuffer) {
        /*
        c a2;
        Utils._assert(byteBuffer != null);
        MicroServer.Logger.d("ws.ConnectionImpl", "onRecv, size=" + byteBuffer);
        this.e.a(byteBuffer);
        while (this.b == b.OPEN && (a2 = this.e.a()) != null) {
            try {
                if (a2.c()) {
                    MicroServer.Logger.d("ws.ConnectionImpl", "OPCODE=" + a2.a() + ", payloadLen=" + a2.d());
                    a(a2);
                }
            } catch (ProtocolException e) {
                MicroServer.Logger.w("ws.ConnectionImpl", e);
                onClose(e.a(), e.getMessage());
                close(e.a(), e.getMessage());
                return;
            }
        } */
    }

    @Override // com.uievolution.microserver.MSWebSocket.Connection
    public synchronized boolean sendMessage(String str) {
        if (!isOpen()) {
            return false;
        }
        return false;
        //return this.c.offer(e.a(str));
    }

    public synchronized boolean sendPong(byte[] bArr) {

        return false;
        /*
        if (!isOpen()) {
            return false;
        }
        MicroServer.Logger.d("ws.ConnectionImpl", "sendPong");
        ByteBuffer b2 = e.b(ByteBuffer.wrap(bArr));
        MicroServer.Logger.d("ws.ConnectionImpl", b2.toString());
        return this.c.offer(b2); */
    }

    @Override // com.uievolution.microserver.MSWebSocket.Connection
    public synchronized boolean close(int i, String str) {
        /*
        if (str == null) {
            str = "";
        }
        return a(i, str); */
        return false;
    }

    public void onMessage(byte[] bArr) {
        this.a.onMessage(bArr);
    }

    @Override // com.uievolution.microserver.MSWebSocket.Connection
    public synchronized boolean sendMessage(byte[] bArr) {
        if (!isOpen()) {
            return false;
        }
        return false;
       // return this.c.offer(e.a(ByteBuffer.wrap(bArr)));
    }

    void a(c cVar) throws ProtocolException {
        if (cVar.a() == 1) {
            onMessage(((f) cVar).f());
            return;
        }
        if (cVar.a() == 2) {
            onMessage(cVar.b());
            return;
        }
        if (cVar.a() == 8) {
            com.uievolution.microserver.websocket.b bVar = (com.uievolution.microserver.websocket.b) cVar;
            int f = bVar.f();
            onClose(f, bVar.g());
            close(f, "");
            return;
        }
        if (cVar.a() == 9) {
            sendPong(cVar.b());
        } else if (cVar.a() != 10) {
            throw new ProtocolException(1002);
        }
    }
}
