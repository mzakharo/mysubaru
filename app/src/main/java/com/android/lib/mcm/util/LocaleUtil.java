package com.android.lib.mcm.util;

import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.application.MCApplication;
import java.util.Locale;
/* loaded from: classes.dex */
public class LocaleUtil {
    private static final String COUNTRY_CODE_CN = "CN";
    private static final String COUNTRY_CODE_TW = "TW";
    private static final String LANGUAGE_CODE_FIL = "fil";
    private static final String LANGUAGE_CODE_NB = "nb";
    private static final String LANGUAGE_CODE_NN = "nn";
    private static final String LANGUAGE_CODE_NO = "no";
    private static final String LANGUAGE_CODE_TL = "tl";
    private static final String LANGUAGE_CODE_ZH = "zh";
    private static final String SCRIPT_CODE_HANS = "Hans";
    private static final String SCRIPT_CODE_HANT = "Hant";
    private static Locale defaultLocale;
    private static Locale resourceLocale;

    private static void init() {
        defaultLocale = Locale.getDefault();
        resourceLocale = convertLocale(Resources.getSystem().getConfiguration().locale);
        Configuration configuration = new Configuration();
        if (Build.VERSION.SDK_INT > 17) {
            configuration.setLocale(resourceLocale);
        } else {
            configuration.locale = resourceLocale;
        }
        MCApplication.getInstance().getResources().updateConfiguration(configuration, null);
    }

    public static String getString(int i) {
        if (defaultLocale == null) {
            init();
        }
        return MCApplication.getInstance().getString(i);
    }

    public static Locale getLocale() {
        if (defaultLocale == null) {
            init();
        }
        Log.d("TEST", resourceLocale.toString());
        return resourceLocale;
    }

    public static Locale getDefaultLocale() {
        if (defaultLocale == null) {
            init();
        }
        Log.d("TEST", defaultLocale.toString());
        return defaultLocale;
    }

    private static Locale convertLocale(Locale locale) {
        if (TextUtils.equals(locale.getLanguage(), LANGUAGE_CODE_ZH)) {
            return convertLanguageZH(locale);
        }
        if (TextUtils.equals(locale.getLanguage(), LANGUAGE_CODE_NO) || TextUtils.equals(locale.getLanguage(), LANGUAGE_CODE_NB) || TextUtils.equals(locale.getLanguage(), LANGUAGE_CODE_NN)) {
            return new Locale(LANGUAGE_CODE_NO);
        }
        return TextUtils.equals(locale.getLanguage(), LANGUAGE_CODE_TL) ? new Locale(LANGUAGE_CODE_FIL) : locale;
    }

    private static Locale convertLanguageZH(Locale locale) {
        if (Build.VERSION.SDK_INT > 20) {
            if (TextUtils.equals(locale.getScript(), SCRIPT_CODE_HANT) || TextUtils.equals(locale.getCountry(), COUNTRY_CODE_TW)) {
                return new Locale.Builder().setLanguage(LANGUAGE_CODE_ZH).setRegion(COUNTRY_CODE_TW).setScript(SCRIPT_CODE_HANT).build();
            }
            return new Locale.Builder().setLanguage(LANGUAGE_CODE_ZH).setRegion(COUNTRY_CODE_CN).setScript(SCRIPT_CODE_HANS).build();
        }
        return locale;
    }
}
