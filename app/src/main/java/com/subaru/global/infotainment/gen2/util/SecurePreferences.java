package com.subaru.global.infotainment.gen2.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;
import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/* loaded from: classes.dex */
public class SecurePreferences {
    private static final String CHARSET = "UTF-8";
    private static final String KEY_TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private static final String SECRET_KEY_HASH_TRANSFORMATION = "SHA-256";
    private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";
    private final boolean encryptKeys;
    private final Cipher keyWriter;
    private final SharedPreferences preferences;
    private final Cipher reader;
    private final Cipher writer;

    /* loaded from: classes.dex */
    public static class SecurePreferencesException extends RuntimeException {
        private static final long serialVersionUID = 8713151681315524577L;

        public SecurePreferencesException(Throwable th) {
            super(th);
        }
    }

    public SecurePreferences(Context context, String str, String str2, boolean z) throws SecurePreferencesException {
        try {
            this.writer = Cipher.getInstance(TRANSFORMATION);
            this.reader = Cipher.getInstance(TRANSFORMATION);
            this.keyWriter = Cipher.getInstance(KEY_TRANSFORMATION);
            initCiphers(str2);
            this.preferences = context.getSharedPreferences(str, 0);
            this.encryptKeys = z;
        } catch (UnsupportedEncodingException e) {
            throw new SecurePreferencesException(e);
        } catch (GeneralSecurityException e2) {
            throw new SecurePreferencesException(e2);
        }
    }

    protected void initCiphers(String str) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException, InvalidAlgorithmParameterException {
        IvParameterSpec iv = getIv();
        SecretKeySpec secretKey = getSecretKey(str);
        this.writer.init(1, secretKey, iv);
        this.reader.init(2, secretKey, iv);
        this.keyWriter.init(1, secretKey);
    }

    protected IvParameterSpec getIv() {
        byte[] bArr = new byte[this.writer.getBlockSize()];
        System.arraycopy("fldsjfodasjifudslfjdsaofshaufihadsf".getBytes(), 0, bArr, 0, this.writer.getBlockSize());
        return new IvParameterSpec(bArr);
    }

    protected SecretKeySpec getSecretKey(String str) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        return new SecretKeySpec(createKeyBytes(str), TRANSFORMATION);
    }

    protected byte[] createKeyBytes(String str) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance(SECRET_KEY_HASH_TRANSFORMATION);
        messageDigest.reset();
        return messageDigest.digest(str.getBytes("UTF-8"));
    }

    public void put(String str, String str2) {
        if (str2 == null) {
            this.preferences.edit().remove(toKey(str)).commit();
        } else {
            putValue(toKey(str), str2);
        }
    }

    public boolean containsKey(String str) {
        return this.preferences.contains(toKey(str));
    }

    public void removeValue(String str) {
        this.preferences.edit().remove(toKey(str)).commit();
    }

    public String getString(String str) throws SecurePreferencesException {
        if (this.preferences.contains(toKey(str))) {
            return decrypt(this.preferences.getString(toKey(str), ""));
        }
        return null;
    }

    public void clear() {
        this.preferences.edit().clear().commit();
    }

    private String toKey(String str) {
        return this.encryptKeys ? encrypt(str, this.keyWriter) : str;
    }

    private void putValue(String str, String str2) throws SecurePreferencesException {
        this.preferences.edit().putString(str, encrypt(str2, this.writer)).commit();
    }

    protected String encrypt(String str, Cipher cipher) throws SecurePreferencesException {
        try {
            return Base64.encodeToString(convert(cipher, str.getBytes("UTF-8")), 2);
        } catch (UnsupportedEncodingException e) {
            throw new SecurePreferencesException(e);
        }
    }

    protected String decrypt(String str) {
        try {
            return new String(convert(this.reader, Base64.decode(str, 2)), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new SecurePreferencesException(e);
        }
    }

    private static byte[] convert(Cipher cipher, byte[] bArr) throws SecurePreferencesException {
        try {
            return cipher.doFinal(bArr);
        } catch (Exception e) {
            throw new SecurePreferencesException(e);
        }
    }
}
