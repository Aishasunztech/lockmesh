import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddSimForm from './AddSimForm';
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Add_User } from '../../../constants/ButtonConstants';

export default class AddSim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            handleSubmit: null,
            user: null,
            titleText: ''
        }
    }



    showModal = (handleSubmit, user = null, titleText = convertToLang(this.props.translation[""], "Add Stand Alone Sim")) => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            user: user,
            titleText: titleText,
        });

    }
    handleCancel = () => {
        this.refs.add_user_form.resetFields();
        this.setState({ visible: false });
    }
    render() {
        const { visible, loading } = this.state;
        // console.log(this.props.);
        return (
            <div>
                <Modal
                    visible={visible}
                    title={this.state.titleText}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <AddSimForm
                        AddSimHandler={this.state.handleSubmit}
                        handleCancel={this.handleCancel}
                        user={this.state.user}
                        ref='add_user_form'
                        translation={this.props.translation}
                        standAlonePackages={this.props.standAlonePackages}
                    />
                </Modal>
            </div>
        )

    }
}
