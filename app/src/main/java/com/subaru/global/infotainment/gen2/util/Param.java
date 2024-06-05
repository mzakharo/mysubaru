package com.subaru.global.infotainment.gen2.util;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class Param {
    private final Map<String, String> mParam;

    /* loaded from: classes.dex */
    public static class ParamException extends Exception {
        private static final long serialVersionUID = 6034565089342017760L;
    }

    public static Param parse(String str) {
        HashMap hashMap = new HashMap();
        for (String str2 : str.split(Const.REQUEST_PARAM_SEPARATE_STR)) {
            String[] split = str2.split(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
            if (split.length == 2) {
                hashMap.put(split[0], split[1]);
            } else if (split.length == 1) {
                hashMap.put(split[0], null);
            }
        }
        return new Param(hashMap);
    }

    Param(Map<String, String> map) {
        this.mParam = map;
    }

    public String getString(String str) throws ParamException {
        if (!this.mParam.containsKey(str)) {
            throw new ParamException();
        }
        return this.mParam.get(str);
    }

    public String getString(String str, String str2) {
        try {
            return getString(str);
        } catch (ParamException unused) {
            return str2;
        }
    }

    public int getInt(String str) throws ParamException {
        if (!this.mParam.containsKey(str)) {
            throw new ParamException();
        }
        try {
            return Integer.parseInt(this.mParam.get(str));
        } catch (NumberFormatException unused) {
            throw new ParamException();
        }
    }

    public int getInt(String str, int i) {
        try {
            return getInt(str);
        } catch (ParamException unused) {
            return i;
        }
    }
}
