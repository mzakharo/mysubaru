package com.subaru.global.infotainment.gen2.util;

import android.R;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Build;
import androidx.core.app.NotificationCompat;

/* loaded from: classes.dex */
public class UserNotification {
    public Notification createNotification(Context context, PendingIntent pendingIntent, String str, String str2, String str3, int i) {
        Notification.Builder contentIntent;
        String str4 = context.getPackageName() + str;
        if (Build.VERSION.SDK_INT >= 26) {
            contentIntent = new Notification.Builder(context, str4).setContentTitle(str2).setContentText(str3).setSmallIcon(R.drawable.ic_dialog_info).setContentIntent(pendingIntent).setCategory(NotificationCompat.CATEGORY_SERVICE);
            NotificationChannel notificationChannel = new NotificationChannel(str4, str, i);
            notificationChannel.setDescription(str3);
            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(-1);
            notificationChannel.enableVibration(true);
            if (i == 4) {
                notificationChannel.setLockscreenVisibility(1);
                notificationChannel.setVibrationPattern(new long[]{6000, 100});
                contentIntent.setAutoCancel(true);
            } else {
                notificationChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
            }
            ((NotificationManager) context.getSystemService("notification")).createNotificationChannel(notificationChannel);
        } else {
            contentIntent = new Notification.Builder(context).setContentTitle(str2).setContentText(str3).setSmallIcon(R.drawable.ic_dialog_info).setContentIntent(pendingIntent);
            if (Build.VERSION.SDK_INT >= 21) {
                contentIntent.setCategory(NotificationCompat.CATEGORY_SERVICE);
            }
            if (i == 4) {
                contentIntent.setAutoCancel(true);
                contentIntent.setVibrate(new long[]{6000, 100});
                if (Build.VERSION.SDK_INT >= 16) {
                    contentIntent.setPriority(2);
                }
            } else {
                contentIntent.setVibrate(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
            }
        }
        if (Build.VERSION.SDK_INT >= 16) {
            return contentIntent.build();
        }
        return contentIntent.getNotification();
    }
}
