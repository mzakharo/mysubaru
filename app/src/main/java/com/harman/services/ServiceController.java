package com.harman.services;

import com.harman.services.maps.MapServiceManager;
import com.harman.services.maps.gen4.MapServiceManagerGen4;
import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class ServiceController {
    public static final String TAG = "ServiceController";
    IService mIService = null;
    private Map<String, IService> mServiceMap = new HashMap();

    public IService getService(String str) {
        String str2 = TAG;
        Log.i(str2, "Service Identifier:" + str);
        IService iService = this.mServiceMap.get(str);
        this.mIService = iService;
        if (iService != null) {
            return iService;
        }
        Log.i(str2, "Create New Instance for " + str);
        if (str == "com.hac.mapService.TomTom") {
            Log.i(str2, "getService  [Service Type] :" + str);
            this.mIService = new MapServiceManager();
        } else if (str == ServiceUtils.SERVICE_TYPE_TRAFFIC_INRIX) {
            Log.i(str2, "getService  [Service Type] :" + str);
            this.mIService = null;
        } else if (str == ServiceUtils.SERVICE_TYPE_TRAFFIC_HERE) {
            Log.i(str2, "getService  [Service Type] :" + str);
            this.mIService = null;
        } else if (str == "com.hac.mapService.TomTom.Gen4" || str == "com.hac.mapService.TomTom.Gen5") {
            Log.i(str2, "getService  [Service Type] :" + str);
            this.mIService = new MapServiceManagerGen4();
        }
        try {
            this.mServiceMap.put(str, this.mIService);
            return this.mIService;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
