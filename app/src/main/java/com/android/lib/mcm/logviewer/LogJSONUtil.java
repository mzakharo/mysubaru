package com.android.lib.mcm.logviewer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogJSONUtil {
    private static final String JSON_KEY_APPLOG = "app_id";
    private static final String JSON_KEY_LOG = "log";

    public static List<Map<String, String>> parseViewerJson(JSONObject jSONObject) {
        ArrayList arrayList = new ArrayList();
        try {
            String string = jSONObject.getString(JSON_KEY_APPLOG);
            Object obj = jSONObject.get(JSON_KEY_LOG);
            if (obj instanceof JSONArray) {
                JSONArray jSONArray = (JSONArray) obj;
                for (int i = 0; i < jSONArray.length(); i++) {
                    HashMap hashMap = new HashMap();
                    Object obj2 = jSONArray.get(i);
                    if (obj2 instanceof JSONObject) {
                        StringBuffer stringBuffer = new StringBuffer();
                        stringBuffer.append("[");
                        stringBuffer.append(string);
                        stringBuffer.append("] ");
                        stringBuffer.append(((JSONObject) obj2).get(LogViewerConst.JSON_KEY_TIMESTAMP).toString());
                        hashMap.put(LogViewerConst.JSON_KEY_TIMESTAMP, stringBuffer.toString());
                        hashMap.put("message", ((JSONObject) obj2).get("message").toString());
                        arrayList.add(hashMap);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return arrayList;
    }

    public static List<String> parseStorageJson(JSONObject jSONObject) {
        ArrayList arrayList = new ArrayList();
        try {
            String string = jSONObject.getString(JSON_KEY_APPLOG);
            Object obj = jSONObject.get(JSON_KEY_LOG);
            if (obj instanceof JSONArray) {
                JSONArray jSONArray = (JSONArray) obj;
                for (int i = 0; i < jSONArray.length(); i++) {
                    Object obj2 = jSONArray.get(i);
                    if (obj2 instanceof JSONObject) {
                        StringBuffer stringBuffer = new StringBuffer();
                        stringBuffer.append("[");
                        stringBuffer.append(string);
                        stringBuffer.append("] ");
                        stringBuffer.append(((JSONObject) obj2).get(LogViewerConst.JSON_KEY_TIMESTAMP));
                        stringBuffer.append(" : ");
                        stringBuffer.append(((JSONObject) obj2).get("message"));
                        arrayList.add(stringBuffer.toString());
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return arrayList;
    }
}
