package com.uievolution.microserver.modules;

/* loaded from: classes.dex */
public interface MSHTTPSProxyRequestInterceptor {

    /* loaded from: classes.dex */
    public static class HostPort {
        public String host;
        public int port;

        public HostPort(String str, int i) {
            this.host = str;
            this.port = i;
        }

        public String toString() {
            return this.host + ":" + this.port;
        }
    }

    HostPort doIntercept(HostPort hostPort);
}
