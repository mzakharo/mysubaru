(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * ヘルプページ管理クラス
     */
    var RegionHelpPageManager = (function () {
        var _super = MobileOtaGen4.PageManagerGen4;

        __extends(RegionHelpPageManager, _super);

        var UI = MobileOtaGen4.UIGen4;

        function RegionHelpPageManager() {
            _super.apply(this, arguments);
        }

        /**
         * 初期化処理
         */
        RegionHelpPageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
       
            this.texts = null;
            this.backURL = null;
        };

            /**
         * 画面初期化
         * @param language 言語コード
         */
        RegionHelpPageManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // ローディング表示
            $.mobile.showPageLoadingMsg();
            // 文言取得
            this.texts = this.getPageText(language);

            var errorFunc = function (delegate) {
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
                    _this.genericError(true);
                }
            };

            // 画面項目設定
            _this.settingPageItem();
            // ローディング非表示
            $.mobile.hidePageLoadingMsg();

            // デバッグフラグONの場合
            if (HarmanOTA.useStubMultilingualTest) {
                //多言語対応テスト
                this.startMultilingualTest();
            } 
        };

         /**
         * 画面項目設定
         */
        RegionHelpPageManager.prototype.settingPageItem = function () {
            var _this = this;
            // OKボタンを生成
            this.$OK = $(RegionHelpPageManager.BUTTON_OK);
            UI.PageBottomButton.create(this.$OK);
            UI.PageBottomButton.setLabel(this.$OK, this.texts.ok);
            UI.PageBottomButton.setClickedCallback(this.$OK, function ($target) {
                //KVSに値を保存（初回のみ表示とするため）
                _this.ahaConnectSDKSettings.settings_gen4.help_shown = true;
                _this.ahaConnectSDKSettings.writeSettings(function () {
                    //hubPageへ遷移（切り分け）
                    window.location.href = "./hub_gen4.html";
                });
            });
            
           //タイトル 
            var $helpTitle = $("#helpTitle");
            $helpTitle.empty();
            $helpTitle.text(this.texts.helpTitle);
            this.enabledRtl($helpTitle, this.isEnabledRtl, false);

            //説明
            var $howToUse = $("#howToUse");
            $howToUse.empty();
            $howToUse.html(this.texts.howToUse);
            this.enabledRtl($howToUse, this.isEnabledRtl, false);

            //注意 
            var $caution = $("#caution");
            $caution.empty();
            $caution.html(this.texts.caution);
            this.enabledRtl($caution, this.isEnabledRtl, false);

            //画像追加
            $("#image_heip").empty();
            UI.Image.createImage($("#image_heip"), PAGE_ID);
                
            //遷移元のURLを取得
            var beforePage = HarmanOTA.Common.getQueryString("beforePage");
            var beforePage_dec = decodeURIComponent(beforePage);
            if (beforePage_dec != undefined && beforePage_dec != "") {
                //設定画面から遷移の場合はOKボタンを表示しない
                this.$OK.css("visibility","hidden");
                // 設定画面へ遷移
                _this.backURL = beforePage_dec;
            } else {
                _this.backURL = RegionHelpPageManager.RootPagePath+(JSON.parse(getMemoryAppInfo())).country;
            }

            // Backボタンのイベント設定
            $('#back').on('click', function() {
                window.location.href = _this.backURL;
            });

        };

         /**
         * 文言取得
         * @param language 言語コード
         */
        RegionHelpPageManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "helpTitle", "id": "HTML_TXT_0165_", "language": language },
                { "key": "howToUse", "id": "HTML_TXT_0166_", "language": language },
                { "key": "caution", "id": "HTML_TXT_0167_", "language": language },
                { "key": "ok", "id": "OTHER_011_", "language": language },
                { "key": "cautionDownloadAll", "id": "HTML_TXT_0068_", "language": language },
            ];
            return this.buildText(textsList);
        };

        RegionHelpPageManager.prototype.reloadListPage = function () {
            //画面リロード
            this.settingPageItem();

        };

        RegionHelpPageManager.ModuleName = "MobileOta.RegionHelpPageManager";

        RegionHelpPageManager.BUTTON_OK = "#OK";

        var controller = MobileOtaGen4.Controller.getInstance();
        var PAGE_ID = "help_list";
        controller.addPage(PAGE_ID, function () {
            return new RegionHelpPageManager();
        });
        return RegionHelpPageManager;
    })();
})();