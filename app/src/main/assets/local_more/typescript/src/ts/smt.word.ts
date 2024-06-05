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
class Word {

    // 設定言語リスト
    // (日本語、英語(US)、フランス語、スペイン語、ドイツ語、イタリア語、ロシア語、スウェーデン語、オランダ語、ポーランド語、ギリシャ語、チェコ語、イギリス英語、カナダフランス語、メキシコスペイン語)
    public langList: any = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX"];

    public otaLangList: any = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX", "ar", "pt", "no", "zh_CN", "zh_TW", "ms", "th", "fil", "he"];



    // 暫定：アラビア語対応
    // public langList: any = ["ja_JP", "en_US", "fr_FR", "es_ES", "de_DE", "it_IT", "ru_RU", "sv_SV", "nl_NL", "pl_PL", "el_EL", "cs_CS", "en_GB", "fr_CA", "es_MX", "ar_SA"];
    // 設定国リスト
    // (日本、アメリカ、フランス、スペイン、ドイツ、イタリア、ロシア、スウェーデン、オランダ、ポーランド、ギリシャ、チェコ、イギリス、カナダ、メキシコ)
    public countryList: any = ["JP", "US", "FR", "ES", "DE", "IT", "RU", "SV", "NL", "PL", "EL", "CS", "GB", "CA", "MX"];

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
    public createWordingToEval(destination: string, source: string, wordingBase: string, language: string): string {
        var targetProperty: string = ['"', wordingBase, language, '"'].join('');
        var wordingTarget: string = [source, '.', wordingBase, language].join('');
        var wordingDefault: string = [source, '.', wordingBase, 'en_US'].join('');
        var result: string = [destination, ' = ', targetProperty, ' in ', source, ' ? ', wordingTarget, ' : ', wordingDefault, ';'].join('');
        return result;
    }

    ////////////////////////////////////////////////////////////////
    // 共通で利用できる文言ID
    ////////////////////////////////////////////////////////////////
    //日本
    public LOCATION_001: string = "日本";
    //アメリカ
    public LOCATION_002: string = "United States";
    //カナダ
    public LOCATION_003: string = "Canada";
    //メキシコ
    public LOCATION_004: string = "México";
    //イギリス
    public LOCATION_005: string = "United Kingdom";
    //フランス
    public LOCATION_006: string = "France";
    //ドイツ
    public LOCATION_007: string = "Deutschland";
    //オランダ
    public LOCATION_008: string = "Nederland";
    //イタリア
    public LOCATION_009: string = "Italia";
    //スペイン
    public LOCATION_010: string = "España";
    //スウェーデン
    public LOCATION_011: string = "Sverige";
    //ポーランド
    public LOCATION_012: string = "Polska";
    //ギリシャ
    public LOCATION_013: string = "Ελλάδα";
    //チェコ
    public LOCATION_014: string = "Česko";
    //ロシア
    public LOCATION_015: string = "Россия";
    //ポルトガル
    public LOCATION_016: string = "Portugal";
    //フィンランド
    public LOCATION_017: string = "Suomi";
    //ハンガリー
    public LOCATION_018: string = "Magyarország";






    ////////////////////////////////////////////////////////////////
    // 日本語
    ////////////////////////////////////////////////////////////////


    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_ja_JP: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_ja_JP: string = "";
    public HOME_006_2_ja_JP: string = "の有効期限が終了しました。<br />";
    public HOME_006_3_ja_JP: string = "「";
    public HOME_006_4_ja_JP: string = "」";
    public HOME_006_5_ja_JP: string = "をご利用頂く為には、機能購入が必要となります。<br />詳細につきましては、「購入画面表示」ボタンをタップして下さい。";
    
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_ja_JP: string = "購入画面表示";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_ja_JP: string = "後で";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_ja_JP: string = "今後表示しない";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_ja_JP: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_ja_JP: string = "DownLoad Fail.Click To Try Again.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_ja_JP: string = "接続履歴がありません";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_ja_JP: string = "BACK";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_ja_JP: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_ja_JP: string = "有効期限";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_ja_JP: string = "アプリイメージ";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_ja_JP: string = "アプリ概要";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_ja_JP: string = "アプリ情報";
    // 販売元(4Car_TXT_0082)
    public APP_010_ja_JP: string = "販売元";
    // バージョン(4Car_TXT_0084)
    public APP_011_ja_JP: string = "バージョン";
    // 設定(4Car_TXT_0085)
    public APP_012_ja_JP: string = "設定";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_ja_JP: string = "ナビ表示";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_ja_JP: string = "アプリ内アイテム購入";
    // 非表示(4Car_TXT_0077)
    public APP_015_ja_JP: string = "非表示";
    // 表示(4Car_TXT_0066)
    public APP_016_ja_JP: string = "表示";
    // 無料(4Car_TXT_0177)
    public APP_017_ja_JP: string = "無料";
    // 購入済み(4Car_TXT_0178)
    public APP_018_ja_JP: string = "購入済み";
    // 販売停止(4Car_TXT_0179)
    public APP_019_ja_JP: string = "販売停止";
    // まで(4Car_TXT_0180)
    public APP_020_ja_JP: string = "まで";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_ja_JP: string = "あと";
    public APP_021_2_ja_JP: string = "日以内に切れます";
    // 有効期間(4Car_TXT_0142)
    public APP_022_ja_JP: string = "有効期限";
    // 期間選択(4Car_TXT_0159)
    public APP_023_ja_JP: string = "期間選択";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_ja_JP: string = "キャンセル";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_ja_JP: string = "購入する期間を選択して下さい。<br /><br /><font color='red'>※ご注意<br />下部の表示価格と実際の決済価格が異なる場合があります。<br />[購入実行]ボタン押下後に表示される決済価格を確認の上ご購入ください。</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_ja_JP: string = "決定";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_ja_JP: string = "カーナビ確認";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_ja_JP: string = "本機能を利用するカーナビを確認して下さい。購入した機能は、選択したカーナビのみで利用可能となります。";
    public APP_028_2_ja_JP: string = "購入処理が終了しますと「サービスの登録に成功しました。」とメッセージが表示されます。それまでは、アプリ画面の終了や、車載機との通信の切断（通信している場合）を行わないで下さい。";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_ja_JP: string = "登録中のカーナビ";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_ja_JP: string = "購入実行";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_ja_JP: string = "他のカーナビに変更";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_ja_JP: string = "接続した事のあるカーナビ(最後に接続した日時)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_ja_JP: string = "以下のボタンを押してアプリ一覧画面へ移動してください。";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_ja_JP: string = "アプリ一覧を表示する";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_ja_JP: string = "購入に失敗しました。スマートフォンでSUBARU STARLINKアプリ再起動してから再度お試しください。";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_ja_JP: string = "処理に時間がかかっています。購入が正常に完了していない可能性があります。お手数ですが、しばらくしてから、アプリ画面で購入が完了しているかご確認ください。";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_ja_JP: string = "on";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_ja_JP: string = "off";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_ja_JP: string = "エラーが発生しました。<br />ご迷惑をお掛けして申し訳ございません。<br />しばらくしてから再度お試しください。";
    // カーナビ未登録時文言
    public APP_EX01_ja_JP: string = "登録されていません";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_ja_JP: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_ja_JP: string = "利用規約";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_ja_JP: string = "設定";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_ja_JP: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_ja_JP: string = "BACK";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_ja_JP: string = "4Carアプリ内データ削除";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_ja_JP: string = "4Carアプリ内の設定データが消去されます。<br />（バージョン1.0.5以降で利用可）<br />※車載機との連携動作が不安定な場合にお試しください。";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_ja_JP: string = "全データを消去しますか？";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_ja_JP: string = "全データを消去しました。";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_ja_JP: string = "本機能はバージョン1.0.5以降で利用可能です。";
    
    //STARLINK エラー対応
    public APP_Error_ja_JP: string = "ダウンロード失敗。";

    //STARLINK対応
    public APP_041_ja_JP: string = "更新";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_ja_JP: string = "BACK";
    //ヘッダー部文言
    public CONFIG_002_ja_JP: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_ja_JP: string = "STARLINKアプリ内の設定データが消去されます。";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_ja_JP: string = "※車載機との連携動作が不安定な場合にお試しください。";
    //confirmダイアログ用文言
    public CONFIG_005_ja_JP: string = "全データを消去しますか？";
    //confirmダイアログ用文言
    public CONFIG_006_ja_JP: string = "全データを消去しました。";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_ja_JP: string = "STARLINKアプリ内データ削除";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_ja_JP: string = "CODE: 2101\n購入がキャンセルされました。";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_ja_JP: string = "CODE: 2103\n購入に失敗しました。アカウントが入力されていないもしくは、OS、ストアバージョンが古い可能性があります。";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_ja_JP: string = "CODE: 2104\n購入できないアイテムが選択されたため購入に失敗しました。";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_ja_JP: string = "CODE: 2105\n購入に失敗しました。時間をおいて再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_ja_JP: string = "CODE: 2106\n購入に失敗しました。時間をおいて再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_ja_JP: string = "CODE: 2107\n購入済みのアイテムのため、購入できません。";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_ja_JP: string = "CODE: 2108\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_ja_JP: string = "CODE: 2110\n購入できないアカウントが設定されています。購入可能なアカウントで再度ご購入ください。";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_ja_JP: string = "CODE: 2111\n通信が切断されました。電波環境の良い場所で再度ご購入ください。";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_ja_JP: string = "CODE: 2211\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_ja_JP: string = "CODE: 2213\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_ja_JP: string = "CODE: 2228\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_ja_JP: string = "CODE: 2243\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_ja_JP: string = "CODE: 2261\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_ja_JP: string = "CODE: 2299\n購入に失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_ja_JP: string = "CODE: 2996\n購入が中断したアイテムがあります。復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_ja_JP: string = "CODE: 2997\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_ja_JP: string = "CODE: 2998\nサーバとの通信が失敗したため、購入が失敗しました。時間をおいて再度同じアイテムをご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_ja_JP: string = "CODE: 2999\n購入に失敗しました。再度ご購入ください。\n※既に購入済みの場合は失敗した購入を再開し復旧処理を実施します。";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_ja_JP: string = "利用地域選択";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_ja_JP: string = "主にご利用になられる地域を選択してください";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_ja_JP: string = "※お客様の利用地域に応じた最適なアプリをご提供致します。";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_ja_JP: string = "利用規約";
    //利用規約更新日付文言
    public CONFIG_012_ja_JP: string = "2017年4月1日 更新";
    //日本
    public LOCATION_001_ja_JP: string = "日本";
    //アメリカ
    public LOCATION_002_ja_JP: string = "United States";
    //カナダ
    public LOCATION_003_ja_JP: string = "Canada";
    //メキシコ
    public LOCATION_004_ja_JP: string = "México";
    //イギリス
    public LOCATION_005_ja_JP: string = "United Kingdom";
    //フランス
    public LOCATION_006_ja_JP: string = "France";
    //ドイツ
    public LOCATION_007_ja_JP: string = "Deutschland";
    //オランダ
    public LOCATION_008_ja_JP: string = "Nederland";
    //イタリア
    public LOCATION_009_ja_JP: string = "Italia";
    //スペイン
    public LOCATION_010_ja_JP: string = "España";
    //スウェーデン
    public LOCATION_011_ja_JP: string = "Sverige";
    //ポーランド
    public LOCATION_012_ja_JP: string = "Polska";
    //ギリシャ
    public LOCATION_013_ja_JP: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_ja_JP: string = "Česko";
    //ロシア
    public LOCATION_015_ja_JP: string = "Россия";
    //ポルトガル
    public LOCATION_016_ja_JP: string = "Portugal";
    //フィンランド
    public LOCATION_017_ja_JP: string = "Suomi";
    //ハンガリー
    public LOCATION_018_ja_JP: string = "Magyarország";

    //バージョンアップ必要時文言
    public VERSION_001_ja_JP: string = "最新のSUBARU STARLINKアプリにアップデートしてご利用ください。";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_ja_JP: string = "新しい車載機に接続されました。<br/>購入済みのライセンスを新しい車載機に引き継ぎますか？";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_ja_JP: string = "はい";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_ja_JP: string = "いいえ";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_ja_JP: string = "後で表示";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_ja_JP: string = "【注意】";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_ja_JP: string = "以後この車載機へライセンスを引き継ぐことができなくなりますがよろしいですか？";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_ja_JP: string = "どの車載機からライセンスを<br/>引き継ぎますか？";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_ja_JP: string = "車載機ID： ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_ja_JP: string = "接続日：";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_ja_JP: string = "nnnn年n月n日";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_ja_JP: string = "キャンセル";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_ja_JP: string = "%1に接続した車載機のライセンスをこの車載機に引き継ぎます。";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_ja_JP: string = "引き継ぎに成功しました。";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_ja_JP: string = "引き継ぎに失敗しました。";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_ja_JP: string = "%1に新しい車載機（車載機ID：%2）に接続されました。<br/>購入済みのライセンスを新しい車載機に引き継ぎますか？";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_ja_JP: string = "以後、%1に接続した新しい車載機（車載機ID：%2）へライセンスを引き継ぐことができなくなりますがよろしいですか？";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_ja_JP: string = "以下の引き継ぎを行います。";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_ja_JP: string = "前回のライセンス引き継ぎが成功しました。";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_ja_JP: string = "ナビゲーション機能選択";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_ja_JP: string = "ナビゲーション機能が複数ある車載機がございます。ご利用するナビゲーションを選択してください。<br /><br />※車載機のアプリで目的地を設定する場合のナビゲーションを選択することができます。";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_ja_JP: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_ja_JP: string = "ナビゲーション機能選択";
	//月表示(1月)
	public SL_MONTH_TXT_01_ja_JP: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_ja_JP: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_ja_JP: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_ja_JP: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_ja_JP: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_ja_JP: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_ja_JP: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_ja_JP: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_ja_JP: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_ja_JP: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_ja_JP: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_ja_JP: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_ja_JP: string = "yyyy.MM.dd";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_ja_JP: string = "サイズ: ";
    
	public TXT_YELP_0029_ja_JP: string = "エラーが発生しました。しばらくしてから再度お試しください。";
	public SL_TXT_0155_ja_JP: string = "Ver. ";
	public SL_TXT_0189_ja_JP: string = "* 更新"
	public SL_TXT_0191_ja_JP: string = "有効期限：";
	public SL_TXT_0192_ja_JP: string = "地図更新設定";
	public SL_TXT_0193_ja_JP: string = "車載機の地図データを地図配信サーバーからスマートフォンに一時保存できます。次回車載機と接続する際に車載機の地図を更新できます。";
	public SL_TXT_0196_ja_JP: string = "更新設定";
	public SL_TXT_0197_ja_JP: string = "自動更新確認";
	public SL_TXT_0198_ja_JP: string = "モバイルデータ通信";
	public SL_TXT_0199_ja_JP: string = "更新情報";
	public SL_TXT_0200_ja_JP: string = "全てダウンロード";
	public SL_TXT_0201_ja_JP: string = "車載機未更新";
	public SL_TXT_0202_ja_JP: string = "ダウンロード未完了";
	public SL_TXT_0203_ja_JP: string = "車載機更新済・最新状態";
	public SL_TXT_0204_ja_JP: string = "地図: ";
	public SL_TXT_0205_ja_JP: string = "バージョン: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_ja_JPを利用　宣言のみ
	public SL_TXT_0206_ja_JP: string = "サイズ: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_ja_JP: string = "スマートフォンの空き容量が不足しています。";
	public SL_TXT_0208_ja_JP: string = "車載機で地域設定を行ってください。";
	public SL_TXT_0209_ja_JP: string = "MapCareサブスクリプションの有効期限が切れました。サブスクリプションを更新するにはwww.subaru-maps.comをご覧ください。";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_ja_JP: string = "この地図データは30MBを超えています。Wi-Fi環境に接続後、再度ダウンロードしてください。";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_ja_JP: string = "スマートフォンと車載機を接続して車載機の地図を更新してください。車載機の更新後、地図データはスマートフォンから自動で削除されます。";
	public SL_TXT_0212_ja_JP: string = "モバイルデータ通信をONにするとWiFi通信環境で接続されていない場合は、モバイルデータ通信を使って地図データをダウンロードします";
	public SL_TXT_0213_ja_JP: string = "自動更新確認をONにすると自動で車載機の地図データをスマートフォンに一時保存します。\n※パケット通信料が発生します。";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_ja_JP: string = "車載機との接続が切断されました。車載機との接続をお確かめの上、再度お試しください。";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_ja_JP: string = "車載機のストレージ容量が不足しています。車載機の設定をお確かめの上、再度お試しください。";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_ja_JP: string = "データを転送中にエラーが発生しました。しばらくしてから再度お試しください。";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_ja_JP: string = "サーバから地図データをダウンロード中にエラーが発生しました。しばらくしてから再度お試しください。";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_ja_JP: string = "スマートフォンのストレージ容量が不足しています。お使いのスマートフォン内のデータを削除してから再度お試しください。";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_ja_JP: string = 'Wi-Fi環境で通信を行ってください。または更新設定画面で"モバイルデータ通信"を"ON"にしてモバイルデータ通信でダウンロードしてください。<br/>※30MBを超える地図データはモバイルデータ通信ではダウンロードできません。';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_ja_JP: string = "サーバとの通信が切断されました。通信環境をお確かめの上、再度お試しください。";
	// SL_TXT_0221 ※OTHER_SIZE_0001_ja_JPを利用　宣言のみ
	public SL_TXT_0221_ja_JP: string = "サイズ: *MB";

    public TMP_TXT_001_ja_JP: string = '地図データのダウンロード中にiPhoneをスリープモードにしないでください。もし、iPhoneをスリープモードにした場合、再度SUBARU STARLINKアプリを起動してください。';

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // 英語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_en_US: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_en_US: string = "";
    public HOME_006_2_en_US: string = "has expired.<br />You must purchase the function in order to use ";
    public HOME_006_3_en_US: string = "";
    public HOME_006_4_en_US: string = "";
    public HOME_006_5_en_US: string = ".<br />For details, please tap the Display purchase screen button.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_en_US: string = "Display buy screen";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_en_US: string = "Later";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_en_US: string = "Do not display again";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_en_US: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_en_US: string = "DownLoad Fail.Click To Try Again.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_en_US: string = "Connection history not available";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_en_US: string = "BACK";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_en_US: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_en_US: string = "Expires";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_en_US: string = "Application image";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_en_US: string = "Application outline";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_en_US: string = "Application information";
    // 販売元(4Car_TXT_0082)
    public APP_010_en_US: string = "Seller";
    // バージョン(4Car_TXT_0084)
    public APP_011_en_US: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_en_US: string = "Settings";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_en_US: string = "Navigation display";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_en_US: string = "Purchase app item";
    // 非表示(4Car_TXT_0077)
    public APP_015_en_US: string = "Hide";
    // 表示(4Car_TXT_0066)
    public APP_016_en_US: string = "Display";
    // 無料(4Car_TXT_0177)
    public APP_017_en_US: string = "Free";
    // 購入済み(4Car_TXT_0178)
    public APP_018_en_US: string = "Purchased";
    // 販売停止(4Car_TXT_0179)
    public APP_019_en_US: string = "Stop sale";
    // まで(4Car_TXT_0180)
    public APP_020_en_US: string = "until";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_en_US: string = "Expires within";
    public APP_021_2_en_US: string = "days";
    // 有効期間(4Car_TXT_0142)
    public APP_022_en_US: string = "Expires";
    // 期間選択(4Car_TXT_0159)
    public APP_023_en_US: string = "Select period";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_en_US: string = "Cancel";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_en_US: string = "Please choose the period to purchase.<br /><br /><font color='red'>Note<br />The price shown below and the actual settlement price may differ.<br />Be sure to complete the purchase after confirming the settlement price that is indicated when the [Purchase] button is pressed.</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_en_US: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_en_US: string = "Check car navigation";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_en_US: string = "Verify the car navigation system which will be using this function. The purchased function will only be available on the selected car navigation system.";
    public APP_028_2_en_US: string = "The message \"Service has been registered successfully\" will appear when the purchase is complete. Please do not end the application screen or disconnect the communication (when communicating) with the In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_en_US: string = "Registered car navigation";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_en_US: string = "Purchase";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_en_US: string = "Change to another car navigation.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_en_US: string = "Connected car navigation (last time connected)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_en_US: string = "Please push following button to go to the application list screen.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_en_US: string = "Display the application list ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_en_US: string = "Purchase failed. Please restart the SUBARU STARLNK app to try again.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_en_US: string = "The purchase may not have been correctly completed since the process has taken an unusual amount of time. Please wait a while and confirm whether the purchase was completed on the app screen. We apologize for any inconvenience.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_en_US: string = "on";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_en_US: string = "off";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_en_US: string = "An error has occurred. <br />We are sorry for the inconvenience caused. <br />Try again later.";
    // カーナビ未登録時文言
    public APP_EX01_en_US: string = "Not registered";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_en_US: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_en_US: string = "Terms and Conditions of Use";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_en_US: string = "Settings";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_en_US: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_en_US: string = "BACK";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_en_US: string = "Delete the 4Car application data";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_en_US: string = "The setting data in the 4Car application is deleted.<br />(Available with version 1.0.5 or later)<br />* When link with In-Car-Device is unstable, please try deleting the setting data.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_en_US: string = "Delete all the data?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_en_US: string = "All the data was deleted.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_en_US: string = "This function is available with version 1.0.5 or later.";

    //STARLINK エラー対応
    public APP_Error_en_US: string = "Download failed.";

    //STARLINK対応
    public APP_041_en_US: string = "Update";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_en_US: string = "BACK";
    //ヘッダー部文言
    public CONFIG_002_en_US: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_en_US: string = "The STARLINK application data will be deleted.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_en_US: string = "* Resolves unstable connection with In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_en_US: string = "Delete all the data?";
    //confirmダイアログ用文言
    public CONFIG_006_en_US: string = "All the data was deleted.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_en_US: string = "Clear STARLINK application data";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_en_US: string = "Region selection";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_en_US: string = "Select your primary region.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_en_US: string = "* Provides best experience for apps optimized in your region.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_en_US: string = "Terms and Conditions of Use";
    //利用規約更新日付文言
    public CONFIG_012_en_US: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_en_US: string = "日本";
    //アメリカ
    public LOCATION_002_en_US: string = "United States";
    //カナダ
    public LOCATION_003_en_US: string = "Canada";
    //メキシコ
    public LOCATION_004_en_US: string = "México";
    //イギリス
    public LOCATION_005_en_US: string = "United Kingdom";
    //フランス
    public LOCATION_006_en_US: string = "France";
    //ドイツ
    public LOCATION_007_en_US: string = "Deutschland";
    //オランダ
    public LOCATION_008_en_US: string = "Nederland";
    //イタリア
    public LOCATION_009_en_US: string = "Italia";
    //スペイン
    public LOCATION_010_en_US: string = "España";
    //スウェーデン
    public LOCATION_011_en_US: string = "Sverige";
    //ポーランド
    public LOCATION_012_en_US: string = "Polska";
    //ギリシャ
    public LOCATION_013_en_US: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_en_US: string = "Česko";
    //ロシア
    public LOCATION_015_en_US: string = "Россия";
    //ポルトガル
    public LOCATION_016_en_US: string = "Portugal";
    //フィンランド
    public LOCATION_017_en_US: string = "Suomi";
    //ハンガリー
    public LOCATION_018_en_US: string = "Magyarország";


    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_en_US: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_en_US: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_en_US: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_en_US: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_en_US: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_en_US: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_en_US: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_en_US: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_en_US: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_en_US: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_en_US: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_en_US: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_en_US: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_en_US: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_en_US: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_en_US: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_en_US: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_en_US: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_en_US: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_en_US: string = "Update to the latest version of SUBARU STARLINK app prior to use.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_en_US: string = "A new In-Car-Device has been installed. <br/>Do you want to transfer the existing license to the new one?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_en_US: string = "Yes";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_en_US: string = "No";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_en_US: string = "Remind me later";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_en_US: string = "[Caution!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_en_US: string = "From this point forward, your license cannot be transferred back to this device. Do you wish to proceed?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_en_US: string = "Select the device to transfer the license from";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_en_US: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_en_US: string = "Connected date: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_en_US: string = "mm/dd/yyyy";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_en_US: string = "Cancel";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_en_US: string = "Transfer the license to the new device from the one that was connected on %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_en_US: string = "The license transfer was successful.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_en_US: string = "The license transfer has failed.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_en_US: string = "The connection to your new In-Car Device (ID: %2) was made on %1.<br/>Do you want to transfer the existing license to the new one?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_en_US: string = "From this point forward, the license cannot be transferred to this new In-Car-Device (ID: %2) that has been connected on %1. Do you wish to proceed?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_en_US: string = "The following will be transferred. ";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_en_US: string = "The previous license transfer was successful.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_en_US: string = "Select navigation function";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_en_US: string = "Some In-Car-Devices have multiple navigation functions. Select a navigation to use.<br/><br/>*You may select the navigation used when setting a destination using the In-Car-Device application.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_en_US: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_en_US: string = "Select navigation function";
	//月表示(1月)
	public SL_MONTH_TXT_01_en_US: string = "Jan.";
	//月表示(2月)
	public SL_MONTH_TXT_02_en_US: string = "Feb.";
	//月表示(3月)
	public SL_MONTH_TXT_03_en_US: string = "Mar.";
	//月表示(4月)
	public SL_MONTH_TXT_04_en_US: string = "Apr.";
	//月表示(5月)
	public SL_MONTH_TXT_05_en_US: string = "May";
	//月表示(6月)
	public SL_MONTH_TXT_06_en_US: string = "June";
	//月表示(7月)
	public SL_MONTH_TXT_07_en_US: string = "July";
	//月表示(8月)
	public SL_MONTH_TXT_08_en_US: string = "Aug.";
	//月表示(9月)
	public SL_MONTH_TXT_09_en_US: string = "Sep.";
	//月表示(10月)
	public SL_MONTH_TXT_10_en_US: string = "Oct.";
	//月表示(11月)
	public SL_MONTH_TXT_11_en_US: string = "Nov.";
	//月表示(12月)
	public SL_MONTH_TXT_12_en_US: string = "Dec.";
	//日付表示形式
	public SL_DATE_FMT_01_en_US: string = "MMM d.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_en_US: string = "Size: ";
	public TXT_YELP_0029_en_US: string = "Error Occurred.Please try again later.";
	public SL_TXT_0155_en_US: string = "Ver. ";
	public SL_TXT_0189_en_US: string = "Updated *";
	public SL_TXT_0191_en_US: string = "Expiration Date: ";
	public SL_TXT_0192_en_US: string = "Map Update Settings";
	public SL_TXT_0193_en_US: string = "The In-Car-Device map data can be temporarily saved to your smartphone from the map distribution server. The next time you connect to the In-Car-Device, you can update the map.";
	public SL_TXT_0196_en_US: string = "Update settings";
	public SL_TXT_0197_en_US: string = "Check auto update";
	public SL_TXT_0198_en_US: string = "Cellular";
	public SL_TXT_0199_en_US: string = "Update info.";
	public SL_TXT_0200_en_US: string = "Download all";
	public SL_TXT_0201_en_US: string = "In-Car-Device not updated";
	public SL_TXT_0202_en_US: string = "Download not complete";
	public SL_TXT_0203_en_US: string = "In-Car-Device up-to-date";
	public SL_TXT_0204_en_US: string = "Map: ";
	public SL_TXT_0205_en_US: string = "Version: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_en_USを利用　宣言のみ
	public SL_TXT_0206_en_US: string = "Size: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_en_US: string = "There is not enough space available on the smartphone.";
	public SL_TXT_0208_en_US: string = "Set location with the In-Car-Device. Press OK button for details.";
	public SL_TXT_0209_en_US: string = "Your MapCare subscription has expired. Please visit www.subaru-maps.com to update your subscription.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_en_US: string = "Map Update larger than 30 MB.\n\nPlease connect to Wi-Fi to download.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_en_US: string = "Update map by connecting In-Car-Device to smartphone. After updating In-Car-Device, map data will automatically be deleted from smartphone.";
	public SL_TXT_0212_en_US: string = "If you set Cellular to ON, you can download map data when Wi-Fi is set OFF.";
	public SL_TXT_0213_en_US: string = "The In-Car-Device map data can be temporarily saved to your smartphone automatically by setting check auto update to ON.\n*Data charges will apply.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_en_US: string = "Connection to In-Car-Device was disconnected. Try again after confirming connection to In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_en_US: string = "Insufficient In-Car-Device storage available. Try again after confirming In-Car-Device settings.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_en_US: string = "Error occurred during data transfer.Please try again later.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_en_US: string = "Error occurred while downloading map data from the server.Please try again later.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_en_US: string = "Insufficient smartphone storage available. Try again after deleting data from your smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_en_US: string = 'Cellular Data OFF.\n\nPlease connect to Wi-Fi to download map update.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_en_US: string = "Communication with server was disconnected. Try again after confirming communications environment.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_en_USを利用　宣言のみ
	public SL_TXT_0221_en_US: string = "Size: *MB";

    public TMP_TXT_001_en_US: string = 'Don’t push PW key to shift the sleep , if you push PW downloading is stop.';
    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // フランス語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_fr_FR: string = "ACCUEIL";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_fr_FR: string = "";
    public HOME_006_2_fr_FR: string = " a expiré.<br />Vous devez acheter la fonction afin d’utiliser ";
    public HOME_006_3_fr_FR: string = "";
    public HOME_006_4_fr_FR: string = "";
    public HOME_006_5_fr_FR: string = ".<br />Pour plus de détails, veuillez taper sur la touche « Afficher l’écran d’achat ».";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_fr_FR: string = "Afficher l’écran d’achat";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_fr_FR: string = "Plus tard";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_fr_FR: string = "Ne plus afficher";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_fr_FR: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_fr_FR: string = "Échec du téléchargement. Cliquez pour réessayer.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_fr_FR: string = "Historique des connexions indisponible";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_fr_FR: string = "RETOUR";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_fr_FR: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_fr_FR: string = "Expire";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_fr_FR: string = "Image de l’application";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_fr_FR: string = "Grandes lignes de l’application";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_fr_FR: string = "Informations de l’application";
    // 販売元(4Car_TXT_0082)
    public APP_010_fr_FR: string = "Vendeur";
    // バージョン(4Car_TXT_0084)
    public APP_011_fr_FR: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_fr_FR: string = "Réglages";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_fr_FR: string = "Écran de navigation";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_fr_FR: string = "Acheter un élément d’application";
    // 非表示(4Car_TXT_0077)
    public APP_015_fr_FR: string = "Masquer";
    // 表示(4Car_TXT_0066)
    public APP_016_fr_FR: string = "Affichage";
    // 無料(4Car_TXT_0177)
    public APP_017_fr_FR: string = "Gratuit";
    // 購入済み(4Car_TXT_0178)
    public APP_018_fr_FR: string = "Acheté";
    // 販売停止(4Car_TXT_0179)
    public APP_019_fr_FR: string = "Arrêter la vente";
    // まで(4Car_TXT_0180)
    public APP_020_fr_FR: string = "Jusqu’au";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_fr_FR: string = "Expire dans";
    public APP_021_2_fr_FR: string = "jours";
    // 有効期間(4Car_TXT_0142)
    public APP_022_fr_FR: string = "Expire";
    // 期間選択(4Car_TXT_0159)
    public APP_023_fr_FR: string = "Sélectionner une période";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_fr_FR: string = "Annuler";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_fr_FR: string = "Veuillez choisir la période de l’achat.<br /><br /><font color='red'>Note<br />Le prix indiqué ci-dessous et le prix de règlement réel peut différer.<br />Assurez-vous de compléter l'achat après avoir confirmé le prix de règlement indiqué après avoir pressé le bouton [Acheter].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_fr_FR: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_fr_FR: string = "Vérifier le système de navigation automobile";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_fr_FR: string = "Vérifiez le système de navigation automobile qui utilisera cette fonction. La fonction achetée ne sera disponible que sur le système de navigation automobile sélectionné.";
    public APP_028_2_fr_FR: string = "Le message « Le service a bien été enregistré » apparaîtra une fois l’achat terminé. Ne quittez pas l’écran de l’application et ne coupez pas la communication (pendant la communication) avec In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_fr_FR: string = "Système de navigation automobile enregistré";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_fr_FR: string = "Acheter";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_fr_FR: string = "Changer de système de navigation automobile.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_fr_FR: string = "Système de navigation automobile connecté (à la dernière connexion)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_fr_FR: string = "Veuillez appuyer sur la touche ci-dessous pour accéder à l’écran de la liste des applications.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_fr_FR: string = "Afficher la liste des applications ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_fr_FR: string = "Veuillez nous excuser, l’achat a échoué. Veuillez contacter votre administrateur Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_fr_FR: string = "Il se peut que l’achat n’ait pas été réalisé correctement, car la durée du processus n’est pas la même que d’habitude. Veuillez patienter un moment avant de vérifier si l’achat a été réalisé sur l’écran de l’application. Veuillez nous excuser pour la gêne occasionnée.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_fr_FR: string = "activé";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_fr_FR: string = "désactivé";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_fr_FR: string = "Une erreur est survenue.<br />Nous sommes désolés pour la gêne occasionnée.<br />Réessayez ultérieurement.";
    // カーナビ未登録時文言
    public APP_EX01_fr_FR: string = "Non enregistré";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_fr_FR: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_fr_FR: string = "Modalités d’utilisation";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_fr_FR: string = "Réglages";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_fr_FR: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_fr_FR: string = "RETOUR";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_fr_FR: string = "Supprimer les données de l’application 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_fr_FR: string = "Les données de réglage de l’application 4Car sont supprimées.<br />(Disponible dans la version 1.0.5 ou une version ultérieure)<br />* Lorsque le lien avec le dispositif embarqué est instable, essayez de supprimer les données de réglage.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_fr_FR: string = "Supprimer toutes les données ?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_fr_FR: string = "Toutes les données sont supprimées.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_fr_FR: string = "Cette fonction est disponible dans la version 1.0.5 ou une version ultérieure.";

