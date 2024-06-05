package com.uievolution.systemlogger;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/* loaded from: classes.dex */
public class CompoundLogger implements Logger {
    private final List<Logger> a;

    /* loaded from: classes.dex */
    public static class Builder {
        private final List<Logger> a = new ArrayList();

        public Builder add(Logger logger) {
            this.a.add(logger);
            return this;
        }

        public CompoundLogger build() {
            return new CompoundLogger(this);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().d(str, str2);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().e(str, str2);
        }
    }

    public List<Logger> getLoggers() {
        return Collections.unmodifiableList(this.a);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().i(str, str2);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void println(int i, String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().println(i, str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().v(str, str2);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().w(str, str2);
        }
    }

    private CompoundLogger(Builder builder) {
        this.a = builder.a;
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().d(str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().e(str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().i(str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().v(str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().w(str, str2, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().e(str, th);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, Throwable th) {
        Iterator<Logger> it = this.a.iterator();
        while (it.hasNext()) {
            it.next().w(str, th);
        }
    }
}
