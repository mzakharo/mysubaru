/**
 * 異常：転送途中でBT切断した場合
 * シナリオ001を参考に作成しています。
 */
var MapDownloadSenario002_Gen3 = (function () {

    function MapDownloadSenario002_Gen3() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario002_Gen3 = MapDownloadSenario002_Gen3;

    MapDownloadSenario002_Gen3.prototype.start = function () {
        var queue = this.queue;
        queue.push({
            "notify": "accessoryInformation",
            "info": {
                "make": "SUBARU",
                "deviceCode": "891167361",
                "protocolVersion": "11609",
                "VIN": "0000",
                "huModel": "Gen3.1",
                "model": "0000",
                "serialNumber": "0000",
                "productCode": "3122895924",
                "modelYear": "0000"
            }
        }
        );

        queue.push({
            "notify": "mapSubscriptionDetails",
            "data": [
                {
                    "expiryDate": "2020-12-04",
                    "deviceCode": "891167361",
                    "valid": true,
                    "productCode": "3122895924"
                }
            ]
        }
        );
        queue.push({
            "notify": "downloadStatus",
            "data": [
                {
                    "deviceCode": "891167361",
                    "status": 1,
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

        for (var i = 1; i < 11; i++) {
            queue.push({
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
                        "progress": i * 10
                    }
                ]
            });
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
        for (var i = 1; i < 7; i++) {
            queue.push({
                "notify": "accessoryFileTransferProgress",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "totalSize": 0,
                        "productID": 1065,
                        // "regionID": 452,
                        "regionID": 300,
                        "fromVersion": 1,
                        "supplierID": 28,
                        "progress": i * 10,
                        "baselineID": 9847
                    }
                ]
            });
        }
        queue.push(Queue.extend_didAccessoryDisconnect);
    }

    return MapDownloadSenario002_Gen3;
})();