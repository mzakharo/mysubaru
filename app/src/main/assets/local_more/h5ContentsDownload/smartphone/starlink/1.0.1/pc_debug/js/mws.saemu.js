
(function () {
	HarmanOTA.useStubVehicleInfo = false;	// スタブデータを用いる場合はtrue
	HarmanOTA.useStubOnDevice = false;		// 実機でもスタブデータを使う場合はtrue

	if (!HarmanOTA.useStubVehicleInfo) {
		return;
	}

	var isLocalHost = !(location.href.indexOf('http:') > -1 || location.href.indexOf('https://') > -1);
	if (!isLocalHost) {
		// サーバ配置した際は無効とする
		// （万が一、本ファイルをロードしてしまっても大丈夫なように）
		return;
	}
	
	var MwsEmulator = MwsEmulator || {};
	var userAgent = window.navigator.userAgent.toLowerCase();
	MwsEmulator.DEBUG_CONST = {};
	MwsEmulator.DEBUG_CONST.PLATFORM_PC = 'pc';
	MwsEmulator.DEBUG_CONST.PLATFORM_IOS = 'ios';
	MwsEmulator.DEBUG_CONST.PLATFORM_ANDROID = 'android';
	MwsEmulator.debugPlatform = MwsEmulator.DEBUG_CONST.PLATFORM_PC;

	// 仕向け変更
	MwsEmulator.DEBUG_CONST_AREA = {};
	MwsEmulator.DEBUG_CONST_AREA.NORTH_AMERICA = "NorthAmerica";
	MwsEmulator.DEBUG_CONST_AREA.EUROPE = "Europe";
	MwsEmulator.DEBUG_CONST_AREA.OCEANIA = "Oceania";
	MwsEmulator.debugSelectedArea = MwsEmulator.DEBUG_CONST_AREA.NORTH_AMERICA;   //デバッグモードで仕向けを変える場合はここを変更
	
	
	function checkIPhoneAgent() {
		var targets = ['iphone', 'iPhone'];
		return checkAgent(targets);
	}
	
	function checkAndroidAgent() {
		var targets = ['android', 'Android'];
		return checkAgent(targets);
	}
	
	function checkAgent(targets) {
		for (var i = 0; i < targets.length; i++) {
			var key = targets[i];
			if (userAgent.indexOf(key) > -1) {
				return true;
			}
		}
		return false;
	}
	
	if (checkIPhoneAgent()) {
		MwsEmulator.debugPlatform = MwsEmulator.DEBUG_CONST.PLATFORM_IOS;
	} else if (checkAndroidAgent()) {
		MwsEmulator.debugPlatform = MwsEmulator.DEBUG_CONST.PLATFORM_ANDROID;
	}

	if (!HarmanOTA.useStubOnDevice) {
		// スマホ実機の場合は使わない
		if (MwsEmulator.debugPlatform != MwsEmulator.DEBUG_CONST.PLATFORM_PC) {
			// 実機の場合は使わない
			return;
		}			
	}

	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('**********************************************************************');
	console.log('*************************    use Emulator    *************************');
	console.log('**********************************************************************');
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');

	var LOG_TAG = '### mws.sa_emu ###   :   ';
	function mws_sa_consolelog(message) {
		console.log(LOG_TAG + message);
	};
	
	var ResponseTime = 500;
	var appVersion = window.navigator.appVersion.toLowerCase();
		
	mws_sa_consolelog(userAgent);
	mws_sa_consolelog(appVersion);
	
	function getLocalStorage(key) {
		return localStorage.getItem(key);
	};
	
	function setLocalStorage(key, value) {
		if (value == null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	};
	
	function setUpDebugMRMInfo() {
		try {
			localStorage.setItem(mwsRequestManager.KEY_HTTP_PORT, 8008);
			if (MwsEmulator.debugPlatform != MwsEmulator.DEBUG_CONST.PLATFORM_PC) {
				localStorage.setItem(mwsRequestManager.KEY_HTTPS_PORT, -1);
				localStorage.setItem(mwsRequestManager.KEY_ENABLED_HTTPS, mwsRequestManager.FALSE_FLAG);
				mwsRequestManager.MWS_HTTPS_PORT = -1;
				mwsRequestManager.enabledHttps = false;
			} else {
				localStorage.setItem(mwsRequestManager.KEY_HTTPS_PORT, 8443);
				localStorage.setItem(mwsRequestManager.KEY_ENABLED_HTTPS, mwsRequestManager.TRUE_FLAG);
				mwsRequestManager.MWS_HTTPS_PORT = 8443;
				mwsRequestManager.enabledHttps = true;
			}
	
			mwsRequestSample();
		}
		catch (e) {
		}
	}
	
	// デバッグ用設定
	//	setLocalStorage('smtemu_debug', true);
	setLocalStorage('smtemu_debug', null);
	setLocalStorage('mwsemu_debug', true);
	setUpDebugMRMInfo();
	
	var g_accessoryConnected = false;
	
	try {
		var microserver = UIEMicroserver.getInstance();
		microserver.getLocalServerPort = (function () {
			var context = microserver;
			var original = microserver.getLocalServerPort;
	
			return function (callback) {
				setTimeout(function () {
					setUpDebugMRMInfo();
					callback.call(mwsRequestManager, 8008);
				}, 500);
			};
		})();
	
		microserver.getStatus = (function () {
			var context = microserver;
			var original = microserver.getStatus;
	
			return function (callback) {
				setTimeout(function () {
					callback.call(mwsRequestManager, g_accessoryConnected ? UIEMicroserver.CONNECTED : UIEMicroserver.DISCONNECTED);
				}, 500);
			};
		})();
	}
	catch (e) {
	}
	
	// [ota] for pc debug
	var harmanOTASettings = harmanOTASettings || {};
	
	// [ota] for pc debug
	var g_responseJson = {};
	
	(function (MwsEmu) {
		'use strict';
	
		var context = {};
		context.sendlocation = {};
	
		MwsEmu.init = function () { };
	
		MwsEmu.getDummyContacts = function () {
			return g_responseJson.contact;
		};
	
		MwsEmu.postSuccess = function (options, data, textStatus, jqXHR) {
			mws_sa_consolelog("ajax wrapper : success : " + options.url);
			if (options.success != undefined) {
				options.success(data, textStatus, jqXHR);
			}
			setTimeout(function () {
				MwsEmu.postComplete(options, true, jqXHR, textStatus);
			}, 1);
		};
	
		MwsEmu.postError = function (options, jqXHR, error, errorThrown) {
			mws_sa_consolelog("ajax wrapper : error : " + options.url);
			if (options.error != undefined) {
				options.error(jqXHR, error, errorThrown);
			}
			setTimeout(function () {
				MwsEmu.postComplete(options, false, jqXHR, error);
			}, 1);
		};
	
		MwsEmu.postComplete = function (options, result, jqXHR, textStatus) {
			mws_sa_consolelog("ajax wrapper : complete : " + options.url);
			if (options.complete != undefined) {
				options.complete(jqXHR, textStatus);
			}
	
			if (options.mwsDeferred != undefined) {
				if (result) {
					options.mwsDeferred.resolve(jqXHR, textStatus);
				} else {
					options.mwsDeferred.reject(jqXHR, textStatus);
				}
			}
		};
	
		MwsEmu.postException = function (options, message) {
			mws_sa_consolelog("ajax wrapper : exception : " + message);
			mws_sa_consolelog("ajax wrapper : exception : " + options.url);
			// throw '### Mws Extend Module Not Implement. ### ' + options.url;
		};
	
		MwsEmu.Kvs = function (options) {
	
			var key = options.url.split('/kvs/')[1];
			// KVS読み書き
			if (options.type == 'GET' || options.type == 'get') {
				// read
				var data = getLocalStorage(key);
				if (data == null) {
					MwsEmu.postError(options, { status: 404 }, {}, {});
				} else {
					MwsEmu.postSuccess(options, data, {}, { responseText: '' + data });
				}
			} else if (options.type == 'POST' || options.type == 'post') {
				// write
				try {
					setLocalStorage(key, options.data);
				} catch (error) {
					try {
						setLocalStorage(key, options.data);
					} catch (error) {
						MwsEmu.postError(options, {}, {}, {});
						return;
					}
				}
				MwsEmu.postSuccess(options, {}, {}, {});
			}
		};
	
		MwsEmu.searchContacts = function (options) {
			var data = MwsEmulator.getDummyContacts();
			MwsEmu.postSuccess(options, JSON.parse(data), {}, { responseText: '' + data });
		};
	
		MwsEmu.sendLocation = function (options) {
			if (options.data.indexOf('cmd=setting') > -1) {
				var data = { return_cd: 'M001I' };
				MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
			} else if (options.data.indexOf('cmd=regist_glympse_task') > -1) {
				var paramKeyValue = options.data.split('&');
				var paramJson = {};
				for (var i = 0; i < paramKeyValue.length; i++) {
					var pair = paramKeyValue[i].split('=');
					if (pair[0].indexOf('url_end') > -1) {
						context.sendlocation.endUrl = decodeURIComponent(pair[1]);
					}
					paramJson[pair[0]] = pair[1];
				}
				paramJson.task_id = '4160cbc198056cadb850d518f1320db3';
				context.sendlocation.info = paramJson;
	
				var data = {
					return_cd: 'M001I',
					task_id: paramJson.task_id
				};
				MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
			} else if (options.data.indexOf('cmd=update_glympse_task') > -1) {
	
				var paramKeyValue = options.data.split('&');
				var paramJson = {};
				for (var i = 0; i < paramKeyValue.length; i++) {
					var pair = paramKeyValue[i].split('=');
					context.sendlocation.info[pair[0]] = pair[1];
				}
	
				var data = {
					return_cd: 'M001I',
				};
				MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
			} else if (options.data.indexOf('cmd=remove_task') > -1) {
				$.ajax({
					url: context.sendlocation.endUrl,
					success: function () {
						var data = {
							return_cd: 'M001I'
						};
						MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
					},
					error: function () {
						var data = {
							return_cd: 'M001E'
						};
						MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
					},
					complete: function () {
						context.sendlocation.info = undefined;
					}
				});
			} else if (options.data.indexOf('cmd=task_info') > -1) {
	
				var data = {
					return_cd: 'M001I',
					result: []
				};
				if (context.sendlocation.info != undefined) {
					data.result.push(context.sendlocation.info);
				}
				MwsEmu.postSuccess(options, data, {}, { responseText: '' + JSON.stringify(data) });
			} else {
				MwsEmulator.postException(options, 'not implements.');
			}
		};
	
		MwsEmu.timestamp = function (options) {
			// 月末に使う場合は注意
			// "2016-09-14T07:51:34+0900"
			var nowDate = new Date();
			var data = ('0000' + nowDate.getFullYear()).slice(-4) + '-' +
				('00' + (nowDate.getMonth() + 1)).slice(-2) + '-' +
				('00' + nowDate.getDate()).slice(-2) + 'T' +
				('00' + nowDate.getHours()).slice(-2) + ':' +
				('00' + nowDate.getMinutes()).slice(-2) + ':' +
				('00' + nowDate.getSeconds()).slice(-2) + '+0900';
			MwsEmu.postSuccess(options, data, {}, { responseText: data });
		};
	
		MwsEmu.country = function (options) {
			var data = {
				"return_cd": "M001I",
				"country": "JP",
				"language": "ja",
				"locale": "ja_JP",
			}
	
			MwsEmu.postSuccess(options, data, {}, { responseText: JSON.stringify(data) });
		};
	
		MwsEmu.getAppinfo = function (options) {
			var data = g_responseJson.getAppinfo;
			MwsEmu.postSuccess(options, data, {}, { responseText: JSON.stringify(data) });
		};
	
		MwsEmu.getStorageInfo = function (options) {
			var data = g_responseJson.getStorageInfo;
			MwsEmu.postSuccess(options, data, {}, { responseText: JSON.stringify(data) });
		};
	
		MwsEmu.gps = function (options) {
			var data = g_responseJson.gps;
			MwsEmu.postSuccess(options, data, {}, { responseText: JSON.stringify(data) });
		};
	
		MwsEmu.Deferred = function (options) {
			options.mwsDeferred = $.Deferred();
			return options.mwsDeferred;
		}
	
	}(MwsEmulator));
	
	// hook ajax
	(function () {
		if (MwsEmulator.debugPlatform != MwsEmulator.DEBUG_CONST.PLATFORM_PC) {
			return;
		}
		if ($ == null) {
			return;
		}
		$.ajax = (function () {
			var context = $;
			var original = $.ajax;
	
			return function (options) {
				mws_sa_consolelog('ajax : ' + options.url);
				var deferred = null;
				var targetFunc = null;
				if (options.async) {
					deferred = MwsEmulator.Deferred(options);
				}
				if (options.url == null) {
				}
				else if (options.url.indexOf('/kvs/') > -1) {
					targetFunc = function () {
						MwsEmulator.Kvs(options);
					};
				}
				else if (options.url.indexOf('192.168.1.1') > -1 ||
					options.url.indexOf('127.0.0.1') > -1) {
					targetFunc = function () {
						if (options.url.indexOf('search-contact-list') > -1) {
							MwsEmulator.searchContacts(options);
						} else if (options.url.indexOf('send-location') > -1) {
							MwsEmulator.sendLocation(options);
						} else if (options.url.indexOf('timestamp') > -1) {
							MwsEmulator.timestamp(options);
						} else if (options.url.indexOf('country') > -1) {
							MwsEmulator.country(options);
						} else if (options.url.indexOf('show-log') > -1) {
							MwsEmulator.showLog(options);
						} else if (options.url.indexOf('get-appinfo') > -1) {
							MwsEmulator.getAppinfo(options);
						} else if (options.url.indexOf('get-storage-info') > -1) {
							MwsEmulator.getStorageInfo(options);
						} else if (options.url.indexOf('gps') > -1) {
							MwsEmulator.gps(options);
						} else if (options.url.indexOf('yyyyyy') > -1) {
						} else {
							MwsEmulator.postException(options, 'not implements.');
						}
					};
				}
				if (targetFunc != null) {
					if (options.async) {
						setTimeout(targetFunc, ResponseTime);
						return deferred.promise();
					} else {
						targetFunc(options);
					}
				} else {
					return original.call(context, options);
				}
			};
		})();
	}());
	
	// hook xhr
	(function () {
		if (MwsEmulator.debugPlatform != MwsEmulator.DEBUG_CONST.PLATFORM_PC) {
			return;
		}
		var hookApis = [];
	
		hookApis.push({
			key: 'show-log',
			getResponseJson: function () {
				return {
					"return_cd": "M001I",
					"log_interval": 2000,
				};
			}
		});
		hookApis.push({
			key: 'get-appinfo',
			getResponseJson: function () {
				return g_responseJson.getAppinfo;
			}
		});
		hookApis.push({
			key: 'get-storage-info',
			getResponseJson: function () {
				return g_responseJson.getStorageInfo;
			}
		});
		var tmp_xhrInst = null;
		var xhrUrl = null;
		var originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function () {
			xhrUrl = arguments[1];
			tmp_xhrInst.dummy.open.apply(tmp_xhrInst.dummy, arguments);
			originalOpen.apply(tmp_xhrInst, arguments);
		};
	
		var originalSend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function () {
			var xhrInst = tmp_xhrInst;
			xhrInst.timeout = 500;
			var xhrDummy = {};
			var orgCallback = xhrInst.onreadystatechange;
			if (orgCallback == undefined) {
				orgCallback = function () {
					mws_sa_consolelog('dummy "onreadystatechange"');
				};
			}
	
			var apiLen = hookApis.length;
			var api = null;
			var tmpApi = null;
			for (var i = 0; i < apiLen; i++) {
				tmpApi = hookApis[i];
				if (xhrUrl.indexOf(tmpApi.key) > -1) {
					api = tmpApi;
					tmpApi = null;
					break;
				}
			}
	
			if (api != null) {
				xhrInst.onreadystatechange = function () {
					if (this.readyState == 4) {
						xhrDummy.responseText = JSON.stringify(api.getResponseJson());
						xhrDummy.status = 200;
						xhrDummy.readyState = 4;	// done
						orgCallback(xhrDummy);
						xhrInst.onreadystatechange = function () {
							orgCallback(this);
						}
						xhrInst = null;
					} else {
						orgCallback(this);
					}
				};
			} else {
				xhrInst.onreadystatechange = function () {
					orgCallback(this);
				};
				mws_sa_consolelog('XMLHttpRequest : not implements');
			}
			originalSend.apply(xhrInst, arguments);
			xhrUrl = null;
		}; 
		var originalXhr = XMLHttpRequest;
		XMLHttpRequest = (function () {
			var XMLHttpRequest2 = function () {
				this.originalXhr = new originalXhr();
				tmp_xhrInst = this.originalXhr;
				tmp_xhrInst.dummy = this;
				return tmp_xhrInst;
			};
	
			XMLHttpRequest2.prototype.open = function () {
			};
	
			return XMLHttpRequest2;
		})();
	}());
	
	// [e2e] for pc debug
	(function () {
		var pid = 'QY9800AB99999541';
		setLocalStorage('current_pid/', pid);	// 16アルカス
		setLocalStorage(pid + '_e2e/', true);	// 16アルカス
	
		try {
			// Common.prototype.getAppList = function (pid, language) {
			Common.prototype.getAppList = (function () {
				var original = Common.prototype.getAppList;
				return function (pid, language) {
					return new DOMParser().parseFromString(g_responseJson.SA4carAppListXml, "text/xml");
				};
			})();
	
			Common.prototype.getPidLicenceList = (function () {
				var original = Common.prototype.getAppList;
				return function (pid, status) {
					return '';
				};
			})();
		} catch (error) {
			mws_sa_consolelog(error);
			return;
		}
	}());
	
	// [ota] for pc debug
	// hook native binder
	(function () {
		try {
			window.setupDebugOTASettings = function (emu_deviceCode, emu_productCode) {
				HarmanOTA.DEBUG_CONST = {};
				HarmanOTA.DEBUG_CONST.PLATFORM_PC = MwsEmulator.DEBUG_CONST.PLATFORM_PC;
				HarmanOTA.DEBUG_CONST.PLATFORM_IOS = MwsEmulator.DEBUG_CONST.PLATFORM_IOS;
				HarmanOTA.DEBUG_CONST.PLATFORM_ANDROID = MwsEmulator.DEBUG_CONST.PLATFORM_ANDROID;
				HarmanOTA.debugPlatform = MwsEmulator.debugPlatform;
				HarmanOTA.useStubSDK = HarmanOTA.useStubVehicleInfo && HarmanOTA.debugPlatform == HarmanOTA.DEBUG_CONST.PLATFORM_PC;
				HarmanOTA.useStubMultilingualTest = false; //多言語対応テストを行う場合はこちらもtrueに変更
				if (HarmanOTA.useStubMultilingualTest) {
					// 多言語テスト時は、スタブデータを使う
					HarmanOTA.useStubVehicleInfo = true;
				}
				HarmanOTA.useStubCountry = "JP";		//スタブデータ言語変更
				HarmanOTA.useStubLanguage = "ja";		//スタブデータ言語変更
				HarmanOTA.debugSelectedArea = MwsEmulator.debugSelectedArea;
	
				// setLocalStorage('mobile_ota_gen4', null);
				// setLocalStorage('launcher_user_area', null);
				// setLocalStorage('selected_area', null);
	
				HarmanOTA.stubVehicleSettings = {
					"auto_update_check": false,
					"mobile_data_connection": false,
					// "productCode": '3922623260',
					"productCode": emu_productCode,
					//"deviceCode": 299640001,	// QA
					// "deviceCode": '001540001',	// Direction.json
					"deviceCode": emu_deviceCode,
					"huModel": "CP1.01",	// Gen4
					//"huModel": "Gen3.1",	// Gen3
					"accessoryFlag": true,
				};
	
				HarmanOTA.debugFunc = {};
				HarmanOTA.debugFunc.postAccessoryConnect = function () {
					setTimeout(function () {
						try {
							g_accessoryConnected = true;
							UIEMicroserver.deferred_return("onEvent", UIEMicroserver.EV_TETHER_STATE, UIEMicroserver.CONNECTED);
						} catch (error) {
							console.log(error);
						}
					}, 0);
				};
	
				HarmanOTA.debugFunc.postAccessoryDisconnect = function () {
					setTimeout(function () {
						try {
							g_accessoryConnected = false;
							UIEMicroserver.deferred_return("onEvent", UIEMicroserver.EV_TETHER_STATE, UIEMicroserver.DISCONNECTED)
						} catch (error) {
							console.log(error);
						}
					}, 0);
				};
	
				HarmanOTA.debugFunc.postTransferMonitorTimeout = function () {
					setTimeout(function () {
						try {
							NativeEvent.onEvent(NativeEvent.TRANSFER_MONITOR_TIMEOUT, {});
						} catch (error) {
							console.log(error);
						}
					}, 0);
				};
	
				HarmanOTA.stubRetgetCurrentMapDetails = function () {
					switch (HarmanOTA.debugSelectedArea) {
						case MwsEmulator.DEBUG_CONST_AREA.NORTH_AMERICA:
							return HarmanOTA.stubRetgetCurrentMapDetails_NorthAmerica;
							break;
							
						case MwsEmulator.DEBUG_CONST_AREA.EUROPE:
							return HarmanOTA.stubRetgetCurrentMapDetails_Europe;
							break;
						
						case MwsEmulator.DEBUG_CONST_AREA.OCEANIA:
							return HarmanOTA.stubRetgetCurrentMapDetails_Oceania;
							break;
							
					}
				}

				HarmanOTA.stubMobileOtaSettings = {
					'notify_current_map_details': {
						"productCode": emu_productCode,
						"deviceCode": emu_deviceCode,
						'mapJson': {},
					},
					// 'help_shown' : 'true',
					'selected_regions': [
						// 階層1(MaxCount:2)
						{
							"productCode": emu_productCode,
							"deviceCode": emu_deviceCode,
							"errorCode": '0',
							'products': [
								// 階層2(MaxCount:1)
								{
									'supplierID': 28,
									'productID': 13977,
									'baselineID': 13977,
									'Regions': [
										// 階層3(MaxCount:100)
										{
											'regionID': 300,
											'fromVersion': 1,
										},
										{
											'regionID': 301,
											'fromVersion': 1,
										},
										{
											'regionID': 302,
											'fromVersion': 1,
										},
									]
								}
							]
						},
						{
							"productCode": emu_productCode,
							"deviceCode": emu_deviceCode,
							"errorCode": '0',
							'products': [
								// 階層2(MaxCount:1)
								{
									'supplierID': 28,
									'productID': 13977,
									'baselineID': 13977,
									'Regions': [
										// 階層3(MaxCount:100)
										{
											'regionID': 303,
											'fromVersion': 1,
										},
										{
											'regionID': 304,
											'fromVersion': 1,
										},
										{
											'regionID': 305,
											'fromVersion': 1,
										},
									]
								}
							]
						},
					],
				};
	
				HarmanOTA.stubRetcheckForUpdate = {
					"deviceCode": "",
					"productCode": "",
					"errorCode": 0,
					"products": [
						{
							"supplierID": 28,
							"id": 272294,
							"versionID": 0,
							"baselineID": 11916,
							"name": "North America",
							"Regions": [
								// {
								//     "regionID": 298,
								//     "regionName": "Alabama (USA2)",
								//     "fromVersion": 1,
								//     "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
								//     "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferInProgress,
								//     "Updates": [{
								//         "operation": 0,
								//         "size": 77828,
								//         "name": "2016.06 Update 1",
								//         "toVersion": 2,
								//         "type": 0
								//     }]
								// },{
								//     "regionID": 299,
								//     "regionName": "Alabama (USA1)",
								//     "fromVersion": 1,
								//     "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadInProgress,
								//     "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
								//     "Updates": [{
								//         "operation": 0,
								//         "size": 77828,
								//         "name": "2016.06 Update 1",
								//         "toVersion": 2,
								//         "type": 0
								//     }]
								// },
	
								{
									"regionID": 300,
									"regionName": "Alabama (USA)",
									"fromVersion": 1,
									"downloadStatus": 9, //AhaConnectSDK_DownloadStatus.NotDownloaded
									"accessoryTransferStatus": 0, //AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid
									"Updates": [{
										"operation": 0,
										"size": 77828,
										"name": "2016.06 Update 1",
										"toVersion": 2,
										"type": 0
									}]
								},
								//{
								//    "regionID": 111,
								//    "regionName": "Saitama (JAPAN)",
								//    "fromVersion": 5,
								//    "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
								//    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferCompleted,
								//    "Updates": []
								//},
								{
									"regionID": 301,
									"regionName": "Alaska (USA)",
									"fromVersion": 1,
	
									//"downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
									"downloadStatus": 9, //AhaConnectSDK_DownloadStatus.NotDownloaded
									"accessoryTransferStatus": 0, //AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid
									"Updates": [{
										"operation": 0,
										"size": 4060,
										"name": "2016.06 Update",
										"toVersion": 1,
										"type": 1
									},
									{
										"operation": 0,
										"size": 999999999,
										"name": "2016.06 Update - 3",
										"toVersion": 3,
										"type": 1
									},
									{
										"operation": 0,
										"size": 173015040,
										"name": "2016.06 Update",
										"toVersion": 2,
										"type": 1
									}]
	
								},
								/* データが重複するので削除します ******************************************************************************************************
								{
									"regionID": 302,
									"regionName": "Arizona (USA)",
									"fromVersion": 1,
									"Updates": []
								},
								{
									"regionID": 303,
									"regionName": "Arkansas (USA)",
									"fromVersion": 1,
								},
								******************************************************************************************************/
								//{
								//    "regionID": 222,
								//    "regionName": "New York (USA)",
								//    "fromVersion": 2,
								//    "downloadStatus": AhaConnectSDK_DownloadStatus.NotDownloaded,
								//    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
								//    "Updates": [{
								//        "operation": 0,
								//        "size": 1024,
								//        "name": "2016.06 Update 1",
								//        "toVersion": 1,
								//        "type": 0
								//    },
								//    {
								//        "operation": 0,
								//        "size": 2048,
								//        "name": "2016.06 Update 2",
								//        "toVersion": 2,
								//        "type": 0
								//    },
								//    {
								//        "operation": 0,
								//        "size": 3072,
								//        "name": "2016.06 Update 3",
								//        "toVersion": 3,
								//        "type": 0
								//    }]
								//},
								//{
								//    "regionID": 444,
								//    "regionName": "California (USA)",
								//    "fromVersion": 1,
								//    "downloadStatus": AhaConnectSDK_DownloadStatus.DownloadCompleted,
								//    "accessoryTransferStatus": AhaConnectSDK_AccessoryTransferStatus.TransferStateInvalid,
								//    "Updates": [{
								//        "operation": 0,
								//        "size": 1024,
								//        "name": "2016.06 Update 1",
								//        "toVersion": 1,
								//        "type": 0
								//    },
								//    {
								//        "operation": 0,
								//        "size": 2048,
								//        "name": "2016.06 Update 2",
								//        "toVersion": 2,
								//        "type": 0
								//    },
								//    {
								//        "operation": 0,
								//        "size": 3072,
								//        "name": "2016.06 Update 3",
								//        "toVersion": 3,
								//        "type": 0
								//    }]
								//}
								//↓↓ iOSのcheckForUpdateからデータ引き上げ ↓↓
								{
									"Updates": [
										{
											"operation": 0,
											"size": 49165616,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "California",
									"regionID": 304,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 7313848,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Colorado",
									"regionID": 305,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 3737316,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Connecticut",
									"regionID": 306,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 59428,
											"toVersion": 23,
											"name": "2017.03 Update 22",
											"type": 0
										}
									],
									"regionName": "Delaware",
									"regionID": 307,
									"downloadStatus": 9,
									"fromVersion": 15
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 340008,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "District of Columbia",
									"regionID": 308,
									"downloadStatus": 9,
									"fromVersion": 16
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 24332100,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Florida",
									"regionID": 309,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 208228,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Georgia",
									"regionID": 310,
									"downloadStatus": 9,
									"fromVersion": 28
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 824608,
											"toVersion": 24,
											"name": "2017.03 Update 23",
											"type": 0
										}
									],
									"regionName": "Idaho",
									"regionID": 312,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 10017576,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Illinois",
									"regionID": 313,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 179416,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Iowa",
									"regionID": 315,
									"downloadStatus": 9,
									"fromVersion": 14
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 2058060,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Kansas",
									"regionID": 316,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 2999340,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Kentucky",
									"regionID": 317,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1331320,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Louisiana",
									"regionID": 318,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 50588,
											"toVersion": 24,
											"name": "2017.03 Update 23",
											"type": 0
										}
									],
									"regionName": "Maine",
									"regionID": 319,
									"downloadStatus": 9,
									"fromVersion": 20
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 557912,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Massachusetts",
									"regionID": 321,
									"downloadStatus": 9,
									"fromVersion": 20
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 3001332,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Michigan",
									"regionID": 322,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 5345396,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Minnesota",
									"regionID": 323,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1196900,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Mississippi",
									"regionID": 324,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 5190472,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Missouri",
									"regionID": 325,
									"downloadStatus": 9,
									"fromVersion": 1
	
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 796744,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Montana",
									"regionID": 326,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 3404,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Nebraska",
									"regionID": 327,
									"downloadStatus": 9,
									"fromVersion": 28
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 2157880,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Nevada",
									"regionID": 328,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 297684,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "New Hampshire",
									"regionID": 329,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1708076,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "New Jersey",
									"regionID": 330,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1035496,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "New Mexico",
									"regionID": 331,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 16750616,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "New York",
									"regionID": 332,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1743004,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "North Carolina",
									"regionID": 333,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 601984,
											"toVersion": 23,
											"name": "2017.03 Update 22",
											"type": 0
										}
									],
									"regionName": "North Dakota",
									"regionID": 334,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 9875252,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Ohio",
									"regionID": 335,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1818732,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Oregon",
									"regionID": 337,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 16209020,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Pennsylvania",
									"regionID": 338,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 621664,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Puerto Rico",
									"regionID": 339,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 468152,
											"toVersion": 23,
											"name": "2017.03 Update 22",
											"type": 0
										}
									],
									"regionName": "Rhode Island",
									"regionID": 340,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 5790660,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "South Carolina",
									"regionID": 341,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 6229560,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Tennessee",
									"accessoryTransferStatus": 0,
									"regionID": 343,
									"downloadStatus": 3,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 28105888,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Texas",
									"regionID": 344,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 1118236,
											"toVersion": 27,
											"name": "2017.03 Update 26",
											"type": 0
										}
									],
									"regionName": "Utah",
									"regionID": 345,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 35360,
											"toVersion": 26,
											"name": "2017.03 Update 25",
											"type": 0
										}
									],
									"regionName": "Vermont",
									"regionID": 346,
									"downloadStatus": 9,
									"fromVersion": 14
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 8373424,
											"toVersion": 29,
											"name": "2017.03 Update 28",
											"type": 0
										}
									],
									"regionName": "Virginia",
									"regionID": 348,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								{
									"Updates": [
										{
											"operation": 0,
											"size": 8509488,
											"toVersion": 28,
											"name": "2017.03 Update 27",
											"type": 0
										}
									],
									"regionName": "Washington",
									"regionID": 349,
									"downloadStatus": 9,
									"fromVersion": 1
								},
								/*
								{
								  "Updates" : [
					
								  ],
								  "regionName" : "Alabama",
								  "regionID" : 300,
								  "fromVersion" : 28
								},
								{
								  "Updates" : [
					
								  ],
								  "regionName" : "Alaska",
								  "regionID" : 301,
								  "fromVersion" : 8
								},
								*/
								{
									"Updates": [
	
									],
									"regionName": "Arizona",
									"regionID": 302,
									"fromVersion": 28
								},
								{
									"Updates": [
	
									],
									"regionName": "Arkansas",
									"regionID": 303,
									"fromVersion": 28
								},
								{
									"Updates": [
	
									],
									"regionName": "Hawaii",
									"regionID": 311,
									"fromVersion": 16
								},
								{
									"Updates": [
	
									],
									"regionName": "Indiana",
									"regionID": 314,
									"fromVersion": 28
								},
								{
									"Updates": [
	
									],
									"regionName": "Maryland",
									"regionID": 320,
									"fromVersion": 29
								},
								{
									"Updates": [
	
									],
									"regionName": "Oklahoma",
									"regionID": 336,
									"fromVersion": 23
								},
								{
									"Updates": [
	
									],
									"regionName": "South Dakota",
									"regionID": 342,
									"fromVersion": 28
								},
								{
									"Updates": [
	
									],
									"regionName": "US Virgin Islands",
									"regionID": 347,
									"fromVersion": 1
								}
							],
							"id": 272294,
							"versionID": 1,
							"baselineID": 11916,
							"supplierID": 28,
							"name": "North America"
						}
					]
					//↑↑ iOSのcheckForUpdateからデータ引き上げ ↑↑
				};
	

				//北米地域 ----------------------------------------------------------------------------
				HarmanOTA.stubRetgetCurrentMapDetails_NorthAmerica = {
					"status": 0,
					"deviceCode": "891167361",
					"productCode": "3122895924",
					"mapJson": {
						"used_map_space": 14452588,
						"available_map_space": -1,
						"timestamp": 574040779,
						"nds_product": [
							{
								"id": 4663057,
								"version_id": 1,
								"size": 14452588,
								"nds_region": [
									{
										"size": 232748,
										"id": 300,
										"version_id": 1,
										"state_iso": "AL",
										"name": "Alabama",
										"country_iso": "USA"
									},
									{
										"size": 67084,
										"id": 301,
										"version_id": 1,
										"state_iso": "AK",
										"name": "Alaska",
										"country_iso": "USA"
									},
									{
										"size": 228560,
										"id": 302,
										"version_id": 1,
										"state_iso": "AZ",
										"name": "Arizona",
										"country_iso": "USA"
									},
									{
										"size": 180980,
										"id": 303,
										"version_id": 1,
										"state_iso": "AR",
										"name": "Arkansas",
										"country_iso": "USA"
									},
									{
										"size": 851824,
										"id": 304,
										"version_id": 1,
										"state_iso": "CA",
										"name": "California",
										"country_iso": "USA"
									},
									{
										"size": 212388,
										"id": 305,
										"version_id": 1,
										"state_iso": "CO",
										"name": "Colorado",
										"country_iso": "USA"
									},
									{
										"size": 95088,
										"id": 306,
										"version_id": 1,
										"state_iso": "CT",
										"name": "Connecticut",
										"country_iso": "USA"
									},
									{
										"size": 35116,
										"id": 307,
										"version_id": 1,
										"state_iso": "DE",
										"name": "Delaware",
										"country_iso": "USA"
									},
									{
										"size": 22700,
										"id": 308,
										"version_id": 1,
										"state_iso": "DC",
										"name": "District of Columbia",
										"country_iso": "USA"
									},
									{
										"size": 564492,
										"id": 309,
										"version_id": 1,
										"state_iso": "FL",
										"name": "Florida",
										"country_iso": "USA"
									},
									{
										"size": 352852,
										"id": 310,
										"version_id": 1,
										"state_iso": "GA",
										"name": "Georgia",
										"country_iso": "USA"
									},
									{
										"size": 45464,
										"id": 311,
										"version_id": 1,
										"state_iso": "HI",
										"name": "Hawaii",
										"country_iso": "USA"
									},
									{
										"size": 102764,
										"id": 312,
										"version_id": 1,
										"state_iso": "ID",
										"name": "Idaho",
										"country_iso": "USA"
									},
									{
										"size": 409336,
										"id": 313,
										"version_id": 1,
										"state_iso": "IL",
										"name": "Illinois",
										"country_iso": "USA"
									},
									{
										"size": 237876,
										"id": 314,
										"version_id": 1,
										"state_iso": "IN",
										"name": "Indiana",
										"country_iso": "USA"
									},
									{
										"size": 161692,
										"id": 315,
										"version_id": 1,
										"state_iso": "IA",
										"name": "Iowa",
										"country_iso": "USA"
									},
									{
										"size": 169192,
										"id": 316,
										"version_id": 1,
										"state_iso": "KS",
										"name": "Kansas",
										"country_iso": "USA"
									},
									{
										"size": 193664,
										"id": 317,
										"version_id": 1,
										"state_iso": "KY",
										"name": "Kentucky",
										"country_iso": "USA"
									},
									{
										"size": 184916,
										"id": 318,
										"version_id": 1,
										"state_iso": "LA",
										"name": "Louisiana",
										"country_iso": "USA"
									},
									{
										"size": 84144,
										"id": 319,
										"version_id": 1,
										"state_iso": "ME",
										"name": "Maine",
										"country_iso": "USA"
									},
									{
										"size": 159100,
										"id": 320,
										"version_id": 1,
										"state_iso": "MD",
										"name": "Maryland",
										"country_iso": "USA"
									},
									{
										"size": 177084,
										"id": 321,
										"version_id": 1,
										"state_iso": "MA",
										"name": "Massachusetts",
										"country_iso": "USA"
									},
									{
										"size": 346876,
										"id": 322,
										"version_id": 1,
										"state_iso": "MI",
										"name": "Michigan",
										"country_iso": "USA"
									},
									{
										"size": 259500,
										"id": 323,
										"version_id": 1,
										"state_iso": "MN",
										"name": "Minnesota",
										"country_iso": "USA"
									},
									{
										"size": 152420,
										"id": 324,
										"version_id": 1,
										"state_iso": "MS",
										"name": "Mississippi",
										"country_iso": "USA"
									},
									{
										"size": 290764,
										"id": 325,
										"version_id": 1,
										"state_iso": "MO",
										"name": "Missouri",
										"country_iso": "USA"
									},
									{
										"size": 138592,
										"id": 326,
										"version_id": 1,
										"state_iso": "MT",
										"name": "Montana",
										"country_iso": "USA"
									},
									{
										"size": 121428,
										"id": 327,
										"version_id": 1,
										"state_iso": "NE",
										"name": "Nebraska",
										"country_iso": "USA"
									},
									{
										"size": 111048,
										"id": 328,
										"version_id": 1,
										"state_iso": "NV",
										"name": "Nevada",
										"country_iso": "USA"
									},
									{
										"size": 59332,
										"id": 329,
										"version_id": 1,
										"state_iso": "NH",
										"name": "New Hampshire",
										"country_iso": "USA"
									},
									{
										"size": 206908,
										"id": 330,
										"version_id": 1,
										"state_iso": "NJ",
										"name": "New Jersey",
										"country_iso": "USA"
									},
									{
										"size": 123712,
										"id": 331,
										"version_id": 1,
										"state_iso": "NM",
										"name": "New Mexico",
										"country_iso": "USA"
									},
									{
										"size": 442792,
										"id": 332,
										"version_id": 1,
										"state_iso": "NY",
										"name": "New York",
										"country_iso": "USA"
									},
									{
										"size": 352356,
										"id": 333,
										"version_id": 1,
										"state_iso": "NC",
										"name": "North Carolina",
										"country_iso": "USA"
									},
									{
										"size": 90428,
										"id": 334,
										"version_id": 1,
										"state_iso": "ND",
										"name": "North Dakota",
										"country_iso": "USA"
									},
									{
										"size": 358820,
										"id": 335,
										"version_id": 1,
										"state_iso": "OH",
										"name": "Ohio",
										"country_iso": "USA"
									},
									{
										"size": 193740,
										"id": 336,
										"version_id": 1,
										"state_iso": "OK",
										"name": "Oklahoma",
										"country_iso": "USA"
									},
									{
										"size": 178704,
										"id": 337,
										"version_id": 1,
										"state_iso": "OR",
										"name": "Oregon",
										"country_iso": "USA"
									},
									{
										"size": 416308,
										"id": 338,
										"version_id": 1,
										"state_iso": "PA",
										"name": "Pennsylvania",
										"country_iso": "USA"
									},
									{
										"size": 64080,
										"id": 339,
										"version_id": 1,
										"state_iso": "PR",
										"name": "Puerto Rico",
										"country_iso": "USA"
									},
									{
										"size": 34368,
										"id": 340,
										"version_id": 1,
										"state_iso": "RI",
										"name": "Rhode Island",
										"country_iso": "USA"
									},
									{
										"size": 190420,
										"id": 341,
										"version_id": 1,
										"state_iso": "SC",
										"name": "South Carolina",
										"country_iso": "USA"
									},
									{
										"size": 97524,
										"id": 342,
										"version_id": 1,
										"state_iso": "SD",
										"name": "South Dakota",
										"country_iso": "USA"
									},
									{
										"size": 310404,
										"id": 343,
										"version_id": 1,
										"state_iso": "TN",
										"name": "Tennessee",
										"country_iso": "USA"
									},
									{
										"size": 823052,
										"id": 344,
										"version_id": 1,
										"state_iso": "TX",
										"name": "Texas",
										"country_iso": "USA"
									},
									{
										"size": 117296,
										"id": 345,
										"version_id": 1,
										"state_iso": "UT",
										"name": "Utah",
										"country_iso": "USA"
									},
									{
										"size": 42772,
										"id": 346,
										"version_id": 1,
										"state_iso": "VT",
										"name": "Vermont",
										"country_iso": "USA"
									},
									{
										"size": 6176,
										"id": 347,
										"version_id": 1,
										"state_iso": "VI",
										"name": "US Virgin Islands",
										"country_iso": "USA"
									},
									{
										"size": 282692,
										"id": 348,
										"version_id": 1,
										"state_iso": "VA",
										"name": "Virginia",
										"country_iso": "USA"
									},
									{
										"size": 229444,
										"id": 349,
										"version_id": 1,
										"state_iso": "WA",
										"name": "Washington",
										"country_iso": "USA"
									},
									{
										"size": 112604,
										"id": 350,
										"version_id": 1,
										"state_iso": "WV",
										"name": "West Virginia",
										"country_iso": "USA"
									},
									{
										"size": 442580,
										"id": 351,
										"version_id": 1,
										"state_iso": "WI",
										"name": "Wisconsin",
										"country_iso": "USA"
									},
									{
										"size": 87664,
										"id": 352,
										"version_id": 1,
										"state_iso": "WY",
										"name": "Wyoming",
										"country_iso": "USA"
									},
									{
										"size": 8432,
										"id": 353,
										"version_id": 3,
										"state_iso": "GU",
										"name": "Guam",
										"country_iso": "USA"
									},
									{
										"size": 117156,
										"id": 380,
										"version_id": 1,
										"state_iso": "AB",
										"name": "Alberta",
										"country_iso": "CAN"
									},
									{
										"size": 124688,
										"id": 381,
										"version_id": 1,
										"state_iso": "BC",
										"name": "British Columbia",
										"country_iso": "CAN"
									},
									{
										"size": 51652,
										"id": 382,
										"version_id": 3,
										"state_iso": "MB",
										"name": "Manitoba",
										"country_iso": "CAN"
									},
									{
										"size": 41164,
										"id": 383,
										"version_id": 1,
										"state_iso": "NB",
										"name": "New Brunswick",
										"country_iso": "CAN"
									},
									{
										"size": 29640,
										"id": 384,
										"version_id": 3,
										"state_iso": "NT",
										"name": "Northwest Territories",
										"country_iso": "CAN"
									},
									{
										"size": 31668,
										"id": 385,
										"version_id": 1,
										"state_iso": "NL",
										"name": "Newfoundland and Labrador",
										"country_iso": "CAN"
									},
									{
										"size": 45688,
										"id": 386,
										"version_id": 1,
										"state_iso": "NS",
										"name": "Nova Scotia",
										"country_iso": "CAN"
									},
									{
										"size": 37872,
										"id": 387,
										"version_id": 3,
										"state_iso": "NU",
										"name": "Nunavut",
										"country_iso": "CAN"
									},
									{
										"size": 265216,
										"id": 388,
										"version_id": 1,
										"state_iso": "ON",
										"name": "Ontario",
										"country_iso": "CAN"
									},
									{
										"size": 12392,
										"id": 389,
										"version_id": 1,
										"state_iso": "PE",
										"name": "Prince Edward Island",
										"country_iso": "CAN"
									},
									{
										"size": 187440,
										"id": 390,
										"version_id": 1,
										"state_iso": "QC",
										"name": "Quebec",
										"country_iso": "CAN"
									},
									{
										"size": 53212,
										"id": 391,
										"version_id": 1,
										"state_iso": "SK",
										"name": "Saskatchewan",
										"country_iso": "CAN"
									},
									{
										"size": 12428,
										"id": 392,
										"version_id": 3,
										"state_iso": "YT",
										"name": "Yukon Territory",
										"country_iso": "CAN"
									},
									{
										"size": 128592,
										"id": 396,
										"version_id": 1,
										"state_iso": "BCN,BCS,SON",
										"name": "Baja California and Sonora",
										"country_iso": "MEX"
									},
									{
										"size": 83176,
										"id": 397,
										"version_id": 1,
										"state_iso": "CHH",
										"name": "Chihuahua",
										"country_iso": "MEX"
									},
									{
										"size": 90408,
										"id": 398,
										"version_id": 1,
										"state_iso": "COA,DUR",
										"name": "Durango and Coahuila",
										"country_iso": "MEX"
									},
									{
										"size": 132900,
										"id": 399,
										"version_id": 1,
										"state_iso": "NLE,TAM",
										"name": "Nuevo Leon and Tamaulipas",
										"country_iso": "MEX"
									},
									{
										"size": 70460,
										"id": 400,
										"version_id": 1,
										"state_iso": "NAY,SIN",
										"name": "Sinaloa and Nayarit",
										"country_iso": "MEX"
									},
									{
										"size": 180908,
										"id": 401,
										"version_id": 1,
										"state_iso": "AGU,JAL,ZAC",
										"name": "Mexico Central West",
										"country_iso": "MEX"
									},
									{
										"size": 390044,
										"id": 402,
										"version_id": 1,
										"state_iso": "CMX,GUA,HID,MEX,QUE,SLP",
										"name": "Ciudad de Mexico and Central Mexico",
										"country_iso": "MEX"
									},
									{
										"size": 159656,
										"id": 403,
										"version_id": 1,
										"state_iso": "COL,GRO,MIC,MOR",
										"name": "Michoacan and Guerrero",
										"country_iso": "MEX"
									},
									{
										"size": 247456,
										"id": 404,
										"version_id": 1,
										"state_iso": "OAX,PUE,TLA,VER",
										"name": "Mexico Central East",
										"country_iso": "MEX"
									},
									{
										"size": 123288,
										"id": 405,
										"version_id": 1,
										"state_iso": "CAM,CHP,ROO,TAB,YUC",
										"name": "Yucatan and Mexico East",
										"country_iso": "MEX"
									},
									{
										"size": 13908,
										"id": 420,
										"version_id": 1,
										"state_iso": "",
										"name": "Lesser Antilles",
										"country_iso": "BLM,GLP,MAF,MTQ,SXM"
									},
									{
										"size": 5636,
										"id": 425,
										"version_id": 1,
										"state_iso": "",
										"name": "Belize",
										"country_iso": "BLZ"
									},
									{
										"size": 23264,
										"id": 433,
										"version_id": 1,
										"state_iso": "",
										"name": "Costa Rica",
										"country_iso": "CRI"
									},
									{
										"size": 36676,
										"id": 434,
										"version_id": 1,
										"state_iso": "",
										"name": "Caribbean Islands",
										"country_iso": "ABW,AIA,ATG,BES,BHS,BMU,BRB,CUB,CUW,CYM,DMA,DOM,GRD,HTI,JAM,KNA,LCA,MSR,TCA,TTO,VCT,VGB"
									},
									{
										"size": 23956,
										"id": 438,
										"version_id": 1,
										"state_iso": "",
										"name": "El Salvador\/Honduras",
										"country_iso": "HND,SLV"
									},
									{
										"size": 26996,
										"id": 443,
										"version_id": 3,
										"state_iso": "",
										"name": "Guatemala",
										"country_iso": "GTM"
									},
									{
										"size": 15552,
										"id": 451,
										"version_id": 1,
										"state_iso": "",
										"name": "Nicaragua",
										"country_iso": "NIC"
									},
									{
										"size": 17252,
										"id": 452,
										"version_id": 1,
										"state_iso": "",
										"name": "Panama",
										"country_iso": "PAN"
									},
									{
										"size": 208148,
										"id": 906,
										"version_id": 1,
										"state_iso": "",
										"name": "International Waters",
										"country_iso": "XXX"
									}
								],
								"baseline_id": 14738,
								"supplier_id": 28,
								"name": "North America"
							}
						],
						"device_code": "891167361",
						"product_code": "3122895924"
					}
				};
				//↑ 北米地域 ----------------------------------------------------------------------------

				
				/**
				 * オセアニア
				 * 下記JSONより取得
				 * https://sdk.clarion.co.jp/attachments/download/21010/NaviService_Mapupdate_CurrentMapDetail_EU.json
				 */
				HarmanOTA.stubRetgetCurrentMapDetails_Europe = {
					"product_code": "3122895924",
					"device_code": "891169288",
					"mapJson": {
						"timestamp": 574122636,
						"used_map_space": 17004088,
						"available_map_space": -1,
						"nds_product": [
							{
								"id": 4597521,
								"baseline_id": 14736,
								"supplier_id": 28,
								"name": "Europe",
								"version_id": 1,
								"size": 17004088,
								"nds_region": [
									{
										"id": 100,
										"name": "Albania",
										"version_id": 1,
										"size": 33528,
										"country_iso": "ALB",
										"state_iso": ""
									},
									{
										"id": 102,
										"name": "Austria",
										"version_id": 1,
										"size": 301104,
										"country_iso": "AUT",
										"state_iso": ""
									},
									{
										"id": 104,
										"name": "Belarus",
										"version_id": 1,
										"size": 102180,
										"country_iso": "BLR",
										"state_iso": ""
									},
									{
										"id": 105,
										"name": "Belgium",
										"version_id": 1,
										"size": 267944,
										"country_iso": "BEL",
										"state_iso": ""
									},
									{
										"id": 106,
										"name": "Bosnia and Herzegovina",
										"version_id": 1,
										"size": 68948,
										"country_iso": "BIH",
										"state_iso": ""
									},
									{
										"id": 107,
										"name": "Bulgaria",
										"version_id": 1,
										"size": 131196,
										"country_iso": "BGR",
										"state_iso": ""
									},
									{
										"id": 108,
										"name": "Croatia",
										"version_id": 1,
										"size": 126948,
										"country_iso": "HRV",
										"state_iso": ""
									},
									{
										"id": 109,
										"name": "Cyprus",
										"version_id": 1,
										"size": 30936,
										"country_iso": "CYP",
										"state_iso": ""
									},
									{
										"id": 110,
										"name": "Czech",
										"version_id": 1,
										"size": 265832,
										"country_iso": "CZE",
										"state_iso": ""
									},
									{
										"id": 111,
										"name": "Denmark",
										"version_id": 1,
										"size": 177860,
										"country_iso": "DNK",
										"state_iso": ""
									},
									{
										"id": 112,
										"name": "Estonia",
										"version_id": 1,
										"size": 65972,
										"country_iso": "EST",
										"state_iso": ""
									},
									{
										"id": 113,
										"name": "Finland",
										"version_id": 1,
										"size": 464228,
										"country_iso": "FIN",
										"state_iso": ""
									},
									{
										"id": 114,
										"name": "France",
										"version_id": 1,
										"size": 2417828,
										"country_iso": "FRA,MCO",
										"state_iso": ""
									},
									{
										"id": 116,
										"name": "Germany",
										"version_id": 1,
										"size": 1867152,
										"country_iso": "DEU",
										"state_iso": ""
									},
									{
										"id": 117,
										"name": "Greece",
										"version_id": 1,
										"size": 240948,
										"country_iso": "GRC",
										"state_iso": ""
									},
									{
										"id": 119,
										"name": "Hungary",
										"version_id": 1,
										"size": 177788,
										"country_iso": "HUN",
										"state_iso": ""
									},
									{
										"id": 120,
										"name": "Iceland",
										"version_id": 1,
										"size": 37684,
										"country_iso": "ISL",
										"state_iso": ""
									},
									{
										"id": 121,
										"name": "Ireland",
										"version_id": 1,
										"size": 272388,
										"country_iso": "IRL",
										"state_iso": ""
									},
									{
										"id": 122,
										"name": "Italy",
										"version_id": 1,
										"size": 1489168,
										"country_iso": "ITA,SMR,VAT",
										"state_iso": ""
									},
									{
										"id": 125,
										"name": "Latvia",
										"version_id": 1,
										"size": 66588,
										"country_iso": "LVA",
										"state_iso": ""
									},
									{
										"id": 126,
										"name": "Lithuania",
										"version_id": 1,
										"size": 61240,
										"country_iso": "LTU",
										"state_iso": ""
									},
									{
										"id": 127,
										"name": "Luxembourg",
										"version_id": 1,
										"size": 25616,
										"country_iso": "LUX",
										"state_iso": ""
									},
									{
										"id": 128,
										"name": "Macedonia",
										"version_id": 1,
										"size": 64700,
										"country_iso": "MKD",
										"state_iso": ""
									},
									{
										"id": 129,
										"name": "Malta",
										"version_id": 1,
										"size": 9000,
										"country_iso": "MLT",
										"state_iso": ""
									},
									{
										"id": 130,
										"name": "Moldova",
										"version_id": 1,
										"size": 26660,
										"country_iso": "MDA",
										"state_iso": ""
									},
									{
										"id": 131,
										"name": "Montenegro",
										"version_id": 1,
										"size": 14516,
										"country_iso": "MNE",
										"state_iso": ""
									},
									{
										"id": 132,
										"name": "Norway",
										"version_id": 1,
										"size": 349844,
										"country_iso": "NOR",
										"state_iso": ""
									},
									{
										"id": 133,
										"name": "Poland",
										"version_id": 1,
										"size": 535328,
										"country_iso": "POL",
										"state_iso": ""
									},
									{
										"id": 134,
										"name": "Portugal",
										"version_id": 1,
										"size": 301484,
										"country_iso": "PRT",
										"state_iso": ""
									},
									{
										"id": 135,
										"name": "Romania",
										"version_id": 1,
										"size": 217556,
										"country_iso": "ROU",
										"state_iso": ""
									},
									{
										"id": 136,
										"name": "Serbia",
										"version_id": 1,
										"size": 103084,
										"country_iso": "SRB,XKS",
										"state_iso": ""
									},
									{
										"id": 137,
										"name": "Slovakia",
										"version_id": 1,
										"size": 134440,
										"country_iso": "SVK",
										"state_iso": ""
									},
									{
										"id": 138,
										"name": "Slovenia",
										"version_id": 1,
										"size": 102848,
										"country_iso": "SVN",
										"state_iso": ""
									},
									{
										"id": 139,
										"name": "Spain",
										"version_id": 1,
										"size": 1312924,
										"country_iso": "AND,ESP,GIB",
										"state_iso": ""
									},
									{
										"id": 140,
										"name": "Sweden",
										"version_id": 1,
										"size": 524296,
										"country_iso": "SWE",
										"state_iso": ""
									},
									{
										"id": 141,
										"name": "Switzerland",
										"version_id": 1,
										"size": 237560,
										"country_iso": "CHE,LIE",
										"state_iso": ""
									},
									{
										"id": 143,
										"name": "The Netherlands",
										"version_id": 1,
										"size": 406528,
										"country_iso": "NLD",
										"state_iso": ""
									},
									{
										"id": 144,
										"name": "Turkey",
										"version_id": 1,
										"size": 825892,
										"country_iso": "TUR",
										"state_iso": ""
									},
									{
										"id": 146,
										"name": "Ukraine",
										"version_id": 1,
										"size": 228324,
										"country_iso": "UKR",
										"state_iso": ""
									},
									{
										"id": 147,
										"name": "United Kingdom",
										"version_id": 1,
										"size": 1301468,
										"country_iso": "GBR",
										"state_iso": ""
									},
									{
										"id": 148,
										"name": "Faroe Islands",
										"version_id": 1,
										"size": 5288,
										"country_iso": "FRO",
										"state_iso": ""
									},
									{
										"id": 150,
										"name": "Caucasus",
										"version_id": 1,
										"size": 2484,
										"country_iso": "ARM,AZE,GEO",
										"state_iso": ""
									},
									{
										"id": 151,
										"name": "Greenland",
										"version_id": 1,
										"size": 7436,
										"country_iso": "GRL",
										"state_iso": ""
									},
									{
										"id": 180,
										"name": "Russia",
										"version_id": 1,
										"size": 1490120,
										"country_iso": "RUS",
										"state_iso": ""
									},
									{
										"id": 900,
										"name": "International Waters",
										"version_id": 1,
										"size": 108312,
										"country_iso": "XXX",
										"state_iso": ""
									}
								]
							}
						],
						"product_code": "3122895924",
						"device_code": "891169288",
					}
				};
				//↑ ヨーロッパ ----------------------------------------------------------------------------

				/**
				 * オセアニア
				 * 下記JSONより取得
				 * https://sdk.clarion.co.jp/attachments/download/21009/NaviService_Mapupdate_CurrentMapDetail_AU.json
				 */
				HarmanOTA.stubRetgetCurrentMapDetails_Oceania = {
					"product_code": "3122895924",
					"device_code": "891169288",
					"mapJson": {
						"timestamp": 576971108,
						"used_map_space": 1112764,
						"available_map_space": -1,
						"nds_product": [
							{
								"id": 4859665,
								"baseline_id": 15077,
								"supplier_id": 28,
								"name": "Oceania",
								"version_id": 1,
								"size": 1112764,
								"nds_region": [
									{
										"id": 800,
										"name": "Western Australia",
										"version_id": 1,
										"size": 121688,
										"country_iso": "AUS",
										"state_iso": "OT,WA"
									},
									{
										"id": 801,
										"name": "Northern Territory",
										"version_id": 1,
										"size": 24480,
										"country_iso": "AUS",
										"state_iso": "NT"
									},
									{
										"id": 802,
										"name": "South Australia",
										"version_id": 1,
										"size": 76788,
										"country_iso": "AUS",
										"state_iso": "SA"
									},
									{
										"id": 803,
										"name": "Queensland",
										"version_id": 1,
										"size": 187864,
										"country_iso": "AUS",
										"state_iso": "QLD"
									},
									{
										"id": 804,
										"name": "New South Wales",
										"version_id": 1,
										"size": 223720,
										"country_iso": "AUS",
										"state_iso": "ACT,NSW"
									},
									{
										"id": 805,
										"name": "Victoria",
										"version_id": 1,
										"size": 185924,
										"country_iso": "AUS",
										"state_iso": "VIC"
									},
									{
										"id": 806,
										"name": "Tasmania",
										"version_id": 1,
										"size": 32108,
										"country_iso": "AUS",
										"state_iso": "TAS"
									},
									{
										"id": 808,
										"name": "New Zealand",
										"version_id": 1,
										"size": 161496,
										"country_iso": "NZL",
										"state_iso": ""
									},
									{
										"id": 813,
										"name": "Fiji",
										"version_id": 1,
										"size": 8060,
										"country_iso": "FJI",
										"state_iso": ""
									},
									{
										"id": 899,
										"name": "Rest of Oceania",
										"version_id": 1,
										"size": 29692,
										"country_iso": "ATA,ATF,BVT,CCK,COK,FSM,HMD,KIR,MHL,NCL,NFK,NIU,NRU,PCN,PLW,PNG,PYF,SLB,TKL,TON,TUV,UMI,VUT,WLF,WSM",
										"state_iso": ""
									},
									{
										"id": 908,
										"name": "International Waters",
										"version_id": 1,
										"size": 60736,
										"country_iso": "XXX",
										"state_iso": ""
									}
								]
							}
						],
						"product_code": "3122895924",
						"device_code": "891169288",
					}
				};
				//↑ オセアニア ----------------------------------------------------------------------------
					

				if (HarmanOTA.useStubVehicleInfo || HarmanOTA.useStubSDK) {
					console.log("[use debug mode]\nuseStubVehicleInfo(" + HarmanOTA.useStubVehicleInfo + ")\nuseStubSDK(" + HarmanOTA.useStubSDK + ")");
				}
			};
			var emu_deviceCode = '891167361';
			var emu_productCode = '3122895924';
			//var emu_deviceCode = '001540001';     //多言語テストで使用
			//var emu_productCode = '3922623260';   //多言語テストで使用
			window.setupDebugOTASettings(emu_deviceCode, emu_productCode);
	
		} catch (error) {
			mws_sa_consolelog(error);
			return;
		}
	
		if (MwsEmulator.debugPlatform != MwsEmulator.DEBUG_CONST.PLATFORM_PC) {
			return;
		}
	
		var settingText = JSON.stringify(HarmanOTA.stubVehicleSettings);
		setLocalStorage('harman_ota_info', settingText);
		setLocalStorage('geocode_iso_country_code/', "US");

		var NativeBinderStub = (function () {
	
			var reqCallbackTime = 1;
			var respCallbackTime = 50;
	
			/**
			 * コンストラクタ
			 */
			function NativeBinderStub() {
			}
	
	
			NativeBinderStub.prototype.waitResgore_MapDownloadSenarioManager = function (callback) {
				var tryWait = function () {
					setTimeout(function () {
						if (!MapDownloadSenarioManager.getInstance().restored) {
							tryWait();
							return;
						}
						callback();
					}, respCallbackTime);
				};
				tryWait();
			}
	
			NativeBinderStub.prototype.getDownloadingQueue = function (callback) {
				this.waitResgore_MapDownloadSenarioManager(function () {
					var queue = MapDownloadSenarioManager.getInstance().senario.queue;
					if (queue == undefined || queue == null) {
						queue = [];
					} else {
						var tmpQueue = [];
						for (var i = 0; i < queue.length; i++) {
							if (queue[i].notify != 'regionsDownloadProgress' &&
								queue[i].notify != 'accessoryFileTransferProgress') {
								continue;
							}
	
							var key = queue[i].data[0];
							if (tmpQueue.length == 0) {
								tmpQueue.push(key);
								continue;
							}
	
							var isAdd = true;
							for (var j = 0; j < tmpQueue.length; j++) {
								if (HarmanOTA.AnalyseAhaConnectSDKResponse.equalsRegionDataKey(key, tmpQueue[j])) {
									// 同じkeyがあるので追加しない
									isAdd = false;
									break;
								}
							}
							if (isAdd) {
								tmpQueue.push(key);
							}
						}
						queue = tmpQueue;
					}
					callback(queue);
				});
			}
	
			NativeBinderStub.prototype.postRequest = function (methodName, params, respCallbackKey, respCallback, reqCallback) {
				var _this = this;
				if (respCallback == undefined) {
					respCallback = function () {
						mws_sa_consolelog("nativeBinderStub : stub respCallback");
					};
				}
	
				if (reqCallback == undefined) {
					reqCallback = function () {
						mws_sa_consolelog("nativeBinderStub : stub reqCallback");
					};
				}
	
				setTimeout(function () {
					reqCallback(true);
				}, reqCallbackTime);
	
				if (methodName.indexOf('UJMLAPP:readKVS') > -1) {
					setTimeout(function () {
						var key = params[0]._value;
						var value = getLocalStorage(key);
						console.log('readKVS : [' + key + '] ' + value);
						respCallback(key, value);
					}, respCallbackTime);
				} else if (methodName.indexOf('UJMLAPP:writeKVS') > -1) {
					setTimeout(function () {
						var key = params[0]._value;
						var value = params[1]._value;
						console.log('writeKVS : [' + key + '] ' + value);
						setLocalStorage(key, value);
						respCallback(key, value, true);
					}, respCallbackTime);
				} else if (methodName.indexOf('AHASDK:sendAsyncRequest') > -1) {
					var reqParam = params[0]._value;
					var payload = { 'errorCode': 0, 'data': [{}] };
					var type = 'application/json';
					var errorCode = 0;
	
					if (reqParam.indexOf('retrieveAvailableMapRegions') > -1) {
						// 必要があれば処理を記載する
						setTimeout(function () {
							respCallback(payload, type, errorCode);
						}, respCallbackTime);
					} else if (reqParam.indexOf('removeDevices') > -1) {
						// 必要があれば処理を記載する
						setTimeout(function () {
							respCallback(payload, type, errorCode);
						}, respCallbackTime);
					} else if (reqParam.indexOf('cancelDownload') > -1) {
						HarmanOTA.MapDownloadSenarioManager.getInstance().stop();
						var targetData = JSON.parse(params[0]._value).data[0];
						payload = {
							"resp": "cancelDownload",
							"respCode": 0,
							"data": [{
								"deviceCode": targetData.deviceCode,
								"productCode": targetData.productCode,
								"productID": targetData.productID,
								"supplierID": targetData.supplierID,
								"baselineID": targetData.baselineID,
								"regionID": targetData.regionID,
								"fromVersion": targetData.fromVersion,
								"toVersion": targetData.toVersion,
								"errorCode": 0
							}],
						};
						// 必要があれば処理を記載する
						setTimeout(function () {
							respCallback(payload, type, errorCode);
						}, respCallbackTime);
	
					} else if (reqParam.indexOf('deleteRegionFiles') > -1) {
						HarmanOTA.MapDownloadSenarioManager.getInstance().stop();
						var targetData = JSON.parse(params[0]._value).data[0];
	
	
						payload = {
							"resp": "deleteRegionFiles",
							"respCode": 0,
							"data": [{
								"deviceCode": targetData.deviceCode,
								"productCode": targetData.productCode,
								"productID": targetData.productID,
								"supplierID": targetData.supplierID,
								"baselineID": targetData.baselineID,
								"regionID": targetData.regionID,
								"errorCode": 0
							}],
						};
	
						// 必要があれば処理を記載する
						setTimeout(function () {
							respCallback(payload, type, errorCode);
						}, respCallbackTime);
	
					} else {
						setTimeout(function () {
							respCallback(payload, type, errorCode);
						}, respCallbackTime);
					}
	
				} else if (methodName.indexOf('AHASDK:addNotifyData') > -1) {
				} else if (methodName.indexOf('AHASDK:removeNotifyData') > -1) {
				} else if (methodName.indexOf('AHASDK:addDownloadQueue') > -1) {
	
					HarmanOTA.MapDownloadSenarioManager.getInstance().start();
					// MapDownloadSimulator.getInstance().setQueue(params[0]._value);
					// MapDownloadSimulator.getInstance().deQueue();
	
				} else if (methodName.indexOf('AHASDK:getDownloadQueue') > -1) {
	
					_this.getDownloadingQueue(function (queue) {
						respCallback(queue);
					});
	
				} else if (methodName.indexOf('AHASDK:clearDownloadQueue') > -1) {
	
					MapDownloadSimulator.getInstance().clearDownloadQueue();
	
				} else if (methodName.indexOf('AHASDK:gettransferMapDataProgress') > -1) {
	
					_this.getDownloadingQueue(function (queue) {
						var key = {};
						if (queue == undefined || queue == null || queue.length == 0) {
						} else {
							key = queue[0];
							if (key.notify != 'regionsDownloadProgress' &&
								key.notify != 'accessoryFileTransferProgress') {
								key = {};
							}
						}
						respCallback(key);
					});
	
				} else if (methodName.indexOf('AHASDK:debug_notifyData') > -1) {
					var payload = JSON.parse(params[0]._value);
					if (payload.notify == 'extend_didAccessoryDisconnect') {
						HarmanOTA.debugFunc.postAccessoryDisconnect();
					} else if (payload.notify == 'extend_didAccessoryConnect') {
						HarmanOTA.debugFunc.postAccessoryConnect();
					} else if (payload.notify == 'extend_onNativeEvent') {
						HarmanOTA.debugFunc.postTransferMonitorTimeout();
					} else {
						var pageManager = MapDownloadSimulator.getInstance().getPageManager();
						if (pageManager != null) {
							pageManager.ahaConnectSDKNotify(payload, params[1]._value);
						}
					}
				} else if (methodName.indexOf('AHASDK:') > -1) {
					setTimeout(function () {
						respCallback({});
					}, respCallbackTime);
				} else if (methodName.indexOf('AHASDK:') > -1) {
					// var reqParam = params[0]._value;
					var payload = { 'errorCode': 0 };
					var type = 'application/json';
					var errorCode = 0;
	
					// 必要があれば処理を記載する
					setTimeout(function () {
						respCallback(payload, type, errorCode);
					}, respCallbackTime);
	
				} else {
					mws_sa_consolelog("mws.saemu.js : not implements : " + methodName);
	
					// 必要があれば処理を記載する
					setTimeout(function () {
						respCallback(payload, type, errorCode);
					}, respCallbackTime);
				}
			};
	
			return NativeBinderStub;
		})();
	
		function nativeBinderStub(methodName, params, respCallbackKey, respCallback, reqCallback) {
			new NativeBinderStub().postRequest(methodName, params, respCallbackKey, respCallback, reqCallback);
			return true;
		};
	
		try {
			HarmanOTA.CommonHTMLSDK.prototype.requestNativeBinder = (function () {
				var context = HarmanOTA.CommonHTMLSDK;
				var original = HarmanOTA.CommonHTMLSDK.prototype.requestNativeBinder;

				HarmanOTA.AhaConnectHTMLSDK.REQUEST_TIMEOUT_INTERVAL = 600;
				HarmanOTA.CommonHTMLSDK.REQUEST_TIMEOUT_INTERVAL = 600;
	
				return function (methodName, params, respCallbackKey, respCallback, reqCallback) {
					if (nativeBinderStub(methodName, params, respCallbackKey, respCallback, reqCallback)) {
						return function () { };
					} else {
						return original.call(context, options);
					}
				};
			})();
		} catch (error) {
			mws_sa_consolelog(error);
		}
	
		try {
			HarmanOTA.AhaConnectHTMLSDK.prototype.requestNativeBinder = (function () {
				var context = HarmanOTA.AhaConnectHTMLSDK;
				var original = HarmanOTA.AhaConnectHTMLSDK.prototype.requestNativeBinder;
	
				return function (methodName, params, respCallbackKey, respCallback, timeoutCallback) {
					if (nativeBinderStub(methodName, params, respCallbackKey, respCallback, timeoutCallback)) {
					} else {
						return original.call(context, options);
					}
				};
			})();
		} catch (error) {
			mws_sa_consolelog(error);
		}
	}());
	
	function mwsRequestSample() {
		// MWS request sample
		mwsRequestManager.initialize(function () {
			// complete
			getSampleApi().then(function (responseText) {
				// resolve(success)
	
			}, function () {
				// resolve(reject)
	
			});
		});
	
		function getSampleApi() {
			var value = null;
			var url = mwsRequestManager.getMWSUrl() + "get-storage-info";
			var d = $.Deferred();
	
			$.ajax({
				type: "GET",		// HTTPメソッド
				url: url,			// URL
				async: true,		// 非同期
				timeout: 5000,		// タイムアウト
				success: function (data, status, xhr) {
					d.resolve(xhr.responseText);
				},
				error: function (xhr, status, err) {
					d.reject();
				}
			});
			return d.promise();
		}
	}
	
	/**多言語テスト時は「country」「language」を変更する */
	g_responseJson.getAppinfo = {
		"return_cd": "M001I",
		"version": "2.0.0_e",
		"term_aprroval_flag": "OK",
		"os": "ios",
		"country": HarmanOTA.useStubCountry,
		"language": HarmanOTA.useStubLanguage,
		"locale": HarmanOTA.useStubLanguage + "_" + HarmanOTA.useStubCountry,
		"app_name": "SUBARU STARLINK",
		"v2": {
			"country": HarmanOTA.useStubCountry,
			"language": HarmanOTA.useStubLanguage,
		}
	};
	
	g_responseJson.getStorageInfo = {
		"return_cd": "M001I",
		"totalSize": 500000 * 1024 * 1024,
		"freeSize": 250000 * 1024 * 1024,
	};
	
	g_responseJson.gps = {
		//california
		'latitude': 38.651,
		'longitude': -121.465
	};
	
	g_responseJson.contact = '{ \
					 "return_cd":"M001I", \
					 "searchcount":"100", \
					 "method":"0", \
					 "contact":[ \
						 { \
							 "contact_id":"1", \
							 "name": \
								 { \
									 "firstname":"a1太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"2", \
							 "name": \
								 { \
									 "firstname":"a2太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"3", \
							 "name": \
								 { \
									 "firstname":"a3太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"4", \
							 "name": \
								 { \
									 "firstname":"a4太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"5", \
							 "name": \
								 { \
									 "firstname":"a5太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"6", \
							 "name": \
								 { \
									 "firstname":"a6太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"7", \
							 "name": \
								 { \
									 "firstname":"a7太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"8", \
							 "name": \
								 { \
									 "firstname":"a8太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"1", \
							 "name": \
								 { \
									 "firstname":"b1太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"2", \
							 "name": \
								 { \
									 "firstname":"b2太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 }, \
						 { \
							 "contact_id":"3", \
							 "name": \
								 { \
									 "firstname":"b3太郎", \
									 "middlename":"Jr", \
									 "lastname":"鈴木", \
									 "firstname_phonetic":"たろう", \
									 "middlename_phonetic":"じゅにあ", \
									 "lastname_phonetic":"すずき", \
									 "displayname":"鈴木太郎Jr" \
								 }, \
							 "phone_number":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"+818067636663" \
								 }], \
							 "mail_address":[ \
								 { \
									 "type":"MOBILE", \
									 "data":"sample@abcd.com" \
								 }], \
							 "address":[ \
								 { \
									 "street":"東品川4－12－7", \
									 "city":"品川区", \
									 "state":"東京都" \
								 }] \
						 } \
					 ]}';
	
	
	g_responseJson.SA4carAppListXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> \
	<APP> \
		<RETURN_CD>INF_APPINFOGET_000002</RETURN_CD> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>ef580884c46bae2f68e16478fa28bf7fbad492684724e0c325d5041eb2c9b37d</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000008</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>My Way Guide</JP> \
				<EN>My Way Guide</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>My Way Guide</JP> \
				<EN>My Way Guide</EN> \
			</APP_DESCRIPTION> \
			<SUPPORT_OPERATION> \
				<ID>enable_e2e</ID> \
			</SUPPORT_OPERATION> \
			<APP_DESCRIPTION_LONG> \
				<JP>お好みの背景色や壁紙を変える事ができます。</JP> \
				<EN>Select and switch to favorite BG color and Wallpaper.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2012-01-01</APP_RELEASEDATE> \
			<APP_VER>2.0.2</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/2.0.2/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/2.0.2/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>23</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_03_bg.jpg</IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>2e65f032e2f97063c85c398ca35ff1486aaf1001d8b59a85f5ef72a61b806450</APP_ID> \
			<APP_CATEGORY>15.0M国内3年音声認識アプリ</APP_CATEGORY> \
			<APP_HTML5_ID>200000001</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Intelligent&lt;br&gt; VOICE </JP> \
				<EN>Intelligent&lt;br&gt; VOICE </EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Intelligent VOICE</JP> \
				<EN>Intelligent VOICE</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>いつでもあなたのドライブをサポートしてくれる音声パートナー&lt;br /&gt; &lt;br /&gt; 「目的地検索」や「ルート条件変更」はもちろん、「電話発信」「メール※1」「メッセージ送信※2」「音楽再生」といった操作が音声でできます。&lt;br /&gt; さらに、おしらせ通知機能によって新着メールやスマートフォンの電池残量も教えてくれる理想の音声認識機能です。&lt;br /&gt; ※1 Google™ のアカウントでログインが必要です。 ※2 Android™スマートフォンのみ&lt;br /&gt; &lt;br /&gt; ■ 目的地を探す&lt;br /&gt; ① Google™ ローカル検索 ：&lt;br /&gt; どんな言葉でも、Google™ ローカルの膨大な情報の中から、検索や目的地の設定までできます。&lt;br /&gt; あいまいな内容でも長い住所でも、手入力することなく声でかんたんに検索できます。&lt;br /&gt; 詳細情報では、インターネットに投稿されたクチコミ情報を見ることができ、そのスポットにハンズフリーで電話をかけることも可能です。&lt;br /&gt; &lt;br /&gt; ② グルメ検索 ：&lt;br /&gt; ぐるなび・ホットペッパーグルメ・Yahoo!JAPANのレストランの情報から、ナビと対話しながら目的地の設定まですることができます。&lt;br /&gt; 音声入力の条件に合った検索結果リストを地図との2画面で表示し、詳細情報ではお店の写真や平均予算、駐車場の有無やクーポンの有無も表示されます。&lt;br /&gt; 電話番号の情報があれば、その店舗にハンズフリーで電話をかけることも可能です。&lt;br /&gt; &lt;br /&gt; 他にも、両モードとも「自宅へ帰る」「有料優先に変更」など、音声操作でルート探索することもできます。&lt;br /&gt; &lt;br /&gt; ■ 音楽を聴く&lt;br /&gt; お好みの音楽を声で検索・再生ができます。&lt;br /&gt; ナビと接続したスマートフォン内の楽曲再生が可能です。&lt;br /&gt; &lt;br /&gt; ■ 電話をかける&lt;br /&gt; 連絡帳に登録された名前を言うだけで、電話発信ができます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へ発信ができます。&lt;br /&gt; &lt;br /&gt; ■ メッセージを送る&lt;br /&gt; 声だけでSMS（ショート・メッセージ）を送信できます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へメッセージを送信できます。&lt;br /&gt; ※ Android™スマートフォンのみ。&lt;br /&gt; &lt;br /&gt; ■ メールを送る&lt;br /&gt; 声でメールを作成し、送信できます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へメールを送信できます。&lt;br /&gt; ※ Google™ のアカウントでログインが必要です。&lt;br /&gt; &lt;br /&gt; ■ ナビが情報を知らせてくれるお知らせ通知機能&lt;br /&gt; スマートフォンの電池残量や新着メールをナビが知らせてくれます。メールの返信も音声操作で可能です。&lt;br /&gt; ※受信するメールは、Smart Access 4Carアプリでメールアドレスを指定します。&lt;br /&gt; &lt;br /&gt; &lt;script type="text/javascript" src="https://www.smt-access.com/tif/h5ContentsDownload/tutorial/common/js/tutorial.js"&gt;&lt;/script&gt;&lt;a href="javascript:void(0)" onclick="set_alert_language("jp");show_tukaikata(); return false;"&gt;「Intelligent VOICE」の使い方ガイドはこちら&lt;/a&gt;&lt;br /&gt; &lt;br /&gt; &lt;br /&gt; ■ ご利用開始から3年無料＆選べるサービス&lt;br /&gt; &lt;br /&gt; 「Intelligent VOICE」の魅力を皆さまに体験していただくために、全機能を無料でお使いいただける期間を設定しております。&lt;br /&gt; 無料期間終了後は、定額料金にて全機能をご利用いただけるプレミアムサービスと、一部機能を継続してご利用いただけるフリーサービスをお選びいただけます。&lt;br /&gt; &lt;br /&gt; 機能やサービスの詳細については、Clarionホームページをご覧ください。&lt;br /&gt; &lt;br /&gt; &lt;a href="https://www.smt-access.com/tif/h5ContentsDownload/ivoice/settings/config.html" rel="external"&gt;目的地履歴とお気に入り機能はこちら&lt;/a&gt;&lt;br /&gt;&lt;br /&gt;[ご注意]&lt;br /&gt;Gmail受信通知サービスはスマホのアドレス登録件数最大300件まで動作確認をしています。&lt;br /&gt;また、一部の機種では正常にご利用できない場合がありますので、ご了承ください。&lt;br /&gt;</JP> \
				<EN>いつでもあなたのドライブをサポートしてくれる音声パートナー&lt;br /&gt; &lt;br /&gt; 「目的地検索」や「ルート条件変更」はもちろん、「電話発信」「メール※1」「メッセージ送信※2」「音楽再生」といった操作が音声でできます。&lt;br /&gt; さらに、おしらせ通知機能によって新着メールやスマートフォンの電池残量も教えてくれる理想の音声認識機能です。&lt;br /&gt; ※1 Google™ のアカウントでログインが必要です。 ※2 Android™スマートフォンのみ&lt;br /&gt; &lt;br /&gt; ■ 目的地を探す&lt;br /&gt; ① Google™ ローカル検索 ：&lt;br /&gt; どんな言葉でも、Google™ ローカルの膨大な情報の中から、検索や目的地の設定までできます。&lt;br /&gt; あいまいな内容でも長い住所でも、手入力することなく声でかんたんに検索できます。&lt;br /&gt; 詳細情報では、インターネットに投稿されたクチコミ情報を見ることができ、そのスポットにハンズフリーで電話をかけることも可能です。&lt;br /&gt; &lt;br /&gt; ② グルメ検索 ：&lt;br /&gt; ぐるなび・ホットペッパーグルメ・Yahoo!JAPANのレストランの情報から、ナビと対話しながら目的地の設定まですることができます。&lt;br /&gt; 音声入力の条件に合った検索結果リストを地図との2画面で表示し、詳細情報ではお店の写真や平均予算、駐車場の有無やクーポンの有無も表示されます。&lt;br /&gt; 電話番号の情報があれば、その店舗にハンズフリーで電話をかけることも可能です。&lt;br /&gt; &lt;br /&gt; 他にも、両モードとも「自宅へ帰る」「有料優先に変更」など、音声操作でルート探索することもできます。&lt;br /&gt; &lt;br /&gt; ■ 音楽を聴く&lt;br /&gt; お好みの音楽を声で検索・再生ができます。&lt;br /&gt; ナビと接続したスマートフォン内の楽曲再生が可能です。&lt;br /&gt; &lt;br /&gt; ■ 電話をかける&lt;br /&gt; 連絡帳に登録された名前を言うだけで、電話発信ができます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へ発信ができます。&lt;br /&gt; &lt;br /&gt; ■ メッセージを送る&lt;br /&gt; 声だけでSMS（ショート・メッセージ）を送信できます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へメッセージを送信できます。&lt;br /&gt; ※ Android™スマートフォンのみ。&lt;br /&gt; &lt;br /&gt; ■ メールを送る&lt;br /&gt; 声でメールを作成し、送信できます。&lt;br /&gt; ナビと接続したスマートフォンのアドレス帳登録者へメールを送信できます。&lt;br /&gt; ※ Google™ のアカウントでログインが必要です。&lt;br /&gt; &lt;br /&gt; ■ ナビが情報を知らせてくれるお知らせ通知機能&lt;br /&gt; スマートフォンの電池残量や新着メールをナビが知らせてくれます。メールの返信も音声操作で可能です。&lt;br /&gt; ※受信するメールは、Smart Access 4Carアプリでメールアドレスを指定します。&lt;br /&gt; &lt;br /&gt; &lt;script type="text/javascript" src="https://www.smt-access.com/tif/h5ContentsDownload/tutorial/common/js/tutorial.js"&gt;&lt;/script&gt;&lt;a href="javascript:void(0)" onclick="set_alert_language("jp");show_tukaikata(); return false;"&gt;「Intelligent VOICE」の使い方ガイドはこちら&lt;/a&gt;&lt;br /&gt; &lt;br /&gt; &lt;br /&gt; ■ ご利用開始から3年無料＆選べるサービス&lt;br /&gt; &lt;br /&gt; 「Intelligent VOICE」の魅力を皆さまに体験していただくために、全機能を無料でお使いいただける期間を設定しております。&lt;br /&gt; 無料期間終了後は、定額料金にて全機能をご利用いただけるプレミアムサービスと、一部機能を継続してご利用いただけるフリーサービスをお選びいただけます。&lt;br /&gt; &lt;br /&gt; 機能やサービスの詳細については、Clarionホームページをご覧ください。&lt;br /&gt; &lt;br /&gt; &lt;a href="https://www.smt-access.com/tif/h5ContentsDownload/ivoice/settings/config.html" rel="external"&gt;目的地履歴とお気に入り機能はこちら&lt;/a&gt;&lt;br /&gt;&lt;br /&gt;[ご注意]&lt;br /&gt;Gmail受信通知サービスはスマホのアドレス登録件数最大300件まで動作確認をしています。&lt;br /&gt;また、一部の機種では正常にご利用できない場合がありますので、ご了承ください。&lt;br /&gt;</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2999-12-31</APP_RELEASEDATE> \
			<APP_VER>5.0.33</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/5.0.33/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/config/config/index.html</APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/5.0.33/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>5</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/screen/IV_15_JP/IV15-1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/screen/IV_15_JP/IV15-2_1706_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/screen/IV_15_JP/IV15-3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/screen/IV_15_JP/IV15-4_bg.jpg</IMG4> \
				<IMG5>https://www.smt-access.com/tif/h5ContentsDownload/ivoice/screen/IV_15_JP/IV15-5_bg.jpg</IMG5> \
			</APP_IMAGES> \
			<ITEM_INFO> \
				<ITEM_ID>653</ITEM_ID> \
				<ITEM_NAME>camp_001</ITEM_NAME> \
				<ITEM_TYPE>campain_1</ITEM_TYPE> \
				<OWNER_SERVICE>h5.contentsDownload.getContents</OWNER_SERVICE> \
				<OWNER_APP>2e65f032e2f97063c85c398ca35ff1486aaf1001d8b59a85f5ef72a61b806450</OWNER_APP> \
				<DEVICE_ID></DEVICE_ID> \
				<LICENSEE_ID_TYPE>PID</LICENSEE_ID_TYPE> \
				<LICENCE_TYPE>2</LICENCE_TYPE> \
				<NUM>0</NUM> \
				<PERIOD>36</PERIOD> \
				<ITEM_SUPPORT_LAST_DATE>2019-06-01T00:00:00</ITEM_SUPPORT_LAST_DATE> \
				<LICENCE_NOTIFICATIONS_DATE>14</LICENCE_NOTIFICATIONS_DATE> \
				<ITEM_STATUS>CANCEL</ITEM_STATUS> \
				<VENDOR> \
					<JP>Clarion</JP> \
				</VENDOR> \
				<CURRENCY> \
					<JP>YEN</JP> \
				</CURRENCY> \
				<PRICE> \
					<JP>0.0</JP> \
				</PRICE> \
				<ITEM_TITLE> \
					<JP>プレミアムサービス</JP> \
				</ITEM_TITLE> \
				<ITEM_DESCRIPTION> \
					<JP>Intelligent VOICE プレミアムサービスで利用できる機能は、以下の通りです。&lt;br/&gt;&lt;br/&gt;・スマートフォン内の音楽再生&lt;br/&gt;・電話発信&lt;br/&gt;・メール&lt;br/&gt;・SMS（メッセージ）送信　(Androidスマートフォンのみ)&lt;br/&gt;・施設検索のプレミアム機能&lt;br/&gt;　・目的地/経由地の設定&lt;br/&gt;　・条件を加えた音声検索&lt;br/&gt;　　「現在地周辺の○○」&lt;br/&gt;　　「目的地周辺の○○」&lt;br/&gt;　・グルメ検索&lt;br/&gt;　・お気に入りの表示&lt;br/&gt;　・履歴の表示&lt;br/&gt;　・検索施設への電話発信&lt;br/&gt;・音声での操作&lt;br/&gt;　・検索結果リスト操作&lt;br/&gt;　　「次へ」&lt;br/&gt;　　「詳細表示」&lt;br/&gt;　・ルート探索条件の変更&lt;br/&gt;　・施設アイコンの表示/非表示　等&lt;br/&gt;・お知らせ通知&lt;br/&gt;　・スマートフォンの電池残量&lt;br/&gt;・音声応答&lt;br/&gt;・ヘルプ</JP> \
				</ITEM_DESCRIPTION> \
			</ITEM_INFO> \
			<ITEM_INFO> \
				<ITEM_ID>654</ITEM_ID> \
				<ITEM_NAME>item_001</ITEM_NAME> \
				<ITEM_TYPE>normal</ITEM_TYPE> \
				<OWNER_SERVICE>h5.contentsDownload.getContents</OWNER_SERVICE> \
				<OWNER_APP>2e65f032e2f97063c85c398ca35ff1486aaf1001d8b59a85f5ef72a61b806450</OWNER_APP> \
				<DEVICE_ID></DEVICE_ID> \
				<LICENSEE_ID_TYPE>PID</LICENSEE_ID_TYPE> \
				<LICENCE_TYPE>2</LICENCE_TYPE> \
				<NUM>0</NUM> \
				<PERIOD>1</PERIOD> \
				<ITEM_SUPPORT_LAST_DATE>2020-03-31T00:00:00</ITEM_SUPPORT_LAST_DATE> \
				<LICENCE_NOTIFICATIONS_DATE>14</LICENCE_NOTIFICATIONS_DATE> \
				<ITEM_STATUS>SALE</ITEM_STATUS> \
				<VENDOR> \
					<JP>Clarion</JP> \
				</VENDOR> \
				<CURRENCY> \
					<JP>YEN</JP> \
				</CURRENCY> \
				<PRICE> \
					<JP>360.0</JP> \
				</PRICE> \
				<ITEM_TITLE> \
					<JP>プレミアムサービス</JP> \
				</ITEM_TITLE> \
				<ITEM_DESCRIPTION> \
					<JP>1ヶ月 \
	Intelligent VOICE プレミアムサービスで利用できる機能は、以下の通りです。&lt;br/&gt;&lt;br/&gt;・スマートフォン内の音楽再生&lt;br/&gt;・電話発信&lt;br/&gt;・メール&lt;br/&gt;・SMS（メッセージ）送信　(Androidスマートフォンのみ)&lt;br/&gt;・施設検索のプレミアム機能&lt;br/&gt;　・目的地/経由地の設定&lt;br/&gt;　・条件を加えた音声検索&lt;br/&gt;　　「現在地周辺の○○」&lt;br/&gt;　　「目的地周辺の○○」&lt;br/&gt;　・グルメ検索&lt;br/&gt;　・お気に入りの表示&lt;br/&gt;　・履歴の表示&lt;br/&gt;　・検索施設への電話発信&lt;br/&gt;・音声での操作&lt;br/&gt;　・検索結果リスト操作&lt;br/&gt;　　「次へ」&lt;br/&gt;　　「詳細表示」&lt;br/&gt;　・ルート探索条件の変更&lt;br/&gt;　・施設アイコンの表示/非表示　等&lt;br/&gt;・お知らせ通知&lt;br/&gt;　・スマートフォンの電池残量&lt;br/&gt;・音声応答&lt;br/&gt;・ヘルプ</JP> \
				</ITEM_DESCRIPTION> \
			</ITEM_INFO> \
			<ITEM_INFO> \
				<ITEM_ID>655</ITEM_ID> \
				<ITEM_NAME>item_002</ITEM_NAME> \
				<ITEM_TYPE>normal</ITEM_TYPE> \
				<OWNER_SERVICE>h5.contentsDownload.getContents</OWNER_SERVICE> \
				<OWNER_APP>2e65f032e2f97063c85c398ca35ff1486aaf1001d8b59a85f5ef72a61b806450</OWNER_APP> \
				<DEVICE_ID></DEVICE_ID> \
				<LICENSEE_ID_TYPE>PID</LICENSEE_ID_TYPE> \
				<LICENCE_TYPE>2</LICENCE_TYPE> \
				<NUM>0</NUM> \
				<PERIOD>6</PERIOD> \
				<ITEM_SUPPORT_LAST_DATE>2020-03-31T00:00:00</ITEM_SUPPORT_LAST_DATE> \
				<LICENCE_NOTIFICATIONS_DATE>14</LICENCE_NOTIFICATIONS_DATE> \
				<ITEM_STATUS>SALE</ITEM_STATUS> \
				<VENDOR> \
					<JP>Clarion</JP> \
				</VENDOR> \
				<CURRENCY> \
					<JP>YEN</JP> \
				</CURRENCY> \
				<PRICE> \
					<JP>1800.0</JP> \
				</PRICE> \
				<ITEM_TITLE> \
					<JP>プレミアムサービス</JP> \
				</ITEM_TITLE> \
				<ITEM_DESCRIPTION> \
					<JP>6ヶ月 \
	Intelligent VOICE プレミアムサービスで利用できる機能は、以下の通りです。&lt;br/&gt;&lt;br/&gt;・スマートフォン内の音楽再生&lt;br/&gt;・電話発信&lt;br/&gt;・メール&lt;br/&gt;・SMS（メッセージ）送信　(Androidスマートフォンのみ)&lt;br/&gt;・施設検索のプレミアム機能&lt;br/&gt;　・目的地/経由地の設定&lt;br/&gt;　・条件を加えた音声検索&lt;br/&gt;　　「現在地周辺の○○」&lt;br/&gt;　　「目的地周辺の○○」&lt;br/&gt;　・グルメ検索&lt;br/&gt;　・お気に入りの表示&lt;br/&gt;　・履歴の表示&lt;br/&gt;　・検索施設への電話発信&lt;br/&gt;・音声での操作&lt;br/&gt;　・検索結果リスト操作&lt;br/&gt;　　「次へ」&lt;br/&gt;　　「詳細表示」&lt;br/&gt;　・ルート探索条件の変更&lt;br/&gt;　・施設アイコンの表示/非表示　等&lt;br/&gt;・お知らせ通知&lt;br/&gt;　・スマートフォンの電池残量&lt;br/&gt;・音声応答&lt;br/&gt;・ヘルプ</JP> \
				</ITEM_DESCRIPTION> \
			</ITEM_INFO> \
			<ITEM_INFO> \
				<ITEM_ID>656</ITEM_ID> \
				<ITEM_NAME>item_003</ITEM_NAME> \
				<ITEM_TYPE>normal</ITEM_TYPE> \
				<OWNER_SERVICE>h5.contentsDownload.getContents</OWNER_SERVICE> \
				<OWNER_APP>2e65f032e2f97063c85c398ca35ff1486aaf1001d8b59a85f5ef72a61b806450</OWNER_APP> \
				<DEVICE_ID></DEVICE_ID> \
				<LICENSEE_ID_TYPE>PID</LICENSEE_ID_TYPE> \
				<LICENCE_TYPE>2</LICENCE_TYPE> \
				<NUM>0</NUM> \
				<PERIOD>12</PERIOD> \
				<ITEM_SUPPORT_LAST_DATE>2020-03-31T00:00:00</ITEM_SUPPORT_LAST_DATE> \
				<LICENCE_NOTIFICATIONS_DATE>14</LICENCE_NOTIFICATIONS_DATE> \
				<ITEM_STATUS>SALE</ITEM_STATUS> \
				<VENDOR> \
					<JP>Clarion</JP> \
				</VENDOR> \
				<CURRENCY> \
					<JP>YEN</JP> \
				</CURRENCY> \
				<PRICE> \
					<JP>3600.0</JP> \
				</PRICE> \
				<ITEM_TITLE> \
					<JP>プレミアムサービス</JP> \
				</ITEM_TITLE> \
				<ITEM_DESCRIPTION> \
					<JP>12ヶ月 \
	Intelligent VOICE プレミアムサービスで利用できる機能は、以下の通りです。&lt;br/&gt;&lt;br/&gt;・スマートフォン内の音楽再生&lt;br/&gt;・電話発信&lt;br/&gt;・メール&lt;br/&gt;・SMS（メッセージ）送信　(Androidスマートフォンのみ)&lt;br/&gt;・施設検索のプレミアム機能&lt;br/&gt;　・目的地/経由地の設定&lt;br/&gt;　・条件を加えた音声検索&lt;br/&gt;　　「現在地周辺の○○」&lt;br/&gt;　　「目的地周辺の○○」&lt;br/&gt;　・グルメ検索&lt;br/&gt;　・お気に入りの表示&lt;br/&gt;　・履歴の表示&lt;br/&gt;　・検索施設への電話発信&lt;br/&gt;・音声での操作&lt;br/&gt;　・検索結果リスト操作&lt;br/&gt;　　「次へ」&lt;br/&gt;　　「詳細表示」&lt;br/&gt;　・ルート探索条件の変更&lt;br/&gt;　・施設アイコンの表示/非表示　等&lt;br/&gt;・お知らせ通知&lt;br/&gt;　・スマートフォンの電池残量&lt;br/&gt;・音声応答&lt;br/&gt;・ヘルプ</JP> \
				</ITEM_DESCRIPTION> \
			</ITEM_INFO> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>6e1fbb917bcb76de2907da8534b2a8a9bfb0b6950977dad244d10e159bc9d8cd</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000103</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Smart Places Search</JP> \
				<EN>Smart Places Search</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Smart Places Search</JP> \
				<EN>Smart Places Search</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>本アプリはGoogle&lt;sup&gt;TM&lt;/sup&gt;検索で目的地を設定することができます。&lt;br&gt; Google&lt;sup&gt;TM&lt;/sup&gt;の新鮮で豊富な情報とオートコンプリート機能により、あなたの行きたい場所をかんたんに探すことができます。&lt;br&gt; さらにGoogle Maps Street Viewにも対応しているので、その場所の周辺の様子を事前に知ることも可能です。&lt;br&gt; 運転前の目的地設定の時や、行きたい場所の下調べの際に是非ご活用ください。</JP> \
				<EN>本アプリはGoogle&lt;sup&gt;TM&lt;/sup&gt;検索で目的地を設定することができます。&lt;br&gt; Google&lt;sup&gt;TM&lt;/sup&gt;の新鮮で豊富な情報とオートコンプリート機能により、あなたの行きたい場所をかんたんに探すことができます。&lt;br&gt; さらにGoogle Maps Street Viewにも対応しているので、その場所の周辺の様子を事前に知ることも可能です。&lt;br&gt; 運転前の目的地設定の時や、行きたい場所の下調べの際に是非ご活用ください。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2017-07-05</APP_RELEASEDATE> \
			<APP_VER>1.1</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/smart_ps/1.1/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/smart_ps/1.1/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>13</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/smart_ps/1.1/screen/SmartPlaceSearch_re2_1_bg.png</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/smart_ps/1.1/screen/SmartPlaceSearch_re2_2_bg.png</IMG2> \
				<IMG3></IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>ffbdae4311edcb222b02b12f873f21b6baf552a2a8c7fedc4ed5e8a371d61531</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000095</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Weather</JP> \
				<EN>Weather</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Weather</JP> \
				<EN>Weather</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>気になる天気をナビの大きな画面でチェックすることができます。</JP> \
				<EN>Keep up with the weather as you go.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2017-01-26</APP_RELEASEDATE> \
			<APP_VER>3.0.0</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/weather/3.0.0/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/weather/3.0.0/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>1</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/weather/3.0.0/screen/Weather1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/weather/3.0.0/screen/Weather2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/weather/3.0.0/screen/Weather3_bg.jpg</IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>287b785776ff6e2e77ee6d32411fb7f8af3bc480e7e748dccc3b04cf812cfe57</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000014</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>オービス&lt;br&gt;スコープ</JP> \
				<EN>オービス&lt;br&gt;スコープ</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>オービススコープ</JP> \
				<EN>オービススコープ</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>オービススコープはスピードが出がちな場所に設置された自動速度違反取締装置 の接近をお知らせする安全走行支援アプリです。&lt;br&gt; 本アプリは、地図上にオービスの位置を表示し、その接近を音声でお知らせします。&lt;br&gt; 安全運転にぜひお役立てください。</JP> \
				<EN>オービススコープはスピードが出がちな場所に設置された自動速度違反取締装置 の接近をお知らせする安全走行支援アプリです。&lt;br&gt; 本アプリは、地図上にオービスの位置を表示し、その接近を音声でお知らせします。&lt;br&gt; 安全運転にぜひお役立てください。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2015-12-21</APP_RELEASEDATE> \
			<APP_VER>1.0.3</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/orbis_scope/1.0.3/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/orbis_scope/1.0.3/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>5</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/orbis_scope/1.0.2/screen/obisu1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/orbis_scope/1.0.2/screen/obisu2_bg.jpg</IMG2> \
				<IMG3></IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>cdba8ef1b826f09ec518992f0435c5cec442037b32aaf1bb910cb0fd4db48e35</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000055</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>とくせん&lt;br&gt;周辺情報</JP> \
				<EN>とくせん&lt;br&gt;周辺情報</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>とくせん周辺情報は現在地周辺のとくせんスポットをご紹介するアプリケーションです。</JP> \
				<EN>とくせん周辺情報は現在地周辺のとくせんスポットをご紹介するアプリケーションです。</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>とくせん周辺情報は現在地周辺のとくせんスポットをご紹介するアプリケーションです。 地産グルメやB級グルメといった地域密着型の選りすぐりのスポットを中心にご案内いたします。 ジャンルを指定するだけでかんたん検索。食事処をお探しの際やご旅行時等に是非ご活用下さい。</JP> \
				<EN>とくせん周辺情報は現在地周辺のとくせんスポットをご紹介するアプリケーションです。 地産グルメやB級グルメといった地域密着型の選りすぐりのスポットを中心にご案内いたします。 ジャンルを指定するだけでかんたん検索。食事処をお探しの際やご旅行時等に是非ご活用下さい。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2015-09-17</APP_RELEASEDATE> \
			<APP_VER>1.0.3</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>18</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/screen/tokusen1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/screen/tokusen2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/screen/tokusen3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/poi/1.0.3/screen/tokusen4_bg.jpg</IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>a36ba68b8ca43196f722e0f5d719472748dbea3b1c0b1c78c29c3a471e21c254</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000054</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>フォートラベル</JP> \
				<EN>フォートラベル</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>フォートラベル</JP> \
				<EN>フォートラベル</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>フォートラベルは観光スポット紹介アプリです。&lt;br /&gt;&lt;br /&gt;現在地周辺、または目的地周辺の観光ガイドランキングをご紹介します。&lt;br /&gt;気になる観光スポットの詳細を見れば、その観光スポットの情報はもちろん、実際にそのスポットに訪れた方のクチコミや投稿写真を見ることができます。&lt;br /&gt;「旅行のクチコミと比較サイト フォートラベル」とのコラボレーションによるアプリですので、情報の鮮度は抜群。&lt;br /&gt;&lt;br /&gt;ドライブ中のちょっとした空き時間にフォートラベルを立ち上げてみて下さい。&lt;br /&gt;きっと「こんなところがあったんだ！」というスポットが見つかるはずです。&lt;br /&gt;気になるスポットに訪れて、旅行をより一層楽しいものにしましょう。&lt;br /&gt;&lt;br /&gt;&lt;プレミアムサービス限定機能&gt;&lt;br /&gt;Intelligent VOICEのプレミアムサービスに登録していれば、観光ガイド機能が利用できます。&lt;br /&gt;これはドライブ中にあなたのナビから、設定した目的地周辺の観光スポットランキングを無作為にお知らせする機能です。&lt;br /&gt;気になったスポットの案内があれば、ルートにそのスポットを経由地として設定することができるので、思いがけないスポットに行けるかも？</JP> \
				<EN>フォートラベルは観光スポット紹介アプリです。&lt;br /&gt;&lt;br /&gt;現在地周辺、または目的地周辺の観光ガイドランキングをご紹介します。&lt;br /&gt;気になる観光スポットの詳細を見れば、その観光スポットの情報はもちろん、実際にそのスポットに訪れた方のクチコミや投稿写真を見ることができます。&lt;br /&gt;「旅行のクチコミと比較サイト フォートラベル」とのコラボレーションによるアプリですので、情報の鮮度は抜群。&lt;br /&gt;&lt;br /&gt;ドライブ中のちょっとした空き時間にフォートラベルを立ち上げてみて下さい。&lt;br /&gt;きっと「こんなところがあったんだ！」というスポットが見つかるはずです。&lt;br /&gt;気になるスポットに訪れて、旅行をより一層楽しいものにしましょう。&lt;br /&gt;&lt;br /&gt;&lt;プレミアムサービス限定機能&gt;&lt;br /&gt;Intelligent VOICEのプレミアムサービスに登録していれば、観光ガイド機能が利用できます。&lt;br /&gt;これはドライブ中にあなたのナビから、設定した目的地周辺の観光スポットランキングを無作為にお知らせする機能です。&lt;br /&gt;気になったスポットの案内があれば、ルートにそのスポットを経由地として設定することができるので、思いがけないスポットに行けるかも？</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2015-08-03</APP_RELEASEDATE> \
			<APP_VER>1.0.12</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/4travel/1.0.12/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/4travel/1.0.12/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>17</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/4travel/screen/4travel_1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/4travel/screen/4travel_2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/4travel/screen/4travel_3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/4travel/screen/4travel_4_bg.jpg</IMG4> \
				<IMG5>https://www.smt-access.com/tif/h5ContentsDownload/4travel/screen/4travel_5_bg.jpg</IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>40c92e5ab1a0461e7d2172cdc449def4f54e98c680f354e1d79d881d2d727177</APP_ID> \
			<APP_CATEGORY>15GPF</APP_CATEGORY> \
			<APP_HTML5_ID>110000008</APP_HTML5_ID> \
			<APP_HTML5_TYPE>1</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Intelligent&lt;br&gt; Tune App </JP> \
				<EN>Intelligent&lt;br&gt; Tune App </EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Intelligent Tune Appは、車載機での音楽再生時の音質を、独自音響処理技術により飛躍的に向上させるアプリです。</JP> \
				<EN>Intelligent Tune Appは、車載機での音楽再生時の音質を、独自音響処理技術により飛躍的に向上させるアプリです。</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>Intelligent Tune Appは、車載機での音楽再生時の音質を、独自音響処理技術により飛躍的に向上させるアプリです。 各機能の設定完了後、車載機で音楽再生すると、Intelligent Tune Appの効果を体験できます。 &lt;br /&gt;&lt;br /&gt;■Smart EQ plus&lt;br /&gt; 車室内の音場特性を測定して自動補正することにより、理想的な音場を実現します。補正前は他の帯域にマスクされて聴こえ難かった帯域が良く聴こえるようになり、臨場感と音の明瞭度が大幅に向上します。</JP> \
				<EN>Intelligent Tune Appは、車載機での音楽再生時の音質を、独自音響処理技術により飛躍的に向上させるアプリです。 各機能の設定完了後、車載機で音楽再生すると、Intelligent Tune Appの効果を体験できます。 &lt;br /&gt;&lt;br /&gt;■Smart EQ plus&lt;br /&gt; 車室内の音場特性を測定して自動補正することにより、理想的な音場を実現します。補正前は他の帯域にマスクされて聴こえ難かった帯域が良く聴こえるようになり、臨場感と音の明瞭度が大幅に向上します。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2015-05-27</APP_RELEASEDATE> \
			<APP_VER>1.0.8</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/1.0.8_15.0/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/1.0.8_15.0/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>4</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/screen/15.0/Smart_EQ_plus_1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/screen/15.0/Smart_EQ_plus_2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/screen/15.0/Smart_EQ_plus_3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/intelligenttune/screen/15.0/Smart_EQ_plus_4_bg.jpg</IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>4dd5a6f67c8722366fb942b0f5a690de0998557d236754f392af60b8de985ff7</APP_ID> \
			<APP_CATEGORY>Ferix</APP_CATEGORY> \
			<APP_HTML5_ID>110000005</APP_HTML5_ID> \
			<APP_HTML5_TYPE>1</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>都道府県&lt;br&gt;クイズ</JP> \
				<EN>都道府県&lt;br&gt;クイズ</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>都道府県クイズ</JP> \
				<EN>都道府県クイズ</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>日本全国47都道府県の名所紹介クイズです。聞いたことのある名所観光地などの名前を知るだけでなくどこにあるかを覚えることができます。&lt;br /&gt;&lt;br /&gt;※接続中に音声が聞こえづらい場合は iPhone の Bluetooth 音量、または android のメディア音量をご確認ください。</JP> \
				<EN>日本全国47都道府県の名所紹介クイズです。聞いたことのある名所観光地などの名前を知るだけでなくどこにあるかを覚えることができます。&lt;br /&gt;&lt;br /&gt;※接続中に音声が聞こえづらい場合は iPhone の Bluetooth 音量、または android のメディア音量をご確認ください。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-12-25</APP_RELEASEDATE> \
			<APP_VER>2.0.2</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.2/headunit/local_quiz_top.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.2/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>21</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.0/screen/quiz_img01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.0/screen/quiz_img02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.0/screen/quiz_img03_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.0/screen/quiz_img04_bg.jpg</IMG4> \
				<IMG5>https://www.smt-access.com/tif/h5ContentsDownload/local_area_quiz/2.0.0/screen/quiz_img05_bg.jpg</IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>e35fb27e1a9d864c7e0c2eeddbedc88b6c9a6bc6b6b6ed450bf875d53c55a14a</APP_ID> \
			<APP_CATEGORY>Ferix</APP_CATEGORY> \
			<APP_HTML5_ID>110000004</APP_HTML5_ID> \
			<APP_HTML5_TYPE>1</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>今日の&lt;br&gt;ふるさと料理</JP> \
				<EN>今日の&lt;br&gt;ふるさと料理</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>今日のふるさと料理</JP> \
				<EN>今日のふるさと料理</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>一日一品の郷土料理を紹介するアプリです。名前だけでなく地域と写真を一緒に見ることができます。日本の食文化の多様性をお楽しみください。&lt;br /&gt;&lt;br /&gt;※接続中に音声が聞こえづらい場合は iPhone の Bluetooth 音量、または android のメディア音量をご確認ください。</JP> \
				<EN>一日一品の郷土料理を紹介するアプリです。名前だけでなく地域と写真を一緒に見ることができます。日本の食文化の多様性をお楽しみください。&lt;br /&gt;&lt;br /&gt;※接続中に音声が聞こえづらい場合は iPhone の Bluetooth 音量、または android のメディア音量をご確認ください。</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-12-25</APP_RELEASEDATE> \
			<APP_VER>2.0.2</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.2/headunit/local_cuisine_top.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.2/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>22</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.1/screen/cuisine_img01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.1/screen/cuisine_img02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.1/screen/cuisine_img03_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.1/screen/cuisine_img04_bg.jpg</IMG4> \
				<IMG5>https://www.smt-access.com/tif/h5ContentsDownload/local_cuisine_quiz/2.0.1/screen/cuisine_img05_bg.jpg</IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>14ca37d4020bded2c6ac4959900a9b257e35914956d5e2d6dcd641335fd2bea4</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000005</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>トイレサーチ</JP> \
				<EN>トイレサーチ</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>トイレサーチ</JP> \
				<EN>トイレサーチ</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>日本全国約２万８千ヶ所のトイレデータの中から、現在地周辺にあるトイレを探すことができます。「多機能トイレ」、「車いす対応トイレ」、「介助シート」、「車いす対応駐車場」、「駐車場」、「オストメイト洗浄設備」、「温水洗浄便座」、「ベビーシート」、「授乳室」などの条件設定も可能です。一部施設は写真情報も収録しています。</JP> \
				<EN>Search restrooms nearby from more than 28,000 data.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-10-14</APP_RELEASEDATE> \
			<APP_VER>2.0.1</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/toilet/2.0.1/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/toilet/2.0.1/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>19</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/toilet/1.0.0/screen/Toilet1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/toilet/1.0.0/screen/Toilet2-3b_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/toilet/1.0.0/screen/Toilet3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/toilet/1.0.0/screen/Toilet4-3_bg.jpg</IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>8ea03977fc660388ee35b100c0e0ffb27647497f4c9664eb5b31809a400b0349</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000002</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>ガスプライス</JP> \
				<EN>ガスプライス</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>ガスプライス</JP> \
				<EN>ガスプライス</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>ガソリンスタンドを価格の安い順、距離の近い順などでリストアップすることが可能です。</JP> \
				<EN>Display Filling Station by location and price.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-09-24</APP_RELEASEDATE> \
			<APP_VER>2.0.3</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/2.0.3/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/2.0.3/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>8</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/1.0.0/screen/Gass1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/1.0.0/screen/Gass2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/1.0.0/screen/Gass3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/e_nenpi/1.0.0/screen/Gass4_bg.jpg</IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>820513285c74e2f193ae0ce5521700689fe556a9c0fcb9ae1fa778e6b8f333a8</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000009</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>駐車場&lt;br&gt;満空情報</JP> \
				<EN>駐車場&lt;br&gt;満空情報</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>駐車場満空情報</JP> \
				<EN>駐車場満空情報</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>現在地周辺の駐車場の満空状態を『空』『満』と表示し、現在の状況を把握できます。</JP> \
				<EN>Display Parking Info("Vacant", "Full") nearby.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-07-30</APP_RELEASEDATE> \
			<APP_VER>2.0.1</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/2.0.1/headunit/Parking/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/2.0.1/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>6</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/1.0.0/screen/Parking1_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/1.0.0/screen/Parking2_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/1.0.0/screen/Parking3_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/parking_info/1.0.0/screen/Parking4_bg.jpg</IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>5ebb80b4d1d3b27aeb4a902c4644bd10252ae463c74af842f4f6c09e8c3bcb58</APP_ID> \
			<APP_CATEGORY>15市販用</APP_CATEGORY> \
			<APP_HTML5_ID>110000009</APP_HTML5_ID> \
			<APP_HTML5_TYPE>1</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Music</JP> \
				<EN>Music</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Music</JP> \
				<EN>Music</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>お持ちのスマートフォンのいつも聴いている音楽をナビ上で楽しめます。アーティストやアルバムの他にスマートフォンのプレイリストからも選曲することができます。</JP> \
				<EN>This music app will give you an easy access to the music files on your smartphone. Enjoy your favorite music with the car audio system.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-07-06</APP_RELEASEDATE> \
			<APP_VER>2.1.6</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/music/2.1.6/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/music/2.1.6/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>15</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/music/1.0.0/screen/Music-c01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/music/1.0.0/screen/Music-c02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/music/1.0.0/screen/Music-c03_bg.jpg</IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>1baa40eed9c2b9bf8550dbbd98bd7e3ffdb3f400003a3a5ef9bf85cadbe93bcf</APP_ID> \
			<APP_CATEGORY>15市販用</APP_CATEGORY> \
			<APP_HTML5_ID>210000050</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Calendar</JP> \
				<EN>Calendar</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Calendar</JP> \
				<EN>Calendar</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>Google カレンダーと同期しクルマの中で快適にスケジュールを確認できます。</JP> \
				<EN>This calendar app allows easy checking of your schedule while in your car. Also, you can sync this calendar with Google Calendar for a full understanding of your schedule.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-07-05</APP_RELEASEDATE> \
			<APP_VER>3.0.3</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/calendar/3.0.3/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/calendar/3.0.3/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>3</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/calendar/3.0.3/screen/calendar-c01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/calendar/3.0.3/screen/calendar-c02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/calendar/3.0.3/screen/calendar-c03_bg.jpg</IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>f09b2aac98dfd457c29b9d946e525b76abe8c2ffed780f194bfcc9765f433feb</APP_ID> \
			<APP_CATEGORY>15GPF用</APP_CATEGORY> \
			<APP_HTML5_ID>210000048</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>News</JP> \
				<EN>News</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>News</JP> \
				<EN>News</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>スマートフォンで登録したニュース配信元から最新ニュースを表示します。</JP> \
				<EN>Keep up to date while cruising down the road. This news app lets you easily catch the news in your car from your favorite news source.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-06-04</APP_RELEASEDATE> \
			<APP_VER>2.0.3</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/handset/index.html</APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>7</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/screen/News-c01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/screen/News-c02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/screen/News-c03_bg.jpg</IMG3> \
				<IMG4>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/screen/News-c04_bg.jpg</IMG4> \
				<IMG5>https://www.smt-access.com/tif/h5ContentsDownload/news/2.0.3/screen/News-c05_bg.jpg</IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>7bbe7b758484c89f5ac4046c6fcab5a2904a5007c990bb7baa91eba609117537</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000027</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>4car</JP> \
				<EN>4car</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>4car</JP> \
				<EN>4car</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP></JP> \
				<EN></EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2014-01-22</APP_RELEASEDATE> \
			<APP_VER>1.2.1</APP_VER> \
			<APP_PRICE_TYPE>0.00</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/4car/1.2.1/app/write_cookie.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL></APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>2</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>18</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1></IMG1> \
				<IMG2></IMG2> \
				<IMG3></IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
		<APP_INFO> \
			<APP_TYPE>3</APP_TYPE> \
			<APP_ID>ef580884c46bae2f68e16478fa28bf7fbad492684724e0c325d5041eb2c9b37d</APP_ID> \
			<APP_CATEGORY></APP_CATEGORY> \
			<APP_HTML5_ID>210000008</APP_HTML5_ID> \
			<APP_HTML5_TYPE>0</APP_HTML5_TYPE> \
			<APP_NAME> \
				<JP>Wallpaper</JP> \
				<EN>Wallpaper</EN> \
			</APP_NAME> \
			<APP_DESCRIPTION> \
				<JP>Wallpaper</JP> \
				<EN>Wallpaper</EN> \
			</APP_DESCRIPTION> \
			<APP_DESCRIPTION_LONG> \
				<JP>お好みの背景色や壁紙を変える事ができます。</JP> \
				<EN>Select and switch to favorite BG color and Wallpaper.</EN> \
			</APP_DESCRIPTION_LONG> \
			<APP_RELEASEDATE>2012-01-01</APP_RELEASEDATE> \
			<APP_VER>2.0.2</APP_VER> \
			<APP_PRICE_TYPE>0</APP_PRICE_TYPE> \
			<APP_TOP_URL>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/2.0.2/headunit/index.html</APP_TOP_URL> \
			<APP_SETTING_URL></APP_SETTING_URL> \
			<APP_ICON_DL_URL>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/2.0.2/icon</APP_ICON_DL_URL> \
			<APP_ORDER_ORIGIN_VERTICAL>1</APP_ORDER_ORIGIN_VERTICAL> \
			<APP_ORDER_ORIGIN_HORIZONTAL>23</APP_ORDER_ORIGIN_HORIZONTAL> \
			<VENDOR_NAME>Clarion</VENDOR_NAME> \
			<APP_IMAGES> \
				<IMG1>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_01_bg.jpg</IMG1> \
				<IMG2>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_02_bg.jpg</IMG2> \
				<IMG3>https://www.smt-access.com/tif/h5ContentsDownload/wallpaper/1.0.0/screen/Wallpaper_03_bg.jpg</IMG3> \
				<IMG4></IMG4> \
				<IMG5></IMG5> \
			</APP_IMAGES> \
		</APP_INFO> \
	</APP>';
})();

