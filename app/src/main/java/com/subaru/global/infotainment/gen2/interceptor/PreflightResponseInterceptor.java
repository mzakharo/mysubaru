package com.subaru.global.infotainment.gen2.interceptor;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.util.ArrayList;

/* loaded from: classes.dex */
public class PreflightResponseInterceptor implements MSHTTPProxyResponseInterceptor {
    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public StatusLine doIntercept(StatusLine statusLine) {
        return statusLine;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack doIntercept(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        return bytePack;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack end(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        return bytePack;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public boolean start(HttpRequestBase httpRequestBase, StatusLine statusLine, Header[] headerArr) {
        return httpRequestBase.getMethod().equals(HttpCatalogs.METHOD_OPTIONS);
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public Header[] doIntercept(Header[] headerArr) {
        ArrayList arrayList = new ArrayList();
        boolean z = false;
        for (Header header : headerArr) {
            if (header.getName().equalsIgnoreCase(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS)) {
                arrayList.add(header);
                z = true;
            } else if (!header.getName().equalsIgnoreCase(HttpCatalogs.HEADER_ACCESS_CONTROL_MAX_AGE) && !header.getName().equalsIgnoreCase(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS)) {
                arrayList.add(header);
            }
        }
        if (!z) {
            arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS, HttpCatalogs.HEADER_AUTHORIZATION));
        }
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_MAX_AGE, "86400"));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
        return (Header[]) arrayList.toArray(new Header[arrayList.size()]);
    }
}
