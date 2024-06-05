(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * 更新データ一覧ページ管理クラス
     */
    var RegionPageManager = (function () {
        var _super = MobileOtaGen4.PageManagerGen4;

        __extends(RegionPageManager, _super);

        var MobileOta = MobileOtaGen4;
        var AnalyseAhaConnectSDKResponse = MobileOtaGen4.AnalyseAhaConnectSDKResponseGen4;
        var UI = MobileOtaGen4.UIGen4;

        function RegionPageManager() {
            _super.apply(this, arguments);
        }

        /**
         * 初期化処理
         */
        RegionPageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.texts = null;
            this.updateDatas = null;
            this.$updateList = null;
            this.$categoryItems = new Array();
            this.$downloadButton = null;
            this.deviceCode = null;
            this.productCode = null;
            this.updateDataRows = new Array();
            this.downloadingKeys = new Array();
            this.transferringKeys = new Array();
            this.simDownloadTimer = -1;
            this.simTransferTimer = -1;
            this.CategoryIds = new Array();
            this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.INDEFINITE] = "indefinite";
            this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD] = "notdownload";
            this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE] = "notupdate";
            this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.UPDATED] = "updated";
            this.mapDetails = null;
            this.selectedMapDetails = null;
            this.regionColorCallback = null;
            this.buttonType = {
                "checkForUpdate": 0,
                "download": 1,
                "ok": 2,
            };
            this.currentButtonType = null;
            this.mapColor = {
                "notSelect": 0,
                "selected": 10,
                "notDownload": 20,
                "notUpdate": 30,
                "updated": 40,
            };
            this.isMap = false; // true:地図画面　false:リスト画面
            this.gpsValue = null;

            this.writingClickRegion = false;
            this.requestAddRegionIDtoKVS = false;
            this.isCheckForUpdate = false;
            this.isCancelDownload = false;
            this.isCancelshowPopUp = true;
            this.istransfershowPopUp = true;
            this.selected_area = null;
            this.select_first_time = null;
            this.selectedRegionIDList = null; //KVSの値を読み出す
        };

        RegionPageManager.prototype.selectGpsRegion = function () {
            var _this = this;
            //位置情報取得可能の場合
            if (_this.current != undefined) {
                var key = this.getTargetDataKey(_this.current.regionID);
                var $row = this.getUpdateDataRow(key); 

                if ($row == undefined || $row == null) {
                    return;
                }

                var isChecked = UI.RegionList.getButtonStatus($row);
                if (!isChecked) {
                    //レイヤー選択
                    var regionIDList = [_this.current.regionID];
                    _this.addRegionIDtoKVS(regionIDList, _this.switchRegionsList(_this.current.regionID));
                    // checkForUpdateボタンに更新
                    _this.updateButton(_this.buttonType.checkForUpdate);
                }
            }
        };

        /**
         * 画面初期化
         * @param language 言語コード
         */
        RegionPageManager.prototype.initPage = function (language) {
            var _this = this;
            _super.prototype.initPage.call(this, language);
            // ローディング表示
            _this.setLoading(true);
            // 文言取得
            this.texts = this.getPageText(language);
            var errorFunc = function (delegate) {
                // ローディング非表示
                $.mobile.hidePageLoadingMsg();
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
                    _this.genericError(true);
                }
            };

            //現在位置の取得
            HarmanOTA.Common.getGps()
                .then(function (value) {
                    console.log(value);
                    if (value != undefined) {
                        var resultJson = JSON.parse(value);
                        try {
                            _this.gpsValue = L.latLng(resultJson.latitude, resultJson.longitude);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        //現在位置が取得できない場合
                        if (_this.isMap) {
                            //検索ボックス使用不可
                            $(RegionPageManager.TAG_KEY_SEARCH).prop("disabled", true);
                        }
                    }

                    _this.loadData() // データ読み出し
                        .then(function () {
                            // 多言語テストの場合固定値を設定
                            if (HarmanOTA.useStubMultilingualTest) {
                                _this.selected_area = "USA";  
                            }

                           var afterStorageInfo = function () {
                               //地図画面の場合
                                if (_this.isMap) {

                                    var afterUpdateMap = function () {
                                        afterUpdateMap = null;

                                        //現在位置のマーカーを設定
                                        _this.setCurrentPoint();
                                        // KVSに保存されたRegion選択状態を反映
                                        _this.setSelectedRegions()
                                            .then(function () {
                                                //選択中のregionが１件でも存在する場合はハッチング 解除
                                                if (!_this.isAllUnselected()) {
                                                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                                                    // checkForUpdate実行
                                                    _this.checkForUpdate(function (result) {
                                                    });
                                                }
                                                _this.restorePageState();

                                                // デバッグフラグONの場合
                                                if (HarmanOTA.useStubMultilingualTest) {
                                                    //多言語対応テスト
                                                    _this.startMultilingualTest();
                                                }
                                            });
                                    };

                                    var afterMapDetailUpdate = function () {
                                        afterMapDetailUpdate = null;

                                        //地図画面の場合
                                        _this.selectedMapDetails = JSON.parse(JSON.stringify(_this.mapDetails));
                                        //選択０とする
                                        _this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region.length = 0;
                                        // リストレイアウト
                                        _this.listLayout();
                                        // リスト作成
                                        _this.settingPageItem();

                                        //地図表示
                                        _this.updateMap(afterUpdateMap);
                                    }

                                    _this.getCurrentMapDetailFromGeoJson(afterMapDetailUpdate, _this.selected_area);

                                } else {
                                    //リスト画面の場合
                                    //対象外地域の取得
                                    _this.getOtherRegions(function () {

                                        _this.selectedMapDetails = JSON.parse(JSON.stringify(_this.mapDetails));
                                        // リストレイアウト
                                        _this.listLayout();
                                        // リスト作成
                                        _this.settingPageItem();

                                        //選択０とする
                                        _this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region.length = 0;

                                        // KVSに保存されたRegion選択状態を反映
                                        _this.setSelectedRegions()
                                            .then(function () {
                                                //選択中のregionが１件でも存在する場合はハッチング 解除
                                                if (!_this.isAllUnselected()) {
                                                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                                                    // checkForUpdate実行
                                                    _this.checkForUpdate(function (result) {
                                                    });
                                                }
                                                _this.restorePageState();

                                                // デバッグフラグONの場合
                                                if (HarmanOTA.useStubMultilingualTest) {
                                                    //多言語対応テスト
                                                    _this.startMultilingualTest();
                                                }
                                        });

                                    });

                                }

                                // 画面状態の更新
                                _this.refreshPageState();
                                // ローディング非表示
                                _this.setLoading(false);
                                return _this.settingAhaConnectSDK(); // AhaConnect SDK関連設定

                           }

                            // ストレージバー生成
                            UI.StorageBar.create($(RegionPageManager.STORAGE_BAR));
                            // ストレージ容量表示
                            _this.showStorageInfo(0, undefined, afterStorageInfo);

                       }, errorFunc);
                });
        };

        /**
         * 画面項目設定
         */
        RegionPageManager.prototype.settingPageItem = function () {
            var _this = this;
            _super.prototype.settingPageItem.call(this);

            // ダウンロード（checkForUpdate）ボタンを生成
            this.$downloadButton = $(RegionPageManager.BUTTON_ALLDOWNLOAD);
            UI.PageBottomButton.create(this.$downloadButton);
            _this.updateButton(_this.buttonType.checkForUpdate);
            UI.PageBottomButton.setEnabledRtl(this.$downloadButton, this.isEnabledRtl);
            UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
            // ダウンロードボタンのイベント設定
            UI.PageBottomButton.setClickedCallback(this.$downloadButton, function ($target) {

                _this.ahaConnectSDKSettings.readSettings(function () {
                    _this.selectedRegionIDList = _this.ahaConnectSDKSettings.getRegionIdList();
                    //ボタンごとに処理を分岐
                    switch (_this.getButtonType()) {
                        case _this.buttonType.checkForUpdate:
                            // checkForUpdateボタン押下時の処理
                            // 地図画面のみ目的地削除
                            if (_this.isMap) {
                                //目的地情報削除
                                _this.deleteDestinationInfo();
                            }

                            var tmp_updateDatas = _this.updateDatas;
                            _this.updateDatas = null;
                            _this.downloadingKeys.length = 0;
                            _this.transferringKeys.length = 0;
                            // checkForUpdate実行
                            _this.checkForUpdate(function (result) {
                                if (!result) {
                                    // 処理失敗したので復元する
                                    _this.updateDatas = tmp_updateDatas;

                                    // 汎用エラー
//                                    _this.genericError(false);
                                }
                            });
                            break;

                        case _this.buttonType.download:
                            // ダウンロードボタン押下時の処理

                            // ローディング
                            _this.setLoading(true);

                            // iOSの場合、暫定のアラートを表示する
                            if ((JSON.parse(getMemoryAppInfo())).os == 'ios') {
                                UI.Alert.alert(_this.texts.cautionDownloadAll);
                            }

                            // ダウンロードキューを登録する
                            _this.downloadAllData(function (result) {

                                // ローディング
                                _this.setLoading(false);

                                // 失敗
                                if (!result) {
                                    // 汎用エラー
                                    _this.genericError(false);
                                }

                                _this.isCancelshowPopUp = true;

                                //画面表示変更
                                _this.showDownloadingContents();

                            });

                            break;

                        case _this.buttonType.ok:
                            //OKボタン押下時の処理
                            _this.settingPageItemFunc.clickOKButton();
                            break;
                    }
                });
            });

            // 検索ボックスのイベント設定
            this.settingPageItemFunc.keyUpSearchBox();

            //検索結果一覧のイベント設定
            this.settingPageItemFunc.clickSearchResult();

            // 更新データ一覧UIを更新
            _this.updateDataList();

            if(this.isMap){
                document.getElementById("mapcontent").style.visibility = "visible";
            }

        };

        /**
         * Regionの選択状況をKVSに保存する
         * @param {*} regionIDList (配列型)
         * @param {*} isWrite 
         */
        RegionPageManager.prototype.addRegionIDtoKVS = function (regionIDList, isWrite) {
            var _this = this;

            // 選択状態をKVSへ保存する
            if (isWrite) {
                _this.ahaConnectSDKSettings.addRegion(_this.mapDetails, regionIDList);
            } else {
                _this.ahaConnectSDKSettings.removeRegion(_this.mapDetails, regionIDList);
            }
            _this.requestAddRegionIDtoKVS = true;
            _this.writeSettingsOnMapTap();
        };

        RegionPageManager.prototype.writeSettingsOnMapTap = function () {
            var _this = this;
            if (_this.writingClickRegion) {
                return;
            }

            _this.writingClickRegion = true;
            _this.requestAddRegionIDtoKVS = false;
            _this.ahaConnectSDKSettings.writeSettings(function() {
                _this.writingClickRegion = false;
                if (_this.requestAddRegionIDtoKVS) {
                    _this.writeSettingsOnMapTap();
                }
            });
        }

        /**
         * ダウンロード中の画面を表示する
         * ポップアップの表示、チェックボックスのハッチング （地図画面のみ）
         */
        RegionPageManager.prototype.showDownloadingContents = function () {
            var _this = this;
            var pos = _this.texts.popupDownloading.indexOf('*');

            // モーダルダイアログ表示(ページごとに表示方法を変更)
            if (_this.isMap) {
                //地図画面表示時
                // 全体ハッチング のダイアログをclose
                _this.closeModalDialog();
                //ボタンハッチング 
                UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                //ダウンロード中ダイアログ表示
//              _this.createModalDialogNoButtonForMap(_this.texts.popupDownloading);
                _this.createModalDialogImageNoButtonForMap( 
                    _this.texts.popupDownloading.slice(0,pos) , 
                    _this.texts.popupDownloading.slice(pos+1) );
            } else {
                //リスト画面表示時
                _this.createModalDialogImageNoButtonForList(
                    _this.texts.popupDownloading.slice(0,pos) , 
                    _this.texts.popupDownloading.slice(pos+1),
                    function () {
                        //ダイアログを閉じる
                        _this.closeModalDialogForList();
                    });
                //ボタンハッチング
                UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                //ダウンロード中ダイアログ表示
                $(RegionPageManager.DIALOG_BUTTONSET).find("button", _this.texts.cancel).addClass(RegionPageManager.CSS_JQUERY_MOBILE_DISAVLED);
            }
            
        };

        /**
         * 車載器転送中の画面を表示する
         * ポップアップの表示、チェックボックスのハッチング （地図画面のみ）
         */
        RegionPageManager.prototype.showAccessoryTransferContents = function () {
            var _this = this;

            // モーダルダイアログ表示(ページごとに表示方法を変更)
            if (_this.isMap) {
                //ボタンハッチング
                UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                // 日本語、英語は定義済み
                _this.createModalDialogNoButtonForMap(_this.texts.popupUpdating);
                // 全体ハッチング のダイアログをclose
                _this.closeModalDialog();
            } else {
                //リスト画面表示時
                if ( _this.istransfershowPopUp == true ) {
                    // 日本語、英語は定義済み
                    _this.createModalDialogOkButton(_this.texts.popupUpdating,
                        function () {
                            _this.istransfershowPopUp = false;
                            //ダイアログを閉じる
                            _this.closeModalDialog();
                        });
                }
            }
        };

        /**
         * キャンセル処理を実行
         */
        RegionPageManager.prototype.startCancelFunc = function () {
            var _this = this;
            console.log(">>> callback (Cancel)");
            var callbacks = {
                'finishCancel': function () {
                    if (_this.isMap) {
                        //モーダレスダイアログ　クローズ
                        _this.closeModalessDialog();
                    } else {
                        // ダイアログ　クローズ
                        _this.closeModalDialog();
                    }
                    _this.refreshPageState();
                },
                'closeFinishModal': function () {
                    //ボタンハッチング 解除
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                    _this.isCancelDownload = false;
                },
            };
         
             _this.isCancelDownload = true;
             _this.startCancelDownloadProc(callbacks);
        };

        /**
         * 車載器転送中のポップアップを閉じる
         * ポップアップの表示、チェックボックスのハッチング （地図画面のみ）
         */
        RegionPageManager.prototype.closeAccessoryTransferContents = function () {
            var _this = this;

            // モーダルダイアログ表示(ページごとに表示方法を変更)
            if (_this.isMap) {
                //モーダレスダイアログ　クローズ
                _this.closeModalessDialog();
            } else {
                //ダイアログクローズ
                _this.closeModalDialog();
            }

            //文言修正
            UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.checkForUpdate);
            //ボタンハッチング 
            UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
        };

/* #MOTA-126 by asada start */
        /**
         * 車載器転送中のポップアップのみを閉じる（overlayはそのまま）
         * ポップアップの表示、チェックボックスのハッチング （地図画面のみ）
         */
        RegionPageManager.prototype.closeAccessoryTransferContents_with_overlay = function () {
            var _this = this;

            // モーダルダイアログ表示(ページごとに表示方法を変更)
            if (_this.isMap) {
                //モーダレスダイアログ　クローズ
                _this.closeModalessDialog_with_Overlay();
            } else {
                //ダイアログクローズ
                _this.closeModalDialog();
            }
        };
