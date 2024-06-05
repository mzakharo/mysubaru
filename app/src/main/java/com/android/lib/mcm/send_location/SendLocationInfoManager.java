package com.android.lib.mcm.send_location;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import android.text.TextUtils;
import com.android.lib.mcm.LogWrapper;
import com.clarion.android.smartaccess4car.extend.util.AppInfoUtil;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
/* loaded from: classes.dex */
public class SendLocationInfoManager {
    private static String TAG = "SendLocationInfoManager";
    private static SensorEventListener sGetAccelerationListener = null;
    private static Timer sGetAccelerationTimer = null;
    private static LocationListener sGetGpsLocationListener = null;
    private static LocationListener sGetNetworkLocationListener = null;
    private static SensorEventListener sGetOrientationListener = null;
    private static Timer sGetOrientationTimer = null;
    private static boolean sIsGetOrientationAcc = false;
    private static boolean sIsGetOrientationMgn = false;
    private static boolean sIsSucceededGpsPositioning = false;
    private static LocationManager sLocationManager;
    private static float[] sOrientationAccValues;
    private static float[] sOrientationMgnValues;
    private static SensorManager sSensorManager;

    /* loaded from: classes.dex */
    public interface IAccelerationCallback {
        void callback(float f, float f2, float f3, boolean z, Date date) throws UnsupportedEncodingException;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface IAccelerationCallbackInternal {
        void callback(float f, float f2, float f3, boolean z);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface IGetLocation {
        void getLocation(LocationListener locationListener, Location location);
    }

    /* loaded from: classes.dex */
    public interface ILocationCallback {
        void callback(double d, double d2, float f, LocationProvider locationProvider, boolean z, Date date) throws UnsupportedEncodingException;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface ILocationCallbackInternal {
        void callback(double d, double d2, float f, LocationProvider locationProvider, boolean z);
    }

    /* loaded from: classes.dex */
    public interface IOrientationCallback {
        void callback(float f, boolean z, Date date) throws UnsupportedEncodingException;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public interface IOrientationCallbackInternal {
        void callback(float f, boolean z);
    }

    /* loaded from: classes.dex */
    public enum LocationProvider {
        GPS,
        NETWORK,
        Other
    }

    private static void initializeSensorManager(Context context) {
        if (sSensorManager != null) {
            return;
        }
        LogWrapper.d(TAG, "exec initializeSensorManager");
        sSensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
    }

    private static void initializeLocationManager(Context context) {
        if (sLocationManager != null) {
            return;
        }
        LogWrapper.d(TAG, "exec initializeLocationManager");
        sLocationManager = (LocationManager) context.getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
    }

    public static void stopGetLocation() {
        LocationManager locationManager = sLocationManager;
        if (locationManager != null) {
            LocationListener locationListener = sGetGpsLocationListener;
            if (locationListener != null) {
                locationManager.removeUpdates(locationListener);
            }
            LocationListener locationListener2 = sGetNetworkLocationListener;
            if (locationListener2 != null) {
                sLocationManager.removeUpdates(locationListener2);
            }
        }
        LogWrapper.d(TAG, "exec stopGetLocation");
    }

    public static void startGetLocation(final ILocationCallback iLocationCallback, Long l, Context context) {
        LogWrapper.d(TAG, "exec startGetLocation");
        initializeLocationManager(context);
        settingLocationPreferentiallyGps(new ILocationCallbackInternal() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.1
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.ILocationCallbackInternal
            public void callback(double d, double d2, float f, LocationProvider locationProvider, boolean z) {
                String str = SendLocationInfoManager.TAG;
                LogWrapper.d(str, "getLocation callback latitude:" + String.valueOf(d));
                String str2 = SendLocationInfoManager.TAG;
                LogWrapper.d(str2, "getLocation callback longitude:" + String.valueOf(d2));
                String str3 = SendLocationInfoManager.TAG;
                LogWrapper.d(str3, "getLocation callback speed:" + String.valueOf(f));
                String str4 = SendLocationInfoManager.TAG;
                LogWrapper.d(str4, "getLocation callback isSuccess:" + String.valueOf(z));
//ILocationCallback iLocationCallback2 = ILocationCallback.this;
               // if (iLocationCallback2 != null) {
              //      iLocationCallback2.callback(d, d2, f, locationProvider, z, SendLocationUtil.getNowDateUTC());
              //  }
            }
        }, l.longValue(), context);
    }

    public static void getAcceleration(final IAccelerationCallback iAccelerationCallback, Context context) {
        LogWrapper.d(TAG, "exec getAcceleration");
        initializeSensorManager(context.getApplicationContext());
        getAcceleration(new IAccelerationCallbackInternal() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.2
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IAccelerationCallbackInternal
            public void callback(float f, float f2, float f3, boolean z) {
                String str = SendLocationInfoManager.TAG;
                LogWrapper.d(str, "getAcceleration callback x:" + String.valueOf(f));
                String str2 = SendLocationInfoManager.TAG;
                LogWrapper.d(str2, "getAcceleration callback y:" + String.valueOf(f2));
                String str3 = SendLocationInfoManager.TAG;
                LogWrapper.d(str3, "getAcceleration callback z:" + String.valueOf(f3));
                String str4 = SendLocationInfoManager.TAG;
                LogWrapper.d(str4, "getAcceleration callback isSuccess:" + String.valueOf(z));
                //IAccelerationCallback iAccelerationCallback2 = IAccelerationCallback.this;
                //if (iAccelerationCallback2 != null) {
                //    iAccelerationCallback2.callback(f, f2, f3, z, SendLocationUtil.getNowDateUTC());
               // }
            }
        });
    }

    public static void stopGetAcceleration() {
        SensorManager sensorManager;
        LogWrapper.d(TAG, "exec stopGetAcceleration");
        Timer timer = sGetAccelerationTimer;
        if (timer != null) {
            timer.cancel();
            sGetAccelerationTimer = null;
        }
        SensorEventListener sensorEventListener = sGetAccelerationListener;
        if (sensorEventListener == null || (sensorManager = sSensorManager) == null) {
            return;
        }
        sensorManager.unregisterListener(sensorEventListener);
    }

    public static void startGetAcceleration(IAccelerationCallback iAccelerationCallback, Long l, Context context) {
        startGetAcceleration(iAccelerationCallback, l, Boolean.valueOf(sGetAccelerationTimer == null), context.getApplicationContext());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void startGetAcceleration(final IAccelerationCallback iAccelerationCallback, final Long l, Boolean bool, final Context context) {
        LogWrapper.d(TAG, "exec startGetAcceleration");
        initializeSensorManager(context);
        Timer timer = sGetAccelerationTimer;
        if (timer != null) {
            timer.cancel();
            sGetAccelerationTimer = null;
        }
        TimerTask timerTask = new TimerTask() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.3
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                SendLocationInfoManager.sGetAccelerationTimer.cancel();
                Timer unused = SendLocationInfoManager.sGetAccelerationTimer = null;
                if (!SendLocationService.isRunningService()) {
                    LogWrapper.d(SendLocationInfoManager.TAG, "getAcceleration stop timer");
                } else {
                    SendLocationInfoManager.getAcceleration(new IAccelerationCallbackInternal() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.3.1
                        @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IAccelerationCallbackInternal
                        public void callback(float f, float f2, float f3, boolean z) {
                            String str = SendLocationInfoManager.TAG;
                            LogWrapper.d(str, "getAcceleration callback x:" + String.valueOf(f));
                            String str2 = SendLocationInfoManager.TAG;
                            LogWrapper.d(str2, "getAcceleration callback y:" + String.valueOf(f2));
                            String str3 = SendLocationInfoManager.TAG;
                            LogWrapper.d(str3, "getAcceleration callback z:" + String.valueOf(f3));
                            String str4 = SendLocationInfoManager.TAG;
                            LogWrapper.d(str4, "getAcceleration callback isSuccess:" + String.valueOf(z));
                            //if (IAccelerationCallback.this != null) {
                            //    IAccelerationCallback.this.callback(f, f2, f3, z, SendLocationUtil.getNowDateUTC());
                           // }
                            //SendLocationInfoManager.startGetAcceleration(IAccelerationCallback.this, l, false, context);
                        }
                    });
                }
            }
        };
        Timer timer2 = new Timer();
        sGetAccelerationTimer = timer2;
        try {
            timer2.schedule(timerTask, bool.booleanValue() ? 1L : l.longValue());
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
    }

