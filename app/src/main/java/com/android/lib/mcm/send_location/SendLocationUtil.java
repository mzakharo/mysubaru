package com.android.lib.mcm.send_location;

import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.uievolution.microserver.HttpRequestInfo;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;
/* loaded from: classes.dex */
public class SendLocationUtil {
    public static final String PARAM_VALUE_FORMAT_ACX = "$acx";
    public static final String PARAM_VALUE_FORMAT_ACY = "$acy";
    public static final String PARAM_VALUE_FORMAT_ACZ = "$acz";
    public static final String PARAM_VALUE_FORMAT_LAT = "$lat";
    public static final String PARAM_VALUE_FORMAT_LON = "$lon";
    public static final String PARAM_VALUE_FORMAT_ORI = "$ori";
    public static final String PARAM_VALUE_FORMAT_PID = "$pid";
    public static final String PARAM_VALUE_FORMAT_SIN = "$sin";
    public static final String PARAM_VALUE_FORMAT_SPD = "$spd";
    public static final String PARAM_VALUE_FORMAT_TIM = "$tim";
    private static final String TAG = "SendLocationUtil";
    private static final TimeZone TimestampTimeZone = TimeZone.getTimeZone("UTC");

    public static boolean sendTargetLocation(SendLocationInfo sendLocationInfo) {
        if (sendLocationInfo.getFormat() == null) {
            return false;
        }
        return sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_LAT) >= 0 || sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_LON) >= 0;
    }

    public static boolean isContainLocationFormat(String str) {
        if (TextUtils.isEmpty(str)) {
            return false;
        }
        return str.indexOf(PARAM_VALUE_FORMAT_LAT) >= 0 || str.indexOf(PARAM_VALUE_FORMAT_LON) >= 0;
    }

    public static boolean sendTargetSpeed(SendLocationInfo sendLocationInfo) {
        return sendLocationInfo.getFormat() != null && sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_SPD) >= 0;
    }

    public static boolean sendTargetAcceleration(SendLocationInfo sendLocationInfo) {
        if (sendLocationInfo.getFormat() == null) {
            return false;
        }
        return sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_ACX) >= 0 || sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_ACY) >= 0 || sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_ACZ) >= 0;
    }

    public static boolean sendTargetPID(SendLocationInfo sendLocationInfo) {
        return sendLocationInfo.getFormat() != null && sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_PID) >= 0;
    }

    public static boolean sendTargetOrientation(SendLocationInfo sendLocationInfo) {
        return sendLocationInfo.getFormat() != null && sendLocationInfo.getFormat().indexOf(PARAM_VALUE_FORMAT_ORI) >= 0;
    }

    public static String createParamString(String str, SendLocationInfoParamContainer sendLocationInfoParamContainer) throws UnsupportedEncodingException {
        return str.replace(PARAM_VALUE_FORMAT_LAT, encodeUrl(sendLocationInfoParamContainer.getLocationLatitude())).replace(PARAM_VALUE_FORMAT_LON, encodeUrl(sendLocationInfoParamContainer.getLocationLongitude())).replace(PARAM_VALUE_FORMAT_SPD, encodeUrl(sendLocationInfoParamContainer.getSpeed())).replace(PARAM_VALUE_FORMAT_ACX, encodeUrl(sendLocationInfoParamContainer.getAccelerationX())).replace(PARAM_VALUE_FORMAT_ACY, encodeUrl(sendLocationInfoParamContainer.getAccelerationY())).replace(PARAM_VALUE_FORMAT_ACZ, encodeUrl(sendLocationInfoParamContainer.getAccelerationZ())).replace(PARAM_VALUE_FORMAT_PID, encodeUrl(sendLocationInfoParamContainer.getPid())).replace(PARAM_VALUE_FORMAT_TIM, encodeUrl(sendLocationInfoParamContainer.getLocationTimestamp())).replace(PARAM_VALUE_FORMAT_ORI, encodeUrl(sendLocationInfoParamContainer.getOrientation()));
    }

    public static String createParamString(String str, SendLocationGlympseInfoContainer sendLocationGlympseInfoContainer) throws UnsupportedEncodingException {
        return createParamString(str.replace(PARAM_VALUE_FORMAT_TIM, encodeUrl(convTimestampUnixMilliSecondsFormat(getNowDateUTC()))), (SendLocationInfoParamContainer) sendLocationGlympseInfoContainer).replace(PARAM_VALUE_FORMAT_SIN, sendLocationGlympseInfoContainer.getSince());
    }

    public static String convTimestampISO8601Format(Date date) {
        if (date != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            simpleDateFormat.setTimeZone(TimestampTimeZone);
            return simpleDateFormat.format(date);
        }
        return "";
    }

    public static String convTimestampUnixMilliSecondsFormat(Date date) {
        return date != null ? String.valueOf(date.getTime()) : "";
    }

    public static String createParams(MSHTTPRequest mSHTTPRequest) {
        HttpRequestInfo requestInfo = mSHTTPRequest.getRequestInfo();
        if (TextUtils.equals(requestInfo.getMethod(), "GET")) {
            return requestInfo.getQueries();
        }
        try {
            return new String(mSHTTPRequest.getHttpBody(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return "";
        }
    }

    public static HashMap<String, String> parseParameter(MSHTTPRequest mSHTTPRequest) throws UnsupportedEncodingException {
        String createParams = createParams(mSHTTPRequest);
        LogWrapper.d(TAG, "parseParameter:" + createParams);
        HashMap<String, String> hashMap = new HashMap<>();
        if (createParams == null) {
            return hashMap;
        }
        String[] split = createParams.split(Const.REQUEST_PARAM_SEPARATE_STR);
        if (split.length != 0) {
            split[0] = split[0].substring(split[0].lastIndexOf("?") + 1);
            for (String str : split) {
                String[] split2 = str.split(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
                String str2 = null;
                if (split2.length == 0) {
                    split2 = new String[]{str, null};
                } else if (split2.length == 1) {
                    split2 = new String[]{split2[0], null};
                }
                String decodeUrl = split2[0] != null ? decodeUrl(split2[0]) : null;
                if (split2[1] != null) {
                    str2 = decodeUrl(split2[1]);
                }
                hashMap.put(decodeUrl, str2);
            }
        }
        return hashMap;
    }

    public static String decodeUrl(String str) throws UnsupportedEncodingException {
        if (str != null) {
        }
        return URLDecoder.decode(str, "UTF-8");
    }

    public static String encodeUrl(String str) throws UnsupportedEncodingException {
        if (str != null) {
        }
        return URLEncoder.encode(str, "UTF-8");
    }

    public static Date getNowDateUTC() {
        return Calendar.getInstance(TimestampTimeZone).getTime();
    }

    public static String convStringValue(float f) {
        return new DecimalFormat("##########.##########").format(f);
    }

    public static String convStringValue(double d) {
        return new DecimalFormat("##########.##########").format(d);
    }
}
