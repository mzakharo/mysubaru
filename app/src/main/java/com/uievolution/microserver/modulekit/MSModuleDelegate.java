package com.uievolution.microserver.modulekit;

import java.io.IOException;

/* loaded from: classes.dex */
public interface MSModuleDelegate {
    void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception;
}
