package com.android.lib.mcm.send_location;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Looper;
import android.text.TextUtils;
import com.android.lib.mcm.ApplicationDelegateManager;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.application.ApplicationLifecycleHandler;
import com.android.lib.mcm.send_location.SendLocationCommunicator;
import com.android.lib.mcm.send_location.SendLocationTask;
import com.android.lib.mcm.send_location.SendLocationTaskRegistResponse;
import com.android.lib.mcm.send_location.SendLocationTaskUpdateResponse;
import com.clarion.android.appmgr.stub.Stub;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Timer;
import java.util.TimerTask;
/* loaded from: classes.dex */
public class SendLocationTaskManager {
    private static final String TAG = "SendLocationTaskManager";
    private static SendLocationTaskManager instance;
    private static Object sTaskInfoFileLockObject = new Object();
    private LinkedHashMap<String, SendLocationTask> mTaskMap = new LinkedHashMap<>();
    private Context mContext = null;
    private final long TIMER_SECONDS_INTERVAL = 1000;
    private final int MAX_TASK_REGIST_COUNT = 100;
    private final String TASK_INFO_FILE_NAME = "sendlocation_taskinfo.dat";
    private boolean mIsVehicleConnected = false;
    private boolean mIsApplicationLaunched = false;
    private boolean mIsApplicationForeground = false;
    private SendLocationCommunicator mSendLocationCommunicator = null;
    private Timer mSendLocationTimer = null;
    private IGetInfoContainer mGetInfoContainerListener = null;
    private IChangedTaskCount mChangedTaskCountListener = null;
    private SendLocationVehicleConnectDetectionManager mVehicleConnectDetectionManager = null;
    private BroadcastReceiver mAppStatusNoticeReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.send_location.SendLocationTaskManager.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            LogWrapper.d(SendLocationTaskManager.TAG, "mAppStatusNoticeReceiver:onReceive:" + action);
            SendLocationTaskManager.this.noticeEvent(action);
        }
    };

    /* loaded from: classes.dex */
    public interface IChangedTaskCount {
        void Changed() throws UnsupportedEncodingException;
    }

    /* loaded from: classes.dex */
    public interface IGetInfoContainer {
        SendLocationInfoValueContainer getInfoContainer();
    }

    /* loaded from: classes.dex */
    public enum TaskType {
        normal,
        glympse
    }

    public static synchronized SendLocationTaskManager getInstance(Context context) throws UnsupportedEncodingException {
        SendLocationTaskManager sendLocationTaskManager;
        synchronized (SendLocationTaskManager.class) {
            if (instance == null) {
                SendLocationTaskManager sendLocationTaskManager2 = new SendLocationTaskManager();
                instance = sendLocationTaskManager2;
                sendLocationTaskManager2.mContext = context.getApplicationContext();
                instance.initialize();
            }
            sendLocationTaskManager = instance;
        }
        return sendLocationTaskManager;
    }

    public Context getContext() {
        return this.mContext;
    }

    public static void ClearSingletonInstance() {
        SendLocationTaskManager sendLocationTaskManager = instance;
        if (sendLocationTaskManager != null) {
            sendLocationTaskManager.Destroy();
        }
        instance = null;
    }

    private void Destroy() {
        BroadcastReceiver broadcastReceiver;
        Context context = this.mContext;
        if (context == null || (broadcastReceiver = this.mAppStatusNoticeReceiver) == null) {
            return;
        }
        try {
            context.unregisterReceiver(broadcastReceiver);
            this.mAppStatusNoticeReceiver = null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initialize() throws UnsupportedEncodingException {
        this.mSendLocationCommunicator = new SendLocationCommunicator(this.mContext);
        this.mVehicleConnectDetectionManager = SendLocationVehicleConnectDetectionManager.getInstance(this.mContext, this.mTaskMap);
        settingSendLocationTimer();
        restoreTaskInfoStorage();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_FOREGROUND));
        intentFilter.addAction(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_BACKGROUND));
        intentFilter.addAction(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_CONNECTED_VEHICLE));
        intentFilter.addAction(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_DISCONNECTED_VEHICLE));
        intentFilter.addAction(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_LAUNCH));
        this.mContext.registerReceiver(this.mAppStatusNoticeReceiver, intentFilter);
        this.mContext.sendBroadcast(new Intent(Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_STATUS_NOTICE_REQUEST)));
    }

    private void settingSendLocationTimer() {
        Timer timer = new Timer();
        this.mSendLocationTimer = timer;
        timer.schedule(new TimerTask() { // from class: com.android.lib.mcm.send_location.SendLocationTaskManager.2
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                if (!SendLocationService.isRunningService()) {
                    SendLocationTaskManager.this.mSendLocationTimer.cancel();
                    SendLocationTaskManager.this.mSendLocationTimer = null;
                    LogWrapper.d(SendLocationTaskManager.TAG, "SendLocationTimer stop");
                    return;
                }
                try {
                    SendLocationTaskManager.this.timerSecondsTick();
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            }
        }, 0L, 1000L);
    }

    public void settingInfoValue(SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                settingInfoValue(this.mTaskMap.get(str), sendLocationInfoValueContainer);
            }
        }
    }

    public void settingLocation(SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                settingTaskLocation(this.mTaskMap.get(str), sendLocationInfoValueContainer);
            }
        }
    }

    public void settingAcceleration(SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                settingTaskAcceleration(this.mTaskMap.get(str), sendLocationInfoValueContainer);
            }
        }
    }

    public void settingOrientation(SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                settingTaskOrientation(this.mTaskMap.get(str), sendLocationInfoValueContainer);
            }
        }
    }

    private void settingInfoValue(SendLocationTask sendLocationTask, SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        settingTaskLocation(sendLocationTask, sendLocationInfoValueContainer);
        settingTaskAcceleration(sendLocationTask, sendLocationInfoValueContainer);
        settingTaskOrientation(sendLocationTask, sendLocationInfoValueContainer);
    }

    private void settingTaskLocation(SendLocationTask sendLocationTask, SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        sendLocationTask.setLocation(sendLocationInfoValueContainer.getLocationLatitude(), sendLocationInfoValueContainer.getLocationLongitude(), sendLocationInfoValueContainer.getIsSuccessLocation(), sendLocationInfoValueContainer.getLocationTimestamp());
        sendLocationTask.setSpeed(sendLocationInfoValueContainer.getSpeed(), sendLocationInfoValueContainer.getIsSuccessSpeed(), sendLocationInfoValueContainer.getSpeedTimestamp());
    }

    private void settingTaskAcceleration(SendLocationTask sendLocationTask, SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        sendLocationTask.setAcceleration(sendLocationInfoValueContainer.getAccelerationX(), sendLocationInfoValueContainer.getAccelerationY(), sendLocationInfoValueContainer.getAccelerationZ(), sendLocationInfoValueContainer.getIsSuccessAcceleration(), sendLocationInfoValueContainer.getAccelerationTimestamp());
    }

    private void settingTaskOrientation(SendLocationTask sendLocationTask, SendLocationInfoValueContainer sendLocationInfoValueContainer) {
        sendLocationTask.setOrientation(sendLocationInfoValueContainer.getOrientation(), sendLocationInfoValueContainer.getIsSuccessOrientation(), sendLocationInfoValueContainer.getOrientationTimestamp());
    }

    public void setGetInfoContainerListener(IGetInfoContainer iGetInfoContainer) {
        this.mGetInfoContainerListener = iGetInfoContainer;
    }

    public void setChangedTaskCountListener(IChangedTaskCount iChangedTaskCount) {
        this.mChangedTaskCountListener = iChangedTaskCount;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void timerSecondsTick() throws UnsupportedEncodingException {
        ArrayList arrayList = new ArrayList();
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                arrayList.add(this.mTaskMap.get(str));
            }
        }
        Iterator it = arrayList.iterator();
        while (it.hasNext()) {
            SendLocationTask sendLocationTask = (SendLocationTask) it.next();
            try {
                sendLocationTask.timerSecondsTick();
            } catch (Exception unused) {
                LogWrapper.w(TAG, "timerSecondsTick catch exception. remove task id:" + sendLocationTask.getTaskID());
                removeTask(sendLocationTask.getTaskID(), false, true);
            }
        }
    }

    private SendLocationTask.EventTiming[] getCurrentStatus() {
        ArrayList arrayList = new ArrayList();
        if (this.mIsVehicleConnected) {
            arrayList.add(SendLocationTask.EventTiming.VehicleConnected);
        } else {
            arrayList.add(SendLocationTask.EventTiming.VehicleDisConnected);
        }
        if (this.mIsApplicationLaunched) {
            arrayList.add(SendLocationTask.EventTiming.AppLaunch);
        }
        if (this.mIsApplicationForeground) {
            arrayList.add(SendLocationTask.EventTiming.AppForeground);
        } else {
            arrayList.add(SendLocationTask.EventTiming.AppBackground);
        }
        return (SendLocationTask.EventTiming[]) arrayList.toArray(new SendLocationTask.EventTiming[0]);
    }

    public void queingSendLocationRequest(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, SendLocationCommunicator.IResponse iResponse) {
        queingSendLocationRequest(sendLocationCommunicatorRequestData, iResponse, false);
    }

    public void queingSendLocationRequest(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, SendLocationCommunicator.IResponse iResponse, boolean z) {
        this.mSendLocationCommunicator.requestQueue(sendLocationCommunicatorRequestData, iResponse, z);
    }

    public SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws UnsupportedEncodingException {
        return registTask(sendLocationTaskRegistInfo, true);
    }

    private SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo, boolean z) throws UnsupportedEncodingException {
        Stub.ICheckSystemSettingsDelegate checkSystemSettingsDelegate;
        SendLocationTaskRegistResponse sendLocationTaskRegistResponse = new SendLocationTaskRegistResponse();
        sendLocationTaskRegistResponse.setResponseType(SendLocationTaskRegistResponse.ResponseType.Success);
        boolean isContainLocationFormat = SendLocationUtil.isContainLocationFormat(sendLocationTaskRegistInfo.getFormat());
        boolean isContainLocationFormat2 = SendLocationUtil.isContainLocationFormat(sendLocationTaskRegistInfo.getFormatEnd());
        if (z && ((isContainLocationFormat || isContainLocationFormat2) && (checkSystemSettingsDelegate = ApplicationDelegateManager.getCheckSystemSettingsDelegate()) != null && !checkSystemSettingsDelegate.isEnabledLocationService(this.mContext))) {
            LogWrapper.d(TAG, "disabled location service setting.");
            sendLocationTaskRegistResponse.setResponseType(SendLocationTaskRegistResponse.ResponseType.DisabledLocationServiceError);
            return sendLocationTaskRegistResponse;
        }
        String createTaskID = z ? createTaskID() : sendLocationTaskRegistInfo.getTaskID();
        if (TextUtils.isEmpty(createTaskID)) {
            LogWrapper.w(TAG, "fail create task id");
            sendLocationTaskRegistResponse.setResponseType(SendLocationTaskRegistResponse.ResponseType.UnexpectedError);
            return sendLocationTaskRegistResponse;
        }
        sendLocationTaskRegistResponse.setTaskID(createTaskID);
        SendLocationTask sendLocationTask = null;
        int i = AnonymousClass4.$SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskManager$TaskType[sendLocationTaskRegistInfo.getTaskType().ordinal()];
        if (i == 1) {
            sendLocationTask = new SendLocationTask(createTaskID, sendLocationTaskRegistInfo, this);
        } else if (i == 2) {
            sendLocationTask = new SendLocationGlympseTask(createTaskID, sendLocationTaskRegistInfo, this);
        }
        sendLocationTask.setPid(sendLocationTaskRegistInfo.getPid(), SendLocationUtil.getNowDateUTC());
        if (z) {
            sendLocationTask.setVehicleMacAddress(this.mVehicleConnectDetectionManager.getConnectedVehicleMacAddress());
        }
        synchronized (this.mTaskMap) {
            ArrayList arrayList = new ArrayList();
            boolean z2 = false;
            for (SendLocationTask sendLocationTask2 : this.mTaskMap.values()) {
                if (sendLocationTaskRegistInfo.equalsParam(sendLocationTask2.getRegistInfo())) {
                    sendLocationTaskRegistResponse.setResponseType(SendLocationTaskRegistResponse.ResponseType.SuccessOverlap);
                    arrayList.add(sendLocationTask2.getTaskID());
                    z2 = true;
                }
            }
            if (z2) {
                LogWrapper.d(TAG, "remove overlap param task");
                Iterator it = arrayList.iterator();
                while (it.hasNext()) {
                    String str = (String) it.next();
                    this.mTaskMap.get(str).destroy(false);
                    this.mTaskMap.remove(str);
                }
            } else if (this.mTaskMap.size() == 100) {
                LogWrapper.d(TAG, "registered over count task. remove oldest task.");
                sendLocationTaskRegistResponse.setResponseType(SendLocationTaskRegistResponse.ResponseType.SuccessExceedCount);
                String next = this.mTaskMap.keySet().iterator().next();
                this.mTaskMap.get(next).destroy(false);
                this.mTaskMap.remove(next);
            }
            this.mTaskMap.put(createTaskID, sendLocationTask);
            if (z) {
                sendLocationTask.setRegistTaskDate(SendLocationUtil.getNowDateUTC());
            }
        }
        sendLocationTask.initEventCheck(getCurrentStatus());
        IGetInfoContainer iGetInfoContainer = this.mGetInfoContainerListener;
        if (iGetInfoContainer != null) {
            settingInfoValue(sendLocationTask, iGetInfoContainer.getInfoContainer());
        }
        IChangedTaskCount iChangedTaskCount = this.mChangedTaskCountListener;
        if (iChangedTaskCount != null) {
            iChangedTaskCount.Changed();
        }
        updateTaskInfoStorage();
        return sendLocationTaskRegistResponse;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.android.lib.mcm.send_location.SendLocationTaskManager$4  reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass4 {
        static final /* synthetic */ int[] $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskManager$TaskType;

        static {
            int[] iArr = new int[TaskType.values().length];
            $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskManager$TaskType = iArr;
            try {
                iArr[TaskType.normal.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$com$android$lib$mcm$send_location$SendLocationTaskManager$TaskType[TaskType.glympse.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
        }
    }

    public boolean removeTask(String str, boolean z, boolean z2) throws UnsupportedEncodingException {
        synchronized (this.mTaskMap) {
            if (this.mTaskMap.containsKey(str)) {
                SendLocationTask sendLocationTask = this.mTaskMap.get(str);
                if (sendLocationTask.destroy(z)) {
                    synchronized (this.mTaskMap) {
                        this.mTaskMap.remove(str);
                    }
                    IChangedTaskCount iChangedTaskCount = this.mChangedTaskCountListener;
                    if (iChangedTaskCount != null) {
                        iChangedTaskCount.Changed();
                    }
                    if (z2) {
                        updateTaskInfoStorage();
                    }
                    return true;
                }
                return false;
            }
            return true;
        }
    }

    private void removeAllTask() throws UnsupportedEncodingException {
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                this.mTaskMap.get(str).destroy(false);
            }
            this.mTaskMap.clear();
        }
        IChangedTaskCount iChangedTaskCount = this.mChangedTaskCountListener;
        if (iChangedTaskCount != null) {
            iChangedTaskCount.Changed();
        }
        updateTaskInfoStorage();
    }

    public SendLocationTaskUpdateResponse updateTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) {
        SendLocationTaskUpdateResponse sendLocationTaskUpdateResponse = new SendLocationTaskUpdateResponse();
        sendLocationTaskUpdateResponse.setResponseType(SendLocationTaskUpdateResponse.ResponseType.Error);
        synchronized (this.mTaskMap) {
            if (this.mTaskMap.containsKey(str)) {
                SendLocationTask sendLocationTask = this.mTaskMap.get(str);
                if (sendLocationTask.getClass() != SendLocationGlympseTask.class) {
                    return sendLocationTaskUpdateResponse;
                }
                sendLocationTask.setLifetime(sendLocationTaskRegistInfo.getLifetime());
                updateTaskInfoStorage();
                sendLocationTaskUpdateResponse.setResponseType(SendLocationTaskUpdateResponse.ResponseType.Success);
                return sendLocationTaskUpdateResponse;
            }
            return sendLocationTaskUpdateResponse;
        }
    }

    public SendLocationTaskRegistInfo[] getTasks(String str) {
        ArrayList arrayList = new ArrayList();
        boolean isEmpty = TextUtils.isEmpty(str);
        synchronized (this.mTaskMap) {
            Iterator<String> it = this.mTaskMap.keySet().iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                }
                SendLocationTask sendLocationTask = this.mTaskMap.get(it.next());
                if (isEmpty) {
                    arrayList.add(sendLocationTask.getRegistInfo());
                } else if (TextUtils.equals(sendLocationTask.getTaskID(), str)) {
                    arrayList.add(sendLocationTask.getRegistInfo());
                    break;
                }
            }
        }
        return (SendLocationTaskRegistInfo[]) arrayList.toArray(new SendLocationTaskRegistInfo[0]);
    }

    public int getTaskCount() {
        int size;
        synchronized (this.mTaskMap) {
            size = this.mTaskMap.size();
        }
        return size;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void noticeEvent(String str) {
        SendLocationTask.EventTiming eventTiming = SendLocationTask.EventTiming.None;
        LogWrapper.d(TAG, "noticeEvent:" + str);
        if (TextUtils.equals(str, Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_FOREGROUND))) {
            eventTiming = SendLocationTask.EventTiming.AppForeground;
            this.mIsApplicationForeground = true;
        } else if (TextUtils.equals(str, Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_BACKGROUND))) {
            eventTiming = SendLocationTask.EventTiming.AppBackground;
            this.mIsApplicationForeground = false;
        } else if (TextUtils.equals(str, Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_CONNECTED_VEHICLE))) {
            eventTiming = SendLocationTask.EventTiming.VehicleConnected;
            this.mIsVehicleConnected = true;
            this.mVehicleConnectDetectionManager.setIsConnectedSpp(true);
        } else if (TextUtils.equals(str, Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_DISCONNECTED_VEHICLE))) {
            eventTiming = SendLocationTask.EventTiming.VehicleDisConnected;
            this.mIsVehicleConnected = false;
            this.mVehicleConnectDetectionManager.setIsConnectedSpp(false);
        } else if (TextUtils.equals(str, Util.makeBroadcastFilter(this.mContext, ApplicationLifecycleHandler.APP_NOTICE_LAUNCH))) {
            eventTiming = SendLocationTask.EventTiming.AppLaunch;
            this.mIsApplicationLaunched = true;
        }
        if (eventTiming == SendLocationTask.EventTiming.VehicleConnected || eventTiming == SendLocationTask.EventTiming.VehicleDisConnected) {
            final boolean z = eventTiming == SendLocationTask.EventTiming.VehicleConnected;
            if (z) {
                this.mVehicleConnectDetectionManager.updateCurrentVehicleMacAddress(false, new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationTaskManager.3
                    @Override // java.lang.Runnable
                    public void run() {
                        SendLocationVehicleConnectDetectionManager sendLocationVehicleConnectDetectionManager = SendLocationTaskManager.this.mVehicleConnectDetectionManager;
                        boolean z2 = z;
                        sendLocationVehicleConnectDetectionManager.notifyVehicleConnectionTaskEvent(null, z2, z2);
                        if (TextUtils.isEmpty(SendLocationTaskManager.this.mVehicleConnectDetectionManager.getConnectedVehicleMacAddress())) {
                            return;
                        }
                        SendLocationTaskManager.this.mVehicleConnectDetectionManager.settingMacAddressNotSetTask(SendLocationTaskManager.this.mVehicleConnectDetectionManager.getConnectedVehicleMacAddress());
                        SendLocationTaskManager.this.updateTaskInfoStorage();
                    }
                }, Looper.myLooper());
                return;
            }
            this.mVehicleConnectDetectionManager.updateCurrentVehicleMacAddress(true, null, null);
            this.mVehicleConnectDetectionManager.notifyVehicleConnectionTaskEvent(null, z, true);
            return;
        }
        synchronized (this.mTaskMap) {
            for (String str2 : this.mTaskMap.keySet()) {
                this.mTaskMap.get(str2).noticeEvent(eventTiming);
            }
        }
    }

    private String createTaskID() {
        boolean z;
        String createHashID = createHashID();
        synchronized (this.mTaskMap) {
            z = false;
            int i = 0;
            while (true) {
                if (!this.mTaskMap.containsKey(createHashID)) {
                    break;
                }
                createHashID = createHashID();
                i++;
                if (i >= 10) {
                    z = true;
                    break;
                }
            }
        }
        return z ? "" : createHashID;
    }

    private String createHashID() {
        try {
            return new BigInteger(1, MessageDigest.getInstance("MD5").digest(String.valueOf(System.currentTimeMillis()).getBytes("UTF-8"))).toString(16);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public void updateTaskInfoStorage() {
        synchronized (sTaskInfoFileLockObject) {
            Util.writeByteFile("sendlocation_taskinfo.dat", Util.crypt(createTaskInfoByteData(), Util.MODE.ENCRYPT), this.mContext);
        }
    }

    private void restoreTaskInfoStorage() throws UnsupportedEncodingException {
        synchronized (sTaskInfoFileLockObject) {
            byte[] readByteFile = Util.readByteFile("sendlocation_taskinfo.dat", this.mContext);
            if (readByteFile != null && readByteFile.length != 0) {
                byte[] crypt = Util.crypt(readByteFile, Util.MODE.DECRYPT);
                removeAllTask();
                ArrayList<SendLocationTaskRegistInfo> restoreTaskInfo = restoreTaskInfo(crypt);
                if (restoreTaskInfo == null) {
                    Util.deleteFile("sendlocation_taskinfo.dat", this.mContext);
                    return;
                }
                Iterator<SendLocationTaskRegistInfo> it = restoreTaskInfo.iterator();
                while (it.hasNext()) {
                    registTask(it.next(), false);
                }
                return;
            }
            Util.deleteFile("sendlocation_taskinfo.dat", this.mContext);
        }
    }

    private byte[] createTaskInfoByteData() {
        ArrayList arrayList = new ArrayList();
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
            synchronized (this.mTaskMap) {
                for (String str : this.mTaskMap.keySet()) {
                    arrayList.add(this.mTaskMap.get(str).getRegistInfo());
                }
            }
            objectOutputStream.writeObject(arrayList);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            objectOutputStream.close();
            return byteArray;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private ArrayList<SendLocationTaskRegistInfo> restoreTaskInfo(byte[] bArr) {
        try {
            Object readObject = new ObjectInputStream(new ByteArrayInputStream(bArr)).readObject();
            if (readObject instanceof ArrayList) {
                return (ArrayList) readObject;
            }
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (ClassNotFoundException e2) {
            e2.printStackTrace();
            return null;
        }
    }
}
