package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public interface IKeyProvider {
    String getAesKey(int i);

    String getAesKey(BuildingBlock buildingBlock);

    int getKeystoreId();

    String getKeystoreKey();

    String getKeystorePath();

    String getRsaPublicKey();
}
