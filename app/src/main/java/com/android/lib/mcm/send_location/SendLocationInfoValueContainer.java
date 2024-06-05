package com.android.lib.mcm.send_location;

import android.os.Parcel;
import android.os.Parcelable;
import java.util.Date;
/* loaded from: classes.dex */
public class SendLocationInfoValueContainer implements Parcelable {
    public static final Parcelable.Creator<SendLocationInfoValueContainer> CREATOR = new Parcelable.Creator<SendLocationInfoValueContainer>() { // from class: com.android.lib.mcm.send_location.SendLocationInfoValueContainer.1
        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationInfoValueContainer createFromParcel(Parcel parcel) {
            return new SendLocationInfoValueContainer(parcel);
        }

        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationInfoValueContainer[] newArray(int i) {
            return new SendLocationInfoValueContainer[i];
        }
    };
    private Date mAccelerationTimestamp;
    private float mAccelerationX;
    private float mAccelerationY;
    private float mAccelerationZ;
    private boolean mIsSuccessAcceleration;
    private boolean mIsSuccessLocation;
    private boolean mIsSuccessOrientation;
    private boolean mIsSuccessSpeed;
    private double mLocationLatitude;
    private double mLocationLongitude;
    private Date mLocationTimestamp;
    private float mOrientation;
    private Date mOrientationTimestamp;
    private float mSpeed;
    private Date mSpeedTimestamp;

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public SendLocationInfoValueContainer() {
        this.mLocationLongitude = 0.0d;
        this.mLocationLatitude = 0.0d;
        this.mSpeed = 0.0f;
        this.mAccelerationX = 0.0f;
        this.mAccelerationY = 0.0f;
        this.mAccelerationZ = 0.0f;
        this.mOrientation = 0.0f;
        this.mLocationTimestamp = null;
        this.mSpeedTimestamp = null;
        this.mAccelerationTimestamp = null;
        this.mOrientationTimestamp = null;
        this.mIsSuccessLocation = false;
        this.mIsSuccessSpeed = false;
        this.mIsSuccessAcceleration = false;
        this.mIsSuccessOrientation = false;
    }

    private SendLocationInfoValueContainer(Parcel parcel) {
        this.mLocationLongitude = 0.0d;
        this.mLocationLatitude = 0.0d;
        this.mSpeed = 0.0f;
        this.mAccelerationX = 0.0f;
        this.mAccelerationY = 0.0f;
        this.mAccelerationZ = 0.0f;
        this.mOrientation = 0.0f;
        this.mLocationTimestamp = null;
        this.mSpeedTimestamp = null;
        this.mAccelerationTimestamp = null;
        this.mOrientationTimestamp = null;
        this.mIsSuccessLocation = false;
        this.mIsSuccessSpeed = false;
        this.mIsSuccessAcceleration = false;
        this.mIsSuccessOrientation = false;
        this.mLocationLongitude = parcel.readDouble();
        this.mLocationLatitude = parcel.readDouble();
        this.mSpeed = parcel.readFloat();
        this.mAccelerationX = parcel.readFloat();
        this.mAccelerationY = parcel.readFloat();
        this.mAccelerationZ = parcel.readFloat();
        this.mOrientation = parcel.readFloat();
        this.mLocationTimestamp = (Date) parcel.readSerializable();
        this.mSpeedTimestamp = (Date) parcel.readSerializable();
        this.mAccelerationTimestamp = (Date) parcel.readSerializable();
        this.mOrientationTimestamp = (Date) parcel.readSerializable();
        boolean[] zArr = new boolean[1];
        parcel.readBooleanArray(zArr);
        this.mIsSuccessLocation = zArr[0];
        parcel.readBooleanArray(zArr);
        this.mIsSuccessSpeed = zArr[0];
        parcel.readBooleanArray(zArr);
        this.mIsSuccessAcceleration = zArr[0];
        parcel.readBooleanArray(zArr);
        this.mIsSuccessOrientation = zArr[0];
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeDouble(this.mLocationLongitude);
        parcel.writeDouble(this.mLocationLatitude);
        parcel.writeFloat(this.mSpeed);
        parcel.writeFloat(this.mAccelerationX);
        parcel.writeFloat(this.mAccelerationY);
        parcel.writeFloat(this.mAccelerationZ);
        parcel.writeFloat(this.mOrientation);
        parcel.writeSerializable(this.mLocationTimestamp);
        parcel.writeSerializable(this.mSpeedTimestamp);
        parcel.writeSerializable(this.mAccelerationTimestamp);
        parcel.writeSerializable(this.mOrientationTimestamp);
        boolean[] zArr = {this.mIsSuccessLocation};
        parcel.writeBooleanArray(zArr);
        zArr[0] = this.mIsSuccessSpeed;
        parcel.writeBooleanArray(zArr);
        zArr[0] = this.mIsSuccessAcceleration;
        parcel.writeBooleanArray(zArr);
        zArr[0] = this.mIsSuccessOrientation;
        parcel.writeBooleanArray(zArr);
    }

    public void setLocation(double d, double d2, boolean z, Date date) {
        this.mLocationLongitude = d;
        this.mLocationLatitude = d2;
        this.mLocationTimestamp = date;
        this.mIsSuccessLocation = z;
    }

    public void setSpeed(float f, boolean z, Date date) {
        this.mSpeed = f;
        this.mSpeedTimestamp = date;
        this.mIsSuccessSpeed = z;
    }

    public void setAcceleration(float f, float f2, float f3, boolean z, Date date) {
        this.mAccelerationX = f;
        this.mAccelerationY = f2;
        this.mAccelerationZ = f3;
        this.mAccelerationTimestamp = date;
        this.mIsSuccessAcceleration = z;
    }

    public void setOrientation(float f, boolean z, Date date) {
        this.mOrientation = f;
        this.mOrientationTimestamp = date;
        this.mIsSuccessOrientation = z;
    }

    public double getLocationLongitude() {
        return this.mLocationLongitude;
    }

    public double getLocationLatitude() {
        return this.mLocationLatitude;
    }

    public Date getLocationTimestamp() {
        return this.mLocationTimestamp;
    }

    public boolean getIsSuccessLocation() {
        return this.mIsSuccessLocation;
    }

    public float getSpeed() {
        return this.mSpeed;
    }

    public Date getSpeedTimestamp() {
        return this.mSpeedTimestamp;
    }

    public boolean getIsSuccessSpeed() {
        return this.mIsSuccessSpeed;
    }

    public float getAccelerationX() {
        return this.mAccelerationX;
    }

    public float getAccelerationY() {
        return this.mAccelerationY;
    }

    public float getAccelerationZ() {
        return this.mAccelerationZ;
    }

    public Date getAccelerationTimestamp() {
        return this.mAccelerationTimestamp;
    }

    public boolean getIsSuccessAcceleration() {
        return this.mIsSuccessAcceleration;
    }

    public float getOrientation() {
        return this.mOrientation;
    }

    public Date getOrientationTimestamp() {
        return this.mOrientationTimestamp;
    }

    public boolean getIsSuccessOrientation() {
        return this.mIsSuccessOrientation;
    }
}
