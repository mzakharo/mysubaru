package solutions.eve.evelib;

import ai.api.model.AIError;
import ai.api.model.AIResponse;
import ai.api.ui.AIButton;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.text.TextUtils;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import org.apache.log4j.spi.Configurator;
import org.json.JSONArray;
import org.json.JSONObject;
import solutions.eve.evelib.apiai.APIAIHelper;
import solutions.eve.evelib.geofence.GeofenceHelper;
import solutions.eve.evelib.geofence.SetupFenceIntentService;
import solutions.eve.evelib.geofence.ValidateAutomationIntentService;
import solutions.eve.evelib.geofence.json.TriggerAutomation;
import solutions.eve.evelib.helper.Creator;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.helper.TTS;
import solutions.eve.evelib.helper.json.AVRModal;
import solutions.eve.evelib.helper.json.EVEConnect;
import solutions.eve.evelib.helper.json.EVEResponse;
import solutions.eve.evelib.helper.json.FStatus;
import solutions.eve.evelib.helper.json.Token;
import solutions.eve.evelib.http.APIHttpClient;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;
import com.example.mysubaru.R;

/* loaded from: classes.dex */
public final class EVE extends BaseHelper {
    private static GeofenceHelper geofenceHelper = null;
    private static AIButton googleAIButton = null;
    public static boolean isAppRunningOnHMI = false;
    private static boolean isVoiceButtonHappy = true;
    private static AudioManager mAudioManager = null;
    public static Context mContext = null;
    private static Object mainAppResponder = null;
    private static EVE sInstance = null;
    private static boolean status = false;
    private static OnEVEActionListener upListener;
    Object mainResponder;
    static AIButton.AIButtonListener aiListener = new AIButton.AIButtonListener() { // from class: solutions.eve.evelib.EVE.2
        @Override // ai.api.ui.AIButton.AIButtonListener
        public void onResult(AIResponse aIResponse) {
            Logger.d("onResult");
            String json = new Gson().toJson(aIResponse.getResult());
            try {
                final AVRModal aVRModal = new AVRModal();
                aVRModal.setStatus(true);
                aVRModal.setApp("voiceControl");
                aVRModal.setMsg("doAction");
                aVRModal.setOrigText(json);
                Logger.i(json);
                PreferenceManager.storeString("last_voice_command", new Gson().toJson(aVRModal));
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.2.1
                    @Override // java.lang.Runnable
                    public void run() {
                        Logger.i("SENDING RESPONSE");
                        EVEResponse eVEResponse = new EVEResponse();
                        eVEResponse.setReturnCd("M001I");
                        eVEResponse.setResponse(new Gson().toJson(aVRModal));
                        EVE.upListener.onEVEActionComplete(eVEResponse, EVE.mainAppResponder);
                    }
                }, 5000L);
            } catch (Exception e) {
                e.printStackTrace();
            }
            Logger.i("STOPPING HMI CALL");
            BaseHelper.stopHMIcall();
        }

        @Override // ai.api.ui.AIButton.AIButtonListener
        public void onError(AIError aIError) {
            Logger.e("onError");
            Logger.e(aIError.toString());
            final AVRModal aVRModal = new AVRModal();
            aVRModal.setStatus(false);
            aVRModal.setApp("voiceControl");
            aVRModal.setMsg("doAction");
            aVRModal.setOrigText(aIError.toString());
            Logger.e(new Gson().toJson(aVRModal));
            PreferenceManager.storeString("last_voice_command", new Gson().toJson(aVRModal));
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.2.2
                @Override // java.lang.Runnable
                public void run() {
                    EVEResponse eVEResponse = new EVEResponse();
                    eVEResponse.setReturnCd("M001W");
                    eVEResponse.setResponse(new Gson().toJson(aVRModal));
                    EVE.upListener.onEVEActionError(eVEResponse, EVE.mainAppResponder);
                }
            }, 5000L);
            Logger.i("STOPPING HMI CALL");
            BaseHelper.stopHMIcall();
        }

        @Override // ai.api.ui.AIButton.AIButtonListener
        public void onCancelled() {
            Logger.e("onCancelled");
        }
    };
    private static BroadcastReceiver mMessageReceiver = new BroadcastReceiver() { // from class: solutions.eve.evelib.EVE.4
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            Logger.e("GeoFenceReceiver");
        }
    };
    static AlarmManager am = null;

    public EVE() {
    }

    public static boolean init(final Context context) {
        getInstance(context);
        try {
            if (mMessageReceiver != null) {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(mMessageReceiver);
            }
        } catch (IllegalArgumentException unused) {
            Logger.d("Receiver unregistered");
        }
        LocalBroadcastManager.getInstance(context).registerReceiver(mMessageReceiver, new IntentFilter(Constants.BROADCAST_ACTION));
        try {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: solutions.eve.evelib.EVE.1
                @Override // java.lang.Runnable
                public void run() {
                    boolean unused2 = EVE.status = BaseHelper.initializeBaseHelper(context);
                    if (EVE.googleAIButton == null) {
                        AIButton unused3 = EVE.googleAIButton = new AIButton(context);
                        EVE.googleAIButton.initialize(APIAIHelper.getAiConfig());
                        EVE.googleAIButton.setResultsListener(EVE.aiListener);
                    }
                }
            });
        } catch (Exception e) {
            Logger.e("EVE MODULE Init ERROR: ", e);
        }
        return status;
    }

    public static boolean release() {
        baseHelperRelease();
        return false;
    }

    public static String methodLoginUsingEncryptedInfo(String str) {
        try {
            Logger.d("URL: " + APIHttpClient.URL);
            String string = getClient().loginUsingEncryptedInfo(str).execute().body().string();
            if (string != null && !TextUtils.isEmpty(string)) {
                Token token = (Token) new Gson().fromJson(string, Token.class);
                PreferenceManager.storeString(Constants.REFRESH_TOKEN, new Gson().toJson(token));
                return new Gson().toJson(token);
            }
            return new Gson().toJson(new FStatus(false));
        } catch (IOException e) {
            e.printStackTrace();
            return new Gson().toJson(new FStatus(false, e.getMessage()));
        }
    }

    public static void setupListener(OnEVEActionListener onEVEActionListener) {
        upListener = onEVEActionListener;
    }

    private EVE(Context context) {
        mContext = context;
    }

    public static synchronized EVE getInstance(Context context) {
        EVE eve;
        synchronized (EVE.class) {
            if (sInstance == null) {
                sInstance = new EVE(context);
            }
            Logger.i("RETURNING EVE INSTANCE!");
            eve = sInstance;
        }
        return eve;
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    public void process(String str, Object obj, String str2) throws IOException {
        char c;
        if (this.mainResponder == null) {
            mainAppResponder = obj;
        }
        Uri parse = Uri.parse(Constants.DUMMY_API_URL + "/eve?" + str2);
        PreferenceManager.setup(mContext);
        if (parse != null) {
            EVEResponse eVEResponse = new EVEResponse();
            eVEResponse.setReturnCd("M001I");
            String queryParameter = parse.getQueryParameter("action");
            queryParameter.hashCode();
            char c2 = 65535;
            switch (queryParameter.hashCode()) {
                case -1396579591:
                    if (queryParameter.equals("foregroundHeartbeat")) {
                        c = 0;
                        break;
                    }
                    c = 65535;
                    break;
                case -1156014665:
                    if (queryParameter.equals("loginUsingEncryptedInfo")) {
                        c = 1;
                        break;
                    }
                    c = 65535;
                    break;
                case -680001974:
                    if (queryParameter.equals("triggertest")) {
                        c = 2;
                        break;
                    }
                    c = 65535;
                    break;
                case -321856532:
                    if (queryParameter.equals("refreshJWT")) {
                        c = 3;
                        break;
                    }
                    c = 65535;
                    break;
                case 107332:
                    if (queryParameter.equals("log")) {
                        c = 4;
                        break;
                    }
                    c = 65535;
                    break;
                case 109641682:
                    if (queryParameter.equals("speak")) {
                        c = 5;
                        break;
                    }
                    c = 65535;
                    break;
                case 136613690:
                    if (queryParameter.equals("getEVEConnectInfo")) {
                        c = 6;
                        break;
                    }
                    c = 65535;
                    break;
                case 849247272:
                    if (queryParameter.equals("EVELibraryRequest")) {
                        c = 7;
                        break;
                    }
                    c = 65535;
                    break;
                case 1428052126:
                    if (queryParameter.equals("enterBackgroundNotice")) {
                        c = '\b';
                        break;
                    }
                    c = 65535;
                    break;
                default:
                    c = 65535;
                    break;
            }
            switch (c) {
                case 0:
                    isAppRunningOnHMI = true;
                    PreferenceManager.storeBoolean(Constants.isAppRunningOnHMI, isAppRunningOnHMI);
                    eVEResponse.setResponse(new Gson().toJson(new FStatus(true, "foregroundHeartbeat")));
                    upListener.onEVEActionComplete(eVEResponse, obj);
                    Logger.i("foregroundHeartbeat");
                    return;
                case 1:
                    Logger.e("loginUsingEncryptedInfo");
                    String methodLoginUsingEncryptedInfo = methodLoginUsingEncryptedInfo(parse.getEncodedQuery().split("encryptedString=")[1]);
                    getRemoteEVEConnectInfo();
                    eVEResponse.setResponse(methodLoginUsingEncryptedInfo);
                    upListener.onEVEActionComplete(eVEResponse, obj);
                    return;
                case 2:
                    Logger.e("Running triggertest");
                    TriggerAutomation triggerAutomation = new TriggerAutomation("1", "leaving", "45.345", "-75.778");
                    APIHttpClient createClient = APIHttpClient.createClient(mContext);
                    try {
                        String string = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
                        if (string != null) {
                            Token token = (Token) new Gson().fromJson(string, Token.class);
                            JSONObject jSONObject = new JSONObject(createClient.triggerAutomation(triggerAutomation, token.getJwt()).execute().body().string());
                            if (!jSONObject.getBoolean("unverifiablescenes")) {
                                JSONArray jSONArray = jSONObject.getJSONArray("devices");
                                Logger.i("sEveInfo1 - " + new Gson().toJson(jSONArray));
                                startValidation(true, triggerAutomation, jSONArray, token.getJwt());
                            } else {
                                Logger.d("unverifiablescenes: true no need to verify");
                                JSONArray jSONArray2 = jSONObject.getJSONArray("devices");
                                Logger.i("sEveInfo1 - " + new Gson().toJson(jSONArray2));
                                startValidation(true, triggerAutomation, jSONArray2, token.getJwt());
                            }
                        } else {
                            Logger.e("RefreshToken Empty -> TriggerAutomation fail");
                        }
                        return;
                    } catch (Exception e) {
                        Logger.e("setTriggerAutomation", e);
                        return;
                    }
                case 3:
                    Logger.e("refreshJWT");
                    try {
                        String string2 = getClient().refreshJWT(parse.getQueryParameter("refreshToken")).execute().body().string();
                        if (string2 != null && !TextUtils.isEmpty(string2)) {
                            Token token2 = (Token) new Gson().fromJson(string2, Token.class);
                            PreferenceManager.storeString(Constants.REFRESH_TOKEN, new Gson().toJson(token2));
                            eVEResponse.setResponse(new Gson().toJson(token2));
                            upListener.onEVEActionError(eVEResponse, obj);
                        } else {
                            eVEResponse.setResponse(new Gson().toJson(new FStatus(false)));
                            upListener.onEVEActionError(eVEResponse, obj);
                        }
                        return;
                    } catch (IOException unused) {
                        eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "RefreshToken Unauthorised")));
                        upListener.onEVEActionError(eVEResponse, obj);
                        return;
                    }
                case 4:
                    String queryParameter2 = parse.getQueryParameter(NotificationCompat.CATEGORY_MESSAGE);
                    if (!TextUtils.isEmpty(queryParameter2)) {
                        eVEResponse.setResponse(new Gson().toJson(new FStatus(true, queryParameter2)));
                        upListener.onEVEActionComplete(eVEResponse, obj);
                        return;
                    } else {
                        eVEResponse.setResponse(new Gson().toJson(new FStatus(true, str2)));
                        upListener.onEVEActionComplete(eVEResponse, obj);
                        return;
                    }
                case 5:
                    String queryParameter3 = parse.getQueryParameter(NotificationCompat.CATEGORY_MESSAGE);
                    TTS.speak(queryParameter3);
                    eVEResponse.setResponse(new Gson().toJson(new Creator(queryParameter3)));
                    upListener.onEVEActionComplete(eVEResponse, obj);
                    return;
                case 6:
                    Logger.e("getEVEConnectInfo");
                    String string3 = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
                    if (string3 != null) {
                        try {
                            EVEConnect eVEConnect = (EVEConnect) new Gson().fromJson(getClient().getEVEConnectInfo((Token) new Gson().fromJson(string3, Token.class)).execute().body().string(), EVEConnect.class);
                            PreferenceManager.storeString(Constants.EVECONNECT_CONFIGURATION, new Gson().toJson(eVEConnect));
                            eVEResponse.setResponse(new Gson().toJson(eVEConnect));
                            upListener.onEVEActionComplete(eVEResponse, obj);
                            return;
                        } catch (IOException e2) {
                            eVEResponse.setResponse(new Gson().toJson(new FStatus(false, e2.getMessage())));
                            upListener.onEVEActionError(eVEResponse, obj);
                            return;
                        }
                    }
                    eVEResponse.setResponse(new Gson().toJson(new FStatus(false)));
                    upListener.onEVEActionError(eVEResponse, obj);
                    return;
                case 7:
                    if (parse.getQueryParameter("app").equals("eve")) {
                        String queryParameter4 = parse.getQueryParameter(NotificationCompat.CATEGORY_MESSAGE);
                        if (TextUtils.isEmpty(queryParameter4)) {
                            eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "Message query parameter is empty")));
                            upListener.onEVEActionError(eVEResponse, obj);
                            return;
                        }
                        queryParameter4.hashCode();
                        switch (queryParameter4.hashCode()) {
                            case -1672885201:
                                if (queryParameter4.equals("getVoiceCommand")) {
                                    c2 = 0;
                                    break;
                                }
                                break;
                            case -1117417280:
                                if (queryParameter4.equals("deleteAllData")) {
                                    c2 = 1;
                                    break;
                                }
                                break;
                            case -1076295119:
                                if (queryParameter4.equals("playSceneFailMessage")) {
                                    c2 = 2;
                                    break;
                                }
                                break;
                            case -1030305688:
                                if (queryParameter4.equals("updateLocationData")) {
                                    c2 = 3;
                                    break;
                                }
                                break;
                            case -75605984:
                                if (queryParameter4.equals("getData")) {
                                    c2 = 4;
                                    break;
                                }
                                break;
                            case 930703242:
                                if (queryParameter4.equals("useEncryptedJWT")) {
                                    c2 = 5;
                                    break;
                                }
                                break;
                            case 1691485227:
                                if (queryParameter4.equals("storeData")) {
                                    c2 = 6;
                                    break;
                                }
                                break;
                            case 1764105205:
                                if (queryParameter4.equals("deleteData")) {
                                    c2 = 7;
                                    break;
                                }
                                break;
                            case 1809929549:
                                if (queryParameter4.equals("startVoiceControl")) {
                                    c2 = '\b';
                                    break;
                                }
                                break;
                            case 1829029969:
                                if (queryParameter4.equals("needJWT")) {
                                    c2 = '\t';
                                    break;
                                }
                                break;
                        }
                        switch (c2) {
                            case 0:
                                String string4 = PreferenceManager.mediapref.getString("last_voice_command", null);
                                if (!TextUtils.isEmpty(string4)) {
                                    eVEResponse.setResponse(new Gson().toJson((AVRModal) new Gson().fromJson(string4, AVRModal.class)));
                                    upListener.onEVEActionComplete(eVEResponse, obj);
                                    return;
                                } else {
                                    eVEResponse.setResponse(new Gson().toJson(new FStatus(false)));
                                    upListener.onEVEActionError(eVEResponse, obj);
                                    return;
                                }
                            case 1:
                                PreferenceManager.deleteAllData();
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(true)));
                                upListener.onEVEActionComplete(eVEResponse, obj);
                                return;
                            case 2:
                                Logger.e("Play scene....removed");
                                return;
                            case 3:
                                updateEVEConnectInfo();
                                eVEResponse.setReturnCd("M001I");
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(true, "updateLocationData")));
                                upListener.onEVEActionComplete(eVEResponse, obj);
                                return;
                            case 4:
                                String string5 = PreferenceManager.mediapref.getString(parse.getQueryParameter("key"), null);
                                if (string5 != null) {
                                    eVEResponse.setResponse(string5);
                                    upListener.onEVEActionComplete(eVEResponse, obj);
                                    return;
                                } else {
                                    eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "Value for key does not exist.")));
                                    upListener.onEVEActionError(eVEResponse, obj);
                                    return;
                                }
                            case 5:
                                Logger.e("useEncryptedJWT");
                                eVEResponse.setResponse(methodLoginUsingEncryptedInfo(parse.getEncodedQuery().split("data=")[1]));
                                upListener.onEVEActionComplete(eVEResponse, obj);
                                return;
                            case 6:
                                JsonObject jsonObject = new JsonObject();
                                jsonObject.addProperty("status", (Boolean) true);
                                jsonObject.addProperty("key", parse.getQueryParameter("key"));
                                jsonObject.addProperty("data", parse.getQueryParameter("data"));
                                PreferenceManager.storeString(parse.getQueryParameter("key"), new Gson().toJson((JsonElement) jsonObject));
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(true)));
                                upListener.onEVEActionComplete(eVEResponse, obj);
                                return;
                            case 7:
                                PreferenceManager.delKey(parse.getQueryParameter("key"));
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(true)));
                                upListener.onEVEActionComplete(eVEResponse, obj);
                                return;
                            case '\b':
                                mainAppResponder = obj;
                                new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: solutions.eve.evelib.EVE.3
                                    @Override // java.lang.Runnable
                                    public void run() {
                                        if (EVE.isVoiceButtonHappy) {
                                            if (EVE.googleAIButton != null) {
                                                BaseHelper.startHMIcall();
                                                new Handler().postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.3.1
                                                    @Override // java.lang.Runnable
                                                    public void run() {
                                                        EVE.googleAIButton.performClick();
                                                    }
                                                }, Constants.one_sec);
                                            }
                                            boolean unused2 = EVE.isVoiceButtonHappy = false;
                                            new Handler().postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.3.2
                                                @Override // java.lang.Runnable
                                                public void run() {
                                                    boolean unused3 = EVE.isVoiceButtonHappy = true;
                                                }
                                            }, Constants.one_sec);
                                        }
                                    }
                                });
                                return;
                            case '\t':
                                Logger.e("needJWT");
                                String string6 = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
                                if (string6 != null) {
                                    if (string6.equals(Configurator.NULL)) {
                                        eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "RefreshToken Make sure you signed in using Login with: loginUsingEncryptedInfo")));
                                        upListener.onEVEActionError(eVEResponse, obj);
                                        return;
                                    }
                                    try {
                                        Token token3 = (Token) new Gson().fromJson(getClient().refreshJWT(((Token) new Gson().fromJson(string6, Token.class)).getRefreshToken()).execute().body().string(), Token.class);
                                        PreferenceManager.storeString(Constants.REFRESH_TOKEN, new Gson().toJson(token3));
                                        eVEResponse.setResponse(new Gson().toJson(token3));
                                        upListener.onEVEActionComplete(eVEResponse, obj);
                                        getRemoteEVEConnectInfo();
                                        return;
                                    } catch (IOException e3) {
                                        e3.printStackTrace();
                                        eVEResponse.setResponse(new Gson().toJson(new FStatus(false, e3.getMessage())));
                                        upListener.onEVEActionError(eVEResponse, obj);
                                        return;
                                    }
                                }
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "RefreshToken is null")));
                                upListener.onEVEActionError(eVEResponse, obj);
                                return;
                            default:
                                eVEResponse.setReturnCd("M001E");
                                eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "Unknown msg parameter : app")));
                                upListener.onEVEActionError(eVEResponse, obj);
                                return;
                        }
                    }
                    eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "Unknown query parameter : app")));
                    upListener.onEVEActionError(eVEResponse, obj);
                    return;
                case '\b':
                    isAppRunningOnHMI = false;
                    PreferenceManager.storeBoolean(Constants.isAppRunningOnHMI, isAppRunningOnHMI);
                    Logger.i("enterBackgroundNotice");
                    eVEResponse.setResponse(new Gson().toJson(new FStatus(true, "enterBackgroundNotice")));
                    upListener.onEVEActionComplete(eVEResponse, obj);
                    return;
                default:
                    eVEResponse.setReturnCd("M001E");
                    eVEResponse.setResponse(new Gson().toJson(new FStatus(false, "Unknown action")));
                    upListener.onEVEActionError(eVEResponse, obj);
                    return;
            }
        }
    }

    private void startValidation(boolean z, TriggerAutomation triggerAutomation, JSONArray jSONArray, String str) {
        try {
            Intent intent = new Intent(mContext, (Class<?>) ValidateAutomationIntentService.class);
            intent.setAction("testFoo");
            intent.putExtra("AutomationData", jSONArray.toString());
            intent.putExtra("JWT", str);
            intent.putExtra("triggerAutomation", new Gson().toJson(triggerAutomation));
            PendingIntent broadcast = PendingIntent.getBroadcast(mContext, 702, intent, 134217728);
            AlarmManager alarmManager = (AlarmManager) mContext.getSystemService(NotificationCompat.CATEGORY_ALARM);
            alarmManager.cancel(broadcast);
            if (z) {
                alarmManager.set(0, SystemClock.elapsedRealtime() + Constants.ten_seconds, broadcast);
            }
        } catch (Exception e) {
            Logger.e("******** startValidation ERROR *******", e);
        }
    }

    public static void onHeadunitConnected() {
        Logger.e("onHeadunitConnected");
        PreferenceManager.setup(mContext);
        PreferenceManager.storeBoolean(Constants.headUnitOFF, false);
        if (mContext == null) {
            Logger.i("Context null");
            return;
        }
        Logger.i("Setting up fences");
        PendingIntent broadcast = PendingIntent.getBroadcast(mContext, 903, new Intent(mContext, (Class<?>) SetupFenceIntentService.class), 0);
        if (am == null) {
            am = (AlarmManager) mContext.getSystemService(NotificationCompat.CATEGORY_ALARM);
        }
        am.cancel(broadcast);
        am.set(1, SystemClock.elapsedRealtime() + Constants.one_sec, broadcast);
    }

    public static void onHeadunitDisconnected() {
        Logger.e("onHeadunitDisconnected");
        PreferenceManager.setup(mContext);
        PreferenceManager.storeBoolean(Constants.headUnitOFF, true);
        if (TextUtils.isEmpty(PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null))) {
            Logger.i("eveconnect empty");
            return;
        }
        try {
            geofenceHelper = GeofenceHelper.getInstance(mContext);
            new Handler().postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.5
                @Override // java.lang.Runnable
                public void run() {
                    if (EVE.geofenceHelper != null) {
                        EVE.geofenceHelper.removeFences();
                    }
                }
            }, 4000L);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getRemoteEVEConnectInfo() {
        try {
            Logger.e("getRemoteEVEConnectInfo");
            String string = PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null);
            if (TextUtils.isEmpty(string)) {
                String string2 = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
                if (string2 != null) {
                    try {
                        PreferenceManager.storeString(Constants.EVECONNECT_CONFIGURATION, new Gson().toJson((EVEConnect) new Gson().fromJson(getClient().getEVEConnectInfo((Token) new Gson().fromJson(string2, Token.class)).execute().body().string(), EVEConnect.class)));
                        Logger.i("SUCCESS GETTING EVECONNECT INFO" + string);
                        GeofenceHelper.getInstance(mContext);
                    } catch (Exception e) {
                        Logger.e("FAILED getRemoteEVEConnectInfo: ", e);
                    }
                }
            } else {
                Logger.e("getRemoteEVEConnectInfo: eveConnectInfo empty");
                getRemoteEVEConnectInfoAA();
            }
        } catch (JsonSyntaxException e2) {
            e2.printStackTrace();
        }
    }

    private void updateEVEConnectInfo() {
        try {
            Logger.e("updateEVEConnectInfo");
            PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null);
            String string = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
            if (string != null) {
                try {
                    PreferenceManager.storeString(Constants.EVECONNECT_CONFIGURATION, new Gson().toJson((EVEConnect) new Gson().fromJson(getClient().getEVEConnectInfo((Token) new Gson().fromJson(string, Token.class)).execute().body().string(), EVEConnect.class)));
                    Logger.e("SUCCESS UPDATING EVECONNECT INFO");
                    GeofenceHelper.getInstance(mContext);
                } catch (Exception e) {
                    Logger.e("FAILED getRemoteEVEConnectInfo: ", e);
                }
            }
        } catch (JsonSyntaxException e2) {
            e2.printStackTrace();
        }
    }

    private void getRemoteEVEConnectInfoAA() {
        PreferenceManager.setup(mContext);
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.6
            @Override // java.lang.Runnable
            public void run() {
                String string = PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null);
                if (TextUtils.isEmpty(string)) {
                    String string2 = PreferenceManager.mediapref.getString(Constants.REFRESH_TOKEN, null);
                    if (string2 != null) {
                        try {
                            PreferenceManager.storeString(Constants.EVECONNECT_CONFIGURATION, new Gson().toJson((EVEConnect) new Gson().fromJson(BaseHelper.getClient().getEVEConnectInfo((Token) new Gson().fromJson(string2, Token.class)).execute().body().string(), EVEConnect.class)));
                            return;
                        } catch (IOException e) {
                            e.printStackTrace();
                            Logger.e("FAILED getRemoteEVEConnectInfoAA: " + e.getMessage());
                            return;
                        }
                    }
                    return;
                }
                Logger.e("getRemoteEVEConnectInfo: eveConnectInfo empty: " + string);
            }
        }, 5000L);
    }

    public static void playerSceneErrorMessage() {
        if (mContext == null) {
            Logger.e("******** EVE Context is Null ********");
            return;
        }
        Handler handler = new Handler(Looper.getMainLooper());
        final MediaPlayer create = MediaPlayer.create(mContext, R.raw.error_eveconenct_automation);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.7
            @Override // java.lang.Runnable
            public void run() {
                BaseHelper.startHMIcall();
            }
        }, Constants.one_sec);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.8
            @Override // java.lang.Runnable
            public void run() {
                try {
                    create.start();
                    Logger.e("Playing EVE audio message");
                } catch (Exception unused) {
                }
            }
        }, 2500L);
        handler.postDelayed(new Runnable() { // from class: solutions.eve.evelib.EVE.9
            @Override // java.lang.Runnable
            public void run() {
                BaseHelper.stopHMIcall();
                Logger.e("Releasing mPlayer");
                create.release();
            }
        }, 11000L);
    }
}
