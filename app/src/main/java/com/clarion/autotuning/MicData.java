package com.clarion.autotuning;

import android.content.Context;
import com.clarion.inttune.LocalStorage;
import com.clarion.inttune.ResponseResouces;

import java.io.IOException;

/* loaded from: classes.dex */
public class MicData {
    public static final String CUSTOMIZE_DOUBLE_FILE_NAME = "MicCustomizeDouble.txt";
    public static final String CUSTOMIZE_FILE_NAME = "MicCustomize.txt";
    private static final int FFT_LEN = 8192;
    private static final int FFT_LEN_DOUBLE = 16384;
    private ResponseResouces responseResouces = new ResponseResouces();
    private LocalStorage localStorage = new LocalStorage();

    public double[] readCustomizedTargetResponse(Context context, int i) throws IOException {
        double[] dArr = new double[8192];
        if (this.localStorage.openInputStream(context, CUSTOMIZE_FILE_NAME)) {
            this.localStorage.readData(dArr);
            this.localStorage.closeInputStream();
        } else {
            this.responseResouces.openStreamReader(context, i);
            this.responseResouces.readData(dArr);
            this.localStorage.openOutputStream(context, CUSTOMIZE_FILE_NAME);
            this.localStorage.writeData(dArr);
            this.localStorage.closeOutputStream();
        }
        return dArr;
    }

    public double[] readCustomizedTargetResponseDouble(Context context, int i) throws IOException {
        double[] dArr = new double[16384];
        if (this.localStorage.openInputStream(context, CUSTOMIZE_DOUBLE_FILE_NAME)) {
            this.localStorage.readData(dArr);
            this.localStorage.closeInputStream();
        } else {
            this.responseResouces.openStreamReader(context, i);
            this.responseResouces.readData(dArr);
            this.localStorage.openOutputStream(context, CUSTOMIZE_DOUBLE_FILE_NAME);
            this.localStorage.writeData(dArr);
            this.localStorage.closeOutputStream();
        }
        return dArr;
    }

    public void writeCustomizedTargetResponse(Context context, double[] dArr) {
        this.localStorage.openOutputStream(context, CUSTOMIZE_FILE_NAME);
        this.localStorage.writeData(dArr);
        this.localStorage.closeOutputStream();
    }

    public void writeCustomizedTargetResponseDouble(Context context, double[] dArr) {
        this.localStorage.openOutputStream(context, CUSTOMIZE_DOUBLE_FILE_NAME);
        this.localStorage.writeData(dArr);
        this.localStorage.closeOutputStream();
    }

    public double[] readTargetResponseResource(Context context, int i) throws IOException {
        double[] dArr = new double[8192];
        this.responseResouces.openStreamReader(context, i);
        this.responseResouces.readData(dArr);
        return dArr;
    }

    public double[] readTargetResponseResourceDouble(Context context, int i) throws IOException {
        double[] dArr = new double[16384];
        this.responseResouces.openStreamReader(context, i);
        this.responseResouces.readData(dArr);
        return dArr;
    }
}
