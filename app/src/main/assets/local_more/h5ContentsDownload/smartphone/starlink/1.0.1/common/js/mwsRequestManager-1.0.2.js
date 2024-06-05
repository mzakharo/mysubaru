var mwsRequestManager = {};

// 定数
mwsRequestManager.MWS_DOMAIN = "127.0.0.1";
mwsRequestManager.MWS_HTTP_PROTOCOL = "http";
mwsRequestManager.MWS_HTTPS_PROTOCOL = "https";
mwsRequestManager.PROTOCOL_JOIN = "://";
mwsRequestManager.PORT_JOIN = ":";
mwsRequestManager.FUNC_JOIN = "/";
mwsRequestManager.MWS_CHECK_FUNK = "timestamp";
mwsRequestManager.GET_MWS_PORT_TIMEOUT = 500;
mwsRequestManager.CHECK_MWS_REQ_TIMEOUT = 3000;
mwsRequestManager.KEY_HTTP_PORT = "mwsRequestManager_mws_http_port";
mwsRequestManager.KEY_HTTPS_PORT = "mwsRequestManager_mws_https_port";
mwsRequestManager.KEY_ENABLED_HTTPS = "mwsRequestManager_enabled_https";
mwsRequestManager.TRUE_FLAG = "0";
mwsRequestManager.FALSE_FLAG = "1";

// 変数
mwsRequestManager.MWS_HTTP_PORT = "8008";
mwsRequestManager.MWS_HTTPS_PORT = "8443";
mwsRequestManager.isGetPort = false;
mwsRequestManager.enabledHttps = false;
mwsRequestManager.requesting = false;
mwsRequestManager.initializeCallbackArray = new Array();

// 初期化処理
mwsRequestManager.initialize = function(callback){
	// ポート取得（microserver.js）が同時複数リクエストに対応していない
    // その為、リクエスト中の場合はコールバックの登録のみとする
	if(mwsRequestManager.requesting){
		if(callback){
            mwsRequestManager.initializeCallbackArray.push(callback);
        }
		return;
	}
	
    mwsRequestManager.requesting = true;
    if(callback){
        mwsRequestManager.initializeCallbackArray.push(callback);
    }
	
    mwsRequestManager._updateMwsInfo()
    .then(mwsRequestManager._judgeEnabledHttps)
    .then(function(){
        mwsRequestManager.requesting = false;
        console.log("mwsRequestManager.initialize callback length = " + mwsRequestManager.initializeCallbackArray.length);
        for(var i=0; i < mwsRequestManager.initializeCallbackArray.length; i++){
            mwsRequestManager.initializeCallbackArray[i]();
        }
        mwsRequestManager.initializeCallbackArray.length = 0;
        mwsRequestManager.isGetPort = true;
    });
};

// MWSのURL取得
// 例：http://127.0.0.1:8008/
mwsRequestManager.getMWSUrl = function(){
    mwsRequestManager._updateGetPort();
    var domain = mwsRequestManager.MWS_DOMAIN;
    var port = mwsRequestManager.enabledHttps ? mwsRequestManager.MWS_HTTPS_PORT : mwsRequestManager.MWS_HTTP_PORT;
    var protocol = mwsRequestManager.enabledHttps ? mwsRequestManager.MWS_HTTPS_PROTOCOL : mwsRequestManager.MWS_HTTP_PROTOCOL;
    
    return mwsRequestManager._createMWSUrl(protocol, domain, port);
};

// MWSのURL（ポート番号なし）取得
// 例：http://127.0.0.1
mwsRequestManager.getMWSUrlWithoutPort = function(){
	mwsRequestManager._updateGetPort();
    var protocol = mwsRequestManager.enabledHttps ? mwsRequestManager.MWS_HTTPS_PROTOCOL : mwsRequestManager.MWS_HTTP_PROTOCOL;
    var domain = mwsRequestManager.MWS_DOMAIN;
    return protocol + mwsRequestManager.PROTOCOL_JOIN + domain;
}

// MWSのポート番号取得
// 例：8008
mwsRequestManager.getMWSPort = function(){
    mwsRequestManager._updateGetPort();
    return mwsRequestManager.enabledHttps ? mwsRequestManager.MWS_HTTPS_PORT : mwsRequestManager.MWS_HTTP_PORT;
}

// MWSの機能リクエストURLの生成
// 例(funcUrl="timestamp")：http://127.0.0.1:8008/timestamp
mwsRequestManager.getMWSRequestUrl = function(funcUrl){
    if(funcUrl == null){
        funcUrl = "";
    }
    
    if(funcUrl.substring(0,1) == mwsRequestManager.FUNC_JOIN){
        funcUrl = funcUrl.substr(1);
    }
    
    console.log("mwsRequestManager.getMWSRequestUrl = " + mwsRequestManager._createMWSRequestUrl(mwsRequestManager.getMWSUrl(), funcUrl));
    
    return mwsRequestManager._createMWSRequestUrl(mwsRequestManager.getMWSUrl(), funcUrl);
};

// MWSのURL生成
mwsRequestManager._createMWSUrl = function(protocol, domain, port){    
    return protocol + mwsRequestManager.PROTOCOL_JOIN + domain + mwsRequestManager.PORT_JOIN + port + mwsRequestManager.FUNC_JOIN;
};

// MWSの機能リクエストURLの生成
mwsRequestManager._createMWSRequestUrl = function(mwsUrl, funcUrl){
    return mwsUrl + funcUrl;
}

