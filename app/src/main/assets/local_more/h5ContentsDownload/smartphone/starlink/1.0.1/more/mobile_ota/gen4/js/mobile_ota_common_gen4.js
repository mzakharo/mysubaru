
var MobileOtaGen4 = (function () {
    var _super = HarmanOTA;

    __extends(MobileOtaGen4, _super);
    function MobileOtaGen4() {
        _super.apply(this, arguments);
    }

    return MobileOtaGen4;

})();

(function () {

    var MobileOta = MobileOtaGen4;
    var MAP_DATA_CATEGORY = MobileOtaGen4.MAP_DATA_CATEGORY;
    var AhaConnectSDK_DownloadStatus = MobileOtaGen4.AhaConnectSDK_DownloadStatus;
    var AhaConnectSDK_AccessoryTransferStatus = MobileOtaGen4.AhaConnectSDK_AccessoryTransferStatus;
    MobileOtaGen4.AhaConnectSDK_Notify_accessoryInformation = "accessoryInformation";
    MobileOtaGen4.AhaConnectSDK_Notify_error = "error";
    MobileOtaGen4.AhaConnectSDK_Notify_currentMapDetails = "currentMapDetails";

    /**
     * 共通処理クラス
     */
    var CommonGen4 = (function () {
        var _super = MobileOta.Common;
        __extends(CommonGen4, _super);
        function CommonGen4() {
            _super.apply(this, arguments);
        }

        MobileOtaGen4.CommonGen4 = CommonGen4;

        CommonGen4.KVS_KEY_MOBILE_OTA_SETTINGS_GEN4 = "mobile_ota_gen4";
        return CommonGen4;
    })();

    /**
     * AhaConnect SDK レスポンス解析クラス
     */
    // var AnalyseGen4 = (function (_super) {
    var AnalyseAhaConnectSDKResponseGen4 = (function () {
        var _super = MobileOta.AnalyseAhaConnectSDKResponse;
        __extends(AnalyseAhaConnectSDKResponseGen4, _super);
        function AnalyseAhaConnectSDKResponseGen4() {
            _super.apply(this, arguments);
        }

        MobileOtaGen4.AnalyseAhaConnectSDKResponseGen4 = AnalyseAhaConnectSDKResponseGen4;
        var AnalyseAhaConnectSDKResponse = AnalyseAhaConnectSDKResponseGen4;

        /**
        * AhaConnect SDK getCurrentMapDetailsのレスポンスからコンテンツに必要なデータ構成に変換する
        * @param deviceData デバイス関連のデータ（analyseCurrentMapDetailsDeviceDataのレスポンスJSON）
        * @param productData プロダクト関連のデータ（analyseCurrentMapDetailsProductDataのレスポンスJSON）
        * @param regionData リージョンデータ（AhaConnect SDKのgetCurrentMapDetailsのレスポンス内のRegions配列部）
        * @return 変換結果（以下JSON構成）
        * {
        *     "key":{
         *        "deviceCode":[デバイスコード:string],
        *         "productCode":[プロダクトコード:string],
        *         "productID":[プロダクトID:number],
        *         "supplierID":[サプライヤID:number],
        *         "baselineID":[ベースラインID:number],
        *         "regionID":[リージョンID:number]
        *     },
        *     "name":[地域名:string],
        *     "fromVersion":[現在のバージョン:number],
        *     "size":[サイズ:number],
        * }
        */
        AnalyseAhaConnectSDKResponse.createGen4RegionViewData = function (deviceData, productData, regionData) {
            if (deviceData == null || productData == null || regionData == null ||
                regionData.id == null) {
                return null;
            }
            var key = {};
            //key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = deviceData.deviceCode;
            key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = deviceData.deviceCode;

            key[MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE] = deviceData.productCode;
            key[MobileOta.AhaConnectSDK_KEY_PRODUCT_ID] = productData.productID;
            key[MobileOta.AhaConnectSDK_KEY_SUPPLIER_ID] = productData.supplierID;
            key[MobileOta.AhaConnectSDK_KEY_BASELINE_ID] = productData.baselineID;
            key[MobileOta.AhaConnectSDK_KEY_REGION_ID] = regionData.id;
            var data = {};
            data[MobileOta.AhaConnectSDK_KEY_KEY] = key;
            data[MobileOta.AhaConnectSDK_KEY_NAME] = regionData.name;
            data[MobileOta.AhaConnectSDK_KEY_FROM_VERSION] = regionData.version_id;
            data[MobileOta.AhaConnectSDK_KEY_SIZE] = regionData.size;
            return data;
            /*
            return {
                "key": {
                    "deviceCode": deviceData.deviceCode,
                    "productCode": deviceData.productCode,
                    "productID": productData.productID,
                    "supplierID": productData.supplierID,
                    "baselineID": productData.baselineID,
                    "regionID": regionData.id
                },
                "name": regionData.name,
                "fromVersion": regionData.version_id,
                "size": regionData.size,
            };
            */
        };

        /**
          * AhaConnect SDK getCurrentMapDetailsのレスポンスを解析する
          * @param data getCurrentMapDetailsのレスポンスJSON
          * @return 解析結果（createRegionViewDataの返却JSON）
          */
        AnalyseAhaConnectSDKResponse.analyseCurrentMapDetails = function (data) {
            if (data == null || data.data == null || data.data.length == 0) {
                return [];
            }
            var analyseData = new Array();
            for (var dataIndex = 0; dataIndex < data.data.length; dataIndex++) {
                var deviceData = AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsDeviceData(data, dataIndex);
                // TODO:要確認 data.data[dataIndex].mapJson.nds_product.length
                for (var productIndex = 0; productIndex < data.data[dataIndex].mapJson.nds_product.length; productIndex++) {
                    var productData = AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsProductData(data, dataIndex, productIndex);
                    var regionDatas = AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsCategory(data, dataIndex, productIndex);
                    if (regionDatas == null) {
                        continue;
                    }
                    var categories = [
                        MAP_DATA_CATEGORY.NOT_DOWNLOAD,
                        MAP_DATA_CATEGORY.NOT_UPDATE,
                        MAP_DATA_CATEGORY.UPDATED,
                        MAP_DATA_CATEGORY.INDEFINITE
                    ];
                    for (var i = 0; i < categories.length; i++) {
                        var category = categories[i];
                        if (analyseData[category] == undefined || analyseData[category].length == 0) {
                            analyseData[category] = new Array();
                        }
                        for (var j = 0; j < regionDatas[category].length; j++) {
                            var viewData = AnalyseAhaConnectSDKResponse.createGen4RegionViewData(deviceData, productData, regionDatas[category][j]);
                            if (viewData != null) {
                                analyseData[category].push(viewData);
                            }
                        }
                    }
                }
            }
            if (analyseData.length == 0) {
                return [];
            }
            return analyseData;
        };

        /**
        * AhaConnect SDK getCurrentMapDetailsのRegions部のカテゴリ解析
        * @param data getCurrentMapDetailsのレスポンスJSON
        * @return カテゴリ毎のRegions配列（MAP_DATA_CATEGORYの値をキーとした連想配列にArrayを割り当て）
        */
        AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsCategory = function (data, dataIndex, productIndex) {
            if (!_super.checkDataLength(data, dataIndex)) {
                return null;
            }
            data = data.data[dataIndex].mapJson;
            if (data.nds_product[productIndex].nds_region == null || data.nds_product[productIndex].nds_region.length == 0) {
                return null;
            }
            var regionDatas = data.nds_product[productIndex].nds_region;
            var regions = new Array();
            regions[MAP_DATA_CATEGORY.NOT_DOWNLOAD] = new Array();
            regions[MAP_DATA_CATEGORY.NOT_UPDATE] = new Array();
            regions[MAP_DATA_CATEGORY.UPDATED] = new Array();
            regions[MAP_DATA_CATEGORY.INDEFINITE] = new Array();
            for (var i = 0; i < regionDatas.length; i++) {
                var regionData = regionDatas[i];
                var category = MAP_DATA_CATEGORY.INDEFINITE;
                regions[category].push(regionData);
            }
            return regions;
        };

        /**
         * AhaConnect SDK getCurrentMapDetailsのレスポンスのデバイス関連のデータ解析
         * @param data getCurrentMapDetailsのレスポンスJSON
         * @return デバイス関連のデータJSON
         */
        AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsDeviceData = function (data, dataIndex) {
            if (!_super.checkDataLength(data, dataIndex)) {
                return null;
            }
            data = data.data[dataIndex];
            if (data.deviceCode == null || data.productCode == null) {
                return null;
            }
            var key = {};
            key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = data.deviceCode;
            key[MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE] = data.productCode;
            return key;
            /*
            return {
                "deviceCode": data.deviceCode,
                "productCode": data.productCode
            };
            */
        };
        /**
         * AhaConnect SDK getCurrentMapDetailsのレスポンスのプロダクト関連のデータ解析
         * @param data getCurrentMapDetailsのレスポンスJSON
         * @return プロダクト関連のデータJSON
         */
        AnalyseAhaConnectSDKResponse.analyseCurrentMapDetailsProductData = function (data, dataIndex, productIndex) {
            if (!AnalyseAhaConnectSDKResponse.checkCurrentMapDetailsProductLength(data, dataIndex, productIndex)) {
                return null;
            }
            data = data.data[dataIndex].mapJson;
            var product = data.nds_product[productIndex];
            if (product.id == null || product.supplier_id == null || product.baseline_id == null) {
                return null;
            }
            return {
                "productID": product.id,
                "supplierID": product.supplier_id,
                "baselineID": product.baseline_id
            };
        };

        AnalyseAhaConnectSDKResponse.checkCurrentMapDetailsProductLength = function (data, dataIndex, productIndex) {
            if (!_super.checkDataLength(data, dataIndex)) {
                return false;
            }
            var data = data.data[dataIndex].mapJson;
            var error = data.nds_product == null || data.nds_product.length == 0 || data.nds_product.length <= productIndex;
            return !error;
        };

        return AnalyseAhaConnectSDKResponse;
    })();

    /**
     * AhaConnect SDKのコントローラー
     */
    var AhaConnectSDKControllerGen4 = (function () {
        var _super = MobileOtaGen4.AhaConnectSDKController;

        __extends(AhaConnectSDKControllerGen4, _super);
        function AhaConnectSDKControllerGen4() {
            _super.apply(this, arguments);
        }

        MobileOtaGen4.AhaConnectSDKControllerGen4 = AhaConnectSDKControllerGen4;
        var AhaConnectSDKController = AhaConnectSDKControllerGen4;

        /**
         * 初期化処理
         */
        AhaConnectSDKController.prototype.initialize = function () {
        };

        AhaConnectSDKController.prototype.createStub_retgetCurrentMapDetails = function (deviceCode, productCode) {
            HarmanOTA.stubRetgetCurrentMapDetails().deviceCode = deviceCode;
            HarmanOTA.stubRetgetCurrentMapDetails().productCode = productCode;
            HarmanOTA.stubRetgetCurrentMapDetails().mapJson.product_code = productCode;
            HarmanOTA.stubRetgetCurrentMapDetails().mapJson.device_code = deviceCode;
            return HarmanOTA.stubRetgetCurrentMapDetails();
        }

        AhaConnectSDKController.stubDownloadedRegionID = [];
        AhaConnectSDKController.prototype.createStub_retcheckForUpdate = function (param) {
            var data = JSON.parse(JSON.stringify(param.data));
            for(var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                var products = data[dataIndex].products;

                data[dataIndex].errorCode = 0;

                for(var productIndex = 0; productIndex < products.length; productIndex++) {

                    products[productIndex].id = param.data[dataIndex].products[productIndex].productID;
                    products[productIndex].versionID = 0;

                    var Regions = products[productIndex].Regions;
                    for(var regionIndex = 0; regionIndex < Regions.length; regionIndex++) {
                        
                        var targetRegions = Regions[regionIndex];
                        targetRegions.regionName = products[productIndex].name + regionIndex;
                        targetRegions.downloadStatus = 0;
                        for( var i = 0; i < AhaConnectSDKController.stubDownloadedRegionID.length; i++) {
                            var downloadedID = AhaConnectSDKController.stubDownloadedRegionID[i];
                            if (downloadedID == targetRegions.regionID) {
                                targetRegions.downloadStatus = 3;
                                break;
                            }
                        }
                        targetRegions.accessoryTransferStatus = 0;
                        targetRegions.Updates = [
                            {
                                'operation' : 0,
                                'size' : 57828,
                                'name' : '2018.04.01',
                                'toVersion' : 17,
                                'type' : 0
                            },
                            {
                                'operation' : 0,
                                'size' : 1000 * 1000 * 1000,
                                'name' : '2018.07.03',
                                'toVersion' : 18,
                                'type' : 1
                            },
                        ];
                    }                    
                }
            }
            return {
                'resp': 'checkForUpdate',
                'respCode' : 0,
                'data' : data,
            };
        };

        /**
         * 「GET CURRENT MAP DETAILS」をリクエスト
         * @param deviceCode デバイスコード
         * @param productCode プロダクトコード
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.getCurrentMapDetails = function (deviceCode, productCode, callback) {
            var deferred = jQuery.Deferred();

            var param = {};
            param[MobileOta.AhaConnectSDK_KEY_REQ] = MobileOta.AhaConnectSDK_KEY_GETCURRENTMAPDETAILS;
            var key = {};
            key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = deviceCode;
            key[MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE] = productCode;
            param[MobileOta.AhaConnectSDK_KEY_DATA] = new Array(key);
            /*
            var param = {
                "req": "getCurrentMapDetails",
                "data": [{
                    "deviceCode": deviceCode,
                    "productCode": productCode,
                }]
            };
            */
            var error = function (data) {
                deferred.reject(data);
                if (callback != null) {
                    callback(data, false);
                }
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubVehicleInfo) {
                var data = {
                    "resp": "getCurrentMapDetails",
                    "data": [
                        this.createStub_retgetCurrentMapDetails(HarmanOTA.stubVehicleSettings.deviceCode, HarmanOTA.stubVehicleSettings.productCode)
                    ]
                };
                this.stubSdkCallback(param, data, callback, true);
                return;
            }
            MobileOta.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type, errorCode) {
                Common.log(AhaConnectSDKController.ModuleName, "getCurrentMapDetails response");
                Common.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                Common.log(AhaConnectSDKController.ModuleName, "type = " + type);
                Common.log(AhaConnectSDKController.ModuleName, "errorCode = " + errorCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (errorCode == null || errorCode == MobileOta.AhaConnectSDK_ErrorCode_Success) {
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
                        Common.log(AhaConnectSDKController.ModuleName, "getCurrentMapDetails catch error");
                        error(null);
                    }
                }
                else {
                    error(null);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "getCurrentMapDetails " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });
            return deferred.promise();
        };

        /**
         * 「CHECK FOR UPDATE」をリクエスト
         * @param keys 
         * @param $regions
         * @param callback コールバック（引数でレスポンスを返却 data:返却JSONデータ、result:成否）
         * @return jQuery Deferredオブジェクト
         */
        AhaConnectSDKController.prototype.checkForUpdate = function (keysArray, $regions, callback) {
            console.log('checkForUpdate(org) start');

            var keys = keysArray[0];
            var param = {};
            param[MobileOta.AhaConnectSDK_KEY_REQ] = MobileOta.AhaConnectSDK_KEY_CHECKFORUPDATE;
            var key = {};
            key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = keys.deviceCode;
            key[MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE] = keys.productCode;
            var products = {};
            products[MobileOta.AhaConnectSDK_KEY_SUPPLIER_ID] = keys.supplierID;
            products[MobileOta.AhaConnectSDK_KEY_PRODUCT_ID] = keys.productID;
            products[MobileOta.AhaConnectSDK_KEY_BASELINE_ID] = keys.baselineID;
            products[MobileOta.AhaConnectSDK_KEY_REGIONS] = $regions;
            key[MobileOta.AhaConnectSDK_KEY_PRODUCTS] = new Array(products);
            param[MobileOta.AhaConnectSDK_KEY_DATA] = new Array(key);
            /*
            var param = {
                "req": "checkForUpdate",
                "data": [{
                    "deviceCode": keys.deviceCode,
                    "productCode": keys.productCode,
                    "products": [{
                        "supplierID": keys.supplierID,
                        "productID": keys.productID,
                        "baselineID": keys.baselineID,
                        "Regions": $regions,
                    }]
                }]
            };
            */
           return this.checkForUpdateWithParam(param, callback);
        }

        AhaConnectSDKController.prototype.checkForUpdateWithCurrentMapDetails = function (mapDetails, productCode, deviceCode, callback) {
            console.log('checkForUpdateWithCurrentMapDetails start');
            var params = {};
            params[MobileOta.AhaConnectSDK_KEY_REQ] = MobileOta.AhaConnectSDK_KEY_CHECKFORUPDATE;
            params.data = [];
            for(var dataIndex = 0; dataIndex < mapDetails.data.length; dataIndex++) {
                if (productCode != mapDetails.data[dataIndex].productCode || 
                    deviceCode != mapDetails.data[dataIndex].deviceCode)
                {
                    continue;
                }

                var paramData = {};
                params.data.push(paramData);

                var dataItem = mapDetails.data[dataIndex].mapJson;
                paramData.deviceCode = deviceCode;
                paramData.productCode = productCode;
                paramData.products = [];
                for(var productsIndex = 0; productsIndex < dataItem.nds_product.length; productsIndex++) {
                    var paramProduct = {};
                    paramData.products.push(paramProduct);
                    var productItem = dataItem.nds_product[productsIndex];
                    paramProduct.supplierID = productItem.supplier_id;
                    paramProduct.productID = productItem.id;
                    paramProduct.baselineID = productItem.baseline_id;
                    paramProduct.Regions = [];
                    for(var regionsIndex = 0; regionsIndex < productItem.nds_region.length; regionsIndex++) {
                        var paramRegion = {};
                        paramProduct.Regions.push(paramRegion);
                        var regionItem = productItem.nds_region[regionsIndex];
                        paramRegion.regionID = regionItem.id;
                        paramRegion.fromVersion = regionItem.version_id;
                    }
                }
            }
            return this.checkForUpdateWithParam(params, callback);
        }

        AhaConnectSDKController.prototype.checkForUpdateWithSelectregions = function (mapDetails, UpdateDataRow, productCode, deviceCode, callback) {
            console.log('checkForUpdateWithSelectregions start');
            var params = {};
            var _this = this;
            params[MobileOta.AhaConnectSDK_KEY_REQ] = MobileOta.AhaConnectSDK_KEY_CHECKFORUPDATE;
            params.data = [];
            var dataItem_currentData = mapDetails.data[0].mapJson.nds_product[0];

            try{
                var dataItem_selectData = UpdateDataRow[0].key;

                var paramData = {};
                params.data.push(paramData);

                paramData.deviceCode = deviceCode;
                paramData.productCode = productCode;
                paramData.products = [];

                var paramProduct = {};
                paramData.products.push(paramProduct);

                paramProduct.supplierID = dataItem_selectData.supplierID;
                paramProduct.productID = dataItem_selectData.productID;
                paramProduct.baselineID =dataItem_selectData.baselineID;

                paramProduct.Regions = [];

                for(var dataIndex = 0; dataIndex < UpdateDataRow.length; dataIndex++) {

                    var dataItem_selectData = UpdateDataRow[dataIndex].key;

                    for(var regionsIndex = 0; regionsIndex < dataItem_currentData.nds_region.length; regionsIndex++) {

                        var regionItem = dataItem_currentData.nds_region[regionsIndex];

                        if (regionItem.id == dataItem_selectData.regionID) {
                            var paramRegion = {};
                            paramProduct.Regions.push(paramRegion);
                            paramRegion.regionID = dataItem_selectData.regionID;
                            paramRegion.fromVersion = regionItem.version_id;
                            break;
                        }
                    }
                }
                return this.checkForUpdateWithParam(params, callback);
            } catch (e) {
               HarmanOTA.PageManager.prototype.setLoading(false);
               console.log('checkForUpdateWithSelectregions error!');
               return;
            }
        }

        AhaConnectSDKController.prototype.checkForUpdateWithoneregion = function (mapDetails, targetDataRow, callback) {
            console.log('checkForUpdateWithSelectregions start');
            var params = {};
            params[MobileOta.AhaConnectSDK_KEY_REQ] = MobileOta.AhaConnectSDK_KEY_CHECKFORUPDATE;
            params.data = [];
            var dataItem_currentData = mapDetails.data[0].mapJson.nds_product[0];

            var dataItem_selectData = targetDataRow;

            var paramData = {};
            params.data.push(paramData);

            paramData.deviceCode = dataItem_selectData.deviceCode;
            paramData.productCode = dataItem_selectData.productCode;
            paramData.products = [];

            var paramProduct = {};
            paramData.products.push(paramProduct);

            paramProduct.supplierID = dataItem_selectData.supplierID;
            paramProduct.productID = dataItem_selectData.productID;
            paramProduct.baselineID = dataItem_selectData.baselineID;

            paramProduct.Regions = [];

            for(var regionsIndex = 0; regionsIndex < dataItem_currentData.nds_region.length; regionsIndex++) {

                var regionItem = dataItem_currentData.nds_region[regionsIndex];

                if (regionItem.id == dataItem_selectData.regionID) {
                    var paramRegion = {};
                    paramProduct.Regions.push(paramRegion);
                    paramRegion.regionID = dataItem_selectData.regionID;
                    paramRegion.fromVersion = regionItem.version_id;
                    break;
                }
            }
            return this.checkForUpdateWithParam(params, callback);
        }


        AhaConnectSDKController.prototype.checkForUpdateWithParam = function (param, callback) {
            if (callback == undefined || callback == null) {
                callback = function () {};
            }
            var deferred = jQuery.Deferred();
            var error = function (data) {
                deferred.reject(data);
                callback(data, false);
            };
            // デバッグレスポンス
            if (HarmanOTA.useStubVehicleInfo) {
                var _this = this;
                setTimeout(function () {
                    var data = _this.createStub_retcheckForUpdate(param);
                    _this.stubSdkCallback(param, data, callback, true);
                }, 500);
                return;
            }
            MobileOta.AhaConnectHTMLSDK.getInstance().sendAsyncRequest(param, function (payload, type) {
                console.log(AhaConnectSDKController.ModuleName, "checkForUpdate response");
                console.log(AhaConnectSDKController.ModuleName, "payload = " + JSON.stringify(payload));
                console.log(AhaConnectSDKController.ModuleName, "type = " + type);
                console.log(AhaConnectSDKController.ModuleName, "payload.respCode = " + payload.respCode);
                if (type == AhaConnectSDKController.ResponseType) {
                    try {
                        if (payload.respCode == null || payload.respCode == MobileOta.AhaConnectSDK_ErrorCode_Success) {
                            callback(payload, true);
                            deferred.resolve(payload, true);
                        }
                        else {
                            error(payload);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        Common.log(AhaConnectSDKController.ModuleName, "checkForUpdate catch error");
                        error(null);
                    }
                }
                else {
                    error(null);
                }
            }, function (result) {
                Common.log(AhaConnectSDKController.ModuleName, "checkForUpdate " + (result ? "success" : "fail"));
                if (!result) {
                    error(null);
                }
            });
            return deferred.promise();
        }

        return AhaConnectSDKController;
    })();

    var AhaConnectSDKSettingsGen4 = (function () {
        var _super = MobileOta.AhaConnectSDKSettings;
        __extends(AhaConnectSDKSettingsGen4, _super);
        function AhaConnectSDKSettingsGen4() {
            _super.apply(this, arguments);
        }

        MobileOtaGen4.AhaConnectSDKSettingsGen4 = AhaConnectSDKSettingsGen4;
        var AhaConnectSDKSettings = AhaConnectSDKSettingsGen4;

        AhaConnectSDKSettings.prototype.createDetaultSettingsGen4 = function () {
            return {
                'notify_current_map_details': {
                    'deviceCode' : '',
                    'productCode' : '',
                },
                'help_shown': false,
                'select_firstTime': true,
                'selected_regions': [
                ],
                'selected_area': '',
            };
        }

        /**
         * 初期化処理
         */
        AhaConnectSDKSettings.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.settings_gen4 = this.createDetaultSettingsGen4();
            this.ahaConnectSDKController = new MobileOtaGen4.AhaConnectSDKControllerGen4();
            // savePropertysGen4 : 保存する項目をここに定義する
            this.savePropertysGen4 = {
                'notify_current_map_details' : '',
                'help_shown' : '',
                'select_firstTime': '',
                'selected_regions' : '',
                'selected_area': '',
            };
        };

        AhaConnectSDKSettings.prototype.readSettings = function (callback) {
            var _this = this;
            _super.prototype.readSettings.call(this, function (result) {
                console.log("#9325  AhaConnectSDKSettings.prototype.readSettingsGen4() call");
                _this.readSettingsGen4(function () {
                    if (callback != undefined && callback != null) {
                        callback(result);
                    }
                });
            });
        }

        /**
         * KVSから設定を読み出す(hook readSettings)
         * @param callback コールバック（引数で成否を返却）
         */
        AhaConnectSDKSettings.prototype.readSettingsGen4 = function (callback) {
            var _this = this;
            HarmanOTA.CommonHTMLSDK.getInstance().readKVS(MobileOta.CommonGen4.KVS_KEY_MOBILE_OTA_SETTINGS_GEN4, function (key, value) {
                console.log("#9325  HarmanOTA.CommonHTMLSDK.getInstance().readKVS() callback");

                if (value == null) {
                    _this.settings_gen4 = _this.createDetaultSettingsGen4();
                } else {
                    _this.settings_gen4 = JSON.parse(value);
                    var defaultDataGen4 = _this.createDetaultSettingsGen4();
                    for (var key in defaultDataGen4) {
                        var property = _this.settings_gen4[key];
                        if (property == undefined || property == null) {
                            _this.settings_gen4[key] = defaultDataGen4[key];
                        }
                    }
                }

                if (_this.settings_gen4.selected_regions == undefined) {
                    console.log('readSettingsGen4 : selected_regions is undefined.');
                    _this.settings_gen4.selected_regions = [];
                }

                if (HarmanOTA.useStubVehicleInfo) {
                    for (var key in HarmanOTA.stubMobileOtaSettings) {
                        var property = _this.settings_gen4[key];
                        if (property == undefined || property == null) {
                            _this.settings_gen4[key] = defaultDataGen4[key];
                        }
                    }
                    console.log(JSON.stringify(_this.settings_gen4));
                    var useStubNotify = false;
                    var mapJson = _this.settings_gen4.notify_current_map_details.mapJson;
                    if (mapJson == undefined || mapJson == null) {
                        useStubNotify = true;
                    } else {
                        var nds_product = mapJson.nds_product;
                        if (nds_product == undefined || nds_product == null) {
                            useStubNotify = true;
                        }
                    }
                    if (useStubNotify) {
                        _this.settings_gen4.notify_current_map_details = HarmanOTA.stubMobileOtaSettings.notify_current_map_details;
                    }
                }

                if (callback != null) {
                    callback(_this.settings_gen4);
                }
            });
        };

        AhaConnectSDKSettings.prototype.writeSettings = function (callback) {
            var _this = this;
            _super.prototype.writeSettings.call(this, function (result) {
                _this.writeSettingsGen4(function () {
                    if (callback != undefined && callback != null) {
                        callback(result);
                    }
                });
            });
        }

        /**
         * KVSへ設定を書き込む(hook writeSettings)
         * @param callback コールバック（引数で成否を返却）
         */
        AhaConnectSDKSettings.prototype.writeSettingsGen4 = function (callback) {
            var _this = this;
            var writeData = {};

            for (var key in _this.savePropertysGen4) {
                if (_this.savePropertysGen4.hasOwnProperty(key)) {
                    var value = _this.settings_gen4;
                    if (value != undefined && value != null) {
                        writeData[key] = _this.settings_gen4[key];
                    }
                }
            }

            _this.readSettingsGen4(function (data) {

                // 書き込み用データをマージ
                for (var key in data) {
                    var property = writeData[key];
                    if (property == undefined || property == null) {
                        writeData[key] = data[key];
                    }
                }

                // 一度、readしているので自身のプロパティを更新
                for (var key in writeData) {
                    _this.settings_gen4[key] = writeData[key];
                }

                HarmanOTA.CommonHTMLSDK.getInstance().writeKVS(MobileOta.CommonGen4.KVS_KEY_MOBILE_OTA_SETTINGS_GEN4, JSON.stringify(writeData), function (keyGen4, valueGen4, resultGen4) {
                    if (callback == null) {
                        return;
                    }
                    callback(resultGen4);
                });
            });
        };

        AhaConnectSDKSettings.prototype.getRegionIdList = function () {
            if (this.deviceCode == null || this.productCode == null) {
                return [];
            }
            var result = [];
            var resultBeforeSort = [];
            var selected_regions = this.settings_gen4.selected_regions;
            for (var selectIndex = 0; selectIndex < selected_regions.length; selectIndex++) {
                var data = selected_regions[selectIndex];
                if (this.deviceCode != data.deviceCode ||
                    this.productCode != data.productCode) {
                    continue;
                }
                var regions = data.products[0].Regions;
                for (var i = 0; i < regions.length; i++) {
                    resultBeforeSort.push({"regionID" : regions[i].regionID,
                                           "timestamp" : regions[i].timestamp});
                }
            }

            //timestampの昇順に並び替え
            resultBeforeSort.sort(function(a,b) {
                return (a.timestamp > b.timestamp ? 1 : -1);
            });
            //regionIDのみ抽出
            for (var i = 0; i < resultBeforeSort.length; i++) {
                result.push(resultBeforeSort[i].regionID);
            }

            return result;
        }

        AhaConnectSDKSettings.prototype.getCurrentMapDetailData = function (currentMapDetail) {
            if (currentMapDetail == undefined || currentMapDetail == null ||
                currentMapDetail.data == undefined || currentMapDetail.data == null) {
                return;
            }

            for (var dataIndex = 0; dataIndex < currentMapDetail.data.length; dataIndex++) {
                var currentData = currentMapDetail.data[dataIndex];
                if (this.deviceCode != currentData.deviceCode ||
                    this.productCode != currentData.productCode) {
                    continue;
                }
                return currentData;
            }
            return null;
        }

        AhaConnectSDKSettings.prototype.createSelectedRegions = function (currentMapDetail, regionIDList) {
            var currentData = this.getCurrentMapDetailData(currentMapDetail);
            var product = currentData.mapJson.nds_product[0];
            var targetRegions = {
                'productCode': currentData.productCode,
                'deviceCode': currentData.deviceCode,
                "errorCode": '0',
                'products': [
                    {
                        'supplierID': product.supplier_id,
                        'productID': product.id,
                        'baselineID': product.baseline_id,
                        'Regions': [
                        ]
                    }
                ]
            };
            for (var regionIndex = 0; regionIndex < product.nds_region.length; regionIndex++) {
                var region = product.nds_region[regionIndex];
                for (var idIndex = 0; idIndex < regionIDList.length; idIndex++) {
                    var regionID = regionIDList[idIndex];
                    if (regionID == region.id) {
                        var timestamp = Date.now();
                        targetRegions.products[0].Regions.push({
                            'regionID': region.id,
                            'fromVersion': region.version_id,
                            'timestamp' : timestamp,
                        });
                    }
                }
            }
            return targetRegions;
        }

        AhaConnectSDKSettings.prototype.isSameVehicleRegion = function (regions1, regions2) {
            var r1_products = regions1.products[0];
            var r2_products = regions2.products[0];
            if (regions1.productCode != regions2.productCode ||
                regions1.deviceCode != regions2.deviceCode ||
                r1_products.supplierID != r2_products.supplierID ||
                r1_products.productID != r2_products.productID ||
                r1_products.baselineID != r2_products.baselineID) {
                return false;
            }
            return true;
        }

        AhaConnectSDKSettings.prototype.getSameRegion = function (selectedRegions, region) {
            var regionsList = selectedRegions.products[0].Regions;
            for (var i = 0; i < regionsList.length; i++) {
                var selected = regionsList[i];
                if (region.regionID == selected.regionID) {
                    return selected;
                }
            }
            return null;
        }

        AhaConnectSDKSettings.prototype.addRegion = function (currentMapDetail, regionIDList) {
            var targetRegions = this.createSelectedRegions(currentMapDetail, regionIDList);

            if (this.settings_gen4.selected_regions == undefined) {
                console.log('addRegion : selected_regions is undefined.');
                this.settings_gen4.selected_regions = [];
            }

            var selected_regions = this.settings_gen4.selected_regions;
            if (selected_regions.length == 0) {
                this.settings_gen4.selected_regions.push(targetRegions);
            } else {
                // 追加済みデータとマージ
                for (var selectIndex = 0; selectIndex < selected_regions.length; selectIndex++) {
                    var selected = selected_regions[selectIndex];
                    if (this.isSameVehicleRegion(selected, targetRegions)) {
                        var regionsList = targetRegions.products[0].Regions;
                        for (var targetIndex = 0; targetIndex < regionsList.length; targetIndex++) {
                            var target = regionsList[targetIndex];
                            var sameRegion = this.getSameRegion(selected, target);
                            if (sameRegion != null) {
                                sameRegion.fromVersion = target.fromVersion;
                            } else {
                                selected.products[0].Regions.push(target);
                            }
                        }
                    } else {
                        this.settings_gen4.selected_regions.push(targetRegions);
                    }
                }
            }
            var len = this.settings_gen4.selected_regions.length;
            if (len > 2) {
                this.settings_gen4.selected_regions.splice(0, len - 1);
            }
        };

        AhaConnectSDKSettings.prototype.removeArrayItem = function (sourceList, removeList) {
            for (var i = 0; i < removeList.length; i++) {
                var remove = removeList[i];
                var index = sourceList.indexOf(remove);
                if (index > -1) {
                    sourceList.splice(index, 1);
                }
            }
        }

        AhaConnectSDKSettings.prototype.removeRegion = function (currentMapDetail, regionIDList) {
            if (this.settings_gen4.selected_regions.length == 0) {
                return;
            }

            var selected_regions = this.settings_gen4.selected_regions;
            var targetRegions = this.createSelectedRegions(currentMapDetail, regionIDList);
            var targetProducts = targetRegions.products[0];

            var noselect = [];
            for (var selectIndex = 0; selectIndex < selected_regions.length; selectIndex++) {
                var selected = selected_regions[selectIndex];
                if (this.isSameVehicleRegion(selected, targetRegions)) {
                    for (var targetIndex = 0; targetIndex < targetProducts.Regions.length; targetIndex++) {
                        var target = targetProducts.Regions[targetIndex];
                        var remove = this.getSameRegion(selected, target);
                        if (remove != null) {
                            this.removeArrayItem(selected.products[0].Regions, [remove]);
                        }
                    }
                }

                if (selected.products[0].Regions.length == 0) {
                    noselect.push(selected);
                }
            };
            this.removeArrayItem(this.settings_gen4.selected_regions, noselect);
        }

        // 車載切り替え時の設定初期化
        AhaConnectSDKSettings.prototype.changeVehicle = function () {
            var defaultSettings = this.createDetaultSettingsGen4();
            this.settings_gen4.notify_current_map_details = defaultSettings.notify_current_map_details;
            this.settings_gen4.selected_regions = defaultSettings.selected_regions;
        }

        return AhaConnectSDKSettings;
    })();

    // 定数
    MobileOta.AhaConnectSDK_KEY_DEVICE_CODE = "deviceCode";
    MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE = "productCode";
    MobileOta.AhaConnectSDK_KEY_PRODUCT_ID = "productID";
    MobileOta.AhaConnectSDK_KEY_BASELINE_ID = "baselineID";
    MobileOta.AhaConnectSDK_KEY_SUPPLIER_ID = "supplierID";
    MobileOta.AhaConnectSDK_KEY_REGION_ID = "regionID";
    MobileOta.AhaConnectSDK_KEY_FROM_VERSION = "fromVersion";
    MobileOta.AhaConnectSDK_KEY_TO_VERSION = "toVersion";

    MobileOta.AhaConnectSDK_KEY_GETCURRENTMAPDETAILS = "getCurrentMapDetails";
    MobileOta.AhaConnectSDK_KEY_CHECKFORUPDATE = "checkForUpdate";

    MobileOta.AhaConnectSDK_KEY_REGIONS = "Regions";
    MobileOta.AhaConnectSDK_KEY_PRODUCTS = "products";
    MobileOta.AhaConnectSDK_KEY_KEY = "key";
    MobileOta.AhaConnectSDK_KEY_NAME = "name";
    MobileOta.AhaConnectSDK_KEY_SIZE = "size";
    MobileOta.AhaConnectSDK_KEY_INFO = "info";
    MobileOta.AhaConnectSDK_KEY_STATUS = "status";

    MobileOta.AhaConnectSDK_KEY_DOWNLOADSTATUS = "downloadStatus";
    MobileOta.AhaConnectSDK_KEY_ACCESSORYTRANSFERSTASUS = "accessoryTransferStatus";

})();
