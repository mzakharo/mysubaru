var HarmanOTA;
(function (HarmanOTA) {
    /**
     * CommonHTMLSDK
     */
    var CommonHTMLSDK = (function () {
        /**
         * コンストラクタ
         */
        function CommonHTMLSDK() {
            this._isRegistNotifyCallback = false;
            this.initializeSDK();
        }
        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        CommonHTMLSDK.getInstance = function () {
            if (CommonHTMLSDK.instance == null) {
                CommonHTMLSDK.instance = new CommonHTMLSDK();
            }
            return CommonHTMLSDK.instance;
        };
        /**
         * SDK初期化処理
         */
        CommonHTMLSDK.prototype.initializeSDK = function () {
            window.mws = window.mws === undefined ? new Object() : window.mws;
            window.mws.callbacks = window.mws.callbacks === undefined ? new Object() : window.mws.callbacks;
        };
        /**
         * 外部ブラウザ起動
         * @param url 外部ブラウザで開くURL
         */
        CommonHTMLSDK.prototype.openlink_exbrowser = function (url) {
            var param = "openlink_exbrowser=true";
            var reqUrl = url + (url.indexOf("?") >= 0 ? "&" : "?") + param;
            window.location.href = reqUrl;
        };
        /**
         * KVS値読み出し（ネイティブバインダを経由し、IPアドレスによる通信を介さず、ネイティブロジックでアクセス方式）
         * @param key KVSキー
         * @param callback KVS値読み出しコールバック
         */
        CommonHTMLSDK.prototype.readKVS = function (key, callback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("readKVS");
            var params = [new HarmanOTA.NativeBinder.RequestParams(key, true)];
            var releaseTimeoutWatcher = this.requestNativeBinder("UJMLAPP:readKVS", params, callbackKey, function (key, value) {
                console.log("#9325  requestNativeBinder  UJMLAPP:readKVS  respCallBack");
                // レスポンス
                releaseTimeoutWatcher();
                callback(key, value);
                _this.clearNativeBinderCallback(callbackKey);
            }, function (isSuccess) {
                    console.log("#9325  requestNativeBinder  UJMLAPP:readKVS  timeoutCallBack (isSuccess:" + isSuccess + ")");
                // MWSエミュレータ利用時はisSuccessが設定される
                if (isSuccess == undefined || !isSuccess) {
                    // タイムアウト
                    callback(key, undefined);
                }
            });
        };
        /**
         * KVS値書き込み（ネイティブバインダを経由し、IPアドレスによる通信を介さず、ネイティブロジック
         */
        CommonHTMLSDK.prototype.writeKVS = function (key, value, callback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("writeKVS");
            var params = [new HarmanOTA.NativeBinder.RequestParams(key, true), new HarmanOTA.NativeBinder.RequestParams(value, true)];
            var releaseTimeoutWatcher = this.requestNativeBinder("UJMLAPP:writeKVS", params, callbackKey, function (key, value, result) {
                console.log("#9325  requestNativeBinder  UJMLAPP:writeKVS  respCallBack");
                // レスポンス
                releaseTimeoutWatcher();
                callback(key, value, result);
                _this.clearNativeBinderCallback(callbackKey);
            }, function (isSuccess) {
                console.log("#9325  requestNativeBinder  UJMLAPP:writeKVS  timeoutCallBack (isSuccess:" + isSuccess + ")");
                // MWSエミュレータ利用時はisSuccessが設定される
                if (isSuccess == undefined || !isSuccess) {
                    // タイムアウト
                    callback(key, value, false);
                }
            });
        };
        /**
         * ネイティブバインダのリクエスト
         * @param methodName メソッド名
         * @param params パラメータリスト
         * @param respCallbackKey レスポンスコールバックキー
         * @param respCallback レスポンスコールバック
         * @param timeoutCallback タイムアウトコールバック
         * @return タイムアウト監視解除処理（返却されるメソッドを実行するとtimeoutCallback実行監視が解除される）
         */
        CommonHTMLSDK.prototype.requestNativeBinder = function (methodName, params, respCallbackKey, respCallback, timeoutCallback) {
            // リクエストタイムアウト判定（ネイティブ側が未対応の場合を想定）
            var _this = this;
            var timer = setTimeout(function () {
                if (timeoutCallback != null) {
                    timeoutCallback();
                }
                _this.clearNativeBinderCallback(respCallbackKey);
            }, CommonHTMLSDK.REQUEST_TIMEOUT_INTERVAL);
            var releaseTimeoutWatcher = function () {
                clearTimeout(timer);
            };
            // レスポンスコールバック
            window.mws.callbacks[respCallbackKey] = respCallback;
            // リクエスト
            var reqUrlArray = new Array();
            var isExistsParam = false;
            reqUrlArray.push(methodName);
            reqUrlArray.push("(");
            if (params != null) {
                for (var i = 0; i < params.length; i++) {
                    if (i > 0) {
                        reqUrlArray.push(",");
                    }
                    reqUrlArray.push(params[i].getValue());
                    isExistsParam = true;
                }
            }
            if (respCallbackKey != null) {
                if (isExistsParam) {
                    reqUrlArray.push(",");
                }
                reqUrlArray.push(respCallbackKey);
            }
            reqUrlArray.push(")");
            var reqUrl = reqUrlArray.join("");
            // デバッグフラグONの場合はリクエストせずにタイムアウトを起こす
            if (!HarmanOTA.useStubSDK) {
//                console.log("#9325  HarmanOTA.NativeBinder().postRequest (url=" + reqUrl + ")");
                new HarmanOTA.NativeBinder().postRequest(reqUrl);
            }
            return releaseTimeoutWatcher;
        };
        /**
         * ネイティブバインダのコールバック登録をクリア
         * @param callbackKey クリア対象のコールバックキー
         */
        CommonHTMLSDK.prototype.clearNativeBinderCallback = function (callbackKey) {
            window.mws.callbacks[callbackKey] = undefined;
        };
        /**
         * ネイティブバインダのコールバックキーを生成（指定名に時間値を付加する）
         * @param 指定名
         */
        CommonHTMLSDK.prototype.createNativeBinderCallbackKey = function (name) {
            return HarmanOTA.NativeBinder.createNativeBinderCallbackKey(name);
        };
        CommonHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY = "completedRequest";
        // UJMLAPP:のネイティブバインダはリクエスト処理受領通知が実装されていない為、レスポンスコールバックでタイムアウトを判断する。
        CommonHTMLSDK.REQUEST_TIMEOUT_INTERVAL = 15000;
        CommonHTMLSDK.instance = null;
        return CommonHTMLSDK;
    })();
    HarmanOTA.CommonHTMLSDK = CommonHTMLSDK;
})(HarmanOTA || (HarmanOTA = {}));
//# sourceMappingURL=harman_ota_sdk.js.map
