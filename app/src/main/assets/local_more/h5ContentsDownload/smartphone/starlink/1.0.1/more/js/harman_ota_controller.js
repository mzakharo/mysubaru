/// <reference path="jquery.d.ts" />
/// <reference path="config.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

(function () {
    var NativeEvent = function () {};
    /**
     * 外部公開
     */
    window.NativeEvent = NativeEvent;

    // const(ネイティブ側も使用するので変更は細心の注意を払うこと)
    NativeEvent.TRANSFER_MONITOR_TIMEOUT = "TRANSFER_MONITOR_TIMEOUT";

    // Const(Clear受信後の通知)
    NativeEvent.SHOW_POPUP_CLEAR_DATA = "SHOW_POPUP_CLEAR_DATA";

    // static
    NativeEvent.funcMap = {};
    NativeEvent.instance = null;

    NativeEvent.getInstance = function () {
        if (NativeEvent.instance == null) {
            NativeEvent.instance = new NativeEvent();
        }
        return NativeEvent.instance;
    }

    /**
     * ネイティブからのイベントを受け取ります。
     * ネイティブ側も使用するので、function名の変更は細心の注意を払うこと
     * NativeEvent.onEvent(NativeEvent.TRANSFER_MONITOR_TIMEOUT);
     * 
     * @param {*} event event string
     * @param {*} param json object
     */
    NativeEvent.onEvent = function(event, param) {
        var funcList = NativeEvent.funcMap[event];
        if (funcList == undefined) {
            return;
        }
        for(var i = 0; i < funcList.length; i++) {
            funcList[i](event, param);
        }
    };

    /**
     * ネイティブからのイベントハンドラを登録します
     * 

        var nativeEvent = NativeEvent.getInstance();
        nativeEvent.addEvent(NativeEvent.TRANSFER_MONITOR_TIMEOUT, function() {
            alert('native event test1.');
        });

     * @param {*} event Const
     * @param {*} funcBody functionを指定すること
     */
    NativeEvent.prototype.addEvent = function(event, funcBody) {
        if (NativeEvent.funcMap[event] == undefined) {
            NativeEvent.funcMap[event] = [];
        }
        NativeEvent.funcMap[event].push(funcBody);
    };
}).call(this);

/**
 * Harman OTA モジュール
 * （本モジュールの動作にはjQueryと「config.js」が必要です。）
 */
