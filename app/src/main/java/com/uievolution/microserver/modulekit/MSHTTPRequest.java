package com.uievolution.microserver.modulekit;

import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.http.Header;
import java.util.List;

/* loaded from: classes.dex */
public interface MSHTTPRequest {
    List<Header> getHeaders();

    byte[] getHttpBody();

    String getMethod();

    HttpRequestInfo getRequestInfo();
}
