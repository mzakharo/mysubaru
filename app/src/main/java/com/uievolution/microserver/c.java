package com.uievolution.microserver;

import java.io.IOException;
import java.nio.ByteBuffer;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class c implements h {
    private final e a;

    /* JADX INFO: Access modifiers changed from: package-private */
    public c(e eVar) {
        this.a = eVar;
    }

    @Override // com.uievolution.microserver.h
    public boolean a() {
        return false;
    }

    @Override // com.uievolution.microserver.h
    public boolean a(ByteBuffer byteBuffer) throws IOException {
        e eVar = this.a;
        eVar.a(new g(eVar));
        return true;
    }
}
