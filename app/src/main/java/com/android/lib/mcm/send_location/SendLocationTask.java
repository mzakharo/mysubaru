package com.android.lib.mcm.send_location;

import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.send_location.SendLocationCommunicator;
import com.android.lib.mcm.send_location.SendLocationCommunicatorRequestData;
import com.android.lib.mcm.send_location.SendLocationCommunicatorResponseData;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Map;
/* loaded from: classes.dex */
public class SendLocationTask {
    private static final String TAG = "SendLocationTask";
    SendLocationTaskRegistInfo mInfo;
    Date mRegistTaskDate;
    private String mTaskID;
    SendLocationTaskManager mTaskManager;
    private int mSendPollingIntervalSeconds = 0;
    private int mSendPollingStartDelayIntervalSeconds = 0;
    private int mSendPollingStopDelayIntervalSeconds = 0;
    private boolean mIsRequestEnabledTimer = false;
    private boolean mIsEnabledTimer = false;
    double mLatitude = 0.0d;
    double mLongitude = 0.0d;
    Date mLocationTimestamp = null;
    boolean mIsSuccessLocation = false;
    boolean mIsSettingLocation = false;
    float mSpeed = 0.0f;
    Date mSpeedTimestamp = null;
    boolean mIsSuccessSpeed = false;
    boolean mIsSettingSpeed = false;
    float mAccelerationX = 0.0f;
    float mAccelerationY = 0.0f;
    float mAccelerationZ = 0.0f;
    Date mAccelerationTimestmp = null;
    boolean mIsSuccessAcceleration = false;
    boolean mIsSettingAcceleration = false;
    float mOrientation = 0.0f;
    Date mOrientationTimestamp = null;
    boolean mIsSuccessOrientation = false;
    boolean mIsSettingOrientation = false;
    String mPid = "";
    Date mPidTimestamp = null;

    /* loaded from: classes.dex */
    public enum EventTiming {
        None,
        VehicleConnected,
        VehicleDisConnected,
        AppLaunch,
        AppForeground,
        AppBackground
    }

    /* loaded from: classes.dex */
    public enum RequestMethod {
        get,
        post
    }

    /* loaded from: classes.dex */
    public enum SendStartTiming {
        VehicleConnected,
        VehicleDisConnected,
        AppLaunch,
        AppForeground,
        AppBackground
    }

    /* loaded from: classes.dex */
    public enum SendStopTiming {
        None,
        VehicleConnected,
        VehicleDisConnected,
        AppForeground,
        AppBackground
    }

