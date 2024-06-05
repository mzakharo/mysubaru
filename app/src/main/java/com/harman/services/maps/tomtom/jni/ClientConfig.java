package com.harman.services.maps.tomtom.jni;

import android.content.Context;
import com.harman.services.maps.tomtom.IFetchObserver;
import com.harman.services.maps.tomtom.IKeyProvider;
import com.harman.services.maps.tomtom.IUpdateObserver;
import com.harman.services.maps.tomtom.IUpdateSource;
import com.harman.services.maps.tomtom.IValidationObserver;

/* loaded from: classes.dex */
public class ClientConfig {
    String apiKey;
    Context mContext;
    String mFilePathName;
    boolean mIsPartial;
    String tomTomURI;

    String getRootDir() {
        return "";
    }

    public ClientConfig(Context context) {
        this.mContext = context;
    }

    public String getApiKey() {
        return this.apiKey;
    }

    public void setApiKey(String str) {
        this.apiKey = str;
    }

    public String getCacheDir() {
        return this.mContext.getCacheDir().getAbsolutePath();
    }

    public void setDownloadPath(String str) {
        this.mFilePathName = str;
    }

    public void setTomTomURI(String str) {
        this.tomTomURI = str;
    }

    String getFetchDir() {
        return this.mFilePathName;
    }

    IUpdateSource getUpdateSource() {
        return new UpdateSource(this.tomTomURI, this.apiKey);
    }

    IFetchObserver getFetchObserver() {
        return new MyObserver();
    }

    IUpdateObserver getUpdateObserver() {
        return new MyObserver();
    }

    IValidationObserver getValidationObserver() {
        return new MyObserver();
    }

    IKeyProvider getKeyProvider() {
        return new KeyProvider("", "");
    }

    public boolean getForcePartialUpdates() {
        return this.mIsPartial;
    }

    public void setForcePartialUpdates(boolean z) {
        this.mIsPartial = z;
    }
}
