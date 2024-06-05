package com.clarion.android.smartaccess4car.extend.getproxy;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.clarion.android.smartaccess4car.extend.util.CipherUtil;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.json.JSONObject;
import org.slf4j.Marker;

/* loaded from: classes.dex */
public class GetProxyModule extends AbstractExtendModule {
    public static final String TAG = "GetProxyModule";
    private Context mContext;

    private static boolean isNull(Object obj) {
        return obj == null;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        Log.d(TAG, "GetProxyModule::dispatch() start");
        executeModule(mSHTTPRequest, mSHTTPResponder);
        Log.d(TAG, "GetProxyModule::dispatch() end");
    }

    public GetProxyModule(Context context) {
        this.mContext = context;
    }

    private void executeModule(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        Map<String, String> bodyDataFromRequest = null;
        KeyId appInfo = null;
        Log.d(TAG, "GetProxyModule::executeModule() start");
        ResponseData responseData = new ResponseData();
        try {
            try {
                bodyDataFromRequest = getBodyDataFromRequest(mSHTTPRequest);
                appInfo = getAppInfo(bodyDataFromRequest);
                confirmKeyInfo(appInfo);
            } catch (GetProxyException e) {
                Log.d(TAG, "GetProxyModule::executeModule() GetProxyException");
                responseData.setMessageInfo(e.getMessageInfo());
            } catch (Exception unused) {
                Log.d(TAG, "GetProxyModule::executeModule() Exception");
                responseData.setMessageInfo(Const.MessageInfo.ERROR_SYSYTEM);
            }
            if (!isNull(mSHTTPRequest) && checkRequestData(bodyDataFromRequest)) {
                responseData = connectProxyService(mSHTTPRequest, mSHTTPResponder, mapRequestInfoForRetryGetKeyInfo(bodyDataFromRequest, appInfo, true, 1));
                responseData.setMessageInfo(Const.MessageInfo.SUCCESS);
            }
            responseData.setMessageInfo(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
        } catch (GetProxyException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        } finally {
            Log.d(TAG, "GetProxyModule::executeModule() end");
            returnResponse(mSHTTPRequest, mSHTTPResponder, responseData);
        }
    }

    private void confirmKeyInfo(KeyId keyId) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::confirmKeyInfo() start");
        if (!CipherUtil.isDataLoad(keyId) && !loadData(keyId, 0)) {
            Log.d(TAG, "GetProxyModule::executeModule() KeyInfoException");
            throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_GET_ENCRIPT_KEY);
        }
        Log.d(TAG, "GetProxyModule::confirmKeyInfo() end");
    }

    private boolean loadData(KeyId keyId, int i) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::loadData() start");
        CipherUtil.CipherMessageInfo loadData = CipherUtil.loadData(this.mContext, keyId, i, null);
        if (CipherUtil.CipherMessageInfo.SUCCESS.getId().equals(loadData.getId())) {
            Log.d(TAG, "GetProxyModule::loadData() success");
            return true;
        }
        if (CipherUtil.CipherMessageInfo.ERROR_FAILED_GET_DATA.getId().equals(loadData.getId())) {
            Log.d(TAG, "GetProxyModule::loadData() error failed 1");
            throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_GET_ENCRIPT_KEY);
        }
        if (CipherUtil.CipherMessageInfo.ERROR_CONNECT_TIMEOUT.getId().equals(loadData.getId())) {
            Log.d(TAG, "GetProxyModule::loadData() error timeout");
            throw new GetProxyException(Const.MessageInfo.ERROR_CONNECT_TIMEOUT_GET_ENCRIPT_KEY);
        }
        Log.d(TAG, "GetProxyModule::loadData() error failed 2");
        throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_GET_ENCRIPT_KEY);
    }

    private ResponseData connectProxyService(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder, RequestData requestData) throws GetProxyException {
        Log.d(TAG, "GetProxyModule::connectProxyService() start");
        new Uri.Builder();
        new ResponseData();
        try {
            BasicHttpParams basicHttpParams = new BasicHttpParams();
            if (!isNull(requestData.getTimeout())) {
                HttpConnectionParams.setConnectionTimeout(basicHttpParams, requestData.getTimeout().intValue());
                HttpConnectionParams.setSoTimeout(basicHttpParams, requestData.getTimeout().intValue());
            } else {
                HttpConnectionParams.setConnectionTimeout(basicHttpParams, 30000);
                HttpConnectionParams.setSoTimeout(basicHttpParams, 30000);
            }
            DefaultHttpClient defaultHttpClient = new DefaultHttpClient(basicHttpParams);
            Log.d(TAG, "GetProxyModule::connectProxyService() request before");
            HttpResponse execute = defaultHttpClient.execute(createHttpRequestForSwitchMethod(requestData));
            Log.d(TAG, "GetProxyModule::connectProxyService() request after");
            ResponseData convertResponseData = convertResponseData(execute, requestData);
            Log.d(TAG, "GetProxyModule::connectProxyService() end");
            return convertResponseData;
        } catch (GetProxyException e) {
            Log.d(TAG, "GetProxyModule::connectProxyService() GetProxyException");
            throw e;
        } catch (ClientProtocolException unused) {
            Log.d(TAG, "GetProxyModule::connectProxyService() ClientProtocolException");
            throw new GetProxyException(Const.MessageInfo.ERROR_CONNECT_DATA);
        } catch (IOException e2) {
            Log.d(TAG, "GetProxyModule::connectProxyService() IOException");
            if (!isNull(e2)) {
                Log.d(TAG, "GetProxyModule::connectProxyService() IOException message=" + e2.getMessage() + " ex=" + e2.toString());
            }
            if (!isNull(e2) && ((e2 instanceof ConnectTimeoutException) || (e2 instanceof SocketTimeoutException))) {
                throw new GetProxyException(Const.MessageInfo.ERROR_CONNECT_TIMEOUT);
            }
            throw new GetProxyException(Const.MessageInfo.ERROR_CONNECT_DATA);
        } catch (Exception unused2) {
            Log.d(TAG, "GetProxyModule::connectProxyService() Exception");
            throw new GetProxyException(Const.MessageInfo.ERROR_GET_DATA);
        }
    }

    private HttpRequestBase createHttpRequestForSwitchMethod(RequestData requestData) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::createHttpRequestForSwitchMethod() start");
        Map<String, String> createRequestHeaderMap = createRequestHeaderMap(requestData);
        if (Const.TargetServiceMethodType.GET.getMethod().equals(requestData.getServiceProviderHttpRequestMethod())) {
            HttpRequestBase httpGet = new HttpGet(createRequestUrl(requestData));
            List<String> arrayList = new ArrayList<>();
            arrayList.add(HttpCatalogs.HEADER_CONTENT_TYPE);
            addRequestHeader(httpGet, createRequestHeaderMap, arrayList);
            Log.d(TAG, "GetProxyModule::createHttpRequestForSwitchMethod() get end");
            return httpGet;
        }
        if (Const.TargetServiceMethodType.POST.getMethod().equals(requestData.getServiceProviderHttpRequestMethod())) {
            HttpPost httpPost = new HttpPost(createRequestUrl(requestData));
            addRequestHeader(httpPost, createRequestHeaderMap, null);
            httpPost.addHeader(HttpCatalogs.HEADER_CONTENT_TYPE, requestData.getContentType());
            httpPost.setEntity(createPostByteArrayEntity(requestData));
            Log.d(TAG, "GetProxyModule::createHttpRequestForSwitchMethod() post end");
            return httpPost;
        }
        Log.d(TAG, "GetProxyModule::createHttpRequestForSwitchMethod() exception end");
        throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
    }

    private Map<String, String> createRequestHeaderMap(RequestData requestData) throws GetProxyException {
        Log.d(TAG, "GetProxyModule::createRequestHeaderMap() start");
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        String serviceProviderRequestHeader = requestData.getServiceProviderRequestHeader();
        if (TextUtils.isEmpty(serviceProviderRequestHeader)) {
            return linkedHashMap;
        }
        try {
            for (Map.Entry<String, JsonElement> entry : ((JsonObject) new Gson().fromJson(serviceProviderRequestHeader, JsonObject.class)).entrySet()) {
                linkedHashMap.put(entry.getKey(), entry.getValue().getAsString());
            }
            Log.d(TAG, "GetProxyModule::createRequestHeaderMap() end");
            return linkedHashMap;
        } catch (Exception unused) {
            Log.d(TAG, "GetProxyModule::createRequestHeaderMap() Exception");
            throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
        }
    }

    private void addRequestHeader(HttpRequestBase httpRequestBase, Map<String, String> map, List<String> list) {
        Log.d(TAG, "GetProxyModule::addRequestHeader() start");
        for (String str : map.keySet()) {
            if (!isNull(list) && list.contains(str)) {
                Log.d(TAG, "GetProxyModule::addRequestHeader() remove key=" + str);
            } else {
                Log.d(TAG, "GetProxyModule::addRequestHeader() add key=" + str);
                httpRequestBase.addHeader(str, map.get(str));
            }
        }
        Log.d(TAG, "GetProxyModule::addRequestHeader() end");
    }

    private Map<String, String> getBodyDataFromRequest(MSHTTPRequest mSHTTPRequest) {
        Map<String, String> linkedHashMap;
        Log.d(TAG, "GetProxyModule::getBodyDataFromRequest() start");
        new LinkedHashMap();
        try {
            Log.d(TAG, "GetProxyModule::getBodyDataFromRequest() request.getHttpBody():" + mSHTTPRequest.getHttpBody());
            linkedHashMap = createParamsMap(mSHTTPRequest);
            for (String str : linkedHashMap.keySet()) {
                Log.d(TAG, "GetProxyModule::getBodyDataFromRequest() key:" + str + ", value:" + linkedHashMap.get(str));
            }
        } catch (Exception unused) {
            Log.d(TAG, "GetProxyModule::getBodyDataFromRequest() error");
            linkedHashMap = new LinkedHashMap<>();
            for (Const.RequestParamDef requestParamDef : Const.RequestParamDef.values()) {
                linkedHashMap.put(requestParamDef.getKey(), mSHTTPRequest.getRequestInfo().getQuery(requestParamDef.getKey()));
            }
        }
        Log.d(TAG, "GetProxyModule::getBodyDataFromRequest() end");
        return linkedHashMap;
    }

    private KeyId getAppInfo(Map<String, String> map) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::getAppInfo() start");
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        String str = map.get(Const.RequestParamDef.KEY_ID.getKey());
        if (TextUtils.isEmpty(str)) {
            throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
        }
        if (Const.RequestParamDef.KEY_ID.isEncodeSet()) {
            Log.d(TAG, "GetProxyModule::getAppInfo() decode app info start keyId:" + str);
            str = decodeURIComponent(str);
            Log.d(TAG, "GetProxyModule::getAppInfo() decode app info end decode:" + str);
        }
        for (Map.Entry<String, JsonElement> entry : ((JsonObject) new Gson().fromJson(str, JsonObject.class)).entrySet()) {
            linkedHashMap.put(entry.getKey(), entry.getValue().getAsString());
        }
        KeyId keyId = new KeyId();
        keyId.setApp((String) linkedHashMap.get("app"));
        keyId.setVer((String) linkedHashMap.get("ver"));
        Log.d(TAG, "GetProxyModule::getAppInfo() end");
        return keyId;
    }

    private RequestData mapRequestInfoForRetryGetKeyInfo(Map<String, String> map, KeyId keyId, boolean z, int i) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() start");
        Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() retry getKeyInfo firstFlag=" + z + ", retryCnt=" + i);
        int i2 = 0;
        boolean z2 = i != 0;
        if (i < 0) {
            i = 0;
        }
        if (z) {
            i++;
        }
        RequestData requestData = null;
        ResponseData responseData = new ResponseData();
        responseData.setMessageInfo(Const.MessageInfo.SUCCESS);
        while (i > i2) {
            Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() mapRequestInfo execute");
            requestData = mapRequestInfoForCheckFailedDecript(map, keyId, responseData);
            if (!Const.MessageInfo.ERROR_FAILED_DECRIPT.getId().equals(responseData.getMessageInfo().getId())) {
                break;
            }
            if (!z2) {
                throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_DECRIPT);
            }
            i2++;
            Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() retry getKeyInfo start retry no." + i2);
            if (i > i2) {
                Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() retry getKeyInfo retry start");
                CipherUtil.clearKeyData(keyId);
                confirmKeyInfo(keyId);
            } else {
                Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() retry getKeyInfo retry end");
                throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_DECRIPT);
            }
        }
        Log.d(TAG, "GetProxyModule::mapRequestInfoForRetryGetKeyInfo() end");
        return requestData;
    }

    private RequestData mapRequestInfoForCheckFailedDecript(Map<String, String> map, KeyId keyId, ResponseData responseData) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::mapRequestInfoForCheckFailedDecript() start");
        RequestData requestData = new RequestData();
        try {
            RequestData mapRequestInfo = mapRequestInfo(map);
            Log.d(TAG, "GetProxyModule::mapRequestInfoForCheckFailedDecript() end");
            responseData.setMessageInfo(Const.MessageInfo.SUCCESS);
            return mapRequestInfo;
        } catch (GetProxyException e) {
            responseData.setMessageInfo(e.getMessageInfo());
            if (Const.MessageInfo.ERROR_FAILED_DECRIPT.getId().equals(e.getMessageInfo().getId())) {
                Log.d(TAG, "GetProxyModule::mapRequestInfoForCheckFailedDecript() GetProxyException(ERROR_FAILED_DECRIPT)");
                return requestData;
            }
            Log.d(TAG, "GetProxyModule::mapRequestInfoForCheckFailedDecript() GetProxyException(NOT ERROR_FAILED_DECRIPT)");
            throw e;
        }
    }

    private RequestData mapRequestInfo(Map<String, String> map) throws GetProxyException {
        Log.d(TAG, "GetProxyModule::mapRequestInfo() start");
        RequestData requestData = new RequestData();
        try {
            setDecriptList(map);
            Log.d(TAG, "GetProxyModule::mapRequestInfo() encrypt start");
            decryptRequestData(map);
            Log.d(TAG, "GetProxyModule::mapRequestInfo() decode start");
            decodeRequestData(map);
            ArrayList arrayList = new ArrayList();
            arrayList.add(Const.RequestParamDef.TIMEOUT.getKey());
            if (!isIntegerForRequestParam(map, arrayList)) {
                Log.d(TAG, "GetProxyModule::mapRequestInfo() Exception");
                throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
            }
            try {
                requestData.setServiceProviderUrl(map.get(Const.RequestParamDef.SERVICE_PROVIDER_URL.getKey()));
                requestData.setServiceProviderHttpRequestMethod(map.get(Const.RequestParamDef.SERVICE_PROVIDER_HTTP_REQUEST_METHOD.getKey()));
                requestData.setServiceProviderType(map.get(Const.RequestParamDef.SERVICE_PROVIDER_TYPE.getKey()));
                requestData.setGetQueryParam(map.get(Const.RequestParamDef.GET_QUERY_PARAM.getKey()));
                requestData.setPostData(map.get(Const.RequestParamDef.POST_DATA.getKey()));
                requestData.setEncryptParamList(map.get(Const.RequestParamDef.ENCRYPT_PARAM_LIST.getKey()));
                requestData.setKeyId(map.get(Const.RequestParamDef.KEY_ID.getKey()));
                requestData.setKeyInfo(getAppInfo(map));
                if (!TextUtils.isEmpty(map.get(Const.RequestParamDef.TIMEOUT.getKey()))) {
                    requestData.setTimeout(Integer.valueOf(Integer.parseInt(map.get(Const.RequestParamDef.TIMEOUT.getKey()))));
                }
                requestData.setServiceProviderRequestHeader(map.get(Const.RequestParamDef.SERVICE_PROVIDER_REQUEST_HEADER.getKey()));
                Iterator<String> it = map.keySet().iterator();
                if (!isNull(it)) {
                    while (it.hasNext()) {
                        String next = it.next();
                        Log.d(TAG, "GetProxyModule::mapRequestInfo() key[" + next + "]  value:" + map.get(next));
                    }
                }
                Log.d(TAG, "GetProxyModule::mapRequestInfo() end");
                return requestData;
            } catch (Exception unused) {
                Log.d(TAG, "GetProxyModule::mapRequestInfo() Exception");
                throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
            }
        } catch (GetProxyException e) {
            Log.d(TAG, "GetProxyModule::mapRequestInfo() GetProxyException");
            throw e;
        } catch (Exception unused2) {
            Log.d(TAG, "GetProxyModule::mapRequestInfo() Exception");
            throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
        }
    }

    private void setDecriptList(Map<String, String> map) {
        map.put(Const.RequestParamDef.ENCRYPT_PARAM_LIST.getKey(), Const.RequestParamDef.SERVICE_PROVIDER_URL.getKey() + "," + Const.RequestParamDef.SERVICE_PROVIDER_HTTP_REQUEST_METHOD.getKey() + "," + Const.RequestParamDef.GET_QUERY_PARAM.getKey() + "," + Const.RequestParamDef.POST_DATA.getKey() + "," + Const.RequestParamDef.TIMEOUT.getKey() + "," + Const.RequestParamDef.SERVICE_PROVIDER_REQUEST_HEADER.getKey());
    }

    private boolean checkRequestData(Map<String, String> map) {
        for (Const.RequestParamDef requestParamDef : Const.RequestParamDef.values()) {
            String str = map.get(requestParamDef.getKey());
            Log.d(TAG, "GetProxyModule::initCheckRequestData() key:" + requestParamDef.getKey() + ", data:" + str);
            if (requestParamDef.isRequired() && TextUtils.isEmpty(str)) {
                return false;
            }
        }
        return true;
    }

    private void decodeRequestData(Map<String, String> map) throws UnsupportedEncodingException {
        Log.d(TAG, "GetProxyModule::decodeRequestData() start");
        for (Const.RequestParamDef requestParamDef : Const.RequestParamDef.values()) {
            String str = map.get(requestParamDef.getKey());
            Log.d(TAG, "GetProxyModule::decodeRequestData() key:" + requestParamDef.getKey() + ", data:" + str);
            if (requestParamDef.isEncodeSet() && !TextUtils.isEmpty(str)) {
                map.put(requestParamDef.getKey(), decodeURIComponent(str));
            }
        }
        Log.d(TAG, "GetProxyModule::decodeRequestData() end");
    }

    private boolean isIntegerForRequestParam(Map<String, String> map, List<String> list) {
        Log.d(TAG, "GetProxyModule::isIntegerForRequestParam() start");
        Const.RequestParamDef[] values = Const.RequestParamDef.values();
        int length = values.length;
        boolean z = false;
        int i = 0;
        while (true) {
            if (i >= length) {
                z = true;
                break;
            }
            Const.RequestParamDef requestParamDef = values[i];
            String str = map.get(requestParamDef.getKey());
            Log.d(TAG, "GetProxyModule::isIntegerForRequestParam() key:" + requestParamDef.getKey() + ", data:" + str);
            if (!TextUtils.isEmpty(str)) {
                if (isNull(list) || list.size() == 0 || list.contains(requestParamDef.getKey())) {
                    Log.d(TAG, "GetProxyModule::isIntegerForRequestParam() check in key[" + requestParamDef.getKey() + "]");
                    if (!isInteger(str)) {
                        if (requestParamDef.isRequired() || !TextUtils.isEmpty(str)) {
                            break;
                        }
                    } else {
                        continue;
                    }
                }
                i++;
            } else {
                if (requestParamDef.isRequired()) {
                    break;
                }
                i++;
            }
        }
        Log.d(TAG, "GetProxyModule::isIntegerForRequestParam() result:" + z);
        return z;
    }

    private boolean isInteger(String str) {
        Log.d(TAG, "GetProxyModule::isInteger() start");
        boolean z = false;
        if (!TextUtils.isEmpty(str)) {
            try {
                if (Integer.parseInt(str) >= 0) {
                    z = true;
                }
            } catch (Exception unused) {
            }
        }
        Log.d(TAG, "GetProxyModule::isInteger() result:" + z);
        return z;
    }

    private String decodeURIComponent(String str) {
        Log.d(TAG, "GetProxyModule::decodeURIComponent() start");
        return Uri.decode(str);
    }

    private String encodeURIComponent(String str) {
        Log.d(TAG, "GetProxyModule::encodeURIComponent() start");
        return Uri.encode(str);
    }

    private void decryptRequestData(Map<String, String> map) throws UnsupportedEncodingException, GetProxyException {
        Log.d(TAG, "GetProxyModule::decryptRequestData() start");
        String str = map.get(Const.RequestParamDef.ENCRYPT_PARAM_LIST.getKey());
        if (!isNull(str)) {
            for (String str2 : str.split(",")) {
                if (Const.RequestParamDef.ENCRYPT_PARAM_LIST.getKey().equals(str2)) {
                    Log.d(TAG, "GetProxyModule::decryptRequestData() encryptList continue...");
                } else {
                    String str3 = map.get(str2);
                    Log.d(TAG, "GetProxyModule::decryptRequestData() key:[" + str2 + "], beforeData:" + str3);
                    if (isNull(str3)) {
                        continue;
                    } else {
                        String decryptWrapper = CipherUtil.decryptWrapper(str3, getAppInfo(map).getApp());
                        Log.d(TAG, "GetProxyModule::decryptRequestData() key:[" + str2 + "], decryptData:" + decryptWrapper);
                        if (!isNull(decryptWrapper)) {
                            map.put(str2, decryptWrapper);
                        } else {
                            Log.d(TAG, "GetProxyModule::decryptRequestData() KeyInfoException");
                            throw new GetProxyException(Const.MessageInfo.ERROR_FAILED_DECRIPT);
                        }
                    }
                }
            }
        }
        Log.d(TAG, "GetProxyModule::decryptRequestData() end");
    }

    private String createRequestUrl(RequestData requestData) throws GetProxyException {
        String serviceProviderUrl;
        Log.d(TAG, "GetProxyModule::createRequestUrl() start");
        StringBuilder sb = new StringBuilder();
        Uri.Builder builder = new Uri.Builder();
        if ("?".equals(requestData.getServiceProviderUrl().substring(requestData.getServiceProviderUrl().length() - 1, requestData.getServiceProviderUrl().length()))) {
            Log.d(TAG, "GetProxyModule::createRequestUrl() hatena exist");
            serviceProviderUrl = requestData.getServiceProviderUrl().substring(0, requestData.getServiceProviderUrl().length() - 1);
            Log.d(TAG, "GetProxyModule::createRequestUrl() modify url:" + serviceProviderUrl);
        } else {
            Log.d(TAG, "GetProxyModule::createRequestUrl() hatena not exist");
            serviceProviderUrl = requestData.getServiceProviderUrl();
        }
        if (!isSSLUrl(serviceProviderUrl)) {
            throw new GetProxyException(Const.MessageInfo.WARN_INVALID_REQUEST_PARAM);
        }
        builder.encodedPath(serviceProviderUrl);
        builder.encodedQuery(requestData.getGetQueryParam());
        sb.append(builder.build().toString());
        Log.d(TAG, "GetProxyModule::createRequestUrl() end");
        return sb.toString();
    }

    private boolean isSSLUrl(String str) {
        Log.d(TAG, "GetProxyModule::isSSLUrl() start");
        if (TextUtils.isEmpty(str)) {
            Log.d(TAG, "GetProxyModule::isSSLUrl() null end");
            return false;
        }
        if (str.toLowerCase().indexOf(Const.HTTPS) == 0) {
            Log.d(TAG, "GetProxyModule::isSSLUrl() true end");
            return true;
        }
        Log.d(TAG, "GetProxyModule::isSSLUrl() false end");
        return false;
    }

    private Map<String, String> convertAppendQueryMap(String str) {
        Log.d(TAG, "GetProxyModule::convertAppendQueryMap() start");
        if (TextUtils.isEmpty(str)) {
            return new LinkedHashMap();
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        for (String str2 : str.split(Const.REQUEST_PARAM_SEPARATE_STR, 0)) {
            String[] split = str2.split(Const.REQUEST_KEY_VALUE_SEPARATE_STR, 0);
            if (split != null && split.length >= 2) {
                String str3 = split[0];
                String str4 = split[1];
                if ("?".equals(str3.substring(0, 1))) {
                    str3 = str3.substring(1);
                }
                Log.d(TAG, "GetProxyModule::convertAppendQueryMap() key:" + str3 + ", value:" + str4);
                linkedHashMap.put(str3, str4);
            }
        }
        Log.d(TAG, "GetProxyModule::convertAppendQueryMap() end");
        return linkedHashMap;
    }

    private ByteArrayEntity createPostByteArrayEntity(RequestData requestData) throws UnsupportedEncodingException {
        Log.d(TAG, "GetProxyModule::createPostByteArrayEntity() start");
        if (isNull(requestData) || TextUtils.isEmpty(requestData.getPostData())) {
            return null;
        }
        Log.d(TAG, "GetProxyModule::createPostByteArrayEntity() changed end");
        return new ByteArrayEntity(requestData.getPostData().getBytes("UTF-8"));
    }

    private Map<String, String> convertMapFromClientData(RequestData requestData) {
        Log.d(TAG, "GetProxyModule::convertRequestMap() start");
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        if (isNull(requestData.getPostData())) {
            return linkedHashMap;
        }
        try {
            for (Map.Entry<String, JsonElement> entry : ((JsonObject) new Gson().fromJson(requestData.getPostData(), JsonObject.class)).entrySet()) {
                linkedHashMap.put(entry.getKey(), entry.getValue().getAsString());
            }
        } catch (Exception unused) {
            Log.d(TAG, "GetProxyModule::convertRequestMap() Exception");
        }
        Log.d(TAG, "GetProxyModule::convertRequestMap() end");
        return linkedHashMap;
    }

    private List<NameValuePair> convertPostRequestData(Map<String, String> map) {
        Log.d(TAG, "GetProxyModule::createRequestData() start");
        ArrayList arrayList = new ArrayList();
        for (String str : map.keySet()) {
            arrayList.add(new BasicNameValuePair(str, map.get(str)));
        }
        Log.d(TAG, "GetProxyModule::createRequestData() end");
        return arrayList;
    }

    private void returnResponse(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder, ResponseData responseData) {
        Log.d(TAG, "GetProxyModule::returnResponse() start");
        if (isNull(responseData)) {
            responseData = new ResponseData();
            responseData.setMessageInfo(Const.MessageInfo.ERROR_SYSYTEM);
        }
        String createCustomResultHeader = createCustomResultHeader(responseData);
        String responseErrorData = responseErrorData(responseData);
        Log.d(TAG, "GetProxyModule::returnResponse() resultHeader:" + createCustomResultHeader);
        ArrayList<Header> createResponseHeader = createResponseHeader(responseData, createCustomResultHeader);
        if (Const.MessageInfo.SUCCESS.getId().equals(responseData.getMessageInfo().getId())) {
            mSHTTPResponder.startResponse(responseData.getMessageInfo().getStatusNo(), (Header[]) createResponseHeader.toArray(new Header[createResponseHeader.size()]));
            if (!isNull(responseData.getEncryptData())) {
                Log.d(TAG, "GetProxyModule::returnResponse() set encrypt data");
                mSHTTPResponder.writeResponseData(convertResponseByteData(responseData.getEncryptData()));
            } else {
                Log.d(TAG, "GetProxyModule::returnResponse() set string data");
                mSHTTPResponder.writeResponseData(convertResponseByteData(responseData.getResponseData()));
            }
        } else {
            Log.d(TAG, "GetProxyModule::returnResponse() set error data");
            mSHTTPResponder.startResponse(responseData.getMessageInfo().getStatusNo(), (Header[]) createResponseHeader.toArray(new Header[createResponseHeader.size()]));
            mSHTTPResponder.writeResponseData(convertResponseByteData(responseErrorData));
        }
        mSHTTPResponder.closeResponse();
        Log.d(TAG, "GetProxyModule::returnResponse() end");
    }

    private byte[] convertResponseByteData(String str) {
        byte[] bytes;
        Log.d(TAG, "GetProxyModule::convertResponseByteData() start");
        try {
            bytes = str.getBytes("UTF-8");
        } catch (UnsupportedEncodingException unused) {
            bytes = "".getBytes();
        }
        Log.d(TAG, "GetProxyModule::convertResponseByteData() end");
        return bytes;
    }

    private ArrayList<Header> createResponseHeader(ResponseData responseData, String str) {
        Log.d(TAG, "GetProxyModule::createResponseHeader() start");
        ArrayList<Header> arrayList = new ArrayList<>();
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONNECTION, "close"));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"));
        arrayList.add(new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER));
        if (Const.MessageInfo.SUCCESS.getId().equals(responseData.getMessageInfo().getId())) {
            if (!isNull(responseData.getEncryptData())) {
                Log.d(TAG, "GetProxyModule::createResponseHeader() encrypt");
                arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, "application/x-www-form-urlencoded; charset=utf-8"));
            } else {
                Log.d(TAG, "GetProxyModule::createResponseHeader() not encrypt");
                arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, responseData.getContentType()));
            }
        } else {
            arrayList.add(new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, "application/json; charset=utf-8"));
        }
        Log.d(TAG, "GetProxyModule::createResponseHeader() end");
        return arrayList;
    }

    private ResponseData convertResponseData(HttpResponse httpResponse, RequestData requestData) throws GetProxyException, Exception {
        Log.d(TAG, "GetProxyModule::convertResponseData() start");
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        while (true) {
            String readLine = bufferedReader.readLine();
            if (readLine == null) {
                break;
            }
            sb.append(readLine + "\n");
        }
        String value = httpResponse.getLastHeader(HttpCatalogs.HEADER_CONTENT_TYPE).getValue();
        int statusCode = httpResponse.getStatusLine().getStatusCode();
        if (statusCode != 200) {
            Log.d(TAG, "GetProxyModule::convertResponseData() Status Exception code:" + statusCode);
            throw new GetProxyException(Const.MessageInfo.ERROR_CONNECT_DATA);
        }
        ResponseData responseData = new ResponseData();
        responseData.setResponseData(sb.toString());
        if (!isNull(requestData.getEncryptParamList())) {
            responseData.setEncryptData(CipherUtil.encryptWrapper(sb.toString(), requestData.getKeyInfo().getApp()));
            responseData.setDataLength(responseData.getEncryptData().getBytes("UTF-8").length);
        } else {
            responseData.setDataLength(sb.toString().getBytes("UTF-8").length);
            responseData.setEncryptData(null);
        }
        responseData.setContentType(value);
        outLog("GetProxyModule::convertResponseData() data:" + responseData.getResponseData());
        Log.d(TAG, "GetProxyModule::convertResponseData() contentType:" + responseData.getContentType());
        Log.d(TAG, "GetProxyModule::convertResponseData() dataLength:" + responseData.getDataLength());
        Log.d(TAG, "GetProxyModule::convertResponseData() end");
        return responseData;
    }

    private String createCustomResultHeader(ResponseData responseData) {
        Log.d(TAG, "GetProxyModule::createCustomHeaderData() start");
        StringBuilder sb = new StringBuilder("");
        sb.append("result=");
        if (!isNull(responseData) && Const.MessageInfo.SUCCESS.getId().equals(responseData.getMessageInfo().getId())) {
            sb.append("true");
        } else {
            sb.append("false");
        }
        sb.append(Const.RESPONSE_HEADER_SEPRARATE_STR);
        sb.append("code=");
        if (!isNull(responseData) && !isNull(responseData.getMessageInfo().getId())) {
            sb.append(responseData.getMessageInfo().getId());
        } else {
            sb.append(Const.MessageInfo.ERROR_SYSYTEM.getId());
            responseData.setMessageInfo(Const.MessageInfo.ERROR_SYSYTEM);
        }
        Log.d(TAG, "GetProxyModule::createCustomHeaderData() end");
        return sb.toString();
    }

    private String responseErrorData(ResponseData responseData) {
        Log.d(TAG, "GetProxyModule::responseErrorData() start");
        JSONObject jSONObject = new JSONObject();
        try {
            if (!isNull(responseData) && Const.MessageInfo.SUCCESS.getId().equals(responseData.getMessageInfo().getId())) {
                jSONObject.put("result", "true");
            } else {
                jSONObject.put("result", "false");
            }
            if (!isNull(responseData) && !isNull(responseData.getMessageInfo().getId())) {
                jSONObject.put("code", responseData.getMessageInfo().getId());
            } else {
                jSONObject.put("code", Const.MessageInfo.ERROR_SYSYTEM.getId());
            }
            Log.d(TAG, "GetProxyModule::responseErrorData() end");
            return jSONObject.toString();
        } catch (Exception unused) {
            return "";
        }
    }

    public static void outLog(String str) {
        String substring;
        Log.d(TAG, "GetProxyModule::outLog() start");
        if (isNull(str)) {
            Log.d(TAG, "GetProxyModule::outLog():no data");
            return;
        }
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(str);
            int i = 0;
            int i2 = 4000;
            while (sb.toString().length() > 0) {
                if (sb.length() > 4000) {
                    substring = str.substring(i, i2);
                    sb.setLength(0);
                    sb.append(str.substring(i2));
                } else {
                    substring = str.substring(i);
                    sb.setLength(0);
                }
                i += 4000;
                i2 += 4000;
                Log.d(TAG, "GetProxyModule::outLog() append part .1:" + substring + "」");
            }
        } catch (Exception e) {
            Log.d(TAG, "GetProxyModule::outLog() Exception ex:" + e.getMessage());
        }
    }
}
