package ai.api;

import ai.api.model.GoogleAssistantResponseMessages;
import ai.api.model.ResponseMessage;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Locale;

/* loaded from: classes.dex */
public class GsonFactory {
    private static final GsonFactory DEFAULT_FACTORY = new GsonFactory();
    private static final Gson PROTOCOL_GSON;
    private static final Gson SIMPLIFIED_GSON;

    static {
        GsonBuilder registerTypeAdapter = new GsonBuilder().setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).toPattern()).registerTypeAdapter(ResponseMessage.class, new ResponseItemAdapter()).registerTypeAdapter(ResponseMessage.MessageType.class, new ResponseMessageTypeAdapter()).registerTypeAdapter(ResponseMessage.Platform.class, new ResponseMessagePlatformAdapter());
        SIMPLIFIED_GSON = registerTypeAdapter.create();
        registerTypeAdapter.registerTypeAdapter(ResponseMessage.ResponseSpeech.class, new ResponseSpeechAdapter());
        registerTypeAdapter.registerTypeAdapter(GoogleAssistantResponseMessages.ResponseChatBubble.class, new ResponseChatBubbleAdapter());
        PROTOCOL_GSON = registerTypeAdapter.create();
    }

    public Gson getGson() {
        return PROTOCOL_GSON;
    }

    public static GsonFactory getDefaultFactory() {
        return DEFAULT_FACTORY;
    }

    /* loaded from: classes.dex */
    private static class ResponseMessagePlatformAdapter implements JsonDeserializer<ResponseMessage.Platform>, JsonSerializer<ResponseMessage.Platform> {
        private ResponseMessagePlatformAdapter() {
        }

        @Override // com.google.gson.JsonSerializer
        public JsonElement serialize(ResponseMessage.Platform platform, Type type, JsonSerializationContext jsonSerializationContext) {
            return jsonSerializationContext.serialize(platform.getName());
        }


        @Override
        public ResponseMessage.Platform deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            String asString = json.getAsString();
            if (asString == null) {
                return ResponseMessage.Platform.DEFAULT;
            }
            ResponseMessage.Platform fromName = ResponseMessage.Platform.fromName(asString);
            if (fromName != null) {
                return fromName;
            }
            throw new JsonParseException(String.format("Unexpected platform name: %s", asString));
        }
    }

    /* loaded from: classes.dex */
    private static class ResponseMessageTypeAdapter implements JsonDeserializer<ResponseMessage.MessageType>, JsonSerializer<ResponseMessage.MessageType> {
        private ResponseMessageTypeAdapter() {
        }

        @Override // com.google.gson.JsonSerializer
        public JsonElement serialize(ResponseMessage.MessageType messageType, Type type, JsonSerializationContext jsonSerializationContext) {
            return jsonSerializationContext.serialize(messageType.getCode() <= 4 ? Integer.valueOf(messageType.getCode()) : messageType.getName());
        }

        @Override
        public ResponseMessage.MessageType deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            ResponseMessage.MessageType fromName;
            JsonPrimitive asJsonPrimitive = json.getAsJsonPrimitive();
            if (asJsonPrimitive.isNumber()) {
                fromName = ResponseMessage.MessageType.fromCode(asJsonPrimitive.getAsInt());
            } else {
                fromName = ResponseMessage.MessageType.fromName(asJsonPrimitive.getAsString());
            }
            if (fromName != null) {
                return fromName;
            }
            throw new JsonParseException(String.format("Unexpected message type value: %s", asJsonPrimitive));
        }
    }

    /* loaded from: classes.dex */
    private static class ResponseItemAdapter implements JsonDeserializer<ResponseMessage>, JsonSerializer<ResponseMessage> {
        private ResponseItemAdapter() {
        }

        @Override // com.google.gson.JsonSerializer
        public JsonElement serialize(ResponseMessage responseMessage, Type type, JsonSerializationContext jsonSerializationContext) {
            return jsonSerializationContext.serialize(responseMessage, responseMessage.getClass());
        }

        @Override
        public ResponseMessage deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            return (ResponseMessage) context.deserialize(json, ((ResponseMessage.MessageType) context.deserialize(json.getAsJsonObject().get("type"), ResponseMessage.MessageType.class)).getType());
        }
    }

    /* loaded from: classes.dex */
    private static class ResponseSpeechAdapter implements JsonDeserializer<ResponseMessage>, JsonSerializer<ResponseMessage> {
        private ResponseSpeechAdapter() {
        }

        @Override // com.google.gson.JsonDeserializer
        /* renamed from: deserialize, reason: merged with bridge method [inline-methods] */
        public ResponseMessage deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = (JsonObject) jsonElement;
                JsonElement jsonElement2 = jsonObject.get("speech");
                if (jsonElement2.isJsonPrimitive()) {
                    JsonArray jsonArray = new JsonArray();
                    jsonArray.add(jsonElement2);
                    jsonObject.add("speech", jsonArray);
                }
            }
            return (ResponseMessage.ResponseSpeech) GsonFactory.SIMPLIFIED_GSON.fromJson(jsonElement, type);
        }

        @Override // com.google.gson.JsonSerializer
        public JsonElement serialize(ResponseMessage responseMessage, Type type, JsonSerializationContext jsonSerializationContext) {
            return GsonFactory.SIMPLIFIED_GSON.toJsonTree(responseMessage, ResponseMessage.class);
        }
    }

    /* loaded from: classes.dex */
    private static class ResponseChatBubbleAdapter implements JsonDeserializer<GoogleAssistantResponseMessages.ResponseChatBubble>, JsonSerializer<GoogleAssistantResponseMessages.ResponseChatBubble> {
        private ResponseChatBubbleAdapter() {
        }

        /* JADX WARN: Can't rename method to resolve collision */
        @Override // com.google.gson.JsonDeserializer
        /* renamed from: deserialize */
        public GoogleAssistantResponseMessages.ResponseChatBubble deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = (JsonObject) jsonElement;
                if (jsonObject.has("textToSpeech")) {
                    JsonArray asJsonArray = jsonObject.getAsJsonArray("items");
                    if (asJsonArray == null) {
                        asJsonArray = new JsonArray(1);
                        jsonObject.add("items", asJsonArray);
                    }
                    JsonObject jsonObject2 = new JsonObject();
                    jsonObject2.add("textToSpeech", jsonObject.get("textToSpeech"));
                    jsonObject2.add("ssml", jsonObject.get("ssml"));
                    jsonObject2.add("displayText", jsonObject.get("displayText"));
                    asJsonArray.add(jsonObject2);
                }
            }
            return (GoogleAssistantResponseMessages.ResponseChatBubble) GsonFactory.SIMPLIFIED_GSON.fromJson(jsonElement, type);
        }

        @Override // com.google.gson.JsonSerializer
        public JsonElement serialize(GoogleAssistantResponseMessages.ResponseChatBubble responseChatBubble, Type type, JsonSerializationContext jsonSerializationContext) {
            JsonObject jsonObject = (JsonObject) GsonFactory.SIMPLIFIED_GSON.toJsonTree(responseChatBubble, ResponseMessage.class);
            JsonArray asJsonArray = jsonObject.getAsJsonArray("items");
            if (asJsonArray != null && asJsonArray.size() == 1) {
                JsonObject jsonObject2 = (JsonObject) asJsonArray.get(0);
                jsonObject.add("textToSpeech", jsonObject2.get("textToSpeech"));
                jsonObject.add("ssml", jsonObject2.get("ssml"));
                jsonObject.add("displayText", jsonObject2.get("displayText"));
                jsonObject.remove("items");
            }
            return jsonObject;
        }
    }
}
