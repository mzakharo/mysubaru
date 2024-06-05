package solutions.eve.evelib.http;

/* loaded from: classes.dex */
public interface Cancelable {
    public static final Cancelable EMPTY = new Cancelable() { // from class: solutions.eve.evelib.http.Cancelable.1
        @Override // solutions.eve.evelib.http.Cancelable
        public void cancel() {
        }
    };

    void cancel();
}
