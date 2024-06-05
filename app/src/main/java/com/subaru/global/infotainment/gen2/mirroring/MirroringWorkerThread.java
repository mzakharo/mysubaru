package com.subaru.global.infotainment.gen2.mirroring;

import com.subaru.global.infotainment.gen2.mirroring.PolicyInfo;
import com.uievolution.microserver.logging.MSLog;
import com.uievolution.microserver.utils.Utils;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/* loaded from: classes.dex */
class MirroringWorkerThread extends Thread {
    private static final String CONTENT_GET_URL = "http://sa3.clarion.co.jp/~MirroringTest/Contents/ContentsGet.php";
    private static final String LOGTAG = "MirroringWorkerThread";
    private static final String POLICY_RETURN_CD_SUCCESS = "INF_POLGET_000001";
    private static final String POLICY_SERVER_URL = "https://tvespa.clarion.co.jp/VespaSvr/polGet";
    private static final String POST_DATA_APPICON = "consumer_key=b54298217d9bb0ed73b1c69c97aa73dab53de51c6631c26fbf8fd01386453070&consumer_secret=2b892b6e88f91abd449a3df150924d27113ebf082a2f0560b4d0fc141eb9e8eb";
    private static final String POST_DATA_POLICY = "version=2&consumerKey=b54298217d9bb0ed73b1c69c97aa73dab53de51c6631c26fbf8fd01386453070&consumerSecret=2b892b6e88f91abd449a3df150924d27113ebf082a2f0560b4d0fc141eb9e8eb&os=3";
    private static final String TEMP_FILE_PREFIX = "___";
    private final String mToken;
    private final MirroringEngine mEngine = MirroringEngine.getInstance();
    private boolean mCancelRequested = false;

    static void cleanTempDir() {
        for (File file : MirroringEngine.CONTENT_ROOT_DIR.listFiles(new FileFilter() { // from class: com.subaru.global.infotainment.gen2.mirroring.MirroringWorkerThread.1
            @Override // java.io.FileFilter
            public boolean accept(File file2) {
                return file2.getName().startsWith(MirroringWorkerThread.TEMP_FILE_PREFIX);
            }
        })) {
            deleteFile(file);
        }
    }

