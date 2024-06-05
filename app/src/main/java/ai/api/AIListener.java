package ai.api;

import ai.api.model.AIError;
import ai.api.model.AIResponse;

/* loaded from: classes.dex */
public interface AIListener {
    void onAudioLevel(float f);

    void onError(AIError aIError);

    void onListeningCanceled();

    void onListeningFinished();

    void onListeningStarted();

    void onResult(AIResponse aIResponse);
}
