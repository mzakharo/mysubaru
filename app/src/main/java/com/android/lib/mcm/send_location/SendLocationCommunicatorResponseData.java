package com.android.lib.mcm.send_location;
/* loaded from: classes.dex */
public class SendLocationCommunicatorResponseData {
    private int mStatusCode = 0;
    private String mResponse = "";
    private String mContentType = "";
    private CommunicationStatus mCommunicationStatus = CommunicationStatus.Success;

    /* loaded from: classes.dex */
    public enum CommunicationStatus {
        Success,
        Incommunicable,
        Timeout,
        UnknownHost,
        SSLHandshakeError,
        OtherError
    }

    public void setStatusCode(int i) {
        this.mStatusCode = i;
    }

    public int getStatusCode() {
        return this.mStatusCode;
    }

    public void setResponse(String str) {
        this.mResponse = str;
    }

    public String getResponse() {
        return this.mResponse;
    }

    public void setContentType(String str) {
        this.mContentType = str;
    }

    public String getContentType() {
        return this.mContentType;
    }

    public void setCommunicationStatus(CommunicationStatus communicationStatus) {
        this.mCommunicationStatus = communicationStatus;
    }

    public CommunicationStatus getCommunicationStatus() {
        return this.mCommunicationStatus;
    }
}
