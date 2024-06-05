package com.subaru.global.infotainment.gen2.extend.contact;

import android.content.Context;
import android.database.Cursor;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.contact.json.Res;
import com.subaru.global.infotainment.gen2.extend.util.RequestParamUtil;
import com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil;
import java.util.ArrayList;
import java.util.Iterator;

/* loaded from: classes.dex */
public class SearchContact {
    static final String SEARCH_NAME_ALL = "";
    public final String TAG = "SearchContact";
    private Context context;

    public SearchContact(Context context) {
        this.context = context;
    }

    public Res search(String str, String str2, String str3, ArrayList<SearchQueryUtil.SearchMethod> arrayList, String str4) {
        Log.d("SearchContact", "search() start");
        int searchIndex = RequestParamUtil.getSearchIndex(str2);
        int searchCount = RequestParamUtil.getSearchCount(str3);
        if (searchIndex == -3 || searchCount == -2) {
            Res res = new Res();
            res.setReturnCd("M001W");
            return res;
        }
        if (TextUtils.isEmpty(str)) {
            str = "";
        }
        Res res2 = null;
        Iterator<SearchQueryUtil.SearchMethod> it = arrayList.iterator();
        while (it.hasNext()) {
            res2 = inSearch(str, searchIndex, searchCount, it.next(), str4);
            if (!TextUtils.equals(res2.getReturnCd(), "M001I") || Integer.parseInt(res2.getSearchCount()) > 0) {
                break;
            }
        }
        return res2;
    }

