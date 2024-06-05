package com.android.lib.mcm.send_location;

import android.content.Context;
import android.content.Intent;
/* loaded from: classes.dex */
public class SendLocationServiceUtil {
    public static void create(Context context) {
        Context applicationContext = context.getApplicationContext();
        applicationContext.startService(new Intent(applicationContext, SendLocationService.class));
    }

    public static void destroy(Context context) {
        Context applicationContext = context.getApplicationContext();
        applicationContext.stopService(new Intent(applicationContext, SendLocationService.class));
    }
}
