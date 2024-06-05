//----------------------------------------------------------------------------- //
//smt.common.js
//----------------------------------------------------------------------------- //
/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile.d.ts" />
/// <reference path="bxSlider.d.ts" />
/// <reference path="smt.word.ts" />
// Common インスタンスをグローバル化させ、外部から呼べるようにする
// Xcode7.2 対応において、mixed contents が入るまでの暫定対応
var common = null;
/**
 * 列挙型 ログ出力モード
 */
var COMMON_LOG_MODE;
(function (COMMON_LOG_MODE) {
    COMMON_LOG_MODE[COMMON_LOG_MODE["SERVER"] = 0] = "SERVER";
    COMMON_LOG_MODE[COMMON_LOG_MODE["CONSOLE"] = 1] = "CONSOLE";
    COMMON_LOG_MODE[COMMON_LOG_MODE["NONE"] = 2] = "NONE"; // 出力しない
})(COMMON_LOG_MODE || (COMMON_LOG_MODE = {}));
/**
 * Smart Access共通jsライブラリ
 * @class Smart Access共通jsライブラリ
 * @author sugawara
 * @since 2013/11/15
 */
var Common = (function () {
    /**
     * コンストラクタ
     * @params mwsPort MWSのポート。
     * UIEMicroserver.getInstance().getLocalServerPort() から取得したものをセットする
     */
    function Common(mwsDomainWithPort) {
        // インスタンス変数
        this.mwsDomainWithPort = "";
        this.w = null;
        this.msg = "";
        this.ErrorMsg = "";
        this.base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        // 定数
        this.DEFAULT_PID = "DEFAULT999999501"; //"DEFAULT999999501";	// pidと接続したことがない場合、アプリ情報の取得時に利用されるpid
        this.CONSUMER_KEY_SAT01 = "3e581baef87bf953ce68c0f66feb2e5c08257083fd3bd8fa44916a44b3711ed4"; // sat01用
        this.CONSUMER_SECRET_SAT01 = "9542aec6daae9f3b22c4f21a3a98f1c100fa2cdb80a1148a9a16310c6cf02f36"; // sat01用
        this.CONSUMER_KEY_TVESPA = "3f882188279e9b0d88ea479d319b230ce2c42bf0c7925c520fb0aec031c1ec0b"; // tvespa用
        this.CONSUMER_SECRET_TVESPA = "e377fe81512e7714bece6b7ab287cd5f24f7d32600ec3524e827fd0a0d64c6e4"; // tvespa用
        this.CONSUMER_KEY_SAC = "b6d47063196ee813c95675dd69675d5965723a956616a1daa5d6ff6d48669b10"; //本番サーバ用
        this.CONSUMER_SECRET_SAC = "69d86c7bced5e7d69afad409d9570bfa14c8c59f821eab732aab5dffc1ebb6ff"; //本番サーバ用
        this.CONSUMER_KEY_SERVICEDEV2 = "0b30e22f8bdfcb465f1cf3088aa528ebc1b4f029d6967fe2044ed01bf189a476"; // servicedev2用
        this.CONSUMER_SECRET_SERVICEDEV2 = "31afbf27db5b06c618ff9da2e792c32f4763f353ee9a1714dd41720a354b85c9"; // servicedev2用
        this.CONSUMER_KEY_SERVICEDEV3 = "4f17f90e8312221347b098de0a592c93986182cd128b6ba29598cfeefc9d3af9"; // servicedev3用
        this.CONSUMER_SECRET_SERVICEDEV3 = "eb31aa7b588017a35ff0326320521561f72a1dcfb3637a6b35c08eebd709d7b0"; // servicedev3用
        this.CONSUMER_KEY_SDEV = "7bbe7b758484c89f5ac4046c6fcab5a2904a5007c990bb7baa91eba609117537"; // sdev用
        this.CONSUMER_SECRET_SDEV = "612e98e64a0270cb12cea1de56ceaf5ed8ff4487b3dd9694c5f0e053aae4c4d5"; // sdev用
        this.CONSUMER_KEY_SACH5 = "d38658321ca7afe5ae907aada7f043aad90217533c806d69c55ca07142c6a88f";  // sach5用
        this.CONSUMER_SECRET_SACH5 = "7ead16e3188dc509651850d2bc8961fdef390e81a2b4c3adcd37cfd898a47156";  // sach5用
        this.APP_INFO_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=spap-reg.getAppInfo";
        this.LICENCE_LIST_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=opcon.lmgr.getLicenceList";
        this.VALID_AUTHTOKEN_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=ta.authUserAuthtoken";
        this.GET_USERID_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=ta.getUserId";
        this.GET_USERNAME_URL = "https://stg.smart-acs.com/api/user/user-info.php";
        this.SMARTACCESS_LOGIN_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=ta.redirectOem";
        this.SMARTACCESS_LOGIN_CALLBACK_URL = "SCHEME//HOSTNAME:PORT/tif/h5ContentsDownload/4car/1.0.0/write_cookie.html";
        this.CREATE_VDID_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=ta.av.createVdid";
        this.AUTH_VDID_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=ta.av.authVdid";
        this.GET_FAVORITE_POI_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=user2.getFavoritePOI";
        this.GET_POI_DETAIL_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=npp.sendDataOuterService";
        this.GET_POI_DETAIL_GOOGLE_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=POIService2.getPOIDetail";
        this.GET_POI_IMAGE_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=POIService2.getImage";
        this.GET_HISTORY_POI_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=user2.getDestHistoryPOI";
        this.SET_FAVORITE_POI_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=user2.setFavoritePOI";
        this.DEL_FAVORITE_POI_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=user2.delFavoritePOI";
        this.DEL_HISTORY_POI_URL = "SCHEME//HOSTNAME:PORT/tif/v1/?smt-service=user2.delDestHistoryPOI";
        this.TEST_PID_HISTORY = null; // ダミーPID接続履歴
        this.TEST_FAVORITE_PID = null; // ダミーお気に入りPID
        this.TEST_AUTH_TOKEN = null; // ダミーAuthToken
        // インスタンス変数
        this.appInfoJson = "";
        Common.log("constructor() start");
        this.APP_INFO_URL = this.replaceUrl(this.APP_INFO_URL);
        this.LICENCE_LIST_URL = this.replaceUrl(this.LICENCE_LIST_URL);
        this.VALID_AUTHTOKEN_URL = this.replaceUrl(this.VALID_AUTHTOKEN_URL);
        this.GET_USERID_URL = this.replaceUrl(this.GET_USERID_URL);
        this.GET_USERNAME_URL = this.replaceUrl(this.GET_USERNAME_URL);
        this.SMARTACCESS_LOGIN_URL = this.replaceUrl(this.SMARTACCESS_LOGIN_URL);
        this.SMARTACCESS_LOGIN_CALLBACK_URL = this.replaceUrl(this.SMARTACCESS_LOGIN_CALLBACK_URL);
        this.CREATE_VDID_URL = this.replaceUrl(this.CREATE_VDID_URL);
        this.AUTH_VDID_URL = this.replaceUrl(this.AUTH_VDID_URL);
        this.GET_FAVORITE_POI_URL = this.replaceUrl(this.GET_FAVORITE_POI_URL);
        this.GET_POI_DETAIL_URL = this.replaceUrl(this.GET_POI_DETAIL_URL);
        this.GET_POI_DETAIL_GOOGLE_URL = this.replaceUrl(this.GET_POI_DETAIL_GOOGLE_URL);
        this.GET_POI_IMAGE_URL = this.replaceUrl(this.GET_POI_IMAGE_URL);
        this.GET_HISTORY_POI_URL = this.replaceUrl(this.GET_HISTORY_POI_URL);
        this.SET_FAVORITE_POI_URL = this.replaceUrl(this.SET_FAVORITE_POI_URL);
        this.DEL_FAVORITE_POI_URL = this.replaceUrl(this.DEL_FAVORITE_POI_URL);
        this.DEL_HISTORY_POI_URL = this.replaceUrl(this.DEL_HISTORY_POI_URL);
        if (location.hostname.search(/localhost/) != -1) {
            // PCデバッグの場合
            this.mwsDomainWithPort = Common.TEST_DOMAINPORT;
            this.TEST_PID_HISTORY = ["DEMODEMO11111111 2013/11/01", "DEMODEMO11111112 2013/08/01"];
            this.TEST_FAVORITE_PID = "DEMODEMO00000003";
            //			this.TEST_PID_HISTORY = [];
            //			this.TEST_FAVORITE_PID = "";
            Common.SVR_CONSOL_LOG_URL = null;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SERVICEDEV2;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SERVICEDEV2;
        }
        else if (location.hostname.search(/sat01.clarion.co.jp/) != -1) {
            // sat01場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SAT01;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SAT01;
        }
        else if (location.hostname.search(/tvespa.clarion.co.jp/) != -1) {
            // tvespaの場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_TVESPA;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_TVESPA;
        }
        else if (location.hostname.search(/ec2-54-199-164-141.ap-northeast-1.compute.amazonaws.com/) != -1) {
            // servicedev2の場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SERVICEDEV2;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SERVICEDEV2;
        }
        else if (location.hostname.search(/ec2-54-65-62-195.ap-northeast-1.compute.amazonaws.com/) != -1) {
            // servicedev3の場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SERVICEDEV3;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SERVICEDEV3;
        }
        else if (location.hostname.search(/sdev.clarion.co.jp/) != -1) {
            // sdevの場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SDEV;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SDEV;
        }
        else if (location.hostname.search(/www.smt-access.com/) != -1) {
            // sac（本番）の場合
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SAC;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SAC;
        }else if (location.hostname.search(/sach5.clarion.co.jp/) != -1){
            // sach5用
            this.mwsDomainWithPort = mwsDomainWithPort;
            this.CONSUMER_KEY = this.CONSUMER_KEY_SACH5;
            this.CONSUMER_SECRET = this.CONSUMER_SECRET_SACH5;
        }
        this.w = new Word();
        Common.log("セットされたMWSのポート: " + mwsDomainWithPort);
        Common.log("constructor() end");
    }
    /**
    * PID履歴リストを取得する
    * @return MWSから取得されたpidのアクセス日付きのリスト（例：[0]=DEMODEMO00000001 2013/11/01, [1]=DEMODEMO00000002 2013/08/01, [2]=DEMODEMO00000003 2013/02/01）
    */
    Common.prototype.getPidList = function () {
        Common.log("getPidList() start");
        var d = $.Deferred();
        var res = [];
        var historyList = [];
        var tmpPidHistory = "";
        var pidConnectedHistory = [];
        var tmpSelectedPid = "";
        var pidSelectedHistory = [];
        var _this = this;
        // テスト時はダミーのPIDを返す
        if (this.TEST_PID_HISTORY != null) {
            historyList = this.TEST_PID_HISTORY;
            Common.log("ダミーpid_historyを利用");
            d.resolve(historyList);
            return;
        }
        else {
            _this.getFrPhone("pid_history")
                .then(function (data) {
                tmpPidHistory = data;
                if (tmpPidHistory != undefined && tmpPidHistory != null && tmpPidHistory != "") {
                    // pid の接続履歴を取得する ※配列で取得できるようにJSON.pase
                    pidConnectedHistory = JSON.parse(tmpPidHistory);
                }
                else {
                    pidConnectedHistory = null;
                }
                //取得できたかのチェック
                if (pidConnectedHistory != undefined && pidConnectedHistory != null) {
                    //マージ用リストに代入
                    historyList = pidConnectedHistory;
                }
                else {
                    historyList = null;
                }
                _this.getFrPhone("selected_pid")
                    .then(function (data) {
                    tmpSelectedPid = data;
                    if (tmpSelectedPid != undefined && tmpSelectedPid != null) {
                        // pid の選択履歴を取得する ※配列で取得できるようにJSON.pase
                        pidSelectedHistory = JSON.parse(tmpSelectedPid);
                    }
                    else {
                        pidSelectedHistory = null;
                    }
                    //取得できたかのチェック
                    if (pidSelectedHistory != undefined && pidSelectedHistory != null) {
                        //launcher_pid_vehicleが取得できずselected_pidが取得できた場合はselected_pidのみリストに代入　※通常通らない処理
                        if (historyList == null) {
                            historyList = pidSelectedHistory;
                            d.resolve(historyList);
                            return;
                        }
                        else {
                            //取得したpid履歴をマージ
                            for (var i = 0; i < pidSelectedHistory.length; i++) {
                                historyList.push(pidSelectedHistory[i]);
                            }
                        }
                    }
                    else {
                        //接続履歴、選択履歴両方が取得できなければnullをリターン
                        if (historyList == null) {
                            d.resolve(historyList);
                            return;
                        }
                    }
                    var tmp = "";
                    //タイムスタンプ
                    var timeStamp1 = "";
                    var timeStamp2 = "";
                    //pid
                    var pid1 = "";
                    var pid2 = "";
                    for (var i = 0; i < historyList.length; i++) {
                        //タイムスタンプ取得
                        timeStamp1 = historyList[i].split(" ")[1];
                        for (var j = i + 1; j < historyList.length; j++) {
                            //比較用タイムスタンプ取得
                            timeStamp2 = historyList[j].split(" ")[1];
                            //比較し、順番を入れ替える
                            if (_this.cmpDate(timeStamp1, timeStamp2) == -1) {
                                tmp = historyList[i];
                                historyList[i] = historyList[j];
                                historyList[j] = tmp;
                                //タイムスタンプ入れ替え
                                timeStamp1 = historyList[i].split(" ")[1];
                            }
                        }
                    }
                    //pid取得
                    for (var i = 0; i < historyList.length; i++) {
                        //historyList[i]のpid
                        pid1 = historyList[i].split(" ")[0];
                        for (j = i + 1; j < historyList.length; j++) {
                            //比較用pid
                            pid2 = historyList[j].split(" ")[0];
                            if (pid1 == pid2) {
                                //同じpidの要素を削除
                                historyList.splice(j, 1);
                                //要素を削除すると要素数がズレるのでカウンタを-1する
                                j--;
                            }
                        }
                    }
                    d.resolve(historyList);
                    return;
                }, function () {
                    d.resolve(historyList);
                    return;
                });
            }, function () {
                d.resolve(null);
                return;
            });
        }
        Common.log("pidList = " + res);
        Common.log("getPidList() end");
        return d.promise();
    };
    ;
    /**
     * ライセンス一覧取得取得APIからPIDライセンスを取得してXMLで返す
     *
     * @params pid ライセンスを取得するPID
     * @params status 全てのライセンスを取得=true, 無効なライセンスを取得=false
     * @return 結果のXML
     */
    Common.prototype.getPidLicenceList = function (pid, status) {
        Common.log("getPidLicenceList() start");
        var res = null;
        // cookieをセット
        document.cookie = "PVR=0; Path=/;";
        document.cookie = 'PID=' + pid + '; Path=/;';
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        var param = "";
        if (status) {
            // 全てのライセンスを取得
            Common.log("pidライセンスを取得（全て）");
            param = "version=2&id_type=pid&service=h5.contentsDownload.getContents&status=0";
        }
        else {
            // 無効なライセンスを取得
            Common.log("pidライセンスを取得（無効のみ）");
            param = "version=2&id_type=pid&service=h5.contentsDownload.getContents&status=2";
        }
        res = this.getLicenceList(param, status);
        Common.log("getPidLicenceList() end");
        return res;
    };
    /**
     * ライセンス一覧取得APIからユーザライセンスを取得してXMLで返す
     *
     * @params authToken AuthToken
     * @params status 全てのライセンスを取得=true, 無効なライセンスを取得=false
     * @return 結果のXML
     */
    Common.prototype.getUserLicenceList = function (authToken, status) {
        Common.log("getUserLicenceList() start");
        var res = null;
        // cookieをセット
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        var param = "";
        if (status) {
            // 全てのライセンスを取得
            Common.log("ユーザライセンスを取得（全て）");
            param = "version=2&id_type=user&service=h5.contentsDownload.getContents&status=0";
        }
        else {
            // 無効なライセンスを取得
            Common.log("ユーザライセンスを取得（無効のみ）");
            param = "version=2&id_type=user&service=h5.contentsDownload.getContents&status=2";
        }
        res = this.getLicenceList(param, status);
        Common.log("getUserLicenceList() end");
        return res;
    };
    /**
     * @private
     */
    Common.prototype.getLicenceList = function (param, status) {
        Common.log("getLicenceList() start");
        var res = null;
        // URLをセットする
        var url = this.LICENCE_LIST_URL;
        Common.log("ライセンス一覧取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：ライセンス取得API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：ライセンス取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("getLicenceList() end");
        return res;
    };
    /**
     * アプリ情報取得APIからデータを取得してXMLで返す
     * 取得できたら、非同期でcallbackを呼ぶ
     *
     * @params pid アプリ情報を取得する際に機器認証で利用されるpid
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.getAppList = function (pid, language) {
        Common.log("getAppList() start");
        var res = null;
        // cookieをセット
        if (pid != undefined && pid != null && pid != "") {
            // pidが取得できればそのpidをセット
            document.cookie = "PVR=0; Path=/;";
            document.cookie = 'PID=' + pid + '; Path=/;';
            Common.log("機器認証pid = " + pid);
        }
        else {
            // pidが取得できればデフォルトpidをセット
            document.cookie = "PVR=0; Path=/;";
            document.cookie = 'PID=' + this.DEFAULT_PID + '; Path=/;';
            Common.log("機器認証pid = " + this.DEFAULT_PID);
        }
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // アプリ情報取得APIのURLをセットする
        var url = this.APP_INFO_URL;
        var param = "&version=3&oemId=1&type=3&sort=1&language=" + language;
        Common.log("アプリ情報取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：アプリ情報取得API res=" + jqXHR.responseText);
                res = xml;
                //alert((new XMLSerializer()).serializeToString(res));
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：アプリ情報取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("getAppList() end");
        return res;
    };
    /**
     * VDID を新規作成する
     *
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.createVdid = function () {
        Common.log("createVdid() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // VDID発行APIのURLをセットする
        var url = this.CREATE_VDID_URL;
        var param = "oem_id=1";
        Common.log("VDID発行API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：VDID発行API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：VDID発行API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("createVdid() end");
        return res;
    };
    /**
     * VDID を認証する
     *
     * @params vdid VDID
     * @params vdidPass VDIDパスワード
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.authVdid = function (vdid, vdidPass) {
        Common.log("authVdid() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // VDID認証APIのURLをセットする
        var url = this.AUTH_VDID_URL;
        var param = "&vdid=" + vdid + "&vdid_password=" + vdidPass;
        Common.log("VDID認証API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：VDID認証API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：VDID認証API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("authVdid() end");
        return res;
    };
    /**
     * 行き先履歴 POI を取得する
     *
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.getHistoryPOI = function (authToken) {
        Common.log("getHistoryPOI() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // 目的地履歴POI取得APIのURLをセットする
        var url = this.GET_HISTORY_POI_URL;
        var param = "&sort=1&num=99&page=1";
        Common.log("目的地履歴POI取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：目的地履歴POI取得API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：目的地履歴POI取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("getHistoryPOI() end");
        return res;
    };
    /**
     * お気に入り POI を取得する
     *
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.getFavoritePOI = function (authToken) {
        Common.log("getFavoritePOI() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // お気に入りPOI取得APIのURLをセットする
        var url = this.GET_FAVORITE_POI_URL;
        var param = "&sort=1&num=8&page=1";
        Common.log("お気に入りPOI取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：お気に入りPOI取得API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：お気に入りPOI取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("getFavoritePOI() end");
        return res;
    };
    /**
     * Google 以外から POI 詳細情報を取得する
     *
     * @params reference 店舗用 reference
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.getPOIDetail = function (reference, authToken) {
        Common.log("getPOIDetail() start");
        Common.log("reference : " + reference + ", authToken : " + authToken);
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // POI 詳細情報取得APIのURLをセットする
        var url = this.GET_POI_DETAIL_URL;
        var param = "&outerServiceStatus=shopInfoAndUpdate&reference=" + reference;
        Common.log("POI 詳細情報取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "json",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：POI 詳細情報API res=" + jqXHR.responseText);
                res = jqXHR.responseText;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：POI 詳細情報API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        if (res != undefined && res != null && res != "") {
            res = res.replace(/="/g, '=\\\"');
            res = res.replace(/">/g, '\\\">');
        }
        Common.log("getPOIDetail() end");
        return res;
    };
    /**
     * Google から POI 詳細情報を取得する
     *
     * @params reference POI一覧取得結果のリファレンス
     * @params plg 国(言語)情報
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.getPOIDetailByGoogle = function (reference, plg, authToken) {
        Common.log("getPOIDetailByGoogle() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // POI 詳細情報取得APIのURLをセットする
        var url = this.GET_POI_DETAIL_GOOGLE_URL;
        var param = "&reference=" + reference + "&plg=" + plg;
        Common.log("Google から POI 詳細情報取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "json",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：Google POI 詳細情報取得API res=" + jqXHR.responseText);
                res = jqXHR.responseText;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：Google POI 詳細情報取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        if (res != undefined && res != null && res != "") {
            res = res.replace(/="/g, '=\\\"');
            res = res.replace(/">/g, '\\\">');
        }
        Common.log("getPOIDetailByGoogle() end");
        return res;
    };
    /**
     * お気に入り POI 詳細情報を更新する
     *
     * @params poiId POI ID
     * @params myCallTItle 呼び出し名称(URLエンコードされている)
     * @params myPoint 位置情報(緯度、経度をカンマ区切りで指定)
     * @params myTel 電話番号
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.setFavoritePoi = function (poiId, myCallTItle, myPoint, myTel, authToken) {
        Common.log("setFavoritePoi() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // お気に入り POI 更新 APIのURLをセットする
        var url = this.SET_FAVORITE_POI_URL;
        var param = "&poi_id=" + poiId + "&my_call_title=" + myCallTItle + "&my_point=" + myPoint + "&my_tel=" + myTel;
        Common.log("authToken = " + authToken);
        Common.log("POI 更新API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：お気に入り POI更新API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：お気に入り POI更新API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("setFavoritePoi() end");
        return res;
    };
    /**
     * お気に入り POI を削除する
     *
     * @params poiId POI ID
     * @params allClearFlag 全削除フラグ
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.delFavoritePoi = function (poiId, allClearFlag, authToken) {
        Common.log("delFavoritePoi() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // お気に入り POI 削除 APIのURLをセットする
        var url = this.DEL_FAVORITE_POI_URL;
        var param = "";
        if (allClearFlag) {
            param = "&all_clear=1";
        }
        else {
            param = "&poi_id=" + poiId;
        }
        Common.log("お気に入り POI 削除 API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：」お気に入り POI 削除API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：お気に入り POI削除API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("delFavoritePoi() end");
        return res;
    };
    /**
     * 行き先履歴 POI を削除する
     *
     * @params poiId POI ID
     * @params allClearFlag 全削除フラグ
     * @params authToken AuthToken
     * @return 成功時=結果のXML, エラー時=null
     */
    Common.prototype.delHistoryPoi = function (poiId, allClearFlag, authToken) {
        Common.log("delHistoryPoi() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // 行き先履歴 POI 削除 APIのURLをセットする
        var url = this.DEL_HISTORY_POI_URL;
        var param = "";
        if (allClearFlag) {
            param = "&all_clear=1";
        }
        else {
            param = "&poi_id=" + poiId;
        }
        Common.log("行き先履歴 POI 削除 API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：行き先履歴 POI 削除API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：行き先履歴 POI削除API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        Common.log("delHistoryPoi() end");
        return res;
    };
    /**
     * POI 画像情報を取得する
     * 画像情報はHTML表示時に取得するため、ここではパラメータ付きのURLを返却するだけ
     *
     * @params reference POI詳細取得結果のリファレンス
     */
    Common.prototype.getPOIImage = function (reference) {
        Common.log("getPOIImage() start");
        var res = null;
        // cookieをセット
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // VDID発行APIのURLをセットする
        var url = this.GET_POI_IMAGE_URL;
        var param = "&photoReference=" + reference + "&maxHeight=1600&maxWidth=1600";
        Common.log("POI 画像取得API url = " + url + ", param = " + param);
        res = url + param;
        Common.log("取得した POI 画像情報 = " + res);
        Common.log("getPOIImage() end");
        return res;
    };
    /**
     * MWSのキーバリューから値を取得する
     * @params key キー
     * @return 結果の文字列
     */
    Common.prototype.getFrPhone = function (key) {
        Common.log("getFrPhone() start");
        var d = $.Deferred();
        var res = "";
        // テスト時はダミーのキーバリューから値を取得する
        if (Common.DUMMY_MWS_USE) {
            res = (localStorage.getItem(key));
            d.resolve(res);
        }
        else {
            // MWSからデータを取得
            var url = this.mwsDomainWithPort + "kvs/" + key + "/";
            $.ajax({
                type: "GET",
                url: url,
                async: true,
                success: function (data, status, xhr) {
                    res = xhr.responseText;
                    Common.log("成功：MWS取得 url=" + url + " res=" + res);
                    d.resolve(res);
                    return;
                },
                error: function (xhr, status, err) {
                    Common.log("エラー：MWS取得 url=" + url + " (status = " + status + ", code=" + xhr.status + ")");
                    d.resolve();
                    return;
                }
            });
        }
        Common.log("getFrPhone() end");
        return d.promise();
    };
    /**
     * MWSのキーバリューへ値を書き込む
     *
     * @params key 書き込むキー
     * @params val 書き込むバリュー
     * @params isList valにJSONを渡す場合=true、単独の値を渡す場合=false
     */
    Common.prototype.writeToPhone = function (key, val, isList) {
        Common.log("writeToPhone() start");
        var d = $.Deferred();
        // テスト時はダミーのキーバリューへ値を書き込む
        if (Common.DUMMY_MWS_USE) {
            if (isList) {
                localStorage.setItem(key, JSON.stringify(val));
            }
            else {
                localStorage.setItem(key, val);
            }
        }
        else {
            // MWSへ書き込む
            var writeToUrl = this.mwsDomainWithPort + "kvs/" + key + "/";
            var writeData = '';
            if (isList) {
                writeData = JSON.stringify(val);
            }
            else {
                writeData = val;
            }
            $.ajax({
                type: "POST",
                url: writeToUrl,
                async: true,
                data: writeData,
                success: function (data, status, xhr) {
                    Common.log("成功：MWS書込 url=" + writeToUrl + "書込データ={" + key + ":" + val + "}");
                    d.resolve();
                    return;
                },
                error: function (xhr, status, err) {
                    Common.log("エラー：MWS書込 url=" + writeToUrl + "(status = " + status + ", code=" + xhr.status + ")");
                    d.resolve();
                    return;
                }
            });
        }
        Common.log("writeToPhone() end");
        return d.promise();
    };
    /**
     * スマホアプリ情報を取得する
     * @return スマホアプリ情報の JSON
     */
    Common.prototype.getAppInfo = function () {
        Common.log("getAppInfo() start");
        var d = $.Deferred();
        var res = "";
        var _this = this;
        // テスト時は空文字を取得する
        if (Common.DUMMY_MWS_USE) {
            res = "";
            d.resolve(res);
        }
        else {
            // MWSからデータを取得
            var url = this.mwsDomainWithPort + "get-appinfo/";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                async: true,
                success: function (data, status, xhr) {
                    res = xhr.responseText;
                    Common.log("成功：スマホアプリ情報取得 url=" + url + " res=" + res);
                    // getDeviceLanguage()をcommon内で使用するためにアプリ情報をインスタンス変数に保持
                    _this.appInfoJson = res;
                    d.resolve(res);
                    return;
                },
                error: function (xhr, status, err) {
                    Common.log("エラー：スマホアプリ情報取得 url=" + url + " (status = " + status + ", code=" + xhr.status + ")");
                    d.resolve();
                    return;
                }
            });
        }
        Common.log("getAppInfo() end");
        return d.promise();
    };
    /**
     * 渡した日付が本日より過去n日以内の日付の場合、true（新しい）を返す。
     * パラメータが不正な場合はfalseを返す
     * @params chkDate チェック対象の日付（例: 2013-01-09）
     * @params num チェックする日数(30日以内をチェックする例：30)
     */
    Common.prototype.checkNew = function (chkDate, num) {
        Common.log("checkNew() start");
        var res = false;
        // パラメータ不正はfalseを返す
        if (chkDate == undefined || chkDate == null || chkDate == "" || num < 1) {
            return false;
        }
        var today = new Date();
        var ty = today.getFullYear();
        var tm = today.getMonth() + 1;
        var td = today.getDate();
        var oldDate = chkDate.split("-");
        var oy = parseInt(oldDate[0], 10);
        var om = parseInt(oldDate[1], 10);
        var od = parseInt(oldDate[2], 10);
        var d1 = Date.UTC(ty, tm - 1, td); // 今日の日付
        var d2 = Date.UTC(oy, om - 1, od); // 入力パラメータの日付
        var difftime = (d1 - d2) / (24 * 60 * 60 * 1000); // 日数
        if (d1 >= d2 && difftime <= num) {
            res = true;
        }
        Common.log("checkNew() end");
        return res;
    };
    /**
     * ライセンス切れの判定結果を返す
     * @params chkDate チェック対象の日付（例: 2013-01-09T12:21:00）
     * @params num チェックする日数(ライセンス切れ1週間前にチェックする例：7)
     * @return 期限内(もうすぐ切れる、もしくは切れている)=true, それ以外=false
     */
    Common.prototype.checkExpire = function (chkDate, num) {
        Common.log("checkExpire() start");
        var res = false;
        if (chkDate == undefined || chkDate == null || chkDate == "" || num < 0) {
            return false;
        }
        // 現在日時（UTC時間）
        var today = new Date();
        var y = today.getUTCFullYear();
        var month = today.getUTCMonth() + 1;
        var date = today.getUTCDate();
        // チェック対象の日時（UTC時間）
        var newList = chkDate.split("T")[0].split("-");
        var y_new = parseInt(newList[0], 10);
        var mo_new = parseInt(newList[1], 10);
        var td_new = parseInt(newList[2], 10);
        var diff = num;
        var d1 = new Date(Date.UTC(y_new, mo_new - 1, td_new, 0, 0, 0)).getTime(); // チェック対象の日時
        var d2 = new Date(Date.UTC(y, month - 1, date, 0, 0, 0)).getTime(); // 現在日時
        var difftime = (d1 - d2) / (24 * 60 * 60 * 1000);
        if (num >= difftime) {
            // もうすぐ切れる、もしくは切れている
            res = true;
        }
        Common.log("checkExpire() end");
        return res;
    };
    /**
     * ユーザライセンスのXMLとpidライセンスのXMLのうち、引き渡したアイテムが含まれている方の値を応答する。
     * なければ空文字を返す。同一のアイテムIDが、ユーザライセンスとpidライセンスの両方に含まれていることはない。
     * 複数見つかった場合は、最初に見つかったものを返す。
     * パラメータ不正の場合は、空文字を返す。
     * @params itemId アイテムID
     * @params param 取得する項目名（例：LICENCE_END_DATE）
     * @params userLicenceXml ユーザライセンスのXML
     * @params pidLicenceXml pidライセンスのXML
     * @params lastDateFlg 日付形式(書式：yyyy-MM-ddTHH:mm:ss)のデータを取得する場合に最も未来の日付を返す場合はtureを指定する。falseもしくは省略時は最初に見つかったものを返す。ただし、lastDate＞アイテムサポート終了日 の場合はアイテムサポート終了日を返す。
     * @return 取得された値
     */
    Common.prototype.getLicenceData = function (itemId, param, userLicenceXml, pidLicenceXml, lastDateFlg) {
        Common.log("getLicenceData() start");
        var res = "";
        // パラメータ不正の場合は空文字を返す
        if (itemId == "" || param == "") {
            return "";
        }
        if (lastDateFlg == undefined || lastDateFlg == null) {
            lastDateFlg = false;
        }
        // ユーザライセンス
        var _this = this;
        if (userLicenceXml != undefined && userLicenceXml != null) {
            $(userLicenceXml).find("LICENCE").each(function (i) {
                if ($(this).find("ITEM_ID").text() == itemId) {
                    if (lastDateFlg) {
                        // 最も未来の日付を取得する
                        var lastDate = $(this).find(param).text();
                        var cmpRes = _this.cmpDate(lastDate, res);
                        if (res == "" || cmpRes == 1) {
                            // lastDate＞アイテムサポート終了日 の場合は、アイテムサポート終了日をセットする
                            var itemSupportDate = $(this).find("ITEM_SUPPORT_END_DATE").text();
                            if (_this.cmpDate(lastDate, itemSupportDate) == 1) {
                                res = itemSupportDate;
                            }
                            else {
                                res = lastDate;
                            }
                        }
                    }
                    else {
                        res = $(this).find(param).text();
                        return false; // break;
                    }
                }
            });
        }
        // pidライセンス
        if (pidLicenceXml != undefined && pidLicenceXml != null) {
            $(pidLicenceXml).find("LICENCE").each(function (i) {
                if ($(this).find("ITEM_ID").text() == itemId) {
                    if (lastDateFlg) {
                        // 最も未来の日付を取得する
                        var lastDate = $(this).find(param).text();
                        var cmpRes = _this.cmpDate(lastDate, res);
                        if (res == "" || cmpRes == 1) {
                            // lastDate＞アイテムサポート終了日 の場合は、アイテムサポート終了日をセットする
                            var itemSupportDate = $(this).find("ITEM_SUPPORT_END_DATE").text();
                            if (_this.cmpDate(lastDate, itemSupportDate) == 1) {
                                res = itemSupportDate;
                            }
                            else {
                                res = lastDate;
                            }
                        }
                    }
                    else {
                        res = $(this).find(param).text();
                        return false; // break;
                    }
                }
            });
        }
        Common.log("取得されたデータ = " + res);
        Common.log("getLicenceData() end");
        return res;
    };
    /**
     * コンシューマキーを取得
     * @return コンシューマキー
     */
    Common.prototype.getConsumerKey = function () {
        return this.CONSUMER_KEY;
    };
    /**
     * コンシューマシークレットを取得
     * @return コンシューマシークレット
     */
    Common.prototype.getConsumerSecret = function () {
        return this.CONSUMER_SECRET;
    };
    /**
     * ライセンスが有効か確認する
     * ※有効条件: ライセンスが"valid" || ("invalid" && ライセンス終了日≧現在日時 && アイテムサポート終了日≧現在日時)
     * @params itemId アイテムID
     * @params licenceList ライセンスXML
     * @return 存在する場合=true, なし=false
     */
    Common.prototype.checkLicence = function (itemId, licenceList) {
        Common.log("checkLicence() start");
        var res = false;
        if (itemId == undefined || itemId == null || itemId == "" || licenceList == undefined || licenceList == null) {
            return false;
        }
        var _this = this;
        $(licenceList).find("LICENCE").each(function (i) {
            var id = $(this).find("ITEM_ID").text();
            if (id != undefined && id == itemId) {
                // 該当アイテムIDのライセンスを持っている
                // ライセンスがvalidまたは、invalidだがライセンス終了日が未来な場合は、有効
                var currentDate = _this.getUTCCurrentTime();
                var endDate = $(this).find("LICENCE_END_DATE").text();
                var supportEndDate = $(this).find("ITEM_SUPPORT_END_DATE").text();
                // ライセンスが有効な場合trueをセット
                if (($(this).find("LICENCE_STATUS").text() != undefined && $(this).find("LICENCE_STATUS").text() == "valid")
                    || (endDate != undefined && _this.cmpDate(endDate, currentDate) >= 0 && supportEndDate != undefined && _this.cmpDate(supportEndDate, currentDate) >= 0)) {
                    res = true;
                    return false; // break
                }
            }
        });
        Common.log("check licence結果 = " + res);
        Common.log("checkLicence() end");
        return res;
    };
    /**
     * パラメータの数値を3桁区切りの数値に変換して返す。
     * 渡された数値はintに変換されるため、小数点以下は切り捨てられる。
     * 例）20000.0 → 20,000
     * @params num 変換する数値の文字列（例：2000.0、105.5）
     * @return 変換された数値を3桁区切りにした文字列（例：3,000,000）
     */
    Common.prototype.parseYen = function (num) {
        Common.log("parseYen() start");
        var res = "";
        res = String(parseFloat(num)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        Common.log("パース結果 = " + res);
        Common.log("parseYen() end");
        return res;
    };
    /**
     * urlのクエリパラメータをパースしてオブジェクトにして返す
     * urlが不正なときはnullを返す
     * @params url URL文字列
     * @return クエリパラメータのオブジェクト（例：[{"param1":"value1"},{"param2":"value2"}]）
     */
    Common.prototype.parseParam = function (url) {
        Common.log("parseParam() start");
        var res = {};
        var param = '';
        if (url.split("?").length == 1) {
            param = url;
        }
        else if (url.split("?").length == 2) {
            param = url.split("?")[1];
        }
        else if (url.split("?").length == 3) {
            param = url.split("?")[1] + "&" + url.split("?")[2];
        }
        if (param == undefined || param == null || param == "") {
            // urlが不正な場合はエラーを返す
            return null;
        }
        // abc=xxx の組
        var pairs = param.split("&");
        for (var i = 0; i < pairs.length; i++) {
            res[pairs[i].split("=")[0]] = pairs[i].split("=")[1];
        }
        Common.log("パース結果 = " + res);
        Common.log("parseParam() end");
        return res;
    };
    /**
     * ユーザ名を取得する。
     * ユーザID取得APIよりOEMのユーザIDを取得し、それを用いてOEM側からユーザ名を取得する。
     * @params authToken ログイン時に取得するAuthToken
     * @return ユーザ名
     */
    Common.prototype.getUserName = function (authToken) {
        Common.log("getUserName authToken : " + authToken);
        var res = "";
        var nickname = "";
        if (authToken == undefined || authToken == null || authToken == "") {
            return null;
        }
        // テスト時はテスト用ユーザ名を返す
        if (this.TEST_AUTH_TOKEN != undefined && this.TEST_AUTH_TOKEN != null && this.TEST_AUTH_TOKEN != "") {
            return "テストユーザ";
        }
        // ユーザID取得APIのURLをセットする
        var url = this.GET_USERID_URL;
        Common.log("ユーザID取得API url = " + url);
        document.cookie = "UVR=5; Path=/;";
        document.cookie = "AUTHTOKEN=" + authToken + "; Path=/;";
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：ユーザID取得API res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：ユーザID取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        // OEM Userid が取得できなければ終了する
        var oem_userid = $(res).find("oem_user_id").text();
        if (oem_userid == undefined || oem_userid == null || oem_userid == "") {
            Common.log("OEM Userid 取得失敗");
            return null;
        }
        // ユーザ情報取得APIのURLをセットする
        var url = this.GET_USERNAME_URL;
        var param = "oem_userid=" + oem_userid;
        Common.log("ユーザ情報取得API url = " + url + ", param = " + param);
        // ajaxでデータを取得する
        var _this = this;
        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: "xml",
            url: url,
            data: param,
            async: false,
            success: function (xml, status, jqXHR) {
                Common.log("成功：ユーザ情報取得APIAPI res=" + jqXHR.responseText);
                res = xml;
            },
            error: function (jqXHR, status, error) {
                Common.log("エラー：ユーザ情報取得API(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
        // OEM Userid が取得できなければ終了する
        nickname = $(res).find("nickname").text();
        return nickname;
    };
    /**
     * 日付の比較結果を返す。日付1及び日付2が無効な文字列(undefined, null, 空文字)の場合は、常に9を返す。
     * @params date1 日付1(形式：yyyy-MM-ddTHH:mm:ss)
     * @params date2 日付2(形式：yyyy-MM-ddTHH:mm:ss)
     * @return (日付1>日付2のとき)=1, (日付1==日付2のとき)=0, (日付1<日付2のとき)=-1
     */
    Common.prototype.cmpDate = function (date1, date2) {
        Common.log("cmpDate() start");
        var res = 0;
        // 無効なパラメータの場合は0を返す
        if (date1 == undefined || date1 == null || date1 == ""
            || date2 == undefined || date2 == null || date2 == "") {
            return 9;
        }
        var strDate1 = date1.split("T")[0];
        var strTime1 = date1.split("T")[1];
        var strDate2 = date2.split("T")[0];
        var strTime2 = date2.split("T")[1];
        // 改行文字が含まれていたら除去
        strTime1 = strTime1.trim();
        strTime2 = strTime2.trim();
        var dt1 = Date.UTC(parseInt(strDate1.split("-")[0], 10), parseInt(strDate1.split("-")[1], 10) - 1, parseInt(strDate1.split("-")[2], 10), parseInt(strTime1.split(":")[0], 10), parseInt(strTime1.split(":")[1], 10), parseInt(strTime1.split(":")[2], 10));
        var dt2 = Date.UTC(parseInt(strDate2.split("-")[0], 10), parseInt(strDate2.split("-")[1], 10) - 1, parseInt(strDate2.split("-")[2], 10), parseInt(strTime2.split(":")[0], 10), parseInt(strTime2.split(":")[1], 10), parseInt(strTime2.split(":")[2], 10));
        if (dt1 > dt2) {
            res = 1;
        }
        else if (dt1 < dt2) {
            res = -1;
        }
        Common.log("比較結果 = " + res);
        Common.log("cmpDate() end");
        return res;
    };
    /**
     * ライセンスの有効期限が"LICENCE_NOTIFICATIONS_DATE"以内かどうかの判定。
     * @params date1 日付1(形式：yyyy-MM-dd)
     * @params date2 日付2(形式：yyyy-MM-dd)
     * @params licenceNotifications アプリ情報XMLの"LICENCE_NOTIFICATIONS_DATE"
     * @return
     */
    Common.prototype.cmpLicenceDate = function (date1, date2, licenceNotifications) {
        var res = -99;
        // 無効なパラメータの場合は0を返す
        if (date1 == undefined || date1 == null || date1 == ""
            || date2 == undefined || date2 == null || date2 == "") {
            res = -99;
            return res;
        }
        if (date1.split("-")[0] === date2.split("-")[0]) {
            date1.replace(/-/g, '/');
            var cmpDate1 = Date.parse(date1);
            date2.replace(/-/g, '/');
            var cmpDate2 = Date.parse(date2);
            if (licenceNotifications !== undefined && licenceNotifications !== null && licenceNotifications !== "") {
                var showPageBorder = parseInt(licenceNotifications) * 24 * 60 * 60 * 1000;
                var limit = cmpDate2 - cmpDate1;
                if (limit < 0) {
                    res = -1;
                }
                else if (limit >= 0 && limit <= showPageBorder) {
                    res = 1;
                }
                else {
                    res = 0;
                }
            }
        }
        return res;
    };
    /**
     * 現在のタイムゾーンの日時を取得する
     * @params utcdate UTC 日時(形式：yyyy-MM-ddTHH:mm:ss)
     * @return 現在のタイムゾーンの日時(形式：yyyy-MM-ddTHH:mm:ss)
     */
    Common.prototype.getCurrentTimezoneDatetime = function (utcdate) {
        Common.log("getCurrentTimezoneDatetime() start");
        var res = "";
        // UTC と現在のタイムゾーンとの時間差を取得(秒数)
        var date = new Date();
        var currentTimezoneOffsetInSeconds = (date.getTimezoneOffset() * 60) * -1; // 標準時よりも時刻が大きいタイムゾーンでは時差は負の値となる
        // UTC 日時から加減算を行い、現在のタイムゾーンの日時を取得
        res = this.addDate(utcdate, currentTimezoneOffsetInSeconds);
        Common.log("getCurrentTimezoneDatetime() end");
        return res;
    };
    /**
     * UTCの現在日時の文字列を応答する
     * @return UTCの現在日時の文字列（書式：yyyy-MM-ddTHH:mm:ss）
     */
    Common.prototype.getUTCCurrentTime = function () {
        Common.log("getUTCCurrentTime() start");
        var res = "";
        // 現在日時とライセンス終了日を比較して、limit日数以内であれば期限切れメッセージを表示
        var now = new Date();
        var year = String(now.getUTCFullYear());
        var month = String(now.getUTCMonth() + 1).length == 1 ? "0" + String(now.getUTCMonth() + 1) : String(now.getUTCMonth() + 1);
        var day = String(now.getUTCDate()).length == 1 ? "0" + String(now.getUTCDate()) : String(now.getUTCDate());
        var hour = String(now.getUTCHours()).length == 1 ? "0" + String(now.getUTCHours()) : String(now.getUTCHours());
        var min = String(now.getUTCMinutes()).length == 1 ? "0" + String(now.getUTCMinutes()) : String(now.getUTCMinutes());
        var sec = String(now.getUTCSeconds()).length == 1 ? "0" + String(now.getUTCSeconds()) : String(now.getUTCSeconds());
        res = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec; // 例）2013-12-12T11:22:33
        Common.log("getUTCCurrentTime() end");
        return res;
    };
    /**
     * 日付を文言定義で定めた書式の文字列で出力する。
     * 予め、Wordクラスに、日付フォーマットの定義(SL_DATE_FMT_01_<言語・国>)と、SL_MONTH_TXT_01_<言語・国>の定義がされていること。
     * 日付フォーマットの定義で利用できる文字列は以下である。
     * yyyy: 年 (例: 1999)<br/>
     * MM: 月(数字) (例: 03)<br/>
     * MMM: 月(文字列) (例: Mar.)<br/>
     * d: 日付(ゼロ埋めなし) (例: 3)<br/>
     * dd: 日付(ゼロ埋めあり) (例: 03)<br/>
     * 日付フォーマットの定義は例えば以下のように記す。<br/>
     * 「yyyy.MM.dd」、「MMM d.yyyy」、「d.MM.yyyy」<br/>
     *
     * SL_MONTH_TXT_01~12には、各言語・国毎の月を表す文字列を記載する。この文字列は、フォーマットでMMMを指定した際に出力するものである。
     *
     * @params date 日時(形式：yyyy-MM-dd)
     * @params countryCode 国名を表す英小文字2文字＋大文字2文字(例：ja_JP)
     * @return フォーマットされた日付文字列(エラーの場合はnullを返す)
     */
    Common.prototype.formatDateForCountries = function (date, countryCode) {
        Common.log("formatDateForCountries() start");
        Common.log("datetime: " + date + " , countryCode: " + countryCode);
        if (date == null || countryCode == null)
            return null;
        var dateArr = date.split("-");
        if (dateArr.length != 3)
            return null;
        var yyyy = dateArr[0];
        var mm = dateArr[1];
        var dd = dateArr[2];
        var _this = this;
        var format = null;
        var mmm = null;
        var d = dd;
        if (dd.substring(0, 1) == "0") {
            d = dd.substring(1);
        }
        // フォーマットを取得
        eval("format = _this.w.SL_DATE_FMT_01_" + countryCode + ";");
        if (format == null)
            return null;
        // 月の言語・国毎の表現を取得
        eval("mmm = _this.w.SL_MONTH_TXT_" + mm + "_" + countryCode + ";");
        // formatに合わせ文字列を作成
        format = format.replace("yyyy", yyyy);
        format = format.replace("MMM", mmm);
        format = format.replace("MM", mm);
        format = format.replace("dd", dd);
        format = format.replace("d", d);
        Common.log("formatDateForCountries() end");
        return format;
    };
    /**
     * 日時情報を国ごとに決められた書式でフォーマットする
     * 例)北米：July 6.2011、欧州：6.07.2011、日本：2011.07.06
     * @params datetime 日時(形式：yyyy-MM-ddTHH:mm:ss)
     * @params countryCode 国名を表す英小文字2文字＋大文字2文字(例：ja_JP)
     * @return フォーマットされた日時情報
     */
    Common.prototype.formatDatetimeForCountries = function (datetime, countryCode) {
        Common.log("formatDatetimeForCountries() start");
        Common.log("datetime: " + datetime + " , countryCode: " + countryCode);
        var res = "";
        if (countryCode == "ja_JP") {
            // 日本の場合(例：2011.07.06)			            
            res = datetime.split("T")[0];
            res = res.replace(/-/g, ".");
        }
        else if (countryCode == "en_US" || countryCode == "fr_CA" || countryCode == "es_MX") {
            // 北米の場合(例：July 6.2011)
            res = new Date(datetime).toUTCString();
            res = res.substr(5, 11);
            if (res.indexOf("0") === 0) {
                res = res.replace("0", "");
                res = res.substr(2, 4) + res.substr(0, 1) + "." + res.substr(6, 9);
            }
            else {
                res = res.substr(3, 4) + res.substr(0, 2) + "." + res.substr(7, 10);
            }
        }
        else {
            // 欧州の場合(例：6.07.2011)
            res = datetime.split("T")[0];
            var tmp = res.split("-")[0];
            res = res.substr(8, 2) + "." + res.substr(5, 2) + "." + res.substr(0, 4);
            if (res.indexOf("0") === 0) {
                res = res.substr(1);
            }
        }
        Common.log("formatDatetimeForCountries() end");
        return res;
    };
    /**
     * 日時の加減算結果を返す
     * @params date 日時(形式：yyyy-MM-ddTHH:mm:ss)
     * @params num 加減算する秒数（1秒加算する例：1）
     * @return 結果の日時文字列(形式：yyyy-MM-ddTHH:mm:ss)
     */
    Common.prototype.addDate = function (date, num) {
        Common.log("addDate() start");
        var res = "";
        if (date == undefined || date == null || date == "") {
            return "";
        }
        // 末尾の改行文字を除去
        date = date.trim();
        var strDate1 = date.split("T")[0];
        var strTime1 = date.split("T")[1];
        var paramYear = parseInt(strDate1.split("-")[0], 10);
        var paramMonth = parseInt(strDate1.split("-")[1], 10);
        var paramDay = parseInt(strDate1.split("-")[2], 10);
        var paramHour = parseInt(strTime1.split(":")[0], 10);
        var paramMin = parseInt(strTime1.split(":")[1], 10);
        var paramSec = parseInt(strTime1.split(":")[2], 10);
        var basemSec = Date.UTC(paramYear, paramMonth - 1, paramDay, paramHour, paramMin, paramSec);
        var addmSec = num * 1000; //秒数 * 1秒のミリ秒数
        var targetSec = basemSec + addmSec;
        var d = new Date(targetSec);
        var year = String(d.getUTCFullYear());
        var month = String(d.getUTCMonth() + 1).length == 1 ? "0" + String(d.getUTCMonth() + 1) : String(d.getUTCMonth() + 1);
        var day = String(d.getUTCDate()).length == 1 ? "0" + String(d.getUTCDate()) : String(d.getUTCDate());
        var hour = String(d.getUTCHours()).length == 1 ? "0" + String(d.getUTCHours()) : String(d.getUTCHours()); // 時
        var min = String(d.getUTCMinutes()).length == 1 ? "0" + String(d.getUTCMinutes()) : String(d.getUTCMinutes()); // 分
        var sec = String(d.getUTCSeconds()).length == 1 ? "0" + String(d.getUTCSeconds()) : String(d.getUTCSeconds()); // 秒
        res = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec;
        Common.log("加減算結果の日時 = " + res);
        Common.log("addDate() end");
        return res;
    };
    /**
     * URL の GET パラメータのキー名に authtoken があれば返す
     * 無ければ null を返す
     * @return authtoken
     */
    Common.prototype.getAuthtokenGetParam = function () {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i = 0; i < parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0) {
                var key = parms[i].substring(0, pos);
                var val = parms[i].substring(pos + 1);
                if (key == "authtoken") {
                    return val;
                }
            }
        }
        return null;
    };
    /**
     * GET パラメータの中に指定されたキー名が設置されていれば値を返す
     * 無ければ null を返す
     * @params key GET パラメータのキー名
     * @return value キー名に設置された値
     */
    Common.prototype.getValueGetParam = function (key) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            if (hash[0] == key) {
                return hash[1];
            }
        }
        return null;
    };
    /**
     * メッセージを指定してダイアログを表示する
     * @params message 表示するメッセージ
     */
    Common.prototype.displayDialog = function (message) {
        // 暫定で alert 表示とする
        alert(message);
        /*
                message += '<a href="#" data-role="button" data-inline="true" data-rel="back" data-icon="back" data-transition="slidedown">OK</a>';
                $('<div/>', { id: 'displaydialog' })
                    .append($('<div/>', { id: 'displaymessage' }))
                    .appendTo(document.body);
                $("#displaymessage").html(message);
                $("#displaymessage").trigger("create");
                $('#displaydialog').dialog();
                $('#displaydialog').show();
        */
    };
    /**
     * SmartAccessにログインを行う
     * 取得できたら、非同期でcallbackを呼ぶ
     *
     * @params authType 認証種別(org, g)
     * @params scope OAuth2.0のアクセス権のスコープ
     * @params body document.body
     */
    Common.prototype.smartaccessLogin = function (authType, scope, body) {
        Common.log("smartaccessLogin() start");
        var res = null;
        document.cookie = "AVR=1; Path=/;";
        document.cookie = "CONSUMERKEY=" + this.getConsumerKey() + "; Path=/;";
        document.cookie = "CONSUMERSECRET=" + this.getConsumerSecret() + "; Path=/;";
        // アプリ情報取得APIのURLをセットする
        $('<form/>', { id: 'cse-search-box', method: 'POST', action: this.SMARTACCESS_LOGIN_URL, 'data-ajax': 'false' })
            .append($('<input/>', { type: 'hidden', name: 'oem_id', value: '1' }))
            .append($('<input/>', { type: 'hidden', name: 'callback_url', value: this.SMARTACCESS_LOGIN_CALLBACK_URL }))
            .append($('<input/>', { type: 'hidden', name: 'auth_type', value: authType }))
            .append($('<input/>', { type: 'hidden', name: 'scope', value: scope }))
            .appendTo(body)
            .submit();
        Common.log("smartaccessLogin() end");
        return;
    };
    /**
     * 課金モジュールの消費型課金へリクエストを送る
     * @params type　ID識別子（1：PID、2：ユーザID）
     * @params itemId　アイテムID
     * @params productId　プロダクトID（ストアに登録したアイテムID）
     * @params authtoken　AuthToken
     * @params pid　pid
     * @params buyerId　購入者ID
     * @params startDate　ライセンス開始日
     */
    Common.prototype.requestConsumptionBilling = function (mwsDomainWithPort, type, itemId, productId, authtoken, pid, buyerId, startDate) {
        Common.log("requestConsumptionBilling() start");
        if (pid == undefined || pid == null || pid == "") {
            pid = '';
        }
        if (authtoken == undefined || authtoken == null || authtoken == "") {
            authtoken = 'UNKNOWN';
        }
        if (buyerId == undefined || buyerId == null || buyerId == "") {
            buyerId = '';
        }
        // PCブラウザ時は課金処理しない
        if (Common.DUMMY_MWS_USE == true) {
            Common.log("ダミー時は課金処理しない");
            Common.log("requestConsumptionBilling() end");
            return;
        }
        var _this = this;
        var resCode = "";
        var url = mwsDomainWithPort + 'consumption-billing/?type=' + type + '&authtoken=' + authtoken + '&pid=' + pid + '&item_id=' + itemId + '&product_id=' + productId + '&buyer_id=' + buyerId + '&start_date=' + encodeURIComponent(startDate);
        Common.log("課金モジュールURL = " + url);
        // 進捗インジケータを表示
        $.mobile.showPageLoadingMsg();
        console.log("#9325 requestConsumptionBilling");
        console.log("showPageLoadingMsg");
        //XCode7.2/iOS9問題(#5709)暫定対応のためiPhoneとAndroidで処理を分ける
        if (navigator.userAgent.indexOf('iPhone') > 0) {
            // iPhone 用にダイアログを出さない処理を追加
            $.ajax({
                type: "GET",
                url: url,
                async: true,
                success: function (data, status, jqXHR) {
                    //レスポンスコード取得 
                    _this.showAccountingAlert(jqXHR, false);
                    Common.log("成功：消費型課金リクエスト res=" + jqXHR.responseText);
                },
                error: function (jqXHR, status, error) {
                    //XCode7.2 iOS9以上で課金APIにリクエスト時に直ぐにTimeOutErrorが返ってきてしまう不具合対応 #5709
                    //TimeOutErrorの時だけエラーメッセージを表示しない
                    var TimeOutErrorMsg = "Error: TimeoutError: DOM Exception 23";
                    if (TimeOutErrorMsg.indexOf(error) !== 0) {
                        //エラーメッセージを表示する
                        _this.showAccountingAlert(jqXHR, true);
                        Common.log("エラー：消費型課金リクエスト(status = " + status + ", code=" + jqXHR.status + ")");
                    }
                    else {
                        // Xcode7.2暫定対応
                        common = _this;
                    }
                },
                complete: function (jqXHR, status) {
                    // 購入通知処理開始
                    _this.purchaseNotice(mwsDomainWithPort);
                    //alert("ajaxComplete!!");
                }
            });
        }
        else {
            // Android 用にこれまでの処理
            $.ajax({
                type: "GET",
                url: url,
                async: true,
                success: function (data, status, jqXHR) {
                    //レスポンスコード取得 
                    _this.showAccountingAlert(jqXHR, false);
                    Common.log("成功：消費型課金リクエスト res=" + jqXHR.responseText);
                },
                error: function (jqXHR, status, error) {
                    //エラーメッセージを表示する 
                    _this.showAccountingAlert(jqXHR, true);
                    Common.log("エラー：消費型課金リクエスト(status = " + status + ", code=" + jqXHR.status + ")");
                },
                complete: function (jqXHR, status) {
                    // 購入通知処理開始
                    _this.purchaseNotice(mwsDomainWithPort);
                    //alert("ajaxComplete!!");
                }
            });
        }
        Common.log("requestConsumptionBilling() end");
    };
    /**
     * 課金時の文言切り替え関数
     * @params xhr ajaxのレスポンス
     * @params errorFlag ajax通信が成功したかどうかのフラグfalse=成功、true=失敗
     */
    Common.prototype.showAccountingAlert = function (xhr, errorFlag) {
        //var _this = this;
        eval("this.ErrorMsg = this.w.APP_035_" + this.getDeviceLanguage() + ";");
        if (errorFlag == true) {
            /*======================================================
            //HTTPステータスコードで文言を分ける場合ここに記載する
            httpStatus = xhr.status;
            if (httpStatus === "500") {
              alert("HTTPステータス500);
            }
            ==========================================================*/
            // 進捗インジケータを非表示
            $.mobile.hidePageLoadingMsg();
            console.log("#9325 showAccountingAlert :  errorFlag == true");
            console.log("hidePageLoadingMsg");
            alert(this.ErrorMsg);
        }
        else {
            //課金モジュールからのレスポンスコード(例："2101")
            var responseCode = xhr.responseText;
            if (responseCode != undefined && responseCode != null && responseCode != "") {
                // 進捗インジケータを非表示
                $.mobile.hidePageLoadingMsg();
                console.log("#9325 showAccountingAlert :  errorFlag == false  && responseCode != error");
                console.log("hidePageLoadingMsg");
                    //課金モジュールからのレスポンスコードによって表示文言を変更する
                switch (responseCode) {
                    case "2101":
                        eval("this.msg = this.w.ALERT_001_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2103":
                        eval("this.msg = this.w.ALERT_002_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2104":
                        eval("this.msg = this.w.ALERT_003_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2105":
                        eval("this.msg = this.w.ALERT_004_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2106":
                        eval("this.msg = this.w.ALERT_005_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2107":
                        eval("this.msg = this.w.ALERT_006_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2108":
                        eval("this.msg = this.w.ALERT_007_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2110":
                        eval("this.msg = this.w.ALERT_008_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2111":
                        eval("this.msg = this.w.ALERT_009_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2211":
                        eval("this.msg = this.w.ALERT_010_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2213":
                        eval("this.msg = this.w.ALERT_011_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2228":
                        eval("this.msg = this.w.ALERT_012_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2243":
                        eval("this.msg = this.w.ALERT_013_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2261":
                        eval("this.msg = this.w.ALERT_014_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2299":
                        eval("this.msg = this.w.ALERT_015_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2996":
                        eval("this.msg = this.w.ALERT_016_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2997":
                        eval("this.msg = this.w.ALERT_017_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2998":
                        eval("this.msg = this.w.ALERT_018_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    case "2999":
                        eval("this.msg = this.w.ALERT_019_" + this.getDeviceLanguage() + ";");
                        alert(this.msg);
                        break;
                    default:
                        this.writeToPhone("no_disp_licence_expired_item_ids", "", false)
                            .then(function () {
                            // 何もしない
                        }, function () {
                            // reject
                        });
                        break;
                }
            }
            else {
                //通常通らない
                // 進捗インジケータを非表示
                $.mobile.hidePageLoadingMsg();
                console.log("#9325 showAccountingAlert :  errorFlag == false  && responseCode == error");
                console.log("hidePageLoadingMsg");
            }
        }
    };
    /**
     * 言語情報を確認する(サポートされている言語か等をチェック)
     * @return 言語情報(例：ja_JP,en_US)
     */
    Common.prototype.getDeviceLanguage = function () {
        Common.log("checkDeviceLanguage() start");
        var res = "";
        //内容チェック
        if (this.appInfoJson != undefined && this.appInfoJson != null && this.appInfoJson != "") {
            //JSON形式にparse
            var appInfo = JSON.parse(this.appInfoJson);
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
                        var devOS = appInfo.os;
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
                            res = appInfo.locale;
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
                var langList = this.w.langList;
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
        }
        else {
            //appInfoJson(端末情報)が取得できていなかった場合は、アメリカ英語
            res = "en_US";
        }
        Common.log("language : " + res);
        return res;
    };
    /**
     * 国情報を確認する
     * @return 国情報(例：JP,EN)
     */
    Common.prototype.checkDeviceCountry = function (country) {
        Common.log("getDeviceCountry() start");
        if (country == null || country == undefined || country == "") {
            // 国設定が無い場合は、アメリカとする
            country = "EN";
        }
        else {
            var countryMatchFlag = false;
            var countryList = this.w.countryList;
            var i = 0;
            country = country.toUpperCase();
            if (countryList != null) {
                for (i = 0; i < countryList.length; i++) {
                    if (country == countryList[i]) {
                        countryMatchFlag = true;
                        break;
                    }
                }
                if (countryMatchFlag == false) {
                    // 端末で設定された国がサポートされていなければ、アメリカを設定
                    country = "EN";
                }
            }
            else {
                // 端末で設定された国がサポートされていなければ、アメリカを設定
                country = "EN";
            }
        }
        // 日本とアメリカのみ、アプリ・アイテム情報の国名とマッチしないので変換する
        if (country == "JP") {
            country = "JP";
        }
        else if (country == "US") {
            country = "EN";
        }
        //Magellan アプリの通貨はアメリカ、メキシコ、カナダ以外はアメリカで表示する
        if (country != "EN" && country != "CA" && country != "MX") {
            country = "EN";
        }
        return country;
    };
    /**
     * アプリ内で設定されている言語情報に変換する
     * @params language 言語情報(例：ja,en)
     * @params lang15flag 15言語対応時に true
     * @return アプリ内で設定されている言語情報(例：JP,EN)
     */
    Common.prototype.changeLanguageString = function (language, lang15flag) {
        Common.log("changeLanguageString() start");
        // 言語設定
        var languageStr = language.toUpperCase();
        if (languageStr.split("_").length == 2) {
            languageStr = languageStr.split("_")[1];
        }
        if (languageStr.split("_").length == 1) {
            languageStr = languageStr.split("_")[0];
        }
        if (languageStr == "JA") {
            languageStr = "JP";
        }
        if (languageStr == "US") {
            languageStr = "EN";
        }
        if (lang15flag == false) {
            if (languageStr == "MX") {
                languageStr = "ES";
            }
            if (languageStr == "CA") {
                languageStr = "FR";
            }
            if (languageStr == "GB") {
                languageStr = "EN";
            }
        }
        Common.log("changeLanguageString() true end");
        return languageStr;
    };
    /**
     * 文字列を base64 エンコーディングする
     * @params s base64エンコーディング対象文字列
     * @return base64エンコーディング後文字列
     */
    Common.prototype.base64encode = function (s) {
        var t = '', p = -6, a = 0, i = 0, v = 0, c;
        while ((i < s.length) || (p > -6)) {
            if (p < 0) {
                if (i < s.length) {
                    c = s.charCodeAt(i++);
                    v += 8;
                }
                else {
                    c = 0;
                }
                a = ((a & 255) << 8) | (c & 255);
                p += 8;
            }
            t += this.base64list.charAt((v > 0) ? (a >> p) & 63 : 64);
            p -= 6;
            v -= 6;
        }
        return t;
    };
    /**
     * 文字列を base64 デコーディング
     * @params s base64デコーディング対象文字列
     * @return base64デコーディング後文字列
     */
    Common.prototype.base64decode = function (s) {
        var t = '', p = -8, a = 0, c, d;
        for (var i = 0; i < s.length; i++) {
            if ((c = this.base64list.indexOf(s.charAt(i))) < 0)
                continue;
            a = (a << 6) | (c & 63);
            if ((p += 6) >= 0) {
                d = (a >> p) & 255;
                if (c != 64)
                    t += String.fromCharCode(d);
                a &= 63;
                p -= 8;
            }
        }
        return t;
    };
    /**
     * スキームとホスト名を環境に応じて書き換える
     * @private
     * @params oldUrl 書き換え対象のURL
     * @return 書き換え後のURL
     */
    Common.prototype.replaceUrl = function (oldUrl) {
        return oldUrl.replace(/SCHEME/, location.protocol).replace(/HOSTNAME/, location.hostname).replace(/PORT/, location.port);
    };
    /**
     * 購入(再)通知モジュールの呼び出し
     */
    Common.prototype.purchaseNotice = function (mwsDomainWithPort) {
        Common.log("purchaseNotice start");
        var d = $.Deferred();
        var url = mwsDomainWithPort + 'purchase-notice/';
        Common.log("購入（再）通知URL = " + url);
        $.ajax({
            type: "GET",
            url: url,
            async: true,
            success: function (data) {
                Common.log("購入（再）通知リクエスト成功");
                d.resolve();
            },
            error: function (jqXHR, status, error) {
                Common.log("購入（再）通知リクエストエラー(status = " + status + ", code=" + jqXHR.status + ")");
                d.resolve();
            }
        });
        Common.log("purchaseNotice end");
        return d.promise();
    };
    /**
     * サーバコンソールログの出力設定をする<br/>
     * この設定後、Common.log() でログ出力をする。
     * ログ出力先として、(sat01サーバ, console.log, 出力しない)を選択できる。デフォルトは出力しない。
     * sat01サーバに出力する場合、以下に出力される。
     * 　出力先パス：/var/log/smartaccess/Application_SVRConsole.log
     * 　ログの使用例： # tail -f /var/log/smartaccess/Application_SVRConsole.log |grep TAGNAME
     * @static
     * @params out ログの出力先(COMMON_LOG_MODE.SERVER=sat01サーバにログを送信する, COMMON_LOG_MODE.CONSOLE＝console.logで出力する, COMMON_LOG_MODE.NONE＝ログ出力しない) デフォルトはnoneでログ出力されない。
     * @params tag ログにつけるタグ名。アプリの識別などに利用。
     * @params archive (任意)ログを一括送信するか(true=一括送信する, false=しない) 出力先がサーバの場合のみ有効な設定。デフォルト true
     * @params sendInterval (任意)ログ一括送信時のログ送信の間隔(秒)。デフォルト30秒
     * @params pid (任意)ログを出力する車載機のPID。デフォルトはハイフン(-)で出力
     */
    Common.logSettings = function (out, tag, archive, sendInterval, pid) {
//        out = COMMON_LOG_MODE.CONSOLE;
        switch (out) {
            case COMMON_LOG_MODE.SERVER:
                Common.SVR_CONSOL_LOG_MODE = COMMON_LOG_MODE.SERVER;
                break;
            case COMMON_LOG_MODE.CONSOLE:
                Common.SVR_CONSOL_LOG_MODE = COMMON_LOG_MODE.CONSOLE;
                break;
            default:
                Common.SVR_CONSOL_LOG_MODE = COMMON_LOG_MODE.NONE;
        }
        if (!Common.checkNullString(tag)) {
            Common.SVR_CONSOL_LOG_TAG = tag;
        }
        if (archive == undefined || archive == null || archive == true) {
            Common.SVR_CONSOL_LOG_ARCHIVE = true;
            // 一括送信時
            if (sendInterval == undefined || sendInterval == null || sendInterval <= 0) {
                Common.SVR_CONSOL_LOG_SEND_INTERVAL = 30;
            }
            else {
                Common.SVR_CONSOL_LOG_SEND_INTERVAL = sendInterval;
            }
            // 一括送信用のワーカを開始
            Common.logList = new Array();
            Common.startSendLogWorker();
        }
        else {
            Common.SVR_CONSOL_LOG_ARCHIVE = false;
        }
        if (!Common.checkNullString(pid)) {
            Common.SVR_CONSOL_LOG_PID = pid;
        }
    };
    /**
     * ログ出力する<br/>
     * 送信前に、Common.logSettings() でログ出力設定を行っておくこと。
     * 一括送信時は、送信間隔毎にまとめてサーバへ送信される。
     * @static
     * @params msg 出力するログ
     */
    Common.log = function (msg) {
        // ログ出力モード判定
        if (Common.SVR_CONSOL_LOG_MODE == COMMON_LOG_MODE.CONSOLE) {
            // コンソールログ出力
            console.log(msg);
            return;
        }
        else if (Common.SVR_CONSOL_LOG_MODE == COMMON_LOG_MODE.NONE) {
            // ログ出力なし
            return;
        }
        if (Common.SVR_CONSOL_LOG_ARCHIVE) {
            // 一括送信の場合、送信するログを蓄積する
            if (Common.logList == null) {
                Common.logList = new Array();
            }
            Common.logList.push({
                time: new Date().getTime(),
                msg: msg
            });
        }
        else {
            // 単発送信の場合、都度送信する
            Common.sendLog(msg);
        }
    };
    /**
     * ログ一括送信用のワーカを開始する
     **/
    Common.startSendLogWorker = function () {
        // ログの一括送信処理開始
        setInterval(function () {
            // 蓄積されたログがなければ終了
            if (Common.logList.length <= 0) {
                return;
            }
            // 送信用のデータを作成する
            var msg = JSON.stringify({ messages: Common.logList });
            // 蓄積ログをクリアする
            Common.logList = new Array();
            // 送信する
            Common.sendLog(msg);
        }, Common.SVR_CONSOL_LOG_SEND_INTERVAL * 1000);
    };
    /**
     * 非同期でログを送信する
     **/
    Common.sendLog = function (msg) {
        var archive = "";
        if (Common.SVR_CONSOL_LOG_ARCHIVE) {
            archive = "on";
        }
        // サーバへ送信する
        var data = {
            "apikey": Common.SVR_CONSOL_LOG_APIKEY,
            "tag": Common.SVR_CONSOL_LOG_TAG,
            "pid": Common.SVR_CONSOL_LOG_PID,
            "archive": archive,
            "msg": msg
        };
        $.ajax({
            type: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: Common.SVR_CONSOL_LOG_URL,
            data: data,
            async: true,
            success: function (data, status, jqXHR) {
                //				console.log("ログ送信成功");
            },
            error: function (jqXHR, status, error) {
                //				console.log("ログ送信エラー(status = " + status + ", code=" + jqXHR.status + ")");
            }
        });
    };
    /**
     * 文字列のnullチェックをする<br/>
     * @static
     * @return true=undefinedもしくはnullもしくは空白文字 の場合, false=それ以外
     * @param msg 出力するログ
     */
    Common.checkNullString = function (str) {
        if (str != undefined && str != null && str != "") {
            return false;
        }
        return true;
    };
    /**
     * .(ピリオド)で区切られた文字列のバージョンを比較する    ※第一引数が第二引数より桁数が多いか同じことを前提とする(修正する場合、桁合わせのために0埋めを行うか、lengthの長い方をbaseにする想定)　2016/01/06 ferix布生
     * @param beseVersion バージョン1(形式："d.d.d")          ※string
     * @param version バージョン2(形式："d.d.d")              ※string
     * @return (バージョン1>バージョン2のとき)=1, (バージョン1==バージョン2のとき)=0, (バージョン1<バージョン2のとき)=-1　※引数のフォーマットが違った場合=-99
     */
    Common.prototype.cmpVersion = function (baseVersion, version) {
        Common.log("cmpVersion() start");
        //引数が不正な場合例外(-99)をリターン
        var res = -99;
        //引数チェック
        if (baseVersion != "" && baseVersion != undefined && baseVersion != null) {
            if (version != "" && version != undefined && version != null) {
                // "."(ピリオド)でsplit　※先頭から比較していく
                var baseVersionArray = baseVersion.split(".");
                var versionArray = version.split(".");
                var base = undefined;
                var cmpVersion = undefined;
                //同値だった場合0をリターン
                res = 0;
                //baseVersionArray.length分ループ
                for (var i = 0; i < baseVersionArray.length; i++) {
                    //文字を数値に変換
                    base = parseInt(baseVersionArray[i], 10);
                    cmpVersion = parseInt(versionArray[i], 10);
                    //引数の内容をチェック
                    if (isNaN(base)) {
                        //baseが数値以外ならば例外(-99)をリターン
                        res = -99;
                        break;
                    }
                    else if (i == versionArray.length) {
                        if (base == 0) {
                            // 例) 1.0.7.0 と 1.0.7は同等
                            res = 0;
                            break;
                        }
                        //baseの方が大きいので1をリターン  ※ 例) base = 1.0.7.1 version = 1.0.7  
                        res = 1;
                        break;
                    }
                    else if (isNaN(cmpVersion)) {
                        //cmpVersion数値以外ならば例外(-99)をリターン
                        //桁数チェックの前に実行してしまうと桁数が違う場合例外になってしまう
                        res = -99;
                        break;
                    }
                    //baseの方が大きいので1をリターン
                    if (base > cmpVersion) {
                        res = 1;
                        break;
                    }
                    else if (base < cmpVersion) {
                        res = -1;
                        break;
                    }
                }
            }
        }
        Common.log("res = " + res);
        Common.log("cmpVersion() end");
        return res;
    };
    /**
     * getAppList関数に渡す情報(言語情報+通貨情報(国情報))を　2016/01/06 ferix布生
     * @param language 言語情報
     * @param country  国情報
     * @return 例) en_US,fr_CA
     */
    Common.prototype.addCurrencyInfo = function (language, country) {
        Common.log("cmpVersion() start");
        //国情報チェック
        if (country != undefined && country != null && country != "") {
            country = country.toUpperCase();
            //言語情報に通貨情報(国情報)を付与　　※ ,区切り
            if (country == "JP") {
                language += ",";
                language += "ja_JP";
            }
            else if (country == "EN") {
                language += ",";
                language += "en_US";
            }
            else if (country == "FR") {
                language += ",";
                language += "fr_FR";
            }
            else if (country == "ES") {
                language += ",";
                language += "es_ES";
            }
            else if (country == "DE") {
                language += ",";
                language += "de_DE";
            }
            else if (country == "IT") {
                language += ",";
                language += "it_IT";
            }
            else if (country == "RU") {
                language += ",";
                language += "ru_RU";
            }
            else if (country == "SV") {
                language += ",";
                language += "sv_SV";
            }
            else if (country == "NL") {
                language += ",";
                language += "nl_NL";
            }
            else if (country == "PL") {
                language += ",";
                language += "pl_PL";
            }
            else if (country == "EL") {
                language += ",";
                language += "el_EL";
            }
            else if (country == "CS") {
                language += ",";
                language += "cs_CS";
            }
            else if (country == "GB") {
                language += ",";
                language += "en_GB";
            }
            else if (country == "CA") {
                language += ",";
                language += "fr_CA";
            }
            else if (country == "MX") {
                language += ",";
                language += "es_MX";
            }
            else {
                //未対応の国情報の場合アメリカ設定を付与
                language += ",";
                language += "en_US";
            }
        }
        else {
            //国情報が取得できなかった場合はアメリカ設定を付与
            language += ",";
            language += "en_US";
        }
        var res = language;
        Common.log("res = " + res);
        Common.log("cmpVersion() end");
        return res;
    };
    /**
    * pid_historyに登録されていないPIDをselected_pidから削除する
    *
    */
    Common.prototype.checkPidList = function () {
        Common.log("checkPidList() start");
        var d = $.Deferred();
        //一度string型で取得し内容をチェック　※ ""(値が登録されていないとき等) をJSON.parseすると固まる
        var tmpPidHistory = "";
        var pidConnectedHistory = [];
        var tmpSelectedPid = "";
        var pidSelectedHistory = [];
        var _this = this;
        this.getFrPhone("pid_history")
            .then(function (data) {
            tmpPidHistory = data;
            if (tmpPidHistory != undefined && tmpPidHistory != null && tmpPidHistory != "" && tmpPidHistory.length > 0) {
                // pid の接続履歴を取得する ※配列で取得できるようにJSON.pase
                pidConnectedHistory = JSON.parse(tmpPidHistory);
            }
            else {
                //処理終了通知
                d.resolve();
                return;
            }
            //取得できたかのチェック
            if (pidConnectedHistory == undefined || pidConnectedHistory == null || tmpPidHistory.length <= 0) {
                //処理終了通知
                d.resolve();
                return;
            }
            _this.getFrPhone("selected_pid")
                .then(function (data) {
                tmpSelectedPid = data;
                if (tmpSelectedPid != undefined && tmpSelectedPid != null && tmpSelectedPid != "" && tmpSelectedPid.length > 0) {
                    // pid の選択履歴を取得する ※配列で取得できるようにJSON.pase
                    pidSelectedHistory = JSON.parse(tmpPidHistory);
                }
                //取得できたかのチェック
                if (pidSelectedHistory == undefined || pidSelectedHistory == null || pidSelectedHistory.length <= 0) {
                    //選択履歴が無くても成功扱い
                    d.resolve();
                    return;
                }
                //pid
                var pid1 = "";
                var pid2 = "";
                var notExistFlag = false;
                //選択履歴の数だけループ
                for (var i = 0; i < pidSelectedHistory.length; i++) {
                    //選択履歴のpid抽出
                    pid1 = pidSelectedHistory[i].split(" ")[0];
                    for (var j = 0; j < pidConnectedHistory.length; j++) {
                        //接続履歴のpidを抽出
                        pid2 = pidConnectedHistory[j].split(" ")[0];
                        //pidが一致すればbreak
                        if (pid1 === pid2) {
                            //接続履歴(pid_history)に同pidがあれば削除する必要なし
                            break;
                        }
                        else if (j === pidConnectedHistory.length - 1) {
                            notExistFlag = true;
                            //同じpidの要素を削除
                            pidSelectedHistory.splice(i, 1);
                            //要素を削除すると参照する要素がズレるのでカウンタをマイナスする
                            i--;
                        }
                    }
                }
                //1件でも削除が実行されていればkvsの選択履歴を更新（上書き）
                if (notExistFlag) {
                    _this.writeToPhone("selected_pid", pidSelectedHistory, true)
                        .then(function () {
                        // 何もしない
                        //処理終了通知
                        d.resolve();
                        return;
                    }, function () {
                        //reject
                        d.resolve();
                        return;
                    });
                }
                //処理終了通知
                d.resolve();
                return;
            }, function () {
                //getFrPhone() "selected_pid"
                //処理終了通知
                d.resolve();
                return;
            });
        }, function () {
            //getFrPhone() "pid_history"
            d.resolve();
            return;
        });
        Common.log("getPidList() end");
        return d.promise();
    };
    ;
    /**
     * selected_pidの引継先PIDの日付を更新
     * KVSのselected_pidに格納したPIDのうち、引数で指定されたPIDの時刻を現在時刻に更新し、配列の末尾に移動する。
     * selected_pidに引数で指定されたPIDがない場合は、PIDと現在時刻を配列の末尾に追加する。
     * selected_pidがKVSに存在しない場合は、引数で渡されたPIDと現在時刻のみを含むselected_pidを作成しKVSに追加する。
     *
     * @param pid 更新対象のPID
     */
    Common.prototype.updateSelectedPid = function (pid) {
        Common.log("updateSelectedPid() start");
        var d = $.Deferred();
        var pidData = "";
        var tmpPidHistory = "";
        var pidSelectedList = [];
        var _this = this;
        // 選択されたpidの日付を更新
        if (pid != undefined && pid != null && pid != "") {
            //選択されたpidにタイムスタンプを付与　（スペースで区切る）
            pidData = pid + " " + this.getCurrentTimezoneDatetime(this.getUTCCurrentTime());
        }
        // pidの選択履歴をselected_pidから取得 ※配列で取得できるようにJSON.parse
        _this.getFrPhone("selected_pid")
            .then(function (data) {
            tmpPidHistory = data;
            if (tmpPidHistory != undefined && tmpPidHistory != null && tmpPidHistory != "") {
                // pid の接続履歴を取得する ※配列で取得できるようにJSON.parse
                pidSelectedList = JSON.parse(tmpPidHistory);
            }
            else {
                pidSelectedList = null;
            }
            if (pidSelectedList != undefined && pidSelectedList != null && pidSelectedList.length > 0) {
                //リスト内に同じPIDが配列内にあれば削除する
                for (var i = 0; i < pidSelectedList.length; i++) {
                    if (pidSelectedList[i].split(" ")[0] == pid) {
                        //同じpidの要素を削除(配列の先頭に近いほど古い)
                        pidSelectedList.splice(i, 1);
                        break;
                    }
                }
                //リストに選択したPIDの履歴を追加
                pidSelectedList.push(pidData);
                //kvsのselected_pidに保存
                _this.writeToPhone("selected_pid", pidSelectedList, true)
                    .then(function () {
                    d.resolve();
                    return;
                }, function () {
                    d.resolve();
                    return;
                });
            }
            else {
                //JSONでkvsに保存するために配列を用意
                var tmpArray = [];
                tmpArray[0] = pidData;
                //kvsのselected_pidに保存
                _this.writeToPhone("selected_pid", tmpArray, true)
                    .then(function () {
                    d.resolve();
                    return;
                }, function () {
                    d.resolve();
                    return;
                });
            }
        }, function () {
            d.resolve();
            return;
        });
        Common.log("updateSelectedPid() end");
        return d.promise();
    };
    Common.DUMMY_MWS_USE = false; // PCデバッグ時はダミーポートを使う
    Common.TEST_DOMAINPORT = "http://127.0.0.1:8008/"; // DUMMY_MWS_USE=trueの時に使われるドメインとポート
    /** サーバコンソールログ取得API */
    Common.SVR_CONSOL_LOG_TAG = "4CAR"; // ログのタグ名
    Common.SVR_CONSOL_LOG_PID = ""; // ログを出力するPID
    Common.SVR_CONSOL_LOG_ARCHIVE = true; // ログの一括送信(true=する)
    Common.SVR_CONSOL_LOG_SEND_INTERVAL = 5; // ログ送信の間隔(秒)
    Common.SVR_CONSOL_LOG_MODE = COMMON_LOG_MODE.CONSOLE; // ログ出力先
    Common.SVR_CONSOL_LOG_APIKEY = "jffif89w4ofajiw390fiopjdf"; // サーバにコンソールログのAPIキー
    //ログ出力は行わない 2016/05/25
    //	static SVR_CONSOL_LOG_URL: string = "http://sat01.clarion.co.jp/SvrConsoleLog/sendLog";		// サーバコンソールログ出力APIのURL。サーバにコンソールログを送信しない場合はnullを指定する。
    Common.SVR_CONSOL_LOG_URL = null; // サーバコンソールログ出力APIのURL。ログ送信しない場合はnullを指定する。コード内でPCデバッグ時はnullにしているのでここでは変更しないこと！
    Common.logList = null; // 一括送信用の蓄積ログ
    return Common;
})();
//# sourceMappingURL=smt.common.js.map