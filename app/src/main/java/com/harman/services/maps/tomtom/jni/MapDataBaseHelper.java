package com.harman.services.maps.tomtom.jni;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import com.harman.services.Log;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/* loaded from: classes.dex */
public class MapDataBaseHelper extends SQLiteOpenHelper {
    private static final String COLUMN_BASELINE_ID = "baselineId";
    private static final String COLUMN_DOWNLOADED_FILE_SIZE = "downloadedFileSize";
    private static final String COLUMN_DOWNLOAD_STATUS = "download_status";
    private static final String COLUMN_FILE_ID = "fileId";
    private static final String COLUMN_FROM_VERSION = "fromVersion";
    private static final String COLUMN_HU_DEVICE_CODE = "deviceCode";
    private static final String COLUMN_HU_MODEL = "hu_model";
    private static final String COLUMN_HU_PRODUCT_CODE = "produceCode";
    private static final String COLUMN_NOTIFICATION_SENT = "isNotification_Sent";
    private static final String COLUMN_PRODUCT_ID = "productId";
    private static final String COLUMN_REGION_ID = "regionId";
    private static final String COLUMN_REQUEST_ID = "request_id";
    private static final String COLUMN_RETRY_COUNT = "retry_count";
    private static final String COLUMN_SUPPLIER_ID = "supplierId";
    private static final String COLUMN_TO_VERSION = "toVersion";
    private static final String COLUMN_TRANSFER_STATUS = "transferStatus";
    private static final String CREATE_TABLE_TAG = "create table map_info(key_id integer primary key autoincrement, deviceCode text,produceCode text,productId text,baselineId text,supplierId text,regionId text,download_status integer,fileId text,downloadedFileSize real,fromVersion text,toVersion text,hu_model text,request_id integer,isNotification_Sent integer,retry_count integer,transferStatus integer );";
    private static final String DATABASE_NAME = "maps";
    private static final int DATABASE_VERSION = 3;
    protected static final String HU_MODEL_EQUALS = "hu_model = ?";
    protected static final String KEY_ID = "key_id";
    private static final String TABLE_HU_MAP_INFO = "map_info";
    private static final String TAG = "MapDataBaseHelper";
    protected static final String WHERE_DEVICE_CODE__AND_PRODUCT_CODE_EQUALS = "deviceCode = ? and produceCode = ?";
    protected static final String WHERE_DOWNLOAD_PROGRESS_AND_TRANSFER_STATUS_EQUALS_FOR_HU = "deviceCode = ? and produceCode = ? and download_status = ? and hu_model = ? and transferStatus = ?";
    protected static final String WHERE_DOWNLOAD_PROGRESS_EQUALS_FOR_HU = "deviceCode = ? and produceCode = ? and download_status = ? and hu_model = ?";
    protected static final String WHERE_DOWNLOAD_PROGRESS_PENDING = "download_status = ? or download_status = ?";
    protected static final String WHERE_DOWNLOAD_STATUS_IN_PROGRESS_OR_INITIATED = "download_status = ? or download_status = ?";
    protected static final String WHERE_DOWNLOAD_STATUS_IN_PROGRESS_OR_INITIATED_AND_MODEL = " ( download_status = ? or download_status = ?  ) and hu_model = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID = "productId = ? and baselineId = ? and supplierId = ? and regionId = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID_NEW = "deviceCode = ? and produceCode = ? and hu_model = ? and productId = ? and baselineId = ? and supplierId = ? and regionId = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID_WITHOUT_VERSION = "productId = ? and baselineId = ? and supplierId = ? and regionId = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID_WITH_VERSION = "productId = ? and baselineId = ? and supplierId = ? and regionId = ? and fromVersion = ? and toVersion = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW = "deviceCode = ? and produceCode = ? and productId = ? and baselineId = ? and supplierId = ? and regionId = ? and fromVersion = ? and toVersion = ?";
    protected static final String WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL = "deviceCode = ? and produceCode = ? and hu_model = ? and productId = ? and baselineId = ? and supplierId = ? and regionId = ? and fromVersion = ? and toVersion = ?";
    protected static final String WHERE_EQUALS_NOT_REGION_ID = "productId = ? and baselineId = ? and supplierId = ?";
    protected static final String WHERE_REGION_ID__AND_DOWNLOAD_PROGRESS_EQUALS = "regionId = ? and download_status = ?";
    private static MapDataBaseHelper mInstance;
    boolean debug;
    Context mContext;

