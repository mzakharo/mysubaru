package com.uievolution.microserver.lwipdriver;

import static androidx.core.app.ActivityCompat.requestPermissions;
import static androidx.core.app.ActivityCompat.shouldShowRequestPermissionRationale;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Looper;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.utils.Utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class b implements e, f {
    private f d;
    private List<com.uievolution.microserver.lwipdriver.a> e;
    private final C0017b b = new C0017b();
    private boolean c = false;
    private final Context a = MicroServer.getInstance().getContext();

    /* loaded from: classes.dex */
    class a extends Thread {
        final /* synthetic */ Set<BluetoothDevice> a;
        final /* synthetic */ UUID b;

        private final Context ctx = MicroServer.getInstance().getContext();

        a(Set set, UUID uuid) {
            this.a = set;
            this.b = uuid;
        }

        @RequiresApi(api = Build.VERSION_CODES.S)
        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            BluetoothSocket bluetoothSocket = null;

            for (BluetoothDevice bluetoothDevice : this.a) {

                if (ActivityCompat.checkSelfPermission(ctx, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    Toast.makeText(ctx, "Allow BLUETOOTH_CONNECT access. Please", Toast.LENGTH_LONG).show();
                    ActivityCompat.requestPermissions((Activity) ctx, new String[]{android.Manifest.permission.BLUETOOTH_CONNECT}, 5622);

                    return;
                }
                MicroServer.Logger.d("BTLWIPDriver", "paired: " + bluetoothDevice.getName() + "," + bluetoothDevice.getAddress());
                try {
                    bluetoothSocket = bluetoothDevice.createRfcommSocketToServiceRecord(this.b);
                    bluetoothSocket.connect();
                    break;
                } catch (IOException e) {
                    MicroServer.Logger.w("BTLWIPDriver", "Excption", e);
                    Utils.closeQuietly(bluetoothSocket);
                }
            }
            if (bluetoothSocket != null) {
                MicroServer.Logger.d("BTLWIPDriver", "socket is created!");
                b.this.d.onConnect(new d(bluetoothSocket));
            } else {
                MicroServer.Logger.d("BTLWIPDriver", "socket is null!");
                b.this.d.onConnectError(-4, "Failed to connect");
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: com.uievolution.microserver.lwipdriver.b$b, reason: collision with other inner class name */
    /* loaded from: classes.dex */
    public class C0017b extends BroadcastReceiver {
        C0017b() {
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("android.bluetooth.adapter.action.STATE_CHANGED") && intent.getIntExtra("android.bluetooth.adapter.extra.STATE", Integer.MIN_VALUE) == 12) {
                MicroServer.Logger.d("BTLWIPDriver", "BluetoothAdapter.STATE_ON");
                b.this.e();
                try {
                    MicroServer.getInstance().startLWIPDriver();
                } catch (IOException e) {
                    MicroServer.Logger.w("BTLWIPDriver", e);
                }
            }
        }
    }

    private synchronized void c() {
        if (!this.c) {
            this.a.registerReceiver(this.b, new IntentFilter("android.bluetooth.adapter.action.STATE_CHANGED"));
            this.c = true;
        }
    }

    private void d() {
        MicroServer.Logger.d("BTLWIPDriver", "Bluetooth is not enabled, wait for BT status ready.");
        c();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public synchronized void e() {
        if (this.c) {
            this.a.unregisterReceiver(this.b);
            this.c = false;
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public synchronized void onConnect(h hVar) {
        if (this.e != null) {
            this.d.onConnect(hVar);
            for (com.uievolution.microserver.lwipdriver.a aVar : this.e) {
                if (Thread.currentThread() != aVar) {
                    aVar.c();
                }
            }
            this.e = null;
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.f
    public void onConnectError(int i, String str) {
        if (!BluetoothAdapter.getDefaultAdapter().isEnabled()) {
            i = -8;
            str = "Bluetooth is disabled.";
        }
        this.d.onConnectError(i, str);
    }

    @RequiresApi(api = Build.VERSION_CODES.S)
    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized boolean a(LWIPParam lWIPParam, f fVar) throws IOException {
        this.d = fVar;
        String serviceName = lWIPParam.getServiceName();
        if (serviceName == null) {
            MicroServer.Logger.e("BTLWIPDriver", "serviceName is not set. You must specify serviceName");
        }
        if (Build.VERSION.SDK_INT <= 14 && Looper.myLooper() == null) {
            Looper.prepare();
        }
        BluetoothAdapter defaultAdapter = BluetoothAdapter.getDefaultAdapter();
        if (defaultAdapter == null) {
            MicroServer.Logger.d("BTLWIPDriver", "Bluetooth is not supported on this device");
            return false;
        }
        if (!defaultAdapter.isEnabled()) {
            d();
            return true;
        }
        ArrayList arrayList = new ArrayList();
        try {
            for (UUID uuid : lWIPParam.getUuids()) {
                if (ActivityCompat.checkSelfPermission(this.a, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    Toast.makeText(this.a, "Allow BLUETOOTH_CONNECT access. Please", Toast.LENGTH_LONG).show();
                    ActivityCompat.requestPermissions((Activity) this.a, new String[]{android.Manifest.permission.BLUETOOTH_CONNECT}, 5622);
                }
                BluetoothServerSocket listenUsingRfcommWithServiceRecord = defaultAdapter.listenUsingRfcommWithServiceRecord(serviceName, uuid);
                MicroServer.Logger.d("BTLWIPDriver", "createServerSocket for BT. serviceName=" + serviceName + ", uuid=" + uuid.toString());
                arrayList.add(new c(listenUsingRfcommWithServiceRecord));
            }
            this.e = new ArrayList();
            Iterator it = arrayList.iterator();
            while (it.hasNext()) {
                com.uievolution.microserver.lwipdriver.a aVar = new com.uievolution.microserver.lwipdriver.a((g) it.next(), this);
                aVar.start();
                this.e.add(aVar);
            }
            return true;
        } catch (IOException e) {
            throw new IOException("BluetoothAdapter.listenUsingRfcommWithServiceRecord failed.", e);
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized boolean b(LWIPParam lWIPParam, f fVar) throws IOException {
        this.d = fVar;
        BluetoothAdapter defaultAdapter = BluetoothAdapter.getDefaultAdapter();
        if (defaultAdapter == null) {
            MicroServer.Logger.d("BTLWIPDriver", "Bluetooth is not supported on this device");
            return false;
        }
        if (!defaultAdapter.isEnabled()) {
            d();
            return true;
        }
        if (ActivityCompat.checkSelfPermission(this.a, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.

            Toast.makeText(this.a, "Allow BLUETOOTH_CONNECT access. Please", Toast.LENGTH_LONG).show();
            ActivityCompat.requestPermissions((Activity) this.a, new String[]{android.Manifest.permission.BLUETOOTH_CONNECT}, 5622);
            return false;
        }
        new a(defaultAdapter.getBondedDevices(), lWIPParam.getFirstUuid()).start();
        return true;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized void a() {
        e();
        List<com.uievolution.microserver.lwipdriver.a> list = this.e;
        if (list != null) {
            for (com.uievolution.microserver.lwipdriver.a aVar : list) {
                aVar.c();
                try {
                    aVar.join(200L);
                } catch (InterruptedException unused) {
                }
            }
            this.e = null;
        }
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public Type b() {
        return Type.Bluetooth;
    }
}
