package com.clarion.android.appmgr.vespa;

import android.content.Context;
import com.clarion.android.appmgr.stub.Stub;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import org.apache.log4j.Level;

/* loaded from: classes.dex */
public class HttpDownloader {
    private static final int CONNECT_TIME_OUT = 10000;
    private static final int READ_TIME_OUT = 10000;
    public static final String TAG = "HttpDownloader";
    private final boolean TEST_MODEL = false;
    private String contentType = "";
    private Stub.ExceptionLoggerStub mLogger = null;
    private final TrustManager[] TRUST_MANAGER = null;
    HostnameVerifier HOSTNAME_VERIFIER = HttpsURLConnection.getDefaultHostnameVerifier();

    public InputStream getInputStreamFromUrl(String str) throws IOException {
        Stub.AppMgrLogStub.d(TAG, "GetInputstreamFromURL " + str);
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod("GET");
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        if (httpURLConnection instanceof HttpsURLConnection) {
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                    HttpsURLConnection httpsURLConnection = (HttpsURLConnection) httpURLConnection;
                    httpsURLConnection.setSSLSocketFactory(sSLContext.getSocketFactory());
                    httpsURLConnection.setHostnameVerifier(this.HOSTNAME_VERIFIER);
                } catch (KeyManagementException e) {
                    Stub.AppMgrLogStub.e(TAG, e.toString(), e);
                    return null;
                }
            } catch (NoSuchAlgorithmException e2) {
                Stub.AppMgrLogStub.e(TAG, e2.toString(), e2);
                return null;
            }
        }
        httpURLConnection.connect();
        if (httpURLConnection.getResponseCode() != 200) {
            Stub.AppMgrLogStub.e(TAG, "Vespa response code error :" + httpURLConnection.getResponseCode());
            return null;
        }
        InputStream inputStream = httpURLConnection.getInputStream();
        this.contentType = httpURLConnection.getContentType();
        return inputStream;
    }

    public InputStream getInputStreamFromUrlByPost(String str, byte[] bArr) throws IOException {
        Stub.AppMgrLogStub.d(TAG, str);
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod(HttpCatalogs.METHOD_POST);
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        httpURLConnection.setRequestProperty("content-type", "application/x-www-form-urlencoded");
        httpURLConnection.setDoInput(true);
        httpURLConnection.setDoOutput(true);
        if (httpURLConnection instanceof HttpsURLConnection) {
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                    HttpsURLConnection httpsURLConnection = (HttpsURLConnection) httpURLConnection;
                    httpsURLConnection.setSSLSocketFactory(sSLContext.getSocketFactory());
                    httpsURLConnection.setHostnameVerifier(this.HOSTNAME_VERIFIER);
                } catch (KeyManagementException e) {
                    Stub.AppMgrLogStub.e(TAG, e.toString(), e);
                    return null;
                }
            } catch (NoSuchAlgorithmException e2) {
                Stub.AppMgrLogStub.e(TAG, e2.toString(), e2);
                return null;
            }
        }
        httpURLConnection.connect();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        outputStream.write(bArr);
        outputStream.flush();
        if (httpURLConnection.getResponseCode() != 200) {
            Stub.AppMgrLogStub.e(TAG, "Vespa response code error :" + httpURLConnection.getResponseCode());
            return null;
        }
        InputStream inputStream = httpURLConnection.getInputStream();
        this.contentType = httpURLConnection.getContentType();
        return inputStream;
    }

    public void sendDataByPost(String str, String str2, String str3, Context context) throws IOException {
        if (this.mLogger == null) {
            this.mLogger = Stub.ExceptionLoggerStub.getInstance(context);
        }
        this.mLogger.write("CXEE --> CT send data:\n" + str3, false);
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod(HttpCatalogs.METHOD_POST);
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(str3.getBytes().length));
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "text/xml; charset=UTF-8");
        httpURLConnection.setRequestProperty("Cookie", str2);
        httpURLConnection.setDoInput(true);
        httpURLConnection.setDoOutput(true);
        if (httpURLConnection instanceof HttpsURLConnection) {
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                    HttpsURLConnection httpsURLConnection = (HttpsURLConnection) httpURLConnection;
                    httpsURLConnection.setSSLSocketFactory(sSLContext.getSocketFactory());
                    httpsURLConnection.setHostnameVerifier(this.HOSTNAME_VERIFIER);
                } catch (KeyManagementException e) {
                    Stub.AppMgrLogStub.e(TAG, e.toString(), e);
                    return;
                }
            } catch (NoSuchAlgorithmException e2) {
                Stub.AppMgrLogStub.e(TAG, e2.toString(), e2);
                return;
            }
        }
        httpURLConnection.connect();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        outputStream.write(str3.getBytes());
        outputStream.flush();
        httpURLConnection.getInputStream();
    }

    public InputStream getInputStreamByPost(String str, String str2, String str3, Context context) throws IOException {
        if (this.mLogger == null) {
            this.mLogger = Stub.ExceptionLoggerStub.getInstance(context);
        }
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod(HttpCatalogs.METHOD_POST);
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(str3.getBytes().length));
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "application/x-www-form-urlencoded");
        httpURLConnection.setRequestProperty("Cookie", str2);
        httpURLConnection.setDoInput(true);
        httpURLConnection.setDoOutput(true);
        if (httpURLConnection instanceof HttpsURLConnection) {
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                    HttpsURLConnection httpsURLConnection = (HttpsURLConnection) httpURLConnection;
                    httpsURLConnection.setSSLSocketFactory(sSLContext.getSocketFactory());
                    httpsURLConnection.setHostnameVerifier(this.HOSTNAME_VERIFIER);
                } catch (KeyManagementException e) {
                    Stub.AppMgrLogStub.e(TAG, e.toString(), e);
                    return null;
                }
            } catch (NoSuchAlgorithmException e2) {
                Stub.AppMgrLogStub.e(TAG, e2.toString(), e2);
                return null;
            }
        }
        httpURLConnection.connect();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        outputStream.write(str3.getBytes());
        outputStream.flush();
        if (httpURLConnection.getResponseCode() != 200) {
            return null;
        }
        this.contentType = httpURLConnection.getContentType();
        this.mLogger.write("Vespa response code success :" + httpURLConnection.getResponseCode() + " contentType=" + this.contentType + " ---" + httpURLConnection.getResponseMessage(), false);
        return httpURLConnection.getInputStream();
    }

    public String getContentType() {
        return this.contentType;
    }

    private void coutHttpHeader(HttpURLConnection httpURLConnection, String str) {
        String str2 = "";
        for (Map.Entry<String, List<String>> entry : httpURLConnection.getRequestProperties().entrySet()) {
            String key = entry.getKey();
            List<String> value = entry.getValue();
            String str3 = "";
            for (int i = 0; i < value.size(); i++) {
                str3 = str3 + value.get(i);
            }
            str2 = (key == null || key == "") ? str2 + "\n" + value.get(0) : str2 + "\n" + ((Object) key) + ":" + value.get(0);
        }
        this.mLogger.write(str + str2, false);
    }

    public void writeDataToPhone(String str, String str2, int i) {
        URL url;
        if (i == 0) {
            return;
        }
        HttpURLConnection httpURLConnection = null;
        try {
            url = new URL("http://127.0.0.1:" + i + "/kvs/" + str + "/");
        } catch (MalformedURLException e) {
            e.printStackTrace();
            url = null;
        }
        try {
            httpURLConnection = (HttpURLConnection) url.openConnection();
        } catch (IOException e2) {
            e2.printStackTrace();
        }
        try {
            httpURLConnection.setRequestMethod(HttpCatalogs.METHOD_POST);
        } catch (ProtocolException e3) {
            e3.printStackTrace();
        }
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(str2 == null ? 0 : str2.getBytes().length));
        httpURLConnection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "text/xml; charset=UTF-8");
        httpURLConnection.setDoInput(true);
        httpURLConnection.setDoOutput(true);
        if (httpURLConnection instanceof HttpsURLConnection) {
            try {
                SSLContext sSLContext = SSLContext.getInstance("TLS");
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                    SSLSocketFactory socketFactory = sSLContext.getSocketFactory();
                    HttpsURLConnection httpsURLConnection = (HttpsURLConnection) httpURLConnection;
                    httpsURLConnection.setSSLSocketFactory(socketFactory);
                    httpsURLConnection.setHostnameVerifier(this.HOSTNAME_VERIFIER);
                } catch (KeyManagementException e4) {
                    Stub.AppMgrLogStub.e(TAG, e4.toString(), e4);
                    return;
                }
            } catch (NoSuchAlgorithmException e5) {
                Stub.AppMgrLogStub.e(TAG, e5.toString(), e5);
                return;
            }
        }
        try {
            httpURLConnection.connect();
        } catch (IOException e6) {
            e6.printStackTrace();
        } catch (IllegalArgumentException e7) {
            e7.printStackTrace();
        }
        try {
            OutputStream outputStream = httpURLConnection.getOutputStream();
            if (str2 != null) {
                try {
                    outputStream.write(str2.getBytes());
                } catch (IOException e8) {
                    e8.printStackTrace();
                }
            }
            try {
                outputStream.flush();
            } catch (IOException e9) {
                e9.printStackTrace();
            }
            try {
                if (httpURLConnection.getResponseCode() != 200) {
                    return;
                }
                this.contentType = httpURLConnection.getContentType();
            } catch (IOException e10) {
                e10.printStackTrace();
            }
        } catch (IOException e11) {
            e11.printStackTrace();
        }
    }

    public String getDataFrPhone(int i, String str) {
        SSLContext sSLContext;
        if (i == 0) {
            return null;
        }
        try {
            HttpURLConnection httpURLConnection = (HttpURLConnection) new URL("http://127.0.0.1:" + i + "/kvs/" + str + "/").openConnection();
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.setConnectTimeout(10000);
            httpURLConnection.setReadTimeout(Level.TRACE_INT);
            if (httpURLConnection instanceof HttpsURLConnection) {
                try {
                    sSLContext = SSLContext.getInstance("TLS");
                } catch (NoSuchAlgorithmException e) {
                    Stub.AppMgrLogStub.e(TAG, e.toString(), e);
                    sSLContext = null;
                }
                try {
                    sSLContext.init(new KeyManager[0], this.TRUST_MANAGER, new SecureRandom());
                } catch (KeyManagementException e2) {
                    Stub.AppMgrLogStub.e(TAG, e2.toString(), e2);
                }
                ((HttpsURLConnection) httpURLConnection).setSSLSocketFactory(sSLContext.getSocketFactory());
                ((HttpsURLConnection) httpURLConnection).setHostnameVerifier(this.HOSTNAME_VERIFIER);
            }
            httpURLConnection.connect();
            if (httpURLConnection.getResponseCode() != 200) {
                System.out.println("getDataFrPhone(" + str + ") error!=200----" + httpURLConnection.getResponseCode());
                return null;
            }
            InputStream inputStream = httpURLConnection.getInputStream();
            this.contentType = httpURLConnection.getContentType();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            byte[] bArr = new byte[1024];
            while (true) {
                int read = inputStream.read(bArr);
                if (read != -1) {
                    byteArrayOutputStream.write(bArr, 0, read);
                } else {
                    return byteArrayOutputStream.toString("UTF-8");
                }
            }
        } catch (IOException e3) {
            System.out.println("getDataFrPhone error:" + e3.getMessage());
            return null;
        }
    }
}
