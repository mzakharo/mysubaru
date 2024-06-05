//================グローバル変数=========================
// 利用規約更新日
var termsOfServiceUpdateDate = "2017/04/01"
//設定言語
var g_language = null;
//RTL有効/無効
var g_enabledRtl = false;
//PIDリスト
var g_pidList = null;
//アプリ情報一覧(XML)
var g_appListXML = null;
//アプリ情報一覧PID
var g_appListPID = null;
//端末情報
var g_appInfo = null;
//選択中地図アプリ情報
var g_useNavi = null;
//言語タグ(<EN>等、アプリ情報XML内の情報参照時に使用)
var g_langTag = null;
//ハッチングフラグ
var g_hatchingFlg = true;
//利用地域
var g_launcherUserArea = "";
//ネイティブナビ情報
var g_nativeNaviInfo = null;
//ページID(利用地域選択)
var pageIDLocationSelect = "locationselectpage";
//ページID(config)
var pageIDConfig = "configpage";

var mwsDomainWithPort = "";

var g_c = null;

var g_supportedFunction = {
    "get_appinfo_v2": false,
    "harman_mobile_ota": false,
};

// ネイティブナビ利用可否判定（車載機Launcherが判定した結果のKVS値を使用）
function judgeCanUseNativeNavi(json) {
    if(json != null && json.nativenavi != null){
        // 0:利用不可、1:利用可
        return json.nativenavi == 1;
    }else{
        return false;
    }
};

// ネイティブナビ用ポリシーを判定
function judgeNativeNaviPolicy(supportID) {
    return (supportID == "OP_SET_DESTINATION_NATIVENAVI");
};

//----------------------------------------------------
//clrKeyValue
function clrKeyValue() {
    console.log("[I][Config][clrKeyValue] start");
    var result = false;
    var kvsurl = mwsDomainWithPort + "kvs/__delete_all__";
    var d = $.Deferred();
    var dcount = 0;
    var resolve = function() {
        dcount--;
        if (dcount == 0) {
            d.resolve();
        }
    };
    dcount++;
    $.ajax({
        type: "POST",		//HTTPメソッド
        url: kvsurl,		//URL
        async: true,		//非同期
        timeout: 5000,		//タイムアウト
        data: null,			//データ
        success: function (data, status, xhr) {
            console.log("[I][Config][clrKeyValue] ajax success");
            resolve();
        },
        error: function (xhr, status, err) {
            console.log("[E][Config][clrKeyValue] ajax error");
            resolve();
        }
    });

    if (harmanOTASettings.deviceCode != null &&
        harmanOTASettings.productCode != null)
    {
        var removeDetas = [{
            'deviceCode': harmanOTASettings.deviceCode,
            'productCode': harmanOTASettings.productCode
        }];
        dcount++;
        var ahaConnectSDKController = new HarmanOTA.AhaConnectSDKController();
        var PageManager = new HarmanOTA.PageManager();
        PageManager.initCancelDownload(function () {
            PageManager.cancelDownload(function (result) {
               console.log(">>> cancelDownload removedevice in result = " + result);
               ahaConnectSDKController.removeDevices(removeDetas, function (removeDevicesData, result) {
                    resolve();
               })
            })
        });
            
    }
    console.log("[I][Config][clrKeyValue] end");
    return d.promise();
}
//----------------------------------------------------
//setKeyValue
function setKeyValue(key, value) {
    console.log("#9325  setKeyValue() start");
    var d = $.Deferred();
    var kvsurl = mwsDomainWithPort + "kvs/" + key + "/";
    $.ajax({
        type: "POST",		//HTTPメソッド
        url: kvsurl,		//URL
        async: true,		//同期
        timeout: 5000,		//タイムアウト
        data: value,		//データ
        success: function (data, status, xhr) {
            console.log("[I]#9325  setKeyValue Success key:" + key + "value:" + value);
            d.resolve();
        },
        error: function (xhr, status, err) {
            console.log("[E]#9325  setKeyValue Error key:" + key + "value:" + value);
            d.resolve();
        }
    });
    return d.promise();
}
//----------------------------------------------------
//getKeyValue
function getKeyValue(key) {
    console.log("#9325  getKeyValue() start");
    var value = null;
    var kvsurl = mwsDomainWithPort + "kvs/" + key + "/";
    var d = $.Deferred();

    $.ajax({
        type: "GET",		//HTTPメソッド
        url: kvsurl,		//URL
        async: true,		//同期
        timeout: 5000,		//タイムアウト
        success: function (data, status, xhr) {
            console.log("#[I]9325  getKeyValue() Success " + kvsurl + " GET status=" + status + " code=" + xhr.status);
            d.resolve(xhr.responseText);
        },
        error: function (xhr, status, err) {
            console.log("#[E]9325  getKeyValue() error " +  kvsurl + " GET status=" + status + " code=" + xhr.status + " err=" + err);
            d.resolve();
        }
    });
    return d.promise();
}

/**
 * Harman OTA 関連画面向け初期化処理
 * @param callback コールバック（引数で言語コードを返却）
 */
function initHarmanOTA(callback){
    // MWSからドメインとポートを取得する
    mwsRequestManager.initialize(function(){
        console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize] start");
        mwsDomainWithPort = mwsRequestManager.getMWSUrl();
        console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize] mwsDomainWithPort = "+mwsDomainWithPort);
        getAppInfo().then(function(){
            var language = getDeviceHarmanOTALanguage();
            console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize][getAppInfo] language = "+language);
            if(callback != null){
                console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize][getAppInfo] callback execute");
                callback(language);
            }
        }, function(){
            console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize][getAppInfo] error");
            if(callback != null){
                console.log("[I][config][initHarmanOTA][mwsRequestManager.initialize][getAppInfo] error callback execute");
                callback(null);
            }
        });
    });
}

// Harman車載機関連情報を取得する
var harmanOTASettings = harmanOTASettings || {};
var prepareAhaConnectSDKSettings = null;
var createDefaultSettings = function () {
    if (HarmanOTA.useStubVehicleInfo) {
        harmanOTASettings = HarmanOTA.stubVehicleSettings;
    } else {
        harmanOTASettings = HarmanOTA.Common.getDefaultHarmanOTASettings();
        console.log("[I][config][createDefaultSettings] harmanOTASettings = "+JSON.stringify(harmanOTASettings));
    }
};

if (!HarmanOTA.useStubVehicleInfo) {
    harmanOTASettings.accessoryFlag = false;
    harmanOTASettings.mapSubscriptionDetails = null;
    harmanOTASettings.deviceCode = null;
    harmanOTASettings.productCode = null;
}

function setupMobileOTASettings(callback) {
    console.log("#9325  setupMobileOTASettings() start");
    HarmanOTA.Common.readHarmanOTASettings(function(data){
        harmanOTASettings = data;
        if (data == null) {
            createDefaultSettings();
        }
        console.log("[I][config][setupMobileOTASettings] harmanOTASettings = "+JSON.stringify(harmanOTASettings));

        if (isMobileOtaGen4()) {
            prepareAhaConnectSDKSettings = new MobileOtaGen4.AhaConnectSDKSettingsGen4();
            console.log("[I][config][setupMobileOTASettings][Gen4] prepareAhaConnectSDKSettings = "+JSON.stringify(prepareAhaConnectSDKSettings));
        } else {
            prepareAhaConnectSDKSettings = new HarmanOTA.AhaConnectSDKSettings();
            console.log("[I][config][setupMobileOTASettings][Gen3.1] prepareAhaConnectSDKSettings = "+JSON.stringify(prepareAhaConnectSDKSettings));
        }
        prepareAhaConnectSDKSettings.readSettings(function (result) {
            // KVSのプロパティ構造と、ahaConnectSDKSettingsのプロパティ構造は同じ
            callback();
        });
    });
}

function getHarmanInfo(){
    var deferred = $.Deferred();

    var $page = $("div:jqmData(role=page)");
    var pageID = $page.attr("id");

    console.log("[I][config][getHarmanInfo] $page = "+$page);
    console.log("[I][config][getHarmanInfo] pageID = "+pageID);
    // CONFIGトップページ以外の場合は処理を行わない
    if(pageID != pageIDConfig){
        deferred.resolve();
        return deferred.promise();
    }

    try {
        setupMobileOTASettings(function(){
            deferred.resolve();
        });
    } catch (e) {
        console.log("[E][config][getHarmanInfo] error");
        deferred.resolve();
    }

    return deferred.promise();
}

function showHarmanExpireDate(date) {
    var harmanExpireDate = convertDate(date);

    // 有効期限表示
    var $target = $("#huupdlicensevalue");
    $target.html(harmanExpireDate == "Invalid Date" ? "-" : harmanExpireDate);
    HarmanOTA.Common.cancelRtl($target);
}

function viewHarmanInfo(){
    console.log("#9325 viewHarmanInfo() start");
    if (!g_supportedFunction.harman_mobile_ota) {
        return;
    }
    var deferred = $.Deferred();

    if(harmanOTASettings.accessoryFlag){
        if (harmanOTASettings.mapSubscriptionDetails != null && harmanOTASettings.mapSubscriptionDetails.expiryDate != undefined) {
            showHarmanExpireDate(harmanOTASettings.mapSubscriptionDetails.expiryDate);
        }

        console.log("#9325 viewHarmanInfo() request:mapSubscriptionDetails");
        var ahaConnectSDKController = new HarmanOTA.AhaConnectSDKController();
        ahaConnectSDKController.mapSubscriptionDetails(harmanOTASettings.deviceCode, harmanOTASettings.productCode, function(valid, date, result){
            if(result && date != null){
                showHarmanExpireDate(date);
            }

            deferred.resolve();
        });
    }else{
        deferred.resolve();
    }

    return deferred.promise();
}


