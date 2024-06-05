package com.uievolution.microserver.lwipdriver;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbAccessory;
import android.hardware.usb.UsbManager;
import android.os.ParcelFileDescriptor;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.MicroServerSPPConnectionListener;
import com.uievolution.microserver.utils.Utils;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class j implements com.uievolution.microserver.lwipdriver.e {
    static final /* synthetic */ boolean h = true;
    private final Context a;
    private final UsbManager b;
    private f c;
    private UsbAccessory d;
    private ParcelFileDescriptor e;
    private boolean f;
    private final BroadcastReceiver g;

    /* loaded from: classes.dex */
    class a extends BroadcastReceiver {
        a() {
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            MicroServer.Logger.d("UsbLwipBearer", "onReceive: " + intent);
            String action = intent.getAction();
            if ("android.hardware.usb.action.USB_ACCESSORY_DETACHED".equals(action)) {
                j.this.a();
                if (j.this.c != null) {
                    j.this.c.onConnectError(-4, "USB_ACCESSORY_DETACHED");
                    return;
                }
                return;
            }
            if ("com.uievolution.microserver.USB_PERMISSION".equals(action)) {
                j.this.d = (UsbAccessory) intent.getParcelableExtra("accessory");
                try {
                    MicroServer.getInstance().startLWIPDriver();
                    return;
                } catch (IOException e) {
                    MicroServer.Logger.w("UsbLwipBearer", e);
                    return;
                }
            }
            if (MicroServer.ACTION_USB_ACCESSORY_ATTACHED.equals(action) && j.this.f) {
                j.this.f = false;
                try {
                    MicroServer.getInstance().startLWIPDriver();
                } catch (IOException e2) {
                    MicroServer.Logger.w("UsbLwipBearer", e2);
                }
            }
        }
    }

    /* loaded from: classes.dex */
    class b extends MicroServerSPPConnectionListener {
        b() {
        }

        @Override // com.uievolution.microserver.MicroServerSPPConnectionListener
        public void onConnectionEvent(int i) {
            if (i == 2) {
                j.this.f = true;
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class c extends Thread {
        c() {
        }

        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            for (int i = 0; j.this.e == null && i < 4; i++) {
                j jVar = j.this;
                jVar.e = jVar.b.openAccessory(j.this.d);
                if (j.this.e == null) {
                    try {
                        MicroServer.Logger.d("UsbLwipBearer", "Failed to openAccessory i=" + i);
                        Thread.sleep(100L);
                    } catch (InterruptedException e) {
                        MicroServer.Logger.d("UsbLwipBearer", e.getMessage());
                    }
                }
            }
            if (j.this.e == null) {
                MicroServer.Logger.d("UsbLwipBearer", "Failed to openAccessory");
                return;
            }
            FileOutputStream fileOutputStream = new FileOutputStream(j.this.e.getFileDescriptor());
            try {
                fileOutputStream.write(-64);
                j.this.c.onConnect(new e(j.this.e));
            } catch (IOException unused) {
                MicroServer.Logger.d("UsbLwipBearer", "Failed to write a data");
                Utils.closeQuietly(fileOutputStream);
                j.this.f = true;
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class dc {
        private static final j a = new j(null);
    }

    /* loaded from: classes.dex */
    static class e implements h {
        private ParcelFileDescriptor a;

        e(ParcelFileDescriptor parcelFileDescriptor) {
            this.a = parcelFileDescriptor;
        }

        @Override // java.io.Closeable, java.lang.AutoCloseable
        public void close() throws IOException {
            ParcelFileDescriptor parcelFileDescriptor = this.a;
            if (parcelFileDescriptor != null) {
                try {
                    parcelFileDescriptor.close();
                } catch (IOException unused) {
                }
                this.a = null;
            }
        }

        @Override // com.uievolution.microserver.lwipdriver.h
        public InputStream getInputStream() throws IOException {
            return new FileInputStream(this.a.getFileDescriptor());
        }

        @Override // com.uievolution.microserver.lwipdriver.h
        public OutputStream getOutputStream() throws IOException {
            return new FileOutputStream(this.a.getFileDescriptor());
        }
    }

    /* synthetic */ j(a aVar) {
        this();
    }

    private j() {
        this.f = false;
        a aVar = new a();
        this.g = aVar;
        Context context = MicroServer.getInstance().getContext();
        this.a = context;
        this.b = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.uievolution.microserver.USB_PERMISSION");
        intentFilter.addAction(MicroServer.ACTION_USB_ACCESSORY_ATTACHED);
        intentFilter.addAction("android.hardware.usb.action.USB_ACCESSORY_DETACHED");
        context.registerReceiver(aVar, intentFilter);
        LWIPDriver.getInstance().addConnectionListener(new b());
    }

    private UsbAccessory c() {
        MicroServer.Logger.d("UsbLwipBearer", "findAccessory");
        if (!h && this.d == null) {
            throw new AssertionError();
        }
        UsbAccessory[] accessoryList = this.b.getAccessoryList();
        if (accessoryList != null && accessoryList.length > 0) {
            this.d = accessoryList[0];
        }
        MicroServer.Logger.d("UsbLwipBearer", "   , found=" + this.d);
        return this.d;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static j d() {
        return dc.a;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized boolean b(LWIPParam lWIPParam, f fVar) throws IOException {
        MicroServer.Logger.d("UsbLwipBearer", "doConnect");
        return a(lWIPParam, fVar);
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public Type b() {
        return Type.USB;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized boolean a(LWIPParam lWIPParam, f fVar) throws IOException {
        MicroServer.Logger.d("UsbLwipBearer", "doListen, mUsbAccessory=" + this.d);
        this.c = fVar;
        if (this.f) {
            MicroServer.Logger.d("UsbLwipBearer", "Needs to wait for attach event after USB disconnection");
            return true;
        }
        if (this.d == null) {
            this.d = c();
        }
        UsbAccessory usbAccessory = this.d;
        if (usbAccessory == null) {
            this.f = true;
            MicroServer.Logger.d("UsbLwipBearer", "No accessory found. wait for attach event");
            return true;
        }
        if (!this.b.hasPermission(usbAccessory)) {
            this.b.requestPermission(this.d, PendingIntent.getBroadcast(this.a, 0, new Intent("com.uievolution.microserver.USB_PERMISSION"), PendingIntent.FLAG_IMMUTABLE));
            MicroServer.Logger.d("UsbLwipBearer", "required permission");
            return true;
        }
        new c().start();
        return true;
    }

    @Override // com.uievolution.microserver.lwipdriver.e
    public synchronized void a() {
        MicroServer.Logger.d("UsbLwipBearer", "doClose");
        ParcelFileDescriptor parcelFileDescriptor = this.e;
        if (parcelFileDescriptor != null) {
            try {
                parcelFileDescriptor.close();
            } catch (IOException unused) {
            }
        }
        this.e = null;
        this.d = null;
    }
}
