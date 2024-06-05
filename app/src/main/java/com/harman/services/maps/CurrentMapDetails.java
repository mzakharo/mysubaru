package com.harman.services.maps;

import java.util.List;

/* loaded from: classes.dex */
public class CurrentMapDetails {
    private int available_map_space;
    private String device_code;
    private List<NdsProductBean> nds_product;
    private List<NdsUpdatePreferenceBean> nds_update_preference;
    private String product_code;
    private int timestamp;
    private int used_map_space;

    public String getProduct_code() {
        return this.product_code;
    }

    public void setProduct_code(String str) {
        this.product_code = str;
    }

    public String getDevice_code() {
        return this.device_code;
    }

    public void setDevice_code(String str) {
        this.device_code = str;
    }

    public int getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(int i) {
        this.timestamp = i;
    }

    public int getUsed_map_space() {
        return this.used_map_space;
    }

    public void setUsed_map_space(int i) {
        this.used_map_space = i;
    }

    public int getAvailable_map_space() {
        return this.available_map_space;
    }

    public void setAvailable_map_space(int i) {
        this.available_map_space = i;
    }

    public List<NdsProductBean> getNds_product() {
        return this.nds_product;
    }

    public void setNds_product(List<NdsProductBean> list) {
        this.nds_product = list;
    }

    public List<NdsUpdatePreferenceBean> getNds_update_preference() {
        return this.nds_update_preference;
    }

    public void setNds_update_preference(List<NdsUpdatePreferenceBean> list) {
        this.nds_update_preference = list;
    }

    /* loaded from: classes.dex */
    public static class NdsProductBean {
        private int baseline_id;
        private int id;
        private String name;
        private List<NdsRegionBean> nds_region;
        private int size;
        private int supplier_id;
        private int version_id;

        public int getId() {
            return this.id;
        }

        public void setId(int i) {
            this.id = i;
        }

        public int getBaseline_id() {
            return this.baseline_id;
        }

        public void setBaseline_id(int i) {
            this.baseline_id = i;
        }

        public int getSupplier_id() {
            return this.supplier_id;
        }

        public void setSupplier_id(int i) {
            this.supplier_id = i;
        }

        public String getName() {
            return this.name;
        }

        public void setName(String str) {
            this.name = str;
        }

        public int getVersion_id() {
            return this.version_id;
        }

        public void setVersion_id(int i) {
            this.version_id = i;
        }

        public int getSize() {
            return this.size;
        }

        public void setSize(int i) {
            this.size = i;
        }

        public List<NdsRegionBean> getNds_region() {
            return this.nds_region;
        }

        public void setNds_region(List<NdsRegionBean> list) {
            this.nds_region = list;
        }

        /* loaded from: classes.dex */
        public static class NdsRegionBean {
            private int id;
            private String name;
            private int size;
            private int version_id;

            public int getId() {
                return this.id;
            }

            public void setId(int i) {
                this.id = i;
            }

            public String getName() {
                return this.name;
            }

            public void setName(String str) {
                this.name = str;
            }

            public int getVersion_id() {
                return this.version_id;
            }

            public void setVersion_id(int i) {
                this.version_id = i;
            }

            public int getSize() {
                return this.size;
            }

            public void setSize(int i) {
                this.size = i;
            }
        }
    }

    /* loaded from: classes.dex */
    public static class NdsUpdatePreferenceBean {
        private boolean auto_update;
        private int nds_region;

        public int getNds_region() {
            return this.nds_region;
        }

        public void setNds_region(int i) {
            this.nds_region = i;
        }

        public boolean isAuto_update() {
            return this.auto_update;
        }

        public void setAuto_update(boolean z) {
            this.auto_update = z;
        }
    }
}
