package com.clarion.android.smartaccess4car.extend.util;

import android.content.Context;
import android.net.Uri;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.util.LocaleUtil;
//import com.clarion.smartaccess.inappbilling.BillingObserverThread;
import com.uievolution.microserver.MicroServer;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.spi.Configurator;
import org.json.JSONArray;

/* loaded from: classes.dex */
public class AppInfoUtil {
    static final Object mLockObject = new Object();

    /* loaded from: classes.dex */
    public interface ConnectionMicroServerListener {
        static void onFinish(String str) {

        }
    }

    /* loaded from: classes.dex */
    public interface PostDataCreateHandler {
        HttpEntity createEntity(ArrayList<NameValuePair> arrayList);
    }

    /* loaded from: classes.dex */
    public static class PidInfoContainer {
        private Date mDate;
        private String mPid;

        public PidInfoContainer(String str, Date date) {
            this.mPid = null;
            this.mDate = null;
            this.mPid = str;
            this.mDate = date;
        }

        public String Pid() {
            return this.mPid;
        }

        public Date Date() {
            return this.mDate;
        }
    }

    public static String getSimCountry(Context context) {
        String simCountryIso = ((TelephonyManager) context.getSystemService("phone")).getSimCountryIso();
        return TextUtils.isEmpty(simCountryIso) ? "" : new Locale("", simCountryIso).getCountry();
    }

    public static String getCurrentLanguage() {
        return LocaleUtil.getDefaultLocale().getLanguage();
    }

    public static String getCurrentLocale() {
        return LocaleUtil.getDefaultLocale().toString();
    }

    private static boolean isMigrate() {
        try {
            String version = MicroServer.getInstance().getVersion();
            Log.i("billing_1511", "microserver version : " + version);
            return Integer.parseInt(version.split(".")[0]) >= 3;
        } catch (Exception unused) {
            return false;
        }
    }

    public static int getCurrentWiFiPort() {
        MicroServer microServer = MicroServer.getInstance();
        if (isMigrate()) {
            return microServer.getWiFiHttpPort();
        }
        return microServer.getWiFiListeningPort();
    }