    //STARLINK エラー対応
    public APP_Error_fr_FR: string = "Échec du téléchargement.";

    //STARLINK対応
    public APP_041_fr_FR: string = "Mise à jour";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_fr_FR: string = "RETOUR";
    //ヘッダー部文言
    public CONFIG_002_fr_FR: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_fr_FR: string = "Les données de l'application STARLINK seront supprimées.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_fr_FR: string = "* Cela résout la connexion instable à l'In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_fr_FR: string = "Supprimer toutes les données ?";
    //confirmダイアログ用文言
    public CONFIG_006_fr_FR: string = "Toutes les données sont supprimées.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_fr_FR: string = "Effacer les données de l'application STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_fr_FR: string = "Sélection de région";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_fr_FR: string = "Sélectionnez votre région principale.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_fr_FR: string = "* Cela permet de vous fournir la meilleure expérience pour les applications optimisées dans votre région.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_fr_FR: string = "Modalités d'utilisation";
    //利用規約更新日付文言
    public CONFIG_012_fr_FR: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_fr_FR: string = "日本";
    //アメリカ
    public LOCATION_002_fr_FR: string = "United States";
    //カナダ
    public LOCATION_003_fr_FR: string = "Canada";
    //メキシコ
    public LOCATION_004_fr_FR: string = "México";
    //イギリス
    public LOCATION_005_fr_FR: string = "United Kingdom";
    //フランス
    public LOCATION_006_fr_FR: string = "France";
    //ドイツ
    public LOCATION_007_fr_FR: string = "Deutschland";
    //オランダ
    public LOCATION_008_fr_FR: string = "Nederland";
    //イタリア
    public LOCATION_009_fr_FR: string = "Italia";
    //スペイン
    public LOCATION_010_fr_FR: string = "España";
    //スウェーデン
    public LOCATION_011_fr_FR: string = "Sverige";
    //ポーランド
    public LOCATION_012_fr_FR: string = "Polska";
    //ギリシャ
    public LOCATION_013_fr_FR: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_fr_FR: string = "Česko";
    //ロシア
    public LOCATION_015_fr_FR: string = "Россия";
    //ポルトガル
    public LOCATION_016_fr_FR: string = "Portugal";
    //フィンランド
    public LOCATION_017_fr_FR: string = "Suomi";
    //ハンガリー
    public LOCATION_018_fr_FR: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_fr_FR: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_fr_FR: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_fr_FR: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_fr_FR: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_fr_FR: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_fr_FR: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_fr_FR: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_fr_FR: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_fr_FR: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_fr_FR: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_fr_FR: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_fr_FR: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_fr_FR: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_fr_FR: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_fr_FR: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_fr_FR: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_fr_FR: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_fr_FR: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_fr_FR: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_fr_FR: string = "Mettez à jour vers la dernière version de l'application SUBARU STARLINK avant l'utilisation.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_fr_FR: string = "Un nouvel In-Car-Device a été installé.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil ?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_fr_FR: string = "Oui";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_fr_FR: string = "Non";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_fr_FR: string = "Me le rappeler plus tard";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_fr_FR: string = "[Attention !]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_fr_FR: string = "Vous ne pourrez plus transférer votre licence de retour vers cet appareil par la suite. Souhaitez-vous poursuivre ?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_fr_FR: string = "Sélectionnez l'appareil à partir duquel le transfert sera effectué";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_fr_FR: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_fr_FR: string = "Date de connexion: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_fr_FR: string = "jj/mm/aaaa";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_fr_FR: string = "Annuler";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_fr_FR: string = "Transférer la licence vers le nouvel appareil à partir de celui qui était connecté le %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_fr_FR: string = "Le transfert de licence a réussi.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_fr_FR: string = "Le transfert de licence a échoué.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_fr_FR: string = "La connexion vers votre nouvel In-Car Device (ID: %2) a été faite le %1.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil ?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_fr_FR: string = "Par la suite, vous ne pourrez plus transférer la licence vers ce nouvel In-Car Device (ID: %2) qui a été connecté le %1. Souhaitez-vous poursuivre ?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_fr_FR: string = "Ce qui suit sera transféré.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_fr_FR: string = "Le précédent transfert de licence a réussi.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_fr_FR: string = "Sélectionner la fonction de navigation";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_fr_FR: string = "Certains In-Car-Devices disposent de multiples fonctions de navigation. Sélectionnez la navigation que vous souhaitez utiliser.<br/><br/>*Vous pouvez sélectionner la navigation utilisée lors du réglage d'une destination à l'aide de l'application de l'In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_fr_FR: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_fr_FR: string = "Sélectionner la fonction de navigation";
	//月表示(1月)
	public SL_MONTH_TXT_01_fr_FR: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_fr_FR: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_fr_FR: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_fr_FR: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_fr_FR: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_fr_FR: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_fr_FR: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_fr_FR: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_fr_FR: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_fr_FR: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_fr_FR: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_fr_FR: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_fr_FR: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_fr_FR: string = "Taille : ";
	public TXT_YELP_0029_fr_FR: string = "Une erreur est survenue.Veuillez réessayer plus tard.";
	public SL_TXT_0155_fr_FR: string = "Ver. ";
	public SL_TXT_0189_fr_FR: string = "Mis à jour le *";
	public SL_TXT_0191_fr_FR: string = "Date d'expiration : ";
	public SL_TXT_0192_fr_FR: string = "Réglages de mise à jour des cartes";
	public SL_TXT_0193_fr_FR: string = "Les données de carte de l'In-Car-Device peuvent être sauvegardées de façon temporaire sur votre téléphone intelligent à partir du serveur de distribution de cartes. La prochaine fois que vous vous connectez à l'In-Car-Device, vous pourrez mettre à jour la carte.";
	public SL_TXT_0196_fr_FR: string = "Réglages mise à jour";
	public SL_TXT_0197_fr_FR: string = "Vérification de la mise à jour automatique";
	public SL_TXT_0198_fr_FR: string = "Mobile";
	public SL_TXT_0199_fr_FR: string = "Info. de mise à jour";
	public SL_TXT_0200_fr_FR: string = "Tout télécharger";
	public SL_TXT_0201_fr_FR: string = "In-Car-Device non mis à jour";
	public SL_TXT_0202_fr_FR: string = "Téléchargement non terminé";
	public SL_TXT_0203_fr_FR: string = "In-Car-Device mis à jour";
	public SL_TXT_0204_fr_FR: string = "Carte : ";
	public SL_TXT_0205_fr_FR: string = "Version : ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_fr_FRを利用　宣言のみ
	public SL_TXT_0206_fr_FR: string = "Taille : *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_fr_FR: string = "Espace insuffisant sur le smartphone.";
	public SL_TXT_0208_fr_FR: string = "Réglez la position à l'aide de l'In-Car-Device. Appuyez sur le bouton OK pour plus de détails.";
	public SL_TXT_0209_fr_FR: string = "Votre abonnement MapCare a expiré. Pour mettre à jour votre abonnement, rendez-vous sur le site www.subaru-maps.com.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_fr_FR: string = "La mise à jour de la carte dépasse 30 Mo.\n\nVeuillez vous connecter au Wi-Fi pour la télécharger.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_fr_FR: string = "Mettez à jour la carte en connectant l'In-Car-Device au smartphone. Après la mise à jour de l'In-Car-Device, les données de carte seront automatiquement supprimées du smartphone.";
	public SL_TXT_0212_fr_FR: string = "Si vous réglez Mobile sur ACTIVÉ, vous pouvez télécharger des données de carte lorsque Wi-Fi est réglé sur DÉSACTIVÉ.";
	public SL_TXT_0213_fr_FR: string = "Les données de carte de l'In-Car-Device peuvent être automatiquement sauvegardées de façon temporaire sur votre smartphone en réglant la vérification de la mise à jour automatique sur ACTIVÉ.\n*Des frais de transmission de données s'appliqueront.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_fr_FR: string = "La connexion à l'In-Car-Device a été interrompue. Réessayez après avoir confirmé la connexion à l'In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_fr_FR: string = "L'espace de stockage disponible sur l'In-Car-Device est insuffisant. Réessayez après avoir confirmé les réglages de l'In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_fr_FR: string = "Une erreur est survenue pendant le transfert de données. Veuillez réessayer plus tard.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_fr_FR: string = "Une erreur est survenue lors du téléchargement des données de carte du serveur. Veuillez réessayer plus tard.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_fr_FR: string = "L'espace de stockage disponible sur le smartphone est insuffisant. Réessayez après avoir supprimé des données de votre smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_fr_FR: string = "Données cellulaires désactivées.\n\nVeuillez vous connecter au Wi-Fi pour télécharger la mise à jour de la carte.";
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_fr_FR: string = "La communication avec le serveur a été interrompue. Réessayez après avoir confirmé l'environnement de communications.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_fr_FRを利用　宣言のみ
	public SL_TXT_0221_fr_FR: string = "Taille : *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // スペイン語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_es_ES: string = "INICIO";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_es_ES: string = "";
    public HOME_006_2_es_ES: string = " ha vencido.<br />Debe adquirir la función para utilizar ";
    public HOME_006_3_es_ES: string = "";
    public HOME_006_4_es_ES: string = "";
    public HOME_006_5_es_ES: string = ".<br />Para obtener más información, pulse el botón Mostrar pantalla de adquisición.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_es_ES: string = "Mostrar pantalla de compra";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_es_ES: string = "Más tarde";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_es_ES: string = "No mostrar de nuevo";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_es_ES: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_es_ES: string = "Descarga fallida. Haga clic en Intentar de nuevo.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_es_ES: string = "Historial de conexiones no disponible";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_es_ES: string = "ATRÁS";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_es_ES: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_es_ES: string = "Vence";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_es_ES: string = "Imagen de la aplicación";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_es_ES: string = "Descripción de la aplicación";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_es_ES: string = "Información de la aplicación";
    // 販売元(4Car_TXT_0082)
    public APP_010_es_ES: string = "Vendedor";
    // バージョン(4Car_TXT_0084)
    public APP_011_es_ES: string = "Versión";
    // 設定(4Car_TXT_0085)
    public APP_012_es_ES: string = "Configuración";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_es_ES: string = "Pantalla de navegación";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_es_ES: string = "Adquirir elemento de aplicación";
    // 非表示(4Car_TXT_0077)
    public APP_015_es_ES: string = "Ocultar";
    // 表示(4Car_TXT_0066)
    public APP_016_es_ES: string = "Mostrar";
    // 無料(4Car_TXT_0177)
    public APP_017_es_ES: string = "Gratis";
    // 購入済み(4Car_TXT_0178)
    public APP_018_es_ES: string = "Adquirido";
    // 販売停止(4Car_TXT_0179)
    public APP_019_es_ES: string = "Detener venta";
    // まで(4Car_TXT_0180)
    public APP_020_es_ES: string = "Para";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_es_ES: string = "Caduca en";
    public APP_021_2_es_ES: string = "días";
    // 有効期間(4Car_TXT_0142)
    public APP_022_es_ES: string = "Vence";
    // 期間選択(4Car_TXT_0159)
    public APP_023_es_ES: string = "Seleccionar período";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_es_ES: string = "Cancelar";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_es_ES: string = "Seleccione el período de adquisición.<br /><br /><font color='red'>Nota<br />El precio mostrado a continuación y el precio de liquidación real puede diferir.<br />Asegúrese de completar la compra después de confirmar el precio de liquidación que se indica al pulsar el botón [Adquirir].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_es_ES: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_es_ES: string = "Comprobar navegación del coche";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_es_ES: string = "Verifique el sistema de navegación para vehículos que utilizará esta función. La función adquirida solo estará disponible en el sistema de navegación para vehículos seleccionado.";
    public APP_028_2_es_ES: string = "Aparecerá el mensaje \"El servicio se ha registrado correctamente\" una vez finalizada la compra. No cierre la pantalla de la aplicación ni desconecte la comunicación (si hay una comunicación en curso) con In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_es_ES: string = "Navegación del coche registrada";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_es_ES: string = "Adquirir";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_es_ES: string = "Cambiar a otra navegación del coche.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_es_ES: string = "Navegación del coche conectada (última vez conectada)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_es_ES: string = "Pulse el siguiente botón para ir a la pantalla de lista de aplicaciones.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_es_ES: string = "Mostrar la lista de aplicaciones";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_es_ES: string = "Pedimos disculpas y le avisamos que se ha producido un error en la compra. Póngase en contacto con su administrador de Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_es_ES: string = "No se ha podido completar correctamente la compra ya que el proceso ha durado más tiempo de lo normal. Espere unos minutos y confirme si la compra se ha realizado en la pantalla de la aplicación. Pedimos disculpas por los inconvenientes.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_es_ES: string = "encendido";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_es_ES: string = "apagado";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_es_ES: string = "Se ha producido un error.<br />Lamentamos las molestias.<br />Inténtelo de nuevo más tarde.";
    // カーナビ未登録時文言
    public APP_EX01_es_ES: string = "No registrado";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_es_ES: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_es_ES: string = "Términos y condiciones de uso";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_es_ES: string = "Configuración";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_es_ES: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_es_ES: string = "ATRÁS";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_es_ES: string = "Eliminar los datos de la aplicación 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_es_ES: string = "Se eliminan los datos de configuración de la aplicación 4Car.<br />(Disponible con la versión 1.0.5 o posterior)<br />* Cuando el enlace con el dispositivo In-Car no sea estable, pruebe a eliminar los datos de configuración.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_es_ES: string = "¿Eliminar todos los datos?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_es_ES: string = "Se han eliminado todos los datos.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_es_ES: string = "Esta función está disponible con la versión 1.0.5 o posterior.";

    //STARLINK エラー対応
    public APP_Error_es_ES: string = "La descarga falló.";

    //STARLINK対応
    public APP_041_es_ES: string = "Actualización";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_es_ES: string = "ATRAS";
    //ヘッダー部文言
    public CONFIG_002_es_ES: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_es_ES: string = "Los datos de la aplicación STARLINK se eliminarán.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_es_ES: string = "* Esto resuelve la conexión instable al In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_es_ES: string = "¿Eliminar todos los datos?";
    //confirmダイアログ用文言
    public CONFIG_006_es_ES: string = "Se han eliminado todos los datos.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_es_ES: string = "Borrar los datos de la aplicación STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_es_ES: string = "Selección de región";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_es_ES: string = "Seleccione su región primaria.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_es_ES: string = "* Esto ofrece la mejor experiencia para las aplicaciones optimizadas en su región.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_es_ES: string = "Términos y condiciones de uso";
    //利用規約更新日付文言
    public CONFIG_012_es_ES: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_es_ES: string = "日本";
    //アメリカ
    public LOCATION_002_es_ES: string = "United States";
    //カナダ
    public LOCATION_003_es_ES: string = "Canada";
    //メキシコ
    public LOCATION_004_es_ES: string = "México";
    //イギリス
    public LOCATION_005_es_ES: string = "United Kingdom";
    //フランス
    public LOCATION_006_es_ES: string = "France";
    //ドイツ
    public LOCATION_007_es_ES: string = "Deutschland";
    //オランダ
    public LOCATION_008_es_ES: string = "Nederland";
    //イタリア
    public LOCATION_009_es_ES: string = "Italia";
    //スペイン
    public LOCATION_010_es_ES: string = "España";
    //スウェーデン
    public LOCATION_011_es_ES: string = "Sverige";
    //ポーランド
    public LOCATION_012_es_ES: string = "Polska";
    //ギリシャ
    public LOCATION_013_es_ES: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_es_ES: string = "Česko";
    //ロシア
    public LOCATION_015_es_ES: string = "Россия";
    //ポルトガル
    public LOCATION_016_es_ES: string = "Portugal";
    //フィンランド
    public LOCATION_017_es_ES: string = "Suomi";
    //ハンガリー
    public LOCATION_018_es_ES: string = "Magyarország";



    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_es_ES: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_es_ES: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_es_ES: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_es_ES: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_es_ES: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_es_ES: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_es_ES: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_es_ES: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_es_ES: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_es_ES: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_es_ES: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_es_ES: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_es_ES: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_es_ES: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_es_ES: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_es_ES: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_es_ES: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_es_ES: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_es_ES: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_es_ES: string = "Actualice a la versión más reciente de la aplicación SUBARU STARLINK antes de utilizarla.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_es_ES: string = "Un nuevo In-Car-Device ha sido instalado.<br/>¿Desea transferir la licencia existente al nuevo?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_es_ES: string = "Sí";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_es_ES: string = "No";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_es_ES: string = "Recordármelo más tarde";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_es_ES: string = "[¡Precaución!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_es_ES: string = "En adelante su licencia no podrá ser transferida de nuevo a este dispositivo. ¿Desea seguir?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_es_ES: string = "Seleccione el dispositivo del que transferirá la licencia";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_es_ES: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_es_ES: string = "Fecha de conexión: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_es_ES: string = "dd/mm/aaaa";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_es_ES: string = "Cancelar";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_es_ES: string = "Transferir la licencia al nuevo dispositivo del que fue conectado el %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_es_ES: string = "La transferencia de licencia se realizó correctamente.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_es_ES: string = "La transferencia de licencia ha fallado.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_es_ES: string = "La conexión con su nuevo In-Car-Device (ID: %2) fue establecida el %1.<br/>¿Desea transferir la licencia existente al nuevo?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_es_ES: string = "En adelante la licencia no podrá ser transferida a este nuevo In-Car-Device (ID: %2) que ha sido conectado el %1. ¿Desea seguir?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_es_ES: string = "Lo siguiente será transferido.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_es_ES: string = "La transferencia de licencia anterior se realizó correctamente.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_es_ES: string = "Seleccionar la función de navegación";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_es_ES: string = "Algunos In-Car-Devices disponen de múltiples funciones de navegación. Seleccione la navegación que desea utilizar.<br/><br/>*Puede seleccionar la navegación utilizada al establecer un destino mediante la aplicación del In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_es_ES: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明(XXX)
    public DELEGATION_004_es_ES: string = "Seleccionar la función de navegación";
	//月表示(1月)
	public SL_MONTH_TXT_01_es_ES: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_es_ES: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_es_ES: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_es_ES: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_es_ES: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_es_ES: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_es_ES: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_es_ES: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_es_ES: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_es_ES: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_es_ES: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_es_ES: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_es_ES: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_es_ES: string = "Tamaño: ";
	public TXT_YELP_0029_es_ES: string = "Ha ocurrido un error.Vuelva a intentarlo más tarde.";
	public SL_TXT_0155_es_ES: string = "Ver. ";
	public SL_TXT_0189_es_ES: string = "Actualizado el *";
	public SL_TXT_0191_es_ES: string = "Fecha de expiración: ";
	public SL_TXT_0192_es_ES: string = "Ajustes de actualización de mapa";
	public SL_TXT_0193_es_ES: string = "Los datos de mapa del In-Car-Device pueden guardarse de forma temporal en su smartphone desde el servidor de distribución de mapas. La próxima vez que se conectará al In-Car-Device, podrá actualizar el mapa.";
	public SL_TXT_0196_es_ES: string = "Ajustes actualización";
	public SL_TXT_0197_es_ES: string = "Verificación de la actualización automática";
	public SL_TXT_0198_es_ES: string = "Móvil";
	public SL_TXT_0199_es_ES: string = "Info. actualización";
	public SL_TXT_0200_es_ES: string = "Descargar todo";
	public SL_TXT_0201_es_ES: string = "In-Car-Device no actualizado";
	public SL_TXT_0202_es_ES: string = "Descarga incompleta";
	public SL_TXT_0203_es_ES: string = "In-Car-Device actualizado";
	public SL_TXT_0204_es_ES: string = "Mapa: ";
	public SL_TXT_0205_es_ES: string = "Versión: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_es_ESを利用　宣言のみ
	public SL_TXT_0206_es_ES: string = "Tamaño: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_es_ES: string = "No hay suficiente espacio en el smartphone.";
	public SL_TXT_0208_es_ES: string = "Establezca la ubicación con el In-Car-Device. Pulse el botón OK para más detalles.";
	public SL_TXT_0209_es_ES: string = "Su suscripción a MapCare ha caducado. Visite www.subaru-maps.com para actualizar su suscripción.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_es_ES: string = "Los datos de este mapa superan los 30 MB. Vuelva a descargar después de confirmar la conexión Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_es_ES: string = "Actualice el mapa conectando el In-Car-Device al smartphone. Después de actualizar el In-Car-Device, los datos de mapa se eliminarán automáticamente del smartphone.";
	public SL_TXT_0212_es_ES: string = "Si establece Móvil en ACTIVADO, podrá descargar los datos de mapa cuando Wi-Fi está establecido en DESACTIVADO.";
	public SL_TXT_0213_es_ES: string = "Los datos de mapa del In-Car-Device pueden guardarse automáticamente de forma temporal en su smartphone al establecer la verificación de la actualización automática en ACTIVADO.\n*Se aplicarán cargos de datos.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_es_ES: string = "Se interrumpió la conexión con el In-Car-Device. Vuelva a intentarlo después de confirmar la conexión con el In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_es_ES: string = "El espacio de almacenamiento disponible en el In-Car-Device es insuficiente. Vuelva a intentarlo después de confirmar los ajustes del In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_es_ES: string = "Ha ocurrido un error durante la transferencia de datos. Vuelva a intentarlo más tarde.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_es_ES: string = "Ha ocurrido un error mientras se descargaban los datos de mapa del servidor. Vuelva a intentarlo más tarde.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_es_ES: string = "El espacio de almacenamiento disponible en el smartphone es insuficiente. Vuelva a intentarlo después de eliminar datos de su smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_es_ES: string = 'Utilice el Wi-Fi para la comunicación. O establezca "Móvil" en "ACTIVADO" en la pantalla de los ajustes de actualización y descargue mediante datos móviles.<br/>*No se puede descargar mediante datos  móviles datos de mapa que superan los 30 MB.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_es_ES: string = "Se interrumpió la comunicación con el servidor. Vuelva a intentarlo después de confirmar el entorno de comunicaciones.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_es_ESを利用　宣言のみ
	public SL_TXT_0221_es_ES: string = "Tamaño: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // ドイツ語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_de_DE: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_de_DE: string = "";
    public HOME_006_2_de_DE: string = "> ist abgelaufen.<br />Sie müssen die Funktion erwerben, um ";
    public HOME_006_3_de_DE: string = "";
    public HOME_006_4_de_DE: string = "";
    public HOME_006_5_de_DE: string = " zu verwenden.<br />Einzelheiten erfahren Sie, indem Sie auf „Kaufbildschirm anzeigen“ tippen.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_de_DE: string = "Kaufbildschirm anzeigen";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_de_DE: string = "Später";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_de_DE: string = "Nicht erneut anzeigen";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_de_DE: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_de_DE: string = "Download fehlgeschlagen. Klicken Sie hier, um es erneut zu versuchen.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_de_DE: string = "Verbindungsverlauf nicht verfügbar";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_de_DE: string = "ZURÜCK";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_de_DE: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_de_DE: string = "Läuft ab";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_de_DE: string = "Anwendungsbild";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_de_DE: string = "Anwendungsübersicht";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_de_DE: string = "Anwendungsinformationen";
    // 販売元(4Car_TXT_0082)
    public APP_010_de_DE: string = "Verkäufer";
    // バージョン(4Car_TXT_0084)
    public APP_011_de_DE: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_de_DE: string = "Einstellungen";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_de_DE: string = "Navigationsanzeige";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_de_DE: string = "App-Option kaufen";
    // 非表示(4Car_TXT_0077)
    public APP_015_de_DE: string = "Verbergen";
    // 表示(4Car_TXT_0066)
    public APP_016_de_DE: string = "Anzeige";
    // 無料(4Car_TXT_0177)
    public APP_017_de_DE: string = "Kostenlos";
    // 購入済み(4Car_TXT_0178)
    public APP_018_de_DE: string = "Gekauft";
    // 販売停止(4Car_TXT_0179)
    public APP_019_de_DE: string = "Nicht mehr erhältlich";
    // まで(4Car_TXT_0180)
    public APP_020_de_DE: string = "Bis";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_de_DE: string = "Läuft innerhalb von";
    public APP_021_2_de_DE: string = "Tagen ab";
    // 有効期間(4Car_TXT_0142)
    public APP_022_de_DE: string = "Läuft ab";
    // 期間選択(4Car_TXT_0159)
    public APP_023_de_DE: string = "Zeitraum auswählen";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_de_DE: string = "Abbrechen";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_de_DE: string = "Bitte wählen Sie den Kaufzeitraum aus.<br /><br /><font color='red'>Hinweis<br />Der unten gezeigte Preis und der tatsächlich berechnete Preis können abweichen.<br />Schließen Sie den Kauf erst ab, wenn Sie den berechneten Preis geprüft haben, der angezeigt wird, wenn die Schaltfläche [Kaufen] betätigt wird.</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_de_DE: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_de_DE: string = "Navigationssystem prüfen";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_de_DE: string = "Überprüfen Sie das Fahrzeug-Navigationssystem, das diese Funktion verwenden wird. Die gekaufte Funktion wird nur auf dem ausgewählten Fahrzeug-Navigationssystem verfügbar sein.";
    public APP_028_2_de_DE: string = "Die Meldung „Der Dienst wurde erfolgreich registriert“ wird angezeigt, wenn der Kauf abgeschlossen ist. Schließen Sie nicht den Anwendungsbildschirm und trennen Sie nicht die Kommunikation (während der Kommunikation) mit dem In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_de_DE: string = "Registriertes Fahrzeugnavigationssystem";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_de_DE: string = "Kaufen";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_de_DE: string = "Zu anderen Fahrzeugnavigationssystem wechseln";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_de_DE: string = "Verbundenes Fahrzeugnavigationssystem (beim letzten Verbinden)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_de_DE: string = "Bitte betätigen Sie folgende Schaltfläche, um zur Anwendungsliste zu gelangen";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_de_DE: string = "Die Anwendungsliste anzeigen";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_de_DE: string = "Es tut uns leid, aber der Kauf ist fehlgeschlagen. Bitte wenden Sie sich an Ihren Clarion-Administrator.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_de_DE: string = "Der Kauf wurde möglicherweise nicht richtig abgeschlossen, da der Prozess ungewöhnlich lang gedauert hat. Bitte warten Sie einige Zeit und prüfen Sie auf dem App-Bildschirm, ob der Kauf abgeschlossen wurde.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_de_DE: string = "ein";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_de_DE: string = "aus";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_de_DE: string = "Ein Fehler ist aufgetreten.<br />Wir entschuldigen uns für die Unannehmlichkeiten.<br />Versuchen Sie es später erneut.";
    // カーナビ未登録時文言
    public APP_EX01_de_DE: string = "Nicht registriert";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_de_DE: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_de_DE: string = "Benutzungsbedingungen";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_de_DE: string = "Einstellungen";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_de_DE: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_de_DE: string = "ZURÜCK";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_de_DE: string = "Daten in der 4Car-Anwendung löschen";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_de_DE: string = "Die Einstellungsdaten der 4Car-Anwendung werden gelöscht.<br />(Verfügbar ab Version 1.0.5 oder höher)<br />* Versuchen Sie, die Einstellungsdaten zu löschen, wenn die Verbindung zum Gerät im Fahrzeug nicht stabil ist.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_de_DE: string = "Alle Daten löschen?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_de_DE: string = "Alle Daten wurden gelöscht.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_de_DE: string = "Diese Funktion ist ab Version 1.0.5 verfügbar.";

    //STARLINK エラー対応
    public APP_Error_de_DE: string = "Download fehlgeschlagen.";

