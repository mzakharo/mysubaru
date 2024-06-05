package com.uievolution.systemlogger;

import android.content.Context;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Process;
import android.util.Log;
import com.uievolution.systemlogger.internal.AesEnc;
import com.uievolution.systemlogger.internal.RsaEnc;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.Locale;
import java.util.Queue;

/* loaded from: classes.dex */
public class FileLogger implements Logger {
    static final String n = "Logger";
    static final byte[] o = {117, 105, 101, 108};
    static final byte[] p = {0, 0, 0, 3};
    static final String[] q = {"0", "1", "V", "D", "I", "W", "E", "A"};
    private static final SimpleDateFormat r = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US);
    private final int a;
    private final String b;
    private final String c;
    private final int d;
    private final int e;
    private boolean f;
    private final boolean g;
    private BufferedOutputStream h;
    private AesEnc i;
    private File j;
    private Handler k;
    private int l;
    private final Queue<File> m;

    /* loaded from: classes.dex */
    public static class Builder {
        private int a = 2;
        private String b = "ms";
        private String c = "log";
        private int d = 10;
        private int e = 1048576;
        private String f = "uielog";
        private boolean g = false;
        private boolean h = false;

        public Builder buffering(boolean z) {
            this.h = z;
            return this;
        }

        public FileLogger build(Context context) {
            return new FileLogger(context, this, null);
        }

        public Builder encrypt(boolean z) {
            this.g = z;
            return this;
        }

        public Builder ext(String str) {
            this.c = str;
            return this;
        }

        public Builder logdir(String str) {
            this.f = str;
            return this;
        }

        public Builder maxAge(int i) {
            this.d = i;
            return this;
        }

        public Builder maxSize(int i) {
            this.e = i;
            return this;
        }

        public Builder minPriority(int i) {
            this.a = i;
            return this;
        }

        public Builder prefix(String str) {
            this.b = str;
            return this;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class a implements FilenameFilter {
        a() {
        }

        @Override // java.io.FilenameFilter
        public boolean accept(File file, String str) {
            return str.startsWith(FileLogger.this.b) && str.endsWith(FileLogger.this.c);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class b implements Comparator<File> {
        b(FileLogger fileLogger) {
        }

        @Override // java.util.Comparator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public int compare(File file, File file2) {
            return file.getName().compareTo(file2.getName());
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* loaded from: classes.dex */
    public class c implements Runnable {
        final /* synthetic */ String a;
        final /* synthetic */ String b;
        final /* synthetic */ Throwable c;

        c(String str, String str2, Throwable th) {
            this.a = str;
            this.b = str2;
            this.c = th;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (FileLogger.this.h == null) {
                return;
            }
            if (this.a != null) {
                FileLogger.this.a(this.b + this.a + "\n");
            }
            Throwable th = this.c;
            if (th != null) {
                if (th.getMessage() != null) {
                    FileLogger.this.a(this.b + this.c.getMessage() + "\n");
                }
                String stackTraceString = Log.getStackTraceString(this.c);
                FileLogger.this.a(this.b + stackTraceString + "\n");
            }
            if (FileLogger.this.l > FileLogger.this.e) {
                FileLogger.this.b();
            }
        }
    }

    /* synthetic */ FileLogger(Context context, Builder builder, a aVar) {
        this(context, builder);
    }

    public File getLogdir() {
        return this.j;
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2) {
        println(4, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void println(int i, String str, String str2, Throwable th) {
        if (i < this.a) {
            return;
        }
        this.k.post(new c(str2, a(i, str), th));
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2) {
        println(2, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2) {
        println(5, str, str2, null);
    }

    private FileLogger(Context context, Builder builder) {
        this.m = new LinkedList();
        this.a = builder.a;
        this.b = builder.b + "_";
        this.c = "." + builder.c;
        this.d = builder.d;
        this.e = builder.e;
        this.f = builder.g;
        this.g = builder.h;
        HandlerThread handlerThread = new HandlerThread("FileLoggerThread");
        handlerThread.start();
        this.k = new Handler(handlerThread.getLooper());
        a(context, builder.f);
        b();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void b() {
        File file;
        try {
            BufferedOutputStream bufferedOutputStream = this.h;
            if (bufferedOutputStream != null) {
                bufferedOutputStream.close();
            }
            if (this.d > 0 && this.m.size() >= this.d) {
                this.m.remove().delete();
            }
            String format = new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(new Date());
            File file2 = new File(this.j, this.b + format + this.c);
            if (file2.exists()) {
                int i = 2;
                do {
                    file = new File(this.j, this.b + format + "_" + i + this.c);
                    i++;
                } while (file.exists());
                file2 = file;
            }
            this.l = 0;
            this.h = new BufferedOutputStream(new FileOutputStream(file2));
            this.m.add(file2);
            byte[] bArr = null;
            if (this.f) {
                try {
                    bArr = a();
                } catch (Exception e) {
                    Log.w(n, e);
                }
            }
            if (bArr != null) {
                this.h.write(o);
                this.h.write(p);
                this.h.write(bArr);
                this.h.flush();
            }
        } catch (IOException e2) {
            Log.w(n, e2);
        }
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2) {
        println(3, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2) {
        println(6, str, str2, null);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void i(String str, String str2, Throwable th) {
        println(4, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void v(String str, String str2, Throwable th) {
        println(2, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, String str2, Throwable th) {
        println(5, str, str2, th);
    }

    private void a(Context context, String str) {
        File[] listFiles;
        this.j = new File(context.getExternalFilesDir(null), str);
        Log.d(n, "logging dir: " + this.j);
        this.j.mkdirs();
        if (this.d <= 0 || (listFiles = this.j.listFiles(new a())) == null) {
            return;
        }
        Arrays.sort(listFiles, new b(this));
        this.m.addAll(Arrays.asList(listFiles));
    }

    @Override // com.uievolution.systemlogger.Logger
    public void d(String str, String str2, Throwable th) {
        println(3, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, String str2, Throwable th) {
        println(6, str, str2, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void w(String str, Throwable th) {
        println(5, str, null, th);
    }

    @Override // com.uievolution.systemlogger.Logger
    public void e(String str, Throwable th) {
        println(6, str, null, th);
    }

    private byte[] a() throws GeneralSecurityException {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bArr = new byte[16];
        secureRandom.nextBytes(bArr);
        byte[] bArr2 = new byte[16];
        secureRandom.nextBytes(bArr2);
        this.i = new AesEnc(bArr, bArr2);
        RsaEnc rsaEnc = new RsaEnc();
        byte[] bArr3 = new byte[32];
        System.arraycopy(bArr, 0, bArr3, 0, 16);
        System.arraycopy(bArr2, 0, bArr3, 16, 16);
        return rsaEnc.doFinal(bArr3);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void a(String str) {
        try {
            byte[] bytes = str.getBytes();
            AesEnc aesEnc = this.i;
            if (aesEnc != null) {
                bytes = aesEnc.update(bytes);
            }
            synchronized (this) {
                this.h.write(bytes);
                if (!this.g) {
                    this.h.flush();
                }
            }
            this.l += bytes.length;
        } catch (IOException e) {
            Log.w(n, e);
        }
    }

    private String a(int i, String str) {
        return r.format(new Date()) + " : " + Process.myPid() + "/" + Process.myTid() + " : " + q[i] + "/" + str + " : ";
    }
}
