package ai.api;

import ai.api.model.AIContext;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.model.Entity;
import ai.api.util.IOUtils;
import ai.api.util.StringUtils;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSyntaxException;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* loaded from: classes.dex */
public class AIDataService {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    private static final String DEFAULT_REQUEST_METHOD = "POST";
    private static final String REQUEST_METHOD_DELETE = "DELETE";
    private static final String REQUEST_METHOD_GET = "GET";
    private static final String REQUEST_METHOD_POST = "POST";
    private final AIConfiguration config;
    private final AIServiceContext defaultServiceContext;
    private static final Logger logger = LoggerFactory.getLogger((Class<?>) AIDataService.class);
    private static final AIServiceContext UNDEFINED_SERVICE_CONTEXT = null;
    private static final Gson GSON = GsonFactory.getDefaultFactory().getGson();

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface ApiActiveContextListResponse extends List<AIContext> {
    }

    public AIDataService(AIConfiguration aIConfiguration, AIServiceContext aIServiceContext) {
        if (aIConfiguration == null) {
            throw new IllegalArgumentException("config should not be null");
        }
        this.config = aIConfiguration.m0clone();
        if (aIServiceContext == null) {
            this.defaultServiceContext = new AIServiceContextBuilder().generateSessionId().build();
        } else {
            this.defaultServiceContext = aIServiceContext;
        }
    }

    public AIDataService(AIConfiguration aIConfiguration) {
        this(aIConfiguration, null);
    }

    public AIServiceContext getContext() {
        return this.defaultServiceContext;
    }

    public AIResponse request(AIRequest aIRequest) throws AIServiceException {
        return request(aIRequest, (RequestExtras) null);
    }

    public AIResponse request(AIRequest aIRequest, AIServiceContext aIServiceContext) throws AIServiceException {
        return request(aIRequest, (RequestExtras) null, aIServiceContext);
    }

    public AIResponse request(AIRequest aIRequest, RequestExtras requestExtras) throws AIServiceException {
        return request(aIRequest, requestExtras, UNDEFINED_SERVICE_CONTEXT);
    }

    public AIResponse request(AIRequest aIRequest, RequestExtras requestExtras, AIServiceContext aIServiceContext) throws AIServiceException {
        if (aIRequest == null) {
            throw new IllegalArgumentException("Request argument must not be null");
        }
        Logger logger2 = logger;
        logger2.debug("Start request");
        try {
            if (StringUtils.isEmpty(aIRequest.getLanguage())) {
                aIRequest.setLanguage(this.config.getApiAiLanguage());
            }
            if (StringUtils.isEmpty(aIRequest.getSessionId())) {
                aIRequest.setSessionId(getSessionId(aIServiceContext));
            }
            if (StringUtils.isEmpty(aIRequest.getTimezone())) {
                aIRequest.setTimezone(getTimeZone(aIServiceContext));
            }
            Map<String, String> map = null;
            if (requestExtras != null) {
                fillRequest(aIRequest, requestExtras);
                map = requestExtras.getAdditionalHeaders();
            }
            Gson gson = GSON;
            String doTextRequest = doTextRequest(this.config.getQuestionUrl(aIRequest.getSessionId()), gson.toJson(aIRequest), map);
            if (StringUtils.isEmpty(doTextRequest)) {
                throw new AIServiceException("Empty response from ai service. Please check configuration and Internet connection.");
            }
            logger2.debug("Response json: " + doTextRequest.replaceAll("[\r\n]+", " "));
            AIResponse aIResponse = (AIResponse) gson.fromJson(doTextRequest, AIResponse.class);
            if (aIResponse == null) {
                throw new AIServiceException("API.AI response parsed as null. Check debug log for details.");
            }
            if (aIResponse.isError()) {
                throw new AIServiceException(aIResponse);
            }
            aIResponse.cleanup();
            return aIResponse;
        } catch (JsonSyntaxException e) {
            throw new AIServiceException("Wrong service answer format. Please, connect to API.AI Service support", e);
        } catch (MalformedURLException e2) {
            logger.error("Malformed url should not be raised", (Throwable) e2);
            throw new AIServiceException("Wrong configuration. Please, connect to API.AI Service support", e2);
        }
    }

