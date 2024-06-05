package com.uievolution.microserver;

import android.os.Parcel;
import android.os.Parcelable;

/* loaded from: classes.dex */
public class MSError implements Parcelable {
    public static final Parcelable.Creator<MSError> CREATOR = new a();
    private int a;
    private String b;

    /* loaded from: classes.dex */
    static class a implements Parcelable.Creator<MSError> {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public MSError createFromParcel(Parcel parcel) {
            return new MSError(parcel, (a) null);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public MSError[] newArray(int i) {
            return new MSError[i];
        }
    }

    /* synthetic */ MSError(Parcel parcel, a aVar) {
        this(parcel);
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public int getErrorNo() {
        return this.a;
    }

    public String getMsg() {
        return this.b;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeInt(this.a);
        parcel.writeString(this.b);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MSError() {
        this.a = 0;
        this.b = "";
    }

    public MSError(int i, String str) {
        this.a = 0;
        this.b = "";
        this.a = i;
        this.b = str;
    }

    private MSError(Parcel parcel) {
        this.a = 0;
        this.b = "";
        this.a = parcel.readInt();
        this.b = parcel.readString();
    }
}
