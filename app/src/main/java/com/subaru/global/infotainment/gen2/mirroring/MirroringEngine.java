package com.subaru.global.infotainment.gen2.mirroring;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import com.subaru.global.infotainment.gen2.mirroring.PolicyInfo;
import com.subaru.global.infotainment.gen2.util.SecurePreferences;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.logging.MSLog;
import com.uievolution.microserver.utils.Utils;
import java.io.BufferedOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.util.List;
import org.apache.log4j.net.SyslogAppender;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class MirroringEngine {
    static final String ATTR_ALT = "alt";
    static final String ATTR_CLASS = "class";
    static final String ATTR_HREF = "href";
    static final String ATTR_ID = "id";
    static final String ATTR_SRC = "src";
    static final String ATTR_STYLE = "style";
    private static final int BUFFER_SIZE = 16384;
    static final File CONTENT_ROOT_DIR;
    public static final String ENDPOINT_URL = "/smartaccess";
    static final String KEY_LAST_SUCCESSFUL_DATE = "last-successful-date";
    static final String KEY_LAST_SUCCESSFUL_TOKEN = "last-successful-token";
    static final String KEY_MS_APP_VERSION = "ms-app-version";
    static final String LAUNCHER_DIR = "launcher";
    static final String LAUNCHER_HTML = "launcherindex.html";
    static final String LOGTAG = "MirroringEngine";
    static final String NAMESPACE = null;
    static final String POLICY_FILE_PATH;
    static final String PREFERENCE_NAME = "smartaccess-mirroring";
    static final String RES_LASTDATE = "lastdate";
    static final String RES_MESSAGE = "message";
    static final String RES_RESULT = "result";
    static final String RES_STATUS = "status";
    static final String RES_TYPE = "type";
    static final String SECURE_KEY = "securekey";
    static final String TAG_A = "a";
    static final String TAG_DIV = "div";
    static final String TAG_IMG = "img";
    static final MirroringEngine sInstance;
    private final AppDB mAppDB = new AppDB();
    private final AssetManager mAssetManager;
    private final SecurePreferences mPreferences;
    private MirroringStatus mStatus;
    private MirroringWorkerThread mWorkerThread;

    static {
        File dir = MicroServer.getInstance().getContext().getDir("mirror-content", 0);
        CONTENT_ROOT_DIR = dir;
        POLICY_FILE_PATH = dir.getAbsolutePath() + "/" + LAUNCHER_DIR + "/policy.xml";
        sInstance = new MirroringEngine();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static MirroringEngine getInstance() {
        return sInstance;
    }

    private MirroringEngine() {
        SecurePreferences securePreferences = new SecurePreferences(MicroServer.getInstance().getContext(), PREFERENCE_NAME, SECURE_KEY, true);
        this.mPreferences = securePreferences;
        this.mStatus = MirroringStatus.load(securePreferences);
        this.mAssetManager = MicroServer.getInstance().getContext().getAssets();
        if (isUpdated()) {
            copyAssetToLocal(LAUNCHER_DIR);
        }
    }

    private boolean isUpdated() {
        PackageInfo packageInfo;
        Context context = MicroServer.getInstance().getContext();
        try {
            packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 128);
        } catch (PackageManager.NameNotFoundException unused) {
            packageInfo = null;
        }
        String str = packageInfo.versionName;
        boolean z = !str.equals(this.mPreferences.getString(KEY_MS_APP_VERSION));
        if (z) {
            this.mPreferences.put(KEY_MS_APP_VERSION, str);
        }
        return z;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public SecurePreferences getPreferences() {
        return this.mPreferences;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MirroringStatus getStatus() {
        return this.mStatus;
    }

    void cancel() {
        MSLog.d(LOGTAG, "Cancel mirroring");
        MirroringWorkerThread mirroringWorkerThread = this.mWorkerThread;
        if (mirroringWorkerThread != null) {
            mirroringWorkerThread.cancel();
            try {
                this.mWorkerThread.join();
            } catch (InterruptedException e) {
                MSLog.w(LOGTAG, e);
            }
        }
        this.mStatus.onCancel();
        this.mWorkerThread = null;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void onError(String str) {
        this.mStatus.onError(str);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void onSucceed(List<PolicyInfo.AppInfo> list) {
        updateIndexHtml(list);
        this.mStatus.onSucceed();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void onCompleteAppMirroring(PolicyInfo.AppInfo appInfo) {
        this.mAppDB.insertOrUpdate(appInfo.getAppHtml5Id(), appInfo.getAppVer());
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:29:0x016c  */
    /* JADX WARN: Type inference failed for: r2v2, types: [java.io.StringWriter, java.io.Closeable, java.io.Writer] */
    /* JADX WARN: Type inference failed for: r2v4 */
    /* JADX WARN: Type inference failed for: r2v7, types: [boolean] */
    /* JADX WARN: Type inference failed for: r8v1 */
    /* JADX WARN: Type inference failed for: r8v2, types: [java.io.Closeable] */
    /* JADX WARN: Type inference failed for: r8v3 */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    private void updateIndexHtml(List<PolicyInfo.AppInfo> r20) {
        /*
            Method dump skipped, instructions count: 413
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.mirroring.MirroringEngine.updateIndexHtml(java.util.List):void");
    }

    private String genAppPosition(int i, int i2) {
        return "left: " + ((i * SyslogAppender.LOG_LOCAL3) + 100) + "px; top: " + ((i2 * 164) + 25) + "px; width: 145px; height: 156px;";
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized JSONObject startMirroring(String str) throws IOException {
        JSONObject jSONObject;
        if (this.mStatus.isMirroring()) {
            cancel();
        }
        this.mStatus.onStart(str);
        MirroringWorkerThread mirroringWorkerThread = new MirroringWorkerThread(str);
        this.mWorkerThread = mirroringWorkerThread;
        mirroringWorkerThread.start();
        jSONObject = new JSONObject();
        try {
            jSONObject.put("result", 0);
        } catch (JSONException unused) {
        }
        return jSONObject;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean hasLatestVersion(PolicyInfo.AppInfo appInfo) {
        if (appInfo.getAppDir().exists()) {
            return appInfo.getAppVer() == null || appInfo.getAppVer().equals(this.mAppDB.getVersion(appInfo.getAppHtml5Id()));
        }
        return false;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public synchronized void clear() {
        this.mPreferences.clear();
        this.mAppDB.recreateTable();
        for (File file : CONTENT_ROOT_DIR.listFiles()) {
            MirroringWorkerThread.deleteFile(file);
        }
        this.mStatus = MirroringStatus.load(this.mPreferences);
        copyAssetToLocal(LAUNCHER_DIR);
    }

    private void copyAssetToLocal(String str) {
        try {
            String[] list = this.mAssetManager.list(str);
            if (list.length == 0) {
                copyFile(str);
                return;
            }
            File file = new File(CONTENT_ROOT_DIR.getAbsolutePath() + "/" + str);
            if (!file.exists()) {
                file.mkdirs();
            }
            for (String str2 : list) {
                copyAssetToLocal(str + "/" + str2);
            }
        } catch (IOException e) {
            MSLog.w(LOGTAG, e);
        }
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r7v0, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r7v10 */
    /* JADX WARN: Type inference failed for: r7v15 */
    /* JADX WARN: Type inference failed for: r7v16 */
    /* JADX WARN: Type inference failed for: r7v2 */
    /* JADX WARN: Type inference failed for: r7v5 */
    /* JADX WARN: Type inference failed for: r7v6, types: [java.io.Closeable] */
    /* JADX WARN: Type inference failed for: r7v8, types: [java.io.Closeable] */
    private void copyFile(String str) {
        InputStream inputStream;
        Throwable th;
        IOException e;
        BufferedOutputStream bufferedOutputStream = null;
        try {
            try {
                inputStream = this.mAssetManager.open(str);
                try {
                    bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(new File(CONTENT_ROOT_DIR.getAbsolutePath() + "/" + ((String) str))));
                } catch (IOException e2) {
                    e = e2;
                    bufferedOutputStream = null;
                } catch (Throwable th2) {
                    th = th2;
                    str = null;
                    Utils.closeQuietly(inputStream);
//Utils.closeQuietly((Closeable) str);
                    throw th;
                }
            } catch (IOException e3) {
                inputStream = null;
                e = e3;
                bufferedOutputStream = null;
            } catch (Throwable th3) {
                inputStream = null;
                th = th3;
                str = null;
            }
            try {
                copy(inputStream, bufferedOutputStream);
                str = bufferedOutputStream.toString();
            } catch (IOException e4) {
                e = e4;
                MSLog.w(LOGTAG, e);
                str = bufferedOutputStream.toString();
                Utils.closeQuietly(inputStream);
                //Utils.closeQuietly((Closeable) str);
            }
            Utils.closeQuietly(inputStream);
            //Utils.closeQuietly((Closeable) str);
        } catch (Throwable th4) {
            th = th4;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public File getContent(String str) {
        return new File(CONTENT_ROOT_DIR, str.substring(13));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public File getLauncherContent(String str) {
        if (str.equals("/smartaccess/launcher/index.html")) {
            if (getStatus().isMirroring()) {
                return new File(CONTENT_ROOT_DIR, "launcher/under-mirroring.html");
            }
            return new File(CONTENT_ROOT_DIR, "launcher/index.html");
        }
        return new File(CONTENT_ROOT_DIR, str.substring(13));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static long copy(InputStream inputStream, OutputStream outputStream) throws IOException {
        byte[] bArr = new byte[16384];
        long j = 0;
        while (true) {
            int read = inputStream.read(bArr);
            if (read < 0) {
                return j;
            }
            j += read;
            outputStream.write(bArr, 0, read);
        }
    }

    static long copy(Reader reader, Writer writer) throws IOException {
        char[] cArr = new char[16384];
        long j = 0;
        while (true) {
            int read = reader.read(cArr);
            if (read < 0) {
                return j;
            }
            j += read;
            writer.write(cArr, 0, read);
        }
    }
}
