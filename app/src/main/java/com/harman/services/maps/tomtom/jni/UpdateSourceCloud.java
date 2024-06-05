package com.harman.services.maps.tomtom.jni;

import com.harman.services.Log;
import com.harman.services.maps.tomtom.IFetchObserver;
import com.harman.services.maps.tomtom.exceptions.UpdateCancelException;
import java.io.OutputStream;

/* loaded from: classes.dex */
public class UpdateSourceCloud extends UpdateSourceBase {
    private static final String TAG = "UpdateSourceCloud";
    String m_key;
    String m_url;

    /* JADX INFO: Access modifiers changed from: package-private */
    public UpdateSourceCloud(String str, String str2) {
        this.m_url = str;
        this.m_key = str2;
    }

    @Override // com.harman.services.maps.tomtom.jni.UpdateSourceBase
    public void fetch(String str, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        Log.i(TAG, "fetch");
        String str2 = this.m_url + "?uri=" + str;
        if (!this.m_key.isEmpty()) {
            str2 = str2 + "&key=" + this.m_key;
        }
        if (!DownloadManager.getInstance().isCancelled()) {
            DownloadManager.getInstance().downloadPackage(str2, outputStream);
            return;
        }
        throw new UpdateCancelException("Update Cancelled");
    }
}
