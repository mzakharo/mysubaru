package jp.chef_station.chef_station.fw.server;

import android.os.AsyncTask;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.clarion.smartaccess.inappbilling.util.Util;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.UnknownHostException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import jp.chef_station.chef_station.ChefStationConst;
import jp.chef_station.chef_station.fw.util.BeanUtil;
import jp.chef_station.chef_station.fw.util.LogUtil;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.log4j.spi.Configurator;
import org.xmlpull.v1.XmlPullParserException;

/* loaded from: classes.dex */
public abstract class AbstractHttpAccessTask<Params, Progress, Result> extends AsyncTask<Params, Progress, Result> {
    private static final int BUFFER_SIZE = 4096;
    protected boolean canLoadingAnimation = false;
    private ServerRequestTaskCallback<Result> callback = null;
    private StringBuilder sb = null;
    private BeanUtil.FieldReflectCallback mGetCallback = new BeanUtil.FieldReflectCallback() { // from class: jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask.1
        @Override // jp.chef_station.chef_station.fw.util.BeanUtil.FieldReflectCallback
        public void fieldReflectCallback(String str, Object obj) {
            if (obj != null) {
                StringBuilder sb = AbstractHttpAccessTask.this.sb;
                sb.append(str);
                sb.append(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
                sb.append(obj.toString());
                sb.append(Const.REQUEST_PARAM_SEPARATE_STR);
            }
        }
    };
    private List<NameValuePair> postFields = null;
    private BeanUtil.FieldReflectCallback mPostCallback = new BeanUtil.FieldReflectCallback() { // from class: jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask.2
        @Override // jp.chef_station.chef_station.fw.util.BeanUtil.FieldReflectCallback
        public void fieldReflectCallback(String str, Object obj) {
            AbstractHttpAccessTask.this.postFields.add(new BasicNameValuePair(str, obj.toString()));
        }
    };
    HttpURLConnection mConnection = null;

    /* loaded from: classes.dex */
    public interface ServerRequestTaskCallback<Result> {
        void onPostExecute(Result result);

        void onPreExecute();
    }

    protected abstract Result createNewResult();

    protected abstract String getAccessUrl();

    protected abstract int getTimeout();

    protected abstract Result handleResponse(InputStream inputStream) throws Exception;

    protected abstract InputStream postRequest(String str, Params params, int i) throws IOException;

    static {
        System.setProperty("http.keepAlive", "false");
        System.setProperty("http.agent", "SA_Android_Client/1.0");
    }

    public void setCallback(ServerRequestTaskCallback<Result> serverRequestTaskCallback) {
        this.callback = serverRequestTaskCallback;
    }

    @Override // android.os.AsyncTask
    protected void onPreExecute() {
        Log.d("billing_1507", "===== AsyncTask#onPreExecute ===== : " + getClass().getSimpleName());
        ServerRequestTaskCallback<Result> serverRequestTaskCallback = this.callback;
        if (serverRequestTaskCallback != null) {
            serverRequestTaskCallback.onPreExecute();
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.os.AsyncTask
    public Result doInBackground(Params... paramsArr) {
        InputStream inputStream;
        Log.d("billing_1507", "===== AsyncTask#doInBackground ===== : " + getClass().getSimpleName());
        TaskManager.start(this);
        String accessUrl = getAccessUrl();
        int timeout = getTimeout();
        LogUtil.v("_log", accessUrl);
        LogUtil.v("_log", paramsArr[0].toString());
        try {
            inputStream = postRequest(accessUrl, paramsArr[0], timeout);
        } catch (Throwable th) {
            th = th;
            inputStream = null;
        }
        try {
            Result handleResponse = handleResponse(inputStream);
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            releaseConnection();
            return handleResponse;
        } catch (Throwable th2) {
            Throwable th = th2;
            try {
                Result errorStatus = setErrorStatus(null, th);
                th.printStackTrace();
                return errorStatus;
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e2) {
                        e2.printStackTrace();
                    }
                }
                releaseConnection();
            }
        }
    }

    protected Result setErrorStatus(Result result, Throwable th) {
        if (result == null) {
            result = createNewResult();
        }
        int r1 = 0;
        if (th instanceof AccessTaskException) {
            AccessTaskException accessTaskException = (AccessTaskException) th;
            r1 = accessTaskException.getCode() != -1 ? accessTaskException.getCode() + 2048 : 1024;
            LogUtil.w("_log", "HTTP Response=" + accessTaskException.getCode());
        } else if (!(th instanceof SocketException) && !(th instanceof SocketTimeoutException) && !(th instanceof UnknownHostException) && !(th instanceof ConnectException)) {
            r1 = th instanceof XmlPullParserException ? 4096 : 8192;
        }
        BeanUtil.setField(result, "error", Integer.valueOf(r1));
        return result;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.os.AsyncTask
    public void onPostExecute(Result result) {
        Log.d("billing_1507", "===== AsyncTask#onPostExecute ===== : " + getClass().getSimpleName());
        LogUtil.v("_log", "" + result);
        ServerRequestTaskCallback<Result> serverRequestTaskCallback = this.callback;
        if (serverRequestTaskCallback != null) {
            serverRequestTaskCallback.onPostExecute(result);
        }
    }

    @Override // android.os.AsyncTask
    protected void onCancelled() {
        Log.d("billing_1507", "===== AsyncTask#onPostExecute ===== : " + getClass().getSimpleName());
    }

    protected synchronized String createGetRequestParams(Object obj) {
        if (obj == null) {
            return Configurator.NULL;
        }
        this.sb = new StringBuilder("?");
        BeanUtil.fieldRefrect(obj, this.mGetCallback);
        //this.sb.deleteCharAt(r3.length() - 1);
        return this.sb.toString();
    }

    protected InputStream executeGetMethod(StringBuilder sb, String str, int i) throws IOException {
        HttpURLConnection httpURLConnection = null;
        if (str != null) {
            try {
                try {
                    sb.append(str);
                } catch (NullPointerException e) {
                    AccessTaskException accessTaskException = new AccessTaskException(-1, e.getMessage());
                    accessTaskException.initCause(e);
                    throw accessTaskException;
                } catch (Exception e2) {
                    e2.printStackTrace();
                    return null;
                }
            } catch (IOException e3) {
                IOException e = e3;
                e.printStackTrace();
                throw new AccessTaskException(httpURLConnection.getResponseCode(), e.getMessage());
            }
        }
        HttpURLConnection httpUrlConnection = getHttpUrlConnection(sb.toString(), i);
        try {
            httpUrlConnection.connect();
            return getServerResponseInputStream(httpUrlConnection);
        } catch (IOException e4) {
            httpURLConnection = httpUrlConnection;
            IOException e = e4;
            e.printStackTrace();
            throw new AccessTaskException(httpURLConnection.getResponseCode(), e.getMessage());
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public synchronized List<NameValuePair> createPostRequestParams(Object obj) {
        if (this.postFields == null) {
            this.postFields = new ArrayList();
        }
        this.postFields.clear();
        if (obj != null) {
            BeanUtil.fieldRefrect(obj, this.mPostCallback);
        }
        return this.postFields;
    }

    public void releaseConnection() {
        if (this.mConnection != null) {
            Log.d("billing_1511_que", "HttpTask disconnect");
            try {
                this.mConnection.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
            this.mConnection = null;
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public InputStream executePostMethod(String str, List<NameValuePair> list, int i) throws IOException {
        HttpURLConnection httpURLConnection = null;
        HttpURLConnection httpURLConnection2 = this.mConnection;
        HttpURLConnection httpURLConnection3 = null;
        InputStream inputStream = null;
        HttpURLConnection httpURLConnection4 = null;
        if (httpURLConnection2 != null) {
            httpURLConnection2.disconnect();
            this.mConnection = null;
        }
        try {
            try {
                httpURLConnection = getHttpUrlConnection(str, i);
            } catch (IOException e) {
                e = e;
            } catch (NullPointerException e2) {
                NullPointerException e = e2;
            } catch (Exception e3) {
                Exception e = e3;
                httpURLConnection = null;
            }
            try {
                try {
                    httpURLConnection.setRequestMethod(HttpCatalogs.METHOD_POST);
                    httpURLConnection.setDoOutput(true);
                    httpURLConnection.setReadTimeout(i);
                    httpURLConnection.setRequestProperty(ChefStationConst.XSA_AUTHENTICATION_HEADER, getXSAAuthentication());
                    sendPostData(list, httpURLConnection);
                    httpURLConnection.connect();
                    inputStream = getServerResponseInputStream(httpURLConnection);
                } catch (IOException e4) {
                    IOException e = e4;
                    httpURLConnection3 = httpURLConnection;
                    e.printStackTrace();
                    throw new AccessTaskException(httpURLConnection3.getResponseCode(), e.getMessage());
                } catch (NullPointerException e5) {
                    NullPointerException e = e5;
                    AccessTaskException accessTaskException = new AccessTaskException(-1, e.getMessage());
                    accessTaskException.initCause(e);
                    throw accessTaskException;
                } catch (Exception e6) {
                    Exception e = e6;
                    e.printStackTrace();
                    this.mConnection = httpURLConnection;
                    return inputStream;
                }
                this.mConnection = httpURLConnection;
                return inputStream;
            } catch (Throwable th) {
                th = th;
                httpURLConnection4 = httpURLConnection;
                this.mConnection = httpURLConnection4;
                throw th;
            }
        } catch (Throwable th2) {
            Throwable th = th2;
            this.mConnection = httpURLConnection4;
            //throw th;
        }
        return inputStream;
    }

    private void sendPostData(List<NameValuePair> list, HttpURLConnection httpURLConnection) throws IOException {
        if (list == null || list.size() == 0) {
            return;
        }
        InputStream content = new UrlEncodedFormEntity(list, "UTF-8").getContent();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        try {
            byte[] bArr = new byte[4096];
            while (true) {
                int read = content.read(bArr);
                if (read == -1) {
                    return;
                } else {
                    outputStream.write(bArr, 0, read);
                }
            }
        } finally {
            outputStream.close();
            content.close();
        }
    }

    protected InputStream getServerResponseInputStream(HttpURLConnection httpURLConnection) throws IOException {
        return new BufferedInputStream(httpURLConnection.getInputStream());
    }

    private Proxy getProxy() {
        String defaultHost = android.net.Proxy.getDefaultHost();
        if (defaultHost == null) {
            return null;
        }
        return new Proxy(Proxy.Type.HTTP, new InetSocketAddress(defaultHost, android.net.Proxy.getDefaultPort()));
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public HttpURLConnection getHttpUrlConnection(String str, int i) throws IOException {
        HttpURLConnection connection = getConnection(str);
        if (connection instanceof HttpsURLConnection) {
            HttpsURLConnection httpsURLConnection = (HttpsURLConnection) connection;
            httpsURLConnection.setHostnameVerifier(HttpsURLConnection.getDefaultHostnameVerifier());
            TrustManager[] trustManagerArr = {new X509TrustManager() { // from class: jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask.3
                @Override // javax.net.ssl.X509TrustManager
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }

                @Override // javax.net.ssl.X509TrustManager
                public void checkClientTrusted(X509Certificate[] x509CertificateArr, String str2) {
                    Log.d("getHttpUrlConnection", "checkClientTrusted()");
                }

                @Override // javax.net.ssl.X509TrustManager
                public void checkServerTrusted(X509Certificate[] x509CertificateArr, String str2) {
                    Log.d("getHttpUrlConnection", "checkServerTrusted()");
                }
            }};
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                sSLContext.init(null, trustManagerArr, new SecureRandom());
                httpsURLConnection.setSSLSocketFactory(sSLContext.getSocketFactory());
            } catch (KeyManagementException | NoSuchAlgorithmException unused) {
                return null;
            }
        }
        return connection;
    }

    protected HttpURLConnection getConnection(String str) throws IOException {
        URL url = new URL(str);
        Proxy proxy = getProxy();
        if (proxy == null) {
            return (HttpURLConnection) url.openConnection();
        }
        return (HttpURLConnection) url.openConnection(proxy);
    }

    private String getXSAAuthentication() {
        return Util.hashedStringForSHA256(ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY + ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    /* loaded from: classes.dex */
    public static class AccessTaskException extends IOException {
        private int code;

        public AccessTaskException(int i) {
            this.code = -1;
            init(i);
        }

        public AccessTaskException(int i, String str) {
            super(str);
            this.code = -1;
            init(i);
        }

        private void init(int i) {
            this.code = i;
        }

        public int getCode() {
            return this.code;
        }
    }
}
