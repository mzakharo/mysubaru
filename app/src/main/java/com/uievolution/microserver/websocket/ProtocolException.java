package com.uievolution.microserver.websocket;

import com.uievolution.microserver.MicroServerException;

/* loaded from: classes.dex */
public class ProtocolException extends MicroServerException {
    private static final long serialVersionUID = -8767515627402086284L;
    private int a;

    /* JADX INFO: Access modifiers changed from: package-private */
    public ProtocolException(int i) {
        this.a = -1;
        this.a = i;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public int a() {
        return this.a;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public ProtocolException(int i, String str) {
        super(str);
        this.a = -1;
        this.a = i;
    }
}