    public static void getOrientation(final IOrientationCallback iOrientationCallback, Context context) {
        LogWrapper.d(TAG, "exec getOrientation");
        initializeSensorManager(context.getApplicationContext());
        getOrientation(new IOrientationCallbackInternal() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.4
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IOrientationCallbackInternal
            public void callback(float f, boolean z) {
                String str = SendLocationInfoManager.TAG;
                LogWrapper.d(str, "getOrientation callback orientation:" + String.valueOf(f));
                String str2 = SendLocationInfoManager.TAG;
                LogWrapper.d(str2, "getOrientation callback isSuccess:" + String.valueOf(z));
               // IOrientationCallback iOrientationCallback2 = IOrientationCallback.this;
               // if (iOrientationCallback2 != null) {
               //     iOrientationCallback2.callback(f, z, SendLocationUtil.getNowDateUTC());
               // }
            }
        });
    }

    public static void stopGetOrientation() {
        SensorManager sensorManager;
        LogWrapper.d(TAG, "exec stopGetOrientation");
        Timer timer = sGetOrientationTimer;
        if (timer != null) {
            timer.cancel();
            sGetOrientationTimer = null;
        }
        SensorEventListener sensorEventListener = sGetOrientationListener;
        if (sensorEventListener == null || (sensorManager = sSensorManager) == null) {
            return;
        }
        sensorManager.unregisterListener(sensorEventListener);
    }

