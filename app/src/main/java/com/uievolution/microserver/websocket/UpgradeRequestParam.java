package com.uievolution.microserver.websocket;

/* loaded from: classes.dex */
public class UpgradeRequestParam {
    private final String a;
    private final String b;

    public UpgradeRequestParam(String str, String str2, String str3) {
        this.a = str;
        this.b = str3;
    }

    public String getKey() {
        return this.a;
    }

    public String getSubProtocols() {
        return this.b;
    }
}
