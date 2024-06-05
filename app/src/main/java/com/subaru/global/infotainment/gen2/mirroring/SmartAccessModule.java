package com.subaru.global.infotainment.gen2.mirroring;

import android.net.Uri;
import android.util.Log;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpStatus;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.Utils;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import org.slf4j.Marker;

/* loaded from: classes.dex */
class SmartAccessModule extends AbstractMSModuleImpl {
    static final Set<String> GZIP_ENCODING_CONTENT_TYPES;
    static final String LOGTAG = "SmartAccessModule";
    static Header[] sCommonResponseHeaders = {new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_METHODS, "GET,POST"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")};
    private MirroringEngine mEngine = MirroringEngine.getInstance();

    static {
        HashSet hashSet = new HashSet();
        GZIP_ENCODING_CONTENT_TYPES = hashSet;
        hashSet.add("text/html");
        hashSet.add("text/plain");
        hashSet.add("text/xml");
        hashSet.add(HarmanOTAConst.JSON_CONTENT_TYPE);
    }

    private void procGet(String str) {
        File content;
        String chopQuery = chopQuery(str);
        if (chopQuery.startsWith("/smartaccess/launcher/")) {
            content = this.mEngine.getLauncherContent(chopQuery);
        } else {
            content = this.mEngine.getContent(chopQuery);
        }
        sendResponse(content);
    }

    /* JADX WARN: Removed duplicated region for block: B:14:0x0069 A[Catch: ParamException -> 0x007b, InvalidArgumentException -> 0x00ae, TryCatch #1 {InvalidArgumentException -> 0x00ae, blocks: (B:8:0x0038, B:10:0x0044, B:14:0x0069, B:15:0x0071, B:20:0x0055), top: B:7:0x0038 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private void procPost(java.lang.String r5) {
        /*
            r4 = this;
            byte[] r0 = r4.getWholeBody()
            java.lang.StringBuilder r1 = new java.lang.StringBuilder
            r1.<init>()
            java.lang.String r2 = "procPost="
            r1.append(r2)
            java.lang.String r2 = new java.lang.String
            r2.<init>(r0)
            r1.append(r2)
            java.lang.String r1 = r1.toString()
            java.lang.String r2 = "SmartAccessModule"
            com.uievolution.microserver.logging.MSLog.d(r2, r1)
            java.lang.String r1 = "/smartaccess/launcher/index.html"
            boolean r1 = r5.startsWith(r1)
            r2 = 1
            if (r1 == 0) goto L81
            java.lang.String r1 = new java.lang.String
            r1.<init>(r0)
            com.subaru.global.infotainment.gen2.util.Param r0 = com.subaru.global.infotainment.gen2.util.Param.parse(r1)
            java.lang.String r1 = "pid"
            java.lang.String r0 = r0.getString(r1)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b
            r1 = 0
            com.subaru.global.infotainment.gen2.mirroring.MirroringEngine r3 = r4.mEngine     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            com.subaru.global.infotainment.gen2.mirroring.MirroringStatus r3 = r3.getStatus()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            boolean r3 = r3.isMirroring()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            if (r3 == 0) goto L55
            com.subaru.global.infotainment.gen2.mirroring.MirroringEngine r3 = r4.mEngine     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            com.subaru.global.infotainment.gen2.mirroring.MirroringStatus r3 = r3.getStatus()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            java.lang.String r3 = r3.getToken()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            boolean r3 = r0.equals(r3)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            if (r3 != 0) goto L66
            goto L67
        L55:
            com.subaru.global.infotainment.gen2.mirroring.MirroringEngine r3 = r4.mEngine     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            com.subaru.global.infotainment.gen2.mirroring.MirroringStatus r3 = r3.getStatus()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            java.lang.String r3 = r3.getLastSuccessfulToken()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            boolean r3 = r0.equals(r3)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            if (r3 != 0) goto L66
            goto L67
        L66:
            r2 = 0
        L67:
            if (r2 == 0) goto L71
            com.subaru.global.infotainment.gen2.mirroring.MirroringCommand r1 = new com.subaru.global.infotainment.gen2.mirroring.MirroringCommand     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            r1.<init>(r0)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            r1.process()     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
        L71:
            com.subaru.global.infotainment.gen2.mirroring.MirroringEngine r0 = r4.mEngine     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            java.io.File r5 = r0.getLauncherContent(r5)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            r4.sendResponse(r5)     // Catch: com.subaru.global.infotainment.gen2.util.Param.ParamException -> L7b com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> Lae
            goto Lae
        L7b:
            r5 = 400(0x190, float:5.6E-43)
            r4.sendResponse(r5)
            goto Lae
        L81:
            org.json.JSONObject r5 = new org.json.JSONObject
            r5.<init>()
            com.subaru.global.infotainment.gen2.mirroring.Command r0 = com.subaru.global.infotainment.gen2.mirroring.CommandFactory.create(r0)     // Catch: com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> L8f
            org.json.JSONObject r5 = r0.process()     // Catch: com.subaru.global.infotainment.gen2.mirroring.InvalidArgumentException -> L8f
            goto L9e
        L8f:
            r0 = move-exception
            java.lang.String r1 = "result"
            r5.put(r1, r2)     // Catch: org.json.JSONException -> L9e
            java.lang.String r1 = "message"
            java.lang.String r0 = r0.getMessage()     // Catch: org.json.JSONException -> L9e
            r5.put(r1, r0)     // Catch: org.json.JSONException -> L9e
        L9e:
            r0 = 200(0xc8, float:2.8E-43)
            r1 = 0
            com.uievolution.microserver.http.Header[] r2 = com.subaru.global.infotainment.gen2.mirroring.SmartAccessModule.sCommonResponseHeaders
            java.lang.String r5 = r5.toString()
            byte[] r5 = r5.getBytes()
            r4.sendResponse(r0, r1, r2, r5)
        Lae:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.mirroring.SmartAccessModule.procPost(java.lang.String):void");
    }

    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        String requestUri;
        Log.d(LOGTAG, "doStart()");
        if (getRequestInfo().getRequestUri().startsWith("http://")) {
            requestUri = Uri.parse(getRequestInfo().getRequestUri()).getPath();
        } else {
            requestUri = getRequestInfo().getRequestUri();
        }
        if (isPostMethod()) {
            procPost(requestUri);
        } else if (isGetMethod()) {
            procGet(requestUri);
        } else if (isOptionsMethod()) {
            sendOptionsResponse(getRequestInfo().getHeaders());
        } else {
            sendResponse(HttpStatus.SC_METHOD_NOT_ALLOWED, (String) null, sCommonResponseHeaders, "not supported".getBytes());
        }
        return null;
    }

    private String chopQuery(String str) {
        int indexOf = str.indexOf("?");
        return indexOf >= 0 ? str.substring(0, indexOf) : str;
    }

    void sendResponse(File file) {
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            String guessContentTypeFromName = URLConnection.guessContentTypeFromName(file.toURI().toString());
            if (guessContentTypeFromName == null) {
                guessContentTypeFromName = "application/octet-stream";
            }
            if (GZIP_ENCODING_CONTENT_TYPES.contains(guessContentTypeFromName)) {
                enableGzipEncoding();
            }
            ArrayList arrayList = new ArrayList();
            arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, guessContentTypeFromName));
            boolean startResponse = startResponse(200, arrayList);
            while (startResponse) {
                try {
                    byte[] bArr = new byte[16384];
                    int read = fileInputStream.read(bArr);
                    if (read < 0 || !(startResponse = writeResponseData(bArr, 0, read))) {
                        break;
                    }
                } catch (IOException unused) {
                } catch (Throwable th) {
                    Utils.closeQuietly(fileInputStream);
                    throw th;
                }
            }
            Utils.closeQuietly(fileInputStream);
            if (startResponse) {
                closeResponse();
            }
        } catch (FileNotFoundException unused2) {
            sendResponse(HttpStatus.SC_NOT_FOUND, (String) null, sCommonResponseHeaders, (byte[]) null);
        } catch (NullPointerException unused3) {
            sendResponse(HttpStatus.SC_NOT_FOUND, (String) null, sCommonResponseHeaders, (byte[]) null);
        }
    }
}
