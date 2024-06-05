package com.uievolution.microserver.modules;

import com.uievolution.microserver.MSModule;
import com.uievolution.microserver.MSModuleFactory;

/* loaded from: classes.dex */
public class NotFoundModuleFactory implements MSModuleFactory {
    @Override // com.uievolution.microserver.MSModuleFactory
    public MSModule create() {
        return new NotFoundModule();
    }
}
