(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * 画面遷移制御ページ管理クラス
     */
    var HubPageManagerGen4 = (function () {
        var _super = MobileOtaGen4.PageManagerGen4;

        __extends(HubPageManagerGen4, _super);

        var MobileOta = MobileOtaGen4;
        var AnalyseAhaConnectSDKResponse = MobileOtaGen4.AnalyseAhaConnectSDKResponseGen4;
        var UI = MobileOtaGen4.UIGen4;
        var AhaConnectSDKController = MobileOtaGen4.AhaConnectSDKControllerGen4;

        function HubPageManagerGen4() {
            _super.apply(this, arguments);
        }

        /**
         * 初期化処理
         */
        HubPageManagerGen4.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.selected_area = null;
         };
        /**
         * 画面初期化
         * @param language 言語コード
         */
        HubPageManagerGen4.prototype.initPage = function (language) {
            console.log("[I][huPageManager_gen4][initPage]start");
            var _this = this;
            var country_regionName_map;

            _super.prototype.initPage.call(this, language);
            // ローディング表示
            console.log("[I][huPageManager_gen4][initPage]Loading spinner");
            $.mobile.showPageLoadingMsg();
            
            this.loadData() // データ読み出し
                .then(function () {
                    console.log("[I][huPageManager_gen4][initPage][loadData]start");

                    //counrty_regionName_map.jsonとマッピング
                    $.getJSON(
                        HubPageManagerGen4.COUNTRY_REGIONNAME_MAP, //リクエストURL
                        null, //送信データ
                        function (data, status) {
                            console.log("[I][huPageManager_gen4][initPage][loadData][getJSON]country_regionName_map.json file read complete.");
        
                            // 通信成功時の処理
                            country_regionName_map = data;
                            
                            if (HarmanOTA.useStubMultilingualTest) {
                                //多言語テストロジック実行
                                try {
                                    MultilingualSimulator.getInstance().goToPage();
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                console.log("[I][huPageManager_gen4][initPage][loadData][getJSON]transitionPage start");
                                //画面遷移
                                _this.transitionPage(country_regionName_map);

                            }

                        }).fail(function (delegate) {
                            //JSONファイル読み込み失敗時
                            console.log("[E][huPageManager_gen4][initPage][loadData][getJSON]country_regionName_map.json file read not complete.");
        
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

                    console.log("[I][huPageManager_gen4][initPage][loadData]end");

                }, function (delegate) {
                    console.log("[E][huPageManager_gen4][initPage][loadData] error start");
                    // ローディング非表示
                    $.mobile.hidePageLoadingMsg();
                    if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                        console.log("[E][huPageManager_gen4][initPage][loadData] delegate");
                        delegate.delegateErrorHandle();
                    }
                    else {
                        console.log("[E][huPageManager_gen4][initPage][loadData] error delegate");
                        // 汎用エラー
                        _this.genericError(true);
                    }
                    console.log("[E][huPageManager_gen4][initPage][loadData] error end");
                });

            console.log("[I][huPageManager_gen4][initPage]end");

        };
        /**
         * データ読み込み
         * @return jQuery Deferredオブジェクト
         */
        HubPageManagerGen4.prototype.loadData = function () {
            var _this = this;
            var deferred = jQuery.Deferred();
            // 設定読み込み
            this.ahaConnectSDKSettings.readSettings(function (result) {
                if (result) {
                    _this.deviceCode = _this.ahaConnectSDKSettings.deviceCode;
                    _this.productCode = _this.ahaConnectSDKSettings.productCode;
                    _this.selected_area = _this.ahaConnectSDKSettings.settings_gen4.selected_area;
                }
                else {
                    MobileOta.Common.log(HubPageManagerGen4.ModuleName, "fail loadData readSettings");
                    deferred.rejectWith(_this);
                    return;
                }

                // 地図データ情報取得
                _this.ahaConnectSDKController.getCurrentMapDetails(_this.deviceCode, _this.productCode, function (data, result) {
                    if (!result) {
                        deferred.rejectWith(_this);
                        return;
                    }
                    if (data.data.length <= 0 || data.data[0].mapJson == undefined) {
                        // データが存在しない場合はエラーメッセージを表示しconfig画面に遷移
                        var delegate = {
                            delegateErrorHandle: function () {
                                // getCurrentMapDetailsが取得できない
                                _this.getCurrentMapDetailsError(true);
                            }
                        };
                        deferred.rejectWith(_this, [delegate]);
                        return;
                    }
                    
                    //レスポンスデータを取得
                    _this.mapDetails = data;
                    deferred.resolveWith(_this);
                });
            });
            return deferred.promise();
        };

        HubPageManagerGen4.prototype.goToNextPage = function (country_regionName_map, nameFromSDK) {
            var _this = this;
            console.log("[I][hubPageManager_gen4][goToNextPage]start");
            console.log("[I][hubPageManager_gen4][goToNextPage]location.href = "+location.href);

            //タイムアウト設定
            var timeoutpagetransit = window.setTimeout(function () {
                HarmanOTA.UI.Alert.alert("Connection error. Please try again.");
                window.location.href = "../../index.html?countrycode=";
            }, 3000); //★Timeout 3sec

            //取得結果に応じて画面遷移
            for (i = 0; i < country_regionName_map.countrys.length; i++) {
                //nameが一致する場合
                if (country_regionName_map.countrys[i].name == nameFromSDK) {
                    //北米の場合
                    if (country_regionName_map.countrys[i].name == HubPageManagerGen4.NORTH_AMERICA) {

                        //地域情報設定が未設定、もしくは「USA,CAN,MEX」のいずれに該当しない場合
                        if (_this.selected_area == undefined || _this.valueNorthAmerica.indexOf(_this.selected_area) < 0) {
                            //地域設定画面に遷移
                            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 1");
                            window.location.href = HubPageManagerGen4.RegionSelectionPath;
                            return;

                        } else if (_this.selected_area == "OTHER") {
                            //OTHER選択の場合、リスト画面へ遷移
                            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 2");
                            window.location.href = HubPageManagerGen4.RegionListPath;
                            return;

                        } else {
                            //上記以外の場合、地図画面を表示する
                            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 3");
                            window.location.href = HubPageManagerGen4.RegionMapPath;
                            return;
                        }
                    //欧州、豪州の場合
                    } else if ((country_regionName_map.countrys[i].name == HubPageManagerGen4.EUROPE)
                            || (country_regionName_map.countrys[i].name == HubPageManagerGen4.OCEANIA)) {

                        if (_this.selected_area == "OTHER") {
                            //OTHER選択の場合、リスト画面へ遷移
                            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 5");
                            window.location.href = HubPageManagerGen4.RegionListPath;
                            return;
                        } else {
                            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 6");
                            window.location.href = HubPageManagerGen4.RegionMapPath;
                            return;
                        }
                    } else {
                        //北米、欧州、豪州以外の地域の場合
                        console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 7");
                        window.location.href = HubPageManagerGen4.RegionListPath;
                        return;
                    }

                }
            };
            //マッピングの結果マッチするデータがなければリスト画面へ移動
            console.log("[I][hubPageManager_gen4][goToNextPage]#9707 goToNextPage 5");
            window.location.href = HubPageManagerGen4.RegionListPath;
        }

        /**
         * getCurrentMapDetailsのnameから対象国を取得
         * @param country_regionName_map.json
         */
        HubPageManagerGen4.prototype.transitionPage = function(country_regionName_map) {
            console.log("[I][huPageManager_gen4][transitionPage]start");
            var _this = this;
            //getCurrentMapDetailsのname
            var nameFromSDK = this.mapDetails.data[0].mapJson.nds_product[0].name; 
            // データ読み出し
            getKeyValue("launcher_user_area") 
            .then(function (data) {
                console.log("[I][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area]start");
                var change = (data != undefined) && (_this.selected_area != "OTHER") && (data != _this.selected_area);
                //既存のキーとgen4用のキーを突合し、一致しない場合はKVS選択済み地域データを削除する
                if (change) {
                    //選択地域を変更
                    _this.selected_area = data;
                }

                if(change && _this.valueNorthAmerica.indexOf(_this.selected_area) >= 0) {
                    _this.ahaConnectSDKSettings.settings_gen4.selected_area = _this.selected_area;
                    console.log("[I][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area]selected_area = "+_this.selected_area);
                    _this.ahaConnectSDKSettings.writeSettings(function() {
                        console.log("[I][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area][writeSettings]goToNextPage");
                        //ページ遷移
                        _this.goToNextPage(country_regionName_map, nameFromSDK);                
                    });
                } else {
                    console.log("[I][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area]goToNextPage");
                    //ページ遷移
                    _this.goToNextPage(country_regionName_map, nameFromSDK);
                }
                console.log("[I][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area]end");

            }, function () {
                console.log("[E][huPageManager_gen4][transitionPage][getKeyValue:launcher_user_area]error");
            });
            console.log("[I][huPageManager_gen4][transitionPage]end");
        };

        /**
         * ルートページ（config画面）へ遷移
         * （コンテンツ側で予期せぬエラーが発生した場合に使用）
         * ※gen4用に戻り先を変更
         */
        HubPageManagerGen4.prototype.backToRootPage = function () {
            console.log("#9707 backToRootPage");
            HarmanOTA.Common.transitionPage(HubPageManagerGen4.RootPagePath+(JSON.parse(getMemoryAppInfo())).country);
        };

        
        //マッピング用geojsonURL
        HubPageManagerGen4.COUNTRY_REGIONNAME_MAP = "./js/mappingJson/country_regionName_map.json";
        HubPageManagerGen4.ModuleName = "MobileOta.hubPageManagerGen4";

        var controller = MobileOta.Controller.getInstance();
        var PAGE_ID = "hub_gen4";
        controller.addPage(PAGE_ID, function () {
            return new HubPageManagerGen4();
        });
        return HubPageManagerGen4;
    })();
})();
