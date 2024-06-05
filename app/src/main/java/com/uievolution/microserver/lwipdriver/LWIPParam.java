package com.uievolution.microserver.lwipdriver;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.utils.PropertiesConfiguration;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

/* loaded from: classes.dex */
public class LWIPParam implements Parcelable, Cloneable {
    public static final Parcelable.Creator<LWIPParam> CREATOR = new a();
    public static final String PROP_LWIP_ADDR = "lwip.addr";
    public static final String PROP_LWIP_BT_RESTART_PROCESS_PER_CONNECTION = "lwip.bt.restart_process_per_sppconnection";
    public static final String PROP_LWIP_BT_SERVICENAME = "lwip.bt.servicename";
    public static final String PROP_LWIP_BT_UUID = "lwip.bt.uuid";
    public static final String PROP_LWIP_NETMASK = "lwip.netmask";
    public static final String PROP_LWIP_PORT_HTTP = "lwip.port";
    public static final String PROP_LWIP_PORT_HTTPS = "lwip.port.https";
    public static final String PROP_LWIP_SERVER = "lwip.server";
    public static final String PROP_LWIP_TYPE = "lwip.type";
    public static final String PROP_LWIP_WIFI_ADDR = "lwip.wifi.addr";
    public static final String PROP_LWIP_WIFI_PORT = "lwip.wifi.port";
    static String l = "LWIPParam";
    private Type a;
    private boolean b;
    private String c;
    private String d;
    private int e;
    private int f;
    private List<UUID> g;
    private String h;
    private int i;
    private String j;
    private boolean k;

    /* loaded from: classes.dex */
    static class a implements Parcelable.Creator<LWIPParam> {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public LWIPParam createFromParcel(Parcel parcel) {
            return new LWIPParam(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public LWIPParam[] newArray(int i) {
            return new LWIPParam[i];
        }
    }

    LWIPParam() {
        this.a = Type.None;
        this.b = true;
        this.c = MicroServer.DEFAULT_LWIP_ADDR;
        this.d = MicroServer.DEFAULT_LWIP_NETMASK;
        this.e = 80;
        this.f = MicroServer.DEFAULT_LWIP_PORT_HTTPS;
        this.h = "";
        this.i = -1;
        this.j = "";
        this.k = false;
    }

    private static String a(List<UUID> list) {
        StringBuilder sb = new StringBuilder();
        Iterator<UUID> it = list.iterator();
        while (it.hasNext()) {
            sb.append(it.next());
            if (it.hasNext()) {
                sb.append(',');
            }
        }
        return sb.toString();
    }

    public static LWIPParam load(PropertiesConfiguration propertiesConfiguration) {
        LWIPParam lWIPParam = new LWIPParam();
        lWIPParam.setType(Type.valueOf(propertiesConfiguration.getInt(PROP_LWIP_TYPE, Type.None.getValue())));
        lWIPParam.setServer(propertiesConfiguration.getBoolean(PROP_LWIP_SERVER, true));
        lWIPParam.setAddr(propertiesConfiguration.getString(PROP_LWIP_ADDR, MicroServer.DEFAULT_LWIP_ADDR));
        lWIPParam.setNetmask(propertiesConfiguration.getString(PROP_LWIP_NETMASK, MicroServer.DEFAULT_LWIP_NETMASK));
        lWIPParam.setHttpPort(propertiesConfiguration.getInt(PROP_LWIP_PORT_HTTP, 80));
        lWIPParam.setHttpsPort(propertiesConfiguration.getInt(PROP_LWIP_PORT_HTTPS, MicroServer.DEFAULT_LWIP_PORT_HTTPS));
        lWIPParam.setUuids(propertiesConfiguration.getString(PROP_LWIP_BT_UUID, MicroServer.DEFAULT_LWIP_UUID));
        lWIPParam.setServiceName(propertiesConfiguration.getString(PROP_LWIP_BT_SERVICENAME, MicroServer.DEFAULT_LWIP_SERVICE_NAME));
        lWIPParam.setWiFiPort(propertiesConfiguration.getInt(PROP_LWIP_WIFI_PORT, MicroServer.DEFAULT_LWIP_WIFI_PORT));
        lWIPParam.setWiFiAddr(propertiesConfiguration.getString(PROP_LWIP_WIFI_ADDR));
        Log.d(l, "loaded. " + lWIPParam);
        return lWIPParam;
    }

    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public LWIPParam disablePcap() {
        this.k = false;
        return this;
    }

