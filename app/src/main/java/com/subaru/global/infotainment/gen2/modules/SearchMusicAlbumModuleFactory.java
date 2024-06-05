package com.subaru.global.infotainment.gen2.modules;

import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.music.SearchMusicAlbumModule;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modulekit.MSHTTPModuleFactory;
import com.uievolution.microserver.modulekit.MSModuleDelegate;

/* loaded from: classes.dex */
public class SearchMusicAlbumModuleFactory implements MSHTTPModuleFactory {
    @Override // com.uievolution.microserver.modulekit.MSHTTPModuleFactory
    public MSModuleDelegate create() {
        Log.d("$$$", "create : " + getClass().getSimpleName());
        return new SearchMusicAlbumModule(MicroServer.getInstance().getContext());
    }
}
