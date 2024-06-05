package com.uievolution.microserver.wifidriver;

import android.os.Build;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.UAConnection;
import com.uievolution.microserver.utils.Utils;
import com.uievolution.microserver.wifidriver.INsdManager;
import java.io.Closeable;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.nio.ByteBuffer;
import java.nio.channels.ClosedSelectorException;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.security.SecureRandom;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/* loaded from: classes.dex */
public class WiFiDriver {
    static final WiFiDriver i = new WiFiDriver();
    private c c;
    private int a = -2;
    private int b = -2;
    private final Set<String> d = new HashSet();
    private boolean e = false;
    private INsdManager f = null;
    private final INsdManager.IRegistrationListener g = new a(this);
    private final INsdManager.IRegistrationListener h = new b(this);

    /* loaded from: classes.dex */
    class a implements INsdManager.IRegistrationListener {
        a(WiFiDriver wiFiDriver) {
        }

        @Override // com.uievolution.microserver.wifidriver.INsdManager.IRegistrationListener
        public void onServiceRegistered() {
        }

        @Override // com.uievolution.microserver.wifidriver.INsdManager.IRegistrationListener
        public void onServiceUnregistered() {
        }
    }

    /* loaded from: classes.dex */
    class b implements INsdManager.IRegistrationListener {
        b(WiFiDriver wiFiDriver) {
        }

        @Override // com.uievolution.microserver.wifidriver.INsdManager.IRegistrationListener
        public void onServiceRegistered() {
        }

