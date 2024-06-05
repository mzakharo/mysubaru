package solutions.eve.evelib.utils;

import android.content.Context;
import android.os.Environment;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/* loaded from: classes.dex */
public class FileLoggingTree {
    private static final String TAG = "FileLoggingTree";
    private Context context;

    public FileLoggingTree(Context context) {
        this.context = context;
    }

    protected void log(int i, String str, String str2, Throwable th) {
        try {
            File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/EVELibraryDeliveryLogs");
            if (!file.exists()) {
                file.mkdirs();
            }
            String format = new SimpleDateFormat("dd-MM-yyyy", Locale.getDefault()).format(new Date());
            String format2 = new SimpleDateFormat("E MMM dd yyyy 'at' hh:mm:ss:SSS aaa", Locale.getDefault()).format(new Date());
            File file2 = new File(file + File.separator + (format + ".html"));
            file2.createNewFile();
            if (file2.exists()) {
                FileOutputStream fileOutputStream = new FileOutputStream(file2, true);
                fileOutputStream.write(("<p style=\"background:lightgray;\"><strong style=\"background:lightblue;\">&nbsp&nbsp" + format2 + " :&nbsp&nbsp</strong>&nbsp&nbsp" + str2 + "</p>").getBytes());
                fileOutputStream.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "Error while logging into file : " + e);
        }
    }
}
