/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile.d.ts" />
/// <reference path="jquerymobile_exp.d.ts" />

module HarmanOTA.UI{
    export enum MAP_DATA_ICON_TYPE{NOT_DOWNLOAD, NOT_UPDATE, UPDATED};
    export var RTL_CLASS:string = "rtl";
    export var RTL_ALIGN_RIGHT_CLASS:string = "rtl-align-right";
    export var RTL_CANCEL_CLASS:string = "rtl-cancel";
    export var RTL_CTRL:string = "&rlm;";

    /**
     * プログレスサークルUI
     */
    export class ProgressCircle {
        static BASE_CSS_CLASS:string = "harman-ota-progress-circle";
        static SVG_BASE_CSS_CLASS:string = "progress-circle";
        static SVG_BG_CSS_CLASS:string = "bg";
        static SVG_CENTER_CSS_CLASS:string = "center";
        static SVG_PROGRESS_CSS_CLASS:string = "progress";

        /**
         * UI生成
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         */
        public static create($target:JQuery){
            var svg:any = window.document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS(null, 'version', '1.1')
            svg.setAttribute("class", ProgressCircle.SVG_BASE_CSS_CLASS);
            svg.setAttribute("width", "43px");
            svg.setAttribute("height", "43px");

            var circleBg:any = window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circleBg.setAttribute("class", ProgressCircle.SVG_BG_CSS_CLASS);
            circleBg.setAttribute("r", "20");
            circleBg.setAttribute("cx", "21.5");
            circleBg.setAttribute("cy", "21.5");
            circleBg.setAttribute("stroke-width", "3");
            circleBg.setAttribute("fill", "none");
            svg.appendChild(circleBg);

            var circleCenter:any = window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circleCenter.setAttribute("class", ProgressCircle.SVG_CENTER_CSS_CLASS);
            circleCenter.setAttribute("r", "10");
            circleCenter.setAttribute("cx", "21.5");
            circleCenter.setAttribute("cy", "21.5");
            svg.appendChild(circleCenter);
            
            var circleProgress:any = window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circleProgress.setAttribute("class", ProgressCircle.SVG_PROGRESS_CSS_CLASS);
            circleProgress.setAttribute("r", "20");
            circleProgress.setAttribute("cx", "21.5");
            circleProgress.setAttribute("cy", "21.5");
            circleProgress.setAttribute("transform", "rotate(-90, 21.5, 21.5)");
            circleProgress.setAttribute("stroke-width", "3");
            circleProgress.setAttribute("fill", "none");
            circleProgress.setAttribute("stroke-dasharray", "126");   // 円周を設定（半径*2*3.14）
            circleProgress.setAttribute("stroke-dashoffset", "126");  // 円周に対する非表示割合を設定（例：円周が126、この値が12.6で90%[(1-(12.6/126))*100]）
            svg.appendChild(circleProgress);
            
            $target.addClass(ProgressCircle.BASE_CSS_CLASS);
            $target.append(svg);
        }

        /**
         * 進捗率設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param progress 進捗率（0-100）
         */
        public static setProgressValue($target:any, progress:number){
            var $progressCircle:JQuery = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
            var circumference:number = +$progressCircle.attr("stroke-dasharray");
            $progressCircle.attr("stroke-dashoffset", circumference - (circumference * (progress / 100)));
        }

        /**
         * 進捗率取得
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @return 進捗率（0-100）
         */
        public static getProgressValue($target:any):number{
            var $progressCircle:JQuery = $target.find("svg circle." + ProgressCircle.SVG_PROGRESS_CSS_CLASS);
            var circumference:number = +$progressCircle.attr("stroke-dashoarray");
            var progress:number = +$progressCircle.attr("stroke-dashoffset");
            return progress / circumference * 100;
        }
    }

    /**
     * トグルボタンUI
     */
    export class ToggleButton {
        static BASE_CSS_CLASS:string = "harman-ota-toggle-button";

        /**
         * UI生成
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         */
        public static create($target:JQuery){
            var $checkbox:JQuery = $("<input>");
            var $label:JQuery = $("<label></label>");

            $checkbox.attr("type", "checkbox");
            $checkbox.attr("data-role", "none");
            $checkbox.addClass(ToggleButton.BASE_CSS_CLASS);

            $label.attr("data-role", "none");

            $target.append($checkbox);
            $target.append($label);
            
            // DIV要素タップ時にON/OFF切り替えを動作させる
            $target.click((eventObject: JQueryEventObject):any => {
                $checkbox.click();

                // 親へのイベント伝播を停止する
                // （listview行内に配置して行のクリックと連動させる場合に、これがないと多重動作となる）
                eventObject.stopPropagation();
            });
        }

