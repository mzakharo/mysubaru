package jp.chef_station.chef_station.fw.server;

import java.util.ArrayList;

/* loaded from: classes.dex */
public class TaskManager<Clazz> {
    private static final ArrayList<AbstractHttpAccessTask<?, ?, ?>> tasks = new ArrayList<>();

    public Clazz createTask(Class<?> cls) {
        try {
            return (Clazz) cls.newInstance();
        } catch (ClassCastException e) {
            e.printStackTrace();
            return null;
        } catch (IllegalAccessException e2) {
            e2.printStackTrace();
            return null;
        } catch (InstantiationException e3) {
            e3.printStackTrace();
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static void start(AbstractHttpAccessTask<?, ?, ?> abstractHttpAccessTask) {
        ArrayList<AbstractHttpAccessTask<?, ?, ?>> arrayList = tasks;
        synchronized (arrayList) {
            arrayList.add(abstractHttpAccessTask);
        }
    }

    static void stop(AbstractHttpAccessTask<?, ?, ?> abstractHttpAccessTask) {
        ArrayList<AbstractHttpAccessTask<?, ?, ?>> arrayList = tasks;
        synchronized (arrayList) {
            if (!abstractHttpAccessTask.isCancelled()) {
                abstractHttpAccessTask.cancel(false);
            }
            arrayList.remove(abstractHttpAccessTask);
        }
    }

    public static void stop() {
        ArrayList<AbstractHttpAccessTask<?, ?, ?>> arrayList = tasks;
        synchronized (arrayList) {
            for (int size = arrayList.size() - 1; size >= 0; size--) {
                stop(tasks.get(size));
            }
        }
    }

    public static void stop(Class<?> cls) {
        ArrayList<AbstractHttpAccessTask<?, ?, ?>> arrayList = tasks;
        synchronized (arrayList) {
            for (int size = arrayList.size() - 1; size >= 0; size--) {
                ArrayList<AbstractHttpAccessTask<?, ?, ?>> arrayList2 = tasks;
                if (cls.isInstance(arrayList2.get(size))) {
                    stop(arrayList2.get(size));
                }
            }
        }
    }
}
