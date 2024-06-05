package com.uievolution.systemlogger.internal;

import com.clarion.android.smartaccess4car.extend.util.CipherUtil;
import java.security.GeneralSecurityException;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/* loaded from: classes.dex */
public class AesEnc {
    private Cipher a;

    public AesEnc(byte[] bArr, byte[] bArr2) throws GeneralSecurityException {
        this(bArr, 0, bArr.length, bArr2, 0, bArr2.length);
    }

    public byte[] doFinal() throws GeneralSecurityException {
        return this.a.doFinal();
    }

    public byte[] update(byte[] bArr) {
        return this.a.update(bArr);
    }

    public AesEnc(byte[] bArr, int i, int i2, byte[] bArr2, int i3, int i4) throws GeneralSecurityException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(bArr, i, i2, CipherUtil.AES);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(bArr2, i3, i4);
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding");
        this.a = cipher;
        cipher.init(1, secretKeySpec, ivParameterSpec);
    }
}
