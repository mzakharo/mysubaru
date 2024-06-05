package com.android.lib.mcm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.webkit.WebView;
import com.android.lib.mcm.application.MCApplication;
import com.android.lib.mcm.sagsi.SAGoogleSignInConst;
import com.android.lib.mcm.util.DebugUtil;
import com.android.lib.mcm.util.McmConst;
import com.uievolution.microserver.MSServiceHelper;
import java.net.URLDecoder;
import java.util.Locale;
/* loaded from: classes.dex */
public class MCWebViewNativeApi {
    private static final String API_READ_KVS = "readKVS";
    private static final String API_WRITE_KVS = "writeKVS";
    private static final String NATIVE_API_DOMAIN = "UJMLAPP:";
    private static String h5ContentsDownload = "h5ContentsDownload";
    private static BroadcastReceiver sBroadcastReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.MCWebViewNativeApi.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if (TextUtils.equals(intent.getAction(), MCWebViewNativeApi.class.getName())) {
                String stringExtra = intent.getStringExtra(SAGoogleSignInConst.KEY_LOAD_HTML);
                String stringExtra2 = intent.getStringExtra(SAGoogleSignInConst.KEY_TOKEN_TYPE);
                DebugUtil.log(MCWebViewNativeApi.sContext, "tokenType ->", stringExtra2);
                String str = null;
                if (TextUtils.isEmpty(stringExtra)) {
                    return;
                }
                if (TextUtils.equals(stringExtra2, SAGoogleSignInConst.TOKEN_TYPE_GOOGLE)) {
                    String str2 = "";
                    if (stringExtra.indexOf(McmConst.SERVER_NAME_SMT) != -1) {
                        str = McmConst.BASE_URL_SMT;
                    } else if (stringExtra.indexOf(McmConst.SERVER_NAME_SACH5) != -1) {
                        str = McmConst.BASE_URL_SACH5;
                        str2 = "/sky/sky";
                    } else if (stringExtra.indexOf(McmConst.SERVER_NAME_TVESPA) != -1) {
                        str = McmConst.BASE_URL_TVESPA;
                    }
                    MCWebViewNativeApi.getWebView().loadDataWithBaseURL(str, stringExtra.replace("src=\"" + MCWebViewNativeApi.h5ContentsDownload, "src=\"" + MCWebViewNativeApi.h5ContentsDownload + str2), "text/html", "utf-8", null);
                } else if (TextUtils.equals(stringExtra2, SAGoogleSignInConst.TOKEN_TYPE_SMART_ACCESS)) {
                    MCWebViewNativeApi.getWebView().loadDataWithBaseURL(null, stringExtra, "text/html", "utf-8", null);
                }
            }
        }
    };
    private static Context sContext;
    private static WebView sWebView;
    private static WebViewInjectorDelegate sWebViewInjectorDelegate;

    /* loaded from: classes.dex */
    public interface WebViewInjectorDelegate {
        void postLoadUrl(String str);
    }

    public static WebView getWebView() {
        return sWebView;
    }

    public static void setWebView(WebView webView) {
        sWebView = webView;
    }

    public static WebViewInjectorDelegate getWebViewInjectorDelegate() {
        return sWebViewInjectorDelegate;
    }

    public static void setWebViewInjectorDelegate(WebViewInjectorDelegate webViewInjectorDelegate) {
        sWebViewInjectorDelegate = webViewInjectorDelegate;
    }

    public static void onPageFinished(WebView webView, String str) {
        setWebView(webView);
        Context context = sContext;
        if (context == null) {
            Context applicationContext = webView.getContext().getApplicationContext();
            sContext = applicationContext;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                applicationContext.registerReceiver(sBroadcastReceiver, new IntentFilter(MCWebViewNativeApi.class.getName()), Context.RECEIVER_EXPORTED);
            } else {
                applicationContext.registerReceiver(sBroadcastReceiver, new IntentFilter(MCWebViewNativeApi.class.getName()));
            }
        } else if (!context.equals(webView.getContext().getApplicationContext())) {
            sContext.unregisterReceiver(sBroadcastReceiver);
            Context applicationContext2 = webView.getContext().getApplicationContext();
            sContext = applicationContext2;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                applicationContext2.registerReceiver(sBroadcastReceiver, new IntentFilter(MCWebViewNativeApi.class.getName()), Context.RECEIVER_EXPORTED);
            } else {
                applicationContext2.registerReceiver(sBroadcastReceiver, new IntentFilter(MCWebViewNativeApi.class.getName()));
            }
        }
        postLoadUrl(webView, "javascript:window.mws = window.mws === undefined ? new Object() : window.mws;window.mws.callbacks = window.mws.callbacks === undefined ? [] : window.mws.callbacks;");
    }

    private static boolean checkApi(String str, String str2) {
        return str.split(str2).length > 0 && str.startsWith(str2);
    }

    public static boolean runNativeApi(WebView webView, MSServiceHelper mSServiceHelper, String str) {
        if (str.toUpperCase(Locale.US).startsWith(NATIVE_API_DOMAIN)) {
            String substring = str.substring(8);
            if (checkApi(substring, API_WRITE_KVS)) {
                writeKVS(webView, substring);
                return true;
            } else if (checkApi(substring, API_READ_KVS)) {
                readKVS(webView, substring);
                return true;
            } else {
                return true;
            }
        }
        return false;
    }

    private static void writeKVS(WebView webView, String str) {
        String str2;
        String str3;
        String str4 = "";
        String[] params = getParams(str);
        boolean z = true;
        String str5 = null;
        try {
            str4 = URLDecoder.decode(params[0], "UTF-8");
            try {
                str3 = URLDecoder.decode(params[1], "UTF-8");
                try {
                    str5 = URLDecoder.decode(params[2], "UTF-8");
                    MCApplication.getInstance().getKvsHelper().getKvsWrapperService().saveData(str3.getBytes(), str4);
                } catch (Exception e) {
                    e = e;
                    str2 = str5;
                    str5 = str4;
                    e.printStackTrace();
                    str4 = str5;
                    z = false;
                    str5 = str2;
                    postLoadUrl(webView, "javascript:var callback = window.mws.callbacks[\"" + str5 + "\"];if(callback !== undefined) callback(\"" + str4 + "\",'" + str3 + "'," + z + ");");
                }
            } catch (Exception e2) {
                //e = e2;
                str2 = null;
                str3 = null;
            }
        } catch (Exception e3) {
            //e = e3;
            str2 = null;
            str3 = null;
        }
        postLoadUrl(webView, "javascript:var callback = window.mws.callbacks[\"" + str5 + "\"];if(callback !== undefined) callback(\"" + str4 + "\",'" + str3 + "'," + z + ");");
    }

    private static void readKVS(WebView webView, String str) {
        String str2;
        String str3;
        StringBuilder sb;
        String[] params = getParams(str);
        boolean z = true;
        byte[] bArr = null;
        try {
            str3 = URLDecoder.decode(params[0], "UTF-8");
            try {
                str2 = URLDecoder.decode(params[1], "UTF-8");
            } catch (Exception e) {
                e = e;
                str2 = null;
            }
        } catch (Exception e2) {
            //e = e2;
            str2 = null;
            str3 = null;
        }
        try {
            bArr = MCApplication.getInstance().getKvsHelper().getKvsWrapperService().getData(str3);
        } catch (Exception e3) {
            //e = e3;
            e3.printStackTrace();
            z = false;
            sb = new StringBuilder("javascript:");
            sb.append("var callback = window.mws.callbacks[\"");
            sb.append(str2);
            sb.append("\"];");
            sb.append("if(callback !== undefined) callback(\"");
            sb.append(str3);
            sb.append("\",");
            if (!z) {
            }
            sb.append("undefined");
            sb.append(");");
            postLoadUrl(webView, sb.toString());
        }
        sb = new StringBuilder("javascript:");
        sb.append("var callback = window.mws.callbacks[\"");
        sb.append(str2);
        sb.append("\"];");
        sb.append("if(callback !== undefined) callback(\"");
        sb.append(str3);
        sb.append("\",");
        if (!z && bArr != null) {
            sb.append("'");
            sb.append(new String(bArr));
            sb.append("'");
        } else {
            sb.append("undefined");
        }
        sb.append(");");
        postLoadUrl(webView, sb.toString());
    }

    private static String[] getParams(String str) {
        String[] split = str.split("\\(");
        if (split == null || split.length != 2) {
            return new String[0];
        }
        String[] split2 = split[1].split("\\)");
        return (split2 == null || split2.length != 1) ? new String[0] : split2[0].split(",");
    }

    private static void postLoadUrl(WebView webView, String str) {
        WebViewInjectorDelegate webViewInjectorDelegate = sWebViewInjectorDelegate;
        if (webViewInjectorDelegate != null) {
            webViewInjectorDelegate.postLoadUrl(str);
        } else {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.android.lib.mcm.MCWebViewNativeApi.2
                String currentJs;
                WebView currentWebView;
                final /* synthetic */ String val$js;
                final /* synthetic */ WebView val$webView2;

                {
                    this.val$webView2 = webView;
                    this.val$js = str;
                    this.currentWebView = webView;
                    this.currentJs = str;
                }

                @Override // java.lang.Runnable
                public void run() {
                    this.currentWebView.loadUrl(this.currentJs);
                }
            });
        }
    }
}
