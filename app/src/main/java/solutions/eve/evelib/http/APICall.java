package solutions.eve.evelib.http;

import java.io.IOException;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;
import okio.Timeout;

/* loaded from: classes.dex */
public final class APICall implements Call, Cancelable {
    private final Call mCall;

    public APICall(Call call) {
        this.mCall = call;
    }

    @Override // okhttp3.Call
    public Request request() {
        return this.mCall.request();
    }

    @Override // okhttp3.Call
    public Response execute() throws IOException {
        return this.mCall.execute();
    }

    @Override // okhttp3.Call
    public void enqueue(Callback callback) {
        this.mCall.enqueue(callback);
    }

    @Override // okhttp3.Call
    public void cancel() {
        this.mCall.cancel();
    }

    @Override // okhttp3.Call
    public boolean isExecuted() {
        return this.mCall.isExecuted();
    }

    @Override // okhttp3.Call
    public boolean isCanceled() {
        return this.mCall.isCanceled();
    }

    @Override
    public Timeout timeout() {
        return null;
    }

    @Override // okhttp3.Call
    public Call clone() {
        return new APICall(this.mCall.clone());
    }
}
