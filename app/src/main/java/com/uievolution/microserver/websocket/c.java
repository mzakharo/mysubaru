package com.uievolution.microserver.websocket;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public abstract class c {
    private boolean a;
    private byte[] b;

    /* JADX INFO: Access modifiers changed from: package-private */
    public c(int i) {
        this.a = i == 1;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static c a(int i, int i2) {
        if (i == 1) {
            return new f(i2);
        }
        if (i == 8) {
            return new b(i2);
        }
        return new a(i, i2);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public abstract int a();

    /* JADX INFO: Access modifiers changed from: package-private */
    public byte[] b() {
        return this.b;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean c() {
        return this.a;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public int d() {
        return this.b.length;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void e() {
        this.a = true;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(byte[] bArr) {
        byte[] bArr2 = this.b;
        if (bArr2 == null) {
            this.b = bArr;
            return;
        }
        byte[] bArr3 = new byte[bArr2.length + bArr.length];
        System.arraycopy(bArr2, 0, bArr3, 0, bArr2.length);
        System.arraycopy(bArr, 0, bArr3, this.b.length, bArr.length);
        this.b = bArr3;
    }
}
