package com.android.lib.mcm;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.clarion.android.appmgr.stub.Stub;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.json.JSONObject;
import org.slf4j.Marker;
/* loaded from: classes.dex */
public class Util {
    private static String CIPHER = "AES";
    private static final String LOGTAG = "mcm";
    private static final byte[] ENCRYPT_KEY = {-65, -111, 74, 103, -16, 48, 49, -3, -33, 34, -103, -77, -36, -47, 48, -75};
    private static final byte[] ENCRYPT_IV = {-6, 9, 68, 97, 36, -90, 35, -26, -2, -105, 119, 3, -68, 5, -49, -57};
    public static String ALGORITHM = "AES/CBC/PKCS5Padding";

    /* loaded from: classes.dex */
    public enum MODE {
        ENCRYPT,
        DECRYPT
    }

    public static boolean hasParam(Context context, String str) {
        String appMgrVersionInfo = Stub.AppMgrContextStub.getAppMgrVersionInfo(context);
        return TextUtils.isEmpty(appMgrVersionInfo) || appMgrVersionInfo.indexOf(str) != -1;
    }

    public static void responseJson(MSHTTPResponder mSHTTPResponder, String str, int i) throws Exception {
        byte[] bytes = str.getBytes("UTF-8");
        Log.d(LOGTAG, "レスポンス=" + str);
        mSHTTPResponder.startResponse(i, new Header[]{new BasicHeader(HttpCatalogs.HEADER_CONNECTION, "close"), new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, HarmanOTAConst.JSON_CONTENT_TYPE), new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(bytes.length))});
        mSHTTPResponder.writeResponseData(bytes);
        mSHTTPResponder.closeResponse();
        Log.d(LOGTAG, "----- responseJson -----");
        Log.d(LOGTAG, str);
    }

    public static void responseErrorJson(MSHTTPResponder mSHTTPResponder, String str, int i) {
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("return_cd", str);
            responseJson(mSHTTPResponder, jSONObject.toString(), i);
        } catch (Exception unused) {
            mSHTTPResponder.startResponse(500, null);
            mSHTTPResponder.closeResponse();
        }
        Log.d(LOGTAG, "----- responseErrorJson -----");
    }

    public static String makeBroadcastFilter(Context context, String str) {
        return context.getApplicationContext().getPackageName() + "_" + str;
    }

    public static boolean writeByteFile(String str, byte[] bArr, Context context) {
        try {
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(context.openFileOutput(str, 0));
            bufferedOutputStream.write(bArr);
            bufferedOutputStream.flush();
            bufferedOutputStream.close();
            return true;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e2) {
            e2.printStackTrace();
            return false;
        }
    }

    public static byte[] readByteFile(String str, Context context) {
        Context applicationContext = context.getApplicationContext();
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            byte[] bArr = new byte[1024];
            BufferedInputStream bufferedInputStream = new BufferedInputStream(applicationContext.openFileInput(str));
            for (int read = bufferedInputStream.read(bArr); read >= 0; read = bufferedInputStream.read(bArr)) {
                byteArrayOutputStream.write(bArr, 0, read);
            }
            bufferedInputStream.close();
            return byteArrayOutputStream.toByteArray();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    public static boolean deleteFile(String str, Context context) {
        return context.getApplicationContext().deleteFile(str);
    }

    public static byte[] crypt(byte[] bArr, MODE mode) {
        int i = 0;
        byte[] bArr2 = new byte[0];
        try {
            byte[] bArr3 = (byte[]) ENCRYPT_KEY.clone();
            byte[] bArr4 = (byte[]) ENCRYPT_IV.clone();
            int i2 = 0;
            while (i2 < bArr3.length) {
                int i3 = i2 + 1;
                bArr3[i2] = (byte) (bArr3[i2] ^ i3);
                i2 = i3;
            }
            while (i < bArr4.length) {
                int i4 = i + 1;
                bArr4[i] = (byte) (bArr4[i] ^ i4);
                i = i4;
            }
            SecretKeySpec secretKeySpec = new SecretKeySpec(bArr3, CIPHER);
            IvParameterSpec ivParameterSpec = new IvParameterSpec(bArr4);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(mode == MODE.ENCRYPT ? 1 : 2, secretKeySpec, ivParameterSpec);
            return cipher.doFinal(bArr);
        } catch (Exception e) {
            e.printStackTrace();
            return bArr2;
        }
    }
}
