package solutions.eve.evelib.helper;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import java.util.Locale;
import solutions.eve.evelib.EVE;
import solutions.eve.evelib.utils.Config;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class TTS {
    private static String UTTR_ID = "EVE";
    private static TextToSpeech textToSpeech;

    public static void init(Context context) {
        if (textToSpeech == null) {
            textToSpeech = new TextToSpeech(context, new TextToSpeech.OnInitListener() { // from class: solutions.eve.evelib.helper.TTS.1
                @Override // android.speech.tts.TextToSpeech.OnInitListener
                public void onInit(int i) {
                    if (i == 0) {
                        TTS.textToSpeech.setSpeechRate(1.0f);
                    }
                    TTS.textToSpeech.setLanguage(Locale.getDefault());
                    TTS.textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() { // from class: solutions.eve.evelib.helper.TTS.1.1
                        @Override // android.speech.tts.UtteranceProgressListener
                        public void onStart(String str) {
                            TTS.UTTR_ID.equals(str);
                        }

                        @Override // android.speech.tts.UtteranceProgressListener
                        public void onDone(String str) {
                            if (TTS.UTTR_ID.equals(str)) {
                                Logger.e("OnDone Stop");
                                Config.isUseBluetoothHeadphone = false;
                                EVE.stopHMIcall();
                            }
                        }

                        @Override // android.speech.tts.UtteranceProgressListener
                        public void onError(String str) {
                            Logger.e("onError Stop");
                            Config.isUseBluetoothHeadphone = false;
                            EVE.stopHMIcall();
                        }

                        @Override // android.speech.tts.UtteranceProgressListener
                        public void onStop(String str, boolean z) {
                            super.onStop(str, z);
                            Logger.e("onStop Stop");
                            Config.isUseBluetoothHeadphone = false;
                            EVE.stopHMIcall();
                        }
                    });
                }
            });
        }
    }

    public static void speak(final String str) {
        Config.isUseBluetoothHeadphone = true;
        EVE.startHMIcall();
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: solutions.eve.evelib.helper.TTS.2
            @Override // java.lang.Runnable
            public void run() {
                Bundle bundle = new Bundle();
                bundle.putString("utteranceId", "");
                TTS.textToSpeech.speak(str, 0, bundle, TTS.UTTR_ID);
            }
        }, Constants.two_sec);
    }

    public static void stopSpeaking() {
        textToSpeech.stop();
    }

    public static boolean isSpeaking() {
        return textToSpeech.isSpeaking();
    }

    public static void release() {
        TextToSpeech textToSpeech2 = textToSpeech;
        if (textToSpeech2 != null) {
            textToSpeech2.stop();
            textToSpeech.shutdown();
        }
    }
}
