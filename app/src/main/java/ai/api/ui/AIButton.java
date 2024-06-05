package ai.api.ui;

import ai.api.AIListener;
import ai.api.AIServiceException;
import ai.api.PartialResultsListener;
import ai.api.R;
import ai.api.RequestExtras;
import ai.api.android.AIConfiguration;
import ai.api.android.AIService;
import ai.api.model.AIError;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.services.GoogleRecognitionServiceImpl;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.Transformation;
import java.util.List;

/* loaded from: classes.dex */
public class AIButton extends SoundLevelButton implements AIListener {
    private static final String TAG = "ai.api.ui.AIButton";
    private AIService aiService;
    private final WaitingAnimation animation;
    private boolean animationSecondPhase;
    private float animationStage;
    private volatile MicState currentState;
    private PartialResultsListener partialResultsListener;
    private AIButtonListener resultsListener;
    protected static final int[] STATE_WAITING = {R.attr.state_waiting};
    protected static final int[] STATE_SPEAKING = {R.attr.state_speaking};
    protected static final int[] STATE_INITIALIZING_TTS = {R.attr.state_initializing_tts};

    /* loaded from: classes.dex */
    public interface AIButtonListener {
        void onCancelled();

        void onError(AIError aIError);

        void onResult(AIResponse aIResponse);
    }

    @Override // ai.api.AIListener
    public void onResult(AIResponse aIResponse) {
        post(new Runnable() { // from class: ai.api.ui.AIButton.1
            @Override // java.lang.Runnable
            public void run() {
                AIButton.this.changeState(MicState.normal);
            }
        });
        AIButtonListener aIButtonListener = this.resultsListener;
        if (aIButtonListener != null) {
            aIButtonListener.onResult(aIResponse);
        }
    }

    @Override // ai.api.AIListener
    public void onError(AIError aIError) {
        post(new Runnable() { // from class: ai.api.ui.AIButton.2
            @Override // java.lang.Runnable
            public void run() {
                AIButton.this.changeState(MicState.normal);
            }
        });
        AIButtonListener aIButtonListener = this.resultsListener;
        if (aIButtonListener != null) {
            aIButtonListener.onError(aIError);
        }
    }

    @Override // ai.api.AIListener
    public void onAudioLevel(float f) {
        setSoundLevel(f);
    }

    @Override // ai.api.AIListener
    public void onListeningStarted() {
        post(new Runnable() { // from class: ai.api.ui.AIButton.3
            @Override // java.lang.Runnable
            public void run() {
                AIButton.this.changeState(MicState.listening);
            }
        });
    }

    @Override // ai.api.AIListener
    public void onListeningCanceled() {
        post(new Runnable() { // from class: ai.api.ui.AIButton.4
            @Override // java.lang.Runnable
            public void run() {
                AIButton.this.changeState(MicState.normal);
            }
        });
        AIButtonListener aIButtonListener = this.resultsListener;
        if (aIButtonListener != null) {
            aIButtonListener.onCancelled();
        }
    }

    @Override // ai.api.AIListener
    public void onListeningFinished() {
        post(new Runnable() { // from class: ai.api.ui.AIButton.5
            @Override // java.lang.Runnable
            public void run() {
                AIButton.this.changeState(MicState.busy);
            }
        });
    }

    /* loaded from: classes.dex */
    public enum MicState {
        normal,
        busy,
        listening,
        speaking,
        initializingTts;

        public static MicState fromAttrs(TypedArray typedArray) {
            if (typedArray.getBoolean(R.styleable.SoundLevelButton_state_listening, false)) {
                return listening;
            }
            if (typedArray.getBoolean(R.styleable.SoundLevelButton_state_waiting, false)) {
                return busy;
            }
            if (typedArray.getBoolean(R.styleable.SoundLevelButton_state_speaking, false)) {
                return speaking;
            }
            if (typedArray.getBoolean(R.styleable.SoundLevelButton_state_initializing_tts, false)) {
                return initializingTts;
            }
            return normal;
        }
    }

