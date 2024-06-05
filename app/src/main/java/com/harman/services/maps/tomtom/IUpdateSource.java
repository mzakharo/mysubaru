package com.harman.services.maps.tomtom;

import com.harman.services.maps.tomtom.exceptions.UpdateCancelException;
import java.io.OutputStream;

/* loaded from: classes.dex */
public interface IUpdateSource {
    void fetch(CatalogRequest catalogRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException;

    void fetch(ResourceRequest resourceRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException;

    void fetch(SummaryRequest summaryRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException;
}
