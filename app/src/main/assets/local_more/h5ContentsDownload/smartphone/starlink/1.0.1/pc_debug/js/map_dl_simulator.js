
Const_kvs_dl_quque = 'MapDownloadSimulator_dl_quque';

var MapDownloadSimulator = (function () {

    MapDownloadSimulator.INTERVAL = 500;
    MapDownloadSimulator.PROGRESS_INCREMENT = 100;

    var _this = null;
    function MapDownloadSimulator() {
        _this = this;
        _this.pageManager = null;
        _this.keys = [];
        _this.keys_dl = null;
        _this.keys_transfer = [];
        _this.keyIndex = 0;
        _this.progress = 0;
        _this.notifyStart = { 'id': null, 'status': null };
        _this.notifyProgress = { 'id': null, 'status': null };
        _this.notifyComplete = { 'id': null, 'status': null };
    }

    var _instance = null;
    MapDownloadSimulator.getInstance = function () {
        if (_instance == null) {
            _instance = new MapDownloadSimulator();
        }
        return _instance;
    }

    $(function () {
        setTimeout(function () {
            var dlqueue = localStorage.getItem(Const_kvs_dl_quque);
            if (dlqueue != null) {
                MapDownloadSimulator.getInstance().setQueue(dlqueue);
                MapDownloadSimulator.getInstance().deQueue();
            }

        }, 1000);
    });

    MapDownloadSimulator.prototype.setPageManager = function (pageManager) {
        _this.pageManager = pageManager;
    }

    MapDownloadSimulator.prototype.getPageManager = function (pageManager) {
        if (_this.pageManager != null && _this.pageManager.ahaConnectSDKNotify != undefined) {
            return _this.pageManager;
        }
        return null;
    }

    MapDownloadSimulator.prototype.setQueue = function (queueString) {
        _this.keys = JSON.parse(queueString);
        var addKey = [];
        if (_this.getPageManager() != null) {
            for (var i = 0; i < _this.keys.length; i++) {
                for (var j = 0; j < _this.getPageManager().downloadingKeys.length; j++) {
                    if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(_this.keys[i], this.downloadingKeys[j])) {
                        continue;
                    }
                    addKey.push(this.downloadingKeys[j]);
                }
            }
        }
        _this.keys.concat(addKey);
        _this.keys_dl = _this.keys;
        localStorage.setItem(Const_kvs_dl_quque, JSON.stringify(_this.keys_dl));
    }

    MapDownloadSimulator.prototype.getKeyIndex = function (property) {
        for (var i = 0; i < _this.keys.length; i++) {
            if (_this.keys[i][property] == undefined) {
                return i;
            }
        }
        return -1;
    }

    MapDownloadSimulator.prototype.getDownloadQueue = function () {
        return _this.keys_dl;
    }

    MapDownloadSimulator.prototype.clearDownloadQueue = function () {
        _this.keys_dl = [];
        var keyIndex = _this.getKeyIndex('debugDownloaded');
        if (keyIndex != -1) {
            var key = _this.keys[0];
            _this.keys = [];
            _this.keys.push(key);
        }
        localStorage.removeItem(Const_kvs_dl_quque);
    }

    // デキュー（本処理は再帰的に呼ばれる。
    MapDownloadSimulator.prototype.deQueue = function () {

        _this.progress = 0;
        if (_this.keys.length > 0) {

            // 未DLがあるかチェック
            _this.keyIndex = _this.getKeyIndex('debugDownloaded');
            if (_this.keyIndex == -1) {
                _this.keys_dl = [];
                localStorage.removeItem(Const_kvs_dl_quque);

                // 全てDL済みなので、未転送があるかチェック
                if (_this.getPageManager() != null) {
                    if (_this.keys_transfer.length > 0 && _this.keys_transfer.length != _this.getPageManager().transferringKeys.length) {
                        _this.keys = JSON.parse(JSON.stringify(_this.getPageManager().transferringKeys));
                        for (var i = 0; i < _this.keys.length; i++) {
                            _this.keys[i].debugDownloaded = true;
                        }
                        _this.keys_transfer = _this.keys;
                    } else {
                        _this.keys_transfer = _this.keys;
                    }
                }
                _this.keyIndex = 0;
            }

            if (_this.keyIndex == -1 || _this.keys.length == 0) {
                // 全て転送済み
                _this.keys = [];
                return;
            }

            if (_this.keys[_this.keyIndex].debugDownloaded) {
                // DL済みなので転送
                _this.notifyStart = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_accessoryTransferStatus,
                    'status': HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated
                };
                _this.notifyProgress = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_accessoryTransferProgress,
                    'status': HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress
                };
                _this.notifyComplete = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_accessoryTransferStatus,
                    'status': HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted
                };

            } else {

                _this.notifyStart = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_downloadStatus,
                    'status': HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated
                };
                _this.notifyProgress = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_downloadProgress,
                    'status': HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress
                };
                _this.notifyComplete = {
                    'id': HarmanOTA.AhaConnectSDK_Notify_downloadStatus,
                    'status': HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted
                };

            }

            _this.start();
        } else {
            console.log('MapDownloadSimulator : error');
        }
    }

    MapDownloadSimulator.prototype.start = function () {
        setTimeout(function () {
            _this.notifyStatus(_this.notifyStart);
        }, MapDownloadSimulator.INTERVAL);

        setTimeout(function () {
            _this.notifyProgressLoop();
        }, MapDownloadSimulator.INTERVAL * 2);
    }

    // 地図DL/車載転送ステータス通知
    MapDownloadSimulator.prototype.notifyStatus = function (param) {
        var key = _this.keys[_this.keyIndex];
        var accessoryTransferStatus = undefined;
        if (key.debugDownloaded) {
            accessoryTransferStatus = param.status;
            // if (_this.keys.length == 1) {
            //     accessoryTransferStatus = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted + 1;
            // }
        }
        var data = {
            "notify": param.id,
            "data": [{
                "deviceCode": key.deviceCode,
                "productCode": key.productCode,
                "productID": key.productID,
                "supplierID": key.supplierID,
                "baselineID": key.baselineID,
                "regionID": key.regionID,
                "fromVersion": key.fromVersion,
                "toVersion": key.toVersion,
                "totalSize": key.totalSize,
                // 地図DLの場合のみ利用
                "status": key.debugDownloaded == undefined ? param.status : undefined,
                // "status": HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled,
                // "status": HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled + 1,
                // 転送の場合のみ利用
                "accessoryTransferStatus": accessoryTransferStatus,
            }]
        };
        
        HarmanOTA.AhaConnectHTMLSDK.getInstance().debugNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType, 'test');
    };

    // 地図DL/車載転送の進捗（ループ）
    MapDownloadSimulator.prototype.notifyProgressLoop = function () {
        var key = _this.keys[_this.keyIndex];

        if (false) {
            // 途中で中断する際のデバッグコード
            if (key.debugDownloaded) {
                if (_this.progress > 50) {
                    // // 転送中のタイムアウト
                    // HarmanOTA.debugFunc.postTransferMonitorTimeout();

                    // 転送中の切断
                    HarmanOTA.debugFunc.postAccessoryDisconnect();
                    return;
                }
            }
        }
        var data = {
            "notify": _this.notifyProgress.id,
            "data": [{
                "deviceCode": key.deviceCode,
                "productCode": key.productCode,
                "productID": key.productID,
                "supplierID": key.supplierID,
                "baselineID": key.baselineID,
                "regionID": key.regionID,
                "fromVersion": 1,
                "toVersion": 2,
                "progress": _this.progress += MapDownloadSimulator.PROGRESS_INCREMENT,
                "totalSize": key.totalSize,
                "status": key.debugDownloaded == undefined ? _this.notifyProgress.status : undefined,  // 地図DLの場合のみ利用
                // "status": HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled,
                // "status": HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCanceled + 1,
            }]
        };
        setTimeout(function () {

            HarmanOTA.AhaConnectHTMLSDK.getInstance().debugNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType, 'test');

            if (_this.progress >= 100) {
                setTimeout(function () {
                    _this.notifyStatus(_this.notifyComplete);
                }, MapDownloadSimulator.INTERVAL);

                setTimeout(function () {
                    if (_this.keys[_this.keyIndex].debugDownloaded == undefined) {
                        _this.keys[_this.keyIndex].debugDownloaded = true;
                    }
                    _this.deQueue();
                }, MapDownloadSimulator.INTERVAL * 2);
            } else {
                _this.notifyProgressLoop();
            }
        }, MapDownloadSimulator.INTERVAL);
    };

    return MapDownloadSimulator;
})();

