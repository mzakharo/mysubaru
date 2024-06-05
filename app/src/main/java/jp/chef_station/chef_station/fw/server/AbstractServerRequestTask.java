package jp.chef_station.chef_station.fw.server;

import android.util.Xml;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.Stack;
import jp.chef_station.chef_station.ChefStationConst;
import jp.chef_station.chef_station.fw.server.ServerConfigFactory;
import jp.chef_station.chef_station.fw.util.BeanUtil;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

/* loaded from: classes.dex */
public abstract class AbstractServerRequestTask<Params, Progress, Result> extends AbstractHttpAccessTask<Params, Progress, Result> {
    private static final String RESPONSE_ENCODE = "UTF-8";
    private static final String SERVER_PORT;
    private static final String SERVER_ROOT;
    private static final String URL_PREFIX;
    protected Stack<String> elementStack;
    private int mTimeout = 30000;
    private boolean parsingCommon = false;

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public enum CommonElementNames {
        result,
        common,
        status,
        device_id,
        device_date,
        portal_date,
        client_ver,
        response,
        NONE
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    protected Result createNewResult() {
        return null;
    }

    protected void execEndElement(String str) {
    }

    protected void execStartElement(XmlPullParser xmlPullParser, Result result) {
    }

    protected boolean execText(Result result, String str, String str2) {
        return false;
    }

    protected abstract String getMethodUrl();

    static {
        ServerConfigFactory.ServerConfig serverConfig;
        String str;
        try {
            serverConfig = ServerConfigFactory.createConfig();
        } catch (Exception e) {
            e.printStackTrace();
            serverConfig = null;
        }
        String serverHostAndPort = serverConfig != null ? serverConfig.getServerHostAndPort() : null;
        SERVER_PORT = serverHostAndPort;
        if (serverHostAndPort != null) {
            str = ChefStationConst.MARKET_PF_PROTOCOL + serverHostAndPort;
        } else {
            str = null;
        }
        URL_PREFIX = str;
        SERVER_ROOT = serverConfig != null ? serverConfig.getServerPath() : null;
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    protected String getAccessUrl() {
        return URL_PREFIX + SERVER_ROOT + getMethodUrl();
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    protected int getTimeout() {
        return this.mTimeout;
    }

    public void setTimeout(int i) {
        this.mTimeout = i;
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    protected InputStream postRequest(String str, Params params, int i) throws IOException {
        return executePostMethod(str, createPostRequestParams(params), i);
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    protected Result handleResponse(InputStream inputStream) throws XmlPullParserException, IOException {
        return parseResponseXML(inputStream);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    public HttpURLConnection getHttpUrlConnection(String str, int i) throws IOException {
        HttpURLConnection httpUrlConnection = super.getHttpUrlConnection(str, i);
        httpUrlConnection.setConnectTimeout(i);
        return httpUrlConnection;
    }

    private Result parseResponseXML(InputStream inputStream) throws XmlPullParserException, IOException {
        XmlPullParser newPullParser = Xml.newPullParser();
        newPullParser.setInput(inputStream, "UTF-8");
        Result createNewResult = createNewResult();
        this.elementStack = new Stack<>();
        for (int eventType = newPullParser.getEventType(); eventType != 1; eventType = newPullParser.next()) {
            if (eventType == 2) {
                didStartElement(newPullParser, createNewResult);
            } else if (eventType == 4) {
                didText(newPullParser, createNewResult);
            } else if (eventType == 3) {
                didEndElement(newPullParser);
            }
        }
        return createNewResult;
    }

    private CommonElementNames lookupElemID(String str) {
        try {
            return CommonElementNames.valueOf(str);
        } catch (IllegalArgumentException unused) {
            return CommonElementNames.NONE;
        }
    }

    private void didStartElement(XmlPullParser xmlPullParser, Result result) {
        String name = xmlPullParser.getName();
        this.elementStack.push(name);
        switch (AnonymousClass1.$SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[lookupElemID(name).ordinal()]) {
            case 1:
                this.parsingCommon = true;
                return;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                return;
            case 8:
                this.parsingCommon = false;
                return;
            default:
                execStartElement(xmlPullParser, result);
                return;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* renamed from: jp.chef_station.chef_station.fw.server.AbstractServerRequestTask$1, reason: invalid class name */
    /* loaded from: classes.dex */
    public static /* synthetic */ class AnonymousClass1 {
        static final /* synthetic */ int[] $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames;

        static {
            int[] iArr = new int[CommonElementNames.values().length];
            $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames = iArr;
            try {
                iArr[CommonElementNames.common.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.result.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.status.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.device_id.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.device_date.ordinal()] = 5;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.portal_date.ordinal()] = 6;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.client_ver.ordinal()] = 7;
            } catch (NoSuchFieldError unused7) {
            }
            try {
                $SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[CommonElementNames.response.ordinal()] = 8;
            } catch (NoSuchFieldError unused8) {
            }
        }
    }

    private void didText(XmlPullParser xmlPullParser, Result result) throws XmlPullParserException {
        String peek = this.elementStack.peek();
        if (xmlPullParser.isWhitespace()) {
            return;
        }
        String text = xmlPullParser.getText();
        switch (AnonymousClass1.$SwitchMap$jp$chef_station$chef_station$fw$server$AbstractServerRequestTask$CommonElementNames[lookupElemID(peek).ordinal()]) {
            case 1:
            case 2:
            case 8:
                return;
            case 3:
                if (this.parsingCommon) {
                    BeanUtil.setField(result, peek, text);
                    return;
                } else {
                    execText(result, peek, text);
                    return;
                }
            case 4:
            case 5:
            case 6:
            case 7:
                BeanUtil.setField(result, peek, text);
                return;
            default:
                if (execText(result, peek, text)) {
                    return;
                }
                BeanUtil.setField(result, peek, text);
                return;
        }
    }

    private void didEndElement(XmlPullParser xmlPullParser) {
        execEndElement(xmlPullParser.getName());
    }

    @Deprecated
    public void postLicenseDetailRequestForAfterPurchase(Params... paramsArr) {
        onPostExecute(doInBackground(paramsArr));
    }

    public void postLicenseDetailRequestAsync(Params... paramsArr) {
        onPostExecute(doInBackground(paramsArr));
    }
}
