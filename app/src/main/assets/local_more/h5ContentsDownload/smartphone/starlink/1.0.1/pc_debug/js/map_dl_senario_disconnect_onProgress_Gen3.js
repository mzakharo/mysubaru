/**
 * 正常：DL中にBT切断した場合
 */
var MapDownloadSenario_Disconnect_onProgress_Gen3 = (function () {

    function MapDownloadSenario_Disconnect_onProgress_Gen3() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario_Disconnect_onProgress_Gen3 = MapDownloadSenario_Disconnect_onProgress_Gen3;

    MapDownloadSenario_Disconnect_onProgress_Gen3.prototype.start = function () {
        var queue = this.queue;

        HarmanOTA.debugFunc.postAccessoryConnect();

        var postConnect = function () {
            HarmanOTA.debugFunc.postAccessoryConnect();
        };

        var postDisConnect = function () {
            HarmanOTA.debugFunc.postAccessoryDisconnect();
        };

        for (var i = 1; i < 11; i++) {
            var payload = {
                "notify": "regionsDownloadProgress",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "status": 2,
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": 300,
                        "productID": 1065,
                        "totalSize": 2658728,
                        "fromVersion": 1,
                        "baselineID": 9847,
                        "supplierID": 28,
                        "progress": i * 10,
                    }
                ],
                "func" : function() {},
            };

            if (i == 3) {
                payload.func = postDisConnect;
            } else if (i == 8) {
                payload.func = postConnect;
            }
            queue.push(payload);
        }

        queue.push({
            "notify": "downloadStatus",
            "data": [
                {
                    "deviceCode": "891167361",
                    "status": 3,
                    "toVersion": 3,
                    "productCode": "3122895924",
                    "regionID": 300,
                    "productID": 1065,
                    "totalSize": 2658728,
                    "fromVersion": 1,
                    "baselineID": 9847,
                    "supplierID": 28
                }
            ]
        });

        for (var i = 1; i < 5; i++) {
            queue.push({
                "notify": "accessoryFileTransferProgress",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "totalSize": 0,
                        "productID": 1065,
                        "regionID": 301,
                        "fromVersion": 1,
                        "supplierID": 28,
                        "progress": i * 10,
                        "baselineID": 9847
                    }
                ]
            });
        }
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [
                {
                    "deviceCode": "891167361",
                    "toVersion": 3,
                    "productCode": "3122895924",
                    "totalSize": 0,
                    "productID": 1065,
                    "regionID": 301,
                    "fromVersion": 1,
                    "supplierID": 28,
                    "progress": 60,
                    "baselineID": 9847
                },
            ],
            "func": postDisConnect,
        });
    }

    return MapDownloadSenario_Disconnect_onProgress_Gen3;
})();