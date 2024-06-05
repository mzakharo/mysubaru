package com.uievolution.microserver.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/* loaded from: classes.dex */
public class PropertiesConfiguration {
    private final Properties a = new Properties();

    public boolean getBoolean(String str, boolean z) {
        String property = this.a.getProperty(str);
        return property == null ? z : Boolean.parseBoolean(property);
    }

    public int getInt(String str, int i) {
        String property = this.a.getProperty(str);
        if (property == null) {
            return i;
        }
        try {
            return Integer.parseInt(property);
        } catch (NumberFormatException unused) {
            return i;
        }
    }

    public String getString(String str) {
        return this.a.getProperty(str);
    }

    public void load(InputStream inputStream) throws IOException {
        this.a.load(inputStream);
    }

    public String getString(String str, String str2) {
        return this.a.getProperty(str, str2);
    }
}
