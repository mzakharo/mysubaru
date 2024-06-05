package com.clarion.android.smartaccess4car.extend.getproxy;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;

/* loaded from: classes.dex */
class GetProxyException extends Exception {
    private Const.MessageInfo mMessageInfo;

    public GetProxyException(Const.MessageInfo messageInfo) {
        setMessageInfo(messageInfo);
    }

    public Const.MessageInfo getMessageInfo() {
        return this.mMessageInfo;
    }

    public void setMessageInfo(Const.MessageInfo messageInfo) {
        this.mMessageInfo = messageInfo;
    }
}
