package com.uievolution.microserver;

import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.lwipdriver.LWIPDriver;
import com.uievolution.microserver.lwipdriver.LWIPParam;
import com.uievolution.microserver.lwipdriver.LWIPUAConnection;
import com.uievolution.microserver.lwipdriver.Type;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactoryWrapper;
import com.uievolution.microserver.modules.HttpProxyModuleFactory;
import com.uievolution.microserver.modules.HttpsTunnelingModuleFactory;
import com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor;
import com.uievolution.microserver.modules.NotFoundModuleFactory;
import com.uievolution.microserver.modules.WsTunnelingModuleFactory;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.PRNGFixes;
import com.uievolution.microserver.utils.PropertiesConfiguration;
import com.uievolution.microserver.utils.Utils;
import com.uievolution.microserver.websocket.UpgradeRequestParser;
import com.uievolution.microserver.wifidriver.WiFiDriver;
import com.uievolution.systemlogger.CompoundLogger;
import com.uievolution.systemlogger.FileLogger;
import com.uievolution.systemlogger.LogcatLogger;
import com.uievolution.systemlogger.Logger;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Executors;

/* loaded from: classes.dex */
public final class MicroServer {
    public static final String ACTION_USB_ACCESSORY_ATTACHED = "com.uievolution.microserver.USB_ACCESSORY_ATTACHED";
    public static final String DEFAULT_LWIP_ADDR = "192.168.1.1";
    public static final String DEFAULT_LWIP_NETMASK = "255.255.255.0";
    public static final int DEFAULT_LWIP_PORT_HTTP = 80;
    public static final int DEFAULT_LWIP_PORT_HTTPS = 443;
    public static final String DEFAULT_LWIP_SERVICE_NAME = "MicroServer";
    public static final String DEFAULT_LWIP_UUID = "00001101-0000-1000-8000-00805F9B34FB";
    public static final int DEFAULT_LWIP_WIFI_PORT = 5570;
    public static final boolean DEFAULT_WIFI_LOOPBACKONLY = false;
    public static final int DEFAULT_WIFI_PORT_HTTP = 8008;
    public static final int DEFAULT_WIFI_PORT_HTTPS = 8443;
    public static Logger Logger = new LogcatLogger.Builder().build();
    public static final int MSERR_MICRO_SERVER = -5;
    public static final int MSERR_RPCSERVER_CLIENT = -1;
    public static final int MSERR_SPP_ACCEPT_THREAD = -4;
    public static final int MSERR_SPP_BT_DISABLED = -8;
    public static final int MSERR_SPP_READ_THREAD = -2;
    public static final int MSERR_SPP_START_CORE = -6;
    public static final int MSERR_SPP_STOP_CORE = -7;
    public static final int MSERR_SPP_WRITE_THREAD = -3;
    public static final String PROP_FQDN = "fqdn";
    public static final String PROP_WIFI_DNSSD_SERVICENAME = "wifi.dnssd.servicename";
    public static final String PROP_WIFI_HTTPS_PORT = "wifi.port_https";
    public static final String PROP_WIFI_HTTP_PORT = "wifi.port";
    public static final String PROP_WIFI_LOOPBACKONLY = "wifi.loopbackonly";
    public static final int WIFI_PORT_DISABLED = -1;
    public static final int WIFI_PORT_STARTING = -2;
    static String w = "MicroServer";
    private PropertiesConfiguration a;
    private final List<ErrorListener> b;
    private MSError c;
    private LWIPParam d;
    private final LWIPDriver e;
    private int f;
    private int g;
    private final WiFiDriver h;
    private Context i;
    private Handler j;
    private boolean k;
    private boolean l;
    private final Map<UAConnection, e> m;
    private boolean n;
    private HttpProxyModuleFactory o;
    private HttpsTunnelingModuleFactory p;
    private WsTunnelingModuleFactory q;
    private NotFoundModuleFactory r;
    private final Map<String, d> s;
    private final Map<String, d> t;
    private final Map<String, MSWebSocketFactory> u;
    private final List<MSHTTPProxyRequestInterceptor> v;

    /* loaded from: classes.dex */
    public enum LogType {
        Logcat,
        File,
        FileEnc
    }

    /* loaded from: classes.dex */
    class a implements ErrorListener {
        a() {
        }

        @Override // com.uievolution.microserver.ErrorListener
        public int error(int i, String str) {
            MicroServer.this.a(i, str);
            return 0;
        }
    }

