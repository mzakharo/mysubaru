package com.subaru.global.infotainment.gen2.harman.stub;

import android.content.Context;

/* loaded from: classes.dex */
public class WriteLogThread extends Thread {
    private Context context;

    public WriteLogThread(Context context) {
        this.context = context;
    }

    /* JADX WARN: Code restructure failed: missing block: B:30:0x006f, code lost:
    
        if (r5 == null) goto L24;
     */
    @Override // java.lang.Thread, java.lang.Runnable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public void run() {
        /*
            r8 = this;
            int r0 = android.os.Process.myPid()
            java.lang.String r0 = java.lang.Integer.toString(r0)
            r1 = 0
            java.lang.Runtime r2 = java.lang.Runtime.getRuntime()     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r3 = 3
            java.lang.String[] r3 = new java.lang.String[r3]     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r4 = 0
            java.lang.String r5 = "logcat"
            r3[r4] = r5     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r4 = 1
            java.lang.String r5 = "-v"
            r3[r4] = r5     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r4 = 2
            java.lang.String r5 = "time"
            r3[r4] = r5     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            java.lang.Process r2 = r2.exec(r3)     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            java.io.BufferedReader r3 = new java.io.BufferedReader     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            java.io.InputStreamReader r4 = new java.io.InputStreamReader     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            java.io.InputStream r2 = r2.getInputStream()     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r4.<init>(r2)     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
            r2 = 1024(0x400, float:1.435E-42)
            r3.<init>(r4, r2)     // Catch: java.lang.Throwable -> L87 java.lang.NullPointerException -> L89 java.io.IOException -> L93
        L33:
            java.lang.String r2 = r3.readLine()     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
            int r4 = r2.length()     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
            if (r4 != 0) goto L43
            r4 = 200(0xc8, double:9.9E-322)
            java.lang.Thread.sleep(r4)     // Catch: java.lang.InterruptedException -> L33 java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
            goto L33
        L43:
            int r4 = r2.indexOf(r0)     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
            r5 = -1
            if (r4 == r5) goto L33
            android.content.Context r4 = r8.context     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            java.lang.String r5 = "harmanOTAlog.txt"
            r6 = 32768(0x8000, float:4.5918E-41)
            java.io.FileOutputStream r4 = r4.openFileOutput(r5, r6)     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            java.io.PrintWriter r5 = new java.io.PrintWriter     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            java.io.OutputStreamWriter r6 = new java.io.OutputStreamWriter     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            java.lang.String r7 = "UTF-8"
            r6.<init>(r4, r7)     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            r5.<init>(r6)     // Catch: java.lang.Throwable -> L67 java.lang.Exception -> L69
            r5.println(r2)     // Catch: java.lang.Exception -> L65 java.lang.Throwable -> L76
            goto L71
        L65:
            r1 = move-exception
            goto L6c
        L67:
            r0 = move-exception
            goto L78
        L69:
            r2 = move-exception
            r5 = r1
            r1 = r2
        L6c:
            r1.printStackTrace()     // Catch: java.lang.Throwable -> L76
            if (r5 == 0) goto L74
        L71:
            r5.close()     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
        L74:
            r1 = r5
            goto L33
        L76:
            r0 = move-exception
            r1 = r5
        L78:
            if (r1 == 0) goto L7d
            r1.close()     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
        L7d:
            throw r0     // Catch: java.lang.Throwable -> L7e java.lang.NullPointerException -> L81 java.io.IOException -> L84
        L7e:
            r0 = move-exception
            r1 = r3
            goto La2
        L81:
            r0 = move-exception
            r1 = r3
            goto L8a
        L84:
            r0 = move-exception
            r1 = r3
            goto L94
        L87:
            r0 = move-exception
            goto La2
        L89:
            r0 = move-exception
        L8a:
            r0.printStackTrace()     // Catch: java.lang.Throwable -> L87
            if (r1 == 0) goto La1
            r1.close()     // Catch: java.io.IOException -> L9d
            goto La1
        L93:
            r0 = move-exception
        L94:
            r0.printStackTrace()     // Catch: java.lang.Throwable -> L87
            if (r1 == 0) goto La1
            r1.close()     // Catch: java.io.IOException -> L9d
            goto La1
        L9d:
            r0 = move-exception
            r0.printStackTrace()
        La1:
            return
        La2:
            if (r1 == 0) goto Lac
            r1.close()     // Catch: java.io.IOException -> La8
            goto Lac
        La8:
            r1 = move-exception
            r1.printStackTrace()
        Lac:
            goto Lae
        Lad:
            throw r0
        Lae:
            goto Lad
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.harman.stub.WriteLogThread.run():void");
    }
}
