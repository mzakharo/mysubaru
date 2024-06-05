package com.subaru.global.infotainment.gen2.extend.music;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.subaru.global.infotainment.gen2.extend.AbstractExtendModule;
import com.subaru.global.infotainment.gen2.extend.music.json.AlbumRes;
import com.subaru.global.infotainment.gen2.extend.util.JsonUtil;
import com.uievolution.microserver.modulekit.MSHTTPRequest;
import com.uievolution.microserver.modulekit.MSHTTPResponder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/* loaded from: classes.dex */
public class SearchMusicAlbumModule extends AbstractExtendModule {
    public final String TAG = "SearchMusicAlbumModule";
    private Context context;

    public SearchMusicAlbumModule(Context context) {
        this.context = context;
    }

    @Override // com.subaru.global.infotainment.gen2.extend.AbstractExtendModule, com.uievolution.microserver.modulekit.MSModuleDelegate
    public void dispatch(MSHTTPRequest mSHTTPRequest, MSHTTPResponder mSHTTPResponder) throws Exception {
        Log.d("SearchMusicAlbumModule", "dispatch() start");
        String query = mSHTTPRequest.getRequestInfo().getQuery("keyword");
        String query2 = mSHTTPRequest.getRequestInfo().getQuery("start");
        String query3 = mSHTTPRequest.getRequestInfo().getQuery("count");
        Log.i("SearchMusicAlbumModule", "-------------------- 入力パラメータ --------------------");
        Log.i("SearchMusicAlbumModule", "keyword=" + query);
        Log.i("SearchMusicAlbumModule", "start=" + query2);
        Log.i("SearchMusicAlbumModule", "count=" + query3);
        if (mSHTTPRequest != null && mSHTTPResponder != null) {
            try {
            } catch (Exception unused) {
                responseErrorJson(mSHTTPResponder, "M001E", 500);
            }
            if (checkParam(query, query2, query3)) {
                String decode = URLDecoder.decode(query, "UTF-8");
                Log.i("SearchMusicAlbumModule", "デコードされたkeyword=" + decode);
                AlbumRes searchAlbum = new SearchMusic(this.context).searchAlbum(decode, query2, query3);
                if (TextUtils.equals(searchAlbum.getReturnCd(), "M001I")) {
                    responseJson(mSHTTPResponder, JsonUtil.toJson(searchAlbum, searchAlbum.getClass()), 200);
                } else if (TextUtils.equals(searchAlbum.getReturnCd(), "M001W")) {
                    responseErrorJson(mSHTTPResponder, "M001W", 400);
                } else {
                    responseErrorJson(mSHTTPResponder, "M001E", 500);
                }
                Log.d("SearchMusicAlbumModule", "dispatch() end");
                return;
            }
        }
        Log.w("SearchMusicAlbumModule", "入力パラメータエラー");
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
