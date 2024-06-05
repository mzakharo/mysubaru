package com.harman.services.maps.tomtom.exceptions;

import com.harman.services.Log;

/* loaded from: classes.dex */
public class UpdateCancelException extends Exception {
    private static final String TAG = "com.harman.services.maps.tomtom.exceptions.UpdateCancelException";

    public UpdateCancelException(String str) {
        super(str);
        Log.e(TAG, "UpdateCancelException message =" + str);
    }
}
