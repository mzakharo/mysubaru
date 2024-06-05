package solutions.eve.evelib.helper.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import java.util.List;

/* loaded from: classes.dex */
public class EVEConnectConfiguration {

    @SerializedName("hasIFTTT")
    @Expose
    private Boolean hasIFTTT;

    @SerializedName("hassmarthome")
    @Expose
    private Boolean hassmarthome;

    @SerializedName("IFTTTusingArrivingHome")
    @Expose
    private Boolean iFTTTusingArrivingHome;

    @SerializedName("IFTTTusingLeavingHome")
    @Expose
    private Boolean iFTTTusingLeavingHome;

    @SerializedName("IFTTTusingOnTheWayHome")
    @Expose
    private Boolean iFTTTusingOnTheWayHome;

    @SerializedName("locations")
    @Expose
    private List<EVELocation> locations = null;

    public Boolean getIFTTTusingArrivingHome() {
        return this.iFTTTusingArrivingHome;
    }

    public void setIFTTTusingArrivingHome(Boolean bool) {
        this.iFTTTusingArrivingHome = bool;
    }

    public List<EVELocation> getLocations() {
        return this.locations;
    }

    public void setLocations(List<EVELocation> list) {
        this.locations = list;
    }

    public Boolean getHassmarthome() {
        return this.hassmarthome;
    }

    public void setHassmarthome(Boolean bool) {
        this.hassmarthome = bool;
    }

    public Boolean getIFTTTusingOnTheWayHome() {
        return this.iFTTTusingOnTheWayHome;
    }

    public void setIFTTTusingOnTheWayHome(Boolean bool) {
        this.iFTTTusingOnTheWayHome = bool;
    }

    public Boolean getHasIFTTT() {
        return this.hasIFTTT;
    }

    public void setHasIFTTT(Boolean bool) {
        this.hasIFTTT = bool;
    }

    public Boolean getIFTTTusingLeavingHome() {
        return this.iFTTTusingLeavingHome;
    }

    public void setIFTTTusingLeavingHome(Boolean bool) {
        this.iFTTTusingLeavingHome = bool;
    }
}
