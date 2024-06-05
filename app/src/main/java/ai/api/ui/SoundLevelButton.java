package ai.api.ui;

import ai.api.R;
import ai.api.ui.SoundLevelCircleDrawable;
import android.content.Context;
import android.content.res.TypedArray;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;

/* loaded from: classes.dex */
public class SoundLevelButton extends MaskedColorView {
    protected static final int[] STATE_LISTENING = {R.attr.state_listening};
    private static final String TAG = "ai.api.ui.SoundLevelButton";
    private final SoundLevelCircleDrawable backgroundDrawable;
    protected boolean listening;

    /* JADX INFO: Access modifiers changed from: protected */
    public void onClick(View view) {
    }

    public SoundLevelButton(Context context) {
        super(context);
        this.listening = false;
        SoundLevelCircleDrawable soundLevelCircleDrawable = new SoundLevelCircleDrawable(getParams(context, null));
        this.backgroundDrawable = soundLevelCircleDrawable;
        setCircleBackground(soundLevelCircleDrawable);
        init();
    }

    public SoundLevelButton(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        this.listening = false;
        SoundLevelCircleDrawable soundLevelCircleDrawable = new SoundLevelCircleDrawable(getParams(context, attributeSet));
        this.backgroundDrawable = soundLevelCircleDrawable;
        setCircleBackground(soundLevelCircleDrawable);
        init();
    }

    public SoundLevelButton(Context context, AttributeSet attributeSet, int i) {
        super(context, attributeSet, i);
        this.listening = false;
        SoundLevelCircleDrawable soundLevelCircleDrawable = new SoundLevelCircleDrawable(getParams(context, attributeSet));
        this.backgroundDrawable = soundLevelCircleDrawable;
        setCircleBackground(soundLevelCircleDrawable);
        init();
    }

    private void init() {
        setOnClickListener(new View.OnClickListener() { // from class: ai.api.ui.SoundLevelButton.1
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                SoundLevelButton.this.onClick(view);
            }
        });
    }

    private SoundLevelCircleDrawable.Params getParams(Context context, AttributeSet attributeSet) {
        if (attributeSet == null) {
            return null;
        }
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, R.styleable.SoundLevelButton);
        try {
            this.listening = obtainStyledAttributes.getBoolean(R.styleable.SoundLevelButton_state_listening, false);
            return new SoundLevelCircleDrawable.Params(obtainStyledAttributes.getDimension(R.styleable.SoundLevelButton_maxRadius, -1.0f), obtainStyledAttributes.getDimension(R.styleable.SoundLevelButton_minRadius, -1.0f), obtainStyledAttributes.getDimension(R.styleable.SoundLevelButton_circleCenterX, -1.0f), obtainStyledAttributes.getDimension(R.styleable.SoundLevelButton_circleCenterY, -1.0f), obtainStyledAttributes.getColor(R.styleable.SoundLevelButton_centerColor, SoundLevelCircleDrawable.CENTER_COLOR_DEF), obtainStyledAttributes.getColor(R.styleable.SoundLevelButton_haloColor, SoundLevelCircleDrawable.HALO_COLOR_DEF));
        } finally {
            obtainStyledAttributes.recycle();
        }
    }

    @Override // android.widget.ImageView, android.view.View
    public int[] onCreateDrawableState(int i) {
        int[] onCreateDrawableState = super.onCreateDrawableState(i + 1);
        if (this.listening) {
            mergeDrawableStates(onCreateDrawableState, STATE_LISTENING);
        }
        return onCreateDrawableState;
    }

    private void setCircleBackground(SoundLevelCircleDrawable soundLevelCircleDrawable) {
        if (Build.VERSION.SDK_INT < 16) {
            setBackgroundDrawable(soundLevelCircleDrawable);
        } else {
            setBackground(soundLevelCircleDrawable);
        }
    }

    public void setDrawSoundLevel(boolean z) {
        this.listening = z;
        this.backgroundDrawable.setDrawSoundLevel(z);
        refreshDrawableState();
        postInvalidate();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void setDrawCenter(boolean z) {
        this.backgroundDrawable.setDrawCenter(z);
    }

    public void setSoundLevel(float f) {
        this.backgroundDrawable.setSoundLevel(f);
        postInvalidate();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // ai.api.ui.MaskedColorView
    public String getDebugState() {
        return super.getDebugState() + "\ndrawSL: " + this.listening;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public float getMinRadius() {
        return this.backgroundDrawable.getMinRadius();
    }
}
