import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddRegistrationForm from './AddRegistrationForm';



export default class RegisterSim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            preActive: false
        }
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = () => {
        this.refs.add_sim_reg_form.resetFields();
        this.setState({ visible: false });
    }

    handleSubmitReg = (values) => {
        this.props.simRegister(values);
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
                    onCancel={this.handleCancel}
                >
                    <AddRegistrationForm
                        AddSimHandler={this.handleSubmitReg}
                        handleCancel={this.handleCancel}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        total_dvc={this.props.total_dvc}
                        ref="add_sim_reg_form"
                    />
                </Modal >
            </div>
        )
    }
}
