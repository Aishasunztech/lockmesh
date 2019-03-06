import React, { Component } from 'react';
import { Modal, message } from 'antd';
import EditForm from './editForm';
let editDevice;
export default class editDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModal = (device, func) => {
        // console.log('device Detail', device)
        // alert('its working')
        editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,
            // visible: true,
            // sim_id: device.sim_id,
            // chat_id: device.chat_id,
            // pgp_email: device.pgp_email,
            // device_id: device.device_id,
            // s_dealer: device.s_dealer,
            // s_dealer_name: device.s_dealer_name,
            // expiry_date: device.expiry_date,
            // start_date: device.start_date,
            // email: device.email,
            // name: device.name,
            // model: device.model,
            // sttatus: device.status,
            // imei: device.imei,
            // imei2: device.imei2,
            // simno: device.simno,
            // simno2: device.simno2,
            // online: device.online,
            // link_code: device.link_code,
            // client_id: device.client_id,


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
            'email': this.state.email,
            'name': this.state.name,
            'model': this.state.model,
            'sttatus': this.state.status,
            'client_id': this.state.client_id,
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Modal
                    visible={visible}
                    title="Edit Device"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >

                    <EditForm 
                        device={this.state.device} 
                        hideModal={this.handleCancel} 
                        editDeviceFunc={this.state.func}
                        handleCancel={this.handleCancel} />

                </Modal>
            </div>
        )

    }
}