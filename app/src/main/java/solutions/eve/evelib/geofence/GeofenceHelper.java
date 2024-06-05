package solutions.eve.evelib.geofence;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.util.ArrayList;
import java.util.List;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.helper.json.EVEConnect;
import solutions.eve.evelib.helper.json.EVEConnectConfiguration;
import solutions.eve.evelib.helper.json.EVELocation;
import solutions.eve.evelib.utils.Constants;
import solutions.eve.evelib.utils.Logger;

/* loaded from: classes.dex */
public class GeofenceHelper {
    public static final int CONNECTION_FAILURE_RESOLUTION_REQUEST = 100;
    private static final long FASTEST_UPDATE_FREQ = 5000;
    private static final long POLLING_FREQ = 30000;
    static GeofenceHelper sGeoInstance;
    private Context context;
    private EVEConnectConfiguration eveConnectConfiguration;
    private Location mBestReading;
    private List<Geofence> mGeofenceList;
    private PendingIntent mGeofencePendingIntent;
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private boolean isclear = false;
    private double currentLatitude = 45.3556629d;
    private double currentLongitude = -75.7541187d;
    private GoogleApiClient.ConnectionCallbacks connectionAddListener = new GoogleApiClient.ConnectionCallbacks() { // from class: solutions.eve.evelib.geofence.GeofenceHelper.1
        @Override // com.google.android.gms.common.api.internal.ConnectionCallbacks
        public void onConnected(Bundle bundle) {
            Logger.i("onConnected");
            if (ActivityCompat.checkSelfPermission(GeofenceHelper.this.context, "android.permission.ACCESS_FINE_LOCATION") == 0 || ActivityCompat.checkSelfPermission(GeofenceHelper.this.context, "android.permission.ACCESS_COARSE_LOCATION") == 0) {
                Location lastLocation = LocationServices.FusedLocationApi.getLastLocation(GeofenceHelper.this.mGoogleApiClient);
                if (lastLocation == null) {
                    LocationServices.FusedLocationApi.requestLocationUpdates(GeofenceHelper.this.mGoogleApiClient, GeofenceHelper.this.mLocationRequest, GeofenceHelper.this.locationListenerGPS);
                } else {
                    GeofenceHelper.this.currentLatitude = lastLocation.getLatitude();
                    GeofenceHelper.this.currentLongitude = lastLocation.getLongitude();
                    Logger.i(GeofenceHelper.this.currentLatitude + " WORKS " + GeofenceHelper.this.currentLongitude);
                }
                try {
                    LocationServices.GeofencingApi.addGeofences(GeofenceHelper.this.mGoogleApiClient, GeofenceHelper.this.getGeofencingRequest(), GeofenceHelper.this.getGeofencePendingIntent()).setResultCallback(new ResultCallback<Status>() { // from class: solutions.eve.evelib.geofence.GeofenceHelper.1.1
                        @Override // com.google.android.gms.common.api.ResultCallback
                        public void onResult(Status status) {
                            if (status.isSuccess()) {
                                Logger.i("Saving Geofence");
                                GeofenceHelper.this.isclear = false;
                                return;
                            }
                            Logger.e("Registering geofence failed: " + status.getStatusMessage() + " : " + status.getStatusCode());
                        }
                    });
                } catch (SecurityException e) {
                    Logger.e("Error ", e);
                }
            }
        }

        @Override // com.google.android.gms.common.api.internal.ConnectionCallbacks
        public void onConnectionSuspended(int i) {
            Logger.e("onConnectionSuspended");
        }
    };
    private GoogleApiClient.OnConnectionFailedListener connectionFailedListener = new GoogleApiClient.OnConnectionFailedListener() { // from class: solutions.eve.evelib.geofence.GeofenceHelper.2
        @Override // com.google.android.gms.common.api.internal.OnConnectionFailedListener
        public void onConnectionFailed(ConnectionResult connectionResult) {
            Logger.e("onConnectionFailed " + connectionResult.getErrorMessage());
        }
    };
    LocationListener locationListenerGPS = new LocationListener() { // from class: solutions.eve.evelib.geofence.GeofenceHelper.3
        @Override // com.google.android.gms.location.LocationListener
        public void onLocationChanged(Location location) {
            Logger.i("onLocationChanged");
            GeofenceHelper.this.currentLatitude = location.getLatitude();
            GeofenceHelper.this.currentLongitude = location.getLongitude();
            Logger.e("New Latitude: " + GeofenceHelper.this.currentLatitude + "New Longitude: " + GeofenceHelper.this.currentLongitude);
        }
    };

    public static synchronized GeofenceHelper getInstance(Context context) {
        GeofenceHelper geofenceHelper;
        synchronized (GeofenceHelper.class) {
            if (sGeoInstance == null) {
                Logger.i("********** sGeoInstance is NULL");
                sGeoInstance = new GeofenceHelper(context);
            }
            Logger.i("GeoFence List: " + sGeoInstance.mGeofenceList);
            geofenceHelper = sGeoInstance;
        }
        return geofenceHelper;
    }

