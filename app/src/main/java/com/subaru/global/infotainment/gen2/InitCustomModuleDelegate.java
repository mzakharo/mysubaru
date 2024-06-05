package com.subaru.global.infotainment.gen2;

import android.content.Context;
import com.android.lib.mcm.InitCustomModule;
import com.subaru.global.infotainment.gen2.extend.ExternalModuleLoader;
import com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor;

/* loaded from: classes.dex */
public class InitCustomModuleDelegate implements InitCustomModule.IInitCustomModuleDelegate {
    @Override // com.android.lib.mcm.InitCustomModule.IInitCustomModuleDelegate
    public void initMsModule(Context context) {
        ExternalModuleLoader.onApplicationLaunchWithServiceProcess(context);
        new InitCustomModuleHelperDelegate().setupResources();
        TlsConvertInterceptor.Setter.initInstance(context);
        TlsConvertInterceptor.Setter.sharedInstance().updateFromServer();
    }
}
