package com.android.lib.mcm.send_location;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.send_location.SendLocationTask;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
/* loaded from: classes.dex */
public class SendLocationVehicleConnectDetectionManager {
    private static final int BT_WAITING_CHANGED_COUNT = 5;
    private static final long BT_WAITING_CHANGED_INTERVAL = 1000;
    private static final String TAG = "SendLocationVehicleConnectDetectionManager";
    private static SendLocationVehicleConnectDetectionManager instance;
    private static Object sConnectedVehicleMacAddressLockObject = new Object();
    private Context mContext;
    private LinkedHashMap<String, SendLocationTask> mTaskMap;
    private final long BT_WATCHER_POLLING_INTERVAL = 5000;
    private Handler mBtWatcherPollingHandler = null;
    private Runnable mBtWatcherPollingRunnable = null;
    private BluetoothAdapter mBtWatcherAdapter = null;
    private BluetoothProfile mBtWatcherProfile = null;
    private String mConnectedVehicleMacAddress = "";
    private boolean mIsConnectedSpp = false;
    private List<String> mConnectedMacAddressList = new ArrayList();
    private HandlerThread mBtWatcherPollingThread = null;
    private HandlerThread mWaitingChangedBtListThread = null;

    private SendLocationVehicleConnectDetectionManager(Context context, LinkedHashMap<String, SendLocationTask> linkedHashMap) {
        this.mTaskMap = null;
        this.mContext = null;
        this.mContext = context.getApplicationContext();
        this.mTaskMap = linkedHashMap;
    }

    public static synchronized SendLocationVehicleConnectDetectionManager getInstance(Context context, LinkedHashMap<String, SendLocationTask> linkedHashMap) {
        SendLocationVehicleConnectDetectionManager sendLocationVehicleConnectDetectionManager;
        synchronized (SendLocationVehicleConnectDetectionManager.class) {
            if (instance == null) {
                SendLocationVehicleConnectDetectionManager sendLocationVehicleConnectDetectionManager2 = new SendLocationVehicleConnectDetectionManager(context, linkedHashMap);
                instance = sendLocationVehicleConnectDetectionManager2;
                sendLocationVehicleConnectDetectionManager2.initialize();
            }
            sendLocationVehicleConnectDetectionManager = instance;
        }
        return sendLocationVehicleConnectDetectionManager;
    }

    public static void ClearSingletonInstance() {
        SendLocationVehicleConnectDetectionManager sendLocationVehicleConnectDetectionManager = instance;
        if (sendLocationVehicleConnectDetectionManager != null) {
            sendLocationVehicleConnectDetectionManager.Destroy();
        }
        instance = null;
    }

    private void Destroy() {
        BluetoothAdapter bluetoothAdapter = this.mBtWatcherAdapter;
        if (bluetoothAdapter != null) {
            bluetoothAdapter.closeProfileProxy(2, this.mBtWatcherProfile);
            this.mBtWatcherAdapter = null;
        }
        HandlerThread handlerThread = this.mBtWatcherPollingThread;
        if (handlerThread != null && handlerThread.isAlive()) {
            this.mBtWatcherPollingThread.quit();
            this.mBtWatcherPollingThread = null;
        }
        HandlerThread handlerThread2 = this.mWaitingChangedBtListThread;
        if (handlerThread2 == null || !handlerThread2.isAlive()) {
            return;
        }
        this.mWaitingChangedBtListThread.quit();
        this.mWaitingChangedBtListThread = null;
    }

    private void initialize() {
        settingBtWatcherPolling();
    }

    private Context getContext() {
        return this.mContext;
    }

    public void setIsConnectedSpp(boolean z) {
        this.mIsConnectedSpp = z;
    }

    private boolean getIsConnectedSpp() {
        return this.mIsConnectedSpp;
    }

    public String getConnectedVehicleMacAddress() {
        String str;
        synchronized (sConnectedVehicleMacAddressLockObject) {
            str = this.mConnectedVehicleMacAddress;
        }
        return str;
    }

