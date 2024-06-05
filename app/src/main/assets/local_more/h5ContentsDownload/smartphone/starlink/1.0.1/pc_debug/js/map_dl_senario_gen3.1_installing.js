/**
 * 異常：転送途中でBT切断した場合
 * シナリオ001を参考に作成しています。
 */
var MapDownloadSenarioGen3_Installing = (function () {

    function MapDownloadSenarioGen3_Installing() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenarioGen3_Installing = MapDownloadSenarioGen3_Installing;

    MapDownloadSenarioGen3_Installing.prototype.start = function () {
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
                "func": i == 3 ? function () {
                    postDisConnect();
                } : undefined,
                "func": i == 8 ? function () {
                    postConnect();
                } : undefined,
            };

            if (i == 2) {
                payload.func = function () {
                    postDisConnect();
                };
            } else if (i == 9) {
                payload.func = function () {
                    postConnect();
                };
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

        var transRegions = [301, 444, 300];
        var unit = 3;
        for (var index = 0; index < transRegions.length; index++) {
            var regionID = transRegions[index];
            for (var i = 1; i < (100 / unit); i++) {
                queue.push({
                    "notify": "accessoryFileTransferProgress",
                    "data": [
                        {
                            "deviceCode": "891167361",
                            "toVersion": 3,
                            "productCode": "3122895924",
                            "totalSize": 0,
                            "productID": 1065,
                            "regionID": regionID,
                            "fromVersion": 1,
                            "supplierID": 28,
                            "progress": i * unit,
                            "baselineID": 9847
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
                        "regionID": regionID,
                        "productID": 1065,
                        "accessoryTransferStatus": 3,
                        "fromVersion": 1,
                        "supplierID": 28,
                        "baselineID": 9847
                    }
                ]
            });

        }
    }

    return MapDownloadSenarioGen3_Installing;
})();