package com.subaru.global.infotainment.gen2.harman.enumerate;

import android.text.TextUtils;
import androidx.core.view.PointerIconCompat;
//import com.google.android.gms.location.GeofenceStatusCodes;

/* loaded from: classes.dex */
public class HarmanEnum {

    /* loaded from: classes.dex */
    public enum NetworkConnectivityMode {
        Undefined(0),
        ReachableViaWiFi(1),
        ReachableViaCellular(2);

        private int code;

        NetworkConnectivityMode(int i) {
            this.code = i;
        }

        public int getCode() {
            return this.code;
        }
    }

    /* loaded from: classes.dex */
    public enum DownloadChannel {
        NONE(0),
        DOWNLOAD_OVER_WIFI(1),
        DOWNLOAD_OVER_CELLULAR(2);

        private int code;

        DownloadChannel(int i) {
            this.code = i;
        }

        public int getCode() {
            return this.code;
        }
    }

    /* loaded from: classes.dex */
    public enum DownloadStatus {
        DOWNLOAD_STATE_INVALID(0, "20100"),
        DOWNLOAD_INITIATED(1, "00101"),
        DOWNLOAD_IN_PROGRESS(2, "00102"),
        DOWNLOAD_COMPLETED(3, "00103"),
        DOWNLOAD_ERROR_GENERIC(4, "20104"),
        DOWNLOAD_CANCELED(5, "20105"),
        DOWLOAD_INVALID_REQUEST_DATA(6, "20106"),
        DOWLOAD_SPACE_NOT_AVAILABLE(7, "20107"),
        DOWLOAD_INCOMPLETE_DOWNLOAD(8, "20108"),
        DOWLOAD_NOT_DOWNLOADED(9, "20109"),
        DOWLOAD_ERROR_OVER_THRESHOLD_SIZE_ON_CELLULAR(10, "20110"),
        DOWNLOAD_FAIL_SUBSCRIPTION_INVALID(11, "20111"),
        DOWNLOAD_FAIL_NETWORK_ERROR(12, "20112"),
        DOWNLOAD_FAIL_DB_ERROR(13, "20113"),
        DOWNLOAD_FAIL_INTERNAL_ERROR(14, "20114"),
        DOWLOAD_E_LICENSE_FILE_CREATION_FAILED(15, "20115"),
        DOWLOAD_INCORRECT_DOWNLOAD_CHANNEL(16, "20116");

        String originalErrorCode;
        int statusCode;

        DownloadStatus(int i, String str) {
            this.statusCode = i;
            this.originalErrorCode = str;
        }

        public int getStatusCode() {
            return this.statusCode;
        }

        public boolean equalNum(int i) {
            return this.statusCode == i;
        }

        public static HarmanOriginalError getOriginalError(int i) {
            for (DownloadStatus downloadStatus : values()) {
                if (i == downloadStatus.getStatusCode()) {
                    return HarmanOriginalError.getHarmanOriginalError(downloadStatus.originalErrorCode);
                }
            }
            return HarmanOriginalError.OTHERS_ERROR;
        }
    }

    /* loaded from: classes.dex */
    public enum AccessoryTransferStatus {
        TRANSFER_STATE_INVALID(0, "20200"),
        TRANSFER_INITIATED(1, "00201"),
        TRANSFER_IN_PROGRESS(2, "00202"),
        TRANSFER_COMPLETED(3, "00203"),
        TRANSFER_FAILED_DUE_TO_DISCONNECTION(4, "20204"),
        TRANSFER_GENERIC_FAILURE(5, "20205"),
        TRANSFER_FAILED_INSUFFICIENT_SPACE(6, "20206"),
        TRANSFER_FAILED_INVALID_MAP_FILE(7, "20207");

        String originalErrorCode;
        int statusCode;

        AccessoryTransferStatus(int i, String str) {
            this.statusCode = i;
            this.originalErrorCode = str;
        }

        public int getStatusCode() {
            return this.statusCode;
        }

        public boolean equalNum(int i) {
            return this.statusCode == i;
        }

        public static HarmanOriginalError getOriginalError(int i) {
            for (AccessoryTransferStatus accessoryTransferStatus : values()) {
                if (i == accessoryTransferStatus.getStatusCode()) {
                    return HarmanOriginalError.getHarmanOriginalError(accessoryTransferStatus.originalErrorCode);
                }
            }
            return HarmanOriginalError.OTHERS_ERROR;
        }
    }

    /* loaded from: classes.dex */
    public enum Error {
        SUCCESS(0, "00000"),
        GENERIC_ERROR(1000, "20001"),
        LOW_DISK_SPACE(1001, "20002"),
        NETWORK_FAILURE(1002, "20003"),
        INCORRECT_DOWNLOAD_CHANNEL(1003, "20004"),
        FILE_NOT_FOUND(1004, "20005"),
        MAP_SUBSCRIPTION_EXPIRED(1005, "20006"),
        INVALID_REGION(PointerIconCompat.TYPE_CELL, "20007"),
        INVALID_PRODUCT_CODE(1007, "20008"),
        INVALID_DEVICE_CODE(PointerIconCompat.TYPE_TEXT, "20009"),
        MAP_SERVICE_DISABLED(PointerIconCompat.TYPE_VERTICAL_TEXT, "20010");

        int errorCode;
        String originalErrorCode;

        Error(int i, String str) {
            this.errorCode = i;
            this.originalErrorCode = str;
        }

        public int getErrorCode() {
            return this.errorCode;
        }

        public static HarmanOriginalError getOriginalError(int i) {
            for (Error error : values()) {
                if (i == error.getErrorCode()) {
                    return HarmanOriginalError.getHarmanOriginalError(error.originalErrorCode);
                }
            }
            return HarmanOriginalError.OTHERS_ERROR;
        }

        public boolean equalOriginalErrorCode(String str) {
            return TextUtils.equals(this.originalErrorCode, str);
        }
    }

    /* loaded from: classes.dex */
    public enum RemoveDeviceError {
        SUCCESS(0, "000500"),
        INVALID_PARAMETER(1, "000501"),
        DEVICE_DOES_NOT_EXISTS(2, "000502"),
        NOT_ABLE_TO_DELETE_DEVICE_FILES(3, "00503");

        String originalErrorCode;
        int statusCode;

        RemoveDeviceError(int i, String str) {
            this.statusCode = i;
            this.originalErrorCode = str;
        }
    }

    /* loaded from: classes.dex */
    public enum notifyFileTransferFailureError {
        NOTIFY_FILE_TRANSFER_FAILURE(1, "20901");

        String originalErrorCode;
        int statusCode;

        notifyFileTransferFailureError(int i, String str) {
            this.statusCode = i;
            this.originalErrorCode = str;
        }

        public int getErrorCode() {
            return this.statusCode;
        }

        public static HarmanOriginalError getOriginalError(int i) {
            for (notifyFileTransferFailureError notifyfiletransferfailureerror : values()) {
                if (i == notifyfiletransferfailureerror.getErrorCode()) {
                    return HarmanOriginalError.getHarmanOriginalError(notifyfiletransferfailureerror.originalErrorCode);
                }
            }
            return HarmanOriginalError.OTHERS_ERROR;
        }
    }
}