    public AIResponse voiceRequest(InputStream inputStream) throws AIServiceException {
        return voiceRequest(inputStream, new RequestExtras());
    }

    public AIResponse voiceRequest(InputStream inputStream, List<AIContext> list) throws AIServiceException {
        return voiceRequest(inputStream, new RequestExtras(list, null));
    }

    public AIResponse voiceRequest(InputStream inputStream, RequestExtras requestExtras) throws AIServiceException {
        return voiceRequest(inputStream, requestExtras, UNDEFINED_SERVICE_CONTEXT);
    }

    public AIResponse voiceRequest(InputStream inputStream, RequestExtras requestExtras, AIServiceContext aIServiceContext) throws AIServiceException {
        Logger logger2 = logger;
        logger2.debug("Start voice request");
        try {
            AIRequest aIRequest = new AIRequest();
            aIRequest.setLanguage(this.config.getApiAiLanguage());
            aIRequest.setSessionId(getSessionId(aIServiceContext));
            aIRequest.setTimezone(getTimeZone(aIServiceContext));
            Map<String, String> map = null;
            if (requestExtras != null) {
                fillRequest(aIRequest, requestExtras);
                map = requestExtras.getAdditionalHeaders();
            }
            Gson gson = GSON;
            String json = gson.toJson(aIRequest);
            logger2.debug("Request json: " + json);
            String doSoundRequest = doSoundRequest(inputStream, json, map);
            if (StringUtils.isEmpty(doSoundRequest)) {
                throw new AIServiceException("Empty response from ai service. Please check configuration.");
            }
            logger2.debug("Response json: " + doSoundRequest);
            AIResponse aIResponse = (AIResponse) gson.fromJson(doSoundRequest, AIResponse.class);
            if (aIResponse == null) {
                throw new AIServiceException("API.AI response parsed as null. Check debug log for details.");
            }
            if (aIResponse.isError()) {
                throw new AIServiceException(aIResponse);
            }
            aIResponse.cleanup();
            return aIResponse;
        } catch (JsonSyntaxException e) {
            throw new AIServiceException("Wrong service answer format. Please, connect to API.AI Service support", e);
        } catch (MalformedURLException e2) {
            logger.error("Malformed url should not be raised", (Throwable) e2);
            throw new AIServiceException("Wrong configuration. Please, connect to AI Service support", e2);
        }
    }

    @Deprecated
    public boolean resetContexts() {
        AIRequest aIRequest = new AIRequest();
        aIRequest.setQuery("empty_query_for_resetting_contexts");
        aIRequest.setResetContexts(true);
        try {
            return !request(aIRequest).isError();
        } catch (AIServiceException e) {
            logger.error("Exception while contexts clean.", (Throwable) e);
            return false;
        }
    }

    public List<AIContext> getActiveContexts() throws AIServiceException {
        return getActiveContexts(UNDEFINED_SERVICE_CONTEXT);
    }

    public List<AIContext> getActiveContexts(AIServiceContext aIServiceContext) throws AIServiceException {
        try {
            return (List) doRequest(ApiActiveContextListResponse.class, this.config.getContextsUrl(getSessionId(aIServiceContext)), "GET");
        } catch (BadResponseStatusException e) {
            throw new AIServiceException(e.response);
        }
    }

    public AIContext getActiveContext(String str) throws AIServiceException {
        return getActiveContext(str, UNDEFINED_SERVICE_CONTEXT);
    }

