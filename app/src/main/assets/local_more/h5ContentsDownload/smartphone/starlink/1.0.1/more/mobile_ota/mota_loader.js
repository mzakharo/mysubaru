'use strict';

var MOtaLoader = MOtaLoader || {};
var HarmanOTA = HarmanOTA || {};

var SenarioFileId = [
	'dl_transfer_map', 'dl_transfer_list',
	'002', '003', '004', '005',
	'002_gen3',
	'gen3.1_installing',
	'cancel_dl_onVehicle_Gen3',
	'cancel_transfer_onVehicle_Gen3',
	'disconnect_onProgress_Gen3', 'disconnect_onProgress_Gen4','disconnect_after_download',
	'redmine_8987', 'redmine_9150', 'redmine_9174', 'redmine_9196', 'redmine_9249', 'redmine_9255',
	'NonSelectProgress_DL', 'NonSelectProgress_TR',
	'redmine_9589',
	'dl_transfer_map_europe', 'dl_transfer_map_oceania', 'dl_map',
];

MOtaLoader.loadGen3 = function (callback) {
    console.log("[I][mota_loader][loadGen3]start");
	var loadQue = [];
	var url = 'url';
	if (HarmanOTA.useStubVehicleInfo) {
		// [ota] for pc debug

		// hook lib
		loadQue.push({ url: '../pc_debug/js/map_dl_simulator.js' });
		loadQue.push({ url: '../pc_debug/js/map_dl_senario_manager.js' });
		for (var i = 0; i < SenarioFileId.length; i++) {
			loadQue.push({ url: '../pc_debug/js/map_dl_senario_' + SenarioFileId[i] + '.js' });
		}

	} else {
		// for server
	}
	// load lib

	MOtaLoader.load(loadQue, callback);
    console.log("[I][mota_loader][loadGen3]end");
};

MOtaLoader.loadGen4 = function (callback) {
    console.log("[I][mota_loader][loadGen4]start");
	var loadFunc = function () {
			
		var loadQue = [];
		var url = 'url';

		loadQue.push({ url: './css/mobile_ota_ui_gen4.css' });

		if (HarmanOTA.useStubVehicleInfo) {
			// hook lib
			loadQue.push({ url: '../../../pc_debug/js/map_dl_simulator.js' });
			loadQue.push({ url: '../../../pc_debug/js/map_dl_senario_manager.js' });
			for (var i = 0; i < SenarioFileId.length; i++) {
				loadQue.push({ url: '../../../pc_debug/js/map_dl_senario_' + SenarioFileId[i] + '.js' });
			}
			loadQue.push({ url: '../../../pc_debug/js/multilingual_simulator.js' });
			loadQue.push({ url: '../../../pc_debug/js/multilingual_senario_popup.js' });
			loadQue.push({ url: '../../../pc_debug/js/multilingual_senario_pagemovement.js' });

		}

		// load lib
		loadQue.push({ url: '../../../common/js/mwsRequestManager-1.0.2.js' });
		loadQue.push({ url: '../../js/smt.word.js' });
		loadQue.push({ url: '../../js/config.js' });
		loadQue.push({ url: '../../js/harman_ota_common.js' });
		loadQue.push({ url: '../../js/harman_ota_ui.js' });
		loadQue.push({ url: '../../js/harman_ota_controller.js' });
		loadQue.push({ url: './js/mobile_ota_common_gen4.js' });
		loadQue.push({ url: './js/mobile_ota_controller_gen4.js' });
		loadQue.push({ url: './js/mobile_ota_ui_gen4.js' });
		MOtaLoader.load(loadQue, callback);
	}

	// 共通処理読み込み
	MOtaLoader.loadBaseFile(loadFunc);
    console.log("[I][mota_loader][loadGen4]end");
};

/**
 * 共通で使用するファイルの読み込み後に車載機固有のファイルを読み込み
 * @param {*} callback 
 */