function convertDate(date) {
    var language = getDeviceHarmanOTALanguage();
    // デフォルトをMonthを「short」表記として判定する。
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    // ロケール値を変換する。
    language = language.replace("_", "-");
    var baseDate = new Date(date);
    return baseDate.toLocaleDateString(language, options);
}

function isMobileOtaGen3() {
    try {
        var result = harmanOTASettings.huModel != undefined &&
        harmanOTASettings.huModel.indexOf('Gen3.') == 0;
        console.log('[I][Config][isMobileOtaGen3] ' + result);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function isMobileOtaGen4() {
    try {
        var result = harmanOTASettings.huModel != undefined &&
        harmanOTASettings.huModel.indexOf('CP1.0') == 0;
        console.log('[I][Config][isMobileOtaGen4] ' + result);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function isEnableMobileOta() {
    try {
        // 車載と接続した形跡があるか
        if (!harmanOTASettings.accessoryFlag) {
            console.log('[I][isEnableMobileOta] vehicle not connected.');
            return false;
        }

        if (isMobileOtaGen4()) {
            // Gen4
            var settings_gen4 = prepareAhaConnectSDKSettings.settings_gen4;
            var notify_current_map_details = settings_gen4.notify_current_map_details;
            if (notify_current_map_details != undefined &&
                notify_current_map_details.mapJson != undefined) {
                return true;
            }
            console.log('[I][isEnableMobileOta] settings_gen4 : ' + JSON.stringify(settings_gen4));
            console.log('[I][isEnableMobileOta] harmanOTASettings : ' + JSON.stringify(harmanOTASettings));
            return false;
        } else if (isMobileOtaGen3()) {
            // Gen3.1α
            return true;
        }

        // default
        console.log('[I][isEnableMobileOta] harmanOTASettings : ' + JSON.stringify(harmanOTASettings));
        return false;
    } catch (error) {
        console.log('[E][isEnableMobileOta] error');
        console.log(error);
    }
}

// Harman車載機関連項目の設定
function settingHarmanItem(){
    console.log("#9325 settingHarmanItem() start")
    if (!g_supportedFunction.harman_mobile_ota) {
        return;
    }
    //----------------------------------------------------
    if(isEnableMobileOta()){
        // 『Head unit Update Settings』領域を表示
        $('#huupdsettingField').show();
        // 『Head unit Update Settings』ボタン押下
        $('#huupdsettingField').on('click', function (e, d) {

            var url = location.href;
            console.log("[I][Config][settingHarmanItem] location.href<start> = "+location.href);

            if (HarmanOTA.useStubMultilingualTest) {
                //多言語テスト時はhubPageへ遷移
                url = './mobile_ota/gen4/hub_gen4.html';
            } else {
                //画面表示の分岐を行う
                if (isMobileOtaGen4())
                {
                    // Gen4
                    var settings_gen4 = prepareAhaConnectSDKSettings.settings_gen4;
                    if (settings_gen4.help_shown) {
                        url = './mobile_ota/gen4/hub_gen4.html';
                    } else {
                        url = './mobile_ota/gen4/regionHelp.html'; 
                    }
                } else if (isMobileOtaGen3()) {
                    url = 'huupd_list.html';
                } else {
                    console.log("[E][Config][settingHarmanItem] error");
                    return;
                }
            }
            
            location.href = url;
            console.log("[I][Config][settingHarmanItem] location.href<end> = "+location.href);
            //タイムアウト設定
            var timeoutpagetransit = window.setTimeout(function () {
                HarmanOTA.UI.Alert.alert("Connection error. Please try again.");
                window.location.href = "./index.html?countrycode=";
            }, 3000); //★Timeout 3sec
        });

        //画面表示文言（MOTAマニュアルサイトへのリンク）
        $('#manualField').show();
        $('#manualField').on( 'click', function(e,d){
            location.href = "https://subaru-maps.com/#/usermanual?anchor=mobile&openlink_exbrowser=true";
        });
    }
    var notifyCallback = function (notifyPayload, notifyContentType) {

        console.log('[I][config]notifyPayload : ' + JSON.stringify(notifyPayload));

        var updatePage = function () {
            console.log("[I][Config]#9325 updatePage() start");
            updatePage = null;
            // Harman車載機項目設定
            HarmanOTA.AhaConnectHTMLSDK.getInstance().removeNotifyData(notifyCallback, null);
            notifyCallback = null;
            // 画面をリロードする
            location.reload();
            console.log("[I][Config]Config reload execute!");
            console.log("[I][Config]#9325 updatePage() end");
        };

        var postUpdate = function () {
            postUpdate = null;
            setupMobileOTASettings(function () {
                if (isEnableMobileOta()) {
                    updatePage();
                }
                console.log("[I][Config]#9325 postUpdate() end");
            });
        };

        switch (notifyPayload.notify) {
            case HarmanOTA.AhaConnectSDK_Notify_accessoryInformation:
                console.log("[I][Config]#9325 postUpdate() Notify_accessoryInformation start");
                postUpdate();
                break;
            case MobileOtaGen4.AhaConnectSDK_Notify_currentMapDetails:
                console.log("[I][Config]#9325 postUpdate() Notify_currentMapDetails start");
                postUpdate();
                break;
            default:
                console.log("[E][Config]#9325 postUpdate() Notify_other start");
                break;
        }

    };
    HarmanOTA.AhaConnectHTMLSDK.getInstance().addNotifyData(notifyCallback, this, function (result) { });
    console.log("#9325 settingHarmanItem() end");
}

function init() {
    console.log("[I][Config][init]start");

    console.log("[I][Config][init]start loading");
    $.mobile.showPageLoadingMsg();

    try {
    // MWSからドメインとポートを取得する
    mwsRequestManager.initialize(function () {
        console.log("[I][Config][init][mwsRequestManager.initialize]start");
        mwsDomainWithPort = mwsRequestManager.getMWSUrl();
        console.log("[I][Config][init][mwsRequestManager.initialize]mwsDomainWithPort = "+mwsDomainWithPort);

        //Commonクラスインスタンス化
        g_c = new Common(localStorage.getItem("launcher_mws_localPort"));

        //言語情報取得
        var language = "";
        var newLanguage = "";
        getHarmanInfo()
        .then(getAppInfo)
        .then(function() {
            console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo] start");
            // Harman車載機項目設定
            settingHarmanItem();
            language = getDeviceLanguage();
            newLanguage = getDeviceHarmanOTALanguage();

            // RTL有効/無効判定
            setMemoryEnabledRtl(HarmanOTA.Common.judgeEnabledRtl(newLanguage));

            //表示フォント設定
            changeFontFamilyTW(newLanguage);
            //表示言語設定
            setDisplayWordsLocationSelect(newLanguage);
            // 利用地域選択ページ初期処理
            // KVS(launcher_user_area)から利用地域を取得
            getKeyValue("pid_history")
            .then(function(pid_data) {
                console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] start");
                var pid_data_temp = pid_data;
                if (pid_data_temp == null || pid_data_temp == undefined || pid_data_temp == "") {
                    console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] pid_history is nothing!");
                } else {
                    console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] pid history is exist!");
                    $('#locatfieldcontainionSelectField').show();
                    var launcherUserArea = "";
                    getKeyValue("launcher_user_area")
                    .then(function(data) {
                        launcherUserArea = data;
                        if (launcherUserArea == null || launcherUserArea == undefined || launcherUserArea == "") {
                            console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history][getKeyValue:launcher_user_area] launcher_user_area is nothing!");
                            // OKボタンをハッチング
                            $("#locationselect_ok").button('disable');
                        } else {
                            console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history][getKeyValue:launcher_user_area] launcher_user_area is exist!");
                            // 設定されている値に合致するラジオボタンのチェックを入れる
                            $('input[name=location]').val([launcherUserArea]);
                            $('input[name=location]').checkboxradio('refresh');
                        }
                        setMemoryUserArea(launcherUserArea);
                    },
                    function() {
                        console.log("[E][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] launcher_user_area can't get.");
                    });
                }
                console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] end");
            },
            function() {
                console.log("[E][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo][getKeyValue:pid_history] pid_history can't get.");
            });

            //=====================デリゲーション切り替え処理スタート 2016/0613=======================================
            //===============メモリ上に必要な情報を格納=================

            //端末情報を取得
            var appInfo = getMemoryAppInfo();
            //内容チェック
            if (appInfo != undefined && appInfo != null && appInfo != "") {
                //端末情報をメモリに保存
                setMemoryAppInfo(appInfo);
                //JSONパース
                var appInfoJson = JSON.parse(appInfo);
                console.log("[I][Config][init]#9325 getMemoryAppInfo != error");
            } else {
                console.log("[E][Config][init]#9325 getMemoryAppInfo == error");
                //Commonクラスメモリ解放
                g_c = null;
                // 進捗インジケータを非表示
                $.mobile.hidePageLoadingMsg();
                //取得失敗時(appInfo)はリターン
                document.getElementById("morecontent").style.visibility = "visible";
                console.log("[E][Config][init] Can't get app information from MWS.");
                return;
            }
            //言語情報取得
            var language = getDeviceLanguage();
            var newLanguage = getDeviceHarmanOTALanguage();
            //設定言語が取得できなかった場合は、アメリカ英語
            if (language == undefined || language == null || language == "") {
                language = "en_us";
            }
            //設定言語をメモリに保存
            setMemoryLanguage(language);
            //
            setMemoryLangTag(language);
            var langTag = getMemoryLangTag();

            //表示フォント設定
            changeFontFamilyTW(newLanguage);
            //表示言語設定
            setDisplayWordsLocationSelect(newLanguage);
            //表示言語設定
            setDisplayWords(newLanguage, appInfo);

            // HarmanOTA関連情報表示（有効期限表示）
            viewHarmanInfo();

            //選択されている PID を取得
            var pidList = "";
            console.log("[I][Config][MORE top]#9325 getPidList() start");
            g_c.getPidList()
            .then(function(data) {
                pidList = data;
                try {
                    delegationInit(pidList)
                    .then(function() {
                        console.log("[E][Config][init]------ [morecontent]visible[ERROR1] ------");
                        $.mobile.hidePageLoadingMsg();
                        if (location.href.indexOf("index.html") != -1) {
                            document.getElementById("morecontent").style.visibility = "visible";
                        }
                        return;
                    },
                    function() {
                        console.log("[E][Config][init]------ [morecontent]visible[ERROR2] ------");
                        $.mobile.hidePageLoadingMsg();
                        document.getElementById("morecontent").style.visibility = "visible";
                        return;
                    });
                } catch (error) {
                    console.log("[E][Config][init][ERROR pidList1]"+error);
                }
            },
            function() {
                try {
                   // getPidList()
                   delegationInit(pidList)
                   .then(function() {
                        console.log("[E][Config][init]------ [morecontent]visible[ERROR3] ------");
                        $.mobile.hidePageLoadingMsg();
                        document.getElementById("morecontent").style.visibility = "visible";
                        return;
                    },
                    function() {
                        console.log("[E][Config][init]------ [morecontent]visible[ERROR4] ------");
                        $.mobile.hidePageLoadingMsg();
                        document.getElementById("morecontent").style.visibility = "visible";
                        return;
                    });
                } catch (error) {
                    console.log("[E][Config][init][ERROR pidList2]"+error);
                }
            });

            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            if (location.href.indexOf("index.html") != -1) {
                document.getElementById("morecontent").style.visibility = "visible";
            }
            console.log("[I][Config][init][mwsRequestManager.initialize][getHarmanInfo][getAppInfo] end");
        },
        function() {
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            document.getElementById("morecontent").style.visibility = "visible";
            console.log("[E][Config][init]------ [morecontent]visible[ERROR5] ------");
        });

        //----------------------------------------------------
        //『全データの消去』ボタン押下
        $('#clrcarinfoField').on('click', function (e, d) {
            console.log("[I][Config][init] Execute deleting all data!");
            var language = getDeviceHarmanOTALanguage();
            
            $.confirm({
                title: '',
                boxWidth: '80%',
                useBootstrap: false,
                content: getConfirmMessage( "CONFIG_005", language ),
                buttons: {
                    confirm: {
                        text: getButtonsMessage( "APP_026", language ),
                        action: function(){
                            HarmanOTA.CommonHTMLSDK.getInstance().readKVS(
                                HarmanOTA.Common.KVS_KEY_HARMAN_OTA_TRANSFER, 
                                function( key, value ){
                                    var clear_flag = true;
                                    if (callback == null) {
                                        return;
                                    }

                                    if (value == null || value == undefined) {
                                        clear_flag = true;
                                    } else {
                                        console.log("[I][Config][init]Transfer Status ="+JSON.parse(value));
                                        var data = JSON.parse(value);
                                        // 転送中の場合（true : 転送中 / false : その他）
                                        if (data.transfer_show == false) {
                                            clear_flag = true;
                                        } else {
                                            clear_flag = false;
                                        }
                                    }

                                    if ( clear_flag == true ) {
                                        var backUrl = "";
                                        getKeyValue( "launcher_url_phone" ).then(function(data){
                                            backUrl = data;
                                            clrKeyValue().then(function(){
                                                setKeyValue( "launcher_url_phone", backUrl ).then(function(){
                                                    $.alert({
                                                        title: '',
                                                        boxWidth: '80%',
                                                        useBootstrap: false,
                                                        content: getConfirmMessage( "CONFIG_006", language ),
                                                        buttons: {
                                                            confirm: {
                                                                text: getButtonsMessage( "APP_026", language ),
                                                                action: function(){location.reload();}
                                                            }
                                                        }
                                                    }); //$.alert
                                                    return;
                                                }).catch(function(){return;});
                                            }).catch(function(){
                                                // clrKeyValue() reject
                                                return;
                                            });
                                        }).catch(function(){
                                            // getKeyValue() reject
                                            return;
                                        });
                                    } else {
                                        console.log("[E][Config][init]Clear Data error because of during transferring map data");
                                        $.alert({
                                            title: '',
                                            boxWidth: '80%',
                                            useBootstrap: false,
                                            content: getConfirmMessage( "CONFIG_013", language ),
                                            buttons: {
                                                confirm: {
                                                    text: getButtonsMessage( "APP_026", language ),
                                                    action: function(){}
                                                }
                                            }
                                        }); //$.alert
                                    } //endif
                                }); //HarmanOTA.CommonHTMLSDK.getInstance()
                            } /* action */
                    }, /* confirm */
                    cancel: {
                        text: getButtonsMessage( "APP_024", language ),
                        action: function(){}
                    }
                }
            }); //$.confirm
        });

        //----------------------------------------------------
        //『利用地域選択』ボタン押下
        $("#locatfieldcontainionSelectField").on('click', function(e, d) {
            console.log("[Config][local select field] Display!");
            location.href = 'locationselect.html';
        });

        //----------------------------------------------------
        //『利用規約』ボタン押下
        $("#termsField").on('click', function(e, d) {
            console.log("[Config][term] Display!");
            // 利用規約の言語分岐は改修前MOREタブ（SUBARU様サーバ管理コンテンツ）の仕組みを踏襲
            //var language = (window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage).substr(0,2);
            var language = getDeviceLanguage();
            var splitLanguage = language.split("_");
            var langCode =  splitLanguage[0];
            var url = "../more/terms_en.html";
            if (langCode == 'ja') {
                url = "../more/terms_ja.html";
            } else if (langCode == 'jp') {
                url = "../more/terms_ja.html";
            } else if (langCode == 'en') {
                url = "../more/terms_en.html";
            } else {
                url = "../more/terms_en.html";
            }
            location.href = url;
        });

        //----------------------------------------------------

        // //----------------------------------------------------
        // // 利用地域ラジオボタン選択時の処理
        $("input[name=location]").change( function() {
            console.log("[Config][local select field] Tap radio button!");
            // OKボタンを活性
            $("#locationselect_ok").button('enable');
        });

        //----------------------------------------------------
        // 利用地域選択ページで「OK」ボタンが押下された時の処理
        $("#locationselect_ok").on("click", function (e, d) {

            console.log("[Config][local select field] Tap OK button!");
            // 選択された利用地域を取得
            var selectLocation = $('input[name=location]:checked').val();

            // KVS(launcher_user_area)に値を書き込み
            setKeyValue("launcher_user_area", selectLocation)
            .then(function() {
                //画面表示の分岐を行う
                HarmanOTA.CommonHTMLSDK.getInstance().readKVS(HarmanOTA.Common.KVS_KEY_HARMAN_OTA_SETTINGS, function (key, value) {
                    if (value != null || value != undefined) {
                        console.log("[I][Config][init]HarmanInfo ="+JSON.parse(value));
                        var flag = JSON.parse(value);
                        if ( (flag.huModel != undefined) && (flag.huModel.indexOf('CP1.0') == 0) ) {
                            HarmanOTA.CommonHTMLSDK.getInstance().readKVS("mobile_ota_gen4", function(key2, data) {
                                if ( data != null || data != undefined ) {
                                    var Settings = JSON.parse(data);
                                    console.log("[I][Config][init]HarmanOTASettings = "+JSON.parse(data));
                                    Settings.selected_area = selectLocation;
                                    HarmanOTA.CommonHTMLSDK.getInstance().writeKVS(key2, JSON.stringify(Settings),function (result) {
                                        // config画面に遷移
                                        history.back();
                                    });
                                } else {
                                    // config画面に遷移
                                    history.back();
                                }
                            });
                        } else {
                            // config画面に遷移
                            history.back();
                        }
                    } else {
                        // config画面に遷移
                        history.back();
                    }
               });
            },
            function() {

            });
        });

        // デリゲーション切り替えページで「OK」ボタンが押下された時の処理
        $("#delegationSelect_ok").on("click", function (e, d) {

            // 選択されたラジオボタンのValueを取得
            var checkedValue = $('input[name=delegation]:checked').val();

            //内容チェック
            if (checkedValue != undefined && checkedValue != null && checkedValue != "") {
                //KVS(use_navi)に格納する"use_navi_appid"(アプリID)
                var setValueId = parseInt(checkedValue.split(",")[0],10);
                if (setValueId != NaN) {
                    //アプリ名取得に用いるidを取得するためのValue取り出し
                    var setValueNo = parseInt(checkedValue.split(",")[1], 10);
                    if (setValueNo != 0 && setValueNo != 1 && setValueNo != 2) {
                        //規定値以外は"0(その他)"
                        setValueNo = 0;
                    }
                } else {
                    //AppIdが不正な場合KVSを更新しない(何もしない)
                    // config画面に遷移
                    $.mobile.changePage("#configpage", { transition: "none" });
                    return ;
                }
                //KVS(use_navi)に格納するValue
                var obj = {
                    "use_navi": setValueNo,
                    "use_navi_appid": setValueId
                };
                // KVS(use_navi)に値を書き込み
                obj = JSON.stringify(obj);
                setKeyValue("use_navi", obj)
                .then(function() {
                    setMemoryUseNavi(obj);
                    // config画面に遷移
                    $.mobile.changePage("#configpage", { transition: "none" });
                    return;
                },
                function() {
                    // config画面に遷移
                    $.mobile.changePage("#configpage", { transition: "none" });
                    return;
                });
            } else {
                //リストのValueが不正な場合KVSを更新しない(何もしない)
                return;
            }
        });

        //デリゲーション切り替えボタンが押下された時の処理
        $("#delegationSelectField").on("click", function (e, d) {
            //KVS 選択中地図アプリ情報取得(use_navi)
            var useNavi = getMemoryUseNavi();
            //内容チェック
            if (useNavi != undefined && useNavi != null && useNavi != "") {
               //KVSに格納されているAppIdを代入
                var useNaviJson = JSON.parse(useNavi);
                var useNaviAppId = useNaviJson.use_navi_appid;
            } else {
                //""で初期化
                var useNaviAppId = "";
            }
            //優先度クエリを参照する必要があるかのチェック
            if (useNaviAppId == undefined || useNaviAppId == null || useNaviAppId == "") {
                //優先度クエリを参照する必要あり
                var queryParseFlg = true;
            } else {
                //優先度クエリを参照する必要なし
                var queryParseFlg = false;
            }
            //設定言語取得
            var language = getMemoryLanguage();
            //アプリ情報から各言語の情報を取得するための変数
            var langTag = getMemoryLangTag();
            //内容チェック
            if (langTag == undefined || langTag == null || langTag == "") {
                langTag = "EN"
            }
            //アプリ情報をメモリから取得
            var appXml = getMemoryAppListXML();

            // // TEST CODE (ナビゲーション一覧生成用ダミーデータ)
            // var aaa = '<?xml version="1.0" encoding="utf-8"?><APPS><APP_INFO ID="1">   <SUPPORT_OPERATION>       <ID>OP_SET_DESTINATION</ID>   </SUPPORT_OPERATION>   <APP_HTML5_ID>1111</APP_HTML5_ID>   <APP_NAME>       <EN>テスト地図A</EN>   </APP_NAME>   <APP_TOP_URL>http://www.aaa.com/?priority=1&amp;navitype=1</APP_TOP_URL></APP_INFO><APP_INFO ID="2">   <SUPPORT_OPERATION>       <ID>OP_SET_DESTINATION</ID>   </SUPPORT_OPERATION>   <APP_HTML5_ID></APP_HTML5_ID>   <APP_NAME>       <EN>テスト地図B</EN>   </APP_NAME>   <APP_TOP_URL>http://www.aaa.com/?priority=1&amp;navitype=1</APP_TOP_URL></APP_INFO><APP_INFO ID="3">   <SUPPORT_OPERATION>       <ID>OP_SET_DESTINATION</ID>   </SUPPORT_OPERATION>   <APP_HTML5_ID>1111</APP_HTML5_ID>   <APP_NAME>       <EN>テスト地図C</EN>   </APP_NAME>   <APP_TOP_URL>http://www.aaa.com/?priority=1&amp;navitype=1</APP_TOP_URL></APP_INFO></APPS>';
            // appXml = $.parseXML(aaa);
            // queryParseFlg = true;
            // queryParseFlg = false;

            //内容チェック
            if (appXml == undefined || appXml == null || appXml == "") {
                //エラー処理が必要な場合記入
                // OKボタンを非活性
                $("#delegationSelect_ok").button('disable');
                return;
            }

            //ネイティブナビ利用可否情報を取得
            var nativenaviInfo = getMemoryNativeNaviInfo();
            var isMatchedAreaFlag = false;
            var appTopUrl = "";
            var querys = [];
            var allowedArea = "";
            var areas = [];
            //優先度格納用変数
            var priority = "";
            //地図アプリリストのID付け用変数
            var delegationNo = 1;
            //HTML格納変数
            var msg = "";
            //優先度比較用変数
            var priorityRank = Number.MAX_VALUE;
            //KVS(use_navi)に代入する値
            var navitype = "";
            //OKボタンハッチング判定フラグ
            var hatchingFlg = true;
            // 利用地域
            var launcherUserArea = getMemoryUserArea();
            //RTL有効/無効
            var isEnabledRtl = getMemoryEnabledRtl();

            //優先度クエリを参照する必要があるかチェック
            if (queryParseFlg == true) {

                //アプリ情報から地図アプリ検索
                $(appXml).find("APP_INFO").each(function (i) { // break=return false;

                    allowedArea = "";
                    isMatchedAreaFlag = false;
                    priority = "";
                    navitype = "";

                    // サポート ID が付与されているアプリのみ、地図アプリと判定
                    var supportOperation = $(this).find("SUPPORT_OPERATION");
                    if (supportOperation != undefined && supportOperation != null && supportOperation != "") {
                        if (supportOperation.find("ID").text().indexOf("OP_SET_DESTINATION") == 0) {
                            // ネイティブナビのポリシーの場合
                            if(judgeNativeNaviPolicy(supportOperation.find("ID").text())){
                                if(!judgeCanUseNativeNavi(nativenaviInfo)){
                                    // ネイティブナビ利用不可の場合(eachをcontinue)
                                    return true;
                                }
                            }

                            appTopUrl = $(this).find("APP_TOP_URL").text();
                            //APP_TOP_URLからクエリパラメータを取得
                            querys = appTopUrl.split("?");
                            if (querys.length == 2) {
                                //各クエリ取得
                                querys = querys[1].split("&");
                                for (var i = 0; i < querys.length; i++) {
                                    //priorty取り出し
                                    if (querys[i].indexOf("priority") != -1) {
                                        priority = querys[i];
                                    }
                                    //use_navi取得
                                    if (querys[i].indexOf("navitype") != -1) {
                                        navitype = querys[i];
                                    }
                                    //allowedArea取得
                                    if (querys[i].indexOf("allowedArea") != -1) {
                                        allowedArea = querys[i];
                                    }
                                }

                                // ユーザ設定地域を取得し、アプリ設定地域と比較
                                if (allowedArea != undefined && allowedArea != null && allowedArea != "") {
                                    //複数の利用可能地域(AllowedArea)がある場合の対応
                                    allowedArea = decodeURIComponent(allowedArea);
                                    areas = allowedArea.split(",");
                                    //allowedArea=　　切り取り
                                    areas[0] = areas[0].replace(/allowedArea=/g, "");
                                    if (areas.length >= 2) {
                                        for (var j = 0; j < areas.length; j++) {
                                            if (areas[j] == launcherUserArea) {
                                                isMatchedAreaFlag = true;
                                                break;
                                            }
                                        }
                                    } else {
                                        if (areas[0] == launcherUserArea) {
                                            isMatchedAreaFlag = true;
                                        }
                                    }
                                } else {
                                    isMatchedAreaFlag = true;
                                }

                                // 地域が合わない場合、表示しない
                                if (isMatchedAreaFlag == false) {
                                    return;
                                }

                                if (navitype != undefined && navitype != null && navitype != "") {
                                    //navitype=　　切り取り
                                    navitype = navitype.replace(/navitype=/g, "");
                                } else {
                                    //異常値(クエリが無い場合も含む)の場合"0"
                                    navitype = "0";
                                }

                                // priority 設定値が有効か判定
                                var valiablePriorityFlag = false;
                                if (priority != undefined && priority != null && priority != "") {
                                    priority = priority.replace(/priority=/g, "");
                                    priority = parseInt(priority, 10);
                                    if (priority != NaN && priority > 0) {
                                        valiablePriorityFlag = true;
                                    }
                                }

                                if (valiablePriorityFlag) {
                                    //優先度が複数存在する
                                    if (hatchingFlg == false) {
                                        if (priorityRank >= priority) {
                                            priorityRank = priority;
                                            //checked有り
                                            msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " checked='checked' />"
                                                + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                            delegationNo++;
                                        } else {
                                            //checked無し
                                            msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " />"
                                                + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                            delegationNo++;
                                        }
                                    } else {
                                        hatchingFlg = false;
                                        priorityRank = priority;
                                        //checked有り
                                        msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " checked='checked' />"
                                            + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                        delegationNo++;
                                    }
                                } else {
                                    //checked無し
                                    msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " />"
                                        + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                    delegationNo++;
                                }
                            } else {
                                //地図アプリ(OP_SET_DESTINATIONが存在している)だが、クエリが無い場合
                                //checked無し
                                msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " />"
                                    + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                delegationNo++;
                            }
                        }
                    }
                });
            } else {
                $(appXml).find("APP_INFO").each(function (i) { // break=return false;

                    allowedArea = "";
                    isMatchedAreaFlag = false;

                    // サポート ID が付与されているアプリのみ、地図アプリと判定
                    var supportOperation = $(this).find("SUPPORT_OPERATION");
                    if (supportOperation != undefined && supportOperation != null && supportOperation != "") {
                        if (supportOperation.find("ID").text().indexOf("OP_SET_DESTINATION") == 0) {
                            // ネイティブナビのポリシーの場合
                            if(judgeNativeNaviPolicy(supportOperation.find("ID").text())){
                                if(!judgeCanUseNativeNavi(nativenaviInfo)){
                                    // ネイティブナビ利用不可の場合(eachをcontinue)
                                    return true;
                                }
                            }

                            appTopUrl = $(this).find("APP_TOP_URL").text();
                            //APP_TOP_URLからクエリパラメータを取得
                            querys = appTopUrl.split("?");
                            if (querys.length == 2) {
                                //各クエリ取得
                                querys = querys[1].split("&");
                                for (var i = 0; i < querys.length; i++) {
                                    //use_navi取得
                                    if (querys[i].indexOf("navitype") != -1) {
                                        navitype = querys[i];
                                        //navitype=　　切り取り
                                        navitype = navitype.replace(/navitype=/g, "");
                                    }
                                    //allowedArea取得
                                    if (querys[i].indexOf("allowedArea") != -1) {
                                        allowedArea = querys[i];
                                    }
                                }
                            }

                            // ユーザ設定地域を取得し、アプリ設定地域と比較
                            if (allowedArea != undefined && allowedArea != null && allowedArea != "") {
                                //複数の利用可能地域(AllowedArea)がある場合の対応
                                allowedArea = decodeURIComponent(allowedArea);
                                areas = allowedArea.split(",");
                                //allowedArea=　　切り取り
                                areas[0] = areas[0].replace(/allowedArea=/g, "");
                                if (areas.length >= 2) {
                                    for (var j = 0; j < areas.length; j++) {
                                        if (areas[j] == launcherUserArea) {
                                            isMatchedAreaFlag = true;
                                            break;
                                        }
                                    }
                                } else {
                                    if (areas[0] == launcherUserArea) {
                                        isMatchedAreaFlag = true;
                                    }
                                }
                            } else {
                                isMatchedAreaFlag = true;
                            }

                            // 地域が合わない場合、表示しない
                            if (isMatchedAreaFlag == false) {
                                return;
                            }

                            if (navitype != 0 && navitype != 1 && navitype != 2) {
                                //異常値(クエリが無い場合も含む)の場合"0"
                                navitype = "0";
                            }
                            //KVSの値と一致していればcheckedを付ける
                            if ($(this).find("APP_HTML5_ID").text() == useNaviAppId) {
                                hatchingFlg = false;
                                //checked有り
                                msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " checked='checked' />"
                                    + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                delegationNo++;
                            } else {
                                //checked無し
                                msg += "<input id='delegation_" + delegationNo + "' " + "name='delegation' type='radio' value=" + $(this).find("APP_HTML5_ID").text() + "," + navitype + " />"
                                    + "<label for='delegation_" + delegationNo + "' class='" + (isEnabledRtl ? HarmanOTA.UI.RTL_ALIGN_RIGHT_CLASS : "") + "'>" + "<div  id='DELEGATION_" + delegationNo + "'>" + $(this).find("APP_NAME").find(langTag).text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + "</div></label>";
                                delegationNo++;
                            }
                        }
                    }
                });
            }

            //ハッチングフラグをメモリに格納
            setMemoryHatchingFlg(hatchingFlg);

            //前回appendした要素をクリア　※デリゲーション切り替えページでOKボタンが押下された場合の要素クリアだと端末BACKキーに対応しないのでappend前にクリア
            $("#delegationList label div").remove();
            $("#delegationList label").remove();
            $("#delegationList input").remove();

            //作成したリスト要素をappend
            $("#delegationList").append(msg);

            //デリゲーション一覧表示ページでOKボタンが押下された時にappendした要素を削除しているため、list(content)の範囲にCSSを適用
            $("#triggerTarget").trigger("create");
            $.mobile.changePage("#delegationPage", { transition: "none" });

        });

        $("#delegationPage").on("pagebeforeshow", function () {

            var hatchingFlg = getMemoryHatchingFlg();

            if (hatchingFlg == true) {
                // OKボタンを非活性
                $("#delegationSelect_ok").button('disable');
            }
        });
    })
    } catch (e) {
        console.log("[E][MORE]MWS init failure !");
        this.init();
    }

};
//----------------------------------------------------
//『BACK』ボタン押下（利用地域選択画面）
function toConfig() {
    console.log("[Config][local select field] back button!");
    history.back();
//    location.href = 'index.html';
};
//----------------------------------------------------


