package jp.chef_station.chef_station.server.bean.request;

/* loaded from: classes.dex */
public class PurchaseNoticeRequestBean extends DefaultRequestBean {
    private String authtoken;
    private String buyer_id;
    private String currency;
    private String item_id;
    private String item_name;
    private String md5sum;
    private String pid;
    private String price;
    private String product_id;
    private String receipt;
    private String signature;
    private String start_date;
    private String type;

    public String getType() {
        return this.type;
    }

    public void setType(String str) {
        this.type = str;
    }

    public String getAuthtoken() {
        return this.authtoken;
    }

    public void setAuthtoken(String str) {
        this.authtoken = str;
    }

    public String getBuyerId() {
        return this.buyer_id;
    }

    public void setBuyerId(String str) {
        this.buyer_id = str;
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

    public String getItemName() {
        return this.item_name;
    }

    public void setItemName(String str) {
        this.item_name = str;
    }

    public String getCurrency() {
        return this.currency;
    }

    public void setCurrency(String str) {
        this.currency = str;
    }

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String str) {
        this.price = str;
    }

    public String getProductId() {
        return this.product_id;
    }

    public void setProductId(String str) {
        this.product_id = str;
    }

    public String getReceipt() {
        return this.receipt;
    }

    public void setReceipt(String str) {
        this.receipt = str;
    }

    public String getSignature() {
        return this.signature;
    }

    public void setSignature(String str) {
        this.signature = str;
    }

    public String getMd5sum() {
        return this.md5sum;
    }

    public void setMd5sum(String str) {
        this.md5sum = str;
    }

    public String getStartDate() {
        return this.start_date;
    }

    public void setStartDate(String str) {
        this.start_date = str;
    }

    @Override // jp.chef_station.chef_station.server.bean.request.DefaultRequestBean
    public String toString() {
        return getClass().getSimpleName() + "\n| type=" + this.type + "\n| authtoken=" + this.authtoken + "\n| buyer_id=" + this.buyer_id + "\n| pid=" + this.pid + "\n| item_id=" + this.item_id + "\n| product_id=" + this.product_id + "\n| receipt=" + this.receipt + "\n| signature=" + this.signature + "\n| md5sum=" + this.md5sum + "\n| item_name=" + this.item_name + "\n| currency=" + this.currency + "\n| price=" + this.price + "\n| start_date=" + this.start_date + "\n| device_date=" + getDeviceDate() + '\n';
    }
}
