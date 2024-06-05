package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class SummaryRequest {
    CatalogRequest m_catalogRequest;
    int m_fromVersion;
    int m_toVersion;

    SummaryRequest(CatalogRequest catalogRequest, int i, int i2) {
        this.m_catalogRequest = catalogRequest;
        this.m_fromVersion = i;
        this.m_toVersion = i2;
    }

    final CatalogRequest getCatalogRequest() {
        return this.m_catalogRequest;
    }

    int getFromVersion() {
        return this.m_fromVersion;
    }

    int getToVersion() {
        return this.m_toVersion;
    }
}
