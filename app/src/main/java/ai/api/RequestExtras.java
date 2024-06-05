package ai.api;

import ai.api.model.AIContext;
import ai.api.model.AIRequest;
import ai.api.model.Entity;
import ai.api.model.Location;
import java.util.List;
import java.util.Map;

/* loaded from: classes.dex */
public class RequestExtras {
    private Map<String, String> additionalHeaders;
    private List<AIContext> contexts;
    private List<Entity> entities;
    private Location location;
    private Boolean resetContexts;

    public RequestExtras() {
        this.contexts = null;
        this.entities = null;
    }

    public RequestExtras(List<AIContext> list, List<Entity> list2) {
        this.contexts = list;
        this.entities = list2;
    }

    public List<AIContext> getContexts() {
        return this.contexts;
    }

    public void setContexts(List<AIContext> list) {
        this.contexts = list;
    }

    public List<Entity> getEntities() {
        return this.entities;
    }

    public void setEntities(List<Entity> list) {
        this.entities = list;
    }

    public Boolean getResetContexts() {
        return this.resetContexts;
    }

    public void setResetContexts(boolean z) {
        this.resetContexts = Boolean.valueOf(z);
    }

    public Map<String, String> getAdditionalHeaders() {
        return this.additionalHeaders;
    }

    public void setAdditionalHeaders(Map<String, String> map) {
        this.additionalHeaders = map;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public boolean hasContexts() {
        List<AIContext> list = this.contexts;
        return (list == null || list.isEmpty()) ? false : true;
    }

    public boolean hasEntities() {
        List<Entity> list = this.entities;
        return (list == null || list.isEmpty()) ? false : true;
    }

    public boolean hasAdditionalHeaders() {
        Map<String, String> map = this.additionalHeaders;
        return (map == null || map.isEmpty()) ? false : true;
    }

    public void copyTo(AIRequest aIRequest) {
        if (hasContexts()) {
            aIRequest.setContexts(getContexts());
        }
        if (hasEntities()) {
            aIRequest.setEntities(getEntities());
        }
        if (getResetContexts() != null) {
            aIRequest.setResetContexts(getResetContexts());
        }
    }
}
