package com.harman.services.maps.tomtom.jni;

import com.harman.services.maps.tomtom.CatalogRequest;
import com.harman.services.maps.tomtom.IFetchObserver;
import com.harman.services.maps.tomtom.IUpdateSource;
import com.harman.services.maps.tomtom.ResourceRequest;
import com.harman.services.maps.tomtom.SummaryRequest;
import com.harman.services.maps.tomtom.exceptions.UpdateCancelException;
import java.io.OutputStream;

/* loaded from: classes.dex */
public class UpdateSource implements IUpdateSource {
    IUpdateSource m_source;

    /* JADX INFO: Access modifiers changed from: package-private */
    public UpdateSource(String str, String str2) {
        if (str.startsWith("file://")) {
            this.m_source = new UpdateSourceDir(str.substring(7));
            return;
        }
        if (str.startsWith("zip://")) {
            this.m_source = new UpdateSourceZip(str.substring(6));
        } else if (str.startsWith("jenkins+")) {
            this.m_source = new UpdateSourceJenkins(str.substring(8));
        } else {
            this.m_source = new UpdateSourceCloud(str, str2);
        }
    }

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(CatalogRequest catalogRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        this.m_source.fetch(catalogRequest, outputStream, iFetchObserver);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(SummaryRequest summaryRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        this.m_source.fetch(summaryRequest, outputStream, iFetchObserver);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateSource
    public void fetch(ResourceRequest resourceRequest, OutputStream outputStream, IFetchObserver iFetchObserver) throws UpdateCancelException {
        this.m_source.fetch(resourceRequest, outputStream, iFetchObserver);
    }
}
