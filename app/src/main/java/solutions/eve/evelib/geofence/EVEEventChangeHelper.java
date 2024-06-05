package solutions.eve.evelib.geofence;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/* loaded from: classes.dex */
public class EVEEventChangeHelper {
    private Set<EVEChangeNotifier> listeners = new HashSet();

    public void addListener(EVEChangeNotifier eVEChangeNotifier) {
        this.listeners.add(eVEChangeNotifier);
    }

    public void removeListener(EVEChangeNotifier eVEChangeNotifier) {
        this.listeners.remove(eVEChangeNotifier);
    }

    public void notifyListeners() {
        Iterator<EVEChangeNotifier> it = this.listeners.iterator();
        while (it.hasNext()) {
            it.next().notifyChange();
        }
    }
}