    public static String getKvsValue(String str) {
        return connectionMicroServer("http://127.0.0.1:" + getCurrentWiFiPort() + "/kvs/" + str + "/", new HashMap(), true, null);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static String connectionMicroServerPrivate(String str, Map<String, String> map, boolean z, PostDataCreateHandler postDataCreateHandler) {
        HttpEntity createEntity;
        HttpUriRequest httpUriRequest;
        Uri.Builder builder = new Uri.Builder();
        DefaultHttpClient defaultHttpClient = new DefaultHttpClient();
        if (z) {
            builder.encodedPath(str);
            for (String str2 : map.keySet()) {
                builder.appendQueryParameter(str2, map.get(str2));
            }
            httpUriRequest = new HttpGet(builder.build().toString());
        } else {
            builder.encodedPath(str);
            HttpPost httpPost = new HttpPost(builder.build().toString());
            ArrayList<NameValuePair> arrayList = new ArrayList<>();
            for (String str3 : map.keySet()) {
                arrayList.add(new BasicNameValuePair(str3, map.get(str3)));
            }
            try {
                if (postDataCreateHandler == null) {
                    createEntity = new UrlEncodedFormEntity(arrayList, "UTF-8");
                } else {
                    createEntity = postDataCreateHandler.createEntity(arrayList);
                }
                httpPost.setEntity(createEntity);
                httpUriRequest = httpPost;
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                httpUriRequest = httpPost;
            }
        }
        String str4 = null;
        try {
            HttpResponse execute = defaultHttpClient.execute(httpUriRequest);
            if (execute.getStatusLine().getStatusCode() == 200) {
                HttpEntity entity = execute.getEntity();
                str4 = EntityUtils.toString(entity);
                entity.consumeContent();
            }
            defaultHttpClient.getConnectionManager().shutdown();
        } catch (Exception e2) {
            e2.printStackTrace();
        }
        Log.d("intelligenttune", httpUriRequest.getURI().toString());
        Log.d("intelligenttune", str4 != null ? str4 : Configurator.NULL);
        return str4;
    }

    public static String connectionMicroServer(String str, Map<String, String> map, boolean z, PostDataCreateHandler postDataCreateHandler) {
        String connectionMicroServerPrivate;
        synchronized (mLockObject) {
            connectionMicroServerPrivate = connectionMicroServerPrivate(str, map, z, postDataCreateHandler);
        }
        return connectionMicroServerPrivate;
    }

    @Deprecated
    public static void connectionMicroServerAsync(final String str, final Map<String, String> map, final boolean z, final PostDataCreateHandler postDataCreateHandler, final ConnectionMicroServerListener connectionMicroServerListener) {
       /* new BillingObserverThread() { // from class: com.clarion.android.smartaccess4car.extend.util.AppInfoUtil.1
            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                ConnectionMicroServerListener.this.onFinish(AppInfoUtil.connectionMicroServerPrivate(str, map, z, postDataCreateHandler));
            }
        }.start(); */
    }

    public static Thread createConnectMwsThread(final String str, final Map<String, String> map, final boolean z, final PostDataCreateHandler postDataCreateHandler, final ConnectionMicroServerListener connectionMicroServerListener) {
        return new Thread(new Runnable() { // from class: com.clarion.android.smartaccess4car.extend.util.AppInfoUtil.2
            @Override // java.lang.Runnable
            public void run() {
                ConnectionMicroServerListener.onFinish(AppInfoUtil.connectionMicroServerPrivate(str, map, z, postDataCreateHandler));
            }
        });
    }

    /* JADX WARN: Removed duplicated region for block: B:17:0x00a6  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public static java.lang.String getBillingPid(int r7) {
        /*
            java.lang.String r0 = "billing_1507"
            r1 = 0
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L97
            java.lang.String r3 = "http://127.0.0.1:"
            r2.<init>(r3)     // Catch: java.lang.Exception -> L97
            r2.append(r7)     // Catch: java.lang.Exception -> L97
            java.lang.String r7 = "/kvs/"
            r2.append(r7)     // Catch: java.lang.Exception -> L97
            java.lang.StringBuilder r7 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L97
            r7.<init>(r2)     // Catch: java.lang.Exception -> L97
            java.lang.String r3 = "current_pid/"
            r7.append(r3)     // Catch: java.lang.Exception -> L97
            java.lang.String r7 = r7.toString()     // Catch: java.lang.Exception -> L97
            java.util.HashMap r3 = new java.util.HashMap     // Catch: java.lang.Exception -> L97
            r3.<init>()     // Catch: java.lang.Exception -> L97
            r4 = 1
            java.lang.String r7 = connectionMicroServer(r7, r3, r4, r1)     // Catch: java.lang.Exception -> L97
            boolean r3 = android.text.TextUtils.isEmpty(r7)     // Catch: java.lang.Exception -> L92
            if (r3 == 0) goto L8c
            java.lang.StringBuilder r3 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L92
            r3.<init>(r2)     // Catch: java.lang.Exception -> L92
            java.lang.String r5 = "favorite_pid/"
            r3.append(r5)     // Catch: java.lang.Exception -> L92
            java.lang.String r3 = r3.toString()     // Catch: java.lang.Exception -> L92
            java.util.HashMap r5 = new java.util.HashMap     // Catch: java.lang.Exception -> L92
            r5.<init>()     // Catch: java.lang.Exception -> L92
            java.lang.String r7 = connectionMicroServer(r3, r5, r4, r1)     // Catch: java.lang.Exception -> L92
            boolean r3 = android.text.TextUtils.isEmpty(r7)     // Catch: java.lang.Exception -> L92
            if (r3 == 0) goto L86
            java.lang.StringBuilder r3 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L92
            r3.<init>(r2)     // Catch: java.lang.Exception -> L92
            java.lang.String r2 = "pid_history/"
            r3.append(r2)     // Catch: java.lang.Exception -> L92
            java.lang.String r2 = r3.toString()     // Catch: java.lang.Exception -> L92
            java.util.HashMap r3 = new java.util.HashMap     // Catch: java.lang.Exception -> L92
            r3.<init>()     // Catch: java.lang.Exception -> L92
            java.lang.String r1 = connectionMicroServer(r2, r3, r4, r1)     // Catch: java.lang.Exception -> L92
            boolean r2 = android.text.TextUtils.isEmpty(r1)     // Catch: java.lang.Exception -> L92
            if (r2 != 0) goto La0
            org.json.JSONArray r2 = new org.json.JSONArray     // Catch: java.lang.Exception -> L92
            r2.<init>(r1)     // Catch: java.lang.Exception -> L92
            r1 = 0
            java.lang.Object r2 = r2.get(r1)     // Catch: java.lang.Exception -> L92
            java.lang.String r2 = r2.toString()     // Catch: java.lang.Exception -> L92
            java.lang.String r3 = " "
            java.lang.String[] r2 = r2.split(r3)     // Catch: java.lang.Exception -> L92
            r1 = r2[r1]     // Catch: java.lang.Exception -> L92
            java.lang.String r7 = "課金対象PID : kvs/pid_history"
            android.util.Log.d(r0, r7)     // Catch: java.lang.Exception -> L97
            goto L9f
        L86:
            java.lang.String r1 = "課金対象PID : kvs/favorite_pid"
            android.util.Log.d(r0, r1)     // Catch: java.lang.Exception -> L92
            goto La0
        L8c:
            java.lang.String r1 = "課金対象PID : kvs/current_pid"
            android.util.Log.d(r0, r1)     // Catch: java.lang.Exception -> L92
            goto La0
        L92:
            r1 = move-exception
            r6 = r1
            r1 = r7
            r7 = r6
            goto L98
        L97:
            r7 = move-exception
        L98:
            java.lang.String r2 = r7.getMessage()
            android.util.Log.d(r0, r2, r7)
        L9f:
            r7 = r1
        La0:
            boolean r1 = android.text.TextUtils.isEmpty(r7)
            if (r1 == 0) goto Lab
            java.lang.String r1 = "課金対象PID : なし"
            android.util.Log.d(r0, r1)
        Lab:
            return r7
        */
        throw new UnsupportedOperationException("Method not decompiled: com.clarion.android.smartaccess4car.extend.util.AppInfoUtil.getBillingPid(int):java.lang.String");
    }

