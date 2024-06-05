package com.subaru.global.infotainment.gen2.extend;

import android.text.TextUtils;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
import com.subaru.global.infotainment.gen2.extend.util.RequestParamUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
import com.uievolution.microserver.utils.HttpCatalogs;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;
import org.slf4j.Marker;

/* loaded from: classes.dex */
public abstract class AbstractExtendModule implements MSModuleDelegate {
    public final String TAG = "AbstractExtendModule";

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public abstract void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception;

    /* JADX INFO: Access modifiers changed from: protected */
    public String getKvsValue(String str) {
        return AppInfoUtil.getKvsValue(str);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void responseJson(MSHTTPResponder mSHTTPResponder, String str, int i) throws Exception {
        byte[] bytes = str.getBytes("UTF-8");
        Log.d("AbstractExtendModule", "レスポンス=" + str);
        mSHTTPResponder.startResponse(i, new Header[]{new BasicHeader(HttpCatalogs.HEADER_CONNECTION, "close"), new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, HarmanOTAConst.JSON_CONTENT_TYPE), new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(bytes.length))});
        mSHTTPResponder.writeResponseData(bytes);
        mSHTTPResponder.closeResponse();
        Log.d("intelligenttune", "--- responseJson -----");
        Log.d("intelligenttune", str);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void responseErrorJson(MSHTTPResponder mSHTTPResponder, String str, int i) {
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("return_cd", str);
            responseJson(mSHTTPResponder, jSONObject.toString(), i);
        } catch (Exception unused) {
            mSHTTPResponder.startResponse(500, null);
            mSHTTPResponder.closeResponse();
        }
    }

    public boolean isDigit(String str) {
        return RequestParamUtil.isDigit(str);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public Map<String, String> createParamsMap(MSHTTPRequest mSHTTPRequest) {
        String str;
        HttpRequestInfo requestInfo = mSHTTPRequest.getRequestInfo();
        if (TextUtils.equals(requestInfo.getMethod(), "GET")) {
            str = requestInfo.getQueries();
        } else {
            try {
                str = new String(mSHTTPRequest.getHttpBody(), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                str = "";
            }
        }
        return createParamsMap(str);
    }

    protected Map<String, String> createParamsMap(String str) {
        HashMap hashMap = new HashMap();
        try {
            for (String str2 : str.split(Const.REQUEST_PARAM_SEPARATE_STR)) {
                String[] split = str2.split(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
                if (split.length >= 2) {
                    hashMap.put(URLDecoder.decode(split[0], "UTF-8"), URLDecoder.decode(split[1], "UTF-8"));
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return hashMap;
    }
}
