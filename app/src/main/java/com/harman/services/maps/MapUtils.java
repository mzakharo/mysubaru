package com.harman.services.maps;

/* loaded from: classes.dex */
public class MapUtils {
    public static final String CONFIG_FILE_NAME = "config.json";
    public static final String CONFIG_FOLDER_NAME = "config";
    public static final int CancelFailed = 16;
    public static final int Delete_Region_Files_Already_Deleted = 2;
    public static final int Delete_Region_Files_Could_Not_Delete_Data = 4;
    public static final int Delete_Region_Files_Data_Not_Exits = 5;
    public static final int Delete_Region_Files_Download_InProgress = 6;
    public static final int Delete_Region_Files_Invalid_Region = 1;
    public static final int Delete_Region_Files_Success = 0;
    public static final int Delete_Region_Files_unknown_Error = 3;
    public static final String FILE_NAME_MAP_DETAILS = "map://CurrentMapDetails.json";
    public static final int FileNotExists = 18;
    public static final int Get_Available_Map_Update_No_Map_Data = 2;
    public static final int Get_Available_Map_Update_Success = 0;
    public static final int Get_Available_Map_Update_Unknown_Error = 1;
    public static final int Get_Current_Map_Details_Invalid_Parameter = 1;
    public static final int Get_Current_Map_Details_Network_Error = 3;
    public static final int Get_Current_Map_Details_Success = 0;
    public static final int Get_Current_Map_Details_Unknown_Error = 2;
    public static final int Get_Map_Subscription_Details_Invalid_Parameter = 1;
    public static final int Get_Map_Subscription_Details_Network_Error = 3;
    public static final int Get_Map_Subscription_Details_Success = 0;
    public static final int Get_Map_Subscription_Details_Unknown_Error = 2;
    public static final int Get_Region_Information_Invalid_Parameter = 1;
    public static final int Get_Region_Information_Network_Error = 3;
    public static final int Get_Region_Information_Success = 0;
    public static final int Get_Region_Information_Unknown_Error = 2;
    public static final int InvalidRequestParam = 20;
    public static final String KEY_ACCESSORY_FILE_TRANSFER_PROGRESS = "accessoryFileTransferProgress";
    public static final String KEY_ACCESSORY_IDS = "accessoryServiceIDs";
    public static final String KEY_ACCESSORY_INFORMATION = "accessoryInformation";
    public static final String KEY_APP_NAME = "appName";
    public static final String KEY_APP_SERVICE_IDS = "appServiceIDs";
    public static final String KEY_APP_VERSION = "appVersion";
    public static final String KEY_AVAILABLE_MAP_REGIONS = "availableMapRegions";
    public static final String KEY_BASELINE_ID = "baselineID";
    public static final String KEY_BASE_FILE_PATH = "baseFilePath";
    public static final String KEY_CURRENT_MAP_DETAILS = "currentMapDetails";
    public static final String KEY_CUSTOM_FIELD_KEY = "customFieldKey";
    public static final String KEY_CUSTOM_FIELD_VALUE = "customFieldValue";
    public static final String KEY_CUSTOM_INFO = "customInfo";
    public static final String KEY_DATA = "data";
    public static final String KEY_DESTINATION_SERVER = "dest";
    public static final String KEY_DEVICE_CODE = "deviceCode";
    public static final String KEY_DEVICE_ID = "deviceID";
    public static final String KEY_DEVICE_MODEL = "deviceModel";
    public static final String KEY_DEVICE_SW_VERSION = "deviceSWVersion";
    public static final String KEY_ERROR = "error";
    public static final String KEY_ERROR_CODE = "errorCode";
    public static final String KEY_FILE = "file";
    public static final String KEY_FILES = "files";
    public static final String KEY_FILE_ID = "fileID";
    public static final String KEY_FILE_TRANSFER_FAILURE = "notifyFileTransferFailure";
    public static final String KEY_FROM_VERSION = "fromVersion";
    public static final String KEY_HU_MODEL = "huModel";
    public static final String KEY_ID_PRODUCT = "id";
    public static final String KEY_INFO = "info";
    public static final String KEY_IS_DEBUG = "isDebug";
    public static final String KEY_LIBRARY_TYPE = "libraryType";
    public static final String KEY_MAKE = "make";
    public static final String KEY_MAP_ACCESSORY_TRANSFER_STATUS = "accessoryTransferStatus";
    public static final String KEY_MAP_CLEAR_DATA = "clearData";
    public static final String KEY_MAP_DATA_DELETE = "mapDataDelete";
    public static final String KEY_MAP_DOWNLOAD_STATUS = "downloadStatus";
    public static final String KEY_MAP_GET_CURRENT_MAP_DETAILS = "getCurrentMapDetails";
    public static final String KEY_MAP_INFORM_AUTO_DOWNLOAD_STATUS = "informAutoDownloadStatus";
    public static final String KEY_MAP_INFORM_AUTO_UPDATE_STATUS = "informAutoUpdateStatus";
    public static final String KEY_MAP_INFORM_NETWORK_STATUS = "informNetworkStatus";
    public static final String KEY_MAP_INSTALL_STATUS = "MapInstallStatus";
    public static final String KEY_MAP_JSON = "mapJson";
    public static final String KEY_MAP_KILL_AHA_SERVICE = "killAhaService";
    public static final String KEY_MAP_REMOVE_DEVICES = "removeDevices";
    public static final String KEY_MAP_STOP_AHA_SERVICE = "stopAhaService";
    public static final String KEY_MAP_SUBSCRIPTION_DETAILS = "mapSubscriptionDetails";
    public static final String KEY_MAP_SUBSCRIPTION_PARAMETER = "parameters";
    public static final String KEY_MODEL = "model";
    public static final String KEY_MODEL_YEAR = "modelYear";
    public static final String KEY_NETWORK_MODE = "mode";
    public static final String KEY_NOTIFY = "notify";
    public static final String KEY_NOTIFY_STATUS = "notifyStatus";
    public static final String KEY_NOTIFY_TRANSFER_STATUS = "accessoryTransferStatus";
    public static final String KEY_PRODUCTS = "products";
    public static final String KEY_PRODUCT_CODE = "productCode";
    public static final String KEY_PRODUCT_ID = "productID";
    public static final String KEY_PROGRESS = "progress";
    public static final String KEY_PROTOCOL_VERSION = "protocolVersion";
    public static final String KEY_QUERY = "query";
    public static final String KEY_QUERY_AUTO_DOWNLOAD_FLAG = "queryAutoDownloadFlag";
    public static final String KEY_QUERY_AUTO_UPDATE_FLAG = "queryAutoUpdateFlag";
    public static final String KEY_QUERY_DOWNLOAD_CHANNEL = "queryDownloadChannel";
    public static final String KEY_QUERY_MAP_UPDATE_FLAG = "queryMapUpdateFlag";
    public static final String KEY_QUERY_NETWORK_CONNECTIVITY_MODE = "queryNetworkConnectivityMode";
    public static final String KEY_QUERY_REGION_SETTINGS = "queryRegionSettings";
    public static final String KEY_REGION = "Regions";
    public static final String KEY_REGION_DOWNLOAD_PROGRESS = "regionsDownloadProgress";
    public static final String KEY_REGION_ID = "regionID";
    public static final String KEY_REGION_NAME = "regionName";
    public static final String KEY_REGION_UPDATE_AVAILABLE = "regionUpdateAvailable";
    public static final String KEY_RELATIVE_FILE_PATH = "relativePath";
    public static final String KEY_REQUEST_TYPE = "req";
    public static final String KEY_RESPONSE = "resp";
    public static final String KEY_RESPONSE_EXPIRY_DATE = "expiryDate";
    public static final String KEY_RESPONSE_NAME_ = "name";
    public static final String KEY_RESPONSE_SKU_ID = "skuId";
    public static final String KEY_RESPONSE_VALID = "valid";
    public static final String KEY_RESPONSE_VALUE = "value";
    public static final String KEY_RESP_CODE = "respCode";
    public static final String KEY_RESULT_CODE = "result";
    public static final String KEY_RETRIEVE_AVAILABLE_MAP_REGION = "retrieveAvailableMapRegions";
    public static final String KEY_SERIAL_NUMBER = "serialNumber";
    public static final String KEY_SERVICE_HAND_SHAKE = "serviceHandshake";
    public static final String KEY_SERVICE_ID = "serviceID";
    public static final String KEY_STATUS = "status";
    public static final String KEY_STATUS_CODE = "statusCode";
    public static final String KEY_SUBSCRIPTION = "subscription";
    public static final String KEY_SUBSCRIPTION_EXPIRY_STATUS = "mapSubscriptionExpiryStatus";
    public static final String KEY_SUPPLIER_ID = "supplierID";
    public static final String KEY_TOM_TOM_API_KEY = "apigee-key";
    public static final String KEY_TOM_TOM_API_KEY_GEN4 = "apigee-key-gen4";
    public static final String KEY_TOM_TOM_REQUIRED_SOFTWARE_VERSION = "required-software-version";
    public static final String KEY_TOM_TOM_URI = "tomtom-url";
    public static final String KEY_TOTAL_SIZE = "totalSize";
    public static final String KEY_TO_VERSION = "toVersion";
    public static final String KEY_TYPE = "type";
    public static final String KEY_UNINSTALL = "uninstalledUpdates";
    public static final String KEY_UPDATES = "Updates";
    public static final String KEY_UPDATE_TRANSFER_PROGRESS = "updateTransferProgress";
    public static final String KEY_VERSION_ID = "versionID";
    public static final String KEY_VIN = "VIN";
    public static final String MAP_ROOT_DIRECTORY_NAME = "Map_update";
    public static final String MUDP_GET_ENTITLEMENTS = "entitlements?";
    public static final String MUDP_SYSTEM_SETTINGS = "system-settings?";
    public static final String MUDP_UPLOAD_CONFIGURATION = "configurations?";
    public static final String MUDP_URL_TO_SERVER = "https://device.subaru-maps.com/api/";
    public static final int Map_Install_Completed = 3;
    public static final int Map_Install_Failed_Due_To_Disconnection = 4;
    public static final int Map_Install_Failed_InSufficient_Storage = 6;
    public static final int Map_Install_Failed_Invalid_Map_File = 7;
    public static final int Map_Install_Generic_Failure = 5;
    public static final int Map_Install_InProgress = 2;
    public static final int Map_Install_Initiated = 1;
    public static final int Map_Install_State_Invalid = 0;
    public static final int NetworkUnAvailable = 7;
    public static final int NoNetwork = 8;
    public static final int No_Error = 0;
    public static final String PREF_LIBRARY_TYPE_GEN4 = "Gen4";
    public static final String PREF_LIBRARY_TYPE_GEN5 = "Gen5";
    public static final String REQ_CANCEL_DOWNLOAD = "cancelDownload";
    public static final String REQ_CHECK_FOR_UPDATE = "checkForUpdate";
    public static final String REQ_DELETE_REGION_FILES = "deleteRegionFiles";
    public static final String REQ_ENTITLEMENT = "entitlement";
    public static final String REQ_GET_SERVICE_STATE = "getServiceState";
    public static final String REQ_MAP_UPDATE_AVAILABLE = "mapUpdateAvailable";
    public static final String REQ_SET_DEVICE_PROPERTIES = "setDeviceProperties";
    public static final String REQ_START_DOWNLOAD = "startDownload";
    public static final String REQ_SYNC_CURRENT_MAP_DETAILS = "syncCurrentMapDetails";
    public static final String REQ_UPLOAD_CURRENT_MAP_DETAILS = "uploadCurrentMapDetails";
    public static final int Remove_Devices_Invalid_Parameter = 1;
    public static final int Remove_Devices_Not_Able_Delete = 3;
    public static final int Remove_Devices_Not_Exists = 2;
    public static final int Remove_Devices_Success = 0;
    public static final int Response_Code_Invalid_JSON_Param = 1;
    public static final int Response_Code_Success = 0;
    public static final String SDK_PREFS_NAME = "SDKPrefsFile";
    public static final int ServiceAuthenticated = 3;
    public static final int ServiceEnabled = 5;
    public static final int ServiceNotAuthenticated = 2;
    public static final int ServiceNotEnabled = 4;
    public static final int ServiceSubscriptionFailure = 0;
    public static final int ServiceSubscriptionSuccess = 1;
    public static final int Start_Download_InCorrect_Download_Channel = 6;
    public static final int Start_Download_Invalid_Subscription = 3;
    public static final int Start_Download_No_Network = 5;
    public static final int Start_Download_Service_Disabled = 4;
    public static final int Start_Download_Success = 0;
    public static final int Start_Download_Unknown_Error = 2;
    public static final int Start_Download_invalid_Region = 1;
    public static final int Success = 0;
    public static final int Sync_JSON_Empty_File = 3;
    public static final int Sync_JSON_File_not_received = 1;
    public static final int Sync_JSON_Success = 0;
    public static final int Sync_JSON_Unknown_error = 2;
    public static final String TO_BE_UPDATED_MAP_DETAILS_JSON_FILE_NAME = "ToBeUpdatedMapDetails.json";
    public static final String URL_DEVICE_CODE = "deviceCode=";
    public static final String URL_KEY = "key=";
    public static final String URL_KEY_CURRENT_MAP = "current-map";
    public static final String URL_KEY_LICENCE = "licenses";
    public static final String URL_KEY_TOM_TOM_URL = "tomtom-url";
    public static final String URL_PRODUCE_CODE = "productCode=";
    public static final String URL_SKU_ID = "skuId=";
    public static final String URL_VIN_CODE = "vin=";
    public static final int UnknownError = 6;
    public static final int Upload_JSON_Empty_File = 5;
    public static final int Upload_JSON_File_Not_Received = 4;
    public static final int Upload_JSON_Invalid_Param = 1;
    public static final int Upload_JSON_Network_Failure = 2;
    public static final int Upload_JSON_No_Network_Added_To_Queue = 6;
    public static final int Upload_JSON_Success = 0;
    public static final int Upload_JSON_Unknown_Error = 3;
    public static final String VALUE_MAP_SUBSCRIPTION_STATUS = "mapSubsciptionStatus";
    public static final int cancel_Download_Already_Downloaded = 3;
    public static final int cancel_Download_Failure_UnknownError = 2;
    public static final int cancel_Download_Invalid_Region = 1;
    public static final int cancel_Download_Not_Exits = 4;
    public static final int cancel_Download_Success = 0;
}
