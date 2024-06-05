package com.subaru.global.infotainment.gen2.harman.module;

import com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class JsonArrayIterator {
    public void iterate(JSONObject jSONObject, String str, NotifyDataDivide.IterateJsonArrayCallback iterateJsonArrayCallback) {
        JSONArray optJSONArray = jSONObject.optJSONArray(str);
        for (int i = 0; i < optJSONArray.length(); i++) {
            iterateJsonArrayCallback.callback(optJSONArray.optJSONObject(i));
        }
    }
}
