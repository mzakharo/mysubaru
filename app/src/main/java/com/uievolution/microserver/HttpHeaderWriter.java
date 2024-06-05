package com.uievolution.microserver;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.RequestLine;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* loaded from: classes.dex */
public class HttpHeaderWriter {
    private final String a;
    private final List<Header> b = new ArrayList();

    public HttpHeaderWriter(StatusLine statusLine) {
        this.a = a(statusLine);
    }

    static String a(StatusLine statusLine) {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(statusLine.getProtocolVersion().toString());
        stringBuffer.append(" ");
        stringBuffer.append(statusLine.getStatusCode());
        stringBuffer.append(" ");
        stringBuffer.append(statusLine.getReasonPhrase());
        return stringBuffer.toString();
    }

    public void add(Header header) {
        this.b.add(header);
    }

    public void addAll(Header[] headerArr) {
        if (headerArr != null) {
            for (Header header : headerArr) {
                this.b.add(header);
            }
        }
    }

    public void addContentLength(byte[] bArr) {
        addContentLength(bArr != null ? bArr.length : 0);
    }

    public Header getHeader(String str) {
        for (Header header : this.b) {
            if (header.getName().equalsIgnoreCase(str)) {
                return header;
            }
        }
        return null;
    }

    public String getHeaderValue(String str) {
        Header header = getHeader(str);
        if (header != null) {
            return header.getValue();
        }
        return null;
    }

    public boolean hasContentLength() {
        return getHeader(HttpCatalogs.HEADER_CONTENT_LENGTH) != null;
    }

    public boolean hasHeader(String str) {
        return getHeader(str) != null;
    }

    public boolean remove(String str) {
        Iterator<Header> it = this.b.iterator();
        boolean z = false;
        while (it.hasNext()) {
            if (it.next().getName().equalsIgnoreCase(str)) {
                it.remove();
                z = true;
            }
        }
        return z;
    }

    public void removeContentLength() {
        remove(HttpCatalogs.HEADER_CONTENT_LENGTH);
    }

    public void set(String str, String str2) {
        remove(str);
        add(str, str2);
    }

    public void setContentLength(int i) {
        removeContentLength();
        addContentLength(i);
    }

    /* JADX WARN: Removed duplicated region for block: B:27:0x007d A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public byte[] toByteArray() {
        /*
            r8 = this;
            java.lang.String r0 = "\r\n"
            java.io.ByteArrayOutputStream r1 = new java.io.ByteArrayOutputStream
            r1.<init>()
            r2 = 0
            java.io.OutputStreamWriter r3 = new java.io.OutputStreamWriter     // Catch: java.lang.Throwable -> L68 java.io.IOException -> L6a
            java.lang.String r4 = "UTF-8"
            r3.<init>(r1, r4)     // Catch: java.lang.Throwable -> L68 java.io.IOException -> L6a
            java.lang.StringBuilder r4 = new java.lang.StringBuilder     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r4.<init>()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r5 = r8.a     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r4.append(r5)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r4.append(r0)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r4 = r4.toString()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r3.write(r4)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.util.List<com.uievolution.microserver.http.Header> r4 = r8.b     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.util.Iterator r4 = r4.iterator()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
        L29:
            boolean r5 = r4.hasNext()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            if (r5 == 0) goto L58
            java.lang.Object r5 = r4.next()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            com.uievolution.microserver.http.Header r5 = (com.uievolution.microserver.http.Header) r5     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.StringBuilder r6 = new java.lang.StringBuilder     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r6.<init>()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r7 = r5.getName()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r6.append(r7)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r7 = ": "
            r6.append(r7)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r5 = r5.getValue()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r6.append(r5)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r6.append(r0)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            java.lang.String r5 = r6.toString()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r3.write(r5)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            goto L29
        L58:
            r3.write(r0)     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r3.flush()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            byte[] r2 = r1.toByteArray()     // Catch: java.io.IOException -> L66 java.lang.Throwable -> L79
            r3.close()     // Catch: java.io.IOException -> L78
            goto L78
        L66:
            r0 = move-exception
            goto L6c
        L68:
            r0 = move-exception
            goto L7b
        L6a:
            r0 = move-exception
            r3 = r2
        L6c:
            com.uievolution.systemlogger.Logger r1 = com.uievolution.microserver.MicroServer.Logger     // Catch: java.lang.Throwable -> L79
            java.lang.String r4 = "HttpHeaderWriter"
            r1.w(r4, r0)     // Catch: java.lang.Throwable -> L79
            if (r3 == 0) goto L78
            r3.close()     // Catch: java.io.IOException -> L78
        L78:
            return r2
        L79:
            r0 = move-exception
            r2 = r3
        L7b:
            if (r2 == 0) goto L80
            r2.close()     // Catch: java.io.IOException -> L80
        L80:
            goto L82
        L81:
            throw r0
        L82:
            goto L81
        */
        throw new UnsupportedOperationException("Method not decompiled: com.uievolution.microserver.HttpHeaderWriter.toByteArray():byte[]");
    }

    public String toString() {
        try {
            return new String(toByteArray(), "UTF-8");
        } catch (UnsupportedEncodingException unused) {
            return "";
        }
    }

    public void add(String str, String str2) {
        this.b.add(new BasicHeader(str, str2));
    }

    public void addAll(List<Header> list) {
        if (list != null) {
            this.b.addAll(list);
        }
    }

    public void addContentLength(int i) {
        this.b.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, Integer.toString(i)));
    }

    public HttpHeaderWriter(RequestLine requestLine) {
        this.a = a(requestLine);
    }

    static String a(RequestLine requestLine) {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(requestLine.getMethod());
        stringBuffer.append(" ");
        stringBuffer.append(requestLine.getUri().toString());
        stringBuffer.append(" ");
        stringBuffer.append(requestLine.getProtocolVersion().toString());
        return stringBuffer.toString();
    }

    public HttpHeaderWriter(String str) {
        this.a = str;
    }
}
