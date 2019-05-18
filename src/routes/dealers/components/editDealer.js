import React, { Component } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
let func;
export default class editDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }


    showModal = (dealer, edit_func) => {
        func = edit_func
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
            dealer_name: dealer.dealer_name,
            dealer_email: dealer.dealer_email,
            link_code: dealer.link_code
        });
    }

    handleSubmit = (e) => {
        let formData = { 'dealer_id': this.state.dealer_id, 'name': this.state.dealer_name, 'email': this.state.dealer_email }
        e.preventDefault();

        let chcek = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        if ((this.state.dealer_name === '') || (chcek.test(this.state.dealer_email) == false)) {
            message.error('Invalid data');
        }

        else {

            func(formData);
            this.handleCancel();
        }
    }

    componentDidMount() {
        // console.log("editdealer", this.props);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Modal
                    visible={visible}
                    title="Edit Dealer"
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form >
                        <p>(*)- Required Fields</p>
                        <Form.Item
                            label="Name* "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            validateStatus={this.state.status}
                            help={this.state.help}
                        >
                            <Input autoComplete="new-password" type='text' value={this.state.dealer_name} onChange={(event) => this.setState({ dealer_name: event.target.value })} />

                        </Form.Item>
                        <Form.Item
                            label="Account Email* "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            validateStatus={this.state.status}
                            help={this.state.help}
                        >
                            <Input type='email' autoComplete="new-password" value={this.state.dealer_email} onChange={(event) => this.setState({ dealer_email: event.target.value })} />

                        </Form.Item>
                        <Form.Item
                            label="Dealer Pin "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            <Input value={this.state.link_code} disabled />

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
