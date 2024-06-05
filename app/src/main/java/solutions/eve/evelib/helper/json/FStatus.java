package solutions.eve.evelib.helper.json;

/* loaded from: classes.dex */
public class FStatus {
    String msg;
    boolean status;

    public FStatus(boolean z) {
        this.status = z;
    }

    public FStatus(boolean z, String str) {
        this.status = z;
        this.msg = str;
    }
}
