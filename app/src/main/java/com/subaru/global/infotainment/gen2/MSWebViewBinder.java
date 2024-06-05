package com.subaru.global.infotainment.gen2;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.os.Handler;
import android.os.Looper;
import android.os.RemoteException;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import com.android.lib.mcm.MCWebViewNativeApi;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAWebViewBinder;
import com.subaru.global.infotainment.gen2.harman.module.NotifyDataDivide;
import com.uievolution.microserver.IMSSConnectionObserver;
import com.uievolution.microserver.MSServiceHelper;
import java.util.ArrayList;
import com.example.mysubaru.R;
/* loaded from: classes.dex */
public class MSWebViewBinder implements MCWebViewNativeApi.WebViewInjectorDelegate {
    static final String CONNECTED = "2";
    static final String DISCONNECTED = "1";
    static final String LOGTAG = "MSWebViewBinder";
    static final String UJML_DOMAIN = "UJMLAPP:";
    private Activity mActivity;
    private ProgressBar mProgressBar;
    private LinearLayout mProgressLayout;
    private MSServiceHelper mServiceHelper;
    private WebView mWebView;
    private ArrayList<String> mPostUrlQueue = new ArrayList<>();
    private boolean mAccessoryConnect = false;
    private Handler _handler = new Handler();
    private final IMSSConnectionObserver mConnectionObserver = new IMSSConnectionObserver.Stub() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.1
        @Override // com.uievolution.microserver.IMSSConnectionObserver
        public void onConnectionEvent(final int i) throws RemoteException {
            Log.d(MSWebViewBinder.LOGTAG, "onConnectionEvent = " + i);
            MSWebViewBinder.this.mActivity.runOnUiThread(new Runnable() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.1.1
                @Override // java.lang.Runnable
                public void run() {
                    MSWebViewBinder.this.postAccessoryEvent(i == 1, true);
                }
            });
        }
    };

    public void postAccessoryEvent(boolean z, boolean z2) {
        if (!z) {
            NotifyDataDivide.cancelTransferTimer(true);
        }
        if (!z2) {
            this.mAccessoryConnect = z;
        }
        String[] strArr = new String[2];
        strArr[0] = "1";
        strArr[1] = z ? "2" : "1";
        runJavaScript(strArr, "onEvent");
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void init(final WebView webView, Activity activity, MSServiceHelper mSServiceHelper) {
        this.mWebView = webView;
        MCWebViewNativeApi.setWebViewInjectorDelegate(this);
        this.mActivity = activity;
        this.mServiceHelper = mSServiceHelper;
        mSServiceHelper.addConnectionObserver(this.mConnectionObserver);
        this.mWebView.getSettings().setJavaScriptEnabled(true);
        ProgressBar progressBar = (ProgressBar) activity.findViewById(R.id.loading);
        this.mProgressBar = progressBar;
        progressBar.setProgress(0);
        this.mProgressBar.setMax(100);
        this.mProgressBar.getIndeterminateDrawable().setColorFilter(-1, PorterDuff.Mode.MULTIPLY);
        this.mProgressLayout = (LinearLayout) activity.findViewById(R.id.FrameLayout_ms);
        this.mWebView.setWebViewClient(new WebViewClient() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.2
            /* JADX WARN: Code restructure failed: missing block: B:27:0x015b, code lost:
            
                if (r8.this$0.mAccessoryConnect != false) goto L58;
             */
            @Override // android.webkit.WebViewClient
            /*
                Code decompiled incorrectly, please refer to instructions dump.
                To view partially-correct code enable 'Show inconsistent code' option in preferences
            */
            public boolean shouldOverrideUrlLoading(android.webkit.WebView r9, java.lang.String r10) {
                /*
                    Method dump skipped, instructions count: 415
                    To view this dump change 'Code comments level' option to 'DEBUG'
                */
                throw new UnsupportedOperationException("Method not decompiled: com.subaru.global.infotainment.gen2.MSWebViewBinder.AnonymousClass2.shouldOverrideUrlLoading(android.webkit.WebView, java.lang.String):boolean");
            }

            @Override // android.webkit.WebViewClient
            public void onPageFinished(WebView webView2, String str) {
                Log.d(MSWebViewBinder.LOGTAG, "onPageFinished url = " + str);
                if (MSWebViewBinder.this._handler != null) {
                    MSWebViewBinder.this._handler.removeCallbacksAndMessages(null);
                }
                MSWebViewBinder.this._handler.postDelayed(new Runnable() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.2.1
                    @Override // java.lang.Runnable
                    public void run() {
                        MSWebViewBinder.this.mProgressBar.setVisibility(8);
                        MSWebViewBinder.this.mProgressLayout.setVisibility(8);
                        Log.d(MSWebViewBinder.LOGTAG, "onPageFinished Done");
                    }
                }, 1000L);
                HarmanOTAWebViewBinder.getInstanse().onPageFinished(webView2, str);
                MCWebViewNativeApi.onPageFinished(webView2, str);
                super.onPageFinished(webView2, str);
            }

            @Override // android.webkit.WebViewClient
            public void onPageStarted(WebView webView2, String str, Bitmap bitmap) {
                Log.d(MSWebViewBinder.LOGTAG, "onPageStarted url = " + str);
                if ((str.startsWith("file:") || str.startsWith("http:") || str.startsWith("https:")) && MSWebViewBinder.this.mProgressBar.getVisibility() == 8) {
                    MSWebViewBinder.this.mProgressBar.setVisibility(0);
                    MSWebViewBinder.this.mProgressLayout.setVisibility(0);
                }
                super.onPageStarted(webView2, str, bitmap);
            }

            @Override // android.webkit.WebViewClient
            public void onReceivedError(WebView webView2, int i, String str, String str2) {
                webView2.loadUrl("about:blank");
                Log.d(MSWebViewBinder.LOGTAG, "onReceivedError( " + str + " : " + i + " ) url = " + str2);
                webView2.loadUrl("file:///android_asset/docroot/communicationError.html");
            }
        });
        this.mWebView.setWebChromeClient(new WebChromeClient() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.3
            @Override // android.webkit.WebChromeClient
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(MSWebViewBinder.LOGTAG, "[ContentsLog ::" + consoleMessage.messageLevel() + "]" + consoleMessage.message() + " - " + consoleMessage.sourceId() + " : " + consoleMessage.lineNumber() + "行目");
                return true;
            }
        });
    }

    void runJavaScript(String str, String str2) {
        runJavaScript(new String[]{str}, str2);
    }

    void runJavaScript(String[] strArr, String str) {
        StringBuilder sb = new StringBuilder("javascript:");
        sb.append("UIEMicroserver.deferred_return(\"");
        sb.append(str);
        sb.append("\"");
        for (String str2 : strArr) {
            sb.append(", \"");
            sb.append(str2);
            sb.append("\"");
        }
        sb.append(")");
        postLoadUrl(sb.toString());
    }

    @Override // com.android.lib.mcm.MCWebViewNativeApi.WebViewInjectorDelegate
    public void postLoadUrl(String str) {
        this.mPostUrlQueue.add(str);
        if (this.mPostUrlQueue.size() == 1) {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.4
                @Override // java.lang.Runnable
                public void run() {
                    MSWebViewBinder.this.deQueuePostUrl();
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void deQueuePostUrl() {
        if (this.mPostUrlQueue.size() == 0) {
            return;
        }
        String str = this.mPostUrlQueue.get(0);
        this.mPostUrlQueue.remove(0);
        WebView webView = this.mWebView;
        if (webView != null) {
            webView.loadUrl(str);
        }
        if (this.mPostUrlQueue.size() > 0) {
            new Handler(Looper.getMainLooper()).post(new Runnable() { // from class: com.subaru.global.infotainment.gen2.MSWebViewBinder.5
                @Override // java.lang.Runnable
                public void run() {
                    MSWebViewBinder.this.deQueuePostUrl();
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void dispose() {
        this.mServiceHelper.removeConnectionObserver(this.mConnectionObserver);
    }
}
