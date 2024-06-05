package com.android.lib.mcm;

import android.os.AsyncTask;
import com.android.lib.mcm.InitCustomModuleHelper;
import com.uievolution.microserver.MSServiceHelper;
/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: InitCustomModuleTask.java */
/* loaded from: classes.dex */
public class InitCustomMudoleTask extends AsyncTask<Integer, Integer, Integer> {
    private static final String LOGTAG = "mcm";
    private final InitCustomModuleHelper.LoadModuleListener mListener;
    private final MSServiceHelper msServiceHelper;

    /* JADX INFO: Access modifiers changed from: package-private */
    public InitCustomMudoleTask(MSServiceHelper mSServiceHelper, InitCustomModuleHelper.LoadModuleListener loadModuleListener) {
        this.msServiceHelper = mSServiceHelper;
        this.mListener = loadModuleListener;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void cancelLoadModule() {
        if (isCancelled()) {
            return;
        }
        cancel(!this.msServiceHelper.isServiceRunning());
    }

    /* JADX INFO: Access modifiers changed from: protected */
    /* JADX WARN: Can't wrap try/catch for region: R(11:1|(2:2|3)|(8:40|41|6|(2:7|(4:20|21|22|(1:32)(4:24|25|(2:27|28)(2:30|31)|29))(2:10|11))|12|13|14|15)|5|6|(7:7|(0)|20|21|22|(0)(0)|29)|12|13|14|15|(1:(0))) */
    /* JADX WARN: Code restructure failed: missing block: B:22:0x004b, code lost:
        android.util.Log.d(com.android.lib.mcm.InitCustomMudoleTask.LOGTAG, "Microserver startup failure... set wiFiHttpPort -> 8008");
     */
    /* JADX WARN: Code restructure failed: missing block: B:38:0x009a, code lost:
        r1 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:39:0x009b, code lost:
        com.android.lib.mcm.InitCustomModuleHelper.setState(com.android.lib.mcm.InitCustomModuleHelper.State.error);
        r1.printStackTrace();
     */
    /* JADX WARN: Removed duplicated region for block: B:16:0x0028 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:26:0x0053  */
    /* JADX WARN: Removed duplicated region for block: B:50:0x004b A[EDGE_INSN: B:50:0x004b->B:22:0x004b ?: BREAK  , EXC_TOP_SPLITTER, SYNTHETIC] */
    @Override // android.os.AsyncTask
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public java.lang.Integer doInBackground(java.lang.Integer... r13) {
        /*
            r12 = this;
            com.android.lib.mcm.InitCustomModuleHelper$State r13 = com.android.lib.mcm.InitCustomModuleHelper.getState()
            r0 = 0
            r1 = 8008(0x1f48, float:1.1222E-41)
            com.uievolution.microserver.MSServiceHelper r2 = r12.msServiceHelper     // Catch: java.lang.Exception -> L18
            boolean r2 = r2.isServiceRunning()     // Catch: java.lang.Exception -> L18
            if (r2 == 0) goto L1d
            com.uievolution.microserver.MSServiceHelper r3 = r12.msServiceHelper     // Catch: java.lang.Exception -> L16
            int r3 = r3.getWiFiHttpPort()     // Catch: java.lang.Exception -> L16
            goto L1f
        L16:
            r3 = move-exception
            goto L1a
        L18:
            r3 = move-exception
            r2 = 0
        L1a:
            r3.printStackTrace()
        L1d:
            r3 = 8008(0x1f48, float:1.1222E-41)
        L1f:
            r4 = 20
            r5 = 0
        L22:
            java.lang.String r6 = " : getWiFiHttpPort : "
            java.lang.String r7 = "mcm"
            if (r2 == 0) goto L2d
            if (r3 > 0) goto L2b
            goto L2d
        L2b:
            r1 = r3
            goto L77
        L2d:
            java.lang.StringBuilder r8 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L6b
            r8.<init>()     // Catch: java.lang.Exception -> L6b
            java.lang.String r9 = "wait Microserver startup... : isServiceRunning "
            r8.append(r9)     // Catch: java.lang.Exception -> L6b
            r8.append(r2)     // Catch: java.lang.Exception -> L6b
            r8.append(r6)     // Catch: java.lang.Exception -> L6b
            r8.append(r3)     // Catch: java.lang.Exception -> L6b
            java.lang.String r8 = r8.toString()     // Catch: java.lang.Exception -> L6b
            android.util.Log.d(r7, r8)     // Catch: java.lang.Exception -> L6b
            int r8 = r5 + 1
            if (r5 < r4) goto L53
            java.lang.String r3 = "Microserver startup failure... set wiFiHttpPort -> 8008"
            android.util.Log.d(r7, r3)     // Catch: java.lang.Exception -> L51
            goto L77
        L51:
            r3 = move-exception
            goto L6f
        L53:
            r9 = 500(0x1f4, double:2.47E-321)
            java.lang.Thread.sleep(r9)     // Catch: java.lang.Exception -> L6b
            com.uievolution.microserver.MSServiceHelper r5 = r12.msServiceHelper     // Catch: java.lang.Exception -> L6b
            boolean r2 = r5.isServiceRunning()     // Catch: java.lang.Exception -> L6b
            if (r2 == 0) goto L67
            com.uievolution.microserver.MSServiceHelper r5 = r12.msServiceHelper     // Catch: java.lang.Exception -> L6b
            int r3 = r5.getWiFiHttpPort()     // Catch: java.lang.Exception -> L6b
            goto L69
        L67:
            r3 = 8008(0x1f48, float:1.1222E-41)
        L69:
            r5 = r8
            goto L22
        L6b:
            r1 = move-exception
            r11 = r3
            r3 = r1
            r1 = r11
        L6f:
            java.lang.String r4 = "wait Microserver startup error."
            android.util.Log.d(r7, r4)
            r3.printStackTrace()
        L77:
            java.lang.StringBuilder r3 = new java.lang.StringBuilder     // Catch: java.lang.Exception -> L9a
            r3.<init>()     // Catch: java.lang.Exception -> L9a
            java.lang.String r4 = "Microserver startup finish. : isServiceRunning "
            r3.append(r4)     // Catch: java.lang.Exception -> L9a
            r3.append(r2)     // Catch: java.lang.Exception -> L9a
            r3.append(r6)     // Catch: java.lang.Exception -> L9a
            r3.append(r1)     // Catch: java.lang.Exception -> L9a
            java.lang.String r2 = r3.toString()     // Catch: java.lang.Exception -> L9a
            android.util.Log.d(r7, r2)     // Catch: java.lang.Exception -> L9a
            com.android.lib.mcm.InitCustomModuleHelper.requestInitModule(r1)     // Catch: java.lang.Exception -> L9a
            com.android.lib.mcm.InitCustomModuleHelper$State r1 = com.android.lib.mcm.InitCustomModuleHelper.State.finish     // Catch: java.lang.Exception -> L9a
            com.android.lib.mcm.InitCustomModuleHelper.setState(r1)     // Catch: java.lang.Exception -> L9a
            goto La3
        L9a:
            r1 = move-exception
            com.android.lib.mcm.InitCustomModuleHelper$State r2 = com.android.lib.mcm.InitCustomModuleHelper.State.error
            com.android.lib.mcm.InitCustomModuleHelper.setState(r2)
            r1.printStackTrace()
        La3:
            com.android.lib.mcm.InitCustomModuleHelper$LoadModuleListener r1 = r12.mListener
            r1.onFinish(r13)
            java.lang.Integer r13 = java.lang.Integer.valueOf(r0)
            return r13
        */
        throw new UnsupportedOperationException("Method not decompiled: com.android.lib.mcm.InitCustomMudoleTask.doInBackground(java.lang.Integer[]):java.lang.Integer");
    }
}
