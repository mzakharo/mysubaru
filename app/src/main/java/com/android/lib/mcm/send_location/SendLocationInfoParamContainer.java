package com.android.lib.mcm.send_location;
/* loaded from: classes.dex */
public class SendLocationInfoParamContainer {
    private String mLocationLongitude = "";
    private String mLocationLatitude = "";
    private String mSpeed = "";
    private String mAccelerationX = "";
    private String mAccelerationY = "";
    private String mAccelerationZ = "";
    private String mOrientation = "";
    private String mPid = "";
    private SendLocationCommunicatorResponseData mResponseData = null;
    private String mLocationTimestamp = null;
    private String mAccelerationTimestamp = null;
    private String mOrientationTimestamp = null;
    private String mSpeedTimestamp = null;
    private String mPidTimestamp = null;

    public void setLocation(String str, String str2, String str3) {
        this.mLocationLongitude = str;
        this.mLocationLatitude = str2;
        this.mLocationTimestamp = str3;
    }

    public void setSpeed(String str, String str2) {
        this.mSpeed = str;
        this.mSpeedTimestamp = str2;
    }

    public void setAcceleration(String str, String str2, String str3, String str4) {
        this.mAccelerationX = str;
        this.mAccelerationY = str2;
        this.mAccelerationZ = str3;
        this.mAccelerationTimestamp = str4;
    }

    public void setOrientation(String str, String str2) {
        this.mOrientation = str;
        this.mOrientationTimestamp = str2;
    }

    public void setPid(String str, String str2) {
        this.mPid = str;
        this.mPidTimestamp = str2;
    }

    public void setResponseData(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) {
        this.mResponseData = sendLocationCommunicatorResponseData;
    }

    public String getLocationLongitude() {
        return this.mLocationLongitude;
    }

    public String getLocationLatitude() {
        return this.mLocationLatitude;
    }

    public String getLocationTimestamp() {
        return this.mLocationTimestamp;
    }

    public String getSpeed() {
        return this.mSpeed;
    }

    public String getSpeedTimestamp() {
        return this.mSpeedTimestamp;
    }

    public String getAccelerationX() {
        return this.mAccelerationX;
    }

    public String getAccelerationY() {
        return this.mAccelerationY;
    }

    public String getAccelerationZ() {
        return this.mAccelerationZ;
    }

    public String getAccelerationTimestamp() {
        return this.mAccelerationTimestamp;
    }

    public String getOrientation() {
        return this.mOrientation;
    }

    public String getOrientationTimestamp() {
        return this.mOrientationTimestamp;
    }

    public String getPid() {
        return this.mPid;
    }

    public String getPidTimestamp() {
        return this.mPidTimestamp;
    }

    public SendLocationCommunicatorResponseData getResponseData() {
        return this.mResponseData;
    }
}
