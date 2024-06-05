/**
 * 正常シナリオ（アプリ起動〜地図DL〜転送完了）
 * ヨーロッパ諸国
 * 117(Greece), 147(United Kingdom), 180(Russia)
 */
var MapDownloadSenario_DL_Transfer_Map_Europe = (function () {

    function MapDownloadSenario_DL_Transfer_Map_Europe() {
        this.queue = [];
        this.setDonloaded([117]);
    }

    MapDownloadSenarioManager.MapDownloadSenario_DL_Transfer_Map_Europe = MapDownloadSenario_DL_Transfer_Map_Europe;

    MapDownloadSenario_DL_Transfer_Map_Europe.prototype.setDonloaded = function (regionIDList) {
        try {
            MobileOtaGen4.AhaConnectSDKControllerGen4.stubDownloadedRegionID = [];
            var targetIds = MobileOtaGen4.AhaConnectSDKControllerGen4.stubDownloadedRegionID;
            for (var i = 0; i < regionIDList.length; i++) {
                targetIds.push(regionIDList[i]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    MapDownloadSenario_DL_Transfer_Map_Europe.prototype.start = function () {

        var regionIDList = [117, 147, 180];     //Europe
        var queue = this.queue;
        queue.push({
            "notify": "accessoryInformation",
            "info": {
                "make": "SUBARU",
                "deviceCode": "891167361",
                "protocolVersion": "11609",
                "VIN": "0000",
                "huModel": "CP1.00",
                "model": "0000",
                "serialNumber": "0000",
                "productCode": "3122895924",
                "modelYear": "0000"
            }
        }
        );

        queue.push({
            "notify": "mapSubscriptionDetails",
            "data": [
                {
                    "expiryDate": "2020-12-04",
                    "deviceCode": "891167361",
                    "valid": true,
                    "productCode": "3122895924"
                }
            ]
        }
        );
        queue.push({
            "notify": "currentMapDetails",
            "deviceCode": "891167361",
            "productCode": "3122895924",
            "mapJson": {
                "used_map_space": 14464940,
                "available_map_space": -1,
                "timestamp": 574040779,
                "nds_product": [
                    {
                        "id": 4663057,
                        "version_id": 1,
                        "size": 14464940,
                        "nds_region": [{
							"size": 17252, 
							"id": 100,
							"version_id": 1,
							"state_iso": "",
							"name": "Albania",
							"country_iso": "ALB"
						},{
							"size": 17252, 
							"id": 102,
							"version_id": 1,
							"state_iso": "",
							"name": "Austria",
							"country_iso": "AUT"
						},{
							"size": 17252, 
							"id": 104,
							"version_id": 1,
							"state_iso": "",
							"name": "Belarus",
							"country_iso": "BLR"
						},
						{
							"size": 17252, 
							"id": 105,
							"version_id": 1,
							"state_iso": "",
							"name": "Belgium",
							"country_iso": "BEL"
						},
						{
							"size": 17252, 
							"id": 106,
							"version_id": 1,
							"state_iso": "",
							"name": "Bosnia and Herzegovina",
							"country_iso": "BIH"
						},
						{
							"size": 17252, 
							"id": 107,
							"version_id": 1,
							"state_iso": "",
							"name": "Bulgaria",
							"country_iso": "BGR"
						},
						{
							"size": 17252, 
							"id": 108,
							"version_id": 1,
							"state_iso": "",
							"name": "Croatia",
							"country_iso": "HRV"
						},
						{
							"size": 17252, 
							"id": 109,
							"version_id": 1,
							"state_iso": "",
							"name": "Cyprus",
							"country_iso": "CYP"
						},
						{
							"size": 17252, 
							"id": 110,
							"version_id": 1,
							"state_iso": "",
							"name": "Czech",
							"country_iso": "CZE"
						},
						{
							"size": 17252, 
							"id": 111,
							"version_id": 1,
							"state_iso": "",
							"name": "Denmark",
							"country_iso": "DNK"
						},
						{
							"size": 17252, 
							"id": 112,
							"version_id": 1,
							"state_iso": "",
							"name": "Estonia",
							"country_iso": "EST"
						},
						{
							"size": 17252, 
							"id": 113,
							"version_id": 1,
							"state_iso": "",
							"name": "Finland",
							"country_iso": "FIN"
						},
						{
							"size": 17252, 
							"id": 114,
							"version_id": 1,
							"state_iso": "",
							"name": "France",
							"country_iso": "FRA, MCO"
						},
						{
							"size": 17252, 
							"id": 116,
							"version_id": 1,
							"state_iso": "",
							"name": "Germany",
							"country_iso": "DEU"
						},
						{
							"size": 17252, 
							"id": 117,
							"version_id": 1,
							"state_iso": "",
							"name": "Greece",
							"country_iso": "GRC"
						},
						{
							"size": 17252, 
							"id": 119,
							"version_id": 1,
							"state_iso": "",
							"name": "Hungary",
							"country_iso": "HUN"
						},
						{
							"size": 17252, 
							"id": 120,
							"version_id": 1,
							"state_iso": "",
							"name": "Iceland",
							"country_iso": "ISL"
						},
						{
							"size": 17252, 
							"id": 121,
							"version_id": 1,
							"state_iso": "",
							"name": "Ireland",
							"country_iso": "IRL"
						},
						{
							"size": 17252, 
							"id": 122,
							"version_id": 1,
							"state_iso": "",
							"name": "Italy",
							"country_iso": "ITA, SMR, VAT"
						},
						{
							"size": 17252, 
							"id": 125,
							"version_id": 1,
							"state_iso": "",
							"name": "Latvia",
							"country_iso": "LVA"
						},
						{
							"size": 17252, 
							"id": 126,
							"version_id": 1,
							"state_iso": "",
							"name": "Lithuania",
							"country_iso": "LTU"
						},
						{
							"size": 17252, 
							"id": 127,
							"version_id": 1,
							"state_iso": "",
							"name": "Luxembourg",
							"country_iso": "LUX"
						},
						{
							"size": 17252, 
							"id": 128,
							"version_id": 1,
							"state_iso": "",
							"name": "Macedonia",
							"country_iso": "MKD"
						},
						{
							"size": 17252, 
							"id": 129,
							"version_id": 1,
							"state_iso": "",
							"name": "Malta",
							"country_iso": "MLT"
						},
						{
							"size": 17252, 
							"id": 130,
							"version_id": 1,
							"state_iso": "",
							"name": "Moldova",
							"country_iso": "MDA"
						},
						{
							"size": 17252, 
							"id": 131,
							"version_id": 1,
							"state_iso": "",
							"name": "Montenegro",
							"country_iso": "MNE"
						},
						{
							"size": 17252, 
							"id": 132,
							"version_id": 1,
							"state_iso": "",
							"name": "Norway",
							"country_iso": "NOR"
						},
						{
							"size": 17252, 
							"id": 133,
							"version_id": 1,
							"state_iso": "",
							"name": "Poland",
							"country_iso": "POL"
						},
						{
							"size": 17252, 
							"id": 134,
							"version_id": 1,
							"state_iso": "",
							"name": "Portugal",
							"country_iso": "PRT"
						},
						{
							"size": 17252, 
							"id": 135,
							"version_id": 1,
							"state_iso": "",
							"name": "Romania",
							"country_iso": "ROU"
						},
						{
							"size": 17252, 
							"id": 136,
							"version_id": 1,
							"state_iso": "",
							"name": "Serbia",
							"country_iso": "SRB, XKS"
						},
						{
							"size": 17252, 
							"id": 137,
							"version_id": 1,
							"state_iso": "",
							"name": "Slovakia",
							"country_iso": "SVK"
						},
						{
							"size": 17252, 
							"id": 138,
							"version_id": 1,
							"state_iso": "",
							"name": "Slovenia",
							"country_iso": "SVN"
						},
						{
							"size": 17252, 
							"id": 139,
							"version_id": 1,
							"state_iso": "",
							"name": "Spain",
							"country_iso": "AND, ESP, GIB"
						},
						{
							"size": 17252, 
							"id": 140,
							"version_id": 1,
							"state_iso": "",
							"name": "Sweden",
							"country_iso": "SWE"
						},
						{
							"size": 17252, 
							"id": 141,
							"version_id": 1,
							"state_iso": "",
							"name": "Switzerland",
							"country_iso": "CHE, LIE"
						},
						{
							"size": 17252, 
							"id": 143,
							"version_id": 1,
							"state_iso": "",
							"name": "The Netherlands",
							"country_iso": "NLD"
						},
						{
							"size": 17252, 
							"id": 144,
							"version_id": 1,
							"state_iso": "",
							"name": "Turkey",
							"country_iso": "TUR"
						},
						{
							"size": 17252, 
							"id": 146,
							"version_id": 1,
							"state_iso": "",
							"name": "Ukraine",
							"country_iso": "UKR"
						},
						{
							"size": 17252, 
							"id": 147,
							"version_id": 1,
							"state_iso": "",
							"name": "United Kingdom",
							"country_iso": "GBR"
						},
						{
							"size": 17252, 
							"id": 148,
							"version_id": 1,
							"state_iso": "",
							"name": "Faroe Islands",
							"country_iso": "FRO"
						},
						{
							"size": 17252, 
							"id": 150,
							"version_id": 1,
							"state_iso": "",
							"name": "Caucasus",
							"country_iso": "ARM, AZE, GEO"
						},
						{
							"size": 17252, 
							"id": 151,
							"version_id": 1,
							"state_iso": "",
							"name": "Greenland",
							"country_iso": "GRL"
						},
						{
							"size": 17252, 
							"id": 180,
							"version_id": 1,
							"state_iso": "",
							"name": "Russia",
							"country_iso": "RUS"
						},
						{
							"size": 17252, 
							"id": 900,
							"version_id": 1,
							"state_iso": "",
							"name": "International Waters",
							"country_iso": "XXX"
						}
					],
                        "baseline_id": 14738,
                        "supplier_id": 28,
                        "name": "Europe"
                    }
                ],
                "device_code": "891167361",
                "product_code": "3122895924"
            }
        });

        for (var index = 0; index < regionIDList.length; index++) {
            var regionID = regionIDList[index];
            queue.push({
                "notify": "downloadStatus",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "status": 1,
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": regionID,
                        "productID": 4663057,
                        "totalSize": 2658728,
                        "fromVersion": 1,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });

            for (var i = 1; i < 11; i++) {
                queue.push({
                    "notify": "regionsDownloadProgress",
                    "data": [
                        {
                            "deviceCode": "891167361",
                            "status": 2,
                            "toVersion": 3,
                            "productCode": "3122895924",
                            "regionID": regionID,
                            "productID": 4663057,
                            "totalSize": 2658728,
                            "fromVersion": 1,
                            "baselineID": 14738,
                            "supplierID": 28,
                            "progress": i * 10
                        }
                    ]
                });
            }
            queue.push({
                "notify": "downloadComplete",
                "data": [
                    {
                        "fileID": "\/TT\/8911673613122895924\/28\/14738\/4663057\/452\/452.json",
                        "toVersion": 3,
                        "regionID": regionID,
                        "productID": 4663057,
                        "fromVersion": 1,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });
            queue.push({
                "notify": "regionUpdateAvailable",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "fileID": "\/TT\/8911673613122895924\/28\/14738\/4663057\/452\/452.json",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": regionID,
                        "productID": 4663057,
                        "totalSize": 2658728,
                        "fromVersion": 1,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });
            queue.push({
                "notify": "downloadStatus",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "status": 3,
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": regionID,
                        "productID": 4663057,
                        "totalSize": 2658728,
                        "fromVersion": 1,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });
        }
        for (var index = 0; index < regionIDList.length; index++) {
            var regionID = regionIDList[index];
            for (var i = 1; i < 11; i++) {
                queue.push({
                    "notify": "accessoryFileTransferProgress",
                    "data": [
                        {
                            "deviceCode": "891167361",
                            "toVersion": 3,
                            "productCode": "3122895924",
                            "totalSize": 0,
                            "productID": 4663057,
                            "regionID": regionID,
                            "fromVersion": 1,
                            "supplierID": 28,
                            "progress": i * 10,
                            "baselineID": 14738
                        }
                    ]
                });
            }
            queue.push({
                "notify": "accessoryTransferStatus",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": regionID,
                        "productID": 4663057,
                        "accessoryTransferStatus": 3,
                        "fromVersion": 1,
                        "supplierID": 28,
                        "baselineID": 14738
                    }
                ]
            });
        }
    }

    return MapDownloadSenario_DL_Transfer_Map_Europe;
})();