package com.android.lib.mcm.kvswrapper;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;
/* loaded from: classes.dex */
public interface IKvsWrapperService extends IInterface {

    /* loaded from: classes.dex */
    public static class Default implements IKvsWrapperService {
        @Override // android.os.IInterface
        public IBinder asBinder() {
            return null;
        }

        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public boolean deleteData(String str) throws RemoteException {
            return false;
        }

        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public byte[] getData(String str) throws RemoteException {
            return null;
        }

        @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
        public boolean saveData(byte[] bArr, String str) throws RemoteException {
            return false;
        }
    }

    boolean deleteData(String str) throws RemoteException;

    byte[] getData(String str) throws RemoteException;

    boolean saveData(byte[] bArr, String str) throws RemoteException;

    /* loaded from: classes.dex */
    public static abstract class Stub extends Binder implements IKvsWrapperService {
        private static final String DESCRIPTOR = "com.android.lib.mcm.kvswrapper.IKvsWrapperService";
        static final int TRANSACTION_deleteData = 2;
        static final int TRANSACTION_getData = 3;
        static final int TRANSACTION_saveData = 1;

        @Override // android.os.IInterface
        public IBinder asBinder() {
            return this;
        }

        public Stub() {
            attachInterface(this, DESCRIPTOR);
        }

        public static IKvsWrapperService asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface(DESCRIPTOR);
            if (queryLocalInterface != null && (queryLocalInterface instanceof IKvsWrapperService)) {
                return (IKvsWrapperService) queryLocalInterface;
            }
            return new Proxy(iBinder);
        }

        @Override // android.os.Binder
        public boolean onTransact(int i, Parcel parcel, Parcel parcel2, int i2) throws RemoteException {
            if (i == 1) {
                parcel.enforceInterface(DESCRIPTOR);
                boolean saveData = saveData(parcel.createByteArray(), parcel.readString());
                parcel2.writeNoException();
                parcel2.writeInt(saveData ? 1 : 0);
                return true;
            } else if (i == 2) {
                parcel.enforceInterface(DESCRIPTOR);
                boolean deleteData = deleteData(parcel.readString());
                parcel2.writeNoException();
                parcel2.writeInt(deleteData ? 1 : 0);
                return true;
            } else if (i != 3) {
                if (i == 1598968902) {
                    parcel2.writeString(DESCRIPTOR);
                    return true;
                }
                return super.onTransact(i, parcel, parcel2, i2);
            } else {
                parcel.enforceInterface(DESCRIPTOR);
                byte[] data = getData(parcel.readString());
                parcel2.writeNoException();
                parcel2.writeByteArray(data);
                return true;
            }
        }

        /* JADX INFO: Access modifiers changed from: private */
        /* loaded from: classes.dex */
        public static class Proxy implements IKvsWrapperService {
            public static IKvsWrapperService sDefaultImpl;
            private IBinder mRemote;

            public String getInterfaceDescriptor() {
                return Stub.DESCRIPTOR;
            }

            Proxy(IBinder iBinder) {
                this.mRemote = iBinder;
            }

            @Override // android.os.IInterface
            public IBinder asBinder() {
                return this.mRemote;
            }

            @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
            public boolean saveData(byte[] bArr, String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeByteArray(bArr);
                    obtain.writeString(str);
                    if (!this.mRemote.transact(1, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().saveData(bArr, str);
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
            public boolean deleteData(String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeString(str);
                    if (!this.mRemote.transact(2, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().deleteData(str);
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.kvswrapper.IKvsWrapperService
            public byte[] getData(String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeString(str);
                    if (!this.mRemote.transact(3, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getData(str);
                    }
                    obtain2.readException();
                    return obtain2.createByteArray();
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }
        }

        public static boolean setDefaultImpl(IKvsWrapperService iKvsWrapperService) {
            if (Proxy.sDefaultImpl != null || iKvsWrapperService == null) {
                return false;
            }
            Proxy.sDefaultImpl = iKvsWrapperService;
            return true;
        }

        public static IKvsWrapperService getDefaultImpl() {
            return Proxy.sDefaultImpl;
        }
    }
}
