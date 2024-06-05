package solutions.eve.evelib.helper;

import android.content.Context;
import android.content.SharedPreferences;
import solutions.eve.evelib.utils.Constants;

/* loaded from: classes.dex */
public class PreferenceManager {
    public static SharedPreferences mediapref;

    public static PreferenceManager setup(Context context) {
        mediapref = context.getSharedPreferences(Constants.APP_NAME, 4);
        return null;
    }

    public static void storeString(String str, String str2) {
        mediapref.edit().putString(str, str2).commit();
    }

    public static void storeBoolean(String str, boolean z) {
        mediapref.edit().putBoolean(str, z).commit();
    }

    public static void storeInt(String str, int i) {
        mediapref.edit().putInt(str, i).commit();
    }

    public static void storeLong(String str, long j) {
        mediapref.edit().putLong(str, j).commit();
    }

    public static boolean isLoggedIn() {
        return mediapref.getBoolean(Constants.isLoggedIn, false);
    }

    public static void delKey(String str) {
        mediapref.edit().remove(str).commit();
    }

    public static void deleteAllData() {
        mediapref.edit().clear().commit();
    }
}
