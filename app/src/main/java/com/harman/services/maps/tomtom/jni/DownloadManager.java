package com.harman.services.maps.tomtom.jni;

/* loaded from: classes.dex */
public class DownloadManager {
    private static final String TAG = "DownloadManager";
    public static boolean isDownloadInterrupted = false;
    private static DownloadManager sInstance;
    private String aModel;
    private int currentProgress;
    private int mBaselineId;
    String mDeviceCode;
    private int mFromVersion;
    String mProductCode;
    private int mProductId;
    private int mSupplierId;
    private int mToVersion;
    private long regionDataSize;
    private long totalDownloadSize;
    boolean isDownloadInProgress = false;
    private int mRegionId = 0;
    private boolean isCancelRequired = false;
    private boolean isStopRequired = false;

    private DownloadManager() {
    }

    public static synchronized DownloadManager getInstance() {
        DownloadManager downloadManager;
        synchronized (DownloadManager.class) {
            if (sInstance == null) {
                sInstance = new DownloadManager();
            }
            downloadManager = sInstance;
        }
        return downloadManager;
    }

    public boolean isDownloadInProgress() {
        return this.isDownloadInProgress;
    }

    public void setDownloadInProgress(boolean z) {
        this.isDownloadInProgress = z;
    }

    public long getRegionDataSize() {
        return this.regionDataSize;
    }

    public void setRegionDataSize(long j) {
        this.regionDataSize = j;
        this.totalDownloadSize = 0L;
    }

    public long getTotalDownloadSize() {
        return this.totalDownloadSize;
    }

    public void setTotalDownloadSize(long j) {
        this.totalDownloadSize = j;
    }

    public void cancelCurrentDownload(boolean z) {
        this.isCancelRequired = z;
    }

    public boolean isCancelled() {
        return this.isCancelRequired;
    }

    public void stopCurrentDownload(boolean z) {
        this.isStopRequired = z;
    }

    public boolean isStopped() {
        return this.isStopRequired;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    /* JADX WARN: Removed duplicated region for block: B:48:? A[RETURN, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:58:0x0116 A[DONT_GENERATE, FINALLY_INSNS] */
    /* JADX WARN: Removed duplicated region for block: B:60:? A[DONT_GENERATE, FINALLY_INSNS, SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public void downloadPackage(java.lang.String r18, java.io.OutputStream r19) throws com.harman.services.maps.tomtom.exceptions.UpdateCancelException {
        /*
            Method dump skipped, instructions count: 284
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.tomtom.jni.DownloadManager.downloadPackage(java.lang.String, java.io.OutputStream):void");
    }

    /* JADX WARN: Can't wrap try/catch for region: R(7:10|(2:15|(1:17)(3:18|19|20))|23|24|25|19|20) */
    /* JADX WARN: Code restructure failed: missing block: B:27:0x00ce, code lost:
    
        com.harman.services.Log.w(com.harman.services.maps.tomtom.jni.DownloadManager.TAG, "Temporary redirect failed!" + r2);
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private java.net.HttpURLConnection openHttpURLConnectionRec(java.lang.String r7) {
        /*
            Method dump skipped, instructions count: 266
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.tomtom.jni.DownloadManager.openHttpURLConnectionRec(java.lang.String):java.net.HttpURLConnection");
    }

    public String getDeviceCode() {
        return this.mDeviceCode;
    }

    public void setDeviceCode(String str) {
        this.mDeviceCode = str;
    }

    public int getCurrentProgress() {
        return this.currentProgress;
    }

    public void setCurrentProgress(int i) {
        this.currentProgress = i;
    }

    public String getProductCode() {
        return this.mProductCode;
    }

    public void setProductCode(String str) {
        this.mProductCode = str;
    }

    public int getProductId() {
        return this.mProductId;
    }

    public void setProductId(int i) {
        this.mProductId = i;
    }

    public int getSupplierId() {
        return this.mSupplierId;
    }

    public void setSupplierId(int i) {
        this.mSupplierId = i;
    }

    public int getBaselineId() {
        return this.mBaselineId;
    }

    public void setBaselineId(int i) {
        this.mBaselineId = i;
    }

    public int getRegionId() {
        return this.mRegionId;
    }

    public void setRegionId(int i) {
        this.mRegionId = i;
    }

    public int getFromVersion() {
        return this.mFromVersion;
    }

    public void setFromVersion(int i) {
        this.mFromVersion = i;
    }

    public int getToVersion() {
        return this.mToVersion;
    }

    public void setToVersion(int i) {
        this.mToVersion = i;
    }

    public String getModel() {
        return this.aModel;
    }

    public void setModel(String str) {
        this.aModel = str;
    }
}
