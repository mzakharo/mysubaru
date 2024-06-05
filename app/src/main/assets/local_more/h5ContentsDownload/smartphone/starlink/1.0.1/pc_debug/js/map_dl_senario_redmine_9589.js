
var MapDownloadSenario_Redmine9589 = (function () {

    function MapDownloadSenario_Redmine9589() {
        this.queue = [];
    }

    var Senario = MapDownloadSenario_Redmine9589;

    MapDownloadSenarioManager[Senario + ""] = Senario;

    Senario.prototype.start = function () {

        var queue = this.queue;
        var deviceCode = '891167361';
        var productCode = '3122895924';
        var productID = 4663057;
        var baselineID = 14738;
        var supplierID = 28;
        var fromVersion = 1;
        var toVersion = 27;

        window.setupDebugOTASettings(deviceCode, productCode);

        var queue_regionUpdateAvailable = {
            "notify": "regionUpdateAvailable",
            "data": [
                {
                    "deviceCode": deviceCode,
                    "productCode": productCode,
                    "productID": productID,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                    "fromVersion": fromVersion,
                    "toVersion": toVersion,
                    "regionID": 304,
                    "totalSize": 569708,
                    "fileID": "config\/891169368_3122895924\/307.json"
                }]
        };

        queue.push(queue_regionUpdateAvailable);

        for (var i = 1; i < (10 * 1000 / MapDownloadSenarioManager.INTERVAL) + 1; i++) {
            queue.push(Queue.wait);
        }

        // queue.push(Queue.extend_didAccessoryDisconnect);

        queue.push(queue_regionUpdateAvailable);
    }

    return Senario;
})();
