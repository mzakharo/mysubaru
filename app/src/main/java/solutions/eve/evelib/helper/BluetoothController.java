package solutions.eve.evelib.helper;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothClass;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.CountDownTimer;
import android.util.Log;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public abstract class BluetoothController {
    private static final String TAG = "BluetoothController";
    private AudioManager mAudioManager;
    private Context mContext;
    private boolean mIsCountDownOn;
    public boolean mIsOnHeadsetSco;
    private boolean mIsStarted;
    private boolean mIsStarting;
    private BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() { // from class: solutions.eve.evelib.helper.BluetoothController.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals("android.bluetooth.device.action.ACL_CONNECTED")) {
                BluetoothDevice bluetoothDevice = (BluetoothDevice) intent.getParcelableExtra("android.bluetooth.device.extra.DEVICE");
                BluetoothClass bluetoothClass = bluetoothDevice.getBluetoothClass();
                if (bluetoothClass != null) {
                    Log.e("TAG", "DeviceClass:: " + bluetoothClass.getDeviceClass());
                }
                Log.e(BluetoothController.TAG, bluetoothDevice.getName() + " connected");
                return;
            }
            if (action.equals("android.bluetooth.device.action.ACL_DISCONNECTED")) {
                Log.e(BluetoothController.TAG, "Headset disconnected");
                if (BluetoothController.this.mIsCountDownOn) {
                    BluetoothController.this.mIsCountDownOn = false;
                    BluetoothController.this.mCountDown.cancel();
                }
                BluetoothController.this.mAudioManager.setMode(0);
                BluetoothController.this.onHeadsetDisconnected();
                return;
            }
            if (action.equals("android.media.SCO_AUDIO_STATE_CHANGED")) {
                int intExtra = intent.getIntExtra("android.media.extra.SCO_AUDIO_STATE", -1);
                if (intExtra != 1) {
                    if (intExtra != 0 || BluetoothController.this.mIsStarting) {
                        return;
                    }
                    BluetoothController.this.mIsOnHeadsetSco = false;
                    BluetoothController.this.mAudioManager.stopBluetoothSco();
                    BluetoothController.this.onScoAudioDisconnected();
                    return;
                }
                BluetoothController.this.mIsOnHeadsetSco = true;
                if (BluetoothController.this.mIsStarting) {
                    BluetoothController.this.mIsStarting = false;
                    BluetoothController.this.onHeadsetConnected();
                }
                if (BluetoothController.this.mIsCountDownOn) {
                    BluetoothController.this.mIsCountDownOn = false;
                    BluetoothController.this.mCountDown.cancel();
                }
                BluetoothController.this.onScoAudioConnected();
            }
        }
    };
    private CountDownTimer mCountDown = new CountDownTimer(10000, 1000) { // from class: solutions.eve.evelib.helper.BluetoothController.2
        @Override // android.os.CountDownTimer
        public void onTick(long j) {
            try {
                Log.d(BluetoothController.TAG, "\nonTick start bluetooth Sco");
                BluetoothController.this.mAudioManager.startBluetoothSco();
            } catch (Exception e) {
                Log.e(BluetoothController.TAG, "Fail", e);
            }
        }

        @Override // android.os.CountDownTimer
        public void onFinish() {
            BluetoothController.this.mIsCountDownOn = false;
            BluetoothController.this.mAudioManager.setMode(0);
            Log.d(BluetoothController.TAG, "\nonFinish fail to connect to headset audio");
        }
    };
    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

    public abstract void onHeadsetConnected();

    public abstract void onHeadsetDisconnected();

    public abstract void onScoAudioConnected();

    public abstract void onScoAudioDisconnected();

    public BluetoothController(Context context) {
        this.mContext = context;
        this.mAudioManager = (AudioManager) this.mContext.getSystemService("audio");
    }

    public boolean start() {
        if (!this.mIsStarted) {
            this.mIsStarted = true;
            this.mIsStarted = startBluetooth();
        }
        return this.mIsStarted;
    }

    public void stop() {
        if (this.mIsStarted) {
            this.mIsStarted = false;
            Logger.e("STOPPING BLUETOOTH: " + this.mIsStarted);
        }
        stopBluetooth();
    }

    public boolean isOnHeadsetSco() {
        return this.mIsOnHeadsetSco;
    }

    private boolean startBluetooth() {
        Log.d(TAG, "startBluetooth");
        if (this.mBluetoothAdapter == null || !this.mAudioManager.isBluetoothScoAvailableOffCall()) {
            return false;
        }
        this.mContext.registerReceiver(this.mBroadcastReceiver, new IntentFilter("android.bluetooth.device.action.ACL_CONNECTED"));
        this.mContext.registerReceiver(this.mBroadcastReceiver, new IntentFilter("android.bluetooth.device.action.ACL_DISCONNECTED"));
        this.mContext.registerReceiver(this.mBroadcastReceiver, new IntentFilter("android.media.SCO_AUDIO_STATE_CHANGED"));
        this.mAudioManager.setMode(2);
        this.mIsCountDownOn = true;
        this.mCountDown.start();
        this.mIsStarting = true;
        return true;
    }

    private void stopBluetooth() {
        Logger.e("STOPPING BLUETOOTH");
        if (this.mIsCountDownOn) {
            this.mIsCountDownOn = false;
            this.mCountDown.cancel();
        }
        this.mAudioManager.stopBluetoothSco();
        this.mAudioManager.setMode(0);
    }
}
