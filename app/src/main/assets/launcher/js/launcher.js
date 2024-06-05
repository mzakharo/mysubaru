/*----------------------------------------------------------------------------
|	HTML5 Project		since 2012
|
|	HTML5ランチャー
|
|	Yuji_Minegishi@clarion.co.jp
----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------

■変更履歴
2014/02/07	峰岸	ポリシーの<APP_SUPPORT>が空になる不具合があったのでランチャーで空判定を入れた。
2014/02/07	峰岸	PID履歴更新日付でソートするように改修した。
2013/12/18	峰岸	PID履歴更新処理追加。（課金対応のため）(pidHistory)
2013/12/16	峰岸	初期ローディング表示用のGIFファイルを差し替え。（SUBARU指定のため）
2013/11/28	峰岸	全画面対応(他のコンテンツで半画面にしたのを戻す)。
2013/11/22	峰岸	言語が即切り替わらないので、天気のキャッシュを一時的に止めた。
2013/11/20	峰岸	aha,Pandora(Nativeアプリ)起動時は、NativeでBeepを鳴らすので、HTMLランチャーでは鳴らすのを止めた。
2013/11/19	峰岸	aha,Pandora(Nativeアプリ)起動に対応。
2013/11/19	峰岸	北米3言語に対応。
2013/11/19	峰岸	デッドコードを削除。
2013/11/19	峰岸	【BF4開発に切り替え】
2013/11/12	峰岸	News検索で圏外になるとMWSが応答しなくなる不具合対応のため、timestamp取得でtimeoutしたら"/reset"コマンドを投げるように改修した。
2013/10/28	峰岸	BF4ではF10が２バイト文字を表示できないので、摂氏華氏の『ﾟ』は半角の半濁点にも変更する。GPFは既にリリースしてしまったので『℃』を使用する。
2013/10/21	峰岸	PIDをlocalStorageに展開する。(launcher_pid)	★ivoiceの利用規約処理に仕様する
2013/10/18	峰岸	画像差し替え。
2013/10/18	峰岸	キーバリューストア診断を本番サーバでは止めた。
2013/10/18	峰岸	華氏記号『°F』が表示できないので、13.5GPFでは温度単位変更は出来ないように変更。(weather.js)
2013/10/15	峰岸	画面状態通知でiconタップを禁止を解除するように変更。
2013/10/14	峰岸	iconタップからアプリ起動応答までiconタップを禁止に設定。(iconLock)
2013/10/07	峰岸	天気地域検索が出来ても"query not found"になることがあるので、ウィジェットにエラー表示するように対処した。
2013/10/07	峰岸	Backgroundに行ったら、起動時のぐるぐるアニメーションは強制停止。
2013/10/07	峰岸	ポリシー有効期限判定の時計は車載機から取るように変更。(SSL通信のため、S-GPFもスマホの時計をlocal.htmlで車載機に設定するようになった)
2013/10/07	峰岸	『にわか雨（弱）』の前に半角スペースを入れて改行するように変更。
2013/10/07	峰岸	天気の地域設定をゼロ件に出来ないように変更。(weather.js)
2013/10/01	峰岸	【入検】
2013/10/01	峰岸	Wallpaperのスライダーバーの色とグラデーションを変更。(app_main.css gradient)
2013/10/01	峰岸	スライダーバーの色を変更。(launcher.css slider)
2013/09/30	峰岸	天気ウィジェットの縁取りを削除。(launcher.css border:none)
2013/09/30	峰岸	時計ウイジェットの画像変更。(1枚画像にしたのでlauncher.cssも変更)
2013/09/30	峰岸	天気ウィジェットの地名と天気名のhightを48pxから50pxに変更。（天気名が切れるため。chromeでは自動的に50pxになっていた）
2013/09/30	峰岸	天気ウィジェットの画像変更。	★CEATECリリース
2013/09/26	峰岸	『4Car』表示を止める。。
2013/09/25	峰岸	『4Car』表示に対応。
2013/09/25	峰岸	GETメソッドもtimeoutを30secに変更。
2013/09/25	峰岸	壁紙02を差し替え。
2013/09/25	峰岸	ajax-loaderを1.3.2からロードに変更。launcher.css
2013/09/23	峰岸	起動時間短縮のため、天気情報取得を非同期に変更。(weatherInit)
2013/09/22	峰岸	起動時間短縮のため、起動処理順番を見直し。launcherGlobal.initDesign()
2013/09/22	峰岸	天気情報のキャッシュを復活。(weather_info_cache,weatherCache)
2013/09/22	峰岸	背景黒に対応(壁紙アプリも)。
2013/09/20	峰岸	error.htmlに対応。
2013/09/20	峰岸	「飛び先URLが無ければアイコンタップ空振り」をコメント。app_restriction()
2013/09/19	峰岸	POSTメソッドは、起動時の実行キューの関係でtimeoutすることがあるので、timeoutを30secに変更。	★verify更新
2013/09/18	峰岸	setKeyValueStore(key,null,,)に対応。
2013/09/17	峰岸	壁紙のゴミを削除。url( "../img/bg/bg_map.png" )
2013/09/17	峰岸	壁紙設定後、自動的にランチャーに戻るように変更。
2013/09/15	峰岸	『BACK』ボタンでAPPTABに直接戻るように変更。(Weather)	★verify更新
2013/09/15	峰岸	キーバリューストア診断に対応。(Weather)
2013/09/15	峰岸	launcher_icon_layoutはポリシーに紐付いているので、PID違いで削除するように変更。
2013/09/14	峰岸	weather_arealistをweather_area_listに変更。
2013/09/14	峰岸	weatherMerge()でweather_databaseが無い時、空になっていたので修正。
2013/09/14	峰岸	スマホ側も天気単位情報をユーザ設定情報に纏めた(temptype)。
2013/09/13	峰岸	12時間表記⇔24時間表記対応。
2013/09/12	峰岸	スマホ側は天気単位情報しか設定しないで済むように対応。(temptype)	★verify更新
2013/09/12	峰岸	『ナビ表示ON/OFF』に対応。(dispSettingObj)（GET追加で1秒増加）
2013/09/12	峰岸	山口さんに指摘されたので、ポリシー取得時のuid=10&を止めた。
2013/09/12	峰岸	白画面を出さないために<body>タグのbackgroundを黒(#000)に設定。(壁紙アプリも)
2013/09/12	峰岸	起動時間短縮のため、CORSポリシーの処理をdesign.js処理の後にした。（非同期だったので、実行キュー方式のjsでは影響ないかもしれない）
2013/09/12	峰岸	起動時間短縮のため、design.jsのloadingViewTimeを止めた。（1500ms短縮）
2013/09/11	峰岸	起動時間短縮のため、天気単位情報をユーザ設定情報に纏めた(temptype)。スマホ側も変更要。（GETをしないため1秒短縮）
2013/09/11	峰岸	起動時間短縮のため、天気情報のキャッシュを止めた。(weather_database)（GETをしないため1秒短縮）
2013/09/11	峰岸	起動時間短縮のため、起動時のアイコンレイアウト情報の保存を止めた。つまり並べ替えするまで保存しない。（POSTしないため、GETに影響を与えない）
					(launcher.js: setlauncherIconLayout)、(design.js: makeJsonForAppsLayout)
2013/09/11	峰岸	起動時間短縮のため、console.log()の見直しを行った。（ブラウザは、design.jsのログを見てるとシリアル送信完了まで待っているようだから）
2013/09/10	峰岸	アプリケーションキャッシュに対応。(壁紙アプリも)

----------------------------------------------------------------------------*/

	var	machine		= null;			//実行環境
	var	computer	= null;			//★PC上での確認時にtrue
	var	httpSA		= null;
	var	domainSA	= null;

	var	app_policyOrder		= [];
	var app_displayImage	= [[],[]];

	var	weatherCache		= true;
	var	weather_AreaObj		= [];

	var	dispSettingObj		= [];

	var	userSetting			= true;
	var	userSettingObj		= {
		 bgType:	"bgType1"	//壁紙
		,wuindex:	0			//天気index
		,pageindex:	0			//ページindex
		,temptype:	"C"			//摂氏⇔華氏
		,cktype:	"24"		//12時間表記⇔24時間表記
	};

	var	jse		= null;			//NPAPIインスタンス

	var	restriction	= 0;		//走行規制状態
	var	iconLock	= 0;		//iconタップのロック
	var	huLocale	= "eng";	//車載機言語設定(ISO639-2)

