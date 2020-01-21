import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import PasswordForm from './PasswordForm';

class WipePasswordModal extends Component {
    // console.log('object,', props.actionType)
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showWipePwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    setWipePass={this.props.setWipePass}
                    actionType='back_up'
                    handleCancel={this.props.showWipePwdConfirmModal}
                    ref='pswdForm'
                    wipeBulkDevices={this.props.wipeBulkDevices}
                    wipeData={this.props.wipeData}
                    translation={this.props.translation}
                    wipePassMsg={this.props.wipePassMsg}
                    pwdConfirmModal={this.props.pwdConfirmModal}
                />
            </Modal >
        )
    }
}

class BulkWipe extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pwdConfirmModal: false,
            bulkWipePassModal: false,
            wipe_data: ''
        }
        this.confirm = Modal.confirm;
    }

    // showWipePwdConfirmModal = (visible) => {
    //     this.setState({
    //         pwdConfirmModal: visible,
    //     })
    // }

    componentDidUpdate(prevProps) {
        if (this.props.bulkWipePassModal !== prevProps.bulkWipePassModal) {
            this.setState({ bulkWipePassModal: this.props.bulkWipePassModal })
        }
    }

    handleBulkWipe = (devices, dealers, users) => {
        // console.log("devices lklk", devices)
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        devices.forEach((item) => {
            // if (item.device_id) {
            selectedDevices.push(item.usr_device_id);
            // }
        });
        dealers.forEach((item) => {
            dealer_ids.push(item.key);
        });
        users.forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            selectedDevices,
            dealer_ids,
            user_ids
        }

        // console.log("data ", data)

        // const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to wipe these selected devices ")} ${devices.map(item => ` ${item.device_id}`)} ?`;
        const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to wipe selected devices")} ?`;
        let _this = this;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                _this.props.handleWipePwdConfirmModal(true);
                _this.setState({ wipe_data: data })
                // this.props.wipeBulkDevices(data);
            }),
            onCancel() { },
        });

    }

    setWipePass = (value) => {
        console.log("wipe pass: ", value);
        this.setState({ wipePass: value });
    }

    render() {
        // return (null);
        // console.log("state ", this.state)
        return (
            <div>
                <WipePasswordModal
                    translation={this.props.translation}
                    pwdConfirmModal={this.state.bulkWipePassModal}
                    showWipePwdConfirmModal={this.props.handleWipePwdConfirmModal}
                    // checkPass={this.props.checkPass}
                    setWipePass={this.setWipePass}
                    wipeBulkDevices={this.props.wipeBulkDevices}
                    wipeData={this.state.wipe_data}
                    translation={this.props.translation}
                    wipePassMsg={this.props.wipePassMsg}
                />
            </div>
        )
    }

}

export default BulkWipe;