package com.uievolution.microserver.websocket;

import java.nio.ByteBuffer;

/* loaded from: classes.dex */
class b extends c {
    private int c;
    private String d;

    /* JADX INFO: Access modifiers changed from: package-private */
    public b(int i) {
        super(i);
        this.c = -1;
        this.d = null;
    }

    static boolean a(int i) {
        if (i <= 999) {
            return false;
        }
        if (3000 <= i && i <= 3999) {
            return true;
        }
        if (4000 <= i && i <= 4999) {
            return true;
        }
        if (5000 <= i) {
            return false;
        }
        return i == 1000 || i == 1001 || i == 1002 || i == 1003 || i == 1007 || i == 1008 || i == 1009 || i == 1010 || i == 1011;
    }

    @Override
    public // com.uievolution.microserver.websocket.c
    int a() {
        return 8;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public int f() throws ProtocolException {
        if (this.d == null) {
            h();
        }
        return this.c;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String g() throws ProtocolException {
        if (this.d == null) {
            h();
        }
        return this.d;
    }

    void h() throws ProtocolException {
        char c;
        ByteBuffer wrap = ByteBuffer.wrap(b());
        String str = "";
        if (2 <= wrap.remaining()) {
            c = wrap.getChar();
            if (a(c)) {
                if (wrap.hasRemaining()) {
                   // str = d.b(wrap);
                }
            } else {
                throw new ProtocolException(1002);
            }
        } else {
            c = 65535;
        }
        this.c = c;
        this.d = str;
    }
}
