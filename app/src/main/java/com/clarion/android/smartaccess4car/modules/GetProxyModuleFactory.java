package com.clarion.android.smartaccess4car.modules;

import android.util.Log;
import com.clarion.android.smartaccess4car.extend.getproxy.GetProxyModule;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;

/* loaded from: classes.dex */
public class GetProxyModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return new GetProxyModule(MicroServer.getInstance().getContext());
    }
}