    private MapDataBaseHelper(Context context) {
        super(context, DATABASE_NAME, (SQLiteDatabase.CursorFactory) null, 3);
        this.debug = true;
        this.mContext = context;
    }

    public static MapDataBaseHelper getsInstance() {
        if (mInstance == null) {
            synchronized (MapDataBaseHelper.class) {
                if (mInstance == null) {
                    mInstance = new MapDataBaseHelper(Native.getInstance().getContext());
                }
            }
        }
        return mInstance;
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onCreate(SQLiteDatabase sQLiteDatabase) {
        Log.i(TAG, "onCreate called");
        sQLiteDatabase.execSQL(CREATE_TABLE_TAG);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i, int i2) {
        Log.i(TAG, "onUpgrade called::oldVersion=" + i + "::newVersion=" + i2);
        sQLiteDatabase.execSQL("DROP TABLE IF EXISTS map_info");
        onCreate(sQLiteDatabase);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public Long insertOrUpdateDownloadInfoByRegionId(MapDao mapDao) {
        long j;
        String str = TAG;
        Log.i(str, "insertOrUpdateDownloadInfoByRegionId called::");
        try {
            SQLiteDatabase writableDatabase = getWritableDatabase();
            ContentValues contentValues = new ContentValues();
            contentValues.put("deviceCode", mapDao.getHuDeviceCode());
            contentValues.put(COLUMN_HU_PRODUCT_CODE, mapDao.getHuProductCode());
            contentValues.put(COLUMN_DOWNLOAD_STATUS, Integer.valueOf(mapDao.getDownloadStatus()));
            contentValues.put(COLUMN_PRODUCT_ID, String.valueOf(mapDao.getProductId()));
            contentValues.put(COLUMN_BASELINE_ID, String.valueOf(mapDao.getBaseLineId()));
            contentValues.put(COLUMN_SUPPLIER_ID, String.valueOf(mapDao.getSupplierId()));
            contentValues.put(COLUMN_REGION_ID, String.valueOf(mapDao.getRegionId()));
            contentValues.put("fromVersion", String.valueOf(mapDao.getFromVersion()));
            contentValues.put("toVersion", String.valueOf(mapDao.getToVersion()));
            contentValues.put(COLUMN_HU_MODEL, String.valueOf(mapDao.getHuModel()));
            j = writableDatabase.insert(TABLE_HU_MAP_INFO, null, contentValues);
            Log.i(str, "Inserted successfully with Row ID:::::" + j);
        } catch (Exception e) {
            e.printStackTrace();
            j = 0;
        }
        return Long.valueOf(j);
    }

    public void deleteRowById(String str, String str2, String str3, int i, int i2, int i3, int i4) {
        String str4 = TAG;
        Log.i(str4, "deleteRowById called:" + i4);
        long delete = (long) getWritableDatabase().delete(TABLE_HU_MAP_INFO, WHERE_EQUALS_BY_REGION_ID_NEW, new String[]{str, str2, String.valueOf(str3), String.valueOf(i), String.valueOf(i2), String.valueOf(i3), String.valueOf(i4)});
        if (delete != -1) {
            Log.i(str4, "deleted successfully: " + delete);
        }
    }

    public void deleteByDeviceDetails(String str, String str2) {
        String str3 = TAG;
        Log.i(str3, "deleteByDeviceDetails:" + str + " : " + str2);
        long delete = (long) getWritableDatabase().delete(TABLE_HU_MAP_INFO, WHERE_DEVICE_CODE__AND_PRODUCT_CODE_EQUALS, new String[]{str, str2});
        if (delete != -1) {
            Log.i(str3, "deleted successfully: " + delete);
        }
    }

    public void deleteByModel(String str) {
        String str2 = TAG;
        Log.i(str2, "deleteByModel: " + str);
        try {
            long delete = getWritableDatabase().delete(TABLE_HU_MAP_INFO, HU_MODEL_EQUALS, new String[]{str});
            if (delete != -1) {
                Log.i(str2, "delete by model success: " + delete);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteRowByRegionInfo(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        String str4 = TAG;
        Log.i(str4, "deleteRowByRegionInfo :" + i4);
        if (getWritableDatabase().delete(TABLE_HU_MAP_INFO, WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL, new String[]{str, str2, str3, String.valueOf(i), String.valueOf(i2), String.valueOf(i3), String.valueOf(i4), String.valueOf(i5), String.valueOf(i6)}) != -1) {
            Log.i(str4, "deleted successfully");
        }
    }

    public void updateDownloadStatus(String str, String str2, String str3, int i, long j, int i2, int i3, int i4, int i5, int i6, int i7) {
        String str4 = TAG;
        Log.i(str4, "updateDownloadStatus :" + i + " Device Code: " + str + " Product Code: " + str2 + " Model " + str3);
        StringBuilder sb = new StringBuilder();
        sb.append("Region Id: ");
        sb.append(i5);
        sb.append(" From Version: ");
        sb.append(i6);
        sb.append(" To Version: ");
        sb.append(i7);
        Log.i(str4, sb.toString());
        SQLiteDatabase writableDatabase = getWritableDatabase();
        String[] strArr = {str, str2, str3, String.valueOf(i2), String.valueOf(i3), String.valueOf(i4), String.valueOf(i5), String.valueOf(i6), String.valueOf(i7)};
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_DOWNLOAD_STATUS, Integer.valueOf(i));
        if (j > 0) {
            contentValues.put(COLUMN_DOWNLOADED_FILE_SIZE, Long.valueOf(j));
        }
        if (writableDatabase.update(TABLE_HU_MAP_INFO, contentValues, WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL, strArr) != -1) {
            Log.i(str4, "Updated successfully");
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public void updateFileTransferStatusByRegionId(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6, int i7) {
        String str4 = TAG;
        Log.i(str4, "updateFileTransferStatusByRegionId called:" + i);
        SQLiteDatabase writableDatabase = getWritableDatabase();
        String[] strArr = {str, str2, str3, String.valueOf(i2), String.valueOf(i3), String.valueOf(i4), String.valueOf(i5), String.valueOf(i6), String.valueOf(i7)};
        ContentValues r5 = new ContentValues();
        r5.put(COLUMN_TRANSFER_STATUS, Integer.valueOf(i));
        if (writableDatabase.update(TABLE_HU_MAP_INFO, r5, WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL, strArr) != -1) {
            Log.i(str4, "updateFileTransferStatusByRegionId success");
        }
    }

    public MapDao getByRegionId(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        Log.i(TAG, "getByRegionId");
        MapDao mapDao = new MapDao();
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, null, WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL, new String[]{str, str2, str3, String.valueOf(i), String.valueOf(i2), String.valueOf(i3), String.valueOf(i4), String.valueOf(i5), String.valueOf(i6)}, null, null, null);
        if (query == null || !query.moveToFirst()) {
            return null;
        }
        int columnIndex = query.getColumnIndex(COLUMN_HU_PRODUCT_CODE);
        if (-1 != columnIndex) {
            mapDao.setHuProductCode(query.getString(columnIndex));
        }
        int columnIndex2 = query.getColumnIndex("deviceCode");
        if (-1 != columnIndex2) {
            mapDao.setHuDeviceCode(query.getString(columnIndex2));
        }
        int columnIndex3 = query.getColumnIndex(COLUMN_PRODUCT_ID);
        if (-1 != columnIndex3) {
            mapDao.setProductId(query.getInt(columnIndex3));
        }
        int columnIndex4 = query.getColumnIndex(COLUMN_BASELINE_ID);
        if (-1 != columnIndex4) {
            mapDao.setBaseLineId(query.getInt(columnIndex4));
        }
        int columnIndex5 = query.getColumnIndex(COLUMN_SUPPLIER_ID);
        if (-1 != columnIndex5) {
            mapDao.setSupplierId(query.getInt(columnIndex5));
        }
        int columnIndex6 = query.getColumnIndex(COLUMN_REGION_ID);
        if (-1 != columnIndex6) {
            mapDao.setRegionId(query.getInt(columnIndex6));
        }
        int columnIndex7 = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
        if (-1 != columnIndex7) {
            mapDao.setDownloadStatus(query.getInt(columnIndex7));
        }
        int columnIndex8 = query.getColumnIndex(COLUMN_TRANSFER_STATUS);
        if (-1 != columnIndex8) {
            mapDao.setFileTransferStatus(query.getInt(columnIndex8));
        }
        int columnIndex9 = query.getColumnIndex(COLUMN_DOWNLOADED_FILE_SIZE);
        if (-1 != columnIndex9) {
            mapDao.setFileSize(query.getLong(columnIndex9));
        }
        return mapDao;
    }

    public List<MapDao> getAllFailedListByDownloadStatus(String str) {
        Log.i(TAG, "getAllFailedListByDownloadStatus:" + str);
        ArrayList arrayList = new ArrayList();
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, null, WHERE_DOWNLOAD_STATUS_IN_PROGRESS_OR_INITIATED_AND_MODEL, new String[]{String.valueOf(1), String.valueOf(2), String.valueOf(str)}, null, null, null);
        if (query != null) {
            while (query.moveToNext()) {
                MapDao mapDao = new MapDao();
                int columnIndex = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
                if (-1 != columnIndex) {
                    mapDao.setDownloadStatus(query.getInt(columnIndex));
                }
                int columnIndex2 = query.getColumnIndex(COLUMN_HU_PRODUCT_CODE);
                if (-1 != columnIndex2) {
                    mapDao.setHuProductCode(query.getString(columnIndex2));
                }
                int columnIndex3 = query.getColumnIndex("deviceCode");
                if (-1 != columnIndex3) {
                    mapDao.setHuDeviceCode(query.getString(columnIndex3));
                }
                int columnIndex4 = query.getColumnIndex(COLUMN_PRODUCT_ID);
                if (-1 != columnIndex4) {
                    mapDao.setProductId(query.getInt(columnIndex4));
                }
                int columnIndex5 = query.getColumnIndex(COLUMN_BASELINE_ID);
                if (-1 != columnIndex5) {
                    mapDao.setBaseLineId(query.getInt(columnIndex5));
                }
                int columnIndex6 = query.getColumnIndex(COLUMN_SUPPLIER_ID);
                if (-1 != columnIndex6) {
                    mapDao.setSupplierId(query.getInt(columnIndex6));
                }
                int columnIndex7 = query.getColumnIndex(COLUMN_REGION_ID);
                if (-1 != columnIndex7) {
                    mapDao.setRegionId(query.getInt(columnIndex7));
                }
                int columnIndex8 = query.getColumnIndex("fromVersion");
                if (-1 != columnIndex8) {
                    mapDao.setFromVersion(query.getInt(columnIndex8));
                }
                int columnIndex9 = query.getColumnIndex("toVersion");
                if (-1 != columnIndex9) {
                    mapDao.setToVersion(query.getInt(columnIndex9));
                }
                arrayList.add(mapDao);
            }
        }
        return arrayList;
    }

    public List<MapDao> getAll(String str, String str2, int i, String str3) {
        Log.i(TAG, "getAll:" + str3);
        ArrayList arrayList = new ArrayList();
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, null, WHERE_DOWNLOAD_PROGRESS_EQUALS_FOR_HU, new String[]{String.valueOf(str), String.valueOf(str2), String.valueOf(i), String.valueOf(str3)}, null, null, null);
        if (query != null) {
            while (query.moveToNext()) {
                Log.i(TAG, "Data is available. So put data ");
                MapDao mapDao = new MapDao();
                int columnIndex = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
                if (-1 != columnIndex) {
                    mapDao.setDownloadStatus(query.getInt(columnIndex));
                }
                int columnIndex2 = query.getColumnIndex(COLUMN_HU_PRODUCT_CODE);
                if (-1 != columnIndex2) {
                    mapDao.setHuProductCode(query.getString(columnIndex2));
                }
                int columnIndex3 = query.getColumnIndex("deviceCode");
                if (-1 != columnIndex3) {
                    mapDao.setHuDeviceCode(query.getString(columnIndex3));
                }
                int columnIndex4 = query.getColumnIndex(COLUMN_PRODUCT_ID);
                if (-1 != columnIndex4) {
                    mapDao.setProductId(query.getInt(columnIndex4));
                }
                int columnIndex5 = query.getColumnIndex(COLUMN_BASELINE_ID);
                if (-1 != columnIndex5) {
                    mapDao.setBaseLineId(query.getInt(columnIndex5));
                }
                int columnIndex6 = query.getColumnIndex(COLUMN_SUPPLIER_ID);
                if (-1 != columnIndex6) {
                    mapDao.setSupplierId(query.getInt(columnIndex6));
                }
                int columnIndex7 = query.getColumnIndex(COLUMN_REGION_ID);
                if (-1 != columnIndex7) {
                    mapDao.setRegionId(query.getInt(columnIndex7));
                }
                int columnIndex8 = query.getColumnIndex("fromVersion");
                if (-1 != columnIndex8) {
                    mapDao.setFromVersion(query.getInt(columnIndex8));
                }
                int columnIndex9 = query.getColumnIndex("toVersion");
                if (-1 != columnIndex9) {
                    mapDao.setToVersion(query.getInt(columnIndex9));
                }
                int columnIndex10 = query.getColumnIndex(COLUMN_DOWNLOADED_FILE_SIZE);
                if (-1 != columnIndex10) {
                    mapDao.setFileSize(query.getLong(columnIndex10));
                }
                arrayList.add(mapDao);
            }
        }
        return arrayList;
    }

    public List<MapDao> getAllTransferredList(String str, String str2, int i, int i2, String str3) {
        Log.i(TAG, "getAllTransferredList:" + str3);
        ArrayList arrayList = new ArrayList();
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, null, WHERE_DOWNLOAD_PROGRESS_AND_TRANSFER_STATUS_EQUALS_FOR_HU, new String[]{String.valueOf(str), String.valueOf(str2), String.valueOf(i), String.valueOf(str3), String.valueOf(i2)}, null, null, null);
        if (query != null) {
            while (query.moveToNext()) {
                Log.i(TAG, "Data is available. So put data ");
                MapDao mapDao = new MapDao();
                int columnIndex = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
                if (-1 != columnIndex) {
                    mapDao.setDownloadStatus(query.getInt(columnIndex));
                }
                int columnIndex2 = query.getColumnIndex(COLUMN_HU_PRODUCT_CODE);
                if (-1 != columnIndex2) {
                    mapDao.setHuProductCode(query.getString(columnIndex2));
                }
                int columnIndex3 = query.getColumnIndex("deviceCode");
                if (-1 != columnIndex3) {
                    mapDao.setHuDeviceCode(query.getString(columnIndex3));
                }
                int columnIndex4 = query.getColumnIndex(COLUMN_PRODUCT_ID);
                if (-1 != columnIndex4) {
                    mapDao.setProductId(query.getInt(columnIndex4));
                }
                int columnIndex5 = query.getColumnIndex(COLUMN_BASELINE_ID);
                if (-1 != columnIndex5) {
                    mapDao.setBaseLineId(query.getInt(columnIndex5));
                }
                int columnIndex6 = query.getColumnIndex(COLUMN_SUPPLIER_ID);
                if (-1 != columnIndex6) {
                    mapDao.setSupplierId(query.getInt(columnIndex6));
                }
                int columnIndex7 = query.getColumnIndex(COLUMN_REGION_ID);
                if (-1 != columnIndex7) {
                    mapDao.setRegionId(query.getInt(columnIndex7));
                }
                int columnIndex8 = query.getColumnIndex("fromVersion");
                if (-1 != columnIndex8) {
                    mapDao.setFromVersion(query.getInt(columnIndex8));
                }
                int columnIndex9 = query.getColumnIndex("toVersion");
                if (-1 != columnIndex9) {
                    mapDao.setToVersion(query.getInt(columnIndex9));
                }
                int columnIndex10 = query.getColumnIndex(COLUMN_DOWNLOADED_FILE_SIZE);
                if (-1 != columnIndex10) {
                    mapDao.setFileSize(query.getLong(columnIndex10));
                }
                arrayList.add(mapDao);
            }
        }
        return arrayList;
    }

    public int getDownloadedStatusByRegionId(String str, String str2, String str3, int i, int i2, int i3, int i4, int i5, int i6) {
        String str4 = TAG;
        Log.i(str4, "getDownloadedStatusByRegionId :" + i4 + " Device Code: " + str + " Product Code: " + str2 + " Model " + str3);
        StringBuilder sb = new StringBuilder();
        sb.append("From Version: ");
        sb.append(i5);
        sb.append(" To Version: ");
        sb.append(i6);
        Log.i(str4, sb.toString());
        int i7 = 0;
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, new String[]{COLUMN_DOWNLOAD_STATUS}, WHERE_EQUALS_BY_REGION_ID_WITH_VERSION_NEW_WITH_MODEL, new String[]{str, str2, str3, String.valueOf(i), String.valueOf(i2), String.valueOf(i3), String.valueOf(i4), String.valueOf(i5), String.valueOf(i6)}, null, null, null);
        if (query == null || query.getCount() <= 0) {
            Log.i(str4, "Data is not available. So Return as YET TO START");
        } else {
            query.moveToFirst();
            int columnIndex = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
            if (-1 != columnIndex) {
                i7 = query.getInt(columnIndex);
            }
        }
        Log.i(str4, "Downloaded Status::::" + i7);
        return i7;
    }

    public int getDownloadedStatusByRegionIdWithoutVersion(String str, String str2, String str3, int i, int i2, int i3, int i4) {
        String str4 = TAG;
        Log.i(str4, "getDownloadedStatusByRegionIdWithoutVersion called");
        int i5 = 0;
        Cursor query = getReadableDatabase().query(TABLE_HU_MAP_INFO, new String[]{COLUMN_DOWNLOAD_STATUS}, WHERE_EQUALS_BY_REGION_ID_NEW, new String[]{str, str2, String.valueOf(str3), String.valueOf(i), String.valueOf(i2), String.valueOf(i3), String.valueOf(i4)}, null, null, null);
        if (query == null || query.getCount() <= 0) {
            Log.i(str4, "Data is not available. So Return as YET TO START");
        } else {
            query.moveToFirst();
            int columnIndex = query.getColumnIndex(COLUMN_DOWNLOAD_STATUS);
            if (-1 != columnIndex) {
                i5 = query.getInt(columnIndex);
            }
        }
        Log.i(str4, "Downloaded Status::::" + i5);
        return i5;
    }

    private String getDateTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());
    }
}
