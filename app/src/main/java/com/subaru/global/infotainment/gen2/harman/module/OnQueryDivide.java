package com.subaru.global.infotainment.gen2.harman.module;

import android.text.TextUtils;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
class OnQueryDivide {
    /* JADX INFO: Access modifiers changed from: package-private */
    public Object divideQuery(Object obj) {
        Object checkMapUpdateFlag;
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = (JSONObject) obj;
        HarmanOTAUtil.logDebug("QueryType : " + jSONObject.optString("query"));
        String optString = jSONObject.optString("query");
        optString.hashCode();
        char c = 65535;
        switch (optString.hashCode()) {
            case -1760806295:
                if (optString.equals("queryMapUpdateFlag")) {
                    c = 0;
                    break;
                }
                break;
            case -1602967477:
                if (optString.equals("queryAutoDownloadFlag")) {
                    c = 1;
                    break;
                }
                break;
            case -1202699168:
                if (optString.equals("queryNetworkConnectivityMode")) {
                    c = 2;
                    break;
                }
                break;
            case -181405153:
                if (optString.equals("queryRegionSettings")) {
                    c = 3;
                    break;
                }
                break;
            case 697479628:
                if (optString.equals("queryAutoUpdateFlag")) {
                    c = 4;
                    break;
                }
                break;
            case 1553865075:
                if (optString.equals("queryDownloadChannel")) {
                    c = 5;
                    break;
                }
                break;
        }
        switch (c) {
            case 0:
                checkMapUpdateFlag = checkMapUpdateFlag();
                break;
            case 1:
                checkMapUpdateFlag = checkAutoDownloadFlag();
                break;
            case 2:
                checkMapUpdateFlag = checkNetworkConnectionMode();
                break;
            case 3:
                checkMapUpdateFlag = checkRegionSettings();
                break;
            case 4:
                checkMapUpdateFlag = checkAutoUpdateFlag();
                break;
            case 5:
                checkMapUpdateFlag = checkDownloadChannel();
                break;
            default:
                HarmanOTAUtil.logDebug("不明なQuery : " + jSONObject.optString("query"));
                checkMapUpdateFlag = null;
                break;
        }
        HarmanOTAUtil.logDebug("Query : " + checkMapUpdateFlag);
        return checkMapUpdateFlag;
    }

    private Object checkAutoDownloadFlag() {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            jSONObject = respQueryJSON("queryAutoDownloadFlag", Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG)).booleanValue());
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return jSONObject;
        }
    }

    private Object checkMapUpdateFlag() {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            jSONObject = respQueryJSON("queryMapUpdateFlag", true);
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return jSONObject;
        }
    }

    private Object checkAutoUpdateFlag() {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            jSONObject = respQueryJSON("queryAutoUpdateFlag", Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG)).booleanValue());
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return jSONObject;
        }
    }

    private Object checkDownloadChannel() {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            if (Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.MOBILE_DATA_CONNECTION)).booleanValue()) {
                jSONObject = respQueryJSON("queryDownloadChannel", HarmanEnum.DownloadChannel.NONE.getCode());
            } else {
                jSONObject = respQueryJSON("queryDownloadChannel", HarmanEnum.DownloadChannel.DOWNLOAD_OVER_WIFI.getCode());
            }
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
        return jSONObject;
    }

    private JSONObject checkNetworkConnectionMode() {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            jSONObject = respQueryJSON("queryNetworkConnectivityMode", HarmanOTAUtil.getNetworkStatus().getCode());
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return jSONObject;
        }
    }

    private JSONObject checkRegionSettings() {
        JSONArray jSONArray;
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = null;
        try {
            if (!TextUtils.equals("com.hac.mapService.TomTom.Gen4", HarmanOTAManager.getInstance().getServiceIdentifier()) && !TextUtils.equals("com.hac.mapService.TomTom.Gen5", HarmanOTAManager.getInstance().getServiceIdentifier())) {
                jSONArray = new JSONArray();
                jSONObject = respQueryRegionSettingsJSON("queryRegionSettings", jSONArray);
                HarmanOTAUtil.logDebug("return -> " + jSONObject);
                return jSONObject;
            }
            jSONArray = HarmanOTAKVSUtil.readSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_GEN4).getJSONArray(HarmanOTAKVSUtil.SELECTED_REGIONS);
            jSONObject = respQueryRegionSettingsJSON("queryRegionSettings", jSONArray);
            HarmanOTAUtil.logDebug("return -> " + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
            return jSONObject;
        }
    }

    private JSONObject respQueryJSON(String str, boolean z) throws Exception {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("resp", str);
        jSONObject.put("status", z);
        return jSONObject;
    }

    private JSONObject respQueryJSON(String str, int i) throws Exception {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("resp", str);
        if (TextUtils.equals(str, "queryDownloadChannel")) {
            jSONObject.put("status", i);
        } else if (TextUtils.equals(str, "queryNetworkConnectivityMode")) {
            jSONObject.put("mode", i);
        }
        return jSONObject;
    }

    private JSONObject respQueryRegionSettingsJSON(String str, JSONArray jSONArray) throws Exception {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("resp", str);
        if (TextUtils.equals(str, "queryRegionSettings")) {
            jSONObject.put("data", jSONArray);
        }
        if (jSONObject.isNull("data")) {
            JSONArray jSONArray2 = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            String string = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "deviceCode");
            if (!TextUtils.isEmpty(string)) {
                jSONObject2.put("deviceCode", string);
            }
            String string2 = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "productCode");
            if (!TextUtils.isEmpty(string2)) {
                jSONObject2.put("productCode", string2);
            }
            jSONObject2.put("errorCode", 1);
            jSONObject2.put("products", new JSONArray());
            jSONArray2.put(jSONObject2);
            jSONObject.put("data", jSONArray2);
        }
        return jSONObject;
    }
}
