package ai.api.util;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/* loaded from: classes.dex */
public class PartialDate {
    private static final String UNSPECIFIED_DATE = "uu";
    private static final String UNSPECIFIED_HOUR = "uu";
    private static final String UNSPECIFIED_MINUTE = "uu";
    private static final String UNSPECIFIED_MONTH = "uu";
    public static final Integer UNSPECIFIED_VALUE = null;
    private static final String UNSPECIFIED_YEAR = "uuuu";
    private final Calendar c;
    private final Set<Integer> unspecifiedFields;

    public PartialDate() {
        this.unspecifiedFields = new HashSet();
        this.c = Calendar.getInstance();
    }

    public PartialDate(Calendar calendar) {
        this.unspecifiedFields = new HashSet();
        this.c = calendar;
    }

    public PartialDate(Date date) {
        this();
        this.c.setTime(date);
    }

    public void set(int i, Integer num) {
        if (num != UNSPECIFIED_VALUE) {
            this.unspecifiedFields.remove(Integer.valueOf(i));
            this.c.set(i, num.intValue());
            return;
        }
        if (i == 1) {
            this.unspecifiedFields.add(1);
            return;
        }
        if (i == 2) {
            this.unspecifiedFields.add(2);
            return;
        }
        if (i >= 3 && i <= 8) {
            this.unspecifiedFields.add(5);
            return;
        }
        if (i >= 10 && i <= 11) {
            this.unspecifiedFields.add(11);
        } else if (i == 12) {
            this.unspecifiedFields.add(12);
        }
    }

    public Integer get(int i) {
        if (i == 1) {
            if (!this.unspecifiedFields.contains(1)) {
                return Integer.valueOf(this.c.get(i));
            }
            return UNSPECIFIED_VALUE;
        }
        if (i == 2) {
            if (!this.unspecifiedFields.contains(2)) {
                return Integer.valueOf(this.c.get(i));
            }
            return UNSPECIFIED_VALUE;
        }
        if (i >= 3 && i <= 8) {
            if (!this.unspecifiedFields.contains(5)) {
                return Integer.valueOf(this.c.get(i));
            }
            return UNSPECIFIED_VALUE;
        }
        if (i >= 10 && i <= 11) {
            if (!this.unspecifiedFields.contains(11)) {
                return Integer.valueOf(this.c.get(i));
            }
            return UNSPECIFIED_VALUE;
        }
        if (i == 12) {
            if (!this.unspecifiedFields.contains(12)) {
                return Integer.valueOf(this.c.get(12));
            }
            return UNSPECIFIED_VALUE;
        }
        return Integer.valueOf(this.c.get(i));
    }

    private String getFieldAsString(int i) {
        return i == 1 ? this.unspecifiedFields.contains(1) ? UNSPECIFIED_YEAR : String.format("%4d", Integer.valueOf(this.c.get(i))) : i == 2 ? this.unspecifiedFields.contains(2) ? "uu" : String.format("%02d", Integer.valueOf(this.c.get(i))) : (i < 3 || i > 8) ? (i < 10 || i > 11) ? i == 12 ? this.unspecifiedFields.contains(12) ? "uu" : String.format("%02d", Integer.valueOf(this.c.get(i))) : String.format("%s", Integer.valueOf(this.c.get(i))) : this.unspecifiedFields.contains(11) ? "uu" : String.format("%02d", Integer.valueOf(this.c.get(i))) : this.unspecifiedFields.contains(5) ? "uu" : String.format("%02d", Integer.valueOf(this.c.get(i)));
    }

    public String toString() {
        return String.format("%s-%s-%s", getFieldAsString(1), getFieldAsString(2), getFieldAsString(5));
    }
}
