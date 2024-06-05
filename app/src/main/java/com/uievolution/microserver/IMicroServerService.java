package com.uievolution.microserver;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.Parcelable;
import android.os.RemoteException;
import com.uievolution.microserver.IMSSConnectionObserver;
import com.uievolution.microserver.IMSSErrorObserver;

/* loaded from: classes.dex */
public interface IMicroServerService extends IInterface {

    /* loaded from: classes.dex */
    public static class Default implements IMicroServerService {
        @Override // android.os.IInterface
        public IBinder asBinder() {
            return null;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void disableTraffic() throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void enableTraffic() throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public MSError getLastError() throws RemoteException {
            return null;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public int getWiFiHttpPort() throws RemoteException {
            return 0;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public int getWiFiHttpsPort() throws RemoteException {
            return 0;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public int getWiFiListeningPort() throws RemoteException {
            return 0;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isConnected() throws RemoteException {
            return false;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isEnabledTraffic() throws RemoteException {
            return false;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public boolean isForeground() throws RemoteException {
            return false;
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void removeErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void removeObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void restartLWIP() throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void setErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void setObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void startForeground() throws RemoteException {
        }

        @Override // com.uievolution.microserver.IMicroServerService
        public void stopForeground() throws RemoteException {
        }
    }

    /* loaded from: classes.dex */
    public static abstract class Stub extends Binder implements IMicroServerService {

        /* JADX INFO: Access modifiers changed from: private */
        /* loaded from: classes.dex */
        public static class a implements IMicroServerService {
            public static IMicroServerService b;
            private IBinder a;

            a(IBinder iBinder) {
                this.a = iBinder;
            }

            @Override // android.os.IInterface
            public IBinder asBinder() {
                return this.a;
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void disableTraffic() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(12, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().disableTraffic();
                    } else {
                        obtain2.readException();
                    }
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void enableTraffic() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(11, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().enableTraffic();
                    } else {
                        obtain2.readException();
                    }
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public MSError getLastError() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(5, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getLastError();
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0 ? MSError.CREATOR.createFromParcel(obtain2) : null;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public int getWiFiHttpPort() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(8, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getWiFiHttpPort();
                    }
                    obtain2.readException();
                    return obtain2.readInt();
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public int getWiFiHttpsPort() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(9, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getWiFiHttpsPort();
                    }
                    obtain2.readException();
                    return obtain2.readInt();
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public int getWiFiListeningPort() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(7, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getWiFiListeningPort();
                    }
                    obtain2.readException();
                    return obtain2.readInt();
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public boolean isConnected() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(6, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().isConnected();
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public boolean isEnabledTraffic() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(13, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().isEnabledTraffic();
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public boolean isForeground() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(16, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().isForeground();
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void removeErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    obtain.writeStrongBinder(iMSSErrorObserver != null ? iMSSErrorObserver.asBinder() : null);
                    if (this.a.transact(4, obtain, null, 1) || Stub.getDefaultImpl() == null) {
                        return;
                    }
                    Stub.getDefaultImpl().removeErrorObserver(iMSSErrorObserver);
                } finally {
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void removeObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    obtain.writeStrongBinder(iMSSConnectionObserver != null ? iMSSConnectionObserver.asBinder() : null);
                    if (this.a.transact(2, obtain, null, 1) || Stub.getDefaultImpl() == null) {
                        return;
                    }
                    Stub.getDefaultImpl().removeObserver(iMSSConnectionObserver);
                } finally {
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void restartLWIP() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(10, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().restartLWIP();
                    } else {
                        obtain2.readException();
                    }
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void setErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    obtain.writeStrongBinder(iMSSErrorObserver != null ? iMSSErrorObserver.asBinder() : null);
                    if (this.a.transact(3, obtain, null, 1) || Stub.getDefaultImpl() == null) {
                        return;
                    }
                    Stub.getDefaultImpl().setErrorObserver(iMSSErrorObserver);
                } finally {
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void setObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    obtain.writeStrongBinder(iMSSConnectionObserver != null ? iMSSConnectionObserver.asBinder() : null);
                    if (this.a.transact(1, obtain, null, 1) || Stub.getDefaultImpl() == null) {
                        return;
                    }
                    Stub.getDefaultImpl().setObserver(iMSSConnectionObserver);
                } finally {
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void startForeground() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(14, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().startForeground();
                    } else {
                        obtain2.readException();
                    }
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.uievolution.microserver.IMicroServerService
            public void stopForeground() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMicroServerService");
                    if (!this.a.transact(15, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().stopForeground();
                    } else {
                        obtain2.readException();
                    }
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }
        }

        public Stub() {
            attachInterface(this, "com.uievolution.microserver.IMicroServerService");
        }

        public static IMicroServerService asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.uievolution.microserver.IMicroServerService");
            if (queryLocalInterface != null && (queryLocalInterface instanceof IMicroServerService)) {
                return (IMicroServerService) queryLocalInterface;
            }
            return new a(iBinder);
        }

        public static IMicroServerService getDefaultImpl() {
            return a.b;
        }

        public static boolean setDefaultImpl(IMicroServerService iMicroServerService) {
            if (a.b != null || iMicroServerService == null) {
                return false;
            }
            a.b = iMicroServerService;
            return true;
        }

        @Override // android.os.IInterface
        public IBinder asBinder() {
            return this;
        }

        @Override // android.os.Binder
        public boolean onTransact(int i, Parcel parcel, Parcel parcel2, int i2) throws RemoteException {
            if (i != 1598968902) {
                switch (i) {
                    case 1:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        setObserver(IMSSConnectionObserver.Stub.asInterface(parcel.readStrongBinder()));
                        return true;
                    case 2:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        removeObserver(IMSSConnectionObserver.Stub.asInterface(parcel.readStrongBinder()));
                        return true;
                    case 3:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        setErrorObserver(IMSSErrorObserver.Stub.asInterface(parcel.readStrongBinder()));
                        return true;
                    case 4:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        removeErrorObserver(IMSSErrorObserver.Stub.asInterface(parcel.readStrongBinder()));
                        return true;
                    case 5:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        MSError lastError = getLastError();
                        parcel2.writeNoException();
                        if (lastError != null) {
                            parcel2.writeInt(1);
                            lastError.writeToParcel(parcel2, Parcelable.PARCELABLE_WRITE_RETURN_VALUE);
                        } else {
                            parcel2.writeInt(0);
                        }
                        return true;
                    case 6:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        boolean isConnected = isConnected();
                        parcel2.writeNoException();
                        parcel2.writeInt(isConnected ? 1 : 0);
                        return true;
                    case 7:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        int wiFiListeningPort = getWiFiListeningPort();
                        parcel2.writeNoException();
                        parcel2.writeInt(wiFiListeningPort);
                        return true;
                    case 8:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        int wiFiHttpPort = getWiFiHttpPort();
                        parcel2.writeNoException();
                        parcel2.writeInt(wiFiHttpPort);
                        return true;
                    case 9:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        int wiFiHttpsPort = getWiFiHttpsPort();
                        parcel2.writeNoException();
                        parcel2.writeInt(wiFiHttpsPort);
                        return true;
                    case 10:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        restartLWIP();
                        parcel2.writeNoException();
                        return true;
                    case 11:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        enableTraffic();
                        parcel2.writeNoException();
                        return true;
                    case 12:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        disableTraffic();
                        parcel2.writeNoException();
                        return true;
                    case 13:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        boolean isEnabledTraffic = isEnabledTraffic();
                        parcel2.writeNoException();
                        parcel2.writeInt(isEnabledTraffic ? 1 : 0);
                        return true;
                    case 14:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        startForeground();
                        parcel2.writeNoException();
                        return true;
                    case 15:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        stopForeground();
                        parcel2.writeNoException();
                        return true;
                    case 16:
                        parcel.enforceInterface("com.uievolution.microserver.IMicroServerService");
                        boolean isForeground = isForeground();
                        parcel2.writeNoException();
                        parcel2.writeInt(isForeground ? 1 : 0);
                        return true;
                    default:
                        return super.onTransact(i, parcel, parcel2, i2);
                }
            }
            parcel2.writeString("com.uievolution.microserver.IMicroServerService");
            return true;
        }
    }

    void disableTraffic() throws RemoteException;

    void enableTraffic() throws RemoteException;

    MSError getLastError() throws RemoteException;

    int getWiFiHttpPort() throws RemoteException;

    int getWiFiHttpsPort() throws RemoteException;

    int getWiFiListeningPort() throws RemoteException;

    boolean isConnected() throws RemoteException;

    boolean isEnabledTraffic() throws RemoteException;

    boolean isForeground() throws RemoteException;

    void removeErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException;

    void removeObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException;

    void restartLWIP() throws RemoteException;

    void setErrorObserver(IMSSErrorObserver iMSSErrorObserver) throws RemoteException;

    void setObserver(IMSSConnectionObserver iMSSConnectionObserver) throws RemoteException;

    void startForeground() throws RemoteException;

    void stopForeground() throws RemoteException;
}
