

var MultilingualTestSenario_PageMovement = (function () {

    MultilingualSimulator.MultilingualTestSenario_PageMovement = MultilingualTestSenario_PageMovement;

    MultilingualTestSenario_PageMovement.INTERVAL = 1000; //リロードの間隔を変更

    var _this = null;
    function MultilingualTestSenario_PageMovement() {
        _this = this;
        _this.queue = [];
        _this.language_queue = [];
        _this.pageManager = null;
        _this.timer = null;
        _this.word = new Word();
}

    MultilingualTestSenario_PageMovement.prototype.getPageManager = function () {
        if (_this.pageManager != null) {
            return _this.pageManager;
        }
        return null;
    }

    MultilingualTestSenario_PageMovement.prototype.goToPage = function (url) {
        // 地図画面へ遷移
        location.href = url;
    }

    MultilingualTestSenario_PageMovement.prototype.start = function (pageManager) {

        // pageManager設定
        _this.pageManager = pageManager;

        //OTA使用言語リスト取得
        _this.languages = _this.word.otaLangList;

        window.alert("画面の多言語対応確認を実施します。");
    
        //初回の言語表示
        _this.startTest();

        // ２回目以降のリロード用Timer
        _this.timer = setInterval(function () {
            _this.startTest();
        }, MultilingualTestSenario_PageMovement.INTERVAL);
    
    }



    MultilingualTestSenario_PageMovement.prototype.startTest = function () {

        console.log("****************" + this.languages[0] + "******************");

        // 初期値設定
        this.getPageManager().baseTexts = this.getPageManager().getBasePageText(this.languages[0]);
        this.getPageManager().texts = _this.getPageManager().getPageText(this.languages[0]);
        this.getPageManager().isEnabledRtl = HarmanOTA.Common.judgeEnabledRtl(this.languages[0]);
        this.getPageManager().huModel = HarmanOTA.stubVehicleSettings.huModel;
        // ボタン文言リロード
        this.getPageManager().setBasePageItem();
        // リロード
        this.getPageManager().reloadListPage();
        // デキュー
        this.deQueue();
    };


    MultilingualTestSenario_PageMovement.prototype.deQueue = function () {

        if (this.languages.length == 0) {
            // Timerを削除
            clearTimeout(this.timer);
            //ポップアップ表示
            window.alert("処理が終了しました。MOREタブTOPへ遷移します。");
            if (location.href.indexOf("huupd_settings") < 0) {
                location.href = "../../index.html";
            } else {
                location.href = "./index.html";
            }
        }

        if (this.languages.length > 0) {
            var _this = this;
            // キューの先頭を削除
            _this.languages.splice(0, 1);
            _this = null;
        }
    }

    return MultilingualTestSenario_PageMovement;
})();