    public AIButton(Context context) {
        super(context);
        this.animationStage = 0.0f;
        this.animationSecondPhase = false;
        this.animation = new WaitingAnimation();
        this.currentState = MicState.normal;
        init(context, null);
    }

    public AIButton(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        this.animationStage = 0.0f;
        this.animationSecondPhase = false;
        this.animation = new WaitingAnimation();
        this.currentState = MicState.normal;
        init(context, attributeSet);
    }

    public AIButton(Context context, AttributeSet attributeSet, int i) {
        super(context, attributeSet, i);
        this.animationStage = 0.0f;
        this.animationSecondPhase = false;
        this.animation = new WaitingAnimation();
        this.currentState = MicState.normal;
        init(context, attributeSet);
    }

    private void init(Context context, AttributeSet attributeSet) {
        if (attributeSet != null) {
            TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, R.styleable.SoundLevelButton);
            try {
                this.currentState = MicState.fromAttrs(obtainStyledAttributes);
            } finally {
                obtainStyledAttributes.recycle();
            }
        }
    }

    public void initialize(AIConfiguration aIConfiguration) {
        AIService service = AIService.getService(getContext(), aIConfiguration);
        this.aiService = service;
        service.setListener(this);
        AIService aIService = this.aiService;
        if (aIService instanceof GoogleRecognitionServiceImpl) {
            ((GoogleRecognitionServiceImpl) aIService).setPartialResultsListener(new PartialResultsListener() { // from class: ai.api.ui.AIButton.6
                @Override // ai.api.PartialResultsListener
                public void onPartialResults(List<String> list) {
                    if (AIButton.this.partialResultsListener != null) {
                        AIButton.this.partialResultsListener.onPartialResults(list);
                    }
                }
            });
        }
    }

    public void setResultsListener(AIButtonListener aIButtonListener) {
        this.resultsListener = aIButtonListener;
    }

    public void setPartialResultsListener(PartialResultsListener partialResultsListener) {
        this.partialResultsListener = partialResultsListener;
    }

    public void startListening() {
        startListening(null);
    }

    public void startListening(RequestExtras requestExtras) {
        if (this.aiService != null) {
            if (this.currentState == MicState.normal) {
                this.aiService.startListening(requestExtras);
                return;
            }
            return;
        }
        throw new IllegalStateException("Call initialize method before usage");
    }

    public AIResponse textRequest(AIRequest aIRequest) throws AIServiceException {
        AIService aIService = this.aiService;
        if (aIService != null) {
            return aIService.textRequest(aIRequest);
        }
        throw new IllegalStateException("Call initialize method before usage");
    }

    public AIResponse textRequest(String str) throws AIServiceException {
        return textRequest(new AIRequest(str));
    }

    public AIService getAIService() {
        return this.aiService;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // ai.api.ui.SoundLevelButton
    public void onClick(View view) {
        super.onClick(view);
        if (this.aiService != null) {
            int i = AnonymousClass7.$SwitchMap$ai$api$ui$AIButton$MicState[this.currentState.ordinal()];
            if (i == 1) {
                this.aiService.startListening();
            } else if (i == 2) {
                this.aiService.cancel();
            } else {
                this.aiService.stopListening();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: ai.api.ui.AIButton$7, reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass7 {
        static final /* synthetic */ int[] $SwitchMap$ai$api$ui$AIButton$MicState;

        static {
            int[] iArr = new int[MicState.values().length];
            $SwitchMap$ai$api$ui$AIButton$MicState = iArr;
            try {
                iArr[MicState.normal.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$ai$api$ui$AIButton$MicState[MicState.busy.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                $SwitchMap$ai$api$ui$AIButton$MicState[MicState.listening.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                $SwitchMap$ai$api$ui$AIButton$MicState[MicState.speaking.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                $SwitchMap$ai$api$ui$AIButton$MicState[MicState.initializingTts.ordinal()] = 5;
            } catch (NoSuchFieldError unused5) {
            }
        }
    }

    @Override // ai.api.ui.SoundLevelButton, android.widget.ImageView, android.view.View
    public int[] onCreateDrawableState(int i) {
        int[] onCreateDrawableState = super.onCreateDrawableState(i + 1);
        if (this.currentState != null) {
            int i2 = AnonymousClass7.$SwitchMap$ai$api$ui$AIButton$MicState[this.currentState.ordinal()];
            if (i2 == 2) {
                mergeDrawableStates(onCreateDrawableState, STATE_WAITING);
            } else if (i2 == 3) {
                mergeDrawableStates(onCreateDrawableState, STATE_LISTENING);
            } else if (i2 == 4) {
                mergeDrawableStates(onCreateDrawableState, STATE_SPEAKING);
            } else if (i2 == 5) {
                mergeDrawableStates(onCreateDrawableState, STATE_INITIALIZING_TTS);
            }
        }
        return onCreateDrawableState;
    }

    public void resume() {
        AIService aIService = this.aiService;
        if (aIService != null) {
            aIService.resume();
        }
    }

    public void pause() {
        cancelListening();
        AIService aIService = this.aiService;
        if (aIService != null) {
            aIService.pause();
        }
    }

    private void cancelListening() {
        if (this.aiService == null || this.currentState == MicState.normal) {
            return;
        }
        this.aiService.cancel();
        changeState(MicState.normal);
    }

    protected void changeState(MicState micState) {
        int i = AnonymousClass7.$SwitchMap$ai$api$ui$AIButton$MicState[micState.ordinal()];
        if (i == 1) {
            stopProcessingAnimation();
            setDrawSoundLevel(false);
        } else if (i == 2) {
            startProcessingAnimation();
            setDrawSoundLevel(false);
        } else if (i == 3) {
            stopProcessingAnimation();
            setDrawSoundLevel(true);
        } else if (i == 4) {
            stopProcessingAnimation();
            setDrawSoundLevel(false);
        } else if (i == 5) {
            stopProcessingAnimation();
            setDrawSoundLevel(false);
        }
        this.currentState = micState;
        refreshDrawableState();
    }

    protected MicState getCurrentState() {
        return this.currentState;
    }

    private void startProcessingAnimation() {
        setDrawCenter(true);
        this.animationSecondPhase = false;
        startAnimation(this.animation);
    }

    private void stopProcessingAnimation() {
        setDrawCenter(false);
        clearAnimation();
        this.animationStage = 0.0f;
        this.animationSecondPhase = false;
        postInvalidate();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // ai.api.ui.SoundLevelButton, ai.api.ui.MaskedColorView
    public String getDebugState() {
        return super.getDebugState() + "\nst:" + this.currentState;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class WaitingAnimation extends Animation {
        protected WaitingAnimation() {
            setDuration(1500L);
            setRepeatCount(-1);
            setRepeatMode(1);
            setInterpolator(new LinearInterpolator());
        }

        @Override // android.view.animation.Animation
        protected void applyTransformation(float f, Transformation transformation) {
            AIButton.this.animationStage = f;
            AIButton.this.invalidate();
        }
    }

    @Override // android.widget.ImageView, android.view.View
    protected void onDraw(Canvas canvas) {
        float f;
        super.onDraw(canvas);
        float f2 = 0.0f;
        if (this.animationStage > 0.0f || this.animationSecondPhase) {
            float width = getWidth() / 2.0f;
            float minRadius = getMinRadius() * 1.25f;
            float f3 = width - minRadius;
            float f4 = width + minRadius;
            RectF rectF = new RectF(f3, f3, f4, f4);
            Paint paint = new Paint();
            paint.setColor(getResources().getColor(R.color.icon_orange_color));
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(dpToPixels(getContext(), 4.0f));
            paint.setStrokeCap(Paint.Cap.ROUND);
            paint.setAntiAlias(true);
            float f5 = this.animationStage;
            if (f5 >= 0.5d || this.animationSecondPhase) {
                f2 = (f5 - 0.5f) * 360.0f;
                this.animationSecondPhase = true;
                f = 180.0f;
            } else {
                f = f5 * 360.0f;
            }
            canvas.drawArc(rectF, f2 + 270.0f, f, false, paint);
        }
    }

    private static int dpToPixels(Context context, float f) {
        return Math.round(TypedValue.applyDimension(1, f, context.getResources().getDisplayMetrics()));
    }
}
