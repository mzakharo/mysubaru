package com.uievolution.microserver.utils;

import android.net.Uri;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.uievolution.microserver.MicroServer;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Iterator;
import jp.chef_station.chef_station.ChefStationConst;

/* loaded from: classes.dex */
public class UriPath {
    private final Uri a;

    public UriPath(Uri uri) {
        Utils._assert(uri != null);
        this.a = uri;
    }

    public static UriPath parse(String str) {
        Uri parse;
        if (!str.startsWith("http://") && !str.startsWith(ChefStationConst.MARKET_PF_PROTOCOL)) {
            if (str.startsWith("/")) {
                parse = Uri.parse("http://dummy.com" + str);
            } else {
                parse = Uri.parse("http://dummy.com/" + str);
            }
        } else {
            parse = Uri.parse(str);
        }
        return new UriPath(parse);
    }

    public boolean containsKey(String str) {
        return this.a.getQueryParameter(str) != null;
    }

    public String getFragment() {
        String fragment = this.a.getFragment();
        return fragment != null ? fragment : "";
    }

    public String getPath() {
        return this.a.getPath();
    }

    public String getQuery() {
        String query = this.a.getQuery();
        return query != null ? query : "";
    }

    public String toEncodedString() {
        StringBuilder sb = new StringBuilder();
        try {
            sb.append(this.a.getPath());
            if (this.a.getQuery() != null) {
                sb.append('?');
                Iterator it = Arrays.asList(this.a.getQuery().split(Const.REQUEST_PARAM_SEPARATE_STR)).iterator();
                while (it.hasNext()) {
                    String str = (String) it.next();
                    int indexOf = str.indexOf(61);
                    if (indexOf < 0) {
                        sb.append(URLEncoder.encode(str, "UTF-8"));
                    } else {
                        String substring = str.substring(0, indexOf);
                        String substring2 = str.substring(indexOf + 1);
                        sb.append(URLEncoder.encode(substring, "UTF-8"));
                        sb.append(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
                        sb.append(URLEncoder.encode(substring2, "UTF-8"));
                    }
                    if (it.hasNext()) {
                        sb.append('&');
                    }
                }
            }
            String fragment = this.a.getFragment();
            if (fragment != null && fragment.length() > 0) {
                sb.append('#');
                sb.append(URLEncoder.encode(fragment, "UTF-8"));
            }
        } catch (UnsupportedEncodingException e) {
            MicroServer.Logger.w("UriPath", e);
        }
        return sb.toString();
    }

    public String getQuery(String str) {
        return this.a.getQueryParameter(str);
    }
}
