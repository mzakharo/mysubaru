package com.uievolution.microserver.http;

/* loaded from: classes.dex */
public class ProtocolVersion {
    public static ProtocolVersion HTTP_1_0 = new ProtocolVersion("HTTP", 1, 0);
    public static ProtocolVersion HTTP_1_1 = new ProtocolVersion("HTTP", 1, 1);
    protected int major;
    protected int minor;
    protected String protocol;

    public ProtocolVersion(String str, int i, int i2) {
        this.protocol = str;
        this.major = i;
        this.minor = i2;
    }

    public final boolean equals(Object obj) {
        if (!(obj instanceof ProtocolVersion)) {
            return false;
        }
        ProtocolVersion protocolVersion = (ProtocolVersion) obj;
        return this.protocol.equals(protocolVersion.protocol) && this.major == protocolVersion.major && this.minor == protocolVersion.minor;
    }

    public int getMajor() {
        return this.major;
    }

    public int getMinor() {
        return this.minor;
    }

    public String getProtocol() {
        return this.protocol;
    }

    public final int hashCode() {
        int i = (((this.major + 31) * 31) + this.minor) * 31;
        String str = this.protocol;
        return i + (str == null ? 0 : str.hashCode());
    }

    public String toString() {
        return this.protocol + "/" + this.major + "." + this.minor;
    }
}
