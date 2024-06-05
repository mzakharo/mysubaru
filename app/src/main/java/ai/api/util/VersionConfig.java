package ai.api.util;

import ai.api.android.GsonFactory;
import android.content.Context;
import android.text.TextUtils;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/* loaded from: classes.dex */
public class VersionConfig {
    private static final Pattern DOT_PATTERN = Pattern.compile(".", 16);
    private static final String TAG = "ai.api.util.VersionConfig";
    private static final Map<String, VersionConfig> configuration;
    private boolean autoStopRecognizer;
    private boolean destroyRecognizer;

    static {
        HashMap hashMap = new HashMap();
        configuration = hashMap;
        hashMap.put("5.9.26", new VersionConfig(true, true));
        hashMap.put("4.7.13", new VersionConfig(false, false));
    }

    private VersionConfig() {
        this.destroyRecognizer = true;
        this.autoStopRecognizer = false;
    }

    private VersionConfig(boolean z, boolean z2) {
        this.destroyRecognizer = true;
        this.autoStopRecognizer = false;
        this.destroyRecognizer = z;
        this.autoStopRecognizer = z2;
    }

    public static VersionConfig init(Context context) {
        return getConfigByVersion(context);
    }

    private static VersionConfig getConfigByVersion(Context context) {
        long numberFromBuildVersion = numberFromBuildVersion(RecognizerChecker.getGoogleRecognizerVersion(context));
        VersionConfig versionConfig = new VersionConfig();
        long j = 0;
        for (Map.Entry<String, VersionConfig> entry : configuration.entrySet()) {
            String key = entry.getKey();
            if (!TextUtils.isEmpty(key)) {
                long numberFromBuildVersion2 = numberFromBuildVersion(key);
                if (numberFromBuildVersion >= numberFromBuildVersion2 && j < numberFromBuildVersion2) {
                    versionConfig.destroyRecognizer = entry.getValue().destroyRecognizer;
                    versionConfig.autoStopRecognizer = entry.getValue().autoStopRecognizer;
                    j = numberFromBuildVersion2;
                }
            }
        }
        return versionConfig;
    }

    public boolean isDestroyRecognizer() {
        return this.destroyRecognizer;
    }

    public boolean isAutoStopRecognizer() {
        return this.autoStopRecognizer;
    }

    private static long numberFromBuildVersion(String str) {
        if (TextUtils.isEmpty(str)) {
            return 0L;
        }
        String[] split = DOT_PATTERN.split(str);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(3, split.length); i++) {
            sb.append(split[i]);
        }
        try {
            return Long.parseLong(sb.toString());
        } catch (NumberFormatException unused) {
            return 0L;
        }
    }

    public String toString() {
        return GsonFactory.getGson().toJson(this);
    }
}
