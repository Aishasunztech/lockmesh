import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddForm from './AddForm';
import { ADD_DEVICE } from '../../../constants/ActionTypes';
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Add_Device } from '../../../constants/ButtonConstants';
import Invoice from './invoice';

export default class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            handleSubmit: null,
            preActive: false,
            invoiceVisible: false
        }
    }


    showModal = (device = null, handleSubmit, preActive = false) => {

        // console.log('device Detail', device)

        if (preActive !== undefined && preActive === true) {

            this.setState({

                device: device,
                visible: true,
                handleSubmit: handleSubmit,
                preActive: preActive
            });

        } else {
            this.setState({

                device: device,
                visible: true,
                handleSubmit: handleSubmit

            });
        }
        device.start_date = this.createdDate();
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
            // 'start_date': this.state.start_date,
            'email': this.state.email,
            'name': this.state.name,
            'model': this.state.model,
            'sttatus': this.state.status,
            'client_id': this.state.client_id,
            'connected_dealer': this.state.connected_dealer
        }
    }

    handleCancel = () => {
        this.setState({ visible: false, invoiceVisible: true });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width="600px"
                    visible={visible}
                    maskClosable={false}
                    title={convertToLang(this.props.translation[Button_Add_Device], "Add Device")} // "Add Device"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    destroyOnClose={true}
                    bodyStyle={{ height: 500, overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    <AddForm
                        device={this.state.device}
                        hideModal={this.handleCancel}
                        AddDeviceHandler={this.state.handleSubmit}
                        handleCancel={this.handleCancel}
                        preActive={this.state.preActive}
                        history={this.props.history}
                    />
                </Modal>

                <Invoice
                    invoiceVisible={this.state.invoiceVisible}
                    translation={this.props.translation}
                />
            </div>
        )

    }
}
