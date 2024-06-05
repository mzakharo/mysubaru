package com.android.lib.mcm.send_location;

import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.send_location.SendLocationCommunicator;
import com.android.lib.mcm.send_location.SendLocationCommunicatorRequestData;
import com.android.lib.mcm.send_location.SendLocationCommunicatorResponseData;

import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class SendLocationGlympseTask extends SendLocationTask {
    private static final String TAG = "SendLocationGlympseTask";
    private static final int TIMEOUT_REQUEST = 30000;
    private CountDownLatch mRequestApiEndingPollingLatch;
    private Object mRequestApiEndingPollingLockObject;
    private String mSince;

    private float convSpeedUnit(float f) {
        return f * 100.0f;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class RequestApiEndingPollingResponse {
        public boolean isSuccess;

        private RequestApiEndingPollingResponse() {
            this.isSuccess = false;
        }
    }

    public SendLocationGlympseTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo, SendLocationTaskManager sendLocationTaskManager) {
        super(str, sendLocationTaskRegistInfo, sendLocationTaskManager);
        this.mSince = "0";
        this.mRequestApiEndingPollingLatch = null;
        this.mRequestApiEndingPollingLockObject = new Object();
        this.mSince = sendLocationTaskRegistInfo.getGlympseSince();
    }

    @Override // com.android.lib.mcm.send_location.SendLocationTask
    public boolean destroy(boolean z) throws UnsupportedEncodingException {
        super.destroy(z);
        return requestApiEndingPolling(z);
    }

    @Override // com.android.lib.mcm.send_location.SendLocationTask
    void settingSendLocationParam(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws UnsupportedEncodingException {
        SendLocationGlympseInfoContainer sendLocationGlympseInfoContainer = new SendLocationGlympseInfoContainer();
        settingSendLocationInfo(sendLocationGlympseInfoContainer);
        sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.post);
        sendLocationCommunicatorRequestData.setUrl(this.mInfo.getUrl());
        for (Map.Entry<String, String> entry : this.mInfo.getHeader().entrySet()) {
            sendLocationCommunicatorRequestData.getHeader().put(entry.getKey(), entry.getValue());
        }
        sendLocationCommunicatorRequestData.setData(SendLocationUtil.createParamString(this.mInfo.getData(), sendLocationGlympseInfoContainer));
        LogWrapper.d(TAG, "send location glympse task data:" + sendLocationCommunicatorRequestData.getData());
        sendLocationCommunicatorRequestData.setParam(SendLocationUtil.createParamString(this.mInfo.getFormat(), sendLocationGlympseInfoContainer));
        LogWrapper.d(TAG, "send location glympse task param:" + sendLocationCommunicatorRequestData.getParam());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Override // com.android.lib.mcm.send_location.SendLocationTask
    public void sendLocationResponse(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) throws UnsupportedEncodingException {
        super.sendLocationResponse(sendLocationCommunicatorResponseData);
        if (sendLocationCommunicatorResponseData.getCommunicationStatus() == SendLocationCommunicatorResponseData.CommunicationStatus.Success) {
            gettingResponseData(sendLocationCommunicatorResponseData.getResponse());
        }
    }

    private void gettingResponseData(String str) {
        try {
            JSONObject jSONObject = new JSONObject(str);
            if (TextUtils.equals(jSONObject.getString("result"), "ok")) {
                this.mSince = jSONObject.getJSONObject("response").getString("last_refresh");
                this.mInfo.setGlympseSince(this.mSince);
                this.mTaskManager.updateTaskInfoStorage();
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private boolean requestApiEndingPolling(final boolean z) throws UnsupportedEncodingException {
        if (TextUtils.isEmpty(this.mInfo.getUrlEnd())) {
            LogWrapper.d(TAG, "not request api ending polling.");
            return true;
        }
        synchronized (this.mRequestApiEndingPollingLockObject) {
            SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData = new SendLocationCommunicatorRequestData();
            settingApiEndingParam(sendLocationCommunicatorRequestData);
            if (z) {
                this.mRequestApiEndingPollingLatch = new CountDownLatch(1);
            }
            final RequestApiEndingPollingResponse requestApiEndingPollingResponse = new RequestApiEndingPollingResponse();
            this.mTaskManager.queingSendLocationRequest(sendLocationCommunicatorRequestData, new SendLocationCommunicator.IResponse() { // from class: com.android.lib.mcm.send_location.SendLocationGlympseTask.1
                @Override // com.android.lib.mcm.send_location.SendLocationCommunicator.IResponse
                public void callback(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) {
                    if (sendLocationCommunicatorResponseData.getCommunicationStatus() == SendLocationCommunicatorResponseData.CommunicationStatus.Success && sendLocationCommunicatorResponseData.getStatusCode() == 200) {
                        requestApiEndingPollingResponse.isSuccess = true;
                    }
                    if (z && SendLocationGlympseTask.this.mRequestApiEndingPollingLatch != null) {
                        SendLocationGlympseTask.this.mRequestApiEndingPollingLatch.countDown();
                    }
                    LogWrapper.d(SendLocationGlympseTask.TAG, "request api ending polling response:" + sendLocationCommunicatorResponseData.getResponse());
                }
            }, true);
            if (z) {
                try {
                    if (this.mRequestApiEndingPollingLatch.await(30000L, TimeUnit.MILLISECONDS)) {
                        boolean z2 = requestApiEndingPollingResponse.isSuccess;
                        this.mRequestApiEndingPollingLatch = null;
                        return z2;
                    }
                    LogWrapper.w(TAG, "requestApiEndingPolling timeout");
                    this.mRequestApiEndingPollingLatch = null;
                    return false;
                } catch (InterruptedException unused) {
                    LogWrapper.w(TAG, "requestApiEndingPolling InterruptedException");
                    this.mRequestApiEndingPollingLatch = null;
                    return false;
                }
            }
            return true;
        }
    }

    private void settingSendLocationInfo(SendLocationGlympseInfoContainer sendLocationGlympseInfoContainer) {
        float convSpeedUnit = convSpeedUnit(this.mSpeed);
        sendLocationGlympseInfoContainer.setLocation(this.mIsSettingLocation ? roundingLocationValue(this.mLongitude) : "", this.mIsSettingLocation ? roundingLocationValue(this.mLatitude) : "", SendLocationUtil.convTimestampUnixMilliSecondsFormat(this.mLocationTimestamp));
        sendLocationGlympseInfoContainer.setSpeed(this.mIsSettingSpeed ? roundingSpeedValue(convSpeedUnit) : "", SendLocationUtil.convTimestampUnixMilliSecondsFormat(this.mSpeedTimestamp));
        sendLocationGlympseInfoContainer.setAcceleration(this.mIsSuccessAcceleration ? roundingAccelerationValue(this.mAccelerationX) : "", this.mIsSuccessAcceleration ? roundingAccelerationValue(this.mAccelerationY) : "", this.mIsSuccessAcceleration ? roundingAccelerationValue(this.mAccelerationZ) : "", SendLocationUtil.convTimestampUnixMilliSecondsFormat(this.mAccelerationTimestmp));
        sendLocationGlympseInfoContainer.setOrientation(this.mIsSuccessOrientation ? roundingOrientationValue(this.mOrientation) : "", SendLocationUtil.convTimestampUnixMilliSecondsFormat(this.mOrientationTimestamp));
        sendLocationGlympseInfoContainer.setPid(this.mPid, SendLocationUtil.convTimestampUnixMilliSecondsFormat(this.mPidTimestamp));
        sendLocationGlympseInfoContainer.setGlympseInfo(this.mSince);
    }

    private void settingApiEndingParam(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws UnsupportedEncodingException {
        SendLocationGlympseInfoContainer sendLocationGlympseInfoContainer = new SendLocationGlympseInfoContainer();
        settingSendLocationInfo(sendLocationGlympseInfoContainer);
        sendLocationCommunicatorRequestData.setUrl(this.mInfo.getUrlEnd());
        for (Map.Entry<String, String> entry : this.mInfo.getHeaderEnd().entrySet()) {
            sendLocationCommunicatorRequestData.getHeader().put(entry.getKey(), entry.getValue());
        }
        sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.post);
        sendLocationCommunicatorRequestData.setParam(SendLocationUtil.createParamString(this.mInfo.getFormatEnd(), sendLocationGlympseInfoContainer));
    }

    private String roundingLocationValue(double d) {
        return SendLocationUtil.convStringValue(d * 1000000.0d);
    }

    private String roundingSpeedValue(float f) {
        return SendLocationUtil.convStringValue(f);
    }

    private String roundingAccelerationValue(float f) {
        return SendLocationUtil.convStringValue(f);
    }

    private String roundingOrientationValue(float f) {
        return SendLocationUtil.convStringValue(f);
    }
}
