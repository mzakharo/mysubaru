package com.clarion.android.smartaccess4car.extend.getproxy;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;

/* loaded from: classes.dex */
class ResponseData {
    private String mContentType;
    private int mDataLength;
    private byte[] mEncryptByteData;
    private String mEncryptData;
    private Const.MessageInfo mMessageInfo;
    private String mResponseData;

    public String getResponseData() {
        return this.mResponseData;
    }

    public void setResponseData(String str) {
        this.mResponseData = str;
    }

    public String getEncryptData() {
        return this.mEncryptData;
    }

    public void setEncryptData(String str) {
        this.mEncryptData = str;
    }

    public byte[] getEncryptByteData() {
        return this.mEncryptByteData;
    }

    public void setEncryptByteData(byte[] bArr) {
        this.mEncryptByteData = bArr;
    }

    public String getContentType() {
        return this.mContentType;
    }

    public void setContentType(String str) {
        this.mContentType = str;
    }

    public int getDataLength() {
        return this.mDataLength;
    }

    public void setDataLength(int i) {
        this.mDataLength = i;
    }

    public Const.MessageInfo getMessageInfo() {
        return this.mMessageInfo;
    }

    public void setMessageInfo(Const.MessageInfo messageInfo) {
        this.mMessageInfo = messageInfo;
    }
}
