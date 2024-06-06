package com.subaru.global.infotainment.gen2;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.TypedArray;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.RemoteException;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import com.android.lib.mcm.InitCustomModuleHelper;
import com.android.lib.mcm.MCException;
import com.android.lib.mcm.Util;
import com.android.lib.mcm.application.ApplicationLifecycleHandler;
import com.android.lib.mcm.application.MCApplication;
import com.android.lib.mcm.send_location.SendLocationServiceUtil;
import com.android.lib.mcm.util.McmConst;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;
import com.example.mysubaru.R;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.subaru.global.infotainment.gen2.extend.ExternalModuleLoader;
import com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder;
import com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager;
import com.subaru.global.infotainment.gen2.interceptor.TlsConvertInterceptor;
import com.subaru.global.infotainment.gen2.util.UserNotification;
import com.uievolution.microserver.IMSSConnectionObserver;
import com.uievolution.microserver.IMSSErrorObserver;
import com.uievolution.microserver.MSConfig;
import com.uievolution.microserver.MSServiceHelper;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.MicroServerService;
import com.uievolution.microserver.modules.KeyValueStore;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import org.apache.log4j.varia.ExternallyRolledFileAppender;

/* loaded from: classes.dex */
public class MainActivity extends Activity implements View.OnClickListener, View.OnTouchListener, LocationListener {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    static final boolean DEFAULT_PORTRAIT = true;
    static final int DEFAULT_SELECTED_TAB_INDEX = 1;
    static final int DEFAULT_TABNUM = 3;
    static final String LOG_TAG = "MainActivity";
    static final int MAX_TABNUM = 5;
    static final String NEVER_SHOW_LOCATION_CONFIRMATION_DIALOG = "never-show-location-confirmation-dialog";
    static final String OPEN_TAB_INDEX = "opentabindex";
    private static final int PERMISSION_REQUEST_ID = 1;
    private static final String REQUESTING_PERMISSIONS_KEY = "REQUESTING_PERMISSIONS_KEY";
    static final int REQUEST_CODE_RECOVER_PLAY_SERVICES = 1001;
    private static final String[] sNeedsAppPermissions;
    LocationManager locationManager;
    private KVSUpdateReceiver mKVSUpdateReceiver;
    private WebView mWebView;
    private WebView widgetWebView;
    private ApplicationLifecycleHandler mLifecycleHandler = null;

