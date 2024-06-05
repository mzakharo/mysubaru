package ai.api.android;

import ai.api.AIListener;
import ai.api.AIServiceException;
import ai.api.RequestExtras;
import ai.api.android.AIConfiguration;
import ai.api.model.AIContext;
import ai.api.model.AIError;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.model.Entity;
import ai.api.services.GoogleRecognitionServiceImpl;
import ai.api.services.SpeaktoitRecognitionServiceImpl;
import android.content.Context;
import androidx.core.content.ContextCompat;
import java.util.Collection;
import java.util.List;

/* loaded from: classes.dex */
public abstract class AIService {
    private static final String TAG = "ai.api.android.AIService";
    protected final AIDataService aiDataService;
    protected final AIConfiguration config;
    protected final Context context;
    private AIListener listener;

    public abstract void cancel();

    public void pause() {
    }

    public void resume() {
    }

    public abstract void startListening();

    public abstract void startListening(RequestExtras requestExtras);

    public abstract void startListening(List<AIContext> list);

    public abstract void stopListening();

    public static AIService getService(Context context, AIConfiguration aIConfiguration) {
        if (aIConfiguration.getRecognitionEngine() == AIConfiguration.RecognitionEngine.Google) {
            return new GoogleRecognitionServiceImpl(context, aIConfiguration);
        }
        if (aIConfiguration.getRecognitionEngine() == AIConfiguration.RecognitionEngine.System) {
            return new GoogleRecognitionServiceImpl(context, aIConfiguration);
        }
        if (aIConfiguration.getRecognitionEngine() == AIConfiguration.RecognitionEngine.Speaktoit) {
            return new SpeaktoitRecognitionServiceImpl(context, aIConfiguration);
        }
        throw new UnsupportedOperationException("This engine still not supported");
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public AIService(AIConfiguration aIConfiguration, Context context) {
        this.config = aIConfiguration;
        this.context = context;
        this.aiDataService = new AIDataService(context, aIConfiguration);
    }

    public void setListener(AIListener aIListener) {
        this.listener = aIListener;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onResult(AIResponse aIResponse) {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onResult(aIResponse);
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onError(AIError aIError) {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onError(aIError);
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onAudioLevelChanged(float f) {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onAudioLevel(f);
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onListeningStarted() {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onListeningStarted();
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onListeningCancelled() {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onListeningCanceled();
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void onListeningFinished() {
        AIListener aIListener = this.listener;
        if (aIListener != null) {
            aIListener.onListeningFinished();
        }
    }

    public AIResponse textRequest(AIRequest aIRequest) throws AIServiceException {
        return this.aiDataService.request(aIRequest);
    }

    public AIResponse textRequest(String str, RequestExtras requestExtras) throws AIServiceException {
        AIRequest aIRequest = new AIRequest(str);
        if (requestExtras != null) {
            requestExtras.copyTo(aIRequest);
        }
        return this.aiDataService.request(aIRequest);
    }

    public boolean resetContexts() {
        return this.aiDataService.resetContexts();
    }

    public AIResponse uploadUserEntity(Entity entity) throws AIServiceException {
        return this.aiDataService.uploadUserEntity(entity);
    }

    public AIResponse uploadUserEntities(Collection<Entity> collection) throws AIServiceException {
        return this.aiDataService.uploadUserEntities(collection);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public boolean checkPermissions() {
        try {
            return ContextCompat.checkSelfPermission(this.context, "android.permission.RECORD_AUDIO") == 0;
        } catch (Throwable unused) {
            return true;
        }
    }
}
