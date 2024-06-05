package com.subaru.global.infotainment.gen2;

import com.android.lib.mcm.application.MCApplication;

/* loaded from: classes.dex */
public class StarLinkApplication extends MCApplication {
    private MSWebViewBinder mMSWebViewBinder = new MSWebViewBinder();

    public MSWebViewBinder createMSWebViewBinder() {
        MSWebViewBinder mSWebViewBinder = new MSWebViewBinder();
        this.mMSWebViewBinder = mSWebViewBinder;
        return mSWebViewBinder;
    }

    public MSWebViewBinder getMSWebViewBinder() {
        return this.mMSWebViewBinder;
    }
}
