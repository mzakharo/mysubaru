package com.subaru.global.infotainment.gen2.mirroring;

import android.net.http.AndroidHttpClient;
import com.subaru.global.infotainment.gen2.util.Param;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
import java.io.IOException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
class MirroringCommand implements Command {
    static final String COMMAND = "mirroring";
    private static final String LAUNCHER_URL_KEY = "launcher_url_vehicle/";
    private static final String LAUNCHER_URL_VALUE = "http://192.168.1.1/smartaccess/launcher/index.html";
    private static final String LOGTAG = "MirroringCommand";
    private String mToken;

    /* JADX INFO: Access modifiers changed from: package-private */
    public MirroringCommand(String str) throws InvalidArgumentException {
        this.mToken = null;
        str = str == null ? MirroringEngine.getInstance().getPreferences().getString("last-successful-token") : str;
        if (str == null) {
            throw new InvalidArgumentException("token has never been given");
        }
        this.mToken = str;
    }

    String getToken() {
        return this.mToken;
    }

    private void updateKVS() {
        int wiFiHttpPort = MicroServer.getInstance().getWiFiHttpPort();
        AndroidHttpClient newInstance = AndroidHttpClient.newInstance("localagent");
        HttpPost httpPost = new HttpPost("http://127.0.0.1:" + wiFiHttpPort + "/kvs/" + LAUNCHER_URL_KEY);
        httpPost.setEntity(new ByteArrayEntity(LAUNCHER_URL_VALUE.getBytes()));
        try {
            try {
                newInstance.execute(httpPost);
            } catch (IOException e) {
                MSLog.w(LOGTAG, e);
            }
        } finally {
            newInstance.close();
        }
    }

    @Override // com.subaru.global.infotainment.gen2.mirroring.Command
    public JSONObject process() {
        try {
            JSONObject startMirroring = MirroringEngine.getInstance().startMirroring(this.mToken);
            updateKVS();
            return startMirroring;
        } catch (IOException e) {
            JSONObject jSONObject = new JSONObject();
            try {
                jSONObject.put("result", 1);
                jSONObject.put("message", e.getMessage());
            } catch (JSONException unused) {
            }
            return jSONObject;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static Command create(Param param) throws InvalidArgumentException {
        String str;
        try {
            str = param.getString("token");
        } catch (Param.ParamException unused) {
            str = null;
        }
        return new MirroringCommand(str);
    }
}
