package com.subaru.global.infotainment.gen2.harman;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTAAccessor {
    private static boolean sAccessoryConnectFlag = false;
    private static List<JSONObject> sDownloadList = new ArrayList();
    private static boolean sManualDownloadFlag = false;

    public static boolean isAccessoryConnectFlag() {
        return sAccessoryConnectFlag;
    }

    public static void setAccessoryConnectFlag(boolean z) {
        sAccessoryConnectFlag = z;
    }

    public static boolean isManualDownloadFlag() {
        return sManualDownloadFlag;
    }

    public static void setManualDownloadFlag(boolean z) {
        HarmanOTAUtil.logDebug(String.valueOf(z));
        sManualDownloadFlag = z;
    }

    public static List<JSONObject> getDownloadList() {
        return sDownloadList;
    }

    public static void setDownloadList(List<JSONObject> list) {
        HarmanOTAUtil.logDebug(String.valueOf(sManualDownloadFlag));
        sDownloadList = list;
        HarmanOTAUtil.logDebug("setDownloadList :: " + list);
    }

    public static JSONObject getDLObject() {
        return sDownloadList.get(0);
    }

    public static void initDownloadList() {
        sDownloadList = new ArrayList();
    }
}
