package jp.chef_station.chef_station.server;

//import com.clarion.smartaccess.inappbilling.chef_station.ServerRequest;
import jp.chef_station.chef_station.ChefStationConst;
import jp.chef_station.chef_station.server.bean.request.LicenseDetailRequestBean;
import jp.chef_station.chef_station.server.bean.responce.LicenseDetailResponseBean;

/* loaded from: classes.dex */
public class LicenseDetailServerRequestTask extends AbstractPortalServerRequestTask<LicenseDetailRequestBean, Object, LicenseDetailResponseBean> {
    /* JADX INFO: Access modifiers changed from: protected */
    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask, jp.chef_station.chef_station.fw.server.AbstractHttpAccessTask
    public final LicenseDetailResponseBean createNewResult() {
        return new LicenseDetailResponseBean();
    }

    @Override // jp.chef_station.chef_station.fw.server.AbstractServerRequestTask
    protected final String getMethodUrl() {
        return "127.0.0.1";
    }
}
