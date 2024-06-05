package com.uievolution.microserver.interceptor.httpsrequest;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modules.MSHTTPSProxyRequestInterceptor;

/* loaded from: classes.dex */
public class LocalHttpsInterceptor implements MSHTTPSProxyRequestInterceptor {
    @Override // com.uievolution.microserver.modules.MSHTTPSProxyRequestInterceptor
    public MSHTTPSProxyRequestInterceptor.HostPort doIntercept(MSHTTPSProxyRequestInterceptor.HostPort hostPort) {
        MicroServer microServer = MicroServer.getInstance();
        if (microServer.isRequestToMe(hostPort.host, hostPort.port)) {
            hostPort.host = "127.0.0.1";
            if (hostPort.port == microServer.getHttpPort()) {
                hostPort.port = microServer.getWiFiHttpPort();
            } else {
                hostPort.port = microServer.getWiFiHttpsPort();
            }
        }
        return hostPort;
    }
}
