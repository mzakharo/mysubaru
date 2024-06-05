package com.android.lib.mcm.send_location;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.send_location.SendLocationCommunicatorRequestData;
import com.android.lib.mcm.send_location.SendLocationCommunicatorResponseData;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLHandshakeException;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
/* loaded from: classes.dex */
public class SendLocationCommunicator {
    public static final int CONNECT_AFTER_TIME_OUT = 30000;
    public static final int CONNECT_TIME_OUT = 30000;
    public static final String LF = "\n";
    public static final int POOLING_INTERVAL = 500;
    public static final String REQUEST_QUERY_FIRST_STR = "?";
    private static int RegistQueueMaxCount = 5000;
    private static int RetryMaxCount = 10;
    private static final String TAG = "SendLocationCommunicator";
    public static final String UTF_8 = "UTF-8";
    private Context mContext;
    private Timer mPoolingTimer = null;
    private ArrayList<QueueData> mRequests = new ArrayList<>();

    /* loaded from: classes.dex */
    public interface IResponse {
        void callback(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) throws UnsupportedEncodingException;
    }

    private boolean isNull(Object obj) {
        return obj == null;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public class QueueData {
        private IResponse mCallback;
        private boolean mIsRetry;
        private SendLocationCommunicatorRequestData mRequestData;
        private int mRetryCount;

        public QueueData(SendLocationCommunicator sendLocationCommunicator, SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, IResponse iResponse) {
            this(sendLocationCommunicatorRequestData, iResponse, false);
        }

        public QueueData(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, IResponse iResponse, boolean z) {
            this.mRequestData = null;
            this.mCallback = null;
            this.mIsRetry = false;
            this.mRetryCount = 0;
            this.mRequestData = sendLocationCommunicatorRequestData;
            this.mCallback = iResponse;
            this.mIsRetry = z;
        }

        public SendLocationCommunicatorRequestData getRequestData() {
            return this.mRequestData;
        }

        public IResponse getCallback() {
            return this.mCallback;
        }

        public boolean getIsRetry() {
            return this.mIsRetry;
        }

        public int getRetryCount() {
            return this.mRetryCount;
        }

        public void addRetryCount() {
            this.mRetryCount++;
        }
    }

    public SendLocationCommunicator(Context context) {
        this.mContext = null;
        this.mContext = context.getApplicationContext();
        initialize();
    }

    public void requestQueue(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) {
        requestQueue(sendLocationCommunicatorRequestData, null);
    }

    public void requestQueue(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, IResponse iResponse) {
        requestQueue(sendLocationCommunicatorRequestData, iResponse, false);
    }

    public void requestQueue(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, IResponse iResponse, boolean z) {
        synchronized (this.mRequests) {
            LogWrapper.d(TAG, "requestQueue");
            if (this.mRequests.size() >= RegistQueueMaxCount) {
                LogWrapper.d(TAG, "requestQueue over limit queue count.");
                this.mRequests.remove(0);
            }
            this.mRequests.add(new QueueData(sendLocationCommunicatorRequestData, iResponse, z));
            LogWrapper.d(TAG, "requestQueue after regist queue count = " + String.valueOf(this.mRequests.size()));
        }
    }

    private void initialize() {
        execPooling(true);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void execPooling(boolean z) {
        TimerTask timerTask = new TimerTask() { // from class: com.android.lib.mcm.send_location.SendLocationCommunicator.1
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                QueueData queueData;
                SendLocationCommunicator.this.mPoolingTimer.cancel();
                SendLocationCommunicator.this.mPoolingTimer = null;
                if (SendLocationService.isRunningService()) {
                    synchronized (SendLocationCommunicator.this.mRequests) {
                        queueData = SendLocationCommunicator.this.mRequests.size() > 0 ? (QueueData) SendLocationCommunicator.this.mRequests.get(0) : null;
                    }
                    if (queueData != null) {
                        LogWrapper.d(SendLocationCommunicator.TAG, "execPooling exist queue.");
                        boolean isRetry = queueData.getIsRetry();
                        if (isRetry && queueData.getRetryCount() > 0) {
                            LogWrapper.d(SendLocationCommunicator.TAG, "execPooling retry count = " + String.valueOf(queueData.getRetryCount()));
                        }
                        if (isRetry && queueData.getRetryCount() >= SendLocationCommunicator.RetryMaxCount) {
                            isRetry = false;
                        }
                        SendLocationCommunicatorResponseData requestConnection = SendLocationCommunicator.this.requestConnection(queueData.getRequestData());
                        if (isRetry && SendLocationCommunicator.this.isSuccessedConnection(requestConnection)) {
                            isRetry = false;
                        }
                        synchronized (SendLocationCommunicator.this.mRequests) {
                            if (isRetry) {
                                if (SendLocationCommunicator.this.mRequests.size() >= SendLocationCommunicator.RegistQueueMaxCount) {
                                    LogWrapper.d(SendLocationCommunicator.TAG, "Because over limit queue count, cancel the retry.");
                                    isRetry = false;
                                }
                            }
                            SendLocationCommunicator.this.mRequests.remove(0);
                            if (isRetry) {
                                SendLocationCommunicator.this.mRequests.add(queueData);
                            }
                        }
                        if (!isRetry && queueData.getCallback() != null) {
                            LogWrapper.d(SendLocationCommunicator.TAG, "execPooling exec callback.");
                            try {
                                queueData.getCallback().callback(requestConnection);
                            } catch (UnsupportedEncodingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        if (isRetry) {
                            queueData.addRetryCount();
                        }
                    }
                    SendLocationCommunicator.this.execPooling(false);
                    return;
                }
                LogWrapper.d(SendLocationCommunicator.TAG, "execPooling stop timer");
            }
        };
        Timer timer = new Timer();
        this.mPoolingTimer = timer;
        timer.schedule(timerTask, z ? 1L : 500L);
    }

    private boolean isOnline() {
        NetworkInfo activeNetworkInfo = ((ConnectivityManager) this.mContext.getSystemService("connectivity")).getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    public SendLocationCommunicatorResponseData requestConnection(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) {
        LogWrapper.d(TAG, "SendLocationCommunicator::connectProxyService() start url:" + sendLocationCommunicatorRequestData.getUrl());
        SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData = new SendLocationCommunicatorResponseData();
        if (!isOnline()) {
            LogWrapper.d(TAG, "requestConnection:Incommunicable");
            sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.Incommunicable);
            return sendLocationCommunicatorResponseData;
        }
        try {
            BasicHttpParams basicHttpParams = new BasicHttpParams();
            HttpConnectionParams.setConnectionTimeout(basicHttpParams, 30000);
            HttpConnectionParams.setSoTimeout(basicHttpParams, 30000);
            DefaultHttpClient defaultHttpClient = new DefaultHttpClient(basicHttpParams);
            LogWrapper.d(TAG, "requestConnection:request before");
            HttpResponse execute = defaultHttpClient.execute(createHttpRequestForSwitchMethod(sendLocationCommunicatorRequestData));
            LogWrapper.d(TAG, "requestConnection:request after");
            sendLocationCommunicatorResponseData = convertResponseData(execute, sendLocationCommunicatorRequestData);
            sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.Success);
        } catch (UnknownHostException unused) {
            LogWrapper.w(TAG, "requestConnection:Unknown Host");
            sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.UnknownHost);
        } catch (SSLException e) {
            LogWrapper.w(TAG, "requestConnection:SSL Error");
            if (e.getClass() == SSLHandshakeException.class) {
                sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.SSLHandshakeError);
            } else {
                sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.OtherError);
            }
        } catch (ConnectTimeoutException unused2) {
            LogWrapper.w(TAG, "requestConnection:Timeout");
            sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.Timeout);
        } catch (Exception unused3) {
            LogWrapper.w(TAG, "requestConnection:Other Error");
            sendLocationCommunicatorResponseData.setCommunicationStatus(SendLocationCommunicatorResponseData.CommunicationStatus.OtherError);
        }
        LogWrapper.d(TAG, "requestConnection:end");
        LogWrapper.d(TAG, "requestConnection:status:" + sendLocationCommunicatorResponseData.getStatusCode());
        return sendLocationCommunicatorResponseData;
    }

    private HttpRequestBase createHttpRequestForSwitchMethod(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws UnsupportedEncodingException {
        LogWrapper.d(TAG, "createHttpRequestForSwitchMethod:start");
        Map<String, String> createRequestHeaderMap = createRequestHeaderMap(sendLocationCommunicatorRequestData);
        if (SendLocationCommunicatorRequestData.MethodType.get.equals(sendLocationCommunicatorRequestData.getMethod())) {
            String createRequestUrl = createRequestUrl(sendLocationCommunicatorRequestData, true);
            LogWrapper.d(TAG, "createHttpRequestForSwitchMethod:url:" + createRequestUrl);
            HttpGet httpGet = new HttpGet(createRequestUrl);
            addRequestHeader(httpGet, createRequestHeaderMap, new ArrayList());
            LogWrapper.d(TAG, "createHttpRequestForSwitchMethod:get");
            return httpGet;
        } else if (SendLocationCommunicatorRequestData.MethodType.post.equals(sendLocationCommunicatorRequestData.getMethod())) {
            String createRequestUrl2 = createRequestUrl(sendLocationCommunicatorRequestData, true);
            LogWrapper.d(TAG, "createHttpRequestForSwitchMethod:url:" + createRequestUrl2);
            HttpPost httpPost = new HttpPost(createRequestUrl2);
            addRequestHeader(httpPost, createRequestHeaderMap, null);
            httpPost.setEntity(createPostByteArrayEntity(sendLocationCommunicatorRequestData));
            LogWrapper.d(TAG, "createHttpRequestForSwitchMethod:post");
            return httpPost;
        } else {
            return null;
        }
    }

    private ByteArrayEntity createPostByteArrayEntity(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws UnsupportedEncodingException {
        LogWrapper.d(TAG, "createPostByteArrayEntity:start");
        if (isNull(sendLocationCommunicatorRequestData) || TextUtils.isEmpty(sendLocationCommunicatorRequestData.getData())) {
            return null;
        }
        LogWrapper.d(TAG, "createPostByteArrayEntity:end");
        return new ByteArrayEntity(sendLocationCommunicatorRequestData.getData().getBytes("UTF-8"));
    }

    private void addRequestHeader(HttpRequestBase httpRequestBase, Map<String, String> map, List<String> list) {
        LogWrapper.d(TAG, "addRequestHeader:start");
        for (String str : map.keySet()) {
            if (!isNull(list) && list.contains(str)) {
                LogWrapper.d(TAG, "addRequestHeader:remove key=" + str);
            } else {
                LogWrapper.d(TAG, "addRequestHeader:add key=" + str);
                httpRequestBase.addHeader(str, map.get(str));
            }
        }
        LogWrapper.d(TAG, "addRequestHeader:end");
    }

    private String createRequestUrl(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData, boolean z) {
        String url;
        LogWrapper.d(TAG, "createRequestUrl:start");
        StringBuilder sb = new StringBuilder();
        Uri.Builder builder = new Uri.Builder();
        if ("?".equals(sendLocationCommunicatorRequestData.getUrl().substring(sendLocationCommunicatorRequestData.getUrl().length() - 1, sendLocationCommunicatorRequestData.getUrl().length()))) {
            LogWrapper.d(TAG, "createRequestUrl:hatena exist");
            url = sendLocationCommunicatorRequestData.getUrl().substring(0, sendLocationCommunicatorRequestData.getUrl().length() - 1);
            LogWrapper.d(TAG, "createRequestUrl:hatena:modify url:" + url);
        } else {
            LogWrapper.d(TAG, "createRequestUrl:hatena not exist");
            url = sendLocationCommunicatorRequestData.getUrl();
        }
        builder.encodedPath(url);
        if (z) {
            builder.encodedQuery(sendLocationCommunicatorRequestData.getParam());
        }
        sb.append(builder.build().toString());
        LogWrapper.d(TAG, "createRequestUrl:end");
        return sb.toString();
    }

    private Map<String, String> createRequestHeaderMap(SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) {
        LogWrapper.d(TAG, "createRequestHeaderMap:start");
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        HashMap<String, String> header = sendLocationCommunicatorRequestData.getHeader();
        for (String str : header.keySet()) {
            linkedHashMap.put(str, header.get(str));
        }
        LogWrapper.d(TAG, "createRequestHeaderMap:end");
        return linkedHashMap;
    }

    private SendLocationCommunicatorResponseData convertResponseData(HttpResponse httpResponse, SendLocationCommunicatorRequestData sendLocationCommunicatorRequestData) throws Exception {
        LogWrapper.d(TAG, "convertResponseData:start");
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        while (true) {
            String readLine = bufferedReader.readLine();
            if (readLine == null) {
                break;
            }
            sb.append(readLine + "\n");
        }
        Header lastHeader = httpResponse.getLastHeader(HttpCatalogs.HEADER_CONTENT_TYPE);
        String value = lastHeader != null ? lastHeader.getValue() : "";
        SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData = new SendLocationCommunicatorResponseData();
        sendLocationCommunicatorResponseData.setStatusCode(httpResponse.getStatusLine().getStatusCode());
        sendLocationCommunicatorResponseData.setResponse(sb.toString());
        sendLocationCommunicatorResponseData.setContentType(value);
        LogWrapper.d(TAG, "convertResponseData:end");
        return sendLocationCommunicatorResponseData;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean isSuccessedConnection(SendLocationCommunicatorResponseData sendLocationCommunicatorResponseData) {
        if (sendLocationCommunicatorResponseData == null) {
            LogWrapper.d(TAG, "isSuccessedConnection fail response is null.");
            return false;
        } else if (sendLocationCommunicatorResponseData.getCommunicationStatus() != SendLocationCommunicatorResponseData.CommunicationStatus.Success) {
            LogWrapper.d(TAG, "isSuccessedConnection fail CommunicationStatus.");
            return false;
        } else if (sendLocationCommunicatorResponseData.getStatusCode() < 200 || sendLocationCommunicatorResponseData.getStatusCode() >= 300) {
            LogWrapper.d(TAG, "isSuccessedConnection fail status code.");
            return false;
        } else {
            LogWrapper.d(TAG, "isSuccessedConnection successed.");
            return true;
        }
    }
}
