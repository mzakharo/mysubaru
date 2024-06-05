package com.android.lib.mcm.send_location;

import android.os.Parcel;
import android.os.Parcelable;
import com.android.lib.mcm.send_location.SendLocationTask;
import com.android.lib.mcm.send_location.SendLocationTaskManager;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/* loaded from: classes.dex */
public class SendLocationTaskRegistInfo implements Parcelable, Serializable {
    public static final Parcelable.Creator<SendLocationTaskRegistInfo> CREATOR = new Parcelable.Creator<SendLocationTaskRegistInfo>() { // from class: com.android.lib.mcm.send_location.SendLocationTaskRegistInfo.1
        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskRegistInfo createFromParcel(Parcel parcel) {
            return new SendLocationTaskRegistInfo(parcel);
        }

        /* JADX WARN: Can't rename method to resolve collision */
        @Override // android.os.Parcelable.Creator
        public SendLocationTaskRegistInfo[] newArray(int i) {
            return new SendLocationTaskRegistInfo[i];
        }
    };
    private static final long serialVersionUID = -5716899140160482396L;
    private String mData;
    private String mFormat;
    private String mFormatEnd;
    private String mGlympseSince;
    private HashMap<String, String> mHeaders;
    private int mInterval;
    private int mLifetime;
    private String mPid;
    private Date mRegistDate;
    private SendLocationTask.RequestMethod mRequestMethod;
    private int mStartDelayTime;
    private SendLocationTask.SendStartTiming[] mStartTimings;
    private int mStopDelayTime;
    private SendLocationTask.SendStopTiming[] mStopTimings;
    private String mTaskID;
    private SendLocationTaskManager.TaskType mTaskType;
    private String mUrl;
    private String mUrlEnd;
    private String mVehicleMacAddress;
    private HashMap<String, String> mheadersEnd;

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public SendLocationTaskRegistInfo() {
        this.mTaskType = SendLocationTaskManager.TaskType.normal;
        this.mTaskID = "";
        this.mRegistDate = null;
        this.mUrl = "";
        this.mUrlEnd = "";
        this.mPid = "";
        this.mHeaders = new HashMap<>();
        this.mheadersEnd = new HashMap<>();
        this.mRequestMethod = SendLocationTask.RequestMethod.get;
        this.mFormat = "";
        this.mFormatEnd = "";
        this.mData = "";
        this.mStartTimings = new SendLocationTask.SendStartTiming[]{SendLocationTask.SendStartTiming.AppLaunch};
        this.mStopTimings = new SendLocationTask.SendStopTiming[]{SendLocationTask.SendStopTiming.None};
        this.mStartDelayTime = 0;
        this.mStopDelayTime = 0;
        this.mInterval = 0;
        this.mLifetime = 0;
        this.mGlympseSince = "0";
        this.mVehicleMacAddress = "";
    }

