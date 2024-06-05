package com.uievolution.microserver;

import android.content.Context;
import android.net.Uri;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.BasicStatusLine;
import com.uievolution.microserver.http.EnglishReasonPhraseCatalog;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.HttpStatus;
import com.uievolution.microserver.http.HttpVersion;
import com.uievolution.microserver.http.ProtocolVersion;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.HttpException;
import com.uievolution.microserver.modules.HttpProxyModule;
import com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor;
import com.uievolution.microserver.modules.NotFoundModule;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.Utils;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.WritableByteChannel;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPOutputStream;
import org.slf4j.Marker;

/* loaded from: classes.dex */
public abstract class AbstractMSModuleImpl implements MSModule {
    private static boolean k;
    private static boolean l;
    public static final Header[] sCommonResponseHeaders = {new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache, no-store, must-revalidate"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")};
    private HttpRequestInfo a;
    private InBlockingQueue b;
    private OutBlockingQueue c;
    private UAConnectionCloser e;
    private String f;
    private DigestAuth h;
    private c i;
    private byte[] d = new byte[0];
    private boolean g = false;
    private boolean j = false;

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public static class b implements c {
        static final /* synthetic */ boolean g = true;
        private boolean a;
        private final OutBlockingQueue b;
        private ByteArrayOutputStream c;
        private GZIPOutputStream d;
        private HttpHeaderWriter e;
        private boolean f = false;

        public b(boolean z, OutBlockingQueue outBlockingQueue) {
            this.a = z;
            this.b = outBlockingQueue;
            if (z) {
                try {
                    this.c = new ByteArrayOutputStream();
                    this.d = new GZIPOutputStream(this.c);
                } catch (IOException e) {
                    this.a = false;
                    MicroServer.Logger.w("AbstractMSModule", e);
                }
            }
        }

        private void a() throws InterruptedException {
            this.b.put(ByteBuffer.wrap(HttpCatalogs.CHUNK_FINAL_STRING.getBytes()));
        }

        private void b(byte[] bArr, int i, int i2) throws InterruptedException {
            if (i2 <= 0) {
                return;
            }
            this.b.put(ByteBuffer.wrap((Integer.toHexString(i2) + HttpCatalogs.CRLF).getBytes()));
            this.b.put(ByteBuffer.wrap(bArr, i, i2));
            this.b.put(ByteBuffer.wrap(HttpCatalogs.CRLF.getBytes()));
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean closeResponse() {
            try {
                try {
                    if (!this.f) {
                        this.e.setContentLength(0);
                        b();
                    } else {
                        if (this.a) {
                            Utils.closeQuietly(this.d);
                            byte[] byteArray = this.c.toByteArray();
                            b(byteArray, 0, byteArray.length);
                        }
                        a();
                    }
                    Utils.closeQuietly(this.d);
                    Utils.closeQuietly(this.c);
                    return true;
                } catch (InterruptedException e) {
                    MicroServer.Logger.w("AbstractMSModule", e);
                    Utils.closeQuietly(this.d);
                    Utils.closeQuietly(this.c);
                    return false;
                }
            } catch (Throwable th) {
                Utils.closeQuietly(this.d);
                Utils.closeQuietly(this.c);
                throw th;
            }
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean writeResponseData(byte[] bArr, int i, int i2) {
            byte[] bArr2;
            if (i2 <= 0) {
                return true;
            }
            try {
                if (!this.f) {
                    this.e.set(HttpCatalogs.HEADER_TRANSFER_ENCODING, "chunked");
                    this.e.removeContentLength();
                    if (this.a) {
                        this.e.set(HttpCatalogs.HEADER_CONTENT_ENCODING, "gzip");
                    }
                    b();
                }
                if (this.a) {
                    bArr2 = a(bArr, i, i2);
                    i2 = bArr2.length;
                } else {
                    byte[] bArr3 = new byte[i2];
                    System.arraycopy(bArr, i, bArr3, 0, i2);
                    bArr2 = bArr3;
                }
                b(bArr2, 0, i2);
                return true;
            } catch (IOException e) {
                MicroServer.Logger.w("AbstractMSModule", e);
                return false;
            } catch (InterruptedException e2) {
                MicroServer.Logger.w("AbstractMSModule", e2);
                return false;
            }
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean a(StatusLine statusLine, Header[] headerArr) {
            if (!g && !statusLine.getProtocolVersion().equals(HttpVersion.HTTP_1_1)) {
                throw new AssertionError();
            }
            if (this.f) {
                MicroServer.Logger.w("AbstractMSModule", "startResponse() has been called. Don't call twice.");
                return false;
            }
            HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter(statusLine);
            this.e = httpHeaderWriter;
            httpHeaderWriter.addAll(headerArr);
            return true;
        }

        private void b() throws InterruptedException {
            if (!g && this.f) {
                throw new AssertionError();
            }
            MicroServer.Logger.d("AbstractMSModule", "----- Microserver Start Response -----");
            MicroServer.Logger.d("AbstractMSModule", this.e.toString());
            this.b.put(ByteBuffer.wrap(this.e.toByteArray()));
            this.f = true;
        }

        private byte[] a(byte[] bArr, int i, int i2) throws IOException {
            this.d.write(bArr, i, i2);
            byte[] byteArray = this.c.toByteArray();
            this.c.reset();
            return byteArray;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public interface c {
        boolean a(StatusLine statusLine, Header[] headerArr);

        boolean closeResponse();

        boolean writeResponseData(byte[] bArr, int i, int i2);
    }

    static {
        k = false;
        l = false;
        k = MicroServer.getInstance().getProperties().getBoolean("abstractmodule.http_1_0", false);
        l = MicroServer.getInstance().getProperties().getBoolean("abstractmodule.force_http_1_1", false);
    }

    static Header[] b() {
        return sCommonResponseHeaders;
    }

    private void c() throws HttpException {
        List<MSHTTPProxyRequestInterceptor> h = MicroServer.getInstance().h();
        if (h == null || h.isEmpty()) {
            return;
        }
        HttpRequestBase httpRequestBase = new HttpRequestBase(this.a.getRequestLine(), (Header[]) this.a.getHeaders().toArray(new Header[this.a.getHeaders().size()]), getWholeBody());
        Iterator<MSHTTPProxyRequestInterceptor> it = h.iterator();
        while (it.hasNext()) {
            httpRequestBase = it.next().doIntercept(httpRequestBase);
        }
        this.a = new HttpRequestInfo(httpRequestBase.getRequestLine(), Arrays.asList(httpRequestBase.getAllHeaders()));
        this.d = httpRequestBase.getBody();
    }

    private boolean d() {
        return this.h != null;
    }

    public static boolean isActiveClose() {
        return k;
    }

    public static boolean isForceHttp11() {
        return l;
    }

    public static void setActiveClose(boolean z) {
        k = z;
    }

    @Override // com.uievolution.microserver.MSModule
    public void cancel() {
        this.j = true;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean closeResponse() {
        return closeResponse(false);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void closeUaConnectionNow() {
        this.e.closeNow();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void closeUaConnectionOnEmpty() {
        this.e.closeOnEmpty();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void disableGzipEncoding() {
        this.g = false;
    }

    protected abstract byte[] doStart();

    byte[] e() {
        int contentLength = this.a.getContentLength();
        if (contentLength == 0) {
            return new byte[0];
        }
        byte[] bArr = null;
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        WritableByteChannel newChannel = Channels.newChannel(byteArrayOutputStream);
        while (byteArrayOutputStream.size() < contentLength) {
            try {
                try {
                    newChannel.write(this.b.take());
                } catch (Exception e) {
                    MicroServer.Logger.d("AbstractMSModule", "exception", e);
                }
            } finally {
                Utils.closeQuietly(newChannel);
                Utils.closeQuietly(byteArrayOutputStream);
            }
        }
        bArr = byteArrayOutputStream.toByteArray();
        return bArr;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void enableGzipEncoding() {
        this.g = true;
    }

    @Override // com.uievolution.microserver.MSModule
    public void finished() {
    }

    public String getConnectionType() {
        return this.f;
    }

    public Context getContext() {
        return MicroServer.getInstance().getContext();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public InBlockingQueue getInQueue() {
        return this.b;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public OutBlockingQueue getOutQueue() {
        return this.c;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public HttpRequestInfo getRequestInfo() {
        return this.a;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public Uri getRequestUri() {
        return Uri.parse(getRequestInfo().getRequestUri());
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public UAConnectionCloser getUAConnectionCloser() {
        return this.e;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public byte[] getWholeBody() {
        return this.d;
    }

    @Override // com.uievolution.microserver.MSModule
    public void init(HttpRequestInfo httpRequestInfo, InBlockingQueue inBlockingQueue, OutBlockingQueue outBlockingQueue, UAConnectionCloser uAConnectionCloser, String str) {
        this.a = httpRequestInfo;
        this.b = inBlockingQueue;
        this.c = outBlockingQueue;
        this.e = uAConnectionCloser;
        this.f = str;
        this.j = false;
    }

    public boolean isCanceled() {
        return this.j;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean isDeleteMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_DELETE);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean isGetMethod() {
        return getRequestInfo().getMethod().equals("GET");
    }

    public boolean isGzipEncodingEnabled() {
        return this.g;
    }

    protected boolean isHeadMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_HEAD);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean isOptionsMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_OPTIONS);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean isPostMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_POST);
    }

    protected boolean isPutMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_PUT);
    }

    protected boolean isTraceMethod() {
        return getRequestInfo().getMethod().equals(HttpCatalogs.METHOD_TRACE);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void sendOptionsResponse(List<Header> list) {
        MicroServer.Logger.d("AbstractMSModule", "sendOptionsResponse");
        ArrayList arrayList = new ArrayList();
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, OPTIONS"));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_MAX_AGE, "86400"));
        for (Header header : list) {
            if (header.getName().equals(HttpCatalogs.HEADER_ACCESS_CONTROL_REQUEST_HEADERS)) {
                arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS, header.getValue()));
            }
        }
        sendResponse(200, (String) null, arrayList, (byte[]) null);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void sendResponse(int i) {
        sendResponse(i, null);
    }

    @Override // com.uievolution.microserver.MSModule
    public void setDigestAuth(DigestAuth digestAuth) {
        this.h = digestAuth;
    }

    @Override // com.uievolution.microserver.MSModule
    public byte[] start() {
        Header header;
        if (d() && ((header = getRequestInfo().getHeader(HttpCatalogs.HEADER_AUTHORIZATION)) == null || !this.h.a(getRequestInfo().getMethod(), header.getValue()))) {
            Header a2 = this.h.a();
            ArrayList arrayList = new ArrayList();
            arrayList.add(a2);
            sendResponse(HttpStatus.SC_UNAUTHORIZED, (String) null, arrayList, (byte[]) null);
            return null;
        }
        if (isOptionsMethod() && !(this instanceof NotFoundModule) && !(this instanceof HttpProxyModule)) {
            sendOptionsResponse(getRequestInfo().getHeaders());
            return null;
        }
        try {
            if (isPostMethod() || isPutMethod()) {
                this.d = e();
            }
            c();
            return doStart();
        } catch (HttpException e) {
            MicroServer.Logger.w("AbstractMSModule", e);
            sendResponse(e.getStatusCode());
            return null;
        } catch (Exception e2) {
            MicroServer.Logger.w("AbstractMSModule", e2);
            sendResponse(500);
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean startResponse(int i, List<Header> list) {
        return startResponse(new BasicStatusLine(getRequestInfo().getRequestLine().getProtocolVersion(), i, EnglishReasonPhraseCatalog.getReason(i)), list);
    }

    protected boolean writeResponseData(byte[] bArr) {
        if (bArr == null) {
            return true;
        }
        return writeResponseData(bArr, 0, bArr.length);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean closeResponse(boolean z) {
        MicroServer.Logger.i("AbstractMSModule", "closeResponse");
        boolean closeResponse = this.i.closeResponse();
        if (!closeResponse) {
            closeUaConnectionNow();
            return closeResponse;
        }
        if (z) {
            closeUaConnectionOnEmpty();
        } else if (k) {
            closeUaConnectionOnEmpty();
        }
        return closeResponse;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void sendResponse(int i, String str) {
        sendResponse(i, str, (Header[]) null, (byte[]) null);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean writeResponseData(byte[] bArr, int i, int i2) {
        MicroServer.Logger.i("AbstractMSModule", "writeResponseData");
        c cVar = this.i;
        if (cVar == null) {
            MicroServer.Logger.w("AbstractMSModule", "Call startResponse() is not called yet");
            return false;
        }
        boolean writeResponseData = cVar.writeResponseData(bArr, i, i2);
        if (!writeResponseData) {
            closeUaConnectionNow();
        }
        return writeResponseData;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void sendResponse(int i, String str, Header[] headerArr, byte[] bArr) {
        if (str == null) {
            str = EnglishReasonPhraseCatalog.getReason(i);
        }
        sendResponse(new BasicStatusLine(getRequestInfo().getRequestLine().getProtocolVersion(), i, str), headerArr, bArr);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean startResponse(int i, Header[] headerArr) {
        return startResponse(new BasicStatusLine(getRequestInfo().getRequestLine().getProtocolVersion(), i, EnglishReasonPhraseCatalog.getReason(i)), headerArr);
    }

    protected void sendResponse(int i, String str, List<Header> list, byte[] bArr) {
        if (str == null) {
            str = EnglishReasonPhraseCatalog.getReason(i);
        }
        sendResponse(new BasicStatusLine(getRequestInfo().getRequestLine().getProtocolVersion(), i, str), list, bArr);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean startResponse(StatusLine statusLine, List<Header> list) {
        return startResponse(statusLine, list != null ? (Header[]) list.toArray(new Header[list.size()]) : null);
    }

    protected boolean startResponse(StatusLine statusLine, Header[] headerArr) {
        MicroServer.Logger.i("AbstractMSModule", "startResponse");
        if (k) {
            statusLine = new BasicStatusLine(HttpVersion.HTTP_1_0, statusLine.getStatusCode(), statusLine.getReasonPhrase());
        }
        boolean z = false;
        if (isGzipEncodingEnabled() && getRequestInfo().canAcceptGzipEncoding()) {
            z = true;
        }
        if (statusLine.getProtocolVersion().equals(HttpVersion.HTTP_1_1)) {
            this.i = new b(z, getOutQueue());
        } else {
            this.i = new a(z, this.e, getOutQueue());
        }
        boolean a2 = this.i.a(statusLine, headerArr);
        if (!a2) {
            closeUaConnectionNow();
        }
        return a2;
    }

    protected void sendResponse(StatusLine statusLine, Header[] headerArr, byte[] bArr) {
        if (headerArr == null) {
            headerArr = b();
        }
        if (startResponse(statusLine, headerArr) && writeResponseData(bArr)) {
            closeResponse();
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public static class a implements c {
        private boolean a;
        private final UAConnectionCloser b;
        private final OutBlockingQueue c;
        private ByteArrayOutputStream d;
        private GZIPOutputStream e;

        public a(boolean z, UAConnectionCloser uAConnectionCloser, OutBlockingQueue outBlockingQueue) {
            this.a = z;
            this.b = uAConnectionCloser;
            this.c = outBlockingQueue;
            if (z) {
                try {
                    this.d = new ByteArrayOutputStream();
                    this.e = new GZIPOutputStream(this.d);
                } catch (IOException e) {
                    MicroServer.Logger.w("AbstractMSModule", e);
                    this.a = false;
                }
            }
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean a(StatusLine statusLine, Header[] headerArr) {
            HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter(statusLine);
            if (AbstractMSModuleImpl.l) {
                httpHeaderWriter = new HttpHeaderWriter(new BasicStatusLine(ProtocolVersion.HTTP_1_1, statusLine.getStatusCode(), statusLine.getReasonPhrase()));
            }
            httpHeaderWriter.addAll(headerArr);
            httpHeaderWriter.removeContentLength();
            httpHeaderWriter.remove(HttpCatalogs.HEADER_TRANSFER_ENCODING);
            if (this.a) {
                httpHeaderWriter.set(HttpCatalogs.HEADER_CONTENT_ENCODING, "gzip");
            }
            MicroServer.Logger.d("AbstractMSModule", "----- Microserver Start Response -----");
            MicroServer.Logger.d("AbstractMSModule", httpHeaderWriter.toString());
            try {
                this.c.put(ByteBuffer.wrap(httpHeaderWriter.toByteArray()));
                return true;
            } catch (InterruptedException e) {
                MicroServer.Logger.w("AbstractMSModule", e);
                return false;
            }
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean closeResponse() {
            this.b.closeOnEmpty();
            return true;
        }

        @Override // com.uievolution.microserver.AbstractMSModuleImpl.c
        public boolean writeResponseData(byte[] bArr, int i, int i2) {
            if (i2 <= 0) {
                return true;
            }
            try {
                if (this.a) {
                    byte[] a = a(bArr, i, i2);
                    this.c.put(ByteBuffer.wrap(a, 0, a.length));
                } else {
                    byte[] bArr2 = new byte[i2];
                    System.arraycopy(bArr, i, bArr2, 0, i2);
                    this.c.put(ByteBuffer.wrap(bArr2, 0, i2));
                }
                return true;
            } catch (IOException e) {
                MicroServer.Logger.w("AbstractMSModule", e);
                return false;
            } catch (InterruptedException e2) {
                MicroServer.Logger.w("AbstractMSModule", e2);
                return false;
            }
        }

        private byte[] a(byte[] bArr, int i, int i2) throws IOException {
            this.e.write(bArr, i, i2);
            byte[] byteArray = this.d.toByteArray();
            this.d.reset();
            return byteArray;
        }
    }

    protected void sendResponse(StatusLine statusLine, List<Header> list, byte[] bArr) {
        sendResponse(statusLine, list != null ? (Header[]) list.toArray(new Header[list.size()]) : null, bArr);
    }
}
