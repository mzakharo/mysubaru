package com.clarion.audioip;

/* loaded from: classes.dex */
public class PlayerPlugin {
    private long mCHandle;

    private static native long NatvieCreate(int i, int i2, int i3, boolean z);

    private static native void NatvieDestory(long j);

    private static native void NatvieHandle(long j, double[] dArr);

    private static native void NatvieOnOff(long j, boolean z);

    private static native void NatvieSwitch(long j, int i);

    static {
        System.loadLibrary("audio_ip");
    }

    public PlayerPlugin(int i, int i2, int i3, boolean z) {
        this.mCHandle = NatvieCreate(i, i2, i3, z);
    }

    public void HandleData(double[] dArr) {
        NatvieHandle(this.mCHandle, dArr);
    }

    public void Switch(int i) {
        if (i == -1) {
            NatvieOnOff(this.mCHandle, false);
        } else {
            NatvieOnOff(this.mCHandle, true);
            NatvieSwitch(this.mCHandle, i);
        }
    }

    public void OnOff(boolean z) {
        NatvieOnOff(this.mCHandle, z);
    }

    protected void finalize() {
        NatvieDestory(this.mCHandle);
        try {
            super.finalize();
        } catch (Throwable th) {
            th.printStackTrace();
        }
    }
}