MOtaLoader.loadBaseFile = function (callback) {
	
	var loadQue = [];
	var url = 'url';
	// load lib
	loadQue.push({ url: '../common/css/css_library/jquery-ui.min.css' });
	loadQue.push({ url: 'https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css' });
	loadQue.push({ url: '../../css/harman_ota_ui.css' });
	loadQue.push({ url: 'https://code.jquery.com/jquery-1.12.4.min.js' });
	loadQue.push({ url: 'https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js' });
	loadQue.push({ url: '../../../common/js/microserver.js' });
	loadQue.push({ url: '../../js/aha_connect_sdk.js' });
	loadQue.push({ url: '../../js/harman_ota_sdk.js' });
	loadQue.push({ url: '../../js/smt.common.js' });
	loadQue.push({ url: '../../../pc_debug/js/mws.saemu.js' });

	MOtaLoader.load(loadQue, callback);
}

/**
 * 
 * @param {*} loadQue [{ 'url' : 'path' }, {...}]
 * @param {*} callback 
 */
MOtaLoader.load = function (loadQue, callback) {
    console.log("[I][mota_loader][load]start");
	if (callback == undefined || callback == null) {
        console.log("[E][mota_loader][load]callback error");
        console.log("[E][mota_loader][load]callback error loadQue.length = "+loadQue.length);
        for (var i=0; i < loadQue.length; i++) {
            console.log("[E][mota_loader][load]callback error loadQue["+i+"].url = "+loadQue[i].url);
        }
		callback = function () { };
	}
	try {
		var reqIndex = 0;
		var innerCallback = function () {
			reqIndex++;
			setTimeout(function () {
				reqFunc();
			}, 1);
		};

		var reqFunc = function () {
			if (reqIndex >= loadQue.length) {
				callback({ 'isSuccess': true });
				reqFunc = null;
				innerCallback = null;
                console.log("[I][mota_loader][load][reqFunc]end");
				return;
			}

			var queue = loadQue[reqIndex];
			if (queue.url.indexOf('.js') > -1) {
				MOtaLoader.loadScript(queue.url, innerCallback);
			} else if (queue.url.indexOf('.css') > -1) {
				MOtaLoader.loadCSS(queue.url, innerCallback);
			} else {
                console.log("[E][mota_loader][load][reqFunc]error queue.url = "+queue.url);
			}
		};

		reqFunc();

	} catch (error) {
		console.log("[E][mota_loader][load] catch error : "+error);
		setTimeout(function () {
			callback();
		}, 1);
	}
}

MOtaLoader.loadCSS = function (filePath, onloadCalback) {
	if (onloadCalback == undefined || onloadCalback == null) {
        console.log("[E][mota_loader][loadCSS]callback error");
		onloadCalback = function () { };
	}

	//ライブラリ読み込みスクリプト追加
	//このスクリプト非同期で読み込まれる（DOM読み込み、レンダリングは中断しない）

	// saloader.jsを必ずロードする前提なので、scriptタグの前にinsertする
	// var firstScript = document.getElementsByTagName('script')[0];
//	console.log("[I][mota_loader][loadCSS] filePath : " + filePath);
	var scripts = document.getElementsByTagName('script'), firstScript = scripts[scripts.length - 1];
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = filePath;
	try {
		firstScript.parentNode.insertBefore(link, firstScript);
		link.onload = onloadCalback;
	} catch (error) {
		console.log("[E][mota_loader][loadCSS] catch error "+error);
		setTimeout(function () {
			onloadCalback();
		}, 0);
	}
};

MOtaLoader.loadScript = function (filePath, onloadCalback) {
	if (onloadCalback == undefined || onloadCalback == null) {
        console.log("[E][mota_loader][loadScript]callback error");
		onloadCalback = function () { };
	}
	//ライブラリ読み込みスクリプト追加
	//このスクリプト非同期で読み込まれる（DOM読み込み、レンダリングは中断しない）

	// saloader.jsを必ずロードする前提なので、scriptタグの前にinsertする
	// var firstScript = document.getElementsByTagName('script')[0];
//	console.log("[I][mota_loader][loadScript] filePath : " + filePath);
	var scripts = document.getElementsByTagName('script'), firstScript = scripts[scripts.length - 1];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = filePath;
	try {
		firstScript.parentNode.insertBefore(script, firstScript);
		script.onload = onloadCalback;
	} catch (error) {
		console.log("[E][mota_loader][loadScript] catch error "+error);
		setTimeout(function () {
			onloadCalback();
		}, 0);
	}
};