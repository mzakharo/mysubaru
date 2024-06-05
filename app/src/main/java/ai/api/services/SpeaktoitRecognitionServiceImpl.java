package ai.api.services;

import ai.api.AIServiceException;
import ai.api.RequestExtras;
import ai.api.android.AIConfiguration;
import ai.api.android.AIService;
import ai.api.model.AIContext;
import ai.api.model.AIError;
import ai.api.model.AIResponse;
import ai.api.util.VoiceActivityDetector;
import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.os.AsyncTask;
import android.util.Log;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Deprecated
/* loaded from: classes.dex */
public class SpeaktoitRecognitionServiceImpl extends AIService implements VoiceActivityDetector.SpeechEventsListener, MediaPlayer.OnCompletionListener, MediaPlayer.OnErrorListener {
    private static final int AUDIO_FORMAT = 2;
    private static final int CHANNEL_CONFIG = 16;
    private static final int SAMPLE_RATE_IN_HZ = 16000;
    public static final String TAG = "ai.api.services.SpeaktoitRecognitionServiceImpl";
    private AudioRecord audioRecord;
    private final ExecutorService eventsExecutor;
    private RequestExtras extras;
    private volatile boolean isRecording;
    private MediaPlayer mediaPlayer;
    private RecognizeTask recognizeTask;
    private final Object recognizerLock;
    private final VoiceActivityDetector vad;

    @Override // ai.api.util.VoiceActivityDetector.SpeechEventsListener
    public void onSpeechBegin() {
    }

    public SpeaktoitRecognitionServiceImpl(Context context, AIConfiguration aIConfiguration) {
        super(aIConfiguration, context);
        this.eventsExecutor = Executors.newSingleThreadExecutor();
        this.vad = new VoiceActivityDetector(SAMPLE_RATE_IN_HZ);
        this.recognizerLock = new Object();
        this.isRecording = false;
        init();
    }

    private void init() {
        synchronized (this.recognizerLock) {
            this.audioRecord = new AudioRecord(1, SAMPLE_RATE_IN_HZ, 16, 2, AudioRecord.getMinBufferSize(SAMPLE_RATE_IN_HZ, 16, 2));
            this.vad.setEnabled(this.config.isVoiceActivityDetectionEnabled());
            this.vad.setSpeechListener(this);
            MediaPlayer mediaPlayer = new MediaPlayer();
            this.mediaPlayer = mediaPlayer;
            mediaPlayer.setOnErrorListener(this);
            this.mediaPlayer.setOnCompletionListener(this);
        }
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
        synchronized (this.recognizerLock) {
            if (!this.isRecording) {
                if (!checkPermissions()) {
                    onError(new AIError("RECORD_AUDIO permission is denied. Please request permission from user."));
                    return;
                }
                this.isRecording = true;
                this.extras = requestExtras;
                AssetFileDescriptor recognizerStartSound = this.config.getRecognizerStartSound();
                if (recognizerStartSound != null) {
                    if (!playSound(recognizerStartSound)) {
                        startRecording(this.extras);
                    }
                } else {
                    startRecording(this.extras);
                }
            } else {
                Log.w(TAG, "Trying start listening when it already active");
            }
        }
    }

    private void startRecording(RequestExtras requestExtras) {
        this.vad.reset();
        this.audioRecord.startRecording();
        onListeningStarted();
        RecognizeTask recognizeTask = new RecognizeTask(new RecorderStream(this.audioRecord), requestExtras);
        this.recognizeTask = recognizeTask;
        recognizeTask.execute(new Void[0]);
    }

    @Override // ai.api.android.AIService
    public void stopListening() {
        synchronized (this.recognizerLock) {
            if (this.isRecording) {
                try {
                    this.audioRecord.stop();
                    this.isRecording = false;
                    AssetFileDescriptor recognizerStopSound = this.config.getRecognizerStopSound();
                    if (recognizerStopSound != null) {
                        playSound(recognizerStopSound);
                    }
                    onListeningFinished();
                } catch (IllegalStateException unused) {
                    Log.w(TAG, "Attempt to stop audioRecord when it is stopped");
                }
            }
        }
    }

