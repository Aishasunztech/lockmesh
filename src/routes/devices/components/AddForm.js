import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddUser from '../../users/components/AddUser';
import { convertToLang } from '../../utils/commonUtils';
import AddSimPermission from './AddSimPermission'
import { Markup } from 'interweave';
import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon, Row, Col, Spin } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';

import { getSimIDs, getChatIDs, getPGPEmails } from "../../../appRedux/actions/Devices";
import { getPolicies } from "../../../appRedux/actions/ConnectDevice";
import {
    addUser,
    getUserList
} from "../../../appRedux/actions/Users";
import { Button_Cancel, Button_submit, Button_Add_User } from '../../../constants/ButtonConstants';
import { SINGLE_DEVICE, DUPLICATE_DEVICES, Required_Fields, USER_ID, DEVICE_ID, USER_ID_IS_REQUIRED, SELECT_PGP_EMAILS, DEVICE_Select_CHAT_ID, SELECT_USER_ID, DEVICE_CLIENT_ID, DEVICE_Select_SIM_ID, DEVICE_MODE, DEVICE_MODEL, Device_Note, Device_Valid_For, Device_Valid_days_Required, DUPLICATE_DEVICES_REQUIRED, DEVICE_IMEI_1, DEVICE_SIM_1, DEVICE_IMEI_2, DEVICE_SIM_2, DUPLICATE_DEVICES_HELPING_TEXT } from '../../../constants/DeviceConstants';
import { LABEL_DATA_PGP_EMAIL, LABEL_DATA_SIM_ID, LABEL_DATA_CHAT_ID } from '../../../constants/LabelConstants';
import { Not_valid_Email, POLICY, Start_Date, Expire_Date, Expire_Date_Require, SELECT_POLICY } from '../../../constants/Constants';
import { DEALER_PIN } from '../../../constants/DealerConstants';
const confirm = Modal.confirm;

