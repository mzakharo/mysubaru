(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * 更新データ一覧ページ管理クラス
     */
    var RegionMapPageManager = (function () {
        var _super = MobileOtaGen4.RegionPageManager;

        __extends(RegionMapPageManager, _super);

        var UI = MobileOtaGen4.UIGen4;
        var RegionPageManager = MobileOtaGen4.RegionPageManager;

        function RegionMapPageManager() {
            _super.apply(this, arguments);
            this.setRegionColorCallback(this.updateRegionColorCallback);
        }

        /**
         * 初期化処理
         */
        RegionMapPageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.isMap = true;                  //地図画面

            var map = null;                     //leaflet
            var countryCode = null;             //counrtycode
            var geoJsonCode = null;

            //曖昧検索関連変数
            var searchResult = null;
            var marker_current = null;          //現在位置marker
            var current = null;                 //現在位置情報{regionID,regionName,latLng}
            var marker_destination = null;      //目的地marker
            var destination = null;             //目的地情報{regionID,regionName,latLng}
            var mapEnable = null;               //地図選択可能フラグ

            this.$searchBox = null;
            this.$searchList = null;
            this.$autoRegionsSettingList = null;
        
            this.language = null;
            this.geojson = null;
            this.mapLayers = new Array();  //全layer（regionID,layer）
            this.mapHeight = $(window).height() * 0.37; //OpenStreetMap表示領域の高さ
            // OpenStreetMap中心座標  
            // key:geoJsonCode value:中心とするの緯度経度
            this.osmCenterPosition = {
                "US": { 
                        "latLng": L.latLng(37.8, -96),
                        "zoom": 3
                    },
                "CA": { 
                        "latLng": L.latLng(59.79, -112.46),
                        "zoom": 2
                    },
                "MX": { 
                        "latLng": L.latLng(21.65, -102.01),
                        "zoom": 3
                    },
                "EU": {
                    "latLng": L.latLng(61.87525, 35.10269),
                    "zoom": 1
                },
                "AU": {
                    "latLng": L.latLng(-30.80083, 131.20522),
                    "zoom": 3
                }
            };

        };

        /**
         * 画面初期化
         * @param language 言語コード
         */
        RegionMapPageManager.prototype.initPage = function (language) {
            // 画面固有の関数設定
            this.setFunc();
            this.language = language;

            _super.prototype.initPage.call(this, language);

            HarmanOTA.CommonHTMLSDK.getInstance().readKVS("geocode_iso_country_code/", function (key, value) {
                console.log("[I][regionMapPageManager][initPage][readKVS] key : "+key+" geocode_iso_country_code : "+value);
                try {
                    countryCode = value.split("_").length == 2 ? value.split("_")[1] : value.split("_")[0];
                    console.log("[I][regionMapPageManager][initPage][readKVS] countryCode = "+countryCode);
                } catch (e) {
                    console.log("[E][regionMapPageManager][initPage][readKVS] can't get countryCode.");
                    countryCode = "US";
                }
                this.$('#backbutton').attr('href', '../../index.html?countrycode=' + countryCode);
            });


        };

        /**
         * 画面固有の関数設定
         */
        RegionMapPageManager.prototype.setFunc = function () {
            var _this = this;

            /** 
             * OKボタンクリック時の処理（曖昧検索時のみ使用）
             */
            RegionMapPageManager.prototype.settingPageItemFunc.clickOKButton = function () {
                _this.setOverlay(true);
                // ポップアップ表示
                _this.createModalDialogNoButton(_this.texts.autoRegionsSetting);
                // 自動地域設定結果表示
                _this.showResultAutoRegionsSetting();
                //ポップアップをクローズ
                _this.closeModalDialog();

                //検索ボックスクリア
                $(RegionPageManager.TAG_KEY_SEARCH).val("");
                $(RegionMapPageManager.TAG_KEY_SEARCH_CLEAR).remove();
                //オーバーレイ解除
                _this.setOverlay(false);
            };

            /**
             * 検索ボックスのイベント設定
             */
            RegionMapPageManager.prototype.settingPageItemFunc.keyUpSearchBox = function () {

                _this.$searchBox = $(RegionPageManager.TAG_KEY_SEARCH);
                _this.$searchBox.prop("placeholder",_this.texts.searchbox);
                _this.$searchBox.keyup(function (event) {
                    switch (event.type) {
                        case 'keyup':
                            // returnが入力された
                            if (event.keyCode == 13) {
                                _this.enterSearchBox();
                                //キーボードを閉じる
                                $(RegionPageManager.TAG_KEY_SEARCH).blur();
                            }
                            break;
                    }
                });

                //クリア処理
                _this.$searchBox.change(function (e) {
                    if (e.target.value == "") {
                        // 選択地域リストを表示
                        $(RegionMapPageManager.UPDATE_LIST).css("display", "block");
                        //検索ボックスクリア処理
                        _this.initSelectRegionList();
                        //現在地情報削除
                        _this.deleteCurrentInfo();
                        //目的地情報削除
                        _this.deleteDestinationInfo();
                        //他のコントロールを可視状態とする
                        _this.switchSearchListVisible(false);
                        //オーバーレイ処理
                        _this.setOverlay_SearchBox(true);
                    }
                });

                //オーバーレイ処理
                _this.$searchBox.click(function (e) {
                    _this.setOverlay_SearchBox(true);
                });

                //オーバーレイ解除
                $(RegionMapPageManager.OVERLAY_AREA).click(function (e) {
                    //検索ボックスにCSSが設定されている場合のみ実行
                    if ($(RegionMapPageManager.TAG_KEY_SEARCH_AREA).hasClass(RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_ON)) {
                        _this.setOverlay_SearchBox(false);
                    }
                });

            };

            /**
             * 検索結果リストクリックイベント
             */
            RegionMapPageManager.prototype.settingPageItemFunc.clickSearchResult = function () {

                $(RegionMapPageManager.SEARCH_LIST).click(function (e) {
                    var regionID;
                    var latLng;

                    //検索結果を選択
                    if (e.target.lastElementChild == undefined) {
                        regionID = e.target.dataset.regionid;
                        latLng = L.latLng(e.target.dataset.latitude, e.target.dataset.longitude);
                    } else {
                        regionID = e.target.lastElementChild.dataset.regionid;
                        latLng = L.latLng(e.target.lastElementChild.dataset.latitude, e.target.lastElementChild.dataset.longitude);
                    }

                    //リスト表示
                    _this.showAutoRegionsSettingList(regionID, latLng);
                });
            };

        };


        /**
         * 画面項目設定
         */
        RegionMapPageManager.prototype.settingPageItem = function () {
            _super.prototype.settingPageItem.call(this);
        };

        RegionMapPageManager.prototype.selectMapRegion = function (regionID) {
            var _this = this;
            
            //フラグが設定されていない場合、もしくはtrueの場合は地図選択可能
            if (_this.mapEnable == undefined || _this.mapEnable) {
                //リスト追加
                var regionIDList = [regionID];
                _this.addRegionIDtoKVS(regionIDList, _this.switchRegionsList(regionID));
                // checkForUpdateボタンに更新
                _this.updateButton(_this.buttonType.checkForUpdate);
                //選択中のregionが１件もない場合はボタンをハッチング 
                if (_this.isAllUnselected()) {
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, false);
                } else {
                    // ボタンハッチング解除
                    UI.PageBottomButton.setEnabled(_this.$downloadButton, true);
                }
            }
        }

        /**
          * 地図を更新
          */
        RegionMapPageManager.prototype.updateMap = function (callback) {
            var proxyCallback = callback;
            if (proxyCallback == undefined || proxyCallback == null) {
                proxyCallback = function () {
                }
            }
            var _this = this;

            geoJsonCode = _this.getGeojsonCode();
            var geojsonURL = RegionPageManager.GEOJSON_URL + geoJsonCode + ".json";
            var centerPoint = _this.osmCenterPosition[geoJsonCode]; //中心位置の座標,zoom尺度

            map = L.map('map', {
                zoomControl: false
            }
            ).setView(centerPoint.latLng, centerPoint.zoom);

            //高さを動的に変更
            $(RegionMapPageManager.MAP).height(_this.mapHeight);
            map.invalidateSize();

            //ダブルクリップでのズームを許可しない
            map.doubleClickZoom.disable();

            //OSMレイヤー追加
            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright?openlink_exbrowser=true">OpenStreetMap</a>',
                    maxZoom: 18
                }
            ).addTo(map);

            //geoJson取得
            $.getJSON(
                geojsonURL, //リクエストURL
                null, //送信データ
                function (data, status) {
                    console.log("geojson file read complete.");

                    // geojson設定
                    _this.geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                    //geojsonから全layerを取得し、regionIDとマッピング
                    for (var key in _this.geojson._layers) {
                        _this.mapLayers.push({
                            "regionID": _this.geojson._layers[key].feature.properties.regionID,
                            "region_points": _this.geojson._layers[key].feature.properties.region_points,
                            "layer": _this.geojson._layers[key]
                        });
                    }

                    //geojsonごとにcopyrigjt設定
                    map.attributionControl.addAttribution(_this.getGeojsonCopyright());

                    proxyCallback();
                }

            ).fail(function (delegate) {
                //JSONファイル読み込み失敗時
                console.log("geojson file read not complete.");

                // ローディング非表示
                $.mobile.hidePageLoadingMsg();
                if (delegate != undefined && delegate.delegateErrorHandle != undefined) {
                    delegate.delegateErrorHandle();
                }
                else {
                    // 汎用エラー
                    _this.genericError(true);
                }
                proxyCallback();
            });

            /* ----------------------------------- leaflet関連処理 ----------------------------------------- */
            // get color depending on population density value
            function getColor(d) {
                return d >= _this.mapColor.updated ? RegionMapPageManager.COLOR_UPDATED : // 選択状態　車載機更新済
                    d >= _this.mapColor.notUpdate ? RegionMapPageManager.COLOR_NOTUPDATE : // 選択状態　車載機更新未
                        d >= _this.mapColor.notDownload ? RegionMapPageManager.COLOR_NOTDOWNLOAD : // 選択状態　未DL
                            d >= _this.mapColor.selected ? RegionMapPageManager.COLOR_SELECTED : // 選択状態　checkForUpdate実行前
                                RegionMapPageManager.COLOR_NOTSELECT; // 未選択
            }

            //基本の色設定
            function style(feature) {
                return {
                    weight: 1,
                    opacity: 1,
                    color: RegionMapPageManager.COLOR_DEFAULT,
                    dashArray: '',
                    fillOpacity: 0.7,
                    fillColor: getColor(feature.properties.density)
                };
            }

            //regionクリック時の処理
            function clickRegion(e) {
                _this.selectMapRegion(e.target.feature.properties.regionID);
            }

            //レイヤー関連イベント設定
            function onEachFeature(feature, layer) {
                layer.on({
                    click: clickRegion
                });
            }
            /* ----------------------------------- leaflet関連処理 ----------------------------------------- */
        };

        /**
         * geojsonのCopyrightを設定
         */
        RegionMapPageManager.prototype.getGeojsonCopyright = function () {
            var copyright = null;

            switch (geoJsonCode) {
                case "US":
                case "EU":
                    copyright = '<a href="http://www.publicamundi.eu/?openlink_exbrowser=true">PublicaMundi</a>';
                    break;

                case "CA":
                    copyright = ''; //TODO ライセンスを記述
                    break;

                case "MX":
                    copyright = ''; //TODO ライセンスを記述
                    break;

                case "AU":
                    copyright = ''; //TODO ライセンスを記述
                    break;
            }

            if (copyright != undefined && copyright != "") {
                copyright = "GeoJSON data &copy; " + copyright;
            }

            return copyright;
        };

        RegionMapPageManager.prototype.getGeojsonCode = function () {
            var _this = this;
            var geoJsonCode = null;

            switch (_this.mapDetails.data[0].mapJson.nds_product[0].name) {
                case MobileOtaGen4.PageManagerGen4.NORTH_AMERICA:
                    geoJsonCode = _this.countryCodeConvert[_this.selected_area];
                    break;

                case  MobileOtaGen4.PageManagerGen4.EUROPE:
                    geoJsonCode = "EU";
                    break;

                case  MobileOtaGen4.PageManagerGen4.OCEANIA:
                    geoJsonCode = "AU";
                    break
                }

            return geoJsonCode;
        };

        /**
         * 現在位置を設定
         */
        RegionMapPageManager.prototype.setCurrentPoint = function () {
            var _this = this;
            var matchingData = new Array();

            //GPS情報が取得できない場合は処理を抜ける
            if (_this.gpsValue == undefined) {
                return;
            }

            //現在位置情報設定
            _this.current = new Object();
            //現在地に最も近い代表地点を含むregionを取得
            matchingData = _this.matchRepresentativePoint_regionpoint(_this.gpsValue);

            //現在位置を含むregionの設定
            _this.current[RegionMapPageManager.KEY_REGIONID] = matchingData.regionID;    //regionID
            _this.current[RegionMapPageManager.KEY_REGIONNAME] = _this.texts.currentposition;  //regionName (getCurrentMapDetailsより取得)
            _this.current[RegionMapPageManager.KEY_LATLNG] = L.latLng(_this.gpsValue.lat, _this.gpsValue.lng); //latLng

            //マーカー配置
            var currentIcon = L.icon({
                iconUrl: UI.AutoRegionsSettingList.ROW_ICON_CURRENT_PATH,
                iconRetinaUrl: UI.AutoRegionsSettingList.ROW_ICON_CURRENT_PATH,
                iconSize: [13, 13],
                iconAnchor: [13, 13] //オフセットの位置
            });
            _this.marker_current = new L.marker(_this.gpsValue, { icon: currentIcon });
            map.addLayer(_this.marker_current);

        };

        /**
         * 代表地点の緯度経度とマッチング (region Point使用)
         * @param  latLng 比較対象の緯度経度
         */
        RegionMapPageManager.prototype.matchRepresentativePoint_regionpoint = function (latLng) {
            var _this = this;

            //代表地点とマッチング
            var matchingData = new Array();
            var responseData = new Array();
            //代表地点の件数分ループ
            for (var i = 0; i < _this.mapLayers.length; i++) {
                var delegatePoint = new Array();
                for(var t = 0; t < _this.mapLayers[i].layer.feature.geometry.coordinates.length; t++) {
                    for(var z = 0; z < _this.mapLayers[i].layer.feature.geometry.coordinates[t].length; z++) {
                        if (_this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length <= 2) {
                            delegatePoint.push({
                                "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][1],
                                "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][0],
                            });
                        } else {
                            for(var y = 0; y < _this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length; y++) {
                                delegatePoint.push({
                                    "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][1],
                                    "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][0],
                                });
                            }
                        }
                    }
                }

                var regionPoint = _this.getNearestRegionPoint(delegatePoint, latLng);
                //代表地点との直線距離を算出
                matchingData.push({
                    "regionID": _this.mapLayers[i].regionID,
                    "latitude": regionPoint.latitude,
                    "longitude": regionPoint.longitude,
                    "distance": regionPoint.distance,
                    "avedistance": regionPoint.avedistance
                });

            }

            //検索結果レコードに対し、代表地点との距離順にソート（昇順）
            matchingData.sort(function (a, b) {
                if (a.distance < b.distance) return -1;
                if (a.distance > b.distance) return 1;
                return 0;
            });

            if ( matchingData[0].distance == matchingData[1].distance ){
                if (matchingData[0].avedistance <= matchingData[1].avedistance) {
                    responseData = {
                        "regionID": matchingData[0].regionID,
                        "latitude": matchingData[0].latitude,
                        "longitude": matchingData[0].longitude,
                        "distance": matchingData[0].distance,
                        "avedistance": matchingData[0].avedistance
                    }
                } else {
                    responseData = {
                        "regionID": matchingData[1].regionID,
                        "latitude": matchingData[1].latitude,
                        "longitude": matchingData[1].longitude,
                        "distance": matchingData[1].distance,
                        "avedistance": matchingData[1].avedistance
                    }
                }
            } else {
                responseData = {
                    "regionID": matchingData[0].regionID,
                    "latitude": matchingData[0].latitude,
                    "longitude": matchingData[0].longitude,
                    "distance": matchingData[0].distance,
                    "avedistance": matchingData[0].avedistance
                }
            }

            return responseData;
        };

        /**
         * 代表地点の全ての緯度経度を取得
         */
        RegionMapPageManager.prototype.allGetPoint = function (currentregionID, destinationregionID) {
            var _this = this;

            var delegatePoint = new Array();
            //代表地点の件数分ループ
            for (var i = 0; i < _this.mapLayers.length; i++) {
                for(var t = 0; t < _this.mapLayers[i].layer.feature.geometry.coordinates.length; t++) {
                    if ((currentregionID != _this.mapLayers[i].regionID) && (destinationregionID != _this.mapLayers[i].regionID)) {
                        for(var z = 0; z < _this.mapLayers[i].layer.feature.geometry.coordinates[t].length; z++) {
                            if (_this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length <= 2) {
                                delegatePoint.push({
                                    "regionID": _this.mapLayers[i].regionID,
                                    "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][1],
                                    "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][0],
                                });
                            } else {
                                for(var y = 0; y < _this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length; y++) {
                                    delegatePoint.push({
                                        "regionID": _this.mapLayers[i].regionID,
                                        "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][1],
                                        "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][0],
                                    });
                                }
                            }
                        }
                     }
                }
            };

            return delegatePoint;
        };

        /**
         * 代表地点の緯度経度とマッチング
         * @param  latLng 比較対象の緯度経度
         */
        RegionMapPageManager.prototype.matchRepresentativePoint = function (latLng) {
            var _this = this;

            //代表地点とマッチング
            var matchingData = new Array();
            //代表地点の件数分ループ
            for (var i = 0; i < _this.mapLayers.length; i++) {
                var delegatePoint = new Array();
                for(var t = 0; t < _this.mapLayers[i].layer.feature.geometry.coordinates.length; t++) {
                    for(var z = 0; z < _this.mapLayers[i].layer.feature.geometry.coordinates[t].length; z++) {
                        if (_this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length <= 2) {
                            delegatePoint.push({
                                "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][1],
                                "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][0],
                            });
                        } else {
                            for(var y = 0; y < _this.mapLayers[i].layer.feature.geometry.coordinates[t][z].length; y++) {
                                delegatePoint.push({
                                    "latitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][1],
                                    "longitude": _this.mapLayers[i].layer.feature.geometry.coordinates[t][z][y][0],
                                });
                            }
                        }
                    }
                }

                var regionPoint = _this.getNearestRegionPoint(delegatePoint, latLng);
                //代表地点との直線距離を算出
                matchingData.push({
                    "regionID": _this.mapLayers[i].regionID,
                    "latitude": regionPoint.latitude,
                    "longitude": regionPoint.longitude,
                    "distance": regionPoint.distance
                });
//                delegatePoint = [];
            };

            //検索結果レコードに対し、代表地点との距離順にソート（昇順）
            matchingData.sort(function (a, b) {
                if (a.distance < b.distance) return -1;
                if (a.distance > b.distance) return 1;
                return 0;
            });

            return matchingData;
        };

        /**
         * 代表地点群のうち、比較対象地点に最も近い位置の緯度経度、距離を取得する
         * @param  regionPoints  代表地点群
         * @param  latLng 比較対象地点の緯度経度
         */
        RegionMapPageManager.prototype.getNearestRegionPoint = function (regionPoints, latLng) {

            var matchingRegionPoints = new Array();
            var regionPoint = new Array();
            var latitude = 0;
            var longitude = 0;
            var sumdistance = 0;
            var avedistance = 0;
            //代表地点群の件数分ループ
            for (var regionPointsIndex = 0; regionPointsIndex < regionPoints.length; regionPointsIndex++ ){
                if (regionPoints[regionPointsIndex].latitude != undefined) {
                    latitude = regionPoints[regionPointsIndex].latitude;
                    longitude = regionPoints[regionPointsIndex].longitude;
                } else {
                    latitude = regionPoints[regionPointsIndex][1];
                    longitude = regionPoints[regionPointsIndex][0];
                }
                matchingRegionPoints.push({
                                          "index": regionPointsIndex,
                                          "distance": latLng.distanceTo(L.latLng(latitude,longitude))
                                          });
            };


            //代表地点群との距離順にソート（昇順）
            matchingRegionPoints.sort(function (a, b) {
                                      if (a.distance < b.distance) return -1;
                                      if (a.distance > b.distance) return 1;
                                      return 0;
                                      });

            var nearPointIndex = matchingRegionPoints[0].index　//目的地に最も近い代表地点を取得
            var distance = matchingRegionPoints[0].distance;

            var i = 0;
            for (; i<10; i++) {
                if (matchingRegionPoints.length <= i) {
                    break;
                }
                sumdistance = sumdistance + matchingRegionPoints[i].distance;
            }

            avedistance = sumdistance / i;

            if (regionPoints[nearPointIndex].latitude != undefined) {
                latitude = regionPoints[nearPointIndex].latitude;
                longitude = regionPoints[nearPointIndex].longitude;
            } else {
                latitude = regionPoints[nearPointIndex][1];
                longitude = regionPoints[nearPointIndex][0];
            }

            var regionPoint = {
                "latitude": latitude,
                "longitude": longitude,
                "distance": distance,
                "avedistance": avedistance
             };

            return regionPoint
        };

        /**
         * 地図およびリストの選択状態を切り替え
         * @param regionID 
         * @return true:選択状態を設定　/ false:未選択状態を設定
         */
        RegionMapPageManager.prototype.switchRegionsList = function (regionID) {
            var _this = this;
            if (_this.checkAddableRegionList(regionID)) { // リストに追加した
                _this.addRegionsList(regionID);
                return true;
                
            } else {  // 既にリストに追加されている
                 return _this.updateRegionsList(regionID);
               
            }
        };

        /**
         * リスト追加処理
         * @param {*} regionID
         */
        RegionMapPageManager.prototype.addRegionsList = function (regionID) {
            var _this = this;
            var key = this.getTargetDataKey(regionID);
            var $row = this.getUpdateDataRow(key); 

            // 表示順変更のため、一旦一覧から削除
            if ($row != undefined || $row != null) {
                //一覧から削除
                _this.removeRegionsList(regionID, $row);
            }
            // リストに追加
            _this.addSelectedRegion(regionID);
            // リスト表示追加
            _this.addShowSelectedRegion(regionID);
            // 地図の色変更
            _this.setGeojsonRegionColor(regionID, _this.mapColor.selected);

            //リスト最上部へスクロール
            _this.$updateList.find("ul.harman-ota-upd-region-list").scrollTop(0);

        };

        /**
         * リスト選択状況を変更
         * @param  regionID 
         * @return true:選択状態を設定　/ false:未選択状態を設定
         */
        RegionMapPageManager.prototype.updateRegionsList = function (regionID) {
            var _this = this;
            //現在の選択状態から、変更後の選択状態を設定
            var key = this.getTargetDataKey(regionID);
            var $row = this.getUpdateDataRow(key); 
            //取得できない場合は色変更状態を設定
            var isSelected = ($row == undefined || $row == null) ? true :!UI.RegionList.getButtonStatus($row);

            // 地図の色変更
            if (isSelected) {
                //未選択　→ 選択に変更
                if ($row != undefined || $row != null) {
                    //一覧から削除
                    _this.removeRegionsList(regionID, $row);
                    //一覧に追加
                    _this.selectMapRegion(regionID);
                }
                
            } else {
                // 選択　→ 未選択に変更
                // チェックボックス更新、選択中データ削除
                _this.setListChecked(regionID, isSelected);
                var itemInfo = UI.RegionList.getItemInfo($row);
                if (itemInfo.category == "notdownload") {
                    UI.RegionList.getItemIconRight($row).attr("src", UI.RegionList.ICON_INFO.PATH[UI.MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD]);
                }
            }

            return isSelected;
        };


        /**
         * 一覧から対象行を削除
         * @param 選択行
         * @param regionID
         */
        RegionMapPageManager.prototype.removeRegionsList = function (regionID, $row) {
            var _this = this;

            // 対象行を削除
            _this.removeSelectedRegion(regionID);

            //旧属性
            var rowCategory = $row.attr("category");

            // 画面上リスト削除処理
            UI.RegionList.removeItem($row);

            //↓ラベル削除
            if(rowCategory){//↓ラベル削除
                if(this.$updateList.find("[category='"+rowCategory+"']").length <= 1){
                    this.$updateList.find("[category='"+rowCategory+"']").remove();
                    switch (rowCategory) {

                    case this.CategoryIds[MobileOtaGen4.MAP_DATA_CATEGORY.NOT_DOWNLOAD]:
                        delete this.$categoryItems[MobileOtaGen4.MAP_DATA_CATEGORY.NOT_DOWNLOAD];
                        break;

                    case this.CategoryIds[MobileOtaGen4.MAP_DATA_CATEGORY.NOT_UPDATE]:
                        delete this.$categoryItems[MobileOtaGen4.MAP_DATA_CATEGORY.NOT_UPDATE];
                        break;

                    case this.CategoryIds[MobileOtaGen4.MAP_DATA_CATEGORY.UPDATED]:
                        delete this.$categoryItems[MobileOtaGen4.MAP_DATA_CATEGORY.UPDATED];
                        break;

                    }
                }
            }

            // 地図の色変更
            _this.setGeojsonRegionColor(regionID, _this.mapColor.notSelect);

             //行データ一覧から削除                
             for (var i = 0; i < this.updateDataRows.length; i++) {
                var key = this.updateDataRows[i].key;
                if (key.regionID == regionID) {
                     // 一致するregionを削除
                     this.updateDataRows.splice(i, 1);
                     HarmanOTA.AnalyseAhaConnectSDKResponse.removeUpdateListData(this.updateDatas, key);
                     break;
                 }
             };
        };

        /**
         * 未選択のregionを一覧から削除する
         */
        RegionMapPageManager.prototype.removeUnselectedRegionsList = function () {
            var dataRowLength = this.updateDataRows.length;
            // 未選択の行は一覧から削除
            for (var dataRowIndex = 0; dataRowIndex < dataRowLength; dataRowIndex++) {
                var regionID = this.updateDataRows[dataRowIndex].key.regionID;
                var $row = this.updateDataRows[dataRowIndex].row;
                var isChecked = ($row == undefined || $row == null)? true: UI.RegionList.getButtonStatus($row);

                if (!isChecked) {
                    //データ削除処理
                    this.removeRegionsList(regionID, $row);
                    // 要素を削除したので、ループ条件補正する
                    dataRowIndex--;
                    dataRowLength--;
                }
            }
        };

        /**
         * updateDataRowsに存在するかチェック
         * @param {*} regionID 
         * @return true:存在する / false:存在しない
         */
        RegionMapPageManager.prototype.checkUpdateDataRows = function (regionID) {
            
            //行データ一覧から削除                
            for (var i = 0; i < this.updateDataRows.length; i++) {
                if (this.updateDataRows[i].key.regionID == regionID) {
                     return true;
                 }
             };

             return false;
        }

        /**
          * RegionIDに紐づくレイヤを取得（全region）
          * @param regionID　リージョンID
          * @returns レイヤ
          */
        RegionMapPageManager.prototype.getLayer = function (regionID) {
            var layers = [];
            for (var i = 0; i < this.mapLayers.length; i++) {
                if (this.mapLayers[i].regionID == regionID) {
                    layers.push(this.mapLayers[i].layer);
                }
            };
            return layers;
        };

        /**
          * Regionリスト表示
          */
        RegionMapPageManager.prototype.showSelectedRegion = function () {

            // 地域選択状態に合わせてチェックボックスをON/OFFする
            var selectedRegion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region;
            for (var i = 0; i < selectedRegion.length; i++) {
                var regionID = selectedRegion[i].id;

                var update = this.getUpdateDatas(regionID, undefined);
                var version = "-";
                var size = "-";

                var $row = this.getUpdateDataRow(update.key); 
                var isOn = ($row == undefined || $row == null) ? false : UI.RegionList.getButtonStatus($row);
                UI.CheckBox.setButtonStatus($row, isOn);

                switch (this.getUpdateDatasCategory(regionID)) {
                    case MobileOtaGen4.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        version = undefined;
                        size = update.size;
                        break;

                    case MobileOtaGen4.MAP_DATA_CATEGORY.NOT_UPDATE:
                        version = undefined;
                        size = update.size;
                        break;

                    case MobileOtaGen4.MAP_DATA_CATEGORY.UPDATED:
                        version = undefined;
                        size = undefined;
                        break;

                    default:
                        break;
                };

                this.updateItemList($row, version, size);
            }

            // 画面状態の更新
            this.refreshPageState();
        };

        /**
          * Regionリスト表示の追加
          * @param regionID　リージョンID
          */
        RegionMapPageManager.prototype.addShowSelectedRegion = function (regionID) {
            // リストレイアウト
            this.listLayout();
            // 一覧データ表示に追加
            this.addDataList(regionID);

            // チェックボックスをON/OFFする
            var key = this.getTargetDataKey(regionID);
            var $row = this.getUpdateDataRow(key); 
            UI.CheckBox.setButtonStatus($row, true);
            
            // 地域リストのバージョン、サイズを初期化する
            this.initItemList($row);
            
            // 画面状態の更新
            this.refreshPageState();
        };

        /**
         * 地域リストのバージョン、サイズを初期化する
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         */
        RegionMapPageManager.prototype.initItemList = function ($item) {
            // データ行内のトグルボタンを表示
            UI.RegionList.setShowButton($item, true);

            // Region名表示
            $title = UI.RegionList.getItemTitleCss($item);
            $title.css("visibility", "visible");

            UI.RegionList.setItemVersion($item, {
                "label": this.texts.version,
                "value": "-",
            });
            UI.RegionList.setItemSize($item, {
                "label": this.texts.size,
                "value": "-",
            });
        };

        /**
         * チェックボックスのOn/OFFに合わせて地図の色を変更する
         */
        RegionMapPageManager.prototype.updateRegionColor = function (regionID, isOn) {
            var selectedRegion = this.selectedMapDetails.data[0].mapJson.nds_product[0].nds_region;
            var key = this.getTargetDataKey(regionID);

            for (var i = 0; i < selectedRegion.length; i++) {
                if (isOn) {
                    var color = this.getGeojsonRegionColor(regionID);
                    if ( this.updateDatas != undefined && this.updateDatas != null ) {
                        var targetData = HarmanOTA.AnalyseAhaConnectSDKResponse.findUpdateListData(this.updateDatas, key);
                        for (t = 0; t < this.updateDatas.length; t++) {
                            for (j = 0; j < this.updateDatas[t].length; j++) {
                                if (this.updateDatas[t][j].key.regionID == targetData.key.regionID) {
                                    switch (t) {
                                        // 未選択
                                        case 0:
                                            color = this.mapColor.selected;
                                            break;
                                        // Update available
                                        case 1:
                                            color = this.mapColor.notDownload;
                                            break;
                                        // Downloaded in mobile
                                        case 2:
                                            color = this.mapColor.notUpdate;
                                            break;
                                        // Updated
                                        case 3:
                                            color = this.mapColor.updated;
                                            break;
                                        default:
                                            color = this.mapColor.selected;
                                            break;
                                    }
                                    this.setGeojsonRegionColor(regionID, color);
                                    break;
                                }
                            }
                        }
                    } else {
                        var color = this.getGeojsonRegionColor(regionID);
                        if (color != undefined) {
                            // 既に未選択以外の色が設定されている場合は色の変更は行わない
                            if (color == this.mapColor.notSelect) {
                                this.setGeojsonRegionColor(regionID, this.mapColor.selected);
                            }
                        }
                    }
                } else {
                    // 未選択状態の色を設定
                    this.setGeojsonRegionColor(regionID, this.mapColor.notSelect);
                }
            }
        };

        /**
         * 更新データ一覧を更新（再生成）
         */
        RegionMapPageManager.prototype.updateDataList = function () {
            _super.prototype.updateDataList.call(this);
            //画面に合わせてリストの高さを設定
            //画面の高さ - (headerの高さ+検索ボックスの高さ＋地図の高さ＋ストレージバーの高さ＋画面下部ボタンの高さ + 画面ずれ防止の遊び) を算出
            var listHeight = $(window).height() - ($("div:jqmData(role='header')").height() + $(RegionPageManager.TAG_KEY_SEARCH).height() + this.mapHeight + $(RegionMapPageManager.STORAGE_BAR).height() + $(RegionMapPageManager.BUTTON_ALLDOWNLOAD).height() + 30); 
            $("ul.harman-ota-upd-region-list").attr("style", "height:" + listHeight + "px !important;");
        };

        /**
         * 更新データ一覧への追加　※選択ボックスのイベントはRegionPageManager_updateDataListにて記述
         * @param regionID　リージョンID
         */
        RegionMapPageManager.prototype.addDataList = function (regionID) {
            var _this = this;

            for (var key in this.updateDatas) {
                // カテゴリ別設定
                var isShowFromVersion = false;
                var isShowSize = false;
                var isDownloadProgress = false;
                var iconType = UI.MAP_DATA_ICON_TYPE.HIDDEN;
                switch (+key) {
                    case MobileOtaGen4.MAP_DATA_CATEGORY.NOT_DOWNLOAD:
                        isShowFromVersion = false;
                        isShowSize = true;
                        isDownloadProgress = true;
                        break;
                    default:
                        break;
                }
                // 行生成
                for (var i = 0; i < this.updateDatas[key].length; i++) {
                    var data = this.updateDatas[key][i];
                    if (data.key.regionID != regionID) {
                        continue;
                    }
                    var $row = UI.RegionList.addItem(this.$updateList, this.CategoryIds[key], true);
                    // プログレス表示判断
                    var isShowProgress = false;
                    if (isDownloadProgress) {
                        isShowProgress = this.judgeShowDownloadProgress(data.downloadStatus);
                    }
                    UI.RegionList.setItemInfo($row, {
                        "title": {
                            "label": this.texts.map,
                            "value": data.name
                        },
                        "version": {
                            "label": "this.texts.version",
                            "value": "-"
                        },
                        "size": {
                            "label": "this.texts.size",
                            "value": "-"
                        },
                        "icon": iconType,
                        "progress": 0,
                        "showprogress": isShowProgress,
                        "regionID" : data.key.regionID,
                        "rtl": this.isEnabledRtl,
                        //"index": i,
                    });

                    // データ行内のトグルボタンを非表示
                    UI.RegionList.setShowButton($row, false);

                    // title非表示
                    $title = UI.RegionList.getItemTitleCss($row);
                    $title.css("visibility", "hidden");



                    //イベントを設定
                    _this.setListTapEvent($row, data);
                    
                    this.updateDataRows.push({
                        "key": data.key,
                        "row": $row,
                        "isDownloaded": false
                    });

                    return;
                }
            }
        };

        /**
         * 地域の色を変更するコールバック
         * @param regionID　リージョンID
         * @param color 色
         */
        RegionMapPageManager.prototype.updateRegionColorCallback = function (regionID, color) {
            this.setGeojsonRegionColor(regionID, color);
        };

        /**
          * regionIDに紐づく地図の色を設定する
          * @param regionID　リージョンID
          */
        RegionMapPageManager.prototype.setGeojsonRegionColor = function (regionID, color) {
            var layer = this.getLayer(regionID); //全regionから取得に変更
            if (layer == undefined) {
                return;
            }

            for (var i = 0; i < layer.length; i++) {
                layer[i].feature.properties.density = color;
                this.geojson.resetStyle(layer[i]);
            };
        };

        /**
         * regionIDに紐づく地図の色を取得する
         * @param regionID　リージョンID
         * @returns regionIDに紐づく地図の色
         */
        RegionMapPageManager.prototype.getGeojsonRegionColor = function (regionID) {
            var layer = this.getLayer(regionID); //全regionから取得に変更
            if (layer == undefined) {
                return null;
            }

            return layer[0].feature.properties.density;
        };

        /**
         * 検索ボックス入力完了処理
         */
        RegionMapPageManager.prototype.enterSearchBox = function () {
            var _this = this;

            //検索ボックスクリア処理
            _this.initSelectRegionList();
            //目的地情報削除
            _this.deleteDestinationInfo();

            //検索ボックスが空欄の場合は処理を抜ける
            if (_this.$searchBox[0].value.trim() == "") {
                return;
            }

            //ハッチング 解除
            _this.setOverlay_SearchBox(false);

            //ローディング処理
            _this.setLoading(true);
            
            //検索処理
            _this.sendAsyncRequestOSM(_this.$searchBox[0].value).then(function () {
                //ローディング処理
                _this.setLoading(false);

                //検索結果が０件の場合
                if (_this.searchResult == undefined || _this.searchResult.length == 0) {
                    //ポップアップ表示
                    _this.createModalDialogOkButton(_this.texts.noDataFromNominatim, function () {
                        //ポップアップを閉じる
                        _this.closeModalDialog();
                        //検索ボックス以外ハッチング状態に設定
                        _this.setOverlay_SearchBox(true);
                    });

                } else {
                    //集約処理
                    var listData = _this.integrateSearchResult(_this.searchResult);

                    if (listData.length == 1) {
                        //検索結果が１件の場合
                        _this.showAutoRegionsSettingList(listData[0].regionID, L.latLng(listData[0].latitude, listData[0].longitude));

                    } else {
                        //リスト表示
                        _this.searchDataList(listData);
                        //他のコントロールを非表示状態とする
                        _this.switchSearchListVisible(true);
                    }
                }
            }, function () {
                //エラー発生時
                 //ローディング処理
                 _this.setLoading(false);
                  // ダイアログ表示
                  this.createModalDialogOkButton(this.texts.notifynetworkerror, function () {
                     //モーダルクローズ
                     _this.closeModalDialog();
                 });
            });

        };

        /**
         * OpenStreetMapを利用した曖昧検索
         */
        RegionMapPageManager.prototype.sendAsyncRequestOSM = function (value) {

            var _this = this;
            var searchURL = 'https://nominatim.openstreetmap.org/search';
            var deferred = jQuery.Deferred();
            var temp_countryCode = null;

            if ( (countryCode == "US") | (countryCode == "MX") | (countryCode == "CA") ) {
                temp_countryCode = countryCode
            }

            $.ajax({
                url: searchURL,
                type: 'GET',
                dataType: "json",
                async: true,
                data: {
                    "format": "json",
                    "polygon": "0",
                    "addressdetails": "1",
                    "countrycodes": temp_countryCode,
                    "limit": "2",
                    "q": value                //URIEncode必要？
                }
            })
                // Ajaxリクエストが成功した時発動
                .done(function (data) {
                    console.log(data);

                    _this.searchResult = data;
                    deferred.resolveWith(this);
                })
                // Ajaxリクエストが失敗した時発動
                .fail(function (data) {
                    //エラー時
                    console.log(data);
                    deferred.rejectWith(_this);
                    return;
                });

            return deferred.promise();
        };

        /**
         * 検索結果の集約
         * @param  data 検索結果json
         * @returns returnData 集約後索引結果（regionID 昇順）
         */
        RegionMapPageManager.prototype.integrateSearchResult = function (data) {
            var nearRegion = new Array();
            var returnData = new Array();

            //代表地点とマッチング
            for (var i = 0; i < data.length; i++) {
                var location = L.latLng(parseFloat(data[i].lat), parseFloat(data[i].lon));

                //regionIDの重複をなくす
                var matchingData = this.matchRepresentativePoint(location).filter(function(v1,i1,a1){ 
                    return (a1.findIndex(function(v2){ 
                      return (v1.regionID===v2.regionID) 
                    }) === i1);
                  });

                //距離が近い順に上位３レコードを追加
                for (var j = 0; j < 3; j++) {
                    nearRegion.push({
                        "regionID": matchingData[j].regionID,
                        "latitude": matchingData[j].latitude,
                        "longitude": matchingData[j].longitude,
                        "displayName": data[i].display_name,
                        "distance": matchingData[j].distance
                    });
                };

            };

            //region単位に表示するため、検索結果をregionID、距離順にソート（昇順）
            nearRegion.sort(function (a, b) {
                if (a.regionID < b.regionID) return -1;
                if (a.regionID > b.regionID) return 1;
                if (a.distance < b.distance) return -1;
                if (a.distance > b.distance) return 1;
                return 0;
            });

            //データ整形
            var regionID;
            var index = 0;
            var spots = new Array();
            for (var i = 0; i < nearRegion.length; i++) {

                if (regionID == undefined || (regionID != nearRegion[i].regionID)) {
                    //前regionでスポット名が存在する場合は追加を行う
                    if (spots.length > 0) {
                        //配列のマージ
                        Array.prototype.push.apply(returnData[index].spots, spots);

                        index++;            //カウントアップ
                        spots.length = 0;   //配列初期化
                    }

                    //regionデータの追加
                    returnData.push({
                        "regionID": nearRegion[i].regionID,
                        "displayName": this.getMapDetailsRegionData(nearRegion[i].regionID).name,     //getCurrentMapDetailsの値を表示
                        "latitude": nearRegion[i].latitude,
                        "longitude": nearRegion[i].longitude,
                        "spots": []
                    });

                    //spotを追加
                    spots.push({
                        "regionID": nearRegion[i].regionID,
                        "displayName": nearRegion[i].displayName,
                        "latitude": nearRegion[i].latitude,
                        "longitude": nearRegion[i].longitude
                    });

                } else {
                    //spotを追加
                    spots.push({
                        "regionID": nearRegion[i].regionID,
                        "displayName": nearRegion[i].displayName,
                        "latitude": nearRegion[i].latitude,
                        "longitude": nearRegion[i].longitude
                    });
                }

                //regionIDを退避
                regionID = nearRegion[i].regionID;
            };

            //最後のregionに対しspot配列のマージを行う
            if (spots.length > 0) {
                //配列のマージ
                Array.prototype.push.apply(returnData[returnData.length - 1].spots, spots);
            }

            return returnData;
        };

        /**
         * 検索結果一覧の表示
         */
        RegionMapPageManager.prototype.searchDataList = function (data) {

            // クリア
            this.$searchList = $(RegionMapPageManager.SEARCH_LIST);
            this.$searchList.empty();

            //検索結果一覧UIを生成
            UI.SearchList.create(this.$searchList);

            for (var key in data) {
                var region = data[key];
                var regionID = region.regionID;
                var spots = region.spots;

                //現在位置と同じregionIDは対象外とする
//                if (regionID != this.current[RegionMapPageManager.KEY_REGIONID]) {

                    var $rowRegion = UI.SearchList.addItemRegion(this.$searchList);
                    //州名を設定
                    UI.SearchList.setItemInfo($rowRegion, {
                        "regionID": region.regionID,
                        "displayName": region.displayName,
                        "latitude": region.latitude,
                        "longitude": region.longitude
                    });

//                    //スポット名を設定
//                    for (var i = 0; i < spots.length; i++) {
//                        var $rowSpot = UI.SearchList.addItemSpot(this.$searchList);
//                        UI.SearchList.setItemInfo($rowSpot, {
//                            "regionID": region.regionID,
//                            "displayName": spots[i].displayName,
//                            "latitude": region.latitude,
//                            "longitude": region.longitude
//                        });
//                    };
//                }
            };

        };

        /**
         * 検索結果一覧の表示に合わせて画面上コントロールの表示を制御
         * @param {*} isShow true:表示する / false:表示しない
         */
        RegionMapPageManager.prototype.switchSearchListVisible = function (isShow) {

            if (isShow) {
                $(RegionMapPageManager.MAP).css("visibility", "hidden");
                $(RegionMapPageManager.STORAGE_BAR).css("visibility", "hidden");
                $(RegionMapPageManager.UPDATE_LIST).css("visibility", "hidden");
                $(RegionMapPageManager.AUTO_REGIONS_SETTING_LIST).css("visibility", "hidden");
                $(RegionMapPageManager.BUTTON_ALLDOWNLOAD).css("visibility", "hidden");

            } else {
                $(RegionMapPageManager.MAP).css("visibility", "visible");
                $(RegionMapPageManager.STORAGE_BAR).css("visibility", "visible");
                $(RegionMapPageManager.UPDATE_LIST).css("visibility", "visible");
                $(RegionMapPageManager.AUTO_REGIONS_SETTING_LIST).css("visibility", "visible");
                $(RegionMapPageManager.BUTTON_ALLDOWNLOAD).css("visibility", "visible");
            }
        };

        /**
        * 自動地域設定一覧表示
        * @param regionID リストから選択した目的地のRegionID
        * @param latLng 目的地の緯度経度（L.latLng(latitude,longitude) 形式）
        */
        RegionMapPageManager.prototype.showAutoRegionsSettingList = function (regionID, latLng) {

            var _this = this;

            //地図使用フラグをfalseに設定
            _this.mapEnable = false;

            // 検索結果地域クリア
            this.$searchList = $(RegionMapPageManager.SEARCH_LIST);
            this.$searchList.empty();
            //リスト非表示
            UI.SearchList.removeClass(this.$searchList);
            //他のコントロール表示状態とする
            _this.switchSearchListVisible(false);

            // 選択地域リストを非表示に設定
            $(RegionMapPageManager.UPDATE_LIST).css("display", "none");

            // 自動地域設定用リスト作成
            // クリア
            this.$autoRegionsSettingList = $(RegionMapPageManager.AUTO_REGIONS_SETTING_LIST);
            this.$autoRegionsSettingList.empty();
            //検索結果一覧UIを生成
            UI.AutoRegionsSettingList.create(this.$autoRegionsSettingList);

            ///////////////////////////
            //初期化
            _this.destination = null;
            _this.destination = new Object();

            //目的地情報設定
            var regionPoint = _this.getNearestRegionPoint(_this.getLayer(regionID)[0].feature.properties.region_points, latLng);
            _this.destination[RegionMapPageManager.KEY_REGIONID] = regionID;    //regionID
            _this.destination[RegionMapPageManager.KEY_REGIONNAME] = _this.getMapDetailsRegionData(regionID).name;  //regionName (getCurrentMapDetailsより取得)
            _this.destination[RegionMapPageManager.KEY_LATLNG] = L.latLng(_this.getLayer(regionID)[0].feature.properties.region_points[0].latitude, _this.getLayer(regionID)[0].feature.properties.region_points[0].longitude); //latLng

            //現在位置の設定
            var $rowCurrent = UI.AutoRegionsSettingList.addItemCurrent(this.$autoRegionsSettingList);
            UI.AutoRegionsSettingList.setItemInfo($rowCurrent, {
                "regionID": _this.current[RegionMapPageManager.KEY_REGIONID],
                "displayName": _this.current[RegionMapPageManager.KEY_REGIONNAME]
            });

            UI.AutoRegionsSettingList.addItemRoute(this.$autoRegionsSettingList);

            //目的地の設定
            var $rowCurrent = UI.AutoRegionsSettingList.addItemDestination(this.$autoRegionsSettingList);
            UI.AutoRegionsSettingList.setItemInfo($rowCurrent, {
                "regionID": _this.destination[RegionMapPageManager.KEY_REGIONID],
                "displayName": _this.destination[RegionMapPageManager.KEY_REGIONNAME]
            });

            //////////////////////////
            //検索結果地域を選択
            //現在位置
            this.setGeojsonRegionColor(_this.current[RegionMapPageManager.KEY_REGIONID], this.mapColor.selected);
            //目的地
            this.setGeojsonRegionColor(regionID, this.mapColor.selected);
            //マーカー配置
            var destinationIcon = L.icon({
                iconUrl: UI.AutoRegionsSettingList.ROW_ICON_DEST_PATH,
                iconRetinaUrl: UI.AutoRegionsSettingList.ROW_ICON_DEST_PATH,
                iconSize: [25, 33.1],
                iconAnchor: [12, 33.1] //オフセットの位置
            });

            _this.marker_destination = new L.marker(_this.destination[RegionMapPageManager.KEY_LATLNG], { icon: destinationIcon });
            map.addLayer(_this.marker_destination);

            // ズームを初期値に設定
            var centerPoint = _this.osmCenterPosition[geoJsonCode]; //中心位置の座標,zoom尺度
            map.setView(centerPoint.latLng, centerPoint.zoom);

            // OKボタンに更新
            _this.updateButton(_this.buttonType.ok);
            //ボタンのハッチング を解除
            UI.PageBottomButton.setEnabled(_this.$downloadButton, true);

        };

        /**
         * 自動地域設定結果表示
         */
        RegionMapPageManager.prototype.showResultAutoRegionsSetting = function () {

            var _this = this;

            //クリア処理
            this.$autoRegionsSettingList = $(RegionMapPageManager.AUTO_REGIONS_SETTING_LIST);
            this.$autoRegionsSettingList.empty();

            // 選択地域リストを非表示に設定
            $(RegionMapPageManager.UPDATE_LIST).css("display", "block");

            //自動地域選択処理
            this.autoRegionsSetting();
            // 選択地域リスト更新
            this.showSelectedRegion();

            // checkForUpdateボタンに更新
            this.updateButton(this.buttonType.checkForUpdate);
            //地図使用フラグをtrueに設定
            _this.mapEnable = true;

        };

        /**
         * 自動地域設定処理
         */
        RegionMapPageManager.prototype.autoRegionsSetting = function () {
            var _this = this;
            var par = new Array(0.1, 0.2, 0.3, 0.4, 0.5);       //閾値算出用
            var threshold = 0;      //閾値
            var distance = 0;
            var autoSelectRegions = new Array();
            
            var latLng_current = _this.current[RegionMapPageManager.KEY_LATLNG];
            var latLng_destination = _this.destination[RegionMapPageManager.KEY_LATLNG];
             
            //現在地〜目的地の距離を算出 (in meters)
            distance = latLng_current.distanceTo(latLng_destination);

            //各州の全地点を取得
            var regionPoints = _this.allGetPoint(_this.current.regionID,_this.destination.regionID);

            // /現在地〜目的地の距離の10%を閾値として設定する。
            // １件もregion選択ができなかった場合、10%単位で閾値を増加させる（最大：直線距離の50%）
            for (var i = 0; i < par.length; i++) {
                //閾値の算出(in meters)
                threshold = Math.ceil(distance * par[i]);  //切り上げ
                console.log("閾値：直線距離の" + par[i] * 100 + "％（" + threshold + "）");

                //全regionぶんループ
                for (var j = 0; j < regionPoints.length; j++) {
                    var location = L.latLng(regionPoints[j].latitude, regionPoints[j].longitude);

                    //現在地〜対象地域の距離を算出
                    var currentToLocation = latLng_current.distanceTo(location);
                    //対象地域〜目的地の距離を算出
                    var locationToDestination = location.distanceTo(latLng_destination);

                    //対象地域＝現在地または目的地の場合は次のループへ
                    if (currentToLocation == 0 || locationToDestination == 0) {
                        console.log(regionPoints[j].regionID + "：　現在地、もしくは目的地のため対象外");
                        continue;
                    }


                    //対象地域の選定
                    if ((currentToLocation + locationToDestination) == distance) {
                        //現在地から目的地の直線上にregionが存在する場合
                        autoSelectRegions.push(regionPoints[j].regionID);
                        console.log(regionPoints[j].regionID + "：　対象（現在地から目的地の直線上にregionが存在）");
                        continue;
                    }

                    //現在地、目的地、代表地点を頂点とする三角形を生成
                    //代表地点から対辺の垂線の長さを算出（辺の垂線定理）
                    var a = distance;   //現在地〜目的地
                    var b = currentToLocation;  //現在地〜対象地域
                    var c = locationToDestination;  //対象地域〜目的地
                    var s = (a + b + c) / 2;  //半周長
                    var perpendicularLine = (2 * Math.sqrt(s * (s - a) * (s - b) * (s - c))) / a;    //垂線

                    //余弦定理を用いて現在地,目的地を含む角のコサインを求め、いずれかが鈍角の場合は次のループへ
                    var cosC = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);    //対象地域〜目的地の対角
                    var cosB = (Math.pow(c, 2) + Math.pow(a, 2) - Math.pow(b, 2)) / (2 * c * a);    //対象地域〜現在位置の対角
                    //対象地域〜目的地の対角が鈍角（目的地から見て対象地域が現在位置より遠い）場合
                    //または、対象地域〜現在位置の対角が鈍角（現在位置から見て対象地域が目的地より遠い）場合は対象外
                    if (cosC < 0　|| cosB < 0) {
                        console.log(regionPoints[j].regionID + "：　対象外（現在地もしくは目的地より遠い対象地点）");
                        continue;
                    }

                    //現在地〜目的地間に存在する場合
                    if (perpendicularLine <= threshold) {
                        console.log(regionPoints[j].regionID + "：　対象（" + perpendicularLine + "）");
                        autoSelectRegions.push(regionPoints[j].regionID);
                        continue;
                    };
                };

                //対象地域が1件でも存在する場合、処理を抜ける
                if (autoSelectRegions.length != 0) {
                    console.log("閾値" + par[i] * 100 + "％で対象地点あり（" + autoSelectRegions.length + "件）");
                    break;
                };
            };

            //現在地を追加
            autoSelectRegions.push(_this.current[RegionMapPageManager.KEY_REGIONID]);
            //目的地を追加
            autoSelectRegions.push(_this.destination[RegionMapPageManager.KEY_REGIONID]);

            //自動選択対象地域をleafletと連携
            for (var autoSelectIndex = 0; autoSelectIndex < autoSelectRegions.length; autoSelectIndex++) {
                var regionID = autoSelectRegions[autoSelectIndex];

                if (_this.checkAddableRegionList(regionID)) {   
                    //リストに追加
                    _this.addRegionsList(regionID);
                } else {
                    // チェックボックス更新
                    _this.setListChecked(regionID, true);
                }

                // 地図の色変更
                _this.setGeojsonRegionColor(regionID, _this.mapColor.selected);
            };

            // 選択状態をKVSへ保存する
            _this.addRegionIDtoKVS(autoSelectRegions, true);
            //現在位置のRegionを選択する
            _this.selectGpsRegion();
        };

        /**
         * 検索ボックス以外をオーバーレイ
         * @param overlayFlag true:オーバーレイする/false:オーバーレイしない
         */
        RegionMapPageManager.prototype.setOverlay_SearchBox = function (overlayFlag) {

            //オーバーレイ実行
            if (overlayFlag) {
                $(RegionPageManager.OVERLAY_AREA).removeClass(RegionPageManager.CSS_OVERLAY_OFF);
                $(RegionPageManager.OVERLAY_AREA).addClass(RegionPageManager.CSS_OVERLAY_ON);
                $(RegionMapPageManager.TAG_KEY_SEARCH_AREA).removeClass(RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_OFF);
                $(RegionMapPageManager.TAG_KEY_SEARCH_AREA).addClass(RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_ON);

            } else {
                // オーバーレイ解除
                $(RegionPageManager.OVERLAY_AREA).removeClass(RegionPageManager.CSS_OVERLAY_ON);
                $(RegionPageManager.OVERLAY_AREA).addClass(RegionPageManager.CSS_OVERLAY_OFF);
                $(RegionMapPageManager.TAG_KEY_SEARCH_AREA).removeClass(RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_ON);
                $(RegionMapPageManager.TAG_KEY_SEARCH_AREA).addClass(RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_OFF);
            }
        };

        /**
         * 選択一覧初期化処理
         */
        RegionMapPageManager.prototype.initSelectRegionList = function () {
            var _this = this;

            // 検索結果リストクリア
            this.$searchList = $(RegionMapPageManager.SEARCH_LIST);
            this.$searchList.empty();
            UI.SearchList.removeClass(this.$searchList); // リスト非表示
            // 地域自動設定リストクリア
            this.$autoRegionsSettingList = $(RegionMapPageManager.AUTO_REGIONS_SETTING_LIST);
            this.$autoRegionsSettingList.empty();
            //地図使用フラグをtrueに設定
            _this.mapEnable = true;
            // checkForUpdateボタンに更新
            _this.updateButton(_this.buttonType.checkForUpdate);
        };

        /**
         * 現在地情報削除
         */
        RegionMapPageManager.prototype.deleteCurrentInfo = function () {
            var _this = this;
            var key = this.getTargetDataKey(_this.current.regionID);
            var $row = this.getUpdateDataRow(key); 

            //一覧が取得できない場合は処理を抜ける
            if ($row == undefined || $row == null) {
                return;
            }

            var isChecked = ($row == undefined || $row == null) ? false : UI.RegionList.getButtonStatus($row);
            if (!isChecked) {
                _this.ahaConnectSDKSettings.readSettings(function () {
                    var regionIDList = _this.ahaConnectSDKSettings.getRegionIdList();
                    var isSelected = false; //KVSに保存されているか（ユーザーが選択しているか）
                    for (var i = 0; i < regionIDList.length; i++) {
                        if (_this.current.regionID == regionIDList[i]) {
                            isSelected = true;
                            break;
                        }
                    }
                    
                    //ユーザーによる選択がされていない場合、地図の色を変更する
                    if (!isSelected) {
                        // 地図の色変更
                        _this.setGeojsonRegionColor(_this.current.regionID, _this.mapColor.notSelect);
                    }
                });
            }
        };
        /**
         * 目的地情報削除
         */
        RegionMapPageManager.prototype.deleteDestinationInfo = function () {
            var _this = this;

            //地図上の目的地選択を解除
            if (_this.destination != undefined) {
                var key = this.getTargetDataKey(_this.destination.regionID);
                var $row = this.getUpdateDataRow(key); 
                var isChecked = ($row == undefined || $row == null) ? false : UI.RegionList.getButtonStatus($row);
                
                _this.ahaConnectSDKSettings.readSettings(function () {
                    var regionIDList = _this.ahaConnectSDKSettings.getRegionIdList();
                    var isSelected = false; //KVSに保存されているか（ユーザーが選択しているか）
                    for (var i = 0; i < regionIDList.length; i++) {
                        if (_this.destination.regionID == regionIDList[i]) {
                            isSelected = true;
                            break;
                        }
                    }
                    
                    //ユーザーによる選択がされていない場合、地図の色を変更する
                    if (!isSelected) {
                        if (!isChecked) {
                            // 地図の色変更
                            _this.setGeojsonRegionColor(_this.destination.regionID, _this.mapColor.notSelect);
                            // 選択地域リスト更新
                            _this.showSelectedRegion();
                        }
                        _this.destination = null;
                    }
                });
            }

            //マーカー削除
            _this.deleteMarker(_this.marker_destination);
        };

        /**
         * マーカー削除
         * @param marker マーカー削除
         */
        RegionMapPageManager.prototype.deleteMarker = function (marker) {
            //マーカー削除
            if (marker != undefined) {
                map.removeLayer(marker);
                marker = null;
            }
        };

        /**
         * モーダレスウィンドウ(plus image)を生成する (For Map)
         * @param text モーダルウィンドウに表示する文字列
         * @param buttons 表示するボタンの種類
         * @param name モーダル名 ダイアログ作成時に指定したnameもしくは以下のデフォルト名を使用
         *             none:ボタンなし/ok:OKボタンのみ/cancel:cancelボタンのみ/okcancel:OKボタンとCancelボタン
         */
        RegionMapPageManager.prototype.createModalessDialogImageForMap = function (textBefore,textAfter, buttons, name) {
            var offset = 15; //offsetを指定
            var top = $(RegionMapPageManager.MAP_AREA).offset().top + offset;
            var overlayHeight = $(RegionMapPageManager.MAP_AREA).offset().top + $(RegionMapPageManager.MAP_AREA).outerHeight(true);
            var maxHeight = $(RegionMapPageManager.MAP_AREA).outerHeight(true) - (offset * 2);

            // jQuery-UIのdialogを使用
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog({
                resizable: false,       //リサイズ禁止
                title: "",           //タイトル文字列（空白）
                position: {
                    my: "top",
                    at: "top+" + top
                },
                maxHeight: maxHeight,
                buttons: buttons,
            });

            //name設定
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).attr("name", name);
            //重なりを調整
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).parent().addClass(RegionMapPageManager.CSS_MORDALESS);
            //ボタンなしモーダルの場合CSSを追加
            if (buttons == undefined || buttons.length == 0) {
                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).addClass(RegionMapPageManager.CSS_DIALOG_NOBUTTON);
            } else {
                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).removeClass(RegionMapPageManager.CSS_DIALOG_NOBUTTON);
            }
            // 本文設定

            if(!this.isEnabledRtl){
                    $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).find("p:first")
                            .html(
                                '<span class="'+RegionMapPageManager.CSS_DIALOG_TEXT+'">'+
                                 textBefore.replace('\n','</br>')
                                +'</span>'+
                                // .replace('Please tap button','Please tap <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> button')+
                                ' <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> '+
                                '<span class="'+RegionMapPageManager.CSS_DIALOG_TEXT+'">'+
                                 textAfter.replace('\n','</br>')
                                +'</span>'
                            );
            }else{
                     $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).find("p:first")
                            .html(
                                '<span class="'+RegionMapPageManager.CSS_DIALOG_TEXT_RTL_RIGHT+'">'+
                                 textBefore.replace('\n','</br>')
//                                'Before1 Before2 Before3 '
                                +'</span>'+
                                // .replace('Please tap button','Please tap <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> button')+
                                ' <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> '+
                                '<span class="'+RegionMapPageManager.CSS_DIALOG_TEXT_RTL_RIGHT+'">'+
//                                ' After1 After2 After3 After4 After5 After6 After7. '
                                 textAfter.replace('\n','</br>')
                                +'</span>'
                            );
            }
            // RTL有効/無効設定
            this.setEnabledRtl($(RegionMapPageManager.DIALOG_CONFIRM_MODALESS), this.isEnabledRtl);
            // 最前面に表示
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog("moveToTop");

            //オーバーレイを実行
            this.setOverlay(true, $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS));
            //オーバーレイの高さを変更
            $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS).css("height", overlayHeight + "px");

            //リストのcheckBoxを操作不可に変更
            this.setAllCheckBoxStatus(true);
        };


        /**
         * モーダレスウィンドウを生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param buttons 表示するボタンの種類
         * @param name モーダル名 ダイアログ作成時に指定したnameもしくは以下のデフォルト名を使用
         *             none:ボタンなし/ok:OKボタンのみ/cancel:cancelボタンのみ/okcancel:OKボタンとCancelボタン
         */
        RegionMapPageManager.prototype.createModalessDialogForMap = function (text, buttons, name) {
            var offset = 15; //offsetを指定
            var top = $(RegionMapPageManager.MAP_AREA).offset().top + offset;
            var overlayHeight = $(RegionMapPageManager.MAP_AREA).offset().top + $(RegionMapPageManager.MAP_AREA).outerHeight(true);
            var maxHeight = $(RegionMapPageManager.MAP_AREA).outerHeight(true) - (offset * 2);

            // jQuery-UIのdialogを使用
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog({
                resizable: false,       //リサイズ禁止
                title: "",           //タイトル文字列（空白）
                position: {
                    my: "top",
                    at: "top+" + top
                },
                maxHeight: maxHeight,
                buttons: buttons,
            });

            //name設定
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).attr("name", name);
            //重なりを調整
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).parent().addClass(RegionMapPageManager.CSS_MORDALESS);
            //ボタンなしモーダルの場合CSSを追加
            if (buttons == undefined || buttons.length == 0) {
                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).addClass(RegionMapPageManager.CSS_DIALOG_NOBUTTON);
            } else {
                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).removeClass(RegionMapPageManager.CSS_DIALOG_NOBUTTON);
            }
            // 本文設定
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).find("p:first").html(text.replace('\n','</br>'));
            // RTL有効/無効設定
            this.setEnabledRtl($(RegionMapPageManager.DIALOG_CONFIRM_MODALESS), this.isEnabledRtl);
            // 最前面に表示
            $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog("moveToTop");

            //オーバーレイを実行
            this.setOverlay(true, $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS));
            //オーバーレイの高さを変更
            $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS).css("height", overlayHeight + "px");

            //リストのcheckBoxを操作不可に変更
            this.setAllCheckBoxStatus(true);
        };

        /**
         * モーダルウィンドウ（ボタンなし）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         */
        RegionMapPageManager.prototype.createModalDialogNoButtonForMap = function (text, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.none;
            }
            //ダイアログ作成
            this.createModalessDialogForMap(text, new Array(), dialogName);
        };

        /**
         * モーダルウィンドウ（ボタンなし）を生成する (For Map)
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         */
        RegionMapPageManager.prototype.createModalDialogImageNoButtonForMap = function (textBefore,textAfter, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.none;
            }
            //ダイアログ作成
            this.createModalessDialogImageForMap(textBefore,textAfter, new Array(), dialogName);
        };

        /**
         * モーダルウィンドウ（OKボタン付）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         * @param name ダイアログ名称（指定がない場合はデフォルト値（ok)
         */
        RegionMapPageManager.prototype.createModalDialogOkButtonForMap = function (text, callback, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.ok;
            }

            //ボタンの作成
            var buttons = new Array({
                text: this.texts.ok,
                click: function () {
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
            //ダイアログ作成
            this.createModalessDialogForMap(text, buttons, dialogName);
        };

        /**
         * モーダルウィンドウ（Cancelボタン付）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         */
        RegionMapPageManager.prototype.createModalDialogCancelButtonForMap = function (text, callback, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.cancel;
            }

            //ボタンの作成
            var buttons = new Array({
                text: this.texts.cancel,
                click: function () {
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
            //ダイアログ作成
            this.createModalessDialogForMap(text, buttons, dialogName);

        };

        /**
         * モーダルウィンドウ（ボタン２つ）を生成する
         * @param text モーダルウィンドウに表示する文字列
         * @param callback1 ボタン（左）押下時のコールバック関数
         * @param callback2 ボタン（右）押下時のコールバック関数
         * @param name ダイアログ名称（指定がない場合はデフォルト値（okcancel)
         */
        RegionMapPageManager.prototype.createModalDialogOkCancelButtonForMap = function (text, callback1, callback2, name) {
            var _this = this;
            var dialogName = name;
            if (dialogName == undefined || dialogName == null) {
                dialogName = _this.dialogType.okcancel;
            }

            //ボタンの作成
            var buttons = new Array();
            var OKLogic = {
                text: this.texts.ok,
                click: function () {
                    if (callback1 != undefined) {
                        callback1();
                    }
                }
            };
            var cancelLogic = {
                text: this.texts.cancel,
                click: function () {
                    if (callback2 != undefined) {
                        callback2();
                    }
                }
            };

            ////RTL有効/無効に合わせてボタンの表示順を変更
            if (this.isEnabledRtl) {
                buttons.push(cancelLogic);
                buttons.push(OKLogic);

            } else {
                buttons.push(OKLogic);
                buttons.push(cancelLogic);
            }

            //ダイアログ作成
            this.createModalessDialogForMap(text, buttons, dialogName);
        };

        /**
          * モードレスウィンドウをクローズする
          */
         RegionMapPageManager.prototype.closeModalessDialog = function (name) {

            try {

                if (name != undefined && name != null) {
                    //指定したnameと一致しない場合はモーダルをクローズしない
                    if ($(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).attr("name") != name) {
                        return;
                    }
                }

                //オーバーレイを解除
                this.setOverlay(false, $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS));

                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog("close");


                    
            } catch (error) {
                console.log(error);
            }
        };

/* #MOTA-126 by asada start */
        /**
          * モードレスウィンドウ(オーバレイは残したまま)をクローズする
          */
         RegionMapPageManager.prototype.closeModalessDialog_with_Overlay = function (name) {

            try {

                var overlayHeight = $(RegionMapPageManager.MAP_AREA).offset().top + $(RegionMapPageManager.MAP_AREA).outerHeight(true);

                if (name != undefined && name != null) {
                    //指定したnameと一致しない場合はモーダルをクローズしない
                    if ($(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).attr("name") != name) {
                        return;
                    }
                }

                //オーバーレイはそのまま
                this.setOverlay(true, $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS));
                //オーバーレイの高さを変更
                $(RegionMapPageManager.OVERLAY_AREA_FOR_MODALESS).css("height", overlayHeight + "px");

                console.log("**** only over_lay *****");

                $(RegionMapPageManager.DIALOG_CONFIRM_MODALESS).dialog("close");


            } catch (error) {
                console.log(error);
            }
        };
/* #MOTA-126 by asada end */

        RegionMapPageManager.PagePath = "../mobile_ota/gen4/regionMap.html";
        RegionMapPageManager.ModuleName = "MobileOtaGen4.RegionMapPageManager";

        //定数
        RegionMapPageManager.SEARCH_LIST = "#search_list";   //検索結果一覧
        RegionMapPageManager.MAP = "#map";                  //地図
        RegionMapPageManager.AUTO_REGIONS_SETTING_LIST = "#autoRegionsSetting_list";    //Auto Regions Setting
        RegionMapPageManager.AUTO_REGIONS_SETTING_LIST_CURRENT = "#currentPoint";       //Auto Regions Setting 現在位置
        RegionMapPageManager.AUTO_REGIONS_SETTING_LIST_DEST = "#destinationPoint";      //Auto Regions Setting 目的地
        RegionMapPageManager.TAG_KEY_SEARCH_CLEAR = "#searchBox a";                     //検索ボックスクリアボタン
        RegionMapPageManager.TAG_KEY_SEARCH_AREA = "#searchBox div"                     //検索ボックスエリア（ハッチングに使用）
/* #MOTA-92 by asada 18/08/29 start */
        RegionMapPageManager.COLOR_DEFAULT = "#666";        //基本の色
        RegionMapPageManager.COLOR_UPDATED = "#25a";       //選択状態　車載機更新済（青）
        RegionMapPageManager.COLOR_NOTUPDATE = "#69c";       //選択状態　車載機更新未（緑）
        RegionMapPageManager.COLOR_NOTDOWNLOAD = "#adf";    //選択状態　未DL（赤）
        RegionMapPageManager.COLOR_SELECTED = "#999";    //選択状態　checkForUpdate実行前（水色）
        RegionMapPageManager.COLOR_NOTSELECT = "#ddd"; //未選択：（灰）
/* #MOTA-92 by asada 18/08/29 end */

        RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_OFF = "mobile-ota-search-overlay-serchBox-off";
        RegionMapPageManager.CSS_OVERLAY_SEARCHBOX_ON = "mobile-ota-search-overlay-serchBox-on";

        RegionMapPageManager.CSS_DIALOG_IMAGE = "harman-ota-dialog-image";
        RegionMapPageManager.CSS_DIALOG_TEXT = "harman-ota-dialog-text";
        RegionMapPageManager.CSS_DIALOG_TEXT_RTL_RIGHT = "harman-ota-dialog-text-rtl-right";
        RegionMapPageManager.IMAGE_PATH = "./images/icon_download_cancel.png";

        // key
        RegionMapPageManager.KEY_REGIONID = "regionID";
        RegionMapPageManager.KEY_LATLNG = "latLng";
        RegionMapPageManager.KEY_REGIONNAME = "regionName";

        var controller = MobileOtaGen4.Controller.getInstance();
        var PAGE_ID = "huupd_regionMapPage";
        controller.addPage(PAGE_ID, function () {
            return new RegionMapPageManager();
        });
        return RegionMapPageManager;
    })();
})();
