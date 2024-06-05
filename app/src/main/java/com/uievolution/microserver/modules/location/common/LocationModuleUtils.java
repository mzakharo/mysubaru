package com.uievolution.microserver.modules.location.common;

import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.util.Xml;
import com.uievolution.microserver.logging.MSLog;
import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlSerializer;

/* loaded from: classes.dex */
public final class LocationModuleUtils {
    static final String KEY_ACCURACY = "accuracy";
    static final String KEY_ALTITUDE = "altitude";
    static final String KEY_HEADING = "heading";
    static final String KEY_LATITUDE = "latitude";
    static final String KEY_LONGITUDE = "longitude";
    static final String KEY_SPEED = "speed";
    static final String KEY_TIMESTAMP = "timestamp";
    static final String LOGTAG = "LocationModuleUtils";

    private LocationModuleUtils() {
    }

    public static boolean isLocationServiceAvailable(Context context) {
        List<String> providers = ((LocationManager) context.getSystemService(Context.LOCATION_SERVICE)).getProviders(true);
        return (providers == null || providers.size() == 0) ? false : true;
    }

    public static JSONObject toJson(Location location) {
        JSONObject jSONObject = new JSONObject();
        try {
            jSONObject.put(KEY_LATITUDE, location.getLatitude());
            jSONObject.put(KEY_LONGITUDE, location.getLongitude());
            if (location.hasAltitude()) {
                jSONObject.put(KEY_ALTITUDE, location.getAltitude());
            }
            if (location.hasBearing()) {
                jSONObject.put(KEY_HEADING, location.getBearing());
            }
            if (location.hasSpeed()) {
                jSONObject.put(KEY_SPEED, location.getSpeed());
            }
            jSONObject.put(KEY_ACCURACY, location.getAccuracy());
            jSONObject.put("timestamp", location.getTime());
        } catch (JSONException e) {
            MSLog.w(LOGTAG, e);
        }
        return jSONObject;
    }

    public static String toXML(Location location) throws IllegalArgumentException, IllegalStateException, IOException {
        StringWriter stringWriter = new StringWriter();
        XmlSerializer newSerializer = Xml.newSerializer();
        newSerializer.setOutput(stringWriter);
        newSerializer.startDocument("UTF-8", Boolean.TRUE);
        newSerializer.startTag(null, "location");
        newSerializer.startTag(null, KEY_LATITUDE);
        newSerializer.text(Double.toString(location.getLatitude()));
        newSerializer.endTag(null, KEY_LATITUDE);
        newSerializer.startTag(null, KEY_LONGITUDE);
        newSerializer.text(Double.toString(location.getLongitude()));
        newSerializer.endTag(null, KEY_LONGITUDE);
        if (location.hasAltitude()) {
            newSerializer.startTag(null, KEY_ALTITUDE);
            newSerializer.text(Double.toString(location.getAltitude()));
            newSerializer.endTag(null, KEY_ALTITUDE);
        }
        if (location.hasBearing()) {
            newSerializer.startTag(null, KEY_HEADING);
            newSerializer.text(Float.toString(location.getBearing()));
            newSerializer.endTag(null, KEY_HEADING);
        }
        if (location.hasAccuracy()) {
            newSerializer.startTag(null, KEY_ACCURACY);
            newSerializer.text(Float.toString(location.getAccuracy()));
            newSerializer.endTag(null, KEY_ACCURACY);
        }
        if (location.hasSpeed()) {
            newSerializer.startTag(null, KEY_SPEED);
            newSerializer.text(Float.toString(location.getSpeed()));
            newSerializer.endTag(null, KEY_SPEED);
        }
        newSerializer.startTag(null, "timestamp");
        newSerializer.text(Long.toString(location.getTime()));
        newSerializer.endTag(null, "timestamp");
        newSerializer.endTag(null, "location");
        newSerializer.endDocument();
        newSerializer.flush();
        String stringWriter2 = stringWriter.toString();
        stringWriter.close();
        return stringWriter2;
    }
}
