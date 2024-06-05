package com.subaru.global.infotainment.gen2.harman.stub;

import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.application.MCApplication;
import com.example.mysubaru.R;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import com.subaru.global.infotainment.gen2.harman.error.HarmanErrorManager;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;

/* loaded from: classes.dex */
public class MultilingualTests {
    private static final String TAG = "MultilingualTests";
    private static String sTmpLocalization;

    private static ArrayList<String> getLocalizations() {
        return new ArrayList<>(Arrays.asList("en", "en-GB", "fr", "fr-CA", "es-MX", "ja", "de", "es", "it", "nl", "ru", "pt", "pt-BR", "sv", "no", "zh-CN-Hans", "zh-TW-Hant", "ar", "iw", "ms", "th", "fil"));
    }

    public static void testAllId() {
        HashSet hashSet = new HashSet();
        for (Field field : R.string.class.getFields()) {
            try {
                hashSet.add(Integer.valueOf(field.getInt(null)));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        test((Integer[]) hashSet.toArray(new Integer[0]));
    }

    public static void testAllOtaId() {
        test(new Integer[]{Integer.valueOf(R.string._TAG), Integer.valueOf(R.string.TXT_YELP_0029_ALERT), Integer.valueOf(R.string.TXT_YELP_0029_NOTIFY), Integer.valueOf(R.string.SL_TXT_0177_ALERT), Integer.valueOf(R.string.SL_TXT_0177_NOTIFY), Integer.valueOf(R.string.SL_TXT_0207_ALERT), Integer.valueOf(R.string.SL_TXT_0207_NOTIFY), Integer.valueOf(R.string.SL_TXT_0209_ALERT), Integer.valueOf(R.string.SL_TXT_0209_NOTIFY), Integer.valueOf(R.string.SL_TXT_0211_ALERT), Integer.valueOf(R.string.SL_TXT_0211_NOTIFY), Integer.valueOf(R.string.SL_TXT_0214_ALERT), Integer.valueOf(R.string.SL_TXT_0214_NOTIFY), Integer.valueOf(R.string.SL_TXT_0215_ALERT), Integer.valueOf(R.string.SL_TXT_0215_NOTIFY), Integer.valueOf(R.string.SL_TXT_0216_ALERT), Integer.valueOf(R.string.SL_TXT_0216_NOTIFY), Integer.valueOf(R.string.SL_TXT_0217_ALERT), Integer.valueOf(R.string.SL_TXT_0217_NOTIFY), Integer.valueOf(R.string.SL_TXT_0219_ALERT), Integer.valueOf(R.string.SL_TXT_0219_NOTIFY), Integer.valueOf(R.string.SL_TXT_0220_ALERT), Integer.valueOf(R.string.SL_TXT_0220_NOTIFY)});
    }

    private static void setSystemLocale(String str) {
        String[] split = str.split("-");
        Locale.Builder builder = new Locale.Builder();
        if (split.length > 0) {
            builder.setLanguage(split[0]);
        }
        if (split.length > 1) {
            builder.setRegion(split[1]);
        }
        if (split.length > 2) {
            builder.setScript(split[2]);
        }
        Locale build = builder.build();
        Configuration configuration = new Configuration();
        if (Build.VERSION.SDK_INT > 17) {
            configuration.setLocale(build);
        } else {
            configuration.locale = build;
        }
        MCApplication.getInstance().getResources().updateConfiguration(configuration, null);
    }

    private static void test(Integer[] numArr) {
        Resources resources = MCApplication.getInstance().getResources();
        Iterator<String> it = getLocalizations().iterator();
        while (it.hasNext()) {
            String next = it.next();
            setSystemLocale(next);
            for (Integer num : numArr) {
                int intValue = num.intValue();
                String string = MCApplication.getInstance().getString(intValue);
                String str = TAG;
                Log.d(str, "[" + next + "] value : " + string);
                Log.d(str, "[" + next + "] value : " + resources.getString(intValue));
            }
        }
    }

    public static void testUndefinedIdAccess() {
        Resources resources = MCApplication.getInstance().getResources();
        Locale locale = Locale.getDefault();
        String string = MCApplication.getInstance().getString(R.string._UndefinedIdAccessCheck);
        String str = TAG;
        Log.d(str, "[" + locale + "] value : " + string);
        Log.d(str, "[" + locale + "] value : " + resources.getString(R.string._UndefinedIdAccessCheck));
    }

    public static void testNotifyAll() {
        HashSet hashSet = new HashSet();
        Iterator<String> it = getLocalizations().iterator();
        int i = 0;
        while (it.hasNext()) {
            String next = it.next();
            hashSet.clear();
            for (HarmanOriginalError harmanOriginalError : HarmanOriginalError.values()) {
                Integer valueOf = Integer.valueOf(harmanOriginalError.getResLongId());
                if (valueOf.intValue() != -1 && !hashSet.contains(valueOf)) {
                    hashSet.add(valueOf);
                    new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.stub.MultilingualTests.1
                        HarmanOriginalError tmp_error;
                        String tmp_localization;
                        final /* synthetic */ HarmanOriginalError val$error;
                        final /* synthetic */ String val$localization;

                        {
                            this.val$localization = next;
                            this.val$error = harmanOriginalError;
                            this.tmp_localization = next;
                            this.tmp_error = harmanOriginalError;
                        }

                        @Override // java.lang.Runnable
                        public void run() {
                            MultilingualTests.post(this.tmp_localization, this.tmp_error);
                        }
                    }, i * 1 * 1000);
                    i++;
                }
            }
        }
    }

    public static void testNotifyMapSubscription() {
        new HashSet();
        Iterator<String> it = getLocalizations().iterator();
        int i = 0;
        while (it.hasNext()) {
            final String next = it.next();
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: com.subaru.global.infotainment.gen2.harman.stub.MultilingualTests.2
                @Override // java.lang.Runnable
                public void run() {
                    MultilingualTests.post(next, HarmanOriginalError.MAP_SUBSCRIPTION_EXPIRED);
                }
            }, i * 1 * 1000);
            i++;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void post(String str, HarmanOriginalError harmanOriginalError) {
        if (!TextUtils.equals(sTmpLocalization, str)) {
            String str2 = TAG;
            Log.d(str2, "");
            Log.d(str2, "-----------------------------------");
            Log.d(str2, str);
            setSystemLocale(str);
            sTmpLocalization = str;
        }
        String str3 = TAG;
        Log.d(str3, MCApplication.getInstance().getString(harmanOriginalError.getResLongId()));
        Log.d(str3, MCApplication.getInstance().getString(harmanOriginalError.getResShortId()));
        HarmanAPI harmanAPI = HarmanAPI.NOTIFY_ACCESSORY_TRANSFER_STATUS;
        HarmanErrorManager.getInstance().dismissAlert();
        HarmanErrorManager.getInstance().call(harmanOriginalError, harmanAPI);
    }
}