    public AIContext getActiveContext(String str, AIServiceContext aIServiceContext) throws AIServiceException {
        try {
            return (AIContext) doRequest(AIContext.class, this.config.getContextsUrl(getSessionId(aIServiceContext), str), "GET");
        } catch (BadResponseStatusException e) {
            if (e.response.getStatus().getCode().intValue() == 404) {
                return null;
            }
            throw new AIServiceException(e.response);
        }
    }

    public List<String> addActiveContext(Iterable<AIContext> iterable) throws AIServiceException {
        return addActiveContext(iterable, UNDEFINED_SERVICE_CONTEXT);
    }

    public List<String> addActiveContext(Iterable<AIContext> iterable, AIServiceContext aIServiceContext) throws AIServiceException {
        try {
            return ((ApiActiveContextNamesResponse) doRequest((AIDataService) iterable, ApiActiveContextNamesResponse.class, this.config.getContextsUrl(getSessionId(aIServiceContext)), HttpCatalogs.METHOD_POST)).names;
        } catch (BadResponseStatusException e) {
            throw new AIServiceException(e.response);
        }
    }

    // public String addActiveContext(AIContext aIContext) throws AIServiceException {
    //    return addActiveContext(aIContext, UNDEFINED_SERVICE_CONTEXT);
    //}

   // public String addActiveContext(AIContext aIContext, AIServiceContext aIServiceContext) throws AIServiceException {
    //    try {
    //        ApiActiveContextNamesResponse apiActiveContextNamesResponse = (ApiActiveContextNamesResponse) doRequest((AIDataService) aIContext, ApiActiveContextNamesResponse.class, this.config.getContextsUrl(getSessionId(aIServiceContext)), HttpCatalogs.METHOD_POST);
    //        if (apiActiveContextNamesResponse.names == null || apiActiveContextNamesResponse.names.size() <= 0) {
    //            return null;
    //        }
    //        return apiActiveContextNamesResponse.names.get(0);
    //    } catch (BadResponseStatusException e) {
    //        throw new AIServiceException(e.response);
    //    }
    //}

    public void resetActiveContexts() throws AIServiceException {
        resetActiveContexts(UNDEFINED_SERVICE_CONTEXT);
    }

    public void resetActiveContexts(AIServiceContext aIServiceContext) throws AIServiceException {
        try {
            doRequest(AIResponse.class, this.config.getContextsUrl(getSessionId(aIServiceContext)), "DELETE");
        } catch (BadResponseStatusException e) {
            throw new AIServiceException(e.response);
        }
    }

    public boolean removeActiveContext(String str) throws AIServiceException {
        return removeActiveContext(str, UNDEFINED_SERVICE_CONTEXT);
    }

    public boolean removeActiveContext(String str, AIServiceContext aIServiceContext) throws AIServiceException {
        try {
            doRequest(AIResponse.class, this.config.getContextsUrl(getSessionId(aIServiceContext), str), "DELETE");
            return true;
        } catch (BadResponseStatusException e) {
            if (e.response.getStatus().getCode().intValue() == 404) {
                return false;
            }
            throw new AIServiceException(e.response);
        }
    }

    public AIResponse uploadUserEntity(Entity entity) throws AIServiceException {
        return uploadUserEntity(entity, UNDEFINED_SERVICE_CONTEXT);
    }

    public AIResponse uploadUserEntity(Entity entity, AIServiceContext aIServiceContext) throws AIServiceException {
        return uploadUserEntities(Collections.singleton(entity), aIServiceContext);
    }

    public AIResponse uploadUserEntities(Collection<Entity> collection) throws AIServiceException {
        return uploadUserEntities(collection, UNDEFINED_SERVICE_CONTEXT);
    }