    @Override // ai.api.android.AIService
    public void cancel() {
        synchronized (this.recognizerLock) {
            if (this.isRecording) {
                this.audioRecord.stop();
                this.isRecording = false;
                AssetFileDescriptor recognizerCancelSound = this.config.getRecognizerCancelSound();
                if (recognizerCancelSound != null) {
                    playSound(recognizerCancelSound);
                }
            }
            RecognizeTask recognizeTask = this.recognizeTask;
            if (recognizeTask != null) {
                recognizeTask.cancel(true);
            }
            onListeningCancelled();
        }
    }

    @Override // ai.api.android.AIService
    public void pause() {
        synchronized (this.recognizerLock) {
            if (this.isRecording) {
                this.audioRecord.stop();
                this.isRecording = false;
            }
            this.audioRecord.release();
            this.audioRecord = null;
            this.mediaPlayer.stop();
            this.mediaPlayer.release();
            this.mediaPlayer = null;
        }
    }

    @Override // ai.api.android.AIService
    public void resume() {
        init();
    }

    private boolean playSound(AssetFileDescriptor assetFileDescriptor) {
        try {
            this.mediaPlayer.stop();
            this.mediaPlayer.reset();
            this.mediaPlayer.setDataSource(assetFileDescriptor.getFileDescriptor(), assetFileDescriptor.getStartOffset(), assetFileDescriptor.getLength());
            this.mediaPlayer.prepare();
            this.mediaPlayer.start();
            return true;
        } catch (IOException unused) {
            return false;
        }
    }

    @Override // ai.api.util.VoiceActivityDetector.SpeechEventsListener
    public void onSpeechEnd() {
        this.eventsExecutor.submit(new Runnable() { // from class: ai.api.services.SpeaktoitRecognitionServiceImpl.1
            @Override // java.lang.Runnable
            public void run() {
                SpeaktoitRecognitionServiceImpl.this.stopListening();
            }
        });
    }

