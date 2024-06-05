package com.subaru.global.infotainment.gen2.mirroring;

import ai.api.util.ParametersConverter;
import android.util.Log;
import com.subaru.global.infotainment.gen2.util.SecurePreferences;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/* loaded from: classes.dex */
class MirroringStatus {
    static final String LOGTAG = "MirroringStatus";
    private final SecurePreferences mPreferences;
    private String mToken = null;
    private Date mStartDate = null;
    private String mLastSuccessfulToken = null;
    private Date mLastSuccessfulStartDate = null;
    private String mErrMessage = null;

    /* JADX INFO: Access modifiers changed from: package-private */
    public static MirroringStatus load(SecurePreferences securePreferences) {
        MirroringStatus mirroringStatus = new MirroringStatus(securePreferences);
        try {
            mirroringStatus.mLastSuccessfulToken = securePreferences.getString("last-successful-token");
            String string = securePreferences.getString("last-successful-date");
            if (string != null) {
                mirroringStatus.mLastSuccessfulStartDate = new Date(Long.parseLong(string));
            }
        } catch (Exception e) {
            Log.w(LOGTAG, e);
            mirroringStatus.mLastSuccessfulToken = null;
            mirroringStatus.mLastSuccessfulStartDate = null;
        }
        return mirroringStatus;
    }

    private MirroringStatus(SecurePreferences securePreferences) {
        this.mPreferences = securePreferences;
    }

    void save() {
        if (this.mLastSuccessfulStartDate != null) {
            this.mPreferences.put("last-successful-token", this.mLastSuccessfulToken);
            this.mPreferences.put("last-successful-date", Long.toString(this.mLastSuccessfulStartDate.getTime()));
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean isMirroring() {
        return this.mToken != null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void onStart(String str) {
        this.mToken = str;
        this.mStartDate = new Date();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void onSucceed() {
        this.mLastSuccessfulToken = this.mToken;
        this.mLastSuccessfulStartDate = this.mStartDate;
        this.mToken = null;
        this.mStartDate = null;
        this.mErrMessage = null;
        save();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void onCancel() {
        this.mToken = null;
        this.mStartDate = null;
        this.mErrMessage = "Cancelled";
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void onError(String str) {
        this.mToken = null;
        this.mStartDate = null;
        this.mErrMessage = str;
    }

    Date getStartDate() {
        return this.mStartDate;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getStartDateAsString() {
        if (this.mStartDate == null) {
            return null;
        }
        return new SimpleDateFormat(ParametersConverter.PROTOCOL_DATE_TIME_FORMAT, Locale.US).format(this.mStartDate);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public Date getLastSuccessfulStartDate() {
        return this.mLastSuccessfulStartDate;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getLastSuccessfulStartDateAsString() {
        if (this.mLastSuccessfulStartDate == null) {
            return null;
        }
        return new SimpleDateFormat(ParametersConverter.PROTOCOL_DATE_TIME_FORMAT, Locale.US).format(this.mLastSuccessfulStartDate);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getToken() {
        return this.mToken;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getLastSuccessfulToken() {
        return this.mLastSuccessfulToken;
    }
}
