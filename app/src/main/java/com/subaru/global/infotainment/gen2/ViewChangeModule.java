package com.subaru.global.infotainment.gen2;

import android.content.Intent;
import android.util.Log;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.util.ArrayList;
import java.util.Arrays;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Marker;

/* loaded from: classes.dex */
class ViewChangeModule implements MSModuleDelegate {
    public static final String KEY_PORTRAIT = "portrait";
    public static final String KEY_TABNUM = "tabnum";
    static final String LOGTAG = "ViewChange";
    public static final String OUT_KEY_MESSAGE = "message";
    public static final String OUT_KEY_RESULT = "result";
    public static final int STATUS_ERROR = 1;
    public static final int STATUS_OK = 0;
    public static final String BROADCAST_ACTION = ViewChangeModule.class.getName() + ".viewchangeevent";
    static Header[] sCommonResponseHeaders = {new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_METHODS, "GET"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")};

    private void doErrorResponse(MSHTTPResponder mSHTTPResponder, String str) {
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("result", 1);
            jSONObject.put("message", str);
        } catch (JSONException e) {
            Log.w(LOGTAG, e);
        }
        String jSONObject2 = jSONObject.toString();
        mSHTTPResponder.startResponse(200, getResponseHeader(jSONObject2.getBytes().length));
        mSHTTPResponder.writeResponseData(jSONObject2.getBytes());
        mSHTTPResponder.closeResponse();
    }

    private Header[] getResponseHeader(int i) {
        ArrayList arrayList = new ArrayList();
        arrayList.addAll(Arrays.asList(sCommonResponseHeaders));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, Integer.toString(i)));
        return (Header[]) arrayList.toArray(new Header[0]);
    }

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        String query = mSHTTPRequest.getRequestInfo().getQuery(KEY_TABNUM);
        if (query == null) {
            doErrorResponse(mSHTTPResponder, "No tabnum param");
            return;
        }
        try {
            int parseInt = Integer.parseInt(query);
            if (parseInt > 5) {
                doErrorResponse(mSHTTPResponder, "tabnum value is too large.. Max is 5");
                return;
            }
            String query2 = mSHTTPRequest.getRequestInfo().getQuery(KEY_PORTRAIT);
            if (query2 == null) {
                doErrorResponse(mSHTTPResponder, "No portrait param");
                return;
            }
            if (!query2.equals("true") && !query2.equals("false")) {
                doErrorResponse(mSHTTPResponder, "Invalid portrait param. " + query2);
                return;
            }
            boolean parseBoolean = Boolean.parseBoolean(query2);
            Intent intent = new Intent(BROADCAST_ACTION);
            intent.putExtra(KEY_TABNUM, parseInt);
            intent.putExtra(KEY_PORTRAIT, parseBoolean);
            MicroServer.getInstance().getContext().sendBroadcast(intent);
            JSONObject jSONObject = new JSONObject();
            try {
                jSONObject.put("result", 0);
            } catch (JSONException e) {
                Log.w(LOGTAG, e);
            }
            String jSONObject2 = jSONObject.toString();
            mSHTTPResponder.startResponse(200, getResponseHeader(jSONObject2.getBytes().length));
            mSHTTPResponder.writeResponseData(jSONObject2.getBytes());
            mSHTTPResponder.closeResponse();
        } catch (NumberFormatException unused) {
            doErrorResponse(mSHTTPResponder, "Invalid tabnum value. " + query);
        }
    }
}