/* #MOTA-126 by asada end */

        /**
         * KVSに保存されたRegion選択状態を反映
         */
        RegionPageManager.prototype.setSelectedRegions = function () {
            var _this = this;
            var deferred = jQuery.Deferred();

            // KVSからRegion選択状態を読み出し
            this.ahaConnectSDKSettings.readSettings(function () {
                var regionIDList = _this.ahaConnectSDKSettings.getRegionIdList();
                _this.selectedRegionIDList = JSON.parse(JSON.stringify(regionIDList));
                if (regionIDList == undefined) {
                    deferred.rejectWith(_this);
                    return;
                }

                if (regionIDList.length == 0) {
                    // 地図画面の場合のみ、初回表示かどうか判定
                    if (_this.isMap && _this.select_firstTime) {
                    // ダイアログ表示
                    _this.createModalDialogOkButton(_this.texts.settingRegionsForTheFirstTime, function () {
                        //ダイアログを閉じる
                        _this.closeModalDialog();
                        // KVS書き込み後地図画面を表示
                        _this.ahaConnectSDKSettings.settings_gen4.select_firstTime = false;
                        _this.ahaConnectSDKSettings.writeSettings(function() {
                            deferred.rejectWith(_this);
                            return;
                            });
                        });
                    }
                                                    
                } else {    //選択地域が１件以上ある場合
                                    
                    //KVSデータを元に画面上更新
                    for (var regionIdIndex = 0; regionIdIndex < regionIDList.length; regionIdIndex++) {
                        var regionID = regionIDList[regionIdIndex];
                        // 地図とリストに追加
                        if (_this.isMap) {
                            for (var i = 0; i < _this.mapLayers.length; i++) {
                                if (_this.mapLayers[i].regionID == regionID) {
                                    // リストに追加
                                    _this.switchRegionsList(regionID);
                                    break;
                                }
                            }
                        } else {
                            //リストの選択状態を変更
                            _this.setListChecked(regionID, true);
                        }
                    };
                } 

                deferred.resolveWith(this);
            });

            return deferred.promise();
        };


        /**
         * 更新データ一覧を更新（再生成）
         */
        RegionPageManager.prototype.updateDataList = function () {
            var _this = this;
            // クリア
            this.updateDataRows.length = 0;
            this.downloadingKeys.length = 0;
            this.$updateList = $(RegionPageManager.UPDATE_LIST);
            this.$updateList.empty();
            // 更新データ一覧UIを生成
            UI.RegionList.create(this.$updateList);

            for (var key in this.updateDatas) {
                // カテゴリ別設定
                var iconType = UI.MAP_DATA_ICON_TYPE.HIDDEN;
                switch (+key) {
                    case MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        iconType = UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                        break;
                    case MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE:
                        iconType = MobileOta.UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
                        break;
                    case MobileOta.MAP_DATA_CATEGORY.UPDATED:
                        iconType = MobileOta.UI.MAP_DATA_ICON_TYPE.UPDATED;
                        break;
                    default:
                        break;
                }
                // 行生成
                for (var i = 0; i < this.updateDatas[key].length; i++) {
                    var data = this.updateDatas[key][i];
                    var $row = UI.RegionList.addItem(this.$updateList, this.CategoryIds[key]);
                    UI.RegionList.setItemInfo($row, {
                        "title": {
                            "label": this.texts.map,
                            "value": data.name
                        },
                        "version": {
                            "label": this.texts.version,
                            "value": "-"
                        },
                        "size": {
                            "label": this.texts.size,
                            "value": "-"
                        },
                        "icon": iconType,
                        "progress": 0,
                        "showprogress": false,
                        "regionID" : data.key.regionID,
                        "rtl": this.isEnabledRtl,
                        //"index": i,
                    });

                    // 表示/非表示の設定
                    // データ行内のトグルボタンを表示
                    UI.RegionList.setShowButton($row, true);

                    if (key == MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE) {
                        //リストの選択状態を変更
                        UI.RegionList.setCheckBoxDisabled($row, true);
                    }


                    // title表示
                    $title = UI.RegionList.getItemTitleCss($row);
                    $title.css("visibility", "visible");

                    //イベントを設定
                    _this.setListTapEvent($row, data);

                    this.updateDataRows.push({
                        "key": data.key,
                        "row": $row,
                        "isDownloaded": false
                    });

                    
                    _this.moveRegionsList($row,key);
                }
            }
        };

        /**
          * regionIDに紐づくRegionデータの取得
          * @param RegionID　リージョンID
          * @returns Regionデータ
          */
         RegionPageManager.prototype.getMapDetailsRegionData = function (regionID) {

            var currentData = this.ahaConnectSDKSettings.getCurrentMapDetailData(this.mapDetails);
            if (currentData == null) {
                return null;
            }
            var nds_region = currentData.mapJson.nds_product[0].nds_region;
            for (var regionIndex = 0; regionIndex < nds_region.length; regionIndex++) {
                var target = nds_region[regionIndex];
                if (target.id == regionID) {
                    return target;
                }
            }
            return null;
        };

        /**
         * リストに追加可能かどうか
         * @param {*} regionID 
         * @return true:追加可能 / false:追加不可
         */
        RegionPageManager.prototype.checkAddableRegionList = function (regionID) {
            var mapRegion = this.getMapDetailsRegionData(regionID);
            if (mapRegion == null) {
                // 追加したいregionが現在の一覧に存在しない(fail safe)
                return false;
            }

            var selectedRegion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region;
            for (var i = 0; i < selectedRegion.length; i++) {
                if (selectedRegion[i].id == mapRegion.id) {
                    // すでに選択されている場合は追加しない
                    return false;
                }
            }

            return true;
        }
        /**
          * 選択されたRegionをリストに追加
          * @param RegionID　リージョンID
        　* @returns true:リストに追加した
          */
         RegionPageManager.prototype.addSelectedRegion = function (regionID) {
            var mapRegion = this.getMapDetailsRegionData(regionID);
            var selectedRegion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region;

            selectedRegion.push(mapRegion);
            this.ahaConnectSDKSettings.addRegion(this.mapDetails, [regionID]);
        };

        /**
         * 選択されたRegionをリストから削除
         * @param  regionID 
        　* @returns true:リストから削除した
         */
        RegionPageManager.prototype.removeSelectedRegion = function (regionID) {
            var mapRegion = this.getMapDetailsRegionData(regionID);
            if (mapRegion == null) {
                // 削除したいregionが現在の一覧に存在しない(fail safe)
                return false;
            }

            //選択地域一覧から削除
            var selectedRegion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region;
            for (var i = 0; i < selectedRegion.length; i++) {
                if (selectedRegion[i].id == mapRegion.id) {
                    // 一致するregionを削除
                    selectedRegion.splice(i, 1);
                    this.ahaConnectSDKSettings.removeRegion(this.mapDetails, [regionID]);
                    break;
                }
            };

            return false;
        };
        
        RegionPageManager.prototype.setListCheckState = function (isOn, targetData) {
            var _this = this;
            var regionID = targetData.key.regionID;

            // 選択状態を設定
            _this.setListChecked(regionID, isOn)
            // KVS書き込み（値の設定はsetListCheckedで実行）
            _this.ahaConnectSDKSettings.writeSettings();

            // ボタンハッチング解除
            UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
            // checkForUpdateボタンに更新
            _this.updateButton(_this.buttonType.checkForUpdate);
            //選択中のregionが１件もない場合はボタンをハッチング 
            if (_this.isAllUnselected()) {
                UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
            }
        }

        /**
         * 行選択時のイベントを設定
         * @param 行データ
         * @param data 
         */
        RegionPageManager.prototype.setListTapEvent = function ($row, data) {
            var _this = this;

            // 選択ボックスのイベント設定             
            UI.RegionList.setButtonStatusChangedCallback($row, data, function ($target, isOn, targetData) {
                _this.setListCheckState(isOn, targetData);
                if(isOn){
                    if(UI.RegionList.getItemIconRight($row).attr("src") == UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]){
                        var itemInfo = UI.RegionList.getItemInfo($row);
                        if (itemInfo.category == "notdownload") {
                            UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]);
                        }
                    } 
                }
                else{
                    if(UI.RegionList.getItemIconRight($row).attr("src") == UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]){
                        UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]);
                    } 
                }
            });

            // 右アイコンのイベント設定
            UI.RegionList.seticonRightClickedCallback($row, data, function ($target, targetData) {

                var targetStates = [MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE, MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD];
                for (var index = 0; index < targetStates.length; index++) {
                    var state = targetStates[index];

                    var tempDatas = _this.updateDatas[state];
                    if (tempDatas == undefined) {
                        continue;
                    }
                    for (var i = 0; i < tempDatas.length; i++) {
                        var tempData = tempDatas[i];
                        if(tempData.key.regionID == targetData.key.regionID){
                            if(state == MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE){
                            //NOT_UPDATEのリスト項目を押した場合---------------------------------------------

                                if(UI.RegionList.getItemIconRight($target).attr("src") == UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.NOT_DELETE]){
                                    return;
                                }

                                _this.deleteDownloadedMapData($target, tempData, {});   // ダウンロードキューを削除する

                            //--------------------------------------------------------------------------------
                            }
                            else if(state == MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD){
                            //NOT_DOWNLOADのリスト項目を押した場合---------------------------------------------MobileOta.UI.MAP_DATA_ICON_TYPE.UPDATED
                                // 操作できないアイコンケース
                                switch (UI.RegionList.getItemIconRight($target).attr("src")) {
                                    case UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]:
                                    case UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE]:
                                    case UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.DOWNLOADING]:
                                    case UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD]:
                                        return;

                                    default:
                                        break
                                }

                                _this.setLoading(true);// ローディング
                                if ((JSON.parse(getMemoryAppInfo())).os == 'ios') {// iOSの場合、暫定のアラートを表示する
                                    UI.Alert.alert(_this.texts.cautionDownloadAll);
                                }
                                _this.downloadOneData(tempData,function (result) {// ダウンロードキューを登録する
                                    // ローディング
                                    _this.setLoading(false);
                                    // 失敗
                                    if (!result) {
                                        // 汎用エラー
                                        _this.genericError(false);
                                    }

                                    _this.isCancelshowPopUp = true;

                                    //画面表示変更
                                    _this.showDownloadingContents();
                                });

                                _this.reloadListIcon();

                            //--------------------------------------------------------------------------------
                            }
                        }
                    }
                }
            });
        };


        RegionPageManager.prototype.getDeleteDownloadedMapDataDelegate = function ($row, targetData, customData) {
            var _this = this;
            var rollback = function() {
                //チェックボックスの状態を元に戻す
                _this.setListChecked(targetData.key.regionID, !customData.isOn);

                if (_this.isMap) {
                    //地図の選択状態を戻す
                    _this.setGeojsonRegionColor(targetData.key.regionID, _this.mapColor.notUpdate);
                }
                // KVSに書き込みを行う
                _this.addRegionIDtoKVS([targetData.key.regionID], true);
            };
            return {
                'deny': rollback,
                'success': function () {
                    //行の初期化
                    _this.initializeListItemInfo(targetData.key.regionID);

                    //リストの選択状態を変更
                    UI.RegionList.setCheckBoxDisabled($row, false);

                    // 保持データのカテゴリ変更
                    _this.updateCategory(targetData.key, HarmanOTA.AhaConnectSDK_DownloadStatus.NotDownloaded, null);

                    //
                    _this.refreshPageState();

                    // アイコン表示
                    _this.setItemIcon(targetData.key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);

                    if (_this.isMap) {
                        // 地図の色変更
                        _this.setGeojsonRegionColor(targetData.key.regionID, _this.mapColor.notDownload);
                    }

                    // checkForUpdateボタンに更新
                    _this.updateButton(_this.buttonType.checkForUpdate);

                    // ボタンハッチング
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);

                    // checkForUpdateを実行
                    _this.checkForUpdate(function (result) {
                    });
//                    _this.ahaConnectSDKController.checkForUpdateWithoneregion(_this.mapDetails, targetData.key, function (checkForUpdateResult, result) {

//                    });

                },
                'error': rollback,
            };
        };
        
        /**
         * リストの全ての地域が未選択状態かチェック
         * @returns true:すべて未選択 / false:１件でも選択あり
         */
        RegionPageManager.prototype.isAllUnselected = function () {
            if ($("input[type=checkbox]:checked").size() == 0 ) {
                return true;
            } else {
                return false;
            }
        };

        /**
          * ダウンロード中か判定する
          * @return ダウンロード中か否か（true:ダウンロード中）
          */
        RegionPageManager.prototype.checkDownloading = function () {
            for (var i = 0; i < this.downloadingKeys.length; i++) {
                if (this.downloadingKeys[i].status != MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                    return true;
                }
            }
            return false;
        };
        
        RegionPageManager.prototype.containDataKeys = function (key, dataKeys) {
            var result = false;
            dataKeys.some(function (value, index, array) {
                if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, value)) {
                    result = true;
                    return true;
                }
                return false;
            });
            return result;
        };

        /**
         * 地図データ削除ダイアログをclose 
         */
        RegionPageManager.prototype.closeDeleteDownloadedMapDialog = function () {
            this.closeModalDialog(this.dialogType.deleteDownloadedMap);

            for (var key in this.updateDatas) {
                if (key != MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE) {
                    continue;
                }

                for (var i = 0; i < this.updateDatas[key].length; i++) {
                    var data = this.updateDatas[key][i];
                    //リストの選択状態を変更
                    this.setListChecked(data.key.regionID, true);

                    if (this.isMap) {
                        this.setGeojsonRegionColor(data.key.regionID, this.mapColor.notUpdate);
                    }
                }
            }
        };

        /**
         * ダウンロード中ダイアログをclose 
         */
        RegionPageManager.prototype.closeDownloadingDialog = function () {
            
            this.showPopupForDownloadEnd(MobileOta.AhaConnectSDK_DownloadStatus.NotDownloaded);
        };

        /**
         * ページ状態の更新（ボタンのハッチング状態など）
         */
        RegionPageManager.prototype.refreshPageState = function () {
            this.reloadListIcon();
            this.setCheckboxStatusBasedOnAccessoryConnected();
        };

        /**
         * 車載機との接続状況に応じてcheckboxを非活性にする
         */
        RegionPageManager.prototype.setCheckboxStatusBasedOnAccessoryConnected = function () {
            //DL中の場合
            if (this.checkDownloading()) {
                 // 全てのチェックボックスを非活性の状態とする
                 this.setAllCheckBoxStatus(true);
            } else {
                // 全てのチェックボックスを活性の状態とする
                this.setAllCheckBoxStatus(false);
            }

        }

        /**
         * リストの選択状態を全て変更する
         * @param {*} disabled true:すべて非活性 / false:すべて活性
         */
        RegionPageManager.prototype.setAllCheckBoxStatus = function (disabled) {
            //リストのcheckBoxを操作可・不可に変更
            $("input[type=checkbox]").prop("disabled", disabled);

            if (disabled == false) {
                // DL済地域は非活性状態
                for (var category in this.updateDatas) {
                    if (category == MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE) {
                        for (var i = 0; i < this.updateDatas[category].length; i++) {
                            var data = this.updateDatas[category][i];
                            var $row = this.getUpdateDataRow(data.key);
                            if ($row != undefined || $row != null) {
                                //リストの選択状態を変更
                                UI.RegionList.setCheckBoxDisabled($row, true);
                            }
                        }
                    }
                }
            }
       }
       
        /**
         * 文言取得
         * @param language 言語コード
         */
        RegionPageManager.prototype.getPageText = function (language) {
            // 言語が取得できなかった場合、英語を指定
            if (language == null || language == undefined || language == "") {
                language = "en_US";
            }
            var textsList = [
                { "key": "searchbox", "id": "HTML_TXT_0168_", "language": language },
                { "key": "map", "id": "SL_TXT_0204_", "language": language },
                { "key": "version", "id": "SL_TXT_0205_", "language": language },
                { "key": "size", "id": "OTHER_SIZE_0001_", "language": language },
                { "key": "alldownload", "id": "HTML_TXT_0171_", "language": language },
                { "key": "checkForUpdate", "id": "HTML_TXT_0169_", "language": language },
                { "key": "ok", "id": "OTHER_011_", "language": language },
                { "key": "cancel", "id": "APP_024_", "language": language },
                { "key": "popupDownloading", "id": "HTML_TXT_0173_", "language": language },
                { "key": "popupStopDownloading", "id": "HTML_TXT_0186_", "language": language },
                { "key": "popupAllDownloadCompleted", "id": "HTML_TXT_0182_", "language": language },
                { "key": "popupDownloadFailed", "id": "APP_TXT_0176_", "language": language },
                { "key": "popupUpdating", "id": "HTML_TXT_0190_", "language": language },
                { "key": "popupCapacityExceeded", "id": "HTML_TXT_0172_", "language": language },
                { "key": "deleteDownloadedMap", "id": "HTML_TXT_0183_", "language": language },
                { "key": "succeededMapDelete", "id": "HTML_TXT_0184_", "language": language },
                { "key": "failedMapDelete", "id": "HTML_TXT_0185_", "language": language },
                { "key": "searchingRegions", "id": "HTML_TXT_0174_", "language": language },
                { "key": "noDataFromNominatim", "id": "HTML_TXT_0178_", "language": language },
                { "key": "sameWithCurrentPosition", "id": "HTML_TXT_0179_", "language": language },
                { "key": "autoRegionsSetting", "id": "HTML_TXT_0175_", "language": language },
                { "key": "settingRegionsForTheFirstTime", "id": "HTML_TXT_0180_", "language": language },
                { "key": "cautionDownloadAll", "id": "HTML_TXT_0068_", "language": language },
                { "key": "notifynetworkerror", "id": "SL_TXT_0220_", "language": language },
                { "key": "currentposition", "id": "Car_TXT_0245_", "language": language },

            ];
            var texts = this.buildText(textsList);
            texts.categories = {};

            var tmpText = "";
            eval(this.word.createWordingToEval("tmpText", "this.word", "HTML_TXT_0194_", language));
            texts.categories[MobileOta.MAP_DATA_CATEGORY.INDEFINITE] = tmpText;
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0202_", language));
            texts.categories[MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD] = tmpText;
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0201_", language));
            texts.categories[MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE] = tmpText;
            eval(this.word.createWordingToEval("tmpText", "this.word", "SL_TXT_0203_", language));
            texts.categories[MobileOta.MAP_DATA_CATEGORY.UPDATED] = tmpText;

            return texts;
        };
        //TODO:ロジック検討要 パラメータ：data->mapDetails に変更
        RegionPageManager.prototype.buildListLayout = function (mapDetails) {
            MobileOta.Common.log(RegionPageManager.ModuleName, "getCurrentMapDetails -> build");

            // データ解析（表示用データに変換）
            this.margeUpdateDatas(AnalyseAhaConnectSDKResponse.analyseCurrentMapDetails(mapDetails));
            if (this.updateDatas == null) {
                MobileOta.Common.log(RegionPageManager.ModuleName, "getCurrentMapDetails -> build reject.");
                MobileOta.Common.log(RegionPageManager.ModuleName, "mapDetails : " + JSON.stringify(mapDetails));
                return;
            }
        };

        // TODO:本メソッドは旧名称handleNoMapAfterRetrieveであり、retrieveAvailableMapRegionsの結果がfalseの場合に呼び出されている
        //      Gen4ではcheckForUpdateの解析結果により呼び出される想定なので、名称をhandleNoMapAfterCheckForUpdateに変更する
        RegionPageManager.prototype.handleNoMapAfterCheckForUpdate = function (deferred) {
            if (deferred == undefined) {
                return;
            }
            // 地図データが存在しない時の処理
            var inst = this;
            var delegate = {
                delegateErrorHandle: function () {
                    // 汎用エラー
                    inst.noMapData();
                    // inst.expiredSubscription();  // debug
                    inst = null;
                }
            };
            deferred.rejectWith(this, [delegate]);
        };

        /**
         * データ読み込み
         * @return jQuery Deferredオブジェクト
         */
        RegionPageManager.prototype.loadData = function () {
            var _this = this;
            var deferred = jQuery.Deferred();
            // 設定読み込み
            this.ahaConnectSDKSettings.readSettings(function (result) {
                if (result) {
                    _this.deviceCode = _this.ahaConnectSDKSettings.deviceCode;
                    _this.productCode = _this.ahaConnectSDKSettings.productCode;
                    //対象地域を取得
                    _this.selected_area = _this.ahaConnectSDKSettings.settings_gen4.selected_area;
                    //初回選択かどうか
                    _this.select_firstTime = _this.ahaConnectSDKSettings.settings_gen4.select_firstTime;
                    _this.selectedRegionIDList = _this.ahaConnectSDKSettings.getRegionIdList();

                }
                else {
                    MobileOta.Common.log(RegionPageManager.ModuleName, "fail loadData readSettings");
                    deferred.rejectWith(_this);
                    return;
                }

                // 地図データ情報取得
                _this.ahaConnectSDKController.getCurrentMapDetails(_this.deviceCode, _this.productCode, function (data, result) {
                    if (!result) {
                        deferred.rejectWith(_this);
                        return;
                    }

                    if (data.data.length <= 0 || data.data[0].mapJson == undefined) {
                        // データが存在しない場合はエラーメッセージを表示しconfig画面に遷移
                        var delegate = {
                            delegateErrorHandle: function () {
                                // getCurrentMapDetailsが取得できない
                                _this.getCurrentMapDetailsError(true);
                            }
                        };
                        deferred.rejectWith(_this, [delegate]);
                        return;
                    }

                    _this.mapDetails = data;
                    deferred.resolveWith(_this);
                });
            });
            return deferred.promise();
        };

        /**
        * リストレイアウト
        */
        RegionPageManager.prototype.listLayout = function () {
            this.buildListLayout(this.selectedMapDetails);
        };

        /**
         * AhaConnect SDK関連設定
         * @return jQuery Deferredオブジェクト
         */
        RegionPageManager.prototype.settingAhaConnectSDK = function () {
            var _this = this;
            var deferred = jQuery.Deferred();
            // AhaConnect SDKの通知受信設定
            MobileOta.AhaConnectHTMLSDK.getInstance().addNotifyData(this.ahaConnectSDKNotify, this, function (result) {
                if (result) {
                    deferred.resolveWith(_this);
                }
                else {
                    deferred.rejectWith(_this);
                }
            });
            return deferred.promise();
        };

        RegionPageManager.prototype.addManagedRegion = function(notifyData) {
            var _this = this;
            var $row = this.getUpdateDataRow(notifyData);
            var isChecked = $row == null ? false : UI.RegionList.getButtonStatus($row);
            // 選択済みであればリターン
            if (isChecked) {
                return;
            }
            if (_this.isMap) {
                _this.selectMapRegion(notifyData.regionID);
            } else {
                _this.setListCheckState(true, {'key' : notifyData});
            }
            _this.refreshPageState();
        };

        // 最後に_super.prototype.handleNotifyDataを呼ぶので、途中リターンしないこと
        RegionPageManager.prototype.handleNotifyData = function (notifyPayload, notifyContentType) {

            var _this = this;

            // try {
                // ダウンロード終了時のポップアップが表示されていれば非表示にする
                this.closeModalDialog(this.dialogType.downloadEnd);

                switch (notifyPayload.notify) {
                    case MobileOta.AhaConnectSDK_Notify_downloadStatus:
                        // リスト画面の場合キャンセルボタンハッチング 
                        if (!this.isMap) {
                            $(RegionPageManager.DIALOG_BUTTONSET).find("button", this.texts.cancel).addClass(RegionPageManager.CSS_JQUERY_MOBILE_DISAVLED);
                        }
                        this.reloadListIcon();
                        this.setDownloadingAction(notifyPayload);
                        break;

                    case MobileOta.AhaConnectSDK_Notify_downloadProgress:
                        // リスト画面の場合キャンセルボタンハッチング 解除
                        if (!this.isMap) {
                            $(RegionPageManager.DIALOG_BUTTONSET).find("button", this.texts.cancel).removeClass(RegionPageManager.CSS_JQUERY_MOBILE_DISAVLED);
                        }
                        this.setDownloadingAction(notifyPayload)
                        break;

                    case MobileOta.AhaConnectSDK_Notify_accessoryTransferStatus:
                        console.log("[Notify_accessoryTransferStatus]accessoryConnect : "+this.accessoryConnected);
                        this.accessoryCount++;
                        if (this.accessoryConnected) {
                            // 車載機転送ステータス
                            this.setTransferringAction(notifyPayload);
                            // transferStatusが通知されたタイミングで削除ダイアログをclose(fail safe)
                            this.closeModalDialog(this.dialogType.deleteDownloadedMap);
                            this.accessoryCount = 0;
                        } else if (this.accessoryCount > 1) {
                            // 車載機転送ステータス
                            this.setTransferringAction(notifyPayload);
                            // transferStatusが通知されたタイミングで削除ダイアログをclose(fail safe)
                            this.closeModalDialog(this.dialogType.deleteDownloadedMap);
                            this.setAccessoryConnected(true);
                            this.didAccessoryConnect();
                        }
                        break;

                    case MobileOta.AhaConnectSDK_Notify_accessoryTransferProgress:
                        console.log("[Notify_accessoryTransferProgress]accessoryConnect : "+this.accessoryConnected);
                        this.accessoryCount++;
                        if (this.accessoryConnected) {
                            var notifyData = notifyPayload.data[0];
                            var $row = this.getUpdateDataRow(notifyData);
                            var itemInfo = UI.RegionList.getItemInfo($row);
                            if (itemInfo.category != "updated"){
                                // 車載機転送進捗率
                                this.setTransferringAction(notifyPayload);
                            }
                            this.accessoryCount = 0;
                        } else if (this.accessoryCount > 1) {
                            var notifyData = notifyPayload.data[0];
                            var $row = this.getUpdateDataRow(notifyData);
                            var itemInfo = UI.RegionList.getItemInfo($row);
                            if (itemInfo.category != "updated"){
                                // 車載機転送進捗率
                                this.setTransferringAction(notifyPayload);
                            }
                            this.setAccessoryConnected(true);
                            this.didAccessoryConnect();
                        }
                        break;

                    case MobileOta.AhaConnectSDK_Notify_availableMapRegions:
                        // 車載機リージョン変更
                        this.reloadListPage();
                        break;

                    case MobileOtaGen4.AhaConnectSDK_Notify_currentMapDetails:
                        //currentMapDetailsが通知された場合
                        this.updateMapJson(notifyPayload);

                        _this.transferringKeys.length = 0;
                        _this.reloadListIcon();

                        // checkForUpdate実行
                        _this.checkForUpdate(function (result) {
                            // checkForUpdateボタン押下時の処理
                            // 地図画面のみ目的地削除
                            if (_this.isMap) {
                                //目的地情報削除
                                _this.deleteDestinationInfo();
                            }
                        });

                        break;

                    case MobileOta.AhaConnectSDK_Notify_notifyFileTransferFailure:
                        this.readTransferringKeys();
                        this.clearTransferStatus();
                        for (var i = 0; i < this.transferringKeys.length; i++) {
                            this.setItemIcon(this.transferringKeys[i], UI.MAP_DATA_ICON_TYPE.NOT_UPDATE);
                            //カテゴリ変更
                            this.updateCategory(this.transferringKeys[i], null, MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated);
                        }

                        HarmanOTA.UI.PageBottomButton.setEnabled(this.$downloadButton, true);

                        break;

                     case MobileOta.AhaConnectSDK_Notify_notifyError:
                        // 日本語、英語は定義済み
                        _this.createModalDialogOkButton(_this.texts.notifynetworkerror,
                        function () {
                            //ダイアログを閉じる
                            _this.closeModalDialog();
                        });

                        break;

                     case MobileOta.AhaConnectSDK_Notify_accessoryInformation:
                        var info = notifyPayload.info
                        if ( info.huModel.indexOf('Gen3.') == 0 ) {
                            // 異なる車載が接続された
                            _this.changeVehicle(function () {
                                // ルートページ（config画面）へ遷移
                                _this.backToRootPage();
                            });
                        } else if (_this.isChangeVehicle(notifyPayload, notifyContentType)) {
                            // 異なる車載が接続された
                            _this.changeVehicle(function () {
                                // ルートページ（config画面）へ遷移
                                _this.backToRootPage();
                            });
                        }

                        break;

                     case "startDownload":
                        _this.showDownloadingContents();
                        // リスト画面の場合キャンセルボタンハッチング
                        if (!this.isMap) {
                            $(RegionPageManager.DIALOG_BUTTONSET).find("button", _this.texts.cancel).addClass(RegionPageManager.CSS_JQUERY_MOBILE_DISAVLED);
                        }
                        // 画面状態の更新
                        for (var key in this.updateDatas) {
                             var datas = this.updateDatas[key];
                             for (var i = 0; i < datas.length; i++) {
                                 if( key == 1 ) {
                                    if ( datas[i].key.regionID == notifyPayload.data[0].regionID ) {
                                        var $row = this.getUpdateDataRow(datas[i].key);
                                        UI.RegionList.setItemInfo($row, { "iconRight": UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD, "progress": 0, "showprogress": false, "regionID" : datas[i].key.regionID });
                                    }
                                 } else if ( key == 2 ) {
                                    return;
                                 }
                             }
                        }

                        break;

                    default:
                        break;
                }

            _super.prototype.handleNotifyData.call(this, notifyPayload, notifyContentType);            
        };

        /**
         * notify:currentMapDetailsが通知された場合にmapJsonのデータの上書きを行う
         * @param {*} notifyPayload
         */
        RegionPageManager.prototype.updateMapJson = function (notifyPayload) {
            MobileOta.Common.log("updateMapJson before : " + JSON.stringify(this.mapDetails.data[0].mapJson));

            var mapJson = notifyPayload.mapJson;
            //上書き
            this.mapDetails.data[0].mapJson = mapJson;

            MobileOta.Common.log("updateMapJson after : " + JSON.stringify(this.mapDetails.data[0].mapJson));

        }


        RegionPageManager.prototype.createRegionList = function (keys) {
            var regionIDList = [];
            var addedRegionIDList = [];
            for(var i = 0; i < keys.length; i++) {
                for (var j =0; j < this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region.length; j++) {
                    var regionID = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region[j].id;
                    var fromVersion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region[j].version_id;
                
                    if (regionID == keys[i].regionID) {
                        //regionIDの重複追加を避ける
                        if (addedRegionIDList.length != 0 && addedRegionIDList.indexOf(regionID) == -1) {
                            regionIDList.push({ "regionID": regionID,
                                                "fromVersion": fromVersion
                                            });
                            addedRegionIDList.push(regionID);
                        }
                    }
                }        
            }

            return regionIDList;
        };

        RegionPageManager.prototype.checkForUpdateOnProgress = function () {
            var _this = this;
            // 更新チェック
            console.log('partial checkForUpdate');
            this.readDownloadingKeys();
            this.readTransferringKeys();
            var indefiniteDatas = _this.getAllUpdateDatasProperty(['key'], HarmanOTA.MAP_DATA_CATEGORY.INDEFINITE);
            var indefiniteKeys = [];
            for (var index = 0; index < indefiniteDatas.length; index++) {
                indefiniteKeys.push(indefiniteDatas[index].key);
            }
            var targetKeys = [];

            var margeFunc = function(dest, source) {
                dest = JSON.parse(JSON.stringify(dest));
                source = JSON.parse(JSON.stringify(source));
                if (dest.length > 0) {
                    for (var destIndex = 0; destIndex < dest.length; destIndex++) {
                        var destKey = dest[destIndex];
                        var sLen = source.length;
                        for (var sIndex = 0; sIndex < sLen; sIndex++) {
                            var sKey = source[sIndex];
                            if (AnalyseAhaConnectSDKResponse.equalsRegionDataKey(destKey, sKey)) {
                                source.splice(sIndex, 1);
                                sLen--;
                                sIndex--;
                                break;
                            }
                        }
                    }
                }
                return dest.concat(source);
            };

            targetKeys = margeFunc(targetKeys, this.downloadingKeys);
            targetKeys = margeFunc(targetKeys, this.transferringKeys);
            targetKeys = margeFunc(targetKeys, indefiniteKeys);

            if (targetKeys.length == 0) {
                _this.reloadListIcon();
                return;
            }

            //checkForUpdate実行
            var finish = function() {
                _this.readDownloadingKeys();
                _this.readTransferringKeys();
                _this.setLoading(false);
                _this.reloadListIcon();
                console.log('[checkForUpdateOnProgress] downloadingKeys : ' + JSON.stringify(_this.downloadingKeys));
                console.log('[checkForUpdateOnProgress] transferringKeys : ' + JSON.stringify(_this.transferringKeys));
            };
            this.startCheckForUpdate(targetKeys, this.createRegionList(targetKeys)).then(finish, finish);
        }

        RegionPageManager.prototype.isNoSize = function (key) {
            var $row = this.getUpdateDataRow(key);
            var itemInfo = null;
            var isNoSize = false;
            if ($row != null) {
                itemInfo = UI.RegionList.getItemInfo($row);
                isNoSize = itemInfo.size.value == '-';
            } else {
                isNoSize = true;
            }
            return isNoSize
        }

        /**
         * downloadStatus,downloadInProgress通知時の処理を記述
         * @param {*} notifyPayload notify通知結果
         */
        RegionPageManager.prototype.setDownloadingAction = function (notifyPayload) {
            // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
            var _this = this;
            var notifyData = notifyPayload.data[0];

            var reqCheckForUpdate = false;

            notifyData.status = this.getValidatedDownloadStatus(notifyPayload);

//            if ((!this.containDataKeys(notifyData, this.downloadingKeys) &&
            if ( (notifyData.status != undefined &&
                notifyData.status < HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) ||
                this.isNoSize(notifyData)
            )
            {
                var status = notifyData.status;
                this.addManagedRegion(notifyData);
                this.updateDownloadingKeys(notifyData, status);
                this.updateCategory(notifyData, status, null);
                reqCheckForUpdate = true;
            } 


            if (!this.isCheckForUpdate && reqCheckForUpdate && this.downloadingKeys.length > 0) {
//                this.checkForUpdateOnProgress();
            }


            this.updateCategoryChangedDownloadStatus(notifyData, notifyData.status);

            //エラーの場合は処理を抜ける
            if (this.finishDownloadOnError(notifyData.status)) {
                return;
            }

            // ダウンロード終了時のポップアップ表示
            this.showPopupForDownloadEnd(notifyData.status);
        };

        RegionPageManager.prototype.updateCategory = function (key, downloadStatus, transferStatus) {
            var categoryInfo = null;
            var $row = this.getUpdateDataRow(key);
            var itemInfo = UI.RegionList.getItemInfo($row);

            if (transferStatus != null) {
                if ( (itemInfo.category != "updated") && (itemInfo.category != "notdownload") ) {
                    categoryInfo = this.getCategoryInfoFromTransferStatus(transferStatus);
                } else if ( transferStatus == MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted ){
                    categoryInfo = this.getCategoryInfoFromTransferStatus(transferStatus);
                } else {
                    return;
                }

            } else if (downloadStatus != null) {
                if ( (itemInfo.category == "notupdate") && (downloadStatus == MobileOta.AhaConnectSDK_DownloadStatus.DownloadInProgress) ) {
                    return;
                } else {
                    categoryInfo = this.getCategoryInfoFromDownloadStatus(downloadStatus);
                }
            }

            if (categoryInfo != null) {
                var targetCategory = categoryInfo.targetCategory;
                var targetData = MobileOta.AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);
                if (targetData != null) {
                    MobileOta.AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                    MobileOta.AnalyseAhaConnectSDKResponse.addUpdateListData(this.updateDatas, targetData, targetCategory);
                }
            }

            if(!$row){
                return;
            }

            this.moveRegionsList($row,targetCategory);
        }

        /**
         * 地図系画面を共通化するために強引にメソッド定義
         * @param {*} status ダウンロードのステータス
         */
        RegionPageManager.prototype.getCategoryInfoFromTransferStatus = function (status) {
            var categoryID;
            var iconType;
            var targetCategory;
            if (status == HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                // 属するカテゴリを「車載機更新済・最新状態」に変更
                targetCategory = MobileOta.MAP_DATA_CATEGORY.UPDATED;
                categoryID = this.CategoryIds[targetCategory];
                iconType = MobileOta.UI.MAP_DATA_ICON_TYPE.UPDATED;
            }
            else {
                // 属するカテゴリを「車載機未更新」に変更
                targetCategory = MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE;
                categoryID = this.CategoryIds[targetCategory];
                iconType = MobileOta.UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
            }

            return {
                'categoryID': categoryID,
                'iconType': iconType,
                'targetCategory': targetCategory
            };
        }


        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（ダウンロード通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        RegionPageManager.prototype.updateCategoryChangedDownloadStatus = function (key, status) {
            var _this = this;
            var $row = this.getUpdateDataRow(key);

            var cancelFunc = function () {
                // DL中でない場合は処理を抜ける
                if (_this.downloadingKeys.length == 0) {
                    return;
                }
//                if (status != MobileOta.AhaConnectSDK_DownloadStatus.DownloadInProgress) {
//                    return;
//                }

               var targetName = _this.getProgressName($row);
               // ダウンロード中のみキャンセル処理を実行
//               if (targetName == UI.ProgressCircle.TARGET_NAME_DOWNLOAD && !_this.isCancelDownload) {
//               if (!_this.isCancelDownload) {
                    // ダウンロードファイルの有無を設定
                    _this.setDownloaded(key, false);
                    //キャンセル処理
                    _this.startCancelFunc();
//                }
               
           };

           switch (status) {
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated:
                    // ダウンロード中ダイアログ表示
                    this.showDownloadingContents();
                    if ($row != null) {
                        UI.ProgressCircle.setProgressColor($row, RegionPageManager.COLOR_DOWNLOAD_PROGRESS);
                        this.setProgressCircleVisible(true, key, $row);

                        //progressが通知された場合のみ、個別の進捗を表示
                        if (key.progress != undefined) {
                            //色設定
                            this.updateProgressColor(key, RegionPageManager.COLOR_DOWNLOAD_PROGRESS);
                            //進捗設定
                            this.updateProgressValue(key, key.progress);
                            //name設定
                            this.setProgressName($row, UI.ProgressCircle.TARGET_NAME_DOWNLOAD);
                        }
                    }
                    break;

                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadInProgress:

                    var itemInfo = UI.RegionList.getItemInfo($row);
                    itemInfo.progress = parseInt(100 - itemInfo.progress);

                    if ( (itemInfo.category == "notdownload") || (itemInfo.category == undefined) ) {
                        if ( itemInfo.progress < key.progress ) {
                            // ダウンロード中ダイアログ表示
                            this.showDownloadingContents();
                            if ($row != null) {
                                UI.ProgressCircle.setProgressColor($row, RegionPageManager.COLOR_DOWNLOAD_PROGRESS);
                                this.setProgressCircleVisible(true, key, $row);

                                //progressが通知された場合のみ、個別の進捗を表示
                                if (key.progress != undefined) {
                                    //色設定
                                    this.updateProgressColor(key, RegionPageManager.COLOR_DOWNLOAD_PROGRESS);
                                    //進捗設定
                                    this.updateProgressValue(key, key.progress);
                                    //name設定
                                    this.setProgressName($row, UI.ProgressCircle.TARGET_NAME_DOWNLOAD);
                                }
                            }
                        }
                    }
                    break;

                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted:
                    if ($row != null) {
                        // name属性の削除
                        this.setProgressName($row, "");
                        // progressを非表示に設定
                        this.setProgressCircleVisible(false, key, $row);
                        // 地図の色変更：地図データダウンロード済（車載機への地図データ転送未）
                        this.setRegionColor(key, UI.RegionList.getButtonStatus($row) ? this.mapColor.notUpdate : this.mapColor.notSelect);
                    }

                    this.setDownloadStaus(key, status); //DownloadCompletedを設定

                     // 地域リスト表示内容変更
                     var updateDate = this.getUpdateDatas(key.regionID, undefined).key.name;
                     if (updateDate != null) {
                        this.updateItemList($row, updateDate, key.totalSize);
                     }

                    // アイコン表示
                    this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_UPDATE);
                    // ダウンロードファイルの有無を設定
                    this.setDownloaded(key, true);
                    // 保持データのカテゴリ変更
                    this.updateCategory(key, status, null);

                    // 該当データが0件のカテゴリは非表示にする
                    var totalSizes_regions = 0;
                    var totalSizes_download = 0;
                    for (var key in this.updateDatas) {
                        var datas = this.updateDatas[key];
                        for (var i = 0; i < datas.length; i++) {
                            if( key == 1 ) {
                                totalSizes_regions += datas[i].size;
                            } else if ( key == 2 ) {
                                totalSizes_download += datas[i].size;
                            }
                        }
                    }
                    // ストレージ容量表示
                    this.showStorageInfo(totalSizes_regions,totalSizes_download);

                    break;
                
                case  MobileOta.AhaConnectSDK_DownloadStatus.DownloadCanceled:

                    this.setProgressCircleVisible(false, key, $row);
                    this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);

                    break;

                case  MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailDBError:
                    // 以下の場合にFailDBErrorが通知
                    //  1.サーバ管理の車載器の地図データバージョン　＝　リクエストされた地図データバージョン
                    //  2.サーバ管理の車載器の地図データバージョン　＞　リクエストされた地図データバージョン
                    
                    //車載器転送完了済みの地図データのため、転送完了状態を設定する
                    this.setTransferCompleted(key, MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted, $row);

                    break;

                case MobileOta.AhaConnectSDK_DownloadStatus.SpaceNotAvailable:
                    // ローディング終了
                    this.setLoading(false);
                    // ダイアログ表示
                    this.createModalDialogOkButton(this.texts.popupCapacityExceeded, function () {
                        //モーダルクローズ
                        _this.closeModalDialog();
                        // checkForUpdateボタンに更新
                        _this.updateButton(_this.buttonType.checkForUpdate);

                        UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]);
                    });

                    break;

                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailNetworkError:
                    // ローディング終了
                    this.setLoading(false);

                    this.setProgressCircleVisible(false, key, $row);

                    // アイコン表示
                    this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);

                    // ダウンロード終了時のポップアップ表示
                    this.showPopupForDownloadEnd(status);

                    // ダイアログ表示
                    this.createModalDialogOkButton(this.texts.notifynetworkerror, function () {
                        //モーダルクローズ
                        _this.closeModalDialog();
                        // checkForUpdateボタンに更新
                        _this.updateButton(_this.buttonType.checkForUpdate);

                        UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]);
                    });

                    break;

                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailSubscriptionInvalid:
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadStateInvalid:

                    //行の初期化
                    _this.initializeListItemInfo(key.regionID);

                    // ローディング終了
                    this.setLoading(false);

                    this.setProgressCircleVisible(false, key, $row);

                    // アイコン表示
                    _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);

                    //リストの選択状態を変更
                    UI.RegionList.setCheckBoxDisabled($row, false);

                    // 保持データのカテゴリ変更
                    _this.updateCategory(key, HarmanOTA.AhaConnectSDK_DownloadStatus.NotDownloaded, null);

                    //
                    _this.refreshPageState();

                    if (_this.isMap) {
                        // 地図の色変更
                        _this.setGeojsonRegionColor(key.regionID, _this.mapColor.notDownload);
                    }

                    // ボタンハッチング
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);

                    break;

                default:

                    //行の初期化
                    _this.initializeListItemInfo(key.regionID);

                    // ローディング終了
                    this.setLoading(false);

                    this.setProgressCircleVisible(false, key, $row);

                    // アイコン表示
                    _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);

                    //リストの選択状態を変更
                    UI.RegionList.setCheckBoxDisabled($row, false);

                    // 保持データのカテゴリ変更
                    _this.updateCategory(key, HarmanOTA.AhaConnectSDK_DownloadStatus.NotDownloaded, null);

                    //
                    _this.refreshPageState();

                    if (_this.isMap) {
                        // 地図の色変更
                        _this.setGeojsonRegionColor(key.regionID, _this.mapColor.notDownload);
                    }

                    // checkForUpdateボタンに更新
                    _this.updateButton(_this.buttonType.checkForUpdate);

                    // ボタンハッチング
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);

                    break;
            }

            // 画面上の表示を更新
            this.updateDownloadingKeys(key, status);
          
