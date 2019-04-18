import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
// import EditForm from './editForm';
// let editDevice;
export default class WipeDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModel = (device, func, refreshDevice) => {
        // console.log('device Detail', device)
        // alert('its working')
        // editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,
            refreshDevice: refreshDevice

        });

    }
    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.state.func(this.state.device.usr_device_id, this.refs.option.state.value);
    //     this.setState({ visible: false });
    //     this.state.refreshDevice(this.state.device.device_id)
    // }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.checkPass({ password: this.refs.pass.state.value, device: this.props.device });
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;
        // const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal
                    width="330px"
                    visible={visible}
                    title=""
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="wipe_device"
                >

                    <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">

                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <h4>PANNEL PASSWORD <br />REQUIRED FOR<br /> THIS ACTION</h4>
                            <Input.Password ref='pass' className="password_field" type='password' required placeholder="Enter Password" />
                        </Form.Item>
                        <Form.Item className="edit_ftr_btn1"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}