        @Override // com.uievolution.microserver.wifidriver.INsdManager.IRegistrationListener
        public void onServiceUnregistered() {
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class c extends Thread {
        private Selector a;
        private int b;
        private int c;

        /* JADX INFO: Access modifiers changed from: package-private */
        /* loaded from: classes.dex */
        public class a {
            private UAConnection a;
            private int b;

            a(c cVar, UAConnection uAConnection) {
                this.a = uAConnection;
            }

            UAConnection a() {
                return this.a;
            }

            int b() {
                return this.b;
            }

            void a(int i) {
                this.b = i;
            }
        }

        c(int i, int i2) throws IOException {
            super("WiFiServerThread");
            this.b = i;
            this.c = i2;
            this.a = Selector.open();
        }

        private int b() {
            return new SecureRandom().nextInt(16384) + 49152;
        }

        private void c(SelectionKey selectionKey) {
            a aVar = (a) selectionKey.attachment();
            UAConnection a2 = aVar.a();
            try {
                ByteBuffer allocate = ByteBuffer.allocate(32768);
                synchronized (a2) {
                    int onSent = a2.onSent(aVar.b(), allocate.array());
                    if (onSent == -1) {
                        selectionKey.channel().close();
                        return;
                    }
                    aVar.a(onSent);
                    if (onSent == 0) {
                        selectionKey.interestOps(selectionKey.interestOps() & (-5));
                        return;
                    }
                    allocate.limit(onSent);
                    SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
                    while (allocate.hasRemaining()) {
                        socketChannel.write(allocate);
                    }
                }
            } catch (IOException unused) {
                a2.onRecv((ByteBuffer) null);
                Utils.closeQuietly(selectionKey.channel());
            }
        }

        void a() {
            Utils.closeQuietly(this.a);
        }

        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            ServerSocketChannel serverSocketChannel;
            ServerSocketChannel serverSocketChannel2 = null;
            try {
                try {
                    int i = this.b;
                    if (i >= 0) {
                        serverSocketChannel = a(i);
                        if (serverSocketChannel != null) {
                            try {
                                WiFiDriver.this.a = serverSocketChannel.socket().getLocalPort();
                                MicroServer.Logger.i("WiFiServerThread", "HTTP: bound to " + WiFiDriver.this.a);
                            } catch (ClosedSelectorException unused) {
                                MicroServer.Logger.d("WiFiServerThread", "dis-connected with ClosedSelectorException");
                                Utils.closeQuietly(this.a);
                                Utils.closeQuietly(serverSocketChannel);
                                Utils.closeQuietly((Closeable) null);
                                WiFiDriver.this.d();
                                return;
                            } catch (Exception e) {
                                e = e;
                                MicroServer.Logger.d("WiFiServerThread", "dis-connected", e);
                                Utils.closeQuietly(this.a);
                                Utils.closeQuietly(serverSocketChannel);
                                Utils.closeQuietly((Closeable) null);
                                WiFiDriver.this.d();
                                return;
                            }
                        }
                    } else {
                        serverSocketChannel = null;
                    }
                    int i2 = this.c;
                    if (i2 >= 0 && (serverSocketChannel2 = a(i2)) != null) {
                        WiFiDriver.this.b = serverSocketChannel2.socket().getLocalPort();
                        MicroServer.Logger.i("WiFiServerThread", "HTTPS: bound to " + WiFiDriver.this.b);
                    }
                    if (serverSocketChannel != null || serverSocketChannel2 != null) {
                        WiFiDriver.this.b();
                        while (this.a.select() >= 0) {
                            Iterator<SelectionKey> it = this.a.selectedKeys().iterator();
                            while (it.hasNext()) {
                                SelectionKey next = it.next();
                                it.remove();
                                if (next.isValid() && next.isAcceptable()) {
                                    a(next);
                                }
                                if (next.isValid() && next.isReadable()) {
                                    b(next);
                                }
                                if (next.isValid() && next.isWritable()) {
                                    c(next);
                                }
                            }
                        }
                        Utils.closeQuietly(this.a);
                        Utils.closeQuietly(serverSocketChannel);
                        Utils.closeQuietly(serverSocketChannel2);
                        WiFiDriver.this.d();
                        return;
                    }
                    MicroServer.Logger.w("WiFiServerThread", "Failed to bound port");
                    Utils.closeQuietly(this.a);
                    Utils.closeQuietly(serverSocketChannel);
                    Utils.closeQuietly(serverSocketChannel2);
                    WiFiDriver.this.d();
                } catch (ClosedSelectorException unused2) {
                    serverSocketChannel = null;
                } catch (Exception e2) {
                   // e = e2;
                    serverSocketChannel = null;
                } catch (Throwable th) {
                    //th = th;
                    Utils.closeQuietly(this.a);
                    Utils.closeQuietly((Closeable) null);
                    Utils.closeQuietly((Closeable) null);
                    WiFiDriver.this.d();
                    throw th;
                }
            } catch (Exception th2) {
                //th = th2;
                Utils.closeQuietly(this.a);
                Utils.closeQuietly((Closeable) null);
                Utils.closeQuietly((Closeable) null);
                WiFiDriver.this.d();
                try {
                    throw th2;
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        }

        private ServerSocketChannel a(int i) throws IOException {
            ServerSocketChannel open;
            InetSocketAddress inetSocketAddress;
            int i2 = 0;
            while (true) {
                if (i == 0) {
                    i2 = b();
                } else {
                    i2 = i2 == 0 ? i : i2 + 1;
                }
                try {
                    open = ServerSocketChannel.open();
                    open.configureBlocking(false);
                    break;
                } catch (IOException e) {
                    MicroServer.Logger.d("WiFiServerThread", i2 + " is already used", e);
                    Utils.closeQuietly((Closeable) null);
                }
            }
            if (WiFiDriver.this.a()) {
                inetSocketAddress = new InetSocketAddress("127.0.0.1", i2);
            } else {
                inetSocketAddress = new InetSocketAddress(i2);
            }
            open.socket().bind(inetSocketAddress);
            open.socket().setReuseAddress(true);
            if (!this.a.isOpen()) {
                MicroServer.Logger.d("WiFiServerThread", "WiFiDriver is already closed");
                return null;
            }
            open.register(this.a, 16);
            return open;
        }

        private void b(SelectionKey selectionKey) {
            SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
            UAConnection a2 = ((a) selectionKey.attachment()).a();
            try {
                ByteBuffer allocate = ByteBuffer.allocate(16384);
                int read = socketChannel.read(allocate);
                allocate.flip();
                MicroServer.Logger.d("WiFiServerThread", "readLen=" + read + ", pos=" + allocate.position() + ", limit=" + allocate.limit());
                if (read < 0) {
                    socketChannel.close();
                    a2.onRecv((ByteBuffer) null);
                } else {
                    a2.onRecv(allocate);
                }
            } catch (IOException unused) {
                Utils.closeQuietly(socketChannel);
                a2.onRecv((ByteBuffer) null);
            }
        }

        private void a(SelectionKey selectionKey) throws IOException {
            SocketChannel accept = ((ServerSocketChannel) selectionKey.channel()).accept();
            UAConnection a2 = WiFiUAConnection.a(new com.uievolution.microserver.wifidriver.b(accept, this.a), accept.socket().getLocalPort() == WiFiDriver.this.b);
            accept.configureBlocking(false);
            accept.register(this.a, 1, new a(this, a2));
        }
    }

    private WiFiDriver() {
    }

    public static WiFiDriver getInstance() {
        return i;
    }

    public int getHttpPort() {
        return this.a;
    }

    public int getHttpsPort() {
        return this.b;
    }

    public void init() {
        this.d.add("localhost");
        this.d.add("127.0.0.1");
        String string = MicroServer.getInstance().getProperties().getString(MicroServer.PROP_FQDN);
        if (string != null) {
            this.d.add(string);
        }
        this.f = null;
    }

    public boolean isAvailable() {
        c cVar = this.c;
        if (cVar == null) {
            return false;
        }
        return cVar.isAlive();
    }

    public boolean isMyEndPoint(String str, int i2) {
        if (this.d.contains(str) && (i2 == getHttpPort() || i2 == getHttpsPort())) {
            return true;
        }
        if (c() && this.d.contains(str)) {
            return i2 == getHttpPort() || i2 == getHttpsPort();
        }
        return false;
    }

    public synchronized void pause() {
        stop();
    }

    public synchronized void resume() throws IOException {
        start(this.a, this.b);
    }

    public synchronized boolean start(int i2, int i3) throws IOException {
        c cVar = this.c;
        if (cVar != null && cVar.isAlive()) {
            MicroServer.Logger.d("WiFiDriver", "Not start, due to already started");
            return true;
        }
        if (i2 < 0) {
            this.a = -1;
        }
        if (i3 < 0) {
            this.b = -1;
        }
        if (i2 < 0 && i3 < 0) {
            MicroServer.Logger.d("WiFiDriver", "Not start, due to disabled");
            return false;
        }
        c cVar2 = new c(i2, i3);
        this.c = cVar2;
        cVar2.start();
        return true;
    }

    public synchronized void stop() {
        c cVar = this.c;
        if (cVar != null) {
            cVar.a();
            try {
                this.c.join();
            } catch (InterruptedException unused) {
            }
        }
        this.c = null;
    }

    private synchronized boolean c() {
        if (this.e) {
            return false;
        }
        if (!a()) {
            Enumeration<NetworkInterface> enumeration = null;
            try {
                enumeration = NetworkInterface.getNetworkInterfaces();
            } catch (SocketException e) {
                MicroServer.Logger.w("WiFiDriver", e);
            }
            while (enumeration != null && enumeration.hasMoreElements()) {
                Enumeration<InetAddress> inetAddresses = enumeration.nextElement().getInetAddresses();
                while (inetAddresses.hasMoreElements()) {
                    InetAddress nextElement = inetAddresses.nextElement();
                    this.d.add(nextElement.getHostAddress());
                    this.d.add(nextElement.getHostName());
                }
            }
        }
        this.e = true;
        return true;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void d() {
        INsdManager iNsdManager = this.f;
        if (iNsdManager != null) {
            if (this.a > 0) {
                iNsdManager.a(this.g);
            }
            if (this.b > 0) {
                this.f.a(this.h);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void b() {
        String string = MicroServer.getInstance().getProperties().getString(MicroServer.PROP_WIFI_DNSSD_SERVICENAME);
        if (string != null && string.length() > 0) {
            if (Build.VERSION.SDK_INT >= 16) {
                this.f = new com.uievolution.microserver.wifidriver.a();
            } else {
                MicroServer.Logger.d("WiFiDriver", "mDNS cannot be used in this Android < 16");
            }
        }
        INsdManager iNsdManager = this.f;
        if (iNsdManager != null) {
            int i2 = this.a;
            if (i2 > 0) {
                iNsdManager.a(string, "_http._tcp.", i2, this.g);
            }
            int i3 = this.b;
            if (i3 > 0) {
                this.f.a(string, "_https._tcp.", i3, this.h);
            }
        }
    }

    boolean a() {
        return MicroServer.getInstance().getProperties().getBoolean(MicroServer.PROP_WIFI_LOOPBACKONLY, false);
    }
}
