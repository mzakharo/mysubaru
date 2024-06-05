package ai.api.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.Charset;

/* loaded from: classes.dex */
public class IOUtils {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    private static final int DEFAULT_BUFFER_SIZE = 4096;
    private static final String DEFAULT_CHARSET = "UTF-8";

    public static void writeAll(String str, OutputStream outputStream, Charset charset) throws IOException {
        writeAll(str, outputStream, charset.name());
    }

    public static void writeAll(String str, OutputStream outputStream, String str2) throws IOException {
        if (str == null || str.length() <= 0) {
            return;
        }
        outputStream.write(str.getBytes(str2));
    }

    public static void writeAll(String str, OutputStream outputStream) throws IOException {
        writeAll(str, outputStream, "UTF-8");
    }

    public static String readAll(InputStream inputStream, Charset charset) throws IOException {
        return readAll(inputStream, charset.name());
    }

    public static String readAll(InputStream inputStream, String str) throws IOException {
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream, str);
        try {
            return readAll(inputStreamReader);
        } catch (Throwable th) {
            try {
                throw th;
            } finally {
                try {
                    inputStreamReader.close();
                } catch (Throwable unused) {
                }
            }
        }
    }

    public static String readAll(InputStream inputStream) throws IOException {
        return readAll(inputStream, "UTF-8");
    }

    public static String readAll(InputStreamReader inputStreamReader) throws IOException {
        StringWriter stringWriter = new StringWriter();
        copy(inputStreamReader, stringWriter);
        return stringWriter.toString();
    }

    private static long copy(Reader reader, Writer writer) throws IOException {
        return copy(reader, writer, new char[4096]);
    }

    private static long copy(Reader reader, Writer writer, char[] cArr) throws IOException {
        long j = 0;
        int read = reader.read(cArr);
        while (read > 0) {
            writer.write(cArr, 0, read);
            j += read;
            read = reader.read(cArr);
        }
        return j;
    }
}
