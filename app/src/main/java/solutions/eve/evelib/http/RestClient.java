package solutions.eve.evelib.http;

import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class RestClient {
    private HttpURLConnection connection;
    private OutputStream outputStream;
    private HashMap<String, String> params = new HashMap<>();
    private URL url;

    /* loaded from: classes.dex */
    public enum Method {
        POST,
        PUT,
        DELETE,
        GET
    }

    public RestClient(String str) throws IOException {
        URL url = new URL(str);
        this.url = url;
        this.connection = (HttpURLConnection) url.openConnection();
    }

    public int get() throws IOException {
        return send();
    }

    public int post(String str) throws IOException {
        this.connection.setDoInput(true);
        this.connection.setRequestMethod(Method.POST.toString());
        this.connection.setDoOutput(true);
        this.outputStream = this.connection.getOutputStream();
        sendData(str);
        return send();
    }

    public int post() throws IOException {
        this.connection.setDoInput(true);
        this.connection.setRequestMethod(Method.POST.toString());
        this.connection.setDoOutput(true);
        this.outputStream = this.connection.getOutputStream();
        return send();
    }

    public int put(String str) throws IOException {
        this.connection.setDoInput(true);
        this.connection.setRequestMethod(Method.PUT.toString());
        this.connection.setDoOutput(true);
        this.outputStream = this.connection.getOutputStream();
        sendData(str);
        return send();
    }

    public int put() throws IOException {
        this.connection.setDoInput(true);
        this.connection.setRequestMethod(Method.PUT.toString());
        this.connection.setDoOutput(true);
        this.outputStream = this.connection.getOutputStream();
        return send();
    }

    public RestClient addHeader(String str, String str2) {
        this.connection.setRequestProperty(str, str2);
        return this;
    }

    public RestClient addParameter(String str, String str2) {
        this.params.put(str, str2);
        return this;
    }

    public JSONObject getJSONObjectResponse() throws JSONException, IOException {
        return new JSONObject(getStringResponse());
    }

    public JSONArray getJSONArrayResponse() throws JSONException, IOException {
        return new JSONArray(getStringResponse());
    }

    public String getStringResponse() throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(this.connection.getInputStream()));
        StringBuilder sb = new StringBuilder();
        while (true) {
            String readLine = bufferedReader.readLine();
            if (readLine == null) {
                return sb.toString();
            }
            sb.append(readLine + "\n");
        }
    }

    public byte[] getBytesResponse() throws IOException {
        byte[] bArr = new byte[8192];
        InputStream inputStream = this.connection.getInputStream();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        while (true) {
            int read = inputStream.read(bArr);
            if (read >= 0) {
                byteArrayOutputStream.write(bArr, 0, read);
            } else {
                return byteArrayOutputStream.toByteArray();
            }
        }
    }

    public void close() {
        HttpURLConnection httpURLConnection = this.connection;
        if (httpURLConnection != null) {
            httpURLConnection.disconnect();
        }
    }

    private int send() throws IOException {
        if (!this.params.isEmpty()) {
            sendData();
        }
        return this.connection.getResponseCode();
    }

    private void sendData() throws IOException {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : this.params.entrySet()) {
            StringBuilder sb2 = new StringBuilder();
            sb2.append(sb.length() > 0 ? Const.REQUEST_PARAM_SEPARATE_STR : "");
            sb2.append(entry.getKey());
            sb2.append(Const.REQUEST_KEY_VALUE_SEPARATE_STR);
            sb2.append(entry.getValue());
            sb.append(sb2.toString());
        }
        sendData(sb.toString());
    }

    private RestClient sendData(String str) throws IOException {
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(this.outputStream, "UTF-8"));
        bufferedWriter.write(str);
        bufferedWriter.close();
        return this;
    }
}
