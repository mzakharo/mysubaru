/// <reference path="jquery.d.ts" />
/// <reference path="config.d.ts" />

/**
 * Harman OTA モジュール
 * （本モジュールの動作にはjQueryと「config.js」が必要です。）
 */
module HarmanOTA {
    export class Controller {
        private static instance: Controller = null;
        private static SETTING_PAGE_ID: string = "huupd_settings";
        private static UPDATE_PAGE_ID: string = "huupd_list";

        /**
         * インスタンス取得（シングルトン）
         * @returns インスタンス
         */
        public static getInstance(): Controller {
            if (Controller.instance == null) {
                Controller.instance = new Controller();
            }
            return Controller.instance;
        }

        /**
         * コンストラクタ
         */
        constructor() {
            this.initialize();
        }

        /**
         * 初期化処理
         */
        private initialize() {
        }

        /**
         * 画面初期化
         * @param language 言語コード
         */
        public initPage(language: string) {
            var $page = $("div:jqmData(role=page)");
            var pageID: string = $page.attr("id");
            var pageManager: PageManager = null;

            switch (pageID) {
                case Controller.SETTING_PAGE_ID:
                    // 設定画面
                    pageManager = new SettingPageManager();
                    break;
                case Controller.UPDATE_PAGE_ID:
                    // 更新データ一覧画面
                    pageManager = new UpdatePageManager();
                    break;
                default:
                    break;
            }

            if (pageManager != null) {
                // 画面初期設定
                pageManager.initPage(language);
            }
        }
    }

    /**
     * ページ管理基底クラス
     */
    class PageManager {
        protected static RootPagePath: string = "./index.html";
        public static PagePath: string = "";
        protected ahaConnectSDKSettings: AhaConnectSDKSettings;
        protected ahaConnectSDKController: AhaConnectSDKController;
        protected word: Word;
        protected isEnabledRtl: boolean;
        private baseTexts: any;

        /**
         * コンストラクタ
         */
        constructor() {
            this.initialize();
        }

        /**
         * 初期化処理
         */
        protected initialize() {
            this.ahaConnectSDKSettings = new AhaConnectSDKSettings();
            this.ahaConnectSDKController = new AhaConnectSDKController();
            this.word = new Word();
            this.baseTexts = null;
            this.isEnabledRtl = false;
        }

        /**
         * 画面初期化
         * @param language 言語コード
         */
        public initPage(language: string) {
            this.isEnabledRtl = this.judgeEnabledRtl(language);
            this.baseTexts = this.getBasePageText(language);
            this.setBasePageItem();
        }

        /**
         * 画面項目設定
         */
        private setBasePageItem() {
            var $backButton: JQuery = $("#Car_TXT_0056_3");
            $backButton.text(this.baseTexts.back);
            this.enabledRtl($backButton, this.isEnabledRtl, false);
        }

        /**
         * 文言取得
         * @param language 言語コード
         */
        private getBasePageText(language: string): any {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }

            var texts = {
                "nodata": this.word["SL_TXT_0208_" + language],
                "expired": this.word["SL_TXT_0209_" + language],
                "genericerror": this.word["TXT_YELP_0029_" + language],
                "back": this.word["CONFIG_001_" + language]
            };

            return texts;
        }

        /**
         * RTLが有効な言語かを判断する
         * @param language 言語コード
         */
        protected judgeEnabledRtl(language): boolean {
            return Common.judgeEnabledRtl(language);
        }

        /**
         * RTLの有効/無効を設定する
         * @param $target 対象DOM要素（JQueryオブジェクト）
         * @param enabled 有効/無効
         */
        protected enabledRtl($target: JQuery, enabled: boolean, alignRight: boolean) {
            Common.enabledRtl($target, enabled, alignRight);
        }

        /**
         * ルートページ（config画面）へ遷移
         * （コンテンツ側で予期せぬエラーが発生した場合に使用）
         */
        protected backToRootPage() {
            Common.transitionPage(PageManager.RootPagePath);
        }

        /**
         * 予期せぬエラー発生時処理
         */
        protected unexpectedError() {
            // ルートページ（config画面）へ遷移
            this.backToRootPage();
        }

        /**
         * 有効期限切れ時の処理
         */
        protected expiredSubscription() {
            // UI.Alert.alert(this.baseTexts.expired);
            if (UI.Alert.confirmAlert(this.baseTexts.expired)) {
                // 外部ブラウザで説明ページへ遷移
                // TODO:遷移先URLが未定
                CommonHTMLSDK.getInstance().openlink_exbrowser("https://www.subaru-maps.com");
            }
            var inst = this;
            setTimeout(function () {
                // ルートページへ戻る
                inst.backToRootPage();
                inst = null;
            }, 1);
        }

        /**
         * 地図データが存在しない時の処理
         */
        protected noMapData() {
            UI.Alert.alert(this.baseTexts.nodata);
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
        }