//----------------------------------------------------
//アプリ名がポリシー(app_policyOrder)に存在するか調べる
//★現在はウィジェットの存在有無の調査に使用している。ウィジェットが無いのに表示処理が動かないように。
//引数		アプリ名
//戻り値	null or app_policyOrder[]のindex
function	getAppIndex(name){
	for(var i=0;i<app_policyOrder.length;i++){
	//	if(app_policyOrder[i].name == name)
		if(app_policyOrder[i].name.match(name))
		{
			return i;
		}
	}
	return null;
}
//----------------------------------------------------
//ポリシー(app_policyOrder)から[design.js]へアプリ情報の設定
//★getlauncherIconLayout()の直前に呼び出される。
//★ウィジェットは、"appx"を固定にする。通常アプリは"app10"からキーを振る。
//引数		なし
//戻り値	なし
function	launcherPolicyOrder(){
	var	index = getAppIndex("Clock");
	if(index != null){
			launcherGlobal.setAppHtml5IdToAppInfoLit	("app5",app_policyOrder[index].id);
			launcherGlobal.setAppNameToAppInfoLit		("app5",app_policyOrder[index].name);
			launcherGlobal.setAppUrlToAppInfoLit		("app5",app_policyOrder[index].url);
			launcherGlobal.setDefAppOrderToAppInfoLit	("app5",app_policyOrder[index].order,app_policyOrder[index].updown);
			launcherGlobal.setAppThumbnailToAppInfoLit	("app5","img/app5/thumb.gif");
			launcherGlobal.setAppIconToAppInfoLit		("app5","img/app5/sprite.gif");
			launcherGlobal.setSizeTypeToAppInfoLit		("app5","double");
			app_displayImage[app_policyOrder[index].updown][app_policyOrder[index].order] = "app5";
	}
	var	index = getAppIndex("Weather");
	if(index != null){
			launcherGlobal.setAppHtml5IdToAppInfoLit	("app7",app_policyOrder[index].id);
			launcherGlobal.setAppNameToAppInfoLit		("app7",app_policyOrder[index].name);
			launcherGlobal.setAppUrlToAppInfoLit		("app7",app_policyOrder[index].url);
			launcherGlobal.setDefAppOrderToAppInfoLit	("app7",app_policyOrder[index].order,app_policyOrder[index].updown);
			launcherGlobal.setAppThumbnailToAppInfoLit	("app7","img/app7/thumb.gif");
			launcherGlobal.setAppIconToAppInfoLit		("app7","img/app7/sprite.gif");
			launcherGlobal.setSizeTypeToAppInfoLit		("app7","double");
			app_displayImage[app_policyOrder[index].updown][app_policyOrder[index].order] = "app7";
	}
	for(var i=0;i<app_policyOrder.length;i++){
		if((app_policyOrder[i].name.match("Clock"))
		|| (app_policyOrder[i].name.match("Weather"))){
		}else{
			launcherGlobal.setAppHtml5IdToAppInfoLit		("app" + (i+10),app_policyOrder[i].id);
			launcherGlobal.setAppNameToAppInfoLit			("app" + (i+10),app_policyOrder[i].name);
			launcherGlobal.setAppUrlToAppInfoLit			("app" + (i+10),app_policyOrder[i].url);
			launcherGlobal.setDefAppOrderToAppInfoLit		("app" + (i+10),app_policyOrder[i].order,app_policyOrder[i].updown);
			launcherGlobal.setAppThumbnailToAppInfoLit		("app" + (i+10),app_policyOrder[i].icon + "/thumb.gif");
			launcherGlobal.setAppIconToAppInfoLit			("app" + (i+10),app_policyOrder[i].icon + "/icon.gif");
			launcherGlobal.setSizeTypeToAppInfoLit			("app" + (i+10),"single");
			app_displayImage[app_policyOrder[i].updown][app_policyOrder[i].order] = "app" + (i+10);
		}
	}
}
//----------------------------------------------------
//アイコン・レイアウト情報のMWSからの読み出し
//★起動時に[design.js]からアイコン・レイアウトを決定するタイミングで呼び出される。
//★launcherPolicyOrder()の直後に呼び出される。
//★ここでID(APP_HTML5_ID)マッチングを行い、大元のポリシーへのアプリ追加、削除に対応する。
//★ここでID(APP_HTML5_ID)を削除する必要は、JSON形式なので考えられない。
//引数		なし
//戻り値	レイアウト情報(JSON形式)
function	getlauncherIconLayout(){
	if(userSetting == false){						//ユーザ設定情報は有効か？
		setKeyValueStore("launcher_icon_layout",null,machine,computer);	//★ポリシーに紐付く情報なので削除
	}else{
		var	layout	= getKeyValueStore("launcher_icon_layout",machine,computer);
		if(layout != null){							//レイアウト情報は存在するか？
			var	layoutObj = JSON.parse(layout);
			if(Object.keys(layoutObj).length > 0)	//オブジェクトは空ではないか？
		//	if($.isEmptyObject(layoutObj) == false)	//オブジェクトは空ではないか？(jQuery版)
			{
				//----------------------------------------------------
				//過去と現在のポリシーにあるアプリを残し、ポリシーから削除されたアプリを消す。
				app_displayImage = [[],[]];
				var	i=0,k=0;
				for(var key0 in layoutObj){
					for(var key1 in appInfoList){
						if(layoutObj[key0].app_id == appInfoList[key1].app_id){
							//IDが同じならアイコン配列に新しいキーを割り当てる
							if(layoutObj[key0].y == 0){
								app_displayImage[0][i] = key1;
								i++;
							}else{
								app_displayImage[1][k] = key1;
								k++;
							}
						}
					}
				}
				//----------------------------------------------------
				//この時点で、
				//過去と現在のポリシーにあるアプリは残る。
				//ポリシーから削除されたアプリは消えて無くなる。
				//ポリシーに追加されたアプリの処理が以下となり、上段の後ろに追加していく。
				for(var key1 in appInfoList){
					for(var key0 in layoutObj){
						if(layoutObj[key0].app_id == appInfoList[key1].app_id){
							break;
						}
					}
					if(layoutObj[key0].app_id == appInfoList[key1].app_id){
						continue;
					}else{
						//上段の後ろに追加していく
						app_displayImage[0][i] = key1;
						i++;
					}
				}
			}
		}
	}
	appListOfLine = app_displayImage;	//★配列のコピーはポインターのコピーだけなので、これ以降app_displayImageは触れないので注意！
	layout = launcherGlobal.getJsonStrForAppsLayout();
	return layout;
}
//----------------------------------------------------
//アイコン・レイアウト情報のMWSへの書き込み
//★[design.js]からレイアウト決定、変更のタイミングで呼び出される。
//★ここでID(APP_HTML5_ID)を付加することで、次回起動時にポリシーが変更されても識別できるようにする。
//引数		レイアウト情報(JSON形式)
//戻り値	なし
function	setlauncherIconLayout(layout){
	var	layoutObj = JSON.parse(layout);
	for(var key0 in layoutObj){
		for(var key1 in appInfoList){
			if(key0 == key1){
				//キーが同じならレイアウト情報にIDを付加する
				layoutObj[key0].app_id = appInfoList[key1].app_id;
			}
		}
	}
	setKeyValueStore("launcher_icon_layout",JSON.stringify(layoutObj),machine,computer);
}
//----------------------------------------------------
//ラストページのMWSからの読み出し
//引数		なし
//戻り値	pageIndex	0~
function	getlauncherPageIndex(){
	return	userSettingObj.pageindex;
}
//----------------------------------------------------
//ラストページのMWSへの書き込み
//引数		newPage	0~
//戻り値	なし
function	setlauncherPageIndex(newPage){
	userSettingObj.pageindex = newPage;
	setKeyValueStore("launcher_user_settings",JSON.stringify(userSettingObj),machine,computer);
}
//----------------------------------------------------
//天気情報初期表示
//引数		なし
//戻り値	なし
function	weatherInit(){
	var	areaJSON;
	var	dbJSON;

	//スマホから地域リストとキャッシュ情報を取得
	if(computer == true){
		//★ローカルストレージから取得
		areaJSON	= localStorage.getItem("weather_area_list");
		if(weatherCache == true){
			dbJSON		= localStorage.getItem("weather_info_cache");
		}else{
			dbJSON		= null;
		}
		weatherInit_3();	//★3のステップへ
	}else{
		//★キーバリューストアから取得
		var	kvsurl	= "http://192.168.1.1:80/kvs/weather_area_list/";
		$.ajax({
			type: "GET",		//HTTPメソッド
			url: kvsurl,		//URL
			async: true,		//非同期
			timeout: 30000,		//タイムアウト
			success: function(data,status,xhr){
				console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
				areaJSON = xhr.responseText;
				weatherInit_2();	//★2のステップへ
			},
			error: function(xhr,status,err){
				console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
				areaJSON = null;
				weatherInit_2();	//★2のステップへ
			}
		});
	}
	return;
	//----------------------------------------------------
	//2のステップ
	function	weatherInit_2(){
		if(weatherCache == true){
			var	kvsurl	= "http://192.168.1.1:80/kvs/weather_info_cache/";
			$.ajax({
				type: "GET",		//HTTPメソッド
				url: kvsurl,		//URL
				async: true,		//非同期
				timeout: 30000,		//タイムアウト
				success: function(data,status,xhr){
					console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
					dbJSON = xhr.responseText;
					weatherInit_3();	//★3のステップへ
				},
				error: function(xhr,status,err){
					console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
					dbJSON = null;
					weatherInit_3();	//★3のステップへ
				}
			});
		}else{
			dbJSON		= null;
			weatherInit_3();	//★3のステップへ
		}
	}
	//----------------------------------------------------
	//3のステップ
	function	weatherInit_3(){
		if((areaJSON == null)&&(dbJSON == null)){
			//どちらも無ければ、車載機のデフォルトで動作
			weather_AreaObj = weatherSetting();
		}else
		if((areaJSON == null)&&(dbJSON != null)){
			//スマホデータが無ければ、車載機のデータで動作
			weather_AreaObj = JSON.parse(dbJSON);
		}else
		if((areaJSON != null)&&(dbJSON == null)){
			//車載機データが無ければ、スマホデータを車載機にコピー
			var	areaObj = JSON.parse(areaJSON);
			var	dbObj	= [];
			weather_AreaObj = weatherMerge(areaObj,dbObj);
		}else
		{
			//どちらもあれば、マージする。
			var	areaObj = JSON.parse(areaJSON);
			var	dbObj	= JSON.parse(dbJSON);
			weather_AreaObj = weatherMerge(areaObj,dbObj);
		}
		//★天気情報受信でキャッシュ(スマホ保存)するので、起動時間短縮のためにも、ここでキャッシュはしない。

		if(	userSettingObj.wuindex >= weather_AreaObj.length){
			userSettingObj.wuindex = 0;	//★スマホ側で追加削除出来るので、ここで調整が必要。
		}
		weatherUpdate();	//天気初期表示
	}

	//----------------------------------------------------
	//スマホの設定情報と車載機のキャッシュ情報をマージする。
	function	weatherMerge(areaObj,dbObj){
		var	v = 0;
		var	k = 0;
		var	mergeList = [];
		for(var	i=0;i<areaObj.length;i++){
			for(k=0;k<dbObj.length;k++){
				if(areaObj[i].name == dbObj[k].name){
					var	mergeObj = new Object();
					mergeObj	= dbObj[k];
					mergeList[v] = mergeObj;
					v++;
					break;
				}
			}
			if(k == dbObj.length){
				var	mergeObj = new Object();
				mergeObj.name	= areaObj[i].name;
				mergeObj.type	= areaObj[i].type;
				mergeObj.c		= areaObj[i].c;
				mergeObj.zmw	= areaObj[i].zmw;
				mergeObj.tz		= areaObj[i].tz;
				mergeObj.tzs	= areaObj[i].tzs;
				mergeObj.l		= areaObj[i].l;
				mergeObj.phrase		= "";
				mergeObj.icon		= "";
				mergeObj.tempc		= 0;
				mergeObj.tempf		= 0;
				mergeObj.localtime	= "";
				mergeObj.unittime	= 0;
				mergeList[v] = mergeObj;
				v++;
			}
		}
		return	mergeList;
	}
	//----------------------------------------------------
	//天気情報が存在しなかったらデフォルト値をセットする。
	//★最終的にスマホのAPPタブHTMLで毎回呼び出す？
	//★スマホの天気設定HTMLが呼び出される前に車載機が動くので、スマホ側のAPPタブHTMLで設定する？
	//★っていうか、APPタブを起動しなかったら、デフォルトを設定するタイミングもない。。
	//★やはり、設定しなかったら、空表示しかない？それもダメっぽいから、車載機でもデフォルトを持つのか。。
	function	weatherSetting(){
		var	weather_default_JP = [
		{"name":"東京",
			"type":"city",
			"c":"JP",
			"zmw":"00000.1.47671",
			"tz":"Asia/Tokyo",
			"tzs":"JST",
			"l":"/q/zmw:00000.1.47671",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		},
		{"name":"大阪",
			"type":"city",
			"c":"JP",
			"zmw":"00000.1.47772",
			"tz":"Asia/Tokyo",
			"tzs":"JST",
			"l":"/q/zmw:00000.1.47772",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		},
		{"name":"名古屋",
			"type":"city",
			"c":"JP",
			"zmw":"00000.1.47636",
			"tz":"Asia/Tokyo",
			"tzs":"JST",
			"l":"/q/zmw:00000.1.47636",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		}];
		var	weather_default_US = [
		{"name":"New York",
			"type":"city",
			"c":"US",
			"zmw":"10001.5.99999",
			"tz":"America/New_York",
			"tzs":"EST",
			"l":"/q/zmw:10001.5.99999",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		},
		{"name":"Los Angeles",
			"type":"city",
			"c":"US",
			"zmw":"90001.1.99999",
			"tz":"America/Los_Angeles",
			"tzs":"PST",
			"l":"/q/zmw:90001.1.99999",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		},
		{"name":"Chicago",
			"type":"city",
			"c":"US",
			"zmw":"60290.1.99999",
			"tz":"America/Chicago",
			"tzs":"CST",
			"l":"/q/zmw:60290.1.99999",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		},
		{"name":"Houston",
			"type":"city",
			"c":"US",
			"zmw":"77001.1.99999",
			"tz":"America/Chicago",
			"tzs":"CST",
			"l":"/q/zmw:77001.1.99999",
			"phrase":	"",
			"icon":		"",
			"tempc":	0,
			"tempf":	0,
			"localtime":"",
			"unittime":	0
		}];

		//多言語対応
		if(huLocale == "jpn"){
			return	weather_default_JP;	//日本
		}else{
			return	weather_default_US;	//北米
		}
	}
}
//----------------------------------------------------
//時計天気ウィジェットの定期更新
//引数		なし
//戻り値	なし
function digitalClock(){
//	window.setTimeout( "digitalClock()", 1000);	//★1秒後にまた起動
	window.setTimeout( "digitalClock()", 2000);	//★2秒後にまた起動

	var datetime = new Date();
	var	Seconds	= datetime.getSeconds();
	var	minutes	= datetime.getMinutes();
	var	hours	= datetime.getHours();
	if((Seconds == 0)||(Seconds == 1)){
		//1分に1回時計更新
		clockInd();
		clockApp();
	}
}
//----------------------------------------------------
//ビープ音出力要求
//引数		pattern
//戻り値	なし
function	launcherBeep(pattern){
	if(computer == true){
		//何もしない
		console.log("Beep!! " + pattern);
	}else{
		//ビープ音出力要求発行
		jse.setParam(0x1020,pattern,"","","");
	}
}
//----------------------------------------------------
//【戻る】ボタンタップイベント
//引数
//戻り値	なし
function	launcherBackTap(){
	if(computer == true){
		//何もしない
	}else{
		//ビープ音出力要求発行
		launcherBeep("0");	//短音ビープ
		//ナビ画面表示要求発行
		jse.setParam(0x4007,"0","1","","");	//★市販はメニュー画面へ、ランチャー破棄しない。
	}
}
//----------------------------------------------------
//アイコンタップイベント
//引数
//戻り値	なし
function	launcherIconTap(appId,appName,appUrl){
	//----------------------------------------------------
	//Nativeアプリの起動
	if(appName.match("aha")){
		if(computer == false){
			jse.setParam(0x5010,"1","","","");
		}
	}else
	if(appName.match("Pandora")){
		if(computer == false){
			jse.setParam(0x5010,"0","","","");
		}
	}else
	//----------------------------------------------------
	//時計ウィジェット
	if(appName.match("Clock")){
		//短音ビープ要求発行
		launcherBeep("0");

		//12時間表記⇔24時間表記
		if(userSettingObj.cktype == "12"){
			userSettingObj.cktype = "24";
		}else{
			userSettingObj.cktype = "12";
		}
		//時計インジケータとウイジェットを更新
		clockInd();
		clockApp();
		setKeyValueStore("launcher_user_settings",JSON.stringify(userSettingObj),machine,computer);
	}else
	//----------------------------------------------------
	//天気ウィジェット
	if(appName.match("Weather")){
		//短音ビープ要求発行
		launcherBeep("0");

		userSettingObj.wuindex++;
		if(	userSettingObj.wuindex >= weather_AreaObj.length){
			userSettingObj.wuindex = 0;
		}
		weatherApp(userSettingObj.wuindex);	//天気表示切替
		setKeyValueStore("launcher_user_settings",JSON.stringify(userSettingObj),machine,computer);
	}else
	//----------------------------------------------------
	//アプリ起動
	if((appUrl == null)
	|| (app_restriction(appId) == true)
	|| (iconLock == 1)
	){
		//★飛び先URLがない、または走行中利用不可で走行中、またはアイコンロック中なら、アイコンタップは空振り。
		console.log("icon tap invalid!");
	}else{
		//短音ビープ要求発行
		launcherBeep("0");

		if(appId > 200000000){
			if(computer == true){
				//ローカルストレージへIDを保存
				localStorage.setItem("launcher_normalid",appId);
				//HTML5アプリ起動要求発行
				window.open(appUrl,"normalapl");
			}else{
				iconLock = 1;	//★iconロック状態へ
				//ローカルストレージへIDを保存
				localStorage.setItem("launcher_normalid",appId);
				//HTML5アプリ表起動要求発行
				jse.setParam(0x4003,appId,appUrl,"2","");	//★14GPF対応(13.5でもこれでOK)
			//	location.href = appUrl;
			}
		}else{
			if(computer == true){
				//ローカルストレージへIDを保存
				localStorage.setItem("launcher_audioid",appId);
				//HTML5アプリ起動要求発行
				window.open(appUrl,"audioapl");
			}else{
				iconLock = 1;	//★iconロック状態へ
				//ローカルストレージへIDを保存
				localStorage.setItem("launcher_audioid",appId);
				//HTML5アプリ表起動要求発行
				jse.setParam(0x4003,appId,appUrl,"2","");	//★14GPF対応(13.5でもこれでOK)
			//	location.href = appUrl;
			}
		}
	}
	//----------------------------------------------------
	//走行規制判定
	//引数		アプリID
	//戻り値	true=走行規制により利用不可
	function app_restriction(appId){
		for(var i=0;i<app_policyOrder.length;i++){
			if(app_policyOrder[i].id == appId){
				if((app_policyOrder[i].restriction == "1")	//走行中利用不可
				&& (restriction == 1)						//走行中
				){
					return	true;
				}else{
					return	false;
				}
			}
		}
		return	false;
	}
}
//----------------------------------------------------
//時計インジケータ
//引数		なし
//戻り値	なし
function clockInd(){
	var	clockObj	= document.getElementById("clock");
	if(clockObj != null){
		var datetime = new Date();
		var	hours = datetime.getHours();
		var	minutes = datetime.getMinutes();
		//12時間表記対応
		if((userSettingObj.cktype == "12")
		&& (hours  > 12)){
			hours -= 12;
		}
		//1時は、" 1"表示
		if(hours < 10){
			 hours = " " + hours;
		}
		//1分は、"01"表示
		if(minutes < 10){
			 minutes = "0" + minutes;
		}
		clockObj.firstChild.nodeValue = hours + ":" + minutes;
	}
}
//----------------------------------------------------
//時計アプリ
//引数		なし
//戻り値	なし
function clockApp(){
	if(getAppIndex("Clock") != null){
		//時計ウィジェットあり
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var datetime = new Date();

		//----------------------------------------------------
		//年
		var	classObj	= document.getElementById("app5").getElementsByClassName("year");
		classObj[0].firstChild.nodeValue = String(datetime.getFullYear());
		//----------------------------------------------------
		//月日
		var	classObj	= document.getElementById("app5").getElementsByClassName("date");
		var	month = datetime.getMonth() + 1;
		if(month < 10){
			 month = " " + month;
		}
		var	date = datetime.getDate();
		if(date < 10){
			 date = " " + date;
		}
		//----------------------------------------------------
		//時分
		classObj[0].firstChild.nodeValue = month + "/" + date;
		var	classObj	= document.getElementById("app5").getElementsByClassName("clock");
		var	hours = datetime.getHours();
		var	minutes = datetime.getMinutes();
		var	hours2 = hours;	//★背景画像用
		//12時間表記対応
		if((userSettingObj.cktype == "12")
		&& (hours  > 12)){
			hours -= 12;
		}
		//1時は、" 1"表示
		if(hours < 10){
			 hours = " " + hours;
		}
		//1分は、"01"表示
		if(minutes < 10){
			 minutes = "0" + minutes;
		}
		classObj[0].firstChild.nodeValue = hours + ":" + minutes;
		//----------------------------------------------------
		//曜日
		var	classObj	= document.getElementById("app5").getElementsByClassName("day");
		classObj[0].firstChild.nodeValue = days[datetime.getDay()];
		//----------------------------------------------------
		//背景画像
		var	classObj	= document.getElementById("app5");
		switch(hours2){
			case 3:	//	classObj.className = "unitApp typeWidgetApp movable bgType4";	break;
			case 4:	//	classObj.className = "unitApp typeWidgetApp movable bgType4";	break;
			case 5:	//	classObj.className = "unitApp typeWidgetApp movable bgType4";	break;
			case 6:		classObj.className = "unitApp typeWidgetApp movable bgType4";	break;

			case 7:	//	classObj.className = "unitApp typeWidgetApp movable bgType0";	break;
			case 8:	//	classObj.className = "unitApp typeWidgetApp movable bgType0";	break;
			case 9:		classObj.className = "unitApp typeWidgetApp movable bgType0";	break;

			case 10://	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;
			case 11://	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;
			case 12://	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;
			case 13://	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;
			case 14://	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;
			case 15:	classObj.className = "unitApp typeWidgetApp movable bgType1";	break;

			case 16://	classObj.className = "unitApp typeWidgetApp movable bgType2";	break;
			case 17:	classObj.className = "unitApp typeWidgetApp movable bgType2";	break;

		//	case 18:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 19:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 20:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 21:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 22:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 23:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 0:		classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 1:		classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		//	case 2:		classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
			default:	classObj.className = "unitApp typeWidgetApp movable bgType3";	break;
		}
	}
}
//----------------------------------------------------
//天気アプリ
//引数		index
//戻り値	なし
function weatherApp(index){
	if((getAppIndex("Weather") != null)	//天気ウィジェットあり
	&& (weather_AreaObj != null)		//天気設定データあり
	&& (weather_AreaObj.length > 0)		//天気設定データあり
	){
        var now			= new Date();
		var	nowtime		= now.getTime();
		var	obsvtime	= weather_AreaObj[index].unittime;
		if((nowtime - obsvtime) < (1000*60*30)){		//★キャッシュ有効期限は30分とする。(主要都市は30分間隔で更新しているから)
			weatherDisplay(weather_AreaObj[index]);
		}else{
			var originalURL;
			switch(huLocale){
			case "jpn":	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:JP" + weather_AreaObj[index].l + ".json");	break;	//日本語
			case "eng":	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:EN" + weather_AreaObj[index].l + ".json");	break;	//English
			case "fra":	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:FC" + weather_AreaObj[index].l + ".json");	break;	//Canadian French
			case "fre":	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:FC" + weather_AreaObj[index].l + ".json");	break;	//Canadian French
			case "spa":	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:SP" + weather_AreaObj[index].l + ".json");	break;	//Spanish
			default:	originalURL	= encodeURIComponent("http://api.wunderground.com/api/[key]/conditions/lang:EN" + weather_AreaObj[index].l + ".json");	break;	//English
			}
			var	smturl		= httpSA + domainSA + "/tif/v1/?smt-service=h5.proxy.getData&service_provider=wu&method=GET&url=" + originalURL;
			$.ajax({
				type: "GET",		//HTTPメソッド
				url: smturl,		//URL
				dataType: "json",	//応答データタイプ
				async: true,		//非同期通信
				timeout: 30000,		//タイムアウト

				//通信成功
				success: function(data,status,xhr){
					console.log("wunderground GET status=" + status + " code=" + xhr.status);
				//	console.log(data);

					if(data.current_observation){
						weather_AreaObj[index].unittime		= nowtime;
						weather_AreaObj[index].localtime	= data.current_observation.local_time_rfc822;

						//（xx）の前に半角スペースを入れてブラウザが改行するように補正する。
						var	phraseText = data.current_observation.weather;
						if(phraseText.match("（")){
							var	ary	= phraseText.split("（");
							phraseText = ary[0] + " " + "（" + ary[1];
						}
						weather_AreaObj[index].phrase		= phraseText;

						weather_AreaObj[index].icon			= data.current_observation.icon;
						weather_AreaObj[index].tempc		= data.current_observation.temp_c;
						weather_AreaObj[index].tempf		= data.current_observation.temp_f;
						weatherDisplay(weather_AreaObj[index]);
						if(weatherCache == true){
							setKeyValueStore("weather_info_cache",JSON.stringify(weather_AreaObj),machine,computer);
						}
					}else{
						//★wundergroundからのエラーメッセージの場合
						weather_AreaObj[index].phrase		= "[error] " + data.response.error.type;
						weather_AreaObj[index].unittime		= 0;
						weather_AreaObj[index].localtime	= "Tue, 09 Jul 2013 13:20:50 +0900";
						weather_AreaObj[index].icon			= "";
						weather_AreaObj[index].tempc		= 0;
						weather_AreaObj[index].tempf		= 0;
						weatherDisplay(weather_AreaObj[index]);
					}
				},
				//通信失敗
				error: function(xhr,status,err){
					console.log("wunderground GET status=" + status + " code=" + xhr.status);
				//	console.log(err);
				//	console.log(xhr.getAllResponseHeaders());
				}
			});
		}
	}
}
//----------------------------------------------------
//天気情報更新
//引数
//戻り値	なし
function weatherUpdate(){
	window.setTimeout("weatherUpdate()",((1000*60*30)+1));	//★30分+1ms後にまた起動
	//30分に1回天気表示更新(主要都市は30分間隔で更新しているから)
	//6時と18時にアイコン切り替え(昼⇔夜)
	weatherApp(userSettingObj.wuindex);
}
//----------------------------------------------------
//天気ウィジェット表示
//引数		weatherInfo
//戻り値	なし
function weatherDisplay(weatherInfo){
	var	classObj	= document.getElementById("app7").getElementsByClassName("location");
	var	ary	= weatherInfo.name.split(",");
	classObj[0].childNodes[0].firstChild.nodeValue = ary[0];

	var	classObj	= document.getElementById("app7").getElementsByClassName("weatherName");
	classObj[0].childNodes[0].firstChild.nodeValue = weatherInfo.phrase;

	var	classObj	= document.getElementById("app7").getElementsByClassName("degrees");
	if(userSettingObj.temptype == "C"){
		classObj[0].childNodes[1].firstChild.nodeValue = String(Math.round(weatherInfo.tempc));	//気温を四捨五入
		classObj[0].childNodes[3].firstChild.nodeValue = "\u2103";	//摂氏
	//	classObj[0].childNodes[3].firstChild.nodeValue = "ﾟC";		//摂氏
	}else{
		classObj[0].childNodes[1].firstChild.nodeValue = String(Math.round(weatherInfo.tempf));	//気温を四捨五入
	//	classObj[0].childNodes[3].firstChild.nodeValue = "\u2109";	//華氏
		classObj[0].childNodes[3].firstChild.nodeValue = "ﾟF";		//華氏
	}

	var	classObj	= document.getElementById("app7").getElementsByClassName("weatherIcon");
	classObj[0].className = getWeatherIcon(	 weatherInfo.icon
											,weatherInfo.phrase
											,weatherInfo.localtime);
	return;
	//----------------------------------------------------
	//天気アイコンクラス取得
	function getWeatherIcon(iconname,phrase,datestr){
			var	hours = Number(datestr.substr(17,2));	//"Tue, 09 Jul 2013 13:20:50 +0900"からローカル時間を取得
			var	iconclass;

			switch(iconname){
				case "clear":
				case "sunny":
					if(DayNight(hours) == true){
						iconclass = "weatherIcon icoSunnyDay";
					}else{
						iconclass = "weatherIcon icoSunnyNight";
					}
					break;
				case "mostlysunny":
				case "partlysunny":
					if(DayNight(hours) == true){
						iconclass = "weatherIcon icoMostlySunnyDay";
					}else{
						iconclass = "weatherIcon icoMostlySunnyNight";
					}
					break;
				case "mostlycloudy":
				case "partlycloudy":
					if(DayNight(hours) == true){
						iconclass = "weatherIcon icoMostlyCloudyDay";
					}else{
						iconclass = "weatherIcon icoMostlyCloudyNight";
					}
					break;
				case "hazy":	//もや
					if(DayNight(hours) == true){
						iconclass = "weatherIcon icoHazyDay";
					}else{
						iconclass = "weatherIcon icoHazyNight";
					}
					break;
				case "sleet":
					if(phrase.match("Freezing")){
						iconclass = "weatherIcon icoFreezingRain";	//雨氷
					}else
					if(phrase.match("氷")){
						iconclass = "weatherIcon icoFreezingRain";	//雨氷
					}else{
						iconclass = "weatherIcon icoSleet";			//みぞれ
					}
					break;
				case "cloudy":			iconclass = "weatherIcon icoCloudy";			break;	//曇り
				case "flurries":		iconclass = "weatherIcon icoFlurries";			break;	//突風（にわか雨？）
				case "fog":				iconclass = "weatherIcon icoFog";				break;	//霧
				case "rain":			iconclass = "weatherIcon icoRain";				break;	//雨
				case "snow":			iconclass = "weatherIcon icoSnow";				break;	//雪
				case "tstorms":			iconclass = "weatherIcon icoThunderStorm";		break;	//雷雨
				case "unknown":			iconclass = "weatherIcon icoThunderStorm";		break;	//雷雨
				default:				iconclass = "weatherIcon";						break;	//[空白]
			}
			return	iconclass;
		//----------------------------------------------------
		//昼=true/夜=false
		function DayNight(hours){
			switch(hours){
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
				case 14:
				case 15:
				case 16:
				case 17:
					return true;
				case 18:
				case 19:
				case 20:
				case 21:
				case 22:
				case 23:
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				default:
					return false;
			}
		}
	}
}
//----------------------------------------------------
//NPAPIイベント受信関数(イベントリスナ)
var	normalid	= 0;
var	audioid		= 0;
var	normalidNG	= 0;
var	audioidNG	= 0;
function notifyEventFunction(id, param1, param2, param3, param4){
	//イベントIDに応じた処理を実装
	switch(id){
		//----------------------------------------------------
		//HTML5アプリ起動成功応答
		case 0x4004:
			console.log("app start OK!! " + param1);
			iconLock = 0;	//★iconロック状態解除
			if(param1 > 200000000){
				normalid = param1;
			}else{
				audioid = param1;
			}
			break;
		//----------------------------------------------------
		//HTML5アプリ起動失敗応答
		case 0x4005:
			console.log("app start NG!! " + param1);
			iconLock = 0;	//★iconロック状態解除
			if(param1 > 200000000){
				normalidNG = param1;
			}else{
				audioidNG = param1;
			}
			break;
		//----------------------------------------------------
		//画面状態通知
		case 0x4006:
			console.log("launcher display: " + param1);
			iconLock = 0;	//★iconロック状態解除
			if(param1 == 0){
				//Background
				$("#waitingView").hide();	//★起動時のぐるぐるアニメーションは強制停止
			}else{
				//Foreground
				//全画面対応(他のコンテンツで半画面にしたのを戻す)
				jse.setParam(0x1050,"3","","","");
				//壁紙変更
				var	lbgType = localStorage.getItem("launcher_bgType");
				var	bbgType = localStorage.getItem("background_bgType");
				if(lbgType != bbgType){
					//壁紙変更!!
					localStorage.setItem("launcher_bgType",bbgType);
					$("#wrapper").removeClass();
					$("#wrapper").addClass(bbgType);
					userSettingObj.bgType = bbgType;
					setKeyValueStore("launcher_user_settings",JSON.stringify(userSettingObj),machine,computer);
				}
				//ivoiceからの起動要求
				var	ivoiceAppid = localStorage.getItem("call_html5_app_id");
				if(ivoiceAppid > 100000000){	//有効な起動要求か？
					//ivoiceからの起動要求をクリア
					localStorage.setItem("call_html5_app_id",0);
					console.log("start request from ivoice " + ivoiceAppid);
					for(var i=0;i<app_policyOrder.length;i++){
						if(ivoiceAppid == app_policyOrder[i].id){
							//ローカルストレージへIDを保存
							if(ivoiceAppid > 200000000){
								localStorage.setItem("launcher_normalid",ivoiceAppid);
							}else{
								localStorage.setItem("launcher_audioid",ivoiceAppid);
							}
							//HTML5アプリ起動要求発行
							jse.setParam(0x4003,app_policyOrder[i].id,app_policyOrder[i].url,"","");
						}
					}
				}
			}
			break;
		//----------------------------------------------------
		//走行規制状態通知
		case 0x4009:
			console.log("launcher restriction: " + param1);
			restriction	= param1;
			break;
		//----------------------------------------------------
		//HTML5クイック起動通知
		case 0x1220:
			console.log("app quick start!! " + param1);
			for(var i=0;i<app_policyOrder.length;i++){
				if(param1 == app_policyOrder[i].id){
					//ローカルストレージへIDを保存
					if(app_policyOrder[i].id > 200000000){
						localStorage.setItem("launcher_normalid",app_policyOrder[i].id);
					}else{
						localStorage.setItem("launcher_audioid",app_policyOrder[i].id);
					}
					//裏起動要求対応判定
					var ret = jse.getParam(0x1000,"0x400B");
					if(ret.result == 0){
						if(ret.outParam1 == "1"){
							//★14モデル以降	HTML5アプリ裏起動要求発行
							jse.setParam(0x400B,app_policyOrder[i].id,app_policyOrder[i].url,"","");
						}else{
							//★13.5モデル	HTML5アプリ起動要求発行
							jse.setParam(0x4003,app_policyOrder[i].id,app_policyOrder[i].url,"","");
						}
					}else{
						//★13.5モデル	HTML5アプリ起動要求発行
						jse.setParam(0x4003,app_policyOrder[i].id,app_policyOrder[i].url,"","");
					}
				}
			}
			break;
		//----------------------------------------------------
		default:
			break;
	}
}
//----------------------------------------------------
//<body onload="init()">
function init(){
	//----------------------------------------------------
	//ユーザーエージェント
	if((navigator.userAgent.match("iPhone"))||(navigator.userAgent.match("iPod"))||(navigator.userAgent.match("iPad"))){
		machine 	= "phone";		//スマホ
		computer	= false;		//
	}else
	if(navigator.userAgent.match("Android")){
		machine 	= "phone";		//スマホ
		computer	= false;		//
	}else
	if(navigator.userAgent.match("Chrome")){
		machine		= "vehicle";	//車載機
		computer	= true;			//★PC上での確認時にtrue
	}else
	if(navigator.userAgent.match("Firefox")){
		machine		= "vehicle";	//車載機
		computer	= true;			//★PC上での確認時にtrue
	}else
	if(navigator.userAgent.match("demobrowser")){	//★Ubuntuのデモブラウザ
		machine		= "vehicle";	//車載機
		computer	= true;			//★PC上での確認時にtrue
	}else{
		machine		= "vehicle";	//車載機
		computer	= false;		//
	}
	//----------------------------------------------------
	//ドメイン、SSL設定
	var	urlAry	= location.href.split("/");
	//httpSA		= urlAry[0] + "//";		//"http://" or "https://"
	//domainSA	= urlAry[2];			//"sat01.clarion.co.jp" or "tvespa.clarion.co.jp" or "www.smt-access.com"
	httpSA      =  "https://";
	domainSA    =  "tvespa.clarion.co.jp";
	//----------------------------------------------------
	//NPAPIインスタンスを生成
		if(computer == false){
			// NaviNativeAPIクラスのインスタンス取得
			var plugin = document.getElementById( "plugin" );
			jse = plugin.NaviNativeAPI( 2 );	//★"2"がLauncherのNPAPI ID
			// イベントリスナの登録
			jse.setNotifyEventListener( notifyEventFunction );
			// アプリ起動完了通知 (これがないとタッチが効かない)
			jse.setParam( 0x4000, "", "", "", "" );

			//車載機言語設定(ISO639-2)取得
			var ret = jse.getParam(0x1100,"");
			if(ret.result == 0){
				huLocale = ret.outParam1;
			}else{
				huLocale = "jpn";
			}
		}

	var	ppwCode		= null;			//車載機PPW

	var	mwsStorePid		= null;
	var	mwsStorePolicy	= null;
	var	mwsOtherPid		= null;
	var	mwsOtherPolicy	= null;

	var policyDOM	= null;			//ポリシー(DOM)
	var	policyTXT	= null;			//ポリシー(Text)
	var	policyPid	= null;			//PID(機種コード+シリアル)
	var	policyLast	= null;			//最終更新日時
	var	policyNext	= null;			//次回取得日時

	var mwspolDOM 	= null;			//MWSポリシー(DOM)
	var mwspolTXT 	= null;			//MWSポリシー(Text)
	var	mwspolPid	= null;			//MWS PID(機種コード+シリアル)
	var	mwspolLast	= null;			//MWS最終更新日時
	var	mwspolNext	= null;			//MWS次回取得日時

	startup();

	//----------------------------------------------------
	//初期起動シーケンス
	function startup(){
		//----------------------------------------------------
		//端末情報表示と設定
        var now = new Date();
		console.log(now.toLocaleString());
		outputString(location.href);
		outputString(navigator.userAgent);
		outputString(document.cookie);

			//車載機
			mwsStoreUrl		= "launcher_url_vehicle";
			mwsStorePid		= "launcher_pid_vehicle";
			mwsStorePolicy	= "launcher_policy_vehicle";
			mwsOtherPid		= "launcher_pid_phone";
			mwsOtherPolicy	= "launcher_policy_phone";

		launcherStart();	//ランチャー起動
	}
	//----------------------------------------------------
	//ランチャー起動
	function launcherStart(){
		//----------------------------------------------------
		//PIDを取得する
		//車載機の場合は、クッキーからPIDを取得する。
		//スマホの場合は、MWSの車載機データストアからPIDを取得する。
		policyPid = getCookie("PID");
		//----------------------------------------------------
		//PIDをlocalStorageに展開する。	★ivoiceの利用規約処理に使用する
		localStorage.setItem("launcher_pid", policyPid);
		//----------------------------------------------------
		//PPWをハードコードから取得する@@@@
		//本来はNPAPIで認証クッキーを作成するので不要。NPAPI未対応やPCで開発する場合に必要
		switch(policyPid){
			case "QY7310AA00000001":	ppwCode = "664f365d25603e3170254f405b6e3763";	break;
			case "PF3636IA99999502":	ppwCode = "733c3a3c283b2336447a72503642763d";	break;
			case "QY0005CA99999002":	ppwCode = "6b6b366e28503c4538446f422b3f5575";	break;
			case "QY0005CA99999003":	ppwCode = "382e2279434f3e484c5f4b3f2f4e2e3e";	break;
			case "QY0005CA99999004":	ppwCode = "4b42482b3b6766397329793e584a6f46";	break;
			case "QY0005CA99999005":	ppwCode = "3078577a773570527b236e6e732b2647";	break;
			case "QY0005CA99999006":	ppwCode = "2953304c2c5f4e35326e63283b234333";	break;
			case "QY0005CA99999007":	ppwCode = "7e5a4f66573d34393149475d7a7b5577";	break;
			case "QY0005CA99999008":	ppwCode = "732360507a4640306c2227292a596c59";	break;
			case "QY0005CA99999009":	ppwCode = "225d616d23782f5d3d583f582a29676d";	break;
			case "QY7440AA99999507":	ppwCode = "2537274927535f36677d765a62557d2c";	break;	//MFI認証用
			case "QY7440AA99999508":	ppwCode = "4e4a7d2c6b6d2b2c24314c6b7852743d";	break;
			case "QY7440AA99999509":	ppwCode = "364e50277c51475d4a4b7b7d2a47504f";	break;
			case "QY7440AA99999510":	ppwCode = "77395b413b7771445f4c2f21573d6165";	break;
			case "QY7440AA99999521":	ppwCode = "423e486d2a507e4f477c3164583b4848";	break;	//車載機検証用
			case "QY7440AA99999526":	ppwCode = "717c24293928406d78534554424d6e7e";	break;	//峰岸開発用
			case "QY7440AA99999528":	ppwCode = "2f6e684f75583360705c607c4427406e";	break;	//CXEE開発用
			case "PF3547IA99999602":	ppwCode = "69756d4025473a79395c3767305a7b2a";	break;	//BF4走行テスト用
			default:					ppwCode = "00000000000000000000000000000000";	break;
		}
		outputString("Vehicle PID=" + policyPid);
		outputString("Vehicle PPW=" + ppwCode.substr(0,4) + "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

		//----------------------------------------------------
		//ポリシー取得＆展開		★同期なので完了するまでリターンしません。
		if(htmlPolicy() == true){
			var	ap_html5_id		= 1;
			var	ap_name			= 3;
			var	ap_top_url		= 8;
			var	ap_icon_url		= 10;
			var	ap_vertical		= 11;
			var	ap_horizontal	= 12;
			var	ap_restriction	= 13;
			var	ap_support		= 15;
			var	ap_display		= 17;
			var	appinfoobj		= policyDOM.getElementsByTagName("APP_INFO");

			//----------------------------------------------------
			//ランチャーのURLとポリシーのURLを比較して、異なっていれば自動的に自分のバージョンUpをする
			//ポリシーにランチャーは複数あるので、そこから自分を検索するのは、ランチャー識別子が必要。
			for(var i=0;i<appinfoobj.length;i++){
				if(appinfoobj[i].childNodes[ap_support].firstChild.nodeValue == 0){
				//	if(appinfoobj[i].childNodes[ap_name].childNodes[1].firstChild.nodeValue == "Launcher")
					if(appinfoobj[i].childNodes[ap_name].childNodes[1].firstChild.nodeValue.match("Launcher"))
					{
						var	url	= appinfoobj[i].childNodes[ap_top_url].firstChild.nodeValue;
					//	if(url == location.href)	//★appchacheの関係で、index.htmlとstart.htmlとなったため変更
						if((url.substr(0,(url.length-10))) == (location.href.substr(0,(location.href.length-10))))
						{
							//ランチャーのURLとポリシーのURLは同じ
						}else{
							//ポリシーのランチャーURLをMWSに保存する(これがlocal.htmlの飛び先となる)
							setKeyValueStore(mwsStoreUrl,url,machine,computer);
							//自分自信をバージョンUp!!
						//	window.alert("Launcher Versionup!");
							console.log("Launcher Versionup!");
							console.log("policy   URL=" + url);
							console.log("launcher URL=" + location.href);
//							location.href = url;
						}
					}
				}
			}
			//----------------------------------------------------
			//ナビ表示ON/OFF情報の読み込み
			var	dispJSON = getKeyValueStore("launcher_app_display",machine,computer);
			if((dispJSON != null)		//ナビ表示ON/OFF情報は存在するか？
		//	&& (userSetting == true)	//ユーザ設定情報は有効か？	★PIDに紐付かない情報
			){
				dispSettingObj = JSON.parse(dispJSON);
			}else{
				dispSettingObj = [];
			}
			function	iconDisplay(appID){
				for(var i=0;i<dispSettingObj.length;i++){
					if(dispSettingObj[i].id == appID){
						return dispSettingObj[i].display;
					}
				}
				return "ON";	//★スマホの情報が無ければ『ナビ表示ON』
			}
			//----------------------------------------------------
			//アプリケーションリストの作成
			//ポリシーから必要なアプリの連想配列を作成する
			var	app_upperList	= [];	//配列の初期化
			var	app_lowerList	= [];	//配列の初期化
		//	var	apphashmap		= {};	//連想配列の初期化
			for(var i=0,k=0,v=0;i<appinfoobj.length;i++){
				if((appinfoobj[i].childNodes[ap_support].firstChild.nodeValue == 0)
				&&((appinfoobj[i].childNodes[ap_display].firstChild.nodeValue == 0)||(appinfoobj[i].childNodes[ap_display].firstChild.nodeValue == 2))
				){
				//	if(appinfoobj[i].childNodes[ap_name].childNodes[1].firstChild.nodeValue == "Launcher")
					if(appinfoobj[i].childNodes[ap_name].childNodes[1].firstChild.nodeValue.match("Launcher"))
					{
						//★ランチャー自身です
					}else{
					  if(iconDisplay(appinfoobj[i].childNodes[ap_html5_id].firstChild.nodeValue) == "OFF"){
						console.log("display off = " + appinfoobj[i].childNodes[ap_html5_id].firstChild.nodeValue);
					  }else{
						var	apphashmap = new Object();
						apphashmap.id		= appinfoobj[i].childNodes[ap_html5_id].firstChild.nodeValue;
					//	apphashmap.name 	= appinfoobj[i].childNodes[ap_name].childNodes[0].firstChild.nodeValue;	//日本名
						apphashmap.name 	= appinfoobj[i].childNodes[ap_name].childNodes[1].firstChild.nodeValue;	//English Name
						apphashmap.order	= appinfoobj[i].childNodes[ap_horizontal].firstChild.nodeValue;
						apphashmap.restriction	= appinfoobj[i].childNodes[ap_restriction].firstChild.nodeValue;

						if(appinfoobj[i].childNodes[ap_top_url].firstChild != null){
							apphashmap.url		= appinfoobj[i].childNodes[ap_top_url].firstChild.nodeValue;
						}else{
							apphashmap.url		= null;	//★URLは空の場合があるので判断が必要
						}
						if(appinfoobj[i].childNodes[ap_icon_url].firstChild != null){
							apphashmap.icon		= appinfoobj[i].childNodes[ap_icon_url].firstChild.nodeValue;
						}else{
							apphashmap.icon		= null;	//★URLは空の場合があるので判断が必要
						}

						if(appinfoobj[i].childNodes[ap_vertical].firstChild.nodeValue == 1){
							apphashmap.updown	= 0;
							app_upperList[k]	= apphashmap;	//★上段アプリ
							k++;
						}else{
							apphashmap.updown	= 1;
							app_lowerList[v]	= apphashmap;	//★下段アプリ
							v++;
						}
					  }
					}
				}
			}
			//----------------------------------------------------
			//車載機の並び順にソートする(上段)
			app_upperList.sort(
				function(a,b){
					var aa = Number(a.order);
					var bb = Number(b.order);
					if( aa < bb ) return -1;
					if( aa > bb ) return 1;
					return 0;
				}
			);
			//----------------------------------------------------
			//車載機の並び順にソートする(下段)
			app_lowerList.sort(
				function(a,b){
					var aa = Number(a.order);
					var bb = Number(b.order);
					if( aa < bb ) return -1;
					if( aa > bb ) return 1;
					return 0;
				}
			);
			//----------------------------------------------------
			//ソート後、ゼロ始まりで順番になるように補正する。同時にひとつのGlobal配列にも格納。
			for(var i=0;i<app_upperList.length;i++){
				app_upperList[i].order = i;		//★0,1,2,3～
				app_policyOrder[app_policyOrder.length]	= app_upperList[i];
			}
			for(var i=0;i<app_lowerList.length;i++){
				app_lowerList[i].order = i;		//★0,1,2,3～
				app_policyOrder[app_policyOrder.length]	= app_lowerList[i];
			}
		//	outputObject("policy Order",app_policyOrder);

			//----------------------------------------------------
			//ユーザ情報の読み込み	★launcherGlobal.initDesign()の中で表示ページを決定するので、この場所を動かせない。
			var	userJSON = getKeyValueStore("launcher_user_settings",machine,computer);
			if((userJSON != null)		//ユーザ情報は存在するか？
		//	&& (userSetting == true)	//ユーザ設定情報は有効か？	★PIDに紐付かない情報
			){
				var	userOBJ = JSON.parse(userJSON);
				if(userOBJ.bgType){
					userSettingObj			= userOBJ;
				}else{
					//温度単位だけスマホで設定するので、この対応が必要。
					userSettingObj.temptype	= userOBJ.temptype;
				}
			}
			//壁紙情報初期化
			localStorage.setItem("launcher_bgType",userSettingObj.bgType);
			localStorage.setItem("background_bgType",userSettingObj.bgType);
			//----------------------------------------------------
			//ivoiceからの起動要求初期化
			localStorage.setItem("call_html5_app_id",0);
			//----------------------------------------------------
			//ランチャー・デザイン初期化
			//outputString("launcherGlobal.initDesign()");
			launcherGlobal.initDesign();
			//----------------------------------------------------
			//時計インジケータ
			clockInd();
			//----------------------------------------------------
			//時計ウィジェット
			clockApp();
			//----------------------------------------------------
			//壁紙初期表示
			$("#wrapper").removeClass();
			$("#wrapper").addClass(userSettingObj.bgType);
			//----------------------------------------------------
			//天気ウイジェット
			weatherInit();
			//----------------------------------------------------
			//CORSポリシー取得＆設定	★非同期なので即リターンします。
			corsPolicy();
			//----------------------------------------------------
			//時計と天気更新タイマー起動
			window.setTimeout( "digitalClock()", 2000);	//★2秒後に起動
			//----------------------------------------------------
			//クッキー更新処理起動
			bakeCookie_ppwCode	= ppwCode;
	        window.setTimeout( "bakeCookie()", 60000);
			//----------------------------------------------------
			//PID履歴更新処理起動
			window.setTimeout( "pidHistory()", 3000);	//★N秒後に起動
		}else{
			outputString("Because I cannot acquire policy, I stop..");
			outputString("I acquire it with [Reload] button again.");
			//location.href = "error.html";	//★エラー表示して【Close】ボタンでランチャータブを終了。。
		}
	}
	//----------------------------------------------------
	//ポリシー取得＆展開
	/*
	車載機はACCONの度に前回ポリシーを見て有効期限が過ぎていたら取りに行く。
	NPAPIでPIDを取得する。
	サーバは変更が無ければ、Not Modifiedを返す。
	ポリシーはデータストアに車載機用として格納する。
	ローカルストレージを使用して各アプリに展開する。

	スマホの場合、起動とOnloadの度に前回ポリシーを見て有効期限が過ぎていたら取りに行く。
	車載機用データストアからPIDを取得する。※PIDが無ければデフォルトポリシーを受信することになる。
	サーバは変更が無ければ、Not Modifiedを返す。
	ポリシーはデータストアにスマホ用として格納する。
	スマホ用データストアを使用して各アプリに展開する。※ローカルストレージを使用しないのはセキュリティのため。

	車載機とスマホは独立して動いているが、基本は同じ処理にして、互いに影響したり、競合したりする関係にはしない方針とする。
	これを異なる処理で、影響する関係にすると、工数も掛かるし、リスクも負うし、メリットよりもデメリットの方が大きいと思われる。

	スマホ側でPIDが取得できない場合は、内部的にPID="0000000000000000"で持ち、
	SAサーバに接続する時、Input,Outputを調整してデフォルトポリシーを取得する。

	×車載機がデータストアのスマホ用のポリシーを見に行くのは、受信エラーで車載機用ポリシーもないときのみ。
	×スマホがデータストアの車載機用のポリシーを見に行くのは、受信エラーでスマホ用ポリシーもないときのみ。
	↑これが有効になるケースが想定できないので、ここまでやる必要もない。

	※WebViewでは、ランチャー.htmlでしかポリシーを受信しないのだから、他のhtmlのときはいつまでたっても受信しない。。
	*/
    function htmlPolicy() {
		//----------------------------------------------------
		//MWSに保存したPIDを取得する
	//	if(getMWSPid(mwsStorePid) != policyPid.substr(0,8))	//★機種コードを比較
		if(getMWSPid(mwsStorePid) != policyPid)				//★PIDを比較

		{
			//MWSにPIDがない(初めて接続されたスマホ)
			//または、車載機と機種コードが一致しない
			outputString("MWS-PID invalid");
			mwspolDOM 	= null;
			mwspolTXT 	= null;
			mwspolPid	= null;
			mwspolLast	= null;
			mwspolNext	= null;
			userSetting	= false;	//ユーザ設定情報を無効にする
		}else{
			//----------------------------------------------------
			//MWSに保存したポリシーを取得する
			if(getMWSPolicy(mwsStorePolicy) != policyPid.substr(0,8)){
				//MWSにポリシーがない(初めて接続されたスマホ)
				//または、車載機と機種コードが一致しない
				outputString("MWS-Policy invalid");
				mwspolDOM 	= null;
				mwspolTXT 	= null;
				mwspolPid	= null;
				mwspolLast	= null;
				mwspolNext	= null;
				userSetting	= false;	//ユーザ設定情報を無効にする
			}else{
				//----------------------------------------------------
				//ポリシーの有効期限を確認する
		        var nowDate = new Date();
				var	now		= nowDate.getTime();	//1970年1月1日0時0分0秒（UTC）からの秒数（ミリ秒単位）
				var	next	= Date.parse(mwspolNext + " GMT+0000");	//★ポリシーの時間はUTCなので" GMT+0000"を追加する

				var dateobj = new Date(now);
				outputString("now date(UTC)  " + dateobj.getTime() + " " + dateobj.toUTCString());
				var dateobj = new Date(next);
				outputString("next date(UTC) " + dateobj.getTime() + " " + dateobj.toUTCString());

				if(now > next){
					//有効期限切れなのでSAサーバからポリシーを受信する
					outputString("Because data are out of expiration date, I receive policy from an SA server.");
				//	mwspolDOM 	= null;	//★SAサーバから受信できない場合には使用するため無効にしない。
				//	mwspolTXT 	= null;
				//	mwspolPid	= null;
				//	mwspolLast	= null;
				//	mwspolNext	= null;
				}else{
					//有効期限内なのでMWSのポリシーを使用する
					outputString("Because data are expiration date, I use policy of MWS.");
					policyDOM	= mwspolDOM;
					policyTXT	= mwspolTXT;
				//	policyPid	= mwspolPid;	//★コピーに意味はないし、シリアル違いの可能性もある。
					policyLast	= mwspolLast;
					policyNext	= mwspolNext;

					//ポリシーをローカルストレージで各アプリに展開
					outputString("I develop policy for each application in a local storage.");
					localStorage.setItem("launcher_policy", policyTXT);
					return true;	//★★★★ポリシー取得処理完了★★★★
				}
			}
		}
		//----------------------------------------------------
		//MWSのポリシーが有効にならなければ、SAサーバから受信してMWSへ保存する
		switch(getPolicy(policyPid,mwspolLast)){
			case "INF_POLGET_000001":
				//ポリシー取得成功
				//利用不可アプリを取り除く	★オブジェクトが、その場で減っていくので、後ろから削除する。
				var	app_info	= policyDOM.getElementsByTagName("APP_INFO");
				var	app_count	= app_info.length;
				var	app_index	= app_count-1;
				for(var i=0;i<app_count;i++){
					if((app_info[app_index].childNodes[15].firstChild == null)
					|| (app_info[app_index].childNodes[15].firstChild.nodeValue != 0)
					){
						policyDOM.documentElement.removeChild(app_info[app_index]);
					}
					app_index--;
				}
				outputObject("Policy(support)",policyDOM);

				var Serializer = new XMLSerializer();
				policyTXT = Serializer.serializeToString(policyDOM);

				//ポリシー日付を保存
				var tagname = policyDOM.getElementsByTagName("POLICY_DATE");
				policyLast	= tagname[0].childNodes[0].nodeValue;
				outputString("Policy last date=" + policyLast);
				var	tagname = policyDOM.getElementsByTagName("POLICY_NEXT_GET_DATE");
				policyNext	= tagname[0].childNodes[0].nodeValue;
				outputString("Policy next date=" + policyNext);

				//ポリシーをローカルストレージで各アプリに展開
				outputString("I develop policy for each application in a local storage.");
				localStorage.setItem("launcher_policy", policyTXT);

				//MWSにポリシーを保存
				setMWSPolicy(policyTXT);					//
				setMWSPid(policyPid,policyLast,policyNext);	//★順序的にこっちを後にしないと整合が取れなくなる
				return true;	//★★★★ポリシー取得処理完了★★★★
				break;
			case "INF_POLGET_000005":
				//ポリシー取得成功(変更なし)
				//ポリシー日付を保存
				var tagname = policyDOM.getElementsByTagName("POLICY_DATE");
				policyLast	= tagname[0].childNodes[0].nodeValue;
				outputString("Policy last date=" + policyLast);
				var	tagname = policyDOM.getElementsByTagName("POLICY_NEXT_GET_DATE");
				policyNext	= tagname[0].childNodes[0].nodeValue;
				outputString("Policy next date=" + policyNext);

				if(mwspolDOM != null){	//★念のため、nullチェック
					//ポリシーの更新がないのでMWSのポリシーを使用する
					outputString("Because there is not update of the policy, I use policy of MWS.");
					policyDOM	= mwspolDOM;
					policyTXT	= mwspolTXT;
				//	policyPid	= mwspolPid;	//★コピーに意味はないし、シリアル違いの可能性もある。
				//	policyLast	= mwspolLast;	//★SAサーバを優先する。
				//	policyNext	= mwspolNext;	//★SAサーバを優先する。次回取得日時は更新されている。

					//ポリシーをローカルストレージで各アプリに展開
					outputString("I develop policy for each application in a local storage.");
					localStorage.setItem("launcher_policy", policyTXT);

					//MWSのポリシー取得日時のみ更新
				//	setMWSPolicy(policyTXT);					//
					setMWSPid(policyPid,policyLast,policyNext);	//★順序的にこっちを後にしないと整合が取れなくなる
					return true;	//★★★★ポリシー取得処理完了★★★★
				}
				break;
			default:
				//ポリシー取得失敗
				break;
		}
		//----------------------------------------------------
		//この時点でポリシーが確定していなければ、
		//期限切れのMWSポリシーを使うか、もう一方(車載機ならスマホということ)のポリシーを使う。
		//それらも使えない場合、停止するしかない。。
		if(mwspolDOM != null){
			if(policyPid.substr(0,8) == mwspolPid.substr(0,8)){
				//機種コードが一致したポリシーがあれば、
				//SAサーバから受信できないので期限切れのMWSポリシーを使用する
				outputString("Because I cannot receive it from an SA server, I use MWS policy out of expiration date.");
				policyDOM	= mwspolDOM;
				policyTXT	= mwspolTXT;
			//	policyPid	= mwspolPid;	//★コピーに意味はないし、シリアル違いの可能性もある。
				policyLast	= mwspolLast;
				policyNext	= mwspolNext;

				//ポリシーをローカルストレージで各アプリに展開
				outputString("I develop policy for each application in a local storage.");
				localStorage.setItem("launcher_policy", policyTXT);
				return true;	//★★★★ポリシー取得処理完了★★★★
			}
		}

		//もう一方(車載機ならスマホということ)のポリシーを使う？
		//車載機でデフォルトポリシーを使用するケースが連動式にあるのか？
		//OEMで例えば市販のデフォルトポリシーを使用して問題にならないのか？
		//既にLauncherとか異なる想定である。これが連動式にはない？

		return false;	//★★★★ポリシー取得処理失敗★★★★
	}
	//----------------------------------------------------
	//文字列出力	★実行環境によって出力先を変える
	//テスト	完了
	function outputString(str){
		if(computer == true){
			console.log(str);
		}
	}
	//----------------------------------------------------
	//オブジェクト出力	★実行環境によって出力先を変える
	//テスト	完了
	function outputObject(str,obj){
		if(computer == true){
			console.log(str);
//			console.log(obj);
		}
	}
	//----------------------------------------------------
	//ポリシーをSAサーバから取得する
	//引数		pid		PID
	//			Last	最終更新日時
	//戻り値	null or ポリシーリターンコード
	//Output	policyDOM	ポリシーオブジェクト
	//			policyTXT	ポリシーテキスト
	function getPolicy(pid,last) {
		policyDOM	= null;
		policyTXT	= null;
		policyLast	= null;
		policyNext	= null;

		$.ajax({
			type: "GET",		//HTTPメソッド
			url: "policy.xml",	//URL
			dataType: "xml",	//応答データタイプ
			async: false,		//同期通信
			timeout: 30000,		//タイムアウト

			//通信成功
			success: function(data,status,xhr){
				outputString("Policy GET status=" + status + " code=" + xhr.status);
			//	outputObject("Policy",data);

				policyDOM	= data;
				policyTXT	= xhr.responseText;
			},
			//通信失敗
			error: function(xhr,status,err){
				console.log("Policy GET status=" + status + " code=" + xhr.status);
			}
		});

		//戻り値を決定	★同期通信なので、ここで戻り値決定できる。CallBack関数からreturnはできないよ！
		if(policyDOM == null){
			return	null;
		}else{
			var	tagname = policyDOM.getElementsByTagName("RETURN_CD");
			var	retcode	= tagname[0].childNodes[0].nodeValue;
			console.log("Policy [RETURN_CD] code=" + retcode);
			return	retcode;
		}
	}
	//----------------------------------------------------
	//ポリシーのPID、最終更新日時、次回取得日時をMWSデータストアへ保存する
	//引数		pid		PID
	//			Last	最終更新日時
	//			Next	次回取得日時
	//戻り値	なし
	//Input		mwsStorePid
    function setMWSPid(pid,last,next) {
		if((pid == null)||(last == null)||(next == null)){
			outputString("PID -> MWS NG(null)");
		}else{
			var	piddate = pid + ";" + last + ";" + next;
			setKeyValueStore(mwsStorePid, piddate,machine,computer);
			outputString("PID -> MWS OK " + piddate);
		}
	}
	//----------------------------------------------------
	//ポリシーのPID、最終更新日時、次回取得日時をMWSデータストアから取得する
	//引数		pidkey
	//戻り値	null or 機種コード
	//Output	mwspolPid	PID
	//			mwspolLast	最終更新日時
	//			mwspolNext	次回取得日時
	function getMWSPid(pidkey){
		mwspolPid	= null;
		mwspolLast	= null;
		mwspolNext	= null;

		//MWSデータストアから取得
		var	pid	= getKeyValueStore(pidkey,machine,computer);
		if(pid == null){
			outputString("PID <- MWS NG(not exist)");
			return	null;
		}else{
			outputString("PID <- MWS OK");

			var	ary	= pid.split(";");
			mwspolPid	= ary[0];
			mwspolLast	= ary[1];
			mwspolNext	= ary[2];
			console.log("MWS pid=" + pid);
			outputString("MWS pid=      " + mwspolPid.substr(0,8));
			outputString("MWS serial=   " + mwspolPid.substr(8,8));
			outputString("MWS last date=" + mwspolLast);
			outputString("MWS next date=" + mwspolNext);
		//	return	mwspolPid.substr(0,8);	//★機種コードを返す
			return	mwspolPid;				//★PIDを返す
		}
	}
	//----------------------------------------------------
	//ポリシーをMWSデータストアへ保存する
	//★エラー検出はしない。書き込めないなら、次の読み込みでエラー検出する。
	//引数		ポリシーテキスト
	//戻り値	なし
	//Input		mwsStorePolicy
    function setMWSPolicy(polcy) {
		if(polcy == null){
			outputString("Policy -> MWS NG(null)");
		}else{
			setKeyValueStore(mwsStorePolicy, polcy,machine,computer);
			outputString("Policy -> MWS OK");
		}
	}
	//----------------------------------------------------
	//ポリシーをMWSデータストアから取得する
	//引数		policykey
	//戻り値	null or 機種コード
	//Output	mwspolDOM	ポリシーオブジェクト
	//			mwspolTXT	ポリシーテキスト
	function getMWSPolicy(policykey){
		mwspolDOM 	= null;
		mwspolTXT 	= null;

		//MWSデータストアから取得
		mwspolTXT	= getKeyValueStore(policykey,machine,computer);
		if(mwspolTXT == null){
			outputString("Policy <- MWS NG(not exist)");
			return	null;
		}else{
			outputString("Policy <- MWS OK");

			//Text->DOM
			var parser = new DOMParser();
			mwspolDOM = parser.parseFromString(mwspolTXT, "application/xml");
			outputObject("MWS Policy",mwspolDOM);

			var	unit;
			var tagname;
			//機種コード
			tagname	= mwspolDOM.getElementsByTagName("UNIT_TYPE");
			if(tagname[0].firstChild == null){
				unit = "00000000";
			}else{
				unit = tagname[0].firstChild.nodeValue;
			}
			outputString("MWS Policy unit=" + unit);
			//最終更新日時
			tagname	= mwspolDOM.getElementsByTagName("POLICY_DATE");
			outputString("MWS Policy last date=" + tagname[0].firstChild.nodeValue);
			//次回取得日時
			tagname = mwspolDOM.getElementsByTagName("POLICY_NEXT_GET_DATE");
			outputString("MWS Policy next date=" + tagname[0].firstChild.nodeValue);
			return	unit;	//★機種コードを返す
		}
	}
	//----------------------------------------------------
	//CORSポリシーをSAサーバから取得してMWSへ設定する
	//★この処理は、各アプリが起動する前に実行する必要がある。
	//★通信失敗なら、あきらめて前回取得のままとする。1回も取得できなければ、使用するアプリでエラーとなる。
	//★車載機として必要な処理だが、スマホのWebViewから設定できるのなら、その方がBT SPPを通らないのでいいけど、要件にはしなかったみたい。。
	//引数		なし
	//戻り値	なし
	//テスト	車載機からのアクセスがまだ
	function corsPolicy(){
		$.ajax({
			type: "GET",		//HTTPメソッド
			url: httpSA + domainSA + "/tif/v1/?smt-service=h5.mws.getCORSPolicy",	//URL
			dataType: "xml",	//応答データタイプ
			async: true,		//非同期
			timeout: 30000,		//タイムアウト

			//通信成功
			success: function(data,status,xhr){
				outputString("CORS Policy GET status=" + status + " code=" + xhr.status);
				outputObject("CORS Policy",data);

				var cors	= xhr.responseText;

				if(computer == false){
				//CORSポリシー設定	★MWSへ設定
				$.ajax({
					type: "POST",		//HTTPメソッド
					url: "http://192.168.1.1:80/cors/",		//URL
					async: true,		//非同期
					timeout: 30000, 	//タイムアウト
					data: cors,			//CORSポリシーデータ

					//通信成功
					success: function(data,status,xhr){
						outputString("CORS Policy POST status=" + status + " code=" + xhr.status);
					},
					//通信失敗	★あきらめて前回取得のままとする。1回も取得できなければ、使用するアプリでエラーとなる。
					error: function(xhr,status,err){
						console.log("CORS Policy POST status=" + status + " code=" + xhr.status);
					}
				});
				}
			},
			//通信失敗	★あきらめて前回取得のままとする。1回も取得できなければ、使用するアプリでエラーとなる。
			error: function(xhr,status,err){
				console.log("CORS Policy GET status=" + status + " code=" + xhr.status);
			}
		});
    }
}
//----------------------------------------------------
//クッキー更新処理 Step1	★60秒に1回起動する
//引数		なし
//戻り値	なし
var	bakeCookie_ppwCode;
function bakeCookie(){
    window.setTimeout( "bakeCookie()", 60000);	//★60秒後にまた起動

	if(computer == true){
		//PCの場合はOS(Windows/Ubuntu)から取得する。
        var now = new Date();
		bakeCookie2(now);
	}else{
		//車載機の場合はMWSから取得する。
		//Getting current time on the Handset (HS時刻の取得)
		$.ajax({
			type: "GET",		//HTTPメソッド
			url: "http://192.168.1.1:80/timestamp/",		//URL
			async: true,		//非同期
			timeout: 45000,		//タイムアウト

			//通信成功
			success: function(data,status,xhr){
				console.log("http://192.168.1.1:80/timestamp/ GET status=" + status + " code=" + xhr.status);
				//ISO8601フォーマット"2013-01-01T00:00:00+0900"で返るので、パースしてDateオブジェクトにする
				var	datetime	= iso8601Convert(xhr.responseText);
				var now			= new Date(Date.parse(datetime));
				bakeCookie2(now);
			},
			//通信失敗	★あきらめて前回取得時刻のままとする。。
			error: function(xhr,status,err){
				console.log("http://192.168.1.1:80/timestamp/ GET status=" + status + " code=" + xhr.status);
				//★★60秒に1回のtimestamp取得が45秒のタイムアウトを起こしたら、MWSがフリーズしたと判断してリセットする★★
				$.ajax({
					type: "POST",		//HTTPメソッド
					url: "http://192.168.1.1:80/reset",		//URL
					async: true,		//非同期
					timeout: 30000,		//タイムアウト
					data: null,			//データ
					success: function(data,status,xhr){
						console.log("http://192.168.1.1:80/reset POST status=" + status + " code=" + xhr.status);
					},
					error: function(xhr,status,err){
						console.log("http://192.168.1.1:80/reset POST status=" + status + " code=" + xhr.status);
					}
				});
			}
		});
	}
	//----------------------------------------------------
	//クッキー更新処理 Step2	★1分に1回起動する
	//引数		Date Object
	//戻り値	なし
	function bakeCookie2(now){
		console.log(now.toLocaleString());

		if(computer == true){
			//PCの場合は、自分でPPWを加えてハッシュ計算を行いENCを算出する。
			var	auDate	= authDate(now);
			var	auDate2	= "\"" + auDate + "\"";
			var	auEnc	= hex_sha256(getCookie("PVR") + getCookie("PID") + getCookie("ROUTE") + auDate + bakeCookie_ppwCode);
			var	timecookie	= "TIME=" + auDate2 + "; Path=/;";
			var	enccookie	= "ENC=" + auEnc   + "; Path=/;";
			document.cookie	= timecookie;
			document.cookie	= enccookie;
			console.log(timecookie);
			return;
		}else{
			//車載機の場合は、NPAPIで機器認証用クッキーを作成する。
			//ここから使用するのは、PIDとENCのみで、更新するのは、PIDとENCとTIMEとする。（local.htmlから認証情報は引き継いでいるので）
			//PIDを使用するのは、PIDとPPWが書かれてあるセットであれば、local.htmlに依存しないでENCの更新ができるから。
			var	auDate	= authDate(now);
			var	auDate2	= "\"" + auDate + "\"";
			var	npCookie = jse.getParam(0x1030, "4," + auDate);
			if(npCookie.result == 0){
				var	auPid = getNPAPICookie("PID");
				var	auEnc = getNPAPICookie("ENC");
				var	pidcookie	= "PID=" + auPid + "; Path=/;";
				var	timecookie	= "TIME=" + auDate2 + "; Path=/;";
				var	enccookie	= "ENC=" + auEnc   + "; Path=/;";
				document.cookie	= pidcookie;
				document.cookie	= timecookie;
				document.cookie	= enccookie;
				console.log(pidcookie);
				return;
			}else{
				return;
			}
		}
		function getNPAPICookie(key){
			var cookies = npCookie.outParam1.split("; ");
			for (var i = 0; i < cookies.length; i++) {
				var str = cookies[i].split("=");
				if (str[0] == key) {
					return	unescape(str[1]);
				}
			}
			return("");
		}
	}
	//----------------------------------------------------
	//SA認証用DateTime変換処理
	//引数		Date Object
	//戻り値	String
	function authDate(tm){
		var wdtbl = new Array( "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" );
		var mntbl = new Array( "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" );
		var strTime	= wdtbl[tm.getUTCDay()] + " " +
                    mntbl[tm.getUTCMonth()] + " " +
                    ( "0" + tm.getUTCDate() ).slice( -2 ) + " " +
                    ( "0" + tm.getUTCHours() ).slice( -2 )+ ":" +
                    ( "0" + tm.getUTCMinutes() ).slice( -2 ) + ":" +
                    ( "0" + tm.getUTCSeconds() ).slice( -2 ) + " " +
                    tm.getUTCFullYear();
		return	strTime;
	}
}
//----------------------------------------------------
//ISO8601フォーマット("2013-01-01T00:00:00+0900")の変換処理
//引数		ISO8601フォーマット
//戻り値	パース出来る日時フォーマット
function iso8601Convert(iso8601){
	var	datetime =	iso8601.substr(0,4) + "/" +
					iso8601.substr(5,2) + "/" +
					iso8601.substr(8,2) + " " +
					iso8601.substr(11,8) + " GMT" +
					iso8601.substr(19,5);
	console.log(iso8601 + " -> " + datetime);
	return	datetime;
}
//----------------------------------------------------
//クッキーの値を取得
//引数		Key
//戻り値	Value
//テスト	完了
function getCookie(key){
	var cookies = document.cookie.split("; ");
	for (var i = 0; i < cookies.length; i++) {
		var str = cookies[i].split("=");
		if (str[0] == key) {
			return	unescape(str[1]);
		}
	}
	return("");
}

//----------------------------------------------------
//PID履歴更新処理
//引数		なし
//戻り値	なし
function pidHistory(){
	var	pidCode	= localStorage.getItem("launcher_pid");
	var	pidList	= [];

	if(computer == true){
		//★ローカルストレージから取得
		var	pidText = localStorage.getItem("pid_history");
		if(pidText != null){
			pidList	= JSON.parse(pidText);
		}
		//PID履歴更新(更新が無ければ何もしない)
		if(pidHistoryUpdate() == true){
			localStorage.setItem("pid_history",JSON.stringify(pidList));
		}
	}else{
		//★キーバリューストアから取得
		var	kvsurl	= "http://192.168.1.1:80/kvs/pid_history/";
		$.ajax({
			type: "GET",		//HTTPメソッド
			url: kvsurl,		//URL
			async: true,		//非同期
			timeout: 30000,		//タイムアウト
			success: function(data,status,xhr){
				console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
				pidList	= JSON.parse(xhr.responseText);
				//PID履歴更新(更新が無ければ何もしない)
				if(pidHistoryUpdate() == true){
					pidHistoryUpload(JSON.stringify(pidList));
				}
			},
			error: function(xhr,status,err){
				console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
				pidHistoryUpdate();
				pidHistoryUpload(JSON.stringify(pidList));
			}
		});
	}
	function pidHistoryUpload(textData){
		var	kvsurl	= "http://192.168.1.1:80/kvs/pid_history/";
		$.ajax({
			type: "POST",		//HTTPメソッド
			url: kvsurl,		//URL
			async: true,		//非同期
			timeout: 30000,		//タイムアウト
			data: textData,		//データ
			success: function(data,status,xhr){
				console.log(kvsurl + " POST status=" + status + " code=" + xhr.status);
				console.log(textData);
			},
			error: function(xhr,status,err){
				console.log(kvsurl + " POST status=" + status + " code=" + xhr.status);
			}
		});
	}
	function pidHistoryUpdate(){
		//PIDに接続日付を付ける
		var	pidDate	= pid_pls_date();
		//既に同じPIDがあるか検索する
		for(var i=0;i<pidList.length;i++){
			if(pidCode == pidList[i].substr(0,16)){
				if(pidList[i] != pidDate){
					pidList.splice(i,1);		//要素の削除
					pidList.unshift(pidDate);	//先頭に追加(つまり入れ替える)
					return	true;	//★接続日付の更新があれば、接続日付を更新する
				}else{
					if(i != 0){
						pidList.splice(i,1);		//要素の削除
						pidList.unshift(pidDate);	//先頭に追加(つまり入れ替える)
						return	true;	//★接続日付の更新が無くて、先頭でなければ、やはり入れ替える
					}else{
						return	false;	//★接続日付の更新が無くて、既に先頭なら何もしない
					}
				}
			}
		}
		//★新規追加
		pidList.unshift(pidDate);	//先頭に追加
		return	true;	//★更新ありでリターン
	}
	function pid_pls_date(){
		var datetime = new Date();
		var	year = String(datetime.getFullYear());
		var	month = datetime.getMonth() + 1;
		if(month < 10){
			 month = "0" + month;
		}
		var	date = datetime.getDate();
		if(date < 10){
			 date = "0" + date;
		}
		return	pidCode +" "+ year +"/"+ month +"/"+ date;
	}
}
