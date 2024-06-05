package com.clarion.autotuning;

import android.content.Context;
import android.graphics.PointF;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.List;

/* loaded from: classes.dex */
public class PointData {
    public static final String CUSTOMIZE_POINT_FILE_NAME = "CustomizeP%s.txt";

    public boolean savePoints(Context context, List<PointF> list, int i) throws Throwable {
        DataOutputStream dataOutputStream = null;
        DataOutputStream dataOutputStream2 = null;
        try {
            dataOutputStream = new DataOutputStream(new BufferedOutputStream(context.openFileOutput(String.format(CUSTOMIZE_POINT_FILE_NAME, Integer.valueOf(i)), 0)));
        } catch (Exception unused) {
        } catch (Throwable th) {
            th = th;
        }
        try {
            for (PointF pointF : list) {
                dataOutputStream.writeFloat(pointF.x);
                dataOutputStream.writeFloat(pointF.y);
            }
            dataOutputStream.flush();
            try {
                dataOutputStream.close();
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return true;
            }
        } catch (Exception unused2) {
            dataOutputStream2 = dataOutputStream;
            if (dataOutputStream2 != null) {
                try {
                    dataOutputStream2.close();
                } catch (IOException e2) {
                    e2.printStackTrace();
                }
            }
            return false;
        } catch (Throwable th2) {
            Throwable th = th2;
            dataOutputStream2 = dataOutputStream;
            if (dataOutputStream2 != null) {
                try {
                    dataOutputStream2.close();
                } catch (IOException e3) {
                    e3.printStackTrace();
                }
            }
            throw th;
        }
    }

    public boolean readPoints(Context context, List<PointF> list, int i) {
        list.clear();
        DataInputStream dataInputStream = null;
        try {
            DataInputStream dataInputStream2 = new DataInputStream(new BufferedInputStream(context.openFileInput(String.format(CUSTOMIZE_POINT_FILE_NAME, Integer.valueOf(i)))));
            while (dataInputStream2.available() > 0) {
                try {
                    list.add(new PointF(dataInputStream2.readFloat(), dataInputStream2.readFloat()));
                } catch (Exception unused) {
                    dataInputStream = dataInputStream2;
                    if (dataInputStream == null) {
                        return false;
                    }
                    try {
                        dataInputStream.close();
                        return false;
                    } catch (IOException e) {
                        e.printStackTrace();
                        return false;
                    }
                } catch (Throwable th) {
                    th = th;
                    dataInputStream = dataInputStream2;
                    if (dataInputStream != null) {
                        try {
                            dataInputStream.close();
                        } catch (IOException e2) {
                            e2.printStackTrace();
                        }
                    }
                    throw th;
                }
            }
            try {
                dataInputStream2.close();
            } catch (IOException e3) {
                e3.printStackTrace();
            }
            return true;
        } catch (Exception unused2) {
        } catch (Throwable th2) {
            Throwable th = th2;
        }
        return true;
    }
}
