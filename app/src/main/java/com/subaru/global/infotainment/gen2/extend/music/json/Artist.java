package com.subaru.global.infotainment.gen2.extend.music.json;

import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class Artist {

    @SerializedName("artist_id")
    private String artistId;
    private String name;

    public String getArtistId() {
        return this.artistId;
    }

    public void setArtistId(String str) {
        this.artistId = str;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String str) {
        this.name = str;
    }
}
