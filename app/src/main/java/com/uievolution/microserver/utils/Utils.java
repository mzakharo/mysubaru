package com.uievolution.microserver.utils;

import android.util.Base64;
import com.uievolution.microserver.MicroServer;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLConnection;
import java.nio.channels.Selector;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.xmlpull.v1.XmlSerializer;

/* loaded from: classes.dex */
public final class Utils {
    private static boolean a = true;

    private Utils() {
    }

    public static void _assert(boolean z, String str) {
        if (!a || z) {
            return;
        }
        MicroServer.Logger.e("ASSERT", str, new Throwable());
        throw new AssertionError(str);
    }

    public static void _assertIsFalse(boolean z) {
        _assert(!z, "isFalse");
    }

    public static void _assertIsNotNull(Object obj) {
        _assert(obj != null, "isNotNull");
    }

    public static void _assertIsNull(Object obj) {
        _assert(obj == null, "isNull");
    }

    public static void _assertIsTrue(boolean z) {
        _assert(z, "isTrue");
    }

    public static boolean arraycmp(byte[] bArr, int i, byte[] bArr2, int i2, int i3) {
        if (i + i3 >= bArr.length || i2 + i3 >= bArr2.length) {
            return false;
        }
        for (int i4 = 0; i4 < i3; i4++) {
            if (bArr[i + i4] != bArr2[i2 + i4]) {
                return false;
            }
        }
        return true;
    }

    public static void close(URLConnection uRLConnection) {
        if (uRLConnection instanceof HttpURLConnection) {
            ((HttpURLConnection) uRLConnection).disconnect();
        }
    }

    public static void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException unused) {
            }
        }
    }

    public static String convertToRegex(String str) {
        Matcher matcher = Pattern.compile("[^*]+|(\\*)").matcher(str);
        StringBuffer stringBuffer = new StringBuffer();
        while (matcher.find()) {
            if (matcher.group(1) != null) {
                matcher.appendReplacement(stringBuffer, ".*");
            } else {
                matcher.appendReplacement(stringBuffer, "\\\\Q" + matcher.group(0) + "\\\\E");
            }
        }
        matcher.appendTail(stringBuffer);
        return stringBuffer.toString();
    }

    /* JADX WARN: Removed duplicated region for block: B:15:0x0038  */
    /* JADX WARN: Removed duplicated region for block: B:18:0x003d A[RETURN] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public static java.lang.String loadDataFromAssets(java.lang.String r6, android.content.Context r7) {
        /*
            r0 = 0
            android.content.res.AssetManager r7 = r7.getAssets()     // Catch: java.lang.Throwable -> L2c java.io.IOException -> L31
            java.io.InputStream r6 = r7.open(r6)     // Catch: java.lang.Throwable -> L2c java.io.IOException -> L31
            java.lang.StringBuffer r7 = new java.lang.StringBuffer     // Catch: java.lang.Throwable -> L29 java.io.IOException -> L32
            java.lang.String r1 = ""
            r7.<init>(r1)     // Catch: java.lang.Throwable -> L29 java.io.IOException -> L32
            r1 = 1024(0x400, float:1.435E-42)
            byte[] r1 = new byte[r1]     // Catch: java.io.IOException -> L27 java.lang.Throwable -> L29
        L14:
            int r2 = r6.read(r1)     // Catch: java.io.IOException -> L27 java.lang.Throwable -> L29
            r3 = -1
            if (r2 == r3) goto L33
            java.lang.String r3 = new java.lang.String     // Catch: java.io.IOException -> L27 java.lang.Throwable -> L29
            r4 = 0
            java.lang.String r5 = "UTF-8"
            r3.<init>(r1, r4, r2, r5)     // Catch: java.io.IOException -> L27 java.lang.Throwable -> L29
            r7.append(r3)     // Catch: java.io.IOException -> L27 java.lang.Throwable -> L29
            goto L14
        L27:
            goto L33
        L29:
            r7 = move-exception
            r0 = r6
            goto L2d
        L2c:
            r7 = move-exception
        L2d:
            closeQuietly(r0)
            throw r7
        L31:
            r6 = r0
        L32:
            r7 = r0
        L33:
            closeQuietly(r6)
            if (r7 == 0) goto L3d
            java.lang.String r6 = r7.toString()
            return r6
        L3d:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.uievolution.microserver.utils.Utils.loadDataFromAssets(java.lang.String, android.content.Context):java.lang.String");
    }

    public static URI parseURI(String str) throws URISyntaxException {
        try {
            return new URI(str);
        } catch (URISyntaxException unused) {
            int indexOf = str.indexOf("//");
            int indexOf2 = indexOf >= 0 ? str.indexOf(47, indexOf + 2) : 0;
            return URI.create(str.substring(0, indexOf2) + UriPath.parse(str.substring(indexOf2)).toEncodedString());
        }
    }

    public static int toInt(String str, int i) {
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException unused) {
            return i;
        }
    }

    public static void toXML(XmlSerializer xmlSerializer, String str, String str2) throws IllegalArgumentException, IllegalStateException, IOException {
        if (str2 != null) {
            xmlSerializer.startTag(null, str);
            xmlSerializer.text(str2);
            xmlSerializer.endTag(null, str);
        }
    }

    public static String webSocketAcceptValue(String str) {
        MessageDigest messageDigest;
        String str2 = str.trim() + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        try {
            messageDigest = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException unused) {
            messageDigest = null;
        }
        messageDigest.update(str2.getBytes(), 0, str2.getBytes().length);
        return Base64.encodeToString(messageDigest.digest(), 2);
    }

    public static void closeQuietly(Socket socket) {
        if (socket != null) {
            try {
                socket.close();
            } catch (IOException unused) {
            }
        }
    }

    public static void closeQuietly(Selector selector) {
        if (selector != null) {
            try {
                selector.close();
            } catch (IOException unused) {
            }
        }
    }

    public static void _assert(boolean z) {
        _assert(z, "");
    }

    public static long copy(InputStream inputStream, OutputStream outputStream) throws IOException {
        byte[] bArr = new byte[4096];
        long j = 0;
        while (true) {
            int read = inputStream.read(bArr);
            if (-1 == read) {
                return j;
            }
            outputStream.write(bArr, 0, read);
            j += read;
        }
    }
}
