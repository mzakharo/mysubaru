package com.uievolution.microserver.lwipdriver;

import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/* loaded from: classes.dex */
class d implements h {
    private final BluetoothSocket a;
    private final BluetoothServerSocket b;

    /* JADX INFO: Access modifiers changed from: package-private */
    public d(BluetoothSocket bluetoothSocket) {
        this.a = bluetoothSocket;
        this.b = null;
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() throws IOException {
        IOException e = null;
        try {
            this.a.close();
            e = null;
        } catch (IOException e2) {
            e = e2;
        }
        BluetoothServerSocket bluetoothServerSocket = this.b;
        if (bluetoothServerSocket != null) {
            try {
                bluetoothServerSocket.close();
            } catch (IOException e2) {
                if (e == null) {
                    e = e2;
                }
            }
        }
        if (e != null) {
            throw e;
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.h
    public InputStream getInputStream() throws IOException {
        return this.a.getInputStream();
    }

    @Override // com.uievolution.microserver.lwipdriver.h
    public OutputStream getOutputStream() throws IOException {
        return this.a.getOutputStream();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public d(BluetoothSocket bluetoothSocket, BluetoothServerSocket bluetoothServerSocket) {
        this.a = bluetoothSocket;
        this.b = bluetoothServerSocket;
    }
}