    File downloadFile(URL url) throws IOException {
        return downloadFile(url, null);
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:30:0x00cd A[Catch: all -> 0x00d7, TRY_ENTER, TryCatch #5 {all -> 0x00d7, blocks: (B:22:0x007b, B:30:0x00cd, B:32:0x00d3, B:33:0x00d6), top: B:5:0x002d }] */
    /* JADX WARN: Removed duplicated region for block: B:35:? A[Catch: all -> 0x00d7, SYNTHETIC, TRY_LEAVE, TryCatch #5 {all -> 0x00d7, blocks: (B:22:0x007b, B:30:0x00cd, B:32:0x00d3, B:33:0x00d6), top: B:5:0x002d }] */
    /* JADX WARN: Type inference failed for: r1v1, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r1v10 */
    /* JADX WARN: Type inference failed for: r1v12 */
    /* JADX WARN: Type inference failed for: r1v14 */
    /* JADX WARN: Type inference failed for: r1v16 */
    /* JADX WARN: Type inference failed for: r1v6 */
    /* JADX WARN: Type inference failed for: r1v7 */
    /* JADX WARN: Type inference failed for: r1v8, types: [java.io.Closeable] */
    /* JADX WARN: Type inference failed for: r2v12, types: [java.io.BufferedInputStream, java.io.Closeable, java.io.InputStream] */
    /* JADX WARN: Type inference failed for: r2v13 */
    /* JADX WARN: Type inference failed for: r2v14 */
    /* JADX WARN: Type inference failed for: r2v17 */
    /* JADX WARN: Type inference failed for: r2v18, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r2v5 */
    /* JADX WARN: Type inference failed for: r7v0, types: [java.net.URL, java.lang.Object] */
    /* JADX WARN: Type inference failed for: r7v2 */
    /* JADX WARN: Type inference failed for: r7v4, types: [java.net.HttpURLConnection, java.net.URLConnection] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    File downloadFile(URL r7, String r8) throws IOException {
        /*
            Method dump skipped, instructions count: 230
            To view this dump change 'Code comments level' option to 'DEBUG'
        */
        throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.mirroring.MirroringWorkerThread.downloadFile(java.net.URL, java.lang.String):java.io.File");
    }

    static File unzip(File file) throws IOException {
        ZipFile zipFile = null;
        BufferedOutputStream bufferedOutputStream;
        File file2 = new File(file.getAbsoluteFile() + ".dir");
        file2.mkdirs();
        ZipFile zipFile2 = null;
        BufferedInputStream bufferedInputStream = null;
        zipFile2 = null;
        try {
            try {
                zipFile = new ZipFile(file);
            } catch (Throwable th) {
                th = th;
            }
            try {
                try {
                    Enumeration<? extends ZipEntry> entries = zipFile.entries();
                    while (entries.hasMoreElements()) {
                        ZipEntry nextElement = entries.nextElement();
                        File file3 = new File(file2, nextElement.getName());
                        if (nextElement.isDirectory()) {
                            file3.mkdirs();
                        } else {
                            try {
                                BufferedInputStream bufferedInputStream2 = new BufferedInputStream(zipFile.getInputStream(nextElement));
                                try {
                                    if (!file3.getParentFile().exists()) {
                                        file3.getParentFile().mkdirs();
                                    }
                                    bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(file3));
                                    while (true) {
                                        try {
                                            int available = bufferedInputStream2.available();
                                            if (available > 0) {
                                                byte[] bArr = new byte[available];
                                                bufferedInputStream2.read(bArr);
                                                bufferedOutputStream.write(bArr);
                                            } else {
                                                break;
                                            }
                                        } catch (Throwable th2) {
                                            Throwable th = th2;
                                            bufferedInputStream = bufferedInputStream2;
                                            if (bufferedInputStream != null) {
                                                try {
                                                    bufferedInputStream.close();
                                                } catch (IOException unused2) {
                                                }
                                            }
                                            if (bufferedOutputStream != null) {
                                                try {
                                                    bufferedOutputStream.close();
                                                    throw th;
                                                } catch (IOException unused3) {
                                                    throw th;
                                                }
                                            }
                                            throw th;
                                        }
                                    }
                                    bufferedInputStream2.close();
                                    try {
                                        bufferedOutputStream.close();
                                    } catch (IOException unused4) {
                                    }
                                } catch (Throwable th3) {
                                    //th = th3;
                                    bufferedOutputStream = null;
                                }
                            } catch (Throwable th4) {
                                //th = th4;
                                bufferedOutputStream = null;
                            }
                        }
                    }
                    zipFile.close();
                    return file2;
                } catch (IOException e) {
                    e = e;
                    zipFile2 = zipFile;
                    deleteFile(file2);
                    throw e;
                }
            } catch (Throwable th5) {
                Throwable th = th5;
                zipFile2 = zipFile;
                if (zipFile2 != null) {
                    zipFile2.close();
                }
                throw th;
            }
        } catch (Throwable e2) {
            IOException e = (IOException) e2;
        }
        return file2;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public MirroringWorkerThread(String str) {
        this.mToken = str;
    }

    void processApp(PolicyInfo.AppInfo appInfo) throws Throwable {
        File file;
        File file2;
        File downloadFile = null;
        MSLog.v(LOGTAG, "processApp(), " + appInfo.getAppHtml5Id());
        if (this.mEngine.hasLatestVersion(appInfo)) {
            MSLog.d(LOGTAG, appInfo.getAppHtml5Id() + ": Skip mirroring due to having the latest version");
            return;
        }
        MSLog.d(LOGTAG, appInfo.getAppHtml5Id() + ": Start mirroring");
        File file3 = null;
        try {
            downloadFile = downloadFile(new URL("http://sa3.clarion.co.jp/~MirroringTest/Contents/ContentsGet.php?URL=" + URLEncoder.encode(appInfo.getAppTopUrl(), "UTF-8")));
            try {
                file2 = unzip(downloadFile);
            } catch (IOException e) {
                e = e;
                file2 = null;
                file3 = downloadFile;
                file = null;
            } catch (Throwable th) {
                th = th;
                file2 = null;
                file3 = downloadFile;
                file = null;
            }
        } catch (IOException e2) {
            //e = e2;
            file = null;
            file2 = null;
        } catch (Throwable th2) {
            //th = th2;
            file = null;
            file2 = null;
        }
        try {
            file3 = downloadFile(new URL(appInfo.getAppIconDlUrl() + "/icon.gif"), POST_DATA_APPICON);
            file3.renameTo(new File(file2, "icon.gif"));
            deleteFile(appInfo.getAppDir());
            file2.renameTo(appInfo.getAppDir());
            this.mEngine.onCompleteAppMirroring(appInfo);
            deleteFile(downloadFile);
            deleteFile(file2);
            deleteFile(file3);
        } catch (IOException e3) {
            IOException e = e3;
            file = file3;
            file3 = downloadFile;
            try {
                MSLog.w(LOGTAG, e);
                deleteFile(file3);
                deleteFile(file2);
                deleteFile(file);
                MSLog.d(LOGTAG, appInfo.getAppHtml5Id() + ": Finish mirroring");
            } catch (Throwable th3) {
                Throwable th = th3;
                deleteFile(file3);
                deleteFile(file2);
                deleteFile(file);
                throw th;
            }
        } catch (Throwable th4) {
            Throwable th = th4;
            file = file3;
            file3 = downloadFile;
            deleteFile(file3);
            deleteFile(file2);
            deleteFile(file);
            throw th;
        }
        MSLog.d(LOGTAG, appInfo.getAppHtml5Id() + ": Finish mirroring");
    }

    PolicyInfo downloadPolicy() throws Exception {
        MSLog.v(LOGTAG, "downloadPolicy()");
        File downloadFile = downloadFile(new URL(POLICY_SERVER_URL), "version=2&consumerKey=b54298217d9bb0ed73b1c69c97aa73dab53de51c6631c26fbf8fd01386453070&consumerSecret=2b892b6e88f91abd449a3df150924d27113ebf082a2f0560b4d0fc141eb9e8eb&os=3&pid=" + this.mToken);
        MSLog.v(LOGTAG, "downloadPolicy, parse policy file");
        BufferedReader bufferedReader = null;
        PolicyInfo parse = null;
        try {
            BufferedReader bufferedReader2 = new BufferedReader(new FileReader(downloadFile));
            try {
                parse = PolicyInfo.parse(bufferedReader2);
                Utils.closeQuietly(bufferedReader2);
                if (!POLICY_RETURN_CD_SUCCESS.equals(parse.getReturnCd())) {
                    throw new InvalidArgumentException("Failed to get policy with an error. " + parse.getReturnCd());
                }
                MSLog.v(LOGTAG, "downloadPolicy, copy policy file");
                File file = new File(MirroringEngine.POLICY_FILE_PATH);
                file.delete();
                file.getParentFile().mkdirs();
                downloadFile.renameTo(file);
                return parse;
            } catch (Throwable th) {
                th = th;
                bufferedReader = bufferedReader2;
                Utils.closeQuietly(bufferedReader);
                throw th;
            }
        } catch (Throwable th2) {
            Throwable th = th2;
        }
        return parse;
    }

    @Override // java.lang.Thread, java.lang.Runnable
    public void run() {
        MSLog.v(LOGTAG, "run()");
        try {
            PolicyInfo downloadPolicy = downloadPolicy();
            for (PolicyInfo.AppInfo appInfo : downloadPolicy.getAppInfoList()) {
                if (isCanceled()) {
                    return;
                }
                if (appInfo.isValid()) {
                    processApp(appInfo);
                }
            }
            this.mEngine.onSucceed(downloadPolicy.getAppInfoList());
        } catch (Exception e) {
            MSLog.w(LOGTAG, e);
            this.mEngine.onError(e.getMessage());
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void deleteFile(File file) {
        if (file != null && file.exists()) {
            if (file.isFile()) {
                file.delete();
            }
            if (file.isDirectory()) {
                for (File file2 : file.listFiles()) {
                    deleteFile(file2);
                }
                file.delete();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void cancel() {
        this.mCancelRequested = true;
    }

    boolean isCanceled() {
        return this.mCancelRequested;
    }
}
