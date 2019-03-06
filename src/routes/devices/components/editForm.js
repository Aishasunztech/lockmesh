import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select } from 'antd';

import { getSimIDs } from "../../../appRedux/actions/Devices";

class editDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.editDeviceFunc(values);
                this.props.hideModal();
                // console.log('Received values of form: ', values);
            }
        });

    }
    componentDidMount() {
        this.props.getSimIDs();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        // console.log('props of coming', this.props.device);
        const { visible, loading } = this.state;

        return (

            <Form onSubmit={this.handleSubmit}>
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
                    label="Device Name "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.device.name,
                        rules: [{

                            required: true, message: 'Device Name is Required !',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="Account Email "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.device.email,
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Account Email is Required !',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="Client ID "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('client_id', {

                        initialValue: this.props.device.client_id,
                    })(
                        <Input />
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
                        <Input />
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
                            style={{ width: 200 }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            // onChange={handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="">Select Sim ID</Select.Option>
                            {this.props.sim_ids.map(sim_id =>{
                                return (<Select.Option value={sim_id.id}>{sim_id.sim_id}</Select.Option>)
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
                        initialValue: this.props.device.model,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="Start Date "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >

                    <Input value={this.props.device.start_date} disabled />

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
                    <Button key="back" type="button" onClick={this.props.handleCancel}>Return</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>

            </Form>

        )

    }
}

const WrappedEditDeviceForm = Form.create({ name: 'register' })(editDealer);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs
    }, dispatch);
}
var mapStateToProps = ({ routing, devices }) => {
    // console.log("sdfsaf", devices);

    return {
        routing: routing,
        sim_ids: devices.sim_ids
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedEditDeviceForm);