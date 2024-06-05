package com.subaru.global.infotainment.gen2.modules;

import android.util.Log;
import com.android.lib.mcm.InitCustomModule;
import com.subaru.global.infotainment.gen2.InitCustomModuleDelegate;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;

/* loaded from: classes.dex */
public class InitCustomModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return new InitCustomModule(new InitCustomModuleDelegate());
    }
}
