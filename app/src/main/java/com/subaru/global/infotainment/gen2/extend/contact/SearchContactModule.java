package com.subaru.global.infotainment.gen2.extend.contact;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.ExConst;
import com.subaru.global.infotainment.gen2.extend.contact.json.Res;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.subaru.global.infotainment.gen2.extend.util.RequestParamUtil;
import com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.regex.PatternSyntaxException;

/* loaded from: classes.dex */
public class SearchContactModule extends AbstractExtendModule {
    public final String TAG = "SearchContactModule";
    private Context context;

    public SearchContactModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception {
        Log.d("SearchContactModule", "dispatch() start");
        if (mSHTTPRequest != null && mSHTTPResponder != null) {
            try {
            } catch (PatternSyntaxException unused) {
                ExConst.ReturnCode returnCode = ExConst.ReturnCode.m002w;
                responseErrorJson(mSHTTPResponder, returnCode.getMessage(), returnCode.getStatusCode());
            } catch (Exception e) {
                Log.e("SearchContactModule", "予期せぬエラー");
                Log.e("SearchContactModule", e.toString());
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
            if (checkParam(mSHTTPRequest)) {
                String query = mSHTTPRequest.getRequestInfo().getQuery("type");
                String query2 = mSHTTPRequest.getRequestInfo().getQuery("name");
                String query3 = mSHTTPRequest.getRequestInfo().getQuery("start");
                String query4 = mSHTTPRequest.getRequestInfo().getQuery("count");
                String query5 = mSHTTPRequest.getRequestInfo().getQuery("method");
                String query6 = mSHTTPRequest.getRequestInfo().getQuery("ignore");
                if (query2 == null) {
                    query2 = "";
                }
                String decode = URLDecoder.decode(query2, "UTF-8");
                Log.i("SearchContactModule", "デコードされたname=" + query2);
                ArrayList<SearchQueryUtil.SearchMethod> methods = RequestParamUtil.getMethods(query5);
                if (methods == null) {
                    Log.w("SearchContactModule", "入力パラメータエラー");
                    responseErrorJson(mSHTTPResponder, "M001W", 400);
                    return;
                }
                Res search = query.equals("1") ? new SearchContact(this.context).search(decode, query3, query4, methods, query6) : null;
                if (TextUtils.equals(search.getReturnCd(), "M001I")) {
                    responseJson(mSHTTPResponder, JsonUtil.toJson(search, search.getClass()), 200);
                } else if (TextUtils.equals(search.getReturnCd(), "M001W")) {
                    responseErrorJson(mSHTTPResponder, "M001W", 400);
                } else {
                    responseErrorJson(mSHTTPResponder, "M001E", 500);
                }
                Log.d("SearchContactModule", "dispatch() end");
                return;
            }
        }
        Log.w("SearchContactModule", "入力パラメータエラー");
        responseErrorJson(mSHTTPResponder, "M001W", 400);
    }

    private boolean checkParam(MSHTTPRequest mSHTTPRequest) {
        String query = mSHTTPRequest.getRequestInfo().getQuery("type");
        String query2 = mSHTTPRequest.getRequestInfo().getQuery("start");
        String query3 = mSHTTPRequest.getRequestInfo().getQuery("count");
        String query4 = mSHTTPRequest.getRequestInfo().getQuery("method");
        if (TextUtils.isEmpty(query) || !query.equals("1")) {
            return false;
        }
        if (!TextUtils.isEmpty(query2) && !isDigit(query2)) {
            return false;
        }
        if (!TextUtils.isEmpty(query3) && !isDigit(query3)) {
            return false;
        }
        if (TextUtils.isEmpty(query4)) {
            return true;
        }
        for (String str : query4.split(",")) {
            if (SearchQueryUtil.SearchMethod.get(str) == null) {
                return false;
            }
        }
        return true;
    }
}
