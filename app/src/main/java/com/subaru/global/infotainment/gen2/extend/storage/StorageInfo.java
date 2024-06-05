package com.subaru.global.infotainment.gen2.extend.storage;

import android.os.Environment;
import android.os.StatFs;

/* loaded from: classes.dex */
public class StorageInfo {
    private StorageInfo() {
    }

    public static long getTotalSize() {
        StatFs statFs = new StatFs(Environment.getExternalStorageDirectory().getAbsolutePath());
        return statFs.getBlockSizeLong() * statFs.getBlockCountLong();
    }

    public static long getFreeSize() {
        StatFs statFs = new StatFs(Environment.getExternalStorageDirectory().getAbsolutePath());
        return statFs.getBlockSizeLong() * statFs.getAvailableBlocksLong();
    }
}
