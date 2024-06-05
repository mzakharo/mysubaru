package com.subaru.global.infotainment.gen2.extend.music.json;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/* loaded from: classes.dex */
public class ArtistRes {
    private List<Artist> artist;

    @SerializedName("return_cd")
    private String returnCd;

    @SerializedName("searchcount")
    private String searchCount;

    public String getReturnCd() {
        return this.returnCd;
    }

    public void setReturnCd(String str) {
        this.returnCd = str;
    }

    public List<Artist> getArtist() {
        return this.artist;
    }

    public void setArtist(List<Artist> list) {
        this.artist = list;
    }

    public String getSearchCount() {
        return this.searchCount;
    }

    public void setSearchCount(String str) {
        this.searchCount = str;
    }
}
