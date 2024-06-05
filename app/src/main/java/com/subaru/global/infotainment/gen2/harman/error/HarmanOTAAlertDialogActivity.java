package com.subaru.global.infotainment.gen2.harman.error;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.ContextThemeWrapper;
import android.view.View;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.core.view.ViewCompat;
import com.example.mysubaru.R;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAConst;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAKVSUtil;
import com.subaru.global.infotainment.gen2.harman.HarmanOTAUtil;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanAPI;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanEnum;
import com.subaru.global.infotainment.gen2.harman.enumerate.HarmanOriginalError;
import com.subaru.global.infotainment.gen2.harman.module.HarmanOTAManager;
import com.subaru.global.infotainment.gen2.util.BaseLayoutUtil;

/* loaded from: classes.dex */
public class HarmanOTAAlertDialogActivity extends Activity {
    public static final String BROADCAST_ACTION_DISSMISS_ALERT = HarmanOTAAlertDialogActivity.class.getName() + ".dismissAlert";
    private static final String NEGATIVE_BUTTON = "Cancel";
    private static final String POSITIVE_BUTTON = "OK";
    private boolean isChecked = false;
    private BroadcastReceiver mReceiver = new BroadcastReceiver() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            HarmanOTAAlertDialogActivity.this.finish();
        }
    };

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        HarmanOTAUtil.logDebug("start");
        LinearLayout linearLayout = new LinearLayout(this);
        linearLayout.setOnClickListener(new View.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.2
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
            }
        });
        linearLayout.setAlpha(0.0f);
        setContentView(linearLayout);
        Intent intent = getIntent();
        String stringExtra = intent.getStringExtra(HarmanOTAConst.INTENT_KEY);
        String stringExtra2 = intent.getStringExtra("errorCode");
        if (TextUtils.isEmpty(stringExtra) && TextUtils.isEmpty(stringExtra2)) {
            finish();
        }
        HarmanAPI valueOf = HarmanAPI.valueOf(stringExtra2);
        final HarmanOriginalError valueOf2 = HarmanOriginalError.valueOf(stringExtra);
        AlertDialog.Builder builder = new AlertDialog.Builder(new ContextThemeWrapper(this, R.style.AppTheme));
        String str = getString(valueOf2.getResLongId()) + "\n(" + valueOf2.getOriginalErrorNum(valueOf) + ")";
        LinearLayout linearLayout2 = new LinearLayout(this);
        linearLayout2.setOrientation(1);
        TextView textView = new TextView(this);
        textView.setText(str);
        textView.setTextColor(ViewCompat.MEASURED_STATE_MASK);
        textView.setTextSize(20.0f);
        int displayHeight = BaseLayoutUtil.getInstance().getDisplayHeight() / 40;
        textView.setPadding(displayHeight, displayHeight, displayHeight, displayHeight);
        linearLayout2.addView(textView);
        if (isMapSubscriptionExpiredError(valueOf2).booleanValue() && HarmanOriginalError.MAP_SUBSCRIPTION_DETAILS.equals(valueOf2)) {
            CheckBox checkBox = new CheckBox(this);
            checkBox.setText(R.string._4Car_TXT_0146);
            checkBox.setTextColor(textView.getTextColors());
            checkBox.setVisibility(0);
            checkBox.setOnClickListener(new View.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.3
                @Override // android.view.View.OnClickListener
                public void onClick(View view) {
                    if (!HarmanOTAAlertDialogActivity.this.isChecked) {
                        HarmanOTAAlertDialogActivity.this.isChecked = true;
                    } else {
                        HarmanOTAAlertDialogActivity.this.isChecked = false;
                    }
                }
            });
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -2);
            layoutParams.leftMargin = displayHeight;
            layoutParams.bottomMargin = displayHeight;
            linearLayout2.addView(checkBox, layoutParams);
        }
        if (valueOf2 != HarmanOriginalError.TRANSFER_IN_PROGRESS_MAX) {
            if (HarmanEnum.Error.MAP_SUBSCRIPTION_EXPIRED.equalOriginalErrorCode(valueOf2.getOriginalErrorCode()) || HarmanOriginalError.MAP_SUBSCRIPTION_EXPIRED.equals(valueOf2) || HarmanOriginalError.DOWNLOAD_FAIL_SUBSCRIPTION_INVALID.equals(valueOf2) || HarmanOriginalError.MAP_SUBSCRIPTION_DETAILS.equals(valueOf2)) {
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.4
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialogInterface, int i) {
                        HarmanOTAAlertDialogActivity.this.setBrowser(Uri.parse("https://www.subaru-maps.com"));
                        if (HarmanOTAAlertDialogActivity.this.isMapSubscriptionExpiredError(valueOf2).booleanValue()) {
                            HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_GEN4, HarmanOTAKVSUtil.MAP_SUBSCRIPTION_SHOWN, Boolean.valueOf(HarmanOTAAlertDialogActivity.this.isChecked));
                        }
                        HarmanOTAAlertDialogActivity.this.finish();
                    }
                });
                builder.setNegativeButton(NEGATIVE_BUTTON, new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.5
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialogInterface, int i) {
                        HarmanOTAAlertDialogActivity.this.finish();
                    }
                });
            } else if (HarmanOriginalError.NOTIFY_FILE_TRANSFER_FAILURE.equals(valueOf2)) {
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.6
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialogInterface, int i) {
                        HarmanOTAManager.getInstance().clearData();
                        HarmanOTAKVSUtil.writeSettingsKVS(HarmanOTAKVSUtil.MAIN_KEY_NOTIFY_FAIL, HarmanOTAKVSUtil.NOTIFY_FAIL_FLAG, false);
                        HarmanOTAAlertDialogActivity.this.finish();
                    }
                });
            } else {
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.7
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialogInterface, int i) {
                        HarmanOTAAlertDialogActivity.this.finish();
                    }
                });
            }
        }
        builder.setView(linearLayout2);
        builder.setCancelable(false);
        builder.create();
        builder.show().setOnDismissListener(new DialogInterface.OnDismissListener() { // from class: com.subaru.global.infotainment.gen2.harman.error.HarmanOTAAlertDialogActivity.8
            @Override // android.content.DialogInterface.OnDismissListener
            public void onDismiss(DialogInterface dialogInterface) {
                HarmanOTAAlertDialogActivity.this.finish();
            }
        });
        registerReceiver(this.mReceiver, new IntentFilter(BROADCAST_ACTION_DISSMISS_ALERT));
    }

    @Override // android.app.Activity
    public void finish() {
        try {
            unregisterReceiver(this.mReceiver);
        } catch (Exception unused) {
        }
        super.finish();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setBrowser(Uri uri) {
        HarmanOTAUtil.logDebug("start");
        Intent intent = new Intent("android.intent.action.VIEW");
        intent.setData(uri);
        startActivity(intent);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public Boolean isMapSubscriptionExpiredError(HarmanOriginalError harmanOriginalError) {
        return Boolean.valueOf(HarmanEnum.Error.MAP_SUBSCRIPTION_EXPIRED.equalOriginalErrorCode(harmanOriginalError.getOriginalErrorCode()) || HarmanOriginalError.MAP_SUBSCRIPTION_EXPIRED.equals(harmanOriginalError) || HarmanOriginalError.DOWNLOAD_FAIL_SUBSCRIPTION_INVALID.equals(harmanOriginalError) || HarmanOriginalError.MAP_SUBSCRIPTION_DETAILS.equals(harmanOriginalError));
    }
}
