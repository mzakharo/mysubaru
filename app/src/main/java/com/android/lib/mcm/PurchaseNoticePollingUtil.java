package com.android.lib.mcm;

import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
/* loaded from: classes.dex */
public class PurchaseNoticePollingUtil {
    private PurchaseNoticePollingUtil() {
    }

    public static void startPolling(Context context) {
        context.getApplicationContext().sendBroadcast(new Intent(PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_POLLING_START));
    }

    public static void stopPolling(Context context) {
        context.getApplicationContext().sendBroadcast(new Intent(PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_POLLING_STOP));
    }

    public static void requestPurchaseNotice(Context context) {
        context.getApplicationContext().sendBroadcast(new Intent(PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_REQUEST));
    }

    public static void create(Context context, ServiceConnection serviceConnection, int i) {
        Context applicationContext = context.getApplicationContext();
        Intent intent = new Intent(applicationContext, PurchaseNoticePollingService.class);
        intent.putExtra(PurchaseNoticePollingService.KEY_MWS_PORT, i);
        applicationContext.bindService(intent, serviceConnection, 1);
    }

    public static void finish(Context context) {
        context.getApplicationContext().sendBroadcast(new Intent(PurchaseNoticePollingService.ACTION_PURCHASE_NOTICE_FINISH));
    }
}
