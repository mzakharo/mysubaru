interface Window {
    harman_ota: any;
}
module HarmanOTA{
    /**
     * AhaConnectHTMLSDK
     */
    export class AhaConnectHTMLSDK {
        static COMPLETED_REQUEST_CALLBACK_KEY:string = "completedRequest";
        static REQUEST_TIMEOUT_INTERVAL:number = isDebug ? 1 : 15000;
        private static instance:AhaConnectHTMLSDK = null;
        private _isRegistNotifyCallback:boolean = false;
        private _notifyCallbacks:Array<any>;

        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        public static getInstance() : AhaConnectHTMLSDK {
            if(AhaConnectHTMLSDK.instance == null){
                AhaConnectHTMLSDK.instance = new AhaConnectHTMLSDK();
            }
            return AhaConnectHTMLSDK.instance;
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
            window.harman_ota = window.harman_ota === undefined ? new Object() : window.harman_ota;
            window.harman_ota.callbacks = window.harman_ota.callbacks === undefined ? [] : window.harman_ota.callbacks;
            this._notifyCallbacks = new Array();
        }

        /**
         * AhaConnect SDKの初期化処理（initializeWithParam）を実行する
         * @param param AhaConnect SDKの引数
         * @param respCallback レスポンスコールバック（初期化処理完了時に通知される)
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public initializeWithParam(param:any, respCallback:()=>void, reqCallback:(result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("initializeWithParam");
            var params:NativeBinderRequestParams[] = [new NativeBinderRequestParams(JSON.stringify(param), false)];
            this.requestNativeBinder("AHASDK:initializeWithParam", params, callbackKey, ()=>{
                respCallback();
                this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        }

        /**
         * AhaConnect SDKの非同期リクエスト（sendAsyncRequest）を実行する
         * @param param AhaConnect SDKの引数
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public sendAsyncRequest(param:any, respCallback:(responsePayload:any, responseContentType:string, errorCode:number)=>void, reqCallback:(result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("sendAsyncRequest_" + param.req);
            var params:NativeBinderRequestParams[] = [new NativeBinderRequestParams(JSON.stringify(param), false)];
            this.requestNativeBinder("AHASDK:sendAsyncRequest", params, callbackKey, (responsePayload: any, responseContentType: string, errorCode: number) => {
                respCallback(responsePayload, responseContentType, errorCode);
                this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        }

        /**
         * AhaConnect SDKの通知（notifyData）を受け取る為のコールバックを登録する
         * @param notifyCallback 通知コールバック
         * @param notifyCallbackThis 通知コールバック呼び出し時のthis指定（未指定時はデフォルト）
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public addNotifyData(notifyCallback:(notifyPayload:any, notifyContentType:string)=>void, notifyCallbackThis:any, reqCallback:(result:boolean)=>void){
            // notifyDataのコールバックを複数にする場合、呼び出しコールバックの管理は本SDKで吸収する。
            // ネイティブ側には常に1つのコールバックキーを登録するのみとする。（コールバックキーは固定文字）

            // ネイティブ側に既にコールバック登録済みの可能性を考慮し、本I/F呼び出し時はネイティブ側のコールバック登録を毎回解除する
            var callbackKey:string = "notifyData";
            this.requestNativeBinder("AHASDK:removeNotifyData", null, callbackKey, null, (result:boolean)=>{
                if(result){
                    // ネイティブ側にコールバック登録を行う
                    this.requestNativeBinder("AHASDK:addNotifyData", null, callbackKey, this.notifyCallback, reqCallback);
                }else{
                    reqCallback(false);
                }
            });

            // 本SDK管理のコールバックリストに追加する
            // 既に登録済みの場合は削除
            this.removeNotifyData(notifyCallback, null);
            // リストに追加
            this._notifyCallbacks.push({"callback":notifyCallback, "callbackthis":(notifyCallbackThis != null ? notifyCallbackThis:this)});
        }

        /**
         * AhaConnect SDKの通知（notifyData）を受け取る為のコールバックの登録を解除する
         * @param notifyCallback 登録解除対象のコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public removeNotifyData(notifyCallback:(notifyPayload:any, notifyContentType:string)=>void, reqCallback:(result:boolean)=>void){
            this._notifyCallbacks.some((value:any, index:number, array:any[])=>{
                if(value.callback === notifyCallback){
                    this._notifyCallbacks.splice(index, 1);
                    return true;
                }
                return false;
            });

            if(reqCallback != null){
                reqCallback(true);
            }
        }

        /**
         * AhaConnect SDKの通知（notifyData）を受け取り、本SDKへ登録されているコールバックを呼び出す処理
         * @param notifyPayload 通知データ
         * @param notifyContentType 通知データタイプ
         */
        private notifyCallback(notifyPayload:any, notifyContentType:string){
            // ネイティブ側から呼ばれる為、thisは自クラスのインスタンスを指さない。
            // その為、明示的にインスタンスを指定する必要がある。
            var instance:HarmanOTA.AhaConnectHTMLSDK = HarmanOTA.AhaConnectHTMLSDK.getInstance();
            for(var i:number=0; i<instance._notifyCallbacks.length; i++){
                if(instance._notifyCallbacks[i] != null){
                    instance._notifyCallbacks[i].callback.call(instance._notifyCallbacks[i].callbackthis, notifyPayload, notifyContentType);
                }
            }
        }

