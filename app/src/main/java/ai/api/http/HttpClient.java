package ai.api.http;

import ai.api.util.IOUtils;
import com.uievolution.microserver.utils.HttpCatalogs;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* loaded from: classes.dex */
public class HttpClient {
    private static final int BUFFER_LENGTH = 4096;
    private static final int CHUNK_LENGTH = 2048;
    private static final Logger logger = LoggerFactory.getLogger((Class<?>) HttpClient.class);
    private final HttpURLConnection connection;
    private OutputStream os;
    private boolean writeSoundLog;
    private final String delimiter = "--";
    private final String boundary = "SwA" + Long.toString(System.currentTimeMillis()) + "SwA";

    public HttpClient(HttpURLConnection httpURLConnection) {
        if (httpURLConnection == null) {
            throw new IllegalArgumentException("Connection cannot be null");
        }
        this.connection = httpURLConnection;
    }

    public void connectForMultipart() throws IOException {
        this.connection.setRequestProperty(HttpCatalogs.HEADER_CONNECTION, "Keep-Alive");
        this.connection.setRequestProperty(HttpCatalogs.HEADER_CONTENT_TYPE, "multipart/form-data; boundary=" + this.boundary);
        this.connection.setChunkedStreamingMode(2048);
        this.connection.connect();
        this.os = this.connection.getOutputStream();
    }

    public void addFormPart(String str, String str2) throws IOException {
        this.os.write(("--" + this.boundary + HttpCatalogs.CRLF).getBytes());
        this.os.write("Content-Type: application/json\r\n".getBytes());
        this.os.write(("Content-Disposition: form-data; name=\"" + str + "\"\r\n").getBytes());
        this.os.write((HttpCatalogs.CRLF + str2 + HttpCatalogs.CRLF).getBytes());
    }

    public void addFilePart(String str, String str2, InputStream inputStream) throws IOException {
        FileOutputStream fileOutputStream;
        this.os.write(("--" + this.boundary + HttpCatalogs.CRLF).getBytes());
        this.os.write(("Content-Disposition: form-data; name=\"" + str + "\"; filename=\"" + str2 + "\"\r\n").getBytes());
        this.os.write("Content-Type: audio/wav\r\n".getBytes());
        this.os.write(HttpCatalogs.CRLF.getBytes());
        Logger logger2 = logger;
        logger2.debug("Sound write start");
        if (this.writeSoundLog) {
            File file = new File(System.getProperty("java.io.tmpdir"));
            if (!file.exists()) {
                file.mkdirs();
            }
            logger2.debug(file.getAbsolutePath());
            fileOutputStream = new FileOutputStream(new File(file, "log.wav"), false);
        } else {
            fileOutputStream = null;
        }
        byte[] bArr = new byte[4096];
        int read = inputStream.read(bArr, 0, 4096);
        while (read >= 0) {
            if (read > 0) {
                this.os.write(bArr, 0, read);
                if (this.writeSoundLog) {
                    fileOutputStream.write(bArr, 0, read);
                }
            }
            read = inputStream.read(bArr, 0, 4096);
        }
        if (this.writeSoundLog) {
            fileOutputStream.close();
        }
        logger.debug("Sound write finished");
        this.os.write(HttpCatalogs.CRLF.getBytes());
    }

    public void finishMultipart() throws IOException {
        this.os.write(("--" + this.boundary + "--" + HttpCatalogs.CRLF).getBytes());
        this.os.close();
    }

    public String getResponse() throws IOException {
        BufferedInputStream bufferedInputStream = new BufferedInputStream(this.connection.getInputStream());
        String readAll = IOUtils.readAll(bufferedInputStream);
        bufferedInputStream.close();
        return readAll;
    }

    public String getErrorString() {
        try {
            BufferedInputStream bufferedInputStream = new BufferedInputStream(this.connection.getErrorStream());
            String readAll = IOUtils.readAll(bufferedInputStream);
            bufferedInputStream.close();
            return readAll;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void setWriteSoundLog(boolean z) {
        this.writeSoundLog = z;
    }
}