    StarLinkApplication app = (StarLinkApplication) MCApplication.getInstance();
    private final MSWebViewBinder mMSWebViewBinder = app.createMSWebViewBinder();
    private final List<View> mTabs = new ArrayList();
    private int mSelectedTabIndex = 1;
    private AlertDialog mDeniedPermissionsDialog = null;
    private AlertDialog mDeniedPermissionsDialog2 = null;
    private boolean mRequestingPermissions = false;
    private boolean mRestart = false;
    private IMSSConnectionObserver mConnectionObserver = new IMSSConnectionObserver.Stub() { // from class: com.subaru.global.infotainment.gen2.MainActivity.1
        @Override // com.uievolution.microserver.IMSSConnectionObserver
        public void onConnectionEvent(int i) throws RemoteException {
            if (i == 1) {
                Log.d(MainActivity.LOG_TAG, "MWS connected");
                MainActivity.this.mTlsClient.requestUpdate(MainActivity.this.getApplicationContext());
            } else {
                if (i == 2) {
                    Log.d(MainActivity.LOG_TAG, "MWS disconnected");
                    return;
                }
                Log.e(MainActivity.LOG_TAG, "MWS unknown status=" + i);
            }
        }
    };
    private MSServiceHelper.BindObserver mMicroServerBindObserver = new MSServiceHelper.BindObserver() { // from class: com.subaru.global.infotainment.gen2.MainActivity.2
        @Override // com.uievolution.microserver.MSServiceHelper.BindObserver
        public void onUnbind() {
            Log.d(MainActivity.LOG_TAG, "MWS onUnbind");
            if (MainActivity.this.mLifecycleHandler != null) {
                MainActivity.this.mLifecycleHandler.onUnbindMws();
            }
        }

        @Override // com.uievolution.microserver.MSServiceHelper.BindObserver
        public void onBind() {
            Log.d(MainActivity.LOG_TAG, "MWS onBind");
            if (MainActivity.this.mLifecycleHandler != null) {
                MainActivity.this.mLifecycleHandler.onBindMws();
            }
            try {
                HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
            } catch (Exception e) {
                e.printStackTrace();
            }
            HarmanOTAWebViewBinder.getInstanse().init();
        }
    };
    private AlertDialog mLocationAlertDialog = null;
    private AlertDialog mCloseAlertDialog = null;
    private MSServiceHelper mMSServiceHelper = null;
    private IMSSErrorObserver mIMSSErrorObserver = null;
    private IMSSConnectionObserver mIMSSConnectionObserver = null;
    private boolean locationDenyFlag = false;
    private final TlsConvertInterceptor.Client mTlsClient = new TlsConvertInterceptor.Client();
    private final IMSSErrorObserver mErrorObserver = new IMSSErrorObserver.Stub() { // from class: com.subaru.global.infotainment.gen2.MainActivity.3
        @Override // com.uievolution.microserver.IMSSErrorObserver
        public void error(int i, final String str) throws RemoteException {
            Log.d(MainActivity.LOG_TAG, "MainActivity : MicroServer error", new Throwable());
            if (i == -6) {
                MainActivity.this.runOnUiThread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.MainActivity.3.1
                    @Override // java.lang.Runnable
                    public void run() {
                        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                        builder.setTitle("Error");
                        builder.setMessage(str);
                        builder.setPositiveButton(ExternallyRolledFileAppender.OK, (DialogInterface.OnClickListener) null);
                        builder.show();
                    }
                });
            }
        }
    };
    private BroadcastReceiver mReceiver = null;

    @Override // android.location.LocationListener
    public void onProviderDisabled(String str) {
    }

    @Override // android.location.LocationListener
    public void onProviderEnabled(String str) {
    }

    @Override // android.location.LocationListener
    public void onStatusChanged(String str, int i, Bundle bundle) {
    }

    /* loaded from: classes.dex */
    class KVSUpdateReceiver extends BroadcastReceiver {
        KVSUpdateReceiver() {
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if (intent.getExtras().getString("message").equals("true")) {
                MainActivity.this.widgetWebView.loadUrl("file:///android_asset/docroot/widgetMain.html");
            } else {
                MainActivity.this.widgetWebView.loadUrl("javascript:if( typeof exec_flgWidget ==='function' ){exec_flgWidget();}");
            }
        }
    }

    static {
        ArrayList arrayList = new ArrayList();
        arrayList.add("android.permission.ACCESS_FINE_LOCATION");
        arrayList.add("android.permission.ACCESS_COARSE_LOCATION");
        if (Build.VERSION.SDK_INT >= 29) {
            arrayList.add("android.permission.ACCESS_BACKGROUND_LOCATION");
        }
        if (Build.VERSION.SDK_INT <= 18) {
            arrayList.add("android.permission.WRITE_EXTERNAL_STORAGE");
        } else {
           // arrayList.add("android.permission.READ_EXTERNAL_STORAGE");
        }
        arrayList.add("android.permission.READ_CONTACTS");
        arrayList.add("android.permission.READ_PHONE_STATE");
        arrayList.add("android.permission.WAKE_LOCK");
        arrayList.add("android.permission.BLUETOOTH");
        arrayList.add("android.permission.BLUETOOTH_ADMIN");
        arrayList.add("android.permission.ACCESS_NETWORK_STATE");
        sNeedsAppPermissions = (String[]) arrayList.toArray(new String[0]);
    }

    private View generateTab(int i) {
        LinearLayout linearLayout = (LinearLayout) getLayoutInflater().inflate(R.layout.texticonbutton, (ViewGroup) null);
        linearLayout.setLayoutParams(new LinearLayout.LayoutParams(0, -2, 1.0f));
        linearLayout.setOnClickListener(this);
        linearLayout.setOnTouchListener(this);
        TypedArray obtainTypedArray = getResources().obtainTypedArray(R.array.tab_icons);
        ((ImageView) linearLayout.getChildAt(0)).setImageDrawable(obtainTypedArray.getDrawable(i));
        obtainTypedArray.recycle();
        TypedArray obtainTypedArray2 = getResources().obtainTypedArray(R.array.tab_labels);
        ((TextView) linearLayout.getChildAt(1)).setText(obtainTypedArray2.getString(i));
        obtainTypedArray2.recycle();
        return linearLayout;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void updateView(int i, boolean z) {
        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.buttonsLayout);
        linearLayout.removeAllViews();
        this.mTabs.clear();
        if (i == 0) {
            linearLayout.setLayoutParams(new LinearLayout.LayoutParams(-1, 0));
        } else {
            linearLayout.setLayoutParams(new LinearLayout.LayoutParams(-1, -2));
            for (int i2 = 0; i2 < i; i2++) {
                View generateTab = generateTab(i2);
                linearLayout.addView(generateTab);
                this.mTabs.add(generateTab);
            }
        }
        if (updateSelectedTab()) {
            return;
        }
        this.mSelectedTabIndex = -1;
    }

    @Override // android.app.Activity
    public void onCreate(Bundle bundle) {
        String str = LOG_TAG;
        Log.d(str, "onCreate");
        setTheme(R.style.AppTheme);
        super.onCreate(bundle);
        requestWindowFeature(1);
        setContentView(R.layout.main);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        if (bundle != null) {
            Log.d(str, "onCreate savedInstanceState != null");
            this.mRequestingPermissions = bundle.getBoolean(REQUESTING_PERMISSIONS_KEY);
        }
        this.mLifecycleHandler = ApplicationLifecycleHandler.initialize(getApplication());
        initSettings();
        KVSUpdateReceiver kVSUpdateReceiver = new KVSUpdateReceiver();
        this.mKVSUpdateReceiver = kVSUpdateReceiver;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(kVSUpdateReceiver, new IntentFilter("exec_flgWidget"), Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(kVSUpdateReceiver, new IntentFilter("exec_flgWidget"));
        }
    }

    @Override // android.app.Activity
    public void onSaveInstanceState(Bundle bundle) {
        Log.d(LOG_TAG, "onSaveInstanceState");
        super.onSaveInstanceState(bundle);
        bundle.putBoolean(REQUESTING_PERMISSIONS_KEY, this.mRequestingPermissions);
    }

    private void initSettings() {
        String simCountry;
        String str = LOG_TAG;
        Log.d(str, "initSettings");
        AlertDialog alertDialog = this.mDeniedPermissionsDialog;
        if (alertDialog != null) {
            alertDialog.dismiss();
        }
        if (this.mMSServiceHelper != null) {
            Log.d(str, "initSettings mMSServiceHelper != null");
            return;
        }
        if (this.mRequestingPermissions) {
            Log.d(str, "initSettings mRequestingPermissions == true");
            this.mRestart = true;
            for (ActivityManager.AppTask appTask : ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE)).getAppTasks()) {
                Log.d(LOG_TAG, "task:" + appTask.getTaskInfo().baseActivity.getClassName());
                appTask.finishAndRemoveTask();
            }
            finish();
            return;
        }
        this.mMSServiceHelper = new MSServiceHelper(getApplicationContext());
        WebView webView = (WebView) findViewById(R.id.widgetWebView);
        this.widgetWebView = webView;
        webView.getSettings().setJavaScriptEnabled(true);
        this.widgetWebView.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        new MSWebViewBinder().init(this.widgetWebView, this, this.mMSServiceHelper);
        if (Build.VERSION.SDK_INT >= 21) {
            this.widgetWebView.getSettings().setMixedContentMode(0);
        }
        this.mWebView = (WebView) findViewById(R.id.webView1);
        if (Util.hasParam(getApplicationContext(), McmConst.DEBUG_KEYWORD) && Build.VERSION.SDK_INT >= 19) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        this.mWebView.setOverScrollMode(2);
        this.mMSWebViewBinder.init(this.mWebView, this, this.mMSServiceHelper);
        this.mWebView.setFocusable(true);
        this.mWebView.setFocusableInTouchMode(true);
        this.mWebView.setHorizontalScrollBarEnabled(true);
        this.mWebView.setVerticalScrollBarEnabled(true);
        this.mWebView.setWebChromeClient(new WebChromeClient() { // from class: com.subaru.global.infotainment.gen2.MainActivity.4
            @Override // android.webkit.WebChromeClient
            public boolean onJsAlert(WebView webView2, String str2, String str3, JsResult jsResult) {
                return super.onJsAlert(webView2, str2, str3, jsResult);
            }
        });
        this.mWebView.getSettings().setJavaScriptEnabled(true);
        this.mWebView.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        this.mWebView.getSettings().setSupportMultipleWindows(false);
        //this.mWebView.getSettings().setAppCacheEnabled(true);
        File file = new File(getApplicationContext().getFilesDir(), "app-cache");
        file.mkdirs();
        //this.mWebView.getSettings().setAppCachePath(file.getAbsolutePath());
        //this.mWebView.getSettings().setAppCacheMaxSize(10485760L);
        this.mWebView.getSettings().setSupportZoom(true);
        this.mWebView.getSettings().setBuiltInZoomControls(true);
        if (Build.VERSION.SDK_INT >= 16) {
            this.mWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
            this.mWebView.getSettings().setAllowFileAccessFromFileURLs(true);
        }
        this.mWebView.getSettings().setAllowFileAccess(true);
        this.mWebView.getSettings().setDomStorageEnabled(true);
        if (Build.VERSION.SDK_INT >= 21) {
            this.mWebView.getSettings().setMixedContentMode(0);
        }
        String[] stringArray = getResources().getStringArray(R.array.tab_urls);
        Log.d(str, "call CountryCode()");
        try {
            simCountry = new BufferedReader(new InputStreamReader(openFileInput("CountryCode"), "UTF-8")).readLine();
        } catch (Exception e) {
            e.printStackTrace();
            simCountry = AppInfoUtil.getSimCountry(getApplicationContext());
        }
        if (simCountry != null) {
            stringArray[this.mSelectedTabIndex] = stringArray[this.mSelectedTabIndex] + "?countrycode=" + simCountry;
        }
        this.mWebView.loadUrl(stringArray[this.mSelectedTabIndex]);
        updateView(3, true);
        BroadcastReceiver broadcastReceiver = new BroadcastReceiver() { // from class: com.subaru.global.infotainment.gen2.MainActivity.5
            @Override // android.content.BroadcastReceiver
            public void onReceive(Context context, Intent intent) {
                int intExtra = intent.getIntExtra(ViewChangeModule.KEY_TABNUM, 0);
                boolean booleanExtra = intent.getBooleanExtra(ViewChangeModule.KEY_PORTRAIT, true);
                Log.d(MainActivity.LOG_TAG, "Got message: " + intExtra + ", " + booleanExtra);
                MainActivity.this.updateView(intExtra, booleanExtra);
            }
        };
        this.mReceiver = broadcastReceiver;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(broadcastReceiver, new IntentFilter(ViewChangeModule.BROADCAST_ACTION), RECEIVER_EXPORTED);
        } else {
            registerReceiver(broadcastReceiver, new IntentFilter(ViewChangeModule.BROADCAST_ACTION));
        }
        if (!isAgreedLocation()) {
            showLocationPopup();
        } else if (checkIsLocationPermissionGranted()) {
            showLocationPopup();
        } else if (!this.locationDenyFlag && executeRequestPermissions()) {
            Log.d(LOG_TAG, "initSettings executeRequestPermissions() == true");
            try {
                this.mMSServiceHelper.stop();
                this.mMSServiceHelper = null;
                return;
            } catch (Exception unused) {
                this.mMSServiceHelper = null;
                return;
            } catch (Throwable unused2) {
                this.mMSServiceHelper = null;
                return;
            }
        }
        startMWS(getApplicationContext(), this.mConnectionObserver, this.mErrorObserver);
        this.mLifecycleHandler.setMwsHelper(this.mMSServiceHelper);
        SendLocationServiceUtil.create(getApplicationContext());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean startMWS(Context context, IMSSConnectionObserver iMSSConnectionObserver, IMSSErrorObserver iMSSErrorObserver) {
        if (this.mMSServiceHelper == null) {
            this.mMSServiceHelper = new MSServiceHelper(context);
        }
        if (this.mMSServiceHelper.isServiceRunning()) {
            Log.d(LOG_TAG, "MWS is already started.");
            return true;
        }
        if (iMSSConnectionObserver != null) {
            this.mIMSSConnectionObserver = iMSSConnectionObserver;
        }
        IMSSConnectionObserver iMSSConnectionObserver2 = this.mIMSSConnectionObserver;
        if (iMSSConnectionObserver2 != null) {
            this.mMSServiceHelper.addConnectionObserver(iMSSConnectionObserver2);
        }
        if (iMSSErrorObserver != null) {
            this.mIMSSErrorObserver = iMSSErrorObserver;
        }
        IMSSErrorObserver iMSSErrorObserver2 = this.mIMSSErrorObserver;
        if (iMSSErrorObserver2 != null) {
            this.mMSServiceHelper.addErrorObserver(iMSSErrorObserver2);
        }
        try {
            InitCustomModuleHelper.initialize(context, new InitCustomModuleHelperDelegate(), this.mMSServiceHelper);
        } catch (MCException e) {
            e.printStackTrace();
        }
        InitCustomModuleHelper.addBindObserver(this.mMicroServerBindObserver);
        PendingIntent activity = PendingIntent.getActivity(context, 0, new Intent(context, (Class<?>) MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        MSConfig mSConfig = new MSConfig();
        mSConfig.setNotification(new UserNotification().createNotification(context, activity, MicroServer.DEFAULT_LWIP_SERVICE_NAME, "MicroServer is running", context.getString(R.string.APP_TXT_0387), 3), new UserNotification().createNotification(context, activity, MicroServer.DEFAULT_LWIP_SERVICE_NAME, context.getString(R.string.APP_TXT_0007), context.getString(R.string.APP_TXT_0387), 3));
        this.mMSServiceHelper.start(mSConfig);
        ExternalModuleLoader.onApplicationLaunchWithActivityProcess(getApplicationContext());
        Log.d(LOG_TAG, "start MWS");
        return true;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean executeRequestPermissions() {
        boolean z;
        ArrayList<String> deniedPermissions = getDeniedPermissions();
        if (deniedPermissions.size() > 0) {
            this.mRequestingPermissions = true;
            Log.d(LOG_TAG, "executeRequestPermissions requestPermissions");
            int i = 0;
            while (true) {
                if (i >= deniedPermissions.size()) {
                    z = false;
                    break;
                }
                Log.d(LOG_TAG, deniedPermissions.get(i));
                if (deniedPermissions.get(i) == "android.permission.ACCESS_BACKGROUND_LOCATION" && Build.VERSION.SDK_INT > 29) {
                    deniedPermissions.remove(i);
                    z = true;
                    break;
                }
                i++;
            }
            if (deniedPermissions.size() > 0) {
                requestPermissions((String[]) deniedPermissions.toArray(new String[deniedPermissions.size()]), 1);
            }
            if (z) {
                requestPermissions(new String[]{"android.permission.ACCESS_BACKGROUND_LOCATION"}, 1);
            }
            return true;
        }
        locationStart();
        return false;
    }

    private ArrayList<String> getDeniedPermissions() {
        ArrayList<String> arrayList = new ArrayList<>();
        if (Build.VERSION.SDK_INT < 23) {
            return arrayList;
        }
        for (String str : sNeedsAppPermissions) {
            if (checkSelfPermission(str) != PackageManager.PERMISSION_GRANTED) {
                Log.e("ContextWrapper Permission Err", str);
                arrayList.add(str);
            }
        }
        return arrayList;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void getAppDetailSettingIntent(Context context) {
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 9) {
            intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            intent.setData(Uri.fromParts("package", getPackageName(), null));
        } else if (Build.VERSION.SDK_INT <= 8) {
            intent.setAction("android.intent.action.VIEW");
            intent.setClassName("com.android.settings", "com.android.settings.InstalledAppDetails");
            intent.putExtra("com.android.settings.ApplicationPkgName", getPackageName());
        }
        startActivity(intent);
    }

    @Override // android.app.Activity
    public void onRequestPermissionsResult(int i, String[] strArr, int[] iArr) {
        String str = LOG_TAG;
        Log.d(str, "onRequestPermissionsResult");
        if (i == 1) {
            this.mRequestingPermissions = false;
            boolean z = getDeniedPermissions().size() <= 0;
            if (iArr.length == 0) {
                Log.d(str, "onRequestPermissionsResult grantResults.length == 0");
                return;
            }
            if (z) {
                locationStart();
                initSettings();
                return;
            }
            ArrayList<String> deniedPermissions = getDeniedPermissions();
            this.mDeniedPermissionsDialog = new AlertDialog.Builder(this).setMessage(R.string.denied_permission_alert).setOnCancelListener(new DialogInterface.OnCancelListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.8
                @Override // android.content.DialogInterface.OnCancelListener
                public void onCancel(DialogInterface dialogInterface) {
                    MainActivity.this.mDeniedPermissionsDialog = null;
                }
            }).setPositiveButton("SETTING", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.7
                @Override // android.content.DialogInterface.OnClickListener
                public void onClick(DialogInterface dialogInterface, int i2) {
                    dialogInterface.dismiss();
                    MainActivity mainActivity = MainActivity.this;
                    mainActivity.getAppDetailSettingIntent(mainActivity);
                    MainActivity.this.mDeniedPermissionsDialog2 = null;
                }
            }).setNeutralButton("CANCEL", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.6
                @Override // android.content.DialogInterface.OnClickListener
                public void onClick(DialogInterface dialogInterface, int i2) {
                    dialogInterface.dismiss();
                    MainActivity.this.mDeniedPermissionsDialog = null;
                    MainActivity.this.locationDenyFlag = true;
                }
            }).show();
            for (int i2 = 0; i2 < deniedPermissions.size(); i2++) {
                if (deniedPermissions.get(i2).equals("android.permission.ACCESS_FINE_LOCATION")) {
                    this.mDeniedPermissionsDialog2 = new AlertDialog.Builder(this).setMessage(R.string.denied_permission_location_alert).setOnCancelListener(new DialogInterface.OnCancelListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.11
                        @Override // android.content.DialogInterface.OnCancelListener
                        public void onCancel(DialogInterface dialogInterface) {
                            MainActivity.this.mDeniedPermissionsDialog2 = null;
                        }
                    }).setPositiveButton("SETTING", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.10
                        @Override // android.content.DialogInterface.OnClickListener
                        public void onClick(DialogInterface dialogInterface, int i3) {
                            dialogInterface.dismiss();
                            MainActivity mainActivity = MainActivity.this;
                            mainActivity.getAppDetailSettingIntent(mainActivity);
                            MainActivity.this.mDeniedPermissionsDialog = null;
                        }
                    }).setNeutralButton("CANCEL", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.9
                        @Override // android.content.DialogInterface.OnClickListener
                        public void onClick(DialogInterface dialogInterface, int i3) {
                            dialogInterface.dismiss();
                            MainActivity.this.mDeniedPermissionsDialog2 = null;
                            MainActivity.this.locationDenyFlag = true;
                        }
                    }).show();
                }
            }
            return;
        }
        super.onRequestPermissionsResult(i, strArr, iArr);
    }

    private boolean updateSelectedTab() {
        int i = this.mSelectedTabIndex;
        if (i < 0 || i >= this.mTabs.size()) {
            return false;
        }
        this.mTabs.get(this.mSelectedTabIndex).setSelected(true);
        return true;
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public void onWindowFocusChanged(boolean z) {
        super.onWindowFocusChanged(z);
    }

    @Override // android.app.Activity, android.view.KeyEvent.Callback
    public boolean onKeyDown(int i, KeyEvent keyEvent) {
        if (i == 4 && ((WebView) findViewById(R.id.webView1)).canGoBack()) {
            return true;
        }
        return super.onKeyDown(i, keyEvent);
    }

    @Override // android.app.Activity
    protected void onStart() {
        Log.d(LOG_TAG, "onStart");
        super.onStart();
    }

    @Override // android.app.Activity
    protected void onRestart() {
        Log.d(LOG_TAG, "onRestart");
        super.onRestart();
        initSettings();
    }

    @Override // android.app.Activity
    protected void onResume() {
        int intExtra;
        Log.d(LOG_TAG, "onResume");
        super.onResume();
        checkLocationServices();
        Intent intent = getIntent();
        if (intent != null && intent.getAction() != null && intent.getAction().equals(MicroServerService.ACTION_SHOW_CLOSE_DIALOG)) {
            showCloseDialog();
        }
        if (intent != null && intent.getIntExtra(OPEN_TAB_INDEX, -1) >= 0 && (intExtra = intent.getIntExtra(OPEN_TAB_INDEX, -1)) < this.mTabs.size()) {
            unSelectAllTabs();
            this.mTabs.get(intExtra).performClick();
        }
        HarmanOTAUtil.checkIntent(intent);
    }

    @Override // android.app.Activity
    protected void onNewIntent(Intent intent) {
        Log.d(LOG_TAG, "onNewIntent");
        super.onNewIntent(intent);
        setIntent(intent);
    }

    @Override // android.app.Activity
    protected void onPause() {
        Log.d(LOG_TAG, "onPause");
        AlertDialog alertDialog = this.mCloseAlertDialog;
        if (alertDialog != null) {
            alertDialog.dismiss();
            this.mCloseAlertDialog = null;
        }
        AlertDialog alertDialog2 = this.mLocationAlertDialog;
        if (alertDialog2 != null) {
            alertDialog2.dismiss();
            this.mLocationAlertDialog = null;
        }
        super.onPause();
        setIntent(null);
    }

    @Override // android.app.Activity
    protected void onStop() {
        Log.d(LOG_TAG, "onStop");
        super.onStop();
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        String str = LOG_TAG;
        Log.d(str, "onDestory");
        unregisterReceiver(this.mKVSUpdateReceiver);
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_TRANSFER, HarmanOTAKVSUtil.TRANSFER_SHOW, false);
        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_NOTIFY_FAIL, HarmanOTAKVSUtil.NOTIFY_FAIL_FLAG, false);
        SendLocationServiceUtil.destroy(getApplicationContext());
        //Intent intent = new Intent(Const.ACTION_INAPPBILLING_PURCHASE);
       // intent.putExtra("result_code", Const.RESULT_API_UNKNOWN_ERROR);
        //intent.putExtra(GooglePlayActivity.KEY_ON_DESTROY, true);
        //sendBroadcast(intent);
        BroadcastReceiver broadcastReceiver = this.mReceiver;
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
        }
        if (this.mMSServiceHelper != null) {
            Log.d(str, "MWS mMSServiceHelper destory.");
            this.mMSServiceHelper.removeConnectionObserver(this.mConnectionObserver);
            this.mMSServiceHelper.removeErrorObserver(this.mErrorObserver);
            this.mMSServiceHelper.setBindObserver(null);
            MSWebViewBinder mSWebViewBinder = this.mMSWebViewBinder;
            if (mSWebViewBinder != null) {
                mSWebViewBinder.dispose();
            }
            try {
                this.mMSServiceHelper.stop();
            } catch (Exception unused) {
                MCApplication.getInstance().clearKvsHelper();
            } catch (Throwable th) {
                MCApplication.getInstance().clearKvsHelper();
                throw th;
            }
        }
        WebView webView = this.mWebView;
        if (webView != null) {
            webView.stopLoading();
            this.mWebView.setWebChromeClient(null);
            this.mWebView.setWebViewClient(null);
            this.mWebView.destroy();
            this.mWebView = null;
        }
        HarmanOTAManager.getInstance().killAhaService();
        if (this.mRestart) {
            Log.d(LOG_TAG, "onDestroy mRestart = true");
            this.mRestart = false;
            Intent intent2 = new Intent(getApplicationContext(), (Class<?>) MainActivity.class);
            intent2.setFlags(335544320);
            startActivity(intent2);
        }
        super.onDestroy();
    }

    private void showCloseDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(R.string.close_dialog_title);
        builder.setMessage(R.string.close_dialog_msg);
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.12
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
                if (MainActivity.this.mMSServiceHelper.stop()) {
                    MainActivity.this.finish();
                }
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.13
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
            }
        });
        this.mCloseAlertDialog = builder.show();
    }

    private boolean isLocationAvailableInSetting() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 28) {
            return locationManager.isLocationEnabled();
        }
        try {
            return Settings.Secure.getInt(getContentResolver(), "location_mode") != 0;
        } catch (Settings.SettingNotFoundException unused) {
            return false;
        }
    }

    private void checkLocationServices() {
        final SharedPreferences defaultSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if ((!defaultSharedPreferences.getBoolean(NEVER_SHOW_LOCATION_CONFIRMATION_DIALOG, false)) && !isLocationAvailableInSetting()) {
            final CheckBox checkBox = new CheckBox(this);
            checkBox.setText(R.string.not_shown_again);
            LinearLayout linearLayout = new LinearLayout(this);
            linearLayout.setLayoutParams(new LinearLayout.LayoutParams(-1, -1));
            linearLayout.setOrientation(LinearLayout.VERTICAL);
            linearLayout.addView(checkBox);
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setView(linearLayout);
            builder.setMessage(R.string.location_dialog_alert);
            builder.setPositiveButton(ExternallyRolledFileAppender.OK, new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.14
                @Override // android.content.DialogInterface.OnClickListener
                public void onClick(DialogInterface dialogInterface, int i) {
                    Intent intent = new Intent("android.settings.LOCATION_SOURCE_SETTINGS");
                    intent.addCategory("android.intent.category.DEFAULT");
                    MainActivity.this.startActivity(intent);
                    if (checkBox.isChecked()) {
                        SharedPreferences.Editor edit = defaultSharedPreferences.edit();
                        edit.putBoolean(MainActivity.NEVER_SHOW_LOCATION_CONFIRMATION_DIALOG, true);
                        edit.commit();
                    }
                }
            });
            builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.MainActivity.15
                @Override // android.content.DialogInterface.OnClickListener
                public void onClick(DialogInterface dialogInterface, int i) {
                    if (checkBox.isChecked()) {
                        SharedPreferences.Editor edit = defaultSharedPreferences.edit();
                        edit.putBoolean(MainActivity.NEVER_SHOW_LOCATION_CONFIRMATION_DIALOG, true);
                        edit.commit();
                    }
                }
            });
            builder.create();
            this.mLocationAlertDialog = builder.show();
        }
        checkPlayServices();
    }

    private boolean checkPlayServices() {
        int isGooglePlayServicesAvailable = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        if (isGooglePlayServicesAvailable == 0) {
            return true;
        }
        if (!GooglePlayServicesUtil.isUserRecoverableError(isGooglePlayServicesAvailable)) {
            return false;
        }
        GooglePlayServicesUtil.getErrorDialog(isGooglePlayServicesAvailable, this, 1001).show();
        return false;
    }

    @Override // android.view.View.OnClickListener
    public void onClick(View view) {
        String simCountry;
        if (isAgreedTerms()) {
            int indexOf = this.mTabs.indexOf(view);
            if (indexOf >= 0) {
                this.mTabs.get(indexOf).setSelected(true);
                this.mSelectedTabIndex = indexOf;
                String[] stringArray = getResources().getStringArray(R.array.tab_urls);
                Log.d(LOG_TAG, "call CountryCode()");
                try {
                    simCountry = new BufferedReader(new InputStreamReader(openFileInput("CountryCode"), "UTF-8")).readLine();
                } catch (Exception e) {
                    e.printStackTrace();
                    simCountry = AppInfoUtil.getSimCountry(getApplicationContext());
                }
                if (simCountry != null) {
                    stringArray[indexOf] = stringArray[indexOf] + "?countrycode=" + simCountry;
                }
                this.mWebView.loadUrl(stringArray[indexOf]);
                return;
            }
            return;
        }
        showTarms();
    }

    @Override // android.view.View.OnTouchListener
    public boolean onTouch(View view, MotionEvent motionEvent) {
        if (this.mTabs.indexOf(view) < 0) {
            return false;
        }
        unSelectAllTabs();
        return false;
    }

    private void unSelectAllTabs() {
        Iterator<View> it = this.mTabs.iterator();
        while (it.hasNext()) {
            it.next().setSelected(false);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void showTarms() {
        HashMap hashMap = new HashMap();
        hashMap.put("ok", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.16
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                Log.d(MainActivity.LOG_TAG, "call queryHandler OK:" + str);
                MainActivity.this.setAgreedTerms();
                WebPopupModule.closePopup();
                MainActivity.this.showWelcome();
                MainActivity mainActivity = MainActivity.this;
                mainActivity.startMWS(mainActivity.getApplicationContext(), MainActivity.this.mConnectionObserver, MainActivity.this.mErrorObserver);
            }
        });
        hashMap.put("close", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.17
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                Log.d(MainActivity.LOG_TAG, "call queryHandler close:" + str);
                WebPopupModule.closePopup();
                MainActivity.this.finish();
            }
        });
        try {
            WebPopupModule.showPopup(getApplicationContext(), new URL("file:///android_asset/docroot/terms.html"), hashMap);
        } catch (MalformedURLException e) {
            Log.d(LOG_TAG, "showTarms faild");
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void showWelcome() {
        String simCountry;
        HashMap hashMap = new HashMap();
        hashMap.put("ok", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.18
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                WebPopupModule.closePopup();
            }
        });
        hashMap.put("close", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.19
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                WebPopupModule.closePopup();
            }
        });
        Log.d(LOG_TAG, "call CountryCode()");
        try {
            simCountry = new BufferedReader(new InputStreamReader(openFileInput("CountryCode"), "UTF-8")).readLine();
        } catch (Exception e) {
            e.printStackTrace();
            simCountry = AppInfoUtil.getSimCountry(getApplicationContext());
        }
        try {
            if (simCountry != null) {
                WebPopupModule.showPopup(getApplicationContext(), new URL("file:///android_asset/docroot/welcome.html?countrycode=" + simCountry), hashMap);
            } else {
                WebPopupModule.showPopup(getApplicationContext(), new URL("file:///android_asset/docroot/welcome.html"), hashMap);
            }
        } catch (MalformedURLException e2) {
            Log.d(LOG_TAG, "showWelcome faild");
            e2.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean isAgreedTerms() {
        String readLine;
        Log.d(LOG_TAG, "call isAgreedTerms()");
        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(openFileInput("isAgreedTerms"), "UTF-8"));
            do {
                readLine = bufferedReader.readLine();
                if (readLine == null) {
                    return false;
                }
            } while (!readLine.equals("1"));
            return true;
        } catch (IOException e) {
            Log.d(LOG_TAG, "isAgreedTerms faild");
            e.printStackTrace();
            return false;
        }
    }

    private boolean isAgreedLocation() {
        String readLine;
        Log.d(LOG_TAG, "call isAgreedLocation()");
        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(openFileInput("isAgreedLocation"), "UTF-8"));
            do {
                readLine = bufferedReader.readLine();
                if (readLine == null) {
                    return false;
                }
            } while (!readLine.equals("1"));
            return true;
        } catch (IOException e) {
            Log.d(LOG_TAG, "isAgreedLocation faild");
            e.printStackTrace();
            return false;
        }
    }

    private void showLocationPopup() {
        HashMap hashMap = new HashMap();
        hashMap.put("ok", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.20
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                MainActivity.this.setAgreedLocation();
                WebPopupModule.closePopup();
                if (!MainActivity.this.isAgreedTerms()) {
                    MainActivity.this.showTarms();
                }
                MainActivity.this.executeRequestPermissions();
            }
        });
        hashMap.put("close", new WebPopupModule.IPopupHandler() { // from class: com.subaru.global.infotainment.gen2.MainActivity.21
            @Override // com.subaru.global.infotainment.gen2.extend.webpopup.WebPopupModule.IPopupHandler
            public void onPopupLinkAccess(String str) {
                WebPopupModule.closePopup();
            }
        });
        try {
            WebPopupModule.showPopup(getApplicationContext(), new URL("file:///android_asset/docroot/locationpopup.html"), hashMap);
        } catch (MalformedURLException e) {
            Log.d(LOG_TAG, "showLocationPopup faild");
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setAgreedLocation() {
        Log.d(LOG_TAG, "call setAgreedLocation()");
        try {
            PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(openFileOutput("isAgreedLocation", 0), "UTF-8"));
            printWriter.write("1");
            printWriter.close();
        } catch (IOException e) {
            Log.d(LOG_TAG, "setAgreedLocation faild");
            e.printStackTrace();
        }
    }

    private boolean checkIsLocationPermissionGranted() {
        Iterator<String> it = getDeniedPermissions().iterator();
        while (it.hasNext()) {
            String next = it.next();
            if (next.equals("android.permission.ACCESS_FINE_LOCATION") || next.equals("android.permission.ACCESS_COARSE_LOCATION") || next.equals("android.permission.ACCESS_BACKGROUND_LOCATION")) {
                return true;
            }
        }
        return false;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setAgreedTerms() {
        Log.d(LOG_TAG, "call setAgreedTerms()");
        try {
            PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(openFileOutput("isAgreedTerms", 0), "UTF-8"));
            printWriter.write("1");
            printWriter.close();
        } catch (IOException e) {
            Log.d(LOG_TAG, "setAgreedTerms faild");
            e.printStackTrace();
        }
    }

    private void locationStart() {
        this.locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, "android.permission.ACCESS_FINE_LOCATION") == 0 || ActivityCompat.checkSelfPermission(this, "android.permission.ACCESS_COARSE_LOCATION") == 0) {
            this.locationManager.requestLocationUpdates("network", 0L, 0.0f, this);
            this.locationManager.requestLocationUpdates("gps", 0L, 0.0f, this);
        }
    }

    @SuppressLint("StaticFieldLeak")
    @Override // android.location.LocationListener
    public void onLocationChanged(Location location) {
        if (Build.VERSION.SDK_INT >= 9 && Geocoder.isPresent()) {
            new AsyncTask<Location, Void, List<Address>>() { // from class: com.subaru.global.infotainment.gen2.MainActivity.22
                /* JADX INFO: Access modifiers changed from: protected */
                @Override // android.os.AsyncTask
                public List<Address> doInBackground(Location... locationArr) {
                    Geocoder geocoder = new Geocoder(MainActivity.this.getApplicationContext(), Locale.getDefault());
                    Location location2 = locationArr[0];
                    try {
                        return geocoder.getFromLocation(location2.getLatitude(), location2.getLongitude(), 1);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                }

                /* JADX INFO: Access modifiers changed from: protected */
                @Override // android.os.AsyncTask
                public void onPostExecute(List<Address> list) {
                    if (list == null || list.size() <= 0) {
                        return;
                    }
                    Address address = list.get(0);
                    Log.d(MainActivity.LOG_TAG, address.getCountryCode());
                    try {
                        PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(MainActivity.this.openFileOutput("CountryCode", 0), "UTF-8"));
                        printWriter.write(address.getCountryCode());
                        printWriter.close();
                    } catch (IOException e) {
                        Log.d(MainActivity.LOG_TAG, "setAgreedTerms faild");
                        e.printStackTrace();
                    }
                    try {
                        KeyValueStore.getInstance(MainActivity.this.getApplication().getApplicationContext()).saveData(address.getCountryCode().getBytes(), "geocode_iso_country_code/");
                    } catch (KeyValueStore.KVSException e2) {
                        e2.printStackTrace();
                    }
                }
            }.execute(location);
        }
        this.locationManager.removeUpdates(this);
    }
}
