package jp.chef_station.chef_station.server;

import jp.chef_station.chef_station.ChefStationConst;
import jp.chef_station.chef_station.server.bean.request.PurchaseNoticeRequestBean;
import jp.chef_station.chef_station.server.bean.responce.PurchaseNoticeResponseBean;

/* loaded from: classes.dex */
public class PurchaseNoticeServerRequestTask extends AbstractPortalServerRequestTask<PurchaseNoticeRequestBean, Object, PurchaseNoticeResponseBean> {
    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask
    protected String getMethodUrl() {
        return ChefStationConst.MARKET_PF_URL_MARKET_PURCHASE;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask, jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    public PurchaseNoticeResponseBean createNewResult() {
        return new PurchaseNoticeResponseBean();
    }
}
