package com.subaru.global.infotainment.gen2.harman.error;

import android.text.TextUtils;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanErrorManager {
    private static HarmanErrorManager instance;

    private HarmanErrorManager() {
    }

    public static HarmanErrorManager getInstance() {
        if (instance == null) {
            instance = new HarmanErrorManager();
        }
        return instance;
    }

    public void divideGenericError(HarmanAPI harmanAPI, int i) {
        call(HarmanEnum.Error.getOriginalError(i), harmanAPI);
    }

    public void dividenotifyFileTransferFailure(HarmanAPI harmanAPI, int i) {
        call(HarmanEnum.notifyFileTransferFailureError.getOriginalError(i), harmanAPI);
    }

    public void divideDownloadStatus(HarmanAPI harmanAPI, int i) {
        if (HarmanEnum.DownloadStatus.DOWNLOAD_FAIL_DB_ERROR.equalNum(i)) {
            return;
        }
        call(HarmanEnum.DownloadStatus.getOriginalError(i), harmanAPI);
    }

    public void divideAccessoryTransferStatus(HarmanAPI harmanAPI, JSONObject jSONObject) {
        String str = "";
        HarmanOriginalError originalError = HarmanEnum.AccessoryTransferStatus.getOriginalError(jSONObject.optInt("accessoryTransferStatus", 0));
        if (HarmanOriginalError.TRANSFER_COMPLETED.equals(originalError)) {
            try {
                originalError.setMessageExtendPrefix("");
                String string = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "huModel");
                if (!string.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen4Prefix) && !string.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen5Prefix)) {
                    JSONObject optJSONObject = HarmanOTAKVSUtil.readSettingsKVS(HarmanOTAKVSUtil.AVAILABLE_MAP_REGIONS_KEY).optJSONObject(HarmanOTAKVSUtil.AVAILABLE_MAP_REGIONS);
                    if (optJSONObject != null) {
                        String optString = jSONObject.optString("regionID");
                        JSONArray optJSONArray = optJSONObject.optJSONObject("data").optJSONArray("products");
                        for (int i = 0; i < optJSONArray.length(); i++) {
                            JSONArray optJSONArray2 = optJSONArray.getJSONObject(i).optJSONArray("Regions");
                            int i2 = 0;
                            while (true) {
                                if (i2 < optJSONArray2.length()) {
                                    JSONObject jSONObject2 = optJSONArray2.getJSONObject(i2);
                                    if (TextUtils.equals(optString, jSONObject2.optString("regionID"))) {
                                        str = jSONObject2.optString("regionName");
                                        break;
                                    }
                                    i2++;
                                }
                            }
                        }
                        originalError.setMessageExtendPrefix(str);
                    }
                }
                JSONObject optJSONObject2 = HarmanOTAKVSUtil.readSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_GEN4).optJSONObject(HarmanOTAKVSUtil.NOTIFY_CURRENT_MAP_DETAILS);
                if (optJSONObject2.optJSONObject("mapJson").optJSONArray(HarmanOTAConst.JSON_NDS_PRODUCT) != null) {
                    String optString2 = jSONObject.optString("regionID");
                    JSONArray optJSONArray3 = optJSONObject2.optJSONObject("mapJson").optJSONArray(HarmanOTAConst.JSON_NDS_PRODUCT);
                    for (int i3 = 0; i3 < optJSONArray3.length(); i3++) {
                        JSONArray optJSONArray4 = optJSONArray3.getJSONObject(i3).optJSONArray(HarmanOTAConst.JSON_NDS_REGION);
                        int i4 = 0;
                        while (true) {
                            if (i4 < optJSONArray4.length()) {
                                JSONObject jSONObject3 = optJSONArray4.getJSONObject(i4);
                                if (TextUtils.equals(optString2, jSONObject3.optString("id"))) {
                                    str = jSONObject3.optString("name");
                                    break;
                                }
                                i4++;
                            }
                        }
                    }
                    originalError.setMessageExtendPrefix(str);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        call(originalError, harmanAPI);
    }

    public void reqMapSubscriptionDetails() {
        call(HarmanOriginalError.MAP_SUBSCRIPTION_DETAILS, HarmanAPI.REQ_MAP_SUBSCRIPTION_DETAILS);
    }

    public void call(HarmanOriginalError harmanOriginalError, HarmanAPI harmanAPI) {
        new HarmanErrorNotify().divideNotify(harmanOriginalError, harmanAPI);
    }

    public void dismissAlert() {
        new HarmanErrorNotify().dismissAlert();
    }
}
