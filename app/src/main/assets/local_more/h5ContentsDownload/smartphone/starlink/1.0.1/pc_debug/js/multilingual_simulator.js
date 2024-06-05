var Const_kvs_senario_pagemove_url = 'Const_kvs_senario_pagemove_url';

// 正常系のシナリオです。
var MultilingualSimulator = (function () {

    var _this = null;
    function MultilingualSimulator() {
        if (HarmanOTA.stubVehicleSettings.huModel.indexOf('CP1.0') == 0) {
            // シナリオ指定
            this.senario = new MultilingualTestSenario_Popup();       //ポップアップ確認
            // this.senario = new MultilingualTestSenario_PageMovement();   //画面遷移確認
            
            this.pages = [ 
                            "../../../more/mobile_ota/gen4/regionMap.html",
                            "../../../more/mobile_ota/gen4/regionList.html",
                            "../../../more/mobile_ota/gen4/regionHelp.html",
                            "../../../more/mobile_ota/gen4/regionSelection.html",
                            "../../../more/huupd_settings.html"
                        ];
                 
        } else {
            
        }

    }

    var _instance = null;
    MultilingualSimulator.getInstance = function () {
        if (_instance == null) {
            _instance = new MultilingualSimulator();
        }
        return _instance;
    }

    MultilingualSimulator.prototype.setPageManager = function (pageManager) {
        this.pageManager = pageManager;
    }

    MultilingualSimulator.prototype.getPageManager = function (pageManager) {
        if (this.pageManager != null) {
            return this.pageManager;
        }
        return null;
    }

    MultilingualSimulator.prototype.goToPage = function () {
        var url_queue = localStorage.getItem(Const_kvs_senario_pagemove_url);
        if (url_queue != null && JSON.parse(url_queue).length > 0) {
            this.senario.queue = JSON.parse(url_queue);
        } else {
            this.senario.queue = this.pages;
        }
        var url = this.senario.queue[0];
        localStorage.removeItem(Const_kvs_senario_pagemove_url);
        this.deQueue();
        
        this.senario.goToPage(url);
    }

    MultilingualSimulator.prototype.start = function () {
        this.senario.start(this.pageManager);
    }

     // デキュー
     MultilingualSimulator.prototype.deQueue = function () {

        if (this.senario.queue.length > 0) {
            // キューの先頭を削除
            this.senario.queue.splice(0, 1);
            localStorage.setItem(Const_kvs_senario_pagemove_url, JSON.stringify(this.senario.queue));

        } else {
            console.log('MultilingualSimulator : error');
        }
    }

    HarmanOTA.MultilingualSimulator = MultilingualSimulator;

    return MultilingualSimulator;
})();