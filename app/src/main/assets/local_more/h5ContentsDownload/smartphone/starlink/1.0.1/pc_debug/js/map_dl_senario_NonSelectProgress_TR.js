
// 地図用のシナリオ（通知は、California, Texas, Utah）
// 選択していない転送進捗が来た場合の試験
var MapDownloadSenarioNonSelectProgress_TR = (function () {

    function MapDownloadSenarioNonSelectProgress_TR() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenarioNonSelectProgress_TR = MapDownloadSenarioNonSelectProgress_TR;

    MapDownloadSenarioNonSelectProgress_TR.prototype.setDonloaded = function (regionIDList) {
        try {
            MobileOtaGen4.AhaConnectSDKControllerGen4.stubDownloadedRegionID = [];
            var targetIds = MobileOtaGen4.AhaConnectSDKControllerGen4.stubDownloadedRegionID;
            for (var i = 0; i < regionIDList.length; i++) {
                targetIds.push(regionIDList[i]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    MapDownloadSenarioNonSelectProgress_TR.prototype.start = function () {
        var _this = this;
        var queue = this.queue;
        window.setupDebugOTASettings("891167361", "3122895924");

        _this.setDonloaded([304, 344, 345]);
        HarmanOTA.debugFunc.postAccessoryConnect();

        queue.push({
            "notify": "downloadStatus",
            "data": [{ "deviceCode": "891167361", "status": 3, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });

        // start ---------------->
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 304, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 304, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryTransferStatus",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "accessoryTransferStatus": 3, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "regionID": 304 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });

        // start ---------------->
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 344, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 344, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryTransferStatus",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "accessoryTransferStatus": 3, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "regionID": 344 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });

        // start ---------------->
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 345, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryFileTransferProgress",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "totalSize": 0, "regionID": 345, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
        queue.push({
            "notify": "accessoryTransferStatus",
            "data": [{ "deviceCode": "891167361", "productID": 4663057, "productCode": "3122895924", "baselineID": 14738, "accessoryTransferStatus": 3, "supplierID": 28, "fromVersion": 1, "toVersion": 18, "regionID": 345 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
    }

    return MapDownloadSenarioNonSelectProgress_TR;

})();