        /**
         * 状態（ON/OFF）設定
         * @param $taget 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param isOn 状態（true:ON、false:OFF）
         */
        public static setButtonStatus($target:JQuery, isOn:boolean){
            $target.find("input:first").prop("checked", isOn);
        }

        /**
         * 状態（ON/OFF）取得
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @return 状態（true:ON、false:OFF）
         */
        public static getButtonStatus($target:JQuery):boolean{
            return $target.find("input:first").prop("checked");
        }

        /**
         * 状態（ON/OFF）トグル
         */
        public static toggleButtonStatus($target:JQuery){
            $target.find("input:first").click();
        }

        /**
         * 状態変更コールバック設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param callback 状態変更コールバック
         */
        public static setButtonStatusChangedCallback($target:JQuery, callback:($target:JQuery, isOn:boolean)=>void){
            var $checkbox:JQuery = $target.find("input:first");
            $checkbox.click((eventObject: JQueryEventObject):any => {
                if(callback != null){
                    callback($target, $checkbox.prop("checked"));
                }
            });
        }
    }

    /**
     * ページ下端ボタン（スクロール固定）UI
     */
    export class PageBottomButton {
        static BASE_CSS_CLASS:string = "harman-ota-bottom-button";

        /**
         * UI生成
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         */
        public static create($target:JQuery){
            var $p:JQuery = $("<p></p>");
            $p.attr("data-role", "none");

            $target.addClass(PageBottomButton.BASE_CSS_CLASS);
            $target.append($p);
        }

        /**
         * 有効／無効設定（無効時はハッチング）
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param enabled 有効／無効設定（true:有効、false:無効）
         */
        public static setEnabled($target:JQuery, enabled:boolean){
            $target.attr("enabled", enabled ? "true" : "false");
        }

        /**
         * 表示ラベル設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param label 表示ラベル
         */
        public static setLabel($target:JQuery, label:string){
            $target.find("p:first").text(label);
        }

        /**
         * 表示ラベル取得
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @return 表示ラベル
         */
        public static getLabel($target:JQuery):string{
            return $target.find("p:first").text();
        }

        /**
         * RTL有効/無効設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param enabled 有効/無効
         */
        public static setEnabledRtl($target:JQuery, enabled:boolean){
            var $label = $target.find("p:first");
            if(enabled){
                $label.addClass(RTL_CLASS);
            }else{
                $label.removeClass(RTL_CLASS);
            }
        }

        /**
         * RTL有効/無効取得
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @return 有効/無効
         */
        public static getEnabledRtl($target:JQuery):boolean{
            return $target.find("p:first").hasClass(RTL_CLASS);
        }

        /**
         * 状態変更コールバック設定
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param callback 状態変更コールバック
         */
        public static setClickedCallback($target:JQuery, callback:($target:JQuery)=>void){
            $target.click((eventObject: JQueryEventObject):any => {
                if(callback != null){
                    callback($target);
                }
            });
        }
    }

    /**
     * 設定項目一覧UI
     */
    export class SettingList {
        static ROW_LABEL_CSS_CLASS:string = "harman-ota-setting-list-label";
        static ROW_LABEL_TEXT_CSS_CLASS:string = "harman-ota-setting-list-label-text";
        static ROW_LAYOUT_CSS_CLASS:string = "harman-ota-setting-list-layout";
        static ROW_TOGGLE_BUTTON_LAYOUT_CSS_CLASS:string = "harman-ota-setting-list-toggle-button-layout";
        static ROW_TOGGLE_BUTTON_BASE_CSS_CLASS:string = "harman-ota-setting-list-toggle-button-base";
        static ROW_TOGGLE_BUTTON_CLEAR_FLOAT_CSS_CLASS:string = "harman-ota-setting-list-toggle-button-clear-float";
        static ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS:string = "harman-ota-hide-toggle-button";

        /**
         * UI生成
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         */
        public static create($target:JQuery){
            var $ul:JQuery = $("<ul></ul>");
            $ul.attr("data-role", "listview");
            $ul.addClass("harman-ota-setting-list");
            
            $target.append($ul);
            $target.attr("data-role", "fieldcontain");

            // 表示更新
            SettingList.refresh($target, true);
        }

