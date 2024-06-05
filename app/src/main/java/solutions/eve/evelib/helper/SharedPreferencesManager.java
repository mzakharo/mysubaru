package solutions.eve.evelib.helper;

import android.content.Context;
import android.content.SharedPreferences;

/* loaded from: classes.dex */
public class SharedPreferencesManager {
    private static SharedPreferences.Editor editor;
    private static SharedPreferences sharedPreferences;

    public static void init(Context context) {
        SharedPreferences defaultSharedPreferences = android.preference.PreferenceManager.getDefaultSharedPreferences(context);
        sharedPreferences = defaultSharedPreferences;
        editor = defaultSharedPreferences.edit();
    }

    public static void storeInt(String str, int i) {
        editor.putInt(str, i).commit();
    }

    public static void storeString(String str, String str2) {
        editor.putString(str, str2).commit();
    }

    public static void storeLong(String str, Long l) {
        editor.putLong(str, l.longValue()).commit();
    }

    public static void storeBool(String str, boolean z) {
        editor.putBoolean(str, z).commit();
    }

    public static int getInt(String str) {
        return sharedPreferences.getInt(str, -1);
    }

    public static String getString(String str) {
        return sharedPreferences.getString(str, null);
    }

    public static boolean getBoolean(String str) {
        return sharedPreferences.getBoolean(str, false);
    }
}
