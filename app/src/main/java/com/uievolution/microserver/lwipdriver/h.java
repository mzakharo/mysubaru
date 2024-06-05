package com.uievolution.microserver.lwipdriver;

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/* loaded from: classes.dex */
interface h extends Closeable {
    InputStream getInputStream() throws IOException;

    OutputStream getOutputStream() throws IOException;
}
