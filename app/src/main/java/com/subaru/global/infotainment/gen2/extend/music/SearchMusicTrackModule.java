package com.subaru.global.infotainment.gen2.extend.music;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.music.json.TrackRes;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/* loaded from: classes.dex */
public class SearchMusicTrackModule extends AbstractExtendModule {
    public final String TAG = "SearchMusicTrackModule";
    private Context context;

    public SearchMusicTrackModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception {
        Log.d("SearchMusicTrackModule", "dispatch() start");
        String query = mSHTTPRequest.getRequestInfo().getQuery("keyword");
        String query2 = mSHTTPRequest.getRequestInfo().getQuery("start");
        String query3 = mSHTTPRequest.getRequestInfo().getQuery("count");
        Log.i("SearchMusicTrackModule", "-------------------- 入力パラメータ --------------------");
        Log.i("SearchMusicTrackModule", "keyword=" + query);
        Log.i("SearchMusicTrackModule", "start=" + query2);
        Log.i("SearchMusicTrackModule", "count=" + query3);
        if (mSHTTPRequest != null && mSHTTPResponder != null) {
            try {
            } catch (Exception e) {
                Log.e("SearchMusicTrackModule", "予期せぬエラー");
                Log.e("SearchMusicTrackModule", e.toString());
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
            if (checkParam(query, query2, query3)) {
                String decode = URLDecoder.decode(query, "UTF-8");
                Log.i("SearchMusicTrackModule", "デコードされたkeyword=" + decode);
                TrackRes searchTrack = new SearchMusic(this.context).searchTrack(decode, query2, query3);
                if (TextUtils.equals(searchTrack.getReturnCd(), "M001I")) {
                    responseJson(mSHTTPResponder, JsonUtil.toJson(searchTrack, searchTrack.getClass()), 200);
                } else if (TextUtils.equals(searchTrack.getReturnCd(), "M001W")) {
                    responseErrorJson(mSHTTPResponder, "M001W", 400);
                } else {
                    responseErrorJson(mSHTTPResponder, "M001E", 500);
                }
                Log.d("SearchMusicTrackModule", "dispatch() end");
                return;
            }
        }
        Log.w("SearchMusicTrackModule", "入力パラメータエラー");
        responseErrorJson(mSHTTPResponder, "M001W", 400);
    }

    public boolean checkParam(String str, String str2, String str3) {
        if (TextUtils.isEmpty(str)) {
            return false;
        }
        if (TextUtils.isEmpty(str2) || isDigit(str2)) {
            return TextUtils.isEmpty(str3) || isDigit(str3);
        }
        return false;
    }
}
