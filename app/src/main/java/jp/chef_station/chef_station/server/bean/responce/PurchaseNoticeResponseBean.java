package jp.chef_station.chef_station.server.bean.responce;

/* loaded from: classes.dex */
public class PurchaseNoticeResponseBean extends AbstractResponseBean {
    private String buyer_id;
    private String item_id;
    private String pid;
    private String product_id;
    private String purchase_date;
    private String start_date;
    private String type;

    public String getType() {
        return this.type;
    }

    public void setType(String str) {
        this.type = str;
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

    public String getStartDate() {
        return this.start_date;
    }

    public void setStartDate(String str) {
        this.start_date = str;
    }

    public String getItemId() {
        return this.item_id;
    }

    public void setItemId(String str) {
        this.item_id = str;
    }

    public String getProductId() {
        return this.product_id;
    }

    public void setProductId(String str) {
        this.product_id = str;
    }

    public String getPurchaseDate() {
        return this.purchase_date;
    }

    public void setPurchaseDate(String str) {
        this.purchase_date = str;
    }

    @Override // jp.chef_station.chef_station.server.bean.responce.AbstractResponseBean
    public boolean isValid() {
        return isValidPurchaseNotice();
    }

    @Override // jp.chef_station.chef_station.server.bean.responce.AbstractResponseBean
    public String toString() {
        return getClass().getSimpleName() + "\n| type=" + this.type + "\n| buyer_id=" + this.buyer_id + "\n| pid=" + this.pid + "\n| start_date=" + this.start_date + "\n| device_date=" + getDeviceDate() + "\n| item_id=" + this.item_id + "\n| product_id=" + this.product_id + "\n| portal_date=" + this.portal_date + "\n| purchase_date=" + this.purchase_date + "\n| error=" + getErrorForLog() + "\n| http_response=" + (this.error & AbstractResponseBean.ERROR_MASK) + '\n';
    }

    private boolean isValidPurchaseNotice() {
        String str = this.purchase_date;
        return str != null && str.length() == 14;
    }
}
