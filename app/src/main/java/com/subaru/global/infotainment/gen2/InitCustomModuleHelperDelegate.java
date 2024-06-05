package com.subaru.global.infotainment.gen2;

import android.content.Context;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import com.android.lib.mcm.InitCustomModuleHelper;
import com.android.lib.mcm.MCResource;
import com.clarion.android.appmgr.stub.Stub;
import com.example.mysubaru.R;
/* loaded from: classes.dex */
public class InitCustomModuleHelperDelegate implements InitCustomModuleHelper.IInitCustomModuleHelperDelegate {
    @Override // com.android.lib.mcm.InitCustomModuleHelper.IInitCustomModuleHelperDelegate
    public Stub.IAppMgrContextDelegate createAppMgrContext() {
        return null;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.IInitCustomModuleHelperDelegate
    public Stub.IAppMgrLogDelegate createAppMgrLog() {
        return null;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.IInitCustomModuleHelperDelegate
    public Stub.IExceptionLoggerDelegate createExceptionLogger() {
        return null;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.IInitCustomModuleHelperDelegate
    public void setupResources() {
        MCResource.string.billing_dialog_msg_retry = R.string.billing_dialog_msg_retry;
        MCResource.string.billing_dialog_msg_process = R.string.billing_dialog_msg_process;
        MCResource.string.billing_dialog_msg_success = R.string.billing_dialog_msg_success;
        MCResource.string.billing_dialog_msg_failure = R.string.billing_dialog_msg_failure;
        MCResource.string.billing_dialog_btn_ok = R.string.billing_dialog_btn_ok;
        MCResource.string.billing_dialog_btn_close = R.string.billing_dialog_btn_close;
        MCResource.string.billing_dialog_btn_retry = R.string.billing_dialog_btn_retry;
        MCResource.file.sendlocation_whitelist = R.raw.sendlocation_whitelist;
        MCResource.layout.googleplaymain = R.layout.googleplaymain;
    }

    @Override // com.android.lib.mcm.InitCustomModuleHelper.IInitCustomModuleHelperDelegate
    public Stub.ICheckSystemSettingsDelegate createCheckSystemSettingsDelegate() {
        return new Stub.ICheckSystemSettingsDelegate() { // from class: com.subaru.global.infotainment.gen2.InitCustomModuleHelperDelegate.1
            @Override // com.clarion.android.appmgr.stub.Stub.ICheckSystemSettingsDelegate
            public boolean isEnabledLocationService(Context context) {
                int i;
                if (Build.VERSION.SDK_INT >= 28) {
                    return ((LocationManager) context.getSystemService("location")).isLocationEnabled();
                }
                if (Build.VERSION.SDK_INT >= 19) {
                    try {
                        i = Settings.Secure.getInt(context.getApplicationContext().getContentResolver(), "location_mode");
                    } catch (Settings.SettingNotFoundException e) {
                        e.printStackTrace();
                        i = 0;
                    }
                    return i != 0;
                }
                return !TextUtils.isEmpty(Settings.Secure.getString(context.getApplicationContext().getContentResolver(), "location_providers_allowed"));
            }
        };
    }
}
