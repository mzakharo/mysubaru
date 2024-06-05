/**
 * downloadStatus = 13が帰ってくる
 */
var MapDownloadSenario_Redmine9255 = (function () {

    function MapDownloadSenario_Redmine9255() {
        this.queue = [];
        this.setDonloaded([344, 345]);
    }

    MapDownloadSenarioManager.MapDownloadSenario_Redmine9255 = MapDownloadSenario_Redmine9255;

    MapDownloadSenario_Redmine9255.prototype.setDonloaded = function (regionIDList) {
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

    MapDownloadSenario_Redmine9255.prototype.start = function () {

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
                                "version_id": 3,
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
                                "size": 17896,
                                "id": 420,
                                "version_id": 3,
                                "state_iso": "",
                                "name": "Lesser Antilles",
                                "country_iso": "BLM,GLP,MAF,MTQ,SXM"
                            },
                            {
                                "size": 6916,
                                "id": 425,
                                "version_id": 3,
                                "state_iso": "",
                                "name": "Belize",
                                "country_iso": "BLZ"
                            },
                            {
                                "size": 26252,
                                "id": 433,
                                "version_id": 3,
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
                                "size": 26184,
                                "id": 438,
                                "version_id": 3,
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
                                "size": 17376,
                                "id": 451,
                                "version_id": 3,
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
        });

        var regionIDList = [304];
        for (var index = 0; index < regionIDList.length; index++) {
            var regionID = regionIDList[index];
            queue.push({
                "notify": "downloadStatus",
                "data": [
                    {
                        "deviceCode": "891167361",
                        "status": 13,
                        "toVersion": 3,
                        "productCode": "3122895924",
                        "regionID": regionID,
                        "productID": 4663057,
                        "totalSize": 2658728,
                        "fromVersion": 3,
                        "baselineID": 14738,
                        "supplierID": 28
                    }
                ]
            });

        }
    }

    return MapDownloadSenario_Redmine9255;
})();