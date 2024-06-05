var HarmanOTA;
(function (HarmanOTA) {
    // デバッグフラグ
    if (HarmanOTA.useStubSDK == undefined) {
        HarmanOTA.useStubSDK = false;
    }
    if (HarmanOTA.useStubVehicleInfo == undefined) {
        HarmanOTA.useStubVehicleInfo = false;
    }

    HarmanOTA.AhaConnectSDK_KEY_REQ = "req";
    HarmanOTA.AhaConnectSDK_KEY_DATA = "data";

    HarmanOTA.AhaConnectSDK_JsonType = "application/json";
    HarmanOTA.AhaConnectSDK_Notify_downloadStatus = "downloadStatus";
    HarmanOTA.AhaConnectSDK_Notify_downloadProgress = "regionsDownloadProgress";
    HarmanOTA.AhaConnectSDK_Notify_accessoryTransferStatus = "accessoryTransferStatus";
    HarmanOTA.AhaConnectSDK_Notify_accessoryTransferProgress = "accessoryFileTransferProgress";
    HarmanOTA.AhaConnectSDK_Notify_availableMapRegions = "availableMapRegions";
    HarmanOTA.AhaConnectSDK_Notify_accessoryInformation = "accessoryInformation";
    HarmanOTA.AhaConnectSDK_Notify_regionUpdateAvailable = "regionUpdateAvailable";
    HarmanOTA.AhaConnectSDK_Notify_notifyFileTransferFailure = "notifyFileTransferFailure";
    HarmanOTA.AhaConnectSDK_Notify_notifyError = "error";
    HarmanOTA.AhaConnectSDK_ErrorCode_Success = 0;
    HarmanOTA.AhaConnectSDK_ErrorCode_NetworkFailure = 1002;
    HarmanOTA.AhaConnectSDK_ErrorCode_MapSubscriptionExpired = 1005;
    /**
     * 地図データカテゴリ
     */
    (function (MAP_DATA_CATEGORY) {
        var i = 0;
        MAP_DATA_CATEGORY[MAP_DATA_CATEGORY["INDEFINITE"] = i++] = "INDEFINITE";
        MAP_DATA_CATEGORY[MAP_DATA_CATEGORY["NOT_DOWNLOAD"] = i++] = "NOT_DOWNLOAD";
        MAP_DATA_CATEGORY[MAP_DATA_CATEGORY["NOT_UPDATE"] = i++] = "NOT_UPDATE";
        MAP_DATA_CATEGORY[MAP_DATA_CATEGORY["UPDATED"] = i++] = "UPDATED";
    })(HarmanOTA.MAP_DATA_CATEGORY || (HarmanOTA.MAP_DATA_CATEGORY = {}));
    var MAP_DATA_CATEGORY = HarmanOTA.MAP_DATA_CATEGORY;
    ;
    /**
     * AhaConnect SDK ダウンロードステータス
     */
    (function (AhaConnectSDK_DownloadStatus) {
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadStateInvalid"] = 0] = "DownloadStateInvalid";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadInitiated"] = 1] = "DownloadInitiated";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadInProgress"] = 2] = "DownloadInProgress";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadCompleted"] = 3] = "DownloadCompleted";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadError"] = 4] = "DownloadError";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadCanceled"] = 5] = "DownloadCanceled";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["InvalidRequestData"] = 6] = "InvalidRequestData";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["SpaceNotAvailable"] = 7] = "SpaceNotAvailable";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["IncompleteDownload"] = 8] = "IncompleteDownload";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["NotDownloaded"] = 9] = "NotDownloaded";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["ErrorOverThresholdSizeOnCellular"] = 10] = "ErrorOverThresholdSizeOnCellular";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadFailSubscriptionInvalid"] = 11] = "DownloadFailSubscriptionInvalid";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadFailNetworkError"] = 12] = "DownloadFailNetworkError";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadFailDBError"] = 13] = "DownloadFailDBError";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["DownloadFailInternalError"] = 14] = "DownloadFailInternalError";
        AhaConnectSDK_DownloadStatus[AhaConnectSDK_DownloadStatus["ELicenseFileCreationFailed"] = 15] = "ELicenseFileCreationFailed";
    })(HarmanOTA.AhaConnectSDK_DownloadStatus || (HarmanOTA.AhaConnectSDK_DownloadStatus = {}));
    var AhaConnectSDK_DownloadStatus = HarmanOTA.AhaConnectSDK_DownloadStatus;
    ;
    /**
     * AhaConnect SDK 車載機転送ステータス
     */
    (function (AhaConnectSDK_AccessoryTransferStatus) {
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferStateInvalid"] = 0] = "TransferStateInvalid";
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferInitiated"] = 1] = "TransferInitiated";
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferInProgress"] = 2] = "TransferInProgress";
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferCompleted"] = 3] = "TransferCompleted";
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferFailedDueToDisconnection"] = 4] = "TransferFailedDueToDisconnection";
        AhaConnectSDK_AccessoryTransferStatus[AhaConnectSDK_AccessoryTransferStatus["TransferGenericFailure"] = 5] = "TransferGenericFailure";
    })(HarmanOTA.AhaConnectSDK_AccessoryTransferStatus || (HarmanOTA.AhaConnectSDK_AccessoryTransferStatus = {}));
    var AhaConnectSDK_AccessoryTransferStatus = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus;
    ;
    /**
     * 共通処理クラス
     */
    var Common = (function () {
        function Common() {
        }
        /**
         * データサイズ表示用フォーマット
         * @param size データサイズ（単位：バイト）
         * @return 表示用フォーマット済みデータサイズ
         */
        Common.formatDataSize = function (size, unit) {
            if (size < (unit * unit)) {
                // 1MB未満
                // KB単位で表示
                return Math.round(size / unit).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') + " KB";
            }
            else {
                // 1MB以上
                // MB単位で表示
                return Math.round(size / unit / unit).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') + " MB";
            }

        };
        /**
         * バージョン表示用フォーマット
         * @param version バージョン
         * @return 表示用フォーマット済みバージョン
         */
        Common.formatVersion = function (version) {
            return version.toFixed(1);
        };
        /**
         * 日付表示用フォーマット
         * @param 日付（AhaConnect SDKの「mapSubscriptionDetails」で返却される日付）
         * @return 表示用フォーマット済みデータサイズ
         */
        Common.formatDate = function (date) {
            // AhaConnect SDKの「mapSubscriptionDetails」で返却される日付情報が、
            // 表示に適さないフォーマットの場合はここで編集する。
            // 現状はそのまま返却する。
            return date;
        };
        /**
         * RTLが有効な言語かを判断する
         * @param language 言語コード
         */
        Common.judgeEnabledRtl = function (language) {
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
        };
        /**
         * RTLの有効/無効を設定する
         * @param $target 対象DOM要素（JQueryオブジェクト）
         * @param enabled 有効/無効
         */
        Common.enabledRtl = function ($target, enabled, alignRight) {
            if (enabled) {
                $target.addClass(alignRight ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : HarmanOTA.UI.RTL_CLASS);
            }
            else {
                $target.removeClass(HarmanOTA.UI.RTL_CLASS);
                $target.removeClass(HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS);
            }
        };
        /**
         * RTL設定をキャンセルする（親要素がRTL有効の際に子要素はRTLを無効にしたい場合に使用する）
         * @param $target 対象DOM要素（JQueryオブジェクト）
         */
        Common.cancelRtl = function ($target) {
            $target.removeClass(HarmanOTA.UI.RTL_CLASS);
            $target.removeClass(HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS);
            $target.addClass(HarmanOTA.UI.RTL_CANCEL_CLASS);
        };
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
        Common.readHarmanOTASettings = function (callback) {
            HarmanOTA.CommonHTMLSDK.getInstance().readKVS(Common.KVS_KEY_HARMAN_OTA_SETTINGS, function (key, value) {
                console.log("#9325  HarmanOTA.CommonHTMLSDK.getInstance().readKVS()");
                if (callback == null) {
                    return;
                }
                if (value == null) {
                    if (HarmanOTA.useStubVehicleInfo) {
                        // デバッグ用データ
                        var testData = HarmanOTA.stubVehicleSettings;
                        testData.accessoryFlag = true;
                        callback(testData);
                        return;
                    }
                    else 
                    {
                        callback(null);
                    }
                }
                else {
                    var data = JSON.parse(value);
                    if (HarmanOTA.useStubVehicleInfo) {
                        for (var key in HarmanOTA.stubVehicleSettings) {
                            var property = data[key];
                            if (property == undefined || property == null) {
                                data[key] = HarmanOTA.stubVehicleSettings[key];
                            }
                        }
                        data.accessoryFlag = true;
                    }
                    callback(data);
                }
            });
        };
        /**
         * HarmanOTA関連の設定をKVSへ書き込む
         * @param data 書き込むデータ（データ形式はreadHarmanOTASettingsのコールバック引数と同一）
         * @param callback コールバック（引数で書き込み成否を返却）
         */
        Common.writeHarmanOTASettings = function (data, callback) {
            var settingText = JSON.stringify(data);
            if (HarmanOTA.useStubVehicleInfo) {
                // デバッグ用データ
                settingText = JSON.stringify(HarmanOTA.stubVehicleSettings);
            }
            HarmanOTA.CommonHTMLSDK.getInstance().writeKVS(Common.KVS_KEY_HARMAN_OTA_SETTINGS, settingText, function (key, value, result) {
                if (callback == null) {
                    return;
                }
                callback(result);
            });
        };
        /**
         * HarmanOTA関連のデフォルト設定を取得する
         * @return デフォルト設定JSON（データ形式はreadHarmanOTASettingsのコールバック引数と同一）
         */
        Common.getDefaultHarmanOTASettings = function () {
            var defaultSettings = {
                "auto_update_check": false,
                "mobile_data_connection": false,
                "productCode": null,
                "deviceCode": null,
                "accessoryFlag": false
            };
            return defaultSettings;
        };
        /**
         * ページ遷移
         * @param url 遷移先ページのURL（相対パス指定も可）
         */
        Common.transitionPage = function (url) {
            window.location.href = url;
            //タイムアウト設定
            var timeoutpagetransit = window.setTimeout(function () {
                HarmanOTA.UI.Alert.alert("Connection error. Please try again.");
                window.location.href = "../index.html?countrycode=";
            }, 3000); //★Timeout 3sec
        };
        /**
         * ログ出力
         * @param モジュール名
         * @param ログ内容
         */
        Common.log = function (module, log) {
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
        };

        /**
         * MWSを使用して位置情報を取得する
         */
        Common.getGps = function () {
            var value = null;
            var kvsurl = mwsDomainWithPort + "gps/";
            var d = $.Deferred();
        
            $.ajax({
                type: "GET",		//HTTPメソッド
                url: kvsurl,		//URL
                async: true,		//同期
                timeout: 5000,		//タイムアウト
                success: function (data, status, xhr) {
                    //	window.alert(kvsurl + " GET status=" + status + " code=" + xhr.status);
                    d.resolve(xhr.responseText);
                },
                error: function (xhr, status, err) {
                    //	window.alert(kvsurl + " GET status=" + status + " code=" + xhr.status + " err=" + err);
                    d.resolve();
                }
            });
            return d.promise();
        };

        /**
         * 日付フォーマットを変更する
         * @param {*} date 日付
         */
        Common.convertDate = function (date, language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            // デフォルトをMonthを「short」表記として判定する。
            var options = { year: 'numeric', month: 'short', day: 'numeric' };
            // ロケール値を変換する。
            language = language.replace("_", "-");
            date = date.replace(/\./g, '-');
            var baseDate = new Date(date);
            

            return baseDate.toString()  === "Invalid Date" ? date.replace(/\-/g, '.') : baseDate.toLocaleDateString(language, options);
        };

        /**
         * queryStringの値を取得する
         * @param {*} queryStringKey 
         */
        Common.getQueryString = function (queryStringKey) {

            var queryString = $(window.location).attr('search');
            queryString = queryString.replace("?" + queryStringKey + "=","");

            return queryString;
        };
        
        Common.KVS_KEY_HARMAN_OTA_SETTINGS = "harman_ota_info";
        Common.KVS_KEY_HARMAN_OTA_TRANSFER = "transfer_status_info";
        return Common;
    })();
    HarmanOTA.Common = Common;
    /**
     * AhaConnect SDK レスポンス解析クラス
     */
    var AnalyseAhaConnectSDKResponse = (function () {
        function AnalyseAhaConnectSDKResponse() {
        }
        /**
         * Regionデータキーの一致判定
         * @param keyA 比較キーA（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         * @param keyB 比較キーB（Aと同一形式を想定）
         */
        AnalyseAhaConnectSDKResponse.equalsRegionDataKey = function (keyA, keyB) {
            if ((keyA == null || keyB == null) && keyA != keyB) {
                return false;
            }
            return keyA.deviceCode == keyB.deviceCode &&
                keyA.productCode == keyB.productCode &&
                keyA.regionID == keyB.regionID;
        };

        /**
         * 引数のRegionデータキーを整形
         * @param {*} key 
         */
        AnalyseAhaConnectSDKResponse.formatRegionDataKey = function (key) {
            return {
                "deviceCode" : key.deviceCode,
                "productID" : key.productCode,
                "supplierID" : key.supplierID,
                "baselineID" : key.baselineID, 
                "regionID" : key.regionID
            };
        }
        /**
         * ダウンロード中のダウンロードステータスかを判定
         * @param status ダウンロードステータス
         * @return 判定結果
         */
        AnalyseAhaConnectSDKResponse.judgeDownloadingStatus = function (status) {
            return (status == AhaConnectSDK_DownloadStatus.DownloadInitiated) ||
                (status == AhaConnectSDK_DownloadStatus.DownloadInProgress);
        };
        /**
         * 車載機転送中の車載機転送ステータスかを判定
         * @param status 車載機転送ステータス
         * @return 判定結果
         */
        AnalyseAhaConnectSDKResponse.judgeTransferringStatus = function (status) {
            return (status == AhaConnectSDK_AccessoryTransferStatus.TransferInitiated) ||
                (status == AhaConnectSDK_AccessoryTransferStatus.TransferInProgress);
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスに地図データが含まれているかを解析する
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return 解析結果(true:含まれている、false:含まれていない)
         */
        AnalyseAhaConnectSDKResponse.analyseExistsData = function (data) {
            if (data == null || data.data == undefined || data.data.length == 0) {
                return false;
            }
            for (var i = 0; i < data.data.length; i++) {
                try {
                    var products = data.data[i].products;
                    if (data.data[i].products == undefined) {
                        if ( data.data[i].errorCode != undefined ) {
                            continue;
                        } else {
                            return false;
                        }
                    }
                    var regions = products[0].Regions;
                    if ((products.length > 0) && (regions.length > 0)) {
                        return true;
                    }
                }
                catch (e) {
                    Common.log(AnalyseAhaConnectSDKResponse.ModuleName, e);
                }
            }
            return false;
        };
        /**
         * downloadStatus通知内容の解析
         * @param payload downloadStatus通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "status":[ステータス：AhaConnectSDK_DownloadStatus]
         * }
         */
        AnalyseAhaConnectSDKResponse.analyseNotifyDownloadStatus = function (payload) {
            try {
                var data = payload.data[0];
                return {
                    "key": data,
                    "status": data.status
                };
            }
            catch (e) {
                return null;
            }
        };
        /**
         * downloadProgress通知内容の解析
         * @param payload downloadProgress通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "progress":[進捗率：number(0-100)]
         * }
         */
        AnalyseAhaConnectSDKResponse.analyseNotifyDownloadProgress = function (payload) {
            try {
                var data = payload.data[0];
                return {
                    "key": data,
                    "progress": data.progress
                };
            }
            catch (e) {
                return null;
            }
        };
        /**
         * accessoryTransferStatus通知内容の解析
         * @param payload accessoryTransferStatus通知内容
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "status":[ステータス：AhaConnectSDK_DownloadStatus]
         * }
         */
        AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferStatus = function (payload) {
            try {
                var data = payload.data[0];
                return {
                    "key": data,
                    "status": data.accessoryTransferStatus
                };
            }
            catch (e) {
                return null;
            }
        };
        /**
         * accessoryTransferProgress通知内容の解析
         * @param payload accessoryTransferProgress通知内容の解析
         * @return 解析結果（以下のJSON形式で返却）
         * {
         *     "key":[データキー：createRegionViewDataが返却するJSONのkeyと同一形式を想定],
         *     "progress":[進捗率：number(0-100)]
         * }
         */
        AnalyseAhaConnectSDKResponse.analyseNotifyAccessoryTransferProgress = function (payload) {
            try {
                var data = payload.data[0];
                return {
                    "key": data,
                    "progress": data.progress
                };
            }
            catch (e) {
                return null;
            }
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスを解析する
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return 解析結果（createRegionViewDataの返却JSON）
         */
        AnalyseAhaConnectSDKResponse.analyseUpdateListData = function (data) {
            if (data == null || data.data == null || data.data.length == 0) {
                return null;
            }
            var analyseData = new Array();
            for (var dataIndex = 0; dataIndex < data.data.length; dataIndex++) {
                var deviceData = AnalyseAhaConnectSDKResponse.analyseDeviceData(data, dataIndex);
                for (var productIndex = 0; productIndex < data.data.length; productIndex++) {
                    var productData = AnalyseAhaConnectSDKResponse.analyseProductData(data, dataIndex, productIndex);
                    var regionDatas = AnalyseAhaConnectSDKResponse.analyseUpdateListCategory(data, dataIndex, productIndex);
                    if (deviceData == null || productData == null || regionDatas == null) {
                        continue;
                    }
                    var categories = [
                        MAP_DATA_CATEGORY.INDEFINITE,
                        MAP_DATA_CATEGORY.NOT_DOWNLOAD,
                        MAP_DATA_CATEGORY.NOT_UPDATE,
                        MAP_DATA_CATEGORY.UPDATED];
                    for (var i = 0; i < categories.length; i++) {
                        var category = categories[i];
                        if (analyseData[category] == undefined || analyseData[category].length == 0) {
                            analyseData[category] = new Array();
                        }
                        for (var j = 0; j < regionDatas[category].length; j++) {
                            var viewData = AnalyseAhaConnectSDKResponse.createRegionViewData(deviceData, productData, regionDatas[category][j]);
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
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果データからキー指定で検索する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param key データキー（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         * @return 検索結果データ（createRegionViewDataの返却値。見つからない場合はnullを返却。）
         */
        AnalyseAhaConnectSDKResponse.findUpdateListData = function (resData, key) {
            for (var i = 0; i < resData.length; i++) {
                var datas = resData[i];
                for (var j = 0; j < datas.length; j++) {
                    if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(datas[j].key, key)) {
                        return datas[j];
                    }
                }
            }
            return null;
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果からキー指定で削除する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param key データキー（createRegionViewDataが返却するJSONのkeyと同一形式を想定）
         */
        AnalyseAhaConnectSDKResponse.removeUpdateListData = function (resData, key) {
            if (resData == null) {
                return true;
            }

            for (var i = 0; i < resData.length; i++) {
                var datas = resData[i];
                datas.some(function (value, index, array) {
                    if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(value.key, key)) {
                        datas.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            }
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスの解析結果にデータを追加する
         * @param resData 対象のレスポンス解析結果データ（analyseUpdateListDataの返却値）
         * @param addData 追加するデータ（createRegionViewDataの返却値）
         * @param category カテゴリ（MAP_DATA_CATEGORY）
         */
        AnalyseAhaConnectSDKResponse.addUpdateListData = function (resData, addData, category) {
            if (AnalyseAhaConnectSDKResponse.findUpdateListData(resData, addData.key) == null) {
                var datas = resData[category];
                if (datas == null) {
                    return;
                }
                datas.push(addData);    // updateDatas.push
            }
        };
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
        AnalyseAhaConnectSDKResponse.createRegionViewData = function (deviceData, productData, regionData) {
            if (deviceData == null || productData == null || regionData == null ||
                regionData.regionID == null) {
                return null;
            }
            var updatesInfo = AnalyseAhaConnectSDKResponse.analyseUpdateInfo(regionData.Updates);
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
        };


        AnalyseAhaConnectSDKResponse.checkDataLength = function (data, dataIndex) {
            var error = data == null || data.data == null || data.data.length == 0 || data.data.length <= dataIndex;
            return !error;
        };
        AnalyseAhaConnectSDKResponse.checkProductLength = function (data, dataIndex, productIndex) {
            if (!AnalyseAhaConnectSDKResponse.checkDataLength(data, dataIndex)) {
                return false;
            }
            var data = data.data[dataIndex];
            var error = data.products == null || data.products.length == 0 || data.products.length <= productIndex;
            return !error;
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスのデバイス関連のデータ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return デバイス関連のデータJSON
         */
        AnalyseAhaConnectSDKResponse.analyseDeviceData = function (data, dataIndex) {
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
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのレスポンスのプロダクト関連のデータ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return プロダクト関連のデータJSON
         */
        AnalyseAhaConnectSDKResponse.analyseProductData = function (data, dataIndex, productIndex) {
            if (!AnalyseAhaConnectSDKResponse.checkProductLength(data, dataIndex, productIndex)) {
                return null;
            }
            data = data.data[dataIndex];
            var product = data.products[productIndex];
            if (product.id == null || product.supplierID == null || product.baselineID == null) {
                return null;
            }
            return {
                "productID": product.id,
                "supplierID": product.supplierID,
                "baselineID": product.baselineID
            };
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのRegions部のカテゴリ解析
         * @param data retrieveAvailableMapRegionsのレスポンスJSON
         * @return カテゴリ毎のRegions配列（MAP_DATA_CATEGORYの値をキーとした連想配列にArrayを割り当て）
         */
        AnalyseAhaConnectSDKResponse.analyseUpdateListCategory = function (data, dataIndex, productIndex) {
            if (!AnalyseAhaConnectSDKResponse.checkProductLength(data, dataIndex, productIndex)) {
                return null;
            }
            data = data.data[dataIndex];
            if (data.products[productIndex].Regions == null || data.products[productIndex].Regions.length == 0) {
                return null;
            }
            var regionDatas = data.products[productIndex].Regions;
            var regions = new Array();
            regions[MAP_DATA_CATEGORY.INDEFINITE] = new Array();    // Gen3では未使用
            regions[MAP_DATA_CATEGORY.NOT_DOWNLOAD] = new Array();
            regions[MAP_DATA_CATEGORY.NOT_UPDATE] = new Array();
            regions[MAP_DATA_CATEGORY.UPDATED] = new Array();
            for (var i = 0; i < regionDatas.length; i++) {
                var regionData = regionDatas[i];
                var category = MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                var fromVersion = 0;
                var downloadStatus = AhaConnectSDK_DownloadStatus.DownloadStateInvalid;
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
                }
                else {
                    // 更新データあり
                    var latestVersion = AnalyseAhaConnectSDKResponse.analyseUpdateInfo(updates).version;
                    if (latestVersion <= fromVersion) {
                        // toVersion < fromVersion は想定外データ。更新対象外として本カテゴリに含める。
                        // 【車載機更新済】
                        category = MAP_DATA_CATEGORY.UPDATED;
                    }
                    else {
                        if (downloadStatus == AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                            // 【車載機未更新】
                            category = MAP_DATA_CATEGORY.NOT_UPDATE;
                        }
                        else {
                            // 【ダウンロード未完了】
                            category = MAP_DATA_CATEGORY.NOT_DOWNLOAD;
                        }
                    }
                }
                regions[category].push(regionData);
            }
            return regions;
        };
        /**
         * AhaConnect SDK retrieveAvailableMapRegionsのUpdateデータ解析
         * @param updateDatas AhaConnect SDKのretrieveAvailableMapRegionsのレスポンス内のUpdates配列部
         * @return 解析結果JSON（以下JSON構成）
         * {
         *     "version":[最新バージョン:number],
         *     "size":[データサイズ:number]
         * }
         */
        AnalyseAhaConnectSDKResponse.analyseUpdateInfo = function (updateDatas) {
            var maxVersion = -1;
            var info = { "version": -1, "size": 0 };
            if (updateDatas == null) {
                return info;
            }
            for (var i = 0; i < updateDatas.length; i++) {
                var toVersion = updateDatas[i].toVersion;
                if (toVersion != null && toVersion > maxVersion) {
                    maxVersion = toVersion;
                    info.version = toVersion;
                    info.size = updateDatas[i].size;
                }
            }
            return info;
        };

        AnalyseAhaConnectSDKResponse.ModuleName = "HarmanOTA.AnalyseAhaConnectSDKResponse";
        return AnalyseAhaConnectSDKResponse;
    })();
    HarmanOTA.AnalyseAhaConnectSDKResponse = AnalyseAhaConnectSDKResponse;
    /**
     * AhaConnect SDKのコントローラー
     */
    var AhaConnectSDKController = (function () {
        /**
         * コンストラクタ
         */
        function AhaConnectSDKController() {
            this.initialize();
        }
        /**
         * 初期化処理
         */
        AhaConnectSDKController.prototype.initialize = function () {
        };
        /**
         * 「INFORM AUTO DOWNLOAD STATUS」をリクエスト
         * @param value リクエストする値
         * @param callback コールバック（引数で成否を返却）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.informAutoDownload = function (value, callback) {
            var deferred = jQuery.Deferred();
            var param = {
                "req": "informAutoDownloadStatus",
                "status": value
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubSDK) {
                if (callback != null) {
                    callback(true);
                }
                return;
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoDownload response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoDownload " + (result ? "success" : "fail"));
                if (result) {
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
                if (callback != null) {
                    callback(result);
                }
            });
            return deferred.promise();
        };
        /**
         * 「INFORM AUTO UPDATE STATUS」をリクエスト
         * @param value リクエストする値
         * @param callback コールバック（引数で成否を返却）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.informAutoUpdate = function (value, callback) {
            var deferred = jQuery.Deferred();
            var param = {
                "req": "informAutoUpdateStatus",
                "status": value
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubSDK) {
                if (callback != null) {
                    callback(true);
                }
                return;
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoUpdate response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "informAutoUpdate " + (result ? "success" : "fail"));
                if (result) {
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
                if (callback != null) {
                    callback(result);
                }
            });
            return deferred.promise();
        };
        /**
         * 「removeDevices」をリクエスト
         * @param removeDevicesParams 削除対象データ。[{'deviceCode' : 'xxxxxxxx', 'productCode' : 'yyyyyyyy'}]
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.removeDevices = function (removeDevicesParams, callback) {
            var deferred = jQuery.Deferred();
            var param = {
                'req': 'removeDevices',
                'data': removeDevicesParams,
            };
            var error = function (data) {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "removeDevices response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        }
                        else {
                            error(payload);
                        }
                    }
                    catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "removeDevices catch error");
                        Common.log(AhaConnectSDKController.ModuleName, e);
                        error(null);
                    }
                }
                else {
                    error(null);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "removeDevices " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });
            return deferred.promise();
        };

        AhaConnectSDKController.prototype.createStub_retrieveAvailableMapRegions = function (deviceCode, productCode) {
            return {
                "deviceCode": deviceCode,
                "productCode": productCode,
                "errorCode": 0,
                "products": [
                    {
                        "supplierID": 28,
                        "id": 1065,
                        "versionID": 0,
                        "baselineID": 9847,
                        "name": "North America",
                        "Regions": [
                            // {
                            //     "regionID": 298,
                            //     "regionName": "Alabama (USA2)",
                            //     "fromVersion": 1,
                            //     "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
                            //     "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferInProgress,
                            //     "Updates": [{
                            //         "operation": 0,
                            //         "size": 77828,
                            //         "name": "2016.06 Update 1",
                            //         "toVersion": 2,
                            //         "type": 0
                            //     }]
                            // },{
                            //     "regionID": 299,
                            //     "regionName": "Alabama (USA1)",
                            //     "fromVersion": 1,
                            //     "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadInProgress,
                            //     "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                            //     "Updates": [{
                            //         "operation": 0,
                            //         "size": 77828,
                            //         "name": "2016.06 Update 1",
                            //         "toVersion": 2,
                            //         "type": 0
                            //     }]
                            // },
                            {
                                "regionID": 300,
                                "regionName": "Alabama (USA)",
                                "fromVersion": 1,
                                "downloadStatus": AhaConnectSDK_DownloadStatus.NotDownloaded,
                                "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
                                "Updates": [{
                                    "operation": 0,
                                    "size": 1073741824,
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
                                    "size": 1073741824,
                                    "name": "2016.06 Update",
                                    "toVersion": 2,
                                    "type": 1
                                }]
                            },
                            {
                                "regionID": 332,
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
            };
        }

        /**
         * 「retrieveAvailableMapRegions」をリクエスト
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.retrieveAvailableMapRegions = function (callback) {
            var deferred = jQuery.Deferred();
            var param = {
                "req": "retrieveAvailableMapRegions",
            };
            var error = function (data, type, errorCode) {
                deferred.reject(data, type, errorCode);
                if (callback != null) {
                    callback(data, false, errorCode);
                }
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubSDK) {
                if (callback != null) {
                    var data = {
                        "resp": "retrieveAvailableMapRegions",
                        "data": [
                            this.createStub_retrieveAvailableMapRegions('11111', '22222'),
                            this.createStub_retrieveAvailableMapRegions(HarmanOTA.stubVehicleSettings.deviceCode, HarmanOTA.stubVehicleSettings.productCode)
                        ]
                    };
                    callback(data, true);
                }
                return;
            }
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        }
                        else {
                            error(payload, false, errorCode);
                        }
                    }
                    catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions catch error");
                        error(null, false, errorCode);
                    }
                }
                else {
                    error(null, type, errorCode);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "retrieveAvailableMapRegions " + (result ? "success" : "fail"));
                if (!result) {
                    error(null, false, errorCode);
                }
            });
            return deferred.promise();
        };


        /**
          * 「REQUEST SUBSCRIPTION DETAILS」をリクエスト
          *  @param deviceCode デバイスコード
          *  @param productCode プロダクトコード
          *  @param callback コールバック（引数でレスポンスを返却 valid:有効期限有効/無効、date:有効期限、result:成否）
          *  @return jQuery Deferredオブジェクト
          */
        AhaConnectSDKController.prototype.mapSubscriptionDetails = function (deviceCode, productCode, callback) {
            var deferred = jQuery.Deferred();
            var param = {
                "req": "mapSubscriptionDetails",
                "data": [{
                    "deviceCode": deviceCode,
                    "productCode": productCode,
                }]
            };
            var error = function () {
                deferred.reject();
                if (callback != null) {
                    callback(false, null, false);
                }
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubSDK) {
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
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
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
                    }
                    catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "mapSubscriptionDetails catch error");
                        error();
                    }
                }
                else {
                    error();
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "mapSubscriptionDetails " + (result ? "success" : "fail"));
                if (!result) {
                    error();
                }
            });
            return deferred.promise();
        };

        /**
          * 「CANCEL DOWNLOAD」をリクエスト
          * @param targetData キャンセルするダウンロードの情報 
          * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
          * @return jQuery Deferredオブジェクト
          */
         AhaConnectSDKController.prototype.cancelDownload = function (targetData, callback) {
            var deferred = jQuery.Deferred();

            var param = {};
            param[HarmanOTA.AhaConnectSDK_KEY_REQ] = "cancelDownload";
            param[HarmanOTA.AhaConnectSDK_KEY_DATA] = new Array(targetData);

            var error = function (data) {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };


            Common.log(AhaConnectSDKController.ModuleName, "cancelDownload request");
            Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(param));

            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "cancelDownload response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        }
                        else {
                            error(payload);
                        }
                    }
                    catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "cancelDownload catch error");
                        error(null);
                    }
                }
                else {
                    error(null);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "cancelDownload " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });
            return deferred.promise();
        }
        
        /**
          * 「DELETE DOWNLOAD REGION FILES」をリクエスト
          * @param targetData キャンセルするダウンロードの情報 
          * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
          * @return jQuery Deferredオブジェクト
          */
         AhaConnectSDKController.prototype.deleteRegionFiles = function (targetData, callback) {
            var deferred = jQuery.Deferred();

            var param = {};
            param[HarmanOTA.AhaConnectSDK_KEY_REQ] = "deleteRegionFiles";
            param[HarmanOTA.AhaConnectSDK_KEY_DATA] = new Array(targetData.key);

            var error = function (data) {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };
            HarmanOTA.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "deleteRegionFiles response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == HarmanOTA.AhaConnectSDK_ErrorCode_Success) {
                            if (callback != null) {
                                callback(payload, true);
                            }
                            deferred.resolve(payload, true);
                        }
                        else {
                            error(payload);
                        }
                    }
                    catch (e) {
                        Common.log(AhaConnectSDKController.ModuleName, "deleteRegionFiles catch error");
                        error(null);
                    }
                }
                else {
                    error(null);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "deleteRegionFiles " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });
            return deferred.promise();
        }
        
        AhaConnectSDKController.prototype.stubSdkCallback = function (input, output, callback, result) {
            // debugger;
            console.log('[sdk stub]\ninput :\n' + JSON.stringify(input));
            console.log('[sdk stub]\noutput :\n' + JSON.stringify(output));
            if (callback != null) {
                setTimeout(function () {
                    callback(output, result);
                }, 500);
            }
        }

        AhaConnectSDKController.ModuleName = "HarmanOTA.AhaConnectSDKController";
        AhaConnectSDKController.ResponseType = HarmanOTA.AhaConnectSDK_JsonType;
        return AhaConnectSDKController;
    })();
    HarmanOTA.AhaConnectSDKController = AhaConnectSDKController;
    /**
     * AhaConnect SDKの設定管理クラス
     */
    var AhaConnectSDKSettings = (function () {
        /**
         * コンストラクタ
         */
        function AhaConnectSDKSettings() {
            this.initialize();
        }
        /**
         * 初期化処理
         */
        AhaConnectSDKSettings.prototype.initialize = function () {
            this.auto_update_check = false;
            this.mobile_data_connection = false;
            this.deviceCode = null;
            this.productCode = null;
            this.accessoryFlag = false;
            this.ahaConnectSDKController = new AhaConnectSDKController();
            // savePropertys : 保存する項目をここに定義する
            this.savePropertys = {
                'auto_update_check' : '',
                'mobile_data_connection' : '',
                'deviceCode' : '',
                'productCode' : '',
                'accessoryFlag' : '',
                'protocolVersion' : '',
                'make' : '',
                'model' : '',
                'modelYear' : '',
                'serialNumber' : '',
                'huModel' : '',
                'VIN' : '',
                'pid' : '',
            };
        };

        AhaConnectSDKSettings.prototype.getMemorySettings = function (callback) {
            var result = Common.getDefaultHarmanOTASettings();
            for (var key in result) {
                // メモリの値を尊重する
                result[key] = this[key];
            }
            return result;
        }

        // private
        AhaConnectSDKSettings.prototype._readSettingsWithRetry = function (callback, retryCount) {
            var _this = this;
            Common.readHarmanOTASettings(function (data) {
                console.log("#9325  Common.readHarmanOTASettings()  callback");
                var isWrite = false;
                var applyProperty = function (applyData, result) {
                    for (var key in applyData) {
                        if (_this.savePropertys.hasOwnProperty(key)) {
                            _this[key] = applyData[key];
                        }
                    }
                    if (callback != null) {
                        callback(result);
                    }
                };
                if (data == null) {
                    var localRetryCount = retryCount == undefined ? 0 : retryCount + 1;
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('***********************************************');
                    console.log('***********************************************');
                    console.log('');
                    console.log('[KVS _readSettingsWithRetry : error] ' + localRetryCount);
                    console.log('');
                    console.log('***********************************************');
                    console.log('***********************************************');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    if (retryCount == undefined || retryCount < 2) {
                        setTimeout(function() {
                            _this._readSettingsWithRetry(callback, localRetryCount);
                        }, 0);
                        return;
                    } else {
                        isWrite = true;
                        data = _this.getMemorySettings();
                        console.log('[KVS _readSettingsWithRetry : error] create Default : ' + JSON.stringify(data));
                    }
                }
                if (isWrite) {
                    // 設定が空の場合、デフォルト設定を書き込む
                    data = _this.getMemorySettings();
                    console.log("#9325  Common.writeHarmanOTASettings()  call");
                    Common.writeHarmanOTASettings(data, function (result) {
                        console.log("#9325  Common.writeHarmanOTASettings()  callback");
                        applyProperty(data, result);
                    });
                }
                else {
                    applyProperty(data, true);
                }
            });
        }

        /**
         * KVSから設定を読み出す
         * @param callback コールバック（引数で成否を返却）
         */
        AhaConnectSDKSettings.prototype.readSettings = function (callback) {
            var _this = this;
            console.log("#9325  Common.readHarmanOTASettings()  call");
            console.log('[KVS _readSettingsWithRetry : start]');
            _this._readSettingsWithRetry(function(result) {
                console.log('[KVS _readSettingsWithRetry : finish]');
                callback(result);
            }, 0);
        };
        /**
         * KVSへ設定を書き込む
         * @param callback コールバック（引数で成否を返却）
         */
        AhaConnectSDKSettings.prototype.writeSettings = function (callback) {
            var _this = this;
            var writeData = {};
            for (var key in _this) {
                if (_this.savePropertys.hasOwnProperty(key)) {
                    writeData[key] = _this[key];
                }
            }

            Common.readHarmanOTASettings(function (data) {
                if (data == null) {
                    data = _this.getMemorySettings();
                }

                // 書き込み用データをマージ
                for (var key in data) {
                    var property = writeData[key];
                    if(property == undefined || property == null) {
                        writeData[key] = data[key];
                    }
                }

                // 一度、readしているので自身のプロパティを更新
                for (var key in writeData) {
                    _this[key] = writeData[key];
                }

                Common.writeHarmanOTASettings(writeData, function (result) {
                    if (callback != null) {
                        callback(result);
                    }
                });
            });
        };
        /**
         * AhaConnect SDKへ設定を反映する
         * @param callback コールバック（引数で成否を返却）
         */
        AhaConnectSDKSettings.prototype.applySettings = function (callback) {
            var allResult = true;
            HarmanOTA.AhaConnectHTMLSDK.getInstance().applySettings(function (result) {
                if (callback != null) {
                    callback(allResult);
                }
            });
        };
        return AhaConnectSDKSettings;
    })();
    HarmanOTA.AhaConnectSDKSettings = AhaConnectSDKSettings;

    /**
     * NativeBinder
     */
    var NativeBinder = (function () {
        /**
         * コンストラクタ
         */
        function NativeBinder() {
        }

        NativeBinder.queue = [];

        /**
         * パラメータ値取得
         * @return パラメータ値
         */
        NativeBinder.prototype.postRequest = function (reqUrl) {
            this.reqUrl = reqUrl;
            NativeBinder.queue.push(this)
            if (NativeBinder.queue.length == 1) {
                setTimeout(function() {
                    NativeBinder.queue[0].deQueue();
                }, 100);
            }
        };

        NativeBinder.prototype.deQueue = function () {
            NativeBinder.queue.splice(0, 1);
            if (NativeBinder.queue.length > 0) {
                setTimeout(function() {
                    NativeBinder.queue[0].deQueue();
                }, 100);
            }
            window.location.href = this.reqUrl;
        };

        NativeBinder.prototype.createQueueManagementKey = function () {
            return NativeBinder.createNativeBinderCallbackKey('native_binder_queue');
        };

        /**
         * ネイティブバインダのコールバックキーを生成（指定名に時間値を付加する）
         * @param 指定名
         */
        NativeBinder.createNativeBinderCallbackKey = function (name) {
            var key = name + "_" + (new Date()).getTime().toString(10);
            while (window.mws.callbacks[key] != undefined) {
                key = key + '_';
            }
            return key;
        };

        /**
         * NativeBinder.RequestParams
         */
        var RequestParams = (function () {
            /**
             * コンストラクタ
             * @param value 値
             * @param isText 文字列か（trueとした場合、文字列としてコーテーションで囲んで返却する）
             */
            function RequestParams(value, isText) {
                this._value = "";
                this._isText = true;
                this._value = value;
                this._isText = isText;
            }
            /**
             * パラメータ値取得
             * @return パラメータ値
             */
            RequestParams.prototype.getValue = function () {
                var value = this._value.replace("\"", "'");
                // return this._isText ? "\"" + this._value + "\"" : this._value;
                // 現状のネイティブバインダリクエストでは文字列をコーテーションで囲む想定は無し
                // URLエンコードを行う
                return encodeURIComponent(this._value);
            };
            return RequestParams;
        })();
        NativeBinder.RequestParams = RequestParams;

        return NativeBinder;
    })();
    HarmanOTA.NativeBinder = NativeBinder;

})(HarmanOTA || (HarmanOTA = {}));
//# sourceMappingURL=harman_ota_common.js.map
