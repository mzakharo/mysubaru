package jp.chef_station.chef_station.server;

import java.util.ArrayList;
import jp.chef_station.chef_station.fw.server.AbstractServerRequestTask;
import jp.chef_station.chef_station.fw.util.BeanUtil;
import jp.chef_station.chef_station.server.bean.responce.ItemBean;
import org.xmlpull.v1.XmlPullParser;

/* loaded from: classes.dex */
public abstract class AbstractPortalServerRequestTask<Params, Progress, Result> extends AbstractServerRequestTask<Params, Progress, Result> {
    private static final String[] LIST_ELMENTS = {"target_app", "target_news", "target_category", "target_campaign", "target_purchase", "target_contract", "n_days", "packages"};
    private static final String[] ITEM_ELMENTS = {"app", "news", "category", "campaign", "purchase", "contract", "n_day"};
    protected ArrayList<ItemBean> tempList = null;
    protected ItemBean tempItem = null;

    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask
    protected void execStartElement(XmlPullParser xmlPullParser, Result result) {
        String name = xmlPullParser.getName();
        if (checkListElement(name)) {
            ArrayList<ItemBean> arrayList = new ArrayList<>();
            this.tempList = arrayList;
            putList(result, arrayList, name);
            setAttribute(xmlPullParser, result, "num");
            return;
        }
        if (checkItemElement(name)) {
            ItemBean itemBean = new ItemBean();
            this.tempItem = itemBean;
            ArrayList<ItemBean> arrayList2 = this.tempList;
            if (arrayList2 != null) {
                arrayList2.add(itemBean);
            } else {
                BeanUtil.setField(result, name, itemBean);
            }
        }
    }

    protected void putList(Result result, ArrayList<ItemBean> arrayList, String str) {
        BeanUtil.setField(result, str, arrayList);
    }

    protected void setAttribute(XmlPullParser xmlPullParser, Result result, String str) {
        String attributeValue = xmlPullParser.getAttributeValue("", str);
        if (attributeValue != null) {
            BeanUtil.setField(result, str, attributeValue);
        }
    }

    protected boolean checkListElement(String str) {
        for (String str2 : LIST_ELMENTS) {
            if (str2.equals(str)) {
                return true;
            }
        }
        return false;
    }

    private boolean checkItemElement(String str) {
        for (String str2 : ITEM_ELMENTS) {
            if (str2.equals(str)) {
                return true;
            }
        }
        return false;
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask
    protected boolean execText(Result result, String str, String str2) {
        if (this.tempItem == null || checkItemElement(str)) {
            return false;
        }
        this.tempItem.put(str, str2);
        return true;
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask
    protected void execEndElement(String str) {
        if (checkItemElement(str)) {
            this.tempItem = null;
        } else if (checkListElement(str)) {
            this.tempList = null;
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask, android.os.AsyncTask
    public void onPostExecute(Result result) {
        super.onPostExecute(result);
    }
}
