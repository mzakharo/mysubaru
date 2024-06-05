package com.harman.services.maps;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Process;
import android.os.StatFs;
import android.text.TextUtils;
import com.google.gson.Gson;
import com.harman.services.IAhaBinaryConstants;
import com.harman.services.IHACServiceCallback;
import com.harman.services.IOnQueryResponseCallback;
import com.harman.services.IResponseDataCallback;
import com.harman.services.IService;
import com.harman.services.Log;
import com.harman.services.Utility;
import com.harman.services.maps.CurrentMapDetails;
import com.harman.services.maps.tomtom.jni.DownloadManager;
import com.harman.services.maps.tomtom.jni.IMapServiceCallback;
import com.harman.services.maps.tomtom.jni.MapDao;
import com.harman.services.maps.tomtom.jni.MapDataBaseHelper;
import com.harman.services.maps.tomtom.jni.Native;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class MapServiceManager implements IService, IMapServiceCallback {
    private static final String REQUEST_TYPE_JSON = "application/json";
    private static final String TAG = "MapServiceManager";
    private static final String TOM_TOM_SERVICE_IDENTIFIER = "com.hac.mapService.TomTom";
    private static final int handlerType = 2;
    public static boolean isNotificationRequiredToAppForTransferProgress = false;
    private static int schedulerCount;
    private Context mContext;
    private String mDeviceCode;
    private File mMapsRootFolder;
    private String mProductCode;
    private MUDPHandler mudpHandler;
    Object availableVersionObject = new Object();
    Object startDownloadObject = new Object();
    Object downloadQueueObject = new Object();
    Object downloadQueueForHUObject = new Object();
    private IResponseDataCallback mResponseDataCallbackToHu = null;
    private IHACServiceCallback mIHACServiceCallback = null;
    private FileOutputStream mFileOutputStream = null;
    private boolean mIsAutoUpdateEnabled = false;
    private boolean mIsAutoDownloadEnabled = false;
    private String mHUModel = "Gen3.1";
    private String mapsFilePathName = null;
    private int cellularDownloadLimit = 31457280;
    private int bufferSize = 104857600;
    private File mHandlerFolder = null;
    private String handlerString = "2";
    private List<String> mDeviceCodeList = new ArrayList();
    private List<String> mProductCodeList = new ArrayList();

    @Override // com.harman.services.IService
    public void disConnectedAccessory(JSONObject jSONObject) {
    }

    @Override // com.harman.services.IService
    public byte[] processGenericCommand(byte[] bArr, int i) {
        return new byte[0];
    }

    @Override // com.harman.services.IService
    public void readDataFromFile(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback) {
    }

    @Override // com.harman.services.IService
    public Object sendRequest(Object obj, String str) {
        return null;
    }

    @Override // com.harman.services.IService
    public void writeDataIntoFile(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback) {
    }

    static /* synthetic */ int access$4608() {
        int i = schedulerCount;
        schedulerCount = i + 1;
        return i;
    }

    @Override // com.harman.services.IService
    public void initService(Context context) {
        String str = TAG;
        Log.i(str, "Map Service initialized");
        this.mContext = context;
        this.mudpHandler = new MUDPHandler();
        schedulerCount = 0;
        String absolutePath = this.mContext.getExternalFilesDir(null).getAbsolutePath();
        this.mapsFilePathName = absolutePath;
        File file = new File(createHandlerFolderStructure(absolutePath), MapUtils.MAP_ROOT_DIRECTORY_NAME);
        this.mMapsRootFolder = file;
        if (!file.exists()) {
            boolean mkdir = this.mMapsRootFolder.mkdir();
            Log.w(str, "Map Directory Creation Status:" + mkdir);
            if (mkdir) {
                File file2 = new File(this.mMapsRootFolder, MapUtils.CONFIG_FOLDER_NAME);
                if (!file2.exists()) {
                    Log.w(str, "Config Folder Creation Status:" + file2.mkdir());
                }
            }
        }
        Native.getInstance().setContext(this.mContext);
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.1
            @Override // java.lang.Runnable
            public void run() {
                MapServiceManager.this.checkStoppedDownloadAndUpdateDB();
                MapServiceManager.this.checkNewDeviceProperties();
            }
        }).start();
    }

    @Override // com.harman.services.IService
    public void checkForAutoUpdates() {
        Log.i(TAG, "checkForAutoUpdates now");
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.2
            @Override // java.lang.Runnable
            public void run() {
                MapServiceManager.this.scheduleTimerForAutoUpdateCheck();
            }
        }).start();
    }

    @Override // com.harman.services.IService
    public void initResponseCallBack(IResponseDataCallback iResponseDataCallback) {
        Log.i(TAG, "initResponseCallBack");
        this.mResponseDataCallbackToHu = iResponseDataCallback;
    }

    @Override // com.harman.services.IService
    public void initHACServiceCallback(IHACServiceCallback iHACServiceCallback) {
        Log.i(TAG, "initHACServiceCallback");
        this.mIHACServiceCallback = iHACServiceCallback;
    }

    @Override // com.harman.services.IService
    public void processGenericCommand(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback) {
        String str;
        String str2 = TAG;
        Log.i(str2, "processGenericCommand");
        short shortValue = ((Short) Utility.getIntVal(bArr, 12, 2)).shortValue();
        Log.i(str2, "GENERIC_COMMAND_LENGTH: : " + ((int) shortValue));
        if (shortValue > 0) {
            str = getConvertedString(bArr, 14, shortValue);
            Log.i(str2, "GENERIC_COMMAND_DATA: : " + str);
        } else {
            str = null;
        }
        if (str != null) {
            processGenericCommandImpl(i, str);
        }
    }

    @Override // com.harman.services.IService
    public void connectedAccessory(JSONObject jSONObject) {
        String str;
        Log.i(TAG, "connectedAccessory:" + jSONObject);
        if (jSONObject != null) {
            String optString = jSONObject.optString("deviceCode");
            if (optString != null) {
                this.mDeviceCode = optString;
            }
            String optString2 = jSONObject.optString("productCode");
            if (optString2 != null) {
                this.mProductCode = optString2;
            }
            String str2 = this.mDeviceCode;
            if (str2 == null || (str = this.mProductCode) == null) {
                return;
            }
            persistNewDeviceProperties(str, str2);
            prepareDeviceListForScheduler();
        }
    }

    @Override // com.harman.services.IService
    public void sendAsyncRequest(Object obj, String str, final IOnQueryResponseCallback iOnQueryResponseCallback) {
        String str2 = "maps";
        IHACServiceCallback iHACServiceCallback;
        try {
            str2 = TAG;
            Log.i(str2, "************************sendAsyncRequest-start**************************************");
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (str.equals("application/json")) {
            Log.i(str2, "Request Content Type is JSON and Payload:" + obj);
            final JSONObject jSONObject = (JSONObject) obj;
            String optString = jSONObject.optString("req");
            if (optString.equals("retrieveAvailableMapRegions")) {
                Log.i(str2, "Request Type is retrieveAvailableMapRegions");
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.3
                    /* JADX WARN: Type inference failed for: r2v15 */
                    /* JADX WARN: Type inference failed for: r2v6 */
                    /* JADX WARN: Type inference failed for: r2v7, types: [boolean, int] */
                    @Override // java.lang.Runnable
                    public void run() {
                        boolean z;
                        int i;
                        try {
                            if (!MapServiceManager.this.isNetworkAvailable()) {
                                Log.e(MapServiceManager.TAG, "No Network. So can't proceed retrieveAvailableMapRegions ");
                                iOnQueryResponseCallback.onErrorResponse(GenericError.NetworkFailure);
                                return;
                            }
                            if (MapServiceManager.this.mDeviceCodeList.size() == 0 || MapServiceManager.this.mProductCodeList.size() == 0) {
                                MapServiceManager.this.updateDeviceList();
                            }
                            if (MapServiceManager.this.mDeviceCodeList.size() <= 0 || MapServiceManager.this.mProductCodeList.size() <= 0) {
                                Log.e(MapServiceManager.TAG, "No HU information with mobile. So sent error");
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidDeviceCode);
                                return;
                            }
                            Log.d(MapServiceManager.TAG, "Device Code List Size: " + MapServiceManager.this.mDeviceCodeList.size());
                            JSONArray jSONArray = new JSONArray();
                            boolean r2 = false;
                            int i2 = 0;
                            while (i2 < MapServiceManager.this.mDeviceCodeList.size()) {
                                String str3 = (String) MapServiceManager.this.mDeviceCodeList.get(i2);
                                String str4 = (String) MapServiceManager.this.mProductCodeList.get(i2);
                                Log.i(MapServiceManager.TAG, "Stored Device Code:" + str3);
                                Log.i(MapServiceManager.TAG, "Stored Product Code:" + str4);
                                JSONObject entitlementAndNotify = MapServiceManager.this.getEntitlementAndNotify(str3, str4, r2);
                                if (entitlementAndNotify != null) {
                                    z = entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                                    Log.i(MapServiceManager.TAG, "Subscription Status:" + z);
                                } else {
                                    z = false;
                                }
                                if (z) {
                                    JSONObject currentMapDetailsFileFromStorageAsJSON = MapServiceManager.this.getCurrentMapDetailsFileFromStorageAsJSON(MapServiceManager.this.getMapDetailsFileID(str3, str4), str3, str4);
                                    if (currentMapDetailsFileFromStorageAsJSON != null) {
                                        CurrentMapDetails currentMapDetails = (CurrentMapDetails) new Gson().fromJson(currentMapDetailsFileFromStorageAsJSON.toString(), CurrentMapDetails.class);
                                        CurrentMapDetails.NdsProductBean ndsProductBean = currentMapDetails.getNds_product().get(r2 ? 1 : 0 );
                                        int id = ndsProductBean.getId();
                                        int baseline_id = ndsProductBean.getBaseline_id();
                                        int supplier_id = ndsProductBean.getSupplier_id();
                                        List<CurrentMapDetails.NdsUpdatePreferenceBean> nds_update_preference = currentMapDetails.getNds_update_preference();
                                        if (nds_update_preference != null && nds_update_preference.size() > 0) {
                                            ArrayList arrayList = new ArrayList();
                                            ArrayList arrayList2 = new ArrayList();
                                            ArrayList arrayList3 = new ArrayList();
                                            Log.i(MapServiceManager.TAG, "Total selected Region List Size: " + nds_update_preference.size());
                                            int i3 = 0;
                                            while (i3 < nds_update_preference.size()) {
                                                int nds_region = nds_update_preference.get(i3).getNds_region();
                                                String str5 = MapServiceManager.TAG;
                                                List<CurrentMapDetails.NdsUpdatePreferenceBean> list = nds_update_preference;
                                                StringBuilder sb = new StringBuilder();
                                                int i4 = i2;
                                                sb.append("Selected Region ID: ");
                                                sb.append(nds_region);
                                                Log.i(str5, sb.toString());
                                                int size = ndsProductBean.getNds_region().size();
                                                if (nds_region != 0 && size > 0) {
                                                    int i5 = 0;
                                                    while (true) {
                                                        if (i5 >= size) {
                                                            break;
                                                        }
                                                        if (nds_region == ndsProductBean.getNds_region().get(i5).getId()) {
                                                            arrayList.add(Integer.valueOf(ndsProductBean.getNds_region().get(i5).getId()));
                                                            arrayList2.add(ndsProductBean.getNds_region().get(i5).getName());
                                                            arrayList3.add(Integer.valueOf(ndsProductBean.getNds_region().get(i5).getVersion_id()));
                                                            break;
                                                        }
                                                        i5++;
                                                    }
                                                }
                                                i3++;
                                                nds_update_preference = list;
                                                i2 = i4;
                                            }
                                            i = i2;
                                            if (arrayList.size() <= 0) {
                                                Log.e(MapServiceManager.TAG, "No region selected");
                                                jSONArray.put(MapServiceManager.this.getResponseForRetrieveAvailableVersion(str3, str4, GenericError.InvalidRegion));
                                            } else {
                                                MapServiceManager mapServiceManager = MapServiceManager.this;
                                                if (mapServiceManager.getCatalogueForProduct(supplier_id, baseline_id, id, mapServiceManager.getTomTomURI(), MapServiceManager.this.getTomTomApiKey())) {
                                                    Log.i(MapServiceManager.TAG, "Region selection is available.So proceed with checkForUpdate");
                                                    JSONObject allAvailableMapVersion = MapServiceManager.this.getAllAvailableMapVersion(str3, str4, supplier_id, baseline_id, id, arrayList, arrayList3, 0, true, currentMapDetails);
                                                    if (allAvailableMapVersion == null) {
                                                        Log.e(MapServiceManager.TAG, "getAllAvailableVersion failure response received");
                                                        jSONArray.put(MapServiceManager.this.getResponseForRetrieveAvailableVersion(str3, str4, GenericError.GenericError));
                                                    } else {
                                                        Log.e(MapServiceManager.TAG, "getAllAvailableVersion success response received");
                                                        jSONArray.put(allAvailableMapVersion);
                                                    }
                                                } else {
                                                    Log.e(MapServiceManager.TAG, "getAllAvailableVersion catalogue file request failed ");
                                                    jSONArray.put(MapServiceManager.this.getResponseForRetrieveAvailableVersion(str3, str4, GenericError.GenericError));
                                                }
                                            }
                                        }
                                    }
                                    i = i2;
                                } else {
                                    i = i2;
                                    Log.e(MapServiceManager.TAG, "Subscription is expired. So sent error response to App");
                                    jSONArray.put(MapServiceManager.this.getResponseForRetrieveAvailableVersion(str3, str4, GenericError.MapSubscriptionExpired));
                                }
                                i2 = i + 1;
                                r2 = false;
                            }
                            if (jSONArray.length() > 0) {
                                Log.i(MapServiceManager.TAG, "Success Response to App");
                                JSONObject jSONObject2 = new JSONObject();
                                jSONObject2.put("resp", "retrieveAvailableMapRegions");
                                jSONObject2.put("respCode", 0);
                                jSONObject2.put("data", jSONArray);
                                iOnQueryResponseCallback.onSuccessResponse(jSONObject2, "application/json", "com.hac.mapService.TomTom");
                                return;
                            }
                            Log.e(MapServiceManager.TAG, "Something went wrong !");
                            iOnQueryResponseCallback.onErrorResponse(GenericError.GenericError);
                        } catch (Exception e2) {
                            e2.printStackTrace();
                            Log.e(MapServiceManager.TAG, "Exception in retrieveAvailableMapRegions : " + e2);
                            iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                        }
                    }
                }).start();
            } else if (optString.equals("startDownload")) {
                Log.i(str2, "Request Type is startDownload");
                if (!isLibrariesLoaded()) {
                    return;
                } else {
                    new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.4
                        /* JADX WARN: Multi-variable type inference failed */
                        /* JADX WARN: Removed duplicated region for block: B:72:0x021a A[Catch: Exception -> 0x02ff, TryCatch #0 {Exception -> 0x02ff, blocks: (B:3:0x0006, B:5:0x000e, B:7:0x0014, B:8:0x002c, B:10:0x0032, B:12:0x0038, B:17:0x0070, B:20:0x00aa, B:24:0x00dd, B:26:0x00e3, B:27:0x0158, B:35:0x016c, B:36:0x0181, B:40:0x02bd, B:52:0x012b, B:53:0x0138, B:54:0x0146, B:55:0x019f, B:69:0x01f8, B:70:0x0212, B:72:0x021a, B:73:0x0271, B:81:0x027f, B:83:0x0293, B:85:0x029e, B:87:0x0230, B:89:0x0244, B:91:0x0266, B:93:0x0205, B:94:0x02a9, B:98:0x02c6, B:100:0x02ce, B:103:0x02dd, B:105:0x02ee), top: B:2:0x0006 }] */
                        /* JADX WARN: Removed duplicated region for block: B:75:0x0276  */
                        /* JADX WARN: Removed duplicated region for block: B:85:0x029e A[Catch: Exception -> 0x02ff, TryCatch #0 {Exception -> 0x02ff, blocks: (B:3:0x0006, B:5:0x000e, B:7:0x0014, B:8:0x002c, B:10:0x0032, B:12:0x0038, B:17:0x0070, B:20:0x00aa, B:24:0x00dd, B:26:0x00e3, B:27:0x0158, B:35:0x016c, B:36:0x0181, B:40:0x02bd, B:52:0x012b, B:53:0x0138, B:54:0x0146, B:55:0x019f, B:69:0x01f8, B:70:0x0212, B:72:0x021a, B:73:0x0271, B:81:0x027f, B:83:0x0293, B:85:0x029e, B:87:0x0230, B:89:0x0244, B:91:0x0266, B:93:0x0205, B:94:0x02a9, B:98:0x02c6, B:100:0x02ce, B:103:0x02dd, B:105:0x02ee), top: B:2:0x0006 }] */
                        /* JADX WARN: Removed duplicated region for block: B:87:0x0230 A[Catch: Exception -> 0x02ff, TryCatch #0 {Exception -> 0x02ff, blocks: (B:3:0x0006, B:5:0x000e, B:7:0x0014, B:8:0x002c, B:10:0x0032, B:12:0x0038, B:17:0x0070, B:20:0x00aa, B:24:0x00dd, B:26:0x00e3, B:27:0x0158, B:35:0x016c, B:36:0x0181, B:40:0x02bd, B:52:0x012b, B:53:0x0138, B:54:0x0146, B:55:0x019f, B:69:0x01f8, B:70:0x0212, B:72:0x021a, B:73:0x0271, B:81:0x027f, B:83:0x0293, B:85:0x029e, B:87:0x0230, B:89:0x0244, B:91:0x0266, B:93:0x0205, B:94:0x02a9, B:98:0x02c6, B:100:0x02ce, B:103:0x02dd, B:105:0x02ee), top: B:2:0x0006 }] */
                        /* JADX WARN: Type inference failed for: r6v1 */
                        /* JADX WARN: Type inference failed for: r6v2, types: [boolean, int] */
                        /* JADX WARN: Type inference failed for: r6v3 */
                        @Override // java.lang.Runnable
                        /*
                            Code decompiled incorrectly, please refer to instructions dump.
                            To view partially-correct code enable 'Show inconsistent code' option in preferences
                        */
                        public void run() {
                            /*
                                Method dump skipped, instructions count: 803
                                To view this dump change 'Code comments level' option to 'DEBUG'
                            */
                            throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.AnonymousClass4.run():void");
                        }
                    }).start();
                }
            } else if (optString.equals("cancelDownload")) {
                Log.i(str2, "Request Type is cancelDownload");
                if (!isLibrariesLoaded()) {
                    return;
                } else {
                    new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.5
                        @Override // java.lang.Runnable
                        public void run() {
                            try {
                                JSONArray optJSONArray = jSONObject.optJSONArray("data");
                                if (optJSONArray == null || optJSONArray.length() <= 0) {
                                    Log.e(MapServiceManager.TAG, "Cancel Download Failure");
                                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                    return;
                                }
                                JSONArray jSONArray = new JSONArray();
                                for (int i = 0; i < optJSONArray.length(); i++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                                    if (optJSONObject != null) {
                                        String optString2 = optJSONObject.optString("deviceCode");
                                        String optString3 = optJSONObject.optString("productCode");
                                        int optInt = optJSONObject.optInt("productID");
                                        jSONArray.put(Native.getInstance().cancelDownload(optString2, optString3, MapServiceManager.this.mHUModel, optJSONObject.optInt("supplierID"), optJSONObject.optInt("baselineID"), optInt, optJSONObject.optInt("regionID"), optJSONObject.optInt("fromVersion"), optJSONObject.optInt("toVersion")));
                                    }
                                }
                                if (jSONArray.length() <= 0) {
                                    Log.e(MapServiceManager.TAG, "Cancel Download invalid Request");
                                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                    return;
                                }
                                JSONObject jSONObject2 = new JSONObject();
                                jSONObject2.put("resp", "cancelDownload");
                                jSONObject2.put("respCode", 0);
                                jSONObject2.put("data", jSONArray);
                                iOnQueryResponseCallback.onSuccessResponse(jSONObject2, "application/json", "com.hac.mapService.TomTom");
                            } catch (Exception e2) {
                                e2.printStackTrace();
                                Log.e(MapServiceManager.TAG, "Exception in Start Download : " + e2);
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                            }
                        }
                    }).start();
                }
            } else if (optString.equals(MapUtils.REQ_DELETE_REGION_FILES)) {
                Log.i(str2, "Request Type is deleteRegionFiles");
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.6
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            JSONArray optJSONArray = jSONObject.optJSONArray("data");
                            JSONObject jSONObject2 = new JSONObject();
                            jSONObject2.put("resp", MapUtils.REQ_DELETE_REGION_FILES);
                            jSONObject2.put("respCode", 0);
                            JSONArray jSONArray = new JSONArray();
                            if (optJSONArray == null || optJSONArray.length() <= 0) {
                                Log.e(MapServiceManager.TAG, "deleteRegionFiles invalid parameter");
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                return;
                            }
                            for (int i = 0; i < optJSONArray.length(); i++) {
                                JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                                if (optJSONObject != null) {
                                    String optString2 = optJSONObject.optString("deviceCode");
                                    String optString3 = optJSONObject.optString("productCode");
                                    int optInt = optJSONObject.optInt("productID");
                                    jSONArray.put(MapServiceManager.this.deleteRegionFilesFromApp(optString2, optString3, optJSONObject.optInt("supplierID"), optJSONObject.optInt("baselineID"), optInt, optJSONObject.optInt("regionID")));
                                }
                            }
                            jSONObject2.put("data", jSONArray);
                            iOnQueryResponseCallback.onSuccessResponse(jSONObject2, "application/json", "com.hac.mapService.TomTom");
                        } catch (Exception e2) {
                            e2.printStackTrace();
                            Log.e(MapServiceManager.TAG, "Exception in deleteRegionFiles:" + e2);
                            iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                        }
                    }
                }).start();
            } else {
                if (optString.equals("informAutoDownloadStatus")) {
                    Log.i(str2, "Request Type is informAutoDownloadStatus");
                    try {
                        this.mIsAutoDownloadEnabled = jSONObject.optBoolean("status");
                        Log.i(str2, "AutoDownload Status:" + this.mIsAutoDownloadEnabled);
                        JSONObject jSONObject2 = new JSONObject();
                        jSONObject2.put("resp", "informAutoDownloadStatus");
                        jSONObject2.put("respCode", 0);
                        jSONObject2.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject2, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e2) {
                        e2.printStackTrace();
                        Log.e(TAG, "Exception in Inform Auto Download Status:" + e2);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("informAutoUpdateStatus")) {
                    Log.i(str2, "Request Type is informAutoUpdateStatus");
                    if (!isLibrariesLoaded()) {
                        return;
                    }
                    try {
                        boolean optBoolean = jSONObject.optBoolean("status");
                        this.mIsAutoUpdateEnabled = optBoolean;
                        if (optBoolean) {
                            new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.7
                                @Override // java.lang.Runnable
                                public void run() {
                                    Log.i(MapServiceManager.TAG, "Try to download if version is available");
                                    MapServiceManager.this.doAutoUpdate();
                                }
                            }).start();
                        }
                        JSONObject jSONObject3 = new JSONObject();
                        jSONObject3.put("resp", "informAutoUpdateStatus");
                        jSONObject3.put("respCode", 0);
                        jSONObject3.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject3, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e3) {
                        e3.printStackTrace();
                        Log.e(TAG, "Exception in Inform Auto Update Status:" + e3);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("mapSubscriptionDetails")) {
                    Log.i(str2, "Request Type is mapSubscriptionDetails");
                    new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.8
                        @Override // java.lang.Runnable
                        public void run() {
                            try {
                                JSONArray optJSONArray = jSONObject.optJSONArray("data");
                                if (optJSONArray == null || optJSONArray.length() <= 0) {
                                    Log.e(MapServiceManager.TAG, "Invalid Request for mapSubscriptionDetails");
                                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                    return;
                                }
                                JSONArray jSONArray = new JSONArray();
                                for (int i = 0; i < optJSONArray.length(); i++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                                    JSONObject subscriptionStatus = MapServiceManager.this.getSubscriptionStatus(optJSONObject.optString("deviceCode"), optJSONObject.optString("productCode"));
                                    if (subscriptionStatus != null) {
                                        jSONArray.put(subscriptionStatus);
                                    }
                                }
                                if (jSONArray.length() <= 0) {
                                    Log.e(MapServiceManager.TAG, "Some Problem in mapSubscriptionDetails:");
                                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                    return;
                                }
                                JSONObject jSONObject4 = new JSONObject();
                                jSONObject4.put("resp", "mapSubscriptionDetails");
                                jSONObject4.put("respCode", 0);
                                jSONObject4.put("data", jSONArray);
                                iOnQueryResponseCallback.onSuccessResponse(jSONObject4, "application/json", "com.hac.mapService.TomTom");
                            } catch (Exception e4) {
                                e4.printStackTrace();
                                Log.e(MapServiceManager.TAG, "Exception in mapSubscriptionDetails:" + e4);
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                            }
                        }
                    }).start();
                } else if (optString.equals("informNetworkStatus")) {
                    Log.i(str2, "Request Type is informNetworkStatus");
                    try {
                        boolean optBoolean2 = jSONObject.optBoolean("status");
                        Log.i(str2, "Network Status:" + optBoolean2);
                        Log.i(str2, "Network Mode:" + jSONObject.optInt("mode"));
                        if (optBoolean2) {
                            new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.9
                                @Override // java.lang.Runnable
                                public void run() {
                                    Log.d(MapServiceManager.TAG, "Process Network Operation");
                                }
                            }).start();
                        }
                        JSONObject jSONObject4 = new JSONObject();
                        jSONObject4.put("resp", "informNetworkStatus");
                        jSONObject4.put("respCode", 0);
                        jSONObject4.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject4, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e4) {
                        e4.printStackTrace();
                        Log.e(TAG, "Exception in Inform Auto Download Status:" + e4);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("accessoryFileTransferProgress")) {
                    Log.i(str2, "Request Type is accessoryFileTransferProgress");
                    try {
                        isNotificationRequiredToAppForTransferProgress = jSONObject.optBoolean("notifyStatus");
                        Log.i(str2, "accessoryFileTransferProgress status: " + isNotificationRequiredToAppForTransferProgress);
                        JSONObject jSONObject5 = new JSONObject();
                        jSONObject5.put("resp", "accessoryFileTransferProgress");
                        jSONObject5.put("respCode", 0);
                        jSONObject5.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject5, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e5) {
                        e5.printStackTrace();
                        Log.e(TAG, "Exception in accessoryFileTransferProgress:" + e5);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("removeDevices")) {
                    Log.i(str2, "Request Type is removeDevices");
                    new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.10
                        @Override // java.lang.Runnable
                        public void run() {
                            try {
                                JSONArray optJSONArray = jSONObject.optJSONArray("data");
                                if (optJSONArray == null || optJSONArray.length() <= 0) {
                                    Log.e(MapServiceManager.TAG, "Invalid Request for removeDevices");
                                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                                    return;
                                }
                                JSONArray jSONArray = new JSONArray();
                                for (int i = 0; i < optJSONArray.length(); i++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                                    JSONObject removeDevices = MapServiceManager.this.removeDevices(optJSONObject.optString("deviceCode"), optJSONObject.optString("productCode"));
                                    if (removeDevices != null) {
                                        jSONArray.put(removeDevices);
                                    }
                                }
                                if (jSONArray.length() > 0) {
                                    Log.i(MapServiceManager.TAG, "Success response for Remove Devices");
                                    JSONObject jSONObject6 = new JSONObject();
                                    jSONObject6.put("resp", "removeDevices");
                                    jSONObject6.put("respCode", 0);
                                    jSONObject6.put("data", jSONArray);
                                    iOnQueryResponseCallback.onSuccessResponse(jSONObject6, "application/json", "com.hac.mapService.TomTom");
                                    return;
                                }
                                Log.e(MapServiceManager.TAG, "Some Problem in removeDevices:");
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                            } catch (Exception e6) {
                                e6.printStackTrace();
                                Log.e(MapServiceManager.TAG, "Exception in removeDevices:" + e6);
                                iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                            }
                        }
                    }).start();
                } else if (optString.equals("stopAhaService")) {
                    Log.i(str2, "Request Type is Stop AHa Service");
                    try {
                        boolean optBoolean3 = jSONObject.optBoolean("status");
                        Log.i(str2, "Stop Aha Service status: " + optBoolean3);
                        if (optBoolean3 && (iHACServiceCallback = this.mIHACServiceCallback) != null) {
                            iHACServiceCallback.didHACServiceDisconnect(new JSONObject());
                        }
                        JSONObject jSONObject6 = new JSONObject();
                        jSONObject6.put("resp", "stopAhaService");
                        jSONObject6.put("respCode", 0);
                        jSONObject6.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject6, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e6) {
                        e6.printStackTrace();
                        Log.e(TAG, "Exception in Stop Aha Service:" + e6);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("clearData")) {
                    Log.i(str2, "Request Type is Clear Data");
                    try {
                        boolean optBoolean4 = jSONObject.optBoolean("status");
                        Log.i(str2, "Clear Data status: " + optBoolean4);
                        if (optBoolean4 && this.mMapsRootFolder.exists()) {
                            Log.i(str2, "Map Root folder exists. Hence delete all files");
                            deleteRecursive(this.mMapsRootFolder);
                            MapDataBaseHelper.getsInstance().deleteByModel(this.mHUModel);
                            Log.i(str2, "File is deleted. Create empty folder structure again");
                            recreatedFolderStructure();
                        }
                        JSONObject jSONObject7 = new JSONObject();
                        jSONObject7.put("resp", "clearData");
                        jSONObject7.put("respCode", 0);
                        jSONObject7.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject7, "application/json", "com.hac.mapService.TomTom");
                    } catch (Exception e7) {
                        e7.printStackTrace();
                        Log.e(TAG, "Exception in Clear Data: " + e7);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else if (optString.equals("killAhaService")) {
                    Log.i(str2, "Request Type is Kill Aha Service");
                    try {
                        boolean optBoolean5 = jSONObject.optBoolean("status");
                        Log.i(str2, "Kill Aha Service status: " + optBoolean5);
                        JSONObject jSONObject8 = new JSONObject();
                        jSONObject8.put("resp", "killAhaService");
                        jSONObject8.put("respCode", 0);
                        jSONObject8.put("status", "Ok");
                        iOnQueryResponseCallback.onSuccessResponse(jSONObject8, "application/json", "com.hac.mapService.TomTom");
                        if (optBoolean5) {
                            Log.i(str2, "Kill Aha Service");
                            Process.killProcess(Process.myPid());
                        }
                    } catch (Exception e8) {
                        e8.printStackTrace();
                        Log.e(TAG, "Exception in Kill Aha Service:" + e8);
                        iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                    }
                } else {
                    Log.e(str2, "SDK not able to identify app request");
                    iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
                }
                //e.printStackTrace();
            }
        } else {
            Log.e(str2, "SDK handled only JSON request");
            iOnQueryResponseCallback.onErrorResponse(GenericError.InvalidParameter);
        }
        Log.i(TAG, "************************sendAsyncRequest-end**************************************");
    }

    private boolean isLibrariesLoaded() {
        try {
            HashSet<String> hashSet = new HashSet();
            BufferedReader bufferedReader = new BufferedReader(new FileReader("/proc/" + Process.myPid() + "/maps"));
            while (true) {
                String readLine = bufferedReader.readLine();
                if (readLine == null) {
                    break;
                }
                if (readLine.endsWith(".so")) {
                    hashSet.add(readLine.substring(readLine.lastIndexOf(" ") + 1));
                }
            }
            for (String str : hashSet) {
                if (str.contains(this.mContext.getPackageName())) {
                    Log.d(TAG, "library loaded for this app: " + str);
                }
                if (str.contains("libtomjni4.so") || str.contains("libtomjni5.so")) {
                    Log.d(TAG, "library loaded: " + str);
                    return true;
                }
            }
        } catch (FileNotFoundException e) {
            Log.d(TAG, e.getMessage());
        } catch (IOException e2) {
            Log.d(TAG, e2.getMessage());
        }
        String str2 = TAG;
        Log.e(str2, "libraries are not loaded");
        String string = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getString(MapUtils.KEY_LIBRARY_TYPE, "");
        Log.e(str2, "libraryType: " + string);
        if (string != null && !string.equals("")) {
            if (string.equals(MapUtils.PREF_LIBRARY_TYPE_GEN4)) {
                Native.getInstance().loadLibraries(true);
                return true;
            }
            if (string.equals(MapUtils.PREF_LIBRARY_TYPE_GEN5)) {
                Native.getInstance().loadLibraries(false);
                return true;
            }
        }
        return false;
    }

    private void recreatedFolderStructure() {
        String str = TAG;
        Log.i(str, "recreatedFolderStructure");
        try {
            File file = new File(createHandlerFolderStructure(this.mapsFilePathName), MapUtils.MAP_ROOT_DIRECTORY_NAME);
            this.mMapsRootFolder = file;
            if (file.exists()) {
                return;
            }
            boolean mkdir = this.mMapsRootFolder.mkdir();
            Log.w(str, "recreatedFolderStructure: Map Directory Creation Status:" + mkdir);
            if (mkdir) {
                File file2 = new File(this.mMapsRootFolder, MapUtils.CONFIG_FOLDER_NAME);
                if (file2.exists()) {
                    return;
                }
                Log.w(str, "recreatedFolderStructure: Config Folder Creation Status:" + file2.mkdir());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void addPartialDownloadForHU(final JSONObject jSONObject, final String str, final String str2, final int i, final int i2, final int i3, final int i4, final int i5, final int i6, final int i7) {
        Log.i(TAG, "addPartialDownloadForHU:" + jSONObject);
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.11
            @Override // java.lang.Runnable
            public void run() {
                Log.i(MapServiceManager.TAG, "Partial Download Operation is scheduled ");
                Context context = MapServiceManager.this.mContext;
                Context unused = MapServiceManager.this.mContext;
                SharedPreferences.Editor edit = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(MapServiceManager.this.getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 1);
                edit.commit();
                MapServiceManager.this.processPartialDownloadForHU(jSONObject, str, str2, i, i2, i3, i4, i5, i6, i7);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processPartialDownloadForHU(JSONObject jSONObject, String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        int i8;
        String str3 = TAG;
        Log.d(str3, "processPartialDownloadForHU");
        try {
            synchronized (this.downloadQueueForHUObject) {
                Log.d(str3, "processPartialDownloadForHU: download operation started for region id: " + i5);
                int i9 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 0);
                Log.i(str3, "Download Status from Storage: " + i9);
                if (i9 == 5) {
                    Log.e(str3, "Don't process the download as it's cancelled by user when it's in queue: " + i5);
                    return;
                }
                SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(getCombinedDetailsForPartialUpdateFromVersion(str2, str, i5), i6);
                edit.commit();
                edit.putInt(getCombinedDetailsForPartialUpdateToVersion(str2, str, i5), i7);
                edit.commit();
                int downloadPartialRegionFile = downloadPartialRegionFile(str, str2, i2, i3, i4, i5, i6, 0);
                if (downloadPartialRegionFile == 3) {
                    Log.i(str3, "UnInstall Package downloaded");
                    i8 = 3;
                    downloadPartialRegionFile = downloadRegionFile(str, str2, i2, i3, i4, i5, 0, i7);
                } else {
                    i8 = 3;
                }
                int i10 = downloadPartialRegionFile;
                if (i10 != i8) {
                    JSONObject jSONObject2 = new JSONObject();
                    jSONObject2.put("notify", "regionsDownloadProgress");
                    JSONArray jSONArray = new JSONArray();
                    jSONObject.put("status", i10);
                    jSONObject.put("progress", 0);
                    jSONArray.put(jSONObject);
                    jSONObject2.put("data", jSONArray);
                    String jSONObject3 = jSONObject2.toString();
                    Log.i(str3, "Partial Download progress notification to HU because something went wrong:" + jSONObject3);
                    sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
                    notifyDownloadStatusToApp(i10, str, str2, i4, i2, i3, i5, i6, i7);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void addDownloadForHU(final JSONObject jSONObject, final String str, final String str2, final int i, final int i2, final int i3, final int i4, final int i5, final int i6, final int i7) {
        Log.i(TAG, "addDownloadForHU:" + jSONObject);
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.12
            @Override // java.lang.Runnable
            public void run() {
                Log.i(MapServiceManager.TAG, "addDownloadForHU:Download Operation is scheduled ");
                Context context = MapServiceManager.this.mContext;
                Context unused = MapServiceManager.this.mContext;
                SharedPreferences.Editor edit = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(MapServiceManager.this.getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 1);
                edit.commit();
                MapServiceManager.this.processDownloadForHU(jSONObject, str, str2, i, i2, i3, i4, i5, i6, i7);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processDownloadForHU(JSONObject jSONObject, String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        int i8;
        int downloadRegionFile;
        String str3 = TAG;
        Log.d(str3, "processDownloadForHU");
        try {
            synchronized (this.downloadQueueForHUObject) {
                Log.d(str3, "processDownloadForHU: download operation started for region id: " + i5);
                int i9 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 0);
                Log.i(str3, "Download Status from Storage: " + i9);
                if (i9 == 5) {
                    Log.e(str3, "Don't process the download as it's cancelled by user when it's in queue: " + i5);
                    return;
                }
                if (i == 15) {
                    i8 = 3;
                    downloadRegionFile = generateLicenceFile(str, str2, i2, i3, i4, i5, i6, i7) ? 3 : 15;
                } else {
                    i8 = 3;
                    downloadRegionFile = downloadRegionFile(str, str2, i2, i3, i4, i5, i6, i7);
                }
                if (downloadRegionFile != i8) {
                    JSONObject jSONObject2 = new JSONObject();
                    jSONObject2.put("notify", "regionsDownloadProgress");
                    JSONArray jSONArray = new JSONArray();
                    jSONObject.put("status", downloadRegionFile);
                    jSONObject.put("progress", 0);
                    jSONArray.put(jSONObject);
                    jSONObject2.put("data", jSONArray);
                    String jSONObject3 = jSONObject2.toString();
                    Log.i(str3, "Download progress notification to HU because something went wrong:" + jSONObject3);
                    sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
                    notifyDownloadStatusToApp(downloadRegionFile, str, str2, i4, i2, i3, i5, i6, i7);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void addDownloadForApp(final String str, final String str2, final int i, final int i2, final int i3, final int i4, final int i5, final int i6, final int i7) {
        Log.i(TAG, "addDownloadForApp");
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.13
            @Override // java.lang.Runnable
            public void run() {
                Log.i(MapServiceManager.TAG, "addDownloadForApp: Download Operation is scheduled ");
                Context context = MapServiceManager.this.mContext;
                Context unused = MapServiceManager.this.mContext;
                SharedPreferences.Editor edit = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(MapServiceManager.this.getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 1);
                edit.commit();
                MapServiceManager.this.processDownloadForApp(str, str2, i, i2, i3, i4, i5, i6, i7);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processDownloadForApp(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        int i8 = 0;
        int downloadRegionFile;
        String str3 = TAG;
        Log.d(str3, "processDownloadForApp");
        synchronized (this.downloadQueueObject) {
            try {
                Log.d(str3, "processDownloadForApp: download operation started : " + i5);
                i8 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 0);
                Log.i(str3, "Download Status from Storage: " + i8);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (i8 == 5) {
                Log.e(str3, "Don't process the download as it's cancelled by user when it's in queue: " + i5);
                return;
            }
            if (i == 15) {
                downloadRegionFile = generateLicenceFile(str, str2, i2, i3, i4, i5, i6, i7) ? 3 : 15;
            } else {
                downloadRegionFile = downloadRegionFile(str, str2, i2, i3, i4, i5, i6, i7);
            }
            if (downloadRegionFile != 3) {
                notifyDownloadStatusToApp(downloadRegionFile, str, str2, i4, i2, i3, i5, i6, i7);
            } else {
                Log.i(str3, "Download completed successfully. Notification will be triggered from other place");
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void addPartialDownloadForApp(final JSONObject jSONObject, final String str, final String str2, final int i, final int i2, final int i3, final int i4, final int i5, final int i6, final int i7) {
        Log.i(TAG, "addPartialDownloadForApp:" + jSONObject);
        new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.14
            @Override // java.lang.Runnable
            public void run() {
                Log.i(MapServiceManager.TAG, "addPartialDownloadForApp: Partial Download Operation is scheduled ");
                Context context = MapServiceManager.this.mContext;
                Context unused = MapServiceManager.this.mContext;
                SharedPreferences.Editor edit = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(MapServiceManager.this.getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 1);
                edit.commit();
                MapServiceManager.this.processPartialDownloadForApp(jSONObject, str, str2, i, i2, i3, i4, i5, i6, i7);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processPartialDownloadForApp(JSONObject jSONObject, String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        int i8;
        String str3 = TAG;
        Log.d(str3, "processPartialDownloadForApp");
        try {
            synchronized (this.downloadQueueObject) {
                Log.d(str3, "processPartialDownloadForApp: download operation started for region id: " + i5);
                int i9 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 0);
                Log.i(str3, "Download Status from Storage: " + i9);
                if (i9 == 5) {
                    Log.e(str3, "Don't process the download as it's cancelled by user when it's in queue: " + i5);
                    return;
                }
                SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(getCombinedDetailsForPartialUpdateFromVersion(str2, str, i5), i6);
                edit.commit();
                edit.putInt(getCombinedDetailsForPartialUpdateToVersion(str2, str, i5), i7);
                edit.commit();
                int downloadPartialRegionFile = downloadPartialRegionFile(str, str2, i2, i3, i4, i5, i6, 0);
                if (downloadPartialRegionFile == 3) {
                    Log.i(str3, "UnInstall Package downloaded");
                    i8 = 3;
                    downloadPartialRegionFile = downloadRegionFile(str, str2, i2, i3, i4, i5, 0, i7);
                } else {
                    i8 = 3;
                }
                int i10 = downloadPartialRegionFile;
                if (i10 != i8) {
                    notifyDownloadStatusToApp(i10, str, str2, i4, i2, i3, i5, i6, i7);
                } else {
                    Log.i(str3, "Download completed successfully. Notification will be triggered from other place");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isDownloadCancelled(String str, String str2, int i) {
        try {
            int i2 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str, str2, i), 0);
            String str3 = TAG;
            Log.i(str3, "Download Status from Storage: " + i2);
            if (i2 == 5) {
                Log.e(str3, "Don't process the download as it's cancelled by user when it's in queue: " + i);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private String createHandlerFolderStructure(String str) {
        String absolutePath;
        try {
            File file = new File(str, this.handlerString);
            this.mHandlerFolder = file;
            if (!file.exists()) {
                boolean mkdir = this.mHandlerFolder.mkdir();
                Log.w(TAG, "Handler Directory Creation Status:" + mkdir);
                absolutePath = this.mHandlerFolder.getAbsolutePath();
            } else {
                absolutePath = this.mHandlerFolder.getAbsolutePath();
            }
            return absolutePath;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void doSyncCurrentMapDetails(String str, String str2, CurrentMapDetails currentMapDetails) {
        String str3 = TAG;
        Log.i(str3, "doSyncCurrentMapDetails");
        try {
            CurrentMapDetails.NdsProductBean ndsProductBean = currentMapDetails.getNds_product().get(0);
            int id = ndsProductBean.getId();
            int baseline_id = ndsProductBean.getBaseline_id();
            int supplier_id = ndsProductBean.getSupplier_id();
            List<CurrentMapDetails.NdsUpdatePreferenceBean> nds_update_preference = currentMapDetails.getNds_update_preference();
            if (nds_update_preference == null || nds_update_preference.size() <= 0) {
                return;
            }
            ArrayList arrayList = new ArrayList();
            ArrayList arrayList2 = new ArrayList();
            ArrayList arrayList3 = new ArrayList();
            Log.i(str3, "Total selected Region List Size: " + nds_update_preference.size());
            for (int i = 0; i < nds_update_preference.size(); i++) {
                int nds_region = nds_update_preference.get(i).getNds_region();
                Log.i(TAG, "Selected Region ID: " + nds_region);
                int size = ndsProductBean.getNds_region().size();
                if (nds_region != 0 && size > 0) {
                    int i2 = 0;
                    while (true) {
                        if (i2 >= size) {
                            break;
                        }
                        if (nds_region == ndsProductBean.getNds_region().get(i2).getId()) {
                            arrayList.add(Integer.valueOf(ndsProductBean.getNds_region().get(i2).getId()));
                            arrayList2.add(ndsProductBean.getNds_region().get(i2).getName());
                            arrayList3.add(Integer.valueOf(ndsProductBean.getNds_region().get(i2).getVersion_id()));
                            break;
                        }
                        i2++;
                    }
                }
            }
            if (arrayList.size() > 0) {
                Log.i(TAG, "Region selection is available.So proceed with checkForUpdate");
                checkUpdateForHUSelection(str, str2, supplier_id, baseline_id, id, arrayList, arrayList3, currentMapDetails);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void deleteAlreadyTransferredFiles(String str, String str2, CurrentMapDetails currentMapDetails) {
        String str3 = TAG;
        Log.i(str3, "deleteAlreadyTransferredFiles");
        try {
            List<MapDao> allTransferredList = MapDataBaseHelper.getsInstance().getAllTransferredList(str, str2, 3, 3, this.mHUModel);
            Log.d(str3, "Transfer Completed list size:" + allTransferredList.size());
            if (allTransferredList == null || allTransferredList.size() <= 0) {
                return;
            }
            for (MapDao mapDao : allTransferredList) {
                int regionId = mapDao.getRegionId();
                int toVersion = mapDao.getToVersion();
                String str4 = TAG;
                Log.i(str4, "Version In DB : " + toVersion + " for Region ID : " + regionId);
                int currentVersionByRegionId = getCurrentVersionByRegionId(currentMapDetails, regionId);
                StringBuilder sb = new StringBuilder();
                sb.append("Latest HU version: ");
                sb.append(currentVersionByRegionId);
                Log.i(str4, sb.toString());
                if (currentVersionByRegionId >= toVersion) {
                    Log.e(str4, "HU is updated with latest version. Hence delete the region files in mobile");
                    MapDataBaseHelper.getsInstance().deleteRowByRegionInfo(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), this.mHUModel, mapDao.getProductId(), mapDao.getBaseLineId(), mapDao.getSupplierId(), mapDao.getRegionId(), mapDao.getFromVersion(), mapDao.getToVersion());
                    deleteRegionFilesWithoutResponse(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), mapDao.getSupplierId(), mapDao.getBaseLineId(), mapDao.getProductId(), mapDao.getRegionId());
                    if (checkRegionMetaDataFileIsAvailableInMobile(str, str2, this.mMapsRootFolder.getAbsolutePath(), String.valueOf(regionId) + ".json")) {
                        String str5 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
                        Log.i(str4, "Meta data file is available. So delete the region file:" + str5);
                        deleteFiles(str5, String.valueOf(regionId) + ".json");
                    } else {
                        Log.e(str4, "Region Meta Data File is not available in storage: " + regionId);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void deleteUnSelectedRegionFiles(String str, String str2, CurrentMapDetails currentMapDetails) {
        String str3 = TAG;
        Log.i(str3, "deleteUnSelectedRegionFiles");
        try {
            List<MapDao> all = MapDataBaseHelper.getsInstance().getAll(str, str2, 3, this.mHUModel);
            Log.d(str3, "Download Completed list size for Gen3.1:" + all.size());
            if (all == null || all.size() <= 0) {
                return;
            }
            for (MapDao mapDao : all) {
                int regionId = mapDao.getRegionId();
                String str4 = TAG;
                Log.i(str4, "Download Completed Region Id: " + regionId);
                if (isRegionSelectedInPreference(regionId, currentMapDetails)) {
                    Log.e(str4, "Region is selected. So no need to delete the files : " + regionId);
                } else {
                    Log.i(str4, "Region is downloaded. But region changed in HU. Hence delete the region files.");
                    MapDataBaseHelper.getsInstance().deleteRowByRegionInfo(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), this.mHUModel, mapDao.getProductId(), mapDao.getBaseLineId(), mapDao.getSupplierId(), mapDao.getRegionId(), mapDao.getFromVersion(), mapDao.getToVersion());
                    deleteRegionFilesWithoutResponse(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), mapDao.getSupplierId(), mapDao.getBaseLineId(), mapDao.getProductId(), mapDao.getRegionId());
                    if (checkRegionMetaDataFileIsAvailableInMobile(str, str2, this.mMapsRootFolder.getAbsolutePath(), String.valueOf(regionId) + ".json")) {
                        String str5 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
                        Log.i(str4, "Meta data file is available. Delete the region file:" + str5);
                        deleteFiles(str5, String.valueOf(regionId) + ".json");
                    } else {
                        Log.e(str4, "Region Meta Data File is not available in mobile: " + regionId);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isRegionSelectedInPreference(int i, CurrentMapDetails currentMapDetails) {
        if (currentMapDetails != null) {
            try {
                List<CurrentMapDetails.NdsUpdatePreferenceBean> nds_update_preference = currentMapDetails.getNds_update_preference();
                if (nds_update_preference.size() > 0) {
                    for (int i2 = 0; i2 < nds_update_preference.size(); i2++) {
                        if (i == nds_update_preference.get(i2).getNds_region()) {
                            Log.i(TAG, "Given Region Selected");
                            return true;
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    private boolean isAutoUpdateEnabledInPreference(int i, CurrentMapDetails currentMapDetails) {
        boolean z = false;
        if (currentMapDetails != null) {
            try {
                List<CurrentMapDetails.NdsUpdatePreferenceBean> nds_update_preference = currentMapDetails.getNds_update_preference();
                if (nds_update_preference.size() > 0) {
                    for (int i2 = 0; i2 < nds_update_preference.size(); i2++) {
                        if (i == nds_update_preference.get(i2).getNds_region()) {
                            boolean isAuto_update = nds_update_preference.get(i2).isAuto_update();
                            try {
                                Log.i(TAG, "Auto Update preference:" + isAuto_update);
                                return isAuto_update;
                            } catch (Exception e) {
                                e = e;
                                z = isAuto_update;
                                e.printStackTrace();
                                return z;
                            }
                        }
                    }
                }
            } catch (Exception e2) {
                //e = e2;
            }
        }
        return z;
    }

    private void notifyAvailableRegionToApp(JSONObject jSONObject) {
        Log.i(TAG, "notifyAvailableRegionToApp:" + jSONObject);
        try {
            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
            if (iHACServiceCallback != null) {
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject deleteRegionFiles(String str, String str2, int i, int i2, int i3, int i4, boolean z) {
        String str3 = TAG;
        Log.i(str3, "deleteRegionFiles: Supplier Id " + i + " baselineMapId " + i2 + " productId " + i3);
        StringBuilder sb = new StringBuilder();
        sb.append("Region Id:");
        sb.append(i4);
        Log.i(str3, sb.toString());
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            jSONObject.put("productID", i3);
            jSONObject.put("supplierID", i);
            jSONObject.put("baselineID", i2);
            jSONObject.put("regionID", i4);
            int downloadedStatusByRegionIdWithoutVersion = MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionIdWithoutVersion(str, str2, this.mHUModel, i3, i2, i, i4);
            if (downloadedStatusByRegionIdWithoutVersion == 1 || downloadedStatusByRegionIdWithoutVersion == 2) {
                Log.e(str3, "Download in progress. Can't delete the files");
                jSONObject.put("errorCode", 6);
            } else {
                Log.e(str3, "try to delete the files");
                MapDataBaseHelper.getsInstance().deleteRowById(str, str2, this.mHUModel, i3, i2, i, i4);
                if (this.mMapsRootFolder.exists()) {
                    String prepareRegionFilePathWithoutVersion = prepareRegionFilePathWithoutVersion(str, str2, this.mMapsRootFolder.getAbsolutePath(), i, i2, i3, i4);
                    Log.i(str3, "File Path to delete:" + prepareRegionFilePathWithoutVersion);
                    File file = new File(prepareRegionFilePathWithoutVersion);
                    if (file.exists()) {
                        Log.i(str3, "File is available. So delete it");
                        deleteRecursive(file);
                        if (z) {
                            notifyToAppAboutFileDelete(str, str2, i, i2, i3, i4);
                        }
                        jSONObject.put("errorCode", 0);
                    } else {
                        jSONObject.put("errorCode", 5);
                        Log.i(str3, "File is not available. So sent error back");
                    }
                } else {
                    jSONObject.put("errorCode", 3);
                    Log.i(str3, "Directory itself not available. So sent error back");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject deleteRegionFilesFromApp(String str, String str2, int i, int i2, int i3, int i4) {
        String str3 = TAG;
        Log.i(str3, "deleteRegionFilesFromApp: Supplier Id " + i + " baselineMapId " + i2 + " productId " + i3);
        StringBuilder sb = new StringBuilder();
        sb.append("Region Id:");
        sb.append(i4);
        Log.i(str3, sb.toString());
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            jSONObject.put("productID", i3);
            jSONObject.put("supplierID", i);
            jSONObject.put("baselineID", i2);
            jSONObject.put("regionID", i4);
            int downloadedStatusByRegionIdWithoutVersion = MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionIdWithoutVersion(str, str2, this.mHUModel, i3, i2, i, i4);
            if (downloadedStatusByRegionIdWithoutVersion == 1 || downloadedStatusByRegionIdWithoutVersion == 2) {
                Log.e(str3, "Download in progress. Can't delete the files");
                jSONObject.put("errorCode", 6);
            } else {
                Log.e(str3, "try to delete the files");
                MapDataBaseHelper.getsInstance().deleteRowById(str, str2, this.mHUModel, i3, i2, i, i4);
                if (this.mMapsRootFolder.exists()) {
                    String prepareRegionFilePathWithoutVersion = prepareRegionFilePathWithoutVersion(str, str2, this.mMapsRootFolder.getAbsolutePath(), i, i2, i3, i4);
                    Log.i(str3, "File Path to delete:" + prepareRegionFilePathWithoutVersion);
                    File file = new File(prepareRegionFilePathWithoutVersion);
                    if (file.exists()) {
                        Log.i(str3, "File is available. So delete it");
                        deleteRecursive(file);
                        jSONObject.put("errorCode", 0);
                    } else {
                        jSONObject.put("errorCode", 5);
                        Log.i(str3, "File is not available. So sent error back");
                    }
                } else {
                    jSONObject.put("errorCode", 3);
                    Log.i(str3, "Directory itself not available. So sent error back");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jSONObject;
    }

    private void deleteRegionFilesWithoutResponse(String str, String str2, int i, int i2, int i3, int i4) {
        String str3 = TAG;
        Log.i(str3, "deleteRegionFilesWithoutResponse: Supplier Id " + i + " baselineMapId " + i2 + " productId " + i3);
        StringBuilder sb = new StringBuilder();
        sb.append("Region Id:");
        sb.append(i4);
        Log.i(str3, sb.toString());
        try {
            if (this.mMapsRootFolder.exists()) {
                String prepareRegionFilePathWithoutVersion = prepareRegionFilePathWithoutVersion(str, str2, this.mMapsRootFolder.getAbsolutePath(), i, i2, i3, i4);
                Log.i(str3, "File Path to delete:" + prepareRegionFilePathWithoutVersion);
                File file = new File(prepareRegionFilePathWithoutVersion);
                if (file.exists()) {
                    Log.i(str3, "File is available. So delete it");
                    deleteRecursive(file);
                } else {
                    Log.i(str3, "File is not available.");
                }
            } else {
                Log.i(str3, "Directory itself not available.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void notifyToAppAboutFileDelete(String str, String str2, int i, int i2, int i3, int i4) {
        String str3 = TAG;
        Log.i(str3, "notifyToAppAboutFileDelete");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", MapUtils.KEY_MAP_DATA_DELETE);
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("productID", i3);
            jSONObject2.put("supplierID", i);
            jSONObject2.put("baselineID", i2);
            jSONObject2.put("regionID", i4);
            jSONArray.put(jSONObject2);
            jSONObject.put("data", jSONArray);
            Log.i(str3, "Map Data Deletion notification to App:" + jSONObject.toString());
            this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getRegionNameByRegionId(CurrentMapDetails currentMapDetails, int i) {
        if (currentMapDetails != null) {
            List<CurrentMapDetails.NdsProductBean.NdsRegionBean> nds_region = currentMapDetails.getNds_product().get(0).getNds_region();
            for (int i2 = 0; i2 < nds_region.size(); i2++) {
                if (nds_region.get(i2).getId() == i) {
                    return nds_region.get(i2).getName();
                }
            }
        }
        return null;
    }

    private int getCurrentVersionByRegionId(CurrentMapDetails currentMapDetails, int i) {
        List<CurrentMapDetails.NdsProductBean.NdsRegionBean> nds_region = currentMapDetails.getNds_product().get(0).getNds_region();
        for (int i2 = 0; i2 < nds_region.size(); i2++) {
            if (nds_region.get(i2).getId() == i) {
                return nds_region.get(i2).getVersion_id();
            }
        }
        return -1;
    }

    void deleteRecursive(File file) {
        if (file.isDirectory()) {
            for (File file2 : file.listFiles()) {
                deleteRecursive(file2);
            }
        }
        file.delete();
    }

    @Override // com.harman.services.IService
    public byte[] readDataFromFile(byte[] bArr, int i) {
        String str;
        short shortValue = ((Short) Utility.getIntVal(bArr, 12, 2)).shortValue();
        String str2 = TAG;
        Log.i(str2, "FILE ID Length  : " + ((int) shortValue));
        int i2 = 14;
        if (shortValue > 0) {
            String string = Utility.getString(bArr, 14, shortValue);
            Log.i(str2, "File ID String : " + string);
            i2 = 14 + shortValue;
            str = string;
        } else {
            str = null;
        }
        long longValue = ((Long) Utility.getUnSignedIntVal(bArr, i2, 4)).longValue();
        Log.i(str2, "Content Offset:::" + longValue);
        int intValue = ((Integer) Utility.getUnSignedIntVal(bArr, i2 + 4, 2)).intValue();
        Log.i(str2, "MAX Data Length:::" + intValue);
        byte[] retrieveDataFromFile = retrieveDataFromFile(str, longValue, intValue, i);
        if (retrieveDataFromFile != null) {
            return retrieveDataFromFile;
        }
        byte[] packageResponse = Utility.packageResponse(i, 21, null);
        Log.i(str2, "File read failed. Hence inform to app");
        notifyFileTransferFailureToApp();
        return packageResponse;
    }

    @Override // com.harman.services.IService
    public byte[] writeDataIntoFile(byte[] bArr, int i) throws IOException {
        String str;
        byte[] bArr2 = new byte[0];
        int intValue = ((Integer) Utility.getUnSignedIntVal(bArr, 12, 2)).intValue();
        String str2 = TAG;
        Log.i(str2, "FILE ID Length  : " + intValue);
        int i2 = 14;
        if (intValue > 0) {
            str = Utility.getString(bArr, 14, intValue);
            Log.i(str2, "File ID String : " + str);
            i2 = 14 + intValue;
        } else {
            str = null;
        }
        String str3 = str;
        boolean bit = Utility.getBit(bArr[i2], 0);
        Log.i(str2, "IS FINAL REQUEST::" + bit);
        int i3 = i2 + 1;
        long longValue = ((Long) Utility.getUnSignedIntVal(bArr, i3, 4)).longValue();
        Log.i(str2, "TOTAL SIZE  : " + longValue);
        int i4 = i3 + 4;
        long longValue2 = ((Long) Utility.getUnSignedIntVal(bArr, i4, 4)).longValue();
        Log.i(str2, "OFFSET:::" + longValue2);
        int i5 = i4 + 4;
        long longValue3 = ((Long) Utility.getUnSignedIntVal(bArr, i5, 4)).longValue();
        Log.i(str2, "Data Length:::" + longValue3);
        int i6 = i5 + 4;
        if (longValue3 > 0) {
            bArr2 = Arrays.copyOfRange(bArr, i6, bArr.length);
            Log.i(str2, "Requested Data ::::::" + bArr2.toString());
        }
        Log.i(str2, "Offset value from Server is: " + longValue2);
        Log.i(str2, "Creating a new file for request");
        return createOrUpdateFileFromHURequest(str3, bit, longValue, longValue2, bArr2, i);
    }

    @Override // com.harman.services.IService
    public void processGenericNotification(String str, int i) {
        JSONArray jSONArray;
        String str2;
        String str3;
        String str4;
        String str5;
        String str6;
        String str7;
        JSONArray jSONArray2;
        String str8;
        String str9;
        String str10 = TAG;
        Log.i(str10, "processGenericNotification:" + str);
        try {
            JSONObject jSONObject = new JSONObject(str);
            String optString = jSONObject.optString("notify");
            Log.i(str10, "Notification Type " + optString);
            String str11 = "toVersion";
            String str12 = "fromVersion";
            String str13 = "supplierID";
            String str14 = "baselineID";
            String str15 = ".json";
            String str16 = "productCode";
            String str17 = "accessoryTransferStatus";
            String str18 = "deviceCode";
            if (optString.equals(MapUtils.KEY_UPDATE_TRANSFER_PROGRESS)) {
                JSONArray optJSONArray = jSONObject.optJSONArray("data");
                if (optJSONArray == null || optJSONArray.length() <= 0) {
                    return;
                }
                int i2 = 0;
                while (i2 < optJSONArray.length()) {
                    JSONObject optJSONObject = optJSONArray.optJSONObject(i2);
                    if (optJSONObject != null) {
                        String optString2 = optJSONObject.optString("deviceCode");
                        String optString3 = optJSONObject.optString("productCode");
                        int optInt = optJSONObject.optInt("regionID");
                        int optInt2 = optJSONObject.optInt("productID");
                        int optInt3 = optJSONObject.optInt("baselineID");
                        int optInt4 = optJSONObject.optInt("supplierID");
                        int optInt5 = optJSONObject.optInt(str12);
                        int optInt6 = optJSONObject.optInt(str11);
                        jSONArray2 = optJSONArray;
                        int optInt7 = optJSONObject.optInt("progress");
                        String str19 = TAG;
                        str8 = str11;
                        StringBuilder sb = new StringBuilder();
                        str9 = str12;
                        sb.append("Transfer Progress: ");
                        sb.append(optInt7);
                        Log.d(str19, sb.toString());
                        if (optInt7 >= 0 && optInt7 <= 24) {
                            Log.e(str19, "Download is in progress. So block notification");
                        } else if (optInt7 >= 25 && optInt7 <= 47) {
                            Log.i(str19, "File transfer initiated");
                            Native.getInstance().updateFileTransferStatus(optString2, optString3, this.mHUModel, 2, optInt2, optInt3, optInt4, optInt, optInt5, optInt6);
                        } else if (optInt7 >= 48) {
                            Log.i(str19, "File transfer completed");
                            Native.getInstance().updateFileTransferStatus(optString2, optString3, this.mHUModel, 3, optInt2, optInt3, optInt4, optInt, optInt5, optInt6);
                        }
                        Log.i(str19, "Transfer Progress Notification Required Status: " + isNotificationRequiredToAppForTransferProgress);
                        if (isNotificationRequiredToAppForTransferProgress) {
                            Log.i(str19, "Progress Notification to App");
                            jSONObject.put("notify", "accessoryFileTransferProgress");
                            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
                            if (iHACServiceCallback != null) {
                                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
                            }
                        } else {
                            Log.e(str19, "Transfer Notification flag is not enabled in app. So no need to sent progress to App");
                        }
                    } else {
                        jSONArray2 = optJSONArray;
                        str8 = str11;
                        str9 = str12;
                    }
                    i2++;
                    optJSONArray = jSONArray2;
                    str11 = str8;
                    str12 = str9;
                }
                return;
            }
            String str20 = "toVersion";
            String str21 = "fromVersion";
            if (optString.equals(MapUtils.KEY_MAP_INSTALL_STATUS)) {
                Log.i(str10, "Request for Map Install Status");
                JSONArray optJSONArray2 = jSONObject.optJSONArray("data");
                if (optJSONArray2 == null || optJSONArray2.length() <= 0) {
                    return;
                }
                int i3 = 0;
                while (i3 < optJSONArray2.length()) {
                    JSONObject optJSONObject2 = optJSONArray2.optJSONObject(i3);
                    if (optJSONObject2 != null) {
                        String optString4 = optJSONObject2.optString(str18);
                        String optString5 = optJSONObject2.optString(str16);
                        jSONArray = optJSONArray2;
                        int optInt8 = optJSONObject2.optInt("regionID");
                        int optInt9 = optJSONObject2.optInt("productID");
                        int optInt10 = optJSONObject2.optInt(str14);
                        int optInt11 = optJSONObject2.optInt(str13);
                        str2 = str16;
                        String str22 = str21;
                        int optInt12 = optJSONObject2.optInt(str22);
                        str21 = str22;
                        String str23 = str20;
                        int optInt13 = optJSONObject2.optInt(str23);
                        str20 = str23;
                        str5 = str17;
                        int optInt14 = optJSONObject2.optInt(str5);
                        str7 = str18;
                        String str24 = TAG;
                        str3 = str13;
                        StringBuilder sb2 = new StringBuilder();
                        str4 = str14;
                        sb2.append("accessoryTransferStatus::");
                        sb2.append(optInt14);
                        Log.i(str24, sb2.toString());
                        MapDataBaseHelper.getsInstance().deleteRowByRegionInfo(optString4, optString5, this.mHUModel, optInt9, optInt10, optInt11, optInt8, optInt12, optInt13);
                        jSONObject.put("notify", str5);
                        Log.d(str24, "Map Install Status Notification to App");
                        IHACServiceCallback iHACServiceCallback2 = this.mIHACServiceCallback;
                        if (iHACServiceCallback2 != null) {
                            iHACServiceCallback2.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
                        }
                        Log.i(str24, "Map Install Status received.so delete the region meta data files");
                        String absolutePath = this.mMapsRootFolder.getAbsolutePath();
                        StringBuilder sb3 = new StringBuilder();
                        sb3.append(String.valueOf(optInt8));
                        str6 = str15;
                        sb3.append(str6);
                        if (checkRegionMetaDataFileIsAvailableInMobile(optString4, optString5, absolutePath, sb3.toString())) {
                            String str25 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(optString5, optString4);
                            Log.i(str24, "Meta data file is available. Hence Delete the file:" + str25);
                            deleteFiles(str25, String.valueOf(optInt8) + str6);
                        } else {
                            Log.e(str24, "Region Meta Data File is not available: " + optInt8);
                        }
                    } else {
                        jSONArray = optJSONArray2;
                        str2 = str16;
                        str3 = str13;
                        str4 = str14;
                        str5 = str17;
                        str6 = str15;
                        str7 = str18;
                    }
                    i3++;
                    optJSONArray2 = jSONArray;
                    str15 = str6;
                    str18 = str7;
                    str13 = str3;
                    str14 = str4;
                    str17 = str5;
                    str16 = str2;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error:" + e.toString());
            e.printStackTrace();
        }
    }

    public byte[] retrieveDataFromFile(String str, long j, int i, int i2) {
        int i3 = i;
        byte[] bArr = new byte[0];
        try {
            String str2 = TAG;
            Log.i(str2, "retrieveDataFromFile called::fileIdPath::::" + str + ":::::content offset::" + j);
            Log.i(str2, "maxDataLength::::" + i3 + ":::::requestId::" + i2);

            StringBuilder sb = new StringBuilder();
            try {
                sb.append(this.mMapsRootFolder.getAbsolutePath().toString());
                sb.append(File.separator);
                sb.append(str);
                String replaceAll = sb.toString().replaceAll("\\\\", "");
                Log.i(str2, "Given URL is::" + replaceAll);
                File file = new File(replaceAll);
                if (file.exists()) {
                    Log.i(str2, "File is available to read");
                    FileInputStream fileInputStream = new FileInputStream(file);
                    int available = fileInputStream.available();
                    Log.i(str2, "availableBytes :: " + available);
                    Log.i(str2, "Total length of the File::" + file.length());
                    if (j > available) {
                        return getFileResponse(i2, file.length(), j, 0, bArr, 20);
                    }
                    if (i3 == 0) {
                        Log.i(str2, "Max Data Length is 0");
                        i3 = 65000;
                    }
                    Arrays.fill(bArr, (byte) 0);
                    byte[] bArr2 = new byte[i3];
                    Log.i(str2, "Bytes to read is of length " + i3);
                    Log.i(str2, "skippedCount " + fileInputStream.skip(j));
                    Log.i(str2, "Available " + fileInputStream.available());
                    int read = fileInputStream.read(bArr2, 0, i3);
                    fileInputStream.close();
                    Log.i(str2, "Content Offset:::" + j + "Size of bytes read " + read);
                    StringBuilder sb2 = new StringBuilder();
                    sb2.append("Bytes Read length::");
                    sb2.append(i3);
                    Log.i(str2, sb2.toString());
                    return getFileResponse(i2, file.length(), j, read, bArr2, 0);
                }
                Log.i(str2, "File is not available in mobile");
                notifyFileTransferFailureToApp();
                return getFileResponse(i2, 0L, j, 0, bArr, 21);
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return null;
            }
        } catch (Exception e2) {
          //  e = e2;
        }
        return bArr;
    }

    private byte[] getFileResponse(int i, long j, long j2, int i2, byte[] bArr, int i3) {
        byte[] bArr2;
        try {
            String str = TAG;
            Log.i(str, "getFileResponse:::total File Length:" + j + "::::currentOffset::" + j2);
            StringBuilder sb = new StringBuilder();
            sb.append("sizeOfBytes:::");
            sb.append(i2);
            Log.i(str, sb.toString());
            if (bArr != null) {
                Log.i(str, "responseData Length:::" + bArr.length);
            } else {
                Log.i(str, "Response data is null");
            }
            if (i3 == 0) {
                byte[] expandByteArray = Utility.expandByteArray(null, 2);
                Utility.ushort2Byte(expandByteArray, 2, 0, 2);
                byte[] expandByteArray2 = Utility.expandByteArray(expandByteArray, 4);
                Utility.int2Byte(expandByteArray2, new Integer((int) j), 2, 4);
                byte[] expandByteArray3 = Utility.expandByteArray(expandByteArray2, 4);
                Utility.int2Byte(expandByteArray3, new Integer((int) j2), 6, 4);
                byte[] expandByteArray4 = Utility.expandByteArray(expandByteArray3, 2);
                Utility.ushort2Byte(expandByteArray4, new Integer(i2), 10, 2);
                bArr2 = Utility.expandByteArray(expandByteArray4, i2);
                System.arraycopy(bArr, 0, bArr2, 12, i2);
            } else {
                bArr2 = null;
            }
            byte[] packageResponse = Utility.packageResponse(i, i3, bArr2);
            Log.i(str, "ERROR code : " + i3);
            Log.i(str, "Response for QueryGenericFileData to HU");
            return packageResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void processGenericCommandImpl(final int i, String str) {
        String str2 = TAG;
        Log.i(str2, "processGenericCommandImpl:" + str);
        try {
            final JSONObject jSONObject = new JSONObject(str);
            String optString = jSONObject.optString("req");
            Log.i(str2, "Request Type " + optString);
            if (optString.equals(MapUtils.REQ_GET_SERVICE_STATE)) {
                String optString2 = jSONObject.optString(MapUtils.KEY_SERVICE_ID);
                Log.i(str2, "serviceId:" + optString2);
                if (isMapUpdateEnabled()) {
                    getServiceState(optString2, i);
                } else {
                    Log.e(str2, "map Update disabled in App Settings");
                    JSONObject jSONObject2 = new JSONObject();
                    jSONObject2.put("resp", MapUtils.REQ_GET_SERVICE_STATE);
                    jSONObject2.put(MapUtils.KEY_SERVICE_ID, optString2);
                    jSONObject2.put("result", 4);
                    String jSONObject3 = jSONObject2.toString();
                    Log.e(str2, "getServiceState disabled Response:" + jSONObject3);
                    sendGenericResponseToHU(i, jSONObject3.getBytes("UTF8"));
                }
            } else if (optString.equals(MapUtils.REQ_SET_DEVICE_PROPERTIES)) {
                try {
                    this.mDeviceCode = jSONObject.optString("deviceCode");
                    this.mProductCode = jSONObject.optString("productCode");
                    Log.i(str2, "Product Code:" + this.mProductCode + "  Device Code:" + this.mDeviceCode);
                    JSONObject jSONObject4 = new JSONObject();
                    jSONObject4.put("resp", MapUtils.REQ_SET_DEVICE_PROPERTIES);
                    jSONObject4.put("result", 0);
                    String jSONObject5 = jSONObject4.toString();
                    Log.i(str2, "SetDeviceProperties Response:" + jSONObject5);
                    sendGenericResponseToHU(i, jSONObject5.getBytes("UTF8"));
                    persistDeviceProperties(this.mProductCode, this.mDeviceCode);
                    getEntitlements();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (optString.equals(MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.15
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            String optString3 = jSONObject.optString("mapJson");
                            MapServiceManager mapServiceManager = MapServiceManager.this;
                            JSONObject currentMapDetailsFileFromStorageAsJSON = mapServiceManager.getCurrentMapDetailsFileFromStorageAsJSON(optString3, mapServiceManager.mDeviceCode, MapServiceManager.this.mProductCode);
                            Log.i(MapServiceManager.TAG, "Current Map Details as JSON::" + currentMapDetailsFileFromStorageAsJSON);
                            if (currentMapDetailsFileFromStorageAsJSON == null) {
                                JSONObject jSONObject6 = new JSONObject();
                                jSONObject6.put("resp", MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS);
                                jSONObject6.put("result", 1);
                                String jSONObject7 = jSONObject6.toString();
                                Log.i(MapServiceManager.TAG, "SYNC JSON file has problem" + jSONObject7);
                                MapServiceManager.this.sendGenericResponseToHU(i, jSONObject7.getBytes("UTF8"));
                            } else {
                                JSONObject jSONObject8 = new JSONObject();
                                jSONObject8.put("resp", MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS);
                                jSONObject8.put("result", 0);
                                String jSONObject9 = jSONObject8.toString();
                                Log.i(MapServiceManager.TAG, "Sync map Details Response:" + jSONObject9);
                                MapServiceManager.this.sendGenericResponseToHU(i, jSONObject9.getBytes("UTF8"));
                                MapServiceManager mapServiceManager2 = MapServiceManager.this;
                                mapServiceManager2.storeMapDetailsFileID(optString3, mapServiceManager2.mDeviceCode, MapServiceManager.this.mProductCode);
                                final CurrentMapDetails currentMapDetails = (CurrentMapDetails) new Gson().fromJson(currentMapDetailsFileFromStorageAsJSON.toString(), CurrentMapDetails.class);
                                if (currentMapDetails != null) {
                                    new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.15.1
                                        @Override // java.lang.Runnable
                                        public void run() {
                                            MapServiceManager.this.deleteAlreadyTransferredFiles(MapServiceManager.this.mDeviceCode, MapServiceManager.this.mProductCode, currentMapDetails);
                                            MapServiceManager.this.deleteUnSelectedRegionFiles(MapServiceManager.this.mDeviceCode, MapServiceManager.this.mProductCode, currentMapDetails);
                                        }
                                    }).start();
                                    MapServiceManager mapServiceManager3 = MapServiceManager.this;
                                    mapServiceManager3.doSyncCurrentMapDetails(mapServiceManager3.mDeviceCode, MapServiceManager.this.mProductCode, currentMapDetails);
                                }
                            }
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals(MapUtils.REQ_UPLOAD_CURRENT_MAP_DETAILS)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.16
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManager.TAG, "Upload JSON request");
                            String optString3 = jSONObject.optString(MapUtils.KEY_DESTINATION_SERVER);
                            MapServiceManager.this.uploadConfigDataToMUDPServer(jSONObject.optString("mapJson"), optString3, i);
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals("startDownload")) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.17
                    @Override // java.lang.Runnable
                    public void run() {
                        String str3;
                        JSONArray jSONArray;
                        int i2;
                        String str4;
                        int i3;
                        int i4;
                        String str5 = "data";
                        try {
                            Log.i(MapServiceManager.TAG, "Start Download Request ");
                            JSONArray optJSONArray = jSONObject.optJSONArray("data");
                            if (optJSONArray == null || optJSONArray.length() <= 0) {
                                return;
                            }
                            JSONObject jSONObject6 = new JSONObject();
                            jSONObject6.put("resp", "startDownload");
                            JSONArray jSONArray2 = new JSONArray();
                            int i5 = 0;
                            while (i5 < optJSONArray.length()) {
                                JSONObject optJSONObject = optJSONArray.optJSONObject(i5);
                                if (optJSONObject != null) {
                                    String optString3 = optJSONObject.optString("deviceCode");
                                    String optString4 = optJSONObject.optString("productCode");
                                    int optInt = optJSONObject.optInt("fromVersion");
                                    int optInt2 = optJSONObject.optInt("toVersion");
                                    int optInt3 = optJSONObject.optInt("productID");
                                    int optInt4 = optJSONObject.optInt("baselineID");
                                    int optInt5 = optJSONObject.optInt("supplierID");
                                    int optInt6 = optJSONObject.optInt("regionID");
                                    if (optInt3 == 0 || optInt4 == 0 || optInt5 == 0 || optInt6 == 0) {
                                        str3 = str5;
                                        jSONArray = optJSONArray;
                                        i2 = i5;
                                        Log.i(MapServiceManager.TAG, "startDownload:Invalid request param.");
                                        jSONObject6.put("error", 1);
                                        optJSONObject.put("status", 6);
                                        jSONArray2.put(optJSONObject);
                                    } else {
                                        if (Native.getInstance().isDownloadInProgress()) {
                                            Log.i(MapServiceManager.TAG, "Download is in progress. Hence check for further details");
                                            String deviceCode = DownloadManager.getInstance().getDeviceCode();
                                            String productCode = DownloadManager.getInstance().getProductCode();
                                            int productId = DownloadManager.getInstance().getProductId();
                                            int supplierId = DownloadManager.getInstance().getSupplierId();
                                            int baselineId = DownloadManager.getInstance().getBaselineId();
                                            int regionId = DownloadManager.getInstance().getRegionId();
                                            int fromVersion = DownloadManager.getInstance().getFromVersion();
                                            int toVersion = DownloadManager.getInstance().getToVersion();
                                            if (deviceCode.equals(optString3) && productCode.equals(optString4) && regionId == optInt6) {
                                                Log.i(MapServiceManager.TAG, "Looks like download is in progress for same region");
                                                jSONArray = optJSONArray;
                                            }
                                            jSONArray = optJSONArray;
                                            Log.i(MapServiceManager.TAG, "Download is in progress for different region or different HU. So stop the download");
                                            Native.getInstance().cancelDownloadByHU(deviceCode, productCode, MapServiceManager.this.mHUModel, supplierId, baselineId, productId, regionId, fromVersion, toVersion);
                                        } else {
                                            jSONArray = optJSONArray;
                                            Log.i(MapServiceManager.TAG, "Download is not in progress. Proceed with normal flow");
                                        }
                                        Context context = MapServiceManager.this.mContext;
                                        Context unused = MapServiceManager.this.mContext;
                                        boolean z = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(MapServiceManager.this.getCombinedDetailsForPartialUpdate(optString4, optString3, optInt6), false);
                                        Log.d(MapServiceManager.TAG, "startDownload: Partial Update Flag: " + z);
                                        str3 = str5;
                                        i2 = i5;
                                        if (z) {
                                            Log.d(MapServiceManager.TAG, "Download Partial Update");
                                            MapServiceManager mapServiceManager = MapServiceManager.this;
                                            int checkPartialUpdateDownloadStatus = mapServiceManager.checkPartialUpdateDownloadStatus(optString3, optString4, mapServiceManager.mHUModel, optInt3, optInt4, optInt5, optInt6, optInt, optInt2);
                                            if (!MapServiceManager.this.isNetworkAvailable()) {
                                                i4 = 1;
                                                Log.e(MapServiceManager.TAG, "No Network connectivity for partial update. Hence add error code and status");
                                                jSONObject6.put("error", 5);
                                                optJSONObject.put("status", 12);
                                            } else {
                                                jSONObject6.put("error", 0);
                                                if (checkPartialUpdateDownloadStatus != 3) {
                                                    if (checkPartialUpdateDownloadStatus != 0 && checkPartialUpdateDownloadStatus != 4 && checkPartialUpdateDownloadStatus != 5 && checkPartialUpdateDownloadStatus != 6 && checkPartialUpdateDownloadStatus != 7 && checkPartialUpdateDownloadStatus != 9) {
                                                        Log.i(MapServiceManager.TAG, "Sent download status as it is for partial download");
                                                        optJSONObject.put("status", checkPartialUpdateDownloadStatus);
                                                    }
                                                    Log.i(MapServiceManager.TAG, "Partial Download is not completed or in progress. So sent status as initiated and download will start for this case");
                                                    i4 = 1;
                                                    optJSONObject.put("status", 1);
                                                } else {
                                                    optJSONObject.put("status", checkPartialUpdateDownloadStatus);
                                                    optJSONObject.put(MapUtils.KEY_FILE_ID, MapUtils.CONFIG_FOLDER_NAME + File.separator + MapServiceManager.this.getCombinedDeviceDetail(optString4, optString3) + File.separator + String.valueOf(optInt6) + ".json");
                                                }
                                                i4 = 1;
                                            }
                                            jSONArray2.put(optJSONObject);
                                            if (MapServiceManager.this.isNetworkAvailable()) {
                                                if (checkPartialUpdateDownloadStatus == 3 || checkPartialUpdateDownloadStatus == i4 || checkPartialUpdateDownloadStatus == 2) {
                                                    Log.i(MapServiceManager.TAG, "Download already in progress or completed for partial Update : " + optInt6);
                                                } else {
                                                    MapServiceManager.this.addPartialDownloadForHU(optJSONObject, optString3, optString4, checkPartialUpdateDownloadStatus, optInt5, optInt4, optInt3, optInt6, optInt, optInt2);
                                                }
                                            }
                                        } else {
                                            Log.d(MapServiceManager.TAG, "Download Incremental Update");
                                            int downloadStatusByRegion = Native.getInstance().downloadStatusByRegion(optString3, optString4, MapServiceManager.this.mHUModel, optInt3, optInt4, optInt5, optInt6, optInt, optInt2);
                                            boolean isNetworkAvailable = MapServiceManager.this.isNetworkAvailable();
                                            if (!isNetworkAvailable) {
                                                str4 = optString4;
                                                i3 = 1;
                                                Log.e(MapServiceManager.TAG, "No Network connectivity. Hence add error code and status");
                                                jSONObject6.put("error", 5);
                                                optJSONObject.put("status", 12);
                                            } else {
                                                jSONObject6.put("error", 0);
                                                if (downloadStatusByRegion != 0 && downloadStatusByRegion != 4 && downloadStatusByRegion != 5 && downloadStatusByRegion != 6 && downloadStatusByRegion != 7 && downloadStatusByRegion != 9) {
                                                    if (downloadStatusByRegion == 3) {
                                                        Log.i(MapServiceManager.TAG, "Download is completed.");
                                                        optJSONObject.put("status", downloadStatusByRegion);
                                                        MapServiceManager mapServiceManager2 = MapServiceManager.this;
                                                        str4 = optString4;
                                                        if (mapServiceManager2.checkRegionMetaDataFileIsAvailableInMobile(optString3, str4, mapServiceManager2.mMapsRootFolder.getAbsolutePath(), String.valueOf(optInt6) + ".json")) {
                                                            Log.i(MapServiceManager.TAG, "Region update file is available. So sent file id tag also in response");
                                                            optJSONObject.put(MapUtils.KEY_FILE_ID, MapUtils.CONFIG_FOLDER_NAME + File.separator + MapServiceManager.this.getCombinedDeviceDetail(str4, optString3) + File.separator + String.valueOf(optInt6) + ".json");
                                                        }
                                                    } else {
                                                        str4 = optString4;
                                                        Log.i(MapServiceManager.TAG, "Sent download status as it is");
                                                        optJSONObject.put("status", downloadStatusByRegion);
                                                    }
                                                    i3 = 1;
                                                }
                                                str4 = optString4;
                                                Log.i(MapServiceManager.TAG, "Download is not completed or in progress. So sent status as initiated and download will start for this case");
                                                i3 = 1;
                                                optJSONObject.put("status", 1);
                                            }
                                            jSONArray2.put(optJSONObject);
                                            if (isNetworkAvailable) {
                                                if (downloadStatusByRegion == 3 || downloadStatusByRegion == i3 || downloadStatusByRegion == 2) {
                                                    Log.i(MapServiceManager.TAG, "Download already in progress or completed");
                                                } else {
                                                    MapServiceManager.this.addDownloadForHU(optJSONObject, optString3, str4, downloadStatusByRegion, optInt5, optInt4, optInt3, optInt6, optInt, optInt2);
                                                }
                                            }
                                        }
                                    }
                                    i5 = i2 + 1;
                                    str5 = str3;
                                    optJSONArray = jSONArray;
                                } else {
                                    str3 = str5;
                                    jSONArray = optJSONArray;
                                    i2 = i5;
                                }
                                i5 = i2 + 1;
                                str5 = str3;
                                optJSONArray = jSONArray;
                            }
                            jSONObject6.put(str5, jSONArray2);
                            String jSONObject7 = jSONObject6.toString();
                            Log.i(MapServiceManager.TAG, "Start Download Response to HU:" + jSONObject7);
                            MapServiceManager.this.sendGenericResponseToHU(i, jSONObject7.getBytes("UTF8"));
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals("cancelDownload")) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.18
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManager.TAG, "cancel Download");
                            JSONArray optJSONArray = jSONObject.optJSONArray("data");
                            JSONObject jSONObject6 = null;
                            if (optJSONArray != null && optJSONArray.length() > 0) {
                                for (int i2 = 0; i2 < optJSONArray.length(); i2++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i2);
                                    if (optJSONObject != null) {
                                        String optString3 = optJSONObject.optString("deviceCode");
                                        String optString4 = optJSONObject.optString("productCode");
                                        int optInt = optJSONObject.optInt("productID");
                                        jSONObject6 = Native.getInstance().cancelDownloadByHU(optString3, optString4, MapServiceManager.this.mHUModel, optJSONObject.optInt("supplierID"), optJSONObject.optInt("baselineID"), optInt, optJSONObject.optInt("regionID"), optJSONObject.optInt("fromVersion"), optJSONObject.optInt("toVersion"));
                                    }
                                }
                            }
                            String jSONObject7 = jSONObject6.toString();
                            Log.i(MapServiceManager.TAG, "cancel Download Response:" + jSONObject7);
                            MapServiceManager.this.sendGenericResponseToHU(i, jSONObject7.getBytes("UTF8"));
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals(MapUtils.REQ_DELETE_REGION_FILES)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.19
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManager.TAG, "Delete Region Files");
                            JSONArray optJSONArray = jSONObject.optJSONArray("data");
                            JSONObject jSONObject6 = new JSONObject();
                            jSONObject6.put("resp", MapUtils.REQ_DELETE_REGION_FILES);
                            JSONArray jSONArray = new JSONArray();
                            if (optJSONArray != null && optJSONArray.length() > 0) {
                                for (int i2 = 0; i2 < optJSONArray.length(); i2++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i2);
                                    if (optJSONObject != null) {
                                        String optString3 = optJSONObject.optString("deviceCode");
                                        String optString4 = optJSONObject.optString("productCode");
                                        int optInt = optJSONObject.optInt("productID");
                                        jSONArray.put(MapServiceManager.this.deleteRegionFiles(optString3, optString4, optJSONObject.optInt("supplierID"), optJSONObject.optInt("baselineID"), optInt, optJSONObject.optInt("regionID"), true));
                                    }
                                }
                            }
                            jSONObject6.put("data", jSONArray);
                            String jSONObject7 = jSONObject6.toString();
                            Log.i(MapServiceManager.TAG, "Delete Region File Response:" + jSONObject7);
                            MapServiceManager.this.sendGenericResponseToHU(i, jSONObject7.getBytes("UTF8"));
                        } catch (Exception e2) {
                            e2.printStackTrace();
                        }
                    }
                }).start();
            } else {
                byte[] packageResponse = Utility.packageResponse(i, 1, null);
                IResponseDataCallback iResponseDataCallback = this.mResponseDataCallbackToHu;
                if (iResponseDataCallback != null) {
                    iResponseDataCallback.onResponseUpdate("com.hac.mapService.TomTom", packageResponse);
                }
            }
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    private void prepareDeviceListForScheduler() {
        String str = TAG;
        Log.d(str, "prepareDeviceListForScheduler");
        try {
            File file = new File(this.mMapsRootFolder, MapUtils.CONFIG_FOLDER_NAME);
            if (file.exists()) {
                String[] list = file.list();
                Log.w(str, "prepareDeviceListForScheduler: Config Directory is available and folderNameList size::" + list.length);
                if (list.length == 0) {
                    return;
                }
                createDeviceList(list);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createDeviceList(String[] strArr) {
        Log.i(TAG, "createDeviceList");
        try {
            this.mDeviceCodeList.clear();
            this.mProductCodeList.clear();
            for (String str : strArr) {
                String[] split = str.split("_");
                String str2 = split[0];
                String str3 = TAG;
                Log.w(str3, "Stored Device Code:" + str2);
                String str4 = split[1];
                Log.w(str3, "Stored Product Code:" + str4);
                this.mDeviceCodeList.add(str2);
                this.mProductCodeList.add(str4);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void persistNewDeviceProperties(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "persistDeviceProperties as file");
        try {
            String combinedDeviceDetail = getCombinedDeviceDetail(str, str2);
            String str4 = this.mMapsRootFolder + File.separator + MapUtils.CONFIG_FOLDER_NAME;
            Log.i(str3, "folderName::" + str4);
            File file = new File(str4, combinedDeviceDetail);
            if (file.exists()) {
                return;
            }
            Log.w(str3, "Config File is created for " + str2 + "_" + str + " Status:" + file.mkdir());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int removeDeviceProperties(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "removeDeviceProperties");
        try {
            String combinedDeviceDetail = getCombinedDeviceDetail(str, str2);
            String str4 = this.mMapsRootFolder + File.separator + MapUtils.CONFIG_FOLDER_NAME;
            Log.i(str3, "folderName::" + str4);
            File file = new File(str4, combinedDeviceDetail);
            if (file.exists()) {
                Log.w(str3, "Directory available. Hence delete the directory");
                deleteRecursive(file);
                return 0;
            }
            Log.e(str3, "Directory not available");
            return 2;
        } catch (Exception e) {
            e.printStackTrace();
            return 3;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public int checkPartialUpdateDownloadStatus(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        String str4 = TAG;
        Log.i(str4, "checkPartialUpdateDownloadStatus");
        try {
            int downloadStatusByRegion = Native.getInstance().downloadStatusByRegion(str, str2, str3, i, i2, i3, i4, i5, 0);
            Log.d(str4, "downloadStatusForUninstallVersion: " + downloadStatusByRegion);
            if (downloadStatusByRegion == 3) {
                int downloadStatusByRegion2 = Native.getInstance().downloadStatusByRegion(str, str2, str3, i, i2, i3, i4, 0, i6);
                Log.d(str4, "downloadStatusForInstallVersion: " + downloadStatusByRegion2);
                if (downloadStatusByRegion2 == 3) {
                    Log.d(str4, "Return Status as Download completed");
                    return 3;
                }
                if (downloadStatusByRegion2 != 2 && downloadStatusByRegion2 != 1) {
                    return 0;
                }
                Log.d(str4, "Sent download status as Initiated");
            } else {
                if (downloadStatusByRegion != 2 && downloadStatusByRegion != 1) {
                    return 0;
                }
                Log.d(str4, "Sent download status as Initiated");
            }
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getCombinedDeviceDetail(String str, String str2) {
        String str3 = str2 + "_" + str;
        Log.d(TAG, "getCombinedFileName:" + str3);
        return str3;
    }

    private String getCombinedDeviceDetailJSONFileID(String str, String str2) {
        String str3 = str2 + "_" + str + "_fileId";
        Log.d(TAG, "getCombinedDeviceDetailJSONFileID:" + str3);
        return str3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getCombinedDetailsForPartialUpdate(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_IsPartial";
        Log.d(TAG, "getCombinedDeviceDetailWithRegionId:" + str3);
        return str3;
    }

    private String getCombinedDetailsForPartialUpdateFromVersion(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_fromVersion";
        Log.d(TAG, "getCombinedDetailsForPartialUpdateFromVersion:" + str3);
        return str3;
    }

    private String getCombinedDetailsForPartialUpdateToVersion(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_toVersion";
        Log.d(TAG, "getCombinedDetailsForPartialUpdateToVersion:" + str3);
        return str3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getCombinedDeviceDetailWithRegionIdForCancelDownload(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_downloadStatus";
        Log.d(TAG, "getCombinedDeviceDetailWithRegionIdForCancelDownload:" + str3);
        return str3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean checkRegionMetaDataFileIsAvailableInMobile(String str, String str2, String str3, String str4) {
        try {
            String str5 = str3 + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
            Log.i(TAG, "checkRegionMetaDataFileIsAvailableInMobile: Path Name:" + str5);
            if (str5 == null || str5.isEmpty() || str4 == null || str4.isEmpty()) {
                return false;
            }
            return new File(str5, str4).exists();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void deleteFiles(String str, String str2) {
        Log.i(TAG, "deleteFiles");
        if (str != null) {
            try {
                if (str.isEmpty() || str2 == null || str2.isEmpty()) {
                    return;
                }
                File file = new File(str, str2);
                if (file.exists()) {
                    file.delete();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void persistDeviceProperties(String str, String str2) {
        Log.i(TAG, "persistDeviceProperties as file");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("productCode", str);
            jSONObject.put("deviceCode", str2);
            createDeviceConfigFile(jSONObject.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createDeviceConfigFile(String str) {
        try {
            FileWriter fileWriter = new FileWriter(new File(this.mMapsRootFolder, MapUtils.CONFIG_FILE_NAME));
            fileWriter.append((CharSequence) str);
            fileWriter.flush();
            fileWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void checkUpdateForHUSelection(String str, String str2, int i, int i2, int i3, List<Integer> list, List<Integer> list2, CurrentMapDetails currentMapDetails) {
        String str3 = TAG;
        Log.d(str3, "checkUpdateForHUSelection");
        try {
            String tomTomURI = getTomTomURI();
            String tomTomApiKey = getTomTomApiKey();
            if (tomTomURI == null || tomTomURI.isEmpty() || tomTomApiKey == null || tomTomApiKey.isEmpty()) {
                Log.e(str3, "Invalid data");
                sendMapUpdateAvailableFailureToHU();
                return;
            }
            if (i > 0 && i2 > 0 && i3 > 0) {
                if (isNetworkAvailable()) {
                    if (getCatalogueForProduct(i, i2, i3, tomTomURI, tomTomApiKey)) {
                        JSONObject allAvailableMapVersion = getAllAvailableMapVersion(str, str2, i, i2, i3, list, list2, 0, true, currentMapDetails);
                        if (allAvailableMapVersion != null) {
                            if (allAvailableMapVersion != null) {
                                JSONObject jSONObject = new JSONObject();
                                jSONObject.put("notify", "availableMapRegions");
                                jSONObject.put("data", allAvailableMapVersion);
                                notifyAvailableRegionToApp(jSONObject);
                            }
                            JSONObject removeRegionObjectFromHUResponse = removeRegionObjectFromHUResponse(allAvailableMapVersion);
                            Log.i(str3, "Version check is success and response to HU:" + removeRegionObjectFromHUResponse);
                            createUpdateJSONFile(str, str2, MapUtils.TO_BE_UPDATED_MAP_DETAILS_JSON_FILE_NAME, removeRegionObjectFromHUResponse);
                            JSONObject jSONObject2 = new JSONObject();
                            jSONObject2.put("notify", MapUtils.REQ_MAP_UPDATE_AVAILABLE);
                            String str4 = MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str) + File.separator + MapUtils.TO_BE_UPDATED_MAP_DETAILS_JSON_FILE_NAME;
                            Log.i(str3, "To Be Updated Details File Name:" + str4);
                            jSONObject2.put(MapUtils.KEY_FILE_ID, str4);
                            jSONObject2.put("errorCode", 0);
                            String jSONObject3 = jSONObject2.toString();
                            Log.i(str3, "Send Map Update available :Notification to HU" + jSONObject3);
                            sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
                            return;
                        }
                        Log.e(str3, "checkUpdateForHUSelection :: Network Not Available or tom tom lib issue");
                        sendMapUpdateAvailableFailureToHU();
                        return;
                    }
                    Log.e(str3, "Not able to download catalogue file");
                    sendMapUpdateAvailableFailureToHU();
                    return;
                }
                Log.e(str3, "Network Failure");
                sendMapUpdateAvailableFailureToHU();
                return;
            }
            Log.e(str3, "Tom Tom URI / Api key is not available");
            sendMapUpdateAvailableFailureToHU();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendMapUpdateAvailableFailureToHU() {
        String str = TAG;
        Log.e(str, "sendMapUpdateAvailableFailureToHU");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", MapUtils.REQ_MAP_UPDATE_AVAILABLE);
            jSONObject.put(MapUtils.KEY_FILE_ID, "");
            jSONObject.put("errorCode", 1);
            String jSONObject2 = jSONObject.toString();
            Log.i(str, "Send Map Update available failure Notification to HU" + jSONObject2);
            sendGenericNotification(2, jSONObject2.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JSONObject removeRegionObjectFromHUResponse(JSONObject jSONObject) {
        Log.i(TAG, "removeRegionObjectFromHUResponse:" + jSONObject);
        if (jSONObject != null) {
            try {
                JSONArray optJSONArray = jSONObject.optJSONArray("products");
                if (optJSONArray != null) {
                    JSONObject jSONObject2 = optJSONArray.getJSONObject(0);
                    JSONArray optJSONArray2 = jSONObject2.optJSONArray("Regions");
                    JSONArray optJSONArray3 = jSONObject2.optJSONArray("Regions");
                    if (optJSONArray3 != null && optJSONArray3.length() > 0) {
                        for (int i = 0; i < optJSONArray3.length(); i++) {
                            if (optJSONArray3.getJSONObject(i).optJSONArray("Updates") == null) {
                                if (Build.VERSION.SDK_INT >= 19) {
                                    optJSONArray2.remove(i);
                                } else {
                                    optJSONArray2 = removeObjectAtIndex(i, optJSONArray2);
                                    jSONObject2.put("Regions", optJSONArray2);
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return jSONObject;
    }

    private JSONArray removeObjectAtIndex(int i, JSONArray jSONArray) {
        Log.i(TAG, "removeObjectAtIndex:" + i);
        JSONArray jSONArray2 = new JSONArray();
        try {
            int length = jSONArray.length();
            if (jSONArray != null) {
                for (int i2 = 0; i2 < length; i2++) {
                    if (i2 != i) {
                        jSONArray2.put(jSONArray.get(i2));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jSONArray2;
    }

    private boolean isMapUpdateEnabled() {
        boolean z;
        try {
            z = getMapUpdateStatus();
            try {
                Log.i(TAG, "Map Update Status from App:" + z);
                if (!z && this.mIHACServiceCallback != null) {
                    JSONObject jSONObject = new JSONObject();
                    jSONObject.put("notify", "error");
                    jSONObject.put("errorCode", GenericError.MapServiceDisabled);
                    this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
                }
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return z;
            }
        } catch (Exception e2) {
            //e = e2;
            z = false;
        }
        return z;
    }

    private void getServiceState(String str, int i) {
        String str2 = TAG;
        Log.i(str2, "getServiceState:" + str);
        int i2 = 6;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("resp", MapUtils.REQ_GET_SERVICE_STATE);
            jSONObject.put(MapUtils.KEY_SERVICE_ID, str);
            if (str.equals("com.hac.mapService.TomTom") && this.mProductCode != null && this.mDeviceCode != null) {
                if (isNetworkAvailable()) {
                    int i3 = 0;
                    JSONObject entitlementAndNotify = getEntitlementAndNotify(this.mDeviceCode, this.mProductCode, false);
                    if (entitlementAndNotify != null) {
                        boolean optBoolean = entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                        Log.i(str2, "isSubscriptionValid::" + optBoolean);
                        if (optBoolean) {
                            i3 = 1;
                            jSONObject.put("expiryDate", entitlementAndNotify.optString("expiryDate"));
                        }
                        String tomTomURI = getTomTomURI();
                        String tomTomApiKey = getTomTomApiKey();
                        String requiredSoftwareVersion = getRequiredSoftwareVersion();
                        if (requiredSoftwareVersion != null) {
                            jSONObject.put(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION, requiredSoftwareVersion);
                        }
                        Log.w(str2, "Tom Tom URI:" + tomTomURI);
                        Log.w(str2, "Tom Tom API:" + tomTomApiKey);
                        Log.w(str2, "Tom Tom Required Software Version:" + requiredSoftwareVersion);
                        i2 = i3;
                    }
                } else {
                    Log.e(str2, "No Network. So can't check subscription");
                    i2 = 7;
                }
            }
            jSONObject.put("result", i2);
            String jSONObject2 = jSONObject.toString();
            Log.i(str2, "getServiceState Response:" + jSONObject2);
            sendGenericResponseToHU(i, jSONObject2.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void doAutoUpdate() {
        MapServiceManager mapServiceManager = this;
        Log.i(TAG, "doAutoUpdate");
        try {
            if (mapServiceManager.mDeviceCodeList.size() == 0 || mapServiceManager.mProductCodeList.size() == 0) {
                updateDeviceList();
            }
            if (mapServiceManager.mDeviceCodeList.size() <= 0 || mapServiceManager.mProductCodeList.size() <= 0) {
                return;
            }
            int i = 0;
            int i2 = 0;
            while (i2 < mapServiceManager.mDeviceCodeList.size()) {
                String str = mapServiceManager.mDeviceCodeList.get(i2);
                String str2 = mapServiceManager.mProductCodeList.get(i2);
                String str3 = TAG;
                Log.i(str3, "Stored Device Code:" + str);
                Log.i(str3, "Stored Product Code:" + str2);
                JSONObject currentMapDetailsFileFromStorageAsJSON = mapServiceManager.getCurrentMapDetailsFileFromStorageAsJSON(mapServiceManager.getMapDetailsFileID(str, str2), str, str2);
                if (currentMapDetailsFileFromStorageAsJSON != null) {
                    CurrentMapDetails currentMapDetails = (CurrentMapDetails) new Gson().fromJson(currentMapDetailsFileFromStorageAsJSON.toString(), CurrentMapDetails.class);
                    CurrentMapDetails.NdsProductBean ndsProductBean = currentMapDetails.getNds_product().get(i);
                    int id = ndsProductBean.getId();
                    int baseline_id = ndsProductBean.getBaseline_id();
                    int supplier_id = ndsProductBean.getSupplier_id();
                    List<CurrentMapDetails.NdsUpdatePreferenceBean> nds_update_preference = currentMapDetails.getNds_update_preference();
                    if (nds_update_preference != null && nds_update_preference.size() > 0) {
                        ArrayList arrayList = new ArrayList();
                        ArrayList arrayList2 = new ArrayList();
                        ArrayList arrayList3 = new ArrayList();
                        Log.i(str3, "Total selected Region List Size: " + nds_update_preference.size());
                        int i3 = 0;
                        while (i3 < nds_update_preference.size()) {
                            int nds_region = nds_update_preference.get(i3).getNds_region();
                            List<CurrentMapDetails.NdsUpdatePreferenceBean> list = nds_update_preference;
                            Log.i(TAG, "Selected Region ID: " + nds_region);
                            int size = ndsProductBean.getNds_region().size();
                            if (nds_region != 0 && size > 0) {
                                int i4 = 0;
                                while (true) {
                                    if (i4 >= size) {
                                        break;
                                    }
                                    if (nds_region == ndsProductBean.getNds_region().get(i4).getId()) {
                                        arrayList.add(Integer.valueOf(ndsProductBean.getNds_region().get(i4).getId()));
                                        arrayList2.add(ndsProductBean.getNds_region().get(i4).getName());
                                        arrayList3.add(Integer.valueOf(ndsProductBean.getNds_region().get(i4).getVersion_id()));
                                        break;
                                    }
                                    i4++;
                                }
                            }
                            i3++;
                            nds_update_preference = list;
                        }
                        if (arrayList.size() > 0) {
                            Log.i(TAG, "Region selection is available.So proceed with checkForUpdate");
                            checkForAutoUpdate(str, str2, supplier_id, baseline_id, id, arrayList, arrayList3, currentMapDetails);
                        }
                    }
                }
                i2++;
                i = 0;
                mapServiceManager = this;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void checkForAutoUpdate(String str, String str2, int i, int i2, int i3, List<Integer> list, List<Integer> list2, CurrentMapDetails currentMapDetails) {
        String str3 = TAG;
        Log.i(str3, "checkForAutoUpdate");
        try {
            if (isNetworkAvailable()) {
                JSONObject entitlementAndNotify = getEntitlementAndNotify(str, str2, false);
                if (entitlementAndNotify != null) {
                    if (entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID)) {
                        if (getCatalogueForProduct(i, i2, i3, getTomTomURI(), getTomTomApiKey())) {
                            final JSONObject allAvailableMapVersion = getAllAvailableMapVersion(str, str2, i, i2, i3, list, list2, 0, true, currentMapDetails);
                            if (allAvailableMapVersion != null) {
                                Log.i(str3, "checkForAutoUpdate: Success Response received. So Sent notification for Device Code:" + str + " and product Code : " + str2);
                                JSONObject jSONObject = new JSONObject();
                                jSONObject.put("notify", "availableMapRegions");
                                jSONObject.put("data", allAvailableMapVersion);
                                notifyAvailableRegionToApp(jSONObject);
                                new Thread(new Runnable() { // from class: com.harman.services.maps.MapServiceManager.20
                                    @Override // java.lang.Runnable
                                    public void run() {
                                        Log.i(MapServiceManager.TAG, "Do Auto download");
                                        MapServiceManager.this.doAutoDownload(allAvailableMapVersion);
                                    }
                                }).start();
                            } else {
                                Log.e(str3, "checkForAutoUpdate: No Response from getAllAvailableVersion API");
                            }
                        } else {
                            Log.e(str3, "checkForAutoUpdate: Catalogue file download failed");
                        }
                    } else {
                        Log.e(str3, "checkForAutoUpdate: Invalid Subscription. Hence Can't check Auto Update");
                    }
                } else {
                    Log.e(str3, "checkForAutoUpdate: Not able to get Subscription. So can't check Auto Update");
                }
            } else {
                Log.e(str3, "checkForAutoUpdate: Network is not available. So can't check Auto Update");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void doAutoDownload(JSONObject jSONObject) {
        int i;
        String str;
        String str2;
        String str3 = TAG;
        Log.i(str3, "doAutoDownload:" + jSONObject.toString());
        try {
            if (getMapAutoDownloadStatus()) {
                String optString = jSONObject.optString("deviceCode");
                String optString2 = jSONObject.optString("productCode");
                Log.i(str3, "Device Code :" + optString + " and Product Code  " + optString2);
                JSONArray optJSONArray = jSONObject.optJSONArray("products");
                if (optJSONArray == null || optJSONArray.length() <= 0) {
                    return;
                }
                JSONObject jSONObject2 = optJSONArray.getJSONObject(0);
                int optInt = jSONObject2.optInt("id");
                int optInt2 = jSONObject2.optInt("baselineID");
                int optInt3 = jSONObject2.optInt("supplierID");
                JSONArray optJSONArray2 = jSONObject2.optJSONArray("Regions");
                if (optJSONArray2 == null || optJSONArray2.length() <= 0) {
                    return;
                }
                int i2 = 0;
                while (i2 < optJSONArray2.length()) {
                    JSONObject jSONObject3 = optJSONArray2.getJSONObject(i2);
                    int i3 = jSONObject3.getInt("regionID");
                    String str4 = TAG;
                    Log.d(str4, "Request for Region ID:" + i3);
                    int i4 = jSONObject3.getInt("fromVersion");
                    JSONArray optJSONArray3 = jSONObject3.optJSONArray("Updates");
                    if (optJSONArray3 != null && optJSONArray3.length() > 0) {
                        int toVersionForDownload = getToVersionForDownload(optJSONArray3);
                        if (getTypeForDownload(optJSONArray3) == 1) {
                            Log.i(str4, "doAutoDownload: Partial Download ");
                            int downloadStatusByRegion = Native.getInstance().downloadStatusByRegion(optString, optString2, this.mHUModel, optInt, optInt2, optInt3, i3, i4, 0);
                            if (downloadStatusByRegion == 0) {
                                i = i2;
                                str = optString2;
                                str2 = optString;
                                addPartialDownloadForApp(new JSONObject(), optString, optString2, downloadStatusByRegion, optInt3, optInt2, optInt, i3, i4, toVersionForDownload);
                            } else {
                                i = i2;
                                str = optString2;
                                str2 = optString;
                                Log.e(str4, "Already downloaded or in progress partial update");
                            }
                        } else {
                            i = i2;
                            str = optString2;
                            str2 = optString;
                            Log.i(str4, "doAutoDownload: Incremental Download ");
                            int downloadStatusByRegion2 = Native.getInstance().downloadStatusByRegion(str2, str, this.mHUModel, optInt, optInt2, optInt3, i3, i4, toVersionForDownload);
                            Log.i(str4, "downloadStatus:" + downloadStatusByRegion2);
                            if (downloadStatusByRegion2 == 15) {
                                Log.i(str4, "Licence file creation failed");
                                if (generateLicenceFile(str2, str, optInt3, optInt2, optInt, i3, i4, toVersionForDownload)) {
                                    Log.i(str4, "Licence creation success: " + i3);
                                } else {
                                    Log.e(str4, "Licence file creation failed again while auto download " + i3);
                                }
                            } else if (downloadStatusByRegion2 != 3 && downloadStatusByRegion2 != 1 && downloadStatusByRegion2 != 2) {
                                Log.i(str4, "Starting auto download for region id :" + i3);
                                addDownloadForApp(str2, str, downloadStatusByRegion2, optInt3, optInt2, optInt, i3, i4, toVersionForDownload);
                                Log.i(str4, "Auto download added into queue for region id :" + i3);
                            } else {
                                Log.i(str4, "Auto Download::File already downloaded or in progress:" + i3);
                            }
                        }
                    } else {
                        i = i2;
                        str = optString2;
                        str2 = optString;
                        Log.e(str4, "No Update available:" + i3);
                    }
                    i2 = i + 1;
                    optString2 = str;
                    optString = str2;
                }
                return;
            }
            Log.e(str3, "Map Auto Download is disabled in App. So region download can't be done");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateDeviceList() {
        String str = TAG;
        Log.w(str, "updateDeviceList");
        try {
            File file = new File(this.mMapsRootFolder, MapUtils.CONFIG_FOLDER_NAME);
            if (file.exists()) {
                String[] list = file.list();
                Log.w(str, "Config Directory is available and folderNameList size::" + list.length);
                if (list.length == 0) {
                    return;
                }
                createDeviceList(list);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getEntitlementAndNotify(String str, String str2, boolean z) throws JSONException {
        String string = null;
        String str3 = TAG;
        Log.i(str3, "getEntitlementAndNotify");
        try {
            string = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getString(getCombinedDeviceDetail(str2, str), null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (string != null && !z && isSubscriptionValidFromStorage(string)) {
            return new JSONObject(string);
        }
        String entitlements = this.mudpHandler.getEntitlements(str2, str);
        if (entitlements != null && !isEmpty(entitlements)) {
            JSONArray jSONArray = new JSONArray(entitlements);
            int length = jSONArray.length();
            if (length > 0 && length > 0) {
                JSONObject optJSONObject = jSONArray.optJSONObject(0);
                boolean optBoolean = optJSONObject.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                Log.i(str3, "Is Valid::" + optBoolean);
                updateSubscriptionInStorage(str, str2, optJSONObject.toString());
                if (z && !optBoolean) {
                    sendExpiryNotificationToApp(str, str2);
                }
                return optJSONObject;
            }
        } else {
            Log.i(str3, "No Response from MUDP. Might be unregistered. Hence remove from storage");
            updateSubscriptionInStorage(str, str2, null);
        }
        return null;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateSubscriptionAndNotify(String str, String str2) {
        JSONArray jSONArray;
        int length;
        Log.i(TAG, "updateSubscriptionAndNotify: Device Code:" + str + " Product Code:" + str2);
        try {
            String entitlements = this.mudpHandler.getEntitlements(str2, str);
            if (entitlements == null || isEmpty(entitlements) || (length = (jSONArray = new JSONArray(entitlements)).length()) <= 0) {
                return;
            }
            for (int i = 0; i < length; i++) {
                JSONObject optJSONObject = jSONArray.optJSONObject(i);
                boolean optBoolean = optJSONObject.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                Log.i(TAG, "Is Valid::" + optBoolean);
                updateSubscriptionInStorage(str, str2, optJSONObject.toString());
                if (!optBoolean) {
                    sendExpiryNotificationToApp(str, str2);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isSubscriptionValidFromStorage(String str) {
        try {
            return new JSONObject(str).optBoolean(MapUtils.KEY_RESPONSE_VALID);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateTomTomSettings() {
        Log.i(TAG, "updateTomTomSettings");
        try {
            String systemSettings = this.mudpHandler.getSystemSettings(false);
            if (systemSettings == null || isEmpty(systemSettings)) {
                return;
            }
            SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            JSONArray jSONArray = new JSONArray(systemSettings);
            int length = jSONArray.length();
            if (length > 0) {
                for (int i = 0; i < length; i++) {
                    JSONObject jSONObject = jSONArray.getJSONObject(i);
                    String optString = jSONObject.optString("name");
                    String optString2 = jSONObject.optString(MapUtils.KEY_RESPONSE_VALUE);
                    if (optString.equals("tomtom-url")) {
                        edit.putString("tomtom-url", optString2);
                    } else if (optString.equals(MapUtils.KEY_TOM_TOM_API_KEY)) {
                        edit.putString(MapUtils.KEY_TOM_TOM_API_KEY, optString2);
                    } else if (optString.equals(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION)) {
                        edit.putString(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION, optString2);
                    }
                    edit.commit();
                    Log.i(TAG, "Settings Name:" + optString + " Value:" + optString2);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getTomTomURL:" + e);
        }
    }

    private void updateSubscriptionInStorage(String str, String str2, String str3) {
        Log.d(TAG, "updateSubscriptionInStorage");
        try {
            SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            edit.putString(getCombinedDeviceDetail(str2, str), str3);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:16:0x0016, code lost:
    
        if (r3.isEmpty() != false) goto L7;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public String getTomTomURI() {
        /*
            r5 = this;
            java.lang.String r0 = "tomtom-url"
            r1 = 0
            android.content.Context r2 = r5.mContext     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = "SDKPrefsFile"
            r4 = 0
            android.content.SharedPreferences r2 = r2.getSharedPreferences(r3, r4)     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L23
            if (r3 == 0) goto L18
            boolean r4 = r3.isEmpty()     // Catch: java.lang.Exception -> L20
            if (r4 == 0) goto L1b
        L18:
            r5.updateTomTomSettings()     // Catch: java.lang.Exception -> L20
        L1b:
            java.lang.String r0 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L20
            goto L28
        L20:
            r0 = move-exception
            r1 = r3
            goto L24
        L23:
            r0 = move-exception
        L24:
            r0.printStackTrace()
            r0 = r1
        L28:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.getTomTomURI():java.lang.String");
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:16:0x0016, code lost:
    
        if (r3.isEmpty() != false) goto L7;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public String getTomTomApiKey() {
        /*
            r5 = this;
            java.lang.String r0 = "apigee-key"
            r1 = 0
            android.content.Context r2 = r5.mContext     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = "SDKPrefsFile"
            r4 = 0
            android.content.SharedPreferences r2 = r2.getSharedPreferences(r3, r4)     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L23
            if (r3 == 0) goto L18
            boolean r4 = r3.isEmpty()     // Catch: java.lang.Exception -> L20
            if (r4 == 0) goto L1b
        L18:
            r5.updateTomTomSettings()     // Catch: java.lang.Exception -> L20
        L1b:
            java.lang.String r0 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L20
            goto L28
        L20:
            r0 = move-exception
            r1 = r3
            goto L24
        L23:
            r0 = move-exception
        L24:
            r0.printStackTrace()
            r0 = r1
        L28:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.getTomTomApiKey():java.lang.String");
    }

    /* JADX WARN: Code restructure failed: missing block: B:16:0x0016, code lost:
    
        if (r3.isEmpty() != false) goto L7;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private String getRequiredSoftwareVersion() {
        /*
            r5 = this;
            java.lang.String r0 = "required-software-version"
            r1 = 0
            android.content.Context r2 = r5.mContext     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = "SDKPrefsFile"
            r4 = 0
            android.content.SharedPreferences r2 = r2.getSharedPreferences(r3, r4)     // Catch: java.lang.Exception -> L23
            java.lang.String r3 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L23
            if (r3 == 0) goto L18
            boolean r4 = r3.isEmpty()     // Catch: java.lang.Exception -> L20
            if (r4 == 0) goto L1b
        L18:
            r5.updateTomTomSettings()     // Catch: java.lang.Exception -> L20
        L1b:
            java.lang.String r0 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L20
            goto L28
        L20:
            r0 = move-exception
            r1 = r3
            goto L24
        L23:
            r0 = move-exception
        L24:
            r0.printStackTrace()
            r0 = r1
        L28:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.getRequiredSoftwareVersion():java.lang.String");
    }

    private void sendExpiryNotificationToApp(String str, String str2) {
        Log.d(TAG, "sendExpiryNotificationToApp");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "mapSubscriptionExpiryStatus");
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put(MapUtils.KEY_SUBSCRIPTION, "Expired");
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONArray.put(jSONObject2);
            jSONObject.put("data", jSONArray);
            this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean getMapUpdateStatus() {
        String optString;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryMapUpdateFlag");
            JSONObject jSONObject2 = (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
            if (jSONObject2 == null || (optString = jSONObject2.optString("resp")) == null || !optString.equals("queryMapUpdateFlag")) {
                return false;
            }
            return jSONObject2.optBoolean("status");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean getMapAutoUpdateStatus() {
        String optString;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryAutoUpdateFlag");
            JSONObject jSONObject2 = (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
            if (jSONObject2 == null || (optString = jSONObject2.optString("resp")) == null || !optString.equals("queryAutoUpdateFlag")) {
                return false;
            }
            return jSONObject2.optBoolean("status");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean getMapAutoDownloadStatus() {
        String optString;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryAutoDownloadFlag");
            JSONObject jSONObject2 = (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
            if (jSONObject2 == null || (optString = jSONObject2.optString("resp")) == null || !optString.equals("queryAutoDownloadFlag")) {
                return false;
            }
            return jSONObject2.optBoolean("status");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public byte[] createOrUpdateFileFromHURequest(String str, boolean z, long j, long j2, byte[] bArr, int i) throws IOException {
        FileOutputStream fileOutputStream = null;
        String str2 = TAG;
        Log.i(str2, "createFileFromHURequest called::FileString:::[" + str + "]  :::" + z);
        Log.i(str2, "Data Size::" + j + "::::Content Offset::" + j2);
        Log.i(str2, "Given URL::" + str);
        String encodedURL = getEncodedURL(str);
        Log.i(str2, "Modified URL::" + encodedURL);
        String str3 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(this.mProductCode, this.mDeviceCode);
        Log.w(str2, "Path For Map File:" + str3);
        if (j2 == 0) {
            Log.i(str2, "Content Offset is 0. So check the file availability");
            File file = new File(str3, encodedURL);
            if (file.exists()) {
                Log.i(str2, "Old file is available.So delete the file::" + encodedURL);
                file.delete();
            }
        }
        File file2 = new File(str3, encodedURL);
        try {
            try {
                try {
                    if (!file2.exists()) {
                        Log.i(str2, "File is not available. So create the file");
                        file2.createNewFile();
                    }
                    FileOutputStream fileOutputStream2 = new FileOutputStream(file2, true);
                    this.mFileOutputStream = fileOutputStream2;
                    fileOutputStream2.write(bArr, 0, bArr.length);
                    fileOutputStream = this.mFileOutputStream;
                } catch (IOException e2) {
                    e2.printStackTrace();
                    FileOutputStream fileOutputStream3 = this.mFileOutputStream;
                    if (fileOutputStream3 != null) {
                        fileOutputStream3.flush();
                        this.mFileOutputStream.close();
                    }
                }
            } catch (FileNotFoundException e3) {
                e3.printStackTrace();
                FileOutputStream fileOutputStream4 = this.mFileOutputStream;
                if (fileOutputStream4 != null) {
                    fileOutputStream4.flush();
                    this.mFileOutputStream.close();
                }
            }
            if (fileOutputStream != null) {
                fileOutputStream.flush();
                this.mFileOutputStream.close();
            }
            byte[] packageResponse = Utility.packageResponse(i, 0, null);
            String str4 = TAG;
            Log.i(str4, "ERROR code : 0");
            Log.i(str4, "Response PacketData for SendGenericFileDataCommand to HU <<<" + Utility.hexString(packageResponse));
            return packageResponse;
        } catch (Throwable th) {
            FileOutputStream fileOutputStream5 = this.mFileOutputStream;
            if (fileOutputStream5 != null) {
                try {
                    fileOutputStream5.flush();
                    this.mFileOutputStream.close();
                } catch (IOException e4) {
                    e4.printStackTrace();
                }
            }
            throw th;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void uploadConfigDataToMUDPServer(String str, String str2, int i) {
        int i2;
        String str3 = TAG;
        Log.i(str3, "uploadConfigDataToMUDPServer ");
        try {
            if (!TextUtils.isEmpty(str)) {
                JSONObject currentMapDetailsFileFromStorageAsJSON = getCurrentMapDetailsFileFromStorageAsJSON(str, this.mDeviceCode, this.mProductCode);
                if (currentMapDetailsFileFromStorageAsJSON != null) {
                    Log.d(str3, "JSON to upload::" + currentMapDetailsFileFromStorageAsJSON);
                    if (isNetworkAvailable()) {
                        currentMapDetailsFileFromStorageAsJSON.put("source", "Android_SDK");
                        boolean updateDataConfiguration = this.mudpHandler.updateDataConfiguration(this.mProductCode, this.mDeviceCode, currentMapDetailsFileFromStorageAsJSON.toString(), str2);
                        Log.i(str3, "Response from Server:" + updateDataConfiguration);
                        if (updateDataConfiguration) {
                            JSONObject jSONObject = new JSONObject();
                            jSONObject.put("resp", MapUtils.REQ_UPLOAD_CURRENT_MAP_DETAILS);
                            jSONObject.put("result", 0);
                            String jSONObject2 = jSONObject.toString();
                            Log.i(str3, "uploadCurrentMapDetails Response:" + jSONObject2);
                            sendGenericResponseToHU(i, jSONObject2.getBytes("UTF8"));
                            return;
                        }
                        i2 = 3;
                        Log.e(str3, "Upload failed due to network issue");
                    } else {
                        i2 = 2;
                        Log.e(str3, "Upload JSON: Internet is unavailable.");
                    }
                } else {
                    Log.e(str3, "File is not available with mobile.");
                    i2 = 4;
                }
            } else {
                i2 = 1;
                Log.e(str3, "File Id is Empty.");
            }
            JSONObject jSONObject3 = new JSONObject();
            jSONObject3.put("resp", MapUtils.REQ_UPLOAD_CURRENT_MAP_DETAILS);
            jSONObject3.put("result", i2);
            String jSONObject4 = jSONObject3.toString();
            Log.i(str3, "uploadCurrentMapDetails Response:" + jSONObject4);
            sendGenericResponseToHU(i, jSONObject4.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getSubscriptionStatus(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "getSubscriptionStatus");
        if (str2 == null) {
            return null;
        }
        try {
            if (str2.isEmpty() || str == null || str.isEmpty()) {
                return null;
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            if (isNetworkAvailable()) {
                JSONObject entitlementAndNotify = getEntitlementAndNotify(str, str2, true);
                if (entitlementAndNotify != null) {
                    boolean optBoolean = entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                    String optString = entitlementAndNotify.optString("expiryDate");
                    jSONObject.put(MapUtils.KEY_RESPONSE_VALID, optBoolean);
                    jSONObject.put("expiryDate", optString);
                    jSONObject.put("errorCode", 0);
                } else {
                    Log.e(str3, "Not able to get Subscription detail due to unknown reason");
                    jSONObject.put("errorCode", 2);
                }
            } else {
                Log.e(str3, "Not able to get Subscription detail due to Network Error");
                jSONObject.put("errorCode", 3);
            }
            Log.i(str3, "Response for getSubscriptionStatus :" + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject removeDevices(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "removeDevices");
        if (str2 == null) {
            return null;
        }
        try {
            if (str2.isEmpty() || str == null || str.isEmpty()) {
                return null;
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            int removeDeviceProperties = removeDeviceProperties(str2, str);
            removeRegionFiles(str, str2);
            MapDataBaseHelper.getsInstance().deleteByDeviceDetails(str, str2);
            jSONObject.put("errorCode", removeDeviceProperties);
            Log.i(str3, "Response for removeDevices :" + jSONObject);
            return jSONObject;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void removeRegionFiles(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "removeRegionFiles");
        try {
            File file = new File(this.mMapsRootFolder.getAbsolutePath() + File.separator + "region_files", str.concat(str2));
            if (file.exists()) {
                Log.w(str3, "Region File Directory available. Hence delete the directory");
                deleteRecursive(file);
            } else {
                Log.e(str3, "Region FileDirectory not available");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getEntitlements() {
        int i;
        Log.i(TAG, "getEntitlements called");
        try {
            String entitlements = this.mudpHandler.getEntitlements(this.mProductCode, this.mDeviceCode);
            if (entitlements == null || isEmpty(entitlements)) {
                i = 6;
            } else {
                JSONArray jSONArray = new JSONArray(entitlements);
                int length = jSONArray.length();
                if (length > 0) {
                    int i2 = 0;
                    while (i2 < length) {
                        JSONObject jSONObject = jSONArray.getJSONObject(i2);
                        int optInt = jSONObject.optInt(MapUtils.KEY_RESPONSE_SKU_ID);
                        boolean optBoolean = jSONObject.optBoolean(MapUtils.KEY_RESPONSE_VALID);
                        Object optString = jSONObject.optString("expiryDate");
                        int i3 = length;
                        String str = TAG;
                        JSONArray jSONArray2 = jSONArray;
                        StringBuilder sb = new StringBuilder();
                        int i4 = i2;
                        sb.append("Is Valid::");
                        sb.append(optBoolean);
                        Log.i(str, sb.toString());
                        if (optBoolean) {
                            getTomTomURL();
                            sendGenericNotificationForSubscriptionStatus(1);
                            JSONObject jSONObject2 = new JSONObject();
                            jSONObject2.put(MapUtils.KEY_RESPONSE_SKU_ID, optInt);
                            jSONObject2.put("expiryDate", optString);
                            sendGenericNotificationForEntitlements(jSONObject2, 0);
                            JSONObject jSONObject3 = new JSONObject();
                            jSONObject3.put("notify", "mapSubscriptionDetails");
                            JSONArray jSONArray3 = new JSONArray();
                            JSONObject jSONObject4 = new JSONObject();
                            jSONObject4.put("deviceCode", this.mDeviceCode);
                            jSONObject4.put("productCode", this.mProductCode);
                            jSONObject4.put(MapUtils.KEY_RESPONSE_VALID, optBoolean);
                            jSONObject4.put("expiryDate", optString);
                            jSONArray3.put(jSONObject4);
                            jSONObject3.put("data", jSONArray3);
                            this.mIHACServiceCallback.notifyData(jSONObject3, "application/json", "com.hac.mapService.TomTom");
                            return;
                        }
                        Log.i(str, "Subscription expired");
                        i2 = i4 + 1;
                        length = i3;
                        jSONArray = jSONArray2;
                    }
                }
                i = 0;
            }
            Log.i(TAG, "Send invalid response to HU & mobile app");
            sendGenericNotificationForSubscriptionStatus(i);
            if (i != 0) {
                if (i == 6) {
                    JSONObject jSONObject5 = new JSONObject();
                    jSONObject5.put("notify", "error");
                    jSONObject5.put("errorCode", GenericError.NetworkFailure);
                    this.mIHACServiceCallback.notifyData(jSONObject5, "application/json", "com.hac.mapService.TomTom");
                    return;
                }
                return;
            }
            JSONObject jSONObject6 = new JSONObject();
            jSONObject6.put("notify", "mapSubscriptionExpiryStatus");
            JSONArray jSONArray4 = new JSONArray();
            JSONObject jSONObject7 = new JSONObject();
            jSONObject7.put(MapUtils.KEY_SUBSCRIPTION, "Expired");
            jSONObject7.put("deviceCode", this.mDeviceCode);
            jSONObject7.put("productCode", this.mProductCode);
            jSONArray4.put(jSONObject7);
            jSONObject6.put("data", jSONArray4);
            this.mIHACServiceCallback.notifyData(jSONObject6, "application/json", "com.hac.mapService.TomTom");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void storeMapDetailsFileID(String str, String str2, String str3) {
        Log.i(TAG, "storeMapDetailsFileID: " + str);
        try {
            SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            edit.putString(getCombinedDeviceDetailJSONFileID(str3, str2), str);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getMapDetailsFileID(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "getMapDetailsFileID");
        try {
            String string = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getString(getCombinedDeviceDetailJSONFileID(str2, str), null);
            Log.d(str3, "getMapDetailsFileID: File ID " + string + " for Device Code " + str + " and Product Code " + str2);
            if (!TextUtils.isEmpty(string)) {
                return string;
            }
            Log.e(str3, "Not able to get file Id from storage. So return default value");
            return MapUtils.FILE_NAME_MAP_DETAILS;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void sendGenericNotificationForEntitlements(JSONObject jSONObject, int i) {
        String str = TAG;
        Log.i(str, "sendGenericNotificationForEntitlements");
        try {
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("notify", MapUtils.REQ_ENTITLEMENT);
            jSONObject2.put("data", jSONObject);
            jSONObject2.put("result", i);
            String jSONObject3 = jSONObject2.toString();
            Log.i(str, "sendGenericNotification:Notification to HU" + jSONObject3);
            sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendGenericNotificationForSubscriptionStatus(int i) {
        String str = TAG;
        Log.i(str, "sendGenericNotificationForSubscriptionStatus");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", MapUtils.VALUE_MAP_SUBSCRIPTION_STATUS);
            jSONObject.put("result", i);
            String jSONObject2 = jSONObject.toString();
            Log.i(str, "sendGenericNotificationForSubscriptionStatus:Notification to HU" + jSONObject2);
            sendGenericNotification(2, jSONObject2.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendGenericNotification(int i, byte[] bArr) {
        String str = TAG;
        Log.i(str, "sendGenericNotification");
        byte[] expandByteArray = Utility.expandByteArray(null, 2);
        expandByteArray[0] = (byte) i;
        int length = bArr.length;
        byte[] expandByteArray2 = Utility.expandByteArray(expandByteArray, 2);
        Utility.ushort2Byte(expandByteArray2, Integer.valueOf(length), 2, 2);
        byte[] expandByteArray3 = Utility.expandByteArray(expandByteArray2, length);
        System.arraycopy(bArr, 0, expandByteArray3, 4, length);
        byte[] packageRequest = Utility.packageRequest(IAhaBinaryConstants.NOTIFY_GENERIC_COMMAND_CODE, expandByteArray3);
        if (this.mResponseDataCallbackToHu != null) {
            Log.i(str, "Response PacketData to HU <<< " + Utility.hexString(packageRequest));
            Log.i(str, "NotifyGenericCommand has been sent for handlerFlag " + i + " with notificationLength : " + length);
            this.mResponseDataCallbackToHu.onResponseUpdate("com.hac.mapService.TomTom", packageRequest);
        }
    }

    private void getTomTomURL() {
        JSONArray jSONArray;
        int length;
        Log.i(TAG, "getTomTomURL");
        try {
            String systemSettings = this.mudpHandler.getSystemSettings(false);
            if (systemSettings == null || isEmpty(systemSettings) || (length = (jSONArray = new JSONArray(systemSettings)).length()) <= 0) {
                return;
            }
            for (int i = 0; i < length; i++) {
                JSONObject jSONObject = jSONArray.getJSONObject(i);
                String optString = jSONObject.optString("name");
                String optString2 = jSONObject.optString(MapUtils.KEY_RESPONSE_VALUE);
                if (!optString.equals("tomtom-url")) {
                    optString.equals(MapUtils.KEY_TOM_TOM_API_KEY);
                }
                Log.i(TAG, "Settings Name:" + optString + " Value:" + optString2);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "getTomTomURL:" + e);
        }
    }

    private int getToVersionForDownload(JSONArray jSONArray) {
        int i = -1;
        for (int i2 = 0; i2 < jSONArray.length(); i2++) {
            try {
                i = jSONArray.getJSONObject(i2).getInt("toVersion");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return i;
    }

    private int getTypeForDownload(JSONArray jSONArray) {
        int i = -1;
        for (int i2 = 0; i2 < jSONArray.length(); i2++) {
            try {
                i = jSONArray.getJSONObject(i2).getInt("type");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return i;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public synchronized boolean getCatalogueForProduct(int i, int i2, int i3, String str, String str2) {
        boolean z;
        String str3 = TAG;
        Log.i(str3, "getCatalogueForProduct :" + i3);
        Log.i(str3, "Downloads Path:" + this.mMapsRootFolder.getAbsolutePath());
        z = false;
        try {
            z = Native.getInstance().getCatalogue(i, i2, Integer.valueOf(i3).intValue(), str, str2, this.mMapsRootFolder.getAbsolutePath(), this.mContext);
            Log.i(str3, "getCatalogueForProduct finished");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return z;
    }

    private boolean getCatalogueForProductWithPath(int i, int i2, int i3, String str, String str2, String str3) {
        String str4 = TAG;
        Log.i(str4, "getCatalogueForProductWithPath :" + i3);
        Log.i(str4, "getCatalogueForProductWithPath:Downloads Path:" + str3);
        try {
            try {
                Native.getInstance().getCatalogue(i, i2, Integer.valueOf(i3).intValue(), str, str2, str3, this.mContext);
                Log.i(str4, "getCatalogueForProductWithPath finished");
                return true;
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return false;
            }
        } catch (Exception e2) {
            //e = e2;
        }
        return true;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getAllAvailableMapVersion(String str, String str2, int i, int i2, int i3, List<Integer> list, List<Integer> list2, int i4, boolean z, CurrentMapDetails currentMapDetails) {
        JSONObject jSONObject;
        JSONArray jSONArray;
        JSONArray jSONArray2;
        JSONObject jSONObject2;
        boolean z2;
        JSONArray jSONArray3;
        Log.i(TAG, "getAllAvailableMapVersion ");
        synchronized (this.availableVersionObject) {
            try {
                try {
                    JSONObject jSONObject3 = new JSONObject();
                    jSONObject3.put("deviceCode", str);
                    jSONObject3.put("productCode", str2);
                    jSONObject3.put("errorCode", 0);
                    JSONArray jSONArray4 = new JSONArray();
                    JSONObject jSONObject4 = new JSONObject();
                    jSONObject4.put("supplierID", i);
                    jSONObject4.put("id", i3);
                    if (currentMapDetails != null) {
                        jSONObject4.put(MapUtils.KEY_VERSION_ID, currentMapDetails.getNds_product().get(0).getVersion_id());
                    }
                    jSONObject4.put("baselineID", i2);
                    if (currentMapDetails != null) {
                        jSONObject4.put("name", currentMapDetails.getNds_product().get(0).getName());
                    }
                    JSONArray jSONArray5 = new JSONArray();
                    int i5 = 0;
                    while (true) {
                        if (i5 >= list.size()) {
                            jSONObject = jSONObject3;
                            jSONArray = jSONArray4;
                            jSONArray2 = jSONArray5;
                            jSONObject2 = jSONObject4;
                            z2 = true;
                            break;
                        }
                        int intValue = list.get(i5).intValue();
                        jSONObject = jSONObject3;
                        int intValue2 = list2.get(i5).intValue();
                        jSONArray = jSONArray4;
                        JSONObject jSONObject5 = new JSONObject();
                        int i6 = i5;
                        JSONArray jSONArray6 = jSONArray5;
                        jSONObject2 = jSONObject4;
                        JSONObject allAvailableVersionByRegion = Native.getInstance().getAllAvailableVersionByRegion(str, str2, this.mHUModel, i, i2, i3, intValue, intValue2, getRegionNameByRegionId(currentMapDetails, intValue), this.mMapsRootFolder.getAbsolutePath(), this.mContext, jSONObject5, getTomTomURI(), getTomTomApiKey());
                        int optInt = jSONObject5.optInt(MapUtils.KEY_STATUS_CODE);
                        String str3 = TAG;
                        Log.i(str3, "Status Code: " + optInt);
                        if (optInt != 1) {
                            jSONArray2 = jSONArray6;
                            Log.e(str3, "Some Problem occurred while trying to get the version from tom tom.");
                            z2 = false;
                            break;
                        }
                        if (allAvailableVersionByRegion != null) {
                            jSONArray3 = jSONArray6;
                            jSONArray3.put(allAvailableVersionByRegion);
                        } else if (z) {
                            JSONObject jSONObject6 = new JSONObject();
                            jSONObject6.put("regionID", intValue);
                            jSONObject6.put("regionName", getRegionNameByRegionId(currentMapDetails, intValue));
                            jSONObject6.put("fromVersion", intValue2);
                            jSONArray3 = jSONArray6;
                            jSONArray3.put(jSONObject6);
                        } else {
                            jSONArray3 = jSONArray6;
                        }
                        i5 = i6 + 1;
                        jSONArray5 = jSONArray3;
                        jSONObject3 = jSONObject;
                        jSONArray4 = jSONArray;
                        jSONObject4 = jSONObject2;
                    }
                    if (!z2) {
                        return null;
                    }
                    JSONObject jSONObject7 = jSONObject2;
                    jSONObject7.put("Regions", jSONArray2);
                    JSONArray jSONArray7 = jSONArray;
                    jSONArray7.put(jSONObject7);
                    JSONObject jSONObject8 = jSONObject;
                    jSONObject8.put("products", jSONArray7);
                    String str4 = TAG;
                    Log.i(str4, "Available Region Response::" + jSONObject8.toString());
                    Log.i(str4, "getAllAvailableMapVersion finished");
                    return jSONObject8;
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    /* JADX WARN: Code restructure failed: missing block: B:127:0x0205, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:128:0x0206, code lost:
    
        r23 = r11;
        r18 = 12;
        r22 = 3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:129:0x02bf, code lost:
    
        com.harman.services.Log.e(com.harman.services.maps.MapServiceManager.TAG, "downloadRegionFile failed external try/catch");
        r0.printStackTrace();
        r10 = r17;
        r5 = false;
     */
    /* JADX WARN: Code restructure failed: missing block: B:130:0x026b, code lost:
    
        r23 = r11;
        r22 = 3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:132:0x026f, code lost:
    
        com.harman.services.Log.w(r10, "regionDataSize is Zero...");
     */
    /* JADX WARN: Code restructure failed: missing block: B:133:0x0274, code lost:
    
        r5 = false;
     */
    /* JADX WARN: Code restructure failed: missing block: B:135:0x0276, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:138:0x027b, code lost:
    
        return 12;
     */
    /* JADX WARN: Code restructure failed: missing block: B:139:0x027c, code lost:
    
        r23 = r11;
        r22 = 3;
     */
    /* JADX WARN: Code restructure failed: missing block: B:140:0x0281, code lost:
    
        com.harman.services.Log.i(r10, "It looks like map is already updated in HU");
     */
    /* JADX WARN: Code restructure failed: missing block: B:141:0x0287, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:142:0x02bd, code lost:
    
        r18 = 12;
     */
    /* JADX WARN: Code restructure failed: missing block: B:49:0x017c, code lost:
    
        if (r15.getCurrentVersionByRegionId((com.harman.services.maps.CurrentMapDetails) new com.google.gson.Gson().fromJson(r15.getCurrentMapDetailsFileFromStorageAsJSON(getMapDetailsFileID(r30, r31), r14, r13).toString(), com.harman.services.maps.CurrentMapDetails.class), r12) < r4) goto L85;
     */
    /* JADX WARN: Code restructure failed: missing block: B:50:0x017e, code lost:
    
        com.harman.services.Log.i(r10, "MUDP Version id and HU version are same. So start the download");
        r22 = r9;
        r17 = prepareRegionFilePathWithoutVersion(r30, r31, r15.mMapsRootFolder.getAbsolutePath(), r32, r33, r34, r35);
     */
    /* JADX WARN: Code restructure failed: missing block: B:51:0x01b5, code lost:
    
        if (getCatalogueForProductWithPath(r32, r33, r34, r0, r20, r17) == false) goto L82;
     */
    /* JADX WARN: Code restructure failed: missing block: B:52:0x01b7, code lost:
    
        r1 = java.lang.Long.valueOf(r15.mContext.getSharedPreferences(com.harman.services.maps.MapUtils.SDK_PREFS_NAME, 0).getLong(r15.getCombinedDeviceDetailWithRegionId(r13, r14, r12), 0));
        com.harman.services.Log.w(r10, "Region data size=" + r1);
     */
    /* JADX WARN: Code restructure failed: missing block: B:53:0x01eb, code lost:
    
        if (r1.longValue() <= 0) goto L77;
     */
    /* JADX WARN: Code restructure failed: missing block: B:57:0x01fb, code lost:
    
        if ((r1.longValue() + r15.bufferSize) < getSpaceAvailableInBytes()) goto L58;
     */
    /* JADX WARN: Code restructure failed: missing block: B:58:0x01fd, code lost:
    
        com.harman.services.Log.w(r10, "Phone Space NOT available for map downloads");
     */
    /* JADX WARN: Code restructure failed: missing block: B:61:0x0204, code lost:
    
        return 7;
     */
    /* JADX WARN: Code restructure failed: missing block: B:64:0x0217, code lost:
    
        if (r1.longValue() <= r15.cellularDownloadLimit) goto L67;
     */
    /* JADX WARN: Code restructure failed: missing block: B:65:0x0219, code lost:
    
        com.harman.services.Log.i(r10, "File size is greater than 30 MB. So check for Connectivity mode");
     */
    /* JADX WARN: Code restructure failed: missing block: B:66:0x0220, code lost:
    
        if (r22 != 2) goto L67;
     */
    /* JADX WARN: Code restructure failed: missing block: B:67:0x0222, code lost:
    
        com.harman.services.Log.e(r10, "Size is >30 MB and channel is Cellular..so return from here");
     */
    /* JADX WARN: Code restructure failed: missing block: B:70:0x022a, code lost:
    
        return 10;
     */
    /* JADX WARN: Code restructure failed: missing block: B:72:0x022f, code lost:
    
        if (r15.isDownloadCancelled(r13, r14, r12) == false) goto L72;
     */
    /* JADX WARN: Code restructure failed: missing block: B:73:0x0231, code lost:
    
        com.harman.services.Log.i(r10, "Looks like download is cancelled while processing. Hence stop the download");
     */
    /* JADX WARN: Code restructure failed: missing block: B:75:0x0237, code lost:
    
        return 5;
     */
    /* JADX WARN: Code restructure failed: missing block: B:77:0x0240, code lost:
    
        r22 = 3;
        r23 = r11;
     */
    /* JADX WARN: Code restructure failed: missing block: B:79:0x0267, code lost:
    
        r5 = com.harman.services.maps.tomtom.jni.Native.getInstance().downloadRegionFileByRegion(r30, r31, r32, r33, r34, r35, r36, r37, r17, r15.mHUModel, r15.mContext, r29, r0, r20);
     */
    /* JADX WARN: Code restructure failed: missing block: B:80:0x0268, code lost:
    
        r18 = 12;
     */
    /* JADX WARN: Removed duplicated region for block: B:114:0x043b A[Catch: all -> 0x046d, TryCatch #8 {all -> 0x046d, blocks: (B:102:0x03ff, B:103:0x041e, B:104:0x0430, B:112:0x046b, B:108:0x0436, B:114:0x043b, B:116:0x044e, B:117:0x0453, B:119:0x0455, B:121:0x045b, B:122:0x0460, B:124:0x0462), top: B:3:0x0012 }] */
    /* JADX WARN: Removed duplicated region for block: B:83:0x02ce A[Catch: all -> 0x0464, TRY_LEAVE, TryCatch #1 {all -> 0x0464, blocks: (B:78:0x0263, B:83:0x02ce, B:97:0x03ea, B:100:0x03f5, B:129:0x02bf, B:132:0x026f, B:137:0x027a, B:140:0x0281, B:146:0x02aa, B:149:0x02af), top: B:35:0x00e8 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private int downloadRegionFile(String r30, String r31, int r32, int r33, int r34, int r35, int r36, int r37) {
        /*
            Method dump skipped, instructions count: 1135
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.downloadRegionFile(java.lang.String, java.lang.String, int, int, int, int, int, int):int");
    }

    /* JADX WARN: Removed duplicated region for block: B:80:0x02a1 A[Catch: all -> 0x0319, TRY_LEAVE, TryCatch #4 {all -> 0x0319, blocks: (B:77:0x023d, B:80:0x02a1, B:99:0x0294, B:94:0x0247, B:102:0x0256, B:105:0x025d, B:110:0x0282, B:113:0x0286), top: B:34:0x00e6 }] */
    /* JADX WARN: Removed duplicated region for block: B:85:0x02fc A[Catch: all -> 0x0322, TryCatch #2 {all -> 0x0322, blocks: (B:82:0x02aa, B:83:0x02fa, B:120:0x0320, B:85:0x02fc, B:87:0x030f, B:88:0x0317), top: B:3:0x0012 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private int downloadPartialRegionFile(String r28, String r29, int r30, int r31, int r32, int r33, int r34, int r35) {
        /*
            Method dump skipped, instructions count: 804
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.MapServiceManager.downloadPartialRegionFile(java.lang.String, java.lang.String, int, int, int, int, int, int):int");
    }

    protected long getSpaceAvailableInBytes() {
        long blockSize;
        long availableBlocks;
        StatFs statFs = new StatFs(this.mContext.getFilesDir().getPath());
        if (Build.VERSION.SDK_INT >= 18) {
            blockSize = statFs.getBlockSizeLong();
            availableBlocks = statFs.getAvailableBlocksLong();
        } else {
            blockSize = statFs.getBlockSize();
            availableBlocks = statFs.getAvailableBlocks();
        }
        long j = blockSize * availableBlocks;
        Log.w(TAG, "Available phone space::" + j);
        return j;
    }

    private void sendRegionUpdateAvailableNotificationToHU(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6) {
        String str3 = TAG;
        Log.i(str3, "sendRegionUpdateAvailableNotificationToHU");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "regionUpdateAvailable");
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("productID", i3);
            jSONObject2.put("baselineID", i2);
            jSONObject2.put("supplierID", i);
            jSONObject2.put("regionID", i4);
            jSONObject2.put("fromVersion", i5);
            jSONObject2.put("toVersion", i6);
            jSONObject2.putOpt(MapUtils.KEY_TOTAL_SIZE, Long.valueOf(this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getLong(getCombinedDeviceDetailWithRegionId(str2, str, i4), 0L)));
            String str4 = MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str) + File.separator + String.valueOf(i4) + ".json";
            Log.i(str3, "Region Meta Data File Name:" + str4);
            jSONObject2.put(MapUtils.KEY_FILE_ID, str4);
            jSONArray.put(jSONObject2);
            jSONObject.put("data", jSONArray);
            String jSONObject3 = jSONObject.toString();
            Log.i(str3, "Send Region Update available :Notification to HU" + jSONObject3);
            sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void prepareRegionMetaDataFile(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, String str3) {
        JSONObject jSONObject;
        String str4 = TAG;
        Log.i(str4, "prepareRegionMetaDataFile for region id : " + i4);
        Log.i(str4, "baseFilePath:" + str3);
        try {
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("productCode", str2);
            jSONObject2.put("deviceCode", str);
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject3 = new JSONObject();
            jSONObject3.put("id", i3);
            jSONObject3.put("supplierID", i);
            jSONObject3.put("baselineID", i2);
            JSONArray jSONArray2 = new JSONArray();
            JSONObject jSONObject4 = new JSONObject();
            jSONObject4.put("regionID", i4);
            jSONObject4.put("fromVersion", i5);
            if (this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i4), false)) {
                Log.i(str4, "Partial Update");
                jSONObject4.put("type", 1);
            } else {
                Log.i(str4, "Incremental Update");
                jSONObject4.put("type", 2);
            }
            JSONArray jSONArray3 = new JSONArray();
            JSONObject jSONObject5 = new JSONObject();
            String validBaseFilePath1 = getValidBaseFilePath1(str3);
            jSONObject5.put(MapUtils.KEY_BASE_FILE_PATH, validBaseFilePath1);
            jSONObject5.put("toVersion", i6);
            JSONArray jSONArray4 = new JSONArray();
            File[] listFiles = new File(str3, "license").listFiles();
            if (listFiles != null) {
                int length = listFiles.length;
                int i7 = 0;
                while (i7 < length) {
                    File file = listFiles[i7];
                    int i8 = length;
                    JSONObject jSONObject6 = new JSONObject();
                    jSONObject6.put(MapUtils.KEY_FILE, file.getName());
                    jSONObject6.put(MapUtils.KEY_RELATIVE_FILE_PATH, "license" + File.separator);
                    jSONArray4.put(jSONObject6);
                    i7++;
                    length = i8;
                    listFiles = listFiles;
                    jSONObject2 = jSONObject2;
                }
                jSONObject = jSONObject2;
                jSONObject5.put("license", jSONArray4);
            } else {
                jSONObject = jSONObject2;
            }
            jSONObject5.put(MapUtils.KEY_FILES, getFilesWithPath(new JSONArray(), str3, validBaseFilePath1));
            jSONArray3.put(jSONObject5);
            jSONObject4.put("Updates", jSONArray3);
            jSONArray2.put(jSONObject4);
            jSONObject3.put("Regions", jSONArray2);
            jSONArray.put(jSONObject3);
            JSONObject jSONObject7 = jSONObject;
            jSONObject7.put("products", jSONArray);
            String str5 = TAG;
            Log.i(str5, "Meta Data file prepared for " + i4);
            Log.i(str5, "Meta Data is :" + jSONObject7.toString());
            createRegionMetaDataFileFromJsonObject(str, str2, i4, jSONObject7);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createRegionMetaDataFileFromJsonObject(String str, String str2, int i, JSONObject jSONObject) {
        try {
            String str3 = this.mMapsRootFolder + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
            String str4 = TAG;
            Log.i(str4, "Region Meta data file path :" + str3);
            File file = new File(str3, String.valueOf(i) + ".json");
            Log.d(str4, "isPartialUpdate :" + this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i), false));
            if (!file.exists()) {
                file.delete();
            }
            file.createNewFile();
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.append((CharSequence) jSONObject.toString());
            fileWriter.flush();
            fileWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JSONArray getUnInstallJSONArrayFromJSONObject(JSONObject jSONObject) {
        try {
            JSONArray optJSONArray = jSONObject.optJSONArray("products").getJSONObject(0).optJSONArray("Regions").getJSONObject(0).optJSONArray(MapUtils.KEY_UNINSTALL);
            if (optJSONArray == null) {
                return null;
            }
            if (optJSONArray.length() > 0) {
                return optJSONArray;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void createUpdateJSONFile(String str, String str2, String str3, JSONObject jSONObject) {
        String str4 = TAG;
        Log.d(str4, "createUpdateJSONFile:" + str3);
        try {
            String str5 = this.mMapsRootFolder + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
            Log.i(str4, "createUpdateJSONFile path :" + str5);
            File file = new File(str5, str3);
            if (file.exists()) {
                file.delete();
            }
            file.createNewFile();
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.append((CharSequence) jSONObject.toString());
            fileWriter.flush();
            fileWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String prepareRegionFilePathWithoutVersion(String str, String str2, String str3, int i, int i2, int i3, int i4) {
        String str4 = File.separator;
        String str5 = TAG;
        Log.i(str5, "Base Path:" + str3);
        try {
            String str6 = str3 + str4 + "region_files" + str4 + str.concat(str2) + str4 + i + str4 + i2 + str4 + i3 + str4 + i4 + str4 + "Update" + str4;
            Log.i(str5, "Final Path:" + str6);
            return str6;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean doHashingAndGetLicenceFile(String str, String str2, String str3, int i, int i2, int i3) {
        try {
            String format = String.format(Locale.ENGLISH, "%08d", Integer.valueOf(i3));
            String str4 = str3 + File.separator + String.format(Locale.ENGLISH, "%08d", Integer.valueOf(i)) + File.separator + String.format(Locale.ENGLISH, "%08d", Integer.valueOf(i2)) + File.separator + format;
            String str5 = TAG;
            Log.i(str5, "File Path to hash:" + str4);
            Log.i(str5, "Path to trim: " + str3);
            JSONArray filesAndGenerateHashValue = getFilesAndGenerateHashValue(new JSONArray(), str4, str3);
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            jSONObject.put(MapUtils.KEY_FILES, filesAndGenerateHashValue);
            Log.i(str5, "Licence Request Object:" + jSONObject.toString());
            File file = new File(str3, "license");
            if (!file.exists()) {
                file.mkdir();
            }
            return createLicenceFile(file.getAbsolutePath(), jSONObject);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public JSONArray getFilesWithPath(JSONArray jSONArray, String str, String str2) {
        try {
            File[] listFiles = new File(str).listFiles();
            if (listFiles == null) {
                return jSONArray;
            }
            for (File file : listFiles) {
                if (file.isDirectory()) {
                    getFilesWithPath(jSONArray, file.getAbsolutePath(), str2);
                } else if (!file.getName().toString().contains(".lic")) {
                    JSONObject jSONObject = new JSONObject();
                    jSONObject.put(MapUtils.KEY_FILE, file.getName());
                    jSONObject.put(MapUtils.KEY_RELATIVE_FILE_PATH, getValidRelativePath(file.getAbsolutePath(), str2).replace(file.getName(), ""));
                    jSONArray.put(jSONObject);
                } else {
                    Log.i(TAG, "Licence file should be excluded");
                }
            }
            return jSONArray;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getPathForLicenseRequest(String str, String str2) {
        try {
            return str.replace(str2, "");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getValidBaseFilePath(String str) {
        try {
            return str.replace(this.mMapsRootFolder.getAbsolutePath().toString(), "");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getValidBaseFilePath1(String str) {
        try {
            return str.replace(this.mMapsRootFolder.getAbsolutePath().toString() + File.separator, "");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getValidRelativePath(String str, String str2) {
        try {
            return getValidBaseFilePath(str).replace(str2, "");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public JSONArray getFilesAndGenerateHashValue(JSONArray jSONArray, String str, String str2) {
        try {
            File[] listFiles = new File(str).listFiles();
            if (listFiles == null) {
                return jSONArray;
            }
            for (File file : listFiles) {
                if (file.isDirectory()) {
                    getFilesAndGenerateHashValue(jSONArray, file.getAbsolutePath(), str2);
                } else {
                    String pathForLicenseRequest = getPathForLicenseRequest(file.getAbsolutePath(), str2);
                    String hashingValueForFile = getHashingValueForFile(file.getAbsoluteFile());
                    JSONObject jSONObject = new JSONObject();
                    jSONObject.put(MapUtils.KEY_FILE, pathForLicenseRequest);
                    jSONObject.put("sha256", hashingValueForFile);
                    jSONArray.put(jSONObject);
                }
            }
            return jSONArray;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getHashingValueForFile(File file) {
        int i;
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            FileInputStream fileInputStream = new FileInputStream(file);
            byte[] bArr = new byte[1024];
            while (true) {
                int read = fileInputStream.read(bArr);
                if (read == -1) {
                    break;
                }
                messageDigest.update(bArr, 0, read);
            }
            byte[] digest = messageDigest.digest();
            StringBuffer stringBuffer = new StringBuffer();
            for (byte b : digest) {
                stringBuffer.append(Integer.toString((b & 255) + 256, 16).substring(1));
            }
            return stringBuffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getCombinedDeviceDetailWithRegionId(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i;
        Log.d(TAG, "getCombinedDeviceDetailWithRegionId:" + str3);
        return str3;
    }

    private boolean generateLicenceFile(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6) {
        String str3 = TAG;
        Log.i(str3, "generateLicenceFile:" + i4);
        boolean z = false;
        try {
            if (isNetworkAvailable()) {
                String prepareRegionFilePathWithoutVersion = prepareRegionFilePathWithoutVersion(str, str2, this.mMapsRootFolder.getAbsolutePath(), i, i2, i3, i4);
                if (doHashingAndGetLicenceFile(str, str2, prepareRegionFilePathWithoutVersion, i, i2, i3)) {
                    prepareRegionMetaDataFile(str, str2, i, i2, i3, i4, i5, i6, prepareRegionFilePathWithoutVersion);
                    sendRegionUpdateAvailableNotificationToHU(str, str2, i, i2, i3, i4, i5, i6);
                    MapDataBaseHelper.getsInstance().updateDownloadStatus(str, str2, this.mHUModel, 3, 0L, i3, i2, i, i4, i5, i6);
                    notifyDownloadStatusToApp(3, str, str2, i3, i, i2, i4, i5, i6);
                    z = true;
                } else {
                    Log.e(str3, "Licence file operation failed again");
                    MapDataBaseHelper.getsInstance().updateDownloadStatus(str, str2, this.mHUModel, 15, 0L, i3, i2, i, i4, i5, i6);
                }
            } else {
                Log.e(str3, "No network. License file creation failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return z;
    }

    public void notifyDownloadStatusToApp(int i, String str, String str2, int i2, int i3, int i4, int i5, int i6, int i7) {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "downloadStatus");
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("productID", i2);
            jSONObject2.put("supplierID", i3);
            jSONObject2.put("baselineID", i4);
            jSONObject2.put("regionID", i5);
            jSONObject2.put("fromVersion", i6);
            jSONObject2.put("toVersion", i7);
            jSONObject2.put("status", i);
            Long valueOf = Long.valueOf(this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getLong(getCombinedDeviceDetailWithRegionId(str2, str, i5), 0L));
            String str3 = TAG;
            Log.w(str3, "Region data size=" + valueOf);
            jSONObject2.put(MapUtils.KEY_TOTAL_SIZE, valueOf);
            jSONArray.put(jSONObject2);
            jSONObject.put("data", jSONArray);
            Log.i(str3, "Download Status Notification:" + jSONObject.toString());
            notificationToApp("downloadStatus", jSONObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JSONObject getCurrentMapDetailsFromCloudAsJSON(String str, String str2) {
        Log.d(TAG, "getCurrentMapDetailsFromCloudAsJSON");
        try {
            String configuration = this.mudpHandler.getConfiguration(str2, str, "");
            if (configuration != null) {
                return new JSONObject(configuration);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getCurrentMapDetailsFileFromStorageAsJSON(String str, String str2, String str3) {
        String str4 = TAG;
        Log.d(str4, "getCurrentMapDetailsFileFromStorageAsJSON");
        try {
            String encodedURL = getEncodedURL(str);
            Log.i(str4, "Modified URL::" + encodedURL);
            File file = new File(this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str3, str2), encodedURL);
            if (!file.exists()) {
                return null;
            }
            Log.w(str4, "File is available. So get from storage");
            return new JSONObject(getStringFromInputStream(new BufferedInputStream(new FileInputStream(file))));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean createLicenceFile(String str, JSONObject jSONObject) {
        String str2 = TAG;
        Log.i(str2, "createLicenceFile called");
        if (jSONObject != null) {
            try {
                Log.i(str2, "Request Data:" + jSONObject.toString());
                boolean createLicenceFile = this.mudpHandler.createLicenceFile(jSONObject.toString(), "", str + File.separator);
                Log.i(str2, "Response from Server:" + createLicenceFile);
                if (createLicenceFile) {
                    Log.i(str2, "createLicenceFile Response received");
                    return true;
                }
                Log.i(str2, "createLicenceFile Request failed");
                return false;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    private String getStringFromInputStream(InputStream inputStream) {
        StringBuilder sb = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            try {
                BufferedReader bufferedReader2 = new BufferedReader(new InputStreamReader(inputStream));
                while (true) {
                    try {
                        String readLine = bufferedReader2.readLine();
                        if (readLine == null) {
                            break;
                        }
                        sb.append(readLine);
                    } catch (IOException e2) {
                        IOException e = e2;
                        bufferedReader = bufferedReader2;
                        e.printStackTrace();
                        if (bufferedReader != null) {
                            bufferedReader.close();
                        }
                        return sb.toString();
                    } catch (Throwable th) {
                        th = th;
                        bufferedReader = bufferedReader2;
                        if (bufferedReader != null) {
                            try {
                                bufferedReader.close();
                            } catch (IOException e3) {
                                e3.printStackTrace();
                            }
                        }
                        throw th;
                    }
                }
                bufferedReader2.close();
            } catch (IOException e4) {
                IOException  e = e4;
            }
            return sb.toString();
        } catch (Throwable th2) {
           // th = th2;
        }
        return sb.toString();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void sendGenericResponseToHU(int i, byte[] bArr) {
        String str = TAG;
        Log.i(str, "sendGenericResponseToHU called with Request Id::" + i);
        byte[] expandByteArray = Utility.expandByteArray(null, 2);
        Utility.ushort2Byte(expandByteArray, 2, 0, 2);
        byte[] expandByteArray2 = Utility.expandByteArray(expandByteArray, 2);
        Utility.ushort2Byte(expandByteArray2, Integer.valueOf(bArr.length), 2, 2);
        byte[] expandByteArray3 = Utility.expandByteArray(expandByteArray2, bArr.length);
        System.arraycopy(bArr, 0, expandByteArray3, 4, bArr.length);
        byte[] packageResponse = Utility.packageResponse(i, 0, expandByteArray3);
        if (this.mResponseDataCallbackToHu != null) {
            Log.i(str, "ERROR code : 0");
            Log.i(str, "Response PacketData for QueryGenericCommand to HU <<<" + Utility.hexString(packageResponse));
            this.mResponseDataCallbackToHu.onResponseUpdate("com.hac.mapService.TomTom", packageResponse);
        }
    }

    public boolean isEmpty(CharSequence charSequence) {
        return charSequence == null || charSequence.length() == 0;
    }

    public String getConvertedString(byte[] bArr, int i, int i2) {
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

    public String getDecodedURL(String str) {
        String str2 = TAG;
        Log.i(str2, "getDecodedURL URL is:::" + str);
        try {
            String decode = URLDecoder.decode(str, "UTF-8");
            Log.i(str2, "After Decoding URL is:::" + decode);
            return decode;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getEncodedURL(String str) {
        String str2 = TAG;
        Log.i(str2, "Given URL is:::" + str);
        try {
            String encode = URLEncoder.encode(str, "UTF-8");
            Log.i(str2, "After Encoding URL is:::" + encode);
            return encode;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override // com.harman.services.maps.tomtom.jni.IMapServiceCallback
    public void notificationToApp(String str, JSONObject jSONObject) {
        IHACServiceCallback iHACServiceCallback;
        Log.i(TAG, "notificationToApp " + str);
        if (str.equals("regionsDownloadProgress")) {
            IHACServiceCallback iHACServiceCallback2 = this.mIHACServiceCallback;
            if (iHACServiceCallback2 != null) {
                iHACServiceCallback2.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
                return;
            }
            return;
        }
        if (!str.equals("downloadStatus") || (iHACServiceCallback = this.mIHACServiceCallback) == null) {
            return;
        }
        iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
    }

    @Override // com.harman.services.maps.tomtom.jni.IMapServiceCallback
    public void notificationToHU(String str, JSONObject jSONObject) {
        try {
            String str2 = TAG;
            Log.i(str2, "notificationToHU " + str);
            if (str.equals(MapUtils.REQ_MAP_UPDATE_AVAILABLE)) {
                jSONObject.put(MapUtils.KEY_FILE_ID, MapUtils.TO_BE_UPDATED_MAP_DETAILS_JSON_FILE_NAME);
                String jSONObject2 = jSONObject.toString();
                Log.i(str2, "Map Update available Notification to HU" + jSONObject2);
                sendGenericNotification(2, jSONObject2.getBytes("UTF8"));
            } else if (str.equals("regionsDownloadProgress")) {
                String jSONObject3 = jSONObject.toString();
                Log.i(str2, "Region Download progress Notification to HU" + jSONObject3);
                sendGenericNotification(2, jSONObject3.getBytes("UTF8"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override // com.harman.services.maps.tomtom.jni.IMapServiceCallback
    public JSONObject queryToApp(String str, JSONObject jSONObject) {
        Log.i(TAG, "queryToApp " + str);
        return (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
    }

    private void zipMapDirectory() {
        String absolutePath = this.mMapsRootFolder.getAbsolutePath();
        File file = new File(this.mapsFilePathName + getDateTime() + ".zip");
        if (file.exists()) {
            file.delete();
        }
        zipDirectory(absolutePath, file.getAbsolutePath());
    }

    private String getDateTime() {
        return new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss", Locale.getDefault()).format(new Date());
    }

    public void zipDirectory(String str, String str2) {
        File file = new File(str);
        if (file.exists() && file.isDirectory()) {
            String[] list = file.list();
            try {
                ZipOutputStream zipOutputStream = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(str2)));
                byte[] bArr = new byte[2048];
                for (String str3 : list) {
                    String str4 = file + "/" + str3;
                    if (new File(str4).length() != 0) {
                        Log.i(TAG, "Adding: " + str4);
                        BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(str4), 2048);
                        zipOutputStream.putNextEntry(new ZipEntry(str3));
                        while (true) {
                            int read = bufferedInputStream.read(bArr, 0, 2048);
                            if (read == -1) {
                                break;
                            } else {
                                zipOutputStream.write(bArr, 0, read);
                            }
                        }
                        bufferedInputStream.close();
                    }
                }
                zipOutputStream.close();
            } catch (Exception e) {
                Log.e(TAG, "Exception during zipping log files." + e);
            }
            File file2 = new File(str2);
            if (file2.exists() && file2.length() == 0) {
                file2.delete();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void scheduleTimerForAutoUpdateCheck() {
        Log.i(TAG, "scheduleTimerForAutoUpdateCheck");
        if (isLibrariesLoaded()) {
            try {
                new Timer().schedule(new TimerTask() { // from class: com.harman.services.maps.MapServiceManager.21
                    @Override // java.util.TimerTask, java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManager.TAG, "scheduleTimerForEntitlementCheck Task Scheduled");
                            if (MapServiceManager.schedulerCount != 0) {
                                if (MapServiceManager.this.mDeviceCodeList.size() == 0 || MapServiceManager.this.mProductCodeList.size() == 0 || !MapServiceManager.this.isNetworkAvailable()) {
                                    return;
                                }
                                for (int i = 0; i < MapServiceManager.this.mDeviceCodeList.size(); i++) {
                                    MapServiceManager.this.updateSubscriptionAndNotify((String) MapServiceManager.this.mDeviceCodeList.get(i), (String) MapServiceManager.this.mProductCodeList.get(i));
                                }
                                MapServiceManager.this.updateTomTomSettings();
                                if (MapServiceManager.this.getMapAutoUpdateStatus()) {
                                    Log.i(MapServiceManager.TAG, "Try for Auto Update");
                                    MapServiceManager.this.doAutoUpdate();
                                    return;
                                } else {
                                    Log.e(MapServiceManager.TAG, "Auto Update is disabled");
                                    return;
                                }
                            }
                            MapServiceManager.access$4608();
                            Log.w(MapServiceManager.TAG, "This is first time schedule. So ignore it");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }, 0L, 28800000L);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void notifyToApp(JSONObject jSONObject) {
        Log.i(TAG, "notifyToApp: Notification" + jSONObject);
        try {
            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
            if (iHACServiceCallback != null) {
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void notifyFileTransferFailureToApp() {
        Log.i(TAG, "notifyFileTransferFailureToApp");
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "notifyFileTransferFailure");
            jSONObject.put("errorCode", 1);
            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
            if (iHACServiceCallback != null) {
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void checkNewDeviceProperties() {
        String str = TAG;
        Log.d(str, "checkNewDeviceProperties");
        try {
            File file = new File(this.mMapsRootFolder, MapUtils.CONFIG_FOLDER_NAME);
            if (file.exists()) {
                String[] list = file.list();
                Log.w(str, "Config Directory is available and folderNameList size::" + list.length);
                if (list.length == 0) {
                    return;
                }
                createDeviceList(list);
                if (this.mDeviceCodeList.size() == 0 || this.mProductCodeList.size() == 0 || !isNetworkAvailable()) {
                    return;
                }
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("notify", "mapSubscriptionDetails");
                JSONArray jSONArray = new JSONArray();
                for (int i = 0; i < list.length; i++) {
                    String str2 = this.mDeviceCodeList.get(i);
                    String str3 = this.mProductCodeList.get(i);
                    JSONObject entitlementAndNotify = getEntitlementAndNotify(str2, str3, true);
                    if (entitlementAndNotify != null) {
                        JSONObject jSONObject2 = new JSONObject();
                        jSONObject2.put("deviceCode", str2);
                        jSONObject2.put("productCode", str3);
                        jSONObject2.put(MapUtils.KEY_RESPONSE_VALID, entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID));
                        jSONObject2.put("expiryDate", entitlementAndNotify.optString("expiryDate"));
                        jSONArray.put(jSONObject2);
                    }
                }
                if (jSONArray.length() > 0) {
                    updateTomTomSettings();
                    jSONObject.put("data", jSONArray);
                    this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom");
                    return;
                }
                return;
            }
            Log.e(str, "Config Directory itself not available. Subaru HU is not connected at least once");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JSONObject getFileAsJSONObject(String str, String str2) {
        JSONObject jSONObject = null;
        try {
            if (!TextUtils.isEmpty(str2)) {
                File file = new File(str, getEncodedURL(str2));
                if (file.exists()) {
                    jSONObject = new JSONObject(getStringFromInputStream(new BufferedInputStream(new FileInputStream(file))));
                } else {
                    Log.i(TAG, "File Id is not available with mobile.");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "syncCurrentMapDetailsJSONFile:" + e);
        }
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void checkStoppedDownloadAndUpdateDB() {
        String str = TAG;
        Log.i(str, "checkStoppedDownloadAndUpdateDB");
        try {
            boolean isDownloadInProgress = Native.getInstance().isDownloadInProgress();
            Log.i(str, "As per class file : Download is In Progress :" + isDownloadInProgress);
            if (!isDownloadInProgress) {
                Log.i(str, "Download not in progress. So check in DB for any in progress or initiated");
                List<MapDao> allFailedListByDownloadStatus = MapDataBaseHelper.getsInstance().getAllFailedListByDownloadStatus(this.mHUModel);
                if (allFailedListByDownloadStatus != null && allFailedListByDownloadStatus.size() > 0) {
                    Log.i(str, "Some failed list is available. So reset download status: " + allFailedListByDownloadStatus.size());
                    for (MapDao mapDao : allFailedListByDownloadStatus) {
                        String str2 = TAG;
                        Log.i(str2, "Failed region id::" + mapDao.getRegionId());
                        Log.i(str2, "Failed region status::" + mapDao.getDownloadStatus());
                        Log.i(str2, "Failed Device Code::" + mapDao.getHuDeviceCode());
                        Log.i(str2, "Failed product Code::" + mapDao.getHuProductCode());
                        MapDataBaseHelper.getsInstance().deleteRowByRegionInfo(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), this.mHUModel, mapDao.getProductId(), mapDao.getBaseLineId(), mapDao.getSupplierId(), mapDao.getRegionId(), mapDao.getFromVersion(), mapDao.getToVersion());
                        deleteRegionFilesWithoutResponse(mapDao.getHuDeviceCode(), mapDao.getHuProductCode(), mapDao.getSupplierId(), mapDao.getBaseLineId(), mapDao.getProductId(), mapDao.getRegionId());
                    }
                    return;
                }
                Log.i(str, "No failed list available for Gen3");
                return;
            }
            Log.i(str, "Download already in progress");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JSONObject queryNetworkConnectivityMode() {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryNetworkConnectivityMode");
            return queryToApp("queryNetworkConnectivityMode", jSONObject);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public JSONObject queryDownloadChannelInfoToApp() {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryDownloadChannel");
            return queryToApp("queryDownloadChannel", jSONObject);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getResponseForRetrieveAvailableVersion(String str, String str2, int i) {
        try {
            JSONObject jSONObject = new JSONObject();
            if (str2 != null) {
                jSONObject.put("productCode", str2);
            }
            if (str != null) {
                jSONObject.put("deviceCode", str);
            }
            jSONObject.put("errorCode", i);
            return jSONObject;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean isNetworkAvailable() {
        try {
            JSONObject queryNetworkConnectivityMode = queryNetworkConnectivityMode();
            if (queryNetworkConnectivityMode == null) {
                return true;
            }
            String str = TAG;
            Log.i(str, "Checking for network connectivity mode");
            if (queryNetworkConnectivityMode.optInt("mode") != 0) {
                return true;
            }
            Log.e(str, "getAllAvailableMapVersion :: Network Not Available");
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }
}
