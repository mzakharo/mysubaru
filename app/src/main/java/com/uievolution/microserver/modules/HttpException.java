package com.uievolution.microserver.modules;

import com.uievolution.microserver.MicroServerException;

/* loaded from: classes.dex */
public class HttpException extends MicroServerException {
    private static final long serialVersionUID = 9185189038719630976L;
    private int a;

    public HttpException(int i) {
        super("");
        this.a = i;
    }

    public int getStatusCode() {
        return this.a;
    }

    public HttpException(int i, String str) {
        super(str);
        this.a = i;
    }
}