    //STARLINK対応
    public APP_041_de_DE: string = "Update";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_de_DE: string = "ZURÜCK";
    //ヘッダー部文言
    public CONFIG_002_de_DE: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_de_DE: string = "Die STARLINK-Applikationsdaten werden gelöscht. ";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_de_DE: string = "* Behebt instabile Verbindung mit dem In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_de_DE: string = "Alle Daten löschen?";
    //confirmダイアログ用文言
    public CONFIG_006_de_DE: string = "Alle Daten wurden gelöscht.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_de_DE: string = "STARLINK-Applikationsdaten löschen";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_de_DE: string = "Region-Auswahl";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_de_DE: string = "Wählen Sie Ihre Hauptregion aus";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_de_DE: string = "* Bietet beste Erfahrung für Apps, die für Ihre Region optimiert sind.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_de_DE: string = "Benutzungsbedingungen";
    //利用規約更新日付文言
    public CONFIG_012_de_DE: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_de_DE: string = "日本";
    //アメリカ
    public LOCATION_002_de_DE: string = "United States";
    //カナダ
    public LOCATION_003_de_DE: string = "Canada";
    //メキシコ
    public LOCATION_004_de_DE: string = "México";
    //イギリス
    public LOCATION_005_de_DE: string = "United Kingdom";
    //フランス
    public LOCATION_006_de_DE: string = "France";
    //ドイツ
    public LOCATION_007_de_DE: string = "Deutschland";
    //オランダ
    public LOCATION_008_de_DE: string = "Nederland";
    //イタリア
    public LOCATION_009_de_DE: string = "Italia";
    //スペイン
    public LOCATION_010_de_DE: string = "España";
    //スウェーデン
    public LOCATION_011_de_DE: string = "Sverige";
    //ポーランド
    public LOCATION_012_de_DE: string = "Polska";
    //ギリシャ
    public LOCATION_013_de_DE: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_de_DE: string = "Česko";
    //ロシア
    public LOCATION_015_de_DE: string = "Россия";
    //ポルトガル
    public LOCATION_016_de_DE: string = "Portugal";
    //フィンランド
    public LOCATION_017_de_DE: string = "Suomi";
    //ハンガリー
    public LOCATION_018_de_DE: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_de_DE: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_de_DE: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_de_DE: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_de_DE: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_de_DE: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_de_DE: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_de_DE: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_de_DE: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_de_DE: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_de_DE: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_de_DE: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_de_DE: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_de_DE: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_de_DE: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_de_DE: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_de_DE: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_de_DE: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_de_DE: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_de_DE: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_de_DE: string = "Vor der Verwendung auf die neuste Version der SUBARU STARLINK-App aktualisieren.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_de_DE: string = "Ein neues In-Car-Device wurde installiert.<br/>Möchten Sie die existierende Lizenz auf das neue Gerät übertragen?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_de_DE: string = "Ja";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_de_DE: string = "Nein";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_de_DE: string = "Später erinnern";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_de_DE: string = "[Achtung!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_de_DE: string = "Von diesem Punkt an kann Ihre Lizenz nicht auf dieses Gerät zurückübertragen werden. Möchten Sie fortfahren?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_de_DE: string = "Das Gerät auswählen, von dem die Lizenz übertragen werden soll";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_de_DE: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_de_DE: string = "Verbindungsdatum: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_de_DE: string = "MM/TT/JJJJ";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_de_DE: string = "Abbrechen";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_de_DE: string = "Die Lizenz von dem Gerät, das am %1 verbunden war, auf das neue Gerät übertragen.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_de_DE: string = "Die Lizenzübertragung war erfolgreich.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_de_DE: string = "Die Lizenzübertragung ist fehlgeschlagen.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_de_DE: string = "Die Verbindung zu Ihrem neuen In-Car-Device (ID: %2) wurde am %1 hergestellt.<br/>Möchten Sie die existierende Lizenz auf das neue Gerät übertragen?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_de_DE: string = "Von diesem Punkt an kann die Lizenz nicht auf dieses neue In-Car-Device (ID: %2), das am %1 verbunden wurde, übertragen werden. Möchten Sie fortfahren?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_de_DE: string = "Das Folgende wird übertragen.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_de_DE: string = "Die vorige Lizenzübertragung war erfolgreich.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_de_DE: string = "Navigationsfunktion auswählen";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_de_DE: string = "Einige In-Car-Devices haben mehrere Navigationsfunktionen. Wählen Sie eine zu verwendende Navigation aus.<br/><br/>*Sie können unter Umständen die Navigation auswählen, die bei der Einstellung eines Zielorts mithilfe der In-Car-Device-Anwendung verwendet wird.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_de_DE: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_de_DE: string = "Navigationsfunktion auswählen";
	//月表示(1月)
	public SL_MONTH_TXT_01_de_DE: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_de_DE: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_de_DE: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_de_DE: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_de_DE: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_de_DE: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_de_DE: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_de_DE: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_de_DE: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_de_DE: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_de_DE: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_de_DE: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_de_DE: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_de_DE: string = "Größe: ";
	public TXT_YELP_0029_de_DE: string = "Es ist ein Fehler aufgetreten.Bitte versuchen Sie es später erneut.";
	public SL_TXT_0155_de_DE: string = "Ver. ";
	public SL_TXT_0189_de_DE: string = "Aktualisiert *";
	public SL_TXT_0191_de_DE: string = "Ablaufdatum: ";
	public SL_TXT_0192_de_DE: string = "Kartenaktualisierungseinstellungen";
	public SL_TXT_0193_de_DE: string = "Die Kartendaten vom In-Car-Device können temporär vom Karten-Distributionsserver auf Ihrem Smartphone gespeichert werden. Bei der nächsten Verbindung mit dem In-Car-Device können Sie die Karte aktualisieren.";
	public SL_TXT_0196_de_DE: string = "Aktual.einstlg.";
	public SL_TXT_0197_de_DE: string = "Automatische Aktualisierungsbestätigung";
	public SL_TXT_0198_de_DE: string = "Mobilfunk";
	public SL_TXT_0199_de_DE: string = "Aktualisierungsinfos";
	public SL_TXT_0200_de_DE: string = "Alle herunterladen";
	public SL_TXT_0201_de_DE: string = "In-Car-Device nicht aktualisiert";
	public SL_TXT_0202_de_DE: string = "Download nicht abgeschlossen";
	public SL_TXT_0203_de_DE: string = "In-Car-Device ist auf dem neusten Stand";
	public SL_TXT_0204_de_DE: string = "Karte: ";
	public SL_TXT_0205_de_DE: string = "Version: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_de_DEを利用　宣言のみ
	public SL_TXT_0206_de_DE: string = "Größe: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_de_DE: string = "Es ist nicht genügend Speicherplatz auf dem Smartphone vorhanden.";
	public SL_TXT_0208_de_DE: string = "Standort mit dem In-Car-Device einstellen. Zu Einzelheiten bitte OK drücken.";
	public SL_TXT_0209_de_DE: string = "Ihr MapCare-Abonnement ist abgelaufen. Besuchen Sie www.subaru-maps.com zum Aktualisieren Ihres Abonnements.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_de_DE: string = "Diese Kartendaten überschreiten 30 MB. Nach Bestätigung der Wi-Fi-Verbindung bitte erneut herunterladen.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_de_DE: string = "Karte aktualisieren durch Verbindung des In-Car-Device mit dem Smartphone. Nach der Aktualisierung des In-Car-Device werden die Kartendaten automatisch vom Smartphone gelöscht.";
	public SL_TXT_0212_de_DE: string = "Wenn Sie Mobilfunk auf EIN einstellen, können Sie die Kartendaten herunterladen, wenn Wi-Fi auf AUS eingestellt ist.";
	public SL_TXT_0213_de_DE: string = "Die In-Car-Device-Kartendaten können automatisch auf Ihrem Smartphone temporär gespeichert werden durch Einstellung der automatischen Aktualisierungsbestätigung auf EIN.\n*Datengebühren können unter Umständen anfallen.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_de_DE: string = "Verbindung zum In-Car-Device wurde getrennt. Versuchen Sie es erneut, nachdem Sie die Verbindung zum In-Car-Device bestätigt haben.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_de_DE: string = "Unzureichender In-Car-Device-Speicherplatz vorhanden. Versuchen Sie es nach der Bestätigung der In-Car-Device-Einstellungen erneut.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_de_DE: string = "Es ist ein Fehler während Datenübertragung aufgetreten. Bitte versuchen Sie es später erneut.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_de_DE: string = "Es ist ein Fehler während des Downloads der Kartendaten vom Server aufgetreten. Bitte versuchen Sie es später erneut. ";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_de_DE: string = "Unzureichender Smartphone-Speicherplatz vorhanden. Bitte versuchen Sie es nach dem Löschen der Daten von Ihrem Smartphone erneut.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_de_DE: string = 'Wi-Fi für die Kommunikation verwenden. Oder "Mobilfunk" auf "EIN" im Aktualisierungseinstellungen-Bildschirm einstellen und mithilfe Mobilfunkdaten herunterladen.<br/>*Kartendaten, die 30 MB überschreiten, können nicht mithilfe Mobilfunkdaten heruntergeladen werden.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_de_DE: string = "Kommunikation mit dem Server war getrennt. Versuchen Sie es nach der Bestätigung der Kommunikationsumgebung erneut.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_de_DEを利用　宣言のみ
	public SL_TXT_0221_de_DE: string = "Größe: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // イタリア語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_it_IT: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_it_IT: string = "";
    public HOME_006_2_it_IT: string = " è scaduto.<br />Occorre acquistare la funzione per utilizzare ";
    public HOME_006_3_it_IT: string = "";
    public HOME_006_4_it_IT: string = "";
    public HOME_006_5_it_IT: string = ".<br />Per i dettagli, toccare il pulsante Visualizza schermata di acquisto.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_it_IT: string = "Visualizza schermata di acquisto";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_it_IT: string = "Più tardi";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_it_IT: string = "Non visualizzare più";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_it_IT: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_it_IT: string = "Download non riuscito. Fare clic per riprovare.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_it_IT: string = "Cronologia delle connessioni non disponibile";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_it_IT: string = "INDIETRO";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_it_IT: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_it_IT: string = "Scadenza";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_it_IT: string = "Immagine applicazione";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_it_IT: string = "Profilo applicazione";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_it_IT: string = "Informazioni applicazione";
    // 販売元(4Car_TXT_0082)
    public APP_010_it_IT: string = "Venditore";
    // バージョン(4Car_TXT_0084)
    public APP_011_it_IT: string = "Versione";
    // 設定(4Car_TXT_0085)
    public APP_012_it_IT: string = "Impostazioni";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_it_IT: string = "Display di navigazione";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_it_IT: string = "Acquista elemento app";
    // 非表示(4Car_TXT_0077)
    public APP_015_it_IT: string = "Nascondi";
    // 表示(4Car_TXT_0066)
    public APP_016_it_IT: string = "Visualizza";
    // 無料(4Car_TXT_0177)
    public APP_017_it_IT: string = "Gratuito";
    // 購入済み(4Car_TXT_0178)
    public APP_018_it_IT: string = "Acquistato";
    // 販売停止(4Car_TXT_0179)
    public APP_019_it_IT: string = "Interrompi vendita";
    // まで(4Car_TXT_0180)
    public APP_020_it_IT: string = "A";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_it_IT: string = "Scade entro";
    public APP_021_2_it_IT: string = "giorni";
    // 有効期間(4Car_TXT_0142)
    public APP_022_it_IT: string = "Scadenza";
    // 期間選択(4Car_TXT_0159)
    public APP_023_it_IT: string = "Seleziona periodo";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_it_IT: string = "Annulla";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_it_IT: string = "Scegliere il periodo per l'acquisto.<br /><br /><font color='red'>Nota<br />Il prezzo indicato di seguito e il prezzo finale corrente potrebbero variare.<br />Assicurarsi di completare l'acquisto dopo aver confermato il prezzo finale indicato quando viene premuto il pulsante [Acquista].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_it_IT: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_it_IT: string = "Controlla navigatore";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_it_IT: string = "Verificare il sistema di navigazione per auto che utilizzerà questa funzione. La funzione acquistata sarà disponibile solo sul sistema di navigazione per auto selezionato.";
    public APP_028_2_it_IT: string = "Al completamento dell'acquisto, verrà visualizzato il messaggio \"Servizio registrato correttamente\". Non chiudere la schermata dell'applicazione o scollegare la comunicazione (durante la comunicazione) con In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_it_IT: string = "Navigatore registrato";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_it_IT: string = "Acquista";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_it_IT: string = "Passa a un altro navigatore.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_it_IT: string = "Navigatore collegato (ultima connessione)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_it_IT: string = "Premere il pulsante seguente per andare alla schermata dell'elenco di applicazioni.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_it_IT: string = "Visualizza l'elenco di applicazioni";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_it_IT: string = "Spiacenti, l'acquisto non è riuscito. Contattare l'amministratore Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_it_IT: string = "È possibile che l'acquisto non sia stato completato correttamente perché il tempo impiegato per il processo è stato anomalo. Attendere e verificare che l'acquisto sia stato completato sulla schermata dell'app. Ci scusiamo per eventuali inconvenienti.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_it_IT: string = "on";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_it_IT: string = "off";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_it_IT: string = "Si è verificato un errore.<br />Ci scusiamo per l'inconveniente.<br />Riprovare più tardi.";
    // カーナビ未登録時文言
    public APP_EX01_it_IT: string = "Non registrato";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_it_IT: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_it_IT: string = "Termini e condizioni di utilizzo";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_it_IT: string = "Impostazioni";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_it_IT: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_it_IT: string = "INDIETRO";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_it_IT: string = "Eliminare i dati dell'applicazione 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_it_IT: string = "I dati di impostazione nell'applicazione 4Car sono stati eliminati.<br />(Disponibile con la versione 1.0.5 o successiva)<br />* Quando il collegamento al dispositivo per auto non è stabile, provare a eliminare i dati di impostazione.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_it_IT: string = "Eliminare tutti i dati?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_it_IT: string = "Tutti i dati sono stati eliminati.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_it_IT: string = "Questa funzione è disponibile con la versione 1.0.5 o successiva.";

    //STARLINK エラー対応
    public APP_Error_it_IT: string = "Download non riuscito.";

    //STARLINK対応
    public APP_041_it_IT: string = "Aggiorna";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_it_IT: string = "INDIETRO";
    //ヘッダー部文言
    public CONFIG_002_it_IT: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_it_IT: string = "I dati dell'applicazione STARLINK verranno eliminati.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_it_IT: string = "* Risolve la connessione instabile con In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_it_IT: string = "Eliminare tutti i dati?";
    //confirmダイアログ用文言
    public CONFIG_006_it_IT: string = "Tutti i dati sono stati eliminati.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_it_IT: string = "Cancella dati dell'applicazione STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_it_IT: string = "Selezionare la regione principale.";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_it_IT: string = "Selezionare la zona principale di utilizzo";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_it_IT: string = "* Offre l'esperienza migliore con le app ottimizzate per la tua regione.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_it_IT: string = "Termini e condizioni di utilizzo";
    //利用規約更新日付文言
    public CONFIG_012_it_IT: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_it_IT: string = "日本";
    //アメリカ
    public LOCATION_002_it_IT: string = "United States";
    //カナダ
    public LOCATION_003_it_IT: string = "Canada";
    //メキシコ
    public LOCATION_004_it_IT: string = "México";
    //イギリス
    public LOCATION_005_it_IT: string = "United Kingdom";
    //フランス
    public LOCATION_006_it_IT: string = "France";
    //ドイツ
    public LOCATION_007_it_IT: string = "Deutschland";
    //オランダ
    public LOCATION_008_it_IT: string = "Nederland";
    //イタリア
    public LOCATION_009_it_IT: string = "Italia";
    //スペイン
    public LOCATION_010_it_IT: string = "España";
    //スウェーデン
    public LOCATION_011_it_IT: string = "Sverige";
    //ポーランド
    public LOCATION_012_it_IT: string = "Polska";
    //ギリシャ
    public LOCATION_013_it_IT: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_it_IT: string = "Česko";
    //ロシア
    public LOCATION_015_it_IT: string = "Россия";
    //ポルトガル
    public LOCATION_016_it_IT: string = "Portugal";
    //フィンランド
    public LOCATION_017_it_IT: string = "Suomi";
    //ハンガリー
    public LOCATION_018_it_IT: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_it_IT: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_it_IT: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_it_IT: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_it_IT: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_it_IT: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_it_IT: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_it_IT: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_it_IT: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_it_IT: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_it_IT: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_it_IT: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_it_IT: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_it_IT: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_it_IT: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_it_IT: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_it_IT: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_it_IT: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_it_IT: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_it_IT: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_it_IT: string = "Prima dell'uso, eseguire l'aggiornamento alla versione più recente di SUBARU STARLINK.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_it_IT: string = "È stato installato un nuovo In-Car-Device.<br/>Trasferire la licenza esistente al nuovo dispositivo?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_it_IT: string = "Si";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_it_IT: string = "No";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_it_IT: string = "Ricordamelo più tardi";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_it_IT: string = "[Attenzione!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_it_IT: string = "Da questo momento in poi, la licenza non potrà essere trasferita nuovamente a questo dispositivo. Procedere?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_it_IT: string = "Selezionare il dispositivo da cui trasferire la licenza";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_it_IT: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_it_IT: string = "Data di connessione: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_it_IT: string = "mm/gg/aaaa";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_it_IT: string = "Annulla";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_it_IT: string = "Trasferire la licenza al nuovo dispositivo dal dispositivo connesso il %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_it_IT: string = "Trasferimento della licenza riuscito correttamente.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_it_IT: string = "Trasferimento della licenza non riuscito.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_it_IT: string = "La connessione al nuovo In-Car Device (ID: %2) è stata effettuata il %1.<br/>Trasferire la licenza esistente al nuovo dispositivo?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_it_IT: string = "Da questo momento in poi, la licenza non può essere trasferita a questo nuovo In-Car-Device (ID: %2) connesso il %1. Procedere?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_it_IT: string = "Verrà eseguito il trasferimento.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_it_IT: string = "Trasferimento della licenza precedente riuscito correttamente.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_it_IT: string = "Seleziona la funzione di navigazione";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_it_IT: string = "Alcuni In-Car-Device sono dotati di più funzioni di navigazione Selezionare una navigazione da usare.<br/><br/>*Selezionare la navigazione usata quando si imposta una destinazione usando l'applicazione In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_it_IT: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_it_IT: string = "Seleziona la funzione di navigazione";
	//月表示(1月)
	public SL_MONTH_TXT_01_it_IT: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_it_IT: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_it_IT: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_it_IT: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_it_IT: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_it_IT: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_it_IT: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_it_IT: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_it_IT: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_it_IT: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_it_IT: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_it_IT: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_it_IT: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_it_IT: string = "Dimensione: ";
    public TXT_YELP_0029_it_IT: string = "Si è verificato un errore.Riprovare più tardi.";
	public SL_TXT_0155_it_IT: string = "Ver. ";
	public SL_TXT_0189_it_IT: string = "Aggiornato il *";
	public SL_TXT_0191_it_IT: string = "Data di scadenza: ";
	public SL_TXT_0192_it_IT: string = "Impostazioni di aggiornamento mappa";
	public SL_TXT_0193_it_IT: string = "I dati della mappa In-Car-Device possono essere salvati temporaneamente nello smartphone dal server di distribuzione delle mappe. Alla successiva connessione a In-Car-Device, sarà possibile aggiornare la mappa.";
	public SL_TXT_0196_it_IT: string = "Impost. di aggiorn.";
	public SL_TXT_0197_it_IT: string = "Verifica aggiornamento auto";
	public SL_TXT_0198_it_IT: string = "Cellulare";
	public SL_TXT_0199_it_IT: string = "Info. aggiornamento";
	public SL_TXT_0200_it_IT: string = "Scarica tutto";
	public SL_TXT_0201_it_IT: string = "In-Car-Device non è aggiornato";
	public SL_TXT_0202_it_IT: string = "Download non completato";
	public SL_TXT_0203_it_IT: string = "In-Car-Device aggiornato";
	public SL_TXT_0204_it_IT: string = "Mappa: ";
	public SL_TXT_0205_it_IT: string = "Versione: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_it_ITを利用　宣言のみ
	public SL_TXT_0206_it_IT: string = "Dimensione: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_it_IT: string = "Spazio insufficiente disponibile sullo smartphone.";
	public SL_TXT_0208_it_IT: string = "Impostare la posizione con In-Car-Device. Per dettagli, premere il pulsante OK.";
	public SL_TXT_0209_it_IT: string = "Abbonamento MapCare scaduto.\nVisitare il sito Web www.subaru-maps.com\nper aggiornare l'abbonamento.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_it_IT: string = "I dati della mappa superano 30 MB. Effettuare nuovamente il download dopo aver confermato la connessione Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_it_IT: string = "Aggiornare la mappa connettendo In-Car-Device allo smartphone, Dopo aver aggiornato In-Car-Device, i dati della mappa verranno automaticamente eliminati dallo smartphone.";
	public SL_TXT_0212_it_IT: string = "Se il Cellulare è impostato su ON, scaricare i dati della mappa quando il Wi-Fi è impostato su OFF.";
	public SL_TXT_0213_it_IT: string = "I dati mappa di In-Car-Device possono essere salvati temporaneamente automaticamente sullo smartphone impostando l'aggiornamento automatico su ON.\n*Ai dati potrebbero essere soggetti all'applicazione di tariffe.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_it_IT: string = "La connessione a In-Car-Device è stata scollegata. Riprovare dopo aver confermato la connessione a In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_it_IT: string = "Spazio di archiviazione su In-Car-Device insufficiente. Riprovare dopo aver confermato le impostazioni In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_it_IT: string = "Si è verificato un errore durante il trasferimento dei dati. Riprovare in seguito.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_it_IT: string = "Si è verificato un errore durante il download dei dati mappa dal server. Riprovare in seguito.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_it_IT: string = "Spazio di archiviazione su smartphone insufficiente. Riprovare dopo aver eliminato i dati dallo smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_it_IT: string = 'Usare il Wi-Fi per la comunicazione. Oppure, impostare "Cellulare" su "ON" nella schermata di impostazioni di aggiornamento ed eseguire il download usando i dati cellulare.<br/>*I dati mappa che superano 30 MB non possono essere scaricati usando i dati cellulare.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_it_IT: string = "La comunicazione con il server è stata scollegata. Riprovare dopo aver comunicato l'ambiente di comunicazione.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_it_ITを利用　宣言のみ
	public SL_TXT_0221_it_IT: string = "Dimensione: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // ロシア語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_ru_RU: string = "ГЛАВНАЯ";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_ru_RU: string = "Истек срок действия ";
    public HOME_006_2_ru_RU: string = ".<br />Необходимо приобрести лицензию, чтобы использовать ";
    public HOME_006_3_ru_RU: string = "";
    public HOME_006_4_ru_RU: string = "";
    public HOME_006_5_ru_RU: string = ".<br />Для получения дополнительных сведений нажмите кнопку \"Показать экран заказа\".";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_ru_RU: string = "Показать экран покупки";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_ru_RU: string = "Позднее";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_ru_RU: string = "Больше не показывать";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_ru_RU: string = "ПРИЛОЖЕНИЕ";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_ru_RU: string = "Ошибка загрузки. Нажмите, чтобы попробовать еще раз.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_ru_RU: string = "История соединений недоступна";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_ru_RU: string = "НАЗАД";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_ru_RU: string = "НАСТРОЙКА";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_ru_RU: string = "Окончание срока действия";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_ru_RU: string = "Изображение приложения";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_ru_RU: string = "Макет приложения";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_ru_RU: string = "Информация приложения";
    // 販売元(4Car_TXT_0082)
    public APP_010_ru_RU: string = "Продавец";
    // バージョン(4Car_TXT_0084)
    public APP_011_ru_RU: string = "Версия";
    // 設定(4Car_TXT_0085)
    public APP_012_ru_RU: string = "Настройки";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_ru_RU: string = "Навигационный дисплей";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_ru_RU: string = "Приобрести элемент приложения";
    // 非表示(4Car_TXT_0077)
    public APP_015_ru_RU: string = "Скрыть";
    // 表示(4Car_TXT_0066)
    public APP_016_ru_RU: string = "Отобразить";
    // 無料(4Car_TXT_0177)
    public APP_017_ru_RU: string = "Бесплатно";
    // 購入済み(4Car_TXT_0178)
    public APP_018_ru_RU: string = "Приобретено";
    // 販売停止(4Car_TXT_0179)
    public APP_019_ru_RU: string = "Остановить продажу";
    // まで(4Car_TXT_0180)
    public APP_020_ru_RU: string = "В";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_ru_RU: string = "Истекает в течение";
    public APP_021_2_ru_RU: string = "дней";
    // 有効期間(4Car_TXT_0142)
    public APP_022_ru_RU: string = "Окончание срока действия";
    // 期間選択(4Car_TXT_0159)
    public APP_023_ru_RU: string = "Выберите период";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_ru_RU: string = "Отмена";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_ru_RU: string = "Выберите приобретаемый период.<br /><br /><font color='red'>Примечание<br />Приведенная ниже цена и фактическое предложение могут отличаться.<br />Выполняйте покупку после подтверждения цены, которая указывается при нажатии кнопки [Купить].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_ru_RU: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_ru_RU: string = "Проверить автомобильную навигационную систему";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_ru_RU: string = "Проверьте навигационную систему для автомобилей, которая будет использовать данную функцию. Приобретенная функция будет доступна только на некоторых навигационных системах для автомобилей.";
    public APP_028_2_ru_RU: string = "После завершения покупки отобразится сообщение \"Служба зарегистрирована успешно\". Не завершайте работу приложения и не отключайте коммуникацию (при наличии) с In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_ru_RU: string = "Зарегистрированная автомобильная навигационная система";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_ru_RU: string = "Купить";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_ru_RU: string = "Изменить"; // 一時的にこちらを使用(04.23)
//    public APP_031_ru_RU: string = "Изменить автомобильную навигационную систему.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_ru_RU: string = "Подключенная автомобильная навигационная система (подключавшаяся перед этим)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_ru_RU: string = "Нажмите следующую кнопку, чтобы перейти к списку приложений.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_ru_RU: string = "Показать список приложений";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_ru_RU: string = "Извините, выполнить покупку не удалось. Обратитесь к администратору Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_ru_RU: string = "Возможно, произошел сбой при оформлении покупки, так как процесс занял слишком много времени. Немного подождите и проверьте, завершена ли покупка на экране приложения. Приносим извинения за неудобства.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_ru_RU: string = "вкл.";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_ru_RU: string = "выкл.";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_ru_RU: string = "Произошла ошибка.<br />Приносим извинения за неудобства.<br />Повторите попытку позже.";
    // カーナビ未登録時文言
    public APP_EX01_ru_RU: string = "Не зарегистрировано";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_ru_RU: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_ru_RU: string = "Условия использования";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_ru_RU: string = "Настройки";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_ru_RU: string = "НАСТРОЙКА";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_ru_RU: string = "НАЗАД";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_ru_RU: string = "Удалить данные приложения 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_ru_RU: string = "Настройки приложения 4Car удалены.<br />(Доступно в версии 1.0.5 или более поздней)<br />* Если канал связи с автомобильным устройством неустойчивый, попробуйте удалить настройки.<br />";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_ru_RU: string = "Удалить все данные?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_ru_RU: string = "Все данные удалены.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_ru_RU: string = "Эта функция доступна для версии 1.0.5 или более поздней.";

    //STARLINK エラー対応
    public APP_Error_ru_RU: string = "Сбой загрузки.";

    //STARLINK対応
    public APP_041_ru_RU: string = "Обновить";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_ru_RU: string = "НАЗАД";
    //ヘッダー部文言
    public CONFIG_002_ru_RU: string = "НАСТРОЙКА";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_ru_RU: string = "Данные приложения STARLINK будут удалены.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_ru_RU: string = "* Устранена нестабильная связь с In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_ru_RU: string = "Удалить все данные?";
    //confirmダイアログ用文言
    public CONFIG_006_ru_RU: string = "Все данные удалены.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_ru_RU: string = "Очистить данные приложения STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_ru_RU: string = "Выбор региона";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_ru_RU: string = "Выберите свой основной регион.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_ru_RU: string = "* Предоставляет лучшие возможности для приложений, оптимизированных в вашем регионе.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_ru_RU: string = "Условия использования";
    //利用規約更新日付文言
    public CONFIG_012_ru_RU: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_ru_RU: string = "日本";
    //アメリカ
    public LOCATION_002_ru_RU: string = "United States";
    //カナダ
    public LOCATION_003_ru_RU: string = "Canada";
    //メキシコ
    public LOCATION_004_ru_RU: string = "México";
    //イギリス
    public LOCATION_005_ru_RU: string = "United Kingdom";
    //フランス
    public LOCATION_006_ru_RU: string = "France";
    //ドイツ
    public LOCATION_007_ru_RU: string = "Deutschland";
    //オランダ
    public LOCATION_008_ru_RU: string = "Nederland";
    //イタリア
    public LOCATION_009_ru_RU: string = "Italia";
    //スペイン
    public LOCATION_010_ru_RU: string = "España";
    //スウェーデン
    public LOCATION_011_ru_RU: string = "Sverige";
    //ポーランド
    public LOCATION_012_ru_RU: string = "Polska";
    //ギリシャ
    public LOCATION_013_ru_RU: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_ru_RU: string = "Česko";
    //ロシア
    public LOCATION_015_ru_RU: string = "Россия";
    //ポルトガル
    public LOCATION_016_ru_RU: string = "Portugal";
    //フィンランド
    public LOCATION_017_ru_RU: string = "Suomi";
    //ハンガリー
    public LOCATION_018_ru_RU: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_ru_RU: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_ru_RU: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_ru_RU: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_ru_RU: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_ru_RU: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_ru_RU: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_ru_RU: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_ru_RU: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_ru_RU: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_ru_RU: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_ru_RU: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_ru_RU: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_ru_RU: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_ru_RU: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_ru_RU: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_ru_RU: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_ru_RU: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_ru_RU: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_ru_RU: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_ru_RU: string = "Перед использованием обновить до последней версии приложения SUBARU STARLINK.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_ru_RU: string = "Установлено новое In-Car-Device.<br/>Хотите перенести существующую лицензию на новое устройство?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_ru_RU: string = "Да";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_ru_RU: string = "Нет";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_ru_RU: string = "Напомните мне позже";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_ru_RU: string = "[Внимание!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_ru_RU: string = "Начиная с этого момента, ваша лицензия не может быть передана обратно на это устройство. Вы хотите продолжить?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_ru_RU: string = "Выберите устройство для передачи лицензии с";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_ru_RU: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_ru_RU: string = "Дата подключения: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_ru_RU: string = "мм/дд/гггг";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_ru_RU: string = "Отмена";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_ru_RU: string = "Передайте лицензию на новое устройство с устройства, которое было подключено %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_ru_RU: string = "Передача лицензии завершилась успешно.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_ru_RU: string = "Передача лицензии не удалась.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_ru_RU: string = "Подключение к вашему новому In-Car Device (ID: %2) выполнено %1.<br/>Хотите перенести существующую лицензию на новое устройство?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_ru_RU: string = "Начиная с этого момента, лицензия не может быть передана на это новое In-Car-Device (ID: %2), которое было подключено %1. Вы хотите продолжить?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_ru_RU: string = "Будет передано следующее.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_ru_RU: string = "Передача предыдущей лицензии завершилась успешно.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_ru_RU: string = "Выберите функцию навигации";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_ru_RU: string = "Некоторые In-Car-Devices имеют несколько функций навигации. Выберите навигацию для использования. <br/><br/>* Вы можете выбрать навигацию, используемую при установке пункта назначения, с помощью приложения In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_ru_RU: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_ru_RU: string = "Выберите функцию навигации";
	//月表示(1月)
	public SL_MONTH_TXT_01_ru_RU: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_ru_RU: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_ru_RU: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_ru_RU: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_ru_RU: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_ru_RU: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_ru_RU: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_ru_RU: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_ru_RU: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_ru_RU: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_ru_RU: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_ru_RU: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_ru_RU: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_ru_RU: string = "Размер: ";
    public TXT_YELP_0029_ru_RU: string = "Произошла ошибка.Говорите позже.";
	public SL_TXT_0155_ru_RU: string = "Версия ";
	public SL_TXT_0189_ru_RU: string = "Обновлено *";
	public SL_TXT_0191_ru_RU: string = "Дата окончания срока действия: ";
	public SL_TXT_0192_ru_RU: string = "Настройки обновления карты";
	public SL_TXT_0193_ru_RU: string = "Данные карты In-Car-Device могут временно сохраняться на вашем смартфоне с сервера распространения карты. При следующем подключении к In-Car-Device вы можете обновить карту.";
	public SL_TXT_0196_ru_RU: string = "Настр. Обновления";
	public SL_TXT_0197_ru_RU: string = "Проверить автоматическое обновление";
	public SL_TXT_0198_ru_RU: string = "Сотовая связь";
	public SL_TXT_0199_ru_RU: string = "Информ. об обновл.";
	public SL_TXT_0200_ru_RU: string = "Загрузить все";
	public SL_TXT_0201_ru_RU: string = "In-Car-Device не обновлено";
	public SL_TXT_0202_ru_RU: string = "Загрузка не завершена";
	public SL_TXT_0203_ru_RU: string = "In-Car-Device обновлено";
	public SL_TXT_0204_ru_RU: string = "Карта: ";
	public SL_TXT_0205_ru_RU: string = "Версия: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_ru_RUを利用　宣言のみ
	public SL_TXT_0206_ru_RU: string = "Размер: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_ru_RU: string = "Недостаточно свободного места на смартфоне.";
	public SL_TXT_0208_ru_RU: string = "Установите местоположение с помощью In-Car-Device. Нажмите кнопку OK для получения более подробной информации.";
	public SL_TXT_0209_ru_RU: string = "Срок вашей подписки MapCare истек.\nПерейдите на сайт www.subaru-maps.com,\nчтобы возобновить подписку.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_ru_RU: string = "Данные этой карты превышают 30MB. Повторите загрузку после подтверждения соединения Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_ru_RU: string = "Обновите карту, подключив In-Car-Device к смартфону. После обновления In-Car-Device данные карты будут автоматически удалены из смартфона.";
	public SL_TXT_0212_ru_RU: string = "Если вы установили сотовую связь на ВКЛ, то вы можете загрузить данные карты, когда Wi-Fi установлен в положение ВЫКЛ.";
	public SL_TXT_0213_ru_RU: string = "Данные карты In-Car-Device могут быть временно сохранены на смартфоне автоматически,  установив флажок автоматического обновления в положении ВКЛ.\n* Будет взиматься плата за данные.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_ru_RU: string = "Соединение с In-Car-Device было отключено. Повторите попытку после подтверждения подключения к In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_ru_RU: string = "Недостаточно свободного места в In-Car-Device. Повторите попытку после подтверждения настроек In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_ru_RU: string = "Произошла ошибка во время передачи данных. Повторите попытку позже.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_ru_RU: string = "Произошла ошибка при загрузке данных карты с сервера. Повторите попытку позже.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_ru_RU: string = "Недостаточно свободного места на смартфоне. Повторите попытку после удаления данных со своего смартфона.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_ru_RU: string = 'Используйте Wi-Fi для связи. Или установите "Сотовая связь" на "ВКЛ" на экране настроек обновлений и загрузите с использованием сотовых данных.<br/>* Данные карты, превышающие 30MB, не могут быть загружены с использованием сотовых данных.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_ru_RU: string = "Связь с сервером была отключена. Повторите попытку после подтверждения коммуникационной среды.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_ru_RUを利用　宣言のみ
	public SL_TXT_0221_ru_RU: string = "Размер: *MB";
    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // スウェーデン語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_sv_SV: string = "HEM";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_sv_SV: string = "";
    public HOME_006_2_sv_SV: string = " har löpt ut.<br />Du måste köpa funktionen för att kunna använda ";
    public HOME_006_3_sv_SV: string = "";
    public HOME_006_4_sv_SV: string = "";
    public HOME_006_5_sv_SV: string = ".<br />Tryck på knappen Visa köpskärm för mer information.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_sv_SV: string = "Visa köpskärm";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_sv_SV: string = "Senare";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_sv_SV: string = "Visa inte igen";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_sv_SV: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_sv_SV: string = "Nerladdning misslyckades. Klicka för att försöka igen.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_sv_SV: string = "Anslutningshistorik ej tillgänglig";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_sv_SV: string = "BAKÅT";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_sv_SV: string = "KONFIGURERA";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_sv_SV: string = "Utgångsdatum";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_sv_SV: string = "Applikationsbild";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_sv_SV: string = "Applikationsdisposition";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_sv_SV: string = "Applikationsinformation";
    // 販売元(4Car_TXT_0082)
    public APP_010_sv_SV: string = "Säljare";
    // バージョン(4Car_TXT_0084)
    public APP_011_sv_SV: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_sv_SV: string = "Inställningar";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_sv_SV: string = "Navigationsdisplay";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_sv_SV: string = "Köp appalternativ";
    // 非表示(4Car_TXT_0077)
    public APP_015_sv_SV: string = "Dölj";
    // 表示(4Car_TXT_0066)
    public APP_016_sv_SV: string = "Visa";
    // 無料(4Car_TXT_0177)
    public APP_017_sv_SV: string = "Gratis";
    // 購入済み(4Car_TXT_0178)
    public APP_018_sv_SV: string = "Köpt";
    // 販売停止(4Car_TXT_0179)
    public APP_019_sv_SV: string = "Stoppa försäljning";
    // まで(4Car_TXT_0180)
    public APP_020_sv_SV: string = "Till";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_sv_SV: string = "Löper ut om";
    public APP_021_2_sv_SV: string = "dagar";
    // 有効期間(4Car_TXT_0142)
    public APP_022_sv_SV: string = "Utgångsdatum";
    // 期間選択(4Car_TXT_0159)
    public APP_023_sv_SV: string = "Välj period";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_sv_SV: string = "Avbryt";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_sv_SV: string = "Välj inköpsperiod.<br /><br /><font color='red'>Obs!<br />Det pris som visas nedan och det faktiska överenskomna priset kan skilja sig.<br />Se till att slutföra köpet efter att ha bekräftat det överenskomna pris som visas när knappen [Köp] tryckts ned.</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_sv_SV: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_sv_SV: string = "Kontrollera bilnavigation";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_sv_SV: string = "Bekräfta vilket bilnavigationssystem som kommer att använda denna funktion. Den funktion som köpts kommer enbart att vara tillgänglig på det valda bilnavigationssystemet.";
    public APP_028_2_sv_SV: string = "Meddelandet \"Tjänsten har registrerats\" kommer att visas när köpet är genomfört. Stäng inte ner programskärmen och bryt inte kommunikationen (när kommunikation pågår) med din In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_sv_SV: string = "Registrerad bilnavigation";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_sv_SV: string = "Köp";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_sv_SV: string = "Byt till annan bilnavigation.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_sv_SV: string = "Ansluten bilnavigation (senaste tid för anslutning)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_sv_SV: string = "Tryck på följande knapp för att gå till skärmen med applikationslistan.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_sv_SV: string = "Visa applikationslistan";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_sv_SV: string = "Tyvärr gick ditt köp inte igenom. Kontakta din Clarion-administratör.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_sv_SV: string = "Eftersom förfarandet tagit ovanligt lång tid kan det hända att köpet inte genomförts på rätt sätt. Vänta en stund och kontrollera om köpet genomförts på appskärmen. Vi ber om ursäkt för det besvär vi orsakat.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_sv_SV: string = "på";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_sv_SV: string = "av";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_sv_SV: string = "Ett fel har inträffat.<br />Vi beklagar det inträffade.<br />Försök igen senare.";
    // カーナビ未登録時文言
    public APP_EX01_sv_SV: string = "Ej registrerad";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_sv_SV: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_sv_SV: string = "Användningsvillkor";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_sv_SV: string = "Inställningar";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_sv_SV: string = "KONFIGURERA";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_sv_SV: string = "BAKÅT";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_sv_SV: string = "Ta bort 4Car-applikationsdata.";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_sv_SV: string = "Inställningsdata i 4Car-applikationen har tagits bort.<br />(Tillgänglig med version 1.0.5 eller senare)<br />* När länken till In-Car-Device är instabil kan du prova med att ta bort inställningsdata.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_sv_SV: string = "Ta bort alla data?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_sv_SV: string = "Alla data har tagits bort.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_sv_SV: string = "Den här funktionen är tillgänglig med version 1.0.5 eller senare.";

