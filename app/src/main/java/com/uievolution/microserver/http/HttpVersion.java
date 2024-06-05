package com.uievolution.microserver.http;

/* loaded from: classes.dex */
public class HttpVersion extends ProtocolVersion {
    public static final HttpVersion HTTP_1_0 = new HttpVersion(1, 0);
    public static final HttpVersion HTTP_1_1 = new HttpVersion(1, 1);

    public HttpVersion(int i, int i2) {
        super("HTTP", i, i2);
    }
}
