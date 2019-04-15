import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select } from 'antd';
import { checkValue } from '../../utils/commonUtils'

import { getSimIDs, getChatIDs, getPGPEmails } from "../../../appRedux/actions/Devices";

class EditDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    handleSubmit = (e) => {
        // alert('submit', this.props.editDeviceFunc);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log("Device List", values)
                values.prevPGP = this.props.device.pgp_email;
                // console.log("Device Details ", values)
                this.props.editDeviceFunc(values);
                this.props.hideModal();
                this.handleReset();
                // console.log('Received values of form: ', values);
            }
        });

    }
    componentDidMount() {
        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
    }


    handleReset = () => {
        this.props.form.resetFields();
    }

    get_current_date = () => {

        let day = new Date().getDay(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        var current_date = year + '/' + month + '/' + day;
        // console.log('date', current_date);
        return current_date;
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    render() {
        //  alert(this.props.device.device_id);
        // console.log('props of coming', this.props.device);
        const { visible, loading } = this.state;

        return (

            <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                <p>(*)- Required Fields</p>

                <Form.Item
                    label="Device ID "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('device_id', {
                        initialValue: this.props.device.device_id,
                    })(

                        <Input disabled />
                    )}
                </Form.Item>
                <Form.Item
                >
                    {this.props.form.getFieldDecorator('dealer_id', {
                        initialValue: this.props.device.dealer_id,
                    })(

                        <Input type='hidden' disabled />
                    )}
                </Form.Item>
                <Form.Item
                >
                    {this.props.form.getFieldDecorator('usr_device_id', {
                        initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                    })(

                        <Input type='hidden' disabled />
                    )}
                </Form.Item>
                <Form.Item
                >
                    {this.props.form.getFieldDecorator('usr_acc_id', {
                        initialValue: this.props.new ? "" : this.props.device.id,
                    })(

                        <Input type='hidden' disabled />
                    )}
                </Form.Item>
                <Form.Item
                    label="Device Name "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: checkValue(this.props.device.name),
                        rules: [{

                            required: true, message: 'Device Name is Required !',
                        }],
                    })(
                        <Input autoComplete="new-password" />
                    )}
                </Form.Item>
                <Form.Item

                    label="Account Email "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.device.account_email,
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Account Email is Required !',
                        }],
                    })(
                        <Input disabled />
                    )}
                </Form.Item>

                <Form.Item
                    label="PGP Email "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('pgp_email', {
                        initialValue: this.props.device.pgp_email,
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'PGP Email is Required !',
                        }],
                    })(
                        <Select
                            showSearch
                            placeholder="Select PGP Emails"
                            optionFilterProp="children"
                            // onChange={handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="">Select PGP Email</Select.Option>
                            {this.props.pgp_emails.map((pgp_email) => {
                                return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                            })}
                        </Select>
                        // <Input disabled />
                    )}
                </Form.Item>
                <Form.Item
                    label="Client ID "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('client_id', {

                        initialValue: checkValue(this.props.device.client_id),
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="Chat ID"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('chat_id', {
                        initialValue: this.props.device.chat_id,
                    })(
                        // <Input />
                        <Select
                            showSearch
                            placeholder="Select Chat ID"
                            optionFilterProp="children"
                            // onChange={handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="">Select Chat ID</Select.Option>
                            {this.props.chat_ids.map((chat_id, index) => {
                                return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                            })}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    label="Sim ID "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('sim_id', {
                        initialValue: this.props.device.sim_id,
                    })(
                        <Select
                            showSearch
                            placeholder="Select Sim ID"
                            optionFilterProp="children"
                            // onChange={handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="">Select Sim ID</Select.Option>
                            {this.props.sim_ids.map((sim_id, index) => {
                                return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                            })}
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item
                    label="Model"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('model', {
                        initialValue: (this.props.device.model === "null") ? '' : this.props.device.model,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="Start Date "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('start_date', {
                        initialValue: (this.props.device.start_date) ? this.props.device.start_date : this.createdDate()
                    })(

                        <Input disabled />
                    )}
                </Form.Item>
                <Form.Item
                    label="Expiry Date "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('expiry_date', {

                        rules: [{
                            required: true, message: 'Expiry Date is Required !',
                        }],
                    })(
                        <Select

                            style={{ width: '100%' }}
                        >

                            <Select.Option value={1}>1 Month</Select.Option>
                            <Select.Option value={3}>3 Months</Select.Option>
                            <Select.Option value={6}>6 Months</Select.Option>
                            <Select.Option value={12}>12 Months</Select.Option>
                        </Select>
                    )}

                </Form.Item>

                <Form.Item
                    label="Dealer Pin "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input value={this.props.device.link_code} disabled />

                </Form.Item>

                <Form.Item
                    label="IMEI 1 "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >

                    <Input type='text' value={this.props.device.imei} disabled />

                </Form.Item>
                <Form.Item
                    label="SIM 1 "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input value={this.props.device.simno} disabled />

                </Form.Item>
                <Form.Item
                    label="IMEI 2 "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >

                    <Input value={this.props.device.imei2} disabled />

                </Form.Item>
                <Form.Item
                    label="SIM 2 "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input value={this.props.device.simno2} disabled />

                </Form.Item>

                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.props.handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>

            </Form>

        )

    }
}

const WrappedEditDeviceForm = Form.create({ name: 'register' })(EditDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails
    }, dispatch);
}
var mapStateToProps = ({ routing, devices }) => {
    // console.log("sdfsaf", devices);

    return {
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedEditDeviceForm);