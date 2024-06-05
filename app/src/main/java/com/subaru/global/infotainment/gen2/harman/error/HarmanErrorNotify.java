package com.subaru.global.infotainment.gen2.harman.error;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import com.android.lib.mcm.application.ApplicationLifecycleHandler;
import com.android.lib.mcm.application.MCApplication;
import com.subaru.global.infotainment.gen2.MainActivity;
import com.subaru.global.infotainment.gen2.StarLinkApplication;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAAccessor;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import com.subaru.global.infotainment.gen2.util.UserNotification;
import org.slf4j.Marker;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class HarmanErrorNotify {
    /* JADX INFO: Access modifiers changed from: package-private */
    public void divideNotify(HarmanOriginalError harmanOriginalError, HarmanAPI harmanAPI) {
        HarmanOTAUtil.logDebug("divideNotify()");
        if (harmanOriginalError.getResLongId() == -1) {
            return;
        }
        boolean isAppFg = ApplicationLifecycleHandler.initialize(StarLinkApplication.getInstance()).isAppFg();
        if (HarmanOriginalError.DOWNLOAD_COMPLETED.equals(harmanOriginalError) && HarmanOTAAccessor.isAccessoryConnectFlag()) {
            HarmanOTAUtil.logDebug("divideNotify -> return");
            return;
        }
        if (HarmanOriginalError.TRANSFER_COMPLETED.equals(harmanOriginalError)) {
            isAppFg = false;
        }
        if ((HarmanEnum.Error.MAP_SUBSCRIPTION_EXPIRED.equalOriginalErrorCode(harmanOriginalError.getOriginalErrorCode()) || HarmanOriginalError.MAP_SUBSCRIPTION_EXPIRED.equals(harmanOriginalError) || HarmanOriginalError.DOWNLOAD_FAIL_SUBSCRIPTION_INVALID.equals(harmanOriginalError) || HarmanOriginalError.MAP_SUBSCRIPTION_DETAILS.equals(harmanOriginalError) || HarmanOriginalError.DOWNLOAD_FAIL_NETWORK_ERROR.equals(harmanOriginalError)) && HarmanOTAKVSUtil.isMapSubscriptionAlertShown()) {
            return;
        }
        MCApplication starLinkApplication = StarLinkApplication.getInstance();
        if (isAppFg) {
            setAlertDialog(starLinkApplication.getApplicationContext(), harmanOriginalError, harmanAPI);
        } else {
            setNotification(starLinkApplication.getApplicationContext(), harmanOriginalError, harmanAPI);
        }
    }

    private void setAlertDialog(Context context, HarmanOriginalError harmanOriginalError, HarmanAPI harmanAPI) {
        HarmanOTAUtil.logDebug("setAlertDialog()");
        Intent intent = new Intent();
        intent.setClassName(context.getPackageName(), HarmanOTAAlertDialogActivity.class.getName());
        intent.setFlags(268435456);
        intent.putExtra(HarmanOTAConst.INTENT_KEY, harmanOriginalError.name());
        intent.putExtra("errorCode", harmanAPI.name());
        context.startActivity(intent);
    }

    public void dismissAlert() {
        MCApplication.getInstance().sendBroadcast(new Intent(HarmanOTAAlertDialogActivity.BROADCAST_ACTION_DISSMISS_ALERT));
    }

    private void setNotification(Context context, HarmanOriginalError harmanOriginalError, HarmanAPI harmanAPI) {
        HarmanOTAUtil.logDebug("setNotification()");
        Intent intent = new Intent(context, (Class<?>) MainActivity.class);
        intent.addFlags(67108864);
        intent.addCategory("android.intent.category.LAUNCHER");
        intent.setClassName(context.getPackageName(), MainActivity.class.getName());
        intent.setFlags(270532608);
        intent.putExtra(HarmanOTAConst.INTENT_KEY, harmanOriginalError.name());
        intent.putExtra("errorCode", harmanAPI.name());
        ((NotificationManager) context.getSystemService("notification")).notify(Integer.valueOf(harmanOriginalError.getOriginalErrorNum(harmanAPI)).intValue(), new UserNotification().createNotification(context, PendingIntent.getActivity(context, 0, intent, 134217728), "Mobile OTA", "Mobile OTA", StarLinkApplication.getInstance().getString(harmanOriginalError.getResShortId()).replace(Marker.ANY_MARKER, harmanOriginalError.getMessageExtendPrefix()), 4));
    }
}
