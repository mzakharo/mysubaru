	var appInfoList = {};
	var appListOfLine = [[],[]];

//$(function() {
(function($) {
  $(document).ready(function(e) {
	
	//アニメーション許可/禁止	★GPF=禁止、S-GPF=許可	※描画性能のため。。
//	var	iconAnimation		= true;		//許可
	var	iconAnimation		= false;	//禁止
	//
	// タグ識別用 ID名、クラス名定義変数 (※htmlに合わせて変更して下さい)
	//
	var id_backHome			 = 'backHome';
	var id_gadgetViewport    = 'gadgetViewport',    // ガジェットのカレントページを表示している窓部分のタグ要素のID
		id_gadget            = 'gadget';            // アプリ(ウィジェット)を配置しているタグ要素のID
	var id_prevPage          = 'prevPage',          // [<] (ガジェットの前ページスクロール) タグ要素のID
		id_nextPage          = 'nextPage';          // [>] (ガジェットの次ページスクロール) タグ要素のID
	var id_slider            = 'slider',            // ガジェットのスライダー タグ要素のID
		id_slideBarL         = 'slideBarL',         // ガジェットのスライドバー左 タグ要素のID
		id_slideBarM         = 'slideBarM',         // ガジェットのスライドバー中央 タグ要素のID
		id_slideBarR         = 'slideBarR';         // ガジェットのスライドバー右 タグ要素のID
	var class_movable        = 'movable';           // アプリ(ウィジェット) タグ要素のクラス名
	var class_balloon        = 'insertPos',         // アプリ移動指定用吹き出し タグ要素のクラス名
		class_balloon_bold	 = 'currentPos',        // アプリ移動指定用吹き出し タグ要素のクラス名
		class_upper_balloon	 = 'upperBalloon',      // アプリ移動指定用吹き出し タグの追加クラス(上段用)
		class_lower_balloon	 = 'lowerBalloon',      // アプリ移動指定用吹き出し タグの追加クラス(下段用)
		class_balloon_thumb	 = 'thumbBalloon';		// アプリ移動指定用吹き出し内サムネイル タグクラス
	var class_mask			 = 'appMask';           // アプリ(ウィジェット) 移動モード時に設置するマスク要素のクラス名
	var id_templateSimpleApp = 'templateSimpleApp', // 'template.html' 内での、シンプルアプリのタグ要素ID
		id_templateWidgetApp = 'templateWidgetApp'; // 'template.html' 内でのウィジェットアプリのタグ要素ID
	var id_wating_view		 = 'waitingView';		// ローディング中の表示を行うタグ要素ID		
	
	//
	// アプリ(ウィジェット)のレイアウトに関連する定数 (※htmlでのレイアウトに合わせて値を変更して下さい)
	//
	var appMarginX      = 6,   // アプリとアプリの間隔(横方向)
		appMarginY      = 6;   // アプリとアプリの間隔(縦方向)
	var appOffsetX      = 100, // ガジェット内で左端に配置されるアプリの始点x座標 (ガジェットからのオフセット(マージンleft)値)
		appOffsetY      = 25;  // ガジェット内の上段に配置されるアプリの始点y座標 (ガジェットからのオフセット(マージンtop)値)
	var appW_singleType = 145, // シングルサイズのアプリの幅
		appH_singleType = 156; // シングルサイズのアプリの高さ
	var appW_doubleType = 296, // ダブルサイズのアプリの幅
		appH_doubleType = 156; // ダブルサイズのアプリの高さ
	var balloonOffsetY  = 60;  // ガジェット内でのアプリ移動先指定用吹き出しの始点y座標 (ガジェットからのオフセット(マージンtop)値)
	var balloonW        = 112, // アプリ移動先指定用吹き出しの幅	
		balloonH        = 82;  // アプリ移動先指定用吹き出しの高さ
	
	//
	// UI 処理用の定数 (※値は調整して下さい)
	//
	var maxRangeTapHold = 20;   // 長押し判別用の、長押し中のx座標移動量 (この値を超える場合は長押しと判別しない)
	var tapHoldTime     = 1000; // 長押し判別用の、タップ時間 (msec)
	var swipeW          = 60;   // スワイプと判別するためのx移動量	(modified 2013/04/26 by yoshi@etram.jp)
//	var swipeW          = 30;   // スワイプと判別するためのx移動量	(modified 2013/04/26 by yoshi@etram.jp)
//	var loadingViewTime = 1500;	// 「ローディング中」表示の最小時間
//	var loadingViewTime = 0;	// 「ローディング中」表示の最小時間	★即実行ではなく、キューに積まれた後（つまり出来るだけ早い時間）、実行となるはず。
	
	var configAppObject = {}; // teplate.jsで作成されたアプリ(ウィジェット)の連想配列
	
	var gadgetViewPortWidth = $( '#' + id_gadgetViewport ).width() - ( appOffsetX * 2 - appMarginX );
	var pageIndex = 0;
	var pageMax = $( '#' + id_gadget ).width() / ( gadgetViewPortWidth + ( appOffsetX * 2 - appMarginX ) );
	var scrollTimer = null;
	var scrollInterval = 8;
	var direction = '';
	var scrolling = 20;
	var startPos;
	var movingVal;
	var bounceVal = 40;
	var bounceTimer = null;
	var bounceInterval = 3;
	var baounding = 2;
	var scrBackTimer = null;
	var scrBackInterval = 3;
	var scrBacking = 3;
	var gadget_touch_start = false;
	var gadgetElement = null;
	var movableAppMode = 'mobavle_disable'; // 'movable_enable' or 'movable_disable' 
	var bAppSwiped = false;
	var bSwiped = false;
	var bAppTapped = false;
	var checkSwipeTimer = null;
	var sliderbarW = 0;
	var sliderbarCurPos = 0;
	var touchStartPos = {'x':-1, 'y':-1};
	var tappedMoveX = 0;
	
	var appSizeType = {
		'single':{'w':appW_singleType, 'h':appH_singleType},
		'double':{'w':appW_doubleType, 'h':appH_doubleType}
	};
//	var appInfoList = {
//		'app5':{'sx':-1, 'sy':-1, 'type':'double', 'url':'', 'app_id':'', 'app_name':'Clock', 'app_icon':'img/app5/sprite.png', 'version':'', 'def_app_order':{'x':0, 'y':0}, 'dom':null, 'thumbnail':'img/app5/thumb.png'},
//		'app7':{'sx':-1, 'sy':-1, 'type':'double', 'url':'', 'app_id':'', 'app_name':'Weather', 'app_icon':'img/app7/sprite.png', 'version':'', 'def_app_order':{'x':0, 'y':1}, 'dom':null, 'thumbnail':'img/app7/thumb.png'},
//		'app10':{'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'Background', 'app_icon':'img/app0/icon.png', 'version':'', 'def_app_order':{'x':1, 'y':0}, 'dom':null, 'thumbnail':'img/app0/thumb.png'},
//		'app11':{'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'News News', 'app_icon':'img/app1/icon.png', 'version':'', 'def_app_order':{'x':2, 'y':0}, 'dom':null, 'thumbnail':'img/app1/thumb.png'},
//		'app12':{'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'Facebook', 'app_icon':'img/app2/icon.png', 'version':'', 'def_app_order':{'x':3, 'y':0}, 'dom':null, 'thumbnail':'img/app2/thumb.png'},
//		'app13':{'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'Twitter', 'app_icon':'img/app3/icon.png', 'version':'', 'def_app_order':{'x':4, 'y':0}, 'dom':null, 'thumbnail':'img/app3/thumb.png'},
//		'app14':{'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'Google', 'app_icon':'img/app4/icon.png', 'version':'', 'def_app_order':{'x':5, 'y':0}, 'dom':null, 'thumbnail':'img/app4/thumb.png'},
//	}; // ※仮でアプリのデフォルト位置をセット (Modified 2013/05/09 by yoshi@etram.jp)
	
//	var appListOfLine = [
//		['app5', 'app10', 'app11', 'app12', 'app13', 'app14'],
//		['app7']
//	];
	var markOffsetY    = balloonOffsetY;
	var markSize       = {'w':balloonW, 'h':balloonH};
	var markPosList    = {};
	var markListOfLine = [[], []];
	var moveAppId      = '';
	var newPageCount   = pageMax;
	var appIndexOfLine = -1;
	var appLineIndex   = -1;
	var elemBackHome	   = $('#' + id_backHome);
	var elemGadgetViewport = $('#' + id_gadgetViewport);
	var elemGadget		   = $('#' + id_gadget);
	var elemBody		   = $('body');
	var elemDocument	   = $(document);
	var elemPrevPage	   = $('#' + id_prevPage);
	var elemNextPage	   = $('#' + id_nextPage);
	var elemSlider		   = $('#' + id_slider);
	var elemAppMask		   = '<div class="appMask"></div>';
	var elemWatingView	   = $('#' + id_wating_view);
	

	//
	// ※ランチャーページ表示時に「ローディング中」は表示状態です
	//
	
	
	//
	// 長押し(taphold) イベントのホールド時間の設定
	//
	$.event.special.tap.tapholdThreshold = tapHoldTime;
	
	//
	// スワイプの最小移動距離の設定
	//
	$.event.special.swipe.horizontalDistanceThreshold = swipeW;
	
	//
	// グローバル関数定義
	//
	window.launcherGlobal = new Object();
	window.launcherGlobal.initDesign				  = initDesign;
	window.launcherGlobal.setAppHtml5IdToAppInfoLit   = setAppHtml5IdToAppInfoLit;
	window.launcherGlobal.setAppNameToAppInfoLit	  = setAppNameToAppInfoLit;
	window.launcherGlobal.setAppIconToAppInfoLit	  = setAppIconToAppInfoLit;
	window.launcherGlobal.setAppThumbnailToAppInfoLit = setAppThumbnailToAppInfoLit;
	window.launcherGlobal.setAppUrlToAppInfoLit		  = setAppUrlToAppInfoLit;
	window.launcherGlobal.setSizeTypeToAppInfoLit	  = setSizeTypeToAppInfoLit;
	window.launcherGlobal.setAppVersionToAppInfoLit	  = setAppVersionToAppInfoLit;
	window.launcherGlobal.setDefAppOrderToAppInfoLit  = setDefAppOrderToAppInfoLit;
	window.launcherGlobal.getJsonStrForAppsLayout     = getJsonStrForAppsLayout;
	
	
//================================================================================================
// Interface functions
//
	//
	// initDesign() : ランチャーデザインの初期化処理。
	//
	function initDesign() {

		// アプリ(ウィジェット)タグ要素用配列の作成 (※アプリ(ウィジェット)要素タグ用テンプレートスクリプト内関数)
		configAppObject = createAppElemList();											
		didLoadTemplateJs();														// アプリ(ウィジェット)要素タグ用テンプレートスクリプトファイルのロード完了時の処理コール
			//
			// ※上記処理完了後、以下の処理を実行
			//   ・アプリ(ウィジェット)要素タグ用テンプレートスクリプトファイルのロード
			//   ・アプリ(ウィジェット)のレイアウト算出
			//   ・アプリ(ウィジェット)タグ要素の設置
	}


	//
	// setAppHtml5IdToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ①
	//								 ポリシーデータの <APP_HTML5_ID> 値のアプリ情報配列へのセット。
	//
	//	params [IN]		appKey     : ランチャー内アプリID ('app0'から始まるキー)
	//					appHtml5Id : ポリシーデータ内の <APP_HTML5_ID> 値
	//
	function setAppHtml5IdToAppInfoLit(appKey, appHtml5Id) {
	//	console.log('call setAppHtml5IdToAppInfoLit(' + appKey + ', ' + appHtml5Id + ')');
	
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		appInfoList[appKey].app_id = appHtml5Id;
		
	//	console.log(appInfoList);
	}
	
	
	//
	// setAppNameToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ②
	//							  アプリ情報配列へのアプリ名のセット。
	//
	//	params [IN]		appKey  : ランチャー内アプリID ('app0'から始まるキー)
	//					appName : アプリ名
	//
	function setAppNameToAppInfoLit(appKey, appName) {
	//	console.log('call setAppNameToAppInfoLit(' + appKey + ', ' + appName + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		appInfoList[appKey].app_name = appName;
		
	//	console.log(appInfoList);
	}


	//
	// setAppIconToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ③
	//							  アプリ情報配列へのアプリアイコンのURLセット。
	//
	//	params [IN]		appKey  : ランチャー内アプリID ('app0'から始まるキー)
	//					iconUrl : アプリアイコンのURL
	//
	function setAppIconToAppInfoLit(appKey, iconUrl) {
	//	console.log('call setAppIconToAppInfoLit(' + appKey + ', ' + iconUrl + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		appInfoList[appKey].app_icon = iconUrl;
		
	//	console.log(appInfoList);
	}
	

	//
	// setAppThumbnailToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ④
	//								   アプリ情報配列へのアプリのサムネイル(アイコン移動時の吹き出しないに表示する画像)のURLセット。
	//
	//	params [IN]		appKey       : ランチャー内アプリID ('app0'から始まるキー)
	//					thumbnailUrl : サムネイルのURL
	//
	function setAppThumbnailToAppInfoLit(appKey, thumbnailUrl) {
	//	console.log('call setAppThumbnailToAppInfoLit(' + appKey + ', ' + thumbnailUrl + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		appInfoList[appKey].thumbnail = thumbnailUrl;
		
	//	console.log(appInfoList);
	}

	
	//
	// setAppUrlToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ⑤
	//							 アプリ情報配列へのアプリ起動URLのセット。
	//
	//	params [IN]		appKey : ランチャー内アプリID ('app0'から始まるキー)
	//					appUrl : アプリ起動URL
	//
	function setAppUrlToAppInfoLit(appKey, appUrl) {
	//	console.log('call setAppUrlToAppInfoLit(' + appKey + ', ' + appUrl + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		
		appInfoList[appKey].url = appUrl;
		
	//	console.log(appInfoList);
	}


	//
	// setSizeTypeToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ⑥
	//							   アプリ情報配列へのアプリの横幅タイプ値のセット。
	//
	//	params [IN]		appKey     : ランチャー内アプリID ('app0'から始まるキー)
	//					appHtml5Id : アイコンの場合 = 'single'、ウィジェットなど横長の場合 = 'double'
	//
	function setSizeTypeToAppInfoLit(appKey, sizeType) {
	//	console.log('call setSizeTypeToAppInfoLit(' + appKey + ', ' + sizeType + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		if ((sizeType != 'single') && (sizeType != 'double')) {
			appInfoList[appKey].type = 'single';
		}
		else {
			appInfoList[appKey].type = sizeType;
		}
		
	//	console.log(appInfoList);
	}
	
	
	//
	// setAppVersionToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ⑦
	//								 アプリ情報配列へのアプリバージョン値のセット。
	//
	//	params [IN]		appKey  : ランチャー内アプリID ('app0'から始まるキー)
	//					version : アプリのバージョン値
	//
	function setAppVersionToAppInfoLit(appKey, version) {
	//	console.log('call setAppVersionToAppInfoLit(' + ppKey + ', ' + version + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		
		appInfoList[appKey].version = version;
		
	//	console.log(appInfoList);
	}
	
	
	//
	// setDefAppOrderToAppInfoLit() : ポリシーデータのアプリ情報配列へのセット用関数 ⑧
	//								  アプリ情報配列へのアプリのデフォルト位置のセット。
	//
	//	params [IN]		appKey : ランチャー内アプリID ('app0'から始まるキー)
	//					defX   : アプリのデフォルト x 位置(列(左から何個目か))
	//					defY   : アプリのデフォルト y 位置(段(0:上段、1:下段))
	//
	function setDefAppOrderToAppInfoLit(appKey, defX, defY) {
	//	console.log('call setDefAppOrderToAppInfoLit(' + appKey + ', ' + defX + ', ' + defY + ')');
		
		existAppInfoInAppInfoList(appKey);				// 指定するキーの要素が存在するかのチェック(存在しない場合は要素追加)
		
		appInfoList[appKey].def_app_order = {'x':defX, 'y':defY};
		
	//	console.log(appInfoList);
	}
	
	
	//
	// onTappedApp() : アプリアイコン(ウィジェット) タップ時のアプリケーションの起動用ファンクション (Appended 2013/05/08 by yoshi@etram.jp)
	//
	//	params [IN]		appUrl : アプリ情報配列 (appInfoList) にセットされているタップしたアプリの起動先URL
	// 
	function onTappedApp(appId,appName,appUrl) {
		console.log('call onTappedApp( ' + appUrl + ' )');
		
		//
		// ※以下に、実際のアプリ起動用処理を実装して下さい。
		//
		launcherIconTap(appId,appName,appUrl);
	}
	
	
	//
	// onTappedMiniBtn() : [最小化]ボタン タップ時のファンクション (Appended 2031/05/09 by yoshi@etram.jp)
	//
	function onTappedMiniBtn() {
	//	alert('called onTappedMiniBtn()');
		console.log('called onTappedMiniBtn()');
		
		//
		// ※以下に、[最小か]ボタンタップ時の処理を実装して下さい。
		//
		launcherBackTap();
	}
	
	
	//
	// makeJsonForAppsLayout() : アプリ(ウィジェットの)のレイアウト情報保存のためのJSON値(シリアライズ文字列)の作成
	//
	function makeJsonForAppsLayout() {
		//
		// レイアウト情報保存用のJSON値(※シリアライズ文字列)の作成
		//
		var jsonObj = getJsonStrForAppsLayout();
		//alert(jsonObj);
		
		//
		// ※ここで、レイアウト情報をユーザ設定情報への保存処理が必要かも。
		//
		setlauncherIconLayout(jsonObj);
		
	}
	
	
	//
	// アプリ(ウィジェット)のレイアウト情報のJSON値(※シリアライズ文字列)取得 (Appended 2013/05/02 by yoshi@etram.jp)
	//
	function getJsonStrForAppsLayout() {
		var dicForJsonObj = {};
		
		// JSONオブジェクトの生成
		for (var y=0; y<appListOfLine.length; y++) {
			for (var x=0; x<appListOfLine[y].length; x++) {
				dicForJsonObj[ appListOfLine[y][x] ] = {'x':x, 'y':y};
			}
		}
		/*
		for (var key in dicForJsonObj) {
			alert(key + ': {x:' + dicForJsonObj[key].x + ', y:' + dicForJsonObj[key].y + '}');
		}
		*/
		
		// JSON値(文字列)をリターン
		return JSON.stringify(dicForJsonObj);
	}
	
	
	
//================================================================================================
// Event Handlers
//
	
	//
	// [<][>] ボタン クリック時
	//
	$(('#' + id_prevPage + ', #' + id_nextPage)).click(function(e) {
		if (scrolling != null) {
			clearInterval(scrollTimer);
		}
		
		//alert('pageIndex=' + pageIndex + ', pageMax=' + pageMax);

		//ビープ音出力要求発行
		launcherBeep("0");	//短音ビープ

		direction = '';
		movingVal = 0;
		if (this.id == id_prevPage) {
			if (pageIndex > 0) {
				startPos = parseInt($('#' + id_gadget).css('left'));
				pageIndex --;
				direction = 'prev';
			}
			else {
				return;
			}
		}
		else if (this.id == id_nextPage) {
			if ((pageIndex + 1) < pageMax) {
				startPos = parseInt($('#' + id_gadget).css('left'));
				pageIndex ++;
				direction = 'next';
			}
			else {
				return;
			}
		}
		
		slideSriderbar(pageIndex);															// スライダーバーの移動
		scrollGadget(startPos, pageIndex, direction, 1);									// ガジェットのスクロール
	});
	
	
	//
	// ガジェット領域内の左方向へのスワイプ時
	//
	elemGadgetViewport.on('swipeleft', function(e) {
		//clearTimeout(checkSwipeTimer);													// touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27)	
		debugInfo('swipe left!');
		
		/*				
		// 移動量判別																		// touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27)
		if (tappedMoveX < swipeW) {
			debugInfo('but not swipe!');
			backPosition(parseInt($('#' + id_gadget).css('left')));							// スクロールバッック
			return;
		}
		*/
		
		bSwiped = true;
		
		if ((pageIndex + 1) < pageMax) {
			pageIndex ++;
			slideSriderbar(pageIndex);														// スライダーバーの移動
			scrollGadget(parseInt($('#' + id_gadget).css('left')), pageIndex, 'next', 1);	// ガジェットのスクロール
		}
		else {
			//backPosition(parseInt($('#' + id_gadget).css('left')));						// スクロールバッック (touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27))
		}
	});
	
	
	//
	// ガジェット領域内の右方向へのスワイプ時
	//
	elemGadgetViewport.on('swiperight', function(e) {
		//clearTimeout(checkSwipeTimer);													// touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27)
		debugInfo('swipe right!');
		
		/*
		// 移動量判別																		// touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27)						
		if (tappedMoveX < swipeW) {
			debugInfo('but not swipe!');
			//backPosition(parseInt($('#' + id_gadget).css('left')));						// スクロールバック
			return;
		}
		*/
		
		bSwiped = true;
		
		if (pageIndex > 0) {
			pageIndex --;
			slideSriderbar(pageIndex);														// スライダーバーの移動
			scrollGadget(parseInt($('#' + id_gadget).css('left')), pageIndex, 'prev', 1);	// ガジェットのスクロール
		}
		else {
			//backPosition(parseInt($('#' + id_gadget).css('left')));						// スクロールバック (touchatsrt、touchmove、touchendのコメントアウトのに伴うコメント化 (2013/05/27))
		}
	});
	

	//
	// bodyタグ内での、mousedown or touchstart 時
	//
	elemBody.on('mousedown touchstart', ('#' + id_gadget + ', .' + class_movable), function(e) {

		// htmlページのスクロールを無効化
		if ( !e.preventDefault ) {
			e.originalEvent.preventDefault();
		}

		/*
		if ( !e.pageX ) {																	// 2013/04/30 打ち合わせ内用を反映 (2013/04/30)
			e.pageX = e.originalEvent.touches[0].pageX;
			e.pageY = e.originalEvent.touches[0].pageY;
		}
		
		debugInfo('touch start (' + e.pageX + ', ' + e.pageY + ')');

		if ( !e.preventDefault ) {															// Modified 2013.05.15 by yoshi@etram.jp
			e.originalEvent.preventDefault();
		}
		
		gadget_touch_start = true;

		gadgetElement = document.getElementById('gadget');
		gadgetElement.mouseX = e.pageX;
		gadgetElement.mouseY = e.pageY;
		if (gadgetElement.style.left.length == 0) {
			gadgetElement.style.left = '0px';
			gadgetElement.style.top  = '0px';
		}
		
		touchStartPos['x'] = e.pageX;
		touchStartPos['y'] = e.pageY;
		tappedMoveX = 0;
		bSwiped = false;
		*/
	});
	
	
	//
	// ガジェット領域での、mousemove or touchmove 時
	//
	elemGadgetViewport.on('mousemove touchmove', function(e) {
	
		// htmlページのスクロールを無効化
		e.preventDefault();

		/*
		if ( !e.pageX ) {																	// 2013/04/30 打ち合わせ内用を反映 (2013/04/30)
			e.pageX = e.originalEvent.touches[0].pageX;
			e.pageY = e.originalEvent.touches[0].pageY;
		}
	
		if (gadget_touch_start == false) {
			return;
		}
		
		e.preventDefault();
	
		debugInfo('touch move (' + e.pageX + ', ' + e.pageY + ')');
		
		//alert(gadgetElement.id);
		var x = parseInt(gadgetElement.style.left);
		gadgetElement.style.left = x + (e.pageX - gadgetElement.mouseX) + 'px';
		
		gadgetElement.mouseX = e.pageX;
		gadgetElement.mouseY = e.pageY;
		
		if (Math.abs(e.pageX - touchStartPos.x) > tappedMoveX) {
			tappedMoveX = Math.abs(e.pageX - touchStartPos.x);
		}
		*/
	});
	
	
	/*
	//
	// bodyタグ内での、mouseup or touchend 時
	//
	elemBody.on('mouseup touchend', function(e) {											// gadget_viewpoint でなく、body でのイベント取得に修正 (2012/04/30 by yoshi@etram.jp)
		if (!e.pageX) {		// ※touchend時には座標値を取得できない
			e.pageX = 0;		// e.originalEvent.touches[0].pageX;
			e.pageY = 0;		// e.originalEvent.touches[0].pageY;
		}
		
		if (gadget_touch_start == false) {
			return;
		}
		//debugInfo('touch end (' + e.pageX + ', ' + e.pageY + ')');
		gadget_touch_start = false;
		
		checkSwipeTimer = setTimeout(function() {
			if (bSwiped == false) {
				backPosition(parseInt($('#' + id_gadget).css('left')));
			}
		}, 300);
	});
	*/
	
	
	//
	// アプリ(ウィジェット) タップ時
	//
	elemDocument.on('tap', ('.' + class_movable), function(e) {
		
		bAppTapped = true;																	// ※iPadで動作確認したところ、tapイベントの後に、tapholdイベントが発生したための対処
		
		// アプリ移動モードの場合→無視
		if (movableAppMode == 'movable_enable') {
			return;
		}
		
		// 先にスワイプイベントが取得された場合→無視
		if (bSwiped == true) {
			bSwiped = false;
			bAppTapped = false;																// 連続スワイプ操作後に taphold イベントが処理されない不具合の対応 (2013/04/30)
			return;
		}
		
		//
		// アプリ起動用ファンクションのコール (※urlが指定されていない場合でもコール。Modified 2013/06/06 by yoshi@etram.jp)
		//
		//console.log(this.id + ' tap! (movableAppMode=' + movableAppMode + ', bSwiped=' + bSwiped + ')');
		//debugInfo(this.id + ' tap!');
		onTappedApp(appInfoList[this.id].app_id,appInfoList[this.id].app_name,appInfoList[this.id].url);
		
		bAppTapped = false;
	});
	
	
	//
	// アプリ(ウィジェット) 長押し時	
	//
	elemDocument.on('taphold', ('.' + class_movable), function(e) {
		debugInfo('catch taphold event. (movableAppMode=' + movableAppMode + ', bAppTapped=' + bAppTapped + ')');
		//alert('bAppTapped=' + bAppTapped + ', movableAppMode=' + movableAppMode);
		
		// 既にタップイベントが発生していた場合→無視 (本処理の終了。※iPadで動作確認したところ、tapイベントの後に、tapholdイベントが発生したための対処)
		if (bAppTapped == true) {
			bAppTapped = false;
			return;
		}
		
		// アプリ移動モードの場合→無視 (本処理の終了)
		if (movableAppMode == 'movable_enable') {
			return;
		}
		
		debugInfo('app tap hold! (tappedMoveX=' + tappedMoveX + ')');
		
		if (tappedMoveX < maxRangeTapHold) {

			//ビープ音出力要求発行
			launcherBeep("1");	//長音ビープ

			//alert('change disp mode');
			backPosition(parseInt($('#' + id_gadget).css('left')));
			
			// アプリ移動モードへの切り換え
			moveAppId = this.id;
			changeModeToMoveApp();
		}
		else {
			
		}
	});
	
	
	//
	// アプリ移動先マークのクリック時	
	// 
	elemDocument.on('click tap', ('.' + class_balloon + ', .' + class_balloon_bold), function(e) {						// ※iPadで 'click' が動作しなかったので、'tap' を追加
		//alert('click (x=' + e.pageX + ', y=' + e.pageY + ')');

		//ビープ音出力要求発行
		launcherBeep("0");	//短音ビープ

		onTappedInsertPosMark(this.id);														// レイアウト配列の更新、移動表示、指定位置への対象アプリの設置
	});
	
	
	//
	// スライダー領域 クリック時
	//
	//$('#' + id_slider).click(function(e) {
	elemSlider.click(function(e) {

		//ビープ音出力要求発行
		launcherBeep("0");	//短音ビープ

	//	var tappedPageIndex = parseInt(e.pageX / sliderbarW);
		var tappedPageIndex = parseInt( ( e.pageX - $( this ).offset().left ) / sliderbarW );
		//alert('x=' + e.pageX + ', y=' + e.pageY + ', sliderbarW=' + sliderbarW + ', tapedPageIndex=' + tapedPageIndex);
		if (tappedPageIndex != pageIndex) {
			var startPos = parseInt($('#' + id_gadget).css('left'));
			//alert('startPos=' + startPos);
			if (tappedPageIndex > pageIndex) {
				direction = 'next';
			}
			else {
				direction = 'prev';
			}
			
			var distancePage = Math.abs(tappedPageIndex - pageIndex);
			pageIndex = tappedPageIndex;
			
			slideSriderbar(pageIndex);														// スライダーバーの移動
			scrollGadget(startPos, tappedPageIndex, direction, distancePage);				// ガジェットのスクロール
		}
	});
	
	
	//
	// [ホーム] ボタン クリック時
	// 
	elemBackHome.click(function(e) {
		//alert('back_home');
		
		//
		// ※ここに処理を記述して下さい。
		//
		
	});
	
	
	//
	// [最小化] ボタンクリック時 (Appended 2013/05/02 by yoshi@etram.jp)
	//
//	$('#minimize').click(function(e)
	$('#backHome').click(function(e)
     {
		//alert('minimize');
		
		// インタフェース関数コール
		onTappedMiniBtn();
		
	});
	
	
	
	
//================================================================================================
// Sub functions
//
	
	//
	// アプリ(ウィジェット)要素タグ用テンプレートスクリプトファイルのロード完了時の処理
	//
	function didLoadTemplateJs() {
		
		//
		// ※下記処理をコールする前に、
		//   ・ポリシーファイルの取得
		//   ・ポリシーファイルのパースおよび、本スクリプト内のグローバル関数コールによる appInfoList配列へのセット
		//   の処理を行う必要があります。
		//
		// ここで、launchar.jsで用意するポリシーファイルの取得その他初期か処理関数をコールします。
		// startup();
        launcherPolicyOrder();
		
		
		//
		// ※下記処理を実行する前に、
		//   ・ユーザ設定情報からのレイアウト情報(JSONデータ)の取得
		//   を行う必要があります。
		//
		// ここで、launchar.jsで用意するユーザ設定情報からのレイアウト情報(JSONデータ)の取得関数をコールします。
		// ※現在、関数が存在しないので、関数名は不明
		
		//
		// JSON値(シリアライズ文字列)からのアプリリスト配列への展開
		//
		//*** ※テストコード - start - ****************************
		//   (上記、ユーザ設定情報からのレイアウト情報(JSONデータ)の取得関数を記述した場合は、下記テストコードをコメントアウトして下さい。)
		//var jsonObj = getJsonStrForAppsLayout();			// アプリ(ウィジェット)のレイアウト情報のJSON値(※シリアライズ文字列)取得
		//console.log(jsonObj);
		//*** ※テストコード - end - ******************************
		var jsonObj = getlauncherIconLayout();
		setAppListFromJson(jsonObj);						// アプリ(ウィジェット)のレイアウト情報のJSON値からアプリリスト配列への展開
		
		
		//
		// ポリシーデータをセットしたアプリ情報配列(appInfoList)内の アプリ名、アイコン画像の、アプリテンプレートオブジェクトへの反映
		//
		setAppInfoToConfigObject();
		
		//
		// ユーザ設定情報にレイアウト情報が存在しない場合の、デフォルト位置情報からのアプリリスト配列の作成 (2013/05/01 by yoshi@etram.jp)
		//
		makeAppListOnLineFromDefAppOrder();
		
		//
		// 追加アプリが存在する場合の、アプリリスト配列の最後尾への追加 (modified 2013/04/30 by yoshi@etram.jp)
		//
		checkAppendApps();
		
		//
		// アプリ(ウィジェット)レイアウト調整 & 設置
		//
		calcLayoutForApps();															// アプリ(ウィジェット)のレイアウト調整 (※配列データのみ)
		if (newPageCount > pageMax) {											// ガジェットサイズが大きくなる場合→ガジェットサイズ変更 (appened 2013/04/30 by yoshi@etram.jp)
			$('#' + id_gadget).width(newPageCount * gadgetViewPortWidth);
			pageMax = newPageCount;
		}
		renewAppIntoGadget();															// アプリ(ウィジェット)、アプリ移動先指定マークの再設置
		updateLayoutOfApps();															// スタイル値変更によるアプリ(ウィジェット)のレイアウト更新
		
		//----------------------------------------------------
		//ランチャーのラストページを取得＆適用
		var launcherPage = getlauncherPageIndex();
		if(launcherPage < pageMax){
			//pageMax(ページ枚数)より小さければ適用する。
			pageIndex = launcherPage;
		}else{
			//pageMax(ページ枚数)と同じか大きければ強制的に最初のページにする。(ポリシーでアプリ数を制御出来るので、この判定は必要)
			pageIndex = 0;
		}
		//
		// ガジェット内の初期表示位置のセット
		//
		$('#' + id_gadget).css('left', (0 - pageIndex * gadgetViewPortWidth) + 'px');
		
		//
		// スライダーバーの設置(サイズ、カレント位置調整)
		//
		setSliderbar();
		
		//
		// レイアウト情報保存用のJSON値(※シリアライズ文字列)の作成 (Appended 2013/05/09 by yoshi@etram.jp)
		//
	//	makeJsonForAppsLayout();
		
		//
		// 「loading...」表示の非表示 (指定時間(最小表示時間)後に非表示)
		//
	//	setTimeout(function() {
	//		elemWatingView.hide();
	//	}, loadingViewTime);
		elemWatingView.hide();
	}
	
	
	//
	// ガジェット領域のスクロール
	//
	function scrollGadget(curPos, newPageIndex, dir, diffPage) {
		debugInfo('newPgae=' + newPageIndex + ', pageIndex=' + pageIndex);
		/*
		if (dir == 'next') {
			if ((newPageIndex + 1) >= pageMax) {
				
				// アニメーションを実行する前と後でキューを削除	(Modified 2013/04/30 by yoshi@etram.jp)
				$('#' + id_gadget).queue([]).animate({left: '-' + (newPageIndex * gadgetViewPortWidth) + 'px'}, {duration: 400 * diffPage}, null, function() {
					$('#' + id_gadget).queue([]);
				});
			}
			else {
				$('#' + id_gadget).animate({left: '-' + (newPageIndex * gadgetViewPortWidth + bounceVal) + 'px'}, {duration: 400 * diffPage});
				
				// バウンドアニメーション実行後にキューを削除 (Modified 2013/04/30 by yoshi@etram.jp)
				$('#' + id_gadget).animate({left: '+=' + bounceVal + 'px'}, {duration: 170}, null, function() {
					$('#' + id_gadget).queue([]);
				});
				
				backPosition(0);							// Appended 2013.05.15 by yoshi@etram.jp
			}
		}
		else {
			if (newPageIndex == 0) {
				
				// アニメーションを実行する前と後でキューを削除	(Modified 2013/04/30 by yoshi@etram.jp)
				$('#' + id_gadget).queue([]).animate({left: '0px'}, {duration: 400 * diffPage}, null, function() {
					$('#' + id_gadget).queue([]);
				});
			}
			else {
				$('#' + id_gadget).animate({left: '-' + (newPageIndex * gadgetViewPortWidth - bounceVal) + 'px'}, {duration: 400 * diffPage});
				
				// バウンドアニメーション実行後にキューを削除 (Modified 2013/04/30 by yoshi@etram.jp)
				$('#' + id_gadget).animate({left: '-=' + bounceVal + 'px'}, {duration: 170}, null, function() {
					$('#' + id_gadget).queue([]);
				});
				
				backPosition(0);							// Appended 2013.05.15 by yoshi@etram.jp
			}
		}
		*/
	  if(iconAnimation == true){
		$('#' + id_gadget).queue([]).animate({left: '-' + (newPageIndex * gadgetViewPortWidth) + 'px'}, {duration: 400 * diffPage}, null, function() {
			$('#' + id_gadget).queue([]);
		});
	  }else{
		$('#' + id_gadget).queue([]).animate({left: '-' + (newPageIndex * gadgetViewPortWidth) + 'px'}, {duration: 0});
		$('#' + id_gadget).queue([]);
	  }

		//----------------------------------------------------
		//ランチャーのラストページを保存
		setlauncherPageIndex(newPageIndex);
	}
	
	
	//
	// ガジェット領域のスクロールバック
	//	
	function backPosition(startPos) {
		//debugInfo('backPosition');
		/*
		if (startPos > 0) {
			$('#' + id_gadget).animate({left: '-=' + (startPos - pageIndex * gadgetViewPortWidth) + 'px'}, {duration: 260});
		}
		else {
			$('#' + id_gadget).animate({left: '+=' + (Math.abs(startPos) - pageIndex * gadgetViewPortWidth) + 'px'}, {duration: 260});
		}
		*/
		
		// 移動量の指定から移動位置の指定に修正 (2013/05/01 by yoshi@etram.jp)
		$('#' + id_gadget).animate({left: '-' + (pageIndex * gadgetViewPortWidth) + 'px'}, {duration: 260});
		
	}
	
	
	//
	// スライダーバーの設置
	//
	function setSliderbar() {
		sliderbarW = parseInt($('#' + id_slider).width() / pageMax);
		sliderbarCurPos = pageIndex * sliderbarW;
		//alert('sliderbarW=' + sliderbarW + ', sliderbarCurPos=' + sliderbarCurPos + ', sliderbar_l.width=' + $('#' + id_slideBarL).width() + ', sliderbar_r.width=' + $('#' + id_slideBarR).width());
		$('#' + id_slideBarL).css('left', sliderbarCurPos + 'px');
		$('#' + id_slideBarM).css('left', (sliderbarCurPos + $('#' + id_slideBarL).width()) + 'px');
		$('#' + id_slideBarM).width(sliderbarW - $('#' + id_slideBarL).width() - $('#' + id_slideBarR).width());
	//	$('#' + id_slideBarM).height('10');
		$('#' + id_slideBarR).css('left', (sliderbarCurPos + sliderbarW - $('#' + id_slideBarR).width()) + 'px');
		//alert('sliderbar_l.left=' + $('#' + id_slideBarL).css('left') + ', sliderbar_b.left=' + $('#' + id_slideBarM).css('left') + ', sliderbar_r.left=' + $('#' + id_slideBarR).css('left'));
		
		changeDispPageBtn();															// [<][>] ボタンの表示/非表示制御 (Appended 2013.05.14 by yoshi@etram.jp)
	}
	
	
	//
	// スライダーのカレント位置に対応するスライダーバー移動アニメーション
	//
	function slideSriderbar(pIndex) {
		var distance = pIndex * sliderbarW - sliderbarCurPos;

	  if(iconAnimation == true){
		$('#' + id_slideBarL).animate({left: '+=' + distance + 'px'});
		$('#' + id_slideBarM).animate({left: '+=' + distance + 'px'});
		$('#' + id_slideBarR).animate({left: '+=' + distance + 'px'}, null, function() {
			changeDispPageBtn();														// [<][>] ボタンの表示/非表示制御 (Appended 2013.05.14 by yoshi@etram.jp)
		});
	  }else{
		$('#' + id_slideBarL).animate({left: '+=' + distance + 'px'}, {duration: 0});
		$('#' + id_slideBarM).animate({left: '+=' + distance + 'px'}, {duration: 0});
		$('#' + id_slideBarR).animate({left: '+=' + distance + 'px'}, {duration: 0});
		changeDispPageBtn();														// [<][>] ボタンの表示/非表示制御 (Appended 2013.05.14 by yoshi@etram.jp)
	  }

		sliderbarCurPos = pIndex * sliderbarW;
	}
	
	
	//
	// [<][>] ボタンの表示/非表示制御 (Appended 2013.05.14 by yoshi@etram.jp)
	//
	function changeDispPageBtn() {
		if ((pageIndex == 0) && (pageMax == 1)) {
			//1ページしかない場合、		非表示
			elemPrevPage.hide();
			elemNextPage.hide();
		}
		else if (pageIndex == 0) {
			//最初のページの場合、		[>]表示
			elemPrevPage.hide();
			elemNextPage.show();
		}
		else if ((pageIndex + 1) == pageMax) {
			//最後のページの場合、		[<]表示
			elemPrevPage.show();
			elemNextPage.hide();
		}
		else {
			//それ以外のページの場合、	[<][>]表示
			elemPrevPage.show();
			elemNextPage.show();
		}
	}
	
	
	//
	// アプリ(ウィジェット)の再設置
	//
	function renewAppIntoGadget() {
		// ガジェット内の小要素の削除
		$('.' + class_movable + ', .' + class_balloon + ', .' + class_balloon_bold).remove();
		
		// アプリ(ウィジェット)の要素設置
		for (var l=0; l<appListOfLine.length; l++) {
			for (var x=0; x<appListOfLine[l].length; x++) {
				
				var appId = appListOfLine[l][x];
				//alert(appListOfLine[l][x] + '.type=' + appInfoList[ appId ].type);
				
				// DOM が null の場合のみテンプレートから作成するように変更 (Modified 2013/04/30 by yoshi@etram.jp)
				if (appInfoList[ appId ].dom == null) {
					//alert(appListOfLine[l][x] + ' from template');
					if (appInfoList[ appId ].type == 'single') {
						appInfoList[ appId ].dom = $('#' + id_templateSimpleApp).tmpl( configAppObject[ appId ] );
					}
					else if (appInfoList[ appId ].type == 'double') {
						appInfoList[ appId ].dom = $('#' + id_templateWidgetApp).tmpl( configAppObject[ appId ] );
					}
					
					//console.log( appInfoList[ appId ].dom.find('.appName').text() );
				}
				else {
					//alert(appListOfLine[l][x] + ' from dom');
				}
				$('#' + id_gadget).append( appInfoList[ appId ].dom );
			}
		}
	}
	
	
	//
	// アプリ移動先指定用マークの再設置
	//
	function renewMarkIntoGadget() {
		
		$('.' + class_balloon + ', .' + class_balloon_bold).remove();
		
		for (var l=0; l<markListOfLine.length; l++) {
			for (var x=0; x<markListOfLine[l].length; x++) {
				//var markElem = document.createElement('div');
				var makeElem = $('<div>');
				if (l == 0) {
					if ((l == appLineIndex) && (x == appIndexOfLine)) {
						makeElem.attr('class', class_balloon_bold + ' ' + class_upper_balloon);		// クラス名 = アプリのあった位置用吹き出しクラス + 上段用吹き出しクラス
					}
					else {
						makeElem.attr('class', class_balloon + ' ' + class_upper_balloon);			// クラス名 = 通常の吹き出しクラス + 上段用吹き出しクラス
					}
				}
				else {
					if ((l == appLineIndex) && (x == appIndexOfLine)) {
						makeElem.attr('class', class_balloon_bold + ' ' + class_lower_balloon);		// クラス名 = アプリのあった位置用吹き出しクラス + 下段用吹き出しクラス
					}
					else {
						makeElem.attr('class', class_balloon + ' ' + class_lower_balloon);			// クラス名 = 通常の吹き出しクラス + 下段用吹き出しクラス
					}
				}
				makeElem.attr('id', markListOfLine[l][x]);
	
				var thumbElem = $('<img>', {
					class:class_balloon_thumb,
					src:appInfoList[moveAppId].thumbnail
				});
				makeElem.append(thumbElem);
				
				elemGadget.append(makeElem);
			}
		}
	}
	
	
	//
	// ユーザ設定情報にレイアウト情報が存在しない場合の、デフォルトの表示位置情報からのアプリリスト配列の作成 (Appended 2013/05/01 by yoshi@etram.jp)
	//
	function makeAppListOnLineFromDefAppOrder() {
		
		// アプリ配列がセットされている場合、本処理を実行しない
		if (appListOfLine.length > 0) {
			return;
		}
		
		var tmpAppListOfUpper = [];
		var tmpAppListOfLower = [];
		for (var appIdKey in appInfoList) {
			var tmpAppOrder = {};
			tmpAppOrder['appId'] = appIdKey;
			
			if ( !appInfoList[appIdKey]['def_app_order'].x && !appInfoList[appIdKey]['def_app_order'].y ) {
				// デフォルトの位置が設定されていない場合、下段の後ろ(右側)に配置
				//alert(appIdKey);
				tmpAppOrder['x'] = 100;
				tmpAppOrder['y'] = 1;
			}
			else {
				tmpAppOrder['x'] = appInfoList[appIdKey]['def_app_order'].x;
				tmpAppOrder['y'] = appInfoList[appIdKey]['def_app_order'].y;
			}
			
			if (tmpAppOrder.y == 0) {
				tmpAppListOfUpper.push(tmpAppOrder);
			}
			else {
				tmpAppListOfLower.push(tmpAppOrder);
			}
		}
		
		appListOfLine[0] = [];
		appListOfLine[1] = [];
		
		tmpAppListOfUpper.sort(function(a, b) { return a.x > b.x ? 1 : -1; });
		for (var x=0; x<tmpAppListOfUpper.length; x++) {
			//alert('upper ' + tmpAppListOfUpper[x].appId + ' x=' + tmpAppListOfUpper[x].x + ' y=' + tmpAppListOfUpper[x].y);
			appListOfLine[0].push(tmpAppListOfUpper[x].appId);
		}
		tmpAppListOfLower.sort(function(a, b) { return a.x > b.x ? 1 : -1; });
		for (var x=0; x<tmpAppListOfLower.length; x++) {
			//alert('lower ' + tmpAppListOfLower[x].appId + ' x=' + tmpAppListOfLower[x].x + ' y=' + tmpAppListOfLower[x].y);
			appListOfLine[1].push(tmpAppListOfLower[x].appId);
		}
	}
	
	
	//
	// 初期起動時の、追加アプリが存在する場合のアプリリスト配列への追加 (Appdended 2013/04/30 by yoshi@etram.jp)
	//
	function checkAppendApps() {
		for (var appIdKey in appInfoList) {
			var bFind = false;
			for (var y=0; y<appListOfLine.length; y++) {
				if (appListOfLine[y].indexOf(appIdKey) > -1) {
					bFind = true;
					break;
				}
				else if ((y + 1) == appListOfLine.length) {
					appListOfLine[y].push(appIdKey);
					//alert('push appListOfLine[' + y + '] ' + appIdKey);
				}
			}
		}
	}
	
	
	//
	// アプリ(ウィジェット)のレイアウト算出 (配列内の値のみセット(変更)。※ページ内のスタイル値の設定(変更)は行わない)
	//
	function calcLayoutForApps() {
		var maxMarkEx = 0;
		
		// アプリ(ウィジェット)レイアウト情報配列内の始点座標値のセット
		for (var l=0; l<appListOfLine.length; l++) {
			for (var x=0; x<appListOfLine[l].length; x++) {
				var curAppId = appListOfLine[l][x];
				
				if (x == 0) {
					appInfoList[curAppId]['sx'] = appOffsetX;
				}
				else {
					var prevAppId = appListOfLine[l][x - 1];
					appInfoList[curAppId]['sx'] = appInfoList[prevAppId]['sx'] + appSizeType[appInfoList[prevAppId]['type']]['w'] + appMarginX;
				}
				appInfoList[curAppId]['sy'] = appOffsetY + appSizeType[appInfoList[curAppId]['type']]['h'] * l + appMarginY * l;
				
				//alert('[' + l + '][' + x + ']=' + curAppId + ' sx=' + appInfoList[curAppId]['sx'] + ', sy=' + appInfoList[curAppId]['sy']);
				
				if (x == (appListOfLine[l].length - 1)) {
					var lastMarkEx = appInfoList[curAppId]['sx'] + appSizeType[appInfoList[curAppId]['type']]['w'] + parseInt(appMarginX / 2) + parseInt(markSize['w'] / 2);
					if (lastMarkEx > maxMarkEx) {
						maxMarkEx = lastMarkEx;
					}
				}
			}
		}
		
		// ガジェットの新ページ数の算出
		var newGadgetWidth;
		if ((maxMarkEx % gadgetViewPortWidth) > 0) {
			newGadgetWidth = (parseInt(maxMarkEx / gadgetViewPortWidth) + 1) * gadgetViewPortWidth;
		}
		else {
			newGadgetWidth = parseInt(maxMarkEx / gadgetViewPortWidth) * gadgetViewPortWidth;
		}
		newPageCount = newGadgetWidth / gadgetViewPortWidth;
	}
	
	
	//
	// アプリ移動先指定用マークの作成(※配列内へ)・レイアウト算出 (配列内の値をセット。スタイル値の設定は行わない)
	//
	function calcLayoutForMarks() {
		
		// アプリ移動先指定用マーク配列の初期化
		markPosList = {};
		for (var l=0; l<markListOfLine.length; l++) {
			markListOfLine[l] = [];
		}
		
		// アプリ(ウィジェット)レイアウト情報配列内の始点座標値のセット
		for (var l=0; l<appListOfLine.length; l++) {
			if (appListOfLine[l].length == 0) {
					
					// アプリ移動先指定マークの配列への追加
					var markId = 'ins_pos_' + l + '_0';
					markPosList[markId] = {'sx': appOffsetX - parseInt(appMarginX / 2) - parseInt(markSize['w'] / 2),
										   'sy': markOffsetY + l * appSizeType['single']['h'] + l * appMarginY};
					markListOfLine[l].push(markId);
			}
			else {
				for (var x=0; x<appListOfLine[l].length; x++) {
					var curAppId = appListOfLine[l][x];
					
					// アプリ移動先指定マークの配列への追加
					var markId = 'ins_pos_' + l + '_' + x;
					markPosList[markId] = {'sx': appInfoList[curAppId]['sx'] - parseInt(appMarginX / 2) - parseInt(markSize['w'] / 2),
										   'sy': markOffsetY + l * appSizeType['single']['h'] + l * appMarginY};
					markListOfLine[l].push(markId);
					
					//alert(markId + '.sx=' + markPosList[markId]['sx'] + ', sy=' + markPosList[markId]['sy']);
					
					if ((x + 1) == appListOfLine[l].length) {
						markId = 'ins_pos_' + l + '_' + (x + 1);
						markPosList[markId] = {'sx':appInfoList[curAppId]['sx'] + appSizeType[appInfoList[curAppId]['type']]['w'] + parseInt(appMarginX / 2) - parseInt(markSize['w'] / 2),
											   'sy':markOffsetY + l * appSizeType['single']['h'] + l * appMarginY};
						markListOfLine[l].push(markId);
						
						//alert(markId + '.sx=' + markPosList[markId]['sx'] + ', sy=' + markPosList[markId]['sy']);
					}
				}
			}
		}
	}
	
	
	//
	// ガジェット内アプリ(ウィジェット)のレイアウト更新
	//
	function updateLayoutOfApps() {
		
		for (var l=0; l<appListOfLine.length; l++) {
			for (var x=0; x<appListOfLine[l].length; x++) {
				var appId = appListOfLine[l][x];
				
				var appElem = document.getElementById(appId);
				appElem.style.left	 = appInfoList[appId]['sx'] + 'px';
				appElem.style.top	 = appInfoList[appId]['sy'] + 'px';
				appElem.style.width	 = appSizeType[appInfoList[appId]['type']]['w'] + 'px';
				appElem.style.height = appSizeType[appInfoList[appId]['type']]['h'] + 'px';
				//alert('#' + appId + '.left=' + appElem.style.left);
			}
		}
	}
	
	
	//
	// ガジェット内アプリ移動先指定マークのレイアウト更新
	//
	function updateLayoutOfMarks() {
		
		for (var l=0; l<markListOfLine.length; l++) {
			for (var x=0; x<markListOfLine[l].length; x++) {
				var markId = markListOfLine[l][x];
				
				var markElem = document.getElementById(markId);
				//alert(markElem.className);
				markElem.style.left	  = markPosList[markId]['sx'] + 'px';
				markElem.style.top	  = markPosList[markId]['sy'] + 'px';
				markElem.style.width  = markSize['w'] + 'px';
				markElem.style.height = markSize['h'] + 'px';
			}
		}
	}
	
	
	//
	// 長押ししたアプリの削除および、削除に伴うアプリ位置の移動
	//
	function changeModeToMoveApp() {
		if (moveAppId.length == 0) {
			return;
		}
		
		appIndexOfLine = -1;
		appLineIndex   = -1;
		var arrayIndex = -1;
		var targetLine = -1;
		
		for (var l=0; l<appListOfLine.length; l++) {
			arrayIndex = appListOfLine[l].indexOf(moveAppId);
			if (arrayIndex != -1) {
				targetLine = l;
				break;
			}
		}
		if (arrayIndex == -1) {
			return;
		}
		appIndexOfLine = arrayIndex;
		appLineIndex   = targetLine;
		
		var moveWidth = appSizeType[appInfoList[moveAppId]['type']]['w'] + appMarginX;
		//alert('targetLine=' + targetLine + ', arrayIndex=' + arrayIndex);
		
		
		// 指定アプリの右側に存在するアプリの配列内の座標値(sx)変更
		for (var i=arrayIndex+1; i<appListOfLine[targetLine].length; i++) {
			var tmpAppId = appListOfLine[targetLine][i];
			
			//alert(tmpAppId + '.sx=' + appInfoList[tmpAppId]['sx']);
			appInfoList[tmpAppId]['sx'] -= moveWidth;
			//alert(tmpAppId + '.sx=' + appInfoList[tmpAppId]['sx']);
		}
		
		// アプリリスト配列から対象アプリを削除
		appListOfLine[targetLine].splice(arrayIndex, 1);
		
		// ページ内ガジェット要素からの指定アプリ(ウィジェットの)の削除
		$('#' + moveAppId).remove();
		
		for (var i=arrayIndex; i<appListOfLine[targetLine].length; i++) {
			var appId = appListOfLine[targetLine][i];
			$('#' + appId).animate({left: '-=' + moveWidth + 'px'});
		}
		
		// アプリ移動先指定マーク配列の作成、表示
		setTimeout(function () {
			maskAtApps('show');															// アプリ(ウィジェット)のマスク表示
			
			calcLayoutForMarks();
			renewMarkIntoGadget();
			updateLayoutOfMarks();
			
			movableAppMode = 'movable_enable';
		}, 600);
		
	}
	
	
	//
	// アプリ移動先指定処理
	//
	function onTappedInsertPosMark(tappedMarkId) {
		var commonIdName = 'ins_pos_';
		/*
		alert(tappedMarkId);
		alert(tappedMarkId.substr(commonIdName.length));
		*/
		var arrayIndex = tappedMarkId.substr(commonIdName.length).split('_');
		var vIndex = parseInt(arrayIndex[0]);
		var hIndex = parseInt(arrayIndex[1]);
		//alert('vIndex=' + vIndex + ', hIndex=' + hIndex);
		
		if (hIndex >= appListOfLine[vIndex].length) {
			//alert('push');
			appListOfLine[vIndex].push(moveAppId);
		}
		else {
			//alert('insert');
			appListOfLine[vIndex].splice(hIndex, 0, moveAppId);
		}
		/*
		for (var l=0; l<appListOfLine.length; l++) {
			for (var x=0; x<appListOfLine[l].length; x++) {
				alert('[' + l + '][' + x + ']=' + appListOfLine[l][x]);
			}
		}
		*/
		
		//
		// レイアウト座標値配列の更新(再計算)
		//
		calcLayoutForApps();
		
		var gadgetElem = document.getElementById('gadget');
		
		//
		// 移動先指定マークの配列データおよびページ内の削除
		//
		markPosList = {};
		for (var l=0; l<markListOfLine.length; l++) {
			markListOfLine[l] = [];
		}
		$('.' + class_balloon + ', .' + class_balloon_bold).remove();
		
		var bDoGadgetResize = false;
		
		// ガジェットサイズが大きくなる場合→ガジェットサイズ変更
		if (newPageCount > pageMax) {
			$('#' + id_gadget).width(newPageCount * gadgetViewPortWidth);
			pageMax = newPageCount;
			bDoGadgetResize = true;
		}
		
		// 指定位置の右側にアプリが存在する場合→移動
		var moveWidth = appSizeType[appInfoList[moveAppId]['type']]['w'] + appMarginX;
		for (var x=hIndex; x<appListOfLine[vIndex].length; x++) {
			var appId = appListOfLine[vIndex][x];
			$('#' + appId).animate({left: '+=' + moveWidth + 'px'});
		}
		
		// 指定位置へのアプリ設置
		setTimeout(function() {
			var moveAppElem;
			
			// DOM が null の場合にテンプレートから作成 (Modified 2013/04/30 by yoshi@etram.jp)
			if (appInfoList[ moveAppId ].dom == null) {
				if( appInfoList[moveAppId].type == 'single' ) {
					moveAppElem = $( '#' + id_templateSimpleApp ).tmpl( configAppObject[moveAppId] );
				} else if( appInfoList[moveAppId].type == 'double' ) {
					moveAppElem = $( '#' + id_templateWidgetApp ).tmpl( configAppObject[moveAppId] );
				}
			}
			else {
				moveAppElem = appInfoList[ moveAppId ].dom;
			}
			moveAppElem.css( {
				left  :appInfoList[moveAppId]['sx'] + 'px',
				top   :appInfoList[moveAppId]['sy'] + 'px',
				width :appSizeType[appInfoList[moveAppId]['type']]['w'] + 'px',
				height:appSizeType[appInfoList[moveAppId]['type']]['h'] + 'px'
			} );
			$( '#' + id_gadget ).append( moveAppElem );
			
			movableAppMode = 'movable_disable';
			bAppTapped	   = false;
			
			// ガジェットサイズが小さくなる場合→ガジェットサイズ変更
			if (newPageCount < pageMax) {
				$('#' + id_gadget).width(newPageCount * gadgetViewPortWidth);
				pageMax = newPageCount;
				bDoGadgetResize = true;
			}
			
			// ガジェットサイズが変更された場合→スライダーバーの更新
			if (bDoGadgetResize == true) {
				setSliderbar();
			}
			
			maskAtApps('hide');															// アプリ(ウィジェット)のマスク表示
			
			//
			// アプリ(ウィジェット)のレイアウト情報をユーザ設定情報に保存するためのJSON値の作成 (Appended 2013/05/09 by yoshi@etram.jp)
			//
			makeJsonForAppsLayout();
			
		}, 500);
	}
	
	
	//
	// アプリ(ウィジェット)のマスク表示/非表示 (Modified 2013/05/15 by yoshi@etram.jp)
	//	
	function maskAtApps(changeMode) {
		
		// ※ID指定からクラス名指定への修正
		
		// マスク表示指定の場合
		if (changeMode == 'show') {
			$('.' + class_movable).append(elemAppMask);
		}
		// マスク表示消去(非表示)指定の場合
		else {
			$('.' + class_movable + ' > .' + class_mask).remove();
		}
	}
	
	
	//
	// アプリ(ウィジェット)のレイアウト情報のJSON値からアプリリスト配列への展開
	//
	function setAppListFromJson(jsonStr) {
		if ( !jsonStr ) {
			return;
		}
		var dicJsonObj = JSON.parse(jsonStr);											// JSONからオブジェクト(連想配列)への変換
		var tmpArray = [[], []];
		
		for (var key in dicJsonObj) {
			//alert(key + ': {x:' + dicJsonObj[key].x + ', y:' + dicJsonObj[key].y + '}');
			
			if (dicJsonObj[key].y == 0) {
				tmpArray[0].push( {'appId':key, 'x':dicJsonObj[key].x, 'y':dicJsonObj[key].y} );
			}
			else {
				tmpArray[1].push( {'appId':key, 'x':dicJsonObj[key].x, 'y':dicJsonObj[key].y} );
			}
		}
		
		/* (ソート用テストデータ)
		tmpArray[0] = [ {'appId':'app1', 'x':1, 'y':0},
						{'appId':'app0', 'x':0, 'y':0},
						{'appId':'app5', 'x':5, 'y':0},
						{'appId':'app6', 'x':6, 'y':0},
						{'appId':'app3', 'x':3, 'y':0},
						{'appId':'app2', 'x':2, 'y':0},
						{'appId':'app4', 'x':4, 'y':0} ];
		tmpArray[1] = [ {'appId':'app9', 'x':2, 'y':0},
						{'appId':'app7', 'x':0, 'y':0},
						{'appId':'app8', 'x':1, 'y':0} ];
		*/
		
		// x値でのソート
		for (var y=0; y<tmpArray.length; y++) {
			/*
			for (var x=0; x<tmpArray[y].length; x++) {
				alert('[' + y + '][' + x + ']={appId:' + tmpArray[y][x].appId + ', x:' + tmpArray[y][x].x + ', y;' + tmpArray[y][x].y + '}');
				//console.log(tmpArray[y][x]);
			}
			*/
			tmpArray[y].sort(function(a, b) { return a.x > b.x ? 1 : -1; });
		}
		
		//
		// アプリリスト配列への反映
		//
		appListOfLine = [[], []];
		
		for (var y=0; y<tmpArray.length; y++) {
			for (var x=0; x<tmpArray[y].length; x++) {
				//alert('[' + y + '][' + x + ']={appId:' + tmpArray[y][x].appId + ', x:' + tmpArray[y][x].x + ', y;' + tmpArray[y][x].y + '}');
				appListOfLine[y].push(tmpArray[y][x].appId);
			}
		}
		
		/*
		// (ダンプ)
		for (var y=0; y<appListOfLine.length; y++) {
			for (var x=0; x<appListOfLine[y].length; x++) {
				alert('[' + y + '][' + x + ']=' + appListOfLine[y][x]);
			}
		}
		*/
	}
	
	
	//
	// ダンプ表示 (デバッグ用)
	//
	function debugInfo(str) {
		$('#dump').html(str);
	}
	
	
	//
	// appInfoList配列に指定のキー(appIdKey)の要素が存在するかのチェックと、存在しない場合の要素追加
	// 
	//	
	function existAppInfoInAppInfoList(appIdKey) {
		
		var bFind = false;
		for (var appKey in appInfoList) {
			if (appIdKey == appKey) {
			//	console.log(appIdKey + ' is exist in appInfoList{}.');
				bFind = true;
				break;
			}
		}
		
		if (bFind == false) {
			appInfoList[appIdKey] = {'sx':-1, 'sy':-1, 'type':'single', 'url':'', 'app_id':'', 'app_name':'', 'app_icon':'', 'version':'', 'def_app_order':{'x':10, 'y':1}, 'dom':null, 'thumbnail':''};
			
			//console.log(appInfoList);
		}
	}
	
	
	//
	// アプリアイコン(ウィジェット)オブジェクトへのアプリ情報の反映 (ポリシーデータから取得した、アプリ名、アイコン画像、サムネイル画像の反映)
	//
	function setAppInfoToConfigObject() {
		
		for (var appKey in appInfoList) {
			
			var bExist = false;
			for (var objKey in configAppObject) {
				if (objKey == appKey) {
					bExist = true;
					break;
				}
			}
			if (bExist == true) {
				configAppObject[ appKey ].elemId  = appKey;
				configAppObject[ appKey ].appName = appInfoList[ appKey ].app_name;
				configAppObject[ appKey ].appIcon = appInfoList[ appKey ].app_icon;
			}
			else {
				configAppObject[ appKey ] = {elemId:appKey, appName:appInfoList[ appKey ].app_name, appIcon:appInfoList[ appKey ].app_icon};
			}
		}
	}
	
	
	//
	// ランチャー内のウィジェット部分のhtml定義指定用関数
	// 　・追加アプリがウィジェットの場合、配列に追加して下さい。
	//   ・ウィジェットのhtmlは、index.html内に追加記述して下さい。
	//   ※ウィジェット形式でないアプリアイコン形式は、追加しなくても、appInfoList内の情報から自動生成します。
	//
	function createAppElemList() {
		
		var configObject = {
			app5:{
				appTmpl:$( "#templateApp5" )
			},
			app6:{
				appTmpl:$( "#templateApp6" )
			},
			app7:{
				appTmpl:$( "#templateApp7" )
			},
			app8:{
				appTmpl:$( "#templateApp8" )
			}
			
		};
		
		return configObject;
		
	}
	
  });	// $(document).ready(function(e) {

})(jQuery);
