package com.clarion.autotuning;

import android.content.Context;

/* loaded from: classes.dex */
public class TuningCalculator {
    private static final String INVERSE_MIC_CORRECTION_FILE_NAME = "inv_mic_correction.raw";
    private static final String MEASURED_RESPONSE_FILE_NAME = "ir.raw";
    private static final String RECORDED_DATA_FILE_NAME = "rec.raw";
    private static final String VARIANCE_FILE_NAME = "var.raw";
    private long mNativeHandle;

    private static native void NativeCalculateCorrectionResponse(long j);

    private static native void NativeCalculateMeasurementResponse(long j);

    private static native long NativeCreate(String str, String str2, String str3, String str4);

    private static native void NativeDestory(long j);

    private static native double[] NativeGetIr(long j, boolean z);

    private static native double[][] NativeGetSpectra(long j);

    private static native void NativeInitail(long j);

    private static native void NativeSetFilterHigh(long j, double[] dArr);

    private static native void NativeSetFilterLow(long j, double[] dArr);

    private static native void NativeSetFlat(long j, double[] dArr);

    private static native void NativeSetInverseMic(long j, double[] dArr);

    private static native void NativeSetPink(long j, double[] dArr);

    private static native void NativeSetTargetResponse(long j, double[] dArr);

    static {
        System.loadLibrary("auto_tuning");
    }

    public TuningCalculator(Context context) {
        this.mNativeHandle = 0L;
        this.mNativeHandle = NativeCreate(context.getCacheDir() + "/rec.raw", context.getFileStreamPath(MEASURED_RESPONSE_FILE_NAME).getAbsolutePath(), context.getFileStreamPath(VARIANCE_FILE_NAME).getAbsolutePath(), context.getFileStreamPath(INVERSE_MIC_CORRECTION_FILE_NAME).getAbsolutePath());
    }

    public void initail() {
        NativeInitail(this.mNativeHandle);
    }

    public void calculateCorrectionResponse() {
        NativeCalculateCorrectionResponse(this.mNativeHandle);
    }

    public void calculateMeasurementResponse() {
        NativeCalculateMeasurementResponse(this.mNativeHandle);
    }

    public void setFlat(double[] dArr) {
        NativeSetFlat(this.mNativeHandle, dArr);
    }

    public void setInverseMic(double[] dArr) {
        NativeSetInverseMic(this.mNativeHandle, dArr);
    }

    public void setPink(double[] dArr) {
        NativeSetPink(this.mNativeHandle, dArr);
    }

    public void setFilterLow(double[] dArr) {
        NativeSetFilterLow(this.mNativeHandle, dArr);
    }

    public void setFilterHigh(double[] dArr) {
        NativeSetFilterHigh(this.mNativeHandle, dArr);
    }

    public double[] getIr(boolean z) {
        return NativeGetIr(this.mNativeHandle, z);
    }

    public double[][] getSpectra() {
        return NativeGetSpectra(this.mNativeHandle);
    }

    public void setTargetResponse(double[] dArr) {
        NativeSetTargetResponse(this.mNativeHandle, dArr);
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
