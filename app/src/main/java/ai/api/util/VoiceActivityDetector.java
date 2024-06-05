package ai.api.util;

import android.util.Log;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;

/* loaded from: classes.dex */
public class VoiceActivityDetector {
    private static final double ENERGY_FACTOR = 3.1d;
    public static final int FRAME_SIZE_IN_BYTES = 320;
    private static final int MAX_CZ = 15;
    private static final long MAX_SILENCE_MILLIS = 3500;
    private static final int MIN_CZ = 5;
    private static final long MIN_SILENCE_MILLIS = 800;
    private static final int MIN_SPEECH_SEQUENCE_COUNT = 3;
    public static final int NOISE_BYTES = 4800;
    private static final int NOISE_FRAMES = 15;
    private static final int SEQUENCE_LENGTH_MILLIS = 30;
    private static final long SILENCE_DIFF_MILLIS = 2700;
    public static final String TAG = "ai.api.util.VoiceActivityDetector";
    private SpeechEventsListener eventsListener;
    private int frameNumber;
    private final int sampleRate;
    private double noiseEnergy = 0.0d;
    private long lastActiveTime = -1;
    private long lastSequenceTime = 0;
    private int sequenceCounter = 0;
    private long time = 0;
    private long silenceMillis = MAX_SILENCE_MILLIS;
    private boolean speechActive = false;
    private boolean enabled = true;
    private boolean process = true;
    private double sum = 0.0d;
    private int size = 0;

    /* loaded from: classes.dex */
    public interface SpeechEventsListener {
        void onSpeechBegin();

        void onSpeechCancel();

        void onSpeechEnd();
    }

    public VoiceActivityDetector(int i) {
        this.sampleRate = i;
    }

    public void processBuffer(byte[] bArr, int i) {
        if (this.process) {
            boolean isFrameActive = isFrameActive(ByteBuffer.wrap(bArr, 0, i).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer());
            long j = ((this.frameNumber * (i / 2)) * 1000) / this.sampleRate;
            this.time = j;
            if (!isFrameActive) {
                if (j - this.lastSequenceTime > this.silenceMillis) {
                    if (this.speechActive) {
                        onSpeechEnd();
                        return;
                    } else {
                        onSpeechCancel();
                        return;
                    }
                }
                return;
            }
            long j2 = this.lastActiveTime;
            if (j2 >= 0 && j - j2 < 30) {
                int i2 = this.sequenceCounter + 1;
                this.sequenceCounter = i2;
                if (i2 >= 3) {
                    if (!this.speechActive) {
                        onSpeechBegin();
                    }
                    this.lastSequenceTime = this.time;
                    this.silenceMillis = Math.max(MIN_SILENCE_MILLIS, this.silenceMillis - 675);
                }
            } else {
                this.sequenceCounter = 1;
            }
            this.lastActiveTime = this.time;
        }
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r7v0 */
    /* JADX WARN: Type inference failed for: r7v1 */
    /* JADX WARN: Type inference failed for: r7v2 */
    private boolean isFrameActive(ShortBuffer shortBuffer) {
        int limit = shortBuffer.limit();
        this.size += limit;
        double d = 0.0d;
        int i = 0;
        int i2 = 0;
        boolean z = false;
        while (true) {
            if (i >= limit) {
                break;
            }
            short s = shortBuffer.get(i);
            double d2 = s;
            Double.isNaN(d2);
            float f = (float) (d2 / 32767.0d);
            double d3 = f * f;
            double d4 = limit;
            Double.isNaN(d3);
            Double.isNaN(d4);
            d += d3 / d4;
            double d5 = this.sum;
            double d6 = s * s;
            Double.isNaN(d6);
            this.sum = d5 + d6;
            boolean r7 = f <= 0.0f ? false : true;
            if (z && r7 != z) {
                i2++;
            }
            i++;
            z = r7;
        }
        int i3 = this.frameNumber + 1;
        this.frameNumber = i3;
        if (i3 >= 15) {
            return i2 >= 5 && i2 <= 15 && d > this.noiseEnergy * ENERGY_FACTOR;
        }
        this.noiseEnergy += d / 15.0d;
        return false;
    }

    public double calculateRms() {
        double d = this.sum;
        double d2 = this.size;
        Double.isNaN(d2);
        double sqrt = Math.sqrt(d / d2) / 100.0d;
        this.sum = 0.0d;
        this.size = 0;
        return sqrt;
    }

    public void reset() {
        this.time = 0L;
        this.frameNumber = 0;
        this.noiseEnergy = 0.0d;
        this.lastActiveTime = -1L;
        this.lastSequenceTime = 0L;
        this.sequenceCounter = 0;
        this.silenceMillis = MAX_SILENCE_MILLIS;
        this.speechActive = false;
        this.process = true;
    }

    public void setSpeechListener(SpeechEventsListener speechEventsListener) {
        this.eventsListener = speechEventsListener;
    }

    private void onSpeechEnd() {
        SpeechEventsListener speechEventsListener;
        Log.v(TAG, "onSpeechEnd");
        this.speechActive = false;
        this.process = false;
        if (!this.enabled || (speechEventsListener = this.eventsListener) == null) {
            return;
        }
        speechEventsListener.onSpeechEnd();
    }

    private void onSpeechCancel() {
        Log.v(TAG, "onSpeechCancel");
        this.speechActive = false;
        this.process = false;
        SpeechEventsListener speechEventsListener = this.eventsListener;
        if (speechEventsListener != null) {
            speechEventsListener.onSpeechCancel();
        }
    }

    private void onSpeechBegin() {
        Log.v(TAG, "onSpeechBegin");
        this.speechActive = true;
        SpeechEventsListener speechEventsListener = this.eventsListener;
        if (speechEventsListener != null) {
            speechEventsListener.onSpeechBegin();
        }
    }

    public void setEnabled(boolean z) {
        this.enabled = z;
    }
}
