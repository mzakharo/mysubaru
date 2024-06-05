package com.android.lib.mcm.send_location;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;

import java.io.UnsupportedEncodingException;

/* loaded from: classes.dex */
public interface ISendLocationService extends IInterface {

    /* loaded from: classes.dex */
    public static class Default implements ISendLocationService {
        @Override // android.os.IInterface
        public IBinder asBinder() {
            return null;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationInfoValueContainer getInfoValue() throws RemoteException {
            return null;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskRegistInfo[] getTask(String str) throws RemoteException {
            return null;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException {
            return null;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public boolean removeTask(String str) throws RemoteException {
            return false;
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public void settingDefaultPollingInterval(long j) throws RemoteException {
        }

        @Override // com.android.lib.mcm.send_location.ISendLocationService
        public SendLocationTaskUpdateResponse updateTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException {
            return null;
        }
    }

    SendLocationInfoValueContainer getInfoValue() throws RemoteException;

    SendLocationTaskRegistInfo[] getTask(String str) throws RemoteException, UnsupportedEncodingException;

    SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException, UnsupportedEncodingException;

    boolean removeTask(String str) throws RemoteException, UnsupportedEncodingException;

    void settingDefaultPollingInterval(long j) throws RemoteException, UnsupportedEncodingException;

    SendLocationTaskUpdateResponse updateTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException, UnsupportedEncodingException;

    /* loaded from: classes.dex */
    public static abstract class Stub extends Binder implements ISendLocationService {
        private static final String DESCRIPTOR = "com.android.lib.mcm.send_location.ISendLocationService";
        static final int TRANSACTION_getInfoValue = 5;
        static final int TRANSACTION_getTask = 4;
        static final int TRANSACTION_registTask = 1;
        static final int TRANSACTION_removeTask = 2;
        static final int TRANSACTION_settingDefaultPollingInterval = 6;
        static final int TRANSACTION_updateTask = 3;

        @Override // android.os.IInterface
        public IBinder asBinder() {
            return this;
        }

        public Stub() {
            attachInterface(this, DESCRIPTOR);
        }

        public static ISendLocationService asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface(DESCRIPTOR);
            if (queryLocalInterface != null && (queryLocalInterface instanceof ISendLocationService)) {
                return (ISendLocationService) queryLocalInterface;
            }
            return new Proxy(iBinder);
        }

        @Override // android.os.Binder
        public boolean onTransact(int i, Parcel parcel, Parcel parcel2, int i2) throws RemoteException {
            if (i == 1598968902) {
                parcel2.writeString(DESCRIPTOR);
                return true;
            }
            switch (i) {
                case 1:
                    parcel.enforceInterface(DESCRIPTOR);
                    SendLocationTaskRegistResponse registTask = null;
                    try {
                        registTask = registTask(parcel.readInt() != 0 ? SendLocationTaskRegistInfo.CREATOR.createFromParcel(parcel) : null);
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                    parcel2.writeNoException();
                    if (registTask != null) {
                        parcel2.writeInt(1);
                        registTask.writeToParcel(parcel2, 1);
                    } else {
                        parcel2.writeInt(0);
                    }
                    return true;
                case 2:
                    parcel.enforceInterface(DESCRIPTOR);
                    boolean removeTask = false;
                    try {
                        removeTask = removeTask(parcel.readString());
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                    parcel2.writeNoException();
                    parcel2.writeInt(removeTask ? 1 : 0);
                    return true;
                case 3:
                    parcel.enforceInterface(DESCRIPTOR);
                    SendLocationTaskUpdateResponse updateTask = null;
                    try {
                        updateTask = updateTask(parcel.readString(), parcel.readInt() != 0 ? SendLocationTaskRegistInfo.CREATOR.createFromParcel(parcel) : null);
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                    parcel2.writeNoException();
                    if (updateTask != null) {
                        parcel2.writeInt(1);
                        updateTask.writeToParcel(parcel2, 1);
                    } else {
                        parcel2.writeInt(0);
                    }
                    return true;
                case 4:
                    parcel.enforceInterface(DESCRIPTOR);
                    SendLocationTaskRegistInfo[] task = new SendLocationTaskRegistInfo[0];
                    try {
                        task = getTask(parcel.readString());
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                    parcel2.writeNoException();
                    parcel2.writeTypedArray(task, 1);
                    return true;
                case 5:
                    parcel.enforceInterface(DESCRIPTOR);
                    SendLocationInfoValueContainer infoValue = getInfoValue();
                    parcel2.writeNoException();
                    if (infoValue != null) {
                        parcel2.writeInt(1);
                        infoValue.writeToParcel(parcel2, 1);
                    } else {
                        parcel2.writeInt(0);
                    }
                    return true;
                case 6:
                    parcel.enforceInterface(DESCRIPTOR);
                    try {
                        settingDefaultPollingInterval(parcel.readLong());
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                    parcel2.writeNoException();
                    return true;
                default:
                    return super.onTransact(i, parcel, parcel2, i2);
            }
        }

        /* JADX INFO: Access modifiers changed from: private */
        /* loaded from: classes.dex */
        public static class Proxy implements ISendLocationService {
            public static ISendLocationService sDefaultImpl;
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

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public SendLocationTaskRegistResponse registTask(SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    if (sendLocationTaskRegistInfo != null) {
                        obtain.writeInt(1);
                        sendLocationTaskRegistInfo.writeToParcel(obtain, 0);
                    } else {
                        obtain.writeInt(0);
                    }
                    if (!this.mRemote.transact(1, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().registTask(sendLocationTaskRegistInfo);
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0 ? SendLocationTaskRegistResponse.CREATOR.createFromParcel(obtain2) : null;
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public boolean removeTask(String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeString(str);
                    if (!this.mRemote.transact(2, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().removeTask(str);
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0;
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public SendLocationTaskUpdateResponse updateTask(String str, SendLocationTaskRegistInfo sendLocationTaskRegistInfo) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeString(str);
                    if (sendLocationTaskRegistInfo != null) {
                        obtain.writeInt(1);
                        sendLocationTaskRegistInfo.writeToParcel(obtain, 0);
                    } else {
                        obtain.writeInt(0);
                    }
                    if (!this.mRemote.transact(3, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().updateTask(str, sendLocationTaskRegistInfo);
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0 ? SendLocationTaskUpdateResponse.CREATOR.createFromParcel(obtain2) : null;
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public SendLocationTaskRegistInfo[] getTask(String str) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeString(str);
                    if (!this.mRemote.transact(4, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getTask(str);
                    }
                    obtain2.readException();
                    return (SendLocationTaskRegistInfo[]) obtain2.createTypedArray(SendLocationTaskRegistInfo.CREATOR);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public SendLocationInfoValueContainer getInfoValue() throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    if (!this.mRemote.transact(5, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        return Stub.getDefaultImpl().getInfoValue();
                    }
                    obtain2.readException();
                    return obtain2.readInt() != 0 ? SendLocationInfoValueContainer.CREATOR.createFromParcel(obtain2) : null;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }

            @Override // com.android.lib.mcm.send_location.ISendLocationService
            public void settingDefaultPollingInterval(long j) throws RemoteException {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken(Stub.DESCRIPTOR);
                    obtain.writeLong(j);
                    if (!this.mRemote.transact(6, obtain, obtain2, 0) && Stub.getDefaultImpl() != null) {
                        Stub.getDefaultImpl().settingDefaultPollingInterval(j);
                    } else {
                        obtain2.readException();
                    }
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                } finally {
                    obtain2.recycle();
                    obtain.recycle();
                }
            }
        }

        public static boolean setDefaultImpl(ISendLocationService iSendLocationService) {
            if (Proxy.sDefaultImpl != null || iSendLocationService == null) {
                return false;
            }
            Proxy.sDefaultImpl = iSendLocationService;
            return true;
        }

        public static ISendLocationService getDefaultImpl() {
            return Proxy.sDefaultImpl;
        }
    }
}
