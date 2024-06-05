package com.clarion.android.smartaccess4car.extend.util;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.clarion.android.smartaccess4car.extend.getproxy.KeyId;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.subaru.global.infotainment.gen2.SmtConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.SocketTimeoutException;
import java.security.AlgorithmParameters;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;

/* loaded from: classes.dex */
public class CipherUtil {
    public static final String AES = "AES";
    public static final String APPEND_URL = "/tif/h5ContentsDownload";
    public static final int CONNECT_AFTER_TIME_OUT = 30000;
    public static final int CONNECT_TIME_OUT = 30000;
    public static final String DATA_PATH_NAME = "data";
    private static final String DEFAULT_IV = "1234567890123456";
    private static final String DEFAULT_KEY = "1234567890123456";
    private static final String DEFAULT_VERSION = "1.0.0";
    public static final String FILE_NAME = "getInfo.json";
    private static final String GET_URL_DEBUG = "https://tvespa.clarion.co.jp/tif/h5ContentsDownload/sky_developer/deezer_soa_ichimura/data/getInfo.json";
    public static final String TAG = "CipherUtil";
    public static final String USE_ENCODE = "UTF-8";
    private static final boolean isDefaultKey = false;
    static final SmtConst mSmt = SmtConst.getInstance();
    public static final String DEFAULT_PADDING = AesCbcPaddingType.PKCS5_PADDING.getType();
    private static Map<String, String> sKeyMap = new LinkedHashMap();
    private static List<Map<String, String>> sKeyMapList = new ArrayList();
    private static Map<String, Map<String, String>> sAppKeyMap = new LinkedHashMap();
    private static boolean isProduct = true;
    private static Object sLoadKeyLock = new Object();
    private static Object sEncryptLock = new Object();
    private static Object sDecryptLock = new Object();

    /* loaded from: classes.dex */
    public enum KeyInfoPamram {
        APP("app"),
        VERSION(HarmanOTAConst.JSON_VERSION),
        KEY("key"),
        IV("iv");

        private String mGetKey;

        KeyInfoPamram(String str) {
            this.mGetKey = str;
        }

        public String getGetKey() {
            return this.mGetKey;
        }

        public void setGetKey(String str) {
            this.mGetKey = str;
        }
    }

    /* loaded from: classes.dex */
    public enum AesCbcPaddingType {
        PKCS5_PADDING("AES/CBC/PKCS5Padding"),
        NO_PADDING("AES/CBC/NoPadding");

        private String mType;

        AesCbcPaddingType(String str) {
            this.mType = str;
        }

        public String getType() {
            return this.mType;
        }

        public void setType(String str) {
            this.mType = str;
        }
    }

    /* loaded from: classes.dex */
    public enum DomaiInfo {
        SA("smt-access", "https://www.smt-access.com"),
        TVESPA(McmConst.SERVER_NAME_TVESPA, "https://tvespa.clarion.co.jp"),
        SACH5(McmConst.SERVER_NAME_SACH5, "https://sach5.clarion.co.jp");

        private String mId;
        private String mPath;

        DomaiInfo(String str, String str2) {
            this.mId = str;
            this.mPath = str2;
        }

        public String getType() {
            return this.mId;
        }

        public void setType(String str) {
            this.mId = str;
        }

        public String getPath() {
            return this.mPath;
        }

        public void setPath(String str) {
            this.mPath = str;
        }
    }

    /* loaded from: classes.dex */
    public enum KeyAppInfo {
        DEEZER("Deezer", "Deezer"),
        STITCHER("stitcher_soa", "stitcher_soa");

        private String mId;
        private String mPath;

        KeyAppInfo(String str, String str2) {
            this.mId = str;
            this.mPath = str2;
        }

        public String getId() {
            return this.mId;
        }

        public void setId(String str) {
            this.mId = str;
        }

        public String getPath() {
            return this.mPath;
        }

        public void setPath(String str) {
            this.mPath = str;
        }
    }

