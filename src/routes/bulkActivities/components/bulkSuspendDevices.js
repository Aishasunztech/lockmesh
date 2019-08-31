import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { ARE_YOU_SURE_YOU_WANT_ACTIVATE_THE_DEVICE, ARE_YOU_SURE_YOU_WANT_SUSPEND_THE_DEVICE } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkSuspendDevices extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleSuspendDevice = (devices) => {

        let device_ids = [];
        devices.forEach((item) => {
            device_ids.push(`${item.usr_device_id}`);
        });

        const title = `${convertToLang(this.props.translation["Are you sure, you want to suspend these devices "], "Are you sure, you want to suspend these devices ")}  ${devices.map((item, ) => `${item.device_id}, `)} ?`;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.suspendDevice(device_ids);
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
