module HarmanOTA {
    // デバッグフラグ
    // export var isDebug: boolean = window.navigator.userAgent.match(/Chrome/) !== null;
    export var isDebug: boolean = false;

    export var AhaConnectSDK_JsonType: string = "application/json";
    export var AhaConnectSDK_Notify_downloadStatus: string = "downloadStatus";
    export var AhaConnectSDK_Notify_downloadProgress: string = "regionsDownloadProgress";
    export var AhaConnectSDK_Notify_accessoryTransferStatus: string = "accessoryTransferStatus";
    export var AhaConnectSDK_Notify_accessoryTransferProgress: string = "accessoryFileTransferProgress";
    export var AhaConnectSDK_Notify_availableMapRegions: string = "availableMapRegions";
    export var AhaConnectSDK_ErrorCode_Success: number = 0;
    export var AhaConnectSDK_ErrorCode_NetworkFailure: number = 1002;
    export var AhaConnectSDK_ErrorCode_MapSubscriptionExpired: number = 1005;

    /**
     * 地図データカテゴリ
     */
    export enum MAP_DATA_CATEGORY {
        NOT_DOWNLOAD = 0,
        NOT_UPDATE,
        UPDATED
    };

    /**
     * AhaConnect SDK ダウンロードステータス
     */
    export enum AhaConnectSDK_DownloadStatus {
        DownloadStateInvalid = 0,
        DownloadInitiated,
        DownloadInProgress,
        DownloadCompleted,
        DownloadError,
        DownloadCanceled,
        InvalidRequestData,
        SpaceNotAvailable,
        IncompleteDownload,
        NotDownloaded,
        ErrorOverThresholdSizeOnCellular,
        DownloadFailSubscriptionInvalid,
        DownloadFailNetworkError,
        DownloadFailDBError,
        DownloadFailInternalError,
        ELicenseFileCreationFailed
    };

    /**
     * AhaConnect SDK 車載機転送ステータス
     */
    export enum AhaConnectSDK_AccessoryTransferStatus {
        TransferStateInvalid = 0,
        TransferInitiated,
        TransferInProgress,
        TransferCompleted,
        TransferFailedDueToDisconnection,
        TransferGenericFailure
    };

    /**
     * 共通処理クラス
     */
    export class Common {
        private static KVS_KEY_HARMAN_OTA_SETTINGS: string = "harman_ota_info";

        /**
         * データサイズ表示用フォーマット
         * @param size データサイズ（単位：バイト）
         * @return 表示用フォーマット済みデータサイズ
         */
        public static formatDataSize(size: number): string {
            if (size < (1024 * 1024)) {
                // 1MB未満
                // KB単位で表示
                return Math.round(size / 1024).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') + " KB";
            } else {
                // 1MB以上
                // MB単位で表示
                return Math.round(size / 1024 / 1024).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') + " MB";
            }
        }

        /**
         * バージョン表示用フォーマット
         * @param version バージョン
         * @return 表示用フォーマット済みバージョン
         */
        public static formatVersion(version: number): string {
            return version.toFixed(1);
        }

        /**
         * 日付表示用フォーマット
         * @param 日付（AhaConnect SDKの「mapSubscriptionDetails」で返却される日付）
         * @return 表示用フォーマット済みデータサイズ
         */
        public static formatDate(date: string): string {
            // AhaConnect SDKの「mapSubscriptionDetails」で返却される日付情報が、
            // 表示に適さないフォーマットの場合はここで編集する。
            // 現状はそのまま返却する。
            return date;
        }

        /**
         * RTLが有効な言語かを判断する
         * @param language 言語コード
         */
        public static judgeEnabledRtl(language): boolean {
            if (language == null) {
                return false;
            }

            var langArray = language.split("_");

            if (langArray.length == 0) {
                return false;
            }

            // 言語がアラビア語の場合、RTL有効と判断する
            var langFirst = langArray[0];
            return langFirst == "ar" || langFirst == "he";
        }

        /**
         * RTLの有効/無効を設定する
         * @param $target 対象DOM要素（JQueryオブジェクト）
         * @param enabled 有効/無効
         */
        public static enabledRtl($target: JQuery, enabled: boolean, alignRight: boolean) {
            if (enabled) {
                $target.addClass(alignRight ? UI.RTL_ALIGN_RIGHT_CLASS : UI.RTL_CLASS);
            } else {
                $target.removeClass(UI.RTL_CLASS);
                $target.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
            }
        }

