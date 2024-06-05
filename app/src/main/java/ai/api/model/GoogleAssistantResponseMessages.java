package ai.api.model;

import ai.api.model.ResponseMessage;
import java.util.List;

/* loaded from: classes.dex */
public abstract class GoogleAssistantResponseMessages extends ResponseMessage {
    protected GoogleAssistantResponseMessages(ResponseMessage.MessageType messageType) {
        super(messageType, ResponseMessage.Platform.GOOGLE);
    }

    /* loaded from: classes.dex */
    public static class CardImage {
        private String url;

        public final String getUrl() {
            return this.url;
        }

        public final void setUrl(String str) {
            this.url = str;
        }
    }

    /* loaded from: classes.dex */
    public static class OptionInfo {
        private String key;
        private List<String> synonyms;

        public final String getKey() {
            return this.key;
        }

        public final void setKey(String str) {
            this.key = str;
        }

        public final List<String> getSynonyms() {
            return this.synonyms;
        }

        public final void setSynonyms(List<String> list) {
            this.synonyms = list;
        }
    }

    /* loaded from: classes.dex */
    public static class CardItem {
        private String description;
        private CardImage image;
        private OptionInfo optionInfo;
        private String title;

        public final OptionInfo getOptionInfo() {
            return this.optionInfo;
        }

        public final void setOptionInfo(OptionInfo optionInfo) {
            this.optionInfo = optionInfo;
        }

        public final String getTitle() {
            return this.title;
        }

        public final void setTitle(String str) {
            this.title = str;
        }

        public final String getDescription() {
            return this.description;
        }

        public final void setDescription(String str) {
            this.description = str;
        }

        public final CardImage getImage() {
            return this.image;
        }

        public final void setImage(CardImage cardImage) {
            this.image = cardImage;
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseChatBubble extends GoogleAssistantResponseMessages {
        private Boolean customizeAudio;
        private List<Item> items;

        public ResponseChatBubble() {
            super(ResponseMessage.MessageType.CHAT_BUBBLE);
        }

        public final Boolean getCustomizeAudio() {
            return this.customizeAudio;
        }

        public final void setCustomizeAudio(Boolean bool) {
            this.customizeAudio = bool;
        }

        public final List<Item> getItems() {
            return this.items;
        }

        public final void setItems(List<Item> list) {
            this.items = list;
        }

        /* loaded from: classes.dex */
        public static class Item {
            private String displayText;
            private String ssml;
            private String textToSpeech;

            public final String getTextToSpeech() {
                return this.textToSpeech;
            }

            public final void setTextToSpeech(String str) {
                this.textToSpeech = str;
            }

            public final String getSsml() {
                return this.ssml;
            }

            public final void setSsml(String str) {
                this.ssml = str;
            }

            public final String getDisplayText() {
                return this.displayText;
            }

            public final void setDisplayText(String str) {
                this.displayText = str;
            }
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseBasicCard extends GoogleAssistantResponseMessages {
        private List<Button> buttons;
        private String formattedText;
        private CardImage image;
        private String subtitle;
        private String title;

        public ResponseBasicCard() {
            super(ResponseMessage.MessageType.BASIC_CARD);
        }

        public final String getTitle() {
            return this.title;
        }

        public final void setTitle(String str) {
            this.title = str;
        }

        public final String getSubtitle() {
            return this.subtitle;
        }

        public final void setSubtitle(String str) {
            this.subtitle = str;
        }

        public final String getFormattedText() {
            return this.formattedText;
        }

        public final void setFormattedText(String str) {
            this.formattedText = str;
        }

        public final CardImage getImage() {
            return this.image;
        }

        public final void setImage(CardImage cardImage) {
            this.image = cardImage;
        }

        public final List<Button> getButtons() {
            return this.buttons;
        }

        public final void setButtons(List<Button> list) {
            this.buttons = list;
        }

        /* loaded from: classes.dex */
        public static class Button {
            private OpenUrlAction openUrlAction;
            private String title;

            public final String getTitle() {
                return this.title;
            }

            public final void setTitle(String str) {
                this.title = str;
            }

            public final OpenUrlAction getOpenUrlAction() {
                return this.openUrlAction;
            }

            public final void setOpenUrlAction(OpenUrlAction openUrlAction) {
                this.openUrlAction = openUrlAction;
            }
        }

        /* loaded from: classes.dex */
        public static class OpenUrlAction {
            private String url;

            public final String getUrl() {
                return this.url;
            }

            public final void setUrl(String str) {
                this.url = str;
            }
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseListCard extends GoogleAssistantResponseMessages {
        private List<CardItem> items;
        private String title;

        public ResponseListCard() {
            super(ResponseMessage.MessageType.LIST_CARD);
        }

        public final String getTitle() {
            return this.title;
        }

        public final void setTitle(String str) {
            this.title = str;
        }

        public final List<CardItem> getItems() {
            return this.items;
        }

        public final void setItems(List<CardItem> list) {
            this.items = list;
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseSuggestionChips extends GoogleAssistantResponseMessages {
        private List<Suggestion> suggestions;

        public ResponseSuggestionChips() {
            super(ResponseMessage.MessageType.SUGGESTION_CHIPS);
        }

        public final List<Suggestion> getSuggestions() {
            return this.suggestions;
        }

        public final void setSuggestions(List<Suggestion> list) {
            this.suggestions = list;
        }

        /* loaded from: classes.dex */
        public static class Suggestion {
            private String title;

            public final String getTitle() {
                return this.title;
            }

            public final void setTitle(String str) {
                this.title = str;
            }
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseCarouselCard extends GoogleAssistantResponseMessages {
        private List<CardItem> items;

        public ResponseCarouselCard() {
            super(ResponseMessage.MessageType.CAROUSEL_CARD);
        }

        public final List<CardItem> getItems() {
            return this.items;
        }

        public final void setItems(List<CardItem> list) {
            this.items = list;
        }
    }

    /* loaded from: classes.dex */
    public static class ResponseLinkOutChip extends GoogleAssistantResponseMessages {
        private String destinationName;
        private String url;

        public ResponseLinkOutChip() {
            super(ResponseMessage.MessageType.LINK_OUT_CHIP);
        }

        public final String getDestinationName() {
            return this.destinationName;
        }

        public final void setDestinationName(String str) {
            this.destinationName = str;
        }

        public final String getUrl() {
            return this.url;
        }

        public final void setUrl(String str) {
            this.url = str;
        }
    }
}
