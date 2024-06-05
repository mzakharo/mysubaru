package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class VersionInfo {
    String m_dateTime;
    int m_id;
    String m_name;

    public VersionInfo(int i, String str, String str2) {
        this.m_id = i;
        this.m_name = str;
        this.m_dateTime = str2;
    }

    public int getId() {
        return this.m_id;
    }

    public String getName() {
        return this.m_name;
    }

    public String getDateTime() {
        return this.m_dateTime;
    }
}