    @Override // ai.api.util.VoiceActivityDetector.SpeechEventsListener
    public void onSpeechCancel() {
        this.eventsExecutor.submit(new Runnable() { // from class: ai.api.services.SpeaktoitRecognitionServiceImpl.2
            @Override // java.lang.Runnable
            public void run() {
                SpeaktoitRecognitionServiceImpl.this.cancel();
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class RecorderStream extends InputStream {
        float alignment;
        private final AudioRecord audioRecord;
        private byte[] bytes;
        private final Object bytesLock;
        float count;
        private final float dbLevel;
        int extent;
        int max;
        int min;
        int offset;

        private RecorderStream(AudioRecord audioRecord) {
            this.dbLevel = (float) Math.pow(10.0d, -0.05d);
            this.bytesLock = new Object();
            this.offset = 0;
            this.max = 0;
            this.min = 0;
            this.alignment = 0.0f;
            this.count = 1.0f;
            this.audioRecord = audioRecord;
        }

        @Override // java.io.InputStream
        public int read() throws IOException {
            byte[] bArr = new byte[1];
            this.audioRecord.read(bArr, 0, 1);
            return bArr[0];
        }

        @Override // java.io.InputStream
        public int read(byte[] bArr, int i, int i2) throws IOException {
            int read = this.audioRecord.read(bArr, i, i2);
            if (read > 0) {
                synchronized (this.bytesLock) {
                    if (SpeaktoitRecognitionServiceImpl.this.config.isNormalizeInputSound()) {
                        normalize(bArr, read);
                    }
                    byte[] bArr2 = this.bytes;
                    int length = bArr2 != null ? bArr2.length : 0;
                    byte[] bArr3 = new byte[length + read];
                    this.bytes = bArr3;
                    if (length > 0) {
                        System.arraycopy(bArr2, 0, bArr3, 0, length);
                    }
                    System.arraycopy(bArr, 0, this.bytes, length, read);
                    while (true) {
                        byte[] bArr4 = this.bytes;
                        if (bArr4.length < 320) {
                            break;
                        }
                        byte[] bArr5 = new byte[VoiceActivityDetector.FRAME_SIZE_IN_BYTES];
                        System.arraycopy(bArr4, 0, bArr5, 0, VoiceActivityDetector.FRAME_SIZE_IN_BYTES);
                        SpeaktoitRecognitionServiceImpl.this.vad.processBuffer(bArr5, VoiceActivityDetector.FRAME_SIZE_IN_BYTES);
                        byte[] bArr6 = this.bytes;
                        int length2 = bArr6.length - VoiceActivityDetector.FRAME_SIZE_IN_BYTES;
                        byte[] bArr7 = new byte[length2];
                        this.bytes = bArr7;
                        System.arraycopy(bArr6, VoiceActivityDetector.FRAME_SIZE_IN_BYTES, bArr7, 0, length2);
                    }
                    SpeaktoitRecognitionServiceImpl speaktoitRecognitionServiceImpl = SpeaktoitRecognitionServiceImpl.this;
                    speaktoitRecognitionServiceImpl.onAudioLevelChanged((float) speaktoitRecognitionServiceImpl.vad.calculateRms());
                }
            }
            if (read != 0) {
                return read;
            }
            return -3;
        }

        private void normalize(byte[] bArr, int i) {
            int i2 = 4800 - this.offset;
            if (i >= i2) {
                ByteBuffer order = ByteBuffer.wrap(bArr, i2, i - i2).order(ByteOrder.LITTLE_ENDIAN);
                ShortBuffer asShortBuffer = order.asShortBuffer();
                for (int i3 = 0; i3 < asShortBuffer.limit(); i3++) {
                    short s = asShortBuffer.get(i3);
                    this.max = Math.max(this.max, (int) s);
                    this.min = Math.min(this.min, (int) s);
                    float f = this.count;
                    this.alignment = (((f - 1.0f) / f) * this.alignment) + (s / f);
                    this.count = f + 1.0f;
                }
                int max = Math.max(Math.abs(this.max), Math.abs(this.min));
                this.extent = max;
                float f2 = (this.dbLevel * 32767.0f) / max;
                for (int i4 = 0; i4 < asShortBuffer.limit(); i4++) {
                    order.putShort((short) ((asShortBuffer.get(i4) - this.alignment) * f2));
                }
            }
            this.offset += Math.min(i, i2);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class RecognizeTask extends AsyncTask<Void, Void, AIResponse> {
        private AIError aiError;
        private final RecorderStream recorderStream;
        private final RequestExtras requestExtras;

        private RecognizeTask(RecorderStream recorderStream, RequestExtras requestExtras) {
            this.recorderStream = recorderStream;
            this.requestExtras = requestExtras;
        }

        /* JADX INFO: Access modifiers changed from: protected */
        @Override // android.os.AsyncTask
        public AIResponse doInBackground(Void... voidArr) {
            try {
                return SpeaktoitRecognitionServiceImpl.this.aiDataService.voiceRequest(this.recorderStream, this.requestExtras);
            } catch (AIServiceException e) {
                this.aiError = new AIError(e);
                return null;
            }
        }

        /* JADX INFO: Access modifiers changed from: protected */
        @Override // android.os.AsyncTask
        public void onPostExecute(AIResponse aIResponse) {
            if (isCancelled()) {
                return;
            }
            if (aIResponse != null) {
                SpeaktoitRecognitionServiceImpl.this.onResult(aIResponse);
            } else {
                SpeaktoitRecognitionServiceImpl.this.cancel();
                SpeaktoitRecognitionServiceImpl.this.onError(this.aiError);
            }
        }
    }

    @Override // android.media.MediaPlayer.OnCompletionListener
    public void onCompletion(MediaPlayer mediaPlayer) {
        if (this.isRecording) {
            startRecording(this.extras);
        }
    }

    @Override // android.media.MediaPlayer.OnErrorListener
    public boolean onError(MediaPlayer mediaPlayer, int i, int i2) {
        if (!this.isRecording) {
            return false;
        }
        startRecording(this.extras);
        return false;
    }
}