    //STARLINK エラー対応
    public APP_Error_sv_SV: string = "Nedladdning misslyckades.";

    //STARLINK対応
    public APP_041_sv_SV: string = "Uppdatera";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_sv_SV: string = "BAKÅT";
    //ヘッダー部文言
    public CONFIG_002_sv_SV: string = "KONFIGURERA";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_sv_SV: string = "Applikationsdata för STARLINK kommer att raderas. ";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_sv_SV: string = "* Löser instabil anslutning till In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_sv_SV: string = "Ta bort alla data?";
    //confirmダイアログ用文言
    public CONFIG_006_sv_SV: string = "Alla data har tagits bort.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_sv_SV: string = "Rensa applikationsdata för STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_sv_SV: string = "Val av region";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_sv_SV: string = "Välj din primära region.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_sv_SV: string = "* Tillhandahåller bästa upplevelsen för appar som optimerats i din region.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_sv_SV: string = "Användningsvillkor";
    //利用規約更新日付文言
    public CONFIG_012_sv_SV: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_sv_SV: string = "日本";
    //アメリカ
    public LOCATION_002_sv_SV: string = "United States";
    //カナダ
    public LOCATION_003_sv_SV: string = "Canada";
    //メキシコ
    public LOCATION_004_sv_SV: string = "México";
    //イギリス
    public LOCATION_005_sv_SV: string = "United Kingdom";
    //フランス
    public LOCATION_006_sv_SV: string = "France";
    //ドイツ
    public LOCATION_007_sv_SV: string = "Deutschland";
    //オランダ
    public LOCATION_008_sv_SV: string = "Nederland";
    //イタリア
    public LOCATION_009_sv_SV: string = "Italia";
    //スペイン
    public LOCATION_010_sv_SV: string = "España";
    //スウェーデン
    public LOCATION_011_sv_SV: string = "Sverige";
    //ポーランド
    public LOCATION_012_sv_SV: string = "Polska";
    //ギリシャ
    public LOCATION_013_sv_SV: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_sv_SV: string = "Česko";
    //ロシア
    public LOCATION_015_sv_SV: string = "Россия";
    //ポルトガル
    public LOCATION_016_sv_SV: string = "Portugal";
    //フィンランド
    public LOCATION_017_sv_SV: string = "Suomi";
    //ハンガリー
    public LOCATION_018_sv_SV: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_sv_SV: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_sv_SV: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_sv_SV: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_sv_SV: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_sv_SV: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_sv_SV: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_sv_SV: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_sv_SV: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_sv_SV: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_sv_SV: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_sv_SV: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_sv_SV: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_sv_SV: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_sv_SV: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_sv_SV: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_sv_SV: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_sv_SV: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_sv_SV: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_sv_SV: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_sv_SV: string = "Uppdatera till den senaste versionen av SUBARU STARLINK -appen före användning.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_sv_SV: string = "En ny In-Car-Device har installerats. <br/>Vill du överföra den befintliga licensen till den nya enheten?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_sv_SV: string = "Ja";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_sv_SV: string = "Nej";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_sv_SV: string = "Påminn mig senare";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_sv_SV: string = "[Fara!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_sv_SV: string = "Från och med detta skede kan licensen inte föras tillbaka till den här enheten. Vill du fortsätta?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_sv_SV: string = "Välj enhet att överföra licensen från";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_sv_SV: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_sv_SV: string = "Ansluten den: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_sv_SV: string = "mm/dd/åååå";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_sv_SV: string = "Avbryt";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_sv_SV: string = "Överför licensen till den nya enheten från den enhet som anslöts den %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_sv_SV: string = "Licensöverföringen utförd.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_sv_SV: string = "Licensöverföringen misslyckades.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_sv_SV: string = "Anslutningen till din nya In-Car Device (ID: %2) utfördes den %1.<br/>Vill du överföra den befintliga licensen till den nya enheten?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_sv_SV: string = "Från och med detta skede kan licensen inte överföras till denna nya In-Car-Device (ID: %2) som anslutits den %1. Vill du fortsätta?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_sv_SV: string = "Följande kommer att överföras.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_sv_SV: string = "Föregående licensöverföring lyckades.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_sv_SV: string = "Välj navigeringsfunktion";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_sv_SV: string = "Vissa In-Car-Devices har flera navigeringsfunktioner. Välj navigering att använda.<br/><br/>*Du kan välja den navigering som används när en destination ställs in med applikationen In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_sv_SV: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_sv_SV: string = "Välj navigeringsfunktion";
	//月表示(1月)
	public SL_MONTH_TXT_01_sv_SV: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_sv_SV: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_sv_SV: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_sv_SV: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_sv_SV: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_sv_SV: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_sv_SV: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_sv_SV: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_sv_SV: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_sv_SV: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_sv_SV: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_sv_SV: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_sv_SV: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_sv_SV: string = "Storlek: ";
	public TXT_YELP_0029_sv_SV: string = "Ett fel inträffade.Tala om en stund.";
	public SL_TXT_0155_sv_SV: string = "Ver. ";
	public SL_TXT_0189_sv_SV: string = "Uppdaterad *";
	public SL_TXT_0191_sv_SV: string = "Förfallodatum: ";
	public SL_TXT_0192_sv_SV: string = "Inställningar för kartuppdatering";
	public SL_TXT_0193_sv_SV: string = "Kartdata för In-Car-Device kan sparas tillfälligt till din smarttelefon från kartdistributionsservern. Nästa gång du ansluter till In-Car-Device kan du uppdatera kartan.";
	public SL_TXT_0196_sv_SV: string = "Uppdateringsinstäl.";
	public SL_TXT_0197_sv_SV: string = "Kontrollera automatiskt uppdatering";
	public SL_TXT_0198_sv_SV: string = "Mobildata";
	public SL_TXT_0199_sv_SV: string = "Uppdateringsinfo.";
	public SL_TXT_0200_sv_SV: string = "Hämta alla";
	public SL_TXT_0201_sv_SV: string = "In-Car-Device inte uppdaterad";
	public SL_TXT_0202_sv_SV: string = "Hämtning inte klar";
	public SL_TXT_0203_sv_SV: string = "In-Car-Device uppdaterad";
	public SL_TXT_0204_sv_SV: string = "Karta: ";
	public SL_TXT_0205_sv_SV: string = "Version: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_sv_SVを利用　宣言のみ
	public SL_TXT_0206_sv_SV: string = "Storlek: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_sv_SV: string = "Det finns inte tillräckligt med utrymme på smarttelefonen.";
	public SL_TXT_0208_sv_SV: string = "Ställ in plats med In-Car-Device. Tryck på knappen OK för detaljer.";
	public SL_TXT_0209_sv_SV: string = "Din MapCare-prenumeration har gått ut. Besök www.subaru-maps.com för att uppdatera prenumerationen.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_sv_SV: string = "Den här kartans data överskrider 30 MB. Hämta igen efter att Wi-Fi-anslutning bekräftats.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_sv_SV: string = "Uppdatera karta genom att ansluta In-Car-Device till smarttelefonen. Efter uppdatering av In-Car-Device raderas kartdata automatiskt från smarttelefonen.";
	public SL_TXT_0212_sv_SV: string = "Om du ställer in Mobildata till PÅ kan du hämta kartdata när Wi-Fi är inställd till AV.";
	public SL_TXT_0213_sv_SV: string = "Kartdata för In-Car-Device kan tillfälligt sparas automatiskt till din smarttelefon genom att ställa in kontrollera automatiskt uppdatering till PÅ.\n*Dataavgifter tillämpas.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_sv_SV: string = "Anslutningen till In-Car-Device kopplades ifrån. Försök igen efter att anslutning till In-Car-Device har bekräftats.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_sv_SV: string = "Otillräcklig tillgängligt lagringsutrymme i In-Car-Device. Försök igen efter att inställningarna för In-Car-Device bekräftats.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_sv_SV: string = "Fel inträffade vid dataöverföring. Försök igen senare.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_sv_SV: string = "Fel inträffade när kartdata hämtades från servern. Försök igen senare.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_sv_SV: string = "Otillräckligt tillgängligt lagringsutrymme på smarttelefonen. Försök igen efter radering av data från din smarttelefon.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_sv_SV: string = 'Använd Wi-Fi för kommunikation. Eller ställ in "Mobildata" till "PÅ" på skärmen för inställningar för uppdateringar och hämta med mobildata.<br/>*Kartdata som överskrider 30 MB kan inte hämtas med mobildata.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_sv_SV: string = "Kommunikationen med servern kopplades ifrån. Försök igen efter att kommunikationsmiljön bekräftats.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_sv_SVを利用　宣言のみ
	public SL_TXT_0221_sv_SV: string = "Storlek: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // オランダ語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_nl_NL: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_nl_NL: string = "";
    public HOME_006_2_nl_NL: string = " is verlopen.<br />U moet de functie kopen om ";
    public HOME_006_3_nl_NL: string = "";
    public HOME_006_4_nl_NL: string = "";
    public HOME_006_5_nl_NL: string = "verder te kunnen gebruiken.<br />Raak de knop Aankoopscherm weergeven aan voor meer informatie.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_nl_NL: string = "Aankoopscherm weergeven";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_nl_NL: string = "Later";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_nl_NL: string = "Niet nogmaals weergeven";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_nl_NL: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_nl_NL: string = "Download mislukt. Klik en probeer het opnieuw.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_nl_NL: string = "Verbindingshistoriek niet beschikbaar";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_nl_NL: string = "TERUG";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_nl_NL: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_nl_NL: string = "Verloopt op";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_nl_NL: string = "Applicatiebeeld";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_nl_NL: string = "Applicatieoverzicht";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_nl_NL: string = "Applicatiegegevens";
    // 販売元(4Car_TXT_0082)
    public APP_010_nl_NL: string = "Verkoper";
    // バージョン(4Car_TXT_0084)
    public APP_011_nl_NL: string = "Versie";
    // 設定(4Car_TXT_0085)
    public APP_012_nl_NL: string = "Instellingen";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_nl_NL: string = "Navigatiescherm";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_nl_NL: string = "App-item kopen";
    // 非表示(4Car_TXT_0077)
    public APP_015_nl_NL: string = "Verbergen";
    // 表示(4Car_TXT_0066)
    public APP_016_nl_NL: string = "Weergeven";
    // 無料(4Car_TXT_0177)
    public APP_017_nl_NL: string = "Gratis";
    // 購入済み(4Car_TXT_0178)
    public APP_018_nl_NL: string = "Gekocht";
    // 販売停止(4Car_TXT_0179)
    public APP_019_nl_NL: string = "Verkoop stopzetten";
    // まで(4Car_TXT_0180)
    public APP_020_nl_NL: string = "Tot";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_nl_NL: string = "Verloopt binnen";
    public APP_021_2_nl_NL: string = "dagen";
    // 有効期間(4Car_TXT_0142)
    public APP_022_nl_NL: string = "Verloopt op";
    // 期間選択(4Car_TXT_0159)
    public APP_023_nl_NL: string = "Periode selecteren";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_nl_NL: string = "Annuleren";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_nl_NL: string = "Kies de aankoopperiode.<br /><br /><font color='red'>Opmerking<br />De hierna getoonde prijs en de effectieve afrekeningsprijs kunnen verschillen.<br />Voltooi de aankoop nadat u de afrekeningsprijs heeft bevestigd die wordt aangegeven wanneer op de knop [Kopen] wordt gedrukt.</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_nl_NL: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_nl_NL: string = "Voertuignavigatie controleren";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_nl_NL: string = "Controleer het autonavigatiesysteem dat deze functie zal gebruiken. De aangekochte functie is alleen beschikbaar voor het geselecteerde autonavigatiesysteem.";
    public APP_028_2_nl_NL: string = "Het bericht \"De dienst werd met succes geregistreerd\" verschijnt wanneer de aankoop voltooid is. Gelieve het applicatiescherm niet te sluiten of de communicatie (wanneer er communicatie is) met het In-Car-Device te beëindigen.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_nl_NL: string = "Geregistreerde voertuignavigatie";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_nl_NL: string = "Kopen";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_nl_NL: string = "Andere voertuignavigatie kiezen";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_nl_NL: string = "Verbonden voertuignavigatie (laatst verbonden)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_nl_NL: string = "Druk op de onderstaande knop om naar het scherm met de applicatielijst te gaan.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_nl_NL: string = "De applicatielijst weergeven";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_nl_NL: string = "De aankoop is mislukt. Onze excuses hiervoor. Neem contact op met uw Clarion-beheerder.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_nl_NL: string = "Gezien de verwerking enorm veel tijd in beslag neemt, is het mogelijk dat de aankoop niet correct is voltooid. Wacht enkele ogenblikken en bevestig dan of de aankoop op het applicatiescherm is voltooid. Onze excuses voor het ongemak.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_nl_NL: string = "aan";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_nl_NL: string = "uit";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_nl_NL: string = "Er is een fout opgetreden. <br />Onze excuses voor het ongemak. <br />Probeer het later opnieuw.";
    // カーナビ未登録時文言
    public APP_EX01_nl_NL: string = "Niet geregistreerd";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_nl_NL: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_nl_NL: string = "Gebruiksvoorwaarden";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_nl_NL: string = "Instellingen";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_nl_NL: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_nl_NL: string = "TERUG";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_nl_NL: string = "De 4Car-applicatiegegevens wissen";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_nl_NL: string = "De instelgegevens in de 4Car-applicatie zijn gewist. <br />(Beschikbaar bij versie 1.0.5 of hoger)<br />* Probeer de instelgegevens te wissen in geval van een onstabiele verbinding met het apparaat in de wagen.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_nl_NL: string = "Alle gegevens wissen?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_nl_NL: string = "Alle gegevens zijn gewist.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_nl_NL: string = "Deze functie is beschikbaar bij versie 1.0.5 of hoger.";

    //STARLINK エラー対応
    public APP_Error_nl_NL: string = "Downloaden mislukt.";

    ////STARLINK対応
    public APP_041_nl_NL: string = "Update";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_nl_NL: string = "TERUG";
    //ヘッダー部文言
    public CONFIG_002_nl_NL: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_nl_NL: string = "De STARLINK-applicatiegegevens worden gewist. ";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_nl_NL: string = "* Risolve la connessione instabile con In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_nl_NL: string = "Alle gegevens wissen?";
    //confirmダイアログ用文言
    public CONFIG_006_nl_NL: string = "Alle gegevens zijn gewist.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_nl_NL: string = "STARLINK-applicatiegegevens wissen";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_nl_NL: string = "Regioselectie";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_nl_NL: string = "Selecteer uw primaire regio.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_nl_NL: string = "* Dit biedt de beste ervaring voor applicaties die geoptimaliseerd zijn in uw regio.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_nl_NL: string = "Gebruiksvoorwaarden";
    //利用規約更新日付文言
    public CONFIG_012_nl_NL: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_nl_NL: string = "日本";
    //アメリカ
    public LOCATION_002_nl_NL: string = "United States";
    //カナダ
    public LOCATION_003_nl_NL: string = "Canada";
    //メキシコ
    public LOCATION_004_nl_NL: string = "México";
    //イギリス
    public LOCATION_005_nl_NL: string = "United Kingdom";
    //フランス
    public LOCATION_006_nl_NL: string = "France";
    //ドイツ
    public LOCATION_007_nl_NL: string = "Deutschland";
    //オランダ
    public LOCATION_008_nl_NL: string = "Nederland";
    //イタリア
    public LOCATION_009_nl_NL: string = "Italia";
    //スペイン
    public LOCATION_010_nl_NL: string = "España";
    //スウェーデン
    public LOCATION_011_nl_NL: string = "Sverige";
    //ポーランド
    public LOCATION_012_nl_NL: string = "Polska";
    //ギリシャ
    public LOCATION_013_nl_NL: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_nl_NL: string = "Česko";
    //ロシア
    public LOCATION_015_nl_NL: string = "Россия";
    //ポルトガル
    public LOCATION_016_nl_NL: string = "Portugal";
    //フィンランド
    public LOCATION_017_nl_NL: string = "Suomi";
    //ハンガリー
    public LOCATION_018_nl_NL: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_nl_NL: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_nl_NL: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_nl_NL: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_nl_NL: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_nl_NL: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_nl_NL: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_nl_NL: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_nl_NL: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_nl_NL: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_nl_NL: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_nl_NL: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_nl_NL: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_nl_NL: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_nl_NL: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_nl_NL: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_nl_NL: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_nl_NL: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_nl_NL: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_nl_NL: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_nl_NL: string = "Update naar de nieuwste versie van de applicatie SUBARU STARLINK vóór gebruik.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_nl_NL: string = "Er werd een nieuw In-Car-Device geïnstalleerd.<br/>Wenst u de bestaande licentie naar het nieuwe over te dragen?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_nl_NL: string = "Ja";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_nl_NL: string = "Nee";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_nl_NL: string = "Help mij herinneren";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_nl_NL: string = "[Let op!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_nl_NL: string = "Hierna kan uw licentie niet naar dit apparaat terug worden overgedragen. Wilt u doorgaan?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_nl_NL: string = "Selecteer het apparaat van waaraf de licentie wordt overgedragen";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_nl_NL: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_nl_NL: string = "Verbindingsdatum: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_nl_NL: string = "mm/dd/jjjj";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_nl_NL: string = "Annuleren";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_nl_NL: string = "De licentie naar het nieuwe apparaat overdragen vanaf het apparaat dat op %1 verbonden werd.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_nl_NL: string = "De licentieoverdracht is geslaagd.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_nl_NL: string = "De licentieoverdracht is mislukt.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_nl_NL: string = "De verbinding met uw nieuwe In-Car-Device (ID: %2) werd op %1 tot stand gebracht.<br/>Wenst u de bestaande licentie naar het nieuwe over te dragen?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_nl_NL: string = "Hierna kan de licentie niet worden overgedragen naar dit nieuwe In-Car-Device (ID: %2) dat op %1 werd verbonden. Wilt u doorgaan?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_nl_NL: string = "Het volgende wordt overgedragen.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_nl_NL: string = "De vorige licentieoverdracht is geslaagd.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_nl_NL: string = "Navigatiefunctie selecteren";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_nl_NL: string = "Sommige In-Car-Devices beschikken over meerdere navigatiefuncties. Selecteer de navigatie die u wilt gebruiken.<br/><br/>*U kunt de navigatie selecteren die gebruikt wordt wanneer u een bestemming met behulp van de applicatie van de In-Car-Device instelt.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_nl_NL: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_nl_NL: string = "Navigatiefunctie selecteren";
	//月表示(1月)
	public SL_MONTH_TXT_01_nl_NL: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_nl_NL: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_nl_NL: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_nl_NL: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_nl_NL: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_nl_NL: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_nl_NL: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_nl_NL: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_nl_NL: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_nl_NL: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_nl_NL: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_nl_NL: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_nl_NL: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_nl_NL: string = "Grootte: ";
	public TXT_YELP_0029_nl_NL: string = "Fout opgetreden.Probeer het later opnieuw.";
	public SL_TXT_0155_nl_NL: string = "Ver. ";
	public SL_TXT_0189_nl_NL: string = "Bijgewerkt op *";
	public SL_TXT_0191_nl_NL: string = "Verloopdatum: ";
	public SL_TXT_0192_nl_NL: string = "Kaartupdate-instellingen";
	public SL_TXT_0193_nl_NL: string = "De kaartgegevens voor de In-Car-Device kunnen tijdelijk op uw smartphone worden opgeslagen vanaf de kaartdistributieserver. De volgende keer dat u met de In-Car-Device een verbinding tot stand brengt, kunt u de kaart bijwerken.";
	public SL_TXT_0196_nl_NL: string = "Update-instellingen";
	public SL_TXT_0197_nl_NL: string = "Controle van automatische update";
	public SL_TXT_0198_nl_NL: string = "Mobiel";
	public SL_TXT_0199_nl_NL: string = "Update-informatie";
	public SL_TXT_0200_nl_NL: string = "Alles downloaden";
	public SL_TXT_0201_nl_NL: string = "In-Car-Device niet bijgewerkt";
	public SL_TXT_0202_nl_NL: string = "Download niet voltooid";
	public SL_TXT_0203_nl_NL: string = "In-Car-Device is up-to-date";
	public SL_TXT_0204_nl_NL: string = "Kaart: ";
	public SL_TXT_0205_nl_NL: string = "Versie: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_nl_NLを利用　宣言のみ
	public SL_TXT_0206_nl_NL: string = "Grootte: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_nl_NL: string = "Er is onvoldoende ruimte beschikbaar op de smartphone.";
	public SL_TXT_0208_nl_NL: string = "Stel de locatie in met behulp van de In-Car-Device. Druk op de OK-knop voor details.";
	public SL_TXT_0209_nl_NL: string = "Uw MapCare-abonnement is verlopen.\nGa naar www.subaru-maps.com om\nuw abonnement bij te werken.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_nl_NL: string = "De gegevens van deze kaart overschrijden 30 MB. Download opnieuw na bevestiging van de Wi-Fi-verbinding.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_nl_NL: string = "Werk de kaart bij door de In-Car-Device met de smartphone te verbinden. Na bijwerking van de In-Car-Device, worden de kaartgegevens automatisch van de smartphone gewist.";
	public SL_TXT_0212_nl_NL: string = "Als u Mobiel op AAN instelt, kunt u kaartgegevens downloaden wanneer Wi-Fi op UIT ingesteld is.";
	public SL_TXT_0213_nl_NL: string = "De kaartgegevens voor de In-Car-Device kunnen op automatische wijze tijdelijk op uw smartphone worden opgeslagen door de controle van automatische update op AAN in te stellen.\n*Er worden kosten in rekening gebracht.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_nl_NL: string = "De verbinding met de In-Car-Device is verbroken. Probeer het opnieuw na bevestiging van de verbinding met de In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_nl_NL: string = "Onvoldoende In-Car-Device-opslag beschikbaar. Probeer het opnieuw na bevestiging van de In-Car-Device-instellingen.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_nl_NL: string = "Er is een fout opgetreden tijdens de gegevensoverdracht. Probeer het later opnieuw.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_nl_NL: string = "Er is een fout opgetreden tijdens het downloaden van de kaartgegevens vanaf de server. Probeer het later opnieuw.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_nl_NL: string = "Onvoldoende smartphone-opslag beschikbaar. Probeer het opnieuw nadat u gegevens van uw smartphone heeft gewist.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_nl_NL: string = 'Gebruik Wi-Fi voor communicatie. Of stel "Mobiel" op "AAN" in op het scherm van de update-instellingen en download met behulp van de mobiele dataverbinding.<br/>*Kaartgegevens die 30 MB overschrijden kunnen niet met behulp van de mobiele dataverbinding worden gedownload.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_nl_NL: string = "De communicatie met de server is verbroken. Probeer het opnieuw na bevestiging van de communicatieomgeving.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_nl_NLを利用　宣言のみ
	public SL_TXT_0221_nl_NL: string = "Grootte: *MB";


    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // ポーランド語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_pl_PL: string = "DOM";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_pl_PL: string = "Funkcja";
    public HOME_006_2_pl_PL: string = " wygasła.<br />Aby korzystać z funkcji";
    public HOME_006_3_pl_PL: string = "";
    public HOME_006_4_pl_PL: string = "";
    public HOME_006_5_pl_PL: string = ", musisz ją wykupić.<br />Aby dowiedzieć się więcej, dotknij przycisku „Wyświetl ekran zakupu”.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_pl_PL: string = "Wyświetl ekran zakupu";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_pl_PL: string = "Później";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_pl_PL: string = "Nie pokazuj ponownie";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_pl_PL: string = "APLIKACJA";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_pl_PL: string = "Pobieranie nieudane. Kliknij, aby spróbować ponownie.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_pl_PL: string = "Historia łączenia niedostępna";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_pl_PL: string = "WSTECZ";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_pl_PL: string = "KONFIGURACJA";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_pl_PL: string = "Wygasa";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_pl_PL: string = "Obraz aplikacji";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_pl_PL: string = "Zarys aplikacji";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_pl_PL: string = "Informacje o aplikacji";
    // 販売元(4Car_TXT_0082)
    public APP_010_pl_PL: string = "Sprzedający";
    // バージョン(4Car_TXT_0084)
    public APP_011_pl_PL: string = "Wersja";
    // 設定(4Car_TXT_0085)
    public APP_012_pl_PL: string = "Ustawienia";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_pl_PL: string = "Ekran nawigacji";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_pl_PL: string = "Kup element aplikacji";
    // 非表示(4Car_TXT_0077)
    public APP_015_pl_PL: string = "Ukryj";
    // 表示(4Car_TXT_0066)
    public APP_016_pl_PL: string = "Wyświetl";
    // 無料(4Car_TXT_0177)
    public APP_017_pl_PL: string = "Bezpłatne";
    // 購入済み(4Car_TXT_0178)
    public APP_018_pl_PL: string = "Wykupione";
    // 販売停止(4Car_TXT_0179)
    public APP_019_pl_PL: string = "Przerwij sprzedaż";
    // まで(4Car_TXT_0180)
    public APP_020_pl_PL: string = "Do";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_pl_PL: string = "Wygasa za";
    public APP_021_2_pl_PL: string = "dni";
    // 有効期間(4Car_TXT_0142)
    public APP_022_pl_PL: string = "Wygasa";
    // 期間選択(4Car_TXT_0159)
    public APP_023_pl_PL: string = "Wybierz okres";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_pl_PL: string = "Anuluj";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_pl_PL: string = "Wybierz okres, który chcesz wykupić.<br /><br /><font color='red'>Uwaga<br />Poniższa cena i rzeczywista cena ostateczna mogą się różnić.<br />Zakup należy dokończyć po potwierdzeniu ceny ostatecznej wyświetlanej po naciśnięciu przycisku [Kup].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_pl_PL: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_pl_PL: string = "Sprawdź nawigację samochodową";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_pl_PL: string = "Sprawdź system nawigacji samochodowej, który będzie korzystać z tej funkcji. Zakupiona funkcja będzie dostępna wyłącznie w wybranym systemie nawigacji samochodowej.";
    public APP_028_2_pl_PL: string = "Komunikat \"Usługa została pomyślnie zarejestrowana\" pojawi się po zakończeniu zakupu. Nie należy wyłączać ekranu aplikacji lub odłączać komunikacji (w przypadku połączenia) z urządzeniem In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_pl_PL: string = "Zarejestrowana nawigacja samochodowa";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_pl_PL: string = "Kup";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_pl_PL: string = "Zmień na inną nawigację samochodową.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_pl_PL: string = "Podłączona nawigacja samochodowa (z ostatniego połączenia)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_pl_PL: string = "Naciśnij następujący przycisk, aby przejść do ekranu z listą aplikacji.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_pl_PL: string = "Wyświetl listę aplikacji ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_pl_PL: string = "Z przykrością informujemy, że zakup się nie powiódł. Skontaktuj się z administratorem usług Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_pl_PL: string = "Zakup mógł nie zostać prawidłowo ukończony z powodu nietypowego czasu trwania procesu. Odczekaj chwilę i sprawdź, czy zakup został ukończony na ekranie aplikacji. Przepraszamy za wszelkie niedogodności.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_pl_PL: string = "wł.";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_pl_PL: string = "wył.";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_pl_PL: string = "Wystąpił błąd.<br />Przepraszamy za niedogodności.<br />Spróbuj ponownie później.";
    // カーナビ未登録時文言
    public APP_EX01_pl_PL: string = "Nie zarejestrowano";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_pl_PL: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_pl_PL: string = "Warunki korzystania";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_pl_PL: string = "Ustawienia";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_pl_PL: string = "KONFIGURACJA";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_pl_PL: string = "WSTECZ";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_pl_PL: string = "Usuń dane aplikacji 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_pl_PL: string = "Dane ustawień w aplikacji 4Car zostały usunięte.<br />(Dostępne w wersji 1.0.5 lub nowszej)<br />* Gdy łącze z urządzeniem w samochodzie jest niestabilne, spróbuj usunąć dane ustawień.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_pl_PL: string = "Usunąć wszystkie dane?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_pl_PL: string = "Wszystkie dane zostały usunięte.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_pl_PL: string = "Ta funkcja jest dostępna w wersji 1.0.5 lub nowszej.";