        /**
         * 汎用エラー
         * @param backToRootPage アラート出力後にルートページへ遷移するか
         */
        protected genericError(backToRootPage: boolean) {
            // アラート出力
            UI.Alert.alert(this.baseTexts.genericerror);

            if (backToRootPage) {
                // ルートページへ戻る
                this.backToRootPage();
            }
        }
    }

    /**
     * 設定ページ管理クラス
     */
    class SettingPageManager extends PageManager {
        public static PagePath: string = "./huupd_settings.html";
        private static ModuleName: string = "HarmanOTA.SettingPageManager";
        private static AlertDelay: number = 300;

        private $autoUpdateRow: JQuery;
        private $mobileDataRow: JQuery;
        private $updateRow: JQuery;
        private isAutoUpdate: boolean;
        private isMobileData: boolean;
        private deviceCode: string;
        private productCode: string;
        private texts: any;

        /**
         * 初期化処理
         */
        protected initialize() {
            super.initialize();

            this.$autoUpdateRow = null;
            this.$mobileDataRow = null;
            this.$updateRow = null;
            this.isAutoUpdate = false;
            this.isMobileData = false;
            this.deviceCode = null;
            this.productCode = null;
            this.texts = null;
        }

        /**
         * 画面初期化
         * @param language 言語コード
         */
        public initPage(language: string) {
            super.initPage(language);

            // 文言取得
            this.texts = this.getPageText(language);

            // 設定読み出し
            this.loadSettingData(() => {
                // 画面項目設定
                this.settingPageItem();
            });
        }

        /**
         * 画面項目設定
         */
        private settingPageItem() {
            // // タイトル設定
            // var $title = $("#settingsPageTitle");
            // $title.text(this.texts.title);
            // this.enabledRtl($title, this.isEnabledRtl, false);

            // 設定項目一覧UIを生成
            var $settingList: JQuery = $("#setting_list");
            UI.SettingList.create($settingList);
            // 設定項目一覧UIの行を生成
            this.$autoUpdateRow = UI.SettingList.addItem($settingList);
            this.$mobileDataRow = UI.SettingList.addItem($settingList);
            this.$updateRow = UI.SettingList.addItem($settingList);
            // 設定項目一覧UIの設定
            UI.SettingList.setItemInfo(this.$autoUpdateRow, { label: this.texts.autoupdate, status: this.isAutoUpdate, rtl: this.isEnabledRtl });
            UI.SettingList.setItemInfo(this.$mobileDataRow, { label: this.texts.mobiledata, status: this.isMobileData, rtl: this.isEnabledRtl });
            UI.SettingList.setItemInfo(this.$updateRow, { label: this.texts.update, showbutton: false, rtl: this.isEnabledRtl });
            // 設定項目一覧のイベント設定
            UI.SettingList.setButtonStatusChangedCallback(this.$autoUpdateRow, ($target: JQuery, isOn: boolean) => {
                var instance: SettingPageManager = this;

                // 設定保存、AhaConnect SDKへの反映
                this.saveSettingData(function () {
                    instance.applySettingAhaConnectSDK(null);
                });

                // OFF -> ON の場合、説明アラート表示
                if (isOn) {
                    setTimeout(function () {
                        UI.Alert.alert(instance.texts.changedautoupdate);
                    }, SettingPageManager.AlertDelay);
                }
            });
            UI.SettingList.setButtonStatusChangedCallback(this.$mobileDataRow, ($target: JQuery, isOn: boolean) => {
                // 設定保存
                this.saveSettingData(null);
                var instance: SettingPageManager = this;

                // OFF -> ON の場合、説明アラート表示
                if (isOn) {
                    setTimeout(function () {
                        UI.Alert.alert(instance.texts.changedmobiledata);
                    }, SettingPageManager.AlertDelay);
                }
            });
            this.$updateRow.click((eventObject: JQueryEventObject): any => {
                // Updates行タップ時
                this.gotoUpdatesListPage();
            });
        }

        /**
         * 文言取得
         * @param language 言語コード
         */
        private getPageText(language: string): any {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }

            var texts = {
                "title": this.word["SL_TXT_0196_" + language],
                "autoupdate": this.word["SL_TXT_0197_" + language],
                "mobiledata": this.word["SL_TXT_0198_" + language],
                "update": this.word["SL_TXT_0199_" + language],
                "changedautoupdate": this.word["SL_TXT_0213_" + language],
                "changedmobiledata": this.word["SL_TXT_0212_" + language],
            };

            return texts;
        }

        /**
         * 設定を読み込む
         * @param callback コールバック
         */
        private loadSettingData(callback: () => void) {
            this.ahaConnectSDKSettings.readSettings((result: boolean) => {
                if (result) {
                    this.isAutoUpdate = this.ahaConnectSDKSettings.autoUpdate;
                    this.isMobileData = this.ahaConnectSDKSettings.mobileData;
                    this.deviceCode = this.ahaConnectSDKSettings.deviceCode;
                    this.productCode = this.ahaConnectSDKSettings.productCode;
                } else {
                    Common.log(SettingPageManager.ModuleName, "fail loadSettingData");

                    // 汎用エラー
                    this.genericError(true);
                    return;
                }

                if (callback != null) {
                    callback();
                }
            });
        }

        /**
         * 設定を保存する
         * @param callback コールバック
         */
        private saveSettingData(callback: () => void) {
            // 画面上の設定状態を取得
            var autoUpdateInfo: any = UI.SettingList.getItemInfo(this.$autoUpdateRow);
            var mobileDataInfo: any = UI.SettingList.getItemInfo(this.$mobileDataRow);

            // AhaConnect SDK設定管理クラスへ設定状態を反映
            this.ahaConnectSDKSettings.autoUpdate = autoUpdateInfo.status;
            this.ahaConnectSDKSettings.mobileData = mobileDataInfo.status;

            // 設定を書き込む
            this.ahaConnectSDKSettings.writeSettings((result: boolean) => {
                if (!result) {
                    Common.log(SettingPageManager.ModuleName, "fail writeSettings");

                    // 汎用エラー
                    this.genericError(false);
                    return;
                }

                if (callback != null) {
                    callback();
                }
            });
        }

        /**
         * AhaConnect SDKへ設定を反映する
         * @param callback コールバック
         */
        private applySettingAhaConnectSDK(callback: () => void) {
            // 画面上の設定状態を取得
            var autoUpdateInfo: any = UI.SettingList.getItemInfo(this.$autoUpdateRow);
            // AhaConnect SDK設定管理クラスへ設定状態を反映
            this.ahaConnectSDKSettings.autoUpdate = autoUpdateInfo.status;

            // AhaConnect SDKへ設定を反映する
            this.ahaConnectSDKSettings.applySettings((result: boolean) => {
                if (!result) {
                    Common.log(SettingPageManager.ModuleName, "fail applySettingAhaConnectSDK");

                    // 汎用エラー
                    this.genericError(false);
                    return;
                }

                if (callback != null) {
                    callback();
                }
            });
        }

        /**
         * 更新データ一覧画面へ遷移
         */
        private gotoUpdatesListPage() {
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
        }
    }

    /**
     * 更新データ一覧ページ管理クラス
     */
    class UpdatePageManager extends PageManager {
        public static PagePath: string = "./huupd_list.html";
        private static ModuleName: string = "HarmanOTA.UpdatePageManager";

        private CategoryIds: { [key: number]: string; };
        private texts: any;
        private updateDatas: any;
        private $updateList: JQuery;
        private $categoryItems: { [key: number]: JQuery };
        private $downloadButton: JQuery;
        private deviceCode: string;
        private productCode: string;
        private simDownloadTimer: number;
        private simTransferTimer: number;
        private updateDataRows: Array<any>;
        private downloadingKeys: Array<any>;
        private transferringKeys: Array<any>;

        /**
         * 初期化処理
         */
        protected initialize() {
            super.initialize();

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
            this.CategoryIds = new Array();
            this.simDownloadTimer = -1;
            this.simTransferTimer = -1;
            this.CategoryIds[MAP_DATA_CATEGORY.NOT_DOWNLOAD] = "notdownload";
            this.CategoryIds[MAP_DATA_CATEGORY.NOT_UPDATE] = "notupdate";
            this.CategoryIds[MAP_DATA_CATEGORY.UPDATED] = "updated";
        }

        /**
         * 画面初期化
         * @param language 言語コード
         */
        public initPage(language: string) {
            super.initPage(language);

            // ローディング表示
            $.mobile.showPageLoadingMsg();

            // 文言取得
            this.texts = this.getPageText(language);

            // // タイトル設定
            // var $title = $("#updatePageTitle");
            // $title.text(this.texts.title);
            // this.enabledRtl($title, this.isEnabledRtl, false);

            this.loadData()        // データ読み出し
                .then(() => {
                    // 画面項目設定
                    this.settingPageItem();
                    // 画面状態の更新
                    this.refreshPageState();

                    // デバッグフラグONの場合
                    if (isDebug) {
                        // // 車載機リージョン選択変更シミュレーション
                        // setInterval(()=>{
                        //     this.simulationChangedVehicleRegion();
                        // }, 10*1000);
                    }

                    // ローディング非表示
                    $.mobile.hidePageLoadingMsg();
                    this.settingAhaConnectSDK(); // AhaConnect SDK関連設定
                }, (delegate) => {
                    // ローディング非表示
                    $.mobile.hidePageLoadingMsg();
                    if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                        delegate.delegateErrorHandle();
                    } else {
                        // 汎用エラー
                        this.genericError(true);
                    }
                });
        }

        /**
         * 画面項目設定
         */
        private settingPageItem() {

            // ダウンロードボタンを生成
            this.$downloadButton = $("#button_alldownload");
            UI.PageBottomButton.create(this.$downloadButton);
            UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.alldownload);
            UI.PageBottomButton.setEnabledRtl(this.$downloadButton, this.isEnabledRtl);
            // ダウンロードボタンのイベント設定
            UI.PageBottomButton.setClickedCallback(this.$downloadButton, ($target: JQuery) => {
                // ボタンハッチング
                UI.PageBottomButton.setEnabled(this.$downloadButton, false);

                // iOSの場合、暫定のアラートを表示する
                if ((JSON.parse(getMemoryAppInfo())).os == 'ios') {
                    UI.Alert.alert(this.texts.cautionDownloadAll);
                }

                // ダウンロードキューを登録する
                this.downloadAllData((result: boolean) => {
                    // 失敗
                    if (!result) {
                        // ボタンハッチング解除
                        UI.PageBottomButton.setEnabled(this.$downloadButton, true);
                        // 汎用エラー
                        this.genericError(false);
                    }

                    // デバッグフラグONの場合
                    if (isDebug) {
                        // ダウンロードシミュレーションを開始
                        this.simulationDownload();
                    }
                });
            });

            // 更新データ一覧UIを更新
            this.updateDataList();
        }

        /**
         * 更新データ一覧を更新（再生成）
         */
        private updateDataList() {
            // クリア
            this.updateDataRows.length = 0;
            this.$updateList = $("#update_list");
            this.$updateList.empty();
            // 更新データ一覧UIを生成
            UI.UpdateList.create(this.$updateList);
            for (var key in this.updateDatas) {
                // カテゴリ生成
                this.$categoryItems[key] = UI.UpdateList.addCategory(this.$updateList, this.CategoryIds[key]);
                UI.UpdateList.setCategoryInfo(this.$categoryItems[key], {
                    "label": this.texts.categories[key],
                    "show": this.updateDatas[key].length > 0,
                    "rtl": this.isEnabledRtl
                });

                // カテゴリ別設定
                var isShowFromVersion: boolean = false;
                var isShowSize: boolean = false;
                var isDownloadProgress: boolean = false;
                var isVehicleProgress: boolean = false;
                var iconType: UI.MAP_DATA_ICON_TYPE = UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                switch (+key) {
                    case MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        isShowFromVersion = false;
                        isShowSize = true;
                        isDownloadProgress = true;
                        isVehicleProgress = false;
                        iconType = UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                        break;
                    case MAP_DATA_CATEGORY.NOT_UPDATE:
                        isShowFromVersion = false;
                        isShowSize = true;
                        isDownloadProgress = false;
                        isVehicleProgress = true;
                        iconType = UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
                        break;
                    case MAP_DATA_CATEGORY.UPDATED:
                        isShowFromVersion = true;
                        isShowSize = false;
                        isDownloadProgress = false;
                        isVehicleProgress = false;
                        iconType = UI.MAP_DATA_ICON_TYPE.UPDATED;
                        break;
                    default:
                        break;
                }

                // 行生成
                for (var i: number = 0; i < this.updateDatas[key].length; i++) {
                    var data = this.updateDatas[key][i];
                    var $row: JQuery = UI.UpdateList.addItem(this.$updateList, this.CategoryIds[key]);

                    // プログレス表示判断
                    var isShowProgress = false;
                    if (isDownloadProgress) {
                        isShowProgress = this.judgeShowDownloadProgress(data.downloadStatus);
                    } else if (isVehicleProgress) {
                        isShowProgress = this.judgeShowVehicleDownloadProgress(data.accessoryTransferStatus);
                    }

                    UI.UpdateList.setItemInfo($row, {
                        "title": {
                            "label": this.texts.map,
                            "value": data.name
                        },
                        "version": {
                            "label": this.texts.version,
                            "value": Common.formatVersion(isShowFromVersion ? data.fromVersion : data.toVersion)
                        },
                        "size": {
                            "label": isShowSize ? this.texts.size : "",
                            "value": isShowSize ? Common.formatDataSize(data.size) : ""
                        },
                        "icon": iconType,
                        "progress": 0,
                        "showprogress": isShowProgress,
                        "rtl": this.isEnabledRtl
                    });

                    this.updateDataRows.push({
                        "key": data.key,
                        "row": $row
                    });
                }
            }
        }

        /**
         * ダウンロード中データキーリストに指定キーを追加する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        private addDownloadingKeys(key: any) {
            for (var i: number = 0; i < this.downloadingKeys.length; i++) {
                if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, this.downloadingKeys[i])) {
                    return;
                }
            }
            this.downloadingKeys.push(key);
        }

        /**
         * ダウンロード中データキーリストから指定キーを削除する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        private removeDownloadingKeys(key: any) {
            this.downloadingKeys.some((value: any, index: number, array: any[]) => {
                if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, value)) {
                    this.downloadingKeys.splice(index, 1);
                    return true;
                }
                return false;
            });
        }

        /**
         * 車載機転送中データキーリストに指定キーを追加する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        private addTransferringKeys(key: any) {
            for (var i: number = 0; i < this.transferringKeys.length; i++) {
                if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, this.transferringKeys[i])) {
                    return;
                }
            }
            this.transferringKeys.push(key);
        }

        /**
         * 車載機転送中データキーリストから指定キーを削除する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         */
        private removeTransferringKeys(key: any) {
            this.transferringKeys.some((value: any, index: number, array: any[]) => {
                if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, value)) {
                    this.transferringKeys.splice(index, 1);
                    return true;
                }
                return false;
            });
        }

        /**
         * ページ状態の更新（ボタンのハッチング状態など）
         */
        private refreshPageState() {
            // ダウンロード中データがある or 車載機転送中データがある or ダウンロード可能データが存在しない 場合はダウンロードボタンをハッチング
            var isExistsDownloadTarget: boolean = (this.updateDatas[MAP_DATA_CATEGORY.NOT_DOWNLOAD].length > 0);
            var isNoDownlodingData: boolean = (this.downloadingKeys.length == 0);
            var isNoTransferringData: boolean = (this.transferringKeys.length == 0);
            UI.PageBottomButton.setEnabled(this.$downloadButton, isExistsDownloadTarget && isNoDownlodingData && isNoTransferringData);

            // 該当データが0件のカテゴリは非表示にする
            for (var key in this.updateDatas) {
                var $categoryItem: JQuery = this.$categoryItems[key];
                UI.UpdateList.setCategoryInfo($categoryItem, {
                    "show": this.updateDatas[key].length > 0
                });
            }
        }

        /**
         * ダウンロードプログレス表示対象ステータスかを判断
         * @param 判断結果（true:表示対象、false:表示対象ではない）
         */
        private judgeShowDownloadProgress(status: AhaConnectSDK_DownloadStatus): boolean {
            return (status == AhaConnectSDK_DownloadStatus.DownloadInitiated) ||
                (status == AhaConnectSDK_DownloadStatus.DownloadInProgress);
        }

        /**
         * 車載機転送プログレス表示対象ステータスかを判断
         * @param 判断結果（true:表示対象、false:表示対象ではない）
         */
        private judgeShowVehicleDownloadProgress(status: AhaConnectSDK_AccessoryTransferStatus): boolean {
            return (status == AhaConnectSDK_AccessoryTransferStatus.TransferInitiated) ||
                (status == AhaConnectSDK_AccessoryTransferStatus.TransferInProgress);
        }

        /**
         * 文言取得
         * @param language 言語コード
         */
        private getPageText(language: string): any {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }

            var texts = {
                "title": this.word["SL_TXT_0199_" + language],
                "categories": {},
                "map": this.word["SL_TXT_0204_" + language],
                "version": this.word["SL_TXT_0205_" + language],
                "size": this.word["OTHER_SIZE_0001_" + language],
                "alldownload": this.word["SL_TXT_0200_" + language],
                "cautionDownloadAll" : ""
            };
            eval(this.word.createWordingToEval("texts.cautionDownloadAll", "this.word", "TMP_TXT_001_", language));
            texts.categories[MAP_DATA_CATEGORY.NOT_DOWNLOAD] = this.word["SL_TXT_0202_" + language];
            texts.categories[MAP_DATA_CATEGORY.NOT_UPDATE] = this.word["SL_TXT_0201_" + language];
            texts.categories[MAP_DATA_CATEGORY.UPDATED] = this.word["SL_TXT_0203_" + language];

            return texts;
        }

        private buildListLayout(deferred: JQueryDeferred<void>, data: any): void {
            Common.log(UpdatePageManager.ModuleName, "retrieveAvailableMapRegions -> build");

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
                        inst.expiredSubscription();
                        inst = null;
                    };
                }
                deferred.rejectWith(this, [delegate]);
                return;
            }

            // データ解析（表示用データに変換）
            this.updateDatas = AnalyseAhaConnectSDKResponse.analyseUpdateListData(data);
            if (this.updateDatas == null) {
                Common.log(UpdatePageManager.ModuleName, "retrieveAvailableMapRegions -> build reject.");
                Common.log(UpdatePageManager.ModuleName, "data : " + JSON.stringify(data));
                deferred.rejectWith(this);
                return;
            }

            // ダウンロード中データ、車載機転送中データのキーリストを生成
            this.downloadingKeys.length = 0;
            for (var key in this.updateDatas) {
                var datas: any = this.updateDatas[key];
                for (var i: number = 0; i < datas.length; i++) {

                    // 有効期限チェック
                    if (datas[i].downloadStatus == AhaConnectSDK_DownloadStatus.DownloadFailSubscriptionInvalid) {
                        var inst = this;
                        var delegate = {
                            delegateErrorHandle: function () {
                                // 有効期限切れ
                                inst.expiredSubscription();
                                inst = null;
                            }
                        };
                        deferred.rejectWith(this, [delegate]);
                        return;
                    }

                    // ダウンロード中データ
                    if (AnalyseAhaConnectSDKResponse.judgeDownloadingStatus(datas[i].downloadStatus)) {
                        this.downloadingKeys.push(datas[i].key);
                    }

                    // 車載機転送中データ
                    if (AnalyseAhaConnectSDKResponse.judgeTransferringStatus(datas[i].accessoryTransferStatus)) {
                        this.transferringKeys.push(datas[i].key);
                    }
                }
            }

            deferred.resolveWith(this);
        }

        private handleNoMapAfterRetrieve(deferred: JQueryDeferred<void>) {
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

        /**
         * データ読み込み
         * @return jQuery Deferredオブジェクト
         */
        private loadData(): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();

            // 設定読み込み
            this.ahaConnectSDKSettings.readSettings((result: boolean) => {
                if (result) {
                    this.deviceCode = this.ahaConnectSDKSettings.deviceCode;
                    this.productCode = this.ahaConnectSDKSettings.productCode;
                } else {
                    Common.log(UpdatePageManager.ModuleName, "fail loadData readSettings");
                    deferred.rejectWith(this);
                    return;
                }

                // 更新可能地図データ情報取得
                this.ahaConnectSDKController.retrieveAvailableMapRegions((data: any, result: boolean) => {
                    if (!result) {
                        deferred.rejectWith(this);
                        return;
                    }

                    // データの存在チェック
                    if (!AnalyseAhaConnectSDKResponse.analyseExistsData(data)) {
                        // 地図データが存在しない時の処理
                        this.handleNoMapAfterRetrieve(deferred);
                        return;
                    }

                    // deviceCode, productCodeをチェックし、現在接続している車載の情報と不一致ならば失敗させる
                    var targetIndex = -1;
                    var removeDetas: Array<any> = new Array();
                    // var debug = false;
                    // if (debug) {
                    //     var dummy = {
                    //         'deviceCode': 12345,
                    //         'productCode': 12345,
                    //     };
                    //     data.data.push(dummy);
                    // }
                    for (var dataIndex: number = 0; dataIndex < data.data.length; dataIndex++) {
                        var deviceCode = data.data[dataIndex].deviceCode;
                        var productCode = data.data[dataIndex].productCode;
                        var target = { 'deviceCode': null, 'productCode': null };

                        if (this.ahaConnectSDKSettings.deviceCode != deviceCode) {
                            target.deviceCode = deviceCode;
                        }
                        if (this.ahaConnectSDKSettings.productCode != productCode) {
                            target.productCode = productCode;
                        }
                        if (target.deviceCode != null || target.productCode != null) {
                            target.deviceCode = deviceCode;
                            target.productCode = productCode;
                            removeDetas.push(target);
                        } else {
                            targetIndex = dataIndex;
                        }
                    }

                    // データの存在チェック
                    if (targetIndex == -1) {
                        if (removeDetas.length > 0) {
                            this.ahaConnectSDKController.removeDevices(removeDetas, (removeDevicesData: any, result: boolean) => {
                                // 地図データが存在しない時の処理
                                this.handleNoMapAfterRetrieve(deferred);
                            });
                        } else {
                            // 地図データが存在しない時の処理
                            this.handleNoMapAfterRetrieve(deferred);
                        }
                        return;
                    }

                    data.data = [data.data[targetIndex]];

                    if (removeDetas.length > 0) {
                        this.ahaConnectSDKController.removeDevices(removeDetas, (removeDevicesData: any, result: boolean) => {
                            this.buildListLayout(deferred, data);
                        });
                    } else {
                        this.buildListLayout(deferred, data);
                    }
                });
            });

            return deferred.promise();
        }

        /**
         * AhaConnect SDK関連設定
         * @return jQuery Deferredオブジェクト
         */
        private settingAhaConnectSDK(): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();

            // AhaConnect SDKの通知受信設定
            AhaConnectHTMLSDK.getInstance().addNotifyData(this.ahaConnectSDKNotify, this, (result: boolean) => {
                if (result) {
                    deferred.resolveWith(this);
                } else {
                    deferred.rejectWith(this);
                }
            });

            return deferred.promise();
        }

        private handleNotifyData(notifyPayload: any, notifyContentType: string) {
            switch (notifyPayload.notify) {
                case AhaConnectSDK_Notify_downloadStatus:
                    // ダウンロードステータス

                    // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
                    var notifyDownloadStatusData: any = AnalyseAhaConnectSDKResponse.analyseNotifyDownloadStatus(notifyPayload);
                    this.updateCategoryChangedDownloadStatus(notifyDownloadStatusData.key, notifyDownloadStatusData.status);

                    // ダウンロード中データ状況に応じて画面状態を更新する
                    this.updateDownloadingKeys(notifyDownloadStatusData.key, notifyDownloadStatusData.status);
                    this.refreshPageState();
                    var isExistsDownloadTarget: boolean = (this.updateDatas[MAP_DATA_CATEGORY.NOT_DOWNLOAD].length > 0);
                    var isExistsDownloadTarget: boolean = (this.updateDatas[MAP_DATA_CATEGORY.NOT_DOWNLOAD].length > 0);
                    var isNoDownlodingData: boolean = (this.downloadingKeys.length == 0);
                    var isNoTransferringData: boolean = (this.transferringKeys.length == 0);
                    var enable = false;
                    if (isExistsDownloadTarget) {
                        enable = true;
                        // DL実行中データが存在する
                        switch (notifyDownloadStatusData.status) {
                            case AhaConnectSDK_DownloadStatus.DownloadInitiated:
                            case AhaConnectSDK_DownloadStatus.DownloadInProgress:
                            case AhaConnectSDK_DownloadStatus.DownloadCompleted:
                                // DL継続するので、ボタンはハッチングしたままとする
                                enable = false;
                                break;
                        }
                    } else {
                        // DL対象のデータはない
                        enable = !isNoDownlodingData;
                    }
                    UI.PageBottomButton.setEnabled(this.$downloadButton, enable);
                    break;

                case AhaConnectSDK_Notify_downloadProgress:
                    // ダウンロード進捗率

                    // 通知内容に該当する一覧行の進捗率表示を更新する
                    var notifyDownloadProgressData: any = AnalyseAhaConnectSDKResponse.analyseNotifyDownloadProgress(notifyPayload);
                    this.updateProgressValue(notifyDownloadProgressData.key, notifyDownloadProgressData.progress);
                    // AutoDLの場合、いきなりプログレス通知がくる場合がある
                    UI.PageBottomButton.setEnabled(this.$downloadButton, false);
                    break;

                case AhaConnectSDK_Notify_accessoryTransferStatus:
                    // 車載機転送ステータス

                    // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
                    var notifyAccessoryTransferStatusData: any = AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferStatus(notifyPayload);
                    this.updateCategoryChangedAccessoryTransferStatus(notifyAccessoryTransferStatusData.key, notifyAccessoryTransferStatusData.status);

                    // 車載機転送中データ状況に応じて画面状態を更新する
                    this.updateTransferringKeys(notifyAccessoryTransferStatusData.key, notifyAccessoryTransferStatusData.status);
                    this.refreshPageState();
                    break;

                case AhaConnectSDK_Notify_accessoryTransferProgress:
                    // 車載機転送進捗率

                    // 通史内容に該当する一覧行の進捗率表示を更新する
                    var notifyAccessoryTransferProgressData: any = AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferProgress(notifyPayload);
                    this.updateProgressValue(notifyAccessoryTransferProgressData.key, notifyAccessoryTransferProgressData.progress);
                    // AutoDLの場合、いきなりプログレス通知がくる場合がある
                    UI.PageBottomButton.setEnabled(this.$downloadButton, false);
                    break;

                case AhaConnectSDK_Notify_availableMapRegions:
                    // 車載機リージョン変更
                    this.reloadListPage();
                    break;

                default:
                    break;
            }
        }

        private reloadListPage() {
            // データ読み出し
            this.loadData().then(() => {
                // 一覧データ表示更新
                this.updateDataList();
                // 画面状態の更新
                this.refreshPageState();
            }, (delegate) => {
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                } else {
                    // 汎用エラー
                    this.genericError(false);
                }
            });
        }

        private handleResponse(responsePayload: any, notifyContentType: string) {
            var errorCode = responsePayload.errorCode;  // IF ver 1.1.5以下
            if (errorCode == undefined) {
                // IF ver 1.1.6以上
                errorCode = responsePayload.data[0].errorCode;
            }
            if (errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_NetworkFailure) {
                // 画面状態の更新
                this.downloadingKeys.length = 0;
                this.refreshPageState();
            } else {
                // 画面をリロードする
                this.reloadListPage();
                // location.href = 'huupd_list.html';
            }
        }

        /**
         * AhaConnect SDK通知受信
         * @param 通知データ
         * @param 通知データ形式
         */
        private ahaConnectSDKNotify(notifyPayload: any, notifyContentType: string) {
            if (notifyContentType != AhaConnectSDK_JsonType) {
                return;
            }

            Common.log(UpdatePageManager.ModuleName, "ahaConnectSDKNotify response");
            Common.log(UpdatePageManager.ModuleName, "notifyContentType=" + notifyContentType);
            Common.log(UpdatePageManager.ModuleName, "notifyPayload=" + JSON.stringify(notifyPayload));

            if (notifyPayload.notify != undefined) {
                this.handleNotifyData(notifyPayload, notifyContentType);
            } else {
                this.handleResponse(notifyPayload, notifyContentType);
            }
        }

        /**
         * 更新データ一覧行を取得
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @return 行オブジェクト（DOM要素のJQueryオブジェクト。見つからない場合はnullを返却。）
         */
        private getUpdateDataRow(key: any): JQuery {
            for (var i: number = 0; i < this.updateDataRows.length; i++) {
                var data: any = this.updateDataRows[i];
                if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    return data.row;
                }
            }
            return null;
        }

        /**
         * 更新データ一覧行の進捗率を設定
         * @param $row 行オブジェクト（DOM要素のJQueryオブジェクト）
         * @param progress 進捗率（0-100）
         */
        private setUpdateDataProgressValue($row: JQuery, progress: number) {
            UI.UpdateList.setItemInfo($row, { "progress": progress, "showprogress": true });
        }

        /**
         * 指定キーに該当する更新データ一覧行の進捗率を更新
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param progress 進捗率（0-100）
         */
        private updateProgressValue(key: any, progress: number) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                this.setUpdateDataProgressValue($row, progress);
            }
        }

        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（ダウンロードステータス通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        private updateCategoryChangedDownloadStatus(key: any, status: AhaConnectSDK_DownloadStatus) {
            var $row = this.getUpdateDataRow(key);
            if ($row == null) {
                return;
            }

            switch (status) {
                case AhaConnectSDK_DownloadStatus.DownloadInitiated:
                case AhaConnectSDK_DownloadStatus.DownloadInProgress:
                    // 進捗率を表示
                    UI.UpdateList.setItemInfo($row, { "showprogress": true, "progress": 0 });
                    break;
                default:
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0 });
                    break;
            }

            var categoryID: string;
            var iconType: UI.MAP_DATA_ICON_TYPE;
            var targetCategory: MAP_DATA_CATEGORY;
            if (status == AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                // 属するカテゴリを「車載機未更新」に変更
                targetCategory = MAP_DATA_CATEGORY.NOT_UPDATE;
                categoryID = this.CategoryIds[targetCategory];
                iconType = UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
            } else {
                // 属するカテゴリを「ダウンロード未完了」に変更
                targetCategory = MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                categoryID = this.CategoryIds[targetCategory];
                iconType = UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
            }
            UI.UpdateList.setItemInfo($row, { "icon": iconType, "category": categoryID });

            // 保持データのカテゴリ変更
            var targetData: any = AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);
            if (targetData != null) {
                AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                AnalyseAhaConnectSDKResponse.addUpdateListData(this.updateDatas, targetData, targetCategory);
            }
        }

        /**
         * 指定キーに該当するダウンロード中キーリストを更新する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        private updateDownloadingKeys(key: any, status: AhaConnectSDK_DownloadStatus) {
            switch (status) {
                case AhaConnectSDK_DownloadStatus.DownloadInitiated:
                case AhaConnectSDK_DownloadStatus.DownloadInProgress:
                    // リストに追加
                    this.addDownloadingKeys(key);
                    break;
                default:
                    // リストから削除
                    this.removeDownloadingKeys(key);
                    break;
            }
        }

        /**
         * 指定キーに該当する車載機転送中キーリストを更新する
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status 車載機転送ステータス
         */
        private updateTransferringKeys(key: any, status: AhaConnectSDK_AccessoryTransferStatus) {
            switch (status) {
                case AhaConnectSDK_AccessoryTransferStatus.TransferInitiated:
                case AhaConnectSDK_AccessoryTransferStatus.TransferInProgress:
                    // リストに追加
                    this.addTransferringKeys(key);
                    break;
                default:
                    // リストから削除
                    this.removeTransferringKeys(key);
                    break;
            }
        }

        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（車載機転送ステータス通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        private updateCategoryChangedAccessoryTransferStatus(key: any, status: AhaConnectSDK_AccessoryTransferStatus) {
            var $row = this.getUpdateDataRow(key);
            if ($row == null) {
                return;
            }

            switch (status) {
                case AhaConnectSDK_AccessoryTransferStatus.TransferInitiated:
                case AhaConnectSDK_AccessoryTransferStatus.TransferInProgress:
                    // 進捗率を表示
                    UI.UpdateList.setItemInfo($row, { "showprogress": true, "progress": 0 });
                    break;
                default:
                    // 進捗率を非表示（進捗率0を指定しておかないと、次に表示した時に一瞬100の状態が見えてしまう）
                    UI.UpdateList.setItemInfo($row, { "showprogress": false, "progress": 0 });
                    break;
            }

            var categoryID: string;
            var iconType: UI.MAP_DATA_ICON_TYPE;
            var targetCategory: MAP_DATA_CATEGORY;
            if (status == AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                // 属するカテゴリを「車載機更新済・最新状態」に変更
                targetCategory = MAP_DATA_CATEGORY.UPDATED;
                categoryID = this.CategoryIds[targetCategory];
                iconType = UI.MAP_DATA_ICON_TYPE.UPDATED;
            } else {
                // 属するカテゴリを「車載機未更新」に変更
                targetCategory = MAP_DATA_CATEGORY.NOT_UPDATE;
                categoryID = this.CategoryIds[targetCategory];
                iconType = UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
            }
            UI.UpdateList.setItemInfo($row, { "icon": iconType, "category": categoryID });

            // 保持データのカテゴリ変更
            var targetData: any = AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);
            if (targetData != null) {
                AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                AnalyseAhaConnectSDKResponse.addUpdateListData(this.updateDatas, targetData, targetCategory);
            }
        }

        /**
         * 手動ダウンロード
         * @param callback コールバック（引数で成否を返却）
         */
        private downloadAllData(callback: (result: boolean) => void) {
            // // 一覧データ表示更新
            // this.loadData().then(() => {
            // ダウンロード対象データ
            var targetDatas: any = this.updateDatas[MAP_DATA_CATEGORY.NOT_DOWNLOAD];
            var downloadKeys: Array<any> = new Array();

            // ダウンロードキー情報を作成
            for (var i: number = 0; i < targetDatas.length; i++) {
                var targetData: any = targetDatas[i];
                downloadKeys.push({
                    "deviceCode": targetData.key.deviceCode,
                    "productCode": targetData.key.productCode,
                    "productID": targetData.key.productID,
                    "baselineID": targetData.key.baselineID,
                    "supplierID": targetData.key.supplierID,
                    "regionID": targetData.key.regionID,
                    "fromVersion": targetData.fromVersion,
                    "toVersion": targetData.toVersion
                });
            }

            // AhaConnect SDKへダウンロードキューを登録する
            AhaConnectHTMLSDK.getInstance().addDownloadQueue(downloadKeys, (result: boolean) => {
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
        }

        /**
         * 車載機リージョン選択変更シミュレーション
         */
        private simulationChangedVehicleRegion() {
            var data: any = {
                "notify": "availableMapRegions",
                "data": [{}]
            };
            this.ahaConnectSDKNotify(JSON.stringify(data), AhaConnectSDK_JsonType);
        }

        /**
         * ダウンロードシミュレーション（ダウンロード、車載機転送をシミュレーション）
         */
        private simulationDownload() {
            if (this.simDownloadTimer >= 0) {
                clearInterval(this.simDownloadTimer);
                this.simDownloadTimer = -1;
            }
            if (this.simTransferTimer >= 0) {
                clearInterval(this.simTransferTimer);
                this.simTransferTimer = -1;
            }
            var isDownloadError: boolean = false;
            var isTransferError: boolean = false;
            // ダウンロード進捗率通知を実施
            var notifyDownloadProgress: any = (key: any, progress: number) => {
                var data: any = {
                    "notify": "regionsDownloadProgress",
                    "data": [{
                        "deviceCode": key.deviceCode,
                        "productCode": key.productCode,
                        "productID": key.productID,
                        "supplierID": key.supplierID,
                        "baselineID": key.baselineID,
                        "regionID": key.regionID,
                        "fromVersion": 1,
                        "toVersion": 2,
                        "progress": progress,
                        "totalSize": 1024,
                        "status": AhaConnectSDK_DownloadStatus.DownloadStateInvalid
                    }]
                };
                this.ahaConnectSDKNotify(data, AhaConnectSDK_JsonType);
            };
            // 車載機転送進捗率通知を実施
            var notifyTransferProgress: any = (key: any, progress: number) => {
                var data: any = {
                    "notify": "accessoryFileTransferProgress",
                    "data": [{
                        "deviceCode": key.deviceCode,
                        "productCode": key.productCode,
                        "productID": key.productID,
                        "supplierID": key.supplierID,
                        "baselineID": key.baselineID,
                        "regionID": key.regionID,
                        "fromVersion": 1,
                        "toVersion": 2,
                        "progress": progress,
                        "totalSize": 1024
                    }]
                };
                this.ahaConnectSDKNotify(data, AhaConnectSDK_JsonType);
            };
            // ダウンロードステータス通知を実施
            var notifyDownloadStatus: any = (key: any, status: AhaConnectSDK_DownloadStatus) => {
                var data: any = {
                    "notify": "downloadStatus",
                    "data": [{
                        "deviceCode": key.deviceCode,
                        "productCode": key.productCode,
                        "productID": key.productID,
                        "supplierID": key.supplierID,
                        "baselineID": key.baselineID,
                        "regionID": key.regionID,
                        "fromVersion": 1,
                        "toVersion": 2,
                        "status": status,
                        "totalSize": 1024
                    }]
                };
                this.ahaConnectSDKNotify(data, AhaConnectSDK_JsonType);
            };
            // 車載機転送ステータス通知を実施
            var notifyTransferStatus: any = (key: any, status: AhaConnectSDK_AccessoryTransferStatus) => {
                var data: any = {
                    "notify": "accessoryTransferStatus",
                    "data": [{
                        "deviceCode": key.deviceCode,
                        "productCode": key.productCode,
                        "productID": key.productID,
                        "supplierID": key.supplierID,
                        "baselineID": key.baselineID,
                        "regionID": key.regionID,
                        "fromVersion": 1,
                        "toVersion": 2,
                        "accessoryTransferStatus": status,
                    }]
                };
                this.ahaConnectSDKNotify(data, AhaConnectSDK_JsonType);
            }
            // シミュレーション対象データキー
            var key: any = {
                "deviceCode": "aaa",
                "productCode": "bbb",
                "productID": 1065,
                "supplierID": 28,
                "baselineID": 9847,
                "regionID": 300
            };
            // ダウンロードシミュレーション
            var execDownloadSimulation: any = (key: any, callback: (result: boolean) => void) => {
                var cnt: number = 0;
                var progress: number = 0;
                this.simDownloadTimer = setInterval(() => {
                    if (cnt == 0) {
                        notifyDownloadStatus(key, AhaConnectSDK_DownloadStatus.DownloadInitiated);
                    }
                    if (cnt == 1) {
                        notifyDownloadStatus(key, AhaConnectSDK_DownloadStatus.DownloadInProgress);
                    }
                    if (cnt > 1) {
                        if (progress > 100) {
                            clearInterval(this.simDownloadTimer);
                            this.simDownloadTimer = -1;
                            if (!isDownloadError) {
                                notifyDownloadStatus(key, AhaConnectSDK_DownloadStatus.DownloadCompleted);
                                if (callback != null) {
                                    callback(true);
                                }
                            }
                            return;
                        }
                        notifyDownloadProgress(key, progress);
                        if (isDownloadError && progress >= 50) {
                            progress = 100;
                            notifyDownloadStatus(key, AhaConnectSDK_DownloadStatus.DownloadError);
                            if (callback != null) {
                                callback(false);
                            }
                        }
                        progress += 10;
                    }
                    cnt++;
                }, 1000);
            };
            // 車載機転送シミュレーション
            var execTransferSimulation: any = (key: any, callback: (result: boolean) => void) => {
                var cnt: number = 0;
                var progress: number = 0;
                this.simTransferTimer = setInterval(() => {
                    if (cnt == 0) {
                        notifyTransferStatus(key, AhaConnectSDK_AccessoryTransferStatus.TransferInitiated);
                    }
                    if (cnt == 1) {
                        notifyTransferStatus(key, AhaConnectSDK_AccessoryTransferStatus.TransferInProgress);
                    }
                    if (cnt > 1) {
                        if (progress > 100) {
                            clearInterval(this.simTransferTimer);
                            this.simTransferTimer = -1;
                            if (!isTransferError) {
                                notifyTransferStatus(key, AhaConnectSDK_AccessoryTransferStatus.TransferCompleted);
                                if (callback != null) {
                                    callback(true);
                                }
                            }
                            return;
                        }
                        notifyTransferProgress(key, progress);
                        if (isTransferError && progress >= 50) {
                            progress = 100;
                            notifyTransferStatus(key, AhaConnectSDK_AccessoryTransferStatus.TransferGenericFailure);
                            if (callback != null) {
                                callback(false);
                            }
                        }
                        progress += 10;
                    }
                    cnt++;
                }, 1000);
            };
            // シミュレーション実行
            execDownloadSimulation(key, (result: boolean) => {
                if (result) {
                    execTransferSimulation(key, null);
                }
            });
        }
    }

    // ページ読み込み完了時処理
    $(() => {
        var controller: Controller = Controller.getInstance();

        if (isDebug) {
            controller.initPage("ja_JP");
        } else {
            // config.jsの処理を使用して言語コードを取得する
            initHarmanOTA((language: string) => {
                controller.initPage(language);
            });
        }
    });
}