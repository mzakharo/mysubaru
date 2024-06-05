package solutions.eve.evelib.http;

import android.content.Context;
import android.util.Log;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import okhttp3.Authenticator;
import okhttp3.FormBody;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Route;
import solutions.eve.evelib.EVE;
import solutions.eve.evelib.geofence.json.TriggerAutomation;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.helper.json.Token;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public final class APIHttpClient {
    public static final String URL = getStringResourceByName("EVE_API_BASE_URL_ENDPOINT");
    private OkHttpClient mClient;

    private static String getStringResourceByName(String str) {
        return EVE.mContext.getString(EVE.mContext.getResources().getIdentifier(str, "string", EVE.mContext.getPackageName())) + "/_clarion/lib/controller.cfc";
    }

    private APIHttpClient(OkHttpClient okHttpClient) {
        Logger.e("EVE BASE URL: " + getStringResourceByName("EVE_API_BASE_URL_ENDPOINT"));
        try {
            this.mClient = okHttpClient;
            if (okHttpClient != null) {
            } else {
                throw new IllegalArgumentException("OkHttpClient must not be null.");
            }
        } catch (Exception e) {
            Log.e("TAG", "FailInit", e);
        }
    }

    public static APIHttpClient createClient(Context context) {
        return new APIHttpClient(new OkHttpClient.Builder().connectTimeout(5L, TimeUnit.MINUTES).readTimeout(5L, TimeUnit.MINUTES).writeTimeout(5L, TimeUnit.MINUTES).addNetworkInterceptor(new Interceptor() { // from class: solutions.eve.evelib.http.APIHttpClient.1
            @Override // okhttp3.Interceptor
            public Response intercept(Interceptor.Chain chain) throws IOException {
                return chain.proceed(chain.request().newBuilder().addHeader(Constants.client_id, Constants.CLIENT_ID).build());
            }
        }).authenticator(new TokenAuthenticator()).build());
    }

    public APICall refreshJWT(String str) {
        return new APICall(this.mClient.newCall(new Request.Builder().url(URL + "?method=refreshjwt").post(new FormBody.Builder().add("refreshToken", str).build()).build()));
    }

    public APICall loginUsingEncryptedInfo(String str) {
        return new APICall(this.mClient.newCall(new Request.Builder().url(URL + "?method=loginUsingEncryptedInfo").post(new FormBody.Builder().add("encryptedString", str).build()).build()));
    }

    public APICall getEVEConnectInfo(Token token) {
        return new APICall(this.mClient.newCall(new Request.Builder().url(URL + "?method=getEVEConnectInfo").addHeader(Constants.AUTHORIZATION, token.getJwt()).build()));
    }

    public APICall triggerAutomation(TriggerAutomation triggerAutomation, String str) {
        return new APICall(this.mClient.newCall(new Request.Builder().url(URL + "?method=triggerAutomation").addHeader(Constants.AUTHORIZATION, str).post(new FormBody.Builder().add("locationID", triggerAutomation.getLocationID()).add("action", triggerAutomation.getAction()).add("latitude", triggerAutomation.getLatitude()).add("longitude", triggerAutomation.getLongitude()).build()).build()));
    }

    public APICall triggerValidation(TriggerAutomation triggerAutomation, String str, String str2) {
        return new APICall(this.mClient.newCall(new Request.Builder().url(URL + "?method=verifyAutomation").addHeader(Constants.AUTHORIZATION, str2).post(new FormBody.Builder().add("locationID", triggerAutomation.getLocationID()).add("action", triggerAutomation.getAction()).add("devices", str).build()).build()));
    }

    /* loaded from: classes.dex */
    public static class TokenAuthenticator implements Authenticator {
        int trial = 0;

        @Override // okhttp3.Authenticator
        public Request authenticate(Route route, Response response) throws IOException {
            String string = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
            if (string != null && this.trial != 2) {
                FormBody build = new FormBody.Builder().add("refreshToken", ((Token) new Gson().fromJson(string, Token.class)).getRefreshToken()).build();
                this.trial++;
                return response.request().newBuilder().url(APIHttpClient.URL + "?method=refreshjwt").post(build).build();
            }
            this.trial = 0;
            return null;
        }
    }
}
