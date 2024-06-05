package com.uievolution.microserver;

/* loaded from: classes.dex */
public interface MSModule {

    /* loaded from: classes.dex */
    public enum Requester {
        HeadUnit,
        HandSet
    }

    void cancel();

    void finished();

    void init(HttpRequestInfo httpRequestInfo, InBlockingQueue inBlockingQueue, OutBlockingQueue outBlockingQueue, UAConnectionCloser uAConnectionCloser, String str);

    void setDigestAuth(DigestAuth digestAuth);

    byte[] start();
}
