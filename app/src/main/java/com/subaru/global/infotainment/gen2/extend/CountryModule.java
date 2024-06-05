package com.subaru.global.infotainment.gen2.extend;

import android.content.Context;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
//import com.clarion.smartaccess.inappbilling.util.LogUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class CountryModule extends AbstractExtendModule {
    public final String TAG = "CountryModule";
    private Context context;

    public CountryModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        //LogUtil.logDebug("CountryModule", "dispatch() start");
        if (mSHTTPRequest == null || mSHTTPResponder == null) {
           // LogUtil.logError("CountryModule", "request or response is null");
            responseErrorJson(mSHTTPResponder, "M001E", 500);
            return;
        }
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("return_cd", "M001I");
            jSONObject.put("country", AppInfoUtil.getSimCountry(this.context));
            jSONObject.put("language", AppInfoUtil.getCurrentLanguage());
            jSONObject.put("locale", AppInfoUtil.getCurrentLocale());
            responseJson(mSHTTPResponder, jSONObject.toString(), 200);
        } catch (Exception e) {
            //LogUtil.logError("CountryModule", "予期せぬエラー");
            //LogUtil.logError("CountryModule", e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        Log.d("CountryModule", "dispatch() end");
    }
}
