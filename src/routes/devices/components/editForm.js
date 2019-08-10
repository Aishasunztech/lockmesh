import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select, InputNumber, Spin } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import { getSimIDs, getChatIDs, getPGPEmails } from "../../../appRedux/actions/Devices";
import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, ADMIN, Model_text, Expire_Date, one_month, three_month, six_month, twelve_month, Days, Start_Date, Expire_Date_Require, Not_valid_Email
} from '../../../constants/Constants';
import AddUser from '../../users/components/AddUser';
import {
    addUser,
    getUserList
} from "../../../appRedux/actions/Users";
import {
    Required_Fields,
    DEVICE_ID, USER_ID,
    DEVICE_SIM_ID,
    DEVICE_Select_SIM_ID,
    DEVICE_CHAT_ID,
    Device_Note,
    Device_Valid_For,
    Device_Valid_days_Required,
    DEVICE_Select_CHAT_ID,
    SELECT_USER_ID,
    USER_ID_IS_REQUIRED,
    SELECT_PGP_EMAILS
} from '../../../constants/DeviceConstants';
import { Button_Add_User, Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { LABEL_DATA_PGP_EMAIL } from '../../../constants/LabelConstants';

class EditDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
        }
    }
    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    handleSubmit = (e) => {
        // alert('submit', this.props.editDeviceFunc);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log("Device List", values)
                values.prevPGP = this.props.device.pgp_email;
                values.finalStatus = this.props.device.finalStatus;
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
        this.props.getUserList();
        // this.setState({
        //     addNewUserModal: false
        // })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
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

    handleCancelForm = () => {
        this.setState({
            visible: false,
            addNewUserModal: false,
            addNewUserValue: ''
        });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    render() {
        // console.log('props of coming', this.props.device);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        // console.log(this.props.user);

        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p className="mb-4">(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    <Form.Item
                        label={(this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION) ? convertToLang(this.props.translation[DEVICE_ID], DEVICE_ID) : null}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('device_id', {
                            initialValue: this.props.device.device_id,
                        })(

                            <Input type={(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? 'hidden' : ''} disabled />
                        )}
                    </Form.Item>

                    {(isloading ?

                        <div className="addUserSpin">
                            <Spin />
                        </div>
                        :
                        <Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                labelCol={{ span: 8, xs: 24, md: 8, sm: 24 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >


                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.state.addNewUserModal ? lastObject.user_id : this.props.device.user_id,
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], "User ID is Required !"),
                                    }]
                                })(
                                    <Select
                                        className="pos_rel"
                                        setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                        optionFilterProp="children"
                                        onChange={this.handleUserChange}
                                        filterOption={
                                            (input, option) => {
                                                // console.log("searching: ",input," from:", option.props);
                                                // return null;
                                                return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                            }
                                        }
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                        {users_list.map((item, index) => {
                                            return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
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
                                {(this.props.user.type === ADMIN) ? null :
                                    <Button
                                        className="add_user_btn"
                                        type="primary"
                                        onClick={() => this.handleUserModal()}
                                    >
                                        {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                    </Button>
                                }

                            </Form.Item>

                        </Fragment>
                    )}
                    < Form.Item style={{ marginBottom: 0 }}
                    >
                        {this.props.form.getFieldDecorator('dealer_id', {
                            initialValue: this.props.device.dealer_id,
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
                    <Form.Item
                        label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email ")}
                        // label="PGP Email "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('pgp_email', {
                            initialValue: (this.props.device.pgp_email === 'N/A') ? "" : this.props.device.pgp_email,
                            rules: [{
                                type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                            }],
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}</Select.Option>
                                {this.props.pgp_emails.map((pgp_email) => {
                                    return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                })}
                            </Select>
                            // <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[DEVICE_SIM_ID], "SIM ID")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('sim_id', {
                            initialValue: (this.props.device.sim_id === 'N/A') ? "" : this.props.device.sim_id,
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "SIM ID")}
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select SIM ID")}</Select.Option>
                                {this.props.sim_ids.map((sim_id, index) => {
                                    return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[DEVICE_CHAT_ID], "CHAT ID")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('chat_id', {
                            initialValue: (this.props.device.chat_id === 'N/A') ? "" : this.props.device.chat_id,
                        })(
                            // <Input />
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select CHAT ID")}
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select Chat ID")}</Select.Option>
                                {this.props.chat_ids.map((chat_id, index) => {
                                    return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                })}
                            </Select>
                        )}
                    </Form.Item>


                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? null :
                        <Form.Item
                            label={convertToLang(this.props.translation[Model_text], "Model")}
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('model', {
                                initialValue: checkValue(this.props.device.model),
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    }
                    <Form.Item
                        label={convertToLang(this.props.translation[Start_Date], "Start Date ")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('start_date', {
                            initialValue: (this.props.device.start_date) ? this.props.device.start_date : this.createdDate()
                        })(

                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[Expire_Date], "Extend Expire Date")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('expiry_date', {
                            initialValue: this.props.device.expiry_date,
                            rules: [{
                                required: true, message: convertToLang(this.props.translation[Expire_Date_Require], "Expiry Date is Required ! "),
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                            >
                                {/* {(this.props.device.finalStatus === DEVICE_TRIAL || this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? <Select.Option value={0}>{convertToLang(this.props.translation[DEVICE_TRIAL], DEVICE_TRIAL)} (7 {convertToLang(this.props.translation[Days], Days)})</Select.Option> : null} */}
                                <Select.Option value={1}> {convertToLang(this.props.translation[one_month], one_month)} </Select.Option>
                                <Select.Option value={3}>{convertToLang(this.props.translation[three_month], three_month)}</Select.Option>
                                <Select.Option value={6}>{convertToLang(this.props.translation[six_month], six_month)}</Select.Option>
                                <Select.Option value={12}>{convertToLang(this.props.translation[twelve_month], twelve_month)}</Select.Option>
                            </Select>
                        )}

                    </Form.Item>

                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ?
                        <Fragment>

                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Note], "Note ")}
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('note', {
                                    initialValue: this.props.device.note,
                                })(
                                    <Input />
                                )}

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS)  ")}
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: this.props.device.validity,
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required "),
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>

                        </Fragment>
                        :
                        <Fragment>
                            {/* <Form.Item
                                label="Dealer Pin "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label="IMEI 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input type='text' value={this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label="IMEI 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input value={this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno2} disabled />

                            </Form.Item> */}
                        </Fragment>

                    }

                    <Form.Item className="edit_ftr_btn11"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={() => { this.props.handleCancel(); this.handleCancelForm() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                        <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                    </Form.Item>

                </Form>
                <AddUser ref="add_user" translation={this.props.translation} />
            </div >

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
        getPGPEmails: getPGPEmails,
        getUserList: getUserList,
        addUser: addUser,
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, users, auth, settings }) => {
    // console.log("sdfsaf", devices);

    return {
        user: auth.authUser,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedEditDeviceForm);