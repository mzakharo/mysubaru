package com.android.lib.mcm.logviewer.activity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
/* loaded from: classes.dex */
public class LogViewerList {
    private static List<Map<String, String>> mlist = new ArrayList();

    private LogViewerList() {
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static List<Map<String, String>> getList() {
        return mlist;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void addAll(List<Map<String, String>> list) {
        mlist.addAll(list);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void clear() {
        mlist.clear();
    }
}
