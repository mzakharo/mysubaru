package com.android.lib.mcm.sagsi;

import android.content.Context;
import android.text.TextUtils;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.send_location.SendLocationUtil;
import com.android.lib.mcm.util.DebugUtil;
import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
import com.uievolution.microserver.modules.KeyValueStore;
import java.util.HashMap;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class SAGoogleSignInLibModule implements MSModuleDelegate {
    private static final String ERROR_MESSAGE_ENCODE = "リクエストにエラーがあります。";
    private static final String ERROR_MESSAGE_METHOD = "HTTPメソッドが違います。";
    private static final String FAIURE_RESPONSE_ERROR_CODE = "M001E";
    private static final String FAIURE_RESPONSE_PARAM_ERROR_CODE = "M001W";
    private static final String KVS_DEBUG = "kr";
    private static final String POST = "POST";
    private static final String RESPONSE_KEY_MESSAGE = "error_message";
    private static final String RESPONSE_KEY_RETURN_CD = "return_cd";
    private static final String SUCCESS_RESPONSE_CODE = "M001I";

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        String str;
        String str2;
        HttpRequestInfo requestInfo = mSHTTPRequest.getRequestInfo();
        Context context = MicroServer.getInstance().getContext();
        boolean equals = TextUtils.equals(requestInfo.getMethod(), "POST");
        String str3 = FAIURE_RESPONSE_PARAM_ERROR_CODE;
        int i = 400;
        if (equals) {
            HashMap<String, String> hashMap = new HashMap<>();
            try {
                hashMap = SendLocationUtil.parseParameter(mSHTTPRequest);
                SAGoogleSignInManager sAGoogleSignInManager = SAGoogleSignInManager.getInstance();
                if (hashMap.isEmpty()) {
                    str2 = FAIURE_RESPONSE_ERROR_CODE;
                    str = ERROR_MESSAGE_ENCODE;
                } else {
                    sAGoogleSignInManager.startLogin(hashMap);
                    i = 200;
                    str2 = SUCCESS_RESPONSE_CODE;
                    str = null;
                }
                str3 = str2;
            } catch (Exception e) {
                e.printStackTrace();
                String message = e.getMessage();
                if (!hashMap.isEmpty() && DebugUtil.checkDebug(context)) {
                    String str4 = hashMap.get(KVS_DEBUG);
                    if (!TextUtils.isEmpty(str4)) {
                        try {
                            KeyValueStore.getInstance(context).saveData(createResponceJson(FAIURE_RESPONSE_PARAM_ERROR_CODE, message).toString().getBytes(), str4);
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }
                str = message;
            }
        } else {
            str = ERROR_MESSAGE_METHOD;
        }
        try {
            Util.responseJson(mSHTTPResponder, createResponceJson(str3, str).toString(), i);
        } catch (Exception e3) {
            e3.printStackTrace();
        }
    }

    private JSONObject createResponceJson(String str, String str2) throws JSONException {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put(RESPONSE_KEY_RETURN_CD, str);
        if (!TextUtils.isEmpty(str2)) {
            jSONObject.put(RESPONSE_KEY_MESSAGE, str2);
        }
        DebugUtil.log(MicroServer.getInstance().getContext(), "return : ".concat(jSONObject.toString()));
        return jSONObject;
    }
}