// main処理を関数化 2016/11 iOS10.1対応(拡張API非同期化)

function delegationInit(pidList) {

    console.log("#9325 delegationInit getPdelegationInitidList() start");

    var d = $.Deferred();
    var _this = this;

    if (pidList != undefined && pidList != null && pidList.length > 0) {
        var pid = pidList[0];
        //PIDリストをメモリに保存
        setMemoryPidList(pidList);
        console.log("#9325 delegationInit : pidList != error");
    } else {
        //Commonクラスメモリ解放
        g_c = null;
        // 進捗インジケータを非表示
        $.mobile.hidePageLoadingMsg();
        console.log("#9325 delegationInit : pidList == error");
        console.log("#9325 delegationInit hidePageLoadingMsg");
 
        //取得失敗時(getPidList)はリターン　※接続履歴が無い場合もデリゲーション切り替えはさせないのでリターンでOK
        setTimeout(function() {
            console.log("#9325 delegationInit d.resolve(); [no pidList]");
            d.resolve();
        }, 0);
        console.log("#9325 delegationInit d.promise(); [no pidList]");
        return d.promise();
    }
    //端末情報を取得
    var appInfo = getMemoryAppInfo();
    //内容チェック
    if (appInfo != undefined && appInfo != null && appInfo != "") {
        //JSONパース
        var appInfoJson = JSON.parse(appInfo);
    }
    //アプリ情報取得
    appXml = g_c.getAppList(pid, g_c.addCurrencyInfo(getDeviceLanguage(), appInfoJson.country));
    //内容チェック
    if (appXml != undefined && appXml != null && appXml != "") {
        //アプリ情報をメモリに保存
        setMemoryAppListXML(appXml);
        setMemoryAppListPID(pid);
        console.log("#9325 delegationInit :  getAppList != error");
    } else {
        //Commonクラスメモリ解放
        g_c = null;
        // 進捗インジケータを非表示
        $.mobile.hidePageLoadingMsg();
        console.log("#9325 delegationInit :  getAppList == error");
        console.log("#9325 delegationInit hidePageLoadingMsg");
        //取得失敗時(AppList)はリターン
        setTimeout(function() {
            console.log("#9325 delegationInit d.resolve(); [no AppList]");
            d.resolve();
        }, 0);
        console.log("#9325 delegationInit d.promise(); [no AppList]");
        return d.promise();
    }

    //選択中地図アプリ情報取得
    var useNavi = "";
    _this.getKeyValue("use_navi")
    .then(function(data) {
        useNavi =  data;
        _this.useNaviCheck(useNavi)
        .then(function() {
            console.log("#9325 delegationInit d.resolve(); [1]");
            d.resolve();
            return;
        },
        function() {
            console.log("#9325 delegationInit d.resolve(); [2]");
            d.resolve();
            return;
        });
    },
    function() {
        _this.useNaviCheck(useNavi)
        .then(function() {
            console.log("#9325 delegationInit d.resolve(); [3]");
            d.resolve();
            return;
        },
        function() {
            console.log("#9325 delegationInit d.resolve(); [4]");
            d.resolve();
            return;
        });
    });

    console.log("#9325 delegationInit d.promise();");
    return d.promise();
};

