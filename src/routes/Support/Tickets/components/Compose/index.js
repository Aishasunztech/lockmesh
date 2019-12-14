import React from "react";
import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from "antd";
import Moment from "moment";
import {DEVICE_PRE_ACTIVATION} from "../../../../../constants/Constants";
const {TextArea} = Input;

const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class ComposeMail extends React.Component {
  constructor() {
    super();
    this.state = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      message: '',
    }
  }

  render() {
    const {onMailSend, onClose, user} = this.props;
    const {to, subject, message} = this.state;
    return (
      <Modal onCancel={onClose} visible={this.props.open}
             title='Generate Ticket'
             closable={false}
             onOk={() => {
               if (to === '')
                 return;
               onClose();
               onMailSend(
                 {
                   'id': '15453a06c08fb021776',
                   'from': {
                     'name': user.name,
                     'avatar': user.avatar,
                     'email': user.email
                   },
                   'to': [
                     {
                       'name': to,
                       'email': to
                     }
                   ],
                   'subject': subject,
                   'message': message,
                   'time': Moment().format('DD MMM'),
                   'read': false,
                   'starred': false,
                   'important': false,
                   'hasAttachments': false,
                   'folder': 1,
                   'selected': false,
                   'labels': [],
                 })

             }}
             style={{zIndex: 2600}}>
        <Form onSubmit={this.handleSubmit} autoComplete="new-password">

          <Form.Item
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
          </Form.Item>

          <Form.Item
            label="Dealer/Sdealer"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            width='100%'
          >
            {this.props.form.getFieldDecorator('dealer', {
              initialValue: '',
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={(e) => this.handleDealerChange(e)}
              >
                <Select.Option value=''>ALL</Select.Option>
                <Select.Option value={this.props.user.dealerId} key={this.props.user.dealerId}>My Report</Select.Option>
                {this.props.dealerList.map((dealer, index) => {
                  return (<Select.Option key={dealer.dealer_id} value={dealer.dealer_id}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Devices"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            width='100%'
          >
            {this.props.form.getFieldDecorator('device', {
              initialValue: '',
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                <Select.Option value=''>ALL</Select.Option>
                <Select.Option value={DEVICE_PRE_ACTIVATION}>{DEVICE_PRE_ACTIVATION}</Select.Option>
                {this.state.deviceList.map((device, index) => {
                  return (<Select.Option key={device.device_id} value={device.device_id}>{device.device_id}</Select.Option>)
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="FROM (DATE) "
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            {this.props.form.getFieldDecorator('from', {
              rules: [
                {
                  required: false
                }],
            })(
              <DatePicker
                format="DD-MM-YYYY"
                disabledDate={this.disabledDate}
              />
            )}
          </Form.Item>

          <Form.Item
            label="TO (DATE)"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            {this.props.form.getFieldDecorator('to', {
              rules: [
                {
                  required: false
                }],
            })(
              <DatePicker
                format="DD-MM-YYYY"
                onChange={this.saveExpiryDate}
                disabledDate={this.disabledDate}

              />
            )}
          </Form.Item>
          <Form.Item className="edit_ftr_btn"
                     wrapperCol={{
                       xs: { span: 24, offset: 0 },
                     }}
          >
            <Button key="back" type="button" onClick={this.handleReset}>CANCEL</Button>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>GENERATE</Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
Form.create()(ComposeMail);
export default ComposeMail;
