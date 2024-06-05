package com.subaru.global.infotainment.gen2.extend.sms;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.sms.json.Res;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/* loaded from: classes.dex */
public class SendSmsModule extends AbstractExtendModule {
    public final String TAG = "SendSmsModule";
    private Context context;

    public SendSmsModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception {
        Log.d("SendSmsModule", "dispatch() start");
        String query = mSHTTPRequest.getRequestInfo().getQuery("to");
        String query2 = mSHTTPRequest.getRequestInfo().getQuery("message");
        Log.i("SendSmsModule", "-------------------- 入力パラメータ --------------------");
        Log.i("SendSmsModule", "type=" + query);
        Log.i("SendSmsModule", "name=" + query2);
        if (mSHTTPRequest != null && mSHTTPResponder != null) {
            try {
            } catch (Exception e) {
                Log.e("SendSmsModule", "予期せぬエラー");
                Log.e("SendSmsModule", e.toString());
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
            if (checkParam(query, query2)) {
                String str = "";
                if (query2 != null) {
                    str = URLDecoder.decode(query2, "UTF-8");
                    Log.i("SendSmsModule", "デコードされたmessage=" + query2);
                }
                SendSms sendSms = new SendSms(this.context, mSHTTPResponder);
                Res send = sendSms.send(query, str);
                if (!sendSms.isResultReceiverCreated()) {
                    if (TextUtils.equals(send.getReturnCd(), "M001I")) {
                        responseJson(mSHTTPResponder, JsonUtil.toJson(send, send.getClass()), 200);
                    } else if (TextUtils.equals(send.getReturnCd(), "M001W")) {
                        responseErrorJson(mSHTTPResponder, "M001W", 400);
                    } else {
                        responseErrorJson(mSHTTPResponder, "M001E", 500);
                    }
                }
                Log.d("SendSmsModule", "dispatch() end");
                return;
            }
        }
        Log.w("SendSmsModule", "入力パラメータエラー");
        responseErrorJson(mSHTTPResponder, "M001W", 400);
    }

    private boolean checkParam(String str, String str2) {
        boolean z = !TextUtils.isEmpty(str);
        if (TextUtils.isEmpty(str2)) {
            return false;
        }
        return z;
    }
}
