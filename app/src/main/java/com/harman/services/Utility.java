package com.harman.services;

import androidx.core.view.MotionEventCompat;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/* loaded from: classes.dex */
public class Utility {
    private static final String TAG = "Utility";
    public static String passWord;
    public static int respId;
    public static String usrName;

    public static boolean getBit(byte b, int i) {
        int i2 = 1 << i;
        return (b & i2) == i2;
    }

    private static char getIntLowerBits(byte b) {
        return (char) (((char) b) & 255);
    }

    private static char getIntUpperBits(byte b) {
        return (char) ((b << 8) & MotionEventCompat.ACTION_POINTER_INDEX_MASK);
    }

    public static boolean isBoolContParam(int i) {
        return i < 4096;
    }

    public static boolean isRealContParam(int i) {
        return i >= 12288 && i < 16384;
    }

    public static boolean isSIntContParam(int i) {
        return i >= 8192 && i < 12288;
    }

    public static boolean isStrContParam(int i) {
        return i >= 16384;
    }

    public static boolean isUIntContParam(int i) {
        return i >= 4096 && i < 8192;
    }

    public static boolean validChecksum(byte[] bArr, short s, char c) {
        if (s < 9) {
            return false;
        }
        byte[] bArr2 = new byte[s];
        System.arraycopy(bArr, 0, bArr2, 0, s);
        bArr2[8] = 0;
        bArr2[9] = 0;
        char calculateChksum = calculateChksum(bArr2, s);
        if (calculateChksum == c) {
            Log.i(TAG, "Good Checksum: Expected(" + Integer.toHexString(calculateChksum) + ") got (" + Integer.toHexString(c) + ")");
            return true;
        }
        Log.i(TAG, "Bad Checksum: Expected(" + Integer.toHexString(calculateChksum) + ") got (" + Integer.toHexString(c) + ")");
        return false;
    }

    public static char extractChar(byte[] bArr, int i) {
        return (char) (((((char) bArr[i + 1]) << '\b') & MotionEventCompat.ACTION_POINTER_INDEX_MASK) | (((char) bArr[i]) & 255));
    }

    public static boolean validateCommand(byte[] bArr) {
        int intValue;
        return bArr != null && bArr.length >= 10 && bArr[0] == -74 && bArr[1] == -74 && (intValue = ((Integer) getUnSignedIntVal(bArr, 6, 2)).intValue()) >= 1 && intValue <= 131;
    }

    public static boolean isResponse(byte[] bArr) {
        return bArr != null && bArr.length >= 10 && bArr[0] == -74 && bArr[1] == -74 && (((Integer) getUnSignedIntVal(bArr, 4, 2)).intValue() & 32768) > 0;
    }

    public static String hexString(byte[] bArr) {
        if (bArr.length >= 3000) {
            return "Buffer too long to be printed!!";
        }
        String str = "";
        for (byte b : bArr) {
            String upperCase = Integer.toString(b & 255, 16).toUpperCase();
            if (upperCase.length() % 2 != 0) {
                upperCase = "0" + upperCase;
            }
            str = str + upperCase + " ";
        }
        return str;
    }

    public static byte[] packageResponse(int i, int i2, byte[] bArr) {
        int length = bArr != null ? 10 + bArr.length : 10;
        byte[] bArr2 = new byte[length];
        bArr2[0] = -74;
        bArr2[1] = -74;
        bArr2[2] = (byte) (length & 255);
        bArr2[3] = (byte) (length >> 8);
        ushort2Byte(bArr2, Integer.valueOf(i | 32768), 4, 2);
        bArr2[6] = (byte) (i2 & 255);
        bArr2[7] = (byte) (i2 >> 8);
        if (bArr != null) {
            for (int i3 = 0; i3 < bArr.length; i3++) {
                bArr2[i3 + 10] = bArr[i3];
            }
        }
        char calculateChksum = calculateChksum(bArr2, length);
        bArr2[9] = (byte) ((calculateChksum << 16) >>> 24);
        bArr2[8] = (byte) ((calculateChksum << 24) >>> 24);
        return bArr2;
    }

    public static synchronized byte[] packageRequest(int i, byte[] bArr) {
        byte[] bArr2;
        synchronized (Utility.class) {
            int length = bArr != null ? 10 + bArr.length : 10;
            bArr2 = new byte[length];
            bArr2[0] = -74;
            bArr2[1] = -74;
            bArr2[2] = (byte) (length & 255);
            bArr2[3] = (byte) (length >> 8);
            int generateRespId = generateRespId();
            bArr2[4] = (byte) (generateRespId & 255);
            bArr2[5] = (byte) (generateRespId >> 8);
            ushort2Byte(bArr2, Integer.valueOf(i), 6, 2);
            if (bArr != null) {
                for (int i2 = 0; i2 < bArr.length; i2++) {
                    bArr2[i2 + 10] = bArr[i2];
                }
            }
            char calculateChksum = calculateChksum(bArr2, (short) length);
            bArr2[9] = (byte) ((calculateChksum << 16) >>> 24);
            bArr2[8] = (byte) ((calculateChksum << 24) >>> 24);
        }
        return bArr2;
    }

