package com.uievolution.microserver.modules;

import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpRequestBase;
import com.uievolution.microserver.http.StatusLine;

/* loaded from: classes.dex */
public interface MSHTTPProxyResponseInterceptor {
    StatusLine doIntercept(StatusLine statusLine);

    BytePack doIntercept(BytePack bytePack);

    Header[] doIntercept(Header[] headerArr);

    BytePack end(BytePack bytePack);

    boolean start(HttpRequestBase httpRequestBase, StatusLine statusLine, Header[] headerArr);

    /* loaded from: classes.dex */
    public static class BytePack {
        public byte[] buffer;
        public int length;
        public int offset;

        public BytePack(byte[] bArr, int i, int i2) {
            this.buffer = bArr;
            this.offset = i;
            this.length = i2;
        }

        public BytePack() {
        }
    }
}
