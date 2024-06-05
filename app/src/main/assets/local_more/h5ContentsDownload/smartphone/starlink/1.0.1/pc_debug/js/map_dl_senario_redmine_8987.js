
var MapDownloadSenario_Redmine8987 = (function () {

    function MapDownloadSenario_Redmine8987() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario_Redmine8987 = MapDownloadSenario_Redmine8987;

    MapDownloadSenario_Redmine8987.prototype.start = function () {
        window.setupDebugOTASettings("891168936", "3122895924");

        var queue = this.queue;
        for (var status = 0; status < 17; status++) {
            queue.push({
                "notify": "downloadStatus", "data": [
                    {
                        "deviceCode": "891169368", "productCode": "3122895924", "productID": 272145, "supplierID": 28, "baselineID": 13977, "regionID": 307, "fromVersion": 1, "toVersion": 18,
                        "status": status,
                        "totalSize": 569708
                    }]
            });
        }
        for (var status = 0; status < 8; status++) {
            queue.push({
                "notify": "accessoryTransferStatus", "data": [{
                    "deviceCode": "891169368", "productID": 272145, "productCode": "3122895924", "baselineID": 13977,
                    "accessoryTransferStatus": status,
                    "supplierID": 28, "fromVersion": 1, "toVersion": 18, "regionID": 307
                }]
            });
        }
    }

    return MapDownloadSenario_Redmine8987;
})();
