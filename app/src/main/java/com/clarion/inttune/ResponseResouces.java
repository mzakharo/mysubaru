package com.clarion.inttune;

import android.content.Context;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

/* loaded from: classes.dex */
public class ResponseResouces {
    private static final boolean D = false;
    private static final String TAG = "TargetResponseResouces";
    BufferedReader bufferedReader = null;

    public boolean openStreamReader(Context context, int i) {
        if (this.bufferedReader != null) {
            return true;
        }
        this.bufferedReader = new BufferedReader(new InputStreamReader(context.getResources().openRawResource(i)));
        return true;
    }

    public void readData(double[] dArr) throws IOException {
        Arrays.fill(dArr, 0.0d);
        int i = 0;
        while (true) {
            try {
                try {
                    try {
                        try {
                            String readLine = this.bufferedReader.readLine();
                            if (readLine == null) {
                                break;
                            }
                            dArr[i] = Double.parseDouble(readLine);
                            i++;
                        } catch (IOException e) {
                            e.printStackTrace();
                            this.bufferedReader.close();
                            this.bufferedReader = null;
                        }
                    } catch (NumberFormatException e2) {
                        e2.printStackTrace();
                        this.bufferedReader.close();
                        this.bufferedReader = null;
                    }
                } catch (Throwable th) {
                    try {
                        this.bufferedReader.close();
                        this.bufferedReader = null;
                    } catch (IOException e3) {
                        e3.printStackTrace();
                    }
                    throw th;
                }
            } catch (IOException e4) {
                e4.printStackTrace();
                return;
            }
        }
        this.bufferedReader.close();
        this.bufferedReader = null;
    }
}
