package com.uievolution.microserver.http;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.net.URI;
import java.net.URISyntaxException;

/* loaded from: classes.dex */
public class HttpRequestBase {
    public static final String SCHEME_FAKE = "fake";
    private RequestLine a;
    private Header[] b;
    private byte[] c;

    public HttpRequestBase() {
        this.a = new BasicRequestLine();
        this.b = new Header[0];
        this.c = null;
    }

    public Header[] getAllHeaders() {
        return this.b;
    }

    public byte[] getBody() {
        return this.c;
    }

    public Header getFirstHeader(String str) {
        for (Header header : this.b) {
            if (header.getName().equalsIgnoreCase(str)) {
                return header;
            }
        }
        return null;
    }

    public String getMethod() {
        return this.a.getMethod();
    }

    public ProtocolVersion getProtocolVersoin() {
        return this.a.getProtocolVersion();
    }

    public RequestLine getRequestLine() {
        return this.a;
    }

    public URI getURI() {
        try {
            if (HttpCatalogs.METHOD_CONNECT.equals(this.a.getMethod())) {
                return new URI("fake://" + this.a.getUri());
            }
            return new URI(this.a.getUri());
        } catch (URISyntaxException e) {
            MicroServer.Logger.w("HttpRequestBase", e);
            return null;
        }
    }

    public void setURI(URI uri) {
        this.a = new BasicRequestLine(this.a.getMethod(), uri.toString(), this.a.getProtocolVersion());
    }

    public HttpRequestBase(RequestLine requestLine, Header[] headerArr) {
        this.a = requestLine;
        this.b = headerArr;
        this.c = null;
    }

    public HttpRequestBase(RequestLine requestLine, Header[] headerArr, byte[] bArr) {
        this.a = requestLine;
        this.b = headerArr;
        this.c = bArr;
    }
}