        /**
         * データ追加（トグルボタン状態変化コールバックも指定可）
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
         */
        public static addItem($target:JQuery):JQuery{
            var $li:JQuery = $("<li></li>");
            var $layout:JQuery = $("<div></div>");
            var $labelLayout:JQuery = $("<div></div>");
            var $labelText:JQuery = $("<span></span>");
            var $buttonLayout:JQuery = $("<div></div>");
            var $button:JQuery = $("<div></div>");
            var $buttonClearFloat:JQuery =$("<div></div>");

            $layout.addClass(SettingList.ROW_LAYOUT_CSS_CLASS);
            $labelLayout.addClass(SettingList.ROW_LABEL_CSS_CLASS);
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
            $li.click((eventObject: JQueryEventObject):any => {
                ToggleButton.toggleButtonStatus($button);
            });

            // 表示更新
            SettingList.refresh($target, false);
                        
            return $li;
        }

        /**
         * データ削除
         * @param $item 削除対象行DOM要素（addItemで返却されるオブジェクト）
         */
        public static removeItem($item:JQuery){
            $item.remove();
        }

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
        public static setItemInfo($item:JQuery, info:any){
            var $labelText = $item.find("." + SettingList.ROW_LABEL_TEXT_CSS_CLASS);
            if(info.label != null){
                $labelText.text(info.label);
            }
            if(info.status != null){
                SettingList.setButtonStatus($item, info.status);
            }
            if(info.showbutton != null){
                SettingList.setShowButton($item, info.showbutton);
                if(info.showbutton){
                    $labelText.parent().removeClass(SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS);
                }else{
                    $labelText.parent().addClass(SettingList.ROW_HIDE_TOGGLE_BUTTON_CSS_CLASS);
                }
            }
            if(info.rtl != null){
                if(info.rtl){
                    $labelText.addClass(RTL_ALIGN_RIGHT_CLASS);
                }else{
                    $labelText.removeClass(RTL_ALIGN_RIGHT_CLASS);
                }
            }
        }

        /**
         * 行情報取得
         * @param $item 削除対象行DOM要素（addItemで返却されるオブジェクト）
         * @return 設定情報（setItemInfoのinfoと同一形式のJSON） 
         */
        public static getItemInfo($item:JQuery):any{
            var $labelText = $item.find("." + SettingList.ROW_LABEL_TEXT_CSS_CLASS);
            var info:any = {
                "label":$labelText.text(),
                "status":SettingList.getButtonStatus($item),
                "showbutton":SettingList.getShowButton($item),
                "rtl":$labelText.hasClass(RTL_ALIGN_RIGHT_CLASS)
            };
            return info;
        }

        /**
         * データ行内のトグルボタンの状態変更コールバックを設定する
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param callback 状態変更コールバック
         */
        public static setButtonStatusChangedCallback($item:JQuery, callback:($target:JQuery, isOn:boolean)=>void){
            ToggleButton.setButtonStatusChangedCallback(SettingList.getToggleButton($item), callback);
        }

        /**
         * データ行内のトグルボタンの状態設定（ON/OFF設定）
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param isOn 状態（true:ON、false:OFF）
         */
        private static setButtonStatus($item:JQuery, isOn:boolean){
            ToggleButton.setButtonStatus(SettingList.getToggleButton($item), isOn);
        }

        /**
         * データ行内のトグルボタンの状態取得（ON/OFF取得）
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return 状態（true:ON、false:OFF）
         */
        private static getButtonStatus($item:JQuery):boolean{
            return ToggleButton.getButtonStatus(SettingList.getToggleButton($item));
        }

        /**
         * データ行内のトグルボタンの表示制御
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param isShow 表示／非表示（true:表示、false:非表示）
         */
        private static setShowButton($item:JQuery, isShow:boolean){
            SettingList.getToggleButton($item).css("visibility", isShow ? "visible" : "hidden");
        }

        /**
         * データ行内のトグルボタンの表示状態取得（表示／非表示取得）
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return 表示／非表示（true:表示、false:非表示）
         */
        private static getShowButton($item:JQuery):boolean{
            return SettingList.getToggleButton($item).css("visibility") != "hidden";
        }

