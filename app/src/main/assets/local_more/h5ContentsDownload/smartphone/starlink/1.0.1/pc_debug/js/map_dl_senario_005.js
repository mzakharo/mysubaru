/**
 * 異常シナリオ（アプリ起動〜転送完了）
 * 想定で作成しているため、車載のシーケンスと異なる可能性があります。
 * 地図のDLは実行せず、転送をいきなり実行します。
 * 転送は、途中でエラーになります。
 */
var MapDownloadSenario005 = (function () {

    function MapDownloadSenario005() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenario005 = MapDownloadSenario005;

    MapDownloadSenario005.prototype.start = function () {
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
        for (var i = 1; i < 4; i++) {
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
                    "accessoryTransferStatus": 4,
                    "fromVersion": 1,
                    "supplierID": 28,
                    "baselineID": 14738
                }
            ]
        });
    }

    return MapDownloadSenario005;
})();