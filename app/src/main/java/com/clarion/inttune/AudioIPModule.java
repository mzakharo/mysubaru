package com.clarion.inttune;

import android.content.Context;
import android.util.Log;
import com.clarion.audioip.PlayerPlugin;
import java.util.Arrays;

/* loaded from: classes.dex */
public class AudioIPModule {
    public static final int IP_MODE_HIGH = 2;
    public static final int IP_MODE_LOW = 0;
    public static final int IP_MODE_MID = 1;
    public static final int IP_MODE_OFF = -1;
    private static final int PLUGIN_BUFFER_SIZE = 16384;
    private static PlayerPlugin mBeatPlugin;
    private static com.clarion.autotuning.PlayerPlugin mTuningPlugin;

    public static void initail(Context context) {
        ApiConfig.initialize(context);
        mBeatPlugin = new PlayerPlugin(16384, Constants.SF, ApiConfig.getInstance().getBeatType() != -1 ? ApiConfig.getInstance().getBeatType() : 0, ApiConfig.getInstance().isBeatingOn());
        mTuningPlugin = new com.clarion.autotuning.PlayerPlugin(16384);
    }

    public static void setBeatOn(boolean z) {
        Log.e("wangj", "setTuningOn : " + z);
        mBeatPlugin.OnOff(z);
        ApiConfig.getInstance().setBeatingOn(z);
    }

    public static boolean isBeatingOn() {
        return ApiConfig.getInstance().isBeatingOn();
    }

    public static void executeSoundEffects(double[] dArr) {
        mTuningPlugin.HandleData(dArr);
        mBeatPlugin.HandleData(dArr);
    }

    public static void resetSoundEffects() {
        double[] dArr = new double[16384];
        Arrays.fill(dArr, 0.0d);
        executeSoundEffects(dArr);
    }

    public static void switchIPMode(int i) {
        mBeatPlugin.Switch(i);
        ApiConfig.getInstance().setBeatType(i);
    }

    public static int getIPMode() {
        return ApiConfig.getInstance().getBeatType();
    }

    public static void setTuningResponse(double[] dArr) {
        mTuningPlugin.SetResponse(dArr);
    }
}
