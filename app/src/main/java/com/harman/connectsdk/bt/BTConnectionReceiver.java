package com.harman.connectsdk.bt;

import android.Manifest;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.harman.connectsdk.ConnectionService;

/* loaded from: classes.dex */
public class BTConnectionReceiver extends BroadcastReceiver {
    private static final String TAG = "BTConnectionReceiver";
    public static String connectedDeviceName;

    @Override // android.content.BroadcastReceiver
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        String str = TAG;
        Log.i(str, "onReceive() with action: " + action);
        BluetoothUtils.printLogs(str, "onReceive() with action: " + action);
        if (action.equals("android.bluetooth.adapter.action.STATE_CHANGED")) {
            int intValue = ((Integer) intent.getExtras().get("android.bluetooth.adapter.extra.STATE")).intValue();
            Log.i(str, "extraState = " + intValue);
            if (intValue == 10) {
                Log.i(str, "bluetooth is OFF. ");
                connectedDeviceName = null;
            } else if (intValue == 12) {
                Log.i(str, "bluetooth is ON...... So make bConnectionStarted value as false to go for listen mode");
                ConnectionService.bConnectionStarted = false;
                connectedDeviceName = null;
                Log.i(str, "Value of bConnectionStarted--->" + ConnectionService.bConnectionStarted);
                Intent intent2 = new Intent(context, (Class<?>) ConnectionService.class);
                Log.i(str, "BT_ON starting service");
                intent2.putExtra("BT_ON", true);
                if (Build.VERSION.SDK_INT >= 26) {
                    context.startForegroundService(intent2);
                } else {
                    context.startService(intent2);
                }
            }
        }
        if (action.equals("android.bluetooth.device.action.ACL_CONNECTED")) {
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            connectedDeviceName = ((BluetoothDevice) intent.getParcelableExtra("android.bluetooth.device.extra.DEVICE")).getName();
            Log.i(str, "ACTION_ACL_CONNECTED:::::::connectedDeviceName-->" + connectedDeviceName);
            Intent intent3 = new Intent(context, (Class<?>) ConnectionService.class);
            Log.i(str, "ACTION_ACL_CONNECTED starting service");
            BluetoothUtils.printLogs(str, "ACTION_ACL_CONNECTED starting service");
            intent3.putExtra("ACL_CONNECTED", true);
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(intent3);
            } else {
                context.startService(intent3);
            }
        }
        if (action.equals("android.bluetooth.device.action.ACL_DISCONNECTED")) {
            String name = ((BluetoothDevice) intent.getParcelableExtra("android.bluetooth.device.extra.DEVICE")).getName();
            Log.i(str, "ACTION_ACL_DISCONNECTED::::::::requestedDeviceName-->" + name);
            if (connectedDeviceName != null) {
                Log.i(str, "ACTION_ACL_DISCONNECTED::::::::connectedDeviceName-->" + connectedDeviceName);
            }
            if (name == null || !name.equalsIgnoreCase(connectedDeviceName)) {
                return;
            }
            connectedDeviceName = null;
        }
    }
}
