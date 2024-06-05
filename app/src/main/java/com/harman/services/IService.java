package com.harman.services;

import android.content.Context;
import org.json.JSONObject;

import java.io.IOException;

/* loaded from: classes.dex */
public interface IService {
    void checkForAutoUpdates();

    void connectedAccessory(JSONObject jSONObject);

    void disConnectedAccessory(JSONObject jSONObject);

    void initHACServiceCallback(IHACServiceCallback iHACServiceCallback);

    void initResponseCallBack(IResponseDataCallback iResponseDataCallback);

    void initService(Context context);

    void processGenericCommand(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback);

    byte[] processGenericCommand(byte[] bArr, int i);

    void processGenericNotification(String str, int i);

    void readDataFromFile(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback);

    byte[] readDataFromFile(byte[] bArr, int i);

    void sendAsyncRequest(Object obj, String str, IOnQueryResponseCallback iOnQueryResponseCallback);

    Object sendRequest(Object obj, String str);

    void writeDataIntoFile(byte[] bArr, int i, IResponseDataCallback iResponseDataCallback);

    byte[] writeDataIntoFile(byte[] bArr, int i) throws IOException;
}
