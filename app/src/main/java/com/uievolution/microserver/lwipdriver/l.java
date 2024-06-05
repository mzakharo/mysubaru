package com.uievolution.microserver.lwipdriver;

import java.io.IOException;
import java.net.ServerSocket;

/* loaded from: classes.dex */
class l implements g {
    private ServerSocket a;

    /* JADX INFO: Access modifiers changed from: package-private */
    public l(ServerSocket serverSocket) {
        this.a = serverSocket;
    }

    @Override // com.uievolution.microserver.lwipdriver.g
    public h a() throws IOException {
        return new m(this.a.accept(), this.a);
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() throws IOException {
        this.a.close();
    }
}