    public SendLocationTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo, SendLocationTaskManager sendLocationTaskManager) {
        this.mTaskID = "";
        this.mInfo = null;
        this.mTaskManager = null;
        this.mRegistTaskDate = null;
        this.mTaskID = str;
        this.mInfo = sendLocationTaskRegistInfo;
        sendLocationTaskRegistInfo.setTaskID(str);
        this.mTaskManager = sendLocationTaskManager;
        this.mRegistTaskDate = this.mInfo.getRegistDate();
        initialize();
    }

    private void initialize() {
        initializeTimer();
    }

    private void initializeTimer() {
        this.mSendPollingIntervalSeconds = this.mInfo.getInterval();
    }

    public boolean destroy(boolean z) throws UnsupportedEncodingException {
        this.mIsEnabledTimer = false;
        return true;
    }

    public String getTaskID() {
        return this.mTaskID;
    }

    public SendLocationTaskRegistInfo getRegistInfo() {
        return this.mInfo;
    }

    public void timerSecondsTick() throws UnsupportedEncodingException {
        boolean z;
        boolean z2;
        if (!checkKeepTime()) {
            this.mTaskManager.removeTask(this.mTaskID, false, true);
            return;
        }
        int i = this.mSendPollingStopDelayIntervalSeconds;
        if (i > 0) {
            this.mSendPollingStopDelayIntervalSeconds = i - 1;
            LogWrapper.d(TAG, "waiting delay stop:" + this.mSendPollingStopDelayIntervalSeconds);
        } else if (this.mSendPollingStartDelayIntervalSeconds == 0 && !(z = this.mIsRequestEnabledTimer)) {
            this.mIsEnabledTimer = z;
        }
        int i2 = this.mSendPollingStartDelayIntervalSeconds;
        if (i2 > 0) {
            this.mSendPollingStartDelayIntervalSeconds = i2 - 1;
            LogWrapper.d(TAG, "waiting delay start:" + this.mSendPollingStartDelayIntervalSeconds);
        } else if (this.mSendPollingStopDelayIntervalSeconds == 0 && (z2 = this.mIsRequestEnabledTimer)) {
            this.mIsEnabledTimer = z2;
        }
        if (this.mIsEnabledTimer) {
            int i3 = this.mSendPollingIntervalSeconds - 1;
            this.mSendPollingIntervalSeconds = i3;
            if (i3 <= 0) {
                LogWrapper.d(TAG, "timer fire taskID:" + this.mTaskID);
                sendLocation();
                initializeTimer();
            }
        }
    }

    public void noticeEvent(EventTiming eventTiming) {
        boolean matchStartTiming = matchStartTiming(eventTiming);
        boolean matchStopTiming = matchStopTiming(eventTiming);
        LogWrapper.d(TAG, "name:" + eventTiming.name() + ":start=" + String.valueOf(matchStartTiming));
        LogWrapper.d(TAG, "name:" + eventTiming.name() + ":stop=" + String.valueOf(matchStopTiming));
        if (matchStartTiming && matchStopTiming && !this.mIsEnabledTimer) {
            this.mIsRequestEnabledTimer = false;
            this.mSendPollingStopDelayIntervalSeconds = this.mInfo.getStopDelayTime();
        } else if (matchStartTiming) {
            if (!this.mIsEnabledTimer) {
                this.mIsRequestEnabledTimer = true;
                int startDelayTime = this.mInfo.getStartDelayTime();
                this.mSendPollingStartDelayIntervalSeconds = startDelayTime;
                if (startDelayTime == 0) {
                    this.mIsEnabledTimer = this.mIsRequestEnabledTimer;
                    return;
                }
                return;
            }
            this.mIsRequestEnabledTimer = true;
            this.mIsEnabledTimer = true;
            this.mSendPollingStopDelayIntervalSeconds = 0;
            LogWrapper.d(TAG, "cancel waiting stop");
        } else if (matchStopTiming) {
            if (this.mIsEnabledTimer) {
                this.mIsRequestEnabledTimer = false;
                int stopDelayTime = this.mInfo.getStopDelayTime();
                this.mSendPollingStopDelayIntervalSeconds = stopDelayTime;
                if (stopDelayTime == 0) {
                    this.mIsEnabledTimer = this.mIsRequestEnabledTimer;
                    return;
                }
                return;
            }
            this.mIsRequestEnabledTimer = false;
            this.mIsEnabledTimer = false;
            this.mSendPollingStartDelayIntervalSeconds = 0;
            LogWrapper.d(TAG, "cancel waiting start");
        }
    }

    public void initEventCheck(EventTiming[] eventTimingArr) {
        for (EventTiming eventTiming : eventTimingArr) {
            if (matchStartTiming(eventTiming)) {
                noticeEvent(eventTiming);
                return;
            }
        }
    }

    private boolean containsStartTimings(SendStartTiming sendStartTiming) {
        for (SendStartTiming sendStartTiming2 : this.mInfo.getStartTimings()) {
            if (sendStartTiming2 == sendStartTiming) {
                return true;
            }
        }
        return false;
    }

    private boolean containsStopTimings(SendStopTiming sendStopTiming) {
        for (SendStopTiming sendStopTiming2 : this.mInfo.getStopTimings()) {
            if (sendStopTiming2 == sendStopTiming) {
                return true;
            }
        }
        return false;
    }

    private boolean matchStartTiming(EventTiming eventTiming) {
        int i = AnonymousClass2.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[eventTiming.ordinal()];
        if (i != 1) {
            if (i != 2) {
                if (i != 3) {
                    if (i != 4) {
                        if (i != 5) {
                            return false;
                        }
                        return containsStartTimings(SendStartTiming.VehicleDisConnected);
                    }
                    return containsStartTimings(SendStartTiming.VehicleConnected);
                }
                return containsStartTimings(SendStartTiming.AppLaunch);
            }
            return containsStartTimings(SendStartTiming.AppBackground);
        }
        return containsStartTimings(SendStartTiming.AppForeground);
    }

    private boolean matchStopTiming(EventTiming eventTiming) {
        int i = AnonymousClass2.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[eventTiming.ordinal()];
        if (i != 1) {
            if (i != 2) {
                if (i != 4) {
                    if (i != 5) {
                        return false;
                    }
                    return containsStopTimings(SendStopTiming.VehicleDisConnected);
                }
                return containsStopTimings(SendStopTiming.VehicleConnected);
            }
            return containsStopTimings(SendStopTiming.AppBackground);
        }
        return containsStopTimings(SendStopTiming.AppForeground);
    }

    public void setLifetime(int i) {
        this.mInfo.setLifetime(i);
    }

    public String getVehicleMacAddress() {
        return this.mInfo.getVehicleMacAddress();
    }

    public void setVehicleMacAddress(String str) {
        this.mInfo.setVehicleMacAddress(str);
    }

    public void setLocation(double d, double d2, boolean z, Date date) {
        LogWrapper.d(TAG, "setLocation lat,lon:" + d + "," + d2 + " taskID:" + this.mTaskID);
        this.mLatitude = d;
        this.mLongitude = d2;
        this.mIsSuccessLocation = z;
        this.mLocationTimestamp = date;
        if (this.mIsSettingLocation || !z) {
            return;
        }
        this.mIsSettingLocation = true;
    }

    public void setSpeed(float f, boolean z, Date date) {
        this.mSpeed = f;
        this.mIsSuccessSpeed = z;
        this.mSpeedTimestamp = date;
        if (this.mIsSettingSpeed || !z) {
            return;
        }
        this.mIsSettingSpeed = true;
    }

    public void setAcceleration(float f, float f2, float f3, boolean z, Date date) {
        LogWrapper.d(TAG, "setAcceleration x,y,z:" + f + "," + f2 + "," + f3 + " taskID:" + this.mTaskID);
        this.mAccelerationX = f;
        this.mAccelerationY = f2;
        this.mAccelerationZ = f3;
        this.mIsSuccessAcceleration = z;
        this.mAccelerationTimestmp = date;
        if (this.mIsSettingAcceleration || !z) {
            return;
        }
        this.mIsSettingAcceleration = true;
    }

    public void setOrientation(float f, boolean z, Date date) {
        LogWrapper.d(TAG, "setOrientation:" + f + " taskID:" + this.mTaskID);
        this.mOrientation = f;
        this.mIsSuccessOrientation = z;
        this.mOrientationTimestamp = date;
        if (this.mIsSettingOrientation || !z) {
            return;
        }
        this.mIsSettingOrientation = true;
    }

    public void setPid(String str, Date date) {
        LogWrapper.d(TAG, "setPid:" + str + " taskID:" + this.mTaskID);
        this.mPid = str;
        this.mPidTimestamp = date;
    }

    public void setRegistTaskDate(Date date) {
        this.mRegistTaskDate = date;
        this.mInfo.setRegistDate(date);
    }

    public int getInterval() {
        return this.mInfo.getInterval();
    }

    private void sendLocation() throws UnsupportedEncodingException {
        if (SendLocationLimitManager.checkPermitSendLocation(this.mTaskManager.getContext())) {
            SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData = new SendLocationCommunicatorRequestData();
            settingSendLocationParam(sendLocationCommunicatorRequestData);
            this.mTaskManager.queingSendLocationRequest(sendLocationCommunicatorRequestData, new SendLocationCommunicator.IResponse() { // from class: com.android.lib.mcm.send_location.SendLocationTask.1
                @Override // com.android.lib.mcm.send_location.SendLocationCommunicator.IResponse
                public void callback(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) throws UnsupportedEncodingException {
                    SendLocationTask.this.sendLocationResponse(sendLocationCommunicatorResponseData);
                }
            }, true);
            return;
        }
        LogWrapper.d(TAG, "limit send location");
    }

    void settingSendLocationParam(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws UnsupportedEncodingException {
        SendLocationInfoParamContainer sendLocationInfoParamContainer = new SendLocationInfoParamContainer();
        sendLocationInfoParamContainer.setLocation(this.mIsSettingLocation ? SendLocationUtil.convStringValue(this.mLongitude) : "", this.mIsSettingLocation ? SendLocationUtil.convStringValue(this.mLatitude) : "", SendLocationUtil.convTimestampISO8601Format(this.mLocationTimestamp));
        sendLocationInfoParamContainer.setSpeed(this.mIsSettingSpeed ? SendLocationUtil.convStringValue(this.mSpeed) : "", SendLocationUtil.convTimestampISO8601Format(this.mSpeedTimestamp));
        sendLocationInfoParamContainer.setAcceleration(this.mIsSuccessAcceleration ? SendLocationUtil.convStringValue(this.mAccelerationX) : "", this.mIsSuccessAcceleration ? SendLocationUtil.convStringValue(this.mAccelerationY) : "", this.mIsSuccessAcceleration ? SendLocationUtil.convStringValue(this.mAccelerationZ) : "", SendLocationUtil.convTimestampISO8601Format(this.mAccelerationTimestmp));
        sendLocationInfoParamContainer.setOrientation(this.mIsSuccessOrientation ? SendLocationUtil.convStringValue(this.mOrientation) : "", SendLocationUtil.convTimestampISO8601Format(this.mOrientationTimestamp));
        sendLocationInfoParamContainer.setPid(this.mPid, SendLocationUtil.convTimestampISO8601Format(this.mPidTimestamp));
        int i = AnonymousClass2.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$RequestMethod[this.mInfo.getRequestMethod().ordinal()];
        if (i == 1) {
            sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.get);
        } else if (i == 2) {
            sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.post);
        }
        sendLocationCommunicatorRequestData.setUrl(this.mInfo.getUrl());
        for (Map.Entry<String, String> entry : this.mInfo.getHeader().entrySet()) {
            sendLocationCommunicatorRequestData.getHeader().put(entry.getKey(), entry.getValue());
        }
        sendLocationCommunicatorRequestData.setParam(SendLocationUtil.createParamString(this.mInfo.getFormat(), sendLocationInfoParamContainer));
        sendLocationCommunicatorRequestData.setData(sendLocationCommunicatorRequestData.getParam());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.android.lib.mcm.send_location.SendLocationTask$2  reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass2 {
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming;
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$RequestMethod;

        static {
            int[] iArr = new int[RequestMethod.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$RequestMethod = iArr;
            try {
                iArr[RequestMethod.get.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$RequestMethod[RequestMethod.post.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            int[] iArr2 = new int[EventTiming.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming = iArr2;
            try {
                iArr2[EventTiming.AppForeground.ordinal()] = 1;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[EventTiming.AppBackground.ordinal()] = 2;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[EventTiming.AppLaunch.ordinal()] = 3;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[EventTiming.VehicleConnected.ordinal()] = 4;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTask$EventTiming[EventTiming.VehicleDisConnected.ordinal()] = 5;
            } catch (NoSuchFieldError unused7) {
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void sendLocationResponse(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) throws UnsupportedEncodingException {
        LogWrapper.d(TAG, "send location queue response:" + sendLocationCommunicatorResponseData.getResponse());
        if (sendLocationCommunicatorResponseData.getCommunicationStatus() != SendLocationCommunicatorResponseData.CommunicationStatus.Success || sendLocationCommunicatorResponseData.getStatusCode() < 400 || sendLocationCommunicatorResponseData.getStatusCode() >= 600) {
            return;
        }
        LogWrapper.d(TAG, "fail send location. remove task.");
        this.mTaskManager.removeTask(this.mTaskID, false, true);
    }

    private boolean checkKeepTime() {
        if ((SendLocationUtil.getNowDateUTC().getTime() - this.mRegistTaskDate.getTime()) / 1000 >= this.mInfo.getLifetime()) {
            LogWrapper.d(TAG, "overlap keeptime taskid:" + this.mTaskID);
            return false;
        }
        return true;
    }
}
