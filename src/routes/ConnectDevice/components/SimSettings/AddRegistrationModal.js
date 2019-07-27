import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddRegistrationForm from './AddRegistrationForm';
import { ADD_SIM_REGISTRATION } from '../../../../constants/DeviceConstants';
import { convertToLang } from '../../../utils/commonUtils';



export default class RegisterSimModal extends Component {

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
        const { visible } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    title={convertToLang(this.props.translation[ADD_SIM_REGISTRATION], "Add Sim Registration")}
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
