package jp.chef_station.chef_station.server.bean.responce;

/* loaded from: classes.dex */
public abstract class AbstractResponseBean {
    public static final int DATE_LENGTH = 8;
    public static final int DATE_TIME_LENGTH = 14;
    public static final int ERROR_CONNECT_FAILED = 1024;
    private static final String ERROR_CONNECT_FAILED_TEXT = "connection error";
    public static final int ERROR_MASK = 1023;
    public static final int ERROR_OTHERS = 8192;
    private static final String ERROR_OTHERS_TEXT = "inner error";
    public static final int ERROR_PARSE_FAILED = 4096;
    private static final String ERROR_PARSE_FAILED_TEXT = "XML parse failed";
    public static final int ERROR_SERVER_RESPONSE = 2048;
    private static final String ERROR_SERVER_RESPONSE_TEXT = "server response was NOT HTTP_OK(200)";
    public static final int NONE_RES_ID = -1;
    public static final int OK = 0;
    private static final String OK_TEXT = "No error";
    public static final int STATUS_ERROR_APP_NOT_ENTRY = 36;
    public static final int STATUS_ERROR_APP_SETTLED = 37;
    public static final int STATUS_ERROR_AUTH_DEVICE = 23;
    public static final int STATUS_ERROR_AUTH_USER = 22;
    public static final int STATUS_ERROR_CREDITCARD_NOT_ENTRY = 81;
    public static final int STATUS_ERROR_FAIL_ENTRY_CREDITCARD = 83;
    public static final int STATUS_ERROR_FAIL_MAIL_ADDRESS = 40;
    public static final int STATUS_ERROR_FAIL_N_DAYS = 39;
    public static final int STATUS_ERROR_FAIL_SETTLEMENT_ERROR = 89;
    public static final int STATUS_ERROR_FAIL_SETTLEMENT_TIMEOUT = 98;
    public static final int STATUS_ERROR_GET_APP_INFO = 33;
    public static final int STATUS_ERROR_GET_CAMPAIGN_INFO = 34;
    public static final int STATUS_ERROR_GET_CATEGORY = 32;
    public static final int STATUS_ERROR_GET_NEWS = 31;
    public static final int STATUS_ERROR_GET_PURCHASE = 35;
    public static final int STATUS_ERROR_INVALID_CREDITCARD = 82;
    public static final int STATUS_ERROR_INVALID_DEVICE_ID = 12;
    public static final int STATUS_ERROR_INVALID_DEVICE_TYPE = 13;
    public static final int STATUS_ERROR_INVALID_PARAM = 11;
    public static final int STATUS_ERROR_LOGIN = 21;
    public static final int STATUS_ERROR_NO_CAMPAIGN_RIGHT = 38;
    public static final int STATUS_ERROR_SYSTEM = 99;
    public static final int STATUS_OK = 0;
    private static final String UNKNOWN_TEXT = "UNKNOWN error";
    private String status = Integer.toString(0);
    protected String device_id = "";
    protected String device_date = "";
    protected String portal_date = "";
    protected String client_ver = "";
    protected int error = 200;

    public String getDeviceId() {
        return this.device_id;
    }

    public void setDeviceId(String str) {
        this.device_id = str;
    }

    public String getPortalDate() {
        return this.portal_date;
    }

    public void setPortalDate(String str) {
        this.portal_date = str;
    }

    public String getClientVer() {
        return this.client_ver;
    }

    public void setClientVer(String str) {
        this.client_ver = str;
    }

    public String getDeviceDate() {
        return this.device_date;
    }

    public void setDeviceDate(String str) {
        this.device_date = str;
    }

    public int getStatus() {
        String str = this.status;
        if (str != null) {
            return Integer.parseInt(str);
        }
        return 8192;
    }

    public void setStatus(int i) {
        this.status = Integer.toString(i);
    }

    public int getErrorUnmasked() {
        return this.error;
    }

    public int getError() {
        return this.error & (-1024);
    }

    public void setError(int i) {
        this.error = i;
    }

    public int getServerStatus() {
        return this.error & ERROR_MASK;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public String getErrorForLog() {
        int i = this.error & (-1024);
        return i != 0 ? i != 1024 ? i != 2048 ? i != 4096 ? i != 8192 ? UNKNOWN_TEXT : ERROR_OTHERS_TEXT : ERROR_PARSE_FAILED_TEXT : ERROR_SERVER_RESPONSE_TEXT : ERROR_CONNECT_FAILED_TEXT : OK_TEXT;
    }

    protected StringBuilder getParamsBuffer() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append('\n');
        sb.append("| device_id=");
        sb.append(this.device_id);
        sb.append('\n');
        sb.append("| device_date=");
        sb.append(this.device_date);
        sb.append('\n');
        sb.append("| portal_date=");
        sb.append(this.portal_date);
        sb.append('\n');
        sb.append("| client_ver=");
        sb.append(this.client_ver);
        sb.append('\n');
        sb.append("| error=");
        sb.append(getErrorForLog());
        sb.append('\n');
        sb.append("| http_response=");
        sb.append(this.error & ERROR_MASK);
        sb.append('\n');
        return sb;
    }

    public String toString() {
        return getParamsBuffer().toString();
    }

    public boolean isValid() {
        return this.device_id.length() != 0 && this.device_date.length() == 14 && this.portal_date.length() == 14 && this.client_ver.length() != 0;
    }
}
