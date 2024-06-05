package solutions.eve.evelib.geofence.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class AutomationData {

    @SerializedName("devices")
    @Expose
    private String devices = null;

    @SerializedName("unverifiablescenes")
    @Expose
    private Boolean unverifiablescenes;

    public String getDevices() {
        return this.devices;
    }

    public void setDevices(String str) {
        this.devices = str;
    }

    public Boolean getUnverifiablescenes() {
        return this.unverifiablescenes;
    }

    public void setUnverifiablescenes(Boolean bool) {
        this.unverifiablescenes = bool;
    }
}
