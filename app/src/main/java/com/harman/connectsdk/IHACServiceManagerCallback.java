package com.harman.connectsdk;

import org.json.JSONObject;

/* loaded from: classes.dex */
public abstract class IHACServiceManagerCallback {
    public abstract void didAccessoryConnect();

    public abstract void didAccessoryDisconnect();

    public abstract void didHACServiceConnect(String str, int i);

    public abstract void didHACServiceDisconnect(JSONObject jSONObject);

    public abstract void notifyData(Object obj, String str, String str2);

    public abstract void onAsyncQuery(Object obj, String str, String str2, IResponseCallback iResponseCallback);

    public abstract Object onQuery(Object obj, String str, String str2);
}