    /* loaded from: classes.dex */
    public enum CipherMessageInfo {
        SUCCESS("success", "正常"),
        ERROR_FAILED_GET_DATA("failedGetData", "取得失敗"),
        ERROR_CONNECT_TIMEOUT("connectTimeout", "タイムアウトエラー");

        private String mId;
        private String mMessage;

        CipherMessageInfo(String str, String str2) {
            this.mId = str;
            this.mMessage = str2;
        }

        public String getId() {
            return this.mId;
        }

        public void setId(String str) {
            this.mId = str;
        }

        public String getMessage() {
            return this.mMessage;
        }

        public void setMessage(String str) {
            this.mMessage = str;
        }
    }

    public static CipherMessageInfo loadData(Context context, KeyId keyId, int i, Integer num) {
        Log.d(TAG, "CipherUtil::loadData() start out");
        synchronized (sLoadKeyLock) {
            Log.d(TAG, "CipherUtil::loadData() start in");
            boolean z = false;
            if (i < 0) {
                i = 0;
            }
            ArrayList arrayList = new ArrayList();
            HashSet hashSet = new HashSet();
            confirmProduct();
            Integer num2 = 30000;
            if (num == null || !isInteger(Integer.toString(num.intValue()))) {
                num = 30000;
            } else {
                num2 = num;
            }
            CipherMessageInfo keyInfo = getKeyInfo(keyId, createUrl(keyId), null, num, num2);
            hashSet.add(keyInfo.getId());
            arrayList.add(keyInfo.getId());
            if (CipherMessageInfo.SUCCESS.getId().equals(keyInfo.getId())) {
                Log.d(TAG, "CipherUtil::loadData() success");
                return keyInfo;
            }
            Log.d(TAG, "CipherUtil::loadData() error");
            CipherMessageInfo cipherMessageInfo = keyInfo;
            while (arrayList.size() - 1 < i) {
                cipherMessageInfo = getKeyInfo(keyId, createUrl(keyId), null, num, num2);
                hashSet.add(cipherMessageInfo.getId());
                arrayList.add(keyInfo.getId());
                Log.d(TAG, "CipherUtil::loadData() retry:" + (arrayList.size() - 1));
            }
            Iterator it = hashSet.iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                }
                if (CipherMessageInfo.ERROR_CONNECT_TIMEOUT.getId().equals((String) it.next())) {
                    z = true;
                    break;
                }
            }
            Log.d(TAG, "CipherUtil::loadData() end");
            if (!z) {
                return cipherMessageInfo;
            }
            if (hashSet.size() != 1) {
                return cipherMessageInfo;
            }
            return CipherMessageInfo.ERROR_CONNECT_TIMEOUT;
        }
    }

    private static boolean confirmProduct() {
        boolean isProdServer = mSmt.isProdServer();
        Log.d(TAG, "CipherUtil::confirmProduct() result:" + isProdServer);
        isProduct = isProdServer;
        return isProdServer;
    }

    private static String createUrl(KeyId keyId) {
        String path;
        Log.d(TAG, "CipherUtil::createUrl() start");
        StringBuilder sb = new StringBuilder();
        DomaiInfo.SA.getPath();
        SmtConst smtConst = mSmt;
        String consumerKey = smtConst.getConsumerKey();
        String consumerSecret = smtConst.getConsumerSecret();
        if (isProduct) {
            path = DomaiInfo.SA.getPath();
        } else {
            path = DomaiInfo.TVESPA.getPath();
        }
        sb.append(path);
        sb.append(APPEND_URL);
        sb.append("/");
        sb.append(keyId.getApp());
        sb.append("/");
        sb.append(keyId.getVer());
        sb.append("/");
        sb.append("data");
        sb.append("/");
        sb.append(FILE_NAME);
        sb.append("?");
        sb.append("consumer_key");
        sb.append(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
        sb.append(consumerKey);
        sb.append(Const.REQUEST_PARAM_SEPARATE_STR);
        sb.append("consumer_secret");
        sb.append(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
        sb.append(consumerSecret);
        Log.d(TAG, "CipherUtil::createUrl() url：" + sb.toString());
        Log.d(TAG, "CipherUtil::createUrl() end");
        return sb.toString();
    }

    private static CipherMessageInfo getKeyInfo(KeyId keyId, String str, Map<String, String> map, Integer num, Integer num2) {
        Log.d(TAG, "CipherUtil::getKeyInfo() start");
        Log.d(TAG, "CipherUtil::■ Key File Get ■");
        BasicHttpParams basicHttpParams = new BasicHttpParams();
        HttpConnectionParams.setConnectionTimeout(basicHttpParams, num.intValue());
        HttpConnectionParams.setSoTimeout(basicHttpParams, num2.intValue());
        DefaultHttpClient defaultHttpClient = new DefaultHttpClient(basicHttpParams);
        try {
            LinkedHashMap linkedHashMap = new LinkedHashMap();
            HttpGet httpGet = new HttpGet(str);
            if (map != null) {
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    httpGet.addHeader(entry.getKey(), entry.getValue());
                }
            }
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(defaultHttpClient.execute(httpGet).getEntity().getContent(), "UTF-8"));
            StringBuilder sb = new StringBuilder();
            while (true) {
                String readLine = bufferedReader.readLine();
                if (readLine == null) {
                    break;
                }
                sb.append(readLine + "\n");
            }
            sKeyMapList.clear();
            for (Map.Entry<String, JsonElement> entry2 : ((JsonObject) new Gson().fromJson(sb.toString(), JsonObject.class)).entrySet()) {
                linkedHashMap.put(entry2.getKey(), entry2.getValue().getAsString());
            }
            LinkedHashMap linkedHashMap2 = new LinkedHashMap();
            linkedHashMap2.put(KeyInfoPamram.KEY.getGetKey(), (String) linkedHashMap.get(KeyInfoPamram.KEY.getGetKey()));
            linkedHashMap2.put(KeyInfoPamram.IV.getGetKey(), (String) linkedHashMap.get(KeyInfoPamram.IV.getGetKey()));
            linkedHashMap2.put(KeyInfoPamram.VERSION.getGetKey(), keyId.getVer());
            sAppKeyMap.put(keyId.getApp(), linkedHashMap2);
            Log.d(TAG, "CipherUtil::getKeyInfo() set TARGETAPP[" + keyId.getApp() + "]");
            StringBuilder sb2 = new StringBuilder();
            sb2.append("CipherUtil::getKeyInfo() set key=");
            sb2.append((String) linkedHashMap2.get(KeyInfoPamram.KEY.getGetKey()));
            Log.d(TAG, sb2.toString());
            Log.d(TAG, "CipherUtil::getKeyInfo() set iv=" + ((String) linkedHashMap2.get(KeyInfoPamram.IV.getGetKey())));
            Log.d(TAG, "CipherUtil::getKeyInfo() set version=" + ((String) linkedHashMap2.get(KeyInfoPamram.VERSION.getGetKey())));
            Log.d(TAG, "CipherUtil::getKeyInfo() end");
            return CipherMessageInfo.SUCCESS;
        } catch (IOException e) {
            Log.d(TAG, "CipherUtil::getKeyInfo() IOExceptio");
            Log.d(TAG, "CipherUtil::getKeyInfo() IOException message=" + e.getMessage() + " ex=" + e.toString());
            if ((e instanceof ConnectTimeoutException) || (e instanceof SocketTimeoutException)) {
                Log.d(TAG, "CipherUtil::getKeyInfo() ERROR_CONNECT_TIMEOUT");
                return CipherMessageInfo.ERROR_CONNECT_TIMEOUT;
            }
            Log.d(TAG, "CipherUtil::getKeyInfo() ERROR_FAILED_GET_DATA");
            return CipherMessageInfo.ERROR_FAILED_GET_DATA;
        } catch (Exception unused) {
            Log.d(TAG, "CipherUtil::getKeyInfo() Exception");
            return CipherMessageInfo.ERROR_FAILED_GET_DATA;
        }
    }

    private static String getKey(String str) {
        Log.d(TAG, "CipherUtil::getKey() start");
        return sAppKeyMap.get(str).get(KeyInfoPamram.KEY.getGetKey());
    }

    private static String getIv(String str) {
        Log.d(TAG, "CipherUtil::getIv() start");
        return sAppKeyMap.get(str).get(KeyInfoPamram.IV.getGetKey());
    }

    public static boolean isDataLoad(KeyId keyId) {
        Log.d(TAG, "CipherUtil::isLoadData() start out");
        synchronized (sLoadKeyLock) {
            Log.d(TAG, "CipherUtil::isLoadData() start in");
            Map<String, Map<String, String>> map = sAppKeyMap;
            if (map == null || map.get(keyId.getApp()) == null || TextUtils.isEmpty(sAppKeyMap.get(keyId.getApp()).get(KeyInfoPamram.KEY.getGetKey()))) {
                return false;
            }
            Log.d(TAG, "CipherUtil::isLoadData() key:" + getKey(keyId.getApp()) + " ,iv:" + getIv(keyId.getApp()));
            String str = sAppKeyMap.get(keyId.getApp()).get(KeyInfoPamram.VERSION.getGetKey());
            Log.d(TAG, "CipherUtil::isLoadData() version=" + str + ", keyId.getVer=" + keyId.getVer());
            if (!TextUtils.isEmpty(str) && !str.equals(keyId.getVer())) {
                return false;
            }
            return true;
        }
    }

    public static void clearKeyData(KeyId keyId) {
        Log.d(TAG, "CipherUtil::clearKeyData() start out");
        synchronized (sLoadKeyLock) {
            Log.d(TAG, "CipherUtil::clearKeyData() start in");
            if (keyId != null && keyId.getApp() != null) {
                Log.d(TAG, "GetProxyModule::clearKeyData() clear TARGETAPP[" + keyId.getApp() + "]");
                sAppKeyMap.put(keyId.getApp(), null);
            }
        }
    }

    public static String encryptWrapper(String str, String str2) {
        String str3;
        Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() start out");
        synchronized (sEncryptLock) {
            Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() start in");
            str3 = "";
            try {
                str3 = new String(Base64.encodeBase64(encrypt(str, getKey(str2), getIv(str2))), "UTF-8");
            } catch (Exception unused) {
                Log.d(TAG, "CipherUtil::(String)encryptWrapper() Exception");
            }
            Log.d(TAG, "CipherUtil::(String)encryptWrapper() end");
        }
        return str3;
    }

    public static byte[] encryptByteWrapper(String str, String str2) {
        byte[] bArr;
        Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() start out");
        synchronized (sEncryptLock) {
            Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() start in");
            bArr = null;
            try {
                bArr = Base64.encodeBase64(encrypt(str, getKey(str2), getIv(str2)));
                new String(bArr, "UTF-8");
            } catch (Exception unused) {
                Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() Exception1");
            }
            Log.d(TAG, "CipherUtil::(byte[])encryptWrapper() end");
        }
        return bArr;
    }

    private static byte[] encrypt(String str, String str2, String str3) throws IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchPaddingException, IOException {
        Log.d(TAG, "CipherUtil::encrypt() start");
        if (TextUtils.isEmpty(str) || TextUtils.isEmpty(str2)) {
            Log.d(TAG, "CipherUtil::encrypt() plainText or key is null");
            return null;
        }
        if (TextUtils.isEmpty(str3)) {
            str3 = str2;
        }
        SecretKeySpec secretKeySpec = new SecretKeySpec(str2.getBytes("UTF-8"), AES);
        Cipher cipher = Cipher.getInstance(DEFAULT_PADDING);
        cipher.init(1, secretKeySpec, convertParameterSpec(str3));
        byte[] doFinal = cipher.doFinal(str.getBytes("UTF-8"));
        Log.d(TAG, "CipherUtil::encrypt() end");
        return doFinal;
    }

    public static String decryptWrapper(String str, String str2) {
        String str3;
        Log.d(TAG, "CipherUtil::decryptWrapper str() start out");
        synchronized (sDecryptLock) {
            Log.d(TAG, "CipherUtil::decryptWrapper str() start in");
            str3 = null;
            try {
                str3 = decryptWrapper(Base64.decodeBase64(str.getBytes()), str2);
            } catch (Exception unused) {
                Log.d(TAG, "CipherUtil::(String)decryptWrapper() Exception");
            }
            Log.d(TAG, "CipherUtil::(String)decryptWrapper() decryptData:" + str3);
            Log.d(TAG, "CipherUtil::(String)decryptWrapper() end");
        }
        return str3;
    }

    public static String decryptWrapper(byte[] bArr, String str) {
        String str2;
        Log.d(TAG, "CipherUtil::(byte[])decryptWrapper() start out");
        synchronized (sDecryptLock) {
            Log.d(TAG, "CipherUtil::(byte[])decryptWrapper() start in");
            str2 = null;
            try {
                str2 = new String(decrypt(bArr, getKey(str), getIv(str)), "UTF-8");
            } catch (Exception unused) {
                Log.d(TAG, "CipherUtil::(byte[])decryptWrapper() Exception");
            }
            Log.d(TAG, "CipherUtil::(byte[])decryptWrapper() decryptData:" + str2);
            Log.d(TAG, "CipherUtil::(byte[])decryptWrapper() end");
        }
        return str2;
    }

    private static byte[] decrypt(byte[] bArr, String str, String str2) throws InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, IOException {
        Log.d(TAG, "CipherUtil::decrypt() start");
        Log.d(TAG, "CipherUtil::decrypt() key:" + str + " ,iv:" + str2);
        if (TextUtils.isEmpty(str)) {
            Log.d(TAG, "CipherUtil::decrypt() key is null");
            return null;
        }
        if (TextUtils.isEmpty(str2)) {
            str2 = str;
        }
        SecretKeySpec secretKeySpec = new SecretKeySpec(str.getBytes("UTF-8"), AES);
        Cipher cipher = Cipher.getInstance(DEFAULT_PADDING);
        cipher.init(2, secretKeySpec, convertParameterSpec(str2));
        byte[] doFinal = cipher.doFinal(bArr, 0, bArr.length);
        Log.d(TAG, "CipherUtil::decrypt() end");
        return doFinal;
    }

    private static IvParameterSpec convertParameterSpec(String str) throws UnsupportedEncodingException {
        Log.d(TAG, "CipherUtil::convertParameterSpec() start");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(str.getBytes("UTF-8"));
        Log.d(TAG, "CipherUtil::convertParameterSpec() end");
        return ivParameterSpec;
    }

    private static AlgorithmParameters convertAlgorithmParameters(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException, IOException {
        Log.d(TAG, "CipherUtil::convertAlgorithmParameters() start");
        AlgorithmParameters algorithmParameters = AlgorithmParameters.getInstance(AES);
        algorithmParameters.init(str.getBytes("UTF-8"));
        Log.d(TAG, "CipherUtil::convertAlgorithmParameters() end");
        return algorithmParameters;
    }

    public static boolean isInteger(String str) {
        Log.d(TAG, "CipherUtil::isInteger() start");
        boolean z = false;
        if (!TextUtils.isEmpty(str)) {
            try {
                if (Integer.parseInt(str) >= 0) {
                    z = true;
                }
            } catch (Exception unused) {
            }
        }
        Log.d(TAG, "CipherUtil::isInteger() result:" + z);
        return z;
    }

    public static void test(Context context) {
        try {
            KeyId keyId = new KeyId();
            keyId.setApp("sky_developer/deezer_soa_ichimura");
            keyId.setVer("1.0.7");
            loadData(context, keyId, 3, null);
            String encryptWrapper = encryptWrapper("あいうえお", keyId.getApp());
            Log.d(TAG, "CipherUtil::encData end");
            Log.d(TAG, "CipherUtil::decData end data:" + decryptWrapper(encryptWrapper, keyId.getApp()));
        } catch (Exception unused) {
            Log.d(TAG, "CipherUtil::getKeyInfo() Exception");
        }
        Log.d(TAG, "CipherUtil::getKeyInfo() start");
    }
}
