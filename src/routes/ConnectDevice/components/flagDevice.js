import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form } from 'antd';
// import EditForm from './editForm';
// let editDevice;
export default class FlagDevice extends Component {

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

    showModel = (device, func) => {
        // console.log('device Detail', device)
        // alert('its working')
        // editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,

        });

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.state.func(this.state.device, this.refs.option.state.value)
        this.props.go_back();
        this.props.getDevice();
    }


    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;
        // console.log("Comming ", this.props);
        return (
            <div>
                <Modal
                    visible={visible}
                    title="Flag Device"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="Flag Device"
                >

                    <Form onSubmit={this.handleSubmit} autoComplete="new-password">

                        <Form.Item className="edit_ftr_btn"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Radio.Group ref='option' defaultValue="Stolen" buttonStyle="solid">
                                <Radio.Button value="Stolen">Stolen</Radio.Button>
                                <Radio.Button value="Lost">Lost</Radio.Button>
                                <Radio.Button value="Defective">Defective</Radio.Button>
                                <Radio.Button value="Other">Other</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className="edit_ftr_btn"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={this.handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}