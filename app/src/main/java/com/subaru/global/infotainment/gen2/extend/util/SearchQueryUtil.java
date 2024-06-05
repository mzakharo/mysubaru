package com.subaru.global.infotainment.gen2.extend.util;

import android.text.TextUtils;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Pattern;
import org.slf4j.Marker;

/* loaded from: classes.dex */
public class SearchQueryUtil {

    /* loaded from: classes.dex */
    public enum SearchMethod {
        partial("0"),
        exact("1");

        final String mId;

        SearchMethod(String str) {
            this.mId = str;
        }

        public static SearchMethod get(String str) {
            for (SearchMethod searchMethod : values()) {
                if (TextUtils.equals(searchMethod.mId, str)) {
                    return searchMethod;
                }
            }
            return null;
        }

        public String getId() {
            return this.mId;
        }
    }

    public static ArrayList<ArrayList<Pattern>> createSearchQuery(String str, SearchMethod searchMethod, String str2) {
        ArrayList<Pattern> createInnerAndQuery;
        if (TextUtils.isEmpty(str)) {
            return null;
        }
        ArrayList<ArrayList<Pattern>> arrayList = new ArrayList<>();
        if (str.startsWith(",") || str.endsWith(",")) {
            return null;
        }
        for (String str3 : str.split(",")) {
            if (TextUtils.isEmpty(str3) || (createInnerAndQuery = createInnerAndQuery(str3, searchMethod, str2)) == null) {
                return null;
            }
            arrayList.add(createInnerAndQuery);
        }
        return arrayList;
    }

    public static ArrayList<Pattern> createInnerAndQuery(String str, SearchMethod searchMethod, String str2) {
        String str3;
        ArrayList<Pattern> arrayList = new ArrayList<>();
        int i = AnonymousClass1.$SwitchMap$com$subaru$global$infotainment$gen2$extend$util$SearchQueryUtil$SearchMethod[searchMethod.ordinal()];
        if (i != 1) {
            if (i != 2) {
                return null;
            }
            str3 = "^" + Pattern.quote(str) + "$";
        } else {
            if (str.startsWith(Const.REQUEST_PARAM_SEPARATE_STR) || str.endsWith(Const.REQUEST_PARAM_SEPARATE_STR)) {
                return null;
            }
            String str4 = null;
            for (String str5 : str.split(Const.REQUEST_PARAM_SEPARATE_STR)) {
                if (TextUtils.isEmpty(str5)) {
                    return null;
                }
                if (!TextUtils.isEmpty(str2)) {
                    if (TextUtils.isEmpty(str5.replaceAll(str2, ""))) {
                        return null;
                    }
                    str5 = str5.replaceAll(str2, Const.REQUEST_PARAM_SEPARATE_STR);
                }
                for (String str6 : str5.split(Const.REQUEST_PARAM_SEPARATE_STR)) {
                    if (!TextUtils.isEmpty(str6)) {
                        str4 = ".*" + Pattern.quote(str6) + Marker.ANY_NON_NULL_MARKER;
                        arrayList.add(Pattern.compile(str4, 2));
                    }
                }
            }
            str3 = str4;
        }
        arrayList.add(Pattern.compile(str3, 2));
        return arrayList;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil$1, reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass1 {
        static final /* synthetic */ int[] $SwitchMap$com$subaru$global$infotainment$gen2$extend$util$SearchQueryUtil$SearchMethod;

        static {
            int[] iArr = new int[SearchMethod.values().length];
            $SwitchMap$com$subaru$global$infotainment$gen2$extend$util$SearchQueryUtil$SearchMethod = iArr;
            try {
                iArr[SearchMethod.partial.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$com$subaru$global$infotainment$gen2$extend$util$SearchQueryUtil$SearchMethod[SearchMethod.exact.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
        }
    }

    public static boolean isMatch(ArrayList<String> arrayList, ArrayList<ArrayList<Pattern>> arrayList2, String str) {
        Iterator<String> it = arrayList.iterator();
        boolean z = false;
        while (it.hasNext()) {
            String next = it.next();
            if (!TextUtils.isEmpty(next)) {
                if (!TextUtils.isEmpty(str)) {
                    next = next.replaceAll(str, "");
                }
                if (TextUtils.isEmpty(next)) {
                    return true;
                }
                Iterator<ArrayList<Pattern>> it2 = arrayList2.iterator();
                while (it2.hasNext()) {
                    Iterator<Pattern> it3 = it2.next().iterator();
                    while (true) {
                        if (!it3.hasNext()) {
                            break;
                        }
                        if (!it3.next().matcher(next).find()) {
                            z = false;
                            break;
                        }
                        z = true;
                    }
                    if (z) {
                        break;
                    }
                }
                if (z) {
                    return z;
                }
            }
        }
        return z;
    }
}
