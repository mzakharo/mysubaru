package com.harman.connectsdk;

import android.content.Intent;
import android.hardware.usb.UsbAccessory;
import android.hardware.usb.UsbManager;
import android.os.Build;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import androidx.appcompat.app.AppCompatActivity;
//import com.harman.communicationservice.R;
import com.example.mysubaru.R;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/* loaded from: classes.dex */
public class UsbInsertActivity extends AppCompatActivity {
    boolean mBound = false;
    ParcelFileDescriptor mFileDescriptor;
    InputStream mInputStream;
    OutputStream mOutputStream;
    private UsbManager mUsbManager;

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.appcompat.app.AppCompatActivity, androidx.fragment.app.FragmentActivity, androidx.core.app.ComponentActivity, android.app.Activity
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_usb_insert);
        Intent intent = new Intent(getApplicationContext(), (Class<?>) ConnectionService.class);
        if (Build.VERSION.SDK_INT >= 26) {
            startForegroundService(intent);
        } else {
            startService(intent);
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.fragment.app.FragmentActivity, android.app.Activity
    public void onResume() {
        UsbAccessory usbAccessory;
        super.onResume();
        Intent intent = getIntent();
        if (intent != null && intent.getAction().equals("android.hardware.usb.action.USB_ACCESSORY_ATTACHED") && (usbAccessory = (UsbAccessory) intent.getParcelableExtra("accessory")) != null) {
            try {
                this.mFileDescriptor = this.mUsbManager.openAccessory(usbAccessory);
            } catch (Exception e) {
                e.getMessage();
            }
            ParcelFileDescriptor parcelFileDescriptor = this.mFileDescriptor;
            if (parcelFileDescriptor != null) {
                FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
                this.mInputStream = new FileInputStream(fileDescriptor);
                this.mOutputStream = new FileOutputStream(fileDescriptor);
                HACServiceManager.getInstance().setUsbIOStreams(this.mInputStream, this.mOutputStream);
            }
        }
        finish();
    }
}
