package com.android.lib.mcm.send_location;

import java.util.HashMap;
/* loaded from: classes.dex */
public class SendLocationCommunicatorRequestData {
    private String mUrl = "";
    private String mParam = "";
    private String mData = "";
    private MethodType mMethod = MethodType.get;
    private HashMap<String, String> mHeader = new HashMap<>();

    /* loaded from: classes.dex */
    public enum MethodType {
        get,
        post
    }

    public String getUrl() {
        return this.mUrl;
    }

    public void setUrl(String str) {
        this.mUrl = str;
    }

    public String getParam() {
        return this.mParam;
    }

    public void setParam(String str) {
        this.mParam = str;
    }

    public String getData() {
        return this.mData;
    }

    public void setData(String str) {
        this.mData = str;
    }

    public MethodType getMethod() {
        return this.mMethod;
    }

    public void setMethod(MethodType methodType) {
        this.mMethod = methodType;
    }

    public HashMap<String, String> getHeader() {
        return this.mHeader;
    }
}
