package com.clarion.android.smartaccess4car.extend.getproxy;

/* loaded from: classes.dex */
class RequestData {
    private String mContentType;
    private String mEncryptKeyVersion;
    private String mEncryptParamList;
    private String mGetQueryParam;
    private String mKeyId;
    private KeyId mKeyInfo;
    private String mPostData;
    private String mRefresh;
    private String mServiceProviderHttpRequestMethod;
    private String mServiceProviderRequestHeader;
    private String mServiceProviderType;
    private String mServiceProviderUrl;
    private Integer mTimeout;

    public String getKeyId() {
        return this.mKeyId;
    }

    public void setKeyId(String str) {
        this.mKeyId = str;
    }

    public String getRefresh() {
        return this.mRefresh;
    }

    public void setRefresh(String str) {
        this.mRefresh = str;
    }

    public String getServiceProviderUrl() {
        return this.mServiceProviderUrl;
    }

    public void setServiceProviderUrl(String str) {
        this.mServiceProviderUrl = str;
    }

    public String getServiceProviderHttpRequestMethod() {
        return this.mServiceProviderHttpRequestMethod;
    }

    public void setServiceProviderHttpRequestMethod(String str) {
        this.mServiceProviderHttpRequestMethod = str;
    }

    public String getServiceProviderType() {
        return this.mServiceProviderType;
    }

    public void setServiceProviderType(String str) {
        this.mServiceProviderType = str;
    }

    public String getGetQueryParam() {
        return this.mGetQueryParam;
    }

    public void setGetQueryParam(String str) {
        this.mGetQueryParam = str;
    }

    public String getPostData() {
        return this.mPostData;
    }

    public void setPostData(String str) {
        this.mPostData = str;
    }

    public String getContentType() {
        return this.mContentType;
    }

    public void setContentType(String str) {
        this.mContentType = str;
    }

    public String getEncryptParamList() {
        return this.mEncryptParamList;
    }

    public void setEncryptParamList(String str) {
        this.mEncryptParamList = str;
    }

    public String getEncryptKeyVersion() {
        return this.mEncryptKeyVersion;
    }

    public void setEncryptKeyVersion(String str) {
        this.mEncryptKeyVersion = str;
    }

    public KeyId getKeyInfo() {
        return this.mKeyInfo;
    }

    public void setKeyInfo(KeyId keyId) {
        this.mKeyInfo = keyId;
    }

    public Integer getTimeout() {
        return this.mTimeout;
    }

    public String getServiceProviderRequestHeader() {
        return this.mServiceProviderRequestHeader;
    }

    public void setTimeout(Integer num) {
        this.mTimeout = num;
    }

    public void setServiceProviderRequestHeader(String str) {
        this.mServiceProviderRequestHeader = str;
    }
}
