package com.subaru.global.infotainment.gen2.extend.music;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.music.json.ArtistRes;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/* loaded from: classes.dex */
public class SearchMusicArtistModule extends AbstractExtendModule {
    public final String TAG = "SearchMusicArtistModule";
    private Context context;

    public SearchMusicArtistModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception {
        Log.d("SearchMusicArtistModule", "dispatch() start");
        String query = mSHTTPRequest.getRequestInfo().getQuery("keyword");
        String query2 = mSHTTPRequest.getRequestInfo().getQuery("start");
        String query3 = mSHTTPRequest.getRequestInfo().getQuery("count");
        Log.i("SearchMusicArtistModule", "-------------------- 入力パラメータ --------------------");
        Log.i("SearchMusicArtistModule", "keyword=" + query);
        Log.i("SearchMusicArtistModule", "start=" + query2);
        Log.i("SearchMusicArtistModule", "count=" + query3);
        if (mSHTTPRequest != null && mSHTTPResponder != null) {
            try {
            } catch (Exception e) {
                Log.e("SearchMusicArtistModule", "予期せぬエラー");
                Log.e("SearchMusicArtistModule", e.toString());
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
            if (checkParam(query, query2, query3)) {
                String decode = URLDecoder.decode(query, "UTF-8");
                Log.i("SearchMusicArtistModule", "デコードされたkeyword=" + decode);
                ArtistRes searchArtist = new SearchMusic(this.context).searchArtist(decode, query2, query3);
                if (TextUtils.equals(searchArtist.getReturnCd(), "M001I")) {
                    responseJson(mSHTTPResponder, JsonUtil.toJson(searchArtist, searchArtist.getClass()), 200);
                } else if (TextUtils.equals(searchArtist.getReturnCd(), "M001W")) {
                    responseErrorJson(mSHTTPResponder, "M001W", 400);
                } else {
                    responseErrorJson(mSHTTPResponder, "M001E", 500);
                }
                Log.d("SearchMusicArtistModule", "dispatch() end");
                return;
            }
        }
        Log.w("SearchMusicArtistModule", "入力パラメータエラー");
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
