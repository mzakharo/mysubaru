package ai.api.services;

import ai.api.AIServiceException;
import ai.api.PartialResultsListener;
import ai.api.RequestExtras;
import ai.api.android.AIConfiguration;
import ai.api.android.AIService;
import ai.api.model.AIContext;
import ai.api.model.AIError;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.util.RecognizerChecker;
import ai.api.util.VersionConfig;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import android.util.Log;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* loaded from: classes.dex */
public class GoogleRecognitionServiceImpl extends AIService {
    private static final long STOP_DELAY = 1000;
    private static final String TAG = "ai.api.services.GoogleRecognitionServiceImpl";
    private final Map<Integer, String> errorMessages;
    private final Handler handler;
    private PartialResultsListener partialResultsListener;
    private volatile boolean recognitionActive;
    private RequestExtras requestExtras;
    private SpeechRecognizer speechRecognizer;
    private final Object speechRecognizerLock;
    private Runnable stopRunnable;
    private final VersionConfig versionConfig;
    private volatile boolean wasReadyForSpeech;

    @Override // ai.api.android.AIService
    public void resume() {
    }

    public GoogleRecognitionServiceImpl(Context context, AIConfiguration aIConfiguration) {
        super(aIConfiguration, context);
        this.speechRecognizerLock = new Object();
        this.recognitionActive = false;
        this.handler = new Handler();
        HashMap hashMap = new HashMap();
        this.errorMessages = hashMap;
        hashMap.put(1, "Network operation timed out.");
        hashMap.put(2, "Other network related errors.");
        hashMap.put(3, "Audio recording error.");
        hashMap.put(4, "Server sends error status.");
        hashMap.put(5, "Other client side errors.");
        hashMap.put(6, "No speech input.");
        hashMap.put(7, "No recognition result matched.");
        hashMap.put(8, "RecognitionService busy.");
        hashMap.put(9, "Insufficient permissions.");
        if (RecognizerChecker.findGoogleRecognizer(context) == null) {
            Log.w(TAG, "Google Recognizer application not found on device. Quality of the recognition may be low. Please check if Google Search application installed and enabled.");
        }
        VersionConfig init = VersionConfig.init(context);
        this.versionConfig = init;
        if (init.isAutoStopRecognizer()) {
            this.stopRunnable = new Runnable() { // from class: ai.api.services.GoogleRecognitionServiceImpl.1
                @Override // java.lang.Runnable
                public void run() {
                    GoogleRecognitionServiceImpl.this.stopListening();
                }
            };
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateStopRunnable(int i) {
        Runnable runnable = this.stopRunnable;
        if (runnable != null) {
            if (i == 0) {
                this.handler.removeCallbacks(runnable);
            } else if (i == 1) {
                this.handler.removeCallbacks(runnable);
                this.handler.postDelayed(this.stopRunnable, STOP_DELAY);
            }
        }
    }

    protected void initializeRecognizer() {
        if (this.speechRecognizer != null) {
            return;
        }
        synchronized (this.speechRecognizerLock) {
            SpeechRecognizer speechRecognizer = this.speechRecognizer;
            if (speechRecognizer != null) {
                speechRecognizer.destroy();
                this.speechRecognizer = null;
            }
            SpeechRecognizer createSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(this.context, RecognizerChecker.findGoogleRecognizer(this.context));
            this.speechRecognizer = createSpeechRecognizer;
            createSpeechRecognizer.setRecognitionListener(new InternalRecognitionListener());
        }
    }

    protected void clearRecognizer() {
        Log.d(TAG, "clearRecognizer");
        if (this.speechRecognizer != null) {
            synchronized (this.speechRecognizerLock) {
                SpeechRecognizer speechRecognizer = this.speechRecognizer;
                if (speechRecognizer != null) {
                    speechRecognizer.destroy();
                    this.speechRecognizer = null;
                }
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void sendRequest(AIRequest aIRequest, final RequestExtras requestExtras) {
        if (aIRequest == null) {
            throw new IllegalArgumentException("aiRequest must be not null");
        }
        new AsyncTask<AIRequest, Integer, AIResponse>() { // from class: ai.api.services.GoogleRecognitionServiceImpl.2
            private AIError aiError;

            /* JADX INFO: Access modifiers changed from: protected */
            @Override // android.os.AsyncTask
            public AIResponse doInBackground(AIRequest... aIRequestArr) {
                try {
                    return GoogleRecognitionServiceImpl.this.aiDataService.request(aIRequestArr[0], requestExtras);
                } catch (AIServiceException e) {
                    this.aiError = new AIError(e);
                    return null;
                }
            }

            /* JADX INFO: Access modifiers changed from: protected */
            @Override // android.os.AsyncTask
            public void onPostExecute(AIResponse aIResponse) {
                if (aIResponse != null) {
                    GoogleRecognitionServiceImpl.this.onResult(aIResponse);
                } else {
                    GoogleRecognitionServiceImpl.this.onError(this.aiError);
                }
            }
        }.execute(aIRequest);
    }

    @Override // ai.api.android.AIService
    public void startListening() {
        startListening(new RequestExtras());
    }

    @Override // ai.api.android.AIService
    public void startListening(List<AIContext> list) {
        startListening(new RequestExtras(list, null));
    }

    @Override // ai.api.android.AIService
    public void startListening(RequestExtras requestExtras) {
        if (!this.recognitionActive) {
            synchronized (this.speechRecognizerLock) {
                this.requestExtras = requestExtras;
                if (!checkPermissions()) {
                    onError(new AIError("RECORD_AUDIO permission is denied. Please request permission from user."));
                    return;
                }
                initializeRecognizer();
                this.recognitionActive = true;
                Intent createRecognitionIntent = createRecognitionIntent();
                try {
                    this.wasReadyForSpeech = false;
                    this.speechRecognizer.startListening(createRecognitionIntent);
                } catch (SecurityException unused) {
                }
                return;
            }
        }
        Log.w(TAG, "Trying to start recognition while another recognition active");
        if (this.wasReadyForSpeech) {
            return;
        }
        cancel();
    }

    private Intent createRecognitionIntent() {
        Intent intent = new Intent("android.speech.action.RECOGNIZE_SPEECH");
        intent.putExtra("android.speech.extra.LANGUAGE_MODEL", "free_form");
        String replace = this.config.getLanguage().replace('-', '_');
        intent.putExtra("android.speech.extra.LANGUAGE", replace);
        intent.putExtra("android.speech.extra.LANGUAGE_PREFERENCE", replace);
        intent.putExtra("android.speech.extra.PARTIAL_RESULTS", true);
        intent.putExtra("calling_package", this.context.getPackageName());
        intent.putExtra("android.speech.extra.EXTRA_ADDITIONAL_LANGUAGES", new String[]{replace});
        return intent;
    }

    @Override // ai.api.android.AIService
    public void stopListening() {
        synchronized (this.speechRecognizerLock) {
            SpeechRecognizer speechRecognizer = this.speechRecognizer;
            if (speechRecognizer != null) {
                speechRecognizer.stopListening();
            }
        }
    }

    @Override // ai.api.android.AIService
    public void cancel() {
        synchronized (this.speechRecognizerLock) {
            if (this.recognitionActive) {
                this.recognitionActive = false;
                SpeechRecognizer speechRecognizer = this.speechRecognizer;
                if (speechRecognizer != null) {
                    speechRecognizer.cancel();
                }
                onListeningCancelled();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void restartRecognition() {
        updateStopRunnable(0);
        this.recognitionActive = false;
        synchronized (this.speechRecognizerLock) {
            try {
                SpeechRecognizer speechRecognizer = this.speechRecognizer;
                if (speechRecognizer != null) {
                    speechRecognizer.cancel();
                    Intent createRecognitionIntent = createRecognitionIntent();
                    this.wasReadyForSpeech = false;
                    this.speechRecognizer.startListening(createRecognitionIntent);
                    this.recognitionActive = true;
                }
            } catch (Exception unused) {
                stopListening();
            }
        }
    }

    @Override // ai.api.android.AIService
    public void pause() {
        clearRecognizer();
    }

    public void setPartialResultsListener(PartialResultsListener partialResultsListener) {
        this.partialResultsListener = partialResultsListener;
    }

    protected void onPartialResults(List<String> list) {
        PartialResultsListener partialResultsListener = this.partialResultsListener;
        if (partialResultsListener != null) {
            partialResultsListener.onPartialResults(list);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void stopInternal() {
        updateStopRunnable(0);
        if (this.versionConfig.isDestroyRecognizer()) {
            clearRecognizer();
        }
        this.recognitionActive = false;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class InternalRecognitionListener implements RecognitionListener {
        @Override // android.speech.RecognitionListener
        public void onBeginningOfSpeech() {
        }

        @Override // android.speech.RecognitionListener
        public void onBufferReceived(byte[] bArr) {
        }

        @Override // android.speech.RecognitionListener
        public void onEvent(int i, Bundle bundle) {
        }

        private InternalRecognitionListener() {
        }

        @Override // android.speech.RecognitionListener
        public void onReadyForSpeech(Bundle bundle) {
            if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                GoogleRecognitionServiceImpl.this.onListeningStarted();
            }
            GoogleRecognitionServiceImpl.this.wasReadyForSpeech = true;
        }

        @Override // android.speech.RecognitionListener
        public void onRmsChanged(float f) {
            if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                GoogleRecognitionServiceImpl.this.onAudioLevelChanged(f);
            }
        }

        @Override // android.speech.RecognitionListener
        public void onEndOfSpeech() {
            if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                GoogleRecognitionServiceImpl.this.onListeningFinished();
            }
        }

        @Override // android.speech.RecognitionListener
        public void onError(int i) {
            AIError aIError;
            if (i != 7 || GoogleRecognitionServiceImpl.this.wasReadyForSpeech) {
                if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                    if (GoogleRecognitionServiceImpl.this.errorMessages.containsKey(Integer.valueOf(i))) {
                        aIError = new AIError("Speech recognition engine error: " + ((String) GoogleRecognitionServiceImpl.this.errorMessages.get(Integer.valueOf(i))));
                    } else {
                        aIError = new AIError("Speech recognition engine error: " + i);
                    }
                    GoogleRecognitionServiceImpl.this.onError(aIError);
                }
                GoogleRecognitionServiceImpl.this.stopInternal();
                return;
            }
            Log.d(GoogleRecognitionServiceImpl.TAG, "SpeechRecognizer.ERROR_NO_MATCH, restartRecognition()");
            GoogleRecognitionServiceImpl.this.restartRecognition();
        }

        @Override // android.speech.RecognitionListener
        public void onResults(Bundle bundle) {
            if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                ArrayList<String> stringArrayList = bundle.getStringArrayList("results_recognition");
                float[] floatArray = Build.VERSION.SDK_INT >= 14 ? bundle.getFloatArray("confidence_scores") : null;
                if (stringArrayList == null || stringArrayList.isEmpty()) {
                    GoogleRecognitionServiceImpl.this.onResult(new AIResponse());
                } else {
                    AIRequest aIRequest = new AIRequest();
                    if (floatArray != null) {
                        aIRequest.setQuery((String[]) stringArrayList.toArray(new String[stringArrayList.size()]), floatArray);
                    } else {
                        aIRequest.setQuery(stringArrayList.get(0));
                    }
                    GoogleRecognitionServiceImpl.this.onPartialResults(stringArrayList);
                    GoogleRecognitionServiceImpl googleRecognitionServiceImpl = GoogleRecognitionServiceImpl.this;
                    googleRecognitionServiceImpl.sendRequest(aIRequest, googleRecognitionServiceImpl.requestExtras);
                }
            }
            GoogleRecognitionServiceImpl.this.stopInternal();
        }

        @Override // android.speech.RecognitionListener
        public void onPartialResults(Bundle bundle) {
            if (GoogleRecognitionServiceImpl.this.recognitionActive) {
                GoogleRecognitionServiceImpl.this.updateStopRunnable(1);
                ArrayList<String> stringArrayList = bundle.getStringArrayList("results_recognition");
                if (stringArrayList == null || stringArrayList.isEmpty()) {
                    return;
                }
                GoogleRecognitionServiceImpl.this.onPartialResults(stringArrayList);
            }
        }
    }
}
