package com.uievolution.microserver.http;

/* loaded from: classes.dex */
public class BasicRequestLine implements RequestLine {
    private final String a;
    private final String b;
    private final ProtocolVersion c;

    public BasicRequestLine() {
        this.a = "GET";
        this.b = "http://www.example.com";
        this.c = HttpVersion.HTTP_1_1;
    }

    @Override // com.uievolution.microserver.http.RequestLine
    public String getMethod() {
        return this.a;
    }

    @Override // com.uievolution.microserver.http.RequestLine
    public ProtocolVersion getProtocolVersion() {
        return this.c;
    }

    @Override // com.uievolution.microserver.http.RequestLine
    public String getUri() {
        return this.b;
    }

    public String toString() {
        return this.a + " " + this.b + " " + this.c;
    }

    public BasicRequestLine(String str, String str2, ProtocolVersion protocolVersion) {
        this.a = str;
        this.b = str2;
        this.c = protocolVersion;
    }
}
