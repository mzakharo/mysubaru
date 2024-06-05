package com.uievolution.microserver.websocket;

/* loaded from: classes.dex */
public final class Opcode {
    public static final int BINARY_FRAME = 2;
    public static final int CONNECTIOIN_CLOSE = 8;
    public static final int CONTINUATION_FRAME = 0;
    public static final int PING = 9;
    public static final int PONG = 10;
    public static final int TEXT_FRAME = 1;

    public static boolean isControlFrame(int i) {
        return i == 8 || i == 9 || i == 10;
    }
}
