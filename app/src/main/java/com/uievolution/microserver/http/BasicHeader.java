package com.uievolution.microserver.http;

/* loaded from: classes.dex */
public class BasicHeader implements Header {
    private final String a;
    private final String b;

    public BasicHeader(String str, String str2) {
        this.a = str;
        this.b = str2;
    }

    public static BasicHeader parse(String str) throws ParseException {
        int indexOf = str.indexOf(58);
        if (indexOf >= 0) {
            String substring = str.substring(0, indexOf);
            int i = indexOf + 1;
            return new BasicHeader(substring, i < str.length() ? str.substring(i).trim() : "");
        }
        throw new ParseException("Invalid header. " + str);
    }

    @Override // com.uievolution.microserver.http.Header
    public String getName() {
        return this.a;
    }

    @Override // com.uievolution.microserver.http.Header
    public String getValue() {
        return this.b;
    }

    public String toString() {
        return this.a + ":" + this.b;
    }
}
