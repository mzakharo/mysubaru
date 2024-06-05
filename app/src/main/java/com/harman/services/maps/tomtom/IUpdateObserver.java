package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public interface IUpdateObserver {
    void onBuildingBlockFinished(BuildingBlock buildingBlock, int i, int i2);

    void onBuildingBlockStarted(BuildingBlock buildingBlock, int i, int i2);

    void onUpdateProgress(int i);

    void onUpdateRegionFinished(UpdateRegion updateRegion);

    void onUpdateRegionFinished(UpdateRegion updateRegion, int i, int i2);

    void onUpdateRegionStarted(UpdateRegion updateRegion, int i, int i2);
}
