package com.subaru.global.infotainment.gen2.mirroring;

import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
class ClearCommand implements Command {
    static final String COMMAND = "clear";
    static final String LOGTAG = "ClearCommand";

    private ClearCommand() {
    }

    @Override // com.subaru.global.infotainment.gen2.mirroring.Command
    public JSONObject process() {
        MirroringEngine.getInstance().clear();
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put("result", 0);
        } catch (JSONException e) {
            Log.w(LOGTAG, e);
        }
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static Command create() {
        return new ClearCommand();
    }
}
