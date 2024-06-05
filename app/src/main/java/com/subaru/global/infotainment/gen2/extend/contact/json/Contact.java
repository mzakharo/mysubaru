package com.subaru.global.infotainment.gen2.extend.contact.json;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/* loaded from: classes.dex */
public class Contact {
    private List<Address> address;

    @SerializedName("contact_id")
    private String contactId;

    @SerializedName("mail_address")
    private List<CommonTypedData> emailAddress;
    private Name name;

    @SerializedName("phone_number")
    private List<CommonTypedData> phoneNumber;

    public String getContactId() {
        return this.contactId;
    }

    public void setContactId(String str) {
        this.contactId = str;
    }

    public Name getName() {
        return this.name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public List<CommonTypedData> getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setPhoneNumber(List<CommonTypedData> list) {
        this.phoneNumber = list;
    }

    public List<Address> getAddress() {
        return this.address;
    }

    public void setAddress(List<Address> list) {
        this.address = list;
    }

    public List<CommonTypedData> getEmailAddress() {
        return this.emailAddress;
    }

    public void setEmailAddress(List<CommonTypedData> list) {
        this.emailAddress = list;
    }
}
