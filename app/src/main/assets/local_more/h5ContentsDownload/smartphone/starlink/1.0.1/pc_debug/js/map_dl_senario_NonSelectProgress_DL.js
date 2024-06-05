
// 地図用のシナリオ（通知は、California[304], Texas[344], Utah[345]）
// 選択していないDL進捗が来た場合の試験
var MapDownloadSenarioNonSelectProgress_DL = (function () {

    function MapDownloadSenarioNonSelectProgress_DL() {
        this.queue = [];
    }

    MapDownloadSenarioManager.MapDownloadSenarioNonSelectProgress_DL = MapDownloadSenarioNonSelectProgress_DL;

    MapDownloadSenarioNonSelectProgress_DL.prototype.setDonloaded = function (regionIDList) {
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

    MapDownloadSenarioNonSelectProgress_DL.prototype.start = function () {
        var _this = this;
        var queue = this.queue;
        window.setupDebugOTASettings("891167361", "3122895924");

        _this.setDonloaded([]);

        // start ---------------->
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 50 }],
            "func": function () {
                _this.setDonloaded([]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 60 }],
            "func": function () {
                _this.setDonloaded([]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 70 }],
            "func": function () {
                _this.setDonloaded([]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([]);
            }
        });
        queue.push({
            "notify": "downloadStatus",
            "data": [{ "deviceCode": "891167361", "status": 3, "toVersion": 20, "productCode": "3122895924", "regionID": 304, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28 }],
            "func": function () {
                _this.setDonloaded([304]);
            }
        });

        // start ---------------->
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 344, "productID": 4663057, "totalSize": 14348100, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([304]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 344, "productID": 4663057, "totalSize": 14348100, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([304]);
            }
        });
        queue.push({
            "notify": "downloadStatus",
            "data": [{ "deviceCode": "891167361", "status": 3, "toVersion": 20, "productCode": "3122895924", "regionID": 344, "productID": 4663057, "totalSize": 14348100, "fromVersion": 1, "baselineID": 14738, "supplierID": 28 }],
            "func": function () {
                _this.setDonloaded([304, 344]);
            }
        });

        // start ---------------->
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 345, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 90 }],
            "func": function () {
                _this.setDonloaded([304, 344]);
            }
        });
        queue.push({
            "notify": "regionsDownloadProgress",
            "data": [{ "deviceCode": "891167361", "status": 2, "toVersion": 20, "productCode": "3122895924", "regionID": 345, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28, "progress": 100 }],
            "func": function () {
                _this.setDonloaded([304, 344]);
            }
        });
        queue.push({
            "notify": "downloadStatus",
            "data": [{ "deviceCode": "891167361", "status": 3, "toVersion": 20, "productCode": "3122895924", "regionID": 345, "productID": 4663057, "totalSize": 1334780, "fromVersion": 1, "baselineID": 14738, "supplierID": 28 }],
            "func": function () {
                _this.setDonloaded([304, 344, 345]);
            }
        });
    }

    return MapDownloadSenarioNonSelectProgress_DL;

})();