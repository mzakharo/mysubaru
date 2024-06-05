var HarmanOTA;
(function (HarmanOTA) {
    /**
     * AhaConnectHTMLSDK
     */
    var AhaConnectHTMLSDK = (function () {
        /**
         * コンストラクタ
         */
        function AhaConnectHTMLSDK() {
            this._isRegistNotifyCallback = false;
            this.initializeSDK();
        }
        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        AhaConnectHTMLSDK.getInstance = function () {
            if (AhaConnectHTMLSDK.instance == null) {
                AhaConnectHTMLSDK.instance = new AhaConnectHTMLSDK();
            }
            return AhaConnectHTMLSDK.instance;
        };
        /**
         * SDK初期化処理
         */
        AhaConnectHTMLSDK.prototype.initializeSDK = function () {
            window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;
            window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;
            this._notifyCallbacks = new Array();
        };
        /**
         * AhaConnect SDKの初期化処理（initializeWithParam）を実行する
         * @param param AhaConnect SDKの引数
         * @param respCallback レスポンスコールバック（初期化処理完了時に通知される)
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.initializeWithParam = function (param, respCallback, reqCallback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("initializeWithParam");
            var params = [new HarmanOTA.NativeBinder.RequestParams(JSON.stringify(param), false)];
            this.requestNativeBinder("AHASDK:initializeWithParam", params, callbackKey, function () {
                respCallback();
                _this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        };
        /**
         * AhaConnect SDKの非同期リクエスト（sendAsyncRequest）を実行する
         * @param param AhaConnect SDKの引数
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.sendAsyncRequest = function (param, respCallback, reqCallback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("sendAsyncRequest_" + param.req);
            var params = [new HarmanOTA.NativeBinder.RequestParams(JSON.stringify(param), false)];
            this.requestNativeBinder("AHASDK:sendAsyncRequest", params, callbackKey, function (responsePayload, responseContentType, errorCode) {
                respCallback(responsePayload, responseContentType, errorCode);
                _this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        };
        /**
         * AhaConnect SDKの通知（notifyData）を受け取る為のコールバックを登録する
         * @param notifyCallback 通知コールバック
         * @param notifyCallbackThis 通知コールバック呼び出し時のthis指定（未指定時はデフォルト）
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.addNotifyData = function (notifyCallback, notifyCallbackThis, reqCallback) {
            // notifyDataのコールバックを複数にする場合、呼び出しコールバックの管理は本SDKで吸収する。
            // ネイティブ側には常に1つのコールバックキーを登録するのみとする。（コールバックキーは固定文字）
            var _this = this;
            // ネイティブ側に既にコールバック登録済みの可能性を考慮し、本I/F呼び出し時はネイティブ側のコールバック登録を毎回解除する
            var callbackKey = "notifyData";
            // 本SDK管理のコールバックリストに追加する
            // 既に登録済みの場合は削除
            this.removeNotifyData(notifyCallback, null);
            // リストに追加
            this._notifyCallbacks.push({ "callback": notifyCallback, "callbackthis": (notifyCallbackThis != null ? notifyCallbackThis : this) });
            // ネイティブ側にコールバック登録を行う
            this.requestNativeBinder("AHASDK:addNotifyData", null, callbackKey, _this.notifyCallback, reqCallback);
        };
        /**
         * AhaConnect SDKの通知（notifyData）を受け取る為のコールバックの登録を解除する
         * @param notifyCallback 登録解除対象のコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.removeNotifyData = function (notifyCallback, reqCallback) {
            var _this = this;
            this._notifyCallbacks.some(function (value, index, array) {
                if (value.callback === notifyCallback) {
                    _this._notifyCallbacks.splice(index, 1);
                    return true;
                }
                return false;
            });
            if (reqCallback != null) {
                reqCallback(true);
            }
        };
        /**
         * AhaConnect SDKの通知（notifyData）を受け取り、本SDKへ登録されているコールバックを呼び出す処理
         * @param notifyPayload 通知データ
         * @param notifyContentType 通知データタイプ
         */
        AhaConnectHTMLSDK.prototype.notifyCallback = function (notifyPayload, notifyContentType) {
            // ネイティブ側から呼ばれる為、thisは自クラスのインスタンスを指さない。
            // その為、明示的にインスタンスを指定する必要がある。
            var instance = HarmanOTA.AhaConnectHTMLSDK.getInstance();
            for (var i = 0; i < instance._notifyCallbacks.length; i++) {
                if (instance._notifyCallbacks[i] != null) {
                    instance._notifyCallbacks[i].callback.call(instance._notifyCallbacks[i].callbackthis, notifyPayload, notifyContentType);
                }
            }
        };
        /**
         * AhaConnect SDK向けに地図データダウンロードのキューを登録する
         * @param keys 地図データダウンロードキーのリスト（AhaConnect SDKのstartDownloadのパラメータに合わせる）
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.addDownloadQueue = function (keys, reqCallback) {
            var callbackKey = this.createNativeBinderCallbackKey("addDownloadQueue");
            var params = [new HarmanOTA.NativeBinder.RequestParams(JSON.stringify(keys), true)];
            this.requestNativeBinder("AHASDK:addDownloadQueue", params, callbackKey, null, reqCallback);    
        };
        /**
         * AhaConnect SDK向けに登録されている地図データダウンロードのキュー情報を取得する
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        AhaConnectHTMLSDK.prototype.getDownloadQueue = function (respCallback, reqCallback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("getDownloadQueue");
            this.requestNativeBinder("AHASDK:getDownloadQueue", null, callbackKey, function (keys) {
                respCallback(keys);
                _this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        };
        
        /**
         * ネイティブ側のダウンロードキューをクリアする
         * @param {*} reqCallback 
         */
        AhaConnectHTMLSDK.prototype.clearDownloadQueue = function (reqCallback) {
            var callbackKey = this.createNativeBinderCallbackKey("clearDownloadQueue");
            this.requestNativeBinder("AHASDK:clearDownloadQueue", null, callbackKey, null, reqCallback);
        };

        /**
         * ネイティブ側の転送進捗のオンメモリの値を取得する。
         * 転送完了は検出できないたため、転送プログレスが100の場合は完了とみなすこと。
         * 空のオブジェクトの場合は、進捗なし。
         * @param {*} respCallback 進捗データのJson。ただし、String型なので、JSON.stringifyすること。
         * @param {*} reqCallback リクエストがネイティブに到達した事をコールバックする。
         */
        AhaConnectHTMLSDK.prototype.gettransferMapDataProgress = function (respCallback, reqCallback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("gettransferMapDataProgress");
            this.requestNativeBinder("AHASDK:gettransferMapDataProgress", null, callbackKey, function (keys) {
                respCallback(keys);
                _this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        };

        /**
         * ネイティブ側のDL進捗のオンメモリの値を取得する。
         * 空のオブジェクトの場合は、進捗なし。
         * @param {*} respCallback 進捗データのJson。ただし、String型なので、JSON.stringifyすること。
         * @param {*} reqCallback リクエストがネイティブに到達した事をコールバックする。
         */
        AhaConnectHTMLSDK.prototype.getdownloadMapDataProgress = function (respCallback, reqCallback) {
            var _this = this;
            var callbackKey = this.createNativeBinderCallbackKey("getdownloadMapDataProgress");
            this.requestNativeBinder("AHASDK:getdownloadMapDataProgress", null, callbackKey, function (keys) {
                respCallback(keys);
                _this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        };

        /**
        * AhaConnect SDK向けに地図データダウンロードのキューを登録する
        * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
        */
        AhaConnectHTMLSDK.prototype.applySettings = function (reqCallback) {
            var callbackKey = this.createNativeBinderCallbackKey("applySettings");
            this.requestNativeBinder("AHASDK:applySettings", null, callbackKey, null, reqCallback);
        };

        /**
         * ネイティブ側にnotifyDataを発生させます。
         * @param {*} keys 
         * @param {*} reqCallback 
         */
        AhaConnectHTMLSDK.prototype.debugNotifyData = function (payload, contentType, sericeIdentifier) {
            var callbackKey = this.createNativeBinderCallbackKey("debug_notifyData");
            var params = [
                new HarmanOTA.NativeBinder.RequestParams(JSON.stringify(payload), true),
                new HarmanOTA.NativeBinder.RequestParams(contentType, true),
                new HarmanOTA.NativeBinder.RequestParams(sericeIdentifier, true)
            ];
            this.requestNativeBinder("AHASDK:debug_notifyData", params, callbackKey, null, null);
        };
        /**
         * ネイティブバインダのリクエスト
         * @param methodName メソッド名
         * @param params パラメータリスト
         * @param respCallbackKey レスポンスコールバックキー
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック
         */
        AhaConnectHTMLSDK.prototype.requestNativeBinder = function (methodName, params, respCallbackKey, respCallback, reqCallback) {
            if (respCallback == undefined || respCallback == null) {
                respCallback = function () {};
            }
            if (reqCallback == undefined || reqCallback == null) {
                reqCallback = function () {};
            }
            // リクエストタイムアウト判定（ネイティブ側が未対応の場合を想定）
            var isTimeout = false;
            var _this = this;
            var timer = setTimeout(function () {
                isTimeout = true;
                reqCallback(false);
                _this.clearNativeBinderCallback(respCallbackKey);
            }, AhaConnectHTMLSDK.REQUEST_TIMEOUT_INTERVAL);
            // ネイティブバインダ処理受領通知コールバック
            window.harman_ota.callbacks[AhaConnectHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY] = function (result) {
                clearTimeout(timer);
                if (!isTimeout) {
                    reqCallback(true);
                }
            };
            // レスポンスコールバック
            window.harman_ota.callbacks[respCallbackKey] = respCallback;
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
            // デバッグフラグONの場合は強制的に成功にする
            if (HarmanOTA.useStubSDK) {
                window.harman_ota.callbacks[AhaConnectHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY]();
            }
            else {
                new HarmanOTA.NativeBinder().postRequest(reqUrl);
            }
        };
        /**
         * ネイティブバインダのコールバック登録をクリア
         * @param callbackKey クリア対象のコールバックキー
         */
        AhaConnectHTMLSDK.prototype.clearNativeBinderCallback = function (callbackKey) {
            window.harman_ota.callbacks[callbackKey] = undefined;
        };
        /**
         * ネイティブバインダのコールバックキーを生成（指定名に時間値を付加する）
         * @param 指定名
         */
        AhaConnectHTMLSDK.prototype.createNativeBinderCallbackKey = function (name) {
            return HarmanOTA.NativeBinder.createNativeBinderCallbackKey(name);
        };
        AhaConnectHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY = "completedRequest";
        AhaConnectHTMLSDK.REQUEST_TIMEOUT_INTERVAL = 60000;
        AhaConnectHTMLSDK.instance = null;
        return AhaConnectHTMLSDK;
    })();
    HarmanOTA.AhaConnectHTMLSDK = AhaConnectHTMLSDK;

})(HarmanOTA || (HarmanOTA = {}));
//# sourceMappingURL=aha_connect_sdk.js.map
