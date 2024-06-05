package com.harman.services.maps.tomtom.jni;

import com.harman.services.Log;
import com.harman.services.maps.tomtom.IFetchObserver;
import java.io.OutputStream;

/* loaded from: classes.dex */
public class UpdateSourceJenkins extends UpdateSourceBase {
    private static final String TAG = "com.harman.services.maps.tomtom.jni.UpdateSourceJenkins";
    String m_url;

    /* JADX INFO: Access modifiers changed from: package-private */
    public UpdateSourceJenkins(String str) {
        this.m_url = str;
    }

    @Override // com.harman.services.maps.tomtom.jni.UpdateSourceBase
    public void fetch(String str, OutputStream outputStream, IFetchObserver iFetchObserver) {
        Log.i(TAG, "fetch");
    }
}
