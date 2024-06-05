package ai.api.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/* loaded from: classes.dex */
public final class ParametersConverter {
    public static final String PROTOCOL_DATE_FORMAT = "yyyy-MM-dd";
    private static final DateFormat DATE_FORMAT = new SimpleDateFormat(PROTOCOL_DATE_FORMAT, Locale.US);
    public static final String PROTOCOL_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
    private static final DateFormat DATE_TIME_FORMAT = new SimpleDateFormat(PROTOCOL_DATE_TIME_FORMAT, Locale.US);
    public static final String PROTOCOL_TIME_FORMAT = "HH:mm:ss";
    private static final DateFormat TIME_FORMAT = new SimpleDateFormat(PROTOCOL_TIME_FORMAT, Locale.US);

    private ParametersConverter() {
    }

    public static Date parseDateTime(String str) throws ParseException {
        if (str == null) {
            throw new IllegalArgumentException("Parameter must not be null");
        }
        return DATE_TIME_FORMAT.parse(str);
    }

    public static Date parseDate(String str) throws ParseException {
        if (str == null) {
            throw new IllegalArgumentException("Parameter must not be null");
        }
        return DATE_FORMAT.parse(str);
    }

    public static Date parseTime(String str) throws ParseException {
        if (str == null) {
            throw new IllegalArgumentException("Parameter must not be null");
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(TIME_FORMAT.parse(str));
        Calendar calendar2 = Calendar.getInstance();
        calendar2.set(11, calendar.get(11));
        calendar2.set(12, calendar.get(12));
        calendar2.set(13, calendar.get(13));
        return calendar2.getTime();
    }

    public static PartialDate parsePartialDate(String str) throws ParseException {
        if (str == null) {
            throw new IllegalArgumentException("Parameter must not be empty");
        }
        if (str.length() == 0) {
            throw new ParseException("Parameter must not be empty", 0);
        }
        if (str.contains("u")) {
            String[] split = str.split("-");
            if (split.length != 3) {
                throw new ParseException(String.format("Partial date must have 3 parts, but have %s: %s", Integer.valueOf(split.length), str), 0);
            }
            Integer parsePart = parsePart(split[0]);
            Integer parsePart2 = parsePart(split[1]);
            Integer parsePart3 = parsePart(split[2]);
            PartialDate partialDate = new PartialDate();
            partialDate.set(1, parsePart);
            partialDate.set(2, parsePart2);
            partialDate.set(5, parsePart3);
            return partialDate;
        }
        return new PartialDate(DATE_FORMAT.parse(str));
    }

    public static int parseInteger(String str) throws NumberFormatException {
        return Integer.parseInt(str);
    }

    public static float parseFloat(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Parameter must not be empty");
        }
        return Float.parseFloat(str);
    }

    private static Integer parsePart(String str) {
        if (str == null) {
            throw new IllegalArgumentException("part");
        }
        if (str.indexOf(117) >= 0) {
            return PartialDate.UNSPECIFIED_VALUE;
        }
        return Integer.valueOf(Integer.parseInt(str));
    }
}