        /**
         * データ行内のトグルボタンを取得する
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return 対象行内のトグルボタンDOM要素
         */
        private static getToggleButton($item:JQuery):JQuery{
            return $item.find("." + SettingList.ROW_TOGGLE_BUTTON_BASE_CSS_CLASS);
        }

        /**
         * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
         */
        private static refresh($target:JQuery, isInit:boolean){
            $target.parents("div:jqmData(role=page)").page();
            $target.find(":jqmData(role=listview)").listview(isInit ? undefined : "refresh");
        }
    }

    /**
     * 更新データ一覧UI
     */
    export class UpdateList {
        static ROW_ICON_CSS_CLASS:string = "harman-ota-upd-list_icon";
        static ROW_TITLE_CSS_CLASS:string = "harman-ota-upd-list-title";
        static ROW_VERSION_CSS_CLASS:string = "harman-ota-upd-list-version";
        static ROW_SIZE_CSS_CLASS:string = "harman-ota-upd-list-size";
        static ROW_LABEL_CSS_CLASS:string = "harman-ota-upd-list-label";
        static ROW_VALUE_CSS_CLASS:string = "harman-ota-upd-list-value";
        static ICON_PATH_NOT_DOWNLOAD:string = "./images/huupd_list_icon_a.png";
        static ICON_PATH_NOT_UPDATE:string = "./images/huupd_list_icon_b.png";
        static ICON_PATH_UPDATED:string = "./images/huupd_list_icon_c.png";

        /**
         * UI生成
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         */
        public static create($target:JQuery){
            var $ul:JQuery = $("<ul></ul>");
            $ul.attr("data-role", "listview");
            $ul.attr("data-dividertheme", "a");
            $ul.addClass("harman-ota-upd-data-list");
            
            $target.append($ul);
            $target.attr("data-role", "fieldcontain");

            // 表示更新
            UpdateList.refresh($target, true);
        }

        /**
         * カテゴリ追加
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param categoryId カテゴリID（カテゴリ内で一意の文字列）
         * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
         */
        public static addCategory($target:JQuery, categoryId:string):JQuery{
            var $li:JQuery = $("<li></li>");
            $li.attr("data-role","list-divider");
            $li.attr("category", categoryId);

            $target.find(":jqmData(role=listview)").append($li);

            // 表示更新
            UpdateList.refresh($target, false);
            
            return $li;
        }

        /**
         * データ追加
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param categoryId カテゴリID（属するカテゴリの指定）
         * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
         */
        public static addItem($target:JQuery, categoryId:string):JQuery{
            // 構成要素を生成
            var $li:JQuery = $("<li></li>");
            var $iconImg:JQuery = $("<img></img>");
            var $titleLayout:JQuery = $("<h2></h2>");
            var $versionLayout:JQuery = $("<p></p>");
            var $sizeLayout:JQuery = $("<p></p>");
            var $titleLabel:JQuery = $("<span></span>");
            var $titleValue:JQuery = $("<span></span>");
            var $versionLabel:JQuery = $("<span></span>");
            var $versionValue:JQuery = $("<span></span>");
            var $sizeLabel:JQuery = $("<span></span>");
            var $sizeValue:JQuery = $("<span></span>");
            var $progressCircle:JQuery = $("<div></div>");
            
            $iconImg.addClass(UpdateList.ROW_ICON_CSS_CLASS);
            $titleLayout.addClass(UpdateList.ROW_TITLE_CSS_CLASS);
            $versionLayout.addClass(UpdateList.ROW_VERSION_CSS_CLASS);
            $sizeLayout.addClass(UpdateList.ROW_SIZE_CSS_CLASS);
            $titleLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
            $versionLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
            $sizeLabel.addClass(UpdateList.ROW_LABEL_CSS_CLASS);
            $titleValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
            $versionValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
            $sizeValue.addClass(UpdateList.ROW_VALUE_CSS_CLASS);
            ProgressCircle.create($progressCircle);

            $li.append($iconImg);
            $li.append($titleLayout);
            $li.append($versionLayout);
            $li.append($sizeLayout);
            $li.append($progressCircle);
            $titleLayout.append($titleLabel);
            $titleLayout.append($titleValue);
            $versionLayout.append($versionLabel);
            $versionLayout.append($versionValue);
            $sizeLayout.append($sizeLabel);
            $sizeLayout.append($sizeValue);

            var $item:JQuery = UpdateList.addItemObject($target, $li, categoryId);

            return $item;
        }