var HarmanOTA;
(function (HarmanOTA) {
    var Controller = (function () {
        /**
         * コンストラクタ
         */
        function Controller() {
            this.initialize();
        }
        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        Controller.getInstance = function () {
            if (Controller.instance == null) {
                Controller.instance = new Controller();
            }
            return Controller.instance;
        };

        Controller.prototype.addPage = function (pageID, factory) {
            this.pageMap = this.pageMap || [];
            this.pageMap[pageID] = factory;
            if (this.currentPageManager != null) {
                // 初期化済
                return;
            }
            if (this.language == null) {
                // まだ準備が整っていない
                return;
            }
            this.initPage(this.language);
        };

        /**
         * 初期化処理
         */
        Controller.prototype.initialize = function () {
            this.currentPageManager = null;
            this.language = null;
        };

        /**
         * 画面初期化
         * @param language 言語コード
         */
        Controller.prototype.initPage = function (language) {
            if (this.currentPageManager != null) {
                // 初期化済
                return;
            }
            this.language = language;
            var $page = $("div:jqmData(role=page)");
            var pageID = $page.attr("id");
            var pageManager = null;
            switch (pageID) {
                case Controller.SETTING_PAGE_ID:
                    // 設定画面
                    pageManager = new SettingPageManager();
                    break;
                case Controller.UPDATE_PAGE_ID:
                    // 更新データ一覧画面
                    pageManager = new UpdatePageManager();
                    break;
                case Controller.LICENSE_PAGE_ID:
                    // 利用許諾
                    pageManager = new LicensePageManager();
                    break;
                default:
                    if (this.pageMap == undefined ||
                        !this.pageMap.hasOwnProperty(pageID)) {
                        break;
                    }
                    var factory = this.pageMap[pageID];
                    if (factory != undefined) {
                        pageManager = factory();
                    }
                    break;
            }
            if (pageManager != null) {
                this.currentPageManager = pageManager;
                // 画面初期設定
                pageManager.ahaConnectSDKSettings.readSettings(function() {
                    pageManager.initPage(language);
                });
            }
        };
        Controller.instance = null;
        Controller.SETTING_PAGE_ID = "huupd_settings";
        Controller.UPDATE_PAGE_ID = "huupd_list";
        Controller.LICENSE_PAGE_ID = "license";
        return Controller;
    })();
    HarmanOTA.Controller = Controller;

    /**
     * ページ管理基底クラス
     */
    var PageManager = (function () {
        /**
         * コンストラクタ
         */
        function PageManager() {
            var _this = this;

            this.initialize();
            this.accessoryConnected = false;
            this.accessoryCount = 0;

            UIEMicroserver.getInstance().getStatus(function (state) {
                var connected = UIEMicroserver.CONNECTED == state;
                // UIを更新するため、フラグを逆設定する
                HarmanOTA.UI.setCallbacks({
                    'accessoryConnected' : function() {
                        return _this.accessoryConnected;
                    },
                    'downloading' : function() {
                        return _this.downloadingKeys.length > 0;
                    },
                    'transferring' : function() {
                        return _this.transferringKeys.length > 0 && _this.accessoryConnected;
                    },
                });
                _this.setAccessoryConnected(connected);
            });
        }
        /**
         * 初期化処理
         */
        PageManager.prototype.initialize = function () {
            var _this = this;
            this.ahaConnectSDKSettings = new HarmanOTA.AhaConnectSDKSettings();
            this.ahaConnectSDKController = new HarmanOTA.AhaConnectSDKController();
            this.word = new Word();
            this.baseTexts = null;
            this.isEnabledRtl = false;

            this.dialogType = {
                "none": "dialogNone",
                "ok": "dialogOk",
                "cancel": "dialogCancel",
                "okcancel": "dialogOkcancel",
                "downloadEnd": "dialogDownloadEnd",
                "deleteDownloadedMap": "dialogDeleteDownloadedMap"
            }

            var microserver = UIEMicroserver.getInstance();
            microserver.onEvent(function (event, state) {
                if (event == UIEMicroserver.EV_TETHER_STATE) {
                    _this.setAccessoryConnected(UIEMicroserver.CONNECTED == state);
                    _this.accessoryCount = 0;
                    if (_this.accessoryConnected) {
                        _this.didAccessoryConnect();
                    } else {
                        _this.didAccessoryDisconnect();
                    }
                }
            });

            var nativeEvent = NativeEvent.getInstance();
            nativeEvent.addEvent(NativeEvent.TRANSFER_MONITOR_TIMEOUT, function(event, param) {
                _this.onNativeEvent(event, param);
            });    
            nativeEvent.addEvent(NativeEvent.SHOW_POPUP_CLEAR_DATA, function(event, param) {
                _this.onNativeEvent(event, param);
            });
        };

        PageManager.prototype.isMapDataPage = function () {
            return this.downloadingKeys != undefined;
        }
        
        PageManager.prototype.setAccessoryConnected = function (connected) {
            var old = this.accessoryConnected;
            this.accessoryConnected = connected;
            this.accessoryCount = 0;
            if (this.isMapDataPage() && (old != connected)) {
                this.reloadListIcon();
            }
        }

        PageManager.prototype.didAccessoryConnect = function () {
            console.log('didAccessoryConnect');
            if (this.isMapDataPage()) {
                //削除ダイアログをclose
                this.closeDeleteDownloadedMapDialog();
                this.refreshPageState();
            }
        };

        PageManager.prototype.didAccessoryDisconnect = function () {
            console.log('didAccessoryDisconnect');
//            if (this.isMapDataPage()) {
//                this.refreshPageState();
                this.clearTransferStatus();
//            }
        };

        PageManager.prototype.onNativeEvent = function (event, param) {
            console.log('onNativeEvent : ' + JSON.stringify(param));
            switch (event) {
                case NativeEvent.TRANSFER_MONITOR_TIMEOUT:
                    if (this.isMapDataPage()) {
                        this.clearTransferStatus();
                    }
                    break;
                case NativeEvent.SHOW_POPUP_CLEAR_DATA:
                    // アラート出力
                    HarmanOTA.UI.Alert.alert(this.baseTexts.cleardata);
                    // ルートページ（config画面）へ遷移
                    this.backToRootPage();
                    break;
                default:
                    break;
            }
        };

        /**
         * 画面初期化
         * @param language 言語コード
         */
        PageManager.prototype.initPage = function (language) {
            this.isEnabledRtl = this.judgeEnabledRtl(language);
            this.baseTexts = this.getBasePageText(language);
            this.setBasePageItem();
            // デバッグフラグONの場合
            if (HarmanOTA.useStubSDK) {
                try {
                    MapDownloadSimulator.getInstance().setPageManager(this);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        /**
         * 画面項目設定
         */
        PageManager.prototype.setBasePageItem = function () {
            var $backButton = $("#Car_TXT_0056_3");
            $backButton.text(this.baseTexts.back);
            this.enabledRtl($backButton, this.isEnabledRtl, false);
        };
        /**
         * 文言取得
         * @param language 言語コード
         */
        PageManager.prototype.getBasePageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var texts = {
                "nodata": this.word["SL_TXT_0208_" + language],
                "expired": this.word["SL_TXT_0209_" + language],
                "genericerror": this.word["TXT_YELP_0029_" + language],
                "back": this.word["CONFIG_001_" + language],
                "cleardata": this.word["HTML_TXT_0184_" + language]
            };
            return texts;
        };

        PageManager.prototype.buildText = function (textsList) {
            var texts = {};
            for(var i = 0; i < textsList.length; i++) {
                var map = textsList[i];
                eval(this.word.createWordingToEval("texts." + map.key, "this.word", map.id, map.language));
            }
            return texts;
        }

        /**
         * RTLが有効な言語かを判断する
         * @param language 言語コード
         */
        PageManager.prototype.judgeEnabledRtl = function (language) {
            return HarmanOTA.Common.judgeEnabledRtl(language);
        };
        /**
         * RTLの有効/無効を設定する
         * @param $target 対象DOM要素（JQueryオブジェクト）
         * @param enabled 有効/無効
         */
        PageManager.prototype.enabledRtl = function ($target, enabled, alignRight) {
            HarmanOTA.Common.enabledRtl($target, enabled, alignRight);
        };
        /**
         * ルートページ（config画面）へ遷移
         * （コンテンツ側で予期せぬエラーが発生した場合に使用）
         */
        PageManager.prototype.backToRootPage = function () {
            HarmanOTA.Common.transitionPage(PageManager.RootPagePath+(JSON.parse(getMemoryAppInfo())).country);
        };
        /**
         * 予期せぬエラー発生時処理
         */
        PageManager.prototype.unexpectedError = function () {
            debugger;
            // ルートページ（config画面）へ遷移
            this.backToRootPage();
        };
        /**
         * 有効期限切れ時の処理
         */
        PageManager.prototype.expiredSubscription = function (back_flag) {
            debugger;
            // UI.Alert.alert(this.baseTexts.expired);
            if (HarmanOTA.UI.Alert.confirmAlert(this.baseTexts.expired)) {
                // 外部ブラウザで説明ページへ遷移
                // TODO:遷移先URLが未定
//                HarmanOTA.CommonHTMLSDK.getInstance().openlink_exbrowser("https://www.subaru-maps.com");
                setTimeout (function () {
                       location.href = "https://www.subaru-maps.com?openlink_exbrowser=true";
                       console.log("------ expired OK button push! end ------");
                },1);
            }
            var inst = this;
            // Moreタブトップに戻る場合
            if (back_flag == true) {
                var inst = this;
                setTimeout(function () {
                    // ルートページへ戻る
                    inst.backToRootPage();
                    inst = null;
                }, 1000);
            }
        };
        /**
         * 地図データが存在しない時の処理
         */
        PageManager.prototype.noMapData = function () {
            debugger;
            HarmanOTA.UI.Alert.alert(this.baseTexts.nodata);
            // if (UI.Alert.confirmAlert(this.baseTexts.nodata)) {
            //     // 外部ブラウザで説明ページへ遷移
            //     // TODO:遷移先URLが未定
            //     CommonHTMLSDK.getInstance().openlink_exbrowser("");
            // }
            var inst = this;
            setTimeout(function () {
                // ルートページへ戻る
                inst.backToRootPage();
                inst = null;
            }, 1);
        };
        /**
         * 汎用エラー
         * @param backToRootPage アラート出力後にルートページへ遷移するか
         */
        PageManager.prototype.genericError = function (backToRootPage) {
            debugger;
            // アラート出力
            HarmanOTA.UI.Alert.alert(this.baseTexts.genericerror);
            if (backToRootPage) {
                // ルートページへ戻る
                this.backToRootPage();
            }
        };

        PageManager.prototype.isChangeVehicle = function (notifyPayload, notifyContentType) {
            switch (notifyPayload.notify) {
                case HarmanOTA.AhaConnectSDK_Notify_accessoryInformation:
                    var info = notifyPayload.info;
                    if (this.ahaConnectSDKSettings.deviceCode != info.deviceCode ||
                        this.ahaConnectSDKSettings.productCode != info.productCode) {
                        return true;
                    }
                    break;
                default:
                    break;
            }
            return false;
        }

        PageManager.prototype.changeVehicle = function (callback) {
            var _this = this;
            if (callback == undefined || callback == null) {
                callback = function() {};
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().clearDownloadQueue(function (result) {
                callback();
            });
        }
        
        //-----------------------------------------------
        //--- 以下、地図データ関連の処理共通化
        //-----------------------------------------------
        PageManager.prototype.handleNotifyData = function (notifyPayload, notifyContentType) {
            var _this = this;
            if (this.isChangeVehicle(notifyPayload, notifyContentType)) {
                // 異なる車載が接続された
                this.changeVehicle(function () {
                    debugger;
                    // ルートページ（config画面）へ遷移
                    _this.backToRootPage();
                });
            }
        }
        
        PageManager.prototype.handleResponse = function (responsePayload, notifyContentType) {
            console.log(JSON.stringify(responsePayload));
            if (responsePayload.resp != "startDownload") {
                return;
            }

            // debug
            // responsePayload.data[0].status = HarmanOTA.AhaConnectSDK_DownloadStatus.Download;

            var errorCode = responsePayload.errorCode; // IF ver 1.1.5以下
            if (errorCode == undefined) {
                // IF ver 1.1.6以上
                errorCode = responsePayload.data[0].errorCode;
            }

            // errorCodeが0以外の場合はポップアップを閉じる
            if (errorCode != HarmanOTA.AhaConnectSDK_ErrorCode_Success){
                this.closeDownloadingDialog();
            }

            if (errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_NetworkFailure) {
                // 画面状態の更新
                this.downloadingKeys.length = 0;
                this.refreshPageState();
                for (var key in this.updateDatas) {
                     var datas = this.updateDatas[key];
                     for (var i = 0; i < datas.length; i++) {
                         if( key == 1 ) {
                            var $row = this.getUpdateDataRow(datas[i].key);
                            HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : datas[i].key.regionID });
                         } else if ( key == 2 ) {
                            return;
                         }
                     }
                }
            }
            else if (errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired) {
                // 画面状態の更新
                this.downloadingKeys.length = 0;
                this.closeDownloadingDialog();
                this.refreshPageState();
                for (var key in this.updateDatas) {
                     var datas = this.updateDatas[key];
                     for (var i = 0; i < datas.length; i++) {
                         if( key == 1 ) {
                            var $row = this.getUpdateDataRow(datas[i].key);
                            HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : datas[i].key.regionID });
                         }
                     }
                }
            } else {
                if (responsePayload.respCode == HarmanOTA.AhaConnectSDK_ErrorCode_Success) {
                    var data = responsePayload.data[0];
                    if (data.status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                        console.log('startDownload : region is completed.');
                        responsePayload.notify = HarmanOTA.AhaConnectSDK_Notify_downloadStatus;
                        this.handleNotifyData(responsePayload, notifyContentType);
                    } else if ((data.status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated) ||
                               (data.status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress)) {
                        // 画面状態の更新
                        for (var key in this.updateDatas) {
                             var datas = this.updateDatas[key];
                             for (var i = 0; i < datas.length; i++) {
                                var $row = this.getUpdateDataRow(datas[i].key);
                                var iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                                if( key == 1 ) {
                                    if ( datas[i].key.regionID == data.regionID ) {
                                        iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD;
                                    } else {
                                        iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.DOWNLOADING;
                                    }
                                 } else if ( key == 2 ) {
                                    iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DELETE;
                                 } else if( key == 3 ) {
                                    iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE;
                                 }
                                var itemInfo = HarmanOTA.UI.UpdateList.getItemInfo($row);
                                if ( !itemInfo.showprogress ) {
                                     HarmanOTA.UI.UpdateList.setItemInfo($row, { "iconRight": iconRight, "progress": 0, "showprogress": false, "regionID" : datas[i].key.regionID });
                                }
                             }
                        }
                    } else {
                        // 画面状態の更新
                        this.downloadingKeys.length = 0;
                        this.refreshPageState();
                        for (var key in this.updateDatas) {
                             var datas = this.updateDatas[key];
                             for (var i = 0; i < datas.length; i++) {
                                 if( key == 1 ) {
                                    var $row = this.getUpdateDataRow(datas[i].key);
                                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : datas[i].key.regionID });
                                 } else if ( key == 2 ) {
                                    return;
                                 }
                             }
                        }
                    }
                } else {
                    // 画面をリロードする
                    this.reloadListPage();
                }
            }
        };

        PageManager.prototype.clearTransferStatus = function () {
            // 少々無理やりな作りとなっているが、共通化する。
            // 派生クラスが地図転送のプログレスを管理するクラスであれば
            // 転送状態を初期化する。
            if (this.transferringKeys == undefined ||
                this.updateCategoryChangedAccessoryTransferStatus == undefined ||
                this.refreshPageState == undefined)
            {
                // 処理対象外の画面
                console.log('clearTransferStatus : not target.');
                return;
            }
            console.log('clearTransferStatus : exec.');
            console.log('clearTransferStatus transferringKeys.length : '+this.transferringKeys.length);
            for (var i = 0; i < this.transferringKeys.length; i++) {
                var status = this.transferringKeys[i].status;
                if (status != HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                    status = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid;
                }
                this.updateCategoryChangedAccessoryTransferStatus(this.transferringKeys[i], status);
            }
            this.transferringKeys = [];
            // 画面状態の更新
            for (var key in this.updateDatas) {
                 var datas = this.updateDatas[key];
                 for (var i = 0; i < datas.length; i++) {
                    var $row = this.getUpdateDataRow(datas[i].key);
                    var iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                    if ( key == 2 ) {
                        iconRight = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DELETE;
                        HarmanOTA.UI.UpdateList.setItemInfo($row, { "iconRight": iconRight, "progress": 0, "showprogress": false, "regionID" : datas[i].key.regionID });
                     }
                 }
            }

            this.refreshPageState();
        }

        PageManager.prototype.reloadListIcon = function () {
            for (var key in this.updateDatas) {

                // DL済リストは、BT接続/切断でアイコン表示を切り替える
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    var $row = this.getUpdateDataRow(datas[i].key);
                    if ($row != null) {
                        HarmanOTA.UI.UpdateList.setItemInfo($row, { 'reload' : true });
                    }        
                }
            }
        }

        PageManager.prototype.gettransferMapDataProgress = function (progress, callback) {
            var _this = this;
            if (callback == undefined || callback == null) {
                callback = function () {};
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().gettransferMapDataProgress(progress, function (result) {
                callback();
            });
        };

        PageManager.prototype.getdownloadMapDataProgress = function (progress, callback) {
            var _this = this;
            if (callback == undefined || callback == null) {
                callback = function () {};
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().getdownloadMapDataProgress(progress, function (result) {
                callback();
            });
        };

        /**
         * ダウンロード中データキーリストに指定キーを追加する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        PageManager.prototype.addDownloadingKeys = function (key) {
            for (var i = 0; i < this.downloadingKeys.length; i++) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, this.downloadingKeys[i])) {
                    return;
                }
            }
            this.downloadingKeys.push(JSON.parse(JSON.stringify(key)));
        };

        /**
         * ダウンロード中データキーリストから指定キーを削除する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        PageManager.prototype.removeDownloadingKeys = function (key) {
            var _this = this;
            this.downloadingKeys.some(function (value, index, array) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, value)) {
                    _this.downloadingKeys.splice(index, 1);
                    return true;
                }
                return false;
            });
        };

        /**
         * 指定キーに該当するダウンロード中キーリストを更新する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        PageManager.prototype.updateDownloadingKeys = function (key, status) {
            this.setDownloadStaus(key, status);
            switch (status) {
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated:
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress:
                    // リストに追加
                    this.addDownloadingKeys(key);
                    break;
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted:
                    // 転送リストに追加
                    if (this.accessoryConnected) {
                        //キー配列管理に必要な項目のみ保持するように整形
                        var transferKey = HarmanOTA.AnalyseAhaConnectSDKResponse.formatRegionDataKey(JSON.parse(JSON.stringify(key)));
                        this.updateTransferringKeys(transferKey, HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid);
                    }
                    // DLリストから削除
                    this.removeDownloadingKeys(key);
                    break;

                default:
                    // リストから削除
                    this.removeDownloadingKeys(key);
                    break;
            }
        };

        /**
          * ダウンロード状態を設定する
          * @param key データキー
          * @param status ダウンロード状態
         */
        PageManager.prototype.setDownloadStaus = function (key, status) {
            for (var i = 0; i < this.downloadingKeys.length; i++) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(this.downloadingKeys[i], key)) {
                    this.downloadingKeys[i].status = status;
                    break;
                }
            }
        };

        /**
         * ダウンロードデータを取得する
         * @param {*} key データキー
         */
        PageManager.prototype.getDownloadingKeys = function (key) {
            for (var i = 0; i < this.downloadingKeys.length; i++) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(this.downloadingKeys[i], key)) {
                    return this.downloadingKeys[i];
                }
            }
            return null;
        };

        PageManager.prototype.readDownloadingKeys = function () {
            for (var key in this.updateDatas) {
                if (key != HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD) {
                    continue;
                }
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    // 未DLデータを読み出す
                    this.updateDownloadingKeys(datas[i].key, HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress);
                }
            }
        }

        PageManager.prototype.getValidatedDownloadStatus = function (notifyPayload) {
            var notifyData = notifyPayload.data[0];
            // progressキーを持つ場合かつstatus=DonwloadCompletedの場合はダウンロード中とみなす
//            if (notifyData.progress != undefined && notifyData.status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
//                return HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress;
//            }
            return notifyData.status;
        }

        /**
         * 地図系画面を共通化するために強引にメソッド定義
         */
        PageManager.prototype.readTransferringKeys = function () {
            for (var key in this.updateDatas) {
                if (key != HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE) {
                    continue;
                }
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    // 未機転送データを転送対象とする
                    this.updateTransferringKeys(datas[i].key, HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated);
                }
            }
        }

        /**
         * 車載機転送中データキーリストに指定キーを追加する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        PageManager.prototype.addTransferringKeys = function (key) {
            for (var i = 0; i < this.transferringKeys.length; i++) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, this.transferringKeys[i])) {
                    return;
                }
            }
            this.transferringKeys.push(JSON.parse(JSON.stringify(key)));
        };

        /**
         * 車載機転送中データキーリストから指定キーを削除する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        PageManager.prototype.removeTransferringKeys = function (key) {
            var _this = this;
            this.transferringKeys.some(function (value, index, array) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, value)) {
                    _this.transferringKeys.splice(index, 1);
                    return true;
                }
                return false;
            });
        };

        /**
         * 指定キーに該当する車載機転送中キーリストを更新する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status 車載機転送ステータス
         */
        PageManager.prototype.updateTransferringKeys = function (key, status) {
            switch (status) {
                case HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated:
                case HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress:
                    // リストに追加
                    this.addTransferringKeys(key);
                    // statusの値で更新
                    this.setTransferStaus(key, status);

                    break;
                default:
                    // リストから削除
                    this.removeTransferringKeys(key);
                    break;
            }
        };

        /**
          * 車載機転送状態を設定する
          * @param key データキー
          * @param status 車載機転送状態
         */
        PageManager.prototype.setTransferStaus = function (key, status) {
            for (var i = 0; i < this.transferringKeys.length; i++) {
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(this.transferringKeys[i], key)) {
                    this.transferringKeys[i].status = status;
                    break;
                }
            }
        };

        PageManager.prototype.setUpdateDatasProperty = function (regionID, category, property, value) {
            for (var key in this.updateDatas) {
                if (category != undefined && +key != category) {
                    continue;
                }
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].key.regionID == regionID) {
                        this.updateDatas[key][i][property] = value;
                        return;
                    }
                }
            }
        };

        /**
          * regionIDに紐づくUpdateDatasの取得
          * @param RegionID　リージョンID
          * 
          */
         PageManager.prototype.getUpdateDatas = function (regionID, category) {
            for (var key in this.updateDatas) {
                if (category != undefined && +key != category) {
                    continue;
                }
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].key.regionID == regionID) {
                        return datas[i];
                    }
                }
            }
            return null;
        };

        PageManager.prototype.getAllUpdateDatasProperty = function (propertyList, category) {
            var result = [];
            for (var key in this.updateDatas) {
                if (category != undefined && +key != category) {
                    continue;
                }
                var datas = this.updateDatas[key];
                for (var dataIndex = 0; dataIndex < datas.length; dataIndex++) {
                    var target = {};
                    for (var propIndex = 0; propIndex < propertyList.length; propIndex++) {
                        var prop = propertyList[propIndex];
                        target[prop] = datas[dataIndex][prop];
                        if (target[prop] == undefined) {
                            target[prop] = datas[dataIndex].key[prop];
                        }
                    }
                    result.push(target);
                }
            }
            return result;
        };

        PageManager.prototype.getUpdateDatasCategory = function (regionID) {
            for (var key in this.updateDatas) {
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].key.regionID == regionID) {
                        return +key;
                    }
                }
            }
            return undefined;
        };
        
        PageManager.prototype.updateCategory = function (key, downloadStatus, transferStatus) {
            var categoryInfo = null;

            if (transferStatus != null) {
                categoryInfo = this.getCategoryInfoFromTransferStatus(transferStatus);

            } else if (downloadStatus != null) {
                categoryInfo = this.getCategoryInfoFromDownloadStatus(downloadStatus);
            }

            if (categoryInfo != null) {
                var targetCategory = categoryInfo.targetCategory;
                var targetData = HarmanOTA.AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);
                if (targetData != null) {
                    HarmanOTA.AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                    HarmanOTA.AnalyseAhaConnectSDKResponse.addUpdateListData(this.updateDatas, targetData, targetCategory);
                }
            }
        }

        /**
         * 地図系画面を共通化するために強引にメソッド定義
         * @param {*} status ダウンロードのステータス
         */
        PageManager.prototype.getCategoryInfoFromDownloadStatus = function (status) {
            var categoryID;
            var iconType;
            var targetCategory;
            if (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                // 属するカテゴリを「車載機未更新」に変更
                targetCategory = HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE;
                categoryID = this.CategoryIds[targetCategory];
                iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
            }
            else {
                // 属するカテゴリを「ダウンロード未完了」に変更
                targetCategory = HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                categoryID = this.CategoryIds[targetCategory];
                iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
            }

            return {
                'categoryID': categoryID,
                'iconType': iconType,
                'targetCategory': targetCategory
            };
        }

        /**
         * 地図系画面を共通化するために強引にメソッド定義
         * @param {*} status ダウンロードのステータス
         */
        PageManager.prototype.getCategoryInfoFromTransferStatus = function (status) {
            var categoryID;
            var iconType;
            var targetCategory;
            if (status == HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                // 属するカテゴリを「車載機更新済・最新状態」に変更
                targetCategory = HarmanOTA.MAP_DATA_CATEGORY.UPDATED;
                categoryID = this.CategoryIds[targetCategory];
                iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATED;
            }
            else {
                // 属するカテゴリを「車載機未更新」に変更
                targetCategory = HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE;
                categoryID = this.CategoryIds[targetCategory];
                iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
            }

            return {
                'categoryID': categoryID,
                'iconType': iconType,
                'targetCategory': targetCategory
            };
        }
        
        /**
         * 手動ダウンロード
         * @param callback コールバック（引数で成否を返却）
         */
        PageManager.prototype.downloadOneData = function (targetData,callback) {
            var _this = this;

            //this.downloadingKeys.length = 0;
            var key = JSON.parse(JSON.stringify(targetData.key));
            key.fromVersion = targetData.fromVersion;
            key.toVersion = targetData.toVersion;
            key.status = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress;
            // フェールセーフ
            if (key.toVersion != undefined &&
                key.fromVersion != undefined &&
                key.fromVersion < key.toVersion)
            {
                this.updateDownloadingKeys(key, key.status);
            } else {
                console.log('addDownloadQueue error : ' + JSON.stringify(key));
            }

            // AhaConnect SDKへダウンロードキューを登録する
            HarmanOTA.AhaConnectHTMLSDK.getInstance().addDownloadQueue(this.downloadingKeys, function (result) {
                if (callback != null) {
                    callback(result);
                }
            });

            // デバッグフラグONの場合
            if (HarmanOTA.useStubVehicleInfo) {
                alert("シナリオ開始");
                if(regionIDList){
                    regionIDList.push(key.regionID);
                }
                MapDownloadSimulator.getInstance().setPageManager(this);
                HarmanOTA.MapDownloadSenarioManager.getInstance().start();
            }
        };

        /**
         * 手動ダウンロード
         * @param callback コールバック（引数で成否を返却）
         */
        PageManager.prototype.downloadAllData = function (callback) {
            
            // // 一覧データ表示更新
            // this.loadData().then(() => {
            // ダウンロード対象データ
            this.downloadingKeys.length = 0;
            var targetStates = [HarmanOTA.MAP_DATA_CATEGORY.INDEFINITE, HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD];
            for (var index = 0; index < targetStates.length; index++) {
                var state = targetStates[index];
                var targetDatas = this.updateDatas[state];
                if (targetDatas == undefined) {
                    continue;
                }
                // ダウンロードキー情報を作成
                for (var i = 0; i < targetDatas.length; i++) {
                    var targetData = targetDatas[i];
                    var key = JSON.parse(JSON.stringify(targetData.key));
                    key.fromVersion = targetData.fromVersion;
                    key.toVersion = targetData.toVersion;
                    key.status = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress;
                    // フェールセーフ
                    if (key.toVersion != undefined &&
                        key.fromVersion != undefined &&
                        key.fromVersion < key.toVersion)
                    {
                        this.updateDownloadingKeys(key, key.status);
                    } else {
                        console.log('addDownloadQueue error : ' + JSON.stringify(key));
                    }
                }
            }

            // AhaConnect SDKへダウンロードキューを登録する
            HarmanOTA.AhaConnectHTMLSDK.getInstance().addDownloadQueue(this.downloadingKeys, function (result) {
                if (callback != null) {
                    callback(result);
                }
            });
            // }, () => {
            //     // 汎用エラー
            //     this.genericError(false);
            //     if (callback != null) {
            //         callback(false);
            //     }
            // });

            // デバッグフラグONの場合
            if (HarmanOTA.useStubVehicleInfo) {
                alert("シナリオ開始");
                MapDownloadSimulator.getInstance().setPageManager(this);
                HarmanOTA.MapDownloadSenarioManager.getInstance().start();
            }
        };
        
        /**
          * ダウンロードキャンセル初期化
          * @param callback コールバック（引数で成否を返却）
          */
         PageManager.prototype.initCancelDownload = function (callback) {
            var _this = this;
            if (callback == undefined || callback == null) {
                callback = function () {};
            }
            _this.cancelDownloadCount = 0;
            _this.cancelDownloadDatas = [];
            _this.cancelDownloadResult = false;
            console.log('initCancelDownload start');
            HarmanOTA.AhaConnectHTMLSDK.getInstance().getDownloadQueue(function (keys) {

                console.log('initCancelDownload get native key : ' + JSON.stringify(keys));
                console.log('initCancelDownload downloadingKeys : ' + JSON.stringify(_this.downloadingKeys));

                // オートDLの場合、ネイティブにqueueは登録されていないため、コンテンツ管理の情報も考慮する
                _this.cancelDownloadDatas = _this.cancelDownloadDatas.concat(keys);
                if (_this.downloadingKeys != undefined && _this.downloadingKeys.length > 0) {
                    var tmpKeys = JSON.parse(JSON.stringify(_this.downloadingKeys));
                    var ldLen = tmpKeys.length;
                    for (var keysIndex = 0; keysIndex < _this.cancelDownloadDatas.length; keysIndex++) {
                        for (var dlingIndex = 0; dlingIndex < ldLen; dlingIndex++) {
                            if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(tmpKeys[dlingIndex], _this.cancelDownloadDatas[keysIndex])) {
                                tmpKeys.splice(dlingIndex, 1);
                                dlingIndex--;
                                ldLen--;
                            }
                        }
                    }
                    _this.cancelDownloadDatas = _this.cancelDownloadDatas.concat(tmpKeys);
                }
                console.log('initCancelDownload cancelDownloadDatas : ' + JSON.stringify(_this.cancelDownloadDatas));
                data = _this.downloadingKeys;
                if ( data == undefined ) {
                    HarmanOTA.AhaConnectHTMLSDK.getInstance().clearDownloadQueue(function (result) {
                        callback();
                    });
                } else if (data != undefined)  {
                    for (var i=0; i < data.length; i++ ) {
                        if ((data[i].status == 1) || (data[i].status == 2)) {
                            HarmanOTA.AhaConnectHTMLSDK.getInstance().clearDownloadQueue(function (result) {
                                callback();
                            });
                        }
                    }
                }
            });
        };

        /**
         * ダウンロードキャンセル
         * @param callback コールバック（引数で成否を返却）
         */
        PageManager.prototype.cancelDownload = function (callback) {
            var _this = this;
            var targetDatas = JSON.parse(JSON.stringify(this.cancelDownloadDatas));

            if (_this.cancelDownloadCount < targetDatas.length) {
                var targetData = targetDatas[_this.cancelDownloadCount];

                if (_this.isMapDataPage()) {
                    
                    var notifyPayload = {
                        "data" : [JSON.parse(JSON.stringify(targetData))]
                    };
                    notifyPayload.notify = HarmanOTA.AhaConnectSDK_Notify_downloadStatus;
                    notifyPayload.data[0].status = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled;
                    _this.setDownloadingAction(notifyPayload);
                        
                }

                var deviceCode = targetData.deviceCode;
                var productCode = targetData.productCode;
                var productID = targetData.productID;
                if ( productID == undefined ) {
                    productID = targetData.id;
                }
                var supplierID = targetData.supplierID;
                var baselineID = targetData.baselineID;
                var regionID = targetData.regionID;
                var fromVersion = targetData.fromVersion;
                var toVersion = targetData.toVersion;
                var targetData_req = { "deviceCode": deviceCode, "productCode": productCode, "productID": productID, "supplierID": supplierID, "baselineID": baselineID, "regionID": regionID, "fromVersion": fromVersion, "toVersion": toVersion};


                _this.ahaConnectSDKController.cancelDownload(targetData_req, function (data, result) {
                    //成功の場合フラグを上書き
                    if (result) {
                        _this.cancelDownloadResult = result;
                    }

                    try {
                        console.log("canceldownload data:");
                        if (data == undefined) {

                        } else if (data.data[0].errorCode == 3) {
                            console.log('cancelDownloadD status : 3');
                            var deviceCode = data.data[0].deviceCode;
                            var productCode = data.data[0].productCode;
                            var productID = data.data[0].productID;
                            var supplierID = data.data[0].supplierID;
                            var baselineID = data.data[0].baselineID;
                            var regionID = data.data[0].regionID;
                            var fromVersion = data.data[0].fromVersion;
                            var toVersion = data.data[0].toVersion;

                            var targetData = { notify: "downloadStatus", data :[{"deviceCode": deviceCode, status: 3,"productCode": productCode, "productID": productID, "supplierID": supplierID, "baselineID": baselineID, "regionID": regionID, "fromVersion": fromVersion, "toVersion": toVersion}] };

                            _this.setDownloadingAction(targetData);
                             // checkForUpdateを実行
                             _this.checkForUpdate(function (result) {
                             });
                        }
                    } catch (error) {
                        if (data[0].errorCode == 3){
                            console.log('cancelDownloadD status : 3');
                            var deviceCode = data[0].deviceCode;
                            var productCode = data[0].productCode;
                            var productID = data[0].productID;
                            var supplierID = data[0].supplierID;
                            var baselineID = data[0].baselineID;
                            var regionID = data[0].regionID;
                            var fromVersion = data[0].fromVersion;
                            var toVersion = data[0].toVersion;

                            var targetData = { notify: "downloadStatus", data :[{"deviceCode": deviceCode, status: 3,"productCode": productCode, "productID": productID, "supplierID": supplierID, "baselineID": baselineID, "regionID": regionID, "fromVersion": fromVersion, "toVersion": toVersion}] };

                            _this.setDownloadingAction(targetData);
                        }
                    }

                    // キャンセルの成功、失敗によらず、次のキャンセルを続ける
                    _this.cancelDownloadCount++;
                    _this.cancelDownload(callback);
                });
            } else {
                // キャンセル終了
                if (callback != null) {
                    callback(_this.cancelDownloadResult);
                }
            }
        };

        PageManager.prototype.getDeleteDownloadedMapDataDelegate = function ($row, targetData, customData) {
            return {
                'deny' : function() {},
                'success' : function() {},
                'error' : function() {},
            };
        };

        /**
         * 地図データを削除する
         * @param {*} targetData 
         * @param {*} $row 行
         * @param {*} customData 
         */
        PageManager.prototype.deleteDownloadedMapData = function ($row, targetData, customData) {
            var _this = this;

            var delegate = this.getDeleteDownloadedMapDataDelegate($row, targetData, customData);
            _this.createModalDialogOkCancelButton(_this.texts.deleteDownloadedMap, function () {
                // OKボタン押下
                //ローディング
                _this.setLoading(true);
                //削除処理実行
                _this.ahaConnectSDKController.deleteRegionFiles(targetData, function (respData, result) {
                    //ローディング解除
                    _this.setLoading(false);
                    var texts = _this.texts.succeededMapDelete;
                    var func = delegate.success;
                    if (!result) {
                        texts = _this.texts.failedMapDelete;
                        func = delegate.error;
                    }

                    func();
                    // 該当データが0件のカテゴリは非表示にする
                    var totalSizes_regions = 0;
                    var totalSizes_download = 0;
                    for (var key in _this.updateDatas) {
                        var datas = _this.updateDatas[key];
                        for (var i = 0; i < datas.length; i++) {
                            if( key == 1 ) {
                                totalSizes_regions += datas[i].size;
                            } else if ( key == 2 ) {
                                totalSizes_download += datas[i].size;
                            }
                        }
                    }
                    // ストレージ容量表示
                    _this.showStorageInfo(totalSizes_regions,totalSizes_download);

                    //モーダルを閉じる
                    _this.closeModalDialog();
                });
            }, function () {
                // キャンセルボタン押下
                delegate.deny();
                //モーダルを閉じる
                _this.closeModalDialog();
            }, _this.dialogType.deleteDownloadedMap);
        };

        PageManager.prototype.startCancelDownloadProc = function (callbacks) {
            var _this = this;
            callbacks = callbacks || {};
            var defaultCallbacks = {
                'finishCancel' : function() {},
                'closeFinishModal' : function() {},
            };

            for (var key in defaultCallbacks) {
                if (callbacks[key] == undefined) {
                    callbacks[key] = defaultCallbacks[key];
                }
            }

            console.log(">>> callback (Cancel)");
            _this.initCancelDownload(function () {
                _this.cancelDownload(function (result) {
                    console.log(">>> cancelDownload result = " + result);
                    callbacks.finishCancel();
/* #MOTA-125 start 18/08/29 by asada start */
                    if (_this.cancelDownloadResult) {
                        // モーダルダイアログ表示
//                        _this.createModalDialogOkButton(_this.texts.popupStopDownloading, function () {
                            //モーダルダイアログ　クローズ
//                            _this.closeModalDialog();
                            callbacks.closeFinishModal();
//                        });
                    }
/* #MOTA-125 start 18/08/29 by asada end */
                });
            });
        }

        PageManager.prototype.showInstallingIcon = function (key, progress) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                var iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.INSTALLING;
                if (iconType != HarmanOTA.UI.UpdateList.getItemIconType(HarmanOTA.UI.UpdateList.getItemIconRight($row).attr("src"))) {
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "iconRight": iconType, "progress": 0, "showprogress": false });
                }
            }
        };

        /**
         * 画面上にローディングを表すアイコンを表示
         * @param isLoading true:ローディング処理実行/false:ローディング処理解除
         */
        PageManager.prototype.setLoading = function (isLoading) {
            var _this = this;

            if (isLoading) {
                // ローディング表示
                $.mobile.showPageLoadingMsg();
                //オーバーレイ開始
                _this.setOverlay(true);

            } else {
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();
                //オーバーレイ解除
                _this.setOverlay(false);
            }
        };

        /**
         * オーバーレイ
         * @param overlayFlag true:オーバーレイする/false:オーバーレイしない
         */
        PageManager.prototype.setOverlay = function (overlayFlag, $target) {
            var $overlayArea = null;

            if ($target == undefined) {
                $overlayArea = $(PageManager.OVERLAY_AREA);
            } else {
                $overlayArea = $target;
            }

            //オーバーレイ実行
            if (overlayFlag) {
                $overlayArea.removeClass(PageManager.CSS_OVERLAY_OFF);
                $overlayArea.addClass(PageManager.CSS_OVERLAY_ON);

            } else {
                // オーバーレイ解除
                $overlayArea.removeClass(PageManager.CSS_OVERLAY_ON);
                $overlayArea.addClass(PageManager.CSS_OVERLAY_OFF);
            }

        };

        // ↓ モーダルウィンドウ ↓ ------------------------------------------------------------------------------  
        /**
         * モーダルウィンドウを生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param buttons 表示するボタンの種類
         * @param name モーダル名 ダイアログ作成時に指定したnameもしくは以下のデフォルト名を使用
         *             none:ボタンなし/ok:OKボタンのみ/cancel:cancelボタンのみ/okcancel:OKボタンとCancelボタン
         */
        PageManager.prototype.createModalDialog = function (text, buttons, name) {
            if (text == undefined || text == null) {
                return;
            }

            // jQuery-UIのdialogを使用
            $(PageManager.DIALOG_CONFIRM).dialog({
                resizable: false,       //リサイズ禁止
                modal: true,            //モーダル化
                title: "",           //タイトル文字列（空白）
                buttons: buttons,
            });

            //name設定
            $(PageManager.DIALOG_CONFIRM).attr("name", name);
            //CSS設定
            $(PageManager.DIALOG_CONFIRM).addClass(PageManager.CSS_MORDAL);
            //ボタンなしモーダルの場合CSSを追加
            if (buttons == undefined || buttons.length == 0) {
                $(PageManager.DIALOG_CONFIRM).addClass(PageManager.CSS_DIALOG_NOBUTTON);
            } else {
                $(PageManager.DIALOG_CONFIRM).removeClass(PageManager.CSS_DIALOG_NOBUTTON);
            }
            // 本文設定
            $(PageManager.DIALOG_CONFIRM).find("p:first").html(text.replace('\n', '</br>'));
            // RTL有効/無効設定
            this.setEnabledRtl($(PageManager.DIALOG_CONFIRM), this.isEnabledRtl);
            // スクロール禁止
            this.no_scroll();
            // 最前面に表示
            $(PageManager.DIALOG_CONFIRM).dialog("moveToTop");
        };

        /**
         * モーダルウィンドウ（ボタンなし）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param name ダイアログ名称（指定がない場合はデフォルト値（none)
         */
        PageManager.prototype.createModalDialogNoButton = function (text, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.none;
            }
            //ダイアログ作成
            this.createModalDialog(text, new Array(), dialogName);
        };

        /**
         * モーダルウィンドウ（ボタンなし）を生成する（タイマー起動）
         * @param text モーダルウィンドウに表示する文字列
         * @param name ダイアログ名称（指定がない場合はデフォルト値（none)
         */
        PageManager.prototype.createModalDialogNoButtonwithtimer = function (text, name, timer) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.none;
            }
            //ダイアログ作成
            this.createModalDialog(text, new Array(), dialogName);

            setTimeout(function() {
                _this.closeModalDialog();
            },timer);
        };

        /**
         * モーダルウィンドウ（OKボタン付）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         * @param name ダイアログ名称（指定がない場合はデフォルト値（ok)
         */
        PageManager.prototype.createModalDialogOkButton = function (text, callback, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.ok;
            }

            //ボタンの作成
            var buttons = new Array({
                text: this.texts.ok,
                click: function () {
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
            //ダイアログ作成
            this.createModalDialog(text, buttons, dialogName);
        };

        /**
         * モーダルウィンドウ（Cancelボタン付）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         * @param name ダイアログ名称（指定がない場合はデフォルト値（cancel)
         */
        PageManager.prototype.createModalDialogCancelButton = function (text, callback, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.cancel;
            }

            //ボタンの作成
            var buttons = new Array({
                text: this.texts.cancel,
                click: function () {
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
            //ダイアログ作成
            this.createModalDialog(text, buttons, dialogName);
        };

        /**
         * モーダルウィンドウ（ボタン２つ）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback1 ボタン（左）押下時のコールバック関数
         * @param callback2 ボタン（右）押下時のコールバック関数
         * @param name ダイアログ名称（指定がない場合はデフォルト値（okcancel)
         */
        PageManager.prototype.createModalDialogOkCancelButton = function (text, callback1, callback2, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.okcancel;
            }

            //ボタンの作成
            var buttons = new Array();
            var OKLogic = {
                text: this.texts.ok,
                click: function () {
                    if (callback1 != undefined) {
                        callback1();
                    }
                }
            };
            var cancelLogic = {
                text: this.texts.cancel,
                click: function () {
                    if (callback2 != undefined) {
                        callback2();
                    }
                }
            };

            ////RTL有効/無効に合わせてボタンの表示順を変更
            if (this.isEnabledRtl) {
                buttons.push(cancelLogic);
                buttons.push(OKLogic);

            } else {
                buttons.push(OKLogic);
                buttons.push(cancelLogic);
            }

            //ダイアログ作成
            this.createModalDialog(text, buttons, dialogName);
        };

        /**
          * モーダルウィンドウをクローズする
          */
         PageManager.prototype.closeModalDialog = function (name) {
            try {

                if (name != undefined && name != null) {
                    //指定したnameと一致しない場合はモーダルをクローズしない
                    if ($(PageManager.DIALOG_CONFIRM).attr("name") != name) {
                        return;
                    }
                }

                //スクロールを許可
                this.return_scroll();

                $(PageManager.DIALOG_CONFIRM).dialog("close");

            } catch (error) {
                console.log(error);
            }

        };

        /**
         * RTL有効/無効設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param enabled 有効/無効
         */
        PageManager.prototype.setEnabledRtl = function ($target, enabled) {
            var $label = $target.find("p:first");
            if (enabled) {
                $label.addClass(HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS);
            }
            else {
                $label.removeClass(HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS);
            }
        };

        /**
         * スクロール禁止用関数
         */
        PageManager.prototype.no_scroll = function () {
            //PC用
            var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
            $(document).on(scroll_event, function (e) { e.preventDefault(); });
            //SP用	
            $(document).on('touchmove.noScroll', function (e) { e.preventDefault(); });
        };

        /**
         * スクロール復活用関数
         */
        PageManager.prototype.return_scroll = function () {
            //PC用
            var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
            $(document).off(scroll_event);
            //SP用
            $(document).off('.noScroll');
        };
        // ↑ モーダルウィンドウ ↑ ------------------------------------------------------------------------------
        
        /**
         * ダウンロードプログレス表示対象ステータスかを判断
         * @param 判断結果（true:表示対象、false:表示対象ではない）
         */
        PageManager.prototype.judgeShowDownloadProgress = function (status) {
            return (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated) ||
                (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress);
        };

        //-----------------------------------------------
        //--- 以下、多言語テストロジック
        //-----------------------------------------------
        PageManager.prototype.startMultilingualTest = function () {
            //多言語テストロジック実行
            try {
                MultilingualSimulator.getInstance().setPageManager(this);

                MultilingualSimulator.getInstance().start();
            } catch (error) {
                console.log(error);
            }
        };


        PageManager.RootPagePath = "./index.html?countrycode=";
        PageManager.PagePath = "";
        PageManager.DIALOG_CONFIRM = "#dialog-confirm";  //ダイアログ
        PageManager.OVERLAY_AREA = "div[name='overlay']";               //overlayエリア
        PageManager.CSS_OVERLAY = "mobile-ota-overlay"
        PageManager.CSS_OVERLAY_OFF = "mobile-ota-overlay-off";
        PageManager.CSS_OVERLAY_ON = "mobile-ota-overlay-on";

        //CSS
        PageManager.CSS_MORDAL = "harman-ota-dialog-mordal";
        PageManager.CSS_DIALOG_NOBUTTON = "harman-ota-dialog-message-area";

        return PageManager;
    })();
    HarmanOTA.PageManager = PageManager;
    
    /**
     * 設定ページ管理クラス
     */
    var SettingPageManager = (function (_super) {
        __extends(SettingPageManager, _super);
        function SettingPageManager() {
            _super.apply(this, arguments);
        }
        /**
         * 初期化処理
         */
        SettingPageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.$autoUpdateRow = null;
            this.$mobileDataRow = null;
            this.$updateRow = null;
            this.$helpPage = null;
            this.$regionSelection = null;
            this.$licenseDataRow = null;
            this.isAutoUpdate = false;
            this.isMobileData = false;
            this.deviceCode = null;
            this.productCode = null;
            this.texts = null;
            this.huModel = null;
            this.selected_area = null;
        };
        /**
         * 画面初期化
         * @param language 言語コード
         */
        SettingPageManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // 文言取得
            this.texts = this.getPageText(language);
            // 設定読み出し
            this.loadSettingData(function () {
                // 画面項目設定
                _this.settingPageItem();

                // デバッグフラグONの場合
                if (HarmanOTA.useStubMultilingualTest) {
                    //多言語対応テスト
                    _this.startMultilingualTest();
                } 
            });
        };
        /**
         * 画面項目設定
         */
        SettingPageManager.prototype.settingPageItem = function () {
            // // タイトル設定
            // var $title = $("#settingsPageTitle");
            // $title.text(this.texts.title);
            // this.enabledRtl($title, this.isEnabledRtl, false);
            var _this = this;
            // 設定項目一覧UIを生成
            var $settingList = $("#setting_list");
            HarmanOTA.UI.SettingList.create($settingList);
            // 設定項目一覧UIの行を生成
            this.$autoUpdateRow = HarmanOTA.UI.SettingList.addItem($settingList);
            this.$mobileDataRow = HarmanOTA.UI.SettingList.addItem($settingList);
            //this.$updateRow = HarmanOTA.UI.SettingList.addItem($settingList);

            // 設定項目一覧UIの設定
            HarmanOTA.UI.SettingList.setItemInfo(this.$autoUpdateRow, { label: this.texts.autoupdate, status: this.isAutoUpdate, rtl: this.isEnabledRtl });
            HarmanOTA.UI.SettingList.setItemInfo(this.$mobileDataRow, { label: this.texts.mobiledata, status: this.isMobileData, rtl: this.isEnabledRtl });
            //HarmanOTA.UI.SettingList.setItemInfo(this.$updateRow, { label: this.texts.update, showbutton: false, rtl: this.isEnabledRtl });

            // 設定項目一覧のイベント設定
            HarmanOTA.UI.SettingList.setButtonStatusChangedCallback(this.$autoUpdateRow, function ($target, isOn) {
                var instance = _this;
                // 設定保存、AhaConnect SDKへの反映
                _this.saveSettingData(function () {
//                    instance.applySettingAhaConnectSDK(null);
                });
                // OFF -> ON の場合、説明アラート表示
                if (isOn) {
                    setTimeout(function () {
                        HarmanOTA.UI.Alert.alert(instance.texts.changedautoupdate);
                        instance.applySettingAhaConnectSDK(null);
                    }, SettingPageManager.AlertDelay);
                }
            });
            HarmanOTA.UI.SettingList.setButtonStatusChangedCallback(this.$mobileDataRow, function ($target, isOn) {
                // 設定保存
                _this.saveSettingData(null);
                var instance = _this;
                // OFF -> ON の場合、説明アラート表示
                if (isOn) {
                    setTimeout(function () {
                        HarmanOTA.UI.Alert.alert(instance.texts.changedmobiledata);
                    }, SettingPageManager.AlertDelay);
                }
            });

            // Backボタンのイベント設定
            $('#back').on('click', function() {
                var beforePage = HarmanOTA.Common.getQueryString("beforePage");
                var beforePage_dec = decodeURIComponent(beforePage);

                if (beforePage != undefined && beforePage != "") {
                    window.location.href = beforePage_dec;
                } else {
                    window.location.href = "./huupd_list.html";
                }
            });

            // Gen4の場合、地図更新設定の機能と利用地域選択の行追加
            if (this.huModel.indexOf('CP1.0') == 0) {
                this.$helpPage = HarmanOTA.UI.SettingList.addItem_without_toggle($settingList);
                HarmanOTA.UI.SettingList.setItemInfo(this.$helpPage, {label: this.texts.help, showbutton: false, rtl: this.isEnabledRtl});
            
                //イベント追加
                // 利用地域選択タップ時
                this.$helpPage.click(function (eventObject) {
                    var url = encodeURIComponent(window.location.href);
                    // 利用地域選択画面へ遷移
                    window.location.href = "./mobile_ota/gen4/regionHelp.html?beforePage=" + url;
                });

            } else if ( this.huModel.indexOf('Gen3.') == 0 ) {
                // ライセンス表示
            this.$licenseDataRow = HarmanOTA.UI.SettingList.addItem_without_toggle($settingList);
                HarmanOTA.UI.SettingList.setItemInfo(this.$licenseDataRow, { label: this.texts.license, showbutton: false, rtl: _this.isEnabledRtl });
                //ライセンスタップ時
            this.$licenseDataRow.click(function (eventObject) {
                        // ライセンス画面へ遷移
                    window.location.href = "./license.html";
            });
            }

        };
        /**
         * 文言取得
         * @param language 言語コード
         */
        SettingPageManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "title", "id": "SL_TXT_0196_", "language": language },
                { "key": "autoupdate", "id": "SL_TXT_0197_", "language": language },
                { "key": "mobiledata", "id": "SL_TXT_0198_", "language": language },
                { "key": "regionSelection", "id": "HTML_TXT_0205_", "language": language },
                { "key": "displaymode", "id": "HTML_TXT_0205_A_", "language": language },
                { "key": "update", "id": "SL_TXT_0199_", "language": language },
                { "key": "changedautoupdate", "id": "SL_TXT_0213_", "language": language },
                { "key": "changedmobiledata", "id": "SL_TXT_0212_", "language": language },
                { "key": "help", "id": "HTML_TXT_0165_", "language": language },
                { "key": "license", "id": "APP_TXT_0358_", "language": language },  //TODO:利用許諾の多言語文言展開待ち
            ];
            return this.buildText(textsList);
        };
        /**
         * 設定を読み込む
         * @param callback コールバック
         */
        SettingPageManager.prototype.loadSettingData = function (callback) {
            var _this = this;
            this.ahaConnectSDKSettings.readSettings(function (result) {
                if (result) {
                    _this.isAutoUpdate = _this.ahaConnectSDKSettings.auto_update_check;
                    _this.isMobileData = _this.ahaConnectSDKSettings.mobile_data_connection;
                    _this.deviceCode = _this.ahaConnectSDKSettings.deviceCode;
                    _this.productCode = _this.ahaConnectSDKSettings.productCode;
                    _this.huModel = _this.ahaConnectSDKSettings.huModel;

                    if (_this.huModel.indexOf('CP1.0') == 0) {
                        //gen4の設定を読み込み
                        _this.loadSettingDataGen4(callback);
                    } else {
                        //callback
                        if (callback != null) {
                            callback();
                        }
                    }

                }
                else {
                    HarmanOTA.Common.log(SettingPageManager.ModuleName, "fail loadSettingData");
                    // 汎用エラー
                    _this.genericError(true);
                    return;
                }
            });
        };

        SettingPageManager.prototype.loadSettingDataGen4 = function (callback) {
            var _this = this;
            var prepareAhaConnectSDKSettings = new MobileOtaGen4.AhaConnectSDKSettingsGen4();
            //gen4の設定値を取得
            prepareAhaConnectSDKSettings.readSettings(function (result) {
                if (result) {
                    _this.selected_area = prepareAhaConnectSDKSettings.settings_gen4.selected_area;

                    prepareAhaConnectSDKSettings.ahaConnectSDKController.getCurrentMapDetails(prepareAhaConnectSDKSettings.deviceCode, prepareAhaConnectSDKSettings.productCode, function (data, result) {
                       if (!result) {
                            deferred.rejectWith(_this);
                           return;
                       }

                        var $settingList = $("#setting_list");

                       //レスポンスデータを取得
                       var hu_area = data.data[0].mapJson.nds_product[0].name;

                       //Map Update Regionを表示するかを判断
                       if (MobileOtaGen4.PageManagerGen4.NORTH_AMERICA == hu_area) {
                            _this.$regionSelection = HarmanOTA.UI.SettingList.addItem_without_toggle($settingList);
                            HarmanOTA.UI.SettingList.setItemInfo(_this.$regionSelection, {label: _this.texts.regionSelection, showbutton: false, rtl: _this.isEnabledRtl});

                            //イベント追加
                            // Map Update Regionタップ時
                            _this.$regionSelection.click(function (eventObject) {
                                var url = encodeURIComponent(window.location.href);
                                // Map Update Region画面へ遷移
                                window.location.href = "./mobile_ota/gen4/regionSelection.html?beforePage=" + url;
                            });
                        } else if ((MobileOtaGen4.PageManagerGen4.EUROPE == hu_area) || (MobileOtaGen4.PageManagerGen4.OCEANIA == hu_area)) {
                            _this.$regionSelection = HarmanOTA.UI.SettingList.addItem_without_toggle($settingList);
                            HarmanOTA.UI.SettingList.setItemInfo(_this.$regionSelection, {label: _this.texts.regionSelection, showbutton: false, rtl: _this.isEnabledRtl});

                            //イベント追加
                            // Map Update Regionタップ時
                            _this.$regionSelection.click(function (eventObject) {
                                var url = encodeURIComponent(window.location.href);
                                // Map Update Region画面へ遷移
                                window.location.href = "./mobile_ota/gen4/regionSelection_other.html?beforePage=" + url;
                            });

                        }

                        // ライセンス表示
                        _this.$licenseDataRow = HarmanOTA.UI.SettingList.addItem_without_toggle($settingList);
                        HarmanOTA.UI.SettingList.setItemInfo(_this.$licenseDataRow, { label: _this.texts.license, showbutton: false, rtl: _this.isEnabledRtl });
                        //ライセンスタップ時
                        _this.$licenseDataRow.click(function (eventObject) {
                                // ライセンス画面へ遷移
                                window.location.href = "./license.html";
                        });
                   });

                    if (callback != null) {
                        callback();
                    }
                } else {
                    HarmanOTA.Common.log(SettingPageManager.ModuleName, "fail loadSettingData");
                    // 汎用エラー
                    _this.genericError(true);
                    return;
                }
            });
        }
        /**
         * 設定を保存する
         * @param callback コールバック
         */
        SettingPageManager.prototype.saveSettingData = function (callback) {
            var _this = this;
            // 画面上の設定状態を取得
            var autoUpdateInfo = HarmanOTA.UI.SettingList.getItemInfo(this.$autoUpdateRow);
            var mobileDataInfo = HarmanOTA.UI.SettingList.getItemInfo(this.$mobileDataRow);
            // AhaConnect SDK設定管理クラスへ設定状態を反映
            this.ahaConnectSDKSettings.auto_update_check = autoUpdateInfo.status;
            this.ahaConnectSDKSettings.mobile_data_connection = mobileDataInfo.status;
            // 設定を書き込む
            this.ahaConnectSDKSettings.writeSettings(function (result) {
                if (!result) {
                    HarmanOTA.Common.log(SettingPageManager.ModuleName, "fail writeSettings");
                    // 汎用エラー
                    _this.genericError(false);
                    return;
                }
                if (callback != null) {
                    callback();
                }
            });
        };
        /**
         * AhaConnect SDKへ設定を反映する
         * @param callback コールバック
         */
        SettingPageManager.prototype.applySettingAhaConnectSDK = function (callback) {
            var _this = this;
            // 画面上の設定状態を取得
            var autoUpdateInfo = HarmanOTA.UI.SettingList.getItemInfo(this.$autoUpdateRow);
            // AhaConnect SDK設定管理クラスへ設定状態を反映
            this.ahaConnectSDKSettings.auto_update_check = autoUpdateInfo.status;
            // AhaConnect SDKへ設定を反映する
            this.ahaConnectSDKSettings.applySettings(function (result) {
                if (!result) {
                    HarmanOTA.Common.log(SettingPageManager.ModuleName, "fail applySettingAhaConnectSDK");
                    // 汎用エラー
                    _this.genericError(false);
                    return;
                }
                if (callback != null) {
                    callback();
                }
            });
        };
        /**
         * 更新データ一覧画面へ遷移
         */
        SettingPageManager.prototype.gotoUpdatesListPage = function () {
            // ローディング表示
            $.mobile.showPageLoadingMsg();
            // 更新データ一覧画面へ遷移
            HarmanOTA.Common.transitionPage(UpdatePageManager.PagePath);
            // // 設定を読み込む
            // this.loadSettingData(() => {
            //     // 更新可能地図データ情報取得
            //     this.ahaConnectSDKController.retrieveAvailableMapRegions((data: any, result: boolean) => {
            //         // ローディング非表示
            //         $.mobile.hidePageLoadingMsg();
            //         if (!result) {
            //             if (data != null) {
            //                 // 有効期限切れ
            //                 if (data.errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired) {
            //                     // 有効期限切れ
            //                     this.expiredSubscription();
            //                     return;
            //                 }
            //             }
            //             // 汎用エラー
            //             this.genericError(false);
            //             return;
            //         }
            //         // データの存在チェック
            //         var isExistsData: boolean = AnalyseAhaConnectSDKResponse.analyseExistsData(data);
            //         if (!isExistsData) {
            //             // 地図データが存在しない時の処理
            //             this.noMapData();
            //             return;
            //         }
            //         // 更新データ一覧画面へ遷移
            //         HarmanOTA.Common.transitionPage(UpdatePageManager.PagePath);
            //     });
            // });
        };

        /**
         * 画面のリロード処理
         */
        SettingPageManager.prototype.reloadListPage = function () {
            
            $("#setting_list").empty();
            //画面リロード
            this.settingPageItem();
        };

        SettingPageManager.PagePath = "./huupd_settings.html";
        SettingPageManager.ModuleName = "HarmanOTA.SettingPageManager";
        SettingPageManager.AlertDelay = 600;
        return SettingPageManager;
    })(PageManager);
    /**
     * 更新データ一覧ページ管理クラス
     */
    var UpdatePageManager = (function (_super) {
        __extends(UpdatePageManager, _super);
        function UpdatePageManager() {
            _super.apply(this, arguments);
        }
        /**
         * 初期化処理
         */
        UpdatePageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.texts = null;
            this.updateDatas = null;
            this.$updateList = null;
            this.$categoryItems = new Array();
            this.$downloadButton = null;
            this.deviceCode = null;
            this.productCode = null;
            this.updateDataRows = new Array();
            this.downloadingKeys = new Array();
            this.transferringKeys = new Array();
            this.simDownloadTimer = -1;
            this.simTransferTimer = -1;
            this.CategoryIds = new Array();
            this.CategoryIds[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD] = "notdownload";
            this.CategoryIds[HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE] = "notupdate";
            this.CategoryIds[HarmanOTA.MAP_DATA_CATEGORY.UPDATED] = "updated";
            this.buttonType = {
                "download": 0,
                "cancel": 1,
            };
            this.currentButtonType = null;
        };
        /**
         * 画面初期化
         * @param language 言語コード
         */
        UpdatePageManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // ローディング表示
            $.mobile.showPageLoadingMsg();
            // 文言取得
            this.texts = this.getPageText(language);
            // // タイトル設定
            // var $title = $("#updatePageTitle");
            // $title.text(this.texts.title);
            // this.enabledRtl($title, this.isEnabledRtl, false);
            this.loadData() // データ読み出し
                .then(function () {
                // 画面項目設定
                _this.settingPageItem();
                _this.transferringKeys.length = 0;
                // 画面状態の更新
                _this.refreshPageState();
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();

                var finish = function() {
                    _this.gettransferMapDataProgress(function (data) {
                        if (data != undefined && data.notify != undefined) {
                            _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                        } else if (data.resp == "startDownload"){
                            _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                        }
                    });
                    _this.getdownloadMapDataProgress(function (data) {
                        if (data != undefined && data.notify != undefined) {
                            _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                        } else if (data.resp == "startDownload"){
                            _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                        }
                    });
                };
                _this.settingAhaConnectSDK().then(finish, finish); // AhaConnect SDK関連設定

                // 該当データが0件のカテゴリは非表示にする
                var totalSizes_regions = 0;
                var totalSizes_download = 0;
                for (var key in this.updateDatas) {
                    var datas = this.updateDatas[key];
                    for (var i = 0; i < datas.length; i++) {
                        if( key == 1 ) {
                            totalSizes_regions += datas[i].size;
                        } else if ( key == 2 ) {
                            totalSizes_download += datas[i].size;
                        }
                    }
                }
                // ストレージ容量表示
                this.showStorageInfo(totalSizes_regions,totalSizes_download);

                HarmanOTA.CommonHTMLSDK.getInstance().readKVS("geocode_iso_country_code/", function (key, value) {
                    console.log("[I][UpdatePageManager][initPage][readKVS] key : "+key+" geocode_iso_country_code : "+value);
                    try {
                        countryCode = value.split("_").length == 2 ? value.split("_")[1] : value.split("_")[0];
                        console.log("[I][UpdatePageManager][initPage][readKVS] countryCode = "+countryCode);
                    } catch (e) {
                        console.log("[E][UpdatePageManager][initPage][readKVS] can't get countryCode.");
                        countryCode = "US";
                    }
                    this.$('#backbutton').attr('href', './index.html?countrycode=' + countryCode);
                });


            }, function (delegate) {
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
                    _this.genericError(true);
                }
            });
        };

        /**
         * ストレージバーの表示
         * @param 地図の容量（選択されている合計値）
         */
        UpdatePageManager.prototype.showStorageInfo = function (regionSize, downloadRegions) {
            var _this = this;

            // MWS request
            mwsRequestManager.initialize(function () {
                // complete
                getStorageInfoApi().then(function (responseText) {
                    // resolve(success)
                    if (responseText != undefined && responseText != null && responseText != "") {
                        console.log("getStorageInfoApi: " + responseText);

                        var data = JSON.parse(responseText);
                        var totalSize = data.totalSize;
                        var freeSize = data.freeSize;

                        console.log("freeSize = %s / regionSize = %s ", freeSize, regionSize);

                        if (regionSize > freeSize) {
                            // ストレージ容量不足
                            console.log("storage short !! regionSize: " + regionSize + " totalSize: " + totalSize + " freeSize: " + freeSize);
                            //ストレージバー表示
                            var freePercent = freeSize / totalSize * 100;
                            _this.showStorageBar(0, freePercent, 0, freeSize, totalSize);
                            // ローディング終了
                            _this.setLoading(false);
                            // ダイアログ表示
                            _this.createModalDialogOkButton(_this.texts.popupCapacityExceeded, function () {
                                //モーダルクローズ
                                _this.closeModalDialog();
                                // checkForUpdateボタンに更新
                                _this.updateButton(_this.buttonType.download, true);
                            });
                            return;
                        } else {
                            var regionPercent = regionSize / totalSize * 100;
                            var freePercent = freeSize / totalSize * 100;
                            _this.showStorageBar(regionPercent, freePercent, regionSize, freeSize, totalSize);

                            console.log("regionSize: " + regionSize + " totalSize: " + totalSize + " freeSize: " + freeSize + " region: " + regionPercent + "%" + " free: " + freePercent + "%");
                        }
                    }
                }, function () {
                    // resolve(reject)

                });
            });


            function getStorageInfoApi() {
                var value = null;
                var url = mwsRequestManager.getMWSUrl() + "get-storage-info";
                var d = $.Deferred();

                $.ajax({
                    type: "GET",		// HTTPメソッド
                    url: url,			// URL
                    async: true,		// 非同期
                    timeout: 50000,		// タイムアウト
                    success: function (data, status, xhr) {
                        d.resolve(xhr.responseText);
                    },
                    error: function (xhr, status, err) {
                        d.reject();
                    }
                });
                return d.promise();
            }
        };
        /**
         * 任意の桁で四捨五入する関数
         * @param {number} value 四捨五入する数値
         * @param {number} base どの桁で四捨五入するか（10→10の位、0.1→小数第１位）
         * @return {number} 四捨五入した値
         */
        UpdatePageManager.prototype.orgRound = function (value, base) {
            return Math.round(value * base) / base;
        }

        /**
          * ストレージ容量を示すバーを表示する
         */
        UpdatePageManager.prototype.showStorageBar = function (RegionPercent, freeSizePercent, RegionSize_value, freeSize_value, totalSize_value) {
            var RegionPercent_round = this.orgRound(RegionPercent,2);
            var style1 = document.getElementById("storage_used").style;
            var storageUsedPercent = this.orgRound(100 - freeSizePercent,2);
            var calc_usedStoragePercent = this.orgRound(storageUsedPercent + RegionPercent_round,2);
            var calc_freeSizePercent = this.orgRound(100 - calc_usedStoragePercent,2);

            style1.width = this.orgRound((storageUsedPercent * 0.70),2) + '%';
            $(UpdatePageManager.REGION_TOTAL).css("left", this.orgRound((storageUsedPercent * 0.70),2) + '%');

            var style2 = document.getElementById("region_total").style;
            style2.width = this.orgRound((RegionPercent_round * 0.70),2) + '%';
            $(UpdatePageManager.STORAGE_FREE).css("left", this.orgRound(((storageUsedPercent + RegionPercent_round) * 0.70),2) + '%');

            var style3 = document.getElementById("storage_free").style;
            style3.width = this.orgRound((calc_freeSizePercent * 0.70),2) + '%';
            $(UpdatePageManager.REGION_TOTAL_VAL).css("left", this.orgRound(((storageUsedPercent + RegionPercent_round + calc_freeSizePercent) * 0.70),1) + '%');

            var style4 = document.getElementById("storagebar_value").style;
            style4.left = 70 + '%';
            style4.width = 30 + '%';

            var freeSize_unit = freeSize_value / 1000 / 1000 / 1000;
            freeSize_unit = freeSize_unit * 10;
            freeSize_unit = Math.round(freeSize_unit) / 10;
            var totalSize_unit = totalSize_value / 1000 / 1000 / 1000;
            totalSize_unit = Math.round(totalSize_unit);

            document.getElementById('storagebar_value').innerHTML = freeSize_unit + "GB /" + totalSize_unit +"GB";

        };


        /**
         * 画面項目設定
         */
        UpdatePageManager.prototype.settingPageItem = function () {
            var _this = this;
            // ダウンロードボタンを生成
            this.$downloadButton = $("#button_alldownload");
            HarmanOTA.UI.PageBottomButton.create(this.$downloadButton);
            this.updateButton(this.buttonType.download, true);

            //設定画面へのリンクボタン設定
            // Backボタンのイベント設定
            $('#setting').on('click', function() {
                var beforePage_enc = encodeURIComponent(window.location.href);
                var settingPageUrl = "./huupd_settings.html?beforePage=" + beforePage_enc ;
                    
                if (settingPageUrl != undefined && settingPageUrl != "") {
                    window.location.href = settingPageUrl;
                }
            });

            // 更新データ一覧UIを更新
            this.updateDataList();

        };

        /**
         * ボタンの更新
         * @param buttonType ボタンタイプ
         */
        UpdatePageManager.prototype.updateButton = function (buttonType, enable) {
            var _this = this;
            HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, enable);
            HarmanOTA.UI.PageBottomButton.setEnabledRtl(this.$downloadButton, this.isEnabledRtl);
            if (this.currentButtonType == buttonType) {
                return;
            }
            this.currentButtonType = buttonType;
            //buttonTypeごとに処理を分岐
            switch (buttonType) {
                case this.buttonType.download:
                    HarmanOTA.UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.alldownload);
                    // ダウンロードボタンのイベント設定
                    HarmanOTA.UI.PageBottomButton.setClickedCallback(this.$downloadButton, function ($target) {
                        // ボタンハッチング
                        HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                        // iOSの場合、暫定のアラートを表示する
                        if ((JSON.parse(getMemoryAppInfo())).os == 'ios') {
                            HarmanOTA.UI.Alert.alert(_this.texts.cautionDownloadAll);
                        }
                        // ダウンロードキューを登録する
                        _this.downloadAllData(function (result) {
                            // 失敗
                            if (!result) {
                                // ボタンハッチング解除
                                HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                                // 汎用エラー
                                _this.genericError(false);
                            } else {
//                                _this.updateButton(_this.buttonType.cancel, true);
                            }
                        });
                    });
                    break;

                case this.buttonType.cancel:
                    HarmanOTA.UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.cancel);
                    HarmanOTA.UI.PageBottomButton.setClickedCallback(this.$downloadButton, function ($target) {

                        _this.fireCancelDownload();
                    });
                    break;
            }
        };

        UpdatePageManager.prototype.fireCancelDownload = function () {
            var _this = this;

            HarmanOTA.AhaConnectHTMLSDK.getInstance().getDownloadQueue(function (keys) {

                console.log('HarmanOTA.AhaConnectHTMLSDK.getInstance().getDownloadQueue : ' + JSON.stringify(keys));

                if (keys.length == 0) {
                    console.log("getDownloadQueue length=0");
                    return;
                }
                // ボタンハッチング
                HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                _this.startCancelDownloadProc({
                    'finishCancel': function () {
                        _this.updateButton(_this.buttonType.download, true);
                        HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                    },
                    'closeFinishModal': function () {
                        _this.updateButton(_this.buttonType.download, true);
                        HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                    },
                });
            });
        }
        

        UpdatePageManager.prototype.isAllowDeleteDownloadedMapData = function ($item) {
            var src = HarmanOTA.UI.UpdateList.getItemIconRight($item).attr("src");
            if (src == "") {
                return false;
            }

            var iconType = HarmanOTA.UI.UpdateList.getItemIconType(src);
            return iconType == HarmanOTA.UI.MAP_DATA_ICON_TYPE.DELETE;
        }

        UpdatePageManager.prototype.getDeleteDownloadedMapDataDelegate = function ($row, targetData, customData) {
            var _this = this;
            return {
                'deny' : function() {},
                'success' : function() {
                    var stubStatus = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadStateInvalid;
                    var categoryInfo = _this.getCategoryInfoFromDownloadStatus(stubStatus);
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "icon": categoryInfo.iconType, "category": categoryInfo.categoryID });
                    _this.updateCategory(targetData.key, stubStatus, null);
                    _this.refreshPageState();
                },
                'error' : function() {},
            };
        };

        /**
         * 行選択時のイベントを設定
         * @param 行データ
         * @param data 
         */
        UpdatePageManager.prototype.setListTapEvent = function ($row, data) {
            var _this = this;
            // 選択ボックスのイベント設定
            HarmanOTA.UI.UpdateList.setClickedCallback($row, data, function ($target, targetData) {
                if (_this.isAllowDeleteDownloadedMapData($target)) {
                    // 地図データ削除
                    _this.deleteDownloadedMapData($target, targetData, {});
                }
            });

            // 右アイコンのイベント設定             
            HarmanOTA.UI.UpdateList.seticonRightClickedCallback($row, data, function ($target, targetData) {

                var targetStates = [HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE, HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD];
                for (var index = 0; index < targetStates.length; index++) {
                    var state = targetStates[index];
                    
                    var tempDatas = _this.updateDatas[state];
                    if (tempDatas == undefined) {
                        continue;
                    }
                    for (var i = 0; i < tempDatas.length; i++) {
                        var tempData = tempDatas[i];
                        if(tempData.key.regionID == targetData.key.regionID){
                            if(state == HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE){  
                            //NOT_UPDATEのリスト項目を押した場合---------------------------------------------

                                if(HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DELETE]){
                                    return;
                                } else if (HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.INSTALLING]) {
                                    return;
                                }

                                _this.deleteDownloadedMapData($target, tempData, {});   // ダウンロードキューを削除する

                            //--------------------------------------------------------------------------------
                            }
                            else if(state == HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD){
                            //NOT_DOWNLOADのリスト項目を押した場合---------------------------------------------
                                if(HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]){
                                    return;
                                } else if (HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE]){
                                    return;
                                } else if (HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD] ) {
                                    return;
                                } else if (HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src") == HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.DOWNLOADING] ) {
                                    return;
                                }

                                HarmanOTA.UI.UpdateList.getItemIconRight($target).attr("src", HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]);
                                // ボタンハッチング
                                HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                                // iOSの場合、暫定のアラートを表示する
                                if ((JSON.parse(getMemoryAppInfo())).os == 'ios') {
                                    HarmanOTA.UI.Alert.alert(_this.texts.cautionDownloadAll);
                                }
                                _this.downloadOneData(tempData,function (result) {// ダウンロードキューを登録する
                                    // 失敗
                                    if (!result) {
                                        // ボタンハッチング解除
                                        HarmanOTA.UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                                        // 汎用エラー
                                        _this.genericError(false);
                                    } else {
//                                        _this.updateButton(_this.buttonType.cancel, true);
                                    }
                                });
                                
                            //--------------------------------------------------------------------------------
                            }
                        }
                    }
                }
            });
        };

        /**
         * 更新データ一覧を更新（再生成）
         */
        UpdatePageManager.prototype.updateDataList = function () {
            // クリア
            this.updateDataRows.length = 0;
            this.$updateList = $("#update_list");
            this.$updateList.empty();
            var _this = this;
            // 更新データ一覧UIを生成
            HarmanOTA.UI.UpdateList.create(this.$updateList);
            for (var key in this.updateDatas) {
                if (this.CategoryIds[key] == undefined) {
                    // HarmanOTA.MAP_DATA_CATEGORY.INDEFINITE を想定
                    continue;
                }

                // カテゴリ生成
                this.$categoryItems[key] = HarmanOTA.UI.UpdateList.addCategory(this.$updateList, this.CategoryIds[key]);
                HarmanOTA.UI.UpdateList.setCategoryInfo(this.$categoryItems[key], {
                    "label": this.texts.categories[key],
                    "show": this.updateDatas[key].length > 0,
                    "rtl": this.isEnabledRtl
                });
                // カテゴリ別設定
                var isShowFromVersion = false;
                var isShowSize = false;
                var isDownloadProgress = false;
                var iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                switch (+key) {
                    case HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        break;
                    case HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE:
                        isShowFromVersion = false;
                        isShowSize = true;
                        isDownloadProgress = false;
                        iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
                        break;
                    case HarmanOTA.MAP_DATA_CATEGORY.UPDATED:
                        isShowFromVersion = true;
                        isShowSize = false;
                        isDownloadProgress = false;
                        iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATED;
                        break;
                    default:
                        break;
                }
                var language = HarmanOTA.Controller.instance.language;
                // 行生成
                switch (+key) {
                    case HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        this.getdownloadMapDataProgress(function (notifydata) {
                            for (var i = 0; i < _this.updateDatas[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD].length; i++) {
                                isShowFromVersion = false;
                                isShowSize = true;
                                isDownloadProgress = true;
                                iconType = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;

                                var data = _this.updateDatas[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD][i];
                                var $row = HarmanOTA.UI.UpdateList.addItem(_this.$updateList, _this.CategoryIds[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD]);
                                if(language === "ar" || language === "he"){
                                    $row.addClass("language_right");
                                }
                                // プログレス表示判断
                                var isShowProgress = false;
                                var progress = 0;
                                isShowProgress = _this.judgeShowDownloadProgress(data.downloadStatus);
                                if (Object.keys(notifydata).length) {
                                    if (data.key.regionID == notifydata.data[0].regionID) {
                                        progress = notifydata.data[0].progress;
                                        // プログレス点滅設定一時ストップ
                                        HarmanOTA.UI.ProgressCircle.stopFlashProgressCircle(data.key.regionID);
                                    }
                                }
                                HarmanOTA.UI.UpdateList.setItemInfo($row, {
                                    "title": {
                                        "label": _this.texts.map,
                                        "value": data.name
                                    },
                                    "version": {
                                        "label": _this.texts.version,
                                        "value": HarmanOTA.Common.formatVersion(isShowFromVersion ? data.fromVersion : data.toVersion)
                                    },
                                    "size": {
                                        "label": isShowSize ? _this.texts.size : "",
                                        "value": isShowSize ? HarmanOTA.Common.formatDataSize(data.size, 1024) : ""
                                    },
                                    "icon": iconType,
                                    "progress": progress,
                                    "showprogress": isShowProgress,
                                    "regionID" : data.key.regionID,
                                    "rtl": _this.isEnabledRtl
                                });

                                //イベントを設定
                                _this.setListTapEvent($row, data);

                                _this.updateDataRows.push({
                                    "key": data.key,
                                    "row": $row
                                });
                            }
                        });
                        break;

                    case HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE:
                    case HarmanOTA.MAP_DATA_CATEGORY.UPDATED:
                        for (var i = 0; i < this.updateDatas[key].length; i++) {
                            var data = this.updateDatas[key][i];
                            var $row = HarmanOTA.UI.UpdateList.addItem(this.$updateList, this.CategoryIds[key]);
                            if(language === "ar" || language === "he"){
                                $row.addClass("language_right");
                            }
                            // プログレス表示判断
                            var isShowProgress = false;
                            if (isDownloadProgress) {
                                isShowProgress = this.judgeShowDownloadProgress(data.downloadStatus);
                            }

                            HarmanOTA.UI.UpdateList.setItemInfo($row, {
                                "title": {
                                    "label": this.texts.map,
                                    "value": data.name
                                },
                                "version": {
                                    "label": this.texts.version,
                                    "value": HarmanOTA.Common.formatVersion(isShowFromVersion ? data.fromVersion : data.toVersion)
                                },
                                "size": {
                                    "label": isShowSize ? this.texts.size : "",
                                    "value": isShowSize ? HarmanOTA.Common.formatDataSize(data.size, 1024) : ""
                                },
                                "icon": iconType,
                                "progress": 0,
                                "showprogress": isShowProgress,
                                "regionID" : data.key.regionID,
                                "rtl": this.isEnabledRtl
                            });

                            //イベントを設定
                            this.setListTapEvent($row, data);

                            this.updateDataRows.push({
                                "key": data.key,
                                "row": $row
                            });
                        }
                        break;

                    default:
                        break;
                }
            }
        };
        
        UpdatePageManager.prototype.getNextButtonType = function () {
            if (this.downloadingKeys.length > 0) {
                return this.buttonType.cancel;
            } else if (this.transferringKeys.length > 0 ) {
                if (this.accessoryConnected) {
                    return this.buttonType.cancel;                    
                } else {
                    return this.buttonType.download;
                }
            } else {
                return this.buttonType.download;
            }
        }

        UpdatePageManager.prototype.isEnableNextButtonType = function (buttonType) {
            //buttonTypeごとに処理を分岐
            switch (buttonType) {
                case this.buttonType.download:
                    // DLボタンの場合、未DLが存在する場合は有効とする
                    return (this.updateDatas[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD].length > 0);

                case this.buttonType.cancel:
                    // キャンセルボタンの場合、DL中のデータが存在する場合に有効とする
                    return this.downloadingKeys.length > 0;
            }
        }

        /**
         * 地図データ削除ダイアログをclose 
         */
        UpdatePageManager.prototype.closeDeleteDownloadedMapDialog = function () {
            this.closeModalDialog(this.dialogType.deleteDownloadedMap);
        };

        /**
         * ダウンロード中ダイアログをclose 
         */
        UpdatePageManager.prototype.closeDownloadingDialog = function () {
            //処理なし（gen4で使用）のため作成
        };

        /**
         * ページ状態の更新（ボタンのハッチング状態など）
         */
        UpdatePageManager.prototype.refreshPageState = function (status) {
            var _this = this;
            var nextButtonType = this.getNextButtonType();
            this.updateButton(nextButtonType, this.isEnableNextButtonType(nextButtonType));
            // 該当データが0件のカテゴリは非表示にする
            for (var key in this.updateDatas) {
                var $categoryItem = this.$categoryItems[key];
                if ($categoryItem == undefined) {
                    continue;
                }
                console.log("refreshPageState : this.updataDates["+key+"] : "+this.updateDatas[key].length);
                HarmanOTA.UI.UpdateList.setCategoryInfo($categoryItem, {
                    "show": this.updateDatas[key].length > 0
                });

            }

            if ((status != undefined) && (status >= HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadError)) {
                for (var key in this.updateDatas) {
                    if (this.CategoryIds[key] == undefined) {
                        // HarmanOTA.MAP_DATA_CATEGORY.INDEFINITE を想定
                        continue;
                    }
                    var rightIconSrc = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                    switch (+key) {
                        case HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                            rightIconSrc = HarmanOTA.UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                            break;
                        case HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE:
                            // 削除アイコンを表示する
                            rightIconSrc = HarmanOTA.UI.MAP_DATA_ICON_TYPE.DELETE;
                            break;
                        case HarmanOTA.MAP_DATA_CATEGORY.UPDATED:
                            rightIconSrc = HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD;
                            break;
                        default:
                            break;
                    }

                    // 行生成
                    for (var i = 0; i < this.updateDatas[key].length; i++) {
                        var data = this.updateDatas[key][i];
                        var $row = this.getUpdateDataRow(data.key);

                        HarmanOTA.UI.UpdateList.setItemInfo($row, {
                            "iconRight": rightIconSrc,
                            "progress": 0,
                            "showprogress": false,
                        });
                    }
                }
            } else {
                this.reloadListIcon();
            }
        };
        /**
         * 文言取得
         * @param language 言語コード
         */
        UpdatePageManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "title", "id": "SL_TXT_0199_", "language": language },
                { "key": "map", "id": "SL_TXT_0204_", "language": language },
                { "key": "version", "id": "SL_TXT_0205_", "language": language },
                { "key": "size", "id": "OTHER_SIZE_0001_", "language": language },
                { "key": "alldownload", "id": "HTML_TXT_0171_", "language": language },
                { "key": "popupStopDownloading", "id": "HTML_TXT_0186_", "language": language },
                { "key": "ok", "id": "OTHER_011_", "language": language },
                { "key": "cancel", "id": "APP_024_", "language": language },
                { "key": "cautionDownloadAll", "id": "HTML_TXT_0068_", "language": language },
                { "key": "deleteDownloadedMap", "id": "HTML_TXT_0183_", "language": language },
                { "key": "succeededMapDelete", "id": "HTML_TXT_0184_", "language": language },
                { "key": "failedMapDelete", "id": "HTML_TXT_0185_", "language": language },
                { "key": "popupCapacityExceeded", "id": "HTML_TXT_0172_", "language": language },
                { "key": "notifynetworkerror", "id": "SL_TXT_0220_", "language": language },

            ];
            var texts = this.buildText(textsList);
            texts.categories = {};

            var tmpText = "";
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0202_", language));
            texts.categories[HarmanOTA.MAP_DATA_CATEGORY.NOT_DOWNLOAD] = tmpText;
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0201_", language));
            texts.categories[HarmanOTA.MAP_DATA_CATEGORY.NOT_UPDATE] = tmpText;
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0203_", language));
            texts.categories[HarmanOTA.MAP_DATA_CATEGORY.UPDATED] = tmpText;
            return texts;
        };

        UpdatePageManager.prototype.buildListLayout = function (deferred, data) {
            HarmanOTA.Common.log(UpdatePageManager.ModuleName, "retrieveAvailableMapRegions -> build");
            if (data.data[0].errorCode != 0) {
                var inst = this;
                var delegate = {
                    delegateErrorHandle: function () {
                        // 汎用エラー
                        inst.genericError(true);
                        inst = null;
                    }
                };
                // 有効期限切れ
                if (data.data[0].errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired) {
                    delegate.delegateErrorHandle = function () {
                        // 有効期限切れ
                        inst.expiredSubscription(true);
                        inst = null;
                    };
                }
                deferred.rejectWith(this, [delegate]);
                return;
            }
            // データ解析（表示用データに変換）
            this.updateDatas = HarmanOTA.AnalyseAhaConnectSDKResponse.analyseUpdateListData(data);
            if (this.updateDatas == null) {
                HarmanOTA.Common.log(UpdatePageManager.ModuleName, "retrieveAvailableMapRegions -> build reject.");
                HarmanOTA.Common.log(UpdatePageManager.ModuleName, "data : " + JSON.stringify(data));
                deferred.rejectWith(this);
                return;
            }
            // ダウンロード中データ、車載機転送中データのキーリストを生成
            this.downloadingKeys.length = 0;
//            var totalSizes_regions = 0;
//            var totalSizes_download = 0;
            for (var key in this.updateDatas) {
                var datas = this.updateDatas[key];
                for (var i = 0; i < datas.length; i++) {
                    // 有効期限チェック
                    if (datas[i].downloadStatus == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadFailSubscriptionInvalid) {
//                        var inst = this;
//                        var delegate = {
//                            delegateErrorHandle: function () {
//                                // 有効期限切れ
//                                inst.expiredSubscription(true);
//                                inst = null;
//                            }
//                        };
//                        deferred.rejectWith(this, [delegate]);
                        return;
                    }

//                    if( key == 1 ) {
//                        totalSizes_regions += datas[i].size;
//                    } else if ( key == 2 ) {
//                        totalSizes_download += datas[i].size;
//                    }

                    // ダウンロード中データ
                    if (HarmanOTA.AnalyseAhaConnectSDKResponse.judgeDownloadingStatus(datas[i].downloadStatus)) {
                        this.downloadingKeys.push(datas[i].key);
                    }
                    // 車載機転送中データ
                    if (HarmanOTA.AnalyseAhaConnectSDKResponse.judgeTransferringStatus(datas[i].accessoryTransferStatus)) {
                        this.transferringKeys.push(datas[i].key);
                    }
                }
            }
            deferred.resolveWith(this);

        };
        UpdatePageManager.prototype.handleNoMapAfterRetrieve = function (deferred) {
            if (deferred == undefined) {
                return;
            }
            // 地図データが存在しない時の処理
            var inst = this;
            var delegate = {
                delegateErrorHandle: function () {
                    // 汎用エラー
                    inst.noMapData();
                    // inst.expiredSubscription();  // debug
                    inst = null;
                }
            };
            deferred.rejectWith(this, [delegate]);
        };
        ;
        /**
         * データ読み込み
         * @return jQuery Deferredオブジェクト
         */
        UpdatePageManager.prototype.loadData = function () {
            var _this = this;
            var deferred = jQuery.Deferred();
            // 設定読み込み
            this.ahaConnectSDKSettings.readSettings(function (result) {
                if (result) {
                    _this.deviceCode = _this.ahaConnectSDKSettings.deviceCode;
                    _this.productCode = _this.ahaConnectSDKSettings.productCode;
                }
                else {
                    HarmanOTA.Common.log(UpdatePageManager.ModuleName, "fail loadData readSettings");
                    deferred.rejectWith(_this);
                    return;
                }
                // TODO:getInformationRegions(deviceCode,productCode)


                // 更新可能地図データ情報取得
                _this.ahaConnectSDKController.retrieveAvailableMapRegions(function (data, result, androidErrorCode) {
                    if (!result) {
                        if ((androidErrorCode != undefined) || (androidErrorCode != 0) ) {
                            if (androidErrorCode == HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired) {
                                // 有効期限切れ
                                _this.expiredSubscription(true);
                            } else if (androidErrorCode == HarmanOTA.AhaConnectSDK_ErrorCode_NetworkFailure) {
                                //ローディング解除
                                _this.setLoading(false);
                                // ダイアログ表示
                                _this.createModalDialogOkButton(_this.texts.notifynetworkerror, function () {
                                     var inst = _this;
                                     // ルートページへ戻る
                                     inst.backToRootPage();
                                     inst = null;
                                    //モーダルクローズ
                                    _this.closeModalDialog();
                                });
                            } else {
                                // 地図データが存在しない時の処理
                                _this.handleNoMapAfterRetrieve(deferred);
                            }
                        } else {
                            deferred.rejectWith(_this);
                        }
                        return;
                    }
                    // データの存在チェック
                    if (!HarmanOTA.AnalyseAhaConnectSDKResponse.analyseExistsData(data)) {

                        if (data.data[0].errorCode != undefined) {
                            androidErrorCode = data.data[0].errorCode;

                            if (androidErrorCode == HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired) {
                                // 有効期限切れ
                                _this.expiredSubscription(true);
                            } else if (androidErrorCode == HarmanOTA.AhaConnectSDK_ErrorCode_NetworkFailure) {
                                //ローディング解除
                                _this.setLoading(false);
                                // ダイアログ表示
                                _this.createModalDialogOkButton(_this.texts.notifynetworkerror, function () {
                                     var inst = _this;
                                     // ルートページへ戻る
                                     inst.backToRootPage();
                                     inst = null;
                                    //モーダルクローズ
                                    _this.closeModalDialog();
                                });
                            } else {
                                // 地図データが存在しない時の処理
                                _this.handleNoMapAfterRetrieve(deferred);
                            }

                        } else {

                            // 地図データが存在しない時の処理
                            _this.handleNoMapAfterRetrieve(deferred);
                        }
                        return;
                    }
                    // deviceCode, productCodeをチェックし、現在接続している車載の情報と不一致ならば失敗させる
                    var targetIndex = -1;
                    var removeDetas = new Array();
                    // var debug = false;
                    // if (debug) {
                    //     var dummy = {
                    //         'deviceCode': 12345,
                    //         'productCode': 12345,
                    //     };
                    //     data.data.push(dummy);
                    // }
                    for (var dataIndex = 0; dataIndex < data.data.length; dataIndex++) {
                        var deviceCode = data.data[dataIndex].deviceCode;
                        var productCode = data.data[dataIndex].productCode;
                        var target = { 'deviceCode': null, 'productCode': null };
                        if (_this.ahaConnectSDKSettings.deviceCode != deviceCode) {
                            target.deviceCode = deviceCode;
                        }
                        if (_this.ahaConnectSDKSettings.productCode != productCode) {
                            target.productCode = productCode;
                        }
                        if (target.deviceCode != null || target.productCode != null) {
                            target.deviceCode = deviceCode;
                            target.productCode = productCode;
                            removeDetas.push(target);
                        }
                        else {
                            targetIndex = dataIndex;
                        }
                    }
                    // データの存在チェック
                    if (targetIndex == -1) {
                        if (removeDetas.length > 0) {
                            _this.ahaConnectSDKController.removeDevices(removeDetas, function (removeDevicesData, result) {
                                // 地図データが存在しない時の処理
                                _this.handleNoMapAfterRetrieve(deferred);
                            });
                        }
                        else {
                            // 地図データが存在しない時の処理
                            _this.handleNoMapAfterRetrieve(deferred);
                        }
                        return;
                    }
                    data.data = [data.data[targetIndex]];
                    if (removeDetas.length > 0) {
                        _this.ahaConnectSDKController.removeDevices(removeDetas, function (removeDevicesData, result) {
                            _this.buildListLayout(deferred, data);
                        });
                    }
                    else {
                        _this.buildListLayout(deferred, data);
                    }
                });
            });
            return deferred.promise();
        };
        /**
         * AhaConnect SDK関連設定
         * @return jQuery Deferredオブジェクト
         */
        UpdatePageManager.prototype.settingAhaConnectSDK = function () {
            var _this = this;
            var deferred = jQuery.Deferred();
            // AhaConnect SDKの通知受信設定
            HarmanOTA.AhaConnectHTMLSDK.getInstance().addNotifyData(this.ahaConnectSDKNotify, this, function (result) {
                if (result) {
                    deferred.resolveWith(_this);
                }
                else {
                    deferred.rejectWith(_this);
                }
            });
            return deferred.promise();
        };

        // 最後に_super.prototype.handleNotifyDataを呼ぶので、途中リターンしないこと
        UpdatePageManager.prototype.handleNotifyData = function (notifyPayload, notifyContentType) {
            switch (notifyPayload.notify) {
                case HarmanOTA.AhaConnectSDK_Notify_downloadStatus:
                case HarmanOTA.AhaConnectSDK_Notify_downloadProgress:
                    this.setDownloadingAction(notifyPayload);
                    break;
                case HarmanOTA.AhaConnectSDK_Notify_accessoryTransferStatus:
                case HarmanOTA.AhaConnectSDK_Notify_accessoryTransferProgress:
                    this.accessoryCount++;
                    if (this.accessoryConnected) {
                        // 車載機転送ステータス
                        this.setTransferringAction(notifyPayload);
                        this.accessoryCount = 0;
                    } else if (this.accessoryCount > 1) {
                        // 車載機転送ステータス
                        this.setTransferringAction(notifyPayload);
                        this.setAccessoryConnected(true);
                        this.didAccessoryConnect();
                    }
                    break;
                case HarmanOTA.AhaConnectSDK_Notify_availableMapRegions:
                    // 車載機リージョン変更
                    this.reloadListPage();
                    break;
                case HarmanOTA.AhaConnectSDK_Notify_notifyFileTransferFailure:
                    this.readTransferringKeys();
                    this.clearTransferStatus();
                    for (var i = 0; i < this.transferringKeys.length; i++) {
                        this.setItemIcon(this.transferringKeys[i], UI.MAP_DATA_ICON_TYPE.NOT_UPDATE);
                        //カテゴリ変更
                        this.updateCategory(this.transferringKeys[i], null, HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated);
                    }
                    HarmanOTA.UI.PageBottomButton.setEnabled(this.$downloadButton, true);

                    break;

                default:
                    break;
            }

            if ((notifyPayload.resp != undefined) & (notifyPayload.resp == "startDownload")) {
                // 画面状態の更新
                for (var key in this.updateDatas) {
                     var datas = this.updateDatas[key];
                     for (var i = 0; i < datas.length; i++) {
                         if( key == 1 ) {
                            if ( datas[i].key.regionID == notifyPayload.data[0].regionID ) {
                                var $row = this.getUpdateDataRow(datas[i].key);
                                HarmanOTA.UI.UpdateList.setItemInfo($row, { "iconRight": HarmanOTA.UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD, "progress": 0, "showprogress": false, "regionID" : datas[i].key.regionID });
                            }
                         } else if ( key == 2 ) {
                            return;
                         }
                     }
                }
            }

            _super.prototype.handleNotifyData.call(this, notifyPayload, notifyContentType);
        };

        UpdatePageManager.prototype.setDownloadingAction = function (notifyPayload) {
            var _this = this;
            var status = this.getValidatedDownloadStatus(notifyPayload);
            var key = null;
            var progress = undefined;
            switch (notifyPayload.notify) {
                case HarmanOTA.AhaConnectSDK_Notify_downloadStatus:
                    var notifyDownloadStatusData = HarmanOTA.AnalyseAhaConnectSDKResponse.analyseNotifyDownloadStatus(notifyPayload);
                    key = notifyDownloadStatusData.key;
                    break;
                case HarmanOTA.AhaConnectSDK_Notify_downloadProgress:
                    var notifyDownloadProgressData = HarmanOTA.AnalyseAhaConnectSDKResponse.analyseNotifyDownloadProgress(notifyPayload);
                    key = notifyDownloadProgressData.key;
                    progress = notifyDownloadProgressData.progress;
                    if (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                        status = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress;
                    }
                    break;
            }

            if (key == null) {
                return;
            }

            if (HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted >= status) {
/* MOTA-125 18/09/10 start */
                this.updateButton(this.buttonType.cancel, true);

                var cancelFunc = function (eventObject) {
                    // DL中でない場合は処理を抜ける
                    if (_this.downloadingKeys.length == 0) {
                        return;
                    }
                    if ((status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) || (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadStateInvalid)) {
                        return;
                    }
                    // ダウンロードファイルの有無を設定
                    _this.setDownloaded(key, false);
                   // ダウンロード中のみキャンセル処理を実行
                    _this.startCancelDownloadProc();

                    _this.refreshPageState();
               };
                // イベントの設定
                var $circle = $("." + HarmanOTA.UI.ProgressCircle.BASE_CSS_CLASS);
                $circle.off("click");
                $circle.click(cancelFunc);
/* MOTA-125 18/09/10 end */
            } else {
                // エラーが発生した
                progress = undefined;
                this.updateButton(this.buttonType.download, true);
                this.transferringKeys.length = 0;
            }

            // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
            this.updateCategoryChangedDownloadStatus(key, status);

            if (progress != undefined) {
                this.updateDownloadProgressValue(key, progress);                
            }

            // ダウンロード中データ状況に応じて画面状態を更新する
            this.updateDownloadingKeys(key, status);
            this.refreshPageState(status);
        };

        /**
         * 更新データ一覧行のダウンロード状態を設定
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param value true:ダウンロードファイル有、false:ダウンロードファイル無
         */
        UpdatePageManager.prototype.setDownloaded = function (key, value) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    this.updateDataRows[i].isDownloaded = value;
                    return;
                }
            }
        };

        /**
         * 更新データ一覧行のダウンロード状態を設定
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param value true:ダウンロードファイル有、false:ダウンロードファイル無
         */
        UpdatePageManager.prototype.setTransferringAction = function (notifyPayload) {
            var status = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated;
            var key = null;
            var progress = undefined;
            switch (notifyPayload.notify) {
                case HarmanOTA.AhaConnectSDK_Notify_accessoryTransferStatus:
                    // 車載機転送ステータス
                    var notifyAccessoryTransferStatusData = HarmanOTA.AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferStatus(notifyPayload);
                    status = notifyAccessoryTransferStatusData.status;
                    key = notifyAccessoryTransferStatusData.key;

                    break;
                case HarmanOTA.AhaConnectSDK_Notify_accessoryTransferProgress:
                    // 車載機転送進捗率
                    var notifyAccessoryTransferProgressData = HarmanOTA.AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferProgress(notifyPayload);
                    status = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress;
                    key = notifyAccessoryTransferProgressData.key;

                    // 通知内容に該当する一覧行の進捗率表示を更新する
                    progress = notifyAccessoryTransferProgressData.progress;
                    if (progress < 25) {
                        // DL中 or 転送キャンセルが発生した

                        if (progress == 0) {
                            // 転送進捗0が通知され、かつ、DL中のリストが無い場合は、転送進捗がキャンセルされたとみなす
                            var $row = this.getUpdateDataRow(key);
                            progress = undefined;
                            HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
                            // name属性の削除
                            HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                            this.downloadingKeys.length = 0;
                            this.transferringKeys.length = 0;
                            this.refreshPageState();
                            key = null;
                        } else if (progress == 24) {
                            // 進捗24%の場合、accessoryFileTransferprogressの進捗率を 0%とみなす
                            status = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated;
                        } else {
                            // そうではない場合、進捗25未満はDL通知なので無視する
                            return;
                        }
                    }
                    break;
            }

            if (key == null) {
                return;
            }

            // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
            this.updateCategoryChangedAccessoryTransferStatus(key, status);

            if (progress != undefined) {
                this.updateTransferProgressValue(key, progress);
                if (progress >= 75) {
                    this.showInstallingIcon(key, progress);
                }
            }

            // 車載機転送中データ状況に応じて画面状態を更新する
            this.updateTransferringKeys(key, status);

            // 転送対象のデータをチェック
            // 転送は一度開始したら全て対象となる
            this.readTransferringKeys();
            this.downloadingKeys.length = 0;

            this.refreshPageState();
        };
        
        UpdatePageManager.prototype.reloadListPage = function () {
            var _this = this;
            // データ読み出し
            this.loadData().then(function () {
                this.transferringKeys.length = 0;
                // 一覧データ表示更新
                _this.updateDataList();
                // 画面状態の更新
                _this.refreshPageState();
            }, function (delegate) {
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
                    _this.genericError(false);
                }
            });
        };

        /**
         * AhaConnect SDK通知受信
         * @param 通知データ
         * @param 通知データ形式
         */
        UpdatePageManager.prototype.ahaConnectSDKNotify = function (notifyPayload, notifyContentType) {
            if (notifyContentType != HarmanOTA.AhaConnectSDK_JsonType) {
                return;
            }
            HarmanOTA.Common.log(UpdatePageManager.ModuleName, "ahaConnectSDKNotify response");
            HarmanOTA.Common.log(UpdatePageManager.ModuleName, "notifyContentType=" + notifyContentType);
            HarmanOTA.Common.log(UpdatePageManager.ModuleName, "notifyPayload=" + JSON.stringify(notifyPayload));
            if (notifyPayload.notify != undefined) {
                this.handleNotifyData(notifyPayload, notifyContentType);
            }
            else {
                this.handleResponse(notifyPayload, notifyContentType);
            }
//            // 該当データが0件のカテゴリは非表示にする
//            var totalSizes_regions = 0;
//            var totalSizes_download = 0;
//            for (var key in this.updateDatas) {
//                var datas = this.updateDatas[key];
//                for (var i = 0; i < datas.length; i++) {
//                    if( key == 1 ) {
//                        totalSizes_regions += datas[i].size;
//                    } else if ( key == 2 ) {
//                        totalSizes_download += datas[i].size;
//                    }
//                }
//            }
        };
        /**
         * 更新データ一覧行を取得
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @return 行オブジェクト（DOM要素のJQueryオブジェクト。見つからない場合はnullを返却。）
         */
        UpdatePageManager.prototype.getUpdateDataRow = function (key) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    return data.row;
                }
            }
            return null;
        };
        /**
         * 指定キーに該当する更新データ一覧行の進捗率を更新
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param progress 進捗率（0-100）
         */
        UpdatePageManager.prototype.updateDownloadProgressValue = function (key, progress) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                if (progress <= 99) {
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "progress": progress, "showprogress": true, "regionID" : key.regionID });
                } else {
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "progress": 0, "showprogress": false, "regionID" : key.regionID });
                }
            }
        };

        /**
         * 指定キーに該当する更新データ一覧行の進捗率を更新
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param progress 進捗率（0-100）
         */
        UpdatePageManager.prototype.updateTransferProgressValue = function (key, progress) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                var min = 25;
                var max = 74;
                progress = (progress - min) * ( 100 / (max - min) );
                if (progress < 0) {
                    progress = 0;
                } else if (100 < progress) {
                    progress = 100;
                }
                HarmanOTA.UI.UpdateList.setItemInfo($row, { "progress": progress, "showprogress": true, "regionID" : key.regionID });
            }
        };

        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（ダウンロードステータス通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        UpdatePageManager.prototype.updateCategoryChangedDownloadStatus = function (key, status) {
            var $row = this.getUpdateDataRow(key);
            if ($row == null) {
                return;
            }
            switch (status) {
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated:
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress:
                    // 進捗率を表示
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, HarmanOTA.UI.ProgressCircle.TARGET_NAME_DOWNLOAD);
                    HarmanOTA.UI.ProgressCircle.setProgressColor($row, HarmanOTA.UI.ProgressCircle.COLOR_DOWNLOAD_PROGRESS);
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": true, "progress": 0, "regionID" : key.regionID });
                    break;
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled:
                    this.fireCancelDownload();
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
                    // name属性の削除
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    this.downloadingKeys.length = 0;
                    break;
                case HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted :
                    var targetName = HarmanOTA.UI.ProgressCircle.getProgressName($row);
                    // ダウンロード中のみキャンセル処理を実行
                    if (targetName != HarmanOTA.UI.ProgressCircle.TARGET_NAME_TRANSFER) {
                        // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                        HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
                        // name属性の削除
                        HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    }
                    break;
                case HarmanOTA.AhaConnectSDK_DownloadStatus.SpaceNotAvailable :
                    // name属性の削除
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    this.downloadingKeys.length = 0;
                    HarmanOTA.UI.UpdateList.getItemIconRight($row).attr("src", HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]);
                             break;
                default:
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
                    // name属性の削除
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    this.downloadingKeys.length = 0;
                    HarmanOTA.UI.UpdateList.getItemIconRight($row).attr("src", HarmanOTA.UI.UpdateList.ICON_INFO.PATH[HarmanOTA.UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]);
                    break;
            }

            var categoryInfo = this.getCategoryInfoFromDownloadStatus(status);
            HarmanOTA.UI.UpdateList.setItemInfo($row, { "icon": categoryInfo.iconType, "category": categoryInfo.categoryID });
            // 保持データのカテゴリ変更
            this.updateCategory(key, status, null);

            if (status == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                // 該当データが0件のカテゴリは非表示にする
                var totalSizes_regions = 0;
                var totalSizes_download = 0;
                for (var key in this.updateDatas) {
                    var datas = this.updateDatas[key];
                    for (var i = 0; i < datas.length; i++) {
                        if( key == 1 ) {
                            totalSizes_regions += datas[i].size;
                        } else if ( key == 2 ) {
                            totalSizes_download += datas[i].size;
                        }
                    }
                }
                // ストレージ容量表示
                this.showStorageInfo(totalSizes_regions,totalSizes_download);
            }

        };

        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（車載機転送ステータス通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        UpdatePageManager.prototype.updateCategoryChangedAccessoryTransferStatus = function (key, status) {
            var $row = this.getUpdateDataRow(key);
            if ($row == null) {
                return;
            }
            switch (status) {
                case HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated:
                case HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress:
                    // 進捗率を表示
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, HarmanOTA.UI.ProgressCircle.TARGET_NAME_TRANSFER);
                    HarmanOTA.UI.ProgressCircle.setProgressColor($row, HarmanOTA.UI.ProgressCircle.COLOR_ACCESSORY_TRANSFER_PROGRESS);
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": true, "progress": 0, "regionID" : key.regionID });
                    break;
                case HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted:
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID": key.regionID, "size": { "label": "", "value": "" } });
                    // name属性の削除
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    break;
                default:
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    HarmanOTA.UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
                    // name属性の削除
                    HarmanOTA.UI.ProgressCircle.setProgressName($row, "");
                    break;
            }
            
            var categoryInfo = this.getCategoryInfoFromTransferStatus(status);
            HarmanOTA.UI.UpdateList.setItemInfo($row, { "icon": categoryInfo.iconType, "category": categoryInfo.categoryID });
            // 保持データのカテゴリ変更
            this.updateCategory(key, null, status);
        };
        
        /**
         * 車載機リージョン選択変更シミュレーション
         */
        UpdatePageManager.prototype.simulationChangedVehicleRegion = function () {
            var data = {
                "notify": "availableMapRegions",
                "data": [{}]
            };
            this.ahaConnectSDKNotify(JSON.stringify(data), HarmanOTA.AhaConnectSDK_JsonType);
        };
        
        UpdatePageManager.PagePath = "./huupd_list.html";
        UpdatePageManager.ModuleName = "HarmanOTA.UpdatePageManager";
        UpdatePageManager.STORAGE_BAR = "#storage_used";  //容量バー
        UpdatePageManager.REGION_TOTAL = "#region_total";  //容量バー（ダウンロードファイル合計）
        UpdatePageManager.STORAGE_FREE = "#storage_free";  //容量バー（空き容量）
        UpdatePageManager.REGION_TOTAL_VAL = "#storagebar_value";  //容量（ダウンロードファイル合計）

        return UpdatePageManager;
    })(PageManager);



    /**
     * 利用許諾ページ管理クラス
     */
    var LicensePageManager = (function (_super) {
        __extends(LicensePageManager, _super);
        function LicensePageManager() {
            _super.apply(this, arguments);
        }
    /**
         * 初期化処理
         */
        LicensePageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        /**
         * 画面初期化
         * @param language 言語コード
         */
        LicensePageManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // 文言取得
            this.texts = this.getPageText(language);
          
            // 画面項目設定
            _this.settingPageItem();
        };
        /**
         * 画面項目設定
         */
        LicensePageManager.prototype.settingPageItem = function () {

            //画像追加
            $("#image").empty();
            HarmanOTA.UI.Image.createImage($("#image"), Controller.LICENSE_PAGE_ID);
            
            //タイトル 
            var $copyright = $("#copyright");
            $copyright.empty();
            $copyright.text(this.texts.copyright);
            this.enabledRtl($copyright, this.isEnabledRtl, false); //TODO copyrightの多言語対応時、反転処理は必要？？
        };

        /**
         * 文言取得
         * @param language 言語コード
         */
        LicensePageManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "copyright", "id": "HTML_TXT_0195_", "language": language },
            ];
            return this.buildText(textsList);
        };

        LicensePageManager.PagePath = "./license.html";
        LicensePageManager.ModuleName = "HarmanOTA.LicensePageManager";
        return LicensePageManager;
    })(PageManager);

    // ---------------------------------------------------------------------------------------------------------
    // ページ読み込み完了時処理
    var initFunc = function () {
        console.log("[I][harman_ota_controller][initFunc] start");
        window.addEventListener('load', function () {
            console.log("[I][harman_ota_controller][initFunc][window.addEventListener] start");
            var $page = $("div:jqmData(role=page)");
            var pageID = $page.attr("id");
            console.log("[I][harman_ota_controller][initFunc][window.addEventListener] $page = "+$page);
            console.log("[I][harman_ota_controller][initFunc][window.addEventListener] pageID = "+pageID);
            if (pageID != 'configpage') {
                console.log("[I][harman_ota_controller][initFunc][window.addEventListener][init] start");
                init();
                console.log("[I][harman_ota_controller][initFunc][window.addEventListener][init] end");
            }
            initFunc = null;
            console.log("[I][harman_ota_controller][initFunc][window.addEventListener] end");
        });
        console.log("[I][harman_ota_controller][initFunc] end");
    };
    try {
        if (MOtaLoader != undefined) {
            console.log("[I][harman_ota_controller][MOtaLoader] start");
            $(function () {
                console.log("[I][harman_ota_controller][MOtaLoader][init] start");
                init();
                console.log("[I][harman_ota_controller][MOtaLoader][init] end");
            });
            console.log("[I][harman_ota_controller][MOtaLoader] end");
        } else {
            console.log("[I][harman_ota_controller][MOtaLoader][initFunc] start");
            initFunc();
            console.log("[I][harman_ota_controller][MOtaLoader][initFunc] end");
        }
    } catch (error) {
        console.log("[E][harman_ota_controller][MOtaLoader][initFunc] catch start");
        console.log("[E][harman_ota_controller][MOtaLoader][initFunc] error = "+error);
        initFunc();
        console.log("[E][harman_ota_controller][MOtaLoader][initFunc] catch end");
    }
    function init() {
        console.log("[I][harman_ota_controller][init] start");
        // MWSからドメインとポートを取得する
        mwsRequestManager.initialize(function () {
            console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize] start");
            // config.jsの初期化
            mwsDomainWithPort = mwsRequestManager.getMWSUrl();
            var controller = Controller.getInstance();
            console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize] mwsDomainWithPort : = "+mwsDomainWithPort);
            // config.jsの処理を使用して言語コードを取得する
            initHarmanOTA(function (language) {
                console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize][initHarmanOTA] start");
                console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize][initHarmanOTA] language ="+language);
                controller.initPage(language);
            });
            
            if (getMemoryAppInfo() == null) {
                getAppInfo().then(function () {
                    // success
                    console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize][getAppInfo] success");
                }, function () {
                    // error
                    controller.currentPageManager.genericError(true);
                    console.log("[E][harman_ota_controller][init][mwsRequestManager.initialize][getAppInfo] error");
                });
            }
            console.log("[I][harman_ota_controller][init][mwsRequestManager.initialize] end");
        });
    };
    console.log("[I][harman_ota_controller][init] end");
})(HarmanOTA || (HarmanOTA = {}));
//# sourceMappingURL=harman_ota_controller.js.map
