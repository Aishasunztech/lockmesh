import React, { Component } from 'react';
import TimezonePicker from 'react-timezone';

import { Modal, Button, Form, Input, message } from 'antd';
import { Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { ENTER_NEW_PASSWORD, ENTER_CURRENT_PASSWORD, CONFIRM_NEW_PASSWORD, CURRENT_PASSWORD, CONFIRM_PASSWORD, NEW_PASSWORD } from '../../../constants/Constants';
import { CHANGE_PASSWORD } from '../../../constants/ActionTypes';
import styles from './profile.css';
// import { BASE_URL } from "../../../constants/Application";
// let token = localStorage.getItem('token');
// let logo = '';
// let apk = '';
// let form_data = '';
// let edit_func = '';
export default class SetTimeZone extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selected_tz: 'Asia/Yerevan'
            // curntpwd: '',
            // newpwd: '',

        }
    }


    showModal = (profile, func) => {
        // console.log('profile', this.props.profile);
        // edit_func=func;
        //  logo = app.logo;
        //  apk = app.apk;
        this.setState({
            visible: true,
            // email: profile.dealer_email,
            // dealer_id: profile.dealer_id,

        });
    }

    handleTimezone = (e) => {
        console.log("handle handleTimezone:: ", e);
        this.setState({ selected_tz: e })
    }

    handleSubmit = (e) => {

        e.preventDefault();
        console.log("handle submit", this.state.selected_tz);
        if (this.state.selected_tz) {
            this.props.changeTimeZone(this.state.selected_tz);
        }
        // console.log(this.state.newPassword);
        // if (this.state.newPassword && this.state.newPassword.length >= 6) {
        //     if ((this.state.newPassword !== this.state.confirmPassword) || (this.state.newPassword === '')) {
        //         this.setState({
        //             status: 'error',
        //             help: "Password doesn't match"
        //         })
        //     }
        //     else {

        //         this.setState({
        //             status: 'success',
        //             help: "",
        //         })
        //         form_data = {
        //             'dealer_id': this.props.profile.dealerId,
        //             'dealer_email': this.props.profile.email,
        //             'newpwd': this.state.newPassword,
        //             'curntpwd': this.state.curntpwd
        //         };
        //         this.props.func(form_data);

        this.handleCancel();
        //         // this.success();
        //     }
        // }
        // else {
        //     this.setState({
        //         status: 'error',
        //         help: " Atleast 6 Characters required !",
        //     })
        // }
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            // newPassword: '',
            // confirmPassword: '',
            // curntpwd: ''
        });
    }

    render() {

        const { visible, loading } = this.state;
        const number = this.state.number;
        const tips = 'A prime is a natural number greater than ';

        return (
            <div>
                <Modal
                    visible={visible}
                    title={convertToLang(this.props.translation[""], "Change Timezone")}
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                            {convertToLang(this.props.translation[Button_submit], "Submit")}
                        </Button>,
                    ]}
                >
                    <Form >
                        <Form.Item
                            label={convertToLang(this.props.translation[""], "Timezone ")}
                            labelCol={{ span: 5, xs: 24, sm: 5 }}
                            wrapperCol={{ span: 18, xs: 24, sm: 18 }}
                        >
                            <div className="time_zone">
                                <TimezonePicker
                                    value={this.state.selected_tz}
                                    onChange={this.handleTimezone}
                                    inputProps={{
                                        placeholder: 'Select Timezone...',
                                        name: 'timezone',
                                    }}
                                />
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}