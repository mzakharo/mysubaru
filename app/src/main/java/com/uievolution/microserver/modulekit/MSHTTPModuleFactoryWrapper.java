package com.uievolution.microserver.modulekit;

import com.uievolution.microserver.MSModule;
import com.uievolution.microserver.MSModuleFactory;

/* loaded from: classes.dex */
public class MSHTTPModuleFactoryWrapper implements MSModuleFactory {
    private MSHTTPModuleFactory a;

    public MSHTTPModuleFactoryWrapper(MSHTTPModuleFactory mSHTTPModuleFactory) {
        this.a = mSHTTPModuleFactory;
    }

    @Override // com.uievolution.microserver.MSModuleFactory
    public MSModule create() {
        return new c(this.a.create());
    }

    public String toString() {
        return MSHTTPModuleFactoryWrapper.class.getName() + "@" + Integer.toHexString(hashCode()) + ", (" + this.a.toString() + ")";
    }
}
