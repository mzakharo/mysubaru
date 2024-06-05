var MapDownloadSenario_Redmine9150 = (function () {

    function MapDownloadSenario_Redmine9150() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario_Redmine9150 = MapDownloadSenario_Redmine9150;

    MapDownloadSenario_Redmine9150.prototype.start = function () {
        var queue = this.queue;

        queue.push({
            "notify": "regionUpdateAvailable",
            "data": [
                {
                    "deviceCode": "891167361",
                    "fileID": "\/TT\/8911673613122895924\/28\/14738\/4663057\/452\/452.json",
                    "toVersion": 3,
                    "productCode": "3122895924",
                    // "regionID": 452,
                    "regionID": 304,
                    "productID": 4663057,
                    "totalSize": 2658728,
                    "fromVersion": 1,
                    "baselineID": 14738,
                    "supplierID": 28
                }
            ]
        });
        for (var i = 1; i < ((120 * 1000) / MapDownloadSenarioManager.INTERVAL); i++) {
            queue.push({
                "notify": "dummy",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "fileID": "\/TT\/8911673613122895924\/28\/14738\/4663057\/452\/452.json",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        // "regionID": 452,
                        "regionID": 304,
                        "productID": 4663057,
                        "totalSize": 2658728,
                        "fromVersion": 1,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });
        }
        for (var i = 1; i < 11; i++) {
            queue.push({
                "notify": "accessoryFileTransferProgress",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "totalSize": 0,
                        "productID": 4663057,
                        // "regionID": 452,
                        "regionID": 304,
                        "fromVersion": 1,
                        "supplierID": 28,
                        "progress": i * 10,
                        "baselineID": 14738
                    }
                ]
            });
        }
        queue.push({
            "notify": "accessoryTransferStatus",
            "data": [
                {
                    "deviceCode": "891167361",
                    "toVersion": 3,
                    "productCode": "3122895924",
                    // "regionID": 452,
                    "regionID": 304,
                    "productID": 4663057,
                    "accessoryTransferStatus": 3,
                    "fromVersion": 1,
                    "supplierID": 28,
                    "baselineID": 14738
                }
            ]
        });
    }

    return MapDownloadSenario_Redmine9150;
})();