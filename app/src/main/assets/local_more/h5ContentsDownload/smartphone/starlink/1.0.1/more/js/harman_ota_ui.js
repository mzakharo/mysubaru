/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile.d.ts" />
/// <reference path="jquerymobile_exp.d.ts" />

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var HarmanOTA;
(function (HarmanOTA) {
    var UI;
    (function (UI) {
        (function (MAP_DATA_ICON_TYPE) {
            var i = 0;
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["NOT_DOWNLOAD"] = i++] = "NOT_DOWNLOAD";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["NOT_UPDATE"] = i++] = "NOT_UPDATE";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["UPDATED"] = i++] = "UPDATED";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["INSTALLING"] = i++] = "INSTALLING";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["DELETE"] = i++] = "DELETE";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["UPDATEINFO_CAN_DOWNLOAD"] = i++] = "UPDATEINFO_CAN_DOWNLOAD";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["UPDATEINFO_CANNOT_DOWNLOAD"] = i++] = "UPDATEINFO_CANNOT_DOWNLOAD";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["DOWNLOADING"] = i++] = "DOWNLOADING";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["NOT_DELETE"] = i++] = "NOT_DELETE";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["HIDDEN"] = i++] = "HIDDEN";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["PRE_DOWNLOAD"] = i++] = "PRE_DOWNLOAD";
            MAP_DATA_ICON_TYPE[MAP_DATA_ICON_TYPE["UPDATEINFO_UNACTIVE"] = i++] = "UPDATEINFO_UNACTIVE";
        })(UI.MAP_DATA_ICON_TYPE || (UI.MAP_DATA_ICON_TYPE = {}));
        var MAP_DATA_ICON_TYPE = UI.MAP_DATA_ICON_TYPE;
        ;
        UI.RTL_CLASS = "rtl";
        UI.RTL_ALIGN_RIGHT_CLASS = "rtl-align-right";
        UI.LTR_ALIGN_RIGHT_CLASS = "ltr-align-right";
        UI.RTL_CANCEL_CLASS = "rtl-cancel";
        UI.RTL_CTRL = "&rlm;";
        UI.defaultCallbacks = {
            'accessoryConnected' : function() {},
            'downloading' : function() {},
            'transferring' : function() {},
        };
        UI.callbacks = UI.defaultCallbacks;
        UI.setCallbacks = function(callbacks) {
            UI.callbacks = callbacks;
            for (var key in UI.defaultCallbacks) {
                if (UI.callbacks[key] == undefined) {
                    UI.callbacks[key] = UI.defaultCallbacks[key];
                }
            }
        };

        /**
         * プログレスサークルUI
         */
        var ProgressCircle = (function () {
            function ProgressCircle() {
            }

            ProgressCircle.USE_CENTER_RECT = true;
            ProgressCircle.CENTER_SHAPE = ProgressCircle.USE_CENTER_RECT ? 'rect' : 'circle';

            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            ProgressCircle.create = function ($target) {
                var svg = window.document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var baseRect = 43;
                svg.setAttributeNS(null, 'version', '1.1');
                svg.setAttribute("class", ProgressCircle.SVG_BASE_CSS_CLASS);
                svg.setAttribute("width", baseRect + "px");
                svg.setAttribute("height", baseRect + "px");
                var circleBg = window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circleBg.setAttribute("class", ProgressCircle.SVG_BG_CSS_CLASS);
                circleBg.setAttribute("r", "20");
                circleBg.setAttribute("cx", "21.5");
                circleBg.setAttribute("cy", "21.5");
                circleBg.setAttribute("stroke-width", "3");
                circleBg.setAttribute("fill", "none");
                svg.appendChild(circleBg);

                var centerShape = window.document.createElementNS("http://www.w3.org/2000/svg", ProgressCircle.CENTER_SHAPE);
                centerShape.setAttribute("class", ProgressCircle.SVG_CENTER_CSS_CLASS);
                if (ProgressCircle.USE_CENTER_RECT) {
                    var centerRect = 15;
                    var centerPos = (baseRect - centerRect) / 2;
                    centerShape.setAttribute("x", centerPos);
                    centerShape.setAttribute("y", centerPos);
                    centerShape.setAttribute("width", centerRect);
                    centerShape.setAttribute("height", centerRect);
                } else {
                    centerShape.setAttribute("r", "10");
                    centerShape.setAttribute("cx", "21.5");
                    centerShape.setAttribute("cy", "21.5");
                }
                svg.appendChild(centerShape);

                var circleProgress = window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circleProgress.setAttribute("class", ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                circleProgress.setAttribute("r", "20");
                circleProgress.setAttribute("cx", "21.5");
                circleProgress.setAttribute("cy", "21.5");
                circleProgress.setAttribute("transform", "rotate(-90, 21.5, 21.5)");
                circleProgress.setAttribute("stroke-width", "3");
                circleProgress.setAttribute("fill", "none");
                circleProgress.setAttribute("stroke-dasharray", "126"); // 円周を設定（半径*2*3.14）
                circleProgress.setAttribute("stroke-dashoffset", "126"); // 円周に対する非表示割合を設定（例：円周が126、この値が12.6で90%[(1-(12.6/126))*100]）
                svg.appendChild(circleProgress);
                $target.addClass(ProgressCircle.BASE_CSS_CLASS);
                $target.append(svg);

            };
            /**
             * 進捗率設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param progress 進捗率（0-100）
             */
            ProgressCircle.setProgressValue = function ($target, progress) {
                var $progressCircle = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                var circumference = +$progressCircle.attr("stroke-dasharray");
                var value = progress == 100 ? 100 : progress % 100;
                $progressCircle.attr("stroke-dashoffset", circumference - (circumference * (value / 100)));

            };
            /**
             * 進捗率取得
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 進捗率（0-100）
             */
            ProgressCircle.getProgressValue = function ($target) {
                var $progressCircle = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                var circumference = +$progressCircle.attr("stroke-dasharray");
                var progress = +$progressCircle.attr("stroke-dashoffset");
                return progress / circumference * 100;
            };

            /**
             * 点滅アニメーションを追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。） 
             * @param regionID 
             */
            ProgressCircle.setFlashProgressCircle = function ($target, regionID) {
                for(var i = 0; i < this.shineProgressTimer.length; i++) {
                    var timer = this.shineProgressTimer[i];
                    if (timer.regionID == regionID) {
                        return;
                    }
                }

                var $progressCircle = $target.find("svg " + ProgressCircle.CENTER_SHAPE + "." + ProgressCircle.SVG_CENTER_CSS_CLASS);
                var count = 0;
                var interval = setInterval( function() {
                    count++;
                  if( count % 2 == 0 ){
                    $progressCircle.css("animation", ProgressCircle.SVG_ANIMATION_FLASH_ON + " 1s");
                  } else {
                    $progressCircle.css("animation", ProgressCircle.SVG_ANIMATION_FLASH_OFF + " 1s");
                  }
                }, 1000);

                //配列に追加
                this.shineProgressTimer.push({
                    "regionID" : regionID,
                    "timer": interval
                });
            };

            /**
             * 点滅アニメーションの削除
             * @param {*} regionID nullの場合全タイマーを削除
             */
            ProgressCircle.stopFlashProgressCircle = function (regionID) {
                if (this.shineProgressTimer == undefined || this.shineProgressTimer.length == 0) {
                    return;
                }
                
                var len = this.shineProgressTimer.length;
                for (var index = 0; index < len; index++) {
                    //個別削除かつregionIDが一致しない場合は次のループへ
                    if (regionID != undefined && this.shineProgressTimer[index].regionID != regionID) {
                        continue;
                    }
                    //タイマー削除処理
                    clearInterval(this.shineProgressTimer[index].timer);
                    this.shineProgressTimer.splice(index, 1);
                    index--;
                    len--;
                }; 
            };

            ProgressCircle.setProgressName = function ($target, name) {
                var $progressCircle = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                $progressCircle.attr("name", name);
            };

            ProgressCircle.getProgressName = function ($target) {
                var $progressCircle = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                return $progressCircle.attr("name");
            };

            /**
             * プログレスサークルUI
             */
            /**
             * 進捗率の色設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
              * @param color 表示する色
             */
            ProgressCircle.setProgressColor = function ($target, color) {
                var $circleCenter = $target.find("svg " + ProgressCircle.CENTER_SHAPE + "." + ProgressCircle.SVG_CENTER_CSS_CLASS);
                $circleCenter.css("fill", color);
                var $progressCircle = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
                $progressCircle.css("stroke", color);
            };


            ProgressCircle.BASE_CSS_CLASS = "harman-ota-progress-circle";
            ProgressCircle.SVG_BASE_CSS_CLASS = "progress-circle";
            ProgressCircle.SVG_BG_CSS_CLASS = "bg";
            ProgressCircle.SVG_CENTER_CSS_CLASS = "center";
            ProgressCircle.SVG_PROGRESS_CSS_CLASS = "progress";
            ProgressCircle.SVG_ANIMATION_FLASH_ON = "harman-ota-progress-circle-flash-on";
            ProgressCircle.SVG_ANIMATION_FLASH_OFF = "harman-ota-progress-circle-flash-off";
            ProgressCircle.TARGET_NAME_DOWNLOAD = "donwload";
            ProgressCircle.TARGET_NAME_TRANSFER = "transfer";
            ProgressCircle.shineProgressTimer = new Array();
            ProgressCircle.COLOR_DOWNLOAD_PROGRESS = "#666"; //色（ダウンロード進捗率）
            ProgressCircle.COLOR_ACCESSORY_TRANSFER_PROGRESS = "#bbb"; //色（車載機転送進捗率）

            return ProgressCircle;
        })();
        UI.ProgressCircle = ProgressCircle;
        /**
         * トグルボタンUI
         */
        var ToggleButton = (function () {
            function ToggleButton() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            ToggleButton.create = function ($target) {
                var $checkbox = $("<input>");
                var $label = $("<label></label>");
                $checkbox.attr("type", "checkbox");
                $checkbox.attr("data-role", "none");
                $checkbox.addClass(ToggleButton.BASE_CSS_CLASS);
                $label.attr("data-role", "none");
                $target.append($checkbox);
                $target.append($label);
                // DIV要素タップ時にON/OFF切り替えを動作させる
                $target.click(function (eventObject) {
                    $checkbox.click();
                    // 親へのイベント伝播を停止する
                    // （listview行内に配置して行のクリックと連動させる場合に、これがないと多重動作となる）
                    eventObject.stopPropagation();
                });
            };
            /**
             * 状態（ON/OFF）設定
             * @param $taget 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isOn 状態（true:ON、false:OFF）
             */
            ToggleButton.setButtonStatus = function ($target, isOn) {
                $target.find("input:first").prop("checked", isOn);
            };
            /**
             * 状態（ON/OFF）取得
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 状態（true:ON、false:OFF）
             */
            ToggleButton.getButtonStatus = function ($target) {
                return $target.find("input:first").prop("checked");
            };
            /**
             * 状態（ON/OFF）トグル
             */
            ToggleButton.toggleButtonStatus = function ($target) {
                $target.find("input:first").click();
            };
            /**
             * 状態変更コールバック設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param callback 状態変更コールバック
             */
            ToggleButton.setButtonStatusChangedCallback = function ($target, callback) {
                var $checkbox = $target.find("input:first");
                $checkbox.click(function (eventObject) {
                    if (callback != null) {
                        callback($target, $checkbox.prop("checked"));
                    }
                });
            };
            ToggleButton.BASE_CSS_CLASS = "harman-ota-toggle-button";
            return ToggleButton;
        })();
        UI.ToggleButton = ToggleButton;
        /**
         * ページ下端ボタン（スクロール固定）UI
         */
        var PageBottomButton = (function () {
            function PageBottomButton() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            PageBottomButton.create = function ($target) {
                var $p = $("<p></p>");
                $p.attr("data-role", "none");
                $target.addClass(PageBottomButton.BASE_CSS_CLASS);
                $target.append($p);
            };
            /**
             * 有効／無効設定（無効時はハッチング）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param enabled 有効／無効設定（true:有効、false:無効）
             */
            PageBottomButton.setEnabled = function ($target, enabled) {
                $target.attr("enabled", enabled ? "true" : "false");
            };
            /**
             * 表示ラベル設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param label 表示ラベル
             */
            PageBottomButton.setLabel = function ($target, label) {
                $target.find("p:first").text(label);
            };
            /**
             * 表示ラベル取得
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 表示ラベル
             */
            PageBottomButton.getLabel = function ($target) {
                return $target.find("p:first").text();
            };
            /**
             * RTL有効/無効設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param enabled 有効/無効
             */
            PageBottomButton.setEnabledRtl = function ($target, enabled) {
                var $label = $target.find("p:first");
                if (enabled) {
                    $label.addClass(UI.RTL_CLASS);
                }
                else {
                    $label.removeClass(UI.RTL_CLASS);
                }
            };
            /**
             * RTL有効/無効取得
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 有効/無効
             */
            PageBottomButton.getEnabledRtl = function ($target) {
                return $target.find("p:first").hasClass(UI.RTL_CLASS);
            };
            /**
             * 状態変更コールバック設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param callback 状態変更コールバック
             */
            PageBottomButton.setClickedCallback = function ($target, callback) {
                $target.off("click");
                $target.click(function (eventObject) {
                    if (callback != null) {
                        callback($target);
                    }
                });
            };
            PageBottomButton.BASE_CSS_CLASS = "harman-ota-bottom-button";
            return PageBottomButton;
        })();
        UI.PageBottomButton = PageBottomButton;
        /**
         * 設定項目一覧UI
         */
        var SettingList = (function () {
            function SettingList() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            SettingList.create = function ($target) {
                var $ul = $("<ul></ul>");
                $ul.attr("data-role", "listview");
                $ul.addClass("harman-ota-setting-list");
                $target.append($ul);
                $target.attr("data-role", "fieldcontain");
                // 表示更新
                SettingList.refresh($target, true);
            };
            /**
             * データ追加（トグルボタン状態変化コールバックも指定可）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            SettingList.addItem = function ($target) {
                var $li = $("<li></li>");
                var $layout = $("<div></div>");
                var $labelLayout = $("<div></div>");
                var $labelText = $("<span></span>");
                var $buttonLayout = $("<div></div>");
                var $button = $("<div></div>");
                var $buttonClearFloat = $("<div></div>");
                $layout.addClass(SettingList.ROW_LAYOUT_CSS_CLASS);
                $labelLayout.addClass(SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS);
                $labelText.addClass(SettingList.ROW_LABEL_TEXT_CSS_CLASS);
                $buttonLayout.addClass(SettingList.ROW_TOGGLE_BUTTON_LAYOUT_CSS_CLASS);
                $button.addClass(SettingList.ROW_TOGGLE_BUTTON_BASE_CSS_CLASS);
                $buttonClearFloat.addClass(SettingList.ROW_TOGGLE_BUTTON_CLEAR_FLOAT_CSS_CLASS);
                ToggleButton.create($button);
                $labelLayout.append($labelText);
                $layout.append($buttonLayout);
                $layout.append($labelLayout);
                $buttonLayout.append($button);
                $buttonLayout.append($buttonClearFloat);
                $li.append($layout);
                $target.find(":jqmData(role=listview)").append($li);
                // 行タップ時にトグルボタンのON/OFF切り替えを動作させる
                $li.click(function (eventObject) {
                    ToggleButton.toggleButtonStatus($button);
                });
                // 表示更新
                SettingList.refresh($target, false);
                return $li;
            };
            /**
             * データ追加（トグルボタン状態変化コールバックも指定可） toggle button無し
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            SettingList.addItem_without_toggle = function ($target) {
                var $li = $("<li></li>");
                var $layout = $("<div></div>");
                var $labelLayout = $("<div></div>");
                var $labelText = $("<span></span>");
                var $buttonLayout = $("<div></div>");
                var $button = $("<div></div>");
                var $buttonClearFloat = $("<div></div>");
                $layout.addClass(SettingList.ROW_LAYOUT_CSS_CLASS);
//                $labelLayout.addClass(SettingList.ROW_LABEL_CSS_CLASS);
                $labelText.addClass(SettingList.ROW_LABEL_TEXT_CSS_CLASS);
                $buttonLayout.addClass(SettingList.ROW_TOGGLE_BUTTON_LAYOUT_CSS_CLASS);
                $button.addClass(SettingList.ROW_TOGGLE_BUTTON_BASE_CSS_CLASS);
                $buttonClearFloat.addClass(SettingList.ROW_TOGGLE_BUTTON_CLEAR_FLOAT_CSS_CLASS);
//                ToggleButton.create($button);
                $labelLayout.append($labelText);
                $layout.append($buttonLayout);
                $layout.append($labelLayout);
                $buttonLayout.append($button);
                $buttonLayout.append($buttonClearFloat);
                $li.append($layout);
                $target.find(":jqmData(role=listview)").append($li);
//                // 行タップ時にトグルボタンのON/OFF切り替えを動作させる
//                $li.click(function (eventObject) {
//                    ToggleButton.toggleButtonStatus($button);
//                });
                // 表示更新
                SettingList.refresh($target, false);
                return $li;
            };
            /**
             * データ削除
             * @param $item 削除対象行DOM要素（addItemで返却されるオブジェクト）
             */
            SettingList.removeItem = function ($item) {
                $item.remove();
            };
            /**
             * 行情報設定
             * @param $item 削除対象行DOM要素（addItemで返却されるオブジェクト）
             * @param info 設定情報（下記JSONで指定。nullの項目は無視する。）
             * {
             *     "label":[表示ラベル:string],
             *     "status":[トグルボタン状態:boolean],
             *     "showbutton":[トグルボタン表示:boolean],
             *     "rtl":[RTL有効/無効:boolean]
             * }
             */
            SettingList.setItemInfo = function ($item, info) {
                var $labelText = $item.find("." + SettingList.ROW_LABEL_TEXT_CSS_CLASS);
                if (info.label != null) {
                    $labelText.text(info.label);
                }
                if (info.status != null) {
                    SettingList.setButtonStatus($item, info.status);
                }
                if (info.showbutton != null) {
                    SettingList.setShowButton($item, info.showbutton);
                    if (info.showbutton) {
                        $labelText.parent().removeClass(SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS);
                    }
                    else {
                        $labelText.parent().addClass(SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS);
                    }
                }
                if (info.rtl != null) {
                    if (info.rtl) {
                        $labelText.addClass(UI.RTL_ALIGN_RIGHT_CLASS);
                    }
                    else {
                        $labelText.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
                    }
                }
            };
            /**
             * 行情報取得
             * @param $item 削除対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 設定情報（setItemInfoのinfoと同一形式のJSON）
             */
            SettingList.getItemInfo = function ($item) {
                var $labelText = $item.find("." + SettingList.ROW_LABEL_TEXT_CSS_CLASS);
                var info = {
                    "label": $labelText.text(),
                    "status": SettingList.getButtonStatus($item),
                    "showbutton": SettingList.getShowButton($item),
                    "rtl": $labelText.hasClass(UI.RTL_ALIGN_RIGHT_CLASS)
                };
                return info;
            };
            /**
             * データ行内のトグルボタンの状態変更コールバックを設定する
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param callback 状態変更コールバック
             */
            SettingList.setButtonStatusChangedCallback = function ($item, callback) {
                ToggleButton.setButtonStatusChangedCallback(SettingList.getToggleButton($item), callback);
            };
            /**
             * データ行内のトグルボタンの状態設定（ON/OFF設定）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isOn 状態（true:ON、false:OFF）
             */
            SettingList.setButtonStatus = function ($item, isOn) {
                ToggleButton.setButtonStatus(SettingList.getToggleButton($item), isOn);
            };
            /**
             * データ行内のトグルボタンの状態取得（ON/OFF取得）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 状態（true:ON、false:OFF）
             */
            SettingList.getButtonStatus = function ($item) {
                return ToggleButton.getButtonStatus(SettingList.getToggleButton($item));
            };
            /**
             * データ行内のトグルボタンの表示制御
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isShow 表示／非表示（true:表示、false:非表示）
             */
            SettingList.setShowButton = function ($item, isShow) {
                SettingList.getToggleButton($item).css("visibility", isShow ? "visible" : "hidden");
            };
            /**
             * データ行内のトグルボタンの表示状態取得（表示／非表示取得）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 表示／非表示（true:表示、false:非表示）
             */
            SettingList.getShowButton = function ($item) {
                return SettingList.getToggleButton($item).css("visibility") != "hidden";
            };
            /**
             * データ行内のトグルボタンを取得する
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 対象行内のトグルボタンDOM要素
             */
            SettingList.getToggleButton = function ($item) {
                return $item.find("." + SettingList.ROW_TOGGLE_BUTTON_BASE_CSS_CLASS);
            };
            /**
             * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
             */
            SettingList.refresh = function ($target, isInit) {
                $target.parents("div:jqmData(role=page)").page();
                $target.find(":jqmData(role=listview)").listview(isInit ? undefined : "refresh");
            };
            SettingList.ROW_LABEL_CSS_CLASS = "harman-ota-setting-list-label";
            SettingList.ROW_LABEL_TEXT_CSS_CLASS = "harman-ota-setting-list-label-text";
            SettingList.ROW_LAYOUT_CSS_CLASS = "harman-ota-setting-list-layout";
            SettingList.ROW_TOGGLE_BUTTON_LAYOUT_CSS_CLASS = "harman-ota-setting-list-toggle-button-layout";
            SettingList.ROW_TOGGLE_BUTTON_BASE_CSS_CLASS = "harman-ota-setting-list-toggle-button-base";
            SettingList.ROW_TOGGLE_BUTTON_CLEAR_FLOAT_CSS_CLASS = "harman-ota-setting-list-toggle-button-clear-float";
            SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS = "harman-ota-hide-toggle-button";
            return SettingList;
        })();
        UI.SettingList = SettingList;

        /**
         * 更新データ一覧UI
         */
        var UpdateList = (function () {
            function UpdateList() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            UpdateList.create = function ($target) {
                var $ul = $("<ul></ul>");
                $ul.attr("data-role", "listview");
                $ul.attr("data-dividertheme", "a");
                $ul.addClass(UpdateList.ROW_CSS_CLASS);
                $target.append($ul);
                $target.attr("data-role", "fieldcontain");
                // 表示更新
                UpdateList.refresh($target, true);
            };
            /**
             * カテゴリ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param categoryId カテゴリID（カテゴリ内で一意の文字列）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            UpdateList.addCategory = function ($target, categoryId) {
                var $li = $("<li></li>");
                $li.attr("data-role", "list-divider");
                $li.attr("category", categoryId);
                $target.find(":jqmData(role=listview)").append($li);
                $('.ui-li-divider').css({'height':'1.5em'});
                // 表示更新
                UpdateList.refresh($target, false);
                return $li;
            };
            /**
             * データ追加
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param categoryId カテゴリID（属するカテゴリの指定）
             * @param isAddTop true:最上部に追加 / false:行の末尾に追加（既定）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            UpdateList.addItem = function ($target, categoryId, isAddTop) {
                if (isAddTop == undefined || isAddTop == null) {
                    addTopFlg = false;
                } else {
                    addTopFlg = isAddTop;
                }

                // 構成要素を生成
                var $li = $("<li></li>");
                var $iconImg = $("<img></img>");
                var $iconImgRight = $("<img></img>");
                var $titleLayout = $("<h2></h2>");
                var $versionLayout = $("<p></p>");
                var $sizeLayout = $("<p></p>");
                var $titleLabel = $("<span></span>");
                var $titleValue = $("<span></span>");
                var $versionLabel = $("<span></span>");
                var $versionValue = $("<span></span>");
                var $sizeLabel = $("<span></span>");
                var $sizeValue = $("<span></span>");
                var $progressCircle = $("<div></div>");
                $iconImg.addClass(UpdateList.ROW_ICON_CSS_CLASS);
                $iconImgRight.addClass(UpdateList.ROW_ICON_RIGHT_CSS_CLASS);
                $titleLayout.addClass(UpdateList.ROW_TITLE_CSS_CLASS);
//                $versionLayout.addClass(UpdateList.ROW_VERSION_CSS_CLASS);
                $sizeLayout.addClass(UpdateList.ROW_SIZE_CSS_CLASS);
//                $titleLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
                $versionLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
                $sizeLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
                $titleValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
                $versionValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
                $sizeValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
                ProgressCircle.create($progressCircle);

                var comLayout = function() {
                    $li.append($iconImg);
                    $li.append($iconImgRight);
                    $li.append($titleLayout);
                    $li.append($versionLayout);
                    $li.append($sizeLayout);
                    $li.append($progressCircle);
                };

                if (UpdateList.USE_CHECK_BOX) {
                    var $buttonLayout = $("<div></div>");
                    var $button = $("<div></div>");
                    var $buttonClearFloat = $("<div></div>");

                    $buttonLayout.addClass(UpdateList.ROW_CHECK_BOX_LAYOUT_CSS_CLASS);
                    $button.addClass(UpdateList.ROW_CHECK_BOX_BASE_CSS_CLASS);
                    $buttonClearFloat.addClass(UpdateList.ROW_CHECK_BOX_CLEAR_FLOAT_CSS_CLASS);
                    UI.CheckBox.create($button);

                    $li.append($buttonLayout);
                    
                    comLayout();
    
                    $buttonLayout.append($button);
                    $buttonLayout.append($buttonClearFloat);
    
                    // 行タップ時にチェックkボックスのON/OFF切り替えを動作させる
                    $li.click(function (eventObject) {
                        UI.CheckBox.checkBoxStatus($button);              
                    });
     
                } else {
                    comLayout();
                }

                comLayout = null;
                
                $titleLayout.append($titleLabel);
                $titleLayout.append($titleValue);
                $versionLayout.append($versionLabel);
                $versionLayout.append($versionValue);
                $sizeLayout.append($sizeLabel);
                $sizeLayout.append($sizeValue);

                var $item = UpdateList.addItemObject($target, $li, categoryId, addTopFlg);    
                return $item;
            };
            /**
             * データ追加（行DOM要素を指定。データ削除時の再利用指定の際に使用。）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param categoryId カテゴリID（属するカテゴリの指定）
             * @param isAddTop true:最上部に追加 / false:行の末尾に追加（既定）
             * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
             */
            UpdateList.addItemObject = function ($target, $item, categoryId, isAddTop) {
                // 指定カテゴリの要素を取得
                var $categoryItems = $target.find("[category='" + categoryId + "']");
                // カテゴリ情報変更
                $item.attr("category", categoryId);

                if (isAddTop) {
                    // 一覧行の先頭に追加する
                    $target.find(":jqmData(role=listview)").prepend($item); 

                } else {
                    if ($categoryItems.length > 0) {
                        // 指定カテゴリが存在する場合
                        // 指定カテゴリに属する行の末尾に追加する
                        $($categoryItems[$categoryItems.length - 1]).after($item);
                    }
                    else {
                        // 一覧行の末尾に追加する
                        $target.find(":jqmData(role=listview)").append($item);
                    }
                }
                
                // 表示更新
                UpdateList.refresh($target, false);
                return $item;
            };

            /**
             * カテゴリ削除
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。
             * @param categoryId カテゴリID（削除対象カテゴリ指定）
             */
            UpdateList.removeCategory = function ($target, categoryId) {
                // 指定カテゴリの要素を取得
                $target.find("[category='" + categoryId + "']").remove();
                // 表示更新
                UpdateList.refresh($target, false);
            };
            /**
             * データ削除
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             */
            UpdateList.removeItem = function ($item) {
                UpdateList.removeItemObject($item, false);
            };
            /**
             * データ削除
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isReuse 再利用フラグ（true:DOM要素に設定したイベントを残す false:DOM要素に設定したイベントを含めて削除）
             */
            UpdateList.removeItemObject = function ($item, isReuse) {
                if (isReuse) {
                    $item.detach();
                }
                else {
                    $item.remove();
                }
                // 表示更新
                UpdateList.refresh($item.closest("div"), false);
            };
            /**
             * カテゴリ情報設定
             * @param $item 対象カテゴリDOM要素（addCategoryで返却されるオブジェクト）
             * @param info 設定情報（下記JSONで指定。nullの項目は無視する。）
             * {
             *     "label":[ラベル:string],
             *     "show":[表示:boolean],
             *     "rtl":[RTL有効/無効:boolean]
             * }
             */
            UpdateList.setCategoryInfo = function ($item, info) {
                if (info.label != null) {
                    $item.text(info.label);
                }
                if (info.show != null) {
                    $item.css("display", info.show ? "block" : "none");
                }
                if (info.rtl != null) {
                    if (info.rtl) {
                        $item.addClass(UI.RTL_ALIGN_RIGHT_CLASS);
                    }
                    else {
                        $item.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
                    }
                }
            };
            /**
             * カテゴリ情報取得
             * @param $item
             * @return 設定情報（setCategoryInfoのinfoど同一形式のJSON）
             */
            UpdateList.getCategoryInfo = function ($item) {
                var info = {
                    "label": $item.text(),
                    "show": !($item.css("display") == "none"),
                    "rtl": $item.hasClass(UI.RTL_ALIGN_RIGHT_CLASS)
                };
                return info;
            };

            /**
             * 行情報設定
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param info 設定情報（下記JSONで指定。nullの項目は無視する。）
             * {
             *     "title":{
             *         "label":[タイトルラベル:string],
             *         "value":[タイトル値:string]
             *     },
             *     "version":{
             *         "label":[バージョンラベル:string],
             *         "value":[バージョン値:string]
             *     },
             *     "size":{
             *         "label":[サイズラベル:string],
             *         "value":[サイズ値:string]
             *     },
             *     "icon":[アイコンタイプ:MAP_DATA_ICON_TYPE],
             *     "progress":[進捗率(0-100):number],
             *     "showprogress":[進捗率の表示／非表示:boolean],
             *     "category":[カテゴリID:string]
             *     "rtl":[RTL有効/無効:boolean]"
             * }
             */
            UpdateList.setItemInfo = function ($item, info) {

                // アイコン
                if (info.icon != null) {
                    var path = UpdateList.getItemIconPath(info.icon);
                    var $icon = UpdateList.getItemIcon($item);

                    if ($icon.attr("src") != path) {
                        $icon.attr("src", path);                        
                    }

                    var visibility = "visible";
                    if (path == "") {
                        visibility = "hidden";
                    }
                    if ($icon.css("visibility") != visibility) {
                        $icon.css("visibility", visibility);
                    }
                }

                // タイトル
                if (info.title != null) {
                    var $titleLayout = UpdateList.getItemTitle($item);
                    if (info.title.label != null) {
                        $titleLayout.$label.text(info.title.label);
                    }
                    if (info.title.value != null) {
                        $titleLayout.$value.text(info.title.value);
                    }
                }
                // バージョン
                if (info.version != null) {
                    var $versionLayout = UpdateList.getItemVersion($item);
                    if (info.version.label != null) {
                        $versionLayout.$label.text(info.version.label);
                    }
                    if (info.version.value != null) {
                        $versionLayout.$value.text(info.version.value);
                    }
                }
                // サイズ
                if (info.size != null) {
                    var $sizeLayout = UpdateList.getItemSize($item);
                    if (info.size.label != null) {
                        $sizeLayout.$label.text(info.size.label);
                    }
                    if (info.size.value != null) {
                        $sizeLayout.$value.text(info.size.value);
                    }
                }
                // 進捗率
                if (info.progress != null) {
                    UI.ProgressCircle.setProgressValue(UpdateList.getItemProgressCircle($item), info.progress);
                }
                // 進捗率表示
                if (info.showprogress != null) {
                    UpdateList.setItemShowProgressCircle($item, info.showprogress);
                    if (info.showprogress) {
                        // プログレス点滅設定
                        UI.ProgressCircle.setFlashProgressCircle($item, info.regionID);
                    } else {
                        // プログレス点滅設定
                        UI.ProgressCircle.stopFlashProgressCircle(info.regionID);                        
                    }
                }
                // カテゴリID
                if (info.category != null) {
                    if ($item.attr("category") != info.category) {
                        var $base = $item.parents(":jqmData(role=fieldcontain)");
                        UpdateList.removeItemObject($item, true);
                        UpdateList.addItemObject($base, $item, info.category);
                    }
                }
                // RTL
                if (info.rtl != null) {
                    var $titleLayout = UpdateList.getItemTitle($item);
                    var $versionLayout = UpdateList.getItemVersion($item);
                    var $sizeLayout = UpdateList.getItemSize($item);
                    if (info.rtl) {
                        // タイトルはラベル、値共にRTL有効
                        $titleLayout.$layout.addClass(UI.LTR_ALIGN_RIGHT_CLASS);
                        // バージョンはラベルのみRTL有効
                        $versionLayout.$layout.addClass(UI.RTL_ALIGN_RIGHT_CLASS);
                        $versionLayout.$value.addClass(UI.RTL_CANCEL_CLASS);
                        // サイズはラベルのみTRL有効
                        $sizeLayout.$layout.addClass(UI.RTL_ALIGN_RIGHT_CLASS);
                        $sizeLayout.$value.addClass(UI.RTL_CANCEL_CLASS);
                    }
                    else {
                        // タイトル
                        $titleLayout.$layout.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
                        // バージョン
                        $versionLayout.$layout.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
                        $versionLayout.$value.removeClass(UI.RTL_CANCEL_CLASS);
                        // サイズ
                        $sizeLayout.$layout.removeClass(UI.RTL_ALIGN_RIGHT_CLASS);
                        $sizeLayout.$value.removeClass(UI.RTL_CANCEL_CLASS);
                    }
                }
                UpdateList.setItemInfoAuto($item, info);
            };

            UpdateList.setItemInfoAuto = function ($item, info) {
                // DL済みの場合、かつ、進捗非表示の場合に削除アイコンを表示する
                var rightIconSrc = "";
                var iconType = UpdateList.getItemIconType(UpdateList.getItemIcon($item).attr("src"));
                var iconTypeRight = UpdateList.getItemIconType(UpdateList.getItemIconRight($item).attr("src"));
                var showprogress = UpdateList.getItemShowProgressCircle($item);

                if (info.reload && (iconTypeRight == MAP_DATA_ICON_TYPE.INSTALLING || iconTypeRight == MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD || iconTypeRight == MAP_DATA_ICON_TYPE.PRE_DOWNLOAD)) {
                    // リロードの場合は、条件に合致するアイコンの場合は更新しない
                    info.iconRight = iconTypeRight;
                }

                // 右アイコンの自動設定
                if (!showprogress) {

                    switch (+iconType) {
                        case MAP_DATA_ICON_TYPE.NOT_UPDATE:
                            // 削除アイコンを表示する
                            rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DELETE];
                            break;

                        case MAP_DATA_ICON_TYPE.NOT_DOWNLOAD:
                            if (iconTypeRight == MAP_DATA_ICON_TYPE.PRE_DOWNLOAD) {
//                              rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO];
                                rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.PRE_DOWNLOAD];
                            } else {
                                rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD];
                            }
                            break;

                        case MAP_DATA_ICON_TYPE.UPDATED:
                            rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE];
                            break;

                        case MAP_DATA_ICON_TYPE.DOWNLOADING:
                            rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DOWNLOADING];
                            break;

                        case MAP_DATA_ICON_TYPE.PRE_DOWNLOAD:
                            rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.PRE_DOWNLOAD];
                            break;

                        default:
                            break;
                    }
                }

                if (info.iconRight) {
                    rightIconSrc = UpdateList.getItemIconPath(info.iconRight);
                }

                if ((rightIconSrc == UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DELETE])  &&
                    (UI.callbacks.accessoryConnected() || UI.callbacks.downloading() || UI.callbacks.transferring())) {
                    // 車載接続中、または、DL中は、削除アイコンは表示しない
                    rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.NOT_DELETE];
                }

                if ((rightIconSrc == UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]) &&
                    (UI.callbacks.downloading())) {
                    // DL中は、ダウンロード操作アイコンは表示しない
                    rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DOWNLOADING];
                }

                if ((rightIconSrc == UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD]) &&
                    (UI.callbacks.transferring())) {
                    // 転送中は、ダウンロード操作アイコンは表示しない
                    rightIconSrc = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE];
                }

                if (UpdateList.getItemIconRight($item).attr("src") != rightIconSrc) {
                    UpdateList.getItemIconRight($item).attr("src", rightIconSrc);
                    // srcが未設定の場合、非表示とする（枠が表示されるため）
                    if (rightIconSrc == ""){
                        UpdateList.getItemIconRight($item).css("visibility", "hidden");
                    } else {
                        UpdateList.getItemIconRight($item).css("visibility", "visible");
                    }
                }
            };

            /**
             * 行情報取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return 設定情報（setItemInfoのinfoど同一形式のJSON）
             */
            UpdateList.getItemInfo = function ($item) {
                var $icon = UpdateList.getItemIcon($item);
                var $titleLayout = UpdateList.getItemTitle($item);
                var $versionLayout = UpdateList.getItemVersion($item);
                var $sizeLayout = UpdateList.getItemSize($item);
                var $progress = UpdateList.getItemProgressCircle($item);
                var info = {
                    "title": {
                        "label": $titleLayout.$label.text(),
                        "value": $titleLayout.$value.text()
                    },
                    "version": {
                        "label": $versionLayout.$label.text(),
                        "value": $versionLayout.$value.text()
                    },
                    "size": {
                        "label": $sizeLayout.$label.text(),
                        "value": $sizeLayout.$value.text()
                    },
                    "icon": UpdateList.getItemIconType($icon.attr("src")),
                    "progress": ProgressCircle.getProgressValue($progress),
                    "showprogress": UpdateList.getItemShowProgressCircle($item),
                    "category": $item.attr("category"),
                    "rtl": $titleLayout.$label.hasClass(UI.RTL_CLASS)
                };
                return info;
            };
            /**
             * データ行内のアイコンリソースパス取得
             * @param iconType アイコン種類
             * @return アイコンリソースパス
             */
            UpdateList.getItemIconPath = function (iconType) {
                var path = UpdateList.ICON_INFO.PATH[iconType];
                if (path == undefined) {
                    path = UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.NOT_DOWNLOAD];
                }
                return path;
            };
            /**
             * データ行内のアイコンリソース種類取得
             * @param path アイコンリソースパス
             * @return アイコン種類
             */
            UpdateList.getItemIconType = function (path) {
                var iconType = UpdateList.ICON_INFO.TYPE[path];
                if (iconType == undefined) {
                    iconType = MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                }
                return iconType;
            };

            /**
             * データ行内のアイコンDOM要素取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return アイコンDOM要素（jQueryオブジェクトとして返却）
             */
            UpdateList.getItemIcon = function ($item) {
                var $icon = $item.find("." + UpdateList.ROW_ICON_CSS_CLASS);
                return $icon;
            };
            UpdateList.getItemIconRight = function ($item) {
                var $icon = $item.find("." + UpdateList.ROW_ICON_RIGHT_CSS_CLASS);
                return $icon;
            };
            /**
             * データ行内のタイトルDOM要素取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return タイトルの構成DOM要素（下記JSON形式で返却）
             * {
             *     "$layout":[レイアウト要素:JQuery]
             *     "$label":[ラベル要素:JQuery],
             *     "$value":[値要素:JQuery]
             * }
             */
            UpdateList.getItemTitle = function ($item) {
                var $title = $item.find("." + UpdateList.ROW_TITLE_CSS_CLASS);
                return {
                    "$layout": $title,
                    "$label": $title.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                    "$value": $title.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
                };
            };
            /**
             * データ行内のバージョンDOM要素取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return タイトルの構成DOM要素（下記JSON形式で返却）
             * {
             *     "$layout":[レイアウト要素:JQuery]
             *     "$label":[ラベル要素:JQuery],
             *     "$value":[値要素:JQuery]
             * }
             */
            UpdateList.getItemVersion = function ($item) {
                var $version = $item.find("." + UpdateList.ROW_VERSION_CSS_CLASS);
                return {
                    "$layout": $version,
                    "$label": $version.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                    "$value": $version.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
                };
            };
            /**
             * データ行内のサイズDOM要素取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return タイトルの構成DOM要素（下記JSON形式で返却）
             * {
             *     "$layout":[レイアウト要素:JQuery]
             *     "$label":[ラベル要素:JQuery],
             *     "$value":[値要素:JQuery]
             * }
             */
            UpdateList.getItemSize = function ($item) {
                var $size = $item.find("." + UpdateList.ROW_SIZE_CSS_CLASS);
                return {
                    "$layout": $size,
                    "$label": $size.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                    "$value": $size.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
                };
            };
            /**
             * データ行内のプログレスサークルDOM取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return プログレスサークルDOM要素（jQueryオブジェクトとして返却）
             */
            UpdateList.getItemProgressCircle = function ($item) {
                var $progress = $item.find("." + ProgressCircle.BASE_CSS_CLASS);
                return $progress;
            };
            /**
             * データ行内のプログレスサークルの表示／非表示設定
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param isShow 表示／非表示（true:表示、false:非表示）
             */
            UpdateList.setItemShowProgressCircle = function ($item, isShow) {
                var $progress = UpdateList.getItemProgressCircle($item);
                $progress.css("visibility", isShow ? "visible" : "hidden");
            };
            /**
             * データ行内のプログレスサークルの表示／非表示状態を取得
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @return isShow 表示／非表示（true:表示、false:非表示）
             */
            UpdateList.getItemShowProgressCircle = function ($item) {
                var $progress = UpdateList.getItemProgressCircle($item);
                return $progress.css("visibility") != "hidden";
            };

            UpdateList.setClickedCallback = function ($target, data, callback) {
                $target.off("click");
                $target.click(function (eventObject) {
                    if (callback != null) {
                        callback($target, data);
                    }
                });
            };

            /**
             * データ行内の右側アイコンのクリックコールバックを設定する
             * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
             * @param callback 状態変更コールバック
             */
            UpdateList.seticonRightClickedCallback = function ($target, data, callback) {
                var $iconRight = UpdateList.getItemIconRight($target);
                $iconRight.click(function (eventObject) {
                    if (callback != null) {
                        eventObject.stopPropagation();//イベントバブリング停止　親にイベントを伝えない親不孝実装
                        callback($target, data);
                    }
                });
            };


            /**
             * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
             */
            UpdateList.refresh = function ($target, isInit) {
                var $page = $target.parents("div:jqmData(role=page)");
                $page.page();
                var $listview = $target.find(":jqmData(role=listview)");
                $listview.listview(isInit ? undefined : "refresh");
            };

            UpdateList.setupIconInfoType = function () {
                UpdateList.ICON_INFO.TYPE = {};
                for (var key in UpdateList.ICON_INFO.PATH) {
                    var value = UpdateList.ICON_INFO.PATH[key];
                    UpdateList.ICON_INFO.TYPE[value] = key;
                }
            };

            //ページunload時にプログレス点滅timerをクリアするイベントを設定
            $(window).unload(function(){
                UI.ProgressCircle.stopFlashProgressCircle(null); //全regionぶん
            });

            UpdateList.USE_CHECK_BOX = false;
            UpdateList.ROW_CSS_CLASS = "harman-ota-upd-data-list";
            UpdateList.ROW_ICON_CSS_CLASS = "harman-ota-upd-list_icon";
            UpdateList.ROW_ICON_RIGHT_CSS_CLASS = "harman-ota-upd-list_icon_right";
            UpdateList.ROW_TITLE_CSS_CLASS = "harman-ota-upd-list-title";
            UpdateList.ROW_VERSION_CSS_CLASS = "harman-ota-upd-list-version";
            UpdateList.ROW_SIZE_CSS_CLASS = "harman-ota-upd-list-size";
            UpdateList.ROW_LABEL_CSS_CLASS = "harman-ota-upd-list-label";
            UpdateList.ROW_VALUE_CSS_CLASS = "harman-ota-upd-list-value";

            UpdateList.ROW_CHECK_BOX_BASE_CSS_CLASS = "harman-ota-region-list-check-box-base";
            UpdateList.ROW_CHECK_BOX_CLEAR_FLOAT_CSS_CLASS = "harman-ota-region-list-check-box-clear-float";
            UpdateList.ROW_HIDE_CHECK_BOX_CSS_CLASS = "harman-ota-hide-check-box";

            UpdateList.ICON_INFO = {};
            UpdateList.ICON_INFO.PATH = {};
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.NOT_DOWNLOAD] = "./images/huupd_list_icon_a.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.NOT_UPDATE] = "./images/huupd_list_icon_b.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.INSTALLING] = "./images/arrow42-014.gif";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATED] = "./images/huupd_list_icon_c.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DELETE] = "./images/Downloaded_in_mobile.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_UNACTIVE] = "./images/Updated_2.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.DOWNLOADING] = "./images/downloading.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_CAN_DOWNLOAD] = "./images/Update_available.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.UPDATEINFO_CANNOT_DOWNLOAD] = "./images/Updated.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.NOT_DELETE] = "./images/not_delete.png";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.HIDDEN] = "";
            UpdateList.ICON_INFO.PATH[MAP_DATA_ICON_TYPE.PRE_DOWNLOAD] = "./images/pre_download.gif";

            UpdateList.setupIconInfoType();

            return UpdateList;
        })();
        UI.UpdateList = UpdateList;
        
        /**
         * チェックボックスUI
         */
        var CheckBox = (function () {
            function CheckBox() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            CheckBox.create = function ($target) {
                var $checkbox = $("<input>");
                var $label = $("<label></label>");
                $checkbox.attr("type", "checkbox");
                $checkbox.attr("data-role", "none");
                $checkbox.addClass(CheckBox.BASE_CSS_CLASS);
                $label.attr("data-role", "none");
                $target.append($checkbox);
                $target.append($label);
                // DIV要素タップ時にON/OFF切り替えを動作させる
                $target.click(function (eventObject) {
                    $checkbox.click();
                    // 親へのイベント伝播を停止する
                    // （listview行内に配置して行のクリックと連動させる場合に、これがないと多重動作となる）
                    eventObject.stopPropagation();
                });
            };
            /**
             * 状態（ON/OFF）設定
             * @param $taget 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param isOn 状態（true:ON、false:OFF）
             */
            CheckBox.setButtonStatus = function ($target, isOn) {
                $target.find("input:first").prop("checked", isOn);
            };
            /**
             * 状態（ON/OFF）取得
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @return 状態（true:ON、false:OFF）
             */
            CheckBox.getButtonStatus = function ($target) {
                return $target.find("input:first").prop("checked");
            };
            /**
             * 状態（ON/OFF）トグル
             */
            CheckBox.checkBoxStatus = function ($target) {
                $target.find("input:first").click();
            };
            /**
             * 状態変更コールバック設定
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             * @param callback 状態変更コールバック
             */
            CheckBox.setButtonStatusChangedCallback = function ($target, keys, callback) {
                var $checkbox = $target.find("input:first");
                $checkbox.click(function (eventObject) {
                    if (callback != null) {
                        callback($target, $checkbox.prop("checked"), keys);
                    }
                });
            };
            CheckBox.BASE_CSS_CLASS = "harman-ota-check-box";
            return CheckBox;
        })();
        UI.CheckBox = CheckBox;

        /**
         * アラートUI
         */
        var Alert = (function () {
            function Alert() {
            }
            /**
             * アラート
             */
            Alert.alert = function (message) {
                // アラート表示用のiframeを作成
                var targetWindow = Alert.createBaseFrame();
                // アラートを表示
                targetWindow.alert(message);
                // アラート表示用のiframeを削除
                Alert.removeBaseFrame();
            };
            /**
             * 確認アラート
             */
            Alert.confirmAlert = function (message) {
                // アラート表示用のiframeを作成
                var targetWindow = Alert.createBaseFrame();
                // アラートを表示
                var result = targetWindow.confirm(message);
                // アラート表示用のiframeを削除
                Alert.removeBaseFrame();
                return result;
            };
            /**
             * アラート用iframeを作成する
             * @return アラート表示用iframeのwindow
             */
            Alert.createBaseFrame = function () {
                // 重複しないように削除する
                Alert.removeBaseFrame();
                // アラート用のiframeを生成し、そのiframeのwindowを返却する
                var $frame = $("<iframe></iframe>");
                $frame.attr("src", "data:text/plain");
                $frame.attr("id", Alert.baseFrameID);
                $("body").append($frame);
                return window.frames[0].window;
            };
            /**
             * アラート用iframeを削除する
             */
            Alert.removeBaseFrame = function () {
                var $frame = $("#" + Alert.baseFrameID);
                $frame.remove();
            };
            Alert.baseFrameID = "harmanota_baseframe";
            return Alert;
        })();
        UI.Alert = Alert;

        /**
         * ヘルプ画面画像表示UI
         */
        var Image = (function () {
            function Image() {
            }
            /**
             * UI生成
             * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
             */
            Image.createImage = function ($target, pageId) {
                var $image = $("<img></img>");
                var path = null;

                switch (pageId) {
                    case "help_list":
                        path = "./images/image_heip.png";
                        break;
                    case "license":
                        path =  "./images/TomTomLogo.png";
                        break;
                };

                $image.addClass(Image.IMAGE_CSS_CLASS);
                $image.attr("src", path);
                $target.append($image);
            };

            Image.IMAGE_CSS_CLASS = "harman-ota-image";
            return Image;
        })();
        UI.Image = Image;

    })(UI = HarmanOTA.UI || (HarmanOTA.UI = {}));
})(HarmanOTA || (HarmanOTA = {}));
//# sourceMappingURL=harman_ota_ui.js.map