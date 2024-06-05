package ai.api.ui;

import ai.api.AIServiceException;
import ai.api.PartialResultsListener;
import ai.api.R;
import ai.api.android.AIConfiguration;
import ai.api.android.AIService;
import ai.api.model.AIError;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.ui.AIButton;
import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.widget.TextView;
import java.util.List;

/* loaded from: classes.dex */
public class AIDialog {
    private static final String TAG = "ai.api.ui.AIDialog";
    private final AIButton aiButton;
    private final AIConfiguration config;
    private final Context context;
    private final Dialog dialog;
    private final Handler handler;
    private final TextView partialResultsTextView;
    private AIDialogListener resultsListener;

    /* loaded from: classes.dex */
    public interface AIDialogListener {
        void onCancelled();

        void onError(AIError aIError);

        void onResult(AIResponse aIResponse);
    }

    public AIDialog(Context context, AIConfiguration aIConfiguration) {
        this(context, aIConfiguration, R.layout.aidialog);
    }

    public AIDialog(Context context, AIConfiguration aIConfiguration, int i) {
        this.context = context;
        this.config = aIConfiguration;
        Dialog dialog = new Dialog(context);
        this.dialog = dialog;
        this.handler = new Handler(Looper.getMainLooper());
        dialog.setCanceledOnTouchOutside(true);
        dialog.requestWindowFeature(1);
        dialog.setContentView(i);
        this.partialResultsTextView = (TextView) dialog.findViewById(R.id.partialResultsTextView);
        AIButton aIButton = (AIButton) dialog.findViewById(R.id.micButton);
        this.aiButton = aIButton;
        aIButton.initialize(aIConfiguration);
        setAIButtonCallback(aIButton);
    }

    public void setResultsListener(AIDialogListener aIDialogListener) {
        this.resultsListener = aIDialogListener;
    }

    public Dialog getDialog() {
        return this.dialog;
    }

    public void showAndListen() {
        this.handler.post(new Runnable() { // from class: ai.api.ui.AIDialog.1
            @Override // java.lang.Runnable
            public void run() {
                AIDialog.this.resetControls();
                AIDialog.this.dialog.show();
                AIDialog.this.startListening();
            }
        });
    }

    public AIResponse textRequest(AIRequest aIRequest) throws AIServiceException {
        return this.aiButton.textRequest(aIRequest);
    }

    public AIResponse textRequest(String str) throws AIServiceException {
        return textRequest(new AIRequest(str));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void resetControls() {
        TextView textView = this.partialResultsTextView;
        if (textView != null) {
            textView.setText("");
        }
    }

    private void setAIButtonCallback(AIButton aIButton) {
        aIButton.setResultsListener(new AIButton.AIButtonListener() { // from class: ai.api.ui.AIDialog.2
            @Override // ai.api.ui.AIButton.AIButtonListener
            public void onResult(AIResponse aIResponse) {
                AIDialog.this.close();
                if (AIDialog.this.resultsListener != null) {
                    AIDialog.this.resultsListener.onResult(aIResponse);
                }
            }

            @Override // ai.api.ui.AIButton.AIButtonListener
            public void onError(AIError aIError) {
                if (AIDialog.this.resultsListener != null) {
                    AIDialog.this.resultsListener.onError(aIError);
                }
            }

            @Override // ai.api.ui.AIButton.AIButtonListener
            public void onCancelled() {
                AIDialog.this.close();
                if (AIDialog.this.resultsListener != null) {
                    AIDialog.this.resultsListener.onCancelled();
                }
            }
        });
        aIButton.setPartialResultsListener(new PartialResultsListener() { // from class: ai.api.ui.AIDialog.3
            @Override // ai.api.PartialResultsListener
            public void onPartialResults(List<String> list) {
                final String str = list.get(0);
                if (TextUtils.isEmpty(str)) {
                    return;
                }
                AIDialog.this.handler.post(new Runnable() { // from class: ai.api.ui.AIDialog.3.1
                    @Override // java.lang.Runnable
                    public void run() {
                        if (AIDialog.this.partialResultsTextView != null) {
                            AIDialog.this.partialResultsTextView.setText(str);
                        }
                    }
                });
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void startListening() {
        AIButton aIButton = this.aiButton;
        if (aIButton != null) {
            aIButton.startListening();
        }
    }

    public void close() {
        this.handler.post(new Runnable() { // from class: ai.api.ui.AIDialog.4
            @Override // java.lang.Runnable
            public void run() {
                AIDialog.this.dialog.dismiss();
            }
        });
    }

    public AIService getAIService() {
        return this.aiButton.getAIService();
    }

    public void pause() {
        AIButton aIButton = this.aiButton;
        if (aIButton != null) {
            aIButton.pause();
        }
    }

    public void resume() {
        AIButton aIButton = this.aiButton;
        if (aIButton != null) {
            aIButton.resume();
        }
    }
}
