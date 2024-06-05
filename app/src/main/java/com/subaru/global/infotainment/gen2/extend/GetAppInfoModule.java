package com.subaru.global.infotainment.gen2.extend;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import com.android.lib.mcm.util.LocaleUtil;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
import com.clarion.smartaccess.inappbilling.util.LogUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import java.util.Locale;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class GetAppInfoModule extends AbstractExtendModule {
    public final String TAG = "GetAppInfoModule";
    private Context context;

    public GetAppInfoModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        LogUtil.logDebug("GetAppInfoModule", "dispatch() start");
        if (mSHTTPRequest == null || mSHTTPResponder == null) {
            LogUtil.logError("GetAppInfoModule", "request or response is null");
            responseErrorJson(mSHTTPResponder, "M001E", 500);
            return;
        }
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("return_cd", "M001I");
            Context applicationContext = this.context.getApplicationContext();
            PackageManager packageManager = applicationContext.getPackageManager();
            jSONObject.put(HarmanOTAConst.JSON_VERSION, packageManager.getPackageInfo(applicationContext.getPackageName(), 128).versionName);
            jSONObject.put("os", "android");
            String kvsValue = getKvsValue("term_aprroval_flag");
            if (kvsValue == null) {
                kvsValue = "";
            }
            jSONObject.put("term_aprroval_flag", kvsValue);
            jSONObject.put("country", AppInfoUtil.getSimCountry(this.context));
            jSONObject.put("language", AppInfoUtil.getCurrentLanguage());
            jSONObject.put("locale", AppInfoUtil.getCurrentLocale());
            Locale locale = LocaleUtil.getLocale();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("country", locale.getCountry());
            jSONObject2.put("language", locale.getLanguage());
            if (Build.VERSION.SDK_INT > 21) {
                jSONObject2.put("script", locale.getScript());
            } else {
                jSONObject2.put("script", "");
            }
            jSONObject.put("v2", jSONObject2);
            jSONObject.put("app_name", applicationContext.getApplicationInfo().loadLabel(packageManager).toString());
            responseJson(mSHTTPResponder, jSONObject.toString(), 200);
        } catch (Exception e) {
            LogUtil.logError("GetAppInfoModule", "予期せぬエラー");
            LogUtil.logError("GetAppInfoModule", e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        Log.d("GetAppInfoModule", "dispatch() end");
    }
}
