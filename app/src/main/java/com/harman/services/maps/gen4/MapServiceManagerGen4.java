package com.harman.services.maps.gen4;

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
import com.harman.services.maps.GenericError;
import com.harman.services.maps.MUDPHandler;
import com.harman.services.maps.MapUtils;
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
public class MapServiceManagerGen4 implements IService, IMapServiceCallback {
    private static final String REQUEST_TYPE_JSON = "application/json";
    private static final String TAG = "MapServiceManagerGen4";
    private static final String TOM_TOM_SERVICE_IDENTIFIER = "com.hac.mapService.TomTom.Gen4";
    private static final int handlerType = 4;
    public static boolean isNotificationRequiredToAppForTransferProgress = true;
    public static int schedulerCount;
    Context mContext;
    private String mDeviceCode;
    private File mMapsRootFolder;
    private String mProductCode;
    private String mVinCode;
    private MUDPHandler mudpHandler;
    IResponseDataCallback mResponseDataCallbackToHu = null;
    IHACServiceCallback mIHACServiceCallback = null;
    FileOutputStream mFileOutputStream = null;
    boolean isAutoUpdateEnabled = false;
    boolean isAutoDownloadEnabled = false;
    File mHandlerFolder = null;
    Object availableVersionObject = new Object();
    Object startDownloadObject = new Object();
    Object downloadQueueObject = new Object();
    String handlerString = "error system";
    private String mHUModel = MapUtils.PREF_LIBRARY_TYPE_GEN4;
    private String mapsFilePathName = null;
    private int cellularDownloadLimit = 31457280;
    private int bufferSize = 104857600;
    private List<String> mDeviceCodeList = new ArrayList();
    private List<String> mProductCodeList = new ArrayList();

    @Override // com.harman.services.IService
    public void disConnectedAccessory(JSONObject jSONObject) {
    }

