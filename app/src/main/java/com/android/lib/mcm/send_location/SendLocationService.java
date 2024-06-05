package com.android.lib.mcm.send_location;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.send_location.ISendLocationService;
import com.android.lib.mcm.send_location.SendLocationInfoManager;
import com.android.lib.mcm.send_location.SendLocationTaskManager;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Date;
/* loaded from: classes.dex */
public class SendLocationService extends Service {
    private static final String TAG = "SendLocationService";
    private static boolean sRunningService = false;
    private static Object sSettingInfoFileLockObject = new Object();
    private long mGetLocationInterval = -1;
    private long mGetAccelerationInterval = -1;
    private long mGetOrientationInterval = -1;
    private SendLocationInfoValueContainer mInfoContainer = null;
    private SendLocationSetting mSetting = null;
    private final String SETTING_FILE_NAME = "sendlocation_setting.dat";
    private ISendLocationService.Stub mStub = new ISendLocationService.Stub() { // from class: com.android.lib.mcm.send_location.SendLocationService.1
        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public boolean removeTask(String str) throws RemoteException, UnsupportedEncodingException {
            return SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).removeTask(str, true, true);
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException, UnsupportedEncodingException {
            return SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).registTask(sendLocationTaskRegistInfo);
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskRegistInfo[] getTask(String str) throws RemoteException, UnsupportedEncodingException {
            return SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).getTasks(str);
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationInfoValueContainer getInfoValue() throws RemoteException {
            return SendLocationService.this.mInfoContainer;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public void settingDefaultPollingInterval(long j) throws RemoteException, UnsupportedEncodingException {
            SendLocationService.this.mSetting.setInfoPollingInterval(j);
            SendLocationService.this.settingGetInfoPolling();
            SendLocationService.this.updateSettingStorage();
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskUpdateResponse updateTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException, UnsupportedEncodingException {
            return SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).updateTask(str, sendLocationTaskRegistInfo);
        }
    };

    private void ClearSingletonInstance() {
        SendLocationTaskManager.ClearSingletonInstance();
        SendLocationVehicleConnectDetectionManager.ClearSingletonInstance();
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        LogWrapper.d(TAG, "SendLocationService:onBind");
        return this.mStub;
    }

    @Override // android.app.Service
    public void onCreate() {
        LogWrapper.d(TAG, "SendLocationService:onCreate");
        super.onCreate();
        sRunningService = true;
        try {
            initialize();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override // android.app.Service
    public void onDestroy() {
        LogWrapper.d(TAG, "SendLocationService:onDestroy");
        super.onDestroy();
        sRunningService = false;
        destroy();
    }

    public static boolean isRunningService() {
        return sRunningService;
    }

    private void initialize() throws UnsupportedEncodingException {
        LogWrapper.setEnabledDebug(true);
        LogWrapper.d(TAG, "initialize");
        ClearSingletonInstance();
        restoreSettingStorage();
        SendLocationTaskManager sendLocationTaskManager = SendLocationTaskManager.getInstance(getApplicationContext());
        this.mInfoContainer = new SendLocationInfoValueContainer();
        sendLocationTaskManager.setGetInfoContainerListener(new SendLocationTaskManager.IGetInfoContainer() { // from class: com.android.lib.mcm.send_location.SendLocationService.2
            @Override // com.android.lib.mcm.send_location.SendLocationTaskManager.IGetInfoContainer
            public SendLocationInfoValueContainer getInfoContainer() {
                return SendLocationService.this.mInfoContainer;
            }
        });
        sendLocationTaskManager.setChangedTaskCountListener(new SendLocationTaskManager.IChangedTaskCount() { // from class: com.android.lib.mcm.send_location.SendLocationService.3
            @Override // com.android.lib.mcm.send_location.SendLocationTaskManager.IChangedTaskCount
            public void Changed() throws UnsupportedEncodingException {
                SendLocationService.this.settingGetInfoPolling();
            }
        });
        settingGetInfoPolling();
    }

    private void destroy() {
        LogWrapper.d(TAG, "destroy");
        ClearSingletonInstance();
        clearGetInfoPolling();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void settingGetInfoPolling() throws UnsupportedEncodingException {
        settingGetLocation();
        settingGetAcceleration();
        settingGetOrientation();
    }

    private void clearGetInfoPolling() {
        SendLocationInfoManager.stopGetLocation();
        SendLocationInfoManager.stopGetAcceleration();
        SendLocationInfoManager.stopGetOrientation();
    }

    private long getGetInfoPollingInterval() {
        return this.mSetting.getInfoPollingInterval();
    }

    private void settingGetLocation() throws UnsupportedEncodingException {
        if (SendLocationTaskManager.getInstance(getApplicationContext()).getTaskCount() == 0) {
            SendLocationInfoManager.stopGetLocation();
            this.mGetLocationInterval = -1L;
            return;
        }
        long getInfoPollingInterval = getGetInfoPollingInterval();
        if (this.mGetLocationInterval == getInfoPollingInterval) {
            return;
        }
        this.mGetLocationInterval = getInfoPollingInterval;
        LogWrapper.d(TAG, "exec settingGetLocation interval:" + getInfoPollingInterval);
        SendLocationInfoManager.stopGetLocation();
        SendLocationInfoManager.startGetLocation(new SendLocationInfoManager.ILocationCallback() { // from class: com.android.lib.mcm.send_location.SendLocationService.4
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.ILocationCallback
            public void callback(double d, double d2, float f, SendLocationInfoManager.LocationProvider locationProvider, boolean z, Date date) throws UnsupportedEncodingException {
                SendLocationService.this.mInfoContainer.setLocation(d2, d, z, date);
                SendLocationService.this.mInfoContainer.setSpeed(f, z, date);
                SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).settingLocation(SendLocationService.this.mInfoContainer);
            }
        }, Long.valueOf(this.mGetLocationInterval), getApplicationContext());
    }

    private void settingGetAcceleration() throws UnsupportedEncodingException {
        if (SendLocationTaskManager.getInstance(getApplicationContext()).getTaskCount() == 0) {
            SendLocationInfoManager.stopGetAcceleration();
            this.mGetAccelerationInterval = -1L;
            return;
        }
        long getInfoPollingInterval = getGetInfoPollingInterval();
        if (this.mGetAccelerationInterval == getInfoPollingInterval) {
            return;
        }
        this.mGetAccelerationInterval = getInfoPollingInterval;
        LogWrapper.d(TAG, "exec settingGetAcceleration interval:" + getInfoPollingInterval);
        SendLocationInfoManager.stopGetAcceleration();
        SendLocationInfoManager.startGetAcceleration(new SendLocationInfoManager.IAccelerationCallback() { // from class: com.android.lib.mcm.send_location.SendLocationService.5
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IAccelerationCallback
            public void callback(float f, float f2, float f3, boolean z, Date date) throws UnsupportedEncodingException {
                SendLocationService.this.mInfoContainer.setAcceleration(f, f2, f3, z, date);
                SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).settingAcceleration(SendLocationService.this.mInfoContainer);
            }
        }, Long.valueOf(this.mGetAccelerationInterval), getApplicationContext());
    }

    private void settingGetOrientation() throws UnsupportedEncodingException {
        if (SendLocationTaskManager.getInstance(getApplicationContext()).getTaskCount() == 0) {
            SendLocationInfoManager.stopGetOrientation();
            this.mGetOrientationInterval = -1L;
            return;
        }
        long getInfoPollingInterval = getGetInfoPollingInterval();
        if (this.mGetOrientationInterval == getInfoPollingInterval) {
            return;
        }
        this.mGetOrientationInterval = getInfoPollingInterval;
        LogWrapper.d(TAG, "exec settingGetOrientation interval:" + getInfoPollingInterval);
        SendLocationInfoManager.stopGetOrientation();
        SendLocationInfoManager.startGetOrientation(new SendLocationInfoManager.IOrientationCallback() { // from class: com.android.lib.mcm.send_location.SendLocationService.6
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IOrientationCallback
            public void callback(float f, boolean z, Date date) throws UnsupportedEncodingException {
                SendLocationService.this.mInfoContainer.setOrientation(f, z, date);
                SendLocationTaskManager.getInstance(SendLocationService.this.getApplicationContext()).settingOrientation(SendLocationService.this.mInfoContainer);
            }
        }, Long.valueOf(this.mGetOrientationInterval), getApplicationContext());
    }

    private byte[] createSettingData() {
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
            objectOutputStream.writeObject(this.mSetting);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            objectOutputStream.close();
            return byteArray;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private SendLocationSetting restoreSetting(byte[] bArr) {
        try {
            return (SendLocationSetting) new ObjectInputStream(new ByteArrayInputStream(bArr)).readObject();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (ClassNotFoundException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateSettingStorage() {
        synchronized (sSettingInfoFileLockObject) {
            Util.writeByteFile("sendlocation_setting.dat", Util.crypt(createSettingData(), Util.MODE.ENCRYPT), getApplicationContext());
        }
    }

    private void restoreSettingStorage() {
        synchronized (sSettingInfoFileLockObject) {
            byte[] readByteFile = Util.readByteFile("sendlocation_setting.dat", getApplicationContext());
            if (readByteFile != null && readByteFile.length != 0) {
                SendLocationSetting restoreSetting = restoreSetting(Util.crypt(readByteFile, Util.MODE.DECRYPT));
                this.mSetting = restoreSetting;
                if (restoreSetting == null) {
                    initSetting();
                }
                return;
            }
            initSetting();
        }
    }

    private void initSetting() {
        synchronized (sSettingInfoFileLockObject) {
            Util.deleteFile("sendlocation_setting.dat", getApplicationContext());
            this.mSetting = new SendLocationSetting();
        }
    }
}
