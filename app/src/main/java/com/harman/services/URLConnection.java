package com.harman.services;

import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/* loaded from: classes.dex */
public class URLConnection {
    private static final String TAG = "URLConnection";

    public boolean doUpload(String str, String str2, String str3) {
        try {
            HttpURLConnection httpConnection = getHttpConnection(str, str2);
            if (str3 != null) {
                httpConnection.setDoInput(true);
                httpConnection.setDoOutput(true);
                DataOutputStream dataOutputStream = new DataOutputStream(httpConnection.getOutputStream());
                dataOutputStream.writeBytes(str3);
                dataOutputStream.flush();
                dataOutputStream.close();
            }
            httpConnection.connect();
            Log.i(TAG, "Response Code::" + httpConnection.getResponseCode());
            return httpConnection.getResponseCode() == 200;
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG, e.getMessage());
            return false;
        }
    }

    public String httpGet(String str, int i) {
        boolean z = true;
        String str2 = null;
        while (true) {
            while (z) {
                i--;
                str2 = httpGet(str);
                z = str2 == null && i > 0;
            }
            return str2;
        }
    }

    public String httpGet(String str) {
        String str2 = null;
        try {
            HttpURLConnection httpConnection = getHttpConnection(str, "GET");
            httpConnection.connect();
            Log.i(TAG, "Response Code::" + httpConnection.getResponseCode());
            if (httpConnection.getResponseCode() != 200) {
                return null;
            }
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
            StringBuilder sb = new StringBuilder();
            while (true) {
                String readLine = bufferedReader.readLine();
                if (readLine != null) {
                    sb.append(readLine);
                    sb.append(" ");
                } else {
                    str2 = sb.toString();
                    Log.i(TAG, "response:" + str2);
                    bufferedReader.close();
                    return str2;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG, e.getMessage());
            return str2;
        }
    }

    public boolean doDownload(String str, String str2, String str3, String str4) {
        try {
            HttpURLConnection httpConnection = getHttpConnection(str, str2);
            if (str3 != null) {
                httpConnection.setDoInput(true);
                httpConnection.setDoOutput(true);
                OutputStream outputStream = httpConnection.getOutputStream();
                outputStream.write(str3.getBytes());
                outputStream.flush();
                outputStream.close();
            }
            httpConnection.connect();
            String str5 = TAG;
            Log.i(str5, "Response Code::" + httpConnection.getResponseCode());
            Log.i(str5, "Response Header::" + httpConnection.getHeaderFields());
            InputStream inputStream = httpConnection.getInputStream();
            byte[] bArr = new byte[1024];
            ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(str4 + File.separator + "license.zip"));
            zipOutputStream.putNextEntry(new ZipEntry("device_locked"));
            while (true) {
                int read = inputStream.read(bArr);
                if (read <= 0) {
                    break;
                }
                zipOutputStream.write(bArr, 0, read);
            }
            zipOutputStream.closeEntry();
            inputStream.close();
            zipOutputStream.close();
            Log.i(TAG, "Zip file has been created!");
            unpackZip(str4, "license.zip");
            File file = new File(str4, "device_locked");
            if (file.exists() && unpackFile(str4, "device_locked")) {
                file.delete();
            }
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG, e.getMessage());
            return false;
        }
    }

    private boolean unpackZip(String str, String str2) {
        Log.i(TAG, "unpackZip:" + str + " File Name :" + str2);
        try {
            ZipInputStream zipInputStream = new ZipInputStream(new BufferedInputStream(new FileInputStream(str + File.separator + str2)));
            byte[] bArr = new byte[1024];
            while (true) {
                ZipEntry nextEntry = zipInputStream.getNextEntry();
                if (nextEntry != null) {
                    String name = nextEntry.getName();
                    Log.i(TAG, "FIle::" + name);
                    if (nextEntry.isDirectory()) {
                        new File(str + File.separator + name).mkdirs();
                    } else {
                        if (!new File(str, name).getCanonicalPath().startsWith(str)) {
                            throw new SecurityException("canonicalPath is not correct");
                        }
                        FileOutputStream fileOutputStream = new FileOutputStream(str + File.separator + name);
                        while (true) {
                            int read = zipInputStream.read(bArr);
                            if (read == -1) {
                                break;
                            }
                            fileOutputStream.write(bArr, 0, read);
                        }
                        fileOutputStream.close();
                        zipInputStream.closeEntry();
                    }
                } else {
                    File file = new File(str, str2);
                    if (file.exists()) {
                        file.delete();
                    }
                    zipInputStream.close();
                    return true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean unpackFile(String str, String str2) {
        Log.i(TAG, "unpackFile:" + str + " File Name :" + str2);
        try {
            ZipInputStream zipInputStream = new ZipInputStream(new BufferedInputStream(new FileInputStream(str + File.separator + str2)));
            byte[] bArr = new byte[1024];
            while (true) {
                ZipEntry nextEntry = zipInputStream.getNextEntry();
                if (nextEntry != null) {
                    String name = nextEntry.getName();
                    Log.i(TAG, "FIle::" + name);
                    if (nextEntry.isDirectory()) {
                        new File(str + File.separator + name).mkdirs();
                    } else {
                        if (!new File(str, name).getCanonicalPath().startsWith(str)) {
                            throw new SecurityException("canonicalPath is not correct");
                        }
                        FileOutputStream fileOutputStream = new FileOutputStream(str + File.separator + name);
                        while (true) {
                            int read = zipInputStream.read(bArr);
                            if (read == -1) {
                                break;
                            }
                            fileOutputStream.write(bArr, 0, read);
                        }
                        fileOutputStream.close();
                        zipInputStream.closeEntry();
                    }
                } else {
                    zipInputStream.close();
                    return true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public HttpURLConnection getHttpConnection(String str, String str2) {
        HttpsURLConnection httpsURLConnection = null;
        try {
            HttpsURLConnection httpsURLConnection2 = (HttpsURLConnection) new URL(str).openConnection();
            try {
                httpsURLConnection2.setSSLSocketFactory(createSslSocketFactory());
                httpsURLConnection2.setRequestMethod(str2);
                httpsURLConnection2.setConnectTimeout(30000);
                httpsURLConnection2.setReadTimeout(30000);
                httpsURLConnection2.setRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, HarmanOTAConst.JSON_CONTENT_TYPE);
                return httpsURLConnection2;
            } catch (Exception unused) {
                httpsURLConnection = httpsURLConnection2;
                Log.i(TAG, "connection i/o failed");
                return httpsURLConnection;
            }
        } catch (Exception unused2) {
        }
        return httpsURLConnection;
    }

    private SSLSocketFactory createSslSocketFactory() throws Exception {
        TrustManager[] trustManagerArr = {new X509TrustManager() { // from class: com.harman.services.URLConnection.1
            @Override // javax.net.ssl.X509TrustManager
            public void checkClientTrusted(X509Certificate[] x509CertificateArr, String str) {
            }

            @Override // javax.net.ssl.X509TrustManager
            public void checkServerTrusted(X509Certificate[] x509CertificateArr, String str) {
            }

            @Override // javax.net.ssl.X509TrustManager
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        }};
        SSLContext sSLContext = SSLContext.getInstance("TLS");
        sSLContext.init(null, trustManagerArr, new SecureRandom());
        return sSLContext.getSocketFactory();
    }
}
