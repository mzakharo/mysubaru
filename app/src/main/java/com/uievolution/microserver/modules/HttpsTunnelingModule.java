package com.uievolution.microserver.modules;

import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.HttpHeaderWriter;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.QueueObserver;
import com.uievolution.microserver.modules.MSHTTPSProxyRequestInterceptor;
import com.uievolution.microserver.utils.Utils;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.channels.UnresolvedAddressException;
import java.util.Iterator;
import java.util.List;

/* loaded from: classes.dex */
public class HttpsTunnelingModule extends AbstractMSModuleImpl {
    static String r = "HTTPSTunneling";
    private static final int s;
    private Selector m;
    private SocketChannel o;
    private List<Class<? extends MSHTTPSProxyRequestInterceptor>> q;
    private long n = 1000;
    private boolean p = false;

    /* loaded from: classes.dex */
    class a implements QueueObserver {
        a() {
        }

        @Override // com.uievolution.microserver.QueueObserver
        public void update(boolean z) {
            if (HttpsTunnelingModule.this.o == null || z) {
                return;
            }
            MicroServer.Logger.d(HttpsTunnelingModule.r, "Available data for sending");
            SelectionKey keyFor = HttpsTunnelingModule.this.o.keyFor(HttpsTunnelingModule.this.m);
            if (keyFor == null || !keyFor.isValid()) {
                return;
            }
            keyFor.interestOps(keyFor.interestOps() | 4);
            HttpsTunnelingModule.this.m.wakeup();
        }
    }

    /* loaded from: classes.dex */
    class b {
        static final /* synthetic */ boolean b = true;

        b() {
        }

        private void a(SelectionKey selectionKey) throws IOException, InterruptedException {
            if (((SocketChannel) selectionKey.channel()).finishConnect()) {
                MicroServer.Logger.d(HttpsTunnelingModule.r, "Connection succeeded");
                HttpsTunnelingModule.this.n = 10000L;
                if (HttpsTunnelingModule.this.getInQueue().isEmpty()) {
                    selectionKey.interestOps(1);
                    return;
                } else {
                    selectionKey.interestOps(5);
                    return;
                }
            }
            MicroServer.Logger.d(HttpsTunnelingModule.r, "Connection failed");
            throw new IOException("Connection failed");
        }

        private void b(SelectionKey selectionKey) throws IOException, InterruptedException {
            SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
            ByteBuffer allocate = ByteBuffer.allocate(8192);
            int read = socketChannel.read(allocate);
            MicroServer.Logger.d(HttpsTunnelingModule.r, "read size=" + read);
            if (read < 0) {
                socketChannel.close();
            } else {
                allocate.flip();
                HttpsTunnelingModule.this.getOutQueue().put(allocate);
            }
        }

        private void c(SelectionKey selectionKey) throws InterruptedException, IOException {
            SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
            if (!b && HttpsTunnelingModule.this.getInQueue().isEmpty()) {
                throw new AssertionError();
            }
            ByteBuffer peek = HttpsTunnelingModule.this.getInQueue().peek();
            MicroServer.Logger.d(HttpsTunnelingModule.r, "write buffer=" + peek);
            socketChannel.write(peek);
            if (!peek.hasRemaining()) {
                HttpsTunnelingModule.this.getInQueue().poll();
            }
            if (HttpsTunnelingModule.this.getInQueue().isEmpty()) {
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

    static {
        int i = MicroServer.getInstance().getProperties().getInt("httpsmodule.connecttimeout", 10);
        s = i > 0 ? i : 10;
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
        MicroServer.Logger.d(r, "HTTPS Proxy started. this=" + f() + ", " + getRequestInfo().getRequestUri());
        String[] split = getRequestInfo().getRequestUri().split(":");
        MSHTTPSProxyRequestInterceptor.HostPort hostPort = new MSHTTPSProxyRequestInterceptor.HostPort(split[0], MicroServer.DEFAULT_LWIP_PORT_HTTPS);
        try {
            hostPort.port = Integer.parseInt(split[1]);
            List<Class<? extends MSHTTPSProxyRequestInterceptor>> list = this.q;
            if (list != null) {
                Iterator<Class<? extends MSHTTPSProxyRequestInterceptor>> it = list.iterator();
                while (it.hasNext()) {
                    try {
                        hostPort = it.next().newInstance().doIntercept(hostPort);
                    } catch (IllegalAccessException e) {
                        MicroServer.Logger.w(r, e);
                    } catch (InstantiationException e2) {
                        MicroServer.Logger.w(r, e2);
                    }
                }
            }
            try {
                try {
                    try {
                        HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter("HTTP/1.0 200 Connection established");
                        MicroServer.Logger.d(r, "----- Microserver Start Response -----");
                        MicroServer.Logger.d(r, httpHeaderWriter.toString());
                        getOutQueue().put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
                        this.m = Selector.open();
                        SocketChannel open = SocketChannel.open();
                        this.o = open;
                        open.configureBlocking(false);
                        this.o.register(this.m, 8, new b());
                        this.o.connect(new InetSocketAddress(hostPort.host, hostPort.port));
                        getInQueue().setObserver(new a());
                        long nanoTime = System.nanoTime();
                        MicroServer.Logger.d(r, "TRY to connect. " + hostPort);
                        while (!this.m.keys().isEmpty()) {
                            MicroServer.Logger.d(r, "call select, timeout=" + this.n);
                            int select = this.m.select(this.n);
                            MicroServer.Logger.d(r, "select DONE readyChannel=" + select + ", stopFlag=" + this.p);
                            if (this.p) {
                                break;
                            }
                            if (select == 0) {
                                if (!this.o.isConnected() && System.nanoTime() - nanoTime > s * 1000 * 1000 * 1000) {
                                    MicroServer.Logger.d(r, "Connection timeout");
                                    throw new IOException("Connection timeout");
                                }
                            } else {
                                Iterator<SelectionKey> it2 = this.m.selectedKeys().iterator();
                                while (it2.hasNext()) {
                                    SelectionKey next = it2.next();
                                    it2.remove();
                                    ((b) next.attachment()).d(next);
                                }
                                if (!this.o.isConnected() || !this.o.isOpen()) {
                                    break;
                                }
                            }
                        }
                        Utils.closeQuietly(this.m);
                        Utils.closeQuietly(this.o);
                        closeUaConnectionOnEmpty();
                    } catch (Exception e3) {
                        MicroServer.Logger.w(r, e3);
                        closeUaConnectionNow();
                        MicroServer.Logger.d(r, "HTTPS proxy closed.");
                        return null;
                    }
                } catch (UnresolvedAddressException e5) {
                    MicroServer.Logger.d(r, "network is unavailable", e5);
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
        } catch (NumberFormatException unused) {
            MicroServer.Logger.d(r, "invalid port number: " + split[1]);
            return null;
        }
    }

    String f() {
        return Integer.toHexString(hashCode());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(List<Class<? extends MSHTTPSProxyRequestInterceptor>> list) {
        this.q = list;
    }
}
