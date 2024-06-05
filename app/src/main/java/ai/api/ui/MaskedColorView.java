package ai.api.ui;

import com.example.mysubaru.R;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.graphics.PorterDuff;
import android.os.Build;
import android.util.AttributeSet;
import android.widget.ImageView;

/* loaded from: classes.dex */
public class MaskedColorView extends ImageView {
    private ColorStateList colorStateList;

    public MaskedColorView(Context context) {
        super(context, null);
        this.colorStateList = null;
    }

    public MaskedColorView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet, R.attr.imageButtonStyle);
        this.colorStateList = null;
        configure(attributeSet);
    }

    public MaskedColorView(Context context, AttributeSet attributeSet, int i) {
        super(context, attributeSet, i);
        this.colorStateList = null;
        configure(attributeSet);
    }

    @Override // android.widget.ImageView, android.view.View
    protected void drawableStateChanged() {
        super.drawableStateChanged();
        setColorFilter(getCurrentColor(getDrawableState()), PorterDuff.Mode.SRC_ATOP);
        if (Build.VERSION.SDK_INT >= 11) {
            jumpDrawablesToCurrentState();
        }
    }

    public void setColorStateList(ColorStateList colorStateList) {
        this.colorStateList = colorStateList;
    }

    private int getCurrentColor(int[] iArr) {
        ColorStateList colorStateList = this.colorStateList;
        if (colorStateList == null) {
            return -65281;
        }
        return colorStateList.getColorForState(iArr, colorStateList.getDefaultColor());
    }

    private void configure(AttributeSet attributeSet) {
        if (attributeSet != null) {
            TypedArray obtainStyledAttributes = getContext().obtainStyledAttributes(attributeSet, ai.api.R.styleable.MaskedColorView);
            try {
                ColorStateList colorStateList = obtainStyledAttributes.getColorStateList(ai.api.R.styleable.MaskedColorView_mainColor);
                if (colorStateList != null) {
                    this.colorStateList = colorStateList;
                }
            } finally {
                obtainStyledAttributes.recycle();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public String getDebugState() {
        StringBuilder sb = new StringBuilder();
        sb.append("====\ncsl is ");
        sb.append(this.colorStateList != null ? "NOT" : "");
        sb.append(" null");
        return sb.toString();
    }
}
