package com.android.lib.mcm.modules;

import android.content.Context;
import android.location.Location;
import com.android.lib.mcm.modules.SALocationEngine;
import com.uievolution.microserver.AbstractMSModuleImpl;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.http.BasicHeader;
import com.uievolution.microserver.http.Header;
import com.uievolution.microserver.http.HttpStatus;
import com.uievolution.microserver.logging.MSLog;
import com.uievolution.microserver.modules.location.common.LocationModuleUtils;
import com.uievolution.microserver.utils.HttpCatalogs;
import com.uievolution.microserver.utils.Utils;
import java.util.Timer;
import java.util.TimerTask;
import org.slf4j.Marker;
/* loaded from: classes.dex */
class SA_g extends AbstractMSModuleImpl {
    static final String b = "LocationModule";
    static int c = 10000;
    static final String d = "latitude";
    static final String e = "longitude";
    static final String f = "altitude";
    static final String g = "heading";
    static final String h = "speed";
    static final String i = "accuracy";
    static final String j = "timestamp";
    static Header[] k = {new BasicHeader(HttpCatalogs.HEADER_CACHE_CONTROL, "no-cache"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_METHODS, "GET"), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_HEADERS, Marker.ANY_MARKER), new BasicHeader(HttpCatalogs.HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")};
    private final SALocationEngine l = SALocationEngine.getInstance();

    @Override // com.uievolution.microserver.AbstractMSModuleImpl
    protected byte[] doStart() {
        MSLog.d(b, "LocationModule starts");
        if (isGetMethod()) {
            b();
        } else {
            MSLog.d(b, "Location module can only accept a GET request");
            sendResponse(HttpStatus.SC_METHOD_NOT_ALLOWED, "Location module can only accept a GET request", k, (byte[]) null);
        }
        return null;
    }

    private void b() {
        Context context = MicroServer.getInstance().getContext();
        if (/*LocationModuleUtils.isLocationAvailableInSetting(context) && */ LocationModuleUtils.isLocationServiceAvailable(context)) {
            Location lastLocation = this.l.getLastLocation();
            if (lastLocation != null) {
                a(lastLocation);
                return;
            }
            this.l.addObserver(new a(c));
            return;
        }
        sendResponse(503, "location service is unavailable", k, (byte[]) null);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void a(Location location) {
        Utils._assertIsNotNull(location);
        sendResponse(200, (String) null, k, LocationModuleUtils.toJson(location).toString().getBytes());
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class a implements SALocationEngine.IObserver {
        private final Timer b;
        private boolean c;

        public a(int i) {
            Timer timer = new Timer();
            this.b = timer;
            this.c = false;
            timer.schedule(new TimerTask() { // from class: com.android.lib.mcm.modules.SA_g.a.1
                @Override // java.util.TimerTask, java.lang.Runnable
                public void run() {
                    if (!a.this.c) {
                        a.this.c = true;
                        SA_g.this.sendResponse(503, (String) null, SA_g.k, "Timeout: failed to get location".getBytes());
                    }
                    SA_g.this.l.removeObserver(a.this);
                }
            }, i);
        }

        @Override // com.android.lib.mcm.modules.SALocationEngine.IObserver
        public void onDisconnected() {
            MSLog.d(SA_g.b, "unexpectedly disconnected");
            if (!this.c) {
                this.c = true;
                SA_g.this.sendResponse(500, (String) null, SA_g.k, "unexpectedly disconnected".getBytes());
            }
            SA_g.this.l.removeObserver(this);
            this.b.cancel();
        }

        @Override // com.android.lib.mcm.modules.SALocationEngine.IObserver
        public void onLocationChanged(Location location) {
            if (!this.c) {
                this.c = true;
                SA_g.this.a(location);
            }
            SA_g.this.l.removeObserver(this);
            this.b.cancel();
        }

        @Override // com.android.lib.mcm.modules.SALocationEngine.IObserver
        public void onConnectionFailed(String str) {
            if (!this.c) {
                this.c = true;
                SA_g.this.sendResponse(500, (String) null, SA_g.k, "Internal Error".getBytes());
            }
            SA_g.this.l.removeObserver(this);
            this.b.cancel();
        }
    }
}
