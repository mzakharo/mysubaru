package com.uievolution.microserver;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.BasicRequestLine;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.ProtocolVersion;
import com.uievolution.microserver.http.RequestLine;
import com.uievolution.microserver.utils.Utils;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/* loaded from: classes.dex */
public class HttpRequestReader {
    static final /* synthetic */ boolean f = true;
    private RequestLine c;
    private boolean b = false;
    private List<Header> d = new ArrayList();
    private byte[] e = new byte[0];
    private final ByteArrayOutputStream a = new ByteArrayOutputStream();

    private void a() {
        this.c = null;
        this.d.clear();
        this.e = new byte[0];
    }

    public void append(byte[] bArr) throws IOException {
        this.a.write(bArr);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public byte[] b() {
        return this.e;
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r0v12, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r0v13 */
    /* JADX WARN: Type inference failed for: r0v15, types: [byte[]] */
    /* JADX WARN: Type inference failed for: r0v17, types: [boolean] */
    void c() {
        DataInputStream dataInputStream = null;
        String readLine = null;
        String readLine2;
        if (!f && this.b) {
            throw new AssertionError();
        }
        a();
        DataInputStream dataInputStream2 = null;
        DataInputStream dataInputStream3 = null;
        try {
            try {
                this.a.flush();
                dataInputStream = new DataInputStream(new ByteArrayInputStream(this.a.toByteArray()));
                try {
                    readLine = dataInputStream.readLine();
                } catch (Exception e) {
                    e = e;
                    dataInputStream3 = dataInputStream;
                    MicroServer.Logger.w("HttpRequestReader", e);
                    Utils.closeQuietly(dataInputStream3);
                    dataInputStream2 = dataInputStream3;
                } catch (Throwable th) {
                    th = th;
                    dataInputStream2 = dataInputStream;
                    Utils.closeQuietly(dataInputStream2);
                    throw th;
                }
            } catch (Exception e2) {
                //e = e2;
            }
            if (readLine == null) {
                Utils.closeQuietly(dataInputStream);
                return;
            }
            if (!a(readLine)) {
                Utils.closeQuietly(dataInputStream);
                return;
            }
            while (true) {
                readLine2 = (dataInputStream.readLine());
                if (readLine2 == null) {
                    break;
                }
                if (readLine2.equals("")) {
                    readLine2 = "1";
                    this.b = true;
                    int available = dataInputStream.available();
                    if (available > 0) {
                        byte[] bArr = new byte[available];
                        this.e = bArr;
                        if (this.e.length != dataInputStream.read(bArr)) {
                            readLine2 = "0";
                        }
                        Utils._assert(Boolean.parseBoolean(readLine2));
                    } else {
                        readLine2 = Arrays.toString(new byte[0]);
                        this.e = readLine2.getBytes();
                    }
                } else {
                    this.d.add(BasicHeader.parse(readLine2));
                }
            }
            Utils.closeQuietly(dataInputStream);
            //dataInputStream2 = readLine2;
        } catch (Throwable ignored) {
        }
    }

    public void close() {
        Utils.closeQuietly(this.a);
    }

    public HttpRequestInfo getRequestInfo() {
        return new HttpRequestInfo(this.c, this.d);
    }

    public boolean isHeaderComplete() {
        if (!this.b) {
            c();
        }
        return this.b;
    }

    public String toString() {
        return new String(this.a.toByteArray());
    }

    public void append(byte[] bArr, int i) throws IOException {
        this.a.write(bArr, 0, i);
    }

    private boolean a(String str) {
        String[] split = str.split(" ");
        if (split.length != 3) {
            return false;
        }
        String str2 = split[0];
        String str3 = split[1];
        Matcher matcher = Pattern.compile("^HTTP/(\\d+)\\.(\\d+)").matcher(split[2]);
        if (!matcher.find()) {
            return false;
        }
        this.c = new BasicRequestLine(str2, str3, new ProtocolVersion("HTTP", Integer.parseInt(matcher.group(1)), Integer.parseInt(matcher.group(2))));
        return true;
    }
}
