package com.subaru.global.infotainment.gen2.interceptor;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;
import android.util.Log;
import com.android.volley.AuthFailureError;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.subaru.global.infotainment.gen2.SmtConst;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/* loaded from: classes.dex */
public class TlsConvertInterceptor implements MSHTTPProxyRequestInterceptor {
    static final String TAG = "TlsConvertInterceptor";
    static final String TLS_HOSTS_LIST = "tlsHostsList";
    static final String TLS_LAUNCHER_URL = "launcher_url_vehicle";
    static final String TLS_TIMESTAMP = "tlsTimestamp";
    static final SmtConst mSmt = SmtConst.getInstance();

    /* loaded from: classes.dex */
    public static class Setter {
        static Setter __instance;
        SharedPreferences prefs;
        RequestQueue queue;
        private Set<String> sHostSet;

        public static Setter initInstance(Context context) {
            if (__instance == null) {
                __instance = new Setter(context);
            }
            return __instance;
        }

        public static Setter sharedInstance() {
            return __instance;
        }

        Setter(Context context) {
            this.sHostSet = new HashSet();
            this.queue = Volley.newRequestQueue(context);
            SharedPreferences sharedPreferences = context.getSharedPreferences("appShare", 0);
            this.prefs = sharedPreferences;
            Set<String> stringSet = sharedPreferences.getStringSet(TlsConvertInterceptor.TLS_HOSTS_LIST, new HashSet());
            if (stringSet.size() > 0) {
                this.sHostSet = stringSet;
            }
        }

        public void update(Set<String> set) {
            synchronized (this.sHostSet) {
                this.sHostSet = set;
                this.prefs.edit().putStringSet(TlsConvertInterceptor.TLS_HOSTS_LIST, set).apply();
            }
        }

        public boolean contains(String str) {
            if (this.sHostSet.size() == 0) {
                return false;
            }
            synchronized (this.sHostSet) {
                return this.sHostSet.contains(str);
            }
        }

        public long getCurTime() {
            return new Date(System.currentTimeMillis()).getTime();
        }

        public boolean is24HourOver() {
            long curTime = getCurTime();
            SharedPreferences sharedPreferences = this.prefs;
            return curTime - (sharedPreferences != null ? sharedPreferences.getLong(TlsConvertInterceptor.TLS_TIMESTAMP, 0L) : 0L) > 86400000;
        }