    public static synchronized int generateRespId() {
        int i;
        synchronized (Utility.class) {
            int i2 = respId;
            if (i2 == 32767) {
                respId = 0;
            } else {
                respId = i2 + 1;
            }
            i = respId;
        }
        return i;
    }

    public static Object getUnSignedIntVal(byte[] bArr, int i, int i2) {
        int length = bArr.length;
        if (i < 0 || i >= length || i2 < 0 || i2 > length || i2 > 4) {
            return null;
        }
        long j = 0;
        if (i2 <= 4) {
            for (int i3 = i2; i3 > 0; i3--) {
                long j2 = bArr[(i + i3) - 1] & 255;
                int i4 = (i3 - 1) * 8;
                j += i4 == 0 ? j2 & 255 : j2 << i4;
            }
        }
        if (i2 == 2) {
            return Integer.valueOf((int) (65535 & j));
        }
        if (i2 == 4) {
            return Long.valueOf((-1) & j);
        }
        return null;
    }

    public static Object getIntVal(byte[] bArr, int i, int i2) {
        long j;
        if (i2 < 8) {
            j = 0;
            for (int i3 = i2; i3 > 0; i3--) {
                long j2 = bArr[(i + i3) - 1];
                int i4 = (i3 - 1) * 8;
                j += i4 == 0 ? j2 & 255 : j2 << i4;
            }
        } else if (i2 == 8) {
            j = (bArr[i] & 255) | ((bArr[i + 1] << 8) & 65280) | ((bArr[i + 7] << 56) & (-72057594037927936L)) | ((bArr[i + 6] << 48) & 71776119061217280L) | ((bArr[i + 5] << 40) & 280375465082880L) | ((bArr[i + 4] << 32) & 1095216660480L) | ((bArr[i + 3] << 24) & 4278190080L) | ((bArr[i + 2] << 16) & 16711680);
        } else {
            byte[] bArr2 = new byte[8];
            System.arraycopy(bArr, i, bArr2, 0, 8);
            j = ByteBuffer.wrap(bArr2).getLong();
        }
        if (i2 == 2) {
            return new Short((short) j);
        }
        if (i2 == 4) {
            return Integer.valueOf((int) j);
        }
        if (i2 == 8) {
            return Long.valueOf(j);
        }
        return null;
    }

    public static float byteArr2float(byte[] bArr, int i) {
        byte[] bArr2 = new byte[4];
        for (int i2 = 0; i2 < 4; i2++) {
            bArr2[i2] = bArr[(i + 3) - i2];
        }
        ByteBuffer allocate = ByteBuffer.allocate(4);
        allocate.put(bArr2);
        return allocate.getFloat(0);
    }

    public static double byteArr2double(byte[] bArr, int i) {
        byte[] bArr2 = new byte[8];
        for (int i2 = 0; i2 < 8; i2++) {
            bArr2[i2] = bArr[(i + 7) - i2];
        }
        ByteBuffer allocate = ByteBuffer.allocate(8);
        allocate.put(bArr2);
        return allocate.getDouble(0);
    }

    public static int getId(byte[] bArr, int i) {
        byte[] bArr2 = new byte[4];
        bArr2[2] = (byte) (bArr[i + 1] << 1);
        bArr2[2] = (byte) (bArr2[2] >> 1);
        bArr2[3] = bArr[i];
        int i2 = 0;
        for (int i3 = 0; i3 < 4; i3++) {
            i2 += (bArr2[i3] & 255) << ((3 - i3) * 8);
        }
        return i2;
    }

    public static String getString(byte[] bArr, int i, int i2) {
        byte[] bArr2 = new byte[i2];
        for (int i3 = 0; i3 < i2; i3++) {
            bArr2[i3] = bArr[i + i3];
        }
        return new String(bArr2);
    }

    public static void ushort2Byte(byte[] bArr, Object obj, int i, int i2) {
        if (i2 != 2) {
            return;
        }
        int intValue = ((Integer) obj).intValue();
        while (true) {
            i2--;
            if (i2 == 0) {
                return;
            }
            bArr[i] = (byte) (intValue & 255);
            intValue >>= 8;
            i++;
            bArr[i] = (byte) (intValue & 255);
        }
    }

