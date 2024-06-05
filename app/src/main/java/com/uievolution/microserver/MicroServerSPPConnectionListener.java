package com.uievolution.microserver;

/* loaded from: classes.dex */
public abstract class MicroServerSPPConnectionListener {
    public static final int CONNECTED = 1;
    public static final int DISCONNECTED = 2;

    public abstract void onConnectionEvent(int i);
}
