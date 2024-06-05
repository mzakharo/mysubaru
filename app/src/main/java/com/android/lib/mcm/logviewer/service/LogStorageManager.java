package com.android.lib.mcm.logviewer.service;

import android.content.Context;
import android.util.Log;
import java.io.IOException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogStorageManager {
    private static Context mContext;
    private static LogStorageFileUtil mLogStorageFileUtil;
    private static LogStorageManager sLogStorageManager;

    public static LogStorageManager getInstance(Context context) {
        if (sLogStorageManager == null) {
            mContext = context.getApplicationContext();
            sLogStorageManager = new LogStorageManager();
        }
        if (mLogStorageFileUtil == null) {
            mLogStorageFileUtil = new LogStorageFileUtil(mContext);
        }
        return sLogStorageManager;
    }

    private LogStorageManager() {
    }

    public void saveLog(JSONObject jSONObject) {
        Log.d(getClass().getName(), "saveLog -> start");
        try {
            mLogStorageFileUtil.createLogFile(jSONObject);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Log.d(getClass().getName(), "saveLog -> end");
    }
}
