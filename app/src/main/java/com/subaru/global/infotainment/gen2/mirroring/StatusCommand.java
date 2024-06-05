package com.subaru.global.infotainment.gen2.mirroring;

import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
class StatusCommand implements Command {
    static final String COMMAND = "status";
    static final String LOGTAG = "StatusCommand";
    static final int STATUS_MIRRORED = 2;
    static final int STATUS_MIRRORING = 1;
    static final int STATUS_NOT_MIRRORED = 0;

    private StatusCommand() {
    }

    @Override // com.subaru.global.infotainment.gen2.mirroring.Command
    public JSONObject process() {
        JSONObject jSONObject = new JSONObject();
        try {
            MirroringStatus status = MirroringEngine.getInstance().getStatus();
            if (status.isMirroring()) {
                jSONObject.put("result", 0);
                jSONObject.put("status", 1);
                jSONObject.put("lastdate", status.getStartDateAsString());
            } else if (status.getLastSuccessfulStartDate() == null) {
                jSONObject.put("result", 0);
                jSONObject.put("status", 0);
            } else {
                jSONObject.put("result", 0);
                jSONObject.put("status", 2);
                jSONObject.put("lastdate", status.getLastSuccessfulStartDateAsString());
            }
        } catch (JSONException e) {
            Log.w(LOGTAG, e);
        }
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static Command create() {
        return new StatusCommand();
    }
}