        /**
         * RTL設定をキャンセルする（親要素がRTL有効の際に子要素はRTLを無効にしたい場合に使用する）
         * @param $target 対象DOM要素（JQueryオブジェクト）
         */
        public static cancelRtl($target: JQuery) {
            $target.removeClass(UI.RTL_CLASS);
            $target.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
            $target.addClass(UI.RTL_CANCEL_CLASS);
        }

        /**
         * HarmanOTA関連の設定をKVSから読み出す
         * @param callback コールバック（引数で読み出したデータを返却。形式は以下のJSON）
         * {
         *     "auto_update_check":[自動更新ON/OFF:boolean],
         *     "mobile_deta_connection":[モバイルデータ通信ON/OFF:boolean],
         *     "productCode":[プロダクトコード:string],
         *     "deviceCode":[デバイスコード:string],
         *     "accessoryFlag":[Harman車載機接続フラグ:boolean]
         * }
         */
        public static readHarmanOTASettings(callback: (data: any) => void) {
            CommonHTMLSDK.getInstance().readKVS(Common.KVS_KEY_HARMAN_OTA_SETTINGS, (key: string, value: string) => {
                if (callback == null) {
                    return;
                }

                if (value == null) {
                    if (isDebug) {
                        // デバッグ用データ
                        var testData: any = Common.getDefaultHarmanOTASettings();
                        testData.accessoryFlag = true;
                        callback(testData);
                    } else {
                        callback(null);
                    }
                } else {
                    callback(JSON.parse(value));
                }
            });
        }

        /**
         * HarmanOTA関連の設定をKVSへ書き込む
         * @param data 書き込むデータ（データ形式はreadHarmanOTASettingsのコールバック引数と同一）
         * @param callback コールバック（引数で書き込み成否を返却）
         */
        public static writeHarmanOTASettings(data: any, callback: (result: boolean) => void) {
            var settingText: string = JSON.stringify(data);

            CommonHTMLSDK.getInstance().writeKVS(Common.KVS_KEY_HARMAN_OTA_SETTINGS, settingText, (key: string, value: string, result: boolean) => {
                if (callback == null) {
                    return;
                }

                callback(result);
            })
        }

        /**
         * HarmanOTA関連のデフォルト設定を取得する
         * @return デフォルト設定JSON（データ形式はreadHarmanOTASettingsのコールバック引数と同一）
         */
        public static getDefaultHarmanOTASettings(): any {
            var defaultSettings: any = {
                "auto_update_check": true,
                "mobile_data_connection": false,
                "productCode": null,
                "deviceCode": null,
                "accessoryFlag": false
            };

            return defaultSettings;
        }

        /**
         * ページ遷移
         * @param url 遷移先ページのURL（相対パス指定も可）
         */
        public static transitionPage(url: string) {
            window.document.location.href = url;
        }

        /**
         * ログ出力
         * @param モジュール名
         * @param ログ内容
         */
        public static log(module: string, log: string) {
            if (module == null) {
                module = "HarmanOTA";
            }
            var message = module + ":" + log;
            console.log(message);

            if (window.navigator.userAgent.match(/iPhone/) !== null) {
                var logContext;
                logContext = window;
                if (logContext.log == undefined) {
                    logContext.log = function (msg) {
                        var iframe = document.createElement('IFRAME');
                        iframe.setAttribute('src', 'ios-log:' + msg);
                        document.documentElement.appendChild(iframe);
                        iframe.parentNode.removeChild(iframe);
                        iframe = null;
                    };
                }
                logContext.log(message);
            }
        }
    }

    /**
     * AhaConnect SDK レスポンス解析クラス
     */
    export class AnalyseAhaConnectSDKResponse {
        static ModuleName: string = "HarmanOTA.AnalyseAhaConnectSDKResponse";
        /**
         * Regionデータキーの一致判定
         * @param keyA 比較キーA（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         * @param keyB 比較キーB（Aと同一形式を想定）
         */
        public static equalsRegionDataKey(keyA: any, keyB: any): boolean {
            if ((keyA == null || keyB == null) && keyA != keyB) {
                return false;
            }

            return keyA.deviceCode == keyB.deviceCode &&
                keyA.productCode == keyB.productCode &&
                keyA.productID == keyB.productID &&
                keyA.supplierID == keyB.supplierID &&
                keyA.baselineID == keyB.baselineID &&
                keyA.regionID == keyB.regionID;
        }

