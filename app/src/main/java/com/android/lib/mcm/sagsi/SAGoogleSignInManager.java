package com.android.lib.mcm.sagsi;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.android.lib.mcm.util.DebugUtil;
import com.android.lib.mcm.util.McmConst;
import com.uievolution.microserver.MicroServer;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
/* loaded from: classes.dex */
public class SAGoogleSignInManager {
    private static final String ERROR_MESSAGE_CLIENT = "scidが指定されていません。";
    private static final String ERROR_MESSAGE_STATE = "stateが指定されていません。";
    private static final String ERROR_MESSAGE_TOKEN_TYPE = "attが指定されていません。";
    private static final String KEY_CLIENT_ID = "scid";
    private static final String KEY_SCOPES = "scopes";
    private static final String KEY_STATE = "state";
    private static final String URL_HTML = "&format=html";
    private static final String URL_KEY_SA = "v1/?smt-service=ta.connectOemOAuth&code=";
    private static final String URL_KEY_SL = "v1/?smt-service=h5.oauth.2_0.getAccessToken&service_provider=g&code=";
    private static final String URL_STATE = "&state=";
    private static SAGoogleSignInManager instance = new SAGoogleSignInManager();
    private String mClientId = null;
    private String mScopes = null;
    private String mTokenType = null;
    private String mState = null;

    public static SAGoogleSignInManager getInstance() {
        return instance;
    }

    private SAGoogleSignInManager() {
    }

    public void startLogin(HashMap<String, String> hashMap) throws Exception {
        Context context = MicroServer.getInstance().getContext();
        String str = hashMap.get(KEY_CLIENT_ID);
        this.mClientId = str;
        DebugUtil.log(context, "scid : ", str);
        String str2 = hashMap.get(KEY_SCOPES);
        this.mScopes = str2;
        DebugUtil.log(context, "scopes : ", str2);
        String str3 = hashMap.get(SAGoogleSignInConst.KEY_TOKEN_TYPE);
        this.mTokenType = str3;
        DebugUtil.log(context, "att : ", str3);
        String str4 = hashMap.get(KEY_STATE);
        this.mState = str4;
        DebugUtil.log(context, "state : ", str4);
        checkParam();
        Log.d(getClass().getSimpleName(), "library -> call");

    }

    private void checkParam() throws Exception {
        if (TextUtils.isEmpty(this.mTokenType)) {
            throw new Exception(ERROR_MESSAGE_TOKEN_TYPE);
        }
        if (TextUtils.isEmpty(this.mClientId)) {
            throw new Exception(ERROR_MESSAGE_CLIENT);
        }
        if (TextUtils.isEmpty(this.mState)) {
            throw new Exception(ERROR_MESSAGE_STATE);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void changeToken(String str, Context context) {
        StringBuffer stringBuffer = new StringBuffer();
        try {
            if (DebugUtil.checkDebug(context)) {
                stringBuffer.append(McmConst.BASE_URL_TVESPA);
            } else {
                stringBuffer.append(McmConst.BASE_URL_SMT);
            }
            if (TextUtils.equals(this.mTokenType, SAGoogleSignInConst.TOKEN_TYPE_SMART_ACCESS)) {
                stringBuffer.append(URL_KEY_SA);
            } else if (TextUtils.equals(this.mTokenType, SAGoogleSignInConst.TOKEN_TYPE_GOOGLE)) {
                stringBuffer.append(URL_KEY_SL);
            }
            String stringBuffer2 = DebugUtil.checkDebug(context) ? stringBuffer.toString() : null;
            stringBuffer.append(URLEncoder.encode(str, "UTF-8"));
            stringBuffer.append(URL_STATE);
            stringBuffer.append(URLEncoder.encode(this.mState, "UTF-8"));
            if (TextUtils.equals(this.mTokenType, SAGoogleSignInConst.TOKEN_TYPE_GOOGLE)) {
                stringBuffer.append(URL_HTML);
                DebugUtil.log(context, "URL -> ", stringBuffer2, str, URL_STATE, this.mState, URL_HTML);
            } else {
                DebugUtil.log(context, "URL -> ", stringBuffer2, str, URL_STATE, this.mState);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        new SAServerAccessAsync(context, this.mTokenType).execute(stringBuffer.toString());
    }
}
