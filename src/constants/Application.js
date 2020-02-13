import packageJson from '../../package.json';


let hostName = window.location.hostname

let URL = "http://localhost:3000/";
let SOCKET_URL = 'ws://localhost:3000';
let SUPPORT_SOCKET = "http://localhost:3010";

let SUPPORT = "http://localhost:3010/v1/";
let SUPERADMIN = "http://localhost:8042/";

let TITLE = packageJson.name;
let CHARSET = 'UTF-8';

// set default timezone for local test
let TIMEZONE = "Europe/London" // "Asia/Karachi";

let LOG_SERVER_BASE_URL = 'http://localhost:3005';
let SysName = hostName;

let SysId = 0;

switch (hostName) {
    case "localhost":
        break;

    // dev server
    case "dev.lockmesh.com":
    case "http://dev.lockmesh.com":
    case "https://dev.lockmesh.com":
        URL = "https://devapi.lockmesh.com/";
        SOCKET_URL = 'wss://devapi.lockmesh.com';

        SUPPORT = "https://devapi.lockmesh.com/support/v1/"
        SUPPORT_SOCKET = "https://devapi.lockmesh.com";
        SUPERADMIN = 'https://devapi.meshguard.co/';
        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        SysId = 2;

        TITLE = "LockMesh"
        TIMEZONE = "Europe/London"
        break;

    // pre dev server for unfinished work
    case "predev.lockmesh.com":
    case "http://predev.lockmesh.com":
    case "https://predev.lockmesh.com":
        URL = "https://predevapi.lockmesh.com/"
        SOCKET_URL = 'wss://predevapi.lockmesh.com';

        SUPERADMIN = 'https://devapi.meshguard.co/'
        SUPPORT = "https://predevsupport.lockmesh.com/"

        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        SysId = 3;

        TITLE = "LockMesh"
        TIMEZONE = "Europe/London"
        break;

    // for load testing = live LM
    case "loadtester.lockmesh.com":
    case "http://loadtester.lockmesh.com":
    case "https://loadtester.lockmesh.com":
        URL = "https://loadtesterapi.lockmesh.com/"
        SOCKET_URL = 'wss://loadtesterapi.lockmesh.com';

        SUPERADMIN = 'https://devapi.meshguard.co/';
        SysId = 4;

        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        TITLE = "LockMesh"
        TIMEZONE = "Europe/London"
        break;

    // Live systems
    case "lockmesh.com":
    case "www.lockmesh.com":
    case "http://www.lockmesh.com":
    case "https://www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SOCKET_URL = 'wss://api.lockmesh.com';

        SUPPORT = "https://api.lockmesh.com/support/v1/"
        SUPPORT_SOCKET = "https://api.lockmesh.com";
        SUPERADMIN = 'https://api.meshguard.co/';
        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        SysId = 1;

        TITLE = "LockMesh"
        TIMEZONE = "Europe/London"
        break;

    case "titansecureserver.com":
    case "www.titansecureserver.com":
    case "http://www.titansecureserver.com":
    case "https://www.titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SOCKET_URL = 'wss://api.titansecureserver.com';

        SysId = 6;

        SUPERADMIN = 'https://api.meshguard.co/';
        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        TITLE = "TitanLocker"
        TIMEZONE = "Europe/London"
        break;

    case "cryptc.lockmesh.com":
    case "http://cryptc.lockmesh.com":
    case "https://cryptc.lockmesh.com":
        URL = "https://cryptcapi.lockmesh.com/";
        SOCKET_URL = 'wss://cryptcapi.lockmesh.com';

        SysId = 7;

        SUPERADMIN = 'https://api.meshguard.co/';
        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        TITLE = "CryptPhoneC"
        TIMEZONE = "Europe/London"
        break;

    case "cryptk.lockmesh.com":
    case "http://cryptk.lockmesh.com":
    case "https://cryptk.lockmesh.com":
        URL = "https://cryptkapi.lockmesh.com/"
        SOCKET_URL = 'wss://cryptkapi.lockmesh.com';

        SysId = 8;

        SUPERADMIN = 'https://api.meshguard.co/';
        LOG_SERVER_BASE_URL = 'https://logs.lockmesh.com';
        TITLE = "CryptPhoneK"
        TIMEZONE = "Europe/London"
        break;

    default:
        break;
}

export const HOST_NAME = hostName;
export const BASE_URL = URL;
export const SOCKET_BASE_URL = SOCKET_URL;
export const SUPPORT_SOCKET_URL = SUPPORT_SOCKET;

export const SUPPORT_URL = SUPPORT;
export const APP_TITLE = TITLE;
export const SUPERADMIN_URL = `${SUPERADMIN}api/v1/`;

export const CHAR_SET = CHARSET;
export const SERVER_TIMEZONE = TIMEZONE;

export const SYSTEM_ID = SysId;
export const SYSTEM_NAME = SysName;

export const LOG_SERVER_URL = LOG_SERVER_BASE_URL;

// APP Constants
export const VERSION = packageJson.version;

export const LOGSERVER_AUTH_USER = 'JBtRRpFqVcYFMggnsxpPh';
export const LOGSERVER_AUTH_PASS = '2qouqd#uk$*UcnQYwQKXoP4TX9vJSD';


// DATE TIME CONSTATNS
export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const TIMESTAMP_FORMAT_NOT_SEC = "YYYY-MM-DD HH:mm";
export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "HH:mm:ss";
export const TIME_FORMAT_HM = "HH:mm";
