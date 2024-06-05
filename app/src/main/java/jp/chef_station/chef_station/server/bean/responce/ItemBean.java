package jp.chef_station.chef_station.server.bean.responce;

import java.util.HashMap;
import java.util.Map;

/* loaded from: classes.dex */
public class ItemBean {
    private HashMap<String, String> instnce = new HashMap<>();

    public void put(String str, String str2) {
        this.instnce.put(str, str2);
    }

    public String get(String str) {
        return this.instnce.get(str);
    }

    private StringBuilder getPropertyString() {
        StringBuilder sb = new StringBuilder();
        sb.delete(0, sb.length()).append('{');
        for (String str : this.instnce.keySet()) {
            sb.append(str);
            sb.append('=');
            sb.append(this.instnce.get(str));
            sb.append(", ");
        }
        if (sb.length() > 2) {
            sb.delete(sb.length() - 2, sb.length());
        }
        sb.append('}');
        return sb;
    }

    public String toString() {
        return getPropertyString().toString();
    }

    public Map<String, String> getMap() {
        return this.instnce;
    }

    public int getAsInteger(String str) throws NumberFormatException {
        return Integer.parseInt(this.instnce.get(str));
    }

    public long getAsLong(String str) throws NumberFormatException {
        return Long.parseLong(this.instnce.get(str));
    }

    public short getAsShort(String str) throws NumberFormatException {
        return Short.parseShort(this.instnce.get(str));
    }

    public boolean getAsBoolean(String str) {
        String str2 = this.instnce.get(str);
        if (str2.equalsIgnoreCase("Y")) {
            return true;
        }
        if (str2.equalsIgnoreCase("N")) {
            return false;
        }
        throw new RuntimeException();
    }
}
