package ai.api.model;

import com.google.gson.annotations.SerializedName;
import com.harman.services.maps.MapUtils;
import java.io.Serializable;
import java.util.Map;

/* loaded from: classes.dex */
public class AIContext implements Serializable {
    private static final long serialVersionUID = 1;

    @SerializedName("lifespan")
    private Integer lifespan;

    @SerializedName("name")
    private String name;

    @SerializedName(MapUtils.KEY_MAP_SUBSCRIPTION_PARAMETER)
    private Map<String, String> parameters;

    public AIContext() {
    }

    public AIContext(String str) {
        this.name = str;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String str) {
        this.name = str;
    }

    public Map<String, String> getParameters() {
        return this.parameters;
    }

    public void setParameters(Map<String, String> map) {
        this.parameters = map;
    }

    public Integer getLifespan() {
        return this.lifespan;
    }

    public void setLifespan(Integer num) {
        this.lifespan = num;
    }
}
