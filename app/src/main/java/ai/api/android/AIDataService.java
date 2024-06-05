package ai.api.android;

import ai.api.AIServiceContext;
import android.content.Context;
import com.google.gson.Gson;
import java.util.TimeZone;

/* loaded from: classes.dex */
public class AIDataService extends ai.api.AIDataService {
    public static final String TAG = "ai.api.android.AIDataService";
    private final AIConfiguration config;
    private final Context context;
    private final Gson gson;

    public AIDataService(Context context, AIConfiguration aIConfiguration) {
        super(aIConfiguration, new AIAndroidServiceContext(context));
        this.gson = GsonFactory.getGson();
        this.context = context;
        this.config = aIConfiguration;
    }

    /* loaded from: classes.dex */
    private static class AIAndroidServiceContext implements AIServiceContext {
        private final String sessionId;

        public AIAndroidServiceContext(Context context) {
            this.sessionId = SessionIdStorage.getSessionId(context);
        }

        @Override // ai.api.AIServiceContext
        public String getSessionId() {
            return this.sessionId;
        }

        @Override // ai.api.AIServiceContext
        public TimeZone getTimeZone() {
            return TimeZone.getDefault();
        }
    }
}
