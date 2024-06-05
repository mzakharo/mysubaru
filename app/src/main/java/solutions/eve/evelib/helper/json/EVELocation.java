package solutions.eve.evelib.helper.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class EVELocation {

    @SerializedName("arrivingConfirmation")
    @Expose
    private Boolean arrivingConfirmation;

    @SerializedName("distancearriving")
    @Expose
    private Integer distancearriving;

    @SerializedName("distanceleaving")
    @Expose
    private Integer distanceleaving;

    @SerializedName("distanceonway")
    @Expose
    private Integer distanceonway;

    @SerializedName("hasarriving")
    @Expose
    private Boolean hasarriving;

    @SerializedName("hasleaving")
    @Expose
    private Boolean hasleaving;

    @SerializedName("hasonway")
    @Expose
    private Boolean hasonway;

    @SerializedName("latitude")
    @Expose
    private Double latitude;

    @SerializedName("leavingConfirmation")
    @Expose
    private Boolean leavingConfirmation;

    @SerializedName("locationID")
    @Expose
    private Integer locationID;

    @SerializedName("locationName")
    @Expose
    private String locationName;

    @SerializedName("longitude")
    @Expose
    private Double longitude;

    @SerializedName("onwayConfirmation")
    @Expose
    private Boolean onwayConfirmation;

    public Boolean getOnwayConfirmation() {
        return this.onwayConfirmation;
    }

    public void setOnwayConfirmation(Boolean bool) {
        this.onwayConfirmation = bool;
    }

    public Integer getLocationID() {
        return this.locationID;
    }

    public void setLocationID(Integer num) {
        this.locationID = num;
    }

    public Boolean getHasonway() {
        return this.hasonway;
    }

    public void setHasonway(Boolean bool) {
        this.hasonway = bool;
    }

    public Boolean getArrivingConfirmation() {
        return this.arrivingConfirmation;
    }

    public void setArrivingConfirmation(Boolean bool) {
        this.arrivingConfirmation = bool;
    }

    public Boolean getHasarriving() {
        return this.hasarriving;
    }

    public void setHasarriving(Boolean bool) {
        this.hasarriving = bool;
    }

    public Boolean getHasleaving() {
        return this.hasleaving;
    }

    public void setHasleaving(Boolean bool) {
        this.hasleaving = bool;
    }

    public String getLocationName() {
        return this.locationName;
    }

    public void setLocationName(String str) {
        this.locationName = str;
    }

    public Integer getDistancearriving() {
        return this.distancearriving;
    }

    public void setDistancearriving(Integer num) {
        this.distancearriving = num;
    }

    public Integer getDistanceonway() {
        return this.distanceonway;
    }

    public void setDistanceonway(Integer num) {
        this.distanceonway = num;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(Double d) {
        this.longitude = d;
    }

    public Boolean getLeavingConfirmation() {
        return this.leavingConfirmation;
    }

    public void setLeavingConfirmation(Boolean bool) {
        this.leavingConfirmation = bool;
    }

    public Integer getDistanceleaving() {
        return this.distanceleaving;
    }

    public void setDistanceleaving(Integer num) {
        this.distanceleaving = num;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(Double d) {
        this.latitude = d;
    }
}
