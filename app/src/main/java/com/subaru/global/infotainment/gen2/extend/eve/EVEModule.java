package com.subaru.global.infotainment.gen2.extend.eve;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.IOException;

import solutions.eve.evelib.EVE;
import solutions.eve.evelib.OnEVEActionListener;
import solutions.eve.evelib.helper.json.EVEResponse;

/* loaded from: classes.dex */
public class EVEModule extends AbstractExtendModule implements OnEVEActionListener {
    private static final String LOG_TAG = "com.subaru.global.infotainment.gen2.extend.eve.EVEModule";
    private OnEVEActionListener OnEVEActionListener;
    private Context mContext;

    public EVEModule(Context context) {
        String str = LOG_TAG;
        Log.d(str, "init");
        this.mContext = context;
        try {
            Log.d(str, "pass init: " + EVE.init(context));
            this.OnEVEActionListener = this;
            EVE.setupListener(this);
        } catch (Exception e) {
            Log.e(LOG_TAG, "Failed: ", e);
        }
    }

    public void release() {
        this.mContext = null;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws IOException {
        if (mSHTTPRequest == null || mSHTTPResponder == null) {
            Log.w(LOG_TAG, "Bad request");
            responseErrorJson(mSHTTPResponder, "M001W", 400);
            return;
        }
        HttpRequestInfo requestInfo = mSHTTPRequest.getRequestInfo();
        String query = mSHTTPRequest.getRequestInfo().getQuery("action");
        String str = LOG_TAG;
        Log.i(str, "action=" + query);
        Log.i(str, "msg=" + mSHTTPRequest.getRequestInfo().getQuery(NotificationCompat.CATEGORY_MESSAGE));
        try {
        } catch (Exception e) {
            Log.e(LOG_TAG, e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
        if (!checkParam(query)) {
            Log.w(str, "Bad parameters:" + mSHTTPRequest.getRequestInfo().toString());
            responseErrorJson(mSHTTPResponder, "M001W", 400);
            return;
        }
        new EVE().process(query, mSHTTPResponder, requestInfo.getQueries());
        Log.d(LOG_TAG, "dispatch() end");
    }

    private boolean checkParam(String str) {
        return !TextUtils.isEmpty(str);
    }

    @Override // solutions.eve.evelib.OnEVEActionListener
    public void onEVEActionComplete(EVEResponse eVEResponse, Object obj) {
        MSHTTPResponder mSHTTPResponder = (MSHTTPResponder) obj;
        eVEResponse.setReturnCd("M001I");
        try {
            if (TextUtils.equals(eVEResponse.getReturnCd(), "M001I")) {
                responseJson(mSHTTPResponder, JsonUtil.toJson(eVEResponse, eVEResponse.getClass()), 200);
            } else if (TextUtils.equals(eVEResponse.getReturnCd(), "M001W")) {
                responseErrorJson(mSHTTPResponder, "M001W", 400);
            } else {
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
    }

    @Override // solutions.eve.evelib.OnEVEActionListener
    public void onEVEActionError(EVEResponse eVEResponse, Object obj) {
        MSHTTPResponder mSHTTPResponder = (MSHTTPResponder) obj;
        eVEResponse.setReturnCd("M001I");
        try {
            if (TextUtils.equals(eVEResponse.getReturnCd(), "M001I")) {
                responseJson(mSHTTPResponder, JsonUtil.toJson(eVEResponse, eVEResponse.getClass()), 200);
            } else if (TextUtils.equals(eVEResponse.getReturnCd(), "M001W")) {
                responseErrorJson(mSHTTPResponder, "M001W", 400);
            } else {
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, e.toString());
            responseErrorJson(mSHTTPResponder, "M001E", 500);
        }
    }
}