        /**
         * ダウンロード中のダウンロードステータスかを判定
         * @param status ダウンロードステータス
         * @return 判定結果
         */
        public static judgeDownloadingStatus(status: AhaConnectSDK_DownloadStatus): boolean {
            return (status == AhaConnectSDK_DownloadStatus.DownloadInitiated) ||
                (status == AhaConnectSDK_DownloadStatus.DownloadInProgress);
        }

        /**
         * 車載機転送中の車載機転送ステータスかを判定
         * @param status 車載機転送ステータス
         * @return 判定結果
         */
        public static judgeTransferringStatus(status: AhaConnectSDK_AccessoryTransferStatus): boolean {
            return (status == AhaConnectSDK_AccessoryTransferStatus.TransferInitiated) ||
                (status == AhaConnectSDK_AccessoryTransferStatus.TransferInProgress);
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスに地図データが含まれているかを解析する
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return 解析結果(true:含まれている、false:含まれていない)
         */
        public static analyseExistsData(data: any): boolean {
            if (data == null || data.data == undefined || data.data.length == 0) {
                return false;
            }

            for (var i: number = 0; i < data.data.length; i++) {
                try {
                    var products: any = data.data[i].products;
                    var regions: any = products[i].Regions;
                    if ((products.length > 0) && (regions.length > 0)) {
                        return true;
                    }
                } catch (e) {
                    Common.log(AnalyseAhaConnectSDKResponse.ModuleName, e);
                }
            }
            return false;
        }

        /**
         * downloadStatus通知内容の解析
         * @param payload downloadStatus通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "status":[ステータス：AhaConnectSDK_DownloadStatus]
         * }
         */
        public static analyseNotifyDownloadStatus(payload: any): any {
            try {
                var data: any = payload.data[0];
                return {
                    "key": {
                        "deviceCode": data.deviceCode,
                        "productCode": data.productCode,
                        "productID": data.productID,
                        "supplierID": data.supplierID,
                        "baselineID": data.baselineID,
                        "regionID": data.regionID
                    },
                    "status": data.status
                };
            } catch (e) {
                return null;
            }
        }

        /**
         * downloadProgress通知内容の解析
         * @param payload downloadProgress通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "progress":[進捗率：number(0-100)]
         * }
         */
        public static analyseNotifyDownloadProgress(payload: any): any {
            try {
                var data: any = payload.data[0];
                return {
                    "key": {
                        "deviceCode": data.deviceCode,
                        "productCode": data.productCode,
                        "productID": data.productID,
                        "supplierID": data.supplierID,
                        "baselineID": data.baselineID,
                        "regionID": data.regionID
                    },
                    "progress": data.progress
                };
            } catch (e) {
                return null;
            }
        }

        /**
         * accessoryTransferStatus通知内容の解析
         * @param payload accessoryTransferStatus通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "status":[ステータス：AhaConnectSDK_DownloadStatus]
         * }
         */
        public static analyseNotifyAccessoryTransferStatus(payload: any): any {
            try {
                var data: any = payload.data[0];
                return {
                    "key": {
                        "deviceCode": data.deviceCode,
                        "productCode": data.productCode,
                        "productID": data.productID,
                        "supplierID": data.supplierID,
                        "baselineID": data.baselineID,
                        "regionID": data.regionID
                    },
                    "status": data.accessoryTransferStatus
                };
            } catch (e) {
                return null;
            }
        }

        /**
         * accessoryTransferProgress通知内容の解析
         * @param payload accessoryTransferProgress通知内容の解析
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "progress":[進捗率：number(0-100)]
         * }
         */
        public static analyseNotifyAccessoryTransferProgress(payload: any): any {
            try {
                var data: any = payload.data[0];
                return {
                    "key": {
                        "deviceCode": data.deviceCode,
                        "productCode": data.productCode,
                        "productID": data.productID,
                        "supplierID": data.supplierID,
                        "baselineID": data.baselineID,
                        "regionID": data.regionID
                    },
                    "progress": data.progress
                };
            } catch (e) {
                return null;
            }
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスを解析する
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return 解析結果（createRegionViewDataの返却JSON）
         */
        public static analyseUpdateListData(data: any): any {
            if (data == null || data.data == null || data.data.length == 0) {
                return null;
            }
            var analyseData: Array<Array<any>> = new Array();
            for (var dataIndex: number = 0; dataIndex < data.data.length; dataIndex++) {
                var deviceData: any = AnalyseAhaConnectSDKResponse.analyseDeviceData(data, dataIndex);

                for (var productIndex: number = 0; productIndex < data.data.length; productIndex++) {
                    var productData: any = AnalyseAhaConnectSDKResponse.analyseProductData(data, dataIndex, productIndex);
                    var regionDatas: any = AnalyseAhaConnectSDKResponse.analyseUpdateListCategory(data, dataIndex, productIndex);

                    if (deviceData == null || productData == null || regionDatas == null) {
                        continue;
                    }

                    var categories: MAP_DATA_CATEGORY[] = [MAP_DATA_CATEGORY.NOT_DOWNLOAD, MAP_DATA_CATEGORY.NOT_UPDATE, MAP_DATA_CATEGORY.UPDATED];
                    for (var i: number = 0; i < categories.length; i++) {
                        var category: MAP_DATA_CATEGORY = categories[i];
                        if (analyseData[category] == undefined || analyseData[category].length == 0) {
                            analyseData[category] = new Array();
                        }
                        for (var j: number = 0; j < regionDatas[category].length; j++) {
                            var viewData: any = AnalyseAhaConnectSDKResponse.createRegionViewData(deviceData, productData, regionDatas[category][j]);
                            if (viewData != null) {
                                analyseData[category].push(viewData);
                            }
                        }
                    }
                }
            }
            if (analyseData.length == 0) {
                return null;
            }
            return analyseData;
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果データからキー指定で検索する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param key データキー（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         * @return 検索結果データ（createRegionViewDataの返却値。見つからない場合はnullを返却。）
         */
        public static findUpdateListData(resData: any, key: any): any {
            for (var i: number = 0; i < resData.length; i++) {
                var datas: any = resData[i];
                for (var j: number = 0; j < datas.length; j++) {
                    if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(datas[j].key, key)) {
                        return datas[j];
                    }
                }
            }
            return null;
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果からキー指定で削除する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param key データキー（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         */
        public static removeUpdateListData(resData: any, key: any) {
            for (var i: number = 0; i < resData.length; i++) {
                var datas: any = resData[i];
                datas.some((value: any, index: number, array: any[]) => {
                    if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(value.key, key)) {
                        datas.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            }
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果にデータを追加する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param addData 追加するデータ（createRegionViewDataの返却値）
         * @param category カテゴリ（MAP_DATA_CATEGORY）
         */
        public static addUpdateListData(resData: any, addData: any, category: MAP_DATA_CATEGORY) {
            if (AnalyseAhaConnectSDKResponse.findUpdateListData(resData, addData.key) == null) {
                var datas: any = resData[category];
                if (datas == null) {
                    return;
                }
                datas.push(addData);
            }
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスからコンテンツに必要なデータ構成に変換する
         * @param deviceData デバイス関連のデータ（analyseDeviceDataのレスポンスJSON）
         * @param productData プロダクト関連のデータ（analyseProductDataのレスポンスJSON）
         * @param regionData リージョンデータ（AhaConnect SDKのretrieveAvailableMapRegionsのレスポンス内のRegions配列部）
         * @return 変換結果（以下JSON構成）
         * {
         *     "key":{
         *         "deviceCode":[デバイスコード:string],
         *         "productCode":[プロダクトコード:string],
         *         "productID":[プロダクトID:number],
         *         "supplierID":[サプライヤID:number],
         *         "baselineID":[ベースラインID:number],
         *         "regionID":[リージョンID:number]
         *     },
         *     "name":[地域名:string],
         *     "fromVersion":[現在のバージョン:number],
         *     "toVersion":[更新可能バージョン:number],
         *     "size":[サイズ:number],
         *     "downloadStatus":[ダウンロードステータス:AhaConnectSDK_DownloadStatus],
         *     "accessoryTransferStatus":[車載機転送ステータス:AhaConnectSDK_AccessoryTransferStatus]
         * }
         */
        private static createRegionViewData(deviceData: any, productData: any, regionData: any): any {
            if (deviceData == null || productData == null || regionData == null ||
                regionData.regionID == null) {
                return null;
            }

            var updatesInfo: any = AnalyseAhaConnectSDKResponse.analyseUpdateInfo(regionData.Updates);

            return {
                "key": {
                    "deviceCode": deviceData.deviceCode,
                    "productCode": deviceData.productCode,
                    "productID": productData.productID,
                    "supplierID": productData.supplierID,
                    "baselineID": productData.baselineID,
                    "regionID": regionData.regionID
                },
                "name": regionData.regionName,
                "fromVersion": regionData.fromVersion,
                "toVersion": updatesInfo.version,
                "size": updatesInfo.size,
                "downloadStatus": regionData.downloadStatus,
                "accessoryTransferStatus": regionData.accessoryTransferStatus
            };
        }

        private static checkDataLength(data: any, dataIndex: number): boolean {
            var error: boolean = data == null || data.data == null || data.data.length == 0 || data.data.length <= dataIndex;
            return !error;
        }

        private static checkProductLength(data: any, dataIndex: number, productIndex): boolean {
            if (!AnalyseAhaConnectSDKResponse.checkDataLength(data, dataIndex)) {
                return false;
            }
            var data: any = data.data[dataIndex];
            var error: boolean = data.products == null || data.products.length == 0 || data.products.length <= productIndex;
            return !error;
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスのデバイス関連のデータ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return デバイス関連のデータJSON
         */
        private static analyseDeviceData(data: any, dataIndex: number): any {
            if (!AnalyseAhaConnectSDKResponse.checkDataLength(data, dataIndex)) {
                return null;
            }

            data = data.data[dataIndex];

            if (data.deviceCode == null || data.productCode == null) {
                return null;
            }

            return {
                "deviceCode": data.deviceCode,
                "productCode": data.productCode
            };
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスのプロダクト関連のデータ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return プロダクト関連のデータJSON
         */
        private static analyseProductData(data: any, dataIndex: number, productIndex: number): any {
            if (!AnalyseAhaConnectSDKResponse.checkProductLength(data, dataIndex, productIndex)) {
                return null;
            }

            data = data.data[dataIndex];

            var product: any = data.products[productIndex];
            if (product.id == null || product.supplierID == null || product.baselineID == null) {
                return null;
            }

            return {
                "productID": product.id,
                "supplierID": product.supplierID,
                "baselineID": product.baselineID
            };
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのRegions部のカテゴリ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return カテゴリ毎のRegions配列（MAP_DATA_CATEGORYの値をキーとした連想配列にArrayを割り当て）
         */
        private static analyseUpdateListCategory(data: any, dataIndex: number, productIndex: number): any {
            if (!AnalyseAhaConnectSDKResponse.checkProductLength(data, dataIndex, productIndex)) {
                return null;
            }

            data = data.data[dataIndex];

            if (data.products[productIndex].Regions == null || data.products[productIndex].Regions.length == 0) {
                return null;
            }

            var regionDatas: any = data.products[productIndex].Regions;
            var regions: Array<Array<any>> = new Array();
            regions[MAP_DATA_CATEGORY.NOT_DOWNLOAD] = new Array();
            regions[MAP_DATA_CATEGORY.NOT_UPDATE] = new Array();
            regions[MAP_DATA_CATEGORY.UPDATED] = new Array();

            for (var i: number = 0; i < regionDatas.length; i++) {
                var regionData = regionDatas[i];
                var category: MAP_DATA_CATEGORY = MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                var fromVersion: number = 0;
                var downloadStatus: AhaConnectSDK_DownloadStatus = AhaConnectSDK_DownloadStatus.DownloadStateInvalid;

                if (regionData.fromVersion != null) {
                    fromVersion = regionData.fromVersion;
                }
                if (regionData.downloadStatus != null) {
                    downloadStatus = regionData.downloadStatus;
                }
                var updates = regionData.Updates;

                // リージョンデータ毎に属するカテゴリの判定
                if (updates == null || updates.length == 0) {
                    // 更新データなし

                    // 【車載機更新済】
                    category = MAP_DATA_CATEGORY.UPDATED;
                } else {
                    // 更新データあり
                    var latestVersion: number = AnalyseAhaConnectSDKResponse.analyseUpdateInfo(updates).version;
                    if (latestVersion <= fromVersion) {
                        // toVersion < fromVersion は想定外データ。更新対象外として本カテゴリに含める。

                        // 【車載機更新済】
                        category = MAP_DATA_CATEGORY.UPDATED;
                    } else {
                        if (downloadStatus == AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                            // 【車載機未更新】
                            category = MAP_DATA_CATEGORY.NOT_UPDATE;
                        } else {
                            // 【ダウンロード未完了】
                            category = MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                        }
                    }
                }

                regions[category].push(regionData);
            }

            return regions;
        }

        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのUpdateデータ解析
         * @param updateDatas AhaConnect SDKのretrieveAvailableMapRegionsのレスポンス内のUpdates配列部
         * @return 解析結果JSON（以下JSON構成）
         * {
         *     "version":[最新バージョン:number],
         *     "size":[データサイズ:number]
         * }
         */
        private static analyseUpdateInfo(updateDatas: any): any {
            var maxVersion: number = -1;
            var info: any = { "version": -1, "size": 0 };

            if (updateDatas == null) {
                return info;
            }

            for (var i: number = 0; i < updateDatas.length; i++) {
                var toVersion: number = updateDatas[i].toVersion;
                if (toVersion != null && toVersion > maxVersion) {
                    maxVersion = toVersion;
                    info.version = toVersion;
                    info.size = updateDatas[i].size;
                }
            }

            return info;
        }
    }

    /**
     * AhaConnect SDKのコントローラー
     */
    export class AhaConnectSDKController {
        static ModuleName: string = "HarmanOTA.AhaConnectSDKController";
        private static ResponseType: string = AhaConnectSDK_JsonType;

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
         * 「INFORM AUTO DOWNLOAD STATUS」をリクエスト
         * @param value リクエストする値
         * @param callback コールバック（引数で成否を返却）
         * @return jQuery Deferredオブジェクト
         */
        public informAutoDownload(value: boolean, callback: (result: boolean) => void): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();
            var param = {
                "req": "informAutoDownloadStatus",
                "status": value
            };

            // デバッグレスポンス
            if (isDebug) {
                if (callback != null) {
                    callback(true);
                }
                return;
            }

            AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, (payload: any, type: string, errorCode: number) => {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoDownload response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
            }, (result: boolean) => {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoDownload " + (result ? "success" : "fail"));

                if (result) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }

                if (callback != null) {
                    callback(result);
                }
            });

            return deferred.promise();
        }

        /**
         * 「INFORM AUTO UPDATE STATUS」をリクエスト
         * @param value リクエストする値
         * @param callback コールバック（引数で成否を返却）
         * @return jQuery Deferredオブジェクト
         */
        public informAutoUpdate(value: boolean, callback: (result: boolean) => void): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();
            var param = {
                "req": "informAutoUpdateStatus",
                "status": value
            };

            // デバッグレスポンス
            if (isDebug) {
                if (callback != null) {
                    callback(true);
                }
                return;
            }

            AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, (payload: any, type: string, errorCode: number) => {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoUpdate response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
            }, (result: boolean) => {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoUpdate " + (result ? "success" : "fail"));

                if (result) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }

                if (callback != null) {
                    callback(result);
                }
            });

            return deferred.promise();
        }

        /**
         * 「removeDevices」をリクエスト
         * @param removeDevicesParams 削除対象データ。[{'deviceCode' : 'xxxxxxxx', 'productCode' : 'yyyyyyyy'}]
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        public removeDevices(removeDevicesParams: any, callback: (data: any, result: boolean) => void): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();
            var param = {
                'req': 'removeDevices',
                'data': removeDevicesParams,
            };
            var error = (data: any) => {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };
            AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, (payload: any, type: string, errorCode: number) => {
                Common.log(AhaConnectSDKController.ModuleName, "removeDevices response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);

                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        } else {
                            error(payload);
                        }
                    } catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "removeDevices catch error");
                        Common.log(AhaConnectSDKController.ModuleName, e);
                        error(null);
                    }
                } else {
                    error(null);
                }
            }, (result: boolean) => {
                Common.log(AhaConnectSDKController.ModuleName, "removeDevices " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });

            return deferred.promise();
        }

        /**
         * 「retrieveAvailableMapRegions」をリクエスト
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        public retrieveAvailableMapRegions(callback: (data: any, result: boolean) => void): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();
            var param = {
                "req": "retrieveAvailableMapRegions",
            };
            var error = (data: any) => {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };

            // デバッグレスポンス
            if (isDebug) {
                if (callback != null) {
                    var data = {
                        "resp": "retrieveAvailableMapRegions",
                        "data": [{
                            "deviceCode": "aaa",
                            "productCode": "bbb",
                            "products": [{
                                "supplierID": 28,
                                "id": 1065,
                                "versionID": 0,
                                "baselineID": 9847,
                                "name": "North America",
                                "Regions": [{
                                    "regionID": 300,
                                    "regionName": "Alabama (USA)",
                                    "fromVersion": 1,
                                    "downloadStatus": AhaConnectSDK_DownloadStatus.NotDownloaded,
                                    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                                    "Updates": [{
                                        "operation": 0,
                                        "size": 77828,
                                        "name": "2016.06 Update 1",
                                        "toVersion": 2,
                                        "type": 0
                                    }]
                                },
                                {
                                    "regionID": 111,
                                    "regionName": "Saitama (JAPAN)",
                                    "fromVersion": 5,
                                    "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
                                    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferCompleted,
                                    "Updates": []
                                },
                                {
                                    "regionID": 301,
                                    "regionName": "Alaska (USA)",
                                    "fromVersion": 1,
                                    "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
                                    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                                    "Updates": [{
                                        "operation": 0,
                                        "size": 4060,
                                        "name": "2016.06 Update",
                                        "toVersion": 1,
                                        "type": 1
                                    },
                                    {
                                        "operation": 0,
                                        "size": 173015040,
                                        "name": "2016.06 Update",
                                        "toVersion": 2,
                                        "type": 1
                                    }]
                                },
                                {
                                    "regionID": 222,
                                    "regionName": "New York (USA)",
                                    "fromVersion": 2,
                                    "downloadStatus": AhaConnectSDK_DownloadStatus.NotDownloaded,
                                    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                                    "Updates": [{
                                        "operation": 0,
                                        "size": 1024,
                                        "name": "2016.06 Update 1",
                                        "toVersion": 1,
                                        "type": 0
                                    },
                                    {
                                        "operation": 0,
                                        "size": 2048,
                                        "name": "2016.06 Update 2",
                                        "toVersion": 2,
                                        "type": 0
                                    },
                                    {
                                        "operation": 0,
                                        "size": 3072,
                                        "name": "2016.06 Update 3",
                                        "toVersion": 3,
                                        "type": 0
                                    }]
                                },
                                {
                                    "regionID": 444,
                                    "regionName": "California (USA)",
                                    "fromVersion": 1,
                                    "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
                                    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                                    "Updates": [{
                                        "operation": 0,
                                        "size": 1024,
                                        "name": "2016.06 Update 1",
                                        "toVersion": 1,
                                        "type": 0
                                    },
                                    {
                                        "operation": 0,
                                        "size": 2048,
                                        "name": "2016.06 Update 2",
                                        "toVersion": 2,
                                        "type": 0
                                    },
                                    {
                                        "operation": 0,
                                        "size": 3072,
                                        "name": "2016.06 Update 3",
                                        "toVersion": 3,
                                        "type": 0
                                    }]
                                }]
                            }]
                        }]
                    };

                    callback(data, true);
                }
                return;
            }

            AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, (payload: any, type: string, errorCode: number) => {
                Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);

                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        } else {
                            error(payload);
                        }
                    } catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions catch error");
                        error(null);
                    }
                } else {
                    error(null);
                }
            }, (result: boolean) => {
                Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });

            return deferred.promise();
        }

        /**
         * 「REQUEST SUBSCRIPTION DETAILS」をリクエスト
         *  @param deviceCode デバイスコード
         *  @param productCode プロダクトコード
         *  @param callback コールバック（引数でレスポンスを返却 valid:有効期限有効/無効、date:有効期限、result:成否）
         *  @return jQuery Deferredオブジェクト
         */
        public mapSubscriptionDetails(deviceCode: string, productCode: string, callback: (valid: boolean, date: string, result: boolean) => void): JQueryPromise<void> {
            var deferred: JQueryDeferred<void> = jQuery.Deferred<void>();
            var param = {
                "req": "mapSubscriptionDetails",
                "parameters": [{
                    "deviceCode": deviceCode,
                    "productCode": productCode,
                }]
            };
            var error = () => {
                deferred.reject();
                if (callback != null) {
                    callback(false, null, false);
                }
            };

            // デバッグレスポンス
            if (isDebug) {
                if (callback != null) {
                    callback(true, "2020/12/31", true);
                }
                return;
            }

            // パラメータがnullだとiOS版AhaConnect SDKがクラッシュする為、ここでAhaConnect SDKへのリクエストを防ぐ
            if (deviceCode == null || productCode == null) {
                error();
                return;
            }

            AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, (payload: any, type: string, errorCode: number) => {
                Common.log(AhaConnectSDKController.ModuleName, "mapSubscriptionDetails response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                var targetData = payload.data[0];
                var isSuccess = targetData.valid != undefined && targetData.expiryDate != undefined;
                if (isSuccess && type == AhaConnectSDKController.ResponseType && errorCode == null) {
                    try {
                        if (callback != null) {
                            callback(targetData.valid, targetData.expiryDate, true);
                        }
                        deferred.resolve(targetData.valid, targetData.expiryDate, true);
                    } catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "mapSubscriptionDetails catch error");
                        error();
                    }
                } else {
                    error();
                }
            }, (result: boolean) => {
                Common.log(AhaConnectSDKController.ModuleName, "mapSubscriptionDetails " + (result ? "success" : "fail"));
                if (!result) {
                    error();
                }
            });

            return deferred.promise();
        }
    }

    /**
     * AhaConnect SDKの設定管理クラス
     */
    export class AhaConnectSDKSettings {
        public autoUpdate: boolean;
        public mobileData: boolean;
        public deviceCode: string;
        public productCode: string;
        public accessoryConnect: boolean;
        private ahaConnectSDKController: AhaConnectSDKController;

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
            this.autoUpdate = false;
            this.mobileData = false;
            this.deviceCode = null;
            this.productCode = null;
            this.accessoryConnect = false;
            this.ahaConnectSDKController = new AhaConnectSDKController();
        }

        /**
         * KVSから設定を読み出す
         * @param callback コールバック（引数で成否を返却）
         */
        public readSettings(callback: (result: boolean) => void) {
            Common.readHarmanOTASettings((data: any) => {
                var isWrite: boolean = false;
                var applyProperty = (applyData: any, result: boolean) => {
                    this.autoUpdate = applyData.auto_update_check;
                    this.mobileData = applyData.mobile_data_connection;
                    this.deviceCode = applyData.deviceCode;
                    this.productCode = applyData.productCode;
                    this.accessoryConnect = applyData.accessoryFlag;

                    if (callback != null) {
                        callback(result);
                    }
                };

                if (data == null) {
                    isWrite = true;
                    data = Common.getDefaultHarmanOTASettings();
                }

                if (isWrite) {
                    // 設定が空の場合、デフォルト設定を書き込む
                    data = Common.getDefaultHarmanOTASettings();
                    Common.writeHarmanOTASettings(data, (result: boolean) => {
                        applyProperty(data, result);
                    });
                } else {
                    applyProperty(data, true);
                }
            });
        }

        /**
         * KVSへ設定を書き込む
         * @param callback コールバック（引数で成否を返却）
         */
        public writeSettings(callback: (result: boolean) => void) {
            Common.readHarmanOTASettings((data: any) => {
                if (data == null) {
                    data = Common.getDefaultHarmanOTASettings();
                }

                // コンテンツから変更するのはautoUpdate、mobileDataの2つのみ
                data.auto_update_check = this.autoUpdate;
                data.mobile_data_connection = this.mobileData;

                Common.writeHarmanOTASettings(data, (result: boolean) => {
                    if (callback != null) {
                        callback(result);
                    }
                });
            });
        }

        /**
         * AhaConnect SDKへ設定を反映する
         * @param callback コールバック（引数で成否を返却）
         */
        public applySettings(callback: (result: boolean) => void) {
            var allResult: boolean = true;
            AhaConnectHTMLSDK.getInstance().applySettings((result: boolean) => {
                if (callback != null) {
                    callback(allResult);
                }
            });
        }
    }
}