    //STARLINK エラー対応
    public APP_Error_pl_PL: string = "Pobieranie nie powiodło się.";

    ////STARLINK対応
    public APP_041_pl_PL: string = "Aktualizuj";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_pl_PL: string = "WSTECZ";
    //ヘッダー部文言
    public CONFIG_002_pl_PL: string = "KONFIGURACJA";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_pl_PL: string = "Dane ustawień w aplikacji STARLINK zostały usunięte.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_pl_PL: string = "* Gdy łącze z urządzeniem w samochodzie jest niestabilne, spróbuj usunąć dane ustawień.";
    //confirmダイアログ用文言
    public CONFIG_005_pl_PL: string = "Usunąć wszystkie dane?";
    //confirmダイアログ用文言
    public CONFIG_006_pl_PL: string = "Wszystkie dane zostały usunięte.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_pl_PL: string = "Usuń dane aplikacji STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_pl_PL: string = "Wybór regionu";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_pl_PL: string = "Wybierz główny region, który będzie obsługiwany";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_pl_PL: string = "* Ten wybór ułatwi dostarczenie aplikacji zoptymalizowanej do wybranego regionu.";
    //利用規約更新日付文言
    public CONFIG_012_pl_PL: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_pl_PL: string = "日本";
    //アメリカ
    public LOCATION_002_pl_PL: string = "United States";
    //カナダ
    public LOCATION_003_pl_PL: string = "Canada";
    //メキシコ
    public LOCATION_004_pl_PL: string = "México";
    //イギリス
    public LOCATION_005_pl_PL: string = "United Kingdom";
    //フランス
    public LOCATION_006_pl_PL: string = "France";
    //ドイツ
    public LOCATION_007_pl_PL: string = "Deutschland";
    //オランダ
    public LOCATION_008_pl_PL: string = "Nederland";
    //イタリア
    public LOCATION_009_pl_PL: string = "Italia";
    //スペイン
    public LOCATION_010_pl_PL: string = "España";
    //スウェーデン
    public LOCATION_011_pl_PL: string = "Sverige";
    //ポーランド
    public LOCATION_012_pl_PL: string = "Polska";
    //ギリシャ
    public LOCATION_013_pl_PL: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_pl_PL: string = "Česko";
    //ロシア
    public LOCATION_015_pl_PL: string = "Россия";
    //ポルトガル
    public LOCATION_016_pl_PL: string = "Portugal";
    //フィンランド
    public LOCATION_017_pl_PL: string = "Suomi";
    //ハンガリー
    public LOCATION_018_pl_PL: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_pl_PL: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_pl_PL: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_pl_PL: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_pl_PL: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_pl_PL: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_pl_PL: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_pl_PL: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_pl_PL: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_pl_PL: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_pl_PL: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_pl_PL: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_pl_PL: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_pl_PL: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_pl_PL: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_pl_PL: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_pl_PL: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_pl_PL: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_pl_PL: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_pl_PL: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_pl_PL: string = "Przed rozpoczęciem używania zaktualizuj aplikację SUBARU STARLINK do najnowszej wersji.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_pl_PL: string = "Nowe urządzenie In-Car-Device zostało zainstalowane. <br/>Czy przenieść istniejącą licencję do nowego urządzenia?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_pl_PL: string = "Tak.";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_pl_PL: string = "Nie";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_pl_PL: string = "Przypomnij później";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_pl_PL: string = "[Ostrzeżenie!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_pl_PL: string = "Od teraz twojej licencji nie będzie można przenieść z powrotem do tego urządzenia. Czy kontynuować?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_pl_PL: string = "Wybierz urządzenie, z którego zostanie przeniesiona licencja";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_pl_PL: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_pl_PL: string = "Data połączenia: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_pl_PL: string = "mm/dd/rrrr";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_pl_PL: string = "Anuluj";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_pl_PL: string = "Przenieś licencję do nowego urządzenia podłączonego dnia %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_pl_PL: string = "Pomyślnie przeniesiono licencję.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_pl_PL: string = "Błąd przenoszenia licencji.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_pl_PL: string = "Połączenie z nowym urządzeniem In-Car Device (ID: %2) zostało wykonane %1.<br/>Czy przenieść istniejącą licencję do nowego urządzenia?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_pl_PL: string = "Od teraz licencji nie można przenieść do tego nowego urządzenia In-Car-Device (ID: %2) podłączonego %1. Czy kontynuować?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_pl_PL: string = "Następująca licencja zostanie przeniesiona.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_pl_PL: string = "Przesyłanie poprzedniej licencji zakończyło się pomyślnie.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_pl_PL: string = "Navigation";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_pl_PL: string = "There are several navigation apps that can be used in the in-car-device.<br />Please select a navigation app in the in-car-device.<br /><br />You can select a navigation of when ran app setting destination at in-car-device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_pl_PL: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_pl_PL: string = "Navigation";
	//月表示(1月)
	public SL_MONTH_TXT_01_pl_PL: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_pl_PL: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_pl_PL: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_pl_PL: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_pl_PL: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_pl_PL: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_pl_PL: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_pl_PL: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_pl_PL: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_pl_PL: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_pl_PL: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_pl_PL: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_pl_PL: string = "d.MM.yyyy";

    // SL_TXT_0155
    public SL_TXT_0155_pl_PL: string = "Ver. ";
    // SL_TXT_0189
    public SL_TXT_0189_pl_PL: string = "Updated *";
    ////////////////////////////////////////////////////////////////
    // ギリシャ語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_el_EL: string = "ΑΡΧΙΚΗ";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_el_EL: string = "Το ";
    public HOME_006_2_el_EL: string = " έληξε.<br />Πρέπει να αγοράσετε τη λειτουργία για να χρησιμοποιήσετε το ";
    public HOME_006_3_el_EL: string = "";
    public HOME_006_4_el_EL: string = "";
    public HOME_006_5_el_EL: string = ".<br />Για λεπτομέρειες, πατήστε το κουμπί Εμφάνιση οθόνης αγοράς.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_el_EL: string = "Εμφάνιση οθόνης αγοράς";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_el_EL: string = "Αργότερα";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_el_EL: string = "Να μην εμφανιστεί ξανά";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_el_EL: string = "ΕΦΑΡΜΟΓΗ";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_el_EL: string = "Αποτυχία λήψης. Κάντε κλικ για επανάληψη.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_el_EL: string = "Το ιστορικό σύνδεσης δεν είναι διαθέσιμο";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_el_EL: string = "BACK";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_el_EL: string = "ΔΙΑΜΟΡΦΩΣΗ";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_el_EL: string = "Λήξη";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_el_EL: string = "Εικόνα εφαρμογής";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_el_EL: string = "Περιγραφή εφαρμογής";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_el_EL: string = "Πληροφορίες εφαρμογής";
    // 販売元(4Car_TXT_0082)
    public APP_010_el_EL: string = "Μεταπωλητής";
    // バージョン(4Car_TXT_0084)
    public APP_011_el_EL: string = "Έκδοση";
    // 設定(4Car_TXT_0085)
    public APP_012_el_EL: string = "Ρυθμίσεις";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_el_EL: string = "Προβολή πλοήγησης";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_el_EL: string = "Αγορά στοιχείου εφαρμογής";
    // 非表示(4Car_TXT_0077)
    public APP_015_el_EL: string = "Απόκρυψη";
    // 表示(4Car_TXT_0066)
    public APP_016_el_EL: string = "Εμφάνιση";
    // 無料(4Car_TXT_0177)
    public APP_017_el_EL: string = "Δωρεάν";
    // 購入済み(4Car_TXT_0178)
    public APP_018_el_EL: string = "Αγορασμένο";
    // 販売停止(4Car_TXT_0179)
    public APP_019_el_EL: string = "Διακοπή αγοράς";
    // まで(4Car_TXT_0180)
    public APP_020_el_EL: string = "Προς";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_el_EL: string = "Λήγει σε";
    public APP_021_2_el_EL: string = "ημέρες";
    // 有効期間(4Car_TXT_0142)
    public APP_022_el_EL: string = "Λήξη";
    // 期間選択(4Car_TXT_0159)
    public APP_023_el_EL: string = "Επιλογή περιόδου";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_el_EL: string = "Άκυρο";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_el_EL: string = "Επιλέξτε την περίοδο για αγορά.<br /><br /><font color='red'>Σημείωση<br />Η τιμή που εμφανίζεται παρακάτω ίσως διαφέρει από την πραγματική τιμή αγοράς.<br />Φροντίστε να ολοκληρώσετε την αγορά αφού επιβεβαιώσετε την τιμή αγοράς που εμφανίζεται μόλις πατήσετε το κουμπί [Αγορά].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_el_EL: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_el_EL: string = "Έλεγχος πλοηγού αυτοκινήτου";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_el_EL: string = "Επαληθεύστε το σύστημα πλοήγησης αυτοκινήτου που θα χρησιμοποιεί αυτήν τη δυνατότητα. Η δυνατότητα που αγοράσατε θα είναι διαθέσιμη μόνο στο επιλεγμένο σύστημα πλοήγησης αυτοκινήτου.";
    public APP_028_2_el_EL: string = "Το μήνυμα \"Η εγγραφή της υπηρεσίας ολοκληρώθηκε με επιτυχία\" θα εμφανιστεί μόλις ολοκληρωθεί η αγορά. Μην κλείσετε την οθόνη της εφαρμογής και μην τερματίσετε την επικοινωνία (εάν υπάρχει) με το In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_el_EL: string = "Καταχωρημένος πλοηγός αυτοκινήτου";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_el_EL: string = "Αγορά";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_el_EL: string = "Αλλαγή σε άλλο πλοηγό αυτοκινήτου.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_el_EL: string = "Συνδεδεμένος πλοηγός (τελευταία σύνδεση)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_el_EL: string = "Πιέστε το παρακάτω κουμπί για να μεταβείτε στην οθόνη λίστας εφαρμογών.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_el_EL: string = "Εμφάνιση της λίστας εφαρμογών ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_el_EL: string = "Η αγορά απέτυχε. Λυπούμαστε για την ταλαιπωρία. Επικοινωνήστε με το διαχειριστή της Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_el_EL: string = "Η αγορά μπορεί να μην ολοκληρώθηκε σωστά καθώς η διαδικασία διήρκησε ασυνήθιστα πολλή ώρα. Περιμένετε λίγο και ελέγξτε στην οθόνη της εφαρμογής αν ολοκληρώθηκε η αγορά. Λυπούμαστε για την ταλαιπωρία.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_el_EL: string = "ενεργοποίηση";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_el_EL: string = "απενεργοποίηση";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_el_EL: string = "Παρουσιάστηκε σφάλμα.<br />Λυπούμαστε για την αναστάτωση.<br />Δοκιμάστε πάλι αργότερα.";
    // カーナビ未登録時文言
    public APP_EX01_el_EL: string = "Δεν καταχωρήθηκε";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_el_EL: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_el_EL: string = "Όροι και προϋποθέσεις χρήσης";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_el_EL: string = "Ρυθμίσεις";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_el_EL: string = "ΔΙΑΜΟΡΦΩΣΗ";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_el_EL: string = "BACK";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_el_EL: string = "Διαγραφή δεδομένων της εφαρμογής 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_el_EL: string = "Τα δεδομένα ρύθμισης στην εφαρμογή 4Car διαγράφηκαν.<br />(Διαθέσιμη με την έκδοση 1.0.5 ή νεότερη έκδοση)<br />* Αν η σύνδεση με τη Συσκευή για χρήση στο αυτοκίνητο είναι ασταθής, δοκιμάστε να διαγράψετε τα δεδομένα ρύθμισης.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_el_EL: string = "Διαγραφή όλων των δεδομένων;";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_el_EL: string = "Όλα τα δεδομένα διαγράφηκαν.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_el_EL: string = "Αυτή η λειτουργία είναι διαθέσιμη με την έκδοση 1.0.5 ή νεότερη έκδοση.";

    //STARLINK エラー対応
    public APP_Error_el_EL: string = "Η λήψη απέτυχε.";