    private SendLocationTaskRegistInfo(Parcel parcel) {
        this.mTaskType = SendLocationTaskManager.TaskType.normal;
        this.mTaskID = "";
        this.mRegistDate = null;
        this.mUrl = "";
        this.mUrlEnd = "";
        this.mPid = "";
        this.mHeaders = new HashMap<>();
        this.mheadersEnd = new HashMap<>();
        this.mRequestMethod = SendLocationTask.RequestMethod.get;
        this.mFormat = "";
        this.mFormatEnd = "";
        this.mData = "";
        this.mStartTimings = new SendLocationTask.SendStartTiming[]{SendLocationTask.SendStartTiming.AppLaunch};
        this.mStopTimings = new SendLocationTask.SendStopTiming[]{SendLocationTask.SendStopTiming.None};
        this.mStartDelayTime = 0;
        this.mStopDelayTime = 0;
        this.mInterval = 0;
        this.mLifetime = 0;
        this.mGlympseSince = "0";
        this.mVehicleMacAddress = "";
        this.mTaskType = SendLocationTaskManager.TaskType.valueOf(parcel.readString());
        this.mTaskID = parcel.readString();
        this.mRegistDate = (Date) parcel.readSerializable();
        this.mUrl = parcel.readString();
        this.mUrlEnd = parcel.readString();
        this.mPid = parcel.readString();
        int readInt = parcel.readInt();
        for (int i = 0; i < readInt; i++) {
            this.mHeaders.put(parcel.readString(), parcel.readString());
        }
        int readInt2 = parcel.readInt();
        for (int i2 = 0; i2 < readInt2; i2++) {
            this.mheadersEnd.put(parcel.readString(), parcel.readString());
        }
        this.mRequestMethod = SendLocationTask.RequestMethod.valueOf(parcel.readString());
        this.mFormat = parcel.readString();
        this.mFormatEnd = parcel.readString();
        this.mData = parcel.readString();
        this.mStartTimings = convertToSendStartTimingArray(parcel.createStringArray());
        this.mStopTimings = convertToSendStopTimingArray(parcel.createStringArray());
        this.mStartDelayTime = parcel.readInt();
        this.mStopDelayTime = parcel.readInt();
        this.mInterval = parcel.readInt();
        this.mLifetime = parcel.readInt();
        this.mGlympseSince = parcel.readString();
        this.mVehicleMacAddress = parcel.readString();
    }

    private SendLocationTask.SendStartTiming[] convertToSendStartTimingArray(String[] strArr) {
        ArrayList arrayList = new ArrayList();
        for (String str : strArr) {
            arrayList.add(SendLocationTask.SendStartTiming.valueOf(str));
        }
        return (SendLocationTask.SendStartTiming[]) arrayList.toArray(new SendLocationTask.SendStartTiming[0]);
    }

    private String[] convertFromSendStartTimingArray(SendLocationTask.SendStartTiming[] sendStartTimingArr) {
        ArrayList arrayList = new ArrayList();
        for (SendLocationTask.SendStartTiming sendStartTiming : sendStartTimingArr) {
            arrayList.add(sendStartTiming.name());
        }
        return (String[]) arrayList.toArray(new String[0]);
    }

    private SendLocationTask.SendStopTiming[] convertToSendStopTimingArray(String[] strArr) {
        ArrayList arrayList = new ArrayList();
        for (String str : strArr) {
            arrayList.add(SendLocationTask.SendStopTiming.valueOf(str));
        }
        return (SendLocationTask.SendStopTiming[]) arrayList.toArray(new SendLocationTask.SendStopTiming[0]);
    }

