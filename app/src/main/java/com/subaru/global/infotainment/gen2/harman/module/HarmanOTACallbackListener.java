package com.subaru.global.infotainment.gen2.harman.module;

import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.application.MCApplication;
import com.harman.connectsdk.IHACServiceManagerCallback;
import com.harman.connectsdk.IResponseCallback;
import com.subaru.global.infotainment.gen2.StarLinkApplication;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.error.HarmanErrorManager;
import java.util.EventListener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTACallbackListener extends IHACServiceManagerCallback {
    private CallbackListener mCallbackListener;

    /* loaded from: classes.dex */
    public interface CallbackListener extends EventListener {
        void callbackResponse(String str, Object obj, String str2);
    }

    public HarmanOTACallbackListener(CallbackListener callbackListener) {
        this.mCallbackListener = null;
        this.mCallbackListener = callbackListener;
    }

    private boolean checkKvs() {
        if (MCApplication.getInstance().getKvsHelper() != null) {
            return true;
        }
        HarmanOTAUtil.logDebug("getKvsHelper is null");
        Log.e("HarmanOTACallbackListener", "print stack", new Throwable());
        return false;
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void didHACServiceConnect(String str, int i) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("serviceIdentifier : " + str);
        HarmanOTAUtil.logDebug("errorCode : " + i);
        HarmanOTAUtil.logDebug("============================");
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void didHACServiceDisconnect(JSONObject jSONObject) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("JSONObject : " + jSONObject);
        HarmanOTAUtil.logDebug("============================");
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void didAccessoryConnect() {
        HarmanOTAUtil.logDebug("start");
        if (checkKvs()) {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTACallbackListener.1
                @Override // java.lang.Runnable
                public void run() {
                    ((StarLinkApplication) MCApplication.getInstance()).getMSWebViewBinder().postAccessoryEvent(true, false);
                }
            });
        }
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void didAccessoryDisconnect() {
        HarmanOTAUtil.logDebug("start");
        if (checkKvs()) {
            HarmanOTAAccessor.setAccessoryConnectFlag(false);
            HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTACallbackListener.2
                @Override // java.lang.Runnable
                public void run() {
                    ((StarLinkApplication) MCApplication.getInstance()).getMSWebViewBinder().postAccessoryEvent(false, false);
                    HarmanErrorManager.getInstance().dismissAlert();
                }
            });
            HarmanOTADownloadQueueManager instanse = HarmanOTADownloadQueueManager.getInstanse();
            String optString = instanse.gettransferMapDataProgress().optString("notify");
            if (TextUtils.equals("accessoryFileTransferProgress", optString)) {
                instanse.settransferMapDataProgress(new JSONObject());
            } else if (TextUtils.equals("accessoryTransferStatus", optString)) {
                instanse.settransferMapDataProgress(new JSONObject());
            }
        }
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void notifyData(Object obj, String str, String str2) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("Object : " + obj);
        HarmanOTAUtil.logDebug("contentType : " + str);
        HarmanOTAUtil.logDebug("serviceIdentifier : " + str2);
        HarmanOTAUtil.logDebug("============================");
        if (checkKvs()) {
            new NotifyDataDivide().notifyData((JSONObject) obj, this);
            this.mCallbackListener.callbackResponse(str, obj, str2);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void notifyDataExtend(JSONObject jSONObject, String str, String str2, HarmanAPI harmanAPI) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("payload : " + jSONObject);
        HarmanOTAUtil.logDebug("contentType : " + str);
        HarmanOTAUtil.logDebug("serviceIdentifier : " + str2);
        HarmanOTAUtil.logDebug("============================");
        if (checkKvs()) {
            HarmanErrorManager.getInstance().divideGenericError(harmanAPI, HarmanOTAManager.getInstance().getErrorCode(jSONObject));
            this.mCallbackListener.callbackResponse(str, jSONObject, str2);
            try {
                if (TextUtils.equals("startDownload", jSONObject.getString("resp"))) {
                    try {
                        JSONArray optJSONArray = jSONObject.optJSONArray("data");
                        for (int i = 0; i < optJSONArray.length(); i++) {
                            String optString = optJSONArray.getJSONObject(i).optString("status");
                            if (!TextUtils.equals(optString, "1") && !TextUtils.equals(optString, "2")) {
                                HarmanOTADownloadQueueManager.getInstanse().setdownloadMapDataProgress(new JSONObject());
                            }
                            HarmanOTADownloadQueueManager.getInstanse().setdownloadMapDataProgress(jSONObject);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (Exception e2) {
                        e2.printStackTrace();
                    }
                }
            } catch (JSONException e3) {
                e3.printStackTrace();
            }
        }
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public Object onQuery(Object obj, String str, String str2) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("payload : " + obj);
        HarmanOTAUtil.logDebug("contentType : " + str);
        HarmanOTAUtil.logDebug("serviceIdentifier : " + str2);
        HarmanOTAUtil.logDebug("============================");
        return new OnQueryDivide().divideQuery(obj);
    }

    @Override // com.harman.connectsdk.IHACServiceManagerCallback
    public void onAsyncQuery(Object obj, String str, String str2, IResponseCallback iResponseCallback) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("============ IN ============");
        HarmanOTAUtil.logDebug("Object : " + obj);
        HarmanOTAUtil.logDebug("contentType : " + str);
        HarmanOTAUtil.logDebug("serviceIdentifier : " + str2);
        HarmanOTAUtil.logDebug("============================");
    }
}
