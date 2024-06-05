package ai.api.ui;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;

/* loaded from: classes.dex */
public class SoundLevelCircleDrawable extends Drawable {
    public static final int CENTER_COLOR_DEF = -889815;
    public static final int HALO_COLOR_DEF = Color.argb(16, 0, 0, 0);
    private static final float INITIAL_VALUE = 2.5f;
    private static final float MAX_VALUE = 10.0f;
    private static final float MIN_VALUE = 0.5f;
    private final Rect bounds;
    private final float circleCenterX;
    private final float circleCenterY;
    private boolean drawCenter;
    private boolean drawSoundLevel;
    private float maxMicLevel;
    private final float maxRadius;
    private float minMicLevel;
    private final float minRadius;
    private final Paint paintIndicatorCenter;
    private final Paint paintIndicatorHalo;
    private float smoothedLevel;

    @Override // android.graphics.drawable.Drawable
    public int getOpacity() {
        return -3;
    }

    @Override // android.graphics.drawable.Drawable
    public void setAlpha(int i) {
    }

    @Override // android.graphics.drawable.Drawable
    public void setColorFilter(ColorFilter colorFilter) {
    }

    private static Paint newColorPaint(int i) {
        Paint paint = new Paint();
        paint.setStyle(Paint.Style.FILL);
        paint.setAntiAlias(true);
        paint.setColor(i);
        return paint;
    }

    public SoundLevelCircleDrawable() {
        this(null);
    }

    public SoundLevelCircleDrawable(Params params) {
        int i;
        int i2;
        this.minMicLevel = MIN_VALUE;
        this.maxMicLevel = MAX_VALUE;
        this.drawSoundLevel = false;
        this.smoothedLevel = INITIAL_VALUE;
        this.bounds = new Rect();
        this.drawCenter = false;
        if (params != null) {
            this.maxRadius = params.maxRadius;
            this.minRadius = params.minRadius;
            this.circleCenterX = params.circleCenterX;
            this.circleCenterY = params.circleCenterY;
            i = params.centerColor;
            i2 = params.haloColor;
        } else {
            this.maxRadius = -1.0f;
            this.minRadius = -1.0f;
            this.circleCenterX = -1.0f;
            this.circleCenterY = -1.0f;
            i = CENTER_COLOR_DEF;
            i2 = HALO_COLOR_DEF;
        }
        this.paintIndicatorHalo = newColorPaint(i2);
        this.paintIndicatorCenter = newColorPaint(i);
    }

    @Override // android.graphics.drawable.Drawable
    public void draw(Canvas canvas) {
        if (this.drawSoundLevel || this.drawCenter) {
            canvas.save();
            try {
                if (this.maxRadius < 0.0f || this.circleCenterX < 0.0f || this.circleCenterY < 0.0f) {
                    canvas.getClipBounds(this.bounds);
                }
                canvas.drawColor(0);
                float f = this.smoothedLevel;
                float f2 = this.minMicLevel;
                float f3 = (f - f2) / (this.maxMicLevel - f2);
                float f4 = this.maxRadius;
                if (f4 < 0.0f) {
                    f4 = this.bounds.width() / 2.0f;
                }
                float f5 = this.minRadius;
                if (f5 < 0.0f) {
                    f5 = 0.5777778f * f4;
                }
                float f6 = 0.8f * f5;
                float f7 = f6 + ((f4 - f6) * f3);
                float f8 = this.circleCenterX;
                if (f8 < 0.0f) {
                    f8 = this.bounds.width() / 2.0f;
                }
                float f9 = this.circleCenterY;
                if (f9 < 0.0f) {
                    f9 = this.bounds.height() / 2.0f;
                }
                if (this.drawSoundLevel) {
                    canvas.drawCircle(f8, f9, f7, this.paintIndicatorHalo);
                }
                if (this.drawCenter || this.drawSoundLevel) {
                    canvas.drawCircle(f8, f9, f5, this.paintIndicatorCenter);
                }
            } finally {
                canvas.restore();
            }
        }
    }

    public boolean setDrawSoundLevel(boolean z) {
        if (this.drawSoundLevel == z) {
            return false;
        }
        this.drawSoundLevel = z;
        if (!z) {
            return true;
        }
        this.minMicLevel = MIN_VALUE;
        this.maxMicLevel = MAX_VALUE;
        this.smoothedLevel = INITIAL_VALUE;
        return true;
    }

    public void setDrawCenter(boolean z) {
        this.drawCenter = z;
    }

    public void setSoundLevel(float f) {
        float abs = Math.abs(f);
        float f2 = this.minMicLevel;
        if (abs < f2) {
            this.minMicLevel = (f2 + abs) / 2.0f;
        }
        float f3 = this.maxMicLevel;
        if (abs > f3) {
            this.maxMicLevel = (f3 + abs) / 2.0f;
        }
        float f4 = (this.smoothedLevel * 0.8f) + (abs * 0.2f);
        this.smoothedLevel = f4;
        float f5 = this.maxMicLevel;
        if (f4 > f5) {
            this.smoothedLevel = f5;
            return;
        }
        float f6 = this.minMicLevel;
        if (f4 < f6) {
            this.smoothedLevel = f6;
        }
    }

    public float getMinRadius() {
        return this.minRadius;
    }

    /* loaded from: classes.dex */
    public static class Params {
        private final int centerColor;
        public final float circleCenterX;
        public final float circleCenterY;
        private final int haloColor;
        public final float maxRadius;
        public final float minRadius;

        public Params(float f, float f2, float f3, float f4, int i, int i2) {
            this.maxRadius = f;
            this.minRadius = f2;
            this.circleCenterX = f3;
            this.circleCenterY = f4;
            this.centerColor = i;
            this.haloColor = i2;
        }
    }
}
