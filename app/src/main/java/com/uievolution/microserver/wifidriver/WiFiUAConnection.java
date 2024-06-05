package com.uievolution.microserver.wifidriver;

import com.uievolution.microserver.UAConnection;

/* loaded from: classes.dex */
public class WiFiUAConnection extends UAConnection {
    public static final String CONNECTION_TYPE = "WiFi";
    private b h;

    WiFiUAConnection(b bVar, boolean z) {
        super(z);
        this.h = bVar;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static UAConnection a(b bVar, boolean z) {
        return UAConnection.onAccept(new WiFiUAConnection(bVar, z));
    }

    public static boolean isSameType(String str) {
        return CONNECTION_TYPE.equals(str);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.UAConnection
    public String getConnectionType() {
        return CONNECTION_TYPE;
    }

    @Override // com.uievolution.microserver.UAConnection
    protected void requestStartSending() {
        synchronized (this) {
            this.h.a();
        }
    }
}
