import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal } from 'antd';
import { checkValue, convertToLang } from '../../../utils/commonUtils'
import { Button_Cancel, Button_submit } from '../../../../constants/ButtonConstants';
import { Required_Fields } from '../../../../constants/DeviceConstants';
import moment from 'moment';

const confirm = Modal.confirm;
const success = Modal.success;
const error   = Modal.error;
const { TextArea } = Input;


class SendMsgForm extends Component {

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
    this.props.form.validateFieldsAndScroll((err, values) => {

    });
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
      this.setState({
        filteredDevices: nextProps.devices,
        dealerList: this.props.dealerList
      })
    }


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
  };

  handleChange = (e) => {
    this.setState({ type: e.target.value });
  };

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

  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

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
      </div>
    )

  }
}

const WrappedAddDeviceForm = Form.create()(SendMsgForm);
export default WrappedAddDeviceForm;
