package jp.chef_station.chef_station.server.bean.request;

/* loaded from: classes.dex */
public class DefaultRequestBean {
    private String device_id = null;
    private String device_date = null;

    public String getDeviceDate() {
        return this.device_date;
    }

    public void setDeviceDate(String str) {
        this.device_date = str;
    }

    public String getDeviceId() {
        return this.device_id;
    }

    public void setDeviceId(String str) {
        this.device_id = str;
    }

    protected StringBuilder getPropertyString() {
        StringBuilder sb = new StringBuilder(getClass().getSimpleName());
        sb.append('\n');
        sb.append("| device_id=");
        sb.append(this.device_id);
        sb.append('\n');
        sb.append("| device_date=");
        sb.append(this.device_date);
        sb.append('\n');
        return sb;
    }

    public String toString() {
        return getPropertyString().toString();
    }
}
