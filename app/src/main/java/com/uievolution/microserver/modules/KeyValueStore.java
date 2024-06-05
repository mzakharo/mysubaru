package com.uievolution.microserver.modules;

import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Base64;
import com.clarion.android.smartaccess4car.extend.util.CipherUtil;
import com.harman.services.maps.MapUtils;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.MicroServer;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/* loaded from: classes.dex */
public class KeyValueStore {
    private static KeyValueStore g;
    private static a a = null;
    private final Context c;
    private int d = 0;
    private byte[] e = new byte[32];
    private byte[] f = new byte[16];
    private final Map<String, List<IKVSObserver>> b = new HashMap();

    /* loaded from: classes.dex */
    public interface IKVSObserver {
        void update(String str, byte[] bArr);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public static class a extends SQLiteOpenHelper {
        private static a a;

        private a(Context context) {
            super(context, "kvs.db", (SQLiteDatabase.CursorFactory) null, 1);
        }

        static synchronized a ab(Context context) {
            a aVar;
            synchronized (a.class) {
                if (a == null) {
                    a = new a(context);
                }
                aVar = a;
            }
            return aVar;
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onCreate(SQLiteDatabase sQLiteDatabase) {
            sQLiteDatabase.execSQL("create table kvs_table(key TEXT primary key,value BLOB)");
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i, int i2) {
        }
    }

    private KeyValueStore(Context context) {
        this.c = context;
        this.a = KeyValueStore.a.ab(context);
        b();
    }

    private synchronized boolean a(String str) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        int delete = this.a.getWritableDatabase().delete("kvs_table", "key=?", new String[]{Base64.encodeToString(b(str.getBytes()), 0)});
        MicroServer.Logger.d("KVS", "deleteKVS=" + delete);
        if (delete == 0) {
            return false;
        }
        b(str, null);
        return true;
    }

    private void b() {
        String encodeToString;
        String encodeToString2;
        String str;
        String str2;
        SharedPreferences sharedPreferences = this.c.getSharedPreferences("kvs.pref", 0);
        MessageDigest messageDigest = null;
        if (sharedPreferences.contains(HarmanOTAConst.JSON_VERSION)) {
            this.d = sharedPreferences.getInt(HarmanOTAConst.JSON_VERSION, -1);
            str2 = sharedPreferences.getString("key", null);
            str = sharedPreferences.getString("iv", null);
        } else {
            if (this.c.getDatabasePath("kvs.db").exists()) {
                this.d = 0;
                encodeToString = "D0F4F1D9423D1F1C692126A06CDB4000";
                encodeToString2 = "6C612F0B207C531F";
            } else {
                this.d = 1;
                SecureRandom secureRandom = new SecureRandom();
                byte[] bArr = new byte[128];
                secureRandom.nextBytes(bArr);
                encodeToString = Base64.encodeToString(bArr, 2);
                secureRandom.nextBytes(bArr);
                encodeToString2 = Base64.encodeToString(bArr, 2);
            }
            SharedPreferences.Editor edit = sharedPreferences.edit();
            edit.putInt(HarmanOTAConst.JSON_VERSION, this.d);
            edit.putString("key", encodeToString);
            edit.putString("iv", encodeToString2);
            edit.apply();
            str = encodeToString2;
            str2 = encodeToString;
        }
        int i = this.d;
        if (i == 0) {
            this.e = str2.getBytes();
            this.f = str.getBytes();
        } else if (i == 1) {
            try {
                messageDigest = MessageDigest.getInstance("SHA-256");
            } catch (NoSuchAlgorithmException e) {
                MicroServer.Logger.w("KVS", e);
            }
            messageDigest.update(str2.getBytes());
            this.e = Arrays.copyOf(messageDigest.digest(), this.e.length);
            messageDigest.reset();
            messageDigest.update(str.getBytes());
            this.f = Arrays.copyOf(messageDigest.digest(), this.f.length);
        }
    }

    private boolean c(byte[] bArr) {
        return bArr.length <= 102400;
    }

    public static synchronized KeyValueStore getInstance(Context context) {
        KeyValueStore keyValueStore;
        synchronized (KeyValueStore.class) {
            if (g == null) {
                g = new KeyValueStore(context);
            }
            keyValueStore = g;
        }
        return keyValueStore;
    }

    public boolean deleteAllData() {
        return a();
    }

    public boolean deleteData(String str) throws KVSException {
        if (b(str)) {
            try {
                return a(str);
            } catch (InvalidAlgorithmParameterException e) {
                throw new KVSException(500, e.toString() + ", " + e.getMessage());
            } catch (InvalidKeyException e2) {
                throw new KVSException(500, e2.toString() + ", " + e2.getMessage());
            } catch (NoSuchAlgorithmException unused) {
                throw new KVSException(500);
            } catch (BadPaddingException e3) {
                throw new KVSException(500, e3.toString() + ", " + e3.getMessage());
            } catch (IllegalBlockSizeException e4) {
                throw new KVSException(500, e4.toString() + ", " + e4.getMessage());
            } catch (NoSuchPaddingException e5) {
                throw new KVSException(500, e5.toString() + ", " + e5.getMessage());
            }
        }
        throw new KVSException(400, "key is too long, key=" + str);
    }

