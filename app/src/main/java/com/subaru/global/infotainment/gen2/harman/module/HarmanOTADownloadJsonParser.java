package com.subaru.global.infotainment.gen2.harman.module;

import android.text.TextUtils;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import java.util.ArrayList;
import java.util.Iterator;
import org.json.JSONArray;
import org.json.JSONObject;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class HarmanOTADownloadJsonParser {
    private static String sBaselineID;
    private static String sDeviceCode;
    private static String sProductCode;
    private static String sProductID;
    private static String sSupplierID;

    HarmanOTADownloadJsonParser() {
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void analysisAvailableMapRegion(JSONObject jSONObject) throws Exception {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("json : " + jSONObject.toString());
        JSONObject optJSONObject = jSONObject.optJSONObject("data");
        if (optJSONObject != null) {
            sDeviceCode = optJSONObject.optString("deviceCode");
            sProductCode = optJSONObject.optString("productCode");
            HarmanOTAAccessor.isManualDownloadFlag();
            HarmanOTAAccessor.initDownloadList();
            HarmanOTAAccessor.setManualDownloadFlag(false);
            JSONArray optJSONArray = optJSONObject.optJSONArray("products");
            if (optJSONArray != null) {
                analysisProducts(optJSONArray);
            }
        }
    }

    private static void analysisProducts(JSONArray jSONArray) throws Exception {
        HarmanOTAUtil.logDebug("start");
        for (int i = 0; i < jSONArray.length(); i++) {
            JSONObject optJSONObject = jSONArray.optJSONObject(i);
            sSupplierID = optJSONObject.optString("supplierID");
            sProductID = optJSONObject.optString("id");
            sBaselineID = optJSONObject.optString("baselineID");
            JSONArray optJSONArray = optJSONObject.optJSONArray("Regions");
            if (optJSONArray != null) {
                analysisRegions(optJSONArray);
            }
        }
    }

    private static void analysisRegions(JSONArray jSONArray) throws Exception {
        JSONObject createObject;
        HarmanOTAUtil.logDebug("start");
        ArrayList arrayList = new ArrayList();
        for (int i = 0; i < jSONArray.length(); i++) {
            JSONObject optJSONObject = jSONArray.optJSONObject(i);
            String optString = optJSONObject.optString("regionID");
            int optInt = optJSONObject.optInt("fromVersion");
            if (checkTargetStatus(optJSONObject.optInt("downloadStatus", 99), optJSONObject.optInt("accessoryTransferStatus", 99))) {
                JSONArray optJSONArray = optJSONObject.optJSONArray("Updates");
                if (optJSONArray != null && (createObject = createObject(optString, optInt, getToVersion(optJSONArray))) != null) {
                    arrayList.add(createObject(optString, optInt, getToVersion(optJSONArray)));
                    HarmanOTAUtil.logDebug(createObject.toString());
                }
                HarmanOTAUtil.logDebug("DLリストサイズ" + arrayList.size());
            }
        }
        HarmanOTAAccessor.setDownloadList(arrayList);
    }

    private static int getToVersion(JSONArray jSONArray) throws Exception {
        HarmanOTAUtil.logDebug("start");
        int i = 0;
        for (int i2 = 0; i2 < jSONArray.length(); i2++) {
            int optInt = jSONArray.optJSONObject(i2).optInt("toVersion");
            if (i < optInt) {
                i = optInt;
            }
        }
        return i;
    }

    private static JSONObject createObject(String str, int i, int i2) throws Exception {
        HarmanOTAUtil.logDebug("start");
        if (!isCheckObject(str, i, i2)) {
            return null;
        }
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("deviceCode", sDeviceCode);
        jSONObject.put("productCode", sProductCode);
        jSONObject.put("productID", sProductID);
        jSONObject.put("baselineID", sBaselineID);
        jSONObject.put("supplierID", sSupplierID);
        jSONObject.put("regionID", str);
        jSONObject.put("fromVersion", i);
        jSONObject.put("toVersion", String.valueOf(i2));
        return jSONObject;
    }

    private static boolean isCheckObject(String str, int i, int i2) {
        HarmanOTAUtil.logDebug("start");
        return (TextUtils.isEmpty(sDeviceCode) || TextUtils.isEmpty(sProductCode) || TextUtils.isEmpty(sProductID) || TextUtils.isEmpty(sBaselineID) || TextUtils.isEmpty(sSupplierID) || TextUtils.isEmpty(str) || i >= i2) ? false : true;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static Iterator<JSONObject> getContainsDownloadList(JSONObject jSONObject) throws Exception {
        String str;
        String str2;
        String str3;
        String str4;
        String str5;
        String str6;
        String str7;
        String str8;
        String str9;
        String str10;
        JSONObject jSONObject2;
        HarmanOTAUtil.logDebug("start");
        JSONArray optJSONArray = jSONObject.optJSONArray("data");
        Iterator<JSONObject> it = HarmanOTAAccessor.getDownloadList().iterator();
        while (it.hasNext()) {
            JSONObject next = it.next();
            String str11 = "deviceCode";
            String optString = next.optString("deviceCode");
            String str12 = "productCode";
            String optString2 = next.optString("productCode");
            String str13 = "productID";
            String optString3 = next.optString("productID");
            String str14 = "baselineID";
            String optString4 = next.optString("baselineID");
            String str15 = "supplierID";
            String optString5 = next.optString("supplierID");
            String str16 = "regionID";
            String optString6 = next.optString("regionID");
            String str17 = "fromVersion";
            Iterator<JSONObject> it2 = it;
            String optString7 = next.optString("fromVersion");
            String str18 = optString6;
            JSONObject jSONObject3 = next;
            String optString8 = next.optString("toVersion");
            int i = 0;
            while (i < optJSONArray.length()) {
                JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                JSONArray jSONArray = optJSONArray;
                if (optJSONObject != null) {
                    String optString9 = optJSONObject.optString(str11);
                    str = str11;
                    String optString10 = optJSONObject.optString(str12);
                    str2 = str12;
                    String optString11 = optJSONObject.optString(str13);
                    str3 = str13;
                    String optString12 = optJSONObject.optString(str14);
                    str4 = str14;
                    String optString13 = optJSONObject.optString(str15);
                    str5 = str15;
                    String optString14 = optJSONObject.optString(str16);
                    str6 = str16;
                    String optString15 = optJSONObject.optString(str17);
                    str7 = str17;
                    String optString16 = optJSONObject.optString("toVersion");
                    if (TextUtils.equals(optString, optString9) && TextUtils.equals(optString2, optString10) && TextUtils.equals(optString3, optString11) && TextUtils.equals(optString4, optString12) && TextUtils.equals(optString5, optString13)) {
                        str9 = str18;
                        if (TextUtils.equals(str9, optString14)) {
                            str8 = optString7;
                            if (TextUtils.equals(str8, optString15)) {
                                str10 = optString8;
                                if (TextUtils.equals(str10, optString16)) {
                                    return it2;
                                }
                                HarmanOTAUtil.logDebug("getContainsDownloadList TextUtils.equals false");
                                HarmanOTAUtil.logDebug("getContainsDownloadList targetJson::" + optJSONObject);
                                StringBuilder sb = new StringBuilder();
                                sb.append("getContainsDownloadList dlJson");
                                jSONObject2 = jSONObject3;
                                sb.append(jSONObject2);
                                HarmanOTAUtil.logDebug(sb.toString());
                            }
                        } else {
                            str8 = optString7;
                        }
                    } else {
                        str8 = optString7;
                        str9 = str18;
                    }
                    str10 = optString8;
                    HarmanOTAUtil.logDebug("getContainsDownloadList TextUtils.equals false");
                    HarmanOTAUtil.logDebug("getContainsDownloadList targetJson::" + optJSONObject);
                    StringBuilder sb2 = new StringBuilder();
                    sb2.append("getContainsDownloadList dlJson");
                    jSONObject2 = jSONObject3;
                    sb2.append(jSONObject2);
                    HarmanOTAUtil.logDebug(sb2.toString());
                } else {
                    str = str11;
                    str2 = str12;
                    str3 = str13;
                    str4 = str14;
                    str5 = str15;
                    str6 = str16;
                    str7 = str17;
                    str8 = optString7;
                    str9 = str18;
                    str10 = optString8;
                    jSONObject2 = jSONObject3;
                }
                i++;
                str18 = str9;
                optString7 = str8;
                optString8 = str10;
                jSONObject3 = jSONObject2;
                optJSONArray = jSONArray;
                str11 = str;
                str12 = str2;
                str13 = str3;
                str14 = str4;
                str15 = str5;
                str16 = str6;
                str17 = str7;
            }
            it = it2;
        }
        return null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static boolean removeContainsDownloadList(JSONObject jSONObject) throws Exception {
        HarmanOTAUtil.logDebug("start");
        Iterator<JSONObject> containsDownloadList = getContainsDownloadList(jSONObject);
        boolean z = containsDownloadList != null;
        if (z) {
            containsDownloadList.remove();
        }
        return z;
    }

    private static boolean checkTargetStatus(int i, int i2) {
        HarmanOTAUtil.logDebug("start");
        return (HarmanEnum.DownloadStatus.DOWNLOAD_COMPLETED.equalNum(i) || HarmanEnum.DownloadStatus.DOWNLOAD_IN_PROGRESS.equalNum(i)) ? false : true;
    }
}
