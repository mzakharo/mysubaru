package com.clarion.autotuning;

import com.clarion.autotuning.SampleRecorder;

/* loaded from: classes.dex */
public class TuningController implements SampleRecorder.IRecordCallback {
    public static final int RESULT_CANCEL = 0;
    public static final int RESULT_ERROR = -1;
    public static final int RESULT_OK = 1;
    public SampleRecorder mSampleRecorder;
    public TuningCalculator mTuningCalculator;
    private ITuningCallback mTuningCallback;
    private Thread waitThread;

    /* loaded from: classes.dex */
    public interface ITuningCallback {
        void onFinished(int i, double[][] dArr);

        void onRecorded();

        void onRecording(double[] dArr);
    }

    public TuningController(SampleRecorder sampleRecorder, TuningCalculator tuningCalculator) {
        this.mSampleRecorder = null;
        this.mTuningCalculator = null;
        this.mSampleRecorder = sampleRecorder;
        this.mTuningCalculator = tuningCalculator;
        sampleRecorder.setRecordCallback(this);
    }

    public void start() {
        this.mSampleRecorder.record();
        Thread thread = new Thread() { // from class: com.clarion.autotuning.TuningController.1
            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                boolean waitForRecord = TuningController.this.mSampleRecorder.waitForRecord();
                if (TuningController.this.mTuningCallback != null) {
                    TuningController.this.mTuningCallback.onRecorded();
                }
                if (waitForRecord) {
                    TuningController.this.mTuningCalculator.calculateMeasurementResponse();
                    TuningController.this.mTuningCalculator.calculateCorrectionResponse();
                }
                if (TuningController.this.mTuningCallback != null) {
                    double[][] spectra = TuningController.this.mTuningCalculator.getSpectra();
                    if (waitForRecord) {
                        TuningController.this.mTuningCallback.onFinished(1, spectra);
                    } else {
                        TuningController.this.mTuningCallback.onFinished(0, spectra);
                    }
                }
            }
        };
        this.waitThread = thread;
        thread.start();
    }

    public void stop() {
        this.mSampleRecorder.interrept();
        this.mSampleRecorder.waitForRecord();
    }

    public void setTuningCallback(ITuningCallback iTuningCallback) {
        this.mTuningCallback = iTuningCallback;
    }

    @Override // com.clarion.autotuning.SampleRecorder.IRecordCallback
    public void onRecording(double[] dArr) {
        ITuningCallback iTuningCallback = this.mTuningCallback;
        if (iTuningCallback != null) {
            iTuningCallback.onRecording(dArr);
        }
    }
}
