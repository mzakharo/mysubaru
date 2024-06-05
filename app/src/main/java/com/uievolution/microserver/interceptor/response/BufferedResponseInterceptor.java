package com.uievolution.microserver.interceptor.response;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

/* loaded from: classes.dex */
public class BufferedResponseInterceptor implements MSHTTPProxyResponseInterceptor {
    private ByteArrayOutputStream a;

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public StatusLine doIntercept(StatusLine statusLine) {
        return statusLine;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public Header[] doIntercept(Header[] headerArr) {
        ArrayList arrayList = new ArrayList();
        for (Header header : headerArr) {
            arrayList.add(header);
        }
        arrayList.add(new BasicHeader("interceptor", "BufferingInterceptor"));
        return (Header[]) arrayList.toArray(new Header[arrayList.size()]);
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack end(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        if (bytePack != null) {
            this.a.write(bytePack.buffer, bytePack.offset, bytePack.length);
        }
        byte[] byteArray = this.a.toByteArray();
        return new MSHTTPProxyResponseInterceptor.BytePack(byteArray, 0, byteArray.length);
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public boolean start(HttpRequestBase httpRequestBase, StatusLine statusLine, Header[] headerArr) {
        String query;
        if (!httpRequestBase.getURI().getHost().equals("dev-01.xevo.co.jp") || (query = httpRequestBase.getURI().getQuery()) == null || query.indexOf("BufferingInterceptor") < 0) {
            return false;
        }
        this.a = new ByteArrayOutputStream();
        return true;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack doIntercept(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        if (bytePack == null) {
            return bytePack;
        }
        this.a.write(bytePack.buffer, bytePack.offset, bytePack.length);
        return null;
    }
}
