package com.clarion.smartaccess.inappbilling.util;

import java.security.MessageDigest;

/* loaded from: classes.dex */
public class Util {
    public static String hashedStringForMD5(String str) {
        return hashedString("MD5", str);
    }

    public static String hashedStringForSHA256(String str) {
        return hashedString("SHA-256", str);
    }

    private static String hashedString(String str, String str2) {
        try {
            byte[] digest = MessageDigest.getInstance(str).digest(str2.getBytes());
            StringBuffer stringBuffer = new StringBuffer();
            for (byte b : digest) {
                stringBuffer.append(String.format("%02x", Byte.valueOf(b)));
            }
            return stringBuffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
