package com.uievolution.microserver.modules;

import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.http.HttpStatus;

/* loaded from: classes.dex */
public class NotFoundModule extends AbstractMSModuleImpl {
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        sendResponse(HttpStatus.SC_NOT_FOUND);
        return null;
    }
}
