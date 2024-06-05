package com.android.lib.mcm.send_location;
/* loaded from: classes.dex */
public class SendLocationGlympseInfoContainer extends SendLocationInfoParamContainer {
    private String mSince = null;

    public void setGlympseInfo(String str) {
        this.mSince = str;
    }

    public String getSince() {
        return this.mSince;
    }
}