        /**
         * データ追加（行DOM要素を指定。データ削除時の再利用指定の際に使用。）
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param categoryId カテゴリID（属するカテゴリの指定）
         * @return 追加した行DOM要素（jQueryオブジェクトとして渡す。）
         */
        private static addItemObject($target:JQuery, $item:JQuery, categoryId):JQuery{
            // 指定カテゴリの要素を取得
            var $categoryItems = $target.find("[category='" + categoryId + "']");

            // カテゴリ情報変更
            $item.attr("category", categoryId);

            if($categoryItems.length > 0){
                // 指定カテゴリが存在する場合
                // 指定カテゴリに属する行の末尾に追加する
                $($categoryItems[$categoryItems.length - 1]).after($item);
            }else{
                // 指定カテゴリが存在する場合
                // 一覧行の末尾に追加する
                $target.find(":jqmData(role=listview)").append($item);
            }

            // 表示更新
            UpdateList.refresh($target, false);

            return $item;
        }

        /**
         * カテゴリ削除
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。
         * @param categoryId カテゴリID（削除対象カテゴリ指定）
         */
        public static removeCategory($target:JQuery, categoryId:string){
            // 指定カテゴリの要素を取得
            $target.find("[category='" + categoryId + "']").remove();

            // 表示更新
            UpdateList.refresh($target, false);
        }

        /**
         * データ削除
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         */
        public static removeItem($item:JQuery){
            UpdateList.removeItemObject($item, false);
        }

        /**
         * データ削除
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param isReuse 再利用フラグ（true:DOM要素に設定したイベントを残す false:DOM要素に設定したイベントを含めて削除）
         */
        private static removeItemObject($item:JQuery, isReuse:boolean){
            if(isReuse){
                $item.detach();
            }else{
                $item.remove();
            }

            // 表示更新
            UpdateList.refresh($item.closest("div"), false);
        }

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
        public static setCategoryInfo($item:JQuery, info:any){
            if(info.label != null){
                $item.text(info.label);
            }
            if(info.show != null){
                $item.css("display", info.show ? "block" : "none");
            }
            if(info.rtl != null){
                if(info.rtl){
                    $item.addClass(RTL_ALIGN_RIGHT_CLASS);
                }else{
                    $item.removeClass(RTL_ALIGN_RIGHT_CLASS);
                }
            }
        }

        /**
         * カテゴリ情報取得
         * @param $item
         * @return 設定情報（setCategoryInfoのinfoど同一形式のJSON）
         */
        public static getCategoryInfo($item:JQuery):any{
            var info:any = {
                "label":$item.text(),
                "show":!($item.css("display") == "none"),
                "rtl":$item.hasClass(RTL_ALIGN_RIGHT_CLASS)
            };

            return info;
        }

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
        public static setItemInfo($item:JQuery, info:any){
            // アイコン
            if(info.icon != null){
                UpdateList.getItemIcon($item).attr("src", UpdateList.getItemIconPath(info.icon));
            }
            // タイトル
            if(info.title != null){
                var $titleLayout:any = UpdateList.getItemTitle($item);
                if(info.title.label != null){
                    $titleLayout.$label.text(info.title.label);
                }
                if(info.title.value != null){
                    $titleLayout.$value.text(info.title.value);
                }
            }
            // バージョン
            if(info.version != null){
                var $versionLayout:any = UpdateList.getItemVersion($item);
                if(info.version.label != null){
                    $versionLayout.$label.text(info.version.label);
                }
                if(info.version.value != null){
                    $versionLayout.$value.text(info.version.value);
                }
            }
            // サイズ
            if(info.size != null){
                var $sizeLayout = UpdateList.getItemSize($item);
                if(info.size.label != null){
                    $sizeLayout.$label.text(info.size.label);
                }
                if(info.size.value != null){
                    $sizeLayout.$value.text(info.size.value);
                }
            }
            // 進捗率
            if(info.progress != null){
                ProgressCircle.setProgressValue(UpdateList.getItemProgressCircle($item), info.progress);
            }
            // 進捗率表示
            if(info.showprogress != null){
                UpdateList.setItemShowProgressCircle($item, info.showprogress);
            }
            // カテゴリID
            if(info.category != null){
                if($item.attr("category") != info.category){
                    var $base:JQuery = $item.parents(":jqmData(role=fieldcontain)");
                    UpdateList.removeItemObject($item, true);
                    UpdateList.addItemObject($base, $item, info.category);
                }
            }
            // RTL
            if(info.rtl != null){
                var $titleLayout:any = UpdateList.getItemTitle($item);
                var $versionLayout:any = UpdateList.getItemVersion($item);
                var $sizeLayout:any = UpdateList.getItemSize($item);

                if(info.rtl){
                    // タイトルはラベル、値共にRTL有効
                    $titleLayout.$layout.addClass(RTL_ALIGN_RIGHT_CLASS);

                    // バージョンはラベルのみRTL有効
                    $versionLayout.$layout.addClass(RTL_ALIGN_RIGHT_CLASS);
                    $versionLayout.$value.addClass(RTL_CANCEL_CLASS);

                    // サイズはラベルのみTRL有効
                    $sizeLayout.$layout.addClass(RTL_ALIGN_RIGHT_CLASS);
                    $sizeLayout.$value.addClass(RTL_CANCEL_CLASS);
                }else{
                    // タイトル
                    $titleLayout.$layout.removeClass(RTL_ALIGN_RIGHT_CLASS);

                    // バージョン
                    $versionLayout.$layout.removeClass(RTL_ALIGN_RIGHT_CLASS);
                    $versionLayout.$value.removeClass(RTL_CANCEL_CLASS);

                    // サイズ
                    $sizeLayout.$layout.removeClass(RTL_ALIGN_RIGHT_CLASS);
                    $sizeLayout.$value.removeClass(RTL_CANCEL_CLASS);
                }
            }
        }

