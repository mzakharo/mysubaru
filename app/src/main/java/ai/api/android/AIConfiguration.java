package ai.api.android;

import android.content.res.AssetFileDescriptor;

/* loaded from: classes.dex */
public class AIConfiguration extends ai.api.AIConfiguration {
    private boolean normalizeInputSound;
    private final RecognitionEngine recognitionEngine;
    private AssetFileDescriptor recognizerCancelSound;
    private AssetFileDescriptor recognizerStartSound;
    private AssetFileDescriptor recognizerStopSound;
    private boolean voiceActivityDetectionEnabled;

    /* loaded from: classes.dex */
    public enum RecognitionEngine {
        Google,
        System,
        Speaktoit
    }

    public AIConfiguration(String str, AIConfiguration.SupportedLanguages supportedLanguages, RecognitionEngine recognitionEngine) {
        super(str, supportedLanguages);
        this.voiceActivityDetectionEnabled = true;
        this.normalizeInputSound = false;
        this.recognitionEngine = recognitionEngine;
        if (recognitionEngine == RecognitionEngine.Speaktoit && supportedLanguages == AIConfiguration.SupportedLanguages.Korean) {
            throw new UnsupportedOperationException("Only System recognition supported for Korean language");
        }
    }

    public RecognitionEngine getRecognitionEngine() {
        return this.recognitionEngine;
    }

    public boolean isVoiceActivityDetectionEnabled() {
        return this.voiceActivityDetectionEnabled;
    }

    public void setVoiceActivityDetectionEnabled(boolean z) {
        this.voiceActivityDetectionEnabled = z;
    }

    public void setNormalizeInputSound(boolean z) {
        this.normalizeInputSound = z;
    }

    public boolean isNormalizeInputSound() {
        return this.normalizeInputSound;
    }

    public AssetFileDescriptor getRecognizerStartSound() {
        return this.recognizerStartSound;
    }

    public void setRecognizerStartSound(AssetFileDescriptor assetFileDescriptor) {
        this.recognizerStartSound = assetFileDescriptor;
    }

    public AssetFileDescriptor getRecognizerStopSound() {
        return this.recognizerStopSound;
    }

    public void setRecognizerStopSound(AssetFileDescriptor assetFileDescriptor) {
        this.recognizerStopSound = assetFileDescriptor;
    }

    public AssetFileDescriptor getRecognizerCancelSound() {
        return this.recognizerCancelSound;
    }

    public void setRecognizerCancelSound(AssetFileDescriptor assetFileDescriptor) {
        this.recognizerCancelSound = assetFileDescriptor;
    }
}
