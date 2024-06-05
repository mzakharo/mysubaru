var Const_kvs_senario_queue_resume = 'Const_kvs_senario_queue_resume';

$(function () {
    setTimeout(function () {
        var senario_queue = localStorage.getItem(Const_kvs_senario_queue_resume);
        var manager = MapDownloadSenarioManager.getInstance();
        manager.restored = true;
        if (senario_queue != null) {
            manager.senario.queue = JSON.parse(senario_queue);
            manager.deQueue();
        }

    }, 3000);
});


// 正常系のシナリオです。
var MapDownloadSenarioManager = (function () {

    MapDownloadSenarioManager.INTERVAL = 500;

    function MapDownloadSenarioManager() {
        if (HarmanOTA.stubVehicleSettings.huModel.indexOf('CP1.0') == 0) {
            //  this.senario = new MapDownloadSenarioDL_Transfer_Map();
             this.senario = new MapDownloadSenarioDL_Transfer_Map();
            //this.senario = new MapDownloadSenarioDL_Map();
            // this.senario = new MapDownloadSenarioDL_Transfer_List();
            // this.senario = new MapDownloadSenario_Disconnect_onProgress_Gen4();
            // this.senario = new MapDownloadSenario002();
            // this.senario = new MapDownloadSenario003();
            // this.senario = new MapDownloadSenario004();
            // this.senario = new MapDownloadSenario005();
            // this.senario = new MapDownloadSenario_Redmine9174();
            // this.senario = new MapDownloadSenarioNonSelectProgress_DL();
            //this.senario = new MapDownloadSenarioNonSelectProgress_TR();
            // this.senario = new MapDownloadSenario_Redmine8987();
            // this.senario = new MapDownloadSenario_Redmine9150();
            // this.senario = new MapDownloadSenario_Redmine9196();
            // this.senario = new MapDownloadSenario_Redmine9249();
            // this.senario = new MapDownloadSenario_Redmine9255();
            // this.senario = new MapDownloadSenario_Redmine9589();
            // this.senario = new MapDownloadSenarioDisconnectAfterDownload();
            // this.senario = new MapDownloadSenario_DL_Transfer_Map_Europe();
            // this.senario = new MapDownloadSenario_DL_Transfer_Map_Oceania();

        } else {
            // this.senario = new MapDownloadSenario002_Gen3();
            this.senario = new MapDownloadSenarioGen3_Installing();
            // this.senario = new MapDownloadSenario_Cancel_DL_onVehicle_Gen3();
            // this.senario = new MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3();
            // this.senario = new MapDownloadSenario_Disconnect_onProgress_Gen3();
        }


        this.timeoutId = null;

    }

    var _instance = null;
    MapDownloadSenarioManager.getInstance = function () {
        if (_instance == null) {
            _instance = new MapDownloadSenarioManager();
        }
        return _instance;
    }

    MapDownloadSenarioManager.prototype.stop = function () {
        localStorage.removeItem(Const_kvs_senario_queue_resume);
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.senario.queue = [];
    }

    MapDownloadSenarioManager.prototype.start = function () {
        this.stop();
        this.senario.start();
        this.deQueue();
    }

    MapDownloadSenarioManager.prototype.deQueue = function () {
        if (this.senario.queue.length == 0) {
            return;
        }
        var payload = this.senario.queue[0];
        this.senario.queue.splice(0, 1);
        localStorage.setItem(Const_kvs_senario_queue_resume, JSON.stringify(this.senario.queue));

        payload.type = 'contents_senario';
        HarmanOTA.AhaConnectHTMLSDK.getInstance().debugNotifyData(payload, HarmanOTA.AhaConnectSDK_JsonType, 'test');
        if (payload.func != undefined) {
            setTimeout(function() {
                payload.func();                
            }, MapDownloadSenarioManager.INTERVAL / 2);
        }

        if (this.senario.queue.length > 0) {
            var _this = this;
            this.timeoutId = setTimeout(function () {
                _this.deQueue();
                _this = null;
            }, MapDownloadSenarioManager.INTERVAL);
        }
    }

    HarmanOTA.MapDownloadSenarioManager = MapDownloadSenarioManager;

    return MapDownloadSenarioManager;
})();

var Queue = {};
Queue.extend_didAccessoryDisconnect = {
    "notify": "extend_didAccessoryDisconnect"
};
Queue.extend_didAccessoryConnect = {
    "notify": "extend_didAccessoryConnect"
};
Queue.wait = {
    "notify": "dummy",
    "data": [
        {
        },
    ],
};
Queue.extend_onNativeEvent = {
    "notify": "extend_onNativeEvent"
};