// MWSの情報更新
mwsRequestManager._updateMwsInfo = function(){
    var d = new $.Deferred();
    var timeoutID = null;

    // デフォルト設定
    mwsRequestManager.MWS_HTTPS_PORT = -1;
    mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTPS_PORT, mwsRequestManager.MWS_HTTPS_PORT);
    mwsRequestManager.MWS_HTTP_PORT = 8008;
    mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTP_PORT, mwsRequestManager.MWS_HTTP_PORT);

    // HTTPS対応版アプリでのポート番号取得
    var updateMwsInfo = function(){
        window.mws = window.mws === undefined ? new Object() : window.mws;
        window.mws.callbacks = window.mws.callbacks === undefined ? new Object() : window.mws.callbacks;
        window.mws.callbacks["mwsRequestManager_updateMwsInfo"] = function(){
            clearTimeout(timeoutID);
            mwsRequestManager.MWS_HTTP_PORT = window.mws.wiFiHttpPort;
            mwsRequestManager.MWS_HTTPS_PORT = window.mws.wiFiHttpsPort;
            mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTP_PORT, mwsRequestManager.MWS_HTTP_PORT);
            mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTPS_PORT, mwsRequestManager.MWS_HTTPS_PORT);
            d.resolve();
        };
        timeoutID = setTimeout(function() {
            console.log("mwsRequestManager._updateMwsInfo timeout");
            mwsRequestManager.MWS_HTTPS_PORT = -1;
            mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTPS_PORT, mwsRequestManager.MWS_HTTPS_PORT);
            d.resolve();
        }, mwsRequestManager.GET_MWS_PORT_TIMEOUT);
        document.location="UJMLAPP:updateMwsInfo(mwsRequestManager_updateMwsInfo)";
    };

    // 既存のポート番号（非SSL）を取得
    var microserver = UIEMicroserver.getInstance();
    microserver.getLocalServerPort(function(port){
        // HTTPポート番号保持を更新
        mwsRequestManager.MWS_HTTP_PORT = String(port);
        mwsRequestManager._setStorageValue(mwsRequestManager.KEY_HTTP_PORT, mwsRequestManager.MWS_HTTP_PORT);

        // 既存のポート番号（非SSL）で拡張APIリクエストに失敗した場合は、HTTPSポート番号取得を試みる
        var checkMwsURL = mwsRequestManager._createMWSUrl(mwsRequestManager.MWS_HTTP_PROTOCOL, mwsRequestManager.MWS_DOMAIN, mwsRequestManager.MWS_HTTP_PORT);
        var checkMwsReqURL = mwsRequestManager._createMWSRequestUrl(checkMwsURL, "timestamp");
        mwsRequestManager._requestMws(checkMwsReqURL, function(result){
            if(result){
                // 非SSLでリクエスト成功した場合は完了
                d.resolve();
            }else{
                // 非SSLでリクエスト失敗した場合はHTTPSポート番号取得を実施
                updateMwsInfo();
            }
        });
    });

    return d.promise();
}

// MWSのHTTPSが有効かを判定する
mwsRequestManager._judgeEnabledHttps = function(){
    var d = new $.Deferred();
    
    // HTTPSポートが取得できればHTTPS対応と判断する
    mwsRequestManager.enabledHttps = (mwsRequestManager.MWS_HTTPS_PORT != -1);
    mwsRequestManager._setStorageValue(mwsRequestManager.KEY_ENABLED_HTTPS, mwsRequestManager.enabledHttps ? mwsRequestManager.TRUE_FLAG : mwsRequestManager.FALSE_FLAG);
    d.resolve();
    
    return d.promise();
}

// MWSへのリクエスト（リクエスト成否の確認）
mwsRequestManager._requestMws = function(url, callback){
    $.ajax({
        type:"GET",
        url:url,
        timeout:mwsRequestManager.CHECK_MWS_REQ_TIMEOUT,
        success:function(data, dataType){
            if(callback){
                callback(true);
            }
        },
        error:function(xhr, textStatus, errorThrown){
            if(callback){
                callback(false);
            }
        }
    });
}

// ポート番号変数の更新（ローカルストレージから取得）
mwsRequestManager._updateGetPort = function(){
    if(!mwsRequestManager.isGetPort){
        mwsRequestManager.MWS_HTTP_PORT = mwsRequestManager._getStorageValue(mwsRequestManager.KEY_HTTP_PORT);
        mwsRequestManager.MWS_HTTPS_PORT = mwsRequestManager._getStorageValue(mwsRequestManager.KEY_HTTPS_PORT);
        mwsRequestManager.enabledHttps = mwsRequestManager._getStorageValue(mwsRequestManager.KEY_ENABLED_HTTPS) == mwsRequestManager.TRUE_FLAG;
        mwsRequestManager.isGetPort = true;
    }
}

// LocalStorageが利用可能か
mwsRequestManager._canUseLocalStorage = function(){
    return localStorage != null;
}

// LocalStorageに値を格納
mwsRequestManager._setStorageValue = function(key, value){
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    if(mwsRequestManager._canUseLocalStorage()){
        // LocalStorage
        localStorage.setItem(key, value);
    }else{
        // Cookie
        document.cookie = key + "=" + value + "; Path=/;";
    }
}

// LocalStorageから値を取得
mwsRequestManager._getStorageValue = function(key){
    key = encodeURIComponent(key);

    if(mwsRequestManager._canUseLocalStorage()){
        // LocalStorage
        var tempValue = decodeURIComponent(localStorage.getItem(key));
        if(tempValue  == "null"){
        return null;
        }
        return tempValue;
    }else{
        // Cookie
        var allValues = document.cookie;
        if(allValues != null){
            var splitValue = allValues.split("; ");
            for(var i = 0; i < splitValue.length; i++){
                if(splitValue[i].split("=")[0] == key){
                    return encodeURIComponent(splitValue[i].split("=")[1]);
                }
            }
            return null;
        }else{
            return null;
        }
    }
}