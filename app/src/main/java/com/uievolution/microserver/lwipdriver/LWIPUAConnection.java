package com.uievolution.microserver.lwipdriver;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.UAConnection;

/* loaded from: classes.dex */
public class LWIPUAConnection extends UAConnection {
    public static final String CONNECTION_TYPE = "LWIP";
    private long h;

    /* JADX INFO: Access modifiers changed from: package-private */
    public LWIPUAConnection(long j, boolean z) {
        super(z);
        this.h = j;
        MicroServer.Logger.d("ms.LWIPUAConnection", "LWIPUAConnection ctor, pcbAddr: 0x" + Long.toHexString(this.h));
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
    public String getObjectId() {
        return Long.toHexString(this.h);
    }

    public long getPcbAddr() {
        return this.h;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.UAConnection
    public void onClosed(boolean z) {
        if (z) {
            this.h = 0L;
        }
        super.onClosed(z);
    }

    @Override // com.uievolution.microserver.UAConnection
    protected void requestStartSending() {
        if (this.h != 0) {
            wakeup();
        }
    }

    native int wakeup();
}
