package com.android.lib.mcm.send_location;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.send_location.ISendLocationService;
import com.android.lib.mcm.send_location.SendLocationCommunicator;
import com.android.lib.mcm.send_location.SendLocationCommunicatorRequestData;
import com.android.lib.mcm.send_location.SendLocationCommunicatorResponseData;
import com.android.lib.mcm.send_location.SendLocationInfo;
import com.android.lib.mcm.send_location.SendLocationInfoManager;
import com.android.lib.mcm.send_location.SendLocationTask;
import com.android.lib.mcm.send_location.SendLocationTaskManager;
import com.android.lib.mcm.send_location.SendLocationTaskRegistResponse;
import com.android.lib.mcm.send_location.SendLocationTaskUpdateResponse;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
//import com.google.android.gms.common.internal.ImagesContract;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class SendLocationModule implements MSModuleDelegate {
    private static final int ERROR_STATUS_CODE = 500;
    private static final int INFO_POLLING_INTERVAL_MAX = 86400;
    private static final int INFO_POLLING_INTERVAL_MIN = 5;
    private static final int INTERVAL_DEF = 60;
    private static final int INTERVAL_MAX = 86400;
    private static final int INTERVAL_MIN = 5;
    private static final int LIFETIME_DEF = 86400;
    private static final int LIFETIME_MAX = 2678400;
    private static final int LIFETIME_MIN = 5;
    private static final String PARAM_DATA = "data";
    private static final String PARAM_FORMAT = "format";
    private static final String PARAM_FORMAT_END = "format_end";
    private static final String PARAM_HEADER = "header";
    private static final String PARAM_HEADER_END = "header_end";
    private static final String PARAM_INFO_POLLING_INTERVAL = "info_polling_interval";
    private static final String PARAM_INTERVAL = "interval";
    private static final String PARAM_KEY_CMD = "cmd";
    private static final String PARAM_LAT = "lat";
    private static final String PARAM_LIFETIME = "lifetime";
    private static final String PARAM_LON = "lon";
    private static final String PARAM_METHOD = "method";
    private static final String PARAM_SPD = "spd";
    private static final String PARAM_START = "start";
    private static final String PARAM_START_DELAY = "start_delay";
    private static final String PARAM_STOP = "stop";
    private static final String PARAM_STOP_DELAY = "stop_delay";
    private static final String PARAM_TASK_ID = "task_id";
    private static final String PARAM_URL = "url";
    private static final String PARAM_URL_END = "url_end";
    private static final String PARAM_VALUE_EXEC = "exec";
    private static final String PARAM_VALUE_GET_TASK = "task_info";
    private static final String PARAM_VALUE_METHOD_GET = "get";
    private static final String PARAM_VALUE_METHOD_POST = "post";
    private static final String PARAM_VALUE_REGIST_GLYMPSE_TASK = "regist_glympse_task";
    private static final String PARAM_VALUE_REGIST_TASK = "regist_task";
    private static final String PARAM_VALUE_REMOVE_TASK = "remove_task";
    private static final String PARAM_VALUE_SETTING = "setting";
    private static final String PARAM_VALUE_SPLIT_CHAR = ",";
    private static final String PARAM_VALUE_START_APP_BG = "app_bg";
    private static final String PARAM_VALUE_START_APP_FG = "app_fg";
    private static final String PARAM_VALUE_START_APP_LAUNCH = "app_launch";
    private static final String PARAM_VALUE_START_VEHICLE_CON = "vehicle_con";
    private static final String PARAM_VALUE_START_VEHICLE_DISCON = "vehicle_discon";
    private static final String PARAM_VALUE_STOP_APP_BG = "app_bg";
    private static final String PARAM_VALUE_STOP_APP_FG = "app_fg";
    private static final String PARAM_VALUE_STOP_NONE = "none";
    private static final String PARAM_VALUE_STOP_VEHICLE_CON = "vehicle_con";
    private static final String PARAM_VALUE_STOP_VEHICLE_DISCON = "vehicle_discon";
    private static final String PARAM_VALUE_UPDATE_GLYMPSE_TASK = "update_glympse_task";
    private static final String RESPONSE_KEY_GET_FORMAT = "format";
    private static final String RESPONSE_KEY_GET_FORMAT_END = "format_end";
    private static final String RESPONSE_KEY_GET_HEADER = "header";
    private static final String RESPONSE_KEY_GET_HEADER_END = "header_end";
    private static final String RESPONSE_KEY_GET_INTERVAL = "interval";
    private static final String RESPONSE_KEY_GET_LIFETIME = "lifetime";
    private static final String RESPONSE_KEY_GET_METHOD = "method";
    private static final String RESPONSE_KEY_GET_RESPONSE_DATA = "data";
    private static final String RESPONSE_KEY_GET_START = "start";
    private static final String RESPONSE_KEY_GET_START_DELAY = "start_delay";
    private static final String RESPONSE_KEY_GET_STOP = "stop";
    private static final String RESPONSE_KEY_GET_STOP_DELAY = "stop_delay";
    private static final String RESPONSE_KEY_GET_TASK_ID = "task_id";
    private static final String RESPONSE_KEY_GET_TASK_TYPE = "task_type";
    private static final String RESPONSE_KEY_GET_URL = "url";
    private static final String RESPONSE_KEY_GET_URL_END = "url_end";
    private static final String RESPONSE_KEY_RESPONSE = "response";
    private static final String RESPONSE_KEY_RESPONSE_DATA = "data";
    private static final String RESPONSE_KEY_RESPONSE_STATUS = "status";
    private static final String RESPONSE_KEY_RESULT = "result";
    private static final String RESPONSE_KEY_RETURN_CD = "return_cd";
    private static final String RESPONSE_KEY_TASK_ID = "task_id";
    private static final int START_DELAY_DEF = 0;
    private static final int START_DELAY_MAX = 86400;
    private static final int START_DELAY_MIN = 0;
    private static final int STOP_DELAY_DEF = 0;
    private static final int STOP_DELAY_MAX = 86400;
    private static final int STOP_DELAY_MIN = 0;
    private static final String SUCCESS_EXCEED_COUNT_RESPONSE_CODE = "M003I";
    private static final String SUCCESS_OVERLAP_RESPONSE_CODE = "M002I";
    private static final String SUCCESS_RESPONSE_CODE = "M001I";
    private static final int SUCCESS_STATUS_CODE = 200;
    private static final String TAG = "SendLocationModule";
    private static final int TIMEOUT_GET_INFO = 30000;
    private static final int TIMEOUT_SEND_LOCATION = 30000;
    private Context context;
    private SendLocationCommunicator mSendLocationCommunicator;
    private ISendLocationService mSendLocationService = null;
    private ServiceConnection mSendLocationServiceConnection = new ServiceConnection() { // from class: com.android.lib.mcm.send_location.SendLocationModule.1
        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
            LogWrapper.d(SendLocationModule.TAG, "SendLocationService Disconnected");
            SendLocationModule.this.mSendLocationService = null;
        }

        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            LogWrapper.d(SendLocationModule.TAG, "SendLocationSerivce Connected");
            SendLocationModule.this.mSendLocationService = ISendLocationService.Stub.asInterface(iBinder);
            SendLocationModule.this.mBindLatch.countDown();
        }
    };
    private final CountDownLatch mBindLatch = new CountDownLatch(1);
    private CountDownLatch mSendLocationLatch = null;
    private CountDownLatch mSendLocationGetInfoLatch = null;

    /* loaded from: classes.dex */
    private class BaseErrorException extends Exception {
        public String ErrorCode() {
            return "";
        }

        private BaseErrorException() {
        }
    }

    /* loaded from: classes.dex */
    private class ParamErrorOtherException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M001W";
        }

        private ParamErrorOtherException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class ParamErrorRequiredException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M002W";
        }

        private ParamErrorRequiredException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class ParamErrorUndefinedException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M003W";
        }

        private ParamErrorUndefinedException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class ParamErrorFormatException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M004W";
        }

        private ParamErrorFormatException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class ParamErrorRangeException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M005W";
        }

        private ParamErrorRangeException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class ParamErrorSameStartStopTimingException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M006W";
        }

        private ParamErrorSameStartStopTimingException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class UnexpectedException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M001E";
        }

        private UnexpectedException() {
            super();
        }
    }

    /* loaded from: classes.dex */
    private class FailSendLocationIncommunicableExeption extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M002E";
        }

        private FailSendLocationIncommunicableExeption() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class FailSendLocationTimeoutException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M003E";
        }

        private FailSendLocationTimeoutException() {
            super();
        }
    }

    /* loaded from: classes.dex */
    private class FailSendLocationOtherException extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M004E";
        }

        private FailSendLocationOtherException() {
            super();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class FailSendLocationTargetLimit extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M005E";
        }

        private FailSendLocationTargetLimit() {
            super();
        }
    }

    /* loaded from: classes.dex */
    private class FailUpdateSendLocationTask extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M006E";
        }

        private FailUpdateSendLocationTask() {
            super();
        }
    }

    /* loaded from: classes.dex */
    private class FailRegistSendLocationTaskDisabledLocationService extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M007E";
        }

        private FailRegistSendLocationTaskDisabledLocationService() {
            super();
        }
    }

    /* loaded from: classes.dex */
    private class FailRemoveTaskRequestGlympseUrlEnd extends BaseErrorException {
        @Override // com.android.lib.mcm.send_location.SendLocationModule.BaseErrorException
        public String ErrorCode() {
            return "M008E";
        }

        private FailRemoveTaskRequestGlympseUrlEnd() {
            super();
        }
    }

    public SendLocationModule(Context context) {
        this.mSendLocationCommunicator = null;
        this.context = context.getApplicationContext();
        this.mSendLocationCommunicator = new SendLocationCommunicator(this.context);
    }

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        boolean z = true;
        try {
            try {
                LogWrapper.setEnabledDebug(true);
                LogWrapper.d(TAG, "start dispatch");
            } catch (Exception unused2) {
                LogWrapper.w(TAG, "exception");
                Util.responseErrorJson(mSHTTPResponder, new UnexpectedException().ErrorCode(), 500);
            }
            if (mSHTTPRequest == null || mSHTTPResponder == null) {
                LogWrapper.w(TAG, "request or response is null. request[" + mSHTTPRequest + "], responder[" + mSHTTPResponder + "]");
                throw new UnexpectedException();
            } else if (this.context == null) {
                LogWrapper.w(TAG, "Arg NULL[context : " + this.context + "]");
                LogWrapper.w(TAG, "not do anything.");
                throw new UnexpectedException();
            } else {
                HashMap<String, String> parseParameter = SendLocationUtil.parseParameter(mSHTTPRequest);
                checkParameter(parseParameter);
                bindSendLocationService();
                String str = parseParameter.get(PARAM_KEY_CMD);
                JSONObject jSONObject = new JSONObject();
                LogWrapper.d(TAG, "cmd=" + str);
                boolean z2 = false;
                boolean equals = TextUtils.equals(str, PARAM_VALUE_EXEC);
                String str2 = "";
                String str3 = SUCCESS_RESPONSE_CODE;
                if (equals) {
                    SendLocationInfo sendLocationInfo = new SendLocationInfo();
                    settingSendLocationInfo(parseParameter, sendLocationInfo);
                    SendLocationCommunicatorResponseData sendLocation = sendLocation(sendLocationInfo);
                    switch (AnonymousClass5.$SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[sendLocation.getCommunicationStatus().ordinal()]) {
                        case 1:
                            if (sendLocation.getStatusCode() < 400 || sendLocation.getStatusCode() >= 600) {
                                z = false;
                            } else {
                                str2 = new FailSendLocationOtherException().ErrorCode();
                            }
                            JSONObject jSONObject2 = new JSONObject();
                            jSONObject2.put("status", sendLocation.getStatusCode());
                            jSONObject2.put("data", sendLocation.getResponse());
                            if (z) {
                                str3 = str2;
                            }
                            jSONObject.put(RESPONSE_KEY_RETURN_CD, str3);
                            jSONObject.put(RESPONSE_KEY_RESPONSE, jSONObject2);
                            z2 = z;
                            break;
                        case 2:
                            throw new FailSendLocationIncommunicableExeption();
                        case 3:
                            throw new FailSendLocationTimeoutException();
                        case 4:
                            throw new FailSendLocationOtherException();
                        case 5:
                            throw new FailSendLocationOtherException();
                        case 6:
                            throw new FailSendLocationOtherException();
                        default:
                            throw new FailSendLocationOtherException();
                    }
                } else {
                    if (!TextUtils.equals(str, PARAM_VALUE_REGIST_TASK) && !TextUtils.equals(str, PARAM_VALUE_REGIST_GLYMPSE_TASK)) {
                        if (TextUtils.equals(str, PARAM_VALUE_UPDATE_GLYMPSE_TASK)) {
                            SendLocationTaskRegistInfo sendLocationTaskRegistInfo = new SendLocationTaskRegistInfo();
                            settingUpdateTaskInfo(parseParameter, sendLocationTaskRegistInfo);
                            int i = AnonymousClass5.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskUpdateResponse$ResponseType[this.mSendLocationService.updateTask(parseParameter.get("task_id"), sendLocationTaskRegistInfo).getResponseType().ordinal()];
                            if (i == 1) {
                                str2 = SUCCESS_RESPONSE_CODE;
                            } else if (i == 2) {
                                throw new FailUpdateSendLocationTask();
                            }
                            jSONObject.put(RESPONSE_KEY_RETURN_CD, str2);
                        } else if (TextUtils.equals(str, PARAM_VALUE_REMOVE_TASK)) {
                            if (!this.mSendLocationService.removeTask(parseParameter.get("task_id"))) {
                                throw new FailRemoveTaskRequestGlympseUrlEnd();
                            }
                            jSONObject.put(RESPONSE_KEY_RETURN_CD, SUCCESS_RESPONSE_CODE);
                        } else if (TextUtils.equals(str, PARAM_VALUE_GET_TASK)) {
                            SendLocationTaskRegistInfo[] task = this.mSendLocationService.getTask(parseParameter.get("task_id"));
                            jSONObject.put(RESPONSE_KEY_RETURN_CD, SUCCESS_RESPONSE_CODE);
                            jSONObject.put("result", createTaskInfoResponse(task));
                        } else if (TextUtils.equals(str, PARAM_VALUE_SETTING)) {
                            String str4 = parseParameter.get(PARAM_INFO_POLLING_INTERVAL);
                            if (!TextUtils.isEmpty(str4)) {
                                this.mSendLocationService.settingDefaultPollingInterval(Integer.parseInt(str4) * 1000);
                            }
                            jSONObject.put(RESPONSE_KEY_RETURN_CD, SUCCESS_RESPONSE_CODE);
                        } else {
                            throw new ParamErrorUndefinedException();
                        }
                    }
                    SendLocationTaskRegistInfo sendLocationTaskRegistInfo2 = new SendLocationTaskRegistInfo();
                    settingRegistTaskInfo(parseParameter, sendLocationTaskRegistInfo2);
                    SendLocationTaskRegistResponse registTask = this.mSendLocationService.registTask(sendLocationTaskRegistInfo2);
                    int i2 = AnonymousClass5.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType[registTask.getResponseType().ordinal()];
                    if (i2 == 1) {
                        str2 = SUCCESS_RESPONSE_CODE;
                    } else if (i2 == 2) {
                        str2 = SUCCESS_EXCEED_COUNT_RESPONSE_CODE;
                    } else if (i2 == 3) {
                        str2 = SUCCESS_OVERLAP_RESPONSE_CODE;
                    } else if (i2 == 4) {
                        throw new FailRegistSendLocationTaskDisabledLocationService();
                    } else {
                        if (i2 == 5) {
                            throw new UnexpectedException();
                        }
                    }
                    jSONObject.put(RESPONSE_KEY_RETURN_CD, str2);
                    jSONObject.put("task_id", registTask.getTaskID());
                }
                Util.responseJson(mSHTTPResponder, jSONObject.toString(), z2 ? 500 : 200);
            }
        } catch (ParamErrorOtherException e) {
            throw new RuntimeException(e);
        } catch (FailRegistSendLocationTaskDisabledLocationService e) {
            throw new RuntimeException(e);
        } catch (UnexpectedException e) {
            throw new RuntimeException(e);
        } catch (FailUpdateSendLocationTask e) {
            throw new RuntimeException(e);
        } catch (ParamErrorSameStartStopTimingException e) {
            throw new RuntimeException(e);
        } catch (ParamErrorFormatException e) {
            throw new RuntimeException(e);
        } catch (FailSendLocationOtherException e) {
            throw new RuntimeException(e);
        } catch (ParamErrorUndefinedException e) {
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        } catch (FailSendLocationIncommunicableExeption e) {
            throw new RuntimeException(e);
        } catch (FailSendLocationTimeoutException e) {
            throw new RuntimeException(e);
        } catch (FailRemoveTaskRequestGlympseUrlEnd e) {
            throw new RuntimeException(e);
        } catch (ParamErrorRequiredException e) {
            throw new RuntimeException(e);
        } catch (RemoteException e) {
            throw new RuntimeException(e);
        } catch (ParamErrorRangeException e) {
            throw new RuntimeException(e);
        } catch (FailSendLocationTargetLimit e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            unbindSendLocationService();
        }
    }

    private void bindSendLocationService() {
        Context applicationContext = this.context.getApplicationContext();
        applicationContext.bindService(new Intent(applicationContext, SendLocationService.class), this.mSendLocationServiceConnection, 1);
        try {
            this.mBindLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void unbindSendLocationService() {
        Context applicationContext = this.context.getApplicationContext();
        ServiceConnection serviceConnection = this.mSendLocationServiceConnection;
        if (serviceConnection != null) {
            applicationContext.unbindService(serviceConnection);
        }
    }

    private boolean checkIntegerConv(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException unused) {
            return false;
        }
    }

    private boolean checkIntegerRange(String str, Integer num, Integer num2) {
        Integer.valueOf(0);
        try {
            Integer valueOf = Integer.valueOf(Integer.parseInt(str));
            return valueOf.intValue() <= num.intValue() && valueOf.intValue() >= num2.intValue();
        } catch (NumberFormatException unused) {
            return false;
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:110:0x028d A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:117:0x02a3  */
    /* JADX WARN: Removed duplicated region for block: B:127:0x02c7  */
    /* JADX WARN: Removed duplicated region for block: B:141:0x02fa  */
    /* JADX WARN: Removed duplicated region for block: B:155:0x032e  */
    /* JADX WARN: Removed duplicated region for block: B:168:0x0367  */
    /* JADX WARN: Removed duplicated region for block: B:182:0x03a2  */
    /* JADX WARN: Removed duplicated region for block: B:188:0x03b1  */
    /* JADX WARN: Removed duplicated region for block: B:192:0x03bf  */
    /* JADX WARN: Removed duplicated region for block: B:197:0x03d5  */
    /* JADX WARN: Removed duplicated region for block: B:201:0x03e4  */
    /* JADX WARN: Removed duplicated region for block: B:204:0x03ef  */
    /* JADX WARN: Removed duplicated region for block: B:207:0x03fa  */
    /* JADX WARN: Removed duplicated region for block: B:210:0x0405  */
    /* JADX WARN: Removed duplicated region for block: B:213:0x0410  */
    /* JADX WARN: Removed duplicated region for block: B:216:0x041b  */
    /* JADX WARN: Removed duplicated region for block: B:219:0x0426  */
    /* JADX WARN: Removed duplicated region for block: B:242:? A[RETURN, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:38:0x0195  */
    /* JADX WARN: Removed duplicated region for block: B:44:0x01a5  */
    /* JADX WARN: Removed duplicated region for block: B:55:0x01cb  */
    /* JADX WARN: Removed duplicated region for block: B:62:0x01e0  */
    /* JADX WARN: Removed duplicated region for block: B:70:0x01f7  */
    /* JADX WARN: Removed duplicated region for block: B:90:0x0242  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private void checkParameter(java.util.HashMap<java.lang.String, java.lang.String> r50) throws com.android.lib.mcm.send_location.SendLocationModule.ParamErrorOtherException, com.android.lib.mcm.send_location.SendLocationModule.ParamErrorRequiredException, com.android.lib.mcm.send_location.SendLocationModule.ParamErrorUndefinedException, com.android.lib.mcm.send_location.SendLocationModule.ParamErrorFormatException, com.android.lib.mcm.send_location.SendLocationModule.ParamErrorRangeException, com.android.lib.mcm.send_location.SendLocationModule.UnexpectedException, com.android.lib.mcm.send_location.SendLocationModule.ParamErrorSameStartStopTimingException {
        /*
            Method dump skipped, instructions count: 1068
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.android.lib.mcm.send_location.SendLocationModule.checkParameter(java.util.HashMap):void");
    }

    private void settingHeader(HashMap<String, String> hashMap, String str) throws ParamErrorFormatException {
        if (str == null) {
            return;
        }
        try {
            JSONObject jSONObject = new JSONObject(str);
            Iterator<String> keys = jSONObject.keys();
            while (keys.hasNext()) {
                String next = keys.next();
                hashMap.put(next, jSONObject.getString(next));
            }
        } catch (JSONException e) {
            e.printStackTrace();
            throw new ParamErrorFormatException();
        }
    }

    private JSONObject gettingHeaderJson(HashMap<String, String> hashMap) throws UnexpectedException {
        JSONObject jSONObject = new JSONObject();
        for (Map.Entry<String, String> entry : hashMap.entrySet()) {
            try {
                jSONObject.put(entry.getKey(), entry.getValue());
            } catch (JSONException e) {
                e.printStackTrace();
                throw new UnexpectedException();
            }
        }
        return jSONObject;
    }

    private String gettingTimingString(Enum<?>[] enumArr) {
        String str;
        StringBuilder sb = new StringBuilder();
        int length = enumArr.length;
        boolean z = true;
        String str2 = "";
        int i = 0;
        while (i < length) {
            Enum<?> r6 = enumArr[i];
            if (!z) {
                sb.append(",");
            }
            if (r6.getClass() == SendLocationTask.SendStartTiming.class) {
                if (!TextUtils.equals(r6.name(), SendLocationTask.SendStartTiming.VehicleConnected.name())) {
                    if (!TextUtils.equals(r6.name(), SendLocationTask.SendStartTiming.VehicleDisConnected.name())) {
                        if (TextUtils.equals(r6.name(), SendLocationTask.SendStartTiming.AppLaunch.name())) {
                            str = PARAM_VALUE_START_APP_LAUNCH;
                            str2 = str;
                        } else {
                            if (!TextUtils.equals(r6.name(), SendLocationTask.SendStartTiming.AppForeground.name())) {
                                if (!TextUtils.equals(r6.name(), SendLocationTask.SendStartTiming.AppBackground.name())) {
                                }
                                str2 = "app_bg";
                            }
                            str2 = "app_fg";
                        }
                    }
                    str2 = "vehicle_discon";
                }
                str2 = "vehicle_con";
            } else if (r6.getClass() == SendLocationTask.SendStopTiming.class) {
                if (TextUtils.equals(r6.name(), SendLocationTask.SendStopTiming.None.name())) {
                    str = PARAM_VALUE_STOP_NONE;
                    str2 = str;
                } else {
                    if (!TextUtils.equals(r6.name(), SendLocationTask.SendStopTiming.VehicleConnected.name())) {
                        if (!TextUtils.equals(r6.name(), SendLocationTask.SendStopTiming.VehicleDisConnected.name())) {
                            if (!TextUtils.equals(r6.name(), SendLocationTask.SendStopTiming.AppForeground.name())) {
                                if (!TextUtils.equals(r6.name(), SendLocationTask.SendStopTiming.AppBackground.name())) {
                                }
                                str2 = "app_bg";
                            }
                            str2 = "app_fg";
                        }
                        str2 = "vehicle_discon";
                    }
                    str2 = "vehicle_con";
                }
            }
            sb.append(str2);
            i++;
            z = false;
        }
        return sb.toString();
    }

    private void settingSendLocationInfo(HashMap<String, String> hashMap, SendLocationInfo sendLocationInfo) throws ParamErrorFormatException, ParamErrorUndefinedException {
        sendLocationInfo.setUrl(hashMap.get("url"));
        sendLocationInfo.getHeader().clear();
        settingHeader(sendLocationInfo.getHeader(), hashMap.get("header"));
        if (TextUtils.equals(hashMap.get("method"), PARAM_VALUE_METHOD_GET)) {
            sendLocationInfo.setMethod(SendLocationInfo.Method.get);
        } else if (TextUtils.equals(hashMap.get("method"), PARAM_VALUE_METHOD_POST)) {
            sendLocationInfo.setMethod(SendLocationInfo.Method.post);
        } else if (hashMap.get("method") == null || TextUtils.equals(hashMap.get("method"), "")) {
            sendLocationInfo.setMethod(SendLocationInfo.Method.get);
        } else {
            throw new ParamErrorUndefinedException();
        }
        sendLocationInfo.setFormat(hashMap.get("format"));
        sendLocationInfo.setLat(hashMap.get(PARAM_LAT));
        sendLocationInfo.setLon(hashMap.get(PARAM_LON));
        sendLocationInfo.setSpeed(hashMap.get(PARAM_SPD));
        sendLocationInfo.setTaskID(hashMap.get("task_id"));
    }

    private void settingUpdateTaskInfo(HashMap<String, String> hashMap, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws ParamErrorFormatException {
        try {
            sendLocationTaskRegistInfo.setLifetime(Integer.parseInt(hashMap.get("lifetime")));
        } catch (NumberFormatException e) {
            e.printStackTrace();
            throw new ParamErrorFormatException();
        }
    }

    private void settingRegistTaskInfo(HashMap<String, String> hashMap, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws ParamErrorFormatException, ParamErrorUndefinedException {
        String[] split;
        SendLocationTask.SendStopTiming sendStopTiming;
        String[] split2;
        SendLocationTask.SendStartTiming sendStartTiming;
        sendLocationTaskRegistInfo.setUrl(hashMap.get("url"));
        sendLocationTaskRegistInfo.setUrlEnd(hashMap.get("url_end"));
        sendLocationTaskRegistInfo.getHeader().clear();
        settingHeader(sendLocationTaskRegistInfo.getHeader(), hashMap.get("header"));
        sendLocationTaskRegistInfo.getHeaderEnd().clear();
        settingHeader(sendLocationTaskRegistInfo.getHeaderEnd(), hashMap.get("header_end"));
        sendLocationTaskRegistInfo.setData(hashMap.get("data"));
        String str = hashMap.get(PARAM_KEY_CMD);
        if (TextUtils.equals(str, PARAM_VALUE_REGIST_TASK)) {
            sendLocationTaskRegistInfo.setTaskType(SendLocationTaskManager.TaskType.normal);
        } else if (TextUtils.equals(str, PARAM_VALUE_REGIST_GLYMPSE_TASK)) {
            sendLocationTaskRegistInfo.setTaskType(SendLocationTaskManager.TaskType.glympse);
        }
        if (TextUtils.equals(hashMap.get("method"), PARAM_VALUE_METHOD_GET)) {
            sendLocationTaskRegistInfo.setRequestMethod(SendLocationTask.RequestMethod.get);
        } else if (TextUtils.equals(hashMap.get("method"), PARAM_VALUE_METHOD_POST)) {
            sendLocationTaskRegistInfo.setRequestMethod(SendLocationTask.RequestMethod.post);
        } else {
            throw new ParamErrorUndefinedException();
        }
        sendLocationTaskRegistInfo.setFormat(hashMap.get("format"));
        sendLocationTaskRegistInfo.setFormatEnd(hashMap.get("format_end"));
        ArrayList arrayList = new ArrayList();
        if (hashMap.get("start") != null) {
            for (String str2 : hashMap.get("start").split(",")) {
                if (TextUtils.equals(str2, "vehicle_con")) {
                    sendStartTiming = SendLocationTask.SendStartTiming.VehicleConnected;
                } else if (TextUtils.equals(str2, "vehicle_discon")) {
                    sendStartTiming = SendLocationTask.SendStartTiming.VehicleDisConnected;
                } else if (TextUtils.equals(str2, PARAM_VALUE_START_APP_LAUNCH)) {
                    sendStartTiming = SendLocationTask.SendStartTiming.AppLaunch;
                } else if (TextUtils.equals(str2, "app_fg")) {
                    sendStartTiming = SendLocationTask.SendStartTiming.AppForeground;
                } else if (TextUtils.equals(str2, "app_bg")) {
                    sendStartTiming = SendLocationTask.SendStartTiming.AppBackground;
                } else {
                    throw new ParamErrorUndefinedException();
                }
                if (!arrayList.contains(sendStartTiming)) {
                    arrayList.add(sendStartTiming);
                }
            }
        }
        sendLocationTaskRegistInfo.setStartTimings((SendLocationTask.SendStartTiming[]) arrayList.toArray(new SendLocationTask.SendStartTiming[0]));
        ArrayList arrayList2 = new ArrayList();
        if (hashMap.get("stop") != null) {
            for (String str3 : hashMap.get("stop").split(",")) {
                if (TextUtils.equals(str3, PARAM_VALUE_STOP_NONE)) {
                    sendStopTiming = SendLocationTask.SendStopTiming.None;
                } else if (TextUtils.equals(str3, "vehicle_con")) {
                    sendStopTiming = SendLocationTask.SendStopTiming.VehicleConnected;
                } else if (TextUtils.equals(str3, "vehicle_discon")) {
                    sendStopTiming = SendLocationTask.SendStopTiming.VehicleDisConnected;
                } else if (TextUtils.equals(str3, "app_fg")) {
                    sendStopTiming = SendLocationTask.SendStopTiming.AppForeground;
                } else if (TextUtils.equals(str3, "app_bg")) {
                    sendStopTiming = SendLocationTask.SendStopTiming.AppBackground;
                } else {
                    throw new ParamErrorUndefinedException();
                }
                if (!arrayList2.contains(sendStopTiming)) {
                    arrayList2.add(sendStopTiming);
                }
            }
        }
        sendLocationTaskRegistInfo.setStopTimings((SendLocationTask.SendStopTiming[]) arrayList2.toArray(new SendLocationTask.SendStopTiming[0]));
        try {
            sendLocationTaskRegistInfo.setInterval(Integer.parseInt(hashMap.get("interval")));
            sendLocationTaskRegistInfo.setStartDelayTime(Integer.parseInt(hashMap.get("start_delay")));
            sendLocationTaskRegistInfo.setStopDelayTime(Integer.parseInt(hashMap.get("stop_delay")));
            sendLocationTaskRegistInfo.setLifetime(Integer.parseInt(hashMap.get("lifetime")));
            sendLocationTaskRegistInfo.setPid(SendLocationInfoManager.getCurrentPid(AppInfoUtil.getCurrentWiFiPort(), this.context));
        } catch (NumberFormatException e) {
            e.printStackTrace();
            throw new ParamErrorFormatException();
        }
    }

    private JSONArray createTaskInfoResponse(SendLocationTaskRegistInfo[] sendLocationTaskRegistInfoArr) throws UnexpectedException {
        JSONArray jSONArray = new JSONArray();
        for (SendLocationTaskRegistInfo sendLocationTaskRegistInfo : sendLocationTaskRegistInfoArr) {
            JSONObject jSONObject = new JSONObject();
            try {
                jSONObject.put("task_id", sendLocationTaskRegistInfo.getTaskID());
                jSONObject.put(RESPONSE_KEY_GET_TASK_TYPE, sendLocationTaskRegistInfo.getTaskType().name());
                jSONObject.put("url", sendLocationTaskRegistInfo.getUrl());
                jSONObject.put("header", gettingHeaderJson(sendLocationTaskRegistInfo.getHeader()));
                jSONObject.put("format", sendLocationTaskRegistInfo.getFormat());
                if (sendLocationTaskRegistInfo.getTaskType() == SendLocationTaskManager.TaskType.normal) {
                    jSONObject.put("method", sendLocationTaskRegistInfo.getRequestMethod().name());
                } else if (sendLocationTaskRegistInfo.getTaskType() == SendLocationTaskManager.TaskType.glympse) {
                    jSONObject.put("data", sendLocationTaskRegistInfo.getData());
                    jSONObject.put("url_end", sendLocationTaskRegistInfo.getUrlEnd());
                    jSONObject.put("header_end", gettingHeaderJson(sendLocationTaskRegistInfo.getHeaderEnd()));
                    jSONObject.put("format_end", sendLocationTaskRegistInfo.getFormatEnd());
                }
                jSONObject.put("start", gettingTimingString(sendLocationTaskRegistInfo.getStartTimings()));
                jSONObject.put("start_delay", sendLocationTaskRegistInfo.getStartDelayTime());
                jSONObject.put("stop", gettingTimingString(sendLocationTaskRegistInfo.getStopTimings()));
                jSONObject.put("stop_delay", sendLocationTaskRegistInfo.getStopDelayTime());
                jSONObject.put("interval", sendLocationTaskRegistInfo.getInterval());
                jSONObject.put("lifetime", sendLocationTaskRegistInfo.getLifetime());
                jSONArray.put(jSONObject);
            } catch (JSONException e) {
                e.printStackTrace();
                throw new UnexpectedException();
            }
        }
        return jSONArray;
    }

    private SendLocationCommunicatorResponseData sendLocation(SendLocationInfo sendLocationInfo) throws FailSendLocationTimeoutException, UnexpectedException, FailSendLocationTargetLimit, UnsupportedEncodingException {
        if (SendLocationLimitManager.checkPermitSendLocation(this.context)) {
            boolean sendTargetPID = SendLocationUtil.sendTargetPID(sendLocationInfo);
            boolean sendTargetAcceleration = SendLocationUtil.sendTargetAcceleration(sendLocationInfo);
            boolean sendTargetOrientation = SendLocationUtil.sendTargetOrientation(sendLocationInfo);
            final SendLocationInfoParamContainer sendLocationInfoParamContainer = new SendLocationInfoParamContainer();
            sendLocationInfoParamContainer.setLocation(sendLocationInfo.getLon(), sendLocationInfo.getLat(), SendLocationUtil.convTimestampISO8601Format(SendLocationUtil.getNowDateUTC()));
            sendLocationInfoParamContainer.setSpeed(sendLocationInfo.getSpeed(), SendLocationUtil.convTimestampISO8601Format(SendLocationUtil.getNowDateUTC()));
            int i = sendTargetOrientation ? (sendTargetAcceleration ? 1 : 0) + 1 : sendTargetAcceleration ? 1 : 0;
            this.mSendLocationGetInfoLatch = new CountDownLatch(i);
            if (sendTargetAcceleration) {
                SendLocationInfoManager.getAcceleration(new SendLocationInfoManager.IAccelerationCallback() { // from class: com.android.lib.mcm.send_location.SendLocationModule.2
                    @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IAccelerationCallback
                    public void callback(float f, float f2, float f3, boolean z, Date date) {
                        sendLocationInfoParamContainer.setAcceleration(z ? SendLocationUtil.convStringValue(f) : "", z ? SendLocationUtil.convStringValue(f2) : "", z ? SendLocationUtil.convStringValue(f3) : "", SendLocationUtil.convTimestampISO8601Format(date));
                        SendLocationModule.this.mSendLocationGetInfoLatch.countDown();
                    }
                }, this.context);
            }
            if (sendTargetOrientation) {
                SendLocationInfoManager.getOrientation(new SendLocationInfoManager.IOrientationCallback() { // from class: com.android.lib.mcm.send_location.SendLocationModule.3
                    @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IOrientationCallback
                    public void callback(float f, boolean z, Date date) {
                        sendLocationInfoParamContainer.setOrientation(z ? SendLocationUtil.convStringValue(f) : "", SendLocationUtil.convTimestampISO8601Format(date));
                        SendLocationModule.this.mSendLocationGetInfoLatch.countDown();
                    }
                }, this.context);
            }
            if (sendTargetPID) {
                sendLocationInfoParamContainer.setPid(SendLocationInfoManager.getCurrentPid(AppInfoUtil.getCurrentWiFiPort(), this.context), SendLocationUtil.convTimestampISO8601Format(SendLocationUtil.getNowDateUTC()));
            }
            SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData = new SendLocationCommunicatorRequestData();
            sendLocationCommunicatorRequestData.setUrl(sendLocationInfo.getUrl());
            int i2 = AnonymousClass5.$SwitchMap$com$android$lib$mcm$send_location$SendLocationInfo$Method[sendLocationInfo.getMethod().ordinal()];
            if (i2 == 1) {
                sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.get);
            } else if (i2 == 2) {
                sendLocationCommunicatorRequestData.setMethod(SendLocationCommunicatorRequestData.MethodType.post);
            }
            for (Map.Entry<String, String> entry : sendLocationInfo.getHeader().entrySet()) {
                sendLocationCommunicatorRequestData.getHeader().put(entry.getKey(), entry.getValue());
            }
            if (i > 0) {
                try {
                    if (!this.mSendLocationGetInfoLatch.await(30000L, TimeUnit.MILLISECONDS)) {
                        LogWrapper.w(TAG, "get info timeout");
                    }
                } catch (InterruptedException unused) {
                    throw new UnexpectedException();
                }
            }
            sendLocationCommunicatorRequestData.setParam(SendLocationUtil.createParamString(sendLocationInfo.getFormat(), sendLocationInfoParamContainer));
            this.mSendLocationLatch = new CountDownLatch(1);
            sendLocationCommunicatorRequestData.setData(sendLocationCommunicatorRequestData.getParam());
            this.mSendLocationCommunicator.requestQueue(sendLocationCommunicatorRequestData, new SendLocationCommunicator.IResponse() { // from class: com.android.lib.mcm.send_location.SendLocationModule.4
                @Override // com.android.lib.mcm.send_location.SendLocationCommunicator.IResponse
                public void callback(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) {
                    sendLocationInfoParamContainer.setResponseData(sendLocationCommunicatorResponseData);
                    SendLocationModule.this.mSendLocationLatch.countDown();
                }
            });
            try {
                if (this.mSendLocationLatch.await(30000L, TimeUnit.MILLISECONDS)) {
                    return sendLocationInfoParamContainer.getResponseData();
                }
                LogWrapper.w(TAG, "send location timeout");
                throw new FailSendLocationTimeoutException();
            } catch (InterruptedException unused2) {
                throw new UnexpectedException();
            }
        }
        throw new FailSendLocationTargetLimit();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.android.lib.mcm.send_location.SendLocationModule$5  reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass5 {
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus;
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationInfo$Method;
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType;
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskUpdateResponse$ResponseType;

        static {
            int[] iArr = new int[SendLocationInfo.Method.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationInfo$Method = iArr;
            try {
                iArr[SendLocationInfo.Method.get.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationInfo$Method[SendLocationInfo.Method.post.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            int[] iArr2 = new int[SendLocationTaskUpdateResponse.ResponseType.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskUpdateResponse$ResponseType = iArr2;
            try {
                iArr2[SendLocationTaskUpdateResponse.ResponseType.Success.ordinal()] = 1;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskUpdateResponse$ResponseType[SendLocationTaskUpdateResponse.ResponseType.Error.ordinal()] = 2;
            } catch (NoSuchFieldError unused4) {
            }
            int[] iArr3 = new int[SendLocationTaskRegistResponse.ResponseType.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType = iArr3;
            try {
                iArr3[SendLocationTaskRegistResponse.ResponseType.Success.ordinal()] = 1;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType[SendLocationTaskRegistResponse.ResponseType.SuccessExceedCount.ordinal()] = 2;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType[SendLocationTaskRegistResponse.ResponseType.SuccessOverlap.ordinal()] = 3;
            } catch (NoSuchFieldError unused7) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType[SendLocationTaskRegistResponse.ResponseType.DisabledLocationServiceError.ordinal()] = 4;
            } catch (NoSuchFieldError unused8) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskRegistResponse$ResponseType[SendLocationTaskRegistResponse.ResponseType.UnexpectedError.ordinal()] = 5;
            } catch (NoSuchFieldError unused9) {
            }
            int[] iArr4 = new int[SendLocationCommunicatorResponseData.CommunicationStatus.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus = iArr4;
            try {
                iArr4[SendLocationCommunicatorResponseData.CommunicationStatus.Success.ordinal()] = 1;
            } catch (NoSuchFieldError unused10) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[SendLocationCommunicatorResponseData.CommunicationStatus.Incommunicable.ordinal()] = 2;
            } catch (NoSuchFieldError unused11) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[SendLocationCommunicatorResponseData.CommunicationStatus.Timeout.ordinal()] = 3;
            } catch (NoSuchFieldError unused12) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[SendLocationCommunicatorResponseData.CommunicationStatus.UnknownHost.ordinal()] = 4;
            } catch (NoSuchFieldError unused13) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[SendLocationCommunicatorResponseData.CommunicationStatus.SSLHandshakeError.ordinal()] = 5;
            } catch (NoSuchFieldError unused14) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationCommunicatorResponseData$CommunicationStatus[SendLocationCommunicatorResponseData.CommunicationStatus.OtherError.ordinal()] = 6;
            } catch (NoSuchFieldError unused15) {
            }
        }
    }
}
