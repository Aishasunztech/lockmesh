import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider, InputNumber } from "antd";

import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm } from '../../../constants/ButtonConstants';
import {  WARNING } from '../../../constants/Constants';

const confirm = Modal.confirm;

class BitCoinForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      focused: 'number',
      expiryInput: '',
    }
  }

  cancelBitCoinModal = () => {
    this.props.showBitCoinModal(false);
    this.props.form.resetFields();

    this.setState({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      focused: 'number',
      expiryInput: '',
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {alert('asa')
        showConfirm(this, <span>Are you sure you want to purchase <strong> "{this.props.credits} Credits"</strong> from <strong>"CREDIT CARD"</strong> ?'</span>, values, this.props.creditInfo)
      }
    });
  }

  render() {
    return (
      <Modal
        // closable={false}
        maskClosable={false}
        style={{ top: 50 }}
        width="600px"
        title="BitCoin Information"
        visible={this.props.bitCoinModal}
        footer={false}
        okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
        onOk={() => {
        }}
        onCancel={(e) => {
          this.cancelBitCoinModal()
        }
        }
      >
        <Form style={{ marginTop: 20 }} onSubmit={this.handleSubmit} autoComplete="new-password">
          <Form.Item className="edit_ftr_btn11"
                     wrapperCol={{
                       xs: { span: 24, offset: 0 },
                       sm: { span: 24, offset: 0 },
                     }}
          >
            <Button key="back" type="button" onClick={(e) => { this.cancelBitCoinModal() }} >Cancel</Button>
            <Button type="primary" htmlType="submit">Check Out</Button>
          </Form.Item>
        </Form>

      </Modal >
    )
  }
}



BitCoinForm = Form.create()(BitCoinForm);
export default BitCoinForm;


function showConfirm(_this, msg, values, creditInfo) {
  confirm({
    title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
    content: msg,
    okText:  convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
    cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
    onOk() {
      _this.props.purchaseCreditsFromBTC(values, creditInfo)
      _this.props.cancelPurchaseModal()
      _this.cancelBitCoinModal()
    },
    onCancel() {

    },
  });
}
