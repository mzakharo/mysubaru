package com.uievolution.microserver;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;

/* loaded from: classes.dex */
public interface IMSSErrorObserver extends IInterface {

    /* loaded from: classes.dex */
    public static class Default implements IMSSErrorObserver {
        @Override // android.os.IInterface
        public IBinder asBinder() {
            return null;
        }

        @Override // com.uievolution.microserver.IMSSErrorObserver
        public void error(int i, String str) throws RemoteException {
        }
    }

    /* loaded from: classes.dex */
    public static abstract class Stub extends Binder implements IMSSErrorObserver {

        /* JADX INFO: Access modifiers changed from: private */
        /* loaded from: classes.dex */
        public static class a implements IMSSErrorObserver {
            public static IMSSErrorObserver b;
            private IBinder a;

            a(IBinder iBinder) {
                this.a = iBinder;
            }

            @Override // android.os.IInterface
            public IBinder asBinder() {
                return this.a;
            }

            @Override // com.uievolution.microserver.IMSSErrorObserver
            public void error(int i, String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.uievolution.microserver.IMSSErrorObserver");
                    obtain.writeInt(i);
                    obtain.writeString(str);
                    if (!this.a.transact(1, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().error(i, str);
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
            attachInterface(this, "com.uievolution.microserver.IMSSErrorObserver");
        }

        public static IMSSErrorObserver asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.uievolution.microserver.IMSSErrorObserver");
            if (queryLocalInterface != null && (queryLocalInterface instanceof IMSSErrorObserver)) {
                return (IMSSErrorObserver) queryLocalInterface;
            }
            return new a(iBinder);
        }

        public static IMSSErrorObserver getDefaultImpl() {
            return a.b;
        }

        public static boolean setDefaultImpl(IMSSErrorObserver iMSSErrorObserver) {
            if (a.b != null || iMSSErrorObserver == null) {
                return false;
            }
            a.b = iMSSErrorObserver;
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
                parcel2.writeString("com.uievolution.microserver.IMSSErrorObserver");
                return true;
            }
            parcel.enforceInterface("com.uievolution.microserver.IMSSErrorObserver");
            error(parcel.readInt(), parcel.readString());
            parcel2.writeNoException();
            return true;
        }
    }

    void error(int i, String str) throws RemoteException;
}
