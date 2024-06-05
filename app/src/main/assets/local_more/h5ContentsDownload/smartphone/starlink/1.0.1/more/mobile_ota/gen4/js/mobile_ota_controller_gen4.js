(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * Gen4画面のベースクラス
     */
    var PageManagerGen4 = (function () {
        var _super = MobileOtaGen4.PageManager;
        var count = 0;

        __extends(PageManagerGen4, _super);

        PageManagerGen4.COUNTRY_CODE_NORTH_AMERICA = ["USA", "CAN", "MEX", "OTHER"];  //北米
        function PageManagerGen4() {
            _super.apply(this, arguments);
            this.valueNorthAmerica = PageManagerGen4.COUNTRY_CODE_NORTH_AMERICA;
            //ISO 3166 alpha-3とISO 3166 alpha-2の変換
            this.countryCodeConvert = {
                "USA": "US",
                "CAN": "CA",
                "MEX": "MX",
                "OTHER": "OTHER"
            };
        }

        PageManagerGen4.prototype.initialize = function () {
            console.log("[I][mobile_ota_controller_gen4][initialize]start");
            _super.prototype.initialize.call(this);
            this.ahaConnectSDKSettings = new MobileOtaGen4.AhaConnectSDKSettings();
            this.ahaConnectSDKController = new MobileOtaGen4.AhaConnectSDKControllerGen4();
            this.ahaConnectSDKSettings = new MobileOtaGen4.AhaConnectSDKSettingsGen4();
            console.log("[I][mobile_ota_controller_gen4][initialize]end");
        };

        /**
         * 画面初期化
         * @param language 言語コード
         */
        PageManagerGen4.prototype.initPage = function (language) {
            _super.prototype.initPage.call(this, language);
            this.baseTexts = this.getBasePageText(language);
        };

        /**
         * 画面項目設定（共通処理）
         */
        PageManagerGen4.prototype.settingPageItem = function () {
            //設定画面へのリンクボタン設定
            // Backボタンのイベント設定
            $('#setting').on('click', function() {
                var beforePage_enc = encodeURIComponent(window.location.href);
                var settingPageUrl = "../../huupd_settings.html?beforePage=" + beforePage_enc ;
                    
                if (settingPageUrl != undefined && settingPageUrl != "") {
                    window.location.href = settingPageUrl;
                }
            });
        };

        /**
         * 文言取得
         * @param language 言語コード
         */
        PageManagerGen4.prototype.getBasePageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var superTexts = _super.prototype.getBasePageText.call(this, language);
            var textsList = [
                { "key": "getCurrentMapDetailsError", "id": "SL_TXT_0214_", "language": language },
            ];
            var texts = this.buildText(textsList);
            for (var key in texts) {
                superTexts[key] = texts[key];
            }
            return superTexts;
        };
        /**
         * getCurrentMapDetailsエラー
         * @param backToRootPage アラート出力後にルートページへ遷移するか
         */
        PageManagerGen4.prototype.getCurrentMapDetailsError = function (backToRootPage) {
            debugger;

            console.log("[getCurrentMapDetailsError]reload!");
            if (count > 3) {
                   count = 0;
                // アラート出力
                HarmanOTA.UI.Alert.alert(this.baseTexts.getCurrentMapDetailsError);
                if (backToRootPage) {
                    // ルートページへ戻る
                    this.backToRootPage();
                }
            } else {
                count++;
            }
            window.location.reload();
        };

        //URL
        PageManagerGen4.RootPagePath = "./../../index.html?countrycode=";
        PageManagerGen4.SettingPagePath = "./../../huupd_settings.html";

        PageManagerGen4.PagePath = "../mobile_ota/gen4/hub_gen4.html";
        PageManagerGen4.RegionListPath = "./regionList.html";
        PageManagerGen4.RegionMapPath = "./regionMap.html";
        PageManagerGen4.RegionSelectionPath = "./regionSelection.html";

        PageManagerGen4.ModuleName = "MobileOta.PageManagerGen4";
    
        //getCurrentMapDetailsのName
        PageManagerGen4.NORTH_AMERICA = "North America";
        PageManagerGen4.EUROPE = "Europe";
        PageManagerGen4.OCEANIA = "Oceania";
        PageManagerGen4.GEOJSON_URL = "./js/geojson/geojson_";

        return PageManagerGen4;
    })();
    MobileOtaGen4.PageManagerGen4 = PageManagerGen4;

})();