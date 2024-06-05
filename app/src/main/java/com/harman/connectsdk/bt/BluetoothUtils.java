package com.harman.connectsdk.bt;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.util.Log;
import java.util.Iterator;

/* loaded from: classes.dex */
public class BluetoothUtils {
    public static boolean isBluetoothAvailable() {
        return BluetoothAdapter.getDefaultAdapter() != null;
    }

    public static boolean isBluetoothEnabled() {
        if (isBluetoothAvailable()) {
            return BluetoothAdapter.getDefaultAdapter().isEnabled();
        }
        return false;
    }

    public static boolean isPairedDevice(String str) {
        if (!isBluetoothAvailable()) {
            return false;
        }
        Iterator<BluetoothDevice> it = BluetoothAdapter.getDefaultAdapter().getBondedDevices().iterator();
        while (it.hasNext()) {
            if (it.next().getAddress().equals(str)) {
                return true;
            }
        }
        return false;
    }

    public static void printLogs(String str, String str2) {
        Log.d(str, str2);
    }
}
