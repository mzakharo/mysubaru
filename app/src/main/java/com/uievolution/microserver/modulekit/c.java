package com.uievolution.microserver.modulekit;

import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.http.Header;
import java.util.List;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class c extends AbstractMSModuleImpl {
    private MSModuleDelegate m;

    /* JADX INFO: Access modifiers changed from: package-private */
    public c(MSModuleDelegate mSModuleDelegate) {
        this.m = mSModuleDelegate;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public boolean closeResponse() {
        return super.closeResponse();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public void disableGzipEncoding() {
        super.disableGzipEncoding();
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        //this.m.dispatch(new a(tgetRequestInfo(), getWholeBody()), new b(this));
        return null;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public void enableGzipEncoding() {
        super.enableGzipEncoding();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public boolean startResponse(int i, List<Header> list) {
        return super.startResponse(i, list);
    }

    public String toString() {
        return c.class.getName() + "@" + Integer.toHexString(hashCode()) + ", (" + this.m.toString() + ")";
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public boolean writeResponseData(byte[] bArr, int i, int i2) {
        return super.writeResponseData(bArr, i, i2);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    public boolean closeResponse(boolean z) {
        return super.closeResponse(z);
    }
}
