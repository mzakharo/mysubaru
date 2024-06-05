package com.clarion.inttune;

import android.content.Context;
import android.util.Log;
import com.clarion.autotuning.MicData;
import com.clarion.autotuning.MicPointData;
import com.clarion.autotuning.PointData;
import com.clarion.autotuning.SampleRecorder;
import com.clarion.autotuning.TargetData;
import com.clarion.autotuning.TuningCalculator;
import com.clarion.autotuning.TuningController;
import com.clarion.autotuning.TuningRecord;
import java.io.File;
import java.io.IOException;

/* loaded from: classes.dex */
public class AutoTuningModule {
    private static final String TUNING_MUSIC_FILE = "m13_1_m13_2_g05_44k_pink.wav";
    private static Context mContext;
    private static MicData mMicData;
    private static MicPointData mMicPointData;
    private static PointData mPointData;
    private static Profile mProfile;
    private static SampleRecorder mSampleRecorder;
    private static TargetData mTargetData;
    private static TuningCalculator mTuningCalculator;
    private static TuningController mTuningController;
    private static TuningRecord mTuningRecord;

    /* loaded from: classes.dex */
    public static class Profile {
        public int[] micRes = null;
        public int[] micDoubleRes = null;
        public int[] customizeRes = null;
        public int flatRes = 0;
        public int pinkRes = 0;
        public int pinkDoubleRes = 0;
        public int filterLow = 0;
        public int filterHigh = 0;
    }

    public static void initail(Context context, Profile profile) throws IOException {
        ApiConfig.initialize(context);
        mContext = context;
        mProfile = profile;
        mMicData = new MicData();
        mTargetData = new TargetData();
        mPointData = new PointData();
        mMicPointData = new MicPointData();
        mTuningRecord = new TuningRecord();
        mTuningCalculator = new TuningCalculator(context);
        SampleRecorder sampleRecorder = new SampleRecorder(context, mTuningRecord);
        mSampleRecorder = sampleRecorder;
        mTuningController = new TuningController(sampleRecorder, mTuningCalculator);
        double[] dArr = new double[16384];
        getResponseResource(context, mProfile.flatRes, dArr);
        mTuningCalculator.setFlat(dArr);
        getResponseResource(context, mProfile.pinkRes, dArr);
        mTuningCalculator.setPink(dArr);
        getResponseResource(context, mProfile.pinkDoubleRes, dArr);
        mTuningRecord.setPinkDouble(dArr);
        getResponseResource(context, mProfile.filterLow, dArr);
        mTuningCalculator.setFilterLow(dArr);
        getResponseResource(context, mProfile.filterHigh, dArr);
        mTuningCalculator.setFilterHigh(dArr);
        mTuningCalculator.initail();
        switchEQ(ApiConfig.getInstance().getEQSelection());
        switchMicEQ(ApiConfig.getInstance().getMicSelection());
    }

    public static String getTuningFileName() {
        return mContext.getFilesDir() + File.separator + TUNING_MUSIC_FILE;
    }

    public static double[] getTuningParameter(double[] dArr, boolean z) {
        mTuningCalculator.setTargetResponse(dArr);
        mTuningCalculator.calculateMeasurementResponse();
        mTuningCalculator.calculateCorrectionResponse();
        return mTuningCalculator.getIr(z);
    }

    public static void setTuningOn(boolean z) {
        Log.e("wangj", "setTuningOn : " + z);
        mTuningCalculator.calculateCorrectionResponse();
        AudioIPModule.setTuningResponse(mTuningCalculator.getIr(z));
        ApiConfig.getInstance().setTuningOn(z);
    }

    public static boolean isTuningOn() {
        return ApiConfig.getInstance().isTuningOn();
    }

    public static void switchMicEQ(int i) throws IOException {
        double[] readTargetResponseResourceDouble;
        double[] readTargetResponseResource;
        if (i == 5) {
            readTargetResponseResourceDouble = mMicData.readCustomizedTargetResponseDouble(mContext, mProfile.micDoubleRes[0]);
            readTargetResponseResource = mMicData.readCustomizedTargetResponse(mContext, mProfile.micRes[0]);
        } else {
            readTargetResponseResourceDouble = mMicData.readTargetResponseResourceDouble(mContext, mProfile.micDoubleRes[i]);
            readTargetResponseResource = mMicData.readTargetResponseResource(mContext, mProfile.micRes[i]);
        }
        mTuningRecord.setInverseDouble(readTargetResponseResourceDouble);
        mTuningCalculator.setInverseMic(readTargetResponseResource);
        ApiConfig.getInstance().setMicSelettion(i);
    }

    public static void switchEQ(int i) throws IOException {
        double[] readTargetResponseResource;
        if (i >= 5 && i <= 7) {
            readTargetResponseResource = mTargetData.readCustomizedTargetResponse(mContext, i - 4, mProfile.customizeRes[0]);
        } else {
            readTargetResponseResource = mTargetData.readTargetResponseResource(mContext, mProfile.customizeRes[i]);
        }
        mTuningCalculator.setTargetResponse(readTargetResponseResource);
        mTuningCalculator.calculateCorrectionResponse();
        AudioIPModule.setTuningResponse(mTuningCalculator.getIr(ApiConfig.getInstance().isTuningOn()));
        ApiConfig.getInstance().setEQSelettion(i);
    }

    public static int getEQSelection() {
        return ApiConfig.getInstance().getEQSelection();
    }

    public static int getMicSelection() {
        return ApiConfig.getInstance().getMicSelection();
    }

    public static void startTuningRecord() {
        mTuningController.start();
    }

    public static void interreptTuningRecord() {
        mTuningController.stop();
    }

    public static void setTuningCallback(TuningController.ITuningCallback iTuningCallback) {
        mTuningController.setTuningCallback(iTuningCallback);
    }

    public static double[][] getSpectra() {
        return mTuningCalculator.getSpectra();
    }

    public static double[] getSpectrum() {
        return mTuningRecord.getSpectrum();
    }

    public static TargetData getTargetData() {
        return mTargetData;
    }

    public static MicData getMicData() {
        return mMicData;
    }

    public static PointData getPointData() {
        return mPointData;
    }

    public static MicPointData getMicPointData() {
        return mMicPointData;
    }

    private static void getResponseResource(Context context, int i, double[] dArr) throws IOException {
        ResponseResouces responseResouces = new ResponseResouces();
        responseResouces.openStreamReader(context, i);
        responseResouces.readData(dArr);
    }
}
