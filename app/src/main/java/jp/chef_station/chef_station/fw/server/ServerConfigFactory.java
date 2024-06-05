package jp.chef_station.chef_station.fw.server;

import jp.chef_station.chef_station.fw.util.DeployUtil;

/* loaded from: classes.dex */
public class ServerConfigFactory {

    /* loaded from: classes.dex */
    public interface ServerConfig {
        String getServerHostAndPort();

        String getServerPath();
    }

    public static ServerConfig createConfig() throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        DeployUtil.getContext();
        return (ServerConfig) Class.forName("jp.chef_station.chef_station.ServerConfigImpl").newInstance();
    }
}
