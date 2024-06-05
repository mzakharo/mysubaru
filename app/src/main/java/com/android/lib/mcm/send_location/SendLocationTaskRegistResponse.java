package com.android.lib.mcm.send_location;

import android.os.Parcel;
import android.os.Parcelable;
/* loaded from: classes.dex */
public class SendLocationTaskRegistResponse implements Parcelable {
    public static final Parcelable.Creator<SendLocationTaskRegistResponse> CREATOR = new Parcelable.Creator<SendLocationTaskRegistResponse>() { // from class: com.android.lib.mcm.send_location.SendLocationTaskRegistResponse.1
        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskRegistResponse createFromParcel(Parcel parcel) {
            return new SendLocationTaskRegistResponse(parcel);
        }

        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskRegistResponse[] newArray(int i) {
            return new SendLocationTaskRegistResponse[i];
        }
    };
    private ResponseType mResponseType;
    private String mTaskID;

    /* loaded from: classes.dex */
    public enum ResponseType {
        Success,
        SuccessOverlap,
        SuccessExceedCount,
        DisabledLocationServiceError,
        UnexpectedError
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public SendLocationTaskRegistResponse() {
        this.mTaskID = "";
        this.mResponseType = ResponseType.Success;
    }

    private SendLocationTaskRegistResponse(Parcel parcel) {
        this.mTaskID = "";
        this.mResponseType = ResponseType.Success;
        this.mTaskID = parcel.readString();
        this.mResponseType = ResponseType.valueOf(parcel.readString());
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.mTaskID);
        parcel.writeString(this.mResponseType.name());
    }

    public String getTaskID() {
        return this.mTaskID;
    }

    public void setTaskID(String str) {
        this.mTaskID = str;
    }

    public ResponseType getResponseType() {
        return this.mResponseType;
    }

    public void setResponseType(ResponseType responseType) {
        this.mResponseType = responseType;
    }
}
