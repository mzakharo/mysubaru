package com.android.lib.mcm.kvswrapper;

import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import com.android.lib.mcm.application.MCApplication;
import com.android.lib.mcm.kvswrapper.IKvsWrapperService;
import com.uievolution.microserver.MicroServer;
import com.uievolution.microserver.modules.KeyValueStore;
/* loaded from: classes.dex */
public class KvsWrapperService extends Service {
    private final IKvsWrapperService.Stub mBinder = new IKvsWrapperService.Stub() { // from class: com.android.lib.mcm.kvswrapper.KvsWrapperService.1
        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public boolean saveData(byte[] bArr, String str) throws RemoteException {
            try {
                Log.d("KvsWrapperService", "start");
                return KeyValueStore.getInstance(MicroServer.getInstance().getContext()).saveData(bArr, str);
            } catch (KeyValueStore.KVSException e) {
                e.printStackTrace();
                throw new RemoteException(e.getLocalizedMessage());
            }
        }

        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public boolean deleteData(String str) throws RemoteException {
            try {
                Log.d("KvsWrapperService", "start");
                return KeyValueStore.getInstance(MicroServer.getInstance().getContext()).deleteData(str);
            } catch (KeyValueStore.KVSException e) {
                e.printStackTrace();
                throw new RemoteException(e.getLocalizedMessage());
            }
        }

        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public byte[] getData(String str) throws RemoteException {
            try {
                Log.d("KvsWrapperService", "start");
                return KeyValueStore.getInstance(MicroServer.getInstance().getContext()).getData(str);
            } catch (KeyValueStore.KVSException e) {
                e.printStackTrace();
                throw new RemoteException(e.getLocalizedMessage());
            }
        }
    };

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return this.mBinder;
    }

    /* loaded from: classes.dex */
    public static class Helper {
        private Callbacks mCallbacks;
        private ServiceConnection mConnection;
        private Callbacks mDefaultCallbacks;
        private IKvsWrapperService mIKvsWrapperService;

        /* loaded from: classes.dex */
        public interface Callbacks {
            void onServiceConnected();

            void onServiceDisconnected();
        }

        public Helper() {
            Callbacks callbacks = new Callbacks() { // from class: com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.1
                @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
                public void onServiceConnected() {
                }

                @Override // com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.Callbacks
                public void onServiceDisconnected() {
                }
            };
            this.mDefaultCallbacks = callbacks;
            this.mCallbacks = callbacks;
            this.mIKvsWrapperService = null;
            this.mConnection = new ServiceConnection() { // from class: com.android.lib.mcm.kvswrapper.KvsWrapperService.Helper.2
                @Override // android.content.ServiceConnection
                public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                    Log.d("IKvsWrapperService", "onServiceConnected() start");
                    Helper.this.mIKvsWrapperService = IKvsWrapperService.Stub.asInterface(iBinder);
                    Helper.this.mCallbacks.onServiceConnected();
                }

                @Override // android.content.ServiceConnection
                public void onServiceDisconnected(ComponentName componentName) {
                    Helper.this.mIKvsWrapperService = null;
                    Helper helper = Helper.this;
                    helper.mCallbacks = helper.mDefaultCallbacks;
                }
            };
        }

        public IKvsWrapperService getKvsWrapperService() {
            return this.mIKvsWrapperService;
        }

        public void connect(Callbacks callbacks) {
            this.mCallbacks = callbacks;
            Intent intent = new Intent(MCApplication.getInstance(), KvsWrapperService.class);
            intent.setAction(IKvsWrapperService.class.getName());
            try {
                MCApplication.getInstance().bindService(intent, this.mConnection, 1);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        public void disconnect() {
            try {
                this.mCallbacks.onServiceDisconnected();
                MCApplication.getInstance().unbindService(this.mConnection);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
