package com.android.lib.mcm;

import android.content.ComponentName;
import android.content.Context;
import android.content.ServiceConnection;
import android.os.Debug;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;
import com.uievolution.microserver.modulekit.MSModuleDelegate;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.UnsupportedEncodingException;
import java.lang.Thread;
import jp.chef_station.chef_station.ChefStationConst;
import org.slf4j.Marker;
/* loaded from: classes.dex */
public class InitCustomModule implements MSModuleDelegate {
    static final String LOGTAG = "intelligenttune";
    private static final Thread.UncaughtExceptionHandler mDefaultHandler = Thread.getDefaultUncaughtExceptionHandler();
    private static Handler mMainLooperHandler = new Handler(Looper.getMainLooper());
    private static ServiceConnection sPurchaseNoticePollingServiceConnection = new ServiceConnection() { // from class: com.android.lib.mcm.InitCustomModule.1
        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
            Log.d("billing_1507", "PurchaseNoticeポーリング Disconnected");
        }

        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            Log.d("billing_1507", "PurchaseNoticeポーリング Connected");
        }
    };
    private final IInitCustomModuleDelegate mDelegate;

    /* loaded from: classes.dex */
    public interface IInitCustomModuleDelegate {
        void initMsModule(Context context);
    }

    static {
        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() { // from class: com.android.lib.mcm.InitCustomModule.2
            @Override // java.lang.Thread.UncaughtExceptionHandler
            public void uncaughtException(Thread thread, Throwable th) {
                Log.e(InitCustomModule.LOGTAG, "uncaughtException", th);
                InitCustomModule.mDefaultHandler.uncaughtException(thread, th);
            }
        });
        mMainLooperHandler.post(new Runnable() { // from class: com.android.lib.mcm.InitCustomModule.3
            @Override // java.lang.Runnable
            public void run() {
                try {
                    Class.forName("android.os.AsyncTask");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public InitCustomModule(IInitCustomModuleDelegate iInitCustomModuleDelegate) {
        this.mDelegate = iInitCustomModuleDelegate;
    }

    @Override // com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) {
        initMsModule(MicroServer.getInstance().getContext().getApplicationContext());
        byte[] bArr = new byte[0];
        try {
            bArr = "{\"return_cd\":\"M001I\"}".getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        mSHTTPResponder.startResponse(200, new Header[]{new BasicHeader(HttpCatalogs.HEADER_CONNECTION, "close"), new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_CONTENT_TYPE, HarmanOTAConst.JSON_CONTENT_TYPE), new BasicHeader(HttpCatalogs.HEADER_CONTENT_LENGTH, String.valueOf(bArr.length))});
        mSHTTPResponder.writeResponseData(bArr);
        mSHTTPResponder.closeResponse();
    }

    private void initMsModule(Context context) {
        if (Util.hasParam(context, "d")) {
            Debug.waitForDebugger();
            Log.d("billing_1511", "attach debug.");
        }
        ChefStationConst.init(!Util.hasParam(context, McmConst.DEBUG_KEYWORD));
        this.mDelegate.initMsModule(context);
        Log.d("billing_1507", "no.2:InitCustomModule:create polling");
        PurchaseNoticePollingUtil.create(context, sPurchaseNoticePollingServiceConnection, AppInfoUtil.getCurrentWiFiPort());
    }
}
