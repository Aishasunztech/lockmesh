import { Modal } from 'antd';

import React, { Component } from 'react'

export default class SuspendDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleSuspendDevice = (device) => {
        const title = (device.account_status === "suspended") ? "Are you sure, you want to activate the device?" : "Are you sure, you want to suspend the device?";
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {
                this.props.suspendDevice(device);
                if(window.location.pathname.split("/").pop() !== 'devices')
                {
                    this.props.go_back();
                    this.props.getDevice();
                } 
            }),
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}