    public void updateCurrentVehicleMacAddress(final boolean z, final Runnable runnable, final Looper looper) {
        if (this.mWaitingChangedBtListThread == null) {
            this.mWaitingChangedBtListThread = new HandlerThread("waitingChangedBtListThread");
        }
        final Looper myLooper = Looper.myLooper();
        final Runnable runnable2 = new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.1
            @Override // java.lang.Runnable
            public void run() {
                if (SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread != null && SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread.isAlive()) {
                    SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread.quit();
                    SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread = null;
                }
                if (runnable != null) {
                    Looper looper2 = looper;
                    if (looper2 == null) {
                        looper2 = myLooper;
                    }
                    new Handler(looper2).post(new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.1.1
                        @Override // java.lang.Runnable
                        public void run() {
                            runnable.run();
                        }
                    });
                }
            }
        };
        if (getIsConnectedSpp() ? this.mBtWatcherProfile == null : true) {
            synchronized (sConnectedVehicleMacAddressLockObject) {
                this.mConnectedVehicleMacAddress = "";
            }
            if (z) {
                return;
            }
            runnable2.run();
            return;
        }
        final String connectedVehicleMacAddress = getConnectedVehicleMacAddress();
        final Runnable runnable3 = new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.2
            @Override // java.lang.Runnable
            public void run() {
                List<BluetoothDevice> connectedDevices = SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile != null ? SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile.getConnectedDevices() : null;
                synchronized (SendLocationVehicleConnectDetectionManager.sConnectedVehicleMacAddressLockObject) {
                    if (connectedDevices != null) {
                        if (connectedDevices.size() > 0) {
                            Iterator<BluetoothDevice> it = connectedDevices.iterator();
                            if (it.hasNext()) {
                                SendLocationVehicleConnectDetectionManager.this.mConnectedVehicleMacAddress = it.next().getAddress();
                            }
                        }
                    }
                    SendLocationVehicleConnectDetectionManager.this.mConnectedVehicleMacAddress = "";
                }
                LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "updateCurrentVehicleMacAddress MAC Address =" + SendLocationVehicleConnectDetectionManager.this.mConnectedVehicleMacAddress);
            }
        };
        new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.3
            private int mCount = 0;
            private Handler handler = null;

            @Override // java.lang.Runnable
            public void run() {
                if (!SendLocationService.isRunningService()) {
                    LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "updateCurrentVehicleMacAddress updateProc stop");
                    return;
                }
                runnable3.run();
                if (z) {
                    return;
                }
                if (this.mCount >= 5) {
                    runnable2.run();
                } else if (TextUtils.equals(connectedVehicleMacAddress, SendLocationVehicleConnectDetectionManager.this.getConnectedVehicleMacAddress())) {
                    if (SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread != null) {
                        if (!SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread.isAlive()) {
                            SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread.start();
                        }
                        if (this.handler == null) {
                            this.handler = new Handler(SendLocationVehicleConnectDetectionManager.this.mWaitingChangedBtListThread.getLooper());
                        }
                        this.mCount++;
                        this.handler.postDelayed(this, SendLocationVehicleConnectDetectionManager.BT_WAITING_CHANGED_INTERVAL);
                        LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "updateCurrentVehicleMacAddress Waiting Changed Count =" + String.valueOf(this.mCount));
                    }
                } else {
                    runnable2.run();
                }
            }
        }.run();
    }

    public void notifyVehicleConnectionTaskEvent(String str, boolean z, boolean z2) {
        boolean equals;
        synchronized (this.mTaskMap) {
            for (String str2 : this.mTaskMap.keySet()) {
                SendLocationTask sendLocationTask = this.mTaskMap.get(str2);
                if (TextUtils.isEmpty(str)) {
                    equals = TextUtils.isEmpty(sendLocationTask.getVehicleMacAddress());
                } else {
                    equals = TextUtils.equals(sendLocationTask.getVehicleMacAddress(), str);
                }
                if ((z2 && equals) || (!z2 && !equals)) {
                    sendLocationTask.noticeEvent(z ? SendLocationTask.EventTiming.VehicleConnected : SendLocationTask.EventTiming.VehicleDisConnected);
                }
            }
        }
    }

    public ArrayList<String> getOtherVehicleTaskID(String str) {
        ArrayList<String> arrayList = new ArrayList<>();
        if (TextUtils.isEmpty(str)) {
            return arrayList;
        }
        synchronized (this.mTaskMap) {
            for (String str2 : this.mTaskMap.keySet()) {
                SendLocationTask sendLocationTask = this.mTaskMap.get(str2);
                if (!TextUtils.isEmpty(sendLocationTask.getVehicleMacAddress()) && !TextUtils.equals(sendLocationTask.getVehicleMacAddress(), str)) {
                    arrayList.add(sendLocationTask.getTaskID());
                }
            }
        }
        return arrayList;
    }

    public void settingMacAddressNotSetTask(String str) {
        synchronized (this.mTaskMap) {
            for (String str2 : this.mTaskMap.keySet()) {
                SendLocationTask sendLocationTask = this.mTaskMap.get(str2);
                if (TextUtils.isEmpty(sendLocationTask.getVehicleMacAddress())) {
                    sendLocationTask.setVehicleMacAddress(str);
                }
            }
        }
    }

    private void settingBtWatcherPolling() {
        if (this.mBtWatcherAdapter == null) {
            this.mBtWatcherAdapter = BluetoothAdapter.getDefaultAdapter();
        }
        if (this.mBtWatcherPollingThread == null) {
            this.mBtWatcherPollingThread = new HandlerThread("btWatcherPollingThread");
        }
        this.mBtWatcherAdapter.getProfileProxy(getContext(), new BluetoothProfile.ServiceListener() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.4
            @Override // android.bluetooth.BluetoothProfile.ServiceListener
            public void onServiceDisconnected(int i) {
                if (i == 2) {
                    LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "Bluetooth A2DP ServiceDisconnected");
                    SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile = null;
                    if (SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler != null) {
                        SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler.removeCallbacksAndMessages(null);
                        SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler = null;
                    }
                    SendLocationVehicleConnectDetectionManager.this.updateMacAddressList(null, new ArrayList(), new ArrayList());
                    List<String> taskMacAddressList = SendLocationVehicleConnectDetectionManager.this.getTaskMacAddressList();
                    if (taskMacAddressList.size() > 0) {
                        for (String str : taskMacAddressList) {
                            SendLocationVehicleConnectDetectionManager.this.notifyVehicleConnectionTaskEvent(str, false, true);
                        }
                    }
                    SendLocationVehicleConnectDetectionManager.this.updateCurrentVehicleMacAddress(true, null, null);
                }
            }

            @Override // android.bluetooth.BluetoothProfile.ServiceListener
            public void onServiceConnected(int i, BluetoothProfile bluetoothProfile) {
                boolean z = SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile == null;
                if (i == 2) {
                    LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "Bluetooth A2DP ServiceConnected");
                    SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile = bluetoothProfile;
                    if (z) {
                        SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingRunnable = new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationVehicleConnectDetectionManager.4.1
                            @Override // java.lang.Runnable
                            public void run() {
                                if (SendLocationService.isRunningService()) {
                                    List<BluetoothDevice> connectedDevices = SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile != null ? SendLocationVehicleConnectDetectionManager.this.mBtWatcherProfile.getConnectedDevices() : null;
                                    ArrayList<String> arrayList = new ArrayList();
                                    ArrayList<String> arrayList2 = new ArrayList();
                                    SendLocationVehicleConnectDetectionManager.this.updateMacAddressList(connectedDevices, arrayList, arrayList2);
                                    if (arrayList.size() > 0) {
                                        for (String str : arrayList) {
                                            SendLocationVehicleConnectDetectionManager.this.notifyVehicleConnectionTaskEvent(str, true, true);
                                        }
                                    }
                                    if (arrayList2.size() > 0) {
                                        for (String str2 : arrayList2) {
                                            SendLocationVehicleConnectDetectionManager.this.notifyVehicleConnectionTaskEvent(str2, false, true);
                                        }
                                    }
                                    SendLocationVehicleConnectDetectionManager.this.updateCurrentVehicleMacAddress(true, null, null);
                                    if (SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler != null) {
                                        SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler.postDelayed(this, 5000L);
                                        return;
                                    }
                                    return;
                                }
                                LogWrapper.d(SendLocationVehicleConnectDetectionManager.TAG, "BtWatcherPolling stop");
                            }
                        };
                        if (SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingThread != null) {
                            if (!SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingThread.isAlive()) {
                                SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingThread.start();
                            }
                            if (SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler == null) {
                                SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler = new Handler(SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingThread.getLooper());
                            }
                            SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingHandler.post(SendLocationVehicleConnectDetectionManager.this.mBtWatcherPollingRunnable);
                        }
                    }
                }
            }
        }, 2);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateMacAddressList(List<BluetoothDevice> list, List<String> list2, List<String> list3) {
        boolean z;
        list2.clear();
        list3.clear();
        synchronized (this.mConnectedMacAddressList) {
            if (list == null) {
                LogWrapper.d(TAG, "updateMacAddressList:disconnected all");
                for (String str : this.mConnectedMacAddressList) {
                    list3.add(str);
                }
                this.mConnectedMacAddressList.clear();
                return;
            }
            ArrayList<String> arrayList = new ArrayList();
            for (BluetoothDevice bluetoothDevice : list) {
                LogWrapper.d(TAG, "updateMacAddressList:connecting MAC Address =" + bluetoothDevice.getAddress());
                arrayList.add(bluetoothDevice.getAddress());
            }
            Iterator<String> it = this.mConnectedMacAddressList.iterator();
            while (true) {
                boolean z2 = true;
                if (!it.hasNext()) {
                    break;
                }
                String next = it.next();
                Iterator it2 = arrayList.iterator();
                while (true) {
                    if (it2.hasNext()) {
                        if (TextUtils.equals(next, (String) it2.next())) {
                            break;
                        }
                    } else {
                        z2 = false;
                        break;
                    }
                }
                if (!z2) {
                    LogWrapper.d(TAG, "updateMacAddressList:disconnected MAC Address =" + next);
                    list3.add(next);
                }
            }
            for (String str2 : arrayList) {
                Iterator<String> it3 = this.mConnectedMacAddressList.iterator();
                while (true) {
                    if (it3.hasNext()) {
                        if (TextUtils.equals(str2, it3.next())) {
                            z = true;
                            break;
                        }
                    } else {
                        z = false;
                        break;
                    }
                }
                if (!z) {
                    LogWrapper.d(TAG, "updateMacAddressList:connected MAC Address =" + str2);
                    list2.add(str2);
                }
            }
            this.mConnectedMacAddressList.clear();
            for (String str3 : arrayList) {
                this.mConnectedMacAddressList.add(str3);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public List<String> getTaskMacAddressList() {
        ArrayList arrayList = new ArrayList();
        synchronized (this.mTaskMap) {
            for (String str : this.mTaskMap.keySet()) {
                String vehicleMacAddress = this.mTaskMap.get(str).getVehicleMacAddress();
                if (!TextUtils.isEmpty(vehicleMacAddress)) {
                    boolean z = false;
                    Iterator it = arrayList.iterator();
                    while (true) {
                        if (it.hasNext()) {
                            if (TextUtils.equals((String) it.next(), vehicleMacAddress)) {
                                z = true;
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    if (!z) {
                        arrayList.add(vehicleMacAddress);
                    }
                }
            }
        }
        return arrayList;
    }
}
