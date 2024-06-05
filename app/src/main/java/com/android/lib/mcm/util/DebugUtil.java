package com.android.lib.mcm.util;

import android.content.Context;
import android.util.Log;
import com.clarion.android.appmgr.stub.Stub;
/* loaded from: classes.dex */
public class DebugUtil {
    public static boolean checkDebug(Context context) {
        return Stub.AppMgrContextStub.getAppMgrVersionInfo(context).indexOf(McmConst.DEBUG_KEYWORD) != -1;
    }

    public static void log(Context context, String... strArr) {
        if (checkDebug(context)) {
            try {
                StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
                String className = stackTrace[3].getClassName();
                String methodName = stackTrace[3].getMethodName();
                int lineNumber = stackTrace[3].getLineNumber();
                StringBuffer stringBuffer = new StringBuffer();
                stringBuffer.append(methodName);
                stringBuffer.append(":[");
                stringBuffer.append(lineNumber);
                stringBuffer.append("]:");
                for (String str : strArr) {
                    stringBuffer.append(",");
                    stringBuffer.append(str);
                }
                Log.d(className, stringBuffer.toString());
            } catch (Exception unused) {
            }
        }
    }
}
