package com.harman.services;

import android.content.Context;
import org.json.JSONObject;

/* loaded from: classes.dex */
public interface IHACServiceCallback {
    void didHACServiceDisconnect(JSONObject jSONObject);

    void initMapService(Context context);

    void notifyData(Object obj, String str, String str2);

    void onAsyncQuery(Object obj, String str, String str2, IOnQueryResponseCallback iOnQueryResponseCallback);

    Object onQuery(Object obj, String str, String str2);
}
