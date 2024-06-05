package com.uievolution.microserver.interceptor.response;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.StatusLine;
import com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor;
import com.uievolution.microserver.utils.Utils;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;

/* loaded from: classes.dex */
public class TestResponseInterceptor implements MSHTTPProxyResponseInterceptor {
    static String b = "ms.httpproxy.TestResponseInterceptor";
    private boolean a = true;

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
        arrayList.add(new BasicHeader("interceptor", "TestResponseInterceptor"));
        return (Header[]) arrayList.toArray(new Header[arrayList.size()]);
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack end(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        return bytePack;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public boolean start(HttpRequestBase httpRequestBase, StatusLine statusLine, Header[] headerArr) {
        String query;
        return httpRequestBase.getURI().getHost().equals("dev-01.xevo.co.jp") && (query = httpRequestBase.getURI().getQuery()) != null && query.indexOf("TestResponseInterceptor") >= 0;
    }

    @Override // com.uievolution.microserver.modules.MSHTTPProxyResponseInterceptor
    public MSHTTPProxyResponseInterceptor.BytePack doIntercept(MSHTTPProxyResponseInterceptor.BytePack bytePack) {
        if (this.a) {
            byte[] bArr = bytePack.buffer;
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            try {
                try {
                    byteArrayOutputStream.write("HelloWorld".getBytes());
                    byteArrayOutputStream.write(bytePack.buffer, bytePack.offset, bytePack.length);
                    bArr = byteArrayOutputStream.toByteArray();
                } catch (IOException e) {
                    MicroServer.Logger.w(b, e);
                }
                Utils.closeQuietly(byteArrayOutputStream);
                bytePack.buffer = bArr;
                byteArrayOutputStream = null;
                bytePack.offset = 0;
                bytePack.length = bArr.length;
                this.a = false;
            } catch (Throwable th) {
                Utils.closeQuietly(byteArrayOutputStream);
                throw th;
            }
        }
        return bytePack;
    }
}
