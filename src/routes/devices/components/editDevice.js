import React, { Component } from 'react';
import { Modal, message } from 'antd';
import EditForm from './editForm';
import { convertToLang } from '../../utils/commonUtils'
import { DEVICE_ID, DEVICE_EDIT } from '../../../constants/DeviceConstants';
import { EDIT_DEVICE } from '../../../constants/ActionTypes';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
let editDevice;
export default class EditDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: {}
        }
    }

    showModal = (device, func) => {
        // console.log('device Detail', device)
        // alert('its working')
        editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,

        });

    }


    handleSubmit = (e) => {
        e.preventDefault();
        let formData = {
            'device_id': this.state.device_id,
            'sim_id': this.state.sim_id,
            'chat_id': this.state.chat_id,
            'pgp_email': this.state.pgp_email,
            's_dealer': this.state.s_dealer,
            'expiry_date': this.state.expiry_date,
            'start_date': this.state.start_date,
            'account_email': this.state.email,
            'name': this.state.name,
            'model': this.state.model,
            'sttatus': this.state.status,
            'client_id': this.state.client_id,
        }
    }

    handleCancel = () => {
        this.refs.editForm.getWrappedInstance().resetFields();
        this.setState({
            visible: false

        });
    }
    render() {
        const { visible, loading } = this.state;

        return (
            <div>

                <Modal
                    width="600px"
                    visible={visible}
                    maskClosable={false}
                    title={<div> {convertToLang(this.props.translation[DEVICE_EDIT], DEVICE_EDIT)} <br /> <span> {convertToLang(this.props.translation[DEVICE_ID], DEVICE_ID)}: {this.state.device.device_id} </span></div>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    maskClosable={false}
                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    <EditForm
                        ref='editForm'
                        device={this.state.device}
                        hideModal={this.handleCancel}
                        editDeviceFunc={this.state.func}
                        handleCancel={this.handleCancel}
                    // translation={this.props.translation}
                    />

                </Modal>
            </div>
        )

    }
}