package solutions.eve.evelib.geofence.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class EVEDevice {

    @SerializedName("base_attributes")
    @Expose
    private DeviceBaseAttributes baseAttributes;

    public DeviceBaseAttributes getBaseAttributes() {
        return this.baseAttributes;
    }

    public void setBaseAttributes(DeviceBaseAttributes deviceBaseAttributes) {
        this.baseAttributes = deviceBaseAttributes;
    }
}
