package com.harman.services.maps.tomtom.jni;

import android.content.Context;
import android.content.SharedPreferences;
import com.harman.services.Log;
import com.harman.services.maps.MapUtils;
import com.harman.services.maps.tomtom.CatalogRequest;
import com.harman.services.maps.tomtom.IPrinter;
import com.harman.services.maps.tomtom.Product;
import com.harman.services.maps.tomtom.ResourceRequest;
import com.harman.services.maps.tomtom.SummaryRequest;
import com.harman.services.maps.tomtom.UpdateInfo;
import com.harman.services.maps.tomtom.UpdateRegion;
import com.harman.services.maps.tomtom.VersionInfo;
import com.uievolution.microserver.MSWebSocket;
import java.io.File;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class Native {
    private static final int MAX_RETRY_COUNT = 3;
    private static final String TAG = "Native";
    private static Native sInstance;
    IMapServiceCallback iMapServiceCallback;
    private Context mContext;
    boolean isCatalogueFileIsDownloading = false;
    private long PARTIAL_UPDATE_SIZE_GEN_3 = 70254592;
    private long PARTIAL_UPDATE_SIZE_GEN4 = 15728640;

    public native long Client_create(ClientConfig clientConfig, String str);

    public native void Client_destroy(long j);

    public native void Client_fetchCatalog(long j, Product product);

    public native void Client_fetchUpdate1(long j, Product product, int i, boolean z);

    public native void Client_fetchUpdate2(long j, Product product, int i, int i2);

    public native void Client_fetchUpdate3(long j, UpdateRegion updateRegion, int i);

    public native void Client_fetchUpdate4(long j, UpdateRegion updateRegion, int i, int i2);

    public native VersionInfo[] Client_getAvailableVersions1(long j, Product product);

    public native VersionInfo[] Client_getAvailableVersions2(long j, UpdateRegion updateRegion);

    public native UpdateInfo Client_getUpdateInfo2(long j, Product product, int i, int i2);

    public native UpdateInfo Client_getUpdateInfo3(long j, UpdateRegion updateRegion, int i);

    public native UpdateInfo Client_getUpdateInfo4(long j, UpdateRegion updateRegion, int i, int i2);

    public native void Client_installUpdate1(long j, Product product, int i);

    public native void Client_installUpdate2(long j, UpdateRegion updateRegion, int i);

    public native void Init();

    public native void Log_setLevel(int i);

    public native void Log_setPrinter(IPrinter iPrinter);

    public native String StringFromJNI();

    public native String getUri(CatalogRequest catalogRequest);

    public native String getUri(ResourceRequest resourceRequest);

    public native String getUri(SummaryRequest summaryRequest);

    public native void ostream_write(long j, byte[] bArr, long j2);

    Native() {
    }

    public static Native getInstance() {
        if (sInstance == null) {
            sInstance = new Native();
        }
        return sInstance;
    }

    public void loadLibraries(boolean z) {
        if (z) {
            Log.v(TAG, "Loading gen4 library");
            System.loadLibrary("nds_sqlite3_crypto_gen4");
            System.loadLibrary("nds_sqlite3_gen4");
            System.loadLibrary("ndsuc_gen4");
            System.loadLibrary("tomjni4");
        } else {
            Log.v(TAG, "Loading gen5 library");
            System.loadLibrary("nds_sqlite3_crypto");
            System.loadLibrary("nds_sqlite3");
            System.loadLibrary("ndsuc");
            System.loadLibrary("tomjni5");
        }
        try {
            Log_setPrinter(new MyLogger());
            Log_setLevel(4);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Context getContext() {
        return this.mContext;
    }

    public void setContext(Context context) {
        this.mContext = context;
    }

    public synchronized boolean getCatalogue(int i, int i2, int i3, String str, String str2, String str3, Context context) {
        String str4 = TAG;
        Log.i(str4, "getCatalogue: Supplier Id " + i + " baselineMapId " + i2 + " productId " + i3 + " Tom Tom URL " + str);
        try {
            this.isCatalogueFileIsDownloading = true;
            ClientConfig clientConfig = new ClientConfig(context);
            clientConfig.setTomTomURI(str);
            clientConfig.setDownloadPath(str3);
            clientConfig.setApiKey(str2);
            DownloadManager.getInstance().cancelCurrentDownload(false);
            DownloadManager.getInstance().stopCurrentDownload(false);
            long Client_create = Client_create(clientConfig, clientConfig.getCacheDir());
            Client_fetchCatalog(Client_create, new Product(i, i2, i3));
            Client_destroy(Client_create);
            Log.i(str4, "Catalog execution finished ");
            this.isCatalogueFileIsDownloading = false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /* JADX WARN: Removed duplicated region for block: B:26:0x0216  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0322 A[Catch: Exception -> 0x05e5, TryCatch #1 {Exception -> 0x05e5, blocks: (B:39:0x0300, B:41:0x0322, B:43:0x032c, B:45:0x036b, B:46:0x03d2, B:48:0x03f0, B:50:0x0412, B:51:0x0445, B:52:0x04b9, B:55:0x04df, B:57:0x04e9, B:59:0x0510, B:61:0x052e, B:64:0x0570, B:66:0x05af, B:68:0x05bb, B:70:0x05c1, B:71:0x05d7, B:73:0x05cb, B:75:0x0549, B:80:0x03b5, B:86:0x02f4, B:92:0x0488), top: B:5:0x009b }] */
    /* JADX WARN: Removed duplicated region for block: B:48:0x03f0 A[Catch: Exception -> 0x05e5, TryCatch #1 {Exception -> 0x05e5, blocks: (B:39:0x0300, B:41:0x0322, B:43:0x032c, B:45:0x036b, B:46:0x03d2, B:48:0x03f0, B:50:0x0412, B:51:0x0445, B:52:0x04b9, B:55:0x04df, B:57:0x04e9, B:59:0x0510, B:61:0x052e, B:64:0x0570, B:66:0x05af, B:68:0x05bb, B:70:0x05c1, B:71:0x05d7, B:73:0x05cb, B:75:0x0549, B:80:0x03b5, B:86:0x02f4, B:92:0x0488), top: B:5:0x009b }] */
    /* JADX WARN: Removed duplicated region for block: B:81:0x03aa  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x02db A[Catch: Exception -> 0x0483, TRY_LEAVE, TryCatch #2 {Exception -> 0x0483, blocks: (B:27:0x0217, B:29:0x0248, B:32:0x024f, B:33:0x02a4, B:37:0x02c4, B:83:0x027c, B:84:0x02db), top: B:24:0x0214 }] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public JSONObject getAllAvailableVersionByRegion(String r37, String r38, String r39, int r40, int r41, int r42, int r43, int r44, String r45, String r46, Context r47, JSONObject r48, String r49, String r50) {
        /*
            Method dump skipped, instructions count: 1517
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.tomtom.jni.Native.getAllAvailableVersionByRegion(java.lang.String, java.lang.String, java.lang.String, int, int, int, int, int, java.lang.String, java.lang.String, android.content.Context, org.json.JSONObject, java.lang.String, java.lang.String):org.json.JSONObject");
    }

    public long getPartialUpdateSize(int i, int i2, int i3, int i4, int i5, int i6, String str, Context context, String str2, String str3) {
        String str4 = TAG;
        Log.i(str4, "getPartialUpdateSize: " + i6);
        try {
            ClientConfig clientConfig = new ClientConfig(context);
            clientConfig.setTomTomURI(str2);
            clientConfig.setApiKey(str3);
            clientConfig.setDownloadPath(str);
            clientConfig.setForcePartialUpdates(true);
            try {
                long Client_create = Client_create(clientConfig, clientConfig.getCacheDir());
                UpdateRegion updateRegion = new UpdateRegion(new Product(i, i2, i3), i4);
                UpdateInfo Client_getUpdateInfo4 = Client_getUpdateInfo4(Client_create, updateRegion, i5, 0);
                UpdateInfo Client_getUpdateInfo42 = Client_getUpdateInfo4(Client_create, updateRegion, 0, i6);
                Log.i(str4, "Partial Update: UnInstall Package Size: " + Client_getUpdateInfo4.getDataSize());
                Log.i(str4, "Partial Update: Install Package Size: " + Client_getUpdateInfo42.getDataSize());
                long dataSize = Client_getUpdateInfo4.getDataSize() + Client_getUpdateInfo42.getDataSize();
                Log.i(str4, "Final Size of the package:: " + dataSize);
                return dataSize;
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return -1L;
            }
        } catch (Exception e2) {
          //  e = e2;
        }
        return 0;
    }

    public long getPartialUpdateSizeForGen4(int i, int i2, int i3, int i4, int i5, int i6, String str, Context context, String str2, String str3) {
        String str4 = TAG;
        Log.i(str4, "getPartialUpdateSizeForGen4: " + i6);
        try {
            ClientConfig clientConfig = new ClientConfig(context);
            clientConfig.setTomTomURI(str2);
            clientConfig.setApiKey(str3);
            clientConfig.setDownloadPath(str);
            clientConfig.setForcePartialUpdates(true);
            try {
                long dataSize = Client_getUpdateInfo4(Client_create(clientConfig, clientConfig.getCacheDir()), new UpdateRegion(new Product(i, i2, i3), i4), i5, i6).getDataSize();
                Log.i(str4, "Gen4 Partial Update: Package Size: " + dataSize);
                return dataSize;
            } catch (Exception e) {
                e = e;
                e.printStackTrace();
                return -1L;
            }
        } catch (Exception e2) {
            //e = e2;
        }
        return 0;
    }

    public boolean downloadRegionFileByRegion(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, String str3, String str4, Context context, IMapServiceCallback iMapServiceCallback, String str5, String str6) {
        String str7 = TAG;
        Log.i(str7, "downloadRegionFileByRegion: Supplier Id " + i + " baselineMapId " + i2 + " productId " + i3);
        Log.i(str7, "Region Id:" + i4 + " From " + i5 + " To " + i6 + " Model : " + str4);
        ClientConfig clientConfig = new ClientConfig(context);
        clientConfig.setTomTomURI(str5);
        clientConfig.setApiKey(str6);
        clientConfig.setDownloadPath(str3);
        boolean z = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i4), false);
        StringBuilder sb = new StringBuilder();
        sb.append("Partial Update Flag : ");
        sb.append(z);
        Log.i(str7, sb.toString());
        if (z) {
            Log.i(str7, "Set the flag as true");
            clientConfig.setForcePartialUpdates(true);
        }
        this.iMapServiceCallback = iMapServiceCallback;
        long Client_create = Client_create(clientConfig, clientConfig.getCacheDir());
        UpdateRegion updateRegion = new UpdateRegion(new Product(i, i2, i3), i4);
        DownloadManager.getInstance().setDeviceCode(str);
        DownloadManager.getInstance().setProductCode(str2);
        DownloadManager.getInstance().setProductId(i3);
        DownloadManager.getInstance().setSupplierId(i);
        DownloadManager.getInstance().setBaselineId(i2);
        DownloadManager.getInstance().setRegionId(i4);
        DownloadManager.getInstance().setFromVersion(i5);
        DownloadManager.getInstance().setToVersion(i6);
        DownloadManager.getInstance().setDownloadInProgress(true);
        DownloadManager.getInstance().setModel(str4);
        DownloadManager.getInstance().cancelCurrentDownload(false);
        DownloadManager.getInstance().stopCurrentDownload(false);
        MapDao mapDao = new MapDao();
        mapDao.setProductId(i3);
        mapDao.setSupplierId(i);
        mapDao.setBaseLineId(i2);
        mapDao.setRegionId(i4);
        mapDao.setFromVersion(i5);
        mapDao.setToVersion(i6);
        mapDao.setDownloadStatus(1);
        mapDao.setHuDeviceCode(str);
        mapDao.setHuProductCode(str2);
        mapDao.setHuModel(str4);
        MapDataBaseHelper.getsInstance().insertOrUpdateDownloadInfoByRegionId(mapDao);
        DownloadManager.isDownloadInterrupted = false;
        int i7 = 3;
        while (i7 > 0) {
            UpdateRegion updateRegion2 = updateRegion;
            boolean z2 = z;
            int tryDownloadRegionFileByRegion = tryDownloadRegionFileByRegion(str, str2, i, i2, i3, i4, i5, i6, str3, str4, context, str5, str6, z2, Client_create, updateRegion2, i7);
            Log.i(TAG, "Retry required? retryCount: " + tryDownloadRegionFileByRegion);
            i7 = tryDownloadRegionFileByRegion;
            updateRegion = updateRegion2;
            z = z2;
        }
        return !DownloadManager.isDownloadInterrupted;
    }

    /* JADX WARN: Removed duplicated region for block: B:19:0x00fc  */
    /* JADX WARN: Removed duplicated region for block: B:30:0x012b  */
    /* JADX WARN: Removed duplicated region for block: B:33:0x012d  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private int tryDownloadRegionFileByRegion(String r30, String r31, int r32, int r33, int r34, int r35, int r36, int r37, String r38, String r39, Context r40, String r41, String r42, boolean r43, long r44, UpdateRegion r46, int r47) {
        /*
            Method dump skipped, instructions count: 385
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.tomtom.jni.Native.tryDownloadRegionFileByRegion(java.lang.String, java.lang.String, int, int, int, int, int, int, java.lang.String, java.lang.String, android.content.Context, java.lang.String, java.lang.String, boolean, long, com.harman.services.maps.tomtom.UpdateRegion, int):int");
    }

    private boolean isDownloadCompleted(String str, Context context, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6, boolean z) {
        String str4 = TAG;
        Log.i(str4, "File Path: " + str + " From Version : " + i5 + " To Version: " + i6);
        try {
            ClientConfig clientConfig = new ClientConfig(context);
            clientConfig.setTomTomURI(str2);
            clientConfig.setApiKey(str3);
            clientConfig.setDownloadPath(str);
            if (z) {
                clientConfig.setForcePartialUpdates(true);
            }
            UpdateInfo Client_getUpdateInfo4 = Client_getUpdateInfo4(Client_create(clientConfig, clientConfig.getCacheDir()), new UpdateRegion(new Product(i, i2, i3), i4), i5, i6);
            Log.e(str4, "isDownloadCompleted.getDataSize =" + Client_getUpdateInfo4.getDataSize());
            Log.e(str4, "isDownloadCompleted.getNumOperations =" + Client_getUpdateInfo4.getNumOperations());
            Log.e(str4, "isDownloadCompleted.getFetchedDataSize =" + Client_getUpdateInfo4.getFetchedDataSize());
            Log.e(str4, "isDownloadCompleted.isFetched =" + Client_getUpdateInfo4.isFetched());
            Log.e(str4, "isDownloadCompleted.isPartial =" + Client_getUpdateInfo4.isPartial());
            if (Client_getUpdateInfo4.isFetched()) {
                Log.i(str4, "Download is completed. Hence return true");
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Log.i(TAG, "Download is not finished. Hence return false");
        return false;
    }

    public JSONObject cancelDownload(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        SharedPreferences sharedPreferences;
        String str4;
        String str5;
        JSONObject jSONObject = null;
        String str6;
        String str7;
        String str8;
        String str9;
        String str10;
        String str11 = TAG;
        Log.i(str11, "cancelDownload:" + i4);
        try {
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("productID", i3);
            jSONObject2.put("baselineID", i2);
            jSONObject2.put("supplierID", i);
            jSONObject2.put("regionID", i4);
            jSONObject2.put("fromVersion", i5);
            jSONObject2.put("toVersion", i6);
            SharedPreferences sharedPreferences2 = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0);
            if (!sharedPreferences2.getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i4), false)) {
                sharedPreferences = sharedPreferences2;
                str4 = "errorCode";
                str5 = MapUtils.SDK_PREFS_NAME;
                jSONObject = jSONObject2;
                str6 = "It looks like download is in queue. But not processed. Hence make the status as cancelled";
                str7 = "Download Status from Storage: ";
                str8 = "Download Status is in progress. So cancel the download";
                str9 = "Download itself not initiated";
                str10 = "Download status not available";
            } else {
                if (str3.equals("Gen3.1")) {
                    Log.i(str11, "cancel Download: Partial Update:" + i4);
                    jSONObject = jSONObject2;
                    try {
                        int downloadedStatusByRegionId = MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionId(str, str2, str3, i3, i2, i, i4, i5, 0);
                        if (downloadedStatusByRegionId != 1 && downloadedStatusByRegionId != 2) {
                            if (downloadedStatusByRegionId == 3) {
                                Log.e(str11, "Download is Completed. So Check for install package status");
                                int downloadedStatusByRegionId2 = MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionId(str, str2, str3, i3, i2, i, i4, 0, i6);
                                if (downloadedStatusByRegionId2 != 1 && downloadedStatusByRegionId2 != 2) {
                                    if (downloadedStatusByRegionId2 == 3) {
                                        jSONObject.put("errorCode", 3);
                                    } else if (downloadedStatusByRegionId2 == 0) {
                                        Log.e(str11, "Download itself not initiated");
                                        jSONObject.put("errorCode", 4);
                                    } else {
                                        Log.e(str11, "Download status not available");
                                        jSONObject.put("errorCode", 4);
                                    }
                                }
                                Log.i(str11, "Download Status is in progress for update package. So cancel the download");
                                DownloadManager.getInstance().cancelCurrentDownload(true);
                                jSONObject.put("errorCode", 0);
                                MapDataBaseHelper.getsInstance().deleteRowById(str, str2, str3, i3, i2, i, i4);
                            } else if (downloadedStatusByRegionId == 0) {
                                Log.e(str11, "Download itself not initiated");
                                int i7 = sharedPreferences2.getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i4), 0);
                                Log.i(str11, "Download Status from Storage: " + i7);
                                if (i7 == 1) {
                                    Log.i(str11, "It looks like download is in queue. But not processed. Hence make the status as cancelled");
                                    SharedPreferences.Editor edit = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0).edit();
                                    edit.putInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i4), 5);
                                    edit.commit();
                                    jSONObject.put("errorCode", 0);
                                } else {
                                    jSONObject.put("errorCode", 4);
                                }
                            } else {
                                Log.e(str11, "Download status not available");
                                jSONObject.put("errorCode", 4);
                            }
                            return jSONObject;
                        }
                        Log.i(str11, "Download Status is in progress. So cancel the download");
                        DownloadManager.getInstance().cancelCurrentDownload(true);
                        jSONObject.put("errorCode", 0);
                        MapDataBaseHelper.getsInstance().deleteRowById(str, str2, str3, i3, i2, i, i4);
                        return jSONObject;
                    } catch (Exception e) {
                        e = e;
                        e.printStackTrace();
                        return null;
                    }
                }
                sharedPreferences = sharedPreferences2;
                str5 = MapUtils.SDK_PREFS_NAME;
                jSONObject = jSONObject2;
                str6 = "It looks like download is in queue. But not processed. Hence make the status as cancelled";
                str7 = "Download Status from Storage: ";
                str8 = "Download Status is in progress. So cancel the download";
                str9 = "Download itself not initiated";
                str10 = "Download status not available";
                str4 = "errorCode";
            }
            Log.i(str11, "cancel Download: Incremental Update / Gen4.0 :" + i4);
            String str12 = str10;
            String str13 = str5;
            String str14 = str6;
            String str15 = str7;
            SharedPreferences sharedPreferences3 = sharedPreferences;
            String str16 = str4;
            int downloadedStatusByRegionId3 = MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionId(str, str2, str3, i3, i2, i, i4, i5, i6);
            Log.i(str11, "Cancel Download:Download Status:" + downloadedStatusByRegionId3);
            if (downloadedStatusByRegionId3 != 1 && downloadedStatusByRegionId3 != 2) {
                if (downloadedStatusByRegionId3 == 3) {
                    Log.e(str11, "Download is Completed. So sent error code as completed");
                    jSONObject.put(str16, 3);
                } else if (downloadedStatusByRegionId3 == 0) {
                    Log.e(str11, str9);
                    int i8 = sharedPreferences3.getInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i4), 0);
                    Log.i(str11, str15 + i8);
                    if (i8 == 1) {
                        Log.i(str11, str14);
                        SharedPreferences.Editor edit2 = this.mContext.getSharedPreferences(str13, 0).edit();
                        edit2.putInt(getCombinedDeviceDetailWithRegionIdForCancelDownload(str2, str, i4), 5);
                        edit2.commit();
                        jSONObject.put(str16, 0);
                    } else {
                        jSONObject.put(str16, 4);
                    }
                } else {
                    Log.e(str11, str12);
                    jSONObject.put(str16, 2);
                }
                return jSONObject;
            }
            Log.i(str11, str8);
            DownloadManager.getInstance().cancelCurrentDownload(true);
            jSONObject.put(str16, 0);
            MapDataBaseHelper.getsInstance().deleteRowById(str, str2, str3, i3, i2, i, i4);
            return jSONObject;
        } catch (Exception e2) {
            Exception e = e2;
        }
        return jSONObject;
    }

    /* JADX WARN: Can't wrap try/catch for region: R(9:(4:41|42|43|44)|(2:49|(10:51|(9:56|(1:58)(2:59|(1:61)(1:62))|19|20|21|22|23|24|25)|63|19|20|21|22|23|24|25)(8:64|(4:66|67|68|(1:70)(1:71))(1:72)|20|21|22|23|24|25))|73|20|21|22|23|24|25) */
    /* JADX WARN: Code restructure failed: missing block: B:28:0x0301, code lost:
    
        r0 = e;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public JSONObject cancelDownloadByHU(String r38, String r39, String r40, int r41, int r42, int r43, int r44, int r45, int r46) {
        /*
            Method dump skipped, instructions count: 786
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.harman.services.maps.tomtom.jni.Native.cancelDownloadByHU(java.lang.String, java.lang.String, java.lang.String, int, int, int, int, int, int):org.json.JSONObject");
    }

    public boolean isDownloadCancelled() {
        return DownloadManager.getInstance().isCancelled();
    }

    public int downloadStatusByRegion(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        return MapDataBaseHelper.getsInstance().getDownloadedStatusByRegionId(str, str2, str3, i, i2, i3, i4, i5, i6);
    }

    public void updateFileTransferStatus(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        MapDataBaseHelper.getsInstance().updateFileTransferStatusByRegionId(str, str2, str3, i, i2, i3, i4, i5, i6, i7);
    }

    public MapDao getByRegionId(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        return MapDataBaseHelper.getsInstance().getByRegionId(str, str2, str3, i, i2, i3, i4, i5, i6);
    }

    public void notifyDownloadProgress(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7, int i8, String str3) {
        int i9;
        String str4 = TAG;
        Log.i(str4, "notifyDownloadProgress : " + i7 + " Catalogue File Download Status: " + this.isCatalogueFileIsDownloading);
        if (this.isCatalogueFileIsDownloading) {
            return;
        }
        DownloadManager.getInstance().setCurrentProgress(i7);
        if (i != 0 && i2 != 0 && i3 != 0) {
            notifyDownloadProgressToHU(str, str2, i, i2, i3, i4, i5, i6, i7, i8, str3);
            try {
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("notify", "regionsDownloadProgress");
                JSONArray jSONArray = new JSONArray();
                JSONObject jSONObject2 = new JSONObject();
                jSONObject2.put("deviceCode", str);
                jSONObject2.put("productCode", str2);
                jSONObject2.put("productID", i);
                jSONObject2.put("supplierID", i2);
                jSONObject2.put("baselineID", i3);
                jSONObject2.put("regionID", i4);
                jSONObject2.put("fromVersion", i5);
                jSONObject2.put("toVersion", i6);
                SharedPreferences sharedPreferences = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0);
                if (sharedPreferences.getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i4), false) && str3.equals("Gen3.1")) {
                    Log.i(str4, "Partial Update progress from tom tom: " + i7);
                    int i10 = sharedPreferences.getInt(getCombinedDetailsForPartialUpdateFromVersion(str2, str, i4), 0);
                    int i11 = sharedPreferences.getInt(getCombinedDetailsForPartialUpdateToVersion(str2, str, i4), 0);
                    jSONObject2.put("fromVersion", i10);
                    jSONObject2.put("toVersion", i11);
                    if (i6 == 0) {
                        i9 = i7 / 5;
                        Log.i(str4, "Partial update uninstall package download :" + i9);
                    } else {
                        int i12 = (i7 * 100) / MSWebSocket.MAX_CONTROL_FLOW_PAYLOAD_LENGTH;
                        Log.i(str4, "Partial update Install package download : " + i12);
                        i9 = i12 + 20;
                    }
                } else {
                    Log.i(str4, "Incremental update progress / Gen4 : " + i7);
                    i9 = i7;
                }
                Log.i(str4, "Final progress to App: " + i9);
                jSONObject2.put("progress", i9);
                Long valueOf = Long.valueOf(sharedPreferences.getLong(getCombinedDeviceDetailWithRegionId(str2, str, i4), 0L));
                Log.w(str4, "Region data size=" + valueOf);
                jSONObject2.put(MapUtils.KEY_TOTAL_SIZE, valueOf);
                jSONObject2.put("status", i8 == 0 ? i9 == 0 ? 1 : i9 == 100 ? 3 : (i9 <= 0 || i9 >= 100) ? 0 : 2 : i8);
                jSONArray.put(jSONObject2);
                jSONObject.put("data", jSONArray);
                Log.i(str4, "Download Progress Notification:" + jSONObject.toString());
                this.iMapServiceCallback.notificationToApp("regionsDownloadProgress", jSONObject);
                return;
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }
        }
        Log.i(str4, "This progress could be for catalogue download or region info download");
    }

    private void notifyDownloadProgressToHU(String str, String str2, int i, int i2, int i3, int i4, int i5, int i6, int i7, int i8, String str3) {
        int i9;
        int i10 = i7;
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("notify", "regionsDownloadProgress");
            JSONArray jSONArray = new JSONArray();
            JSONObject jSONObject2 = new JSONObject();
            jSONObject2.put("deviceCode", str);
            jSONObject2.put("productCode", str2);
            jSONObject2.put("productID", i);
            jSONObject2.put("supplierID", i2);
            jSONObject2.put("baselineID", i3);
            jSONObject2.put("regionID", i4);
            jSONObject2.put("fromVersion", i5);
            jSONObject2.put("toVersion", i6);
            jSONObject2.put("status", i8 == 0 ? i10 == 0 ? 1 : i10 == 100 ? 3 : (i10 <= 0 || i10 >= 100) ? 0 : 2 : i8);
            SharedPreferences sharedPreferences = this.mContext.getSharedPreferences(MapUtils.SDK_PREFS_NAME, 0);
            if (sharedPreferences.getBoolean(getCombinedDetailsForPartialUpdate(str2, str, i4), false) && str3.equals("Gen3.1")) {
                String str4 = TAG;
                Log.i(str4, "Partial Update progress from tom tom: " + i10);
                int i11 = sharedPreferences.getInt(getCombinedDetailsForPartialUpdateFromVersion(str2, str, i4), 0);
                int i12 = sharedPreferences.getInt(getCombinedDetailsForPartialUpdateToVersion(str2, str, i4), 0);
                jSONObject2.put("fromVersion", i11);
                jSONObject2.put("toVersion", i12);
                if (i6 == 0) {
                    i9 = i10 / 5;
                    Log.i(str4, "Partial update uninstall package download :" + i9);
                } else {
                    int i13 = (i10 * 100) / MSWebSocket.MAX_CONTROL_FLOW_PAYLOAD_LENGTH;
                    Log.i(str4, "Partial update Install package download : " + i13);
                    i9 = i13 + 20;
                }
                i10 = i9;
            } else {
                Log.i(TAG, "Incremental update progress / Gen4 : " + i10);
            }
            String str5 = TAG;
            Log.i(str5, "Final progress to HU: " + i10);
            jSONObject2.put("progress", i10);
            jSONArray.put(jSONObject2);
            jSONObject.put("data", jSONArray);
            Log.i(str5, "Download Progress Notification to HU:" + jSONObject.toString());
            this.iMapServiceCallback.notificationToHU("regionsDownloadProgress", jSONObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getCombinedDeviceDetailWithRegionId(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i;
        Log.d(TAG, "getCombinedDeviceDetailWithRegionId:" + str3);
        return str3;
    }

    private String getCombinedDetailsForPartialUpdate(String str, String str2, int i) {
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

    private String getCombinedDeviceDetailWithRegionIdForCancelDownload(String str, String str2, int i) {
        String str3 = str2 + "_" + str + "_" + i + "_downloadStatus";
        Log.d(TAG, "getCombinedDeviceDetailWithRegionIdForCancelDownload:" + str3);
        return str3;
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

    private String getCombinedDeviceDetail(String str, String str2) {
        String str3 = str2 + "_" + str;
        Log.d(TAG, "getCombinedFileName:" + str3);
        return str3;
    }

    public boolean isDownloadInProgress() {
        return DownloadManager.getInstance().isDownloadInProgress();
    }

    public String getUriFromJni(CatalogRequest catalogRequest) {
        return getUri(catalogRequest);
    }
}
