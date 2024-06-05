package com.uievolution.microserver.wifidriver;

import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;

/* loaded from: classes.dex */
class b {
    private SocketChannel a;
    private Selector b;

    /* JADX INFO: Access modifiers changed from: package-private */
    public b(SocketChannel socketChannel, Selector selector) {
        this.a = socketChannel;
        this.b = selector;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a() {
        SelectionKey keyFor = this.a.keyFor(this.b);
        if (keyFor == null || !keyFor.isValid()) {
            return;
        }
        keyFor.interestOps(keyFor.interestOps() | 4);
        this.b.wakeup();
    }
}
