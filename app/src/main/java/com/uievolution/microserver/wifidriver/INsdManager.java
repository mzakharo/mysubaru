package com.uievolution.microserver.wifidriver;

/* loaded from: classes.dex */
interface INsdManager {

    /* loaded from: classes.dex */
    public interface IRegistrationListener {
        void onServiceRegistered();

        void onServiceUnregistered();
    }

    boolean a(IRegistrationListener iRegistrationListener);

    boolean a(String str, String str2, int i, IRegistrationListener iRegistrationListener);
}
