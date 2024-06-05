package com.uievolution.microserver;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;

/* loaded from: classes.dex */
public interface IMSSConnectionObserver extends IInterface {

    /* loaded from: classes.dex */
    public static class Default implements IMSSConnectionObserver {
        @Override // android.os.IInterface
        public IBinder asBinder() {
            return null;
        }

        @Override // com.uievolution.microserver.IMSSConnectionObserver
        public void onConnectionEvent(int i) throws RemoteException {
        }
    }

    /* loaded from: classes.dex */
    public static abstract class Stub extends Binder implements IMSSConnectionObserver {

        /* JADX INFO: Access modifiers changed from: private */
        /* loaded from: classes.dex */
        public static class a implements IMSSConnectionObserver {
            public static IMSSConnectionObserver b;
            private IBinder a;

            a(IBinder iBinder) {
                this.a = iBinder;
            }

            @Override // android.os.IInterface
            public IBinder asBinder() {
                return this.a;
            }

            @Override // com.uievolution.microserver.IMSSConnectionObserver
            public void onConnectionEvent(int i) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMSSConnectionObserver");
                    obtain.writeInt(i);
                    if (!this.a.transact(1, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().onConnectionEvent(i);
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
            attachInterface(this, "com.uievolution.microserver.IMSSConnectionObserver");
        }

        public static IMSSConnectionObserver asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.uievolution.microserver.IMSSConnectionObserver");
            if (queryLocalInterface != null && (queryLocalInterface instanceof IMSSConnectionObserver)) {
                return (IMSSConnectionObserver) queryLocalInterface;
            }
            return new a(iBinder);
        }

        public static IMSSConnectionObserver getDefaultImpl() {
            return a.b;
        }

        public static boolean setDefaultImpl(IMSSConnectionObserver iMSSConnectionObserver) {
            if (a.b != null || iMSSConnectionObserver == null) {
                return false;
            }
            a.b = iMSSConnectionObserver;
            return true;
        }

        @Override // android.os.IInterface
        public IBinder asBinder() {
            return this;
        }

        @Override // android.os.Binder
        public boolean onTransact(int i, Parcel parcel, Parcel parcel2, int i2) throws RemoteException {
            if (i != 1) {
                if (i != 1598968902) {
                    return super.onTransact(i, parcel, parcel2, i2);
                }
                parcel2.writeString("com.uievolution.microserver.IMSSConnectionObserver");
                return true;
            }
            parcel.enforceInterface("com.uievolution.microserver.IMSSConnectionObserver");
            onConnectionEvent(parcel.readInt());
            parcel2.writeNoException();
            return true;
        }
    }

    void onConnectionEvent(int i) throws RemoteException;
}
