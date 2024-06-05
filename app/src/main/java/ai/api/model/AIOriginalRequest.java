package ai.api.model;

import java.util.Map;

/* loaded from: classes.dex */
public class AIOriginalRequest {
    private Map<String, Object> data;
    private String source;

    public final String getSource() {
        return this.source;
    }

    public final void setSource(String str) {
        this.source = str;
    }

    public final Map<String, ? extends Object> getData() {
        return this.data;
    }

    public final void setData(Map<String, ? extends Object> map) {
        this.data = (Map<String, Object>) map;
    }
}
