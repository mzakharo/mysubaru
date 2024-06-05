package com.subaru.global.infotainment.gen2.extend.eve.json;

import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class EVEResponse {

    @SerializedName("response")
    private String mResponse;

    @SerializedName("return_cd")
    private String returnCd;

    public String getReturnCd() {
        return this.returnCd;
    }

    public void setReturnCd(String str) {
        this.returnCd = str;
    }

    public String getResponse() {
        return this.mResponse;
    }

    public void setResponse(String str) {
        this.mResponse = str;
    }
}
