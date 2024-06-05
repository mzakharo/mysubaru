package com.android.lib.mcm.send_location;

import java.util.HashMap;
/* loaded from: classes.dex */
public class SendLocationInfo {
    private String mUrl = "";
    private HashMap<String, String> mHeader = new HashMap<>();
    private Method mMethod = Method.get;
    private String mFormat = "";
    private String mLat = "";
    private String mLon = "";
    private String mSpeed = "";
    private String mTaskID = "";

    /* loaded from: classes.dex */
    public enum Method {
        get,
        post
    }

    public String getUrl() {
        return this.mUrl;
    }

    public void setUrl(String str) {
        this.mUrl = str;
    }

    public HashMap<String, String> getHeader() {
        return this.mHeader;
    }

    public Method getMethod() {
        return this.mMethod;
    }

    public void setMethod(Method method) {
        this.mMethod = method;
    }

    public String getFormat() {
        return this.mFormat;
    }

    public void setFormat(String str) {
        this.mFormat = str;
    }

    public String getLat() {
        return this.mLat;
    }

    public void setLat(String str) {
        this.mLat = str;
    }

    public String getLon() {
        return this.mLon;
    }

    public void setLon(String str) {
        this.mLon = str;
    }

    public String getSpeed() {
        return this.mSpeed;
    }

    public void setSpeed(String str) {
        this.mSpeed = str;
    }

    public String getTaskID() {
        return this.mTaskID;
    }

    public void setTaskID(String str) {
        this.mTaskID = str;
    }
}
