package ai.api.model;

import ai.api.util.ParametersConverter;
import ai.api.util.StringUtils;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.annotations.SerializedName;
import com.harman.services.maps.MapUtils;
import java.io.Serializable;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/* loaded from: classes.dex */
public class Result implements Serializable {
    private static final String DATE_FORMAT_ERROR_MESSAGE = "'%s' parameter has value '%s' and can't be parsed as a Date or Time";
    private static final long serialVersionUID = 1;

    @SerializedName("action")
    private String action;

    @SerializedName("actionIncomplete")
    private boolean actionIncomplete;

    @SerializedName("contexts")
    private List<AIOutputContext> contexts;

    @SerializedName("fulfillment")
    private Fulfillment fulfillment;

    @SerializedName("metadata")
    private Metadata metadata;

    @SerializedName(MapUtils.KEY_MAP_SUBSCRIPTION_PARAMETER)
    private HashMap<String, JsonElement> parameters;

    @SerializedName("resolvedQuery")
    private String resolvedQuery;

    @SerializedName("score")
    private float score;

    @SerializedName("source")
    private String source;

    public String getAction() {
        String str = this.action;
        return str == null ? "" : str;
    }

    public void setAction(String str) {
        this.action = str;
    }

    public float getScore() {
        return this.score;
    }

    public void setScore(float f) {
        this.score = f;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String str) {
        this.source = str;
    }

    public Metadata getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public HashMap<String, JsonElement> getParameters() {
        return this.parameters;
    }

    public String getStringParameter(String str) {
        return getStringParameter(str, "");
    }

    public String getStringParameter(String str, String str2) {
        return this.parameters.containsKey(str) ? this.parameters.get(str).getAsString() : str2;
    }

    public Date getDateParameter(String str) throws IllegalArgumentException {
        return getDateParameter(str, null);
    }

    public Date getDateParameter(String str, Date date) throws IllegalArgumentException {
        if (!this.parameters.containsKey(str)) {
            return date;
        }
        String asString = this.parameters.get(str).getAsString();
        if (StringUtils.isEmpty(asString)) {
            return date;
        }
        try {
            return ParametersConverter.parseDate(asString);
        } catch (ParseException e) {
            throw new IllegalArgumentException(String.format(DATE_FORMAT_ERROR_MESSAGE, str, asString), e);
        }
    }

    public Date getDateTimeParameter(String str) throws IllegalArgumentException {
        return getDateTimeParameter(str, null);
    }

    public Date getDateTimeParameter(String str, Date date) throws IllegalArgumentException {
        if (!this.parameters.containsKey(str)) {
            return date;
        }
        String asString = this.parameters.get(str).getAsString();
        if (StringUtils.isEmpty(asString)) {
            return date;
        }
        try {
            return ParametersConverter.parseDateTime(asString);
        } catch (ParseException e) {
            throw new IllegalArgumentException(String.format(DATE_FORMAT_ERROR_MESSAGE, str, asString), e);
        }
    }

    public Date getTimeParameter(String str) throws IllegalArgumentException {
        return getTimeParameter(str, null);
    }

    public Date getTimeParameter(String str, Date date) throws IllegalArgumentException {
        if (!this.parameters.containsKey(str)) {
            return date;
        }
        String asString = this.parameters.get(str).getAsString();
        if (StringUtils.isEmpty(asString)) {
            return date;
        }
        try {
            return ParametersConverter.parseTime(asString);
        } catch (ParseException e) {
            throw new IllegalArgumentException(String.format(DATE_FORMAT_ERROR_MESSAGE, str, asString), e);
        }
    }

    public int getIntParameter(String str) {
        return getIntParameter(str, 0);
    }

    public int getIntParameter(String str, int i) {
        if (!this.parameters.containsKey(str)) {
            return i;
        }
        String asString = this.parameters.get(str).getAsString();
        return StringUtils.isEmpty(asString) ? i : ParametersConverter.parseInteger(asString);
    }

    public float getFloatParameter(String str) {
        return getFloatParameter(str, 0.0f);
    }

    public float getFloatParameter(String str, float f) {
        if (!this.parameters.containsKey(str)) {
            return f;
        }
        String asString = this.parameters.get(str).getAsString();
        return StringUtils.isEmpty(asString) ? f : ParametersConverter.parseFloat(asString);
    }

    public JsonObject getComplexParameter(String str, JsonObject jsonObject) {
        JsonObject asJsonObject;
        return (!this.parameters.containsKey(str) || (asJsonObject = this.parameters.get(str).getAsJsonObject()) == null) ? jsonObject : asJsonObject;
    }

    public JsonObject getComplexParameter(String str) {
        return getComplexParameter(str, null);
    }

    public List<AIOutputContext> getContexts() {
        return this.contexts;
    }

    public AIOutputContext getContext(String str) {
        if (StringUtils.isEmpty(str)) {
            throw new IllegalArgumentException("name argument must be not empty");
        }
        List<AIOutputContext> list = this.contexts;
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

    public String getResolvedQuery() {
        return this.resolvedQuery;
    }

    public void setResolvedQuery(String str) {
        this.resolvedQuery = str;
    }

    public Fulfillment getFulfillment() {
        return this.fulfillment;
    }

    public void setFulfillment(Fulfillment fulfillment) {
        this.fulfillment = fulfillment;
    }

    public boolean isActionIncomplete() {
        return this.actionIncomplete;
    }

    public void setActionIncomplete(boolean z) {
        this.actionIncomplete = z;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void trimParameters() {
        if (this.parameters != null) {
            LinkedList linkedList = new LinkedList();
            for (String str : this.parameters.keySet()) {
                JsonElement jsonElement = this.parameters.get(str);
                if (jsonElement != null && jsonElement.isJsonPrimitive() && ((JsonPrimitive) jsonElement).isString() && StringUtils.isEmpty(jsonElement.getAsString())) {
                    linkedList.add(str);
                }
            }
            Iterator it = linkedList.iterator();
            while (it.hasNext()) {
                this.parameters.remove((String) it.next());
            }
        }
    }

    public String toString() {
        return String.format("Result {action='%s', resolvedQuery='%s'}", this.action, this.resolvedQuery);
    }
}