    /* JADX WARN: Removed duplicated region for block: B:30:0x0181 A[LOOP:0: B:22:0x00a9->B:30:0x0181, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:31:0x017f A[EDGE_INSN: B:31:0x017f->B:32:0x017f BREAK  A[LOOP:0: B:22:0x00a9->B:30:0x0181], SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private com.subaru.global.infotainment.gen2.extend.contact.json.Res inSearch(java.lang.String r24, int r25, int r26, com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil.SearchMethod r27, java.lang.String r28) {
        /*
            Method dump skipped, instructions count: 528
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.extend.contact.SearchContact.inSearch(java.lang.String, int, int, com.subaru.global.infotainment.gen2.extend.util.SearchQueryUtil$SearchMethod, java.lang.String):com.subaru.global.infotainment.gen2.extend.contact.json.Res");
    }

    /* JADX WARN: Code restructure failed: missing block: B:10:0x005a, code lost:
    
        if (r10.moveToNext() != false) goto L20;
     */
    /* JADX WARN: Code restructure failed: missing block: B:13:0x005c, code lost:
    
        r10.close();
     */
    /* JADX WARN: Code restructure failed: missing block: B:14:0x0063, code lost:
    
        if (r0.size() != 0) goto L13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:16:?, code lost:
    
        return r0;
     */
    /* JADX WARN: Code restructure failed: missing block: B:17:?, code lost:
    
        return null;
     */
    /* JADX WARN: Code restructure failed: missing block: B:8:0x0027, code lost:
    
        if (r10.moveToFirst() != false) goto L8;
     */
    /* JADX WARN: Code restructure failed: missing block: B:9:0x0029, code lost:
    
        r2 = new com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData();
        r2.setType(com.subaru.global.infotainment.gen2.extend.contact.Const.PHONE_NUMBER_TYPE_TABLE.get((int) r10.getLong(r10.getColumnIndex("data2")), com.subaru.global.infotainment.gen2.extend.contact.Const.TYPE_OTHER));
        r2.setData(r10.getString(r10.getColumnIndex("data1")));
        r0.add(r2);
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private java.util.List<com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData> getPhoneNumber(java.lang.String r10) {
        /*
            r9 = this;
            boolean r0 = android.text.TextUtils.isEmpty(r10)
            r1 = 0
            if (r0 == 0) goto L8
            return r1
        L8:
            java.util.ArrayList r0 = new java.util.ArrayList
            r0.<init>()
            android.content.Context r2 = r9.context
            android.content.ContentResolver r3 = r2.getContentResolver()
            android.net.Uri r4 = android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI     // Catch: java.lang.Exception -> L68
            r5 = 0
            java.lang.String r6 = "contact_id =?"
            r2 = 1
            java.lang.String[] r7 = new java.lang.String[r2]     // Catch: java.lang.Exception -> L68
            r2 = 0
            r7[r2] = r10     // Catch: java.lang.Exception -> L68
            r8 = 0
            android.database.Cursor r10 = r3.query(r4, r5, r6, r7, r8)     // Catch: java.lang.Exception -> L68
            boolean r2 = r10.moveToFirst()     // Catch: java.lang.Exception -> L68
            if (r2 == 0) goto L5c
        L29:
            com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData r2 = new com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData     // Catch: java.lang.Exception -> L68
            r2.<init>()     // Catch: java.lang.Exception -> L68
            java.lang.String r3 = "data2"
            int r3 = r10.getColumnIndex(r3)     // Catch: java.lang.Exception -> L68
            long r3 = r10.getLong(r3)     // Catch: java.lang.Exception -> L68
            int r4 = (int) r3     // Catch: java.lang.Exception -> L68
            android.util.SparseArray<java.lang.String> r3 = com.subaru.global.infotainment.gen2.extend.contact.Const.PHONE_NUMBER_TYPE_TABLE     // Catch: java.lang.Exception -> L68
            java.lang.String r5 = "OTHER"
            java.lang.Object r3 = r3.get(r4, r5)     // Catch: java.lang.Exception -> L68
            java.lang.String r3 = (java.lang.String) r3     // Catch: java.lang.Exception -> L68
            r2.setType(r3)     // Catch: java.lang.Exception -> L68
            java.lang.String r3 = "data1"
            int r3 = r10.getColumnIndex(r3)     // Catch: java.lang.Exception -> L68
            java.lang.String r3 = r10.getString(r3)     // Catch: java.lang.Exception -> L68
            r2.setData(r3)     // Catch: java.lang.Exception -> L68
            r0.add(r2)     // Catch: java.lang.Exception -> L68
            boolean r2 = r10.moveToNext()     // Catch: java.lang.Exception -> L68
            if (r2 != 0) goto L29
        L5c:
            r10.close()     // Catch: java.lang.Exception -> L68
            int r10 = r0.size()     // Catch: java.lang.Exception -> L68
            if (r10 != 0) goto L66
            goto L72
        L66:
            r1 = r0
            goto L72
        L68:
            r10 = move-exception
            java.lang.String r10 = r10.toString()
            java.lang.String r0 = "SearchContact"
            android.util.Log.d(r0, r10)
        L72:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.extend.contact.SearchContact.getPhoneNumber(java.lang.String):java.util.List");
    }

    /* JADX WARN: Code restructure failed: missing block: B:10:0x0063, code lost:
    
        if (r12.moveToNext() != false) goto L20;
     */
    /* JADX WARN: Code restructure failed: missing block: B:13:0x0065, code lost:
    
        r12.close();
     */
    /* JADX WARN: Code restructure failed: missing block: B:14:0x006c, code lost:
    
        if (r2.size() != 0) goto L13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:16:?, code lost:
    
        return r2;
     */
    /* JADX WARN: Code restructure failed: missing block: B:17:?, code lost:
    
        return null;
     */
    /* JADX WARN: Code restructure failed: missing block: B:8:0x0034, code lost:
    
        if (r12.moveToFirst() != false) goto L8;
     */
    /* JADX WARN: Code restructure failed: missing block: B:9:0x0036, code lost:
    
        r4 = new com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData();
        r4.setType(com.subaru.global.infotainment.gen2.extend.contact.Const.EMAIL_ADDRESS_TYPE_TABLE.get((int) r12.getLong(r12.getColumnIndex("data2")), com.subaru.global.infotainment.gen2.extend.contact.Const.TYPE_OTHER));
        r4.setData(r12.getString(r12.getColumnIndex("data1")));
        r2.add(r4);
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private java.util.List<com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData> getEmailAddress(java.lang.String r12) {
        /*
            r11 = this;
            java.lang.String r0 = "data2"
            java.lang.String r1 = "data1"
            boolean r2 = android.text.TextUtils.isEmpty(r12)
            r3 = 0
            if (r2 == 0) goto Lc
            return r3
        Lc:
            java.util.ArrayList r2 = new java.util.ArrayList
            r2.<init>()
            android.content.Context r4 = r11.context
            android.content.ContentResolver r5 = r4.getContentResolver()
            android.net.Uri r6 = android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_URI     // Catch: java.lang.Exception -> L71
            r4 = 2
            java.lang.String[] r7 = new java.lang.String[r4]     // Catch: java.lang.Exception -> L71
            r4 = 0
            r7[r4] = r1     // Catch: java.lang.Exception -> L71
            r8 = 1
            r7[r8] = r0     // Catch: java.lang.Exception -> L71
            java.lang.String r9 = "contact_id =?"
            java.lang.String[] r10 = new java.lang.String[r8]     // Catch: java.lang.Exception -> L71
            r10[r4] = r12     // Catch: java.lang.Exception -> L71
            r12 = 0
            r8 = r9
            r9 = r10
            r10 = r12
            android.database.Cursor r12 = r5.query(r6, r7, r8, r9, r10)     // Catch: java.lang.Exception -> L71
            boolean r4 = r12.moveToFirst()     // Catch: java.lang.Exception -> L71
            if (r4 == 0) goto L65
        L36:
            com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData r4 = new com.subaru.global.infotainment.gen2.extend.contact.json.CommonTypedData     // Catch: java.lang.Exception -> L71
            r4.<init>()     // Catch: java.lang.Exception -> L71
            int r5 = r12.getColumnIndex(r0)     // Catch: java.lang.Exception -> L71
            long r5 = r12.getLong(r5)     // Catch: java.lang.Exception -> L71
            int r6 = (int) r5     // Catch: java.lang.Exception -> L71
            android.util.SparseArray<java.lang.String> r5 = com.subaru.global.infotainment.gen2.extend.contact.Const.EMAIL_ADDRESS_TYPE_TABLE     // Catch: java.lang.Exception -> L71
            java.lang.String r7 = "OTHER"
            java.lang.Object r5 = r5.get(r6, r7)     // Catch: java.lang.Exception -> L71
            java.lang.String r5 = (java.lang.String) r5     // Catch: java.lang.Exception -> L71
            r4.setType(r5)     // Catch: java.lang.Exception -> L71
            int r5 = r12.getColumnIndex(r1)     // Catch: java.lang.Exception -> L71
            java.lang.String r5 = r12.getString(r5)     // Catch: java.lang.Exception -> L71
            r4.setData(r5)     // Catch: java.lang.Exception -> L71
            r2.add(r4)     // Catch: java.lang.Exception -> L71
            boolean r4 = r12.moveToNext()     // Catch: java.lang.Exception -> L71
            if (r4 != 0) goto L36
        L65:
            r12.close()     // Catch: java.lang.Exception -> L71
            int r12 = r2.size()     // Catch: java.lang.Exception -> L71
            if (r12 != 0) goto L6f
            goto L7b
        L6f:
            r3 = r2
            goto L7b
        L71:
            r12 = move-exception
            java.lang.String r12 = r12.toString()
            java.lang.String r0 = "SearchContact"
            android.util.Log.d(r0, r12)
        L7b:
            return r3
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.extend.contact.SearchContact.getEmailAddress(java.lang.String):java.util.List");
    }

    /* JADX WARN: Code restructure failed: missing block: B:10:0x005e, code lost:
    
        if (r14.moveToNext() != false) goto L20;
     */
    /* JADX WARN: Code restructure failed: missing block: B:13:0x0060, code lost:
    
        r14.close();
     */
    /* JADX WARN: Code restructure failed: missing block: B:14:0x0067, code lost:
    
        if (r4.size() != 0) goto L13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:16:?, code lost:
    
        return r4;
     */
    /* JADX WARN: Code restructure failed: missing block: B:17:?, code lost:
    
        return null;
     */
    /* JADX WARN: Code restructure failed: missing block: B:8:0x003b, code lost:
    
        if (r14.moveToFirst() != false) goto L8;
     */
    /* JADX WARN: Code restructure failed: missing block: B:9:0x003d, code lost:
    
        r6 = new com.subaru.global.infotainment.gen2.extend.contact.json.Address();
        r6.setStreet(getCursorString(r14, "data4", ""));
        r6.setCity(getCursorString(r14, "data7", ""));
        r6.setState(getCursorString(r14, "data8", ""));
        r4.add(r6);
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private java.util.List<com.subaru.global.infotainment.gen2.extend.contact.json.Address> getAddress(java.lang.String r14) {
        /*
            r13 = this;
            java.lang.String r0 = "data8"
            java.lang.String r1 = "data7"
            java.lang.String r2 = "data4"
            java.lang.String r3 = ""
            boolean r4 = android.text.TextUtils.isEmpty(r14)
            r5 = 0
            if (r4 == 0) goto L10
            return r5
        L10:
            java.util.ArrayList r4 = new java.util.ArrayList
            r4.<init>()
            android.content.Context r6 = r13.context
            android.content.ContentResolver r7 = r6.getContentResolver()
            android.net.Uri r8 = android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI     // Catch: java.lang.Exception -> L6c
            r6 = 3
            java.lang.String[] r9 = new java.lang.String[r6]     // Catch: java.lang.Exception -> L6c
            r6 = 0
            r9[r6] = r2     // Catch: java.lang.Exception -> L6c
            r10 = 1
            r9[r10] = r1     // Catch: java.lang.Exception -> L6c
            r11 = 2
            r9[r11] = r0     // Catch: java.lang.Exception -> L6c
            java.lang.String r11 = "contact_id =?"
            java.lang.String[] r12 = new java.lang.String[r10]     // Catch: java.lang.Exception -> L6c
            r12[r6] = r14     // Catch: java.lang.Exception -> L6c
            r14 = 0
            r10 = r11
            r11 = r12
            r12 = r14
            android.database.Cursor r14 = r7.query(r8, r9, r10, r11, r12)     // Catch: java.lang.Exception -> L6c
            boolean r6 = r14.moveToFirst()     // Catch: java.lang.Exception -> L6c
            if (r6 == 0) goto L60
        L3d:
            com.subaru.global.infotainment.gen2.extend.contact.json.Address r6 = new com.subaru.global.infotainment.gen2.extend.contact.json.Address     // Catch: java.lang.Exception -> L6c
            r6.<init>()     // Catch: java.lang.Exception -> L6c
            java.lang.String r7 = r13.getCursorString(r14, r2, r3)     // Catch: java.lang.Exception -> L6c
            r6.setStreet(r7)     // Catch: java.lang.Exception -> L6c
            java.lang.String r7 = r13.getCursorString(r14, r1, r3)     // Catch: java.lang.Exception -> L6c
            r6.setCity(r7)     // Catch: java.lang.Exception -> L6c
            java.lang.String r7 = r13.getCursorString(r14, r0, r3)     // Catch: java.lang.Exception -> L6c
            r6.setState(r7)     // Catch: java.lang.Exception -> L6c
            r4.add(r6)     // Catch: java.lang.Exception -> L6c
            boolean r6 = r14.moveToNext()     // Catch: java.lang.Exception -> L6c
            if (r6 != 0) goto L3d
        L60:
            r14.close()     // Catch: java.lang.Exception -> L6c
            int r14 = r4.size()     // Catch: java.lang.Exception -> L6c
            if (r14 != 0) goto L6a
            goto L76
        L6a:
            r5 = r4
            goto L76
        L6c:
            r14 = move-exception
            java.lang.String r14 = r14.toString()
            java.lang.String r0 = "SearchContact"
            android.util.Log.d(r0, r14)
        L76:
            return r5
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.extend.contact.SearchContact.getAddress(java.lang.String):java.util.List");
    }

    private String getCursorString(Cursor cursor, String str, String str2) {
        String string = cursor.getString(cursor.getColumnIndex(str));
        return string == null ? str2 : string;
    }
}
