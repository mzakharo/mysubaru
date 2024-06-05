package com.uievolution.microserver.interceptor.request;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor;
import java.net.URI;
import java.net.URISyntaxException;

/* loaded from: classes.dex */
public class SslEmulator implements MSHTTPProxyRequestInterceptor {
    static String a = "ms.intp.req.HttpsConv";

    @Override // com.uievolution.microserver.modules.MSHTTPProxyRequestInterceptor
    public HttpRequestBase doIntercept(HttpRequestBase httpRequestBase) {
        URI uri = httpRequestBase.getURI();
        if (uri.getQuery() != null && uri.getQuery().contains("ssl=true")) {
            StringBuilder sb = new StringBuilder();
            boolean z = false;
            for (String str : uri.getQuery().split("\\&")) {
                if (str.equals("ssl=true")) {
                    z = true;
                } else {
                    if (sb.length() != 0) {
                        sb.append('&');
                    }
                    sb.append(str);
                }
            }
            if (z) {
                try {
                    uri = new URI(Const.HTTPS, uri.getUserInfo(), uri.getHost(), uri.getPort(), uri.getPath(), sb.length() > 0 ? sb.toString() : null, uri.getFragment());
                } catch (URISyntaxException e) {
                    MicroServer.Logger.w(a, e);
                }
                MicroServer.Logger.d(a, "after ssl URI:" + uri);
                httpRequestBase.setURI(uri);
            }
        }
        return httpRequestBase;
    }
}
