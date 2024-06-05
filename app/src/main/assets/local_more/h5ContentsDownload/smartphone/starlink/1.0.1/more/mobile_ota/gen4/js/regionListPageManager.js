(function () {
    // ---------------------------------------------------------------------------------------------------------
    /**
     * 更新データ一覧ページ管理クラス
     */
    var RegionListPageManager = (function () {
        var _super = MobileOtaGen4.RegionPageManager;

        __extends(RegionListPageManager, _super);

        var UI = MobileOtaGen4.UIGen4;

        function RegionListPageManager() {
            _super.apply(this, arguments);
        }

        /**
         * 初期化処理
         */
        RegionListPageManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.isMap = false;
            this.otherRegions = new Array();
        };
        /**
         * 画面初期化
         * @param language 言語コード
         */
        RegionListPageManager.prototype.initPage = function (language) {
            _super.prototype.initPage.call(this, language);
            HarmanOTA.CommonHTMLSDK.getInstance().readKVS("geocode_iso_country_code/", function (key, value) {
                console.log("[I][RegionListPageManager][initPage][readKVS] key : "+key+" geocode_iso_country_code : "+value);
                try {
                    countryCode = value.split("_").length == 2 ? value.split("_")[1] : value.split("_")[0];
                    console.log("[I][RegionListPageManager][initPage][readKVS] countryCode = "+countryCode);
                } catch (e) {
                    console.log("[E][RegionListPageManager][initPage][readKVS] can't get countryCode.");
                    countryCode = "US";
                }
                this.$('#backbutton').attr('href', '../../index.html?countrycode=' + countryCode);
            });
        };

        /**
         * 画面項目設定
         */
        RegionListPageManager.prototype.settingPageItem = function () {
            _super.prototype.settingPageItem.call(this);
        };
 
        /**
         * 更新データ一覧を更新（再生成）
         */
        RegionListPageManager.prototype.updateDataList = function () {
            _super.prototype.updateDataList.call(this);
        };


 
        /**
         * 地図表示対象外のリストを取得
         * @param {*} callback 
         * @param {*} launcherUserArea 
         */
        RegionListPageManager.prototype.getOtherRegions = function (callback) {
            var _this = this;
            var targetArea = [];
            //地図表示地域を取得
            if (_this.mapDetails.data[0].mapJson.nds_product[0].name == MobileOtaGen4.PageManagerGen4.NORTH_AMERICA) {
                for (var i = 0; i < _this.valueNorthAmerica.length ; i++) {
                    var area = _this.valueNorthAmerica[i];
                    if (area != 'OTHER') {
                        targetArea.push(area);
                    }
                }
            }
            
            _this.diveGeoJson(_this.mapDetails, targetArea, callback, function(features) {
                //regionIDぶんループ
                for (var regionIndex = 0; regionIndex < features.length; regionIndex++) {
                    var regionID = features[regionIndex].properties.regionID; //geojson定義のregionID
                    var ndsRegionLength = _this.mapDetails.data[0].mapJson.nds_product[0].nds_region.length;
                    //getCurrentMapDetailsの件数分ループ
                    for (var currentmapIndex = 0; currentmapIndex < ndsRegionLength; currentmapIndex++ ) {
                        var shownRegionID = _this.mapDetails.data[0].mapJson.nds_product[0].nds_region[currentmapIndex].id;
                        //Geojson記述のregionIDと一致する場合は一覧から削除
                        if (shownRegionID == regionID) {
                            _this.mapDetails.data[0].mapJson.nds_product[0].nds_region.splice(currentmapIndex,1);
                            break;
                        }
                    };
                };
            });
            
        };

        /**
         * 未選択のregionを一覧のINDEFINITEに戻す
         */
        RegionListPageManager.prototype.moveUnselectedRegionsList = function () {
            var dataRowLength = this.updateDataRows.length;
            // 未選択の行は一覧から削除
            for (var dataRowIndex = 0; dataRowIndex < dataRowLength; dataRowIndex++) {
                var regionID = this.updateDataRows[dataRowIndex].key.regionID;
                var $row = this.updateDataRows[dataRowIndex].row;
                var isChecked = ($row == undefined || $row == null)? true: UI.RegionList.getButtonStatus($row);

                if (!isChecked) {
                    //データ移動処理
                    this.moveRegionsList($row,MobileOtaGen4.MAP_DATA_CATEGORY.INDEFINITE);
                    this.hiddenItemIcon($row);
                }
            }
        };

        /**
         * モーダレスウィンドウ(plus image)を生成する (For List)
         * @param text モーダルウィンドウに表示する文字列
         * @param buttons 表示するボタンの種類
         * @param name モーダル名 ダイアログ作成時に指定したnameもしくは以下のデフォルト名を使用
         *             none:ボタンなし/ok:OKボタンのみ/cancel:cancelボタンのみ/okcancel:OKボタンとCancelボタン
         */
        RegionListPageManager.prototype.createModalessDialogImageForList = function (textBefore,textAfter, buttons, name) {
            var _this = this;
            // jQuery-UIのdialogを使用
            $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).dialog({
                resizable: false,       //リサイズ禁止
                modal: true,            //モーダル化
                title: "",           //タイトル文字列（空白）
                buttons: buttons,
            });

            //name設定
            $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).attr("name", name);
            //ボタンなしモーダルの場合CSSを追加
            if (buttons == undefined || buttons.length == 0) {
                $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).addClass(RegionListPageManager.CSS_DIALOG_NOBUTTON);
            } else {
                $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).removeClass(RegionListPageManager.CSS_DIALOG_NOBUTTON);
            }
            // 本文設定
            if(!this.isEnabledRtl){
                $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).find("p:first")
                    .html(
                        '<span class="'+RegionListPageManager.CSS_DIALOG_TEXT+'">'+
                         textBefore.replace('\n','</br>')
                        +'</span>'+
                        // .replace('Please tap button','Please tap <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> button')+
                        ' <img src="'+RegionListPageManager.IMAGE_PATH+'" class="'+RegionListPageManager.CSS_DIALOG_IMAGE+' "/> '+
                        '<span class="'+RegionListPageManager.CSS_DIALOG_TEXT+'">'+
                         textAfter.replace('\n','</br>')
                        +'</span>'
                    );
            }else{
                $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).find("p:first")
                    .html(
                        '<span class="'+RegionListPageManager.CSS_DIALOG_TEXT_RTL_RIGHT+'">'+
                         textBefore.replace('\n','</br>')
//                                'Before1 Before2 Before3 '
                        +'</span>'+
                        // .replace('Please tap button','Please tap <img src="'+RegionMapPageManager.IMAGE_PATH+'" class="'+RegionMapPageManager.CSS_DIALOG_IMAGE+' "/> button')+
                        ' <img src="'+RegionListPageManager.IMAGE_PATH+'" class="'+RegionListPageManager.CSS_DIALOG_IMAGE+' "/> '+
                        '<span class="'+RegionListPageManager.CSS_DIALOG_TEXT_RTL_RIGHT+'">'+
//                                ' After1 After2 After3 After4 After5 After6 After7. '
                         textAfter.replace('\n','</br>')
                        +'</span>'
                    );
            }
            // RTL有効/無効設定
            this.setEnabledRtl($(RegionListPageManager.DIALOG_CONFIRM_MODALESS), this.isEnabledRtl);
            // 最前面に表示
            $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).dialog("moveToTop");
            //リストのcheckBoxを操作不可に変更
            this.setAllCheckBoxStatus(true);

        };

        /**
         * モーダルウィンドウ（ボタンOK）を生成する(For List)
         * @param text モーダルウィンドウに表示する文字列
         * @param callback ボタン押下時のコールバック関数
         */
        RegionListPageManager.prototype.createModalDialogImageNoButtonForList = function (textBefore,textAfter, callback, name) {
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

            if (_this.isCancelshowPopUp == true) {
                //ダイアログ作成
                this.createModalessDialogImageForList(textBefore,textAfter, buttons, dialogName);
            }
        };

        /**
          * モーダルウィンドウをクローズする
          */
         RegionListPageManager.prototype.closeModalDialogForList = function (name) {
            try {

                var _this = this;
                if (name != undefined && name != null) {
                    //指定したnameと一致しない場合はモーダルをクローズしない
                    if ($(RegionListPageManager.DIALOG_CONFIRM_MODALESS).attr("name") != name) {
                        return;
                    }
                }

                //スクロールを許可
                this.return_scroll();
                _this.isCancelshowPopUp = false;
                $(RegionListPageManager.DIALOG_CONFIRM_MODALESS).dialog("close");

            } catch (error) {
                console.log(error);
            }

        };


        //定数
        RegionListPageManager.MAP = "#map";                  //地図
        RegionListPageManager.MAP_AREA = "#mapArea";    //検索ボックス＋leaflet＋ストレージバー領域     //Auto Regions Setting 目的地
        RegionListPageManager.DIALOG_CONFIRM_MODALESS = "#dialog-confirm-modaless";

        RegionListPageManager.CSS_DIALOG_IMAGE = "harman-ota-dialog-image";
        RegionListPageManager.CSS_DIALOG_TEXT = "harman-ota-dialog-text";
        RegionListPageManager.CSS_DIALOG_TEXT_RTL_RIGHT = "harman-ota-dialog-text-rtl-right";

        RegionListPageManager.PagePath = "../mobile_ota/gen4/regionList.html";
        RegionListPageManager.ModuleName = "MobileOta.RegionListPageManager";
        RegionListPageManager.IMAGE_PATH = "./images/icon_download_cancel.png";

        var controller = MobileOtaGen4.Controller.getInstance();
        var PAGE_ID = "huupd_region";
        controller.addPage(PAGE_ID, function () {
            return new RegionListPageManager();
        });
        return RegionListPageManager;
    })();
})();
