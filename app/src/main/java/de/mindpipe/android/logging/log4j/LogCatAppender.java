package de.mindpipe.android.logging.log4j;

import android.util.Log;
import org.apache.log4j.AppenderSkeleton;
import org.apache.log4j.Layout;
import org.apache.log4j.PatternLayout;
import org.apache.log4j.spi.LoggingEvent;

/* loaded from: classes.dex */
public class LogCatAppender extends AppenderSkeleton {
    protected Layout tagLayout;

    @Override // org.apache.log4j.Appender
    public void close() {
    }

    @Override // org.apache.log4j.Appender
    public boolean requiresLayout() {
        return true;
    }

    public LogCatAppender(Layout layout, Layout layout2) {
        this.tagLayout = layout2;
        setLayout(layout);
    }

    public LogCatAppender(Layout layout) {
        this(layout, new PatternLayout("%c"));
    }

    public LogCatAppender() {
        this(new PatternLayout("%m%n"));
    }

    @Override // org.apache.log4j.AppenderSkeleton
    protected void append(LoggingEvent loggingEvent) {
        int i = loggingEvent.getLevel().toInt();
        if (i == 5000) {
            if (loggingEvent.getThrowableInformation() != null) {
                Log.v(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
                return;
            } else {
                Log.v(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
                return;
            }
        }
        if (i == 10000) {
            if (loggingEvent.getThrowableInformation() != null) {
                Log.d(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
                return;
            } else {
                Log.d(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
                return;
            }
        }
        if (i == 20000) {
            if (loggingEvent.getThrowableInformation() != null) {
                Log.i(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
                return;
            } else {
                Log.i(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
                return;
            }
        }
        if (i == 30000) {
            if (loggingEvent.getThrowableInformation() != null) {
                Log.w(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
                return;
            } else {
                Log.w(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
                return;
            }
        }
        if (i == 40000) {
            if (loggingEvent.getThrowableInformation() != null) {
                Log.e(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
                return;
            } else {
                Log.e(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
                return;
            }
        }
        if (i != 50000) {
            return;
        }
        if (loggingEvent.getThrowableInformation() != null) {
            Log.wtf(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent), loggingEvent.getThrowableInformation().getThrowable());
        } else {
            Log.wtf(getTagLayout().format(loggingEvent), getLayout().format(loggingEvent));
        }
    }

    public Layout getTagLayout() {
        return this.tagLayout;
    }

    public void setTagLayout(Layout layout) {
        this.tagLayout = layout;
    }
}
