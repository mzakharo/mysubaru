package com.subaru.global.infotainment.gen2.extend.util;

import com.google.gson.Gson;
import java.lang.reflect.Type;

/* loaded from: classes.dex */
public class JsonUtil {
    public static String toJson(Object obj, Type type) {
        return new Gson().toJson(obj, type);
    }
}