    public GeofenceHelper(Context context) {
        this.context = context;
        PreferenceManager.setup(context);
        String string = PreferenceManager.mediapref.getString(Constants.EVECONNECT_CONFIGURATION, null);
        if (!TextUtils.isEmpty(string)) {
            checkEVEConfiguration(this.eveConnectConfiguration, string);
            Logger.i("********** PREPARE TO SETUP GEO FENCES");
        } else {
            Logger.e("********** ERROR SETTING UP GEOFENCES");
        }
    }

    public void SetupGeoFences(String str) {
        Logger.i("SetupGeoFences");
        if (!TextUtils.isEmpty(str)) {
            this.eveConnectConfiguration = ((EVEConnect) new Gson().fromJson(str, EVEConnect.class)).getEVEConnectConfiguration();
            this.mGeofenceList = new ArrayList();
            if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this.context) == 0) {
                createGeofences(this.eveConnectConfiguration);
                initGoogleAPIClient();
            } else {
                Logger.i("Your Device doesn't support Google Play Services.");
            }
            this.mLocationRequest = LocationRequest.create().setPriority(100).setInterval(POLLING_FREQ).setFastestInterval(FASTEST_UPDATE_FREQ);
            return;
        }
        Logger.e("EVEConnectConfiguration EMPTY");
    }

    Geofence buildGeoFence(String str, EVELocation eVELocation, Integer num, int i) {
        Geofence.Builder builder = new Geofence.Builder();
        str.hashCode();
        String str2 = "onway";
        char c = 65535;
        switch (str.hashCode()) {
            case -1285572140:
                if (str.equals("arriving")) {
                    c = 0;
                    break;
                }
                break;
            case 50895284:
                if (str.equals("leaving")) {
                    c = 1;
                    break;
                }
                break;
            case 105905328:
                if (str.equals("onway")) {
                    c = 2;
                    break;
                }
                break;
        }
        switch (c) {
            case 0:
                if (num.intValue() < 70) {
                    num = 90;
                }
                str2 = "arriving";
                break;
            case 1:
                if (num.intValue() < 70) {
                    num = 90;
                }
                str2 = "leaving";
                break;
            case 2:
                num = Integer.valueOf(num.intValue() * 1000);
                break;
            default:
                str2 = null;
                break;
        }
        Logger.i("GeoFence: " + eVELocation.getLocationID() + str + "Radius: " + num);
        builder.setRequestId(eVELocation.getLocationID() + "__" + eVELocation.getLocationName().trim() + "__" + str2 + "__" + eVELocation.getLatitude() + "__" + eVELocation.getLongitude()).setCircularRegion(eVELocation.getLatitude().doubleValue(), eVELocation.getLongitude().doubleValue(), num.intValue()).setExpirationDuration(-1L).setTransitionTypes(i);
        return builder.build();
    }

    private void initGoogleAPIClient() {
        GoogleApiClient build = new GoogleApiClient.Builder(this.context).addApi(LocationServices.API).addConnectionCallbacks(this.connectionAddListener).addOnConnectionFailedListener(this.connectionFailedListener).build();
        this.mGoogleApiClient = build;
        build.connect();
    }

    private void checkEVEConfiguration(EVEConnectConfiguration eVEConnectConfiguration, String str) {
        Logger.i("Checking is user has leaving, arriving, or onway");
        EVEConnectConfiguration eVEConnectConfiguration2 = ((EVEConnect) new Gson().fromJson(str, EVEConnect.class)).getEVEConnectConfiguration();
        if (PreferenceManager.mediapref == null) {
            Logger.e("PreferenceManager was null");
            PreferenceManager.setup(this.context);
        } else {
            Logger.e("PreferenceManager was NOT null");
        }
        for (int i = 0; i < eVEConnectConfiguration2.getLocations().size(); i++) {
            Logger.i("LOOPING THROUGH EVEConnectConfiguration LOCATIONS ARRAY");
            if (eVEConnectConfiguration2.getLocations().get(i).getHasarriving().booleanValue() || eVEConnectConfiguration2.getLocations().get(i).getHasleaving().booleanValue() || eVEConnectConfiguration2.getLocations().get(i).getHasonway().booleanValue()) {
                Logger.e("USER HAS AT LEAST ONE ONE SHORTCUT CONFIGURED");
                SetupGeoFences(str);
                PreferenceManager.storeBoolean("hasShortCuts", true);
            } else {
                Logger.e("NO SHORT CUTS CONFIGURED");
                PreferenceManager.storeBoolean("hasShortCuts", false);
            }
        }
    }

    public void createGeofences(EVEConnectConfiguration eVEConnectConfiguration) {
        if (eVEConnectConfiguration.getHassmarthome().booleanValue()) {
            for (int i = 0; i < eVEConnectConfiguration.getLocations().size(); i++) {
                if (eVEConnectConfiguration.getLocations().get(i).getHasarriving().booleanValue()) {
                    this.mGeofenceList.add(buildGeoFence("arriving", eVEConnectConfiguration.getLocations().get(i), eVEConnectConfiguration.getLocations().get(i).getDistancearriving(), 1));
                    Log.i("Geofence", "Got here 1 ...");
                }
                if (eVEConnectConfiguration.getLocations().get(i).getHasleaving().booleanValue()) {
                    this.mGeofenceList.add(buildGeoFence("leaving", eVEConnectConfiguration.getLocations().get(i), eVEConnectConfiguration.getLocations().get(i).getDistanceleaving(), 2));
                    Log.i("Geofence", "Got here 2 ...");
                }
                if (eVEConnectConfiguration.getLocations().get(i).getHasonway().booleanValue()) {
                    this.mGeofenceList.add(buildGeoFence("onway", eVEConnectConfiguration.getLocations().get(i), eVEConnectConfiguration.getLocations().get(i).getDistanceonway(), 1));
                    Log.i("Geofence", "Got here 3...");
                }
            }
        }
        int size = this.mGeofenceList.size();
        String[] strArr = new String[size];
        for (int i2 = 0; i2 < size; i2++) {
            strArr[i2] = this.mGeofenceList.get(i2).getRequestId();
        }
        PreferenceManager.storeString(Constants.EVEFences, new Gson().toJson(strArr));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public GeofencingRequest getGeofencingRequest() {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(0);
        builder.addGeofences(this.mGeofenceList);
        return builder.build();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public PendingIntent getGeofencePendingIntent() {
        PendingIntent pendingIntent = this.mGeofencePendingIntent;
        if (pendingIntent != null) {
            return pendingIntent;
        }
        return PendingIntent.getService(this.context, 702, new Intent(this.context, (Class<?>) GeofenceTransitionsIntentService.class), 134217728);
    }

    public void removeFences() {
        if (this.isclear) {
            return;
        }
        if (PreferenceManager.mediapref == null) {
            Logger.e("PreferenceManager was null");
            PreferenceManager.setup(this.context);
        }
        if (!PreferenceManager.mediapref.getBoolean("hasShortCuts", false)) {
            Logger.e("USER DOES NOT HAVE GEOFENCES SO RETUN");
            return;
        }
        if (this.mGoogleApiClient == null) {
            initGoogleAPIClient();
        }
        try {
            if (PreferenceManager.mediapref == null) {
                PreferenceManager.setup(this.context);
            }
            String string = PreferenceManager.mediapref.getString(Constants.EVEFences, null);
            if (!TextUtils.isEmpty(string)) {
                String[] strArr = (String[]) new Gson().fromJson(string, new TypeToken<String[]>() { // from class: solutions.eve.evelib.geofence.GeofenceHelper.4
                }.getType());
                if (strArr.length > 0) {
                    ArrayList arrayList = new ArrayList();
                    for (String str : strArr) {
                        arrayList.add(str);
                    }
                    LocationServices.GeofencingApi.removeGeofences(this.mGoogleApiClient, arrayList);
                    this.isclear = true;
                }
            }
        } catch (Exception e) {
            Logger.e("remove ", e);
        }
        removeAllServices();
    }

    private void removeAllServices() {
        if (this.isclear) {
            Logger.i("removed all fences");
        }
        ((AlarmManager) this.context.getSystemService(NotificationCompat.CATEGORY_ALARM)).cancel(PendingIntent.getService(this.context, 702, new Intent(this.context, (Class<?>) ValidateAutomationIntentService.class), 134217728));
    }

    private Location bestLastKnownLocation(float f, long j) {
        long j2;
        if (ActivityCompat.checkSelfPermission(this.context, "android.permission.ACCESS_FINE_LOCATION") != 0) {
            ActivityCompat.checkSelfPermission(this.context, "android.permission.ACCESS_COARSE_LOCATION");
        }
        Location lastLocation = LocationServices.FusedLocationApi.getLastLocation(this.mGoogleApiClient);
        float f2 = Float.MAX_VALUE;
        if (lastLocation != null) {
            float accuracy = lastLocation.getAccuracy();
            j2 = lastLocation.getTime();
            if (accuracy < Float.MAX_VALUE) {
                f2 = accuracy;
                if (f2 <= f || j2 < j) {
                    return null;
                }
                return lastLocation;
            }
        }
        j2 = Long.MIN_VALUE;
        lastLocation = null;
        if (f2 <= f) {
        }
        return null;
    }

    private boolean servicesAvailable() {
        return GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this.context) == 0;
    }
}