    public LWIPParam enablePcap() {
        this.k = true;
        return this;
    }

    public String getAddr() {
        return this.c;
    }

    public UUID getFirstUuid() {
        return this.g.get(0);
    }

    public int getHttpPort() {
        return this.e;
    }

    public int getHttpsPort() {
        return this.f;
    }

    public String getNetmask() {
        return this.d;
    }

    public String getServiceName() {
        return this.h;
    }

    public Type getType() {
        return this.a;
    }

    public List<UUID> getUuids() {
        return this.g;
    }

    public String getWiFiAddr() {
        return this.j;
    }

    public int getWiFiPort() {
        return this.i;
    }

    public boolean isEnablePcap() {
        return this.k;
    }

    public boolean isServer() {
        return this.b;
    }

    public LWIPParam setAddr(String str) {
        this.c = str;
        return this;
    }

    public LWIPParam setHttpPort(int i) {
        this.e = i;
        return this;
    }

    public LWIPParam setHttpsPort(int i) {
        this.f = i;
        return this;
    }

    public LWIPParam setNetmask(String str) {
        this.d = str;
        return this;
    }

    public LWIPParam setServer(boolean z) {
        this.b = z;
        return this;
    }

    public LWIPParam setServiceName(String str) {
        this.h = str;
        return this;
    }

    public LWIPParam setType(Type type) {
        this.a = type;
        return this;
    }

    public LWIPParam setUuids(String str) {
        this.g = a(str);
        return this;
    }

    public LWIPParam setWiFiAddr(String str) {
        this.j = str;
        return this;
    }

    public LWIPParam setWiFiPort(int i) {
        this.i = i;
        return this;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("type: " + this.a);
        sb.append(", server: " + this.b);
        sb.append(", addr: " + this.c);
        sb.append(", netmask: " + this.d);
        sb.append(", HTTP port: " + this.e);
        sb.append(", HTTPS port: " + this.f);
        sb.append(", uuid: " + a(this.g));
        sb.append(", service name: " + this.h);
        sb.append(", wifi port: " + this.i);
        sb.append(", wifi addr: " + this.j);
        sb.append(", enable pcap: " + this.k);
        return sb.toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.a.name());
        parcel.writeString(Boolean.toString(this.b));
        parcel.writeString(this.c);
        parcel.writeString(this.d);
        parcel.writeInt(this.e);
        parcel.writeInt(this.f);
        parcel.writeString(a(this.g));
        parcel.writeString(this.h);
        parcel.writeInt(this.i);
        parcel.writeString(this.j);
        parcel.writeByte(this.k ? (byte) 1 : (byte) 0);
    }

    private static List<UUID> a(String str) {
        ArrayList arrayList = new ArrayList();
        for (String str2 : str.split(",")) {
            try {
                arrayList.add(UUID.fromString(str2));
            } catch (IllegalArgumentException unused) {
                MicroServer.Logger.d(l, "uuid is not formatted correctly." + str2);
            } catch (NullPointerException unused2) {
            }
        }
        return arrayList;
    }

    LWIPParam(Parcel parcel) {
        this.a = Type.None;
        this.b = true;
        this.c = MicroServer.DEFAULT_LWIP_ADDR;
        this.d = MicroServer.DEFAULT_LWIP_NETMASK;
        this.e = 80;
        this.f = MicroServer.DEFAULT_LWIP_PORT_HTTPS;
        this.h = "";
        this.i = -1;
        this.j = "";
        this.k = false;
        this.a = Type.valueOf(parcel.readString());
        this.b = Boolean.parseBoolean(parcel.readString());
        this.c = parcel.readString();
        this.d = parcel.readString();
        this.e = parcel.readInt();
        this.f = parcel.readInt();
        this.g = a(parcel.readString());
        this.h = parcel.readString();
        this.i = parcel.readInt();
        this.j = parcel.readString();
        this.k = parcel.readByte() != 0;
    }
}
