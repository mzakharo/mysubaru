package jp.chef_station.chef_station.server.bean.request;

/* loaded from: classes.dex */
public class LicenseDetailRequestBean extends DefaultRequestBean {
    private String item_id;
    private String pid;
    private String type;
    private String user_id;

    public String getType() {
        return this.type;
    }

    public void setType(String str) {
        this.type = str;
    }

    public String getUserId() {
        return this.user_id;
    }

    public void setUserId(String str) {
        this.user_id = str;
    }

    public String getPid() {
        return this.pid;
    }

    public void setPid(String str) {
        this.pid = str;
    }

    public String getItemId() {
        return this.item_id;
    }

    public void setItemId(String str) {
        this.item_id = str;
    }

    @Override // jp.chef_station.chef_station.server.bean.request.DefaultRequestBean
    public String toString() {
        return getClass().getSimpleName() + "\n| type=" + this.type + "\n| user_id=" + this.user_id + "\n| pid=" + this.pid + "\n| item_id=" + this.item_id + "\n| device_date=" + getDeviceDate() + '\n';
    }
}
