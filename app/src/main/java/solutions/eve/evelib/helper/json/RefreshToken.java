package solutions.eve.evelib.helper.json;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class RefreshToken {

    @SerializedName("jwt")
    @Expose
    private String jwt;

    @SerializedName("jwt_expiry")
    @Expose
    private Integer jwtExpiry;

    @SerializedName("refreshToken")
    @Expose
    private String refreshToken;

    @SerializedName("status")
    @Expose
    private Boolean status;

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public void setRefreshToken(String str) {
        this.refreshToken = str;
    }

    public Integer getJwtExpiry() {
        return this.jwtExpiry;
    }

    public void setJwtExpiry(Integer num) {
        this.jwtExpiry = num;
    }

    public Boolean getStatus() {
        return this.status;
    }

    public void setStatus(Boolean bool) {
        this.status = bool;
    }

    public String getJwt() {
        return this.jwt;
    }

    public void setJwt(String str) {
        this.jwt = str;
    }
}