    ////STARLINK対応
    public APP_041_el_EL: string = "Ενημέρωση";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_el_EL: string = "BACK";
    //ヘッダー部文言
    public CONFIG_002_el_EL: string = "ΔΙΑΜΟΡΦΩΣΗ";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_el_EL: string = "Τα δεδομένα ρύθμισης στην εφαρμογή STARLINK διαγράφηκαν.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_el_EL: string = "* Αν η σύνδεση με τη Συσκευή για χρήση στο αυτοκίνητο είναι ασταθής, δοκιμάστε να διαγράψετε τα δεδομένα ρύθμισης.";
    //confirmダイアログ用文言
    public CONFIG_005_el_EL: string = "Διαγραφή όλων των δεδομένων;";
    //confirmダイアログ用文言
    public CONFIG_006_el_EL: string = "Όλα τα δεδομένα διαγράφηκαν.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_el_EL: string = "Διαγραφή δεδομένων της εφαρμογής STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_el_EL: string = "Επιλογή περιοχής";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_el_EL: string = "Επιλέξτε την κύρια περιοχή χρήσης";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_el_EL: string = "* Με αυτή την επιλογή θα έχετε μια εφαρμογή βελτιστοποιημένη για την περιοχή χρήσης.";
    //利用規約更新日付文言
    public CONFIG_012_el_EL: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_el_EL: string = "日本";
    //アメリカ
    public LOCATION_002_el_EL: string = "United States";
    //カナダ
    public LOCATION_003_el_EL: string = "Canada";
    //メキシコ
    public LOCATION_004_el_EL: string = "México";
    //イギリス
    public LOCATION_005_el_EL: string = "United Kingdom";
    //フランス
    public LOCATION_006_el_EL: string = "France";
    //ドイツ
    public LOCATION_007_el_EL: string = "Deutschland";
    //オランダ
    public LOCATION_008_el_EL: string = "Nederland";
    //イタリア
    public LOCATION_009_el_EL: string = "Italia";
    //スペイン
    public LOCATION_010_el_EL: string = "España";
    //スウェーデン
    public LOCATION_011_el_EL: string = "Sverige";
    //ポーランド
    public LOCATION_012_el_EL: string = "Polska";
    //ギリシャ
    public LOCATION_013_el_EL: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_el_EL: string = "Česko";
    //ロシア
    public LOCATION_015_el_EL: string = "Россия";
    //ポルトガル
    public LOCATION_016_el_EL: string = "Portugal";
    //フィンランド
    public LOCATION_017_el_EL: string = "Suomi";
    //ハンガリー
    public LOCATION_018_el_EL: string = "Magyarország";

    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_el_EL: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_el_EL: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_el_EL: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_el_EL: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_el_EL: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_el_EL: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_el_EL: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_el_EL: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_el_EL: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_el_EL: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_el_EL: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_el_EL: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_el_EL: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_el_EL: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_el_EL: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_el_EL: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_el_EL: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_el_EL: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_el_EL: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_el_EL: string = "Κάντε ενημέρωση στην πιο πρόσφατη έκδοση της εφαρμογής SUBARU STARLINK πριν από τη χρήση.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_el_EL: string = "Εγκαταστάθηκε νέο In-Car-Device. <br/>Θέλετε να μεταφέρετε την υπάρχουσα άδεια χρήσης στη νέα συσκευή;";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_el_EL: string = "Ναι";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_el_EL: string = "Όχι";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_el_EL: string = "Υπενθύμιση αργότερα";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_el_EL: string = "[Προσοχή!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_el_EL: string = "Από αυτό το σημείο κι έπειτα, η άδεια χρήσης δεν θα μπορεί να μεταφερθεί ξανά πίσω σε αυτήν τη συσκευή. Θέλετε οπωσδήποτε να συνεχίσετε;";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_el_EL: string = "Επιλέξτε τη συσκευή από την οποία θέλετε να μεταφέρετε την άδεια χρήσης";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_el_EL: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_el_EL: string = "Ημερομηνία σύνδεσης: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_el_EL: string = "ηη/μμ/εεεε";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_el_EL: string = "Άκυρο";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_el_EL: string = "Μεταφέρετε την άδεια χρήσης στη νέα συσκευή από εκείνη που συνδέθηκε στις %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_el_EL: string = "Η μεταφορά της άδειας χρήσης ήταν επιτυχής.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_el_EL: string = "Η μεταφορά της άδειας χρήσης απέτυχε.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_el_EL: string = "Η σύνδεση στο νέο In-Car Device (αναγνωριστικό: %2) έγινε στις %1.<br/>Θέλετε να μεταφέρετε την υπάρχουσα άδεια χρήσης στη νέα συσκευή;";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_el_EL: string = "Από αυτό το σημείο κι έπειτα, η άδεια χρήσης δεν θα μπορεί να μεταφερθεί σε αυτό το νέο In-Car-Device (αναγνωριστικό: %2) που συνδέθηκε στις %1. Θέλετε οπωσδήποτε να συνεχίσετε;";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_el_EL: string = "Θα μεταφερθούν τα παρακάτω. ";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_el_EL: string = "Η μεταφορά της προηγούμενης άδειας χρήσης ήταν επιτυχής.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_el_EL: string = "Navigation";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_el_EL: string = "There are several navigation apps that can be used in the in-car-device.<br />Please select a navigation app in the in-car-device.<br /><br />You can select a navigation of when ran app setting destination at in-car-device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_el_EL: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_el_EL: string = "Navigation";
	//月表示(1月)
	public SL_MONTH_TXT_01_el_EL: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_el_EL: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_el_EL: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_el_EL: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_el_EL: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_el_EL: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_el_EL: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_el_EL: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_el_EL: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_el_EL: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_el_EL: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_el_EL: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_el_EL: string = "d.MM.yyyy";

    // SL_TXT_0155
    public SL_TXT_0155_el_EL: string = "Ver. ";
    // SL_TXT_0189
    public SL_TXT_0189_el_EL: string = "Updated *";
    ////////////////////////////////////////////////////////////////
    // チェコ語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_cs_CS: string = "HLAVNÍ";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_cs_CS: string = "Platnost ";
    public HOME_006_2_cs_CS: string = " vypršela.<br />Aby bylo možné používat ";
    public HOME_006_3_cs_CS: string = "";
    public HOME_006_4_cs_CS: string = "";
    public HOME_006_5_cs_CS: string = ", musíte zakoupit funkci.<br />Podrobnosti získáte klepnutím na tlačítko „Zobrazit obrazovku zakoupení“.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_cs_CS: string = "Zobrazit obrazovku pro zakoupení";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_cs_CS: string = "Později";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_cs_CS: string = "Již nezobrazovat";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_cs_CS: string = "APL";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_cs_CS: string = "Stažení se nezdařilo. Klepnutím opakujte akci.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_cs_CS: string = "Historie připojení není k dispozici";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_cs_CS: string = "ZPĚT";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_cs_CS: string = "KONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_cs_CS: string = "Platnost";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_cs_CS: string = "Obrázek aplikace";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_cs_CS: string = "Přehled aplikace";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_cs_CS: string = "Informace o aplikaci";
    // 販売元(4Car_TXT_0082)
    public APP_010_cs_CS: string = "Prodávající";
    // バージョン(4Car_TXT_0084)
    public APP_011_cs_CS: string = "Verze";
    // 設定(4Car_TXT_0085)
    public APP_012_cs_CS: string = "Nastavení";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_cs_CS: string = "Navigační zobrazení";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_cs_CS: string = "Zakoupit aplikaci";
    // 非表示(4Car_TXT_0077)
    public APP_015_cs_CS: string = "Skrýt";
    // 表示(4Car_TXT_0066)
    public APP_016_cs_CS: string = "Zobrazit";
    // 無料(4Car_TXT_0177)
    public APP_017_cs_CS: string = "Zdarma";
    // 購入済み(4Car_TXT_0178)
    public APP_018_cs_CS: string = "Zakoupeno";
    // 販売停止(4Car_TXT_0179)
    public APP_019_cs_CS: string = "Ukončit prodej";
    // まで(4Car_TXT_0180)
    public APP_020_cs_CS: string = "Do";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_cs_CS: string = "Platnost vyprší za";
    public APP_021_2_cs_CS: string = "dní";
    // 有効期間(4Car_TXT_0142)
    public APP_022_cs_CS: string = "Platnost";
    // 期間選択(4Car_TXT_0159)
    public APP_023_cs_CS: string = "Vybrat interval";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_cs_CS: string = "Storno";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_cs_CS: string = "Vyberte interval k zakoupení.<br /><br /><font color='red'>Poznámka<br />Níže uvedená cena a skutečná zúčtovací cena se mohou lišit.<br />Dokončete nákup po potvrzení zúčtovací ceny, která se zobrazí po stisknutí tlačítka [Koupit].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_cs_CS: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_cs_CS: string = "Vyhledat navigaci do auta";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_cs_CS: string = "Zkontrolujte navigační systém vozidla, který bude tuto funkci používat. Zakoupená funkce bude dostupná pouze ve zvoleném navigačním systému vozidla.";
    public APP_028_2_cs_CS: string = "Zpráva \"Služba byla úspěšně zaregistrována\" se zobrazí po dokončení nákupu. Neukončujte obrazovku aplikace nebo neodpojujte komunikaci (pokud probíhá) s přístrojem In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_cs_CS: string = "Registrovaná navigace do auta";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_cs_CS: string = "Koupit";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_cs_CS: string = "Změňte navigaci do auta.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_cs_CS: string = "Připojená navigace do auta (naposledy připojená)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_cs_CS: string = "Stisknutím následujícího tlačítka přejděte na obrazovku seznamu aplikací.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_cs_CS: string = "Zobrazit seznam aplikací ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_cs_CS: string = "S politováním vám oznamujeme, že zakoupení se nezdařilo. Obraťte se prosím na vašeho správce Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_cs_CS: string = "Zakoupení nebylo správně dokončeno, protože trvalo neobvykle dlouho. Chvilku počkejte a na obrazovce aplikací ověřte, zda bylo zakoupení dokončeno. Omlouváme se za případné potíže.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_cs_CS: string = "zap.";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_cs_CS: string = "vyp.";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_cs_CS: string = "Došlo k chybě. <br />Omlouváme se za nepříjemnosti. <br />Zkuste to znovu později.";
    // カーナビ未登録時文言
    public APP_EX01_cs_CS: string = "Neregistrováno";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_cs_CS: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_cs_CS: string = "Podmínky použití";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_cs_CS: string = "Nastavení";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_cs_CS: string = "KONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_cs_CS: string = "ZPĚT";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_cs_CS: string = "Odstranit data aplikace 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_cs_CS: string = "Data nastavení aplikace 4Car byla odstraněna.<br />(K dispozici ve verzi 1.0.5 nebo novější)<br />* V případě nestabilního spojení se zařízením ve vozidle zkuste odstranit data nastavení.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_cs_CS: string = "Odstranit všechna data?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_cs_CS: string = "Všechna data byla odstraněna.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_cs_CS: string = "Tato funkce je k dispozici ve verzi 1.0.5 nebo novější.";

    //STARLINK エラー対応
    public APP_Error_cs_CS: string = "Stažení se nezdařilo.";

    ////STARLINK対応
    public APP_041_cs_CS: string = "Aktualizace";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_cs_CS: string = "ZPĚT";
    //ヘッダー部文言
    public CONFIG_002_cs_CS: string = "KONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_cs_CS: string = "Data nastavení aplikace STARLINK byla odstraněna.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_cs_CS: string = "* V případě nestabilního spojení se zařízením ve vozidle zkuste odstranit data nastavení.";
    //confirmダイアログ用文言
    public CONFIG_005_cs_CS: string = "Odstranit všechna data?";
    //confirmダイアログ用文言
    public CONFIG_006_cs_CS: string = "Všechna data byla odstraněna.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_cs_CS: string = "Odstranit data aplikace STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_cs_CS: string = "Výběr oblasti";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_cs_CS: string = "Vyberte primární oblast použití";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_cs_CS: string = "* Tento výběr slouží k poskytnutí aplikace, která je optimalizována pro příslušnou oblast použití.";
    //利用規約更新日付文言
    public CONFIG_012_cs_CS: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_cs_CS: string = "日本";
    //アメリカ
    public LOCATION_002_cs_CS: string = "United States";
    //カナダ
    public LOCATION_003_cs_CS: string = "Canada";
    //メキシコ
    public LOCATION_004_cs_CS: string = "México";
    //イギリス
    public LOCATION_005_cs_CS: string = "United Kingdom";
    //フランス
    public LOCATION_006_cs_CS: string = "France";
    //ドイツ
    public LOCATION_007_cs_CS: string = "Deutschland";
    //オランダ
    public LOCATION_008_cs_CS: string = "Nederland";
    //イタリア
    public LOCATION_009_cs_CS: string = "Italia";
    //スペイン
    public LOCATION_010_cs_CS: string = "España";
    //スウェーデン
    public LOCATION_011_cs_CS: string = "Sverige";
    //ポーランド
    public LOCATION_012_cs_CS: string = "Polska";
    //ギリシャ
    public LOCATION_013_cs_CS: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_cs_CS: string = "Česko";
    //ロシア
    public LOCATION_015_cs_CS: string = "Россия";
    //ポルトガル
    public LOCATION_016_cs_CS: string = "Portugal";
    //フィンランド
    public LOCATION_017_cs_CS: string = "Suomi";
    //ハンガリー
    public LOCATION_018_cs_CS: string = "Magyarország";


    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_cs_CS: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_cs_CS: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_cs_CS: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_cs_CS: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_cs_CS: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_cs_CS: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_cs_CS: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_cs_CS: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_cs_CS: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_cs_CS: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_cs_CS: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_cs_CS: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_cs_CS: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_cs_CS: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_cs_CS: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_cs_CS: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_cs_CS: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_cs_CS: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_cs_CS: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_cs_CS: string = "Před použitím proveďte aktualizaci na nejnovější verzi aplikace SUBARU STARLINK.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_cs_CS: string = "Je nainstalováno nové zařízení In-Car-Device. <br/>Chcete přenést stávající licenci na nové?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_cs_CS: string = "Ano";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_cs_CS: string = "Ne";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_cs_CS: string = "Připomenout později";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_cs_CS: string = "[Opatrně!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_cs_CS: string = "Od tohoto okamžiku nebude možné přenést licenci zpět na toto zařízení. Chcete pokračovat?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_cs_CS: string = "Vyberte zařízení, ze kterého se má přenést licence";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_cs_CS: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_cs_CS: string = "Datum připojení: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_cs_CS: string = "mm/dd/rrrr";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_cs_CS: string = "Storno";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_cs_CS: string = "Přenést licenci na nové zařízení ze zařízení, které bylo připojeno dne %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_cs_CS: string = "Přenos licence byl úspěšný.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_cs_CS: string = "Přenos licence se nezdařil.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_cs_CS: string = "Připojení k novému zařízení In-Car Device (ID: %2) se uskutečnilo dne %1.<br/>Chcete přenést stávající licenci na nové?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_cs_CS: string = "Od tohoto okamžiku není možné přenést licenci na toto nové zařízení In-Car-Device (ID: %2), které bylo připojeno dne %1. Chcete pokračovat?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_cs_CS: string = "Přenese se následující.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_cs_CS: string = "Přenos předchozí licence byl úspěšný.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_cs_CS: string = "Navigation";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_cs_CS: string = "There are several navigation apps that can be used in the in-car-device.<br />Please select a navigation app in the in-car-device.<br /><br />You can select a navigation of when ran app setting destination at in-car-device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_cs_CS: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_cs_CS: string = "Navigation";
	//月表示(1月)
	public SL_MONTH_TXT_01_cs_CS: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_cs_CS: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_cs_CS: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_cs_CS: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_cs_CS: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_cs_CS: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_cs_CS: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_cs_CS: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_cs_CS: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_cs_CS: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_cs_CS: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_cs_CS: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_cs_CS: string = "d.MM.yyyy";

    // SL_TXT_0155
    public SL_TXT_0155_cs_CS: string = "Ver. ";
    // SL_TXT_0189
    public SL_TXT_0189_cs_CS: string = "Updated *";
    ////////////////////////////////////////////////////////////////
    // イギリス英語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_en_GB: string = "HOME";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_en_GB: string = "";
    public HOME_006_2_en_GB: string = " has expired.<br />You must purchase the function in order to use ";
    public HOME_006_3_en_GB: string = "";
    public HOME_006_4_en_GB: string = "";
    public HOME_006_5_en_GB: string = ".<br />For details, please tap the Display purchase screen button.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_en_GB: string = "Display buy screen";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_en_GB: string = "Later";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_en_GB: string = "Do not display again";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_en_GB: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_en_GB: string = "DownLoad Fail.Click To Try Again.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_en_GB: string = "Connection history not available";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_en_GB: string = "BACK";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_en_GB: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_en_GB: string = "Expires";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_en_GB: string = "Application image";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_en_GB: string = "Application outline";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_en_GB: string = "Application information";
    // 販売元(4Car_TXT_0082)
    public APP_010_en_GB: string = "Seller";
    // バージョン(4Car_TXT_0084)
    public APP_011_en_GB: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_en_GB: string = "Settings";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_en_GB: string = "Navigation display";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_en_GB: string = "Purchase app item";
    // 非表示(4Car_TXT_0077)
    public APP_015_en_GB: string = "Hide";
    // 表示(4Car_TXT_0066)
    public APP_016_en_GB: string = "Display";
    // 無料(4Car_TXT_0177)
    public APP_017_en_GB: string = "Free";
    // 購入済み(4Car_TXT_0178)
    public APP_018_en_GB: string = "Purchased";
    // 販売停止(4Car_TXT_0179)
    public APP_019_en_GB: string = "Stop sale";
    // まで(4Car_TXT_0180)
    public APP_020_en_GB: string = "To";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_en_GB: string = "Expires within";
    public APP_021_2_en_GB: string = "days";
    // 有効期間(4Car_TXT_0142)
    public APP_022_en_GB: string = "Expires";
    // 期間選択(4Car_TXT_0159)
    public APP_023_en_GB: string = "Select period";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_en_GB: string = "Cancel";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_en_GB: string = "Please choose the period to purchase.<br /><br /><font color='red'>Note<br />The price shown below and the actual settlement price may differ.<br />Be sure to complete the purchase after confirming the settlement price that is indicated when the [Purchase] button is pressed.</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_en_GB: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_en_GB: string = "Check car navigation";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_en_GB: string = "Verify the car navigation system which will be using this function. The purchased function will only be available on the selected car navigation system.";
    public APP_028_2_en_GB: string = "The message \"Service has been registered successfully\" will appear when the purchase is complete. Please do not end the application screen or disconnect the communication (when communicating) with the In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_en_GB: string = "Registered car navigation";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_en_GB: string = "Purchase";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_en_GB: string = "Change to another car navigation.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_en_GB: string = "Connected car navigation (last time connected)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_en_GB: string = "Please push following button to go to the application list screen.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_en_GB: string = "Display the application list ";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_en_GB: string = "We apologize and advise that the purchase failed. Please contact your Clarion administrator.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_en_GB: string = "The purchase may not have been correctly completed since the process has taken an unusual amount of time. Please wait a while and confirm whether the purchase was completed on the app screen. We apologize for any inconvenience.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_en_GB: string = "on";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_en_GB: string = "off";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_en_GB: string = "An error has occurred. <br />We are sorry for the inconvenience caused. <br />Try again later.";
    // カーナビ未登録時文言
    public APP_EX01_en_GB: string = "Not registered";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_en_GB: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_en_GB: string = "Terms and Conditions of Use";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_en_GB: string = "Settings";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_en_GB: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_en_GB: string = "BACK";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_en_GB: string = "Delete the 4Car application data";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_en_GB: string = "The setting data in the 4Car application is deleted.<br />(Available with version 1.0.5 or later)<br />* When link with In-Car-Device is unstable, please try deleting the setting data.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_en_GB: string = "Delete all the data?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_en_GB: string = "All the data was deleted.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_en_GB: string = "This function is available with version 1.0.5 or later.";

    //STARLINK エラー対応
    public APP_Error_en_GB: string = "Download failed.";

    ////STARLINK対応
    public APP_041_en_GB: string = "Update";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_en_GB: string = "BACK";
    //ヘッダー部文言
    public CONFIG_002_en_GB: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_en_GB: string = "The STARLINK application data will be deleted.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_en_GB: string = "* Resolves unstable connection with In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_en_GB: string = "Delete all the data?";
    //confirmダイアログ用文言
    public CONFIG_006_en_GB: string = "All the data was deleted.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_en_GB: string = "Clear STARLINK application data";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_en_GB: string = "Region selection";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_en_GB: string = "Select your primary region.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_en_GB: string = "* Provides best experience for apps optimized in your region.";
    //利用規約更新日付文言
    public CONFIG_012_en_GB: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_en_GB: string = "日本";
    //アメリカ
    public LOCATION_002_en_GB: string = "United States";
    //カナダ
    public LOCATION_003_en_GB: string = "Canada";
    //メキシコ
    public LOCATION_004_en_GB: string = "México";
    //イギリス
    public LOCATION_005_en_GB: string = "United Kingdom";
    //フランス
    public LOCATION_006_en_GB: string = "France";
    //ドイツ
    public LOCATION_007_en_GB: string = "Deutschland";
    //オランダ
    public LOCATION_008_en_GB: string = "Nederland";
    //イタリア
    public LOCATION_009_en_GB: string = "Italia";
    //スペイン
    public LOCATION_010_en_GB: string = "España";
    //スウェーデン
    public LOCATION_011_en_GB: string = "Sverige";
    //ポーランド
    public LOCATION_012_en_GB: string = "Polska";
    //ギリシャ
    public LOCATION_013_en_GB: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_en_GB: string = "Česko";
    //ロシア
    public LOCATION_015_en_GB: string = "Россия";
    //ポルトガル
    public LOCATION_016_en_GB: string = "Portugal";
    //フィンランド
    public LOCATION_017_en_GB: string = "Suomi";
    //ハンガリー
    public LOCATION_018_en_GB: string = "Magyarország";


    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_en_GB: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_en_GB: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_en_GB: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_en_GB: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_en_GB: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_en_GB: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_en_GB: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_en_GB: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_en_GB: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_en_GB: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_en_GB: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_en_GB: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_en_GB: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_en_GB: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_en_GB: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_en_GB: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_en_GB: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_en_GB: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_en_GB: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_en_GB: string = "Update to the latest version of SUBARU STARLINK app prior to use.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_en_GB: string = "A new In-Car-Device has been installed. <br/>Do you want to transfer the existing license to the new one?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_en_GB: string = "Yes";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_en_GB: string = "No";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_en_GB: string = "Remind me later";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_en_GB: string = "[Caution!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_en_GB: string = "From this point forward, your license cannot be transferred back to this device. Do you wish to proceed?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_en_GB: string = "Select the device to transfer the license from";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_en_GB: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_en_GB: string = "Connected date: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_en_GB: string = "dd/mm/yyyy";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_en_GB: string = "Cancel";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_en_GB: string = "Transfer the license to the new device from the one that was connected on %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_en_GB: string = "The license transfer was successful.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_en_GB: string = "The license transfer has failed.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_en_GB: string = "The connection to your new In-Car Device (ID: %2) was made on %1.<br/>Do you want to transfer the existing license to the new one?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_en_GB: string = "From this point forward, the license cannot be transferred to this new In-Car-Device (ID: %2) that has been connected on %1. Do you wish to proceed?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_en_GB: string = "The following will be transferred. ";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_en_GB: string = "The previous license transfer was successful.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_en_GB: string = "Select navigation function";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_en_GB: string = "Some In-Car-Devices have multiple navigation functions. Select a navigation to use.<br/><br/>*You may select the navigation used when setting a destination using the In-Car-Device application.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_en_GB: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明(XXX)
    public DELEGATION_004_en_GB: string = "Select navigation function";
	//月表示(1月)
	public SL_MONTH_TXT_01_en_GB: string = "";
	//月表示(2月)
	public SL_MONTH_TXT_02_en_GB: string = "";
	//月表示(3月)
	public SL_MONTH_TXT_03_en_GB: string = "";
	//月表示(4月)
	public SL_MONTH_TXT_04_en_GB: string = "";
	//月表示(5月)
	public SL_MONTH_TXT_05_en_GB: string = "";
	//月表示(6月)
	public SL_MONTH_TXT_06_en_GB: string = "";
	//月表示(7月)
	public SL_MONTH_TXT_07_en_GB: string = "";
	//月表示(8月)
	public SL_MONTH_TXT_08_en_GB: string = "";
	//月表示(9月)
	public SL_MONTH_TXT_09_en_GB: string = "";
	//月表示(10月)
	public SL_MONTH_TXT_10_en_GB: string = "";
	//月表示(11月)
	public SL_MONTH_TXT_11_en_GB: string = "";
	//月表示(12月)
	public SL_MONTH_TXT_12_en_GB: string = "";
	//日付表示形式
	public SL_DATE_FMT_01_en_GB: string = "d.MM.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_en_GB: string = "Size: ";
	public TXT_YELP_0029_en_GB: string = "Error Occurred.Please try again later.";
	public SL_TXT_0155_en_GB: string = "Ver. ";
	public SL_TXT_0189_en_GB: string = "Updated *";
	public SL_TXT_0191_en_GB: string = "Expiration Date: ";
	public SL_TXT_0192_en_GB: string = "Map Update Settings";
	public SL_TXT_0193_en_GB: string = "The In-Car-Device map data can be temporarily saved to your smartphone from the map distribution server. The next time you connect to the In-Car-Device, you can update the map.";
	public SL_TXT_0196_en_GB: string = "Update settings";
	public SL_TXT_0197_en_GB: string = "Check auto update";
	public SL_TXT_0198_en_GB: string = "Cellular";
	public SL_TXT_0199_en_GB: string = "Update info.";
	public SL_TXT_0200_en_GB: string = "Download all";
	public SL_TXT_0201_en_GB: string = "In-Car-Device not updated";
	public SL_TXT_0202_en_GB: string = "Download not complete";
	public SL_TXT_0203_en_GB: string = "In-Car-Device up-to-date";
	public SL_TXT_0204_en_GB: string = "Map: ";
	public SL_TXT_0205_en_GB: string = "Version: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_en_GBを利用　宣言のみ
	public SL_TXT_0206_en_GB: string = "Size: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_en_GB: string = "There is not enough space available on the smartphone.";
	public SL_TXT_0208_en_GB: string = "Set location with the In-Car-Device. Press OK button for details.";
	public SL_TXT_0209_en_GB: string = "Your MapCare subscription\nhas expired.\nPlease visit www.subaru-maps.com\nto update your subscription.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_en_GB: string = "Map Update larger than 30 MB.\n\nPlease connect to Wi-Fi to download.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_en_GB: string = "Update map by connecting In-Car-Device to smartphone. After updating In-Car-Device, map data will automatically be deleted from smartphone.";
	public SL_TXT_0212_en_GB: string = "If you set Cellular to ON, you can download map data when Wi-Fi is set OFF.";
	public SL_TXT_0213_en_GB: string = "The In-Car-Device map data can be temporarily saved to your smartphone automatically by setting check auto update to ON.\n*Data charges will apply.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_en_GB: string = "Connection to In-Car-Device was disconnected. Try again after confirming connection to In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_en_GB: string = "Insufficient In-Car-Device storage available. Try again after confirming In-Car-Device settings.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_en_GB: string = "Error occurred during data transfer. Please try again later.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_en_GB: string = "Error occurred while downloading map data from the server. Please try again later.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_en_GB: string = "Insufficient smartphone storage available. Try again after deleting data from your smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_en_GB: string = 'Cellular Data OFF.\n\nPlease connect to Wi-Fi to download map update.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_en_GB: string = "Communication with server was disconnected. Try again after confirming communications environment.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_en_GBを利用　宣言のみ
	public SL_TXT_0221_en_GB: string = "Size: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // カナダフランス語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_fr_CA: string = "ACCUEIL";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_fr_CA: string = "";
    public HOME_006_2_fr_CA: string = " est expiré.<br />Vous devez acheter la fonction pour utiliser ";
    public HOME_006_3_fr_CA: string = "";
    public HOME_006_4_fr_CA: string = "";
    public HOME_006_5_fr_CA: string = ".<br />Pour plus de détails, veuillez appuyer sur la touche « Afficher écran d'achat ».";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_fr_CA: string = "Afficher écran d'achat";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_fr_CA: string = "Plus tard";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_fr_CA: string = "Ne pas afficher à nouveau";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_fr_CA: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_fr_CA: string = "Échec du téléchargement. Cliquez pour réessayer.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_fr_CA: string = "Historique de connexion non disponible";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_fr_CA: string = "RETOUR";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_fr_CA: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_fr_CA: string = "Expiration";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_fr_CA: string = "Image de l’application";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_fr_CA: string = "Grandes lignes de l’application";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_fr_CA: string = "Informations de l’application";
    // 販売元(4Car_TXT_0082)
    public APP_010_fr_CA: string = "Vendeur";
    // バージョン(4Car_TXT_0084)
    public APP_011_fr_CA: string = "Version";
    // 設定(4Car_TXT_0085)
    public APP_012_fr_CA: string = "Réglages";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_fr_CA: string = "Affichage de navigation";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_fr_CA: string = "Acheter élément d'application";
    // 非表示(4Car_TXT_0077)
    public APP_015_fr_CA: string = "Masquer";
    // 表示(4Car_TXT_0066)
    public APP_016_fr_CA: string = "Affichage";
    // 無料(4Car_TXT_0177)
    public APP_017_fr_CA: string = "Gratuit";
    // 購入済み(4Car_TXT_0178)
    public APP_018_fr_CA: string = "Acheté";
    // 販売停止(4Car_TXT_0179)
    public APP_019_fr_CA: string = "Arrêter la vente";
    // まで(4Car_TXT_0180)
    public APP_020_fr_CA: string = "À";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_fr_CA: string = "Expire dans";
    public APP_021_2_fr_CA: string = "jours";
    // 有効期間(4Car_TXT_0142)
    public APP_022_fr_CA: string = "Expiration";
    // 期間選択(4Car_TXT_0159)
    public APP_023_fr_CA: string = "Sélectionner la période";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_fr_CA: string = "Annuler";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_fr_CA: string = "Veuillez choisir la période à acheter.<br /><br /><font color='red'>Note<br />Le prix indiqué ci-dessous et le prix de règlement réel peut différer.<br />Assurez-vous de compléter l'achat après avoir confirmé le prix de règlement indiqué après avoir pressé le bouton [Acheter].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_fr_CA: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_fr_CA: string = "Vérifier navigation automobile";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_fr_CA: string = "Vérifiez le système de navigation de voiture qui utilisera cette fonction. La fonction achetée sera uniquement disponible sur le système de navigation de voiture sélectionné.";
    public APP_028_2_fr_CA: string = "Le message « Le service a été enregistré avec succès » apparaît lorsque l'achat est effectué. Veuillez ne pas fermer l'écran de l'application ou déconnecter la communication (lors de la communication) avec l'appareil In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_fr_CA: string = "Navigation automobile enregistrée";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_fr_CA: string = "Acheter";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_fr_CA: string = "Changer pour une autre navigation automobile.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_fr_CA: string = "Navigation automobile connectée (connectée la dernière fois)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_fr_CA: string = "Veuillez appuyer sur la touche suivante pour accéder à l'écran de liste d'applications.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_fr_CA: string = "Afficher la liste d'applications";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_fr_CA: string = "Nous vous prions de nous excuser car l'achat a échoué. Veuillez contacter votre administrateur Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_fr_CA: string = "Il se pourrait que l'achat ne soit pas effectué correctement car la durée du processus était inhabituelle. Veuillez patienter un instant et confirmer si l'achat a été complété sur l'écran de l'application. Nous nous excusons pour tout inconvénient.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_fr_CA: string = "activé";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_fr_CA: string = "désactivé";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_fr_CA: string = "Une erreur s’est produite. <br />Désolé pour les inconvénients causés.<br />Réessayez plus tard.";
    // カーナビ未登録時文言
    public APP_EX01_fr_CA: string = "Non enregistré";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_fr_CA: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_fr_CA: string = "Conditions d'utilisation";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_fr_CA: string = "Réglages";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_fr_CA: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_fr_CA: string = "RETOUR";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_fr_CA: string = "Supprimer les données de l’application 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_fr_CA: string = "Les données de réglage de l’application 4Car sont supprimées.<br />(Disponible dans la version 1.0.5 ou une version ultérieure)<br />* Lorsque le lien avec l'appareil embarqué est instable, essayez de supprimer les données de réglage.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_fr_CA: string = "Supprimer toutes les données ?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_fr_CA: string = "Toutes les données ont été supprimées.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_fr_CA: string = "Cette fonction est disponible dans la version 1.0.5 ou une version ultérieure.";

    //STARLINK エラー対応
    public APP_Error_fr_CA: string = "Échec du téléchargement.";

    ////STARLINK対応
    public APP_041_fr_CA: string = "Mise à jour";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_fr_CA: string = "RETOUR";
    //ヘッダー部文言
    public CONFIG_002_fr_CA: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_fr_CA: string = "Les données de l'application STARLINK seront supprimées.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_fr_CA: string = "* Cela résout la connexion instable à l'In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_fr_CA: string = "Supprimer toutes les données ?";
    //confirmダイアログ用文言
    public CONFIG_006_fr_CA: string = "Toutes les données ont été supprimées.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_fr_CA: string = "Effacer les données de l'application STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_fr_CA: string = "Sélection de région";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_fr_CA: string = "Sélectionnez votre région principale.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_fr_CA: string = "* Cela permet de vous fournir la meilleure expérience pour les applications optimisées dans votre région.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_fr_CA: string = "Conditions d'utilisation";
    //利用規約更新日付文言
    public CONFIG_012_fr_CA: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_fr_CA: string = "日本";
    //アメリカ
    public LOCATION_002_fr_CA: string = "United States";
    //カナダ
    public LOCATION_003_fr_CA: string = "Canada";
    //メキシコ
    public LOCATION_004_fr_CA: string = "México";
    //イギリス
    public LOCATION_005_fr_CA: string = "United Kingdom";
    //フランス
    public LOCATION_006_fr_CA: string = "France";
    //ドイツ
    public LOCATION_007_fr_CA: string = "Deutschland";
    //オランダ
    public LOCATION_008_fr_CA: string = "Nederland";
    //イタリア
    public LOCATION_009_fr_CA: string = "Italia";
    //スペイン
    public LOCATION_010_fr_CA: string = "España";
    //スウェーデン
    public LOCATION_011_fr_CA: string = "Sverige";
    //ポーランド
    public LOCATION_012_fr_CA: string = "Polska";
    //ギリシャ
    public LOCATION_013_fr_CA: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_fr_CA: string = "Česko";
    //ロシア
    public LOCATION_015_fr_CA: string = "Россия";
    //ポルトガル
    public LOCATION_016_fr_CA: string = "Portugal";
    //フィンランド
    public LOCATION_017_fr_CA: string = "Suomi";
    //ハンガリー
    public LOCATION_018_fr_CA: string = "Magyarország";


    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_fr_CA: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_fr_CA: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_fr_CA: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_fr_CA: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_fr_CA: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_fr_CA: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_fr_CA: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_fr_CA: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_fr_CA: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_fr_CA: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_fr_CA: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_fr_CA: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_fr_CA: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_fr_CA: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_fr_CA: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_fr_CA: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_fr_CA: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_fr_CA: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_fr_CA: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_fr_CA: string = "Mettez à jour vers la dernière version de l'application SUBARU STARLINK avant l'utilisation.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_fr_CA: string = "Un nouvel In-Car-Device a été installé.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_fr_CA: string = "Oui";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_fr_CA: string = "Non";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_fr_CA: string = "Me le rappeler plus tard";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_fr_CA: string = "[Attention!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_fr_CA: string = "Par la suite, vous ne pourrez plus transférer votre licence de retour vers cet appareil. Souhaitez-vous poursuivre?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_fr_CA: string = "Sélectionnez l'appareil à partir duquel le transfert sera effectué";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_fr_CA: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_fr_CA: string = "Date de connexion: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_fr_CA: string = "mm/jj/aaaa";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_fr_CA: string = "Annuler";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_fr_CA: string = "Transférer la licence vers le nouvel appareil à partir de celui qui était connecté le %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_fr_CA: string = "Le transfert de licence a réussi.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_fr_CA: string = "Le transfert de licence a échoué.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_fr_CA: string = "La connexion vers votre nouvel In-Car Device (ID: %2) a été faite le %1.<br/>Souhaitez-vous transférer la licence existante vers le nouvel appareil?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_fr_CA: string = "Par la suite, vous ne pourrez plus transférer la licence vers ce nouvel In-Car Device (ID: %2) qui a été connecté le %1. Souhaitez-vous poursuivre?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_fr_CA: string = "Ce qui suit sera transféré.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_fr_CA: string = "Le précédent transfert de licence a réussi.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_fr_CA: string = "Sélectionner la fonction de navigation";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_fr_CA: string = "Certains In-Car-Devices disposent de multiples fonctions de navigation. Sélectionnez la navigation que vous souhaitez utiliser.<br/><br/>*Vous pouvez sélectionner la navigation utilisée lors du réglage d'une destination à l'aide de l'application de l'In-Car-Device";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_fr_CA: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_fr_CA: string = "Sélectionner la fonction de navigation";
	//月表示(1月)
	public SL_MONTH_TXT_01_fr_CA: string = "Janv.";
	//月表示(2月)
	public SL_MONTH_TXT_02_fr_CA: string = "Fév.";
	//月表示(3月)
	public SL_MONTH_TXT_03_fr_CA: string = "Mars";
	//月表示(4月)
	public SL_MONTH_TXT_04_fr_CA: string = "Avr.";
	//月表示(5月)
	public SL_MONTH_TXT_05_fr_CA: string = "Mai";
	//月表示(6月)
	public SL_MONTH_TXT_06_fr_CA: string = "Juin";
	//月表示(7月)
	public SL_MONTH_TXT_07_fr_CA: string = "Juil.";
	//月表示(8月)
	public SL_MONTH_TXT_08_fr_CA: string = "Août";
	//月表示(9月)
	public SL_MONTH_TXT_09_fr_CA: string = "Sept.";
	//月表示(10月)
	public SL_MONTH_TXT_10_fr_CA: string = "Oct.";
	//月表示(11月)
	public SL_MONTH_TXT_11_fr_CA: string = "Nov.";
	//月表示(12月)
	public SL_MONTH_TXT_12_fr_CA: string = "Déc.";
	//日付表示形式
	public SL_DATE_FMT_01_fr_CA: string = "MMM d.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_fr_CA: string = "Taille : ";
	public TXT_YELP_0029_fr_CA: string = "Une erreur est survenue.Veuillez réessayer plus tard.";
	public SL_TXT_0155_fr_CA: string = "Ver. ";
	public SL_TXT_0189_fr_CA: string = "Mis à jour le *";
	public SL_TXT_0191_fr_CA: string = "Date d'expiration : ";
	public SL_TXT_0192_fr_CA: string = "Réglages de mise à jour des cartes";
	public SL_TXT_0193_fr_CA: string = "Les données de carte de l'In-Car-Device peuvent être sauvegardées de façon temporaire sur votre téléphone intelligent à partir du serveur de distribution de cartes. La prochaine fois que vous vous connectez à l'In-Car-Device, vous pourrez mettre à jour la carte.";
	public SL_TXT_0196_fr_CA: string = "Réglages mise à jour";
	public SL_TXT_0197_fr_CA: string = "Vérification de la mise à jour automatique";
	public SL_TXT_0198_fr_CA: string = "Cellulaire";
	public SL_TXT_0199_fr_CA: string = "Info. de mise à jour";
	public SL_TXT_0200_fr_CA: string = "Tout télécharger";
	public SL_TXT_0201_fr_CA: string = "In-Car-Device non mis à jour";
	public SL_TXT_0202_fr_CA: string = "Téléchargement non terminé";
	public SL_TXT_0203_fr_CA: string = "In-Car-Device mis à jour";
	public SL_TXT_0204_fr_CA: string = "Carte : ";
	public SL_TXT_0205_fr_CA: string = "Version : ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_fr_CAを利用　宣言のみ
	public SL_TXT_0206_fr_CA: string = "Taille : *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_fr_CA: string = "Espace insuffisant sur le téléphone intelligent.";
	public SL_TXT_0208_fr_CA: string = "Réglez la localisation à l'aide de l'In-Car-Device. Appuyez sur le bouton OK pour plus de détails.";
	public SL_TXT_0209_fr_CA: string = "Inscription MapCare est expirée. Visitez adresse www.subaru-maps.com pour mettre à jour inscription.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_fr_CA: string = "La mise à jour de la carte dépasse 30 Mo.\n\nVeuillez vous connecter au Wi-Fi pour la télécharger.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_fr_CA: string = "Mettez à jour la carte en connectant l'In-Car-Device au téléphone intelligent. Après la mise à jour de l'In-Car-Device, les données de carte seront automatiquement supprimées du téléphone intelligent.";
	public SL_TXT_0212_fr_CA: string = "Si vous réglez Cellulaire sur ACTIVÉ, vous pouvez télécharger des données de carte lorsque Wi-Fi est réglé sur DÉSACTIVÉ.";
	public SL_TXT_0213_fr_CA: string = "Les données de carte de l'In-Car-Device peuvent être automatiquement sauvegardées de façon temporaire sur votre téléphone intelligent en réglant la vérification de la mise à jour automatique sur ACTIVÉ.\n*Des frais de transmission de données s'appliqueront.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_fr_CA: string = "La connexion à l'In-Car-Device a été interrompue. Réessayez après avoir confirmé la connexion à l'In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_fr_CA: string = "L'espace de stockage disponible sur l'In-Car-Device est insuffisant. Réessayez après avoir confirmé les réglages de l'In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_fr_CA: string = "Une erreur est survenue pendant le transfert de données. Veuillez réessayer plus tard.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_fr_CA: string = "Une erreur est survenue lors du téléchargement des données de carte du serveur. Une erreur est survenue. Veuillez réessayer plus tard.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_fr_CA: string = "L'espace de stockage disponible sur le téléphone intelligent est insuffisant. Réessayez après avoir supprimé des données de votre téléphone intelligent.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_fr_CA: string = "Données cellulaires désactivées.\n\nVeuillez vous connecter au Wi-Fi pour télécharger la mise à jour de la carte.";
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_fr_CA: string = "La communication avec le serveur a été interrompue. Réessayez après avoir confirmé l'environnement de communications.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_fr_CAを利用　宣言のみ
	public SL_TXT_0221_fr_CA: string = "Taille : *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // メキシコスペイン語
    ////////////////////////////////////////////////////////////////
    // HOMEタブ上部メニュー(4Car_TXT_0172)
    public HOME_001_es_MX: string = "INICIO";
    // ライセンス切れ画面内文言(4Car_TXT_0149)
    public HOME_006_1_es_MX: string = "";
    public HOME_006_2_es_MX: string = " ha expirado.<br />Debe comprar la función para poder utilizar ";
    public HOME_006_3_es_MX: string = "";
    public HOME_006_4_es_MX: string = "";
    public HOME_006_5_es_MX: string = ">.<br />Para más información, pulse el botón MOSTRAR PANTALLA DE COMPRA.";
    // ライセンス切れ画面内ボタン「購入画面表示」(4Car_TXT_0173)
    public HOME_007_es_MX: string = "Mostar pantalla de compra";
    // ライセンス切れ画面内ボタン「後で」(4Car_TXT_0145)
    public HOME_008_es_MX: string = "Más tarde";
    // ライセンス切れ画面内ボタン「今後表示しない」(4Car_TXT_0146)
    public HOME_009_es_MX: string = "No volver a mostrar";
    // APPタブ上部メニュー(4Car_TXT_0076)
    public APP_001_es_MX: string = "APP";
    // コンテンツ読み込み失敗時表示エラー文言(4Car_TXT_0174)
    public APP_002_es_MX: string = "La descarga falló. Haga clic para intentarlo otra vez.";
    // 接続履歴が無い場合に上部メニューに表示(4Car_TXT_0175)
    public APP_003_es_MX: string = "La conexión al historial no está disponible";
    // BACKボタン(4Car_TXT_0056)
    public APP_004_es_MX: string = "ATRÁS";
    // CONFIGボタン(4Car_TXT_0078)
    public APP_005_es_MX: string = "CONFIG";
    // ライセンス有効期間表示(4Car_TXT_0192)
    public APP_006_es_MX: string = "Expira";
    // アプリイメージ(4Car_TXT_0079)
    public APP_007_es_MX: string = "Imagen de la aplicación";
    // アプリ概要(4Car_TXT_0080)
    public APP_008_es_MX: string = "Descripción de la aplicación";
    // アプリ情報(4Car_TXT_0081)
    public APP_009_es_MX: string = "Información de la aplicación";
    // 販売元(4Car_TXT_0082)
    public APP_010_es_MX: string = "Vendedor";
    // バージョン(4Car_TXT_0084)
    public APP_011_es_MX: string = "Versión";
    // 設定(4Car_TXT_0085)
    public APP_012_es_MX: string = "Configuración";
    // ナビ表示(4Car_TXT_0086)
    public APP_013_es_MX: string = "Pantalla de navegación";
    // アプリ内アイテム購入(4Car_TXT_0176)
    public APP_014_es_MX: string = "Comprar aplicación";
    // 非表示(4Car_TXT_0077)
    public APP_015_es_MX: string = "Ocultar";
    // 表示(4Car_TXT_0066)
    public APP_016_es_MX: string = "Mostrar";
    // 無料(4Car_TXT_0177)
    public APP_017_es_MX: string = "Gratis";
    // 購入済み(4Car_TXT_0178)
    public APP_018_es_MX: string = "Comprada";
    // 販売停止(4Car_TXT_0179)
    public APP_019_es_MX: string = "Detener la venta";
    // まで(4Car_TXT_0180)
    public APP_020_es_MX: string = "Hacia";
    // ○○日以内に切れます(4Car_TXT_0192)
    public APP_021_1_es_MX: string = "Expira en";
    public APP_021_2_es_MX: string = "días";
    // 有効期間(4Car_TXT_0142)
    public APP_022_es_MX: string = "Expira";
    // 期間選択(4Car_TXT_0159)
    public APP_023_es_MX: string = "Seleccionar periodo.";
    // キャンセルボタン(4Car_TXT_0112)
    public APP_024_es_MX: string = "Cancelar";
    // 購入する期間を選択して下さい。(4Car_TXT_0165)
    public APP_025_es_MX: string = "Escoja el periodo que desea comprar.<br /><br /><font color='red'>Nota<br />El precio que se muestra a continuación y el precio de liquidación final puede diferir.<br />Asegúrese de completar la compra después de confirmar el precio de liquidación que se indica al pulsar el botón [Adquirir].</font>";
    // 決定ボタン(4Car_TXT_0160)
    public APP_026_es_MX: string = "OK";
    // カーナビ確認(4Car_TXT_0181)
    public APP_027_es_MX: string = "Comprobar el sistema de navegación para automóviles";
    // 車載機選択時文言(4Car_TXT_0723)
    public APP_028_1_es_MX: string = "Verifique el sistema de navegación para automóviles que utilizará esta función. La función de compra solo estará disponible en el sistema de navegación del coche seleccionado.";
    public APP_028_2_es_MX: string = "Cuando se haya completado la compra, aparecerá el mensaje \"El servicio se ha registrado correctamente\". Por favor, no cierre la pantalla de la aplicación ni desconecte la comunicación (durante la comunicación) con el In-Car-Device.";
    // 登録中のカーナビ(4Car_TXT_0183)
    public APP_029_es_MX: string = "Sistema de navegación para automóviles registrado";
    // 購入実行ボタン(4Car_TXT_0161)
    public APP_030_es_MX: string = "Adquirir";
    // 他のカーナビに変更ボタン(4Car_TXT_0162)
    public APP_031_es_MX: string = "Cambiar a otro sistema de navegación para automóviles.";
    // 過去接続車載機文言(4Car_TXT_0156)
    public APP_032_es_MX: string = "Sistema de navegación para automóviles conectado (última vez que se conectó)";
    // 購入完了後画面内文言(4Car_TXT_0163)
    public APP_033_es_MX: string = "Por favor presione el botón siguiente para ir a la pantalla de lista de aplicaciones.";
    // アプリ一覧表示ボタン(4Car_TXT_0164)
    public APP_034_es_MX: string = "Mostrar la lista de aplicaciones.";
    // 購入失敗時文言(4Car_TXT_0185)
    public APP_035_es_MX: string = "Le pedimos disculpas y le informamos que la compra falló. Contacte a su administrador de Clarion.";
    // 購入未完了時文言(4Car_TXT_0186)
    public APP_036_es_MX: string = "La compra pudo no haberse completado correctamente ya que el proceso ha durado una cantidad de tiempo inusual. Espere un poco y confirme si la compra se ha completado en la lista de aplicaciones. Le pedimos disculpas por cualquier inconveniente.";
    // ナビ表示on(4Car_TXT_0088)
    public APP_037_es_MX: string = "encendido";
    // ナビ表示off(4Car_TXT_0087)
    public APP_038_es_MX: string = "apagado";
    // アプリ・ライセンス取得エラー時表示文言
    public APP_039_es_MX: string = "Se ha producido un error.<br />Lamentamos cualquier inconveniente.<br />Inténtelo de nuevo más tarde.";
    // カーナビ未登録時文言
    public APP_EX01_es_MX: string = "No registrado";
    // OTHERタブ上部メニュー(4Car_TXT_0007)
    public OTHER_001_es_MX: string = "MORE";
    // 利用規約(4Car_TXT_0188)
    public OTHER_002_es_MX: string = "Términos y condiciones de uso";
    // 設定ボタン(4Car_TXT_0085)
    public OTHER_003_es_MX: string = "Configuración";
    // CONFIGボタン(4Car_TXT_0078)
    public OTHER_004_es_MX: string = "CONFIG";
    // BACKボタン(4Car_TXT_0056)
    public OTHER_005_es_MX: string = "ATRÁS";
    // 4Carアプリ内データ削除ボタン(4Car_TXT_0051)
    public OTHER_006_es_MX: string = "Eliminar los datos de la aplicación 4Car";
    // 4Carアプリ内データ消去時文言(4Car_TXT_0052)
    public OTHER_007_es_MX: string = "Eliminando los datos de configuración de la aplicación 4Car.<br />(Disponible con la versión 1.0.5 o posterior)<br />* Cuando el enlace con el dispositivo del automóvil no sea estable, pruebe a eliminar los datos de configuración.";
    // データ消去確認アラート内文言(4Car_TXT_0053)
    public OTHER_008_es_MX: string = "¿Eliminar todos los datos?";
    // データ消去後表示文言(4Car_TXT_0054)
    public OTHER_009_es_MX: string = "Se han eliminado todos los datos.";
    // データ消去不能時アラート内文言(4Car_TXT_0055)
    public OTHER_010_es_MX: string = "Esta función está disponible con la versión 1.0.5 o posterior.";

    //STARLINK エラー対応
    public APP_Error_es_MX: string = "La descarga falló.";

    ////STARLINK対応
    public APP_041_es_MX: string = "Actualización";

    //STARLINK CONFIGページ対応　　21015/12/18(ferix布生)
    //BACKボタン
    public CONFIG_001_es_MX: string = "ATRÁS";
    //ヘッダー部文言
    public CONFIG_002_es_MX: string = "CONFIG";
    //CONFIG画面文言(SL_TXT_0153上)
    public CONFIG_003_es_MX: string = "Los datos de la aplicación STARLINK se eliminarán.";
    //CONFIG画面文言(SL_TXT_0153下)
    public CONFIG_004_es_MX: string = "* Esto resuelve la conexión instable al In-Car-Device.";
    //confirmダイアログ用文言
    public CONFIG_005_es_MX: string = "¿Eliminar todos los datos?";
    //confirmダイアログ用文言
    public CONFIG_006_es_MX: string = "Se han eliminado todos los datos.";
    //キャッシュクリアボタン文言(SL_TXT_0152)
    public CONFIG_007_es_MX: string = "Borrar los datos de la aplicación STARLINK";

    //利用地域選択画面文言(SL_TXT_0003)
    public CONFIG_008_es_MX: string = "Selección de región";
    //利用地域選択画面文言(SL_TXT_0154上)
    public CONFIG_009_es_MX: string = "Seleccione su región primaria.";
    //利用地域選択画面文言(SL_TXT_0154下)
    public CONFIG_010_es_MX: string = "* Esto ofrece la mejor experiencia para las aplicaciones optimizadas en su región.";
    //利用規約文言(4Car_TXT_0188)
    public CONFIG_011_es_MX: string = "Términos y condiciones de uso";
    //利用規約更新日付文言
    public CONFIG_012_es_MX: string = "April 1. 2017 Updated.";
    //日本
    public LOCATION_001_es_MX: string = "日本";
    //アメリカ
    public LOCATION_002_es_MX: string = "United States";
    //カナダ
    public LOCATION_003_es_MX: string = "Canada";
    //メキシコ
    public LOCATION_004_es_MX: string = "México";
    //イギリス
    public LOCATION_005_es_MX: string = "United Kingdom";
    //フランス
    public LOCATION_006_es_MX: string = "France";
    //ドイツ
    public LOCATION_007_es_MX: string = "Deutschland";
    //オランダ
    public LOCATION_008_es_MX: string = "Nederland";
    //イタリア
    public LOCATION_009_es_MX: string = "Italia";
    //スペイン
    public LOCATION_010_es_MX: string = "España";
    //スウェーデン
    public LOCATION_011_es_MX: string = "Sverige";
    //ポーランド
    public LOCATION_012_es_MX: string = "Polska";
    //ギリシャ
    public LOCATION_013_es_MX: string = "Ελλάδα";
    //チェコ
    public LOCATION_014_es_MX: string = "Česko";
    //ロシア
    public LOCATION_015_es_MX: string = "Россия";
    //ポルトガル
    public LOCATION_016_es_MX: string = "Portugal";
    //フィンランド
    public LOCATION_017_es_MX: string = "Suomi";
    //ハンガリー
    public LOCATION_018_es_MX: string = "Magyarország";




    //=======================課金モジュールエラー(alert表示のため<br />ではなく"\n")==========================

    //課金モジュールエラー時ポップアップ文言101
    public ALERT_001_es_MX: string = "CODE: 2101\nPurchase was cancelled.";
    //課金モジュールエラー時ポップアップ文言103
    public ALERT_002_es_MX: string = "CODE: 2103\nPurchase was failed. Possible cause is either no entry of the account information, or the OS or the store app must be updated to the latest.";
    //課金モジュールエラー時ポップアップ文言104
    public ALERT_003_es_MX: string = "CODE: 2104\nFailure occurred as the selected item was not available to purchase.";
    //課金モジュールエラー時ポップアップ文言105
    public ALERT_004_es_MX: string = "CODE: 2105\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言106
    public ALERT_005_es_MX: string = "CODE: 2106\nPurchase failed. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言107
    public ALERT_006_es_MX: string = "CODE: 2107\nFailure occurred as the item has already been purchased.";
    //課金モジュールエラー時ポップアップ文言108
    public ALERT_007_es_MX: string = "CODE: 2108\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言110
    public ALERT_008_es_MX: string = "CODE: 2110\nThe account is invalid and cannot be used to purchase. Try again with a valid account to purchase. ";
    //課金モジュールエラー時ポップアップ文言111
    public ALERT_009_es_MX: string = "CODE: 2111\nCommunication disconncted. Try again under the better signal condition.";
    //課金モジュールエラー時ポップアップ文言211
    public ALERT_010_es_MX: string = "CODE: 2211\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言213
    public ALERT_011_es_MX: string = "CODE: 2213\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言228
    public ALERT_012_es_MX: string = "CODE: 2228\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言243
    public ALERT_013_es_MX: string = "CODE: 2243\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase.";
    //課金モジュールエラー時ポップアップ文言261
    public ALERT_014_es_MX: string = "CODE: 2261\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言299
    public ALERT_015_es_MX: string = "CODE: 2299\nPurchase failed. Try again later. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言996
    public ALERT_016_es_MX: string = "CODE: 2996\nPurchase of some items was interrupted. The system begins the restoration process.";
    //課金モジュールエラー時ポップアップ文言997
    public ALERT_017_es_MX: string = "CODE: 2997\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言998
    public ALERT_018_es_MX: string = "CODE: 2998\nPurchase failed due to the failure of the communication to the server. Try again later.\n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";
    //課金モジュールエラー時ポップアップ文言999
    public ALERT_019_es_MX: string = "CODE: 2999\nPurchase failed. Try again. \n* If you tried to purchase the item already purchased, the system processes the restoration of the failed purchase. ";

    //バージョンアップ必要時文言
    public VERSION_001_es_MX: string = "Actualice a la versión más reciente de la aplicación SUBARU STARLINK antes de utilizarla.";

	//ライセンス引継確認画面説明文言(SL_TXT_0005)
	public LICENCE_001_es_MX: string = "Un nuevo In-Car-Device ha sido instalado.<br/>¿Desea transferir la licencia existente al nuevo?";
	//「はい」ボタン(SL_TXT_0006)
	public LICENCE_002_es_MX: string = "Sí";
	//「いいえ」ボタン(SL_TXT_0007)
	public LICENCE_003_es_MX: string = "No";
	//「後で表示」ボタン(SL_TXT_0008)
	public LICENCE_004_es_MX: string = "Recordármelo más tarde";
	//【注意】(SL_TXT_0009)
	public LICENCE_005_es_MX: string = "[¡Precaución!]";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0010)
	public LICENCE_006_es_MX: string = "En adelante su licencia no podrá ser transferida de nuevo a este dispositivo. ¿Desea seguir?";
	//引継元選択画面説明文言(SL_TXT_0011)
	public LICENCE_007_es_MX: string = "Seleccione el dispositivo del que transferirá la licencia";
	//車載機ID(SL_TXT_0012)
	public LICENCE_008_es_MX: string = "In-Car-Device ID: ";
	//接続日(SL_TXT_0013)
	public LICENCE_009_es_MX: string = "Fecha de conexión: ";
	//日付フォーマット(SL_TXT_0014)
	public LICENCE_010_es_MX: string = "dd/mm/aa";
	//「キャンセル」ボタン(SL_TXT_0015)
	public LICENCE_011_es_MX: string = "Cancelar";
	//引継実行確認画面説明文言(SL_TXT_0016)
	public LICENCE_012_es_MX: string = "Transferir la licencia al nuevo dispositivo del que fue conectado el %1.";
	//引継成功画面説明文言(SL_TXT_0017)
	public LICENCE_013_es_MX: string = "La transferencia de licencia se realizó correctamente.";
	//引継失敗画面説明文言(SL_TXT_0018)
	public LICENCE_014_es_MX: string = "La transferencia de licencia ha fallado.";
	//ライセンス引継確認画面説明文言(SL_TXT_0019)
	public LICENCE_015_es_MX: string = "La conexión con su nuevo In-Car Device (ID: %2) fue establecida el %1.<br/>¿Desea transferir la licencia existente al nuevo?";
	//ライセンス引継キャンセル確認説明文言(SL_TXT_0020)
	public LICENCE_016_es_MX: string = "En adelante la licencia no podrá ser transferida a este nuevo In-Car Device (ID: %2) que ha sido conectado el %1. ¿Desea seguir?";
	//引継実行確認画面説明文言(SL_TXT_0021)
	public LICENCE_017_es_MX: string = "Lo siguiente será transferido.";
	//引継成功画面文言(SL_TXT_0036)
	public LICENCE_018_es_MX: string = "La transferencia de licencia anterior se realizó correctamente.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_es_MX: string = "Seleccionar la función de navegación";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_es_MX: string = "Algunos In-Car-Devices disponen de múltiples funciones de navegación. Seleccione la navegación que desea utilizar.<br/><br/>*Puede seleccionar la navegación utilizada al establecer un destino mediante la aplicación del In-Car-Device.";
    //デリゲーション画面タイトル(XXX)
    public DELEGATION_003_es_MX: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_es_MX: string = "Seleccionar la función de navegación";
	//月表示(1月)
	public SL_MONTH_TXT_01_es_MX: string = "Ene.";
	//月表示(2月)
	public SL_MONTH_TXT_02_es_MX: string = "Feb.";
	//月表示(3月)
	public SL_MONTH_TXT_03_es_MX: string = "Mar.";
	//月表示(4月)
	public SL_MONTH_TXT_04_es_MX: string = "Abr.";
	//月表示(5月)
	public SL_MONTH_TXT_05_es_MX: string = "Mayo";
	//月表示(6月)
	public SL_MONTH_TXT_06_es_MX: string = "Jun.";
	//月表示(7月)
	public SL_MONTH_TXT_07_es_MX: string = "Jul.";
	//月表示(8月)
	public SL_MONTH_TXT_08_es_MX: string = "Ago.";
	//月表示(9月)
	public SL_MONTH_TXT_09_es_MX: string = "Sept.";
	//月表示(10月)
	public SL_MONTH_TXT_10_es_MX: string = "Oct.";
	//月表示(11月)
	public SL_MONTH_TXT_11_es_MX: string = "Nov.";
	//月表示(12月)
	public SL_MONTH_TXT_12_es_MX: string = "Dic.";
	//日付表示形式
	public SL_DATE_FMT_01_es_MX: string = "MMM d.yyyy";

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_es_MX: string = "Tamaño: ";
	public TXT_YELP_0029_es_MX: string = "Ha ocurrido un error.Vuelva a intentarlo más tarde.";
	public SL_TXT_0155_es_MX: string = "Ver. ";
	public SL_TXT_0189_es_MX: string = "Actualizado el *";
	public SL_TXT_0191_es_MX: string = "Fecha de expiración: ";
	public SL_TXT_0192_es_MX: string = "Ajustes de actualización de mapa";
	public SL_TXT_0193_es_MX: string = "Los datos de mapa del In-Car-Device pueden guardarse de forma temporal en su smartphone desde el servidor de distribución de mapas. La próxima vez que se conectará al In-Car-Device, podrá actualizar el mapa.";
	public SL_TXT_0196_es_MX: string = "Ajustes actualización";
	public SL_TXT_0197_es_MX: string = "Verificación de la actualización automática";
	public SL_TXT_0198_es_MX: string = "Celular";
	public SL_TXT_0199_es_MX: string = "Info. Actualización";
	public SL_TXT_0200_es_MX: string = "Descargar todo";
	public SL_TXT_0201_es_MX: string = "In-Car-Device no actualizado";
	public SL_TXT_0202_es_MX: string = "Descarga incompleta";
	public SL_TXT_0203_es_MX: string = "In-Car-Device actualizado";
	public SL_TXT_0204_es_MX: string = "Mapa: ";
	public SL_TXT_0205_es_MX: string = "Versión: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_es_MXを利用　宣言のみ
	public SL_TXT_0206_es_MX: string = "Tamaño: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_es_MX: string = "No hay suficiente espacio en el smartphone.";
	public SL_TXT_0208_es_MX: string = "Establezca la ubicación con el In-Car-Device. Pulse el botón OK para más detalles.";
	public SL_TXT_0209_es_MX: string = "Suscripción a MapCare caducada. Visite www.subaru-maps.com para actualizar suscripción.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_es_MX: string = "Los datos de este mapa superan los 30 MB. Vuelva a descargar después de confirmar la conexión Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_es_MX: string = "Actualice el mapa conectando el In-Car-Device al smartphone. Después de actualizar el In-Car-Device, los datos de mapa se eliminarán automáticamente del smartphone.";
	public SL_TXT_0212_es_MX: string = "Si establece Celular en ACTIVADO, podrá descargar los datos de mapa cuando Wi-Fi está establecido en DESACTIVADO.";
	public SL_TXT_0213_es_MX: string = "Los datos de mapa del In-Car-Device pueden guardarse automáticamente de forma temporal en su smartphone al establecer la verificación de la actualización automática en ACTIVADO.\n*Se aplicarán cargos de datos.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_es_MX: string = "Se interrumpió la conexión con el In-Car-Device. Vuelva a intentarlo después de confirmar la conexión con el In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_es_MX: string = "El espacio de almacenamiento disponible en el In-Car-Device es insuficiente. Vuelva a intentarlo después de confirmar los ajustes del In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_es_MX: string = "Ha ocurrido un error durante la transferencia de datos. Vuelva a intentarlo más tarde.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_es_MX: string = "Ha ocurrido un error mientras se descargaban los datos de mapa del servidor. Vuelva a intentarlo más tarde.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_es_MX: string = "El espacio de almacenamiento disponible en el smartphone es insuficiente. Vuelva a intentarlo después de eliminar datos de su smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_es_MX: string = 'Utilice el Wi-Fi para la comunicación. O establezca "Celular" en "ACTIVADO" en la pantalla de los ajustes de actualización y descargue mediante datos celulares.<br/>*No se puede descargar mediante datos celulares datos de mapa que superan los 30 MB.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_es_MX: string = "Se interrumpió la comunicación con el servidor. Vuelva a intentarlo después de confirmar el entorno de comunicaciones.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_es_MXを利用　宣言のみ
	public SL_TXT_0221_es_MX: string = "Tamaño: *MB";

