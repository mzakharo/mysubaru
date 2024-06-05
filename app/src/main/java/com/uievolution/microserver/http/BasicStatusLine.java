package com.uievolution.microserver.http;

import org.apache.log4j.varia.ExternallyRolledFileAppender;

/* loaded from: classes.dex */
public class BasicStatusLine implements StatusLine {
    private final ProtocolVersion a;
    private final int b;
    private final String c;

    public BasicStatusLine() {
        this.a = HttpVersion.HTTP_1_1;
        this.b = 200;
        this.c = ExternallyRolledFileAppender.OK;
    }

    @Override // com.uievolution.microserver.http.StatusLine
    public ProtocolVersion getProtocolVersion() {
        return this.a;
    }

    @Override // com.uievolution.microserver.http.StatusLine
    public String getReasonPhrase() {
        return this.c;
    }

    @Override // com.uievolution.microserver.http.StatusLine
    public int getStatusCode() {
        return this.b;
    }

    public String toString() {
        return this.a + " " + this.b + " " + this.c;
    }

    public BasicStatusLine(ProtocolVersion protocolVersion, int i, String str) {
        this.a = protocolVersion;
        this.b = i;
        this.c = str;
    }
}
