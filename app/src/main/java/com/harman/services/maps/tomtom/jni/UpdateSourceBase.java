package com.harman.services.maps.tomtom.jni;

import com.harman.services.maps.tomtom.CatalogRequest;
import com.harman.services.maps.tomtom.IFetchObserver;
import com.harman.services.maps.tomtom.IUpdateSource;
import com.harman.services.maps.tomtom.ResourceRequest;
import com.harman.services.maps.tomtom.SummaryRequest;
import com.harman.services.maps.tomtom.exceptions.UpdateCancelException;
import java.io.OutputStream;

/* loaded from: classes.dex */
public abstract class UpdateSourceBase implements IUpdateSource {
    public abstract void fetch(String str, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException;

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(CatalogRequest catalogRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        fetch(Native.getInstance().getUri(catalogRequest), outputStream, iFetchObserver);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(SummaryRequest summaryRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        fetch(Native.getInstance().getUri(summaryRequest), outputStream, iFetchObserver);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(ResourceRequest resourceRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        fetch(Native.getInstance().getUri(resourceRequest), outputStream, iFetchObserver);
    }
}
