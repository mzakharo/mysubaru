package com.subaru.global.infotainment.gen2.extend.music;

import android.content.Context;
import android.database.Cursor;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import com.clarion.android.smartaccess4car.extend.getproxy.Const;
import com.subaru.global.infotainment.gen2.extend.music.json.Album;
import com.subaru.global.infotainment.gen2.extend.music.json.AlbumRes;
import com.subaru.global.infotainment.gen2.extend.music.json.Artist;
import com.subaru.global.infotainment.gen2.extend.music.json.ArtistRes;
import com.subaru.global.infotainment.gen2.extend.music.json.Track;
import com.subaru.global.infotainment.gen2.extend.music.json.TrackRes;
import com.subaru.global.infotainment.gen2.extend.util.RequestParamUtil;
import java.util.ArrayList;
import java.util.List;

/* loaded from: classes.dex */
public class SearchMusic {
    public final String TAG = "SearchMusic";
    private Context context;

    public SearchMusic(Context context) {
        this.context = context;
    }

    public AlbumRes searchAlbum(String str, String str2, String str3) {
        int i;
        Log.d("SearchMusic", "searchAlbum() start");
        AlbumRes albumRes = new AlbumRes();
        int searchIndex = RequestParamUtil.getSearchIndex(str2);
        int searchCount = RequestParamUtil.getSearchCount(str3);
        if (searchIndex == -3 || searchCount == -2) {
            albumRes.setReturnCd("M001W");
            return albumRes;
        }
        StringBuilder sb = new StringBuilder();
        ArrayList arrayList = new ArrayList();
        parseQueryParams("album", str, sb, arrayList);
        Log.d("SearchMusic", "検索条件=" + sb.toString());
        Log.d("SearchMusic", "パラメータ=" + arrayList);
        if (arrayList.size() == 0) {
            albumRes.setReturnCd("M001W");
            return albumRes;
        }
        int i2 = 0;
        Cursor query = this.context.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{"album_id", "album"}, sb.toString(), (String[]) arrayList.toArray(new String[0]), null);
        int count = query.getCount();
        if (searchCount == -1) {
            searchCount = count;
        }
        ArrayList arrayList2 = new ArrayList();
        if (query.moveToFirst()) {
            ArrayList arrayList3 = new ArrayList();
            int i3 = 0;
            do {
                String string = query.getString(query.getColumnIndex("album_id"));
                if (!arrayList2.contains(string)) {
                    arrayList2.add(string);
                    int i4 = i2 + 1;
                    if (i2 >= searchIndex && i3 < searchCount) {
                        Album album = new Album();
                        String string2 = query.getString(query.getColumnIndex("album"));
                        album.setAlbumId(string);
                        album.setName(string2);
                        arrayList3.add(album);
                        i3++;
                    }
                    i2 = i4;
                }
            } while (query.moveToNext());
            if (arrayList3.size() <= 0) {
                arrayList3 = null;
            }
            albumRes.setAlbum(arrayList3);
            i = i2;
            i2 = i3;
        } else {
            i = 0;
        }
        query.close();
        Log.d("SearchMusic", "cursor count : " + count);
        Log.d("SearchMusic", "result count : " + i2);
        albumRes.setReturnCd("M001I");
        albumRes.setSearchCount(String.valueOf(i));
        Log.d("SearchMusic", "searchAlbum() end");
        return albumRes;
    }

    public ArtistRes searchArtist(String str, String str2, String str3) {
        int i;
        Log.d("SearchMusic", "searchArtist() start");
        ArtistRes artistRes = new ArtistRes();
        int searchIndex = RequestParamUtil.getSearchIndex(str2);
        int searchCount = RequestParamUtil.getSearchCount(str3);
        if (searchIndex == -3 || searchCount == -2) {
            artistRes.setReturnCd("M001W");
            return artistRes;
        }
        StringBuilder sb = new StringBuilder();
        ArrayList arrayList = new ArrayList();
        parseQueryParams("artist", str, sb, arrayList);
        Log.d("SearchMusic", "検索条件=" + sb.toString());
        Log.d("SearchMusic", "パラメータ=" + arrayList);
        if (arrayList.size() == 0) {
            artistRes.setReturnCd("M001W");
            return artistRes;
        }
        int i2 = 0;
        Cursor query = this.context.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{"artist_id", "artist"}, sb.toString(), (String[]) arrayList.toArray(new String[0]), null);
        int count = query.getCount();
        if (searchCount == -1) {
            searchCount = count;
        }
        ArrayList arrayList2 = new ArrayList();
        if (query.moveToFirst()) {
            ArrayList arrayList3 = new ArrayList();
            int i3 = 0;
            do {
                String string = query.getString(query.getColumnIndex("artist_id"));
                if (!arrayList2.contains(string)) {
                    arrayList2.add(string);
                    int i4 = i2 + 1;
                    if (i2 >= searchIndex && i3 < searchCount) {
                        Artist artist = new Artist();
                        String string2 = query.getString(query.getColumnIndex("artist"));
                        artist.setArtistId(string);
                        artist.setName(string2);
                        arrayList3.add(artist);
                        i3++;
                    }
                    i2 = i4;
                }
            } while (query.moveToNext());
            if (arrayList3.size() <= 0) {
                arrayList3 = null;
            }
            artistRes.setArtist(arrayList3);
            i = i2;
            i2 = i3;
        } else {
            i = 0;
        }
        query.close();
        Log.d("SearchMusic", "cursor count : " + count);
        Log.d("SearchMusic", "result count : " + i2);
        artistRes.setReturnCd("M001I");
        artistRes.setSearchCount(String.valueOf(i));
        Log.d("SearchMusic", "searchArtist() end");
        return artistRes;
    }

    public TrackRes searchTrack(String str, String str2, String str3) {
        int i;
        Log.d("SearchMusic", "searchTrack() start");
        TrackRes trackRes = new TrackRes();
        int searchIndex = RequestParamUtil.getSearchIndex(str2);
        int searchCount = RequestParamUtil.getSearchCount(str3);
        if (searchIndex == -3 || searchCount == -2) {
            trackRes.setReturnCd("M001W");
            return trackRes;
        }
        StringBuilder sb = new StringBuilder();
        ArrayList arrayList = new ArrayList();
        parseQueryParams("title", str, sb, arrayList);
        Log.d("SearchMusic", "検索条件=" + sb.toString());
        Log.d("SearchMusic", "パラメータ=" + arrayList);
        if (arrayList.size() == 0) {
            trackRes.setReturnCd("M001W");
            return trackRes;
        }
        int i2 = 0;
        Cursor query = this.context.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{"_id", "title"}, sb.toString(), (String[]) arrayList.toArray(new String[0]), null);
        int count = query.getCount();
        if (searchCount == -1) {
            searchCount = count;
        }
        ArrayList arrayList2 = new ArrayList();
        if (query.moveToFirst()) {
            ArrayList arrayList3 = new ArrayList();
            int i3 = 0;
            do {
                String string = query.getString(query.getColumnIndex("_id"));
                if (!arrayList2.contains(string)) {
                    arrayList2.add(string);
                    int i4 = i2 + 1;
                    if (i2 >= searchIndex && i3 < searchCount) {
                        Track track = new Track();
                        String string2 = query.getString(query.getColumnIndex("title"));
                        track.setTrackId(string);
                        track.setName(string2);
                        arrayList3.add(track);
                        i3++;
                    }
                    i2 = i4;
                }
            } while (query.moveToNext());
            if (arrayList3.size() <= 0) {
                arrayList3 = null;
            }
            trackRes.setTrack(arrayList3);
            i = i2;
            i2 = i3;
        } else {
            i = 0;
        }
        query.close();
        Log.d("SearchMusic", "cursor count : " + count);
        Log.d("SearchMusic", "result count : " + i2);
        trackRes.setReturnCd("M001I");
        trackRes.setSearchCount(String.valueOf(i));
        Log.d("SearchMusic", "searchTrack() end");
        return trackRes;
    }

    private void parseQueryParams(String str, String str2, StringBuilder sb, List<String> list) {
        if (TextUtils.isEmpty(str) || TextUtils.isEmpty(str2) || sb == null || list == null) {
            return;
        }
        if (str2.startsWith(",") || str2.endsWith(",")) {
            list.clear();
            return;
        }
        String[] split = str2.split(",");
        int length = split.length;
        StringBuilder sb2 = new StringBuilder();
        int i = 0;
        while (i < length) {
            String str3 = split[i];
            if (TextUtils.isEmpty(str3)) {
                list.clear();
                return;
            }
            if (str3.startsWith(Const.REQUEST_PARAM_SEPARATE_STR) || str3.endsWith(Const.REQUEST_PARAM_SEPARATE_STR)) {
                list.clear();
                return;
            }
            String[] split2 = str3.split(Const.REQUEST_PARAM_SEPARATE_STR);
            if (split2.length > 1) {
                int length2 = split2.length;
                sb2.append("(");
                int i2 = 0;
                while (i2 < length2) {
                    String str4 = split2[i2];
                    if (TextUtils.isEmpty(str4)) {
                        list.clear();
                        return;
                    }
                    list.add("%" + str4 + "%");
                    sb2.append("( ");
                    sb2.append(str);
                    sb2.append(" LIKE ? )");
                    i2++;
                    if (i2 < length2) {
                        sb2.append(" AND ");
                    }
                }
                sb2.append(")");
            } else {
                list.add("%" + str3 + "%");
                sb2.append("( ");
                sb2.append(str);
                sb2.append(" LIKE ? )");
            }
            i++;
            if (i < length) {
                sb2.append(" OR ");
            }
        }
        sb.append("( ");
        sb.append("is_music");
        sb.append(" != 0 ) AND ");
        sb.append((CharSequence) sb2);
    }
}