    public static String[] getBillingPidSelected(int i) {
        String[] strArr = null;
        try {
            StringBuilder sb = new StringBuilder("http://127.0.0.1:");
            sb.append(i);
            sb.append("/kvs/");
            String connectionMicroServer = connectionMicroServer(sb + "selected_pid/", new HashMap(), true, null);
            if (!TextUtils.isEmpty(connectionMicroServer)) {
                ArrayList arrayList = new ArrayList();
                JSONArray jSONArray = new JSONArray(connectionMicroServer);
                for (int i2 = 0; i2 < jSONArray.length(); i2++) {
                    arrayList.add(jSONArray.get(i2).toString());
                }
                strArr = (String[]) arrayList.toArray(new String[0]);
            }
            Log.d("billing_1603", "課金対象PID : kvs/selected_pid");
        } catch (Exception e) {
            Log.d("billing_1603", e.getMessage(), e);
        }
        if (strArr == null) {
            Log.d("billing_1603", "課金対象PID : なし");
        }
        return strArr;
    }

    public static String getBillingPidCurrent(int i) {
        String str = null;
        try {
            StringBuilder sb = new StringBuilder("http://127.0.0.1:");
            sb.append(i);
            sb.append("/kvs/");
            str = connectionMicroServer(sb + "current_pid/", new HashMap(), true, null);
            Log.d("billing_1511", "課金対象PID : kvs/current_pid");
        } catch (Exception e) {
            Log.d("billing_1511", e.getMessage(), e);
        }
        if (TextUtils.isEmpty(str)) {
            Log.d("billing_1511", "課金対象PID : なし");
        }
        return str;
    }

    public static String getBillingPidFavorite(int i) {
        String str = null;
        try {
            StringBuilder sb = new StringBuilder("http://127.0.0.1:");
            sb.append(i);
            sb.append("/kvs/");
            str = connectionMicroServer(sb + "favorite_pid/", new HashMap(), true, null);
            Log.d("billing_1511", "課金対象PID : kvs/favorite_pid");
        } catch (Exception e) {
            Log.d("billing_1511", e.getMessage(), e);
        }
        if (TextUtils.isEmpty(str)) {
            Log.d("billing_1511", "課金対象PID : なし");
        }
        return str;
    }

    public static String[] getBillingPidHistory(int i) {
        String[] strArr = null;
        try {
            StringBuilder sb = new StringBuilder("http://127.0.0.1:");
            sb.append(i);
            sb.append("/kvs/");
            String connectionMicroServer = connectionMicroServer(sb + "pid_history/", new HashMap(), true, null);
            if (!TextUtils.isEmpty(connectionMicroServer)) {
                ArrayList arrayList = new ArrayList();
                JSONArray jSONArray = new JSONArray(connectionMicroServer);
                for (int i2 = 0; i2 < jSONArray.length(); i2++) {
                    arrayList.add(jSONArray.get(i2).toString());
                }
                strArr = (String[]) arrayList.toArray(new String[0]);
            }
            Log.d("billing_1511", "課金対象PID : kvs/pid_history");
        } catch (Exception e) {
            Log.d("billing_1511", e.getMessage(), e);
        }
        if (strArr == null) {
            Log.d("billing_1511", "課金対象PID : なし");
        }
        return strArr;
    }

    private static String[] splitPidDate(String str) {
        String str2;
        String str3 = null;
        String[] strArr = {null, null};
        if (TextUtils.isEmpty(str)) {
            return strArr;
        }
        String[] split = str.split(" ");
        if (split.length == 1) {
            str3 = split[0];
            str2 = null;
        } else if (split.length > 1) {
            str3 = split[0];
            str2 = split[1];
        } else {
            str2 = null;
        }
        strArr[0] = str3;
        strArr[1] = str2;
        return strArr;
    }

    private static String getPid(String str) {
        return splitPidDate(str)[0];
    }

    private static Date getDate(String str) {
        String str2 = splitPidDate(str)[1];
        if (str2 == null) {
            return null;
        }
        try {
            return new SimpleDateFormat("yyyy'-'MM'-'dd'T'HH:mm:ss", Locale.US).parse(str2);
        } catch (Exception unused) {
            return null;
        }
    }

    public static PidInfoContainer getPidInfo(String str) {
        return new PidInfoContainer(getPid(str), getDate(str));
    }
}
