package com.android.lib.mcm.logviewer.service;

import android.content.Context;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import com.android.lib.mcm.logviewer.LogJSONUtil;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.regex.Pattern;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogStorageFileUtil {
    private static final int MAX_FILE = 10;
    private static final long MAX_FILE_SIZE = 10240000;
    private static String sAppName;
    private static File sDirName;
    private static int sFileNo;
    private Date sDate;
    private String sFileName = null;

    public LogStorageFileUtil(Context context) {
        this.sDate = null;
        this.sDate = new Date();
        Context applicationContext = context.getApplicationContext();
        sAppName = applicationContext.getApplicationInfo().loadLabel(applicationContext.getPackageManager()).toString();
    }

    public void createLogFile(JSONObject jSONObject) throws IOException {
        ArrayList<String> arrayList = new ArrayList();
        arrayList.addAll(LogJSONUtil.parseStorageJson(jSONObject));
        for (String str : arrayList) {
            writeStringFileToExternalStrage(str);
        }
    }

    public void addLogFile(JSONObject jSONObject) throws IOException {
        ArrayList<String> arrayList = new ArrayList();
        arrayList.addAll(LogJSONUtil.parseStorageJson(jSONObject));
        for (String str : arrayList) {
            writeStringFileToExternalStrage(str);
        }
    }

    private String createFileName() {
        String format = new SimpleDateFormat("yyyyMMDD_hhmmss_SSS").format(this.sDate);
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(sAppName);
        stringBuffer.append(format);
        stringBuffer.append("_");
        stringBuffer.append(String.valueOf(sFileNo));
        stringBuffer.append(".txt");
        return stringBuffer.toString();
    }

    private void checkFiles() {
        File[] listFiles = sDirName.listFiles();
        if (listFiles != null) {
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("^");
            stringBuffer.append(sAppName);
            Pattern compile = Pattern.compile(stringBuffer.toString());
            ArrayList arrayList = new ArrayList();
            int i = 0;
            for (int i2 = 0; i2 < listFiles.length; i2++) {
                if (compile.matcher(listFiles[i2].getName()).find()) {
                    i++;
                    String str = sAppName;
                    Log.d(str, "Files : " + listFiles[i2].toString());
                    arrayList.add(listFiles[i2]);
                }
            }
            if (i >= 10) {
                Collections.sort(arrayList);
                if (((File) arrayList.get(0)).delete()) {
                    String str2 = sAppName;
                    Log.d(str2, "delete file ->" + ((File) arrayList.get(0)).toString());
                    return;
                }
                String str3 = sAppName;
                Log.d(str3, "delete failur file ->" + ((File) arrayList.get(0)).toString());
            }
        }
    }

    private void writeStringFileToExternalStrage(String str) throws IOException {
        if (Build.VERSION.SDK_INT >= 19) {
            sDirName = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        } else {
            sDirName = Environment.getExternalStorageDirectory();
        }
        checkFiles();
        if (this.sFileName == null) {
            this.sFileName = createFileName();
        }
        File file = new File(sDirName, this.sFileName);
        if (file.exists()) {
            if (file.length() + str.getBytes("UTF-8").length > MAX_FILE_SIZE) {
                sFileNo++;
                this.sFileName = createFileName();
                file = new File(sDirName, this.sFileName);
                file.createNewFile();
            }
        } else {
            file.createNewFile();
        }
        Log.d(sAppName, "file : " + sDirName + " -> " + this.sFileName);
        try {
            FileWriter fileWriter = new FileWriter(file, true);
            fileWriter.write(str);
            fileWriter.write(HttpCatalogs.CRLF);
            fileWriter.close();
            Log.d(sAppName, "file:close");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
