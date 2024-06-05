package com.uievolution.systemlogger;

import android.util.Log;

/* loaded from: classes.dex */
public class LogcatLogger implements Logger {
    private final int a;

    /* loaded from: classes.dex */
    public static class Builder {
        private int a = 2;

        public LogcatLogger build() {
            return new LogcatLogger(this);
        }

        public Builder minPriority(int i) {
            this.a = i;
            return this;
        }
    }

    public LogcatLogger(Builder builder) {
        this.a = builder.a;
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2) {
        println(3, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2) {
        println(6, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2) {
        println(4, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void println(int i, String str, String str2, Throwable th) {
        if (i < this.a) {
            return;
        }
        if (str2 != null && th != null) {
            Log.println(i, str, str2 + "¥n" + Log.getStackTraceString(th));
            return;
        }
        if (str2 != null) {
            Log.println(i, str, str2);
        } else if (th != null) {
            Log.println(i, str, Log.getStackTraceString(th));
        } else {
            Log.println(i, str, null);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2) {
        println(2, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2) {
        println(5, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2, Throwable th) {
        println(3, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2, Throwable th) {
        println(6, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2, Throwable th) {
        println(4, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2, Throwable th) {
        println(2, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2, Throwable th) {
        println(5, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, Throwable th) {
        println(6, str, null, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, Throwable th) {
        println(5, str, null, th);
    }
}
