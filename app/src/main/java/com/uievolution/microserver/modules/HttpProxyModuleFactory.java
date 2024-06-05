package com.uievolution.microserver.modules;

import com.uievolution.microserver.MSModule;
import com.uievolution.microserver.MSModuleFactory;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.utils.PropertiesConfiguration;
import java.util.ArrayList;
import java.util.List;

/* loaded from: classes.dex */
public class HttpProxyModuleFactory implements MSModuleFactory {
    private final List<Class<? extends MSHTTPProxyResponseInterceptor>> a = new ArrayList();

    /* JADX WARN: Multi-variable type inference failed */
    public HttpProxyModuleFactory(PropertiesConfiguration propertiesConfiguration) {
        int i = propertiesConfiguration.getInt("httpmodule.interceptor.response.num", 0);
        for (int i2 = 0; i2 < i; i2++) {
            String string = propertiesConfiguration.getString("httpmodule.interceptor.response." + i2);
            if (string != null) {
                try {
                    this.a.add((Class<? extends MSHTTPProxyResponseInterceptor>) Class.forName(string));
                    MicroServer.Logger.i("HttpProxyModuleFactory", "Load HTTP response interceptor: " + string);
                } catch (Exception e) {
                    MicroServer.Logger.w("HttpProxyModuleFactory", "Failed to load MSHTTPProxyResponseInterceptor, " + e.getMessage());
                }
            }
        }
    }

    @Override // com.uievolution.microserver.MSModuleFactory
    public MSModule create() {
        HttpProxyModule httpProxyModule = new HttpProxyModule();
        httpProxyModule.a(this.a);
        return httpProxyModule;
    }
}
