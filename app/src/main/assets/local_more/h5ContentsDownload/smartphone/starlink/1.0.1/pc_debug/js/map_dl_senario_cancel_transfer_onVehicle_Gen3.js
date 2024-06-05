/**
 * 異常：転送途中に車載でキャンセルした場合
 */
var MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3 = (function () {

    function MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3 = MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3;

    MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3.prototype.start = function () {
        var queue = this.queue;

        HarmanOTA.debugFunc.postAccessoryConnect();

        var regionIDList = [300, 332];
        for (var index = 0; index < regionIDList.length; index++) {
            var regionID = regionIDList[index];
            queue.push({
                "notify": "downloadStatus",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "status": 3,
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

        for (var i = 1; i < 10; i++) {
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
                        "progress": i * 5,
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
                    "progress": 0,
                    "baselineID": 9847
                }
            ]
        });
    }

    return MapDownloadSenario_Cancel_Transfer_onVehicle_Gen3;
})();