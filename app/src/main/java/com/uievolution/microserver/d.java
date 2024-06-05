package com.uievolution.microserver;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class d {
    private final MSModuleFactory a;
    private DigestAuth b;

    public d(MSModuleFactory mSModuleFactory) {
        this.a = mSModuleFactory;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(DigestAuth digestAuth) {
        this.b = digestAuth;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String b() {
        return this.a.getClass().getName();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSModule a() {
        MSModule create = this.a.create();
        DigestAuth digestAuth = this.b;
        if (digestAuth != null) {
            create.setDigestAuth(digestAuth);
        }
        return create;
    }
}
