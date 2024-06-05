package com.clarion.autotuning;

import android.content.Context;
import com.clarion.inttune.LocalStorage;
import com.clarion.inttune.ResponseResouces;

import java.io.IOException;

/* loaded from: classes.dex */
public class TargetData {
    public static final String CUSTOMIZE_FILE_NAME = "Customize%s.txt";
    private static final int FFT_LEN = 8192;
    private ResponseResouces responseResouces = new ResponseResouces();
    private LocalStorage localStorage = new LocalStorage();

    public double[] readCustomizedTargetResponse(Context context, int i, int i2) throws IOException {
        double[] dArr = new double[8192];
        String format = String.format(CUSTOMIZE_FILE_NAME, Integer.valueOf(i));
        if (this.localStorage.openInputStream(context, format)) {
            this.localStorage.readData(dArr);
            this.localStorage.closeInputStream();
        } else {
            this.responseResouces.openStreamReader(context, i2);
            this.responseResouces.readData(dArr);
            this.localStorage.openOutputStream(context, format);
            this.localStorage.writeData(dArr);
            this.localStorage.closeOutputStream();
        }
        return dArr;
    }

    public void writeCustomizedTargetResponse(Context context, int i, double[] dArr) {
        this.localStorage.openOutputStream(context, String.format(CUSTOMIZE_FILE_NAME, Integer.valueOf(i)));
        this.localStorage.writeData(dArr);
        this.localStorage.closeOutputStream();
    }

    public double[] readTargetResponseResource(Context context, int i) throws IOException {
        double[] dArr = new double[8192];
        this.responseResouces.openStreamReader(context, i);
        this.responseResouces.readData(dArr);
        return dArr;
    }
}
