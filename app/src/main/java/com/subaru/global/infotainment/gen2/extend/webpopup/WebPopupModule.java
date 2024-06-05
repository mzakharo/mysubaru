package com.subaru.global.infotainment.gen2.extend.webpopup;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.clarion.smartaccess.inappbilling.util.LogUtil;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import java.net.URL;
import java.util.Map;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class WebPopupModule extends AbstractExtendModule {
    public static final String TAG = "WebPopupModule";
    private static PopupActivity activityInstance;
    private static Map<String, IPopupHandler> tempHandlerTable;
    private Context context;

    /* loaded from: classes.dex */
    public interface IPopupHandler {
        void onPopupLinkAccess(String str);
    }

    public WebPopupModule(Context context) {
        this.context = context;
    }

    public static void showPopup(Context context, URL url) {
        showPopup(context, url, null);
    }

    public static void showPopup(Context context, URL url, Map<String, IPopupHandler> map) {
        Log.d(TAG, "showPopup()");
        tempHandlerTable = null;
        Intent intent = new Intent(context, (Class<?>) PopupActivity.class);
        intent.setFlags(335544320);
        intent.putExtra("url", url.toString());
        if (map == null) {
            intent.putExtra("closeButton", true);
        } else {
            intent.putExtra("closeButton", false);
            tempHandlerTable = map;
        }
        context.startActivity(intent);
    }

    public static Map<String, IPopupHandler> getHanlerTable() {
        Log.d(TAG, "getHanlerTable()");
        if (tempHandlerTable != null) {
            Log.d(TAG, "tempHandlerTable!=null");
            return tempHandlerTable;
        }
        Log.d(TAG, "tempHandlerTable=null");
        return null;
    }

    public static void jump(URL url) {
        Log.d(TAG, "jump()");
        PopupActivity popupActivity = activityInstance;
        if (popupActivity != null) {
            popupActivity.jump(url);
        } else {
            Log.d(TAG, "can't jump to URL. WebView is not exist.");
        }
    }

    public static void setActivity(PopupActivity popupActivity) {
        Log.d(TAG, "setActivity()");
        activityInstance = popupActivity;
    }

    public static void closePopup() {
        Log.d(TAG, "closePopup()");
        PopupActivity popupActivity = activityInstance;
        if (popupActivity != null) {
            popupActivity.finish();
            activityInstance = null;
        } else {
            Log.d(TAG, "already closed");
        }
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        LogUtil.logDebug(TAG, "dispatch() start");
        if (mSHTTPRequest == null || mSHTTPResponder == null) {
            LogUtil.logError(TAG, "error: request or response is null");
            responseErrorJson(mSHTTPResponder, "M001W", 500);
            return;
        }
        try {
            showPopup(this.context, new URL(mSHTTPRequest.getRequestInfo().getQuery("url")));
        } catch (Exception e) {
            LogUtil.logError(TAG, "error: faild call showpopup");
            LogUtil.logError(TAG, e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("return_cd", "M001I");
            responseJson(mSHTTPResponder, jSONObject.toString(), 200);
        } catch (Exception e2) {
            LogUtil.logError(TAG, "error: unknow error");
            LogUtil.logError(TAG, e2.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        Log.d(TAG, "dispatch() end");
    }
}
