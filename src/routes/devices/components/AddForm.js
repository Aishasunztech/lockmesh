import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon } from 'antd';

import { getSimIDs, getChatIDs, getPGPEmails } from "../../../appRedux/actions/Devices";
import { getProfiles } from "../../../appRedux/actions/ConnectDevice";
const confirm = Modal.confirm;
class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type: 0,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('form', values);
            if (!err) {
                if (this.state.type == 1) {
                    showConfirm(this, values);
                } else {
                    this.props.AddDeviceHandler(values);
                    this.props.hideModal();
                    this.handleReset();
                }
                // console.log('Received values of form: ', values);
            }
        });
    }
    componentDidMount() {
        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        this.props.getProfiles();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.pgp_emails !== nextProps.pgp_emails) {
            // nextProps.getSimIDs();
            // console.log('next', nextProps.pgp_emails)
        }
    }


    handleReset = () => {

        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        this.props.form.resetFields();
    }


    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleChange = (e) => {
        // console.log(e.target);
        this.setState({ type: e.target.value });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.state.type);
        return (
            <div>
                {(this.props.preActive) ?
                    <Radio.Group onChange={this.handleChange} ref='option' defaultValue="0" buttonStyle="solid">
                        <Radio.Button value="0">Single Device</Radio.Button>
                        <Radio.Button value="1"><Popover content="Generate multiple activation codes with same settings" placement="rightTop">
                            <a>Duplicate Devices  <Icon type="info-circle" /></a>
                        </Popover></Radio.Button>
                    </Radio.Group>
                    : null}
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)- Required Fields</p>
                    {(this.state.type == 0) ?
                        <Fragment>
                            <Form.Item
                                label="Device ID "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('device_id', {
                                    initialValue: this.props.new ? "" : this.props.device.device_id,
                                })(

                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                {this.props.form.getFieldDecorator('dealer_id', {
                                    initialValue: this.props.new ? "" : this.props.device.dealer_id,
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
                            >
                                {this.props.form.getFieldDecorator('connected_dealer', {
                                    initialValue: this.props.new ? "" : this.props.device.connected_dealer,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="Name "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('name', {
                                    initialValue: this.props.new ? "" : this.props.device.name,
                                    rules: [{

                                        required: true, message: 'Name is Required !',
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
                                    initialValue: this.props.new ? "" : this.props.device.email,
                                    rules: [{
                                        type: 'email', message: 'The input is not valid E-mail!',
                                    }, {
                                        required: true, message: 'Account Email is Required !',
                                    }],
                                })(
                                    <Input autoComplete="new-password" />
                                )}
                            </Form.Item>

                            <Form.Item
                                label="PGP Email "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('pgp_email', {
                                    initialValue: this.props.new ? "" : this.props.device.pgp_email,
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
                                        autoComplete="new-password"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">Select PGP Email</Select.Option>
                                        {this.props.pgp_emails.map((pgp_email) => {
                                            return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                        })}
                                    </Select>
                                    // <Input />
                                )}
                            </Form.Item>

                            <Form.Item
                                label="Chat ID"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('chat_id', {
                                    initialValue: this.props.new ? "" : this.props.device.chat_id,
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
                                label="Client ID "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('client_id', {
                                    initialValue: this.props.new ? "" : this.props.device.client_id,

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
                                    initialValue: this.props.new ? "" : this.props.device.sim_id,
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

                            {/* <Form.Item
                    label="Policy "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('policy_id', {
                    initialValue: '',
                    })(
                        <Select
                            showSearch
                            placeholder="Select Policy"
                            optionFilterProp="children"
                            // onChange={handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="">Select Policy</Select.Option>
                            {this.props.policies.map((policy,index) =>{
                                return (<Select.Option key={index} value={policy.id}>{policy.name}</Select.Option>)
                            })}
                        </Select>,
                    )}
                </Form.Item> */}
                            {(this.props.preActive) ? null :
                                <Form.Item
                                    label="Model"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 14 }}
                                >
                                    {this.props.form.getFieldDecorator('model', {
                                        initialValue: this.props.new ? "" : this.props.device.model,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>} </Fragment> : null}
                    <Form.Item
                        label="Start Date "
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('start_date', {
                            initialValue: this.props.new ? this.createdDate() : this.props.device.start_date,
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
                            initialValue: this.props.new ? "" : this.props.device.expiry_date,
                            rules: [{
                                required: true, message: 'Expiry Date is Required !',
                            }],
                        })(
                            <Select

                                style={{ width: '100%' }}
                            >

                                <Select.Option value={0}>Trial (7 days)</Select.Option>
                                <Select.Option value={1}>1 Month</Select.Option>
                                <Select.Option value={3}>3 Months</Select.Option>
                                <Select.Option value={6}>6 Months</Select.Option>
                                <Select.Option value={12}>12 Months</Select.Option>
                            </Select>
                        )}

                    </Form.Item>
                    {(this.props.preActive) ?
                        <Fragment>
                            <Form.Item
                                label="NOTE "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('note', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: 'Note is required',
                                    }],
                                })(
                                    <Input />
                                )}

                            </Form.Item>
                            <Form.Item
                                label="VALID FOR(DAYS)"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: 'Valid days required',
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>

                        </Fragment> : null}
                    {(this.state.type == 1) ?
                        <Form.Item
                            label="DUPLICATE"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {this.props.form.getFieldDecorator('duplicate', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: 'Number of Duplicate devices required',
                                }],
                            })(
                                <InputNumber min={2} />
                            )}
                        </Form.Item> : null
                    }
                    {(this.props.preActive === false) ?
                        (<Fragment>
                            <Form.Item
                                label="Dealer Pin "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label="IMEI 1 "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input type='text' value={this.props.new ? '' : this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 1 "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label="IMEI 2 "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input value={this.props.new ? '' : this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 2 "
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.simno2} disabled />

                            </Form.Item>


                        </Fragment>
                        )
                        :
                        null}

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
            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create({ name: 'register' })(AddDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        getProfiles: getProfiles
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details }) => {
    //  console.log("sdfsaf", device_details.profiles,);
    return {
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        policies: device_details.profiles

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAddDeviceForm);
function showConfirm(_this, values) {
    confirm({
        title: "Do You Really want to duplicate " + values.duplicate + " devices with same settings.",
        onOk() {
            _this.props.AddDeviceHandler(values);
            _this.props.hideModal();
            _this.handleReset();
        },
        onCancel() { },
    });
}