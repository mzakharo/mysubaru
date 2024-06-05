package com.uievolution.microserver;

/* loaded from: classes.dex */
public interface MSWebSocket {
    public static final int CLOSE_GOING_AWAY = 1001;
    public static final int CLOSE_INVALID_FRAME_PAYLOAD_DATA = 1007;
    public static final int CLOSE_NORMAL = 1000;
    public static final int CLOSE_PROTOCOL_ERROR = 1002;
    public static final int CLOSE_UNSUPPORTED_DATA = 1003;
    public static final int MAX_CONTROL_FLOW_PAYLOAD_LENGTH = 125;

    /* loaded from: classes.dex */
    public interface Connection {
        boolean close();

        boolean close(int i, String str);

        boolean isOpen();

        boolean sendMessage(String str);

        boolean sendMessage(byte[] bArr);
    }

    String getSubProtocol();

    void onClose(int i, String str);

    void onMessage(String str);

    void onMessage(byte[] bArr);

    void onOpen(Connection connection);
}
