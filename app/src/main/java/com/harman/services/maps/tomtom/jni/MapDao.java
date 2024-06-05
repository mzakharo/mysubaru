package com.harman.services.maps.tomtom.jni;

/* loaded from: classes.dex */
public class MapDao {
    private int baseLineId;
    private int downloadStatus;
    private String downloadURL;
    private String downloadedTime;
    private long fileSize;
    private int fileTransferStatus;
    private int fromVersion;
    private String huDeviceCode;
    private String huModel;
    private String huProductCode;
    private boolean isHURequestedToStopDownload;
    private int key_id;
    private String lastConnectedTime;
    private String localURI;
    private int notificationSent;
    private int productId;
    private int regionId;
    private int reqId;
    private int requestId;
    private int retryCount;
    private int supplierId;
    private int toVersion;
    private long uniqueRowId;

    public int getFileTransferStatus() {
        return this.fileTransferStatus;
    }

    public void setFileTransferStatus(int i) {
        this.fileTransferStatus = i;
    }

    public int getDownloadStatus() {
        return this.downloadStatus;
    }

    public void setDownloadStatus(int i) {
        this.downloadStatus = i;
    }

    public int getProductId() {
        return this.productId;
    }

    public void setProductId(int i) {
        this.productId = i;
    }

    public int getSupplierId() {
        return this.supplierId;
    }

    public void setSupplierId(int i) {
        this.supplierId = i;
    }

    public int getBaseLineId() {
        return this.baseLineId;
    }

    public void setBaseLineId(int i) {
        this.baseLineId = i;
    }

    public int getRegionId() {
        return this.regionId;
    }

    public void setRegionId(int i) {
        this.regionId = i;
    }

    public int getFromVersion() {
        return this.fromVersion;
    }

    public void setFromVersion(int i) {
        this.fromVersion = i;
    }

    public int getToVersion() {
        return this.toVersion;
    }

    public void setToVersion(int i) {
        this.toVersion = i;
    }

    public String getHuDeviceCode() {
        return this.huDeviceCode;
    }

    public void setHuDeviceCode(String str) {
        this.huDeviceCode = str;
    }

    public String getHuProductCode() {
        return this.huProductCode;
    }

    public void setHuProductCode(String str) {
        this.huProductCode = str;
    }

    public int getReqId() {
        return this.reqId;
    }

    public void setReqId(int i) {
        this.reqId = i;
    }

    public boolean isHURequestedToStopDownload() {
        return this.isHURequestedToStopDownload;
    }

    public void setHURequestedToStopDownload(boolean z) {
        this.isHURequestedToStopDownload = z;
    }

    public long getFileSize() {
        return this.fileSize;
    }

    public void setFileSize(long j) {
        this.fileSize = j;
    }

    public String getLocalURI() {
        return this.localURI;
    }

    public void setLocalURI(String str) {
        this.localURI = str;
    }

    public String getLastConnectedTime() {
        return this.lastConnectedTime;
    }

    public void setLastConnectedTime(String str) {
        this.lastConnectedTime = str;
    }

    public long getUniqueRowId() {
        return this.uniqueRowId;
    }

    public void setUniqueRowId(long j) {
        this.uniqueRowId = j;
    }

    public int isNotificationSent() {
        return this.notificationSent;
    }

    public void setNotificationSent(int i) {
        this.notificationSent = i;
    }

    public int getRetryCount() {
        return this.retryCount;
    }

    public void setRetryCount(int i) {
        this.retryCount = i;
    }

    public int getRequestId() {
        return this.requestId;
    }

    public void setRequestId(int i) {
        this.requestId = i;
    }

    public int getKey_id() {
        return this.key_id;
    }

    public void setKey_id(int i) {
        this.key_id = i;
    }

    public String getDownloadURL() {
        return this.downloadURL;
    }

    public void setDownloadURL(String str) {
        this.downloadURL = str;
    }

    public String getDownloadedTime() {
        return this.downloadedTime;
    }

    public void setDownloadedTime(String str) {
        this.downloadedTime = str;
    }

    public String getHuModel() {
        return this.huModel;
    }

    public void setHuModel(String str) {
        this.huModel = str;
    }
}
