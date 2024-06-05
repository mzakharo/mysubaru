package com.subaru.global.infotainment.gen2.extend;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.uievolution.microserver.modules.KeyValueStore;

/* loaded from: classes.dex */
public class ExternalModuleLoader {
    static final String LOGTAG = "ExternalModuleLoader";

    public static void onApplicationLaunchWithServiceProcess(final Context context) {
        Log.d(LOGTAG, "onApplicationLaunchWithServiceProcess Context :: " + context);
        KeyValueStore.getInstance(context).subscribe("flgWidget/", new KeyValueStore.IKVSObserver() { // from class: com.subaru.global.infotainment.gen2.extend.ExternalModuleLoader.1
            @Override // com.uievolution.microserver.modules.KeyValueStore.IKVSObserver
            public void update(String str, byte[] bArr) {
                Intent intent = new Intent();
                intent.putExtra("message", new String(bArr));
                intent.setAction("exec_flgWidget");
                context.sendBroadcast(intent);
            }
        });
    }

    public static void onApplicationLaunchWithActivityProcess(Context context) {
        Log.d(LOGTAG, "onApplicationLaunchWithActivityProcess Context :: " + context);
    }
}
