package solutions.eve.evelib.helper.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class EVEConnect {

    @SerializedName("EVEConnectConfiguration")
    @Expose
    private EVEConnectConfiguration eVEConnectConfiguration;

    public EVEConnectConfiguration getEVEConnectConfiguration() {
        return this.eVEConnectConfiguration;
    }

    public void setEVEConnectConfiguration(EVEConnectConfiguration eVEConnectConfiguration) {
        this.eVEConnectConfiguration = eVEConnectConfiguration;
    }
}
