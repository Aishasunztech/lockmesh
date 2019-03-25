module.exports = {

    getStatus: function (status, account_status, unlink_status, device_status, activation_status) {

        if (status === 'active' && (account_status === '' || account_status === null) && unlink_status === 0 && (device_status === 1 || device_status === '1')) {
            return 'Activated';
        } else if (status === 'expired') {
            return 'Expired';
        } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === null || activation_status === '')) {
            return 'Pending activation';
        } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === 0)) {
            return 'Pre-activated';
        } else if ((unlink_status === '1' || unlink_status === 1) && (device_status === 0 || device_status === '0')) {
            // console.log("hello unlinked");
            return 'Unlinked';
        } else if (account_status === 'suspended') {
            return 'Suspended';
        } else {
            return 'N/A';
        }
    },
    
    getColor: function (status) {
        switch (status) {
            case 'Activated':
                return { color: "#008000" };

            case 'Pre-activated':
                return { color: "#0000FF" };

            case 'Expired':
                return { color: "#FF0000" };
            case 'Unlinked':
                return { color: "#FFA500" };
            case 'Suspended':
                return { color: "#808080" };
            case 'Pending activation':
                return { color: "#cccc0e" };

            default:
                return {};
        }
    },

    checkValue: function (value){
        if(value !== undefined && value !== '' && value!=null && value !== 'undefined' && value !=='null'){
            return value;
        } else {
            return 'N/A';
        }
    },
    getDealerStatus: function (unlink_status, account_status) {
        if (unlink_status === 1) {
            return "unlinked";
        } else if ((account_status === '' || account_status === null) && (unlink_status === 0)) {
            return 'active'
        } else if (account_status === 'suspended') {
            return 'suspended';
        } else {
            return 'N/A';
        }
    },

    componentSearch: function (arr, search) {
        let foundDevices = [];
        let obks = Object.keys(arr[0]);
        arr.map((el) => {
            obks.some((obk) => {
                if (obk) {
                    let temp = el[obk];
                    if ((typeof temp) === 'string') {
                        if (temp.toLowerCase().includes(search.toLowerCase())) {
                            foundDevices.push(el);
                            return true;
                        }
                    }
                }
            });
        })
        return foundDevices;
    }

}