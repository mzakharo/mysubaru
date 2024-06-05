package com.uievolution.microserver;

import android.util.Base64;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.utils.Crypt;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.Serializable;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class DigestAuth implements Serializable {
    private static final long serialVersionUID = -5377039246173532107L;
    private final HashMap<String, String> a;
    private final String b;

    public DigestAuth(Map<String, String> map, String str) {
        this.a = new HashMap<>(map);
        this.b = str;
    }

    private String a(String str) {
        return this.a.get(str);
    }

    public String getRealm() {
        return this.b;
    }

    public Map<String, String> getUserA1Hash() {
        return Collections.unmodifiableMap(this.a);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean a(String str, String str2) {
        MicroServer.Logger.d("DigestAuth", "authenticate: " + str2);
        if (!str2.startsWith("Digest")) {
            return false;
        }
        String[] split = str2.substring(7).split("[,\\s]+");
        HashMap hashMap = new HashMap();
        for (String str3 : split) {
            int indexOf = str3.indexOf(61);
            if (indexOf >= 0) {
                String substring = str3.substring(0, indexOf);
                String substring2 = str3.substring(indexOf + 1);
                if (substring2.startsWith("\"")) {
                    substring2 = substring2.substring(1, substring2.length() - 1);
                }
                hashMap.put(substring, substring2);
            }
        }
        if (!hashMap.containsKey("username") || !hashMap.containsKey("uri") || !hashMap.containsKey("nonce") || !hashMap.containsKey("nc") || !hashMap.containsKey("cnonce") || !hashMap.containsKey("qop") || !this.a.containsKey(hashMap.get("username"))) {
            return false;
        }
        return ((String) hashMap.get("response")).equals(Crypt.md5(a((String) hashMap.get("username")) + ":" + ((String) hashMap.get("nonce")) + ":" + ((String) hashMap.get("nc")) + ":" + ((String) hashMap.get("cnonce")) + ":" + ((String) hashMap.get("qop")) + ":" + Crypt.md5(str + ":" + ((String) hashMap.get("uri")))));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public Header a() {
        byte[] bArr = new byte[32];
        new SecureRandom().nextBytes(bArr);
        String encodeToString = Base64.encodeToString(bArr, 3);
        encodeToString.substring(0, 32);
        StringBuilder sb = new StringBuilder();
        sb.append("Digest");
        sb.append(" realm=\"" + this.b + "\"");
        sb.append(",nonce=\"" + encodeToString + "\"");
        sb.append(",algorithm=\"MD5\"");
        sb.append(",qop=\"auth\"");
        return new BasicHeader(HttpCatalogs.HEADER_WWW_AUTHENTICATE, sb.toString());
    }
}
