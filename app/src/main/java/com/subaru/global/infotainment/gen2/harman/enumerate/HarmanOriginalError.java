package com.subaru.global.infotainment.gen2.harman.enumerate;

import android.text.TextUtils;

/* loaded from: classes.dex */
public enum HarmanOriginalError {
    GENERIC_SUCCESS("00000", null),
    GENERIC_ERROR("20001", HarmanErrorMessage.TXT_YELP_0029),
    LOW_DISK_SPACE("20002", HarmanErrorMessage.SL_TXT_0207),
    NETWORK_FAILURE("20003", HarmanErrorMessage.SL_TXT_0220),
    INCORRECT_DOWNLOAD_CHANNEL("20004", HarmanErrorMessage.SL_TXT_0219),
    FILE_NOT_FOUND("20005", HarmanErrorMessage.SL_TXT_0217),
    MAP_SUBSCRIPTION_EXPIRED("20006", HarmanErrorMessage.SL_TXT_0209),
    INVALID_REGION("20007", HarmanErrorMessage.SL_TXT_0217),
    INVALID_PRODUCT_CODE("20008", HarmanErrorMessage.SL_TXT_0217),
    INVALID_DEVICE_CODE("20009", HarmanErrorMessage.SL_TXT_0217),
    MAP_SERVICE_DISABLED("20010", HarmanErrorMessage.TXT_YELP_0029),
    DOWNLOAD_STATE_INVALID("20100", HarmanErrorMessage.TXT_YELP_0029),
    DOWNLOAD_INITIATED("00101", null),
    DOWNLOAD_IN_PROGRESS("00102", null),
    DOWNLOAD_COMPLETED("00103", HarmanErrorMessage.SL_TXT_0211),
    DOWNLOAD_ERROR_GENERIC("20104", HarmanErrorMessage.TXT_YELP_0029),
    DOWNLOAD_CANCELED("00105", null),
    DOWLOAD_INVALID_REQUEST_DATA("20106", HarmanErrorMessage.TXT_YELP_0029),
    DOWLOAD_SPACE_NOT_AVAILABLE("20107", HarmanErrorMessage.SL_TXT_0207),
    DOWLOAD_INCOMPLETE_DOWNLOAD("20108", HarmanErrorMessage.SL_TXT_0217),
    DOWLOAD_NOT_DOWNLOADED("20109", HarmanErrorMessage.SL_TXT_0217),
    DOWLOAD_ERROR_OVER_THRESHOLD_SIZE_ON_CELLULAR("20110", HarmanErrorMessage.SL_TXT_0210),
    DOWNLOAD_FAIL_SUBSCRIPTION_INVALID("20111", HarmanErrorMessage.SL_TXT_0209),
    DOWNLOAD_FAIL_NETWORK_ERROR("20112", HarmanErrorMessage.SL_TXT_0217),
    DOWNLOAD_FAIL_DB_ERROR("20113", HarmanErrorMessage.TXT_YELP_0029),
    DOWNLOAD_FAIL_INTERNAL_ERROR("20114", HarmanErrorMessage.TXT_YELP_0029),
    DOWLOAD_E_LICENSE_FILE_CREATION_FAILED("20115", HarmanErrorMessage.TXT_YELP_0029),
    DOWLOAD_INCORRECT_DOWNLOAD_CHANNEL("20116", HarmanErrorMessage.SL_TXT_0219),
    TRANSFER_STATE_INVALID("20200", HarmanErrorMessage.TXT_YELP_0029),
    TRANSFER_INITIATED("00201", null),
    TRANSFER_IN_PROGRESS("00202", null),
    TRANSFER_COMPLETED("00203", HarmanErrorMessage.SL_TXT_0177),
    TRANSFER_FAILED_DUE_TO_DISCONNECTION("20204", HarmanErrorMessage.SL_TXT_0214),
    TRANSFER_GENERIC_FAILURE("20205", HarmanErrorMessage.TXT_YELP_0029),
    TRANSFER_FAILED_INSUFFICIENT_SPACE("20206", HarmanErrorMessage.SL_TXT_0215),
    TRANSFER_FAILED_INVALID_MAP_FILE("20207", HarmanErrorMessage.SL_TXT_0216),
    TRANSFER_IN_PROGRESS_MAX("00208", HarmanErrorMessage.SL_TXT_CUSTOM_TRANSFER_IN_PROGRESS_MAX),
    TRANSFER_TIMEOUT_ERROR("00299", HarmanErrorMessage.SL_TXT_CUSTOM_TRANSFER_TIMEOUT),
    CANCEL_SUCCESS("00300", HarmanErrorMessage.TXT_YELP_0029),
    CANCEL_INVALID_REGION("20301", null),
    CANCEL_UNKNOWN_ERROR("20302", null),
    CANCEL_ALREADY_DOWNLOADED("20303", null),
    CANCEL_DOWNLOAD_DOES_NOT_EXISTS_IN_QUEUE("20304", null),
    DELETE_SUCCESS("00400", null),
    DELETE_INVALID_PARAMETER("20401", null),
    DELETE_REGION_ALREADY_DELETE("20402", null),
    DELETE_UNKNOWN_ERROR("20403", null),
    DELETE_COULD_NOT_DELETE_DATA("20404", null),
    DELETE_ALREADY_DOWNLOADED("20405", null),
    DELETE_DOWNLOAD_IN_PROGRESS("20406", null),
    REMOVE_SUCCESS("00500", HarmanErrorMessage.TXT_YELP_0029),
    REMOVE_INVALID_PARAMETER("20501", HarmanErrorMessage.TXT_YELP_0029),
    REMOVE_DEVICE_DOES_NOT_EXISTS("20502", HarmanErrorMessage.TXT_YELP_0029),
    REMOVE_NOT_ABLE_TO_DELETE_DEVICE_FILES("20503", HarmanErrorMessage.TXT_YELP_0029),
    MAP_SUBSCRIPTION_DETAILS("20600", HarmanErrorMessage.SL_TXT_0209),
    NOTIFY_FILE_TRANSFER_FAILURE("20901", HarmanErrorMessage.SL_TXT_CUSTOM_TRANSFER_FAILURE),
    OTHERS_ERROR("29999", HarmanErrorMessage.TXT_YELP_0029);