        public void updateFromServer() {
            if (is24HourOver()) {
                this.queue.add(new StringRequest(0, TlsConvertInterceptor.mSmt.getHostsListUrl(), new Response.Listener<String>() { // from class: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.1
                    @Override // com.android.volley.Response.Listener
                    public void onResponse(String str) {
                        try {
                            Log.d(TlsConvertInterceptor.TAG, "updateFromServer() response success content:" + str);
                            Setter setter = Setter.this;
                            setter.update(setter.processResponseText(str));
                            Setter.this.prefs.edit().putLong(TlsConvertInterceptor.TLS_TIMESTAMP, Setter.this.getCurTime()).apply();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() { // from class: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.2
                    @Override // com.android.volley.Response.ErrorListener
                    public void onErrorResponse(VolleyError volleyError) {
                        Log.d(TlsConvertInterceptor.TAG, "updateFromServer() response failed due to " + volleyError.getMessage());
                        Set<String> stringSet = Setter.this.prefs.getStringSet(TlsConvertInterceptor.TLS_HOSTS_LIST, new HashSet());
                        if (stringSet.size() == 0) {
                            Log.d(TlsConvertInterceptor.TAG, "use default_hosts in serverInfo.json:" + TlsConvertInterceptor.mSmt.getDefaultHostsList());
                            Setter setter = Setter.this;
                            setter.update(setter.processResponseText(TlsConvertInterceptor.mSmt.getDefaultHostsList()));
                            return;
                        }
                        Log.d(TlsConvertInterceptor.TAG, "updateFromServer() response failed use last saved list:" + stringSet.toString());
                        Setter.this.sHostSet = stringSet;
                    }
                }) { // from class: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.3
                    @Override // com.android.volley.Request
                    public Map<String, String> getHeaders() throws AuthFailureError {
                        String str = "AVR=1;PVR=0;CONSUMERKEY=" + TlsConvertInterceptor.mSmt.getConsumerKey() + ";CONSUMERSECRET=" + TlsConvertInterceptor.mSmt.getConsumerSecret() + ";";
                        HashMap hashMap = new HashMap();
                        hashMap.put("Cookie", str);
                        return hashMap;
                    }
                });
            }
        }

        protected Set<String> processResponseText(String str) {
            HashSet hashSet = new HashSet();
            try {
                JsonArray jsonArray = (JsonArray) new Gson().fromJson(str, JsonArray.class);
                for (int i = 0; i < jsonArray.size(); i++) {
                    if (jsonArray.get(i).isJsonObject()) {
                        hashSet.add(jsonArray.get(i).getAsJsonObject().get("URL").getAsString());
                    }
                }
            } catch (Error e) {
                Log.w(TlsConvertInterceptor.TAG, e.getMessage());
            }
            return hashSet;
        }

        public void saveLauncherUrl(final Context context, final int i) {
            new AsyncTask<Void, Void, Boolean>() { // from class: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.4
                /* JADX INFO: Access modifiers changed from: protected */
                /* JADX WARN: Removed duplicated region for block: B:19:0x0081 A[EXC_TOP_SPLITTER, SYNTHETIC] */
                @Override // android.os.AsyncTask
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                    To view partially-correct code enable 'Show inconsistent code' option in preferences
                */
                public java.lang.Boolean doInBackground(java.lang.Void... r8) {
                    /*
                        r7 = this;
                        java.lang.String r8 = "?ssl=true"
                        java.lang.String r0 = "https://"
                        java.lang.String r1 = "launcher_url_vehicle/"
                        java.lang.String r2 = "TlsConvertInterceptor"
                        r3 = 0
                        java.lang.Boolean r3 = java.lang.Boolean.valueOf(r3)
                        r4 = 1
                        android.content.Context r5 = r2     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        com.uievolution.microserver.modules.KeyValueStore r5 = com.uievolution.microserver.modules.KeyValueStore.getInstance(r5)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        byte[] r5 = r5.getData(r1)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        if (r5 == 0) goto L4d
                        int r6 = r5.length     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        if (r6 != 0) goto L1e
                        goto L4d
                    L1e:
                        java.lang.String r6 = new java.lang.String     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        r6.<init>(r5)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        int r5 = r6.indexOf(r0)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        if (r5 < 0) goto L33
                        java.lang.String r3 = "http://"
                        java.lang.String r6 = r6.replaceFirst(r0, r3)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        java.lang.Boolean r3 = java.lang.Boolean.valueOf(r4)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                    L33:
                        int r0 = r6.indexOf(r8)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        if (r0 >= 0) goto L67
                        java.lang.StringBuilder r0 = new java.lang.StringBuilder     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        r0.<init>()     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        r0.append(r6)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        r0.append(r8)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        java.lang.String r6 = r0.toString()     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        java.lang.Boolean r3 = java.lang.Boolean.valueOf(r4)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        goto L67
                    L4d:
                        java.lang.String r8 = "use default Launcher URL"
                        android.util.Log.d(r2, r8)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        com.subaru.global.infotainment.gen2.SmtConst r8 = com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.mSmt     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        java.lang.String r6 = r8.getDefaultLauncherUrl()     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        java.lang.Boolean r3 = java.lang.Boolean.valueOf(r4)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L5d
                        goto L67
                    L5d:
                        com.subaru.global.infotainment.gen2.SmtConst r8 = com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.mSmt
                        java.lang.String r6 = r8.getDefaultLauncherUrl()
                        java.lang.Boolean r3 = java.lang.Boolean.valueOf(r4)
                    L67:
                        java.lang.StringBuilder r8 = new java.lang.StringBuilder
                        r8.<init>()
                        java.lang.String r0 = "launcher_url_vehicle: "
                        r8.append(r0)
                        r8.append(r6)
                        java.lang.String r8 = r8.toString()
                        android.util.Log.d(r2, r8)
                        boolean r8 = r3.booleanValue()
                        if (r8 == 0) goto Lc2
                        android.content.Context r8 = r2     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L94
                        com.uievolution.microserver.modules.KeyValueStore r8 = com.uievolution.microserver.modules.KeyValueStore.getInstance(r8)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L94
                        byte[] r0 = r6.getBytes()     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L94
                        r8.saveData(r0, r1)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L94
                        java.lang.String r8 = "save KVS launcher_url_vehicle success"
                        android.util.Log.d(r2, r8)     // Catch: com.uievolution.microserver.modules.KeyValueStore.KVSException -> L94
                        goto Lc2
                    L94:
                        r8 = move-exception
                        r8.printStackTrace()
                        int r8 = r3
                        if (r8 <= 0) goto Lbd
                        java.lang.StringBuilder r8 = new java.lang.StringBuilder
                        r8.<init>()
                        java.lang.String r0 = "save KVS launcher_url_vehicle retry remain:"
                        r8.append(r0)
                        int r0 = r3
                        r8.append(r0)
                        java.lang.String r8 = r8.toString()
                        android.util.Log.w(r2, r8)
                        com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor$Setter r8 = com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.this
                        android.content.Context r0 = r2
                        int r1 = r3
                        int r1 = r1 - r4
                        r8.saveLauncherUrl(r0, r1)
                        goto Lc2
                    Lbd:
                        java.lang.String r8 = "save KVS launcher_url_vehicle failed"
                        android.util.Log.e(r2, r8)
                    Lc2:
                        java.lang.Boolean r8 = java.lang.Boolean.valueOf(r4)
                        return r8
                    */
                    throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Setter.AnonymousClass4.doInBackground(java.lang.Void[]):java.lang.Boolean");
                }
            }.execute(new Void[0]);
        }
    }

    /* loaded from: classes.dex */
    public static class Service extends android.app.Service {
        public static final int MSG_UPDATE = 1001;
        private Messenger mMessenger = new Messenger(new ServiceHandler());

        /* loaded from: classes.dex */
        private static class ServiceHandler extends Handler {
            private ServiceHandler() {
            }

            @Override // android.os.Handler
            public void handleMessage(Message message) {
                Message obtain = Message.obtain(message);
                if (message.what == 1001) {
                    Setter.sharedInstance().updateFromServer();
                    try {
                        message.replyTo.send(obtain);
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
                super.handleMessage(message);
            }
        }

        @Override // android.app.Service
        public IBinder onBind(Intent intent) {
            return this.mMessenger.getBinder();
        }
    }

    /* loaded from: classes.dex */
    public static class Client {
        private boolean isConn;
        private Messenger mService;
        private boolean hasAskedToRefresh = false;
        private Messenger mMessenger = new Messenger(new ClientHandler());
        private ServiceConnection mConn = new ServiceConnection() { // from class: com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor.Client.1
            @Override // android.content.ServiceConnection
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                Log.d(TlsConvertInterceptor.TAG, "remote service connected");
                Client.this.mService = new Messenger(iBinder);
                Client.this.isConn = true;
                if (Client.this.hasAskedToRefresh) {
                    Client.this.hasAskedToRefresh = false;
                    Client.this.sendUpdateMessage();
                }
            }

            @Override // android.content.ServiceConnection
            public void onServiceDisconnected(ComponentName componentName) {
                Log.d(TlsConvertInterceptor.TAG, "remote service disconnected");
                Client.this.mService = null;
                Client.this.isConn = false;
            }
        };

        /* loaded from: classes.dex */
        static class ClientHandler extends Handler {
            ClientHandler() {
            }

            @Override // android.os.Handler
            public void handleMessage(Message message) {
                if (message.what == 1001) {
                    Log.d(TlsConvertInterceptor.TAG, "msg_update result OK");
                }
                super.handleMessage(message);
            }
        }

        public void requestUpdate(Context context) {
            if (this.mService != null && this.isConn) {
                sendUpdateMessage();
                return;
            }
            context.bindService(new Intent(context, (Class<?>) Service.class), this.mConn, 1);
            Log.e(TlsConvertInterceptor.TAG, "bindService invoked !");
            this.hasAskedToRefresh = true;
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void sendUpdateMessage() {
            Message obtain = Message.obtain((Handler) null, 1001);
            obtain.replyTo = this.mMessenger;
            try {
                this.mService.send(obtain);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    public TlsConvertInterceptor() {
        Log.d(TAG, "new TlsConvertInterceptor");
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor
    public HttpRequestBase doIntercept(HttpRequestBase httpRequestBase) {
        URI uri = httpRequestBase.getURI();
        if (!"http".equals(uri.getScheme())) {
            return httpRequestBase;
        }
        Setter sharedInstance = Setter.sharedInstance();
        if (sharedInstance == null) {
            Log.e(TAG, "Setter was used before init.Pass through for url:" + uri);
            return httpRequestBase;
        }
        if (sharedInstance.contains(uri.getHost()) || (uri.getQuery() != null && uri.getQuery().toLowerCase().contains("ssl=true"))) {
            Log.d(TAG, "Convert original url:" + uri);
            URI create = URI.create(uri.toString().replaceFirst("http", Const.HTTPS));
            Log.d(TAG, "converted. new url:" + create);
            httpRequestBase.setURI(create);
        }
        return httpRequestBase;
    }
}
