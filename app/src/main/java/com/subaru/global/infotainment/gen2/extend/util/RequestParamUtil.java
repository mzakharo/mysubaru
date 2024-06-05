package com.subaru.global.infotainment.gen2.extend.util;

import android.text.TextUtils;
import com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil;
import java.util.ArrayList;

/* loaded from: classes.dex */
public class RequestParamUtil {
    public static final int SEARCH_COUNT_ALL = -1;
    public static final int SEARCH_COUNT_ERROR = -2;
    public static final int SEARCH_START_ERROR = -3;

    public static int getSearchIndex(String str) {
        if (TextUtils.isEmpty(str)) {
            return 0;
        }
        int parseInt = Integer.parseInt(str);
        if (parseInt < 0) {
            return -3;
        }
        return parseInt;
    }

    public static int getSearchCount(String str) {
        if (TextUtils.isEmpty(str)) {
            return -1;
        }
        int parseInt = Integer.parseInt(str);
        if (parseInt < 0) {
            return -2;
        }
        return parseInt;
    }

    public static ArrayList<SearchQueryUtil.SearchMethod> getMethods(String str) {
        ArrayList<SearchQueryUtil.SearchMethod> arrayList = new ArrayList<>();
        if (TextUtils.isEmpty(str)) {
            arrayList.add(SearchQueryUtil.SearchMethod.partial);
        } else {
            for (String str2 : str.split(",")) {
                SearchQueryUtil.SearchMethod searchMethod = SearchQueryUtil.SearchMethod.get(str2);
                if (searchMethod == null) {
                    return null;
                }
                arrayList.add(searchMethod);
            }
        }
        return arrayList;
    }

    public static boolean isDigit(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException unused) {
            return false;
        }
    }
}
