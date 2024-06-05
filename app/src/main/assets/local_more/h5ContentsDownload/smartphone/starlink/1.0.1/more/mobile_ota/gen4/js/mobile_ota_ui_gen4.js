(function () {
    // _super : MobileOtaGen4.UI
    var UIGen4 = (function () {
        var _super = MobileOtaGen4.UI;

        __extends(UIGen4, _super);

        function UIGen4() {
            _super.apply(this, arguments);
        }
        MobileOtaGen4.UIGen4 = UIGen4;
        var UI = UIGen4;

       /**
         * 更新データ一覧UI
         */
        var RegionList = (function () {

            var _super =  HarmanOTA.UI.UpdateList;
            // override
            for (var key in _super.ICON_INFO.PATH) {
                var value = _super.ICON_INFO.PATH[key];
                if (value == '') {
                    continue;
                }
                _super.ICON_INFO.PATH[key] = "./../../" + value;
            }
            _super.setupIconInfoType();

            _super.USE_CHECK_BOX = true;
            _super.ROW_CSS_CLASS = "harman-ota-upd-region-list";
            _super.ROW_TOGGLE_BUTTON_LAYOUT_CSS_CLASS = "harman-ota-region-list-check-box-layout";

            __extends(RegionList, _super);
        
            function RegionList() {
                _super.apply(this, arguments);
            }

            RegionList.getItemTitleCss = function ($item) {
                var $title = $item.find("." + RegionList.ROW_TITLE_CSS_CLASS);
                return $title ;
            };
            RegionList.setItemTitleColor = function ($item, color) {
                $title = RegionList.getItemTitleCss($item);
                $title.css('color', color);
                $version = RegionList.getItemVersionCss($item);
                $version.css('color', color);
                $size = RegionList.getItemSizeCss($item);
                $size.css('color', color);
            };
            RegionList.getItemVersionCss = function ($item) {
                var $version = $item.find("." + RegionList.ROW_VERSION_CSS_CLASS);
                return $version;
            };
            RegionList.setItemVersion = function ($item, version) {
                if (version != null) {
                    var $versionLayout = RegionList.getItemVersion($item);
                    if (version.label != null) {
                        $versionLayout.$label.text(version.label);
                    }
                    if (version.value != null) {
                        $versionLayout.$value.text(version.value);
                    }
                }
            };
            RegionList.hiddenItemVersion = function ($item) {
                var $versionLayout = RegionList.getItemVersion($item);
                $versionLayout.$label.text("");
                $versionLayout.$value.text("");
            };
            RegionList.getItemSizeCss = function ($item) {
                var $size = $item.find("." + RegionList.ROW_SIZE_CSS_CLASS);
                return $size;
            };
            RegionList.setItemSize = function ($item, size) {
                if (size != null) {
                    var $sizeLayout = RegionList.getItemSize($item);
                    if (size.label != null) {
                        $sizeLayout.$label.text(size.label);
                    }
                    if (size.value != null) {
                        $sizeLayout.$value.text(size.value);
                    }
                }
            };
            RegionList.hiddenItemSize = function ($item) {
                var $sizeLayout = RegionList.getItemSize($item);
                $sizeLayout.$label.text("");
                $sizeLayout.$value.text("");
            };
            /**
             * データ行内のチェックkボックスの状態変更コールバックを設定する
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param callback 状態変更コールバック
             */
            RegionList.setButtonStatusChangedCallback = function ($item, keys, callback) {
                UI.CheckBox.setButtonStatusChangedCallback(RegionList.getCheckBox($item), keys, callback);
            };
            /**
             * データ行内のチェックkボックスの状態設定（ON/OFF設定）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isOn 状態（true:ON、false:OFF）
             */
            RegionList.setButtonStatus = function ($item, isOn) {
                UI.CheckBox.setButtonStatus(RegionList.getCheckBox($item), isOn);
            };
            /**
             * データ行内のチェックkボックスの状態取得（ON/OFF取得）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 状態（true:ON、false:OFF）
             */
            RegionList.getButtonStatus = function ($item) {
                return UI.CheckBox.getButtonStatus(RegionList.getCheckBox($item));
            };
            /**
             * データ行内のチェックkボックスの表示制御
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isShow 表示／非表示（true:表示、false:非表示）
             */
            RegionList.setShowButton = function ($item, isShow) {
                RegionList.getCheckBox($item).css("visibility", isShow ? "visible" : "hidden");
            };
            /**
             * データ行内のチェックkボックスの表示状態取得（表示／非表示取得）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 表示／非表示（true:表示、false:非表示）
             */
            RegionList.getShowButton = function ($item) {
                return RegionList.getCheckBox($item).css("visibility") != "hidden";
            };
            /**
             * データ行内のチェックkボックスを取得する
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 対象行内のチェックkボックスDOM要素
             */
            RegionList.getCheckBox = function ($item) {
                return $item.find("." + RegionList.ROW_CHECK_BOX_BASE_CSS_CLASS);
            };

            /**
             * データ行内のチェックボックスの状態を変更する
             * @param {*} $item 
             * @param {*} disabled true:非活性 / false:活性
             */
            RegionList.setCheckBoxDisabled = function ($item, disabled) {
                $item.find("input[type=checkbox]").prop("disabled", disabled);
            }
  
            return RegionList;
        })();

        /**
         * ストレージバー
         */
        var StorageBar = (function () {
            function StorageBar() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            StorageBar.create = function ($target) {
                var $div = $("<div class='graph'></div>");
                var $span1 = $("<span class='bar' id='storage_used'></span>");
                var $span2 = $("<span class='bar' id='region_total'></span>");
                var $span3 = $("<span class='bar' id='storage_free'></span>");
                var $span4 = $("<span class='bar' id='storagebar_value'></span>");
                $div.append($span1);
                $div.append($span2);
                $div.append($span3);
                $div.append($span4);
                $target.append($div);
            };

            return StorageBar;
        })();

    /////検索結果リスト
        /**
         * 検索結果データ一覧UI
         */
        var SearchList = (function () {
            function SearchList() {
            };
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            SearchList.create = function ($target) {
                //targetにCSS設定
                $target.addClass("mobile-ota-search-list");

                var $ul = $("<ul></ul>");
                $ul.attr("data-role", "listview");
                $ul.attr("data-dividertheme", "b");
                $ul.addClass("harman-ota-upd-data-list");
                $target.append($ul);
                $target.attr("data-role", "fieldcontain");
                // 表示更新
                SearchList.refresh($target, true);
            };

            /**
             * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
             */
            SearchList.refresh = function ($target, isInit) {
                $target.parents("div:jqmData(role=page)").page();
                $target.find(":jqmData(role=listview)").listview(isInit ? undefined : "refresh");
            };

            /**
             * Class削除
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            SearchList.removeClass = function ($target) {
                // 表示更新
                $target.removeClass("mobile-ota-search-list");
            };

            /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            SearchList.addItemRegion = function ($target) {
                // 構成要素を生成
                var $li = $("<li></li>");
                var $displayName = $("<span></span>");

                $li.attr("data-role","list-divider");

                $displayName.addClass(SearchList.ROW_LABEL_CSS_CLASS);
                $li.append($displayName);

                $target.find(":jqmData(role=listview)").append($li);
                
                // 表示更新
                SearchList.refresh($target, false);
                return $li;
            };

            /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            SearchList.addItemSpot = function ($target) {
                // 構成要素を生成
                var $li = $("<li></li>");
                var $displayName = $("<span></span>");

                $displayName.addClass(SearchList.ROW_LABEL_CSS_CLASS);
                $li.append($displayName);


                $target.find(":jqmData(role=listview)").append($li);
                
                // 表示更新
                SearchList.refresh($target, false);
                return $li;
            };

            /**
             * 行情報設定
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param info 設定情報
             * }
             */
            SearchList.setItemInfo = function ($item, info) {
                var $displayName = $item.find("." + SearchList.ROW_LABEL_CSS_CLASS);

                if (info.displayName != null) {
                    $displayName.text(info.displayName);
                }

                if (info.regionID != null) {
                    $displayName.attr(SearchList.ROW_VALUE_DATA_REGIONID_ATTRIBUTE,info.regionID);
                }

                if (info.latitude != null) {
                    $displayName.attr(SearchList.ROW_VALUE_DATA_LATITUDE_ATTRIBUTE,info.latitude);
                }

                if (info.longitude != null) {
                    $displayName.attr(SearchList.ROW_VALUE_DATA_LONGITUDE_ATTRIBUTE,info.longitude);
                }

                if (info.statecode != null) {
                    $displayName.attr(SearchList.ROW_VALUE_DATA_STATECODE_ATTRIBUTE,info.statecode);
                }

            };

            SearchList.ROW_LABEL_CSS_CLASS = "mobile-ota-search-list-label";
            SearchList.ROW_VALUE_CSS_CLASS = "mobile-ota-search-list-value";
            SearchList.ROW_VALUE_DATA_REGIONID_ATTRIBUTE = "data-regionid";
            SearchList.ROW_VALUE_DATA_LATITUDE_ATTRIBUTE = "data-latitude";
            SearchList.ROW_VALUE_DATA_LONGITUDE_ATTRIBUTE = "data-longitude";
            SearchList.ROW_VALUE_DATA_STATECODE_ATTRIBUTE = "data-statecode";
            return SearchList;
        })();

/**
         * 検索結果データ一覧UI
         */
        var AutoRegionsSettingList = (function () {
            function AutoRegionsSettingList() {
            };
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            AutoRegionsSettingList.create = function ($target) {
                var $ul = $("<ul></ul>");
                $ul.attr("data-role", "listview");
                $ul.attr("data-dividertheme", "b");
                $ul.addClass("harman-ota-upd-data-list");
                $ul.addClass("harman-ota-upd-region-list");
                $target.append($ul);
                $target.attr("data-role", "fieldcontain");
                // 表示更新
                AutoRegionsSettingList.refresh($target, true);
            };
            /**
             * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
             */
            AutoRegionsSettingList.refresh = function ($target, isInit) {
                $target.parents("div:jqmData(role=page)").page();
                $target.find(":jqmData(role=listview)").listview(isInit ? undefined : "refresh");
            };

            /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            AutoRegionsSettingList.addItemCurrent = function ($target) {
                // 構成要素を生成
                var $li = $("<li></li>");
                var $contents= $("<div></div>");
                var $text = $("<div></div>");
                var $currentImg = $('<img></img>');

                $currentImg.addClass(AutoRegionsSettingList.ROW_ICON_CURRENT_CSS_CLASS);
                $currentImg.attr("src",AutoRegionsSettingList.ROW_ICON_CURRENT_PATH);
                $contents.append($currentImg);

                $text.addClass(AutoRegionsSettingList.ROW_LABEL_CSS_CLASS);
                $text.attr("id",AutoRegionsSettingList.ROW_LABEL_ID_CURRENT);
                $contents.append($text);

                $contents.addClass(AutoRegionsSettingList.ROW_CONTENTS_CSS_CLASS);
                $li.append($contents);

                $target.find(":jqmData(role=listview)").append($li);
                
                // 表示更新
                AutoRegionsSettingList.refresh($target, false);
                return $li;
            };
  /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            AutoRegionsSettingList.addItemRoute = function ($target) {
                // 構成要素を生成
                var $li = $("<li></li>");
                var $contents= $("<div></div>");
                var $text = $("<div></div>");
                var $currentImg = $('<img></img>');

                var svg = window.document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttributeNS(null, 'version', '1.1');
                svg.setAttribute("width", "40px");
                svg.setAttribute("height", "60px");
                svg.setAttribute("style", "transform: translateY(15%) translateX(-5%)");
                var path = window.document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", AutoRegionsSettingList.ROW_SVG_CSS_CLASS);
                path.setAttribute("d", "M15 0 L30 0 L30 25 L40 25 L22 50 L5 25 L15 25 Z");
                svg.appendChild(path);

                $contents.append(svg);

                $contents.addClass(AutoRegionsSettingList.ROW_CONTENTS_CSS_CLASS);
                $li.append($contents);

                $target.find(":jqmData(role=listview)").append($li);
                  
                
                // 表示更新
                AutoRegionsSettingList.refresh($target, false);
                return $li;
            };

            /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            AutoRegionsSettingList.addItemDestination = function ($target) {
                // 構成要素を生成
                var $li = $("<li></li>");
                var $contents= $("<div></div>");
                var $destImg = $('<img></img>');
                var $text = $("<div></div>");

                $destImg.addClass(AutoRegionsSettingList.ROW_ICON_DEST_CSS_CLASS);
                $destImg.attr("src",AutoRegionsSettingList.ROW_ICON_DEST_PATH);
                $contents.append($destImg);
               
                $text.addClass(AutoRegionsSettingList.ROW_LABEL_CSS_CLASS);
                $text.attr("id",AutoRegionsSettingList.ROW_LABEL_ID_DEST);
                $contents.append($text);

                $contents.addClass(AutoRegionsSettingList.ROW_CONTENTS_CSS_CLASS);
                $li.append($contents);

                $target.find(":jqmData(role=listview)").append($li);
                
                // 表示更新
                AutoRegionsSettingList.refresh($target, false);
                return $li;
            };

            /**
             * 行情報設定
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param info 設定情報
             * }
             */
            AutoRegionsSettingList.setItemInfo = function ($item, info) {
                var $displayName = $item.find("." + AutoRegionsSettingList.ROW_LABEL_CSS_CLASS);
                var $destination = $item.find("." + AutoRegionsSettingList.ROW_ICON_DEST_CSS_CLASS);
                
                if (info.displayName != null) {
                    $displayName.text(info.displayName);
                }

                if (info.regionID != null) {
                    $displayName.attr(AutoRegionsSettingList.ROW_VALUE_DATA_REGIONID_ATTRIBUTE,info.regionID);
                }

                if (info.latitude != null) {
                    $displayName.attr(AutoRegionsSettingList.ROW_VALUE_DATA_LATITUDE_ATTRIBUTE,info.latitude);
                }

                if (info.longitude != null) {
                    $displayName.attr(AutoRegionsSettingList.ROW_VALUE_DATA_LONGITUDE_ATTRIBUTE,info.longitude);
                }

                if (info.statecode != null) {
                    $displayName.attr(AutoRegionsSettingList.ROW_VALUE_DATA_STATECODE_ATTRIBUTE,info.statecode);
                }

            };
            AutoRegionsSettingList.ROW_CONTENTS_CSS_CLASS = "mobile-ota-select-list-contents";
            AutoRegionsSettingList.ROW_LABEL_CSS_CLASS = "mobile-ota-select-list-text";
            AutoRegionsSettingList.ROW_SVG_CSS_CLASS = "mobile-ota-select-list-svg-route";
            AutoRegionsSettingList.ROW_ICON_CURRENT_CSS_CLASS = "mobile-ota-select-list-img-current",
            AutoRegionsSettingList.ROW_ICON_DEST_CSS_CLASS = "mobile-ota-select-list-img-destination";
            AutoRegionsSettingList.ROW_ICON_ROUTE_CSS_CLASS = "mobile-ota-select-list-img-route";
            AutoRegionsSettingList.ROW_ICON_CURRENT_PATH = "./images/Your_location.png";
            AutoRegionsSettingList.ROW_ICON_DEST_PATH = "./images/destnation.png";
            AutoRegionsSettingList.ROW_LABEL_ID_CURRENT = "currentPoint";
            AutoRegionsSettingList.ROW_LABEL_ID_DEST = "destinationPoint";
            AutoRegionsSettingList.ROW_VALUE_DATA_REGIONID_ATTRIBUTE = "data-regionid";
            AutoRegionsSettingList.ROW_VALUE_DATA_LATITUDE_ATTRIBUTE = "data-latitude";
            AutoRegionsSettingList.ROW_VALUE_DATA_LONGITUDE_ATTRIBUTE = "data-longitude";
            AutoRegionsSettingList.ROW_VALUE_DATA_STATECODE_ATTRIBUTE = "data-statecode";
            return AutoRegionsSettingList;
        })();

        /**
         * プログレスサークルUI
         */
        /**
         * 進捗率の色設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
          * @param color 表示する色
         */
        UI.ProgressCircle.setProgressColor = function ($target, color) {
            var $circleCenter = $target.find("svg " + UI.ProgressCircle.CENTER_SHAPE + "." + UI.ProgressCircle.SVG_CENTER_CSS_CLASS);
            $circleCenter.css("fill", color);
            var $progressCircle = $target.find("svg circle." + UI.ProgressCircle.SVG_PROGRESS_CSS_CLASS);
            $progressCircle.css("stroke", color);
        };

        UI.RegionList = RegionList;
        UI.StorageBar = StorageBar;
        UI.SearchList = SearchList;
        UI.AutoRegionsSettingList = AutoRegionsSettingList;

        return UIGen4;

    })();
})();
