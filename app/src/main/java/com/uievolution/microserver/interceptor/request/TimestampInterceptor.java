package com.uievolution.microserver.interceptor.request;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.modules.HttpException;
import com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor;
import java.net.URI;

/* loaded from: classes.dex */
public class TimestampInterceptor implements MSHTTPProxyRequestInterceptor {
    @Override // com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor
    public HttpRequestBase doIntercept(HttpRequestBase httpRequestBase) throws HttpException {
        String path;
        String query;
        URI uri = httpRequestBase.getURI();
        if ((!uri.isAbsolute() || MicroServer.DEFAULT_LWIP_ADDR.equals(uri.getHost())) && (path = uri.getPath()) != null && path.startsWith("/timestamp") && (query = uri.getQuery()) != null && query.indexOf("token=invalid_token") >= 0) {
            throw new HttpException(500);
        }
        return httpRequestBase;
    }
}