//            if (this.isMap) {
                //全てのチェックボックスを非活性とする
                this.setAllCheckBoxStatus(true);
//            }
                                
           // イベントの設定
           var $circle = $("." + UI.ProgressCircle.BASE_CSS_CLASS);
           $circle.off("click");
           $circle.click(cancelFunc);
        };

        RegionPageManager.prototype.setTransferringAction = function (notifyPayload) {
            var _this = this;
            // 通知内容に該当する一覧行をステータスに応じたカテゴリへ移動する
            var notifyData = notifyPayload.data[0];
            var accessoryTransferStatus = notifyData.accessoryTransferStatus;

            // statusが取得できない場合（accessoryFileTransferProgress）はprogress状態とする
            if (notifyData.accessoryTransferStatus == undefined) {
                accessoryTransferStatus = MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress;
            }

            // 転送対象のデータをチェック
            // 転送は一度開始したら全て対象となる
            this.readTransferringKeys();

            // // DLと転送は同時に起こりえないため、DLキューを初期化する
            // this.downloadingKeys.length = 0;
            // DLと転送が同時に起こり得るので、downloadingKeysはクリアしない
            // ただし、transferringKeysとマージはする
            this.updateDownloadingKeys(notifyData, MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted);

            var reqCheckForUpdate = false;
            if ((!this.containDataKeys(notifyData, this.transferringKeys) &&
                accessoryTransferStatus == undefined) ||
                this.isNoSize(notifyData)
            )
            {
                this.addManagedRegion(notifyData);
                this.updateTransferringKeys(notifyData, accessoryTransferStatus);
                this.updateCategory(notifyData, null, accessoryTransferStatus);
                reqCheckForUpdate = true;
            }

            // 車載機転送中データ状況に応じて画面状態を更新する
            this.updateTransferringKeys(notifyData, accessoryTransferStatus);
            
            // 転送完了の場合、checkForUpdate前に値を変更
            if (accessoryTransferStatus == MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                // fromVersionをtoVersionに更新する
                this.updateFromVersion(notifyData, accessoryTransferStatus, notifyData.toVersion);
            }

            if (!this.isCheckForUpdate && reqCheckForUpdate) {
//                this.checkForUpdateOnProgress();
            }

            // 画面上の表示を更新
            this.updateCategoryChangedAccessoryTransferStatus(notifyData, accessoryTransferStatus);
            if (this.finishTransferOnError(accessoryTransferStatus)) {
                // 想定しない状態通知
                HarmanOTA.UI.PageBottomButton.setEnabled(this.$downloadButton, true);
                return;
            }

            this.reloadListIcon();

        };

        /**
         * 指定キーに該当する更新データ一覧行の属するカテゴリを更新する（車載機転送ステータス通知時用）
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param status ダウンロードステータス
         */
        RegionPageManager.prototype.updateCategoryChangedAccessoryTransferStatus = function (key, status) {
            var $row = this.getUpdateDataRow(key);
            var itemInfo = UI.RegionList.getItemInfo($row);
            var finishIconType = itemInfo.icon;

            var showprogress = false;
            var showDialog = false;
            var showInstalling = 0;
            var _this = this;

            switch (status) {
                case MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated:
                    // ダイアログを表示
                    showDialog = true;
                    showprogress = true;
                    finishIconType = UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
                    this.istransfershowPopUp = true;
                    this.showAccessoryTransferContents();
                    break;

                case MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress:
                    var itemInfo = UI.RegionList.getItemInfo($row);
                    itemInfo.progress = parseInt(100 - itemInfo.progress);

                    if ($row != null) {
                        if (key.progress != undefined) {
                            if ( (itemInfo.category == "notupdate") || (itemInfo.category == undefined) ) {
                                // iconがUPDATED(転送完了)以外の場合
                                finishIconType = UI.MAP_DATA_ICON_TYPE.NOT_UPDATE;
                                if (itemInfo.icon != "2") {
                                    showDialog = true;
                                    showprogress = true;
                                    if ( UI.RegionList.getItemIconRight($row).attr("src") != UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.INSTALLING] ) {
                                        if ( itemInfo.progress < key.progress ) {
                                            //name設定
                                            this.setProgressName($row, UI.ProgressCircle.TARGET_NAME_TRANSFER);
                                            this.updateProgressColor(key, RegionPageManager.COLOR_ACCESSORY_TRANSFER_PROGRESS);
                                            this.updateProgressValue(key, key.progress);
                                            if (key.progress == 100) {
                                                this.showInstallingIcon(key, key.progress);
                                                showInstalling = 1;
                                            }
                                        }
                                    } else {
                                        showInstalling = 2;
                                    }
                                } else {
                                    //転送完了アイコンを表示
                                    finishIconType = UI.MAP_DATA_ICON_TYPE.UPDATED;
                                }
                            }
                        }
                    }
                    break;

                case MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted:
                    //転送完了アイコンを表示
                    finishIconType = UI.MAP_DATA_ICON_TYPE.UPDATED;
                    //画面の設定
                    this.setTransferCompleted(key, status, $row);
                    break;

                case MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferGenericFailure:
                    //ダウンロード未アイコンを表示
                    finishIconType = UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                    // 保持データのカテゴリ変更
                    this.updateCategory(key, HarmanOTA.AhaConnectSDK_DownloadStatus.NotDownloaded, null);

                    if (this.isMap) {
                        // 地図の色変更
                        this.setGeojsonRegionColor(key.regionID, this.mapColor.notDownload);
                    }

                    break;

                default:
                    break;
            }

            if (showDialog) {
/* #MOTA-126 by asada start */
                if ((showInstalling == 1) || (showInstalling == 2)){
                    // ダイアログのみを閉じる（オーバーレイはそのまま表示）
                    this.closeAccessoryTransferContents_with_overlay();
                } else {
/* #MOTA-126 by asada end */
//                    // 地図表示の場合、ダイアログを表示（リストのみ表示の場合、OKボタンを押下後に再度表示されてしまう問題に対応）
//                    if (_this.isMap == true) {
                        // ダイアログを表示
                        this.showAccessoryTransferContents();
//                    }
                }

//                if (this.isMap) {
                //全てのチェックボックスを非活性とする
                this.setAllCheckBoxStatus(true);
//                }

            } else {
                // ダイアログを閉じる
                this.closeAccessoryTransferContents();

                //全てのチェックボックスを活性とする
                this.setAllCheckBoxStatus(false);

            }

            if ($row != null) {
                MobileOta.Common.log("regionPageManager:updateCategoryChangedAccessoryTransferStatus -> payload = " + JSON.stringify(key));
                if (showprogress) {
                    if (status == MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated) {
                        MobileOta.Common.log("regionPageManager:updateCategoryChangedAccessoryTransferStatus -> setProgressCircleVisible");
                        //TransferInitiated通知時にプログレス表示
                        this.setProgressName($row, UI.ProgressCircle.TARGET_NAME_TRANSFER);
                        this.updateProgressColor(key, RegionPageManager.COLOR_ACCESSORY_TRANSFER_PROGRESS);
                        this.updateProgressValue(key, 0);
                        this.setProgressCircleVisible(showprogress, key, $row);
                    }
                } else {
                    // アイコン表示
                    this.setItemIcon(key, finishIconType);
                    this.setProgressCircleVisible(showprogress, key, $row);
                }

            }

