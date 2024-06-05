package jp.chef_station.chef_station;

import jp.chef_station.chef_station.fw.server.ServerConfigFactory;
import jp.chef_station.chef_station.fw.util.DeployUtil;

/* loaded from: classes.dex */
public class ServerConfigImpl implements ServerConfigFactory.ServerConfig {
    public static final String MARKET_PF_URL_HOST_ROOT = "";

    @Override // jp.chef_station.chef_station.fw.server.ServerConfigFactory.ServerConfig
    public String getServerPath() {
        return "";
    }

    public ServerConfigImpl() {
        DeployUtil.getContext();
    }

    @Override // jp.chef_station.chef_station.fw.server.ServerConfigFactory.ServerConfig
    public String getServerHostAndPort() {
        return ChefStationConst.MARKET_PF_URL_HOST;
    }
}
