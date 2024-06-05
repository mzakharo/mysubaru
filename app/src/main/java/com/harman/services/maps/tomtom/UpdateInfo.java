package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class UpdateInfo {
    private long mDataSize;
    private boolean mFetched;
    private long mFetchedSize;
    private long mNumOperations;
    private boolean mPartial;

    UpdateInfo(long j, long j2, long j3, boolean z, boolean z2) {
        this.mNumOperations = j;
        this.mDataSize = j2;
        this.mFetchedSize = j3;
        this.mFetched = z;
        this.mPartial = z2;
    }

    public long getDataSize() {
        return this.mDataSize;
    }

    public long getFetchedDataSize() {
        return this.mFetchedSize;
    }

    public long getNumOperations() {
        return this.mNumOperations;
    }

    public boolean isFetched() {
        return this.mFetched;
    }

    public boolean isPartial() {
        return this.mPartial;
    }
}
