import React from "react";
import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from "antd";
import Moment from "moment";
import categories from "../../data/categories";
import priorities from "../../data/priorities";
import {ADMIN_ID, SDEALER} from "../../../../../constants/Constants";
const {TextArea} = Input;

class ComposeTicket extends React.Component {
  constructor() {
    super();
  }

  handleSubmit = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err){
        values.user = this.props.user;

        this.props.generateSupportTicket(values);
        this.props.onClose();
        this.props.form.resetFields()
      }

    });
  };

  render() {
    const { onClose, user, admin } = this.props;
    return (
      <Modal onCancel={onClose} visible={this.props.open}
             title='Generate Ticket'
             closable={false}
             onOk={() => {
               this.handleSubmit()
             }}
             style={{zIndex: 2600}}>
        <Form autoComplete="new-password">

          <Form.Item
            label="Subject"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {this.props.form.getFieldDecorator('subject', {
              rules: [
                {
                  required: true,
                  message: 'Subject is required',
                }],
            })(
              <Input
                placeholder='Enter Subject'
              />
            )}
          </Form.Item>

          <Form.Item
            label="Send To"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            width='100%'
          >
            {this.props.form.getFieldDecorator('receiver_id', {
              initialValue: '',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                <Select.Option key='1' value={JSON.stringify(admin)}><span className='text-capitalize'>Admin</span></Select.Option>
                {user.type === SDEALER ?
                  <Select.Option key='2' value={user.connected_dealer}><span className='text-capitalize'>Dealer</span></Select.Option>
                  : '' }
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Categories"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            width='100%'
          >
            {this.props.form.getFieldDecorator('category', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Category is required',
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
              >
                <Select.Option value=''>Select Category</Select.Option>
                {categories.filter(category => category.id !== 0).map((category, index) => {
                  return (<Select.Option key={category.id} value={category.handle}><span className='text-capitalize'>{category.title}</span></Select.Option>)
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Priorities"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            width='100%'
          >
            {this.props.form.getFieldDecorator('priority', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Priority is required',
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                <Select.Option value=''>Select Priority</Select.Option>

                {priorities.filter(priority => priority.id !== 0).map((priority, index) => {
                  return (<Select.Option key={priority.id} value={priority.handle}><span className='text-capitalize'>{priority.title}</span></Select.Option>)
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Description"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {this.props.form.getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: 'Description is required',
                }],
            })(
              <TextArea
                placeholder='Description'
              />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ComposeTicket);
