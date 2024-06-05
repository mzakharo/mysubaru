/**
 * 正常：DL中にBT切断した場合
 */
var MapDownloadSenario_Disconnect_onProgress_Gen4 = (function () {

    function MapDownloadSenario_Disconnect_onProgress_Gen4() {
        this.queue = [];
    }

    var Senario = MapDownloadSenario_Disconnect_onProgress_Gen4;

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

        queue.push(Queue.extend_didAccessoryConnect);

        for (var i = 1; i < 11; i++) {
            var payload = {
                "notify": "regionsDownloadProgress",
                "data": [
                    {
                        "status": 2,
                        "regionID": 304,
                        "totalSize": 2658728,
                        "progress": i * 10,
                        "deviceCode": deviceCode,
                        "toVersion": toVersion,
                        "productCode": productCode,
                        "productID": productID,
                        "fromVersion": fromVersion,
                        "baselineID": baselineID,
                        "supplierID": supplierID,
                    }
                ],
                "func": function () { },
            };

            if (i == 3) {
                queue.push(Queue.extend_didAccessoryDisconnect);
            } else if (i == 8) {
                queue.push(Queue.extend_didAccessoryConnect);
            }
            queue.push(payload);
        }

        queue.push({
            "notify": "downloadStatus",
            "data": [
                {
                    "status": 3,
                    "regionID": 304,
                    "totalSize": 2658728,
                    "deviceCode": deviceCode,
                    "toVersion": toVersion,
                    "productCode": productCode,
                    "productID": productID,
                    "fromVersion": fromVersion,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                }
            ]
        });

        for (var i = 1; i < 5; i++) {
            queue.push({
                "notify": "accessoryFileTransferProgress",
                "data": [
                    {
                        "totalSize": 0,
                        "regionID": 304,
                        "progress": i * 10,
                        "deviceCode": deviceCode,
                        "toVersion": toVersion,
                        "productCode": productCode,
                        "productID": productID,
                        "fromVersion": fromVersion,
                        "baselineID": baselineID,
                        "supplierID": supplierID,
                    }
                ]
            });
        }
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [
                {
                    "totalSize": 0,
                    "regionID": 304,
                    "progress": 60,
                    "deviceCode": deviceCode,
                    "toVersion": toVersion,
                    "productCode": productCode,
                    "productID": productID,
                    "fromVersion": fromVersion,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                },
            ],
        });

        queue.push(Queue.extend_didAccessoryDisconnect);

        this.waitQueue(queue);

        queue.push(Queue.extend_didAccessoryConnect);

        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [
                {
                    "totalSize": 0,
                    "regionID": 304,
                    "progress": 100,
                    "deviceCode": deviceCode,
                    "toVersion": toVersion,
                    "productCode": productCode,
                    "productID": productID,
                    "fromVersion": fromVersion,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                },
            ],
        });

        this.waitQueue(queue);

        queue.push(Queue.extend_didAccessoryDisconnect);

        this.waitQueue(queue);

        queue.push(Queue.extend_didAccessoryConnect);

        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [
                {
                    "totalSize": 0,
                    "regionID": 304,
                    "progress": 100,
                    "deviceCode": deviceCode,
                    "toVersion": toVersion,
                    "productCode": productCode,
                    "productID": productID,
                    "fromVersion": fromVersion,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                },
            ],
        });

        this.waitQueue(queue);

        queue.push({
            "notify": "accessoryTransferStatus",
            "data": [
                {
                    "regionID": 304,
                    "accessoryTransferStatus": 3,
                    "deviceCode": deviceCode,
                    "toVersion": toVersion,
                    "productCode": productCode,
                    "productID": productID,
                    "fromVersion": fromVersion,
                    "baselineID": baselineID,
                    "supplierID": supplierID,
                }
            ]
        });
    }

    Senario.prototype.waitQueue = function (queue) {
        // 少々待機
        for (var index = 0; index < 3; index++) {
            queue.push({
                "notify": "dummy",
                "data": [
                    {
                    },
                ],
            });
        }
    }

    return Senario;
})();