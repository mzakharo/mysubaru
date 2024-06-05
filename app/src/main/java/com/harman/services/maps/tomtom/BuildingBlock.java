package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class BuildingBlock {
    private int m_id;
    private UpdateRegion m_updateRegion;

    BuildingBlock(UpdateRegion updateRegion, int i) {
        this.m_updateRegion = updateRegion;
        this.m_id = i;
    }

    UpdateRegion getUpdateRegion() {
        return this.m_updateRegion;
    }

    public int getId() {
        return this.m_id;
    }

    boolean operatorEquals(BuildingBlock buildingBlock) {
        return this.m_updateRegion == buildingBlock.m_updateRegion && this.m_id == buildingBlock.m_id;
    }

    boolean operatorLessThanLessThan(BuildingBlock buildingBlock) {
        return this.m_updateRegion.operatorEquals(buildingBlock.m_updateRegion) ? this.m_id < buildingBlock.m_id : this.m_updateRegion.operatorLessThan(buildingBlock.m_updateRegion);
    }
}
