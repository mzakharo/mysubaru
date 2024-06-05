package com.android.lib.mcm;

import android.content.Context;
import android.net.Uri;
import android.os.Debug;
import android.os.Handler;
import android.os.Looper;
import android.os.RemoteException;
import android.util.Log;
import com.android.lib.mcm.MCResource;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.appmgr.stub.Stub;
import com.uievolution.microserver.MSServiceHelper;
import java.io.IOException;
import java.lang.Thread;
import jp.chef_station.chef_station.ChefStationConst;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
/* loaded from: classes.dex */
public class InitCustomModuleHelper {
    private static final String LOGTAG = "mcm";
    private static final Thread.UncaughtExceptionHandler mDefaultHandler = Thread.getDefaultUncaughtExceptionHandler();
    private static Handler mMainLooperHandler = new Handler(Looper.getMainLooper());
    private static Context sAppContext;
    private static IInitCustomModuleHelperDelegate sHelperDelegate;
    private static Object sMSHelper;
    private static VersionDelegate sStubDelegate;

    /* loaded from: classes.dex */
    public interface IInitCustomModuleHelperDelegate {
        Stub.IAppMgrContextDelegate createAppMgrContext();

        Stub.IAppMgrLogDelegate createAppMgrLog();

        Stub.ICheckSystemSettingsDelegate createCheckSystemSettingsDelegate();

        Stub.IExceptionLoggerDelegate createExceptionLogger();

        void setupResources();
    }

    /* loaded from: classes.dex */
    public interface LoadModuleListener {
        void onFinish(State state);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public enum State {
        init,
        execute,
        finish,
        error
    }

    /* loaded from: classes.dex */
    interface VersionDelegate {
        void addBindObserver(MSServiceHelper.BindObserver bindObserver);

        void clearBindObserver();

        State getState();

        void removeBindObserver(MSServiceHelper.BindObserver bindObserver);

        void setState(State state);
    }

