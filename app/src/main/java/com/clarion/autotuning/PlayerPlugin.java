package com.clarion.autotuning;

/* loaded from: classes.dex */
public class PlayerPlugin {
    private long mCHandle;

    private static native long NatvieCreate(int i);

    private static native void NatvieDestory(long j);

    private static native void NatvieHandle(long j, double[] dArr);

    private static native void NatvieSetResponse(long j, double[] dArr);

    static {
        System.loadLibrary("auto_tuning");
    }

    public PlayerPlugin(int i) {
        this.mCHandle = NatvieCreate(i);
    }

    public void HandleData(double[] dArr) {
        NatvieHandle(this.mCHandle, dArr);
    }

    public void SetResponse(double[] dArr) {
        NatvieSetResponse(this.mCHandle, dArr);
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
