package com.android.lib.mcm.logviewer.service;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.appmgr.stub.Stub;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogViewerModule implements MSModuleDelegate {
    private static final int ERROR_STATUS_CODE = 500;
    private static final String FAIURE_RESPONSE_ERROR_CODE = "M001E";
    private static final String FAIURE_RESPONSE_PARAM_ERROR_CODE = "M001E";
    private static final String FAIURE_RESPONSE_VERSION_CODE = "M002E";
    public static final String GET = "GET";
    private static final int LOG_INTERVAL = 2000;
    private static final String RESPONSE_KEY_LOG_INTERVAL = "log_interval";
    private static final String RESPONSE_KEY_RETURN_CD = "return_cd";
    private static final String SUCCESS_RESPONSE_CODE = "M001I";
    private static final int SUCCESS_STATUS_CODE = 200;
    private Context mContext;

    public LogViewerModule(Context context) {
        this.mContext = context;
    }

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        JSONObject jSONObject;
        int i;
        try {
            try {
                try {
                    String appMgrVersionInfo = Stub.AppMgrContextStub.getAppMgrVersionInfo(this.mContext);
                    if (appMgrVersionInfo != null) {
                        if (appMgrVersionInfo.indexOf(McmConst.DEBUG_KEYWORD) != -1) {
                            boolean z = false;
                            String str = null;
                            if (TextUtils.equals(mSHTTPRequest.getRequestInfo().getMethod(), "GET")) {
                                z = true;
                                jSONObject = null;
                            } else {
                                str = new String(mSHTTPRequest.getHttpBody(), "UTF-8");
                                Log.d("param", str);
                                jSONObject = new JSONObject(str);
                            }
                            if (str != null) {
                                i = LogViewerManager.getInstance(this.mContext).showLog(jSONObject);
                                LogStorageManager.getInstance(this.mContext).saveLog(jSONObject);
                            } else {
                                i = 2000;
                            }
                            if (!z && str != null) {
                                Util.responseJson(mSHTTPResponder, returnResponse(SUCCESS_RESPONSE_CODE, i), 200);
                                return;
                            }
                            Util.responseJson(mSHTTPResponder, returnResponse("M001E", 2000), 500);
                            return;
                        }
                        Util.responseJson(mSHTTPResponder, returnResponse(FAIURE_RESPONSE_VERSION_CODE, 2000), 500);
                        return;
                    }
                    Util.responseJson(mSHTTPResponder, returnResponse(FAIURE_RESPONSE_VERSION_CODE, 2000), 500);
                } catch (Exception e) {
                    e.printStackTrace();
                    Util.responseJson(mSHTTPResponder, returnResponse("M001E", 2000), 500);
                }
            } catch (JSONException e2) {
                e2.printStackTrace();
                Util.responseJson(mSHTTPResponder, returnResponse("M001E", 2000), 500);
            }
        } catch (Exception unused) {
        }
    }

    private String returnResponse(String str, int i) throws Exception {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put(RESPONSE_KEY_RETURN_CD, str);
            jSONObject.put(RESPONSE_KEY_LOG_INTERVAL, i);
            return jSONObject.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            throw new Exception();
        }
    }
}