    public byte[] getData(String str) throws KVSException {
        if (b(str)) {
            try {
                return c(str);
            } catch (InvalidAlgorithmParameterException e) {
                throw new KVSException(500, e.toString() + ", " + e.getMessage());
            } catch (InvalidKeyException e2) {
                throw new KVSException(500, e2.toString() + ", " + e2.getMessage());
            } catch (NoSuchAlgorithmException unused) {
                throw new KVSException(500);
            } catch (BadPaddingException e3) {
                throw new KVSException(500, e3.toString() + ", " + e3.getMessage());
            } catch (IllegalBlockSizeException e4) {
                throw new KVSException(500, e4.toString() + ", " + e4.getMessage());
            } catch (NoSuchPaddingException e5) {
                throw new KVSException(500, e5.toString() + ", " + e5.getMessage());
            }
        }
        throw new KVSException(400, "key is too long, key=" + str);
    }

    public boolean saveData(byte[] bArr, String str) throws KVSException {
        if (c(bArr)) {
            if (b(str)) {
                try {
                    return a(str, bArr);
                } catch (InvalidAlgorithmParameterException e) {
                    throw new KVSException(500, e.toString() + ", " + e.getMessage());
                } catch (InvalidKeyException e2) {
                    throw new KVSException(500, e2.toString() + ", " + e2.getMessage());
                } catch (NoSuchAlgorithmException unused) {
                    throw new KVSException(500);
                } catch (BadPaddingException e3) {
                    throw new KVSException(500, e3.toString() + ", " + e3.getMessage());
                } catch (IllegalBlockSizeException e4) {
                    throw new KVSException(500, e4.toString() + ", " + e4.getMessage());
                } catch (NoSuchPaddingException e5) {
                    throw new KVSException(500, e5.toString() + ", " + e5.getMessage());
                }
            }
            throw new KVSException(400, "key is too long, key=" + str);
        }
        String str2 = "Data size is too big. " + bArr.length + " bytes";
        MicroServer.Logger.d("KVS", str2);
        throw new KVSException(400, str2);
    }

    public void subscribe(String str, IKVSObserver iKVSObserver) {
        synchronized (this.b) {
            List<IKVSObserver> list = this.b.get(str);
            if (list == null) {
                list = new ArrayList<>();
            }
            if (list.indexOf(iKVSObserver) != -1) {
                return;
            }
            list.add(iKVSObserver);
            this.b.put(str, list);
        }
    }

    public void unsubscribe(String str, IKVSObserver iKVSObserver) {
        synchronized (this.b) {
            List<IKVSObserver> list = this.b.get(str);
            if (list == null) {
                return;
            }
            list.remove(iKVSObserver);
            if (list.isEmpty()) {
                this.b.remove(str);
            }
        }
    }

    public void unsubscribeAll() {
        synchronized (this.b) {
            this.b.clear();
        }
    }

    /* loaded from: classes.dex */
    public static final class KVSException extends Exception {
        private static final long serialVersionUID = 2189824375431122420L;
        private int a;

        KVSException(int i) {
            this.a = i;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public int a() {
            return this.a;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public KVSException(int i, String str) {
            super(str);
            this.a = i;
        }
    }

    private synchronized byte[] c(String str) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        byte[] bArr = new byte[0];
        Cursor query = this.a.getWritableDatabase().query("kvs_table", new String[]{MapUtils.KEY_RESPONSE_VALUE}, "key=?", new String[]{Base64.encodeToString(b(str.getBytes()), 0)}, null, null, null);
        if (query != null) {
            bArr = query.moveToNext() ? query.getBlob(query.getColumnIndex(MapUtils.KEY_RESPONSE_VALUE)) : null;
            query.close();
        }
        if (bArr != null) {
            bArr = a(bArr);
        }
        return bArr;
    }

    private synchronized boolean a(String str, byte[] bArr) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, KVSException {
        String encodeToString = Base64.encodeToString(b(str.getBytes()), 0);
        byte[] b = b(bArr);
        SQLiteDatabase writableDatabase = this.a.getWritableDatabase();
        if (500 > a(writableDatabase)) {
            ContentValues contentValues = new ContentValues();
            contentValues.put("key", encodeToString);
            contentValues.put(MapUtils.KEY_RESPONSE_VALUE, b);
            long insertWithOnConflict = writableDatabase.insertWithOnConflict("kvs_table", null, contentValues, 5);
            MicroServer.Logger.d("KVS", "insertWithOnConflict=" + insertWithOnConflict);
            if (insertWithOnConflict == -1) {
                return false;
            }
            b(str, bArr);
            return true;
        }
        throw new KVSException(400, "KVS storage is full");
    }

    private boolean b(String str) {
        return str.length() <= 64;
    }

    private synchronized boolean a() {
        int delete = this.a.getWritableDatabase().delete("kvs_table", null, null);
        MicroServer.Logger.d("KVS", "deleteAllKVS=" + delete);
        synchronized (this.b) {
            Iterator<String> it = this.b.keySet().iterator();
            while (it.hasNext()) {
                b(it.next(), null);
            }
        }
        return true;
    }

    private byte[] b(byte[] bArr) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        return a(1).doFinal(bArr);
    }

    private void b(String str, byte[] bArr) {
        synchronized (this.b) {
            List<IKVSObserver> list = this.b.get(str);
            if (list != null) {
                Iterator<IKVSObserver> it = list.iterator();
                while (it.hasNext()) {
                    it.next().update(str, bArr);
                }
            }
        }
    }

    private int a(SQLiteDatabase sQLiteDatabase) {
        Cursor query = sQLiteDatabase.query("kvs_table", new String[]{"key"}, null, null, null, null, null);
        if (query == null) {
            return 0;
        }
        query.moveToFirst();
        int count = query.getCount();
        query.close();
        return count;
    }

    private byte[] a(byte[] bArr) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        return a(2).doFinal(bArr);
    }

    private Cipher a(int i) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(i, new SecretKeySpec(this.e, CipherUtil.AES), new IvParameterSpec(this.f));
        return cipher;
    }
}
