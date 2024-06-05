package com.subaru.global.infotainment.gen2.harman.module;

import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTADownloadQueueManager {
    private static HarmanOTADownloadQueueManager sInstance;
    private JSONObject trMapDataProgress = new JSONObject();
    private JSONObject doMapDataProgress = new JSONObject();

    private HarmanOTADownloadQueueManager() {
    }

    public static HarmanOTADownloadQueueManager getInstanse() {
        if (sInstance == null) {
            sInstance = new HarmanOTADownloadQueueManager();
        }
        return sInstance;
    }

    public void startDownLoad(JSONArray jSONArray) throws Exception {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAAccessor.setDownloadList(new ArrayList());
        ArrayList arrayList = new ArrayList();
        for (int i = 0; i < jSONArray.length(); i++) {
            JSONObject jSONObject = jSONArray.getJSONObject(i);
            if (jSONObject != null) {
                arrayList.add(jSONObject);
                HarmanOTAUtil.logDebug(jSONObject.toString());
            }
        }
        if (arrayList.isEmpty()) {
            return;
        }
        HarmanOTAAccessor.setDownloadList(arrayList);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void createDLList(JSONObject jSONObject) throws Exception {
        HarmanOTADownloadJsonParser.analysisAvailableMapRegion(jSONObject);
    }

    public boolean isNext() {
        return !HarmanOTAAccessor.getDownloadList().isEmpty();
    }

    public JSONObject next() throws Exception {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = new JSONObject();
        JSONArray jSONArray = new JSONArray();
        jSONArray.put(HarmanOTAAccessor.getDLObject());
        jSONObject.put("req", "startDownload");
        jSONObject.put("data", jSONArray);
        return jSONObject;
    }

    public JSONArray getDownloadQueue() {
        HarmanOTAUtil.logDebug("start");
        List<JSONObject> downloadList = HarmanOTAAccessor.getDownloadList();
        JSONArray jSONArray = new JSONArray();
        Iterator<JSONObject> it = downloadList.iterator();
        while (it.hasNext()) {
            jSONArray.put(it.next());
        }
        return jSONArray;
    }

    public JSONObject gettransferMapDataProgress() {
        return this.trMapDataProgress;
    }

    public void settransferMapDataProgress(JSONObject jSONObject) {
        this.trMapDataProgress = jSONObject;
    }

    public JSONObject getdownloadMapDataProgress() {
        return this.doMapDataProgress;
    }

    public void setdownloadMapDataProgress(JSONObject jSONObject) {
        this.doMapDataProgress = jSONObject;
    }
}