    public static void startGetOrientation(IOrientationCallback iOrientationCallback, Long l, Context context) {
        startGetOrientation(iOrientationCallback, l, Boolean.valueOf(sGetOrientationTimer == null), context.getApplicationContext());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void startGetOrientation(final IOrientationCallback iOrientationCallback, final Long l, Boolean bool, final Context context) {
        LogWrapper.d(TAG, "exec startGetOrientation");
        initializeSensorManager(context);
        Timer timer = sGetOrientationTimer;
        if (timer != null) {
            timer.cancel();
            sGetOrientationTimer = null;
        }
        TimerTask timerTask = new TimerTask() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.5
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                SendLocationInfoManager.sGetOrientationTimer.cancel();
                Timer unused = SendLocationInfoManager.sGetOrientationTimer = null;
                if (!SendLocationService.isRunningService()) {
                    LogWrapper.d(SendLocationInfoManager.TAG, "getOrientation stop timer");
                } else {
                    SendLocationInfoManager.getOrientation(new IOrientationCallbackInternal() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.5.1
                        @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IOrientationCallbackInternal
                        public void callback(float f, boolean z) {
                            String str = SendLocationInfoManager.TAG;
                            LogWrapper.d(str, "getOrientation callback orientation:" + String.valueOf(f));
                            String str2 = SendLocationInfoManager.TAG;
                            LogWrapper.d(str2, "getOrientation callback isSuccess:" + String.valueOf(z));
                           // if (IOrientationCallback.this != null) {
                           //     IOrientationCallback.this.callback(f, z, SendLocationUtil.getNowDateUTC());
                           // }
                          //  SendLocationInfoManager.startGetOrientation(IOrientationCallback.this, l, false, context);
                        }
                    });
                }
            }
        };
        Timer timer2 = new Timer();
        sGetOrientationTimer = timer2;
        try {
            timer2.schedule(timerTask, bool.booleanValue() ? 1L : l.longValue());
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void getAcceleration(final IAccelerationCallbackInternal iAccelerationCallbackInternal) {
        LogWrapper.d(TAG, "getAcceleration start");
        if (sSensorManager.getSensorList(1).size() > 0) {
            Sensor defaultSensor = sSensorManager.getDefaultSensor(1);
            SensorEventListener sensorEventListener = new SensorEventListener() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.6
                @Override // android.hardware.SensorEventListener
                public void onAccuracyChanged(Sensor sensor, int i) {
                }

                @Override // android.hardware.SensorEventListener
                public void onSensorChanged(SensorEvent sensorEvent) {
                    if (sensorEvent.sensor.getType() == 1) {
                        SendLocationInfoManager.sSensorManager.unregisterListener(this);
                        SensorEventListener unused = SendLocationInfoManager.sGetAccelerationListener = null;
                       // IAccelerationCallbackInternal iAccelerationCallbackInternal2 = IAccelerationCallbackInternal.this;
                        //if (iAccelerationCallbackInternal2 != null) {
                        //    iAccelerationCallbackInternal2.callback(sensorEvent.values[0], sensorEvent.values[1], sensorEvent.values[2], true);
                       // }
                        LogWrapper.d(SendLocationInfoManager.TAG, "getAcceleration end");
                    }
                }
            };
            sGetAccelerationListener = sensorEventListener;
            sSensorManager.registerListener(sensorEventListener, defaultSensor, 3);
            return;
        }
        LogWrapper.d(TAG, "getAcceleration supported");
        if (iAccelerationCallbackInternal != null) {
            iAccelerationCallbackInternal.callback(0.0f, 0.0f, 0.0f, false);
        }
        LogWrapper.d(TAG, "getAcceleration end");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void getOrientation(final IOrientationCallbackInternal iOrientationCallbackInternal) {
        LogWrapper.d(TAG, "getOrientation start");
        List<Sensor> sensorList = sSensorManager.getSensorList(1);
        List<Sensor> sensorList2 = sSensorManager.getSensorList(2);
        if (sensorList.size() > 0 && sensorList2.size() > 0) {
            Sensor defaultSensor = sSensorManager.getDefaultSensor(1);
            Sensor defaultSensor2 = sSensorManager.getDefaultSensor(2);
            sIsGetOrientationAcc = false;
            sIsGetOrientationMgn = false;
            SensorEventListener sensorEventListener = new SensorEventListener() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.7
                @Override // android.hardware.SensorEventListener
                public void onAccuracyChanged(Sensor sensor, int i) {
                }

                @Override // android.hardware.SensorEventListener
                public void onSensorChanged(SensorEvent sensorEvent) {
                    int type = sensorEvent.sensor.getType();
                    if (type == 1) {
                        boolean unused = SendLocationInfoManager.sIsGetOrientationAcc = true;
                        float[] unused2 = SendLocationInfoManager.sOrientationAccValues = (float[]) sensorEvent.values.clone();
                    } else if (type == 2) {
                        boolean unused3 = SendLocationInfoManager.sIsGetOrientationMgn = true;
                        float[] unused4 = SendLocationInfoManager.sOrientationMgnValues = (float[]) sensorEvent.values.clone();
                    }
                    if (SendLocationInfoManager.sIsGetOrientationAcc && SendLocationInfoManager.sIsGetOrientationMgn) {
                        SendLocationInfoManager.sSensorManager.unregisterListener(this);
                        SensorEventListener unused5 = SendLocationInfoManager.sGetOrientationListener = null;
                        float[] fArr = new float[3];
                        float[] fArr2 = new float[16];
                        SensorManager.getRotationMatrix(fArr2, new float[16], SendLocationInfoManager.sOrientationAccValues, SendLocationInfoManager.sOrientationMgnValues);
                        SensorManager.getOrientation(fArr2, fArr);
                        float floor = (float) Math.floor(Math.toDegrees(fArr[0]));
                        if (floor >= 0.0f) {
                            fArr[0] = floor;
                        } else if (floor < 0.0f) {
                            fArr[0] = floor + 360.0f;
                        }
                        //IOrientationCallbackInternal iOrientationCallbackInternal2 = IOrientationCallbackInternal.this;
                        //if (iOrientationCallbackInternal2 != null) {
                       //     iOrientationCallbackInternal2.callback(fArr[0], true);
                       // }
                        LogWrapper.d(SendLocationInfoManager.TAG, "getOrientation end");
                    }
                }
            };
            sGetOrientationListener = sensorEventListener;
            sSensorManager.registerListener(sensorEventListener, defaultSensor, 3);
            sSensorManager.registerListener(sGetOrientationListener, defaultSensor2, 3);
            return;
        }
        LogWrapper.d(TAG, "getOrientation not supported");
        if (iOrientationCallbackInternal != null) {
            iOrientationCallbackInternal.callback(0.0f, false);
        }
        LogWrapper.d(TAG, "getOrientation end");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static LocationProvider convLocationProvider(String str) {
        if (TextUtils.equals(str, "gps")) {
            return LocationProvider.GPS;
        }
        if (TextUtils.equals(str, "network")) {
            return LocationProvider.NETWORK;
        }
        return LocationProvider.Other;
    }

    private static void settingLocationPreferentiallyGps(final ILocationCallbackInternal iLocationCallbackInternal, long j, Context context) {
        LogWrapper.d(TAG, "start getLocationPreferentiallyGps");
        stopGetLocation();
        sIsSucceededGpsPositioning = false;
        final IGetLocation iGetLocation = new IGetLocation() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.8
            @Override // com.android.lib.mcm.send_location.SendLocationInfoManager.IGetLocation
            public void getLocation(LocationListener locationListener, Location location) {
                //ILocationCallbackInternal iLocationCallbackInternal2 = ILocationCallbackInternal.this;
                //if (iLocationCallbackInternal2 != null) {
                //    iLocationCallbackInternal2.callback(location.getLatitude(), location.getLongitude(), location.getSpeed(), SendLocationInfoManager.convLocationProvider(location.getProvider()), true);
                //}
                String str = SendLocationInfoManager.TAG;
                LogWrapper.d(str, "getLocation getLocationPreferentiallyGps:" + location.getProvider());
            }
        };
        sGetGpsLocationListener = new LocationListener() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.9
            @Override // android.location.LocationListener
            public void onProviderDisabled(String str) {
            }

            @Override // android.location.LocationListener
            public void onProviderEnabled(String str) {
            }

            @Override // android.location.LocationListener
            public void onStatusChanged(String str, int i, Bundle bundle) {
            }

            @Override // android.location.LocationListener
            public void onLocationChanged(Location location) {
                if (!SendLocationInfoManager.sIsSucceededGpsPositioning) {
                    LogWrapper.d(SendLocationInfoManager.TAG, "getLocationPreferentiallyGps:success gps positioning.");
                    boolean unused = SendLocationInfoManager.sIsSucceededGpsPositioning = true;
                    SendLocationInfoManager.sLocationManager.removeUpdates(SendLocationInfoManager.sGetNetworkLocationListener);
                }
                if (!SendLocationService.isRunningService()) {
                    LogWrapper.d(SendLocationInfoManager.TAG, "getLocation GPS stop timer");
                } else {
                   // IGetLocation.this.getLocation(this, location);
                }
            }
        };
        sGetNetworkLocationListener = new LocationListener() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.10
            @Override // android.location.LocationListener
            public void onProviderDisabled(String str) {
            }

            @Override // android.location.LocationListener
            public void onProviderEnabled(String str) {
            }

            @Override // android.location.LocationListener
            public void onStatusChanged(String str, int i, Bundle bundle) {
            }

            @Override // android.location.LocationListener
            public void onLocationChanged(Location location) {
                if (!SendLocationService.isRunningService()) {
                    LogWrapper.d(SendLocationInfoManager.TAG, "getLocation Network stop timer");
                } else {
                    //IGetLocation.this.getLocation(this, location);
                }
            }
        };
        Looper mainLooper = Looper.getMainLooper();
        sLocationManager.requestLocationUpdates("gps", j, 0.0f, sGetGpsLocationListener, mainLooper);
        if (sIsSucceededGpsPositioning) {
            return;
        }
        sLocationManager.requestLocationUpdates("network", j, 0.0f, sGetNetworkLocationListener, mainLooper);
    }

    public static String getCurrentPid(int i, Context context) {
        LogWrapper.d(TAG, "exec getCurrentPid");
        String billingPidCurrent = AppInfoUtil.getBillingPidCurrent(i);
        String[] billingPidHistory = AppInfoUtil.getBillingPidHistory(i);
        ArrayList arrayList = new ArrayList();
        if (!TextUtils.isEmpty(billingPidCurrent)) {
            arrayList.add(AppInfoUtil.getPidInfo(billingPidCurrent));
        }
        if (billingPidHistory != null) {
            for (String str : billingPidHistory) {
                if (!TextUtils.isEmpty(str)) {
                    arrayList.add(AppInfoUtil.getPidInfo(str));
                }
            }
        }
        Collections.sort(arrayList, new Comparator<AppInfoUtil.PidInfoContainer>() { // from class: com.android.lib.mcm.send_location.SendLocationInfoManager.11
            @Override // java.util.Comparator
            public int compare(AppInfoUtil.PidInfoContainer pidInfoContainer, AppInfoUtil.PidInfoContainer pidInfoContainer2) {
                if ((pidInfoContainer == null || pidInfoContainer.Date() == null) && (pidInfoContainer2 == null || pidInfoContainer2.Date() == null)) {
                    return 0;
                }
                if (pidInfoContainer == null || pidInfoContainer.Date() == null) {
                    return 1;
                }
                if (pidInfoContainer2 == null || pidInfoContainer2.Date() == null) {
                    return -1;
                }
                return pidInfoContainer.Date().compareTo(pidInfoContainer2.Date()) * (-1);
            }
        });
        LogWrapper.d(TAG, "getCurrentPid sorted pid list --->");
        Iterator it = arrayList.iterator();
        while (it.hasNext()) {
            LogWrapper.d(TAG, ((AppInfoUtil.PidInfoContainer) it.next()).Pid());
        }
        LogWrapper.d(TAG, "getCurrentPid sorted pid list <---");
        return arrayList.size() > 0 ? ((AppInfoUtil.PidInfoContainer) arrayList.get(0)).Pid() : "";
    }
}