    /* loaded from: classes.dex */
    class b extends MicroServerSPPConnectionListener {
        b() {
        }

        @Override // com.uievolution.microserver.MicroServerSPPConnectionListener
        public void onConnectionEvent(int i) {
            if (i == 2) {
                MicroServer.this.a();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class cd {
        private static final MicroServer a = new MicroServer(null);
    }

    /* synthetic */ MicroServer(a aVar) {
        this();
    }

    public static MicroServer getInstance() {
        return cd.a;
    }

    private void i() {
        int i = this.a.getInt("httpmodule.interceptor.request.num", 0);
        for (int i2 = 0; i2 < i; i2++) {
            String string = this.a.getString("httpmodule.interceptor.request." + i2);
            if (string != null) {
                try {
                    this.v.add((MSHTTPProxyRequestInterceptor) Class.forName(string).newInstance());
                    Logger.i(w, "Load HTTP request interceptor: " + string);
                } catch (Exception e) {
                    Logger.w(w, "Failed to load MSHTTPProxyRequestInterceptor, " + e.getMessage());
                }
            }
        }
    }

    private void j() {
        this.o = new HttpProxyModuleFactory(this.a);
        this.p = new HttpsTunnelingModuleFactory(this.a);
        this.q = new WsTunnelingModuleFactory();
        this.r = new NotFoundModuleFactory();
        int i = this.a.getInt("module.num", 0);
        for (int i2 = 0; i2 < i; i2++) {
            String string = this.a.getString("module.path." + i2);
            String string2 = this.a.getString("module.factory." + i2);
            int i3 = this.a.getInt("module.type." + i2, 3);
            if (string != null && string2 != null) {
                try {
                    Class<?> cls = Class.forName(string2);
                    MSModuleFactory mSModuleFactory = null;
                    if (MSModuleFactory.class.isAssignableFrom(cls)) {
                        mSModuleFactory = (MSModuleFactory) cls.newInstance();
                    } else if (MSHTTPModuleFactory.class.isAssignableFrom(cls)) {
                        mSModuleFactory = new MSHTTPModuleFactoryWrapper((MSHTTPModuleFactory) cls.newInstance());
                    }
                    if (mSModuleFactory != null) {
                        a(string, mSModuleFactory, i3);
                    }
                } catch (Exception e) {
                    Logger.w(w, e);
                }
            }
        }
    }

    private void k() {
        int i = this.a.getInt("websocket.num", 0);
        for (int i2 = 0; i2 < i; i2++) {
            String string = this.a.getString("websocket.path." + i2);
            String string2 = this.a.getString("websocket.factory." + i2);
            if (string != null && string2 != null) {
                try {
                    Class<?> cls = Class.forName(string2);
                    MSWebSocketFactory mSWebSocketFactory = MSWebSocketFactory.class.isAssignableFrom(cls) ? (MSWebSocketFactory) cls.newInstance() : null;
                    if (mSWebSocketFactory != null) {
                        a(string, mSWebSocketFactory);
                    }
                } catch (Exception e) {
                    Logger.w(w, e);
                }
            }
        }
    }

    private void m() throws IOException {
        if (this.a != null) {
            return;
        }
        this.a = new PropertiesConfiguration();
        InputStream inputStream = null;
        try {
            try {
                inputStream = this.i.getResources().getAssets().open("microserver.properties");
                this.a.load(inputStream);
            } catch (IOException e) {
                throw e;
            }
        } finally {
            Utils.closeQuietly(inputStream);
        }
    }

    private void n() {
        this.d = LWIPParam.load(this.a);
        this.f = this.a.getInt(PROP_WIFI_HTTP_PORT, DEFAULT_WIFI_PORT_HTTP);
        this.g = this.a.getInt(PROP_WIFI_HTTPS_PORT, DEFAULT_WIFI_PORT_HTTPS);
        EnumSet<LogType> noneOf = EnumSet.noneOf(LogType.class);
        for (String str : this.a.getString("log.type", LogType.Logcat.name()).split(",")) {
            try {
                noneOf.add(LogType.valueOf(str.trim()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (noneOf.isEmpty()) {
            Log.w(w, "Invalid type in log.type. So use Logcat.");
            noneOf.add(LogType.Logcat);
        }
        int i = 2;
        try {
            i = Integer.parseInt(this.a.getString("log.level", Integer.toString(2)));
        } catch (Exception e2) {
            e2.printStackTrace();
        }
        a(noneOf, i);
    }

    void a(EnumSet<LogType> enumSet, int i) {
        CompoundLogger.Builder builder = new CompoundLogger.Builder();
        if (enumSet.contains(LogType.Logcat)) {
            builder.add(new LogcatLogger.Builder().minPriority(i).build());
        }
        if (enumSet.contains(LogType.FileEnc) || enumSet.contains(LogType.File)) {
            builder.add(new FileLogger.Builder().prefix("ms").encrypt(enumSet.contains(LogType.FileEnc)).minPriority(i).build(this.i));
        }
        Logger = builder.build();
    }

    public void addErrorListener(ErrorListener errorListener) {
        synchronized (this.b) {
            this.b.add(errorListener);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void b(UAConnection uAConnection) {
        e remove;
        synchronized (this.m) {
            remove = this.m.remove(uAConnection);
        }
        if (remove != null) {
            remove.cancel(true);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void c() throws IOException {
        if (this.k && !this.l) {
            this.l = true;
            this.e.resume();
            this.h.resume();
        }
    }

    public void closeAllLWIPUAConnection(UAConnection uAConnection) {
        for (UAConnection uAConnection2 : this.m.keySet()) {
            if ((uAConnection2 instanceof LWIPUAConnection) && uAConnection2 != uAConnection) {
                uAConnection2.closeNow();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSModule d() {
        HttpsTunnelingModuleFactory httpsTunnelingModuleFactory = this.p;
        if (httpsTunnelingModuleFactory != null) {
            return httpsTunnelingModuleFactory.create();
        }
        return null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSError e() {
        return this.c;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public Type f() {
        return this.d.getType();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSModule g() {
        return this.r.create();
    }

    public Context getContext() {
        return this.i;
    }

    public Handler getHandler() {
        return this.j;
    }

    public int getHttpPort() {
        return this.d.getHttpPort();
    }

    public int getHttpsPort() {
        return this.d.getHttpsPort();
    }

    public PropertiesConfiguration getProperties() {
        return this.a;
    }

    public String getVersion() {
        return BuildConfig.VERSION_NAME;
    }

    public int getWiFiHttpPort() {
        return this.h.getHttpPort();
    }

    public int getWiFiHttpsPort() {
        return this.h.getHttpsPort();
    }

    @Deprecated
    public int getWiFiListeningPort() {
        return this.h.getHttpPort();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public List<MSHTTPProxyRequestInterceptor> h() {
        return Collections.unmodifiableList(this.v);
    }

    public void init(Context context) {
        Utils._assert(context != null);
        PRNGFixes.apply();
        if (Looper.myLooper() == null) {
            Looper.prepare();
        }
        this.j = new Handler();
        this.i = context;
        this.m.clear();
        this.b.clear();
        this.s.clear();
        this.t.clear();
        this.u.clear();
        try {
            m();
            n();
            Logger.i(w, "Microserver version: " + getVersion());
            Logger.i(w, "Device Info: RELEASE: " + Build.VERSION.RELEASE + " , SDK_INT: " + Build.VERSION.SDK_INT + " , MANUFACTURER: " + Build.MANUFACTURER + " , MODEL: " + Build.MODEL);
            j();
            k();
            i();
        } catch (IOException e) {
            Logger.w(w, "Failed to init()", e);
        }
        this.h.init();
        this.e.init();
    }

    public boolean isConnected() {
        return this.e.isConnected();
    }

    public boolean isRequestToMe(String str, int i) {
        return this.e.isMyEndPoint(str, i) || this.h.isMyEndPoint(str, i);
    }

    public boolean isRunning() {
        return this.k;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized boolean l() {
        if (!this.k) {
            return false;
        }
        return this.l;
    }

    void o() throws IOException {
        if (this.n) {
            this.h.start(this.f, this.g);
        } else {
            this.h.start(this.f, -1);
        }
    }

    void p() {
        this.h.stop();
    }

    public void registerSPPConnectionNotify(MicroServerSPPConnectionListener microServerSPPConnectionListener) {
        this.e.addConnectionListener(microServerSPPConnectionListener);
    }

    public void removeErrorListener(ErrorListener errorListener) {
        synchronized (this.b) {
            this.b.remove(errorListener);
        }
    }

    public void restartLWIPDriver() throws IOException {
        stopLWIPDriver();
        startLWIPDriver();
    }

    public synchronized void run() {
        if (this.k) {
            Logger.d(w, "already started");
            return;
        }
        Logger.i(w, "Start microserver. " + getVersion());
        this.k = true;
        this.l = true;
        try {
            startLWIPDriver();
            o();
        } catch (IOException e) {
            Logger.e(w, "Failed to start microserver", e);
            stop();
        }
    }

    public void setConfig(MSConfig mSConfig) {
        if (mSConfig == null) {
            Logger.d(w, "config is null");
            return;
        }
        boolean a2 = a(mSConfig.getPkcs12(), mSConfig.getPassword(), mSConfig.getmIntermediateCert());
        this.n = a2;
        if (!a2) {
            Logger.w(w, "HTTPS server is disabled, due to improper configuration");
        }
        Map<String, DigestAuth> digestAuthMap = mSConfig.getDigestAuthMap();
        for (String str : digestAuthMap.keySet()) {
            DigestAuth digestAuth = digestAuthMap.get(str);
            boolean z = false;
            String lowerCase = str.toLowerCase(Locale.ENGLISH);
            boolean z2 = true;
            if (this.s.containsKey(lowerCase)) {
                this.s.get(lowerCase).a(digestAuth);
                z = true;
            }
            if (this.t.containsKey(lowerCase)) {
                this.t.get(lowerCase).a(digestAuth);
            } else {
                z2 = z;
            }
            if (!z2) {
                Logger.w(w, lowerCase + " is specified to Digest Authentification. But a module for the " + lowerCase + " is not found.");
            }
        }
        if (mSConfig.isEnablePacketCapture()) {
            this.d.enablePcap();
        } else {
            this.d.disablePcap();
        }
    }

    public void startLWIPDriver() throws IOException {
        LWIPParam lWIPParam = null;
        Logger.d(w, "startLWIPDriver");
        LWIPParam lWIPParam2 = this.d;
        try {
            lWIPParam = (LWIPParam) lWIPParam2.clone();
        } catch (CloneNotSupportedException unused) {
        }
        try {
            if (!this.n) {
                assert lWIPParam != null;
                lWIPParam.setHttpsPort(-1);
            }
            this.e.start(lWIPParam);
        } catch (IOException e) {
            a(-6, e.getMessage());
            stopLWIPDriver();
            throw e;
        }
    }

    public synchronized void stop() {
        if (!this.k) {
            Logger.d(w, "already stopped");
            return;
        }
        Logger.i(w, "Stop microserver. ");
        this.k = false;
        stopLWIPDriver();
        p();
    }

    public void stopLWIPDriver() {
        this.e.stop();
    }

    public void unregisterSPPConnectionNotify(MicroServerSPPConnectionListener microServerSPPConnectionListener) {
        this.e.removeConnectionListener(microServerSPPConnectionListener);
    }

    private MicroServer() {
        this.b = new ArrayList();
        this.c = new MSError();
        this.k = false;
        this.l = false;
        this.m = new HashMap();
        this.n = false;
        this.s = new LinkedHashMap();
        this.t = new LinkedHashMap();
        this.u = new LinkedHashMap();
        this.v = new ArrayList();
        LWIPDriver lWIPDriver = LWIPDriver.getInstance();
        this.e = lWIPDriver;
        lWIPDriver.addConnectionListener(new b());
        lWIPDriver.setErrorListener(new a());
        this.h = WiFiDriver.getInstance();
        AbstractWorker.setExecutor(Executors.newCachedThreadPool());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean b(HttpRequestInfo httpRequestInfo) {
        if (httpRequestInfo.getRequestUri().startsWith("http://")) {
            Uri parse = Uri.parse(httpRequestInfo.getRequestUri());
            return isRequestToMe(parse.getHost(), parse.getPort() >= 0 ? parse.getPort() : 80);
        }
        Header header = httpRequestInfo.getHeader(HttpCatalogs.HEADER_HOST);
        if (header == null) {
            return httpRequestInfo.getRequestUri().startsWith("/");
        }
        String value = header.getValue();
        int indexOf = value.indexOf(58);
        int r1 = 0;
        if (indexOf > 0) {
            r1 = Integer.parseInt(value.substring(indexOf + 1));
            value = value.substring(0, indexOf);
        }
        return isRequestToMe(value, r1);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void b() {
        if (this.k && this.l) {
            this.l = false;
            this.e.pause();
            this.h.pause();
        }
    }

    private void a(String str, MSModuleFactory mSModuleFactory, int i) {
        Logger.i(w, "load module, " + str + ", " + mSModuleFactory.toString() + ", type=" + i);
        if (!str.startsWith("/") && str.length() > 0) {
            str = "/" + str;
        }
        String lowerCase = str.toLowerCase(Locale.ENGLISH);
        if ((i & 1) != 0) {
            if (this.s.containsKey(lowerCase)) {
                String b2 = this.s.get(lowerCase).b();
                Logger.w(w, lowerCase + " has been already registered by " + b2);
                Logger.w(w, "Skip to register " + b2);
            } else {
                this.s.put(lowerCase, new d(mSModuleFactory));
            }
        }
        if ((i & 2) != 0) {
            if (this.t.containsKey(lowerCase)) {
                String b3 = this.t.get(lowerCase).b();
                Logger.w(w, lowerCase + " has been already registered by " + b3);
                Logger.w(w, "Skip to register " + b3);
                return;
            }
            this.t.put(lowerCase, new d(mSModuleFactory));
        }
    }

    private void a(String str, MSWebSocketFactory mSWebSocketFactory) {
        Logger.i(w, "load websocket module factory, " + str + ", " + mSWebSocketFactory.getClass().getName());
        if (!str.startsWith("/") && str.length() > 0) {
            str = "/" + str;
        }
        String lowerCase = str.toLowerCase(Locale.ENGLISH);
        if (this.u.containsKey(lowerCase)) {
            MSWebSocketFactory mSWebSocketFactory2 = this.u.get(lowerCase);
            Logger.w(w, lowerCase + " has been already registered by " + mSWebSocketFactory2.getClass().getName());
            Logger.w(w, "Skip to register " + mSWebSocketFactory.getClass().getName());
            return;
        }
        this.u.put(lowerCase, mSWebSocketFactory);
    }

    void a(int i, String str) {
        synchronized (this.b) {
            Iterator<ErrorListener> it = this.b.iterator();
            while (it.hasNext()) {
                it.next().error(i, str);
            }
            this.c = new MSError(i, str);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(UAConnection uAConnection) {
        Logger.d(w, "onAccept");
        e eVar = new e(uAConnection);
        synchronized (this.m) {
            this.m.put(uAConnection, eVar);
        }
        eVar.start();
    }

    void a() {
        for (UAConnection uAConnection : this.m.keySet()) {
            if (uAConnection instanceof LWIPUAConnection) {
                uAConnection.closeNow();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSModule a(HttpRequestInfo httpRequestInfo) {
        if (httpRequestInfo.getMethod().equals(HttpCatalogs.METHOD_CONNECT)) {
            HttpsTunnelingModuleFactory httpsTunnelingModuleFactory = this.p;
            if (httpsTunnelingModuleFactory != null) {
                return httpsTunnelingModuleFactory.create();
            }
            return null;
        }
        if (UpgradeRequestParser.parse(httpRequestInfo) != null) {
            return this.q.create();
        }
        return this.o.create();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSModule a(String str, boolean z) {
        int indexOf;
        if (str == null) {
            return null;
        }
        String lowerCase = str.toLowerCase(Locale.ENGLISH);
        if (2 <= lowerCase.length() && (indexOf = lowerCase.indexOf(47, 1)) > 0) {
            lowerCase = lowerCase.substring(0, indexOf);
        }
        d dVar = (z ? this.t : this.s).get(lowerCase);
        if (dVar == null) {
            return null;
        }
        return dVar.a();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSWebSocket a(String str, String str2) {
        int indexOf;
        if (str == null) {
            return null;
        }
        String lowerCase = str.toLowerCase(Locale.ENGLISH);
        if (2 <= lowerCase.length() && (indexOf = lowerCase.indexOf(47, 1)) > 0) {
            lowerCase = lowerCase.substring(0, indexOf);
        }
        for (String str3 : this.u.keySet()) {
            if (lowerCase.equals(str3)) {
                return this.u.get(str3).create(str2);
            }
        }
        return null;
    }

    private boolean a(byte[] bArr, String str, byte[] bArr2) {
        if (bArr == null) {
            Logger.d(w, "No pkcs12 data");
            return false;
        }
        if (str == null) {
            str = "";
        }
        if (str.length() < 50) {
            return SSLEngineProxy.a(bArr, str, bArr2);
        }
        throw new IllegalArgumentException("password for PKCS12 must be less than 50 chars.");
    }
}
