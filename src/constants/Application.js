import packageJson from '../../package.json';


let hostName = window.location.hostname

let URL = "http://localhost:3000/";
let SUPERADMIN = "http://localhost:8042/";
let TITLE = packageJson.name;

switch (hostName) {
    case "localhost":
        // URL = 'http://localhost:3000/'
        // TITLE = "LockMesh"
        // SUPERADMIN = ''
        break;

    case "lockmesh.com":
    case "www.lockmesh.com":
    case "http://www.lockmesh.com":
    case "https://www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        break;

    case "titansecureserver.com":
    case "www.titansecureserver.com":
    case "http://www.titansecureserver.com":
    case "https://www.titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "TitanLocker"
        break;

    case "dev.lockmesh.com":
    case "http://dev.lockmesh.com":
    case "https://dev.lockmesh.com":
        URL = "https://devapi.lockmesh.com/"
        SUPERADMIN = 'https://devapi.meshguard.co/'
        TITLE = "LockMesh"
        break;

    case "cryptc.lockmesh.com":
    case "http://cryptc.lockmesh.com":
    case "https://cryptc.lockmesh.com":
        URL = "https://cryptcapi.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "CryptPhoneC"
        break;

    case "cryptk.lockmesh.com":
    case "http://cryptk.lockmesh.com":
    case "https://cryptk.lockmesh.com":
        URL = "https://cryptkapi.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "CryptPhoneK"
        break;

    default:
        // URL = "http://localhost:3000/";
        // TITLE = "LockMesh"
        // SUPERADMIN = ''
        break;
}


export const HOST_NAME = hostName;
 
export const BASE_URL = URL;

export const APP_TITLE = TITLE;

export const SUPERADMIN_URL = `${SUPERADMIN}api/v1/`;

// APP Constants
export const VERSION = packageJson.version;