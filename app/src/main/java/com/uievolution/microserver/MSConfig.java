package com.uievolution.microserver;

import android.app.Activity;
import android.app.Notification;
import android.os.Parcel;
import android.os.Parcelable;
import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class MSConfig implements Parcelable {
    public static final Parcelable.Creator<MSConfig> CREATOR = new a();
    public static final String LOGTAG = "MSConfig";
    private String a;
    private int b;
    private int c;
    private int d;
    private int e;
    private String f;
    private Notification g;
    private Notification h;
    private long i;
    private long j;
    private byte[] k;
    private String l;
    private byte[] m;
    private HashMap<String, DigestAuth> n;
    private boolean o;

    /* loaded from: classes.dex */
    static class a implements Parcelable.Creator<MSConfig> {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public MSConfig createFromParcel(Parcel parcel) {
            return new MSConfig(parcel, null);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public MSConfig[] newArray(int i) {
            return new MSConfig[i];
        }
    }

    /* synthetic */ MSConfig(Parcel parcel, a aVar) {
        this(parcel);
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public MSConfig disablePacketCapture() {
        this.o = false;
        return this;
    }

    public MSConfig enablePacketCapture() {
        this.o = true;
        return this;
    }

    public String getCloserActivity() {
        return this.a;
    }

    public Map<String, DigestAuth> getDigestAuthMap() {
        return this.n;
    }

    public String getNotificationChannelId() {
        return this.f;
    }

    public Notification getNotificationConnected() {
        return this.h;
    }

    public Notification getNotificationDefault() {
        return this.g;
    }

    public int getNotificationText() {
        return this.d;
    }

    public int getNotificationTickerText() {
        return this.e;
    }

    public int getNotificationTitle() {
        return this.c;
    }

    public String getPassword() {
        return this.l;
    }

    public byte[] getPkcs12() {
        return this.k;
    }

    public int getSmallIcon() {
        return this.b;
    }

    public long getStopForegroundTimerOnDisconnect() {
        return this.j;
    }

    public long getStopForegroundTimerOnStart() {
        return this.i;
    }

    public byte[] getmIntermediateCert() {
        return this.m;
    }

    public boolean isEnablePacketCapture() {
        return this.o;
    }

    public MSConfig setCertificatePkcs12(byte[] bArr, String str) {
        if (str.length() < 50) {
            this.k = bArr;
            this.l = str;
            this.m = null;
            return this;
        }
        throw new IllegalArgumentException("password for PKCS12 must be less than 50 chars.");
    }

    public MSConfig setCloserActivity(Class<? extends Activity> cls) {
        this.a = cls.getName();
        return this;
    }

    public MSConfig setDigestAuth(String str, Map<String, String> map, String str2) {
        this.n.put(str, new DigestAuth(map, str2));
        return this;
    }

    public MSConfig setNotification(Notification notification) {
        this.g = notification;
        this.h = null;
        return this;
    }

    public MSConfig setNotificationChannelId(String str) {
        this.f = str;
        return this;
    }

    public MSConfig setNotificationText(int i) {
        this.d = i;
        return this;
    }

    public MSConfig setNotificationTickerText(int i) {
        this.e = i;
        return this;
    }

    public MSConfig setNotificationTitle(int i) {
        this.c = i;
        return this;
    }

    public MSConfig setSmallIcon(int i) {
        this.b = i;
        return this;
    }

    public MSConfig setStopForegroundTimerOnDisconnect(long j) {
        this.j = j;
        return this;
    }

    public MSConfig setStopForegroundTimerOnStart(long j) {
        this.i = j;
        return this;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i) {
        if (this.a == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeString(this.a);
        }
        parcel.writeInt(this.b);
        parcel.writeInt(this.c);
        parcel.writeInt(this.d);
        parcel.writeInt(this.e);
        parcel.writeString(this.f);
        if (this.g == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeParcelable(this.g, 0);
        }
        if (this.h == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeParcelable(this.h, 0);
        }
        parcel.writeLong(this.i);
        parcel.writeLong(this.j);
        if (this.k == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeByteArray(this.k);
        }
        if (this.l == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeString(this.l);
        }
        if (this.m == null) {
            parcel.writeInt(0);
        } else {
            parcel.writeInt(1);
            parcel.writeByteArray(this.m);
        }
        parcel.writeSerializable(this.n);
        parcel.writeByte(this.o ? (byte) 1 : (byte) 0);
    }

    public MSConfig() {
        this.b = -1;
        this.c = -1;
        this.d = -1;
        this.e = -1;
        this.f = "";
        this.g = null;
        this.h = null;
        this.i = 0L;
        this.j = 0L;
        this.n = new HashMap<>();
        this.o = false;
    }

    public MSConfig setCloserActivity(String str) {
        this.a = str;
        return this;
    }

    public MSConfig setNotification(Notification notification, Notification notification2) {
        this.g = notification;
        this.h = notification2;
        if (notification != null || notification2 == null) {
            return this;
        }
        throw new IllegalArgumentException("notificationDefault should not be null, if notificationConnected is null");
    }

    public MSConfig setCertificatePkcs12(byte[] bArr, String str, byte[] bArr2) {
        if (str.length() < 50) {
            this.k = bArr;
            this.l = str;
            this.m = bArr2;
            return this;
        }
        throw new IllegalArgumentException("password for PKCS12 must be less than 50 chars.");
    }

    private MSConfig(Parcel parcel) {
        this.b = -1;
        this.c = -1;
        this.d = -1;
        this.e = -1;
        this.f = "";
        this.g = null;
        this.h = null;
        this.i = 0L;
        this.j = 0L;
        this.n = new HashMap<>();
        this.o = false;
        if (parcel.readInt() != 0) {
            String readString = parcel.readString();
            this.a = readString;
            if (readString == null) {
                MicroServer.Logger.e(LOGTAG, "mCloserActivity is null");
            }
        }
        this.b = parcel.readInt();
        this.c = parcel.readInt();
        this.d = parcel.readInt();
        this.e = parcel.readInt();
        String readString2 = parcel.readString();
        this.f = readString2;
        if (readString2 == null) {
            MicroServer.Logger.e(LOGTAG, "mNotificationChannelId is null");
        }
        if (parcel.readInt() != 0) {
            Notification notification = (Notification) parcel.readParcelable(Notification.class.getClassLoader());
            this.g = notification;
            if (notification == null) {
                MicroServer.Logger.e(LOGTAG, "mNotificationDefault is null");
            }
        }
        if (parcel.readInt() != 0) {
            Notification notification2 = (Notification) parcel.readParcelable(Notification.class.getClassLoader());
            this.h = notification2;
            if (notification2 == null) {
                MicroServer.Logger.e(LOGTAG, "mNotificationConnected is null");
            }
        }
        this.i = parcel.readLong();
        this.j = parcel.readLong();
        if (parcel.readInt() != 0) {
            byte[] createByteArray = parcel.createByteArray();
            this.k = createByteArray;
            if (createByteArray == null) {
                MicroServer.Logger.e(LOGTAG, "mPkcs12 is null");
            }
        }
        if (parcel.readInt() != 0) {
            String readString3 = parcel.readString();
            this.l = readString3;
            if (readString3 == null) {
                MicroServer.Logger.e(LOGTAG, "mPkcs12Password is null");
            }
        }
        if (parcel.readInt() != 0) {
            byte[] createByteArray2 = parcel.createByteArray();
            this.m = createByteArray2;
            if (createByteArray2 == null) {
                MicroServer.Logger.e(LOGTAG, "mIntermediateCert is null");
            }
        }
        HashMap<String, DigestAuth> hashMap = (HashMap) parcel.readSerializable();
        this.n = hashMap;
        if (hashMap == null) {
            MicroServer.Logger.e(LOGTAG, "mDigestAuthMap is null");
            this.n = new HashMap<>();
        }
        this.o = parcel.readByte() != 0;
    }
}
