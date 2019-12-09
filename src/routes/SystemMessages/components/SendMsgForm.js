import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import FilterDevices from './filterDevices'
import BulkSendMsgConfirmation from './bulkSendMsgConfirmation';
// import RepeatMsgCalender from './repeateMsgCalender';
import moment from 'moment';

const { TextArea } = Input;


class SendMsgForm extends Component {

    constructor(props) {
        super(props);

        this.durationList = [
            { key: 'NONE', value: "NONE" },
            // { key: 'NOW', value: "NOW" },
            { key: 'DAILY', value: "DAILY" },
            { key: 'WEEKLY', value: "WEEKLY" },
            { key: 'MONTHLY', value: "MONTHLY" },
            { key: 'YEARLY', value: "YEARLY" }
        ];

        this.state = {
            visible: false,
            filteredDevices: [],
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            allUsers: [],
            allDealers: [],
            selectedAction: 'NONE',
            selected_dateTime: '',
            isNowSet: false,
            repeat_duration: 'NONE'
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
                    msg: values.msg_txt,
                    repeat: this.state.isNowSet ? "NONE" : this.state.repeat_duration,
                    selected_date: this.state.selected_dateTime
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
        this.setState({ repeat_duration: 'NONE' })
    }


    handleCancel = () => {
        this.handleReset();
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


    handleChangeAction = (e) => {
        console.log("e value is: ", e)

        this.setState({
            selectedAction: e,
            errorAction: ""
        });

    }

    onPanelChange = (value, mode) => {
        console.log("hi ", value, mode);
    }

    dateTimeOnChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString, "current data: ", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        let todayVal = false;
        if (moment(dateString).format('YYYY-MM-DD HH:mm') === moment(new Date()).format('YYYY-MM-DD HH:mm')) {
            this.props.form.setFieldsValue({ repeat: 'NONE' });
            todayVal = true;
        }
        this.setState({ selected_dateTime: dateString, isNowSet: todayVal });
    }

    repeatHandler = (e) => {
        console.log("e is: ", e);

        this.setState({ repeat_duration: e });
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                    <Row gutter={24} className="">
                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
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
                                    placeholder={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                                    onChange={this.handleChangeDealer}
                                    onDeselect={(e) => this.handleDeselect(e, "dealers")}
                                >
                                    {(this.state.allDealers && this.state.allDealers.length > 0) ?
                                        <Select.Option key="allDealers" value="all">Select All</Select.Option>
                                        : <Select.Option key="" value="">Data Not Found</Select.Option>
                                    }
                                    {this.state.allDealers.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <br />
                    {(this.state.selectedDealers && this.state.selectedDealers.length && !this.state.checkAllSelectedDealers) ?
                        <p>Dealers/S-Dealers Selected: <span className="font_26">{this.state.selectedDealers.map(item => <Tag>{item.label}</Tag>)}</span></p>
                        : null}
                    <Row gutter={24} className="">
                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select Users")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
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
                                    {(this.state.allUsers && this.state.allUsers.length > 0) ?
                                        <Select.Option key="allUsers" value="all">Select All</Select.Option>
                                        : <Select.Option key="" value="">Data Not Found</Select.Option>
                                    }
                                    {this.state.allUsers.map(item => <Select.Option key={item.key} value={item.key} >{item.label}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <br />
                    {(this.state.selectedUsers && this.state.selectedUsers.length && !this.state.checkAllSelectedUsers) ?
                        <p>Users Selected: <span className="font_26">{this.state.selectedUsers.map(item => <Tag>{item.label}</Tag>)}</span></p>
                        : null}

                    <Row gutter={24} className="">
                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Message")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('msg_txt', {
                                    initialValue: this.props.bulkMsg ? this.props.bulkMsg : '',
                                    rules: [
                                        {
                                            required: true, message: convertToLang(this.props.translation[""], "Message field is required"),
                                        }
                                    ],
                                })(
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                )}
                            </Form.Item>
                        </Col>

                    </Row>
                    <br />
                    <Row gutter={24} className="">
                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select when to send Message")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {/* {this.props.form.getFieldDecorator('repeat', {
                                    initialValue: '',
                                })( */}
                                <Select
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    disabled={this.state.isNowSet}
                                    placeholder={convertToLang(this.props.translation[""], "Select when to send Message")}
                                    onChange={this.repeatHandler}
                                >
                                    {this.durationList.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                </Select>
                                {/* )} */}
                            </Form.Item>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={24} className="">
                        <Col className="col-md-9 col-sm-9 col-xs-9">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Choose specific date/time")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <DatePicker showTime placeholder="Select Date/Time" style={{ width: '100%' }} onChange={this.dateTimeOnChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <br />

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
                    handleCancel={this.handleCancel}
                    translation={this.props.translation}
                />
            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(SendMsgForm);
export default WrappedAddDeviceForm;