package com.android.lib.mcm.sagsi;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import com.android.lib.mcm.MCWebViewNativeApi;
import com.android.lib.mcm.util.DebugUtil;
import com.clarion.smartaccess.inappbilling.util.Util;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;
import jp.chef_station.chef_station.ChefStationConst;
/* loaded from: classes.dex */
public class SAServerAccessAsync extends AsyncTask<String, Void, String> {
    private Context mContext;
    private String mTokenType;

    public SAServerAccessAsync(Context context, String str) {
        this.mContext = context;
        this.mTokenType = str;
    }

    @Override // android.os.AsyncTask
    protected void onPreExecute() {
        super.onPreExecute();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.os.AsyncTask
    public String doInBackground(String... strArr) {
        String  str = null;
        String str2 = null;
        try {
            DebugUtil.log(this.mContext, "URL : ", strArr[0]);
            HttpsURLConnection httpsURLConnection = (HttpsURLConnection) new URL(strArr[0]).openConnection();
            httpsURLConnection.setInstanceFollowRedirects(false);
            httpsURLConnection.setRequestProperty(ChefStationConst.XSA_AUTHENTICATION_HEADER, getXSAAuthentication());
            httpsURLConnection.connect();
            InputStream inputStream = httpsURLConnection.getInputStream();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            byte[] bArr = new byte[8192];
            while (true) {
                int read = inputStream.read(bArr);
                if (read == -1) {
                    break;
                }
                byteArrayOutputStream.write(bArr, 0, read);
            }
            byteArrayOutputStream.flush();
            str = new String(byteArrayOutputStream.toByteArray(), "UTF-8");
            try {
                inputStream.close();
                byteArrayOutputStream.close();
            } catch (MalformedURLException e) {
                e = e;
                str2 = str;
                e.printStackTrace();
                str = str2;
                DebugUtil.log(this.mContext, "responseBody : ", str);
                return str;
            } catch (ProtocolException e2) {
                str2 = str;
                e2.printStackTrace();
                str = str2;
                DebugUtil.log(this.mContext, "responseBody : ", str);
                return str;
            } catch (IOException e3) {
                str2 = str;
                e3.printStackTrace();
                str = str2;
                DebugUtil.log(this.mContext, "responseBody : ", str);
                return str;
            }
        } catch (MalformedURLException e4) {
           // e = e4;
        } catch (ProtocolException e5) {
           // e = e5;
        } catch (IOException e6) {
            //e = e6;
        }
        DebugUtil.log(this.mContext, "responseBody : ", str);
        return str;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.os.AsyncTask
    public void onPostExecute(String str) {
        super.onPostExecute( str);
        Intent intent = new Intent(MCWebViewNativeApi.class.getName());
        intent.putExtra(SAGoogleSignInConst.KEY_LOAD_HTML, str);
        intent.putExtra(SAGoogleSignInConst.KEY_TOKEN_TYPE, this.mTokenType);
        this.mContext.sendBroadcast(intent);
    }

    private String getXSAAuthentication() {
        StringBuilder sb = new StringBuilder();
        if (DebugUtil.checkDebug(this.mContext)) {
            sb.append(ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_T);
            sb.append(ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_T);
        } else {
            sb.append(ChefStationConst.MARKET_PF_SA_AUTH_CONSUMER_KEY_F);
            sb.append(ChefStationConst.MARKET_PF_SA_AUTH_SECRET_KEY_F);
        }
        return Util.hashedStringForSHA256(sb.toString());
    }
}
