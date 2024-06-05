package solutions.eve.evelib.geofence.json;

/* loaded from: classes.dex */
public class TriggerAutomation {
    private String action;
    String latitude;
    private String locationID;
    String longitude;

    public TriggerAutomation() {
    }

    public TriggerAutomation(String str, String str2, String str3, String str4) {
        this.locationID = str;
        this.action = str2;
        this.latitude = str3;
        this.longitude = str4;
    }

    public String getLocationID() {
        return this.locationID;
    }

    public void setLocationID(String str) {
        this.locationID = str;
    }

    public String getAction() {
        return this.action;
    }

    public void setAction(String str) {
        this.action = str;
    }

    public String getLatitude() {
        return this.latitude;
    }

    public void setLatitude(String str) {
        this.latitude = str;
    }

    public String getLongitude() {
        return this.longitude;
    }

    public void setLongitude(String str) {
        this.longitude = str;
    }
}
