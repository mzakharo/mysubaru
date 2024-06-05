package com.uievolution.microserver.modules;

import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.HttpHeaderWriter;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.BasicStatusLine;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.HttpStatus;
import com.uievolution.microserver.http.HttpVersion;
import com.uievolution.microserver.http.ProtocolVersion;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.Utils;
import java.io.IOException;
import java.io.InputStream;
import java.net.ConnectException;
import java.net.ProtocolException;
import java.net.SocketTimeoutException;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.SSLException;
import okhttp3.CacheControl;
import okhttp3.Call;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Protocol;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okhttp3.internal.http.HttpMethod;
import okio.GzipSource;
import okio.Okio;

/* loaded from: classes.dex */
public class HttpProxyModule extends AbstractMSModuleImpl {
    public static final String LOGTAG = "HttpProxyModule";
    private static final OkHttpClient s;
    private Call m;
    private boolean n = false;
    private HttpRequestBase o;
    private List<Class<? extends MSHTTPProxyResponseInterceptor>> p;
    static final MediaType q = MediaType.parse("application/x-www-form-urlencoded");
    private static final RequestBody r = RequestBody.create((MediaType) null, new byte[0]);
    private static CacheControl t = new CacheControl.Builder().noCache().build();

    static {
        OkHttpClient.Builder followSslRedirects = new OkHttpClient.Builder().followRedirects(false).followSslRedirects(false);
        MicroServer microServer = MicroServer.getInstance();
        if (microServer.getProperties().getBoolean("httpmodule.autoredirect", false)) {
            followSslRedirects.followRedirects(true);
            followSslRedirects.followSslRedirects(true);
        }
        int i = microServer.getProperties().getInt("httpmodule.connecttimeout", 10);
        long j = i > 0 ? i : 10;
        followSslRedirects.connectTimeout(j, TimeUnit.SECONDS);
        followSslRedirects.readTimeout(j, TimeUnit.SECONDS);
        followSslRedirects.writeTimeout(j, TimeUnit.SECONDS);
        s = followSslRedirects.build();
    }

    private Request a(HttpRequestBase httpRequestBase) {
        Headers.Builder builder = new Headers.Builder();
        for (Header header : httpRequestBase.getAllHeaders()) {
            builder.add(header.getName(), header.getValue());
        }
        if (builder.get(HttpCatalogs.HEADER_ACCEPT_ENCODING) == null) {
            builder.add(HttpCatalogs.HEADER_ACCEPT_ENCODING, "identity");
        }
        Request.Builder headers = new Request.Builder().cacheControl(t).url(httpRequestBase.getURI().toString()).headers(builder.build());
        RequestBody requestBody = null;
        if (httpRequestBase.getBody() != null && httpRequestBase.getBody().length > 0) {
            requestBody = RequestBody.create(b(httpRequestBase), httpRequestBase.getBody());
        }
        if (requestBody == null && HttpMethod.requiresRequestBody(httpRequestBase.getMethod())) {
            requestBody = r;
        }
        return headers.method(httpRequestBase.getMethod(), requestBody).build();
    }

    private MediaType b(HttpRequestBase httpRequestBase) {
        Header header = null;
        for (Header header2 : httpRequestBase.getAllHeaders()) {
            if (HttpCatalogs.HEADER_CONTENT_TYPE.equals(header2.getName())) {
                header = header2;
            }
        }
        if (header != null) {
            return MediaType.parse(header.getValue());
        }
        return q;
    }

    private void c(Response response) throws InterruptedException, IOException, CancelException {
        MicroServer.Logger.d(LOGTAG, "Shoutcast");
        HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter("ICY " + Integer.toString(response.code()) + " " + response.message());
        Headers headers = response.headers();
        for (String str : headers.names()) {
            if (!str.startsWith("OkHttp-")) {
                Iterator<String> it = headers.values(str).iterator();
                while (it.hasNext()) {
                    httpHeaderWriter.add(new BasicHeader(str, it.next()));
                }
            }
        }
        getOutQueue().put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
        a(response.body());
    }

