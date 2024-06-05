/**
 * 異常：転送途中で車載からキャンセルした場合
 */
var MapDownloadSenario_Cancel_DL_onVehicle_Gen3 = (function () {

    function MapDownloadSenario_Cancel_DL_onVehicle_Gen3() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario_Cancel_DL_onVehicle_Gen3 = MapDownloadSenario_Cancel_DL_onVehicle_Gen3;

    MapDownloadSenario_Cancel_DL_onVehicle_Gen3.prototype.start = function () {
        var queue = this.queue;

        HarmanOTA.debugFunc.postAccessoryConnect();

        var postConnect = function () {
            HarmanOTA.debugFunc.postAccessoryConnect();
        };

        var postDisConnect = function () {
            HarmanOTA.debugFunc.postAccessoryDisconnect();
        };

        var checkDownloadStatus = false;
        var regions = [444, 301, 300];
        for (var index = 0; index < regions.length; index++) {
            var regionID = regions[index];
            for (var i = 1; i < 5; i++) {
                var payload = {
                    "notify": "regionsDownloadProgress",
                    "data": [
                        {
                            "deviceCode": "891167361",
                            "status": 2,
                            "toVersion": 3,
                            "productCode": "3122895924",
                            "regionID": regionID,
                            "productID": 1065,
                            "totalSize": 2658728,
                            "fromVersion": 1,
                            "baselineID": 9847,
                            "supplierID": 28,
                            "progress": i * 10,
                        }
                    ],
                };

                if (!checkDownloadStatus) {
                    if (i == 4) {
                        payload.data[0].status = 5;
                    }
                }
                queue.push(payload);
            }

            if (checkDownloadStatus) {
                queue.push({
                    "notify": "downloadStatus",
                    "data": [
                        {
                            "deviceCode": "891167361",
                            "status": 5,
                            "toVersion": 3,
                            "productCode": "3122895924",
                            "regionID": regionID,
                            "productID": 1065,
                            "totalSize": 2658728,
                            "fromVersion": 1,
                            "baselineID": 9847,
                            "supplierID": 28
                        }
                    ]
                });
            }
        }
    }

    return MapDownloadSenario_Cancel_DL_onVehicle_Gen3;
})();