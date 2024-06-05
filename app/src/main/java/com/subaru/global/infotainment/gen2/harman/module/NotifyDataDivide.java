package com.subaru.global.infotainment.gen2.harman.module;

import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import com.harman.connectsdk.IResponseCallback;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import com.subaru.global.infotainment.gen2.harman.error.HarmanErrorManager;
import java.util.ArrayList;
import java.util.Iterator;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class NotifyDataDivide {
    private static Handler sTransferMonitorHandler;

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public interface IterateJsonArrayCallback {
        void callback(JSONObject jSONObject);
    }

    public void notifyData(JSONObject jSONObject, HarmanOTACallbackListener harmanOTACallbackListener) {
        HarmanOTAUtil.logDebug("start");
        String optString = jSONObject.optString("notify");
        HarmanOTAUtil.logDebug(optString);
        if (TextUtils.equals(optString, "availableMapRegions")) {
            try {
                HarmanOTADownloadQueueManager.getInstanse().createDLList(jSONObject);
                HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.AVAILABLE_MAP_REGIONS_KEY, HarmanOTAKVSUtil.AVAILABLE_MAP_REGIONS, jSONObject);
            } catch (Exception e) {
                Log.e("TEST", "notify:availableMapRegions -> Error : " + e.getMessage());
                e.printStackTrace();
            }
        } else if (TextUtils.equals(optString, "downloadStatus")) {
            try {
                checkDownloadStatus(jSONObject, harmanOTACallbackListener);
            } catch (Exception e2) {
                HarmanOTAUtil.logError("notify:downloadStatus -> Error");
                e2.printStackTrace();
            }
        } else if (TextUtils.equals(optString, "accessoryTransferStatus")) {
            try {
                checkAccessoryStatus(jSONObject);
            } catch (Exception e3) {
                HarmanOTAUtil.logError("notify:accessoryFileTransferStatus -> Error");
                e3.printStackTrace();
            }
        } else if (TextUtils.equals(optString, "accessoryFileTransferProgress")) {
            try {
                accessoryFileTransferProgress(jSONObject);
            } catch (Exception e4) {
                HarmanOTAUtil.logError("notify:accessoryFileTransferProgress -> Error");
                e4.printStackTrace();
            }
        } else if (TextUtils.equals(optString, "error")) {
            try {
                HarmanErrorManager.getInstance().divideGenericError(HarmanAPI.NOTIFY_ERROR, HarmanOTAManager.getInstance().getErrorCode(jSONObject));
            } catch (Exception e5) {
                HarmanOTAUtil.logError("notify:error -> Error");
                e5.printStackTrace();
            }
        } else if (TextUtils.equals("accessoryInformation", optString)) {
            checkAccessoryInformation(jSONObject);
        } else if (TextUtils.equals("mapSubscriptionDetails", optString)) {
            try {
                HarmanOTAKVSUtil.saveMapSubscriptionDetails(jSONObject);
            } catch (Exception e6) {
                HarmanOTAUtil.logError("notify:mapSubscriptionExpiryStatus:Error");
                e6.printStackTrace();
            }
        } else if (TextUtils.equals("mapSubscriptionExpiryStatus", optString)) {
            try {
                HarmanErrorManager.getInstance().reqMapSubscriptionDetails();
            } catch (Exception e7) {
                HarmanOTAUtil.logError("notify:mapSubscriptionExpiryStatus:Error");
                e7.printStackTrace();
            }
        } else if (TextUtils.equals("currentMapDetails", optString)) {
            checkCurrentMapDetails(jSONObject);
        } else if (TextUtils.equals("notifyFileTransferFailure", optString)) {
            int errorCode = HarmanOTAManager.getInstance().getErrorCode(jSONObject);
            try {
                if (!Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY_NOTIFY_FAIL, HarmanOTAKVSUtil.NOTIFY_FAIL_FLAG)).booleanValue()) {
                    HarmanErrorManager.getInstance().dividenotifyFileTransferFailure(HarmanAPI.NOTIFY_FILE_TRANSFER_FAILURE, errorCode);
                    HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_NOTIFY_FAIL, HarmanOTAKVSUtil.NOTIFY_FAIL_FLAG, true);
                }
            } catch (Exception e8) {
                HarmanOTAUtil.logError("notify:notifyFileTransferFailure -> OtherError");
                e8.printStackTrace();
            }
        }
        try {
            if (Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY_NOTIFY_FAIL, HarmanOTAKVSUtil.NOTIFY_FAIL_FLAG)).booleanValue()) {
                return;
            }
            transferProgressMonitor(jSONObject);
        } catch (Exception e9) {
            e9.printStackTrace();
        }
    }

    private void checkAccessoryInformation(JSONObject jSONObject) {
        String str;
        String str2;
        JSONObject optJSONObject = jSONObject.optJSONObject("info");
        String str3 = null;
        if (optJSONObject != null) {
            String optString = optJSONObject.optString("deviceCode");
            String optString2 = optJSONObject.optString("productCode");
            str = optString;
            str3 = optJSONObject.optString("huModel");
            str2 = optString2;
        } else {
            str = null;
            str2 = null;
        }
        if (HarmanOTAManager.getInstance().getServiceIdentifier() != "com.hac.mapService.TomTom.Gen5" && str3.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen5Prefix)) {
            HarmanOTAManager.getInstance().setServiceIdentifier("com.hac.mapService.TomTom.Gen5");
        } else if (HarmanOTAManager.getInstance().getServiceIdentifier() != "com.hac.mapService.TomTom.Gen4" && str3.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen4Prefix)) {
            HarmanOTAManager.getInstance().setServiceIdentifier("com.hac.mapService.TomTom.Gen4");
        }
        if (TextUtils.equals(str3, HarmanOTAKVSUtil.HU_MODEL_Gen3_Prefix)) {
            return;
        }
        if (str3 != null && str3.startsWith(HarmanOTAKVSUtil.HU_MODEL_Gen5Prefix)) {
            optJSONObject.remove("huModel");
            try {
                optJSONObject.put("huModel", HarmanOTAKVSUtil.HU_MODEL_Gen4Prefix);
            } catch (JSONException unused) {
            }
        }
        HarmanOTAAccessor.setAccessoryConnectFlag(true);
        if (TextUtils.isEmpty(str) || TextUtils.isEmpty(str2)) {
            return;
        }
        String string = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "deviceCode");
        String string2 = HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, "productCode");
        ArrayList<JSONObject> arrayList = new ArrayList<>();
        if (!TextUtils.isEmpty(string) && !TextUtils.isEmpty(string2) && (!TextUtils.equals(str, string) || !TextUtils.equals(str2, string2))) {
            try {
                Iterator<JSONObject> it = HarmanOTAAccessor.getDownloadList().iterator();
                while (it.hasNext()) {
                    arrayList.add(createCancelDownloadParam(it.next()));
                }
                arrayList.add(createRemoveDeviceParam(string, string2));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        boolean booleanValue = Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG)).booleanValue();
        boolean booleanValue2 = Boolean.valueOf(HarmanOTAKVSUtil.getString(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.MOBILE_DATA_CONNECTION)).booleanValue();
        HarmanOTAKVSUtil.initKVS(HarmanOTAKVSUtil.MAIN_KEY);
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.AUTO_UPDATE_FLAG, Boolean.valueOf(booleanValue));
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.MOBILE_DATA_CONNECTION, Boolean.valueOf(booleanValue2));
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY, HarmanOTAKVSUtil.ACCESSORY_FLAG, true);
        Iterator<String> keys = optJSONObject.keys();
        while (keys.hasNext()) {
            String next = keys.next();
            try {
                Object obj = optJSONObject.get(next);
                if (obj != null) {
                    HarmanOTAUtil.logDebug("write kvs : " + next + " is " + obj);
                    HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY, next, obj);
                } else {
                    HarmanOTAUtil.logDebug("write kvs : " + next + " is null (skip)");
                }
            } catch (JSONException unused2) {
            }
        }
        HarmanOTAManager.getInstance().updateSerficeIdentifer();
        if (!arrayList.isEmpty()) {
            recursiveRequest(arrayList);
        }
        HarmanOTAWebViewBinder.getInstanse().getHarmanOTACallbackListener().didAccessoryConnect();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void recursiveRequest(final ArrayList<JSONObject> arrayList) {
        HarmanOTAUtil.logDebug("recursiveRequest: start");
        new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.1
            @Override // java.lang.Runnable
            public void run() {
                HarmanOTAManager.getInstance().sendAsyncRequestAll((JSONObject) arrayList.get(0), HarmanOTAConst.JSON_CONTENT_TYPE, new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.1.1
                    private ArrayList<JSONObject> mParamList;

                    {
                        this.mParamList = new ArrayList<>(arrayList);
                    }

                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onSuccessResponse(Object obj, String str) {
                        HarmanOTAUtil.logDebug("recursiveRequest: ============ IN ============");
                        HarmanOTAUtil.logDebug("recursiveRequest: respPayload : " + obj);
                        HarmanOTAUtil.logDebug("recursiveRequest: serviceIdentifier : " + str);
                        HarmanOTAUtil.logDebug("recursiveRequest: ============================");
                        goNext();
                    }

                    @Override // com.harman.connectsdk.IResponseCallback
                    public void onErrorResponse(int i) {
                        HarmanOTAUtil.logDebug("recursiveRequest: ============ IN ============");
                        HarmanOTAUtil.logDebug("recursiveRequest: errorCode : " + i);
                        HarmanOTAUtil.logDebug("recursiveRequest: ============================");
                        goNext();
                    }

                    private void goNext() {
                        this.mParamList.remove(0);
                        if (this.mParamList.isEmpty()) {
                            HarmanOTAUtil.logDebug("recursiveRequest: end");
                            return;
                        }
                        HarmanOTAUtil.logDebug("recursiveRequest: continue");
                        NotifyDataDivide.this.recursiveRequest(this.mParamList);
                        this.mParamList = null;
                    }
                });
            }
        });
    }

    private void checkCurrentMapDetails(JSONObject jSONObject) {
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_GEN4, HarmanOTAKVSUtil.NOTIFY_CURRENT_MAP_DETAILS, jSONObject);
    }

    private void checkAccessoryStatus(JSONObject jSONObject) throws Exception {
        HarmanOTAUtil.logDebug("start");
        HarmanErrorManager.getInstance().dismissAlert();
        JSONArray jSONArray = jSONObject.getJSONArray("data");
        for (int i = 0; i < jSONArray.length(); i++) {
            JSONObject jSONObject2 = jSONArray.getJSONObject(i);
            int optInt = jSONObject2.optInt("accessoryTransferStatus", 0);
            if (!HarmanEnum.AccessoryTransferStatus.TRANSFER_INITIATED.equalNum(optInt) && !HarmanEnum.AccessoryTransferStatus.TRANSFER_IN_PROGRESS.equalNum(optInt)) {
                HarmanErrorManager.getInstance().divideAccessoryTransferStatus(HarmanAPI.NOTIFY_ACCESSORY_TRANSFER_STATUS, jSONObject2);
                return;
            }
        }
    }

    JSONObject createRegion(int i, int i2) throws JSONException {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("regionID", i);
        jSONObject.put("fromVersion", i2);
        return jSONObject;
    }

    JSONObject createProducts(int i, int i2, int i3, JSONArray jSONArray) throws JSONException {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("productID", i);
        jSONObject.put("supplierID", i2);
        jSONObject.put("baselineID", i3);
        jSONObject.put("Regions", jSONArray);
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject createCheckForUpdateParam(JSONObject jSONObject) throws JSONException {
        return new JSONObject().put("req", "checkForUpdate").put("data", new JSONArray().put(new JSONObject().put("deviceCode", jSONObject.optString("deviceCode")).put("productCode", jSONObject.optString("productCode")).put("products", new JSONArray().put(createProducts(jSONObject.optInt("productID"), jSONObject.optInt("supplierID"), jSONObject.optInt("baselineID"), new JSONArray().put(createRegion(jSONObject.optInt("regionID"), jSONObject.optInt("fromVersion"))))))));
    }

    private JSONObject createRemoveDeviceParam(String str, String str2) throws JSONException {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("req", "removeDevices");
        JSONArray jSONArray = new JSONArray();
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("deviceCode", str);
        jSONObject2.put("productCode", str2);
        jSONArray.put(jSONObject2);
        jSONObject.put("data", jSONArray);
        return jSONObject;
    }

    private JSONObject createCancelDownloadParam(JSONObject jSONObject) throws JSONException {
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("req", "cancelDownload");
        JSONArray jSONArray = new JSONArray();
        JSONObject jSONObject3 = new JSONObject();
        Iterator<String> keys = jSONObject.keys();
        while (keys.hasNext()) {
            String next = keys.next();
            jSONObject3.put(next, jSONObject.opt(next));
        }
        jSONArray.put(jSONObject3);
        jSONObject2.put("data", jSONArray);
        return jSONObject2;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handleCheckForUpdateResultOnTransferProgress(JSONObject jSONObject) {
        try {
            final IterateJsonArrayCallback iterateJsonArrayCallback = new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.2
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    if (jSONObject2.optInt("type") == 1) {
                        HarmanErrorManager.getInstance().call(HarmanOriginalError.TRANSFER_IN_PROGRESS_MAX, HarmanAPI.NOTIFY_ACCESSORY_FILE_TRANSFER_PROGRESS);
                    }
                }
            };
            final IterateJsonArrayCallback iterateJsonArrayCallback2 = new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.3
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    new JsonArrayIterator().iterate(jSONObject2, "Updates", iterateJsonArrayCallback);
                }
            };
            final IterateJsonArrayCallback iterateJsonArrayCallback3 = new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.4
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    new JsonArrayIterator().iterate(jSONObject2, "Regions", iterateJsonArrayCallback2);
                }
            };
            new JsonArrayIterator().iterate(jSONObject, "data", new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.5
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    new JsonArrayIterator().iterate(jSONObject2, "products", iterateJsonArrayCallback3);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void accessoryFileTransferProgress(JSONObject jSONObject) throws Exception {
        HarmanErrorManager.getInstance().dismissAlert();
        if (TextUtils.equals(HarmanOTAManager.getInstance().getServiceIdentifier(), "com.hac.mapService.TomTom.Gen4") || TextUtils.equals(HarmanOTAManager.getInstance().getServiceIdentifier(), "com.hac.mapService.TomTom.Gen5")) {
            new JsonArrayIterator().iterate(jSONObject, "data", new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.6
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    if (jSONObject2.optInt("progress") == 100) {
                        try {
                            HarmanOTAUtil.logDebug("accessoryFileTransferProgress : progress Max");
                            HarmanOTADownloadQueueManager.getInstanse().settransferMapDataProgress(jSONObject2);
                            HarmanOTAManager.getInstance().sendAsyncRequest(NotifyDataDivide.this.createCheckForUpdateParam(jSONObject2), HarmanOTAConst.JSON_CONTENT_TYPE, HarmanOTAManager.getInstance().getServiceIdentifier(), new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.6.1
                                @Override // com.harman.connectsdk.IResponseCallback
                                public void onSuccessResponse(Object obj, String str) {
                                    HarmanOTAUtil.logDebug("============ IN ============");
                                    HarmanOTAUtil.logDebug("respPayload : " + obj);
                                    HarmanOTAUtil.logDebug("serviceIdentifier : " + str);
                                    HarmanOTAUtil.logDebug("============================");
                                    NotifyDataDivide.this.handleCheckForUpdateResultOnTransferProgress((JSONObject) obj);
                                }

                                @Override // com.harman.connectsdk.IResponseCallback
                                public void onErrorResponse(int i) {
                                    HarmanOTAUtil.logDebug("============ IN ============");
                                    HarmanOTAUtil.logDebug("errorCode : " + i);
                                    HarmanOTAUtil.logDebug("============================");
                                }
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
        }
    }

    public void checkDownloadStatus(JSONObject jSONObject, HarmanOTACallbackListener harmanOTACallbackListener) throws Exception {
        JSONArray optJSONArray = jSONObject.optJSONArray("data");
        for (int i = 0; i < optJSONArray.length(); i++) {
            checkComplete(harmanOTACallbackListener, jSONObject, optJSONArray.getJSONObject(i));
        }
    }

    private void checkComplete(HarmanOTACallbackListener harmanOTACallbackListener, JSONObject jSONObject, JSONObject jSONObject2) throws Exception {
        int optInt = jSONObject2.optInt("status");
        boolean z = HarmanOTADownloadJsonParser.getContainsDownloadList(jSONObject) != null;
        HarmanOTADownloadQueueManager instanse = HarmanOTADownloadQueueManager.getInstanse();
        boolean isNext = instanse.isNext();
        if (z) {
            if ((HarmanEnum.DownloadStatus.DOWNLOAD_INITIATED.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_IN_PROGRESS.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWLOAD_NOT_DOWNLOADED.equalNum(optInt)) ? false : true) {
                HarmanOTADownloadJsonParser.removeContainsDownloadList(jSONObject);
                isNext = instanse.isNext();
            }
            if (HarmanOTAAccessor.isManualDownloadFlag()) {
                boolean z2 = HarmanEnum.DownloadStatus.DOWNLOAD_COMPLETED.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_FAIL_DB_ERROR.equalNum(optInt);
                if (!(z2 || HarmanEnum.DownloadStatus.DOWNLOAD_INITIATED.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_IN_PROGRESS.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWLOAD_NOT_DOWNLOADED.equalNum(optInt))) {
                    HarmanOTAAccessor.initDownloadList();
                    isNext = instanse.isNext();
                    HarmanOTAAccessor.setManualDownloadFlag(false);
                } else if (z2 && isNext) {
                    HarmanOTAUtil.logDebug("DL完了");
                    new Thread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.7
                        HarmanOTACallbackListener mCallbackListener;
                        final /* synthetic */ HarmanOTACallbackListener val$callbackListener;

                        {
                            this.val$callbackListener = harmanOTACallbackListener;
                            this.mCallbackListener = harmanOTACallbackListener;
                        }

                        @Override // java.lang.Runnable
                        public void run() {
                            HarmanOTAManager.getInstance().queueRequest(this.mCallbackListener);
                        }
                    }).run();
                }
            }
        }
        boolean r1 = false;
        if (HarmanEnum.DownloadStatus.DOWNLOAD_COMPLETED.equalNum(optInt)) {
            r1 = (isNext || !z || HarmanOTAAccessor.isAccessoryConnectFlag()) ? false : true;
            if (!isNext) {
                HarmanOTAAccessor.setManualDownloadFlag(false);
            }
        } else if (HarmanEnum.DownloadStatus.DOWNLOAD_INITIATED.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_IN_PROGRESS.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_STATE_INVALID.equalNum(optInt) || HarmanEnum.DownloadStatus.DOWNLOAD_FAIL_SUBSCRIPTION_INVALID.equalNum(optInt)) {
            r1 = false;
        }
        if (!isNext) {
            instanse.setdownloadMapDataProgress(new JSONObject());
        }
        if (r1) {
            HarmanOTAUtil.logDebug("DL終了");
            HarmanErrorManager.getInstance().divideDownloadStatus(HarmanAPI.NOTIFY_DOWNLOAD_STATUS, optInt);
        }
    }

    private static void startTransferTimer(Runnable runnable) {
        cancelTransferTimer(false);
        Handler handler = new Handler(Looper.getMainLooper());
        sTransferMonitorHandler = handler;
        handler.postDelayed(runnable, 120000L);
    }

    public static void cancelTransferTimer(boolean z) {
        if (z) {
            HarmanOTADownloadQueueManager instanse = HarmanOTADownloadQueueManager.getInstanse();
            if (TextUtils.equals("accessoryFileTransferProgress", instanse.gettransferMapDataProgress().optString("notify"))) {
                instanse.settransferMapDataProgress(new JSONObject());
            }
        }
        Handler handler = sTransferMonitorHandler;
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
            sTransferMonitorHandler = null;
        }
    }

    private static Runnable createTransferTimeout() {
        return new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.8
            @Override // java.lang.Runnable
            public void run() {
                Handler unused = NotifyDataDivide.sTransferMonitorHandler = null;
                HarmanOTADownloadQueueManager.getInstanse().settransferMapDataProgress(new JSONObject());
                HarmanErrorManager.getInstance().call(HarmanOriginalError.TRANSFER_TIMEOUT_ERROR, HarmanAPI.NOTIFY_ACCESSORY_TRANSFER_STATUS);
                HarmanOTAWebViewBinder.getInstanse().runNativeEvent(HarmanOTAWebViewBinder.NATIVE_EVENT_TRANSFER_MONITOR_TIMEOUT, null);
            }
        };
    }

    private static void transferProgressMonitor(final JSONObject jSONObject) {
        String optString = jSONObject.optString("notify");
        final HarmanOTADownloadQueueManager instanse = HarmanOTADownloadQueueManager.getInstanse();
        if (TextUtils.equals(optString, "availableMapRegions") || TextUtils.equals("accessoryInformation", optString)) {
            return;
        }
        int i = 0;
        if (TextUtils.equals("regionsDownloadProgress", optString)) {
            cancelTransferTimer(false);
            JSONArray optJSONArray = jSONObject.optJSONArray("data");
            while (i < optJSONArray.length()) {
                if (optJSONArray.optJSONObject(i).optInt("status") <= HarmanEnum.DownloadStatus.DOWNLOAD_COMPLETED.getStatusCode()) {
                    instanse.setdownloadMapDataProgress(jSONObject);
                } else {
                    instanse.setdownloadMapDataProgress(new JSONObject());
                }
                i++;
            }
            return;
        }
        if (TextUtils.equals("accessoryFileTransferProgress", optString)) {
            cancelTransferTimer(false);
            new JsonArrayIterator().iterate(jSONObject, "data", new IterateJsonArrayCallback() { // from class: com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.9
                @Override // com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide.IterateJsonArrayCallback
                public void callback(JSONObject jSONObject2) {
                    if (jSONObject2.optInt("progress") == 0) {
                        //HarmanOTADownloadQueueManager.this.settransferMapDataProgress(new JSONObject());
                        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
                    } else {
                       // HarmanOTADownloadQueueManager.this.settransferMapDataProgress(jSONObject);
                        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, true);
                    }
                }
            });
            return;
        }
        if (TextUtils.equals("downloadStatus", optString)) {
            cancelTransferTimer(false);
            JSONArray optJSONArray2 = jSONObject.optJSONArray("data");
            while (i < optJSONArray2.length()) {
                if (HarmanEnum.DownloadStatus.DOWNLOAD_INITIATED.equalNum(optJSONArray2.optJSONObject(i).optInt("status"))) {
                    instanse.setdownloadMapDataProgress(jSONObject);
                } else {
                    instanse.setdownloadMapDataProgress(new JSONObject());
                }
                i++;
            }
            return;
        }
        if (TextUtils.equals("accessoryTransferStatus", optString)) {
            cancelTransferTimer(false);
            JSONArray optJSONArray3 = jSONObject.optJSONArray("data");
            for (int i2 = 0; i2 < optJSONArray3.length(); i2++) {
                int optInt = optJSONArray3.optJSONObject(i2).optInt("accessoryTransferStatus");
                if (!HarmanEnum.AccessoryTransferStatus.TRANSFER_IN_PROGRESS.equalNum(optInt)) {
                    if (HarmanEnum.AccessoryTransferStatus.TRANSFER_INITIATED.equalNum(optInt)) {
                        instanse.settransferMapDataProgress(jSONObject);
                        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, true);
                    } else {
                        instanse.settransferMapDataProgress(new JSONObject());
                        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
                    }
                }
            }
            return;
        }
        if (TextUtils.equals("regionUpdateAvailable", optString)) {
            if (HarmanOTAKVSUtil.readSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER).optBoolean(HarmanOTAKVSUtil.TRANSFER_SHOW)) {
                return;
            }
            startTransferTimer(createTransferTimeout());
        } else if (TextUtils.equals("notifyFileTransferFailure", optString)) {
            cancelTransferTimer(false);
            instanse.settransferMapDataProgress(new JSONObject());
            HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
        }
    }
}