// use_naviの
function useNaviCheck(useNavi) {
    console.log("#9325 useNaviCheck() start");
    var d = $.Deferred();
    var _this = this;

    var launcherUserArea = getMemoryUserArea();
    //内容確認
    if (useNavi != undefined && useNavi != null && useNavi != "") {

        //端末情報をメモリに保存
        setMemoryUseNavi(useNavi);
        //JSONパース
        var useNaviJson = JSON.parse(useNavi);
        //KVSに格納されているアプリID
        var useNaviAppId = useNaviJson.use_navi_appid;
    } else {
        //KVSに値が無い場合""
        var useNaviAppId = "";
    }
    if (launcherUserArea == undefined || launcherUserArea == null || launcherUserArea == "") {
        //""と一致させるためにKVSに値が無ければ代入
        launcherUserArea = "";
    }
    // ネイティブナビ利用可否情報を取得（車載機Launcherが判定した結果のKVS値を取得）
    var nativenaviInfo = null;
    var pid = getMemoryAppListPID();
    if(pid != null){
        _this.getKeyValue(encodeURIComponent(pid))
        .then(function(data) {
            if(data != null){
                nativenaviInfo = JSON.parse(data);
            }
            _this.showDelegationButton(nativenaviInfo, useNaviAppId)
            .then(function() {
                d.resolve();
                return;
            },
            function() {
                d.resolve();
                return;
            });
        },
        function() {
            // 本来通らない処理
            _this.showDelegationButton(nativenaviInfo, useNaviAppId)
            .then(function() {
                d.resolve();
                return;
            },
            function() {
                d.resolve();
                return;
            });
        });
    }
    return d.promise();
};

