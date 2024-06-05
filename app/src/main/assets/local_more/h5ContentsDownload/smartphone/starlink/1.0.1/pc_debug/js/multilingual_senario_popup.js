
var MultilingualTestSenario_Popup = (function () {

    function MultilingualTestSenario_Popup() {
        this.queue = [];
    }

    MultilingualSimulator.MultilingualTestSenario_Popup = MultilingualTestSenario_Popup;

    MultilingualTestSenario_Popup.INTERVAL = 1000;

    var _this = null;
    function MultilingualTestSenario_Popup() {
        _this = this;
        _this.texts = null;
        _this.pageManager = null;
        _this.textqueue = [];
        _this.word = new Word();
        _this.languages = null;
        _this.timerShow = null;
        _this.textIds = [];
    }


    MultilingualTestSenario_Popup.prototype.getPageManager = function () {
        if (_this.pageManager != null) {
            return _this.pageManager;
        }
        return null;
    }

    MultilingualTestSenario_Popup.prototype.goToPage = function (url) {
        location.href = url;
    }

    MultilingualTestSenario_Popup.prototype.start = function (pageManager) {

        //pageManager設定
        _this.pageManager = pageManager;

        // 文言取得
        _this.texts = _this.getPageText();

        _this.goNext();
    }

    MultilingualTestSenario_Popup.prototype.goNext = function () {
        //ポップアップ表示
        _this.showDialog(_this.getPageManager().dialogType.ok, "Use the following languages : " + _this.texts[0].language, function () {
        });

        setTimeout(function(){
            _this.getPageManager().closeModalDialog();
            _this.startTest();
        }, MultilingualTestSenario_Popup.INTERVAL);
    }


    MultilingualTestSenario_Popup.prototype.startTest = function () {

        // ウィンドウを閉じる
        this.getPageManager().closeModalDialog();

        // キュー作成
        _this.setQueue();

        // ダイアログ表示用Timer
        _this.timerShow = setInterval(function () {
            _this.deQueue();
            _this.showDialog();
        }, MultilingualTestSenario_Popup.INTERVAL);
    };


    MultilingualTestSenario_Popup.prototype.setQueue = function () {

        if (_this.getPageManager() != null) {
            var texts = _this.texts[0].value;
            for (var i = 0; i < Object.keys(texts).length; i++) {
                var key = Object.keys(texts)[i];
                _this.textqueue.push({ 'key': key, 'text': texts[key] });
            }
        }

    }

    MultilingualTestSenario_Popup.prototype.deQueue = function () {

        // ウィンドウを閉じる
        _this.getPageManager().closeModalDialog();

        if (_this.textqueue.length == 0) {
            // Timerを削除
            clearTimeout(_this.timerShow);
            if (_this.texts.length != 0) {
                // キューの先頭を削除
                _this.texts.splice(0, 1);

                if (_this.texts.length != 0) {
                    _this.goNext();
                }
            }
            return;
        }

        if (_this.textqueue.length > 0) {
            // キューの先頭を削除
            _this.textqueue.splice(0, 1);
        }
    }

    MultilingualTestSenario_Popup.prototype.getPageText = function () {

        //OTA使用言語リスト取得
        _this.languages = _this.word.otaLangList;

        var multilingualText = new Array();

        for (var i = 0; i < _this.languages.length; i++) {
            language = _this.languages[i];
            var texts = {
                "HTML_TXT_0173_": this.word["HTML_TXT_0173_" + language], // popupDownloading
                "HTML_TXT_0186_": this.word["HTML_TXT_0186_" + language], // popupStopDownloading
                "HTML_TXT_0182_": this.word["HTML_TXT_0182_" + language], // popupAllDownloadCompleted
                "APP_TXT_0176_": this.word["APP_TXT_0176_" + language],   // popupDownloadFailed
                "HTML_TXT_0190_": this.word["HTML_TXT_0190_" + language], // popupUpdating
                "HTML_TXT_0172_": this.word["HTML_TXT_0172_" + language], // popupCapacityExceeded
                "HTML_TXT_0183_": this.word["HTML_TXT_0183_" + language], // deleteDownloadedMap
                "HTML_TXT_0184_": this.word["HTML_TXT_0184_" + language], // succeededMapDelete
                "HTML_TXT_0185_": this.word["HTML_TXT_0185_" + language], // failedMapDelete
                "HTML_TXT_0174_": this.word["HTML_TXT_0174_" + language], // searchingRegions
                "HTML_TXT_0178_": this.word["HTML_TXT_0178_" + language], // noDataFromNominatim
                "HTML_TXT_0179_": this.word["HTML_TXT_0179_" + language], // sameWithCurrentPosition
                "HTML_TXT_0175_": this.word["HTML_TXT_0175_" + language], // autoRegionsSetting
                "HTML_TXT_0180_": this.word["HTML_TXT_0180_" + language]  // settingRegionsForTheFirstTime
            };

            multilingualText.push({
                "language": language,
                "value": texts
            });

        }

        return multilingualText;
    };

    MultilingualTestSenario_Popup.prototype.showDialog = function (type, text, callback) {

        //ダイアログ表示
        if (type == undefined || type == null) {
            type = _this.getPageManager().dialogType.okcancel;
        }

        if (text == undefined || text == null) {
            if (_this.textqueue.length == 0) {
                return;
            }
            text = _this.textqueue[0].text;
            if (text == undefined || text == null || text.length == 0) {
                var key = _this.textqueue[0].key + _this.texts[0].language;
                text = key + ' is undefined.';
                var tmpText = "";
                eval(this.word.createWordingToEval("tmpText", "this.word", _this.textqueue[0].key, _this.texts[0].language));
                text = text + '\n\n(show default)\n' + tmpText;
            }
        }

        switch (type) {
            case _this.getPageManager().dialogType.none:
                _this.getPageManager().createModalDialogNoButton(text);
                break;

            case _this.getPageManager().dialogType.ok:
                _this.getPageManager().createModalDialogOkButton(text, callback);
                break;

            case _this.getPageManager().dialogType.cancel:
                _this.getPageManager().createModalDialogCancelButton(text, callback);
                break;

            case _this.getPageManager().dialogType.okcancel:
                _this.getPageManager().createModalDialogOkCancelButton(text, callback, callback);
                break;

            default:
                break;

        }
    }


    return MultilingualTestSenario_Popup;
})();
