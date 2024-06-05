package com.harman.services.maps.tomtom.jni;

import com.harman.services.maps.tomtom.BuildingBlock;
import com.harman.services.maps.tomtom.IKeyProvider;

/* loaded from: classes.dex */
public class KeyProvider implements IKeyProvider {
    final String m_keystoreKey;
    final String m_keystorePath;

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public String getAesKey(int i) {
        return "";
    }

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public String getAesKey(BuildingBlock buildingBlock) {
        return "";
    }

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public int getKeystoreId() {
        return -1;
    }

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public String getKeystoreKey() {
        return "";
    }

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public String getKeystorePath() {
        return "";
    }

    @Override // com.harman.services.maps.tomtom.IKeyProvider
    public String getRsaPublicKey() {
        return "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0QNDL1MKuYkMFSALnws8snsUTvmqklAAzRlqp3oDK79CyJQ1eNB5E8J3Ss1uXcrKdL08Lcvq4SoqTVDqneuDs0P9USbl7Cbq24bIL44G4n3mw53kCLHC1AdnuLXcx24ZwmXz52sqfda+RJMgipLcOl2FNnhlxKQtJXQNuUlOPjckXYQ0foc3uepGWDa77xzgtmQo08QXX0fjovITD8qa6hHUbFy8t/BjAYiHFDC5U1hcXZC/vLBrIRVYIf9MRmcknQRQ1n+C5nXgCn7GfDtZJ+4Z+3h+jq0yq1Co1nMPIC/Gb/z0ZWubVHjoQptTaSVNWdsb/FrPmy64LOhKHhYXlQIDAQAB";
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public KeyProvider(String str, String str2) {
        this.m_keystorePath = str;
        this.m_keystoreKey = str2;
    }
}
