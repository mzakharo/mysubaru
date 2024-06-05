package com.uievolution.microserver.modules;

import com.uievolution.microserver.http.HttpRequestBase;

/* loaded from: classes.dex */
public interface MSHTTPProxyRequestInterceptor {
    HttpRequestBase doIntercept(HttpRequestBase httpRequestBase) throws HttpException;
}