    public AIResponse uploadUserEntities(Collection<Entity> collection, AIServiceContext aIServiceContext) throws AIServiceException {
        if (collection == null || collection.size() == 0) {
            throw new AIServiceException("Empty entities list");
        }
        Gson gson = GSON;
        try {
            String doTextRequest = doTextRequest(this.config.getUserEntitiesEndpoint(getSessionId(aIServiceContext)), gson.toJson(collection));
            if (StringUtils.isEmpty(doTextRequest)) {
                throw new AIServiceException("Empty response from ai service. Please check configuration and Internet connection.");
            }
            logger.debug("Response json: " + doTextRequest);
            AIResponse aIResponse = (AIResponse) gson.fromJson(doTextRequest, AIResponse.class);
            if (aIResponse == null) {
                throw new AIServiceException("API.AI response parsed as null. Check debug log for details.");
            }
            if (aIResponse.isError()) {
                throw new AIServiceException(aIResponse);
            }
            aIResponse.cleanup();
            return aIResponse;
        } catch (JsonSyntaxException e) {
            throw new AIServiceException("Wrong service answer format. Please, connect to API.AI Service support", e);
        } catch (MalformedURLException e2) {
            logger.error("Malformed url should not be raised", (Throwable) e2);
            throw new AIServiceException("Wrong configuration. Please, connect to AI Service support", e2);
        }
    }

    protected String doTextRequest(String str, AIServiceContext aIServiceContext) throws MalformedURLException, AIServiceException {
        return doTextRequest(this.config.getQuestionUrl(getSessionId(aIServiceContext)), str);
    }

    protected String doTextRequest(String str) throws MalformedURLException, AIServiceException {
        return doTextRequest(str, UNDEFINED_SERVICE_CONTEXT);
    }

    protected String doTextRequest(String str, String str2) throws MalformedURLException, AIServiceException {
        return doTextRequest(str, str2, null);
    }

