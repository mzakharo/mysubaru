package ai.api.model;

import ai.api.util.StringUtils;
import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/* loaded from: classes.dex */
public class QuestionMetadata implements Serializable {
    private static final long serialVersionUID = 1;

    @SerializedName("entities")
    private List<Entity> entities;

    @SerializedName("lang")
    private String language;

    @SerializedName("location")
    private Location location;

    @SerializedName("sessionId")
    private String sessionId;

    @SerializedName("timezone")
    private String timezone;

    public String getTimezone() {
        return this.timezone;
    }

    public void setTimezone(String str) {
        this.timezone = str;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String str) {
        if (StringUtils.isEmpty(str)) {
            throw new IllegalArgumentException("language must not be null");
        }
        this.language = str;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String str) {
        this.sessionId = str;
    }

    public List<Entity> getEntities() {
        return this.entities;
    }

    public void setEntities(List<Entity> list) {
        this.entities = list;
    }

    public void addEntity(Entity entity) {
        if (this.entities == null) {
            this.entities = new ArrayList();
        }
        this.entities.add(entity);
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String toString() {
        return String.format("QuestionMetadata{language='%s', timezone='%s'}", this.language, this.timezone);
    }
}
