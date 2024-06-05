package ai.api.model;

import ai.api.model.GoogleAssistantResponseMessages;
import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* loaded from: classes.dex */
public abstract class ResponseMessage {
    static final /* synthetic */ boolean $assertionsDisabled = false;

    @Expose
    private final Platform platform;

    @Expose
    private final MessageType type;

    protected ResponseMessage(MessageType messageType) {
        this(messageType, null);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    public ResponseMessage(MessageType messageType, Platform platform) {
        this.type = messageType;
        this.platform = platform == null ? Platform.DEFAULT : platform;
    }

    /* loaded from: classes.dex */
    public enum MessageType {
        SPEECH(0, "message", ResponseSpeech.class),
        CARD(1, "card", ResponseCard.class),
        QUICK_REPLY(2, "quick_reply", ResponseQuickReply.class),
        IMAGE(3, "image", ResponseImage.class),
        PAYLOAD(4, "custom_payload", ResponsePayload.class),
        CHAT_BUBBLE(5, "simple_response", GoogleAssistantResponseMessages.ResponseChatBubble.class),
        BASIC_CARD(6, "basic_card", GoogleAssistantResponseMessages.ResponseBasicCard.class),
        LIST_CARD(7, "list_card", GoogleAssistantResponseMessages.ResponseListCard.class),
        SUGGESTION_CHIPS(8, "suggestion_chips", GoogleAssistantResponseMessages.ResponseSuggestionChips.class),
        CAROUSEL_CARD(9, "carousel_card", GoogleAssistantResponseMessages.ResponseCarouselCard.class),
        LINK_OUT_CHIP(10, "link_out_chip", GoogleAssistantResponseMessages.ResponseLinkOutChip.class);

        static final /* synthetic */ boolean $assertionsDisabled = false;
        private static Map<Integer, MessageType> typeByCode = new HashMap();
        private static Map<String, MessageType> typeByName = new HashMap();
        private final int code;
        private final String name;
        private final Type type;

        static {
            for (MessageType messageType : values()) {
                typeByCode.put(Integer.valueOf(messageType.code), messageType);
                typeByName.put(messageType.name.toLowerCase(), messageType);
            }
        }

        MessageType(int i, String str, Type type) {
            this.code = i;
            this.name = str;
            this.type = type;
        }

        public int getCode() {
            return this.code;
        }

        public String getName() {
            return this.name;
        }

        public Type getType() {
            return this.type;
        }

        public static MessageType fromCode(int i) {
            return typeByCode.get(Integer.valueOf(i));
        }

        public static MessageType fromName(String str) {
            return typeByName.get(str != null ? str.toLowerCase() : null);
        }
    }

    /* loaded from: classes.dex */
    public enum Platform {
        DEFAULT(null),
        GOOGLE("google"),
        FACEBOOK("facebook"),
        SLACK("slack"),
        TELEGRAM("telegram"),
        KIK("kik"),
        VIBER("viber"),
        SKYPE("skype"),
        LINE("line");

        private static Map<String, Platform> platformByName = new HashMap();
        private final String name;

        static {
            for (Platform platform : values()) {
                String name = platform.getName();
                platformByName.put(name != null ? name.toLowerCase() : null, platform);
            }
        }

        Platform(String str) {
            this.name = str;
        }

        public String getName() {
            return this.name;
        }

        public static Platform fromName(String str) {
            return platformByName.get(str != null ? str.toLowerCase() : null);
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseSpeech extends ResponseMessage {

        @Expose
        public List<String> speech;

        public ResponseSpeech() {
            super(MessageType.SPEECH);
        }

        public List<String> getSpeech() {
            return this.speech;
        }

        public void setSpeech(List<String> list) {
            this.speech = list;
        }

        public void setSpeech(String... strArr) {
            setSpeech(Arrays.asList(strArr));
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseCard extends ResponseMessage {

        @Expose
        private List<Button> buttons;

        @Expose
        private String imageUrl;

        @Expose
        private String subtitle;

        @Expose
        private String title;

        public ResponseCard() {
            super(MessageType.CARD);
        }

        public String getTitle() {
            return this.title;
        }

        public void setTitle(String str) {
            this.title = str;
        }

        public String getSubtitle() {
            return this.subtitle;
        }

        public void setSubtitle(String str) {
            this.subtitle = str;
        }

        public String getImageUrl() {
            return this.imageUrl;
        }

        public void setImageUrl(String str) {
            this.imageUrl = str;
        }

        public List<Button> getButtons() {
            return this.buttons;
        }

        public void setButtons(List<Button> list) {
            this.buttons = list;
        }

        public void setButtons(Button... buttonArr) {
            setButtons(Arrays.asList(buttonArr));
        }

        /* loaded from: classes.dex */
        public static class Button {

            @Expose
            private String postback;

            @Expose
            private String text;

            public Button(String str, String str2) {
                this.text = str;
                this.postback = str2;
            }

            public void setText(String str) {
                this.text = str;
            }

            public String getText() {
                return this.text;
            }

            public void setPostback(String str) {
                this.postback = str;
            }

            public String getPostback() {
                return this.postback;
            }
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseQuickReply extends ResponseMessage {

        @Expose
        private List<String> replies;

        @Expose
        private String title;

        public ResponseQuickReply() {
            super(MessageType.QUICK_REPLY);
        }

        public List<String> getReplies() {
            return this.replies;
        }

        public void setReplies(List<String> list) {
            this.replies = list;
        }

        public void setReplies(String... strArr) {
            setReplies(Arrays.asList(strArr));
        }

        public void setTitle(String str) {
            this.title = str;
        }

        public String getTitle() {
            return this.title;
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseImage extends ResponseMessage {

        @Expose
        private String imageUrl;

        public ResponseImage() {
            super(MessageType.IMAGE);
        }

        public String getImageUrl() {
            return this.imageUrl;
        }

        public void setImageUrl(String str) {
            this.imageUrl = str;
        }
    }

    /* loaded from: classes.dex */
    public static class ResponsePayload extends ResponseMessage {

        @Expose
        private JsonObject payload;

        public ResponsePayload() {
            super(MessageType.PAYLOAD);
        }

        public JsonObject getPayload() {
            return this.payload;
        }

        public void setPayload(JsonObject jsonObject) {
            this.payload = jsonObject;
        }
    }
}
