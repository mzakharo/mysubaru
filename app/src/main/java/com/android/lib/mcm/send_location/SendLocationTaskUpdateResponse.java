package com.android.lib.mcm.send_location;

import android.os.Parcel;
import android.os.Parcelable;
/* loaded from: classes.dex */
public class SendLocationTaskUpdateResponse implements Parcelable {
    public static final Parcelable.Creator<SendLocationTaskUpdateResponse> CREATOR = new Parcelable.Creator<SendLocationTaskUpdateResponse>() { // from class: com.android.lib.mcm.send_location.SendLocationTaskUpdateResponse.1
        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskUpdateResponse createFromParcel(Parcel parcel) {
            return new SendLocationTaskUpdateResponse(parcel);
        }

        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskUpdateResponse[] newArray(int i) {
            return new SendLocationTaskUpdateResponse[i];
        }
    };
    private ResponseType mResponseType;

    /* loaded from: classes.dex */
    public enum ResponseType {
        Success,
        Error
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public SendLocationTaskUpdateResponse() {
        this.mResponseType = ResponseType.Success;
    }

    private SendLocationTaskUpdateResponse(Parcel parcel) {
        this.mResponseType = ResponseType.Success;
        this.mResponseType = ResponseType.valueOf(parcel.readString());
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.mResponseType.name());
    }

    public ResponseType getResponseType() {
        return this.mResponseType;
    }

    public void setResponseType(ResponseType responseType) {
        this.mResponseType = responseType;
    }
}
