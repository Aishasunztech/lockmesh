import React, { Component } from 'react';
import { Form,  Modal } from 'antd';
import { convertToLang } from '../../../utils/commonUtils'


class ViewMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      messageBody : null
    }
  }

  componentDidMount() {
    this.setState({messageBody: this.props.messageObject.message})
  }


  render() {
    return (
      <div>
        {this.state.messageBody}
      </div>
    )

  }
}

const WrappedAddDeviceForm = Form.create()(ViewMessage);
export default WrappedAddDeviceForm;
