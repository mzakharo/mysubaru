package com.harman.services.maps.tomtom;

/* loaded from: classes.dex */
public class Product {
    private int m_baselineMapId;
    private int m_productId;
    private int m_supplierId;

    public Product(int i, int i2, int i3) {
        this.m_supplierId = i;
        this.m_baselineMapId = i2;
        this.m_productId = i3;
    }

    int getBaselineMapId() {
        return this.m_baselineMapId;
    }

    int getProductId() {
        return this.m_productId;
    }

    int getSupplierId() {
        return this.m_supplierId;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean operatorEquals(Product product) {
        return this.m_supplierId == product.m_supplierId && this.m_baselineMapId == product.m_baselineMapId && this.m_productId == product.m_productId;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public boolean operatorLessThan(Product product) {
        int i = this.m_supplierId;
        int i2 = product.m_supplierId;
        if (i != i2) {
            return i < i2;
        }
        int i3 = this.m_baselineMapId;
        int i4 = product.m_baselineMapId;
        return i3 != i4 ? i3 < i4 : this.m_productId < product.m_productId;
    }
}
