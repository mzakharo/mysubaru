package com.uievolution.microserver;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/* loaded from: classes.dex */
public abstract class AbstractWorker<V> implements Future<V>, Runnable {
    private static final Executor c;
    private static Executor d;
    private boolean a;
    private final FutureTask<V> b = new cd(new b());

    /* loaded from: classes.dex */
    static class a implements Executor {
        a() {
        }

        @Override // java.util.concurrent.Executor
        public void execute(Runnable runnable) {
            new Thread(runnable).start();
        }
    }

    /* loaded from: classes.dex */
    class b implements Callable<V> {
        b() {
        }

        @Override // java.util.concurrent.Callable
        public V call() throws Exception {
            return (V) AbstractWorker.this.construct();
        }
    }

    /* loaded from: classes.dex */
    class cd extends FutureTask<V> {
        cd(AbstractWorker<V>.b callable) {
            super((Callable<V>) callable);
        }

        @Override // java.util.concurrent.FutureTask
        protected void done() {
            AbstractWorker.this.finished();
        }
    }

    static {
        a aVar = new a();
        c = aVar;
        d = aVar;
    }

    public static synchronized void setExecutor(Executor executor) {
        synchronized (AbstractWorker.class) {
            d = executor;
        }
    }

    @Override // java.util.concurrent.Future
    public boolean cancel(boolean z) {
        return this.b.cancel(z);
    }

    protected abstract V construct() throws Exception;

    /* JADX INFO: Access modifiers changed from: protected */
    public void finished() {
    }

    @Override // java.util.concurrent.Future
    public V get() throws InterruptedException, ExecutionException {
        return this.b.get();
    }

    public synchronized Executor getExecutor() {
        return d;
    }

    protected abstract void invokeLater(Runnable runnable);

    @Override // java.util.concurrent.Future
    public boolean isCancelled() {
        return this.b.isCancelled();
    }

    @Override // java.util.concurrent.Future
    public boolean isDone() {
        return this.b.isDone();
    }

    @Override // java.lang.Runnable
    public void run() {
        this.b.run();
    }

    public synchronized void start() {
        if (!this.a) {
            d.execute(this);
            this.a = true;
        }
    }

    @Override // java.util.concurrent.Future
    public V get(long j, TimeUnit timeUnit) throws InterruptedException, ExecutionException, TimeoutException {
        return this.b.get(j, timeUnit);
    }
}
