import { Modal, Button } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { ARE_YOU_SURE_YOU_WANT_ACTIVATE_THE_DEVICE } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';

export default class BulkActivateDevices extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleActivateDevice = (devices, dealers, users) => {

        let device_ids = [];
        let dealer_ids = [];
        let user_ids = [];

        devices.forEach((item) => {
            device_ids.push(item.usr_device_id);
        });
        dealers.forEach((item) => {
            dealer_ids.push(item.key);
        });
        users.forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            device_ids,
            dealer_ids,
            user_ids
        }

        this.confirm({
            title: `${convertToLang(this.props.translation[""], "Would you like to unsuspend these Device ")} ${devices.map((item) => `${item.device_id}, `)} ?`,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: () => {
                this.props.bulkActivateDevice(data);
            },
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
