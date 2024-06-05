package ai.api.model;

import com.google.gson.annotations.SerializedName;
import com.uievolution.microserver.http.HttpStatus;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class Status implements Serializable {
    private static final Map<Integer, String> errorDescriptions = new HashMap();
    private static final Map<Integer, String> errorTypes = new HashMap();
    private static final long serialVersionUID = 1;

    @SerializedName("code")
    private Integer code;

    @SerializedName("errorDetails")
    private String errorDetails;

    @SerializedName("errorID")
    private String errorID;

    @SerializedName("errorType")
    private String errorType;

    public Status() {
        Map<Integer, String> map = errorDescriptions;
        map.put(400, "Some required parameter is missing or has wrong value. Details will be in the errorDetails field.");
        Map<Integer, String> map2 = errorTypes;
        map2.put(400, "bad_request");
        Integer valueOf = Integer.valueOf(HttpStatus.SC_UNAUTHORIZED);
        map.put(valueOf, "Authorization failed. Please check your access keys.");
        map2.put(valueOf, "unauthorized");
        Integer valueOf2 = Integer.valueOf(HttpStatus.SC_NOT_FOUND);
        map.put(valueOf2, "Uri is not found or some resource with provided id is not found.");
        map2.put(valueOf2, "not_found");
        Integer valueOf3 = Integer.valueOf(HttpStatus.SC_METHOD_NOT_ALLOWED);
        map.put(valueOf3, "Attempting to use POST with a GET-only endpoint, or vice-versa.");
        map2.put(valueOf3, "not_allowed");
        Integer valueOf4 = Integer.valueOf(HttpStatus.SC_NOT_ACCEPTABLE);
        map.put(valueOf4, "Uploaded files have some problems with it.");
        map2.put(valueOf4, "not_acceptable");
        Integer valueOf5 = Integer.valueOf(HttpStatus.SC_CONFLICT);
        map.put(valueOf5, "The request could not be completed due to a conflict with the current state of the resource. This code is only allowed in situations where it is expected that the user might be able to resolve the conflict and resubmit the request.");
        map2.put(valueOf5, "conflict");
    }

    public static Status fromResponseCode(int i) {
        Status status = new Status();
        status.setCode(Integer.valueOf(i));
        Map<Integer, String> map = errorTypes;
        if (map.containsKey(Integer.valueOf(i))) {
            status.setErrorType(map.get(Integer.valueOf(i)));
        }
        Map<Integer, String> map2 = errorDescriptions;
        if (map2.containsKey(Integer.valueOf(i))) {
            status.setErrorDetails(map2.get(Integer.valueOf(i)));
        }
        return status;
    }

    public Integer getCode() {
        return this.code;
    }

    public void setCode(Integer num) {
        this.code = num;
    }

    public String getErrorType() {
        return this.errorType;
    }

    public void setErrorType(String str) {
        this.errorType = str;
    }

    public String getErrorDetails() {
        Integer num = this.code;
        if (num != null) {
            Map<Integer, String> map = errorDescriptions;
            if (map.containsKey(num)) {
                return map.get(this.code);
            }
        }
        return this.errorDetails;
    }

    public void setErrorDetails(String str) {
        this.errorDetails = str;
    }

    public String getErrorID() {
        return this.errorID;
    }

    public void setErrorID(String str) {
        this.errorID = str;
    }

    public String toString() {
        return String.format("Status{code=%d, errorType='%s', errorDetails='%s'}", this.code, this.errorType, this.errorDetails);
    }
}
