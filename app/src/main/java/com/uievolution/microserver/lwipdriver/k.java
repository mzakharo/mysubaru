package com.uievolution.microserver.lwipdriver;

import java.io.IOException;
import java.net.ServerSocket;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class k implements e, f {
    private f a;
    private a b;

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized boolean a(LWIPParam lWIPParam, f fVar) throws IOException {
        this.a = fVar;
        ServerSocket serverSocket = new ServerSocket(lWIPParam.getWiFiPort());
        serverSocket.setReuseAddress(true);
        a aVar = new a(new l(serverSocket), this);
        this.b = aVar;
        aVar.start();
        return true;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public boolean b(LWIPParam lWIPParam, f fVar) throws IOException {
        this.a = fVar;
        throw new AssertionError();
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public void onConnect(h hVar) {
        this.a.onConnect(hVar);
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public void onConnectError(int i, String str) {
        this.a.onConnectError(i, str);
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public Type b() {
        return Type.WiFi;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public void a() {
        this.b.c();
        this.b = null;
    }
}
