package com.android.lib.mcm;

import com.clarion.android.appmgr.stub.Stub;
/* loaded from: classes.dex */
public class ApplicationDelegateManager {
    private static Stub.ICheckSystemSettingsDelegate sCheckSystemSettingsDelegate;

    public static void setCheckSystemSettingsDelegate(Stub.ICheckSystemSettingsDelegate iCheckSystemSettingsDelegate) {
        sCheckSystemSettingsDelegate = iCheckSystemSettingsDelegate;
    }

    public static Stub.ICheckSystemSettingsDelegate getCheckSystemSettingsDelegate() {
        return sCheckSystemSettingsDelegate;
    }
}
