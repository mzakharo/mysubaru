package com.uievolution.microserver.utils;

import android.os.Build;
import android.os.Process;
import android.util.Log;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.SecureRandom;
import java.security.SecureRandomSpi;
import java.security.Security;

/* loaded from: classes.dex */
public final class PRNGFixes {
    private static final byte[] a = d();

    /* loaded from: classes.dex */
    public static class LinuxPRNGSecureRandom extends SecureRandomSpi {
        private static final File b = new File("/dev/urandom");
        private static final Object c = new Object();
        private static DataInputStream d;
        private static OutputStream e;
        private boolean a;

        private DataInputStream a() {
            DataInputStream dataInputStream;
            synchronized (c) {
                if (d == null) {
                    try {
                        d = new DataInputStream(new FileInputStream(b));
                    } catch (IOException e2) {
                        throw new SecurityException("Failed to open " + b + " for reading", e2);
                    }
                }
                dataInputStream = d;
            }
            return dataInputStream;
        }

        private OutputStream b() throws IOException {
            OutputStream outputStream;
            synchronized (c) {
                if (e == null) {
                    e = new FileOutputStream(b);
                }
                outputStream = e;
            }
            return outputStream;
        }

        @Override // java.security.SecureRandomSpi
        protected byte[] engineGenerateSeed(int i) {
            byte[] bArr = new byte[i];
            engineNextBytes(bArr);
            return bArr;
        }

        @Override // java.security.SecureRandomSpi
        protected void engineNextBytes(byte[] bArr) {
            DataInputStream a;
            if (!this.a) {
                engineSetSeed(PRNGFixes.a());
            }
            try {
                synchronized (c) {
                    a = a();
                }
                synchronized (a) {
                    a.readFully(bArr);
                }
            } catch (IOException e2) {
                throw new SecurityException("Failed to read from " + b, e2);
            }
        }

        @Override // java.security.SecureRandomSpi
        protected void engineSetSeed(byte[] bArr) {
            OutputStream b2;
            try {
                try {
                    synchronized (c) {
                        b2 = b();
                    }
                    b2.write(bArr);
                    b2.flush();
                } catch (IOException unused) {
                    Log.w("PRNGFixes", "Failed to mix seed into " + b);
                }
            } finally {
                this.a = true;
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class a extends Provider {
        public a() {
            super("LinuxPRNG", 1.0d, "A Linux-specific random number provider that uses /dev/urandom");
            put("SecureRandom.SHA1PRNG", LinuxPRNGSecureRandom.class.getName());
            put("SecureRandom.SHA1PRNG ImplementedIn", "Software");
        }
    }

    private PRNGFixes() {
    }

    static /* synthetic */ byte[] a() {
        return c();
    }

    public static void apply() {
        b();
        f();
    }

    private static void b() throws SecurityException {
        int i = Build.VERSION.SDK_INT;
        if (i < 16 || i > 18) {
            return;
        }
        try {
            Class.forName("org.apache.harmony.xnet.provider.jsse.NativeCrypto").getMethod("RAND_seed", byte[].class).invoke(null, c());
            int intValue = ((Integer) Class.forName("org.apache.harmony.xnet.provider.jsse.NativeCrypto").getMethod("RAND_load_file", String.class, Long.TYPE).invoke(null, "/dev/urandom", 1024)).intValue();
            if (intValue == 1024) {
                return;
            }
            throw new IOException("Unexpected number of bytes read from Linux PRNG: " + intValue);
        } catch (Exception e) {
            throw new SecurityException("Failed to seed OpenSSL PRNG", e);
        }
    }

    private static byte[] c() {
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(byteArrayOutputStream);
            dataOutputStream.writeLong(System.currentTimeMillis());
            dataOutputStream.writeLong(System.nanoTime());
            dataOutputStream.writeInt(Process.myPid());
            dataOutputStream.writeInt(Process.myUid());
            dataOutputStream.write(a);
            dataOutputStream.close();
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            throw new SecurityException("Failed to generate seed", e);
        }
    }

    private static byte[] d() {
        StringBuilder sb = new StringBuilder();
        String str = Build.FINGERPRINT;
        if (str != null) {
            sb.append(str);
        }
        String e = e();
        if (e != null) {
            sb.append(e);
        }
        try {
            return sb.toString().getBytes("UTF-8");
        } catch (UnsupportedEncodingException unused) {
            throw new RuntimeException("UTF-8 encoding not supported");
        }
    }

    private static String e() {
        try {
            return (String) Build.class.getField("SERIAL").get(null);
        } catch (Exception unused) {
            return null;
        }
    }

    private static void f() throws SecurityException {
        if (Build.VERSION.SDK_INT > 18) {
            return;
        }
        Provider[] providers = Security.getProviders("SecureRandom.SHA1PRNG");
        if (providers == null || providers.length < 1 || !a.class.equals(providers[0].getClass())) {
            Security.insertProviderAt(new a(), 1);
        }
        SecureRandom secureRandom = new SecureRandom();
        if (a.class.equals(secureRandom.getProvider().getClass())) {
            try {
                SecureRandom secureRandom2 = SecureRandom.getInstance("SHA1PRNG");
                if (a.class.equals(secureRandom2.getProvider().getClass())) {
                    return;
                }
                throw new SecurityException("SecureRandom.getInstance(\"SHA1PRNG\") backed by wrong Provider: " + secureRandom2.getProvider().getClass());
            } catch (NoSuchAlgorithmException e) {
                throw new SecurityException("SHA1PRNG not available", e);
            }
        }
        throw new SecurityException("new SecureRandom() backed by wrong Provider: " + secureRandom.getProvider().getClass());
    }
}
