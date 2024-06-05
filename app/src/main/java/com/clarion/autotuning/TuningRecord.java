package com.clarion.autotuning;

/* loaded from: classes.dex */
public class TuningRecord {
    private long mNativeHandle;

    private static native long NativeCreate();

    private static native void NativeDestory(long j);

    private static native void NativeFFT(long j, short[] sArr);

    private static native double[] NativeGetSpectrum(long j);

    private static native void NativeSetInverseDouble(long j, double[] dArr);

    private static native void NativeSetPinkDouble(long j, double[] dArr);

    static {
        System.loadLibrary("auto_tuning");
    }

    public TuningRecord() {
        this.mNativeHandle = 0L;
        this.mNativeHandle = NativeCreate();
    }

    public void fft(short[] sArr) {
        NativeFFT(this.mNativeHandle, sArr);
    }

    public void setInverseDouble(double[] dArr) {
        NativeSetInverseDouble(this.mNativeHandle, dArr);
    }

    public void setPinkDouble(double[] dArr) {
        NativeSetPinkDouble(this.mNativeHandle, dArr);
    }

    public double[] getSpectrum() {
        return NativeGetSpectrum(this.mNativeHandle);
    }

    protected void finalize() {
        try {
            long j = this.mNativeHandle;
            if (j != 0) {
                NativeDestory(j);
                this.mNativeHandle = 0L;
            }
            super.finalize();
        } catch (Throwable th) {
            th.printStackTrace();
        }
    }
}
