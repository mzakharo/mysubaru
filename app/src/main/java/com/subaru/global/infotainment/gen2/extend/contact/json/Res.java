package com.subaru.global.infotainment.gen2.extend.contact.json;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/* loaded from: classes.dex */
public class Res {
    private List<Contact> contact;
    private String method;

    @SerializedName("return_cd")
    private String returnCd;

    @SerializedName("searchcount")
    private String searchCount;

    public String getReturnCd() {
        return this.returnCd;
    }

    public void setReturnCd(String str) {
        this.returnCd = str;
    }

    public List<Contact> getContact() {
        return this.contact;
    }

    public void setContact(List<Contact> list) {
        this.contact = list;
    }

    public String getSearchCount() {
        return this.searchCount;
    }

    public void setSearchCount(String str) {
        this.searchCount = str;
    }

    public String getMethod() {
        return this.method;
    }

    public void setMethod(String str) {
        this.method = str;
    }
}
