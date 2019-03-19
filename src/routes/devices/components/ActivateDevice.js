


import { Modal } from 'antd';

import React, { Component } from 'react'

export default class ActivateDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleActivateDevice = (device, refresh) => {

        this.confirm({
            title: 'Are you sure, you want to activate the device?',
            content: '',
            onOk: () => {
                
                this.props.activateDevice(device);
                if(window.location.pathname.split("/").pop() !== 'devices')
                {
                    refresh(device.device_id);
                   // console.log('activate device check', device);
                } 
            },
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}