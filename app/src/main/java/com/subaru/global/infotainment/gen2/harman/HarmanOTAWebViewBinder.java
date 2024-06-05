package com.subaru.global.infotainment.gen2.harman;

import android.text.TextUtils;
import android.webkit.WebView;
import com.android.lib.mcm.application.MCApplication;
import com.harman.connectsdk.IResponseCallback;
import com.subaru.global.infotainment.gen2.StarLinkApplication;
import com.subaru.global.infotainment.gen2.harman.module.HarmanOTACallbackListener;
import com.subaru.global.infotainment.gen2.harman.module.HarmanOTADownloadQueueManager;
import com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HarmanOTAWebViewBinder implements HarmanOTACallbackListener.CallbackListener {
    public static final String NATIVE_API_DOMAIN = "AHASDK:";
    public static final String NATIVE_EVENT_SHOW_POPUP_CLEAR_DATA = "NativeEvent.SHOW_POPUP_CLEAR_DATA";
    public static final String NATIVE_EVENT_TRANSFER_MONITOR_TIMEOUT = "NativeEvent.TRANSFER_MONITOR_TIMEOUT";
    private static HarmanOTAWebViewBinder instance;
    private static final List<String> mNotifyDataCallback = new ArrayList();
    private static HarmanOTACallbackListener mHarmanOTACallbackListener = null;

    private HarmanOTAWebViewBinder() {
        mHarmanOTACallbackListener = new HarmanOTACallbackListener(this);
    }

    public HarmanOTACallbackListener getHarmanOTACallbackListener() {
        return mHarmanOTACallbackListener;
    }

    public static HarmanOTAWebViewBinder getInstanse() {
        if (instance == null) {
            instance = new HarmanOTAWebViewBinder();
        }
        return instance;
    }

    private boolean checkApi(String str, String str2) {
        try {
            String decode = URLDecoder.decode(str, "UTF-8");
            if (decode.split(str2).length > 0) {
                return decode.startsWith(str2);
            }
            return false;
        } catch (Exception unused) {
            return false;
        }
    }

    public boolean runNativeApi(String str) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("url:" + str);
        try {
            if (!str.toUpperCase(Locale.US).startsWith(NATIVE_API_DOMAIN)) {
                return false;
            }
            final String substring = str.substring(7);
            if (checkApi(substring, "sendAsyncRequest")) {
                completedRequest("sendAsyncRequest", substring);
                sendAsyncRequest(substring);
            } else if (checkApi(substring, "addNotifyData")) {
                completedRequest("addNotifyData", substring);
                addNotifyData(substring);
            } else if (checkApi(substring, "removeNotifyData")) {
                completedRequest("removeNotifyData", substring);
                removeNotifyData(substring);
            } else if (checkApi(substring, "addDownloadQueue")) {
                completedRequest("addDownloadQueue", substring);
                addDownloadQueue(substring);
            } else if (checkApi(substring, "getDownloadQueue")) {
                completedRequest("getDownloadQueue", substring);
                getDownloadQueue(substring);
            } else if (checkApi(substring, "clearDownloadQueue")) {
                completedRequest("clearDownloadQueue", substring);
                clearDownloadQueue(substring);
            } else if (checkApi(substring, "gettransferMapDataProgress")) {
                completedRequest("gettransferMapDataProgress", substring);
                gettransferMapDataProgress(substring);
            } else if (checkApi(substring, "getdownloadMapDataProgress")) {
                completedRequest("getdownloadMapDataProgress", substring);
                getdownloadMapDataProgress(substring);
            } else if (checkApi(substring, "applySettings")) {
                completedRequest("applySettings", substring);
                applySettings();
            } else if (checkApi(substring, "debug_notifyData")) {
                if (HarmanOTAUtil.isDebug()) {
                    new Thread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder.1
                        @Override // java.lang.Runnable
                        public void run() {
                            String[] params = HarmanOTAWebViewBinder.getParams(substring);
                            try {
                                JSONObject jSONObject = new JSONObject(URLDecoder.decode(params[0], "UTF-8"));
                                if (TextUtils.equals(jSONObject.optString("notify"), "extend_didAccessoryDisconnect")) {
                                    HarmanOTAWebViewBinder.mHarmanOTACallbackListener.didAccessoryDisconnect();
                                } else if (TextUtils.equals(jSONObject.optString("notify"), "extend_didAccessoryConnect")) {
                                    HarmanOTAWebViewBinder.mHarmanOTACallbackListener.didAccessoryConnect();
                                } else {
                                    HarmanOTAWebViewBinder.mHarmanOTACallbackListener.notifyData(jSONObject, params[1], params[2]);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }).start();
                }
                return false;
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }

    private void applySettings() {
        HarmanOTAUtil.logDebug("start");
        try {
            HarmanOTAManager.getInstance().initInform();
        } catch (Exception e) {
            HarmanOTAUtil.logDebug(e.getMessage());
            e.printStackTrace();
        }
    }

    private void getDownloadQueue(String str) {
        HarmanOTAUtil.logDebug("start");
        getNative(str, HarmanOTADownloadQueueManager.getInstanse().getDownloadQueue());
    }

    private void addDownloadQueue(String str) {
        HarmanOTAUtil.logDebug("start");
        String[] params = getParams(str);
        try {
            JSONArray jSONArray = new JSONArray(URLDecoder.decode(params[0], "UTF-8"));
            HarmanOTAUtil.logDebug(URLDecoder.decode(params[0], "UTF-8"));
            HarmanOTADownloadQueueManager.getInstanse().startDownLoad(jSONArray);
            if (HarmanOTAAccessor.getDownloadList().size() > 0) {
                HarmanOTAAccessor.setManualDownloadFlag(true);
                HarmanOTAManager.getInstance().queueRequest(mHarmanOTACallbackListener);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void clearDownloadQueue(String str) {
        HarmanOTAUtil.logDebug("start");
        try {
            HarmanOTAAccessor.initDownloadList();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void gettransferMapDataProgress(String str) {
        HarmanOTAUtil.logDebug("gettransferMapDataProgress start");
        getNative(str, HarmanOTADownloadQueueManager.getInstanse().gettransferMapDataProgress());
    }

    private void getdownloadMapDataProgress(String str) {
        HarmanOTAUtil.logDebug("getdownloadMapDataProgress start");
        getNative(str, HarmanOTADownloadQueueManager.getInstanse().getdownloadMapDataProgress());
    }

    private void getNative(String str, Object obj) {
        HarmanOTAUtil.logDebug("start");
        String[] params = getParams(str);
        StringBuilder sb = new StringBuilder("javascript:");
        sb.append("window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;");
        sb.append("window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;");
        try {
            sb.append("var callback = window.harman_ota.callbacks[\"");
            sb.append(params[0]);
            sb.append("\"];");
            sb.append("if(callback !== undefined) callback(");
            sb.append(obj);
            sb.append(");");
        } catch (Exception e) {
            e.printStackTrace();
        }
        postLoadUrl(sb.toString());
    }

    public static void postLoadUrl(String str) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("==============================================");
        HarmanOTAUtil.logDebug("****  URL : onLoad  ****");
        HarmanOTAUtil.logDebug(str);
        HarmanOTAUtil.logDebug("==============================================");
        ((StarLinkApplication) MCApplication.getInstance()).getMSWebViewBinder().postLoadUrl(str);
    }

    public void onPageFinished(WebView webView, String str) {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAUtil.logDebug("URL : " + str);
        postLoadUrl("javascript:window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;window.harman_ota.result = window.harman_ota.result === undefined ? new Object() : window.harman_ota.result;window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;");
    }

    private static void sendAsyncRequest(String str) {
        HarmanOTAUtil.logDebug("start");
        String[] params = getParams(str);
        try {
            HarmanOTAManager.getInstance().sendAsyncRequest(new JSONObject(URLDecoder.decode(params[0], "UTF-8")), HarmanOTAConst.JSON_CONTENT_TYPE, HarmanOTAManager.getInstance().getServiceIdentifier(), new IResponseCallback() { // from class: com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder.2
                String mCallbackString;
                final /* synthetic */ String[] val$paramsList;

                {
                    this.val$paramsList = params;
                    this.mCallbackString = params[1];
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onSuccessResponse(Object obj, String str2) {
                    String str3;
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("respPayload : " + obj);
                    HarmanOTAUtil.logDebug("serviceIdentifier : " + str2);
                    HarmanOTAUtil.logDebug("============================");
                    try {
                        str3 = ((JSONObject) obj).getString("resp");
                    } catch (JSONException e) {
                        e.printStackTrace();
                        str3 = null;
                    }
                    if (TextUtils.equals("mapSubscriptionDetails", str3)) {
                        try {
                            HarmanOTAKVSUtil.saveMapSubscriptionDetails((JSONObject) obj);
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                    HarmanOTAWebViewBinder.createSendAsyncResponse(this.mCallbackString, obj, HarmanOTAConst.JSON_CONTENT_TYPE, 0);
                }

                @Override // com.harman.connectsdk.IResponseCallback
                public void onErrorResponse(int i) {
                    HarmanOTAUtil.logDebug("============ IN ============");
                    HarmanOTAUtil.logDebug("errorCode : " + i);
                    HarmanOTAUtil.logDebug("============================");
                    HarmanOTAWebViewBinder.createSendAsyncResponse(this.mCallbackString, null, null, i);
                }
            });
        } catch (UnsupportedEncodingException | JSONException e) {
            e.printStackTrace();
        }
    }

    private static void completedRequest(String str, String str2) {
        HarmanOTAUtil.logDebug("start");
        String[] params = getParams(str2);
        StringBuilder sb = new StringBuilder("javascript:");
        sb.append("window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;");
        sb.append("window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;");
        sb.append("var callback = window.harman_ota.callbacks['completedRequest'];");
        sb.append("if(callback !== undefined) callback('");
        sb.append(str);
        sb.append("',");
        if (params == null) {
            sb.append("undefined, undefined);");
        } else if (params.length == 1) {
            sb.append("'");
            sb.append(params[0]);
            sb.append("',undefined);");
        } else if (params.length > 1) {
            sb.append("'");
            sb.append(params[0]);
            sb.append("','");
            sb.append(params[1]);
            sb.append("');");
        }
        postLoadUrl(sb.toString());
    }

    public void runNativeEvent(String str, JSONObject jSONObject) {
        if (jSONObject == null) {
            jSONObject = new JSONObject();
        }
        postLoadUrl("javascript:NativeEvent.onEvent(" + str + "," + jSONObject + ");");
    }

    private static void addNotifyData(String str) {
        HarmanOTAUtil.logDebug("start");
        String str2 = getParams(str)[0];
        List<String> list = mNotifyDataCallback;
        if (list.contains(str2)) {
            return;
        }
        list.add(str2);
    }

    private static void removeNotifyData(String str) {
        HarmanOTAUtil.logDebug("start");
        String str2 = getParams(str)[0];
        List<String> list = mNotifyDataCallback;
        if (list.contains(str2)) {
            list.remove(str2);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static String[] getParams(String str) {
        HarmanOTAUtil.logDebug("start");
        String[] split = str.split("\\(");
        if (split.length != 2) {
            return new String[0];
        }
        String[] split2 = split[1].split("\\)");
        return split2.length != 1 ? new String[0] : split2[0].split(",");
    }

    public void init() {
        HarmanOTAUtil.logDebug("start");
        HarmanOTAManager.getInstance().initializeWithParam(mHarmanOTACallbackListener);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void createSendAsyncResponse(String str, Object obj, String str2, int i) {
        HarmanOTAUtil.logDebug("start");
        StringBuilder sb = new StringBuilder("javascript:");
        HarmanOTAUtil.logDebug("WebView:on");
        if (TextUtils.isEmpty(str)) {
            return;
        }
        sb.append("window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;");
        sb.append("window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;");
        sb.append("var callback = window.harman_ota.callbacks[\"");
        sb.append(str);
        sb.append("\"];");
        sb.append("if(callback !== undefined) callback(");
        if (obj == null) {
            sb.append("undefined");
            sb.append(" ,");
            sb.append("undefined");
            sb.append(",");
            sb.append(i);
        } else {
            sb.append(obj.toString());
            sb.append(" ,\"");
            sb.append(str2);
            sb.append("\",");
            sb.append("undefined");
        }
        sb.append(");");
        HarmanOTAUtil.logDebug(sb.toString());
        postLoadUrl(sb.toString());
    }

    @Override // com.subaru.global.infotainment.gen2.harman.module.HarmanOTACallbackListener.CallbackListener
    public void callbackResponse(String str, Object obj, String str2) {
        HarmanOTAUtil.logDebug("start");
        JSONObject jSONObject = (JSONObject) obj;
        String optString = jSONObject.optString("notify", null);
        if (TextUtils.isEmpty(optString)) {
            optString = jSONObject.optString("resp", optString);
        }
        HarmanOTAUtil.logDebug("=================================================");
        HarmanOTAUtil.logDebug("contentType : " + str);
        HarmanOTAUtil.logDebug("json : " + obj.toString());
        HarmanOTAUtil.logDebug("=================================================");
        if (TextUtils.isEmpty(optString)) {
            return;
        }
        HarmanOTAUtil.logDebug("NOTIFY : " + optString);
        int i = 0;
        while (true) {
            List<String> list = mNotifyDataCallback;
            if (i >= list.size()) {
                return;
            }
            StringBuilder sb = new StringBuilder("javascript:");
            sb.append("window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;");
            sb.append("window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;");
            sb.append("var callback = window.harman_ota.callbacks[\"");
            sb.append(list.get(i));
            sb.append("\"];");
            sb.append("if(callback !== undefined) callback(");
            sb.append(obj.toString());
            sb.append(",\"");
            sb.append(str);
            sb.append("\");");
            postLoadUrl(sb.toString());
            HarmanOTAUtil.logDebug(sb.toString());
            i++;
        }
    }
}
