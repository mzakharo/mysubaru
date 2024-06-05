interface Window {
    mws: any;
}
module HarmanOTA{
    /**
     * CommonHTMLSDK
     */
    export class CommonHTMLSDK {
        static COMPLETED_REQUEST_CALLBACK_KEY:string = "completedRequest";
        // UJMLAPP:のネイティブバインダはリクエスト処理受領通知が実装されていない為、レスポンスコールバックでタイムアウトを判断する。
        // その為、AHASDK:のネイティブバインダよりもタイムアウト判定時間は長め。
        static REQUEST_TIMEOUT_INTERVAL:number = isDebug ? 1 : 5000;
        private static instance:CommonHTMLSDK = null;
        private _isRegistNotifyCallback:boolean = false;
        private _notifyCallbacks:((notifyPayload:string, notifyContentType:string)=>void)[];

        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        public static getInstance() : CommonHTMLSDK {
            if(CommonHTMLSDK.instance == null){
                CommonHTMLSDK.instance = new CommonHTMLSDK();
            }
            return CommonHTMLSDK.instance;
        }

        /**
         * コンストラクタ
         */
        constructor(){
            this.initializeSDK();
        }

        /**
         * SDK初期化処理
         */
        private initializeSDK(){
            window.mws = window.mws === undefined ? new Object() : window.mws;
            window.mws.callbacks = window.mws.callbacks === undefined ? new Object() : window.mws.callbacks;
        }

        /**
         * 外部ブラウザ起動
         * @param url 外部ブラウザで開くURL
         */
        public openlink_exbrowser(url:string){
            var param:string = "openlink_exbrowser=true";
            var reqUrl:string = url + (url.indexOf("?") >= 0 ? "&" : "?") + param;
            window.document.location.href = reqUrl;
        }

        /**
         * KVS値読み出し（ネイティブバインダを経由し、IPアドレスによる通信を介さず、ネイティブロジックでアクセス方式）
         * @param key KVSキー
         * @param callback KVS値読み出しコールバック
         */
        public readKVS(key:string, callback:(key:string, value:string)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("readKVS");
            var params:NativeBinderRequestParams[] = [new NativeBinderRequestParams(key, true)];
            var releaseTimeoutWatcher = this.requestNativeBinder("UJMLAPP:readKVS", params, callbackKey, (key:string, value:string)=>{
                // レスポンス
                releaseTimeoutWatcher();
                callback(key, value);
                this.clearNativeBinderCallback(callbackKey);
            }, ()=>{
                // タイムアウト
                callback(key, undefined);
            });
        }

        /**
         * KVS値書き込み（ネイティブバインダを経由し、IPアドレスによる通信を介さず、ネイティブロジック
         */
        public writeKVS(key:string, value:string, callback:(key:string, value:string, result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("writeKVS");
            var params:NativeBinderRequestParams[] = [new NativeBinderRequestParams(key, true), new NativeBinderRequestParams(value, true)];
            var releaseTimeoutWatcher = this.requestNativeBinder("UJMLAPP:writeKVS", params, callbackKey, (key:string, value:string, result:boolean)=>{
                // レスポンス
                releaseTimeoutWatcher();
                callback(key, value, result);
                this.clearNativeBinderCallback(callbackKey);
            }, ()=>{
                // タイムアウト
                callback(key, value, false);
            });
        }

        /**
         * ネイティブバインダのリクエスト
         * @param methodName メソッド名
         * @param params パラメータリスト
         * @param respCallbackKey レスポンスコールバックキー
         * @param respCallback レスポンスコールバック
         * @param timeoutCallback タイムアウトコールバック
         * @return タイムアウト監視解除処理（返却されるメソッドを実行するとtimeoutCallback実行監視が解除される）
         */
        private requestNativeBinder(methodName:string, params:NativeBinderRequestParams[], respCallbackKey:string, respCallback:any, timeoutCallback:()=>void):()=>void{
            // リクエストタイムアウト判定（ネイティブ側が未対応の場合を想定）
            var _this:CommonHTMLSDK = this;
            var timer:number = setTimeout(function() {
                if(timeoutCallback != null){
                    timeoutCallback();
                }
                _this.clearNativeBinderCallback(respCallbackKey);
            }, CommonHTMLSDK.REQUEST_TIMEOUT_INTERVAL);
            var releaseTimeoutWatcher = ()=>{
                clearTimeout(timer);
            };

            // レスポンスコールバック
            window.mws.callbacks[respCallbackKey] = respCallback;

            // リクエスト
            var reqUrlArray:Array<string> = new Array();
            var isExistsParam:boolean = false;
            reqUrlArray.push(methodName);
            reqUrlArray.push("(");
            if(params != null){
                for(var i:number = 0; i < params.length; i++){
                    if(i > 0){
                        reqUrlArray.push(",");
                    }
                    reqUrlArray.push(params[i].getValue());
                    isExistsParam = true;
                }
            }
            if(respCallbackKey != null){
                if(isExistsParam){
                    reqUrlArray.push(",");
                }
                reqUrlArray.push(respCallbackKey);
            }
            reqUrlArray.push(")");
            var reqUrl = reqUrlArray.join("");

            // デバッグフラグONの場合はリクエストせずにタイムアウトを起こす
            if(!isDebug){
                window.document.location.href = reqUrl;
            }
            
            return releaseTimeoutWatcher;
        }

        /**
         * ネイティブバインダのコールバック登録をクリア
         * @param callbackKey クリア対象のコールバックキー
         */
        private clearNativeBinderCallback(callbackKey:string){
            window.mws.callbacks[callbackKey] = undefined;
        }

        /**
         * ネイティブバインダのコールバックキーを生成（指定名に時間値を付加する）
         * @param 指定名
         */
        private createNativeBinderCallbackKey(name:string):string{
            return name + "_" + (new Date()).getTime().toString(10);
        }
    }

    /**
     * NativeBinderRequestParams
     */
    class NativeBinderRequestParams {
        private _value:string = "";
        private _isText:boolean = true;

        /**
         * コンストラクタ
         * @param value 値
         * @param isText 文字列か（trueとした場合、文字列としてコーテーションで囲んで返却する）
         */
        constructor(value:string, isText:boolean){
            this._value = value;
            this._isText = isText;
        }

        /**
         * パラメータ値取得
         * @return パラメータ値
         */
        public getValue():string{
            var value:string = this._value.replace("\"", "'");
            // return this._isText ? "\"" + this._value + "\"" : this._value;
            // 現状のネイティブバインダリクエストでは文字列をコーテーションで囲む想定は無し

            // URLエンコードを行う
            return encodeURIComponent(this._value);
        }
    }
}