    private String[] convertFromSendStopTimingArray(SendLocationTask.SendStopTiming[] sendStopTimingArr) {
        ArrayList arrayList = new ArrayList();
        for (SendLocationTask.SendStopTiming sendStopTiming : sendStopTimingArr) {
            arrayList.add(sendStopTiming.name());
        }
        return (String[]) arrayList.toArray(new String[0]);
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.mTaskType.name());
        parcel.writeString(this.mTaskID);
        parcel.writeSerializable(this.mRegistDate);
        parcel.writeString(this.mUrl);
        parcel.writeString(this.mUrlEnd);
        parcel.writeString(this.mPid);
        int size = this.mHeaders.size();
        parcel.writeInt(size);
        if (size > 0) {
            for (Map.Entry<String, String> entry : this.mHeaders.entrySet()) {
                parcel.writeString(entry.getKey());
                parcel.writeString(entry.getValue());
            }
        }
        int size2 = this.mheadersEnd.size();
        parcel.writeInt(size2);
        if (size2 > 0) {
            for (Map.Entry<String, String> entry2 : this.mheadersEnd.entrySet()) {
                parcel.writeString(entry2.getKey());
                parcel.writeString(entry2.getValue());
            }
        }
        parcel.writeString(this.mRequestMethod.name());
        parcel.writeString(this.mFormat);
        parcel.writeString(this.mFormatEnd);
        parcel.writeString(this.mData);
        parcel.writeStringArray(convertFromSendStartTimingArray(this.mStartTimings));
        parcel.writeStringArray(convertFromSendStopTimingArray(this.mStopTimings));
        parcel.writeInt(this.mStartDelayTime);
        parcel.writeInt(this.mStopDelayTime);
        parcel.writeInt(this.mInterval);
        parcel.writeInt(this.mLifetime);
        parcel.writeString(this.mGlympseSince);
        parcel.writeString(this.mVehicleMacAddress);
    }

    /* JADX WARN: Removed duplicated region for block: B:16:0x0038  */
    /* JADX WARN: Removed duplicated region for block: B:27:0x0082  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean equalsParam(com.android.lib.mcm.send_location.SendLocationTaskRegistInfo r6) {
        /*
            Method dump skipped, instructions count: 297
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.android.lib.mcm.send_location.SendLocationTaskRegistInfo.equalsParam(com.android.lib.mcm.send_location.SendLocationTaskRegistInfo):boolean");
    }

    public SendLocationTaskManager.TaskType getTaskType() {
        return this.mTaskType;
    }

    public void setTaskType(SendLocationTaskManager.TaskType taskType) {
        this.mTaskType = taskType;
    }

    public String getTaskID() {
        return this.mTaskID;
    }

    public void setTaskID(String str) {
        this.mTaskID = str;
    }

    public Date getRegistDate() {
        return this.mRegistDate;
    }

    public void setRegistDate(Date date) {
        this.mRegistDate = date;
    }

    public String getUrl() {
        return this.mUrl;
    }

    public void setUrl(String str) {
        this.mUrl = str;
    }

    public String getUrlEnd() {
        return this.mUrlEnd;
    }

    public void setUrlEnd(String str) {
        this.mUrlEnd = str;
    }

    public String getPid() {
        return this.mPid;
    }

    public void setPid(String str) {
        this.mPid = str;
    }

    public HashMap<String, String> getHeader() {
        return this.mHeaders;
    }

    public HashMap<String, String> getHeaderEnd() {
        return this.mheadersEnd;
    }

    public SendLocationTask.RequestMethod getRequestMethod() {
        return this.mRequestMethod;
    }

    public void setRequestMethod(SendLocationTask.RequestMethod requestMethod) {
        this.mRequestMethod = requestMethod;
    }

    public String getFormat() {
        return this.mFormat;
    }

    public void setFormat(String str) {
        this.mFormat = str;
    }

    public String getFormatEnd() {
        return this.mFormatEnd;
    }

    public void setFormatEnd(String str) {
        this.mFormatEnd = str;
    }

    public String getData() {
        return this.mData;
    }

    public void setData(String str) {
        this.mData = str;
    }

    public SendLocationTask.SendStartTiming[] getStartTimings() {
        return this.mStartTimings;
    }

    public void setStartTimings(SendLocationTask.SendStartTiming[] sendStartTimingArr) {
        this.mStartTimings = sendStartTimingArr;
    }

    public SendLocationTask.SendStopTiming[] getStopTimings() {
        return this.mStopTimings;
    }

    public void setStopTimings(SendLocationTask.SendStopTiming[] sendStopTimingArr) {
        this.mStopTimings = sendStopTimingArr;
    }

    public int getStartDelayTime() {
        return this.mStartDelayTime;
    }

    public void setStartDelayTime(int i) {
        this.mStartDelayTime = i;
    }

    public int getStopDelayTime() {
        return this.mStopDelayTime;
    }

    public void setStopDelayTime(int i) {
        this.mStopDelayTime = i;
    }

    public int getInterval() {
        return this.mInterval;
    }

    public void setInterval(int i) {
        this.mInterval = i;
    }

    public int getLifetime() {
        return this.mLifetime;
    }

    public void setLifetime(int i) {
        this.mLifetime = i;
    }

    public String getGlympseSince() {
        return this.mGlympseSince;
    }

    public void setGlympseSince(String str) {
        this.mGlympseSince = str;
    }

    public String getVehicleMacAddress() {
        return this.mVehicleMacAddress;
    }

    public void setVehicleMacAddress(String str) {
        this.mVehicleMacAddress = str;
    }
}
