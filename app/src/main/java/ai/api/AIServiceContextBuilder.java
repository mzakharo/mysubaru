package ai.api;

import java.util.TimeZone;
import java.util.UUID;

/* loaded from: classes.dex */
public class AIServiceContextBuilder {
    private String sessionId;
    private TimeZone timeZone;

    public String getSessionId() {
        return this.sessionId;
    }

    public AIServiceContextBuilder setSessionId(String str) {
        if (str == null) {
            throw new IllegalArgumentException("sessionId cannot be null");
        }
        this.sessionId = str;
        return this;
    }

    public AIServiceContextBuilder generateSessionId() {
        this.sessionId = createRandomSessionId();
        return this;
    }

    public TimeZone getTimeZone() {
        return this.timeZone;
    }

    public AIServiceContextBuilder setTimeZone(TimeZone timeZone) {
        this.timeZone = timeZone;
        return this;
    }

    @Deprecated
    public AIServiceContextBuilder setSessionId(TimeZone timeZone) {
        this.timeZone = timeZone;
        return this;
    }

    public AIServiceContext build() {
        if (this.sessionId == null) {
            throw new IllegalStateException("Session id is undefined");
        }
        return new PlainAIServiceContext(this.sessionId, this.timeZone);
    }

    public static AIServiceContext buildFromSessionId(String str) {
        return new AIServiceContextBuilder().setSessionId(str).build();
    }

    private static String createRandomSessionId() {
        return UUID.randomUUID().toString();
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class PlainAIServiceContext implements AIServiceContext {
        static final /* synthetic */ boolean $assertionsDisabled = false;
        private final String sessionId;
        private final TimeZone timeZone;

        public PlainAIServiceContext(String str, TimeZone timeZone) {
            this.sessionId = str;
            this.timeZone = timeZone;
        }

        @Override // ai.api.AIServiceContext
        public String getSessionId() {
            return this.sessionId;
        }

        @Override // ai.api.AIServiceContext
        public TimeZone getTimeZone() {
            return this.timeZone;
        }
    }
}