    private HttpRequestBase g() throws g, URISyntaxException {
        ArrayList arrayList = new ArrayList();
        for (Header header : getRequestInfo().getHeaders()) {
            if (!HttpCatalogs.HEADER_PROXY_CONNECTION.equals(header.getName())) {
                arrayList.add(header);
            }
        }
        return new HttpRequestBase(getRequestInfo().getRequestLine(), (Header[]) arrayList.toArray(new Header[arrayList.size()]), getWholeBody());
    }

    private Response h() throws IOException, g, URISyntaxException {
        HttpRequestBase g = g();
        this.o = g;
        Request a = a(g);
        MicroServer.Logger.v(LOGTAG, "----- HTTP REQUEST to Remote host, " + f() + "-----");
        MicroServer.Logger.v(LOGTAG, a.method() + " " + a.url());
        a(a.headers());
        Call newCall = s.newCall(a);
        this.m = newCall;
        return newCall.execute();
    }

    private void i() throws InterruptedException {
        getOutQueue().put(ByteBuffer.wrap(HttpCatalogs.CHUNK_FINAL_STRING.getBytes()));
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl, com.uievolution.microserver.MSModule
    public void cancel() {
        MicroServer.Logger.d(LOGTAG, "cancel, " + f());
        this.n = true;
        Call call = this.m;
        if (call != null) {
            call.cancel();
        }
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        Response response;
        MicroServer.Logger.d(LOGTAG, "doStart, " + f());
        this.m = null;
        this.n = false;
        try {
            response = h();
        } catch (g e) {
            MicroServer.Logger.w(LOGTAG, "UnknownMethoedException: " + e.getMessage());
            sendResponse(500);
            return null;
        } catch (ConnectException e2) {
            MicroServer.Logger.w(LOGTAG, e2.getMessage());
            sendResponse(503);
            return null;
        } catch (ProtocolException e3) {
            if (e3.getMessage().indexOf("HTTP_PROXY_AUTH (407)") >= 0) {
                MicroServer.Logger.d(LOGTAG, "ProtocolException: " + e3.getMessage());
                sendResponse(HttpStatus.SC_PROXY_AUTHENTICATION_REQUIRED);
            } else if (e3.getMessage().indexOf("Too many follow-up") >= 0) {
                MicroServer.Logger.d(LOGTAG, "ProtocolException: " + e3.getMessage());
                sendResponse(HttpStatus.SC_REQUEST_TIMEOUT);
            } else {
                MicroServer.Logger.w(LOGTAG, e3);
                sendResponse(500);
            }
            return null;
        } catch (SocketTimeoutException e4) {
            MicroServer.Logger.w(LOGTAG, e4.getMessage());
            sendResponse(504);
            return null;
        } catch (URISyntaxException e5) {
            MicroServer.Logger.w(LOGTAG, "URISyntaxException: " + e5.getMessage());
            sendResponse(500, null);
            response = null;
        } catch (UnknownHostException e6) {
            MicroServer.Logger.w(LOGTAG, e6.getMessage());
            sendResponse(503);
            return null;
        } catch (SSLException e7) {
            MicroServer.Logger.w(LOGTAG, e7.getMessage());
            sendResponse(503);
            return null;
        } catch (IOException e8) {
            MicroServer.Logger.w(LOGTAG, e8);
            sendResponse(500);
            return null;
        }
        if (this.n) {
            return null;
        }
        MicroServer.Logger.v(LOGTAG, "----- HTTP RESPONSE from Remote host, " + f() + "-----");
        MicroServer.Logger.v(LOGTAG, response.protocol() + " " + response.code() + " " + response.message());
        a(response.headers());
        if (response.protocol().toString().equals("icy")) {
            try {
                c(response);
            } catch (CancelException e9) {
                MicroServer.Logger.d(LOGTAG, "CancelException: " + e9.getMessage());
                closeUaConnectionNow();
                return null;
            } catch (IOException e10) {
                MicroServer.Logger.w(LOGTAG, "IOException: " + e10.getMessage(), e10);
                closeUaConnectionNow();
                return null;
            } catch (InterruptedException e11) {
                MicroServer.Logger.d(LOGTAG, "InterrupttedlException: " + e11.getMessage());
                closeUaConnectionNow();
            }
        } else {
            try {
                b(response);
            } catch (CancelException e12) {
                MicroServer.Logger.d(LOGTAG, "CancelException: " + e12.getMessage());
                closeUaConnectionNow();
                return null;
            } catch (IOException e13) {
                MicroServer.Logger.w(LOGTAG, "IOException: " + e13.getMessage(), e13);
                closeUaConnectionNow();
                return null;
            } catch (InterruptedException e14) {
                MicroServer.Logger.d(LOGTAG, "InterrupttedlException: " + e14.getMessage());
                closeUaConnectionNow();
                return null;
            }
        }
        return null;
    }

    String f() {
        return Integer.toHexString(hashCode());
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl, com.uievolution.microserver.MSModule
    public void finished() {
        MicroServer.Logger.d(LOGTAG, "finished, " + f());
    }

    private void b(Response response) throws IOException, CancelException, InterruptedException {
        BasicStatusLine basicStatusLine = new BasicStatusLine(a(response), response.code(), response.message());
        Headers headers = response.headers();
        Set<String> names = headers.names();
        ArrayList arrayList = new ArrayList(headers.names().size());
        for (String str : names) {
            if (!str.startsWith("OkHttp-")) {
                Iterator<String> it = headers.values(str).iterator();
                while (it.hasNext()) {
                    arrayList.add(new BasicHeader(str, it.next()));
                }
            }
        }
        Header[] headerArr = (Header[]) arrayList.toArray(new Header[arrayList.size()]);
        ArrayList arrayList2 = new ArrayList();
        List<Class<? extends MSHTTPProxyResponseInterceptor>> list = this.p;
        if (list != null) {
            Iterator<Class<? extends MSHTTPProxyResponseInterceptor>> it2 = list.iterator();
            while (it2.hasNext()) {
                try {
                    MSHTTPProxyResponseInterceptor newInstance = it2.next().newInstance();
                    if (newInstance.start(this.o, basicStatusLine, headerArr)) {
                        arrayList2.add(newInstance);
                    }
                } catch (IllegalAccessException e) {
                    MicroServer.Logger.w(LOGTAG, e);
                } catch (InstantiationException e2) {
                    MicroServer.Logger.w(LOGTAG, e2);
                }
            }
        }
        if (!arrayList2.isEmpty()) {
            a(basicStatusLine, headerArr, response.body(), arrayList2);
        } else {
            a(basicStatusLine, headerArr, response.body());
        }
    }

    private ProtocolVersion a(Response response) {
        if (AbstractMSModuleImpl.isActiveClose()) {
            return HttpVersion.HTTP_1_0;
        }
        if (getRequestInfo().getRequestLine().getProtocolVersion().equals(HttpVersion.HTTP_1_0)) {
            return HttpVersion.HTTP_1_0;
        }
        if (response.protocol().equals(Protocol.HTTP_1_0)) {
            return HttpVersion.HTTP_1_0;
        }
        return HttpVersion.HTTP_1_1;
    }

    private boolean a(Header[] headerArr) {
        for (Header header : headerArr) {
            if (header.getName().equalsIgnoreCase(HttpCatalogs.HEADER_CONTENT_ENCODING) && header.getValue().equals("gzip")) {
                return true;
            }
        }
        return false;
    }

    private void a(StatusLine statusLine, Header[] headerArr) {
        if (statusLine.getProtocolVersion().equals(HttpVersion.HTTP_1_0)) {
            closeUaConnectionOnEmpty();
            return;
        }
        for (Header header : headerArr) {
            if (HttpCatalogs.HEADER_CONNECTION.equalsIgnoreCase(header.getName()) && "close".equals(header.getValue())) {
                closeUaConnectionOnEmpty();
                return;
            }
        }
    }

    private void a(StatusLine statusLine, Header[] headerArr, ResponseBody responseBody, List<MSHTTPProxyResponseInterceptor> list) throws IOException, CancelException {
        InputStream byteStream = responseBody.byteStream();
        if (a(headerArr)) {
            byteStream = Okio.buffer(new GzipSource(responseBody.source())).inputStream();
            headerArr = b(headerArr);
            enableGzipEncoding();
        }
        for (MSHTTPProxyResponseInterceptor mSHTTPProxyResponseInterceptor : list) {
            statusLine = mSHTTPProxyResponseInterceptor.doIntercept(statusLine);
            headerArr = mSHTTPProxyResponseInterceptor.doIntercept(headerArr);
        }
        MicroServer.Logger.d(LOGTAG, "startResponse with interceptor");
        startResponse(statusLine, Arrays.asList(headerArr));
        try {
            byte[] bArr = new byte[8192];
            while (true) {
                int read = byteStream.read(bArr);
                if (read > 0) {
                    if (!this.n) {
                        MSHTTPProxyResponseInterceptor.BytePack bytePack = new MSHTTPProxyResponseInterceptor.BytePack(bArr, 0, read);
                        for (MSHTTPProxyResponseInterceptor mSHTTPProxyResponseInterceptor2 : list) {
                            if (bytePack != null) {
                                bytePack = mSHTTPProxyResponseInterceptor2.doIntercept(bytePack);
                            }
                        }
                        if (bytePack != null) {
                            writeResponseData(bytePack.buffer, bytePack.offset, bytePack.length);
                        }
                    } else {
                        throw new CancelException();
                    }
                } else {
                    MSHTTPProxyResponseInterceptor.BytePack bytePack2 = new MSHTTPProxyResponseInterceptor.BytePack(bArr, 0, 0);
                    Iterator<MSHTTPProxyResponseInterceptor> it = list.iterator();
                    while (it.hasNext()) {
                        bytePack2 = it.next().end(bytePack2);
                    }
                    if (bytePack2 != null) {
                        MicroServer.Logger.d(LOGTAG, "final. writeResponseData. len=" + bytePack2.length);
                        writeResponseData(bytePack2.buffer, bytePack2.offset, bytePack2.length);
                    }
                    MicroServer.Logger.d(LOGTAG, "closeResponse");
                    closeResponse();
                    Utils.closeQuietly(byteStream);
                    a(statusLine, headerArr);
                    return;
                }
            }
        } catch (Throwable th) {
            Utils.closeQuietly(byteStream);
            throw th;
        }
    }

    private Header[] b(Header[] headerArr) {
        ArrayList arrayList = new ArrayList();
        for (Header header : headerArr) {
            if (!header.getName().equalsIgnoreCase(HttpCatalogs.HEADER_CONTENT_ENCODING) || !header.getValue().equals("gzip")) {
                arrayList.add(header);
            }
        }
        return (Header[]) arrayList.toArray(new Header[arrayList.size()]);
    }

    private void b(ResponseBody responseBody) throws IOException, CancelException, InterruptedException {
        MicroServer.Logger.d(LOGTAG, "respondBody");
        InputStream byteStream = responseBody.byteStream();
        try {
            byte[] bArr = new byte[8192];
            while (true) {
                int read = byteStream.read(bArr);
                if (read > 0) {
                    if (!this.n) {
                        a(bArr, read);
                        bArr = new byte[8192];
                    } else {
                        throw new CancelException();
                    }
                } else {
                    i();
                    return;
                }
            }
        } finally {
            Utils.closeQuietly(byteStream);
        }
    }

    private void a(StatusLine statusLine, Header[] headerArr, ResponseBody responseBody) throws InterruptedException, CancelException, IOException {
        MicroServer.Logger.d(LOGTAG, "startResponse without interceptor");
        HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter(statusLine);
        if (AbstractMSModuleImpl.isForceHttp11()) {
            httpHeaderWriter = new HttpHeaderWriter(new BasicStatusLine(ProtocolVersion.HTTP_1_1, statusLine.getStatusCode(), statusLine.getReasonPhrase()));
        }
        httpHeaderWriter.addAll(headerArr);
        boolean z = false;
        String headerValue = httpHeaderWriter.getHeaderValue(HttpCatalogs.HEADER_TRANSFER_ENCODING);
        if (headerValue != null && headerValue.equalsIgnoreCase("chunked")) {
            z = true;
        }
        if (statusLine.getProtocolVersion().equals(HttpVersion.HTTP_1_0)) {
            if (z) {
                httpHeaderWriter.remove(HttpCatalogs.HEADER_TRANSFER_ENCODING);
            }
            MicroServer.Logger.d(LOGTAG, "----- startResponse HTTP/1.0 -----");
            MicroServer.Logger.d(LOGTAG, new String(httpHeaderWriter.toByteArray()));
            getOutQueue().put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
            a(responseBody);
        } else {
            MicroServer.Logger.d(LOGTAG, "----- startResponse HTTP/1.1 -----");
            MicroServer.Logger.d(LOGTAG, new String(httpHeaderWriter.toByteArray()));
            getOutQueue().put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
            if (z) {
                b(responseBody);
            } else {
                a(responseBody);
            }
        }
        a(statusLine, headerArr);
    }

    private void a(byte[] bArr, int i) throws InterruptedException {
        getOutQueue().put(ByteBuffer.wrap((Integer.toHexString(i) + HttpCatalogs.CRLF).getBytes()));
        getOutQueue().put(ByteBuffer.wrap(bArr, 0, i));
        getOutQueue().put(ByteBuffer.wrap(HttpCatalogs.CRLF.getBytes()));
    }

    /* JADX WARN: Code restructure failed: missing block: B:11:0x0030, code lost:
    
        throw new com.uievolution.microserver.modules.CancelException();
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private void a(okhttp3.ResponseBody r7) throws java.io.IOException, com.uievolution.microserver.modules.CancelException, java.lang.InterruptedException {
        /*
            r6 = this;
            com.uievolution.systemlogger.Logger r0 = com.uievolution.microserver.MicroServer.Logger
            java.lang.String r1 = "HttpProxyModule"
            java.lang.String r2 = "respondBody"
            r0.d(r1, r2)
            java.io.InputStream r7 = r7.byteStream()
            r0 = 8192(0x2000, float:1.148E-41)
            r1 = 0
            byte[] r2 = new byte[r0]     // Catch: java.lang.Throwable -> L3b
        L12:
            int r3 = r7.read(r2)     // Catch: java.lang.Throwable -> L3b
            if (r3 <= 0) goto L31
            boolean r4 = r6.n     // Catch: java.lang.Throwable -> L3b
            if (r4 != 0) goto L2b
            com.uievolution.microserver.OutBlockingQueue r4 = r6.getOutQueue()     // Catch: java.lang.Throwable -> L3b
            r5 = 0
            java.nio.ByteBuffer r2 = java.nio.ByteBuffer.wrap(r2, r5, r3)     // Catch: java.lang.Throwable -> L3b
            r4.put(r2)     // Catch: java.lang.Throwable -> L3b
            byte[] r2 = new byte[r0]     // Catch: java.lang.Throwable -> L3b
            goto L12
        L2b:
            com.uievolution.microserver.modules.CancelException r0 = new com.uievolution.microserver.modules.CancelException     // Catch: java.lang.Throwable -> L3b
            r0.<init>()     // Catch: java.lang.Throwable -> L3b
            throw r0     // Catch: java.lang.Throwable -> L3b
        L31:
            com.uievolution.microserver.utils.Utils.closeQuietly(r7)
            com.uievolution.microserver.utils.Utils.closeQuietly(r1)
            com.uievolution.microserver.utils.Utils.closeQuietly(r1)
            return
        L3b:
            r0 = move-exception
            com.uievolution.microserver.utils.Utils.closeQuietly(r7)
            com.uievolution.microserver.utils.Utils.closeQuietly(r1)
            com.uievolution.microserver.utils.Utils.closeQuietly(r1)
            goto L47
        L46:
            throw r0
        L47:
            goto L46
        */
        throw new UnsupportedOperationException("Method not decompiled: com.uievolution.microserver.modules.HttpProxyModule.a(okhttp3.ResponseBody):void");
    }

    private void a(Headers headers) {
        for (String str : headers.names()) {
            for (String str2 : headers.values(str)) {
                MicroServer.Logger.v(LOGTAG, str + ": " + headers.get(str));
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(List<Class<? extends MSHTTPProxyResponseInterceptor>> list) {
        this.p = list;
    }
}