//デリゲーション切り替えボタンを表示するか否か
function showDelegationButton(nativenaviInfo, useNaviAppId) {
    console.log("#9325 showDelegationButton() start");

    var d = $.Deferred();
    var appTopUrl = "";
    var querys = [];
    var allowedArea = "";
    //NaviCnt == 1　だった時のKVS保存時に使用　※クエリに"navitype"が無かった場合デフォルトの"0"(その他)
    var tmpNaviType = "0";
    //KVS(use_navi)クリアフラグ true=クリア
    var useNaviClearFlg = true;
    //アプリDLサイトURLに登録されている利用地域
    var areas = [];
    //NaviCnt == 1　だった時のKVS保存時に使用
    var tmpAppId = "";
    //アプリ情報XML
    var appXml = getMemoryAppListXML();
    //ネイティブナビ利用可否判定情報を取得
    var appListPID = getMemoryAppListPID();
    //地図アプリ数カウンタ
    var naviCnt = 0;
    //カウントアップフラグ(利用地域が一致していればカウントアップ)
    var cntUpFlg = false;
    //ネイティブナビ情報を保持
    this.setMemoryNativeNaviInfo(nativenaviInfo);

    var _this = this;

    //アプリ情報から地図アプリ検索
    $(appXml).find("APP_INFO").each(function (i) { // break=return false;

        // サポート ID が付与されているアプリのみ、地図アプリと判定
        var supportOperation = $(this).find("SUPPORT_OPERATION");
        if (supportOperation != undefined && supportOperation != null && supportOperation != "") {
            if (supportOperation.find("ID").text().indexOf("OP_SET_DESTINATION") == 0) {
                // ネイティブナビのポリシーの場合
                if(judgeNativeNaviPolicy(supportOperation.find("ID").text())){
                    if(!judgeCanUseNativeNavi(nativenaviInfo)){
                        // ネイティブナビ利用不可の場合(eachをcontinue)
                        return true;
                    }
                }
                appTopUrl = $(this).find("APP_TOP_URL").text();
                //APP_TOP_URLからクエリパラメータを取得
                querys = appTopUrl.split("?");
                if (querys.length == 2) {
                    //クエリパラメータ分割
                    querys = querys[1].split("&");
                    //各クエリ取得
                    for (var i = 0; i < querys.length; i++) {
                        //allowedArea取り出し
                        if (querys[i].indexOf("allowedArea") != -1) {
                            allowedArea = querys[i];
                        }
                        //navitype 取り出し
                        if (querys[i].indexOf("navitype") != -1) {
                            //navitype取得
                            tmpNaviType = querys[i].replace(/navitype=/g, "");
                            if (tmpNaviType != "0" && tmpNaviType != "1" && tmpNaviType != "2") {
                                //"0"(その他),"1"(magellan),"2"(NATIVE_NAVI),以外は全て"0"(その他)
                                tmpNaviType = "0";
                            }
                        }
                    }
                    if (allowedArea != undefined && allowedArea != null && allowedArea != "") {
                        //複数の利用可能地域(AllowedArea)がある場合の対応
                        allowedArea = decodeURIComponent(allowedArea);
                        areas = allowedArea.split(",");
                        //allowedArea=　　切り取り
                        areas[0] = areas[0].replace(/allowedArea=/g, "");

                        var launcherUserArea = _this.getMemoryUserArea();
                        if (areas.length >= 2) {
                            for (var j = 0; j < areas.length; j++) {
                                if (areas[j] == launcherUserArea) {
                                    cntUpFlg = true;
                                    break;
                                }
                            }
                        } else {
                            if (areas[0] == launcherUserArea) {
                                cntUpFlg = true;
                            }
                        }
                    } else {
                        //地図アプリ(OP_SET_DESTINATIONが存在している)だが、allowedAreaが無い場合は地図アプリとする
                        cntUpFlg = true;
                    }
                } else {
                    //地図アプリ(OP_SET_DESTINATIONが存在している)だが、クエリが無い場合は地図アプリとする
                    cntUpFlg = true;
                }
                //アプリIDを比較(PIDを切り替えた等で前に選択していた地図アプリがアプリ情報に無かった時の処理)
                if ($(this).find("APP_HTML5_ID").text() == useNaviAppId) {
                    useNaviClearFlg = false;
                }
                //使用できる地図アプリがあればカウントアップ
                if (cntUpFlg == false) {
                    //無ければリターン
                    return true;
                }
                naviCnt++;
                //NaviCnt == 1　だった時のKVS保存用 AppId
                tmpAppId = $(this).find("APP_HTML5_ID").text();
            }
        }
        cntUpFlg = false;
    });

    //地図アプリの数によって処理を変える
    if (naviCnt == 0) {
        //KVSクリアし、リターン
        //KVS(use_navi)に格納する"use_navi_appid"
        var setValueId = "";
        //KVS(use_navi)に格納する"use_navi"
        var setValueNo = "";

        //KVS(use_navi)に格納するValue
        var obj = {
            "use_navi" : setValueNo,
            "use_navi_appid" : setValueId
        };
        // KVS(use_navi)に値を書き込み
        obj = JSON.stringify(obj);
        console.log("start  setKeyValue  use_navi ," + obj);
        _this.setKeyValue("use_navi", obj)
        .then(function() {
            //メモリ上に保存
            setMemoryUseNavi(obj);
            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  naviCnt == 0");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        },
        function() {
            //メモリ上に保存
            setMemoryUseNavi(obj);
            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  naviCnt == 0");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        });
    } else if (naviCnt == 1) {
        //数値に変換
        //KVS(use_navi)に格納する"use_navi"
        var setValueNo = parseInt(tmpNaviType,10);
        //KVS(use_navi)に格納する"use_navi_appId"
        var setValueId = parseInt(tmpAppId,10);
        //内容チェック
        if (setValueId != NaN) {
            if (setValueNo != 0 && setValueNo != 1 && setValueNo != 2) {
                //規定値以外は"0(その他)"
                setValueNo = 0;
            }
            //KVS(use_navi)に格納するValue
            var obj = {
                "use_navi": setValueNo,
                "use_navi_appid": setValueId
            };
        } else {
            //AppIdが取得できなければクリア
            var obj = {
                "use_navi": "",
                "use_navi_appid": ""
            };
        }
        // KVS(use_navi)に値を書き込み
        obj = JSON.stringify(obj);
        console.log("start  setKeyValue  use_navi ," + obj);
        _this.setKeyValue("use_navi", obj)
        .then(function() {
            //メモリ上に保存
            setMemoryUseNavi(obj);

            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  naviCnt == 1");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        },
        function() {
            //メモリ上に保存
            setMemoryUseNavi(obj);

            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  naviCnt == 1");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        });

    } else if (useNaviClearFlg == true) {
        //KVS(use_navi)に格納する"use_navi_appid"
        var setValueId = "";
        //KVS(use_navi)に格納する"use_navi"
        var setValueNo = "";
        //KVS(use_navi)に格納するValue
        var obj = {
            "use_navi": setValueNo,
            "use_navi_appid": setValueId
        };
        // KVS(use_navi)に値を書き込み
        obj = JSON.stringify(obj);
        console.log("start  setKeyValue  use_navi ," + obj);
        _this.setKeyValue("use_navi", obj)
        .then(function() {
            //メモリ上に保存
                setMemoryUseNavi(obj);
            //デリゲーション切り替えボタン表示
            $("#delegationSelectField").show();
            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  useNaviClearFlg == true");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        },
        function() {
            //メモリ上に保存
            setMemoryUseNavi(obj);
            //デリゲーション切り替えボタン表示
            $("#delegationSelectField").show();
            //Commonクラスメモリ解放
            g_c = null;
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showDelegationButton :  useNaviClearFlg == true");
            console.log("#9325 hidePageLoadingMsg");
            d.resolve();
            return;
        });
    } else {
        //デリゲーション切り替えボタン表示
        $("#delegationSelectField").show();
        //Commonクラスメモリ解放
        g_c = null;
        // 進捗インジケータを非表示
        $.mobile.hidePageLoadingMsg();
        console.log("#9325 showDelegationButton :  else");
        console.log("#9325 hidePageLoadingMsg");
        d.resolve();
        return;
    }
    return d.promise();
};


//『BACK』ボタン押下
function toAppTab() {

    getKeyValue("launcher_url_phone")
    .then(function(data) {
        location.href = data;
    },
    function() {

    });
    //----------------------------------------------------
    //getKeyValue
    function getKeyValue(key){
        console.log("#9325  getKeyValue() start");
        var d = $.Deferred();
        var	value = null;
        var kvsurl = mwsDomainWithPort + "kvs/" + key + "/";
        $.ajax({
            type: "GET",		//HTTPメソッド
            url: kvsurl,		//URL
            async: true,		//同期
            timeout: 5000,		//タイムアウト
            success: function (data, status, xhr) {
                console.log("#9325 getKeyValue() success " + kvsurl + " GET status=" + status + " code=" + xhr.status);
                value = xhr.responseText;
                d.resolve(value);
            },
            error: function (xhr, status, err) {
                console.log("#9325 getKeyValue error " + kvsurl + " GET status=" + status + " code=" + xhr.status + " err=" + err);
                d.resolve();
            }
        });
        return d.promise();
    }
};

$(document).delegate("#configpage", "pageshow", function (prepage) {
    //	initLan();
});

/**
 * jquery-confirm用ボタン文言取得
 * @params keyValue wordクラスに記載されている表示文言に対応した定義名
 * @params language 言語情報  例 : en_US
 * @return msg 設定言語に対応した表示文言
 */
function getButtonsMessage(keyValue, language) {
    //Wordクラスインスタンス化
    var w = new Word();
    var msg = "";
    keyValue= keyValue +"_";

    // 言語が取得できなかった場合、英語を指定
    if (language == null || language == undefined || language == "") {
        language = "en_US";
    }
    
    eval(w.createWordingToEval("msg", "w", keyValue, language));
    
    //インスタンス化したWordクラスを解放するためにnull代入
    w = null;
    return msg;
};


/**
 * キャッシュクリアボタン押下時のconfirmダイアログ用メッセージ取得　2015/12/24　ferix布生
 * @params keyValue wordクラスに記載されている表示文言に対応した定義名
 * @params language 言語情報  例 : en_US
 * @return msg 設定言語に対応した表示文言
 */

function getConfirmMessage(keyValue, language) {
    
    //Wordクラスインスタンス化
    var w = new Word();
    var msg = "";
    
    // 言語が取得できなかった場合、英語を指定
    if (language == null || language == undefined || language == "") {
        language = "en_US";
    }
    
    if (keyValue === "CONFIG_005") {
        eval(w.createWordingToEval("msg", "w", "CONFIG_005_", language));
    } else if (keyValue === "CONFIG_006") {
        eval(w.createWordingToEval("msg", "w", "CONFIG_006_", language));
    } else if (keyValue === "CONFIG_013") {
        eval(w.createWordingToEval("msg", "w", "CONFIG_013_", language));
    }
    
    //インスタンス化したWordクラスを解放するためにnull代入
    w = null;
    return msg;
};
/**
 * 端末に設定されている言語情報を取得する
 * @return 言語情報(例：ja_JP,en_US)
 */
function getDeviceLanguage() {

    //Common.log("getDeviceLanguage() start");
    console.log("#9325 getDeviceLanguage() start")

    //Wordクラスの変数を使用するのでインスタンス化
    var w = new Word();

    var res = "";

    var appInfoJson = getMemoryAppInfo();

    //内容チェック
    if (appInfoJson != undefined && appInfoJson != null && appInfoJson != "") {
        //JSON形式にparse
        var appInfo = JSON.parse(appInfoJson);
        if (appInfo.language != undefined && appInfo.language != null && appInfo.language != "") {
            var language = appInfo.language;
            // Android と iPhone のロケール情報の違いを吸収   en-GB  → en_GB
            language = language.replace("-", "_");
            var langArray = language.split("_");
            var langFirst = langArray[0];
            //langArray.lengthをチェック
            if (langArray.length == 1) {
                if (langFirst == "ja") {
                    res = "ja_JP";
                }
                else if (langFirst == "de") {
                    res = "de_DE";
                }
                else if (langFirst == "it") {
                    res = "it_IT";
                }
                else if (langFirst == "ru") {
                    res = "ru_RU";
                }
                else if (langFirst == "sv") {
                    res = "sv_SV";
                }
                else if (langFirst == "nl") {
                    res = "nl_NL";
                }
                else if (langFirst == "pl") {
                    res = "pl_PL";
                }
                else if (langFirst == "el") {
                    res = "el_EL";
                }
                else if (langFirst == "cs") {
                    res = "cs_CS";
                }
                else {
                    //OSのチェック
                    var devOS = appInfoJson.os;
                    if (devOS == "ios") {
                        //iPhoneの場合
                        if (langFirst == "en") {
                            //端末の設定言語がイギリス英語なら get-appinfoで "en_GB" が取得できるため
                            res = "en_US";
                        }
                        else if (langFirst == "fr") {
                            //端末の設定言語がカナダフランスなら get-appinfoで "fr_CA" が取得できるため
                            res = "fr_FR";
                        }
                        else if (langFirst == "es") {
                            //端末の設定言語がメキシコなら get-appinfoで "es_MX" が取得できるため
                            res = "es_ES";
                        }
                    }
                    else {
                        //Androidの場合 (iPhoneの場合 appInfo.locale の値が信頼できないため、上記処理を行う)
                        res = appInfoJson.locale;
                        //メキシコだけes_USが返るので対応
                        if (res == "es_US") {
                            res = "es_MX";
                        }
                    }
                }
            }
            else {
                res = language;
            }
            var langMatchFlag = false;
            var langList = w.langList;
            var i = 0;
            if (langList != null) {
                for (i = 0; i < langList.length; i++) {
                    if (res == langList[i]) {
                        langMatchFlag = true;
                        break;
                    }
                }
                if (langMatchFlag == false) {
                    // 端末で設定された言語がサポートされていなければ、英語を設定
                    res = "en_US";
                }
            }
            else {
                // 端末で設定された言語がサポートされていなければ、英語を設定
                res = "en_US";
            }
        }
        else {
            // 言語設定が無い場合は、アメリカ英語表示
            res = "en_US";
        }
    } else {
        // 取得失敗時は、アメリカ英語表示
        res = "en_US";
    }
    //Common.log("language : " + res);
    //Common.log("getDeviceLanguage() true end");
    console.log("#9325 getDeviceLanguage() end")
    return res;
};

/**
 * 言語変換を実施する。
 * Androidの言語コードに注意
 * MCMライブラリのLocaleUtilクラスにて変更を実施。
 * 
 * 
 * 
 * @param language ja_JPなど
 */
function convertHarmanOTALanguage(appInfo) {

    var language = appInfo.language;
    var country = appInfo.country;
    if (g_supportedFunction.get_appinfo_v2) {
        language = appInfo.v2.language;
        country = appInfo.v2.country;
    }

    var res = null;

    if (language == "ja") {
        res = "ja_JP";
    } else if (language == "fr") {
        if (country == "CA") {
            res = language + "_" + country;
        } else {
            res = language + "_FR";
        }
    } else if (language == "de") {
        res = "de_DE";
    } else if (language == "it") {
        res = "it_IT";
    } else if (language == "ru") {
        res = "ru_RU";
    } else if (language == "sv") {
        res = "sv_SV";
    } else if (language == "nl") {
        res = "nl_NL";
    } else if (language == "ar") {
        res = "ar";
    } else if (language == "pt") {
        if (country == "BR") {
            res = "pt_BR";
        } else {
            res = "pt";
        }
    } else if (language == "nb" || language == "nn" || language == "no") {
        res = "no";
    } else if (language == "zh") {

        if (country == "TW") {
            res = language + "_" + country;
        } else {
            res = language + "_CN";
        }

        // get-appinfo v2対応版のスマホの場合
        if (g_supportedFunction.get_appinfo_v2) {
            if (appInfo.v2.script.indexOf("Hans") != -1) {
                res = "zh_CN";
            } else if (appInfo.v2.script.indexOf("Hant") != -1) {
                res = "zh_TW";
            }
        }

    } else if (language == "ms") {
        res = "ms";
    } else if (language == "th") {
        res = "th";
    } else if (language == "fil" || language == "tl") {
        res = "fil";
    } else if (language == "he" || language == "iw") {
        res = "he";
    } else if (language == "es") {
        if (country == "ES") {
            res = language + "_" + country;
        } else {
            res = language + "_MX";
        }
    } else if (language == "en") {
        if (country == "GB") {
            res = language + "_" + country;
        } else {
            res = language + "_US";
        }
    }

    if (res == null) {
        var w = new Word();
        res = language;
        var langMatchFlag = false;
        var langList = w.otaLangList;
        var i = 0;
        if (langList != null) {
            for (i = 0; i < langList.length; i++) {
                if (res == langList[i]) {
                    langMatchFlag = true;
                    break;
                }
            }
            if (langMatchFlag == false) {
                // 端末で設定された言語がサポートされていなければ、英語を設定
                res = "en_US";
            }
        }
        w = null;
    }
    return res;
}
/**
 * 端末に設定されている言語情報を取得する
 * @return 言語情報(例：ja_JP,en_US)
 */
function getDeviceHarmanOTALanguage() {
    console.log("#9325 getDeviceHarmanOTALanguage() start")

    //Wordクラスの変数を使用するのでインスタンス化
    var w = new Word();

    var res = null;

    var appInfoJson = getMemoryAppInfo();

    //内容チェック
    if (appInfoJson != undefined && appInfoJson != null && appInfoJson != "") {
        //JSON形式にparse
        var appInfo = JSON.parse(appInfoJson);
        if (appInfo.language != undefined && appInfo.language != null && appInfo.language != "") {


            var res = convertHarmanOTALanguage(appInfo);

            if (res == null) {
                res = "en_US";
            }
        } else {
            // 言語設定が無い場合は、アメリカ英語表示
            res = "en_US";
        }
    } else {
        // 取得失敗時は、アメリカ英語表示
        res = "en_US";
    }
    console.log("#9325 getDeviceHarmanOTALanguage() end")
    return res;
};
/**
 * スマホアプリ情報を取得する
 * @return スマホアプリ情報の JSON
 */
function getAppInfo() {
    //Common.log("getAppInfo() start");
    console.log("#9325 getAppInfo() start")
    var res = "";
    var d = $.Deferred();

    // MWSからデータを取得
    var url = mwsDomainWithPort + "get-appinfo/";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: true,
            success: function (data, status, xhr) {
                console.log("#9325 getAppInfo() success data=" + data + "status=" + status + "res=" + xhr.responseText)
                res = xhr.responseText;
                // メモリに端末情報を保存
                setMemoryAppInfo(res);
                d.resolve();
                return;
            },
            error: function (xhr, status, err) {
                console.log("#9325 getAppInfo() error：スマホアプリ情報取得 url=" + url + " (status = " + status + ", code=" + xhr.status + ")");
                //Common.log("エラー：スマホアプリ情報取得 url=" + url + " (status = " + status + ", code=" + xhr.status + ")");
                d.resolve();
                return;
            }
        });

    // Common.log("getAppInfo() end");
    return d.promise();
};

/**
 * 指定言語にて、画面上の文言を表示
 *@params language 言語情報  例 : en_US
 */
function setDisplayWords(language, appInfo) {
    console.log("#9325 setDisplayWords() start")

    //Wordクラスの変数を使用するのでインスタンス化
    var w = new Word();

    // 言語が取得できなかった場合、英語を指定
    if (language == null || language == undefined || language == "") {
        language = "en_US";
    }

    var msg = "";
    var $target = null;
    var isEnabledRtl = getMemoryEnabledRtl();

    // BACKボタン文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_001_", language));
    $target = $("#Car_TXT_0056_3");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);

    // // ヘッダー文言
    //eval(w.createWordingToEval("msg", "w", "OTHER_001_", language));
    // $target = $("#Car_TXT_0078");
    // $target.html(msg);
    // HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);

    //画面表示文言（Head unit Update settings ボタンラベル）
    eval(w.createWordingToEval("msg", "w", "SL_TXT_0192_", language));
    $target = $("#huupdsetting");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言（Head unit Update settings 説明ラベル1）
    eval(w.createWordingToEval("msg", "w", "SL_TXT_0193_", language));
    $target = $("#huupdlabel");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言（Head unit Update settings 説明ラベル2）
    eval(w.createWordingToEval("msg", "w", "SL_TXT_0191_", language));
    $target = $("#huupdlicenselabel");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target.parent(), isEnabledRtl, true);
    
    //画面表示文言（MOTAマニュアルサイトへのリンク）
    eval(w.createWordingToEval("msg", "w", "HTML_TXT_0246_", language));
    $target = $("#manualTitle");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    eval(w.createWordingToEval("msg", "w", "HTML_TXT_0247_", language));
    $target = $("#manualText");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    
    //画面表示文言（利用規約ラベル）
    eval(w.createWordingToEval("msg", "w", "CONFIG_011_", language));
    $target = $("#terms");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言（利用規約更新日）
    eval(w.createWordingToEval("msg", "w", "SL_TXT_0189_", language));
    $target = $("#termsupdate");
    msg = msg.replace("*", convertDate(termsOfServiceUpdateDate));

    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);

    // var date = convertDate(new Date());
    // var $target = $("#termsupdateValue");
    // $target.html(date == "Invalid Date" ? "-" : date);
    // HarmanOTA.Common.cancelRtl($target);  
    
    
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_003_", language));
    $target = $("#Car_TXT_00521");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_004_", language));
    $target = $("#Car_TXT_00523");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //キャッシュクリアボタン
    eval(w.createWordingToEval("msg", "w", "CONFIG_007_", language));
    $target = $('#clrcarinfo');
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //利用地域画面文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_008_", language));
    $target = $('#locationselect');
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //利用地域画面文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_009_", language));
    $target = $("#Car_TXT_0x521");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //利用地域画面文言
    eval(w.createWordingToEval("msg", "w", "CONFIG_010_", language));
    $target = $("#Car_TXT_0x523");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "DELEGATION_001_", language));
    $target = $("#delegationSelect");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "DELEGATION_002_", language));
    $target = $("#dispNaviApp");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, true);
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "DELEGATION_003_", language));
    $target = $("#DELEGATION_TITLE_001");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    //画面表示文言
    eval(w.createWordingToEval("msg", "w", "DELEGATION_004_", language));
    $target = $("#DELEGATION_TITLE_002");
    $target.html(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    $target = $("#delegationList");
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    // OKボタン
    $target = $("#delegationSelect_ok").closest("div");
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    //アプリバージョン表示
    //通信回数を考慮(暫定処置) 2016/0609実装によりonloadでgetAppInfoを行うため
    if (appInfo == undefined || appInfo == null || appInfo == "") {
        appInfo = this.getMemoryAppInfo();
    }
    //取得できたか確認
    if (appInfo == undefined || appInfo == null || appInfo == "") {
        $("#appVerssion").hide();
    } else {
        var appInfoJson = JSON.parse(appInfo);
        $target = $("#appVersion");
        var $label = $target.find(".label");
        eval(w.createWordingToEval("msg", "w", "SL_TXT_0155_", language));
        $label.html(appInfoJson.app_name + "<br />" + msg + (isEnabledRtl ? HarmanOTA.UI.RTL_CTRL : ""));
        var $value = $target.find(".value");
        $value.html(appInfoJson.version);
        HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
        HarmanOTA.Common.cancelRtl($value);
    }
    ////デリゲーション切り替えボタン
    //eval(w.createWordingToEval("msg", "w", "CONFIG_011_", language));
    //$('#delegationSelect .ui-btn-text').text(msg);
    ////デリゲーション切り替え文言
    //eval(w.createWordingToEval("msg", "w", "CONFIG_012_", language));
    //$("#Car_TXT_0x524").html(msg);

    ////=========デリゲーション切り替えページ============
    //eval(w.createWordingToEval("msg", "w", "DEREGATION_001_", language));
    //$("#DELEGATION_TITLE_002").html(msg);

    //Wordクラスメモリ解放
    w = null;
    console.log("#9325 setDisplayWords() end")

};
/**
 * 指定言語にて、画面上の文言を表示
 *@params language 言語情報  例 : en_US
 */
