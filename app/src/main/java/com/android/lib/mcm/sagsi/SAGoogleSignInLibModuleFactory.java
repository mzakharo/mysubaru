package com.android.lib.mcm.sagsi;

import android.util.Log;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
/* loaded from: classes.dex */
public class SAGoogleSignInLibModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return new SAGoogleSignInLibModule();
    }
}
