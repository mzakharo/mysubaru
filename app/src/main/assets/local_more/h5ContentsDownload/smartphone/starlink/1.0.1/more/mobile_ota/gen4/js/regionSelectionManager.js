(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * 地域選択ページ管理クラス
     */
    var RegionSelectionManager = (function () {
        var _super = MobileOtaGen4.PageManagerGen4;

        __extends(RegionSelectionManager, _super);

        var MobileOta = MobileOtaGen4;
        var AnalyseAhaConnectSDKResponse = MobileOtaGen4.AnalyseAhaConnectSDKResponseGen4;
        var UI = MobileOtaGen4.UIGen4;
        var AhaConnectSDKController = MobileOtaGen4.AhaConnectSDKControllerGen4;

        function RegionSelectionManager() {
            _super.apply(this, arguments);
        }

        /**
         * 初期化処理
         */
        RegionSelectionManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.selected_area = null;
            this.changeArea = false;  // 地域が変更されたか
        };
        
        /**
         * 画面初期化
         * @param language 言語コード
         */
        RegionSelectionManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // 文言取得
            this.texts = this.getPageText(language);

            // 画面項目設定
            _this.settingPageItem(language);

            // ローディング表示
            $.mobile.showPageLoadingMsg();

            // データ読み出し
            _this.selected_area = _this.ahaConnectSDKSettings.settings_gen4.selected_area;

            _this.ahaConnectSDKController.getCurrentMapDetails(_this.ahaConnectSDKSettings.deviceCode, _this.ahaConnectSDKSettings.productCode, function (data, result) {
               if (!result) {
                   return;
               }

                var hulocation = data.data[0].mapJson.nds_product[0].name;

                if (hulocation == this.MobileOtaGen4.PageManagerGen4.NORTH_AMERICA) {
                    //KVSに値が保存されていない場合、もしくは北米以外の国を選択している場合
                    if(!(_this.selected_area != undefined  && _this.valueNorthAmerica.indexOf(_this.selected_area) >= 0)){
                        //アメリカを初期選択
                        _this.selected_area = "USA";
                        _this.changeArea = true;
                    }
                } else {
                    if( (_this.selected_area == undefined) ||  (_this.selected_area == "")){
                        //MAPを初期選択
                        _this.selected_area = "MAP";
                    }
                }

                //初期選択処理
                $("#location_" + _this.selected_area).prop("checked",true).checkboxradio("refresh");
                //ハッチング解除
                $("input[type=radio]").prop("disabled",false).checkboxradio("refresh");

                document.getElementById("Selectioncontent").style.visibility = "visible";
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();

                // デバッグフラグONの場合
                if (HarmanOTA.useStubMultilingualTest) {
                    //多言語対応テスト
                    this.startMultilingualTest();
                }
            });
        };

        /**
         * 画面項目設定
         */
        RegionSelectionManager.prototype.settingPageItem = function (language) {
            var _this = this;

            // 利用地域選択画面タイトル
            $target = $("#LOCATION_TITLE_001");
            $target.text(this.texts.title);
            MobileOta.Common.enabledRtl($target,  this.isEnabledRtl, false);

            //リスト文言設定
            _this.setSelectionList(language);

            // OKボタンを生成
            this.$OK = $(RegionSelectionManager.BUTTON_OK);
            UI.PageBottomButton.create(this.$OK);
            UI.PageBottomButton.setLabel(this.$OK, this.texts.ok);
            UI.PageBottomButton.setClickedCallback(this.$OK, function ($target) {

                // KVS(selected_area)に値を書き込み（初回のみ表示とするため）
                var selectLocation = $("input[type=radio]:checked").val();

                _this.ahaConnectSDKController.getCurrentMapDetails(_this.ahaConnectSDKSettings.deviceCode, _this.ahaConnectSDKSettings.productCode, function (data, result) {
                   if (!result) {
                       return;
                   }

                    var hulocation = data.data[0].mapJson.nds_product[0].name;

                    switch (hulocation) {

                        case this.MobileOtaGen4.PageManagerGen4.NORTH_AMERICA:

                            _this.ahaConnectSDKSettings.settings_gen4.selected_area = selectLocation;

                            if (_this.selected_area != selectLocation) {
                                //「selected_regions」を初期化
                                _this.ahaConnectSDKSettings.settings_gen4.selected_regions = [];
                            }

                            setKeyValue("launcher_user_area",selectLocation);
                            _this.ahaConnectSDKSettings.writeSettings(function () {
                                var goNextPage = function (selectLocation) {
                                    goNextPage = null;

                                    if(selectLocation == "OTHER"){
                                        // リスト画面へ遷移
                                        window.location.href = RegionSelectionManager.RegionListPath;
                                    } else {
                                        //地図画面へ遷移
                                        window.location.href = RegionSelectionManager.RegionMapPath;
                                    }
                                };

                                if (_this.changeArea || selectLocation != _this.selected_area) {
                                    _this.initCancelDownload(function() {
                                        _this.cancelDownload(function (result) {
                                            goNextPage(selectLocation);
                                        });
                                    });
                                } else {
                                    goNextPage(selectLocation);
                                }
                            });

                        break;


                        case this.MobileOtaGen4.PageManagerGen4.EUROPE:
                        case this.MobileOtaGen4.PageManagerGen4.OCEANIA:

                            _this.ahaConnectSDKSettings.settings_gen4.selected_area = selectLocation;

                            if (_this.selected_area != selectLocation) {
                                //「selected_regions」を初期化
                                _this.ahaConnectSDKSettings.settings_gen4.selected_regions = [];
                            }

                            _this.ahaConnectSDKSettings.writeSettings(function () {
                                var goNextPage = function (selectLocation) {
                                    goNextPage = null;

                                    if(_this.ahaConnectSDKSettings.settings_gen4.selected_area == "OTHER"){
                                        // リスト画面へ遷移
                                        window.location.href = RegionSelectionManager.RegionListPath;
                                    } else {
                                        //地図画面へ遷移
                                        window.location.href = RegionSelectionManager.RegionMapPath;
                                    }
                                };

                                if (selectLocation != _this.selected_area) {
                                    _this.initCancelDownload(function() {
                                        _this.cancelDownload(function (result) {
                                            goNextPage(_this.ahaConnectSDKSettings.settings_gen4.selected_area);
                                        });
                                    });
                                } else {
                                    goNextPage(_this.ahaConnectSDKSettings.settings_gen4.selected_area);
                                }

                            });

                        break;


                        default:

                        break;

                    }
                });
            }); 
            
            // Backボタンのイベント設定
            $('#back').on('click', function() {
                var beforePage = HarmanOTA.Common.getQueryString("beforePage");
                var beforePage_dec = decodeURIComponent(beforePage);

                if (beforePage_dec != undefined && beforePage_dec != "") {
                    // 設定画面へ遷移
                    window.location.href = beforePage_dec;
                } else {
                    // MOREタブ画面へ遷移
                    window.location.href = RegionSelectionManager.RootPagePath+(JSON.parse(getMemoryAppInfo())).country;
                }    
            });
            
        };

         /**
         * 文言取得
         * @param language 言語コード
         */
        RegionSelectionManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "title", "id": "HTML_TXT_0205_", "language": language },
                { "key": "title100", "id": "HTML_TXT_0205_A_", "language": language },
                { "key": "usa", "id": "LOCATION_002_", "language": language },
                { "key": "can", "id": "LOCATION_003_", "language": language },
                { "key": "mex", "id": "LOCATION_004_", "language": language },
                { "key": "other", "id": "LOCATION_999_", "language": language },
                { "key": "europe", "id": "SL_TXT_0204_A_", "language": language },
                { "key": "oceania", "id": "HTML_TXT_9999_", "language": language },
                { "key": "ok", "id": "OTHER_011_", "language": language },
                { "key": "cautionDownloadAll", "id": "HTML_TXT_0068_", "language": language },
            ];
            return this.buildText(textsList);
        };


        RegionSelectionManager.prototype.setSelectionList = function (language) {

            var $target = null;
            var isEnabledRtl = getMemoryEnabledRtl();
            var _this = this;

            _this.ahaConnectSDKController.getCurrentMapDetails(_this.ahaConnectSDKSettings.deviceCode, _this.ahaConnectSDKSettings.productCode, function (data, result) {
               if (!result) {
                   return;
               }

                // 文言取得
                var texts = _this.getPageText(language);
                var hulocation = data.data[0].mapJson.nds_product[0].name;

                switch (hulocation) {

                    case this.MobileOtaGen4.PageManagerGen4.NORTH_AMERICA:

                        // アメリカ
                        $target = $("#LOCATION_002");
                        $target.text(texts.usa);
                        MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
                        // カナダ
                        $target = $("#LOCATION_003");
                        $target.text(texts.can);
                        MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
                        // メキシコ
                        $target = $("#LOCATION_004");
                        $target.text(texts.mex);
                        MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);

                        break;

                    case this.MobileOtaGen4.PageManagerGen4.EUROPE:

                        // EUROPE
                        $target = $("#LOCATION_002");
                        $target.text(texts.europe);
                        MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);

                    break;

                    case this.MobileOtaGen4.PageManagerGen4.OCEANIA:

                        // OCEANIA
                        $target = $("#LOCATION_002");
                        $target.text(texts.oceania);
                        MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);

                    break;

                default:

                    break;
                }

                // Others
                $target = $("#LOCATION_999");
                $target.text(texts.other);
                MobileOta.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
             });

        };

        RegionSelectionManager.prototype.reloadListPage = function () {
            //画面リロード
            this.settingPageItem();
        };

        //URL
        RegionSelectionManager.ModuleName = "MobileOta.regionSelectionManager";

        RegionSelectionManager.BUTTON_OK = "#OK";

        var controller = MobileOta.Controller.getInstance();
        var PAGE_ID = "regionSelection";
        controller.addPage(PAGE_ID, function () {
            return new RegionSelectionManager();
        });
        return RegionSelectionManager;
    })();
})();
