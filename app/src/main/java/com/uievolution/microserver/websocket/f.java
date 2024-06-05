package com.uievolution.microserver.websocket;

import java.nio.ByteBuffer;

/* loaded from: classes.dex */
class f extends c {
    /* JADX INFO: Access modifiers changed from: package-private */
    public f(int i) {
        super(i);
    }

    @Override
    public // com.uievolution.microserver.websocket.c
    int a() {
        return 1;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String f() throws ProtocolException {
        return d.b(ByteBuffer.wrap(b()));
    }
}
