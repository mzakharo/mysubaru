package ai.api.model;

import ai.api.util.StringUtils;
import com.google.gson.JsonElement;
import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/* loaded from: classes.dex */
public class Fulfillment implements Serializable {
    private static final long serialVersionUID = 1;

    @SerializedName("contextOut")
    private List<AIOutputContext> contextOut;

    @SerializedName("data")
    private Map<String, JsonElement> data;

    @SerializedName("displayText")
    private String displayText;

    @SerializedName("followupEvent")
    private AIEvent followupEvent;

    @SerializedName("messages")
    private List<ResponseMessage> messages;

    @SerializedName("source")
    private String source;

    @SerializedName("speech")
    private String speech;

    public String getSpeech() {
        return this.speech;
    }

    public void setSpeech(String str) {
        this.speech = str;
    }

    public List<ResponseMessage> getMessages() {
        return this.messages;
    }

    public void setMessages(List<ResponseMessage> list) {
        this.messages = list;
    }

    public void setMessages(ResponseMessage... responseMessageArr) {
        setMessages(Arrays.asList(responseMessageArr));
    }

    @Deprecated
    public void getMessages(List<ResponseMessage> list) {
        setMessages(list);
    }

    public Map<String, JsonElement> getData() {
        return this.data;
    }

    public void setData(Map<String, JsonElement> map) {
        this.data = map;
    }

    public String getDisplayText() {
        return this.displayText;
    }

    public void setDisplayText(String str) {
        this.displayText = str;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String str) {
        this.source = str;
    }

    public List<AIOutputContext> getContextOut() {
        return this.contextOut;
    }

    public AIOutputContext getContext(String str) {
        if (StringUtils.isEmpty(str)) {
            throw new IllegalArgumentException("name argument must be not empty");
        }
        List<AIOutputContext> list = this.contextOut;
        if (list == null) {
            return null;
        }
        for (AIOutputContext aIOutputContext : list) {
            if (str.equalsIgnoreCase(aIOutputContext.getName())) {
                return aIOutputContext;
            }
        }
        return null;
    }

    public void setContextOut(List<AIOutputContext> list) {
        this.contextOut = list;
    }

    public void setContextOut(AIOutputContext... aIOutputContextArr) {
        setContextOut(Arrays.asList(aIOutputContextArr));
    }

    public AIEvent getFollowupEvent() {
        return this.followupEvent;
    }

    public void setFollowupEvent(AIEvent aIEvent) {
        this.followupEvent = aIEvent;
    }
}
