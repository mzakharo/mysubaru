package com.uievolution.microserver.lwipdriver;

import com.uievolution.microserver.MicroServer;

/* loaded from: classes.dex */
public enum Type {
    None(0),
    Bluetooth(1),
    WiFi(2),
    USB(3);

    private int a;

    Type(int i) {
        this.a = i;
    }

    public int getValue() {
        return this.a;
    }

    public static Type valueOf(int i) {
        for (Type type : values()) {
            if (type.getValue() == i) {
                return type;
            }
        }
        MicroServer.Logger.d("LWIPDriver", "unknown Type: value=" + i);
        return null;
    }
}
