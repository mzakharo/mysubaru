package com.clarion.autotuning;

import android.content.Context;
import android.media.AudioRecord;

/* loaded from: classes.dex */
public class SampleRecorder {
    private static final int AUDIORECORD_BYTE_BUFFER_LEN = 32768;
    private static final int AUDIORECORD_SHORT_BUFFER_LEN = 16384;
    private static final int EXTRA_BUFFER_NUM = 9;
    private static final int FFT_LEN = 8192;
    private static final int FFT_LEN_DOUBLE = 16384;
    private static final int POINT = 100;
    public static final String RECORDED_DATA_FILE_NAME = "rec.raw";
    private static final int SAMPLING_FREQUENCY = 44100;
    private static final int SHIFT_LEN = 4096;
    private AudioRecord audioRecord;
    private int audioRecordMinBufferSize;
    private LocalCacheStorage localCacheStorage;
    private Context mContext;
    private IRecordCallback mRecordCallback;
    private TuningRecord mTuningRecord;
    private RecordThread recordThread;
    private short[] shortRecordArray;

    /* loaded from: classes.dex */
    public interface IRecordCallback {
        void onRecording(double[] dArr);
    }

    public SampleRecorder(Context context, TuningRecord tuningRecord) {
        this.mContext = context;
        int minBufferSize = AudioRecord.getMinBufferSize(44100, 16, 2);
        this.audioRecordMinBufferSize = minBufferSize;
        if (32768 > minBufferSize) {
            this.audioRecordMinBufferSize = 32768;
        }
        this.audioRecord = null;
        this.shortRecordArray = new short[16384];
        this.localCacheStorage = new LocalCacheStorage();
        this.mTuningRecord = tuningRecord;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public AudioRecord createAudioRecord() {
        int[] iArr = {1, 0};
        for (int i = 0; i < 2; i++) {
            AudioRecord audioRecord = new AudioRecord(iArr[i], 44100, 16, 2, this.audioRecordMinBufferSize);
            if (audioRecord.getState() == 1) {
                return audioRecord;
            }
        }
        return null;
    }

    public void setRecordCallback(IRecordCallback iRecordCallback) {
        this.mRecordCallback = iRecordCallback;
    }

    public void record() {
        RecordThread recordThread = new RecordThread();
        this.recordThread = recordThread;
        recordThread.start();
    }

    public void interrept() {
        RecordThread recordThread = this.recordThread;
        if (recordThread != null) {
            recordThread.loop = false;
        }
    }

    public boolean waitForRecord() {
        RecordThread recordThread = this.recordThread;
        if (recordThread != null) {
            try {
                recordThread.join();
                this.recordThread.interrupt();
                return this.recordThread.loop;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void stopAudioRecord() {
        AudioRecord audioRecord = this.audioRecord;
        if (audioRecord != null) {
            audioRecord.stop();
            this.audioRecord.release();
            this.audioRecord = null;
        }
    }

    /* loaded from: classes.dex */
    private class RecordThread extends Thread {
        boolean loop;

        private RecordThread() {
            this.loop = true;
        }

        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            SampleRecorder sampleRecorder = SampleRecorder.this;
            sampleRecorder.audioRecord = sampleRecorder.createAudioRecord();
            if (SampleRecorder.this.audioRecord != null) {
                SampleRecorder.this.audioRecord.startRecording();
                SampleRecorder.this.audioRecord.read(SampleRecorder.this.shortRecordArray, 0, 16384);
                SampleRecorder.this.localCacheStorage.openOutputStream(SampleRecorder.this.mContext, SampleRecorder.RECORDED_DATA_FILE_NAME);
                int ceil = ((int) Math.ceil(25.0d)) + 9;
                for (int i = 0; i < ceil && this.loop; i++) {
                    SampleRecorder.this.audioRecord.read(SampleRecorder.this.shortRecordArray, 0, 16384);
                    SampleRecorder.this.localCacheStorage.writeData(SampleRecorder.this.shortRecordArray);
                    SampleRecorder.this.mTuningRecord.fft(SampleRecorder.this.shortRecordArray);
                    if (SampleRecorder.this.mRecordCallback != null) {
                        SampleRecorder.this.mRecordCallback.onRecording(SampleRecorder.this.mTuningRecord.getSpectrum());
                    }
                }
                SampleRecorder.this.localCacheStorage.closeOutputStream();
                SampleRecorder.this.stopAudioRecord();
            }
        }
    }

    protected void finalize() throws Throwable {
        AudioRecord audioRecord = this.audioRecord;
        if (audioRecord != null) {
            audioRecord.release();
        }
        super.finalize();
    }
}
