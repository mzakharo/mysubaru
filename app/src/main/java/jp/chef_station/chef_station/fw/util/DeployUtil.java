package jp.chef_station.chef_station.fw.util;

import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import java.io.File;
import java.util.Iterator;
import java.util.LinkedList;

/* loaded from: classes.dex */
public class DeployUtil {
    private static LinkedList<Context> contexts = new LinkedList<>();
    private static int description = -1;
    private static Boolean enableLog;
    private static Boolean isDebuggable;

    public static void init(Context context) {
        if (contexts.size() == 0) {
            contexts.add(0, context);
            isDebuggable();
            enableLog();
            getDescription();
            LogUtil.init();
        }
        if (contexts.contains(context)) {
            return;
        }
        contexts.addFirst(context);
    }

    public static Context getContext() {
        return contexts.getFirst();
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r2v2, types: [android.content.Context, java.lang.Object] */
    public static <CAST extends Context> CAST getContext(Class<CAST> cls) {
        Iterator<Context> it = contexts.iterator();
        CAST cast = null;
        while (it.hasNext()) {
            Context next = it.next();
            if (cls.isInstance(next)) {
                cast = (CAST) next;
            }
        }
        return cast;
    }

    public static boolean enableLog() {
        if (enableLog == null) {
            enableLog = Boolean.valueOf(new File("/sdcard", ".enableLog").exists());
        }
        return enableLog.booleanValue();
    }

    public static boolean isDebuggable() {
        if (isDebuggable == null) {
            try {
                isDebuggable = Boolean.valueOf((getContext().getPackageManager().getApplicationInfo(getContext().getPackageName(), 0).flags & 2) == 2);
            } catch (PackageManager.NameNotFoundException unused) {
                isDebuggable = false;
            }
        }
        return isDebuggable.booleanValue();
    }

    public static int getDescription() {
        if (description == -1) {
            try {
                int parseInt = Integer.parseInt(getContext().getResources().getString(getContext().getPackageManager().getApplicationInfo(getContext().getPackageName(), 0).descriptionRes));
                description = parseInt;
                if (parseInt != 1 && parseInt != 2) {
                    description = 0;
                }
            } catch (PackageManager.NameNotFoundException unused) {
                description = 0;
            } catch (Resources.NotFoundException unused2) {
                description = 0;
            } catch (NumberFormatException unused3) {
                description = 0;
            }
        }
        return description;
    }

    public static <CAST extends Context> void removeContext(Context context) {
        LinkedList<Context> linkedList = contexts;
        if (linkedList != null) {
            linkedList.remove(context);
            LogUtil.v("DeployUtil", "context size:" + contexts.size());
        }
    }
}
