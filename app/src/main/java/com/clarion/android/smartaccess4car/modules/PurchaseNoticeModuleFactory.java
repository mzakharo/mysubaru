package com.clarion.android.smartaccess4car.modules;

import android.util.Log;
//import com.clarion.smartaccess.inappbilling.PurchaseNoticeModule;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;

/* loaded from: classes.dex */
public class PurchaseNoticeModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return null; //new PurchaseNoticeModule(MicroServer.getInstance().getContext());
    }
}