//            if (this.isMap) {
//                //全てのチェックボックスを非活性とする
//                this.setAllCheckBoxStatus(true);
//            }
        };

        /**
         * 転送完了データの設定
         * @param {*} key 
         * @param {*} status 
         * @param {*} $row 
         */
        RegionPageManager.prototype.setTransferCompleted = function (key, status, $row) {

            if ($row != null) {
                // name属性の削除
                this.setProgressName($row, "");
                // progressを非表示に設定
                this.setProgressCircleVisible(false, key, $row);
                // 地域リスト表示内容変更(サイズ,versionを非表示)
                UI.RegionList.hiddenItemSize($row);
                UI.RegionList.hiddenItemVersion($row);
                // 地図の色変更：車載機への地図データ転送済
                this.setRegionColor(key, UI.RegionList.getButtonStatus($row) ? this.mapColor.updated : this.mapColor.notSelect);
            }
            this.setTransferStaus(key, status);  //TransferCompletedを設定

            // ダウンロードファイルの有無を設定
            this.setDownloaded(key, false);

            // 保持データのカテゴリ変更
            this.updateCategory(key, null, status);
            // アイコン表示
            this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.UPDATED);

            // DLボタンハッチングの切り替え
            var enable = this.transferringKeys.length == 0;
            // if (enable) {
            //     // keyに対応するRegionのcheckForUpdateを実行する
            //     this.checkForUpdateAfterAccessoryTransfer(notifyAccessoryTransferStatusData.key, notifyAccessoryTransferStatusData.status, notifyPayload.data[0].errorCode);
            // }
            HarmanOTA.UI.PageBottomButton.setEnabled(this.$downloadButton, enable);

            // 全て転送完了した場合
            if (!this.checkTransferProgress()) {
                //車載器との接続状態に応じてチェックボックスの状態を変更
                this.setAllCheckBoxStatus(false);
                this.refreshPageState();
            }
        };


        RegionPageManager.prototype.changeVehicle = function (callback) {
            var _this = this;
            if (callback == undefined || callback == null) {
                callback = function () { };
            }
            _super.prototype.changeVehicle.call(this, function () {
                _this.ahaConnectSDKSettings.changeVehicle();
                _this.ahaConnectSDKSettings.writeSettings(function () {
                    callback();
                });
            });
        }

        /**
         * ダウンロード終了状態に合わせたポップアップ表示
         * @param status ダウンロードステータス
         */
        RegionPageManager.prototype.showPopupForDownloadEnd = function (status) {
            var _this = this;
            switch (status) {
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated:
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadInProgress:
                    break;
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted:
                case MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailDBError:
                    // 全ダウンロード完了時の処理
                    if (!this.checkDownloading()) {

                        _this.downloadingKeys.length = 0;
                        // データ状況に応じて画面状態を更新する
                        _this.setAllCheckBoxStatus(false);

                        _this.refreshPageState();

                        //地図画面の場合
                        if (_this.isMap) {
                            //ダイアログを閉じる
                            _this.closeModalessDialog();
                
                        } else {
                            //ダイアログを閉じる
                            _this.closeModalDialogForList();
                        }
                        _this.isCancelshowPopUp = true;
/* #MOTA-96 start 18/08/29 by asada */
                        // ダイアログ表示
//                        this.createModalDialogNoButtonwithtimer(this.texts.popupAllDownloadCompleted, this.dialogType.downloadEnd, 3000);
/* #MOTA-96 end 18/08/29 by asada */

                         if ( this.updateDatas[1].length > 0 ) {
                             // ボタンハッチング
                             UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                         } else {
                             // ボタンハッチング
                             UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                         }

                    }
                    break;

                default:
                    _this.finishDownloadOnError(status);
                    break;
            }
        };

        RegionPageManager.prototype.finishDownloadOnError = function (status) {

            if (status <= MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted
                 || status == MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailDBError) {
                return false;
            }

            for (var i = 0; i < this.downloadingKeys.length; i++) {
                this.setItemIcon(this.downloadingKeys[i], UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);
                //カテゴリ変更
                this.updateCategory(this.downloadingKeys[i], MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated, null);
            }

            var canceled = status == MobileOta.AhaConnectSDK_DownloadStatus.DownloadCanceled;
            this.finishProgressOnError(canceled);

            // ダウンロードボタンハッチング解除
            UI.PageBottomButton.setEnabled(this.$downloadButton, true);

            return true;
        }


        RegionPageManager.prototype.finishTransferOnError = function (status) {

            if (status <= MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                return false;
            }

            this.readTransferringKeys();
            this.clearTransferStatus();
            for (var i = 0; i < this.transferringKeys.length; i++) {
                this.setItemIcon(this.transferringKeys[i], UI.MAP_DATA_ICON_TYPE.NOT_UPDATE);
                //カテゴリ変更
                this.updateCategory(this.transferringKeys[i], null, MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated);
            }

            this.finishProgressOnError(false);

            return true;
        }

        RegionPageManager.prototype.finishProgressOnError = function (canceled) {
            var _this = this;

            if (this.isMap) {
                //モーダレスダイアログ　クローズ
                this.closeModalessDialog();
            } else {
                // キャンセル以外の場合はダイアログクローズ（キャンセル時はレスポンスに応じたダイアログを表示）
                if (!canceled) {
                    //ダイアログ クローズ
                    this.closeModalDialogForList();
                }
            }

            _this.downloadingKeys.length = 0;
            //車載器との接続状態に応じてチェックボックスの状態を変更
            _this.setAllCheckBoxStatus(false);
            _this.refreshPageState();

//            // キャンセル以外の場合はエラー表示
//            if (!canceled) {
//                // ダイアログ表示
//                this.createModalDialogOkButton(this.texts.popupDownloadFailed, function () {
//                    _this.closeModalDialog();
//                });
//            }
        }

        /**
          * バージョン情報の更新
          */
        RegionPageManager.prototype.updateFromVersion = function (key, status, toVersion) {
            if (toVersion != undefined) {
                if (status == MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                    // keyが一致するfromVersionを更新する
                    var datas = this.updateDatas[MobileOta.MAP_DATA_CATEGORY.UPDATED];
                    for (var i = 0; i < datas.length; i++) {
                        if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, datas[i].key)) {
                            this.updateDatas[MobileOta.MAP_DATA_CATEGORY.UPDATED][i].fromVersion = toVersion;
                            break;
                        }
                    }

                    //request:getCurrentMapDetailsで取得したversionを更新する
                    var regions = this.mapDetails.data[0].mapJson.nds_product[0].nds_region;
                    for (var j = 0; j < regions.length; j++ ) {
                        if (regions[j].id == key.regionID) {
                            this.mapDetails.data[0].mapJson.nds_product[0].nds_region[j].version_id = toVersion;
                            break;
                        }
                    }
                }
            }
        };

        RegionPageManager.prototype.reloadListPage = function () {
            var _this = this;
            // データ読み出し
            this.loadData().then(function () {
                //TODO:ここでsetShowRegion()（map画面用）またはsetShowRegionAll()（list表示用）を呼び出す必要があるが、
                //     他の実装が進んだ場合にモジュール構成が変更となる可能性があるため一旦保留とします。
                
                if (HarmanOTA.useStubMultilingualTest) {
                    // ボタンの言語設定
                    _this.updateButton(_this.buttonType.checkForUpdate);
                    UI.PageBottomButton.setEnabledRtl(this.$downloadButton, this.isEnabledRtl);
                    // 検索ボックスのイベント設定
                    _this.settingPageItemFunc.keyUpSearchBox();
                }
                // リストレイアウト
                _this.listLayout();
                // 一覧データ表示更新
                _this.updateDataList();
                // KVSに保存されたRegion選択状態を反映
                _this.setSelectedRegions();
                // 画面状態の更新
                _this.refreshPageState();
            }, function (delegate) {
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
//                    _this.genericError(false);
                };
            });
        };

        /**
         * AhaConnect SDK通知受信
         * @param 通知データ
         * @param 通知データ形式
         */
        RegionPageManager.prototype.ahaConnectSDKNotify = function (notifyPayload, notifyContentType) {
            var _this = this;
            if (notifyContentType != MobileOta.AhaConnectSDK_JsonType) {
                return;
            }
            MobileOta.Common.log(RegionPageManager.ModuleName, "ahaConnectSDKNotify response");
            MobileOta.Common.log(RegionPageManager.ModuleName, "notifyContentType=" + notifyContentType);
            MobileOta.Common.log(RegionPageManager.ModuleName, "notifyPayload=" + JSON.stringify(notifyPayload));

            //サンプルアプリ用のデバッグポップアップ表示。
            //this.showDebugAlert(notifyPayload, notifyContentType);

            _this.ahaConnectSDKSettings.readSettings(function () {
                if (notifyPayload.notify != undefined) {
                    _this.handleNotifyData(notifyPayload, notifyContentType);
                }
                else {
                    _this.handleResponse(notifyPayload, notifyContentType);
                    if ( notifyPayload.resp == "startDownload" ) {
                        if ( 0 == notifyPayload.data[0].errorCode ) {
                            _this.showDownloadingContents();
                            // リスト画面の場合キャンセルボタンハッチング
                            if (!this.isMap) {
                                $(RegionPageManager.DIALOG_BUTTONSET).find("button", _this.texts.cancel).addClass(RegionPageManager.CSS_JQUERY_MOBILE_DISAVLED);
                            }
                        }
                    }
                }
            });

//            // 該当データが0件のカテゴリは非表示にする
//            var totalSizes_regions = 0;
//            var totalSizes_download = 0;
//            for (var key in this.updateDatas) {
//                var datas = this.updateDatas[key];
//                for (var i = 0; i < datas.length; i++) {
//                    if( key == 1 ) {
//                        totalSizes_regions += datas[i].size;
//                    } else if ( key == 2 ) {
//                        totalSizes_download += datas[i].size;
//                    }
//                }
//            }
        };
        /**
         * 更新データ一覧行を取得
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @return 行オブジェクト（DOM要素のJQueryオブジェクト。見つからない場合はnullを返却。）
         */
        RegionPageManager.prototype.getUpdateDataRow = function (key) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    return data.row;
                }
            }
            return null;
        };

        /**
         * keyを取得
         * @param {*} regionID 
         */
        RegionPageManager.prototype.getTargetDataKey = function (regionID) {

            for (var category in this.updateDatas) {
                var data = this.updateDatas[category];
                for (var i = 0; i < data.length; i++) {
                    var key = data[i].key;
                    if (key.regionID == regionID) {
                        return key;
                    }
                }
            }

            return null;
        };
        /**
         * 更新データ一覧行の進捗率の色を設定
         * @param $row 行オブジェクト（DOM要素のJQueryオブジェクト）
         * @param color 進捗率の色
         */
        RegionPageManager.prototype.setProgressColor = function ($row, color) {
            UI.ProgressCircle.setProgressColor($row, color);
        };
        /**
         * 指定キーに該当する更新データ一覧行の進捗率の色を更新
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param color 進捗率の色
         */
        RegionPageManager.prototype.updateProgressColor = function (key, color) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                this.setProgressColor($row, color);
            }
        };

        /**
         * 更新データ一覧行のprogress種別を設定
         * @param $row 行オブジェクト（DOM要素のJQueryオブジェクト）
         * @param name プログレス種別（download/transfer)
         */
        RegionPageManager.prototype.setProgressName = function ($row, name) {
            UI.ProgressCircle.setProgressName($row, name);
        };
        /**
         * 更新データ一覧行のprogress種別を取得
         * @param $row 行オブジェクト（DOM要素のJQueryオブジェクト）
         * @param name プログレス種別（download/transfer)
         */
        RegionPageManager.prototype.getProgressName = function ($row) {
            return UI.ProgressCircle.getProgressName($row);
        };
        
        /**
         * 対象行の状態を初期化
         * @param  regionID 
         */
        RegionPageManager.prototype.initializeListItemInfo = function (regionID) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (data.key.regionID == regionID) {
                    // ダウンロード状態を初期化
                    data.isDownloaded = false;
                    // アイコンを非表示
                    this.hiddenItemIcon(data.row);
                    return;
                }
            }

        };

        /**
         * 対象行のチェック状態を設定
         * @param regionID
         * @param isOn true:チェックON、false:チェックOFF
         */
        RegionPageManager.prototype.setListChecked = function (regionID, isOn) {
            var key = this.getTargetDataKey(regionID);
            var $row = this.getUpdateDataRow(key); 
            var isChecked = isOn; //チェック状態を取得
            var isMapcheckd = true;
            console.log(regionID);

            if (isOn) {
                console.log("setButtonStatusChangedCallback (ON)");
                // リストに追加するかチェック
                if (this.checkAddableRegionList(regionID)) {
                    // 選択されたRegionをSelectedMapDetailsからに追加
                    this.addSelectedRegion(regionID);
                    
                    if (this.isMap) {
                        // 地図の色を更新
                        this.updateRegionColor(regionID, isOn);
                    }
                }
            } else {
                console.log("setButtonStatusChangedCallback (OFF)"); 

                if ($row != undefined || $row != null) {
                    if (this.updateDatas != undefined && this.updateDatas != null) {
                        var targetData = HarmanOTA.AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);

                        // 削除処理 -------------------------------
                        // 以下の条件に当てはまる場合のみ削除処理を実行する
                        //    DL中でない　かつ
                        //    転送中でない　かつ
                        //    対象地域がDL済みである
                        //    車載機と切断状態である
                        if (!this.checkDownloading() &&
                            !this.checkTransferProgress() &&
                            this.isDownloaded(targetData.key) &&
                            !this.accessoryConnected) {

                            if ($row != null) {
                                // 地図データ削除
                                this.deleteDownloadedMapData($row, targetData, { 'isOn': isOn });
                                isMapcheckd = false;
                            } else {
                                debugger;
                            }

                        } else {
                            //削除条件に合致しない場合

                            // 地図色変更処理  -------------------------------
                            // 以下の条件に当てはまる場合はチェック状態を変更しない
                            //    DL済みであること　かつ
                            //    車載器接続状態であること
                            if (this.isDownloaded(targetData.key) &&
                                this.accessoryConnected) {
                                    isChecked = true;
                            }
                        }
                    }
                }
                
                if (this.isMap) {
                    if (isMapcheckd) {
                        // 地図の色を更新
                        this.updateRegionColor(regionID, isChecked);
                    }
                }

                // チェックがOffの場合のみ選択地域から削除
                if (!isChecked) {
                    if (isMapcheckd) {
                        // 選択されたRegionをSelectedMapDetailsから削除
                        this.removeSelectedRegion(regionID);
                    }
                }
            }
            
            // チェックボックスの選択状態を変更
            if ($row != undefined || $row != null) {
                if (isMapcheckd) {
                    UI.CheckBox.setButtonStatus($row, isChecked);
                    var itemInfo = UI.RegionList.getItemInfo($row);
                    if (itemInfo.category == "notdownload") {
                        if (UI.RegionList.getItemIconRight($row).attr("src") == UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.PRE_DOWNLOAD] ) {
                            // 何もしない
                        } else {
                            UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]);
                        }
                    }
                }
            }
        };

        /**
         * 更新データ一覧行のダウンロード状態を取得
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @return true:ダウンロードファイル有、false:ダウンロードファイル無（見つからない場合はnullを返却。）
         */
        RegionPageManager.prototype.isDownloaded = function (key) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    return data.isDownloaded;
                }
            }
            return false;
        };
        /**
         * 更新データ一覧行のダウンロード状態を設定
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param value true:ダウンロードファイル有、false:ダウンロードファイル無
         */
        RegionPageManager.prototype.setDownloaded = function (key, value) {
            for (var i = 0; i < this.updateDataRows.length; i++) {
                var data = this.updateDataRows[i];
                if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, data.key)) {
                    this.updateDataRows[i].isDownloaded = value;
                    return;
                }
            }
        };

        /**
         * 指定キーに該当する更新データ一覧行の進捗率を更新
         * @param key データキー（AnalyseAhaConnectSDKResponse.analyseUpdateListDataの返却するJSONのkeyと同一形式）
         * @param progress 進捗率（0-100）
         */
        RegionPageManager.prototype.updateProgressValue = function (key, progress) {
            var $row = this.getUpdateDataRow(key);
            if ($row != null) {
                UI.RegionList.setItemInfo($row, { "progress": progress, "showprogress": true, "regionID" : key.regionID });
            }
        };
        
        /**
         * 車載機リージョン選択変更シミュレーション
         */
        RegionPageManager.prototype.simulationChangedVehicleRegion = function () {
            var data = {
                "notify": "availableMapRegions",
                "data": [{}]
            };
            this.ahaConnectSDKNotify(JSON.stringify(data), MobileOta.AhaConnectSDK_JsonType);
        };

        RegionPageManager.prototype.createCheckForUpdateParamFromCategory = function () {
            var keysArray = new Array();
            var $regions = new Array();
            for (var category in this.updateDatas) {
                var datas = this.updateDatas[category];

                for (var i = 0; i < this.updateDataRows.length; i++) {
                    var data = this.updateDataRows[i];

                    if (UI.RegionList.getButtonStatus(data.row)) {
                        keysArray.push(data.key);

                        // keyが一致するfromVersionを取得する
                        var key = data.key;
                        for (var j = 0; j < datas.length; j++) {
                            if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, datas[j].key)) {
                                var region = {};
                                region[MobileOta.AhaConnectSDK_KEY_REGION_ID] = key.regionID;
                                region[MobileOta.AhaConnectSDK_KEY_FROM_VERSION] = datas[j].fromVersion;
                                /*
                                var region = {
                                    "regionID": key.regionID,
                                    "fromVersion": datas[j].fromVersion,
                                };
                                */
                                $regions.push(region);
                                continue;
                            }
                        }
                    } else {
                        // 未DLかつチェックが外された場合はカテゴリから除外
                        if (category == MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD) {
                            // keyが一致する場合
                            var key = data.key;
                            for (var j = 0; j < datas.length; j++) {
                                if (MobileOta.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, datas[j].key)) {
                                    //カテゴリから除外
                                    this.updateDatas[category].splice(j,1);
                                    continue;
                                }
                            }
                        }
                    }
                }
            }

            return { 'keysArray' : keysArray, '$regions' : $regions};
        }

        RegionPageManager.prototype.restorePageState = function () {
            var _this = this;
            _this.gettransferMapDataProgress(function (data) {
                if (data != undefined && data.notify != undefined) {
                    _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                    switch (data.notify) {
                        case MobileOta.AhaConnectSDK_Notify_accessoryTransferStatus:
                            if (data.accessoryTransferStatus == MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated) {
                                _this.showAccessoryTransferContents();
                            }
                            break;
                        case MobileOta.AhaConnectSDK_Notify_accessoryTransferProgress:
                            _this.showAccessoryTransferContents();
                            break;
                        default :
                            break;
                    }
                } else {

                }
            });
            _this.getdownloadMapDataProgress(function (data) {
                if (data != undefined && data.notify != undefined) {
                    _this.handleNotifyData(data, HarmanOTA.AhaConnectSDK_JsonType);
                    switch (data.notify) {
                        case MobileOta.AhaConnectSDK_Notify_downloadStatus:
                            if ( data.downloadstatus == MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated ) {
                                _this.showDownloadingContents();
                            }
                            break;
                        case MobileOta.AhaConnectSDK_Notify_downloadProgress:
                            _this.showDownloadingContents();
                            break;
                        default :
                            break;
                    }
                } else {
                    HarmanOTA.AhaConnectHTMLSDK.getInstance().getDownloadQueue(function (keys) {
                        if (keys.length > 0 && !_this.isCheckForUpdate) {
                            // DL進行中なので状態復帰する
                            _this.checkForUpdate(function () {
                            });
                        }
                    });
                }
            });
        };


        /**
         * 特定の行を指定したカテゴリの位置に移動してソートする
         * @param 選択行
         * @param targetCategory
         */
        RegionPageManager.prototype.moveRegionsList = function ($row,targetCategory) {

            //ラベル生成処理
            if(this.$categoryItems[targetCategory]==void(0)){//↓ラベル追加
                this.$categoryItems[targetCategory] = UI.RegionList.addCategory(this.$updateList, this.CategoryIds[targetCategory]);
                console.log(this.texts.categories[targetCategory]);
                UI.RegionList.setCategoryInfo(this.$categoryItems[targetCategory], {
                      "label": this.texts.categories[targetCategory],
                      "show": true,
                      "rtl": this.isEnabledRtl
                });

                switch (targetCategory) {
                    
                    case MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        this.$categoryItems[targetCategory].prependTo(this.$updateList.find(":jqmData(role=listview)"));
                        break;

                    case MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE:
                        if(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.UPDATED]){
                            this.$categoryItems[targetCategory].insertBefore(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.UPDATED]);
                        }
                        else{
                            if(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.INDEFINITE]){
                                this.$categoryItems[targetCategory].insertBefore(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.INDEFINITE]);
                            }
                            else{
                                this.$categoryItems[targetCategory].appendTo(this.$updateList.find(":jqmData(role=listview)"));
                            }
                        }
                        break;

                    case MobileOta.MAP_DATA_CATEGORY.UPDATED:
                        if(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.INDEFINITE]){
                            this.$categoryItems[targetCategory].insertBefore(this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.INDEFINITE]);
                        }
                        else{
                            this.$categoryItems[targetCategory].appendTo(this.$updateList.find(":jqmData(role=listview)"));
                        }
                        break;

                    case MobileOta.MAP_DATA_CATEGORY.INDEFINITE:
                        this.$categoryItems[targetCategory].appendTo(this.$updateList.find(":jqmData(role=listview)"));
                        break;

                }
            }

            //リスト移動処理
            var rowCategory = $row.attr("category");//旧属性
            if(rowCategory == void(0)){
                rowCategory = this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.INDEFINITE];
            }

            $row.attr("category", this.CategoryIds[targetCategory]);//新しい属性
            $row.insertAfter(this.$categoryItems[targetCategory]);//移動

            // ソート処理
            var sortObj = $("li[category="+this.CategoryIds[targetCategory]+"]:not([role])").sort(function(a, b) {
                // 昇順
                if ($(a).text() > $(b).text()) {
                // 降順
                // if ($(a).text() < $(b).text()) {
                  return 1;
                } else {
                  return -1;
                }
            });
            sortObj.insertAfter(this.$categoryItems[targetCategory]);

            //ラベル削除処理
            if(rowCategory){//↓ラベル削除
                if(this.$updateList.find("[category='"+rowCategory+"']").length <= 1 ){
                    this.$updateList.find("[category='"+rowCategory+"'][role='heading']").remove();
                    switch (rowCategory) {

                    case this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.INDEFINITE]:
                        delete this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.INDEFINITE];
                        break;

                    case this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD]:
                        delete this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.NOT_DOWNLOAD];
                        break;

                    case this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE]:
                        delete this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE];
                        break;

                    case this.CategoryIds[MobileOta.MAP_DATA_CATEGORY.UPDATED]:
                        delete this.$categoryItems[MobileOta.MAP_DATA_CATEGORY.UPDATED];
                        break;

                    }
                }
            }
        }


        /**
         * checkForUpdate送信
         */
        RegionPageManager.prototype.checkForUpdate = function (callback) {
            if (callback == undefined || callback ==  null) {
                callback = function() {};
            }
            console.log("RegionPageManager.prototype.checkForUpdate start");
            var _this = this;
            _this.isCheckForUpdate = true;

            // ローディング
            _this.setLoading(true);
//            _this.ahaConnectSDKController.checkForUpdateWithCurrentMapDetails(_this.mapDetails, _this.ahaConnectSDKSettings.productCode, _this.ahaConnectSDKSettings.deviceCode, function (checkForUpdateResult, result) {
            _this.ahaConnectSDKController.checkForUpdateWithSelectregions(_this.mapDetails, _this.updateDataRows, _this.ahaConnectSDKSettings.productCode, _this.ahaConnectSDKSettings.deviceCode, function (checkForUpdateResult, result) {

                // ローディング
                _this.setLoading(false);
                if (checkForUpdateResult == null) {
                    callback(false);
                    return;
                }

                if ((checkForUpdateResult.data[0].errorCode != 0) || (checkForUpdateResult.data[0].errorCode == undefined)) {

                    // checkForUpdate実行
                    _this.startCheckForUpdate(null, null, checkForUpdateResult, result)
                        .then(
                            function () {
                                _this.isCheckForUpdate = false;
                                callback(true);
                            },
                            function (delegate) {
                                _this.isCheckForUpdate = false;
                                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                                    delegate.delegateErrorHandle();
                                }
                                else {
                                    callback(false);
                                }
                            }
                        );

                } else {

                    // 地図画面の場合
                    if (_this.isMap) {
                        // 選択されていないregionを一覧から削除する
                        _this.removeUnselectedRegionsList();
                    }
                    else{
                        // 選択されていないregionを一覧のINDEFINITEに移動する
                        _this.moveUnselectedRegionsList();
                    }

                    _this.margeCheckForUpdateResult(checkForUpdateResult, result);
                    var param = _this.createCheckForUpdateParamFromCategory();

                    // checkForUpdate実行時の以下のフェイルセーフを含む
                    // 1.保持しておいたgetCurrentMapDetailsのデータを検索した際、必要な情報がヒットしない（欠損がある）場合は、checkForUpdateのリクエスト対象外とする
                    // 2.上記の結果、checkForUpdateの対象データが0件になった場合はリクエストしない
                    // （getCurrentMapDetailsの結果が、サーバ側の運用エラーにより欠損するリスクを考慮）
                    if (param.$regions.length == 0) {
                        _this.isCheckForUpdate = false;
                        // ストレージ容量表示
                        _this.showStorageInfo(0);
                        callback(true);
                        return;
                    }

                    // checkForUpdate実行
                    _this.startCheckForUpdate(param.keysArray, param.$regions, checkForUpdateResult, result)
                        .then(
                            function () {
                                _this.isCheckForUpdate = false;
                                callback(true);
                            },
                            function (delegate) {
                                _this.isCheckForUpdate = false;
                                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                                    delegate.delegateErrorHandle();
                                }
                                else {
                                    callback(false);
                                }
                            }
                        );
                }
            });
        };

        RegionPageManager.prototype.handleCheckForUpdateError = function (checkForUpdateResult, result, deferred) {
            var _this = this;
            if (!result) {
                deferred.rejectWith(_this);
                return false;
            }
            if (checkForUpdateResult.data == undefined || checkForUpdateResult.data.length <= 0) {
                // データが存在しない時の処理
                //TODO: T.B.D
                deferred.rejectWith(_this);
                return false;
            }

            if (checkForUpdateResult.data[0].errorCode != 0)
            {
                _this.setLoading(false);
                var inst = this;
                // 有効期限切れ
                if (checkForUpdateResult.data[0].errorCode == MobileOta.AhaConnectSDK_ErrorCode_MapSubscriptionExpired)
                {
                            // 有効期限切れ
                    _this.expiredSubscription(false);
                 // ネットワークエラー
                 } else if (checkForUpdateResult.data[0].errorCode == MobileOta.AhaConnectSDK_ErrorCode_NetworkFailure) {
                     _this.downloadingKeys.length = 0;
                     
                     for (var key in this.updateDatas) {
                         var datas = this.updateDatas[key];
                         for (var i = 0; i < datas.length; i++) {
                             if( key == 1 ) {
                                var $row = this.getUpdateDataRow(datas[i].key);
                                UI.RegionList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : datas[i].key.regionID });
                             } else if ( key == 2 ) {
                                return;
                             }
                         }
                     }

                    // ダウンロード終了時のポップアップ表示
                    this.showPopupForDownloadEnd(MobileOta.AhaConnectSDK_DownloadStatus.DownloadFailNetworkError);

                    // checkForUpdateボタンに更新
                    this.updateButton(_this.buttonType.checkForUpdate);
                     // 日本語、英語は定義済み
                     _this.createModalDialogOkButton(_this.texts.notifynetworkerror,
                     function () {
                         //ダイアログを閉じる
                         _this.closeModalDialog();
                     });
                     inst = null;
//                     deferred.rejectWith(this, [delegate]);
                } else {
                    var delegate2 = {
                        delegateErrorHandle: function () {
                            // 汎用エラー
                            inst.genericError(false);
                            inst = null;
                        }
                    };
                    deferred.rejectWith(this, [delegate2]);
                }
                return false;
            }

            return true;
        }

        RegionPageManager.prototype.buildLayoutFromCheckForUpdate = function (checkForUpdateResult, result, notifyRegionID, notifyProgress, notifyPayload) {
            var _this = this;
            var totalDownloadSize = 0;
            var downloadRegions = new Array();

            for (var dataIndex = 0; dataIndex < checkForUpdateResult.data.length; dataIndex++) {
                var data = JSON.parse(JSON.stringify(checkForUpdateResult.data[dataIndex]));
                var deviceCode = data.deviceCode;
                var productCode = data.productCode;
                if (data.products == undefined) {
                    return false;
                }
                for (var productIndex = 0; productIndex < data.products.length; productIndex++) {
                    var product = JSON.parse(JSON.stringify(data.products[productIndex]));
                    var productID = product.id;
                    var supplierID = product.supplierID;
                    var baselineID = product.baselineID;
                    if (product.Regions == undefined) {
                        continue;
                    }
                    for (var regionIndex = 0; regionIndex < product.Regions.length; regionIndex++) {
                        var region = JSON.parse(JSON.stringify(product.Regions[regionIndex]));
                        var regionID = region.regionID;
                        var fromVersion = region.fromVersion;
                        var downloadStatus = region.downloadStatus;
                        // downloadStatus:2 の場合、未DLとみなす
                        if (downloadStatus == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInProgress) {
                            downloadStatus = HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated;
                        }
                        var accessoryTransferStatus = region.accessoryTransferStatus;
                        // accessoryTransferStatus:2 の場合、未転送とみなす
                        if (accessoryTransferStatus == HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress) {
                            accessoryTransferStatus = HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid;
                        }

                        var key = {};
                        key[MobileOta.AhaConnectSDK_KEY_DEVICE_CODE] = deviceCode;
                        key[MobileOta.AhaConnectSDK_KEY_PRODUCT_CODE] = productCode;
                        key[MobileOta.AhaConnectSDK_KEY_PRODUCT_ID] = productID;
                        key[MobileOta.AhaConnectSDK_KEY_SUPPLIER_ID] = supplierID;
                        key[MobileOta.AhaConnectSDK_KEY_BASELINE_ID] = baselineID;
                        key[MobileOta.AhaConnectSDK_KEY_REGION_ID] = regionID;

                        var $row = _this.getUpdateDataRow(key);
                        if ($row == null) {
                            HarmanOTA.AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                            continue;
                        }

                        switch (_this.getUpdateDatasCategory(regionID)) {
                            case MobileOta.MAP_DATA_CATEGORY.UPDATED:
                                if (accessoryTransferStatus < HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                                    // メモリで保持している情報は転送済みだが、CheckForUpdateの結果は未転送。
                                    // CheckForUpdateに反映されていないと判断し、UIは更新しない。
                                    continue;
                                }
                                break;
                            case MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE:
                                if (downloadStatus < HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                                    // メモリで保持している情報はDL済みだが、CheckForUpdateの結果は未DL。
                                    // CheckForUpdateに反映されていないと判断し、UIは更新しない。
                                    continue;
                                }
                                break;
                            default:
                                break;
                        }
                        
                        if (region.Updates == undefined || region.Updates.length == 0) {
                            // 地域リスト表示内容変更
                            _this.updateItemList($row, null, null);
                            // アイコン表示
                            _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.UPDATED);
                            // ダウンロードファイルの有無を設定
                            _this.setDownloaded(key, false);
                            // 地図の色変更：車載機への地図データ転送済
                            _this.setRegionColor(key, UI.RegionList.getButtonStatus($row) ? _this.mapColor.updated : _this.mapColor.notSelect);
                            // カテゴリ変更
                            _this.updateCategory(key, null, HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted);
                            if (_this.getUpdateDatasCategory(regionID) == MobileOta.MAP_DATA_CATEGORY.NOT_UPDATE) {
                                // チェックボックを活性状態に変更
                                UI.RegionList.setCheckBoxDisabled($row, true);
                             } else {
                                // チェックボックを活性状態に変更
                                UI.RegionList.setCheckBoxDisabled($row, false);
                             }

                            continue;
                        }
                        var Updates = JSON.parse(JSON.stringify(region.Updates));
                        var maxVersion = -1;
                        var size = 0;
                        var updateType = undefined;
                        var updateDate = undefined;
                        for (var i = 0; i < Updates.length; i++) {
                            var toVersion = Updates[i].toVersion;
                            if (toVersion != null && toVersion > maxVersion) {
                                maxVersion = toVersion;
                                size = Updates[i].size;
                                updateType = Updates[i].type;
                                updateDate = Updates[i].name;
                            }
                        }

                        if (updateType != undefined) {
                            _this.getUpdateDatas(regionID, undefined).key.updateType = updateType;
                        }

                        // 日付（name）を取得
                        if(this.updateDatas != undefined) {
                            _this.getUpdateDatas(regionID, undefined).key.name = updateDate;
                        }

                        // download済み
                        if (downloadStatus == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted) {
                            // 地域リスト表示内容変更
                            _this.updateItemList($row, updateDate, size);
                            // アイコン表示
                            _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_UPDATE);
                            // ダウンロードファイルの有無を設定
                            _this.setDownloaded(key, true);
                            // 地図の色変更：地図データダウンロード済（車載機への地図データ転送未）
                            _this.setRegionColor(key, _this.mapColor.notUpdate);

                            // 車載機転送管理データ設定
                            key[MobileOta.AhaConnectSDK_KEY_STATUS] = MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferInitiated;
                            // カテゴリ変更
                            _this.updateCategory(key, HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted, null);
                            // チェックボックスの状態を変更（車載器接続中は使用不可に設定）
                            UI.RegionList.setCheckBoxDisabled($row, true);

                            continue;
                        }

                        var isProgress = false;
                        if ($row != null) {
                            var $progress = UI.RegionList.getItemProgressCircle($row);
                            isProgress = $progress.css("visibility") == "visible";
                            isProgress = isProgress || (downloadStatus == HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadCompleted);
                            isProgress = isProgress || (accessoryTransferStatus == HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferInProgress);
                        }

                        // ダウンロードファイルの有無を設定
                        _this.setDownloaded(key, isProgress);

                        if (maxVersion > fromVersion) {  //未DL

                            if (UI.RegionList.getButtonStatus($row)) {
                                //keyに項目追加
                                key[MobileOta.AhaConnectSDK_KEY_FROM_VERSION] = fromVersion;
                                key[MobileOta.AhaConnectSDK_KEY_TO_VERSION] = maxVersion;
                                key[MobileOta.AhaConnectSDK_KEY_SIZE] = size;
                                key[MobileOta.AhaConnectSDK_KEY_DOWNLOADSTATUS] = downloadStatus;

                                // updateDatasにtoVersionを設定
                                _this.setUpdateDatasProperty(regionID, undefined, 'toVersion', maxVersion);

                                // downloadボタンに更新
                                _this.updateButton(_this.buttonType.download);

                                //地図データ総サイズを更新
                                totalDownloadSize += size;
                                downloadRegions.push({
                                    "regionID" : regionID,
                                    "size" : size
                                });
                            }
                            // 地域リスト表示内容変更
                            _this.updateItemList($row, null, size);

                            // アイコン表示
                            _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.NOT_DOWNLOAD);
                            // 地図の色変更：地図データ未ダウンロード
                            _this.setRegionColor(key, UI.RegionList.getButtonStatus($row) ? _this.mapColor.notDownload : _this.mapColor.notSelect);

                            // カテゴリ変更
                            _this.updateCategory(key, HarmanOTA.AhaConnectSDK_DownloadStatus.DownloadInitiated, null);

                        } else {
                            //車載器転送済み

                            // 地域リスト表示内容変更
                            _this.updateItemList($row, fromVersion, null);
                            // アイコン表示
                            _this.setItemIcon(key, UI.MAP_DATA_ICON_TYPE.UPDATED);
                            // 地図の色変更：車載機への地図データ転送済
                            _this.setRegionColor(key, UI.RegionList.getButtonStatus($row) ? _this.mapColor.updated : _this.mapColor.notSelect);

                            _this.updateCategory(key, null, HarmanOTA.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted);
                        }
                    }
                }
            }

            //handleNotifyData呼び出し処理
            //notify通知がない場合は以下の処理を行わない
            if (notifyProgress != undefined) {
                _this.handleNotifyData(notifyPayload, HarmanOTA.AhaConnectSDK_JsonType);
            }

            // ストレージ容量表示
            _this.showStorageInfo(totalDownloadSize, _this.sortDownloadedRegions(downloadRegions));

            if (_this.isMap && _this.checkDownloading()) {
                //全てのチェックボックスを非活性とする
                _this.setAllCheckBoxStatus(true);
            }

            return true;
        }

        /**
         * KVSの書き込み順で配列をソートする
         * @param {*} downloadRegions
         */
        RegionPageManager.prototype.sortDownloadedRegions = function (downloadRegions) {
            var selectedRegions = new Array();
            for (var kvsIndex = 0; kvsIndex < this.selectedRegionIDList.length; kvsIndex++ ){
                var regionID = this.selectedRegionIDList[kvsIndex];
                for (var downloadIndex = 0; downloadIndex < downloadRegions.length; downloadIndex++) {
                    if (regionID == downloadRegions[downloadIndex].regionID) {
                        selectedRegions.push({
                            "regionID" : regionID,
                            "size" : downloadRegions[downloadIndex].size
                        });
                        break;
                    }
                }
            }
            return selectedRegions;
        }

        /**
         * ソース（取得元）とターゲット（比較対象）のプロパティを比較し、一致しているものをレスポンスする。
         * @param {*} src 
         * @param {*} srcPropList 
         * @param {*} target 
         * @param {*} targetPropList 
         */
        RegionPageManager.prototype.margeUtil = function (src, srcPropList, targetList, targetPropList) {
            for(var i = 0; i < targetList.length; i++) {
                var tmpItem = targetList[i];
                var same = true;
                for(var j = 0; j < srcPropList.length; j++) {
                    var srcP = srcPropList[j];
                    var tarP = targetPropList[j];
                    if (src[srcP] == tmpItem[tarP]) {
                        continue;
                    } else {
                        same = false;
                        break;
                    }
                }

                if (same) {
                    return tmpItem;
                }
            }
            return null;
        }
        
        /**
         * GetCurrentMapDetailの結果について、現在のgeoJsonに含まれるものだけ残す
         * @param {*} callback 
         * @param {*} launcherUserArea 
         */
        RegionPageManager.prototype.getCurrentMapDetailFromGeoJson = function (callback,launcherUserArea) {
            var _this = this;
            _this.diveGeoJson(_this.mapDetails, [launcherUserArea], callback, function(features) {
                var nds_region = _this.mapDetails.data[0].mapJson.nds_product[0].nds_region;
                var nds_region_len = nds_region.length;
                for(var ndsRegionIndex = 0; ndsRegionIndex < nds_region_len; ndsRegionIndex++) {
                    //regionIDぶんループ
                    var remove = true;
                    for (var getJsonIndex = 0; getJsonIndex < features.length; getJsonIndex++) {
                        var regionID = features[getJsonIndex].properties.regionID; //geojson定義のregionID
                        if (regionID == nds_region[ndsRegionIndex].id) {
//                            console.log('currentMapData : not exist on geoJson : ' + JSON.stringify(nds_region[ndsRegionIndex]));
                            remove = false;
                            break;
                        }
                    };

                    if (remove) {
                        nds_region.splice(ndsRegionIndex, 1);
                        // 要素を削除したので、ループ条件補正する
                        ndsRegionIndex--;
                        nds_region_len--;
                    }
                }
            });
        };
        
        /**
         * 
         * @param {*} checkForUpdateResult 
         * @param {*} callback callback(selectedProductRegions, checkForUpdateRegions, data, product)
         */
        RegionPageManager.prototype.diveSameProductRegions = function (checkForUpdateResult, callback) {
            var _this = this;
            
            // CheckForUpdateの結果にて、DL済みとなっているものを選択済みとして追加する
            // data
            for(var dataIndex = 0; dataIndex < _this.selectedMapDetails.data.length; dataIndex++) {
                var dataSource = _this.selectedMapDetails.data[dataIndex];
                var dataItem = _this.margeUtil(dataSource, ['deviceCode','productCode'], checkForUpdateResult.data, ['deviceCode','productCode']);
                if (dataItem == null) {
                    continue;
                }

                // product
                for(var productIndex = 0; productIndex < dataSource.mapJson.nds_product.length; productIndex++) {
                    var productSource = dataSource.mapJson.nds_product[productIndex];
                    var productItem = _this.margeUtil(productSource, ['id'], dataItem.products, ['id']);
                    if (productItem == null) {
                        continue;
                    }

                    callback(productSource.nds_region, productItem.Regions, dataItem, productItem); 
                }
            }
        }

        RegionPageManager.prototype.getSelectedCheckForUpdateResult = function (checkForUpdateResult) {
            var _this = this;
            // deep copy
            checkForUpdateResult = JSON.parse(JSON.stringify(checkForUpdateResult));

            // 現在、選択されている地域のCheckForUpdateの結果だけ抽出する

            // CheckForUpdateの結果にて、DL済みとなっているものを選択済みとして追加する
            _this.diveSameProductRegions(checkForUpdateResult, function (selectedProductRegions, checkForUpdateRegions) {

                // region(CheckForUpdate)のうち、DL済みのものを検索し、選択済みとしてマージする
                var len = checkForUpdateRegions.length;
                for (var regionIndex = 0; regionIndex < len; regionIndex++) {
                    var regionItem = checkForUpdateRegions[regionIndex];
                    var sameRegion = _this.margeUtil(regionItem, ['regionID'], selectedProductRegions, ['id']);
                    if (sameRegion == null) {
                        checkForUpdateRegions.splice(regionIndex, 1);
                        // 要素を削除したので、ループ条件補正する
                        len--;
                        regionIndex--;
                    }
                }
            });

            return checkForUpdateResult;
        }

        RegionPageManager.prototype.margeCheckForUpdateResult = function (checkForUpdateResult, result) {
            var _this = this;
            
            var regionIDList = [];  // 新たに選択されたregion

            // CheckForUpdateの結果にて、DL済みとなっているものを選択済みとして追加する
            _this.diveSameProductRegions(checkForUpdateResult, function (selectedProductRegions, checkForUpdateRegions) {

                // region(CheckForUpdate)のうち、DL済みのものを検索し、選択済みとしてマージする
                for (var regionIndex = 0; regionIndex < checkForUpdateRegions.length; regionIndex++) {
                    var regionItem = checkForUpdateRegions[regionIndex];
                    if (regionItem.downloadStatus == MobileOta.AhaConnectSDK_DownloadStatus.DownloadInProgress ||
                        regionItem.downloadStatus == MobileOta.AhaConnectSDK_DownloadStatus.DownloadCompleted)
                    {
                        if (_this.isMap) {
                            if (_this.checkAddableRegionList(regionItem.regionID)) { // リストに追加した
                                _this.addRegionsList(regionItem.regionID);
                            } else {
                                // チェックボックス更新
                                _this.setListChecked(regionItem.regionID, true);
                            }
                        } else {
                            _this.setListChecked(regionItem.regionID, true);
                        }
                        regionIDList.push(regionItem.regionID);
                    }
                }

            });

            if (regionIDList.length > 0) {
                _this.addRegionIDtoKVS(regionIDList, true);
            }

            // データのカテゴリ分けを実施する
            this.margeUpdateDatas(AnalyseAhaConnectSDKResponse.analyseCurrentMapDetails(_this.selectedMapDetails));
        }

        /**
         * checkForUpdate送信実行
         */
        RegionPageManager.prototype.startCheckForUpdate = function (keysArray, $regions, checkForUpdateResult, result) {
            var _this = this;
            var deferred = jQuery.Deferred();

            var notifyPayload = null;
            var notifyRegionID = null;
            var notifyProgress = null;

            // ローディング
            _this.setLoading(true);

            //進捗率notifyデータが取得できた場合はKVSに書き込み
            _this.getdownloadMapDataProgress(function (data) {
                MobileOta.Common.log("MobileOtaGen4 gettransferMapDataProgress resp");
                if (data != undefined) {
                    notifyPayload = data;
                    if (notifyPayload.notify != undefined) {
                        notifyRegionID = notifyPayload.data[0].regionID;
                        notifyProgress = notifyPayload.data[0].progress;
                    } else if (data.resp == "startDownload"){
                        notifyPayload.notify = "startDownload";
                        notifyRegionID = data.data[0].regionID;
                        notifyProgress = 0;
                        var key = JSON.parse(JSON.stringify(data.data[0]));
                        key.status = MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated;
                        _this.updateDownloadingKeys(key, MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated);
                    }
                }

                var resultFunc = function (checkForUpdateResult, result) {
                    MobileOta.Common.log("MobileOtaGen4.checkForUpdate resp");
                    // ローディング非表示
                    _this.setLoading(false);

                    if (checkForUpdateResult == null) {
                        deferred.reject();
                        return;
                    }

                    if (checkForUpdateResult.data[0].errorCode == 0 || checkForUpdateResult.data[0].errorCode == undefined ) {
                        // CheckForUpdateの結果から、最終的に選択された地域のみ、抽出する
                        checkForUpdateResult = _this.getSelectedCheckForUpdateResult(checkForUpdateResult);
                    }

                    if (!_this.handleCheckForUpdateError(checkForUpdateResult, result, deferred)) {
                        return;
                    }

                    if (!_this.buildLayoutFromCheckForUpdate(checkForUpdateResult, result, notifyRegionID, notifyProgress, notifyPayload)) {
                        deferred.reject();
                        return;
                    }

                    if (notifyRegionID != null) {
                        HarmanOTA.AhaConnectHTMLSDK.getInstance().getDownloadQueue(function (keys) {
                            if (keys.length > 0) {
                                for (var i = 0; i < keys.length; i++) {
                                    _this.updateDownloadingKeys(keys[i],MobileOta.AhaConnectSDK_DownloadStatus.DownloadInitiated);
                                }
                            }
                        });
                    }

                    _this.reloadListIcon();

                    deferred.resolveWith(this);
                };

                //checkForUpdateリクエスト
                if (checkForUpdateResult != undefined && result != undefined) {
                    // 既にcheckForUPdateを実行済みであれば、その結果を引数で渡すこと
                    resultFunc(checkForUpdateResult, result);
                } else {
                    _this.isCheckForUpdate = true;
                    _this.ahaConnectSDKController.checkForUpdate(keysArray, $regions, function (checkForUpdateResult, result) {
                        _this.margeCheckForUpdateResult(checkForUpdateResult, result);
                        resultFunc(checkForUpdateResult, result);
                        _this.isCheckForUpdate = false;
                    });
                }

            }, function () {
                MobileOta.Common.log("MobileOtaGen4 gettransferMapDataProgress req");
            });

            return deferred.promise();
        };

        RegionPageManager.prototype.setProgressCircleVisible = function (isVisible, key, $row) {
            if ($row == undefined || $row == null) {
                $row = this.getUpdateDataRow(key);                
            }

            if ($row == null) {
                return;
            }

            if (isVisible) {
                var itemInfo = UI.RegionList.getItemInfo($row);
                if (!itemInfo.showprogress) {
                    UI.RegionList.setItemInfo($row, { "showprogress": true, "progress": 0, "regionID" : key.regionID });
                }
            } else {
                UI.RegionList.setItemInfo($row, { "showprogress": false, "progress": 0, "regionID" : key.regionID });
            }
        };

        /**
          * リストにアイコンを設定する
          * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
          * @param iconType アイコンタイプ
          */
        RegionPageManager.prototype.setItemIcon = function (key, iconType) {
            var $item = this.getUpdateDataRow(key);
            if ($item == null) {
                return;
            }

            if (UI.RegionList.getButtonStatus($item)) {
                UI.RegionList.setItemInfo($item, { 'icon': iconType });
            } else {
                // アイコンを非表示
                this.hiddenItemIcon($item);
            }
        };

        /**
          * リストのアイコンを非表示にする
          * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
          */
        RegionPageManager.prototype.hiddenItemIcon = function ($item) {
            UI.RegionList.setItemInfo($item, { 'icon': UI.MAP_DATA_ICON_TYPE.HIDDEN });
        };

        /**
         * 任意の桁で四捨五入する関数
         * @param {number} value 四捨五入する数値
         * @param {number} base どの桁で四捨五入するか（10→10の位、0.1→小数第１位）
         * @return {number} 四捨五入した値
         */
        RegionPageManager.prototype.orgRound = function (value, base) {
            return Math.round(value * base) / base;
        }
        /**
          * ストレージ容量を示すバーを表示する
         */
        RegionPageManager.prototype.showStorageBar = function (RegionPercent, freeSizePercent, RegionSize_value, freeSize_value, totalSize_value) {
            var RegionPercent_round = this.orgRound(RegionPercent,2);
            var style1 = document.getElementById("storage_used").style;
            var storageUsedPercent = this.orgRound(100 - freeSizePercent,2);
            var calc_usedStoragePercent = this.orgRound(storageUsedPercent + RegionPercent_round,2);
            var calc_freeSizePercent = this.orgRound(100 - calc_usedStoragePercent,2);

            style1.width = this.orgRound((storageUsedPercent * 0.70),2) + '%';
            $(RegionPageManager.REGION_TOTAL).css("left", this.orgRound((storageUsedPercent * 0.70),2) + '%');

            var style2 = document.getElementById("region_total").style;
            style2.width = this.orgRound((RegionPercent_round * 0.70),2) + '%';
            $(RegionPageManager.STORAGE_FREE).css("left", this.orgRound(((storageUsedPercent + RegionPercent_round) * 0.70),2) + '%');

            var style3 = document.getElementById("storage_free").style;
            style3.width = this.orgRound((calc_freeSizePercent * 0.70),2) + '%';
            $(RegionPageManager.REGION_TOTAL_VAL).css("left", this.orgRound(((storageUsedPercent + RegionPercent_round + calc_freeSizePercent) * 0.70),2) + '%');

            var style4 = document.getElementById("storagebar_value").style;
            style4.left = 70 + '%';
            style4.width = 30 + '%';

            var freeSize_unit = freeSize_value / 1000 / 1000 / 1000;
            freeSize_unit = freeSize_unit * 10;
            freeSize_unit = Math.round(freeSize_unit) / 10;
            var totalSize_unit = totalSize_value / 1000 / 1000 / 1000;
            totalSize_unit = Math.round(totalSize_unit);

            document.getElementById('storagebar_value').innerHTML = freeSize_unit + "GB /" + totalSize_unit +"GB";

        };

        /**
          * 車載機転送中か判定する
          * @return 車載機転送中か否か（true:車載機転送中）
          */
        RegionPageManager.prototype.checkTransferProgress = function () {
            for (var i = 0; i < this.transferringKeys.length; i++) {
                if (this.transferringKeys[i].status != MobileOta.AhaConnectSDK_AccessoryTransferStatus.TransferCompleted) {
                    return true;
                }
            }
            return false;
        };

        /**
         * 地域の色設定用コールバックを登録する
         * @param func コールバック
         */
        RegionPageManager.prototype.setRegionColorCallback = function (func) {
            this.regionColorCallback = func;
        };

        /**
         * 地域の色を設定する
         * @param key データキー
         * @param color 色
         */
        RegionPageManager.prototype.setRegionColor = function (key, color) {
            if (this.regionColorCallback != null) {
                this.regionColorCallback(key.regionID, color);
            }
        };

        /**
         * 地域リストのバージョン、サイズを更新する
         */
        RegionPageManager.prototype.updateItemList = function ($item, version, size) {
            // データ行内のトグルボタンを表示
            UI.RegionList.setShowButton($item, true);

            // Region名表示
            $title = UI.RegionList.getItemTitleCss($item);
            $title.css("visibility", "visible");

            UI.RegionList.setItemVersion($item, {
                "label": version == null ? "" : this.texts.version,
                "value": version == null ? "" : (version != "-" ? MobileOta.Common.convertDate(version, this.language): version),
            });
            UI.RegionList.setItemSize($item, {
                "label": size == null ? "" : this.texts.size,
                "value": size == null ? "" : (size != "-" ? MobileOta.Common.formatDataSize(size,1000) : size),
            });
        };

        /**
         * ボタンの更新
         * @param buttonType ボタンタイプ
         */
        RegionPageManager.prototype.updateButton = function (buttonType) {
            this.currentButtonType = buttonType;
            //buttonTypeごとに処理を分岐
            switch (buttonType) {
                case this.buttonType.checkForUpdate:
                    UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.checkForUpdate);
                    break;

                case this.buttonType.download:
                    UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.alldownload);
                    break;

                case this.buttonType.ok:
                    UI.PageBottomButton.setLabel(this.$downloadButton, this.texts.ok);
                    break;
            }
        };

        /**
         * ボタンタイプの取得
         * @return ボタンタイプ
         */
        RegionPageManager.prototype.getButtonType = function () {
            return this.currentButtonType;
        };

        /**
         * ストレージバーの表示
         * @param 地図の容量（選択されている合計値）
         */
        RegionPageManager.prototype.showStorageInfo = function (regionSize, downloadRegions, callback) {
            var _this = this;

            // MWS request 
            mwsRequestManager.initialize(function () {
                // complete
                getStorageInfoApi().then(function (responseText) {
                    // resolve(success)
                    if (responseText != undefined && responseText != null && responseText != "") {
                        MobileOta.Common.log("getStorageInfoApi: " + responseText);

                        var data = JSON.parse(responseText);
                        var totalSize = data.totalSize;
                        var freeSize = data.freeSize;

                        if (regionSize > freeSize) {
                            // ストレージ容量不足
                            console.log("regionSize: " + regionSize + " totalSize: " + totalSize + " freeSize: " + freeSize);
                            //ストレージバー表示
                            var freePercent = freeSize / totalSize * 100;
                            _this.showStorageBar(0, freePercent, 0, freeSize, totalSize);
                            // ローディング終了
                            _this.setLoading(false);
                            // ダイアログ表示
                            _this.createModalDialogOkButton(_this.texts.popupCapacityExceeded, function () {
                                var regionIDList = new Array();

                                if (downloadRegions != undefined) {
                                    //選択状態を解除
                                    var totalSizes =0
                                    for (var downloadIndex = downloadRegions.length - 1; downloadIndex > -1; downloadIndex-- ) {
                                        var regionID = downloadRegions[downloadIndex].regionID;
                                        totalSizes += downloadRegions[downloadIndex].size;

                                        // 選択状態を解除
                                        if (_this.isMap) {
                                            //未選択状態に戻す
                                            _this.setGeojsonRegionColor(regionID, _this.mapColor.notSelect);
                                        }
                                        // チェックボックス更新
                                        _this.setListChecked(regionID, false);
                                        regionIDList.push(regionID);

                                        // 選択中地域のデータサイズ ＜ 空き領域の場合、処理を抜ける
                                        regionSize -= totalSizes;
                                        if (regionSize < freeSize) {
                                            break;
                                        }
                                     };
                                }

                                //ストレージバー表示
                                var regionPercent = regionSize / totalSize * 100;
                                var freePercent = freeSize / totalSize * 100;
                                _this.showStorageBar(regionPercent, freePercent, regionSize, freeSize, totalSize);

                                 //KVSから対象地域を削除
                                 _this.addRegionIDtoKVS(regionIDList, false);

                                //モーダルクローズ
                                _this.closeModalDialog();
                                // checkForUpdateボタンに更新
                                _this.updateButton(_this.buttonType.checkForUpdate);

                            });
                            return;
                        } else {
                            var regionPercent = regionSize / totalSize * 100;
                            var freePercent = freeSize / totalSize * 100;
                            _this.showStorageBar(regionPercent, freePercent, regionSize, freeSize, totalSize);

                            console.log("regionSize: " + regionSize + " totalSize: " + totalSize + " freeSize: " + freeSize + " region: " + regionPercent + "%" + " free: " + freePercent + "%");
                        }
                        //コールバックが設定されている場合は実行
                        if (callback != undefined) {
                            console.log("showStorageInfo callback");
                            callback();
                        }
                    }
                }, function () {
                    // resolve(reject)
                    console.log("showStorageInfo error");
                    //コールバックが設定されている場合は実行
                    if (callback != undefined) {
                        console.log("showStorageInfo callback");
                        callback();
                    }

                });
            });

            function getStorageInfoApi() {
                var value = null;
                var url = mwsRequestManager.getMWSUrl() + "get-storage-info";
                var d = $.Deferred();

                $.ajax({
                    type: "GET",		// HTTPメソッド
                    url: url,			// URL
                    async: true,		// 非同期
                    timeout: 50000,		// タイムアウト
                    success: function (data, status, xhr) {
                        MobileOta.Common.log("getStorageInfoApi success:" + xhr.responseText);
                        d.resolve(xhr.responseText);
                    },
                    error: function (xhr, status, err) {
                        MobileOta.Common.log("getStorageInfoApi error : timeout");
                        d.reject();
                    }
                });
                return d.promise();
            }
        };

        RegionPageManager.prototype.margeUpdateDatas = function (newDatas) {    // updateDatas.push
            if (this.updateDatas == null || this.updateDatas.length == 0) {
                this.updateDatas = newDatas;
                return;
            }
            this.updateDatas = JSON.parse(JSON.stringify(this.updateDatas));  // deep copy
            for (var key in newDatas) {
                var categoryNew = newDatas[key];
                for (var i = 0; i < categoryNew.length; i++) {
                    var targetData = categoryNew[i];
                    var dataOrg = this.getUpdateDatas(targetData.key.regionID);
                    if (dataOrg == null) {
                        HarmanOTA.AnalyseAhaConnectSDKResponse.addUpdateListData(this.updateDatas, targetData, +key);
                    }
                }
            }
        };

        /**
          * 独自処理関数
          */
        RegionPageManager.prototype.settingPageItemFunc = {
            clickOKButton: function () { },
            keyUpSearchBox: function () { },
            showMapArea: function () { },
            clickSearchResult: function () { },
        };

        /**
         * 代表地点の緯度経度とマッチング
         * @param  latLng 比較対象の緯度経度
         */
        RegionPageManager.prototype.matchRepresentativePoint = function (latLng) {
            var _this = this;

            //代表地点とマッチング
            var matchingData = new Array();
            //代表地点の件数分ループ
            for (var i = 0; i < _this.mapLayers.length; i++) {
                //代表地点との直線距離を算出
                matchingData.push({
                    "regionID": _this.mapLayers[i].regionID,
                    "latitude": _this.mapLayers[i].latitude,
                    "longitude": _this.mapLayers[i].longitude,
                    "distance": latLng.distanceTo(L.latLng(_this.mapLayers[i].latitude, _this.mapLayers[i].longitude))
                });
            };

            //検索結果１レコードに対し、代表地点との距離順にソート（昇順）
            matchingData.sort(function (a, b) {
                if (a.distance < b.distance) return -1;
                if (a.distance > b.distance) return 1;
                return 0;
            });

            return matchingData;
        };

        /**
         * 
         * @param {*} targetMapDetails mapDetails Jsonを渡してください
         * @param {*} launcherUserAreas 配列で対象地域を渡してください
         * @param {*} callback 処理完了時のコールバック
         * @param {*} execureCallback 処理移譲のコールバック
         */
        RegionPageManager.prototype.diveGeoJson = function (targetMapDetails, launcherUserAreas, callback, execureCallback) {
            var _this = this;
            var requestUrl = new Array();
            var proxyCallback = callback;
            if (proxyCallback == undefined || proxyCallback == null) {
                proxyCallback = function (isSuccess) {
                }
            }

            if (execureCallback == undefined || execureCallback == null) {
                execureCallback = function() {};
            }

            //北米地域の場合
            if (targetMapDetails.data[0].mapJson.nds_product[0].name == MobileOtaGen4.PageManagerGen4.NORTH_AMERICA) {
                for (var index = 0; index < launcherUserAreas.length; index++) {
                    requestUrl.push(MobileOtaGen4.PageManagerGen4.GEOJSON_URL + _this.countryCodeConvert[launcherUserAreas[index]] + ".json");
                };
            } else if (targetMapDetails.data[0].mapJson.nds_product[0].name == MobileOtaGen4.PageManagerGen4.EUROPE) {
                requestUrl.push(MobileOtaGen4.PageManagerGen4.GEOJSON_URL + "EU" + ".json");
            } else if (targetMapDetails.data[0].mapJson.nds_product[0].name == MobileOtaGen4.PageManagerGen4.OCEANIA) {
                requestUrl.push(MobileOtaGen4.PageManagerGen4.GEOJSON_URL + "AU" + ".json");
            } else {
                //対象外の地域の場合処理を抜ける
                proxyCallback();
                return;
            }

            if (requestUrl.length == 0) {
                proxyCallback(false);
            }

            //非同期処理を配列に追加
            var deferredObjects = new Array();
            for (var i = 0; i < requestUrl.length; i++) {
                deferredObjects.push($.ajax({
                    type: "get",		//HTTPメソッド
                    url: requestUrl[i],		//URL
                    async: true,		//同期
                    timeout: 5000,		//タイムアウト
                    dataType: 'text',
                    data: null			//データ
                    })
                );
            };
            
            //
            $.when.apply($, deferredObjects).then(function () {
                var geoJson = new Array();
                var statuses = new Array();
                var jqXHRResultList = new Array();

                if (requestUrl.length == 1) {
                    var result = arguments;
                    geoJson.push(JSON.parse(result[0]));
                    statuses.push(result[1]);
                    jqXHRResultList.push(result[3]);                
                } else {
                    // 結果は仮引数に可変長で入る **順番は保証されている**
                    // 取り出すには arguments から取り出す
                    // さらにそれぞれには [data, textStatus, jqXHR] の配列になっている
                    for (var i = 0; i < arguments.length; i++) {
                        var result = arguments[i];
                        geoJson.push(JSON.parse(result[0]));
                        statuses.push(result[1]);
                        jqXHRResultList.push(result[3]);
                    }
                }
                
                //geoJsonに定義されているRegionIDとgetCurrentMapDetailsの値をマッピング
                //一致するregionは一覧から削除する
                for (var geojsonIndex = 0; geojsonIndex < geoJson.length; geojsonIndex++) {
                    execureCallback(geoJson[geojsonIndex].features);
                };
            
            })
            .then(function () {
                proxyCallback();
            });
        };
        
        /**
         * ルートページ（config画面）へ遷移
         * （コンテンツ側で予期せぬエラーが発生した場合に使用）
         * ※gen4用に戻り先を変更
         */
        RegionPageManager.prototype.backToRootPage = function () {
            HarmanOTA.Common.transitionPage(RegionPageManager.RootPagePath+(JSON.parse(getMemoryAppInfo())).country);
            console.log("[I][back] back to : "+RegionPageManager.RootPagePath+(JSON.parse(getMemoryAppInfo())).country);
        };

        RegionPageManager.RootPagePath = "./../../index.html?countrycode=";

        RegionPageManager.ModuleName = "MobileOta.RegionPageManager";

        //CSS
        RegionPageManager.CSS_MORDALESS = "harman-ota-dialog-mordaless-for-map";
        RegionPageManager.CSS_JQUERY_MOBILE_DISABLED = "ui-state-disabled"; //jQuery-mobileのdisableスタイルクラス

        //定数
        RegionPageManager.OVERLAY_AREA_FOR_MODALESS = "#overlayForModaless";  //overlayエリア
        RegionPageManager.STORAGE_BAR = "#storage_bar";  //容量バー
        RegionPageManager.REGION_TOTAL = "#region_total";  //容量バー（ダウンロードファイル合計）
        RegionPageManager.STORAGE_FREE = "#storage_free";  //容量バー（空き容量）
        RegionPageManager.REGION_TOTAL_VAL = "#storagebar_value";  //容量（ダウンロードファイル合計）
        RegionPageManager.STORAGE_FREE_VAL = "#free_value";  //容量（空き容量）
        RegionPageManager.DIALOG_CONFIRM_MODALESS = "#dialog-confirm-modaless";
        RegionPageManager.UPDATE_LIST = "#update_list";  //選択リスト
        RegionPageManager.BUTTON_ALLDOWNLOAD = "#button_alldownload";  //ダウンロードボタン
        RegionPageManager.COLOR_DOWNLOAD_PROGRESS = "#666"; //色（ダウンロード進捗率）
        RegionPageManager.COLOR_ACCESSORY_TRANSFER_PROGRESS = "#bbb"; //色（車載機転送進捗率）
        RegionPageManager.LEAFLET_AREA = "#map";    //leaflet表示領域
        RegionPageManager.MAP_AREA = "#mapArea";    //検索ボックス＋leaflet＋ストレージバー領域     //Auto Regions Setting 目的地
        RegionPageManager.TAG_KEY_SEARCH = "#tagKeySearch";

        return RegionPageManager;
    })();
    MobileOtaGen4.RegionPageManager = RegionPageManager;

})();
