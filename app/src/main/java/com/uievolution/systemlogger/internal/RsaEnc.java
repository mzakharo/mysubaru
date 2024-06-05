package com.uievolution.systemlogger.internal;

import android.util.Base64;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import javax.crypto.Cipher;

/* loaded from: classes.dex */
public class RsaEnc {
    private Cipher a;

    public RsaEnc() throws GeneralSecurityException {
        a();
    }

    private void a() throws GeneralSecurityException {
        if (this.a == null) {
            PublicKey generatePublic = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(Base64.decode("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGz2evidoLS3Hqdd+m9I2YUWX2nwGp+VwGw2nIZ3g6pF/01n9npfDDah0uHYHHLP+owcI26/t2qDwSF7uAOG581Lg3rxJiHSyWC8ZbvruUMTQ9u3Wpt5lIzyJN2phlVUkAykWeni3H9HIhZYcDFKUgF++syRxh7R3ujCKEEpJ1GQIDAQAB", 0)));
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            this.a = cipher;
            cipher.init(1, generatePublic);
        }
    }

    public byte[] doFinal(byte[] bArr) throws GeneralSecurityException {
        return this.a.doFinal(bArr);
    }

    public byte[] update(byte[] bArr) {
        return this.a.update(bArr);
    }

    public byte[] doFinal() throws GeneralSecurityException {
        return this.a.doFinal();
    }
}
