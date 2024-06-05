package com.subaru.global.infotainment.gen2.extend.contact.json;

import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class Name {

    @SerializedName("displayname")
    private String displayName;

    @SerializedName("firstname")
    private String firstName;

    @SerializedName("firstname_phonetic")
    private String firstNamePhonetic;

    @SerializedName("lastname")
    private String lastName;

    @SerializedName("lastname_phonetic")
    private String lastNamePhonetic;

    @SerializedName("middlename")
    private String middleName;

    @SerializedName("middlename_phonetic")
    private String middleNamePhonetic;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String str) {
        this.firstName = str;
    }

    public String getMiddleName() {
        return this.middleName;
    }

    public void setMiddleName(String str) {
        this.middleName = str;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String str) {
        this.lastName = str;
    }

    public String getFirstNamePhonetic() {
        return this.firstNamePhonetic;
    }

    public void setFirstNamePhonetic(String str) {
        this.firstNamePhonetic = str;
    }

    public String getMiddleNamePhonetic() {
        return this.middleNamePhonetic;
    }

    public void setMiddleNamePhonetic(String str) {
        this.middleNamePhonetic = str;
    }

    public String getLastNamePhonetic() {
        return this.lastNamePhonetic;
    }

    public void setLastNamePhonetic(String str) {
        this.lastNamePhonetic = str;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String str) {
        this.displayName = str;
    }
}
