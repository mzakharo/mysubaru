package com.uievolution.microserver.modulekit;

import com.uievolution.microserver.http.Header;

/* loaded from: classes.dex */
public interface MSHTTPResponder {
    void closeResponse();

    void closeResponse(boolean z);

    void enableGzipEncoding();

    boolean isResponseStarted();

    boolean startResponse(int i, Header[] headerArr);

    boolean writeResponseData(byte[] bArr);

    boolean writeResponseData(byte[] bArr, int i, int i2);
}
