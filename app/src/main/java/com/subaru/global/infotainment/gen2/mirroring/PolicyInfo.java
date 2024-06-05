package com.subaru.global.infotainment.gen2.mirroring;

import java.io.File;
import java.io.Reader;
import java.util.List;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Path;
import org.simpleframework.xml.Root;
import org.simpleframework.xml.core.Persister;

/* JADX INFO: Access modifiers changed from: package-private */
@Root(name = "PolicyInfo")
/* loaded from: classes.dex */
public class PolicyInfo {

    @ElementList(inline = true, type = AppInfo.class)
    private List<AppInfo> mAppInfoList;

    @Element(name = "POLICY_VERSION")
    private PolicyVersion mPolicyVersion;

    @Element(name = "RETURN_CD")
    private String mReturnCD;

    PolicyInfo() {
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public List<AppInfo> getAppInfoList() {
        return this.mAppInfoList;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public String getReturnCd() {
        return this.mReturnCD;
    }

    @Root(name = "POLICY_VERSION")
    /* loaded from: classes.dex */
    static class PolicyVersion {

        @Element(name = "POLICY_DATE", required = false)
        private String mPolicyDate;

        @Element(name = "POLICY_NEXT_GET_DATE", required = false)
        private String mPolicyNextGetDate;

        PolicyVersion() {
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Root(name = "APP_INFO")
    /* loaded from: classes.dex */
    public static class AppInfo {

        @Element(name = "APP_HTML5_ID", required = false)
        private String mAppHtml5Id;

        @Element(name = "APP_HTML5_TYPE", required = false)
        private int mAppHtml5Type;

        @Element(name = "APP_ICON_DL_URL", required = false)
        private String mAppIconDlUrl;

        @Element(name = "APP_ID", required = false)
        private String mAppId;

        @Element(name = "APP_NAME", required = false)
        private AppName mAppName;

        @Element(name = "APP_TOP_URL", required = false)
        private String mAppTopUrl;

        @Element(name = "APP_VER", required = false)
        private String mAppVer;

        AppInfo() {
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public String getAppHtml5Id() {
            return this.mAppHtml5Id;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public AppName getAppName() {
            return this.mAppName;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public String getAppVer() {
            return this.mAppVer;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public String getAppTopUrl() {
            return this.mAppTopUrl;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public File getAppDir() {
            return new File(MirroringEngine.CONTENT_ROOT_DIR, this.mAppHtml5Id);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public String getAppIconDlUrl() {
            return this.mAppIconDlUrl;
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public boolean isValid() {
            return (this.mAppHtml5Id == null || this.mAppTopUrl == null || this.mAppIconDlUrl == null) ? false : true;
        }
    }

    @Root(name = "APP_NAME")
    /* loaded from: classes.dex */
    static class AppName {

        @Element(name = "EN", required = false)
        @Path("EN[1]")
        private String mENEEEEE;

        @Element(name = "JP", required = false)
        private String mJP;

        /* JADX INFO: Access modifiers changed from: package-private */
        public String getJP() {
            return "";
        }

        AppName() {
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static PolicyInfo parse(Reader reader) throws Exception {
        return (PolicyInfo) new Persister().read(PolicyInfo.class, reader, false);
    }

    static PolicyInfo parse(File file) throws Exception {
        return (PolicyInfo) new Persister().read(PolicyInfo.class, file, false);
    }
}
