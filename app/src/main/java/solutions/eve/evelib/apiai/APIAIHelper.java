package solutions.eve.evelib.apiai;

import ai.api.AIConfiguration;
import android.content.Context;
import com.example.mysubaru.R;
import solutions.eve.evelib.utils.Config;

/* loaded from: classes.dex */
public class APIAIHelper {
    static AIConfiguration aiConfig;
    private static Context mContext;

    public APIAIHelper() {
    }

    public APIAIHelper(Context context) {
        mContext = context;
        if (aiConfig != null) {
            return;
        }
        AIConfiguration aIConfiguration = new AIConfiguration(Config.API_AI_ACCESS_TOKEN, AIConfiguration.SupportedLanguages.English);
        aiConfig = aIConfiguration;
        //aIConfiguration.setRecognizerStartSound(mContext.getResources().openRawResourceFd(R.raw.test_start));
        ///aiConfig.setRecognizerStopSound(mContext.getResources().openRawResourceFd(R.raw.test_stop));
        //aiConfig.setRecognizerCancelSound(mContext.getResources().openRawResourceFd(R.raw.test_cancel));
    }

    public static ai.api.android.AIConfiguration getAiConfig() {
        return (ai.api.android.AIConfiguration) aiConfig;
    }
}
