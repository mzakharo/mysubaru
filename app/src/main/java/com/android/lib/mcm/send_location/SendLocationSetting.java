package com.android.lib.mcm.send_location;

import java.io.Serializable;
/* loaded from: classes.dex */
public class SendLocationSetting implements Serializable {
    private static final long serialVersionUID = 8842634279047606795L;
    private long mInfoPollingInterval = 30000;

    public long getInfoPollingInterval() {
        return this.mInfoPollingInterval;
    }

    public void setInfoPollingInterval(long j) {
        this.mInfoPollingInterval = j;
    }
}