    public static void int2Byte(byte[] bArr, Object obj, int i, int i2) {
        if (i2 == 2) {
            int shortValue = ((Short) obj).shortValue();
            while (true) {
                i2--;
                if (i2 == 0) {
                    return;
                }
                bArr[i] = (byte) (shortValue & 255);
                shortValue >>= 8;
                i++;
                bArr[i] = (byte) (shortValue & 255);
            }
        } else if (i2 == 4) {
            Integer num = (Integer) obj;
            while (true) {
                i2--;
                if (i2 == 0) {
                    return;
                }
                bArr[i] = (byte) (num.intValue() & 255);
                num = Integer.valueOf(num.intValue() >> 8);
                i++;
                if (i2 - 1 == 0) {
                    bArr[i] = (byte) (num.intValue() & 255);
                }
            }
        } else {
            Long l = (Long) obj;
            while (true) {
                i2--;
                if (i2 == 0) {
                    return;
                }
                bArr[i] = (byte) (l.longValue() & 255);
                l = Long.valueOf(l.longValue() >> 8);
                i++;
                if (i2 - 1 == 0) {
                    bArr[i] = (byte) (l.longValue() & 255);
                }
            }
        }
    }

    public static void double2bytearray(byte[] bArr, double d, int i) {
        ByteBuffer.wrap(bArr, i, 8).order(ByteOrder.LITTLE_ENDIAN).putDouble(d);
    }

    public static char calculateChksum(byte[] bArr, int i) {
        if (i < 2) {
            return (char) 0;
        }
        int i2 = i & 1;
        int i3 = i2 == 1 ? i - 1 : i;
        char c = 0;
        for (int i4 = 0; i4 < i3; i4 += 2) {
            c = (char) (c + ((char) (getIntLowerBits(bArr[i4]) | getIntUpperBits(bArr[i4 + 1]))));
        }
        if (i2 == 1) {
            c = (char) (c + getIntLowerBits(bArr[i - 1]));
        }
        return (char) (((char) (0 - c)) & 65535);
    }

    public static boolean isQuridParam(short[] sArr, int i) {
        if (sArr == null) {
            return false;
        }
        for (short s : sArr) {
            if (s == i) {
                return true;
            }
        }
        return false;
    }

    public static void xpandAndInsertBool(byte[] bArr, int i, boolean z, int i2, short[] sArr) {
        byte[] expandByteArray = expandByteArray(bArr, 3);
        ushort2Byte(expandByteArray, Integer.valueOf(i), i2, 2);
        int i3 = i2 + 2;
        if (z) {
            expandByteArray[i3] = 1;
        } else {
            expandByteArray[i3] = 0;
        }
    }

    public static void expandAndInsertBool(byte[] bArr, int i, String str, int i2, short[] sArr) {
        if (isQuridParam(sArr, i)) {
            byte[] expandByteArray = expandByteArray(bArr, 3);
            ushort2Byte(expandByteArray, Integer.valueOf(i), i2, 2);
            int i3 = i2 + 2;
            if (str.equals("1")) {
                expandByteArray[i3] = 1;
            } else {
                expandByteArray[i3] = 0;
            }
        }
    }

    public static byte[] expandByteArray(byte[] bArr, int i) {
        int length = bArr != null ? bArr.length : 0;
        byte[] bArr2 = new byte[i + length];
        if (length > 0 && bArr != null) {
            System.arraycopy(bArr, 0, bArr2, 0, length);
        }
        return bArr2;
    }

    public static int getChkSum(byte[] bArr, int i, int i2) {
        String str = TAG;
        Log.v(str, "Header " + bArr.length);
        byte[] bArr2 = {bArr[i + 1], bArr[i]};
        Log.v(str, "Idx " + i);
        Log.v(str, "temp[0] " + ((int) bArr2[0]));
        Log.v(str, "temp[1] " + ((int) bArr2[1]));
        int i3 = 15;
        int i4 = 0;
        while (i3 > 7) {
            double d = i4;
            double d2 = (bArr2[0] & 128) >> 7;
            double pow = Math.pow(2.0d, i3);
            Double.isNaN(d2);
            Double.isNaN(d);
            i4 = (int) (d + (d2 * pow));
            bArr2[0] = (byte) (bArr2[0] << 1);
            i3--;
        }
        while (i3 >= 0) {
            double d3 = i4;
            double d4 = (bArr2[1] & 128) >> 7;
            double pow2 = Math.pow(2.0d, i3);
            Double.isNaN(d4);
            Double.isNaN(d3);
            i4 = (int) (d3 + (d4 * pow2));
            bArr2[1] = (byte) (bArr2[1] << 1);
            i3--;
        }
        String str2 = TAG;
        Log.v(str2, "temp[0] 2222222 " + ((int) bArr2[0]));
        Log.v(str2, "temp[1] 2222222222" + ((int) bArr2[1]));
        return i4;
    }
}
