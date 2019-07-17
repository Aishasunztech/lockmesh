import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddRegistrationForm from './AddRegistrationForm';



export default class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            // handleSubmit: null,
            preActive: false
        }
    }


    showModal = () => {
        // console.log('device sim')
        this.setState({
            visible: true,
            // handleSubmit: handleSubmit,
        });

    }


    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('hi')
    //     // let formData = {
    //     //     'device_id': this.state.device_id,
    //     //     'sim_id': this.state.sim_id,
    //     //     'chat_id': this.state.chat_id,
    //     //     'pgp_email': this.state.pgp_email,
    //     //     's_dealer': this.state.s_dealer,
    //     //     'expiry_date': this.state.expiry_date,
    //     //     // 'start_date': this.state.start_date,
    //     //     'email': this.state.email,
    //     //     'name': this.state.name,
    //     //     'model': this.state.model,
    //     //     'sttatus': this.state.status,
    //     //     'client_id': this.state.client_id,
    //     //     'connected_dealer': this.state.connected_dealer
    //     // }
    // }

    handleCancel = () => {
        this.refs.add_sim_reg_form.resetFields();
        this.setState({ visible: false });
    }

    handleSubmitReg = (values) => {
        this.props.simRegister(values);
        // this.setState({
        //     handleSubmit: values
        // })
    }

    render() {
        // console.log('done: ', this.state.handleSubmit)
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    title="Add Sim Registration" // {convertToLang(this.props.translation[SETTINGS_TO_BE_SENT_TO_DEVICE], "Confirm new Settings to be sent to Device ")}
                    visible={visible}
                    footer={null}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                // onOk={() => {
                //     this.showSaveProfileModal(true, 'profile')
                //     this.setState({ showChangesModal: false })
                // }}
                >
                    <AddRegistrationForm
                        AddSimHandler={this.handleSubmitReg}
                        handleCancel={this.handleCancel}
                        translation={this.props.translation}
                        ref="add_sim_reg_form"
                    />
                </Modal >
            </div>
        )
    }
}
