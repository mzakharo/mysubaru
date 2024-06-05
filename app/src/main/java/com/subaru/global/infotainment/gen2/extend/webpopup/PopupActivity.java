package com.subaru.global.infotainment.gen2.extend.webpopup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
//import com.google.android.gms.common.internal.ImagesContract;
import com.harman.services.maps.MapUtils;
import com.example.mysubaru.R;
import java.net.URL;

/* loaded from: classes.dex */
public class PopupActivity extends Activity {
    static final String LOGTAG = "PopupActivity";
    private WebView myWebView = null;
    boolean timeout = true;

    @Override // android.app.Activity, android.view.KeyEvent.Callback
    public boolean onKeyDown(int i, KeyEvent keyEvent) {
        return i == 4;
    }

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        Log.d(LOGTAG, "onCreate");
        WebPopupModule.setActivity(this);
        requestWindowFeature(1);
        setContentView(R.layout.popup);
        WebView webView = (WebView) findViewById(R.id.webView_pop);
        this.myWebView = webView;
        webView.setOverScrollMode(2);
        this.myWebView.setBackgroundColor(0);
        if (Integer.parseInt(Build.VERSION.SDK) >= 11) {
            this.myWebView.setLayerType(1, null);
        }
        this.myWebView.setWebViewClient(new AnonymousClass1());
        this.myWebView.clearCache(false);
        WebSettings settings = this.myWebView.getSettings();
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(2);
        settings.setDatabaseEnabled(true);
        if (Build.VERSION.SDK_INT >= 16) {
            settings.setAllowUniversalAccessFromFileURLs(true);
        }
        settings.setAllowContentAccess(true);
        if (Build.VERSION.SDK_INT >= 17) {
            settings.setMediaPlaybackRequiresUserGesture(false);
        }
        ImageButton imageButton = (ImageButton) findViewById(R.id.imageButton1);
        imageButton.setOnClickListener(new View.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.extend.webpopup.PopupActivity.2
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                Log.d(PopupActivity.LOGTAG, "onClick() closeButton");
                if (WebPopupModule.getHanlerTable() == null) {
                    PopupActivity.this.myWebView.loadUrl("about:blank");
                    PopupActivity.this.finish();
                } else if (WebPopupModule.getHanlerTable().containsKey("close")) {
                    WebPopupModule.getHanlerTable().get("close").onPopupLinkAccess("f=button");
                }
            }
        });
        if (!getIntent().getBooleanExtra("closeButton", false)) {
            imageButton.setVisibility(4);
        }
        Uri parse = Uri.parse(getIntent().getStringExtra("url").toString());
        if (parse.getScheme().equals(MapUtils.KEY_FILE) && parse.getPath().indexOf("hslocal.html") != -1) {
            this.myWebView.loadDataWithBaseURL("file:///android_asset/docroot", "<html><head></head><body><script>sessionStorage.setItem(\"targetURL\",\"" + parse.getQueryParameter("url") + "\");location.href=\"file:///android_asset/docroot/hslocal.html\";</script></body></html>", "text/html", "utf-8", null);
            return;
        }
        this.myWebView.loadUrl(parse.toString());
    }

    /* renamed from: com.subaru.global.infotainment.gen2.extend.webpopup.PopupActivity$1, reason: invalid class name */
    /* loaded from: classes.dex */
    class AnonymousClass1 extends WebViewClient {
        AnonymousClass1() {
        }

        @Override // android.webkit.WebViewClient
        public boolean shouldOverrideUrlLoading(WebView webView, String str) {
            Log.d(PopupActivity.LOGTAG, "shouldOverrideUrlLoading(" + str + ")");
            if (WebPopupModule.getHanlerTable() != null) {
                Log.d(PopupActivity.LOGTAG, "getHanlerTable!=null");
                Uri parse = Uri.parse(str);
                String lastPathSegment = parse.getLastPathSegment();
                if (parse.getScheme().equals("popupview") && WebPopupModule.getHanlerTable().containsKey(lastPathSegment)) {
                    Log.d(PopupActivity.LOGTAG, "HIT:" + lastPathSegment);
                    WebPopupModule.getHanlerTable().get(lastPathSegment).onPopupLinkAccess(parse.getQuery());
                    return true;
                }
            }
            if (!str.startsWith("file:") && !str.startsWith("http:") && !str.startsWith("https:")) {
                int indexOf = str.indexOf("package=");
                if (indexOf < 0) {
                    return false;
                }
                int i = indexOf + 8;
                String substring = str.substring(i, str.indexOf(";", i));
                try {
                    Intent intent = new Intent("android.intent.action.VIEW", Uri.parse(str));
                    if (str.indexOf("scheme=") < 0) {
                        intent = PopupActivity.this.getPackageManager().getLaunchIntentForPackage(substring);
                    }
                    webView.getContext().startActivity(intent);
                    return true;
                } catch (Exception unused) {
                    webView.getContext().startActivity(new Intent("android.intent.action.VIEW", Uri.parse("market://details?id=" + substring)));
                    return true;
                }
            }
            Log.d(PopupActivity.LOGTAG, "getHanlerTable=null");
            return false;
        }

        @Override // android.webkit.WebViewClient
        public void onPageStarted(WebView webView, String str, Bitmap bitmap) {
            Log.d(PopupActivity.LOGTAG, "onPageStarted() url = " + str);
            PopupActivity.this.timeout = true;
            new Thread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.extend.webpopup.PopupActivity.1.1
                @Override // java.lang.Runnable
                public void run() {
                    try {
                        Thread.sleep(30000L);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (PopupActivity.this.timeout) {
                        PopupActivity.this.runOnUiThread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.extend.webpopup.PopupActivity.1.1.1
                            @Override // java.lang.Runnable
                            public void run() {
                                PopupActivity.this.myWebView.loadUrl("file:///android_asset/docroot/network_error.html");
                                ((ImageButton) PopupActivity.this.findViewById(R.id.imageButton1)).setVisibility(0);
                            }
                        });
                    }
                }
            }).start();
        }

        @Override // android.webkit.WebViewClient
        public void onPageFinished(WebView webView, String str) {
            Log.d(PopupActivity.LOGTAG, "onPageFinished() url = " + str);
            PopupActivity.this.timeout = false;
        }

        @Override // android.webkit.WebViewClient
        public void onReceivedError(WebView webView, int i, String str, String str2) {
            Log.d(PopupActivity.LOGTAG, "onReceivedError( " + str + " : " + i + " ) url = " + str2);
            PopupActivity.this.myWebView.loadUrl("file:///android_asset/docroot/network_error.html");
            PopupActivity.this.runOnUiThread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.extend.webpopup.PopupActivity.1.2
                @Override // java.lang.Runnable
                public void run() {
                    ((ImageButton) PopupActivity.this.findViewById(R.id.imageButton1)).setVisibility(0);
                }
            });
        }
    }

    public void jump(URL url) {
        Log.d(LOGTAG, "jump()");
        if (url != null) {
            Log.d(LOGTAG, "jump to " + url.toString());
            Uri parse = Uri.parse(url.toString());
            if (parse.getScheme().equals(MapUtils.KEY_FILE) && parse.getPath().indexOf("hslocal.html") != -1) {
                this.myWebView.loadDataWithBaseURL("file:///android_asset/docroot", "<html><head></head><body><script>sessionStorage.setItem(\"targetURL\",\"" + parse.getQueryParameter("url") + "\");location.href=\"file:///android_asset/docroot/hslocal.html\";</script></body></html>", "text/html", "utf-8", null);
                return;
            }
            this.myWebView.loadUrl(parse.toString());
        }
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        this.myWebView.loadUrl("about:blank");
        this.timeout = false;
        super.onDestroy();
    }
}
