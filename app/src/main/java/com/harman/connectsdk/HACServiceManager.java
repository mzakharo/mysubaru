package com.harman.connectsdk;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.os.IBinder;
import com.harman.connectsdk.ConnectionService;
import com.harman.services.IHACServiceCallback;
import com.harman.services.IOnQueryResponseCallback;
import com.harman.services.IResponseDataCallback;
import com.harman.services.IService;
import com.harman.services.Log;
import com.harman.services.ServiceController;
import com.harman.services.maps.GenericError;
import com.harman.services.maps.MapUtils;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class HACServiceManager implements IResponseDataCallback, IHACServiceCallback {
    private static final String REQUEST_TYPE_JSON = "application/json";
    public static final String TAG = "HACServiceManager";
    static Context mContext;
    private static HACServiceManager mHACServiceManager;
    String appIdentifier;
    String appSubVersion;
    String appVersion;
    ConnectionService mConnectionService;
    int mProtocolVersion;
    ServiceConnection mServiceConnection;
    ServiceController mServiceController;
    boolean isServiceBounded = false;
    Map<String, IService> serviceMap = new HashMap();
    Map<Integer, String> genericHandlerMap = new HashMap();
    HashMap<String, String> customFieldsMap = new HashMap<>();
    InputStream mUsbInputStream = null;
    InputStream mBTInputStream = null;
    OutputStream mUsbOutputStream = null;
    OutputStream mBTOutputStream = null;
    IHACServiceManagerCallback mCallBacks = null;
    List<String> appSupportedServicesList = new ArrayList();
    List<String> finalSupportedServicesList = new ArrayList();

    @Override // com.harman.services.IHACServiceCallback
    public void onAsyncQuery(Object obj, String str, String str2, IOnQueryResponseCallback iOnQueryResponseCallback) {
    }

    private HACServiceManager() {
        this.mServiceController = null;
        this.mServiceController = new ServiceController();
    }

    public static synchronized HACServiceManager getInstance() {
        HACServiceManager hACServiceManager;
        synchronized (HACServiceManager.class) {
            if (mHACServiceManager == null) {
                mHACServiceManager = new HACServiceManager();
            }
            hACServiceManager = mHACServiceManager;
        }
        return hACServiceManager;
    }

    private void initServiceConnection() {
        this.mServiceConnection = new ServiceConnection() { // from class: com.harman.connectsdk.HACServiceManager.1
            @Override // android.content.ServiceConnection
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                HACServiceManager.this.mConnectionService = ((ConnectionService.LocalBinder) iBinder).getService();
                Log.i(HACServiceManager.TAG, "Service Connected");
                HACServiceManager.this.isServiceBounded = true;
                if (HACServiceManager.this.mCallBacks != null) {
                    HACServiceManager.this.mConnectionService.registerCallback(HACServiceManager.this.mCallBacks);
                    HACServiceManager.this.mConnectionService.initConnectionService();
                }
            }

            @Override // android.content.ServiceConnection
            public void onServiceDisconnected(ComponentName componentName) {
                Log.e(HACServiceManager.TAG, "Service Disconnected");
            }
        };
    }

    @Override // com.harman.services.IHACServiceCallback
    public void initMapService(Context context) {
        try {
            JSONObject jSONObject = new JSONObject();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put(HarmanOTAConst.JSON_APP_IDENTIFIER, HarmanOTAConst.HARMAN_LIBRARY_APP_NAME);
            jSONObject2.put(HarmanOTAConst.JSON_VERSION, "1.0");
            jSONObject2.put(HarmanOTAConst.JSON_SUB_VERSION, "Debug");
            jSONObject.put(HarmanOTAConst.JSON_APP_INFO, jSONObject2);
            JSONArray jSONArray = new JSONArray();
            jSONArray.put("com.hac.mapService.TomTom");
            jSONArray.put("com.hac.mapService.TomTom.Gen4");
            jSONObject.put(HarmanOTAConst.JSON_SERVICE_INFO, jSONArray);
            initializeWithParam(jSONObject, context, this.mCallBacks);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void initializeWithParam(JSONObject jSONObject, Context context, IHACServiceManagerCallback iHACServiceManagerCallback) {
        mContext = context;
        Log log = new Log();
        log.intiLogger("AhaConnectSDK", mContext);
        Intent intent = new Intent(mContext, (Class<?>) ConnectionService.class);
        initServiceConnection();
        mContext.bindService(intent, this.mServiceConnection, 1);
        this.mCallBacks = iHACServiceManagerCallback;
        if (jSONObject != null) {
            try {
                JSONObject optJSONObject = jSONObject.optJSONObject(HarmanOTAConst.JSON_APP_INFO);
                if (optJSONObject != null) {
                    this.appIdentifier = optJSONObject.optString(HarmanOTAConst.JSON_APP_IDENTIFIER);
                    this.appVersion = optJSONObject.optString(HarmanOTAConst.JSON_VERSION);
                    String optString = optJSONObject.optString(HarmanOTAConst.JSON_SUB_VERSION);
                    this.appSubVersion = optString;
                    if (optString != null && !optString.isEmpty()) {
                        storeDebugFlag(this.appSubVersion);
                    }
                    log.intiLogger("AhaConnectSDK", mContext);
                    String str = TAG;
                    Log.i(str, "App Identifier:" + this.appIdentifier);
                    Log.i(str, "AppVersion :" + this.appVersion);
                    Log.i(str, "App SubVersion:" + this.appSubVersion);
                }
                JSONArray optJSONArray = jSONObject.optJSONArray(HarmanOTAConst.JSON_SERVICE_INFO);
                if (optJSONArray == null || optJSONArray.length() <= 0) {
                    return;
                }
                for (int i = 0; i < optJSONArray.length(); i++) {
                    String obj = optJSONArray.get(i).toString();
                    this.appSupportedServicesList.add(obj);
                    Log.i(TAG, "Services:" + obj);
                    IService service = this.mServiceController.getService(obj);
                    if (service != null) {
                        this.serviceMap.put(obj, service);
                        if (mContext != null) {
                            service.initHACServiceCallback(this);
                            service.initService(mContext);
                        }
                    }
                }
                initGenericHandlerType();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    public Object sendRequest(Object obj, String str, String str2) {
        Log.i(TAG, "sendRequest-Content Type:" + str);
        return null;
    }

    public void sendAsyncRequest(Object obj, String str, String str2, final IResponseCallback iResponseCallback) {
        String str3 = TAG;
        Log.i(str3, "sendAsyncRequest --------> serviceIdentifier: " + str2 + " Content Type:" + str);
        if (str.equals("application/json")) {
            Log.i(str3, "Request Type is JSON and Payload:" + obj);
            if (str2 == null || str2.isEmpty()) {
                return;
            }
            IService iService = this.serviceMap.get(str2);
            String string = mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getString(MapUtils.KEY_LIBRARY_TYPE, "");
            if (string != null && !string.equals("") && str2.equals("com.hac.mapService.TomTom.Gen5") && string.equals(MapUtils.PREF_LIBRARY_TYPE_GEN4)) {
                Log.e(str3, "Gen4 loaded, Can't execute Gen5 request");
                iResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                return;
            } else {
                if (iService != null) {
                    iService.sendAsyncRequest(obj, str, new IOnQueryResponseCallback() { // from class: com.harman.connectsdk.HACServiceManager.2
                        @Override // com.harman.services.IOnQueryResponseCallback
                        public void onSuccessResponse(Object obj2, String str4, String str5) {
                            Log.i(HACServiceManager.TAG, "sendAsyncRequest:onSuccessResponse: " + obj2);
                            iResponseCallback.onSuccessResponse(obj2, str5);
                        }

                        @Override // com.harman.services.IOnQueryResponseCallback
                        public void onErrorResponse(int i) {
                            Log.i(HACServiceManager.TAG, "sendAsyncRequest:onErrorResponse: " + i);
                            iResponseCallback.onErrorResponse(i);
                        }
                    });
                    return;
                }
                return;
            }
        }
        iResponseCallback.onErrorResponse(33);
    }

    private void initGenericHandlerType() {
        this.genericHandlerMap.put(2, "com.hac.mapService.TomTom");
        this.genericHandlerMap.put(4, "com.hac.mapService.TomTom.Gen4");
        this.genericHandlerMap.put(5, "com.hac.mapService.TomTom.Gen5");
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void loadMessage(final short s, final byte[] bArr, final int i) {
        Log.i(TAG, "loadMessage::Opcode== " + ((int) s) + "  Request id==" + i);
        new Thread(new Runnable() { // from class: com.harman.connectsdk.HACServiceManager.3
            @Override // java.lang.Runnable
            public void run() {
                short s2 = s;
                if (s2 != 416) {
                    switch (s2) {
                        case 128:
                            HACServiceManager.this.processGenericCommand(bArr, i);
                            return;
                        case 129:
                            HACServiceManager.this.processGenericFileDataCommand(bArr, i);
                            return;
                        case 130:
                            try {
                                HACServiceManager.this.processSendGenericFileDataCommand(bArr, i);
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                            return;
                        case 131:
                            HACServiceManager.this.processGenericHandShakeRequest(bArr, i);
                            return;
                        default:
                            return;
                    }
                }
                HACServiceManager.this.processGenericClientNotification(bArr, i);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processGenericCommand(byte[] bArr, int i) {
        byte[] bArr2;
        String str = TAG;
        Log.i(str, "QueryGenericCommand called");
        if (bArr != null) {
            bArr2 = new byte[bArr.length];
            System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
        } else {
            bArr2 = null;
        }
        Log.i(str, "Request PacketData from HU >>> " + Utility.hexString(bArr2));
        short shortValue = ((Short) Utility.getIntVal(bArr2, 10, 2)).shortValue();
        Log.i(str, "GENERIC_COMMAND_HANDLER_TYPE: : " + ((int) shortValue));
        short shortValue2 = ((Short) Utility.getIntVal(bArr2, 12, 2)).shortValue();
        Log.i(str, "GENERIC_COMMAND_LENGTH: : " + ((int) shortValue2));
        if (shortValue2 > 0) {
            Log.i(str, "GENERIC_COMMAND_DATA: : " + getConvertedString(bArr2, 14, shortValue2));
        }
        IService iService = this.serviceMap.get(this.genericHandlerMap.get(Integer.valueOf(shortValue)));
        if (iService != null) {
            iService.processGenericCommand(bArr, i, this);
            return;
        }
        Log.i(str, "Invalid Request:");
        byte[] packageResponse = Utility.packageResponse(i, 1, null);
        Log.i(str, "ERROR code : 1");
        Log.i(str, "Response PacketData for QueryGenericCommand to HU <<< " + Utility.hexString(packageResponse));
        sendToChannel(packageResponse);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processGenericFileDataCommand(byte[] bArr, int i) {
        byte[] bArr2;
        String str = TAG;
        Log.i(str, "processGenericFileDataCommand called");
        if (bArr != null) {
            bArr2 = new byte[bArr.length];
            System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
        } else {
            bArr2 = null;
        }
        Log.i(str, "Request PacketData from HU >>> " + Utility.hexString(bArr2));
        int intValue = ((Integer) Utility.getUnSignedIntVal(bArr2, 10, 2)).intValue();
        Log.i(str, "Handler Type  : " + intValue);
        IService iService = this.serviceMap.get(this.genericHandlerMap.get(Integer.valueOf(intValue)));
        if (iService != null) {
            sendToChannel(iService.readDataFromFile(bArr, i));
            return;
        }
        Log.i(str, "Invalid Request:");
        byte[] packageResponse = Utility.packageResponse(i, 1, null);
        Log.i(str, "ERROR code : 1");
        Log.i(str, "Response PacketData for QueryGenericFileDataCommand to HU <<<" + Utility.hexString(packageResponse));
        sendToChannel(packageResponse);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processSendGenericFileDataCommand(byte[] bArr, int i) throws IOException {
        byte[] bArr2;
        String str = TAG;
        Log.i(str, "processSendGenericFileDataCommand called");
        if (bArr != null) {
            bArr2 = new byte[bArr.length];
            System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
        } else {
            bArr2 = null;
        }
        Log.i(str, "Request PacketData from HU >>>" + Utility.hexString(bArr2));
        int intValue = ((Integer) Utility.getUnSignedIntVal(bArr2, 10, 2)).intValue();
        Log.i(str, "Handler Type  : " + intValue);
        IService iService = this.serviceMap.get(this.genericHandlerMap.get(Integer.valueOf(intValue)));
        if (iService != null) {
            sendToChannel(iService.writeDataIntoFile(bArr, i));
            return;
        }
        Log.i(str, "Invalid Request:");
        byte[] packageResponse = Utility.packageResponse(i, 1, null);
        Log.i(str, "ERROR code : 1");
        Log.i(str, "Response PacketData for SendGeneric to HU <<<" + Utility.hexString(packageResponse));
        sendToChannel(packageResponse);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Can't wrap try/catch for region: R(43:9|10|(7:336|337|338|339|340|341|342)(1:12)|(2:13|14)|(9:(3:314|315|(51:317|319|320|321|322|323|17|18|(3:291|292|(47:294|295|296|297|298|299|21|22|(3:266|267|(43:269|270|271|272|273|274|25|26|(3:243|244|(39:246|247|248|249|250|251|29|30|(3:215|216|(37:218|219|220|221|222|223|(1:225)(1:228)|226|33|34|(3:192|193|(31:195|196|197|198|199|200|37|38|(3:171|172|(25:174|175|176|177|178|179|41|42|(1:166)(3:46|96|97)|(1:163)(1:104)|106|107|(2:109|(14:111|(5:115|(7:117|118|119|120|121|122|123)(2:131|132)|124|112|113)|133|134|(3:138|(4:141|(1:151)(4:143|(2:145|(1:147))|148|149)|150|139)|152)|154|54|55|(3:57|(4:60|(2:62|63)(2:65|66)|64|58)|67)|68|(2:71|69)|72|73|(3:(6:77|(1:79)|80|(1:88)(4:82|(1:84)|85|86)|87|75)|89|90)(2:91|92)))|160|134|(4:136|138|(1:139)|152)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|40|41|42|(1:44)|166|(1:99)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|54|55|(0)|68|(1:69)|72|73|(0)(0))|16|17|18|(0)|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154) */
    /* JADX WARN: Can't wrap try/catch for region: R(51:9|10|(7:336|337|338|339|340|341|342)(1:12)|(2:13|14)|(3:314|315|(51:317|319|320|321|322|323|17|18|(3:291|292|(47:294|295|296|297|298|299|21|22|(3:266|267|(43:269|270|271|272|273|274|25|26|(3:243|244|(39:246|247|248|249|250|251|29|30|(3:215|216|(37:218|219|220|221|222|223|(1:225)(1:228)|226|33|34|(3:192|193|(31:195|196|197|198|199|200|37|38|(3:171|172|(25:174|175|176|177|178|179|41|42|(1:166)(3:46|96|97)|(1:163)(1:104)|106|107|(2:109|(14:111|(5:115|(7:117|118|119|120|121|122|123)(2:131|132)|124|112|113)|133|134|(3:138|(4:141|(1:151)(4:143|(2:145|(1:147))|148|149)|150|139)|152)|154|54|55|(3:57|(4:60|(2:62|63)(2:65|66)|64|58)|67)|68|(2:71|69)|72|73|(3:(6:77|(1:79)|80|(1:88)(4:82|(1:84)|85|86)|87|75)|89|90)(2:91|92)))|160|134|(4:136|138|(1:139)|152)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|40|41|42|(1:44)|166|(1:99)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|16|17|18|(0)|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)) */
    /* JADX WARN: Can't wrap try/catch for region: R(52:9|10|(7:336|337|338|339|340|341|342)(1:12)|13|14|(3:314|315|(51:317|319|320|321|322|323|17|18|(3:291|292|(47:294|295|296|297|298|299|21|22|(3:266|267|(43:269|270|271|272|273|274|25|26|(3:243|244|(39:246|247|248|249|250|251|29|30|(3:215|216|(37:218|219|220|221|222|223|(1:225)(1:228)|226|33|34|(3:192|193|(31:195|196|197|198|199|200|37|38|(3:171|172|(25:174|175|176|177|178|179|41|42|(1:166)(3:46|96|97)|(1:163)(1:104)|106|107|(2:109|(14:111|(5:115|(7:117|118|119|120|121|122|123)(2:131|132)|124|112|113)|133|134|(3:138|(4:141|(1:151)(4:143|(2:145|(1:147))|148|149)|150|139)|152)|154|54|55|(3:57|(4:60|(2:62|63)(2:65|66)|64|58)|67)|68|(2:71|69)|72|73|(3:(6:77|(1:79)|80|(1:88)(4:82|(1:84)|85|86)|87|75)|89|90)(2:91|92)))|160|134|(4:136|138|(1:139)|152)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|40|41|42|(1:44)|166|(1:99)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)))|16|17|18|(0)|20|21|22|(0)|24|25|26|(0)|28|29|30|(0)|32|33|34|(0)|36|37|38|(0)|40|41|42|(0)|166|(0)|163|106|107|(0)|160|134|(0)|154|54|55|(0)|68|(1:69)|72|73|(0)(0)) */
    /* JADX WARN: Code restructure failed: missing block: B:161:0x03d6, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:162:0x03d7, code lost:
    
        r26 = r3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:168:0x03e4, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:169:0x03e5, code lost:
    
        r26 = r3;
        r3 = r0;
        r2 = r20;
        r16 = r24;
     */
    /* JADX WARN: Code restructure failed: missing block: B:190:0x03f0, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:191:0x03f1, code lost:
    
        r25 = r8;
     */
    /* JADX WARN: Code restructure failed: missing block: B:213:0x03fb, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:214:0x03fc, code lost:
    
        r24 = r3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:241:0x0406, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:242:0x0407, code lost:
    
        r23 = r8;
     */
    /* JADX WARN: Code restructure failed: missing block: B:264:0x0411, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:265:0x0412, code lost:
    
        r22 = r3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:289:0x041c, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:290:0x041d, code lost:
    
        r21 = com.harman.services.maps.MapUtils.KEY_MODEL_YEAR;
     */
    /* JADX WARN: Code restructure failed: missing block: B:312:0x0425, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:313:0x0426, code lost:
    
        r20 = r3;
        r21 = com.harman.services.maps.MapUtils.KEY_MODEL_YEAR;
        r3 = r0;
     */
    /* JADX WARN: Removed duplicated region for block: B:109:0x0322 A[Catch: Exception -> 0x03d6, TRY_LEAVE, TryCatch #32 {Exception -> 0x03d6, blocks: (B:107:0x031a, B:109:0x0322), top: B:106:0x031a }] */
    /* JADX WARN: Removed duplicated region for block: B:136:0x036c A[Catch: Exception -> 0x03cc, TryCatch #30 {Exception -> 0x03cc, blocks: (B:122:0x0341, B:124:0x0354, B:134:0x0360, B:136:0x036c, B:139:0x0373, B:141:0x0379, B:143:0x0399, B:145:0x03a3, B:147:0x03ab, B:148:0x03ae), top: B:121:0x0341 }] */
    /* JADX WARN: Removed duplicated region for block: B:141:0x0379 A[Catch: Exception -> 0x03cc, TryCatch #30 {Exception -> 0x03cc, blocks: (B:122:0x0341, B:124:0x0354, B:134:0x0360, B:136:0x036c, B:139:0x0373, B:141:0x0379, B:143:0x0399, B:145:0x03a3, B:147:0x03ab, B:148:0x03ae), top: B:121:0x0341 }] */
    /* JADX WARN: Removed duplicated region for block: B:171:0x028b A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:192:0x024e A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:215:0x0200 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:243:0x01c3 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:266:0x0183 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:291:0x0143 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:44:0x02c2 A[Catch: Exception -> 0x02e5, TRY_ENTER, TryCatch #24 {Exception -> 0x02e5, blocks: (B:179:0x02a0, B:44:0x02c2, B:46:0x02cc), top: B:178:0x02a0 }] */
    /* JADX WARN: Removed duplicated region for block: B:57:0x04b1  */
    /* JADX WARN: Removed duplicated region for block: B:71:0x0561 A[Catch: Exception -> 0x0609, LOOP:1: B:69:0x055b->B:71:0x0561, LOOP_END, TryCatch #31 {Exception -> 0x0609, blocks: (B:55:0x046e, B:58:0x04b2, B:60:0x04ba, B:62:0x04c7, B:64:0x04dd, B:68:0x04e4, B:69:0x055b, B:71:0x0561, B:73:0x05ab, B:75:0x05d2, B:77:0x05da, B:79:0x05e6, B:80:0x05eb, B:82:0x05f1, B:84:0x05f5, B:85:0x05fd, B:87:0x0600, B:91:0x0603), top: B:54:0x046e }] */
    /* JADX WARN: Removed duplicated region for block: B:75:0x05d2 A[Catch: Exception -> 0x0609, LOOP:2: B:75:0x05d2->B:87:0x0600, LOOP_START, PHI: r2
  0x05d2: PHI (r2v9 int) = (r2v7 int), (r2v10 int) binds: [B:74:0x05d0, B:87:0x0600] A[DONT_GENERATE, DONT_INLINE], TryCatch #31 {Exception -> 0x0609, blocks: (B:55:0x046e, B:58:0x04b2, B:60:0x04ba, B:62:0x04c7, B:64:0x04dd, B:68:0x04e4, B:69:0x055b, B:71:0x0561, B:73:0x05ab, B:75:0x05d2, B:77:0x05da, B:79:0x05e6, B:80:0x05eb, B:82:0x05f1, B:84:0x05f5, B:85:0x05fd, B:87:0x0600, B:91:0x0603), top: B:54:0x046e }] */
    /* JADX WARN: Removed duplicated region for block: B:91:0x0603 A[Catch: Exception -> 0x0609, TRY_LEAVE, TryCatch #31 {Exception -> 0x0609, blocks: (B:55:0x046e, B:58:0x04b2, B:60:0x04ba, B:62:0x04c7, B:64:0x04dd, B:68:0x04e4, B:69:0x055b, B:71:0x0561, B:73:0x05ab, B:75:0x05d2, B:77:0x05da, B:79:0x05e6, B:80:0x05eb, B:82:0x05f1, B:84:0x05f5, B:85:0x05fd, B:87:0x0600, B:91:0x0603), top: B:54:0x046e }] */
    /* JADX WARN: Removed duplicated region for block: B:99:0x02f1 A[Catch: Exception -> 0x030e, TryCatch #28 {Exception -> 0x030e, blocks: (B:97:0x02d0, B:99:0x02f1, B:102:0x02f9, B:104:0x02ff), top: B:96:0x02d0 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public void processGenericHandShakeRequest(byte[] r30, int r31) {
        /*
            Method dump skipped, instructions count: 1612
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.connectsdk.HACServiceManager.processGenericHandShakeRequest(byte[], int):void");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processGenericClientNotification(byte[] bArr, int i) {
        byte[] bArr2;
        String str = TAG;
        Log.i(str, "GenericClientNotification Request From HU");
        String str2 = null;
        if (bArr != null) {
            bArr2 = new byte[bArr.length];
            System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
        } else {
            bArr2 = null;
        }
        Log.i(str, "GenericClientNotification Request PacketData from HU >>>" + Utility.hexString(bArr2));
        short shortValue = ((Short) Utility.getIntVal(bArr2, 10, 2)).shortValue();
        Log.i(str, "GENERIC_CLIENT_NOTIFICATION_HANDLER_TYPE: : " + ((int) shortValue));
        short shortValue2 = ((Short) Utility.getIntVal(bArr2, 12, 2)).shortValue();
        Log.i(str, "GENERIC_CLIENT_NOTIFICATION_LENGTH: : " + ((int) shortValue2));
        if (shortValue2 > 0) {
            str2 = getConvertedString(bArr2, 14, shortValue2);
            Log.i(str, "GENERIC_CLIENT_NOTIFICATION_DATA: : " + str2);
        }
        IService iService = this.serviceMap.get(this.genericHandlerMap.get(Integer.valueOf(shortValue)));
        if (iService == null) {
            Log.i(str, "Invalid Request:");
        } else if (str2 != null) {
            iService.processGenericNotification(str2, i);
        }
    }

    private boolean isServiceSupportedByApp(String str) {
        if (str == null || this.appSupportedServicesList.size() <= 0) {
            return false;
        }
        for (int i = 0; i < this.appSupportedServicesList.size(); i++) {
            if (str.equals(this.appSupportedServicesList.get(i))) {
                return true;
            }
        }
        return false;
    }

    private boolean isMapUpdateEnabled(String str) {
        String optString;
        boolean z = false;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryMapUpdateFlag");
            IHACServiceManagerCallback iHACServiceManagerCallback = this.mCallBacks;
            JSONObject jSONObject2 = iHACServiceManagerCallback != null ? (JSONObject) iHACServiceManagerCallback.onQuery(jSONObject, "application/json", str) : null;
            if (jSONObject2 == null || (optString = jSONObject2.optString("resp")) == null || !optString.equals("queryMapUpdateFlag")) {
                return false;
            }
            z = jSONObject2.optBoolean("status");
            Log.i(TAG, "Map update Status:" + z);
            return z;
        } catch (Exception e) {
            e.printStackTrace();
            return z;
        }
    }

    private void sendHandShakeResponse(int i, byte[] bArr) {
        String str = TAG;
        Log.i(str, "sendHandShakeResponse called with Request Id::" + i);
        byte[] expandByteArray = Utility.expandByteArray(null, 2);
        Utility.ushort2Byte(expandByteArray, Integer.valueOf(bArr.length), 0, 2);
        byte[] expandByteArray2 = Utility.expandByteArray(expandByteArray, bArr.length);
        System.arraycopy(bArr, 0, expandByteArray2, 2, bArr.length);
        byte[] packageResponse = Utility.packageResponse(i, 0, expandByteArray2);
        Log.i(str, "Response PacketData for GenericHandShakeCommand to HU <<<" + Utility.hexString(packageResponse));
        sendToChannel(packageResponse);
    }

    private String getConvertedString(byte[] bArr, int i, int i2) {
        byte[] bArr2 = new byte[i2];
        for (int i3 = 0; i3 < i2; i3++) {
            bArr2[i3] = bArr[i + i3];
        }
        try {
            return new String(bArr2, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void sendToChannel(byte[] bArr) {
        ConnectionService connectionService = this.mConnectionService;
        if (connectionService != null) {
            connectionService.write(bArr);
        }
    }

    void close() {
        new Intent(mContext, (Class<?>) ConnectionService.class);
        mContext.unbindService(this.mServiceConnection);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void setUsbIOStreams(InputStream inputStream, OutputStream outputStream) {
        this.mUsbInputStream = inputStream;
        this.mUsbOutputStream = outputStream;
        if (mContext != null) {
            Intent intent = new Intent(mContext, (Class<?>) ConnectionService.class);
            initServiceConnection();
            mContext.bindService(intent, this.mServiceConnection, 1);
        }
    }

    void setBTIOStreams(InputStream inputStream, OutputStream outputStream) {
        this.mBTInputStream = inputStream;
        this.mBTOutputStream = outputStream;
        if (mContext != null) {
            mContext.bindService(new Intent(mContext, (Class<?>) ConnectionService.class), this.mServiceConnection, 1);
        }
    }

    @Override // com.harman.services.IResponseDataCallback
    public void onResponseUpdate(String str, byte[] bArr) {
        sendToChannel(bArr);
    }

    @Override // com.harman.services.IHACServiceCallback
    public void notifyData(Object obj, String str, String str2) {
        Log.i(TAG, "notifyData-" + obj);
        IHACServiceManagerCallback iHACServiceManagerCallback = this.mCallBacks;
        if (iHACServiceManagerCallback != null) {
            iHACServiceManagerCallback.notifyData(obj, str, str2);
        }
    }

    @Override // com.harman.services.IHACServiceCallback
    public Object onQuery(Object obj, String str, String str2) {
        Log.i(TAG, "onQuery-" + obj);
        IHACServiceManagerCallback iHACServiceManagerCallback = this.mCallBacks;
        if (iHACServiceManagerCallback != null) {
            return iHACServiceManagerCallback.onQuery(obj, str, str2);
        }
        return null;
    }

    @Override // com.harman.services.IHACServiceCallback
    public void didHACServiceDisconnect(JSONObject jSONObject) {
        Log.i(TAG, "didHACServiceDisconnect");
        IHACServiceManagerCallback iHACServiceManagerCallback = this.mCallBacks;
        if (iHACServiceManagerCallback != null) {
            iHACServiceManagerCallback.didHACServiceDisconnect(jSONObject);
        }
        disconnectHU();
        this.isServiceBounded = false;
    }

    public void disconnectHU() {
        Log.i(TAG, "disconnectHU");
        notifyDisconnectionToService();
        ConnectionService connectionService = this.mConnectionService;
        if (connectionService != null) {
            connectionService.setAppInitialized(false);
            this.mConnectionService.closeConnection();
        }
    }

    private void storeDebugFlag(String str) {
        try {
            boolean equalsIgnoreCase = str.equalsIgnoreCase("Debug");
            SharedPreferences.Editor edit = mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            edit.putBoolean(MapUtils.KEY_IS_DEBUG, equalsIgnoreCase);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void notifyDisconnectionToService() {
        Log.e(TAG, "notifyDisconnectionToService");
        try {
            List<String> list = this.finalSupportedServicesList;
            if (list == null || list.size() <= 0) {
                return;
            }
            for (String str : this.finalSupportedServicesList) {
                Log.i(TAG, "Service To Inform : " + str);
                IService iService = this.serviceMap.get(str);
                if (iService != null) {
                    iService.initResponseCallBack(null);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
