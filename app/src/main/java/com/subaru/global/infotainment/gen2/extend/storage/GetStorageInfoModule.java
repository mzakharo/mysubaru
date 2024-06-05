package com.subaru.global.infotainment.gen2.extend.storage;

import android.util.Log;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
import com.clarion.smartaccess.inappbilling.util.LogUtil;
import com.harman.services.maps.MapUtils;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import java.util.HashMap;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class GetStorageInfoModule extends AbstractExtendModule {
    public final String TAG = "GetStorageInfoModule";

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        LogUtil.logDebug("GetStorageInfoModule", "dispatch() start");
        if (mSHTTPRequest == null || mSHTTPResponder == null) {
            LogUtil.logError("GetStorageInfoModule", "request or response is null");
            responseErrorJson(mSHTTPResponder, "M001E", 500);
            return;
        }
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("return_cd", "M001I");
            jSONObject.put(MapUtils.KEY_TOTAL_SIZE, StorageInfo.getTotalSize());
            jSONObject.put("freeSize", StorageInfo.getFreeSize());
            responseJson(mSHTTPResponder, jSONObject.toString(), 200);
        } catch (Exception e) {
            LogUtil.logError("GetStorageInfoModule", "予期せぬエラー");
            LogUtil.logError("GetStorageInfoModule", e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        Log.d("GetStorageInfoModule", "dispatch() end");
    }

    public static void test() {
        Log.d("GetStorageInfoModule", AppInfoUtil.connectionMicroServer("http://127.0.0.1:" + MicroServer.DEFAULT_WIFI_PORT_HTTP + "/get-storage-info", new HashMap(), true, null));
    }
}
