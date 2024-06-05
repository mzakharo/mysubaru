package com.android.lib.mcm.send_location;

import android.content.Context;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.android.lib.mcm.MCResource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.TimeZone;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class SendLocationLimitManager {
    private static final String TAG = "SendLocationLimitManager";
    private static String[] sWhitelist;

    private static void getWhitelist(boolean z, final Context context) {
        Runnable runnable = new Runnable() { // from class: com.android.lib.mcm.send_location.SendLocationLimitManager.1
            @Override // java.lang.Runnable
            public void run() {
                String[] unused = SendLocationLimitManager.sWhitelist = SendLocationLimitManager.getLocationWhiteList(context);
            }
        };
        if (z) {
            new Thread(runnable).start();
        } else {
            runnable.run();
        }
    }

    private static boolean checkRefreshWhitelist() {
        return sWhitelist == null;
    }

    public static boolean checkPermitSendLocation(Context context) {
        if (checkRefreshWhitelist()) {
            LogWrapper.d(TAG, "refresh whitelist");
            getWhitelist(false, context);
        }
        if (sWhitelist == null) {
            LogWrapper.d(TAG, "whitelist null");
            return false;
        }
        String currentTimezoneID = getCurrentTimezoneID();
        for (String str : sWhitelist) {
            if (TextUtils.equals(str, currentTimezoneID)) {
                return true;
            }
        }
        return false;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static String[] getLocationWhiteList(Context context) {
        boolean z;
        StringBuilder sb = new StringBuilder();
        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(context.getResources().openRawResource(MCResource.file.sendlocation_whitelist)));
            while (true) {
                String readLine = bufferedReader.readLine();
                if (readLine == null) {
                    break;
                }
                sb.append(readLine + "\n");
            }
            ArrayList arrayList = new ArrayList();
            try {
                JSONArray jSONArray = new JSONObject(sb.toString()).getJSONArray("whitelist");
                for (int i = 0; i < jSONArray.length(); i++) {
                    arrayList.add(jSONArray.getJSONObject(i).getString("timezone"));
                }
                z = false;
            } catch (JSONException e) {
                e.printStackTrace();
                z = true;
            }
            if (z) {
                return null;
            }
            return (String[]) arrayList.toArray(new String[0]);
        } catch (IOException unused) {
            return null;
        }
    }

    private static String getCurrentTimezoneID() {
        return TimeZone.getDefault().getID();
    }
}
