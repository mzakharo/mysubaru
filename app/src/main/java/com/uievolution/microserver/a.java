package com.uievolution.microserver;

import android.os.Build;
import java.util.ArrayList;
import java.util.Iterator;
import org.slf4j.Marker;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public final class a {
    static long a;

    /* renamed from: com.uievolution.microserver.a$a, reason: collision with other inner class name */
    /* loaded from: classes.dex */
    static class C0016a {
        private String a;
        private String b;
        private int c;
        private int d;
        private long e;

        C0016a(String str, String str2, int i, int i2, long j) {
            this.a = str;
            this.b = str2;
            this.c = i;
            this.d = i2;
            this.e = j;
        }

        Long a() {
            if (!this.a.equals(Build.MANUFACTURER)) {
                return null;
            }
            if (!this.b.equals(Marker.ANY_MARKER) && !this.b.equals(Build.MODEL)) {
                return null;
            }
            int i = this.c;
            int i2 = Build.VERSION.SDK_INT;
            if (i > i2 || i2 > this.d) {
                return null;
            }
            return Long.valueOf(this.e);
        }
    }

    static {
        ArrayList arrayList = new ArrayList();
        arrayList.add(new C0016a("FUJITSU", "F-10D", 0, 15, 1L));
        arrayList.add(new C0016a("HUAWEI", "201HW", 0, 15, 1L));
        arrayList.add(new C0016a("HTC", "HTC22", 0, 17, 1L));
        arrayList.add(new C0016a("HTC", "HTC21", 0, 16, 1L));
        Iterator it = arrayList.iterator();
        while (true) {
            if (!it.hasNext()) {
                break;
            }
            Long a2 = ((C0016a) it.next()).a();
            if (a2 != null) {
                a = a2.longValue();
                break;
            }
        }
        MicroServer.Logger.d("DeviceProperty", Build.MANUFACTURER + ", " + Build.MODEL + ", " + Integer.toString(Build.VERSION.SDK_INT) + ", property=0x" + Long.toHexString(a));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static boolean a() {
        return (a & 1) != 0;
    }
}
