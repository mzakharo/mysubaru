package com.harman.services.maps;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.harman.services.Log;
import com.harman.services.URLConnection;
import com.uievolution.microserver.utils.HttpCatalogs;

/* loaded from: classes.dex */
public class MUDPHandler {
    public static final String TAG = "MUDPHandler";
    int RETRY_COUNT = 3;
    URLConnection mUrlConnection = new URLConnection();

    public String getEntitlements(String str, String str2) {
        String str3 = null;
        try {
            String str4 = "https://device.subaru-maps.com/api/entitlements?productCode=" + str + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_DEVICE_CODE + str2;
            String str5 = TAG;
            Log.i(str5, "URL Sending to MUDP Server:" + str4);
            str3 = this.mUrlConnection.httpGet(str4, this.RETRY_COUNT);
            Log.i(str5, "getEntitlements:Response::" + str3);
            return str3;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getEntitlements:" + e);
            return str3;
        }
    }

    public String getEntitlements(String str, String str2, String str3) {
        String str4 = null;
        try {
            String str5 = "https://device.subaru-maps.com/api/entitlements?productCode=" + str + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_DEVICE_CODE + str2;
            if (str3 != null && str3.length() > 0 && isValidVin(str3)) {
                str5 = str5 + "&vin=" + str3;
            }
            String str6 = TAG;
            Log.i(str6, "URL Sending to MUDP Server:" + str5);
            str4 = this.mUrlConnection.httpGet(str5, this.RETRY_COUNT);
            Log.i(str6, "getEntitlements:Response::" + str4);
            return str4;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getEntitlements:" + e);
            return str4;
        }
    }

    private boolean isValidVin(String str) {
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) != '0') {
                return true;
            }
        }
        return false;
    }

    public String getEntitlementsBySkuId(String str, String str2, String str3) {
        String str4 = null;
        try {
            String str5 = "https://device.subaru-maps.com/api/entitlements?productCode=" + str + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_DEVICE_CODE + str2 + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_SKU_ID + str3;
            String str6 = TAG;
            Log.i(str6, "URL Sending to MUDP Server:" + str5);
            str4 = this.mUrlConnection.httpGet(str5, this.RETRY_COUNT);
            Log.i(str6, "getEntitlementsBySkuId :Response::" + str4);
            return str4;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getEntitlementsBySkuId:" + e);
            return str4;
        }
    }

    public String getSystemSettings(boolean z) {
        String str = null;
        String str2 = z ? "https://device.subaru-maps.com/api/system-settings?key=tomtom-url" : "https://device.subaru-maps.com/api/system-settings?";
        try {
            String str3 = TAG;
            Log.i(str3, "URL Sending to MUDP Server:" + str2);
            str = this.mUrlConnection.httpGet(str2, this.RETRY_COUNT);
            Log.i(str3, "getTomTomURL:Response::" + str);
            return str;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getTomTomURL:" + e);
            return str;
        }
    }

    public boolean updateDataConfiguration(String str, String str2, String str3, String str4) {
        boolean z = false;
        try {
            String str5 = "https://device.subaru-maps.com/api/configurations?productCode=" + str + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_DEVICE_CODE + str2 + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_KEY + MapUtils.URL_KEY_CURRENT_MAP;
            String str6 = TAG;
            Log.i(str6, "URL Sending to MUDP Server:" + str5);
            z = this.mUrlConnection.doUpload(str5, HttpCatalogs.METHOD_PUT, str3);
            Log.i(str6, "updateDataConfiguration:Response status::" + z);
            return z;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "updateDataConfiguration:" + e);
            return z;
        }
    }

    public String getConfiguration(String str, String str2, String str3) {
        String str4 = null;
        try {
            String str5 = "https://device.subaru-maps.com/api/configurations?productCode=" + str + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_DEVICE_CODE + str2 + Const.REQUEST_PARAM_SEPARATE_STR + MapUtils.URL_KEY + MapUtils.URL_KEY_CURRENT_MAP;
            String str6 = TAG;
            Log.i(str6, "URL Sending to MUDP Server:" + str5);
            str4 = this.mUrlConnection.httpGet(str5, this.RETRY_COUNT);
            Log.i(str6, "getConfiguration:Response:" + str4);
            return str4;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getConfiguration:" + e);
            return str4;
        }
    }

    public boolean createLicenceFile(String str, String str2, String str3) {
        boolean z = false;
        try {
            String str4 = TAG;
            Log.i(str4, "URL Sending to MUDP Server:https://device.subaru-maps.com/api/licenses");
            z = this.mUrlConnection.doDownload("https://device.subaru-maps.com/api/licenses", HttpCatalogs.METHOD_POST, str, str3);
            Log.i(str4, "createLicenceFile:Response status::" + z);
            return z;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "createLicenceFile:" + e);
            return z;
        }
    }
}
