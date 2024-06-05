//----------------------------------------------------------------------------- //
//smt.word.js
//@@author hirao
//@since 2014/02/18
//----------------------------------------------------------------------------- //
/**********************************************************************************
 * typescript型宣言
 *
 *********************************************************************************/
/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile.d.ts" />
/**
 * 多言語対応文言定義クラス
 * @class 多言語対応文言定義クラス
 */
var Word = (function () {
    function Word() {
        // 設定言語リスト
        // (日本語、英語(US)、フランス語、スペイン語、ドイツ語、イタリア語、ロシア語、スウェーデン語、オランダ語、ポーランド語、ギリシャ語、チェコ語、イギリス英語、カナダフランス語、メキシコスペイン語)
        this.langList = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX"];
        this.otaLangList = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX", "ar", "pt", "pt_BR", "no", "zh_CN", "zh_TW", "ms", "th", "fil", "he"];
        // 暫定：アラビア語対応
        // public langList: any = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX", "ar_SA"];
        // 設定国リスト
        // (日本、アメリカ、フランス、スペイン、ドイツ、イタリア、ロシア、スウェーデン、オランダ、ポーランド、ギリシャ、チェコ、イギリス、カナダ、メキシコ)
        this.countryList = ["JP", "US", "FR", "ES", "DE", "IT", "RU", "SV", "NL", "PL", "EL", "CS", "GB", "CA", "MX"];
        ////////////////////////////////////////////////////////////////
        // 共通で利用できる文言ID
        ////////////////////////////////////////////////////////////////
        //日本
        this.LOCATION_001 = "日本";
        //アメリカ
        this.LOCATION_002 = "United States";
        //カナダ
        this.LOCATION_003 = "Canada";
        //メキシコ
        this.LOCATION_004 = "México";
        //イギリス
        this.LOCATION_005 = "United Kingdom";
        //フランス
        this.LOCATION_006 = "France";
        //ドイツ
        this.LOCATION_007 = "Deutschland";
        //オランダ
        this.LOCATION_008 = "Nederland";
        //イタリア
        this.LOCATION_009 = "Italia";
        //スペイン
        this.LOCATION_010 = "España";
        //スウェーデン
        this.LOCATION_011 = "Sverige";
        //ポーランド
        this.LOCATION_012 = "Polska";
        //ギリシャ
        this.LOCATION_013 = "Ελλάδα";
        //チェコ
        this.LOCATION_014 = "Česko";
        //ロシア
        this.LOCATION_015 = "Россия";
        //ポルトガル
        this.LOCATION_016 = "Portugal";
        //フィンランド
        this.LOCATION_017 = "Suomi";
        //ハンガリー
        this.LOCATION_018 = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999 = "Others";
        ////////////////////////////////////////////////////////////////
        // 日本語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_ja_JP = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_ja_JP = "";
        this.HOME_006_2_ja_JP = "の有効期限が終了しました。<br />";
        this.HOME_006_3_ja_JP = "「";
        this.HOME_006_4_ja_JP = "」";
        this.HOME_006_5_ja_JP = "をご利用頂く為には、機能購入が必要となります。<br />詳細につきましては、「購入画面表示」ボタンをタップして下さい。";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_ja_JP = "購入画面表示";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_ja_JP = "後で";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_ja_JP = "今後表示しない";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_ja_JP = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_ja_JP = "DownLoad Fail.Click To Try Again.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_ja_JP = "接続履歴がありません";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_ja_JP = "BACK";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_ja_JP = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_ja_JP = "有効期限";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_ja_JP = "アプリイメージ";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_ja_JP = "アプリ概要";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_ja_JP = "アプリ情報";
        // 販売元(4Car_TXT_0082)
        this.APP_010_ja_JP = "販売元";
        // バージョン(4Car_TXT_0084)
        this.APP_011_ja_JP = "バージョン";
        // 設定(4Car_TXT_0085)
        this.APP_012_ja_JP = "設定";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_ja_JP = "ナビ表示";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_ja_JP = "アプリ内アイテム購入";
        // 非表示(4Car_TXT_0077)
        this.APP_015_ja_JP = "非表示";
        // 表示(4Car_TXT_0066)
        this.APP_016_ja_JP = "表示";
        // 無料(4Car_TXT_0177)
        this.APP_017_ja_JP = "無料";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_ja_JP = "購入済み";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_ja_JP = "販売停止";
        // まで(4Car_TXT_0180)
        this.APP_020_ja_JP = "まで";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_ja_JP = "あと";
        this.APP_021_2_ja_JP = "日以内に切れます";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_ja_JP = "有効期限";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_ja_JP = "期間選択";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_ja_JP = "キャンセル";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_ja_JP = "購入する期間を選択して下さい。<br /><br /><font color='red'>※ご注意<br />下部の表示価格と実際の決済価格が異なる場合があります。<br />[購入実行]ボタン押下後に表示される決済価格を確認の上ご購入ください。</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_ja_JP = "決定";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_ja_JP = "カーナビ確認";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_ja_JP = "本機能を利用するカーナビを確認して下さい。購入した機能は、選択したカーナビのみで利用可能となります。";
        this.APP_028_2_ja_JP = "購入処理が終了しますと「サービスの登録に成功しました。」とメッセージが表示されます。それまでは、アプリ画面の終了や、車載機との通信の切断（通信している場合）を行わないで下さい。";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_ja_JP = "登録中のカーナビ";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_ja_JP = "購入実行";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_ja_JP = "他のカーナビに変更";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_ja_JP = "接続した事のあるカーナビ(最後に接続した日時)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_ja_JP = "以下のボタンを押してアプリ一覧画面へ移動してください。";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_ja_JP = "アプリ一覧を表示する";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_ja_JP = "購入に失敗しました。スマートフォンでSUBARU STARLINKアプリ再起動してから再度お試しください。";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_ja_JP = "処理に時間がかかっています。購入が正常に完了していない可能性があります。お手数ですが、しばらくしてから、アプリ画面で購入が完了しているかご確認ください。";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_ja_JP = "on";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_ja_JP = "off";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_ja_JP = "エラーが発生しました。<br />ご迷惑をお掛けして申し訳ございません。<br />しばらくしてから再度お試しください。";
        // カーナビ未登録時文言
        this.APP_EX01_ja_JP = "登録されていません";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_ja_JP = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_ja_JP = "利用規約";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_ja_JP = "設定";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_ja_JP = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_ja_JP = "BACK";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_ja_JP = "4Carアプリ内データ削除";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_ja_JP = "4Carアプリ内の設定データが消去されます。<br />（バージョン1.0.5以降で利用可）<br />※車載機との連携動作が不安定な場合にお試しください。";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_ja_JP = "全データを消去しますか？";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_ja_JP = "全データを消去しました。";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_ja_JP = "本機能はバージョン1.0.5以降で利用可能です。";
        //STARLINK エラー対応
        this.APP_Error_ja_JP = "ダウンロード失敗。";
        //STARLINK対応
        this.APP_041_ja_JP = "更新";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_ja_JP = "BACK";
        //ヘッダー部文言
        this.CONFIG_002_ja_JP = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_ja_JP = "STARLINKアプリ内の設定データが消去されます。";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_ja_JP = "※車載機との連携動作が不安定な場合にお試しください。";
        //confirmダイアログ用文言
        this.CONFIG_005_ja_JP = "全データを消去しますか？";
        //confirmダイアログ用文言
        this.CONFIG_006_ja_JP = "全データを消去しました。";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_ja_JP = "STARLINKアプリ内データ削除";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_ja_JP = "CODE: 2101\n購入がキャンセルされました。";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_ja_JP = "CODE: 2103\n購入に失敗しました。アカウントが入力されていないもしくは、OS、ストアバージョンが古い可能性があります。";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_ja_JP = "CODE: 2104\n購入できないアイテムが選択されたため購入に失敗しました。";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_ja_JP = "CODE: 2105\n購入に失敗しました。時間をおいて再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_ja_JP = "CODE: 2106\n購入に失敗しました。時間をおいて再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_ja_JP = "CODE: 2107\n購入済みのアイテムのため、購入できません。";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_ja_JP = "CODE: 2108\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_ja_JP = "CODE: 2110\n購入できないアカウントが設定されています。購入可能なアカウントで再度ご購入ください。";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_ja_JP = "CODE: 2111\n通信が切断されました。電波環境の良い場所で再度ご購入ください。";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_ja_JP = "CODE: 2211\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_ja_JP = "CODE: 2213\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_ja_JP = "CODE: 2228\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_ja_JP = "CODE: 2243\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_ja_JP = "CODE: 2261\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_ja_JP = "CODE: 2299\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_ja_JP = "CODE: 2996\n購入が中断したアイテムがあります。復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_ja_JP = "CODE: 2997\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_ja_JP = "CODE: 2998\nサーバとの通信が失敗したため、購入が失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_ja_JP = "CODE: 2999\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_ja_JP = "利用地域選択";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_ja_JP = "主にご利用になられる地域を選択してください";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_ja_JP = "※お客様の利用地域に応じた最適なアプリをご提供致します。";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_ja_JP = "利用規約";
        //利用規約更新日付文言
        this.CONFIG_012_ja_JP = "2017年4月1日 更新";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_ja_JP = "地図データ転送中はデータを削除できません。転送が完了してからお試しください。";

        //日本
        this.LOCATION_001_ja_JP = "日本";
        //アメリカ
        this.LOCATION_002_ja_JP = "United States";
        //カナダ
        this.LOCATION_003_ja_JP = "Canada";
        //メキシコ
        this.LOCATION_004_ja_JP = "México";
        //イギリス
        this.LOCATION_005_ja_JP = "United Kingdom";
        //フランス
        this.LOCATION_006_ja_JP = "France";
        //ドイツ
        this.LOCATION_007_ja_JP = "Deutschland";
        //オランダ
        this.LOCATION_008_ja_JP = "Nederland";
        //イタリア
        this.LOCATION_009_ja_JP = "Italia";
        //スペイン
        this.LOCATION_010_ja_JP = "España";
        //スウェーデン
        this.LOCATION_011_ja_JP = "Sverige";
        //ポーランド
        this.LOCATION_012_ja_JP = "Polska";
        //ギリシャ
        this.LOCATION_013_ja_JP = "Ελλάδα";
        //チェコ
        this.LOCATION_014_ja_JP = "Česko";
        //ロシア
        this.LOCATION_015_ja_JP = "Россия";
        //ポルトガル
        this.LOCATION_016_ja_JP = "Portugal";
        //フィンランド
        this.LOCATION_017_ja_JP = "Suomi";
        //ハンガリー
        this.LOCATION_018_ja_JP = "Magyarország";
        //バージョンアップ必要時文言
        this.VERSION_001_ja_JP = "最新のSUBARU STARLINKアプリにアップデートしてご利用ください。";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_ja_JP = "新しい車載機に接続されました。<br/>購入済みのライセンスを新しい車載機に引き継ぎますか？";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_ja_JP = "はい";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_ja_JP = "いいえ";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_ja_JP = "後で表示";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_ja_JP = "【注意】";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_ja_JP = "以後この車載機へライセンスを引き継ぐことができなくなりますがよろしいですか？";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_ja_JP = "どの車載機からライセンスを<br/>引き継ぎますか？";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_ja_JP = "車載機ID： ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_ja_JP = "接続日：";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_ja_JP = "nnnn年n月n日";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_ja_JP = "キャンセル";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_ja_JP = "%1に接続した車載機のライセンスをこの車載機に引き継ぎます。";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_ja_JP = "引き継ぎに成功しました。";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_ja_JP = "引き継ぎに失敗しました。";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_ja_JP = "%1に新しい車載機（車載機ID：%2）に接続されました。<br/>購入済みのライセンスを新しい車載機に引き継ぎますか？";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_ja_JP = "以後、%1に接続した新しい車載機（車載機ID：%2）へライセンスを引き継ぐことができなくなりますがよろしいですか？";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_ja_JP = "以下の引き継ぎを行います。";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_ja_JP = "前回のライセンス引き継ぎが成功しました。";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_ja_JP = "ナビゲーション機能選択";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_ja_JP = "ナビゲーション機能が複数ある車載機がございます。ご利用するナビゲーションを選択してください。<br /><br />※車載機のアプリで目的地を設定する場合のナビゲーションを選択することができます。";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_ja_JP = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_ja_JP = "ナビゲーション機能選択";
        //月表示(1月)
        this.SL_MONTH_TXT_01_ja_JP = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_ja_JP = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_ja_JP = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_ja_JP = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_ja_JP = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_ja_JP = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_ja_JP = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_ja_JP = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_ja_JP = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_ja_JP = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_ja_JP = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_ja_JP = "";
        //日付表示形式
        this.SL_DATE_FMT_01_ja_JP = "yyyy.MM.dd";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_ja_JP = "サイズ: ";
        this.TXT_YELP_0029_ja_JP = "エラーが発生しました。しばらくしてから再度お試しください。";
        this.SL_TXT_0155_ja_JP = "Ver. ";
        this.SL_TXT_0189_ja_JP = "* 更新";
        this.SL_TXT_0191_ja_JP = "有効期限：";
        this.SL_TXT_0192_ja_JP = "地図更新設定";
        this.SL_TXT_0193_ja_JP = "車載機の地図データを地図配信サーバーからスマートフォンに一時保存できます。次回車載機と接続する際に車載機の地図を更新できます。";
        this.SL_TXT_0196_ja_JP = "更新設定";
        this.SL_TXT_0197_ja_JP = "自動更新確認";
        this.SL_TXT_0198_ja_JP = "モバイルデータ通信";
        this.SL_TXT_0199_ja_JP = "更新情報";
        this.SL_TXT_0200_ja_JP = "全てダウンロード";
        this.SL_TXT_0201_ja_JP = "スマートフォンにダウンロード済み";
        this.SL_TXT_0202_ja_JP = "更新データあり";
        this.SL_TXT_0203_ja_JP = "車載機を更新済み";
        this.SL_TXT_0204_ja_JP = "地図: ";
        this.SL_TXT_0204_A_ja_JP = "欧州";
        this.SL_TXT_0205_ja_JP = "バージョン: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_ja_JPを利用　宣言のみ
        this.SL_TXT_0206_ja_JP = "サイズ: ";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_ja_JP = "スマートフォンの空き容量が不足しています。";
        this.SL_TXT_0208_ja_JP = "車載機で地域設定を行ってください。";
        this.SL_TXT_0209_ja_JP = "MapCareサブスクリプションの有効期限が切れました。サブスクリプションを更新するにはwww.subaru-maps.comをご覧ください。";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_ja_JP = "30MBを超える地図データはWi-Fi環境でダウンロードしてください。";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_ja_JP = "スマートフォンと車載機を接続して車載機の地図を更新してください。車載機の更新後、地図データはスマートフォンから自動で削除されます。";
        this.SL_TXT_0212_ja_JP = "モバイルデータ通信をONにすると、Wi-Fi環境以外でもダウンロードできます。\n※30MBを超える地図データはダウンロードできません。\n※データ通信料が発生します。\n\nモバイルデータ通信をOFFにすると、Wi-Fi環境でのみダウンロードできます。";
        this.SL_TXT_0213_ja_JP = "自動更新確認をONにすると自動で車載機の地図データをスマートフォンに一時保存します。\n※データ通信料が発生します。";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_ja_JP = "車載機との接続が切断されました。車載機との接続をお確かめの上、再度お試しください。";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_ja_JP = "車載機のストレージ容量が不足しています。車載機の設定をお確かめの上、再度お試しください。";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_ja_JP = "データを転送中にエラーが発生しました。しばらくしてから再度お試しください。";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_ja_JP = "サーバから地図データをダウンロード中にエラーが発生しました。しばらくしてから再度お試しください。";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_ja_JP = "スマートフォンのストレージ容量が不足しています。お使いのスマートフォン内のデータを削除してから再度お試しください。";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_ja_JP = "モバイルデータ通信設定が\"OFF\"です。\nWi-Fi環境でダウンロードしてください。";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_ja_JP = "サーバとの通信が切断されました。通信環境をお確かめの上、再度お試しください。";
        // SL_TXT_0221 ※OTHER_SIZE_0001_ja_JPを利用　宣言のみ
        this.SL_TXT_0221_ja_JP = "サイズ: *MB";
        // SL_TXT_0222
        this.SL_TXT_0222_ja_JP = "もし、地図データの転送中に以下操作した場合でも途中から転送を再開いたします。\n　・車載機電源OFF\n　・スマホ電源OFF\n　・車載機ースマホ通信切断\n　・スマホアプリ終了";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_ja_JP = "OK";
        this.HTML_TXT_0068_ja_JP = "地図データのダウンロード中にスマートフォンが「スリープモード」にならないようにしてください。\nスマートフォンがスリープモードになった場合、再度SUBARU STARLINKアプリを起動してください。";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_ja_JP = "地図更新が開始できません。車載機の状態を確認してください。";
        this.HTML_TXT_0165_ja_JP = "地図更新設定の機能";
        this.HTML_TXT_0166_ja_JP = "1.地図データをサーバーからスマートフォンにダウンロードします。<br><br>2.スマートフォンを車載機に接続すると地図データが車載機に転送されます。地図データは転送後にスマートフォンから消去されます。";
        this.HTML_TXT_0167_ja_JP = "※スマートフォンを複数の車載機と接続した場合、地図更新情報は最後に接続した車載機のデータを表示します。";
        this.HTML_TXT_0168_ja_JP = "都市名を入力してください";
        this.HTML_TXT_0169_ja_JP = "更新確認";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_ja_JP = "進捗アイコンを押すとダウンロードを中止できます。";
        this.HTML_TXT_0171_ja_JP = "更新開始";
        this.HTML_TXT_0172_ja_JP = "スマートフォンの容量が不足しています。スマートフォンのデータを削除してから再度お試しください。";
        this.HTML_TXT_0173_ja_JP = "ローディングアイコン * をタップするとダウンロードを中止します。";
        this.HTML_TXT_0174_ja_JP = "キャンセルボタンを押すと検索を中止します。";
        this.HTML_TXT_0175_ja_JP = "現在地から選択した地域までの地域を選択しています。";
        this.HTML_TXT_0176_ja_JP = "車載機に地図データを転送しています。";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_ja_JP = "*地図データのインストール完了";
        this.HTML_TXT_0178_ja_JP = "検索結果がありません。再度お試しください。";
        this.HTML_TXT_0179_ja_JP = "検索地点が現在地と同一地点です。";
        this.HTML_TXT_0180_ja_JP = "更新したい地域を地図上で選択してください。";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_ja_JP = "進捗アイコンを押すとダウンロードを中止できます。";
        this.HTML_TXT_0182_ja_JP = "ダウンロードに成功しました。";
        this.HTML_TXT_0183_ja_JP = "サーバーからダウンロードした地図データを消去しますか？";
        this.HTML_TXT_0184_ja_JP = "地図データを消去しました。";
        this.HTML_TXT_0185_ja_JP = "地図データを消去できませんでした。";
        this.HTML_TXT_0186_ja_JP = "ダウンロードを中止します。";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_ja_JP = "【重要なお知らせ】<br/>新しいバージョンのアプリがリリースされました。<br/><br/>スマートフォンのSUBARU STARLINKアプリをアップデートして、SUBARU STARLINKを再起動してください。";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_ja_JP = "メモリ割り当てエラー";
        this.HTML_TXT_0190_ja_JP = "転送途中で中断した場合、再接続時に再開します。";
        this.HTML_TXT_0191_ja_JP = "SDL Ver.";
        this.HTML_TXT_0192_ja_JP = "Quick Reference Guide for mobile";
        this.HTML_TXT_0193_ja_JP = "APPS";
        this.HTML_TXT_0194_ja_JP = "　";
        this.HTML_TXT_0195_ja_JP = "“Copyright (C) TomTom International BV 2018”";

        this.HTML_TXT_0205_ja_JP = "地図更新地域選択";

        this.HTML_TXT_0205_A_ja_JP = "表示モード設定";

        this.APP_TXT_0176_ja_JP = "ダウンロードに失敗しました。";

        this.APP_TXT_0358_ja_JP = "ライセンス"; 

        //other (North American Oceans)
        this.LOCATION_999_ja_JP = "その他";

        this.HTML_TXT_9999_ja_JP = "豪州";

        this.Car_TXT_0245_ja_JP = "現在地";

        this.HTML_TXT_0246_ja_JP = "ユーザー・マニュアル";
        this.HTML_TXT_0247_ja_JP = "スマートフォンを使用して地図データを更新する";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // 英語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_en_US = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_en_US = "";
        this.HOME_006_2_en_US = "has expired.<br />You must purchase the function in order to use ";
        this.HOME_006_3_en_US = "";
        this.HOME_006_4_en_US = "";
        this.HOME_006_5_en_US = ".<br />For details, please tap the Display purchase screen button.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_en_US = "Display buy screen";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_en_US = "Later";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_en_US = "Never Ask Again";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_en_US = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_en_US = "DownLoad Fail.Click To Try Again.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_en_US = "Connection history not available";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_en_US = "BACK";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_en_US = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_en_US = "Expires";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_en_US = "Application image";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_en_US = "Application outline";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_en_US = "Application information";
        // 販売元(4Car_TXT_0082)
        this.APP_010_en_US = "Seller";
        // バージョン(4Car_TXT_0084)
        this.APP_011_en_US = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_en_US = "Settings";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_en_US = "Navigation display";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_en_US = "Purchase app item";
        // 非表示(4Car_TXT_0077)
        this.APP_015_en_US = "Hide";
        // 表示(4Car_TXT_0066)
        this.APP_016_en_US = "Display";
        // 無料(4Car_TXT_0177)
        this.APP_017_en_US = "Free";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_en_US = "Purchased";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_en_US = "Stop sale";
        // まで(4Car_TXT_0180)
        this.APP_020_en_US = "until";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_en_US = "Expires within";
        this.APP_021_2_en_US = "days";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_en_US = "Expires";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_en_US = "Select period";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_en_US = "Cancel";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_en_US = "Please choose the period to purchase.<br /><br /><font color='red'>Note<br />The price shown below and the actual settlement price may differ.<br />Be sure to complete the purchase after confirming the settlement price that is indicated when the [Purchase] button is pressed.</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_en_US = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_en_US = "Check car navigation";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_en_US = "Verify the car navigation system which will be using this function. The purchased function will only be available on the selected car navigation system.";
        this.APP_028_2_en_US = "The message \"Service has been registered successfully\" will appear when the purchase is complete. Please do not end the application screen or disconnect the communication (when communicating) with the In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_en_US = "Registered car navigation";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_en_US = "Purchase";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_en_US = "Change to another car navigation.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_en_US = "Connected car navigation (last time connected)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_en_US = "Please push following button to go to the application list screen.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_en_US = "Display the application list ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_en_US = "Purchase failed. Please restart the SUBARU STARLNK app to try again.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_en_US = "The purchase may not have been correctly completed since the process has taken an unusual amount of time. Please wait a while and confirm whether the purchase was completed on the app screen. We apologize for any inconvenience.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_en_US = "on";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_en_US = "off";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_en_US = "An error has occurred. <br />We are sorry for the inconvenience caused. <br />Try again later.";
        // カーナビ未登録時文言
        this.APP_EX01_en_US = "Not registered";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_en_US = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_en_US = "Terms and Conditions of Use";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_en_US = "Settings";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_en_US = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_en_US = "BACK";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_en_US = "Delete the 4Car application data";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_en_US = "The setting data in the 4Car application is deleted.<br />(Available with version 1.0.5 or later)<br />* When link with In-Vehicle-Navigation is unstable, please try deleting the setting data.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_en_US = "Delete all the data?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_en_US = "All the data was deleted.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_en_US = "This function is available with version 1.0.5 or later.";
        //STARLINK エラー対応
        this.APP_Error_en_US = "Download failed.";
        //STARLINK対応
        this.APP_041_en_US = "Update";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_en_US = "BACK";
        //ヘッダー部文言
        this.CONFIG_002_en_US = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_en_US = "The STARLINK application data will be deleted.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_en_US = "* Resolves unstable connection with In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_en_US = "Delete all the data?";
        //confirmダイアログ用文言
        this.CONFIG_006_en_US = "All the data was deleted.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_en_US = "Clear STARLINK application data";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_en_US = "Region selection";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_en_US = "Select your primary region.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_en_US = "* Provides best experience for apps optimized in your region.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_en_US = "Terms and Conditions of Use";
        //利用規約更新日付文言
        this.CONFIG_012_en_US = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_en_US = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_en_US = "日本";
        //アメリカ
        this.LOCATION_002_en_US = "United States";
        //カナダ
        this.LOCATION_003_en_US = "Canada";
        //メキシコ
        this.LOCATION_004_en_US = "México";
        //イギリス
        this.LOCATION_005_en_US = "United Kingdom";
        //フランス
        this.LOCATION_006_en_US = "France";
        //ドイツ
        this.LOCATION_007_en_US = "Deutschland";
        //オランダ
        this.LOCATION_008_en_US = "Nederland";
        //イタリア
        this.LOCATION_009_en_US = "Italia";
        //スペイン
        this.LOCATION_010_en_US = "España";
        //スウェーデン
        this.LOCATION_011_en_US = "Sverige";
        //ポーランド
        this.LOCATION_012_en_US = "Polska";
        //ギリシャ
        this.LOCATION_013_en_US = "Ελλάδα";
        //チェコ
        this.LOCATION_014_en_US = "Česko";
        //ロシア
        this.LOCATION_015_en_US = "Россия";
        //ポルトガル
        this.LOCATION_016_en_US = "Portugal";
        //フィンランド
        this.LOCATION_017_en_US = "Suomi";
        //ハンガリー
        this.LOCATION_018_en_US = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_en_US = "Others";

        this.HTML_TXT_9999_en_US = "Oceania";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_en_US = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_en_US = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_en_US = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_en_US = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_en_US = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_en_US = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_en_US = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_en_US = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_en_US = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_en_US = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_en_US = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_en_US = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_en_US = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_en_US = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_en_US = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_en_US = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_en_US = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_en_US = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_en_US = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_en_US = "Update to the latest version of SUBARU STARLINK app prior to use.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_en_US = "A new In-Vehicle-Navigation has been installed. <br/>Do you want to transfer the existing license to the new one?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_en_US = "Yes";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_en_US = "No";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_en_US = "Remind me later";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_en_US = "[Caution!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_en_US = "From this point forward, your license cannot be transferred back to this device. Do you wish to proceed?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_en_US = "Select the device to transfer the license from";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_en_US = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_en_US = "Connected date: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_en_US = "mm/dd/yyyy";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_en_US = "Cancel";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_en_US = "Transfer the license to the new device from the one that was connected on %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_en_US = "The license transfer was successful.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_en_US = "The license transfer has failed.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_en_US = "The connection to your new In-Car Device (ID: %2) was made on %1.<br/>Do you want to transfer the existing license to the new one?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_en_US = "From this point forward, the license cannot be transferred to this new In-Vehicle-Navigation (ID: %2) that has been connected on %1. Do you wish to proceed?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_en_US = "The following will be transferred. ";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_en_US = "The previous license transfer was successful.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_en_US = "Select navigation function";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_en_US = "Some In-Vehicle-Navigation have multiple navigation functions. Select a navigation to use.<br/><br/>*You may select the navigation used when setting a destination using the In-Vehicle-Navigation application.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_en_US = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_en_US = "Select navigation function";
        //月表示(1月)
        this.SL_MONTH_TXT_01_en_US = "Jan.";
        //月表示(2月)
        this.SL_MONTH_TXT_02_en_US = "Feb.";
        //月表示(3月)
        this.SL_MONTH_TXT_03_en_US = "Mar.";
        //月表示(4月)
        this.SL_MONTH_TXT_04_en_US = "Apr.";
        //月表示(5月)
        this.SL_MONTH_TXT_05_en_US = "May";
        //月表示(6月)
        this.SL_MONTH_TXT_06_en_US = "June";
        //月表示(7月)
        this.SL_MONTH_TXT_07_en_US = "July";
        //月表示(8月)
        this.SL_MONTH_TXT_08_en_US = "Aug.";
        //月表示(9月)
        this.SL_MONTH_TXT_09_en_US = "Sep.";
        //月表示(10月)
        this.SL_MONTH_TXT_10_en_US = "Oct.";
        //月表示(11月)
        this.SL_MONTH_TXT_11_en_US = "Nov.";
        //月表示(12月)
        this.SL_MONTH_TXT_12_en_US = "Dec.";
        //日付表示形式
        this.SL_DATE_FMT_01_en_US = "MMM d.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_en_US = "Size: ";
        this.TXT_YELP_0029_en_US = "Error Occurred.Please try again later.";
        this.SL_TXT_0155_en_US = "Ver. ";
        this.SL_TXT_0189_en_US = "Updated *";
        this.SL_TXT_0191_en_US = "Expiration Date: ";
        this.SL_TXT_0192_en_US = "Map Update Settings";
        this.SL_TXT_0193_en_US = "The In-Vehicle-Navigation map data can be temporarily saved to your smartphone from the map distribution server. The next time you connect to the In-Vehicle-Navigation, you can update the map.";
        this.SL_TXT_0196_en_US = "Update settings";
        this.SL_TXT_0197_en_US = "Check auto update";
        this.SL_TXT_0198_en_US = "Cellular";
        this.SL_TXT_0199_en_US = "Update info.";
        this.SL_TXT_0200_en_US = "Download all";
        this.SL_TXT_0201_en_US = "Downloaded in mobile";
        this.SL_TXT_0202_en_US = "Update available";
        this.SL_TXT_0203_en_US = "Updated";
        this.SL_TXT_0204_en_US = "Map: ";
        this.SL_TXT_0204_A_en_US = "Europe";
        this.SL_TXT_0205_en_US = "Version: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_en_USを利用　宣言のみ
        this.SL_TXT_0206_en_US = "Size: *KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_en_US = "There is not enough space available on the smartphone.";
        this.SL_TXT_0208_en_US = "Configure the region settings with the In-Vehicle-Navigation.";
        this.SL_TXT_0209_en_US = "Your MapCare subscription has expired. Please visit www.subaru-maps.com to update your subscription.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_en_US = "Map Update larger than 30 MB.\n\nPlease connect to Wi-Fi to download.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_en_US = "Update map by connecting In-Vehicle-Navigation to smartphone. After updating In-Vehicle-Navigation, map data will automatically be deleted from smartphone.";
        this.SL_TXT_0212_en_US = "Cellular Data ON.\n\nYou can download map data through your cellular data connection. \nHowever, data is limited by 30MB per region.\n*Data charges may apply.\n\nPlease turn OFF.\nif you only want to download through WiFi.";
        this.SL_TXT_0213_en_US = "Auto update ON.\n\nAutomatically download\nmap data and save it\non your smartphone\n*Data charges may apply.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_en_US = "Connection to In-Vehicle-Navigation was disconnected. Try again after confirming connection to In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_en_US = "Insufficient In-Vehicle-Navigation storage available. Try again after confirming In-Vehicle-Navigation settings.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_en_US = "Error occurred during data transfer.Please try again later.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_en_US = "Error occurred while downloading map data from the server.Please try again later.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_en_US = "Insufficient smartphone storage available. Try again after deleting data from your smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_en_US = "Cellular Data OFF.\n\nPlease connect to Wi-Fi to download map update.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_en_US = "Communication with server was disconnected. Try again after communications has been reestablished.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_en_USを利用　宣言のみ
        this.SL_TXT_0221_en_US = "Size: *MB";
        // SL_TXT_0222
        this.SL_TXT_0222_en_US = "If the following situation occurs while transferring map data, transfer will resume after returning.<br />　・In-Vehicle Machine Power Supply: OFF<br />　・Smartphone Power Supply: OFF<br />　・Disconnection of In-Vehicle Equipment and Smartphone<br />　・End of Smartphone Application";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_en_US = "OK";
        this.HTML_TXT_0068_en_US = "Make sure smartphone does not go into \"sleep mode\" while downloading map data.\nIf smartphone goes into sleep mode, start the SUBARU STARLINK app again.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_en_US = "The map update cannot start. Please check the state of the In-Vehicle-Navigation.";
        this.HTML_TXT_0165_en_US = "Map update setting function";
        this.HTML_TXT_0169_en_US = "Check for Updates";
        this.HTML_TXT_0166_en_US = "1. Download the map data from the server to the smartphone.<br><br>2. When connecting the smartphone to the In-Vehicle-Navigation, the map data is transferred to the In-Vehicle-Navigation. The map data will be deleted from the smartphone after transfer.";
        this.HTML_TXT_0167_en_US = "* When the smartphone is connected to multiple In-Vehicle-Navigation systems, the map update information displays the data of the most recently connected In-Vehicle-Navigation.";
        this.HTML_TXT_0168_en_US = "Please enter city name.";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_en_US = "You can cancel downloading by tapping progress mark.";
        this.HTML_TXT_0171_en_US = "Start Update";
        this.HTML_TXT_0172_en_US = "The capacity of the smartphone is insufficient. Delete some data on the smartphone and try again.";
        this.HTML_TXT_0173_en_US = "Please tap *, if you cancel downloading map data from server.";
        this.HTML_TXT_0174_en_US = "Press the Cancel button to cancel the search.";
        this.HTML_TXT_0175_en_US = "The region from the current location to the specified destination is selected. ";
        this.HTML_TXT_0176_en_US = "Map data is being transferred to In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_en_US = "* Map data install completed";
        this.HTML_TXT_0178_en_US = "There are no search results. Please try again.";
        this.HTML_TXT_0179_en_US = "The search point is the same as the current location.";
        this.HTML_TXT_0180_en_US = "Please select the area you want to update on the map.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_en_US = "You can cancel downloading by tapping progress mark.";
        this.HTML_TXT_0182_en_US = "Download succeeded.";
        this.HTML_TXT_0183_en_US = "Would you like to delete the map data downloaded from the server?";
        this.HTML_TXT_0184_en_US = "Map data has been deleted.";
        this.HTML_TXT_0185_en_US = "Could not delete map data.";
        this.HTML_TXT_0186_en_US = "Download will be cancelled.";
        // HTML_TXT_0187 定義値のみ宣言
        this.HTML_TXT_0187_en_US = "From ChargePoint Network";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_en_US = "[Important Notice]<br/>SUBARU STARLINK cannot be launched as this version is no longer supported.<br/><br/>Please install the latest version of SUBARU STARLINK on your smartphone and try launching again.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_en_US = "Memory Allocate ErrorError";
        this.HTML_TXT_0190_en_US = "If data transfer is interrupted,it will automatically resume at reconnection.";
        this.HTML_TXT_0191_en_US = "SDL Ver.";
        this.HTML_TXT_0193_en_US = "APPS";
        this.HTML_TXT_0194_en_US = "　";
        this.HTML_TXT_0195_en_US = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_en_US = "Map update region selection";

        this.HTML_TXT_0205_A_en_US = "Display mode settings";

        this.APP_TXT_0176_en_US = "Download Failed.";

        this.APP_TXT_0358_en_US = "License"; // デフォルト値。TODO: ID、文言仮置き

        this.Car_TXT_0245_en_US = "Current Location";

        this.HTML_TXT_0246_en_US = "User Manual";
        this.HTML_TXT_0247_en_US = "Updating the Map data using a smartphone";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // フランス語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_fr_FR = "ACCUEIL";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_fr_FR = "";
        this.HOME_006_2_fr_FR = " a expiré.<br />Vous devez acheter la fonction afin d’utiliser ";
        this.HOME_006_3_fr_FR = "";
        this.HOME_006_4_fr_FR = "";
        this.HOME_006_5_fr_FR = ".<br />Pour plus de détails, veuillez taper sur la touche « Afficher l’écran d’achat ».";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_fr_FR = "Afficher l’écran d’achat";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_fr_FR = "Plus tard";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_fr_FR = "Ne plus afficher";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_fr_FR = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_fr_FR = "Échec du téléchargement. Cliquez pour réessayer.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_fr_FR = "Historique des connexions indisponible";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_fr_FR = "RETOUR";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_fr_FR = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_fr_FR = "Expire";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_fr_FR = "Image de l’application";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_fr_FR = "Grandes lignes de l’application";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_fr_FR = "Informations de l’application";
        // 販売元(4Car_TXT_0082)
        this.APP_010_fr_FR = "Vendeur";
        // バージョン(4Car_TXT_0084)
        this.APP_011_fr_FR = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_fr_FR = "Réglages";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_fr_FR = "Écran de navigation";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_fr_FR = "Acheter un élément d’application";
        // 非表示(4Car_TXT_0077)
        this.APP_015_fr_FR = "Masquer";
        // 表示(4Car_TXT_0066)
        this.APP_016_fr_FR = "Affichage";
        // 無料(4Car_TXT_0177)
        this.APP_017_fr_FR = "Gratuit";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_fr_FR = "Acheté";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_fr_FR = "Arrêter la vente";
        // まで(4Car_TXT_0180)
        this.APP_020_fr_FR = "Jusqu’au";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_fr_FR = "Expire dans";
        this.APP_021_2_fr_FR = "jours";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_fr_FR = "Expire";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_fr_FR = "Sélectionner une période";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_fr_FR = "Annuler";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_fr_FR = "Veuillez choisir la période de l’achat.<br /><br /><font color='red'>Note<br />Le prix indiqué ci-dessous et le prix de règlement réel peut différer.<br />Assurez-vous de compléter l'achat après avoir confirmé le prix de règlement indiqué après avoir pressé le bouton [Acheter].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_fr_FR = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_fr_FR = "Vérifier le système de navigation automobile";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_fr_FR = "Vérifiez le système de navigation automobile qui utilisera cette fonction. La fonction achetée ne sera disponible que sur le système de navigation automobile sélectionné.";
        this.APP_028_2_fr_FR = "Le message « Le service a bien été enregistré » apparaîtra une fois l’achat terminé. Ne quittez pas l’écran de l’application et ne coupez pas la communication (pendant la communication) avec In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_fr_FR = "Système de navigation automobile enregistré";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_fr_FR = "Acheter";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_fr_FR = "Changer de système de navigation automobile.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_fr_FR = "Système de navigation automobile connecté (à la dernière connexion)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_fr_FR = "Veuillez appuyer sur la touche ci-dessous pour accéder à l’écran de la liste des applications.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_fr_FR = "Afficher la liste des applications ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_fr_FR = "Veuillez nous excuser, l’achat a échoué. Veuillez contacter votre administrateur Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_fr_FR = "Il se peut que l’achat n’ait pas été réalisé correctement, car la durée du processus n’est pas la même que d’habitude. Veuillez patienter un moment avant de vérifier si l’achat a été réalisé sur l’écran de l’application. Veuillez nous excuser pour la gêne occasionnée.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_fr_FR = "activé";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_fr_FR = "désactivé";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_fr_FR = "Une erreur est survenue.<br />Nous sommes désolés pour la gêne occasionnée.<br />Réessayez ultérieurement.";
        // カーナビ未登録時文言
        this.APP_EX01_fr_FR = "Non enregistré";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_fr_FR = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_fr_FR = "Modalités d’utilisation";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_fr_FR = "Réglages";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_fr_FR = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_fr_FR = "RETOUR";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_fr_FR = "Supprimer les données de l’application 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_fr_FR = "Les données de réglage de l’application 4Car sont supprimées.<br />(Disponible dans la version 1.0.5 ou une version ultérieure)<br />* Lorsque le lien avec le dispositif embarqué est instable, essayez de supprimer les données de réglage.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_fr_FR = "Supprimer toutes les données ?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_fr_FR = "Toutes les données sont supprimées.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_fr_FR = "Cette fonction est disponible dans la version 1.0.5 ou une version ultérieure.";
        //STARLINK エラー対応
        this.APP_Error_fr_FR = "Échec du téléchargement.";
        //STARLINK対応
        this.APP_041_fr_FR = "Mise à jour";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_fr_FR = "RETOUR";
        //ヘッダー部文言
        this.CONFIG_002_fr_FR = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_fr_FR = "Les données de l'application STARLINK seront supprimées.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_fr_FR = "* Cela résout la connexion instable à l'In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_fr_FR = "Supprimer toutes les données ?";
        //confirmダイアログ用文言
        this.CONFIG_006_fr_FR = "Toutes les données sont supprimées.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_fr_FR = "Effacer les données de l'application STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_fr_FR = "Sélection de région";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_fr_FR = "Sélectionnez votre région principale.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_fr_FR = "* Cela permet de vous fournir la meilleure expérience pour les applications optimisées dans votre région.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_fr_FR = "Modalités d'utilisation";
        //利用規約更新日付文言
        this.CONFIG_012_fr_FR = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_fr_FR = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_fr_FR = "日本";
        //アメリカ
        this.LOCATION_002_fr_FR = "United States";
        //カナダ
        this.LOCATION_003_fr_FR = "Canada";
        //メキシコ
        this.LOCATION_004_fr_FR = "México";
        //イギリス
        this.LOCATION_005_fr_FR = "United Kingdom";
        //フランス
        this.LOCATION_006_fr_FR = "France";
        //ドイツ
        this.LOCATION_007_fr_FR = "Deutschland";
        //オランダ
        this.LOCATION_008_fr_FR = "Nederland";
        //イタリア
        this.LOCATION_009_fr_FR = "Italia";
        //スペイン
        this.LOCATION_010_fr_FR = "España";
        //スウェーデン
        this.LOCATION_011_fr_FR = "Sverige";
        //ポーランド
        this.LOCATION_012_fr_FR = "Polska";
        //ギリシャ
        this.LOCATION_013_fr_FR = "Ελλάδα";
        //チェコ
        this.LOCATION_014_fr_FR = "Česko";
        //ロシア
        this.LOCATION_015_fr_FR = "Россия";
        //ポルトガル
        this.LOCATION_016_fr_FR = "Portugal";
        //フィンランド
        this.LOCATION_017_fr_FR = "Suomi";
        //ハンガリー
        this.LOCATION_018_fr_FR = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_fr_FR = "Autres";

        this.HTML_TXT_9999_fr_FR = "Océanie";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_fr_FR = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_fr_FR = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_fr_FR = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_fr_FR = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_fr_FR = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_fr_FR = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_fr_FR = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_fr_FR = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_fr_FR = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_fr_FR = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_fr_FR = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_fr_FR = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_fr_FR = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_fr_FR = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_fr_FR = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_fr_FR = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_fr_FR = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_fr_FR = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_fr_FR = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_fr_FR = "Mettez à jour vers la dernière version de l'application SUBARU STARLINK avant l'utilisation.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_fr_FR = "Un nouvel In-Vehicle-Navigation a été installé.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil ?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_fr_FR = "Oui";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_fr_FR = "Non";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_fr_FR = "Me le rappeler plus tard";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_fr_FR = "[Attention !]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_fr_FR = "Vous ne pourrez plus transférer votre licence de retour vers cet appareil par la suite. Souhaitez-vous poursuivre ?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_fr_FR = "Sélectionnez l'appareil à partir duquel le transfert sera effectué";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_fr_FR = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_fr_FR = "Date de connexion: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_fr_FR = "jj/mm/aaaa";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_fr_FR = "Annuler";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_fr_FR = "Transférer la licence vers le nouvel appareil à partir de celui qui était connecté le %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_fr_FR = "Le transfert de licence a réussi.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_fr_FR = "Le transfert de licence a échoué.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_fr_FR = "La connexion vers votre nouvel In-Car Device (ID: %2) a été faite le %1.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil ?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_fr_FR = "Par la suite, vous ne pourrez plus transférer la licence vers ce nouvel In-Car Device (ID: %2) qui a été connecté le %1. Souhaitez-vous poursuivre ?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_fr_FR = "Ce qui suit sera transféré.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_fr_FR = "Le précédent transfert de licence a réussi.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_fr_FR = "Sélectionner la fonction de navigation";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_fr_FR = "Certains In-Vehicle-Navigation disposent de multiples fonctions de navigation. Sélectionnez la navigation que vous souhaitez utiliser.<br/><br/>*Vous pouvez sélectionner la navigation utilisée lors du réglage d'une destination à l'aide de l'application de l'In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_fr_FR = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_fr_FR = "Sélectionner la fonction de navigation";
        //月表示(1月)
        this.SL_MONTH_TXT_01_fr_FR = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_fr_FR = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_fr_FR = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_fr_FR = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_fr_FR = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_fr_FR = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_fr_FR = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_fr_FR = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_fr_FR = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_fr_FR = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_fr_FR = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_fr_FR = "";
        //日付表示形式
        this.SL_DATE_FMT_01_fr_FR = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_fr_FR = "Taille : ";
        this.TXT_YELP_0029_fr_FR = "Une erreur est survenue.Veuillez réessayer plus tard.";
        this.SL_TXT_0155_fr_FR = "Ver. ";
        this.SL_TXT_0189_fr_FR = "Mis à jour le *";
        this.SL_TXT_0191_fr_FR = "Date d'expiration : ";
        this.SL_TXT_0192_fr_FR = "Réglages de mise à jour des cartes";
        this.SL_TXT_0193_fr_FR = "Les données de carte de l'In-Vehicle-Navigation peuvent être sauvegardées de façon temporaire sur votre smartphone à partir du serveur de distribution de cartes. La prochaine fois que vous vous connectez à l'In-Vehicle-Navigation, vous pourrez mettre à jour la carte.";
        this.SL_TXT_0196_fr_FR = "Réglages mise à jour";
        this.SL_TXT_0197_fr_FR = "Vérification de la mise à jour automatique";
        this.SL_TXT_0198_fr_FR = "Mobile";
        this.SL_TXT_0199_fr_FR = "Info. de mise à jour";
        this.SL_TXT_0200_fr_FR = "Tout télécharger";
        this.SL_TXT_0201_fr_FR = "Téléchargé sur le mobile";
        this.SL_TXT_0202_fr_FR = "Mise à jour disponible";
        this.SL_TXT_0203_fr_FR = "Mis à jour";
        this.SL_TXT_0204_fr_FR = "Carte : ";
        this.SL_TXT_0204_A_fr_FR = "Europe";
        this.SL_TXT_0205_fr_FR = "Version : ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_fr_FRを利用　宣言のみ
        this.SL_TXT_0206_fr_FR = "Taille :　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_fr_FR = "Espace insuffisant sur le smartphone.";
        this.SL_TXT_0208_fr_FR = "Configurez les réglages régionaux à l'aide de l'In-Vehicle-Navigation.";
        this.SL_TXT_0209_fr_FR = "Votre abonnement MapCare a expiré. Pour mettre à jour votre abonnement, rendez-vous sur le site www.subaru-maps.com.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_fr_FR = "Veuillez télécharger via Wi-Fi. \n\nLe téléchargement de données est limité à 30 Mo par région par le biais des données mobiles.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_fr_FR = "Mettez à jour la carte en connectant l'In-Vehicle-Navigation au smartphone. Après la mise à jour de l'In-Vehicle-Navigation, les données de carte seront automatiquement supprimées du smartphone.";
        this.SL_TXT_0212_fr_FR = "Données mobiles activées.\n\nVous pouvez télécharger les données cartographiques par le biais de votre connexion de données mobiles.\nLes données sont limitées à 30 Mo par région.\n* Des frais de transmission de données peuvent s'appliquer\n\nVeuillez désactiver cette fonction,\nsi vous voulez télécharger les données via Wi-Fi.";
        this.SL_TXT_0213_fr_FR = "Mise à jour automatique activée.\n\nTéléchargez automatiquement\nles données cartographiques et enregistrez-les sur votre smartphone.\n* Des frais de transmission de données peuvent s'appliquer.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_fr_FR = "La connexion à l'In-Vehicle-Navigation a été interrompue. Réessayez après avoir confirmé la connexion à l'In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_fr_FR = "L'espace de stockage disponible sur l'In-Vehicle-Navigation est insuffisant. Réessayez après avoir confirmé les réglages de l'In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_fr_FR = "Une erreur est survenue pendant le transfert de données. Veuillez réessayer plus tard.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_fr_FR = "Une erreur est survenue lors du téléchargement des données de carte du serveur. Veuillez réessayer plus tard.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_fr_FR = "L'espace de stockage disponible sur le smartphone est insuffisant. Réessayez après avoir supprimé des données de votre smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_fr_FR = "Données mobiles désactivées.\n\nVeuillez télécharger par le biais du Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_fr_FR = "La communication avec le serveur a été interrompue. Réessayez après avoir rétabli la communication.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_fr_FRを利用　宣言のみ
        this.SL_TXT_0221_fr_FR = "Taille : *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_fr_FR = "OK";
        this.HTML_TXT_0068_fr_FR = "Assurez-vous que le smartphone n'est mis en \"mode veille\" lors du téléchargement des données cartographiques.\nSi le smartphone est mis en veille, lancez à nouveau l'application SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_fr_FR = "La mise à jour de la carte ne peut pas commencer. Veuillez vérifier le navigateur du véhicule.";
        this.HTML_TXT_0165_fr_FR = "Fonction de mise à jour de la carte";
        this.HTML_TXT_0166_fr_FR = "1. Téléchargez les données cartographiques du serveur vers le smartphone.<br><br>2. Lors de la connexion du smartphone à l'In-Vehicle-Navigation, les données cartographiques seront transférées sur le In-Vehicle-Navigation. Les données cartographiques seront supprimées du smartphone après le transfert.";
        this.HTML_TXT_0167_fr_FR = "* Lorsque le smartphone est connecté à plusieurs In-Vehicle-Navigations, l'information de mise à jour de la carte affiche les données du dernier In-Vehicle-Navigation connecté.";
        this.HTML_TXT_0168_fr_FR = "Sélection de région automatique";
        this.HTML_TXT_0169_fr_FR = "Vérifier les mises à jour";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_fr_FR = "Appuyez sur le bouton Annuler pour arrêter l'accès au serveur.";
        this.HTML_TXT_0171_fr_FR = "Démarrer la mise à jour";
        this.HTML_TXT_0172_fr_FR = "La capacité du smartphone est insuffisante. Supprimez des données sur le smartphone et réessayez.";
        this.HTML_TXT_0173_fr_FR = "Veuillez appuyer sur *, si vous souhaitez annuler le téléchargement des données cartographiques à partir du serveur.";
        this.HTML_TXT_0174_fr_FR = "Appuyez sur le bouton Annuler pour annuler la recherche.";
        this.HTML_TXT_0175_fr_FR = "La région de l'emplacement actuel à la destination spécifiée a été sélectionnée.";
        this.HTML_TXT_0176_fr_FR = "Transfert en cours des données cartographiques vers l'In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_fr_FR = "Installation des données cartographiques de * terminée";
        this.HTML_TXT_0178_fr_FR = "Il n'y a pas de résultats de recherche. Veuillez réessayer à nouveau.";
        this.HTML_TXT_0179_fr_FR = "Le point de recherche est le même que l'emplacement actuel.";
        this.HTML_TXT_0180_fr_FR = "Veuillez sélectionner la zone que vous voulez mettre à jour sur la carte.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_fr_FR = "Appuyez sur le bouton Annuler pour arrêter l'accès au serveur.";
        this.HTML_TXT_0182_fr_FR = "Téléchargement réussi.";
        this.HTML_TXT_0183_fr_FR = "Voulez-vous supprimer les données cartographiques téléchargées depuis le serveur ?";
        this.HTML_TXT_0184_fr_FR = "Les données cartographiques ont été supprimées.";
        this.HTML_TXT_0185_fr_FR = "Impossible de supprimer les données cartographiques.";
        this.HTML_TXT_0186_fr_FR = "Le téléchargement sera annulé.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_fr_FR = "[Avis important]<br/>SUBARU STARLINK ne peut pas être lancé, car cette version n'est plus prise en charge.<br/><br/>Veuillez installer la dernière version de SUBARU STARLINK sur votre smartphone et retentez le lancement.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_fr_FR = "Erreur d'allocation de mémoire";
        this.HTML_TXT_0190_fr_FR = "Si le transfert de données est interrompu, il sera automatiquement repris lors de la reconnexion.";
        this.HTML_TXT_0193_fr_FR = "APPS";
        this.HTML_TXT_0195_fr_FR = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_fr_FR = "Sélection de la région de mise à jour de la carte";

        this.HTML_TXT_0205_A_fr_FR = "Réglage du mode d'affichage";

        this.APP_TXT_0176_fr_FR = "Échec téléch.";

        this.Car_TXT_0245_fr_FR = "Position actuelle";

        this.HTML_TXT_0246_fr_FR = "Manuel d’utilisation";
        this.HTML_TXT_0247_fr_FR = "Mise à jour des données cartographiques à l’aide d’un smartphone";

        this.APP_TXT_0358_fr_FR = "Licence"; 
        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // スペイン語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_es_ES = "INICIO";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_es_ES = "";
        this.HOME_006_2_es_ES = " ha vencido.<br />Debe adquirir la función para utilizar ";
        this.HOME_006_3_es_ES = "";
        this.HOME_006_4_es_ES = "";
        this.HOME_006_5_es_ES = ".<br />Para obtener más información, pulse el botón Mostrar pantalla de adquisición.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_es_ES = "Mostrar pantalla de compra";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_es_ES = "Más tarde";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_es_ES = "No mostrar de nuevo";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_es_ES = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_es_ES = "Descarga fallida. Haga clic en Intentar de nuevo.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_es_ES = "Historial de conexiones no disponible";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_es_ES = "ATRÁS";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_es_ES = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_es_ES = "Vence";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_es_ES = "Imagen de la aplicación";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_es_ES = "Descripción de la aplicación";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_es_ES = "Información de la aplicación";
        // 販売元(4Car_TXT_0082)
        this.APP_010_es_ES = "Vendedor";
        // バージョン(4Car_TXT_0084)
        this.APP_011_es_ES = "Versión";
        // 設定(4Car_TXT_0085)
        this.APP_012_es_ES = "Configuración";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_es_ES = "Pantalla de navegación";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_es_ES = "Adquirir elemento de aplicación";
        // 非表示(4Car_TXT_0077)
        this.APP_015_es_ES = "Ocultar";
        // 表示(4Car_TXT_0066)
        this.APP_016_es_ES = "Mostrar";
        // 無料(4Car_TXT_0177)
        this.APP_017_es_ES = "Gratis";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_es_ES = "Adquirido";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_es_ES = "Detener venta";
        // まで(4Car_TXT_0180)
        this.APP_020_es_ES = "Para";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_es_ES = "Caduca en";
        this.APP_021_2_es_ES = "días";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_es_ES = "Vence";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_es_ES = "Seleccionar período";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_es_ES = "Cancelar";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_es_ES = "Seleccione el período de adquisición.<br /><br /><font color='red'>Nota<br />El precio mostrado a continuación y el precio de liquidación real puede diferir.<br />Asegúrese de completar la compra después de confirmar el precio de liquidación que se indica al pulsar el botón [Adquirir].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_es_ES = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_es_ES = "Comprobar navegación del coche";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_es_ES = "Verifique el sistema de navegación para vehículos que utilizará esta función. La función adquirida solo estará disponible en el sistema de navegación para vehículos seleccionado.";
        this.APP_028_2_es_ES = "Aparecerá el mensaje \"El servicio se ha registrado correctamente\" una vez finalizada la compra. No cierre la pantalla de la aplicación ni desconecte la comunicación (si hay una comunicación en curso) con In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_es_ES = "Navegación del coche registrada";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_es_ES = "Adquirir";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_es_ES = "Cambiar a otra navegación del coche.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_es_ES = "Navegación del coche conectada (última vez conectada)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_es_ES = "Pulse el siguiente botón para ir a la pantalla de lista de aplicaciones.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_es_ES = "Mostrar la lista de aplicaciones";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_es_ES = "Pedimos disculpas y le avisamos que se ha producido un error en la compra. Póngase en contacto con su administrador de Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_es_ES = "No se ha podido completar correctamente la compra ya que el proceso ha durado más tiempo de lo normal. Espere unos minutos y confirme si la compra se ha realizado en la pantalla de la aplicación. Pedimos disculpas por los inconvenientes.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_es_ES = "encendido";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_es_ES = "apagado";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_es_ES = "Se ha producido un error.<br />Lamentamos las molestias.<br />Inténtelo de nuevo más tarde.";
        // カーナビ未登録時文言
        this.APP_EX01_es_ES = "No registrado";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_es_ES = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_es_ES = "Términos y condiciones de uso";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_es_ES = "Configuración";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_es_ES = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_es_ES = "ATRÁS";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_es_ES = "Eliminar los datos de la aplicación 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_es_ES = "Se eliminan los datos de configuración de la aplicación 4Car.<br />(Disponible con la versión 1.0.5 o posterior)<br />* Cuando el enlace con el dispositivo In-Car no sea estable, pruebe a eliminar los datos de configuración.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_es_ES = "¿Eliminar todos los datos?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_es_ES = "Se han eliminado todos los datos.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_es_ES = "Esta función está disponible con la versión 1.0.5 o posterior.";
        //STARLINK エラー対応
        this.APP_Error_es_ES = "La descarga falló.";
        //STARLINK対応
        this.APP_041_es_ES = "Actualización";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_es_ES = "ATRÁS";
        //ヘッダー部文言
        this.CONFIG_002_es_ES = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_es_ES = "Los datos de la aplicación STARLINK se eliminarán.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_es_ES = "* Esto resuelve la conexión instable al In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_es_ES = "¿Eliminar todos los datos?";
        //confirmダイアログ用文言
        this.CONFIG_006_es_ES = "Se han eliminado todos los datos.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_es_ES = "Borrar los datos de la aplicación STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_es_ES = "Selección de región";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_es_ES = "Seleccione su región primaria.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_es_ES = "* Esto ofrece la mejor experiencia para las aplicaciones optimizadas en su región.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_es_ES = "Términos y condiciones de uso";
        //利用規約更新日付文言
        this.CONFIG_012_es_ES = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_es_ES = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_es_ES = "日本";
        //アメリカ
        this.LOCATION_002_es_ES = "United States";
        //カナダ
        this.LOCATION_003_es_ES = "Canada";
        //メキシコ
        this.LOCATION_004_es_ES = "México";
        //イギリス
        this.LOCATION_005_es_ES = "United Kingdom";
        //フランス
        this.LOCATION_006_es_ES = "France";
        //ドイツ
        this.LOCATION_007_es_ES = "Deutschland";
        //オランダ
        this.LOCATION_008_es_ES = "Nederland";
        //イタリア
        this.LOCATION_009_es_ES = "Italia";
        //スペイン
        this.LOCATION_010_es_ES = "España";
        //スウェーデン
        this.LOCATION_011_es_ES = "Sverige";
        //ポーランド
        this.LOCATION_012_es_ES = "Polska";
        //ギリシャ
        this.LOCATION_013_es_ES = "Ελλάδα";
        //チェコ
        this.LOCATION_014_es_ES = "Česko";
        //ロシア
        this.LOCATION_015_es_ES = "Россия";
        //ポルトガル
        this.LOCATION_016_es_ES = "Portugal";
        //フィンランド
        this.LOCATION_017_es_ES = "Suomi";
        //ハンガリー
        this.LOCATION_018_es_ES = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_es_ES = "Otros";

        this.HTML_TXT_9999_es_ES = "Oceanía";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_es_ES = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_es_ES = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_es_ES = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_es_ES = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_es_ES = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_es_ES = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_es_ES = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_es_ES = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_es_ES = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_es_ES = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_es_ES = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_es_ES = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_es_ES = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_es_ES = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_es_ES = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_es_ES = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_es_ES = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_es_ES = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_es_ES = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_es_ES = "Actualice a la versión más reciente de la aplicación SUBARU STARLINK antes de utilizarla.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_es_ES = "Un nuevo In-Vehicle-Navigation ha sido instalado.<br/>¿Desea transferir la licencia existente al nuevo?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_es_ES = "Sí";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_es_ES = "No";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_es_ES = "Recordármelo más tarde";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_es_ES = "[¡Precaución!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_es_ES = "En adelante su licencia no podrá ser transferida de nuevo a este dispositivo. ¿Desea seguir?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_es_ES = "Seleccione el dispositivo del que transferirá la licencia";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_es_ES = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_es_ES = "Fecha de conexión: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_es_ES = "dd/mm/aaaa";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_es_ES = "Cancelar";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_es_ES = "Transferir la licencia al nuevo dispositivo del que fue conectado el %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_es_ES = "La transferencia de licencia se realizó correctamente.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_es_ES = "La transferencia de licencia ha fallado.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_es_ES = "La conexión con su nuevo In-Vehicle-Navigation (ID: %2) fue establecida el %1.<br/>¿Desea transferir la licencia existente al nuevo?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_es_ES = "En adelante la licencia no podrá ser transferida a este nuevo In-Vehicle-Navigation (ID: %2) que ha sido conectado el %1. ¿Desea seguir?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_es_ES = "Lo siguiente será transferido.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_es_ES = "La transferencia de licencia anterior se realizó correctamente.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_es_ES = "Seleccionar la función de navegación";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_es_ES = "Algunos In-Vehicle-Navigation disponen de múltiples funciones de navegación. Seleccione la navegación que desea utilizar.<br/><br/>*Puede seleccionar la navegación utilizada al establecer un destino mediante la aplicación del In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_es_ES = "";
        // HTML_TXT_0029 : デリゲーション画面説明(XXX)
        this.DELEGATION_004_es_ES = "Seleccionar la función de navegación";
        //月表示(1月)
        this.SL_MONTH_TXT_01_es_ES = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_es_ES = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_es_ES = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_es_ES = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_es_ES = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_es_ES = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_es_ES = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_es_ES = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_es_ES = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_es_ES = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_es_ES = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_es_ES = "";
        //日付表示形式
        this.SL_DATE_FMT_01_es_ES = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_es_ES = "Tamaño: ";
        this.TXT_YELP_0029_es_ES = "Ha ocurrido un error.Vuelva a intentarlo más tarde.";
        this.SL_TXT_0155_es_ES = "Ver. ";
        this.SL_TXT_0189_es_ES = "Actualizado el *";
        this.SL_TXT_0191_es_ES = "Fecha de expiración: ";
        this.SL_TXT_0192_es_ES = "Ajustes de actualización de mapa";
        this.SL_TXT_0193_es_ES = "Los datos de mapa del In-Vehicle-Navigation pueden guardarse de forma temporal en su smartphone desde el servidor de distribución de mapas. La próxima vez que se conectará al In-Vehicle-Navigation, podrá actualizar el mapa.";
        this.SL_TXT_0196_es_ES = "Ajustes actualización";
        this.SL_TXT_0197_es_ES = "Verificación de la actualización automática";
        this.SL_TXT_0198_es_ES = "Móvil";
        this.SL_TXT_0199_es_ES = "Info. actualización";
        this.SL_TXT_0200_es_ES = "Descargar todo";
        this.SL_TXT_0201_es_ES = "Descargado en el móvil";
        this.SL_TXT_0202_es_ES = "Actualización disponible";
        this.SL_TXT_0203_es_ES = "Actualizado";
        this.SL_TXT_0204_es_ES = "Mapa: ";
        this.SL_TXT_0204_A_es_ES = "Europa";
        this.SL_TXT_0205_es_ES = "Versión: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_es_ESを利用　宣言のみ
        this.SL_TXT_0206_es_ES = "Tamaño:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_es_ES = "No hay suficiente espacio en el smartphone.";
        this.SL_TXT_0208_es_ES = "Configure los ajustes regionales mediante el In-Vehicle-Navigation.";
        this.SL_TXT_0209_es_ES = "Su suscripción a MapCare ha caducado. Visite www.subaru-maps.com para actualizar su suscripción.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_es_ES = "Descargue a través de Wi-Fi.\n\nLos datos de descarga están limitados a 30 MB por región a través de datos móviles.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_es_ES = "Actualice el mapa conectando el In-Vehicle-Navigation al smartphone. Después de actualizar el In-Vehicle-Navigation, los datos de mapa se eliminarán automáticamente del smartphone.";
        this.SL_TXT_0212_es_ES = "Datos móviles activados.\n\nPuede descargar datos de mapas a través de su conexión de datos móviles.\nSin embargo, los datos están limitados a 30 MB por región.\n* Se pueden aplicar cargos por datos.\n\nDesactive esta opción,\nsi sólo desea descargar a través de Wi-Fi.";
        this.SL_TXT_0213_es_ES = "Actualización automática ACTIVADA.\n\nDescargue automáticamente\nlos datos del mapa y guárdelos\nen su amartphone.\n* Se pueden aplicar cargos por datos.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_es_ES = "Se interrumpió la conexión con el In-Vehicle-Navigation. Vuelva a intentarlo después de confirmar la conexión con el In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_es_ES = "El espacio de almacenamiento disponible en el In-Vehicle-Navigation es insuficiente. Vuelva a intentarlo después de confirmar los ajustes del In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_es_ES = "Ha ocurrido un error durante la transferencia de datos. Vuelva a intentarlo más tarde.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_es_ES = "Ha ocurrido un error mientras se descargaban los datos de mapa del servidor. Vuelva a intentarlo más tarde.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_es_ES = "El espacio de almacenamiento disponible en el smartphone es insuficiente. Vuelva a intentarlo después de eliminar datos de su smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_es_ES = "Datos móviles desactivados.\n\nPor favor, descargue a través de Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_es_ES = "Se interrumpió la comunicación con el servidor. Inténtelo de nuevo después de restablecer la comunicación.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_es_ESを利用　宣言のみ
        this.SL_TXT_0221_es_ES = "Tamaño: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_es_ES = "OK";
        this.HTML_TXT_0068_es_ES = "Asegúrese de que el smartphone no entre en \"modo de suspensión\" al descargar datos de mapas.\nSi el smartphone entra en modo de suspensión, vuelva a iniciar la aplicación SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_es_ES = "No se puede iniciar la actualización del mapa. Favor de verificar el navegador del vehículo.";
        this.HTML_TXT_0165_es_ES = "Función de configuración de actualización del mapa";
        this.HTML_TXT_0166_es_ES = "1. Descargue los datos del mapa del servidor al smartphone.<br><br>2. Al conectar el smartphone al In-Vehicle-Navigation, los datos del mapa se transferirán al In-Vehicle-Navigation. Los datos del mapa se eliminarán del smartphone después de la transferencia.";
        this.HTML_TXT_0167_es_ES = "* Cuando el smartphone está conectado a varios In-Vehicle-Navigations, la información de actualización del mapa muestra los datos del In-Vehicle-Navigation conectado más recientemente.";
        this.HTML_TXT_0168_es_ES = "Selección de región automática";
        this.HTML_TXT_0169_es_ES = "Comprobar actualizaciones";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_es_ES = "Pulse el botón Cancelar para detener el acceso al servidor.";
        this.HTML_TXT_0171_es_ES = "Iniciar la actualización";
        this.HTML_TXT_0172_es_ES = "La capacidad del smartphone es insuficiente. Borre algunos datos en el smartphone y vuelva a intentarlo.";
        this.HTML_TXT_0173_es_ES = "Pulse * para cancelar la descarga de datos del mapa desde el servidor.";
        this.HTML_TXT_0174_es_ES = "Pulse el botón Cancelar para cancelar la búsqueda.";
        this.HTML_TXT_0175_es_ES = "Se ha seleccionado la región desde la ubicación actual hasta el destino especificado.";
        this.HTML_TXT_0176_es_ES = "Transfiriendo los datos del mapa al In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_es_ES = "Completada la instalación de los datos del mapa de *";
        this.HTML_TXT_0178_es_ES = "No hay resultados de búsqueda Por favor, Inténtelo de nuevo.";
        this.HTML_TXT_0179_es_ES = "El punto de búsqueda es el mismo que la ubicación actual.";
        this.HTML_TXT_0180_es_ES = "Seleccione el área que desea actualizar en el mapa.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_es_ES = "Pulse el botón Cancelar para detener el acceso al servidor.";
        this.HTML_TXT_0182_es_ES = "Descarga completada.";
        this.HTML_TXT_0183_es_ES = "¿Desea eliminar los datos del mapa descargados del servidor?";
        this.HTML_TXT_0184_es_ES = "Los datos del mapa han sido eliminados.";
        this.HTML_TXT_0185_es_ES = "No se pudieron borrar los datos del mapa.";
        this.HTML_TXT_0186_es_ES = "La descarga se cancelará.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_es_ES = "[Aviso importante]<br/>No se puede iniciar SUBARU STARLINK porque esta versión ya no se admite.<br/><br/>Instale la última versión de SUBARU STARLINK en su smartphone y vuelva a intentar iniciarlo.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_es_ES = "Error de asignación de memoria";
        this.HTML_TXT_0190_es_ES = "Sila transferencia de datos se interrumpe, al reconectarse se reanudará automáticamente.";
        this.HTML_TXT_0193_es_ES = "APPS";
        this.HTML_TXT_0195_es_ES = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_es_ES = "Selección de la región de actualización del mapa";

        this.HTML_TXT_0205_A_es_ES = "Configuración del modo de visualización";

        this.APP_TXT_0176_es_ES = "Fallo de descarga.";

        this.APP_TXT_0358_es_ES = "Licencia"; 
        this.Car_TXT_0245_es_ES = "Actualización de mapas mediante un teléfono inteligente";

        this.HTML_TXT_0246_es_ES = "Manual del usuario";
        this.HTML_TXT_0247_es_ES = "Actualización de mapas mediante un teléfono inteligente";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // ドイツ語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_de_DE = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_de_DE = "";
        this.HOME_006_2_de_DE = "> ist abgelaufen.<br />Sie müssen die Funktion erwerben, um ";
        this.HOME_006_3_de_DE = "";
        this.HOME_006_4_de_DE = "";
        this.HOME_006_5_de_DE = " zu verwenden.<br />Einzelheiten erfahren Sie, indem Sie auf „Kaufbildschirm anzeigen“ tippen.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_de_DE = "Kaufbildschirm anzeigen";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_de_DE = "Später";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_de_DE = "Nicht erneut anzeigen";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_de_DE = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_de_DE = "Download fehlgeschlagen. Klicken Sie hier, um es erneut zu versuchen.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_de_DE = "Verbindungsverlauf nicht verfügbar";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_de_DE = "ZURÜCK";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_de_DE = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_de_DE = "Läuft ab";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_de_DE = "Anwendungsbild";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_de_DE = "Anwendungsübersicht";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_de_DE = "Anwendungsinformationen";
        // 販売元(4Car_TXT_0082)
        this.APP_010_de_DE = "Verkäufer";
        // バージョン(4Car_TXT_0084)
        this.APP_011_de_DE = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_de_DE = "Einstellungen";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_de_DE = "Navigationsanzeige";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_de_DE = "App-Option kaufen";
        // 非表示(4Car_TXT_0077)
        this.APP_015_de_DE = "Verbergen";
        // 表示(4Car_TXT_0066)
        this.APP_016_de_DE = "Anzeige";
        // 無料(4Car_TXT_0177)
        this.APP_017_de_DE = "Kostenlos";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_de_DE = "Gekauft";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_de_DE = "Nicht mehr erhältlich";
        // まで(4Car_TXT_0180)
        this.APP_020_de_DE = "Bis";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_de_DE = "Läuft innerhalb von";
        this.APP_021_2_de_DE = "Tagen ab";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_de_DE = "Läuft ab";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_de_DE = "Zeitraum auswählen";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_de_DE = "Abbrechen";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_de_DE = "Bitte wählen Sie den Kaufzeitraum aus.<br /><br /><font color='red'>Hinweis<br />Der unten gezeigte Preis und der tatsächlich berechnete Preis können abweichen.<br />Schließen Sie den Kauf erst ab, wenn Sie den berechneten Preis geprüft haben, der angezeigt wird, wenn die Schaltfläche [Kaufen] betätigt wird.</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_de_DE = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_de_DE = "Navigationssystem prüfen";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_de_DE = "Überprüfen Sie das Fahrzeug-Navigationssystem, das diese Funktion verwenden wird. Die gekaufte Funktion wird nur auf dem ausgewählten Fahrzeug-Navigationssystem verfügbar sein.";
        this.APP_028_2_de_DE = "Die Meldung „Der Dienst wurde erfolgreich registriert“ wird angezeigt, wenn der Kauf abgeschlossen ist. Schließen Sie nicht den Anwendungsbildschirm und trennen Sie nicht die Kommunikation (während der Kommunikation) mit dem In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_de_DE = "Registriertes Fahrzeugnavigationssystem";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_de_DE = "Kaufen";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_de_DE = "Zu anderen Fahrzeugnavigationssystem wechseln";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_de_DE = "Verbundenes Fahrzeugnavigationssystem (beim letzten Verbinden)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_de_DE = "Bitte betätigen Sie folgende Schaltfläche, um zur Anwendungsliste zu gelangen";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_de_DE = "Die Anwendungsliste anzeigen";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_de_DE = "Es tut uns leid, aber der Kauf ist fehlgeschlagen. Bitte wenden Sie sich an Ihren Clarion-Administrator.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_de_DE = "Der Kauf wurde möglicherweise nicht richtig abgeschlossen, da der Prozess ungewöhnlich lang gedauert hat. Bitte warten Sie einige Zeit und prüfen Sie auf dem App-Bildschirm, ob der Kauf abgeschlossen wurde.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_de_DE = "ein";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_de_DE = "aus";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_de_DE = "Ein Fehler ist aufgetreten.<br />Wir entschuldigen uns für die Unannehmlichkeiten.<br />Versuchen Sie es später erneut.";
        // カーナビ未登録時文言
        this.APP_EX01_de_DE = "Nicht registriert";
        //other (North American Oceans)
        this.LOCATION_999_de_DE = "sonstige";
        this.HTML_TXT_9999_de_DE = "Ozeanien";

        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_de_DE = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_de_DE = "Benutzungsbedingungen";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_de_DE = "Einstellungen";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_de_DE = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_de_DE = "ZURÜCK";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_de_DE = "Daten in der 4Car-Anwendung löschen";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_de_DE = "Die Einstellungsdaten der 4Car-Anwendung werden gelöscht.<br />(Verfügbar ab Version 1.0.5 oder höher)<br />* Versuchen Sie, die Einstellungsdaten zu löschen, wenn die Verbindung zum Gerät im Fahrzeug nicht stabil ist.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_de_DE = "Alle Daten löschen?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_de_DE = "Alle Daten wurden gelöscht.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_de_DE = "Diese Funktion ist ab Version 1.0.5 verfügbar.";
        //STARLINK エラー対応
        this.APP_Error_de_DE = "Download fehlgeschlagen.";
        //STARLINK対応
        this.APP_041_de_DE = "Update";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_de_DE = "ZURÜCK";
        //ヘッダー部文言
        this.CONFIG_002_de_DE = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_de_DE = "Die STARLINK-Applikationsdaten werden gelöscht. ";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_de_DE = "* Behebt instabile Verbindung mit dem In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_de_DE = "Alle Daten löschen?";
        //confirmダイアログ用文言
        this.CONFIG_006_de_DE = "Alle Daten wurden gelöscht.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_de_DE = "STARLINK-Applikationsdaten löschen";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_de_DE = "Region-Auswahl";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_de_DE = "Wählen Sie Ihre Hauptregion aus";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_de_DE = "* Bietet beste Erfahrung für Apps, die für Ihre Region optimiert sind.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_de_DE = "Benutzungsbedingungen";
        //利用規約更新日付文言
        this.CONFIG_012_de_DE = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_de_DE = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_de_DE = "日本";
        //アメリカ
        this.LOCATION_002_de_DE = "United States";
        //カナダ
        this.LOCATION_003_de_DE = "Canada";
        //メキシコ
        this.LOCATION_004_de_DE = "México";
        //イギリス
        this.LOCATION_005_de_DE = "United Kingdom";
        //フランス
        this.LOCATION_006_de_DE = "France";
        //ドイツ
        this.LOCATION_007_de_DE = "Deutschland";
        //オランダ
        this.LOCATION_008_de_DE = "Nederland";
        //イタリア
        this.LOCATION_009_de_DE = "Italia";
        //スペイン
        this.LOCATION_010_de_DE = "España";
        //スウェーデン
        this.LOCATION_011_de_DE = "Sverige";
        //ポーランド
        this.LOCATION_012_de_DE = "Polska";
        //ギリシャ
        this.LOCATION_013_de_DE = "Ελλάδα";
        //チェコ
        this.LOCATION_014_de_DE = "Česko";
        //ロシア
        this.LOCATION_015_de_DE = "Россия";
        //ポルトガル
        this.LOCATION_016_de_DE = "Portugal";
        //フィンランド
        this.LOCATION_017_de_DE = "Suomi";
        //ハンガリー
        this.LOCATION_018_de_DE = "Magyarország";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_de_DE = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_de_DE = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_de_DE = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_de_DE = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_de_DE = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_de_DE = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_de_DE = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_de_DE = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_de_DE = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_de_DE = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_de_DE = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_de_DE = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_de_DE = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_de_DE = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_de_DE = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_de_DE = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_de_DE = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_de_DE = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_de_DE = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_de_DE = "Vor der Verwendung auf die neuste Version der SUBARU STARLINK-App aktualisieren.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_de_DE = "Ein neues In-Vehicle-Navigation wurde installiert.<br/>Möchten Sie die existierende Lizenz auf das neue Gerät übertragen?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_de_DE = "Ja";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_de_DE = "Nein";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_de_DE = "Später erinnern";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_de_DE = "[Achtung!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_de_DE = "Von diesem Punkt an kann Ihre Lizenz nicht auf dieses Gerät zurückübertragen werden. Möchten Sie fortfahren?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_de_DE = "Das Gerät auswählen, von dem die Lizenz übertragen werden soll";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_de_DE = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_de_DE = "Verbindungsdatum: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_de_DE = "MM/TT/JJJJ";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_de_DE = "Abbrechen";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_de_DE = "Die Lizenz von dem Gerät, das am %1 verbunden war, auf das neue Gerät übertragen.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_de_DE = "Die Lizenzübertragung war erfolgreich.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_de_DE = "Die Lizenzübertragung ist fehlgeschlagen.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_de_DE = "Die Verbindung zu Ihrem neuen In-Vehicle-Navigation (ID: %2) wurde am %1 hergestellt.<br/>Möchten Sie die existierende Lizenz auf das neue Gerät übertragen?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_de_DE = "Von diesem Punkt an kann die Lizenz nicht auf dieses neue In-Vehicle-Navigation (ID: %2), das am %1 verbunden wurde, übertragen werden. Möchten Sie fortfahren?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_de_DE = "Das Folgende wird übertragen.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_de_DE = "Die vorige Lizenzübertragung war erfolgreich.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_de_DE = "Navigationsfunktion auswählen";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_de_DE = "Einige In-Vehicle-Navigation haben mehrere Navigationsfunktionen. Wählen Sie eine zu verwendende Navigation aus.<br/><br/>*Sie können unter Umständen die Navigation auswählen, die bei der Einstellung eines Zielorts mithilfe der In-Vehicle-Navigation-Anwendung verwendet wird.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_de_DE = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_de_DE = "Navigationsfunktion auswählen";
        //月表示(1月)
        this.SL_MONTH_TXT_01_de_DE = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_de_DE = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_de_DE = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_de_DE = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_de_DE = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_de_DE = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_de_DE = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_de_DE = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_de_DE = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_de_DE = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_de_DE = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_de_DE = "";
        //日付表示形式
        this.SL_DATE_FMT_01_de_DE = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_de_DE = "Größe: ";
        this.TXT_YELP_0029_de_DE = "Es ist ein Fehler aufgetreten.Bitte versuchen Sie es später erneut.";
        this.SL_TXT_0155_de_DE = "Ver. ";
        this.SL_TXT_0189_de_DE = "Aktualisiert *";
        this.SL_TXT_0191_de_DE = "Ablaufdatum: ";
        this.SL_TXT_0192_de_DE = "Kartenaktualisierungseinstellungen";
        this.SL_TXT_0193_de_DE = "Die Kartendaten vom In-Vehicle-Navigation können temporär vom Karten-Distributionsserver auf Ihrem Smartphone gespeichert werden. Bei der nächsten Verbindung mit dem In-Vehicle-Navigation können Sie die Karte aktualisieren.";
        this.SL_TXT_0196_de_DE = "Aktual.einstlg.";
        this.SL_TXT_0197_de_DE = "Automatische Aktualisierungsbestätigung";
        this.SL_TXT_0198_de_DE = "Mobilfunk";
        this.SL_TXT_0199_de_DE = "Aktualisierungsinfos";
        this.SL_TXT_0200_de_DE = "Alle herunterladen";
        this.SL_TXT_0201_de_DE = "Auf Mobilgerät heruntergeladen";
        this.SL_TXT_0202_de_DE = "Aktualisierung verfügbar";
        this.SL_TXT_0203_de_DE = "Aktualisiert";
        this.SL_TXT_0204_de_DE = "Karte: ";
        this.SL_TXT_0204_A_de_DE = "Europa";
        this.SL_TXT_0205_de_DE = "Version: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_de_DEを利用　宣言のみ
        this.SL_TXT_0206_de_DE = "Größe:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_de_DE = "Es ist nicht genügend Speicherplatz auf dem Smartphone vorhanden.";
        this.SL_TXT_0208_de_DE = "Konfigurieren Sie die Regionseinstellungen mit dem In-Vehicle-Navigation.";
        this.SL_TXT_0209_de_DE = "Ihr MapCare-Abonnement ist abgelaufen. Besuchen Sie www.subaru-maps.com zum Aktualisieren Ihres Abonnements.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_de_DE = "Bitte über WLAN herunterladen.\n\nDie Größe von Downloaddaten für mobile Daten ist je nach Region auf 30 MB beschränkt.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_de_DE = "Karte aktualisieren durch Verbindung des In-Vehicle-Navigation mit dem Smartphone. Nach der Aktualisierung des In-Vehicle-Navigation werden die Kartendaten automatisch vom Smartphone gelöscht.";
        this.SL_TXT_0212_de_DE = "Mobile Daten EIN.\n\nSie können Kartendaten über Ihre mobile Datenverbindung herunterladen. \nJe nach Region besteht jedoch eine Größenbeschränkung auf 30 MB.\n*Es können Datengebühren anfallen.\n\nBitte ausschalten,\nwenn Sie nur über WLAN herunterladen wollen.";
        this.SL_TXT_0213_de_DE = "Auto-Update EIN.\n\nAutomatischer Download\nvon Kartendaten zum Speichern\nauf Ihrem Smartphone\n*Es können Datengebühren anfallen.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_de_DE = "Verbindung zum In-Vehicle-Navigation wurde getrennt. Versuchen Sie es erneut, nachdem Sie die Verbindung zum In-Vehicle-Navigation bestätigt haben.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_de_DE = "Unzureichender In-Vehicle-Navigation-Speicherplatz vorhanden. Versuchen Sie es nach der Bestätigung der In-Vehicle-Navigation-Einstellungen erneut.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_de_DE = "Es ist ein Fehler während Datenübertragung aufgetreten. Bitte versuchen Sie es später erneut.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_de_DE = "Es ist ein Fehler während des Downloads der Kartendaten vom Server aufgetreten. Bitte versuchen Sie es später erneut. ";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_de_DE = "Unzureichender Smartphone-Speicherplatz vorhanden. Bitte versuchen Sie es nach dem Löschen der Daten von Ihrem Smartphone erneut.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_de_DE = "Mobile Daten AUS.\n\nBitte über WLAN herunterladen.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_de_DE = "Die Verbindung mit dem Kommunikationsserver wurde getrennt. Versuchen Sie es erneut, wenn die Verbindung wieder hergestellt wurde.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_de_DEを利用　宣言のみ
        this.SL_TXT_0221_de_DE = "Größe: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_de_DE = "OK";
        this.HTML_TXT_0068_de_DE = "Während des Herunterladens der Kartendaten darf das Smartphone nicht in den Ruhemodus eintreten.\nWenn das Smartphone in den Ruhemodus eintritt, starten Sie die App SUBARU STARLINK erneut.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_de_DE = "Das Karten-Update kann nicht starten. Bitte Prüfen Sie den Status der In-Vehicle-Navigation.";
        this.HTML_TXT_0165_de_DE = "Karten-Update-Einstellungsfunktion";
        this.HTML_TXT_0166_de_DE = "1. Die Kartendaten vom Server auf das Smartphone herunterladen.<br><br>2. Wenn das Smartphone mit dem In-Vehicle-Navigation verbunden ist, werden die Kartendaten an das In-Vehicle-Navigation übertragen. Die Kartendaten werden nach der Übertragung vom Smartphone gelöscht.";
        this.HTML_TXT_0167_de_DE = "* Wenn das Smartphone mit mehreren In-Vehicle-Navigations verbunden ist, zeigt die Karten-Update-Information die Daten des zuletzt am meisten verbunden In-Vehicle-Navigations an.";
        this.HTML_TXT_0168_de_DE = "Automatische Regionsauswahl";
        this.HTML_TXT_0169_de_DE = "Auf Update prüfen";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_de_DE = "Das Drücken der Abbrechen-Taste stoppt den Zugriff auf den Server.";
        this.HTML_TXT_0171_de_DE = "Update starten";
        this.HTML_TXT_0172_de_DE = "Die Kapazität des Smartphones ist unzureichend. Bitte einige Daten auf dem Smartphone löschen und erneut versuchen.";
        this.HTML_TXT_0173_de_DE = "Bitte * antippen, wenn der Download der Kartendaten vom Server abgebrochen werden soll.";
        this.HTML_TXT_0174_de_DE = "Die Abbrechen-Taste drücken, um die Suche abzubrechen.";
        this.HTML_TXT_0175_de_DE = "Die Region vom aktuellen Standort zum angegebenen Ziel ist ausgewählt.";
        this.HTML_TXT_0176_de_DE = "Die Kartendaten werden an das In-Vehicle-Navigation übertragen.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_de_DE = "*Installation der Kartendaten abgeschlossen.";
        this.HTML_TXT_0178_de_DE = "Es gibt keine Suchergebnisse. Bitte erneut versuchen.";
        this.HTML_TXT_0179_de_DE = "Der Suchpunkt ist derselbe wie der aktuelle Standort.";
        this.HTML_TXT_0180_de_DE = "Bitte auf der Karte den Bereich auswählen, der aktualisiert werden soll.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_de_DE = "Das Drücken der Abbrechen-Taste stoppt den Zugriff auf den Server.";
        this.HTML_TXT_0182_de_DE = "Der Download war erfolgreich.";
        this.HTML_TXT_0183_de_DE = "Möchten Sie die vom Server heruntergeladenen Kartendaten löschen?";
        this.HTML_TXT_0184_de_DE = "Die Kartendaten wurden gelöscht.";
        this.HTML_TXT_0185_de_DE = "Das Löschen der Kartendaten war nicht möglich.";
        this.HTML_TXT_0186_de_DE = "Der Download wird abgebrochen.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_de_DE = "[Wichtige Mitteilung]<br/>SUBARU STARLINK kann nicht gestartet werden, da diese Version nicht länger unterstützt wird.<br/><br/>Bitte die neuste Version von SUBARU STARLINK auf Ihrem Smartphone installieren und versuchen, erneut zu starten.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_de_DE = "Speicherzuweisungsfehler";
        this.HTML_TXT_0190_de_DE = "Wenn die Datenübertragung unterbrochen wird, wird sie nach der erneuten Verbindung automatisch fortgesetzt.";
        this.HTML_TXT_0193_de_DE = "APPS";
        this.HTML_TXT_0195_de_DE = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_de_DE = "Auswahl der Karten-Update-Region";

        this.HTML_TXT_0205_A_de_DE = "Anzeigemodus einstellen";

        this.APP_TXT_0176_de_DE = "Fehler beim Herunterladen.";

        this.APP_TXT_0358_de_DE = "Lizenz"; 
        this.Car_TXT_0245_de_DE = "Akt. Standort";

        this.HTML_TXT_0246_de_DE = "Bedienungsanleitung";
        this.HTML_TXT_0247_de_DE = "Aktualisieren der Kartendaten unter Verwendung eines Smartphones";

        // ----- Harman OTA GEN4 対応 -----<

        ////////////////////////////////////////////////////////////////
        // イタリア語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_it_IT = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_it_IT = "";
        this.HOME_006_2_it_IT = " è scaduto.<br />Occorre acquistare la funzione per utilizzare ";
        this.HOME_006_3_it_IT = "";
        this.HOME_006_4_it_IT = "";
        this.HOME_006_5_it_IT = ".<br />Per i dettagli, toccare il pulsante Visualizza schermata di acquisto.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_it_IT = "Visualizza schermata di acquisto";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_it_IT = "Più tardi";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_it_IT = "Non visualizzare più";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_it_IT = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_it_IT = "Download non riuscito. Fare clic per riprovare.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_it_IT = "Cronologia delle connessioni non disponibile";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_it_IT = "INDIETRO";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_it_IT = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_it_IT = "Scadenza";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_it_IT = "Immagine applicazione";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_it_IT = "Profilo applicazione";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_it_IT = "Informazioni applicazione";
        // 販売元(4Car_TXT_0082)
        this.APP_010_it_IT = "Venditore";
        // バージョン(4Car_TXT_0084)
        this.APP_011_it_IT = "Versione";
        // 設定(4Car_TXT_0085)
        this.APP_012_it_IT = "Impostazioni";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_it_IT = "Display di navigazione";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_it_IT = "Acquista elemento app";
        // 非表示(4Car_TXT_0077)
        this.APP_015_it_IT = "Nascondi";
        // 表示(4Car_TXT_0066)
        this.APP_016_it_IT = "Visualizza";
        // 無料(4Car_TXT_0177)
        this.APP_017_it_IT = "Gratuito";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_it_IT = "Acquistato";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_it_IT = "Interrompi vendita";
        // まで(4Car_TXT_0180)
        this.APP_020_it_IT = "A";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_it_IT = "Scade entro";
        this.APP_021_2_it_IT = "giorni";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_it_IT = "Scadenza";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_it_IT = "Seleziona periodo";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_it_IT = "Annulla";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_it_IT = "Scegliere il periodo per l'acquisto.<br /><br /><font color='red'>Nota<br />Il prezzo indicato di seguito e il prezzo finale corrente potrebbero variare.<br />Assicurarsi di completare l'acquisto dopo aver confermato il prezzo finale indicato quando viene premuto il pulsante [Acquista].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_it_IT = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_it_IT = "Controlla navigatore";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_it_IT = "Verificare il sistema di navigazione per auto che utilizzerà questa funzione. La funzione acquistata sarà disponibile solo sul sistema di navigazione per auto selezionato.";
        this.APP_028_2_it_IT = "Al completamento dell'acquisto, verrà visualizzato il messaggio \"Servizio registrato correttamente\". Non chiudere la schermata dell'applicazione o scollegare la comunicazione (durante la comunicazione) con In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_it_IT = "Navigatore registrato";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_it_IT = "Acquista";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_it_IT = "Passa a un altro navigatore.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_it_IT = "Navigatore collegato (ultima connessione)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_it_IT = "Premere il pulsante seguente per andare alla schermata dell'elenco di applicazioni.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_it_IT = "Visualizza l'elenco di applicazioni";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_it_IT = "Spiacenti, l'acquisto non è riuscito. Contattare l'amministratore Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_it_IT = "È possibile che l'acquisto non sia stato completato correttamente perché il tempo impiegato per il processo è stato anomalo. Attendere e verificare che l'acquisto sia stato completato sulla schermata dell'app. Ci scusiamo per eventuali inconvenienti.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_it_IT = "on";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_it_IT = "off";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_it_IT = "Si è verificato un errore.<br />Ci scusiamo per l'inconveniente.<br />Riprovare più tardi.";
        // カーナビ未登録時文言
        this.APP_EX01_it_IT = "Non registrato";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_it_IT = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_it_IT = "Termini e condizioni di utilizzo";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_it_IT = "Impostazioni";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_it_IT = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_it_IT = "INDIETRO";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_it_IT = "Eliminare i dati dell'applicazione 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_it_IT = "I dati di impostazione nell'applicazione 4Car sono stati eliminati.<br />(Disponibile con la versione 1.0.5 o successiva)<br />* Quando il collegamento al dispositivo per auto non è stabile, provare a eliminare i dati di impostazione.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_it_IT = "Eliminare tutti i dati?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_it_IT = "Tutti i dati sono stati eliminati.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_it_IT = "Questa funzione è disponibile con la versione 1.0.5 o successiva.";
        //STARLINK エラー対応
        this.APP_Error_it_IT = "Download non riuscito.";
        //STARLINK対応
        this.APP_041_it_IT = "Aggiorna";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_it_IT = "INDIETRO";
        //ヘッダー部文言
        this.CONFIG_002_it_IT = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_it_IT = "I dati dell'applicazione STARLINK verranno eliminati.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_it_IT = "* Risolve la connessione instabile con In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_it_IT = "Eliminare tutti i dati?";
        //confirmダイアログ用文言
        this.CONFIG_006_it_IT = "Tutti i dati sono stati eliminati.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_it_IT = "Cancella dati dell'applicazione STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_it_IT = "Selezione della zona";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_it_IT = "Selezionare la zona principale di utilizzo";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_it_IT = "* Offre l'esperienza migliore con le app ottimizzate per la tua regione.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_it_IT = "Termini e condizioni di utilizzo";
        //利用規約更新日付文言
        this.CONFIG_012_it_IT = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_it_IT = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_it_IT = "日本";
        //アメリカ
        this.LOCATION_002_it_IT = "United States";
        //カナダ
        this.LOCATION_003_it_IT = "Canada";
        //メキシコ
        this.LOCATION_004_it_IT = "México";
        //イギリス
        this.LOCATION_005_it_IT = "United Kingdom";
        //フランス
        this.LOCATION_006_it_IT = "France";
        //ドイツ
        this.LOCATION_007_it_IT = "Deutschland";
        //オランダ
        this.LOCATION_008_it_IT = "Nederland";
        //イタリア
        this.LOCATION_009_it_IT = "Italia";
        //スペイン
        this.LOCATION_010_it_IT = "España";
        //スウェーデン
        this.LOCATION_011_it_IT = "Sverige";
        //ポーランド
        this.LOCATION_012_it_IT = "Polska";
        //ギリシャ
        this.LOCATION_013_it_IT = "Ελλάδα";
        //チェコ
        this.LOCATION_014_it_IT = "Česko";
        //ロシア
        this.LOCATION_015_it_IT = "Россия";
        //ポルトガル
        this.LOCATION_016_it_IT = "Portugal";
        //フィンランド
        this.LOCATION_017_it_IT = "Suomi";
        //ハンガリー
        this.LOCATION_018_it_IT = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_it_IT = "altro";
        this.HTML_TXT_9999_it_IT = "Oceania";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_it_IT = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_it_IT = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_it_IT = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_it_IT = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_it_IT = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_it_IT = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_it_IT = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_it_IT = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_it_IT = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_it_IT = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_it_IT = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_it_IT = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_it_IT = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_it_IT = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_it_IT = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_it_IT = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_it_IT = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_it_IT = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_it_IT = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_it_IT = "Prima dell'uso, eseguire l'aggiornamento alla versione più recente di SUBARU STARLINK.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_it_IT = "È stato installato un nuovo In-Vehicle-Navigation.<br/>Trasferire la licenza esistente al nuovo dispositivo?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_it_IT = "Si";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_it_IT = "No";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_it_IT = "Ricordamelo più tardi";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_it_IT = "[Attenzione!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_it_IT = "Da questo momento in poi, la licenza non potrà essere trasferita nuovamente a questo dispositivo. Procedere?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_it_IT = "Selezionare il dispositivo da cui trasferire la licenza";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_it_IT = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_it_IT = "Data di connessione: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_it_IT = "mm/gg/aaaa";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_it_IT = "Annulla";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_it_IT = "Trasferire la licenza al nuovo dispositivo dal dispositivo connesso il %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_it_IT = "Trasferimento della licenza riuscito correttamente.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_it_IT = "Trasferimento della licenza non riuscito.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_it_IT = "La connessione al nuovo In-Car Device (ID: %2) è stata effettuata il %1.<br/>Trasferire la licenza esistente al nuovo dispositivo?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_it_IT = "Da questo momento in poi, la licenza non può essere trasferita a questo nuovo In-Vehicle-Navigation (ID: %2) connesso il %1. Procedere?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_it_IT = "Verrà eseguito il trasferimento.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_it_IT = "Trasferimento della licenza precedente riuscito correttamente.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_it_IT = "Seleziona la funzione di navigazione";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_it_IT = "Alcuni In-Vehicle-Navigation sono dotati di più funzioni di navigazione Selezionare una navigazione da usare.<br/><br/>*Selezionare la navigazione usata quando si imposta una destinazione usando l'applicazione In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_it_IT = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_it_IT = "Seleziona la funzione di navigazione";
        //月表示(1月)
        this.SL_MONTH_TXT_01_it_IT = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_it_IT = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_it_IT = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_it_IT = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_it_IT = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_it_IT = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_it_IT = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_it_IT = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_it_IT = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_it_IT = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_it_IT = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_it_IT = "";
        //日付表示形式
        this.SL_DATE_FMT_01_it_IT = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_it_IT = "Dimensione: ";
        this.TXT_YELP_0029_it_IT = "Si è verificato un errore.Riprovare più tardi.";
        this.SL_TXT_0155_it_IT = "Ver. ";
        this.SL_TXT_0189_it_IT = "Aggiornato il *";
        this.SL_TXT_0191_it_IT = "Data di scadenza: ";
        this.SL_TXT_0192_it_IT = "Impostazioni di aggiornamento mappa";
        this.SL_TXT_0193_it_IT = "I dati della mappa In-Vehicle-Navigation possono essere salvati temporaneamente nello smartphone dal server di distribuzione delle mappe. Alla successiva connessione a In-Vehicle-Navigation, sarà possibile aggiornare la mappa.";
        this.SL_TXT_0196_it_IT = "Impost. di aggiorn.";
        this.SL_TXT_0197_it_IT = "Verifica aggiornamento auto";
        this.SL_TXT_0198_it_IT = "Cellulare";
        this.SL_TXT_0199_it_IT = "Info. aggiornamento";
        this.SL_TXT_0200_it_IT = "Scarica tutto";
        this.SL_TXT_0201_it_IT = "Scaricato sul cellulare";
        this.SL_TXT_0202_it_IT = "Aggiornamento disponibile";
        this.SL_TXT_0203_it_IT = "Aggiornato";
        this.SL_TXT_0204_it_IT = "Mappa: ";
        this.SL_TXT_0204_A_it_IT = "Europa";
        this.SL_TXT_0205_it_IT = "Versione: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_it_ITを利用　宣言のみ
        this.SL_TXT_0206_it_IT = "Dimensione:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_it_IT = "Spazio insufficiente disponibile sullo smartphone.";
        this.SL_TXT_0208_it_IT = "Configurare le impostazioni regionali con In-Vehicle-Navigation.";
        this.SL_TXT_0209_it_IT = "Abbonamento MapCare scaduto.\nVisitare il sito Web www.subaru-maps.com\nper aggiornare l'abbonamento.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_it_IT = "Scaricare tramite Wi-Fi.\n\nIl download dei dati è limitato a 30 MB per zona tramite Dati mobili.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_it_IT = "Aggiornare la mappa connettendo In-Vehicle-Navigation allo smartphone, Dopo aver aggiornato In-Vehicle-Navigation, i dati della mappa verranno automaticamente eliminati dallo smartphone.";
        this.SL_TXT_0212_it_IT = "Dati mobili ON.\n\nÈ possibile scaricare i dati della mappa tramite la connessione ai dati mobili. \nTuttavia, i dati sono limitati a 30 MB per zona.\n*Potrebbero essere applicati i costi previsti per il traffico dati.\n\nDisattivare\nper scaricare solo tramite Wi-Fi.";
        this.SL_TXT_0213_it_IT = "Aggiornamento automatico ON.\n\nScaricare automaticamente\ni dati della mappa e salvarli\nsullo smartphone\n*Potrebbero essere applicati i costi previsti per il traffico dati.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_it_IT = "La connessione a In-Vehicle-Navigation è stata scollegata. Riprovare dopo aver confermato la connessione a In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_it_IT = "Spazio di archiviazione su In-Vehicle-Navigation insufficiente. Riprovare dopo aver confermato le impostazioni In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_it_IT = "Si è verificato un errore durante il trasferimento dei dati. Riprovare in seguito.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_it_IT = "Si è verificato un errore durante il download dei dati mappa dal server. Riprovare in seguito.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_it_IT = "Spazio di archiviazione su smartphone insufficiente. Riprovare dopo aver eliminato i dati dallo smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_it_IT = "Dati mobili OFF.\n\nScaricare tramite Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_it_IT = "La comunicazione con il server è stata scollegata. Riprovare dopo aver ristabilito le comunicazioni.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_it_ITを利用　宣言のみ
        this.SL_TXT_0221_it_IT = "Dimensione: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_it_IT = "OK";
        this.HTML_TXT_0068_it_IT = "Accertarsi che lo smartphone non entri in modalità riposo durante il download dei dati della mappa.\nSe lo smartphone entra in modalità riposo, riavviare l'app SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_it_IT = "Impossibile avviare l'aggiornamento della mappa. Controllare lo stato di In-Vehicle-Navigation.";
        this.HTML_TXT_0165_it_IT = "Funzione di configurazione dell'aggiornamento mappa";
        this.HTML_TXT_0166_it_IT = "1. Scaricare i dati mappa dal server sullo smartphone.<br><br>2. Quando si connette lo smartphone a In-Vehicle-Navigation, i dati mappa vengono trasferiti a In-Vehicle-Navigation. Dopo il trasferimento, i dati mappa verranno eliminati dallo smartphone.";
        this.HTML_TXT_0167_it_IT = "* Quando lo smartphone è connesso a più In-Vehicle-Navigation, le informazioni sull'aggiornamento mappa visualizzano i dati del dispositivo In-Vehicle-Navigation connesso più di recente.";
        this.HTML_TXT_0168_it_IT = "Selezione automatica della regione";
        this.HTML_TXT_0169_it_IT = "Cerca aggiornamento";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_it_IT = "Premendo il pulsante Annulla, si arresta l'accesso al server.";
        this.HTML_TXT_0171_it_IT = "Avvia aggiornamento";
        this.HTML_TXT_0172_it_IT = "La capacità dello smartphone non è sufficiente. Eliminare alcuni dati e riprovare.";
        this.HTML_TXT_0173_it_IT = "Toccare * per annullare il download dei dati della mappa dal server.";
        this.HTML_TXT_0174_it_IT = "Premere il pulsante Annulla per annullare la ricerca.";
        this.HTML_TXT_0175_it_IT = "È stata selezionata la regione dalla posizione corrente alla destinazione specificata.";
        this.HTML_TXT_0176_it_IT = "I dati mappa sono stati trasferiti a In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_it_IT = "* Installazione dei dati della mappa completata";
        this.HTML_TXT_0178_it_IT = "Non sono stati restituiti risultati della ricerca. Riprovare.";
        this.HTML_TXT_0179_it_IT = "Il punto di ricerca corrisponde alla posizione corrente.";
        this.HTML_TXT_0180_it_IT = "Selezionare l'area che si desidera aggiornare sulla mappa.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_it_IT = "Premendo il pulsante Annulla, si arresta l'accesso al server.";
        this.HTML_TXT_0182_it_IT = "Download riuscito correttamente.";
        this.HTML_TXT_0183_it_IT = "Eliminare i dati mappa scaricati dal server?";
        this.HTML_TXT_0184_it_IT = "I dati mappa sono stati eliminati.";
        this.HTML_TXT_0185_it_IT = "Impossibile eliminare i dati mappa.";
        this.HTML_TXT_0186_it_IT = "Il download verrà annullato.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_it_IT = "[Nota importante]<br/>SUBARU STARLINK non può essere lanciato perché questa versione non è più supportata.<br/><br/>Installare la versione più recente di SUBARU STARLINK sullo smartphone e provare a lanciare di nuovo.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_it_IT = "Errore di allocazione della memoria";
        this.HTML_TXT_0190_it_IT = "Se il trasferimento dati viene interrotto, verrà ripreso automaticamente dopo la riconnessione.";
        this.HTML_TXT_0193_it_IT = "APPS";
        this.HTML_TXT_0195_it_IT = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_it_IT = "Selezione zona aggiornamento mappa";

        this.HTML_TXT_0205_A_it_IT = "Impostazione della modalità di visualizzazione";

        this.APP_TXT_0176_it_IT = "Download non riuscito.";

        this.APP_TXT_0358_it_IT = "Autorizzazione"; 
        this.Car_TXT_0245_it_IT = "Posizione";

        this.HTML_TXT_0246_it_IT = "Manuale utente";
        this.HTML_TXT_0247_it_IT = "Aggiornamento dei dati della mappe mediante smartphone";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // ロシア語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_ru_RU = "ГЛАВНАЯ";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_ru_RU = "Истек срок действия ";
        this.HOME_006_2_ru_RU = ".<br />Необходимо приобрести лицензию, чтобы использовать ";
        this.HOME_006_3_ru_RU = "";
        this.HOME_006_4_ru_RU = "";
        this.HOME_006_5_ru_RU = ".<br />Для получения дополнительных сведений нажмите кнопку \"Показать экран заказа\".";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_ru_RU = "Показать экран покупки";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_ru_RU = "Позднее";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_ru_RU = "Больше не показывать";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_ru_RU = "ПРИЛОЖЕНИЕ";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_ru_RU = "Ошибка загрузки. Нажмите, чтобы попробовать еще раз.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_ru_RU = "История соединений недоступна";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_ru_RU = "НАЗАД";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_ru_RU = "НАСТРОЙКА";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_ru_RU = "Окончание срока действия";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_ru_RU = "Изображение приложения";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_ru_RU = "Макет приложения";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_ru_RU = "Информация приложения";
        // 販売元(4Car_TXT_0082)
        this.APP_010_ru_RU = "Продавец";
        // バージョン(4Car_TXT_0084)
        this.APP_011_ru_RU = "Версия";
        // 設定(4Car_TXT_0085)
        this.APP_012_ru_RU = "Настройки";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_ru_RU = "Навигационный дисплей";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_ru_RU = "Приобрести элемент приложения";
        // 非表示(4Car_TXT_0077)
        this.APP_015_ru_RU = "Скрыть";
        // 表示(4Car_TXT_0066)
        this.APP_016_ru_RU = "Отобразить";
        // 無料(4Car_TXT_0177)
        this.APP_017_ru_RU = "Бесплатно";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_ru_RU = "Приобретено";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_ru_RU = "Остановить продажу";
        // まで(4Car_TXT_0180)
        this.APP_020_ru_RU = "В";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_ru_RU = "Истекает в течение";
        this.APP_021_2_ru_RU = "дней";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_ru_RU = "Окончание срока действия";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_ru_RU = "Выберите период";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_ru_RU = "Отмена";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_ru_RU = "Выберите приобретаемый период.<br /><br /><font color='red'>Примечание<br />Приведенная ниже цена и фактическое предложение могут отличаться.<br />Выполняйте покупку после подтверждения цены, которая указывается при нажатии кнопки [Купить].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_ru_RU = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_ru_RU = "Проверить автомобильную навигационную систему";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_ru_RU = "Проверьте навигационную систему для автомобилей, которая будет использовать данную функцию. Приобретенная функция будет доступна только на некоторых навигационных системах для автомобилей.";
        this.APP_028_2_ru_RU = "После завершения покупки отобразится сообщение \"Служба зарегистрирована успешно\". Не завершайте работу приложения и не отключайте коммуникацию (при наличии) с In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_ru_RU = "Зарегистрированная автомобильная навигационная система";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_ru_RU = "Купить";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_ru_RU = "Изменить"; // 一時的にこちらを使用(04.23)
        //    public APP_031_ru_RU: string = "Изменить автомобильную навигационную систему.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_ru_RU = "Подключенная автомобильная навигационная система (подключавшаяся перед этим)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_ru_RU = "Нажмите следующую кнопку, чтобы перейти к списку приложений.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_ru_RU = "Показать список приложений";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_ru_RU = "Извините, выполнить покупку не удалось. Обратитесь к администратору Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_ru_RU = "Возможно, произошел сбой при оформлении покупки, так как процесс занял слишком много времени. Немного подождите и проверьте, завершена ли покупка на экране приложения. Приносим извинения за неудобства.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_ru_RU = "вкл.";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_ru_RU = "выкл.";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_ru_RU = "Произошла ошибка.<br />Приносим извинения за неудобства.<br />Повторите попытку позже.";
        // カーナビ未登録時文言
        this.APP_EX01_ru_RU = "Не зарегистрировано";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_ru_RU = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_ru_RU = "Условия использования";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_ru_RU = "Настройки";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_ru_RU = "НАСТРОЙКА";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_ru_RU = "НАЗАД";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_ru_RU = "Удалить данные приложения 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_ru_RU = "Настройки приложения 4Car удалены.<br />(Доступно в версии 1.0.5 или более поздней)<br />* Если канал связи с автомобильным устройством неустойчивый, попробуйте удалить настройки.<br />";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_ru_RU = "Удалить все данные?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_ru_RU = "Все данные удалены.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_ru_RU = "Эта функция доступна для версии 1.0.5 или более поздней.";
        //STARLINK エラー対応
        this.APP_Error_ru_RU = "Сбой загрузки.";
        //STARLINK対応
        this.APP_041_ru_RU = "Обновить";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_ru_RU = "НАЗАД";
        //ヘッダー部文言
        this.CONFIG_002_ru_RU = "НАСТРОЙКА";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_ru_RU = "Данные приложения STARLINK будут удалены.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_ru_RU = "* Устранена нестабильная связь с In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_ru_RU = "Удалить все данные?";
        //confirmダイアログ用文言
        this.CONFIG_006_ru_RU = "Все данные удалены.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_ru_RU = "Очистить данные приложения STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_ru_RU = "Выбор региона";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_ru_RU = "Выберите свой основной регион.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_ru_RU = "* Предоставляет лучшие возможности для приложений, оптимизированных в вашем регионе.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_ru_RU = "Условия использования";
        //利用規約更新日付文言
        this.CONFIG_012_ru_RU = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_ru_RU = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_ru_RU = "日本";
        //アメリカ
        this.LOCATION_002_ru_RU = "United States";
        //カナダ
        this.LOCATION_003_ru_RU = "Canada";
        //メキシコ
        this.LOCATION_004_ru_RU = "México";
        //イギリス
        this.LOCATION_005_ru_RU = "United Kingdom";
        //フランス
        this.LOCATION_006_ru_RU = "France";
        //ドイツ
        this.LOCATION_007_ru_RU = "Deutschland";
        //オランダ
        this.LOCATION_008_ru_RU = "Nederland";
        //イタリア
        this.LOCATION_009_ru_RU = "Italia";
        //スペイン
        this.LOCATION_010_ru_RU = "España";
        //スウェーデン
        this.LOCATION_011_ru_RU = "Sverige";
        //ポーランド
        this.LOCATION_012_ru_RU = "Polska";
        //ギリシャ
        this.LOCATION_013_ru_RU = "Ελλάδα";
        //チェコ
        this.LOCATION_014_ru_RU = "Česko";
        //ロシア
        this.LOCATION_015_ru_RU = "Россия";
        //ポルトガル
        this.LOCATION_016_ru_RU = "Portugal";
        //フィンランド
        this.LOCATION_017_ru_RU = "Suomi";
        //ハンガリー
        this.LOCATION_018_ru_RU = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_ru_RU = "прочее";

        this.HTML_TXT_9999_ru_RU = "Океания";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_ru_RU = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_ru_RU = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_ru_RU = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_ru_RU = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_ru_RU = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_ru_RU = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_ru_RU = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_ru_RU = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_ru_RU = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_ru_RU = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_ru_RU = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_ru_RU = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_ru_RU = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_ru_RU = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_ru_RU = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_ru_RU = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_ru_RU = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_ru_RU = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_ru_RU = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_ru_RU = "Перед использованием обновить до последней версии приложения SUBARU STARLINK.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_ru_RU = "Установлено новое In-Vehicle-Navigation.<br/>Хотите перенести существующую лицензию на новое устройство?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_ru_RU = "Да";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_ru_RU = "Нет";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_ru_RU = "Напомните мне позже";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_ru_RU = "[Внимание!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_ru_RU = "Начиная с этого момента, ваша лицензия не может быть передана обратно на это устройство. Вы хотите продолжить?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_ru_RU = "Выберите устройство для передачи лицензии с";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_ru_RU = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_ru_RU = "Дата подключения: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_ru_RU = "мм/дд/гггг";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_ru_RU = "Отмена";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_ru_RU = "Передайте лицензию на новое устройство с устройства, которое было подключено %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_ru_RU = "Передача лицензии завершилась успешно.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_ru_RU = "Передача лицензии не удалась.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_ru_RU = "Подключение к вашему новому In-Car Device (ID: %2) выполнено %1.<br/>Хотите перенести существующую лицензию на новое устройство?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_ru_RU = "Начиная с этого момента, лицензия не может быть передана на это новое In-Vehicle-Navigation (ID: %2), которое было подключено %1. Вы хотите продолжить?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_ru_RU = "Будет передано следующее.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_ru_RU = "Передача предыдущей лицензии завершилась успешно.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_ru_RU = "Выберите функцию навигации";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_ru_RU = "Некоторые In-Vehicle-Navigation имеют несколько функций навигации. Выберите навигацию для использования. <br/><br/>* Вы можете выбрать навигацию, используемую при установке пункта назначения, с помощью приложения In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_ru_RU = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_ru_RU = "Выберите функцию навигации";
        //月表示(1月)
        this.SL_MONTH_TXT_01_ru_RU = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_ru_RU = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_ru_RU = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_ru_RU = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_ru_RU = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_ru_RU = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_ru_RU = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_ru_RU = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_ru_RU = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_ru_RU = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_ru_RU = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_ru_RU = "";
        //日付表示形式
        this.SL_DATE_FMT_01_ru_RU = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_ru_RU = "Размер: ";
        this.TXT_YELP_0029_ru_RU = "Произошла ошибка.Говорите позже.";
        this.SL_TXT_0155_ru_RU = "Версия ";
        this.SL_TXT_0189_ru_RU = "Обновлено *";
        this.SL_TXT_0191_ru_RU = "Дата окончания срока действия: ";
        this.SL_TXT_0192_ru_RU = "Настройки обновления карты";
        this.SL_TXT_0193_ru_RU = "Данные карты In-Vehicle-Navigation могут временно сохраняться на вашем смартфоне с сервера распространения карты. При следующем подключении к In-Vehicle-Navigation вы можете обновить карту.";
        this.SL_TXT_0196_ru_RU = "Настр. Обновления";
        this.SL_TXT_0197_ru_RU = "Проверить автоматическое обновление";
        this.SL_TXT_0198_ru_RU = "Сотовая связь";
        this.SL_TXT_0199_ru_RU = "Информ. об обновл.";
        this.SL_TXT_0200_ru_RU = "Загрузить все";
        this.SL_TXT_0201_ru_RU = "Загружено в мобильное устройство";
        this.SL_TXT_0202_ru_RU = "Есть обновление";
        this.SL_TXT_0203_ru_RU = "Обновлено";
        this.SL_TXT_0204_ru_RU = "Карта: ";
        this.SL_TXT_0204_A_ru_RU = "Европа";
        this.SL_TXT_0205_ru_RU = "Версия: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_ru_RUを利用　宣言のみ
        this.SL_TXT_0206_ru_RU = "Размер:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_ru_RU = "Недостаточно свободного места на смартфоне.";
        this.SL_TXT_0208_ru_RU = "Настройте параметры региона с помощью In-Vehicle-Navigation.";
        this.SL_TXT_0209_ru_RU = "Срок вашей подписки MapCare истек.\nПерейдите на сайт www.subaru-maps.com,\nчтобы возобновить подписку.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_ru_RU = "Загрузите по WiFi.\n\nЗагрузка мобильных данных ограничена 30 МБ для каждого региона.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_ru_RU = "Обновите карту, подключив In-Vehicle-Navigation к смартфону. После обновления In-Vehicle-Navigation данные карты будут автоматически удалены из смартфона.";
        this.SL_TXT_0212_ru_RU = "Включен мобильный трафик.\n\nДанные карты можно загрузить посредством мобильного трафика. \nОднако объем ограничен 30 МБ для каждого региона.\n*Может взиматься оплата за передачу данных.\n\nВыключите,\nесли необходимо загружать только по WiFi.";
        this.SL_TXT_0213_ru_RU = "Автообновление включено.\n\nАвтоматическая загрузка\nкарт и сохранение их\nна смартфоне\n*Может взиматься оплата за передачу данных.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_ru_RU = "Соединение с In-Vehicle-Navigation было отключено. Повторите попытку после подтверждения подключения к In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_ru_RU = "Недостаточно свободного места в In-Vehicle-Navigation. Повторите попытку после подтверждения настроек In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_ru_RU = "Произошла ошибка во время передачи данных. Повторите попытку позже.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_ru_RU = "Произошла ошибка при загрузке данных карты с сервера. Повторите попытку позже.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_ru_RU = "Недостаточно свободного места на смартфоне. Повторите попытку после удаления данных со своего смартфона.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_ru_RU = "Мобильный трафик выключен.\n\nВыполните загрузку по WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_ru_RU = "Связь с сервером прервана. Повторите попытку после восстановления связи.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_ru_RUを利用　宣言のみ
        this.SL_TXT_0221_ru_RU = "Размер: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_ru_RU = "OK";
        this.HTML_TXT_0068_ru_RU = "Не допускайте перехода смартфона в спящий режим во время загрузки карт.\nВ случае перехода смартфона в спящий режим запустите приложение SUBARU STARLINK заново.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_ru_RU = "Невозможно запустить обновление карт. Проверьте состояние In-Vehicle-Navigation.";
        this.HTML_TXT_0165_ru_RU = "Функция настройки обновления карты";
        this.HTML_TXT_0166_ru_RU = "1. Загрузите данные карты из сервера на смартфон.<br><br>2. При подключении смартфона к In-Vehicle-Navigation данные карты передаются на In-Vehicle-Navigation. После передачи данные карты будут удалены со смартфона.";
        this.HTML_TXT_0167_ru_RU = "* Когда смартфон подключен к нескольким In-Vehicle-Navigation, информация об обновлении карты отображает данные последнего подключенного In-Vehicle-Navigation.";
        this.HTML_TXT_0168_ru_RU = "Автоматический выбор региона";
        this.HTML_TXT_0169_ru_RU = "Проверить наличие обновлений";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_ru_RU = 'Нажатие кнопки"Отмена"прекращает доступ к серверу.';
        this.HTML_TXT_0171_ru_RU = "Начать обновление";
        this.HTML_TXT_0172_ru_RU = "Емкость смартфона недостаточна. Удалите некоторые данные на смартфоне и повторите попытку.";
        this.HTML_TXT_0173_ru_RU = "Нажмите *, если необходимо отменить загрузку карт с сервера.";
        this.HTML_TXT_0174_ru_RU = 'Нажмите кнопку"Отмена", чтобы отменить поиск.';
        this.HTML_TXT_0175_ru_RU = "Выбрана область от текущего местоположения до указанного места назначения.";
        this.HTML_TXT_0176_ru_RU = "Данные карты переносятся в In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_ru_RU = "* Установка карт завершена";
        this.HTML_TXT_0178_ru_RU = "Нет результатов поиска. Повторите попытку.";
        this.HTML_TXT_0179_ru_RU = "Точка поиска совпадает с текущим местоположением.";
        this.HTML_TXT_0180_ru_RU = "Выберите область, которую вы хотите обновить на карте.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_ru_RU = 'Нажатие кнопки"Отмена"прекращает доступ к серверу.';
        this.HTML_TXT_0182_ru_RU = "Загрузка выполнена успешно.";
        this.HTML_TXT_0183_ru_RU = "Хотите удалить данные карты, загруженные из сервера?";
        this.HTML_TXT_0184_ru_RU = "Данные карты были удалены.";
        this.HTML_TXT_0185_ru_RU = "Не удалось удалить данные карты.";
        this.HTML_TXT_0186_ru_RU = "Загрузка будет отменена.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_ru_RU = "[Важная информация]<br/>Невозможно запустить SUBARU STARLINK, поскольку эта версия больше не поддерживается.<br/><br/>Пожалуйста, установите на смартфоне последнюю версию SUBARU STARLINK и попробуйте запустить снова.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_ru_RU = "Ошибка распределения памяти";
        this.HTML_TXT_0190_ru_RU = "В случае прерывания передачи данных она автоматически возобновится при восстановлении связи.";
        this.HTML_TXT_0193_ru_RU = "APPS";
        this.HTML_TXT_0195_ru_RU = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_ru_RU = "Выбор региона для обновления карты";
        this.HTML_TXT_0205_A_ru_RU = "Настройка режима отображения";

        this.APP_TXT_0176_ru_RU = "Сбой загрузки.";

        this.APP_TXT_0358_ru_RU = "Лицензия"; 
        this.Car_TXT_0245_ru_RU = "Текущ. коорд.";

        this.HTML_TXT_0246_ru_RU = "Руководство пользователя";
        this.HTML_TXT_0247_ru_RU = "Обновление данных карты с помощью смартфона";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // スウェーデン語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_sv_SV = "HEM";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_sv_SV = "";
        this.HOME_006_2_sv_SV = " har löpt ut.<br />Du måste köpa funktionen för att kunna använda ";
        this.HOME_006_3_sv_SV = "";
        this.HOME_006_4_sv_SV = "";
        this.HOME_006_5_sv_SV = ".<br />Tryck på knappen Visa köpskärm för mer information.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_sv_SV = "Visa köpskärm";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_sv_SV = "Senare";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_sv_SV = "Visa inte igen";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_sv_SV = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_sv_SV = "Nerladdning misslyckades. Klicka för att försöka igen.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_sv_SV = "Anslutningshistorik ej tillgänglig";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_sv_SV = "BAKÅT";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_sv_SV = "KONFIGURERA";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_sv_SV = "Utgångsdatum";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_sv_SV = "Applikationsbild";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_sv_SV = "Applikationsdisposition";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_sv_SV = "Applikationsinformation";
        // 販売元(4Car_TXT_0082)
        this.APP_010_sv_SV = "Säljare";
        // バージョン(4Car_TXT_0084)
        this.APP_011_sv_SV = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_sv_SV = "Inställningar";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_sv_SV = "Navigationsdisplay";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_sv_SV = "Köp appalternativ";
        // 非表示(4Car_TXT_0077)
        this.APP_015_sv_SV = "Dölj";
        // 表示(4Car_TXT_0066)
        this.APP_016_sv_SV = "Visa";
        // 無料(4Car_TXT_0177)
        this.APP_017_sv_SV = "Gratis";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_sv_SV = "Köpt";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_sv_SV = "Stoppa försäljning";
        // まで(4Car_TXT_0180)
        this.APP_020_sv_SV = "Till";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_sv_SV = "Löper ut om";
        this.APP_021_2_sv_SV = "dagar";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_sv_SV = "Utgångsdatum";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_sv_SV = "Välj period";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_sv_SV = "Avbryt";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_sv_SV = "Välj inköpsperiod.<br /><br /><font color='red'>Obs!<br />Det pris som visas nedan och det faktiska överenskomna priset kan skilja sig.<br />Se till att slutföra köpet efter att ha bekräftat det överenskomna pris som visas när knappen [Köp] tryckts ned.</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_sv_SV = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_sv_SV = "Kontrollera bilnavigation";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_sv_SV = "Bekräfta vilket bilnavigationssystem som kommer att använda denna funktion. Den funktion som köpts kommer enbart att vara tillgänglig på det valda bilnavigationssystemet.";
        this.APP_028_2_sv_SV = "Meddelandet \"Tjänsten har registrerats\" kommer att visas när köpet är genomfört. Stäng inte ner programskärmen och bryt inte kommunikationen (när kommunikation pågår) med din In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_sv_SV = "Registrerad bilnavigation";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_sv_SV = "Köp";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_sv_SV = "Byt till annan bilnavigation.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_sv_SV = "Ansluten bilnavigation (senaste tid för anslutning)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_sv_SV = "Tryck på följande knapp för att gå till skärmen med applikationslistan.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_sv_SV = "Visa applikationslistan";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_sv_SV = "Tyvärr gick ditt köp inte igenom. Kontakta din Clarion-administratör.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_sv_SV = "Eftersom förfarandet tagit ovanligt lång tid kan det hända att köpet inte genomförts på rätt sätt. Vänta en stund och kontrollera om köpet genomförts på appskärmen. Vi ber om ursäkt för det besvär vi orsakat.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_sv_SV = "på";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_sv_SV = "av";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_sv_SV = "Ett fel har inträffat.<br />Vi beklagar det inträffade.<br />Försök igen senare.";
        // カーナビ未登録時文言
        this.APP_EX01_sv_SV = "Ej registrerad";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_sv_SV = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_sv_SV = "Användningsvillkor";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_sv_SV = "Inställningar";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_sv_SV = "KONFIGURERA";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_sv_SV = "BAKÅT";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_sv_SV = "Ta bort 4Car-applikationsdata.";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_sv_SV = "Inställningsdata i 4Car-applikationen har tagits bort.<br />(Tillgänglig med version 1.0.5 eller senare)<br />* När länken till In-Vehicle-Navigation är instabil kan du prova med att ta bort inställningsdata.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_sv_SV = "Ta bort alla data?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_sv_SV = "Alla data har tagits bort.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_sv_SV = "Den här funktionen är tillgänglig med version 1.0.5 eller senare.";
        //STARLINK エラー対応
        this.APP_Error_sv_SV = "Nedladdning misslyckades.";
        //STARLINK対応
        this.APP_041_sv_SV = "Uppdatera";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_sv_SV = "BAKÅT";
        //ヘッダー部文言
        this.CONFIG_002_sv_SV = "KONFIGURERA";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_sv_SV = "Applikationsdata för STARLINK kommer att raderas. ";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_sv_SV = "* Löser instabil anslutning till In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_sv_SV = "Ta bort alla data?";
        //confirmダイアログ用文言
        this.CONFIG_006_sv_SV = "Alla data har tagits bort.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_sv_SV = "Rensa applikationsdata för STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_sv_SV = "Val av region";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_sv_SV = "Välj din primära region.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_sv_SV = "* Tillhandahåller bästa upplevelsen för appar som optimerats i din region.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_sv_SV = "Användningsvillkor";
        //利用規約更新日付文言
        this.CONFIG_012_sv_SV = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_sv_SV = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_sv_SV = "日本";
        //アメリカ
        this.LOCATION_002_sv_SV = "United States";
        //カナダ
        this.LOCATION_003_sv_SV = "Canada";
        //メキシコ
        this.LOCATION_004_sv_SV = "México";
        //イギリス
        this.LOCATION_005_sv_SV = "United Kingdom";
        //フランス
        this.LOCATION_006_sv_SV = "France";
        //ドイツ
        this.LOCATION_007_sv_SV = "Deutschland";
        //オランダ
        this.LOCATION_008_sv_SV = "Nederland";
        //イタリア
        this.LOCATION_009_sv_SV = "Italia";
        //スペイン
        this.LOCATION_010_sv_SV = "España";
        //スウェーデン
        this.LOCATION_011_sv_SV = "Sverige";
        //ポーランド
        this.LOCATION_012_sv_SV = "Polska";
        //ギリシャ
        this.LOCATION_013_sv_SV = "Ελλάδα";
        //チェコ
        this.LOCATION_014_sv_SV = "Česko";
        //ロシア
        this.LOCATION_015_sv_SV = "Россия";
        //ポルトガル
        this.LOCATION_016_sv_SV = "Portugal";
        //フィンランド
        this.LOCATION_017_sv_SV = "Suomi";
        //ハンガリー
        this.LOCATION_018_sv_SV = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_sv_SV = "övriga";

        this.HTML_TXT_9999_sv_SV = "Oceania";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_sv_SV = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_sv_SV = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_sv_SV = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_sv_SV = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_sv_SV = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_sv_SV = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_sv_SV = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_sv_SV = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_sv_SV = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_sv_SV = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_sv_SV = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_sv_SV = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_sv_SV = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_sv_SV = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_sv_SV = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_sv_SV = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_sv_SV = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_sv_SV = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_sv_SV = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_sv_SV = "Uppdatera till den senaste versionen av SUBARU STARLINK -appen före användning.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_sv_SV = "En ny In-Vehicle-Navigation har installerats. <br/>Vill du överföra den befintliga licensen till den nya enheten?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_sv_SV = "Ja";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_sv_SV = "Nej";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_sv_SV = "Påminn mig senare";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_sv_SV = "[Fara!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_sv_SV = "Från och med detta skede kan licensen inte föras tillbaka till den här enheten. Vill du fortsätta?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_sv_SV = "Välj enhet att överföra licensen från";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_sv_SV = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_sv_SV = "Ansluten den: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_sv_SV = "mm/dd/åååå";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_sv_SV = "Avbryt";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_sv_SV = "Överför licensen till den nya enheten från den enhet som anslöts den %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_sv_SV = "Licensöverföringen utförd.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_sv_SV = "Licensöverföringen misslyckades.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_sv_SV = "Anslutningen till din nya In-Car Device (ID: %2) utfördes den %1.<br/>Vill du överföra den befintliga licensen till den nya enheten?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_sv_SV = "Från och med detta skede kan licensen inte överföras till denna nya In-Vehicle-Navigation (ID: %2) som anslutits den %1. Vill du fortsätta?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_sv_SV = "Följande kommer att överföras.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_sv_SV = "Föregående licensöverföring lyckades.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_sv_SV = "Välj navigeringsfunktion";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_sv_SV = "Vissa In-Vehicle-Navigation har flera navigeringsfunktioner. Välj navigering att använda.<br/><br/>*Du kan välja den navigering som används när en destination ställs in med applikationen In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_sv_SV = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_sv_SV = "Välj navigeringsfunktion";
        //月表示(1月)
        this.SL_MONTH_TXT_01_sv_SV = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_sv_SV = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_sv_SV = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_sv_SV = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_sv_SV = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_sv_SV = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_sv_SV = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_sv_SV = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_sv_SV = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_sv_SV = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_sv_SV = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_sv_SV = "";
        //日付表示形式
        this.SL_DATE_FMT_01_sv_SV = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_sv_SV = "Storlek: ";
        this.TXT_YELP_0029_sv_SV = "Ett fel inträffade. Försök igen senare.";
        this.SL_TXT_0155_sv_SV = "Ver. ";
        this.SL_TXT_0189_sv_SV = "Uppdaterad *";
        this.SL_TXT_0191_sv_SV = "Förfallodatum: ";
        this.SL_TXT_0192_sv_SV = "Inställningar för kartuppdatering";
        this.SL_TXT_0193_sv_SV = "Kartdata för In-Vehicle-Navigation kan sparas tillfälligt till din smarttelefon från kartdistributionsservern. Nästa gång du ansluter till In-Vehicle-Navigation kan du uppdatera kartan.";
        this.SL_TXT_0196_sv_SV = "Uppdateringsinstäl.";
        this.SL_TXT_0197_sv_SV = "Kontrollera automatisk uppdatering";
        this.SL_TXT_0198_sv_SV = "Mobildata";
        this.SL_TXT_0199_sv_SV = "Uppdateringsinfo.";
        this.SL_TXT_0200_sv_SV = "Hämta alla";
        this.SL_TXT_0201_sv_SV = "Nedladdad i mobilen";
        this.SL_TXT_0202_sv_SV = "Uppdatering tillgänglig";
        this.SL_TXT_0203_sv_SV = "Uppdaterad";
        this.SL_TXT_0204_sv_SV = "Karta: ";
        this.SL_TXT_0204_A_sv_SV = "Europa";
        this.SL_TXT_0205_sv_SV = "Version: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_sv_SVを利用　宣言のみ
        this.SL_TXT_0206_sv_SV = "Storlek:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_sv_SV = "Det finns inte tillräckligt med utrymme på smarttelefonen.";
        this.SL_TXT_0208_sv_SV = "Konfigurera områdesinställningarna med In-Vehicle-Navigation.";
        this.SL_TXT_0209_sv_SV = "Din MapCare-prenumeration har gått ut. Besök www.subaru-maps.com för att uppdatera prenumerationen.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_sv_SV = "Ladda ner via WiFi.\n\nNedladdningsdata är begränsad till 30 MB per region genom Mobildata.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_sv_SV = "Uppdatera karta genom att ansluta In-Vehicle-Navigation till smarttelefonen. Efter uppdatering av In-Vehicle-Navigation raderas kartdata automatiskt från smarttelefonen.";
        this.SL_TXT_0212_sv_SV = "Mobildata PÅ.\n\nDu kan ladda ner kartdata via din mobildata-anslutning. \nData är dock begränsad till 30 MB per region.\n*Datakostnader kan tillkomma.\n\nStäng AV.\nom du bara vill ladda ner via WiFi.";
        this.SL_TXT_0213_sv_SV = "Automatisk uppdatering PÅ.\n\nLadda ner\nkartdata automatiskt och spara den\npå din smarttelefon\n*Datakostnader kan tillkomma.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_sv_SV = "Anslutningen till In-Vehicle-Navigation kopplades ifrån. Försök igen efter att anslutning till In-Vehicle-Navigation har bekräftats.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_sv_SV = "Otillräckligt tillgängligt lagringsutrymme i In-Vehicle-Navigation. Försök igen efter att inställningarna för In-Vehicle-Navigation bekräftats.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_sv_SV = "Fel inträffade vid dataöverföring. Försök igen senare.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_sv_SV = "Fel inträffade när kartdata hämtades från servern. Försök igen senare.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_sv_SV = "Otillräckligt tillgängligt lagringsutrymme på smarttelefonen. Försök igen efter radering av data från din smarttelefon.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_sv_SV = "Mobildata AV.\n\nLadda ner via WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_sv_SV = "Kommunikationen med servern kopplades bort. Försök igen när kommunikationen har upprättats igen.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_sv_SVを利用　宣言のみ
        this.SL_TXT_0221_sv_SV = "Storlek: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_sv_SV = "OK";
        this.HTML_TXT_0068_sv_SV = "Se till att smarttelefonen inte går in i viloläge medan kartdata laddas ner.\nOm smarttelefonen går in i viloläge, starta SUBARU STARLINK-appen igen.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_sv_SV = "Uppdateringen av kartan kan inte startas. Kontrollera statusen hos In-Vehicle-Navigation.";
        this.HTML_TXT_0165_sv_SV = "Inställningsfunktion för kartuppdatering";
        this.HTML_TXT_0166_sv_SV = "1. Hämta kartdata från servern till smarttelefonen.<br><br>2. När smarttelefonen ansluts till In-Vehicle-Navigation överförs kartdata till In-Vehicle-Navigation. Kartdata raderas från smarttelefonen efter överföring.";
        this.HTML_TXT_0167_sv_SV = "* När smarttelefonen ansluts till flera In-Vehicle-Navigations visar kartuppdateringsinformationen data för den senast anslutna In-Vehicle-Navigation.";
        this.HTML_TXT_0168_sv_SV = "Automatiskt val av region";
        this.HTML_TXT_0169_sv_SV = "Kontrollera om det finns uppdateringar";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_sv_SV = "Att trycka på knappen Avbryt stoppar åtkomsten till servern.";
        this.HTML_TXT_0171_sv_SV = "Starta uppdateringen";
        this.HTML_TXT_0172_sv_SV = "Kapaciteten för smarttelefonen är inte tillräcklig. Radera lite data på smarttelefonen och försök igen.";
        this.HTML_TXT_0173_sv_SV = "Tryck på * om du vill avbryta nedladdningen av kartdata från servern.";
        this.HTML_TXT_0174_sv_SV = "Tryck på knappen Avbryt för att avbryta sökningen.";
        this.HTML_TXT_0175_sv_SV = "Regionen från den aktuella platsen till den specificerade destinationen är markerad.";
        this.HTML_TXT_0176_sv_SV = "Kartdata överförs till In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_sv_SV = "* Installation av kartdata slutförd";
        this.HTML_TXT_0178_sv_SV = "Det finns inte några sökresultat. Försök igen.";
        this.HTML_TXT_0179_sv_SV = "Sökpunkten är samma som den aktuella platsen.";
        this.HTML_TXT_0180_sv_SV = "Välj det område som du vill uppdatera på kartan.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_sv_SV = "Att trycka på knappen Avbryt stoppar åtkomsten till servern.";
        this.HTML_TXT_0182_sv_SV = "Nedladdningen lyckades.";
        this.HTML_TXT_0183_sv_SV = "Vill du radera kartdata som hämtats från servern?";
        this.HTML_TXT_0184_sv_SV = "Kartdata har raderats.";
        this.HTML_TXT_0185_sv_SV = "Kunde inte radera kartdata.";
        this.HTML_TXT_0186_sv_SV = "Nedladdningen avbryts.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_sv_SV = "[Viktig information]<br/>SUBARU STARLINK kan inte startas eftersom det inte längre finns stöd för denna version.<br/><br/>Vänligen installera den senaste versionen av SUBARU STARLINK på din smartphone och försök starta igen.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_sv_SV = "Minnesallokeringsfel";
        this.HTML_TXT_0190_sv_SV = "Om dataöverföringen avbryts återupptas den automatiskt när anslutningen upprättas igen.";
        this.HTML_TXT_0193_sv_SV = "APPS";
        this.HTML_TXT_0195_sv_SV = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_sv_SV = "Regionval för kartuppdatering";
        this.HTML_TXT_0205_A_sv_SV = "Displaylägesinställning";

        this.APP_TXT_0176_sv_SV = "Nedladdningen misslyckades.";

        this.APP_TXT_0358_sv_SV = "Licens"; 
        this.Car_TXT_0245_sv_SV = "Aktuell ort";

        this.HTML_TXT_0246_sv_SV = "Användarmanual";
        this.HTML_TXT_0247_sv_SV = "Uppdatera kartdata med en smarttelefon";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // オランダ語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_nl_NL = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_nl_NL = "";
        this.HOME_006_2_nl_NL = " is verlopen.<br />U moet de functie kopen om ";
        this.HOME_006_3_nl_NL = "";
        this.HOME_006_4_nl_NL = "";
        this.HOME_006_5_nl_NL = "verder te kunnen gebruiken.<br />Raak de knop Aankoopscherm weergeven aan voor meer informatie.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_nl_NL = "Aankoopscherm weergeven";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_nl_NL = "Later";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_nl_NL = "Niet nogmaals weergeven";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_nl_NL = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_nl_NL = "Download mislukt. Klik en probeer het opnieuw.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_nl_NL = "Verbindingshistoriek niet beschikbaar";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_nl_NL = "TERUG";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_nl_NL = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_nl_NL = "Verloopt op";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_nl_NL = "Applicatiebeeld";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_nl_NL = "Applicatieoverzicht";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_nl_NL = "Applicatiegegevens";
        // 販売元(4Car_TXT_0082)
        this.APP_010_nl_NL = "Verkoper";
        // バージョン(4Car_TXT_0084)
        this.APP_011_nl_NL = "Versie";
        // 設定(4Car_TXT_0085)
        this.APP_012_nl_NL = "Instellingen";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_nl_NL = "Navigatiescherm";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_nl_NL = "App-item kopen";
        // 非表示(4Car_TXT_0077)
        this.APP_015_nl_NL = "Verbergen";
        // 表示(4Car_TXT_0066)
        this.APP_016_nl_NL = "Weergeven";
        // 無料(4Car_TXT_0177)
        this.APP_017_nl_NL = "Gratis";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_nl_NL = "Gekocht";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_nl_NL = "Verkoop stopzetten";
        // まで(4Car_TXT_0180)
        this.APP_020_nl_NL = "Tot";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_nl_NL = "Verloopt binnen";
        this.APP_021_2_nl_NL = "dagen";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_nl_NL = "Verloopt op";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_nl_NL = "Periode selecteren";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_nl_NL = "Annuleren";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_nl_NL = "Kies de aankoopperiode.<br /><br /><font color='red'>Opmerking<br />De hierna getoonde prijs en de effectieve afrekeningsprijs kunnen verschillen.<br />Voltooi de aankoop nadat u de afrekeningsprijs heeft bevestigd die wordt aangegeven wanneer op de knop [Kopen] wordt gedrukt.</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_nl_NL = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_nl_NL = "Voertuignavigatie controleren";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_nl_NL = "Controleer het autonavigatiesysteem dat deze functie zal gebruiken. De aangekochte functie is alleen beschikbaar voor het geselecteerde autonavigatiesysteem.";
        this.APP_028_2_nl_NL = "Het bericht \"De dienst werd met succes geregistreerd\" verschijnt wanneer de aankoop voltooid is. Gelieve het applicatiescherm niet te sluiten of de communicatie (wanneer er communicatie is) met het In-Vehicle-Navigation te beëindigen.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_nl_NL = "Geregistreerde voertuignavigatie";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_nl_NL = "Kopen";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_nl_NL = "Andere voertuignavigatie kiezen";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_nl_NL = "Verbonden voertuignavigatie (laatst verbonden)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_nl_NL = "Druk op de onderstaande knop om naar het scherm met de applicatielijst te gaan.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_nl_NL = "De applicatielijst weergeven";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_nl_NL = "De aankoop is mislukt. Onze excuses hiervoor. Neem contact op met uw Clarion-beheerder.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_nl_NL = "Gezien de verwerking enorm veel tijd in beslag neemt, is het mogelijk dat de aankoop niet correct is voltooid. Wacht enkele ogenblikken en bevestig dan of de aankoop op het applicatiescherm is voltooid. Onze excuses voor het ongemak.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_nl_NL = "aan";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_nl_NL = "uit";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_nl_NL = "Er is een fout opgetreden. <br />Onze excuses voor het ongemak. <br />Probeer het later opnieuw.";
        // カーナビ未登録時文言
        this.APP_EX01_nl_NL = "Niet geregistreerd";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_nl_NL = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_nl_NL = "Gebruiksvoorwaarden";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_nl_NL = "Instellingen";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_nl_NL = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_nl_NL = "TERUG";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_nl_NL = "De 4Car-applicatiegegevens wissen";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_nl_NL = "De instelgegevens in de 4Car-applicatie zijn gewist. <br />(Beschikbaar bij versie 1.0.5 of hoger)<br />* Probeer de instelgegevens te wissen in geval van een onstabiele verbinding met het apparaat in de wagen.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_nl_NL = "Alle gegevens wissen?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_nl_NL = "Alle gegevens zijn gewist.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_nl_NL = "Deze functie is beschikbaar bij versie 1.0.5 of hoger.";
        //STARLINK エラー対応
        this.APP_Error_nl_NL = "Downloaden mislukt.";
        ////STARLINK対応
        this.APP_041_nl_NL = "Update";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_nl_NL = "TERUG";
        //ヘッダー部文言
        this.CONFIG_002_nl_NL = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_nl_NL = "De STARLINK-applicatiegegevens worden gewist. ";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_nl_NL = "* Risolve la connessione instabile con In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_nl_NL = "Alle gegevens wissen?";
        //confirmダイアログ用文言
        this.CONFIG_006_nl_NL = "Alle gegevens zijn gewist.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_nl_NL = "STARLINK-applicatiegegevens wissen";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_nl_NL = "Regioselectie";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_nl_NL = "Selecteer uw primaire regio.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_nl_NL = "* Dit biedt de beste ervaring voor applicaties die geoptimaliseerd zijn in uw regio.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_nl_NL = "Gebruiksvoorwaarden";
        //利用規約更新日付文言
        this.CONFIG_012_nl_NL = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_nl_NL = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_nl_NL = "日本";
        //アメリカ
        this.LOCATION_002_nl_NL = "United States";
        //カナダ
        this.LOCATION_003_nl_NL = "Canada";
        //メキシコ
        this.LOCATION_004_nl_NL = "México";
        //イギリス
        this.LOCATION_005_nl_NL = "United Kingdom";
        //フランス
        this.LOCATION_006_nl_NL = "France";
        //ドイツ
        this.LOCATION_007_nl_NL = "Deutschland";
        //オランダ
        this.LOCATION_008_nl_NL = "Nederland";
        //イタリア
        this.LOCATION_009_nl_NL = "Italia";
        //スペイン
        this.LOCATION_010_nl_NL = "España";
        //スウェーデン
        this.LOCATION_011_nl_NL = "Sverige";
        //ポーランド
        this.LOCATION_012_nl_NL = "Polska";
        //ギリシャ
        this.LOCATION_013_nl_NL = "Ελλάδα";
        //チェコ
        this.LOCATION_014_nl_NL = "Česko";
        //ロシア
        this.LOCATION_015_nl_NL = "Россия";
        //ポルトガル
        this.LOCATION_016_nl_NL = "Portugal";
        //フィンランド
        this.LOCATION_017_nl_NL = "Suomi";
        //ハンガリー
        this.LOCATION_018_nl_NL = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_nl_NL = "overige";

        this.HTML_TXT_9999_nl_NL = "Oceanië";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_nl_NL = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_nl_NL = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_nl_NL = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_nl_NL = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_nl_NL = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_nl_NL = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_nl_NL = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_nl_NL = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_nl_NL = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_nl_NL = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_nl_NL = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_nl_NL = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_nl_NL = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_nl_NL = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_nl_NL = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_nl_NL = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_nl_NL = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_nl_NL = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_nl_NL = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_nl_NL = "Update naar de nieuwste versie van de applicatie SUBARU STARLINK vóór gebruik.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_nl_NL = "Er werd een nieuw In-Vehicle-Navigation geïnstalleerd.<br/>Wenst u de bestaande licentie naar het nieuwe over te dragen?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_nl_NL = "Ja";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_nl_NL = "Nee";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_nl_NL = "Help mij herinneren";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_nl_NL = "[Let op!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_nl_NL = "Hierna kan uw licentie niet naar dit apparaat terug worden overgedragen. Wilt u doorgaan?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_nl_NL = "Selecteer het apparaat van waaraf de licentie wordt overgedragen";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_nl_NL = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_nl_NL = "Verbindingsdatum: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_nl_NL = "mm/dd/jjjj";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_nl_NL = "Annuleren";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_nl_NL = "De licentie naar het nieuwe apparaat overdragen vanaf het apparaat dat op %1 verbonden werd.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_nl_NL = "De licentieoverdracht is geslaagd.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_nl_NL = "De licentieoverdracht is mislukt.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_nl_NL = "De verbinding met uw nieuwe In-Vehicle-Navigation (ID: %2) werd op %1 tot stand gebracht.<br/>Wenst u de bestaande licentie naar het nieuwe over te dragen?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_nl_NL = "Hierna kan de licentie niet worden overgedragen naar dit nieuwe In-Vehicle-Navigation (ID: %2) dat op %1 werd verbonden. Wilt u doorgaan?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_nl_NL = "Het volgende wordt overgedragen.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_nl_NL = "De vorige licentieoverdracht is geslaagd.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_nl_NL = "Navigatiefunctie selecteren";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_nl_NL = "Sommige In-Vehicle-Navigation beschikken over meerdere navigatiefuncties. Selecteer de navigatie die u wilt gebruiken.<br/><br/>*U kunt de navigatie selecteren die gebruikt wordt wanneer u een bestemming met behulp van de applicatie van de In-Vehicle-Navigation instelt.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_nl_NL = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_nl_NL = "Navigatiefunctie selecteren";
        //月表示(1月)
        this.SL_MONTH_TXT_01_nl_NL = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_nl_NL = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_nl_NL = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_nl_NL = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_nl_NL = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_nl_NL = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_nl_NL = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_nl_NL = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_nl_NL = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_nl_NL = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_nl_NL = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_nl_NL = "";
        //日付表示形式
        this.SL_DATE_FMT_01_nl_NL = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_nl_NL = "Grootte: ";
        this.TXT_YELP_0029_nl_NL = "Fout opgetreden.Probeer het later opnieuw.";
        this.SL_TXT_0155_nl_NL = "Ver. ";
        this.SL_TXT_0189_nl_NL = "Bijgewerkt op *";
        this.SL_TXT_0191_nl_NL = "Verloopdatum: ";
        this.SL_TXT_0192_nl_NL = "Kaartupdate-instellingen";
        this.SL_TXT_0193_nl_NL = "De kaartgegevens voor de In-Vehicle-Navigation kunnen tijdelijk op uw smartphone worden opgeslagen vanaf de kaartdistributieserver. De volgende keer dat u met de In-Vehicle-Navigation een verbinding tot stand brengt, kunt u de kaart bijwerken.";
        this.SL_TXT_0196_nl_NL = "Update-instellingen";
        this.SL_TXT_0197_nl_NL = "Controle van automatische update";
        this.SL_TXT_0198_nl_NL = "Mobiel";
        this.SL_TXT_0199_nl_NL = "Update-informatie";
        this.SL_TXT_0200_nl_NL = "Alles downloaden";
        this.SL_TXT_0201_nl_NL = "Gedownload in mobiel";
        this.SL_TXT_0202_nl_NL = "Update beschikbaar";
        this.SL_TXT_0203_nl_NL = "Bijgewerkt";
        this.SL_TXT_0204_nl_NL = "Kaart: ";
        this.SL_TXT_0204_A_nl_NL = "Europa";
        this.SL_TXT_0205_nl_NL = "Versie: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_nl_NLを利用　宣言のみ
        this.SL_TXT_0206_nl_NL = "Grootte:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_nl_NL = "Er is onvoldoende ruimte beschikbaar op de smartphone.";
        this.SL_TXT_0208_nl_NL = "Configureer de regio-instellingen met behulp van de In-Vehicle-Navigation.";
        this.SL_TXT_0209_nl_NL = "Uw MapCare-abonnement is verlopen.\nGa naar www.subaru-maps.com om\nuw abonnement bij te werken.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_nl_NL = "Download via WiFi.\n\nDe downloadlimiet is 30 MB per regio via mobiele data.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_nl_NL = "Werk de kaart bij door de In-Vehicle-Navigation met de smartphone te verbinden. Na bijwerking van de In-Vehicle-Navigation, worden de kaartgegevens automatisch van de smartphone gewist.";
        this.SL_TXT_0212_nl_NL = "Mobiele data AAN.\n\nU kunt kaartgegevens downloaden via uw mobiele dataverbinding. \nDe datalimiet is echter 30 MB per regio.\n*Datakosten kunnen in rekening worden gebracht.\n\nSchakel UIT.\nals u alleen wilt downloaden via WiFi.";
        this.SL_TXT_0213_nl_NL = "Automatische update AAN.\n\nDownload automatisch\nkaartgegevens en sla ze op\nop uw smartphone\n*Datakosten kunnen in rekening worden gebracht.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_nl_NL = "De verbinding met de In-Vehicle-Navigation is verbroken. Probeer het opnieuw na bevestiging van de verbinding met de In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_nl_NL = "Onvoldoende In-Vehicle-Navigation-opslag beschikbaar. Probeer het opnieuw na bevestiging van de In-Vehicle-Navigation-instellingen.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_nl_NL = "Er is een fout opgetreden tijdens de gegevensoverdracht. Probeer het later opnieuw.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_nl_NL = "Er is een fout opgetreden tijdens het downloaden van de kaartgegevens vanaf de server. Probeer het later opnieuw.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_nl_NL = "Onvoldoende smartphone-opslag beschikbaar. Probeer het opnieuw nadat u gegevens van uw smartphone heeft gewist.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_nl_NL = "Mobiele data UIT.\n\nDownload via WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_nl_NL = "De communicatie met de server werd verbroken. Probeer het opnieuw nadat de verbinding is hersteld.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_nl_NLを利用　宣言のみ
        this.SL_TXT_0221_nl_NL = "Grootte: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_nl_NL = "OK";
        this.HTML_TXT_0068_nl_NL = "Zorg dat de smartphone niet in slaapmodus gaat terwijl u kaartgegevens downloadt.\nStart de SUBARU STARLINK-app opnieuw als de smartphone in slaapmodus gaat.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_nl_NL = "De kaartupdate kan niet worden gestart. Controleer de status van de In-Vehicle-Navigation.";
        this.HTML_TXT_0165_nl_NL = "Kaartupdate instellingsfunctie";
        this.HTML_TXT_0166_nl_NL = "1. Download de kaartgegevens van de server naar de smartphone.<br><br>2. Als u de smartphone verbindt met het In-Vehicle-Navigation, worden de kaartgegevens overgebracht naar het In-Vehicle-Navigation. De kaartgegevens worden van de smartphone verwijderd na de overdracht.";
        this.HTML_TXT_0167_nl_NL = "* Als de smartphone met meerdere In-Vehicle-Navigations verbonden is, geeft de kaartupdate de gegevens weer van het meest recent verbonden In-Vehicle-Navigation.";
        this.HTML_TXT_0168_nl_NL = "Automatische selectie regio";
        this.HTML_TXT_0169_nl_NL = "Controleer op updates";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_nl_NL = "Als u op de Annuleren-knop drukt, wordt de verbinding met de server verbroken.";
        this.HTML_TXT_0171_nl_NL = "Start update";
        this.HTML_TXT_0172_nl_NL = "De smartphone heeft onvoldoende geheugen. Verwijder gegevens op de smartphone en probeer het opnieuw.";
        this.HTML_TXT_0173_nl_NL = "Tik op * als u het downloaden van kaartgegevens van de server wilt annuleren.";
        this.HTML_TXT_0174_nl_NL = "Druk op de Annuleren-knop om de zoekactie te annuleren.";
        this.HTML_TXT_0175_nl_NL = "Het traject vanaf de huidige locatie tot de opgegeven locatie is geselecteerd.";
        this.HTML_TXT_0176_nl_NL = "De kaartgegevens worden overgebracht naar het In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_nl_NL = "* Installatie kaartgegevens voltooid";
        this.HTML_TXT_0178_nl_NL = "Er zijn geen zoekresultaten. Probeer het opnieuw.";
        this.HTML_TXT_0179_nl_NL = "Het zoekpunt is hetzelfde als de huidige locatie.";
        this.HTML_TXT_0180_nl_NL = "Selecteer het gebied dat u wilt bijwerken op de kaart.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_nl_NL = "De Annuleren-knop indrukken stopt de toegang tot de server.";
        this.HTML_TXT_0182_nl_NL = "Download geslaagd.";
        this.HTML_TXT_0183_nl_NL = "Wilt u de gedownloade kaartgegevens verwijderen van de server?";
        this.HTML_TXT_0184_nl_NL = "Kaartgegevens zijn verwijderd.";
        this.HTML_TXT_0185_nl_NL = "Kon de kaartgegevens niet verwijderen.";
        this.HTML_TXT_0186_nl_NL = "Het downloaden wordt geannuleerd.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_nl_NL = "[Belangrijke kennisgeving]<br/>SUBARU STARLINK kan niet worden gestart aangezien deze versie niet langer wordt ondersteund.<br/><br/>Installeer de meest recente versie van SUBARU STARLINK op uw smartphone probeer opnieuw te starten.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_nl_NL = "Fout in geheugentoewijzing";
        this.HTML_TXT_0190_nl_NL = "Als de gegevensoverdracht wordt onderbroken, zal deze automatisch worden hervat zodra de verbinding is hersteld.";
        this.HTML_TXT_0193_nl_NL = "APPS";
        this.HTML_TXT_0195_nl_NL = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_nl_NL = "Selectie kaartupdateregio";
        this.HTML_TXT_0205_A_nl_NL = "Weergave modus instelling";

        this.APP_TXT_0176_nl_NL = "Download mislukt.";

        this.APP_TXT_0358_nl_NL = "Licentie"; 
        this.Car_TXT_0245_nl_NL = "Huidige pos.";

        this.HTML_TXT_0246_nl_NL = "Gebruikershandleiding";
        this.HTML_TXT_0247_nl_NL = "De kaartgegevens met behulp van een smartphone bijwerken";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // ポーランド語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_pl_PL = "DOM";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_pl_PL = "Funkcja";
        this.HOME_006_2_pl_PL = " wygasła.<br />Aby korzystać z funkcji";
        this.HOME_006_3_pl_PL = "";
        this.HOME_006_4_pl_PL = "";
        this.HOME_006_5_pl_PL = ", musisz ją wykupić.<br />Aby dowiedzieć się więcej, dotknij przycisku „Wyświetl ekran zakupu”.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_pl_PL = "Wyświetl ekran zakupu";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_pl_PL = "Później";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_pl_PL = "Nie pokazuj ponownie";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_pl_PL = "APLIKACJA";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_pl_PL = "Pobieranie nieudane. Kliknij, aby spróbować ponownie.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_pl_PL = "Historia łączenia niedostępna";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_pl_PL = "WSTECZ";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_pl_PL = "KONFIGURACJA";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_pl_PL = "Wygasa";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_pl_PL = "Obraz aplikacji";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_pl_PL = "Zarys aplikacji";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_pl_PL = "Informacje o aplikacji";
        // 販売元(4Car_TXT_0082)
        this.APP_010_pl_PL = "Sprzedający";
        // バージョン(4Car_TXT_0084)
        this.APP_011_pl_PL = "Wersja";
        // 設定(4Car_TXT_0085)
        this.APP_012_pl_PL = "Ustawienia";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_pl_PL = "Ekran nawigacji";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_pl_PL = "Kup element aplikacji";
        // 非表示(4Car_TXT_0077)
        this.APP_015_pl_PL = "Ukryj";
        // 表示(4Car_TXT_0066)
        this.APP_016_pl_PL = "Wyświetl";
        // 無料(4Car_TXT_0177)
        this.APP_017_pl_PL = "Bezpłatne";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_pl_PL = "Wykupione";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_pl_PL = "Przerwij sprzedaż";
        // まで(4Car_TXT_0180)
        this.APP_020_pl_PL = "Do";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_pl_PL = "Wygasa za";
        this.APP_021_2_pl_PL = "dni";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_pl_PL = "Wygasa";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_pl_PL = "Wybierz okres";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_pl_PL = "Anuluj";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_pl_PL = "Wybierz okres, który chcesz wykupić.<br /><br /><font color='red'>Uwaga<br />Poniższa cena i rzeczywista cena ostateczna mogą się różnić.<br />Zakup należy dokończyć po potwierdzeniu ceny ostatecznej wyświetlanej po naciśnięciu przycisku [Kup].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_pl_PL = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_pl_PL = "Sprawdź nawigację samochodową";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_pl_PL = "Sprawdź system nawigacji samochodowej, który będzie korzystać z tej funkcji. Zakupiona funkcja będzie dostępna wyłącznie w wybranym systemie nawigacji samochodowej.";
        this.APP_028_2_pl_PL = "Komunikat \"Usługa została pomyślnie zarejestrowana\" pojawi się po zakończeniu zakupu. Nie należy wyłączać ekranu aplikacji lub odłączać komunikacji (w przypadku połączenia) z urządzeniem In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_pl_PL = "Zarejestrowana nawigacja samochodowa";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_pl_PL = "Kup";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_pl_PL = "Zmień na inną nawigację samochodową.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_pl_PL = "Podłączona nawigacja samochodowa (z ostatniego połączenia)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_pl_PL = "Naciśnij następujący przycisk, aby przejść do ekranu z listą aplikacji.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_pl_PL = "Wyświetl listę aplikacji ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_pl_PL = "Z przykrością informujemy, że zakup się nie powiódł. Skontaktuj się z administratorem usług Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_pl_PL = "Zakup mógł nie zostać prawidłowo ukończony z powodu nietypowego czasu trwania procesu. Odczekaj chwilę i sprawdź, czy zakup został ukończony na ekranie aplikacji. Przepraszamy za wszelkie niedogodności.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_pl_PL = "wł.";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_pl_PL = "wył.";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_pl_PL = "Wystąpił błąd.<br />Przepraszamy za niedogodności.<br />Spróbuj ponownie później.";
        // カーナビ未登録時文言
        this.APP_EX01_pl_PL = "Nie zarejestrowano";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_pl_PL = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_pl_PL = "Warunki korzystania";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_pl_PL = "Ustawienia";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_pl_PL = "KONFIGURACJA";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_pl_PL = "WSTECZ";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_pl_PL = "Usuń dane aplikacji 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_pl_PL = "Dane ustawień w aplikacji 4Car zostały usunięte.<br />(Dostępne w wersji 1.0.5 lub nowszej)<br />* Gdy łącze z urządzeniem w samochodzie jest niestabilne, spróbuj usunąć dane ustawień.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_pl_PL = "Usunąć wszystkie dane?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_pl_PL = "Wszystkie dane zostały usunięte.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_pl_PL = "Ta funkcja jest dostępna w wersji 1.0.5 lub nowszej.";
        //STARLINK エラー対応
        this.APP_Error_pl_PL = "Pobieranie nie powiodło się.";
        ////STARLINK対応
        this.APP_041_pl_PL = "Aktualizuj";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_pl_PL = "WSTECZ";
        //ヘッダー部文言
        this.CONFIG_002_pl_PL = "KONFIGURACJA";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_pl_PL = "Dane ustawień w aplikacji STARLINK zostały usunięte.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_pl_PL = "* Gdy łącze z urządzeniem w samochodzie jest niestabilne, spróbuj usunąć dane ustawień.";
        //confirmダイアログ用文言
        this.CONFIG_005_pl_PL = "Usunąć wszystkie dane?";
        //confirmダイアログ用文言
        this.CONFIG_006_pl_PL = "Wszystkie dane zostały usunięte.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_pl_PL = "Usuń dane aplikacji STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_pl_PL = "Wybór regionu";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_pl_PL = "Wybierz główny region, który będzie obsługiwany";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_pl_PL = "* Ten wybór ułatwi dostarczenie aplikacji zoptymalizowanej do wybranego regionu.";
        //利用規約更新日付文言
        this.CONFIG_012_pl_PL = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_pl_PL = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_pl_PL = "日本";
        //アメリカ
        this.LOCATION_002_pl_PL = "United States";
        //カナダ
        this.LOCATION_003_pl_PL = "Canada";
        //メキシコ
        this.LOCATION_004_pl_PL = "México";
        //イギリス
        this.LOCATION_005_pl_PL = "United Kingdom";
        //フランス
        this.LOCATION_006_pl_PL = "France";
        //ドイツ
        this.LOCATION_007_pl_PL = "Deutschland";
        //オランダ
        this.LOCATION_008_pl_PL = "Nederland";
        //イタリア
        this.LOCATION_009_pl_PL = "Italia";
        //スペイン
        this.LOCATION_010_pl_PL = "España";
        //スウェーデン
        this.LOCATION_011_pl_PL = "Sverige";
        //ポーランド
        this.LOCATION_012_pl_PL = "Polska";
        //ギリシャ
        this.LOCATION_013_pl_PL = "Ελλάδα";
        //チェコ
        this.LOCATION_014_pl_PL = "Česko";
        //ロシア
        this.LOCATION_015_pl_PL = "Россия";
        //ポルトガル
        this.LOCATION_016_pl_PL = "Portugal";
        //フィンランド
        this.LOCATION_017_pl_PL = "Suomi";
        //ハンガリー
        this.LOCATION_018_pl_PL = "Magyarország";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_pl_PL = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_pl_PL = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_pl_PL = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_pl_PL = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_pl_PL = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_pl_PL = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_pl_PL = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_pl_PL = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_pl_PL = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_pl_PL = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_pl_PL = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_pl_PL = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_pl_PL = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_pl_PL = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_pl_PL = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_pl_PL = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_pl_PL = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_pl_PL = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_pl_PL = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_pl_PL = "Przed rozpoczęciem używania zaktualizuj aplikację SUBARU STARLINK do najnowszej wersji.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_pl_PL = "Nowe urządzenie In-Vehicle-Navigation zostało zainstalowane. <br/>Czy przenieść istniejącą licencję do nowego urządzenia?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_pl_PL = "Tak.";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_pl_PL = "Nie";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_pl_PL = "Przypomnij później";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_pl_PL = "[Ostrzeżenie!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_pl_PL = "Od teraz twojej licencji nie będzie można przenieść z powrotem do tego urządzenia. Czy kontynuować?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_pl_PL = "Wybierz urządzenie, z którego zostanie przeniesiona licencja";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_pl_PL = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_pl_PL = "Data połączenia: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_pl_PL = "mm/dd/rrrr";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_pl_PL = "Anuluj";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_pl_PL = "Przenieś licencję do nowego urządzenia podłączonego dnia %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_pl_PL = "Pomyślnie przeniesiono licencję.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_pl_PL = "Błąd przenoszenia licencji.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_pl_PL = "Połączenie z nowym urządzeniem In-Car Device (ID: %2) zostało wykonane %1.<br/>Czy przenieść istniejącą licencję do nowego urządzenia?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_pl_PL = "Od teraz licencji nie można przenieść do tego nowego urządzenia In-Vehicle-Navigation (ID: %2) podłączonego %1. Czy kontynuować?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_pl_PL = "Następująca licencja zostanie przeniesiona.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_pl_PL = "Przesyłanie poprzedniej licencji zakończyło się pomyślnie.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_pl_PL = "Navigation";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_pl_PL = "There are several navigation apps that can be used in the In-Vehicle-Navigation.<br />Please select a navigation app in the In-Vehicle-Navigation.<br /><br />You can select a navigation of when ran app setting destination at In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_pl_PL = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_pl_PL = "Navigation";
        //月表示(1月)
        this.SL_MONTH_TXT_01_pl_PL = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_pl_PL = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_pl_PL = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_pl_PL = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_pl_PL = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_pl_PL = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_pl_PL = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_pl_PL = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_pl_PL = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_pl_PL = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_pl_PL = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_pl_PL = "";
        //日付表示形式
        this.SL_DATE_FMT_01_pl_PL = "d.MM.yyyy";
        // SL_TXT_0155
        this.SL_TXT_0155_pl_PL = "Ver. ";
        // SL_TXT_0189
        this.SL_TXT_0189_pl_PL = "Updated *";

        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_pl_PL = "OK";
        this.HTML_TXT_0189_pl_PL = "Błąd alokacji pamięci";
        this.HTML_TXT_0193_pl_PL = "APPS";

        this.APP_TXT_0176_pl_PL = "Pobieranie nie powiodło się.";
        this.TXT_YELP_0029_pl_PL = "Błąd.Spróbuj ponownie później.";
        ////////////////////////////////////////////////////////////////
        // ギリシャ語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_el_EL = "ΑΡΧΙΚΗ";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_el_EL = "Το ";
        this.HOME_006_2_el_EL = " έληξε.<br />Πρέπει να αγοράσετε τη λειτουργία για να χρησιμοποιήσετε το ";
        this.HOME_006_3_el_EL = "";
        this.HOME_006_4_el_EL = "";
        this.HOME_006_5_el_EL = ".<br />Για λεπτομέρειες, πατήστε το κουμπί Εμφάνιση οθόνης αγοράς.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_el_EL = "Εμφάνιση οθόνης αγοράς";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_el_EL = "Αργότερα";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_el_EL = "Να μην εμφανιστεί ξανά";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_el_EL = "ΕΦΑΡΜΟΓΗ";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_el_EL = "Αποτυχία λήψης. Κάντε κλικ για επανάληψη.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_el_EL = "Το ιστορικό σύνδεσης δεν είναι διαθέσιμο";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_el_EL = "BACK";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_el_EL = "ΔΙΑΜΟΡΦΩΣΗ";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_el_EL = "Λήξη";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_el_EL = "Εικόνα εφαρμογής";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_el_EL = "Περιγραφή εφαρμογής";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_el_EL = "Πληροφορίες εφαρμογής";
        // 販売元(4Car_TXT_0082)
        this.APP_010_el_EL = "Μεταπωλητής";
        // バージョン(4Car_TXT_0084)
        this.APP_011_el_EL = "Έκδοση";
        // 設定(4Car_TXT_0085)
        this.APP_012_el_EL = "Ρυθμίσεις";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_el_EL = "Προβολή πλοήγησης";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_el_EL = "Αγορά στοιχείου εφαρμογής";
        // 非表示(4Car_TXT_0077)
        this.APP_015_el_EL = "Απόκρυψη";
        // 表示(4Car_TXT_0066)
        this.APP_016_el_EL = "Εμφάνιση";
        // 無料(4Car_TXT_0177)
        this.APP_017_el_EL = "Δωρεάν";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_el_EL = "Αγορασμένο";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_el_EL = "Διακοπή αγοράς";
        // まで(4Car_TXT_0180)
        this.APP_020_el_EL = "Προς";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_el_EL = "Λήγει σε";
        this.APP_021_2_el_EL = "ημέρες";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_el_EL = "Λήξη";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_el_EL = "Επιλογή περιόδου";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_el_EL = "Άκυρο";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_el_EL = "Επιλέξτε την περίοδο για αγορά.<br /><br /><font color='red'>Σημείωση<br />Η τιμή που εμφανίζεται παρακάτω ίσως διαφέρει από την πραγματική τιμή αγοράς.<br />Φροντίστε να ολοκληρώσετε την αγορά αφού επιβεβαιώσετε την τιμή αγοράς που εμφανίζεται μόλις πατήσετε το κουμπί [Αγορά].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_el_EL = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_el_EL = "Έλεγχος πλοηγού αυτοκινήτου";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_el_EL = "Επαληθεύστε το σύστημα πλοήγησης αυτοκινήτου που θα χρησιμοποιεί αυτήν τη δυνατότητα. Η δυνατότητα που αγοράσατε θα είναι διαθέσιμη μόνο στο επιλεγμένο σύστημα πλοήγησης αυτοκινήτου.";
        this.APP_028_2_el_EL = "Το μήνυμα \"Η εγγραφή της υπηρεσίας ολοκληρώθηκε με επιτυχία\" θα εμφανιστεί μόλις ολοκληρωθεί η αγορά. Μην κλείσετε την οθόνη της εφαρμογής και μην τερματίσετε την επικοινωνία (εάν υπάρχει) με το In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_el_EL = "Καταχωρημένος πλοηγός αυτοκινήτου";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_el_EL = "Αγορά";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_el_EL = "Αλλαγή σε άλλο πλοηγό αυτοκινήτου.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_el_EL = "Συνδεδεμένος πλοηγός (τελευταία σύνδεση)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_el_EL = "Πιέστε το παρακάτω κουμπί για να μεταβείτε στην οθόνη λίστας εφαρμογών.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_el_EL = "Εμφάνιση της λίστας εφαρμογών ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_el_EL = "Η αγορά απέτυχε. Λυπούμαστε για την ταλαιπωρία. Επικοινωνήστε με το διαχειριστή της Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_el_EL = "Η αγορά μπορεί να μην ολοκληρώθηκε σωστά καθώς η διαδικασία διήρκησε ασυνήθιστα πολλή ώρα. Περιμένετε λίγο και ελέγξτε στην οθόνη της εφαρμογής αν ολοκληρώθηκε η αγορά. Λυπούμαστε για την ταλαιπωρία.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_el_EL = "ενεργοποίηση";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_el_EL = "απενεργοποίηση";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_el_EL = "Παρουσιάστηκε σφάλμα.<br />Λυπούμαστε για την αναστάτωση.<br />Δοκιμάστε πάλι αργότερα.";
        // カーナビ未登録時文言
        this.APP_EX01_el_EL = "Δεν καταχωρήθηκε";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_el_EL = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_el_EL = "Όροι και προϋποθέσεις χρήσης";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_el_EL = "Ρυθμίσεις";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_el_EL = "ΔΙΑΜΟΡΦΩΣΗ";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_el_EL = "BACK";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_el_EL = "Διαγραφή δεδομένων της εφαρμογής 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_el_EL = "Τα δεδομένα ρύθμισης στην εφαρμογή 4Car διαγράφηκαν.<br />(Διαθέσιμη με την έκδοση 1.0.5 ή νεότερη έκδοση)<br />* Αν η σύνδεση με τη Συσκευή για χρήση στο αυτοκίνητο είναι ασταθής, δοκιμάστε να διαγράψετε τα δεδομένα ρύθμισης.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_el_EL = "Διαγραφή όλων των δεδομένων;";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_el_EL = "Όλα τα δεδομένα διαγράφηκαν.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_el_EL = "Αυτή η λειτουργία είναι διαθέσιμη με την έκδοση 1.0.5 ή νεότερη έκδοση.";
        //STARLINK エラー対応
        this.APP_Error_el_EL = "Η λήψη απέτυχε.";
        ////STARLINK対応
        this.APP_041_el_EL = "Ενημέρωση";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_el_EL = "BACK";
        //ヘッダー部文言
        this.CONFIG_002_el_EL = "ΔΙΑΜΟΡΦΩΣΗ";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_el_EL = "Τα δεδομένα ρύθμισης στην εφαρμογή STARLINK διαγράφηκαν.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_el_EL = "* Αν η σύνδεση με τη Συσκευή για χρήση στο αυτοκίνητο είναι ασταθής, δοκιμάστε να διαγράψετε τα δεδομένα ρύθμισης.";
        //confirmダイアログ用文言
        this.CONFIG_005_el_EL = "Διαγραφή όλων των δεδομένων;";
        //confirmダイアログ用文言
        this.CONFIG_006_el_EL = "Όλα τα δεδομένα διαγράφηκαν.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_el_EL = "Διαγραφή δεδομένων της εφαρμογής STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_el_EL = "Επιλογή περιοχής";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_el_EL = "Επιλέξτε την κύρια περιοχή χρήσης";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_el_EL = "* Με αυτή την επιλογή θα έχετε μια εφαρμογή βελτιστοποιημένη για την περιοχή χρήσης.";
        //利用規約更新日付文言
        this.CONFIG_012_el_EL = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_el_EL = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_el_EL = "日本";
        //アメリカ
        this.LOCATION_002_el_EL = "United States";
        //カナダ
        this.LOCATION_003_el_EL = "Canada";
        //メキシコ
        this.LOCATION_004_el_EL = "México";
        //イギリス
        this.LOCATION_005_el_EL = "United Kingdom";
        //フランス
        this.LOCATION_006_el_EL = "France";
        //ドイツ
        this.LOCATION_007_el_EL = "Deutschland";
        //オランダ
        this.LOCATION_008_el_EL = "Nederland";
        //イタリア
        this.LOCATION_009_el_EL = "Italia";
        //スペイン
        this.LOCATION_010_el_EL = "España";
        //スウェーデン
        this.LOCATION_011_el_EL = "Sverige";
        //ポーランド
        this.LOCATION_012_el_EL = "Polska";
        //ギリシャ
        this.LOCATION_013_el_EL = "Ελλάδα";
        //チェコ
        this.LOCATION_014_el_EL = "Česko";
        //ロシア
        this.LOCATION_015_el_EL = "Россия";
        //ポルトガル
        this.LOCATION_016_el_EL = "Portugal";
        //フィンランド
        this.LOCATION_017_el_EL = "Suomi";
        //ハンガリー
        this.LOCATION_018_el_EL = "Magyarország";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_el_EL = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_el_EL = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_el_EL = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_el_EL = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_el_EL = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_el_EL = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_el_EL = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_el_EL = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_el_EL = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_el_EL = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_el_EL = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_el_EL = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_el_EL = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_el_EL = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_el_EL = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_el_EL = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_el_EL = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_el_EL = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_el_EL = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_el_EL = "Κάντε ενημέρωση στην πιο πρόσφατη έκδοση της εφαρμογής SUBARU STARLINK πριν από τη χρήση.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_el_EL = "Εγκαταστάθηκε νέο In-Vehicle-Navigation. <br/>Θέλετε να μεταφέρετε την υπάρχουσα άδεια χρήσης στη νέα συσκευή;";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_el_EL = "Ναι";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_el_EL = "Όχι";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_el_EL = "Υπενθύμιση αργότερα";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_el_EL = "[Προσοχή!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_el_EL = "Από αυτό το σημείο κι έπειτα, η άδεια χρήσης δεν θα μπορεί να μεταφερθεί ξανά πίσω σε αυτήν τη συσκευή. Θέλετε οπωσδήποτε να συνεχίσετε;";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_el_EL = "Επιλέξτε τη συσκευή από την οποία θέλετε να μεταφέρετε την άδεια χρήσης";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_el_EL = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_el_EL = "Ημερομηνία σύνδεσης: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_el_EL = "ηη/μμ/εεεε";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_el_EL = "Άκυρο";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_el_EL = "Μεταφέρετε την άδεια χρήσης στη νέα συσκευή από εκείνη που συνδέθηκε στις %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_el_EL = "Η μεταφορά της άδειας χρήσης ήταν επιτυχής.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_el_EL = "Η μεταφορά της άδειας χρήσης απέτυχε.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_el_EL = "Η σύνδεση στο νέο In-Car Device (αναγνωριστικό: %2) έγινε στις %1.<br/>Θέλετε να μεταφέρετε την υπάρχουσα άδεια χρήσης στη νέα συσκευή;";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_el_EL = "Από αυτό το σημείο κι έπειτα, η άδεια χρήσης δεν θα μπορεί να μεταφερθεί σε αυτό το νέο In-Vehicle-Navigation (αναγνωριστικό: %2) που συνδέθηκε στις %1. Θέλετε οπωσδήποτε να συνεχίσετε;";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_el_EL = "Θα μεταφερθούν τα παρακάτω. ";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_el_EL = "Η μεταφορά της προηγούμενης άδειας χρήσης ήταν επιτυχής.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_el_EL = "Navigation";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_el_EL = "There are several navigation apps that can be used in the In-Vehicle-Navigation.<br />Please select a navigation app in the In-Vehicle-Navigation.<br /><br />You can select a navigation of when ran app setting destination at In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_el_EL = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_el_EL = "Navigation";
        //月表示(1月)
        this.SL_MONTH_TXT_01_el_EL = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_el_EL = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_el_EL = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_el_EL = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_el_EL = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_el_EL = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_el_EL = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_el_EL = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_el_EL = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_el_EL = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_el_EL = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_el_EL = "";
        //日付表示形式
        this.SL_DATE_FMT_01_el_EL = "d.MM.yyyy";
        // SL_TXT_0155
        this.SL_TXT_0155_el_EL = "Ver. ";
        // SL_TXT_0189
        this.SL_TXT_0189_el_EL = "Updated *";

        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_el_EL = "OK";
        this.HTML_TXT_0189_el_EL = "Σφάλμα εκχώρησης μνήμης";
        this.HTML_TXT_0193_el_EL = "APPS";

        this.APP_TXT_0176_el_EL = "Η λήψη απέτυχε.";
        this.TXT_YELP_0029_el_EL = "Παρουσιάστηκε σφάλμα.Δοκιμάστε ξανά αργότερα.";
        ////////////////////////////////////////////////////////////////
        // チェコ語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_cs_CS = "HLAVNÍ";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_cs_CS = "Platnost ";
        this.HOME_006_2_cs_CS = " vypršela.<br />Aby bylo možné používat ";
        this.HOME_006_3_cs_CS = "";
        this.HOME_006_4_cs_CS = "";
        this.HOME_006_5_cs_CS = ", musíte zakoupit funkci.<br />Podrobnosti získáte klepnutím na tlačítko „Zobrazit obrazovku zakoupení“.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_cs_CS = "Zobrazit obrazovku pro zakoupení";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_cs_CS = "Později";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_cs_CS = "Již nezobrazovat";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_cs_CS = "APL";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_cs_CS = "Stažení se nezdařilo. Klepnutím opakujte akci.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_cs_CS = "Historie připojení není k dispozici";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_cs_CS = "ZPĚT";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_cs_CS = "KONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_cs_CS = "Platnost";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_cs_CS = "Obrázek aplikace";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_cs_CS = "Přehled aplikace";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_cs_CS = "Informace o aplikaci";
        // 販売元(4Car_TXT_0082)
        this.APP_010_cs_CS = "Prodávající";
        // バージョン(4Car_TXT_0084)
        this.APP_011_cs_CS = "Verze";
        // 設定(4Car_TXT_0085)
        this.APP_012_cs_CS = "Nastavení";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_cs_CS = "Navigační zobrazení";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_cs_CS = "Zakoupit aplikaci";
        // 非表示(4Car_TXT_0077)
        this.APP_015_cs_CS = "Skrýt";
        // 表示(4Car_TXT_0066)
        this.APP_016_cs_CS = "Zobrazit";
        // 無料(4Car_TXT_0177)
        this.APP_017_cs_CS = "Zdarma";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_cs_CS = "Zakoupeno";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_cs_CS = "Ukončit prodej";
        // まで(4Car_TXT_0180)
        this.APP_020_cs_CS = "Do";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_cs_CS = "Platnost vyprší za";
        this.APP_021_2_cs_CS = "dní";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_cs_CS = "Platnost";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_cs_CS = "Vybrat interval";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_cs_CS = "Storno";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_cs_CS = "Vyberte interval k zakoupení.<br /><br /><font color='red'>Poznámka<br />Níže uvedená cena a skutečná zúčtovací cena se mohou lišit.<br />Dokončete nákup po potvrzení zúčtovací ceny, která se zobrazí po stisknutí tlačítka [Koupit].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_cs_CS = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_cs_CS = "Vyhledat navigaci do auta";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_cs_CS = "Zkontrolujte navigační systém vozidla, který bude tuto funkci používat. Zakoupená funkce bude dostupná pouze ve zvoleném navigačním systému vozidla.";
        this.APP_028_2_cs_CS = "Zpráva \"Služba byla úspěšně zaregistrována\" se zobrazí po dokončení nákupu. Neukončujte obrazovku aplikace nebo neodpojujte komunikaci (pokud probíhá) s přístrojem In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_cs_CS = "Registrovaná navigace do auta";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_cs_CS = "Koupit";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_cs_CS = "Změňte navigaci do auta.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_cs_CS = "Připojená navigace do auta (naposledy připojená)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_cs_CS = "Stisknutím následujícího tlačítka přejděte na obrazovku seznamu aplikací.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_cs_CS = "Zobrazit seznam aplikací ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_cs_CS = "S politováním vám oznamujeme, že zakoupení se nezdařilo. Obraťte se prosím na vašeho správce Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_cs_CS = "Zakoupení nebylo správně dokončeno, protože trvalo neobvykle dlouho. Chvilku počkejte a na obrazovce aplikací ověřte, zda bylo zakoupení dokončeno. Omlouváme se za případné potíže.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_cs_CS = "zap.";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_cs_CS = "vyp.";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_cs_CS = "Došlo k chybě. <br />Omlouváme se za nepříjemnosti. <br />Zkuste to znovu později.";
        // カーナビ未登録時文言
        this.APP_EX01_cs_CS = "Neregistrováno";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_cs_CS = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_cs_CS = "Podmínky použití";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_cs_CS = "Nastavení";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_cs_CS = "KONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_cs_CS = "ZPĚT";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_cs_CS = "Odstranit data aplikace 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_cs_CS = "Data nastavení aplikace 4Car byla odstraněna.<br />(K dispozici ve verzi 1.0.5 nebo novější)<br />* V případě nestabilního spojení se zařízením ve vozidle zkuste odstranit data nastavení.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_cs_CS = "Odstranit všechna data?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_cs_CS = "Všechna data byla odstraněna.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_cs_CS = "Tato funkce je k dispozici ve verzi 1.0.5 nebo novější.";
        //STARLINK エラー対応
        this.APP_Error_cs_CS = "Stažení se nezdařilo.";
        ////STARLINK対応
        this.APP_041_cs_CS = "Aktualizace";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_cs_CS = "ZPĚT";
        //ヘッダー部文言
        this.CONFIG_002_cs_CS = "KONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_cs_CS = "Data nastavení aplikace STARLINK byla odstraněna.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_cs_CS = "* V případě nestabilního spojení se zařízením ve vozidle zkuste odstranit data nastavení.";
        //confirmダイアログ用文言
        this.CONFIG_005_cs_CS = "Odstranit všechna data?";
        //confirmダイアログ用文言
        this.CONFIG_006_cs_CS = "Všechna data byla odstraněna.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_cs_CS = "Odstranit data aplikace STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_cs_CS = "Výběr oblasti";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_cs_CS = "Vyberte primární oblast použití";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_cs_CS = "* Tento výběr slouží k poskytnutí aplikace, která je optimalizována pro příslušnou oblast použití.";
        //利用規約更新日付文言
        this.CONFIG_012_cs_CS = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_cs_CS = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_cs_CS = "日本";
        //アメリカ
        this.LOCATION_002_cs_CS = "United States";
        //カナダ
        this.LOCATION_003_cs_CS = "Canada";
        //メキシコ
        this.LOCATION_004_cs_CS = "México";
        //イギリス
        this.LOCATION_005_cs_CS = "United Kingdom";
        //フランス
        this.LOCATION_006_cs_CS = "France";
        //ドイツ
        this.LOCATION_007_cs_CS = "Deutschland";
        //オランダ
        this.LOCATION_008_cs_CS = "Nederland";
        //イタリア
        this.LOCATION_009_cs_CS = "Italia";
        //スペイン
        this.LOCATION_010_cs_CS = "España";
        //スウェーデン
        this.LOCATION_011_cs_CS = "Sverige";
        //ポーランド
        this.LOCATION_012_cs_CS = "Polska";
        //ギリシャ
        this.LOCATION_013_cs_CS = "Ελλάδα";
        //チェコ
        this.LOCATION_014_cs_CS = "Česko";
        //ロシア
        this.LOCATION_015_cs_CS = "Россия";
        //ポルトガル
        this.LOCATION_016_cs_CS = "Portugal";
        //フィンランド
        this.LOCATION_017_cs_CS = "Suomi";
        //ハンガリー
        this.LOCATION_018_cs_CS = "Magyarország";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_cs_CS = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_cs_CS = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_cs_CS = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_cs_CS = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_cs_CS = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_cs_CS = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_cs_CS = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_cs_CS = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_cs_CS = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_cs_CS = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_cs_CS = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_cs_CS = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_cs_CS = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_cs_CS = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_cs_CS = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_cs_CS = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_cs_CS = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_cs_CS = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_cs_CS = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_cs_CS = "Před použitím proveďte aktualizaci na nejnovější verzi aplikace SUBARU STARLINK.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_cs_CS = "Je nainstalováno nové zařízení In-Vehicle-Navigation. <br/>Chcete přenést stávající licenci na nové?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_cs_CS = "Ano";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_cs_CS = "Ne";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_cs_CS = "Připomenout později";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_cs_CS = "[Opatrně!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_cs_CS = "Od tohoto okamžiku nebude možné přenést licenci zpět na toto zařízení. Chcete pokračovat?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_cs_CS = "Vyberte zařízení, ze kterého se má přenést licence";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_cs_CS = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_cs_CS = "Datum připojení: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_cs_CS = "mm/dd/rrrr";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_cs_CS = "Storno";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_cs_CS = "Přenést licenci na nové zařízení ze zařízení, které bylo připojeno dne %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_cs_CS = "Přenos licence byl úspěšný.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_cs_CS = "Přenos licence se nezdařil.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_cs_CS = "Připojení k novému zařízení In-Car Device (ID: %2) se uskutečnilo dne %1.<br/>Chcete přenést stávající licenci na nové?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_cs_CS = "Od tohoto okamžiku není možné přenést licenci na toto nové zařízení In-Vehicle-Navigation (ID: %2), které bylo připojeno dne %1. Chcete pokračovat?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_cs_CS = "Přenese se následující.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_cs_CS = "Přenos předchozí licence byl úspěšný.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_cs_CS = "Navigation";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_cs_CS = "There are several navigation apps that can be used in the In-Vehicle-Navigation.<br />Please select a navigation app in the In-Vehicle-Navigation.<br /><br />You can select a navigation of when ran app setting destination at In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_cs_CS = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_cs_CS = "Navigation";
        //月表示(1月)
        this.SL_MONTH_TXT_01_cs_CS = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_cs_CS = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_cs_CS = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_cs_CS = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_cs_CS = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_cs_CS = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_cs_CS = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_cs_CS = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_cs_CS = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_cs_CS = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_cs_CS = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_cs_CS = "";
        //日付表示形式
        this.SL_DATE_FMT_01_cs_CS = "d.MM.yyyy";
        // SL_TXT_0155
        this.SL_TXT_0155_cs_CS = "Ver. ";
        // SL_TXT_0189
        this.SL_TXT_0189_cs_CS = "Updated *";

        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_cs_CS = "OK";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_cs_CS = "Chyba přidělení paměti";
        this.HTML_TXT_0193_cs_CS = "APPS";

        this.APP_TXT_0176_cs_CS = "Stahování se nezdařilo.";
        this.TXT_YELP_0029_cs_CS = "Vyskytla se chyba.Prosím zkuste to znovu později.";
        ////////////////////////////////////////////////////////////////
        // イギリス英語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_en_GB = "HOME";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_en_GB = "";
        this.HOME_006_2_en_GB = " has expired.<br />You must purchase the function in order to use ";
        this.HOME_006_3_en_GB = "";
        this.HOME_006_4_en_GB = "";
        this.HOME_006_5_en_GB = ".<br />For details, please tap the Display purchase screen button.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_en_GB = "Display buy screen";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_en_GB = "Later";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_en_GB = "Never Ask Again";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_en_GB = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_en_GB = "DownLoad Fail.Click To Try Again.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_en_GB = "Connection history not available";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_en_GB = "BACK";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_en_GB = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_en_GB = "Expires";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_en_GB = "Application image";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_en_GB = "Application outline";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_en_GB = "Application information";
        // 販売元(4Car_TXT_0082)
        this.APP_010_en_GB = "Seller";
        // バージョン(4Car_TXT_0084)
        this.APP_011_en_GB = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_en_GB = "Settings";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_en_GB = "Navigation display";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_en_GB = "Purchase app item";
        // 非表示(4Car_TXT_0077)
        this.APP_015_en_GB = "Hide";
        // 表示(4Car_TXT_0066)
        this.APP_016_en_GB = "Display";
        // 無料(4Car_TXT_0177)
        this.APP_017_en_GB = "Free";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_en_GB = "Purchased";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_en_GB = "Stop sale";
        // まで(4Car_TXT_0180)
        this.APP_020_en_GB = "To";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_en_GB = "Expires within";
        this.APP_021_2_en_GB = "days";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_en_GB = "Expires";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_en_GB = "Select period";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_en_GB = "Cancel";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_en_GB = "Please choose the period to purchase.<br /><br /><font color='red'>Note<br />The price shown below and the actual settlement price may differ.<br />Be sure to complete the purchase after confirming the settlement price that is indicated when the [Purchase] button is pressed.</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_en_GB = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_en_GB = "Check car navigation";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_en_GB = "Verify the car navigation system which will be using this function. The purchased function will only be available on the selected car navigation system.";
        this.APP_028_2_en_GB = "The message \"Service has been registered successfully\" will appear when the purchase is complete. Please do not end the application screen or disconnect the communication (when communicating) with the In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_en_GB = "Registered car navigation";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_en_GB = "Purchase";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_en_GB = "Change to another car navigation.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_en_GB = "Connected car navigation (last time connected)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_en_GB = "Please push following button to go to the application list screen.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_en_GB = "Display the application list ";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_en_GB = "We apologize and advise that the purchase failed. Please contact your Clarion administrator.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_en_GB = "The purchase may not have been correctly completed since the process has taken an unusual amount of time. Please wait a while and confirm whether the purchase was completed on the app screen. We apologize for any inconvenience.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_en_GB = "on";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_en_GB = "off";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_en_GB = "An error has occurred. <br />We are sorry for the inconvenience caused. <br />Try again later.";
        // カーナビ未登録時文言
        this.APP_EX01_en_GB = "Not registered";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_en_GB = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_en_GB = "Terms and Conditions of Use";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_en_GB = "Settings";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_en_GB = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_en_GB = "BACK";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_en_GB = "Delete the 4Car application data";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_en_GB = "The setting data in the 4Car application is deleted.<br />(Available with version 1.0.5 or later)<br />* When link with In-Vehicle-Navigation is unstable, please try deleting the setting data.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_en_GB = "Delete all the data?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_en_GB = "All the data was deleted.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_en_GB = "This function is available with version 1.0.5 or later.";
        //STARLINK エラー対応
        this.APP_Error_en_GB = "Download failed.";
        ////STARLINK対応
        this.APP_041_en_GB = "Update";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_en_GB = "BACK";
        //ヘッダー部文言
        this.CONFIG_002_en_GB = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_en_GB = "The STARLINK application data will be deleted.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_en_GB = "* Resolves unstable connection with In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_en_GB = "Delete all the data?";
        //confirmダイアログ用文言
        this.CONFIG_006_en_GB = "All the data was deleted.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_en_GB = "Clear STARLINK application data";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_en_GB = "Region selection";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_en_GB = "Select your primary region.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_en_GB = "* Provides best experience for apps optimized in your region.";
        //利用規約更新日付文言
        this.CONFIG_012_en_GB = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_en_GB = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_en_GB = "日本";
        //アメリカ
        this.LOCATION_002_en_GB = "United States";
        //カナダ
        this.LOCATION_003_en_GB = "Canada";
        //メキシコ
        this.LOCATION_004_en_GB = "México";
        //イギリス
        this.LOCATION_005_en_GB = "United Kingdom";
        //フランス
        this.LOCATION_006_en_GB = "France";
        //ドイツ
        this.LOCATION_007_en_GB = "Deutschland";
        //オランダ
        this.LOCATION_008_en_GB = "Nederland";
        //イタリア
        this.LOCATION_009_en_GB = "Italia";
        //スペイン
        this.LOCATION_010_en_GB = "España";
        //スウェーデン
        this.LOCATION_011_en_GB = "Sverige";
        //ポーランド
        this.LOCATION_012_en_GB = "Polska";
        //ギリシャ
        this.LOCATION_013_en_GB = "Ελλάδα";
        //チェコ
        this.LOCATION_014_en_GB = "Česko";
        //ロシア
        this.LOCATION_015_en_GB = "Россия";
        //ポルトガル
        this.LOCATION_016_en_GB = "Portugal";
        //フィンランド
        this.LOCATION_017_en_GB = "Suomi";
        //ハンガリー
        this.LOCATION_018_en_GB = "Magyarország";
        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_en_GB = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_en_GB = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_en_GB = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_en_GB = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_en_GB = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_en_GB = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_en_GB = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_en_GB = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_en_GB = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_en_GB = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_en_GB = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_en_GB = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_en_GB = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_en_GB = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_en_GB = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_en_GB = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_en_GB = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_en_GB = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_en_GB = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_en_GB = "Update to the latest version of SUBARU STARLINK app prior to use.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_en_GB = "A new In-Vehicle-Navigation has been installed. <br/>Do you want to transfer the existing license to the new one?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_en_GB = "Yes";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_en_GB = "No";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_en_GB = "Remind me later";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_en_GB = "[Caution!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_en_GB = "From this point forward, your license cannot be transferred back to this device. Do you wish to proceed?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_en_GB = "Select the device to transfer the license from";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_en_GB = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_en_GB = "Connected date: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_en_GB = "dd/mm/yyyy";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_en_GB = "Cancel";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_en_GB = "Transfer the license to the new device from the one that was connected on %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_en_GB = "The license transfer was successful.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_en_GB = "The license transfer has failed.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_en_GB = "The connection to your new In-Car Device (ID: %2) was made on %1.<br/>Do you want to transfer the existing license to the new one?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_en_GB = "From this point forward, the license cannot be transferred to this new In-Vehicle-Navigation (ID: %2) that has been connected on %1. Do you wish to proceed?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_en_GB = "The following will be transferred. ";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_en_GB = "The previous license transfer was successful.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_en_GB = "Select navigation function";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_en_GB = "Some In-Vehicle-Navigation have multiple navigation functions. Select a navigation to use.<br/><br/>*You may select the navigation used when setting a destination using the In-Vehicle-Navigation application.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_en_GB = "";
        // HTML_TXT_0029 : デリゲーション画面説明(XXX)
        this.DELEGATION_004_en_GB = "Select navigation function";
        //月表示(1月)
        this.SL_MONTH_TXT_01_en_GB = "";
        //月表示(2月)
        this.SL_MONTH_TXT_02_en_GB = "";
        //月表示(3月)
        this.SL_MONTH_TXT_03_en_GB = "";
        //月表示(4月)
        this.SL_MONTH_TXT_04_en_GB = "";
        //月表示(5月)
        this.SL_MONTH_TXT_05_en_GB = "";
        //月表示(6月)
        this.SL_MONTH_TXT_06_en_GB = "";
        //月表示(7月)
        this.SL_MONTH_TXT_07_en_GB = "";
        //月表示(8月)
        this.SL_MONTH_TXT_08_en_GB = "";
        //月表示(9月)
        this.SL_MONTH_TXT_09_en_GB = "";
        //月表示(10月)
        this.SL_MONTH_TXT_10_en_GB = "";
        //月表示(11月)
        this.SL_MONTH_TXT_11_en_GB = "";
        //月表示(12月)
        this.SL_MONTH_TXT_12_en_GB = "";
        //日付表示形式
        this.SL_DATE_FMT_01_en_GB = "d.MM.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_en_GB = "Size: ";
        this.TXT_YELP_0029_en_GB = "Error Occurred. Please try again later.";
        this.SL_TXT_0155_en_GB = "Ver. ";
        this.SL_TXT_0189_en_GB = "Updated *";
        this.SL_TXT_0191_en_GB = "Expiration Date: ";
        this.SL_TXT_0192_en_GB = "Map Update Settings";
        this.SL_TXT_0193_en_GB = "The In-Vehicle-Navigation map data can be temporarily saved to your smartphone from the map distribution server. The next time you connect to the In-Vehicle-Navigation, you can update the map.";
        this.SL_TXT_0196_en_GB = "Update settings";
        this.SL_TXT_0197_en_GB = "Check auto update";
        this.SL_TXT_0198_en_GB = "Cellular";
        this.SL_TXT_0199_en_GB = "Update info.";
        this.SL_TXT_0200_en_GB = "Start Update";
        this.SL_TXT_0201_en_GB = "Downloaded in mobile";
        this.SL_TXT_0202_en_GB = "Update available";
        this.SL_TXT_0203_en_GB = "Updated ";
        this.SL_TXT_0204_en_GB = "Map: ";
        this.SL_TXT_0204_A_en_GB = "Europe";
        this.SL_TXT_0205_en_GB = "Version: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_en_GBを利用　宣言のみ
        this.SL_TXT_0206_en_GB = "Size: *KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_en_GB = "There is not enough space available on the smartphone.";
        this.SL_TXT_0208_en_GB = "Configure the region settings with the In-Vehicle-Navigation.";
        this.SL_TXT_0209_en_GB = "Your MapCare subscription\nhas expired.\nPlease visit www.subaru-maps.com\nto update your subscription.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_en_GB = "Please download through WiFi.\n\nDownload data is limited to 30MB per region　through Mobile Data.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_en_GB = "Update map by connecting In-Vehicle-Navigation to smartphone. After updating In-Vehicle-Navigation, map data will automatically be deleted from smartphone.";
        this.SL_TXT_0212_en_GB = "Mobile Data ON.\n\nYou can download map data through your mobile data connection. \nHowever, data is limited to 30MB per region.\n*Data charges may apply.\n\nPlease turn OFF.\nif you only want to download through WiFi.";
        this.SL_TXT_0213_en_GB = "Auto update ON.\n\nAutomatically download\nmap data and save it\non your smartphone\n*Data charges may apply.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_en_GB = "Connection to In-Vehicle-Navigation was disconnected. Try again after confirming connection to In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_en_GB = "Insufficient In-Vehicle-Navigation storage available. Try again after confirming In-Vehicle-Navigation settings.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_en_GB = "Error occurred during data transfer. Please try again later.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_en_GB = "Error occurred while downloading map data from the server. Please try again later.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_en_GB = "Insufficient smartphone storage available. Try again after deleting data from your smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_en_GB = "Mobile Data OFF.\n\nPlease download through WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_en_GB = "Communication with server was disconnected. Try again after communications have been reestablished.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_en_GBを利用　宣言のみ
        this.SL_TXT_0221_en_GB = "Size: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_en_GB = "OK";
        this.HTML_TXT_0068_en_GB = "Make sure the smartphone does not go into \"sleep mode\" while downloading map data.\nIf the smartphone goes into sleep mode, start the SUBARU STARLINK app again.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_en_GB = "The map update cannot start. Please check the state of the In-Vehicle-Navigation.";
        this.HTML_TXT_0165_en_GB = "Map update setting function";
        this.HTML_TXT_0168_en_GB = "Please enter city name";
        this.HTML_TXT_0166_en_GB = "1. Download the map data from the server to the smartphone.<br><br>2. Upon connecting the smartphone to the In-Vehicle-Navigation, the map data is transferred to the In-Vehicle-Navigation. The map data will be deleted from the smartphone after transfer.";
        this.HTML_TXT_0167_en_GB = "* When the smartphone is connected to multiple In-Vehicle-Navigations, the map update information displays the data of the most recently connected In-Vehicle-Navigation.";
        this.HTML_TXT_0169_en_GB = "Check for Updates";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_en_GB = "Pressing the Cancel button stops access to the server.";
        this.HTML_TXT_0171_en_GB = "Start Update";
        this.HTML_TXT_0172_en_GB = "The capacity of the smartphone is insufficient. Delete some data on the smartphone and try again.";
        this.HTML_TXT_0173_en_GB = "Please tap *, if you wish to cancel downloading map data from server.";
        this.HTML_TXT_0174_en_GB = "Press the Cancel button to cancel the search.";
        this.HTML_TXT_0175_en_GB = "The region from the current location to the specified destination is selected. ";
        this.HTML_TXT_0176_en_GB = "Map data is being transferred to In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_en_GB = "* Map data installation complete";
        this.HTML_TXT_0178_en_GB = "There are no search results. Please try again.";
        this.HTML_TXT_0179_en_GB = "The search point is the same as the current location.";
        this.HTML_TXT_0180_en_GB = "Please select the area you want to update on the map.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_en_GB = "Pressing the Cancel button stops access to the server.";
        this.HTML_TXT_0182_en_GB = "Download succeeded.";
        this.HTML_TXT_0183_en_GB = "Would you like to delete the map data downloaded from the server?";
        this.HTML_TXT_0184_en_GB = "Map data has been deleted.";
        this.HTML_TXT_0185_en_GB = "Could not delete map data.";
        this.HTML_TXT_0186_en_GB = "Download will be cancelled.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_en_GB = "[Important Notice]<br/>SUBARU STARLINK cannot be launched as this version is no longer supported.<br/><br/>Please install the latest version of SUBARU STARLINK on your smartphone and try launching again.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_en_GB = "Memory Allocate Error";
        this.HTML_TXT_0190_en_GB = "If data transfer is interrupted, it will automatically resume at reconnection.";
        this.HTML_TXT_0193_en_GB = "APPS";
        this.HTML_TXT_0195_en_GB = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_en_GB = "Map update region selection";
        this.HTML_TXT_0205_A_en_GB = "Display mode settings";

        this.APP_TXT_0176_en_GB = "Download Failed.";   //※通常の英語と同じ値を使用

        this.APP_TXT_0358_en_GB = "License"; 

        this.Car_TXT_0245_en_GB = "Current Location";

        this.HTML_TXT_0246_en_GB = "User Manual";
        this.HTML_TXT_0247_en_GB = "Updating the Map data using a smartphone";

        this.LOCATION_999_en_GB = "Others";

        this.HTML_TXT_9999_en_GB = "Oceania";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // カナダフランス語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_fr_CA = "ACCUEIL";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_fr_CA = "";
        this.HOME_006_2_fr_CA = " est expiré.<br />Vous devez acheter la fonction pour utiliser ";
        this.HOME_006_3_fr_CA = "";
        this.HOME_006_4_fr_CA = "";
        this.HOME_006_5_fr_CA = ".<br />Pour plus de détails, veuillez appuyer sur la touche « Afficher écran d'achat ».";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_fr_CA = "Afficher écran d'achat";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_fr_CA = "Plus tard";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_fr_CA = "Ne pas afficher à nouveau";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_fr_CA = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_fr_CA = "Échec du téléchargement. Cliquez pour réessayer.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_fr_CA = "Historique de connexion non disponible";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_fr_CA = "RETOUR";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_fr_CA = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_fr_CA = "Expiration";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_fr_CA = "Image de l’application";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_fr_CA = "Grandes lignes de l’application";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_fr_CA = "Informations de l’application";
        // 販売元(4Car_TXT_0082)
        this.APP_010_fr_CA = "Vendeur";
        // バージョン(4Car_TXT_0084)
        this.APP_011_fr_CA = "Version";
        // 設定(4Car_TXT_0085)
        this.APP_012_fr_CA = "Réglages";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_fr_CA = "Affichage de navigation";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_fr_CA = "Acheter élément d'application";
        // 非表示(4Car_TXT_0077)
        this.APP_015_fr_CA = "Masquer";
        // 表示(4Car_TXT_0066)
        this.APP_016_fr_CA = "Affichage";
        // 無料(4Car_TXT_0177)
        this.APP_017_fr_CA = "Gratuit";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_fr_CA = "Acheté";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_fr_CA = "Arrêter la vente";
        // まで(4Car_TXT_0180)
        this.APP_020_fr_CA = "À";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_fr_CA = "Expire dans";
        this.APP_021_2_fr_CA = "jours";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_fr_CA = "Expiration";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_fr_CA = "Sélectionner la période";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_fr_CA = "Annuler";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_fr_CA = "Veuillez choisir la période à acheter.<br /><br /><font color='red'>Note<br />Le prix indiqué ci-dessous et le prix de règlement réel peut différer.<br />Assurez-vous de compléter l'achat après avoir confirmé le prix de règlement indiqué après avoir pressé le bouton [Acheter].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_fr_CA = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_fr_CA = "Vérifier navigation automobile";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_fr_CA = "Vérifiez le système de navigation de voiture qui utilisera cette fonction. La fonction achetée sera uniquement disponible sur le système de navigation de voiture sélectionné.";
        this.APP_028_2_fr_CA = "Le message « Le service a été enregistré avec succès » apparaît lorsque l'achat est effectué. Veuillez ne pas fermer l'écran de l'application ou déconnecter la communication (lors de la communication) avec l'appareil In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_fr_CA = "Navigation automobile enregistrée";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_fr_CA = "Acheter";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_fr_CA = "Changer pour une autre navigation automobile.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_fr_CA = "Navigation automobile connectée (connectée la dernière fois)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_fr_CA = "Veuillez appuyer sur la touche suivante pour accéder à l'écran de liste d'applications.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_fr_CA = "Afficher la liste d'applications";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_fr_CA = "Nous vous prions de nous excuser car l'achat a échoué. Veuillez contacter votre administrateur Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_fr_CA = "Il se pourrait que l'achat ne soit pas effectué correctement car la durée du processus était inhabituelle. Veuillez patienter un instant et confirmer si l'achat a été complété sur l'écran de l'application. Nous nous excusons pour tout inconvénient.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_fr_CA = "activé";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_fr_CA = "désactivé";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_fr_CA = "Une erreur s’est produite. <br />Désolé pour les inconvénients causés.<br />Réessayez plus tard.";
        // カーナビ未登録時文言
        this.APP_EX01_fr_CA = "Non enregistré";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_fr_CA = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_fr_CA = "Conditions d'utilisation";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_fr_CA = "Réglages";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_fr_CA = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_fr_CA = "RETOUR";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_fr_CA = "Supprimer les données de l’application 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_fr_CA = "Les données de réglage de l’application 4Car sont supprimées.<br />(Disponible dans la version 1.0.5 ou une version ultérieure)<br />* Lorsque le lien avec l'appareil embarqué est instable, essayez de supprimer les données de réglage.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_fr_CA = "Supprimer toutes les données ?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_fr_CA = "Toutes les données ont été supprimées.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_fr_CA = "Cette fonction est disponible dans la version 1.0.5 ou une version ultérieure.";
        //STARLINK エラー対応
        this.APP_Error_fr_CA = "Échec du téléchargement.";
        ////STARLINK対応
        this.APP_041_fr_CA = "Mise à jour";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_fr_CA = "RETOUR";
        //ヘッダー部文言
        this.CONFIG_002_fr_CA = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_fr_CA = "Les données de l'application STARLINK seront supprimées.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_fr_CA = "* Cela résout la connexion instable à l'In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_fr_CA = "Supprimer toutes les données ?";
        //confirmダイアログ用文言
        this.CONFIG_006_fr_CA = "Toutes les données ont été supprimées.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_fr_CA = "Effacer les données de l'application STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_fr_CA = "Sélection de région";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_fr_CA = "Sélectionnez votre région principale.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_fr_CA = "* Cela permet de vous fournir la meilleure expérience pour les applications optimisées dans votre région.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_fr_CA = "Conditions d'utilisation";
        //利用規約更新日付文言
        this.CONFIG_012_fr_CA = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_fr_CA = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_fr_CA = "日本";
        //アメリカ
        this.LOCATION_002_fr_CA = "United States";
        //カナダ
        this.LOCATION_003_fr_CA = "Canada";
        //メキシコ
        this.LOCATION_004_fr_CA = "México";
        //イギリス
        this.LOCATION_005_fr_CA = "United Kingdom";
        //フランス
        this.LOCATION_006_fr_CA = "France";
        //ドイツ
        this.LOCATION_007_fr_CA = "Deutschland";
        //オランダ
        this.LOCATION_008_fr_CA = "Nederland";
        //イタリア
        this.LOCATION_009_fr_CA = "Italia";
        //スペイン
        this.LOCATION_010_fr_CA = "España";
        //スウェーデン
        this.LOCATION_011_fr_CA = "Sverige";
        //ポーランド
        this.LOCATION_012_fr_CA = "Polska";
        //ギリシャ
        this.LOCATION_013_fr_CA = "Ελλάδα";
        //チェコ
        this.LOCATION_014_fr_CA = "Česko";
        //ロシア
        this.LOCATION_015_fr_CA = "Россия";
        //ポルトガル
        this.LOCATION_016_fr_CA = "Portugal";
        //フィンランド
        this.LOCATION_017_fr_CA = "Suomi";
        //ハンガリー
        this.LOCATION_018_fr_CA = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_fr_CA = "Autres";

        this.HTML_TXT_9999_fr_CA = "Océanie";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_fr_CA = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_fr_CA = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_fr_CA = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_fr_CA = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_fr_CA = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_fr_CA = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_fr_CA = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_fr_CA = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_fr_CA = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_fr_CA = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_fr_CA = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_fr_CA = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_fr_CA = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_fr_CA = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_fr_CA = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_fr_CA = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_fr_CA = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_fr_CA = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_fr_CA = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_fr_CA = "Mettez à jour vers la dernière version de l'application SUBARU STARLINK avant l'utilisation.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_fr_CA = "Un nouvel In-Vehicle-Navigation a été installé.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_fr_CA = "Oui";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_fr_CA = "Non";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_fr_CA = "Me le rappeler plus tard";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_fr_CA = "[Attention!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_fr_CA = "Par la suite, vous ne pourrez plus transférer votre licence de retour vers cet appareil. Souhaitez-vous poursuivre?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_fr_CA = "Sélectionnez l'appareil à partir duquel le transfert sera effectué";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_fr_CA = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_fr_CA = "Date de connexion: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_fr_CA = "mm/jj/aaaa";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_fr_CA = "Annuler";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_fr_CA = "Transférer la licence vers le nouvel appareil à partir de celui qui était connecté le %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_fr_CA = "Le transfert de licence a réussi.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_fr_CA = "Le transfert de licence a échoué.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_fr_CA = "La connexion vers votre nouvel In-Car Device (ID: %2) a été faite le %1.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_fr_CA = "Par la suite, vous ne pourrez plus transférer la licence vers ce nouvel In-Car Device (ID: %2) qui a été connecté le %1. Souhaitez-vous poursuivre?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_fr_CA = "Ce qui suit sera transféré.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_fr_CA = "Le précédent transfert de licence a réussi.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_fr_CA = "Sélectionner la fonction de navigation";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_fr_CA = "Certains In-Vehicle-Navigation disposent de multiples fonctions de navigation. Sélectionnez la navigation que vous souhaitez utiliser.<br/><br/>*Vous pouvez sélectionner la navigation utilisée lors du réglage d'une destination à l'aide de l'application de l'In-Vehicle-Navigation";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_fr_CA = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_fr_CA = "Sélectionner la fonction de navigation";
        //月表示(1月)
        this.SL_MONTH_TXT_01_fr_CA = "Janv.";
        //月表示(2月)
        this.SL_MONTH_TXT_02_fr_CA = "Fév.";
        //月表示(3月)
        this.SL_MONTH_TXT_03_fr_CA = "Mars";
        //月表示(4月)
        this.SL_MONTH_TXT_04_fr_CA = "Avr.";
        //月表示(5月)
        this.SL_MONTH_TXT_05_fr_CA = "Mai";
        //月表示(6月)
        this.SL_MONTH_TXT_06_fr_CA = "Juin";
        //月表示(7月)
        this.SL_MONTH_TXT_07_fr_CA = "Juil.";
        //月表示(8月)
        this.SL_MONTH_TXT_08_fr_CA = "Août";
        //月表示(9月)
        this.SL_MONTH_TXT_09_fr_CA = "Sept.";
        //月表示(10月)
        this.SL_MONTH_TXT_10_fr_CA = "Oct.";
        //月表示(11月)
        this.SL_MONTH_TXT_11_fr_CA = "Nov.";
        //月表示(12月)
        this.SL_MONTH_TXT_12_fr_CA = "Déc.";
        //日付表示形式
        this.SL_DATE_FMT_01_fr_CA = "MMM d.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_fr_CA = "Taille : ";
        this.TXT_YELP_0029_fr_CA = "Une erreur est survenue.Veuillez réessayer plus tard.";
        this.SL_TXT_0155_fr_CA = "Ver. ";
        this.SL_TXT_0189_fr_CA = "Mis à jour le *";
        this.SL_TXT_0191_fr_CA = "Date d'expiration : ";
        this.SL_TXT_0192_fr_CA = "Réglages de mise à jour des cartes";
        this.SL_TXT_0193_fr_CA = "Les données de carte de l'In-Vehicle-Navigation peuvent être sauvegardées de façon temporaire sur votre téléphone intelligent à partir du serveur de distribution de cartes. La prochaine fois que vous vous connectez à l'In-Vehicle-Navigation, vous pourrez mettre à jour la carte.";
        this.SL_TXT_0196_fr_CA = "Réglages mise à jour";
        this.SL_TXT_0197_fr_CA = "Vérification de la mise à jour automatique";
        this.SL_TXT_0198_fr_CA = "Cellulaire";
        this.SL_TXT_0199_fr_CA = "Info. de mise à jour";
        this.SL_TXT_0200_fr_CA = "Tout télécharger";
        this.SL_TXT_0201_fr_CA = "Téléchargé sur le mobile";
        this.SL_TXT_0202_fr_CA = "Mise à jour disponible";
        this.SL_TXT_0203_fr_CA = "Mis à jour";
        this.SL_TXT_0204_fr_CA = "Carte : ";
        this.SL_TXT_0204_A_fr_CA = "Europe";
        this.SL_TXT_0205_fr_CA = "Version : ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_fr_CAを利用　宣言のみ
        this.SL_TXT_0206_fr_CA = "Taille : *KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_fr_CA = "Espace insuffisant sur le téléphone intelligent.";
        this.SL_TXT_0208_fr_CA = "Configurez les réglages régionaux à l'aide de l'In-Vehicle-Navigation.";
        this.SL_TXT_0209_fr_CA = "Inscription MapCare est expirée. Visitez adresse www.subaru-maps.com pour mettre à jour inscription.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_fr_CA = "La mise à jour de la carte dépasse 30 Mo.\n\nVeuillez vous connecter au Wi-Fi pour la télécharger.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_fr_CA = "Mettez à jour la carte en connectant l'In-Vehicle-Navigation au téléphone intelligent. Après la mise à jour de l'In-Vehicle-Navigation, les données de carte seront automatiquement supprimées du téléphone intelligent.";
        this.SL_TXT_0212_fr_CA = "Données cellulaires activées.\n\nvous pouvez télécharger des données cartographiques via votre connexion au réseau cellulaire.\nLes données sont limitées à 30 Mo par région.\n* Des frais de transmission de données peuvent s'appliquer\n\nVeuillez désactiver cette fonction,\nsi vous voulez télécharger les données via Wi-Fi.";
        this.SL_TXT_0213_fr_CA = "Mise à jour automatique activée.\n\nTéléchargez automatiquement\nles données cartographiques et enregistrez-les sur votre téléphone intelligent.\n* Des frais de transmission de données peuvent s'appliquer.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_fr_CA = "La connexion à l'In-Vehicle-Navigation a été interrompue. Réessayez après avoir confirmé la connexion à l'In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_fr_CA = "L'espace de stockage disponible sur l'In-Vehicle-Navigation est insuffisant. Réessayez après avoir confirmé les réglages de l'In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_fr_CA = "Une erreur est survenue pendant le transfert de données. Veuillez réessayer plus tard.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_fr_CA = "Une erreur est survenue lors du téléchargement des données de carte du serveur. Une erreur est survenue. Veuillez réessayer plus tard.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_fr_CA = "L'espace de stockage disponible sur le téléphone intelligent est insuffisant. Réessayez après avoir supprimé des données de votre téléphone intelligent.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_fr_CA = "Données cellulaires désactivées.\n\nVeuillez vous connecter au Wi-Fi pour télécharger la mise à jour de la carte.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_fr_CA = "La communication avec le serveur a été interrompue. Réessayez après avoir rétabli la communication.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_fr_CAを利用　宣言のみ
        this.SL_TXT_0221_fr_CA = "Taille : *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_fr_CA = "OK";
        this.HTML_TXT_0068_fr_CA = "Assurez-vous que le téléphone intelligent n'est mis en \"mode veille\" lors du téléchargement des données cartographiques.\nSi le téléphone intelligent est mis en veille, lancez à nouveau l'application SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_fr_CA = "La mise à jour de la carte ne peut pas commencer. Veuillez vérifier le navigateur du véhicule.";
        this.HTML_TXT_0165_fr_CA = "Fonction de mise à jour de la carte";
        this.HTML_TXT_0166_fr_CA = "1. Téléchargez les données cartographiques du serveur vers le téléphone intelligent.<br><br>2. Lors de la connexion du téléphone intelligent à l'In-Vehicle-Navigation, les données cartographiques seront transférées sur le In-Vehicle-Navigation. Les données cartographiques seront supprimées du téléphone intelligent après le transfert.";
        this.HTML_TXT_0167_fr_CA = "* Lorsque le téléphone intelligent est connecté à plusieurs In-Vehicle-Navigations, l'information de mise à jour de la carte affiche les données du dernier In-Vehicle-Navigation connecté.";
        this.HTML_TXT_0168_fr_CA = "Sélection de région automatique";
        this.HTML_TXT_0169_fr_CA = "Vérifier les mises à jour";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_fr_CA = "Appuyez sur le bouton Annuler pour arrêter l'accès au serveur.";
        this.HTML_TXT_0171_fr_CA = "Démarrer la mise à jour";
        this.HTML_TXT_0172_fr_CA = "La capacité du téléphone intelligent est insuffisante. Supprimez des données sur le téléphone intelligent et réessayez.";
        this.HTML_TXT_0173_fr_CA = "Appuyez sur * pour annuler le téléchargement des données cartographiques du serveur.";
        this.HTML_TXT_0174_fr_CA = "Appuyez sur le bouton Annuler pour annuler la recherche.";
        this.HTML_TXT_0175_fr_CA = "La région de l'emplacement actuel à la destination spécifiée a été sélectionnée.";
        this.HTML_TXT_0176_fr_CA = "Transfert en cours des données cartographiques vers l'In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_fr_CA = "Installation des données cartographiques de * terminée";
        this.HTML_TXT_0178_fr_CA = "Il n'y a pas de résultats de recherche. Veuillez réessayer.";
        this.HTML_TXT_0179_fr_CA = "Le point de recherche est le même que l'emplacement actuel.";
        this.HTML_TXT_0180_fr_CA = "Veuillez sélectionner la zone que vous voulez mettre à jour sur la carte.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_fr_CA = "Appuyez sur le bouton Annuler pour arrêter l'accès au serveur.";
        this.HTML_TXT_0182_fr_CA = "Téléchargement réussi.";
        this.HTML_TXT_0183_fr_CA = "Voulez-vous supprimer les données cartographiques téléchargées depuis le serveur ?";
        this.HTML_TXT_0184_fr_CA = "Les données cartographiques ont été supprimées.";
        this.HTML_TXT_0185_fr_CA = "Impossible de supprimer les données cartographiques.";
        this.HTML_TXT_0186_fr_CA = "Le téléchargement sera annulé.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_fr_CA = "[Avis important]<br/>SUBARU STARLINK ne peut pas être lancé, car cette version n'est plus prise en charge.<br/><br/>Veuillez installer la dernière version de SUBARU STARLINK sur votre téléphone intelligent et retentez le lancement.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_fr_CA = "Erreur d’allocation de mémoire";
        this.HTML_TXT_0190_fr_CA = "Si le transfert de données est interrompu, il sera automatiquement repris lors de la reconnexion.";
        this.HTML_TXT_0191_fr_CA = "Ver. SDL";
        this.HTML_TXT_0193_fr_CA = "APPS";
        this.HTML_TXT_0195_fr_CA = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_fr_CA = "Sélection de la région de mise à jour de la carte";
        this.HTML_TXT_0205_A_fr_CA = "Réglage du mode d'affichage";

        this.APP_TXT_0176_fr_CA = "Échec du téléchargement.";  //※フランス語と同じ値を使用

        this.APP_TXT_0358_fr_CA = "Licence"; 
        this.Car_TXT_0245_fr_CA = "Position actuelle";

        this.HTML_TXT_0246_fr_CA = "Manuel d’utilisation";
        this.HTML_TXT_0247_fr_CA = "Mise à jour des données de cartes à l’aide d’un téléphone intelligent";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // メキシコスペイン語
        ////////////////////////////////////////////////////////////////
        // HOMEタブ上部メニュー(4Car_TXT_0172)
        this.HOME_001_es_MX = "INICIO";
        // ライセンス切れ画面内文言(4Car_TXT_0149)
        this.HOME_006_1_es_MX = "";
        this.HOME_006_2_es_MX = " ha expirado.<br />Debe comprar la función para poder utilizar ";
        this.HOME_006_3_es_MX = "";
        this.HOME_006_4_es_MX = "";
        this.HOME_006_5_es_MX = ">.<br />Para más información, pulse el botón MOSTRAR PANTALLA DE COMPRA.";
        // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
        this.HOME_007_es_MX = "Mostar pantalla de compra";
        // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
        this.HOME_008_es_MX = "Más tarde";
        // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
        this.HOME_009_es_MX = "No volver a mostrar";
        // APPタブ上部メニュー(4Car_TXT_0076)
        this.APP_001_es_MX = "APP";
        // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
        this.APP_002_es_MX = "La descarga falló. Haga clic para intentarlo otra vez.";
        // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
        this.APP_003_es_MX = "La conexión al historial no está disponible";
        // BACKボタン(4Car_TXT_0056)
        this.APP_004_es_MX = "ATRÁS";
        // CONFIGボタン(4Car_TXT_0078)
        this.APP_005_es_MX = "CONFIG";
        // ライセンス有効期間表示(4Car_TXT_0192)
        this.APP_006_es_MX = "Expira";
        // アプリイメージ(4Car_TXT_0079)
        this.APP_007_es_MX = "Imagen de la aplicación";
        // アプリ概要(4Car_TXT_0080)
        this.APP_008_es_MX = "Descripción de la aplicación";
        // アプリ情報(4Car_TXT_0081)
        this.APP_009_es_MX = "Información de la aplicación";
        // 販売元(4Car_TXT_0082)
        this.APP_010_es_MX = "Vendedor";
        // バージョン(4Car_TXT_0084)
        this.APP_011_es_MX = "Versión";
        // 設定(4Car_TXT_0085)
        this.APP_012_es_MX = "Configuración";
        // ナビ表示(4Car_TXT_0086)
        this.APP_013_es_MX = "Pantalla de navegación";
        // アプリ内アイテム購入(4Car_TXT_0176)
        this.APP_014_es_MX = "Comprar aplicación";
        // 非表示(4Car_TXT_0077)
        this.APP_015_es_MX = "Ocultar";
        // 表示(4Car_TXT_0066)
        this.APP_016_es_MX = "Mostrar";
        // 無料(4Car_TXT_0177)
        this.APP_017_es_MX = "Gratis";
        // 購入済み(4Car_TXT_0178)
        this.APP_018_es_MX = "Comprada";
        // 販売停止(4Car_TXT_0179)
        this.APP_019_es_MX = "Detener la venta";
        // まで(4Car_TXT_0180)
        this.APP_020_es_MX = "Hacia";
        // ○○日以内に切れます(4Car_TXT_0192)
        this.APP_021_1_es_MX = "Expira en";
        this.APP_021_2_es_MX = "días";
        // 有効期間(4Car_TXT_0142)
        this.APP_022_es_MX = "Expira";
        // 期間選択(4Car_TXT_0159)
        this.APP_023_es_MX = "Seleccionar periodo.";
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_es_MX = "Cancelar";
        // 購入する期間を選択して下さい。(4Car_TXT_0165)
        this.APP_025_es_MX = "Escoja el periodo que desea comprar.<br /><br /><font color='red'>Nota<br />El precio que se muestra a continuación y el precio de liquidación final puede diferir.<br />Asegúrese de completar la compra después de confirmar el precio de liquidación que se indica al pulsar el botón [Adquirir].</font>";
        // 決定ボタン(4Car_TXT_0160)
        this.APP_026_es_MX = "OK";
        // カーナビ確認(4Car_TXT_0181)
        this.APP_027_es_MX = "Comprobar el sistema de navegación para automóviles";
        // 車載機選択時文言(4Car_TXT_0723)
        this.APP_028_1_es_MX = "Verifique el sistema de navegación para automóviles que utilizará esta función. La función de compra solo estará disponible en el sistema de navegación del coche seleccionado.";
        this.APP_028_2_es_MX = "Cuando se haya completado la compra, aparecerá el mensaje \"El servicio se ha registrado correctamente\". Por favor, no cierre la pantalla de la aplicación ni desconecte la comunicación (durante la comunicación) con el In-Vehicle-Navigation.";
        // 登録中のカーナビ(4Car_TXT_0183)
        this.APP_029_es_MX = "Sistema de navegación para automóviles registrado";
        // 購入実行ボタン(4Car_TXT_0161)
        this.APP_030_es_MX = "Adquirir";
        // 他のカーナビに変更ボタン(4Car_TXT_0162)
        this.APP_031_es_MX = "Cambiar a otro sistema de navegación para automóviles.";
        // 過去接続車載機文言(4Car_TXT_0156)
        this.APP_032_es_MX = "Sistema de navegación para automóviles conectado (última vez que se conectó)";
        // 購入完了後画面内文言(4Car_TXT_0163)
        this.APP_033_es_MX = "Por favor presione el botón siguiente para ir a la pantalla de lista de aplicaciones.";
        // アプリ一覧表示ボタン(4Car_TXT_0164)
        this.APP_034_es_MX = "Mostrar la lista de aplicaciones.";
        // 購入失敗時文言(4Car_TXT_0185)
        this.APP_035_es_MX = "Le pedimos disculpas y le informamos que la compra falló. Contacte a su administrador de Clarion.";
        // 購入未完了時文言(4Car_TXT_0186)
        this.APP_036_es_MX = "La compra pudo no haberse completado correctamente ya que el proceso ha durado una cantidad de tiempo inusual. Espere un poco y confirme si la compra se ha completado en la lista de aplicaciones. Le pedimos disculpas por cualquier inconveniente.";
        // ナビ表示on(4Car_TXT_0088)
        this.APP_037_es_MX = "encendido";
        // ナビ表示off(4Car_TXT_0087)
        this.APP_038_es_MX = "apagado";
        // アプリ・ライセンス取得エラー時表示文言
        this.APP_039_es_MX = "Se ha producido un error.<br />Lamentamos cualquier inconveniente.<br />Inténtelo de nuevo más tarde.";
        // カーナビ未登録時文言
        this.APP_EX01_es_MX = "No registrado";
        // OTHERタブ上部メニュー(4Car_TXT_0007)
        this.OTHER_001_es_MX = "MORE";
        // 利用規約(4Car_TXT_0188)
        this.OTHER_002_es_MX = "Términos y condiciones de uso";
        // 設定ボタン(4Car_TXT_0085)
        this.OTHER_003_es_MX = "Configuración";
        // CONFIGボタン(4Car_TXT_0078)
        this.OTHER_004_es_MX = "CONFIG";
        // BACKボタン(4Car_TXT_0056)
        this.OTHER_005_es_MX = "ATRÁS";
        // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
        this.OTHER_006_es_MX = "Eliminar los datos de la aplicación 4Car";
        // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
        this.OTHER_007_es_MX = "Eliminando los datos de configuración de la aplicación 4Car.<br />(Disponible con la versión 1.0.5 o posterior)<br />* Cuando el enlace con el dispositivo del automóvil no sea estable, pruebe a eliminar los datos de configuración.";
        // データ消去確認アラート内文言(4Car_TXT_0053)
        this.OTHER_008_es_MX = "¿Eliminar todos los datos?";
        // データ消去後表示文言(4Car_TXT_0054)
        this.OTHER_009_es_MX = "Se han eliminado todos los datos.";
        // データ消去不能時アラート内文言(4Car_TXT_0055)
        this.OTHER_010_es_MX = "Esta función está disponible con la versión 1.0.5 o posterior.";
        //STARLINK エラー対応
        this.APP_Error_es_MX = "La descarga falló.";
        ////STARLINK対応
        this.APP_041_es_MX = "Actualización";
        //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
        //BACKボタン
        this.CONFIG_001_es_MX = "ATRÁS";
        //ヘッダー部文言
        this.CONFIG_002_es_MX = "CONFIG";
        //CONFIG画面文言(SL_TXT_0153上)
        this.CONFIG_003_es_MX = "Los datos de la aplicación STARLINK se eliminarán.";
        //CONFIG画面文言(SL_TXT_0153下)
        this.CONFIG_004_es_MX = "* Esto resuelve la conexión instable al In-Vehicle-Navigation.";
        //confirmダイアログ用文言
        this.CONFIG_005_es_MX = "¿Eliminar todos los datos?";
        //confirmダイアログ用文言
        this.CONFIG_006_es_MX = "Se han eliminado todos los datos.";
        //キャッシュクリアボタン文言(SL_TXT_0152)
        this.CONFIG_007_es_MX = "Borrar los datos de la aplicación STARLINK";
        //利用地域選択画面文言(SL_TXT_0003)
        this.CONFIG_008_es_MX = "Selección de región";
        //利用地域選択画面文言(SL_TXT_0154上)
        this.CONFIG_009_es_MX = "Seleccione su región primaria.";
        //利用地域選択画面文言(SL_TXT_0154下)
        this.CONFIG_010_es_MX = "* Esto ofrece la mejor experiencia para las aplicaciones optimizadas en su región.";
        //利用規約文言(4Car_TXT_0188)
        this.CONFIG_011_es_MX = "Términos y condiciones de uso";
        //利用規約更新日付文言
        this.CONFIG_012_es_MX = "April 1. 2017 Updated.";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_es_MX = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        //日本
        this.LOCATION_001_es_MX = "日本";
        //アメリカ
        this.LOCATION_002_es_MX = "United States";
        //カナダ
        this.LOCATION_003_es_MX = "Canada";
        //メキシコ
        this.LOCATION_004_es_MX = "México";
        //イギリス
        this.LOCATION_005_es_MX = "United Kingdom";
        //フランス
        this.LOCATION_006_es_MX = "France";
        //ドイツ
        this.LOCATION_007_es_MX = "Deutschland";
        //オランダ
        this.LOCATION_008_es_MX = "Nederland";
        //イタリア
        this.LOCATION_009_es_MX = "Italia";
        //スペイン
        this.LOCATION_010_es_MX = "España";
        //スウェーデン
        this.LOCATION_011_es_MX = "Sverige";
        //ポーランド
        this.LOCATION_012_es_MX = "Polska";
        //ギリシャ
        this.LOCATION_013_es_MX = "Ελλάδα";
        //チェコ
        this.LOCATION_014_es_MX = "Česko";
        //ロシア
        this.LOCATION_015_es_MX = "Россия";
        //ポルトガル
        this.LOCATION_016_es_MX = "Portugal";
        //フィンランド
        this.LOCATION_017_es_MX = "Suomi";
        //ハンガリー
        this.LOCATION_018_es_MX = "Magyarország";
        //other (North American Oceans)
        this.LOCATION_999_es_MX = "Otros";

        this.HTML_TXT_9999_es_MX = "Oceanía";

        //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================
        //課金モジュールエラー時ポップアップ文言101
        this.ALERT_001_es_MX = "CODE: 2101\nPurchase was cancelled.";
        //課金モジュールエラー時ポップアップ文言103
        this.ALERT_002_es_MX = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
        //課金モジュールエラー時ポップアップ文言104
        this.ALERT_003_es_MX = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
        //課金モジュールエラー時ポップアップ文言105
        this.ALERT_004_es_MX = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言106
        this.ALERT_005_es_MX = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言107
        this.ALERT_006_es_MX = "CODE: 2107\nFailure occurred as the item has already been purchased.";
        //課金モジュールエラー時ポップアップ文言108
        this.ALERT_007_es_MX = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言110
        this.ALERT_008_es_MX = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
        //課金モジュールエラー時ポップアップ文言111
        this.ALERT_009_es_MX = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
        //課金モジュールエラー時ポップアップ文言211
        this.ALERT_010_es_MX = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言213
        this.ALERT_011_es_MX = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言228
        this.ALERT_012_es_MX = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言243
        this.ALERT_013_es_MX = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
        //課金モジュールエラー時ポップアップ文言261
        this.ALERT_014_es_MX = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言299
        this.ALERT_015_es_MX = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言996
        this.ALERT_016_es_MX = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
        //課金モジュールエラー時ポップアップ文言997
        this.ALERT_017_es_MX = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言998
        this.ALERT_018_es_MX = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //課金モジュールエラー時ポップアップ文言999
        this.ALERT_019_es_MX = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
        //バージョンアップ必要時文言
        this.VERSION_001_es_MX = "Actualice a la versión más reciente de la aplicación SUBARU STARLINK antes de utilizarla.";
        //ライセンス引継確認画面説明文言(SL_TXT_0005)
        this.LICENCE_001_es_MX = "Un nuevo In-Vehicle-Navigation ha sido instalado.<br/>¿Desea transferir la licencia existente al nuevo?";
        //「はい」ボタン(SL_TXT_0006)
        this.LICENCE_002_es_MX = "Sí";
        //「いいえ」ボタン(SL_TXT_0007)
        this.LICENCE_003_es_MX = "No";
        //「後で表示」ボタン(SL_TXT_0008)
        this.LICENCE_004_es_MX = "Recordármelo más tarde";
        //【注意】(SL_TXT_0009)
        this.LICENCE_005_es_MX = "[¡Precaución!]";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
        this.LICENCE_006_es_MX = "En adelante su licencia no podrá ser transferida de nuevo a este dispositivo. ¿Desea seguir?";
        //引継元選択画面説明文言(SL_TXT_0011)
        this.LICENCE_007_es_MX = "Seleccione el dispositivo del que transferirá la licencia";
        //車載機ID(SL_TXT_0012)
        this.LICENCE_008_es_MX = "In-Vehicle-Navigation ID: ";
        //接続日(SL_TXT_0013)
        this.LICENCE_009_es_MX = "Fecha de conexión: ";
        //日付フォーマット(SL_TXT_0014)
        this.LICENCE_010_es_MX = "dd/mm/aa";
        //「キャンセル」ボタン(SL_TXT_0015)
        this.LICENCE_011_es_MX = "Cancelar";
        //引継実行確認画面説明文言(SL_TXT_0016)
        this.LICENCE_012_es_MX = "Transferir la licencia al nuevo dispositivo del que fue conectado el %1.";
        //引継成功画面説明文言(SL_TXT_0017)
        this.LICENCE_013_es_MX = "La transferencia de licencia se realizó correctamente.";
        //引継失敗画面説明文言(SL_TXT_0018)
        this.LICENCE_014_es_MX = "La transferencia de licencia ha fallado.";
        //ライセンス引継確認画面説明文言(SL_TXT_0019)
        this.LICENCE_015_es_MX = "La conexión con su nuevo In-Car Device (ID: %2) fue establecida el %1.<br/>¿Desea transferir la licencia existente al nuevo?";
        //ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
        this.LICENCE_016_es_MX = "En adelante la licencia no podrá ser transferida a este nuevo In-Car Device (ID: %2) que ha sido conectado el %1. ¿Desea seguir?";
        //引継実行確認画面説明文言(SL_TXT_0021)
        this.LICENCE_017_es_MX = "Lo siguiente será transferido.";
        //引継成功画面文言(SL_TXT_0036)
        this.LICENCE_018_es_MX = "La transferencia de licencia anterior se realizó correctamente.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_es_MX = "Seleccionar la función de navegación";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_es_MX = "Algunos In-Vehicle-Navigation disponen de múltiples funciones de navegación. Seleccione la navegación que desea utilizar.<br/><br/>*Puede seleccionar la navegación utilizada al establecer un destino mediante la aplicación del In-Vehicle-Navigation.";
        //デリゲーション画面タイトル(XXX)
        this.DELEGATION_003_es_MX = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_es_MX = "Seleccionar la función de navegación";
        //月表示(1月)
        this.SL_MONTH_TXT_01_es_MX = "Ene.";
        //月表示(2月)
        this.SL_MONTH_TXT_02_es_MX = "Feb.";
        //月表示(3月)
        this.SL_MONTH_TXT_03_es_MX = "Mar.";
        //月表示(4月)
        this.SL_MONTH_TXT_04_es_MX = "Abr.";
        //月表示(5月)
        this.SL_MONTH_TXT_05_es_MX = "Mayo";
        //月表示(6月)
        this.SL_MONTH_TXT_06_es_MX = "Jun.";
        //月表示(7月)
        this.SL_MONTH_TXT_07_es_MX = "Jul.";
        //月表示(8月)
        this.SL_MONTH_TXT_08_es_MX = "Ago.";
        //月表示(9月)
        this.SL_MONTH_TXT_09_es_MX = "Sept.";
        //月表示(10月)
        this.SL_MONTH_TXT_10_es_MX = "Oct.";
        //月表示(11月)
        this.SL_MONTH_TXT_11_es_MX = "Nov.";
        //月表示(12月)
        this.SL_MONTH_TXT_12_es_MX = "Dic.";
        //日付表示形式
        this.SL_DATE_FMT_01_es_MX = "MMM d.yyyy";
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_es_MX = "Tamaño: ";
        this.TXT_YELP_0029_es_MX = "Ha ocurrido un error.Vuelva a intentarlo más tarde.";
        this.SL_TXT_0155_es_MX = "Ver. ";
        this.SL_TXT_0189_es_MX = "Actualizado el *";
        this.SL_TXT_0191_es_MX = "Fecha de expiración: ";
        this.SL_TXT_0192_es_MX = "Ajustes de actualización de mapa";
        this.SL_TXT_0193_es_MX = "Los datos de mapa del In-Vehicle-Navigation pueden guardarse de forma temporal en su smartphone desde el servidor de distribución de mapas. La próxima vez que se conectará al In-Vehicle-Navigation, podrá actualizar el mapa.";
        this.SL_TXT_0196_es_MX = "Ajustes actualización";
        this.SL_TXT_0197_es_MX = "Verificación de la actualización automática";
        this.SL_TXT_0198_es_MX = "Celular";
        this.SL_TXT_0199_es_MX = "Info. Actualización";
        this.SL_TXT_0200_es_MX = "Descargar todo";
        this.SL_TXT_0201_es_MX = "Descargado en el celular";
        this.SL_TXT_0202_es_MX = "Actualización disponible";
        this.SL_TXT_0203_es_MX = "Actualizado";
        this.SL_TXT_0204_es_MX = "Mapa: ";
        this.SL_TXT_0204_A_es_MX = "Europa";
        this.SL_TXT_0205_es_MX = "Versión: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_es_MXを利用　宣言のみ
        this.SL_TXT_0206_es_MX = "Tamaño: *KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_es_MX = "No hay suficiente espacio en el smartphone.";
        this.SL_TXT_0208_es_MX = "Configure los ajustes regionales mediante el In-Vehicle-Navigation.";
        this.SL_TXT_0209_es_MX = "Suscripción a MapCare caducada. Visite www.subaru-maps.com para actualizar suscripción.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_es_MX = "Descargue a través de Wi-Fi.\n\nLos datos de descarga están limitados a 30 MB por región a través de datos celulares.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_es_MX = "Actualice el mapa conectando el In-Vehicle-Navigation al smartphone. Después de actualizar el In-Vehicle-Navigation, los datos de mapa se eliminarán automáticamente del smartphone.";
        this.SL_TXT_0212_es_MX = "Datos celulares activados.\n\nPuede descargar datos de mapas a través de su conexión de datos celulares.\nSin embargo, los datos están limitados a 30 MB por región.\n* Se pueden aplicar cargos por datos.\n\nDesactive esta opción,\nsi sólo desea descargar a través de Wi-Fi.";
        this.SL_TXT_0213_es_MX = "Actualización automática ACTIVADA.\n\nDescargue automáticamente\nlos datos del mapa y guárdelos\nen su teléfono inteligente.\n* Se pueden aplicar cargos por datos.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_es_MX = "Se interrumpió la conexión con el In-Vehicle-Navigation. Vuelva a intentarlo después de confirmar la conexión con el In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_es_MX = "El espacio de almacenamiento disponible en el In-Vehicle-Navigation es insuficiente. Vuelva a intentarlo después de confirmar los ajustes del In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_es_MX = "Ha ocurrido un error durante la transferencia de datos. Vuelva a intentarlo más tarde.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_es_MX = "Ha ocurrido un error mientras se descargaban los datos de mapa del servidor. Vuelva a intentarlo más tarde.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_es_MX = "El espacio de almacenamiento disponible en el smartphone es insuficiente. Vuelva a intentarlo después de eliminar datos de su smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_es_MX = "Datos celulares desactivados.\n\nFavor de descargar a través de Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_es_MX = "Se interrumpió la comunicación con el servidor. Inténtelo de nuevo después de restablecer la comunicación.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_es_MXを利用　宣言のみ
        this.SL_TXT_0221_es_MX = "Tamaño: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_es_MX = "OK";
        this.HTML_TXT_0068_es_MX = "Asegúrese de que el teléfono inteligente no entre en \"modo de suspensión\" al descargar datos de mapas.\nSi el teléfono inteligente entra en modo de suspensión, vuelva a iniciar la aplicación SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_es_MX = "No se puede iniciar la actualización del mapa. Favor de verificar el navegador del vehículo.";
        this.HTML_TXT_0165_es_MX = "Función de configuración de actualización del mapa";
        this.HTML_TXT_0166_es_MX = "1. Descargue los datos del mapa del servidor al teléfono inteligente.<br><br>2. Al conectar el teléfono inteligente al In-Vehicle-Navigation, los datos del mapa se transferirán al In-Vehicle-Navigation. Los datos del mapa se eliminarán del teléfono inteligente después de la transferencia.";
        this.HTML_TXT_0167_es_MX = "* Cuando el teléfono inteligente está conectado a varios In-Vehicle-Navigations, la información de actualización del mapa muestra los datos del In-Vehicle-Navigation conectado más recientemente.";
        this.HTML_TXT_0168_es_MX = "Selección de región automática";
        this.HTML_TXT_0169_es_MX = "Comprobar actualizaciones";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_es_MX = "Presione el botón Cancelar para detener el acceso al servidor.";
        this.HTML_TXT_0171_es_MX = "Iniciar la actualización";
        this.HTML_TXT_0172_es_MX = "La capacidad del teléfono inteligente es insuficiente. Borre algunos datos en el teléfono inteligente y vuelva a intentarlo.";
        this.HTML_TXT_0173_es_MX = "Presione * para cancelar la descarga de datos del mapa desde el servidor.";
        this.HTML_TXT_0174_es_MX = "Presione el botón Cancelar para cancelar la búsqueda.";
        this.HTML_TXT_0175_es_MX = "Se ha seleccionado la región desde la ubicación actual hasta el destino especificado.";
        this.HTML_TXT_0176_es_MX = "Transfiriendo los datos del mapa al In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_es_MX = "Completada la instalación de los datos del mapa de *";
        this.HTML_TXT_0178_es_MX = "No hay resultados de búsqueda. Favor de intentarlo de nuevo.";
        this.HTML_TXT_0179_es_MX = "El punto de búsqueda es el mismo que la ubicación actual.";
        this.HTML_TXT_0180_es_MX = "Seleccione el área que desea actualizar en el mapa.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_es_MX = "Presione el botón Cancelar para detener el acceso al servidor.";
        this.HTML_TXT_0182_es_MX = "Descarga completada.";
        this.HTML_TXT_0183_es_MX = "¿Desea eliminar los datos del mapa descargados del servidor?";
        this.HTML_TXT_0184_es_MX = "Los datos del mapa han sido eliminados.";
        this.HTML_TXT_0185_es_MX = "No se pudieron borrar los datos del mapa.";
        this.HTML_TXT_0186_es_MX = "La descarga se cancelará.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_es_MX = "[Aviso importante]<br/>No se puede iniciar SUBARU STARLINK porque esta versión ya no se admite.<br/><br/>Instale la última versión de SUBARU STARLINK en su smartphone y vuelva a intentar iniciarlo.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_es_MX = "Error de asignación de memoria";
        this.HTML_TXT_0190_es_MX = "Si se interrumpe la transferencia de datos, se reanudará automáticamente al reconectarse.";
        this.HTML_TXT_0191_es_MX = "Ver. SDL";
        this.HTML_TXT_0193_es_MX = "APPS";
        this.HTML_TXT_0195_es_MX = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_es_MX = "Selección de la región de actualización del mapa";
        this.HTML_TXT_0205_A_es_MX = "Configuración del modo de visualización";

        this.APP_TXT_0176_es_MX = "Fallo de descarga.";     //※スペイン語と同じ値を使用

        this.APP_TXT_0358_es_MX = "Licencia"; 

        this.Car_TXT_0245_es_MX = "Ubic. Actual";

        this.HTML_TXT_0246_es_MX = "MANUAL DEL USUARIO";
        this.HTML_TXT_0247_es_MX = "Actualización de los datos del mapa utilizando un teléfono inteligente";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // タイ語 th
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_th = "ยกเลิก";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_th = "ต้องการจะลบข้อมูลทั้งหมดหรือไม่?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_th = "ข้อมูลทั้งหมดได้ถูกลบแล้ว";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_th = "กลับไป";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_th = "ข้อกำหนดในการให้บริการ";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_th = "อัปเดต 01/ 04/ 2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_th = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_th = "ข้อมูลของแอพพลิเคชัน STARLINK จะถูกลบออก";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_th = "*แก้ไขปัญหาการเชื่อมต่อที่ไม่เสถียรกับ In-Vehicle-Navigation";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_th = "ลบข้อมูลแอพพลิเคชัน STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_th = "เลือกภูมิภาค";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_th = "เลือกภูมิภาคหลักของคุณ ";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_th = "* สัมผัสกับประสบการณ์การเพิ่มประสิทธิภาพที่ยอดเยี่ยมในภูมิภาคของคุณ \"";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_th = "เลือกฟังก์ชันการนำเส้นทาง";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_th = "อุปกรณ์ In-Vehicle-Navigation บางรุ่นมีฟังก์ชันการนำเส้นทางหลายแบบ เลือกการนำเส้นทางที่คุณต้องการใช้ <br/><br/>* คุณสามารถเลือกการนำเส้นทางที่ใช้เพื่อการกำหนดปลายทาง โดยใช้แอพพลิเคชัน In-Vehicle-Navigation ได้ ";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_th = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_th = "เลือกฟังก์ชันการนำเส้นทาง";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_th = "ขนาด: ";
        this.TXT_YELP_0029_th = "เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง";
        this.SL_TXT_0155_th = "เวอร์ชัน ";
        this.SL_TXT_0189_th = "อัปเดต *";
        this.SL_TXT_0191_th = "วันหมดอายุ: ";
        this.SL_TXT_0192_th = "การตั้งค่าการอัปเดตแผนที่";
        this.SL_TXT_0193_th = "ข้อมูลแผนที่ใน In-Vehicle-Navigation สามารถทำการบันทึกข้อมูลชั่วคราวของแผนที่ไปยังสมาร์ทโฟนของคุณได้จากเซิร์ฟเวอร์ เพื่อความสะดวกในครั้งต่อไปสำหรับการเชื่อมต่อกับIn-Vehicle-Navigation คุณสามารถอัปเดตแผนที่ได้";
        this.SL_TXT_0196_th = "อัปเดตการตั้งค่า";
        this.SL_TXT_0197_th = "ตรวจสอบการอัปเดตอัตโนมัติ";
        this.SL_TXT_0198_th = "เซลลูลาร์";
        this.SL_TXT_0199_th = "อัปเดตข้อมูล";
        this.SL_TXT_0200_th = "ดาวน์โหลดทั้งหมด";
        this.SL_TXT_0201_th = "ดาวน์โหลดลงมือถือแล้ว";
        this.SL_TXT_0202_th = "มีอัปเดต";
        this.SL_TXT_0203_th = "อัปเดตแล้ว";
        this.SL_TXT_0204_th = "แผนที่: ";
        this.SL_TXT_0204_A_th = "ยุโรป";
        this.SL_TXT_0205_th = "เวอร์ชัน: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_thを利用　宣言のみ
        this.SL_TXT_0206_th = "ขนาด: * KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_th = "พื้นที่ว่างไม่เพียงพอในสมาร์ทโฟนของท่าน";
        this.SL_TXT_0208_th = "กำหนดค่าการตั้งค่าภูมิภาคด้วย In-Vehicle-Navigation";
        this.SL_TXT_0209_th = "ระยะเวลาการเป็นสมาชิกของข้อมูลแผนที่ของคุณ ได้หมดอายุลงแล้ว กดปุ่ม OK เพื่อดูรายละเอียด";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_th = "โปรดเชื่อมต่อ WiFi เพื่อดาวน์โหลด \n\nข้อมูลในการดาวน์โหลดจำกัดอยู่ที่ 30MB ต่อภูมิภาค ผ่านการเชื่อมต่อข้อมูลมือถือ";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_th = "อัปเดตแผนที่โดยการเชื่อมต่อ In-Vehicle-Navigation เข้ากับสมาร์ทโฟน หลังจากอัปเดตข้อมูล In-Vehicle-Navigation แล้ว ข้อมูลแผนที่จะถูกลบออกจากสมาร์ทโฟนโดยอัตโนมัติ";
        this.SL_TXT_0212_th = "เปิดข้อมูลมือถือแล้ว \n\nคุณสามารถดาวน์โหลดข้อมูลแผนที่ผ่านการเชื่อมต่อข้อมูลมือถือ\nแต่อย่างไรก็ตาม ข้อมูลจำกัดอยู่ที่ 30MB ต่อภูมิภาค\n*อาจเสียค่าบริการข้อมูลเพิ่มเติม\n\nกรุณากดปิด\nหากต้องการดาวน์โหลดผ่าน WiFi";
        this.SL_TXT_0213_th = "เปิดอัปเดตอัตโนมัติแล้ว \n\nดาวน์โหลด\nข้อมูลแผนที่อัตโนมัติและบันทึก\nลงสมาร์ทโฟนของคุณ\n*อาจเสียค่าบริการเพิ่มเติม";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_th = "หากการเชื่อมต่อกับอุปกรณ์ In-Vehicle-Navigation ถูกตัดการเชื่อมต่อ กรุณาลองอีกครั้งหลังจากยืนยันการเชื่อมต่อกับ In-Vehicle-Navigation";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_th = "พื้นที่การจัดเก็บข้อมูล In-Vehicle-Navigation ไม่เพียงพอ กรุณาลองอีกครั้งหลังจากยืนยันการเชื่อมต่อกับ In-Vehicle-Navigation";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_th = "เกิดข้อผิดพลาดระหว่างถ่ายโอนข้อมูล, โปรดลองอีกครั้งในภายหลัง";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_th = "เกิดข้อผิดพลาดขณะดาวน์โหลดข้อมูลของแผนที่จากเซิร์ฟเวอร์, โปรดลองอีกครั้งในภายหลัง";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_th = "พื้นที่การจัดเก็บข้อมูลในสมาร์ทโฟนไม่เพียงพอ โปรดลองอีกครั้งหลังจากลบข้อมูลบางส่วนในสมาร์ทโฟนของคุณ";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_th = "ปิดข้อมูลมือถือแล้ว \n\nกรุณาดาวน์โหลดผ่าน WiFi";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_th = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้งหลังการแก้ไข";
        // SL_TXT_0221 ※OTHER_SIZE_0001_thを利用　宣言のみ
        this.SL_TXT_0221_th = "ขนาด: * MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_th = "OK";
        this.HTML_TXT_0068_th = "โปรดมั่นใจว่าสมาร์ทโฟนไม่ได้อยู่ในโหมดกลางคืนระหว่างดาวน์โหลดข้อมูลแผนที่\nถ้าสามาร์ทโฟนอยู่ในโหมดกลางคืน ให้เข้าแอป SUBARU STARLINK ใหม่";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_th = "ไม่สามารถเริ่มการอัปเดตแผนที่ได้ โปรดตรวจสอบสภาพการนำทางในยานพาหนะ";
        this.HTML_TXT_0165_th = "ฟังก์ชั่นการตั้งค่าอัปเดตแผนที่";
        this.HTML_TXT_0166_th = "1. ดาวน์โหลดข้อมูลแผนที่จากเซิร์ฟเวอร์ไปยังสมาร์ทโฟน<br><br>2. เมื่อเชื่อมต่อสมาร์ทโฟนกับ In-Vehicle-Navigation สมบูรณ์แล้ว ข้อมูลแผนที่จะถูกโอนไปยัง In-Vehicle-Navigation ข้อมูลแผนที่จะถูกลบออกจากสมาร์ทโฟนหลังจากการโอน";
        this.HTML_TXT_0167_th = "* เมื่อสมาร์ทโฟนเชื่อมต่อกับ In-Vehicle-Navigations หลายเครื่อง ข้อมูลการอัปเดตแผนที่จะแสดงข้อมูลของ In-Vehicle-Navigations ที่เชื่อมต่อล่าสุด";
        this.HTML_TXT_0168_th = "การเลือกเขตอัตโนมัติ";
        this.HTML_TXT_0169_th = "ตรวจสอบการอัปเดต";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_th = "การกดปุ่มยกเลิกจะหยุดการเข้าถึงเซิร์ฟเวอร์";
        this.HTML_TXT_0171_th = "เริ่มอัปเดต";
        this.HTML_TXT_0172_th = "ความสามารถของสมาร์ทโฟนไม่เพียงพอต่อการลบข้อมูลบางอย่างในสมาร์ทโฟน กรุณาลองอีกครั้ง";
        this.HTML_TXT_0173_th = "กรุณากด * หากต้องการยกเลิกการดาวน์โหลดข้อมูลแผนที่จากเซิร์ฟเวอร์";
        this.HTML_TXT_0174_th = "กดปุ่มยกเลิกเพื่อยกเลิกการค้นหา";
        this.HTML_TXT_0175_th = "เลือกภูมิภาคจากตำแหน่งปัจจุบันไปยังปลายทางที่ระบุไว้";
        this.HTML_TXT_0176_th = "กำลังถ่ายโอนข้อมูลแผนที่ไปยัง In-Vehicle-Navigation";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_th = "*ติดตั้งข้อมูลแผนที่เสร็จสิ้น";
        this.HTML_TXT_0178_th = "ไม่มีผลการค้นหา กรุณาลองอีกครั้ง.";
        this.HTML_TXT_0179_th = "จุดค้นหาจะเหมือนกับตำแหน่งปัจจุบัน";
        this.HTML_TXT_0180_th = "โปรดเลือกพื้นที่ที่คุณต้องการอัปเดตบนแผนที่";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_th = "การกดปุ่มยกเลิกจะหยุดการเข้าถึงเซิร์ฟเวอร์";
        this.HTML_TXT_0182_th = "ดาวน์โหลดเสร็จสมบูรณ์แล้ว";
        this.HTML_TXT_0183_th = "คุณต้องการลบข้อมูลแผนที่ที่ดาวน์โหลดจากเซิร์ฟเวอร์หรือไม่?";
        this.HTML_TXT_0184_th = "ข้อมูลแผนที่ถูกลบแล้ว";
        this.HTML_TXT_0185_th = "ไม่สามารถลบข้อมูลแผนที่ได้";
        this.HTML_TXT_0186_th = "การดาวน์โหลดจะถูกยกเลิก";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_th = "[ประกาศสำคัญ] <br/>ไม่สามารถเริ่ม SUBARU STARLINK เนื่องจากไม่สามารถใช้งานเวอร์ชันนี้ได้อีกต่อไป <br/> <br/>โปรดติดตั้ง SUBARU STARLINK รุ่นล่าสุดในสมาร์ทโฟนของคุณและลองเปิดอีกครั้ง";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_th = "การจัดสรรหน่วยความจำผิดพลาด";
        this.HTML_TXT_0190_th = "หากการส่งข้อมุลขัดข้อง จะดำเนินการต่ออัตโนมัติเมื่อเชื่อมต่อใหม่อีกครั้ง";
        this.HTML_TXT_0193_th = "APPS";
        this.HTML_TXT_0195_th = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_th = "เลือกภูมิภาคเพื่ออัปเดตแผนที่";
        this.HTML_TXT_0205_A_th = "การตั้งค่าโหมดการแสดงผล";

        this.APP_TXT_0176_th = "ดาวน์โหลดล้มเหลว";   //※暫定

        this.APP_TXT_0358_th = "ใบอนุญาต"; 
        //other (North American Oceans)
        this.LOCATION_999_th = "อื่นๆ ";

        this.HTML_TXT_9999_th = "โอเชียเนีย";
        this.Car_TXT_0245_th = "ที่ตั้งปัจจุบัน";

        this.HTML_TXT_0246_th = "คู่มือผู้ใช้งาน";
        this.HTML_TXT_0247_th = "การอัปเดตข้อมูลแผนที่โดยใช้สมาร์ทโฟน";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // ポルトガル語 pt
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_pt = "Cancelar";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_pt = "Eliminar todos os dados?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_pt = "Foram eliminados todos os dados.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_pt = "VOLTAR";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_pt = "Termos e condições de utilização";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_pt = "Atualizado 04/01/2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_pt = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_pt = "Os dados da aplicação STARLINK serão eliminados.";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_pt = "* Resolve conexão instável com In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_pt = "Excluir dados da aplicação STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_pt = "Seleção de Região";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_pt = "Selecionar sua região principal. ";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_pt = "* Fornece a melhor experiência para aplicações otimizadas em sua região.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_pt = "Selecionar função de navegação";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_pt = "Alguns In-Vehicle-Navigation possuem funções de navegação múltiplas. Selecione uma navegação para utilizar.<br/><br/>*Pode selecionar a navegação utilizada quando definir um destino utilizando a aplicação In-Vehicle-Navigation.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_pt = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_pt = "Selecionar função de navegação";
        //other (North American Oceans)
        this.LOCATION_999_pt = "outros";
        this.HTML_TXT_9999_pt = "Oceania";

        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_pt = "Tamanho: ";
        this.TXT_YELP_0029_pt = "Erro ocorrido. Por favor tente novamente mais tarde.";
        this.SL_TXT_0155_pt = "Ver. ";
        this.SL_TXT_0189_pt = "Atualizado *";
        this.SL_TXT_0191_pt = "Data de Expiração: ";
        this.SL_TXT_0192_pt = "Definições de Atualização de Mapa";
        this.SL_TXT_0193_pt = "Os dados de mapa do In-Vehicle-Navigation podem ser guardados temporariamente no seu smartphone do servidor de distribuição de mapa. A próxima vez que conectar ao In-Vehicle-Navigation, poderá atualizar o mapa.";
        this.SL_TXT_0196_pt = "Defin. de atualização";
        this.SL_TXT_0197_pt = "Verificar atualização automática";
        this.SL_TXT_0198_pt = "Dados móveis";
        this.SL_TXT_0199_pt = "Info. de atualização";
        this.SL_TXT_0200_pt = "Descarregar tudo";
        this.SL_TXT_0201_pt = "Descarregado no smartphone";
        this.SL_TXT_0202_pt = "Atualização disponível";
        this.SL_TXT_0203_pt = "Atualizado";
        this.SL_TXT_0204_pt = "Mapa: ";
        this.SL_TXT_0204_A_pt = "Europa";
        this.SL_TXT_0205_pt = "Versão: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_ptを利用　宣言のみ
        this.SL_TXT_0206_pt = "Tamanho:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_pt = "Não há memória livre suficiente no smartphone.";
        this.SL_TXT_0208_pt = "Configure as definições de região com o In-Vehicle-Navigation.";
        this.SL_TXT_0209_pt = "O prazo da subscrição MapCare terminou. Aceda a www.subaru-maps.com para atualizar.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_pt = "Descarregue através de uma rede WiFi.\n\nDescarregamento de dados é limitado a 30MB por região através de Dados Móveis.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_pt = "Atualizar mapa através da conexão do In-Vehicle-Navigation ao smartphone. Após atualizar In-Vehicle-Navigation, dados de mapa serão eliminados automaticamente do smartphone.";
        this.SL_TXT_0212_pt = "Dados móveis Ligado.\n\nPode descarregar dados de mapa através de dados móveis. \nNo entanto, os dados são limitados a 30MB por região.\n*Taxas de dados podem ser aplicadas.\n\nDesligue.\nse preferir descarregar somente através de uma rede WiFi.";
        this.SL_TXT_0213_pt = "Atualização automática Ligada.\n\nDescarregue automaticamente\nos dados de mapa e guarde\nno seu smartphone\n*Taxas de dados podem ser aplicadas.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_pt = "Conexão com In-Vehicle-Navigation foi desconectada. Tente novamente depois de confirmar a conexão ao In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_pt = "Espaço disponível no In-Vehicle-Navigation insuficiente. Tente novamente depois de confirmar as definições do In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_pt = "Erro ocorrido durante transferência de dados. Por favor tente novamente mais tarde.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_pt = "Erro ocorrido durante transferência de dados de mapa do servidor. Por favor tente novamente mais tarde.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_pt = "Espaço disponível no smartphone insuficiente. Tente novamente mais tarde depois de eliminar dados do seu smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_pt = "Dados móveis Desligado.\n\nDescarregue através de uma rede WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_pt = "Comunicação com o servidor foi desligada. Tente novamente mais tarde depois de a comunicação ser restabelecida.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_ptを利用　宣言のみ
        this.SL_TXT_0221_pt = "Tamanho: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_pt = "OK";       
        this.HTML_TXT_0068_pt = "Certifique-se de que o smartphone não entrará em \"modo de repouso\" enquanto descarrega os dados de mapa.\nSe o smartphone entrar em modo de repouso, inicie o app SUBARU STARLINK novamente.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_pt = "A atualização do mapa não pode iniciar. Verifique o estado do In-Vehicle-Navigation.";
        this.HTML_TXT_0165_pt = "Função para definição de atualização do mapa";
        this.HTML_TXT_0166_pt = "1. Descarregar os dados de mapa do servidor para o smartphone.<br><br>2. Ao ligar o smartphone ao In-Vehicle-Navigation, os dados de mapa são transferidos para o In-Vehicle-Navigation. Os dados de mapa serão apagados do smartphone após a transferência.";
        this.HTML_TXT_0167_pt = "* Quando o smartphone estiver ligado a múltiplos In-Vehicle-Navigations, as informações dos dados de mapa exibidas corresponderão aos dados do In-Vehicle-Navigation ligado mais recentemente.";
        this.HTML_TXT_0168_pt = "Seleção Automática da Região";
        this.HTML_TXT_0169_pt = "Verificar atualizações";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_pt = "Premir o botão Cancelar interrompe o acesso ao servidor.";
        this.HTML_TXT_0171_pt = "Iniciar atualização";
        this.HTML_TXT_0172_pt = "A capacidade do smartphone é insuficiente. Apague alguns dados do smartphone e tente novamente.";
        this.HTML_TXT_0173_pt = "Toque em * se pretender cancelar a transferência dos dados do mapa a partir do servidor.";
        this.HTML_TXT_0174_pt = "Premir o botão Cancelar para cancelar a busca.";
        this.HTML_TXT_0175_pt = "A localização atual até o destino especificado estão selecionados.";
        this.HTML_TXT_0176_pt = "Dados de mapa estão sendo transferidos para In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_pt = "* Instalação de dados de mapa concluída.";
        this.HTML_TXT_0178_pt = "Não há resultados de busca. Tente novamente.";
        this.HTML_TXT_0179_pt = "O ponto de busca é o mesmo da localização atual.";
        this.HTML_TXT_0180_pt = "Por favor selecione a área que deseja atualizar no mapa.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_pt = "O acesso ao servidor é cancelado ao premir o botão Cancelar.";
        this.HTML_TXT_0182_pt = "Download realizado com êxito.";
        this.HTML_TXT_0183_pt = "Gostaria de apagar os dados de mapa descarregados do servidor?";
        this.HTML_TXT_0184_pt = "Dados de mapa foram apagados.";
        this.HTML_TXT_0185_pt = "Não foi possível apagar os dados de mapa.";
        this.HTML_TXT_0186_pt = "Download será cancelado.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_pt = "[Aviso importante]<br/>SUBARU STARLINK não pode ser iniciado uma vez que esta versão já não é suportada.<br/><br/>Instale a versão mais recente de SUBARU STARLINK no smartphone e tente iniciar novamente.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_pt = "Erro de alocação de memória";
        this.HTML_TXT_0190_pt = "Se a transferência de dados é interrompida, ela será automaticamente retomada depois da reconexão.";
        this.HTML_TXT_0193_pt = "APPS";
        this.HTML_TXT_0195_pt = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_pt = "Seleção de Região de atualização do mapa";
        this.HTML_TXT_0205_A_pt = "Definição do modo de exibição";

        this.APP_TXT_0176_pt = "Falha de transferência.";   //※暫定

        this.APP_TXT_0358_pt = "Licença"; 
        this.Car_TXT_0245_pt = "Localização atual";

        this.HTML_TXT_0246_pt = "Manual do Utilizador";
        this.HTML_TXT_0247_pt = "Atualizar os dados do Mapa usando um smartphone";

        // ----- Harman OTA GEN4 対応 -----<

        // ----- Harman OTA GEN4 対応 ----->
        ////////////////////////////////////////////////////////////////
        // ブラジルポルトガル語 pt_BR
        ////////////////////////////////////////////////////////////////
    	// キャンセルボタン(4Car_TXT_0112)
        this.APP_024_pt_BR = "Cancelar";
        //other (North American Oceans)
        this.LOCATION_999_pt_BR = "outros";
        this.HTML_TXT_9999_pt_BR = "Oceania";

        this.copyWord('pt', 'pt_BR');
        this.HTML_TXT_0163_pt_BR = "Não há aplicativo relevante para operar este processo.";
        this.HTML_TXT_0164_pt_BR = "A atualização do mapa não pode iniciar. Verifique o estado do In-Vehicle-Navigation.";
        this.HTML_TXT_0165_pt_BR = "Função para configuração de atualização do mapa";
        this.HTML_TXT_0166_pt_BR = "1. Baixar os dados de mapa do servidor para o smartphone.<br><br>2. Ao conectar o smartphone ao In-Vehicle-Navigation, os dados de mapa são transferidos para o In-Vehicle-Navigation. Os dados de mapa serão apagados do smartphone após a transferência.";
        this.HTML_TXT_0167_pt_BR = "* Quando o smartphone estiver conectado a múltiplos In-Vehicle-Navigations, as informações dos dados de mapa exibidas corresponderão aos dados do In-Vehicle-Navigation conectado mais recentemente.";
        this.HTML_TXT_0170_pt_BR = "Pressionar o botão Cancelar interrompe o acesso ao servidor.";
        this.HTML_TXT_0173_pt_BR = "Toque *, se você cancelar o download de dados de mapa do servidor.";
        this.HTML_TXT_0174_pt_BR = "Pressionar o botão Cancelar para cancelar a busca.";
        this.HTML_TXT_0181_pt_BR = "O acesso ao servidor é cancelado ao pressionar o botão Cancelar.";
        this.HTML_TXT_0183_pt_BR = "Gostaria de apagar os dados de mapa baixados do servidor?";
        this.HTML_TXT_0190_pt_BR = "Se a transferência de dados é interrompida, ela será automaticamente retomada depois da reconexão.";
        this.HTML_TXT_0205_pt_BR = "Seleção de Região de atualização do mapa";
        this.HTML_TXT_0205_A_pt_BR = "Definição do modo de exibição";
        this.CONFIG_001_pt_BR = "VOLTAR";
        this.APP_TXT_0176_pt_BR = "Falha ao baixar";
        this.APP_TXT_0358_pt_BR = "Licença";
        this.TXT_YELP_0029_pt_BR = "Erro ocorrido. Por favor tente novamente mais tarde.";
        this.CONFIG_008_pt_BR = "Seleção de Região";
        this.SL_TXT_0157_pt_BR = "United States";
        this.SL_TXT_0158_pt_BR = "Canada";
        this.SL_TXT_0159_pt_BR = "México";
        this.SL_TXT_0191_pt_BR = "Data de Expiração: ";
        this.SL_TXT_0192_pt_BR = "Definições de Atualização de Mapa";
        this.SL_TXT_0193_pt_BR = "Os dados de mapa do In-Vehicle-Navigation podem ser salvos temporariamente no seu smartphone do servidor de distribuição de mapa. A próxima vez que conectar ao In-Vehicle-Navigation, você poderá atualizar o mapa.";
        this.SL_TXT_0197_pt_BR = "Verificar atualização automática";
        this.SL_TXT_0198_pt_BR = "Dados móveis";
        this.SL_TXT_0199_pt_BR = "Info. de atualização";
        this.SL_TXT_0200_pt_BR = "Descarregar tudo";
        this.SL_TXT_0201_pt_BR = "Baixado no smartphone";
        this.SL_TXT_0202_pt_BR = "Atualização disponível";
        this.SL_TXT_0203_pt_BR = "Atualizado";
        this.SL_TXT_0204_pt_BR = "Mapa: ";
        this.SL_TXT_0205_pt_BR = "Versão: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_ptを利用　宣言のみ
        this.SL_TXT_0206_pt_BR = "Tamanho:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_pt_BR = "Não há memória livre suficiente no smartphone.";
        this.SL_TXT_0208_pt_BR = "Configure as definições de região com o In-Vehicle-Navigation.";
        this.SL_TXT_0209_pt_BR = "O prazo da subscrição MapCare terminou. Visite www.subaru-maps.com para atualizar.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_pt_BR = "Baixe através de uma rede WiFi.\n\nDownload de dados é limitado a 30MB por região através de Dados Móveis.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_pt_BR = "Atualizar mapa através da conexão do In-Vehicle-Navigation ao smartphone. Após atualizar In-Vehicle-Navigation, dados de mapa serão apagados automaticamente do smartphone.";
        this.SL_TXT_0212_pt_BR = "Dados móveis Ligado.\n\nVocê pode baixar dados de mapa através de dados móveis. \nNo entanto, os dados são limitados a 30MB por região.\n*Taxas de dados podem ser aplicadas.\n\nDesligue.\nse você prefere baixar somente através de uma rede WiFi.";
        this.SL_TXT_0213_pt_BR = "Atualização automática Ligada.\n\nBaixe automaticamente\nos dados de mapa e salve\nno seu smartphone\n*Taxas de dados podem ser aplicadas.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_pt_BR = "Conexão com In-Vehicle-Navigation foi desconectada. Tente novamente depois de confirmar a conexão ao In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_pt_BR = "Espaço disponível no In-Vehicle-Navigation insuficiente. Tente novamente depois de confirmar as definições do In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_pt_BR = "Erro ocorrido durante transferência de dados. Por favor tente novamente mais tarde.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_pt_BR = "Erro ocorrido durante transferência de dados de mapa do servidor. Por favor tente novamente mais tarde.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_pt_BR = "Espaço disponível no smartphone insuficiente. Tente novamente mais tarde depois de apagar dados do seu smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_pt_BR = "Dados móveis Desligado.\n\nBaixe através de uma rede WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_pt_BR = "Comunicação com o servidor foi desconectada. Tente novamente mais tarde depois de a comunicação ser restabelecida.";
        this.HTML_TXT_0068_pt_BR = "Certifique-se de que o smartphone não entrará em \"modo de repouso\" enquanto baixa os dados de mapa.\nSe o smartphone entrar em modo de repouso, inicie o app SUBARU STARLINK novamente.";
        this.HTML_TXT_0168_pt_BR = "Seleção Automática da Região";
        this.HTML_TXT_0169_pt_BR = "Verificar atualizações";
        this.HTML_TXT_0171_pt_BR = "Iniciar atualização";
        this.HTML_TXT_0172_pt_BR = "A capacidade do smartphone é insuficiente. Apague alguns dados do smartphone e tente novamente.";
        this.HTML_TXT_0175_pt_BR = "A localização atual até o destino especificado estão selecionados.";
        this.HTML_TXT_0176_pt_BR = "Dados de mapa estão sendo transferidos para In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_pt_BR = "* Instalação de dados de mapa concluída.";
        this.HTML_TXT_0178_pt_BR = "Não há resultados de busca. Tente novamente.";
        this.HTML_TXT_0179_pt_BR = "O ponto de busca é o mesmo da localização atual.";
        this.HTML_TXT_0180_pt_BR = "Por favor selecione a área que deseja atualizar no mapa.";
        this.HTML_TXT_0182_pt_BR = "Download realizado com êxito.";
        this.HTML_TXT_0184_pt_BR = "Dados de mapa foram apagados.";
        this.HTML_TXT_0185_pt_BR = "Não foi possível apagar os dados de mapa.";
        this.HTML_TXT_0186_pt_BR = "Download será cancelado.";
        this.HTML_TXT_0195_pt_BR = "“Copyright (C) TomTom International BV 2018”";
        this.LOCATION_999_pt_BR = "outros";
        this.Car_TXT_0245_pt_BR = "Localização atual";

        this.HTML_TXT_0246_pt_BR = "Manual do Utilizador";
        this.HTML_TXT_0247_pt_BR = "Atualizar os dados do Mapa usando um smartphone";

        // ----- Harman OTA GEN4 対応 -----<

        ////////////////////////////////////////////////////////////////
        // ノルウェー語 no
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_no = "Avbryt";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_no = "Slette alle dataene?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_no = "Alle dataene ble slettet.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_no = "TILBAKE";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_no = "Vilkår og betingelser for bruk";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_no = "Oppdatert 04/01/2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_no = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_no = "STARLINK-applikasjonsdata slettes.";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_no = "* Løser ustabil tilkobling med In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_no = "Slett STARLINK-applikasjonsdata";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_no = "Valg av region";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_no = "Velg hovedregionen din..";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_no = "* Gir best opplevelse for apper som er optimert i din region.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_no = "Velg navigasjonsfunksjon";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_no = "Noen In-Vehicle-Navigation har flere navigasjonsfunksjoner. Velg en navigasjon som skal brukes.<br/><br/>*Du kan velge navigasjonen som ble brukt ved innstilling av en destinasjon med In-Vehicle-Navigation-applikasjonen.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_no = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_no = "Velg navigasjonsfunksjon";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_no = "Størrelse: ";
        this.TXT_YELP_0029_no = "Feil oppsto. Prøv igjen senere.";
        this.SL_TXT_0155_no = "Ver. ";
        this.SL_TXT_0189_no = "Oppdatert *";
        this.SL_TXT_0191_no = "Utløpsdato: ";
        this.SL_TXT_0192_no = "Kartoppdateringsinnstillinger";
        this.SL_TXT_0193_no = "In-Vehicle-Navigation-kartdata kan midlertidig lagres på smarttelefonen fra kartdistribueringsserveren. Neste gang du kobler til In-Vehicle-Navigation, kan du oppdatere kartet.";
        this.SL_TXT_0196_no = "Oppdateringsinnst.";
        this.SL_TXT_0197_no = "Sjekk automatisk oppdatering";
        this.SL_TXT_0198_no = "Mobil";
        this.SL_TXT_0199_no = "Oppdateringsinfo.";
        this.SL_TXT_0200_no = "Last ned alle";
        this.SL_TXT_0201_no = "Nedlastet på mobil";
        this.SL_TXT_0202_no = "Oppdatering tilgjengelig";
        this.SL_TXT_0203_no = "Oppdatert";
        this.SL_TXT_0204_no = "Kart: ";
        this.SL_TXT_0204_A_no = "Europa";
        this.SL_TXT_0205_no = "Versjon: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_noを利用　宣言のみ
        this.SL_TXT_0206_no = "Størrelse:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_no = "Det er ikke nok tilgjengelig plass på smarttelefonen.";
        this.SL_TXT_0208_no = "Konfigurer regionsinnstillingene med In-Vehicle-Navigation.";
        this.SL_TXT_0209_no = "Kartdataabonnementet utløper. Trykk på OK-knappen for detaljer.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_no = "Last ned over Wi-Fi.\n\nNedlastningsdata er begrenset til 30 MB per region via mobildata.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_no = "Oppdatert kart ved å koble In-Vehicle-Navigation til smarttelefonen. Etter oppdatering av In-Vehicle-Navigation, slettes kartdata automatisk fra smarttelefonen.";
        this.SL_TXT_0212_no = "Mobildata PÅ.\n\nDu kan laste ned kartdata via mobildataforbindelse.\nData er derimot begrenset til 30 MB per region.\n*Datagebyrer kan påløpe.\n\nSlå AV\nhvis du kun vil laste ned via Wi-Fi.";
        this.SL_TXT_0213_no = "Automatisk oppdatering PÅ.\nLast automatisk\nned kartdata og lagre det på\nsmarttelefonen\n*Datagebyrer kan påløpe.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_no = "Tilkobling til In-Vehicle-Navigation var frakoblet. Prøv igjen etter bekreftelse av tilkobling til In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_no = "Utilstrekkelig In-Vehicle-Navigation-lagringsplass tilgjengelig. Prøv igjen etter bekreftelse av In-Vehicle-Navigation-innstillinger.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_no = "Feil oppsto under dataoverføring. Prøv igjen senere.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_no = "Feil oppsto under nedlastning av kartdata fra serveren. Prøv igjen senere.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_no = "Utilstrekkelig tilgjengelig lagringsplass på smarttelefon. Prøv igjen etter sletting av data fra smarttelefonen.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_no = "Mobildata AV.\n\nLast ned via Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_no = "Kommunikasjon med server ble frakoblet. Prøv igjen når kommunikasjonen er gjenopprettet.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_noを利用　宣言のみ
        this.SL_TXT_0221_no = "Størrelse: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_no = "OK";       
        this.HTML_TXT_0068_no = "Sørg for at smarttelefonen ikke går inn i hvilemodus under nedlastning av kartdata.\nHvis smarttelefonen går inn i hvilemodus starter du SUBARU STARLINK-appen igjen.";  
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_no = "Kartoppdateringen kan ikke starte. Sjekk statusen til In-Vehicle-Navigation.";
        this.HTML_TXT_0165_no = "Innstillingsfunksjon for kartoppdatering";
        this.HTML_TXT_0166_no = "1. Last ned kartdataene fra serveren til smarttelefonen.<br><br>2. Ved tilkobling av smarttelefonen til In-Vehicle-Navigation, overføres kartdata til In-Vehicle-Navigation. Kartdataene slettes fra smarttelefonen etter overføring.";
        this.HTML_TXT_0167_no = "* Når smarttelefonen er koblet til flere In-Vehicle-Navigations, viser kartoppdateringsinformasjonen dataene til den sist tilkoblede In-Vehicle-Navigation.";
        this.HTML_TXT_0168_no = "Automatisk valg av region";
        this.HTML_TXT_0169_no = "Se etter oppdatering";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_no = "Trykk på Avbryt-knappen stopper tilgang til serveren.";
        this.HTML_TXT_0171_no = "Start oppdatering";
        this.HTML_TXT_0172_no = "Smarttelefonen har ikke tilstrekkelig kapasitet. Slett noe data på smarttelefonen og prøv igjen.";
        this.HTML_TXT_0173_no = "Trykk på * hvis du vil avbryte nedlastning av kartdata fra serveren.";
        this.HTML_TXT_0174_no = "Trykk på Avbryt-knappen for å avbryte søket.";
        this.HTML_TXT_0175_no = "Regionen fra det aktuelle stedet til den spesifiserte destinasjonen velges.";
        this.HTML_TXT_0176_no = "Kartdata overføres til In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_no = "* Kartdatainstallasjon fullført";
        this.HTML_TXT_0178_no = "Det er ingen søkeresultater. Prøv igjen.";
        this.HTML_TXT_0179_no = "Søkepunktet er det samme som aktuelt sted.";
        this.HTML_TXT_0180_no = "Velg området som du vil oppdatere på kartet.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_no = "Trykk på Avbryt-knappen stopper tilgang til serveren.";
        this.HTML_TXT_0182_no = "Nedlastning fullført.";
        this.HTML_TXT_0183_no = "Vil du slette kartdataene som er lastet ned fra serveren?";
        this.HTML_TXT_0184_no = "Kartdata har blitt slettet.";
        this.HTML_TXT_0185_no = "Kunne ikke slette kartdata.";
        this.HTML_TXT_0186_no = "Nedlastning avbrytes.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_no = "[Viktig merknad]<br/>SUBARU STARLINK kan ikke startes da det ikke lenger er støtte for denne versjonen.<br/><br/>Installer siste versjon av SUBARU STARLINK på smarttelefonen og prøv å starte det igjen.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_no = "Minnetilordningsfeil";
        this.HTML_TXT_0190_no = "Hvis dataoverføring avbrytes så fortsetter overføringen automatisk  ved gjenopprettet forbindelse.";
        this.HTML_TXT_0193_no = "APPS";
        this.HTML_TXT_0195_no = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_no = "Valg av region for kartoppdatering";
        this.HTML_TXT_0205_A_no = "Innstillingsmodusinnstilling";

        this.APP_TXT_0176_no = "Nedlastning mislyktes.";   //※暫定

        this.APP_TXT_0358_no = "Lisens"; 
        //other (North American Oceans)
        this.LOCATION_999_no = "annet";
        this.HTML_TXT_9999_no = "Oceania";
        this.Car_TXT_0245_no = "Nåværende beliggenhet";

        this.HTML_TXT_0246_no = "Brukerhåndbok";
        this.HTML_TXT_0247_no = "Oppdatere kartdata ved hjelp av en smarttelefon";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // Chinese(簡体字) zh_CN 
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_zh_CN = "取消";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_zh_CN = "是否删除所有数据？";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_zh_CN = "已删除所有数据。";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_zh_CN = "返回";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_zh_CN = "使用条款";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_zh_CN = "更新于 2017年04月01日";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_zh_CN = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_zh_CN = "将会删除STARLINK应用程序的设置数据。";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_zh_CN = "※当与In-Vehicle-Navigation连接不稳定时尝试此操作。";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_zh_CN = "清除STARLINK应用程序数据";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_zh_CN = "选择使用区域";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_zh_CN = "选择您的主要使用区域。";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_zh_CN = "※根据您的区域提供最优的应用程序。";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_zh_CN = "选择导航功能";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_zh_CN = "部分In-Vehicle-Navigation上有多个导航功能。请选择您要使用的导航。<br/><br/>*当使用In-Vehicle-Navigation应用程序设置目的地时可选择导航使用。";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_zh_CN = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_zh_CN = "选择导航功能";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_zh_CN = "大小：";
        this.TXT_YELP_0029_zh_CN = "发生错误。请稍后重试。";
        this.SL_TXT_0155_zh_CN = "版本";
        this.SL_TXT_0189_zh_CN = "更新于 *";
        this.SL_TXT_0191_zh_CN = "有效期限：";
        this.SL_TXT_0192_zh_CN = "地图更新设置";
        this.SL_TXT_0193_zh_CN = "可从地图分发服务器上临时保存In-Vehicle-Navigation地图数据至您的智能手机。当下次连接至In-Vehicle-Navigation时即可更新地图。";
        this.SL_TXT_0196_zh_CN = "更新设置";
        this.SL_TXT_0197_zh_CN = "检查自动更新";
        this.SL_TXT_0198_zh_CN = "手机移动数据";
        this.SL_TXT_0199_zh_CN = "更新信息";
        this.SL_TXT_0200_zh_CN = "全部下載";
        this.SL_TXT_0201_zh_CN = "移动下载";
        this.SL_TXT_0202_zh_CN = "有可用更新";
        this.SL_TXT_0203_zh_CN = "已更新";
        this.SL_TXT_0204_zh_CN = "地图：";
        this.SL_TXT_0204_A_zh_CN = "欧洲";
        this.SL_TXT_0205_zh_CN = "版本：";
        // SL_TXT_0206 ※OTHER_SIZE_0001_zh_CNを利用　宣言のみ
        this.SL_TXT_0206_zh_CN = "大小：*KB";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_zh_CN = "智能手机没有足够的可用空间。";
        this.SL_TXT_0208_zh_CN = "使用In-Vehicle-Navigation进行区域设置。";
        this.SL_TXT_0209_zh_CN = "您的 MapCare 订阅已到期。请访问 www.subaru-maps.com 更新您的订阅。";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_zh_CN = "请通过 WiFi 下载。\n\n通过 Mobile Data 下载数据每个区域限制为 30MB。";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_zh_CN = "请将In-Vehicle-Navigation连接至智能手机更新地图。更新In-Vehicle-Navigation后地图数据将自动从智能手机上删除。";
        this.SL_TXT_0212_zh_CN = "Mobile Data 开启。\n\n您可以通过移动数据连接下载地图数据。\n但是，每个区域数据限制为 30MB。\n*可能会收取数据费。\n\n请关闭。\n如果您仅想通过 WiFi 下载。";
        this.SL_TXT_0213_zh_CN = "自动更新开启。\n\n自动下载\n地图数据并保存\n到您的智能手机\n*可能会收取数据费。";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_zh_CN = "与In-Vehicle-Navigation的连接中断。请确认正确连接至In-Vehicle-Navigation后重试。";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_zh_CN = "In-Vehicle-Navigation的可用存储空间不足。请确认In-Vehicle-Navigation的设置后重试。";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_zh_CN = "在数据传送过程中发生错误。请稍后重试。";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_zh_CN = "在从服务器上下载地图数据的过程中发生错误。请稍后重试。";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_zh_CN = "智能手机的可用存储空间不足。请删除智能手机内的无用数据后重试。";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_zh_CN = "Mobile Data 关闭。\n\n请通过 WiFi 下载。";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_zh_CN = "与服务器的通信已断开。请在通信重新建立后再试。";
        // SL_TXT_0221 ※OTHER_SIZE_0001_zh_CNを利用　宣言のみ
        this.SL_TXT_0221_zh_CN = "大小：*MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_zh_CN = "OK";       
        this.HTML_TXT_0068_zh_CN = "下载地图数据时请确保智能手机不会进入休眠模式。\n如果智能手机进入休眠模式，请再次启动 SUBARU STARLINK 应用程序。";  
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_zh_CN = "无法启动地图更新。请检查 In-Vehicle-Navigation 的状态。";
        this.HTML_TXT_0165_zh_CN = "地图更新设置功能";
        this.HTML_TXT_0166_zh_CN = "1.从服务器上下载地图数据至智能手机。<br><br>2.将智能手机连接至In-Vehicle-Navigation时，地图数据会被传输至In-Vehicle-Navigation。传输完成后将会从智能手机上删除地图数据。";
        this.HTML_TXT_0167_zh_CN = "* 当智能手机连接至多个In-Vehicle-Navigations时，地图更新信息将显示最后连接的In-Vehicle-Navigation的数据。";
        this.HTML_TXT_0168_zh_CN = "地区自动选择";
        this.HTML_TXT_0169_zh_CN = "检查更新";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_zh_CN = "按下取消按钮停止访问服务器。";
        this.HTML_TXT_0171_zh_CN = "开始更新";
        this.HTML_TXT_0172_zh_CN = "智能手机的容量不足。请删除智能手机上的部分数据，然后重试。";
        this.HTML_TXT_0173_zh_CN = "如果要取消从服务器下载地图数据，请触按 * 键。";
        this.HTML_TXT_0174_zh_CN = "按下取消按钮以取消搜索。";
        this.HTML_TXT_0175_zh_CN = "已选择从当前位置到指定目的地之间的地区。";
        this.HTML_TXT_0176_zh_CN = "地图数据正在被传输至In-Vehicle-Navigation。";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_zh_CN = "*地图数据安装完成";
        this.HTML_TXT_0178_zh_CN = "没有搜索结果。请重试。";
        this.HTML_TXT_0179_zh_CN = "搜索位置与当前位置相同。";
        this.HTML_TXT_0180_zh_CN = "请选择您想在地图上更新的区域。";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_zh_CN = "按下取消按钮停止访问服务器。";
        this.HTML_TXT_0182_zh_CN = "下载成功。";
        this.HTML_TXT_0183_zh_CN = "您是否要从服务器删除已下载的地图数据？";
        this.HTML_TXT_0184_zh_CN = "已删除地图数据。";
        this.HTML_TXT_0185_zh_CN = "无法删除地图数据。";
        this.HTML_TXT_0186_zh_CN = "将会取消下载。";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_zh_CN = "[重要通知]<br/>SUBARU STARLINK无法启动，因为不再支持此版本。<br/><br/>请在您的智能手机上下载最新版本的SUBARU STARLINK，然后重新启动。";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_zh_CN = "内存分配错误";
        this.HTML_TXT_0190_zh_CN = "如果数据传输中断，它会在重新连接后自动恢复。";
        this.HTML_TXT_0193_zh_CN = "APPS";
        this.HTML_TXT_0195_zh_CN = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_zh_CN = "地图更新区域选择";
        this.HTML_TXT_0205_A_zh_CN = "显示模式设置";

        this.APP_TXT_0176_zh_CN = "下载失败。";   //※暫定

        this.APP_TXT_0358_zh_CN = "许可证"; 
        //other (North American Oceans)
        this.LOCATION_999_zh_CN = "其他";
        this.HTML_TXT_9999_zh_CN = "大洋洲";
        this.Car_TXT_0245_zh_CN = "当前位置";

        this.HTML_TXT_0246_zh_CN = "用户手册";
        this.HTML_TXT_0247_zh_CN = "使用智能手机更新地图数据";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // Chinese(繁体字) zh_TW
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_zh_TW = "取消";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_zh_TW = "要刪除所有數據嗎？";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_zh_TW = "已刪除所有數據。";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_zh_TW = "上一步";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_zh_TW = "使用守則";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_zh_TW = "2017年04月01日 更新";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_zh_TW = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_zh_TW = "STARLINK應用程式內的數據將被刪除";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_zh_TW = "※當與In-Vehicle-Navigation連線不穩定時嘗試此操作。";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_zh_TW = "刪除STARLINK應用程式內的數據";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_zh_TW = "選擇使用地區";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_zh_TW = "請選擇您主要的使用地區。";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_zh_TW = "※本系統將提供最適合該使用地區的應用程式。";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_zh_TW = "選擇導航功能";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_zh_TW = "部分In-Vehicle-Navigation有多種導航功能。請選擇您需要的導航裝置。<br/><br/>*以In-Vehicle-Navigation應用程式選擇目的地時，可以選擇導航裝置。";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_zh_TW = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_zh_TW = "選擇導航功能";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_zh_TW = "檔案大小：";
        this.TXT_YELP_0029_zh_TW = "發生錯誤。請稍後重試。";
        this.SL_TXT_0155_zh_TW = "版本";
        this.SL_TXT_0189_zh_TW = "* 更新";
        this.SL_TXT_0191_zh_TW = "有效期限：";
        this.SL_TXT_0192_zh_TW = "地圖更新設定";
        this.SL_TXT_0193_zh_TW = "In-Vehicle-Navigation中的地圖數據可以從地圖配送伺服器暫存於您的智慧型手機裡。當您下次連接In-Vehicle-Navigation時，就能更新地圖。";
        this.SL_TXT_0196_zh_TW = "更新設定";
        this.SL_TXT_0197_zh_TW = "檢查自動更新";
        this.SL_TXT_0198_zh_TW = "行動數據";
        this.SL_TXT_0199_zh_TW = "更新資訊";
        this.SL_TXT_0200_zh_TW = "全部下載";
        this.SL_TXT_0201_zh_TW = "手機下載";
        this.SL_TXT_0202_zh_TW = "有可用更新";
        this.SL_TXT_0203_zh_TW = "已更新";
        this.SL_TXT_0204_zh_TW = "地圖：";
        this.SL_TXT_0204_A_zh_TW = "歐洲";
        this.SL_TXT_0205_zh_TW = "版本：";
        // SL_TXT_0206 ※OTHER_SIZE_0001_zh_TWを利用　宣言のみ
        this.SL_TXT_0206_zh_TW = "檔案大小：";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_zh_TW = "智慧手機沒有足夠的可用空間。";
        this.SL_TXT_0208_zh_TW = "使用In-Vehicle-Navigation進行區域設定。";
        this.SL_TXT_0209_zh_TW = "您的 MapCare 訂閱已到期。請前往 www.subaru-maps.com 更新訂閱。";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_zh_TW = "請透過 WiFi 下載。\n\n透過行動數據下載的資料，每區域限定 30MB。";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_zh_TW = "請連接智慧型手機與In-Vehicle-Navigation以更新地圖。In-Vehicle-Navigation更新後，地圖數據會自動從智慧型手機中刪除。";
        this.SL_TXT_0212_zh_TW = "行動數據開啟。\n\n您可透過行動數據連線下載地圖資料。\n但資料量每區限定為 30MB。\n*可能會收取流量費用。\n\n若您希望透過 WiFi 下載，\n請關閉此功能。";
        this.SL_TXT_0213_zh_TW = "自動更新開啟。\n\n自動下載\n地圖資料並儲存\n在您的智慧型手機上。e\n*可能會收取流量費用。";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_zh_TW = "與In-Vehicle-Navigation連線中斷。請確認與In-Vehicle-Navigation之連線後重試。";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_zh_TW = "In-Vehicle-Navigation儲存空間不足。請確認In-Vehicle-Navigation之設定後重試。";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_zh_TW = "數據傳輸中發生錯誤。請稍候重試。";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_zh_TW = "從伺服器下載地圖數據時發生錯誤。請稍後重試。";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_zh_TW = "智慧型手機剩餘空間不足。請刪除您智慧型手機內的資料後重試。";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_zh_TW = "行動數據關閉。\n\n請透過 WiFi 下載。";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_zh_TW = "與伺服器之間的通訊已中斷。請在連線恢復之後再試一次。";
        // SL_TXT_0221 ※OTHER_SIZE_0001_zh_TWを利用　宣言のみ
        this.SL_TXT_0221_zh_TW = "檔案大小：*MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_zh_TW = "OK";     
        this.HTML_TXT_0068_zh_TW = "下載地圖資料過程中，請確認智慧型手機不會進入睡眠模式。\n若智慧型手機進入睡眠模式，請再次啟動 SUBARU STARLINK 應用程式。";  
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_zh_TW = "無法開始更新地圖。請檢查車內導航的狀態。";
        this.HTML_TXT_0165_zh_TW = "地圖更新設定功能";
        this.HTML_TXT_0166_zh_TW = "1.將地圖數據從伺服器下載到智慧型手機。<br><br>2.將智慧型手機連接至In-Vehicle-Navigation時，地圖數據將傳輸至In-Vehicle-Navigation。 傳輸後，地圖數據將從智慧型手機中刪除。";
        this.HTML_TXT_0167_zh_TW = "※當智慧型手機連接到多個In-Vehicle-Navigation時，地圖更新訊息將顯示最近連接的In-Vehicle-Navigation的數據。";
        this.HTML_TXT_0168_zh_TW = "自動選擇地區";
        this.HTML_TXT_0169_zh_TW = "檢查更新";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_zh_TW = "按取消鍵可停止連接伺服器。";
        this.HTML_TXT_0171_zh_TW = "開始更新";
        this.HTML_TXT_0172_zh_TW = "智慧型手機的容量不足。請刪除智慧型手機上的部份數據後重試。";
        this.HTML_TXT_0173_zh_TW = "若您希望取消從伺服器下載地圖的動作，請輕點 *。";
        this.HTML_TXT_0174_zh_TW = "按取消鍵可停止搜尋。";
        this.HTML_TXT_0175_zh_TW = "選擇現在地點到目的地的行經區域。";
        this.HTML_TXT_0176_zh_TW = "地圖數據正在傳輸到In-Vehicle-Navigation。";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_zh_TW = "*地圖資料安裝完成";
        this.HTML_TXT_0178_zh_TW = "找不到符合的搜尋結果。請重試。";
        this.HTML_TXT_0179_zh_TW = "搜尋地點與現在地點相同。";
        this.HTML_TXT_0180_zh_TW = "請在地圖上選擇欲更新的區域。";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_zh_TW = "按取消鍵可停止連接伺服器。";
        this.HTML_TXT_0182_zh_TW = "下載成功";
        this.HTML_TXT_0183_zh_TW = "您是否要刪除從伺服器上下載的地圖數據？";
        this.HTML_TXT_0184_zh_TW = "地圖數據已刪除。";
        this.HTML_TXT_0185_zh_TW = "無法刪除地圖數據。";
        this.HTML_TXT_0186_zh_TW = "停止下載。";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_zh_TW = "[重要通知] <br/>本機不再支援此版本的SUBARU STARLINK，故無法啟動。<br/> <br/>請在您的智慧型手機上安裝最新版本的SUBARU STARLINK後，再次嘗試啟動。";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_zh_TW = "記憶體配置錯誤";
        this.HTML_TXT_0190_zh_TW = "若資料傳輸遭到中斷，會於重新連線時自動繼續。";
        this.HTML_TXT_0193_zh_TW = "APPS";
        this.HTML_TXT_0195_zh_TW = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_zh_TW = "地圖更新區域選擇";
        this.HTML_TXT_0205_A_zh_TW = "顯示模式設置";

        this.APP_TXT_0176_zh_TW = "下載失敗。";   //※暫定

        this.APP_TXT_0358_zh_TW = "授權"; 
        //other (North American Oceans)
        this.LOCATION_999_zh_TW = "其他";
        this.HTML_TXT_9999_zh_TW = "大洋洲";

        this.Car_TXT_0245_zh_TW = "當前位置";

        this.HTML_TXT_0246_zh_TW = "使用者手冊";
        this.HTML_TXT_0247_zh_TW = "使用智慧型手機更新地圖資料";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // マレー語 ms
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_ms = "Batal";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_ms = "Padamkan semua data?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_ms = "Semua data telah dipadamkan.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_ms = "KEMBALI";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_ms = "Terma dan Syarat Penggunaan";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_ms = "Dikemas kini 01/04/2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_ms = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_ms = "Data aplikasi STARLINK akan dipadamkan.";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_ms = "* Menyelesaikan masalah sambungan yang tidak stabil dengan In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_ms = "Kosongkan data aplikasi STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_ms = "Pemilihan kawasan";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_ms = "Pilih kawasan utama anda.";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_ms = "* Memberikan pengalaman terbaik untuk apl yang dioptimumkan di kawasan anda.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_ms = "Pilih fungsi navigasi";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_ms = "Sesetengah In-Vehicle-Navigation mempunyai berbilang fungsi navigasi. Pilih navigasi untuk digunakan.<br/><br/>*Anda boleh memilih navigasi yang digunakan semasa menetapkan destinasi menggunakan aplikasi In-Vehicle-Navigation.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_ms = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_ms = "Pilih fungsi navigasi";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_ms = "Saiz: ";
        this.TXT_YELP_0029_ms = "Ralat berlaku.Sila cuba lagi kemudian.";
        this.SL_TXT_0155_ms = "Ver. ";
        this.SL_TXT_0189_ms = "Dikemas kini *";
        this.SL_TXT_0191_ms = "Tarikh Luput: ";
        this.SL_TXT_0192_ms = "Tetapan Kemas Kini Peta";
        this.SL_TXT_0193_ms = "Data peta In-Vehicle-Navigation boleh disimpan buat sementara ke telefon pintar anda dari pelayan pengedaran peta. Apabila anda menyambung ke In-Vehicle-Navigation seterusnya, anda boleh mengemas kini peta.";
        this.SL_TXT_0196_ms = "Tetapan kemas kini";
        this.SL_TXT_0197_ms = "Semak kemas kini auto";
        this.SL_TXT_0198_ms = "Selular";
        this.SL_TXT_0199_ms = "Kemas kini maklumat";
        this.SL_TXT_0200_ms = "Muat turun semua";
        this.SL_TXT_0201_ms = "Dimuat turun dalam mudah alih";
        this.SL_TXT_0202_ms = "Kemas kini tersedia";
        this.SL_TXT_0203_ms = "Dikemas kini";
        this.SL_TXT_0204_ms = "Peta: ";
        this.SL_TXT_0204_A_ms = "Eropah";
        this.SL_TXT_0205_ms = "Versi: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_msを利用　宣言のみ
        this.SL_TXT_0206_ms = "Saiz:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_ms = "Tiada ruang yang mencukupi pada telefon pintar.";
        this.SL_TXT_0208_ms = "Konfigurasikan seting rantau dengan In-Vehicle-Navigation.";
        this.SL_TXT_0209_ms = "Langganan data peta anda telah tamat tempoh. Tekan butang OK untuk butiran.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_ms = "Sila muat turun melalui WiFi.\n\nMuat turun data dihadkan kepada 30MB setiap rantau melalui Data Mudah Alih.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_ms = "Kemas kini peta dengan menyambungkan In-Vehicle-Navigation ke telefon pintar. Selepas mengemas kini In-Vehicle-Navigation, data peta akan dipadamkan secara automatik dari telefon pintar.";
        this.SL_TXT_0212_ms = "Data Mudah Alih DIHIDUPKAN.\n\nAnda boleh memuat turun data peta melalui sambungan data mudah alih anda. \nWalau bagaimanapun, data dihadkan kepada 30MB setiap rantau.\n*Caj data mungkin dikenakan.\n\nSila MATIKAN.\njika anda hanya ingin memuat turun melalui WiFi.";
        this.SL_TXT_0213_ms = "Kemas kini auto DIHIDUPKAN.\n\nMuat turun\ndata peta secara automatik dan simpankannya\npada telefon pintar anda\n*Caj data mungkin dikenakan.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_ms = "Sambungan ke In-Vehicle-Navigation telah terputus. Cuba lagi selepas mengesahkan sambungan ke In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_ms = "Storan In-Vehicle-Navigation tidak mencukup. Cuba lagi selepas mengesahkan tetapan In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_ms = "Ralat berlaku semasa pemindahan data. Sila cuba lagi kemudian.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_ms = "Ralat berlaku semasa memuat turun data peta dari pelayan. Sila cuba lagi kemudian.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_ms = "Storan telefon pintar tidak mencukupi. Cuba lagi selepas memadamkan data dari telefon pintar anda.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_ms = "Data Mudah Alih DIMATIKAN.\n\nSila muat turun melalui WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_ms = "Komunikasi dengan pelayan terputus. Cuba lagi selepas komunikasi telah diwujudkan semula.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_msを利用　宣言のみ
        this.SL_TXT_0221_ms = "Saiz: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_ms = "OK";
        this.HTML_TXT_0068_ms = "Pastikan telefon pintar tidak memasuki mod tidur semasa memuat turun data peta.\nJika telefon pintar memasuki mod tidur, mulakan apl SUBARU STARLINK sekali lagi.";
        //other (North American Oceans)
        this.LOCATION_999_ms = "lain-lain";
        this.HTML_TXT_9999_ms = "Oceania";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_ms = "Kemas kini peta tidak dapat dimulakan. Sila semak keadaan In-Vehicle-Navigation.";
        this.HTML_TXT_0165_ms = "Fungsi seting kemas kini peta";
        this.HTML_TXT_0166_ms = "1. Muat turun data peta dari pelayan ke telefon pintar.<br><br>2. Apabila menyambung telefon pintar ke In-Vehicle-Navigation, data peta dipindahkan ke In-Vehicle-Navigation. Data peta akan dipadam dari telefon pintar selepas dipindahkan.";
        this.HTML_TXT_0167_ms = "* Apabila telefon pintar disambungkan ke beberapa In-Vehicle-Navigation, maklumat kemas kini peta memaparkan data In-Vehicle-Navigation yang paling terbaru disambungkan.";
        this.HTML_TXT_0168_ms = "Pemilihan Rantau Automatik";
        this.HTML_TXT_0169_ms = "Semak untuk Kemas Kini";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_ms = "Menekan butang Batal menghentikan akses kepada pelayan.";
        this.HTML_TXT_0171_ms = "Mulakan Kemas Kini";
        this.HTML_TXT_0172_ms = "Kapasiti telefon pintar tidak mencukupi. Padam sedikit data di telefon pintar dan cuba lagi.";
        this.HTML_TXT_0173_ms = "Sila ketik *, jika anda mahu membatalkan muat turun data peta dari pelayan.";
        this.HTML_TXT_0174_ms = "Tekan butang Batal untuk membatalkan carian.";
        this.HTML_TXT_0175_ms = "Rantau dari lokasi semasa ke destinasi yang ditentukan telah dipilih";
        this.HTML_TXT_0176_ms = "Data peta sedang dipindahkan ke In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_ms = "* Pemasangan data peta selesai";
        this.HTML_TXT_0178_ms = "Tiada hasil carian. Sila cuba lagi.";
        this.HTML_TXT_0179_ms = "Titik carian sama dengan lokasi semasa.";
        this.HTML_TXT_0180_ms = "Sila pilih kawasan yang anda mahu kemas kini di atas peta.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_ms = "Menekan butang Batal menghentikan akses kepada pelayan.";
        this.HTML_TXT_0182_ms = "Muat turun berjaya.";
        this.HTML_TXT_0183_ms = "Adakah anda mahu memadam data peta yang dimuat turun dari pelayan?";
        this.HTML_TXT_0184_ms = "Data peta telah dipadam.";
        this.HTML_TXT_0185_ms = "Tidak boleh memadam data peta.";
        this.HTML_TXT_0186_ms = "Muat turun akan dibatalkan.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_ms = "[Notis Penting]<br/> SUBARU STARLINK tidak boleh dilancarkan kerana versi ini tidak lagi disokong.<br/> <br/>Sila pasang versi terkini SUBARU STARLINK di telefon pintar anda dan cuba lancarkan semula.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_ms = "Ralat Peruntukan Memori";
        this.HTML_TXT_0190_ms = "Jika pemindahan data terganggu, ia akan menyambung semula secara automatik sewaktu sambungan semula.";
        this.HTML_TXT_0193_ms = "APPS";
        this.HTML_TXT_0195_ms = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_ms = "Pilihan rantau kemas kini peta";
        this.HTML_TXT_0205_A_ms = "Tetapan mod paparan";

        this.APP_TXT_0176_ms = "Gagal Muat Turun.";   //※暫定

        this.APP_TXT_0358_ms = "Lesen"; 
        this.Car_TXT_0245_ms = "Lokasi semasa";

        this.HTML_TXT_0246_ms = "Petunjuk Pengguna";
        this.HTML_TXT_0247_ms = "Memperbarui data Peta menggunakan ponsel pintar";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // タガログ語 fil
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_fil = "Ikansela";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_fil = "Burahin ang lahat ng data?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_fil = "Ang lahat ng data ay naibura na.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_fil = "BUMALIK";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_fil = "Mga Tuntunin at Kundisyon sa Paggamit";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_fil = "In-update noong 01/04/2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_fil = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_fil = "Ang application data ng STARLINK ay buburahin. ";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_fil = "* Nireresolba ang hindi maayos na connection sa In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_fil = "Ibura ang application data ng STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_fil = "Pagpili ng rehiyon";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_fil = "Piliin ang iyong pangunahing rehiyon.";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_fil = "* Nagbibigay ng pinakamahusay na kasanayan para sa mga app na inoptimize sa iyong rehiyon. ";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_fil = "Pumili ng function sa nabigasyon";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_fil = "Iilang mga In-Vehicle-Navigation ay may maraming function sa nabigasyon. Pumili ng nabigasyon na gagamitin.<br/><br/>*Maaari kang pumili ng ginamit na nabigasyon kapag magse-set ng destinasyon gamit ang In-Vehicle-Navigation app.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_fil = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_fil = "Pumili ng function sa nabigasyon";
        //other (North American Oceans)
        this.LOCATION_999_fil = "iba pa";
        this.HTML_TXT_9999_fil = "Oseania";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_fil = "Laki: ";
        this.TXT_YELP_0029_fil = "May pagkakamali na nangyari. Subukang gawin muli mamaya.";
        this.SL_TXT_0155_fil = "Ber. ";
        this.SL_TXT_0189_fil = "In-update noong *";
        this.SL_TXT_0191_fil = "Petsa ng Pagkawalang-bisa: ";
        this.SL_TXT_0192_fil = "Settings ng Pag-update sa Mapa";
        this.SL_TXT_0193_fil = "Ang map data ng In-Vehicle-Navigation ay maaaring i-save nang pansamantala sa iyong smartphone mula sa server na namamahagi ng mapa. Sa susunod na kumonekta ka sa In-Vehicle-Navigation, maaari mong i-update ang mapa.";
        this.SL_TXT_0196_fil = "Set. ng Pag-update";
        this.SL_TXT_0197_fil = "I-check ang auto update";
        this.SL_TXT_0198_fil = "Cellular";
        this.SL_TXT_0199_fil = "Imporm. ng update";
        this.SL_TXT_0200_fil = "I-download lahat";
        this.SL_TXT_0201_fil = "I-download sa mobile";
        this.SL_TXT_0202_fil = "May available na update";
        this.SL_TXT_0203_fil = "Na-update";
        this.SL_TXT_0204_fil = "Mapa: ";
        this.SL_TXT_0204_A_fil = "Eurooppa";
        this.SL_TXT_0205_fil = "Bersyon: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_filを利用　宣言のみ
        this.SL_TXT_0206_fil = "Laki:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_fil = "Walang sapat na espasyo na magagamit sa smartphone.";
        this.SL_TXT_0208_fil = "I-configure ang region settings gamit ang In-Vehicle-Navigation.";
        this.SL_TXT_0209_fil = "Ang iyong subskripsyon sa data ng mapa ay expired na. Pindutin ang OK button para sa iba pang mga detalye.";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_fil = "Paki-download gamit ang WiFi.\n\nAng pag-download ng data ay limitado sa 30MB bawat rehiyon sa pamamagitan ng Mobile Data.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_fil = "I-update ang mapa sa pamamagitan ng pagkonekta sa In-Vehicle-Navigation sa iyong smartphone. Pagka-update mo ng In-Vehicle-Navigation, ang data ng mapa ay awtomatikong mabubura mula sa iyong smartphone.";
        this.SL_TXT_0212_fil = "Naka ON ang Mobile Data.\n\nMaaari mong i-download ang data ng mapa sa pamamagitan ng koneksiyon ng iyong mobile data. \nSubalit, ang data ay limitado sa 30MB bawat rehiyon.\n*Ang pag-singil sa data ay maaaring ipatupad.\n\nPaki-OFF.\nkung gusto mo lamang mag-download sa pamamagitan ng WiFi.";
        this.SL_TXT_0213_fil = "Ang awto na pag-update ay naka-ON.\n\nAwtomatikong i-download ang data ng \nmapa at i-save ito\nsa iyong smartphone\n*Ang pag-singil sa data ay maaaring ipatupad.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_fil = "Ang koneksyon sa In-Vehicle-Navigation ay naka-diskunekta. Subukan muling gawin iyon pagkatapos kumprimahin ang koneksyon sa In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_fil = "Kaunting memory ng smartphone ang natitira. Subukan muling gawin iyon pagkatapos kumprimahin ang settings ng In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_fil = "May pagkakamali na nangyari habang ang data ay nililipat. Subukan muling gawin iyon mamaya.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_fil = "May pagkakamali na nangyari habang nagdodownload ng mapa mula sa server. Subukan muling gawin iyon mamaya.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_fil = "Kaunting memory ng smartphone ang natitira. Subukan muling gawin iyon pagkatapos burahin ang data mula sa iyong smartphone.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_fil = "Ang Mobile Data ay naka-OFF.\n\nPaki-download sa pamamagitan ng WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_fil = "Ang komunikasyon sa server ay naputol. Mangyaring subukan muli pagktapos na ang komunikasyon ay maibalik.";
        // SL_TXT_0206 ※OTHER_SIZE_0001_filを利用　宣言のみ
        this.SL_TXT_0221_fil = "Laki: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_fil = "OK";
        this.HTML_TXT_0068_fil = "Siguraduhin na ang iyong smartphone ay hindi pupunta sa sleep mode habang nagda-download ng data ng mapa.\nKung ang smartphone ay pumunta sa sleep mode, buksan ang SUBARU STARLINK na app muli.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_fil = "Ang pag-update ng mapa ay ayaw mag-umpisa. Pakitingnan ang estado ng In-Vehicle-Navigation.";
        this.HTML_TXT_0165_fil = "Setting function ng pag-update ng mapa";
        this.HTML_TXT_0166_fil = "1. I-download ang data ng mapa mula sa server patungo sa smartphone.<br><br>2. Kapag kumokonekta sa smartphone sa In-Vehicle-Navigation, inililipat sa In-Vehicle-Navigation ang data ng mapa. Tatanggalin ang data ng mapa mula sa smartphone pagkatapos ilipat.";
        this.HTML_TXT_0167_fil = "* Kapag nakakonekta ang smartphone sa maraming In-Vehicle-Navigation, ipinapakita ng impormasyon ng pag-update ng mapa ang pinakahuling nakakonektang In-Vehicle-Navigation.";
        this.HTML_TXT_0168_fil = "Automatic na Pagpili sa Rehiyon";
        this.HTML_TXT_0169_fil = "Tingnan ang Update";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_fil = "Tumitigil ang access sa server kapag pinindot ang button na Ikansela.";
        this.HTML_TXT_0171_fil = "Umpisahan ang Update";
        this.HTML_TXT_0172_fil = "Hindi sapat ang kapasidad ng smartphone. Mag-delete ng ilang data sa smartphone at subukan muli.";
        this.HTML_TXT_0173_fil = "Paki-tap ang *, kung nais mo na itigil ang pag-download ng data ng mapa mula sa server.";
        this.HTML_TXT_0174_fil = "Pindutin ang button na Ikansela para kanselahin ang search.";
        this.HTML_TXT_0175_fil = "Pinili ang rehiyon mula sa kasalukuyang lokasyon sa tukoy na destinasyon.";
        this.HTML_TXT_0176_fil = "Isinasalin ang data ng mapa sa In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_fil = "* Ang pag-install ng data ng mapa ay kumpleto na";
        this.HTML_TXT_0178_fil = "Walang resulta ang search. Pakisubukan muli.";
        this.HTML_TXT_0179_fil = "Pareho ng kasalukuyang lokasyon ang search point.";
        this.HTML_TXT_0180_fil = "Pakipiliin ang lugar na gusto mong i-update sa mapa.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_fil = "Tumitigil ang access sa server kapag pinindot ang button na Ikansela.";
        this.HTML_TXT_0182_fil = "Tagumpay ang pag-download.";
        this.HTML_TXT_0183_fil = "Gusto mo bang i-delete ang nai-download na data ng mapa mula sa server?";
        this.HTML_TXT_0184_fil = "Na-delete na ang data ng mapa.";
        this.HTML_TXT_0185_fil = "Hindi mai-delete ang data ng mapa.";
        this.HTML_TXT_0186_fil = "Kakanselahin ang download.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_fil = "[Important Notice]<br/>Hindi maii-launch ang SUBARU STARLINK dahil hindi na suportado ang bersyon na ito.<br/><br/>Paki-install ang pinakabagong bersyon ng SUBARU STARLINK sa iyong smartphone at subukang i-launch ulit.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_fil = "Error sa Memory Allocate";
        this.HTML_TXT_0190_fil = "Kung ang paglipat ng data ay naputol, ito ay awtomatikong magpapatuloy sa muling pagkonekta nito.";
        this.HTML_TXT_0193_fil = "APPS";
        this.HTML_TXT_0195_fil = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_fil = "Pagpili ng pag-update ng rehiyon ng mapa";
        this.HTML_TXT_0205_A_fil = "Näyttötilan asetus";

        this.APP_TXT_0176_fil = "Bigo Ang Pag-download.";   //※暫定

        this.APP_TXT_0358_fil = "Lisensiya"; 
        this.Car_TXT_0245_fil = "Kasalukuyang lokasyon";

        this.HTML_TXT_0246_fil = "MANWAL NG USER";
        this.HTML_TXT_0247_fil = "Pag-update sa data ng Mapa gamit ang smartphone";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // ヘブライ語 he
        ////////////////////////////////////////////////////////////////
        // ----- 既存のMoreタブ ------->
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_he = "ביטול";
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_he = "למחוק את כל הנתונים?";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_he = "כל הנתונים נמחקו.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_he = "חזרה";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_he = "תנאי והתניות שימוש";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_he = "עודכן 01/04/2017";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_he = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_he = "נתוני יישום STARLINK ימחקו.";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_he = "* פותר חיבור לא יציב ב-In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_he = "נקה נתוני יישום STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_he = "בחירת איזור";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_he = "בחר איזור ראשי שלך.";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_he = "* מספק חוויה מרבית עבור יישומים אשר מוטבו לאיזור";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_he = "בחר פונקציית ניווט";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_he = "In-Vehicle-Navigation מסויימים כוללים פונקציות ניווט מרובות. בחר ניווט לשימוש.<br/><br/>*יכול ותבחר ניווט לשימוש בהגדרת יעד באמצעות יישום In-Vehicle-Navigation.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_he = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_he = "בחר פונקציית ניווט";
        //other (North American Oceans)
        this.LOCATION_999_he = "אחרים";
        this.HTML_TXT_9999_he = "אוקיאניה";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_he = "גודל: ";
        this.TXT_YELP_0029_he = "אירעה שגיאה. אנא נסה שוב מאוחר יותר.";
        this.SL_TXT_0155_he = "גרסה ";
        this.SL_TXT_0189_he = "עודכן *";
        this.SL_TXT_0191_he = "תאריך תפוגה: ";
        this.SL_TXT_0192_he = "הגדרות עדכון מפה";
        this.SL_TXT_0193_he = "ניתן לשמור נתוני מפה של In-Vehicle-Navigation באופן זמני לטלפון החכם שלך משרת הפצת מפה. בפעם הבאה שתתחבר ל-In-Vehicle-Navigation, ניתן לעדכן את המפה.";
        this.SL_TXT_0196_he = "הגדרות עדכון";
        this.SL_TXT_0197_he = "בדיקת עדכון אוטומטי";
        this.SL_TXT_0198_he = "סלולרי";
        this.SL_TXT_0199_he = "מידע עדכון";
        this.SL_TXT_0200_he = "הורד הכל";
        this.SL_TXT_0201_he = "הורד באמצעות נתונים סלולריים";
        this.SL_TXT_0202_he = "עדכון זמין";
        this.SL_TXT_0203_he = "עודכן";
        this.SL_TXT_0204_he = "מפה: ";
        this.SL_TXT_0204_A_he = "אירופה";
        this.SL_TXT_0205_he = "גרסה: ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_heを利用　宣言のみ
        this.SL_TXT_0206_he = "גודל:　";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_he = "אין נפח אחסון מספק בטלפון החכם.";
        this.SL_TXT_0208_he = "קבע את תצורת הגדרות אזור באמצעות ה-In-Vehicle-Navigation.";
        this.SL_TXT_0209_he = "מנוי MapCare שלך פג תוקף. כדי לעדכן את המנוי, בקר באתר www.subaru-maps.com.‏";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_he = "הורד באמצעות Wi-Fi.‏\n\nהורדת נתונים מוגבלת ל-30MB לאזור באמצעות נתונים סלולריים.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_he = "עדכן מפה באמצעות חיבור ל-In-Vehicle-Navigation לטלפון החכם. לאחר עדכון In-Vehicle-Navigation, נתוני המפה יימחקו באופן אוטומטי מהטלפון החכם.";
        this.SL_TXT_0212_he = "נתונים סלולריים מופעלים.\n\nניתןלהוריד נתוני מפות באמצעות חיבור נתונים סלולריים. \nאולם, הנתונים מוגבלים ל-30MB לחזור.\n*עלולים לחול חיובי נתונים.\n\nיש לכבות.\nאם אתה רק רוצה להוריד באמצעות Wi-Fi.";
        this.SL_TXT_0213_he = "עדכון אוטומטי מופעל.\n\nהורד באופן אןוטומטי\nנתוני מפות ושמור אותם\nבטלפון החכם\n*עלולים לחול חיובי נתונים.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_he = "החיבור ל-In-Vehicle-Navigation נותק. נסה שוב לאחר אישור חיבור ל-In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_he = "רמת אחסון זמין ב-In-Vehicle-Navigation אינה מספיקה. נסה שוב לאחר אישור הגדרות In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_he = "אירעה שגיאה במהלך העברת נתונים. אנא נסה שוב מאוחר יותר.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_he = "אירעה שגיאה במהלך הורדת נתוני מפה מהשרת. אנא נסה שוב מאוחר יותר.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_he = "רמת אחסון זמין בטלפון החכם אינה מספיקה. נסה שוב לאחר מחיקת נתונים מהטלפון החכם שלך.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_he = "נתונים סלולרים גבויים.\n\nהורד באמצעות Wi-Fi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_he = "התקשורת עם השרת נותקה. נסה שוב אחרי חידוש התקשורת.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_heを利用　宣言のみ
        this.SL_TXT_0221_he = "גודל: *MB";
        // ----- Harman OTA 対応 -----<
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_he = "OK";
        this.HTML_TXT_0068_he = "וודא שהטלפון החכם לא נכנס למצב שינה בזמן הורדת נתוני מפות.\nאם הטלפון החכם נכנס למצב שינה, הפעל שוב את היישום SUBARU STARLINK.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_he = "המפה לא יכולה להתחיל. סדוק את המצב של ניווט-בתוך-כלי-הרכב.";
        this.HTML_TXT_0165_he = "פונקציה להגדרת עדכון המפות";
        this.HTML_TXT_0166_he = "‏1. הורד את נתוני המפות מהשרת אל הטלפון החכם.<br><br>‏2. בעת חיבור הטלפון החכם ל-In-Vehicle-Navigation, נתוני המפות מועברים אל In-Vehicle-Navigation.נתוני המפות יימחקו מהטלפון החכם לאחר ההעברה.";
        this.HTML_TXT_0167_he = "* כאשר הטלפון החכם מחובר להתקני In-Vehicle-Navigation מרובים, מידע עדכון המפות מציג את הנתונים של ה-In-Vehicle-Navigation האחרון שחובר.";
        this.HTML_TXT_0168_he = "בחירת איזור אוטומטית";
        this.HTML_TXT_0169_he = "חפש עדכון";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_he = 'לחיצה על הלחצן"ביטול"מפסיקה את הגישה לשרת.';
        this.HTML_TXT_0171_he = "התחל עדכון";
        this.HTML_TXT_0172_he = "הקיבולת של הטלפון החכם אינה מספיקה. מחק נתונים מהטלפון החכם ונסה שוב.";
        this.HTML_TXT_0173_he = "הקש על *, אם אתה רוצה לבטל הורדת נתוני מפות מהשרת.";
        this.HTML_TXT_0174_he = 'לחץ על הלחצן"ביטול"כדי לבטל את החיפוש.';
        this.HTML_TXT_0175_he = "האיזור מהמיקום הנוכחי עד אל היעד שצוין נבחר.";
        this.HTML_TXT_0176_he = "נתוני המפות מועברים אל In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_he = "*התקנת נתוני מפות הושלמה";
        this.HTML_TXT_0178_he = "החיפוש לא העלה תוצאות. נסה שוב.";
        this.HTML_TXT_0179_he = "נקודת החיפוש זהה למיקום הנוכחי.";
        this.HTML_TXT_0180_he = "בחר את האיזור שלגביו ברצונך לעדכן את המפה.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_he = 'לחיצה על הלחצן"ביטול"מפסיקה את הגישה לשרת.';
        this.HTML_TXT_0182_he = "פעולת ההורדה הצליחה.";
        this.HTML_TXT_0183_he = "האם ברצונך למחוק את נתוני המפות שהורדו מהשרת?";
        this.HTML_TXT_0184_he = "נתוני המפות נמחקו.";
        this.HTML_TXT_0185_he = "אין אפשרות למחוק את נתוני המפות.";
        this.HTML_TXT_0186_he = "ההורדה תבוטל.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_he = "[הודעה חשובה]<br/>אין אפשרות להפעיל את SUBARU STARLINK כיוון שלגרסה זאת כבר אין תמיכה.<br/><br/>עליך להתקין את הגרסה העדכנית ביותר של SUBARU STARLINK בטלפון החכם שלך ולנסות להפעיל שוב.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_he = "שגיאה בהקצאת זיכרון";
        this.HTML_TXT_0190_he = "אם תהיה הפרעה להעברת הנתונים, היא תמשיך באופן אוטומטי בעת החיבור חדש.";
        this.HTML_TXT_0193_he = "APPS";
        this.HTML_TXT_0195_he = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_he = "בחירת אזור עדכון מפות";
        this.HTML_TXT_0205_A_he = "הגדרת מצב תצוגה";

        this.APP_TXT_0176_he = "ההורדה נכשלה.";   //※暫定

        this.APP_TXT_0358_he = "רישיון"; 
        this.Car_TXT_0245_he = "מיקום נוכחי";

        this.HTML_TXT_0246_he = "מדריך למשתמש";
        this.HTML_TXT_0247_he = "עדכון נתוני המפה באמצעות סמארטפון";

        // ----- Harman OTA GEN4 対応 -----<
        ////////////////////////////////////////////////////////////////
        // アラビア語 ar
        ////////////////////////////////////////////////////////////////
        // キャンセルボタン(4Car_TXT_0112)
        this.APP_024_ar = "إلغاء ";
        //other (North American Oceans)
        this.LOCATION_999_ar = "أخرى";
        this.HTML_TXT_9999_ar = "أوقيانوسيا";
        // ----- 既存のMoreタブ ------->
        // 4Car_TXT_0053 : confirmダイアログ用文言
        this.CONFIG_005_ar = "حذف كل البيانات؟";
        // 4Car_TXT_0054 : confirmダイアログ用文言
        this.CONFIG_006_ar = "تم حذف كل البيانات.";
        // 4Car_TXT_0056 : BACKボタン
        this.CONFIG_001_ar = "عودة";
        // 4Car_TXT_0188 : 利用規約文言
        this.CONFIG_011_ar = "أحكام وشروط الاستخدام";
        // SL_TXT_0189 : 利用規約更新日付文言 FIXME
        this.CONFIG_012_ar = "تم التحديث في اليوم/الشهر/السنة";
        //キャッシュクリア転送不可文言(SL_TXT_XXXX)
        this.CONFIG_013_ar = "Can't delete map data during transferring map data to In-Vehicle-Navigation.Please retry after completed to transfer map data.";
        // SL_TXT_0153(上段) : CONFIG画面文言
        this.CONFIG_003_ar = "سيتم حذف بيانات تطبيق STARLINK.‏";
        // SL_TXT_0153(下段) : CONFIG画面文言
        this.CONFIG_004_ar = "* يحل مشكلة الاتصال غير المستقر مع In-Vehicle-Navigation.";
        // SL_TXT_0152 : キャッシュクリアボタン文言
        this.CONFIG_007_ar = "محو بيانات تطبيق STARLINK";
        // SL_TXT_0003 : 利用地域選択画面文言
        this.CONFIG_008_ar = "اختيار المنطقة";
        // SL_TXT_0154(上) : 利用地域選択画面文言
        this.CONFIG_009_ar = "اختر منطقتك الأساسية.";
        // SL_TXT_0154(下) : 利用地域選択画面文言
        this.CONFIG_010_ar = "* يقدم أفضل تجربة للتطبيقات المثلى في منطقتك.";
        // HTML_TXT_0029 : デリゲーションボタン
        this.DELEGATION_001_ar = "اختيار وظيفة ملاحة";
        // HTML_TXT_0030 : デリゲーション切替機能説明
        this.DELEGATION_002_ar = "بعض أجهزة In-Vehicle-Navigation بها وظائف ملاحة متعددة.اختر وظيفة ملاحة لتستخدمها.<br/><br/>*يمكنك اختيار وظيفة الملاحة المستخدمة عند ضبط وجهة باستخدام تطبيق In-Vehicle-Navigation.";
        // ????????????? : デリゲーション画面タイトル
        this.DELEGATION_003_ar = "";
        // HTML_TXT_0029 : デリゲーション画面説明
        this.DELEGATION_004_ar = "اختيار وظيفة ملاحة";
        // ----- 既存のMoreタブ -------<
        // ----- Harman OTA 対応 ----->
        // SL_TXT_0206とSL_TXT_0221の代わりに作成。
        this.OTHER_SIZE_0001_ar = "الحجم: ";
        this.TXT_YELP_0029_ar = "حدث خطأ. يرجى إعادة المحاولة لاحقاً. ";
        this.SL_TXT_0155_ar = " إصدار ";
        this.SL_TXT_0189_ar = "تم التحديث في *";
        this.SL_TXT_0191_ar = "تاريخ انتهاء الصلاحية: ";
        this.SL_TXT_0192_ar = "إعدادات تحديث الخريطة ";
        this.SL_TXT_0193_ar = "يمكن حفظ بيانات خريطة In-Vehicle-Navigation مؤقتاً على هاتفك الذكي من خادم توزيع الخرائط. يمكنك تحديث الخريطة في المرة التالية التي تقوم فيها بالاتصال بـ In-Vehicle-Navigation.";
        this.SL_TXT_0196_ar = "إعدادات التحديث";
        this.SL_TXT_0197_ar = "تحقق من التحديث التلقائي ";
        this.SL_TXT_0198_ar = "شبكة خلوية ";
        this.SL_TXT_0199_ar = "معلومات التحديث ";
        this.SL_TXT_0200_ar = "تحميل الكل";
        this.SL_TXT_0201_ar = "تم التنزيل في الهاتف الجوّال ";
        this.SL_TXT_0202_ar = "التحديث متاح ";
        this.SL_TXT_0203_ar = "تم التحديث ";
        this.SL_TXT_0204_ar = "خريطة: ";
        this.SL_TXT_0204_A_ar = "أوروبا";
        this.SL_TXT_0205_ar = "إصدار:  ";
        // SL_TXT_0206 ※OTHER_SIZE_0001_arを利用　宣言のみ
        this.SL_TXT_0206_ar = "الحجم:　 ";
        // SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0207_ar = "المساحة المتاحة على الهاتف الذكي غير كافية. ";
        this.SL_TXT_0208_ar = "قم بتهيئة إعدادات المنطقة بواسطة In-Vehicle-Navigation.";
        this.SL_TXT_0209_ar = "انتهت صلاحية اشتراكك في MapCare. يرجى زيارة الموقع www.subaru-maps.com لتحديث الاشتراك. ";
        // SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0210_ar = "يرجى التنزيل من خلال شبكة WiFi.\n\n يكون تنزيل البيانات محدودًا بحجم 30 ميغابايت لكل منطقة من خلال شبكة بيانات الجوّال.";
        // SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0211_ar = "قم بتحديث الخريطة عن طريق توصيل In-Vehicle-Navigation بالهاتف الذكي. بعد تحديث In-Vehicle-Navigation، سيتم حذف بيانات الخريطة تلقائياً من الهاتف الذكي.";
        this.SL_TXT_0212_ar = "شبكة بيانات الجوّال قيد التشغيل.\n \nيمكنك تنزيل بيانات الخرائط من خلال اتصال شبكة بيانات الجوّال.\nومع ذلك، تكون البيانات محدودة بحجم 30 ميغابايت لكل منطقة.\n*قد يتم فرض رسوم نقل بيانات.\n \nيُرجى إيقاف التشغيل\n إذا كنت تريد التنزيل من خلال شبكة WiFi فقط.";
        this.SL_TXT_0213_ar = "التحديث التلقائي قيد التشغيل.\nيمكنك \nالتنزيل التلقائي\n لبيانات الخرائط وحفظها\nعلى هاتفك الذكي\n*قد يتم فرض رسوم نقل بيانات.";
        // SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0214_ar = "انقطع الاتصال بـ In-Vehicle-Navigation. أعد المحاولة مرة أخرى بعد التأكد من الاتصال بـ In-Vehicle-Navigation.";
        // SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0215_ar = "مساحة التخزين المتاحة على  In-Vehicle-Navigation غير كافية. أعد المحاولة مرة أخرى بعد التأكد من إعدادات  In-Vehicle-Navigation.";
        // SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0216_ar = "حدث خطأ أثناء نقل البيانات. يرجى إعادة المحاولة مرة أخرى لاحقاً.";
        // SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0217_ar = "حدث خطأ أثناء تحميل بيانات الخريطة من الخادم. يرجى إعادة المحاولة مرة أخرى لاحقاً.";
        // SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0218_ar = "مساحة التخزين المتاحة على الهاتف الذكي غير كافية. أعد المحاولة مرة أخرى بعد حذف بيانات من هاتفك الذكي.";
        // SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0219_ar = "شبكة بيانات الجوّال قيد الإيقاف.\n\nيُرجى التنزيل عبر شبكة WiFi.";
        // SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.SL_TXT_0220_ar = "تم قطع الاتصال مع الخادم. يمكنك إعادة المحاولة بعد إعادة تأسيس الاتصالات.";
        // SL_TXT_0221 ※OTHER_SIZE_0001_arを利用　宣言のみ
        this.SL_TXT_0221_ar = "الحجم: *MB";
        // ----- Harman OTA GEN4 対応 ----->
        // 4Car_TXT_0299（不訳文言）
        this.OTHER_011_ar = "OK";       
        this.HTML_TXT_0068_ar = "تأكد من عدم دخول الهاتف الذكي في وضع السكون أثناء تنزيل بيانات الخرائط.\nإذا دخل الهاتف الذكي في وضع السكون، فعليك تشغيل تطبيق SUBARU STARLINK مجددًا.";
        // HTML_TXT_0164 ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0164_ar = 'لا يمكن بدء تحديث الخريطة. يُرجى التحقق من حالة In-Vehicle-Navigation "نظام الملاحة داخل السيارة".';
        this.HTML_TXT_0165_ar = "وظيفة إعداد تحديث الخريطة";
        this.HTML_TXT_0166_ar = "1. قم بتنزيل بيانات الخريطة من الخادم على الهاتف الذكي.<br><br>2. عند توصيل الهاتف الذكي بـ In-Vehicle-Navigation، يتم نقل بيانات الخريطة إلى In-Vehicle-Navigation. سيتم حذف بيانات الخريطة من الهاتف الذكي بعد النقل.";
        this.HTML_TXT_0167_ar = "* عندما يكون الهاتف الذكي موصولاً بعدة In-Vehicle-Navigation، تقوم معلومات تحديث الخريطة بعرض بيانات آخر In-Vehicle-Navigation تم توصيله.";
        this.HTML_TXT_0168_ar = "اختيار منطقة تلقائي";
        this.HTML_TXT_0169_ar = "التحقق من وجود تحديث";
        // HTML_TXT_0170 定義値のみ宣言
        this.HTML_TXT_0170_ar = "ضغط زر الإلغاء يقوم بإيقاف الوصول إلى الخادم.";
        this.HTML_TXT_0171_ar = "بدء التحديث";
        this.HTML_TXT_0172_ar = "سعة الهاتف الذكي غير كافية. احذف بعض البيانات من الهاتف الذكي وحاول مرة أخرى.";
        this.HTML_TXT_0173_ar = "يرجى الضغط على *، إذا كنت ترغب في إلغاء تنزيل بيانات الخرائط من الخادم.";
        this.HTML_TXT_0174_ar = "اضغط زر الإلغاء لإلغاء البحث.";
        this.HTML_TXT_0175_ar = "تم اختيار المنطقة الواقعة بين الموقع الحالي والوجهة المحددة.";
        this.HTML_TXT_0176_ar = "يجري نقل بيانات الخريطة إلى In-Vehicle-Navigation.";
        // HTML_TXT_0177  ※スマホ側にて使用。こちらは定義値のみ宣言
        this.HTML_TXT_0177_ar = "*اكتمل تثبيت بيانات الخريطة";
        this.HTML_TXT_0178_ar = "لا توجد نتائج للبحث. الرجاء المحاولة مرة أخرى.";
        this.HTML_TXT_0179_ar = "نقطة البحث هي نفس الموقع الحالي.";
        this.HTML_TXT_0180_ar = "الرجاء اختيار المنطقة التي تريد تحديثها على الخريطة.";
        // HTML_TXT_0181 定義値のみ宣言
        this.HTML_TXT_0181_ar = "ضغط زر الإلغاء يقوم بإيقاف الوصول إلى الخادم.";
        this.HTML_TXT_0182_ar = "نجحت عملية التنزيل.";
        this.HTML_TXT_0183_ar = "هل تريد حذف بيانات الخريطة التي تم تنزيلها من الخادم؟";
        this.HTML_TXT_0184_ar = "تم حذف بيانات الخريطة.";
        this.HTML_TXT_0185_ar = "تعذر حذف بيانات الخريطة.";
        this.HTML_TXT_0186_ar = "سيتم إلغاء التنزيل.";
        // HTML_TXT_0188 定義値のみ宣言
        this.HTML_TXT_0188_ar = "[ملاحظة هامة]<br/>لا يمكن تشغيل SUBARU STARLINK لأن هذا الإصدار لم يعد مدعومًا.<br/><br/>الرجاء تثبيت إصدار SUBARU STARLINK الأحدث على الهاتف الذكي ومحاولة التشغيل مرة أخرى.";
        // HTML_TXT_0189 定義値のみ宣言
        this.HTML_TXT_0189_ar = "خطأ في تخصيص الذاكرة";
        this.HTML_TXT_0190_ar = "إذا تمت مقاطعة نقل البيانات، فسيتم استئنافه تلقائيًا عند إعادة الاتصال.";
        this.HTML_TXT_0193_ar = "APPS";
        this.HTML_TXT_0195_ar = "“Copyright (C) TomTom International BV 2018”";
        this.HTML_TXT_0205_ar = "تحديد منطقة تحديث الخريطة";
        this.HTML_TXT_0205_A_ar = "عرض وضع الإعداد";

        this.APP_TXT_0176_ar = "فشل التنزيل. ";   //※暫定

        this.APP_TXT_0358_ar = "الترخيص "; 
        this.Car_TXT_0245_ar = "الموقع الحالي";

        this.HTML_TXT_0246_ar = "دليل المستخدم";
        this.HTML_TXT_0247_ar = "تحديث بيانات الخرائط باستخدام هاتف ذكي";
        // ----- Harman OTA GEN4 対応 -----<
    }
    /**
     * createWordingToEval
     *
     *  本functionの戻り値をevalで実行する事を想定している<br>
     *  指定した言語の文言が定義されていない場合は、デフォルトで「en_US」とする。<br>
     * <br>
     *  destination  :   文言格納先の変数<br>
     *  source       :   Word classのインスタンスを格納した変数名<br>
     *  wordingBase  :   Word class に定義された文言ID<br>
     *  language     :   言語<br>
     *  例：　msg = w.APP_028_1_ja_JP　→　destination :   msg<br>
     *                                   source      :   w<br>
     *                                   wordingBase :   APP_028_1_<br>
     *                                   language    :   ja_JP<br>
     *  例：　msg = w.LOCATION_011　   →　destination :   msg<br>
     *                                   source      :   w<br>
     *                                   wordingBase :   LOCATION_011<br>
     *                                   language    :   ""<br>
     */
    Word.prototype.createWordingToEval = function (destination, source, wordingBase, language) {
        var targetProperty = ['"', wordingBase, language, '"'].join('');
        var wordingTarget = [source, '.', wordingBase, language].join('');
        var wordingDefault = [source, '.', wordingBase, 'en_US'].join('');
        var result = [destination, ' = ', targetProperty, ' in ', source, ' ? ', wordingTarget, ' : ', wordingDefault, ';'].join('');
        return result;
    };

    /**
     * 
     * @param {*} sourceKey コピー元キーを指定します（this.APP_TXT_0176_ar　ならば　ar）
     * @param {*} destKey   コピー先キーを指定します（this.APP_TXT_0176_ar　ならば　ar）
     */
    Word.prototype.copyWord = function (sourceKey, destKey) {
        sourceKey = '_' + sourceKey;
        destKey = '_' + destKey;
        for (var key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            key = key + '';
            if (key.indexOf(sourceKey) == -1) {
                continue;                
            }
            var value = this[key];
            var prop = key.replace(sourceKey, destKey);
            this[prop] = value;
        }
    };

    return Word;
})();
//# sourceMappingURL=smt.word.js.map