class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type: 0,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
            client_id: this.props.new ? '' : this.props.device.client_id,
            pgp_email: this.props.new ? '' : this.props.device.pgp_email,
            chat_id: this.props.new ? "" : this.props.device.chat_id,
            sim_id: this.props.new ? "" : this.props.device.sim_id,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values);
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
        this.props.getPolicies();
        this.props.getUserList();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })

        if (this.props.pgp_emails !== nextProps.pgp_emails) {
            // nextProps.getSimIDs();
            // console.log('next', nextProps.pgp_emails)
        }
    }

    handleReset = () => {

        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        // this.props.getUserList();
        this.props.form.resetFields();
    }


    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleChange = (e) => {
        // console.log(e);
        // this.setState({ pgp_email: e }); 
        this.setState({ type: e.target.value });
    }

    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }
    handleSimPermissionModal = () => {
        let handleSubmit = this.props.addSimPermission;
        this.refs.add_sim_permission.showModal(handleSubmit);
    }

    render() {
        // console.log('id is', this.state.type);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        // console.log(users_list[0]);
        return (
            <div>
                {(this.props.preActive) ?
                    <Radio.Group className="width_100 text-center" onChange={this.handleChange} ref='option' defaultValue="0" buttonStyle="solid">
                        <Radio.Button className="dev_radio_btn" value="0">{convertToLang(this.props.translation[SINGLE_DEVICE], "Single Device")}</Radio.Button>
                        <Radio.Button className="dev_radio_btn" value="1">
                            <a>{convertToLang(this.props.translation[DUPLICATE_DEVICES], "Duplicate Devices")}</a>
                            <Popover placement="bottomRight" content={(
                                <Markup content={convertToLang(this.props.translation[DUPLICATE_DEVICES_HELPING_TEXT],
                                    `<p>Generate multiple activation <br /> codes with same settings</p>`)} />
                            )}>
                                <span className="helping_txt"><Icon type="info-circle" /></span>
                            </Popover>
                        </Radio.Button>
                    </Radio.Group>
                    : null}
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p style={{ marginLeft: 36 }}>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    {(this.props.preActive) ? null :
                        <Form.Item
                            label={convertToLang(this.props.translation[DEVICE_ID], "Device ID ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {this.props.form.getFieldDecorator('device_id', {
                                initialValue: this.props.new ? "" : this.props.device.device_id,
                            })(

                                <Input disabled />
                            )}
                        </Form.Item>
                    }
                    {(isloading ?

                        <div className="addUserSpin">
                            <Spin />
                        </div>
                        :
                        <Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >


                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.props.new ? "" : this.state.addNewUserModal ? lastObject.user_id : addNewUserValue,
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], 'User ID is Required !'),
                                    }]
                                })(
                                    <Select
                                        className="pos_rel"
                                        setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                        optionFilterProp="children"
                                        onChange={this.handleUserChange}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                        {users_list.map((item, index) => {
                                            return (<Select.Option key={index} value={item.user_id}>{item.user_id} ( {item.user_name} )</Select.Option>)
                                        })}
                                    </Select>


                                    // {/* <Button
                                    //     type="primary"
                                    //     style={{ width: '100%' }}
                                    //     onClick={() => this.handleUserModal()}
                                    // >
                                    //     Add User
                                    // </Button> */}
                                )}
                                <Button
                                    className="add_user_btn"
                                    type="primary"
                                    onClick={() => this.handleUserModal()}
                                >
                                    {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                </Button>

                            </Form.Item>

                        </Fragment>
                    )}
                    {(this.state.type == 0 && lastObject) ?
                        <Fragment>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('dealer_id', {
                                    initialValue: this.props.new ? "" : this.props.device.dealer_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_device_id', {
                                    initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_acc_id', {
                                    initialValue: this.props.new ? "" : this.props.device.id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('connected_dealer', {
                                    initialValue: this.props.new ? "" : this.props.device.connected_dealer,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('pgp_email', {
                                    initialValue: this.state.pgp_email,
                                    rules: [{
                                        type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                                    }],
                                })(
                                    <Select
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}
                                        optionFilterProp="children"
                                        onChange={(e) => this.setState({ pgp_email: e })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        // defaultValue={this.state.pgp_email}
                                        autoComplete="new-password"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}</Select.Option>
                                        {this.props.pgp_emails.map((pgp_email) => {
                                            return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                        })}
                                    </Select>
                                    // <Input />
                                )}
                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "Chat ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('chat_id', {
                                    initialValue: this.state.chat_id,
                                })(
                                    // <Input />
                                    <Select
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select Chat ID")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ chat_id: value })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select Chat ID")}</Select.Option>
                                        {this.props.chat_ids.map((chat_id, index) => {
                                            return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_CLIENT_ID], "Client ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('client_id', {
                                    initialValue: this.state.client_id,

                                })(
                                    <Input
                                        onChange={e => {
                                            this.setState({ client_id: e.target.value });
                                        }} />
                                )}
                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "Sim ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('sim_id', {
                                    initialValue: this.state.sim_id
                                })(
                                    <Select
                                        // className="pos_rel"
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select Sim ID ")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ sim_id: value })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select Sim ID ")}</Select.Option>
                                        {this.props.sim_ids.map((sim_id, index) => {
                                            return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                        })}
                                    </Select>,
                                )}
                                {/* <Button
                                    className="add_sim_permission_btn"
                                    type="primary"
                                    onClick={() => this.handleSimPermissionModal()}
                                >
                                    Add Permissions
                                </Button> */}


                            </Form.Item>


                            {(this.props.preActive) ? null :
                                <Form.Item
                                    label={convertToLang(this.props.translation[DEVICE_MODEL], "Model ")}
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
                        label={convertToLang(this.props.translation[POLICY], "Policy ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('policy_id', {
                            initialValue: '',
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[SELECT_POLICY], "Select Policy")}
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[SELECT_POLICY], "Select Policy ")}</Select.Option>
                                {this.props.policies.map((policy, index) => {
                                    return (<Select.Option key={index} value={policy.id}>{policy.policy_name}</Select.Option>)
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[Start_Date], "Start Date ")}
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
                        label={convertToLang(this.props.translation[Expire_Date], "Expiry Date ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('expiry_date', {
                            initialValue: this.props.new ? "" : this.props.device.expiry_date,
                            rules: [{
                                required: true, message: convertToLang(this.props.translation[Expire_Date_Require], "Expiry Date is Required ! "),
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
                                label={convertToLang(this.props.translation[Device_Note], "NOTE ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('note', {
                                    initialValue: '',
                                })(
                                    <Input />
                                )}

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS) ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required "),
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>

                        </Fragment> : null}
                    {(this.state.type == 1) ?
                        <Form.Item
                            label={convertToLang(this.props.translation[DUPLICATE_DEVICES], "DUPLICATE ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {this.props.form.getFieldDecorator('duplicate', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: convertToLang(this.props.translation[DUPLICATE_DEVICES_REQUIRED], 'Number of Duplicate devices required'),
                                }],
                            })(
                                <InputNumber min={2} />
                            )}
                        </Form.Item> : null
                    }
                    {(this.props.preActive === false) ?
                        (<Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEALER_PIN], "Dealer Pin ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI 1 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input type='text' value={this.props.new ? '' : this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_SIM_1], "SIM 1 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI 2 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input value={this.props.new ? '' : this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_SIM_2], "SIM 2 ")}
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
                        <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}</Button>
                        <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], Button_submit)}</Button>
                    </Form.Item>
                </Form>
                <AddUser ref="add_user" translation={this.props.translation} />
                <AddSimPermission ref="add_sim_permission" />
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
        // getProfiles: getProfiles,
        getPolicies: getPolicies,
        addUser: addUser,
        getUserList: getUserList,
        addSimPermission: null
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details, users, settings }) => {
    // console.log("sdfsaf", users.users_list);
    return {
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        policies: device_details.policies,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAddDeviceForm));
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