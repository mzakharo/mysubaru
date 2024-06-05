package com.uievolution.microserver.lwipdriver;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

/* loaded from: classes.dex */
class m implements h {
    private Socket a;
    private ServerSocket b;

    public m(Socket socket, ServerSocket serverSocket) {
        this.b = null;
        this.a = socket;
        this.b = serverSocket;
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
        ServerSocket serverSocket = this.b;
        if (serverSocket != null) {
            try {
                serverSocket.close();
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
}