    // ----- Harman OTA 対応 -----<



    ////////////////////////////////////////////////////////////////
    // タイ語 th
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_th: string = "ต้องการจะลบข้อมูลทั้งหมดหรือไม่?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_th: string = "ข้อมูลทั้งหมดได้ถูกลบแล้ว";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_th: string = "กลับไป";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_th: string = "ข้อกำหนดในการให้บริการ";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_th: string = "อัปเดต 01/ 04/ 2017";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_th: string = "ข้อมูลของแอพพลิเคชัน STARLINK จะถูกลบออก";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_th: string = "*แก้ไขปัญหาการเชื่อมต่อที่ไม่เสถียรกับ In-Car-Device";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_th: string = "ลบข้อมูลแอพพลิเคชัน STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_th: string = "เลือกภูมิภาค";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_th: string = "เลือกภูมิภาคหลักของคุณ ";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_th: string = "* สัมผัสกับประสบการณ์การเพิ่มประสิทธิภาพที่ยอดเยี่ยมในภูมิภาคของคุณ \"";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_th: string = "เลือกฟังก์ชันการนำเส้นทาง";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_th: string = "อุปกรณ์ In-Car-Device บางรุ่นมีฟังก์ชันการนำเส้นทางหลายแบบ เลือกการนำเส้นทางที่คุณต้องการใช้ <br/><br/>* คุณสามารถเลือกการนำเส้นทางที่ใช้เพื่อการกำหนดปลายทาง โดยใช้แอพพลิเคชัน In-Car-Device ได้ ";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_th: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_th: string = "เลือกฟังก์ชันการนำเส้นทาง";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_th: string = "ขนาด: ";
	public TXT_YELP_0029_th: string = "เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง";
	public SL_TXT_0155_th: string = "เวอร์ชัน ";
	public SL_TXT_0189_th: string = "อัปเดต *";
	public SL_TXT_0191_th: string = "วันหมดอายุ: ";
	public SL_TXT_0192_th: string = "การตั้งค่าการอัปเดตแผนที่";
	public SL_TXT_0193_th: string = "ข้อมูลแผนที่ใน In-Car-Device สามารถทำการบันทึกข้อมูลชั่วคราวของแผนที่ไปยังสมาร์ทโฟนของคุณได้จากเซิร์ฟเวอร์ เพื่อความสะดวกในครั้งต่อไปสำหรับการเชื่อมต่อกับIn-Car-Device คุณสามารถอัปเดตแผนที่ได้";
	public SL_TXT_0196_th: string = "อัปเดตการตั้งค่า";
	public SL_TXT_0197_th: string = "ตรวจสอบการอัปเดตอัตโนมัติ";
	public SL_TXT_0198_th: string = "เซลลูลาร์";
	public SL_TXT_0199_th: string = "อัปเดตข้อมูล";
	public SL_TXT_0200_th: string = "ดาวน์โหลดทั้งหมด";
	public SL_TXT_0201_th: string = "In-Car-Device ไม่ได้อัปเดต";
	public SL_TXT_0202_th: string = "การดาวน์โหลดไม่สมบูรณ์";
	public SL_TXT_0203_th: string = "In-Car-Device ได้อัปเดตแล้ว";
	public SL_TXT_0204_th: string = "แผนที่: ";
	public SL_TXT_0205_th: string = "เวอร์ชัน: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_thを利用　宣言のみ
	public SL_TXT_0206_th: string = "ขนาด: * KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_th: string = "พื้นที่ว่างไม่เพียงพอในสมาร์ทโฟนของท่าน";
	public SL_TXT_0208_th: string = "ตั้งตำแหน่งด้วย In-Car-Device กดปุ่ม OK เพื่อดูรายละเอียด";
	public SL_TXT_0209_th: string = "ระยะเวลาการเป็นสมาชิกของข้อมูลแผนที่ของคุณ ได้หมดอายุลงแล้ว กดปุ่ม OK เพื่อดูรายละเอียด";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_th: string = "ข้อมูลของแผนที่นี้ได้ใช้พื้นที่เกิน 30 MB โปรดดาวน์โหลดอีกครั้ง หลังจากที่ได้ยืนยันการเชื่อมต่อ Wi-Fi";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_th: string = "อัปเดตแผนที่โดยการเชื่อมต่อ In-Car-Device เข้ากับสมาร์ทโฟน หลังจากอัปเดตข้อมูล In-Car-Device แล้ว ข้อมูลแผนที่จะถูกลบออกจากสมาร์ทโฟนโดยอัตโนมัติ";
	public SL_TXT_0212_th: string = "ถ้าคุณตั้งค่าเซลลูลาร์ไว้ที่ เปิด คุณสามารถดาวน์โหลดข้อมูลแผนที่ในขณะที่คุณ ปิด Wi-Fi ได้";
	public SL_TXT_0213_th: string = "ข้อมูลแผนที่ของ In-Car-Device จะถูกบันทึกเป็นการชั่วคราวไว้ในสมาร์ทโฟนของคุณโดยระบบอัตโนมัติ โดยการเปิดตั้งค่าการตรวจสอบการอัปเดตอัตโนมัติ \n* เสียค่าใช้จ่ายสำหรับการดำเนินการนี้";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_th: string = "หากการเชื่อมต่อกับอุปกรณ์ In-Car-Device ถูกตัดการเชื่อมต่อ กรุณาลองอีกครั้งหลังจากยืนยันการเชื่อมต่อกับ In-Car-Device";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_th: string = "พื้นที่การจัดเก็บข้อมูล In-Car-Device ไม่เพียงพอ กรุณาลองอีกครั้งหลังจากยืนยันการเชื่อมต่อกับ In-Car-Device";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_th: string = "เกิดข้อผิดพลาดระหว่างถ่ายโอนข้อมูล, โปรดลองอีกครั้งในภายหลัง";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_th: string = "เกิดข้อผิดพลาดขณะดาวน์โหลดข้อมูลของแผนที่จากเซิร์ฟเวอร์, โปรดลองอีกครั้งในภายหลัง";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_th: string = "พื้นที่การจัดเก็บข้อมูลในสมาร์ทโฟนไม่เพียงพอ โปรดลองอีกครั้งหลังจากลบข้อมูลบางส่วนในสมาร์ทโฟนของคุณ";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_th: string = 'ใช้ Wi-Fi เพื่อการสื่อสารหรือตั้งค่าเซลลูลาร์เป็น "เปิด" บริเวณหน้าจอ และตั้งค่าการอัปเดตหรือดาวน์โหลดโดยใช้ข้อมูลเซลลูลาร์ <br/>* ไม่สามารถดาวน์โหลดข้อมูลแผนที่มีขนาดเกินกว่า 30 MB';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_th: string = "หากการสื่อสารกับเซิร์ฟเวอร์ถูกตัดการเชื่อมต่อ กรุณาลองอีกครั้งหลังจากยืนยันสภาพในการติดต่อสื่อสาร";
	// SL_TXT_0221 ※OTHER_SIZE_0001_thを利用　宣言のみ
	public SL_TXT_0221_th: string = "ขนาด: * MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // ポルトガル語 pt
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_pt: string = "Eliminar todos os dados?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_pt: string = "Foram eliminados todos os dados.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_pt: string = "VOLTAR";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_pt: string = "Termos e condições de utilização";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_pt: string = "Atualizado 04/01/2017";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_pt: string = "Os dados da aplicação STARLINK serão eliminados.";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_pt: string = "* Resolve conexão instável com In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_pt: string = "Excluir dados da aplicação STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_pt: string = "Seleção de Região";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_pt: string = "Selecionar sua região principal. ";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_pt: string = "* Fornece a melhor experiência para aplicações otimizadas em sua região.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_pt: string = "Selecionar função de navegação";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_pt: string = "Alguns In-Car-Devices possuem funções de navegação múltiplas. Selecione uma navegação para utilizar.<br/><br/>*Pode selecionar a navegação utilizada quando definir um destino utilizando a aplicação In-Car-Device.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_pt: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_pt: string = "Selecionar função de navegação";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_pt: string = "Tamanho: ";
	public TXT_YELP_0029_pt: string = "Erro ocorrido. Por favor tente novamente mais tarde.";
	public SL_TXT_0155_pt: string = "Ver. ";
	public SL_TXT_0189_pt: string = "Atualizado *";
	public SL_TXT_0191_pt: string = "Data de Expiração: ";
	public SL_TXT_0192_pt: string = "Definições de Atualização de Mapa";
	public SL_TXT_0193_pt: string = "Os dados de mapa do In-Car-Device podem ser guardados temporariamente no seu smartphone do servidor de distribuição de mapa. A próxima vez que conectar ao in-Car-Device, poderá atualizar o mapa.";
	public SL_TXT_0196_pt: string = "Defin. de atualização";
	public SL_TXT_0197_pt: string = "Verificar atualização automática";
	public SL_TXT_0198_pt: string = "Dados móveis";
	public SL_TXT_0199_pt: string = "Info. de atualização";
	public SL_TXT_0200_pt: string = "Descarregar tudo";
	public SL_TXT_0201_pt: string = "In-Car-Device não atualizado";
	public SL_TXT_0202_pt: string = "Descarga não concluída";
	public SL_TXT_0203_pt: string = "In-Car-Device atualizado";
	public SL_TXT_0204_pt: string = "Mapa: ";
	public SL_TXT_0205_pt: string = "Versão: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_ptを利用　宣言のみ
	public SL_TXT_0206_pt: string = "Tamanho: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_pt: string = "Não há memória livre suficiente no smartphone.";
	public SL_TXT_0208_pt: string = "Definir localidade com o In-Car-Device. Premir botão OK para detalhes.";
	public SL_TXT_0209_pt: string = "O prazo da subscrição MapCare terminou. Aceda a www.subaru-maps.com para a atualizar.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_pt: string = "Estes dados de mapa excedem 30 MB. Por Favor descarregue novamente após confirmar a conexão Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_pt: string = "Atualizar mapa através da conexão do In-Car-Device ao smartphone. Após atualizar In-Car-Device, dados de mapa serão eliminados automaticamente do smartphone.";
	public SL_TXT_0212_pt: string = "Se definir Dados móveis para ON, pode descarregar dados de mapa quando Wi-Fi estiver definido em OFF.";
	public SL_TXT_0213_pt: string = "Os dados de mapa do In-Car-Device podem ser guardados temporariamente e automaticamente no seu smartphone definindo verificar atualização automática para ON.\n*Cobrança de dados será aplicada.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_pt: string = "Conexão com In-Car-Device foi desconectada. Tente novamente depois de confirmar a conexão ao In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_pt: string = "Espaço disponível no In-Car-Device insuficiente. Tente novamente depois de confirmar as definições do In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_pt: string = "Erro ocorrido durante transferência de dados. Por favor tente novamente mais tarde.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_pt: string = "Erro ocorrido durante transferência de dados de mapa do servidor. Por favor tente novamente mais tarde.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_pt: string = "Espaço disponível no smartphone insuficiente. Tente novamente mais tarde depois de eliminar dados do seu smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_pt: string = 'Usar Wi-Fi para comunicação. Ou definir "Dados móveis" para "ON" no ecrã de definições de atualização e descarregar usando dados móveis.<br/>*Dados de mapa que excedam 30 MB não podem ser descarregados usando dados móveis. ';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_pt: string = "Comunicação com servidor foi desconectada. Tente novamente depois de confirmar o ambiente de comunicações.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_ptを利用　宣言のみ
	public SL_TXT_0221_pt: string = "Tamanho: *MB";

    // ----- Harman OTA 対応 -----<