function setDisplayWordsLocationSelect(language) {
    console.log("#9325 setDisplayWordsLocationSelect() start")

    //Wordクラスの変数を使用するのでインスタンス化
    var w = new Word();

    // 言語が取得できなかった場合、英語を指定
    if (language == null || language == undefined || language == "") {
        language = "en_US";
    }

    var msg = "";
    var $target = null;
    var isEnabledRtl = getMemoryEnabledRtl();

    // 利用地域選択画面タイトル
    eval(w.createWordingToEval("msg", "w", "CONFIG_008_", language));
    $target = $("#LOCATION_TITLE_001");
    $target.text("");
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    $target = $("#LOCATION_TITLE_002");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);
    HarmanOTA.Common.enabledRtl($target.parent().closest("div"), isEnabledRtl, false);

    // 日本
    eval("msg = w.LOCATION_001;");
    $target = $("#LOCATION_001");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // アメリカ
    eval("msg = w.LOCATION_002;");
    $target = $("#LOCATION_002");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // カナダ
    eval("msg = w.LOCATION_003;");
    $target = $("#LOCATION_003");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // メキシコ
    eval("msg = w.LOCATION_004;");
    $target = $("#LOCATION_004");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // イギリス
    eval("msg = w.LOCATION_005;");
    $target = $("#LOCATION_005");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // ドイツ
    eval("msg = w.LOCATION_007;");
    $target = $("#LOCATION_006");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // オランダ
    eval("msg = w.LOCATION_008;");
    $target = $("#LOCATION_007");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // イタリア
    eval("msg = w.LOCATION_009;");
    $target = $("#LOCATION_008");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // フランス
    eval("msg = w.LOCATION_006;");
    $target = $("#LOCATION_009");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // スペイン
    eval("msg = w.LOCATION_010;");
    $target = $("#LOCATION_010");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // スウェーデン
    eval("msg = w.LOCATION_011;");
    $target = $("#LOCATION_011");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // ポーランド
    eval("msg = w.LOCATION_012");
    $target = $("#LOCATION_012");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // ギリシャ
    eval("msg = w.LOCATION_013");
    $target = $("#LOCATION_013");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // ロシア
    eval("msg = w.LOCATION_015;");
    $target = $("#LOCATION_014");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // チェコ
    eval("msg = w.LOCATION_014;");
    $target = $("#LOCATION_015");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);

    // 以下3言語はアメリカ英語とする。    
    // ポルトガル
    eval("msg = w.LOCATION_016;");
    $target = $("#LOCATION_016");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // フィンランド
    eval("msg = w.LOCATION_017;");
    $target = $("#LOCATION_017");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);
    // ハンガリー
    eval(w.createWordingToEval("msg", "w", "LOCATION_018_", language));
    $target = $("#LOCATION_018");
    $target.text(msg);
    HarmanOTA.Common.enabledRtl($target.closest("label"), isEnabledRtl, true);

    // OKボタン
    $target = $("#locationselect_ok").closest("div");
    HarmanOTA.Common.enabledRtl($target, isEnabledRtl, false);

    //Wordクラスメモリ解放
    w = null;
    console.log("#9325 setDisplayWordsLocationSelect() end")
};

