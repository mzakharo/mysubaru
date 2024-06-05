package com.subaru.global.infotainment.gen2.extend.sms;

import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Binder;
import android.os.IBinder;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.sms.json.Res;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

/* loaded from: classes.dex */
public class SmsService extends Service {
    private String message;
    private MSHTTPResponder responder;
    private SmsSentResultReceiver sentResultReceiver;
    private SmsReceiver smsReceiver;
    private String to;
    public final String TAG = "SmsService";
    private final IBinder smsServiceBinder = new SmsServiceBinder();
    private boolean existSmsReceiver = false;
    private boolean existSmsSentResultReceiver = false;

    @Override // android.app.Service
    public void onCreate() {
    }

    /* loaded from: classes.dex */
    public class SmsServiceBinder extends Binder {
        public SmsServiceBinder() {
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public SmsService getService() {
            return SmsService.this;
        }
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return this.smsServiceBinder;
    }

    public void setResponder(MSHTTPResponder mSHTTPResponder) {
        this.responder = mSHTTPResponder;
    }

    public void setSendMessage(String str, String str2) {
        this.to = str;
        this.message = str2;
    }

    public void runSmsSentResultReceiver() {
        SmsSentResultReceiver smsSentResultReceiver = new SmsSentResultReceiver();
        this.sentResultReceiver = smsSentResultReceiver;
        registerReceiver(smsSentResultReceiver, new IntentFilter(Const.SMS_SEND_INTENTFILTER));
        this.existSmsSentResultReceiver = true;
    }

    public void sendSms() {
        SmsManager.getDefault().sendTextMessage(this.to, null, this.message, PendingIntent.getBroadcast(getApplicationContext(), 0, new Intent(Const.SMS_SEND_INTENTFILTER), 0), null);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean existReceivers() {
        return this.existSmsReceiver || this.existSmsSentResultReceiver;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean writeSmsLog(String str, String str2) {
        boolean z;
        Log.d("SmsService", "writeSmsLog() start");
        ContentValues contentValues = new ContentValues();
        contentValues.put("address", str);
        contentValues.put("body", str2);
        try {
            getContentResolver().insert(Uri.parse("content://sms/sent"), contentValues);
            z = true;
        } catch (Exception e) {
            Log.e("SmsService", "SMS log Write error");
            Log.e("SmsService", e.toString());
            z = false;
        }
        Log.d("SmsService", "writeSmsLog() end");
        return z;
    }

    /* loaded from: classes.dex */
    private class SmsSentResultReceiver extends BroadcastReceiver {
        private SmsSentResultReceiver() {
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            Log.d("SmsService", "SmsSentResultReceiver\u3000onReceive() start");
            Res res = new Res();
            if (intent.getAction().equals(Const.SMS_SEND_INTENTFILTER)) {
                if (getResultCode() == -1) {
                    res.setReturnCd("M001I");
                    if (SmsService.this.to != null && SmsService.this.message != null) {
                        SmsService smsService = SmsService.this;
                        smsService.writeSmsLog(smsService.to, SmsService.this.message);
                    }
                    Log.d("SmsService", "SMS Sent");
                } else {
                    res.setReturnCd("M001E");
                    Log.d("SmsService", "SMS Others");
                }
                SendSmsResultModule sendSmsResultModule = new SendSmsResultModule();
                if (TextUtils.equals(res.getReturnCd(), "M001I")) {
                    try {
                        sendSmsResultModule.responseJsonEx(SmsService.this.responder, JsonUtil.toJson(res, res.getClass()), 200);
                    } catch (Exception e) {
                        e.printStackTrace();
                        sendSmsResultModule.responseErrorJsonEx(SmsService.this.responder, "M001E", 500);
                    }
                } else {
                    sendSmsResultModule.responseErrorJsonEx(SmsService.this.responder, "M001E", 500);
                }
                SmsService smsService2 = SmsService.this;
                smsService2.unregisterReceiver(smsService2.sentResultReceiver);
                SmsService.this.existSmsSentResultReceiver = false;
                if (!SmsService.this.existReceivers()) {
                    SmsService.this.stopSelf();
                }
            }
            Log.d("SmsService", "SmsSentResultReceiver\u3000onReceive() end");
        }
    }

    /* loaded from: classes.dex */
    private class SmsReceiver extends BroadcastReceiver {
        private SmsReceiver() {
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            Log.d("SmsService", "SmsReceiver onReceive() start");
            if (intent.getAction().equals(Const.SMS_RECEIVE_INTENTFILTER)) {
                for (Object obj : (Object[]) intent.getExtras().get("pdus")) {
                    SmsMessage createFromPdu = SmsMessage.createFromPdu((byte[]) obj);
                    String messageBody = createFromPdu.getMessageBody();
                    String originatingAddress = createFromPdu.getOriginatingAddress();
                    Log.d("SmsService", "body : " + messageBody);
                    Log.d("SmsService", "address : " + originatingAddress);
                }
            }
            Log.d("SmsService", "SmsReceiver onReceive() end");
        }
    }

    /* loaded from: classes.dex */
    private static class SendSmsResultModule extends AbstractExtendModule {
        @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
        public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        }

        private SendSmsResultModule() {
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void responseJsonEx(MSHTTPResponder mSHTTPResponder, String str, int i) throws Exception {
            responseJson(mSHTTPResponder, str, i);
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void responseErrorJsonEx(MSHTTPResponder mSHTTPResponder, String str, int i) {
            responseErrorJson(mSHTTPResponder, str, i);
        }
    }
}
