package com.android.lib.mcm.logviewer.activity;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Point;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.NumberPicker;
import android.widget.SearchView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import com.android.lib.mcm.logviewer.LogJSONUtil;
import com.android.lib.mcm.logviewer.LogViewerConst;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
/* loaded from: classes.dex */
public class LogViewerActivity extends Activity {
    private static final String BUTTON_NAME = "DELETE";
    private static final String DIALOG_BUTTON_NAME = "OK";
    private static final int LIST_MESSAGE_LINE = 3;
    private static final int LIST_MESSAGE_SIZE = 5;
    private static final int LIST_PADDING_NUM = 8;
    private static final int LIST_TIMESTAMP_SIZE = 4;
    private static final int MAX_TIMER = 20;
    private static final int MIN_TIMER = 2;
    private static final BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(LogViewerConst.BROADCAST_RECEIVER_MANAGER_KEY)) {
                String stringExtra = intent.getStringExtra(LogViewerConst.INTENT_KEY_JSON);
                try {
                    if (!TextUtils.isEmpty(stringExtra)) {
                        LogViewerList.addAll(LogJSONUtil.parseViewerJson(new JSONObject(stringExtra)));
                    }
                    if (LogViewerActivity.sActivity == null || !LogViewerActivity.showFlag) {
                        return;
                    }
                    LogViewerActivity.sActivity.setListAdapter();
                } catch (JSONException e) {
                    if (LogViewerActivity.sActivity != null) {
                        LogViewerActivity.sActivity.finish();
                        LogViewerActivity unused = LogViewerActivity.sActivity = null;
                    }
                    e.printStackTrace();
                }
            } else if (!action.equals(LogViewerConst.BROADCAST_RECEIVER_SERVICE_KEY) || LogViewerActivity.sActivity == null) {
            } else {
                LogViewerActivity.sActivity.finish();
                LogViewerActivity unused2 = LogViewerActivity.sActivity = null;
            }
        }
    };
    private static float mScale = 0.0f;
    private static LogViewerActivity sActivity = null;
    private static Context sAppContext = null;
    private static boolean showFlag = false;
    private CustomSimpleAdapter mAdapter;
    private Button mButton;
    private LinearLayout mFotterLinearLayout;
    private LinearLayout mLinearLayout;
    private ListView mListView;
    private String mSearchKeyword;
    private int showLogNum;
    private boolean mScrollFlag = true;
    private int mScrollVisibleCount = 1;
    private final int BTN_ID = 1;
    private int mHeghit = 0;

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        Log.d(getClass().getName(), " onCreate -> start ");
        Intent intent = getIntent();
        sActivity = this;
        Context applicationContext = getApplicationContext();
        sAppContext = applicationContext;
        BroadcastReceiver broadcastReceiver = mBroadcastReceiver;
        applicationContext.registerReceiver(broadcastReceiver, new IntentFilter(LogViewerConst.BROADCAST_RECEIVER_MANAGER_KEY));
        sAppContext.registerReceiver(broadcastReceiver, new IntentFilter(LogViewerConst.BROADCAST_RECEIVER_SERVICE_KEY));
        this.showLogNum = intent.getIntExtra(LogViewerConst.INTENT_KEY_TIMER, 3);
        String stringExtra = intent.getStringExtra(LogViewerConst.INTENT_KEY_JSON);
        try {
            if (!TextUtils.isEmpty(stringExtra)) {
                LogViewerList.addAll(LogJSONUtil.parseViewerJson(new JSONObject(stringExtra)));
            }
            Display defaultDisplay = ((WindowManager) getSystemService("window")).getDefaultDisplay();
            Point point = new Point();
            defaultDisplay.getSize(point);
            this.mHeghit = point.y / 12;
            DisplayMetrics displayMetrics = new DisplayMetrics();
            defaultDisplay.getMetrics(displayMetrics);
            mScale = displayMetrics.scaledDensity;
            setContentView(createView());
            try {
                startService(new Intent(this, LogViewerService.class));
            } catch (Exception unused) {
                finish();
            }
            Log.d(getClass().getName(), " onCreate -> end ");
        } catch (JSONException e) {
            e.printStackTrace();
            finish();
        }
    }

    @Override // android.app.Activity
    protected void onResume() {
        super.onResume();
        Intent intent = new Intent(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY);
        intent.putExtra(LogViewerConst.INTENT_KEY_TRANSITION_MODE, 1);
        sendBroadcast(intent);
        showFlag = true;
    }

    @Override // android.app.Activity
    protected void onPause() {
        super.onPause();
        Intent intent = new Intent(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY);
        intent.putExtra(LogViewerConst.INTENT_KEY_TRANSITION_MODE, 2);
        sendBroadcast(intent);
        showFlag = false;
    }

    @Override // android.app.Activity, android.view.KeyEvent.Callback
    public boolean onKeyDown(int i, KeyEvent keyEvent) {
        if (i == 4) {
            finish();
            return true;
        }
        return false;
    }

    private View createView() {
        LinearLayout linearLayout = new LinearLayout(this);
        this.mLinearLayout = linearLayout;
        linearLayout.setOrientation(1);
        createMenu();
        createListView();
        this.mLinearLayout.addView(this.mFotterLinearLayout);
        this.mLinearLayout.addView(this.mListView, -1, -1);
        return this.mLinearLayout;
    }

    public void createListView() {
        ListView listView = new ListView(this);
        this.mListView = listView;
        listView.setScrollBarStyle(33554432);
        int i = (int) (getResources().getDisplayMetrics().density * 8.0f);
        this.mListView.setPadding(i, 0, i, 0);
        this.mListView.setFilterTouchesWhenObscured(true);
        this.mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.2
            @Override // android.widget.AdapterView.OnItemClickListener
            public void onItemClick(AdapterView<?> adapterView, View view, int i2, long j) {
                Map map = (Map) LogViewerActivity.this.mListView.getItemAtPosition(i2);
                AlertDialog.Builder builder = new AlertDialog.Builder(LogViewerActivity.this);
                builder.setTitle((CharSequence) map.get(LogViewerConst.JSON_KEY_TIMESTAMP));
                builder.setMessage((CharSequence) map.get("message"));
                builder.setCancelable(true);
                builder.setPositiveButton("OK", (DialogInterface.OnClickListener) null);
                builder.show();
            }
        });
        this.mListView.setOnScrollListener(new AbsListView.OnScrollListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.3
            @Override // android.widget.AbsListView.OnScrollListener
            public void onScrollStateChanged(AbsListView absListView, int i2) {
            }

            @Override // android.widget.AbsListView.OnScrollListener
            public void onScroll(AbsListView absListView, int i2, int i3, int i4) {
                if (i4 == i3) {
                    LogViewerActivity.this.mScrollFlag = true;
                } else if (i4 == i3 + i2) {
                    LogViewerActivity.this.mScrollFlag = true;
                } else {
                    LogViewerActivity.this.mScrollFlag = false;
                    LogViewerActivity.this.mScrollVisibleCount = i2;
                }
            }
        });
        setListAdapter();
    }

    private void createMenu() {
        LinearLayout linearLayout = new LinearLayout(this);
        this.mFotterLinearLayout = linearLayout;
        linearLayout.setOrientation(0);
        View.OnClickListener onClickListener = onClickListener();
        Button button = new Button(this);
        this.mButton = button;
        button.setText("DELETE");
        this.mButton.setOnClickListener(onClickListener);
        this.mButton.setId(1);
        this.mButton.setLayoutParams(new LinearLayout.LayoutParams(-1, this.mHeghit, 1.0f));
        SearchView searchView = new SearchView(this);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.4
            @Override // android.widget.SearchView.OnQueryTextListener
            public boolean onQueryTextSubmit(String str) {
                LogViewerActivity.this.mSearchKeyword = str;
                LogViewerActivity.this.setListAdapter();
                return false;
            }

            @Override // android.widget.SearchView.OnQueryTextListener
            public boolean onQueryTextChange(String str) {
                if (TextUtils.isEmpty(str)) {
                    LogViewerActivity.this.mSearchKeyword = null;
                    LogViewerActivity.this.setListAdapter();
                    return false;
                }
                return false;
            }
        });
        searchView.setLayoutParams(new LinearLayout.LayoutParams(-1, this.mHeghit, 1.0f));
        final NumberPicker numberPicker = new NumberPicker(this);
        numberPicker.setMaxValue(20);
        numberPicker.setMinValue(2);
        numberPicker.setValue(this.showLogNum);
        numberPicker.setLayoutParams(new LinearLayout.LayoutParams(-1, this.mHeghit, 1.0f));
        numberPicker.setDescendantFocusability(393216);
        numberPicker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.5
            @Override // android.widget.NumberPicker.OnValueChangeListener
            public void onValueChange(NumberPicker numberPicker2, int i, int i2) {
                Intent intent = new Intent(LogViewerConst.BROADCAST_RECEIVER_ACTIVITY_KEY);
                intent.putExtra(LogViewerConst.INTENT_KEY_TIMER, numberPicker.getValue());
                LogViewerActivity.this.sendBroadcast(intent);
            }
        });
        this.mFotterLinearLayout.addView(this.mButton);
        this.mFotterLinearLayout.addView(searchView);
        this.mFotterLinearLayout.addView(numberPicker);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setListAdapter() {
        List arrayList = new ArrayList();
        Log.d("LogViewerInfo", "searchKeyword ->" + this.mSearchKeyword);
        if (this.mSearchKeyword != null) {
            for (Map<String, String> map : LogViewerList.getList()) {
                Iterator<Map.Entry<String, String>> it = map.entrySet().iterator();
                while (true) {
                    if (it.hasNext()) {
                        if (-1 != it.next().getValue().indexOf(this.mSearchKeyword)) {
                            arrayList.add(map);
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        } else {
            arrayList = LogViewerList.getList();
        }
        CustomSimpleAdapter customSimpleAdapter = new CustomSimpleAdapter(this, arrayList, 17367044, new String[]{LogViewerConst.JSON_KEY_TIMESTAMP, "message"}, new int[]{16908308, 16908309});
        this.mAdapter = customSimpleAdapter;
        this.mListView.setAdapter((ListAdapter) customSimpleAdapter);
        if (this.mScrollFlag) {
            this.mListView.setSelection(this.mAdapter.getCount() - 1);
        } else {
            this.mListView.setSelection(this.mScrollVisibleCount);
        }
        this.mAdapter.notifyDataSetChanged();
    }

    private View.OnClickListener onClickListener() {
        return new View.OnClickListener() { // from class: com.android.lib.mcm.logviewer.activity.LogViewerActivity.6
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                if (1 == view.getId()) {
                    LogViewerList.clear();
                    LogViewerActivity.this.mAdapter.notifyDataSetChanged();
                }
            }
        };
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* loaded from: classes.dex */
    public static class CustomSimpleAdapter extends SimpleAdapter {
        String[] from;
        List<? extends Map<String, ?>> list;
        LayoutInflater mInflater;

        public CustomSimpleAdapter(Context context, List<? extends Map<String, ?>> list, int i, String[] strArr, int[] iArr) {
            super(context, list, i, strArr, iArr);
            this.mInflater = LayoutInflater.from(context);
            this.list = list;
            this.from = strArr;
        }

        @Override // android.widget.SimpleAdapter, android.widget.Adapter
        public View getView(int i, View view, ViewGroup viewGroup) {
            if (view == null) {
                view = this.mInflater.inflate(17367044, (ViewGroup) null);
            }
            Map<String, ?> map = this.list.get(i);
            TextView textView = (TextView) view.findViewById(16908308);
            textView.setTextSize(LogViewerActivity.mScale * 4.0f);
            textView.setText(map.get(this.from[0]).toString());
            TextView textView2 = (TextView) view.findViewById(16908309);
            textView2.setTextSize(LogViewerActivity.mScale * 5.0f);
            textView2.setMaxLines(3);
            textView2.setEllipsize(TextUtils.TruncateAt.END);
            textView2.setText(map.get(this.from[1]).toString());
            return view;
        }
    }
}
