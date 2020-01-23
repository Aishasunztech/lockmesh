import React from 'react';
import { Form, Input, Button } from "antd";

const { TextArea } = Input;

const Reply = (props) => {

  function handleSubmit(event){
    event.preventDefault();
    props.form.validateFields((error, values) => {
      if(!error){
        values.user       = props.user;
        values.ticket_id  = props.ticket._id;

        props.supportTicketReply(values);
        props.form.resetFields();
      }
    })
  }

  return (
    <div ref={props.formId}><Form autoComplete="new-password" onSubmit={handleSubmit}>
    <Form.Item style={{padding: '24px'}} wrapperCol={{ span: 12 }}>
      {props.form.getFieldDecorator('description', {
        rules: [
          {
            required: true,
            message: 'Description is required',
          }
        ],
      })(
        <TextArea placeholder='Reply' autosize={{ minRows: 5, maxRows: 5 }}/>
      )}
    </Form.Item>
    <Form.Item wrapperCol={{ span: 12 }}>
      <Button style={{float: 'right'}} type="primary" htmlType="submit" className="login-form-button">
        Reply
      </Button>
    </Form.Item>
    </Form></div>);

};

export default Form.create({'name': 'ticket_reply'})(Reply);
