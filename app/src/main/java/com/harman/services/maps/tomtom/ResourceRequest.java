package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class ResourceRequest {
    private String m_relativeUri;
    private SummaryRequest m_summaryRequest;

    ResourceRequest(SummaryRequest summaryRequest, String str) {
        this.m_summaryRequest = summaryRequest;
        this.m_relativeUri = str;
    }

    final SummaryRequest getSummaryRequest() {
        return this.m_summaryRequest;
    }

    final String getRelativeUri() {
        return this.m_relativeUri;
    }
}
