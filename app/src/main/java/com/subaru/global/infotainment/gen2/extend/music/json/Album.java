package com.subaru.global.infotainment.gen2.extend.music.json;

import com.google.gson.annotations.SerializedName;

/* loaded from: classes.dex */
public class Album {

    @SerializedName("album_id")
    private String albumId;
    private String name;

    public String getAlbumId() {
        return this.albumId;
    }

    public void setAlbumId(String str) {
        this.albumId = str;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String str) {
        this.name = str;
    }
}
