package com.uievolution.microserver.modules;

import com.uievolution.microserver.MSModule;
import com.uievolution.microserver.MSModuleFactory;
import com.uievolution.microserver.interceptor.httpsrequest.LocalHttpsInterceptor;
import com.uievolution.microserver.logging.MSLog;
import com.uievolution.microserver.utils.PropertiesConfiguration;
import java.util.ArrayList;
import java.util.List;

/* loaded from: classes.dex */
public class HttpsTunnelingModuleFactory implements MSModuleFactory {
    static final String b = "com.uievolution.microserver.modules.HttpsTunnelingModuleFactory";
    private final List<Class<? extends MSHTTPSProxyRequestInterceptor>> a;

    /* JADX WARN: Multi-variable type inference failed */
    public HttpsTunnelingModuleFactory(PropertiesConfiguration propertiesConfiguration) {
        ArrayList arrayList = new ArrayList();
        this.a = arrayList;
        arrayList.add(LocalHttpsInterceptor.class);
        int i = propertiesConfiguration.getInt("httpsmodule.interceptor.request.num", 0);
        for (int i2 = 0; i2 < i; i2++) {
            String string = propertiesConfiguration.getString("httpsmodule.interceptor.request." + i2);
            if (string != null) {
                try {
                    this.a.add((Class<? extends MSHTTPSProxyRequestInterceptor>) Class.forName(string));
                    MSLog.i(b, "Load HTTPS request interceptor: " + string);
                } catch (Exception e) {
                    MSLog.w(b, "Failed to load MSHTTPSProxyRequestInterceptor, " + e.getMessage());
                }
            }
        }
    }

    @Override // com.uievolution.microserver.MSModuleFactory
    public MSModule create() {
        HttpsTunnelingModule httpsTunnelingModule = new HttpsTunnelingModule();
        httpsTunnelingModule.a(this.a);
        return httpsTunnelingModule;
    }
}
