package solutions.eve.evelib.helper.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class Token {

    @SerializedName("driverid")
    @Expose
    public String driverid;

    @SerializedName("jwt")
    @Expose
    public String jwt;

    @SerializedName("jwt_expiry")
    @Expose
    public int jwtExpiry;

    @SerializedName("refreshToken")
    @Expose
    public String refreshToken;

    @SerializedName("status")
    @Expose
    public boolean status;

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public void setRefreshToken(String str) {
        this.refreshToken = str;
    }

    public int getJwtExpiry() {
        return this.jwtExpiry;
    }

    public void setJwtExpiry(int i) {
        this.jwtExpiry = i;
    }

    public boolean isStatus() {
        return this.status;
    }

    public void setStatus(boolean z) {
        this.status = z;
    }

    public String getJwt() {
        return this.jwt;
    }

    public void setJwt(String str) {
        this.jwt = str;
    }

    public String getDriverid() {
        return this.driverid;
    }

    public void setDriverid(String str) {
        this.driverid = str;
    }
}
