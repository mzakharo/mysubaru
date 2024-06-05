package com.subaru.global.infotainment.gen2.extend.contact;

import android.util.SparseArray;

/* loaded from: classes.dex */
public final class Const {
    public static final String[][] CALLLOG_INVALID_NUMBER_TABLE = {new String[]{"-1", "通知不可"}, new String[]{"-2", "非通知"}};
    public static final boolean CALLLOG_NAME_BY_CONTACTS = false;
    public static final SparseArray<String> EMAIL_ADDRESS_TYPE_TABLE;
    public static final SparseArray<String> PHONE_NUMBER_TYPE_TABLE;
    public static final String TYPE_HOME = "HOME";
    public static final String TYPE_MOBILE = "MOBILE";
    public static final String TYPE_OTHER = "OTHER";
    public static final String TYPE_WORK = "WORK";

    /* loaded from: classes.dex */
    public enum CALLLOG_TYPE {
        ALL,
        OUTGOING,
        INCOMING,
        MISSED,
        INCOMING_AND_MISSED
    }

    static {
        SparseArray<String> sparseArray = new SparseArray<>();
        sparseArray.append(19, TYPE_OTHER);
        sparseArray.append(8, TYPE_OTHER);
        sparseArray.append(9, TYPE_OTHER);
        sparseArray.append(10, TYPE_WORK);
        sparseArray.append(5, TYPE_OTHER);
        sparseArray.append(4, TYPE_OTHER);
        sparseArray.append(1, TYPE_HOME);
        sparseArray.append(11, TYPE_OTHER);
        sparseArray.append(12, TYPE_OTHER);
        sparseArray.append(20, TYPE_OTHER);
        sparseArray.append(2, TYPE_MOBILE);
        sparseArray.append(7, TYPE_OTHER);
        sparseArray.append(13, TYPE_OTHER);
        sparseArray.append(6, TYPE_OTHER);
        sparseArray.append(14, TYPE_OTHER);
        sparseArray.append(15, TYPE_OTHER);
        sparseArray.append(16, TYPE_OTHER);
        sparseArray.append(3, TYPE_WORK);
        sparseArray.append(17, TYPE_MOBILE);
        sparseArray.append(18, TYPE_OTHER);
        sparseArray.append(0, TYPE_OTHER);
        PHONE_NUMBER_TYPE_TABLE = sparseArray;
        SparseArray<String> sparseArray2 = new SparseArray<>();
        sparseArray2.append(1, TYPE_HOME);
        sparseArray2.append(4, TYPE_MOBILE);
        sparseArray2.append(3, TYPE_OTHER);
        sparseArray2.append(2, TYPE_WORK);
        sparseArray2.append(0, TYPE_OTHER);
        EMAIL_ADDRESS_TYPE_TABLE = sparseArray2;
    }
}
