package com.android.lib.mcm.logviewer.service;

import android.util.Log;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
/* loaded from: classes.dex */
public class LogViewerModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return new LogViewerModule(MicroServer.getInstance().getContext());
    }
}
