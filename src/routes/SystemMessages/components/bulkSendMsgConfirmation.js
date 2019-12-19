import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkSendMsg extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkSendMsg = (data) => {
        console.log("handleBulkSendMsg ", data);
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        data.devices.forEach((item) => {
            if (item.device_id) {
                selectedDevices.push({ device_id: item.device_id, usrAccId: item.id, usr_device_id: item.usr_device_id });
            }
        });
        data.dealers.forEach((item) => {
            dealer_ids.push(item.key);
        });
        data.users.forEach((item) => {
            user_ids.push(item.key);
        });

        let saveData = {
            selectedDevices,
            dealer_ids,
            user_ids,
            msg: data.msg,
            repeat: data.repeat,
            date: data.selected_date,
            timer: data.timer,
            start_day: data.start_day,
            time: data.time
        }

        console.log("saveData ", saveData);

        const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to send message on these selected devices ")} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                // this.props.sendMsgOnDevices(saveData);
                // this.props.handleCancel();
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
