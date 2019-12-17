import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
import ResetPinForm from './ResetPinForm';

export default class WipeDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  showModel = () => {
    this.setState({
      visible: true,
    });
  };


  handleCancel = () => {
    this.setState({ visible: false });
    this.refs.pswdForm.resetFields()
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Modal
          width="400px"
          maskClosable={false}
          visible={visible}
          title=""
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="reset_pin_modal"
        >

          <ResetPinForm
            chatId={this.props.chatId}
            handleCancel={this.handleCancel}
            ref='pswdForm'
            resetChatPin={this.props.resetChatPin}
            translation={this.props.translation}
          />
        </Modal>
      </div>
    )
  }
}
