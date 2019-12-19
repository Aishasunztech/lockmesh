import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal } from 'antd';
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

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error
const { TextArea } = Input;


class EditMsgForm extends Component {

    constructor(props) {
        super(props);

        this.durationList = [
            { key: 'NONE', value: "NONE" },
            { key: 'DAILY', value: "Daily" },
            { key: 'WEEKLY', value: "Weekly" },
            { key: 'MONTHLY', value: "Monthly" },
            { key: '3 MONTHs', value: "3 Months" },
            { key: '6 MONTHs', value: "6 Months" },
            { key: '12 MONTHs', value: "12 Months" },
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
            repeat_duration: 'NONE',
            timer: '',
            editRecord: ''
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

                // if (this.props.selectedDevices && this.props.selectedDevices.length) {
                    let repeatVal = '';
                    let dateTimeVal = '';

                    if (this.state.timer === "NOW") {
                        dateTimeVal = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        repeatVal = "NONE";
                    } else if (this.state.timer === "DATE/TIME") {
                        dateTimeVal = this.state.selected_dateTime;
                        repeatVal = "NONE";
                    } else if (this.state.timer === "REPEAT") {
                        dateTimeVal = this.state.selected_dateTime;
                        repeatVal = this.state.repeat_duration;
                    }


                    let data = {
                        devices: this.props.selectedDevices,
                        dealers: this.state.selectedDealers,
                        users: this.state.selectedUsers,
                        msg: values.msg_txt,
                        repeat: repeatVal,
                        selected_date: dateTimeVal,
                        timer: values.timer,
                    }
                    console.log("data ", this.state.editRecord);
                    // this.refs.bulk_msg.handleBulkSendMsg(data);
                    // this.props.sendMsgOnDevices(data);
                // } else {
                //     error({
                //         title: `Sorry, You have not any device to perform an action, to add devices please select dealers/users`,
                //     });
                //     // this.setState({ errorTime: "" })
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

        if (this.props.editRecord != nextProps.editRecord) {
            // console.log('componentWillReceiveProps ', nextProps.devices)
            this.setState({
                editRecord: nextProps.editRecord,
                // dealerList: this.props.dealerList
            })
        }
    }

    componentDidMount() {

        // this.props.getAllDealers();
        // this.props.getUserList();

        this.setState({
            editRecord: this.props.editRecord,
            // dealerList: this.props.dealerList,
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
        this.state.editRecord.repeat_duration = 'NONE';
        this.setState({ repeat_duration: 'NONE' })
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleEditMsgModal(false);
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
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
        // let todayVal = false;
        // if (moment(dateString).format('YYYY-MM-DD HH:mm') === moment(new Date()).format('YYYY-MM-DD HH:mm')) {
        //     this.props.form.setFieldsValue({ repeat: 'NONE' });
        //     todayVal = true;
        // }
        this.state.editRecord.sending_time = dateString;
        this.setState({ editRecord: this.state.editRecord });
        // this.setState({ selected_dateTime: dateString });
    }

    repeatHandler = (e) => {
        console.log("e is: ", e);
        this.state.editRecord.repeat_duration = e;
        this.setState({ editRecord: this.state.editRecord });
    }

    handleTimer = (e) => {
        console.log("e is: ", e);
        this.state.editRecord.sending_time = e;
        this.setState({ editRecord: this.state.editRecord });
        // this.setState({ timer: e });
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledDate = (current) => {
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

    render() {
        var { editRecord } = this.state;
        console.log("editRecord ", editRecord);

        if (!editRecord) {
            return <h2>Data Not Found!</h2>
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                    <Row gutter={24} className="">
                        <Col className="col-md-12 col-sm-12 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Message")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('msg_txt', {
                                    initialValue: editRecord.msg ? editRecord.msg : '',
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
                        <Col className="col-md-12 col-sm-12 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select Message Timer")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {this.props.form.getFieldDecorator('timer', {
                                    initialValue: editRecord.timer_status ? editRecord.timer_status : '',
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

                    {editRecord.timer_status === "DATE/TIME" ?
                        <Row gutter={24} className="">
                            <Col className="col-md-12 col-sm-12 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Choose Data/Time")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('date/time', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[""], "Date/Time field is required"),
                                            }
                                        ],
                                    })(
                                        <DatePicker
                                            // defaultValue={editRecord.sending_time}
                                            onChange={this.dateTimeOnChange}
                                            placeholder="Choose data/time"
                                            style={{ width: '100%' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledDateTime}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        : null}

                    <br />
                    {editRecord.timer_status === "REPEAT" ?
                        <Fragment>
                            <Row gutter={24} className="">
                                <Col className="col-md-12 col-sm-12 col-xs-12">
                                    <Form.Item
                                        label={convertToLang(this.props.translation[""], "Select when to send Message")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('repeat', {
                                            initialValue: editRecord.repeat_duration,
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Repeat Message field is required"),
                                                }
                                            ],
                                        })(
                                            <Select
                                                showSearch={false}
                                                style={{ width: '100%' }}
                                                // disabled={this.state.isNowSet}
                                                placeholder={convertToLang(this.props.translation[""], "Select when to send Message")}
                                                onChange={this.repeatHandler}
                                            >
                                                {this.durationList.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* : null} */}

                            {/* {this.state.repeat_duration !== "NONE" && this.state.timer === "REPEAT" ? */}
                            <Row gutter={24} className="">
                                <Col className="col-md-12 col-sm-12 col-xs-12">
                                    <Form.Item
                                        label={convertToLang(this.props.translation[""], "Select any Time")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('time', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Time field is required"),
                                                }
                                            ],
                                        })(
                                            <TimePicker
                                                // defaultValue={editRecord.sending_time}
                                                onChange={this.dateTimeOnChange}
                                                placeholder={"Select any time"}
                                                // format="YYYY-MM-DD HH:mm:ss"
                                                style={{ width: '100%' }}
                                            // minuteStep={1}
                                            // defaultValue= {moment('0000-00-00', 'HH:mm:ss')}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Fragment>
                        : null}
                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[""], "UPDATE")} </Button>
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

const WrappedAddDeviceForm = Form.create()(EditMsgForm);
export default WrappedAddDeviceForm;