package solutions.eve.evelib;

import android.content.Context;
import solutions.eve.evelib.apiai.APIAIHelper;
import solutions.eve.evelib.helper.BluetoothController;
import solutions.eve.evelib.helper.PreferenceManager;
import solutions.eve.evelib.helper.TTS;
import solutions.eve.evelib.http.APIHttpClient;
import solutions.eve.evelib.utils.Config;
import solutions.eve.evelib.utils.Logger;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class BaseHelper {
    static APIAIHelper apiaiHelper;
    static BluetoothController bluetoothController;
    static APIHttpClient client;

    /* JADX INFO: Access modifiers changed from: package-private */
    public static boolean initializeBaseHelper(Context context) {
        try {
            PreferenceManager.setup(context);
            if (bluetoothController == null) {
                bluetoothController = new BluetoothControllerImpl(context);
            }
            if (apiaiHelper == null) {
                apiaiHelper = new APIAIHelper(context);
            }
            if (client == null) {
                client = APIHttpClient.createClient(context);
            }
        } catch (Exception e) {
            Logger.e("initializeBaseHelper", e);
        }
        return (client == null || bluetoothController == null) ? false : true;
    }

    public static void startHMIcall() {
        Config.isUseBluetoothHeadphone = true;
        bluetoothController.start();
    }

    public static void stopHMIcall() {
        Config.isUseBluetoothHeadphone = false;
        Logger.e("Stopping HMI call");
        bluetoothController.stop();
    }

    /* loaded from: classes.dex */
    private static class BluetoothControllerImpl extends BluetoothController {
        BluetoothControllerImpl(Context context) {
            super(context);
        }

        @Override // solutions.eve.evelib.helper.BluetoothController
        public void onHeadsetDisconnected() {
            Logger.d("Bluetooth headset disconnected");
        }

        @Override // solutions.eve.evelib.helper.BluetoothController
        public void onHeadsetConnected() {
            Logger.d("Bluetooth headset connected");
        }

        @Override // solutions.eve.evelib.helper.BluetoothController
        public void onScoAudioDisconnected() {
            Logger.d("Bluetooth sco audio finished");
            BaseHelper.bluetoothController.stop();
        }

        @Override // solutions.eve.evelib.helper.BluetoothController
        public void onScoAudioConnected() {
            Logger.d("Bluetooth sco audio started");
        }
    }

    public static APIHttpClient getClient() {
        return client;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void baseHelperRelease() {
        TTS.release();
    }
}
