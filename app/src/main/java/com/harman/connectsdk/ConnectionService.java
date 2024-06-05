package com.harman.connectsdk;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.harman.connectsdk.bt.BTConnectionReceiver;
import com.harman.connectsdk.bt.BluetoothUtils;
import com.harman.connectsdk.utils.ServiceGlobals;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

/* loaded from: classes.dex */
public class ConnectionService extends Service {
    private static final int BT_CONNECT = 1;
    private static final int FAILED = 2;
    private static final String NOTIFICATION_APP_TITLE = "Map update via mobile is running";
    private static final String NOTIFICATION_CHANNEL_ID = "MOTA_NOTIFICATION";
    private static final int NOTIFICATION_ID = 123;
    private static final String TAG = "ConnectionService";
    public static boolean bConnectionStarted = false;
    private static String connect_sdk_bt_service_name = "connect-sdk-spp-link";
    private static int startIdx;
    private BluetoothAdapter mBluetoothAdapter;
    IHACServiceManagerCallback mCallBack;
    private ServiceHandler mServiceHandler;
    private Looper mServiceLooper;
    static byte[] mInputBuffer = new byte[65536];
    static byte[] mOutputBuffer = new byte[65536];
    private static Object semWriteObject = new Object();
    private static UUID connect_sdk_uuid = UUID.fromString("0460e25a-026e-11e7-93ae-92361f002671");
    private final MessageHandler mFailedResponseHandler = new MessageHandler();
    private final Object serviceSemaphore = new Object();
    BluetoothSocket mBluetoothSocket = null;
    private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() { // from class: com.harman.connectsdk.ConnectionService.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if ("android.hardware.usb.action.USB_ACCESSORY_DETACHED".equals(intent.getAction())) {
                if (ConnectionService.this.mCallBack != null) {
                    ConnectionService.this.mCallBack.didAccessoryDisconnect();
                }
                ConnectionService connectionService = ConnectionService.this;
                connectionService.unregisterReceiver(connectionService.mUsbReceiver);
            }
        }
    };
    private boolean isAppInitialized = false;
    private BluetoothServerSocket mServerSocket = null;
    private LocalBinder mBinder = new LocalBinder();
    InputStream mBTInputStream = null;
    OutputStream mBTOutputStream = null;

    public boolean isAppInitialized() {
        return this.isAppInitialized;
    }

    public void setAppInitialized(boolean z) {
        this.isAppInitialized = z;
    }

    @Override // android.app.Service
    public void onCreate() {
        String str = TAG;
        Log.i(str, "ConnectionService onCreate");
        BluetoothUtils.printLogs(str, "Connection service created");
        HandlerThread handlerThread = new HandlerThread("ConnectionServiceStartArguments");
        handlerThread.start();
        this.mServiceLooper = handlerThread.getLooper();
        this.mServiceHandler = new ServiceHandler(this.mServiceLooper);
        createNotification();
    }

    public void registerCallback(IHACServiceManagerCallback iHACServiceManagerCallback) {
        if (iHACServiceManagerCallback != null) {
            this.mCallBack = iHACServiceManagerCallback;
        }
    }

    public InputStream getBTInputStream() {
        return this.mBTInputStream;
    }

    public void setBTInputStream(InputStream inputStream) {
        this.mBTInputStream = inputStream;
    }

    public OutputStream getBTOutputStream() {
        return this.mBTOutputStream;
    }

    public void setBTOutputStream(OutputStream outputStream) {
        this.mBTOutputStream = outputStream;
    }

    @Override // android.app.Service
    public int onStartCommand(Intent intent, int i, int i2) {
        String str = TAG;
        Log.i(str, "onStartCommand called");
        if (intent == null) {
            return Service.START_STICKY;
        }
        Log.i(str, "onStartCommand intent!= null");
        BluetoothUtils.printLogs(str, "onStartCommand");
        if (intent.getBooleanExtra("ACL_CONNECTED", false)) {
            Log.i(str, "onStartCommand ACL_CONNECTED");
            if (BluetoothUtils.isBluetoothEnabled()) {
                Log.i(str, "onStartCommand ACL_CONNECTED isBluetoothEnabled() ");
                bConnectionStarted = false;
                StartConnection();
                return Service.START_STICKY;
            }
            Log.i(str, "BT not enabled or connected");
            return Service.START_STICKY;
        }
        if (intent.getBooleanExtra("BT_ON", false)) {
            Log.i(str, "onStartCommand BT_ON Close Connection");
            StartConnection();
            return Service.START_STICKY;
        }
        Log.i(str, "No Intent found ");
        return Service.START_STICKY;
    }

    private void createNotification() {
        Log.i(TAG, "createNotification");
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(new NotificationChannel(NOTIFICATION_CHANNEL_ID, NOTIFICATION_APP_TITLE, NotificationManager.IMPORTANCE_MIN));
                startForeground(NOTIFICATION_ID, new Notification.Builder(this, NOTIFICATION_CHANNEL_ID).build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void initConnectionService() {
        String str = TAG;
        Log.i(str, "initConnectionService");
        setAppInitialized(true);
        if (BluetoothUtils.isBluetoothEnabled()) {
            Log.i(str, "initConnectionService bluetooth enabled. So start the connection ");
            bConnectionStarted = false;
            StartConnection();
            return;
        }
        Log.i(str, "initConnectionService:BT not enabled or connected");
    }

    private void StartConnection() {
        try {
            String str = TAG;
            Log.i(str, "starting Connection");
            BluetoothUtils.printLogs(str, "starting Connection");
            if (isAppInitialized()) {
                synchronized (this.serviceSemaphore) {
                    Log.i(str, "Connection Status status ---> " + bConnectionStarted);
                    if (!bConnectionStarted && (this.mServerSocket == null || this.mBluetoothSocket == null)) {
                        BluetoothServerSocket bluetoothServerSocket = null;
                        this.mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
                        try {
                            Log.i(str, "Started listening for Connection");
                            BluetoothUtils.printLogs(str, "Started listening for Connection");
                            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                                // TODO: Consider calling
                                //    ActivityCompat#requestPermissions
                                // here to request the missing permissions, and then overriding
                                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                                //                                          int[] grantResults)
                                // to handle the case where the user grants the permission. See the documentation
                                // for ActivityCompat#requestPermissions for more details.
                                return;
                            }
                            bluetoothServerSocket = this.mBluetoothAdapter.listenUsingRfcommWithServiceRecord(connect_sdk_bt_service_name, connect_sdk_uuid);
                        } catch (Exception unused) {
                            Log.e(TAG, "listenUsingRfcommWithServiceRecord got failed ");
                        }
                        this.mServerSocket = bluetoothServerSocket;
                        if (bluetoothServerSocket != null) {
                            String str2 = TAG;
                            Log.i(str2, "mServerSocket != null start send message to mServiceHandler");
                            bConnectionStarted = true;
                            Message obtainMessage = this.mServiceHandler.obtainMessage();
                            obtainMessage.what = 1;
                            this.mServiceHandler.sendMessage(obtainMessage);
                            BluetoothUtils.printLogs(str2, "After send the message to handler");
                            Log.i(str2, "After send the message to handler");
                        } else {
                            Log.i(TAG, "startConnection() mServerSocket == null restarting the connection");
                            RestartConnection();
                        }
                    } else {
                        Log.i(str, "Connection Already Accepted or waiting to accept---> isBTEnabled [ " + BluetoothUtils.isBluetoothEnabled() + " ] bConnectionStarted [ " + bConnectionStarted + " ] mServerSocket [ " + this.mServerSocket + " ] isAppInitialized [ " + isAppInitialized() + " ] mBluetoothSocket [" + this.mBluetoothSocket + "]");
                    }
                }
                return;
            }
            Log.i(str, "App is not initialized. So it will wait until app is initialized");
        } catch (Exception e) {
            Log.e(TAG, "Exception in Start Connection-->", e);
            RestartConnection();
        }
    }

    public synchronized void closeConnection() {
        String str = TAG;
        Log.i(str, "closeConnection");
        bConnectionStarted = false;
        this.mServiceHandler.removeCallbacksAndMessages(null);
        try {
            if (getBTInputStream() != null) {
                getBTInputStream().close();
                setBTInputStream(null);
                Log.i(str, "closeConnection mInputStream closed successfully.");
            }
            if (getBTOutputStream() != null) {
                getBTOutputStream().close();
                setBTOutputStream(null);
                Log.i(str, "closeConnection mOutputStream closed successfully.");
            }
            BluetoothServerSocket bluetoothServerSocket = this.mServerSocket;
            if (bluetoothServerSocket != null) {
                bluetoothServerSocket.close();
                this.mServerSocket = null;
                Log.i(str, "closeConnection mServerSocket closed successfully.");
            }
            BluetoothSocket bluetoothSocket = this.mBluetoothSocket;
            if (bluetoothSocket != null) {
                bluetoothSocket.close();
                this.mBluetoothSocket = null;
                Log.i(str, "closeConnection mBluetoothSocket closed successfully.");
            }
            if (BluetoothUtils.isBluetoothEnabled()) {
                Log.i(str, "closeConnection bluetooth enabled. So start the connection ");
                bConnectionStarted = false;
                StartConnection();
            } else {
                Log.i(str, "closeConnection:BT not enabled or connected");
            }
        } catch (IOException e) {
            Log.e(TAG, "closeConnection IOException --->", e);
            bConnectionStarted = false;
        } catch (Exception e2) {
            Log.e(TAG, "closeConnection Exception --->", e2);
            bConnectionStarted = false;
        }
    }

    public void RestartConnection() {
        try {
            String str = TAG;
            Log.i(str, "RestartConnection Called");
            if (BluetoothUtils.isBluetoothEnabled()) {
                Log.i(str, "RestartConnection - Bluetooth is enabled, so starting the connection.");
                bConnectionStarted = false;
                StartConnection();
            } else {
                Log.i(str, "RestartConnection - Bluetooth is Disabled.");
                closeConnection();
            }
        } catch (Exception e) {
            Log.e(TAG, "RestartConnection - Exception in  RestartConnection--->", e);
            closeConnection();
        }
    }

    private void startForegroundMode() {
        Log.d(TAG, "startForegroundMode");
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                createNotification();
            } else {
                Notification.Builder builder = new Notification.Builder(this);
                if (Build.VERSION.SDK_INT >= 16) {
                    startForeground(NOTIFICATION_ID, builder.build());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void stopForegroundMode() {
        Log.d(TAG, "stopForegroundMode");
        try {
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).cancel(NOTIFICATION_ID);
            stopForeground(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setUsbIOStreams(InputStream inputStream, OutputStream outputStream) {
        if (this.mCallBack != null) {
            read(inputStream);
        }
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return this.mBinder;
    }

    public void write(final byte[] bArr) {
        if (this.mBTOutputStream != null) {
            new Thread(new Runnable() { // from class: com.harman.connectsdk.ConnectionService.2
                @Override // java.lang.Runnable
                public void run() {
                    try {
                        ConnectionService.this.writeToHTM(bArr);
                    } catch (Exception e) {
                        e.getMessage();
                    }
                }
            }).start();
        }
    }

    protected void onDisconnect() {
        Log.i(TAG, "onDisconnect");
        BTConnectionReceiver.connectedDeviceName = null;
        HACServiceManager.getInstance().notifyDisconnectionToService();
        ServiceGlobals.Instance.setAhaAppServiceRunning(false);
        IHACServiceManagerCallback iHACServiceManagerCallback = this.mCallBack;
        if (iHACServiceManagerCallback != null) {
            iHACServiceManagerCallback.didAccessoryDisconnect();
        }
    }

    public void writeToHTM(byte[] bArr) {
        int i;
        try {
            String str = TAG;
            Log.i(str, "writeToHTM Called--->" + bArr);
            synchronized (semWriteObject) {
                int length = bArr.length;
                Log.i(str, "writeToHTM inside synchronised method");
                if (bArr != null) {
                    Log.i(str, "writeToHTM resp != null-->" + bArr);
                    i = bArr.length;
                    Log.i(str, "resp length-->" + i);
                } else {
                    i = 0;
                }
                int i2 = -1;
                if (i > length) {
                    Log.i(str, "writeToHTM respLen  " + i);
                    for (int i3 = 0; i3 < i; i3 += length) {
                        String str2 = TAG;
                        Log.i(str2, "idx is < respLen:::::::::::idx[" + i3 + "]");
                        int i4 = i - i3;
                        if (i4 >= length) {
                            i4 = length;
                        }
                        Log.i(str2, "maxIdx::::::::[" + i4 + "]");
                        byte[] bArr2 = new byte[i4];
                        System.arraycopy(bArr, i3, bArr2, 0, i4);
                        Log.i(str2, "Before calling writtenBytes sendToChannel");
                        i2 = sendToChannel(bArr2);
                    }
                } else {
                    Log.i(str, "writeToHTM respLen <= 512----->" + i);
                    i2 = sendToChannel(bArr);
                }
                String str3 = TAG;
                Log.i(str3, "written bytes value======>" + i2);
                Log.i(str3, "AppGlobals.Instance.isAhaAppServiceRunning() ::" + ServiceGlobals.Instance.isAhaAppServiceRunning());
                if (i2 < 0 && ServiceGlobals.Instance.isAhaAppServiceRunning()) {
                    Log.e(str3, "Bluetooth Write Failure - disconnecting BT connection and resetting");
                    onDisconnect();
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception in writeToHTM method--->", e);
            onDisconnect();
        }
    }

    public int sendToChannel(byte[] bArr) {
        Log.i(TAG, "calling link.write()");
        return write(bArr, bArr.length);
    }

    public int write(byte[] bArr, int i) {
        String str = TAG;
        Log.i(str, "Write called");
        if (getBTOutputStream() != null) {
            try {
                Log.i("Inside", "Srite Method----->" + i);
                Log.i(str, " Write (" + i + " bytes) >>>" + Utility.hexString(bArr));
                getBTOutputStream().write(bArr, 0, i);
                Log.i(str, "Write () Finished");
                getBTOutputStream().flush();
                return i;
            } catch (IOException e) {
                Log.e(TAG, "write", e);
            }
        } else {
            Log.i(str, "BTLINK write() BPService.sBpConnectionState != BPService.BP_CONNECTION_STATE_CONNECTION_UP");
        }
        return -1;
    }

    public void read(final InputStream inputStream) {
        new Thread(new Runnable() { // from class: com.harman.connectsdk.ConnectionService.3
            @Override // java.lang.Runnable
            public void run() {
                while (!Thread.interrupted()) {
                    try {
                        if (inputStream.read(ConnectionService.mInputBuffer) > 0 && ConnectionService.mOutputBuffer[0] != 0 && ConnectionService.this.mBTOutputStream != null) {
                            ConnectionService.this.mBTOutputStream.write(ConnectionService.mOutputBuffer);
                        }
                    } catch (Exception e) {
                        e.getMessage();
                    }
                }
            }
        }).start();
    }

    public void registerReceiver() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.hardware.usb.action.USB_ACCESSORY_DETACHED");
        registerReceiver(this.mUsbReceiver, intentFilter);
    }

    public int read(byte[] bArr, int i, int i2) {
        String str = TAG;
        Log.i(str, "read called");
        int i3 = -1;
        if (getBTInputStream() == null) {
            return -1;
        }
        try {
            Log.i(str, "Inside Read method null != this.mInputStream ========================>" + getBTInputStream());
            long currentTimeMillis = System.currentTimeMillis();
            Log.i(str, "BTLINK Before Read buff.length = " + bArr.length + ", offset = " + i + ", size = " + i2);
            i3 = getBTInputStream().read(bArr, i, i2);
            Log.i(str, "BTLINK read (" + i3 + " bytes), elapsed time = " + (System.currentTimeMillis() - currentTimeMillis) + " >>>" + Utility.hexString(bArr));
            return i3;
        } catch (Exception e) {
            Log.e(TAG, "Exception in bytesRead = " + i3, e);
            return i3;
        }
    }

    public int read(byte[] bArr, int i) {
        Log.i(TAG, "read called");
        return read(bArr, 0, i);
    }

    public void startReaderThread() {
        Log.i(TAG, "startReaderThread Called");
        try {
            startForegroundMode();
            new Thread(new DataReaderRunnable()).start();
        } catch (Exception e) {
            Log.e(TAG, "Exception in startReaderThread--->", e);
            bConnectionStarted = false;
        }
    }

    public void sendMsg(int i) {
        try {
            Log.i(TAG, "sendMsg called");
            Message obtain = Message.obtain();
            obtain.arg1 = i;
            obtain.setTarget(this.mFailedResponseHandler);
            obtain.sendToTarget();
        } catch (Exception e) {
            Log.e(TAG, "sendMsg exception occured--->", e);
        }
    }

    /* loaded from: classes.dex */
    public static class BlueToothFailureException extends Exception {
        BlueToothFailureException(String str) {
            super(str);
            Log.e(ConnectionService.TAG, "BlueToothFailureException " + str);
            ConnectionService.bConnectionStarted = false;
        }
    }

    /* loaded from: classes.dex */
    private class MessageHandler extends Handler {
        private MessageHandler() {
        }

        @Override // android.os.Handler
        public void handleMessage(Message message) {
            if (message.arg1 != 2) {
                return;
            }
            Log.i(ConnectionService.TAG, "Invalid Data received or Processing failed");
            ConnectionService.this.writeToHTM(new byte[1]);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public final class ServiceHandler extends Handler {
        private final Object thSemaphore;

        public ServiceHandler(Looper looper) {
            super(looper);
            this.thSemaphore = new Object();
            Log.i(ConnectionService.TAG, "ServiceHandler Constructor invoked");
        }

        @Override // android.os.Handler
        public void handleMessage(Message message) {
            synchronized (this.thSemaphore) {
                if (message.what == 1) {
                    try {
                        if (ConnectionService.this.mServerSocket != null) {
                            Log.i(ConnectionService.TAG, "Before mServerSocket the connection--->" + ConnectionService.this.mServerSocket);
                            BluetoothUtils.printLogs(ConnectionService.TAG, "Before mServerSocket the connection--->");
                            ConnectionService connectionService = ConnectionService.this;
                            connectionService.mBluetoothSocket = connectionService.mServerSocket.accept();
                            Log.i(ConnectionService.TAG, "After Accept mServerSocket connection---->" + ConnectionService.this.mBluetoothSocket);
                            BluetoothUtils.printLogs(ConnectionService.TAG, "After Accept mServerSocket connection");
                        } else {
                            Log.i(ConnectionService.TAG, "mServerSocket is null so not able to accept");
                        }
                    } catch (Exception e) {
                        Log.e(ConnectionService.TAG, "Exception in accept thread--->", e);
                        ConnectionService.this.RestartConnection();
                    }
                    if (ConnectionService.this.mBluetoothSocket != null) {
                        Log.i(ConnectionService.TAG, "handleMessage Connection Accepted Successfully");
                        try {
                            Log.i(ConnectionService.TAG, "Getting input and output stream");
                            if (ConnectionService.this.mBluetoothSocket != null) {
                                ConnectionService connectionService2 = ConnectionService.this;
                                connectionService2.setBTInputStream(connectionService2.mBluetoothSocket.getInputStream());
                                ConnectionService connectionService3 = ConnectionService.this;
                                connectionService3.setBTOutputStream(connectionService3.mBluetoothSocket.getOutputStream());
                            }
                        } catch (IOException e2) {
                            ConnectionService.this.RestartConnection();
                            Log.e(ConnectionService.TAG, "handleMessage socket != null Exception--->", e2);
                        }
                        try {
                            Log.i(ConnectionService.TAG, "handleMessage Calling Reader Thread");
                            ConnectionService.this.startReaderThread();
                            if (ConnectionService.this.mServerSocket != null) {
                                ConnectionService.this.mServerSocket.close();
                                ConnectionService.this.mServerSocket = null;
                            }
                            Log.i(ConnectionService.TAG, "After Closed server socket");
                        } catch (IOException e3) {
                            ConnectionService.this.RestartConnection();
                            Log.e(ConnectionService.TAG, "handleMessage Exception----->", e3);
                        }
                    } else {
                        Log.i(ConnectionService.TAG, "handleMessage Socket is null. Restart the connection");
                        ConnectionService.this.RestartConnection();
                        Log.i(ConnectionService.TAG, "handleMessage Exiting Accept thread---->");
                    }
                }
            }
        }
    }

    /* loaded from: classes.dex */
    public class DataReaderRunnable implements Runnable {
        private static final int AHA_CONNECT_HEADER_LENGTH = 10;
        private static final int AHA_CONNECT_LENGTH_START_INDEX = 2;
        private static final int AHA_CONNECT_MAX_PACKET_LENGTH = 65536;
        private static final int READ_TIMEOUT = 1000;
        final boolean is3_8 = true;
        private final byte[] mHeader = new byte[10];
        private final byte[] mTwoByteBuffer = new byte[2];
        private final byte[] mTwoByteLengthBuffer = new byte[2];

        public DataReaderRunnable() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Log.i(ConnectionService.TAG, "++++++++++++++++DataReaderRunnable run enter++++++++++++++++");
            Log.i(ConnectionService.TAG, "DataReaderRunnable run method called");
            while (true) {
                try {
                    ServiceGlobals.Instance.setAhaAppServiceRunning(true);
                    Log.i(ConnectionService.TAG, "Before calling read packet");
                    byte[] readPacket = readPacket();
                    if (readPacket != null) {
                        Log.i(ConnectionService.TAG, "Data Reader Runnable: Before Call loadMsg -->" + readPacket);
                        loadMsg(readPacket);
                    }
                } catch (BlueToothFailureException e) {
                    Log.e(ConnectionService.TAG, "Connection Closed BlueToothFailureException on DataReaderRunnable Thread Run method---->" + e);
                    ConnectionService.this.closeConnection();
                    ConnectionService.this.onDisconnect();
                    Log.i(ConnectionService.TAG, "===================================== DataReaderRunnable run leave ================================== ");
                    return;
                }
            }
        }

        public void loadMsg(byte[] bArr) {
            Log.i(ConnectionService.TAG, "Inside loadMsg called");
            BluetoothUtils.printLogs(ConnectionService.TAG, "Inside loadMsg called");
            if (Utility.isResponse(bArr)) {
                Log.i(ConnectionService.TAG, "Packet is a response");
                return;
            }
            if (!Utility.validateCommand(bArr)) {
                Log.i(ConnectionService.TAG, ">>>" + Utility.hexString(bArr));
                Log.e(ConnectionService.TAG, "Invalid Data received 1");
                return;
            }
            int unused = ConnectionService.startIdx = 0;
            if (bArr[ConnectionService.startIdx] == -74 && bArr[ConnectionService.startIdx + 1] == -74) {
                ConnectionService.startIdx += 2;
                short shortValue = ((Short) Utility.getIntVal(bArr, ConnectionService.startIdx, 2)).shortValue();
                Log.i(ConnectionService.TAG, "Received packet length from buffer: " + ((int) shortValue));
                Log.i(ConnectionService.TAG, "Calculated packet length of the buffer: " + bArr.length);
                Log.i(ConnectionService.TAG, "Raw Packet: >>>>" + Utility.hexString(bArr));
                int unused2 = ConnectionService.startIdx = ConnectionService.startIdx + 2;
                if (bArr[ConnectionService.startIdx] >= Byte.MIN_VALUE) {
                    Log.i(ConnectionService.TAG, "Inside dataPackt[startIdx] >= (byte) 0x80");
                    int id = Utility.getId(bArr, ConnectionService.startIdx);
                    ConnectionService.startIdx += 2;
                    short shortValue2 = ((Short) Utility.getIntVal(bArr, ConnectionService.startIdx, 2)).shortValue();
                    ConnectionService.startIdx += 2;
                    if (Utility.validChecksum(bArr, shortValue, Utility.extractChar(bArr, ConnectionService.startIdx))) {
                        Log.d(ConnectionService.TAG, "App Initialization Status::" + ConnectionService.this.isAppInitialized());
                        BluetoothUtils.printLogs(ConnectionService.TAG, "App Initialization Status::");
                        if (!ConnectionService.this.isAppInitialized()) {
                            BluetoothUtils.printLogs(ConnectionService.TAG, "Opcode==" + ((int) shortValue2) + "  Request id ==" + id);
                            BluetoothUtils.printLogs(ConnectionService.TAG, "App is not initialized.");
                            return;
                        }
                        HACServiceManager.getInstance().loadMessage(shortValue2, bArr, id);
                    }
                }
            }
        }

        boolean readRemainder(byte[] bArr, int i, int i2) throws BlueToothFailureException {
            Log.i(ConnectionService.TAG, "ReadPacketRunnable.readRemainder buff.length = " + bArr.length + ", offset = " + i + ", size = " + i2);
            long currentTimeMillis = System.currentTimeMillis() + 1000;
            int i3 = 0;
            while (i3 < i2 && System.currentTimeMillis() < currentTimeMillis) {
                Log.i(ConnectionService.TAG, "readRemainder totalBytesRead < totalBytesToRead && System.currentTimeMillis() < timeoutTime");
                int read = ConnectionService.this.read(bArr, i, i2 - i3);
                Log.i(ConnectionService.TAG, "bytesRead--->" + read);
                if (read < 0) {
                    throw new BlueToothFailureException("bytes read");
                }
                i += read;
                i3 += read;
            }
            Log.i(ConnectionService.TAG, "totalBytesToRead=====>" + i2);
            return i3 == i2;
        }

        /* JADX WARN: Code restructure failed: missing block: B:8:0x0046, code lost:
        
            if ((-74) == r6[1]) goto L46;
         */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct code enable 'Show inconsistent code' option in preferences
        */
        boolean readUntilSod() throws com.harman.connectsdk.ConnectionService.BlueToothFailureException {
            /*
                Method dump skipped, instructions count: 334
                To view this dump change 'Code comments level' option to 'DEBUG'
            */
            throw new UnsupportedOperationException("Method not decompiled: com.harman.connectsdk.ConnectionService.DataReaderRunnable.readUntilSod():boolean");
        }

        int readPackLength() throws BlueToothFailureException {
            Log.i(ConnectionService.TAG, "readPackLength  ");
            int read = ConnectionService.this.read(this.mTwoByteLengthBuffer, 0, 1);
            if (1 == read) {
                Log.i(ConnectionService.TAG, "one byte only read");
                if (ConnectionService.this.read(this.mTwoByteLengthBuffer, 1, 1) != 1) {
                    Log.e(ConnectionService.TAG, "Unable to read data");
                    throw new BlueToothFailureException("2 != bytesRead");
                }
                return ((Integer) Utility.getUnSignedIntVal(this.mTwoByteLengthBuffer, 0, 2)).intValue();
            }
            Log.e(ConnectionService.TAG, "ReadPacketRunnable.run readPackLength bytesRead = " + read + ", disconnecting BT connection and resetting");
            throw new BlueToothFailureException("2 != bytesRead");
        }

        byte[] readPacket3_8() throws BlueToothFailureException {
            Log.i(ConnectionService.TAG, "readPacket3_8 .readPacket enter");
            byte[] bArr = null;
            if (readUntilSod()) {
                Log.i(ConnectionService.TAG, "readUntilSod executed ");
                int readPackLength = readPackLength();
                if (10 > readPackLength || readPackLength >= 65536) {
                    Log.e(ConnectionService.TAG, "ReadPacketRunnable.readPacket Got bad packetlen: " + readPackLength);
                } else {
                    byte[] bArr2 = new byte[readPackLength];
                    bArr2[0] = -74;
                    bArr2[1] = -74;
                    System.arraycopy(this.mTwoByteLengthBuffer, 0, bArr2, 2, 2);
                    int i = readPackLength - 4;
                    int read = ConnectionService.this.read(bArr2, 4, i);
                    if (read <= 0) {
                        Log.e(ConnectionService.TAG, "ReadPacketRunnable.readPacket bytesRead = " + read + ", disconnecting BT connection and resetting");
                        throw new BlueToothFailureException("byte read");
                    }
                    if (read != i) {
                        Log.e(ConnectionService.TAG, "ReadPacketRunnable.readPacket reading remainder; failed to read full body; expected " + i + ", only read " + read);
                        if (!readRemainder(bArr2, read + 4, i - read)) {
                            Log.e(ConnectionService.TAG, "ReadPacketRunnable.readPacket failed to read full body; expected " + i + ", only read " + read);
                        }
                    }
                    bArr = bArr2;
                }
            } else {
                Log.e(ConnectionService.TAG, "ReadPacketRunnable.readPacket didn't find sod");
            }
            Log.i(ConnectionService.TAG, "ReadPacketRunnable.readPacket leave===>" + bArr);
            return bArr;
        }

        byte[] readPacket() throws BlueToothFailureException {
            return readPacket3_8();
        }
    }

    /* loaded from: classes.dex */
    public class LocalBinder extends Binder {
        public LocalBinder() {
        }

        public ConnectionService getService() {
            return ConnectionService.this;
        }
    }
}
