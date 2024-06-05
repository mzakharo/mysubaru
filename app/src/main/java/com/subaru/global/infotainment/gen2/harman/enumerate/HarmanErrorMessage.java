package com.subaru.global.infotainment.gen2.harman.enumerate;
import com.example.mysubaru.R;

/* loaded from: classes.dex */
enum HarmanErrorMessage {
    TXT_YELP_0029(R.string.TXT_YELP_0029_ALERT, R.string.TXT_YELP_0029_NOTIFY),
    SL_TXT_0207(R.string.SL_TXT_0207_ALERT, R.string.SL_TXT_0207_NOTIFY),
    SL_TXT_0209(R.string.SL_TXT_0209_ALERT, R.string.SL_TXT_0209_NOTIFY),
    SL_TXT_0210(R.string.SL_TXT_0210_ALERT, R.string.SL_TXT_0210_NOTIFY),
    SL_TXT_0211(R.string.SL_TXT_0211_ALERT, R.string.SL_TXT_0211_NOTIFY),
    SL_TXT_0214(R.string.SL_TXT_0214_ALERT, R.string.SL_TXT_0214_NOTIFY),
    SL_TXT_0215(R.string.SL_TXT_0215_ALERT, R.string.SL_TXT_0215_NOTIFY),
    SL_TXT_0216(R.string.SL_TXT_0216_ALERT, R.string.SL_TXT_0216_NOTIFY),
    SL_TXT_0217(R.string.SL_TXT_0217_ALERT, R.string.SL_TXT_0217_NOTIFY),
    SL_TXT_0219(R.string.SL_TXT_0219_ALERT, R.string.SL_TXT_0219_NOTIFY),
    SL_TXT_0220(R.string.SL_TXT_0220_ALERT, R.string.SL_TXT_0220_NOTIFY),
    SL_TXT_CUSTOM_TRANSFER_IN_PROGRESS_MAX(R.string.SL_TXT_CUSTOM_TRANSFER_IN_PROGRESS_MAX_ALERT, R.string.SL_TXT_CUSTOM_TRANSFER_IN_PROGRESS_MAX_NOTIFY),
    SL_TXT_CUSTOM_TRANSFER_TIMEOUT(R.string.SL_TXT_CUSTOM_TRANSFER_TIMEOUT_ALERT, R.string.SL_TXT_CUSTOM_TRANSFER_TIMEOUT_NOTIFY),
    SL_TXT_0177(R.string.SL_TXT_0177_ALERT, R.string.SL_TXT_0177_NOTIFY),
    SL_TXT_CUSTOM_TRANSFER_FAILURE(R.string.SL_TXT_CUSTOM_TRANSFER_FAILURE_ALERT, R.string.SL_TXT_CUSTOM_TRANSFER_FAILURE_NOTIFY);

    private int resLongId;
    private int resShortId;

    HarmanErrorMessage(int i, int i2) {
        this.resLongId = i;
        this.resShortId = i2;
    }

    public int getResLongId() {
        return this.resLongId;
    }

    public int getResShortId() {
        return this.resShortId;
    }
}
