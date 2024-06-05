package com.uievolution.microserver;

import android.net.Uri;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.RequestLine;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.util.Iterator;
import java.util.List;
import org.slf4j.Marker;

/* loaded from: classes.dex */
public class HttpRequestInfo {
    private RequestLine a;
    private List<Header> b;

    public HttpRequestInfo(RequestLine requestLine, List<Header> list) {
        this.a = requestLine;
        this.b = list;
    }

    public boolean canAcceptGzipEncoding() {
        Header header = getHeader(HttpCatalogs.HEADER_ACCEPT_ENCODING);
        if (header == null) {
            return false;
        }
        String value = header.getValue();
        return value.indexOf(Marker.ANY_MARKER) >= 0 || value.indexOf("gzip") >= 0;
    }

    public int getContentLength() {
        Header header = getHeader(HttpCatalogs.HEADER_CONTENT_LENGTH);
        if (header == null) {
            return 0;
        }
        try {
            return Integer.parseInt(header.getValue());
        } catch (NumberFormatException e) {
            MicroServer.Logger.w("HttpRequestInfo", e);
            return 0;
        }
    }

    public Header getHeader(String str) {
        for (Header header : this.b) {
            if (header.getName().equalsIgnoreCase(str)) {
                return header;
            }
        }
        return null;
    }

    public List<Header> getHeaders() {
        return this.b;
    }

    public String getMethod() {
        return this.a.getMethod();
    }

    public String getQueries() {
        return Uri.parse(this.a.getUri()).getEncodedQuery();
    }

    public String getQuery(String str) {
        return Uri.parse(this.a.getUri()).getQueryParameter(str);
    }

    public RequestLine getRequestLine() {
        return this.a;
    }

    public String getRequestUri() {
        return this.a.getUri();
    }

    public boolean isConnectMethod() {
        return getMethod().equals(HttpCatalogs.METHOD_CONNECT);
    }

    public boolean isGetMethod() {
        return getMethod().equals("GET");
    }

    public boolean isOptionsMethod() {
        return getMethod().equals(HttpCatalogs.METHOD_OPTIONS);
    }

    public boolean isPostMethod() {
        return getMethod().equals(HttpCatalogs.METHOD_POST);
    }

    public String toString() {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(this.a.toString() + HttpCatalogs.CRLF);
        Iterator<Header> it = this.b.iterator();
        while (it.hasNext()) {
            stringBuffer.append(it.next().toString() + HttpCatalogs.CRLF);
        }
        return stringBuffer.toString();
    }
}
