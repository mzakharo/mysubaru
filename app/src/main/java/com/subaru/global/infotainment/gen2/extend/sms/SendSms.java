package com.subaru.global.infotainment.gen2.extend.sms;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.sms.SmsService;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

/* loaded from: classes.dex */
public class SendSms {
    private Context context;
    private String message;
    private MSHTTPResponder responder;
    private SmsService smsService;
    private String to;
    public final String TAG = "SendSms";
    private boolean resultReceiverCreatedFlg = false;
    private final int PHONENUMBER_LENGTH_MIN = 11;
    private final int PHONENUMBER_LENGTH_MAX = 11;
    private final int MESSAGE_LENGTH_MIN = 0;
    private final int MESSAGE_LENGTH_MAX = 70;
    private ServiceConnection serviceConnection = new ServiceConnection() { // from class: com.subaru.global.infotainment.gen2.extend.sms.SendSms.1
        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            Log.d("SendSms", "onServiceConnected() start");
            SendSms.this.smsService = ((SmsService.SmsServiceBinder) iBinder).getService();
            SendSms.this.smsService.setResponder(SendSms.this.responder);
            SendSms.this.smsService.setSendMessage(SendSms.this.to, SendSms.this.message);
            SendSms.this.smsService.runSmsSentResultReceiver();
            SendSms.this.smsService.sendSms();
            Log.d("SendSms", "onServiceConnected() end");
        }

        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
            SendSms.this.smsService = null;
        }
    };

    public SendSms(Context context) {
        this.context = context;
    }

    public SendSms(Context context, MSHTTPResponder mSHTTPResponder) {
        this.context = context;
        this.responder = mSHTTPResponder;
        context.startService(new Intent(context, (Class<?>) SmsService.class));
    }

    /* JADX WARN: Removed duplicated region for block: B:12:0x00dc  */
    /* JADX WARN: Removed duplicated region for block: B:13:0x006e  */
    /* JADX WARN: Removed duplicated region for block: B:6:0x0056  */
    /* JADX WARN: Removed duplicated region for block: B:8:0x0098  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public com.subaru.global.infotainment.gen2.extend.sms.json.Res send(java.lang.String r9, java.lang.String r10) {
        /*
            r8 = this;
            java.lang.String r0 = "SendSms"
            java.lang.String r1 = "send() start"
            android.util.Log.d(r0, r1)
            com.subaru.global.infotainment.gen2.extend.sms.json.Res r1 = new com.subaru.global.infotainment.gen2.extend.sms.json.Res
            r1.<init>()
            java.lang.String r2 = " )"
            r3 = 0
            r4 = 1
            if (r9 != 0) goto L2b
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            java.lang.String r6 = "got PhoneNumber is null( "
            r5.append(r6)
            r5.append(r9)
            r5.append(r2)
            java.lang.String r5 = r5.toString()
            android.util.Log.d(r0, r5)
        L29:
            r5 = 0
            goto L54
        L2b:
            int r5 = r9.length()
            r6 = 11
            if (r5 < r6) goto L3c
            int r5 = r9.length()
            if (r5 <= r6) goto L3a
            goto L3c
        L3a:
            r5 = 1
            goto L54
        L3c:
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            java.lang.String r6 = "got PhoneNumber is wrong length( "
            r5.append(r6)
            r5.append(r9)
            r5.append(r2)
            java.lang.String r5 = r5.toString()
            android.util.Log.d(r0, r5)
            goto L29
        L54:
            if (r10 != 0) goto L6e
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            java.lang.String r6 = "got Message is null( "
            r5.append(r6)
            r5.append(r10)
            r5.append(r2)
            java.lang.String r2 = r5.toString()
            android.util.Log.d(r0, r2)
            goto L96
        L6e:
            int r6 = r10.length()
            if (r6 < 0) goto L7f
            int r6 = r10.length()
            r7 = 70
            if (r6 <= r7) goto L7d
            goto L7f
        L7d:
            r3 = r5
            goto L96
        L7f:
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            java.lang.String r6 = "got Message is wrong length( "
            r5.append(r6)
            r5.append(r10)
            r5.append(r2)
            java.lang.String r2 = r5.toString()
            android.util.Log.d(r0, r2)
        L96:
            if (r3 != r4) goto Ldc
            r8.to = r9
            r8.message = r10
            android.content.Context r2 = r8.context
            android.content.Intent r3 = new android.content.Intent
            android.content.Context r5 = r8.context
            java.lang.Class<com.subaru.global.infotainment.gen2.extend.sms.SmsService> r6 = com.subaru.global.infotainment.gen2.extend.sms.SmsService.class
            r3.<init>(r5, r6)
            android.content.ServiceConnection r5 = r8.serviceConnection
            r2.bindService(r3, r5, r4)
            r8.resultReceiverCreatedFlg = r4
            java.lang.String r2 = "M001I"
            r1.setReturnCd(r2)
            java.lang.StringBuilder r2 = new java.lang.StringBuilder
            r2.<init>()
            java.lang.String r3 = "SentTo: "
            r2.append(r3)
            r2.append(r9)
            java.lang.String r9 = r2.toString()
            android.util.Log.d(r0, r9)
            java.lang.StringBuilder r9 = new java.lang.StringBuilder
            r9.<init>()
            java.lang.String r2 = "Massage: "
            r9.append(r2)
            r9.append(r10)
            java.lang.String r9 = r9.toString()
            android.util.Log.d(r0, r9)
            goto Le1
        Ldc:
            java.lang.String r9 = "M001W"
            r1.setReturnCd(r9)
        Le1:
            java.lang.String r9 = "send() end"
            android.util.Log.d(r0, r9)
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.extend.sms.SendSms.send(java.lang.String, java.lang.String):com.subaru.global.infotainment.gen2.extend.sms.json.Res");
    }

    public boolean isResultReceiverCreated() {
        return this.resultReceiverCreatedFlg;
    }
}
