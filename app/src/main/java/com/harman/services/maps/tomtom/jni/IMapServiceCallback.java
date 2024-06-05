package com.harman.services.maps.tomtom.jni;

import org.json.JSONObject;

/* loaded from: classes.dex */
public interface IMapServiceCallback {
    void notificationToApp(String str, JSONObject jSONObject);

    void notificationToHU(String str, JSONObject jSONObject);

    JSONObject queryToApp(String str, JSONObject jSONObject);
}
