package ai.api.android;

import com.google.gson.Gson;

/* loaded from: classes.dex */
public class GsonFactory {
    public static Gson getGson() {
        return ai.api.GsonFactory.getDefaultFactory().getGson();
    }
}
