package com.uievolution.microserver;

import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.BasicRequestLine;
import com.uievolution.microserver.http.BasicStatusLine;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpVersion;
import com.uievolution.microserver.http.RequestLine;
import com.uievolution.microserver.modules.HttpsTunnelingModule;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.Utils;
import com.uievolution.microserver.websocket.UpgradeRequestParam;
import com.uievolution.microserver.websocket.UpgradeRequestParser;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;

/* loaded from: classes.dex */
class g implements h {
    private final e a;
    private final HttpRequestReader b = new HttpRequestReader();

    public g(e eVar) {
        this.a = eVar;
    }

    @Override // com.uievolution.microserver.h
    public boolean a() {
        return false;
    }

    @Override // com.uievolution.microserver.h
    public boolean a(ByteBuffer byteBuffer) throws IOException {
        URI uri;
        try {
            byte[] bArr = new byte[byteBuffer.remaining()];
            byteBuffer.get(bArr);
            this.b.append(bArr);
            if (!this.b.isHeaderComplete()) {
                return false;
            }
            HttpRequestInfo requestInfo = this.b.getRequestInfo();
            MicroServer.Logger.d("ms.ReceivingHeaderState", "----- Microserver Start Request -----");
            MicroServer.Logger.d("ms.ReceivingHeaderState", requestInfo.toString());
            MicroServer microServer = MicroServer.getInstance();
            MSModule mSModule = null;
            if (requestInfo.isConnectMethod()) {
                mSModule = microServer.d();
            } else if (!microServer.b(requestInfo)) {
                if (!requestInfo.getMethod().equals(HttpCatalogs.METHOD_CONNECT) && !requestInfo.getRequestUri().startsWith("http://")) {
                    String value = requestInfo.getHeader(HttpCatalogs.HEADER_HOST).getValue();
                    RequestLine requestLine = requestInfo.getRequestLine();
                    requestInfo = new HttpRequestInfo(new BasicRequestLine(requestLine.getMethod(), "http://" + value + requestLine.getUri(), requestLine.getProtocolVersion()), requestInfo.getHeaders());
                }
                mSModule = microServer.a(requestInfo);
            } else {
                try {
                    uri = Utils.parseURI(requestInfo.getRequestUri());
                } catch (URISyntaxException e) {
                    MicroServer.Logger.w("ms.ReceivingHeaderState", e);
                    uri = null;
                }
                URI normalize = uri.normalize();
                HttpRequestInfo httpRequestInfo = new HttpRequestInfo(new BasicRequestLine(requestInfo.getRequestLine().getMethod(), normalize.toString(), requestInfo.getRequestLine().getProtocolVersion()), requestInfo.getHeaders());
                UpgradeRequestParam parse = UpgradeRequestParser.parse(httpRequestInfo);
                if (parse != null) {
                    MSWebSocket a = microServer.a(normalize.getPath(), parse.getSubProtocols());
                    if (a != null) {
                        a(parse, a, httpRequestInfo);
                        return false;
                    }
                } else {
                    mSModule = microServer.a(normalize.getPath(), this.a.c());
                    Header header = httpRequestInfo.getHeader(HttpCatalogs.HEADER_EXPECT);
                    if (header != null && header.getValue().equals("100-continue")) {
                        this.a.a(new HttpHeaderWriter(new BasicStatusLine(HttpVersion.HTTP_1_1, 100, "Continue")));
                    }
                }
                requestInfo = httpRequestInfo;
            }
            if (mSModule == null) {
                MicroServer.Logger.d("ms.ReceivingHeaderState", "No module found. Use NotFoundModule.");
                mSModule = microServer.g();
            }
            MicroServer.Logger.d("ms.ReceivingHeaderState", "findModule, uaConnection=" + this.a.toString() + ", module=" + mSModule.toString());
            this.a.a(mSModule, requestInfo);
            if (mSModule instanceof HttpsTunnelingModule) {
                e eVar = this.a;
                eVar.a(new b(eVar));
            } else {
                byte[] b = this.b.b();
                e eVar2 = this.a;
                eVar2.a(new f(eVar2, b));
            }
            this.b.close();
            return true;
        } catch (IOException e2) {
            this.b.close();
            throw e2;
        }
    }

    private void a(UpgradeRequestParam upgradeRequestParam, MSWebSocket mSWebSocket, HttpRequestInfo httpRequestInfo) {
        HttpHeaderWriter httpHeaderWriter = new HttpHeaderWriter(new BasicStatusLine(HttpVersion.HTTP_1_1, 101, "Switching Protocols"));
        httpHeaderWriter.add(new BasicHeader(HttpCatalogs.HEADER_UPGRADE, "WebSocket"));
        httpHeaderWriter.add(new BasicHeader(HttpCatalogs.HEADER_CONNECTION, HttpCatalogs.HEADER_UPGRADE));
        httpHeaderWriter.add(new BasicHeader(HttpCatalogs.HEADER_SEC_WEBSOCKET_ACCEPT, Utils.webSocketAcceptValue(upgradeRequestParam.getKey())));
        if (mSWebSocket.getSubProtocol().length() > 0) {
            httpHeaderWriter.add(new BasicHeader(HttpCatalogs.HEADER_SEC_WEBSOCKET_PROTOCOL, mSWebSocket.getSubProtocol()));
        }
        httpHeaderWriter.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, "0"));
        this.a.a(httpHeaderWriter);
        e eVar = this.a;
        eVar.a(new i(eVar));
        this.a.a(mSWebSocket);
    }
}
