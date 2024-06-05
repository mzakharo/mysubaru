package com.subaru.global.infotainment.gen2.harman;

import android.text.TextUtils;
import com.android.lib.mcm.application.MCApplication;
import com.android.lib.mcm.kvswrapper.KvsWrapperService;
import org.apache.log4j.spi.Configurator;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTAKVSUtil {
    public static final String ACCESSORY_FLAG = "accessoryFlag";
    public static final String AUTO_UPDATE_FLAG = "auto_update_check";
    public static final String AVAILABLE_MAP_REGIONS = "availablemapregions";
    public static final String AVAILABLE_MAP_REGIONS_KEY = "availablemapregions_info";
    public static final String DEVICE_CODE = "deviceCode";
    public static final String HU_MODEL = "huModel";
    public static final String HU_MODEL_Gen3Prefix = "Gen3.";
    public static final String HU_MODEL_Gen3_Prefix = "Gen3";
    public static final String HU_MODEL_Gen4Prefix = "CP1.0";
    public static final String HU_MODEL_Gen5Prefix = "CP1.5";
    public static final String INFO = "info";
    public static final String MAIN_KEY = "harman_ota_info";
    public static final String MAIN_KEY_GEN4 = "mobile_ota_gen4";
    public static final String MAIN_KEY_NOTIFY_FAIL = "notify_fail_info";
    public static final String MAIN_KEY_TRANSFER = "transfer_status_info";
    public static final String MAP_SUBSCRIPTION_DETAILS = "mapSubscriptionDetails";
    public static final String MAP_SUBSCRIPTION_SHOWN = "mapSubscriptionShown";
    public static final String MOBILE_DATA_CONNECTION = "mobile_data_connection";
    public static final String NOTIFY_CURRENT_MAP_DETAILS = "notify_current_map_details";
    public static final String NOTIFY_FAIL_FLAG = "notify_fail_flag";
    public static final String PRODUCT_CODE = "productCode";
    public static final String SELECTED_REGIONS = "selected_regions";
    public static final String TRANSFER_SHOW = "transfer_show";

    public static String getString(String str, String str2) {
        JSONObject readSettingsKVS = readSettingsKVS(str);
        if (readSettingsKVS == null) {
            return null;
        }
        String optString = readSettingsKVS.optString(str2);
        return TextUtils.equals(optString, Configurator.NULL) ? "" : optString;
    }

    public static boolean writeSettingsKVS(String str, String str2, Object obj) {
        if (obj == null) {
            return false;
        }
        JSONObject readSettingsKVS = readSettingsKVS(str);
        try {
            readSettingsKVS.put(str2, obj);
            HarmanOTAUtil.logDebug(readSettingsKVS.toString());
            return saveKVS(str, readSettingsKVS.toString().getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void saveMapSubscriptionDetails(JSONObject jSONObject) throws JSONException {
        JSONObject jSONObject2 = new JSONObject();
        JSONArray jSONArray = jSONObject.getJSONArray("data");
        if (jSONArray == null || jSONArray.length() == 0) {
            HarmanOTAUtil.logDebug("error : " + jSONObject.toString());
        } else {
            jSONObject2.put("expiryDate", jSONArray.getJSONObject(0).getString("expiryDate"));
        }
        writeSettingsKVS(MAIN_KEY, "mapSubscriptionDetails", jSONObject2);
    }

    public static JSONObject readSettingsKVS(String str) {
        try {
            String readKVS = readKVS(str);
            if (TextUtils.isEmpty(readKVS) && initKVS(str)) {
                readKVS = readKVS(str);
            }
            return new JSONObject(readKVS);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean initKVS(String str) {
        JSONObject jSONObject = new JSONObject();
        try {
            if (TextUtils.equals(MAIN_KEY, str)) {
                jSONObject.put(AUTO_UPDATE_FLAG, false);
                jSONObject.put(MOBILE_DATA_CONNECTION, false);
                jSONObject.put(ACCESSORY_FLAG, false);
            } else {
                TextUtils.equals(MAIN_KEY_GEN4, str);
            }
            String jSONObject2 = jSONObject.toString();
            HarmanOTAUtil.logDebug("json" + jSONObject2);
            return saveKVS(str, jSONObject2.getBytes());
        } catch (JSONException e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static boolean saveKVS(String str, byte[] bArr) {
        try {
            KvsWrapperService.Helper kvsHelper = MCApplication.getInstance().getKvsHelper();
            synchronized (kvsHelper) {
                kvsHelper.getKvsWrapperService().saveData(bArr, str);
            }
            return true;
        } catch (Exception unused) {
            HarmanOTAUtil.logError("error");
            return false;
        }
    }

    public static String readKVS(String str) {
        byte[] data;
        try {
            KvsWrapperService.Helper kvsHelper = MCApplication.getInstance().getKvsHelper();
            synchronized (kvsHelper) {
                data = kvsHelper.getKvsWrapperService().getData(str);
            }
            if (data == null) {
                return null;
            }
            String str2 = new String(data);
            HarmanOTAUtil.logDebug("readKVS" + str2);
            return str2;
        } catch (Exception e) {
            HarmanOTAUtil.logError("error");
            e.printStackTrace();
            return null;
        }
    }

    public static boolean isMapSubscriptionAlertShown() {
        return Boolean.valueOf(readSettingsKVS(MAIN_KEY_GEN4).optBoolean(MAP_SUBSCRIPTION_SHOWN)).booleanValue();
    }
}
