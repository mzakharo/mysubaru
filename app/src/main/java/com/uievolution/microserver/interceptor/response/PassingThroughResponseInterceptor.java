package com.uievolution.microserver.interceptor.response;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor;
import java.util.ArrayList;

/* loaded from: classes.dex */
public class PassingThroughResponseInterceptor implements MSHTTPProxyResponseInterceptor {
    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public StatusLine doIntercept(StatusLine statusLine) {
        return statusLine;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack doIntercept(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        return bytePack;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public Header[] doIntercept(Header[] headerArr) {
        ArrayList arrayList = new ArrayList();
        for (Header header : headerArr) {
            arrayList.add(header);
        }
        arrayList.add(new BasicHeader("interceptor", "PassingThroughInterceptor"));
        return (Header[]) arrayList.toArray(new Header[arrayList.size()]);
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack end(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        return bytePack;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public boolean start(HttpRequestBase httpRequestBase, StatusLine statusLine, Header[] headerArr) {
        String query;
        return httpRequestBase.getURI().getHost().equals("dev-01.xevo.co.jp") && (query = httpRequestBase.getURI().getQuery()) != null && query.indexOf("PassingThroughInterceptor") >= 0;
    }
}
