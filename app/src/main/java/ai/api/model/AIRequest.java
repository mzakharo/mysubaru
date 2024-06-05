package ai.api.model;

import ai.api.util.StringUtils;
import androidx.core.app.NotificationCompat;
import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/* loaded from: classes.dex */
public class AIRequest extends QuestionMetadata implements Serializable {
    private static final long serialVersionUID = 1;

    @SerializedName("confidence")
    private float[] confidence;

    @SerializedName("contexts")
    private List<AIContext> contexts;

    @SerializedName(NotificationCompat.CATEGORY_EVENT)
    private AIEvent event;
    private AIOriginalRequest originalRequest;

    @SerializedName("query")
    private String[] query;

    @SerializedName("resetContexts")
    private Boolean resetContexts;

    public AIRequest() {
    }

    public AIRequest(String str) {
        setQuery(str);
    }

    public void setQuery(String str) {
        this.query = StringUtils.isEmpty(str) ? null : new String[]{str};
        this.confidence = null;
    }

    public void setQuery(String[] strArr, float[] fArr) {
        if (strArr == null) {
            throw new IllegalStateException("Query array must not be null");
        }
        if (fArr == null && strArr.length > 1) {
            throw new IllegalStateException("Then confidences array is null, query must be one or zero item length");
        }
        if (fArr != null && strArr.length != fArr.length) {
            throw new IllegalStateException("Query and confidence arrays must be equals size");
        }
        this.query = strArr;
        this.confidence = fArr;
    }

    public float[] getConfidence() {
        return this.confidence;
    }

    public void setConfidence(float[] fArr) {
        this.confidence = fArr;
    }

    public void setResetContexts(Boolean bool) {
        this.resetContexts = bool;
    }

    public Boolean getResetContexts() {
        return this.resetContexts;
    }

    public void setContexts(List<AIContext> list) {
        this.contexts = list;
    }

    public void addContext(AIContext aIContext) {
        if (this.contexts == null) {
            this.contexts = new ArrayList(1);
        }
        this.contexts.add(aIContext);
    }

    public void setEvent(AIEvent aIEvent) {
        this.event = aIEvent;
    }

    public final AIOriginalRequest getOriginalRequest() {
        return this.originalRequest;
    }

    public final void setOriginalRequest(AIOriginalRequest aIOriginalRequest) {
        this.originalRequest = aIOriginalRequest;
    }

    @Override // ai.api.model.QuestionMetadata
    public String toString() {
        return String.format("AIRequest{query=%s, resetContexts=%s, language='%s', timezone='%s'}", Arrays.toString(this.query), this.resetContexts, getLanguage(), getTimezone());
    }
}
