package solutions.eve.evelib.helper;

import java.util.HashMap;

/* loaded from: classes.dex */
public class Creator {
    protected String name;
    protected HashMap<String, String> publisher;

    public Creator(String str) {
        HashMap<String, String> hashMap = new HashMap<>();
        this.publisher = hashMap;
        hashMap.put("log", str);
    }
}