        /**
         * 行情報取得
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return 設定情報（setItemInfoのinfoど同一形式のJSON） 
         */
        public static getItemInfo($item:JQuery):any{
            var $icon:JQuery = UpdateList.getItemIcon($item);
            var $titleLayout:any = UpdateList.getItemTitle($item);
            var $versionLayout:any = UpdateList.getItemVersion($item);
            var $sizeLayout:any = UpdateList.getItemSize($item);
            var $progress:JQuery = UpdateList.getItemProgressCircle($item);

            var info:any = {
                "title":{
                    "label":$titleLayout.$label.text(),
                    "value":$titleLayout.$value.text()
                },
                "version":{
                    "label":$versionLayout.$label.text(),
                    "value":$versionLayout.$value.text()
                },
                "size":{
                    "label":$sizeLayout.$label.text(),
                    "value":$sizeLayout.$value.text()
                },
                "icon":UpdateList.getItemIconType($icon.attr("src")),
                "progress":ProgressCircle.getProgressValue($progress),
                "showprogress":UpdateList.getItemShowProgressCircle($item),
                "category":$item.attr("category"),
                "rtl":$titleLayout.$label.hasClass(RTL_CLASS)
            };

            return info;
        }

        /**
         * データ行内のアイコンリソースパス取得
         * @param iconType アイコン種類
         * @return アイコンリソースパス
         */
        private static getItemIconPath(iconType:MAP_DATA_ICON_TYPE):string{
            var path:string = UpdateList.ICON_PATH_NOT_DOWNLOAD;

            switch(iconType){
                case MAP_DATA_ICON_TYPE.NOT_DOWNLOAD:
                    path = UpdateList.ICON_PATH_NOT_DOWNLOAD;
                    break;
                case MAP_DATA_ICON_TYPE.NOT_UPDATE:
                    path = UpdateList.ICON_PATH_NOT_UPDATE;
                    break;
                case MAP_DATA_ICON_TYPE.UPDATED:
                    path = UpdateList.ICON_PATH_UPDATED;
                    break;
                default:
                    break;
            }

            return path;
        }

        /**
         * データ行内のアイコンリソース種類取得
         * @param path アイコンリソースパス
         * @return アイコン種類
         */
        private static getItemIconType(path:string):MAP_DATA_ICON_TYPE{
            var iconType:MAP_DATA_ICON_TYPE = MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;

            switch(path){
                case UpdateList.ICON_PATH_NOT_DOWNLOAD:
                    iconType = MAP_DATA_ICON_TYPE.NOT_DOWNLOAD;
                    break;
                case UpdateList.ICON_PATH_NOT_UPDATE:
                    iconType = MAP_DATA_ICON_TYPE.NOT_UPDATE;
                    break;
                case UpdateList.ICON_PATH_UPDATED:
                    iconType = MAP_DATA_ICON_TYPE.UPDATED;
                    break;
                default:
                    break;
            }

            return iconType;
        }

