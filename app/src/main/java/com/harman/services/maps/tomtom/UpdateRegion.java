package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class UpdateRegion {
    private int m_id;
    private Product m_product;

    public UpdateRegion(Product product, int i) {
        this.m_product = product;
        this.m_id = i;
    }

    final Product getProduct() {
        return this.m_product;
    }

    public int getId() {
        return this.m_id;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean operatorEquals(UpdateRegion updateRegion) {
        return this.m_product.operatorEquals(updateRegion.m_product) && this.m_id == updateRegion.m_id;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean operatorLessThan(UpdateRegion updateRegion) {
        return this.m_product.operatorEquals(updateRegion.m_product) ? this.m_id < updateRegion.m_id : this.m_product.operatorLessThan(updateRegion.m_product);
    }
}
