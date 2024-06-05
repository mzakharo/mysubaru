package com.uievolution.microserver.wifidriver;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.wifidriver.INsdManager;
import java.util.HashMap;
import java.util.Map;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class a implements INsdManager {
    private final Map<INsdManager.IRegistrationListener, C0020a> a = new HashMap();

    /* renamed from: com.uievolution.microserver.wifidriver.a$a, reason: collision with other inner class name */
    /* loaded from: classes.dex */
    static class C0020a implements NsdManager.RegistrationListener {
        private INsdManager.IRegistrationListener a;

        C0020a(INsdManager.IRegistrationListener iRegistrationListener) {
            this.a = iRegistrationListener;
        }

        @Override // android.net.nsd.NsdManager.RegistrationListener
        public void onRegistrationFailed(NsdServiceInfo nsdServiceInfo, int i) {
            MicroServer.Logger.w("NsbManagerJB", "UnregistrationFailed serviceName=" + nsdServiceInfo + ", errorCode=" + i);
        }

        @Override // android.net.nsd.NsdManager.RegistrationListener
        public void onServiceRegistered(NsdServiceInfo nsdServiceInfo) {
            this.a.onServiceRegistered();
            MicroServer.Logger.d("NsbManagerJB", "Service registered, " + nsdServiceInfo.getServiceName() + ", " + nsdServiceInfo.getServiceType());
        }

        @Override // android.net.nsd.NsdManager.RegistrationListener
        public void onServiceUnregistered(NsdServiceInfo nsdServiceInfo) {
            this.a.onServiceUnregistered();
            MicroServer.Logger.d("NsbManagerJB", "Service unregistered, " + nsdServiceInfo.getServiceName() + ", " + nsdServiceInfo.getServiceType());
        }

        @Override // android.net.nsd.NsdManager.RegistrationListener
        public void onUnregistrationFailed(NsdServiceInfo nsdServiceInfo, int i) {
            MicroServer.Logger.w("NsbManagerJB", "RegistrationFailed serviceName=" + nsdServiceInfo + ", errorCode=" + i);
        }
    }

    @Override // com.uievolution.microserver.wifidriver.INsdManager
    public synchronized boolean a(String str, String str2, int i, INsdManager.IRegistrationListener iRegistrationListener) {
        NsdManager nsdManager = (NsdManager) MicroServer.getInstance().getContext().getSystemService("servicediscovery");
        if (nsdManager == null) {
            return false;
        }
        if (i < 0) {
            return false;
        }
        C0020a c0020a = new C0020a(iRegistrationListener);
        this.a.put(iRegistrationListener, c0020a);
        NsdServiceInfo nsdServiceInfo = new NsdServiceInfo();
        nsdServiceInfo.setServiceName(str);
        nsdServiceInfo.setServiceType(str2);
        nsdServiceInfo.setPort(i);
        nsdManager.registerService(nsdServiceInfo, 1, c0020a);
        return true;
    }

    @Override // com.uievolution.microserver.wifidriver.INsdManager
    public synchronized boolean a(INsdManager.IRegistrationListener iRegistrationListener) {
        C0020a remove = this.a.remove(iRegistrationListener);
        if (remove == null) {
            return false;
        }
        NsdManager nsdManager = (NsdManager) MicroServer.getInstance().getContext().getSystemService("servicediscovery");
        if (nsdManager == null) {
            return false;
        }
        nsdManager.unregisterService(remove);
        return true;
    }
}