/**
 * 指定言語にて、画面上のフォントを表示
 *@params language 言語情報  例 : en_US
 */
function changeFontFamilyTW(language) {
    //繁体字
    if(language=="zh_TW"){
        $('body').css({'font-family':'微軟正黑體,"Microsoft JhengHei",PMingLiU'});
    }
};

//===============セッター＆ゲッター============

//設定言語
function getMemoryLanguage() {
    return g_language;
};
function setMemoryLanguage(language) {
    g_language = language;
};
//RTL有効/無効
function getMemoryEnabledRtl(){
    return g_enabledRtl;
}
function setMemoryEnabledRtl(value){
    g_enabledRtl = value;
}
//PIDリスト
function getMemoryPidList() {
    return g_pidList;
};
function setMemoryPidList(pidList) {
    g_pidList = pidList;
};
//アプリ情報一覧(XML)
function getMemoryAppListXML() {
    return g_appListXML;
};
function setMemoryAppListXML(xml) {
    g_appListXML = xml;
};
//アプリ情報一覧PID
function getMemoryAppListPID(){
    return g_appListPID;
}
function setMemoryAppListPID(pid){
	if(pid != null){
		var splitValues = pid.split(" ");
		if(splitValues.length > 1){
			pid = splitValues[0];
		}
	}
    g_appListPID = pid;
}
//端末情報
function getMemoryAppInfo() {
    return g_appInfo;
};
function setMemoryAppInfo(appInfo) {
    console.log("#9325 setMemoryAppInfo() start");
    g_appInfo = appInfo;

    var json = JSON.parse(appInfo);
    if (json.v2 != undefined) {
        g_supportedFunction.get_appinfo_v2 = true;
        g_supportedFunction.harman_mobile_ota = true;
    }
    console.log("#9325 setMemoryAppInfo() end");
};
//選択中地図アプリ情報
function getMemoryUseNavi() {
    return g_useNavi;
};
function setMemoryUseNavi(navi) {
    g_useNavi = navi;
};
//言語タグ(<EN>等、アプリ情報XML内の情報参照時に使用)
function getMemoryLangTag() {
    return g_langTag;
};
function setMemoryLangTag(language) {
    if (language != undefined && language != null && language != "") {
        // 言語タグ
        var langTag = language.toUpperCase();
        langTag = langTag.split("_")[1];
        if (langTag == "JA") {
            langTag = "JP";
        } else if (langTag == "US") {
            langTag = "EN";
        } else if (langTag == "MX") {
            langTag = "ES";
        } else if (langTag == "CA") {
            langTag = "FR";
        } else if (langTag == "GB") {
            langTag = "EN";
        }
    } else {
        langTag = "EN";
    }
    g_langTag = langTag;
};
//ハッチングフラグ
function getMemoryHatchingFlg() {
    return g_hatchingFlg;
};
function setMemoryHatchingFlg(hatchingFlg) {
    g_hatchingFlg = hatchingFlg;
};

//利用地域情報
function getMemoryUserArea() {
    return g_launcherUserArea;
};
function setMemoryUserArea(launcherUserArea) {
    g_launcherUserArea = launcherUserArea;
};

//ネイティブナビ情報
function getMemoryNativeNaviInfo() {
    return g_nativeNaviInfo;
};
function setMemoryNativeNaviInfo(nativeNaviInfo) {
    g_nativeNaviInfo = nativeNaviInfo;
};