    ////////////////////////////////////////////////////////////////
    // ノルウェー語 no
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_no: string = "Slette alle dataene?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_no: string = "Alle dataene ble slettet.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_no: string = "TILBAKE";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_no: string = "Vilkår og betingelser for bruk";

    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_no: string = "Oppdatert 04/01/2017";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_no: string = "STARLINK-applikasjonsdata slettes.";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_no: string = "* Løser ustabil tilkobling med In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_no: string = "Slett STARLINK-applikasjonsdata";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_no: string = "Valg av region";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_no: string = "Velg hovedregionen din..";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_no: string = "* Gir best opplevelse for apper som er optimert i din region.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_no: string = "Velg navigasjonsfunksjon";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_no: string = "Noen In-Car-Devices har flere navigasjonsfunksjoner. Velg en navigasjon som skal brukes.<br/><br/>*Du kan velge navigasjonen som ble brukt ved innstilling av en destinasjon med In-Car-Device-applikasjonen.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_no: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_no: string = "Velg navigasjonsfunksjon";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_no: string = "Størrelse: ";
	public TXT_YELP_0029_no: string = "Feil oppsto. Prøv igjen senere.";
	public SL_TXT_0155_no: string = "Ver. ";
	public SL_TXT_0189_no: string = "Oppdatert *";
	public SL_TXT_0191_no: string = "Utløpsdato: ";
	public SL_TXT_0192_no: string = "Kartoppdateringsinnstillinger";
	public SL_TXT_0193_no: string = "In-Car-Device-kartdata kan midlertidig lagres på smarttelefonen fra kartdistribueringsserveren. Neste gang du kobler til In-Car-Device, kan du oppdatere kartet.";
	public SL_TXT_0196_no: string = "Oppdateringsinnst.";
	public SL_TXT_0197_no: string = "Sjekk automatisk oppdatering";
	public SL_TXT_0198_no: string = "Mobil";
	public SL_TXT_0199_no: string = "Oppdateringsinfo.";
	public SL_TXT_0200_no: string = "Last ned alle";
	public SL_TXT_0201_no: string = "In-Car-Device ikke oppdatert";
	public SL_TXT_0202_no: string = "Nedlastning ikke fullført";
	public SL_TXT_0203_no: string = "In-Car-Device oppdatert";
	public SL_TXT_0204_no: string = "Kart: ";
	public SL_TXT_0205_no: string = "Versjon: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_noを利用　宣言のみ
	public SL_TXT_0206_no: string = "Størrelse: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_no: string = "Det er ikke nok tilgjengelig plass på smarttelefonen.";
	public SL_TXT_0208_no: string = "Angi plassering med In-Car-Device. Trykk på OK-knappen for detaljer.";
	public SL_TXT_0209_no: string = "Kartdataabonnementet utløper. Trykk på OK-knappen for detaljer.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_no: string = "Dette kartets data overstiger 30 MB. Last ned igjen etter at du har bekreftet Wi-Fi-tilkobling.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_no: string = "Oppdatert kart ved å koble In-Car-Device til smarttelefonen. Etter oppdatering av In-Car-Device, slettes kartdata automatisk fra smarttelefonen.";
	public SL_TXT_0212_no: string = "Hvis du slår på Mobil, kan du laste ned kartdata når Wi-Fi er slått av.";
	public SL_TXT_0213_no: string = "In-Car-Device-kartdata kan midlertidig lagres automatisk til smarttelefonen ved å slå på sjekk automatisk oppdatering.\n*Datagebyrer påløper.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_no: string = "Tilkobling til In-Car-Device var frakoblet. Prøv igjen etter bekreftelse av tilkobling til In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_no: string = "Utilstrekkelig In-Car-Device-lagringsplass tilgjengelig. Prøv igjen etter bekreftelse av In-Car-Device-innstillinger.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_no: string = "Feil oppsto under dataoverføring. Prøv igjen senere.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_no: string = "Feil oppsto under nedlastning av kartdata fra serveren. Prøv igjen senere.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_no: string = "Utilstrekkelig tilgjengelig lagringsplass på smarttelefon. Prøv igjen etter sletting av data fra smarttelefonen.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_no: string = 'Bruk Wi-Fi for kommunikasjon, eller sett "Mobil" til "PÅ" i oppdateringsinnstillinger-skjermen og last ned med mobilnett.<br/>*Kartdata som overstiger 30 MB kan ikke lastes ned med mobilnett.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_no: string = "Kommunikasjon med server ble frakoblet. Prøv igjen etter at du har bekreftet kommunikasjonsmiljøet.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_noを利用　宣言のみ
	public SL_TXT_0221_no: string = "Størrelse: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // Chinese(簡体字) zh_CN 
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_zh_CN: string = "是否删除所有数据？";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_zh_CN: string = "已删除所有数据。";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_zh_CN: string = "返回";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_zh_CN: string = "使用条款";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_zh_CN: string = "更新于 2017年04月01日";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_zh_CN: string = "将会删除STARLINK应用程序的设置数据。";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_zh_CN: string = "※当与In-Car-Device连接不稳定时尝试此操作。";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_zh_CN: string = "清除STARLINK应用程序数据";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_zh_CN: string = "选择使用区域";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_zh_CN: string = "选择您的主要使用区域。";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_zh_CN: string = "※根据您的区域提供最优的应用程序。";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_zh_CN: string = "选择导航功能";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_zh_CN: string = "部分In-Car-Device上有多个导航功能。请选择您要使用的导航。<br/><br/>*当使用In-Car-Device应用程序设置目的地时可选择导航使用。";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_zh_CN: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_zh_CN: string = "选择导航功能";
    // ----- 既存のMoreタブ -------<

    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_zh_CN: string = "大小：";
	public TXT_YELP_0029_zh_CN: string = "发生错误。请稍后重试。";
	public SL_TXT_0155_zh_CN: string = "版本";
	public SL_TXT_0189_zh_CN: string = "更新于 *";
	public SL_TXT_0191_zh_CN: string = "有效期限：";
	public SL_TXT_0192_zh_CN: string = "地图更新设置";
	public SL_TXT_0193_zh_CN: string = "可从地图分发服务器上临时保存In-Car-Device地图数据至您的智能手机。当下次连接至In-Car-Device时即可更新地图。";
	public SL_TXT_0196_zh_CN: string = "更新设置";
	public SL_TXT_0197_zh_CN: string = "检查自动更新";
	public SL_TXT_0198_zh_CN: string = "手机移动数据";
	public SL_TXT_0199_zh_CN: string = "更新信息";
	public SL_TXT_0200_zh_CN: string = "下载全部";
	public SL_TXT_0201_zh_CN: string = "未更新In-Car-Device";
	public SL_TXT_0202_zh_CN: string = "未完成下载";
	public SL_TXT_0203_zh_CN: string = "In-Car-Device已是最新版";
	public SL_TXT_0204_zh_CN: string = "地图：";
	public SL_TXT_0205_zh_CN: string = "版本：";
	// SL_TXT_0206 ※OTHER_SIZE_0001_zh_CNを利用　宣言のみ
	public SL_TXT_0206_zh_CN: string = "大小：*KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_zh_CN: string = "智能手机没有足够的可用空间。";
	public SL_TXT_0208_zh_CN: string = "在In-Car-Device上设置位置。请按OK键获取详情。";
	public SL_TXT_0209_zh_CN: string = "您的 MapCare 订阅已到期。请访问 www.subaru-maps.com 更新您的订阅。";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_zh_CN: string = "此地图数据超过30MB。请确认Wi-Fi连接后重新下载。 ";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_zh_CN: string = "请将In-Car-Device连接至智能手机更新地图。更新In-Car-Device后地图数据将自动从智能手机上删除。";
	public SL_TXT_0212_zh_CN: string = "若您将手机移动数据设置为开启，在没有Wi-Fi连接的情况下可使用手机移动数据下载地图数据。";
	public SL_TXT_0213_zh_CN: string = "将检查自动更新设置为开启时，In-Car-Device地图数据将自动临时保存至您的智能手机。\n※会产生通信费用。";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_zh_CN: string = "与In-Car-Device的连接中断。请确认正确连接至In-Car-Device后重试。";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_zh_CN: string = "In-Car-Device的可用存储空间不足。请确认In-Car-Device的设置后重试。";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_zh_CN: string = "在数据传送过程中发生错误。请稍后重试。";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_zh_CN: string = "在从服务器上下载地图数据的过程中发生错误。请稍后重试。";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_zh_CN: string = "智能手机的可用存储空间不足。请删除智能手机内的无用数据后重试。";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_zh_CN: string = "请使用Wi-Fi进行通信。或在更新设置画面将“手机移动数据”设置为“开启”，然后使用手机移动数据下载。<br/>*使用手机移动数据无法下载超过30MB的地图数据。";
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_zh_CN: string = "与服务器的连接中断。请确认通信环境后重试。";
	// SL_TXT_0221 ※OTHER_SIZE_0001_zh_CNを利用　宣言のみ
	public SL_TXT_0221_zh_CN: string = "大小：*MB";

    // ----- Harman OTA 対応 -----<


    ////////////////////////////////////////////////////////////////
    // Chinese(繁体字) zh_TW
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_zh_TW: string = "要刪除所有數據嗎？";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_zh_TW: string = "已刪除所有數據。";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_zh_TW: string = "上一步";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_zh_TW: string = "使用守則";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_zh_TW: string = "2017年04月01日 更新";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_zh_TW: string = "STARLINK應用程式內的數據將被刪除";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_zh_TW: string = "※當與In-Car-Device連線不穩定時嘗試此操作。";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_zh_TW: string = "刪除STARLINK應用程式內的數據";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_zh_TW: string = "選擇使用地區";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_zh_TW: string = "請選擇您主要的使用地區。";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_zh_TW: string = "※本系統將提供最適合該使用地區的應用程式。";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_zh_TW: string = "選擇導航功能";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_zh_TW: string = "部分In-Car-Device有多種導航功能。請選擇您需要的導航裝置。<br/><br/>*以In-Car-Device應用程式選擇目的地時，可以選擇導航裝置。";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_zh_TW: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_zh_TW: string = "選擇導航功能";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_zh_TW: string = "檔案大小：";
    public TXT_YELP_0029_zh_TW: string = "發生錯誤。請稍候重試。";
	public SL_TXT_0155_zh_TW: string = "版本";
	public SL_TXT_0189_zh_TW: string = "* 更新";
	public SL_TXT_0191_zh_TW: string = "有效期限：";
	public SL_TXT_0192_zh_TW: string = "地圖更新設定";
	public SL_TXT_0193_zh_TW: string = "In-Car-Device中的地圖數據可以從地圖配送伺服器暫存於您的智慧型手機裡。當您下次連接In-Car-Device時，就能更新地圖。";
	public SL_TXT_0196_zh_TW: string = "更新設定";
	public SL_TXT_0197_zh_TW: string = "確認自動更新";
	public SL_TXT_0198_zh_TW: string = "行動數據";
	public SL_TXT_0199_zh_TW: string = "更新資訊";
	public SL_TXT_0200_zh_TW: string = "全部下載";
	public SL_TXT_0201_zh_TW: string = "In-Car-Device尚未更新";
	public SL_TXT_0202_zh_TW: string = "下載尚未完成";
	public SL_TXT_0203_zh_TW: string = "In-Car-Device已更新至最新版本";
	public SL_TXT_0204_zh_TW: string = "地圖：";
	public SL_TXT_0205_zh_TW: string = "版本：";
	// SL_TXT_0206 ※OTHER_SIZE_0001_zh_TWを利用　宣言のみ
	public SL_TXT_0206_zh_TW: string = "檔案大小：*KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_zh_TW: string = "智慧手機沒有足夠的可用空間。";
	public SL_TXT_0208_zh_TW: string = "請以In-Car-Device設定地區。詳情請按OK鍵。";
	public SL_TXT_0209_zh_TW: string = "您的 MapCare 訂閱已到期。請前往 www.subaru-maps.com 更新訂閱。";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_zh_TW: string = "此地圖數據超過30MB。請確認Wi-Fi連線後重新下載。";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_zh_TW: string = "請連接智慧型手機與In-Car-Device以更新地圖。In-Car-Device更新後，地圖數據會自動從智慧型手機中刪除。";
	public SL_TXT_0212_zh_TW: string = "若您將行動數據設定為開啟，則可在關閉Wi-Fi的狀況下下載地圖數據。";
	public SL_TXT_0213_zh_TW: string = "若開啟確認自動更新功能，In-Car-Device的地圖會自動暫存於智慧型手機裡。\n※將產生網路數據費用。";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_zh_TW: string = "與In-Car-Device連線中斷。請確認與In-Car-Device之連線後重試。";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_zh_TW: string = "In-Car-Device儲存空間不足。請確認In-Car-Device之設定後重試。";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_zh_TW: string = "數據傳輸中發生錯誤。請稍候重試。";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_zh_TW: string = "從伺服器下載地圖數據時發生錯誤。請稍後重試。";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_zh_TW: string = "智慧型手機剩餘空間不足。請刪除您智慧型手機內的資料後重試。";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_zh_TW: string = "請使用Wi-Fi連線。或從更新設定頁面將行動數據設定為開啟後，以行動數據下載。<br/>※大於30MB的地圖數據無法以行動數據下載。";
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_zh_TW: string = "與伺服器的連線中斷。請確認連線後重試。";
	// SL_TXT_0221 ※OTHER_SIZE_0001_zh_TWを利用　宣言のみ
	public SL_TXT_0221_zh_TW: string = "檔案大小：*MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // マレー語 ms
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_ms: string = "Padamkan semua data?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_ms: string = "Semua data telah dipadamkan.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_ms: string = "KEMBALI";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_ms: string = "Terma dan Syarat Penggunaan";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_ms: string = "Dikemas kini 01/04/2017";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_ms: string = "Data aplikasi STARLINK akan dipadamkan.";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_ms: string = "* Menyelesaikan masalah sambungan yang tidak stabil dengan In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_ms: string = "Kosongkan data aplikasi STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_ms: string = "Pemilihan kawasan";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_ms: string = "Pilih kawasan utama anda.";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_ms: string = "* Memberikan pengalaman terbaik untuk apl yang dioptimumkan di kawasan anda.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_ms: string = "Pilih fungsi navigasi";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_ms: string = "Sesetengah In-Car-Device mempunyai berbilang fungsi navigasi. Pilih navigasi untuk digunakan.<br/><br/>*Anda boleh memilih navigasi yang digunakan semasa menetapkan destinasi menggunakan aplikasi In-Car-Device.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_ms: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_ms: string = "Pilih fungsi navigasi";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_ms: string = "Saiz: ";
	public TXT_YELP_0029_ms: string = "Ralat berlaku.Sila cuba lagi kemudian.";
	public SL_TXT_0155_ms: string = "Ver. ";
	public SL_TXT_0189_ms: string = "Dikemas kini *";
	public SL_TXT_0191_ms: string = "Tarikh Luput: ";
	public SL_TXT_0192_ms: string = "Tetapan Kemas Kini Peta";
	public SL_TXT_0193_ms: string = "Data peta In-Car-Device boleh disimpan buat sementara ke telefon pintar anda dari pelayan pengedaran peta. Apabila anda menyambung ke In-Car-Device seterusnya, anda boleh mengemas kini peta.";
	public SL_TXT_0196_ms: string = "Tetapan kemas kini";
	public SL_TXT_0197_ms: string = "Semak kemas kini auto";
	public SL_TXT_0198_ms: string = "Selular";
	public SL_TXT_0199_ms: string = "Kemas kini maklumat";
	public SL_TXT_0200_ms: string = "Muat turun semua";
	public SL_TXT_0201_ms: string = "In-Car-Device tidak dikemas kini";
	public SL_TXT_0202_ms: string = "Muat turun tidak lengkap";
	public SL_TXT_0203_ms: string = "In-Car-Device terkini";
	public SL_TXT_0204_ms: string = "Peta: ";
	public SL_TXT_0205_ms: string = "Versi: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_msを利用　宣言のみ
	public SL_TXT_0206_ms: string = "Saiz: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_ms: string = "Tiada ruang yang mencukupi pada telefon pintar.";
	public SL_TXT_0208_ms: string = "Tetapkan lokasi dengan In-Car-Device. Tekan butang OK untuk butiran.";
	public SL_TXT_0209_ms: string = "Langganan data peta anda telah tamat tempoh. Tekan butang OK untuk butiran.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_ms: string = "Data peta ini melebihi 30 MB. Sila muat turun semula selepas mengesahkan sambungan Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_ms: string = "Kemas kini peta dengan menyambungkan In-Car-Device ke telefon pintar. Selepas mengemas kini In-Car-Device, data peta akan dipadamkan secara automatik dari telefon pintar.";
	public SL_TXT_0212_ms: string = "Jika anda menetapkan Selular kepada HIDUP, anda boleh memuat turun data peta apabila Wi-Fi ditetapkan sebagai MATI.";
	public SL_TXT_0213_ms: string = "Data peta In-Car-Device boleh disimpan buat sementara ke telefon pintar anda secara automatik dengan menetapkan semak kemas kini auto kepada HIDUP.\n*Caj data akan dikenakan.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_ms: string = "Sambungan ke In-Car-Device telah terputus. Cuba lagi selepas mengesahkan sambungan ke In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_ms: string = "Storan In-Car-Device tidak mencukup. Cuba lagi selepas mengesahkan tetapan In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_ms: string = "Ralat berlaku semasa pemindahan data. Sila cuba lagi kemudian.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_ms: string = "Ralat berlaku semasa memuat turun data peta dari pelayan. Sila cuba lagi kemudian.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_ms: string = "Storan telefon pintar tidak mencukupi. Cuba lagi selepas memadamkan data dari telefon pintar anda.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_ms: string = 'Gunakan Wi-Fi untuk komunikasi. Atau tetapkan "Selular" kepada "HIDUP" dalam skrin tetapan kemas kini dan muat turun menggunakan data selular. <br/>*Data peta yang melebihi 30 MB tidak boleh dimuat turun menggunakan data selular.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_ms: string = "Komunikasi dengan pelayan telah terputus sambungan. Cuba lagi selepas mengesahkan persekitaran komunikasi.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_msを利用　宣言のみ
	public SL_TXT_0221_ms: string = "Saiz: *MB";

    // ----- Harman OTA 対応 -----<


    ////////////////////////////////////////////////////////////////
    // タガログ語 fil
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_fil: string = "Burahin ang lahat ng data?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_fil: string = "Ang lahat ng data ay naibura na.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_fil: string = "BUMALIK";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_fil: string = "Mga Tuntunin at Kundisyon sa Paggamit";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_fil: string = "In-update noong 01/04/2017";    
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_fil: string = "Ang application data ng STARLINK ay buburahin. ";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_fil: string = "* Nireresolba ang hindi maayos na connection sa In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_fil: string = "Ibura ang application data ng STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_fil: string = "Pagpili ng rehiyon";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_fil: string = "Piliin ang iyong pangunahing rehiyon.";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_fil: string = "* Nagbibigay ng pinakamahusay na kasanayan para sa mga app na inoptimize sa iyong rehiyon. ";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_fil: string = "Pumili ng function sa nabigasyon";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_fil: string = "Iilang mga In-Car-Device ay may maraming function sa nabigasyon. Pumili ng nabigasyon na gagamitin.<br/><br/>*Maaari kang pumili ng ginamit na nabigasyon kapag magse-set ng destinasyon gamit ang In-Car-Device app.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_fil: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_fil: string = "Pumili ng function sa nabigasyon";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_fil: string = "Laki: ";
	public TXT_YELP_0029_fil: string = "May pagkakamali na nangyari. Subukang gawin muli mamaya.";
	public SL_TXT_0155_fil: string = "Ber. ";
	public SL_TXT_0189_fil: string = "In-update noong *";
	public SL_TXT_0191_fil: string = "Petsa ng Pagkawalang-bisa: ";
	public SL_TXT_0192_fil: string = "Settings ng Pag-update sa Mapa";
	public SL_TXT_0193_fil: string = "Ang map data ng In-Car-Device ay maaaring i-save nang pansamantala sa iyong smartphone mula sa server na namamahagi ng mapa. Sa susunod na kumonekta ka sa In-Car-Device, maaari mong i-update ang mapa.";
	public SL_TXT_0196_fil: string = "Set. ng Pag-update";
	public SL_TXT_0197_fil: string = "I-check ang auto update";
	public SL_TXT_0198_fil: string = "Cellular";
	public SL_TXT_0199_fil: string = "Imporm. ng update";
	public SL_TXT_0200_fil: string = "I-download lahat";
	public SL_TXT_0201_fil: string = "Hindi pa naa-update ang In-Car-Device";
	public SL_TXT_0202_fil: string = "Hindi natapos ang pagdownload";
	public SL_TXT_0203_fil: string = "Ang In-Car-Device ay naka-update nang husto";
	public SL_TXT_0204_fil: string = "Mapa: ";
	public SL_TXT_0205_fil: string = "Bersyon: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_filを利用　宣言のみ
	public SL_TXT_0206_fil: string = "Laki: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_fil: string = "Walang sapat na espasyo na magagamit sa smartphone.";
	public SL_TXT_0208_fil: string = "I-set ang lokasyon gamit ang In-Car-Device. Pindutin ang OK button para sa iba pang mga detalye.";
	public SL_TXT_0209_fil: string = "Ang iyong subskripsyon sa data ng mapa ay expired na. Pindutin ang OK button para sa iba pang mga detalye.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_fil: string = "Ang data ng mapa ay lampas na sa 30 MB. I-download muli ito pagkatapos mong kumpirmahin ang koneksyon ng Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_fil: string = "I-update ang mapa sa pamamagitan ng pagkonekta sa In-Car-Device sa iyong smartphone. Pagka-update mo ng In-Car-Device, ang data ng mapa ay awtomatikong mabubura mula sa iyong smartphone.";
	public SL_TXT_0212_fil: string = "Kung ang Cellular ay naka-set sa ON, maaari mong mai-download ang mapa kapag ang Wi-Fi ay naka-set sa OFF.";
	public SL_TXT_0213_fil: string = "Ang data ng mapa ng In-Car-Device ay maaaring mai-save sa iyong smartphone nang pansamantala sa pamamagitan ng pag-set ng check auto update sa ON.\n*May bayad para sa data.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_fil: string = "Ang koneksyon sa In-Car-Device ay naka-diskunekta. Subukan muling gawin iyon pagkatapos kumprimahin ang koneksyon sa In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_fil: string = "Kaunting memory ng smartphone ang natitira. Subukan muling gawin iyon pagkatapos kumprimahin ang settings ng In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_fil: string = "May pagkakamali na nangyari habang ang data ay nililipat. Subukan muling gawin iyon mamaya.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_fil: string = "May pagkakamali na nangyari habang nagdodownload ng mapa mula sa server. Subukan muling gawin iyon mamaya.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_fil: string = "Kaunting memory ng smartphone ang natitira. Subukan muling gawin iyon pagkatapos burahin ang data mula sa iyong smartphone.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_fil: string = 'Gamitin ang Wi-Fi para sa komunikasyon. O kaya, i-set ang "Cellular" sa "ON" sa screen ng settings sa update at mag-download gamit ang cellular data.<br/>*Ang data ng mapa na lumalagpas sa 30 MB ay hindi na maaaring mai-download gamit ang cellular data.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_fil: string = "Nadiskonekta ang komunikasyon sa server. Subukan muling gawin iyon pagkatapos kumpirmahin ang kapiligiran ng komunikasyon.";
	// SL_TXT_0206 ※OTHER_SIZE_0001_filを利用　宣言のみ
	public SL_TXT_0221_fil: string = "Laki: *MB";

    // ----- Harman OTA 対応 -----<

    ////////////////////////////////////////////////////////////////
    // ヘブライ語 he
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_he: string = "למחוק את כל הנתונים?";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_he: string = "כל הנתונים נמחקו.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_he: string = "חזרה";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_he: string = "תנאי והתניות שימוש";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_he: string = "עודכן 01/04/2017";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_he: string = "נתוני יישום STARLINK ימחקו.";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_he: string = "* פותר חיבור לא יציב ב-In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_he: string = "נקה נתוני יישום STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_he: string = "בחירת איזור";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_he: string = "בחר איזור ראשי שלך.";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_he: string = "* מספק חוויה מרבית עבור יישומים אשר מוטבו לאיזור";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_he: string = "בחר פונקציית ניווט";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_he: string = "In-Car-Device מסויימים כוללים פונקציות ניווט מרובות. בחר ניווט לשימוש.<br/><br/>*יכול ותבחר ניווט לשימוש בהגדרת יעד באמצעות יישום In-Car-Device.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_he: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_he: string = "בחר פונקציית ניווט";

    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_he: string = "גודל: ";
	public TXT_YELP_0029_he: string = "אירעה שגיאה. אנא נסה שוב מאוחר יותר.";
	public SL_TXT_0155_he: string = "גרסה ";
	public SL_TXT_0189_he: string = "עודכן *";
	public SL_TXT_0191_he: string = "תאריך תפוגה: ";
	public SL_TXT_0192_he: string = "הגדרות עדכון מפה";
	public SL_TXT_0193_he: string = "ניתן לשמור נתוני מפה של In-Car-Device באופן זמני לטלפון החכם שלך משרת הפצת מפה. בפעם הבאה שתתחבר ל-In-Car-Device, ניתן לעדכן את המפה.";
	public SL_TXT_0196_he: string = "הגדרות עדכון";
	public SL_TXT_0197_he: string = "בדיקת עדכון אוטומטי";
	public SL_TXT_0198_he: string = "סלולרי";
	public SL_TXT_0199_he: string = "מידע עדכון";
	public SL_TXT_0200_he: string = "הורד הכל";
	public SL_TXT_0201_he: string = "In-Car-Device לא מעודכן";
	public SL_TXT_0202_he: string = "הורדה לא הושלמה";
	public SL_TXT_0203_he: string = "In-Car-Device מעודכן";
	public SL_TXT_0204_he: string = "מפה: ";
	public SL_TXT_0205_he: string = "גרסה: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_heを利用　宣言のみ
	public SL_TXT_0206_he: string = "גודל: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_he: string = "אין נפח אחסון מספק בטלפון החכם.";
	public SL_TXT_0208_he: string = "הגדר מיקום ב-In-Car-Device. לחץ על לחצן OK (אישור) לפרטים.";
	public SL_TXT_0209_he: string = "מנוי MapCare שלך פג תוקף. כדי לעדכן את המנוי, בקר באתר www.subaru-maps.com.‏";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_he: string = "נתוני המפה הזו חורגים מ-30 MB. אנא הורד שוב לאחר אישור חיבור לרשת Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_he: string = "עדכן מפה באמצעות חיבור ל-In-Car-Device לטלפון החכם. לאחר עדכון In-Car-Device, נתוני המפה יימחקו באופן אוטומטי מהטלפון החכם.";
	public SL_TXT_0212_he: string = "אם סלולרי מוגדר כ-ON (מופעל), ניתן להוריד נתוני מפה כאשר Wi-Fi מוגדר כ-OFF (כבוי).";
	public SL_TXT_0213_he: string = "נתוני מפת In-Car-Device נשמרים זמנית בטלפון החכם שלך באופן אוטומטי בהגדרת בדיקת עדכון אוטומטי למצב ON (מופעל).\n*עשויים לחול נתוני חיוב.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_he: string = "החיבור ל-In-Car-Device נותק. נסה שוב לאחר אישור חיבור ל-In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_he: string = "רמת אחסון זמין ב-In-Car-Device אינה מספיקה. נסה שוב לאחר אישור הגדרות In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_he: string = "אירעה שגיאה במהלך העברת נתונים. אנא נסה שוב מאוחר יותר.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_he: string = "אירעה שגיאה במהלך הורדת נתוני מפה מהשרת. אנא נסה שוב מאוחר יותר.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_he: string = "רמת אחסון זמין בטלפון החכם אינה מספיקה. נסה שוב לאחר מחיקת נתונים מהטלפון החכם שלך.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_he: string = 'השתמש בתקשורת Wi-Fi. או הגדר "סלולרי" כ-ON (מופעל) במסך הגדרות עדכון והוריד באמצעות נתונים סלולריים.<br/>*לא ניתן להוריד נתוני מפה החורגים מ-30 MB באמצעות נתונים סלולריים.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_he: string = "התקשורת לשרת נותקה. נסה שוב לאחר אישור סביבת תקשורת.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_heを利用　宣言のみ
	public SL_TXT_0221_he: string = "גודל: *MB";
    // ----- Harman OTA 対応 -----<


    ////////////////////////////////////////////////////////////////
    // アラビア語 ar
    ////////////////////////////////////////////////////////////////
    // ----- 既存のMoreタブ ------->
    // 4Car_TXT_0053 : confirmダイアログ用文言
    public CONFIG_005_ar: string = "حذف كل البيانات؟";
    // 4Car_TXT_0054 : confirmダイアログ用文言
    public CONFIG_006_ar: string = "تم حذف كل البيانات.";
    // 4Car_TXT_0056 : BACKボタン
    public CONFIG_001_ar: string = "عودة";
    // 4Car_TXT_0188 : 利用規約文言
    public CONFIG_011_ar: string = "أحكام وشروط الاستخدام";
    // SL_TXT_0189 : 利用規約更新日付文言 FIXME
    public CONFIG_012_ar: string = "تم التحديث في اليوم/الشهر/السنة";
    // SL_TXT_0153(上段) : CONFIG画面文言
    public CONFIG_003_ar: string = "سيتم حذف بيانات تطبيق STARLINK.‏";
    // SL_TXT_0153(下段) : CONFIG画面文言
    public CONFIG_004_ar: string = "* يحل مشكلة الاتصال غير المستقر مع In-Car-Device.";
    // SL_TXT_0152 : キャッシュクリアボタン文言
    public CONFIG_007_ar: string = "محو بيانات تطبيق STARLINK";
    // SL_TXT_0003 : 利用地域選択画面文言
    public CONFIG_008_ar: string = "اختيار المنطقة";
    // SL_TXT_0154(上) : 利用地域選択画面文言
    public CONFIG_009_ar: string = "اختر منطقتك الأساسية.";
    // SL_TXT_0154(下) : 利用地域選択画面文言
    public CONFIG_010_ar: string = "* يقدم أفضل تجربة للتطبيقات المثلى في منطقتك.";
    // HTML_TXT_0029 : デリゲーションボタン
    public DELEGATION_001_ar: string = "اختيار وظيفة ملاحة";
    // HTML_TXT_0030 : デリゲーション切替機能説明
    public DELEGATION_002_ar: string = "بعض أجهزة In-Car-Device بها وظائف ملاحة متعددة.اختر وظيفة ملاحة لتستخدمها.<br/><br/>*يمكنك اختيار وظيفة الملاحة المستخدمة عند ضبط وجهة باستخدام تطبيق In-Car-Device.";
    // ????????????? : デリゲーション画面タイトル
    public DELEGATION_003_ar: string = "";
    // HTML_TXT_0029 : デリゲーション画面説明
    public DELEGATION_004_ar: string = "اختيار وظيفة ملاحة";
    // ----- 既存のMoreタブ -------<
    // ----- Harman OTA 対応 ----->
    // SL_TXT_0206とSL_TXT_0221の代わりに作成。
    public OTHER_SIZE_0001_ar: string = "الحجم: ";
	public TXT_YELP_0029_ar: string = "حدث خطأ. يرجى إعادة المحاولة لاحقاً.";
	public SL_TXT_0155_ar: string = " إصدار ";
	public SL_TXT_0189_ar: string = "تم التحديث في *";
	public SL_TXT_0191_ar: string = "تاريخ انتهاء الصلاحية: ";
	public SL_TXT_0192_ar: string = "إعدادات تحديث الخريطة";
	public SL_TXT_0193_ar: string = "يمكن حفظ بيانات خريطة In-Car-Device مؤقتاً على هاتفك الذكي من خادم توزيع الخرائط. يمكنك تحديث الخريطة في المرة التالية التي تقوم فيها بالاتصال بـ In-Car-Device.";
	public SL_TXT_0196_ar: string = "إعدادات التحديث";
	public SL_TXT_0197_ar: string = "تحقق من التحديث التلقائي";
	public SL_TXT_0198_ar: string = "شبكة خلوية";
	public SL_TXT_0199_ar: string = "معلومات التحديث";
	public SL_TXT_0200_ar: string = "تحميل الكل";
	public SL_TXT_0201_ar: string = "لم يتم تحديث In-Car-Device";
	public SL_TXT_0202_ar: string = "لم يكتمل التحميل";
	public SL_TXT_0203_ar: string = "تم تحديث In-Car-Device";
	public SL_TXT_0204_ar: string = "خريطة: ";
	public SL_TXT_0205_ar: string = "إصدار: ";
	// SL_TXT_0206 ※OTHER_SIZE_0001_arを利用　宣言のみ
	public SL_TXT_0206_ar: string = "الحجم: *KB";
	// SL_TXT_0207 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0207_ar: string = "المساحة المتاحة على الهاتف الذكي غير كافية.";
	public SL_TXT_0208_ar: string = "قم بضبط الموقع بواسطة In-Car-Device. للتفاصيل اضغط الزر OK.";
	public SL_TXT_0209_ar: string = "انتهت صلاحية اشتراكك في MapCare. يرجى زيارة الموقع www.subaru-maps.com لتحديث الاشتراك.";
	// SL_TXT_0210 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0210_ar: string = "بيانات الخريطة هذه تتجاوز 30 MB. يرجى إعادة التحميل مرة أخرى بعد التأكد من اتصال Wi-Fi.";
	// SL_TXT_0211 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0211_ar: string = "قم بتحديث الخريطة عن طريق توصيل In-Car-Device بالهاتف الذكي. بعد تحديث In-Car-Device، سيتم حذف بيانات الخريطة تلقائياً من الهاتف الذكي.";
	public SL_TXT_0212_ar: string = "إذا قمت بضبط الشبكة الخلوية على ON، يمكنك تحميل بيانات الخريطة عندما يكون Wi-Fi مضبوطاً على OFF.";
	public SL_TXT_0213_ar: string = "يمكن بشكل مؤقت حفظ بيانات خريطة In-Car-Device تلقائياً على هاتفك الذكي وذلك عن طريق ضبط التحقق من التحديث التلقائي على ON‏.\n*سيتم تطبيق رسوم البيانات.";
	// SL_TXT_0214 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0214_ar: string = "انقطع الاتصال بـ In-Car-Device. أعد المحاولة مرة أخرى بعد التأكد من الاتصال بـ In-Car-Device.";
	// SL_TXT_0215 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0215_ar: string = "مساحة التخزين المتاحة على  In-Car-Device غير كافية. أعد المحاولة مرة أخرى بعد التأكد من إعدادات  In-Car-Device.";
	// SL_TXT_0216 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0216_ar: string = "حدث خطأ أثناء نقل البيانات. يرجى إعادة المحاولة مرة أخرى لاحقاً.";
	// SL_TXT_0217 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0217_ar: string = "حدث خطأ أثناء تحميل بيانات الخريطة من الخادم. يرجى إعادة المحاولة مرة أخرى لاحقاً.";
	// SL_TXT_0218 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0218_ar: string = "مساحة التخزين المتاحة على الهاتف الذكي غير كافية. أعد المحاولة مرة أخرى بعد حذف بيانات من هاتفك الذكي.";
	// SL_TXT_0219 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0219_ar: string = 'استخدم Wi-Fi للاتصال. أو قم بضبط "الشبكة الخلوية" على "ON" في شاشة إعدادات التحديث وقم بالتحميل باستخدام بيانات الشبكة الخلوية.<br/>*بيانات الخريطة التي تتجاوز 30 MB لا يمكن تحميلها باستخدام بيانات الشبكة الخلوية.';
	// SL_TXT_0220 ※スマホ側にて使用。こちらは定義値のみ宣言
	public SL_TXT_0220_ar: string = "انقطع الاتصال مع الخادم. أعد المحاولة مرة أخرى بعد التأكد من بيئة الاتصالات.";
	// SL_TXT_0221 ※OTHER_SIZE_0001_arを利用　宣言のみ
	public SL_TXT_0221_ar: string = "الحجم: *MB";

    // ----- Harman OTA 対応 -----<
}