    protected String doTextRequest(String str, String str2, Map<String, String> map) throws MalformedURLException, AIServiceException {
        HttpURLConnection httpURLConnection;
        HttpURLConnection httpURLConnection2 = null;
        try {
            try {
                URL url = new URL(str);
                logger.debug("Request json: " + str2);
                if (this.config.getProxy() != null) {
                    httpURLConnection = (HttpURLConnection) url.openConnection(this.config.getProxy());
                } else {
                    httpURLConnection = (HttpURLConnection) url.openConnection();
                }
                httpURLConnection2 = httpURLConnection;
                httpURLConnection2.setRequestMethod(HttpCatalogs.METHOD_POST);
                httpURLConnection2.setDoOutput(true);
                httpURLConnection2.addRequestProperty(HttpCatalogs.HEADER_AUTHORIZATION, "Bearer " + this.config.getApiKey());
                httpURLConnection2.addRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "application/json; charset=utf-8");
                httpURLConnection2.addRequestProperty("Accept", HarmanOTAConst.JSON_CONTENT_TYPE);
                if (map != null) {
                    for (Map.Entry<String, String> entry : map.entrySet()) {
                        httpURLConnection2.addRequestProperty(entry.getKey(), entry.getValue());
                    }
                }
                httpURLConnection2.connect();
                BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(httpURLConnection2.getOutputStream());
                IOUtils.writeAll(str2, bufferedOutputStream);
                bufferedOutputStream.close();
                BufferedInputStream bufferedInputStream = new BufferedInputStream(httpURLConnection2.getInputStream());
                String readAll = IOUtils.readAll(bufferedInputStream);
                bufferedInputStream.close();
                if (httpURLConnection2 != null) {
                    httpURLConnection2.disconnect();
                }
                return readAll;
            } catch (IOException e) {
                if (httpURLConnection2 != null) {
                    try {
                        InputStream errorStream = httpURLConnection2.getErrorStream();
                        if (errorStream != null) {
                            String readAll2 = IOUtils.readAll(errorStream);
                            logger.debug(readAll2);
                            if (httpURLConnection2 != null) {
                                httpURLConnection2.disconnect();
                            }
                            return readAll2;
                        }
                        throw new AIServiceException("Can't connect to the api.ai service.", e);
                    } catch (IOException e2) {
                        logger.warn("Can't read error response", (Throwable) e2);
                        logger.error("Can't make request to the API.AI service. Please, check connection settings and API access token.", (Throwable) e);
                        throw new AIServiceException("Can't make request to the API.AI service. Please, check connection settings and API access token.", e);
                    }
                }
                logger.error("Can't make request to the API.AI service. Please, check connection settings and API access token.", (Throwable) e);
                throw new AIServiceException("Can't make request to the API.AI service. Please, check connection settings and API access token.", e);
            }
        } catch (Throwable th) {
            if (httpURLConnection2 != null) {
                httpURLConnection2.disconnect();
            }
            throw th;
        }
    }

    protected String doSoundRequest(InputStream inputStream, String str) throws MalformedURLException, AIServiceException {
        return doSoundRequest(inputStream, str, null, UNDEFINED_SERVICE_CONTEXT);
    }

    protected String doSoundRequest(InputStream inputStream, String str, Map<String, String> map) throws MalformedURLException, AIServiceException {
        return doSoundRequest(inputStream, str, map, UNDEFINED_SERVICE_CONTEXT);
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:42:0x0108  */
    /* JADX WARN: Type inference failed for: r1v0 */
    /* JADX WARN: Type inference failed for: r1v1, types: [java.net.HttpURLConnection] */
    /* JADX WARN: Type inference failed for: r1v2 */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    protected java.lang.String doSoundRequest(java.io.InputStream r6, java.lang.String r7, java.util.Map<java.lang.String, java.lang.String> r8, ai.api.AIServiceContext r9) throws java.net.MalformedURLException, ai.api.AIServiceException {
        /*
            Method dump skipped, instructions count: 270
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: ai.api.AIDataService.doSoundRequest(java.io.InputStream, java.lang.String, java.util.Map, ai.api.AIServiceContext):java.lang.String");
    }

    protected <TResponse> TResponse doRequest(Type type, String str, String str2) throws AIServiceException, BadResponseStatusException {
        return (TResponse) doRequest(type, str, str2, (Map<String, String>) null);
    }

    protected <TRequest, TResponse> TResponse doRequest(TRequest trequest, Type type, String str, String str2) throws AIServiceException, BadResponseStatusException {
        return (TResponse) doRequest(trequest, type, str, str2, (Map) null);
    }

    protected <TResponse> TResponse doRequest(Type type, String str, String str2, Map<String, String> map) throws AIServiceException, BadResponseStatusException {
        return (TResponse) doRequest(null, type, str, str2, map);
    }

    protected <TRequest, TResponse> TResponse doRequest(TRequest trequest, Type type, String str, String str2, Map<String, String> map) throws AIServiceException, BadResponseStatusException {
        HttpURLConnection httpURLConnection;
        HttpURLConnection httpURLConnection2 = null;
        try {
            try {
                URL url = new URL(str);
                String json = trequest != null ? GSON.toJson(trequest) : null;
                if (str2 == null) {
                    str2 = HttpCatalogs.METHOD_POST;
                }
                logger.debug("Request json: " + json);
                if (this.config.getProxy() != null) {
                    httpURLConnection = (HttpURLConnection) url.openConnection(this.config.getProxy());
                } else {
                    httpURLConnection = (HttpURLConnection) url.openConnection();
                }
                HttpURLConnection httpURLConnection3 = httpURLConnection;
                if (json != null && !HttpCatalogs.METHOD_POST.equals(str2)) {
                    throw new AIServiceException("Non-empty request should be sent using POST method");
                }
                httpURLConnection3.setRequestMethod(str2);
                if (HttpCatalogs.METHOD_POST.equals(str2)) {
                    httpURLConnection3.setDoOutput(true);
                }
                httpURLConnection3.addRequestProperty(HttpCatalogs.HEADER_AUTHORIZATION, "Bearer " + this.config.getApiKey());
                httpURLConnection3.addRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "application/json; charset=utf-8");
                httpURLConnection3.addRequestProperty("Accept", HarmanOTAConst.JSON_CONTENT_TYPE);
                if (map != null) {
                    for (Map.Entry<String, String> entry : map.entrySet()) {
                        httpURLConnection3.addRequestProperty(entry.getKey(), entry.getValue());
                    }
                }
                httpURLConnection3.connect();
                if (json != null) {
                    BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(httpURLConnection3.getOutputStream());
                    IOUtils.writeAll(json, bufferedOutputStream);
                    bufferedOutputStream.close();
                }
                BufferedInputStream bufferedInputStream = new BufferedInputStream(httpURLConnection3.getInputStream());
                String readAll = IOUtils.readAll(bufferedInputStream);
                bufferedInputStream.close();
                try {
                    AIResponse aIResponse = (AIResponse) GSON.fromJson(readAll, AIResponse.class);
                    if (aIResponse.getStatus() != null && aIResponse.getStatus().getCode().intValue() != 200) {
                        throw new BadResponseStatusException(aIResponse);
                    }
                } catch (JsonParseException unused) {
                }
                TResponse tresponse = (TResponse) GSON.fromJson(readAll, type);
                if (httpURLConnection3 != null) {
                    httpURLConnection3.disconnect();
                }
                return tresponse;
            } catch (IOException e) {
                if (0 != 0) {
                    try {
                        InputStream errorStream = httpURLConnection2.getErrorStream();
                        if (errorStream != null) {
                            String readAll2 = IOUtils.readAll(errorStream);
                            logger.debug(readAll2);
                            throw new AIServiceException(readAll2, e);
                        }
                        throw new AIServiceException("Can't connect to the api.ai service.", e);
                    } catch (IOException e2) {
                        logger.warn("Can't read error response", (Throwable) e2);
                        logger.error("Can't make request to the API.AI service. Please, check connection settings and API access token.", (Throwable) e);
                        throw new AIServiceException("Can't make request to the API.AI service. Please, check connection settings and API access token.", e);
                    }
                }
                logger.error("Can't make request to the API.AI service. Please, check connection settings and API access token.", (Throwable) e);
                throw new AIServiceException("Can't make request to the API.AI service. Please, check connection settings and API access token.", e);
            }
        } catch (Throwable th) {
            if (0 != 0) {
                httpURLConnection2.disconnect();
            }
            throw th;
        }
    }

    private void fillRequest(AIRequest aIRequest, RequestExtras requestExtras) {
        if (requestExtras.hasContexts()) {
            aIRequest.setContexts(requestExtras.getContexts());
        }
        if (requestExtras.hasEntities()) {
            aIRequest.setEntities(requestExtras.getEntities());
        }
        if (requestExtras.getLocation() != null) {
            aIRequest.setLocation(requestExtras.getLocation());
        }
    }

    private String getSessionId(AIServiceContext aIServiceContext) {
        if (aIServiceContext != null) {
            return aIServiceContext.getSessionId();
        }
        return this.defaultServiceContext.getSessionId();
    }

    private String getTimeZone(AIServiceContext aIServiceContext) {
        TimeZone timeZone;
        if (aIServiceContext != null) {
            timeZone = aIServiceContext.getTimeZone();
        } else {
            timeZone = this.defaultServiceContext.getTimeZone();
        }
        if (timeZone == null) {
            timeZone = Calendar.getInstance().getTimeZone();
        }
        return timeZone.getID();
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class ApiActiveContextNamesResponse extends AIResponse {
        private static final long serialVersionUID = 1;
        public List<String> names;

        private ApiActiveContextNamesResponse() {
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class BadResponseStatusException extends Exception {
        private static final long serialVersionUID = 1;
        private final AIResponse response;

        public BadResponseStatusException(AIResponse aIResponse) {
            this.response = aIResponse;
        }
    }
}
