import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal } from 'antd';
import { checkValue, convertToLang, getMonthName, checkTimezoneValue, convertTimezoneValue, getWeekDayDescription, getWeekDays, getMonthNames, getDaysOfMonth } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import FilterDevices from './filterDevices'
import BulkUpdateMsgConfirmation from './bulkUpdateMsgConfirmation';
// import RepeatMsgCalender from './repeateMsgCalender';
import moment from 'moment';
import DataNotFound from '../../InvalidPage/dataNotFound';
import { TIMESTAMP_FORMAT, SERVER_TIMEZONE } from '../../../constants/Application';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error
const { TextArea } = Input;


class EditMsgForm extends Component {

    constructor(props) {
        super(props);

        this.durationList = [
            // { key: 'NONE', value: "NONE" },
            { key: 'DAILY', value: "Daily" },
            { key: 'WEEKLY', value: "Weekly" },
            { key: 'MONTHLY', value: "Monthly" },
            { key: '3 MONTHS', value: "3 Months" },
            { key: '6 MONTHS', value: "6 Months" },
            { key: '12 MONTHS', value: "12 Months" },
        ];

        // this.weekDays = [
        //     { key: 1, value: "Sunday" },
        //     { key: 2, value: "Monday" },
        //     { key: 3, value: "Tuesday" },
        //     { key: 4, value: "Wednesday" },
        //     { key: 5, value: "Thursday" },
        //     { key: 6, value: "Friday" },
        //     { key: 7, value: "Saturday" },
        // ];

        // this.monthNames = [
        //     { key: 1, value: "January" },
        //     { key: 2, value: "February" },
        //     { key: 3, value: "March" },
        //     { key: 4, value: "April" },
        //     { key: 5, value: "May" },
        //     { key: 6, value: "June" },
        //     { key: 7, value: "July" },
        //     { key: 8, value: "August" },
        //     { key: 9, value: "September" },
        //     { key: 10, value: "October" },
        //     { key: 11, value: "November" },
        //     { key: 12, value: "December" },
        // ];

        // this.monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
        let dealerTZ = checkTimezoneValue(props.user.timezone, false); // withGMT = false

        this.state = {
            weekDays: getWeekDays(),
            monthNames: getMonthNames(),
            monthDays: getDaysOfMonth(),
            visible: false,
            filteredDevices: [],
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            allUsers: [],
            allDealers: [],
            selectedAction: 'NONE',
            selected_Time: '',
            isNowSet: false,
            // timer: '',
            monthDate: 0,
            // editRecord: null,

            timer: '',
            selected_dateTime: null,

            repeat_duration: 'NONE',
            // date_time: '',
            time: '',
            week_day: 0,
            month_date: 0,
            month_name: 0,
            dealerTZ: dealerTZ
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // const { } = this.props.form;
        // console.log("handle submit ", this.props.selectedDevices, this.state.selectedDealers, this.state.selectedUsers);
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log("handle submit 02 ", values, this.props.editRecord)

            if (!err) {
                let dealerTZ = this.state.dealerTZ;
                let timerVal = values.timer;
                let repeatVal = 'NONE';
                let dateTimeVal = '';
                let timeVal = this.state.selected_Time;
                let weekDay = this.state.week_day ? this.state.week_day : 0;
                let monthDate = this.state.month_date ? this.state.month_date : 0;
                let monthName = this.state.month_name ? this.state.month_name : 0;
                let duration = 'N/A'; // update interval description text w.r.t timer status

                if (timerVal === "NOW") {
                    timeVal = '';
                    dateTimeVal = moment().tz(dealerTZ).format(TIMESTAMP_FORMAT);
                    weekDay = "";
                    monthDate = "";
                    monthName = "";
                    duration = `One Time`
                } else if (timerVal === "DATE/TIME") {
                    timeVal = '';
                    dateTimeVal = this.state.selected_dateTime;
                    weekDay = "";
                    monthDate = "";
                    monthName = "";
                    duration = `One Time`
                } else if (timerVal === "REPEAT") {
                    repeatVal = this.state.repeat_duration;
                    dateTimeVal = this.state.selected_dateTime;

                    let currentDateIs = moment().tz(dealerTZ).format(TIMESTAMP_FORMAT);
                    // covert time to dateTime value
                    if (this.state.selected_Time) {
                        const [hours, minutes] = this.state.selected_Time.split(':');

                        // conditions for Repeat Timer
                        if (repeatVal === "DAILY") {  // set minutes, hrs
                            weekDay = "";
                            monthDate = "";
                            monthName = "";
                            duration = `Everyday`;

                            dateTimeVal = moment().tz(dealerTZ).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                            if (dateTimeVal < currentDateIs) {
                                // next same week day if current date passed
                                dateTimeVal = moment().tz(dealerTZ).add(1, 'days').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                            }

                        } else if (repeatVal === "WEEKLY") { // set minutes, hrs and day name of week 
                            monthDate = "";
                            monthName = "";
                            duration = getWeekDayDescription(weekDay);
                            dateTimeVal = moment().tz(dealerTZ).day(weekDay).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                            if (dateTimeVal < currentDateIs) {
                                // next same week day if current date passed
                                dateTimeVal = moment().tz(dealerTZ).day(weekDay + 7).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                            }
                        } else if (repeatVal === "MONTHLY" || repeatVal === "3 MONTHS" || repeatVal === "6 MONTHS") {// set minutes, hrs and day of month 
                            weekDay = "";
                            monthName = "";
                            dateTimeVal = moment().tz(dealerTZ).set({ "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT)

                            if (dateTimeVal < currentDateIs) {
                                // set next months with same date if current date passed
                                if (repeatVal === "MONTHLY") {
                                    duration = `Every month on ${checkValue(monthDate)} date`;
                                    dateTimeVal = moment().tz(dealerTZ).add(1, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                }
                                else if (repeatVal === "3 MONTHS") {
                                    duration = `Every 3 months later on ${checkValue(monthDate)} date`;
                                    dateTimeVal = moment().tz(dealerTZ).add(3, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                }
                                else if (repeatVal === "6 MONTHS") {
                                    duration = `Every 6 months later on ${checkValue(monthDate)} date`;
                                    dateTimeVal = moment().tz(dealerTZ).add(6, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                }
                            }
                        } else if (repeatVal === "12 MONTHS") { // set minutes, hrs, day of month and name of month
                            weekDay = "";
                            duration = `Every ${getMonthName(monthName)} on ${checkValue(monthDate)} date`;
                            dateTimeVal = moment().tz(dealerTZ).set({ "month": monthName - 1, "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT);
                            // console.log("compare date: ", dateTimeVal < currentDateIs, dateTimeVal, currentDateIs, moment().month())

                            if (dateTimeVal < currentDateIs) {
                                // set next year with same date if current date passed 
                                dateTimeVal = moment().tz(dealerTZ).add(1, 'years').set({ "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT);
                            }
                        } else {
                            duration = "N/A"
                            dateTimeVal = moment().tz(dealerTZ).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                        }
                    }

                } else {
                    duration = "N/A"
                }

                let data = {
                    id: this.props.editRecord.id,
                    msg: values.msg_txt,
                    timer_status: timerVal,
                    repeat_duration: repeatVal,
                    date_time: convertTimezoneValue(this.props.user.timezone, dateTimeVal, TIMESTAMP_FORMAT, true), // convert time from client timezone to server timezone
                    week_day: weekDay,
                    month_date: monthDate,
                    month_name: monthName,
                    time: timeVal,
                    interval_description: duration
                }

                // console.log("copyEditRecord data ", data);
                this.refs.update_bulk_msg.handleBulkUpdateMsg(data, this.props.editRecord.devices, this.state.dealerTZ);

            }

        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editRecord && this.props.editRecord !== nextProps.editRecord) {
            this.setState({
                editRecord: nextProps.editRecord,
                msg: nextProps.editRecord.msg,
                repeat_duration: nextProps.editRecord.repeat_duration,
                timer: nextProps.editRecord.timer_status,
                selected_dateTime: moment(nextProps.editRecord.date_time).format(TIMESTAMP_FORMAT),
                selected_Time: moment(nextProps.editRecord.date_time).format("HH:mm"),
                week_day: nextProps.editRecord.week_day,
                month_date: nextProps.editRecord.month_date,
                month_name: nextProps.editRecord.month_name,
            })
        }
    }



    // componentDidMount() {
    //     this.setState({
    //         editRecord: this.props.editRecord,
    //     })
    // }

    handleReset = () => {
        this.props.form.resetFields();
        // this.state.editRecord.repeat_duration = 'NONE';
        // this.setState({ editRecord: this.state.editRecord })
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleEditMsgModal(false);
    }

    // dateTimeOnChange = (value, dateString) => {
    //     this.state.editRecord.date_time = dateString;
    //     this.setState({ editRecord: this.state.editRecord });
    // }
    dateTimeOnChange = (value, dateString) => {
        console.log("dateString ", dateString)
        this.setState({ selected_dateTime: dateString });
    }

    // timeOnChange = (value, dateString) => {
    //     const [hours, minutes] = dateString.split(':');
    //     let dateTimeVal = moment.tz(this.state.dealerTZ).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
    //     this.setState({ selected_Time: dateString, selected_dateTime: dateTimeVal });
    // }

    timeOnChange = (value, dateString) => {
        this.setState({ selected_Time: dateString });
    }

    handleEditMsgRecord = (e, fieldName) => {
        // let record = this.state.editRecord;
        // record[fieldName] = e;
        // console.log("record:", record);

        if (fieldName === 'month_name') {
            let getDays = getDaysOfMonth(e);
            this.props.form.setFieldsValue({ ["monthDate"]: '' }); // reset days of month
            this.setState({ [fieldName]: e, monthDays: getDays, monthDate: 0 });
        } else {
            this.setState({ [fieldName]: e });
        }
    }

    validateRepeater = async (rule, value, callback) => {
        // console.log("values: ", value)
        if (value === 'NONE') {
            callback("Please select repeat duration")
        }
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

        if (!editRecord) {
            return null // <DataNotFound />
        }
        // console.log("moment().set(copyEditRecord.time, 'HH:mm').format('YYYY-MM-DD HH:mm:ss') ",this.state.editRecord,  moment(new Date()).set("12:22", 'HH:mm').format('YYYY-MM-DD HH:mm:ss'))
        // let checkTime = convertTimezoneValue(this.props.user.timezone, this.state.selected_dateTime, "HH:mm");
        // console.log("edit msg checkTime:  ", checkTime, this.state.selected_dateTime, this.state.selected_Time, this.props.editRecord);
        // console.log("conditions render func: ", this.state.timer === "DATE/TIME", moment(this.state.selected_dateTime).format(TIMESTAMP_FORMAT) < moment().tz(this.state.dealerTZ).format(TIMESTAMP_FORMAT), moment(this.state.selected_dateTime, this.state.dealerTZ).format(TIMESTAMP_FORMAT), moment().tz(this.state.dealerTZ).format(TIMESTAMP_FORMAT))
        return (
            <div>
                <Modal
                    title={convertToLang(this.props.translation[""], "Edit Setting to send Message on devices")}
                    width={"500px"}
                    maskClosable={false}
                    style={{ top: 20 }}
                    visible={this.props.editModal}
                    // onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={false}
                >

                    <Form onSubmit={this.handleSubmit}>
                        <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                        <Row gutter={24} className="mt-4">
                            <Col className="col-md-12 col-sm-12 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Message")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('msg_txt', {
                                        initialValue: this.state.msg ? this.state.msg : '',
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
                                        initialValue: this.state.timer ? this.state.timer : '',
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
                                            onChange={(e) => this.handleEditMsgRecord(e, 'timer')}
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
                                            initialValue: this.state.repeat_duration ? this.state.repeat_duration : '',
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Repeat duration is required"),
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
                                                onChange={(e) => this.handleEditMsgRecord(e, 'repeat_duration')}
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
                                                    initialValue: this.state.week_day ? this.state.week_day : '',
                                                    rules: [
                                                        {
                                                            required: true, message: convertToLang(this.props.translation[""], "Day is Required"),
                                                        }
                                                    ],
                                                })(
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        showSearch={false}
                                                        placeholder={convertToLang(this.props.translation[""], "Select Day")}
                                                        onChange={(e) => this.handleEditMsgRecord(e, 'week_day')}
                                                    >
                                                        {this.state.weekDays.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
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
                                                    initialValue: this.state.month_name ? getMonthName(this.state.month_name) : '',
                                                    rules: [
                                                        {
                                                            required: true, message: convertToLang(this.props.translation[""], "Month is Required"),
                                                        }
                                                    ],
                                                })(
                                                    <Select
                                                        showSearch={false}
                                                        style={{ width: '100%' }}
                                                        placeholder={convertToLang(this.props.translation[""], "Select Month")}
                                                        onChange={(e) => this.handleEditMsgRecord(e, 'month_name')}
                                                    >
                                                        {this.state.monthNames.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
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
                                                    initialValue: this.state.month_date ? this.state.month_date : '',
                                                    rules: [
                                                        {
                                                            required: true, message: convertToLang(this.props.translation[""], "Date of month is required"),
                                                        }
                                                    ],
                                                })(
                                                    <Select
                                                        setFieldsValue={this.state.monthDate}
                                                        showSearch={false}
                                                        style={{ width: '100%' }}
                                                        placeholder={convertToLang(this.props.translation[""], "Select date of month")}
                                                        onChange={(e) => this.handleEditMsgRecord(e, 'month_date')}
                                                    >
                                                        {this.state.monthDays.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    : null}
                                <Row gutter={24} className="mt-4">
                                    <Col className="col-md-12 col-sm-12 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select Time")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('time', {
                                                initialValue: this.state.selected_Time ? moment(this.state.selected_Time, 'HH:mm') : '',
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
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
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
                                            initialValue: (this.state.selected_dateTime && this.state.selected_dateTime !== "0000-00-00 00:00:00") ? moment(this.state.selected_dateTime, 'YYYY-MM-DD HH:mm') : '',
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Date/Time field is required"),
                                                }
                                            ],
                                        })(
                                            <DatePicker
                                                onChange={this.dateTimeOnChange}
                                                placeholder="Choose data/time"
                                                style={{ width: '100%' }}
                                                format="YYYY-MM-DD HH:mm"
                                                disabledDate={this.disabledDate}
                                                disabledTime={this.disabledDateTime}
                                                showTime={{ defaultValue: moment('00:00'), format: 'HH:mm' }}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            : null}
                        <Form.Item className="edit_ftr_btn"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={this.state.timer === "DATE/TIME" && moment(this.state.selected_dateTime).format(TIMESTAMP_FORMAT) < moment().tz(this.state.dealerTZ).format(TIMESTAMP_FORMAT) ? true : false}
                            > {convertToLang(this.props.translation[""], "UPDATE")} </Button>
                        </Form.Item>

                    </Form>
                </Modal>
                <BulkUpdateMsgConfirmation
                    ref="update_bulk_msg"
                    updateBulkMsgAction={this.props.updateBulkMsgAction}
                    handleCancel={this.handleCancel}
                    translation={this.props.translation}
                />
            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(EditMsgForm);
export default WrappedAddDeviceForm;