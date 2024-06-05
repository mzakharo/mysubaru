package solutions.eve.evelib.helper;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import java.util.Iterator;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class SpeechToTextHelper {
    static RecognitionListener recognitionListener = new RecognitionListener() { // from class: solutions.eve.evelib.helper.SpeechToTextHelper.1
        @Override // android.speech.RecognitionListener
        public void onReadyForSpeech(Bundle bundle) {
            Logger.d("onReadyForSpeech");
        }

        @Override // android.speech.RecognitionListener
        public void onBeginningOfSpeech() {
            Logger.d("onBeginningOfSpeech");
        }

        @Override // android.speech.RecognitionListener
        public void onRmsChanged(float f) {
            Logger.d("onRmsChanged: " + f);
        }

        @Override // android.speech.RecognitionListener
        public void onBufferReceived(byte[] bArr) {
            Logger.d("onBufferReceived");
        }

        @Override // android.speech.RecognitionListener
        public void onEndOfSpeech() {
            Logger.d("onEndOfSpeech");
        }

        @Override // android.speech.RecognitionListener
        public void onError(int i) {
            String unused = SpeechToTextHelper.returnedText = SpeechToTextHelper.getErrorText(i);
            Logger.e(SpeechToTextHelper.returnedText);
        }

        @Override // android.speech.RecognitionListener
        public void onResults(Bundle bundle) {
            Logger.d("onResults");
            Iterator<String> it = bundle.getStringArrayList("results_recognition").iterator();
            String str = "";
            while (it.hasNext()) {
                str = str + it.next() + "\n";
            }
            String unused = SpeechToTextHelper.returnedText = str;
        }

        @Override // android.speech.RecognitionListener
        public void onPartialResults(Bundle bundle) {
            Logger.d("onPartialResults");
        }

        @Override // android.speech.RecognitionListener
        public void onEvent(int i, Bundle bundle) {
            Logger.d("onEvent");
        }
    };
    private static Intent recognizerIntent;
    private static String returnedText;
    private static SpeechRecognizer speech;

    public static String getErrorText(int i) {
        switch (i) {
            case 1:
                return "Network timeout";
            case 2:
                return "Network error";
            case 3:
                return "Audio recording error";
            case 4:
                return "error from server";
            case 5:
                return "Client side error";
            case 6:
                return "No speech input";
            case 7:
                return "No match";
            case 8:
                return "RecognitionService busy";
            case 9:
                return "Insufficient permissions";
            default:
                return "Didn't understand, please try again.";
        }
    }

    public SpeechToTextHelper(Context context) {
        SpeechRecognizer createSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
        speech = createSpeechRecognizer;
        createSpeechRecognizer.setRecognitionListener(recognitionListener);
        Intent intent = new Intent("android.speech.action.RECOGNIZE_SPEECH");
        recognizerIntent = intent;
        intent.putExtra("android.speech.extra.LANGUAGE_PREFERENCE", Constants.Speech_language_pref_en);
        recognizerIntent.putExtra("calling_package", context.getPackageName());
        recognizerIntent.putExtra("android.speech.extra.LANGUAGE_MODEL", "web_search");
        recognizerIntent.putExtra("android.speech.extra.MAX_RESULTS", 3);
    }
}
