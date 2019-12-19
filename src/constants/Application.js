import packageJson from '../../package.json';


let hostName = window.location.hostname

let URL = "http://localhost:3000/";
let SUPERADMIN = "http://localhost:8042/";
let TITLE = packageJson.name;
let CHARSET = 'UTF-8';
let TIMEZONE = "Asia/Karachi";

switch (hostName) {
    case "localhost":
        break;

    // dev server
    case "dev.lockmesh.com":
    case "http://dev.lockmesh.com":
    case "https://dev.lockmesh.com":
        URL = "https://devapi.lockmesh.com/"
        SUPERADMIN = 'https://devapi.meshguard.co/'
        TITLE = "LockMesh"
        TIMEZONE = "Europe/Berlin"
        break;

    // pre dev server for unfinished work
    case "predev.lockmesh.com":
    case "http://predev.lockmesh.com":
    case "https://predev.lockmesh.com":
        URL = "https://predevapi.lockmesh.com/"
        SUPERADMIN = 'https://devapi.meshguard.co/'
        TITLE = "LockMesh"
        TIMEZONE = "Europe/Berlin"
        break;

    // for load testing = live LM
    case "loadtester.lockmesh.com":
    case "http://loadtester.lockmesh.com":
    case "https://loadtester.lockmesh.com":
        URL = "https://loadtesterapi.lockmesh.com/"
        SUPERADMIN = 'https://devapi.meshguard.co/'
        TITLE = "LockMesh"
        TIMEZONE = "Europe/Berlin"
        break;

    // Live systems
    case "lockmesh.com":
    case "www.lockmesh.com":
    case "http://www.lockmesh.com":
    case "https://www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        TIMEZONE = "Europe/Berlin"
        break;

    case "titansecureserver.com":
    case "www.titansecureserver.com":
    case "http://www.titansecureserver.com":
    case "https://www.titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "TitanLocker"
        TIMEZONE = "Europe/Berlin"
        break;

    case "cryptc.lockmesh.com":
    case "http://cryptc.lockmesh.com":
    case "https://cryptc.lockmesh.com":
        URL = "https://cryptcapi.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "CryptPhoneC"
        TIMEZONE = "Europe/Berlin"
        break;

    case "cryptk.lockmesh.com":
    case "http://cryptk.lockmesh.com":
    case "https://cryptk.lockmesh.com":
        URL = "https://cryptkapi.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "CryptPhoneK"
        TIMEZONE = "Europe/Berlin"
        break;

    default:
        break;
}

export const HOST_NAME = hostName;
export const BASE_URL = URL;
export const APP_TITLE = TITLE;
export const SUPERADMIN_URL = `${SUPERADMIN}api/v1/`;

export const CHAR_SET = CHARSET;
export const SERVER_TIMEZONE = TIMEZONE;

// APP Constants
export const VERSION = packageJson.version;


// DATE TIME CONSTATNS
export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const TIMESTAMP_FORMAT_NOT_Sec = "YYYY-MM-DD HH:mm";
export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "HH:mm:ss";