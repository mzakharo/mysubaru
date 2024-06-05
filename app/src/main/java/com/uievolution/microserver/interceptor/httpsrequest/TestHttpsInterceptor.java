package com.uievolution.microserver.interceptor.httpsrequest;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modules.MSHTTPSProxyRequestInterceptor;

/* loaded from: classes.dex */
public class TestHttpsInterceptor implements MSHTTPSProxyRequestInterceptor {
    @Override // com.uievolution.microserver.modules.MSHTTPSProxyRequestInterceptor
    public MSHTTPSProxyRequestInterceptor.HostPort doIntercept(MSHTTPSProxyRequestInterceptor.HostPort hostPort) {
        if (hostPort.host.equals("www.uievolution.com") && hostPort.port == 443) {
            hostPort.host = "dev-01.xevo.co.jp";
            hostPort.port = MicroServer.DEFAULT_LWIP_PORT_HTTPS;
        }
        return hostPort;
    }
}
