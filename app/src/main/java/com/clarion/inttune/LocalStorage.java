package com.clarion.inttune;

import android.content.Context;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;

/* loaded from: classes.dex */
public class LocalStorage {
    private static final boolean D = false;
    private static final String TAG = "LocalStorage";
    private DataInputStream dataInputStream = null;
    private DataOutputStream dataOutputStream = null;

    public boolean openInputStream(Context context, String str) {
        if (this.dataInputStream == null) {
            try {
                this.dataInputStream = new DataInputStream(new BufferedInputStream(context.openFileInput(str)));
            } catch (FileNotFoundException unused) {
                return false;
            }
        }
        return true;
    }

    public void openOutputStream(Context context, String str) {
        if (this.dataOutputStream == null) {
            try {
                this.dataOutputStream = new DataOutputStream(new BufferedOutputStream(context.openFileOutput(str, 0)));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

    protected void readData(short[] sArr) {
        int length = sArr.length;
        Arrays.fill(sArr, (short) 0);
        for (int i = 0; i < length; i++) {
            try {
                if (this.dataInputStream.available() > 0) {
                    sArr[i] = this.dataInputStream.readShort();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void readData(double[] dArr) {
        int length = dArr.length;
        Arrays.fill(dArr, 0.0d);
        for (int i = 0; i < length; i++) {
            try {
                if (this.dataInputStream.available() > 0) {
                    dArr[i] = this.dataInputStream.readDouble();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    protected void writeData(short[] sArr) {
        for (short s : sArr) {
            try {
                this.dataOutputStream.writeShort(s);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void writeData(double[] dArr) {
        for (double d : dArr) {
            try {
                this.dataOutputStream.writeDouble(d);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void closeInputStream() {
        DataInputStream dataInputStream = this.dataInputStream;
        if (dataInputStream != null) {
            try {
                dataInputStream.close();
                this.dataInputStream = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void closeOutputStream() {
        DataOutputStream dataOutputStream = this.dataOutputStream;
        if (dataOutputStream != null) {
            try {
                dataOutputStream.close();
                this.dataOutputStream = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
