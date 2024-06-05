package com.uievolution.microserver;

import java.io.IOException;
import java.nio.ByteBuffer;

/* loaded from: classes.dex */
class f implements h {
    private final e a;

    /* JADX INFO: Access modifiers changed from: package-private */
    public f(e eVar, byte[] bArr) {
        this.a = eVar;
        if (bArr.length > 0) {
            eVar.a(ByteBuffer.wrap(bArr));
        }
    }

    @Override // com.uievolution.microserver.h
    public boolean a() {
        return true;
    }

    @Override // com.uievolution.microserver.h
    public boolean a(ByteBuffer byteBuffer) throws IOException {
        return false;
    }
}
