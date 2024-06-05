package com.subaru.global.infotainment.gen2.mirroring;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;
import com.uievolution.microserver.MicroServer;

/* loaded from: classes.dex */
class AppDB {
    static final String APP_TABLE = "app";
    static final String COLUMN_HTML5ID = "html5id";
    static final String COLUMN_VERSIOIN = "version";
    private static final String DB_FILENAME = "mirroring.db";
    final String LOGTAG = "AppDB";

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getVersion(String str) {
        SQLiteDatabase readableDatabase = new AppDBHelper(MicroServer.getInstance().getContext()).getReadableDatabase();
        Cursor query = readableDatabase.query(APP_TABLE, new String[]{"version"}, "html5id=?", new String[]{str}, null, null, null);
        String r1 = "";
        if (query != null) {
            r1 = query.moveToNext() ? query.getString(query.getColumnIndex("version")) : null;
            query.close();
        }
        readableDatabase.close();
        return r1;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public long insertOrUpdate(String str, String str2) {
        SQLiteDatabase writableDatabase = new AppDBHelper(MicroServer.getInstance().getContext()).getWritableDatabase();
        if (str2 == null) {
            str2 = "";
        }
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_HTML5ID, str);
        contentValues.put("version", str2);
        long insertWithOnConflict = writableDatabase.insertWithOnConflict(APP_TABLE, null, contentValues, 5);
        writableDatabase.close();
        return insertWithOnConflict;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void recreateTable() {
        AppDBHelper appDBHelper = new AppDBHelper(MicroServer.getInstance().getContext());
        SQLiteDatabase writableDatabase = appDBHelper.getWritableDatabase();
        try {
            appDBHelper.dropAppTable(writableDatabase);
        } catch (SQLiteException unused) {
        }
        try {
            appDBHelper.createAppTable(writableDatabase);
        } finally {
            writableDatabase.close();
        }
    }

    /* loaded from: classes.dex */
    static class AppDBHelper extends SQLiteOpenHelper {
        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i, int i2) {
        }

        AppDBHelper(Context context) {
            super(context, AppDB.DB_FILENAME, (SQLiteDatabase.CursorFactory) null, 1);
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onCreate(SQLiteDatabase sQLiteDatabase) {
            createAppTable(sQLiteDatabase);
        }

        void createAppTable(SQLiteDatabase sQLiteDatabase) {
            sQLiteDatabase.execSQL("create table app(html5id text primary key not null,version version text not null)");
        }

        void dropAppTable(SQLiteDatabase sQLiteDatabase) {
            sQLiteDatabase.execSQL("drop table app");
        }
    }
}
