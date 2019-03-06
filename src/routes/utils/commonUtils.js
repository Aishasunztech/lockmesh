module.exports = {

    getStatus: function (status, account_status, unlink_status, device_status) {

        if (device_status === '0' || device_status === 0) {
            return 'new-device';
        }
        else if (status === 'active' && account_status === '' && unlink_status === 0) {
            return 'active';
        } else if (status === 'expired' && account_status === '' && unlink_status === 0) {
            return 'expired';
        } else if (status === 'active' && account_status === 'suspended' && unlink_status === 0) {
            return 'suspended';
        }
        else if (unlink_status === '1') {
            return 'unlinked'
        }
        else {
            return 'N/A';
        }
    },
    getDealerStatus: function (unlink_status, account_status) {
        if (unlink_status === 1) {
            return "unlinked";
        } else if (account_status === '' && unlink_status === 0) {
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