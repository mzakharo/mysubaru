package solutions.eve.evelib.geofence.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class DeviceBaseAttributes {

    @SerializedName("id")
    @Expose
    private Integer id;

    @SerializedName("name")
    @Expose
    private Object name;

    @SerializedName("orig_units")
    @Expose
    private String origUnits;

    @SerializedName("source")
    @Expose
    private String source;

    @SerializedName("type")
    @Expose
    private String type;

    public String getSource() {
        return this.source;
    }

    public void setSource(String str) {
        this.source = str;
    }

    public Object getName() {
        return this.name;
    }

    public void setName(Object obj) {
        this.name = obj;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer num) {
        this.id = num;
    }

    public String getOrigUnits() {
        return this.origUnits;
    }

    public void setOrigUnits(String str) {
        this.origUnits = str;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String str) {
        this.type = str;
    }
}
