package com.uievolution.microserver.websocket;

import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.util.Locale;

/* loaded from: classes.dex */
public class UpgradeRequestParser {
    private UpgradeRequestParser() {
    }

    public static UpgradeRequestParam parse(HttpRequestInfo httpRequestInfo) {
        Header header;
        Header header2;
        Header header3;
        Header header4 = httpRequestInfo.getHeader(HttpCatalogs.HEADER_UPGRADE);
        if (header4 == null || !header4.getValue().toLowerCase(Locale.US).equals("websocket") || (header = httpRequestInfo.getHeader(HttpCatalogs.HEADER_CONNECTION)) == null || header.getValue().toLowerCase(Locale.US).indexOf("upgrade") < 0 || (header2 = httpRequestInfo.getHeader(HttpCatalogs.HEADER_SEC_WEBSOCKET_KEY)) == null || header2.getValue().length() <= 0 || (header3 = httpRequestInfo.getHeader(HttpCatalogs.HEADER_SEC_WEBSOCKET_VERSION)) == null || !header3.getValue().equals("13")) {
            return null;
        }
        Header header5 = httpRequestInfo.getHeader(HttpCatalogs.HEADER_SEC_WEBSOCKET_PROTOCOL);
        return new UpgradeRequestParam(header2.getValue(), header3.getValue(), header5 != null ? header5.getValue() : "");
    }
}