    @Override // com.harman.services.maps.tomtom.jni.IMapServiceCallback
    public void notificationToHU(String str, JSONObject jSONObject) {
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
        new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.1
            @Override // java.lang.Runnable
            public void run() {
                MapServiceManagerGen4.this.checkStoppedDownloadAndUpdateDB();
                MapServiceManagerGen4.this.checkNewDeviceProperties();
                MapServiceManagerGen4 mapServiceManagerGen4 = MapServiceManagerGen4.this;
                mapServiceManagerGen4.checkDownloadCompletedFilesAndNotifyToHU(mapServiceManagerGen4.mDeviceCode, MapServiceManagerGen4.this.mProductCode);
            }
        }).start();
    }

    @Override // com.harman.services.IService
    public void checkForAutoUpdates() {
        Log.i(TAG, "checkForAutoUpdates now");
        new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.2
            @Override // java.lang.Runnable
            public void run() {
                MapServiceManagerGen4.this.scheduleTimerForAutoUpdateCheck();
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
        String str2 = TAG;
        Log.i(str2, "connectedAccessory:" + jSONObject);
        if (jSONObject != null) {
            String optString = jSONObject.optString("deviceCode");
            if (optString != null) {
                this.mDeviceCode = optString;
            }
            String optString2 = jSONObject.optString("productCode");
            if (optString2 != null) {
                this.mProductCode = optString2;
            }
            String optString3 = jSONObject.optString(MapUtils.KEY_VIN);
            if (optString3 != null) {
                Log.i(str2, "Received Vin Code : " + optString3);
                this.mVinCode = optString3;
            }
            String str3 = this.mDeviceCode;
            if (str3 == null || (str = this.mProductCode) == null) {
                return;
            }
            persistNewDeviceProperties(str, str3);
            prepareDeviceListForScheduler();
        }
    }

    /*  JADX ERROR: Type inference failed
        jadx.core.utils.exceptions.JadxOverflowException: Type update terminated with stack overflow, arg: (r5v13 ?? I:??[OBJECT, ARRAY]), method size: 1171
        	at jadx.core.utils.ErrorsCounter.addError(ErrorsCounter.java:59)
        	at jadx.core.utils.ErrorsCounter.error(ErrorsCounter.java:31)
        	at jadx.core.dex.attributes.nodes.NotificationAttrNode.addError(NotificationAttrNode.java:19)
        	at jadx.core.dex.visitors.typeinference.TypeInferenceVisitor.visit(TypeInferenceVisitor.java:77)
        */
    @Override // com.harman.services.IService
    public void sendAsyncRequest(Object r23, String r24, IOnQueryResponseCallback r25) {
        /*
            Method dump skipped, instructions count: 1171
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.gen4.MapServiceManagerGen4.sendAsyncRequest(java.lang.Object, java.lang.String, com.harman.services.IOnQueryResponseCallback):void");
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
    public void addDownloadIntoQueue(final String str, final String str2, final int i, final int i2, final int i3, final int i4, final int i5, final int i6, final int i7) {
        Log.i(TAG, "addDownloadIntoQueue");
        new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.12
            @Override // java.lang.Runnable
            public void run() {
                Log.i(MapServiceManagerGen4.TAG, "Download Operation is scheduled ");
                Context context = MapServiceManagerGen4.this.mContext;
                Context context2 = MapServiceManagerGen4.this.mContext;
                SharedPreferences.Editor edit = context.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                edit.putInt(MapServiceManagerGen4.this.getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i5), 1);
                edit.commit();
                MapServiceManagerGen4.this.processDownloadQueue(str, str2, i, i2, i3, i4, i5, i6, i7);
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processDownloadQueue(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        int i8 = 0;
        int downloadRegionFile;
        String str3 = TAG;
        Log.d(str3, "processDownloadQueue: " + i5);
        if (isLibrariesLoaded()) {
            synchronized (this.downloadQueueObject) {
                try {
                    Log.d(str3, "download operation started for region id: " + i5);
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
    public void doAutoUpdate() {
        String optString;
        Log.i(TAG, "doAutoUpdate");
        try {
            if (this.mDeviceCodeList.size() == 0 || this.mProductCodeList.size() == 0) {
                updateDeviceList();
            }
            if (this.mDeviceCodeList.size() <= 0 || this.mProductCodeList.size() <= 0) {
                return;
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryRegionSettings");
            JSONArray jSONArray = new JSONArray();
            for (int i = 0; i < this.mDeviceCodeList.size(); i++) {
                JSONObject jSONObject2 = new JSONObject();
                String str = this.mDeviceCodeList.get(i);
                String str2 = this.mProductCodeList.get(i);
                String str3 = TAG;
                Log.i(str3, "Stored Device Code:" + str);
                Log.i(str3, "Stored Product Code:" + str2);
                jSONObject2.put("deviceCode", str);
                jSONObject2.put("productCode", str2);
                jSONArray.put(jSONObject2);
            }
            jSONObject.put("data", jSONArray);
            JSONObject jSONObject3 = (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
            if (jSONObject3 == null || (optString = jSONObject3.optString("resp")) == null || !optString.equals("queryRegionSettings")) {
                return;
            }
            checkForAutoUpdate(jSONObject3);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void checkForAutoUpdate(JSONObject jSONObject) {
        Log.w(TAG, "checkForAutoUpdate:" + jSONObject.toString());
        try {
            JSONArray optJSONArray = jSONObject.optJSONArray("data");
            if (optJSONArray == null || optJSONArray.length() <= 0) {
                return;
            }
            int i = 0;
            int i2 = 0;
            while (i2 < optJSONArray.length()) {
                JSONObject optJSONObject = optJSONArray.optJSONObject(i2);
                if (optJSONObject != null) {
                    String optString = optJSONObject.optString("deviceCode");
                    String optString2 = optJSONObject.optString("productCode");
                    optJSONObject.optString(MapUtils.KEY_VIN);
                    int optInt = optJSONObject.optInt("errorCode");
                    String str = TAG;
                    Log.i(str, "Error Code:" + optInt);
                    if (optInt == 0) {
                        JSONObject optJSONObject2 = optJSONObject.optJSONArray("products").optJSONObject(i);
                        int optInt2 = optJSONObject2.optInt("productID");
                        int optInt3 = optJSONObject2.optInt("baselineID");
                        int optInt4 = optJSONObject2.optInt("supplierID");
                        List<Integer> arrayList = new ArrayList<>();
                        List<Integer> arrayList2 = new ArrayList<>();
                        JSONArray optJSONArray2 = optJSONObject2.optJSONArray("Regions");
                        for (int i3 = 0; i3 < optJSONArray2.length(); i3++) {
                            JSONObject optJSONObject3 = optJSONArray2.optJSONObject(i3);
                            int optInt5 = optJSONObject3.optInt("regionID");
                            int optInt6 = optJSONObject3.optInt("fromVersion");
                            arrayList2.add(Integer.valueOf(optInt5));
                            arrayList.add(Integer.valueOf(optInt6));
                        }
                        if (isNetworkAvailable()) {
                            JSONObject entitlementAndNotify = getEntitlementAndNotify(optString, optString2, false);
                            if (entitlementAndNotify != null) {
                                if (entitlementAndNotify.optBoolean(MapUtils.KEY_RESPONSE_VALID)) {
                                    if (getCatalogueForProduct(optInt4, optInt3, optInt2, getTomTomURI(), getTomTomApiKeyGen4())) {
                                        final JSONObject allAvailableMapVersion = getAllAvailableMapVersion(optString, optString2, optInt4, optInt3, optInt2, arrayList2, arrayList, 0, true);
                                        if (allAvailableMapVersion != null) {
                                            Log.i(TAG, "Success Response received. So Sent notification for Device Code:" + optString + " and product Code : " + optString2);
                                            JSONObject jSONObject2 = new JSONObject();
                                            jSONObject2.put("notify", "availableMapRegions");
                                            jSONObject2.put("data", allAvailableMapVersion);
                                            notifyAvailableRegionToApp(jSONObject2);
                                            new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.13
                                                @Override // java.lang.Runnable
                                                public void run() {
                                                    Log.i(MapServiceManagerGen4.TAG, "Do Auto download");
                                                    MapServiceManagerGen4.this.doAutoDownload(allAvailableMapVersion);
                                                }
                                            }).start();
                                        }
                                    } else {
                                        Log.e(TAG, "Catalogue file download failed");
                                    }
                                } else {
                                    Log.e(TAG, "Invalid Subscription. Hence Can't check Auto Update");
                                }
                            } else {
                                Log.e(TAG, "Not able to get Subscription. So can't check Auto Update");
                            }
                        } else {
                            Log.e(TAG, "Network is not available. So can't check Auto Update");
                        }
                    } else {
                        Log.e(str, "No Region Selected for deviceCode:" + optString + " and productCode:" + optString2);
                    }
                }
                i2++;
                i = 0;
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
                    int i4 = jSONObject3.getInt("fromVersion");
                    JSONArray optJSONArray3 = jSONObject3.optJSONArray("Updates");
                    if (optJSONArray3 != null && optJSONArray3.length() > 0) {
                        int toVersionForDownload = getToVersionForDownload(optJSONArray3);
                        int downloadStatusByRegion = Native.getInstance().downloadStatusByRegion(optString, optString2, this.mHUModel, optInt, optInt2, optInt3, i3, i4, toVersionForDownload);
                        String str4 = TAG;
                        Log.i(str4, "downloadStatus:" + downloadStatusByRegion);
                        if (downloadStatusByRegion == 15) {
                            Log.i(str4, "Licence file creation failed");
                            i = i2;
                            str = optString2;
                            if (generateLicenceFile(optString, optString2, optInt3, optInt2, optInt, i3, i4, toVersionForDownload)) {
                                Log.i(str4, "Licence creation success: " + i3);
                            } else {
                                Log.e(str4, "Licence file creation failed again while auto download " + i3);
                            }
                            str2 = optString;
                        } else {
                            i = i2;
                            str = optString2;
                            if (downloadStatusByRegion != 3 && downloadStatusByRegion != 1 && downloadStatusByRegion != 2) {
                                Log.i(str4, "Starting auto download for region id :" + i3);
                                str2 = optString;
                                addDownloadIntoQueue(optString, str, downloadStatusByRegion, optInt3, optInt2, optInt, i3, i4, toVersionForDownload);
                                Log.i(str4, "Auto download added into queue for region id :" + i3);
                            } else {
                                str2 = optString;
                                Log.i(str4, "Auto Download::File already downloaded or in progress:" + i3);
                            }
                        }
                    } else {
                        i = i2;
                        str = optString2;
                        str2 = optString;
                        Log.e(TAG, "No Update available");
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
    public void checkDownloadCompletedFilesAndNotifyToHU(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "checkDownloadCompletedFilesAndNotifyToHU");
        try {
            List<MapDao> all = MapDataBaseHelper.getsInstance().getAll(str, str2, 3, this.mHUModel);
            Log.d(str3, "Download Completed list size:" + all.size());
            if (all == null || all.size() <= 0) {
                return;
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "regionUpdateAvailable");
            JSONArray jSONArray = new JSONArray();
            for (MapDao mapDao : all) {
                if (checkRegionMetaDataFileIsAvailableInMobile(str, str2, this.mMapsRootFolder.getAbsolutePath(), String.valueOf(mapDao.getRegionId()) + ".json")) {
                    JSONObject jSONObject2 = new JSONObject();
                    jSONObject2.put("deviceCode", mapDao.getHuDeviceCode());
                    jSONObject2.put("productCode", mapDao.getHuProductCode());
                    jSONObject2.put("productID", mapDao.getProductId());
                    jSONObject2.put("baselineID", mapDao.getBaseLineId());
                    jSONObject2.put("supplierID", mapDao.getSupplierId());
                    jSONObject2.put("regionID", mapDao.getRegionId());
                    jSONObject2.put("fromVersion", mapDao.getFromVersion());
                    jSONObject2.put("toVersion", mapDao.getToVersion());
                    jSONObject2.put(MapUtils.KEY_TOTAL_SIZE, mapDao.getFileSize());
                    String validBaseFilePath1 = getValidBaseFilePath1(this.mMapsRootFolder + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str) + File.separator + String.valueOf(mapDao.getRegionId()) + ".json");
                    String str4 = TAG;
                    StringBuilder sb = new StringBuilder();
                    sb.append("Region Meta Data File name:");
                    sb.append(validBaseFilePath1);
                    Log.w(str4, sb.toString());
                    jSONObject2.put(MapUtils.KEY_FILE_ID, validBaseFilePath1);
                    jSONArray.put(jSONObject2);
                } else {
                    Log.e(TAG, "Meta Data File is not available for Region Id: " + mapDao.getRegionId());
                }
            }
            if (jSONArray.length() > 0) {
                jSONObject.put("data", jSONArray);
                if (this.mResponseDataCallbackToHu != null) {
                    String str5 = TAG;
                    Log.e(str5, "mResponseDataCallbackToHu not null");
                    IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
                    if (iHACServiceCallback != null) {
                        iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
                    }
                    String jSONObject3 = jSONObject.toString();
                    Log.i(str5, "Region update Available Notification to HU" + jSONObject3);
                    sendGenericNotification(4, jSONObject3.getBytes("UTF8"));
                    return;
                }
                String str6 = TAG;
                Log.e(str6, "mResponseDataCallbackToHu is null");
                Log.e(str6, "HU not connected");
                if (this.mIHACServiceCallback != null) {
                    Log.e(str6, "mIHACServiceCallback not null --> initMapService");
                    this.mIHACServiceCallback.initMapService(this.mContext);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getCurrentMapDetails(String str, String str2) {
        JSONObject jSONObject = null;
        Log.d(TAG, "getCurrentMapDetails");
        JSONObject jSONObject2 = null;
        try {
            jSONObject = new JSONObject();
        } catch (Exception e) {
            e = e;
        }
        try {
            jSONObject.put("deviceCode", str);
            jSONObject.put("productCode", str2);
            JSONObject currentMapDetailsFromStorageAsJSON = getCurrentMapDetailsFromStorageAsJSON(str, str2);
            if (currentMapDetailsFromStorageAsJSON != null) {
                jSONObject.put("errorCode", 0);
                jSONObject.put("mapJson", currentMapDetailsFromStorageAsJSON);
            } else {
                jSONObject.put("errorCode", 2);
            }
            return jSONObject;
        } catch (Exception e2) {
            Exception e = e2;
            jSONObject2 = jSONObject;
            e.printStackTrace();
            return jSONObject2;
        }
    }

    private void notifyAvailableRegionToApp(JSONObject jSONObject) {
        Log.i(TAG, "notifyAvailableRegionToApp:" + jSONObject);
        try {
            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
            if (iHACServiceCallback != null) {
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
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
                String prepareRegionFilePathWithDeviceAndProductCode = prepareRegionFilePathWithDeviceAndProductCode(this.mMapsRootFolder.getAbsolutePath(), str, str2, i, i2, i3, i4);
                Log.i(str3, "File Path to delete:" + prepareRegionFilePathWithDeviceAndProductCode);
                File file = new File(prepareRegionFilePathWithDeviceAndProductCode);
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
            this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
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
        JSONArray jSONArray2;
        String str7 = TAG;
        Log.i(str7, "processGenericNotification:" + str);
        try {
            JSONObject jSONObject = new JSONObject(str);
            String optString = jSONObject.optString("notify");
            Log.i(str7, "Notification Type " + optString);
            String str8 = "toVersion";
            String str9 = "fromVersion";
            String str10 = "supplierID";
            String str11 = "productCode";
            String str12 = ".json";
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
                        int optInt5 = optJSONObject.optInt("fromVersion");
                        int optInt6 = optJSONObject.optInt("toVersion");
                        int optInt7 = optJSONObject.optInt("progress");
                        String str13 = TAG;
                        StringBuilder sb = new StringBuilder();
                        jSONArray2 = optJSONArray;
                        sb.append("Transfer Progress: ");
                        sb.append(optInt7);
                        Log.d(str13, sb.toString());
                        if (optInt7 > 0 && optInt7 <= 99) {
                            Log.i(str13, "Transfer is in progress");
                            Native.getInstance().updateFileTransferStatus(optString2, optString3, this.mHUModel, 2, optInt2, optInt3, optInt4, optInt, optInt5, optInt6);
                        } else if (optInt7 == 100) {
                            Log.i(str13, "Transfer Completed");
                            Native.getInstance().updateFileTransferStatus(optString2, optString3, this.mHUModel, 3, optInt2, optInt3, optInt4, optInt, optInt5, optInt6);
                        }
                        Log.i(str13, "Transfer Progress Notification Required Status: " + isNotificationRequiredToAppForTransferProgress);
                        if (isNotificationRequiredToAppForTransferProgress) {
                            Log.i(str13, "Progress Notification to App");
                            jSONObject.put("notify", "accessoryFileTransferProgress");
                            notifyToApp(jSONObject);
                        } else {
                            Log.e(str13, "Transfer Notification flag is not enabled in app. So no need to sent progress to App");
                        }
                    } else {
                        jSONArray2 = optJSONArray;
                    }
                    i2++;
                    optJSONArray = jSONArray2;
                }
                return;
            }
            if (optString.equals(MapUtils.KEY_MAP_INSTALL_STATUS)) {
                Log.i(str7, "Request for Map Install Status");
                JSONArray optJSONArray2 = jSONObject.optJSONArray("data");
                if (optJSONArray2 == null || optJSONArray2.length() <= 0) {
                    return;
                }
                int i3 = 0;
                while (i3 < optJSONArray2.length()) {
                    JSONObject optJSONObject2 = optJSONArray2.optJSONObject(i3);
                    if (optJSONObject2 != null) {
                        String optString4 = optJSONObject2.optString("deviceCode");
                        jSONArray = optJSONArray2;
                        String optString5 = optJSONObject2.optString(str11);
                        str5 = str11;
                        int optInt8 = optJSONObject2.optInt("regionID");
                        int optInt9 = optJSONObject2.optInt("productID");
                        int optInt10 = optJSONObject2.optInt("baselineID");
                        int optInt11 = optJSONObject2.optInt(str10);
                        int optInt12 = optJSONObject2.optInt(str9);
                        int optInt13 = optJSONObject2.optInt(str8);
                        int optInt14 = optJSONObject2.optInt("accessoryTransferStatus");
                        str2 = str8;
                        String str14 = TAG;
                        str3 = str9;
                        StringBuilder sb2 = new StringBuilder();
                        str4 = str10;
                        sb2.append("accessoryTransferStatus::");
                        sb2.append(optInt14);
                        Log.i(str14, sb2.toString());
                        jSONObject.put("notify", "accessoryTransferStatus");
                        notifyToApp(jSONObject);
                        if (optInt14 == 3) {
                            MapDataBaseHelper.getsInstance().deleteRowByRegionInfo(optString4, optString5, this.mHUModel, optInt9, optInt10, optInt11, optInt8, optInt12, optInt13);
                            Log.i(str14, "Map Install Status received.so delete the region files");
                            String absolutePath = this.mMapsRootFolder.getAbsolutePath();
                            StringBuilder sb3 = new StringBuilder();
                            sb3.append(String.valueOf(optInt8));
                            str6 = str12;
                            sb3.append(str6);
                            if (checkRegionMetaDataFileIsAvailableInMobile(optString4, optString5, absolutePath, sb3.toString())) {
                                String str15 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(optString5, optString4);
                                Log.i(str14, "Meta data file is available. Hence Delete the file:" + str15);
                                deleteFiles(str15, String.valueOf(optInt8) + str6);
                            } else {
                                Log.e(str14, "Region Meta Data File is not available: " + optInt8);
                            }
                        } else {
                            str6 = str12;
                            Log.i(str14, "Accessory Transfer Status is not completed");
                        }
                    } else {
                        jSONArray = optJSONArray2;
                        str2 = str8;
                        str3 = str9;
                        str4 = str10;
                        str5 = str11;
                        str6 = str12;
                    }
                    i3++;
                    optJSONArray2 = jSONArray;
                    str12 = str6;
                    str11 = str5;
                    str8 = str2;
                    str9 = str3;
                    str10 = str4;
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
                Log.i(str2, "File is not available in mobile. So notify to app also");
                notifyFileTransferFailureToApp();
                return getFileResponse(i2, 0L, j, 0, bArr, 21);
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return null;
            }
        } catch (Exception e2) {
            Exception e = e2;
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
                Utility.ushort2Byte(expandByteArray, 4, 0, 2);
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
            } else if (optString.equals(MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.14
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            String optString3 = jSONObject.optString("mapJson");
                            MapServiceManagerGen4 mapServiceManagerGen4 = MapServiceManagerGen4.this;
                            JSONObject jSONFileFromStorage = mapServiceManagerGen4.getJSONFileFromStorage(optString3, mapServiceManagerGen4.mDeviceCode, MapServiceManagerGen4.this.mProductCode);
                            Log.i(MapServiceManagerGen4.TAG, "Current Map Details as JSON::" + jSONFileFromStorage);
                            if (jSONFileFromStorage == null) {
                                JSONObject jSONObject4 = new JSONObject();
                                jSONObject4.put("resp", MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS);
                                jSONObject4.put("result", 1);
                                String jSONObject5 = jSONObject4.toString();
                                Log.i(MapServiceManagerGen4.TAG, "SYNC JSON file has problem" + jSONObject5);
                                MapServiceManagerGen4.this.sendGenericResponseToHU(i, jSONObject5.getBytes("UTF8"));
                            } else {
                                JSONObject jSONObject6 = new JSONObject();
                                jSONObject6.put("resp", MapUtils.REQ_SYNC_CURRENT_MAP_DETAILS);
                                jSONObject6.put("result", 0);
                                String jSONObject7 = jSONObject6.toString();
                                Log.i(MapServiceManagerGen4.TAG, "Sync map Details Response:" + jSONObject7);
                                MapServiceManagerGen4.this.sendGenericResponseToHU(i, jSONObject7.getBytes("UTF8"));
                                MapServiceManagerGen4 mapServiceManagerGen42 = MapServiceManagerGen4.this;
                                mapServiceManagerGen42.storeMapDetailsFileID(optString3, mapServiceManagerGen42.mDeviceCode, MapServiceManagerGen4.this.mProductCode);
                                new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.14.1
                                    @Override // java.lang.Runnable
                                    public void run() {
                                        MapServiceManagerGen4.this.checkDownloadCompletedFilesAndNotifyToHU(MapServiceManagerGen4.this.mDeviceCode, MapServiceManagerGen4.this.mProductCode);
                                    }
                                }).start();
                                MapServiceManagerGen4 mapServiceManagerGen43 = MapServiceManagerGen4.this;
                                mapServiceManagerGen43.notifyCurrentMapDetailsToApp(mapServiceManagerGen43.mDeviceCode, MapServiceManagerGen4.this.mProductCode, jSONFileFromStorage);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals(MapUtils.REQ_UPLOAD_CURRENT_MAP_DETAILS)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.15
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManagerGen4.TAG, "Upload JSON request");
                            String optString3 = jSONObject.optString(MapUtils.KEY_DESTINATION_SERVER);
                            MapServiceManagerGen4.this.uploadConfigDataToMUDPServer(jSONObject.optString("mapJson"), optString3, i);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            } else if (optString.equals(MapUtils.REQ_DELETE_REGION_FILES)) {
                new Thread(new Runnable() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.16
                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManagerGen4.TAG, "Delete Region Files");
                            JSONArray optJSONArray = jSONObject.optJSONArray("data");
                            JSONObject jSONObject4 = new JSONObject();
                            jSONObject4.put("resp", MapUtils.REQ_DELETE_REGION_FILES);
                            JSONArray jSONArray = new JSONArray();
                            if (optJSONArray != null && optJSONArray.length() > 0) {
                                for (int i2 = 0; i2 < optJSONArray.length(); i2++) {
                                    JSONObject optJSONObject = optJSONArray.optJSONObject(i2);
                                    if (optJSONObject != null) {
                                        String optString3 = optJSONObject.optString("deviceCode");
                                        String optString4 = optJSONObject.optString("productCode");
                                        int optInt = optJSONObject.optInt("productID");
                                        jSONArray.put(MapServiceManagerGen4.this.deleteRegionFiles(optString3, optString4, optJSONObject.optInt("supplierID"), optJSONObject.optInt("baselineID"), optInt, optJSONObject.optInt("regionID"), true));
                                    }
                                }
                            }
                            jSONObject4.put("data", jSONArray);
                            String jSONObject5 = jSONObject4.toString();
                            Log.i(MapServiceManagerGen4.TAG, "Delete Region File Response:" + jSONObject5);
                            MapServiceManagerGen4.this.sendGenericResponseToHU(i, jSONObject5.getBytes("UTF8"));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            } else {
                byte[] packageResponse = Utility.packageResponse(i, 1, null);
                IResponseDataCallback iResponseDataCallback = this.mResponseDataCallbackToHu;
                if (iResponseDataCallback != null) {
                    iResponseDataCallback.onResponseUpdate("com.hac.mapService.TomTom.Gen4", packageResponse);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
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

    private boolean checkRegionMetaDataFileIsAvailableInMobile(String str, String str2, String str3, String str4) {
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
            Log.e(TAG, "Some exception while creating HU config : " + e.getMessage());
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

    private String getMapDetailsFileID(String str, String str2) {
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

    /* JADX INFO: Access modifiers changed from: private */
    public void notifyCurrentMapDetailsToApp(String str, String str2, JSONObject jSONObject) {
        Log.w(TAG, "notifyCurrentMapDetailsToApp");
        try {
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("notify", "currentMapDetails");
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("mapJson", jSONObject);
            IHACServiceCallback iHACServiceCallback = this.mIHACServiceCallback;
            if (iHACServiceCallback != null) {
                iHACServiceCallback.notifyData(jSONObject2, "application/json", "com.hac.mapService.TomTom.Gen4");
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
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void prepareDeviceListForScheduler() {
        try {
            String str = TAG;
            Log.d(str, "prepareDeviceListForScheduler:" + this.mMapsRootFolder.getAbsolutePath());
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
                    this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
                    processAllUploadPendingRequest();
                    return;
                }
                return;
            }
            Log.e(str, "Config Directory itself not available. Subaru HU is not connected at least once");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void updateDeviceList() {
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
                    this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
                }
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return z;
            }
        } catch (Exception e2) {
            Exception e = e2;
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
            if (str.equals("com.hac.mapService.TomTom.Gen4") && this.mProductCode != null && this.mDeviceCode != null) {
                if (isNetworkAvailable()) {
                    addVinToStorage(this.mDeviceCode, this.mProductCode, this.mVinCode);
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
                        String tomTomApiKeyGen4 = getTomTomApiKeyGen4();
                        String requiredSoftwareVersion = getRequiredSoftwareVersion();
                        if (requiredSoftwareVersion != null) {
                            jSONObject.put(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION, requiredSoftwareVersion);
                        }
                        Log.w(str2, "Tom Tom URI:" + tomTomURI);
                        Log.w(str2, "Tom Tom API:" + tomTomApiKeyGen4);
                        Log.w(str2, "Tom Tom Required Software Version:" + requiredSoftwareVersion);
                        i2 = i3;
                    } else {
                        Log.e(str2, "No Response from MUDP");
                        String requiredSoftwareVersion2 = getRequiredSoftwareVersion();
                        if (requiredSoftwareVersion2 != null) {
                            jSONObject.put(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION, requiredSoftwareVersion2);
                        }
                    }
                } else {
                    Log.e(str2, "No Network. So can't check subscription but give required software version if available in storage");
                    i2 = 7;
                    String requiredSoftwareVersion3 = getRequiredSoftwareVersion();
                    if (requiredSoftwareVersion3 != null) {
                        jSONObject.put(MapUtils.KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION, requiredSoftwareVersion3);
                    }
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

    private boolean getMapAutoDownloadStatus() {
        String optString;
        boolean z = false;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("query", "queryAutoDownloadFlag");
            JSONObject jSONObject2 = (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom");
            if (jSONObject2 == null || (optString = jSONObject2.optString("resp")) == null || !optString.equals("queryAutoDownloadFlag")) {
                return false;
            }
            z = jSONObject2.optBoolean("status");
            Log.w(TAG, "Auto Download Status:" + z);
            return z;
        } catch (Exception e) {
            e.printStackTrace();
            return z;
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
                JSONObject jSONFileFromStorage = getJSONFileFromStorage(str, this.mDeviceCode, this.mProductCode);
                if (jSONFileFromStorage != null) {
                    Log.d(str3, "JSON to upload::" + jSONFileFromStorage);
                    if (isNetworkAvailable()) {
                        jSONFileFromStorage.put("source", "Android_SDK");
                        boolean updateDataConfiguration = this.mudpHandler.updateDataConfiguration(this.mProductCode, this.mDeviceCode, jSONFileFromStorage.toString(), str2);
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
                        i2 = 6;
                        Log.e(str3, "Upload JSON: Internet is unavailable and added to queue");
                        addUploadJSONRequestToQueue(this.mDeviceCode, this.mProductCode);
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

    private void uploadJSONToMUDP(String str, String str2) {
        String str3 = TAG;
        Log.d(str3, "uploadJSONToMUDP: deviceCode: " + str + " ProductCodee: " + str2);
        try {
            JSONObject jSONFileFromStorage = getJSONFileFromStorage(getMapDetailsFileID(str, str2), str, str2);
            if (jSONFileFromStorage != null) {
                jSONFileFromStorage.put("source", "Android_SDK");
                if (this.mudpHandler.updateDataConfiguration(str2, str, jSONFileFromStorage.toString(), "")) {
                    Log.i(str3, "uploadJSONToMUDP Success");
                    removeUploadJSONRequestFromQueue(str, str2);
                } else {
                    Log.e(str3, "Upload failed due to unknown issue");
                }
            } else {
                Log.e(str3, "File is not available with mobile.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addUploadJSONRequestToQueue(String str, String str2) {
        Log.i(TAG, "addUploadJSONRequestToQueue");
        try {
            SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            edit.putBoolean(getCombinedDeviceDetailWithUploadRequest(str2, str), true);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addVinToStorage(String str, String str2, String str3) {
        Log.i(TAG, "addVinToStore");
        if (str3 == null || str3.length() <= 0) {
            return;
        }
        try {
            SharedPreferences sharedPreferences = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0);
            SharedPreferences.Editor edit = sharedPreferences.edit();
            String vinCodeKey = getVinCodeKey(str2, str);
            if (sharedPreferences.contains(vinCodeKey)) {
                return;
            }
            edit.putString(vinCodeKey, str3);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void removeUploadJSONRequestFromQueue(String str, String str2) {
        Log.i(TAG, "removeUploadJSONRequestFromQueue");
        try {
            SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
            edit.putBoolean(getCombinedDeviceDetailWithUploadRequest(str2, str), false);
            edit.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void processAllUploadPendingRequest() {
        Log.d(TAG, "processAllUploadPendingRequest");
        try {
            if (this.mDeviceCodeList.size() != 0 && this.mProductCodeList.size() != 0) {
                for (int i = 0; i < this.mDeviceCodeList.size(); i++) {
                    checkAndProcessUploadJSONRequestFromQueue(this.mDeviceCodeList.get(i), this.mProductCodeList.get(i));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void checkAndProcessUploadJSONRequestFromQueue(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "checkAndProcessUploadJSONRequestFromQueue");
        try {
            boolean z = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(getCombinedDeviceDetailWithUploadRequest(str2, str), false);
            Log.d(str3, "Upload pending status for DeviceCode : " + str + " and ProductCode:" + str2 + " is " + z);
            if (z) {
                uploadJSONToMUDP(str, str2);
            }
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
                    jSONObject.put("errorCode", GenericError.MapSubscriptionExpired);
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

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getEntitlementAndNotify(String str, String str2, boolean z) throws JSONException {
        String string = null;
        String string2 = null;
        String str3 = TAG;
        Log.i(str3, "getEntitlementAndNotify");
        try {
            SharedPreferences sharedPreferences = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0);
            string = sharedPreferences.getString(getCombinedDeviceDetail(str2, str), null);
            string2 = sharedPreferences.getString(getVinCodeKey(str2, str), null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (string != null && !z && isSubscriptionValidFromStorage(string)) {
            return new JSONObject(string);
        }
        String entitlements = this.mudpHandler.getEntitlements(str2, str, string2);
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
                    } else if (optString.equalsIgnoreCase(MapUtils.KEY_TOM_TOM_API_KEY_GEN4)) {
                        edit.putString(MapUtils.KEY_TOM_TOM_API_KEY_GEN4, optString2);
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
            this.mIHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
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
            Log.i(str, "Generic Notification to HU <<< " + Utility.hexString(packageRequest));
            Log.i(str, "NotifyGenericCommand has been sent for handlerFlag " + i + " with notificationLength : " + length + " with notificationData :" + bArr);
            this.mResponseDataCallbackToHu.onResponseUpdate("com.hac.mapService.TomTom.Gen4", packageRequest);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:17:0x0016, code lost:
    
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
            android.content.Context r2 = r5.mContext     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = "SDKPrefsFile"
            r4 = 0
            android.content.SharedPreferences r2 = r2.getSharedPreferences(r3, r4)     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L39
            if (r3 == 0) goto L18
            boolean r4 = r3.isEmpty()     // Catch: java.lang.Exception -> L36
            if (r4 == 0) goto L1b
        L18:
            r5.updateTomTomSettings()     // Catch: java.lang.Exception -> L36
        L1b:
            java.lang.String r1 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L36
            java.lang.String r0 = com.harman.services.maps.gen4.MapServiceManagerGen4.TAG     // Catch: java.lang.Exception -> L39
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L39
            r2.<init>()     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = "Tom Tom URI to return:"
            r2.append(r3)     // Catch: java.lang.Exception -> L39
            r2.append(r1)     // Catch: java.lang.Exception -> L39
            java.lang.String r2 = r2.toString()     // Catch: java.lang.Exception -> L39
            com.harman.services.Log.i(r0, r2)     // Catch: java.lang.Exception -> L39
            goto L3d
        L36:
            r0 = move-exception
            r1 = r3
            goto L3a
        L39:
            r0 = move-exception
        L3a:
            r0.printStackTrace()
        L3d:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.gen4.MapServiceManagerGen4.getTomTomURI():java.lang.String");
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:16:0x0016, code lost:
    
        if (r3.isEmpty() != false) goto L7;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public String getTomTomApiKeyGen4() {
        /*
            r5 = this;
            java.lang.String r0 = "apigee-key-gen4"
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
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.gen4.MapServiceManagerGen4.getTomTomApiKeyGen4():java.lang.String");
    }

    /* JADX WARN: Code restructure failed: missing block: B:17:0x0016, code lost:
    
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
            android.content.Context r2 = r5.mContext     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = "SDKPrefsFile"
            r4 = 0
            android.content.SharedPreferences r2 = r2.getSharedPreferences(r3, r4)     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L39
            if (r3 == 0) goto L18
            boolean r4 = r3.isEmpty()     // Catch: java.lang.Exception -> L36
            if (r4 == 0) goto L1b
        L18:
            r5.updateTomTomSettings()     // Catch: java.lang.Exception -> L36
        L1b:
            java.lang.String r1 = r2.getString(r0, r1)     // Catch: java.lang.Exception -> L36
            java.lang.String r0 = com.harman.services.maps.gen4.MapServiceManagerGen4.TAG     // Catch: java.lang.Exception -> L39
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L39
            r2.<init>()     // Catch: java.lang.Exception -> L39
            java.lang.String r3 = "Required Software Version: "
            r2.append(r3)     // Catch: java.lang.Exception -> L39
            r2.append(r1)     // Catch: java.lang.Exception -> L39
            java.lang.String r2 = r2.toString()     // Catch: java.lang.Exception -> L39
            com.harman.services.Log.i(r0, r2)     // Catch: java.lang.Exception -> L39
            goto L3d
        L36:
            r0 = move-exception
            r1 = r3
            goto L3a
        L39:
            r0 = move-exception
        L3a:
            r0.printStackTrace()
        L3d:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.gen4.MapServiceManagerGen4.getRequiredSoftwareVersion():java.lang.String");
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
            Exception e = e2;
        }
        return true;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public JSONObject getAllAvailableMapVersion(String str, String str2, int i, int i2, int i3, List<Integer> list, List<Integer> list2, int i4, boolean z) {
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
                    CurrentMapDetails currentMapDetailsFromStorage = getCurrentMapDetailsFromStorage(str, str2);
                    JSONObject jSONObject3 = new JSONObject();
                    jSONObject3.put("deviceCode", str);
                    jSONObject3.put("productCode", str2);
                    jSONObject3.put("errorCode", 0);
                    JSONArray jSONArray4 = new JSONArray();
                    JSONObject jSONObject4 = new JSONObject();
                    jSONObject4.put("supplierID", i);
                    jSONObject4.put("id", i3);
                    if (currentMapDetailsFromStorage != null) {
                        jSONObject4.put(MapUtils.KEY_VERSION_ID, currentMapDetailsFromStorage.getNds_product().get(0).getVersion_id());
                    }
                    jSONObject4.put("baselineID", i2);
                    if (currentMapDetailsFromStorage != null) {
                        jSONObject4.put("name", currentMapDetailsFromStorage.getNds_product().get(0).getName());
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
                        JSONObject allAvailableVersionByRegion = Native.getInstance().getAllAvailableVersionByRegion(str, str2, this.mHUModel, i, i2, i3, intValue, intValue2, getRegionNameByRegionId(currentMapDetailsFromStorage, intValue), this.mMapsRootFolder.getAbsolutePath(), this.mContext, jSONObject5, getTomTomURI(), getTomTomApiKeyGen4());
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
                            Log.v(str3, "regionObject: " + allAvailableVersionByRegion);
                            jSONArray3.put(allAvailableVersionByRegion);
                        } else if (z) {
                            JSONObject jSONObject6 = new JSONObject();
                            jSONObject6.put("regionID", intValue);
                            jSONObject6.put("regionName", getRegionNameByRegionId(currentMapDetailsFromStorage, intValue));
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

    /* JADX WARN: Code restructure failed: missing block: B:102:0x022b, code lost:
    
        r22 = r11;
     */
    /* JADX WARN: Code restructure failed: missing block: B:104:0x022d, code lost:
    
        com.harman.services.Log.w(r5, "regionDataSize is Zero...");
     */
    /* JADX WARN: Code restructure failed: missing block: B:105:0x0232, code lost:
    
        r6 = false;
        r16 = 13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:107:0x0236, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:108:0x0237, code lost:
    
        r16 = 13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:109:0x027c, code lost:
    
        com.harman.services.Log.e(com.harman.services.maps.gen4.MapServiceManagerGen4.TAG, "downloadRegionFile failed external try/catch");
        r0.printStackTrace();
        r10 = r17;
        r6 = false;
     */
    /* JADX WARN: Code restructure failed: missing block: B:112:0x023d, code lost:
    
        return 4;
     */
    /* JADX WARN: Code restructure failed: missing block: B:113:0x023e, code lost:
    
        r22 = r11;
     */
    /* JADX WARN: Code restructure failed: missing block: B:114:0x0241, code lost:
    
        com.harman.services.Log.i(r5, "It looks like map is already updated in HU");
     */
    /* JADX WARN: Code restructure failed: missing block: B:115:0x0247, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:46:0x0131, code lost:
    
        r5 = com.harman.services.maps.gen4.MapServiceManagerGen4.TAG;
        com.harman.services.Log.i(r5, "MUDP version Id: " + r4 + " for Region Id: " + r3);
     */
    /* JADX WARN: Code restructure failed: missing block: B:48:0x0151, code lost:
    
        if (r31 < r4) goto L83;
     */
    /* JADX WARN: Code restructure failed: missing block: B:49:0x0153, code lost:
    
        com.harman.services.Log.i(r5, "MUDP Version id and HU version are same. So start the download");
        r23 = r9;
        r17 = prepareRegionFilePathWithoutVersion(r25, r26, r15.mMapsRootFolder.getAbsolutePath(), r27, r28, r29, r30);
     */
    /* JADX WARN: Code restructure failed: missing block: B:50:0x0185, code lost:
    
        if (getCatalogueForProductWithPath(r27, r28, r29, r0, r20, r17) == false) goto L80;
     */
    /* JADX WARN: Code restructure failed: missing block: B:51:0x0187, code lost:
    
        r1 = java.lang.Long.valueOf(r15.mContext.getSharedPreferences(com.harman.services.maps.MapUtils.SDK_PREFS_NAME, 0).getLong(r15.getCombinedDeviceDetailWithRegionId(r13, r14, r12), 0));
        com.harman.services.Log.w(r5, "Region data size=" + r1);
     */
    /* JADX WARN: Code restructure failed: missing block: B:52:0x01b7, code lost:
    
        if (r1.longValue() <= 0) goto L75;
     */
    /* JADX WARN: Code restructure failed: missing block: B:55:0x01c7, code lost:
    
        if ((r1.longValue() + r15.bufferSize) < getSpaceAvailableInBytes()) goto L57;
     */
    /* JADX WARN: Code restructure failed: missing block: B:56:0x01c9, code lost:
    
        com.harman.services.Log.w(r5, "Phone Space NOT available for map downloads");
     */
    /* JADX WARN: Code restructure failed: missing block: B:59:0x01d0, code lost:
    
        return 7;
     */
    /* JADX WARN: Code restructure failed: missing block: B:62:0x01da, code lost:
    
        if (r1.longValue() <= r15.cellularDownloadLimit) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x01dc, code lost:
    
        com.harman.services.Log.i(r5, "File size is greater than 30 MB. So check for Connectivity mode");
     */
    /* JADX WARN: Code restructure failed: missing block: B:64:0x01e4, code lost:
    
        if (r23 != 2) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:65:0x01e6, code lost:
    
        com.harman.services.Log.e(r5, "Size is >30 MB and channel is Cellular..so return from here");
     */
    /* JADX WARN: Code restructure failed: missing block: B:68:0x01ee, code lost:
    
        return 10;
     */
    /* JADX WARN: Code restructure failed: missing block: B:70:0x01f3, code lost:
    
        if (r15.isDownloadCancelled(r13, r14, r12) == false) goto L71;
     */
    /* JADX WARN: Code restructure failed: missing block: B:71:0x01f5, code lost:
    
        com.harman.services.Log.i(r5, "Looks like download is cancelled while processing. Hence stop the download");
     */
    /* JADX WARN: Code restructure failed: missing block: B:73:0x01fb, code lost:
    
        return 5;
     */
    /* JADX WARN: Code restructure failed: missing block: B:75:0x0204, code lost:
    
        r22 = r11;
     */
    /* JADX WARN: Code restructure failed: missing block: B:77:0x0229, code lost:
    
        r6 = com.harman.services.maps.tomtom.jni.Native.getInstance().downloadRegionFileByRegion(r25, r26, r27, r28, r29, r30, r31, r32, r17, r15.mHUModel, r15.mContext, r24, r0, r20);
     */
    /* JADX WARN: Removed duplicated region for block: B:80:0x028b A[Catch: all -> 0x03f8, TRY_LEAVE, TryCatch #3 {all -> 0x03f8, blocks: (B:76:0x0225, B:80:0x028b, B:109:0x027c, B:104:0x022d, B:111:0x023c, B:114:0x0241, B:119:0x0266, B:122:0x026a, B:125:0x0270), top: B:29:0x00b2 }] */
    /* JADX WARN: Removed duplicated region for block: B:95:0x03db A[Catch: all -> 0x0401, TryCatch #0 {all -> 0x0401, blocks: (B:82:0x0294, B:84:0x02bf, B:85:0x033d, B:87:0x033f, B:89:0x036c, B:90:0x03d4, B:93:0x03d9, B:131:0x03ff, B:95:0x03db, B:97:0x03ee, B:98:0x03f6), top: B:3:0x0012 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private int downloadRegionFile(String r25, String r26, int r27, int r28, int r29, int r30, int r31, int r32) {
        /*
            Method dump skipped, instructions count: 1027
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.gen4.MapServiceManagerGen4.downloadRegionFile(java.lang.String, java.lang.String, int, int, int, int, int, int):int");
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
                    MapDataBaseHelper.getsInstance().updateDownloadStatus(str, str2, this.mHUModel, 3, 0L, i3, i2, i, i4, i5, i6);
                    notifyDownloadStatusToApp(3, str, str2, i3, i, i2, i4, i5, i6);
                    checkDownloadCompletedFilesAndNotifyToHU(str, str2);
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
            Log.i(TAG, "Region Meta data file path :" + str3);
            File file = new File(str3, String.valueOf(i) + ".json");
            if (file.exists()) {
                file.delete();
                file.createNewFile();
            } else {
                file.createNewFile();
            }
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
            String str6 = str3 + str4 + "region_files" + str4 + str.concat(str2) + str4 + i + str4 + i2 + str4 + i3 + str4 + i4 + str4;
            Log.i(str5, "Final Path:" + str6);
            return str6;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String prepareRegionFilePathWithDeviceAndProductCode(String str, String str2, String str3, int i, int i2, int i3, int i4) {
        String str4 = File.separator;
        String str5 = TAG;
        Log.i(str5, "Base Path:" + str);
        try {
            String str6 = str + str4 + "region_files" + str4 + str2.concat(str3) + str4 + i + str4 + i2 + str4 + i3 + str4 + i4 + str4;
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

    private String getPathForLicenseRequest(String str, String str2) {
        try {
            return str.replace(str2, "");
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
                        Exception e = e2;
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
                IOException e = e4;
            }
            return sb.toString();
        } catch (Throwable th2) {
            Throwable th = th2;
        }
        return sb.toString();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void sendGenericResponseToHU(int i, byte[] bArr) {
        String str = TAG;
        Log.i(str, "sendGenericResponseToHU called with Request Id::" + i);
        byte[] expandByteArray = Utility.expandByteArray(null, 2);
        Utility.ushort2Byte(expandByteArray, 4, 0, 2);
        byte[] expandByteArray2 = Utility.expandByteArray(expandByteArray, 2);
        Utility.ushort2Byte(expandByteArray2, Integer.valueOf(bArr.length), 2, 2);
        byte[] expandByteArray3 = Utility.expandByteArray(expandByteArray2, bArr.length);
        System.arraycopy(bArr, 0, expandByteArray3, 4, bArr.length);
        byte[] packageResponse = Utility.packageResponse(i, 0, expandByteArray3);
        if (this.mResponseDataCallbackToHu != null) {
            Log.i(str, "ERROR code : 0");
            Log.i(str, "Response PacketData for QueryGenericCommand to HU <<<" + Utility.hexString(packageResponse));
            this.mResponseDataCallbackToHu.onResponseUpdate("com.hac.mapService.TomTom.Gen4", packageResponse);
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
                iHACServiceCallback2.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
                return;
            }
            return;
        }
        if (!str.equals("downloadStatus") || (iHACServiceCallback = this.mIHACServiceCallback) == null) {
            return;
        }
        iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
    }

    @Override // com.harman.services.maps.tomtom.jni.IMapServiceCallback
    public JSONObject queryToApp(String str, JSONObject jSONObject) {
        Log.i(TAG, "queryToApp " + str);
        return (JSONObject) this.mIHACServiceCallback.onQuery(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
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
                new Timer().schedule(new TimerTask() { // from class: com.harman.services.maps.gen4.MapServiceManagerGen4.17
                    @Override // java.util.TimerTask, java.lang.Runnable
                    public void run() {
                        try {
                            Log.i(MapServiceManagerGen4.TAG, "scheduleTimerForEntitlementCheck Task Scheduled");
                            if (MapServiceManagerGen4.schedulerCount != 0) {
                                if (MapServiceManagerGen4.this.mDeviceCodeList.size() == 0 || MapServiceManagerGen4.this.mProductCodeList.size() == 0 || !MapServiceManagerGen4.this.isNetworkAvailable()) {
                                    return;
                                }
                                for (int i = 0; i < MapServiceManagerGen4.this.mDeviceCodeList.size(); i++) {
                                    MapServiceManagerGen4.this.updateSubscriptionAndNotify((String) MapServiceManagerGen4.this.mDeviceCodeList.get(i), (String) MapServiceManagerGen4.this.mProductCodeList.get(i));
                                }
                                MapServiceManagerGen4.this.updateTomTomSettings();
                                if (MapServiceManagerGen4.this.getMapAutoUpdateStatus()) {
                                    Log.i(MapServiceManagerGen4.TAG, "Try for Auto Update");
                                    MapServiceManagerGen4.this.doAutoUpdate();
                                    return;
                                } else {
                                    Log.e(MapServiceManagerGen4.TAG, "Auto Update is disabled");
                                    return;
                                }
                            }
                            MapServiceManagerGen4.schedulerCount++;
                            Log.w(MapServiceManagerGen4.TAG, "This is first time schedule. So ignore it");
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
                iHACServiceCallback.notifyData(jSONObject, "application/json", "com.hac.mapService.TomTom.Gen4");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
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
                    Log.i(str, "Some failed list is available. So reset download status " + allFailedListByDownloadStatus.size());
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
                Log.i(str, "No failed list available for Gen4");
                return;
            }
            Log.i(str, "Download already in progress successfully");
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
    public JSONObject getResponseForCheckForUpdate(String str, String str2, int i) {
        Log.d(TAG, "getResponseForCheckForUpdate:" + i);
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
            Log.e(str, "Network Not Available");
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }

    private String getCombinedDeviceDetail(String str, String str2) {
        String str3 = str2 + "_" + str;
        Log.d(TAG, "getCombinedFileName:" + str3);
        return str3;
    }

    private String getCombinedDeviceDetailWithRegionId(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i;
        Log.d(TAG, "getCombinedDeviceDetailWithRegionId:" + str3);
        return str3;
    }

    private String getCombinedDeviceDetailWithUploadRequest(String str, String str2) {
        String str3 = str2 + "_" + str + "_isUploadPending";
        Log.d(TAG, "getCombinedDeviceDetailWithUploadRequest:" + str3);
        return str3;
    }

    private String getVinCodeKey(String str, String str2) {
        String str3 = str + "_" + str2 + "_encodedVIN";
        Log.d(TAG, "getVinCodeKey:" + str3);
        return str3;
    }

    private String getCombinedDeviceDetailJSONFileID(String str, String str2) {
        String str3 = str2 + "_" + str + "_fileId";
        Log.d(TAG, "getCombinedDeviceDetailJSONFileID:" + str3);
        return str3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getCombinedDeviceDetailWithRegionIdForCancelDownload(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_downloadStatus";
        Log.d(TAG, "getCombinedDeviceDetailWithRegionIdForCancelDownload:" + str3);
        return str3;
    }

    private CurrentMapDetails getCurrentMapDetailsFromStorage(String str, String str2) {
        CurrentMapDetails currentMapDetailsFromCloud;
        String str3 = TAG;
        Log.d(str3, "getCurrentMapDetailsFromStorage");
        try {
            String encodedURL = getEncodedURL(getMapDetailsFileID(str, str2));
            Log.i(str3, "Modified URL::" + encodedURL);
            File file = new File(this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str), encodedURL);
            if (file.exists()) {
                Log.w(str3, "File is available. So get from storage");
                currentMapDetailsFromCloud = (CurrentMapDetails) new Gson().fromJson(new JSONObject(getStringFromInputStream(new BufferedInputStream(new FileInputStream(file)))).toString(), CurrentMapDetails.class);
            } else {
                Log.e(str3, "File is not available. So get from cloud");
                currentMapDetailsFromCloud = getCurrentMapDetailsFromCloud(str, str2);
            }
            return currentMapDetailsFromCloud;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private CurrentMapDetails getCurrentMapDetailsFromCloud(String str, String str2) {
        Log.d(TAG, "getCurrentMapDetailsFromCloud");
        try {
            String configuration = this.mudpHandler.getConfiguration(str2, str, "");
            if (configuration == null) {
                return null;
            }
            return (CurrentMapDetails) new Gson().fromJson(new JSONObject(configuration).toString(), CurrentMapDetails.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private JSONObject getCurrentMapDetailsFromStorageAsJSON(String str, String str2) {
        JSONObject currentMapDetailsFromCloudAsJSON;
        String str3 = TAG;
        Log.d(str3, "getCurrentMapDetailsFromStorageAsJSON");
        try {
            String encodedURL = getEncodedURL(getMapDetailsFileID(str, str2));
            Log.i(str3, "Modified URL::" + encodedURL);
            String str4 = this.mMapsRootFolder.getAbsolutePath() + File.separator + MapUtils.CONFIG_FOLDER_NAME + File.separator + getCombinedDeviceDetail(str2, str);
            Log.i(str3, "path for the file:" + str4);
            File file = new File(str4, encodedURL);
            if (file.exists()) {
                Log.w(str3, "File is available. So get from storage");
                currentMapDetailsFromCloudAsJSON = new JSONObject(getStringFromInputStream(new BufferedInputStream(new FileInputStream(file))));
            } else {
                Log.e(str3, "File is not available. So get from cloud");
                currentMapDetailsFromCloudAsJSON = getCurrentMapDetailsFromCloudAsJSON(str, str2);
            }
            return currentMapDetailsFromCloudAsJSON;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
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
    public JSONObject getJSONFileFromStorage(String str, String str2, String str3) {
        String str4 = TAG;
        Log.d(str4, "getJSONFileFromStorage");
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
}
