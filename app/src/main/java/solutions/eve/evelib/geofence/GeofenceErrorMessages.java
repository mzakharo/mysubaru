package solutions.eve.evelib.geofence;

import android.content.Context;
import android.content.res.Resources;
import com.google.android.gms.common.api.ApiException;
//import solutions.eve.evelib.R;
import com.example.mysubaru.R;


/* loaded from: classes.dex */
class GeofenceErrorMessages {
    private GeofenceErrorMessages() {
    }

    public static String getErrorString(Context context, Exception exc) {
        if (exc instanceof ApiException) {
            return getErrorString(context, ((ApiException) exc).getStatusCode());
        }
        return context.getResources().getString(R.string.unknown_geofence_error);
    }

    public static String getErrorString(Context context, int i) {
        Resources resources = context.getResources();
        switch (i) {
            case 1000:
                return resources.getString(R.string.geofence_not_available);
            case 1001:
                return resources.getString(R.string.geofence_too_many_geofences);
            case 1002:
                return resources.getString(R.string.geofence_too_many_pending_intents);
            default:
                return resources.getString(R.string.unknown_geofence_error);
        }
    }
}
