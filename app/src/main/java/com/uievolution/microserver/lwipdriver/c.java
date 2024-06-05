package com.uievolution.microserver.lwipdriver;

import android.bluetooth.BluetoothServerSocket;
import java.io.IOException;

/* loaded from: classes.dex */
class c implements g {
    private BluetoothServerSocket a;

    /* JADX INFO: Access modifiers changed from: package-private */
    public c(BluetoothServerSocket bluetoothServerSocket) {
        this.a = bluetoothServerSocket;
    }

    @Override // com.uievolution.microserver.lwipdriver.g
    public h a() throws IOException {
        return new d(this.a.accept(), this.a);
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() throws IOException {
        this.a.close();
    }
}
