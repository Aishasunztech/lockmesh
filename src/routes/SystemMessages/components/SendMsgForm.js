import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import FilterDevices from './filterDevices'
import BulkSendMsgConfirmation from './bulkSendMsgConfirmation';

const { TextArea } = Input;


class AddUserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            filteredDevices: [],
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            allUsers: [],
            allDealers: [],
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("handle submit ", this.props.selectedDevices, this.state.selectedDealers, this.state.selectedUsers);
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("handle submit 02 ", values)
            // console.log(err,'form', values.name);
            // if (values.name === '') {
            //     this.setState({
            //         validateStatus: 'error',
            //         help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
            //     })
            // }
            if (!err) {


                // if (/[^A-Za-z \d]/.test(values.name)) {
                //     this.setState({
                //         validateStatus: 'error',
                //         help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
                //     })
                // } else {
                // this.props.setBulkMsg(values);
                // this.props.handleCancelSendMsg(false);
                // this.handleReset();
                let data = {
                    devices: this.props.selectedDevices,
                    dealers: this.state.selectedDealers,
                    users: this.state.selectedUsers,
                    msg: values.msg_txt
                }
                console.log("data ", data);
                this.refs.bulk_msg.handleBulkSendMsg(data);
                // this.props.sendMsgOnDevices(data);


                // }
            }

        });
    }
    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)

        if (fieldvalue === '') {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
            })
        }
        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
            // console.log('componentWillReceiveProps ', nextProps.devices)
            this.setState({
                filteredDevices: nextProps.devices,
                dealerList: this.props.dealerList
            })
        }

        let allDealers = nextProps.dealerList.map((item) => {
            return ({ key: item.dealer_id, label: item.dealer_name })
        });

        let allUsers = nextProps.users_list.map((item) => {
            return ({ key: item.user_id, label: item.user_name })
        });
        this.setState({ allUsers, allDealers })
    }

    componentDidMount() {

        this.props.getAllDealers();
        this.props.getUserList();

        this.setState({
            filteredDevices: this.props.devices,
            dealerList: this.props.dealerList,
        })
    }

    handleMultipleSelect = () => {
        // console.log('value is: ', e);
        let data = {}

        if (this.state.selectedDealers.length || this.state.selectedUsers.length) {
            data = {
                dealers: this.state.selectedDealers,
                users: this.state.selectedUsers
            }

            // console.log('handle change data is: ', data)
            this.props.getBulkDevicesList(data);
            this.props.getAllDealers();

        } else {
            this.setState({ filteredDevices: [] });
        }
    }

    handleDeselect = (e, dealerOrUser = '') => {

        if (dealerOrUser == "dealers") {
            let updateDealers = this.state.selectedDealers.filter(item => item.key != e.key);
            this.state.selectedDealers = updateDealers;
            this.state.checkAllSelectedDealers = false;
        } else if (dealerOrUser == "users") {
            let updateUsers = this.state.selectedUsers.filter(item => item.key != e.key);
            this.state.selectedUsers = updateUsers;
            this.state.checkAllSelectedUsers = false;
        }

    }
    handleReset = () => {
        this.props.form.resetFields();
    }


    handleCancel = () => {
        // this.handleReset();
        this.props.handleCancelSendMsg(false);
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    handleChangeUser = (values) => {
        console.log("values ", values);
        // console.log("handleChangeUser values ", values, this.state.selectedUsers, this.props.users_list, this.state.allUsers);
        let checkAllUsers = this.state.checkAllSelectedUsers

        let selectAll = values.filter(e => e.key === "all");
        let selectedUsers = values.filter(e => e.key !== "all");


        if (selectAll.length > 0) {
            checkAllUsers = !this.state.checkAllSelectedUsers;
            if (this.state.checkAllSelectedUsers) {
                selectedUsers = [];
            } else {
                selectedUsers = this.state.allUsers; // [...this.state.allUsers, {key: "all", label: "Select All"}];
            }
        }
        else if (values.length === this.props.users_list.length) {
            selectedUsers = this.state.allUsers
            checkAllUsers = true;
        }
        else {
            selectedUsers = values.filter(e => e.key !== "all");
        }

        let data = {
            dealers: this.state.selectedDealers,
            users: selectedUsers
        }
        // console.log("users data is: ", data)
        this.props.getBulkDevicesList(data);
        this.setState({ selectedUsers, checkAllSelectedUsers: checkAllUsers })
    }

    handleChangeDealer = (values) => {
        // console.log("handleChangeDealer values ", values, this.state.selectedDealers.length, this.state.dealerList.length);
        let checkAllDealers = this.state.checkAllSelectedDealers
        let selectAll = values.filter(e => e.key === "all");
        let selectedDealers = [];

        if (selectAll.length > 0) {
            checkAllDealers = !this.state.checkAllSelectedDealers;
            if (this.state.checkAllSelectedDealers) {
                selectedDealers = [];
            } else {
                selectedDealers = this.state.allDealers // [...this.state.allDealers, {key: "all", label: "Select All"}];
            }
        }
        else if (values.length === this.props.dealerList.length) {
            selectedDealers = this.state.allDealers
            checkAllDealers = true;
        }
        else {
            selectedDealers = values.filter(e => e.key !== "all");
        }


        let data = {
            dealers: selectedDealers, //.filter(e => e.key !== "all"),
            users: this.state.selectedUsers
        }

        // console.log('handle change data is: ', data)
        this.props.getBulkDevicesList(data);
        this.setState({
            selectedDealers,
            selectedUsers: [],
            checkAllSelectedDealers: checkAllDealers,
        });

    }

    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.state.type);
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    {/* <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p> */}
                    <Row gutter={24} className="">
                        <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                            <span className=""> {convertToLang(this.props.translation[""], "Select Dealers/S-Dealers:")} </span>
                        </Col>

                        <Col className="col-md-6 col-sm-6 col-xs-6">
                            <Select
                                value={this.state.selectedDealers}
                                mode="multiple"
                                labelInValue
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                maxTagCount={this.state.checkAllSelectedDealers ? 0 : 2}
                                maxTagTextLength={10}
                                maxTagPlaceholder={this.state.checkAllSelectedDealers ? "All Selected" : `${this.state.selectedDealers.length - 2} more`}
                                style={{ width: '100%' }}
                                placeholder={convertToLang(this.props.translation[""], "Select Dealers/S-Dealers")}
                                onChange={this.handleChangeDealer}
                                onDeselect={(e) => this.handleDeselect(e, "dealers")}
                            >
                                {(this.state.allDealers && this.state.allDealers.length > 0) ?
                                    <Select.Option key="allDealers" value="all">Select All</Select.Option>
                                    : <Select.Option key="" value="">Data Not Found</Select.Option>
                                }
                                {this.state.allDealers.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <br />

                    <p>Dealers/S-Dealers Selected: <span className="font_26">{((this.state.selectedDealers.length) ? this.state.selectedDealers.map(item => <Tag>{item.label}</Tag>) : "NOT SELECTED")}</span></p>
                    <Row gutter={24} className="">
                        <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                            <span className=""> {convertToLang(this.props.translation[""], "Select Users:")} </span>
                        </Col>

                        <Col className="col-md-6 col-sm-6 col-xs-6">
                            <Select
                                value={this.state.selectedUsers}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}// showSearch={false}
                                mode="multiple"
                                labelInValue
                                maxTagCount={this.state.checkAllSelectedUsers ? 0 : 2}
                                maxTagTextLength={10}
                                maxTagPlaceholder={this.state.checkAllSelectedUsers ? "All Selected" : `${this.state.selectedUsers.length - 2} more`}
                                style={{ width: '100%' }}
                                onDeselect={(e) => this.handleDeselect(e, "users")}
                                placeholder={convertToLang(this.props.translation[""], "Select Users")}
                                onChange={this.handleChangeUser}
                            >
                                {(this.props.users_list && this.props.users_list.length > 0) ?
                                    <Select.Option key="allUsers" value="all">Select All</Select.Option>
                                    : <Select.Option key="" value="">Data Not Found</Select.Option>
                                }
                                {this.props.users_list.map(item => <Select.Option key={item.user_id} value={item.user_id} >{item.user_name}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <p>Users Selected: <span className="font_26">{(this.state.selectedUsers.length) ? this.state.selectedUsers.map(item => <Tag>{item.label}</Tag>) : "NOT SELECTED"}</span></p>


                    <Row gutter={24} className="">
                        {/* <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                        <span className=""> {convertToLang(this.props.translation[""], "Select Users:")} </span>
                    </Col> */}

                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Message")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('msg_txt', {
                                    initialValue: this.props.bulkMsg ? this.props.bulkMsg : '',
                                })(
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <Form.Item

                    label={convertToLang(this.props.translation[Name], "Name")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    validateStatus={this.state.validateStatus}
                    help={this.state.help}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.user ? this.props.user.user_name : '',
                        rules: [
                            {
                                required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is Required"),
                            }
                        ],
                    })(
                        <Input onChange={(e) => this.handleNameValidation(e)} />
                    )}
                </Form.Item>
                <Form.Item

                    label={convertToLang(this.props.translation[Email], "Email")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.user ? this.props.user.email : '',
                        rules: [{
                            type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], "The input is not valid E-mail!"),
                        },
                        {
                            required: true, message: convertToLang(this.props.translation[Required_Email], "Email is Required!"),
                        }],
                    })(
                        <Input onChange={(e) => this.check} />
                    )}
                </Form.Item> */}

                    <FilterDevices
                        devices={this.state.filteredDevices}
                        selectedDealers={this.state.selectedDealers}
                        selectedUsers={this.state.selectedUsers}
                        handleActionValue={this.state.selectedAction}
                        bulkSuspendDevice={this.props.bulkSuspendDevice}
                        bulkActivateDevice={this.props.bulkActivateDevice}
                        selectedPushAppsList={this.props.selectedPushAppsList}
                        selectedPullAppsList={this.props.selectedPullAppsList}
                        applyPushApps={this.props.applyPushApps}
                        applyPullApps={this.props.applyPullApps}
                        renderList={this.renderList}
                        translation={this.props.translation}
                        onChangeTableSorting={this.handleTableChange}
                        selectedDevices={this.props.selectedDevices}
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        unlinkBulkDevices={this.props.unlinkBulkDevices}
                        wipeBulkDevices={this.props.wipeBulkDevices}
                        bulkApplyPolicy={this.props.applyBulkPolicy}
                        selectedPolicy={this.state.selectedPolicy}
                    />

                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[""], "SEND")} </Button>
                    </Form.Item>

                </Form>
                <BulkSendMsgConfirmation
                    ref="bulk_msg"
                    sendMsgOnDevices={this.props.sendMsgOnDevices}
                    translation={this.props.translation}
                />
            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddUserForm);
export default WrappedAddDeviceForm;