let hostName = window.location.hostname

let URL = "http://localhost:3000/";
let SUPERADMIN = "http://localhost:8042/";
let TITLE = "LockMesh";

switch (hostName) {
    case "localhost":
        // URL = 'http://localhost:3000/'
        // TITLE = "LockMesh"
        // SUPERADMIN = ''
        break;

    case "lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        break;
    case "www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        break;
    case "http://www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        break;
    case "https://www.lockmesh.com":
        URL = "https://api.lockmesh.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "LockMesh"
        break;
        
    case "titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "TitanLocker"
        break;
    case "www.titansecureserver.com":
            URL = "https://api.titansecureserver.com/"
            SUPERADMIN = 'https://api.meshguard.co/'
            TITLE = "TitanLocker"
            break;
    case "http://www.titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "TitanLocker"
        break;
    case "https://www.titansecureserver.com":
        URL = "https://api.titansecureserver.com/"
        SUPERADMIN = 'https://api.meshguard.co/'
        TITLE = "TitanLocker"
        break;    
    
    case "dev.lockmesh.com":
        URL = "https://devapi.lockmesh.com/"
        SUPERADMIN = 'https://devapi.meshguard.co/'
        TITLE = "LockMesh"
        break;
    default:
        // URL = "http://localhost:3000/";
        // TITLE = "LockMesh"
        // SUPERADMIN = ''
        break;
}

export const BASE_URL = URL;

export const APP_TITLE = TITLE;

export const SUPERADMIN_URL = `${SUPERADMIN}api/v1/`;