        /**
         * データ行内のアイコンDOM要素取得
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return アイコンDOM要素（jQueryオブジェクトとして返却）
         */
        private static getItemIcon($item:JQuery):JQuery{
            var $icon = $item.find("." + UpdateList.ROW_ICON_CSS_CLASS);
            return $icon;
        }

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
        private static getItemTitle($item:JQuery):any{
            var $title = $item.find("." + UpdateList.ROW_TITLE_CSS_CLASS);
            return {
                "$layout":$title,
                "$label":$title.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                "$value":$title.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
            };
        }

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
        private static getItemVersion($item:JQuery):any{
            var $version = $item.find("." + UpdateList.ROW_VERSION_CSS_CLASS);
            return {
                "$layout":$version,
                "$label":$version.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                "$value":$version.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
            };
        }

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
        private static getItemSize($item:JQuery):any{
            var $size = $item.find("." + UpdateList.ROW_SIZE_CSS_CLASS);
            return {
                "$layout":$size,
                "$label":$size.find("." + UpdateList.ROW_LABEL_CSS_CLASS),
                "$value":$size.find("." + UpdateList.ROW_VALUE_CSS_CLASS)
            };
        }

        /**
         * データ行内のプログレスサークルDOM取得
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return プログレスサークルDOM要素（jQueryオブジェクトとして返却）
         */
        private static getItemProgressCircle($item:JQuery):JQuery{
            var $progress = $item.find("." + ProgressCircle.BASE_CSS_CLASS);
            return $progress;
        }

        /**
         * データ行内のプログレスサークルの表示／非表示設定
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @param isShow 表示／非表示（true:表示、false:非表示）
         */
        private static setItemShowProgressCircle($item:JQuery, isShow:boolean){
            var $progress = UpdateList.getItemProgressCircle($item);
            $progress.css("visibility", isShow ? "visible" : "hidden");
        }

        /**
         * データ行内のプログレスサークルの表示／非表示状態を取得
         * @param $item 対象行DOM要素（addItemで返却されるオブジェクト）
         * @return isShow 表示／非表示（true:表示、false:非表示）
         */
        private static getItemShowProgressCircle($item:JQuery):boolean{
            var $progress = UpdateList.getItemProgressCircle($item);
            return $progress.css("visibility") != "hidden";
        }

        /**
         * 表示更新（jQuery Mobileのスタイルを適用する為に必要）
         * @param $target 対象DOM要素（表示のベースとするDIV要素。jQueryオブジェクトとして渡す。）
         * @param isInit 初期化フラグ（createから使用する場合はtrue、それ以外はfalse）
         */
        private static refresh($target:JQuery, isInit:boolean){
            var $page:JQuery = $target.parents("div:jqmData(role=page)");
            $page.page();
            var $listview:JQuery = $target.find(":jqmData(role=listview)");
            $listview.listview(isInit ? undefined : "refresh");
        }
    }

    /**
     * アラートUI
     */
    export class Alert {
        private static baseFrameID:string = "harmanota_baseframe";

        /**
         * アラート
         */
        public static alert(message:string){
            // アラート表示用のiframeを作成
            var targetWindow:Window = Alert.createBaseFrame();
            // アラートを表示
            targetWindow.alert(message);
            // アラート表示用のiframeを削除
            Alert.removeBaseFrame();
        }

        /**
         * 確認アラート
         */
        public static confirmAlert(message):boolean{
            // アラート表示用のiframeを作成
            var targetWindow:Window = Alert.createBaseFrame();
            // アラートを表示
            var result:boolean = targetWindow.confirm(message);
            // アラート表示用のiframeを削除
            Alert.removeBaseFrame();

            return result;
        }

        /**
         * アラート用iframeを作成する
         * @return アラート表示用iframeのwindow
         */
        private static createBaseFrame():Window{
            // 重複しないように削除する
            Alert.removeBaseFrame();

            // アラート用のiframeを生成し、そのiframeのwindowを返却する
            var $frame:JQuery = $("<iframe></iframe>");
            $frame.attr("src", "data:text/plain");
            $frame.attr("id", Alert.baseFrameID);
            $("body").append($frame);
            return window.frames[0].window;
        }

        /**
         * アラート用iframeを削除する
         */
        private static removeBaseFrame(){
            var $frame:JQuery = $("#" + Alert.baseFrameID);
            $frame.remove();
        }
    }
}