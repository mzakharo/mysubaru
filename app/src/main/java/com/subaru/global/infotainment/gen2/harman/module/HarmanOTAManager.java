package com.subaru.global.infotainment.gen2.harman.module;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.text.TextUtils;
import com.android.lib.mcm.application.MCApplication;
import com.harman.connectsdk.HACServiceManager;
import com.harman.connectsdk.IResponseCallback;
import com.subaru.global.infotainment.gen2.StarLinkApplication;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTAManager extends BroadcastReceiver {
    private static HarmanOTAManager sInstance;
    private boolean mInformCalled = false;
    private String mServiceIdentifier = "com.hac.mapService.TomTom";

    private HarmanOTAManager() {
        updateSerficeIdentifer();
    }

    public void updateSerficeIdentifer() {
        String string = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "huModel");
        if (!TextUtils.isEmpty(string)) {
            if (string.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen5Prefix)) {
                this.mServiceIdentifier = "com.hac.mapService.TomTom.Gen5";
                return;
            }
            if (string.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen4Prefix)) {
                if (this.mServiceIdentifier == "com.hac.mapService.TomTom.Gen5") {
                    return;
                }
                this.mServiceIdentifier = "com.hac.mapService.TomTom.Gen4";
                return;
            } else if (string.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen3Prefix)) {
                this.mServiceIdentifier = "com.hac.mapService.TomTom";
                return;
            }
        }
        this.mServiceIdentifier = "com.hac.mapService.TomTom";
    }

    public void setServiceIdentifier(String str) {
        this.mServiceIdentifier = str;
    }

    public String getServiceIdentifier() {
        return this.mServiceIdentifier;
    }

    public static HarmanOTAManager getInstance() {
        if (sInstance == null) {
            sInstance = new HarmanOTAManager();
        }
        return sInstance;
    }

    public void initializeWithParam(HarmanOTACallbackListener harmanOTACallbackListener) {
        HarmanOTAUtil.logDebug("start");
        try {
            MCApplication starLinkApplication = StarLinkApplication.getInstance();
            PackageInfo packageInfo = starLinkApplication.getPackageManager().getPackageInfo(starLinkApplication.getPackageName(), 0);
            JSONObject jSONObject = new JSONObject();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject.put(HarmanOTAConst.JSON_APP_INFO, jSONObject2);
            jSONObject2.put(HarmanOTAConst.JSON_APP_IDENTIFIER, HarmanOTAConst.HARMAN_LIBRARY_APP_NAME);
            jSONObject2.put(HarmanOTAConst.JSON_VERSION, packageInfo.versionName);
            jSONObject2.put(HarmanOTAConst.JSON_SUB_VERSION, packageInfo.versionName);
            JSONArray jSONArray = new JSONArray();
            Iterator<String> it = HarmanOTAConst.TOM_TOM_SERVICE_IDENTIFIER_LIST.iterator();
            while (it.hasNext()) {
                jSONArray.put(it.next());
            }
            jSONObject.put(HarmanOTAConst.JSON_SERVICE_INFO, jSONArray);
            HarmanOTAUtil.logDebug("============ out ============");
            HarmanOTAUtil.logDebug("jsonObject : " + jSONObject);
            HarmanOTAUtil.logDebug("=============================");
            HACServiceManager.getInstance().initializeWithParam(jSONObject, starLinkApplication, harmanOTACallbackListener);
            if (this.mInformCalled) {
                return;
            }
            this.mInformCalled = true;
            StarLinkApplication.getInstance().registerReceiver(this, new IntentFilter("android.net.conn.CONNECTIVITY_CHANGE"));
            requestAccessoryFileTransferProgress();
            initInform();
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    @Override // android.content.BroadcastReceiver
    public void onReceive(Context context, Intent intent) {
        informNetworkStatus();
    }

    private String getValidatedServiceIdentifer(JSONObject jSONObject, String str) {
        HashMap hashMap = new HashMap();
        hashMap.put("com.hac.mapService.TomTom", new ArrayList(Arrays.asList("retrieveAvailableMapRegions")));
        String str2 = null;
        for (Object str3 : hashMap.keySet()) {
            Iterator it = ((ArrayList) hashMap.get(str3)).iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                }
                if (TextUtils.equals(jSONObject.optString("req"), (String) it.next())) {
                    str2 = str3.toString();
                    break;
                }
            }
            if (str2 != null) {
                break;
            }
        }
        return str2 == null ? str : str2;
    }

    public void sendAsyncRequest(JSONObject jSONObject, String str, String str2, IResponseCallback iResponseCallback) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug(jSONObject.toString());
        HarmanOTAUtil.logDebug("============ out ============");
        HarmanOTAUtil.logDebug("jsonObject : " + jSONObject);
        HarmanOTAUtil.logDebug("requestType : " + str);
        HarmanOTAUtil.logDebug("identifier : " + str2);
        HarmanOTAUtil.logDebug("=============================");
        HACServiceManager.getInstance().sendAsyncRequest(jSONObject, str, getValidatedServiceIdentifer(jSONObject, str2), iResponseCallback);
    }

    public void sendAsyncRequestAll(JSONObject jSONObject, String str, IResponseCallback iResponseCallback) {
        Iterator<String> it = HarmanOTAConst.TOM_TOM_SERVICE_IDENTIFIER_LIST.iterator();
        while (it.hasNext()) {
            String next = it.next();
            if (TextUtils.equals(getServiceIdentifier(), next)) {
                HarmanOTAUtil.logDebug("start");
                HarmanOTAUtil.logDebug(jSONObject.toString());
                HarmanOTAUtil.logDebug("============ out ============");
                HarmanOTAUtil.logDebug("jsonObject : " + jSONObject);
                HarmanOTAUtil.logDebug("requestType : " + str);
                HarmanOTAUtil.logDebug("identifier : " + next);
                HarmanOTAUtil.logDebug("=============================");
                HACServiceManager.getInstance().sendAsyncRequest(jSONObject, str, next, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.1
                    private IResponseCallback targetCallback;
                    private String targetIdentifier;
                    final /* synthetic */ IResponseCallback val$callback;
                    final /* synthetic */ String val$serviceIdentifier;

                    {
                        this.val$callback = iResponseCallback;
                        this.val$serviceIdentifier = next;
                        this.targetCallback = iResponseCallback;
                        this.targetIdentifier = next;
                    }

                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onSuccessResponse(Object obj, String str2) {
                        if (TextUtils.equals(this.targetIdentifier, HarmanOTAManager.this.getServiceIdentifier())) {
                            this.targetCallback.onSuccessResponse(obj, str2);
                        }
                    }

                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onErrorResponse(int i) {
                        if (TextUtils.equals(this.targetIdentifier, HarmanOTAManager.this.getServiceIdentifier())) {
                            this.targetCallback.onErrorResponse(i);
                        }
                    }
                });
            }
        }
    }

    public void queueRequest(final HarmanOTACallbackListener harmanOTACallbackListener) {
        HarmanOTAUtil.logDebug("start");
        try {
            JSONObject next = HarmanOTADownloadQueueManager.getInstanse().next();
            if (next != null) {
                HarmanOTAUtil.logDebug("============ out ============");
                HarmanOTAUtil.logDebug("jsonObject : " + next);
                HarmanOTAUtil.logDebug("requestType : application/json");
                HarmanOTAUtil.logDebug("identifier : " + getInstance().getServiceIdentifier());
                HarmanOTAUtil.logDebug("=============================");
                getInstance().sendAsyncRequest(next, HarmanOTAConst.JSON_CONTENT_TYPE, getInstance().getServiceIdentifier(), new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.2
                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onSuccessResponse(Object obj, String str) {
                        HarmanOTAUtil.logDebug("queueRequest:success");
                        HarmanOTAUtil.logDebug("============ IN ============");
                        HarmanOTAUtil.logDebug("respPayload : " + obj);
                        HarmanOTAUtil.logDebug("serviceIdentifier : " + str);
                        HarmanOTAUtil.logDebug("=============================");
                        try {
                            handleError(new JSONObject(obj.toString()), str);
                        } catch (JSONException e) {
                            e.printStackTrace();
                            handleError(HarmanEnum.Error.GENERIC_ERROR.getErrorCode());
                        }
                    }

                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onErrorResponse(int i) {
                        HarmanOTAUtil.logDebug("queueRequest:error");
                        HarmanOTAUtil.logDebug("============ IN ============");
                        HarmanOTAUtil.logDebug("errorCode : " + i);
                        HarmanOTAUtil.logDebug("=============================");
                        handleError(i);
                    }

                    private void handleError(int i) {
                        try {
                            JSONObject jSONObject = new JSONObject();
                            jSONObject.put("errorCode", i);
                            handleError(jSONObject, HarmanOTAManager.getInstance().getServiceIdentifier());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    private void handleError(JSONObject jSONObject, String str) {
                        if (HarmanOTAManager.this.getErrorCode(jSONObject) != 0 || jSONObject.optInt("respCode") != 0) {
                            HarmanOTAAccessor.initDownloadList();
                            HarmanOTAAccessor.setManualDownloadFlag(false);
                        } else {
                            try {
                                new NotifyDataDivide().checkDownloadStatus(jSONObject, harmanOTACallbackListener);
                                HarmanOTADownloadQueueManager.getInstanse().setdownloadMapDataProgress(jSONObject);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        harmanOTACallbackListener.notifyDataExtend(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, str, HarmanAPI.REQ_START_DOWNLOAD);
                    }
                });
            }
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    public int getErrorCode(JSONObject jSONObject) {
        String str = null;
        try {
            if (jSONObject.has("errorCode")) {
                str = jSONObject.getString("errorCode");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        if (TextUtils.isEmpty(str)) {
            try {
                JSONArray jSONArray = jSONObject.getJSONArray("data");
                if (jSONArray != null && jSONArray.length() != 0) {
                    str = jSONArray.getJSONObject(0).getString("errorCode");
                }
                HarmanOTAUtil.logDebug("errorCode not exist. : " + jSONObject.toString());
            } catch (JSONException e2) {
                e2.printStackTrace();
            }
        }
        if (TextUtils.isEmpty(str)) {
            return 0;
        }
        return Integer.parseInt(str);
    }

    public void initInform() {
        HarmanOTAUtil.logDebug("start");
        if (Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG)).booleanValue()) {
            HarmanOTAAccessor.setManualDownloadFlag(false);
        }
        informAutoDownloadStatus(new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.3
            @Override // com.harman.connectsdk.IResponseCallback
            public void onSuccessResponse(Object obj, String str) {
                HarmanOTAManager.this.informAutoUpdateFlag(null);
            }

            @Override // com.harman.connectsdk.IResponseCallback
            public void onErrorResponse(int i) {
                HarmanOTAManager.this.informAutoUpdateFlag(null);
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void informAutoUpdateFlag(IResponseCallback iResponseCallback) {
        HarmanOTAUtil.logDebug("start");
        try {
            JSONObject createInformJson = createInformJson("informAutoUpdateStatus");
            HarmanOTAUtil.logDebug("============ out ============");
            HarmanOTAUtil.logDebug("jsonObject : " + createInformJson);
            HarmanOTAUtil.logDebug("requestType : application/json");
            HarmanOTAUtil.logDebug("identifier : " + getInstance().getServiceIdentifier());
            HarmanOTAUtil.logDebug("=============================");
            getInstance().sendAsyncRequestAll(createInformJson, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.4
                IResponseCallback mCallback;
                final /* synthetic */ IResponseCallback val$callback;

                {
                    this.val$callback = iResponseCallback;
                    this.mCallback = iResponseCallback == null ? new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.4.1
                        @Override // com.harman.connectsdk.IResponseCallback
                        public void onErrorResponse(int i) {
                        }

                        @Override // com.harman.connectsdk.IResponseCallback
                        public void onSuccessResponse(Object obj, String str) {
                        }
                    } : iResponseCallback;
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("informAutoUpdateFlag:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                    this.mCallback.onSuccessResponse(obj, str);
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("informAutoUpdateFlag:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("i : " + i);
                    HarmanOTAUtil.logDebug("============================");
                    this.mCallback.onErrorResponse(i);
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    private void informAutoDownloadStatus(IResponseCallback iResponseCallback) {
        HarmanOTAUtil.logDebug("start");
        try {
            JSONObject createInformJson = createInformJson("informAutoDownloadStatus");
            HarmanOTAUtil.logDebug("============ out ============");
            HarmanOTAUtil.logDebug("jsonObject : " + createInformJson);
            HarmanOTAUtil.logDebug("requestType : application/json");
            HarmanOTAUtil.logDebug("identifier : " + getInstance().getServiceIdentifier());
            HarmanOTAUtil.logDebug("=============================");
            getInstance().sendAsyncRequestAll(createInformJson, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.5
                IResponseCallback mCallback;
                final /* synthetic */ IResponseCallback val$callback;

                {
                    this.val$callback = iResponseCallback;
                    this.mCallback = iResponseCallback == null ? new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.5.1
                        @Override // com.harman.connectsdk.IResponseCallback
                        public void onErrorResponse(int i) {
                        }

                        @Override // com.harman.connectsdk.IResponseCallback
                        public void onSuccessResponse(Object obj, String str) {
                        }
                    } : iResponseCallback;
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("informAutoDownloadStatus:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                    this.mCallback.onSuccessResponse(obj, str);
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("informAutoUpdateFlag:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("i : " + i);
                    HarmanOTAUtil.logDebug("============================");
                    this.mCallback.onErrorResponse(i);
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    private void informNetworkStatus() {
        HarmanOTAUtil.logDebug("start");
        try {
            HarmanEnum.NetworkConnectivityMode networkStatus = HarmanOTAUtil.getNetworkStatus();
            boolean z = HarmanEnum.NetworkConnectivityMode.Undefined != networkStatus;
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("req", "informNetworkStatus");
            jSONObject.put("status", z);
            jSONObject.put("mode", networkStatus.getCode());
            HarmanOTAUtil.logDebug("============ out ============");
            HarmanOTAUtil.logDebug("jsonObject : " + jSONObject);
            HarmanOTAUtil.logDebug("requestType : application/json");
            HarmanOTAUtil.logDebug("identifier : " + getInstance().getServiceIdentifier());
            HarmanOTAUtil.logDebug("=============================");
            getInstance().sendAsyncRequestAll(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.6
                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("informNetworkStatus:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("informNetworkStatus:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    private void requestAccessoryFileTransferProgress() {
        HarmanOTAUtil.logDebug("start");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("req", "accessoryFileTransferProgress");
            jSONObject.put("notifyStatus", true);
            getInstance().sendAsyncRequestAll(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.7
                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("accessoryFileTransferProgress:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("accessoryFileTransferProgress:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    public void stopAhaService() {
        HarmanOTAUtil.logDebug("stopAhaService start");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("req", "stopAhaService");
            jSONObject.put("status", true);
            getInstance().sendAsyncRequestAll(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.8
                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("stopAhaService:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("stopAhaService:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    public void killAhaService() {
        HarmanOTAUtil.logDebug("killAhaService start");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("req", "killAhaService");
            jSONObject.put("status", true);
            getInstance().sendAsyncRequestAll(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.9
                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("killAhaService:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("killAhaService:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                }
            });
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    public void clearData() {
        HarmanOTAUtil.logDebug("ClearData start");
        try {
            String string = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "deviceCode");
            String string2 = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "productCode");
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("req", "clearData");
            jSONObject.put("deviceCode", string);
            jSONObject.put("productCode", string2);
            jSONObject.put("status", true);
            getInstance().sendAsyncRequestAll(jSONObject, HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager.10
                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str) {
                    HarmanOTAUtil.logDebug("ClearData:success");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("Object : " + obj);
                    HarmanOTAUtil.logDebug("s : " + str);
                    HarmanOTAUtil.logDebug("============================");
                    HarmanOTAWebViewBinder.getInstanse().runNativeEvent(HarmanOTAWebViewBinder.NATIVE_EVENT_SHOW_POPUP_CLEAR_DATA, null);
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("ClearData:error");
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                }
            });
            HarmanOTADownloadQueueManager.getInstanse().settransferMapDataProgress(new JSONObject());
            HarmanOTADownloadQueueManager.getInstanse().setdownloadMapDataProgress(new JSONObject());
            HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
        } catch (Exception e) {
            HarmanOTAUtil.logError(e.getMessage());
            e.printStackTrace();
        }
    }

    private JSONObject createInformJson(String str) throws Exception {
        HarmanOTAUtil.logDebug("start");
        boolean booleanValue = Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG)).booleanValue();
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("req", str);
        jSONObject.put("status", booleanValue);
        return jSONObject;
    }
}
