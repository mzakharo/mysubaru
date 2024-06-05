package com.subaru.global.infotainment.gen2.extend.music.json;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/* loaded from: classes.dex */
public class TrackRes {

    @SerializedName("return_cd")
    private String returnCd;

    @SerializedName("searchcount")
    private String searchCount;
    private List<Track> track;

    public String getReturnCd() {
        return this.returnCd;
    }

    public void setReturnCd(String str) {
        this.returnCd = str;
    }

    public List<Track> getTrack() {
        return this.track;
    }

    public void setTrack(List<Track> list) {
        this.track = list;
    }

    public String getSearchCount() {
        return this.searchCount;
    }

    public void setSearchCount(String str) {
        this.searchCount = str;
    }
}
