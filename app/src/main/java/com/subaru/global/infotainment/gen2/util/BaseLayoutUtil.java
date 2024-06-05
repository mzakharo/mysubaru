package com.subaru.global.infotainment.gen2.util;

import android.graphics.Point;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;
import com.android.lib.mcm.application.MCApplication;

/* loaded from: classes.dex */
public class BaseLayoutUtil {
    private static BaseLayoutUtil instance;
    private float mScale = 0.0f;

    private BaseLayoutUtil() {
        getScale();
    }

    public static BaseLayoutUtil getInstance() {
        if (instance == null) {
            instance = new BaseLayoutUtil();
        }
        return instance;
    }

    private void getScale() {
        Display display = getDisplay();
        display.getSize(new Point());
        DisplayMetrics displayMetrics = new DisplayMetrics();
        display.getMetrics(displayMetrics);
        this.mScale = displayMetrics.scaledDensity;
    }

    public int getImageSize(int i) {
        return (int) (i * this.mScale);
    }

    private Display getDisplay() {
        WindowManager windowManager = (WindowManager) MCApplication.getInstance().getSystemService("window");
        if (windowManager == null) {
            return null;
        }
        return windowManager.getDefaultDisplay();
    }

    public int getDisplayHeight() {
        Display display = getDisplay();
        Point point = new Point();
        display.getSize(point);
        return point.y;
    }

    public int getDisplayWidth() {
        Display display = getDisplay();
        Point point = new Point();
        display.getSize(point);
        return point.x;
    }
}
