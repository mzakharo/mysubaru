package com.clarion.android.smartaccess4car.extend.getproxy;

import com.uievolution.microserver.utils.HttpCatalogs;

/* loaded from: classes.dex */
public class Const {
    public static final int CONNECT_AFTER_TIME_OUT = 30000;
    public static final int CONNECT_TIME_OUT = 30000;
    public static final String CVS_SEPARATE_STR = ",";
    public static final int FAILED_DECRIPT_RETRY_CNT = 1;
    public static final String HTTPS = "https";
    public static final int KEY_GET_RETRY_CNT = 0;
    public static final String LF = "\n";
    public static final String REQUEST_KEY_VALUE_SEPARATE_STR = "=";
    public static final String REQUEST_PARAM_SEPARATE_STR = "&";
    public static final String REQUEST_QUERY_FIRST_STR = "?";
    public static final String RESPONSE_HEADER_SEPRARATE_STR = "; ";
    public static final String UTF_8 = "UTF-8";

    Const() {
    }

    /* loaded from: classes.dex */
    public enum RequestMode {
        DEFAULT("DefaultHttpClient"),
        VOLLEY("Volley");

        private String mMode;

        RequestMode(String str) {
            this.mMode = str;
        }
    }

    /* loaded from: classes.dex */
    public enum RequestParamDef {
        SERVICE_PROVIDER_URL("service_provider_url", true, false),
        SERVICE_PROVIDER_HTTP_REQUEST_METHOD("service_provider_http_request_method", true, false),
        SERVICE_PROVIDER_TYPE("service_provider_type", false, false),
        GET_QUERY_PARAM("get_query_param", false, false),
        POST_DATA("post_data", false, false),
        CONTENT_TYPE("content_type", false, false),
        ENCRYPT_PARAM_LIST("encrypt_param_list", false, false),
        ENCRYPT_KEY_VERSION("encrypt_key_version", false, false),
        REFRESH_KEY("refresh", false, false),
        KEY_ID("key_id", true, false),
        TIMEOUT("timeout", false, false),
        SERVICE_PROVIDER_REQUEST_HEADER("service_provider_request_header", false, false);

        private boolean mEncodeSet;
        private String mKey;
        private boolean mRequired;

        RequestParamDef(String str, boolean z, boolean z2) {
            this.mKey = str;
            this.mRequired = z;
            this.mEncodeSet = z2;
        }

        public String getKey() {
            return this.mKey;
        }

        public void setKey(String str) {
            this.mKey = str;
        }

        public boolean isRequired() {
            return this.mRequired;
        }

        public void setRequired(boolean z) {
            this.mRequired = z;
        }

        public boolean isEncodeSet() {
            return this.mEncodeSet;
        }

        public void setEncodeSet(boolean z) {
            this.mEncodeSet = z;
        }
    }

    /* loaded from: classes.dex */
    public enum MessageInfo {
        SUCCESS("M001I", "正常", 200),
        WARN_INVALID_REQUEST_PARAM("M001W", "リクエストパラメータが不正です。", 400),
        ERROR_SYSYTEM("M001E", "予期せぬエラーが発生しました。", 500),
        ERROR_GET_DATA("M002E", "データ取得に失敗しました。", 500),
        ERROR_CONNECT_DATA("M003E", "サービスプロバイダ先との接続に失敗しました。", 500),
        ERROR_CONNECT_TIMEOUT("M004E", "通信タイムアウトが発生しました。", 500),
        ERROR_FAILED_GET_ENCRIPT_KEY("M005E", "暗号鍵の情報取得に失敗しました。", 500),
        ERROR_FAILED_DECRIPT("M006E", "復号処理に失敗しました。", 500),
        ERROR_CONNECT_TIMEOUT_GET_ENCRIPT_KEY("M007E", "暗号鍵の情報取得時タイムアウトが発生しました。", 500);

        private String mId;
        private String mMessage;
        private int mStatusNo;

        MessageInfo(String str, String str2, int i) {
            this.mId = str;
            this.mMessage = str2;
            this.mStatusNo = i;
        }

        public String getId() {
            return this.mId;
        }

        public void setId(String str) {
            this.mId = str;
        }

        public String getMessage() {
            return this.mMessage;
        }

        public void setMessage(String str) {
            this.mMessage = str;
        }

        public int getStatusNo() {
            return this.mStatusNo;
        }

        public void setStatusNo(int i) {
            this.mStatusNo = i;
        }
    }

    /* loaded from: classes.dex */
    public enum TargetServiceMethodType {
        GET("GET", "get"),
        POST(HttpCatalogs.METHOD_POST, "post");

        private String mInfo;
        private String mMethod;

        TargetServiceMethodType(String str, String str2) {
            this.mMethod = str;
            this.mInfo = str2;
        }

        public String getMethod() {
            return this.mMethod;
        }

        public void setMethod(String str) {
            this.mMethod = str;
        }

        public String getInfo() {
            return this.mInfo;
        }

        public void setInfo(String str) {
            this.mInfo = str;
        }
    }
}
