package com.clarion.inttune;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

/* loaded from: classes.dex */
public class ApiConfig {
    public static final int BEAT_TYPE_HIGH = 2;
    public static final int BEAT_TYPE_LOW = 0;
    public static final int BEAT_TYPE_MID = 1;
    public static final int BEAT_TYPE_OFF = -1;
    private static final int DEFAULT_EQ_SELECTION = 0;
    private static final int DEFAULT_MIC_SELECTION = 0;
    private static final String KEY_BEATING = "KEY_BEATING";
    private static final String KEY_BEAT_TYPE = "BEAT_TYPE";
    private static final String KEY_EQ_SELECTION = "EQ_SELECTION";
    private static final String KEY_MIC_SELECTION = "MIC_SELECTION";
    private static final String KEY_TUNING = "KEY_TUNING";
    public static final int PAYMENT_EXPIRE = 1;
    public static final int PAYMENT_NORMAL = 2;
    public static final int PAYMENT_TRIAL = 0;
    private static ApiConfig mInstance;
    private SharedPreferences mSharedPreferences;

    private ApiConfig(Context context) {
        this.mSharedPreferences = null;
        this.mSharedPreferences = context.getSharedPreferences("intelligent_tune_config", 0);
    }

    public static ApiConfig getInstance() {
        return mInstance;
    }

    public int getEQSelection() {
        return this.mSharedPreferences.getInt(KEY_EQ_SELECTION, 0);
    }

    public void setEQSelettion(int i) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        edit.putInt(KEY_EQ_SELECTION, i);
        edit.commit();
    }

    public int getMicSelection() {
        return this.mSharedPreferences.getInt(KEY_MIC_SELECTION, 0);
    }

    public void setMicSelettion(int i) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        edit.putInt(KEY_MIC_SELECTION, i);
        edit.commit();
    }

    public int getBeatType() {
        int i = this.mSharedPreferences.getInt(KEY_BEAT_TYPE, -1);
        Log.e("test", "getLowOn :" + i);
        return i;
    }

    public void setBeatType(int i) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        Log.e("test", "setBeatType :" + i);
        edit.putInt(KEY_BEAT_TYPE, i);
        edit.commit();
    }

    public void setTuningOn(boolean z) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        Log.e("test", "setTuningOn :" + z);
        edit.putBoolean(KEY_TUNING, z);
        edit.commit();
    }

    public void setBeatingOn(boolean z) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        Log.e("test", "setTuningOn :" + z);
        edit.putBoolean(KEY_BEATING, z);
        edit.commit();
    }

    public boolean isTuningOn() {
        boolean z = this.mSharedPreferences.getBoolean(KEY_TUNING, false);
        Log.e("test", "isTuningOn :" + z);
        return z;
    }

    public boolean isBeatingOn() {
        boolean z = this.mSharedPreferences.getBoolean(KEY_BEATING, false);
        Log.e("test", "isBeatingOn :" + z);
        return z;
    }

    public static void initialize(Context context) {
        if (mInstance == null) {
            mInstance = new ApiConfig(context);
        }
    }
}
