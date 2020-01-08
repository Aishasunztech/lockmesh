import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal } from 'antd';
import { checkValue, convertToLang, checkTimezoneValue, convertTimezoneValue } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import FilterDevices from './filterDevices'
import BulkSendMsgConfirmation from './bulkSendMsgConfirmation';
// import RepeatMsgCalender from './repeateMsgCalender';
import moment from 'moment';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error
const { TextArea } = Input;


class SendMsgForm extends Component {

    constructor(props) {
        super(props);

        this.durationList = [
            { key: 'NONE', value: "NONE" },
            { key: 'DAILY', value: "Daily" },
            { key: 'WEEKLY', value: "Weekly" },
            { key: 'MONTHLY', value: "Monthly" },
            { key: '3 MONTHS', value: "3 Months" },
            { key: '6 MONTHS', value: "6 Months" },
            { key: '12 MONTHS', value: "12 Months" },
        ];

        this.weekDays = [
            { key: 1, value: "Monday" },
            { key: 2, value: "Tuesday" },
            { key: 3, value: "Wednesday" },
            { key: 4, value: "Thursday" },
            { key: 5, value: "Friday" },
            { key: 6, value: "Saturday" },
            { key: 7, value: "Sunday" },
        ];

        this.monthNames = [
            { key: 1, value: "January" },
            { key: 2, value: "February" },
            { key: 3, value: "March" },
            { key: 4, value: "April" },
            { key: 5, value: "May" },
            { key: 6, value: "June" },
            { key: 7, value: "July" },
            { key: 8, value: "August" },
            { key: 9, value: "September" },
            { key: 10, value: "October" },
            { key: 11, value: "November" },
            { key: 12, value: "December" },
        ];

        this.monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

        this.state = {
            visible: false,
            filteredDevices: [],
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            allUsers: [],
            allDealers: [],
            selectedAction: 'NONE',
            selected_dateTime: null,
            selected_Time: '',
            isNowSet: false,
            repeat_duration: 'NONE',
            timer: '',
            monthDate: 0,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log("handle submit ", this.props.selectedDevices, this.state.selectedDealers, this.state.selectedUsers);
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {

                if (this.props.selectedDevices && this.props.selectedDevices.length) {
                    let repeatVal = 'NONE';
                    let dateTimeVal = '';

                    if (this.state.timer === "NOW") {
                        // dateTimeVal = '' //moment().format('YYYY-MM-DD HH:mm:ss');
                        // repeatVal = "NONE";
                    } else if (this.state.timer === "DATE/TIME") {
                        dateTimeVal = this.state.selected_dateTime;
                        // repeatVal = "NONE";
                    } else if (this.state.timer === "REPEAT") {
                        // dateTimeVal = this.state.selected_dateTime;
                        repeatVal = this.state.repeat_duration;


                        // covert time to dateTime value
                        if (this.state.selected_Time) {
                            let dealerTZ = checkTimezoneValue(this.props.user.timezone, false); // withGMT = false

                            const [hours, minutes] = this.state.selected_Time.split(':');
                            dateTimeVal = moment().tz(dealerTZ).set({ hours, minutes }).format('YYYY-MM-DD HH:mm:ss');
                        }
                    }

                    let data = {
                        devices: this.props.selectedDevices,
                        dealers: this.state.selectedDealers,
                        users: this.state.selectedUsers,
                        msg: values.msg_txt,
                        timer: values.timer,
                        repeat: repeatVal,
                        dateTime: convertTimezoneValue(this.props.user.timezone, dateTimeVal, TIMESTAMP_FORMAT, true),
                        weekDay: values.weekDay ? values.weekDay : 0,
                        monthDate: values.monthDate ? values.monthDate : 0,
                        monthName: values.monthName ? values.monthName : 0,
                        time: this.state.selected_Time,
                    }
                    // console.log("data ", data);
                    this.refs.bulk_msg.handleBulkSendMsg(data);
                } else {
                    error({
                        title: `Sorry, You have not any device to perform an action, to add devices please select dealers/users`,
                    });
                }
            }

        });
    }
    // handleNameValidation = (event) => {
    //     var fieldvalue = event.target.value;

    //     if (fieldvalue === '') {
    //         this.setState({
    //             validateStatus: 'error',
    //             help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
    //         })
    //     }
    //     if (/[^A-Za-z \d]/.test(fieldvalue)) {
    //         this.setState({
    //             validateStatus: 'error',
    //             help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
    //         })
    //     }
    //     else {
    //         this.setState({
    //             validateStatus: 'success',
    //             help: null,
    //         })
    //     }
    // }

    componentWillReceiveProps(nextProps) {

        if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
            // console.log('componentWillReceiveProps ', nextProps.devices)
            this.setState({
                filteredDevices: nextProps.devices,
                dealerList: this.props.dealerList
            })
        }

        // console.log("nextProps.users_list && nextProps.dealerList ", nextProps.users_list, nextProps.dealerList)
        if (nextProps.users_list && nextProps.dealerList) {
            let allDealers = nextProps.dealerList.map((item) => {
                return ({ key: item.dealer_id, label: item.dealer_name })
            });

            let allUsers = nextProps.users_list.map((item) => {
                return ({ key: item.user_id, label: item.user_name })
            });
            this.setState({ allUsers, allDealers })
        }
    }

    componentDidMount() {

        // this.props.getAllDealers();
        // this.props.getUserList();

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
        this.setState({
            selectedDealers: [],
            selectedUsers: []
        })
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    handleChangeUser = (values) => {
        let checkAllUsers = this.state.checkAllSelectedUsers
        let selectAll = values.filter(e => e.key === "all");
        let selectedUsers = values.filter(e => e.key !== "all");

        if (selectAll.length > 0) {
            checkAllUsers = !this.state.checkAllSelectedUsers;
            if (this.state.checkAllSelectedUsers) {
                selectedUsers = [];
            } else {
                selectedUsers = this.state.allUsers;
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
        let checkAllDealers = this.state.checkAllSelectedDealers
        let selectAll = values.filter(e => e.key === "all");
        let selectedDealers = [];

        if (selectAll.length > 0) {
            checkAllDealers = !this.state.checkAllSelectedDealers;
            if (this.state.checkAllSelectedDealers) {
                selectedDealers = [];
            } else {
                selectedDealers = this.state.allDealers
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
            dealers: selectedDealers,
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
        // console.log("e value is: ", e)

        this.setState({
            selectedAction: e,
            errorAction: ""
        });

    }

    onPanelChange = (value, mode) => {
        // console.log("hi ", value, mode);
    }

    dateTimeOnChange = (value, dateString) => {
        this.setState({ selected_dateTime: dateString });
    }

    timeOnChange = (value, dateString) => {
        this.setState({ selected_Time: dateString });
    }

    repeatHandler = (e) => {
        // console.log("e is: ", e);
        this.setState({ repeat_duration: e });
    }

    handleTimer = (e) => {
        // console.log("e is: ", e);
        this.setState({ timer: e });
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledDate = (current) => {
        // console.log("current date: ", current);
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    disabledDateTime = () => {
        // return {
        //     disabledHours: () => this.range(0, 24).splice(4, 20),
        //     disabledMinutes: () => this.range(30, 60),
        //     disabledSeconds: () => [55, 56],
        // };
    }

    validateRepeater = async (rule, value, callback) => {
        // console.log("values: ", value)
        if (value === 'NONE') {
            callback("Timer value should not be NONE")
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                    <Row gutter={24} className="mt-4">
                        <Col className="col-md-12 col-sm-12 col-xs-12">
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
                    {(this.state.selectedDealers && this.state.selectedDealers.length && !this.state.checkAllSelectedDealers) ?
                        <p>Dealers/S-Dealers Selected: <span className="font_26">{this.state.selectedDealers.map((item, index) => <Tag key={index}>{item.label}</Tag>)}</span></p>
                        : null}
                    <Row gutter={24} className="mt-4">
                        <Col className="col-md-12 col-sm-12 col-xs-12">
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
                    {(this.state.selectedUsers && this.state.selectedUsers.length && !this.state.checkAllSelectedUsers) ?
                        <p>Users Selected: <span className="font_26">{this.state.selectedUsers.map(item => <Tag>{item.label}</Tag>)}</span></p>
                        : null}

                    <Row gutter={24} className="mt-4">
                        <Col className="col-md-12 col-sm-12 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Message")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('msg_txt', {
                                    initialValue: '',
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
                    <Row gutter={24} className="mt-4">
                        <Col className="col-md-12 col-sm-12 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select Message Timer")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('timer', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true, message: convertToLang(this.props.translation[""], "Timer field is required"),
                                        }
                                    ],
                                })(
                                    <Select
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        placeholder={convertToLang(this.props.translation[""], "Select Message Timer")}
                                        onChange={this.handleTimer}
                                    >
                                        <Select.Option key={"NOW"} value={"NOW"}>{"NOW"}</Select.Option>
                                        <Select.Option key={"DATE/TIME"} value={"DATE/TIME"}>{"Date/Time"}</Select.Option>
                                        <Select.Option key={"REPEAT"} value={"REPEAT"}>{"Repeat"}</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    {this.state.timer === "REPEAT" ?
                        <Row gutter={24} className="mt-4">
                            <Col className="col-md-12 col-sm-12 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Select when to send Message")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('repeat', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[""], "Repeat Message field is required"),
                                            },
                                            {
                                                validator: this.validateRepeater,
                                            },
                                        ],
                                    })(
                                        <Select
                                            showSearch={false}
                                            style={{ width: '100%' }}
                                            placeholder={convertToLang(this.props.translation[""], "Select when to send Message")}
                                            onChange={this.repeatHandler}
                                        >
                                            {this.durationList.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        : null}

                    {this.state.repeat_duration !== "NONE" && this.state.timer === "REPEAT" ?
                        <Fragment>
                            {this.state.repeat_duration === "WEEKLY" ?
                                <Row gutter={24} className="mt-4">
                                    <Col className="col-md-12 col-sm-12 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select Day")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('weekDay', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Day is Required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch={false}
                                                    style={{ width: '50%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select Day")}
                                                // onChange={this.handleStartDay}
                                                >
                                                    {this.weekDays.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                : null}

                            {this.state.repeat_duration === "12 MONTHS" ?
                                <Row gutter={24} className="mt-4">
                                    <Col className="col-md-12 col-sm-12 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select Month")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('monthName', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Month is Required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch={false}
                                                    style={{ width: '50%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select Month")}
                                                // onChange={this.handleStartDay}
                                                >
                                                    {this.monthNames.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                : null}
                            {this.state.repeat_duration !== "DAILY" && this.state.repeat_duration !== "WEEKLY" ?
                                <Row gutter={24} className="mt-4">
                                    <Col className="col-md-12 col-sm-12 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select date of month")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('monthDate', {
                                                initialValue: "",
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Date of month is required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch={false}
                                                    style={{ width: '50%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select date of month")}
                                                // onChange={this.handleStartDay}
                                                >
                                                    {this.monthDays.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                : null}
                            {/* {this.state.repeat_duration === "DAILY" || this.state.repeat_duration === "WEEKLY" ? */}
                            <Row gutter={24} className="mt-4">
                                <Col className="col-md-12 col-sm-12 col-xs-12">
                                    <Form.Item
                                        label={convertToLang(this.props.translation[""], "Select Time")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('time', {
                                            initialValue: moment('00:00', 'HH:mm'),
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Time field is required"),
                                                }
                                            ],
                                        })(
                                            <TimePicker
                                                onChange={this.timeOnChange}
                                                placeholder={"Select time"}
                                                format="HH:mm"
                                                style={{ width: '50%' }}
                                            // defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* : null } */}
                        </Fragment>
                        : null}

                    {this.state.timer === "DATE/TIME" ?
                        <Row gutter={24} className="mt-4">
                            <Col className="col-md-12 col-sm-12 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Choose Data/Time")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('date/time', {
                                        initialValue: '', // moment(new Date(), 'YYYY-MM-DD')
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[""], "Date/Time field is required"),
                                            }
                                        ],
                                    })(
                                        <DatePicker
                                            // defaultValue={moment('2015/01/01', 'YYYY/MM/DD')}
                                            // defaultValue={moment()}
                                            // showToday={true}
                                            onChange={this.dateTimeOnChange}
                                            placeholder="Choose data/time"
                                            style={{ width: '100%' }}
                                            format="YYYY-MM-DD HH:mm"
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledDateTime}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        : null}

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
                        translation={this.props.translation}
                        onChangeTableSorting={this.handleTableChange}
                        selectedDevices={this.props.selectedDevices}
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        unlinkBulkDevices={this.props.unlinkBulkDevices}
                        wipeBulkDevices={this.props.wipeBulkDevices}
                        bulkApplyPolicy={this.props.applyBulkPolicy}
                        selectedPolicy={this.state.selectedPolicy}
                        renderList={this.props.renderList}
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