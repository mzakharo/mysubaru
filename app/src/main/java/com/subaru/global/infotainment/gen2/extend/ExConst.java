package com.subaru.global.infotainment.gen2.extend;

import android.text.TextUtils;

/* loaded from: classes.dex */
public class ExConst {

    /* loaded from: classes.dex */
    public enum ReturnCode {
        m001i("M001I", 200),
        m001w("M001W", 400),
        m002w("M002W", 400),
        m001e("M001E", 500);

        final String mMessage;
        final int mStatusCode;

        ReturnCode(String str, int i) {
            this.mMessage = str;
            this.mStatusCode = i;
        }

        public static ReturnCode get(String str) {
            for (ReturnCode returnCode : values()) {
                if (TextUtils.equals(returnCode.mMessage, str)) {
                    return returnCode;
                }
            }
            return m001e;
        }

        public String getMessage() {
            return this.mMessage;
        }

        public int getStatusCode() {
            return this.mStatusCode;
        }
    }
}