    HarmanErrorMessage harmanErrorMessage;
    String mMessageExtendPrefix = "";
    String originalErrorCode;

    HarmanOriginalError(String str, HarmanErrorMessage harmanErrorMessage) {
        this.originalErrorCode = str;
        this.harmanErrorMessage = harmanErrorMessage;
    }

    public static HarmanOriginalError getHarmanOriginalError(String str) {
        for (HarmanOriginalError harmanOriginalError : values()) {
            if (harmanOriginalError.isOriginalErrorCode(str)) {
                return harmanOriginalError;
            }
        }
        return null;
    }

    private boolean isOriginalErrorCode(String str) {
        return TextUtils.equals(this.originalErrorCode, str);
    }

    public int getResLongId() {
        HarmanErrorMessage harmanErrorMessage = this.harmanErrorMessage;
        if (harmanErrorMessage == null) {
            return -1;
        }
        return harmanErrorMessage.getResLongId();
    }

    public int getResShortId() {
        HarmanErrorMessage harmanErrorMessage = this.harmanErrorMessage;
        if (harmanErrorMessage == null) {
            return -1;
        }
        return harmanErrorMessage.getResShortId();
    }

    public String getOriginalErrorCode() {
        return this.originalErrorCode;
    }

    public String getOriginalErrorNum(HarmanAPI harmanAPI) {
        return "00" + harmanAPI.getApiCode() + this.originalErrorCode;
    }

    public String getMessageExtendPrefix() {
        return this.mMessageExtendPrefix;
    }

    public void setMessageExtendPrefix(String str) {
        this.mMessageExtendPrefix = str;
    }
}
