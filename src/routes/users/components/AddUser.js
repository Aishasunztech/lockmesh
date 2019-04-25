import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddUserForm from './AdduserForm';

export default class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            handleSubmit: null,
            preActive: false
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };


    showModal = (handleSubmit) => {
        this.setState({
            visible: true,
            handleSubmit: handleSubmit
        });

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
                    title="Add User"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >
                    <AddUserForm
                        AddDeviceHandler={this.state.handleSubmit}
                        handleCancel={this.handleCancel}
                    />
                </Modal>
            </div>
        )

    }
}
