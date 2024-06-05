package com.uievolution.microserver.wifidriver;

import android.os.Parcel;
import android.os.Parcelable;

/* loaded from: classes.dex */
public class WiFiParam implements Parcelable {
    public static final Parcelable.Creator<WiFiParam> CREATOR = new a();
    private Type a;
    private int b;
    private String c;

    /* loaded from: classes.dex */
    public enum Type {
        SERVER,
        CLIENT
    }

    /* loaded from: classes.dex */
    static class a implements Parcelable.Creator<WiFiParam> {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public WiFiParam createFromParcel(Parcel parcel) {
            return new WiFiParam(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public WiFiParam[] newArray(int i) {
            return new WiFiParam[i];
        }
    }

    WiFiParam(Parcel parcel) {
        this.a = Type.SERVER;
        this.c = "";
        this.a = Type.valueOf(parcel.readString());
        this.b = parcel.readInt();
        this.c = parcel.readString();
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public String getAddr() {
        return this.c;
    }

    public int getPort() {
        return this.b;
    }

    public Type getType() {
        return this.a;
    }

    public void setAddr(String str) {
        this.c = str;
    }

    public void setPort(int i) {
        this.b = i;
    }

    public void setType(Type type) {
        this.a = type;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.a.name());
        parcel.writeInt(this.b);
        parcel.writeString(this.c);
    }
}