    static {
        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() { // from class: com.android.lib.mcm.InitCustomModuleHelper.1
            @Override // java.lang.Thread.UncaughtExceptionHandler
            public void uncaughtException(Thread thread, Throwable th) {
                Log.e(InitCustomModuleHelper.LOGTAG, "uncaughtException", th);
                InitCustomModuleHelper.mDefaultHandler.uncaughtException(thread, th);
            }
        });
        mMainLooperHandler.post(new Runnable() { // from class: com.android.lib.mcm.InitCustomModuleHelper.2
            @Override // java.lang.Runnable
            public void run() {
                try {
                    Class.forName("android.os.AsyncTask");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        sStubDelegate = new VersionDelegate() { // from class: com.android.lib.mcm.InitCustomModuleHelper.3
            @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
            public void addBindObserver(MSServiceHelper.BindObserver bindObserver) {
            }

            @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
            public void clearBindObserver() {
            }

            @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
            public State getState() {
                return null;
            }

            @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
            public void removeBindObserver(MSServiceHelper.BindObserver bindObserver) {
            }

            @Override // com.android.lib.mcm.InitCustomModuleHelper.VersionDelegate
            public void setState(State state) {
            }
        };
        sMSHelper = null;
    }

    public static <T> void initialize(Context context, IInitCustomModuleHelperDelegate iInitCustomModuleHelperDelegate, T t) throws MCException {
        Log.d(LOGTAG, "init module helper.");
        sHelperDelegate = iInitCustomModuleHelperDelegate;
        Context applicationContext = context.getApplicationContext();
        sAppContext = applicationContext;
        if (Util.hasParam(applicationContext, "d")) {
            Debug.waitForDebugger();
            Log.d("billing_1511", "attach debug.");
        }
        boolean z = true;
        ChefStationConst.init(!Util.hasParam(sAppContext, McmConst.DEBUG_KEYWORD));
        initMcmLib();
        sMSHelper = t;
        try {
            Class.forName("com.uievolution.microserver.MSServiceHelper");
        } catch (Exception e) {
            e.printStackTrace();
            z = false;
        }
        if (z) {
            sStubDelegate = new InitCustomModuleHelper_v3(context, iInitCustomModuleHelperDelegate, (MSServiceHelper) t);
        }
    }

    static void initMcmLib() throws MCException {
        sHelperDelegate.setupResources();
        Stub.IAppMgrContextDelegate createAppMgrContext = sHelperDelegate.createAppMgrContext();
        if (createAppMgrContext != null) {
            Stub.AppMgrContextStub.sDelegate = createAppMgrContext;
        }
        Stub.IAppMgrLogDelegate createAppMgrLog = sHelperDelegate.createAppMgrLog();
        if (createAppMgrLog != null) {
            Stub.AppMgrLogStub.sDelegate = createAppMgrLog;
        }
        Stub.IExceptionLoggerDelegate createExceptionLogger = sHelperDelegate.createExceptionLogger();
        if (createExceptionLogger != null) {
            Stub.ExceptionLoggerStub.sDelegate = createExceptionLogger;
        }
        Stub.ICheckSystemSettingsDelegate createCheckSystemSettingsDelegate = sHelperDelegate.createCheckSystemSettingsDelegate();
        if (createCheckSystemSettingsDelegate != null) {
            ApplicationDelegateManager.setCheckSystemSettingsDelegate(createCheckSystemSettingsDelegate);
            int[] iArr = {MCResource.string.billing_dialog_msg_retry, MCResource.string.billing_dialog_msg_process, MCResource.string.billing_dialog_msg_success, MCResource.string.billing_dialog_msg_failure, MCResource.string.billing_dialog_btn_ok, MCResource.string.billing_dialog_btn_close, MCResource.string.billing_dialog_btn_retry, MCResource.layout.googleplaymain, MCResource.file.sendlocation_whitelist};
            for (int i = 0; i < 9; i++) {
                if (iArr[i] == -1) {
                    throw new MCException("resource initialize error.");
                }
            }
            return;
        }
        throw new MCException("not create check system settings delegate.");
    }

    public static void requestInitModule(int i) throws RemoteException {
        HttpResponse httpResponse;
        Uri.Builder builder = new Uri.Builder();
        builder.scheme("http");
        builder.encodedAuthority("127.0.0.1:" + i);
        StringBuilder sb = new StringBuilder();
        DefaultHttpClient defaultHttpClient = new DefaultHttpClient();
        sb.append("init-custom-module");
        builder.encodedPath(sb.toString());
        HttpGet httpGet = new HttpGet(builder.build().toString());
        String str = null;
        try {
            httpResponse = defaultHttpClient.execute(httpGet);
        } catch (IOException e) {
            e.printStackTrace();
            Log.d(LOGTAG, e.toString());
            httpResponse = null;
        }
        HttpEntity entity = httpResponse.getEntity();
        try {
            str = EntityUtils.toString(entity, "UTF-8");
            entity.consumeContent();
        } catch (Exception e2) {
            e2.printStackTrace();
        }
        int statusCode = httpResponse.getStatusLine().getStatusCode();
        defaultHttpClient.getConnectionManager().shutdown();
        Log.d(LOGTAG, "status : " + statusCode + " response : " + str);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static State getState() {
        return sStubDelegate.getState();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void setState(State state) {
        sStubDelegate.setState(state);
    }

    public static void addBindObserver(MSServiceHelper.BindObserver bindObserver) {
        sStubDelegate.addBindObserver(bindObserver);
    }

    public static void removeBindObserver(MSServiceHelper.BindObserver bindObserver) {
        sStubDelegate.removeBindObserver(bindObserver);
    }

    public static void clearBindObserver() {
        sStubDelegate.clearBindObserver();
    }

    public static Object getMSServiceHelper() {
        return sMSHelper;
    }
}
