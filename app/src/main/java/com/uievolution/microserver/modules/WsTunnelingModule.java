package com.uievolution.microserver.modules;

import android.net.Uri;
import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.HttpHeaderWriter;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.QueueObserver;
import com.uievolution.microserver.utils.Utils;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.channels.UnresolvedAddressException;
import java.util.Iterator;

/* loaded from: classes.dex */
public class WsTunnelingModule extends AbstractMSModuleImpl {
    static String r = "WsTunneling";
    private Selector m;
    private SocketChannel o;
    private long n = 1000;
    private boolean p = false;
    private c q = c.NONE;

    /* loaded from: classes.dex */
    class a implements QueueObserver {
        a() {
        }

        @Override // com.uievolution.microserver.QueueObserver
        public void update(boolean z) {
            if (WsTunnelingModule.this.m == null || z) {
                return;
            }
            MicroServer.Logger.d(WsTunnelingModule.r, "Available data for sending");
            SelectionKey keyFor = WsTunnelingModule.this.o.keyFor(WsTunnelingModule.this.m);
            if (keyFor != null) {
                keyFor.interestOps(keyFor.interestOps() | 4);
                WsTunnelingModule.this.m.wakeup();
            }
        }
    }

    /* loaded from: classes.dex */
    class b {
        b() {
        }

        void a(SelectionKey selectionKey) throws IOException {
            if (((SocketChannel) selectionKey.channel()).finishConnect()) {
                MicroServer.Logger.d(WsTunnelingModule.r, "Connection succeeded");
                WsTunnelingModule.this.n = 10000L;
                selectionKey.interestOps(5);
                return;
            }
            MicroServer.Logger.d(WsTunnelingModule.r, "Connection failed");
            throw new IOException("Connection failed");
        }

        void b(SelectionKey selectionKey) throws IOException, InterruptedException {
            SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
            ByteBuffer allocate = ByteBuffer.allocate(8192);
            int read = socketChannel.read(allocate);
            MicroServer.Logger.d(WsTunnelingModule.r, "read size=" + read);
            if (read < 0) {
                socketChannel.close();
            } else {
                allocate.flip();
                WsTunnelingModule.this.getOutQueue().put(allocate);
            }
        }

        void c(SelectionKey selectionKey) throws InterruptedException, IOException {
            SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
            if (WsTunnelingModule.this.q != c.NONE) {
                ByteBuffer peek = WsTunnelingModule.this.getInQueue().peek();
                MicroServer.Logger.d(WsTunnelingModule.r, "write buffer=" + peek);
                socketChannel.write(peek);
                if (!peek.hasRemaining()) {
                    WsTunnelingModule.this.getInQueue().poll();
                }
            } else {
                HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter(WsTunnelingModule.this.getRequestInfo().getRequestLine());
                httpHeaderWriter.addAll(WsTunnelingModule.this.getRequestInfo().getHeaders());
                socketChannel.write(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
                WsTunnelingModule.this.q = c.SENT_HTTP_REQUEST;
            }
            if (WsTunnelingModule.this.getInQueue().isEmpty()) {
                selectionKey.interestOps(1);
            } else {
                selectionKey.interestOps(5);
            }
        }

        void d(SelectionKey selectionKey) throws IOException, InterruptedException {
            if (selectionKey.isValid() && selectionKey.isConnectable()) {
                a(selectionKey);
            }
            if (selectionKey.isValid() && selectionKey.isReadable()) {
                b(selectionKey);
            }
            if (selectionKey.isValid() && selectionKey.isWritable()) {
                c(selectionKey);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public enum c {
        NONE,
        SENT_HTTP_REQUEST
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl, com.uievolution.microserver.MSModule
    public void cancel() {
        MicroServer.Logger.d(r, "cancel, this=" + f());
        this.p = true;
        Selector selector = this.m;
        if (selector == null || !selector.isOpen()) {
            return;
        }
        try {
            this.m.wakeup();
        } catch (Exception e) {
            MicroServer.Logger.w(r, e);
        }
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        MicroServer.Logger.d(r, "WS Proxy started. this=" + f() + ", " + getRequestInfo().getRequestUri());
        this.q = c.NONE;
        getInQueue().setObserver(new a());
        Uri parse = Uri.parse(getRequestInfo().getRequestUri());
        String host = parse.getHost();
        int port = parse.getPort();
        if (port < 0) {
            port = 80;
        }
        try {
            try {
                try {
                    this.m = Selector.open();
                    SocketChannel open = SocketChannel.open();
                    this.o = open;
                    open.configureBlocking(false);
                    this.o.register(this.m, 8, new b());
                    this.o.connect(new InetSocketAddress(host, port));
                    long nanoTime = System.nanoTime();
                    MicroServer.Logger.d(r, "TRY to connect.");
                    while (!this.m.keys().isEmpty()) {
                        MicroServer.Logger.d(r, "call select, timeout=" + this.n);
                        int select = this.m.select(this.n);
                        MicroServer.Logger.d(r, "select DONE readyChannel=" + select + ", stopFlag=" + this.p);
                        if (this.p) {
                            break;
                        }
                        if (select == 0) {
                            if (!this.o.isConnected() && System.nanoTime() - nanoTime > 5000000000L) {
                                MicroServer.Logger.d(r, "Connection timeout");
                                throw new IOException("Connection timeout");
                            }
                        } else {
                            Iterator<SelectionKey> it = this.m.selectedKeys().iterator();
                            while (it.hasNext()) {
                                SelectionKey next = it.next();
                                it.remove();
                                ((b) next.attachment()).d(next);
                            }
                            if (!this.o.isConnected()) {
                                break;
                            }
                        }
                    }
                    Utils.closeQuietly(this.m);
                    Utils.closeQuietly(this.o);
                    closeUaConnectionOnEmpty();
                } catch (Exception e) {
                    MicroServer.Logger.w(r, e);
                    closeUaConnectionNow();
                    MicroServer.Logger.d(r, "HTTPS proxy closed.");
                    return null;
                }
            } catch (UnresolvedAddressException e3) {
                MicroServer.Logger.d(r, "network is unavailable", e3);
                closeUaConnectionNow();
                MicroServer.Logger.d(r, "HTTPS proxy closed.");
                return null;
            }
            MicroServer.Logger.d(r, "HTTPS proxy closed.");
            return null;
        } finally {
            Utils.closeQuietly(this.m);
            Utils.closeQuietly(this.o);
            closeUaConnectionOnEmpty();
        }
    }

    String f() {
        return Integer.toHexString(hashCode());
    }
}