        /**
         * AhaConnect SDK向けに地図データダウンロードのキューを登録する
         * @param keys 地図データダウンロードキーのリスト（AhaConnect SDKのstartDownloadのパラメータに合わせる）
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public addDownloadQueue(keys:any[], reqCallback:(result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("addDownloadQueue");
            var params:NativeBinderRequestParams[] = [new NativeBinderRequestParams(JSON.stringify(keys), true)];
            this.requestNativeBinder("AHASDK:addDownloadQueue", params, callbackKey, null, reqCallback);
        }

        /**
         * AhaConnect SDK向けに登録されている地図データダウンロードのキュー情報を取得する
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public getDownloadQueue(respCallback:(keys:any[])=>void, reqCallback:(result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("getDownloadQueue");
            this.requestNativeBinder("AHASDK:getDownloadQueue", null, callbackKey, (keys:any[])=>{
                respCallback(keys);
                this.clearNativeBinderCallback(callbackKey);
            }, reqCallback);
        }

         /**
         * AhaConnect SDK向けに地図データダウンロードのキューを登録する
         * @param reqCallback リクエスト完了コールバック（ネイティブロジックがリクエスト受領したタイミングで通知される）
         */
        public applySettings(reqCallback:(result:boolean)=>void){
            var callbackKey:string = this.createNativeBinderCallbackKey("applySettings");
            this.requestNativeBinder("AHASDK:applySettings", null, callbackKey, null, reqCallback);
        }

        /**
         * ネイティブバインダのリクエスト
         * @param methodName メソッド名
         * @param params パラメータリスト
         * @param respCallbackKey レスポンスコールバックキー
         * @param respCallback レスポンスコールバック
         * @param reqCallback リクエスト完了コールバック
         */
        private requestNativeBinder(methodName:string, params:NativeBinderRequestParams[], respCallbackKey:string, respCallback:any, reqCallback:(result:boolean)=>void){
            // リクエストタイムアウト判定（ネイティブ側が未対応の場合を想定）
            var isTimeout:boolean = false;
            var _this:AhaConnectHTMLSDK = this;
            var timer:number = setTimeout(function() {
                isTimeout = true;
                reqCallback(false);
                _this.clearNativeBinderCallback(respCallbackKey);
            }, AhaConnectHTMLSDK.REQUEST_TIMEOUT_INTERVAL);

            // ネイティブバインダ処理受領通知コールバック
            window.harman_ota.callbacks[AhaConnectHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY] = (result:boolean)=>{
                clearTimeout(timer);
                if(!isTimeout){
                    reqCallback(true);
                }
            };

            // レスポンスコールバック
            window.harman_ota.callbacks[respCallbackKey] = respCallback;

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

            // デバッグフラグONの場合は強制的に成功にする
            if(isDebug){
                window.harman_ota.callbacks[AhaConnectHTMLSDK.COMPLETED_REQUEST_CALLBACK_KEY]();
            }else{
                window.document.location.href = reqUrl;
            }
        }

        /**
         * ネイティブバインダのコールバック登録をクリア
         * @param callbackKey クリア対象のコールバックキー
         */
        private clearNativeBinderCallback(callbackKey:string){
            window.harman_ota.callbacks[callbackKey] = undefined;
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