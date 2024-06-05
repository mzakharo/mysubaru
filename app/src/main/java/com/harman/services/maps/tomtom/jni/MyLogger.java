package com.harman.services.maps.tomtom.jni;

import com.harman.services.Log;
import com.harman.services.maps.tomtom.IPrinter;

/* loaded from: classes.dex */
public class MyLogger implements IPrinter {
    private static final String TAG = "TomTomLogger";

    @Override // com.harman.services.maps.tomtom.IPrinter
    public void onError(String str) {
        Log.e(TAG, "onError : " + str);
    }

    @Override // com.harman.services.maps.tomtom.IPrinter
    public void onWarning(String str) {
        Log.w(TAG, "onWarning : " + str);
    }

    @Override // com.harman.services.maps.tomtom.IPrinter
    public void onInfo(String str) {
        Log.i(TAG, "onInfo: " + str);
    }

    @Override // com.harman.services.maps.tomtom.IPrinter
    public void onDebug(String str) {
        Log.d(TAG, "onDebug : " + str);
    }
}
